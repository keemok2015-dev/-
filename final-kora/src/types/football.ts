export type MatchStatus = 'LIVE' | 'FINISHED' | 'UPCOMING' | 'HT';

export interface Team {
  id: string;
  name: string;
  nameAr: string;
  shortName: string;
  logo: string;
  primaryColor: string;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR';
  teamId: string;
  playerName: string;
  playerNameAr: string;
  assistName?: string;
  assistNameAr?: string;
  detail?: string;
}

export interface MatchStats {
  possession: [number, number]; // [home, away]
  shots: [number, number];
  shotsOnTarget: [number, number];
  xg: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  passes: [number, number];
  passAccuracy: [number, number];
}

export interface Player {
  id: string;
  name: string;
  nameAr: string;
  number: number;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  rating: number;
  photo?: string;
  isCaptain?: boolean;
}

export interface Lineup {
  formation: string;
  coach: string;
  coachAr: string;
  starting: Player[];
  substitutes: Player[];
}

export interface ManOfTheMatch {
  playerId: string;
  playerName: string;
  playerNameAr: string;
  teamName: string;
  teamNameAr: string;
  teamLogo: string;
  rating: number; // e.g. 9.4
  photo: string;
  goals: number;
  assists: number;
  keyPasses: number;
  dribbles: number;
  duelsWon: number;
  summaryAr: string;
  summaryEn: string;
}

export interface OfficialBroadcast {
  id: string;
  channelName: string;
  channelNameAr: string;
  platform: 'Satellite' | 'Streaming' | 'Cable';
  satellite?: string; // e.g. "Nilesat 11013 H"
  quality: '4K HDR' | 'Full HD 1080p' | 'HD 720p';
  commentator: string;
  commentatorAr: string;
  officialUrl: string;
  logo: string;
  isLiveAvailable: boolean;
}

export interface Match {
  id: string;
  leagueId: string;
  leagueName: string;
  leagueNameAr: string;
  leagueLogo: string;
  round: string;
  roundAr: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  startTime: string; // ISO or '21:00'
  date: string; // YYYY-MM-DD
  stadium: string;
  stadiumAr: string;
  city: string;
  referee: string;
  events: MatchEvent[];
  stats: MatchStats;
  homeLineup: Lineup;
  awayLineup: Lineup;
  manOfTheMatch?: ManOfTheMatch;
  broadcasts: OfficialBroadcast[];
}

export interface LeagueStanding {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface TopScorer {
  rank: number;
  player: string;
  playerAr: string;
  team: string;
  teamAr: string;
  teamLogo: string;
  goals: number;
  assists: number;
  matches: number;
  penaltyGoals: number;
}
