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
  RotateCw,
  Globe,
  Sparkles,
  CheckCircle,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import { AutoRefreshBar } from './AutoRefreshBar';
import { ActiveLiveDesk } from './ActiveLiveDesk';
import { MatchCard } from './MatchCard';
import { LeaguesBar } from './LeaguesBar';
import { UpcomingSoonShelf } from './UpcomingSoonShelf';
import { formatMatchDate, formatKickoffTime } from '../utils/dateTimeUtils';
import { getTodayDateString, getTomorrowDateString } from '../utils/dateHelper';

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
  onForceResetMatches?: () => void;
  onOpenPushModal?: () => void;
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
  onForceResetMatches,
  onOpenPushModal,
}) => {
  const [selectedDateId, setSelectedDateId] = useState<string>('ALL'); // All matches shown by default
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING'>('ALL');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('ALL'); // All matches shown by default
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string>('');

  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();

  const dates = [
    { id: 'ALL', labelAr: 'الكل', labelEn: 'All', dateStr: 'جميع الأيام' },
    { id: 'TODAY', labelAr: 'اليوم', labelEn: 'Today', dateStr: 'اليوم', isToday: true },
    { id: 'TOMORROW', labelAr: 'غداً', labelEn: 'Tomorrow', dateStr: 'غداً' },
  ];

  const handleSyncMatches = () => {
    if (onForceResetMatches) {
      onForceResetMatches();
    }
    setSyncToast(
      isArabic
        ? 'تم تحديث وتنظيف كافة المباريات وتفعيل المزامنة بنجاح ✅'
        : 'Matches updated & cleaned successfully ✅'
    );
    setTimeout(() => setSyncToast(''), 3000);
  };

  // Helper to check if match involves a favorite team
  const isMatchFavorite = (match: Match) => {
    return (
      favoriteTeamIds.includes(match.homeTeam.id) ||
      favoriteTeamIds.includes(match.awayTeam.id)
    );
  };

  const favoriteMatchesCount = matches.filter(isMatchFavorite).length;
  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const upcomingMatches = matches.filter((m) => m.status === 'UPCOMING');

  const filteredMatches = matches.filter((m) => {
    // Strictly exclude any finished match
    if (m.status === 'FINISHED') return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchSearchText = `${m.homeTeam.name} ${m.homeTeam.nameAr} ${m.homeTeam.shortName} ${m.awayTeam.name} ${m.awayTeam.nameAr} ${m.awayTeam.shortName} ${m.leagueName} ${m.leagueNameAr}`.toLowerCase();
      if (!matchSearchText.includes(q)) return false;
    }
    if (selectedDateId === 'TODAY') {
      if (m.date !== todayStr) return false;
    } else if (selectedDateId === 'TOMORROW') {
      if (m.date !== tomorrowStr) return false;
    } else if (selectedDateId !== 'ALL' && m.date !== selectedDateId) {
      return false;
    }
    if (filterFavoritesOnly && !isMatchFavorite(m)) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (selectedLeagueId !== 'ALL' && m.leagueId !== selectedLeagueId) return false;
    return true;
  });

  return (
    <div className="space-y-4 pb-24">
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

      {/* 2. Web Push Notifications Hero Bar */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900/90 border border-emerald-500/40 rounded-3xl p-3.5 sm:p-4 px-4 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm flex-shrink-0">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">
                {isArabic ? 'إشعارات الدفع الفورية (Web Push)' : 'Web Push Instant Notifications'}
              </span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                {isArabic ? 'مباشر 🟢' : 'Active 🟢'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {isArabic
                ? 'استقبل أهداف ونتائج مبارياتك المباشرة بصوت الصافرة حتى لو كان التطبيق مغلقاً 📱'
                : 'Receive live goal alerts with whistle sounds even when the app is closed 📱'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPushModal && (
            <button
              type="button"
              onClick={onOpenPushModal}
              className="min-h-[38px] px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 text-slate-950" />
              <span>{isArabic ? 'تفعيل وتجربة الإشعار 🔔' : 'Enable & Test Push 🔔'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSyncMatches}
            className="min-h-[38px] px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
            title={isArabic ? 'مزامنة وتنظيف المباريات فوراً' : 'Force Sync Matches'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{isArabic ? 'مزامنة فورية' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {syncToast && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* 3. ⭐ Prominent Upcoming Matches Playing Soon Shelf */}
      {/* Shows prominently when viewing all or upcoming */}
      {(statusFilter === 'ALL' || statusFilter === 'UPCOMING') && (
        <UpcomingSoonShelf
          matches={matches}
          onSelectMatch={onSelectMatch}
          isArabic={isArabic}
          onOpenPushModal={onOpenPushModal || (() => {})}
          favoriteTeamIds={favoriteTeamIds}
        />
      )}

      {/* 4. Large Artistic Segmented Status & Date Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-0.5">
        {/* Status Filters (Large, high-contrast pills) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#151a24] rounded-2xl border border-[#2a3441] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`min-h-[38px] px-4 text-xs font-black rounded-xl transition-all whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{isArabic ? 'جميع المباريات' : 'All Matches'}</span>
            <span className="ms-1 text-[11px] opacity-70">({matches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('LIVE')}
            className={`min-h-[38px] px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              statusFilter === 'LIVE'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>{isArabic ? 'مباشر الآن' : 'Live Now'}</span>
            <span className="ms-0.5 text-[11px] font-mono">({liveMatches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('UPCOMING')}
            className={`min-h-[38px] px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              statusFilter === 'UPCOMING'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isArabic ? 'ستلعب قريباً' : 'Playing Soon'}</span>
            <span className="ms-0.5 text-[11px] font-mono">({upcomingMatches.length})</span>
          </button>
        </div>

        {/* Date Selector Row & Search Button */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#151a24] rounded-2xl border border-[#2a3441] overflow-x-auto no-scrollbar">
          {dates.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDateId(d.id)}
              className={`min-h-[38px] px-3.5 text-xs font-black rounded-xl transition-all whitespace-nowrap ${
                selectedDateId === d.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isArabic ? d.labelAr : d.labelEn}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className={`min-h-[38px] min-w-[38px] px-2.5 rounded-xl flex items-center justify-center transition-all ${
              showSearch ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title={isArabic ? 'بحث' : 'Search'}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Search Bar */}
      {(showSearch || searchQuery) && (
        <div className="relative animate-in fade-in duration-200">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isArabic
                ? 'ابحث عن مباراة (ريال مدريد، الهلال، النصر، برشلونة، ليفربول، منتخبات)...'
                : 'Search match by team (Real Madrid, Al Hilal, Barcelona)...'
            }
            className="w-full min-h-[46px] ps-11 pe-11 bg-[#151a24] border border-[#2a3441] rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[46px] min-w-[46px] absolute top-1/2 -translate-y-1/2 end-0 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 6. Match Cards List (Large, legible and spacious) */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-14 bg-[#151a24] rounded-3xl border border-[#2a3441] p-6 space-y-3 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400 text-2xl">
              ⭐
            </div>
            <div>
              <p className="text-base font-black text-white">
                {filterFavoritesOnly
                  ? (isArabic ? 'لا توجد مباريات جارية لفرقك المفضلة حالياً' : 'No matches for favorite teams')
                  : (isArabic ? 'لا توجد مباريات مطابقة لهذا الفلتر' : 'No matches found')}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {isArabic
                  ? 'جرب اختيار يوم آخر أو الضغط على "جميع المباريات" لعرض كافة المباريات الجارية والقادمة'
                  : 'Try selecting another day or click "All Matches"'}
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
              className="min-h-[42px] px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs rounded-xl border border-slate-700 transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <span>{isArabic ? 'عرض جميع المباريات الآن' : 'Show All Matches Now'}</span>
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
                onOpenPushModal={onOpenPushModal}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
