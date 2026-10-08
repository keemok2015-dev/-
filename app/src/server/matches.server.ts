import { leagueDefinitions, isCurrentMatch } from '../lib/matches'
import type { Match, MatchFeed, StandingEntry, StandingsFeed } from '../lib/matches'

type ProviderStatus = {
  displayClock?: string
  type?: { name?: string; state?: string; completed?: boolean }
}
type ProviderCompetitor = {
  homeAway?: string
  score?: string | { displayValue?: string }
  team?: { displayName?: string; abbreviation?: string; logo?: string }
}
type ProviderEvent = {
  id?: string
  date?: string
  week?: { number?: number }
  status?: ProviderStatus
  competitions?: {
    date?: string
    timeValid?: boolean
    status?: ProviderStatus
    competitors?: ProviderCompetitor[]
    broadcasts?: { names?: string[] }[]
  }[]
}
type Scoreboard = {
  events: ProviderEvent[]
  leagues?: { calendar?: string[] }[]
}

const teamNames: Record<string, string> = {
  'Al Nassr': 'النصر', 'Al Hilal': 'الهلال', 'Al Ittihad': 'الاتحاد',
  'Al Ahli': 'الأهلي', 'Al Shabab': 'الشباب', 'Al Ettifaq': 'الاتفاق',
  'Al Taawoun': 'التعاون', 'Al Fateh': 'الفتح', 'Al Fayha': 'الفيحاء',
  'Al Riyadh': 'الرياض', 'Al Khaleej': 'الخليج', 'Al Qadsiah': 'القادسية',
  'Al Qadisiyah': 'القادسية', 'Al Kholood': 'الخلود', 'Al Okhdood': 'الأخدود',
  'Al Raed': 'الرائد', 'Al Wehda': 'الوحدة', 'Al Hazem': 'الحزم',
  'Al Najma': 'النجمة', 'Damac': 'ضمك', 'NEOM': 'نيوم', 'Neom SC': 'نيوم',
  'Abha': 'أبها', 'Al Adalah': 'العدالة', 'Al Tai': 'الطائي',
  'Real Madrid': 'ريال مدريد', 'Barcelona': 'برشلونة', 'Atlético Madrid': 'أتلتيكو مدريد',
  'Atletico Madrid': 'أتلتيكو مدريد', 'Athletic Club': 'أتلتيك بلباو',
  'Real Sociedad': 'ريال سوسيداد', 'Real Betis': 'ريال بيتيس', 'Sevilla': 'إشبيلية',
  'Valencia': 'فالنسيا', 'Villarreal': 'فياريال', 'Girona': 'جيرونا',
  'Espanyol': 'إسبانيول', 'Málaga': 'مالقة', 'Malaga': 'مالقة',
  'Celta Vigo': 'سيلتا فيغو', 'Osasuna': 'أوساسونا', 'Mallorca': 'مايوركا',
  'Getafe': 'خيتافي', 'Rayo Vallecano': 'رايو فايكانو', 'Alavés': 'ألافيس',
  'Elche': 'إلتشي', 'Levante': 'ليفانتي', 'Real Oviedo': 'ريال أوفييدو',
  'Las Palmas': 'لاس بالماس', 'Real Valladolid': 'بلد الوليد', 'Leganés': 'ليغانيس',
  'Granada': 'غرناطة', 'Almería': 'ألميريا', 'Racing Santander': 'راسينغ سانتاندير',
  'Arsenal': 'أرسنال', 'Liverpool': 'ليفربول', 'Manchester City': 'مانشستر سيتي',
  'Manchester United': 'مانشستر يونايتد', 'Chelsea': 'تشيلسي',
  'Tottenham Hotspur': 'توتنهام', 'Newcastle United': 'نيوكاسل يونايتد',
  'Aston Villa': 'أستون فيلا', 'Brighton & Hove Albion': 'برايتون',
  'West Ham United': 'وست هام', 'Crystal Palace': 'كريستال بالاس',
  'Nottingham Forest': 'نوتنغهام فورست', 'Fulham': 'فولهام', 'Everton': 'إيفرتون',
  'Brentford': 'برينتفورد', 'Bournemouth': 'بورنموث',
  'Wolverhampton Wanderers': 'وولفرهامبتون', 'Leeds United': 'ليدز يونايتد',
  'Burnley': 'بيرنلي', 'Sunderland': 'سندرلاند', 'Southampton': 'ساوثهامبتون',
  'Leicester City': 'ليستر سيتي', 'Ipswich Town': 'إيبسويتش تاون',
  // إيطاليا
  'Inter Milan': 'إنتر ميلان', 'Internazionale': 'إنتر ميلان', 'AC Milan': 'ميلان', 'Milan': 'ميلان',
  'Juventus': 'يوفنتوس', 'Napoli': 'نابولي', 'AS Roma': 'روما', 'Roma': 'روما',
  'Lazio': 'لاتسيو', 'Atalanta': 'أتالانتا', 'Fiorentina': 'فيورنتينا', 'Torino': 'تورينو',
  'Bologna': 'بولونيا', 'Udinese': 'أودينيزي', 'Genoa': 'جنوى', 'Cagliari': 'كالياري',
  'Monza': 'مونزا', 'Empoli': 'إمبولي', 'Lecce': 'ليتشي', 'Sassuolo': 'ساسولو',
  'Verona': 'فيرونا', 'Parma': 'بارما', 'Como': 'كومو', 'Venezia': 'فينيسيا',
  // ألمانيا
  'Bayern Munich': 'بايرن ميونخ', 'Bayern München': 'بايرن ميونخ', 'Borussia Dortmund': 'دورتموند',
  'RB Leipzig': 'لايبزيغ', 'Bayer Leverkusen': 'باير ليفركوزن', 'Eintracht Frankfurt': 'فرانكفورت',
  'VfB Stuttgart': 'شتوتغارت', 'Wolfsburg': 'فولفسبورغ', 'Borussia Mönchengladbach': 'غلادباخ',
  'Hoffenheim': 'هوفنهايم', 'Freiburg': 'فرايبورغ', 'Werder Bremen': 'فيردر بريمن',
  'Augsburg': 'آوغسبورغ', 'Mainz': 'ماينز', 'Union Berlin': 'يونيون برلين',
  'Heidenheim': 'هايدنهايم', 'Bochum': 'بوخوم', 'St. Pauli': 'سانت باولي',
  // فرنسا
  'Paris Saint-Germain': 'باريس سان جيرمان', 'PSG': 'باريس سان جيرمان', 'Marseille': 'مارسيليا',
  'Olympique de Marseille': 'مارسيليا', 'Lyon': 'ليون', 'Olympique Lyonnais': 'ليون',
  'Monaco': 'موناكو', 'AS Monaco': 'موناكو', 'Lille': 'ليل', 'Nice': 'نيس',
  'Rennes': 'رين', 'Lens': 'لانس', 'Strasbourg': 'ستراسبورغ', 'Nantes': 'نانت',
  'Toulouse': 'تولوز', 'Reims': 'ريمس', 'Montpellier': 'مونبلييه', 'Brest': 'بريست',
  // أخرى شائعة
  'Ajax': 'أياكس', 'PSV Eindhoven': 'بي إس في', 'Feyenoord': 'فاينورد',
  'Porto': 'بورتو', 'Benfica': 'بنفيكا', 'Sporting CP': 'سبورتنغ لشبونة',
  'Galatasaray': 'غلطة سراي', 'Fenerbahce': 'فنربخشة', 'Besiktas': 'بشكتاش',
  'Al Ahly': 'الأهلي المصري', 'Zamalek': 'الزمالك', 'Pyramids': 'بيراميدز',
}

