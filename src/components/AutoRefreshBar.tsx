import React from 'react';
import { RefreshCw, Play, Pause, Clock, Zap } from 'lucide-react';

interface AutoRefreshBarProps {
  isAutoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  secondsRemaining: number;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  lastUpdatedTime: string;
  isArabic: boolean;
}

export const AutoRefreshBar: React.FC<AutoRefreshBarProps> = ({
  isAutoRefresh,
  onToggleAutoRefresh,
  secondsRemaining,
  onManualRefresh,
  isRefreshing,
  lastUpdatedTime,
  isArabic,
}) => {
  return (
    <div className="bg-[#0b101c]/90 border border-emerald-500/25 rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
      {/* Auto-refresh Status */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {isAutoRefresh && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isAutoRefresh ? 'bg-emerald-400' : 'bg-slate-500'
            }`}
          ></span>
        </span>

        <div className="text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span>
              {isAutoRefresh
                ? (isArabic ? 'تحديث تلقائي لحظي نشط' : 'Live Auto-Refresh Active')
                : (isArabic ? 'التحديث التلقائي متوقف مؤقتاً' : 'Auto-Refresh Paused')}
            </span>
            {isAutoRefresh && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono tabular-nums">
                {isArabic ? `خلال ${secondsRemaining}ث` : `in ${secondsRemaining}s`}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block">
            {isArabic ? `آخر تحديث: ${lastUpdatedTime}` : `Last updated: ${lastUpdatedTime}`}
          </span>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-1.5">
        {/* Toggle Auto/Pause */}
        <button
          type="button"
          onClick={onToggleAutoRefresh}
          className={`min-h-[34px] px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 border ${
            isAutoRefresh
              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
          }`}
          title={isAutoRefresh ? (isArabic ? 'إيقاف التحديث التلقائي' : 'Pause') : (isArabic ? 'تفعيل التحديث التلقائي' : 'Enable')}
        >
          {isAutoRefresh ? <Pause className="w-3 h-3 text-slate-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
          <span>{isAutoRefresh ? (isArabic ? 'إيقاف' : 'Pause') : (isArabic ? 'تشغيل' : 'Start')}</span>
        </button>

        {/* Manual Refresh Now Button */}
        <button
          type="button"
          onClick={onManualRefresh}
          disabled={isRefreshing}
          className="min-h-[34px] px-3 py-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-75 text-slate-950 font-black text-[11px] rounded-xl transition-all flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isArabic ? 'تحديث الآن' : 'Refresh Now'}</span>
        </button>
      </div>
    </div>
  );
};
