import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Logo from '../components/Logo';

interface ResultsState {
  patientName: string;
  patientId: string;
  reportDescription: string;
  imagePreview: string;
  prediction: string;
  confidence: number;
  apiResponse?: {
    prediction: number;
    probability_class0: number;
    probability_class1: number;
  } | null;
  mlpResponse?: any; // Using any for flexibility, but follows the structure from AdvancedResults
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState;

  useEffect(() => {
    // Redirect to home if no data
    if (!state || !state.patientName) {
      navigate('/home');
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 text-purple-200 hover:text-white transition-colors mb-6 font-semibold"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour au Dashboard</span>
          </button>

          <div className="flex items-center space-x-4 mb-4">
            <Logo className="w-16 h-16" />
            <div>
              <h1 className="text-5xl font-black text-white mb-2">
                Résultats du Diagnostic IA
              </h1>
              <p className="text-purple-200 text-lg font-medium">Rapport d'analyse complet</p>
            </div>
          </div>
        </div>

        {/* Main Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* AI Analysis Card - Main Section */}
          <div className="lg:col-span-2">
            {state.apiResponse ? (
              <div className="glass-card p-8 border-2 border-white/40">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">Analyse IA - Résultats</h2>
                    <p className="text-purple-200 text-sm">Prédiction du modèle Softmax Regression (PyTorch)</p>
                  </div>
                </div>

                {/* Prediction Result */}
                <div className={`p-6 rounded-2xl mb-6 ${state.apiResponse.prediction === 1
                  ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-400'
                  : 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-2 border-green-400'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/80 font-bold uppercase tracking-wide mb-2">Diagnostic</p>
                      <p className={`text-5xl font-black ${state.apiResponse.prediction === 1 ? 'text-red-400' : 'text-green-400'
                        }`}>
                        {state.apiResponse.prediction === 0 ? 'BÉNIN' : 'MALIN'}
                      </p>
                      <p className="text-xs text-purple-200 mt-2">
                        Classe prédite: {state.apiResponse.prediction}
                      </p>
                    </div>
                    <div className={`w-20 h-20 rounded-full ${state.apiResponse.prediction === 1 ? 'bg-red-500' : 'bg-green-500'
                      } flex items-center justify-center shadow-2xl`}>
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        {state.apiResponse.prediction === 1 ? (
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        )}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Probabilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                    <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-2">Probabilité Bénin</p>
                    <p className="text-4xl font-black text-green-400 mb-3">
                      {(state.apiResponse.probability_class0 * 100).toFixed(2)}%
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000"
                        style={{ width: `${state.apiResponse.probability_class0 * 100}%` }}
                      >
                        <div className="h-full w-full bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                    <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-2">Probabilité Malin</p>
                    <p className="text-4xl font-black text-red-400 mb-3">
                      {(state.apiResponse.probability_class1 * 100).toFixed(2)}%
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000"
                        style={{ width: `${state.apiResponse.probability_class1 * 100}%` }}
                      >
                        <div className="h-full w-full bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Model Info */}

              </div>
            ) : (
              <div className="glass-card p-8 border-2 border-white/40">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">Diagnostic</h2>
                    <p className="text-purple-200 text-sm">Résultat de l'analyse</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border-2 border-yellow-400/50 rounded-xl p-6">
                  <p className="text-white font-bold mb-2">⚠️ Données API non disponibles</p>
                  <p className="text-purple-100 text-sm">
                    L'analyse a été effectuée mais les détails de l'API ne sont pas disponibles.
                    Veuillez vérifier que le serveur Flask est en cours d'exécution.
                  </p>
                  <div className="mt-4 p-4 bg-white/10 rounded-lg">
                    <p className="text-sm text-white mb-1">Diagnostic: <span className="font-bold">{state.prediction}</span></p>
                    <p className="text-sm text-white">Confiance: <span className="font-bold">{state.confidence.toFixed(1)}%</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* MLP Results Section (Risk Stratification) */}
            {state.mlpResponse && state.mlpResponse.prediction && (
              <div className="glass-card p-8 border-2 border-white/40 mt-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">Stratification du Risque</h2>
                    <p className="text-purple-200 text-sm">Analyse approfondie (Déclenchée car malin)</p>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl mb-6 ${state.mlpResponse.prediction.color === 'red' ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-400' :
                  state.mlpResponse.prediction.color === 'orange' ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-2 border-orange-400' :
                    'bg-gradient-to-r from-green-500/20 to-green-600/20 border-2 border-green-400'
                  }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-white/80 font-bold uppercase tracking-wide mb-2">Niveau de Risque</p>
                      <p className={`text-5xl font-black ${state.mlpResponse.prediction.color === 'red' ? 'text-red-400' :
                        state.mlpResponse.prediction.color === 'orange' ? 'text-orange-400' :
                          'text-green-400'
                        }`}>
                        {state.mlpResponse.prediction.risk_level_fr}
                      </p>
                      <p className="text-xs text-purple-200 mt-2">Score: {(state.mlpResponse.prediction.risk_score * 100).toFixed(1)}%</p>
                    </div>
                    <div className={`w-20 h-20 rounded-full ${state.mlpResponse.prediction.color === 'red' ? 'bg-red-500' :
                      state.mlpResponse.prediction.color === 'orange' ? 'bg-orange-500' :
                        'bg-green-500'
                      } flex items-center justify-center shadow-2xl`}>
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        {state.mlpResponse.prediction.color === 'red' ? (
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        ) : state.mlpResponse.prediction.color === 'orange' ? (
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        )}
                      </svg>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${state.mlpResponse.prediction.color === 'red' ? 'bg-red-500/20' :
                    state.mlpResponse.prediction.color === 'orange' ? 'bg-orange-500/20' :
                      'bg-green-500/20'
                    }`}>
                    <p className="text-white font-bold mb-1">Recommandation</p>
                    <p className="text-sm text-purple-100">{state.mlpResponse.prediction.recommendation_fr}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Patient Info Card */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-2 border-white/40">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white">Informations Patient</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-1">Nom</p>
                  <p className="text-lg font-bold text-white">{state.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-1">ID Patient</p>
                  <p className="text-lg font-bold text-white">{state.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-200 uppercase tracking-wide font-bold mb-1">Date</p>
                  <p className="text-lg font-bold text-white">{new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {state.imagePreview && state.imagePreview !== 'pdf' && (
              <div className="glass-card p-4 border-2 border-white/40">
                <p className="text-sm font-bold text-white uppercase tracking-wide mb-3">Image Analysée</p>
                <img
                  src={state.imagePreview}
                  alt="Mammographie"
                  className="w-full rounded-xl shadow-2xl border-2 border-white/20"
                />
              </div>
            )}

            {state.imagePreview === 'pdf' && (
              <div className="glass-card p-6 border-2 border-white/40">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white font-bold">Document PDF</p>
                  <p className="text-purple-200 text-sm">Analysé avec succès</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Report Description */}
        <div className="glass-card p-8 mb-6 border-2 border-white/40">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white">Notes Cliniques</h3>
          </div>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <p className="text-white leading-relaxed">{state.reportDescription}</p>
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
            onClick={() => navigate('/home')}
            className="flex-1 min-w-[200px] btn-primary flex items-center justify-center space-x-3 text-lg py-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Nouveau Diagnostic</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
