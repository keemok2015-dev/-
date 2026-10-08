import React from 'react';
import { Match } from '../types/football';
import { TeamLogo } from './TeamLogo';
import { PlayerAvatar } from './PlayerAvatar';
import {
  Flame,
  Radio,
  Tv,
  Users,
  Bell,
  BellRing,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { getUpcomingCountdown } from '../utils/dateTimeUtils';
import {
  isMatchSubscribed,
  toggleMatchSubscription,
  showPushNotification,
} from '../services/webPushService';

interface FeaturedSpotlightMatchProps {
  match: Match;
  onSelectMatch: (match: Match, tab?: 'events' | 'stats' | 'lineups' | 'motm' | 'broadcast') => void;
  onSimulateGoal?: (matchId: string) => void;
  isArabic: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (teamId: string) => void;
  onOpenPushModal?: () => void;
}

export const FeaturedSpotlightMatch: React.FC<FeaturedSpotlightMatchProps> = ({
  match,
  onSelectMatch,
  onSimulateGoal,
  isArabic,
  isFavorite = false,
  onToggleFavorite,
  onOpenPushModal,
}) => {
  const isLive = match.status === 'LIVE';
  const isUpcoming = match.status === 'UPCOMING';
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(() =>
    isMatchSubscribed(match.id)
  );

  const countdownText = isUpcoming
    ? getUpcomingCountdown(match.startTime, isArabic, match.date, match.dateTime)
    : '';

  // Get key starting players for preview
  const homeKeyPlayers = match.homeLineup.starting.slice(0, 3);
  const awayKeyPlayers = match.awayLineup.starting.slice(0, 3);

  const handleTogglePush = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = toggleMatchSubscription(match.id);
    setIsSubscribed(newStatus);

    if (newStatus) {
      const homeName = isArabic ? match.homeTeam.nameAr : match.homeTeam.name;
      const awayName = isArabic ? match.awayTeam.nameAr : match.awayTeam.name;
      await showPushNotification(
        isArabic ? '🔔 تم تفعيل إشعارات الديربي!' : '🔔 Derby Push Alerts Activated!',
        {
          body: isArabic
            ? `ستصلك إشعارات فورية بكل أهداف وبطاقات قمة ${homeName} ضد ${awayName}!`
            : `Instant notifications enabled for ${homeName} vs ${awayName}!`,
          tag: `spotlight-${match.id}`,
        }
      );
    }
  };

  return (
    <div
      onClick={() => onSelectMatch(match)}
      className="relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 group border border-emerald-500/30 hover:border-emerald-400/60 shadow-2xl shadow-black/80 select-none bg-gradient-to-b from-[#0d1527] via-[#090e1b] to-[#060913]"
    >
      {/* Background Stadium Glow & Radial Beam */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-teal-900/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-400/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Banner: League & Spotlight Badge */}
      <div className="relative z-10 px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{isArabic ? 'مباراة القمة · ديربي الليلة' : 'Match of the Night'}</span>
          </span>

          <span className="text-xs text-slate-400 font-bold hidden sm:inline">·</span>
          <span className="text-xs text-slate-300 font-bold hidden sm:inline truncate max-w-[200px]">
            {isArabic ? match.leagueNameAr : match.leagueName}
          </span>
        </div>

        {/* Live or Countdown Pill */}
        <div className="flex items-center gap-2">
          {isLive ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black shadow-lg shadow-red-500/20 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{match.minute ? `${match.minute}' ${isArabic ? 'مباشر' : 'LIVE'}` : (isArabic ? 'مباشر' : 'LIVE')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-black shadow-sm">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{countdownText || match.startTime}</span>
            </div>
          )}

          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(match.homeTeam.id);
              }}
              className="p-1.5 rounded-xl hover:bg-slate-800/80 text-slate-400 hover:text-amber-400 transition-colors"
              title={isArabic ? 'إضافة للمفضلة' : 'Favorite'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Clash Stage: Team 1 - Score Arena - Team 2 */}
      <div className="relative z-10 px-5 py-6 sm:py-7 grid grid-cols-12 items-center gap-2">
        {/* Home Team */}
        <div className="col-span-4 sm:col-span-5 flex flex-col items-center text-center">
          <TeamLogo
            teamId={match.homeTeam.id}
            teamName={match.homeTeam.name}
            fallbackEmoji={match.homeTeam.logo}
            size="xl"
            className="mb-2.5 transition-transform duration-300 group-hover:scale-105"
          />
          <h3 className="text-sm sm:text-lg font-black text-white tracking-tight leading-tight line-clamp-1">
            {isArabic ? match.homeTeam.nameAr : match.homeTeam.name}
          </h3>
          <span className="text-[11px] text-slate-400 font-mono font-bold mt-0.5">
            {match.homeTeam.shortName}
          </span>
        </div>

        {/* Center Scoreboard & Kickoff Time */}
        <div className="col-span-4 sm:col-span-2 flex flex-col items-center justify-center text-center">
          {isLive ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md shadow-2xl">
                <span className="text-3xl sm:text-5xl font-black text-white tabular-nums">
                  {match.homeScore}
                </span>
                <span className="text-xl sm:text-2xl text-slate-600 font-light">:</span>
                <span className="text-3xl sm:text-5xl font-black text-white tabular-nums">
                  {match.awayScore}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {isArabic ? 'أجواء مشتعلة 🔥' : 'Intense Match 🔥'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-xl sm:text-2xl font-black text-amber-300 bg-amber-500/15 border border-amber-400/30 px-3.5 py-1.5 rounded-2xl tabular-nums shadow-inner">
                {match.startTime}
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1.5 whitespace-nowrap">
                {isArabic ? 'موعد الانطلاق' : 'Kickoff'}
              </span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="col-span-4 sm:col-span-5 flex flex-col items-center text-center">
          <TeamLogo
            teamId={match.awayTeam.id}
            teamName={match.awayTeam.name}
            fallbackEmoji={match.awayTeam.logo}
            size="xl"
            className="mb-2.5 transition-transform duration-300 group-hover:scale-105"
          />
          <h3 className="text-sm sm:text-lg font-black text-white tracking-tight leading-tight line-clamp-1">
            {isArabic ? match.awayTeam.nameAr : match.awayTeam.name}
          </h3>
          <span className="text-[11px] text-slate-400 font-mono font-bold mt-0.5">
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Featured Star Players Face Row (صور اللاعبين ونجوم القمة) */}
      <div className="relative z-10 px-5 py-3 bg-black/30 border-t border-white/[0.05] flex items-center justify-between gap-3">
        {/* Home Key Players */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
            {isArabic ? 'نجوم ' + match.homeTeam.shortName + ':' : 'Stars:'}
          </span>
          <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
            {homeKeyPlayers.map((player) => (
              <PlayerAvatar
                key={player.id}
                playerId={player.id}
                playerName={player.name}
                playerNameAr={player.nameAr}
                number={player.number}
                position={player.position}
                rating={player.rating}
                isCaptain={player.isCaptain}
                photoUrl={player.photo}
                size="sm"
                className="ring-2 ring-[#0b101e]"
              />
            ))}
          </div>
        </div>

        {/* Middle: Stadium & Referee Pill */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate max-w-[180px]">
            {isArabic ? match.stadiumAr : match.stadium}
          </span>
        </div>

        {/* Away Key Players */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
            {isArabic ? 'نجوم ' + match.awayTeam.shortName + ':' : 'Stars:'}
          </span>
          <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
            {awayKeyPlayers.map((player) => (
              <PlayerAvatar
                key={player.id}
                playerId={player.id}
                playerName={player.name}
                playerNameAr={player.nameAr}
                number={player.number}
                position={player.position}
                rating={player.rating}
                isCaptain={player.isCaptain}
                photoUrl={player.photo}
                size="sm"
                className="ring-2 ring-[#0b101e]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Strip: 1-Click Lineup, Channels, and Live Push Alerts */}
      <div className="relative z-10 px-5 py-3.5 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-950/80 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Broadcast Channel & Stadium */}
        <div className="flex items-center gap-2">
          <div className="min-h-[36px] px-3 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-center gap-1.5 text-xs text-white font-bold shadow-sm">
            <Tv className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {match.broadcasts.length > 0
                ? isArabic
                  ? match.broadcasts[0].channelNameAr
                  : match.broadcasts[0].channelName
                : 'beIN SPORTS 1 HD'}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {match.referee && (isArabic ? `الحكم: ${match.referee}` : `Ref: ${match.referee}`)}
          </span>
        </div>

        {/* Right Buttons: Quick Lineup Modal Opener + Web Push + Goal Whistle Test */}
        <div className="flex items-center gap-2">
          {/* Quick Lineup Opener with Photo Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMatch(match, 'lineups');
            }}
            className="min-h-[38px] px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
          >
            <Users className="w-3.5 h-3.5 text-slate-950" />
            <span>{isArabic ? 'تشكيلة الفريقين بالصور' : 'Lineups & Photos'}</span>
          </button>

          {/* Web Push Notification Toggle */}
          <button
            type="button"
            onClick={handleTogglePush}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${
              isSubscribed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
                : 'bg-slate-800/90 text-amber-300 border border-amber-500/30 hover:border-amber-400'
            }`}
            title={isArabic ? 'إشعارات الدفع المباشرة' : 'Push Alerts'}
          >
            {isSubscribed ? (
              <>
                <BellRing className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span className="hidden sm:inline">{isArabic ? 'مفعّل ✅' : 'Active ✅'}</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{isArabic ? 'تنبيه الأهداف' : 'Goal Alert'}</span>
              </>
            )}
          </button>

          {/* Goal Simulation / Whistle Audio for Testing */}
          {onSimulateGoal && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSimulateGoal(match.id);
              }}
              className="min-h-[38px] px-2.5 bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700/80 rounded-xl text-xs font-bold transition-all active:scale-95"
              title={isArabic ? 'محاكاة هدف وتجربة الصوت والإشعار' : 'Simulate Goal & Whistle'}
            >
              ⚽
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
