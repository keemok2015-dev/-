import React from 'react';
import { X, FileText, Shield, CheckCircle, Scale, AlertTriangle, Copyright, RefreshCw } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, isArabic }) => {
  if (!isOpen) return null;

  const terms = [
    {
      number: '1',
      titleAr: 'مقدمة وقبول الشروط',
      titleEn: 'Introduction & Acceptance',
      icon: Shield,
      contentAr:
        'مرحباً بك في تطبيق "كورة لايف". استخدامك للتطبيق يعني موافقتك التامة والملزمة على هذه الشروط والأحكام. إذا كنت لا توافق على أي بند من هذه البنود، يرجى التوقف فوراً عن استخدام التطبيق أو خدماته.',
      contentEn:
        'Welcome to KoraLive. Your use of this application constitutes full acceptance of these terms. If you disagree with any provision, please refrain from using the app.',
    },
    {
      number: '2',
      titleAr: 'طبيعة الخدمات المقدمة ودليل المشاهدة',
      titleEn: 'Nature of Services & Watch Guide',
      icon: FileText,
      contentAr:
        'يوفر التطبيق جداول المباريات، النتائج الحية، والإحصائيات الرياضية المحدثة. بخصوص "دليل المشاهدة": يوفر التطبيق توجيهاً وروابط للمنصات والقنوات الرسمية والجهات الناقلة المعتمدة فقط. نحن لا نستضيف ولا نبث أي مباريات مباشرة عبر سيرفرات التطبيق بأي شكل من الأشكال، وجميع حقوق النقل والبث التلفزيوني والرقمي محفوظة بالكامل لأصحابها الأصليين والشبكات المالكة للحقوق.',
      contentEn:
        'The app provides fixture schedules, live scores, and updated sports statistics. Regarding the "Watch Guide": It provides guidance and official links to authorized broadcast channels only. We do NOT host or stream live matches on our servers; all broadcasting rights remain strictly with original copyright holders.',
    },
    {
      number: '3',
      titleAr: 'الاشتراكات والمدفوعات (VIP)',
      titleEn: 'Subscriptions & Payments (VIP)',
      icon: Scale,
      contentAr:
        'خيارات الاشتراك المتاحة تشمل: الاشتراك الشهري (بقيمة 20 ﷼ شهرياً) والاشتراك السنوي (بقيمة 200 ﷼ سنوياً مع عرض حصري يشمل شهرين مجاناً ليصبح الإجمالي 14 شهراً). تمنح باقات VIP مزايا إضافية (مثل أولوية 4K، إزالة الإعلانات، والشارة الذهبية). تتم جميع المدفوعات بشكل آمن ومشفّر عبر القنوات والمتاجر المعتمدة (Apple Pay / مدى / STC Pay). يتم تجديد الاشتراكات تلقائياً ما لم يتم الإلغاء قبل موعد التجديد من إعدادات حسابك.',
      contentEn:
        'Available plans: Monthly subscription (20 SAR/month) and Annual subscription (200 SAR/year including 2 bonus months free for 14 months total). VIP plans provide enhanced perks. Payments are securely encrypted. Subscriptions auto-renew unless cancelled prior to renewal.',
    },
    {
      number: '4',
      titleAr: 'المسؤولية وإخلاء المسؤولية القانونية',
      titleEn: 'Liability & Disclaimer',
      icon: AlertTriangle,
      contentAr:
        'نسعى جاهدين لتقديم إحصائيات ونتائج دقيقة وفورية، ولكن لا نتحمل المسؤولية الكاملة عن أي أخطاء تقنية غير مقصودة أو تأخير في تحديث البيانات الناتج عن المصادر الخارجية (APIs) أو شبكات الاتصال. كما أن إدارة التطبيق غير مسؤولة عن أي تغييرات طارئة قد تحدث في مواعيد المباريات، الملاعب، أو القنوات الناقلة وأسماء المعلقين من قبل الاتحادات الرياضية أو القنوات المالكة للحقوق.',
      contentEn:
        'While we strive for real-time accuracy, we assume no liability for technical delays or discrepancies from third-party sports APIs, nor schedule alterations made by leagues and broadcasters.',
    },
    {
      number: '5',
      titleAr: 'حقوق الملكية الفكرية',
      titleEn: 'Intellectual Property Rights',
      icon: Copyright,
      contentAr:
        'كافة التصميمات، البرمجيات، الواجهات، النصوص، والشعارات الخاصة بتطبيق "كورة لايف" هي ملكية فكرية خالصة ومحمية لإدارة التطبيق. لا يحق لأي جهة أو فرد استغلالها أو نسخها أو إعادة هندستها أو استخدامها لأغراض تجارية دون إذن خطي وصريح مسبق.',
      contentEn:
        'All designs, UI code, text, and logos of KoraLive are protected proprietary intellectual property. Unauthorized reuse, reproduction, or reverse engineering is strictly prohibited without prior written consent.',
    },
    {
      number: '6',
      titleAr: 'التعديلات على الشروط والأحكام',
      titleEn: 'Modifications to Terms',
      icon: RefreshCw,
      contentAr:
        'يحق لإدارة التطبيق تعديل أو تحديث هذه الشروط والأحكام في أي وقت لضمان الامتثال للأنظمة، وسيتم إشعار المستخدمين بأي تحديثات جوهرية عبر إشعارات التطبيق الرسمية.',
      contentEn:
        'KoraLive management reserves the right to amend these terms at any time. Users will be informed of material updates via in-app notifications.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Grab Handle for Mobile */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 flex-shrink-0" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isArabic ? 'شروط وأحكام استخدام تطبيق "كورة لايف"' : 'KoraLive Terms & Conditions'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isArabic ? 'اتفاقية الاستخدام الرسمية وإخلاء المسؤولية' : 'User Agreement & Legal Disclaimer'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 text-base">⚖️</span>
            <span>
              {isArabic
                ? 'يرجى قراءة هذه الاتفاقية بعناية قبل استخدام التطبيق أو الاشتراك في الخدمات المدفوعة.'
                : 'Please review this agreement carefully prior to using the app or purchasing subscriptions.'}
            </span>
          </div>

          <div className="space-y-3.5">
            {terms.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.number}
                  className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {item.number}
                    </span>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isArabic ? item.titleAr : item.titleEn}</span>
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed ps-8">
                    {isArabic ? item.contentAr : item.contentEn}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer Acknowledgment */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full min-h-[44px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isArabic ? 'قرأت الشروط وموافق عليها' : 'I Have Read & Agree to the Terms'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
