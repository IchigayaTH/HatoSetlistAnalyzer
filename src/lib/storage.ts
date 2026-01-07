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
export const loadData = async (): Promise<StorageData> => {
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
export const saveData = async (data: StorageData): Promise<void> => {
  const filePath = getDataFilePath();
  
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving data to storage:', error);
    throw error;
  }
};

// Get all data
export const getAllData = async (): Promise<StorageData> => {
  return loadData();
};

// Member operations
export const addMember = async (member: Member): Promise<StorageData> => {
  const data = await loadData();
  data.members.push(member);
  await saveData(data);
  return data;
};

export const updateMember = async (member: Member): Promise<StorageData> => {
  const data = await loadData();
  data.members = data.members.map(m => m.id === member.id ? member : m);
  await saveData(data);
  return data;
};

export const deleteMember = async (memberId: string): Promise<StorageData> => {
  const data = await loadData();
  data.members = data.members.filter(m => m.id !== memberId);
  await saveData(data);
  return data;
};

// Song operations
export const addSong = async (song: Song): Promise<StorageData> => {
  const data = await loadData();
  data.songs.push(song);
  await saveData(data);
  return data;
};

export const updateSong = async (song: Song): Promise<StorageData> => {
  const data = await loadData();
  data.songs = data.songs.map(s => s.id === song.id ? song : s);
  await saveData(data);
  return data;
};

export const deleteSong = async (songId: string): Promise<StorageData> => {
  const data = await loadData();
  data.songs = data.songs.filter(s => s.id !== songId);
  await saveData(data);
  return data;
};

// Event operations
export const addEvent = async (event: Event): Promise<StorageData> => {
  const data = await loadData();
  data.events.push(event);
  await saveData(data);
  return data;
};

export const updateEvent = async (event: Event): Promise<StorageData> => {
  const data = await loadData();
  data.events = data.events.map(e => e.id === event.id ? event : e);
  await saveData(data);
  return data;
};

export const deleteEvent = async (eventId: string): Promise<StorageData> => {
  const data = await loadData();
  data.events = data.events.filter(e => e.id !== eventId);
  await saveData(data);
  return data;
};

// Setlist operations
export const addSetlist = async (setlist: Setlist): Promise<StorageData> => {
  const data = await loadData();
  data.setlists.push(setlist);
  await saveData(data);
  return data;
};

export const updateSetlist = async (setlist: Setlist): Promise<StorageData> => {
  const data = await loadData();
  data.setlists = data.setlists.map(s => s.id === setlist.id ? setlist : s);
  await saveData(data);
  return data;
};

export const deleteSetlist = async (setlistId: string): Promise<StorageData> => {
  const data = await loadData();
  data.setlists = data.setlists.filter(s => s.id !== setlistId);
  await saveData(data);
  return data;
};
