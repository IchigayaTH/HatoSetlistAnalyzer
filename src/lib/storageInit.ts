'use server';

import { dummyMembers, dummySongs, dummyEvents, dummySetlists } from '@/data/dummyData';
import { saveData } from './storage';

/**
 * Initialize storage with dummy data
 * Run this once to populate the storage.json file with initial data
 */
export const initializeStorage = (): void => {
  try {
    saveData({
      members: dummyMembers,
      songs: dummySongs,
      events: dummyEvents,
      setlists: dummySetlists
    });
    console.log('Storage initialized with dummy data');
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
};
