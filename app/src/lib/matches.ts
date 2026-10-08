export const leagueDefinitions = [
  { id: 'ksa.1', name: 'دوري روشن السعودي', filter: 'دوري روشن', color: 'green' },
  { id: 'eng.1', name: 'الدوري الإنجليزي الممتاز', filter: 'البريميرليغ', color: 'violet' },
  { id: 'esp.1', name: 'الدوري الإسباني', filter: 'لا ليغا', color: 'orange' },
  { id: 'ita.1', name: 'الدوري الإيطالي', filter: 'سيري أ', color: 'blue' },
  { id: 'ger.1', name: 'الدوري الألماني', filter: 'بوندسليغا', color: 'red' },
  { id: 'fra.1', name: 'الدوري الفرنسي', filter: 'ليغ 1', color: 'cyan' },
  { id: 'uefa.champions', name: 'دوري أبطال أوروبا', filter: 'الأبطال', color: 'gold' },
  { id: 'uefa.europa', name: 'الدوري الأوروبي', filter: 'الأوروبي', color: 'amber' },
  { id: 'usa.1', name: 'الدوري الأمريكي', filter: 'MLS', color: 'indigo' },
  { id: 'bra.1', name: 'الدوري البرازيلي', filter: 'البرازيلي', color: 'lime' },
  { id: 'mex.1', name: 'الدوري المكسيكي', filter: 'ليغا مكس', color: 'rose' },
] as const

export const leagues = ['الكل', ...leagueDefinitions.map(league => league.filter)]
export const defaultTimeZone = 'Asia/Riyadh'

export type Match = {
  id: string
  league: string
  filter: string
  round: string
  team1: string
  team2: string
  logo1: string | null
  logo2: string | null
  initials1: string
  initials2: string
  score1: string
  score2: string
  kickoff: string
  timeConfirmed: boolean
  channels: string[]
  isLive: boolean
  minute: string
  statusLabel: string
}

export type MatchFeed = {
  matches: Match[]
  updatedAt: string
  failedLeagues: string[]
}

export function arabicDigits(value: string | number) {
  return String(value).replace(/[0-9]/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)])
}

export function formatArabicTime(date: string, timeZone: string) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-arab', {
    timeZone, hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(date))
}

export function formatArabicDate(date: string, timeZone: string) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-arab', {
    timeZone, weekday: 'short', day: 'numeric', month: 'long',
  }).format(new Date(date))
}

export function isCurrentMatch(match: Match, now: number) {
  const kickoff = new Date(match.kickoff).getTime()
  return match.isLive ? kickoff >= now - 4 * 60 * 60 * 1000 : kickoff >= now
}

export type StandingEntry = {
  rank: number
  team: string
  logo: string | null
  initials: string
  played: string
  wins: string
  draws: string
  losses: string
  goalsFor: string
  goalsAgainst: string
  goalDiff: string
  points: string
}

export type StandingsFeed = {
  league: string
  filter: string
  entries: StandingEntry[]
  updatedAt: string
  error?: string
}
