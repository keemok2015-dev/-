import React from 'react';
import { Match } from '../types/football';
import { getTeamLogoUrl } from '../utils/teamLogos';
import { Star, MapPin, Bell } from 'lucide-react';
import { formatKickoffTime } from '../utils/dateTimeUtils';

interface MatchCardProps {
  match: Match;
  onSelectMatch: (match: Match) => void;
  onSimulateGoal?: (matchId: string) => void;
  isArabic: boolean;
  isFavorite?: boolean;
  onToggleFavoriteTeam?: (teamId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onSelectMatch,
  onSimulateGoal,
  isArabic,
  isFavorite = false,
  onToggleFavoriteTeam,
}) => {
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';
  const isUpcoming = match.status === 'UPCOMING';

  const homeLogo = getTeamLogoUrl(match.homeTeam.id, match.homeTeam.logo);
  const awayLogo = getTeamLogoUrl(match.awayTeam.id, match.awayTeam.logo);

  return (
    <div
      onClick={() => onSelectMatch(match)}
      className="match-card relative transition-all active:scale-[0.99] cursor-pointer"
      style={{
        background: 'rgba(22, 28, 42, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '24px',
        padding: '16px 20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)',
      }}
    >
      {/* 1. Match Header */}
      <div className="flex items-center justify-between text-xs text-[#9ca3af] font-semibold mb-3">
        <div className="flex items-center gap-1.5 truncate">
          <span>{match.leagueLogo}</span>
          <span className="text-white font-bold">
            {isArabic ? match.leagueNameAr : match.leagueName}
          </span>
          {match.leagueId === 'womens' && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-black animate-pulse">
              {isArabic ? 'للمعرفة ℹ️' : 'For Info ℹ️'}
            </span>
          )}
          {match.leagueId === 'international' && (
            <span className="text-[10px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm">
              <span>🌍</span>
              <span>{isArabic ? 'منتخبات العالم' : 'National Teams'}</span>
            </span>
          )}
          <span>·</span>
          <span>{isArabic ? match.roundAr : match.round}</span>
        </div>

        {/* Favorite Icon */}
        {onToggleFavoriteTeam && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavoriteTeam(match.homeTeam.id);
            }}
            className="p-1 text-slate-400 hover:text-amber-400"
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        )}
      </div>

      {/* 2. Match Body (Team 1 - Score - Team 2) */}
      <div className="flex items-center justify-between my-3 px-2">
        {/* Right Team (Home) */}
        <div className="flex flex-col items-center justify-center w-[30%] text-center">
          <div className="w-14 h-14 mb-2 flex items-center justify-center">
            {homeLogo.isImage ? (
              <img
                src={homeLogo.src}
                alt={match.homeTeam.name}
                className="w-14 h-14 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-4xl">{match.homeTeam.logo}</span>
            )}
          </div>
          <span className="text-sm font-bold text-white line-clamp-1 leading-tight">
            {isArabic ? match.homeTeam.nameAr : match.homeTeam.name}
          </span>
        </div>

        {/* Center Score & Live Badge */}
        <div className="flex flex-col items-center justify-center">
          {isUpcoming ? (
            <div className="text-sm font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-xl">
              {match.startTime}
            </div>
          ) : (
            <div className="text-3xl font-black tracking-wider text-white flex items-center gap-2 tabular-nums">
              <span>{match.homeScore}</span>
              <span className="text-slate-500">-</span>
              <span className={match.awayScore > match.homeScore ? 'text-[#00e676]' : 'text-white'}>
                {match.awayScore}
              </span>
            </div>
          )}

          {isLive && (
            <div className="text-xs font-bold text-[#ff3b30] mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] animate-ping inline-block" />
              <span>{isArabic ? 'مباشر' : 'LIVE'}</span>
            </div>
          )}

          {isFinished && (
            <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md mt-1">
              {isArabic ? 'انتهت' : 'FT'}
            </span>
          )}
        </div>

        {/* Left Team (Away) */}
        <div className="flex flex-col items-center justify-center w-[30%] text-center">
          <div className="w-14 h-14 mb-2 flex items-center justify-center">
            {awayLogo.isImage ? (
              <img
                src={awayLogo.src}
                alt={match.awayTeam.name}
                className="w-14 h-14 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-4xl">{match.awayTeam.logo}</span>
            )}
          </div>
          <span className="text-sm font-bold text-white line-clamp-1 leading-tight">
            {isArabic ? match.awayTeam.nameAr : match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* 📊 UCL Live Possession Bar (Shown when available or UCL) */}
      {match.stats?.possession && (match.status === 'LIVE' || match.leagueId === 'ucl') && (
        <div className="my-2.5 px-3 py-1.5 bg-[#0f1422]/90 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-blue-400 tabular-nums">
              {match.stats.possession[0]}% {isArabic ? match.homeTeam.nameAr : match.homeTeam.shortName}
            </span>
            <span className="text-amber-300 font-extrabold flex items-center gap-1">
              <span>{match.leagueId === 'ucl' ? '⭐' : '📊'}</span>
              <span>{isArabic ? 'الاستحواذ المباشر' : 'Live Possession'}</span>
            </span>
            <span className="text-cyan-400 tabular-nums">
              {isArabic ? match.awayTeam.nameAr : match.awayTeam.shortName} {match.stats.possession[1]}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-blue-500 h-full transition-all duration-700"
              style={{ width: `${match.stats.possession[0]}%` }}
            />
            <div
              className="bg-cyan-400 h-full transition-all duration-700"
              style={{ width: `${match.stats.possession[1]}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. Match Footer */}
      <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between">
        {/* Left: Channels Badge */}
        <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
          <div className="flex items-center gap-1 bg-[#1e293b]/90 border border-slate-700/60 px-2.5 py-1 rounded-lg">
            <span>‹</span>
            <span className="font-bold text-white text-[11px]">
              {match.broadcasts.length > 0 ? (isArabic ? match.broadcasts[0].channelNameAr : match.broadcasts[0].channelName) : 'SSC 1 HD'}
            </span>
            <span>📺</span>
          </div>

          {match.broadcasts.length > 1 && (
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              1+ {isArabic ? match.broadcasts[1].channelNameAr : match.broadcasts[1].channelName}
            </span>
          )}
        </div>

        {/* Center: Lineup Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectMatch(match);
          }}
          className="flex items-center gap-1 bg-[#1e293b]/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/70 px-2.5 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
          title={isArabic ? 'عرض تشكيلة الفريقين والمدرب' : 'View Team Lineup & Coach'}
        >
          <span>📋</span>
          <span>{isArabic ? 'التشكيلة' : 'Lineup'}</span>
        </button>

        {/* Right: Goal / Kickoff Alert Button */}
        {isUpcoming ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSimulateGoal) onSimulateGoal(match.id);
            }}
            className="flex items-center gap-1.5 bg-blue-900/70 hover:bg-blue-600 text-blue-100 hover:text-white border border-blue-400/60 px-2.5 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
            title={isArabic ? 'تنبيه قبل المباراة بـ 10 دقائق' : '10-minute Alert'}
          >
            <span>⏰</span>
            <span>{isArabic ? 'تنبيه 10 دقائق' : '10m Alert'}</span>
            <span className="text-[10px] text-blue-300">🔔</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSimulateGoal) onSimulateGoal(match.id);
            }}
            className="flex items-center gap-1 bg-[#1e293b]/90 hover:bg-[#00e676] hover:text-black text-white border border-slate-700/70 hover:border-[#00e676] px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <span>🔔</span>
            <span>Goal Alert</span>
            <span className="text-[11px] opacity-70">📍</span>
          </button>
        )}
      </div>
    </div>
  );
};
