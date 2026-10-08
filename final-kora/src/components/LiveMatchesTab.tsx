import React, { useState } from 'react';
import { Match, MatchStatus } from '../types/football';
import {
  Clock,
  Tv,
  Zap,
  Star,
  BellRing,
  BellOff,
  Search,
  X,
  Calendar,
  Radio,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { AutoRefreshBar } from './AutoRefreshBar';
import { ActiveLiveDesk } from './ActiveLiveDesk';
import { MatchCard } from './MatchCard';
import { LeaguesBar } from './LeaguesBar';
import { formatMatchDate, formatKickoffTime, getUpcomingCountdown } from '../utils/dateTimeUtils';

interface LiveMatchesTabProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onSimulateGoal: (targetMatchId?: string) => void;
  isArabic: boolean;
  favoriteTeamIds: string[];
  onToggleFavoriteTeam: (teamId: string) => void;
  onOpenFavoritesModal: () => void;
  onlyNotifyFavorites: boolean;
  onToggleOnlyNotifyFavorites: () => void;
  isAutoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  secondsRemaining: number;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  lastUpdatedTime: string;
  onOpenPublishModal?: () => void;
}

export const LiveMatchesTab: React.FC<LiveMatchesTabProps> = ({
  matches,
  onSelectMatch,
  onSimulateGoal,
  isArabic,
  favoriteTeamIds,
  onToggleFavoriteTeam,
  onOpenFavoritesModal,
  onlyNotifyFavorites,
  onToggleOnlyNotifyFavorites,
  isAutoRefresh,
  onToggleAutoRefresh,
  secondsRemaining,
  onManualRefresh,
  isRefreshing,
  lastUpdatedTime,
  onOpenPublishModal,
}) => {
  const [selectedDateId, setSelectedDateId] = useState<string>('2026-10-04'); // Today by default
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'FINISHED' | 'UPCOMING'>('ALL');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('ALL'); // All matches shown by default like screenshot
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const dates = [
    { id: 'ALL', labelAr: 'الكل', labelEn: 'All', dateStr: 'جميع الأيام' },
    { id: '2026-10-03', labelAr: 'أمس', labelEn: 'Yesterday', dateStr: '3 أكتوبر' },
    { id: '2026-10-04', labelAr: 'اليوم', labelEn: 'Today', dateStr: '4 أكتوبر', isToday: true },
    { id: '2026-10-05', labelAr: 'غداً', labelEn: 'Tomorrow', dateStr: '5 أكتوبر' },
  ];

  // Helper to check if match involves a favorite team
  const isMatchFavorite = (match: Match) => {
    return (
      favoriteTeamIds.includes(match.homeTeam.id) ||
      favoriteTeamIds.includes(match.awayTeam.id)
    );
  };

  const favoriteMatchesCount = matches.filter(isMatchFavorite).length;
  const liveMatches = matches.filter((m) => m.status === 'LIVE');

  const filteredMatches = matches.filter((m) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchSearchText = `${m.homeTeam.name} ${m.homeTeam.nameAr} ${m.homeTeam.shortName} ${m.awayTeam.name} ${m.awayTeam.nameAr} ${m.awayTeam.shortName} ${m.leagueName} ${m.leagueNameAr}`.toLowerCase();
      if (!matchSearchText.includes(q)) return false;
    }
    if (selectedDateId !== 'ALL' && m.date !== selectedDateId) return false;
    if (filterFavoritesOnly && !isMatchFavorite(m)) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (selectedLeagueId !== 'ALL' && m.leagueId !== selectedLeagueId) return false;
    return true;
  });

  return (
    <div className="space-y-3 pb-24">
      {/* 1. 🏆 Leagues Bar (Positioned at the very top under Header) */}
      <LeaguesBar
        selectedLeagueId={selectedLeagueId}
        onSelectLeague={(id) => {
          setFilterFavoritesOnly(false);
          setSelectedLeagueId(id);
        }}
        isArabic={isArabic}
        filterFavoritesOnly={filterFavoritesOnly}
        onToggleFilterFavorites={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
        favoriteMatchesCount={favoriteMatchesCount}
      />

      {/* 2. Compact Segmented Status & Date Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-1">
        {/* Status Filters */}
        <div className="flex items-center gap-1 p-1 bg-[#151a24] rounded-2xl border border-[#2a3441]">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`flex-1 sm:flex-none min-h-[34px] px-3 text-xs font-semibold rounded-xl transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isArabic ? 'الكل' : 'All'}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('LIVE')}
            className={`flex-1 sm:flex-none min-h-[34px] px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              statusFilter === 'LIVE'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>{isArabic ? 'مباشر' : 'Live'}</span>
            <span className="text-[10px] font-bold text-red-400 font-mono">({liveMatches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('FINISHED')}
            className={`flex-1 sm:flex-none min-h-[34px] px-3 text-xs font-semibold rounded-xl transition-all ${
              statusFilter === 'FINISHED'
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isArabic ? 'انتهت' : 'Finished'}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('UPCOMING')}
            className={`flex-1 sm:flex-none min-h-[34px] px-3 text-xs font-semibold rounded-xl transition-all ${
              statusFilter === 'UPCOMING'
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isArabic ? 'القادمة' : 'Upcoming'}
          </button>
        </div>

        {/* Date Selector Row */}
        <div className="flex items-center gap-1 p-1 bg-[#151a24] rounded-2xl border border-[#2a3441] overflow-x-auto no-scrollbar">
          {dates.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDateId(d.id)}
              className={`flex-1 sm:flex-none min-h-[34px] px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedDateId === d.id
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isArabic ? d.labelAr : d.labelEn}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className={`min-h-[34px] min-w-[34px] px-2 rounded-xl flex items-center justify-center transition-all ${
              showSearch ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title={isArabic ? 'بحث' : 'Search'}
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Search Bar (collapsible or active) */}
      {(showSearch || searchQuery) && (
        <div className="relative">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isArabic
                ? 'ابحث عن مباراة باسم الفريق (الهلال، النصر، ريال مدريد)...'
                : 'Search match by team name...'
            }
            className="w-full min-h-[42px] ps-10 pe-10 bg-[#151a24] border border-[#2a3441] rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[42px] min-w-[42px] absolute top-1/2 -translate-y-1/2 end-0 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 4. Match Cards List (Directly displayed!) */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-[#151a24] rounded-2xl border border-[#2a3441] p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {filterFavoritesOnly
                  ? (isArabic ? 'لا توجد مباريات جارية لفرقك المفضلة حالياً' : 'No matches for favorite teams')
                  : (isArabic ? 'لا توجد مباريات مطابقة لهذا الفلتر' : 'No matches found')}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {isArabic ? 'جرب اختيار يوم آخر أو الضغط على "الكل" لعرض جميع المباريات' : 'Try selecting another day or league'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedLeagueId('ALL');
                setSelectedDateId('ALL');
                setStatusFilter('ALL');
                setFilterFavoritesOnly(false);
              }}
              className="min-h-[38px] px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all inline-flex items-center gap-1.5"
            >
              <span>{isArabic ? 'عرض جميع المباريات' : 'Show All Matches'}</span>
            </button>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const isHomeFav = favoriteTeamIds.includes(match.homeTeam.id);
            const isAwayFav = favoriteTeamIds.includes(match.awayTeam.id);
            const isFav = isHomeFav || isAwayFav;

            return (
              <MatchCard
                key={match.id}
                match={match}
                onSelectMatch={onSelectMatch}
                onSimulateGoal={onSimulateGoal}
                isArabic={isArabic}
                isFavorite={isFav}
                onToggleFavoriteTeam={onToggleFavoriteTeam}
              />
            );
          })
        )}
      </div>

      {/* 5. Auto-Refresh Status Bar (At bottom of list) */}
      <AutoRefreshBar
        isAutoRefresh={isAutoRefresh}
        onToggleAutoRefresh={onToggleAutoRefresh}
        secondsRemaining={secondsRemaining}
        onManualRefresh={onManualRefresh}
        isRefreshing={isRefreshing}
        lastUpdatedTime={lastUpdatedTime}
        isArabic={isArabic}
      />

      {/* 6. Multi-Platform Publish & Install Card */}
      {onOpenPublishModal && (
        <div
          onClick={onOpenPublishModal}
          className="cursor-pointer mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 hover:border-emerald-400 shadow-lg shadow-emerald-950/30 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              📲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                  {isArabic ? 'تثبيت التطبيق على هاتفك والكمبيوتر' : 'Install App on Phone & Desktop'}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isArabic ? 'متاح الآن' : 'Available'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isArabic
                  ? 'يعمل بكفاءة على أندرويد، آيفون، ويندوز وماك بدون متجر'
                  : 'Works standalone on Android, iOS, Windows & Mac'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-[-2px] transition-transform">
            <span>{isArabic ? 'فتح' : 'Open'}</span>
            <span>←</span>
          </div>
        </div>
      )}
    </div>
  );
};
