import React from 'react';
import { Star, Trophy, Globe, Flame } from 'lucide-react';

interface LeaguesBarProps {
  selectedLeagueId: string;
  onSelectLeague: (leagueId: string) => void;
  isArabic: boolean;
  filterFavoritesOnly?: boolean;
  onToggleFilterFavorites?: () => void;
  favoriteMatchesCount?: number;
}

export const LeaguesBar: React.FC<LeaguesBarProps> = ({
  selectedLeagueId,
  onSelectLeague,
  isArabic,
  filterFavoritesOnly = false,
  onToggleFilterFavorites,
  favoriteMatchesCount = 0,
}) => {
  const leagues = [
    {
      id: 'ALL',
      nameAr: 'جميع الدوريات',
      nameEn: 'All Leagues',
      icon: '⚽',
    },
    {
      id: 'spl',
      nameAr: 'دوري روشن',
      nameEn: 'Saudi Pro League',
      icon: '🇸🇦',
      badge: 'روشن',
    },
    {
      id: 'ucl',
      nameAr: 'أبطال أوروبا',
      nameEn: 'Champions League',
      icon: '⭐',
      badge: 'UCL',
    },
    {
      id: 'epl',
      nameAr: 'الدوري الإنجليزي',
      nameEn: 'Premier League',
      icon: '🦁',
      badge: 'EPL',
    },
    {
      id: 'laliga',
      nameAr: 'الدوري الإسباني',
      nameEn: 'La Liga',
      icon: '🇪🇸',
      badge: 'لا ليغا',
    },
    {
      id: 'international',
      nameAr: 'منتخبات العالم',
      nameEn: 'World Teams',
      icon: '🌍',
      badge: 'FIFA',
    },
    {
      id: 'womens',
      nameAr: 'دوري السيدات',
      nameEn: 'Women Pro League',
      icon: '✨',
      badge: 'سيدات',
    },
  ];

  return (
    <div className="py-2">
      {/* Sleek single-row league scroller with comfortable pill design */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-0.5">
        {/* Favorites Filter Pill */}
        {onToggleFilterFavorites && (
          <button
            type="button"
            onClick={onToggleFilterFavorites}
            className={`h-10 px-4 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap border flex-shrink-0 active:scale-95 shadow-sm ${
              filterFavoritesOnly
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                : 'bg-slate-900/80 text-slate-300 border-white/5 hover:border-amber-400/40 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterFavoritesOnly ? 'fill-slate-950' : 'text-amber-400'}`} />
            <span>{isArabic ? 'الفرق المفضلة' : 'Favorites'}</span>
            {favoriteMatchesCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  filterFavoritesOnly ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {favoriteMatchesCount}
              </span>
            )}
          </button>
        )}

        {/* Dynamic League Pills */}
        {leagues.map((league) => {
          const isSelected = !filterFavoritesOnly && selectedLeagueId === league.id;
          return (
            <button
              key={league.id}
              type="button"
              onClick={() => {
                if (filterFavoritesOnly && onToggleFilterFavorites) {
                  onToggleFilterFavorites();
                }
                onSelectLeague(league.id);
              }}
              className={`h-10 px-4 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border flex-shrink-0 active:scale-95 shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-300 border-white/5 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="text-sm filter drop-shadow">{league.icon}</span>
              <span>{isArabic ? league.nameAr : league.nameEn}</span>
              {league.badge && !isSelected && (
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono hidden sm:inline">
                  {league.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
