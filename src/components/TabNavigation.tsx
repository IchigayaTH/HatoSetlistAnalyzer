'use client';

import React from 'react';
import { TabType } from '@/types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'events', label: 'Events', icon: 'calendar' },
    { id: 'setlist', label: 'Setlist', icon: 'music' },
    { id: 'dashboard', label: 'Dashboard', icon: 'chart' },
    { id: 'prediction', label: 'Predict', icon: 'magic' },
    { id: 'masters', label: 'Masters', icon: 'settings' },
  ];

  return (
    <>
      <nav className="hidden lg:flex lg:flex-col lg:w-64 bg-pink-100 border-r-2 border-pink-200 p-4">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 shadow-md border-l-4 border-red-500'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-pink-200 z-40">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-3 text-center transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-t-4 border-red-500 text-red-600 font-bold'
                  : 'text-gray-500'
              }`}
            >
              <div>{tab.icon}</div>
              <div className="text-xs mt-1">{tab.label}</div>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default TabNavigation;
