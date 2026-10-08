import React, { useState } from 'react';
import { getTeamLogoUrl, getTeamBrand } from '../utils/teamLogos';
import { Shield } from 'lucide-react';

export interface TeamLogoProps {
  teamId: string;
  teamName?: string;
  fallbackEmoji?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showGlow?: boolean;
}

const SIZE_MAP = {
  xs: { box: 'w-6 h-6', img: 'w-5 h-5', text: 'text-[10px]' },
  sm: { box: 'w-8 h-8', img: 'w-6 h-6', text: 'text-xs' },
  md: { box: 'w-11 h-11', img: 'w-9 h-9', text: 'text-sm' },
  lg: { box: 'w-14 h-14', img: 'w-11 h-11', text: 'text-base' },
  xl: { box: 'w-18 h-18 sm:w-20 sm:h-20', img: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-xl' },
  '2xl': { box: 'w-24 h-24 sm:w-28 sm:h-28', img: 'w-20 h-20 sm:w-24 sm:h-24', text: 'text-2xl' },
};

export const TeamLogo: React.FC<TeamLogoProps> = ({
  teamId,
  teamName = '',
  fallbackEmoji = '⚽',
  size = 'md',
  className = '',
  showGlow = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const logoInfo = getTeamLogoUrl(teamId, fallbackEmoji);
  const brand = getTeamBrand(teamId);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  const primaryColor = brand?.primaryColor || '#059669';
  const secondaryColor = brand?.secondaryColor || '#1e293b';
  const initials = brand?.initials || teamName.slice(0, 3).toUpperCase() || 'FC';

  if (logoInfo.isImage && !hasError) {
    return (
      <div
        className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105 ${sizeClasses.box} ${className}`}
      >
        {showGlow && (
          <div
            className="absolute inset-0 rounded-full blur-md opacity-25 pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-1 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 shadow-md">
          <img
            src={logoInfo.src}
            alt={teamName || brand?.nameAr || brand?.name || 'Club Logo'}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            loading="lazy"
            onError={() => setHasError(true)}
            className={`${sizeClasses.img} object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-opacity duration-300`}
          />
        </div>
      </div>
    );
  }

  // Graceful High-Quality SVG Shield Fallback with official club colors & monogram
  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105 ${sizeClasses.box} ${className}`}
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-2xl blur-md opacity-30 pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />
      )}
      <div
        className="relative z-10 w-full h-full rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 p-1"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}dd 0%, ${secondaryColor}ee 100%)`,
        }}
        title={teamName || brand?.nameAr || brand?.name}
      >
        {fallbackEmoji && fallbackEmoji !== '⚽' ? (
          <span className={`${sizeClasses.text} filter drop-shadow`}>{fallbackEmoji}</span>
        ) : (
          <>
            <Shield className="w-1/2 h-1/2 opacity-40 text-white absolute" />
            <span
              className={`relative z-10 font-black tracking-tight text-white drop-shadow font-mono ${sizeClasses.text}`}
              style={{ color: brand?.textColor || '#ffffff' }}
            >
              {initials}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
