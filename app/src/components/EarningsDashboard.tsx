import { useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Building2, CheckCircle2, LockKeyhole, LogOut, TrendingUp, Wallet, X } from 'lucide-react'

type Props = {
  onClose: () => void
  onLogout: () => void
}

const monthly = [
  { label: 'يناير', value: 6200 },
  { label: 'فبراير', value: 7100 },
  { label: 'مارس', value: 6850 },
  { label: 'أبريل', value: 8300 },
  { label: 'مايو', value: 9050 },
  { label: 'يونيو', value: 10150 },
]

export function EarningsDashboard({ onClose, onLogout }: Props) {
  const [amount, setAmount] = useState('')
  const [requested, setRequested] = useState(false)
  const max = Math.max(...monthly.map(item => item.value))
  const total = 47650
  const available = 12480
  const amountNumber = Number(amount)
  const validAmount = Number.isFinite(amountNumber) && amountNumber > 0 && amountNumber <= available

  const growth = useMemo(() => Math.round(((monthly[5].value - monthly[4].value) / monthly[4].value) * 1000) / 10, [])

  return (
    <div className="earnings-overlay">
      <section className="earnings-dashboard" role="dialog" aria-modal="true" aria-labelledby="earnings-title">
        <header className="earnings-header">
          <div>
            <span className="admin-kicker"><LockKeyhole size={13} /> لوحة خاصة بالمالك</span>
            <h2 id="earnings-title">لوحة معلومات الأرباح</h2>
            <p>إحصائيات محاكاة لإدارة شكل لوحة الأرباح. لا تمثل رصيداً مالياً حقيقياً.</p>
          </div>
          <div className="earnings-actions">
            <button className="earnings-logout" onClick={onLogout}><LogOut size={16} /> خروج</button>
            <button className="admin-close" aria-label="إغلاق" onClick={onClose}><X size={19} /></button>
          </div>
        </header>

        <div className="earnings-stats">
          <article><span><Wallet size={18} /> إجمالي الأرباح</span><strong>{total.toLocaleString('en-US')} ر.س</strong><small><ArrowUpRight size={13} /> محاكاة منذ بداية العام</small></article>
          <article><span><Building2 size={18} /> الرصيد القابل للسحب</span><strong>{available.toLocaleString('en-US')} ر.س</strong><small>متاح لطلب السحب</small></article>
          <article><span><TrendingUp size={18} /> نمو هذا الشهر</span><strong>+{growth}%</strong><small>مقارنة بالشهر السابق</small></article>
        </div>

        <div className="earnings-grid">
          <section className="earnings-chart">
            <div className="earnings-section-title"><div><strong>نمو الأرباح</strong><small>آخر 6 أشهر · بيانات محاكاة</small></div><span>2026</span></div>
            <div className="bars" aria-label="رسم بياني للأرباح">
              {monthly.map(item => <div className="bar-column" key={item.label}><span>{item.value.toLocaleString('en-US')}</span><div className="bar-track"><i style={{ height: `${Math.max(10, (item.value / max) * 100)}%` }} /></div><small>{item.label}</small></div>)}
            </div>
          </section>

          <section className="withdraw-card">
            <div className="earnings-section-title"><div><strong>طلب سحب الأرباح</strong><small>الحساب البنكي المحدد</small></div><Building2 size={21} /></div>
            <div className="bank-account"><Building2 size={20} /><span><strong>البنك الأهلي السعودي</strong><small>SA•• •••• •••• 4821</small></span><CheckCircle2 size={18} /></div>
            <label>المبلغ بالريال السعودي
              <input inputMode="decimal" type="number" min="1" max={available} value={amount} onChange={event => { setAmount(event.target.value); setRequested(false) }} placeholder="0.00" />
            </label>
            <button className="withdraw-submit" disabled={!validAmount} onClick={() => setRequested(true)}><ArrowDownToLine size={17} /> طلب سحب</button>
            {requested && <div className="withdraw-success"><CheckCircle2 size={17} /><span>تم تسجيل طلب السحب التجريبي بمبلغ {amountNumber.toLocaleString('en-US')} ر.س.</span></div>}
            <small className="simulation-note">هذا نموذج تجريبي فقط ولا ينفذ أي تحويل بنكي.</small>
          </section>
        </div>
      </section>
    </div>
  )
}
