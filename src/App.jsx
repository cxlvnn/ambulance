import React, { useState, useEffect } from 'react';
import { translations } from './translations';
import { presetLocations, quickSymptoms } from './mockData';
import { CallerApp } from './components/CallerApp';
import { DispatcherConsole } from './components/DispatcherConsole';
import { playPhoneRing, playConnectedBeep, playDispatcherAlert } from './utils/audio';
import { 
  Smartphone, Monitor, Split, Globe, MapPin, Volume2, VolumeX,
  ShieldAlert, Sparkles, RefreshCw, Check
} from 'lucide-react';

export function App() {
  const [lang, setLang] = useState('uz'); // 'uz' | 'ru' | 'en'
  const [viewMode, setViewMode] = useState('caller'); // 'caller' | 'dispatcher' | 'split'
  const [currentLocation, setCurrentLocation] = useState(presetLocations[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  // Active call state shared between caller and dispatcher
  const [activeSession, setActiveSession] = useState({
    code: '#UZ-103-742',
    isCalling: false,
    brigadeStatus: 'received', // 'received' | 'assigned' | 'en_route' | 'arrived'
    symptom: quickSymptoms[0], // default: Heart
    details: {
      apt: presetLocations[0].defaultApt,
      floor: presetLocations[0].defaultFloor,
      entrance: presetLocations[0].defaultEntrance,
      intercom: presetLocations[0].defaultIntercom,
      notes: '',
    },
  });

  const t = translations[lang] || translations.uz;

  // Real browser geolocation handler
  const handleFetchRealLocation = () => {
    if (!navigator.geolocation) {
      alert("Brauzeringizda geolokatsiya qo'llab-quvvatlanmaydi");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        setCurrentLocation((prev) => ({
          ...prev,
          nameUz: `Haqiqiy GPS lokatsiya: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          nameRu: `Реальная GPS геопозиция: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          nameEn: `Live GPS Position: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy) || 5,
        }));
      },
      (err) => {
        setIsLocating(false);
        console.warn("Geolocation denied or error:", err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Start 103 Call
  const handleStartCall = () => {
    const randomCode = `#UZ-103-${Math.floor(100 + Math.random() * 900)}`;
    setActiveSession((prev) => ({
      ...prev,
      code: randomCode,
      isCalling: true,
      brigadeStatus: 'received',
    }));

    if (soundEnabled) {
      playPhoneRing();
      setTimeout(() => {
        playConnectedBeep();
        playDispatcherAlert();
      }, 1200);
    }
  };

  // End Call
  const handleEndCall = () => {
    setActiveSession((prev) => ({
      ...prev,
      isCalling: false,
    }));
  };

  // Update apartment/entrance details
  const handleUpdateDetails = (updatedDetails) => {
    setActiveSession((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        ...updatedDetails,
      },
    }));
  };

  // Select Symptom
  const handleSelectSymptom = (symptom) => {
    setActiveSession((prev) => ({
      ...prev,
      symptom,
    }));
  };

  // Update brigade status from dispatcher
  const handleUpdateBrigadeStatus = (status) => {
    setActiveSession((prev) => ({
      ...prev,
      brigadeStatus: status,
    }));
    if (soundEnabled && status === 'en_route') {
      playDispatcherAlert();
    }
  };

  // Switch demo location
  const handleSelectLocation = (loc) => {
    setCurrentLocation(loc);
    setActiveSession((prev) => ({
      ...prev,
      details: {
        apt: loc.defaultApt || '',
        floor: loc.defaultFloor || '',
        entrance: loc.defaultEntrance || '',
        intercom: loc.defaultIntercom || '',
        notes: '',
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Bar for Demonstration & Role Switching */}
      <nav className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & App Scope */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-sm shadow-sm ring-2 ring-red-400">
              103
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight block leading-tight">
                Uzbekistan 103 Ambulance
              </span>
              <span className="text-[10px] text-red-400 font-medium">
                GPS Avto-Manzil & Tezkor Chaqiruv
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('caller')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'caller'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.modeCaller}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('dispatcher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'dispatcher'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t.modeDispatcher}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'split'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>{t.modeSplit}</span>
            </button>
          </div>

          {/* Location Presets & Language Switcher */}
          <div className="flex items-center gap-2">
            {/* Location Selector */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-xs">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <select
                value={currentLocation.id}
                onChange={(e) => {
                  const found = presetLocations.find((l) => l.id === e.target.value);
                  if (found) handleSelectLocation(found);
                }}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
              >
                {presetLocations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                    {lang === 'ru' ? loc.nameRu : lang === 'en' ? loc.nameEn : loc.nameUz}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleFetchRealLocation}
                title="Haqiqiy GPS koordinatani olish"
                className="ml-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40"
              >
                {isLocating ? '...' : 'GPS'}
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('uz')}
                className={`px-2 py-1 rounded transition ${
                  lang === 'uz' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`px-2 py-1 rounded transition ${
                  lang === 'ru' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded transition ${
                  lang === 'en' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Viewport Content according to viewMode */}
      <main className="flex-1 flex flex-col">
        {viewMode === 'caller' && (
          <div className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-slate-200/80">
            {/* Phone Frame for realistic mobile preview */}
            <div className="w-full max-w-[420px] bg-white rounded-[38px] shadow-2xl border-[8px] border-slate-900 overflow-hidden flex flex-col h-[820px] max-h-[92vh] relative ring-1 ring-slate-400/40">
              
              {/* Phone Speaker Notch */}
              <div className="w-full bg-slate-900 h-6 flex items-center justify-center shrink-0">
                <div className="w-20 h-3.5 bg-black rounded-b-xl flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
                </div>
              </div>

              {/* Scrollable phone screen */}
              <div className="flex-1 overflow-y-auto">
                <CallerApp
                  t={t}
                  lang={lang}
                  currentLocation={currentLocation}
                  onLocationChange={setCurrentLocation}
                  activeSession={activeSession}
                  onStartCall={handleStartCall}
                  onEndCall={handleEndCall}
                  onUpdateDetails={handleUpdateDetails}
                  onSelectSymptom={handleSelectSymptom}
                  soundEnabled={soundEnabled}
                  setSoundEnabled={setSoundEnabled}
                  onOpenDispatcher={() => setViewMode('dispatcher')}
                />
              </div>

              {/* Home indicator bar at bottom */}
              <div className="h-5 bg-white flex items-center justify-center shrink-0">
                <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'dispatcher' && (
          <div className="flex-1 flex flex-col">
            <DispatcherConsole
              t={t}
              lang={lang}
              currentLocation={currentLocation}
              activeSession={activeSession}
              onUpdateBrigadeStatus={handleUpdateBrigadeStatus}
              onEndCall={handleEndCall}
            />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 p-4 bg-slate-200">
            {/* Left: Mobile App inside phone bezel */}
            <div className="xl:col-span-5 flex items-center justify-center">
              <div className="w-full max-w-[420px] bg-white rounded-[36px] shadow-2xl border-[8px] border-slate-900 overflow-hidden flex flex-col h-[780px] max-h-[88vh] relative">
                <div className="w-full bg-slate-900 h-5 flex items-center justify-center shrink-0">
                  <div className="w-16 h-2.5 bg-black rounded-b-lg"></div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CallerApp
                    t={t}
                    lang={lang}
                    currentLocation={currentLocation}
                    onLocationChange={setCurrentLocation}
                    activeSession={activeSession}
                    onStartCall={handleStartCall}
                    onEndCall={handleEndCall}
                    onUpdateDetails={handleUpdateDetails}
                    onSelectSymptom={handleSelectSymptom}
                    soundEnabled={soundEnabled}
                    setSoundEnabled={setSoundEnabled}
                    onOpenDispatcher={() => setViewMode('dispatcher')}
                  />
                </div>
                <div className="h-4 bg-white flex items-center justify-center shrink-0">
                  <div className="w-24 h-1 bg-slate-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Right: Dispatcher Console */}
            <div className="xl:col-span-7 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[780px] max-h-[88vh]">
              <DispatcherConsole
                t={t}
                lang={lang}
                currentLocation={currentLocation}
                activeSession={activeSession}
                onUpdateBrigadeStatus={handleUpdateBrigadeStatus}
                onEndCall={handleEndCall}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
