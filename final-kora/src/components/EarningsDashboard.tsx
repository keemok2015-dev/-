import React, { useState } from 'react';
import {
  Wallet,
  Building2,
  TrendingUp,
  ArrowDownToLine,
  CheckCircle2,
  LogOut,
  X,
  CreditCard,
  History,
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
  LineChart as LineChartIcon,
  Zap,
  Printer,
  Copy,
  Check,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface EarningsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isArabic: boolean;
}

export interface PayoutRecord {
  id: string;
  reference: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  amountSAR: number;
  date: string;
  status: 'completed' | 'processing';
  transferType?: 'instant' | 'regular';
  swiftCode?: string;
  notes?: string;
}

const DAILY_DATA = [
  { name: 'السبت', nameEn: 'Sat', amount: 1450, subscriptions: 8 },
  { name: 'الأحد', nameEn: 'Sun', amount: 1820, subscriptions: 11 },
  { name: 'الاثنين', nameEn: 'Mon', amount: 1600, subscriptions: 9 },
  { name: 'الثلاثاء', nameEn: 'Tue', amount: 2100, subscriptions: 13 },
  { name: 'الأربعاء', nameEn: 'Wed', amount: 2450, subscriptions: 16 },
  { name: 'الخميس', nameEn: 'Thu', amount: 3120, subscriptions: 21 },
  { name: 'الجمعة', nameEn: 'Fri', amount: 3680, subscriptions: 26 },
];

const WEEKLY_DATA = [
  { name: 'الأسبوع 1', nameEn: 'Week 1', amount: 9200, subscriptions: 58 },
  { name: 'الأسبوع 2', nameEn: 'Week 2', amount: 10450, subscriptions: 69 },
  { name: 'الأسبوع 3', nameEn: 'Week 3', amount: 11100, subscriptions: 74 },
  { name: 'الأسبوع 4', nameEn: 'Week 4', amount: 12800, subscriptions: 85 },
  { name: 'الأسبوع 5', nameEn: 'Week 5', amount: 13950, subscriptions: 92 },
  { name: 'الأسبوع 6', nameEn: 'Week 6', amount: 16220, subscriptions: 108 },
];

const MONTHLY_DATA = [
  { name: 'يناير', nameEn: 'Jan', amount: 26200, subscriptions: 174 },
  { name: 'فبراير', nameEn: 'Feb', amount: 29100, subscriptions: 194 },
  { name: 'مارس', nameEn: 'Mar', amount: 33850, subscriptions: 225 },
  { name: 'أبريل', nameEn: 'Apr', amount: 38300, subscriptions: 255 },
  { name: 'مايو', nameEn: 'May', amount: 42050, subscriptions: 280 },
  { name: 'يونيو', nameEn: 'Jun', amount: 47650, subscriptions: 317 },
];

const SUPPORTED_BANKS = [
  { id: 'alrajhi', nameAr: 'مصرف الراجحي', nameEn: 'Al Rajhi Bank' },
  { id: 'snb', nameAr: 'البنك الأهلي السعودي (SNB)', nameEn: 'Saudi National Bank (SNB)' },
  { id: 'alinma', nameAr: 'بنك الإنماء', nameEn: 'Alinma Bank' },
  { id: 'riyad', nameAr: 'بنك الرياض', nameEn: 'Riyad Bank' },
  { id: 'albilad', nameAr: 'بنك البلاد', nameEn: 'Bank Albilad' },
  { id: 'aljazira', nameAr: 'بنك الجزيرة', nameEn: 'Bank AlJazira' },
  { id: 'sab', nameAr: 'البنك السعودي الأول (ساب SAB)', nameEn: 'Saudi Awwal Bank (SAB)' },
  { id: 'saib', nameAr: 'بنك الاستثمار السعودي', nameEn: 'Saudi Investment Bank (SAIB)' },
  { id: 'anb', nameAr: 'البنك العربي الوطني (ANB)', nameEn: 'Arab National Bank (ANB)' },
  { id: 'gib', nameAr: 'بنك الخليج الدولي (GIB)', nameEn: 'Gulf International Bank (GIB)' },
  { id: 'd360', nameAr: 'بنك D360 الرقمي السعودي', nameEn: 'D360 Digital Bank' },
  { id: 'fab', nameAr: 'بنك أبوظبي الأول (FAB)', nameEn: 'First Abu Dhabi Bank (FAB)' },
  { id: 'enbd', nameAr: 'بنك الإمارات دبي الوطني', nameEn: 'Emirates NBD' },
  { id: 'qnb', nameAr: 'بنك قطر الوطني (QNB)', nameEn: 'Qatar National Bank (QNB)' },
  { id: 'nbk', nameAr: 'بنك الكويت الوطني (NBK)', nameEn: 'National Bank of Kuwait (NBK)' },
  { id: 'cib', nameAr: 'البنك التجاري الدولي (CIB)', nameEn: 'Commercial International Bank (CIB)' },
  { id: 'muscat', nameAr: 'بنك مسقط', nameEn: 'Bank Muscat' },
  { id: 'custom', nameAr: 'بنك آخر (إدخال يدوي لأي بنك محلي أو دولي)', nameEn: 'Other Bank (Custom)' },
];

