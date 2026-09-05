import React from 'react';

/**
 * LoadingScreen
 * Drop-in replacement for the loading branch in ProtectedRoute.
 *
 * Usage:
 *   if (loading) return <LoadingScreen />;
 */
export const LoadingScreen = ({ label = 'Verifying access' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen rounded-none bg-gray-50 dark:bg-slate-950">
      <style>{`
        @keyframes traceHex {
          0%   { stroke-dashoffset: 300; }
          60%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -300; }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.35); opacity: 1; }
        }
        @keyframes dotStep {
          0%, 20%  { opacity: 0.2; }
          50%      { opacity: 1; }
          100%     { opacity: 0.2; }
        }
      `}</style>

      <div className="flex flex-col items-center rounded-none">
        <svg width="88" height="88" viewBox="0 0 100 100">
          {/* faint static hexagon for structure */}
          <polygon
            points="50,6 90,28 90,72 50,94 10,72 10,28"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3"
          />
          {/* animated trace */}
          <polygon
            points="50,6 90,28 90,72 50,94 10,72 10,28"
            fill="none"
            stroke="#5EEAD4"
            strokeWidth="3"
            strokeLinecap="square"
            strokeDasharray="90 210"
            style={{ animation: 'traceHex 2.2s ease-in-out infinite' }}
          />
          {/* pulsing core */}
          <circle
            cx="50"
            cy="50"
            r="6"
            fill="#5EEAD4"
            style={{
              transformOrigin: '50px 50px',
              animation: 'corePulse 2.2s ease-in-out infinite',
            }}
          />
        </svg>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 tracking-wide">
          {label}
          <span style={{ display: 'inline-block', width: '1.6em', textAlign: 'left' }}>
            <span style={{ animation: 'dotStep 1.4s infinite', animationDelay: '0s' }}>.</span>
            <span style={{ animation: 'dotStep 1.4s infinite', animationDelay: '0.2s' }}>.</span>
            <span style={{ animation: 'dotStep 1.4s infinite', animationDelay: '0.4s' }}>.</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;