'use client';

import React, { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import EventsTab from '@/components/tabs/EventsTab';
import SetlistTab from '@/components/tabs/SetlistTab';
import DashboardTab from '@/components/tabs/DashboardTab';
import PredictionTab from '@/components/tabs/PredictionTab';
import MastersTab from '@/components/tabs/MastersTab';
import { TabType } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('events');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        return <EventsTab />;
      case 'setlist':
        return <SetlistTab />;
      case 'dashboard':
        return <DashboardTab />;
      case 'prediction':
        return <PredictionTab />;
      case 'masters':
        return <MastersTab />;
      default:
        return <EventsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-pink-600 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">HatoBito</h1>
          <p className="text-sm text-white/90 mt-1">Setlist Analyzer</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
