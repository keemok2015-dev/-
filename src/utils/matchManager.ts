// ============================================================
// كورة لايف - إدارة وتنظيف المباريات (حذف المباريات المنتهية والقديمة)
// ============================================================
// الوظائف المعتمدة:
// 1) حذف جميع المباريات القديمة والمباريات التي انتهت تلقائياً
// 2) إبقاء المباريات المباشرة LIVE والمباريات القادمة UPCOMING فقط
// 3) تحديث حالة المباراة بدقة وتحويلها إلى Live أثناء وقتها
// 4) منع تكرار المباريات وترتيبها حسب الأولوية والوقت
// 5) تنظيف LocalStorage وتحديث البيانات بشكل دوري
// ============================================================

import { Match, MatchStatus } from '../types/football';
import { INITIAL_MATCHES } from '../data/mockFootballData';

export const STORAGE_MATCHES_KEY = 'koralive_matches_v9';

/**
 * دالة مساعدة للحصول على تاريخ ووقت البداية بدقة
 */
export const getMatchStartTime = (match: Match): Date => {
  if (match.dateTime) {
    const d = new Date(match.dateTime);
    if (!isNaN(d.getTime())) return d;
  }
  if (match.date && match.startTime) {
    const d = new Date(`${match.date}T${match.startTime}:00`);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
};

// ------------------------------------------------------------
// 1. تحديث حالة المباراة بدقة
// ------------------------------------------------------------
export const updateMatchStatus = (match: Match): Match => {
  const now = new Date();
  const start = getMatchStartTime(match);

  // مدة المباراة الافتراضية ساعتان (120 دقيقة)
  const end = new Date(start.getTime() + 120 * 60 * 1000);

  if (now < start) {
    return {
      ...match,
      status: 'UPCOMING' as MatchStatus,
    };
  }

  if (now >= start && now <= end) {
    const elapsedMinutes = Math.min(
      90,
      Math.max(1, Math.floor((now.getTime() - start.getTime()) / (60 * 1000)))
    );
    return {
      ...match,
      status: 'LIVE' as MatchStatus,
      minute: match.minute && match.minute > 0 ? match.minute : elapsedMinutes,
    };
  }

  return {
    ...match,
    status: 'FINISHED' as MatchStatus,
  };
};

// ------------------------------------------------------------
// 2. حذف جميع المباريات القديمة والمباريات التي انتهت
// ------------------------------------------------------------
export const removeOldMatches = (matches: Match[]): Match[] => {
  const now = Date.now();

  return matches.filter((match) => {
    // الشرط الصارم للمستخدم: حذف أي مباراة انتهت أو قديمة
    if (match.status === 'FINISHED') return false;

    const start = getMatchStartTime(match).getTime();
    const end = start + 120 * 60 * 1000; // تنتهي المباراة بعد ساعتين من البداية

    return end > now;
  });
};

// ------------------------------------------------------------
// 3. تحديث جميع المباريات وتنظيف القديمة والمنتهية
// ------------------------------------------------------------
export const cleanAndUpdateMatches = (matches: Match[]): Match[] => {
  return matches
    .map(updateMatchStatus)
    .filter((match) => {
      // حذف أي مباراة حالتها منتهية FINISHED
      if (match.status === 'FINISHED') return false;

      const start = getMatchStartTime(match).getTime();
      const end = start + 120 * 60 * 1000;

      // حذف أي مباراة مضى على انطلاقها أكثر من ساعتين
      return end > Date.now();
    });
};

// ------------------------------------------------------------
// 4. ترتيب المباريات حسب التاريخ والوقت (المباشرة أولاً ثم القادمة)
// ------------------------------------------------------------
export const sortMatches = (matches: Match[]): Match[] => {
  return [...matches].sort((a, b) => {
    // المباريات المباشرة تتصدر القائمة
    if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
    if (b.status === 'LIVE' && a.status !== 'LIVE') return 1;

    const timeA = getMatchStartTime(a).getTime();
    const timeB = getMatchStartTime(b).getTime();
    return timeA - timeB;
  });
};

// ------------------------------------------------------------
// 5. منع تكرار المباراة عند إضافة مباراة جديدة
// ------------------------------------------------------------
export const addMatchWithoutDuplicate = (
  currentMatches: Match[],
  newMatch: Match
): Match[] => {
  const exists = currentMatches.some((match) => match.id === newMatch.id);

  if (exists) {
    return currentMatches;
  }

  return sortMatches([...currentMatches, newMatch]);
};

// ------------------------------------------------------------
// 6. تحديث مباراة موجودة أو إضافتها إذا كانت جديدة
// ------------------------------------------------------------
export const mergeMatches = (
  currentMatches: Match[],
  newMatches: Match[]
): Match[] => {
  const map = new Map<string, Match>(
    currentMatches.map((match) => [match.id, match])
  );

  newMatches.forEach((match) => {
    const existing = map.get(match.id);
    map.set(match.id, {
      ...(existing || {}),
      ...match,
    });
  });

  return sortMatches(Array.from(map.values()));
};

// ------------------------------------------------------------
// 7. تحميل وتنظيف المباريات من LocalStorage
// ------------------------------------------------------------
export const loadSavedMatches = (): Match[] => {
  try {
    // تنظيف المفاتيح القديمة التي قد تحتوي على مباريات منتهية
    ['koralive_matches', 'matches', 'koralive_matches_v1', 'koralive_matches_v2', 'koralive_matches_v5', 'koralive_matches_v6', 'koralive_matches_v7'].forEach(
      (oldKey) => {
        try {
          localStorage.removeItem(oldKey);
        } catch {}
      }
    );

    const savedRaw = localStorage.getItem(STORAGE_MATCHES_KEY);

    let rawList: Match[] = [];
    if (savedRaw) {
      try {
        rawList = JSON.parse(savedRaw);
      } catch {
        rawList = [];
      }
    }

    // إذا لم تكن هناك مباريات محفوظة أو كانت فارغة، نستخدم INITIAL_MATCHES
    if (!rawList || rawList.length === 0) {
      rawList = INITIAL_MATCHES;
    } else {
      // دمج أي مباريات أساسية جديدة
      rawList = mergeMatches(INITIAL_MATCHES, rawList);
    }

    // حذف جميع المباريات القديمة أو المنتهية
    const cleaned = cleanAndUpdateMatches(rawList);
    const sorted = sortMatches(cleaned);

    saveMatches(sorted);
    return sorted;
  } catch (error) {
    console.error('Error loading matches from LocalStorage:', error);
    const cleanedInitial = cleanAndUpdateMatches(INITIAL_MATCHES);
    return sortMatches(cleanedInitial);
  }
};

// ------------------------------------------------------------
// 8. حفظ المباريات في LocalStorage
// ------------------------------------------------------------
export const saveMatches = (matches: Match[]): void => {
  try {
    // التأكد من عدم حفظ مباريات منتهية
    const activeOnly = matches.filter((m) => m.status !== 'FINISHED');
    localStorage.setItem(STORAGE_MATCHES_KEY, JSON.stringify(activeOnly));
  } catch (error) {
    console.error('Error saving matches:', error);
  }
};

// ------------------------------------------------------------
// 9. جلب المباريات الجديدة من API وتحديثها
// ------------------------------------------------------------
export const refreshMatchesFromAPI = async (
  setMatches: (fn: (current: Match[]) => Match[]) => void
): Promise<Match[]> => {
  try {
    // إذا وجد مسار حقيقي يتم جلبه، أو دمج القائمة المحدثة
    const response = await fetch('/api/matches').catch(() => null);

    let incoming: Match[] = [];
    if (response && response.ok) {
      incoming = await response.json();
    } else {
      incoming = INITIAL_MATCHES;
    }

    setMatches((currentMatches) => {
      const merged = mergeMatches(currentMatches, incoming);
      const cleaned = cleanAndUpdateMatches(merged);
      const sorted = sortMatches(cleaned);
      saveMatches(sorted);
      return sorted;
    });

    return incoming;
  } catch (error) {
    console.error('Failed to refresh matches from API:', error);
    return [];
  }
};

// ------------------------------------------------------------
// 10. إعادة ضبط ومزامنة المباريات قسرياً مع حذف المنتهية
// ------------------------------------------------------------
export const forceResetAndSyncMatches = (): Match[] => {
  try {
    localStorage.removeItem(STORAGE_MATCHES_KEY);
  } catch {}
  const cleaned = cleanAndUpdateMatches(INITIAL_MATCHES);
  const sorted = sortMatches(cleaned);
  saveMatches(sorted);
  return sorted;
};

