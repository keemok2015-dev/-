import React from 'react';
import { Calendar, Trophy, Tv, Award } from 'lucide-react';

export type TabType = 'matches' | 'standings' | 'broadcast' | 'motm';

interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isArabic: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  isArabic,
}) => {
  const tabs = [
    {
      id: 'matches' as TabType,
      labelAr: 'المباريات',
      labelEn: 'Matches',
      icon: Calendar,
    },
    {
      id: 'standings' as TabType,
      labelAr: 'الترتيب',
      labelEn: 'Tables',
      icon: Trophy,
    },
    {
      id: 'broadcast' as TabType,
      labelAr: 'البث المباشر',
      labelEn: 'Live Broadcast',
      icon: Tv,
    },
    {
      id: 'motm' as TabType,
      labelAr: 'رجل المباراة',
      labelEn: 'MOTM',
      icon: Award,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b101d]/95 backdrop-blur-md border-t border-slate-800/90 pb-safe shadow-lg shadow-black/40">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors relative ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 whitespace-nowrap ${isActive ? 'font-bold text-emerald-400' : 'font-medium'}`}>
                {isArabic ? tab.labelAr : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
