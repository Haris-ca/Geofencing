
import { Geofence, SoundMode, UserProfile } from './types';

// Simulate a base location (e.g., Central Park, NY) for the virtual map center
export const BASE_LAT = 40.785091;
export const BASE_LNG = -73.968285;

// Scale for the simulation map (degrees per pixel approx)
export const MAP_SCALE = 0.0001; 

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Developer',
  phone: '+1 (555) 0199',
  defaultMode: SoundMode.NORMAL,
  notificationsEnabled: true,
};

export const INITIAL_GEOFENCES: Geofence[] = [
  {
    id: '1',
    name: 'Office HQ',
    latitude: BASE_LAT + 0.0015,
    longitude: BASE_LNG + 0.0015,
    radius: 120,
    mode: SoundMode.SILENT,
    isActive: true,
    color: '#6366f1', // Indigo
  },
  {
    id: '2',
    name: 'Home Base',
    latitude: BASE_LAT - 0.0010,
    longitude: BASE_LNG - 0.0010,
    radius: 150,
    mode: SoundMode.NORMAL,
    isActive: true,
    color: '#10b981', // Emerald
  },
  {
    id: '3',
    name: 'Library',
    latitude: BASE_LAT + 0.0020,
    longitude: BASE_LNG - 0.0020,
    radius: 80,
    mode: SoundMode.VIBRATE,
    isActive: true,
    color: '#f59e0b', // Amber
  },
];
