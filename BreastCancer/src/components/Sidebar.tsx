import { useState } from 'react';
import Modal from './Modal';
import Logo from './Logo';
import { usePatients, type Patient, type MedicalReport } from '../context/PatientContext';

const Sidebar = () => {
  const { patients, updatePatient, getPatientReports } = usePatients();
  const [activePatient, setActivePatient] = useState<string | null>(null);
  const [searchId, setSearchId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editForm, setEditForm] = useState({ name: '', age: 0 });

  // Filter patients by ID
  const filteredPatients = patients.filter(patient =>
    patient.id.toLowerCase().includes(searchId.toLowerCase())
  );

  const handleConsult = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedPatient) {
      setEditForm({ name: selectedPatient.name, age: selectedPatient.age });
      setIsModalOpen(false);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedPatient) {
      updatePatient(selectedPatient.id, {
        name: editForm.name,
        age: editForm.age,
        lastVisit: new Date().toISOString().split('T')[0],
      });
      setIsEditModalOpen(false);
      alert(`Patient ${editForm.name} modifié avec succès!`);
    }
  };

  return (
    <>
      <div className="w-80 bg-white border-r-4 border-purple-300 h-screen fixed left-0 top-0 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100">
          <div className="flex items-center space-x-3 mb-4">
            <Logo className="w-12 h-12" />
            <div>
              <h2 className="text-gray-900 font-black text-xl">MediCare AI</h2>
              <p className="text-purple-700 text-xs font-bold">Diagnostic Avancé</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 p-3 bg-white rounded-xl shadow-lg border-2 border-purple-200">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-900 font-bold">Dr. Smith</h3>
              <p className="text-purple-700 text-sm font-semibold">Oncologue</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b-2 border-purple-200 bg-purple-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm text-gray-900 placeholder-gray-500 shadow-sm font-medium"
            />
            <svg
              className="w-5 h-5 text-purple-500 absolute left-3 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchId && (
            <p className="text-xs text-purple-700 mt-2 font-bold">
              {filteredPatients.length} patient(s) trouvé(s)
            </p>
          )}
        </div>

        {/* Patient List */}
        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>PATIENTS</span>
            </h3>
            <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-black shadow-lg">
              {filteredPatients.length}
            </span>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600 font-semibold">Aucun patient trouvé</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-xl transition-all duration-300 cursor-pointer border-2 ${activePatient === patient.id
                    ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-500 shadow-xl'
                    : 'bg-white border-purple-200 hover:bg-purple-50 hover:border-purple-400 shadow-md hover:shadow-lg'
                    }`}
                  onClick={() => setActivePatient(patient.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-black text-lg text-gray-900">
                        {patient.name}
                      </h4>
                      <p className="text-sm text-purple-700 font-bold mt-1">ID: {patient.id}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs bg-purple-200 text-purple-900 px-3 py-1.5 rounded-lg font-black">
                          Âge: {patient.age} ans
                        </span>
                        {patient.status && (
                          <span className={`text-xs px-3 py-1.5 rounded-lg font-black ${patient.status === 'Malignant'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                            }`}>
                            {patient.status === 'Malignant' ? '⚠️ Malin' : '✓ Bénin'}
                          </span>
                        )}
                      </div>
                      {patient.riskLevel && (
                        <div className="mt-2">
                          <span className={`text-xs px-3 py-1.5 rounded-lg font-black ${patient.riskLevel === 'High'
                              ? 'bg-red-200 text-red-800'
                              : patient.riskLevel === 'Medium'
                                ? 'bg-orange-200 text-orange-800'
                                : 'bg-green-200 text-green-800'
                            }`}>
                            Risque: {
                              patient.riskLevel === 'High' ? 'Élevé' :
                                patient.riskLevel === 'Medium' ? 'Moyen' :
                                  'Faible'
                            }
                          </span>
                        </div>
                      )}
                    </div>
                    {activePatient === patient.id && (
                      <div className="ml-2">
                        <svg className="w-7 h-7 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 mb-3 font-bold">
                    Dernière visite: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('fr-FR') : 'Aucune'}
                  </p>

                  {/* Consulter Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConsult(patient);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-black py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>CONSULTER</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Dossier du patient ${selectedPatient?.id}`}
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Nom Complet
                </label>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {selectedPatient.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  ID Patient
                </label>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {selectedPatient.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Âge
                </label>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {selectedPatient.age} ans
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Dernière Visite
                </label>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {new Date(selectedPatient.lastVisit).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Medical History Section */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Historique Médical ({getPatientReports(selectedPatient.id).length} rapport(s))
              </h4>
              {getPatientReports(selectedPatient.id).length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Aucun historique médical disponible pour le moment.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Les rapports de diagnostic apparaîtront ici après analyse.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {getPatientReports(selectedPatient.id).map((report: MedicalReport) => (
                    <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${report.diagnosis === 'Malignant'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                              }`}>
                              {report.diagnosis === 'Malignant' ? 'Malin' : 'Bénin'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(report.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {report.description}
                          </p>
                        </div>
                        {report.fileType === 'image' ? (
                          <img
                            src={report.imageUrl}
                            alt="Rapport"
                            className="w-16 h-16 object-cover rounded ml-3"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-red-50 rounded ml-3 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">{report.fileName}</span>
                        <span className="text-xs font-semibold text-medical-blue-600">
                          Confiance: {report.confidence?.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Modifier</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Modifier le patient ${selectedPatient?.id}`}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Nom du Patient</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Âge</label>
            <input
              type="number"
              value={editForm.age}
              onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) })}
              className="input-field"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex-1 btn-primary"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