function safeLogo(logo?: string) {
  return logo && /^https:\/\/a\.espncdn\.com\/i\/teamlogos\/[a-zA-Z0-9/_.,-]+$/.test(logo) ? logo : null
}

function scoreValue(score: ProviderCompetitor['score']) {
  return typeof score === 'string' ? score : score?.displayValue || '0'
}

function normalizeMatch(event: ProviderEvent, league: (typeof leagueDefinitions)[number], now: number): Match | null {
  const competition = event.competitions?.[0]
  const status = competition?.status || event.status
  const state = status?.type?.state
  const statusName = status?.type?.name || ''
  if (!event.id || !competition || !['pre', 'in'].includes(state || '')) return null
  if (status?.type?.completed || /FINAL|FULL_TIME|END|CANCEL|POSTPON|SUSPEND|ABANDON|ABORT/.test(statusName)) return null
  const competitors = competition.competitors || []
  const home = competitors.find(competitor => competitor.homeAway === 'home') || competitors[0]
  const away = competitors.find(competitor => competitor.homeAway === 'away') || competitors[1]
  const kickoff = competition.date || event.date
  if (!home?.team?.displayName || !away?.team?.displayName || !kickoff || !Number.isFinite(Date.parse(kickoff))) return null
  const kickoffMs = Date.parse(kickoff)
  if (kickoffMs > now + 30 * 24 * 60 * 60 * 1000) return null
  // بعض مزوّدي البيانات قد يتأخرون في تغيير الحالة إلى FINAL.
  // لا نسمح بعرض مباراة كمباشرة بعد مدة غير منطقية حتى لو بقيت state=in.
  const elapsedMinutes = (now - kickoffMs) / 60000
  const isLive = state === 'in' && elapsedMinutes >= -5 && elapsedMinutes <= 155
  if (state === 'in' && !isLive) return null
  const match: Match = {
    id: `${league.id}:${event.id}`,
    league: league.name,
    filter: league.filter,
    round: event.week?.number ? `الجولة ${event.week.number}` : isLive ? 'مباراة مباشرة' : 'مباراة قادمة',
    team1: teamNames[home.team.displayName] || home.team.displayName,
    team2: teamNames[away.team.displayName] || away.team.displayName,
    logo1: safeLogo(home.team.logo), logo2: safeLogo(away.team.logo),
    initials1: home.team.abbreviation || '', initials2: away.team.abbreviation || '',
    score1: isLive ? scoreValue(home.score) : '-', score2: isLive ? scoreValue(away.score) : '-',
    kickoff, timeConfirmed: competition.timeValid !== false,
    channels: [...new Set((competition.broadcasts || []).flatMap(broadcast => broadcast.names || []))],
    isLive, minute: isLive ? status?.displayClock || '' : '',
    statusLabel: /HALFTIME/.test(statusName) ? 'استراحة' : isLive ? 'مباشر' : 'قريباً',
  }
  return isCurrentMatch(match, now) ? match : null
}

