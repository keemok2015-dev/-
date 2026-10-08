import React from 'react';
import { Match } from '../types/football';
import { TeamLogo } from './TeamLogo';
import { Clock, Tv, Bell, BellRing, Star, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import { getUpcomingCountdown } from '../utils/dateTimeUtils';
import { isMatchSubscribed, toggleMatchSubscription, showPushNotification } from '../services/webPushService';

interface UpcomingSoonShelfProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  isArabic: boolean;
  onOpenPushModal: () => void;
  favoriteTeamIds: string[];
}

export const UpcomingSoonShelf: React.FC<UpcomingSoonShelfProps> = ({
  matches,
  onSelectMatch,
  isArabic,
  onOpenPushModal,
  favoriteTeamIds,
}) => {
  const [subscribedIds, setSubscribedIds] = React.useState<string[]>([]);

  // Filter matches that are UPCOMING
  const upcomingMatches = matches.filter((m) => m.status === 'UPCOMING');

  const handleToggleSub = async (e: React.MouseEvent, match: Match) => {
    e.stopPropagation();
    const isNowSubbed = toggleMatchSubscription(match.id);
    setSubscribedIds((prev) =>
      isNowSubbed ? [...prev, match.id] : prev.filter((id) => id !== match.id)
    );

    if (isNowSubbed) {
      const homeName = isArabic ? match.homeTeam.nameAr : match.homeTeam.name;
      const awayName = isArabic ? match.awayTeam.nameAr : match.awayTeam.name;
      await showPushNotification(
        isArabic ? '🔔 تم ضبط تنبيه المباراة!' : '🔔 Match Reminder Set!',
        {
          body: isArabic
            ? `ستصلك إشعارات فورية بالدفع عند بداية ${homeName} ضد ${awayName} ومع كل هدف يسجل!`
            : `You will receive instant push notifications when ${homeName} vs ${awayName} kicks off and for every goal!`,
          tag: `sub-${match.id}`,
        }
      );
    }
  };

  if (upcomingMatches.length === 0) {
    return null;
  }

  return (
    <section className="upcoming-soon-shelf bg-gradient-to-br from-[#121826]/95 via-[#0e1320]/90 to-[#161d2e]/90 border border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative ambient glow */}
      <div className="absolute -top-16 -end-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -start-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Web Push button */}
      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md shadow-amber-500/10">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>{isArabic ? 'مباريات ستلعب قريباً' : 'Upcoming Matches Soon'}</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  {upcomingMatches.length}
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isArabic
                ? 'قمم الليلة المرتقبة مع عد تنازلي وتنبيهات فورية قبل الانطلاق ⏱️'
                : 'Tonight’s big clashes with live countdowns & instant push alerts ⏱️'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPushModal}
          className="h-9 px-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-400/40 rounded-xl text-amber-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          title={isArabic ? 'إعدادات إشعارات الدفع (Web Push)' : 'Web Push Notification Settings'}
        >
          <BellRing className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{isArabic ? 'إشعارات الدفع' : 'Push Alerts'}</span>
          <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
            Web Push
          </span>
        </button>
      </div>

      {/* Horizontal Scrollable Cards with Large Comfortable Touch Targets */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1 snap-x">
        {upcomingMatches.map((match) => {
          const countdown = getUpcomingCountdown(match.startTime, isArabic, match.date, match.dateTime);
          const isSubbed = isMatchSubscribed(match.id) || subscribedIds.includes(match.id);
          const isHomeFav = favoriteTeamIds.includes(match.homeTeam.id);
          const isAwayFav = favoriteTeamIds.includes(match.awayTeam.id);
          const isFav = isHomeFav || isAwayFav;

          return (
            <div
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="min-w-[280px] sm:min-w-[320px] max-w-[340px] bg-[#161d2d]/90 hover:bg-[#1a2336] border border-slate-700/70 hover:border-amber-400/50 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] shadow-lg flex-shrink-0 snap-start relative group flex flex-col justify-between"
            >
              {/* Card Top: League & Countdown Badge */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-slate-300 flex items-center gap-1 truncate max-w-[150px]">
                  <span>{match.leagueLogo}</span>
                  <span className="text-white font-extrabold truncate">
                    {isArabic ? match.leagueNameAr : match.leagueName}
                  </span>
                </span>

                <div className="flex items-center gap-1 bg-amber-500/15 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-xl text-[11px] font-black tabular-nums shadow-sm">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{countdown}</span>
                </div>
              </div>

              {/* Card Center: Teams & Kickoff Time */}
              <div className="grid grid-cols-3 items-center my-2 text-center">
                {/* Home Team */}
                <div className="flex flex-col items-center">
                  <TeamLogo
                    teamId={match.homeTeam.id}
                    teamName={match.homeTeam.name}
                    fallbackEmoji={match.homeTeam.logo}
                    size="md"
                    className="mb-1.5"
                  />
                  <span className="text-xs font-black text-white line-clamp-1 leading-tight">
                    {isArabic ? match.homeTeam.nameAr : match.homeTeam.name}
                  </span>
                </div>

                {/* VS & Time */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-xl">
                    {match.startTime}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 font-semibold">
                    {isArabic ? 'توقيت مكة' : 'KSA Time'}
                  </span>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center">
                  <TeamLogo
                    teamId={match.awayTeam.id}
                    teamName={match.awayTeam.name}
                    fallbackEmoji={match.awayTeam.logo}
                    size="md"
                    className="mb-1.5"
                  />
                  <span className="text-xs font-black text-white line-clamp-1 leading-tight">
                    {isArabic ? match.awayTeam.nameAr : match.awayTeam.name}
                  </span>
                </div>
              </div>

              {/* Card Bottom: Channel & Instant Push Notification Toggle Button */}
              <div className="pt-2.5 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
                  <Tv className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="truncate font-semibold text-slate-300">
                    {match.broadcasts[0]
                      ? (isArabic ? match.broadcasts[0].channelNameAr : match.broadcasts[0].channelName)
                      : 'SSC 1 HD'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleToggleSub(e, match)}
                  className={`min-h-[32px] px-2.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 shadow-sm active:scale-95 ${
                    isSubbed
                      ? 'bg-emerald-500 text-slate-950 border border-emerald-400 shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                  }`}
                  title={isArabic ? 'تفعيل تنبيه انطلاق المباراة والأهداف' : 'Subscribe to Match Push Alerts'}
                >
                  {isSubbed ? (
                    <>
                      <BellRing className="w-3 h-3 text-slate-950" />
                      <span>{isArabic ? 'تنبيه مفعّل ✅' : 'Alert On ✅'}</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3 h-3 text-amber-400" />
                      <span>{isArabic ? 'نبّهني 🔔' : 'Notify Me 🔔'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
