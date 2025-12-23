import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Logo from '../components/Logo';

interface AdvancedResultsState {
    patientName: string;
    patientId: string;
    reportDescription: string;
    imagePreview: string;
    selectedModel: 'softmax' | 'mlp' | 'both';
    results: {
        softmax: any;
        mlp: any;
    };
}

const AdvancedResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as AdvancedResultsState;

    useEffect(() => {
        if (!state || !state.patientName) {
            navigate('/advanced-analysis');
        }
    }, [state, navigate]);

    if (!state) {
        return null;
    }

    const renderSoftmaxResults = () => {
        if (!state.results.softmax) return null;

        const prediction = state.results.softmax.prediction;
        const isMalignant = prediction.class === 1;

        return (
            <div className="glass-card p-8 border-2 border-white/40">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white">Softmax Regression (DSO2)</h2>
                        <p className="text-purple-200 text-sm">Modèle PyTorch - Prédiction Binaire</p>
                    </div>
                </div>

                {/* Diagnosis */}
                <div className={`p-6 rounded-2xl mb-6 ${isMalignant
                        ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-400'
                        : 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-2 border-green-400'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/80 font-bold uppercase tracking-wide mb-2">Diagnostic</p>
                            <p className={`text-5xl font-black ${isMalignant ? 'text-red-400' : 'text-green-400'}`}>
                                {isMalignant ? 'MALIN' : 'BÉNIN'}
                            </p>
                            <p className="text-xs text-purple-200 mt-2">Classe: {prediction.class}</p>
                        </div>
                        <div className={`w-20 h-20 rounded-full ${isMalignant ? 'bg-red-500' : 'bg-green-500'} flex items-center justify-center shadow-2xl`}>
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                {isMalignant ? (
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                ) : (
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                )}
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Probabilities */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                        <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-2">Probabilité Bénin</p>
                        <p className="text-4xl font-black text-green-400 mb-3">
                            {(prediction.probability_class0 * 100).toFixed(2)}%
                        </p>
                        <div className="w-full bg-white/20 rounded-full h-3">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000"
                                style={{ width: `${prediction.probability_class0 * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                        <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-2">Probabilité Malin</p>
                        <p className="text-4xl font-black text-red-400 mb-3">
                            {(prediction.probability_class1 * 100).toFixed(2)}%
                        </p>
                        <div className="w-full bg-white/20 rounded-full h-3">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000"
                                style={{ width: `${prediction.probability_class1 * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Model Info */}
                <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-bold text-blue-300 mb-1">Confiance: {prediction.confidence.toFixed(1)}%</p>
                            <p className="text-xs text-purple-100">
                                Softmax Regression avec normalisation StandardScaler
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderMLPResults = () => {
        if (!state.results.mlp) return null;

        const prediction = state.results.mlp.prediction;
        const riskColor = prediction.color;
        const isMalignant = prediction.class === 1;

        return (
            <div className="glass-card p-8 border-2 border-white/40">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white">MLP Classifier (DSO3)</h2>
                        <p className="text-purple-200 text-sm">Multi-Layer Perceptron - Stratification du Risque</p>
                    </div>
                </div>

                {/* Risk Stratification */}
                <div className={`p-6 rounded-2xl mb-6 ${riskColor === 'red' ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-400' :
                        riskColor === 'orange' ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-2 border-orange-400' :
                            'bg-gradient-to-r from-green-500/20 to-green-600/20 border-2 border-green-400'
                    }`}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-white/80 font-bold uppercase tracking-wide mb-2">Niveau de Risque</p>
                            <p className={`text-5xl font-black ${riskColor === 'red' ? 'text-red-400' :
                                    riskColor === 'orange' ? 'text-orange-400' :
                                        'text-green-400'
                                }`}>
                                {prediction.risk_level_fr}
                            </p>
                            <p className="text-xs text-purple-200 mt-2">Score: {(prediction.risk_score * 100).toFixed(1)}%</p>
                        </div>
                        <div className={`w-20 h-20 rounded-full ${riskColor === 'red' ? 'bg-red-500' :
                                riskColor === 'orange' ? 'bg-orange-500' :
                                    'bg-green-500'
                            } flex items-center justify-center shadow-2xl`}>
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                {riskColor === 'red' ? (
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                ) : riskColor === 'orange' ? (
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                ) : (
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                )}
                            </svg>
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div className={`p-4 rounded-lg ${riskColor === 'red' ? 'bg-red-500/20' :
                            riskColor === 'orange' ? 'bg-orange-500/20' :
                                'bg-green-500/20'
                        }`}>
                        <p className="text-white font-bold mb-1">Recommandation</p>
                        <p className="text-sm text-purple-100">{prediction.recommendation_fr}</p>
                    </div>
                </div>

                {/* Probabilities */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                        <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-2">Probabilité Bénin</p>
                        <p className="text-4xl font-black text-green-400 mb-3">
                            {(prediction.probability_class0 * 100).toFixed(2)}%
                        </p>
                        <div className="w-full bg-white/20 rounded-full h-3">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000"
                                style={{ width: `${prediction.probability_class0 * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                        <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-2">Probabilité Malin</p>
                        <p className="text-4xl font-black text-red-400 mb-3">
                            {(prediction.probability_class1 * 100).toFixed(2)}%
                        </p>
                        <div className="w-full bg-white/20 rounded-full h-3">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000"
                                style={{ width: `${prediction.probability_class1 * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Model Info */}
                <div className="p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-bold text-purple-300 mb-1">Diagnostic: {prediction.diagnosis}</p>
                            <p className="text-xs text-purple-100">
                                Multi-Layer Perceptron avec normalisation StandardScaler
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/advanced-analysis')}
                        className="flex items-center space-x-2 text-purple-200 hover:text-white transition-colors mb-6 font-semibold"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Retour à l'Analyse Avancée</span>
                    </button>

                    <div className="flex items-center space-x-4 mb-4">
                        <Logo className="w-16 h-16" />
                        <div>
                            <h1 className="text-5xl font-black text-white mb-2">
                                Résultats de l'Analyse Avancée
                            </h1>
                            <p className="text-purple-200 text-lg font-medium">
                                Comparaison Multi-Modèles - {state.patientName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Softmax Results */}
                    {(state.selectedModel === 'softmax' || state.selectedModel === 'both') && renderSoftmaxResults()}

                    {/* MLP Results */}
                    {(state.selectedModel === 'mlp' || state.selectedModel === 'both') && renderMLPResults()}
                </div>

                {/* Patient Info & Clinical Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Patient Info */}
                    <div className="glass-card p-6 border-2 border-white/40">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-white">Patient</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-1">Nom</p>
                                <p className="text-lg font-bold text-white">{state.patientName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-1">ID</p>
                                <p className="text-lg font-bold text-white">{state.patientId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-1">Date</p>
                                <p className="text-lg font-bold text-white">
                                    {new Date().toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Notes */}
                    <div className="lg:col-span-2 glass-card p-6 border-2 border-white/40">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-white">Notes Cliniques</h3>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20 max-h-48 overflow-y-auto">
                            <p className="text-white leading-relaxed text-sm">{state.reportDescription}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 min-w-[200px] btn-secondary flex items-center justify-center space-x-3 text-lg py-4"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Imprimer le Rapport</span>
                    </button>
                    <button
                        onClick={() => navigate('/advanced-analysis')}
                        className="flex-1 min-w-[200px] btn-primary flex items-center justify-center space-x-3 text-lg py-4"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Nouvelle Analyse</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedResults;
