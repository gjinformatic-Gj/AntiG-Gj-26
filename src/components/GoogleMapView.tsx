import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import { Venue, ThemeMode } from '../types';

interface GoogleMapViewProps {
  venues: Venue[];
  selectedVenue: Venue;
  onSelectVenue: (venue: Venue) => void;
  onBookPass: (venue: Venue) => void;
  apiKey: string;
  theme: ThemeMode;
  radiusKm: number;
  onRadiusChange: (km: number) => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
  showParking: boolean;
  onToggleParking: () => void;
}

// Controller to programmatic map moves
const MapController: React.FC<{ targetCoords: { lat: number; lng: number } }> = ({
  targetCoords,
}) => {
  const map = useMap();
  useEffect(() => {
    if (map && targetCoords) {
      map.panTo(targetCoords);
    }
  }, [map, targetCoords]);
  return null;
};

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  venues,
  selectedVenue,
  onSelectVenue,
  onBookPass,
  apiKey,
  theme,
  radiusKm,
  onRadiusChange,
  showHeatmap,
  onToggleHeatmap,
  showTraffic,
  onToggleTraffic,
  showParking,
  onToggleParking,
}) => {
  const isTerra = theme === 'terra';
  const [zoom, setZoom] = useState(13);
  const [mapCenter, setMapCenter] = useState({ lat: 23.0385, lng: 72.5120 });
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const handleCenterGps = () => {
    // Center to user GPS location (Bodakdev SG Highway)
    setMapCenter({ lat: 23.0385, lng: 72.5120 });
    setZoom(14);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, 10));

  // Filter venues by radius
  const filteredVenues = venues.filter((v) => {
    if (radiusKm >= 25) return true;
    return v.distanceKm <= radiusKm;
  });

  return (
    <div
      className={`rounded-2xl relative overflow-hidden h-[680px] lg:h-[740px] shadow-sm flex flex-col justify-between border transition-all ${
        isTerra
          ? 'bg-[#f8f5ee] border-[#c4c8bc]/70 text-[#2e3230]'
          : 'bg-[#0f1524] border-sky-400/20 text-slate-100'
      }`}
    >
      {/* Maps Quota In-App Alert (if triggered) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-2">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
          <button
            onClick={() => setQuotaExceeded(false)}
            className="text-amber-700 hover:text-amber-900 ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Floating Map Top Header: GPS Pill & Map Layer Selectors */}
      <div className="relative z-20 p-4 flex items-center justify-between gap-3 flex-wrap pointer-events-none">
        {/* Active GPS Location Pill */}
        <div
          className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full shadow-md border pointer-events-auto backdrop-blur-md ${
            isTerra
              ? 'bg-white/95 border-[#c4c8bc]/80 text-[#2e3230]'
              : 'bg-slate-900/90 border-white/15 text-slate-100'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
              }`}
            />
          </span>
          <span className="text-xs font-bold">Bodakdev, SG Highway</span>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
              isTerra
                ? 'bg-[#4a7c59]/10 text-[#4a7c59] border-[#4a7c59]/20'
                : 'bg-sky-400/15 text-sky-300 border-sky-400/30'
            }`}
          >
            GPS Live
          </span>
        </div>

        {/* Map Layer Toggles */}
        <div
          className={`flex items-center gap-1 p-1 rounded-full shadow-md border pointer-events-auto backdrop-blur-md ${
            isTerra
              ? 'bg-white/95 border-[#c4c8bc]/80'
              : 'bg-slate-900/90 border-white/15'
          }`}
        >
          <button
            onClick={onToggleHeatmap}
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
              showHeatmap
                ? isTerra
                  ? 'bg-[#4a7c59] text-white shadow-sm'
                  : 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                : isTerra
                ? 'text-[#6b6358] hover:text-[#2e3230]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">groups</span>
            <span>Crowd Heatmap</span>
          </button>
          <button
            onClick={onToggleTraffic}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              showTraffic
                ? isTerra
                  ? 'bg-[#4a7c59] text-white shadow-sm'
                  : 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                : isTerra
                ? 'text-[#6b6358] hover:text-[#2e3230]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">traffic</span>
            <span>Traffic</span>
          </button>
          <button
            onClick={onToggleParking}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              showParking
                ? isTerra
                  ? 'bg-[#4a7c59] text-white shadow-sm'
                  : 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                : isTerra
                ? 'text-[#6b6358] hover:text-[#2e3230]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">local_parking</span>
            <span>Parking</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Google Map View */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              center={mapCenter}
              zoom={zoom}
              gestureHandling="greedy"
              disableDefaultUI={true}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              <MapController targetCoords={selectedVenue.coordinates} />

              {/* Render Advanced Markers for Garba Grounds */}
              {filteredVenues.map((venue) => {
                const isSelected = selectedVenue.id === venue.id;
                return (
                  <AdvancedMarker
                    key={venue.id}
                    position={venue.coordinates}
                    title={venue.name}
                    onClick={() => onSelectVenue(venue)}
                  >
                    <div className="relative cursor-pointer group select-none">
                      {/* Pulsing Aura if Selected */}
                      {isSelected && (
                        <>
                          <div
                            className={`absolute -inset-6 rounded-full animate-ping opacity-60 ${
                              isTerra ? 'bg-[#4a7c59]/25' : 'bg-sky-400/30'
                            }`}
                          />
                          <div
                            className={`absolute -inset-3 rounded-full opacity-40 ${
                              isTerra ? 'bg-[#4a7c59]/30' : 'bg-sky-400/40'
                            }`}
                          />
                        </>
                      )}

                      {/* Pin Bubble */}
                      <div
                        className={`relative w-10 h-10 rounded-full flex items-center justify-center ring-2 shadow-lg transition-transform group-hover:scale-110 ${
                          isSelected
                            ? isTerra
                              ? 'bg-gradient-to-br from-[#4a7c59] to-[#78a886] text-white ring-white shadow-xl'
                              : 'bg-gradient-to-tr from-sky-400 to-primary text-slate-900 ring-white shadow-xl'
                            : isTerra
                            ? venue.isCelebrity
                              ? 'bg-[#f8e0a8] text-[#554020] ring-amber-300'
                              : 'bg-white text-[#4a7c59] ring-[#4a7c59]/40'
                            : venue.isCelebrity
                            ? 'bg-purple-300 text-purple-950 ring-purple-300'
                            : 'bg-slate-900 text-sky-300 ring-sky-400/50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px] font-bold">
                          {isSelected
                            ? 'festival'
                            : venue.isCelebrity
                            ? 'stars'
                            : 'music_note'}
                        </span>
                      </div>

                      {/* Floating Active Info Card above pin (Exactly matching Image 3 design!) */}
                      {isSelected && (
                        <div
                          className={`absolute bottom-12 left-1/2 -translate-x-1/2 w-72 rounded-xl p-3.5 shadow-2xl z-30 pointer-events-auto flex flex-col gap-2 border transition-all ${
                            isTerra
                              ? 'bg-white border-[#4a7c59]/30 text-[#2e3230]'
                              : 'bg-slate-900/95 border-sky-400/40 text-slate-100 backdrop-blur-xl'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span
                              className={`flex items-center gap-1 ${
                                isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                              }`}
                            >
                              ★ {venue.rating} • {venue.distanceKm} km ({venue.travelMinutes} min)
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                isTerra
                                  ? 'bg-[#4a7c59]/10 border-[#4a7c59]/20 text-[#4a7c59]'
                                  : 'bg-sky-400/15 border-sky-400/30 text-sky-300'
                              }`}
                            >
                              {venue.curfewTime}
                            </span>
                          </div>

                          <div>
                            <span className="text-sm font-bold block leading-tight font-headline">
                              {venue.name}
                            </span>
                            <span
                              className={`text-xs block mt-0.5 truncate ${
                                isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                              }`}
                            >
                              {venue.artist.name} Live
                            </span>
                          </div>

                          <div
                            className={`flex items-center justify-between pt-2 border-t ${
                              isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
                            }`}
                          >
                            <div>
                              <span
                                className={`text-[10px] block font-semibold ${
                                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                                }`}
                              >
                                Entry From
                              </span>
                              <span
                                className={`text-base font-bold ${
                                  isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                                }`}
                              >
                                ₹{venue.prices.single}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  isTerra
                                    ? 'bg-[#f0ece4] border-[#c4c8bc] text-[#2e3230] hover:text-[#4a7c59] hover:border-[#4a7c59]'
                                    : 'bg-slate-800 border-white/10 text-slate-200 hover:text-sky-300 hover:border-sky-400'
                                }`}
                                title="Get Google Maps Route Directions"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  turn_sharp_right
                                </span>
                              </a>
                              <button
                                onClick={() => onBookPass(venue)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:brightness-105 transition-all ${
                                  isTerra
                                    ? 'bg-[#4a7c59] text-white'
                                    : 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950'
                                }`}
                              >
                                Book Pass
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-[#4a7c59] mb-2">map</span>
            <p className="text-sm font-semibold">Google Maps API Key Required</p>
            <p className="text-xs opacity-70 mt-1 max-w-sm">
              Please enter your Google Maps API key using the key button in the top navigation.
            </p>
          </div>
        )}
      </div>

      {/* Floating Map Bottom Toolbar: Density Legend & Map Zoom Controls */}
      <div className="relative z-20 p-4 flex items-end justify-between gap-3 flex-wrap pointer-events-none">
        {/* Gate Density Legend Pill */}
        <div
          className={`px-4 py-2 rounded-xl shadow-md flex items-center gap-4 text-xs border pointer-events-auto backdrop-blur-md ${
            isTerra
              ? 'bg-white/95 border-[#c4c8bc]/80 text-[#2e3230]'
              : 'bg-slate-900/90 border-white/15 text-slate-100'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
            Gate Rush
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4a7c59]" />
            <span className="text-xs font-semibold">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold">Brisk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-rose-500">Near Capacity</span>
          </div>
        </div>

        {/* Map Utility Action Cluster */}
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-xl shadow-md border pointer-events-auto backdrop-blur-md ${
            isTerra
              ? 'bg-white/95 border-[#c4c8bc]/80'
              : 'bg-slate-900/90 border-white/15'
          }`}
        >
          <button
            onClick={handleZoomIn}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isTerra
                ? 'bg-[#f4efe6] text-[#2e3230] hover:text-[#4a7c59] hover:bg-[#e5ded3]'
                : 'bg-slate-800 text-slate-200 hover:text-sky-300 hover:bg-slate-700'
            }`}
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <button
            onClick={handleZoomOut}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isTerra
                ? 'bg-[#f4efe6] text-[#2e3230] hover:text-[#4a7c59] hover:bg-[#e5ded3]'
                : 'bg-slate-800 text-slate-200 hover:text-sky-300 hover:bg-slate-700'
            }`}
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <button
            onClick={handleCenterGps}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isTerra
                ? 'bg-[#f4efe6] text-[#4a7c59] hover:bg-[#e5ded3]'
                : 'bg-slate-800 text-sky-400 hover:bg-slate-700'
            }`}
            title="Center My GPS"
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>
      </div>
    </div>
  );
};
