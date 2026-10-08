import React, { useState, useEffect } from 'react';
import { Match, OfficialBroadcast } from './types/football';
import { INITIAL_MATCHES, DEFAULT_BROADCASTS } from './data/mockFootballData';
import { DEFAULT_FAVORITE_TEAMS } from './data/favoriteTeamsData';
import { Header } from './components/Header';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { LiveMatchesTab } from './components/LiveMatchesTab';
import { MatchDetailModal } from './components/MatchDetailModal';
import { StandingsTab } from './components/StandingsTab';
import { WatchGuideTab } from './components/WatchGuideTab';
import { AdminBroadcastModal } from './components/AdminBroadcastModal';
import { MotmHighlightTab } from './components/MotmHighlightTab';
import { NotificationBanner, GoalAlert } from './components/NotificationBanner';
import { SubscriptionModal } from './components/SubscriptionModal';
import { TermsModal } from './components/TermsModal';
import { FavoritesModal } from './components/FavoritesModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { EarningsDashboard } from './components/EarningsDashboard';
import { PlatformPublishModal } from './components/PlatformPublishModal';
import { PushNotificationModal } from './components/PushNotificationModal';
import {
  initializeWebPush,
  sendGoalPushNotification,
  sendUpcomingMatchPushNotification,
} from './services/webPushService';
import { playGoalWhistleSound } from './utils/audioAlert';
import {
  loadSavedMatches,
  saveMatches,
  cleanAndUpdateMatches,
  sortMatches,
  refreshMatchesFromAPI,
  forceResetAndSyncMatches,
} from './utils/matchManager';

