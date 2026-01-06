'use client';

import React, { useMemo } from 'react';
import { useData } from '@/components/DataProvider';

export default function DashboardTab() {
  const { songs, setlists, members } = useData();

  const stats = useMemo(() => {
    const songStats = songs.map((song) => {
      const performances = setlists.filter(sl =>
        sl.songs.some(s => s.songId === song.id)
      ).length;
      return {
        songId: song.id,
        title: song.titleJa,
        performances,
        adoptionRate: setlists.length > 0 ? (performances / setlists.length * 100).toFixed(1) : 0,
      };
    }).sort((a, b) => b.performances - a.performances);

    const memberStats = members.map((member) => {
      let participationCount = 0;
      let totalOpportunities = 0;

      setlists.forEach((setlist) => {
        setlist.songs.forEach((song) => {
          totalOpportunities += 1;
          if (song.selectedMembers.includes(member.id)) {
            participationCount += 1;
          }
        });
      });

      return {
        memberId: member.id,
        name: member.nameJa,
        participationCount,
        participationRate: totalOpportunities > 0 ? (participationCount / totalOpportunities * 100).toFixed(1) : 0,
      };
    }).sort((a, b) => parseInt(b.participationRate.toString()) - parseInt(a.participationRate.toString()));

    return { songStats, memberStats };
  }, [songs, setlists, members]);

  return (
    <div className="space-y-8 pb-20 lg:pb-6">
      <div>
        <h2 className="text-3xl font-bold text-pink-600 mb-6">Dashboard</h2>
        <p className="text-gray-600">Statistics based on setlist performances</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-red-600">Song Adoption Rate</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stats.songStats.length === 0 ? (
            <p className="text-gray-500 col-span-full">No data</p>
          ) : (
            stats.songStats.map((stat) => (
              <div key={stat.songId} className="hato-card">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-pink-600">{stat.title}</h4>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">
                    {stat.adoptionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-pink-600 h-3 rounded-full transition-all"
                    style={{ width: `${stat.adoptionRate}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{stat.performances} / {setlists.length}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-red-600">Member Participation Rate</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stats.memberStats.length === 0 ? (
            <p className="text-gray-500 col-span-full">No data</p>
          ) : (
            stats.memberStats.map((stat) => (
              <div key={stat.memberId} className="hato-card">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-pink-600">{stat.name}</h4>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">
                    {stat.participationRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-pink-600 h-3 rounded-full transition-all"
                    style={{ width: `${stat.participationRate}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{stat.participationCount} performances</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="hato-card text-center">
          <p className="text-3xl font-bold text-pink-600">{setlists.length}</p>
          <p className="text-gray-600 text-sm">Total Setlists</p>
        </div>
        <div className="hato-card text-center">
          <p className="text-3xl font-bold text-red-600">{songs.length}</p>
          <p className="text-gray-600 text-sm">Songs</p>
        </div>
        <div className="hato-card text-center">
          <p className="text-3xl font-bold text-pink-600">{members.length}</p>
          <p className="text-gray-600 text-sm">Members</p>
        </div>
        <div className="hato-card text-center">
          <p className="text-3xl font-bold text-red-600">
            {stats.songStats.filter(s => parseInt(s.adoptionRate.toString()) >= 50).length}
          </p>
          <p className="text-gray-600 text-sm">50%+ Adoption</p>
        </div>
      </div>
    </div>
  );
}
