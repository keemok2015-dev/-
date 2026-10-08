import React from 'react';
import { X, Star, BellRing, Clock, AlertCircle } from 'lucide-react';

export type MatchAlertType =
  | 'GOAL'
  | 'RED_CARD'
  | 'YELLOW_CARD'
  | 'SUB'
  | 'PRE_MATCH_10M'
  | 'VAR'
  | 'KICKOFF';

export interface GoalAlert {
  id: string;
  matchTitle: string;
  minute: number;
  scorer: string;
  team: string;
  scoreText: string;
  isFavorite?: boolean;
  isInfoMessage?: boolean;
  alertType?: MatchAlertType;
  detail?: string;
}

interface NotificationBannerProps {
  alert: GoalAlert | null;
  onClose: () => void;
  isArabic: boolean;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  alert,
  onClose,
  isArabic,
}) => {
  if (!alert) return null;

  // 1. General Info Toast
  if (alert.isInfoMessage) {
    return (
      <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto animate-bounce-short">
        <div className="bg-[#111927] text-white rounded-2xl p-3.5 shadow-xl shadow-black/70 border border-emerald-500/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 text-xl">
              🔔
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                {alert.scorer}
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {alert.matchTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Pre-Match 10-Minute Kickoff Alert (تنبيه قبل بداية المباراة بـ 10 دقائق)
  if (alert.alertType === 'PRE_MATCH_10M') {
    return (
      <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto animate-bounce-short">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 border border-blue-400 text-white rounded-2xl p-3.5 shadow-2xl shadow-blue-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-300/40 flex items-center justify-center text-xl flex-shrink-0 animate-pulse">
              ⏰
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white">
                  {isArabic ? 'تنبيه انطلاق المباراة بعد 10 دقائق ⏰' : 'Kickoff in 10 Minutes!'}
                </span>
                {alert.isFavorite && (
                  <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-slate-950" />
                    <span>{isArabic ? 'فريقك المفضل' : 'Favorite'}</span>
                  </span>
                )}
              </div>
              <p className="text-sm font-black text-white mt-1 leading-tight">
                {alert.matchTitle}
              </p>
              <p className="text-[11px] text-blue-100 font-medium mt-0.5">
                {alert.scorer || (isArabic ? 'استعد لمتابعة اللقاء والبث المباشر الآن' : 'Get ready for kickoff')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 3. Red Card Alert (بطاقة حمراء)
  if (alert.alertType === 'RED_CARD') {
    return (
      <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto animate-bounce-short">
        <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-900 border border-red-400 text-white rounded-2xl p-3.5 shadow-2xl shadow-red-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center text-2xl flex-shrink-0 animate-bounce">
              🟥
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full text-white">
                  {isArabic ? 'بطاقة حمراء - طرد!' : 'RED CARD!'}
                </span>
                <span className="text-xs font-bold text-white/90 tabular-nums">
                  {alert.minute}'
                </span>
              </div>
              <p className="text-sm font-black text-white mt-0.5 leading-tight">
                {alert.scorer} ({alert.team})
              </p>
              <p className="text-[11px] text-white/90 font-medium">
                {alert.matchTitle} · {alert.detail || (isArabic ? 'طرد مباشر بالبطاقة الحمراء' : 'Direct Red Card')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 4. Yellow Card Alert (بطاقة صفراء)
  if (alert.alertType === 'YELLOW_CARD') {
    return (
      <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto animate-bounce-short">
        <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-slate-900 border border-yellow-400 text-white rounded-2xl p-3.5 shadow-2xl shadow-amber-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center text-2xl flex-shrink-0">
              🟨
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full text-white">
                  {isArabic ? 'إنذار - بطاقة صفراء' : 'YELLOW CARD'}
                </span>
                <span className="text-xs font-bold text-white/90 tabular-nums">
                  {alert.minute}'
                </span>
              </div>
              <p className="text-sm font-black text-white mt-0.5 leading-tight">
                {alert.scorer} ({alert.team})
              </p>
              <p className="text-[11px] text-yellow-100 font-medium">
                {alert.matchTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 5. VAR Decision Alert (تقنية الفيديو)
  if (alert.alertType === 'VAR') {
    return (
      <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto animate-bounce-short">
        <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-slate-900 border border-purple-400 text-white rounded-2xl p-3.5 shadow-2xl shadow-purple-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center text-xl flex-shrink-0 animate-pulse">
              📺
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/40 px-2 py-0.5 rounded-full text-white">
                  {isArabic ? 'قرار حكم الفيديو VAR' : 'VAR REVIEW'}
                </span>
                <span className="text-xs font-bold text-white/90 tabular-nums">
                  {alert.minute}'
                </span>
              </div>
              <p className="text-sm font-black text-white mt-0.5 leading-tight">
                {alert.scorer}
              </p>
              <p className="text-[11px] text-purple-100 font-medium">
                {alert.matchTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 6. Substitution Alert (تبديل لاعب)
  if (alert.alertType === 'SUB') {
    return (
      <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto animate-bounce-short">
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 border border-slate-600 text-white rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center text-xl flex-shrink-0">
              🔄
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full text-white">
                  {isArabic ? 'تبديل لاعب' : 'SUBSTITUTION'}
                </span>
                <span className="text-xs font-bold text-white/90 tabular-nums">
                  {alert.minute}'
                </span>
              </div>
              <p className="text-sm font-black text-white mt-0.5 leading-tight">
                {alert.scorer} ({alert.team})
              </p>
              <p className="text-[11px] text-slate-300 font-medium">
                {alert.matchTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 7. Goal Alert (Default standard)
  return (
    <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto animate-bounce-short">
      <div
        className={`rounded-2xl p-3.5 shadow-xl border flex items-center justify-between gap-3 text-white ${
          alert.isFavorite
            ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 shadow-amber-950/70 border-amber-300/50'
            : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 shadow-emerald-950/60 border-emerald-400/40'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center text-lg flex-shrink-0 animate-bounce">
            {alert.isFavorite ? '⭐' : '⚽'}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 px-1.5 py-0.5 rounded text-white">
                {isArabic ? 'هدف مؤكد!' : 'GOAL!'}
              </span>
              <span className="text-xs font-bold text-white/90 tabular-nums">
                {alert.minute}'
              </span>
              {alert.isFavorite && (
                <span className="text-[10px] font-black bg-black/40 text-amber-200 px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300/40">
                  <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                  <span>{isArabic ? 'فريقك المفضل' : 'Favorite Team'}</span>
                </span>
              )}
            </div>
            <p className="text-sm font-black text-white mt-0.5 leading-tight">
              {alert.scorer} ({alert.team})
            </p>
            <p className="text-[11px] text-white/90 font-medium">
              {alert.matchTitle} · {alert.scoreText}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
