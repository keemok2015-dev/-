import React from 'react';
import { Match } from '../types/football';
import { TeamLogo } from './TeamLogo';
import { Star, MapPin, Bell, BellRing, Tv, Users, Flame, Clock } from 'lucide-react';
import { formatKickoffTime, getUpcomingCountdown } from '../utils/dateTimeUtils';
import { isMatchSubscribed, toggleMatchSubscription, showPushNotification } from '../services/webPushService';

interface MatchCardProps {
  match: Match;
  onSelectMatch: (match: Match, tab?: 'events' | 'stats' | 'lineups' | 'motm' | 'broadcast' | 'highlights') => void;
  onSimulateGoal?: (matchId: string) => void;
  isArabic: boolean;
  isFavorite?: boolean;
  onToggleFavoriteTeam?: (teamId: string) => void;
  onOpenPushModal?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onSelectMatch,
  onSimulateGoal,
  isArabic,
  isFavorite = false,
  onToggleFavoriteTeam,
  onOpenPushModal,
}) => {
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';
  const isUpcoming = match.status === 'UPCOMING';

  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(() => isMatchSubscribed(match.id));


  const countdownText = isUpcoming
    ? getUpcomingCountdown(match.startTime, isArabic, match.date, match.dateTime)
    : '';

  const handleTogglePushAlert = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = toggleMatchSubscription(match.id);
    setIsSubscribed(newStatus);

    if (newStatus) {
      const homeName = isArabic ? match.homeTeam.nameAr : match.homeTeam.name;
      const awayName = isArabic ? match.awayTeam.nameAr : match.awayTeam.name;
      await showPushNotification(
        isArabic ? '🔔 تم تفعيل إشعارات الدفع للمباراة' : '🔔 Match Push Alerts Activated',
        {
          body: isArabic
            ? `ستستقبل إشعاراً فورياً عند انطلاق ${homeName} ضد ${awayName} ومع كل هدف يسجل حتى لو كان التطبيق مغلقاً!`
            : `You will receive push notifications when ${homeName} vs ${awayName} starts and for every goal scored!`,
          tag: `match-alert-${match.id}`,
        }
      );
    }
  };

  return (
    <div
      onClick={() => onSelectMatch(match)}
      className="match-card relative transition-all duration-200 active:scale-[0.99] cursor-pointer group"
      style={{
        background: isLive
          ? 'linear-gradient(135deg, rgba(23, 31, 48, 0.95) 0%, rgba(18, 25, 40, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(20, 26, 40, 0.9) 0%, rgba(15, 20, 32, 0.92) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '26px',
        padding: '18px 20px',
        border: isLive
          ? '1.5px solid rgba(239, 68, 68, 0.45)'
          : isUpcoming
          ? '1.5px solid rgba(245, 158, 11, 0.35)'
          : '1px solid rgba(255, 255, 255, 0.09)',
        boxShadow: isLive
          ? '0 16px 36px rgba(239, 68, 68, 0.15), 0 8px 24px rgba(0, 0, 0, 0.6)'
          : '0 14px 34px rgba(0, 0, 0, 0.55)',
      }}
    >
      {/* 1. Header Bar: League & Round & Actions */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2 truncate">
          <span className="text-base">{match.leagueLogo}</span>
          <span className="text-white font-black text-sm truncate">
            {isArabic ? match.leagueNameAr : match.leagueName}
          </span>

          {match.leagueId === 'international' && (
            <span className="text-[11px] bg-blue-500/20 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm">
              <span>🌍</span>
              <span>{isArabic ? 'منتخبات العالم' : 'National Teams'}</span>
            </span>
          )}

          <span className="text-slate-600 font-bold">·</span>
          <span className="text-xs text-slate-300 font-semibold truncate">
            {isArabic ? match.roundAr : match.round}
          </span>
        </div>

        {/* Top Right: Favorite Star & Push Icon */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onToggleFavoriteTeam && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavoriteTeam(match.homeTeam.id);
              }}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
              title={isArabic ? 'إضافة إلى الأندية المفضلة' : 'Favorite'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Match Arena: Team 1 - Big Scoreboard - Team 2 */}
      <div className="grid grid-cols-12 items-center my-3.5 gap-2">
        {/* Right Team (Home) - 5 cols */}
        <div className="col-span-5 flex flex-col items-center justify-center text-center px-1">
          <TeamLogo
            teamId={match.homeTeam.id}
            teamName={match.homeTeam.name}
            fallbackEmoji={match.homeTeam.logo}
            size="lg"
            className="mb-2"
          />
          <span className="text-sm sm:text-base font-black text-white line-clamp-1 leading-snug">
            {isArabic ? match.homeTeam.nameAr : match.homeTeam.name}
          </span>
          <span className="text-[11px] text-slate-400 font-bold mt-0.5">
            {match.homeTeam.shortName}
          </span>
        </div>

        {/* Center Scoreboard / Time Indicator - 2 cols */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          {isUpcoming ? (
            <div className="flex flex-col items-center text-center">
              <div className="text-base sm:text-lg font-black text-amber-300 bg-amber-500/15 border border-amber-400/30 px-3 py-1.5 rounded-2xl shadow-inner tabular-nums">
                {match.startTime}
              </div>
              <span className="text-[11px] text-amber-400/90 font-bold mt-1.5 whitespace-nowrap">
                {countdownText || (isArabic ? 'ستلعب قريباً' : 'Starting Soon')}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-black tracking-wider text-white flex items-center gap-2 tabular-nums">
                <span className={match.homeScore > match.awayScore ? 'text-emerald-400' : 'text-white'}>
                  {match.homeScore}
                </span>
                <span className="text-slate-600 font-light">:</span>
                <span className={match.awayScore > match.homeScore ? 'text-emerald-400' : 'text-white'}>
                  {match.awayScore}
                </span>
              </div>

              {isLive && (
                <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/40 px-2.5 py-0.5 rounded-full text-xs font-black mt-2 shadow-sm animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{match.minute ? `${match.minute}'` : (isArabic ? 'مباشر' : 'LIVE')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Left Team (Away) - 5 cols */}
        <div className="col-span-5 flex flex-col items-center justify-center text-center px-1">
          <TeamLogo
            teamId={match.awayTeam.id}
            teamName={match.awayTeam.name}
            fallbackEmoji={match.awayTeam.logo}
            size="lg"
            className="mb-2"
          />
          <span className="text-sm sm:text-base font-black text-white line-clamp-1 leading-snug">
            {isArabic ? match.awayTeam.nameAr : match.awayTeam.name}
          </span>
          <span className="text-[11px] text-slate-400 font-bold mt-0.5">
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* 3. Live Possession / Stats Strip */}
      {match.stats?.possession && (isLive || match.leagueId === 'ucl') && (
        <div className="my-3 px-3.5 py-2 bg-[#0c101c]/90 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-black">
            <span className="text-blue-400 tabular-nums">
              {match.stats.possession[0]}% {isArabic ? match.homeTeam.nameAr : match.homeTeam.shortName}
            </span>
            <span className="text-amber-300 font-black flex items-center gap-1">
              <span>📊</span>
              <span>{isArabic ? 'الاستحواذ المباشر' : 'Live Possession'}</span>
            </span>
            <span className="text-cyan-400 tabular-nums">
              {isArabic ? match.awayTeam.nameAr : match.awayTeam.shortName} {match.stats.possession[1]}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-700"
              style={{ width: `${match.stats.possession[0]}%` }}
            />
            <div
              className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full transition-all duration-700"
              style={{ width: `${match.stats.possession[1]}%` }}
            />
          </div>
        </div>
      )}

      {/* 4. Action Bar (Large, Highly Accessible Touch Targets) */}
      <div className="pt-3 mt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        {/* Left: TV Channel Badge */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <div className="min-h-[36px] px-3 bg-slate-800/90 border border-slate-700/80 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Tv className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-white text-xs">
              {match.broadcasts.length > 0
                ? (isArabic ? match.broadcasts[0].channelNameAr : match.broadcasts[0].channelName)
                : 'SSC 1 HD'}
            </span>
          </div>

          {match.stadiumAr && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[140px]">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span className="truncate">{isArabic ? match.stadiumAr : match.stadium}</span>
            </span>
          )}
        </div>

        {/* Right Actions: Lineup Button + Web Push Alert Bell */}
        <div className="flex items-center gap-2">
          {/* Lineups Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMatch(match, 'lineups');
            }}
            className="min-h-[36px] px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isArabic ? 'التشكيلة' : 'Lineup'}</span>
          </button>

          {/* Web Push Alert Button */}
          <button
            type="button"
            onClick={handleTogglePushAlert}
            className={`min-h-[36px] px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isSubscribed
                ? 'bg-emerald-500 text-slate-950 border border-emerald-400 shadow-emerald-500/25'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
            }`}
            title={
              isUpcoming
                ? (isArabic ? 'تفعيل إشعار الدفع قبل انطلاق المباراة ومع الأهداف' : 'Kickoff & Goal Push Alert')
                : (isArabic ? 'تفعيل إشعارات الدفع المباشرة بالأهداف' : 'Live Goal Push Alert')
            }
          >
            {isSubscribed ? (
              <>
                <BellRing className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                <span>{isArabic ? 'منبّه مفعّل ✅' : 'Alert On ✅'}</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isUpcoming
                    ? (isArabic ? 'تنبيه البداية ⏰' : 'Kickoff Alert')
                    : (isArabic ? 'تنبيه بالهدف ⚽' : 'Goal Alert')}
                </span>
              </>
            )}
          </button>

          {/* Simulate Goal / Audio Whistle Trigger (for live test) */}
          {onSimulateGoal && (isLive || isUpcoming) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSimulateGoal(match.id);
              }}
              className="min-h-[36px] px-2.5 bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700/80 rounded-xl text-xs font-bold transition-all active:scale-95"
              title={isArabic ? 'محاكاة هدف وتجربة إشعار الدفع الفوري والصافرة' : 'Simulate Goal & Test Push Notification'}
            >
              ⚽
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
