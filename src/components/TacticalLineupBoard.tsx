import React, { useState } from 'react';
import { Match, Player } from '../types/football';
import { TeamLogo } from './TeamLogo';
import { PlayerAvatar } from './PlayerAvatar';
import { Users, LayoutGrid, Shield, UserCheck, Star, Sparkles, ChevronRight, Info } from 'lucide-react';

interface TacticalLineupBoardProps {
  match: Match;
  isArabic: boolean;
}

export const TacticalLineupBoard: React.FC<TacticalLineupBoardProps> = ({ match, isArabic }) => {
  const [viewMode, setViewMode] = useState<'pitch' | 'list'>('pitch');
  const [activePitchTeam, setActivePitchTeam] = useState<'home' | 'away'>('home');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const homeLineup = match.homeLineup;
  const awayLineup = match.awayLineup;

  const currentLineup = activePitchTeam === 'home' ? homeLineup : awayLineup;
  const currentTeam = activePitchTeam === 'home' ? match.homeTeam : match.awayTeam;

  // Organize starting players into tactical rows: GK, DF, MF, FW
  const gkList = currentLineup.starting.filter((p) => p.position === 'GK');
  const dfList = currentLineup.starting.filter((p) => p.position === 'DF');
  const mfList = currentLineup.starting.filter((p) => p.position === 'MF');
  const fwList = currentLineup.starting.filter((p) => p.position === 'FW');

  return (
    <div className="space-y-4">
      {/* 1. Header with Teams, Formations, and Coaches */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Home Team Card */}
        <div
          onClick={() => {
            setActivePitchTeam('home');
            setSelectedPlayer(null);
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            activePitchTeam === 'home'
              ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <TeamLogo
            teamId={match.homeTeam.id}
            teamName={match.homeTeam.name}
            fallbackEmoji={match.homeTeam.logo}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-white text-xs truncate">
                {isArabic ? match.homeTeam.nameAr : match.homeTeam.name}
              </p>
              <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-black px-1.5 py-0.5 rounded-md">
                {homeLineup.formation}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {isArabic ? 'المدرب: ' : 'Coach: '}
              <span className="text-slate-300 font-semibold">{isArabic ? homeLineup.coachAr : homeLineup.coach}</span>
            </p>
          </div>
        </div>

        {/* Away Team Card */}
        <div
          onClick={() => {
            setActivePitchTeam('away');
            setSelectedPlayer(null);
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            activePitchTeam === 'away'
              ? 'bg-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <TeamLogo
            teamId={match.awayTeam.id}
            teamName={match.awayTeam.name}
            fallbackEmoji={match.awayTeam.logo}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-white text-xs truncate">
                {isArabic ? match.awayTeam.nameAr : match.awayTeam.name}
              </p>
              <span className="text-[10px] bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono font-black px-1.5 py-0.5 rounded-md">
                {awayLineup.formation}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {isArabic ? 'المدرب: ' : 'Coach: '}
              <span className="text-slate-300 font-semibold">{isArabic ? awayLineup.coachAr : awayLineup.coach}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. View Mode Switcher (Tactical Pitch vs Squad List) */}
      <div className="flex items-center justify-between gap-2 px-1">
        {/* Pitch Team Selector */}
        {viewMode === 'pitch' && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setActivePitchTeam('home');
                setSelectedPlayer(null);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activePitchTeam === 'home'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isArabic ? match.homeTeam.nameAr : match.homeTeam.shortName}
            </button>
            <button
              type="button"
              onClick={() => {
                setActivePitchTeam('away');
                setSelectedPlayer(null);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activePitchTeam === 'away'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isArabic ? match.awayTeam.nameAr : match.awayTeam.shortName}
            </button>
          </div>
        )}

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 ms-auto">
          <button
            type="button"
            onClick={() => setViewMode('pitch')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'pitch'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{isArabic ? 'رقعة الملعب التكتيكية' : 'Pitch View'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isArabic ? 'القائمة التفصيلية' : 'List View'}</span>
          </button>
        </div>
      </div>

      {/* 3. TACTICAL PITCH VIEW */}
      {viewMode === 'pitch' && (
        <div className="space-y-3">
          {/* Pitch Container with realistic grass stripes & field markings */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-600/50 shadow-2xl p-4 sm:p-6 select-none bg-gradient-to-b from-[#0b3d1b] via-[#09471d] to-[#0b3d1b]">
            {/* Field Stripes Texture */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, #ffffff 0, #ffffff 40px, transparent 40px, transparent 80px)',
              }}
            />

            {/* Field Boundary Lines & Markings */}
            <div className="absolute inset-2 border-2 border-white/20 rounded-2xl pointer-events-none" />
            {/* Penalty Box Top */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-20 border-b-2 border-x-2 border-white/20 rounded-b-xl pointer-events-none" />
            {/* Center Line & Center Circle */}
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 border-b-2 border-white/20 pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/20 pointer-events-none" />
            {/* Center Spot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white/40 pointer-events-none" />
            {/* Penalty Box Bottom */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-20 border-t-2 border-x-2 border-white/20 rounded-t-xl pointer-events-none" />

            {/* Tactical Formation Label Overlay */}
            <div className="absolute top-4 start-4 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md">
              <TeamLogo
                teamId={currentTeam.id}
                teamName={currentTeam.name}
                fallbackEmoji={currentTeam.logo}
                size="xs"
              />
              <span className="text-xs font-black text-white">
                {isArabic ? currentTeam.nameAr : currentTeam.name}
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                {currentLineup.formation}
              </span>
            </div>

            {/* Interactive Player Nodes on the Pitch */}
            <div className="relative z-10 flex flex-col justify-between gap-6 py-6 min-h-[460px]">
              {/* Row 1: Attackers (FW) */}
              <div className="flex justify-around items-center px-4">
                {fwList.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                    className="flex flex-col items-center cursor-pointer group transition-transform active:scale-95"
                  >
                    <PlayerAvatar
                      playerId={player.id}
                      playerName={player.name}
                      playerNameAr={player.nameAr}
                      number={player.number}
                      position={player.position}
                      rating={player.rating}
                      isCaptain={player.isCaptain}
                      photoUrl={player.photo}
                      size="md"
                      showRating
                    />
                    <div className="mt-1.5 bg-slate-950/90 backdrop-blur-sm border border-slate-700 px-2 py-0.5 rounded-md text-center shadow-lg group-hover:border-emerald-400 transition-colors">
                      <p className="text-[11px] font-black text-white truncate max-w-[85px]">
                        {isArabic ? player.nameAr : player.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: Midfielders (MF) */}
              <div className="flex justify-around items-center px-2">
                {mfList.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                    className="flex flex-col items-center cursor-pointer group transition-transform active:scale-95"
                  >
                    <PlayerAvatar
                      playerId={player.id}
                      playerName={player.name}
                      playerNameAr={player.nameAr}
                      number={player.number}
                      position={player.position}
                      rating={player.rating}
                      isCaptain={player.isCaptain}
                      photoUrl={player.photo}
                      size="md"
                      showRating
                    />
                    <div className="mt-1.5 bg-slate-950/90 backdrop-blur-sm border border-slate-700 px-2 py-0.5 rounded-md text-center shadow-lg group-hover:border-emerald-400 transition-colors">
                      <p className="text-[11px] font-black text-white truncate max-w-[85px]">
                        {isArabic ? player.nameAr : player.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 3: Defenders (DF) */}
              <div className="flex justify-around items-center px-2">
                {dfList.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                    className="flex flex-col items-center cursor-pointer group transition-transform active:scale-95"
                  >
                    <PlayerAvatar
                      playerId={player.id}
                      playerName={player.name}
                      playerNameAr={player.nameAr}
                      number={player.number}
                      position={player.position}
                      rating={player.rating}
                      isCaptain={player.isCaptain}
                      photoUrl={player.photo}
                      size="md"
                      showRating
                    />
                    <div className="mt-1.5 bg-slate-950/90 backdrop-blur-sm border border-slate-700 px-2 py-0.5 rounded-md text-center shadow-lg group-hover:border-emerald-400 transition-colors">
                      <p className="text-[11px] font-black text-white truncate max-w-[85px]">
                        {isArabic ? player.nameAr : player.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 4: Goalkeeper (GK) */}
              <div className="flex justify-center items-center">
                {gkList.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                    className="flex flex-col items-center cursor-pointer group transition-transform active:scale-95"
                  >
                    <PlayerAvatar
                      playerId={player.id}
                      playerName={player.name}
                      playerNameAr={player.nameAr}
                      number={player.number}
                      position={player.position}
                      rating={player.rating}
                      isCaptain={player.isCaptain}
                      photoUrl={player.photo}
                      size="md"
                      showRating
                    />
                    <div className="mt-1.5 bg-slate-950/90 backdrop-blur-sm border border-amber-500/40 px-2.5 py-0.5 rounded-md text-center shadow-lg group-hover:border-amber-400 transition-colors">
                      <p className="text-[11px] font-black text-amber-300 truncate max-w-[95px]">
                        {isArabic ? player.nameAr : player.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Player Card Modal/Drawer when player tapped */}
          {selectedPlayer && (
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <PlayerAvatar
                  playerId={selectedPlayer.id}
                  playerName={selectedPlayer.name}
                  playerNameAr={selectedPlayer.nameAr}
                  number={selectedPlayer.number}
                  position={selectedPlayer.position}
                  rating={selectedPlayer.rating}
                  isCaptain={selectedPlayer.isCaptain}
                  photoUrl={selectedPlayer.photo}
                  size="lg"
                  showRating
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-black text-white">
                      {isArabic ? selectedPlayer.nameAr : selectedPlayer.name}
                    </h5>
                    {selectedPlayer.isCaptain && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded font-bold">
                        {isArabic ? 'كابتن الفريق' : 'Captain'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>
                      {selectedPlayer.position === 'GK'
                        ? isArabic ? 'حارس مرمى' : 'Goalkeeper'
                        : selectedPlayer.position === 'DF'
                        ? isArabic ? 'مدافع' : 'Defender'
                        : selectedPlayer.position === 'MF'
                        ? isArabic ? 'خط وسط' : 'Midfielder'
                        : isArabic ? 'مهاجم' : 'Forward'}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-300">#{selectedPlayer.number}</span>
                  </p>
                </div>
              </div>

              <div className="text-center bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] text-emerald-400 font-bold block">
                  {isArabic ? 'التقييم' : 'Rating'}
                </span>
                <span className="text-lg font-black text-emerald-300 font-mono">
                  {selectedPlayer.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Substitutes Bench Bar under the pitch */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{isArabic ? 'دكة البدلاء' : 'Substitutes Bench'}</span>
              <span className="text-[11px] text-slate-500 font-mono">({currentLineup.substitutes.length})</span>
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentLineup.substitutes.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedPlayer(sub)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <PlayerAvatar
                    playerId={sub.id}
                    playerName={sub.name}
                    playerNameAr={sub.nameAr}
                    number={sub.number}
                    position={sub.position}
                    photoUrl={sub.photo}
                    size="xs"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-200 truncate">
                      {isArabic ? sub.nameAr : sub.name}
                    </p>
                    <span className="text-[9px] text-slate-400 font-mono">
                      #{sub.number} · {sub.position}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. DETAILED LIST VIEW (Both Teams Side by Side) */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Home Team Starting XI & Bench */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2.5">
                <TeamLogo
                  teamId={match.homeTeam.id}
                  teamName={match.homeTeam.name}
                  fallbackEmoji={match.homeTeam.logo}
                  size="xs"
                />
                <h4 className="text-xs font-black text-white">
                  {isArabic ? match.homeTeam.nameAr : match.homeTeam.name} ({match.homeTeam.shortName})
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                {homeLineup.formation}
              </span>
            </div>

            {/* Starting 11 */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isArabic ? 'التشكيلة الأساسية (11 لاعباً)' : 'Starting XI (11 Players)'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {homeLineup.starting.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <PlayerAvatar
                        playerId={player.id}
                        playerName={player.name}
                        playerNameAr={player.nameAr}
                        number={player.number}
                        position={player.position}
                        isCaptain={player.isCaptain}
                        photoUrl={player.photo}
                        size="xs"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {isArabic ? player.nameAr : player.name}
                          </span>
                          {player.isCaptain && (
                            <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-black">C</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          #{player.number} · {player.position}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                      {player.rating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Substitutes Bench */}
            {homeLineup.substitutes.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isArabic ? 'مقاعد البدلاء' : 'Substitutes Bench'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {homeLineup.substitutes.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-1.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <PlayerAvatar
                          playerId={sub.id}
                          playerName={sub.name}
                          playerNameAr={sub.nameAr}
                          number={sub.number}
                          position={sub.position}
                          photoUrl={sub.photo}
                          size="xs"
                        />
                        <span className="font-semibold text-slate-200 truncate">
                          {isArabic ? sub.nameAr : sub.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        #{sub.number} · {sub.position}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Away Team Starting XI & Bench */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2.5">
                <TeamLogo
                  teamId={match.awayTeam.id}
                  teamName={match.awayTeam.name}
                  fallbackEmoji={match.awayTeam.logo}
                  size="xs"
                />
                <h4 className="text-xs font-black text-white">
                  {isArabic ? match.awayTeam.nameAr : match.awayTeam.name} ({match.awayTeam.shortName})
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                {awayLineup.formation}
              </span>
            </div>

            {/* Starting 11 */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isArabic ? 'التشكيلة الأساسية (11 لاعباً)' : 'Starting XI (11 Players)'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {awayLineup.starting.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <PlayerAvatar
                        playerId={player.id}
                        playerName={player.name}
                        playerNameAr={player.nameAr}
                        number={player.number}
                        position={player.position}
                        isCaptain={player.isCaptain}
                        photoUrl={player.photo}
                        size="xs"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {isArabic ? player.nameAr : player.name}
                          </span>
                          {player.isCaptain && (
                            <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-black">C</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          #{player.number} · {player.position}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">
                      {player.rating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Away Substitutes Bench */}
            {awayLineup.substitutes.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isArabic ? 'مقاعد البدلاء' : 'Substitutes Bench'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {awayLineup.substitutes.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-1.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <PlayerAvatar
                          playerId={sub.id}
                          playerName={sub.name}
                          playerNameAr={sub.nameAr}
                          number={sub.number}
                          position={sub.position}
                          photoUrl={sub.photo}
                          size="xs"
                        />
                        <span className="font-semibold text-slate-200 truncate">
                          {isArabic ? sub.nameAr : sub.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        #{sub.number} · {sub.position}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
