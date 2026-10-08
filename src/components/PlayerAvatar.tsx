import React, { useState } from 'react';
import { getPlayerPhoto } from '../utils/playerPhotos';
import { User } from 'lucide-react';

export interface PlayerAvatarProps {
  playerId: string;
  playerName: string;
  playerNameAr?: string;
  number?: number;
  position?: 'GK' | 'DF' | 'MF' | 'FW';
  rating?: number;
  isCaptain?: boolean;
  photoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showNumber?: boolean;
  showRating?: boolean;
  teamPrimaryColor?: string;
}

const SIZE_CLASSES = {
  xs: { box: 'w-7 h-7', text: 'text-[9px]', badge: 'text-[8px] w-3.5 h-3.5' },
  sm: { box: 'w-9 h-9', text: 'text-[10px]', badge: 'text-[9px] w-4 h-4' },
  md: { box: 'w-12 h-12', text: 'text-xs', badge: 'text-[10px] w-5 h-5' },
  lg: { box: 'w-16 h-16', text: 'text-sm', badge: 'text-xs w-6 h-6' },
  xl: { box: 'w-20 h-20', text: 'text-base', badge: 'text-xs w-7 h-7' },
};

const POSITION_COLORS: Record<string, string> = {
  GK: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  DF: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  MF: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  FW: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
};

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  playerId,
  playerName,
  playerNameAr,
  number,
  position,
  rating,
  isCaptain,
  photoUrl,
  size = 'md',
  className = '',
  showNumber = true,
  showRating = false,
  teamPrimaryColor,
}) => {
  const [imgError, setImgError] = useState(false);
  const resolvedPhoto = photoUrl || getPlayerPhoto(playerId, playerName, position);
  const sizeConfig = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const initials = playerName
    ? playerName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'PL';

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {/* Avatar Container */}
      <div
        className={`relative ${sizeConfig.box} rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700/80 shadow-md flex items-center justify-center transition-transform hover:scale-105`}
        style={teamPrimaryColor ? { borderColor: `${teamPrimaryColor}60` } : {}}
      >
        {!imgError ? (
          <img
            src={resolvedPhoto}
            alt={playerNameAr || playerName}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 font-bold text-slate-300 font-mono"
            style={teamPrimaryColor ? { background: `linear-gradient(135deg, ${teamPrimaryColor}88, #0f172a)` } : {}}
          >
            {number ? (
              <span className={sizeConfig.text}>#{number}</span>
            ) : (
              <span className={sizeConfig.text}>{initials}</span>
            )}
          </div>
        )}

        {/* Captain Armband Badge */}
        {isCaptain && (
          <div
            className="absolute top-0.5 start-0.5 bg-amber-400 text-slate-950 font-black text-[9px] px-1 rounded shadow flex items-center justify-center border border-amber-300"
            title="كابتن الفريق (Captain)"
          >
            C
          </div>
        )}
      </div>

      {/* Jersey Number Badge */}
      {showNumber && number !== undefined && (
        <span
          className={`absolute -bottom-1 -end-1 bg-slate-950/95 text-white font-mono font-bold rounded-full border border-slate-600 shadow flex items-center justify-center ${sizeConfig.badge}`}
        >
          {number}
        </span>
      )}

      {/* Live Rating Pill */}
      {showRating && rating !== undefined && (
        <span className="absolute -top-1.5 -end-1.5 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-md border border-emerald-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
