import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, ShieldCheck, X } from 'lucide-react'
import { verifyAdminPassword } from '../server/matches.functions'

type Props = {
  onAuthenticated: () => void
  onClose: () => void
}

export function AdminLoginModal({ onAuthenticated, onClose }: Props) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!password) {
      setError('أدخل كلمة مرور المالك.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await verifyAdminPassword({ data: { password } })
      if (result.authenticated) {
        onAuthenticated()
        return
      }
      setError('كلمة المرور غير صحيحة.')
    } catch {
      setError('تعذر التحقق الآن. تأكد من إعداد ADMIN_PASSWORD على الخادم.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <section className="admin-login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <button className="admin-close" aria-label="إغلاق" onClick={onClose}><X size={19} /></button>
        <div className="admin-icon"><ShieldCheck size={28} /></div>
        <span className="admin-kicker">منطقة المالك</span>
        <h2 id="admin-login-title">دخول لوحة الأرباح</h2>
        <p>هذه المنطقة خاصة بمالك الموقع ولا تظهر بيانات الأرباح للمستخدمين العاديين.</p>
        <form onSubmit={submit}>
          <label className="admin-password-field">
            <span>كلمة المرور</span>
            <div>
              <LockKeyhole size={17} />
              <input
                autoFocus
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="button" aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'} onClick={() => setShowPassword(value => !value)}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>
          {error && <div className="admin-error" role="alert">{error}</div>}
          <button className="admin-submit" type="submit" disabled={loading}>
            {loading ? 'جارٍ التحقق…' : 'دخول آمن'}
            <ShieldCheck size={18} />
          </button>
        </form>
        <small>المصادقة تتم على الخادم، ولا يتم حفظ كلمة المرور في المتصفح.</small>
      </section>
    </div>
  )
}
