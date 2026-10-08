import React, { useState } from 'react';
import {
  X,
  Crown,
  CheckCircle2,
  ShieldCheck,
  Zap,
  CreditCard,
  Lock,
  Smartphone,
  Gift,
  Sparkles,
} from 'lucide-react';
import { playGoalWhistleSound } from '../utils/audioAlert';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubscribed: boolean;
  subscriptionPlan?: 'monthly' | 'yearly';
  onSubscribe: (plan: 'monthly' | 'yearly') => void;
  onCancelSubscription: () => void;
  onOpenTerms: () => void;
  isArabic: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  isSubscribed,
  subscriptionPlan = 'yearly',
  onSubscribe,
  onCancelSubscription,
  onOpenTerms,
  isArabic,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(subscriptionPlan);
  const [selectedMethod, setSelectedMethod] = useState<'apple_pay' | 'mada' | 'card' | 'stc_pay'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setJustActivated(true);
      onSubscribe(selectedPlan);
      playGoalWhistleSound();
      setTimeout(() => {
        setJustActivated(false);
        onClose();
      }, 1400);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border-t sm:border border-amber-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-amber-950/40">
        {/* Grab Handle for Mobile */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 flex-shrink-0" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 flex-shrink-0 bg-slate-900/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4 fill-amber-400" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
              {isArabic ? 'باقة VIP لمشاهدة المباريات' : 'VIP Football Watch Pass'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isSubscribed ? (
            /* Already Subscribed State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">
                  {isArabic ? 'اشتراكك مفعل بنجاح!' : 'Your VIP Pass is Active!'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {isArabic
                    ? 'لديك وصول كامل لجميع روابط البث المباشر الرسمية وجودات 4K وشارة VIP'
                    : 'You have full unlocked access to all official broadcast streams and 4K quality'}
                </p>
              </div>

              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 text-xs space-y-2.5 max-w-xs mx-auto text-start">
                <div className="flex justify-between text-slate-400">
                  <span>{isArabic ? 'نوع الباقة:' : 'Plan:'}</span>
                  <span className="font-bold text-white">
                    {subscriptionPlan === 'yearly'
                      ? (isArabic ? 'اشتراك سنوي (VIP) 🎁' : 'Yearly VIP Pass 🎁')
                      : (isArabic ? 'اشتراك شهري (VIP)' : 'Monthly VIP Pass')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isArabic ? 'السعر المدفوع:' : 'Price Paid:'}</span>
                  <span className="font-bold text-emerald-400">
                    {subscriptionPlan === 'yearly' ? '200 ﷼ / سنوياً' : '20 ﷼ / شهرياً'}
                  </span>
                </div>
                {subscriptionPlan === 'yearly' && (
                  <div className="flex justify-between text-slate-400">
                    <span>{isArabic ? 'المدة الإجمالية:' : 'Duration:'}</span>
                    <span className="font-bold text-amber-300">
                      {isArabic ? '14 شهراً (12 + شهرين مجاناً)' : '14 Months (12 + 2 Free)'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>{isArabic ? 'الحالة:' : 'Status:'}</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {isArabic ? 'نشط وغير محدود' : 'Active & Unlimited'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onClose}
                  className="w-full min-h-[44px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  {isArabic ? 'العودة للتطبيق' : 'Return to App'}
                </button>
                <button
                  onClick={onCancelSubscription}
                  className="w-full min-h-[38px] text-[11px] text-slate-500 hover:text-red-400 transition-colors"
                >
                  {isArabic ? 'إلغاء تفعيل الاشتراك (للتجربة)' : 'Cancel Subscription (Demo)'}
                </button>
              </div>
            </div>
          ) : (
            /* Plan Selection & Checkout Flow */
            <>
              <div className="text-center">
                <div className="inline-block bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1.5">
                  {isArabic ? '✓ نتائج المباريات والدليل مفتوح مجاناً للجميع' : '✓ Live Scores & Guide are Free'}
                </div>
                <h4 className="text-base font-extrabold text-white">
                  {isArabic ? 'اختر باقة VIP المناسبة لك' : 'Choose Your VIP Plan'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isArabic
                    ? 'احصل على جودة 4K Ultra HD، تصفح بدون إعلانات، وشارة VIP'
                    : 'Get 4K Ultra HD quality, ad-free experience, and VIP supporter badge'}
                </p>
              </div>

              {/* Plan Cards Grid: Monthly (20 SAR) vs Yearly (200 SAR + 2 Months Free) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Yearly Plan (Best Value with 2 Months Free) */}
                <div
                  onClick={() => setSelectedPlan('yearly')}
                  className={`relative cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between text-start ${
                    selectedPlan === 'yearly'
                      ? 'bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-amber-400 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute -top-2.5 start-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    <span>{isArabic ? 'الأفضل توفيراً + شهرين مجاناً' : 'Best Deal + 2 Mo Free'}</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mt-1 mb-2">
                      <span className="text-xs font-bold text-white">
                        {isArabic ? 'اشتراك سنوي (14 شهراً)' : 'Yearly Pass (14 Months)'}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlan === 'yearly' ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}>
                        {selectedPlan === 'yearly' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 my-1">
                      <span className="text-3xl font-black text-white tabular-nums">200</span>
                      <span className="text-sm font-bold text-amber-400">﷼</span>
                      <span className="text-[11px] text-slate-400">/ {isArabic ? 'سنوياً' : 'year'}</span>
                    </div>

                    <div className="mt-2 space-y-1 text-[11px]">
                      <p className="text-emerald-400 font-bold flex items-center gap-1">
                        <span>🎁 {isArabic ? 'شهرين مجاناً (ادفع 10 وخذ 12+2)' : '2 Months Free Bonus included'}</span>
                      </p>
                      <p className="text-slate-400">
                        {isArabic ? 'توفير 40 ﷼ مقارنة بالاشتراك الشهري' : 'Save 40 SAR vs monthly'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Monthly Plan (20 SAR) */}
                <div
                  onClick={() => setSelectedPlan('monthly')}
                  className={`relative cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between text-start ${
                    selectedPlan === 'monthly'
                      ? 'bg-gradient-to-b from-emerald-500/20 via-slate-900 to-slate-900 border-emerald-400 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">
                        {isArabic ? 'اشتراك شهري مرن' : 'Monthly Pass'}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlan === 'monthly' ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                      }`}>
                        {selectedPlan === 'monthly' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 my-1">
                      <span className="text-3xl font-black text-white tabular-nums">20</span>
                      <span className="text-sm font-bold text-emerald-400">﷼</span>
                      <span className="text-[11px] text-slate-400">/ {isArabic ? 'شهرياً' : 'month'}</span>
                    </div>

                    <div className="mt-2 space-y-1 text-[11px]">
                      <p className="text-slate-300 font-medium">
                        {isArabic ? 'تجديد شهري مرن تلقائي' : 'Flexible auto-renewal'}
                      </p>
                      <p className="text-slate-400">
                        {isArabic ? 'يمكنك الإلغاء في أي وقت' : 'Cancel anytime with one click'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature checklist */}
              <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-xs">
                {[
                  {
                    ar: 'دعم كامل للتطبيق وتحديثات السيرفر السريعة فورياً',
                    en: 'Support continuous app updates and fast server sync',
                  },
                  {
                    ar: 'أولوية المشاهدة بجودة فائقة 4K HDR الفاخرة',
                    en: 'Priority 4K HDR stream quality badges',
                  },
                  {
                    ar: 'تصفح نقي بالكامل وخالي من أي إعلانات مزعجة',
                    en: 'Clean experience with zero ads',
                  },
                  {
                    ar: 'شارة المشترك الذهبي المميز داخل التطبيق',
                    en: 'Gold VIP Member badge inside match rooms',
                  },
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{isArabic ? feat.ar : feat.en}</span>
                  </div>
                ))}
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  {isArabic ? 'طريقة الدفع (آمنة ومعتمدة):' : 'Payment Method:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('apple_pay')}
                    className={`min-h-[44px] p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      selectedMethod === 'apple_pay'
                        ? 'bg-slate-800 border-white text-white font-bold shadow-md'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('mada')}
                    className={`min-h-[44px] p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      selectedMethod === 'mada'
                        ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 font-bold shadow-md'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-black text-emerald-400 text-xs">مدى mada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`min-h-[44px] p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      selectedMethod === 'card'
                        ? 'bg-blue-950/40 border-blue-400 text-blue-300 font-bold shadow-md'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>بطاقة بنكية / فيزا</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('stc_pay')}
                    className={`min-h-[44px] p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      selectedMethod === 'stc_pay'
                        ? 'bg-purple-950/40 border-purple-400 text-purple-300 font-bold shadow-md'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold text-purple-400 text-xs">stc pay</span>
                  </button>
                </div>
              </div>

              {/* Pay Button CTA */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing || justActivated}
                className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75"
              >
                {justActivated ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    <span>{isArabic ? 'تم تفعيل الاشتراك بنجاح! 🎉' : 'Activated Successfully! 🎉'}</span>
                  </>
                ) : isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{isArabic ? 'جاري معالجة الدفع...' : 'Processing payment...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {selectedPlan === 'yearly'
                        ? (isArabic ? 'دفع 200 ﷼ وتفعيل باقة السنة (+ شهرين مجاناً)' : 'Pay 200 SAR & Activate Annual (14 Mo)')
                        : (isArabic ? 'دفع 20 ﷼ وتفعيل باقة الشهر' : 'Pay 20 SAR & Activate Monthly')}
                    </span>
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-1.5 text-center text-[10px] text-slate-500">
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {isArabic
                      ? 'دفع آمن ومشفّر 100% · إلغاء الاشتراك متاح في أي لحظة'
                      : 'Encrypted payment · Cancel anytime'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                >
                  {isArabic
                    ? 'بالدفع أنت توافق على شروط وأحكام اتفاق تطبيق "كورة لايف"'
                    : 'By paying you agree to KoraLive Terms & Conditions'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
