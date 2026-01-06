// Member types
export interface Member {
  id: string;
  name: string;
  nameJa: string;
  birthDate: string;
  joinDate: string;
  imageUrl?: string;
  status: 'active' | 'inactive' | 'hiatus';
}

// Song types
export interface Song {
  id: string;
  title: string;
  titleJa: string;
  releaseDate?: string;
  duration: number; // in seconds
  defaultSelectMembers: string[]; // Member IDs
  imageUrl?: string;
}

// Event types
export interface Event {
  id: string;
  date: string;
  name: string;
  venue: string;
  participatingMembers: string[]; // Member IDs
  notes?: string;
}

// Setlist types
export interface SetlistSong {
  songId: string;
  selectedMembers: string[]; // Member IDs
  notes?: string;
}

export interface Setlist {
  id: string;
  eventId: string;
  songs: SetlistSong[];
  createdAt: string;
  updatedAt: string;
}

// Statistics types
export interface SongStats {
  songId: string;
  totalPerformances: number;
  recentPerformances: number;
  adoptionRate: number;
}

export interface MemberStats {
  memberId: string;
  participationCount: number;
  participationRate: number;
  averagePerformancePerEvent: number;
}

// Tab types
export type TabType = 'events' | 'setlist' | 'dashboard' | 'prediction' | 'masters';
