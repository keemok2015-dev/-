import React, { useState, useMemo } from 'react';
import {
  X,
  Star,
  Search,
  Bell,
  BellRing,
  Check,
  Shield,
  Sparkles,
  Trophy,
  Filter,
} from 'lucide-react';
import { POPULAR_TEAMS, FavoriteTeam } from '../data/favoriteTeamsData';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteTeamIds: string[];
  onToggleFavorite: (teamId: string) => void;
  onSetFavorites: (teamIds: string[]) => void;
  onlyNotifyFavorites: boolean;
  onToggleOnlyNotifyFavorites: () => void;
  isArabic: boolean;
  onViewFavoriteMatches?: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favoriteTeamIds,
  onToggleFavorite,
  onSetFavorites,
  onlyNotifyFavorites,
  onToggleOnlyNotifyFavorites,
  isArabic,
  onViewFavoriteMatches,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');

  if (!isOpen) return null;

  const leagues = [
    { id: 'ALL', nameAr: 'جميع الدوريات', nameEn: 'All Leagues' },
    { id: 'spl', nameAr: 'دوري روشن 🇸🇦', nameEn: 'Saudi League 🇸🇦' },
    { id: 'laliga', nameAr: 'الدوري الإسباني 🇪🇸', nameEn: 'La Liga 🇪🇸' },
    { id: 'epl', nameAr: 'الدوري الإنجليزي 🦁', nameEn: 'Premier League 🦁' },
    { id: 'seriea', nameAr: 'الدوري الإيطالي 🇮🇹', nameEn: 'Serie A 🇮🇹' },
  ];

  const filteredTeams = POPULAR_TEAMS.filter((team) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.nameAr.includes(searchQuery) ||
      team.shortName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLeague =
      selectedLeague === 'ALL' || team.leagueId === selectedLeague;

    return matchesSearch && matchesLeague;
  });

  const favoriteCount = favoriteTeamIds.length;

  const handleSelectAllInView = () => {
    const idsInView = filteredTeams.map((t) => t.id);
    const newFavorites = Array.from(new Set([...favoriteTeamIds, ...idsInView]));
    onSetFavorites(newFavorites);
  };

  const handleClearAllFavorites = () => {
    onSetFavorites([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border-t sm:border border-amber-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-amber-950/30">
        {/* Grab Handle for Mobile */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 flex-shrink-0" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 flex-shrink-0 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {isArabic ? 'الفرق المفضلة والتنبيهات المخصصة' : 'Favorite Teams & Custom Alerts'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isArabic
                  ? `تم تحديد ${favoriteCount} فريق في قائمتك المفضلة`
                  : `${favoriteCount} teams selected in favorites`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Custom Notification Filter Feature Card */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-4 shadow-md">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                    <span>{isArabic ? 'تنبيهات مخصصة لمباريات فرقي المفضلة فقط' : 'Notifications for Favorites Only'}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-full font-bold">
                      {onlyNotifyFavorites ? (isArabic ? 'مفعّل' : 'ON') : (isArabic ? 'معطل' : 'OFF')}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {isArabic
                      ? 'عند التفعيل، ستصلك إشعارات الأهداف المباشرة وصافرة الحكم فقط عند لعب الفرق التي حفظتها أدناه.'
                      : 'When enabled, live goal alerts and whistle sounds trigger only when your saved teams play.'}
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={onlyNotifyFavorites}
                onClick={onToggleOnlyNotifyFavorites}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  onlyNotifyFavorites ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    onlyNotifyFavorites ? (isArabic ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث عن ناديك (الهلال، ريال مدريد، أرسنال...)' : 'Search team (Al-Hilal, Real Madrid, Arsenal...)'}
              className="w-full min-h-[44px] ps-10 pe-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 transition-all"
            />
          </div>

          {/* League Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {leagues.map((lg) => {
              const isActive = selectedLeague === lg.id;
              return (
                <button
                  key={lg.id}
                  onClick={() => setSelectedLeague(lg.id)}
                  className={`min-h-[36px] px-3 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/40'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {isArabic ? lg.nameAr : lg.nameEn}
                </button>
              );
            })}
          </div>

          {/* Quick bulk actions */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              {isArabic ? `عرض ${filteredTeams.length} نادٍ` : `Showing ${filteredTeams.length} teams`}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSelectAllInView}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                {isArabic ? 'تحديد الكل هنا' : 'Select all shown'}
              </button>
              <button
                type="button"
                onClick={handleClearAllFavorites}
                className="text-slate-500 hover:text-red-400 font-medium"
              >
                {isArabic ? 'مسح التحديد' : 'Clear all'}
              </button>
            </div>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredTeams.map((team) => {
              const isFav = favoriteTeamIds.includes(team.id);
              return (
                <div
                  key={team.id}
                  onClick={() => onToggleFavorite(team.id)}
                  className={`cursor-pointer rounded-2xl p-3 border transition-all flex items-center justify-between gap-3 ${
                    isFav
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                      {team.logo}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>{isArabic ? team.nameAr : team.name}</span>
                        {isFav && (
                          <span className="text-[10px] text-amber-400 font-normal">⭐</span>
                        )}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {isArabic ? team.leagueNameAr : team.leagueName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(team.id);
                    }}
                    className={`min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center transition-all ${
                      isFav
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700'
                    }`}
                    title={isFav ? (isArabic ? 'إزالة من المفضلة' : 'Remove') : (isArabic ? 'إضافة للمفضلة' : 'Add')}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-slate-950 text-slate-950' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center gap-2.5 bg-slate-900/60 flex-shrink-0">
          {onViewFavoriteMatches && (
            <button
              onClick={() => {
                onClose();
                onViewFavoriteMatches();
              }}
              className="flex-1 min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40"
            >
              <Trophy className="w-4 h-4 fill-slate-950" />
              <span>{isArabic ? 'عرض مباريات فرقي المفضلة' : 'View Favorites Fixtures'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="min-h-[44px] px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700/80"
          >
            {isArabic ? 'تم' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
