import React, { useState, useEffect } from 'react';
import { Profile, GeoLog, Location, User, SoundMode } from './types';
import { backend } from './services/mockBackend';
import { evaluateProfiles } from './services/GeofenceEngine';
import { BASE_LAT, BASE_LNG } from './constants';

import TabNavigator from './components/TabNavigator';
import DashboardScreen from './screens/DashboardScreen';
import MapScreen from './screens/MapScreen';
import LogScreen from './screens/LogScreen';
import ProfilesScreen from './screens/ProfilesScreen';
import AuthScreen from './screens/AuthScreen';

const App = () => {
  // --- Global State ---
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [logs, setLogs] = useState<GeoLog[]>([]);
  const [userLocation, setUserLocation] = useState<Location>({ latitude: BASE_LAT, longitude: BASE_LNG });
  
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  
  // Toast Notification State
  const [toast, setToast] = useState<{message: string, type: 'info' | 'alert'} | null>(null);

  // --- Initialization ---
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const u = await backend.getCurrentUser();
    if (u) {
        setUser(u);
        loadData();
    }
  };

  const loadData = async () => {
    const p = await backend.getProfiles();
    setProfiles(p);
  };

  // --- Engine Logic ---
  useEffect(() => {
    if (!user) return;
    
    // Evaluate which profile should be active based on location
    const { activeProfile: newActive, newLog } = evaluateProfiles(userLocation, profiles);
    
    setActiveProfile(newActive);

    if (newLog) {
      setLogs(prev => [newLog, ...prev]);
      const msg = newActive 
        ? `Activated: ${newActive.name} (${newActive.soundMode})` 
        : `Default Mode Restored`;
      showToast(msg, newActive ? 'alert' : 'info');
    }
  }, [userLocation, profiles, user]);

  const showToast = (message: string, type: 'info' | 'alert') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Handlers ---
  const handleLogin = (u: User) => {
    setUser(u);
    loadData();
  };

  const handleUpdateProfiles = async () => {
      await loadData();
  };
  
  // Fake add geofence mapping (Map -> Profile Geofence)
  // For this MVP, mapping map clicks to the "First" profile or "Work" profile for demo purposes
  // A real implementation would ask "Which profile is this for?"
  const handleAddGeofenceFromMap = async (loc: Location) => {
     showToast("Use 'Profiles' tab to add triggers", 'info');
  };

  // --- Render ---

  if (!user) {
      return <AuthScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen activeProfile={activeProfile} logs={logs} profiles={profiles} user={user} />;
      case 'map':
        // Map now visualizes ALL profile geofences.
        // Flattening profile geofences for map display
        const allFences = profiles.flatMap(p => 
            (p.geofences || []).map(g => ({
                id: g.id,
                name: p.name,
                latitude: g.latitude,
                longitude: g.longitude,
                radius: g.radius,
                mode: p.soundMode,
                isActive: p.isActive,
                color: p.color
            }))
        );

        return (
          <MapScreen 
            userLocation={userLocation} 
            geofences={allFences} 
            onLocationUpdate={setUserLocation} 
            onAddGeofence={(g) => handleAddGeofenceFromMap({latitude: g.latitude, longitude: g.longitude})}
          />
        );
      case 'logs':
        return <LogScreen logs={logs} onClearLogs={() => setLogs([])} />;
      case 'profiles':
        return <ProfilesScreen profiles={profiles} onProfilesChange={handleUpdateProfiles} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-4 left-4 right-4 z-50 p-4 rounded-xl shadow-xl transition-all transform translate-y-0 animate-fade-in ${
            toast.type === 'alert' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'
        }`}>
            <p className="font-bold text-sm">{toast.message}</p>
        </div>
      )}

      <main className="flex-1 overflow-hidden relative bg-slate-50">
        {renderContent()}
      </main>

      <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
