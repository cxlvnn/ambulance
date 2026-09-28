import React, { useState } from 'react';
import { 
  Shield, MapPin, Phone, Radio, Siren, CheckCircle2, AlertTriangle, 
  Clock, Navigation, Send, ArrowRight, User, Building2, Eye, RefreshCw,
  Share2, Activity, Check
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { mockDispatcherOtherCalls } from '../mockData';

export const DispatcherConsole = ({
  t,
  lang,
  currentLocation,
  activeSession,
  onUpdateBrigadeStatus,
  onEndCall,
}) => {
  const [selectedCallTab, setSelectedCallTab] = useState('active'); // 'active' or mock id
  const [sentToDriver, setSentToDriver] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  // Address strings
  const districtName = lang === 'ru' ? currentLocation.districtRu : lang === 'en' ? currentLocation.districtEn : currentLocation.districtUz;
  const mahallaName = lang === 'ru' ? currentLocation.mahallaRu : lang === 'en' ? currentLocation.mahallaEn : currentLocation.mahallaUz;
  const streetName = lang === 'ru' ? currentLocation.streetRu : lang === 'en' ? currentLocation.streetEn : currentLocation.streetUz;
  const landmarkName = lang === 'ru' ? currentLocation.landmarkRu : lang === 'en' ? currentLocation.landmarkEn : currentLocation.landmarkUz;
  const substationName = lang === 'ru' ? currentLocation.substationRu : lang === 'en' ? currentLocation.substationEn : currentLocation.substationUz;

  const handleSendToDriver = () => {
    setSentToDriver(true);
    setTimeout(() => setSentToDriver(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans">
      {/* Top Dispatcher Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-lg shadow-md ring-2 ring-red-500/30">
            103
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-base tracking-wide uppercase">
                {t.dispatcherTitle}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                TOSHKENT ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.dispatcherSubtitle} • Server vaqt: {new Date().toLocaleTimeString('uz-UZ')}
            </p>
          </div>
        </div>

        {/* Dispatcher Telemetry Bar */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>GIS Lokatsiya: <strong className="text-emerald-400">FAOL (GPS/GSM)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <Siren className="w-3.5 h-3.5 text-red-400" />
            <span>Navbatchi podstansiya: <strong className="text-slate-100">#4 Yunusobod</strong></span>
          </div>
        </div>
      </header>

      {/* Main 2-column or 3-column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Column: Incoming Calls Queue */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-slate-950/60 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              {t.activeIncidents} (3)
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="p-2 space-y-2">
            {/* Active User App Call (Highest priority when ringing) */}
            <div
              onClick={() => setSelectedCallTab('active')}
              className={`p-3 rounded-xl border transition cursor-pointer relative ${
                selectedCallTab === 'active'
                  ? 'bg-slate-800/90 border-red-500 ring-1 ring-red-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50'
              } ${activeSession?.isCalling ? 'border-red-500 animate-pulse-subtle' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${activeSession?.isCalling ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
                  <span className="font-mono font-bold text-xs text-white">
                    {activeSession?.code || '#UZ-103-DEMO'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                  {activeSession?.isCalling ? 'JONLI CHAQUIRUV' : 'ILOVA NAVBATI'}
                </span>
              </div>

              <div className="mt-2 text-xs font-bold text-white truncate">
                {streetName}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {districtName} • ±{currentLocation.accuracy}m GPS
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">+998 90 123-45-67</span>
                <span className="font-semibold text-amber-400">
                  {activeSession?.symptom ? t[activeSession.symptom.labelKey] : 'Shoshilinch'}
                </span>
              </div>
            </div>

            {/* Other Mock Calls */}
            {mockDispatcherOtherCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCallTab(call.id)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  selectedCallTab === call.id
                    ? 'bg-slate-800/90 border-slate-600'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 font-semibold">{call.code}</span>
                  <span className="text-[10px] text-slate-500">{call.timeAgo}</span>
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-200 truncate">
                  {call.street}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {call.district}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{call.callerPhone}</span>
                  <span className="text-emerald-400 font-semibold">{call.brigade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right Column: Incident Inspection & Dispatcher Actions */}
        <div className="lg:col-span-9 flex flex-col overflow-y-auto bg-slate-900 p-4 space-y-4">
          
          {/* Incoming Call Notification Banner if active call is ringing */}
          {activeSession?.isCalling && (
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border-2 border-red-400 animate-pulse-subtle">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                  <Siren className="w-7 h-7 text-white animate-spin" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg tracking-wide uppercase">
                      {t.newCallAlert}
                    </h3>
                    <span className="bg-white text-red-700 text-xs font-black px-2 py-0.5 rounded">
                      {activeSession.code}
                    </span>
                  </div>
                  <p className="text-xs text-red-100">
                    Fuqaro ilovadan qo'ng'iroq qildi. Aniq koordinatalar qabul qilindi.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddressConfirmed(true)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    addressConfirmed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-red-700 hover:bg-red-50'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{addressConfirmed ? "Manzil tasdiqlandi" : "Manzilni tasdiqlash"}</span>
                </button>
              </div>
            </div>
          )}

          {/* CRITICAL FEATURE EXPLANATION CARD FOR DISPATCHER */}
          <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white text-sm mb-0.5">
                  {lang === 'uz' ? "GPS orqali avtomatik manzil aniqlangan" : lang === 'ru' ? "Адрес определён по GPS автоматически" : "Address Automatically Resolved via GPS"}
                </h4>
                <p className="text-slate-300">
                  {lang === 'uz'
                    ? "Qo'ng'iroq qiluvchi uy raqamini bilmasa ham, koordinatalar orqali aniq manzil aniqlangan. Dispetcher manzilni boshidan so'rashi shart emas, faqat tasdiqlaydi."
                    : lang === 'ru'
                    ? "Даже если заявитель не знает точный номер дома, геопозиция точно зафиксирована. Диспетчеру не нужно расспрашивать адрес, достаточно лишь подтвердить."
                    : "Even if caller doesn't know house number, coordinates provide exact address. The dispatcher doesn't need to ask from scratch, only confirms."}
                </p>
                <div className="mt-2 p-2 bg-slate-900/80 rounded-lg font-mono text-[11px] text-emerald-400 border border-emerald-500/20">
                  Dispetcher so'rovi namunasi: <span className="text-white font-bold">"{streetName}, {currentLocation.landmarkUz} yaqinidamisiz?"</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column: Map & Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Address & Apartment Card */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                    {t.exactAddress}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
                </span>
              </div>

              {/* Main Resolved Street */}
              <div>
                <div className="text-lg font-black text-white">
                  {streetName}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {districtName} • {mahallaName}
                </div>
              </div>

              {/* Landmark */}
              <div className="bg-slate-900/80 border border-slate-700 p-2.5 rounded-xl text-xs">
                <span className="text-amber-400 font-bold block mb-0.5">
                  {t.nearLandmark}:
                </span>
                <span className="text-slate-300">
                  {landmarkName}
                </span>
              </div>

              {/* Apartment and Entrance details */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 block">{t.entrance}</span>
                  <strong className="text-white text-sm">{activeSession?.details?.entrance || currentLocation.defaultEntrance || '—'}</strong>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 block">{t.floor}</span>
                  <strong className="text-white text-sm">{activeSession?.details?.floor || currentLocation.defaultFloor || '—'}</strong>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 block">{t.apartment}</span>
                  <strong className="text-white text-sm">{activeSession?.details?.apt || currentLocation.defaultApt || '—'}</strong>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 block">{t.intercom}</span>
                  <strong className="text-white text-sm">{activeSession?.details?.intercom || currentLocation.defaultIntercom || '—'}</strong>
                </div>
              </div>

              {/* Caller Note */}
              {activeSession?.details?.notes && (
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/60 text-xs">
                  <span className="text-slate-400 font-semibold block text-[10px]">Izoh:</span>
                  <p className="text-amber-200">{activeSession.details.notes}</p>
                </div>
              )}
            </div>

            {/* Right: Tactical Live Dispatcher Map */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                    {t.viewMap} (GIS)
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {substationName}
                </span>
              </div>

              <div className="flex-1 min-h-[180px]">
                <InteractiveMap
                  location={currentLocation}
                  brigadeStatus={activeSession?.brigadeStatus}
                  height="h-52"
                  lang={lang}
                />
              </div>
            </div>
          </div>

          {/* Bottom Dispatch Workflow Actions Bar */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Brigade Assignment status */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center">
                  <Siren className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold">
                    {t.assignedBrigade}
                  </div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{currentLocation.brigadeNumber} • {currentLocation.vehicleModel}</span>
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-amber-400 border border-slate-700 text-xs">
                      {currentLocation.vehicleNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateBrigadeStatus('assigned')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activeSession?.brigadeStatus === 'assigned'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  1. {t.statusAssigned}
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateBrigadeStatus('en_route')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeSession?.brigadeStatus === 'en_route'
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Siren className="w-3.5 h-3.5" />
                  <span>2. {t.statusEnRoute}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateBrigadeStatus('arrived')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeSession?.brigadeStatus === 'arrived'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3. {t.statusArrived}</span>
                </button>

                {/* Send Nav link to driver */}
                <button
                  type="button"
                  onClick={handleSendToDriver}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sentToDriver ? 'Haydovchiga uzatildi!' : t.sendSmsLink}</span>
                </button>

                {activeSession?.isCalling && (
                  <button
                    type="button"
                    onClick={onEndCall}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-red-900 text-slate-200 transition"
                  >
                    {t.endCall}
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
