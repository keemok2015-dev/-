import React from 'react';
import { Sun, Moon, Shield, User, Smartphone } from 'lucide-react';
import { UserProfile } from './UserAuthModal';

interface HeaderProps {
  isArabic: boolean;
  onToggleLanguage: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  liveMatchCount: number;
  isSubscribed: boolean;
  onOpenSubscription: () => void;
  onOpenTerms: () => void;
  favoriteCount: number;
  onlyNotifyFavorites: boolean;
  onOpenFavorites: () => void;
  onOpenAdmin: () => void;
  onToggleSearch?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isAdminAuthenticated: boolean;
  onOpenEarnings: () => void;
  userProfile?: UserProfile | null;
  onOpenUserAuth?: () => void;
  onOpenPublishModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isArabic,
  onToggleLanguage,
  isSoundEnabled,
  onToggleSound,
  isMobileFrame,
  onToggleFrame,
  liveMatchCount,
  isSubscribed,
  onOpenSubscription,
  onOpenTerms,
  favoriteCount,
  onlyNotifyFavorites,
  onOpenFavorites,
  onOpenAdmin,
  onToggleSearch,
  isDarkMode,
  onToggleTheme,
  isAdminAuthenticated,
  onOpenEarnings,
  userProfile,
  onOpenUserAuth,
  onOpenPublishModal,
}) => {
  return (
    <header className="app-header px-4 pt-3 pb-2 flex items-center justify-between transition-colors">
      {/* 1. Metallic Glassmorphic Action Buttons (Left in RTL) */}
      <div className="flex items-center gap-2">
        {/* Dark / Light Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-2xl bg-gradient-to-b from-slate-700/80 via-slate-800/90 to-slate-900 border border-slate-600/50 shadow-lg flex items-center justify-center text-lg active:scale-95 transition-all text-amber-300 hover:text-amber-200"
          title={isDarkMode ? (isArabic ? 'التبديل إلى الوضع النهاري ☀️' : 'Switch to Light Mode ☀️') : (isArabic ? 'التبديل إلى الوضع الليلي 🌙' : 'Switch to Dark Mode 🌙')}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-400" />
          )}
        </button>

        {/* User Account Button (Optional login) */}
        <button
          type="button"
          onClick={onOpenUserAuth}
          className={`w-10 h-10 rounded-2xl border shadow-lg flex items-center justify-center text-sm active:scale-95 transition-all ${
            userProfile?.isLoggedIn
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
              : 'bg-gradient-to-b from-slate-700/80 via-slate-800/90 to-slate-900 border-slate-600/50 text-slate-300 hover:text-white'
          }`}
          title={
            userProfile?.isLoggedIn
              ? (isArabic ? `حساب المشجع: ${userProfile.name}` : `User: ${userProfile.name}`)
              : (isArabic ? 'تسجيل الدخول (اختياري)' : 'Sign In (Optional)')
          }
        >
          <User className="w-4 h-4" />
        </button>

        {/* Multi-Platform App Install / Publish Button */}
        {onOpenPublishModal && (
          <button
            type="button"
            onClick={onOpenPublishModal}
            className="w-10 h-10 rounded-2xl bg-gradient-to-b from-emerald-600/40 via-teal-700/50 to-emerald-900 border border-emerald-500/60 shadow-lg flex items-center justify-center text-emerald-300 hover:text-white active:scale-95 transition-all"
            title={isArabic ? 'نشر وتثبيت التطبيق على جميع المنصات (أندرويد، آيفون، كمبيوتر) 📲' : 'Install on Android, iOS & PC 📲'}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </button>
        )}

        {/* Notification Bell with Red Badge */}
        <button
          type="button"
          onClick={onOpenFavorites}
          className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-slate-700/80 via-slate-800/90 to-slate-900 border border-slate-600/50 shadow-lg flex items-center justify-center text-lg active:scale-95 transition-transform"
          title={isArabic ? 'التنبيهات والمفضلة' : 'Notifications & Favorites'}
        >
          <span className="text-xl filter drop-shadow">🔔</span>
          <span className="absolute -top-1.5 -end-1.5 bg-[#ff3b30] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-slate-900 animate-pulse">
            {favoriteCount > 0 ? favoriteCount : 4}
          </span>
        </button>

        {/* Search Button */}
        <button
          type="button"
          onClick={onToggleSearch}
          className="w-10 h-10 rounded-2xl bg-gradient-to-b from-slate-700/80 via-slate-800/90 to-slate-900 border border-slate-600/50 shadow-lg flex items-center justify-center text-lg active:scale-95 transition-transform"
          title={isArabic ? 'بحث' : 'Search'}
        >
          <span className="text-lg filter drop-shadow">🔍</span>
        </button>
      </div>

      {/* 2. Brand Zone (Right in RTL): Title & Controls */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex flex-col text-right cursor-pointer select-none group"
          onClick={onOpenEarnings}
          title={isArabic ? 'كورة لايف' : 'KoraLive'}
        >
          <h1 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">
            {isArabic ? 'كورة لايف' : 'KoraLive'}
          </h1>
          <p className="text-xs text-[#9ca3af] font-medium mt-0.5">
            {isArabic ? 'مباشر المباريات والنتائج' : 'Live Football Matches'}
          </p>
        </div>

        {/* Hidden Owner Earnings Button - ONLY appears when authenticated as Owner */}
        {isAdminAuthenticated && (
          <button
            type="button"
            onClick={onOpenEarnings}
            className="h-10 px-3 rounded-2xl bg-gradient-to-r from-emerald-500/25 via-emerald-500/35 to-teal-500/25 border border-emerald-400/70 text-emerald-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-black shadow-lg shadow-emerald-950/40 active:scale-95 animate-in fade-in"
            title={isArabic ? 'لوحة الأرباح والسحب البنكي (المالك) 💰' : 'Owner Earnings & Bank Payouts 💰'}
          >
            <span className="text-sm">💰</span>
            <span className="font-bold">{isArabic ? 'الأرباح' : 'Earnings'}</span>
          </button>
        )}

        {/* Emerald Green Trophy Icon */}
        <button
          type="button"
          onClick={onOpenAdmin}
          className="w-11 h-11 rounded-2xl bg-[#00e676]/25 hover:bg-[#00e676]/35 border border-[#00e676]/50 flex items-center justify-center text-2xl shadow-lg shadow-[#00e676]/15 transition-transform active:scale-95"
          title={isArabic ? 'لوحة التحكم الإدارية' : 'Admin Panel'}
        >
          🏆
        </button>
      </div>
    </header>
  );
};
