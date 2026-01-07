'use server';

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Member, Song, Event, Setlist } from '@/types';

interface StorageData {
  members: Member[];
  songs: Song[];
  events: Event[];
  setlists: Setlist[];
}

// Get the data file path
const getDataFilePath = (): string => {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  return join(dataDir, 'storage.json');
};

// Load data from file
export const loadData = (): StorageData => {
  const filePath = getDataFilePath();
  
  try {
    if (existsSync(filePath)) {
      const fileContent = readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error loading data from storage:', error);
  }

  // Return empty structure if file doesn't exist or error occurred
  return {
    members: [],
    songs: [],
    events: [],
    setlists: []
  };
};

// Save data to file
export const saveData = (data: StorageData): void => {
  const filePath = getDataFilePath();
  
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving data to storage:', error);
    throw error;
  }
};

// Get all data
export const getAllData = (): StorageData => {
  return loadData();
};

// Member operations
export const addMember = (member: Member): StorageData => {
  const data = loadData();
  data.members.push(member);
  saveData(data);
  return data;
};

export const updateMember = (member: Member): StorageData => {
  const data = loadData();
  data.members = data.members.map(m => m.id === member.id ? member : m);
  saveData(data);
  return data;
};

export const deleteMember = (memberId: string): StorageData => {
  const data = loadData();
  data.members = data.members.filter(m => m.id !== memberId);
  saveData(data);
  return data;
};

// Song operations
export const addSong = (song: Song): StorageData => {
  const data = loadData();
  data.songs.push(song);
  saveData(data);
  return data;
};

export const updateSong = (song: Song): StorageData => {
  const data = loadData();
  data.songs = data.songs.map(s => s.id === song.id ? song : s);
  saveData(data);
  return data;
};

export const deleteSong = (songId: string): StorageData => {
  const data = loadData();
  data.songs = data.songs.filter(s => s.id !== songId);
  saveData(data);
  return data;
};

// Event operations
export const addEvent = (event: Event): StorageData => {
  const data = loadData();
  data.events.push(event);
  saveData(data);
  return data;
};

export const updateEvent = (event: Event): StorageData => {
  const data = loadData();
  data.events = data.events.map(e => e.id === event.id ? event : e);
  saveData(data);
  return data;
};

export const deleteEvent = (eventId: string): StorageData => {
  const data = loadData();
  data.events = data.events.filter(e => e.id !== eventId);
  saveData(data);
  return data;
};

// Setlist operations
export const addSetlist = (setlist: Setlist): StorageData => {
  const data = loadData();
  data.setlists.push(setlist);
  saveData(data);
  return data;
};

export const updateSetlist = (setlist: Setlist): StorageData => {
  const data = loadData();
  data.setlists = data.setlists.map(s => s.id === setlist.id ? setlist : s);
  saveData(data);
  return data;
};

export const deleteSetlist = (setlistId: string): StorageData => {
  const data = loadData();
  data.setlists = data.setlists.filter(s => s.id !== setlistId);
  saveData(data);
  return data;
};
