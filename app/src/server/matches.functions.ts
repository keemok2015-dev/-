import { createServerFn } from '@tanstack/react-start'
import { loadMatchFeed, loadStandings } from './matches.server'
import { leagueDefinitions } from '../lib/matches'

export const getMatchFeed = createServerFn({ method: 'GET' })
  .inputValidator((input: { timeZone: string }) => {
    if (!input || typeof input.timeZone !== 'string' || input.timeZone.length > 80) {
      throw new Error('المنطقة الزمنية غير صالحة')
    }
    try {
      new Intl.DateTimeFormat('ar', { timeZone: input.timeZone }).format()
    } catch {
      throw new Error('المنطقة الزمنية غير صالحة')
    }
    return { timeZone: input.timeZone }
  })
  .handler(({ data }) => loadMatchFeed(data.timeZone))

export const getStandings = createServerFn({ method: 'GET' })
  .inputValidator((input: { leagueId: string }) => {
    if (!input || typeof input.leagueId !== 'string' || !leagueDefinitions.some(l => l.id === input.leagueId)) {
      throw new Error('الدوري غير صالح')
    }
    return { leagueId: input.leagueId }
  })
  .handler(({ data }) => loadStandings(data.leagueId))


export const verifyAdminPassword = createServerFn({ method: 'POST' })
  .inputValidator((input: { password: string }) => {
    if (!input || typeof input.password !== 'string' || input.password.length < 1 || input.password.length > 200) {
      throw new Error('كلمة المرور غير صالحة')
    }
    return { password: input.password }
  })
  .handler(({ data }) => {
    const configuredPassword = process.env.ADMIN_PASSWORD
    if (!configuredPassword) {
      throw new Error('ADMIN_PASSWORD is not configured')
    }
    return { authenticated: data.password === configuredPassword }
  })
