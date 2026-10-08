export interface SubscriberRecord {
  id: string;
  name: string;
  phoneOrEmail: string;
  plan: 'monthly' | 'yearly';
  amountSAR: number;
  paymentMethod: 'Apple Pay' | 'mada' | 'Visa' | 'stc pay';
  date: string;
  status: 'active' | 'renewing' | 'cancelled';
}

export interface IssueTicket {
  id: string;
  userName: string;
  type: 'stream' | 'notification' | 'match_data' | 'feature_request';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  date: string;
  status: 'open' | 'in_progress' | 'resolved';
}

export interface PayoutTransaction {
  id: string;
  referenceNumber: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  amountSAR: number;
  date: string;
  status: 'completed' | 'processing';
}

export const INITIAL_PAYOUTS: PayoutTransaction[] = [
  {
    id: 'pay-1',
    referenceNumber: 'TRX-882910',
    bankName: 'مصرف الراجحي (Al Rajhi Bank)',
    accountHolder: 'مالك التطبيق المعتمد',
    iban: 'SA4280000201608010001234',
    amountSAR: 200,
    date: '2026-10-02 14:30',
    status: 'completed',
  },
];

export const INITIAL_SUBSCRIBERS: SubscriberRecord[] = [
  {
    id: 'sub-101',
    name: 'عبدالرحمن العتيبي',
    phoneOrEmail: 'a.otaibi@gmail.com',
    plan: 'yearly',
    amountSAR: 200,
    paymentMethod: 'Apple Pay',
    date: '2026-10-04',
    status: 'active',
  },
  {
    id: 'sub-102',
    name: 'خالد بن محمد',
    phoneOrEmail: '+966 50 *** 4821',
    plan: 'yearly',
    amountSAR: 200,
    paymentMethod: 'mada',
    date: '2026-10-03',
    status: 'active',
  },
  {
    id: 'sub-103',
    name: 'سلطان القحطاني',
    phoneOrEmail: 'sultan.q@hotmail.com',
    plan: 'monthly',
    amountSAR: 20,
    paymentMethod: 'stc pay',
    date: '2026-10-04',
    status: 'active',
  },
  {
    id: 'sub-104',
    name: 'فهد الشمري',
    phoneOrEmail: '+966 55 *** 9102',
    plan: 'monthly',
    amountSAR: 20,
    paymentMethod: 'Apple Pay',
    date: '2026-10-02',
    status: 'active',
  },
  {
    id: 'sub-105',
    name: 'ياسر الدوسري',
    phoneOrEmail: 'yasser.d@yahoo.com',
    plan: 'yearly',
    amountSAR: 200,
    paymentMethod: 'Visa',
    date: '2026-10-01',
    status: 'active',
  },
];

export const INITIAL_ISSUES: IssueTicket[] = [
  {
    id: 'iss-1',
    userName: 'أبو فهد',
    type: 'stream',
    titleAr: 'تحديث رابط قناة SSC Extra في ديربي الرياض',
    titleEn: 'Update SSC Extra link for Riyadh Derby',
    descriptionAr: 'يرجى التأكد من توجيه الرابط إلى البث بدقة عالية 4K في منصة شاهد VIP.',
    descriptionEn: 'Please verify the link routes to 4K stream on Shahid VIP.',
    date: 'منذ ساعتين',
    status: 'resolved',
  },
  {
    id: 'iss-2',
    userName: 'محمد السعيد',
    type: 'notification',
    titleAr: 'طلب تنبيهات قبل بداية المباراة بـ 15 دقيقة',
    titleEn: 'Request match start notifications 15m prior',
    descriptionAr: 'أرغب في الحصول على تنبيه صافرة البداية قبل اللقاء لفرق المفضلة.',
    descriptionEn: 'Would like match kickoff alert 15 minutes before the match.',
    date: 'منذ 5 ساعات',
    status: 'in_progress',
  },
  {
    id: 'iss-3',
    userName: 'فيصل الغامدي',
    type: 'match_data',
    titleAr: 'إضافة إحصائيات الاستحواذ المباشرة في دوري أبطال أوروبا',
    titleEn: 'Add live possession stats for UCL games',
    descriptionAr: 'التطبيق ممتاز، نأمل الاستمرار في تحديث نسب الاستحواذ بسرعة فورية.',
    descriptionEn: 'Great app, keep real-time possession percentages updating fast.',
    date: 'أمس',
    status: 'open',
  },
];
