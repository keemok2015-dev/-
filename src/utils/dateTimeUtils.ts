export function formatMatchDate(dateStr: string, isArabic: boolean): string {
  if (!dateStr) return '';
  // dateStr format: YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  const matchDate = new Date(year, month - 1, day);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const yest = new Date(now.getTime() - 86400000);
  const yesterdayStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
  
  const tom = new Date(now.getTime() + 86400000);
  const tomorrowStr = `${tom.getFullYear()}-${String(tom.getMonth() + 1).padStart(2, '0')}-${String(tom.getDate()).padStart(2, '0')}`;

  const isToday = dateStr === todayStr;
  const isYesterday = dateStr === yesterdayStr;
  const isTomorrow = dateStr === tomorrowStr;

  const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const monthNamesEn = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayName = isArabic ? dayNamesAr[matchDate.getDay()] : dayNamesEn[matchDate.getDay()];
  const monthName = isArabic ? monthNamesAr[matchDate.getMonth()] : monthNamesEn[matchDate.getMonth()];

  if (isArabic) {
    if (isToday) return `اليوم (${dayName} ${day} ${monthName})`;
    if (isYesterday) return `أمس (${dayName} ${day} ${monthName})`;
    if (isTomorrow) return `غداً (${dayName} ${day} ${monthName})`;
    return `${dayName}، ${day} ${monthName} ${year}`;
  } else {
    if (isToday) return `Today (${dayName}, ${monthName} ${day})`;
    if (isYesterday) return `Yesterday (${dayName}, ${monthName} ${day})`;
    if (isTomorrow) return `Tomorrow (${dayName}, ${monthName} ${day})`;
    return `${dayName}, ${monthName} ${day}, ${year}`;
  }
}

export function formatKickoffTime(timeStr: string, isArabic: boolean): string {
  if (!timeStr) return '';
  return isArabic ? `${timeStr} بتوقيت مكة` : `${timeStr} KSA`;
}

export function getUpcomingCountdown(
  timeStr: string,
  isArabic: boolean,
  dateStr?: string,
  dateTime?: string
): string {
  if (!timeStr && !dateTime) return '';

  let targetTimestamp: number = 0;
  if (dateTime) {
    targetTimestamp = new Date(dateTime).getTime();
  } else if (dateStr && timeStr) {
    targetTimestamp = new Date(`${dateStr}T${timeStr}:00`).getTime();
  } else if (timeStr) {
    const today = new Date();
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h || 0, m || 0);
    targetTimestamp = d.getTime();
  }

  const diffMs = targetTimestamp - Date.now();
  const diffMins = Math.floor(diffMs / (60 * 1000));

  if (diffMins <= 0) {
    return isArabic ? 'تنطلق الآن ⚡' : 'Starting now ⚡';
  }

  if (diffMins < 60) {
    return isArabic ? `تبدأ بعد ${diffMins} دقيقة ⏱️` : `Starts in ${diffMins}m ⏱️`;
  }

  if (diffMins < 180) {
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (mins === 0) {
      return isArabic ? `تبدأ بعد ${hours} ساعة ⏱️` : `Starts in ${hours}h ⏱️`;
    }
    return isArabic
      ? `تبدأ بعد ${hours} ساعة و ${mins} دقيقة ⏱️`
      : `Starts in ${hours}h ${mins}m ⏱️`;
  }

  return isArabic ? `الليلة ${timeStr} بتوقيت مكة` : `Tonight ${timeStr} KSA`;
}
