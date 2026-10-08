import React, { useState } from 'react';
import { STANDINGS_DATA, TOP_SCORERS } from '../data/mockFootballData';
import { TeamLogo } from './TeamLogo';
import { PlayerAvatar } from './PlayerAvatar';
import { Trophy, Flame, ChevronRight, Award } from 'lucide-react';

interface StandingsTabProps {
  isArabic: boolean;
}

export const StandingsTab: React.FC<StandingsTabProps> = ({ isArabic }) => {
  const [selectedLeague, setSelectedLeague] = useState<'spl' | 'international' | 'ucl' | 'epl' | 'laliga'>('spl');

  const leagueOptions = [
    { id: 'spl' as const, nameAr: 'دوري روشن', nameEn: 'Saudi Pro League', icon: '🇸🇦' },
    { id: 'international' as const, nameAr: 'تصفيات كأس العالم', nameEn: 'World Cup Qualifiers', icon: '🌍' },
    { id: 'ucl' as const, nameAr: 'أبطال أوروبا', nameEn: 'Champions League', icon: '⭐' },
    { id: 'epl' as const, nameAr: 'البريميرليغ', nameEn: 'Premier League', icon: '🦁' },
    { id: 'laliga' as const, nameAr: 'لا ليغا', nameEn: 'La Liga', icon: '🇪🇸' },
  ];

  const standings = STANDINGS_DATA[selectedLeague] || [];
  const scorers = TOP_SCORERS[selectedLeague] || [];

  return (
    <div className="space-y-4 pb-20">
      {/* League Selection Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
        {leagueOptions.map((lg) => {
          const active = selectedLeague === lg.id;
          return (
            <button
              key={lg.id}
              onClick={() => setSelectedLeague(lg.id)}
              className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
                active
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{lg.icon}</span>
              <span>{isArabic ? lg.nameAr : lg.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Standings Table Card */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">
              {isArabic ? 'جدول الترتيب المباشر' : 'Live Standings Table'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            {isArabic ? 'موسم 2026/2027' : 'Season 2026/27'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 text-[11px] border-b border-slate-800/60 font-semibold">
                <th className="py-2.5 px-3 text-center w-8">#</th>
                <th className="py-2.5 px-3 text-start">{isArabic ? 'الفريق' : 'Club'}</th>
                <th className="py-2.5 px-2 text-center">{isArabic ? 'لعب' : 'PL'}</th>
                <th className="py-2.5 px-2 text-center">{isArabic ? 'فوز' : 'W'}</th>
                <th className="py-2.5 px-2 text-center">{isArabic ? 'تعادل' : 'D'}</th>
                <th className="py-2.5 px-2 text-center">{isArabic ? 'خسارة' : 'L'}</th>
                <th className="py-2.5 px-2 text-center">{isArabic ? '+/-' : 'GD'}</th>
                <th className="py-2.5 px-3 text-center font-bold text-white">{isArabic ? 'النقاط' : 'PTS'}</th>
                <th className="py-2.5 px-3 text-center">{isArabic ? 'النتائج الأخيرة' : 'Form'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {standings.map((row) => {
                const isLeader = row.position === 1;
                const isUCLZone = row.position <= 4;
                return (
                  <tr
                    key={row.team.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isLeader ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] tabular-nums ${
                          isLeader
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : isUCLZone
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {row.position}
                      </span>
                    </td>

                    {/* Team Name & Logo */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <TeamLogo
                          teamId={row.team.id}
                          teamName={row.team.name}
                          fallbackEmoji={row.team.logo}
                          size="xs"
                        />
                        <div className="truncate">
                          <p className="font-bold text-white truncate leading-tight">
                            {isArabic ? row.team.nameAr : row.team.name}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {row.team.shortName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-center tabular-nums text-slate-300 font-medium">
                      {row.played}
                    </td>
                    <td className="py-3 px-2 text-center tabular-nums text-slate-400">
                      {row.won}
                    </td>
                    <td className="py-3 px-2 text-center tabular-nums text-slate-400">
                      {row.drawn}
                    </td>
                    <td className="py-3 px-2 text-center tabular-nums text-slate-400">
                      {row.lost}
                    </td>
                    <td className="py-3 px-2 text-center tabular-nums text-slate-300 font-medium">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums font-black text-emerald-400 text-sm">
                      {row.points}
                    </td>

                    {/* Form indicator */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.map((f, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${
                              f === 'W'
                                ? 'bg-emerald-500'
                                : f === 'D'
                                ? 'bg-slate-600'
                                : 'bg-red-500'
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Scorers Card */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white">
              {isArabic ? 'هدّافو المسابقة' : 'Top Scorers'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {isArabic ? 'الأهداف والتمريرات الحاسمة' : 'Goals & Assists'}
          </span>
        </div>

        <div className="space-y-2">
          {scorers.map((s) => (
            <div
              key={s.rank}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs tabular-nums ${
                    s.rank === 1
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {s.rank}
                </span>
                <PlayerAvatar
                  playerId={s.player}
                  playerName={s.player}
                  playerNameAr={s.playerAr}
                  size="xs"
                  showNumber={false}
                />
                <div>
                  <p className="font-bold text-white">
                    {isArabic ? s.playerAr : s.player}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>{s.teamLogo}</span>
                    <span>{isArabic ? s.teamAr : s.team}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center">
                  <span className="text-xs text-slate-400 block font-normal">
                    {isArabic ? 'صناعة' : 'Assists'}
                  </span>
                  <span className="text-xs font-bold text-slate-200 tabular-nums">
                    {s.assists}
                  </span>
                </div>
                <div className="text-center bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">
                    {isArabic ? 'أهداف' : 'Goals'}
                  </span>
                  <span className="text-sm font-black text-emerald-400 tabular-nums">
                    {s.goals}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
