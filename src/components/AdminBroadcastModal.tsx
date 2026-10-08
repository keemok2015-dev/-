import React, { useState } from 'react';
import { OfficialBroadcast, Match } from '../types/football';
import {
  X,
  Plus,
  Trash2,
  Save,
  Check,
  Users,
  AlertTriangle,
  Tv,
  Link,
  Copy,
  ExternalLink,
  Shield,
  DollarSign,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Lock,
  Clock,
} from 'lucide-react';
import {
  SubscriberRecord,
  IssueTicket,
  INITIAL_SUBSCRIBERS,
  INITIAL_ISSUES,
} from '../data/mockOwnerData';

interface AdminBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcasts: OfficialBroadcast[];
  onAddBroadcast: (broadcast: OfficialBroadcast) => void;
  onDeleteBroadcast: (id: string) => void;
  matches: Match[];
  onAssignChannelToMatch: (matchId: string, broadcast: OfficialBroadcast) => void;
  isArabic: boolean;
  onOpenEarnings?: () => void;
  isAdminAuthenticated?: boolean;
}

export const AdminBroadcastModal: React.FC<AdminBroadcastModalProps> = ({
  isOpen,
  onClose,
  broadcasts,
  onAddBroadcast,
  onDeleteBroadcast,
  matches,
  onAssignChannelToMatch,
  isArabic,
  onOpenEarnings,
  isAdminAuthenticated,
}) => {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'issues' | 'channels' | 'links'>('subscribers');

  // Subscribers state
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>(() => {
    try {
      const saved = localStorage.getItem('koralive_owner_subscribers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SUBSCRIBERS;
  });

  // Issues state
  const [issues, setIssues] = useState<IssueTicket[]>(() => {
    try {
      const saved = localStorage.getItem('koralive_owner_issues');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ISSUES;
  });

  // New Issue input
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDesc, setNewIssueDesc] = useState('');

  // Channel Form state
  const [channelName, setChannelName] = useState('');
  const [channelNameAr, setChannelNameAr] = useState('');
  const [platform, setPlatform] = useState<'Satellite' | 'Streaming' | 'Cable'>('Streaming');
  const [quality, setQuality] = useState<'4K HDR' | 'Full HD 1080p' | 'HD 720p'>('4K HDR');
  const [commentator, setCommentator] = useState('');
  const [commentatorAr, setCommentatorAr] = useState('');
  const [officialUrl, setOfficialUrl] = useState('');
  const [satellite, setSatellite] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  // URLs
  const publicAppUrl = 'https://ais-pre-274yqkpldtyyfykqfsyysv-909959587565.europe-west2.run.app';

  const handleCopyLink = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 1800);
  };

  const handleToggleIssueStatus = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const nextStatus =
            iss.status === 'open'
              ? 'in_progress'
              : iss.status === 'in_progress'
              ? 'resolved'
              : 'open';
          return { ...iss, status: nextStatus };
        }
        return iss;
      })
    );
  };

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle.trim()) return;
    const item: IssueTicket = {
      id: `iss-${Date.now()}`,
      userName: 'مالك التطبيق (ملاحظة داخلية)',
      type: 'feature_request',
      titleAr: newIssueTitle,
      titleEn: newIssueTitle,
      descriptionAr: newIssueDesc || 'لا يوجد تفاصيل إضافية',
      descriptionEn: newIssueDesc || 'No additional details',
      date: 'الآن',
      status: 'open',
    };
    setIssues([item, ...issues]);
    setNewIssueTitle('');
    setNewIssueDesc('');
  };

  const handleChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim() && !channelNameAr.trim()) return;

    const newBroadcast: OfficialBroadcast = {
      id: `b-${Date.now()}`,
      channelName: channelName || channelNameAr,
      channelNameAr: channelNameAr || channelName,
      platform,
      quality,
      commentator: commentator || commentatorAr || 'Commentary Team',
      commentatorAr: commentatorAr || commentator || 'فريق التعليق',
      officialUrl: officialUrl || 'https://tod.tv',
      satellite: satellite || undefined,
      logo: platform === 'Streaming' ? '📱' : '📺',
      isLiveAvailable: true,
    };

    onAddBroadcast(newBroadcast);

    if (selectedMatchId) {
      onAssignChannelToMatch(selectedMatchId, newBroadcast);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setChannelName('');
      setChannelNameAr('');
      setCommentator('');
      setCommentatorAr('');
      setOfficialUrl('');
      setSatellite('');
    }, 1200);
  };

  // Subscriber Stats
  const totalSubscribersCount = subscribers.length;
  const yearlyCount = subscribers.filter((s) => s.plan === 'yearly').length;
  const monthlyCount = subscribers.filter((s) => s.plan === 'monthly').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border border-emerald-500/30 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-emerald-950/40">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>{isArabic ? 'لوحة تحكم المالك والإدارة' : 'Owner Control Panel'}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.2 rounded-full font-bold">
                  {isArabic ? 'المالك المعتمد' : 'Admin'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isArabic
                  ? 'متابعة المشتركين، مراجعة المشاكل، وتحديث القنوات والروابط'
                  : 'Track subscribers, review issues, and manage broadcasts'}
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

        {/* Navigation Tabs */}
        <div className="flex items-center px-4 bg-slate-900/90 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            {
              id: 'subscribers' as const,
              labelAr: 'المشتركون',
              labelEn: 'Subscribers',
              icon: Users,
              badge: totalSubscribersCount,
            },
            ...(isAdminAuthenticated
              ? [
                  {
                    id: 'payouts' as const,
                    labelAr: 'الأرباح والسحب البنكي 💰',
                    labelEn: 'Earnings & Payout 💰',
                    icon: DollarSign,
                    isSpecial: true,
                  },
                ]
              : []),
            {
              id: 'issues' as const,
              labelAr: 'مركز المشاكل والبلاغات',
              labelEn: 'Issues & Tickets',
              icon: AlertTriangle,
              badge: issues.filter((i) => i.status !== 'resolved').length,
            },
            {
              id: 'channels' as const,
              labelAr: 'إدارة القنوات والبث',
              labelEn: 'Broadcast Channels',
              icon: Tv,
              badge: broadcasts.length,
            },
            {
              id: 'links' as const,
              labelAr: 'روابط التطبيق والنشر',
              labelEn: 'Access Links',
              icon: Link,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === (tab.id as any);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'payouts' && onOpenEarnings) {
                    onClose();
                    onOpenEarnings();
                    return;
                  }
                  setActiveTab(tab.id as any);
                }}
                className={`min-h-[44px] px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  active
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{isArabic ? tab.labelAr : tab.labelEn}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              {/* Stats Grid without Revenue/Profits */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">
                    {isArabic ? 'إجمالي المشتركين' : 'Total Subscribers'}
                  </span>
                  <span className="text-xl font-black text-white tabular-nums">
                    {totalSubscribersCount}
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5 font-bold">
                    ✓ {isArabic ? 'اشتراكات نشطة' : 'Active VIP'}
                  </span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">
                    {isArabic ? 'باقة السنة' : 'Yearly Plan'}
                  </span>
                  <span className="text-xl font-black text-amber-400 tabular-nums">
                    {yearlyCount}
                  </span>
                  <span className="text-[10px] text-amber-300 block mt-0.5 font-bold">
                    🎁 {isArabic ? '+ شهرين مجاناً' : '+ 2 Months Free'}
                  </span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">
                    {isArabic ? 'باقة الشهر' : 'Monthly Plan'}
                  </span>
                  <span className="text-xl font-black text-blue-400 tabular-nums">
                    {monthlyCount}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isArabic ? 'تجديد مرن' : 'Auto-renew'}
                  </span>
                </div>
              </div>

              {/* Subscribers List Table */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isArabic ? 'قائمة المشتركين المسجلين' : 'Subscriber Members Log'}</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {isArabic ? 'تحديث لحظي' : 'Live synced'}
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {subscribers.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200">
                          {sub.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">
                            {sub.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                            {sub.phoneOrEmail} · {sub.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            sub.plan === 'yearly'
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                              : 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                          }`}
                        >
                          {sub.plan === 'yearly'
                            ? (isArabic ? 'سنوي + شهرين' : 'Yearly VIP')
                            : (isArabic ? 'شهري' : 'Monthly VIP')}
                        </span>

                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          {isArabic ? 'نشط' : 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ISSUES & PROBLEMS CENTER */}
          {activeTab === 'issues' && (
            <div className="space-y-4">
              {/* Add New Issue / Internal Task Box */}
              <form onSubmit={handleAddIssue} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isArabic ? 'تسجيل ملاحظة / بلاغ فني جديد للمتابعة' : 'Record New Issue / Note'}</span>
                </h4>
                <input
                  type="text"
                  placeholder={isArabic ? 'عنوان المشكلة (مثال: فحص جودة سيرفر البث)...' : 'Issue title...'}
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
                <textarea
                  placeholder={isArabic ? 'تفاصيل الملاحظة أو رسالة المستخدم...' : 'Details...'}
                  value={newIssueDesc}
                  onChange={(e) => setNewIssueDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
                <button
                  type="submit"
                  className="min-h-[40px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إضافة إلى قائمة المتابعة' : 'Add to Issue Tracker'}</span>
                </button>
              </form>

              {/* Issues List */}
              <div className="space-y-2.5">
                {issues.map((iss) => {
                  const isResolved = iss.status === 'resolved';
                  const isInProgress = iss.status === 'in_progress';
                  return (
                    <div
                      key={iss.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        isResolved
                          ? 'bg-slate-900/40 border-slate-800 opacity-75'
                          : isInProgress
                          ? 'bg-blue-950/20 border-blue-500/30'
                          : 'bg-amber-950/20 border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className={`text-xs font-bold ${isResolved ? 'line-through text-slate-400' : 'text-white'}`}>
                              {isArabic ? iss.titleAr : iss.titleEn}
                            </h5>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {isArabic ? iss.descriptionAr : iss.descriptionEn}
                          </p>
                        </div>

                        {/* Status Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleIssueStatus(iss.id)}
                          className={`min-h-[34px] px-2.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                            isResolved
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                              : isInProgress
                              ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                              : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                          }`}
                          title={isArabic ? 'انقر لتغيير حالة البلاغ' : 'Click to toggle status'}
                        >
                          {isResolved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{isArabic ? 'تم الحل ✓' : 'Resolved'}</span>
                            </>
                          ) : isInProgress ? (
                            <>
                              <Clock className="w-3 h-3 text-blue-400" />
                              <span>{isArabic ? 'قيد المتابعة' : 'In Progress'}</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              <span>{isArabic ? 'مفتوح (جديد)' : 'Open'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                        <span>👤 {iss.userName}</span>
                        <span>⏰ {iss.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BROADCAST CHANNELS MANAGEMENT */}
          {activeTab === 'channels' && (
            <div className="space-y-4">
              {/* Add / Edit Form */}
              <form onSubmit={handleChannelSubmit} className="space-y-3.5 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إضافة قناة / رابط بث رسمي جديد' : 'Add New Official Channel / Link'}</span>
                </h4>

                {/* Target Match Selector */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    {isArabic ? 'تخصيص القناة للمباراة:' : 'Assign to Match:'}
                  </label>
                  <select
                    value={selectedMatchId}
                    onChange={(e) => setSelectedMatchId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {matches.map((m) => (
                      <option key={m.id} value={m.id}>
                        {isArabic ? `${m.homeTeam.nameAr} vs ${m.awayTeam.nameAr}` : `${m.homeTeam.name} vs ${m.awayTeam.name}`} ({m.leagueName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Channel Names */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      {isArabic ? 'اسم القناة (عربي)' : 'Channel Name (Arabic)'}
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: بي إن سبورتس 1"
                      value={channelNameAr}
                      onChange={(e) => setChannelNameAr(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      {isArabic ? 'اسم القناة (English)' : 'Channel Name (English)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. beIN SPORTS 1"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Commentators */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      {isArabic ? 'اسم المعلق (عربي)' : 'Commentator (Arabic)'}
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: عصام الشوالي"
                      value={commentatorAr}
                      onChange={(e) => setCommentatorAr(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      {isArabic ? 'الجودة' : 'Quality'}
                    </label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="4K HDR">4K HDR</option>
                      <option value="Full HD 1080p">Full HD 1080p</option>
                      <option value="HD 720p">HD 720p</option>
                    </select>
                  </div>
                </div>

                {/* Official Stream Link */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    {isArabic ? 'رابط المنصة الرسمية للبث (URL)' : 'Official Streaming URL'}
                  </label>
                  <input
                    type="url"
                    placeholder="https://tod.tv أو https://shahid.mbc.net"
                    value={officialUrl}
                    onChange={(e) => setOfficialUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-left"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full min-h-[44px] rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-[0.98]'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isArabic ? 'تم حفظ التعديلات ونشرها!' : 'Saved & Published!'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isArabic ? 'حفظ وتحديث دليل المشاهدة' : 'Save & Publish Channel'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Registered Channels */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300">
                  {isArabic ? 'القنوات المعرفة حالياً' : 'Currently Registered Channels'} ({broadcasts.length})
                </h4>
                {broadcasts.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-xl">{b.logo}</span>
                      <div className="truncate">
                        <p className="font-bold text-white truncate">
                          {isArabic ? b.channelNameAr : b.channelName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          🎙️ {isArabic ? b.commentatorAr : b.commentator} · {b.quality}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteBroadcast(b.id)}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title={isArabic ? 'حذف القناة' : 'Delete Channel'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACCESS & DEPLOYMENT LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              {/* Public Subscriber Link */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4" />
                    <span>{isArabic ? 'الرابط العام للمشتركين والجمهور (Shared Production URL)' : 'Public Shared URL'}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    {isArabic ? 'جاهز للنشر والمشاركة' : 'Live Public'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {isArabic
                    ? 'هذا هو الرابط المستقر والمتاح لجميع المشتركين والزوار على الهواتف والكمبيوتر بدون أي أدوات تحكم برمجية.'
                    : 'This is the stable link for all public users and subscribers on mobile and desktop.'}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicAppUrl}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyLink(publicAppUrl, 'public')}
                    className="min-h-[40px] px-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1 whitespace-nowrap shadow-sm"
                  >
                    {copiedLink === 'public' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink === 'public' ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الرابط' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Discreet Owner Access */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
          <span>{isArabic ? 'نظام التحكم والمشاهدة' : 'Control System'}</span>
          {!isAdminAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEarnings?.();
              }}
              className="text-slate-500 hover:text-emerald-400 font-bold flex items-center gap-1 transition-colors"
              title={isArabic ? 'دخول المالك المعتمد' : 'Owner Login'}
            >
              <Lock className="w-3 h-3" />
              <span>{isArabic ? 'دخول المالك المعتمد 🔒' : 'Authorized Owner Login 🔒'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEarnings?.();
              }}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30"
            >
              <span>💰 {isArabic ? 'فتح لوحة الأرباح والسحب' : 'Open Earnings & Payouts'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
