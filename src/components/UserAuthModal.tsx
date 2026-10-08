import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  X,
  LogOut,
  Sparkles,
  Shield,
  Heart,
} from 'lucide-react';

export interface UserProfile {
  email: string;
  phone: string;
  name: string;
  isLoggedIn: boolean;
}

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  isArabic: boolean;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onLogout,
  isArabic,
}) => {
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [name, setName] = useState(userProfile?.name || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !phone.trim() && !name.trim()) {
      // Allowed: can just close or continue as guest
      onClose();
      return;
    }

    const updated: UserProfile = {
      email: email.trim(),
      phone: phone.trim(),
      name: name.trim() || (isArabic ? 'مشجع رياضي' : 'Football Fan'),
      isLoggedIn: true,
    };

    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleContinueAsGuest = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border border-emerald-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-emerald-950/60 relative">
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
          {/* User Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 mb-3 shadow-md">
            <User className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 px-3 py-0.5 rounded-full inline-block mb-1.5">
            {isArabic ? 'اختياري تماماً (ليس إجبارياً) ✨' : 'Completely Optional ✨'}
          </span>

          <h2 className="text-xl font-black text-white">
            {userProfile?.isLoggedIn
              ? (isArabic ? 'بيانات حسابك المسجل' : 'Your Profile')
              : (isArabic ? 'تسجيل الدخول (اختياري)' : 'Sign In (Optional)')}
          </h2>

          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            {isArabic
              ? 'يمكنك تصفح ومتابعة كافة المباريات والنتائج بحرية تامة دون الحاجة لأي تسجيل. إضافة بريدك أو رقمك يساعدك فقط على حفظ تفضيلاتك.'
              : 'You can freely browse all matches without registration. Adding your email or phone is purely optional.'}
          </p>

          {saveSuccess && (
            <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isArabic ? 'تم حفظ بياناتك بنجاح!' : 'Profile saved successfully!'}</span>
            </div>
          )}

          {userProfile?.isLoggedIn && !saveSuccess ? (
            <div className="mt-5 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-right space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isArabic ? 'الاسم:' : 'Name:'}</span>
                <span className="text-xs font-bold text-white">{userProfile.name}</span>
              </div>
              {userProfile.email && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{isArabic ? 'البريد:' : 'Email:'}</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{userProfile.email}</span>
                </div>
              )}
              {userProfile.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{isArabic ? 'الجوال:' : 'Phone:'}</span>
                  <span className="text-xs font-bold text-slate-300 font-mono">{userProfile.phone}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex-1 min-h-[40px] bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isArabic ? 'تسجيل الخروج' : 'Log Out'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 min-h-[40px] bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isArabic ? 'اسمك الكريم (اختياري):' : 'Name (Optional):'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isArabic ? 'مثال: فهد أو محمد' : 'e.g. Fahad'}
                  className="w-full min-h-[44px] px-3.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isArabic ? 'البريد الإلكتروني (اختياري):' : 'Email (Optional):'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    dir="ltr"
                    className="w-full min-h-[44px] ps-9 pe-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isArabic ? 'رقم الجوال (اختياري):' : 'Phone Number (Optional):'}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full min-h-[44px] ps-9 pe-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full min-h-[44px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isArabic ? 'حفظ البيانات والمتابعة' : 'Save & Continue'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="w-full min-h-[40px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all"
                >
                  {isArabic ? 'المتابعة كزائر بدون تسجيل (تخطي)' : 'Continue as Guest (Skip)'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
