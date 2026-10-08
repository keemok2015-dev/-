import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Smartphone,
  Layers,
  Key,
  Database,
  Radio,
  ExternalLink,
  Cpu,
  RefreshCw,
  Terminal,
  Sparkles,
} from 'lucide-react';
import {
  ApiConfig,
  getStoredApiConfig,
  saveApiConfig,
  testApiConnection,
  fetchLiveFixturesFromApi,
} from '../services/apiFootballService';
import { Match } from '../types/football';

interface FlutterExportTabProps {
  isArabic: boolean;
  onUpdateMatchesFromApi?: (matches: Match[]) => void;
}

export const FlutterExportTab: React.FC<FlutterExportTabProps> = ({
  isArabic,
  onUpdateMatchesFromApi,
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('matches_screen_365.dart');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // API Config state
  const [apiConfig, setApiConfig] = useState<ApiConfig>(getStoredApiConfig);
  const [isTesting, setIsTesting] = useState(false);
  const [isFetchingFixtures, setIsFetchingFixtures] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestApi = async () => {
    setIsTesting(true);
    setTestResult(null);
    saveApiConfig(apiConfig);
    const result = await testApiConnection(apiConfig);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleFetchLiveFixtures = async () => {
    if (!apiConfig.apiKey.trim()) {
      setTestResult({
        success: false,
        message: isArabic
          ? 'الرجاء إدخال مفتاح API-Football الخاص بك أولاً'
          : 'Please enter your API Key first',
      });
      return;
    }
    setIsFetchingFixtures(true);
    setTestResult(null);
    try {
      const liveMatches = await fetchLiveFixturesFromApi(apiConfig.apiKey);
      if (liveMatches.length > 0) {
        if (onUpdateMatchesFromApi) {
          onUpdateMatchesFromApi(liveMatches);
        }
        setTestResult({
          success: true,
          message: isArabic
            ? `نجاح! تم جلب ${liveMatches.length} مباراة جارية حالياً من v3.football.api-sports.io وتحديث التطبيق فوراً!`
            : `Success! Fetched ${liveMatches.length} live matches from API-Football and updated app.`,
        });
      } else {
        setTestResult({
          success: true,
          message: isArabic
            ? 'الاتصال ناجح ولكن لا توجد مباريات جارية حالياً على السيرفر في هذه اللحظة.'
            : 'Connection successful! No live matches active right now on the server.',
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: isArabic
          ? `فشل جلب المباريات: ${e.message || 'تأكد من صحة المفتاح ورصيد الباقة'}`
          : `Failed fetching matches: ${e.message}`,
      });
    } finally {
      setIsFetchingFixtures(false);
    }
  };

  const handleCopy = (code: string, fileName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 1800);
  };

  const flutterFiles: Record<string, { label: string; code: string; descAr: string; descEn: string }> = {
    'matches_screen_365.dart': {
      label: 'matches_screen_365.dart',
      descAr: 'شاشة 365Scores كاملة مع Card و ListTile وجلب البيانات الحية والتحديث التلقائي',
      descEn: 'Full 365Scores-style MatchesScreen with API integration & auto-refresh timer',
      code: `// lib/screens/matches_screen_365.dart
import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '365Scores Clone',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        scaffoldBackgroundColor: const Color(0xFF0F172A),
      ),
      home: const MatchesScreen(),
    );
  }
}

class MatchItem {
  final String id;
  final String homeTeam;
  final String awayTeam;
  final int homeScore;
  final int awayScore;
  final int minute;
  final String status;
  final String leagueName;

  MatchItem({
    required this.id,
    required this.homeTeam,
    required this.awayTeam,
    required this.homeScore,
    required this.awayScore,
    required this.minute,
    required this.status,
    required this.leagueName,
  });

  factory MatchItem.fromJson(Map<String, dynamic> json) {
    final fixture = json['fixture'] ?? {};
    final league = json['league'] ?? {};
    final teams = json['teams'] ?? {};
    final goals = json['goals'] ?? {};

    return MatchItem(
      id: fixture['id']?.toString() ?? '',
      homeTeam: teams['home']?['name'] ?? 'فريق أ',
      awayTeam: teams['away']?['name'] ?? 'فريق ب',
      homeScore: goals['home'] ?? 0,
      awayScore: goals['away'] ?? 0,
      minute: fixture['status']?['elapsed'] ?? 45,
      status: fixture['status']?['short'] ?? 'LIVE',
      leagueName: league['name'] ?? 'الدوري الإنجليزي الممتاز',
    );
  }
}

class MatchesScreen extends StatefulWidget {
  const MatchesScreen({Key? key}) : super(key: key);

  @override
  State<MatchesScreen> createState() => _MatchesScreenState();
}

class _MatchesScreenState extends State<MatchesScreen> {
  // مفتاح API-Football الخاص بك
  final String apiKey = 'YOUR_API_KEY_HERE';
  
  List<MatchItem> matches = [];
  bool isLoading = true;
  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    fetchLiveScores();
    // تحديث تلقائي كل 20 ثانية لجلب أحدث الدقائق والنتائج
    _refreshTimer = Timer.periodic(const Duration(seconds: 20), (timer) {
      fetchLiveScores(isAutoRefresh: true);
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> fetchLiveScores({bool isAutoRefresh = false}) async {
    if (!isAutoRefresh) setState(() => isLoading = true);

    try {
      final response = await http.get(
        Uri.parse('https://v3.football.api-sports.io/fixtures?live=all'),
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List fixtures = data['response'] ?? [];

        setState(() {
          matches = fixtures.map((f) => MatchItem.fromJson(f)).toList();
          isLoading = false;
        });
      } else {
        throw Exception('فشل في جلب البيانات');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
        // بيانات احتياطية فورية عند عدم توفر الإنترنت
        if (matches.isEmpty) {
          matches = [
            MatchItem(id: '1', homeTeam: 'ريال مدريد', awayTeam: 'مانشستر سيتي', homeScore: 2, awayScore: 1, minute: 74, status: 'LIVE', leagueName: 'دوري أبطال أوروبا'),
            MatchItem(id: '2', homeTeam: 'الهلال', awayTeam: 'النصر', homeScore: 3, awayScore: 2, minute: 82, status: 'LIVE', leagueName: 'دوري روشن السعودي'),
            MatchItem(id: '3', homeTeam: 'أرسنال', awayTeam: 'ليفربول', homeScore: 2, awayScore: 2, minute: 90, status: 'FT', leagueName: 'الدوري الإنجليزي الممتاز'),
          ];
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('نتائج المباريات المباشرة'),
        backgroundColor: Colors.green[800],
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => fetchLiveScores(),
            tooltip: 'تحديث فوري',
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.green))
          : RefreshIndicator(
              onRefresh: () => fetchLiveScores(),
              color: Colors.green,
              child: ListView.builder(
                itemCount: matches.length,
                padding: const EdgeInsets.all(8.0),
                itemBuilder: (context, index) {
                  final match = matches[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 6.0, horizontal: 4.0),
                    color: const Color(0xFF1E293B),
                    elevation: 2,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: ListTile(
                      leading: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          "الدقيقة \${match.minute}'",
                          style: const TextStyle(
                            color: Colors.redAccent,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      title: Text(
                        '\${match.homeTeam}  VS  \${match.awayTeam}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '\${match.homeScore} - \${match.awayScore}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.greenAccent,
                          ),
                        ),
                      ),
                      subtitle: Text(
                        match.leagueName,
                        style: const TextStyle(color: Colors.white60, fontSize: 11),
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}`,
    },
    'node_axios_api.js': {
      label: 'node_axios_api.js',
      descAr: 'كود Node.js باستخدام مكتبة axios لجلب المباريات الحية مع معالجة الأخطاء والمفتاح',
      descEn: 'Clean Node.js Axios implementation for fetching live fixtures from API-Football',
      code: `// backend/getLiveScores.js
const axios = require('axios');

/**
 * دالة لجلب المباريات الحية أو مباريات اليوم من مزود بيانات رياضية API-Football
 * @param {string} apiKey - مفتاح RapidAPI أو API-Sports الخاص بك
 */
async function getLiveScores(apiKey = 'YOUR_API_KEY_HERE') {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
      timeout: 10000,
    });

    console.log("المباريات الجارية حالياً:", response.data);
    return response.data;
  } catch (error) {
    console.error("حدث خطأ أثناء جلب البيانات:", error.response ? error.response.data : error.message);
    throw error;
  }
}

// تنفيذ مباشر للتجربة:
if (require.main === module) {
  getLiveScores()
    .then((data) => {
      console.log(\`تم جلب \${data.results || 0} مباراة بنجاح!\`);
    })
    .catch((err) => {
      console.error("فشل الاتصال:", err.message);
    });
}

module.exports = { getLiveScores };`,
    },
    'subscription_service.dart': {
      label: 'subscription_service.dart',
      descAr: 'خدمة الاشتراكات: 20 ﷼ شهرياً، أو 200 ﷼ سنوياً مع شهرين إضافيين مجاناً (14 شهراً)',
      descEn: 'Subscription Service: 20 SAR Monthly, or 200 SAR Yearly + 2 Months Free (14 Mo total)',
      code: `// lib/services/subscription_service.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum SubscriptionPlan { monthly, yearly }

class SubscriptionService extends ChangeNotifier {
  static const String _keyIsSubscribed = 'vip_subscription_active';
  static const String _keySubscriptionPlan = 'vip_subscription_plan';
  static const String _keySubscriptionDate = 'vip_subscription_date';

  static const double monthlyPriceSAR = 20.0;
  static const double yearlyPriceSAR = 200.0;
  static const int yearlyBonusMonths = 2; // 14 months total

  bool _isSubscribed = false;
  SubscriptionPlan _currentPlan = SubscriptionPlan.yearly;

  bool get isSubscribed => _isSubscribed;
  SubscriptionPlan get currentPlan => _currentPlan;

  SubscriptionService() {
    _loadSubscriptionStatus();
  }

  Future<void> _loadSubscriptionStatus() async {
    final prefs = await SharedPreferences.getInstance();
    _isSubscribed = prefs.getBool(_keyIsSubscribed) ?? false;
    final planStr = prefs.getString(_keySubscriptionPlan) ?? 'yearly';
    _currentPlan = planStr == 'monthly' ? SubscriptionPlan.monthly : SubscriptionPlan.yearly;
    notifyListeners();
  }

  /// Activates VIP subscription (Monthly 20 SAR or Yearly 200 SAR + 2 months free)
  Future<bool> purchaseVipPass(SubscriptionPlan plan) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_keyIsSubscribed, true);
      await prefs.setString(_keySubscriptionPlan, plan == SubscriptionPlan.monthly ? 'monthly' : 'yearly');
      await prefs.setString(_keySubscriptionDate, DateTime.now().toIso8601String());
      _isSubscribed = true;
      _currentPlan = plan;
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Purchase error: \$e');
      return false;
    }
  }

  /// Cancels subscription
  Future<void> cancelSubscription() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyIsSubscribed, false);
    _isSubscribed = false;
    notifyListeners();
  }
}`,
    },
    'main.dart': {
      label: 'main.dart',
      descAr: 'نقطة الانطلاق لتطبيق فلاتر مع الوضع الليلي ودعم اللغة العربية (RTL)',
      descEn: 'Flutter app entry point with Dark Sports Theme & RTL Arabic localization',
      code: `// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'screens/matches_screen_365.dart';

void main() {
  runApp(const KoraLiveApp());
}

class KoraLiveApp extends StatelessWidget {
  const KoraLiveApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'كورة لايف - KoraLive',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar', 'SA'),
      supportedLocales: const [
        Locale('ar', 'SA'),
        Locale('en', 'US'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF090D16),
        primaryColor: const Color(0xFF10B981),
      ),
      home: const MatchesScreen(),
    );
  }
}`,
    },
  };

  const activeItem = flutterFiles[selectedFile] || Object.values(flutterFiles)[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-[#102030] to-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {isArabic ? 'هندسة كود فلاتر و API-Football للهواتف الذكية' : 'Flutter & API-Football Mobile Architecture'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isArabic
                ? 'يتضمن كود فلاتر لشاشة 365Scores مع Card و ListTile، ودالة Node.js Axios لجلب المباريات الحية.'
                : 'Includes full 365Scores Flutter clone code with Card/ListTile and Node.js Axios live fixtures script.'}
            </p>
          </div>
        </div>
      </div>

      {/* API-Football Live Connection Panel */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">
              {isArabic ? 'ربط API-Football (بيانات حية مباشرة)' : 'API-Football Live Integration'}
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">v3.football.api-sports.io</span>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
            {isArabic ? 'مفتاح RapidAPI / API-Football Key:' : 'RapidAPI / API-Football Key:'}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder={isArabic ? 'أدخل مفتاح API الخاص بك هنا (YOUR_API_KEY_HERE)...' : 'Enter API Key...'}
              value={apiConfig.apiKey}
              onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
              className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestApi}
                disabled={isTesting}
                className="min-h-[40px] px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" /> : <Cpu className="w-4 h-4 text-emerald-400" />}
                <span>{isArabic ? 'فحص المفتاح' : 'Test Key'}</span>
              </button>

              <button
                onClick={handleFetchLiveFixtures}
                disabled={isFetchingFixtures}
                className="min-h-[40px] px-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                {isFetchingFixtures ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isArabic ? 'جلب المباريات الحية للتطبيق' : 'Fetch & Sync App'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Test Status Feedback */}
        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              testResult.success
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/30 border-red-500/40 text-red-300'
            }`}
          >
            {testResult.message}
          </div>
        )}
      </div>

      {/* Code File Viewer & Exporter */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        {/* File Tabs */}
        <div className="flex items-center px-2 py-2 bg-slate-900/90 border-b border-slate-800 overflow-x-auto no-scrollbar gap-1.5">
          {Object.entries(flutterFiles).map(([key, item]) => {
            const active = selectedFile === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedFile(key)}
                className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* File Header & Copy Button */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/40 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400">{activeItem.label}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isArabic ? activeItem.descAr : activeItem.descEn}
            </p>
          </div>

          <button
            onClick={() => handleCopy(activeItem.code, selectedFile)}
            className="min-h-[36px] px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700/80"
          >
            {copiedFile === selectedFile ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">{isArabic ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isArabic ? 'نسخ الكود' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content Box */}
        <div className="p-4 bg-[#090d16] overflow-x-auto max-h-[500px]">
          <pre className="text-xs font-mono text-slate-300 leading-relaxed">
            <code>{activeItem.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