async function fetchScoreboard(leagueId: string, date: string): Promise<Scoreboard> {
  const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${date}`, {
    signal: AbortSignal.timeout(8000), cache: 'no-store', headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error('تعذر الاتصال بمصدر المباريات')
  const data = await response.json() as Scoreboard
  if (!Array.isArray(data.events)) throw new Error('بيانات المباريات غير متاحة')
  return data
}

function dateKey(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)?.value).join('')
}

function offsetDateKey(date: string, days: number) {
  const shifted = new Date(Date.UTC(Number(date.slice(0, 4)), Number(date.slice(4, 6)) - 1, Number(date.slice(6, 8)) + days))
  return shifted.toISOString().slice(0, 10).replaceAll('-', '')
}

export async function loadMatchFeed(timeZone: string): Promise<MatchFeed> {
  const now = Date.now()
  const today = dateKey(new Date(now), timeZone)
  const yesterday = offsetDateKey(today, -1)
  const tomorrow = offsetDateKey(today, 1)
  const results = await Promise.all(leagueDefinitions.map(async league => {
    try {
      const current = await fetchScoreboard(league.id, today)
      const calendar = current.leagues?.[0]?.calendar || []
      const futureDates = [...new Set(calendar
        .filter(date => typeof date === 'string' && Number.isFinite(Date.parse(date)))
        .filter(date => Date.parse(date) <= now + 30 * 24 * 60 * 60 * 1000)
        .map(date => date.slice(0, 10).replaceAll('-', ''))
        .filter(date => date > today))].sort().slice(0, 3)
      const dates = [...new Set([yesterday, tomorrow, ...futureDates])].filter(date => date !== today)
      const extra = await Promise.allSettled(dates.map(date => fetchScoreboard(league.id, date)))
      const events = [...current.events, ...extra.flatMap(result => result.status === 'fulfilled' ? result.value.events : [])]
      const matches = events.map(event => normalizeMatch(event, league, now)).filter((match): match is Match => match !== null)
      return { matches, failed: extra.some(result => result.status === 'rejected'), league: league.name }
    } catch {
      return { matches: [] as Match[], failed: true, league: league.name }
    }
  }))
  const matches = [...new Map(results.flatMap(result => result.matches).map(match => [match.id, match])).values()]
    .filter(match => isCurrentMatch(match, Date.now()))
    .sort((first, second) => Number(second.isLive) - Number(first.isLive) || Date.parse(first.kickoff) - Date.parse(second.kickoff))
  return {
    matches, updatedAt: new Date().toISOString(),
    failedLeagues: results.filter(result => result.failed).map(result => result.league),
  }
}

type StandingStat = { name?: string; displayValue?: string; value?: number }
type StandingTeam = { displayName?: string; abbreviation?: string; logos?: { href?: string }[] }
type StandingRaw = { team?: StandingTeam; stats?: StandingStat[] }

function getStat(stats: StandingStat[] | undefined, name: string) {
  return stats?.find(s => s.name === name)?.displayValue || '0'
}

export async function loadStandings(leagueId: string): Promise<StandingsFeed> {
  const league = leagueDefinitions.find(l => l.id === leagueId)
  if (!league) {
    return { league: '', filter: '', entries: [], updatedAt: new Date().toISOString(), error: 'دوري غير معروف' }
  }
  try {
    const response = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${leagueId}/standings`, {
      signal: AbortSignal.timeout(10000), cache: 'no-store', headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error('تعذر تحميل الترتيب')
    const data = await response.json() as { children?: { standings?: { entries?: StandingRaw[] } }[] }
    const entriesRaw = data.children?.[0]?.standings?.entries || []
    const entries: StandingEntry[] = entriesRaw.map((entry, index) => {
      const stats = entry.stats || []
      const teamName = entry.team?.displayName || 'فريق'
      const logo = entry.team?.logos?.[0]?.href
      return {
        rank: Number(getStat(stats, 'rank')) || index + 1,
        team: teamNames[teamName] || teamName,
        logo: logo && /^https:\/\/a\.espncdn\.com\//.test(logo) ? logo : null,
        initials: entry.team?.abbreviation || teamName.slice(0, 3),
        played: getStat(stats, 'gamesPlayed'),
        wins: getStat(stats, 'wins'),
        draws: getStat(stats, 'ties'),
        losses: getStat(stats, 'losses'),
        goalsFor: getStat(stats, 'pointsFor'),
        goalsAgainst: getStat(stats, 'pointsAgainst'),
        goalDiff: getStat(stats, 'pointDifferential'),
        points: getStat(stats, 'points'),
      }
    }).sort((a, b) => a.rank - b.rank)
    return { league: league.name, filter: league.filter, entries, updatedAt: new Date().toISOString() }
  } catch {
    return { league: league.name, filter: league.filter, entries: [], updatedAt: new Date().toISOString(), error: 'تعذر تحميل جدول الترتيب حالياً' }
  }
}
