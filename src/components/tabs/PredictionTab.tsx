'use client';

import React, { useState, useMemo } from 'react';
import { useData } from '@/components/DataProvider';

export default function PredictionTab() {
  const { events, songs, setlists, members } = useData();
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  const predictions = useMemo(() => {
    if (!selectedEventId) return null;

    const selectedEvent = events.find(e => e.id === selectedEventId);
    if (!selectedEvent) return null;

    const songPredictions = songs
      .map((song) => {
        const defaultMembers = song.defaultSelectMembers;
        const participatingDefaultMembers = defaultMembers.filter(m =>
          selectedEvent.participatingMembers.includes(m)
        );
        const adoptionRate = setlists.filter(sl =>
          sl.songs.some(s => s.songId === song.id)
        ).length / Math.max(setlists.length, 1);

        return {
          songId: song.id,
          title: song.titleJa,
          defaultMembers,
          participatingMembers: participatingDefaultMembers,
          availabilityRate: (participatingDefaultMembers.length / defaultMembers.length * 100),
          adoptionRate: adoptionRate * 100,
          predictionScore:
            (participatingDefaultMembers.length / defaultMembers.length) * 0.7 +
            adoptionRate * 0.3,
        };
      })
      .filter(s => s.availabilityRate >= 60)
      .sort((a, b) => b.predictionScore - a.predictionScore)
      .slice(0, 4);

    return {
      event: selectedEvent,
      predictions: songPredictions,
    };
  }, [selectedEventId, events, songs, setlists]);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h2 className="text-3xl font-bold text-pink-600 mb-2">Setlist Prediction</h2>
        <p className="text-gray-600">Predict setlist based on participating members and past adoption rates</p>
      </div>

      <div className="hato-card">
        <label className="block text-sm font-semibold mb-2">Select Event</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
        >
          <option value="">-- Select Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.date} - {event.name}
            </option>
          ))}
        </select>
      </div>

      {predictions && (
        <div className="space-y-6">
          <div className="hato-card">
            <h3 className="text-xl font-bold text-red-600 mb-3">Event Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-bold text-pink-600">{predictions.event.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-bold text-gray-700">{predictions.event.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Venue</p>
                <p className="font-bold text-gray-700">{predictions.event.venue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Members</p>
                <p className="font-bold text-gray-700">{predictions.event.participatingMembers.length} / {members.length}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-600">Predicted Setlist</h3>
            {predictions.predictions.length === 0 ? (
              <div className="hato-card text-center py-8">
                <p className="text-gray-500">
                  No suitable songs for participating members
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {predictions.predictions.map((prediction, index) => (
                  <div key={prediction.songId} className="hato-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-pink-600">
                          {index + 1}. {prediction.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Prediction Score: {(prediction.predictionScore * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Member Availability</p>
                        <p className="font-bold text-pink-600">
                          {prediction.participatingMembers.length}/{prediction.defaultMembers.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Past Adoption</p>
                        <p className="font-bold text-red-600">
                          {prediction.adoptionRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-pink-600 h-3 rounded-full transition-all"
                        style={{ width: `${prediction.predictionScore * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
