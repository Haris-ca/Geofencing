
export enum SoundMode {
  NORMAL = 'NORMAL',
  VIBRATE = 'VIBRATE',
  SILENT = 'SILENT',
}

export interface GeofenceTrigger {
  id: string;
  profileId: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
}

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  mode: SoundMode;
  isActive: boolean;
  color: string;
}

export interface TimeSchedule {
  id: string;
  profileId: string;
  days: number[]; // 0-6 (Sun-Sat)
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  soundMode: SoundMode;
  priority: number; // Higher number = higher priority
  isActive: boolean;
  color: string;
  // Hydrated fields for UI convenience
  geofences?: GeofenceTrigger[];
  schedules?: TimeSchedule[];
}

export interface GeoLog {
  id: string;
  timestamp: number;
  profileId?: string;
  profileName: string;
  event: 'ENTER' | 'EXIT' | 'ACTIVATE';
  triggeredMode: SoundMode;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserProfile {
  name: string;
  phone?: string;
  defaultMode: SoundMode;
  notificationsEnabled?: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}
