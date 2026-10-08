import React from 'react';
import { Match } from '../types/football';
import { TeamLogo } from './TeamLogo';
import { Tv, ExternalLink, Radio, Activity, Volume2, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { formatKickoffTime } from '../utils/dateTimeUtils';

interface ActiveLiveDeskProps {
  liveMatches: Match[];
  isArabic: boolean;
  onSelectMatch: (match: Match) => void;
}

export const ActiveLiveDesk: React.FC<ActiveLiveDeskProps> = ({
  liveMatches,
  isArabic,
  onSelectMatch,
}) => {
  return (
    <div className="bg-gradient-to-b from-emerald-950/40 via-[#0e1726] to-[#090d16] border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-emerald-950/30 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
          </span>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>{isArabic ? 'المباريات الشغالة الآن والقنوات الناقلة' : 'Currently Active Live Matches & Broadcasts'}</span>
            </h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
              {isArabic
                ? 'معلومات فورية مباشرة: النتيجة، الدقيقة، القناة والمعلق الحالي'
                : 'Real-time scores, active channel & live commentator'}
            </p>
          </div>
        </div>

        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold tabular-nums">
          {liveMatches.length} {isArabic ? 'مباريات جارية الآن' : 'Live Now'}
        </span>
      </div>

      {/* If No Live Matches */}
      {liveMatches.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
          <Clock className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs font-bold text-white">
            {isArabic ? 'لا توجد مباريات جارية في هذه اللحظة' : 'No matches live right now'}
          </p>
          <p className="text-[11px] text-slate-400">
            {isArabic
              ? 'أقرب قمة ستبدأ الليلة في تمام الساعة 22:00 بتوقيت مكة (ريال مدريد ضد مانشستر سيتي)'
              : 'Next upcoming match starts at 22:00 KSA (Real Madrid vs Man City)'}
          </p>
        </div>
      ) : (
        /* List of Active Live Games */
        <div className="space-y-4">
          {liveMatches.map((match) => {
            const primaryBroadcast = match.broadcasts[0];
            const goals = match.events.filter((e) => e.type === 'GOAL');

            return (
              <div
                key={match.id}
                className="bg-[#10192b] border border-emerald-500/30 hover:border-emerald-400/60 rounded-2xl p-4 transition-all shadow-md space-y-3"
              >
                {/* League & Live Minute Badge */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <span>{match.leagueLogo}</span>
                    <span>{isArabic ? match.leagueNameAr : match.leagueName}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 font-normal text-[11px]">
                      {isArabic ? match.roundAr : match.round}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/40 text-red-400 px-2.5 py-0.5 rounded-full text-xs font-black animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>{isArabic ? `الدقيقة ${match.minute}'` : `${match.minute}' LIVE`}</span>
                  </div>
                </div>

                {/* Scoreboard */}
                <div
                  onClick={() => onSelectMatch(match)}
                  className="cursor-pointer grid grid-cols-12 items-center gap-2 py-1 hover:opacity-90"
                >
                  {/* Home Team */}
                  <div className="col-span-5 flex items-center gap-2.5">
                    <TeamLogo
                      teamId={match.homeTeam.id}
                      teamName={match.homeTeam.name}
                      fallbackEmoji={match.homeTeam.logo}
                      size="sm"
                    />
                    <div className="truncate">
                      <p className="text-sm font-black text-white truncate">
                        {isArabic ? match.homeTeam.nameAr : match.homeTeam.name}
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {match.homeTeam.shortName}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-center">
                    <div className="bg-emerald-500/20 border border-emerald-500/40 py-1 px-2 rounded-xl text-lg font-black text-emerald-300 tabular-nums">
                      {match.homeScore} - {match.awayScore}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="col-span-5 flex items-center justify-end gap-2.5 text-right">
                    <div className="truncate">
                      <p className="text-sm font-black text-white truncate">
                        {isArabic ? match.awayTeam.nameAr : match.awayTeam.name}
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {match.awayTeam.shortName}
                      </span>
                    </div>
                    <TeamLogo
                      teamId={match.awayTeam.id}
                      teamName={match.awayTeam.name}
                      fallbackEmoji={match.awayTeam.logo}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Goals Log snippet */}
                {goals.length > 0 && (
                  <div className="bg-slate-900/60 rounded-xl p-2 text-[11px] text-slate-300 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-emerald-400 font-bold">⚽ {isArabic ? 'الأهداف:' : 'Goals:'}</span>
                    <div className="flex items-center gap-2 truncate">
                      {goals.map((g) => (
                        <span key={g.id} className="whitespace-nowrap text-slate-300 font-medium">
                          {isArabic ? g.playerNameAr : g.playerName} ({g.minute}')
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real-time Broadcast Information Desk */}
                {primaryBroadcast && (
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black text-white">
                          {isArabic ? primaryBroadcast.channelNameAr : primaryBroadcast.channelName}
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                          {primaryBroadcast.quality}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2 flex-wrap">
                        <span>🎙️ {isArabic ? `المعلق: ${primaryBroadcast.commentatorAr}` : `Commentator: ${primaryBroadcast.commentator}`}</span>
                        {primaryBroadcast.satellite && (
                          <span className="text-slate-400">· 📡 {primaryBroadcast.satellite}</span>
                        )}
                      </div>
                    </div>

                    <a
                      href={primaryBroadcast.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[38px] px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 whitespace-nowrap self-stretch sm:self-auto"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'مشاهدة البث الرسمي' : 'Official Stream'}</span>
                    </a>
                  </div>
                )}

                {/* Match Details Quick Button */}
                <button
                  type="button"
                  onClick={() => onSelectMatch(match)}
                  className="w-full text-center text-[11px] text-emerald-400 hover:text-emerald-300 font-bold py-1 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>{isArabic ? 'عرض إحصائيات المباراة والتشكيلة الكاملة' : 'View match stats & full lineup'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
