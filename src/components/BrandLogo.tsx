import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl font-extrabold',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Glowing Neon Brain Tree Root Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 rounded-xl blur-[6px] opacity-75"></div>
        <div className="relative w-full h-full rounded-xl bg-[#0d1424] border border-cyan-400/40 p-1.5 flex items-center justify-center shadow-inner overflow-hidden">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-cyan-400"
          >
            {/* Brain Canopy Outline */}
            <path
              d="M24 10C19 10 16 13 16 17C13 17 10 20 10 24C10 28 13 31 17 31C18 31 19 30 20 29.5V33C20 36 17 39 14 41M24 10C29 10 32 13 32 17C35 17 38 20 38 24C38 28 35 31 31 31C30 31 29 30 28 29.5V33C28 36 31 39 34 41"
              stroke="url(#brainTreeGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Tree Trunk & Deep Root Network */}
            <path
              d="M24 20V37M24 37C24 40 21 43 18 44M24 37C24 40 27 43 30 44M24 33L20 36M24 33L28 36"
              stroke="url(#rootGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Synapse Nodes & Star Accent */}
            <circle cx="24" cy="14" r="2" fill="#38bdf8" />
            <circle cx="16" cy="22" r="1.5" fill="#a78bfa" />
            <circle cx="32" cy="22" r="1.5" fill="#a78bfa" />
            <circle cx="20" cy="26" r="1.5" fill="#34d399" />
            <circle cx="28" cy="26" r="1.5" fill="#34d399" />
            {/* Gradients */}
            <defs>
              <linearGradient id="brainTreeGradient" x1="10" y1="10" x2="38" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="rootGradient" x1="24" y1="20" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-white ${textSizes[size]}`}>
            Brain<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">Root</span>
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-sm tracking-wider">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-cyan-300/80 font-medium tracking-wide mt-1">
            Grow Your Knowledge. Master Your Future.
          </span>
        )}
      </div>
    </div>
  );
};
