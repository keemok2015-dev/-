import React, { useState, useEffect } from 'react';
import { Match, MatchEvent } from '../types/football';
import { TeamLogo } from './TeamLogo';
import { TacticalLineupBoard } from './TacticalLineupBoard';
import { PlayerAvatar } from './PlayerAvatar';
import {
  X,
  Tv,
  Award,
  BarChart2,
  Users,
  Clock,
  ExternalLink,
  Shield,
  Activity,
  Star,
  MapPin,
  UserCheck,
  Flame,
  Film,
} from 'lucide-react';
import { HighEnergyMatchHighlights } from './HighEnergyMatchHighlights';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  isSubscribed: boolean;
  onOpenSubscription: () => void;
  isArabic: boolean;
  favoriteTeamIds?: string[];
  onToggleFavoriteTeam?: (teamId: string) => void;
  onSimulateGoal?: (
    matchId: string,
    alertType?: 'GOAL' | 'RED_CARD' | 'YELLOW_CARD' | 'PRE_MATCH_10M' | 'VAR'
  ) => void;
  initialTab?: 'events' | 'stats' | 'lineups' | 'motm' | 'broadcast' | 'highlights';
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  isSubscribed,
  onOpenSubscription,
  isArabic,
  favoriteTeamIds = [],
  onToggleFavoriteTeam,
  onSimulateGoal,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'stats' | 'lineups' | 'motm' | 'broadcast' | 'highlights'>(
    initialTab || (match?.status === 'FINISHED' ? 'highlights' : 'events')
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (match?.status === 'FINISHED') {
      setActiveTab('highlights');
    } else {
      setActiveTab('events');
    }
  }, [match?.id, match?.status, initialTab]);

  if (!match) return null;

  const isLive = match.status === 'LIVE';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Grab Handle for Mobile */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 flex-shrink-0" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 flex-shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="text-base">{match.leagueLogo}</span>
            <div className="truncate">
              <h3 className="text-xs font-bold text-white truncate">
                {isArabic ? match.leagueNameAr : match.leagueName}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isArabic ? match.roundAr : match.round}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match Score Banner */}
        <div className="relative px-6 py-5 bg-gradient-to-b from-[#131c31] to-[#0b101e] border-b border-slate-800 flex-shrink-0">
          {/* Status Chip */}
          <div className="flex justify-center mb-3">
            {isLive ? (
              <span className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isArabic ? 'مباشر الآن' : 'LIVE'} · {match.minute}'</span>
              </span>
            ) : match.status === 'FINISHED' ? (
              <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full">
                {isArabic ? 'انتهت المباراة' : 'Full Time (FT)'}
              </span>
            ) : (
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                {isArabic ? 'تبدأ في' : 'Kickoff'} {match.startTime}
              </span>
            )}
          </div>

          {/* Teams and Score Grid */}
          <div className="grid grid-cols-11 items-center gap-2">
            {/* Home Team */}
            <div className="col-span-4 flex flex-col items-center text-center">
              <div className="relative mb-2">
                <TeamLogo
                  teamId={match.homeTeam.id}
                  teamName={match.homeTeam.name}
                  fallbackEmoji={match.homeTeam.logo}
                  size="lg"
                  showGlow
                />
                {onToggleFavoriteTeam && (
                  <button
                    type="button"
                    onClick={() => onToggleFavoriteTeam(match.homeTeam.id)}
                    className="absolute -top-1 -end-2 p-1 rounded-full bg-slate-900/90 border border-slate-700/80 hover:scale-110 transition-transform shadow-md"
                    title={favoriteTeamIds.includes(match.homeTeam.id) ? (isArabic ? 'إزالة من المفضلة' : 'Remove') : (isArabic ? 'إضافة للمفضلة' : 'Add')}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        favoriteTeamIds.includes(match.homeTeam.id)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-400 hover:text-amber-300'
                      }`}
                    />
                  </button>
                )}
              </div>
              <h4 className="text-sm font-black text-white line-clamp-1">
                {isArabic ? match.homeTeam.nameAr : match.homeTeam.name}
              </h4>
              <span className="text-[11px] text-slate-400 font-semibold">{match.homeTeam.shortName}</span>
            </div>

            {/* Score Center */}
            <div className="col-span-3 flex flex-col items-center justify-center">
              {match.status === 'UPCOMING' ? (
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-amber-400 bg-amber-500/10 border border-amber-400/20 px-3 py-1 rounded-xl tabular-nums">
                    {match.startTime}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1">
                    {isArabic ? 'لم تبدأ بعد' : 'Not Started'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                    {match.homeScore}
                  </span>
                  <span className="text-slate-600 text-2xl font-light">:</span>
                  <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                    {match.awayScore}
                  </span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="col-span-4 flex flex-col items-center text-center">
              <div className="relative mb-2">
                <TeamLogo
                  teamId={match.awayTeam.id}
                  teamName={match.awayTeam.name}
                  fallbackEmoji={match.awayTeam.logo}
                  size="lg"
                  showGlow
                />
                {onToggleFavoriteTeam && (
                  <button
                    type="button"
                    onClick={() => onToggleFavoriteTeam(match.awayTeam.id)}
                    className="absolute -top-1 -end-2 p-1 rounded-full bg-slate-900/90 border border-slate-700/80 hover:scale-110 transition-transform shadow-md"
                    title={favoriteTeamIds.includes(match.awayTeam.id) ? (isArabic ? 'إزالة من المفضلة' : 'Remove') : (isArabic ? 'إضافة للمفضلة' : 'Add')}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        favoriteTeamIds.includes(match.awayTeam.id)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-400 hover:text-amber-300'
                      }`}
                    />
                  </button>
                )}
              </div>
              <h4 className="text-sm font-black text-white line-clamp-1">
                {isArabic ? match.awayTeam.nameAr : match.awayTeam.name}
              </h4>
              <span className="text-[11px] text-slate-400 font-semibold">{match.awayTeam.shortName}</span>
            </div>
          </div>

          {/* Match Venue and Referee */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 truncate max-w-[240px]">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {isArabic ? match.stadiumAr : match.stadium}
            </span>
            <span className="flex items-center gap-1 truncate">
              <UserCheck className="w-3 h-3 text-slate-400" />
              {match.referee}
            </span>
          </div>

          {/* Match Alerts & 10-Minute Kickoff Notification Hub */}
          <div className="mt-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔔</span>
              <div>
                <span className="text-xs font-bold text-white block">
                  {match.status === 'UPCOMING'
                    ? (isArabic ? 'تنبيه قبل انطلاق المباراة بـ 10 دقائق ⏰' : '10-Minute Kickoff Alert ⏰')
                    : (isArabic ? 'تنبيهات أحداث المباراة المباشرة (أهداف، كروت، فار)' : 'Live Match Event Alerts (Goals, Cards, VAR)')}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {match.status === 'UPCOMING'
                    ? (isArabic ? 'تلقي إشعار فوري وتذكير قبل صافرة البداية بـ 10 دقائق' : 'Receive instant reminder 10m before kickoff')
                    : (isArabic ? 'إشعارات صوتية فورية للأهداف والبطاقات' : 'Instant audio alerts for match events')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {match.status === 'UPCOMING' ? (
                <button
                  type="button"
                  onClick={() => onSimulateGoal && onSimulateGoal(match.id, 'PRE_MATCH_10M')}
                  className="min-h-[34px] px-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>⏰</span>
                  <span>{isArabic ? 'تفعيل تنبيه 10 دقائق' : 'Activate 10m Alert'}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onSimulateGoal && onSimulateGoal(match.id, 'GOAL')}
                    className="min-h-[32px] px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                    title={isArabic ? 'تنبيه هدف' : 'Goal Alert'}
                  >
                    <span>⚽</span>
                    <span>{isArabic ? 'هدف' : 'Goal'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSimulateGoal && onSimulateGoal(match.id, 'RED_CARD')}
                    className="min-h-[32px] px-2.5 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                    title={isArabic ? 'تنبيه كارت أحمر' : 'Red Card Alert'}
                  >
                    <span>🟥</span>
                    <span>{isArabic ? 'طرد' : 'Red'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSimulateGoal && onSimulateGoal(match.id, 'YELLOW_CARD')}
                    className="min-h-[32px] px-2.5 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                    title={isArabic ? 'تنبيه كارت أصفر' : 'Yellow Card Alert'}
                  >
                    <span>🟨</span>
                    <span>{isArabic ? 'إنذار' : 'Yellow'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSimulateGoal && onSimulateGoal(match.id, 'VAR')}
                    className="min-h-[32px] px-2.5 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                    title={isArabic ? 'تنبيه تقنية الفار' : 'VAR Alert'}
                  >
                    <span>📺</span>
                    <span>VAR</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Finished Match High-Energy Highlights Banner */}
          {match.status === 'FINISHED' && (
            <div className="mt-3 p-3 bg-gradient-to-r from-red-950/60 via-amber-950/40 to-slate-900 border border-red-500/40 rounded-2xl flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                  <Flame className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-white">
                    {isArabic ? 'لقطات وأهداف حماسية سريعة متاحة الآن 🎬' : 'High-Energy Video & GIF Highlights Ready 🎬'}
                  </h5>
                  <p className="text-[10px] text-amber-300 font-medium">
                    {isArabic ? 'أهداف مذهلة، ضربات مقصية، واحتفالات صاخبة مع الجماهير' : 'Stunning goals, bicycle kicks, and passionate celebrations'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('highlights')}
                className="min-h-[36px] px-3 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all whitespace-nowrap active:scale-95 flex items-center gap-1"
              >
                <span>{isArabic ? 'مشاهدة ⚡' : 'Watch ⚡'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Navigation Tabs (Single line with scroll) */}
        <div className="flex items-center px-4 bg-slate-900/90 border-b border-slate-800 overflow-x-auto no-scrollbar flex-shrink-0">
          {match.status === 'FINISHED' && (
            <button
              onClick={() => setActiveTab('highlights')}
              className={`min-h-[44px] px-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'highlights'
                  ? 'border-red-500 text-red-400 bg-red-500/10'
                  : 'border-transparent text-amber-400 hover:text-amber-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>{isArabic ? 'أهداف ولقطات GIF 🎬' : 'Highlights & GIFs'}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 font-black border border-red-500/30">
                {isArabic ? 'حماسي' : 'HOT'}
              </span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('events')}
            className={`min-h-[44px] px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isArabic ? 'الأحداث' : 'Timeline'}</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`min-h-[44px] px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'الإحصائيات' : 'Stats'}</span>
          </button>
          <button
            onClick={() => setActiveTab('lineups')}
            className={`min-h-[44px] px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'lineups'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isArabic ? 'التشكيلة' : 'Lineups'}</span>
          </button>
          <button
            onClick={() => setActiveTab('motm')}
            className={`min-h-[44px] px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'motm'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isArabic ? 'رجل المباراة' : 'MOTM'}</span>
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`min-h-[44px] px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'broadcast'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{isArabic ? 'القنوات الناقلة' : 'Broadcast'}</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 0: HIGH-ENERGY REEL & GIFS FOR FINISHED MATCHES */}
          {activeTab === 'highlights' && (
            <HighEnergyMatchHighlights match={match} isArabic={isArabic} />
          )}
          {/* TAB 1: EVENTS / TIMELINE */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              {match.events.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  {isArabic ? 'لم تبدأ أحداث المباراة بعد' : 'No match events yet'}
                </div>
              ) : (
                match.events.map((ev) => {
                  const isHome = ev.teamId === match.homeTeam.id;
                  return (
                    <div
                      key={ev.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                        ev.type === 'GOAL'
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs tabular-nums text-slate-200 flex-shrink-0">
                        {ev.minute}'
                      </span>
                      <PlayerAvatar
                        playerId={ev.playerName}
                        playerName={ev.playerName}
                        playerNameAr={ev.playerNameAr}
                        size="xs"
                        showNumber={false}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {ev.type === 'GOAL' && '⚽'}
                            {ev.type === 'YELLOW_CARD' && '🟨'}
                            {ev.type === 'RED_CARD' && '🟥'}
                            {ev.type === 'SUBSTITUTION' && '🔄'}
                            {ev.type === 'VAR' && '📺'}
                          </span>
                          <span className="text-xs font-bold text-white truncate">
                            {isArabic ? ev.playerNameAr : ev.playerName}
                          </span>
                        </div>
                        {ev.assistName && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {isArabic ? `صناعة: ${ev.assistNameAr || ev.assistName}` : `Assist: ${ev.assistName}`}
                          </p>
                        )}
                        {ev.detail && (
                          <p className="text-[10px] text-slate-500 italic mt-0.5">
                            {ev.detail}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-800/80 rounded-md flex-shrink-0">
                        {isHome ? (isArabic ? match.homeTeam.nameAr : match.homeTeam.shortName) : (isArabic ? match.awayTeam.nameAr : match.awayTeam.shortName)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: MATCH STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* UCL / Live Possession Special Card */}
              <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-blue-500/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                    <span className="text-xs font-black text-white">
                      {match.leagueId === 'ucl'
                        ? (isArabic ? 'إحصائيات الاستحواذ المباشرة (دوري أبطال أوروبا ⭐)' : 'UCL Live Possession Intelligence ⭐')
                        : (isArabic ? 'إحصائية الاستحواذ المباشرة 📊' : 'Live Possession Breakdown 📊')}
                    </span>
                  </div>

                  <span className="text-[10px] text-amber-300 font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                    {match.status === 'LIVE' ? (isArabic ? `مباشر الدقيقة ${match.minute}'` : `Live ${match.minute}'`) : (isArabic ? 'مكتملة' : 'Full Time')}
                  </span>
                </div>

                {/* Team Possession Indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-950/50 p-2.5 rounded-xl border border-blue-500/20 text-center">
                    <span className="text-[11px] text-slate-300 block truncate font-bold">
                      {isArabic ? match.homeTeam.nameAr : match.homeTeam.name}
                    </span>
                    <span className="text-2xl font-black text-blue-400 tabular-nums">
                      {match.stats.possession[0]}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {match.stats.passes[0]} {isArabic ? 'تمريرة' : 'Passes'} ({match.stats.passAccuracy[0]}%)
                    </span>
                  </div>

                  <div className="bg-cyan-950/50 p-2.5 rounded-xl border border-cyan-500/20 text-center">
                    <span className="text-[11px] text-slate-300 block truncate font-bold">
                      {isArabic ? match.awayTeam.nameAr : match.awayTeam.name}
                    </span>
                    <span className="text-2xl font-black text-cyan-400 tabular-nums">
                      {match.stats.possession[1]}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {match.stats.passes[1]} {isArabic ? 'تمريرة' : 'Passes'} ({match.stats.passAccuracy[1]}%)
                    </span>
                  </div>
                </div>

                {/* Dynamic Dual Bar */}
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${match.stats.possession[0]}%` }}
                    className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 h-full transition-all duration-700"
                  />
                  <div
                    style={{ width: `${match.stats.possession[1]}%` }}
                    className="bg-gradient-to-l from-cyan-500 via-cyan-400 to-teal-400 h-full transition-all duration-700"
                  />
                </div>

                {/* Momentum Commentary */}
                <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">
                    {isArabic ? 'ضغط الاستحواذ في آخر 15 دقيقة:' : '15-Min Possession Momentum:'}
                  </span>
                  <span className="font-bold text-amber-300">
                    {match.stats.possession[0] > match.stats.possession[1]
                      ? (isArabic ? `أفضلية واستحواذ لـ ${match.homeTeam.nameAr}` : `${match.homeTeam.name} dominating territory`)
                      : (isArabic ? `أفضلية واستحواذ لـ ${match.awayTeam.nameAr}` : `${match.awayTeam.name} dominating territory`)}
                  </span>
                </div>
              </div>

              {/* Stats Bar List */}
              {[
                { labelAr: 'إجمالي التسديدات', labelEn: 'Total Shots', data: match.stats.shots },
                { labelAr: 'التسديدات على المرمى', labelEn: 'Shots on Target', data: match.stats.shotsOnTarget },
                { labelAr: 'الأهداف المتوقعة (xG)', labelEn: 'Expected Goals (xG)', data: match.stats.xg, isFloat: true },
                { labelAr: 'الركنيات', labelEn: 'Corners', data: match.stats.corners },
                { labelAr: 'الأخطاء المرتكبة', labelEn: 'Fouls', data: match.stats.fouls },
                { labelAr: 'التمريرات الناجحة', labelEn: 'Total Passes', data: match.stats.passes },
                { labelAr: 'دقة التمرير', labelEn: 'Pass Accuracy', data: match.stats.passAccuracy, suffix: '%' },
                { labelAr: 'البطاقات الصفراء', labelEn: 'Yellow Cards', data: match.stats.yellowCards },
              ].map((row, idx) => {
                const total = (Number(row.data[0]) || 0) + (Number(row.data[1]) || 0);
                const homePct = total > 0 ? (Number(row.data[0]) / total) * 100 : 50;
                const awayPct = 100 - homePct;

                return (
                  <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="tabular-nums text-slate-200">
                        {row.data[0]}
                        {row.suffix || ''}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px]">
                        {isArabic ? row.labelAr : row.labelEn}
                      </span>
                      <span className="tabular-nums text-slate-200">
                        {row.data[1]}
                        {row.suffix || ''}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div style={{ width: `${homePct}%` }} className="bg-emerald-500 h-full" />
                      <div style={{ width: `${awayPct}%` }} className="bg-blue-500 h-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: LINEUPS & TACTICAL BOARD */}
          {activeTab === 'lineups' && (
            <TacticalLineupBoard match={match} isArabic={isArabic} />
          )}

          {/* TAB 4: MAN OF THE MATCH (MOTM) */}
          {activeTab === 'motm' && (
            <div className="space-y-4">
              {match.manOfTheMatch ? (
                <div className="bg-gradient-to-b from-slate-900 to-[#0e1628] rounded-2xl border border-amber-500/30 overflow-hidden shadow-xl">
                  {/* MOTM Hero Header */}
                  <div className="relative p-4 flex items-center gap-4 border-b border-slate-800">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/50 flex-shrink-0 shadow-lg">
                      <img
                        src={match.manOfTheMatch.photo}
                        alt={match.manOfTheMatch.playerName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        MOTM
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                        <Award className="w-4 h-4" />
                        <span>{isArabic ? 'نجم المباراة الأول' : 'Man of the Match'}</span>
                      </div>
                      <h4 className="text-base font-extrabold text-white mt-1 truncate">
                        {isArabic ? match.manOfTheMatch.playerNameAr : match.manOfTheMatch.playerName}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>{match.manOfTheMatch.teamLogo}</span>
                        <span>{isArabic ? match.manOfTheMatch.teamNameAr : match.manOfTheMatch.teamName}</span>
                      </p>
                    </div>

                    <div className="text-center bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
                      <span className="text-[10px] text-amber-300 font-bold block uppercase">
                        {isArabic ? 'التقييم' : 'Rating'}
                      </span>
                      <span className="text-2xl font-black text-amber-400 tabular-nums">
                        {match.manOfTheMatch.rating}
                      </span>
                    </div>
                  </div>

                  {/* MOTM Stat Grid */}
                  <div className="p-4 grid grid-cols-4 gap-2 text-center border-b border-slate-800/80">
                    <div className="bg-slate-800/60 p-2 rounded-xl">
                      <span className="text-lg font-black text-white tabular-nums block">
                        {match.manOfTheMatch.goals}
                      </span>
                      <span className="text-[10px] text-slate-400">{isArabic ? 'أهداف' : 'Goals'}</span>
                    </div>
                    <div className="bg-slate-800/60 p-2 rounded-xl">
                      <span className="text-lg font-black text-white tabular-nums block">
                        {match.manOfTheMatch.assists}
                      </span>
                      <span className="text-[10px] text-slate-400">{isArabic ? 'صناعة' : 'Assists'}</span>
                    </div>
                    <div className="bg-slate-800/60 p-2 rounded-xl">
                      <span className="text-lg font-black text-white tabular-nums block">
                        {match.manOfTheMatch.keyPasses}
                      </span>
                      <span className="text-[10px] text-slate-400">{isArabic ? 'تمريرات حاسمة' : 'Key Passes'}</span>
                    </div>
                    <div className="bg-slate-800/60 p-2 rounded-xl">
                      <span className="text-lg font-black text-white tabular-nums block">
                        {match.manOfTheMatch.dribbles}
                      </span>
                      <span className="text-[10px] text-slate-400">{isArabic ? 'مراوغات' : 'Dribbles'}</span>
                    </div>
                  </div>

                  {/* MOTM Tactical Summary */}
                  <div className="p-4 bg-slate-900/40">
                    <h6 className="text-xs font-bold text-slate-300 mb-1">
                      {isArabic ? 'التحليل الفني للأداء' : 'Tactical Performance Analysis'}
                    </h6>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isArabic ? match.manOfTheMatch.summaryAr : match.manOfTheMatch.summaryEn}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  {isArabic ? 'سيتم اختيار رجل المباراة فور نهاية اللقاء' : 'MOTM will be selected after the final whistle'}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BROADCAST CHANNELS & WATCH GUIDE */}
          {activeTab === 'broadcast' && (
            <div className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-xs text-blue-300">
                {isArabic
                  ? 'جميع القنوات والروابط أدناه رسمية ومعتمدة لحقوق البث التلفزيوني والرقمي.'
                  : 'All channels and links below are official broadcast rights holders.'}
              </div>

              {match.broadcasts.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{b.logo}</span>
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        {isArabic ? b.channelNameAr : b.channelName}
                      </h5>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span>🎙️ {isArabic ? b.commentatorAr : b.commentator}</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-mono text-[10px] font-bold">
                          {b.quality}
                        </span>
                      </div>
                      {b.satellite && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          📡 {b.satellite}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSubscribed && (
                      <span className="hidden sm:inline-block text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                        4K VIP
                      </span>
                    )}
                    <a
                      href={b.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>{isArabic ? 'بث رسمي' : 'Watch'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
