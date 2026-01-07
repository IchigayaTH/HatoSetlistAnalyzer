'use server';

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Member, Song, Event, Setlist } from '@/types';
import MemoryStore from './memoryStore';

interface StorageData {
  members: Member[];
  songs: Song[];
  events: Event[];
  setlists: Setlist[];
}

// In-memory storage for Vercel compatibility
let memoryStorage: StorageData | null = null;

// Get the data file path (use /tmp for Vercel)
const getDataFilePath = (): string => {
  // Use /tmp for serverless environments, or data directory locally
  const isVercel = process.env.VERCEL === '1';
  const baseDir = isVercel ? '/tmp' : join(process.cwd(), 'data');
  
  if (!existsSync(baseDir)) {
    try {
      mkdirSync(baseDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  }
  return join(baseDir, 'storage.json');
};

// Load data from file or memory
export const loadData = async (): Promise<StorageData> => {
  const store = MemoryStore.getInstance();
  
  // Check memory store first
  const cachedData = store.getData();
  if (cachedData) {
    return cachedData;
  }

  // Also check the old memoryStorage variable
  if (memoryStorage) {
    console.log('loadData: Using legacy cached memory data', { members: memoryStorage.members.length, songs: memoryStorage.songs.length, events: memoryStorage.events.length, setlists: memoryStorage.setlists.length });
    store.setData(memoryStorage);
    return memoryStorage;
  }

  console.log('loadData: No memory cache, loading from file...');
  const filePath = getDataFilePath();
  
  try {
    if (existsSync(filePath)) {
      console.log('loadData: File exists at', filePath);
      const fileContent = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      console.log('loadData: Loaded from file:', { members: data.members.length, songs: data.songs.length, events: data.events.length, setlists: data.setlists.length });
      memoryStorage = data; // Cache in old variable
      store.setData(data); // Cache in new store
      return data;
    } else {
      console.log('loadData: File does not exist at', filePath);
    }
  } catch (error) {
    console.error('Error loading data from storage:', error);
  }

  // Return empty structure if file doesn't exist or error occurred
  const emptyData: StorageData = {
    members: [],
    songs: [],
    events: [],
    setlists: []
  };
  
  memoryStorage = emptyData;
  console.log('loadData: Returning empty data');
  return emptyData;
};

// Save data to file and memory
export const saveData = async (data: StorageData): Promise<void> => {
  console.log('saveData: Saving data', { members: data.members.length, songs: data.songs.length, events: data.events.length, setlists: data.setlists.length });
  
  // Always save to memory
  memoryStorage = data;
  MemoryStore.getInstance().setData(data);
  
  const filePath = getDataFilePath();
  
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('saveData: Successfully saved to file at', filePath);
  } catch (error) {
    console.error('Error saving data to storage (file):', error);
    // Don't throw - data is still in memory
  }
};

// Get all data
export const getAllData = async (): Promise<StorageData> => {
  const data = await loadData();
  console.log('getAllData:', { members: data.members.length, songs: data.songs.length, events: data.events.length, setlists: data.setlists.length });
  return data;
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
