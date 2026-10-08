import React, { useState } from 'react';
import { ShieldCheck, LockKeyhole, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  isArabic: boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  isArabic,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = password.trim();
    if (!clean) {
      setError(isArabic ? 'يرجى إدخال كلمة مرور أو رمز المالك.' : 'Please enter owner password or PIN.');
      return;
    }

    setIsLoading(true);

    // Accept Authorized Owner Passcode: Kkaram123123
    setTimeout(() => {
      setIsLoading(false);
      if (clean === 'Kkaram123123' || clean.toLowerCase() === 'kkaram123123') {
        onAuthenticated();
      } else {
        setError(isArabic ? 'رمز المرور غير صحيح. يرجى التحقق والمحاولة مجدداً.' : 'Invalid passcode. Please try again.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border border-emerald-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-emerald-950/60 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 start-4 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 text-center">
          {/* Security Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-900/30">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full inline-block mb-2">
            {isArabic ? 'منطقة المالك المعتمد 🔒' : 'Owner Area Only 🔒'}
          </span>

          <h2 className="text-xl font-black text-white">
            {isArabic ? 'تسجيل دخول لوحة الأرباح' : 'Owner Earnings Login'}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
            {isArabic
              ? 'هذا القسم مخفي ومحمي برمز سري خاص بمالك التطبيق فقط.'
              : 'This section is strictly protected and accessible only to the owner.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 text-right">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {isArabic ? 'كلمة المرور السرية:' : 'Secret Passcode:'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-slate-500">
                  <LockKeyhole className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={isArabic ? '••••••••••••' : '••••••••••••'}
                  className="w-full min-h-[46px] ps-10 pe-11 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono tracking-widest transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-2.5 flex items-center justify-center w-8 text-slate-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span>{isArabic ? 'جارٍ التحقق...' : 'Verifying...'}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isArabic ? 'فتح لوحة الأرباح الآمنة' : 'Unlock Earnings Dashboard'}</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-slate-500 mt-4 leading-normal flex items-center justify-center gap-1.5">
            <LockKeyhole className="w-3 h-3 text-emerald-500/70" />
            <span>
              {isArabic
                ? 'جلسة مشفرة وآمنة - لا تشارك رمزك مع أي شخص'
                : 'Encrypted & secure session - never share your passcode'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
