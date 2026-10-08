import React from 'react';

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
  return (
    <div className="space-y-2 px-3 py-1">
      {/* Row 1: Featured Quick Icon Badges (As seen in screenshot) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 justify-start">
        {/* UK Lion Badge */}
        <button
          type="button"
          onClick={() => onSelectLeague('epl')}
          className={`h-11 px-3.5 rounded-2xl border transition-all flex items-center gap-1.5 text-base whitespace-nowrap ${
            selectedLeagueId === 'epl'
              ? 'bg-[#121824] border-[#00e676] shadow-[0_0_15px_rgba(0,230,118,0.35)]'
              : 'bg-[#1e293b]/80 border-slate-700/60 hover:bg-[#1e293b]'
          }`}
          title="Premier League"
        >
          <span>🇬🇧</span>
          <span>🦁</span>
        </button>

        {/* Featured Neon Pill: دوري روشن */}
        <button
          type="button"
          onClick={() => onSelectLeague('spl')}
          className={`h-11 px-5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-lg ${
            selectedLeagueId === 'spl'
              ? 'bg-[#121824] text-[#00e676] border-2 border-[#00e676] shadow-[0_0_18px_rgba(0,230,118,0.45)]'
              : 'bg-[#1e293b]/80 text-slate-300 border border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <span>دوري روشن</span>
        </button>

        {/* Spain Bull Badge */}
        <button
          type="button"
          onClick={() => onSelectLeague('laliga')}
          className={`h-11 px-3.5 rounded-2xl border transition-all flex items-center gap-1.5 text-base whitespace-nowrap ${
            selectedLeagueId === 'laliga'
              ? 'bg-[#121824] border-[#00e676] shadow-[0_0_15px_rgba(0,230,118,0.35)]'
              : 'bg-[#1e293b]/80 border-slate-700/60 hover:bg-[#1e293b]'
          }`}
          title="La Liga"
        >
          <span>🇪🇸</span>
          <span>🐂</span>
        </button>

        {/* Saudi World Badge */}
        <button
          type="button"
          onClick={() => onSelectLeague('spl')}
          className="h-11 px-3.5 rounded-2xl bg-[#1e293b]/80 border border-slate-700/60 hover:bg-[#1e293b] transition-all flex items-center gap-1.5 text-base whitespace-nowrap"
          title="Saudi League"
        >
          <span>🇸🇦</span>
          <span>⚔️</span>
        </button>

        {/* World National Teams Quick Badge */}
        <button
          type="button"
          onClick={() => onSelectLeague('international')}
          className={`h-11 px-3.5 rounded-2xl border transition-all flex items-center gap-1.5 text-base whitespace-nowrap ${
            selectedLeagueId === 'international'
              ? 'bg-[#121824] border-[#00e676] shadow-[0_0_15px_rgba(0,230,118,0.35)]'
              : 'bg-[#1e293b]/80 border-slate-700/60 hover:bg-[#1e293b]'
          }`}
          title="World National Teams"
        >
          <span>🌍</span>
          <span>🏆</span>
        </button>
      </div>

      {/* Row 2: Standard League Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 justify-start">
        {/* All Leagues Pill */}
        <button
          type="button"
          onClick={() => onSelectLeague('ALL')}
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            selectedLeagueId === 'ALL'
              ? 'bg-[#121824] text-[#00e676] border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
              : 'bg-[#1e293b]/80 text-[#9ca3af] border-transparent hover:text-white'
          }`}
        >
          <span>🌍</span>
          <span>{isArabic ? 'الكل' : 'All'}</span>
        </button>

        {/* International World Teams Pill */}
        <button
          type="button"
          onClick={() => onSelectLeague('international')}
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            selectedLeagueId === 'international'
              ? 'bg-[#121824] text-[#00e676] border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
              : 'bg-[#1e293b]/80 text-[#9ca3af] border-transparent hover:text-white'
          }`}
        >
          <span>🌍</span>
          <span>{isArabic ? 'منتخبات العالم' : 'World Teams'}</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">
            {isArabic ? 'تصفيات ودولية' : 'FIFA'}
          </span>
        </button>

        {/* Saudi Pro League Pill */}
        <button
          type="button"
          onClick={() => onSelectLeague('spl')}
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            selectedLeagueId === 'spl'
              ? 'bg-[#121824] text-[#00e676] border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
              : 'bg-[#1e293b]/80 text-[#9ca3af] border-transparent hover:text-white'
          }`}
        >
          <span>🇸🇦</span>
          <span>{isArabic ? 'دوري روشن' : 'Saudi League'}</span>
        </button>

        {/* La Liga Pill */}
        <button
          type="button"
          onClick={() => onSelectLeague('laliga')}
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            selectedLeagueId === 'laliga'
              ? 'bg-[#121824] text-[#00e676] border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
              : 'bg-[#1e293b]/80 text-[#9ca3af] border-transparent hover:text-white'
          }`}
        >
          <span>🇪🇸</span>
          <span>{isArabic ? 'لا ليغا' : 'La Liga'}</span>
        </button>

        {/* Premier League Pill */}
        <button
          type="button"
          onClick={() => onSelectLeague('epl')}
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            selectedLeagueId === 'epl'
              ? 'bg-[#121824] text-[#00e676] border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
              : 'bg-[#1e293b]/80 text-[#9ca3af] border-transparent hover:text-white'
          }`}
        >
          <span>🏴</span>
          <span>{isArabic ? 'البريميرليغ' : 'Premier League'}</span>
        </button>

        {/* Serie A Pill */}
        <button
          type="button"
          onClick={() => onSelectLeague('seriea')}
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            selectedLeagueId === 'seriea'
              ? 'bg-[#121824] text-[#00e676] border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
              : 'bg-[#1e293b]/80 text-[#9ca3af] border-transparent hover:text-white'
          }`}
        >
          <span>🇮🇹</span>
          <span>{isArabic ? 'الكالتشيو' : 'Serie A'}</span>
        </button>

        {/* UEFA Champions League Pill */}
        <button
          type="button"
          onClick={() => onSelectLeague('ucl')}
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            selectedLeagueId === 'ucl'
              ? 'bg-[#121824] text-[#00e676] border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
              : 'bg-[#1e293b]/80 text-[#9ca3af] border-transparent hover:text-white'
          }`}
        >
          <span>⭐</span>
          <span>{isArabic ? 'أبطال أوروبا' : 'Champions League'}</span>
        </button>

        {/* Saudi Women's Premier League Pill (للمعرفة) */}
        <button
          type="button"
          onClick={() => onSelectLeague('womens')}
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            selectedLeagueId === 'womens'
              ? 'bg-[#121824] text-[#00e676] border-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
              : 'bg-[#1e293b]/80 text-[#9ca3af] border-transparent hover:text-white'
          }`}
        >
          <span>🇸🇦</span>
          <span>{isArabic ? 'الدوري النسائي (للمعرفة)' : 'Women League (Info)'}</span>
        </button>
      </div>
    </div>
  );
};
