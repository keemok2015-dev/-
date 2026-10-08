import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  X,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import {
  isPushSupported,
  getPushPermission,
  requestPushPermission,
  getPushSettings,
  savePushSettings,
  sendTestPushNotification,
  PushNotificationSettings,
} from '../services/webPushService';
import { playGoalWhistleSound } from '../utils/audioAlert';

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({
  isOpen,
  onClose,
  isArabic,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<PushNotificationSettings>(getPushSettings());
  const [testSent, setTestSent] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermission(getPushPermission());
      setSettings(getPushSettings());
      setTestSent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const supported = isPushSupported();

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    const result = await requestPushPermission();
    setPermission(result);
    setIsRequesting(false);

    if (result === 'granted') {
      const updated = { ...settings, enabled: true };
      setSettings(updated);
      savePushSettings(updated);
      // Automatically send a welcome test notification
      await sendTestPushNotification(isArabic);
      playGoalWhistleSound();
      setTestSent(true);
    }
  };

  const handleToggleSetting = (key: keyof PushNotificationSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    savePushSettings(updated);
  };

  const handleSendTest = async () => {
    playGoalWhistleSound();
    const success = await sendTestPushNotification(isArabic);
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-gradient-to-b from-[#161d2d] to-[#0f1422] border border-emerald-500/40 rounded-3xl p-5 sm:p-6 text-white shadow-2xl relative overflow-hidden"
        style={{ direction: isArabic ? 'rtl' : 'ltr' }}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -end-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <BellRing className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{isArabic ? 'خدمة التنبيهات الفورية (Web Push)' : 'Web Push Instant Alerts'}</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black">
                PWA / Push
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {isArabic
                ? 'استقبل إشعارات الأهداف والنتائج المباشرة حتى لو كان التطبيق مغلقاً 📱'
                : 'Receive live goal & score notifications even if the app is closed 📱'}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              {isArabic ? 'حالة إذن المتصفح:' : 'Browser Permission Status:'}
            </span>
            {permission === 'granted' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isArabic ? 'مفعلة وتعمل بنجاح ✅' : 'Active & Granted ✅'}</span>
              </span>
            ) : permission === 'denied' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isArabic ? 'محظورة في المتصفح ❌' : 'Blocked in Browser ❌'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isArabic ? 'بانتظار الموافقة ⚠️' : 'Waiting Permission ⚠️'}</span>
              </span>
            )}
          </div>

          {permission !== 'granted' && (
            <div className="mt-3">
              <button
                type="button"
                onClick={handleRequestPermission}
                disabled={isRequesting}
                className="w-full min-h-[44px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <Bell className="w-4 h-4" />
                <span>
                  {isRequesting
                    ? (isArabic ? 'جاري طلب الإذن...' : 'Requesting...')
                    : (isArabic ? 'تفعيل إشعارات الدفع الفورية الآن 🔔' : 'Enable Web Push Notifications Now 🔔')}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Test Notification Action */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleSendTest}
            className="w-full min-h-[44px] bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>
              {testSent
                ? (isArabic ? 'تم إرسال إشعار التجربة بنجاح إلى شاشتك! 🎯' : 'Test notification sent to your screen! 🎯')
                : (isArabic ? '🚀 تجربة إشعار هدف فوري على شاشتك (Test Web Push)' : '🚀 Test Live Goal Web Push on your screen')}
            </span>
          </button>
        </div>

        {/* Toggles List */}
        <div className="space-y-2 mb-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="text-xs font-black text-slate-300 mb-2">
            {isArabic ? 'خيارات التنبيهات الذكية المباشرة:' : 'Smart Live Notification Preferences:'}
          </div>

          {/* Goal Alerts */}
          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-base">⚽</span>
              <div>
                <span className="text-xs font-bold text-white block">
                  {isArabic ? 'إشعارات الأهداف المباشرة' : 'Live Goal Notifications'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isArabic ? 'تنبيه فوري باسم الهداف والدقيقة والنتيجة' : 'Instant alert with scorer, minute & score'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyGoals}
              onChange={() => handleToggleSetting('notifyGoals')}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </label>

          {/* Kickoff Reminders */}
          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-base">⏰</span>
              <div>
                <span className="text-xs font-bold text-white block">
                  {isArabic ? 'تنبيه قبل انطلاق المباراة بـ 15 دقيقة' : '15-Minute Kickoff Reminder'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isArabic ? 'تذكير بموعد القمة الكروية والقناة الناقلة' : 'Reminder with kickoff time and broadcast channel'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyKickoff}
              onChange={() => handleToggleSetting('notifyKickoff')}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </label>

          {/* Full-time summary */}
          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-base">🏁</span>
              <div>
                <span className="text-xs font-bold text-white block">
                  {isArabic ? 'صافرة النهاية والنتيجة الرسمية' : 'Full-Time Official Result'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isArabic ? 'إشعار فوري عند إطلاق حكم اللقاء صافرة النهاية' : 'Alert when the referee blows the final whistle'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyFulltime}
              onChange={() => handleToggleSetting('notifyFulltime')}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </label>

          {/* Favorite Teams Only */}
          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-base">⭐</span>
              <div>
                <span className="text-xs font-bold text-white block">
                  {isArabic ? 'حصر التنبيهات بفرقي المفضلة فقط' : 'Favorite Teams Only'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isArabic ? 'تجاهل المباريات الأخرى والتركيز على أنديتك' : 'Only receive alerts for selected clubs'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyFavoritesOnly}
              onChange={() => handleToggleSetting('notifyFavoritesOnly')}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Feature Explanation Banner */}
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-200">
          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {isArabic
              ? 'تعتمد هذه الميزة على معيار Web Push API و Service Worker، مما يسمح بنظام دفع حقيقي للتنبيهات بصوت الصافرة واهتزاز الهاتف حتى عندما يكون التطبيق مقفلاً في الجيب أو المتصفح بالخلفية.'
              : 'This feature utilizes Web Push API & Service Worker, delivering true push notifications with vibration and sounds even when the app is closed.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[40px] px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
          >
            {isArabic ? 'إغلاق وحفظ الإعدادات' : 'Close & Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