export default function App() {
  const [matches, setMatches] = useState<Match[]>(() => {
    return loadSavedMatches();
  });

  const [broadcasts, setBroadcasts] = useState<OfficialBroadcast[]>(() => {
    try {
      const saved = localStorage.getItem('koralive_broadcasts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_BROADCASTS;
  });

  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('koralive_subscription_active') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [subscriptionPlan, setSubscriptionPlan] = useState<'monthly' | 'yearly'>(() => {
    try {
      return (localStorage.getItem('koralive_subscription_plan') as 'monthly' | 'yearly') || 'yearly';
    } catch (e) {
      return 'yearly';
    }
  });

  // Favorite Teams System State
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('koralive_favorite_teams');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_FAVORITE_TEAMS;
  });

  // Customized Alerts: Only notify for favorite teams
  const [onlyNotifyFavorites, setOnlyNotifyFavorites] = useState<boolean>(() => {
    try {
      return localStorage.getItem('koralive_only_notify_favorites') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('matches');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [goalAlert, setGoalAlert] = useState<GoalAlert | null>(null);

  // Dark/Light Theme System State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('koralive_theme');
      if (saved) return saved === 'dark';
    } catch (e) {}
    return true; // Default Dark Mode
  });

  // Owner Authentication & Hidden Earnings State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('koralive_owner_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isEarningsOpen, setIsEarningsOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);

  // Initialize Web Push service worker
  useEffect(() => {
    initializeWebPush();
  }, []);

  // Theme synchronization effect
  useEffect(() => {
    try {
      localStorage.setItem('koralive_theme', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
      }
    } catch (e) {}
  }, [isDarkMode]);

  const handleOpenEarnings = () => {
    if (isAdminAuthenticated) {
      setIsEarningsOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem('koralive_owner_auth', 'true');
    } catch (e) {}
    setIsAdminLoginOpen(false);
    setIsEarningsOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('koralive_owner_auth');
    } catch (e) {}
    setIsEarningsOpen(false);
  };

  // Auto-refresh states & timer
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(20);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  });

  const handleTriggerAutoRefresh = () => {
    setIsRefreshing(true);
    const now = new Date();
    setLastUpdatedTime(
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    );

    setMatches((prev) =>
      prev.map((m) => {
        if (m.status === 'LIVE' && m.minute && m.minute < 90) {
          const nextMinute = m.minute + 1;
          const possessionShift = Math.random() > 0.5 ? 1 : -1;
          const newHomePossession = Math.min(
            72,
            Math.max(28, m.stats.possession[0] + (Math.random() > 0.6 ? possessionShift : 0))
          );
          const newAwayPossession = 100 - newHomePossession;

          return {
            ...m,
            minute: nextMinute,
            stats: {
              ...m.stats,
              possession: [newHomePossession, newAwayPossession],
              passes: [
                m.stats.passes[0] + Math.floor(Math.random() * 3 + 1),
                m.stats.passes[1] + Math.floor(Math.random() * 3 + 1),
              ],
            },
          };
        }
        return m;
      })
    );

    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleManualRefresh = () => {
    setSecondsRemaining(20);
    handleTriggerAutoRefresh();
  };

  useEffect(() => {
    if (!isAutoRefresh) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handleTriggerAutoRefresh();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAutoRefresh]);

  // 10. تحميل وتنظيف وتحديث المباريات عند فتح الموقع
  useEffect(() => {
    const savedMatches = loadSavedMatches();
    setMatches(savedMatches);
  }, []);

  // 9. React: تحديث حالة المباريات كل دقيقة وتحديث الحالات (Live/Upcoming/Finished)
  useEffect(() => {
    const updateMatchesEveryMinute = () => {
      setMatches((previousMatches) => {
        const updated = cleanAndUpdateMatches(previousMatches);
        const sorted = sortMatches(updated);
        saveMatches(sorted);
        return sorted;
      });
    };

    updateMatchesEveryMinute();
    const interval = setInterval(updateMatchesEveryMinute, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 12. React: فحص وتحديث المباريات دورياً كل 5 دقائق
  useEffect(() => {
    const refresh = () => {
      refreshMatchesFromAPI(setMatches);
    };
    refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // مزامنة أحدث المباريات مع التخزين المحلي
  useEffect(() => {
    saveMatches(matches);
  }, [matches]);

  const handleForceResetMatches = () => {
    const fresh = forceResetAndSyncMatches();
    setMatches(fresh);
  };

  // Sync broadcasts to storage
  useEffect(() => {
    try {
      localStorage.setItem('koralive_broadcasts', JSON.stringify(broadcasts));
    } catch (e) {
      console.error(e);
    }
  }, [broadcasts]);

  // Sync favorite teams to storage
  useEffect(() => {
    try {
      localStorage.setItem('koralive_favorite_teams', JSON.stringify(favoriteTeamIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteTeamIds]);

  // Sync custom notifications setting to storage
  useEffect(() => {
    try {
      localStorage.setItem('koralive_only_notify_favorites', String(onlyNotifyFavorites));
    } catch (e) {
      console.error(e);
    }
  }, [onlyNotifyFavorites]);

  // Sync document direction
  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  // Goal alert dismiss timer
  useEffect(() => {
    if (!goalAlert) return;
    const timer = setTimeout(() => {
      setGoalAlert(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [goalAlert]);

  // Toggle favorite team
  const handleToggleFavoriteTeam = (teamId: string) => {
    setFavoriteTeamIds((prev) => {
      const exists = prev.includes(teamId);
      return exists ? prev.filter((id) => id !== teamId) : [...prev, teamId];
    });
  };

  // Set favorite teams list
  const handleSetFavorites = (teamIds: string[]) => {
    setFavoriteTeamIds(teamIds);
  };

  // Toggle custom notification mode
  const handleToggleOnlyNotifyFavorites = () => {
    setOnlyNotifyFavorites((prev) => {
      const nextVal = !prev;
      setGoalAlert({
        id: `info-${Date.now()}`,
        matchTitle: nextVal
          ? (isArabic ? 'تنبيهات المباريات المفضلة فقط: مفعّلة' : 'Favorite Matches Only: Active')
          : (isArabic ? 'تنبيهات جميع المباريات: مفعّلة' : 'All Matches Alerts: Active'),
        minute: 0,
        scorer: nextVal
          ? (isArabic ? '🔔 ستصلك التنبيهات لفرقك المفضلة فقط' : '🔔 You will only receive alerts for favorite teams')
          : (isArabic ? '🔔 ستصلك التنبيهات لكافة المباريات' : '🔔 You will receive alerts for all matches'),
        team: '',
        scoreText: '',
        isInfoMessage: true,
      });
      return nextVal;
    });
  };

  // Live goal, match events & 10-minute kickoff reminder simulation
  const handleSimulateGoal = (
    targetMatchId?: string,
    forceType?: 'GOAL' | 'RED_CARD' | 'YELLOW_CARD' | 'PRE_MATCH_10M' | 'VAR'
  ) => {
    let targetMatch =
      matches.find((m) => m.id === targetMatchId) ||
      matches.find((m) => m.status === 'LIVE') ||
      matches[0];
    if (!targetMatch) return;

    // 1. Check if match is UPCOMING or user activated 10-Minute Kickoff Alert!
    if (targetMatch.status === 'UPCOMING' || forceType === 'PRE_MATCH_10M') {
      playGoalWhistleSound();
      sendUpcomingMatchPushNotification(targetMatch, 10, isArabic);
      setGoalAlert({
        id: `kickoff-10m-${Date.now()}`,
        matchTitle: isArabic
          ? `${targetMatch.homeTeam.nameAr} ضد ${targetMatch.awayTeam.nameAr}`
          : `${targetMatch.homeTeam.name} vs ${targetMatch.awayTeam.name}`,
        minute: 0,
        scorer: isArabic
          ? `⏰ تم ضبط التنبيه: انطلاق اللقاء بعد 10 دقائق على ${targetMatch.broadcasts[0]?.channelNameAr || 'القنوات الرسمية'}`
          : `⏰ Kickoff reminder in 10 minutes on ${targetMatch.broadcasts[0]?.channelName || 'Broadcast Channels'}`,
        team: isArabic ? targetMatch.leagueNameAr : targetMatch.leagueName,
        scoreText: targetMatch.startTime,
        alertType: 'PRE_MATCH_10M',
      });
      return;
    }

    const scorerTeam = targetMatch.homeTeam;
    const newMinute = Math.min(90, (targetMatch.minute || 74) + 2);
    const isFavMatch =
      favoriteTeamIds.includes(targetMatch.homeTeam.id) ||
      favoriteTeamIds.includes(targetMatch.awayTeam.id);

    // 2. Red Card Alert
    if (forceType === 'RED_CARD') {
      playGoalWhistleSound();
      const cardPlayer = targetMatch.homeTeam.id === 'rm' ? 'أنطونيو روديغر' : 'علي لاجامي';
      const newCardEvent = {
        id: `ev-card-${Date.now()}`,
        minute: newMinute,
        type: 'RED_CARD' as const,
        teamId: scorerTeam.id,
        playerName: cardPlayer,
        playerNameAr: cardPlayer,
        detail: isArabic ? 'طرد مباشر بالبطاقة الحمراء' : 'Direct Red Card',
      };
      setMatches((prev) =>
        prev.map((m) => (m.id === targetMatch.id ? { ...m, events: [newCardEvent, ...m.events] } : m))
      );
      setGoalAlert({
        id: `red-${Date.now()}`,
        matchTitle: isArabic
          ? `${targetMatch.homeTeam.nameAr} ضد ${targetMatch.awayTeam.nameAr}`
          : `${targetMatch.homeTeam.name} vs ${targetMatch.awayTeam.name}`,
        minute: newMinute,
        scorer: cardPlayer,
        team: isArabic ? scorerTeam.nameAr : scorerTeam.name,
        scoreText: `${targetMatch.homeScore} - ${targetMatch.awayScore}`,
        alertType: 'RED_CARD',
        isFavorite: isFavMatch,
      });
      return;
    }

    // 3. Yellow Card Alert
    if (forceType === 'YELLOW_CARD') {
      const yellowPlayer = targetMatch.homeTeam.id === 'rm' ? 'فينيسيوس جونيور' : 'سلطان الغنام';
      setGoalAlert({
        id: `yellow-${Date.now()}`,
        matchTitle: isArabic
          ? `${targetMatch.homeTeam.nameAr} ضد ${targetMatch.awayTeam.nameAr}`
          : `${targetMatch.homeTeam.name} vs ${targetMatch.awayTeam.name}`,
        minute: newMinute,
        scorer: yellowPlayer,
        team: isArabic ? scorerTeam.nameAr : scorerTeam.name,
        scoreText: `${targetMatch.homeScore} - ${targetMatch.awayScore}`,
        alertType: 'YELLOW_CARD',
        isFavorite: isFavMatch,
      });
      return;
    }

    // 4. VAR Alert
    if (forceType === 'VAR') {
      setGoalAlert({
        id: `var-${Date.now()}`,
        matchTitle: isArabic
          ? `${targetMatch.homeTeam.nameAr} ضد ${targetMatch.awayTeam.nameAr}`
          : `${targetMatch.homeTeam.name} vs ${targetMatch.awayTeam.name}`,
        minute: newMinute,
        scorer: isArabic ? 'قرار تقنية الفيديو: تأكيد صحة الهدف' : 'VAR Decision: Goal Confirmed',
        team: isArabic ? scorerTeam.nameAr : scorerTeam.name,
        scoreText: `${targetMatch.homeScore} - ${targetMatch.awayScore}`,
        alertType: 'VAR',
        isFavorite: isFavMatch,
      });
      return;
    }

    // 5. Default Goal Alert
    const newHomeScore = targetMatch.homeScore + 1;
    const goalScorer =
      targetMatch.homeTeam.id === 'hilal'
        ? (isArabic ? 'ألكسندر ميتروفيتش' : 'Aleksandar Mitrović')
        : targetMatch.homeTeam.id === 'rm'
        ? (isArabic ? 'كيليان مبابي' : 'Kylian Mbappé')
        : (isArabic ? 'كريستيانو رونالدو' : 'Cristiano Ronaldo');

    const newEvent = {
      id: `ev-${Date.now()}`,
      minute: newMinute,
      type: 'GOAL' as const,
      teamId: scorerTeam.id,
      playerName: goalScorer,
      playerNameAr: goalScorer,
      assistName: isArabic ? 'سالم الدوسري' : 'Salem Al-Dawsari',
      assistNameAr: isArabic ? 'سالم الدوسري' : 'Salem Al-Dawsari',
      detail: isArabic ? 'صاروخية مذهلة في الشباك!' : 'Stunning rocket into the net!',
    };

    const updatedMatches = matches.map((m) => {
      if (m.id === targetMatch.id) {
        return {
          ...m,
          minute: newMinute,
          homeScore: newHomeScore,
          events: [newEvent, ...m.events],
        };
      }
      return m;
    });

    setMatches(updatedMatches);

    // Send real Web Push notification to user device / OS
    sendGoalPushNotification(
      { ...targetMatch, homeScore: newHomeScore },
      goalScorer,
      newMinute,
      isArabic
    );

    // If modal is open for this match, sync modal
    if (selectedMatch && selectedMatch.id === targetMatch.id) {
      setSelectedMatch({
        ...selectedMatch,
        minute: newMinute,
        homeScore: newHomeScore,
        events: [newEvent, ...selectedMatch.events],
      });
    }

    // If "onlyNotifyFavorites" is active and this match is NOT in favorites:
    if (onlyNotifyFavorites && !isFavMatch) {
      setGoalAlert({
        id: `alert-muted-${Date.now()}`,
        matchTitle: isArabic
          ? `${targetMatch.homeTeam.nameAr} ضد ${targetMatch.awayTeam.nameAr}`
          : `${targetMatch.homeTeam.name} vs ${targetMatch.awayTeam.name}`,
        minute: newMinute,
        scorer: isArabic
          ? 'تم كتم التنبيه الصوتي (خيار مباريات المفضلة فقط مفعّل)'
          : 'Goal sound muted (Favorites-only alert filter is active)',
        team: isArabic ? targetMatch.homeTeam.nameAr : targetMatch.homeTeam.name,
        scoreText: `${newHomeScore} - ${targetMatch.awayScore}`,
        isInfoMessage: true,
      });
      return;
    }

    // Play referee whistle sound if enabled
    if (isSoundEnabled) {
      playGoalWhistleSound();
    }

    // Show Push notification toast
    setGoalAlert({
      id: `alert-${Date.now()}`,
      matchTitle: isArabic
        ? `${targetMatch.homeTeam.nameAr} ضد ${targetMatch.awayTeam.nameAr}`
        : `${targetMatch.homeTeam.name} vs ${targetMatch.awayTeam.name}`,
      minute: newMinute,
      scorer: goalScorer,
      team: isArabic ? targetMatch.homeTeam.nameAr : targetMatch.homeTeam.name,
      scoreText: `${newHomeScore} - ${targetMatch.awayScore}`,
      isFavorite: isFavMatch,
      alertType: 'GOAL',
    });
  };

  const handleAddBroadcast = (broadcast: OfficialBroadcast) => {
    setBroadcasts((prev) => [broadcast, ...prev]);
  };

  const handleDeleteBroadcast = (id: string) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
    setMatches((prev) =>
      prev.map((m) => ({
        ...m,
        broadcasts: m.broadcasts.filter((b) => b.id !== id),
      }))
    );
  };

  const handleAssignChannelToMatch = (matchId: string, broadcast: OfficialBroadcast) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const exists = m.broadcasts.some((b) => b.id === broadcast.id);
          return {
            ...m,
            broadcasts: exists ? m.broadcasts : [...m.broadcasts, broadcast],
          };
        }
        return m;
      })
    );
  };

  const handleSubscribe = (plan: 'monthly' | 'yearly' = 'yearly') => {
    setIsSubscribed(true);
    setSubscriptionPlan(plan);
    try {
      localStorage.setItem('koralive_subscription_active', 'true');
      localStorage.setItem('koralive_subscription_plan', plan);
      localStorage.setItem('koralive_subscription_date', new Date().toISOString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelSubscription = () => {
    setIsSubscribed(false);
    try {
      localStorage.setItem('koralive_subscription_active', 'false');
    } catch (e) {
      console.error(e);
    }
  };

  const liveCount = matches.filter((m) => m.status === 'LIVE').length;

  return (
    <div
      className={`min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between ${
        isMobileFrame ? 'items-center py-6 px-2' : ''
      }`}
    >
      {/* Goal Alert Toast */}
      <NotificationBanner
        alert={goalAlert}
        onClose={() => setGoalAlert(null)}
        isArabic={isArabic}
      />

      {/* Main Container / Mobile Device Frame */}
      <div
        className={`w-full bg-[#070a12]/75 backdrop-blur-md flex flex-col flex-1 relative transition-all ${
          isMobileFrame
            ? 'max-w-[420px] rounded-[40px] border-4 border-slate-700/80 shadow-2xl overflow-hidden min-h-[840px] max-h-[92vh]'
            : 'max-w-2xl mx-auto border-x border-slate-800/60 shadow-xl'
        }`}
      >
        {/* Mobile Speaker Notch in Frame Mode */}
        {isMobileFrame && (
          <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto flex items-center justify-center gap-2 z-50">
            <div className="w-10 h-1 bg-slate-700 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-slate-700" />
          </div>
        )}

        {/* Top App Header */}
        <Header
          isArabic={isArabic}
          onToggleLanguage={() => setIsArabic(!isArabic)}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
          liveMatchCount={liveCount}
          isSubscribed={isSubscribed}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          onOpenTerms={() => setIsTermsModalOpen(true)}
          favoriteCount={favoriteTeamIds.length}
          onlyNotifyFavorites={onlyNotifyFavorites}
          onOpenFavorites={() => setIsFavoritesModalOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          isAdminAuthenticated={isAdminAuthenticated}
          onOpenEarnings={handleOpenEarnings}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
          onOpenPushModal={() => setIsPushModalOpen(true)}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-8">
          {currentTab === 'matches' && (
            <LiveMatchesTab
              matches={matches}
              onSelectMatch={(m) => setSelectedMatch(m)}
              onSimulateGoal={handleSimulateGoal}
              isArabic={isArabic}
              favoriteTeamIds={favoriteTeamIds}
              onToggleFavoriteTeam={handleToggleFavoriteTeam}
              onOpenFavoritesModal={() => setIsFavoritesModalOpen(true)}
              onlyNotifyFavorites={onlyNotifyFavorites}
              onToggleOnlyNotifyFavorites={handleToggleOnlyNotifyFavorites}
              isAutoRefresh={isAutoRefresh}
              onToggleAutoRefresh={() => setIsAutoRefresh(!isAutoRefresh)}
              secondsRemaining={secondsRemaining}
              onManualRefresh={handleManualRefresh}
              isRefreshing={isRefreshing}
              lastUpdatedTime={lastUpdatedTime}
              onOpenPublishModal={() => setIsPublishModalOpen(true)}
              onForceResetMatches={handleForceResetMatches}
              onOpenPushModal={() => setIsPushModalOpen(true)}
            />
          )}

          {currentTab === 'standings' && <StandingsTab isArabic={isArabic} />}

          {currentTab === 'broadcast' && (
            <WatchGuideTab
              matches={matches}
              onOpenAdmin={() => setIsAdminModalOpen(true)}
              isSubscribed={isSubscribed}
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
              isArabic={isArabic}
              onSelectMatch={(m) => setSelectedMatch(m)}
            />
          )}

          {currentTab === 'motm' && (
            <MotmHighlightTab matches={matches} isArabic={isArabic} />
          )}
        </main>

        {/* Fixed Bottom Touch Nav Bar */}
        <BottomNavBar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isArabic={isArabic}
        />
      </div>

      {/* Match Detail Modal */}
      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        isSubscribed={isSubscribed}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        isArabic={isArabic}
        favoriteTeamIds={favoriteTeamIds}
        onToggleFavoriteTeam={handleToggleFavoriteTeam}
        onSimulateGoal={handleSimulateGoal}
      />

      {/* Favorites & Custom Notifications Modal */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favoriteTeamIds={favoriteTeamIds}
        onToggleFavorite={handleToggleFavoriteTeam}
        onSetFavorites={handleSetFavorites}
        onlyNotifyFavorites={onlyNotifyFavorites}
        onToggleOnlyNotifyFavorites={handleToggleOnlyNotifyFavorites}
        isArabic={isArabic}
        onViewFavoriteMatches={() => setCurrentTab('matches')}
      />

      {/* Admin Broadcast Manager Modal */}
      <AdminBroadcastModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        broadcasts={broadcasts}
        onAddBroadcast={handleAddBroadcast}
        onDeleteBroadcast={handleDeleteBroadcast}
        matches={matches}
        onAssignChannelToMatch={handleAssignChannelToMatch}
        isArabic={isArabic}
        onOpenEarnings={handleOpenEarnings}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      {/* Subscription VIP Modal (20 SAR/Month or 200 SAR/Year + 2 Months Free) */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        isSubscribed={isSubscribed}
        subscriptionPlan={subscriptionPlan}
        onSubscribe={handleSubscribe}
        onCancelSubscription={handleCancelSubscription}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        isArabic={isArabic}
      />

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        isArabic={isArabic}
      />

      {/* Hidden Owner Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
        isArabic={isArabic}
      />

      {/* Hidden Owner Earnings & Bank Payouts Dashboard */}
      <EarningsDashboard
        isOpen={isEarningsOpen && isAdminAuthenticated}
        onClose={() => setIsEarningsOpen(false)}
        onLogout={handleAdminLogout}
        isArabic={isArabic}
      />

      {/* Multi-Platform Deployment & Install Modal */}
      <PlatformPublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        isArabic={isArabic}
      />

      {/* Web Push Notifications Management & Test Modal */}
      <PushNotificationModal
        isOpen={isPushModalOpen}
        onClose={() => setIsPushModalOpen(false)}
        isArabic={isArabic}
      />
    </div>
  );
}