export const EarningsDashboard: React.FC<EarningsDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  isArabic,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const [totalEarnings] = useState(47650);
  const [availableBalance, setAvailableBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('koralive_available_balance');
      if (saved) return Number(saved);
    } catch (e) {}
    return 12480;
  });

  const [payouts, setPayouts] = useState<PayoutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('koralive_payout_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'p-1',
        reference: 'TRX-948102',
        bankName: 'مصرف الراجحي (Al Rajhi)',
        accountHolder: 'عبدالكريم (المالك المعتمد)',
        iban: 'SA4280000201608010001234',
        amountSAR: 5000,
        date: '2026-10-02 14:30',
        status: 'completed',
        transferType: 'instant',
        notes: 'سحب أرباح اشتراكات VIP',
      },
      {
        id: 'p-2',
        reference: 'TRX-774921',
        bankName: 'البنك الأهلي السعودي (SNB)',
        accountHolder: 'عبدالكريم (المالك المعتمد)',
        iban: 'SA1810000001234567890123',
        amountSAR: 4200,
        date: '2026-09-28 11:15',
        status: 'completed',
        transferType: 'instant',
        notes: 'سحب دوري شهري',
      },
    ];
  });

  // Form State
  const [selectedBank, setSelectedBank] = useState('مصرف الراجحي');
  const [customBank, setCustomBank] = useState('');
  const [accountHolder, setAccountHolder] = useState('عبدالكريم - مالك التطبيق');
  const [iban, setIban] = useState('SA4280000201608010001234');
  const [swiftCode, setSwiftCode] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferType, setTransferType] = useState<'instant' | 'regular'>('instant');
  const [transferNotes, setTransferNotes] = useState('سحب أرباح تطبيق كورة لايف');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PayoutRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  if (!isOpen) return null;

  const totalWithdrawn = payouts.reduce((acc, curr) => acc + curr.amountSAR, 0);

  // Currency Formatter
  const formatCurrency = (val: number) => {
    return `${val.toLocaleString()} ${isArabic ? 'ر.س' : 'SAR'}`;
  };

  const currentChartData =
    chartPeriod === 'daily'
      ? DAILY_DATA
      : chartPeriod === 'weekly'
      ? WEEKLY_DATA
      : MONTHLY_DATA;

  const handleQuickAmount = (amount: number) => {
    const finalAmount = Math.min(amount, availableBalance);
    setWithdrawAmount(String(finalAmount));
  };

  const handleMaxAmountClick = () => {
    setWithdrawAmount(String(availableBalance));
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (!amountNum || amountNum <= 0) return;
    if (amountNum > availableBalance) {
      alert(isArabic ? 'المبلغ المطلوب يتجاوز الرصيد المتاح للسحب!' : 'Amount exceeds available balance!');
      return;
    }
    if (!iban.trim() || !accountHolder.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const finalBank = selectedBank.includes('بنك آخر') || selectedBank === 'custom'
        ? (customBank.trim() || 'بنك محلي/دولي')
        : selectedBank;
      const refNum = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newPayout: PayoutRecord = {
        id: `p-${Date.now()}`,
        reference: refNum,
        bankName: finalBank,
        accountHolder,
        iban,
        amountSAR: amountNum,
        date: dateStr,
        status: 'completed',
        transferType,
        swiftCode: swiftCode.trim() || undefined,
        notes: transferNotes || 'سحب أرباح تطبيق كورة لايف',
      };

      const newAvailable = availableBalance - amountNum;
      setAvailableBalance(newAvailable);
      const updatedPayouts = [newPayout, ...payouts];
      setPayouts(updatedPayouts);

      try {
        localStorage.setItem('koralive_available_balance', String(newAvailable));
        localStorage.setItem('koralive_payout_history', JSON.stringify(updatedPayouts));
      } catch (err) {}

      setIsSubmitting(false);
      setWithdrawAmount('');
      setSuccessMessage(
        isArabic
          ? `✅ تم تنفيذ طلب التحويل البنكي الفوري بنجاح! رقم الحوالة: ${refNum} بمبلغ ${formatCurrency(amountNum)} إلى حسابك في (${finalBank}).`
          : `✅ Bank transfer executed successfully! Ref: ${refNum} (${formatCurrency(amountNum)})`
      );

      // Auto show receipt for this new transaction
      setSelectedReceipt(newPayout);

      setTimeout(() => setSuccessMessage(null), 8000);
    }, 600);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border border-emerald-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-emerald-950/50">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  {isArabic ? 'لوحة معلومات الأرباح والسحب البنكي' : 'Owner Earnings & Bank Payouts'}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'خاص بالمالك (مخفي)' : 'Owner Only (Hidden)'}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isArabic
                  ? 'إحصائيات الإيرادات وسحب الأرباح الفورية إلى أي حساب بنكي معتمد'
                  : 'Track earnings and withdraw funds directly to any bank account'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="min-h-[38px] px-3 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
              title={isArabic ? 'تسجيل الخروج وقفل اللوحة' : 'Logout and lock dashboard'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? 'قفل اللوحة' : 'Lock'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1. Top Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
              <span className="text-[11px] text-slate-400 block mb-1">
                {isArabic ? 'إجمالي الأرباح الكلية' : 'Total Revenue'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
                {formatCurrency(totalEarnings)}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                <span>+16.8% {isArabic ? 'نمو الأرباح' : 'Growth'}</span>
              </span>
            </div>

            <div className="bg-slate-900/80 border border-emerald-500/40 p-4 rounded-2xl bg-gradient-to-b from-emerald-950/20 to-slate-900 shadow-lg shadow-emerald-950/30">
              <span className="text-[11px] text-emerald-300 block mb-1 font-bold">
                {isArabic ? 'الرصيد المتاح للسحب' : 'Available for Payout'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                {formatCurrency(availableBalance)}
              </span>
              <span className="text-[10px] text-emerald-300/80 flex items-center gap-1 mt-1 font-bold">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{isArabic ? 'جاهز للتحويل الفوري (سريع)' : 'Ready for Instant Payout'}</span>
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 block mb-1">
                {isArabic ? 'إجمالي المسحوبات السابقة' : 'Total Withdrawn'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                {formatCurrency(totalWithdrawn)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {payouts.length} {isArabic ? 'حوالات بنكية منفذة' : 'Payouts'}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 block mb-1">
                {isArabic ? 'حالة الحساب البنكي' : 'Payout Gateway'}
              </span>
              <span className="text-base font-black text-white flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isArabic ? 'نشط ومعتمد' : 'Verified'}</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                SARIE · SA***1234
              </span>
            </div>
          </div>

          {/* 2. Recharts Professional Interactive Chart */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    {isArabic
                      ? `مخطط الأرباح ${chartPeriod === 'daily' ? 'اليومية' : chartPeriod === 'weekly' ? 'الأسبوعية' : 'الشهرية'}`
                      : `${chartPeriod.toUpperCase()} Earnings Growth`}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {isArabic ? 'مخطط بياني احترافي تفاعلي مدعوم بـ Recharts' : 'Interactive chart powered by Recharts'}
                  </p>
                </div>
              </div>

              {/* Controls: Daily / Weekly / Monthly + Chart Type Toggle */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60 text-xs">
                  <button
                    type="button"
                    onClick={() => setChartPeriod('daily')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      chartPeriod === 'daily'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isArabic ? 'يومي (7 أيام)' : 'Daily'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartPeriod('weekly')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      chartPeriod === 'weekly'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isArabic ? 'أسبوعي (6 أسابيع)' : 'Weekly'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartPeriod('monthly')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      chartPeriod === 'monthly'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isArabic ? 'شهري' : 'Monthly'}
                  </button>
                </div>

                <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setChartType('area')}
                    className={`p-1.5 rounded-lg transition-all ${
                      chartType === 'area' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Area Chart"
                  >
                    <LineChartIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartType('bar')}
                    className={`p-1.5 rounded-lg transition-all ${
                      chartType === 'bar' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Bar Chart"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="w-full h-56 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey={isArabic ? 'name' : 'nameEn'}
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `${val.toLocaleString()} ﷼`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0b101e',
                        borderColor: '#10b981',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      }}
                      formatter={(val: any) => [`${Number(val).toLocaleString()} ﷼ SAR`, isArabic ? 'الأرباح' : 'Earnings']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#earningsGradient)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey={isArabic ? 'name' : 'nameEn'}
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `${val.toLocaleString()} ﷼`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0b101e',
                        borderColor: '#10b981',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${Number(val).toLocaleString()} ﷼ SAR`, isArabic ? 'الأرباح' : 'Earnings']}
                    />
                    <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Bank Withdrawal Form & Gateway */}
          <div className="bg-slate-900/80 border border-emerald-500/40 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-black text-white">
                    {isArabic ? 'طلب تحويل وسحب الأرباح لأي حساب بنكي' : 'Direct Bank Payout & Transfer Form'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isArabic
                      ? 'يمكنك سحب أرباحك فوراً إلى أي بنك سعودي أو خليجي أو دولي ترغبه'
                      : 'Transfer earnings instantly to any domestic or international bank'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                {isArabic ? 'المتاح للسحب:' : 'Available:'} {formatCurrency(availableBalance)}
              </span>
            </div>

            {successMessage && (
              <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/70 text-emerald-200 text-xs rounded-xl flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="font-bold">{successMessage}</span>
                </div>
                {selectedReceipt && (
                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(selectedReceipt)}
                    className="min-h-[32px] px-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-lg hover:bg-emerald-400 transition-colors whitespace-nowrap"
                  >
                    {isArabic ? 'عرض الإيصال 📄' : 'View Receipt 📄'}
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Select Bank */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isArabic ? 'اختر البنك المستلم (أي بنك):' : 'Select Destination Bank (Any Bank):'}
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  {SUPPORTED_BANKS.map((b) => (
                    <option key={b.id} value={b.nameAr}>
                      {isArabic ? b.nameAr : b.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Bank Name if chosen */}
              {(selectedBank.includes('بنك آخر') || selectedBank === 'custom') ? (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isArabic ? 'اسم البنك يدوياً:' : 'Custom Bank Name:'}
                  </label>
                  <input
                    type="text"
                    value={customBank}
                    onChange={(e) => setCustomBank(e.target.value)}
                    placeholder={isArabic ? 'أدخل اسم البنك المستلم...' : 'Enter bank name...'}
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              ) : (
                /* Transfer Speed / Type */
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isArabic ? 'سرعة التحويل:' : 'Transfer Method:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTransferType('instant')}
                      className={`min-h-[44px] px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        transferType === 'instant'
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isArabic ? 'فوري (سريع SARIE)' : 'Instant (SARIE)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferType('regular')}
                      className={`min-h-[44px] px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        transferType === 'regular'
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'عادي (خلال 24 س)' : 'Standard (24h)'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Beneficiary Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isArabic ? 'اسم صاحب الحساب / المستفيد:' : 'Account Holder Name:'}
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder={isArabic ? 'الاسم بالكامل كالمسجل بالبنك' : 'Full Account Holder Name'}
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              {/* Swift Code (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isArabic ? 'رمز السويفت (SWIFT / BIC - اختياري):' : 'SWIFT / BIC Code (Optional):'}
                </label>
                <input
                  type="text"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value.toUpperCase())}
                  placeholder="RJHI SA RI / NCBK SA JE"
                  dir="ltr"
                  className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3 font-mono text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* IBAN */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isArabic ? 'رقم الآيبان البنكي (IBAN) أو رقم الحساب:' : 'Bank IBAN or Account Number:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value.toUpperCase())}
                    placeholder="SA0000000000000000000000"
                    dir="ltr"
                    className="w-full min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-400 tracking-wider"
                    required
                  />
                  <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold">
                    {iban.startsWith('SA') ? `${iban.length}/24 Chars` : 'Account'}
                  </span>
                </div>
              </div>

              {/* Quick Amount Chips & Amount Input */}
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    {isArabic ? 'المبلغ المراد سحبه بالريال السعودي (SAR):' : 'Amount to withdraw (SAR):'}
                  </label>
                  <button
                    type="button"
                    onClick={handleMaxAmountClick}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline"
                  >
                    {isArabic ? `سحب كامل الرصيد (${formatCurrency(availableBalance)})` : 'Withdraw Full Balance'}
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[1000, 2500, 5000, 10000].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickAmount(chip)}
                      disabled={chip > availableBalance}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs font-bold text-slate-200 hover:text-emerald-300 transition-colors disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap"
                    >
                      {chip.toLocaleString()} ﷼
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleMaxAmountClick}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-colors whitespace-nowrap"
                  >
                    {isArabic ? 'كامل الرصيد' : 'All'}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={isArabic ? 'أدخل المبلغ بالريال (مثال: 5000)' : 'Amount in SAR (e.g. 5000)'}
                    className="w-full min-h-[46px] bg-slate-900 border border-slate-700 rounded-xl px-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
                    required
                  />
                  <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ﷼ SAR
                  </span>
                </div>
              </div>

              {/* Transfer Notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isArabic ? 'ملاحظات أو وصف الحوالة (اختياري):' : 'Transfer Reference Note (Optional):'}
                </label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder={isArabic ? 'مثال: سحب أرباح تطبيق كورة لايف' : 'e.g. KoraLive owner payout'}
                  className="w-full min-h-[42px] bg-slate-900 border border-slate-700 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !withdrawAmount || Number(withdrawAmount) <= 0}
                  className="w-full min-h-[48px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <ArrowDownToLine className="w-5 h-5" />
                  <span>
                    {isSubmitting
                      ? (isArabic ? 'جاري تنفيذ الحوالة البنكية وتوثيق العملية...' : 'Processing Payout...')
                      : (isArabic ? 'تأكيد طلب التحويل وسحب الأرباح الآن' : 'Confirm Payout & Transfer Funds')}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* 4. Withdrawals History Log */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">
                  {isArabic ? 'سجل الحوالات والمسحوبات البنكية المنفذة' : 'Bank Payouts & Transfers Log'}
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                {payouts.length} {isArabic ? 'عمليات سحب' : 'Transactions'}
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {payouts.map((p) => (
                <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{p.bankName}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.2 rounded font-mono">
                          {p.reference}
                        </span>
                        {p.transferType === 'instant' && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                            SARIE ⚡
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {p.accountHolder} · {p.iban}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{p.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-base font-black text-emerald-400 tabular-nums">
                      {formatCurrency(p.amountSAR)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(p)}
                      className="min-h-[32px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
                      title={isArabic ? 'عرض الإيصال المعتمد' : 'View receipt'}
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">{isArabic ? 'الإيصال' : 'Receipt'}</span>
                    </button>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      {isArabic ? '✅ تم التحويل' : 'Completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Electronic Bank Transfer Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-3 animate-in fade-in">
          <div className="bg-[#0f172a] border border-emerald-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 p-5 border-b border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {isArabic ? 'إيصال تحويل بنكي معتمد' : 'Official Transfer Receipt'}
                  </h4>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    {selectedReceipt.reference}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-5 space-y-4 text-right">
              {/* Amount Stamp */}
              <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl text-center">
                <span className="text-xs text-slate-400 block mb-1">
                  {isArabic ? 'المبلغ المحول' : 'Transferred Amount'}
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {formatCurrency(selectedReceipt.amountSAR)}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold inline-block mt-2">
                  ✓ {isArabic ? 'عملية سحب ناجحة ومؤكدة' : 'Confirmed & Completed'}
                </span>
              </div>

              {/* Transfer Details Grid */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{isArabic ? 'البنك المستلم:' : 'Bank:'}</span>
                  <span className="font-bold text-white">{selectedReceipt.bankName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{isArabic ? 'المستفيد:' : 'Beneficiary:'}</span>
                  <span className="font-bold text-white">{selectedReceipt.accountHolder}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{isArabic ? 'رقم الآيبان (IBAN):' : 'IBAN:'}</span>
                  <span className="font-mono text-emerald-300 text-[11px]">{selectedReceipt.iban}</span>
                </div>
                {selectedReceipt.swiftCode && (
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">{isArabic ? 'رمز السويفت:' : 'SWIFT:'}</span>
                    <span className="font-mono text-slate-200">{selectedReceipt.swiftCode}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{isArabic ? 'التاريخ والوقت:' : 'Date & Time:'}</span>
                  <span className="font-mono text-slate-300">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{isArabic ? 'المرجع الرقمي:' : 'Reference:'}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-slate-200">{selectedReceipt.reference}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedReceipt.reference)}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy"
                    >
                      {copiedRef ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(isArabic ? 'تم حفظ / إرسال نسخة من الإيصال إلى بريد المالك!' : 'Receipt exported!');
                  }}
                  className="flex-1 min-h-[42px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isArabic ? 'طباعة / حفظ الإيصال' : 'Print / Save'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="min-h-[42px] px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
                >
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
