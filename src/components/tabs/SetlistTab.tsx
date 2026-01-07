'use client';

import React, { useState, useMemo } from 'react';
import { useData } from '@/components/DataProvider';
import { SetlistSong } from '@/types';

type FormTab = 'songs' | 'setlist' | 'members';

export default function SetlistTab() {
  const { events, songs, members, setlists, addSetlist, updateSetlist, deleteSetlist } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedSongs, setSelectedSongs] = useState<SetlistSong[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedDetailSongId, setSelectedDetailSongId] = useState<string | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<FormTab>('songs');

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
    setSelectedDetailSongId(null);
    setActiveFormTab('songs');
    setIsFormOpen(true);
  };

  const handleSongToggle = (songId: string) => {
    const isSelected = selectedSongs.some(s => s.songId === songId);
    if (isSelected) {
      setSelectedSongs(selectedSongs.filter(s => s.songId !== songId));
      if (selectedDetailSongId === songId) {
        setSelectedDetailSongId(null);
      }
    } else {
      const song = songs.find(s => s.id === songId);
      if (song) {
        setSelectedSongs([...selectedSongs, {
          songId: song.id,
          selectedMembers: song.defaultSelectMembers,
          notes: '',
        }]);
        setSelectedDetailSongId(songId);
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

  const selectedDetailSong = selectedDetailSongId 
    ? songs.find(s => s.id === selectedDetailSongId) 
    : null;
  const selectedDetailSongData = selectedDetailSongId
    ? selectedSongs.find(s => s.songId === selectedDetailSongId)
    : null;

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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full h-5/6 max-w-7xl flex flex-col">
            {/* Header */}
            <div className="border-b border-pink-200 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-pink-600">
                {editingId ? 'Edit Setlist' : 'New Setlist'}
              </h3>
            </div>

            {/* Main Content */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden p-4 lg:p-6 gap-4">
              {/* Event Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Select Event *</label>
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
                  {/* PC Layout: 3-panel layout (lg and above) */}
                  <div className="hidden lg:flex flex-1 overflow-hidden gap-4">
                    {/* Left Panel: Available Songs */}
                    <div className="flex-1 flex flex-col border-2 border-pink-200 rounded-lg overflow-hidden">
                      <div className="bg-pink-100 px-4 py-3 border-b border-pink-200">
                        <h4 className="font-bold text-pink-700">Available Songs</h4>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <div className="space-y-2 p-4">
                          {songs.map((song) => {
                            const isSelected = selectedSongs.some(s => s.songId === song.id);
                            const orderNumber = selectedSongs.findIndex(s => s.songId === song.id) + 1;
                            return (
                              <label
                                key={song.id}
                                className={`flex items-center gap-3 p-3 rounded cursor-pointer border-2 transition-all ${
                                  isSelected
                                    ? 'border-pink-500 bg-pink-50'
                                    : 'border-gray-200 bg-white hover:border-pink-300'
                                }`}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedDetailSongId(song.id);
                                  }
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSongToggle(song.id)}
                                  className="rounded cursor-pointer"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm text-gray-800 truncate">
                                    {song.titleJa}
                                  </p>
                                </div>
                                {isSelected && (
                                  <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                    #{orderNumber}
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Middle Panel: Selected Setlist */}
                    <div className="w-64 flex flex-col border-2 border-blue-200 rounded-lg overflow-hidden">
                      <div className="bg-blue-100 px-4 py-3 border-b border-blue-200">
                        <h4 className="font-bold text-blue-700">Setlist ({selectedSongs.length})</h4>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {selectedSongs.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4 text-center">
                            Select songs from the left to build your setlist
                          </div>
                        ) : (
                          <div className="space-y-2 p-4">
                            {selectedSongs.map((setlistSong, index) => {
                              const songData = songs.find(s => s.id === setlistSong.songId);
                              return (
                                <div
                                  key={setlistSong.songId}
                                  className={`p-3 rounded border-2 cursor-pointer transition-all ${
                                    selectedDetailSongId === setlistSong.songId
                                      ? 'border-orange-500 bg-orange-50'
                                      : 'border-gray-200 bg-white hover:border-gray-300'
                                  }`}
                                  onClick={() => setSelectedDetailSongId(setlistSong.songId)}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-sm text-gray-800 truncate">
                                        #{index + 1}
                                      </p>
                                      <p className="text-xs text-gray-600 truncate">
                                        {songData?.titleJa}
                                      </p>
                                    </div>
                                    <div className="flex gap-1 flex-shrink-0">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMoveSong(index, 'up');
                                        }}
                                        disabled={index === 0}
                                        className="px-1.5 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                                      >
                                        ↑
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMoveSong(index, 'down');
                                        }}
                                        disabled={index === selectedSongs.length - 1}
                                        className="px-1.5 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                                      >
                                        ↓
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel: Member Selection */}
                    {selectedDetailSongData && selectedDetailSong && (
                      <div className="w-80 flex flex-col border-2 border-green-200 rounded-lg overflow-hidden">
                        <div className="bg-green-100 px-4 py-3 border-b border-green-200">
                          <h4 className="font-bold text-green-700 text-sm truncate">
                            {selectedDetailSong.titleJa}
                          </h4>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          <div className="p-4 space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-2">
                                Select Members ({selectedDetailSongData.selectedMembers.length})
                              </p>
                              <div className="space-y-2">
                                {members
                                  .filter(m => m.status === 'active')
                                  .map((member) => {
                                    const isMemberSelected = selectedDetailSongData.selectedMembers.includes(
                                      member.id
                                    );
                                    return (
                                      <label
                                        key={member.id}
                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all ${
                                          isMemberSelected
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isMemberSelected}
                                          onChange={() => handleMemberToggle(selectedDetailSong.id, member.id)}
                                          className="rounded cursor-pointer"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                          {member.nameJa}
                                        </span>
                                      </label>
                                    );
                                  })}
                              </div>
                            </div>

                            {selectedDetailSongData.selectedMembers.length > 0 && (
                              <div className="border-t border-gray-200 pt-3">
                                <p className="text-xs font-semibold text-gray-600 mb-2">Selected:</p>
                                <div className="flex flex-wrap gap-1">
                                  {selectedDetailSongData.selectedMembers.map((memberId) => {
                                    const member = members.find(m => m.id === memberId);
                                    return (
                                      <span
                                        key={memberId}
                                        className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
                                      >
                                        {member?.nameJa}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Layout: Tab-based interface (below lg) */}
                  <div className="flex lg:hidden flex-col flex-1 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex gap-2 border-b border-gray-200">
                      <button
                        type="button"
                        onClick={() => setActiveFormTab('songs')}
                        className={`flex-1 py-3 font-semibold text-sm transition-all ${
                          activeFormTab === 'songs'
                            ? 'border-b-2 border-pink-500 text-pink-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        📋 Songs ({selectedSongs.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveFormTab('setlist')}
                        className={`flex-1 py-3 font-semibold text-sm transition-all ${
                          activeFormTab === 'setlist'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        🎵 Setlist
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveFormTab('members')}
                        disabled={selectedSongs.length === 0}
                        className={`flex-1 py-3 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          activeFormTab === 'members'
                            ? 'border-b-2 border-green-500 text-green-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        👥 Members
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto">
                      {/* Songs Tab */}
                      {activeFormTab === 'songs' && (
                        <div className="space-y-2 p-4">
                          {songs.map((song) => {
                            const isSelected = selectedSongs.some(s => s.songId === song.id);
                            const orderNumber = selectedSongs.findIndex(s => s.songId === song.id) + 1;
                            return (
                              <label
                                key={song.id}
                                className={`flex items-center gap-3 p-3 rounded cursor-pointer border-2 transition-all ${
                                  isSelected
                                    ? 'border-pink-500 bg-pink-50'
                                    : 'border-gray-200 bg-white hover:border-pink-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSongToggle(song.id)}
                                  className="rounded cursor-pointer flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm text-gray-800 truncate">
                                    {song.titleJa}
                                  </p>
                                </div>
                                {isSelected && (
                                  <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0">
                                    #{orderNumber}
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Setlist Tab */}
                      {activeFormTab === 'setlist' && (
                        <div className="space-y-2 p-4">
                          {selectedSongs.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4 text-center">
                              Select songs in the Songs tab to build your setlist
                            </div>
                          ) : (
                            <>
                              {selectedSongs.map((setlistSong, index) => {
                                const songData = songs.find(s => s.id === setlistSong.songId);
                                return (
                                  <div
                                    key={setlistSong.songId}
                                    className={`p-4 rounded border-2 cursor-pointer transition-all ${
                                      selectedDetailSongId === setlistSong.songId
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedDetailSongId(setlistSong.songId)}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg text-gray-800">
                                          #{index + 1}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {songData?.titleJa}
                                        </p>
                                      </div>
                                      <div className="flex gap-2 flex-shrink-0">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMoveSong(index, 'up');
                                          }}
                                          disabled={index === 0}
                                          className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded font-semibold"
                                        >
                                          ↑
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMoveSong(index, 'down');
                                          }}
                                          disabled={index === selectedSongs.length - 1}
                                          className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded font-semibold"
                                        >
                                          ↓
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      )}

                      {/* Members Tab */}
                      {activeFormTab === 'members' && (
                        <div className="space-y-4 p-4">
                          {selectedSongs.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm py-8">
                              Select songs to assign members
                            </div>
                          ) : (
                            <>
                              {selectedSongs.map((setlistSong, index) => {
                                const songData = songs.find(s => s.id === setlistSong.songId);
                                return (
                                  <div key={setlistSong.songId} className="border-2 border-gray-200 rounded-lg p-4">
                                    <div className="mb-3">
                                      <p className="font-bold text-lg text-gray-800">
                                        #{index + 1} {songData?.titleJa}
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      {members
                                        .filter(m => m.status === 'active')
                                        .map((member) => {
                                          const isMemberSelected = setlistSong.selectedMembers.includes(member.id);
                                          return (
                                            <label
                                              key={member.id}
                                              className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all ${
                                                isMemberSelected
                                                  ? 'border-green-400 bg-green-50'
                                                  : 'border-gray-200 bg-white hover:border-gray-300'
                                              }`}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={isMemberSelected}
                                                onChange={() => handleMemberToggle(setlistSong.songId, member.id)}
                                                className="rounded cursor-pointer flex-shrink-0"
                                              />
                                              <span className="text-sm font-medium text-gray-700">
                                                {member.nameJa}
                                              </span>
                                            </label>
                                          );
                                        })}
                                    </div>
                                    {setlistSong.selectedMembers.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-xs font-semibold text-gray-600 mb-2">Selected:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {setlistSong.selectedMembers.map((memberId) => {
                                            const member = members.find(m => m.id === memberId);
                                            return (
                                              <span
                                                key={memberId}
                                                className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
                                              >
                                                {member?.nameJa}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Footer Buttons */}
              <div className="border-t border-pink-200 pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="hato-btn-secondary px-6 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hato-btn-primary px-6 py-2"
                >
                  Save Setlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Setlist Display */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {setlist.songs.map((s, idx) => {
                      const song = songs.find(song => song.id === s.songId);
                      const songMembers = s.selectedMembers
                        .map(mid => members.find(m => m.id === mid)?.nameJa)
                        .filter(Boolean);
                      return (
                        <div key={idx} className="text-sm text-gray-700 p-3 bg-pink-50 rounded">
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
