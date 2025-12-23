import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="fixed top-0 left-80 right-0 bg-white/90 backdrop-blur-md border-b-2 border-purple-200 z-50 shadow-lg">
            <div className="px-8 py-4">
                <nav className="flex items-center space-x-2">
                    <Link
                        to="/home"
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${isActive('/home')
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                            : 'bg-white text-gray-700 hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Diagnostic Standard</span>
                    </Link>

                    {/* <Link
                        to="/advanced-analysis"
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${isActive('/advanced-analysis') || isActive('/advanced-results')
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Analyse Avancée</span>
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-black">
                            Multi-Modèles
                        </span>
                    </Link> */}

                    <div className="flex-1"></div>

                    <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <span className="text-sm font-bold text-gray-700">3 Modèles IA Actifs</span>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Navigation;
