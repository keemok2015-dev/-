/**
 * ============================================================
 * تعديلات كورة لايف - ملف الكود الجديد فقط
 * ============================================================
 *
 * 1) تصحيح مشكلة عدم عرض المباريات القديمة (المنتهية حديثاً)
 * 2) إضافة مصادر دوريات العالم المهمة
 * 3) التأكد أن المباراة تظهر "مباشر" فقط إذا كانت فعلاً مباشرة
 * 4) حذف مباريات النساء + مباريات الفئات السنية (شباب/ناشئين)
 *
 * ضع التعديلات في الملفات المذكورة.
 */

// ============================================================
// ① ملف: src/lib/matches.ts
// استبدل تعريف leagueDefinitions بالكامل بهذا:
// ============================================================

export const leagueDefinitions = [
  // السعودية والخليج
  { id: 'ksa.1', name: 'دوري روشن السعودي', filter: 'دوري روشن', color: 'green' },
  { id: 'uae.1', name: 'دوري أدنوك الإماراتي', filter: 'الإماراتي', color: 'red' },
  { id: 'qat.1', name: 'دوري نجوم قطر', filter: 'القطري', color: 'maroon' },
  { id: 'egy.1', name: 'الدوري المصري الممتاز', filter: 'المصري', color: 'red' },
  // أوروبا الكبرى
  { id: 'eng.1', name: 'الدوري الإنجليزي الممتاز', filter: 'البريميرليغ', color: 'violet' },
  { id: 'esp.1', name: 'الدوري الإسباني', filter: 'لا ليغا', color: 'orange' },
  { id: 'ita.1', name: 'الدوري الإيطالي', filter: 'سيري أ', color: 'blue' },
  { id: 'ger.1', name: 'الدوري الألماني', filter: 'بوندسليغا', color: 'red' },
  { id: 'fra.1', name: 'الدوري الفرنسي', filter: 'ليغ 1', color: 'cyan' },
  { id: 'ned.1', name: 'الدوري الهولندي', filter: 'إيريديفيزي', color: 'orange' },
  { id: 'por.1', name: 'الدوري البرتغالي', filter: 'البرتغالي', color: 'green' },
  { id: 'tur.1', name: 'الدوري التركي', filter: 'التركي', color: 'red' },
  { id: 'bel.1', name: 'الدوري البلجيكي', filter: 'البلجيكي', color: 'yellow' },
  { id: 'sco.1', name: 'الدوري الإسكتلندي', filter: 'الإسكتلندي', color: 'blue' },
  { id: 'gre.1', name: 'الدوري اليوناني', filter: 'اليوناني', color: 'blue' },
  { id: 'rus.1', name: 'الدوري الروسي', filter: 'الروسي', color: 'red' },
  // البطولات الأوروبية
  { id: 'uefa.champions', name: 'دوري أبطال أوروبا', filter: 'الأبطال', color: 'gold' },
  { id: 'uefa.europa', name: 'الدوري الأوروبي', filter: 'الأوروبي', color: 'amber' },
  { id: 'uefa.europa.conf', name: 'دوري المؤتمر الأوروبي', filter: 'المؤتمر', color: 'lime' },
  // أمريكا
  { id: 'usa.1', name: 'الدوري الأمريكي', filter: 'MLS', color: 'indigo' },
  { id: 'mex.1', name: 'الدوري المكسيكي', filter: 'ليغا مكس', color: 'rose' },
  { id: 'bra.1', name: 'الدوري البرازيلي', filter: 'البرازيلي', color: 'lime' },
  { id: 'arg.1', name: 'الدوري الأرجنتيني', filter: 'الأرجنتيني', color: 'sky' },
  // آسيا وأفريقيا
  { id: 'afc.champions', name: 'دوري أبطال آسيا', filter: 'أبطال آسيا', color: 'gold' },
  { id: 'jpn.1', name: 'الدوري الياباني', filter: 'الياباني', color: 'red' },
  { id: 'aus.1', name: 'الدوري الأسترالي', filter: 'الأسترالي', color: 'yellow' },
] as const

// وحدّث دالة isCurrentMatch لتعرض المباريات المنتهية حديثاً (آخر 6 ساعات):
export function isCurrentMatch(match: Match, now: number) {
  const kickoff = new Date(match.kickoff).getTime()
  if (match.isLive) {
    // مباراة مباشرة: تظهر طالما لم تمر 4 ساعات من بدايتها
    return kickoff >= now - 4 * 60 * 60 * 1000
  }
  // مباراة منتهية حديثاً: تظهر لمدة 6 ساعات بعد انتهائها التقريبي (kickoff + 2h)
  if (match.statusLabel === 'انتهت') {
    return kickoff >= now - 8 * 60 * 60 * 1000
  }
  // مباراة قادمة: تظهر إذا لم تبدأ بعد
  return kickoff >= now
}


// ============================================================
// ② ملف: src/server/matches.server.ts
// استبدل دوال الفلترة + normalizeMatch بهذا الكود:
// ============================================================

/** هل الفريق/الاسم يخص فئة نسائية؟ */
function isWomenTeam(name: string) {
  return /women|ladies|wfc|\bwomen\b|\bw\b|نسائي|سيدات|للسيدات|نساء|femme|femenino/i.test(name)
}

/** هل الفريق/الاسم يخص فئة سنية صغيرة (شباب / ناشئين)؟ */
function isYouthTeam(name: string) {
  return /\bu-?\d{1,2}\b|\bu\d{1,2}\b|youth|junior|academy|under-?\d|sub-?\d|juvenil|cadete|infantil|ناشئين|شباب|أولمبي|تحت\s*\d/i.test(name)
}

