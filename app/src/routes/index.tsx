import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Bell, BellRing, CalendarDays, Check, ChevronLeft, CircleHelp, Clock3, Crown, Goal, Heart, ListOrdered, Radio, RefreshCw, Search, Shield, Trophy, Tv, UserCheck, X } from 'lucide-react'
import { MatchCard } from '../components/MatchCard'
import { TeamBadge } from '../components/TeamBadge'
import { AdminLoginModal } from '../components/AdminLoginModal'
import { EarningsDashboard } from '../components/EarningsDashboard'
import { arabicDigits, defaultTimeZone, formatArabicDate, formatArabicTime, isCurrentMatch, leagueDefinitions, leagues } from '../lib/matches'
import type { Match, MatchFeed, StandingsFeed } from '../lib/matches'
import { getMatchFeed, getStandings } from '../server/matches.functions'

export const Route = createFileRoute('/')({
  loader: () => getMatchFeed({ data: { timeZone: defaultTimeZone } }),
  component: SportsUI,
  pendingComponent: LoadingMatches,
  errorComponent: ({ reset }) => <div className="feed-page-error"><Shield size={32} /><h1>تعذر تحميل جدول المباريات</h1><p>تحقق من اتصالك وحاول مرة أخرى.</p><button onClick={reset}>إعادة المحاولة</button></div>,
})

type View = 'all' | 'live' | 'upcoming' | 'favorites' | 'standings'
type Modal = { type: 'subscription' } | { type: 'notifications' } | { type: 'channel'; match: Match; channel: string } | { type: 'about' } | { type: 'login' } | { type: 'preferences' }
type AlertPrefs = { goals: boolean; cards: boolean; events: boolean; preMatch: boolean }

function LoadingMatches() {
  return <main className="loading-matches" aria-busy="true" aria-label="جارٍ تحميل أحدث المباريات"><h1>كورة لايف</h1><p>جارٍ تحميل أحدث المباريات…</p>{[1, 2, 3].map(item => <div className="match-skeleton" key={item}><span /><div /><span /></div>)}</main>
}

