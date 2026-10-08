// ============================================================
// Web Push Notifications Service (إشعارات الدفع الفورية للويب)
// ============================================================
// يدير تسجيل Service Worker، إذن الإشعارات، واشتراكات المباريات
// وإرسال التنبيهات الفورية عبر Web Notification API و Push Manager
// ============================================================

import { Match, MatchEvent } from '../types/football';

export interface PushNotificationSettings {
  enabled: boolean;
  notifyGoals: boolean;
  notifyKickoff: boolean;
  notifyFulltime: boolean;
  notifyFavoritesOnly: boolean;
}

const STORAGE_KEY_SETTINGS = 'koralive_push_settings';
const STORAGE_KEY_MATCH_SUBS = 'koralive_push_match_subscriptions';

let swRegistration: ServiceWorkerRegistration | null = null;

/**
 * فحص دعم المتصفح لإشعارات الدفع و Service Worker
 */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'Notification' in window
  );
}

/**
 * الحصول على حالة إذن الإشعارات الحالية
 */
export function getPushPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * تهيئة وتسجيل Service Worker
 */
export async function initializeWebPush(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    swRegistration = registration;
    console.log('✅ KoraLive Service Worker registered for Web Push:', registration.scope);
    return registration;
  } catch (error) {
    console.error('❌ Failed to register Service Worker for Web Push:', error);
    return null;
  }
}

/**
 * طلب إذن المستخدم لتفعيل إشعارات الدفع الفورية
 */
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const current = getPushSettings();
      savePushSettings({ ...current, enabled: true });
      if (!swRegistration) {
        await initializeWebPush();
      }
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * استرجاع إعدادات الإشعارات
 */
export function getPushSettings(): PushNotificationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return {
    enabled: typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted',
    notifyGoals: true,
    notifyKickoff: true,
    notifyFulltime: true,
    notifyFavoritesOnly: false,
  };
}

/**
 * حفظ إعدادات الإشعارات
 */
export function savePushSettings(settings: PushNotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
}

/**
 * جلب قائمة معرفات المباريات المشترك في إشعاراتها
 */
export function getSubscribedMatchIds(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MATCH_SUBS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return [];
}

/**
 * فحص هل المباراة مفعل لها إشعار دفع خاص
 */
export function isMatchSubscribed(matchId: string): boolean {
  const ids = getSubscribedMatchIds();
  return ids.includes(matchId);
}

/**
 * تفعيل / إلغاء تفعيل إشعارات الدفع لمباراة معينة
 */
export function toggleMatchSubscription(matchId: string): boolean {
  const ids = getSubscribedMatchIds();
  let updated: string[];
  let isNowSubscribed = false;

  if (ids.includes(matchId)) {
    updated = ids.filter((id) => id !== matchId);
    isNowSubscribed = false;
  } else {
    updated = [...ids, matchId];
    isNowSubscribed = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY_MATCH_SUBS, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  return isNowSubscribed;
}

/**
 * إرسال إشعار دفع حقيقي عبر Service Worker للمتصفح والنظام
 */
export async function showPushNotification(
  title: string,
  options: NotificationOptions & { matchId?: string; url?: string } = {}
): Promise<boolean> {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    if (!swRegistration) {
      swRegistration = await navigator.serviceWorker.ready;
    }

    if (swRegistration && 'showNotification' in swRegistration) {
      await swRegistration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [250, 100, 250, 100, 450],
        tag: options.tag || 'koralive-push-alert',
        renotify: true,
        dir: 'rtl',
        lang: 'ar',
        actions: [
          { action: 'open_match', title: '⚽ فتح المباراة' },
          { action: 'dismiss', title: 'إغلاق ✕' },
        ],
        ...options,
      } as any);
      return true;
    } else {
      // Fallback to standard Window Notification if SW isn't ready
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });
      return true;
    }
  } catch (error) {
    console.error('Failed to show push notification:', error);
    return false;
  }
}

/**
 * إرسال إشعار دفع فوري عند تسجيل هدف
 */
export async function sendGoalPushNotification(
  match: Match,
  scorerName: string,
  minute: number,
  isArabic: boolean = true
): Promise<boolean> {
  const homeName = isArabic ? match.homeTeam.nameAr : match.homeTeam.name;
  const awayName = isArabic ? match.awayTeam.nameAr : match.awayTeam.name;
  const title = `⚽ جوووووول! (${homeName} ${match.homeScore} - ${match.awayScore} ${awayName})`;
  const body = `🎯 الهدف بواسطة: ${scorerName} في الدقيقة ${minute}' · شاهد التحديث المباشر الآن!`;

  return showPushNotification(title, {
    body,
    tag: `goal-${match.id}-${Date.now()}`,
    matchId: match.id,
    url: '/',
  });
}

/**
 * إرسال إشعار دفع لمباراة ستلعب قريباً
 */
export async function sendUpcomingMatchPushNotification(
  match: Match,
  minutesLeft: number,
  isArabic: boolean = true
): Promise<boolean> {
  const homeName = isArabic ? match.homeTeam.nameAr : match.homeTeam.name;
  const awayName = isArabic ? match.awayTeam.nameAr : match.awayTeam.name;
  const channel = match.broadcasts[0]
    ? (isArabic ? match.broadcasts[0].channelNameAr : match.broadcasts[0].channelName)
    : 'SSC 1 HD';

  const title = `⏰ تذكير: قمة كروية تبدأ قريباً!`;
  const body = `🏆 ${homeName} 🆚 ${awayName} تبدأ خلال ${minutesLeft} دقيقة على ${channel} (${match.stadiumAr || match.stadium})`;

  return showPushNotification(title, {
    body,
    tag: `upcoming-${match.id}`,
    matchId: match.id,
    url: '/',
  });
}

/**
 * إرسال إشعار دفع تجريبي للتحقق من عمل الخدمة في جهاز المستخدم
 */
export async function sendTestPushNotification(isArabic: boolean = true): Promise<boolean> {
  const title = isArabic
    ? '⚽ كورة لايف - تم تفعيل إشعارات الدفع بنجاح!'
    : '⚽ KoraLive - Web Push Notifications Activated!';
  const body = isArabic
    ? 'جووووول تجريبي! ستصلك تنبيهات الأهداف والنتائج المباشرة حتى لو كان التطبيق مغلقاً أو في الخلفية 🚀'
    : 'Test Goal! You will now receive instant goal alerts even if the app is closed or in background 🚀';

  return showPushNotification(title, {
    body,
    tag: 'test-push-notification',
    url: '/',
  });
}
