'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Song, Event, Setlist } from '@/types';
import { dummyMembers, dummySongs, dummyEvents, dummySetlists } from '@/data/dummyData';

interface DataContextType {
  members: Member[];
  songs: Song[];
  events: Event[];
  setlists: Setlist[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  addSetlist: (setlist: Setlist) => void;
  updateSetlist: (setlist: Setlist) => void;
  deleteSetlist: (setlistId: string) => void;
  addMember: (member: Member) => void;
  updateMember: (member: Member) => void;
  deleteMember: (memberId: string) => void;
  addSong: (song: Song) => void;
  updateSong: (song: Song) => void;
  deleteSong: (songId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初期化時にダミーデータをロード
  useEffect(() => {
    if (!isLoaded) {
      setMembers(dummyMembers);
      setSongs(dummySongs);
      setEvents(dummyEvents);
      setSetlists(dummySetlists);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const addSetlist = (setlist: Setlist) => {
    setSetlists([...setlists, setlist]);
  };

  const updateSetlist = (updatedSetlist: Setlist) => {
    setSetlists(setlists.map(s => s.id === updatedSetlist.id ? updatedSetlist : s));
  };

  const deleteSetlist = (setlistId: string) => {
    setSetlists(setlists.filter(s => s.id !== setlistId));
  };

  const addMember = (member: Member) => {
    setMembers([...members, member]);
  };

  const updateMember = (updatedMember: Member) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const deleteMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const addSong = (song: Song) => {
    setSongs([...songs, song]);
  };

  const updateSong = (updatedSong: Song) => {
    setSongs(songs.map(s => s.id === updatedSong.id ? updatedSong : s));
  };

  const deleteSong = (songId: string) => {
    setSongs(songs.filter(s => s.id !== songId));
  };

  const value: DataContextType = {
    members,
    songs,
    events,
    setlists,
    addEvent,
    updateEvent,
    deleteEvent,
    addSetlist,
    updateSetlist,
    deleteSetlist,
    addMember,
    updateMember,
    deleteMember,
    addSong,
    updateSong,
    deleteSong
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
