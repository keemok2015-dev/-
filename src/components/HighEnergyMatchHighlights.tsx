import React, { useState, useEffect } from 'react';
import { Match } from '../types/football';
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  Heart,
  Sparkles,
  Zap,
  Check,
  Eye,
  Trophy,
} from 'lucide-react';

interface HighEnergyMatchHighlightsProps {
  match: Match;
  isArabic: boolean;
}

interface HighlightClip {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  minute: number;
  duration: string;
  type: 'GOAL' | 'SKILL' | 'SAVE' | 'CELEBRATION';
  visualUrl: string;
  reactions: {
    fire: number;
    goal: number;
    rocket: number;
    clap: number;
  };
}

export const HighEnergyMatchHighlights: React.FC<HighEnergyMatchHighlightsProps> = ({
  match,
  isArabic,
}) => {
  // Build high-energy clips based on match events or high-energy images
  const defaultClips: HighlightClip[] = [
    {
      id: 'clip-1',
      titleAr: 'هدف حاسم واحتفال جنوني مع الجماهير ⚽🔥',
      titleEn: 'Decisive Goal & Stadium Celebration 🔥',
      descAr: 'تسديدة مقوسة لا تصد تخترق الشباك وسط صيحات الجماهير وأجواء حماسية أسطورية.',
      descEn: 'Unstoppable curling strike finding the top corner with wild fan celebrations.',
      minute: match.events.find((e) => e.type === 'GOAL')?.minute || 68,
      duration: '0:14',
      type: 'GOAL',
      visualUrl: '/src/assets/images/goal_celebration_clip_1791184265303.jpg',
      reactions: { fire: 3420, goal: 8910, rocket: 2150, clap: 1840 },
    },
    {
      id: 'clip-2',
      titleAr: 'ضربة مقصية خرافية مذهلة (Bicycle Kick) 🚀',
      titleEn: 'Spectacular Acrobatic Bicycle Kick Goal 🚀',
      descAr: 'ارتقاء هوائي استثنائي وإنهاء سينمائي يخطف الأنفاس في اللحظات الحاسمة.',
      descEn: 'Incredible aerial bicycle kick finishing in cinematic fashion.',
      minute: 78,
      duration: '0:12',
      type: 'SKILL',
      visualUrl: '/src/assets/images/bicycle_kick_moment_1791184279373.jpg',
      reactions: { fire: 5120, goal: 12400, rocket: 4620, clap: 3100 },
    },
    {
      id: 'clip-3',
      titleAr: 'أجواء الملعب وحسم النقاط الثلاث 🏆',
      titleEn: 'Full Time Euphoria & Decisive Victory 🏆',
      descAr: 'فرحة الهداف والمدرب بالانتصار الثمين بعد مواجهة ملحمية حتى صافرة النهاية.',
      descEn: 'Match-winning passion and squad celebration following a breathless encounter.',
      minute: 90,
      duration: '0:18',
      type: 'CELEBRATION',
      visualUrl: '/src/assets/images/motm_player_celebration_1791149594880.jpg',
      reactions: { fire: 2890, goal: 4320, rocket: 1980, clap: 2450 },
    },
  ];

  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reactionCounts, setReactionCounts] = useState<{ [clipId: string]: { [key: string]: number } }>({
    'clip-1': { fire: 3420, goal: 8910, rocket: 2150, clap: 1840 },
    'clip-2': { fire: 5120, goal: 12400, rocket: 4620, clap: 3100 },
    'clip-3': { fire: 2890, goal: 4320, rocket: 1980, clap: 2450 },
  });
  const [activeFloatingReaction, setActiveFloatingReaction] = useState<string | null>(null);

  const activeClip = defaultClips[activeClipIndex] || defaultClips[0];
  const currentReactions = reactionCounts[activeClip.id] || activeClip.reactions;

  // Progress Bar Simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0; // Auto-loop
        }
        return prev + 2.5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, activeClipIndex]);

  const handleReact = (type: 'fire' | 'goal' | 'rocket' | 'clap', emoji: string) => {
    setReactionCounts((prev) => {
      const clipReactions = prev[activeClip.id] || { ...activeClip.reactions };
      return {
        ...prev,
        [activeClip.id]: {
          ...clipReactions,
          [type]: (clipReactions[type] || 0) + 1,
        },
      };
    });

    setActiveFloatingReaction(emoji);
    setTimeout(() => setActiveFloatingReaction(null), 1200);
  };

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* High Energy Header */}
      <div className="bg-gradient-to-r from-red-950/60 via-amber-950/40 to-slate-900 border border-red-500/40 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>{isArabic ? 'لقطات فيديو وأهداف سريعة عالية الطاقة' : 'High-Energy Video & GIF Highlights'}</span>
              <span className="text-[9px] bg-red-500/20 text-red-300 font-extrabold px-1.5 py-0.2 rounded-full border border-red-500/30">
                HD 60FPS
              </span>
            </h4>
            <p className="text-[11px] text-amber-300 font-medium mt-0.5">
              {isArabic
                ? 'استمتع بأفضل لقطات الأهداف والتصديات والمراوغات بصيغة GIF السريعة.'
                : 'Experience explosive goal reels, celebrations & skillful highlights.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="min-h-[36px] px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 whitespace-nowrap"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'مشاركة' : 'Share')}</span>
        </button>
      </div>

      {/* Main High-Energy Player Card */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-black shadow-2xl high-energy-card">
        {/* Floating Reaction Animation */}
        {activeFloatingReaction && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center animate-bounce">
            <span className="text-6xl drop-shadow-lg transform scale-150 transition-all">
              {activeFloatingReaction}
            </span>
          </div>
        )}

        {/* Action Clip Image / Loop Visualizer */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
          <img
            src={activeClip.visualUrl}
            alt={activeClip.titleAr}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-105 filter brightness-105' : 'scale-100 filter brightness-90'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

          {/* Top Energy Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
            <span className="bg-red-600/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>{isArabic ? `الدقيقة ${activeClip.minute}'` : `Min ${activeClip.minute}'`}</span>
            </span>

            <span className="bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{activeClip.duration}</span>
            </span>
          </div>

          {/* Play / Pause Big Center Button Overlay */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all z-20 active:scale-90"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white translate-x-0.5" />}
          </button>

          {/* Bottom Title & Scrubber Inside Media View */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-20 space-y-2">
            <div>
              <h3 className="text-sm font-black text-white drop-shadow">
                {isArabic ? activeClip.titleAr : activeClip.titleEn}
              </h3>
              <p className="text-[11px] text-slate-300 line-clamp-1 drop-shadow-sm">
                {isArabic ? activeClip.descAr : activeClip.descEn}
              </p>
            </div>

            {/* Dynamic Progress Scrubber Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Player Quick Controls */}
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono">
                  {isPlaying ? (isArabic ? 'تشغيل ملخص مباشر 🎬' : 'Playing Highlight') : (isArabic ? 'متوقف مؤقتاً' : 'Paused')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 text-slate-300 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => setProgress(0)}
                    className="p-1 text-slate-300 hover:text-white"
                    title={isArabic ? 'إعادة اللقطة' : 'Replay'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Fan Reactions Desk */}
        <div className="p-3.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 flex-1 justify-around">
            <button
              onClick={() => handleReact('fire', '🔥')}
              className="px-2.5 py-1 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-xs font-bold text-red-300 flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>🔥</span>
              <span className="tabular-nums text-[11px] font-black">{currentReactions.fire}</span>
            </button>

            <button
              onClick={() => handleReact('goal', '⚽')}
              className="px-2.5 py-1 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>⚽</span>
              <span className="tabular-nums text-[11px] font-black">{currentReactions.goal}</span>
            </button>

            <button
              onClick={() => handleReact('rocket', '🚀')}
              className="px-2.5 py-1 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-xs font-bold text-blue-300 flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>🚀</span>
              <span className="tabular-nums text-[11px] font-black">{currentReactions.rocket}</span>
            </button>

            <button
              onClick={() => handleReact('clap', '👏')}
              className="px-2.5 py-1 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>👏</span>
              <span className="tabular-nums text-[11px] font-black">{currentReactions.clap}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Selector of Available Match Clips */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold text-slate-300 px-1">
          {isArabic ? 'بقية لقطات وأهداف المباراة المكتملة' : 'All Match Highlights & Clips'}
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {defaultClips.map((clip, index) => {
            const isSelected = activeClipIndex === index;
            return (
              <button
                key={clip.id}
                onClick={() => {
                  setActiveClipIndex(index);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className={`p-2 rounded-xl border text-right transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                  <img src={clip.visualUrl} alt="" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  )}
                </div>
                <div className="truncate flex-1">
                  <p className={`text-[11px] font-bold truncate ${isSelected ? 'text-amber-300' : 'text-slate-300'}`}>
                    {isArabic ? clip.titleAr : clip.titleEn}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {clip.duration} · {isArabic ? `د ${clip.minute}'` : `Min ${clip.minute}'`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
