import React, { useState, useEffect } from 'react';
import { 
  Phone, PhoneCall, PhoneOff, MapPin, Navigation, Copy, Check, 
  AlertCircle, ChevronDown, ChevronUp, Shield, Activity, 
  Building2, Home, KeyRound, Layers, Volume2, VolumeX, Mic, MicOff,
  Clock, CheckCircle2, Siren, ArrowRight, Share2, LocateFixed
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { quickSymptoms } from '../mockData';

export const CallerApp = ({
  t,
  lang,
  currentLocation,
  onLocationChange,
  activeSession,
  onStartCall,
  onEndCall,
  onUpdateDetails,
  onSelectSymptom,
  soundEnabled,
  setSoundEnabled,
  onOpenDispatcher,
}) => {
  const [showApartmentDetails, setShowApartmentDetails] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [apt, setApt] = useState(currentLocation.defaultApt || '');
  const [floor, setFloor] = useState(currentLocation.defaultFloor || '');
  const [entrance, setEntrance] = useState(currentLocation.defaultEntrance || '');
  const [intercom, setIntercom] = useState(currentLocation.defaultIntercom || '');
  const [notes, setNotes] = useState('');
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  // Sync inputs when location preset changes
  useEffect(() => {
    setApt(currentLocation.defaultApt || '');
    setFloor(currentLocation.defaultFloor || '');
    setEntrance(currentLocation.defaultEntrance || '');
    setIntercom(currentLocation.defaultIntercom || '');
  }, [currentLocation.id]);

  // Handle in-call timer
  useEffect(() => {
    let interval;
    if (activeSession?.isCalling) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeSession?.isCalling]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyCoordinates = () => {
    const text = `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`;
    navigator.clipboard?.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleSaveDetails = () => {
    onUpdateDetails({
      apt,
      floor,
      entrance,
      intercom,
      notes,
    });
  };

  // Localized field values
  const districtName = lang === 'ru' ? currentLocation.districtRu : lang === 'en' ? currentLocation.districtEn : currentLocation.districtUz;
  const mahallaName = lang === 'ru' ? currentLocation.mahallaRu : lang === 'en' ? currentLocation.mahallaEn : currentLocation.mahallaUz;
  const streetName = lang === 'ru' ? currentLocation.streetRu : lang === 'en' ? currentLocation.streetEn : currentLocation.streetUz;
  const landmarkName = lang === 'ru' ? currentLocation.landmarkRu : lang === 'en' ? currentLocation.landmarkEn : currentLocation.landmarkUz;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative pb-12 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm ring-2 ring-red-100">
              <span className="font-black tracking-tight text-base">103</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-slate-900 text-sm tracking-tight leading-none">
                  {lang === 'uz' ? "Tez Tibbiy Yordam" : lang === 'ru' ? "Скорая Помощь" : "Emergency Ambulance"}
                </h1>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  UZB
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                {lang === 'uz' ? "Toshkent sh. 103 xizmati" : lang === 'ru' ? "Служба 103 г. Ташкент" : "Tashkent 103 Service"}
              </p>
            </div>
          </div>

          {/* Top Actions: Sound toggle & Live GPS status */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 transition"
              title={soundEnabled ? t.soundOn : t.soundOff}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px]">GPS OK</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Core Solution: The Instant Location Card */}
        <div className="bg-white rounded-2xl border-2 border-red-500/20 shadow-md p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 pointer-events-none opacity-50"></div>

          {/* Location Header */}
          <div className="flex items-start justify-between relative z-10 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wide">
              <LocateFixed className="w-4 h-4 text-red-600 animate-pulse" />
              <span>{t.locationFetched}</span>
            </div>
            <button
              onClick={handleCopyCoordinates}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md font-mono transition"
            >
              {copiedCoords ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</span>
            </button>
          </div>

          {/* Primary Address Display (Solves not knowing house number) */}
          <div className="space-y-1 relative z-10">
            <h2 className="text-xl font-black text-slate-900 leading-snug">
              {streetName}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                <Building2 className="w-3 h-3 text-slate-500" />
                {districtName}
              </span>
              <span className="text-slate-300">•</span>
              <span>{mahallaName}</span>
            </div>

            {/* Landmark (Mo'ljal) - Critical in Uzbekistan */}
            <div className="mt-2.5 p-2 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900">{t.nearLandmark}: </span>
                <span className="text-amber-800">{landmarkName}</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="mt-3">
            <InteractiveMap
              location={currentLocation}
              brigadeStatus={activeSession?.brigadeStatus}
              height="h-44"
              lang={lang}
            />
          </div>

          {/* Accuracy & Substation note */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {t.accuracy}: <strong className="text-slate-700">±{currentLocation.accuracy} {t.meters}</strong>
            </span>
            <span className="truncate max-w-[190px] text-right font-medium text-slate-600">
              {lang === 'ru' ? currentLocation.substationRu : lang === 'en' ? currentLocation.substationEn : currentLocation.substationUz}
            </span>
          </div>
        </div>

        {/* Optional Apartment / Entrance Dropdown Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setShowApartmentDetails(!showApartmentDetails)}
            className="w-full px-4 py-3 flex items-center justify-between text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-red-600" />
              <span>{t.optionalDetails}</span>
              {(apt || entrance || floor || intercom) && (
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
              )}
            </div>
            {showApartmentDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showApartmentDetails && (
            <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.entrance}
                  </label>
                  <input
                    type="text"
                    value={entrance}
                    onChange={(e) => {
                      setEntrance(e.target.value);
                      onUpdateDetails({ entrance: e.target.value });
                    }}
                    placeholder="2"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.floor}
                  </label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => {
                      setFloor(e.target.value);
                      onUpdateDetails({ floor: e.target.value });
                    }}
                    placeholder="3"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.apartment}
                  </label>
                  <input
                    type="text"
                    value={apt}
                    onChange={(e) => {
                      setApt(e.target.value);
                      onUpdateDetails({ apt: e.target.value });
                    }}
                    placeholder="18"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.intercom}
                  </label>
                  <input
                    type="text"
                    value={intercom}
                    onChange={(e) => {
                      setIntercom(e.target.value);
                      onUpdateDetails({ intercom: e.target.value });
                    }}
                    placeholder="18K"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-xs">
                  {lang === 'uz' ? "Qo'shimcha izoh" : lang === 'ru' ? "Примечание для бригады" : "Driver & Brigade Note"}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    onUpdateDetails({ notes: e.target.value });
                  }}
                  placeholder={t.addNotesPlaceholder}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Triage / Symptoms Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                {t.symptomsTitle}
              </h3>
            </div>
            {activeSession?.symptom && (
              <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {lang === 'uz' ? "Tanlandi" : lang === 'ru' ? "Выбрано" : "Selected"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {t.symptomsSubtitle}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {quickSymptoms.map((symptom) => {
              const isSelected = activeSession?.symptom?.id === symptom.id;
              const label = t[symptom.labelKey];
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => onSelectSymptom(symptom)}
                  className={`px-3 py-2.5 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-600 border-red-600 text-white shadow-sm ring-2 ring-red-200'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate pr-1">{label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Call Hero Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onStartCall}
            className="w-full relative group bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:to-red-700 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] border-2 border-red-400 emergency-glow"
          >
            {/* Pulsing ring indicator */}
            <span className="absolute -inset-1 rounded-2xl bg-red-500 opacity-30 group-hover:opacity-60 blur-sm animate-pulse -z-10"></span>
            
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
                <PhoneCall className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div className="text-left">
                <div className="text-xl font-black tracking-wide leading-none flex items-center gap-2">
                  <span>{t.call103}</span>
                  <span className="bg-white/30 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    SOS
                  </span>
                </div>
                <div className="text-xs text-red-100 font-medium mt-1">
                  {t.callSubtext}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Quick Link to Test Dispatcher View */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenDispatcher}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <span>🖥️ {t.modeDispatcher}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ACTIVE CALL MODAL SCREEN (When 103 call is triggered) */}
      {activeSession?.isCalling && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
            
            {/* Top In-Call Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white text-center relative">
              <div className="flex items-center justify-between text-xs text-red-100 mb-2">
                <span className="flex items-center gap-1 font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  {formatTimer(callTimer)}
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  103 DISPATCHER
                </span>
              </div>

              {/* Emergency Call Reference Code */}
              <div className="text-xs text-red-200 uppercase font-semibold">
                {t.callCode}
              </div>
              <div className="text-3xl font-black tracking-widest text-white font-mono my-0.5">
                {activeSession.code}
              </div>
              <p className="text-[11px] text-red-100 max-w-xs mx-auto">
                {t.callCodeHint}
              </p>
            </div>

            {/* In-Call Body */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              
              {/* Dispatcher Location Status Indicator */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-emerald-950 text-sm">
                    {t.dispatcherHasLocation}
                  </h4>
                  <p className="text-emerald-800 mt-0.5 font-medium">
                    {streetName}, {currentLocation.defaultApt ? `xonadon ${currentLocation.defaultApt}` : ''}
                  </p>
                  <p className="text-emerald-700/80 font-mono text-[10px] mt-0.5">
                    GPS: {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)} (±{currentLocation.accuracy}m)
                  </p>
                </div>
              </div>

              {/* Brigade Status Tracker */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Siren className="w-4 h-4 text-red-600 animate-pulse" />
                    {t.brigadeStatusTitle}
                  </span>
                  <span className="text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full uppercase">
                    {activeSession.brigadeStatus === 'received' && t.statusReceived}
                    {activeSession.brigadeStatus === 'assigned' && t.statusAssigned}
                    {activeSession.brigadeStatus === 'en_route' && t.statusEnRoute}
                    {activeSession.brigadeStatus === 'arrived' && t.statusArrived}
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-4 gap-1 text-center my-3">
                  {[
                    { key: 'received', label: t.statusReceived },
                    { key: 'assigned', label: t.statusAssigned },
                    { key: 'en_route', label: t.statusEnRoute },
                    { key: 'arrived', label: t.statusArrived }
                  ].map((step, idx) => {
                    const stepOrder = ['received', 'assigned', 'en_route', 'arrived'];
                    const currentIdx = stepOrder.indexOf(activeSession.brigadeStatus);
                    const isDone = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          isCurrent
                            ? 'bg-red-600 text-white ring-4 ring-red-100 animate-pulse'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[10px] mt-1 font-semibold leading-tight ${
                          isDone ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Brigade vehicle information */}
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block">{t.carNumber}:</span>
                    <strong className="text-slate-900 font-mono text-sm">{currentLocation.vehicleNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.brigadeTeam}:</span>
                    <strong className="text-slate-900">{currentLocation.brigadeNumber} ({currentLocation.vehicleModel.split(' ')[0]})</strong>
                  </div>
                </div>

                {/* ETA time banner */}
                <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-2 text-center text-xs font-bold text-red-700">
                  {t.etaMinutes.replace('{min}', activeSession.brigadeStatus === 'arrived' ? '0' : '4-6')}
                </div>
              </div>

              {/* Live mini map in call */}
              <InteractiveMap
                location={currentLocation}
                brigadeStatus={activeSession.brigadeStatus}
                height="h-32"
                interactive={false}
                showControls={false}
                lang={lang}
              />

              {/* Patient Symptom summary */}
              {activeSession.symptom && (
                <div className="p-2.5 rounded-xl bg-slate-100 text-xs flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{t.patientCondition}:</span>
                  <span className="font-bold text-slate-900">{t[activeSession.symptom.labelKey]}</span>
                </div>
              )}
            </div>

            {/* In-Call Action Bar (Mute, Speaker, End Call) */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-around">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full border transition flex flex-col items-center gap-1 ${
                  isMuted ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={onEndCall}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition"
              >
                <PhoneOff className="w-5 h-5" />
                <span>{t.endCall}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`p-3 rounded-full border transition flex flex-col items-center gap-1 ${
                  isSpeaker ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
