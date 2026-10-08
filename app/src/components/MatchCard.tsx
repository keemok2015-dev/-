import { Bell, BellRing, Heart, Play, Trophy, Tv } from 'lucide-react'
import { TeamBadge } from './TeamBadge'
import { arabicDigits, formatArabicDate, formatArabicTime } from '../lib/matches'
import type { Match } from '../lib/matches'

type Props = {
  match: Match
  timeZone: string
  favorite: boolean
  alert: boolean
  onFavorite: () => void
  onAlert: () => void
  onChannel: (channel: string) => void
}

export function MatchCard({ match, timeZone, favorite, alert, onFavorite, onAlert, onChannel }: Props) {
  return (
    <article className="match-card">
      <div className="match-meta">
        <span className="competition"><span className={`competition-icon league-color-${match.filter.replace(/\s/g, '-')}`}><Trophy size={14} /></span>{match.league}<span className="round">{arabicDigits(match.round)}</span></span>
        <button className={`favorite-button ${favorite ? 'favorited' : ''}`} aria-label={`${favorite ? 'إزالة' : 'إضافة'} مباراة ${match.team1} و${match.team2} ${favorite ? 'من' : 'إلى'} المفضلة`} aria-pressed={favorite} onClick={onFavorite}><Heart size={17} /></button>
      </div>
      <div className="match-body">
        <div className="team"><TeamBadge name={match.team1} logo={match.logo1} initials={match.initials1} /><strong>{match.team1}</strong></div>
        <div className="score-area">
          <span className={`match-status ${match.isLive ? 'live' : 'upcoming'}`}>{match.isLive && <span className="live-dot" />}{match.statusLabel}</span>
          {match.isLive ? <>
            <div className="score" dir="rtl" aria-label={`${match.team1} ${arabicDigits(match.score1)}، ${match.team2} ${arabicDigits(match.score2)}`}><span>{arabicDigits(match.score1)}</span><i>:</i><span>{arabicDigits(match.score2)}</span></div>
            <span className="minute">{match.minute ? `وقت اللعب ${arabicDigits(match.minute).replaceAll("'", '′')}` : 'المباراة جارية'}</span>
          </> : <>
            <time className={`kickoff ${match.timeConfirmed ? '' : 'unconfirmed-time'}`} dateTime={match.kickoff}>{match.timeConfirmed ? formatArabicTime(match.kickoff, timeZone) : 'لم يُحدد الوقت'}</time>
            <time className="minute match-date" dateTime={match.kickoff}>{formatArabicDate(match.kickoff, timeZone)}</time>
          </>}
        </div>
        <div className="team"><TeamBadge name={match.team2} logo={match.logo2} initials={match.initials2} /><strong>{match.team2}</strong></div>
      </div>
      <div className="match-footer">
        <div className="channels"><Tv size={15} />{match.channels.length > 0 ? match.channels.map(channel => <button className="channel-button" key={channel} onClick={() => onChannel(channel)}><Play size={11} fill="currentColor" /><span dir="auto">{channel}</span></button>) : <span className="no-channels">القنوات غير متاحة في المصدر</span>}</div>
        <button className={`alert-button ${alert ? 'enabled' : ''}`} aria-pressed={alert} onClick={onAlert}>{alert ? <BellRing size={15} /> : <Bell size={15} />}<span>{alert ? 'التنبيه مفعّل' : match.isLive ? 'تنبيه الأهداف والبطاقات' : 'ذكّرني قبل 10 دقائق'}</span></button>
      </div>
    </article>
  )
}
