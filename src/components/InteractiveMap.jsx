import React, { useState, useEffect, useRef } from 'react';
import { Navigation, ZoomIn, ZoomOut, Compass, MapPin, ShieldAlert, Crosshair } from 'lucide-react';

export const InteractiveMap = ({
  location,
  onLocationChange,
  brigadeStatus,
  height = "h-64",
  interactive = true,
  showControls = true,
  lang = "uz",
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [ambulanceProgress, setAmbulanceProgress] = useState(0.2);

  // Animate ambulance when en route
  useEffect(() => {
    let interval;
    if (brigadeStatus === 'en_route') {
      interval = setInterval(() => {
        setAmbulanceProgress((prev) => {
          if (prev >= 0.95) return 0.95;
          return prev + 0.05;
        });
      }, 1500);
    } else if (brigadeStatus === 'arrived') {
      setAmbulanceProgress(1);
    } else {
      setAmbulanceProgress(0.2);
    }
    return () => clearInterval(interval);
  }, [brigadeStatus]);

  // Handle drag pan
  const handleMouseDown = (e) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !interactive) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (!interactive || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !interactive || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleResetCenter = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  // Interpolated ambulance coordinates along simulated street path
  const startAmbX = 30;
  const startAmbY = 220;
  const targetX = 180;
  const targetY = 130;
  const currentAmbX = startAmbX + (targetX - startAmbX) * ambulanceProgress;
  const currentAmbY = startAmbY + (targetY - startAmbY) * ambulanceProgress;

  return (
    <div
      className={`relative w-full ${height} overflow-hidden rounded-2xl bg-[#EEF2F6] select-none border border-slate-200 shadow-inner group`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      style={{ cursor: interactive ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
    >
      {/* SVG Map Canvas */}
      <svg
        className="w-full h-full transition-transform duration-75"
        viewBox="0 0 360 260"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: '180px 130px',
        }}
      >
        <defs>
          {/* Subtle patterns for city blocks */}
          <pattern id="city-blocks" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="26" height="26" fill="#F1F5F9" rx="3" />
          </pattern>
          <radialGradient id="callerPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#EF4444" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background / District ground */}
        <rect width="100%" height="100%" fill="#E5EBF1" />

        {/* Green Parks / Squares (Tashkent parks like Amir Temur Square / Park) */}
        <rect x="230" y="20" width="110" height="75" rx="8" fill="#D7ECD9" />
        <text x="245" y="55" fill="#4A7C59" fontSize="8" fontWeight="600" opacity="0.8">
          ECO PARK
        </text>

        <rect x="15" y="15" width="75" height="60" rx="8" fill="#D7ECD9" />
        <text x="25" y="45" fill="#4A7C59" fontSize="7" fontWeight="600" opacity="0.8">
          BOG'ISHAMOL
        </text>

        {/* Canal / Anhor water stream */}
        <path
          d="M -20,100 C 60,110 100,80 160,95 C 220,110 270,140 380,135"
          fill="none"
          stroke="#BFDBFE"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <text x="90" y="93" fill="#60A5FA" fontSize="7" fontWeight="bold" letterSpacing="1">
          ANHOR KANALI
        </text>

        {/* Secondary Streets */}
        <path d="M 0,50 L 360,50" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M 0,190 L 360,190" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M 80,0 L 80,260" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M 280,0 L 280,260" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M 0,130 L 140,130" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M 220,130 L 360,130" stroke="#FFFFFF" strokeWidth="6" />

        {/* Main Avenue: Amir Temur shoh ko'chasi */}
        <path
          d="M 20,250 L 180,130 L 320,10"
          stroke="#FED7AA"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 20,250 L 180,130 L 320,10"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Road center dash */}
        <path
          d="M 20,250 L 180,130 L 320,10"
          stroke="#FDBA74"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Metro line & station marker */}
        <circle cx="95" cy="190" r="4.5" fill="#DC2626" />
        <circle cx="95" cy="190" r="2" fill="#FFFFFF" />
        <text x="105" y="193" fill="#64748B" fontSize="7" fontWeight="700">
          M BODOMZOR
        </text>

        {/* Building blocks */}
        <rect x="110" y="60" width="45" height="30" rx="3" fill="#DCE3EC" stroke="#CBD5E1" strokeWidth="1" />
        <text x="122" y="78" fill="#64748B" fontSize="6.5" fontWeight="bold">82</text>

        {/* Caller Building (Target) */}
        <rect x="170" y="105" width="55" height="36" rx="4" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
        <text x="186" y="127" fill="#DC2626" fontSize="8" fontWeight="bold">84-UY</text>

        <rect x="115" y="145" width="40" height="28" rx="3" fill="#DCE3EC" stroke="#CBD5E1" strokeWidth="1" />
        <text x="127" y="162" fill="#64748B" fontSize="6.5" fontWeight="bold">86</text>

        {/* Substation Base Marker */}
        <g transform="translate(15, 205)">
          <circle cx="15" cy="15" r="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <rect x="8" y="12" width="14" height="6" fill="#0284C7" rx="1" />
          <path d="M 15,9 L 15,21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M 9,15 L 21,15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <text x="-5" y="38" fill="#0369A1" fontSize="6.5" fontWeight="bold">
            103 Podstansiya #4
          </text>
        </g>

        {/* Dispatched Route line when Brigade is En Route */}
        {(brigadeStatus === 'en_route' || brigadeStatus === 'arrived') && (
          <path
            d="M 30,220 L 100,190 L 140,160 L 180,130"
            fill="none"
            stroke="#DC2626"
            strokeWidth="3.5"
            strokeDasharray="5 3"
            strokeLinecap="round"
          />
        )}

        {/* Moving Ambulance Vehicle */}
        {(brigadeStatus === 'en_route' || brigadeStatus === 'arrived') && (
          <g transform={`translate(${currentAmbX}, ${currentAmbY})`}>
            {/* Siren glow */}
            <circle cx="0" cy="0" r="14" fill="#3B82F6" opacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="9" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
            <text x="-4" y="3" fill="#FFFFFF" fontSize="8" fontWeight="bold">🚑</text>
            <rect x="-18" y="12" width="36" height="12" rx="3" fill="#0F172A" opacity="0.85" />
            <text x="-14" y="20.5" fill="#FFFFFF" fontSize="6" fontWeight="bold">
              103 BRIGADA
            </text>
          </g>
        )}

        {/* GPS Accuracy Radius Circle around caller */}
        <circle
          cx="180"
          cy="130"
          r="38"
          fill="url(#callerPulse)"
          stroke="#EF4444"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          className="animate-pulse"
        />

        {/* Caller Pin (Target Location) */}
        <g transform="translate(180, 130)">
          {/* Outer radar ripple */}
          <circle cx="0" cy="0" r="16" fill="#DC2626" opacity="0.2" className="animate-ping-slow" />
          
          {/* Main Pin Icon */}
          <path
            d="M 0,-24 C -8,-24 -14,-18 -14,-10 C -14,0 0,12 0,12 C 0,12 14,0 14,-10 C 14,-18 8,-24 0,-24 Z"
            fill="#D32F2F"
            stroke="#FFFFFF"
            strokeWidth="2"
            filter="drop-shadow(0px 3px 4px rgba(0,0,0,0.3))"
          />
          <circle cx="0" cy="-12" r="5" fill="#FFFFFF" />
          <circle cx="0" cy="-12" r="2.5" fill="#D32F2F" />

          {/* Label banner */}
          <g transform="translate(0, -32)">
            <rect x="-42" y="-14" width="84" height="16" rx="4" fill="#1E293B" />
            <text x="0" y="-3.5" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
              {lang === 'ru' ? 'ВАША ТОЧКА' : lang === 'en' ? 'YOUR LOCATION' : 'SIZNING MANZIL'}
            </text>
            <polygon points="-4,2 4,2 0,6" fill="#1E293B" />
          </g>
        </g>
      </svg>

      {/* Floating GPS Accuracy Badge */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1.2 rounded-lg border border-slate-200/80 shadow-sm flex items-center gap-1.5 text-xs font-medium text-slate-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-slate-900">GPS:</span>
        <span className="text-emerald-700 font-bold">±{location?.accuracy || 3} {lang === 'en' ? 'm' : lang === 'ru' ? 'м' : 'metr'}</span>
      </div>

      {/* Map Interactive Controls */}
      {showControls && (
        <div className="absolute right-3 bottom-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleResetCenter}
            title="Recenter"
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-red-600 hover:bg-red-50 transition active:scale-95"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2.2))}
            title="Zoom In"
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-red-600 hover:bg-red-50 transition active:scale-95"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
            title="Zoom Out"
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-red-600 hover:bg-red-50 transition active:scale-95"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Road / Landmark indicator overlay at bottom left */}
      <div className="absolute bottom-2 left-3 pointer-events-none">
        <span className="text-[10px] text-slate-500 bg-white/80 backdrop-blur px-2 py-0.5 rounded shadow-xs">
          Toshkent • 103 GIS Telemetriya
        </span>
      </div>
    </div>
  );
};
