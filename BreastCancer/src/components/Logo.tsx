const Logo = ({ className = "w-12 h-12" }: { className?: string }) => {
    return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Gradient Definitions */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
            </defs>

            {/* Outer Circle */}
            <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" opacity="0.1" />
            <circle cx="50" cy="50" r="48" stroke="url(#logoGradient)" strokeWidth="2" fill="none" />

            {/* Heart Shape */}
            <path
                d="M50 75 C35 65, 25 55, 25 45 C25 35, 30 30, 37.5 30 C42.5 30, 47.5 33, 50 38 C52.5 33, 57.5 30, 62.5 30 C70 30, 75 35, 75 45 C75 55, 65 65, 50 75 Z"
                fill="url(#heartGradient)"
            />

            {/* Medical Cross */}
            <rect x="47" y="40" width="6" height="20" fill="white" rx="1" />
            <rect x="40" y="47" width="20" height="6" fill="white" rx="1" />

            {/* Pulse Line */}
            <path
                d="M20 50 L35 50 L40 40 L45 60 L50 50 L55 50 L80 50"
                stroke="white"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Logo;
