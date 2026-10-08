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


export const getRealEarnings = createServerFn({ method: 'GET' })
  .handler(async () => {
    const url = process.env.EARNINGS_API_URL
    const token = process.env.EARNINGS_API_TOKEN

    if (!url) {
      return {
        configured: false,
        currency: 'SAR',
        total: null,
        available: null,
        monthly: [],
        message: 'لم يتم ربط مزود أرباح حقيقي بعد. أضف EARNINGS_API_URL وEARNINGS_API_TOKEN على الخادم.',
      }
    }

    try {
      const response = await fetch(url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) throw new Error(`Earnings provider returned ${response.status}`)
      const data = await response.json() as {
        total?: number
        available?: number
        currency?: string
        monthly?: { label: string; value: number }[]
      }

      const total = Number(data.total)
      const available = Number(data.available)
      const monthly = Array.isArray(data.monthly)
        ? data.monthly.filter(item => item && typeof item.label === 'string' && Number.isFinite(Number(item.value)))
            .map(item => ({ label: item.label, value: Number(item.value) }))
        : []

      return {
        configured: true,
        currency: data.currency || 'SAR',
        total: Number.isFinite(total) ? total : null,
        available: Number.isFinite(available) ? available : null,
        monthly,
        message: null,
      }
    } catch {
      return {
        configured: true,
        currency: 'SAR',
        total: null,
        available: null,
        monthly: [],
        message: 'تعذر جلب الأرباح الحقيقية من مزود الأرباح حالياً.',
      }
    }
  })
