'use server';

import { Member, Song, Event, Setlist } from '@/types';

interface StorageData {
  members: Member[];
  songs: Song[];
  events: Event[];
  setlists: Setlist[];
}

// Global memory store - persists across requests in the same process
// This works in Next.js because the server process is kept alive
class MemoryStore {
  private static instance: MemoryStore;
  private data: StorageData | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  setData(data: StorageData): void {
    this.data = data;
    this.isInitialized = true;
    console.log('MemoryStore.setData:', { members: data.members.length, songs: data.songs.length, events: data.events.length, setlists: data.setlists.length });
  }

  getData(): StorageData | null {
    if (this.data) {
      console.log('MemoryStore.getData: Returning cached data', { members: this.data.members.length, songs: this.data.songs.length, events: this.data.events.length, setlists: this.data.setlists.length });
    } else {
      console.log('MemoryStore.getData: No cached data');
    }
    return this.data;
  }

  isReady(): boolean {
    return this.isInitialized && this.data !== null;
  }

  clear(): void {
    this.data = null;
    this.isInitialized = false;
    console.log('MemoryStore.clear: Cleared all data');
  }
}

export default MemoryStore;
