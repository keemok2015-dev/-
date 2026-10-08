// ============================================================
// Date & Time Helpers for Dynamic Matches & Upcomings
// ============================================================

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getYesterdayDateString(): string {
  const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getTomorrowDateString(): string {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * توليد وقت مباراة بعد X دقيقة من الآن بتنسيق HH:mm وتاريخ ISO
 */
export function getRelativeTimeFromNow(minutesFromNow: number): { timeStr: string; dateStr: string; isoDateTime: string } {
  const target = new Date(Date.now() + minutesFromNow * 60 * 1000);
  const hours = String(target.getHours()).padStart(2, '0');
  const minutes = String(target.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  const dateStr = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
  
  return {
    timeStr,
    dateStr,
    isoDateTime: target.toISOString(),
  };
}

/**
 * حساب الوقت المتبقي لانطلاق المباراة بنص مقروء وجذاب
 */
export function getMinutesUntilKickoff(dateStr: string, timeStr: string, dateTime?: string): number {
  let targetTime: number;
  if (dateTime) {
    targetTime = new Date(dateTime).getTime();
  } else if (dateStr && timeStr) {
    targetTime = new Date(`${dateStr}T${timeStr}:00`).getTime();
  } else {
    return 0;
  }

  const diffMs = targetTime - Date.now();
  return Math.max(0, Math.floor(diffMs / (60 * 1000)));
}

/**
 * صياغة نص العد التنازلي للمباريات القادمة قريباً
 */
export function formatUpcomingCountdownText(minutesLeft: number, isArabic: boolean): string {
  if (minutesLeft <= 0) {
    return isArabic ? 'تنطلق الآن ⚡' : 'Starting now ⚡';
  }
  if (minutesLeft < 60) {
    return isArabic ? `تبدأ بعد ${minutesLeft} دقيقة ⏱️` : `Starts in ${minutesLeft}m ⏱️`;
  }
  const hours = Math.floor(minutesLeft / 60);
  const remainingMins = minutesLeft % 60;
  if (remainingMins === 0) {
    return isArabic ? `تبدأ بعد ${hours} ساعة` : `Starts in ${hours}h`;
  }
  return isArabic
    ? `تبدأ بعد ${hours} ساعة و ${remainingMins} دقيقة`
    : `Starts in ${hours}h ${remainingMins}m`;
}