/** هل اسم الدوري نفسه نسائي أو فئات سنية؟ */
function isExcludedLeagueName(name: string) {
  return /women|w\.|نسائي|سيدات|youth|u-?\d{1,2}|under|ناشئين|شباب/i.test(name)
}

function normalizeMatch(event: ProviderEvent, league: (typeof leagueDefinitions)[number], now: number): Match | null {
  const competition = event.competitions?.[0]
  const status = competition?.status || event.status
  const state = status?.type?.state
  const statusName = status?.type?.name || ''
  const completed = status?.type?.completed === true

  if (!event.id || !competition) return null

  // نسمح فقط بـ: قادمة (pre) أو مباشرة (in) أو منتهية حديثاً (post)
  if (!['pre', 'in', 'post'].includes(state || '')) return null
  if (/CANCEL|POSTPON|SUSPEND|ABANDON/.test(statusName)) return null

  const competitors = competition.competitors || []
  const home = competitors.find(c => c.homeAway === 'home') || competitors[0]
  const away = competitors.find(c => c.homeAway === 'away') || competitors[1]
  const kickoff = competition.date || event.date

  if (!home?.team?.displayName || !away?.team?.displayName || !kickoff || !Number.isFinite(Date.parse(kickoff))) return null

  const homeName = home.team.displayName
  const awayName = away.team.displayName

  // === حذف مباريات النساء والفئات السنية ===
  if (isWomenTeam(homeName) || isWomenTeam(awayName)) return null
  if (isYouthTeam(homeName) || isYouthTeam(awayName)) return null
  if (isExcludedLeagueName(league.name) || isExcludedLeagueName(league.filter)) return null

  // لا نعرض مباريات أبعد من 30 يوم
  if (Date.parse(kickoff) > now + 30 * 24 * 60 * 60 * 1000) return null

  // === التأكد من حالة المباشر الحقيقية ===
  // isLive فقط إذا state === 'in' ولم تكتمل المباراة
  const isLive = state === 'in' && !completed

  // مباراة منتهية: state === 'post' أو completed
  const isFinished = state === 'post' || completed

  // لا نعرض مباريات منتهية قديمة (أكثر من 8 ساعات من بداية المباراة)
  if (isFinished && Date.parse(kickoff) < now - 8 * 60 * 60 * 1000) return null

  let statusLabel = 'قريباً'
  if (isLive) {
    statusLabel = /HALFTIME|HT/.test(statusName) ? 'استراحة' : 'مباشر'
  } else if (isFinished) {
    statusLabel = 'انتهت'
  }

  const match: Match = {
    id: `${league.id}:${event.id}`,
    league: league.name,
    filter: league.filter,
    round: event.week?.number
      ? `الجولة ${event.week.number}`
      : isLive
        ? 'مباراة مباشرة'
        : isFinished
          ? 'نتيجة'
          : 'مباراة قادمة',
    team1: teamNames[homeName] || homeName,
    team2: teamNames[awayName] || awayName,
    logo1: safeLogo(home.team.logo),
    logo2: safeLogo(away.team.logo),
    initials1: home.team.abbreviation || '',
    initials2: away.team.abbreviation || '',
    score1: isLive || isFinished ? scoreValue(home.score) : '-',
    score2: isLive || isFinished ? scoreValue(away.score) : '-',
    kickoff,
    timeConfirmed: competition.timeValid !== false,
    channels: [...new Set((competition.broadcasts || []).flatMap(b => b.names || []))],
    isLive,
    minute: isLive ? status?.displayClock || '' : '',
    statusLabel,
  }

  return isCurrentMatch(match, now) ? match : null
}


// ============================================================
// ③ إضافة مصدر "كل العالم" داخل loadMatchFeed
// في ملف matches.server.ts داخل دالة loadMatchFeed
// أضف بعد جلب الدوريات الفردية:
// ============================================================

/*
  // --- مصدر إضافي: كل مباريات العالم من ESPN ---
  try {
    const allBoard = await fetchScoreboard('all', today)
    // نفلتر الأحداث ونربطها بدوري تقريبي
    const allMatches = allBoard.events
      .map(event => {
        // نستخدم دوري وهمي عام إذا لم نجد تطابقاً
        const genericLeague = { id: 'world', name: 'مباريات العالم', filter: 'العالم', color: 'slate' as const }
        return normalizeMatch(event, genericLeague as any, now)
      })
      .filter((m): m is Match => m !== null)
    // ندمجها مع النتائج (سيتم إزالة التكرار لاحقاً عبر Map)
    results.push({ matches: allMatches, failed: false, league: 'العالم' })
  } catch {
    // تجاهل فشل المصدر العام
  }
*/

// ملاحظة: أضف 'all' كدوري اختياري أو استخدم الكود أعلاه مباشرة.
// تأكد أن fetchScoreboard تقبل 'all' لأنها تعمل: 
// https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?dates=YYYYMMDD


// ============================================================
// ④ ملخص سريع للتطبيق:
// ============================================================
// - النساء: تُحذف تماماً (اسم الفريق أو الدوري)
// - الفئات السنية: U15–U23 / Youth / Junior / ناشئين / شباب → تُحذف
// - المباشر: يظهر "مباشر" فقط عندما state === 'in' و !completed
// - المباريات المنتهية: تظهر لمدة 6–8 ساعات بعد انتهائها (حل مشكلة "عدم عرض القديم")
// - مصادر إضافية: أكثر من 25 دوري + مصدر "all" العالمي
