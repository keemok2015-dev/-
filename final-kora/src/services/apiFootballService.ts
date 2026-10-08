import { Match, MatchStatus, Team, MatchEvent } from '../types/football';
import { DEFAULT_BROADCASTS } from '../data/mockFootballData';

export interface ApiConfig {
  apiKey: string;
  useRapidApi: boolean;
  isEnabled: boolean;
}

const STORAGE_KEY = 'koralive_api_config';

export function getStoredApiConfig(): ApiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading api config', e);
  }
  return {
    apiKey: '',
    useRapidApi: true,
    isEnabled: false,
  };
}

export function saveApiConfig(config: ApiConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed saving api config', e);
  }
}

export async function testApiConnection(config: ApiConfig): Promise<{ success: boolean; message: string; data?: any }> {
  if (!config.apiKey.trim()) {
    return {
      success: false,
      message: 'الرجاء إدخال مفتاح API-Football أولاً (Please enter your API Key)',
    };
  }

  const endpoint = config.useRapidApi
    ? 'https://v3.football.api-sports.io/status'
    : 'https://v3.football.api-sports.io/status';

  const headers: Record<string, string> = {
    'x-rapidapi-key': config.apiKey.trim(),
    'x-rapidapi-host': 'v3.football.api-sports.io',
  };

  try {
    const res = await fetch(endpoint, { method: 'GET', headers });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const json = await res.json();
    if (json.errors && Object.keys(json.errors).length > 0) {
      const errText = typeof json.errors === 'string' ? json.errors : JSON.stringify(json.errors);
      return {
        success: false,
        message: errText || 'مفتاح API غير صالح أو انتهت الحصة المجانية.',
      };
    }
    const account = json.response?.account || {};
    const requests = json.response?.requests || {};
    return {
      success: true,
      message: `تم الاتصال بنجاح بـ API-Football! المشترك: ${account.firstname || 'المستخدم'} | الطلبات المستهلكة اليوم: ${requests.current || 0}/${requests.limit_day || 100}`,
      data: json.response,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `فشل الاتصال بـ API-Sports: ${err.message || 'خطأ في الشبكة أو التحقق'}`,
    };
  }
}

/**
 * جلب المباريات الحية الشغالة حالياً من API-Football
 * https://v3.football.api-sports.io/fixtures?live=all
 */
export async function fetchLiveFixturesFromApi(apiKey: string): Promise<Match[]> {
  if (!apiKey.trim()) return [];

  const url = 'https://v3.football.api-sports.io/fixtures?live=all';
  const headers = {
    'x-rapidapi-key': apiKey.trim(),
    'x-rapidapi-host': 'v3.football.api-sports.io',
  };

  const res = await fetch(url, { method: 'GET', headers });
  if (!res.ok) {
    throw new Error(`API returned HTTP ${res.status}`);
  }
  const json = await res.json();
  if (!json.response || !Array.isArray(json.response)) {
    return [];
  }

  return json.response.map((item: any, idx: number): Match => {
    const fixture = item.fixture || {};
    const league = item.league || {};
    const teams = item.teams || {};
    const goals = item.goals || {};
    const statusShort = fixture.status?.short || 'LIVE';

    let status: MatchStatus = 'LIVE';
    if (statusShort === 'FT' || statusShort === 'AET' || statusShort === 'PEN') status = 'FINISHED';
    else if (statusShort === 'HT') status = 'HT';
    else if (statusShort === 'NS') status = 'UPCOMING';

    const events: MatchEvent[] = (item.events || []).map((ev: any, eIdx: number) => ({
      id: `ev-${idx}-${eIdx}`,
      minute: ev.time?.elapsed || 0,
      type: ev.type === 'Goal' ? 'GOAL' : ev.type === 'Card' ? (ev.detail?.includes('Red') ? 'RED_CARD' : 'YELLOW_CARD') : 'SUBSTITUTION',
      teamId: String(ev.team?.id || ''),
      playerName: ev.player?.name || 'لاعب',
      playerNameAr: ev.player?.name || 'لاعب',
      detail: ev.detail || '',
    }));

    const matchDate = fixture.date ? fixture.date.substring(0, 10) : '2026-10-04';
    const matchTime = fixture.date ? new Date(fixture.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: false }) : '21:00';

    return {
      id: `api-${fixture.id || idx}`,
      leagueId: String(league.id || 'general'),
      leagueName: league.name || 'بطولة دولية',
      leagueNameAr: league.name || 'بطولة دولية',
      leagueLogo: league.logo || '⚽',
      round: league.round || 'مباراة مباشرة',
      roundAr: league.round || 'مباراة مباشرة',
      homeTeam: {
        id: String(teams.home?.id || `home-${idx}`),
        name: teams.home?.name || 'فريق أ',
        nameAr: teams.home?.name || 'فريق أ',
        shortName: (teams.home?.name || 'HOM').substring(0, 3).toUpperCase(),
        logo: teams.home?.logo || '🔷',
        primaryColor: '#002B7F',
      },
      awayTeam: {
        id: String(teams.away?.id || `away-${idx}`),
        name: teams.away?.name || 'فريق ب',
        nameAr: teams.away?.name || 'فريق ب',
        shortName: (teams.away?.name || 'AWY').substring(0, 3).toUpperCase(),
        logo: teams.away?.logo || '🟡',
        primaryColor: '#F5B335',
      },
      homeScore: goals.home ?? 0,
      awayScore: goals.away ?? 0,
      status,
      minute: fixture.status?.elapsed || 45,
      startTime: matchTime,
      date: matchDate,
      stadium: fixture.venue?.name || 'الملعب الرئيسي',
      stadiumAr: fixture.venue?.name || 'الملعب الرئيسي',
      city: fixture.venue?.city || '',
      referee: fixture.referee || 'حكم دولي',
      events,
      stats: {
        possession: [50, 50],
        shots: [8, 7],
        shotsOnTarget: [4, 3],
        xg: [1.2, 1.0],
        corners: [4, 3],
        fouls: [8, 9],
        yellowCards: [1, 1],
        redCards: [0, 0],
        passes: [350, 340],
        passAccuracy: [85, 84],
      },
      homeLineup: { formation: '4-3-3', coach: 'المدرب', coachAr: 'المدرب', starting: [], substitutes: [] },
      awayLineup: { formation: '4-3-3', coach: 'المدرب', coachAr: 'المدرب', starting: [], substitutes: [] },
      broadcasts: [DEFAULT_BROADCASTS[0], DEFAULT_BROADCASTS[1]],
    };
  });
}