function SportsUI() {
  const initialFeed = Route.useLoaderData()
  const [feed, setFeed] = useState<MatchFeed>(initialFeed)
  const [now, setNow] = useState(() => Date.parse(initialFeed.updatedAt))
  const [timeZone, setTimeZone] = useState(defaultTimeZone)
  const [deviceTimeZone, setDeviceTimeZone] = useState(defaultTimeZone)
  const [refreshCycle, setRefreshCycle] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const [selectedLeague, setSelectedLeague] = useState('الكل')
  const [view, setView] = useState<View>('all')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [alerts, setAlerts] = useState<string[]>([])
  const [alertPrefs, setAlertPrefs] = useState<AlertPrefs>({ goals: true, cards: true, events: true, preMatch: true })
  const [favoriteTeam, setFavoriteTeam] = useState('')
  const [favoriteLeague, setFavoriteLeague] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminLoginOpen, setAdminLoginOpen] = useState(false)
  const [earningsOpen, setEarningsOpen] = useState(false)
  const [modal, setModal] = useState<Modal | null>(null)
  const [toast, setToast] = useState('')
  const [standings, setStandings] = useState<StandingsFeed | null>(null)
  const [standingsLoading, setStandingsLoading] = useState(false)
  const [standingsLeagueId, setStandingsLeagueId] = useState(leagueDefinitions[0].id)
  const [notifiedPreMatch, setNotifiedPreMatch] = useState<string[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const firstRefresh = useRef(true)

  useEffect(() => {
    setDeviceTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || defaultTimeZone)
    const timer = window.setInterval(() => setNow(Date.now()), 30000)
    try {
      const saved = localStorage.getItem('kora-prefs')
      if (saved) {
        const p = JSON.parse(saved) as { favorites?: string[]; alerts?: string[]; alertPrefs?: AlertPrefs; favoriteTeam?: string; favoriteLeague?: string; userEmail?: string; userPhone?: string; isLoggedIn?: boolean }
        if (p.favorites) setFavorites(p.favorites)
        if (p.alerts) setAlerts(p.alerts)
        if (p.alertPrefs) setAlertPrefs(p.alertPrefs)
        if (p.favoriteTeam) setFavoriteTeam(p.favoriteTeam)
        if (p.favoriteLeague) setFavoriteLeague(p.favoriteLeague)
        if (p.userEmail) setUserEmail(p.userEmail)
        if (p.userPhone) setUserPhone(p.userPhone)
        if (p.isLoggedIn) setIsLoggedIn(p.isLoggedIn)
      }
    } catch { /* ignore */ }
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('kora-prefs', JSON.stringify({ favorites, alerts, alertPrefs, favoriteTeam, favoriteLeague, userEmail, userPhone, isLoggedIn }))
    } catch { /* ignore */ }
  }, [favorites, alerts, alertPrefs, favoriteTeam, favoriteLeague, userEmail, userPhone, isLoggedIn])

  // تنبيه قبل المباراة بـ 10 دقائق + إشعارات المتصفح
  useEffect(() => {
    if (!alertPrefs.preMatch || alerts.length === 0) return
    const check = () => {
      const current = Date.now()
      feed.matches.filter(m => alerts.includes(m.id) && !m.isLive && isCurrentMatch(m, current)).forEach(match => {
        const kick = Date.parse(match.kickoff)
        const diff = kick - current
        if (diff > 0 && diff <= 10 * 60 * 1000 && !notifiedPreMatch.includes(match.id)) {
          setNotifiedPreMatch(prev => [...prev, match.id])
          const title = `قريباً: ${match.team1} × ${match.team2}`
          const body = `المباراة تبدأ خلال أقل من 10 دقائق · ${match.league}`
          setToast(body)
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try { new Notification(title, { body, icon: '/favicon.svg' }) } catch { /* ignore */ }
          }
        }
      })
    }
    check()
    const t = window.setInterval(check, 30000)
    return () => window.clearInterval(t)
  }, [feed.matches, alerts, alertPrefs.preMatch, notifiedPreMatch])

  useEffect(() => {
    let active = true
    let inFlight = false
    const refresh = async () => {
      if (inFlight || document.visibilityState === 'hidden') return
      inFlight = true
      setRefreshing(true)
      try {
        const nextFeed = await getMatchFeed({ data: { timeZone } })
        if (active) {
          setFeed(nextFeed)
          setNow(Date.now())
          setRefreshError('')
        }
      } catch {
        if (active) {
          setFeed(current => ({ ...current, matches: [] }))
          setRefreshError('تعذر تحديث المباريات. أعد المحاولة؛ لا تُعرض بيانات قديمة بدلاً منها.')
        }
      } finally {
        inFlight = false
        if (active) setRefreshing(false)
      }
    }
    if (!firstRefresh.current) void refresh()
    firstRefresh.current = false
    const timer = window.setInterval(() => void refresh(), 60000)
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh() }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    return () => {
      active = false
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [timeZone, refreshCycle])

  useEffect(() => {
    if (modal && !dialogRef.current?.open) dialogRef.current?.showModal()
    if (!modal && dialogRef.current?.open) dialogRef.current.close()
  }, [modal])
  useEffect(() => { if (searchOpen) searchRef.current?.focus() }, [searchOpen])
  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 4500)
    return () => window.clearTimeout(timeout)
  }, [toast])
  useEffect(() => {
    if (view !== 'standings') return
    let active = true
    setStandingsLoading(true)
    getStandings({ data: { leagueId: standingsLeagueId } })
      .then(data => { if (active) setStandings(data) })
      .catch(() => { if (active) setStandings({ league: '', filter: '', entries: [], updatedAt: new Date().toISOString(), error: 'تعذر تحميل الترتيب' }) })
      .finally(() => { if (active) setStandingsLoading(false) })
    return () => { active = false }
  }, [view, standingsLeagueId])

  const matches = feed.matches.filter(match => isCurrentMatch(match, now))
  const liveCount = matches.filter(match => match.isLive).length
  const upcomingCount = matches.length - liveCount
  const favoriteCount = matches.filter(match => favorites.includes(match.id)).length
  const alertCount = matches.filter(match => alerts.includes(match.id)).length
  const featured = matches[0]
  const spotlight = matches.find(match => match.id !== featured?.id) || featured
  const leagueCount = new Set(matches.map(match => match.filter)).size
  const failed = feed.failedLeagues.length > 0 || Boolean(refreshError)
  const filteredMatches = matches.filter(match =>
    (selectedLeague === 'الكل' || selectedLeague === match.filter) &&
    (view !== 'live' || match.isLive) && (view !== 'upcoming' || !match.isLive) &&
    (view !== 'favorites' || favorites.includes(match.id)) &&
    `${match.team1} ${match.team2} ${match.league} ${match.filter}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  ).sort((a, b) => {
    const aFavTeam = favoriteTeam && (a.team1.includes(favoriteTeam) || a.team2.includes(favoriteTeam)) ? 1 : 0
    const bFavTeam = favoriteTeam && (b.team1.includes(favoriteTeam) || b.team2.includes(favoriteTeam)) ? 1 : 0
    const aFavLeague = favoriteLeague && a.filter === favoriteLeague ? 1 : 0
    const bFavLeague = favoriteLeague && b.filter === favoriteLeague ? 1 : 0
    return (bFavTeam + bFavLeague) - (aFavTeam + aFavLeague) || Number(b.isLive) - Number(a.isLive) || Date.parse(a.kickoff) - Date.parse(b.kickoff)
  })
  const resetFilters = () => { setSelectedLeague('الكل'); setView('all'); setQuery('') }
  const showMatch = (match: Match) => { setSelectedLeague(match.filter); setView(match.isLive ? 'live' : 'upcoming'); setQuery('') }
  const toggleFavorite = (match: Match) => {
    setFavorites(current => current.includes(match.id) ? current.filter(id => id !== match.id) : [...current, match.id])
  }
  const toggleAlert = (match: Match) => {
    const enabled = alerts.includes(match.id)
    setAlerts(current => enabled ? current.filter(id => id !== match.id) : [...current, match.id])
    if (!enabled && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      void Notification.requestPermission()
    }
    const parts = []
    if (alertPrefs.preMatch) parts.push('قبل البداية بـ 10 دقائق')
    if (alertPrefs.goals) parts.push('الأهداف')
    if (alertPrefs.cards) parts.push('البطاقات')
    if (alertPrefs.events) parts.push('أحداث المباراة')
    setToast(enabled
      ? `أُلغي تنبيه مباراة ${match.team1} و${match.team2}`
      : `تم تفعيل التنبيه: ${parts.join(' + ')}. الإشعارات تعمل في هذه الجلسة وعبر المتصفح إن سمحت.`)
  }
  const toggleSearch = () => { if (searchOpen) setQuery(''); setSearchOpen(current => !current) }
  const refreshMatches = () => setRefreshCycle(current => current + 1)
  const openOwnerArea = () => {
    if (isAdminAuthenticated) setEarningsOpen(true)
    else setAdminLoginOpen(true)
  }
  const handleAdminAuthenticated = () => {
    setIsAdminAuthenticated(true)
    setAdminLoginOpen(false)
    setEarningsOpen(true)
    setToast('تم التحقق من هوية المالك')
  }
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    setEarningsOpen(false)
    setToast('تم تسجيل الخروج من لوحة المالك')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="كورة لايف، الرئيسية"><span className="brand-mark"><Trophy size={25} /></span><span><strong>كورة <em>لايف</em></strong><small>كل مباراة. كل لحظة.</small></span></a>
        <nav className="top-nav" aria-label="التنقل الرئيسي"><button className={view === 'all' || view === 'upcoming' || view === 'live' ? 'active' : ''} onClick={resetFilters}>المباريات</button><button className={view === 'standings' ? 'active' : ''} onClick={() => setView('standings')}>الترتيب</button><button className={view === 'favorites' ? 'active' : ''} onClick={() => setView('favorites')}>المفضلة</button></nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="البحث عن مباراة" aria-expanded={searchOpen} onClick={toggleSearch}><Search size={20} /></button>
          <button className="icon-button notification-button" aria-label={`التنبيهات، ${arabicDigits(alertCount)} مباريات محددة`} onClick={() => setModal({ type: 'notifications' })}><Bell size={20} />{alertCount > 0 && <span className="notification-count">{arabicDigits(alertCount)}</span>}</button>
          <button className="icon-button" aria-label="النادي والدوري المفضل" onClick={() => setModal({ type: 'preferences' })}><Heart size={20} /></button>
          <button className="icon-button" aria-label={isLoggedIn ? 'حسابك' : 'تسجيل الدخول (اختياري)'} onClick={() => setModal({ type: 'login' })}><UserCheck size={20} /></button>
          <button className={`owner-button ${isAdminAuthenticated ? 'authenticated' : ''}`} aria-label="لوحة المالك" onClick={openOwnerArea}><Shield size={16} /><span>المالك</span></button>
          <span className="header-divider" /><button className={`subscribe-button ${subscribed ? 'subscribed' : ''}`} onClick={() => setModal({ type: 'subscription' })}>{subscribed ? <UserCheck size={17} /> : <Crown size={17} />}{subscribed ? 'مشترك تجريبي' : 'اشتراك'}</button>
        </div>
      </header>

      <div className="dashboard">
        <aside className="sidebar">
          <p className="sidebar-label">ملعبك الخاص</p>
          <nav className="side-nav" aria-label="أقسام المباريات">
            <button className={view === 'all' ? 'selected' : ''} onClick={resetFilters}><CalendarDays size={19} />جميع المباريات<span>{arabicDigits(matches.length)}</span></button>
            <button className={view === 'live' ? 'selected' : ''} onClick={() => setView('live')}><Radio size={19} />مباشر الآن<span className="green-number">{arabicDigits(liveCount)}</span></button>
            <button className={view === 'upcoming' ? 'selected' : ''} onClick={() => setView('upcoming')}><Clock3 size={19} />المباريات القادمة</button>
            <button className={view === 'favorites' ? 'selected' : ''} onClick={() => setView('favorites')}><Heart size={19} />المفضلة{favoriteCount > 0 && <span>{arabicDigits(favoriteCount)}</span>}</button>
            <button className={view === 'standings' ? 'selected' : ''} onClick={() => setView('standings')}><ListOrdered size={19} />جدول الترتيب</button>
          </nav>
          <div className="sidebar-line" /><p className="sidebar-label">الدوريات والبطولات</p>
          <div className="league-nav">{leagues.slice(1).map((league, index) => <button key={league} className={selectedLeague === league ? 'chosen' : ''} onClick={() => setSelectedLeague(selectedLeague === league ? 'الكل' : league)}><span className={`league-symbol league-${index}`}><Trophy size={17} /></span>{league}<ChevronLeft size={14} /></button>)}</div>
          <div className="sidebar-bottom"><span className="online-indicator" />شغف الكورة يجمعنا<button onClick={() => setModal({ type: 'about' })}><CircleHelp size={16} />عن كورة لايف</button><a className="snapchat-sidebar" href="https://www.snapchat.com/add/x.km122" target="_blank" rel="noopener noreferrer" dir="ltr">Snapchat · x.km122</a></div>
        </aside>

        <main className="main-content">
          <div className="page-heading"><div><p className="eyebrow"><span />على أرض الملعب</p><h1>المباراة تبدأ هنا<span>.</span></h1><p className="heading-description">تابع مبارياتك، واعرف النتيجة، ولا تفوّت أي لحظة.</p></div><span className="day-label"><CalendarDays size={16} />{formatArabicDate(feed.updatedAt, timeZone)}</span></div>
          <section className="feature-banner" aria-label="المباراة المميزة">
            <div className="pitch-art" aria-hidden="true"><div className="pitch-center" /><div className="pitch-box right" /><div className="pitch-box left" /></div>
            <div className="feature-copy"><span className="feature-kicker"><span className="live-dot" />{featured?.isLive ? 'على أرض الملعب الآن' : 'أقرب المواجهات'}</span><h2>{featured ? `${featured.team1} × ${featured.team2}` : 'كل مباراة. كل لحظة.'}<br /><span>{featured?.isLive ? 'شغف لا يعرف الهدوء.' : 'استعد للمواجهة القادمة.'}</span></h2><p>{featured ? featured.league : 'تُعرض هنا المباريات المباشرة والقادمة من المصدر'}</p>{featured && <button onClick={() => showMatch(featured)}>تفاصيل المباراة <ArrowLeft size={17} /></button>}</div>
            {featured && <div className="feature-score"><div className="feature-teams"><TeamBadge name={featured.team1} logo={featured.logo1} initials={featured.initials1} /><span>×</span><TeamBadge name={featured.team2} logo={featured.logo2} initials={featured.initials2} /></div><span className="feature-live">{featured.isLive ? `${featured.statusLabel}${featured.minute ? ` · ${arabicDigits(featured.minute)}` : ''}` : featured.timeConfirmed ? formatArabicTime(featured.kickoff, timeZone) : 'لم يُحدد الوقت'}</span><small>{formatArabicDate(featured.kickoff, timeZone)}</small></div>}
          </section>
          <div className="feed-toolbar">
            <label className="timezone-control"><Clock3 size={15} /><select aria-label="المنطقة الزمنية لعرض المباريات" value={timeZone} onChange={event => setTimeZone(event.target.value)}><option value={defaultTimeZone}>توقيت السعودية</option>{deviceTimeZone !== defaultTimeZone && <option value={deviceTimeZone}>توقيت جهازك</option>}</select></label>
            <span className="updated-time">آخر تحديث: {formatArabicTime(feed.updatedAt, timeZone)}</span>
            <button className="refresh-button" disabled={refreshing} aria-label="تحديث المباريات" onClick={refreshMatches}><RefreshCw size={15} className={refreshing ? 'refreshing' : ''} />{refreshing ? 'جارٍ التحديث' : 'تحديث'}</button>
          </div>
          {failed && <div className="source-warning" role="alert"><Shield size={17} /><div><strong>{refreshError || 'تعذر تحميل بعض بيانات الدوريات'}</strong>{feed.failedLeagues.length > 0 && <p>{feed.failedLeagues.join('، ')}. قد تكون قائمة المباريات غير مكتملة.</p>}</div><button onClick={refreshMatches} disabled={refreshing}>إعادة المحاولة</button></div>}
          {view === 'standings' ? (
            <section className="standings-section" aria-label="جدول الترتيب">
              <div className="matches-heading"><h2>جدول الترتيب<span>{standings ? arabicDigits(standings.entries.length) : '—'}</span></h2></div>
              <div className="filters" aria-label="اختر الدوري">{leagueDefinitions.map((league, index) => <button key={league.id} aria-pressed={standingsLeagueId === league.id} className={standingsLeagueId === league.id ? 'active' : ''} onClick={() => setStandingsLeagueId(league.id)}><span className={`filter-dot league-${index}`} />{league.filter}</button>)}</div>
              {standingsLoading && <div className="empty-state"><p>جارٍ تحميل جدول الترتيب…</p></div>}
              {!standingsLoading && standings?.error && <div className="empty-state"><Shield size={32} /><h3>{standings.error}</h3><button onClick={() => setStandingsLeagueId(standingsLeagueId)}>إعادة المحاولة</button></div>}
              {!standingsLoading && standings && !standings.error && standings.entries.length > 0 && (
                <div className="standings-table-wrap">
                  <table className="standings-table">
                    <thead><tr><th>#</th><th>الفريق</th><th>ل</th><th>ف</th><th>ت</th><th>خ</th><th>له</th><th>عليه</th><th>+/-</th><th>نقاط</th></tr></thead>
                    <tbody>
                      {standings.entries.map(entry => (
                        <tr key={entry.rank + entry.team}>
                          <td className="rank">{arabicDigits(entry.rank)}</td>
                          <td className="team-cell"><TeamBadge name={entry.team} logo={entry.logo} initials={entry.initials} /><span>{entry.team}</span></td>
                          <td>{arabicDigits(entry.played)}</td>
                          <td>{arabicDigits(entry.wins)}</td>
                          <td>{arabicDigits(entry.draws)}</td>
                          <td>{arabicDigits(entry.losses)}</td>
                          <td className="goals-for">{arabicDigits(entry.goalsFor)}</td>
                          <td>{arabicDigits(entry.goalsAgainst)}</td>
                          <td className={entry.goalDiff.startsWith('+') || entry.goalDiff === '0' ? 'positive' : 'negative'}>{arabicDigits(entry.goalDiff)}</td>
                          <td className="points">{arabicDigits(entry.points)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="standings-note">ل = لعب · ف = فوز · ت = تعادل · خ = خسارة · له = أهداف مسجلة · عليه = أهداف مستقبلة · +/- = فارق الأهداف</p>
                </div>
              )}
            </section>
          ) : (
            <>
              <div className="matches-heading"><h2>{view === 'favorites' ? 'مبارياتك المفضلة' : view === 'upcoming' ? 'المباريات القادمة' : view === 'live' ? 'مباشر الآن' : 'المباشرة والقادمة'}<span>{arabicDigits(filteredMatches.length)}</span></h2><span className="live-summary"><span className="live-dot" />{liveCount > 0 ? `${arabicDigits(liveCount)} مباشرة الآن` : failed ? 'بيانات المباشر غير مكتملة' : 'لا مباريات مباشرة حالياً'}</span></div>
              <div className="filters" aria-label="تصفية حسب الدوري">{leagues.map((league, index) => <button key={league} aria-pressed={selectedLeague === league} className={selectedLeague === league ? 'active' : ''} onClick={() => setSelectedLeague(league)}>{index === 0 ? <Trophy size={15} /> : <span className={`filter-dot league-${index - 1}`} />}{league}</button>)}</div>
              <div className="status-filters" aria-label="تصفية حسب حالة المباراة"><button aria-pressed={view === 'all'} className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>جميع المباريات</button><button aria-pressed={view === 'live'} className={view === 'live' ? 'active' : ''} onClick={() => setView('live')}>مباشر الآن</button><button aria-pressed={view === 'upcoming'} className={view === 'upcoming' ? 'active' : ''} onClick={() => setView('upcoming')}>القادمة</button></div>
              {searchOpen && <div className="search-field"><Search size={19} /><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="ابحث باسم الفريق أو الدوري…" aria-label="اسم الفريق أو الدوري" /><button className="icon-button" aria-label="إغلاق البحث ومسح النص" onClick={toggleSearch}><X size={17} /></button></div>}
              <section className="match-list" aria-label="قائمة المباريات" aria-busy={refreshing}>
                {filteredMatches.map(match => <MatchCard key={match.id} match={match} timeZone={timeZone} favorite={favorites.includes(match.id)} alert={alerts.includes(match.id)} onFavorite={() => toggleFavorite(match)} onAlert={() => toggleAlert(match)} onChannel={channel => setModal({ type: 'channel', match, channel })} />)}
                {filteredMatches.length === 0 && <div className="empty-state"><Search size={32} /><h3>{failed && matches.length === 0 ? 'بيانات المباريات غير متاحة الآن' : view === 'live' ? 'لا توجد مباريات مباشرة حالياً' : 'لا توجد مباريات بهذه الخيارات'}</h3><p>{failed && matches.length === 0 ? 'لم نستخدم مباريات قديمة أو وهمية. جرّب تحديث المصدر.' : view === 'favorites' ? 'اضغط على القلب بجانب المباراة لإضافتها إلى المفضلة.' : 'جرّب تغيير الدوري أو عرض المباريات القادمة. قد لا تكون هناك مباريات مجدولة خلال الفترة المتاحة.'}</p><button onClick={failed && matches.length === 0 ? refreshMatches : resetFilters} disabled={refreshing}>{failed && matches.length === 0 ? 'إعادة المحاولة' : 'عرض جميع المباريات'}<ArrowLeft size={16} /></button></div>}
              </section>
            </>
          )}
          <div className="data-note"><Shield size={15} /><p>مصدر المباريات والشعارات: ESPN. تتحدث البيانات كل دقيقة أثناء فتح الصفحة وقد يتأخر المصدر. المفضلة والتنبيهات مؤقتة.</p></div>
          <footer className="page-footer"><span>كورة لايف <span>·</span> الكورة أقرب إليك</span><a className="snapchat-footer" href="https://www.snapchat.com/add/x.km122" target="_blank" rel="noopener noreferrer" dir="ltr">تواصل · Snapchat x.km122</a><button onClick={() => setModal({ type: 'about' })}>عن التطبيق <ArrowLeft size={13} /></button></footer>
        </main>

        <aside className="insights">
          {spotlight && <section className="spotlight"><div className="aside-heading"><h2><Goal size={18} />تحت الأضواء</h2><span className="small-label">{spotlight.filter}</span></div><div className="spotlight-badges"><TeamBadge name={spotlight.team1} logo={spotlight.logo1} initials={spotlight.initials1} /><span>×</span><TeamBadge name={spotlight.team2} logo={spotlight.logo2} initials={spotlight.initials2} /></div><h3 className="spotlight-match-name">{spotlight.team1} × {spotlight.team2}</h3><p>{spotlight.league}</p><div className="spotlight-status"><span className="live-dot" />{spotlight.isLive ? spotlight.statusLabel : formatArabicDate(spotlight.kickoff, timeZone)}<span>{spotlight.isLive ? arabicDigits(spotlight.minute) : spotlight.timeConfirmed ? formatArabicTime(spotlight.kickoff, timeZone) : 'غير محدد'}</span></div><button className="full-button" onClick={() => showMatch(spotlight)}>تفاصيل المباراة <ChevronLeft size={16} /></button></section>}
          <section className="quick-stats"><h2>نظرة على الجدول</h2><div><span><Radio size={17} />مباشر الآن</span><strong>{arabicDigits(liveCount)}</strong></div><div><span><Clock3 size={17} />المباريات القادمة</span><strong>{arabicDigits(upcomingCount)}</strong></div><div><span><Trophy size={17} />دوريات في الجدول</span><strong>{arabicDigits(leagueCount)}</strong></div><small>إحصاءات الجدول المحدّث من المصدر</small></section>
          <section className="membership-card"><span className="membership-icon"><BellRing size={22} /></span><h2>كن أول من يعرف.</h2><p>اختر مبارياتك وجرّب تخصيص تنبيهاتك من مكان واحد.</p><button onClick={() => setModal({ type: 'notifications' })}>إدارة التنبيهات <ArrowLeft size={15} /></button><span className="membership-pattern" aria-hidden="true" /></section>
          <div className="aside-note"><Shield size={15} /><p>معلومات القنوات تختلف حسب البلد.<br />المشاهدة عبر مزوّد البث المرخّص.</p></div>
        </aside>
      </div>

      <nav className="mobile-nav" aria-label="التنقل على الجوال"><button className={view === 'all' ? 'active' : ''} onClick={resetFilters}><CalendarDays size={20} />المباريات</button><button className={view === 'live' ? 'active' : ''} onClick={() => setView('live')}><Radio size={20} />مباشر</button><button className={view === 'standings' ? 'active' : ''} onClick={() => setView('standings')}><ListOrdered size={20} />الترتيب</button><button className={view === 'favorites' ? 'active' : ''} onClick={() => setView('favorites')}><Heart size={20} />المفضلة</button></nav>
      {toast && <div className="toast" role="status"><Check size={18} /><span>{toast}</span><button aria-label="إغلاق الرسالة" onClick={() => setToast('')}><X size={16} /></button></div>}
      {adminLoginOpen && <AdminLoginModal onAuthenticated={handleAdminAuthenticated} onClose={() => setAdminLoginOpen(false)} />}
      {earningsOpen && isAdminAuthenticated && <EarningsDashboard onClose={() => setEarningsOpen(false)} onLogout={handleAdminLogout} />}
      <dialog ref={dialogRef} className="app-dialog" onClose={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) setModal(null) }} aria-labelledby="dialog-title"><div className="dialog-content"><button className="dialog-close icon-button" aria-label="إغلاق" onClick={() => setModal(null)}><X size={20} /></button>
        {modal?.type === 'subscription' && <><span className="dialog-icon"><Crown size={30} /></span><h2 id="dialog-title">{subscribed ? 'اشتراكك التجريبي مفعّل' : 'جرّب تجربة كورة لايف'}</h2><p>هذا الزر لمعاينة حالة الاشتراك فقط. لا توجد رسوم أو عملية دفع، ولا ينشئ حساباً أو اشتراكاً حقيقياً.</p><p className="dialog-hint">تنتهي الحالة عند إعادة تحميل الصفحة.</p><button className="dialog-primary" onClick={() => { setSubscribed(!subscribed); setModal(null); setToast(subscribed ? 'أُلغي الاشتراك التجريبي' : 'تم تفعيل الاشتراك التجريبي، دون أي رسوم') }}>{subscribed ? 'إلغاء الاشتراك التجريبي' : 'تفعيل الاشتراك التجريبي'}<UserCheck size={18} /></button></>}
        {modal?.type === 'channel' && <><span className="dialog-icon"><Tv size={30} /></span><h2 id="dialog-title">معلومات القناة</h2><p>{modal.match.team1} × {modal.match.team2}</p><strong className="channel-name" dir="auto">{modal.channel}</strong><p>القناة واردة في بيانات ESPN وقد يختلف توفرها وحقوق النقل حسب بلدك. لا تتوفر روابط بث داخل التطبيق؛ تحقق من مزوّد البث المرخّص قبل المشاهدة.</p><button className="dialog-primary" onClick={() => setModal(null)}>العودة إلى المباريات <ArrowLeft size={18} /></button></>}
        {modal?.type === 'notifications' && <><span className="dialog-icon"><BellRing size={30} /></span><h2 id="dialog-title">تنبيهات مبارياتك</h2><p>اختر أنواع التنبيهات التي تريدها. التنبيهات تُحفظ محلياً وتظهر داخل التطبيق + إشعارات المتصفح إن سمحت.</p>
          <div className="alert-prefs">
            <label><input type="checkbox" checked={alertPrefs.preMatch} onChange={e => setAlertPrefs(p => ({ ...p, preMatch: e.target.checked }))} /> تنبيه قبل بداية المباراة بـ 10 دقائق</label>
            <label><input type="checkbox" checked={alertPrefs.goals} onChange={e => setAlertPrefs(p => ({ ...p, goals: e.target.checked }))} /> تنبيه الأهداف</label>
            <label><input type="checkbox" checked={alertPrefs.cards} onChange={e => setAlertPrefs(p => ({ ...p, cards: e.target.checked }))} /> تنبيه البطاقات (صفراء/حمراء)</label>
            <label><input type="checkbox" checked={alertPrefs.events} onChange={e => setAlertPrefs(p => ({ ...p, events: e.target.checked }))} /> كل أحداث المباراة</label>
          </div>
          <div className="notification-list">{matches.map(match => <div key={match.id}><span><strong>{match.team1} × {match.team2}</strong><small>{match.isLive ? 'مباشر' : formatArabicDate(match.kickoff, timeZone)}</small></span><button className={`toggle ${alerts.includes(match.id) ? 'on' : ''}`} role="switch" aria-checked={alerts.includes(match.id)} aria-label={`تنبيه مباراة ${match.team1} و${match.team2}`} onClick={() => toggleAlert(match)}><span /></button></div>)}{matches.length === 0 && <p>لا توجد مباريات متاحة لتحديد تنبيهاتها الآن.</p>}</div>
          <button className="dialog-primary" onClick={() => { if (typeof Notification !== 'undefined' && Notification.permission === 'default') void Notification.requestPermission(); setModal(null) }}>حفظ وإغلاق</button>
        </>}
        {modal?.type === 'login' && <><span className="dialog-icon"><UserCheck size={30} /></span><h2 id="dialog-title">تسجيل الدخول (اختياري)</h2><p>التسجيل اختياري تماماً. يمكنك استخدام التطبيق بدون حساب. إن رغبت بحفظ تفضيلاتك يمكنك إدخال بريدك أو رقمك.</p>
          <div className="login-fields">
            <label>البريد الإلكتروني<input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="example@email.com" dir="ltr" /></label>
            <label>أو رقم الجوال<input type="tel" value={userPhone} onChange={e => setUserPhone(e.target.value)} placeholder="05xxxxxxxx" dir="ltr" /></label>
          </div>
          <button className="dialog-primary" onClick={() => { if (userEmail.trim() || userPhone.trim()) { setIsLoggedIn(true); setToast('تم حفظ بياناتك محلياً (اختياري)'); setModal(null) } else setToast('أدخل بريداً أو رقماً، أو أغلق النافذة') }}>{isLoggedIn ? 'تحديث البيانات' : 'حفظ ومتابعة'}</button>
          {isLoggedIn && <button className="dialog-secondary" onClick={() => { setIsLoggedIn(false); setUserEmail(''); setUserPhone(''); setToast('تم تسجيل الخروج'); setModal(null) }}>تسجيل الخروج</button>}
          <p className="dialog-hint">لا يتم إرسال أي بيانات لخادم. كل شيء يُحفظ على جهازك فقط.</p>
        </>}
        {modal?.type === 'preferences' && <><span className="dialog-icon"><Heart size={30} /></span><h2 id="dialog-title">النادي والدوري المفضل</h2><p>اختر ناديَك ودوريَك المفضل ليظهرا أولاً ويُسهّلا المتابعة.</p>
          <div className="login-fields">
            <label>النادي المفضل<input type="text" value={favoriteTeam} onChange={e => setFavoriteTeam(e.target.value)} placeholder="مثال: الهلال أو ريال مدريد" /></label>
            <label>الدوري المفضل<select value={favoriteLeague} onChange={e => setFavoriteLeague(e.target.value)}><option value="">— اختر —</option>{leagueDefinitions.map(l => <option key={l.id} value={l.filter}>{l.name}</option>)}</select></label>
          </div>
          <button className="dialog-primary" onClick={() => { setToast(favoriteTeam || favoriteLeague ? 'تم حفظ التفضيلات' : 'لم تختر شيئاً بعد'); setModal(null); if (favoriteLeague) setSelectedLeague(favoriteLeague) }}>حفظ</button>
        </>}
        {modal?.type === 'about' && <><span className="dialog-icon"><Trophy size={30} /></span><h2 id="dialog-title">كورة لايف</h2><p>واجهة عربية للمباريات المباشرة والقادمة من أبرز الدوريات العالمية، مع الشعارات والبحث وفلاتر الدوريات وجدول الترتيب.</p><p>تُجلب البيانات من ESPN وتتحدث كل دقيقة. التوقيت عربي افتراضياً (السعودية). المفضلة والتنبيهات تُحفظ محلياً على جهازك. تسجيل الدخول اختياري تماماً.</p><div className="contact-owner"><p>تواصل مع المالك</p><a className="snapchat-link" href="https://www.snapchat.com/add/x.km122" target="_blank" rel="noopener noreferrer" dir="ltr">Snapchat · x.km122</a></div><button className="dialog-primary" onClick={() => setModal(null)}>إلى الملعب <ArrowLeft size={18} /></button></>}
      </div></dialog>
    </div>
  )
}
