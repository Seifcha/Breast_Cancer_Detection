import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navigation from '../components/Navigation';
import { usePatients } from '../context/PatientContext';

interface FormData {
    patientName: string;
    patientId: string;
    reportDescription: string;
    image: File | null;
    selectedModel: 'softmax' | 'mlp' | 'both';
}

const AdvancedAnalysis = () => {
    const navigate = useNavigate();
    const { addPatient, getPatient, addReport } = usePatients();
    const [formData, setFormData] = useState<FormData>({
        patientName: '',
        patientId: '',
        reportDescription: '',
        image: null,
        selectedModel: 'both',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, image: 'Veuillez sélectionner une image (JPG, PNG, GIF) ou un fichier PDF' }));
                return;
            }

            setFormData(prev => ({ ...prev, image: file }));

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setImagePreview('pdf');
            }

            if (errors.image) {
                setErrors(prev => ({ ...prev, image: '' }));
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.patientName.trim()) {
            newErrors.patientName = 'Patient name is required';
        }
        if (!formData.patientId.trim()) {
            newErrors.patientId = 'Patient ID is required';
        }
        if (!formData.reportDescription.trim()) {
            newErrors.reportDescription = 'Report description is required';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Check if patient exists
            const existingPatient = getPatient(formData.patientId);
            if (!existingPatient) {
                addPatient({
                    id: formData.patientId,
                    name: formData.patientName,
                    age: 0,
                    lastVisit: new Date().toISOString().split('T')[0],
                });
            }

            // Call appropriate endpoint(s) based on selected model
            const results: any = {
                softmax: null,
                mlp: null,
            };

            // Softmax Model (DSO2)
            if (formData.selectedModel === 'softmax' || formData.selectedModel === 'both') {
                try {
                    const response = await fetch('http://localhost:5000/extract_and_predict', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ report_description: formData.reportDescription }),
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.status === 'success') {
                            results.softmax = result;
                        }
                    }
                } catch (err) {
                    console.error('Softmax model error:', err);
                }
            }

            // MLP Model (DSO3)
            if (formData.selectedModel === 'mlp' || formData.selectedModel === 'both') {
                try {
                    const response = await fetch('http://localhost:5000/extract_and_predict_mlp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ report_description: formData.reportDescription }),
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.status === 'success') {
                            results.mlp = result;
                        }
                    }
                } catch (err) {
                    console.error('MLP model error:', err);
                }
            }

            // Save report
            const reportId = `R${Date.now()}`;
            const prediction = results.softmax?.prediction.diagnosis || results.mlp?.prediction.diagnosis || 'Unknown';
            const confidence = results.softmax?.prediction.confidence || results.mlp?.prediction.confidence || 0;

            addReport(formData.patientId, {
                id: reportId,
                patientId: formData.patientId,
                date: new Date().toISOString().split('T')[0],
                description: formData.reportDescription,
                imageUrl: imagePreview || '',
                fileName: formData.image?.name || '',
                fileType: formData.image ? (formData.image.type.startsWith('image/') ? 'image' : 'pdf') : undefined,
                diagnosis: prediction,
                confidence: confidence,
            });

            // Navigate to advanced results page
            navigate('/advanced-results', {
                state: {
                    patientName: formData.patientName,
                    patientId: formData.patientId,
                    reportDescription: formData.reportDescription,
                    imagePreview: imagePreview,
                    selectedModel: formData.selectedModel,
                    results: results,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Une erreur est survenue lors du traitement.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300">
            <Sidebar />

            {/* Navigation */}
            <Navigation />

            <div className="ml-80 flex-1 p-8 pt-24">{/* Added pt-24 for navigation spacing */}
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-5xl font-black mb-3 text-white">
                                Analyse Avancée
                            </h1>
                            <p className="text-purple-200 flex items-center space-x-2 text-lg">
                                <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Comparaison de modèles ML et stratification du risque</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="glass-card px-6 py-3">
                                <p className="text-xs text-gray-900 uppercase tracking-wide font-bold mb-1">Modèles Disponibles</p>
                                <p className="text-sm font-bold text-indigo-600 flex items-center space-x-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400"></span>
                                    </span>
                                    <span>2 Modèles IA</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="max-w-5xl">
                    <div className="glass-card p-10 border-2 border-white/40">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">
                                    Analyse Multi-Modèles
                                </h2>
                                <p className="text-gray-500 text-sm">Choisissez un ou plusieurs modèles pour l'analyse</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Model Selection */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
                                <label htmlFor="selectedModel" className="label flex items-center space-x-2 mb-3">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                    </svg>
                                    <span className="text-lg font-bold text-gray-800">Sélection du Modèle</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className={`cursor-pointer ${formData.selectedModel === 'softmax' ? 'ring-4 ring-indigo-500' : ''}`}>
                                        <input
                                            type="radio"
                                            name="selectedModel"
                                            value="softmax"
                                            checked={formData.selectedModel === 'softmax'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 rounded-lg border-2 transition-all ${formData.selectedModel === 'softmax' ? 'border-indigo-500 bg-indigo-100' : 'border-gray-300 bg-white hover:border-indigo-300'}`}>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className={`w-4 h-4 rounded-full border-2 ${formData.selectedModel === 'softmax' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'}`}></div>
                                                <p className="font-bold text-gray-800">Softmax (DSO2)</p>
                                            </div>
                                            <p className="text-xs text-gray-600">Régression Softmax PyTorch</p>
                                            <p className="text-xs text-gray-500 mt-1">Prédiction binaire rapide</p>
                                        </div>
                                    </label>

                                    <label className={`cursor-pointer ${formData.selectedModel === 'mlp' ? 'ring-4 ring-purple-500' : ''}`}>
                                        <input
                                            type="radio"
                                            name="selectedModel"
                                            value="mlp"
                                            checked={formData.selectedModel === 'mlp'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 rounded-lg border-2 transition-all ${formData.selectedModel === 'mlp' ? 'border-purple-500 bg-purple-100' : 'border-gray-300 bg-white hover:border-purple-300'}`}>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className={`w-4 h-4 rounded-full border-2 ${formData.selectedModel === 'mlp' ? 'border-purple-500 bg-purple-500' : 'border-gray-400'}`}></div>
                                                <p className="font-bold text-gray-800">MLP (DSO3)</p>
                                            </div>
                                            <p className="text-xs text-gray-600">Multi-Layer Perceptron</p>
                                            <p className="text-xs text-gray-500 mt-1">Stratification du risque</p>
                                        </div>
                                    </label>

                                    <label className={`cursor-pointer ${formData.selectedModel === 'both' ? 'ring-4 ring-pink-500' : ''}`}>
                                        <input
                                            type="radio"
                                            name="selectedModel"
                                            value="both"
                                            checked={formData.selectedModel === 'both'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 rounded-lg border-2 transition-all ${formData.selectedModel === 'both' ? 'border-pink-500 bg-pink-100' : 'border-gray-300 bg-white hover:border-pink-300'}`}>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className={`w-4 h-4 rounded-full border-2 ${formData.selectedModel === 'both' ? 'border-pink-500 bg-pink-500' : 'border-gray-400'}`}></div>
                                                <p className="font-bold text-gray-800">Les Deux</p>
                                            </div>
                                            <p className="text-xs text-gray-600">Analyse comparative</p>
                                            <p className="text-xs text-gray-500 mt-1">Recommandé pour précision</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Patient Name */}
                            <div>
                                <label htmlFor="patientName" className="label flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Nom du Patient</span>
                                </label>
                                <input
                                    type="text"
                                    id="patientName"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleInputChange}
                                    className={`input-field ${errors.patientName ? 'border-red-500' : ''}`}
                                    placeholder="Entrez le nom complet du patient"
                                />
                                {errors.patientName && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{errors.patientName}</span>
                                    </p>
                                )}
                            </div>

                            {/* Patient ID */}
                            <div>
                                <label htmlFor="patientId" className="label flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                    <span>ID Patient</span>
                                </label>
                                <input
                                    type="text"
                                    id="patientId"
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleInputChange}
                                    className={`input-field ${errors.patientId ? 'border-red-500' : ''}`}
                                    placeholder="ex: P001"
                                />
                                {errors.patientId && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{errors.patientId}</span>
                                    </p>
                                )}
                            </div>

                            {/* Report Description */}
                            <div>
                                <label htmlFor="reportDescription" className="label flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Description du Rapport</span>
                                </label>
                                <textarea
                                    id="reportDescription"
                                    name="reportDescription"
                                    value={formData.reportDescription}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className={`input-field resize-none ${errors.reportDescription ? 'border-red-500' : ''}`}
                                    placeholder="Entrez les notes cliniques et observations détaillées..."
                                />
                                {errors.reportDescription && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{errors.reportDescription}</span>
                                    </p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label htmlFor="image" className="label">
                                    Upload Mammographie (Image ou PDF) (Optionnel)
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*,.pdf"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="image"
                                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all ${errors.image
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        {imagePreview ? (
                                            <div className="relative w-full h-full p-2">
                                                {imagePreview === 'pdf' ? (
                                                    <div className="flex flex-col items-center justify-center h-full">
                                                        <svg className="w-16 h-16 text-red-600 mb-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                        </svg>
                                                        <p className="text-sm font-semibold text-gray-700">Fichier PDF sélectionné</p>
                                                        <p className="text-xs text-gray-500 mt-1">{formData.image?.name}</p>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Aperçu"
                                                        className="w-full h-full object-contain rounded"
                                                    />
                                                )}
                                                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-600">
                                                    <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, JPEG, PDF (MAX. 10MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {errors.image && (
                                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Analyse en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            <span>Lancer l'Analyse Avancée</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedAnalysis;
