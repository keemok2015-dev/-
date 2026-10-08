import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Building2, LockKeyhole, LogOut, RefreshCw, TrendingUp, Wallet, X } from 'lucide-react'
import { getRealEarnings } from '../server/matches.functions'

type Props = {
  onClose: () => void
  onLogout: () => void
}

type Earnings = {
  configured: boolean
  currency: string
  total: number | null
  available: number | null
  monthly: { label: string; value: number }[]
  message: string | null
}

export function EarningsDashboard({ onClose, onLogout }: Props) {
  const [data, setData] = useState<Earnings | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      setData(await getRealEarnings())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const max = Math.max(1, ...(data?.monthly.map(item => item.value) || [0]))
  const last = data?.monthly.at(-1)?.value
  const previous = data?.monthly.at(-2)?.value
  const growth = last != null && previous != null && previous !== 0
    ? Math.round(((last - previous) / previous) * 1000) / 10
    : null

  const money = (value: number | null) =>
    value == null ? '—' : `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${data?.currency || 'SAR'}`

  return (
    <div className="earnings-overlay">
      <section className="earnings-dashboard" role="dialog" aria-modal="true" aria-labelledby="earnings-title">
        <header className="earnings-header">
          <div>
            <span className="admin-kicker"><LockKeyhole size={13} /> لوحة خاصة بالمالك</span>
            <h2 id="earnings-title">لوحة الأرباح الفعلية</h2>
            <p>الأرقام المعروضة هنا تأتي من مزود الأرباح المرتبط بالخادم فقط، ولا يتم إنشاء أرقام تجريبية.</p>
          </div>
          <div className="earnings-actions">
            <button className="earnings-logout" onClick={() => void load()} disabled={loading}><RefreshCw size={16} /> تحديث</button>
            <button className="earnings-logout" onClick={onLogout}><LogOut size={16} /> خروج</button>
            <button className="admin-close" aria-label="إغلاق" onClick={onClose}><X size={19} /></button>
          </div>
        </header>

        {loading && <div className="earnings-empty">جارٍ جلب الأرباح من المصدر الحقيقي…</div>}

        {!loading && !data?.configured && (
          <div className="earnings-empty">
            <strong>لم يتم ربط مصدر أرباح حقيقي.</strong>
            <span>ضع EARNINGS_API_URL وEARNINGS_API_TOKEN في متغيرات الخادم، ثم اضغط تحديث.</span>
          </div>
        )}

        {!loading && data?.configured && data.total == null && (
          <div className="earnings-empty">
            <strong>لا توجد بيانات أرباح مؤكدة حالياً.</strong>
            <span>{data.message || 'تحقق من اتصال مزود الأرباح.'}</span>
          </div>
        )}

        {!loading && data?.total != null && (
          <>
            <div className="earnings-stats">
              <article><span><Wallet size={18} /> إجمالي الأرباح</span><strong>{money(data.total)}</strong><small><ArrowUpRight size={13} /> من مزود الأرباح</small></article>
              <article><span><Building2 size={18} /> الرصيد المتاح</span><strong>{money(data.available)}</strong><small>القيمة التي أكدها المصدر</small></article>
              <article><span><TrendingUp size={18} /> نمو هذا الشهر</span><strong>{growth == null ? '—' : `${growth >= 0 ? '+' : ''}${growth}%`}</strong><small>مقارنة بالشهر السابق</small></article>
            </div>

            <section className="earnings-chart">
              <div className="earnings-section-title"><div><strong>الإيرادات الشهرية</strong><small>بيانات المصدر الحقيقي</small></div><span>مباشر</span></div>
              {data.monthly.length === 0 ? <div className="earnings-empty">مزود الأرباح لم يُرجع بيانات شهرية.</div> : (
                <div className="bars" aria-label="رسم بياني للإيرادات">
                  {data.monthly.map(item => (
                    <div className="bar-column" key={item.label}>
                      <span>{item.value.toLocaleString('en-US')}</span>
                      <div className="bar-track"><i style={{ height: `${Math.max(4, (item.value / max) * 100)}%` }} /></div>
                      <small>{item.label}</small>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="withdraw-card">
              <div className="earnings-section-title"><div><strong>السحب</strong><small>تنفيذ السحب يحتاج ربط مزود دفع فعلي</small></div><Building2 size={21} /></div>
              <div className="earnings-empty">
                <span>لا يتم تسجيل أو تنفيذ تحويلات بنكية وهمية من الواجهة.</span>
                <span>اربط مزود دفع/حسابك البنكي على الخادم إذا أردت تنفيذ طلبات سحب فعلية.</span>
              </div>
            </section>
          </>
        )}
      </section>
    </div>
  )
}
