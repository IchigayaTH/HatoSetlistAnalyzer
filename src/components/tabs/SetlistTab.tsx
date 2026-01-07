'use client';

import React, { useState, useMemo } from 'react';
import { useData } from '@/components/DataProvider';
import { SetlistSong } from '@/types';

export default function SetlistTab() {
  const { events, songs, members, setlists, addSetlist, updateSetlist, deleteSetlist } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedSongs, setSelectedSongs] = useState<SetlistSong[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedSongId, setExpandedSongId] = useState<string | null>(null);

  const sortedSetlists = useMemo(() => {
    const sorted = [...setlists].sort((a, b) => {
      const eventA = events.find(e => e.id === a.eventId);
      const eventB = events.find(e => e.id === b.eventId);
      const dateA = eventA ? new Date(eventA.date).getTime() : 0;
      const dateB = eventB ? new Date(eventB.date).getTime() : 0;
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [setlists, events, sortOrder]);

  const handleAddClick = () => {
    setEditingId(null);
    setSelectedEventId('');
    setSelectedSongs([]);
    setExpandedSongId(null);
    setIsFormOpen(true);
  };

  const handleSongToggle = (songId: string) => {
    const isSelected = selectedSongs.some(s => s.songId === songId);
    if (isSelected) {
      setSelectedSongs(selectedSongs.filter(s => s.songId !== songId));
    } else {
      const song = songs.find(s => s.id === songId);
      if (song) {
        setSelectedSongs([...selectedSongs, {
          songId: song.id,
          selectedMembers: song.defaultSelectMembers,
          notes: '',
        }]);
      }
    }
  };

  const handleMemberToggle = (songId: string, memberId: string) => {
    setSelectedSongs(selectedSongs.map(s => {
      if (s.songId === songId) {
        const hasMember = s.selectedMembers.includes(memberId);
        return {
          ...s,
          selectedMembers: hasMember
            ? s.selectedMembers.filter(m => m !== memberId)
            : [...s.selectedMembers, memberId]
        };
      }
      return s;
    }));
  };

  const handleMoveSong = (index: number, direction: 'up' | 'down') => {
    const newSongs = [...selectedSongs];
    if (direction === 'up' && index > 0) {
      [newSongs[index], newSongs[index - 1]] = [newSongs[index - 1], newSongs[index]];
    } else if (direction === 'down' && index < newSongs.length - 1) {
      [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]];
    }
    setSelectedSongs(newSongs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || selectedSongs.length === 0) {
      alert('Select event and at least one song');
      return;
    }

    if (editingId) {
      updateSetlist({
        id: editingId,
        eventId: selectedEventId,
        songs: selectedSongs,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      addSetlist({
        id: `sl${Date.now()}`,
        eventId: selectedEventId,
        songs: selectedSongs,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-pink-600">Setlist Management</h2>
        <button
          onClick={handleAddClick}
          className="hato-btn-primary"
        >
          + New Setlist
        </button>
      </div>

      {isFormOpen && (
        <div className="hato-card">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Setlist' : 'New Setlist'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Select Event *</label>
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

            {selectedEventId && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2">Songs in Setlist ({selectedSongs.length})</label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {songs.map((song) => {
                      const selectedSong = selectedSongs.find(s => s.songId === song.id);
                      const isSelected = selectedSong !== undefined;
                      const orderNumber = selectedSongs.findIndex(s => s.songId === song.id) + 1;
                      return (
                        <div key={song.id} className="border border-pink-200 rounded p-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSongToggle(song.id)}
                              className="rounded"
                            />
                            <span className="text-sm font-semibold flex-1">{song.titleJa}</span>
                            {isSelected && (
                              <span className="bg-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold min-w-max">
                                #{orderNumber}
                              </span>
                            )}
                          </label>
                          
                          {isSelected && (
                            <div className="mt-3 ml-6 space-y-3 border-l-2 border-pink-200 pl-3">
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setExpandedSongId(expandedSongId === song.id ? null : song.id)}
                                  className="text-xs font-semibold text-pink-600 hover:text-pink-800 mb-2"
                                >
                                  {expandedSongId === song.id ? '▼ Select Members' : '▶ Select Members'}
                                </button>
                                
                                {expandedSongId === song.id && (
                                  <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto p-2 bg-pink-50 rounded">
                                    {members.filter(m => m.status === 'active').map((member) => {
                                      const isMemberSelected = selectedSong.selectedMembers.includes(member.id);
                                      return (
                                        <label key={member.id} className="flex items-center gap-2 cursor-pointer text-xs">
                                          <input
                                            type="checkbox"
                                            checked={isMemberSelected}
                                            onChange={() => handleMemberToggle(song.id, member.id)}
                                            className="rounded"
                                          />
                                          <span>{member.nameJa}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              <div className="text-xs text-gray-600">
                                {selectedSong.selectedMembers.length > 0 && (
                                  <p>👥 {selectedSong.selectedMembers.map(mid => members.find(m => m.id === mid)?.nameJa).join(', ')}</p>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleMoveSong(orderNumber - 1, 'up')}
                                  disabled={orderNumber === 1}
                                  className="px-2 py-1 text-xs font-semibold bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSong(orderNumber - 1, 'down')}
                                  disabled={orderNumber === selectedSongs.length}
                                  className="px-2 py-1 text-xs font-semibold bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                                >
                                  ↓
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="hato-btn-primary flex-1"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="hato-btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-700">Setlists</h3>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="text-sm font-semibold px-3 py-1 rounded border-2 border-pink-300 text-pink-600 hover:bg-pink-50 transition-all"
          >
            {sortOrder === 'desc' ? '📅 Newest First' : '📅 Oldest First'}
          </button>
        </div>
        {setlists.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No setlists yet</p>
        ) : (
          <div className="space-y-3">
            {sortedSetlists.map((setlist) => {
              const event = events.find(e => e.id === setlist.eventId);
              return (
                <div key={setlist.id} className="hato-card">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-pink-600">{event?.name}</h4>
                      <p className="text-sm text-gray-600">{event?.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteSetlist(setlist.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {setlist.songs.map((s, idx) => {
                      const song = songs.find(song => song.id === s.songId);
                      const songMembers = s.selectedMembers.map(mid => members.find(m => m.id === mid)?.nameJa).filter(Boolean);
                      return (
                        <div key={idx} className="text-sm text-gray-700 p-2 bg-pink-50 rounded">
                          <p className="font-semibold">{idx + 1}. {song?.titleJa}</p>
                          {songMembers.length > 0 && (
                            <p className="text-xs text-gray-600 mt-1">👥 {songMembers.join(', ')}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
