import React, { useState } from 'react';
import { Match, OfficialBroadcast } from '../types/football';
import {
  Tv,
  ExternalLink,
  Settings,
  Radio,
  Satellite,
  Volume2,
  ShieldCheck,
  Search,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import { ActiveLiveDesk } from './ActiveLiveDesk';

interface WatchGuideTabProps {
  matches: Match[];
  onOpenAdmin: () => void;
  isSubscribed: boolean;
  onOpenSubscription: () => void;
  isArabic: boolean;
  onSelectMatch: (match: Match) => void;
}

export const WatchGuideTab: React.FC<WatchGuideTabProps> = ({
  matches,
  onOpenAdmin,
  isSubscribed,
  onOpenSubscription,
  isArabic,
  onSelectMatch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'Satellite' | 'Streaming'>('ALL');

  const liveMatches = matches.filter((m) => m.status === 'LIVE');

  const filteredMatches = matches.filter((m) => {
    if (m.broadcasts.length === 0) return false;
    const matchName = `${m.homeTeam.name} ${m.homeTeam.nameAr} ${m.awayTeam.name} ${m.awayTeam.nameAr} ${m.leagueName} ${m.leagueNameAr}`.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || matchName.includes(searchQuery.toLowerCase());
    
    if (platformFilter === 'ALL') return matchesSearch;
    return matchesSearch && m.broadcasts.some(b => b.platform === platformFilter);
  });

  return (
    <div className="space-y-4 pb-20">
      {/* 🔴 Direct Active Live Matches Hub: Gives full info on running games */}
      <ActiveLiveDesk
        liveMatches={liveMatches}
        isArabic={isArabic}
        onSelectMatch={onSelectMatch}
      />

      {/* Top Hero & Control Header */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-gradient-to-r from-[#111927] via-[#0d1522] to-[#0a101b] p-4 shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>{isArabic ? 'دليل البث الرياضي المفتوح والمعتمد' : 'Official Football Broadcast Guide'}</span>
            </div>
            <h2 className="text-base font-extrabold text-white">
              {isArabic ? 'دليل القنوات الناقلة وروابط البث الرسمية' : 'Official Broadcast Guide & Live Streams'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic
                ? 'متاح مجاناً للجميع: جدول القنوات الرسمية، أسماء المعلقين، والترددات الفضائية.'
                : 'Free access to all official broadcast schedules, commentators, and satellite frequencies.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* VIP Pass Button */}
            <button
              onClick={onOpenSubscription}
              className={`min-h-[44px] flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                isSubscribed
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Crown className={`w-4 h-4 ${isSubscribed ? 'fill-amber-400 text-amber-400' : 'text-amber-400'}`} />
              <span>
                {isSubscribed
                  ? (isArabic ? 'باقة VIP مفعلة' : 'VIP Active')
                  : (isArabic ? 'باقات VIP' : 'VIP Plans')}
              </span>
            </button>

            {/* Admin Control Button */}
            <button
              onClick={onOpenAdmin}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700/80 flex items-center gap-1.5 whitespace-nowrap"
              title={isArabic ? 'لوحة تحكم القنوات' : 'Admin Panel'}
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{isArabic ? 'لوحة التحكم' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Platform Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={isArabic ? 'ابحث عن مباراة أو قناة أو دوري...' : 'Search matches or channels...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] ps-10 pe-4 bg-[#0f172a] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setPlatformFilter('ALL')}
            className={`min-h-[38px] flex-1 sm:flex-none px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              platformFilter === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isArabic ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => setPlatformFilter('Satellite')}
            className={`min-h-[38px] flex-1 sm:flex-none px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1 ${
              platformFilter === 'Satellite'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Satellite className="w-3 h-3" />
            <span>{isArabic ? 'فضائي' : 'Satellite'}</span>
          </button>
          <button
            onClick={() => setPlatformFilter('Streaming')}
            className={`min-h-[38px] flex-1 sm:flex-none px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1 ${
              platformFilter === 'Streaming'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>{isArabic ? 'رقمي' : 'Streaming'}</span>
          </button>
        </div>
      </div>

      {/* Matches List with Broadcast Details */}
      <div className="space-y-3">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="rounded-2xl border border-slate-800/90 bg-[#0f172a] p-4 space-y-3 shadow-sm hover:border-slate-700/80 transition-all"
          >
            {/* Header info */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <span>{match.leagueLogo}</span>
                <span>{isArabic ? match.leagueNameAr : match.leagueName}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-normal">{match.startTime} بتوقيت مكة</span>
              </div>
              {match.status === 'LIVE' && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold animate-pulse">
                  {isArabic ? 'مباشر الآن 🔴' : 'LIVE'}
                </span>
              )}
            </div>

            {/* Teams */}
            <div
              onClick={() => onSelectMatch(match)}
              className="cursor-pointer flex items-center justify-between text-xs font-bold text-white py-1 hover:text-emerald-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{match.homeTeam.logo}</span>
                <span>{isArabic ? match.homeTeam.nameAr : match.homeTeam.name}</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {match.status === 'LIVE' || match.status === 'FINISHED'
                  ? `${match.homeScore} - ${match.awayScore}`
                  : 'ضد'}
              </span>
              <div className="flex items-center gap-2">
                <span>{isArabic ? match.awayTeam.nameAr : match.awayTeam.name}</span>
                <span>{match.awayTeam.logo}</span>
              </div>
            </div>

            {/* Broadcast Channel Cards */}
            <div className="space-y-2 pt-1 border-t border-slate-800/60">
              {match.broadcasts.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl flex-shrink-0">{b.logo}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {isArabic ? b.channelNameAr : b.channelName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                          {b.quality}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-slate-500" />
                          <span>🎙️ {isArabic ? b.commentatorAr : b.commentator}</span>
                        </span>
                        {b.satellite && (
                          <span className="text-slate-400">· 📡 {b.satellite}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={b.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700 whitespace-nowrap self-stretch sm:self-auto"
                  >
                    <span>{isArabic ? 'مشاهدة البث الرسمي' : 'Official Stream'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
