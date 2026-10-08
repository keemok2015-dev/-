import React from 'react';
import { Match } from '../types/football';
import { Award, Star, Flame, Trophy, Zap, Activity } from 'lucide-react';

interface MotmHighlightTabProps {
  matches: Match[];
  isArabic: boolean;
}

export const MotmHighlightTab: React.FC<MotmHighlightTabProps> = ({ matches, isArabic }) => {
  // Collect all matches with MOTM
  const motmList = matches
    .map((m) => ({ match: m, motm: m.manOfTheMatch }))
    .filter((item): item is { match: Match; motm: NonNullable<Match['manOfTheMatch']> } => !!item.motm);

  const starMotm = motmList[0]; // Mbappé or Milinković-Savić

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Spotlight: Player of the Round */}
      {starMotm && (
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-[#191e30] via-[#0f1524] to-[#0a0e1a] shadow-xl">
          {/* Badge */}
          <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
              <Award className="w-4 h-4" />
              <span>{isArabic ? 'نجم الجولة الأبرز (Player of the Week)' : 'Player of the Week'}</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-black tabular-nums">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{starMotm.motm.rating}</span>
            </div>
          </div>

          {/* Media & Player Card */}
          <div className="p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl flex-shrink-0">
              <img
                src={starMotm.motm.photo}
                alt={starMotm.motm.playerName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase text-amber-300 bg-black/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                Man of the Match
              </span>
            </div>

            <div className="flex-1 text-center sm:text-start">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xl">{starMotm.motm.teamLogo}</span>
                <span className="text-xs font-semibold text-slate-400">
                  {isArabic ? starMotm.motm.teamNameAr : starMotm.motm.teamName}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-semibold text-emerald-400">
                  {isArabic ? starMotm.match.leagueNameAr : starMotm.match.leagueName}
                </span>
              </div>
              <h2 className="text-lg font-black text-white">
                {isArabic ? starMotm.motm.playerNameAr : starMotm.motm.playerName}
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {isArabic ? starMotm.motm.summaryAr : starMotm.motm.summaryEn}
              </p>
            </div>
          </div>

          {/* Stat Pillars */}
          <div className="grid grid-cols-5 divide-x divide-slate-800 border-t border-slate-800 bg-slate-900/60 text-center py-3">
            <div>
              <span className="text-base font-black text-white tabular-nums block">
                {starMotm.motm.goals}
              </span>
              <span className="text-[10px] text-slate-400">{isArabic ? 'أهداف' : 'Goals'}</span>
            </div>
            <div>
              <span className="text-base font-black text-white tabular-nums block">
                {starMotm.motm.assists}
              </span>
              <span className="text-[10px] text-slate-400">{isArabic ? 'صناعة' : 'Assists'}</span>
            </div>
            <div>
              <span className="text-base font-black text-white tabular-nums block">
                {starMotm.motm.keyPasses}
              </span>
              <span className="text-[10px] text-slate-400">{isArabic ? 'فرص مصنوعة' : 'Key Passes'}</span>
            </div>
            <div>
              <span className="text-base font-black text-white tabular-nums block">
                {starMotm.motm.dribbles}
              </span>
              <span className="text-[10px] text-slate-400">{isArabic ? 'مراوغات' : 'Dribbles'}</span>
            </div>
            <div>
              <span className="text-base font-black text-amber-400 tabular-nums block">
                {starMotm.motm.duelsWon}
              </span>
              <span className="text-[10px] text-slate-400">{isArabic ? 'صراعات ثنائية' : 'Duels'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Matchday MOTMs */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>{isArabic ? 'نجوم باقي مباريات اليوم' : 'Other Matchday Stars'}</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            {isArabic ? 'تقييم دقيق بناءً على بيانات المباريات' : 'Rated via Match Stats'}
          </span>
        </div>

        <div className="space-y-3">
          {motmList.slice(1).map(({ match, motm }) => (
            <div
              key={motm.playerId + match.id}
              className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>{match.leagueLogo}</span>
                  <span>{isArabic ? match.leagueNameAr : match.leagueName}</span>
                </span>
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg tabular-nums">
                  ★ {motm.rating}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0">
                    <img
                      src={motm.photo}
                      alt={motm.playerName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isArabic ? motm.playerNameAr : motm.playerName}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{motm.teamLogo}</span>
                      <span>{isArabic ? motm.teamNameAr : motm.teamName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-center text-xs">
                  <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg">
                    <span className="font-bold text-white block tabular-nums">{motm.goals}</span>
                    <span className="text-[10px] text-slate-400">{isArabic ? 'هدف' : 'G'}</span>
                  </div>
                  <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg">
                    <span className="font-bold text-white block tabular-nums">{motm.assists}</span>
                    <span className="text-[10px] text-slate-400">{isArabic ? 'صناعة' : 'A'}</span>
                  </div>
                  <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg">
                    <span className="font-bold text-emerald-400 block tabular-nums">{motm.keyPasses}</span>
                    <span className="text-[10px] text-slate-400">{isArabic ? 'فرص' : 'KP'}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800/60 leading-relaxed">
                {isArabic ? motm.summaryAr : motm.summaryEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
