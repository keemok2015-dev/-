/**
 * حل مشكلة: التطبيق يعرض مباراة كـ "مباشر" وهي منتهية من زمان
 * ============================================================
 * ضع هذا الكود في src/server/matches.server.ts
 * داخل دالة normalizeMatch (استبدل الجزء الخاص بـ isLive)
 */

function normalizeMatch(event: ProviderEvent, league: (typeof leagueDefinitions)[number], now: number): Match | null {
  const competition = event.competitions?.[0]
  const status = competition?.status || event.status
  const state = status?.type?.state          // 'pre' | 'in' | 'post'
  const statusName = status?.type?.name || ''
  const completed = status?.type?.completed === true
  const displayClock = status?.displayClock || ''

  if (!event.id || !competition) return null
  if (!['pre', 'in', 'post'].includes(state || '')) return null
  if (/CANCEL|POSTPON|SUSPEND|ABANDON/.test(statusName)) return null

  const competitors = competition.competitors || []
  const home = competitors.find(c => c.homeAway === 'home') || competitors[0]
  const away = competitors.find(c => c.homeAway === 'away') || competitors[1]
  const kickoff = competition.date || event.date

  if (!home?.team?.displayName || !away?.team?.displayName || !kickoff) return null
  if (!Number.isFinite(Date.parse(kickoff))) return null

  const homeName = home.team.displayName
  const awayName = away.team.displayName

  // حذف النساء والفئات السنية
  if (isWomenTeam(homeName) || isWomenTeam(awayName)) return null
  if (isYouthTeam(homeName) || isYouthTeam(awayName)) return null

  const kickoffTime = Date.parse(kickoff)

  // لا نعرض مباريات أبعد من 30 يوم
  if (kickoffTime > now + 30 * 24 * 60 * 60 * 1000) return null

  // ============================================================
  // ★ الحل الرئيسي لمشكلة "مباشر وهمي"
  // ============================================================

  // 1) إذا المصدر يقول completed = true → منتهية فوراً
  // 2) إذا state = 'post' → منتهية
  // 3) إذا مرت أكثر من 3 ساعات على بداية المباراة → منتهية (حتى لو state = 'in')
  // 4) إذا الساعة تظهر 90+ أو FT أو Full Time → منتهية
  const hoursSinceKickoff = (now - kickoffTime) / (1000 * 60 * 60)

  const looksFinishedByClock =
    /FT|FULL.?TIME|ENDED|FINAL|90\+|AET|PEN/i.test(statusName) ||
    /FT|90\+|AET|PEN/i.test(displayClock)

  const isReallyFinished =
    completed ||
    state === 'post' ||
    hoursSinceKickoff > 3 ||          // ★ أهم شرط: بعد 3 ساعات تعتبر منتهية
    looksFinishedByClock

  // isLive = true فقط إذا:
  // - state فعلاً 'in'
  // - ولم تكتمل
  // - ولم تمر 3 ساعات
  // - والساعة لا تشير لانتهاء
  const isLive = state === 'in' && !isReallyFinished

  // مباراة منتهية قديمة جداً (أكثر من 8 ساعات) → لا تعرضها أصلاً
  if (isReallyFinished && hoursSinceKickoff > 8) return null

  // مباراة قادمة في الماضي (لم تبدأ وفات وقتها) → لا تعرضها
  if (state === 'pre' && hoursSinceKickoff > 0.5) return null

  let statusLabel = 'قريباً'
  if (isLive) {
    statusLabel = /HALFTIME|HT|استراحة/i.test(statusName) ? 'استراحة' : 'مباشر'
  } else if (isReallyFinished) {
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
        : isReallyFinished
          ? 'نتيجة'
          : 'مباراة قادمة',
    team1: teamNames[homeName] || homeName,
    team2: teamNames[awayName] || awayName,
    logo1: safeLogo(home.team.logo),
    logo2: safeLogo(away.team.logo),
    initials1: home.team.abbreviation || '',
    initials2: away.team.abbreviation || '',
    score1: isLive || isReallyFinished ? scoreValue(home.score) : '-',
    score2: isLive || isReallyFinished ? scoreValue(away.score) : '-',
    kickoff,
    timeConfirmed: competition.timeValid !== false,
    channels: [...new Set((competition.broadcasts || []).flatMap(b => b.names || []))],
    isLive,                                    // ★ صار دقيق
    minute: isLive ? displayClock : '',
    statusLabel,
  }

  return isCurrentMatch(match, now) ? match : null
}


// ============================================================
// وحدّث أيضاً isCurrentMatch في src/lib/matches.ts:
// ============================================================

export function isCurrentMatch(match: Match, now: number) {
  const kickoff = new Date(match.kickoff).getTime()
  const hoursSince = (now - kickoff) / (1000 * 60 * 60)

  if (match.isLive) {
    // مباراة مباشرة حقيقية: تظهر طالما أقل من 3.5 ساعة من البداية
    return hoursSince < 3.5
  }

  if (match.statusLabel === 'انتهت') {
    // نتيجة منتهية: تظهر لمدة 6 ساعات فقط
    return hoursSince < 6
  }

  // مباراة قادمة
  return kickoff >= now
}
