import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  Smartphone,
  Laptop,
  Apple,
  Globe,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PlatformPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export const PlatformPublishModal: React.FC<PlatformPublishModalProps> = ({
  isOpen,
  onClose,
  isArabic,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'android' | 'ios' | 'pc' | 'qr'>('all');
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  if (!isOpen) return null;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://koralive.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      (isArabic
        ? '⚽ تابع نتائج المباريات المباشرة والتشكيلة والبث على تطبيق كورة لايف:\n'
        : '⚽ Follow live football matches, lineups and broadcasts on KoraLive app:\n') + currentAppUrl
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      isArabic
        ? '⚽ تطبيق كورة لايف - بث ونتائج المباريات المباشرة وتشكيلة الفرق'
        : '⚽ KoraLive App - Live Football Matches and Lineups'
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentAppUrl)}&text=${text}`, '_blank');
  };

  const platforms = [
    {
      id: 'android',
      nameAr: 'نظام أندرويد (Android)',
      nameEn: 'Android Mobile',
      icon: Smartphone,
      color: 'from-emerald-600/30 to-green-600/10 text-emerald-400 border-emerald-500/40',
      badgeAr: 'جاهز للتثبيت بنقرة واحدة',
      badgeEn: 'Ready for 1-Click Install',
      stepsAr: 'اضغط على زر "تثبيت التطبيق" أدناه وسيعمل التطبيق كبرنامج مستقل على شاشة هاتفك الرئيسية كأي تطبيق رسمي من جوجل بلاي وبسرعة فائقة.',
      stepsEn: 'Click "Install App" below and it will install as a standalone app on your home screen.',
    },
    {
      id: 'ios',
      nameAr: 'أجهزة آبل وآيفون (iOS & iPad)',
      nameEn: 'Apple iPhone & iPad',
      icon: Apple,
      color: 'from-blue-600/30 to-indigo-600/10 text-blue-400 border-blue-500/40',
      badgeAr: 'WebClip / ملء الشاشة',
      badgeEn: 'Home Screen WebClip',
      stepsAr: 'في متصفح سفاري Safari: اضغط على زر المشاركة (⎋ Share) أسفل الشاشة، ثم اختر "إضافة إلى الصفحة الرئيسية" (Add to Home Screen ➕).',
      stepsEn: 'In Safari: Tap Share (⎋), scroll and tap "Add to Home Screen" (➕).',
    },
    {
      id: 'pc',
      nameAr: 'أجهزة الكمبيوتر والويندوز والماك (PC & Mac)',
      nameEn: 'Windows & Mac Desktop',
      icon: Laptop,
      color: 'from-purple-600/30 to-fuchsia-600/10 text-purple-400 border-purple-500/40',
      badgeAr: 'تطبيق سطح المكتب المستقل',
      badgeEn: 'Desktop App Supported',
      stepsAr: 'من خلال متصفح Chrome أو Edge، اضغط على زر "تثبيت" في شريط العناوين أو الزر أدناه لتثبيت التطبيق على سطح المكتب وقائمة ابدأ (Start Menu).',
      stepsEn: 'From Chrome or Edge, click Install in the address bar or below to install on Desktop.',
    },
    {
      id: 'web',
      nameAr: 'الويب والروابط المباشرة (Cloud Web)',
      nameEn: 'Cloud Web Hosting',
      icon: Globe,
      color: 'from-teal-600/30 to-cyan-600/10 text-teal-400 border-teal-500/40',
      badgeAr: 'منشور ومفعل عالمياً ✅',
      badgeEn: 'Deployed Globally ✅',
      stepsAr: 'التطبيق مستضاف ومفعّل عالمياً عبر سحابة Google Cloud Run مع بروتوكول HTTPS المشفر وشهادة أمان معتمدة لجميع المتصفحات.',
      stepsEn: 'Hosted globally on Google Cloud Run with HTTPS and end-to-end security.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-[#0d1424] to-[#090d16] border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-950/50 flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  {isArabic ? 'نشر وتثبيت التطبيق على جميع المنصات' : 'Publish & Install Across All Platforms'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {isArabic ? 'جاهز 100%' : '100% Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isArabic ? 'متاح وموزع تلقائياً لأجهزة أندرويد وآيفون والكمبيوتر' : 'Available for Android, iOS, Windows & Mac'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Highlight Banner */}
        <div className="px-5 py-3 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-b border-emerald-500/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-emerald-300 font-bold">
              {isArabic ? 'التطبيق منشور ونشط رسمياً على السحابة وجميع الأجهزة' : 'App is deployed & active across all devices'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
            PWA + Cloud
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">

          {/* Direct One-Click Install Action Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/40 via-slate-800/70 to-teal-900/40 border border-emerald-500/50 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isArabic ? 'تثبيت التطبيق على جهازك الآن' : 'Install App On This Device'}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {isInstalled
                      ? (isArabic ? 'التطبيق مثبت بالفعل ويعمل كبرنامج مستقل 🚀' : 'App is already installed and running standalone 🚀')
                      : (isArabic ? 'بدون تحميل ملفات ثقيلة وبسرعة فائقة' : 'Fast, native-like experience without app store delays')}
                  </p>
                </div>
              </div>
            </div>

            {isInstalled ? (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-900/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isArabic ? 'أنت تستخدم التطبيق كبرنامج مثبت بنجاح!' : 'You are running the installed application!'}</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={async () => {
                  await install();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-black font-black text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isArabic ? 'تثبيت كورة لايف بنقرة واحدة 📲' : 'Install KoraLive in 1-Click 📲'}</span>
              </button>
            ) : isIOS ? (
              <div className="space-y-2">
                <button
                  onClick={() => setShowIOSSteps(!showIOSSteps)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Apple className="w-4 h-4" />
                  <span>{isArabic ? 'طريقة التثبيت على آيفون / آيباد (سفاري) 🍏' : 'How to Install on iPhone / iPad 🍏'}</span>
                </button>
                {showIOSSteps && (
                  <div className="p-3 bg-slate-900/90 border border-blue-500/30 rounded-xl text-xs text-slate-300 space-y-1.5">
                    <p className="font-bold text-blue-300">{isArabic ? 'خطوات التثبيت على الآيفون:' : 'iOS Installation Steps:'}</p>
                    <p>1. {isArabic ? 'اضغط زر المشاركة (Share ⎋) في أسفل متصفح Safari.' : 'Tap the Share icon (⎋) at the bottom of Safari.'}</p>
                    <p>2. {isArabic ? 'مرر للأسفل واختر "إضافة إلى الصفحة الرئيسية" (Add to Home Screen ➕).' : 'Scroll down and tap "Add to Home Screen" (➕).'}</p>
                    <p>3. {isArabic ? 'اضغط "إضافة" (Add) في أعلى اليمين وستجد أيقونة التطبيق على شاشة هاتفك.' : 'Tap "Add" in top right.'}</p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  alert(
                    isArabic
                      ? 'يمكنك تثبيت التطبيق مباشرة عبر قائمة المتصفح (ثلاث نقاط ⋮) -> اختيار "تثبيت التطبيق" أو "إضافة للشاشة الرئيسية".'
                      : 'You can install via your browser menu (⋮) -> "Install App" or "Add to Home Screen".'
                  );
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isArabic ? 'تثبيت من قائمة المتصفح (Install App)' : 'Install from browser menu'}</span>
              </button>
            )}
          </div>

          {/* Platforms Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              {isArabic ? 'حالة التوزيع والنشر لكل منصة:' : 'Distribution Status Per Platform:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl bg-slate-900/70 border ${p.color} flex flex-col justify-between space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/90 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white">
                          {isArabic ? p.nameAr : p.nameEn}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                        {isArabic ? p.badgeAr : p.badgeEn}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isArabic ? p.stepsAr : p.stepsEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Share & Link Copy */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-teal-400" />
              <span>{isArabic ? 'رابط المشاركة السريع مع المشجعين والجمهور:' : 'Share Public Link With Fans:'}</span>
            </h4>

            {/* Link Field with Copy */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-xl p-1.5 px-3">
              <input
                type="text"
                readOnly
                value={currentAppUrl}
                className="bg-transparent text-xs text-slate-300 font-mono w-full outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1 transition-all flex-shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'نسخ الرابط' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleShareWhatsApp}
                className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>💬</span>
                <span>{isArabic ? 'مشاركة عبر واتساب' : 'Share WhatsApp'}</span>
              </button>

              <button
                onClick={handleShareTelegram}
                className="py-2 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>✈️</span>
                <span>{isArabic ? 'مشاركة عبر تلغرام' : 'Share Telegram'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Section for Fast Mobile Scanning */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-20 h-20 bg-white p-1 rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
              {/* QR Code image via standard API */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentAppUrl)}`}
                alt="QR Code"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>{isArabic ? 'امسح الرمز بكاميرا الجوال' : 'Scan With Phone Camera'}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {isArabic
                  ? 'وجه كاميرا هاتفك الآيفون أو الأندرويد نحو الرمز لفتح التطبيق وتثبيته فوراً على هاتفك دون كتابة الابط.'
                  : 'Point your camera at this QR code to open and install the app instantly.'}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isArabic ? 'جاهز للاستخدام الفوري بدون أي تدخل منك' : 'Fully deployed & operational'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
