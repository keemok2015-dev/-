export function formatMatchDate(dateStr: string, isArabic: boolean): string {
  // dateStr format: YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  const matchDate = new Date(year, month - 1, day);
  
  // Reference date: 2026-10-04 is "Today"
  const isToday = dateStr === '2026-10-04';
  const isYesterday = dateStr === '2026-10-03';
  const isTomorrow = dateStr === '2026-10-05';

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
    if (isToday) return `اليوم (${dayName} ${day} ${monthName} ${year})`;
    if (isYesterday) return `أمس (${dayName} ${day} ${monthName} ${year})`;
    if (isTomorrow) return `غداً (${dayName} ${day} ${monthName} ${year})`;
    return `${dayName}، ${day} ${monthName} ${year}`;
  } else {
    if (isToday) return `Today (${dayName}, ${monthName} ${day}, ${year})`;
    if (isYesterday) return `Yesterday (${dayName}, ${monthName} ${day}, ${year})`;
    if (isTomorrow) return `Tomorrow (${dayName}, ${monthName} ${day}, ${year})`;
    return `${dayName}, ${monthName} ${day}, ${year}`;
  }
}

export function formatKickoffTime(timeStr: string, isArabic: boolean): string {
  // timeStr format: '21:00' or '18:30'
  if (!timeStr) return '';
  return isArabic ? `${timeStr} بتوقيت مكة المكرمة` : `${timeStr} KSA (GMT+3)`;
}

export function getUpcomingCountdown(timeStr: string, isArabic: boolean): string {
  // Mock calculate relative time for 2026-10-04 current time ~ 18:40
  if (timeStr === '22:00') {
    return isArabic ? 'يبدأ خلال 3 ساعات و 20 دقيقة' : 'Starts in 3h 20m';
  }
  if (timeStr === '21:00') {
    return isArabic ? 'يبدأ خلال ساعتين و 20 دقيقة' : 'Starts in 2h 20m';
  }
  if (timeStr === '20:00' || timeStr === '20:30') {
    return isArabic ? 'يبدأ خلال ساعة ونصف' : 'Starts in 1h 30m';
  }
  return isArabic ? `موعد اللقاء: ${timeStr} مكة` : `Kickoff: ${timeStr} KSA`;
}
