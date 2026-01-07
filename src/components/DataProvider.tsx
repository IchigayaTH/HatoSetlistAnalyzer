'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Song, Event, Setlist } from '@/types';

interface DataContextType {
  members: Member[];
  songs: Song[];
  events: Event[];
  setlists: Setlist[];
  isLoading: boolean;
  addEvent: (event: Event) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  addSetlist: (setlist: Setlist) => Promise<void>;
  updateSetlist: (setlist: Setlist) => Promise<void>;
  deleteSetlist: (setlistId: string) => Promise<void>;
  addMember: (member: Member) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
  addSong: (song: Song) => Promise<void>;
  updateSong: (song: Song) => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize storage and load data from server
  useEffect(() => {
    const initializeAndLoadData = async () => {
      try {
        setIsLoading(true);
        
        // Try to load data from server
        const responses = await Promise.all([
          fetch('/api/members').catch(() => null),
          fetch('/api/songs').catch(() => null),
          fetch('/api/events').catch(() => null),
          fetch('/api/setlists').catch(() => null)
        ]);

        const [membersRes, songsRes, eventsRes, setlistsRes] = responses;

        let membersData: Member[] = [];
        let songsData: Song[] = [];
        let eventsData: Event[] = [];
        let setlistsData: Setlist[] = [];

        // Parse responses
        if (membersRes?.ok) {
          try {
            membersData = await membersRes.json();
          } catch (e) {
            console.error('Error parsing members:', e);
          }
        }
        if (songsRes?.ok) {
          try {
            songsData = await songsRes.json();
          } catch (e) {
            console.error('Error parsing songs:', e);
          }
        }
        if (eventsRes?.ok) {
          try {
            eventsData = await eventsRes.json();
          } catch (e) {
            console.error('Error parsing events:', e);
          }
        }
        if (setlistsRes?.ok) {
          try {
            setlistsData = await setlistsRes.json();
          } catch (e) {
            console.error('Error parsing setlists:', e);
          }
        }

        // If data is empty, initialize with dummy data
        if (membersData.length === 0 && songsData.length === 0 && eventsData.length === 0 && setlistsData.length === 0) {
          console.log('Data is empty, initializing with dummy data...');
          try {
            const initRes = await fetch('/api/init', { method: 'POST' });
            if (initRes.ok) {
              console.log('Storage initialized, fetching data again...');
              const initResponses = await Promise.all([
                fetch('/api/members').catch(() => null),
                fetch('/api/songs').catch(() => null),
                fetch('/api/events').catch(() => null),
                fetch('/api/setlists').catch(() => null)
              ]);
              
              const [newMembersRes, newSongsRes, newEventsRes, newSetlistsRes] = initResponses;
              
              if (newMembersRes?.ok) {
                membersData = await newMembersRes.json();
              }
              if (newSongsRes?.ok) {
                songsData = await newSongsRes.json();
              }
              if (newEventsRes?.ok) {
                eventsData = await newEventsRes.json();
              }
              if (newSetlistsRes?.ok) {
                setlistsData = await newSetlistsRes.json();
              }
            } else {
              console.error('Failed to initialize storage:', initRes.status);
            }
          } catch (initError) {
            console.error('Error initializing storage:', initError);
          }
        }

        console.log('Loaded data:', { members: membersData.length, songs: songsData.length, events: eventsData.length, setlists: setlistsData.length });
        
        setMembers(membersData);
        setSongs(songsData);
        setEvents(eventsData);
        setSetlists(setlistsData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty arrays as fallback
        setMembers([]);
        setSongs([]);
        setEvents([]);
        setSetlists([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAndLoadData();
  }, []);

  const addEvent = async (event: Event) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      if (response.ok) {
        const updatedEvents = await response.json();
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent)
      });
      if (response.ok) {
        const updatedEvents = await response.json();
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      if (response.ok) {
        const updatedEvents = await response.json();
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const addSetlist = async (setlist: Setlist) => {
    try {
      const response = await fetch('/api/setlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setlist)
      });
      if (response.ok) {
        const updatedSetlists = await response.json();
        setSetlists(updatedSetlists);
      }
    } catch (error) {
      console.error('Error adding setlist:', error);
    }
  };

  const updateSetlist = async (updatedSetlist: Setlist) => {
    try {
      const response = await fetch('/api/setlists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSetlist)
      });
      if (response.ok) {
        const updatedSetlists = await response.json();
        setSetlists(updatedSetlists);
      }
    } catch (error) {
      console.error('Error updating setlist:', error);
    }
  };

  const deleteSetlist = async (setlistId: string) => {
    try {
      const response = await fetch('/api/setlists', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setlistId })
      });
      if (response.ok) {
        const updatedSetlists = await response.json();
        setSetlists(updatedSetlists);
      }
    } catch (error) {
      console.error('Error deleting setlist:', error);
    }
  };

  const addMember = async (member: Member) => {
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      if (response.ok) {
        const updatedMembers = await response.json();
        setMembers(updatedMembers);
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const updateMember = async (updatedMember: Member) => {
    try {
      const response = await fetch('/api/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMember)
      });
      if (response.ok) {
        const updatedMembers = await response.json();
        setMembers(updatedMembers);
      }
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      const response = await fetch('/api/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
      });
      if (response.ok) {
        const updatedMembers = await response.json();
        setMembers(updatedMembers);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const addSong = async (song: Song) => {
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
      });
      if (response.ok) {
        const updatedSongs = await response.json();
        setSongs(updatedSongs);
      }
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const updateSong = async (updatedSong: Song) => {
    try {
      const response = await fetch('/api/songs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSong)
      });
      if (response.ok) {
        const updatedSongs = await response.json();
        setSongs(updatedSongs);
      }
    } catch (error) {
      console.error('Error updating song:', error);
    }
  };

  const deleteSong = async (songId: string) => {
    try {
      const response = await fetch('/api/songs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId })
      });
      if (response.ok) {
        const updatedSongs = await response.json();
        setSongs(updatedSongs);
      }
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const value: DataContextType = {
    members,
    songs,
    events,
    setlists,
    isLoading,
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
