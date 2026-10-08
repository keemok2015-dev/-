import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Shield,
  User,
  Smartphone,
  BellRing,
  Search,
  Star,
  Trophy,
  Flame,
  Radio,
  Tv,
  X,
} from 'lucide-react';
import { UserProfile } from './UserAuthModal';
import { TabType } from './BottomNavBar';

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
  onOpenPushModal?: () => void;
  currentTab?: TabType;
  onSelectTab?: (tab: TabType) => void;
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
  onOpenPushModal,
  currentTab = 'matches',
  onSelectTab,
}) => {
  return (
    <header className="app-header sticky top-0 z-40 bg-[#060913]/90 backdrop-blur-2xl border-b border-white/5 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* 1. Brand Zone (Wordmark + Live Status) */}
        <div className="flex items-center gap-3">
          {/* Stylized Brand Emblem */}
          <div
            onClick={onOpenAdmin}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 p-0.5 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            title={isArabic ? 'كورة لايف - لوحة التحكم' : 'KoraLive - Dashboard'}
          >
            <div className="w-full h-full rounded-[14px] bg-[#060913]/80 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl">⚽</span>
            </div>
          </div>

          <div
            className="cursor-pointer select-none"
            onClick={() => onSelectTab && onSelectTab('matches')}
          >
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-none font-['Cairo']">
                {isArabic ? 'كورة لايف' : 'KoraLive'}
              </h1>
              {liveMatchCount > 0 && (
                <span className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{liveMatchCount} {isArabic ? 'مباشر' : 'LIVE'}</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
              {isArabic ? 'المباريات المباشرة والنتائج والتشكيلات' : 'Live Football, Lineups & Scores'}
            </p>
          </div>
        </div>

        {/* 2. Desktop Navigation Links (Hidden on small mobile screens, shown on md+) */}
        {onSelectTab && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-white/5 p-1 rounded-2xl backdrop-blur-md">
            {[
              { id: 'matches' as TabType, labelAr: 'المباريات', labelEn: 'Matches' },
              { id: 'standings' as TabType, labelAr: 'جدول الترتيب', labelEn: 'Standings' },
              { id: 'broadcast' as TabType, labelAr: 'القنوات الناقلة', labelEn: 'Broadcast' },
              { id: 'motm' as TabType, labelAr: 'نجم المباراة', labelEn: 'MOTM' },
            ].map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {isArabic ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </nav>
        )}

        {/* 3. Action Cluster (Push Notifications, Theme, Favorites, User) */}
        <div className="flex items-center gap-2">
          {/* Prominent Web Push Button */}
          {onOpenPushModal && (
            <button
              type="button"
              onClick={onOpenPushModal}
              className="min-h-[38px] px-3 sm:px-3.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              title={isArabic ? 'إشعارات الدفع الفورية للأهداف والنتائج' : 'Web Push Live Alerts'}
            >
              <BellRing className="w-3.5 h-3.5 text-emerald-400 animate-pulse flex-shrink-0" />
              <span className="hidden sm:inline font-bold">
                {isArabic ? 'إشعارات الدفع' : 'Push Alerts'}
              </span>
            </button>
          )}

          {/* Favorites Filter Quick Button */}
          <button
            type="button"
            onClick={onOpenFavorites}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-900/80 border border-slate-700/60 hover:border-amber-400/50 flex items-center justify-center text-slate-300 hover:text-amber-300 transition-all active:scale-95 shadow-sm"
            title={isArabic ? 'الفرق المفضلة' : 'Favorite Teams'}
          >
            <Star className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-900/80 border border-slate-700/60 hover:border-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
            title={isDarkMode ? (isArabic ? 'الوضع النهاري ☀️' : 'Light Mode ☀️') : (isArabic ? 'الوضع الليلي 🌙' : 'Dark Mode 🌙')}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* User Profile / Auth Button */}
          {onOpenUserAuth && (
            <button
              type="button"
              onClick={onOpenUserAuth}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border flex items-center justify-center transition-all active:scale-95 shadow-sm ${
                userProfile?.isLoggedIn
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
              title={
                userProfile?.isLoggedIn
                  ? (isArabic ? `المشجع: ${userProfile.name}` : `Fan: ${userProfile.name}`)
                  : (isArabic ? 'تسجيل الدخول' : 'Sign In')
              }
            >
              <User className="w-4 h-4" />
            </button>
          )}

          {/* Multi-Platform App Install Modal Trigger */}
          {onOpenPublishModal && (
            <button
              type="button"
              onClick={onOpenPublishModal}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-900/80 border border-slate-700/60 hover:border-teal-400/50 flex items-center justify-center text-teal-300 hover:text-white transition-all active:scale-95 shadow-sm hidden sm:flex"
              title={isArabic ? 'تثبيت التطبيق على الهواتف والكمبيوتر 📲' : 'Install PWA & Mobile App 📲'}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          )}

          {/* Owner Earnings (if authenticated) */}
          {isAdminAuthenticated && (
            <button
              type="button"
              onClick={onOpenEarnings}
              className="h-9 sm:h-10 px-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-black shadow-lg active:scale-95"
              title={isArabic ? 'لوحة الأرباح والسحب 💰' : 'Earnings Dashboard 💰'}
            >
              <span>💰</span>
              <span className="hidden sm:inline">{isArabic ? 'الأرباح' : 'Earnings'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
