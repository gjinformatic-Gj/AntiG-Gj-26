import React from 'react';
import { Venue, ThemeMode } from '../types';

interface VenueCardProps {
  venue: Venue;
  isSelected?: boolean;
  onSelect: () => void;
  onBook: () => void;
  theme: ThemeMode;
  variant?: 'compact' | 'standard';
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  isSelected,
  onSelect,
  onBook,
  theme,
  variant = 'compact',
}) => {
  const isTerra = theme === 'terra';

  if (variant === 'compact') {
    // Split View Side List Card (Image 3 design)
    return (
      <div
        onClick={onSelect}
        className={`rounded-2xl transition-all cursor-pointer border overflow-hidden ${
          isSelected
            ? isTerra
              ? 'terra-card-elevated border-[#4a7c59]/50 shadow-md ring-1 ring-[#4a7c59]/30'
              : 'glass-card border-sky-400/60 shadow-lg glow-cyan ring-1 ring-sky-400/40'
            : isTerra
            ? 'terra-card border-[#e8e2d8] hover:border-[#4a7c59]/40'
            : 'glass-panel border-white/10 hover:border-sky-400/30'
        }`}
      >
        {isSelected ? (
          <div>
            {/* Top Accent Line */}
            <div
              className={`h-1 w-full ${
                isTerra
                  ? 'bg-gradient-to-r from-[#4a7c59] via-[#78a886] to-[#c4a66a]'
                  : 'bg-gradient-to-r from-sky-400 via-primary to-purple-400'
              }`}
            />

            {/* Venue Photo Banner */}
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 ${
                  isTerra
                    ? 'bg-gradient-to-t from-white via-white/20 to-transparent'
                    : 'bg-gradient-to-t from-[#0e1626] via-[#0e1626]/40 to-transparent'
                }`}
              />

              {/* Badges on Image */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {venue.isCelebrity && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${
                      isTerra
                        ? 'bg-[#f8e0a8] text-[#221a05] border border-[#705c30]/20'
                        : 'bg-purple-400/20 text-purple-200 border border-purple-400/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full animate-ping ${
                        isTerra ? 'bg-[#705c30]' : 'bg-purple-300'
                      }`}
                    />
                    Celebrity Night
                  </span>
                )}
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm backdrop-blur-md ${
                    isTerra
                      ? 'bg-white/95 text-[#2e3230] border-[#c4c8bc]'
                      : 'bg-slate-900/90 text-slate-100 border-white/15'
                  }`}
                >
                  {venue.distanceKm} km ({venue.travelMinutes} mins)
                </span>
              </div>

              <div
                className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-lg flex items-center gap-1 border shadow-sm backdrop-blur-md ${
                  isTerra
                    ? 'bg-white/95 border-[#c4c8bc] text-[#2e3230]'
                    : 'bg-slate-900/90 border-white/15 text-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">
                  star
                </span>
                <span className="text-sm font-bold">{venue.rating}</span>
                <span className="text-xs opacity-70">({venue.reviewsCount})</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`text-lg font-bold block leading-tight font-headline ${
                      isTerra ? 'text-[#2e3230]' : 'text-slate-100'
                    }`}
                  >
                    {venue.name}
                  </span>
                  <span
                    className={`text-xs block mt-0.5 ${
                      isTerra ? 'text-[#4a4e4a]' : 'text-slate-400'
                    }`}
                  >
                    {venue.subtitle}
                  </span>
                </div>
                {venue.isOfficial && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isTerra
                        ? 'bg-[#4a7c59]/10 border-[#4a7c59]/30 text-[#4a7c59]'
                        : 'bg-sky-400/15 border-sky-400/30 text-sky-300'
                    }`}
                  >
                    Official Venue
                  </span>
                )}
              </div>

              {/* Performer Profile Box */}
              <div
                className={`p-3 rounded-xl flex items-center gap-3 border ${
                  isTerra
                    ? 'bg-[#f5f1ea] border-[#c4c8bc]/60'
                    : 'bg-slate-900/80 border-white/10'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border ${
                    isTerra ? 'border-[#4a7c59]/40' : 'border-sky-400/40'
                  }`}
                >
                  <img
                    src={venue.artist.image}
                    alt={venue.artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider block ${
                      isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                    }`}
                  >
                    Headlining Vocalist
                  </span>
                  <span
                    className={`text-sm font-bold truncate block ${
                      isTerra ? 'text-[#2e3230]' : 'text-slate-100'
                    }`}
                  >
                    {venue.artist.name}
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                  }`}
                >
                  mic
                </span>
              </div>

              {/* Curfew Pill */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  venue.isOvernight
                    ? isTerra
                      ? 'bg-[#4a7c59]/10 border-[#4a7c59]/25 text-[#4a7c59]'
                      : 'bg-sky-400/15 border-sky-400/30 text-sky-300'
                    : isTerra
                    ? 'bg-[#f0e8db] border-[#c4c8bc] text-[#5e5548]'
                    : 'bg-amber-400/15 border-amber-400/30 text-amber-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {venue.isOvernight ? 'bedtime' : 'schedule'}
                </span>
                <span>{venue.curfew}</span>
              </div>

              {/* Amenities checklist chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {venue.amenities.slice(0, 3).map((amenity, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                      isTerra
                        ? 'bg-[#f5f1ea] border-[#c4c8bc]/60 text-[#4a4e4a]'
                        : 'bg-slate-900/60 border-white/10 text-slate-300'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[14px] ${
                        isTerra ? 'text-[#4a7c59]' : 'text-sky-400'
                      }`}
                    >
                      check_circle
                    </span>
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Pricing & Booking CTA */}
              <div
                className={`pt-2 flex items-center justify-between gap-3 border-t ${
                  isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
                }`}
              >
                <div>
                  <span
                    className={`text-[11px] block font-semibold ${
                      isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                    }`}
                  >
                    Single Entry Pass
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-xl font-bold ${
                        isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                      }`}
                    >
                      ₹{venue.prices.single}
                    </span>
                    {venue.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{venue.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                      isTerra
                        ? 'bg-[#f5f1ea] border-[#c4c8bc] text-[#2e3230] hover:border-[#4a7c59] hover:text-[#4a7c59]'
                        : 'bg-slate-800 border-white/15 text-slate-200 hover:text-sky-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">navigation</span>
                    <span>Route</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBook();
                    }}
                    className={`px-5 py-2 rounded-lg text-xs font-bold shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 ${
                      isTerra
                        ? 'bg-[#4a7c59] text-white'
                        : 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 font-extrabold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      confirmation_number
                    </span>
                    <span>Book Tonight</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Unselected Quick Summary Card */
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-base font-bold font-headline ${
                      isTerra ? 'text-[#2e3230]' : 'text-slate-100'
                    }`}
                  >
                    {venue.name}
                  </span>
                  {venue.soldPercent && venue.soldPercent > 80 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 text-[10px] font-bold animate-pulse">
                      {venue.soldPercent}% Sold
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs mt-0.5 block ${
                    isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                  }`}
                >
                  {venue.subtitle} • {venue.distanceKm} km away
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  isTerra
                    ? 'bg-[#4a7c59]/10 text-[#4a7c59] border-[#4a7c59]/20'
                    : 'bg-sky-400/15 text-sky-300 border-sky-400/30'
                }`}
              >
                ★ {venue.rating}
              </span>
            </div>

            {/* Performer info */}
            <div
              className={`flex items-center gap-2 text-xs ${
                isTerra ? 'text-[#2e3230]' : 'text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-amber-500 text-[18px]">
                graphic_eq
              </span>
              <span>
                Featuring <strong>{venue.artist.name}</strong>
              </span>
            </div>

            {/* Timing Chip */}
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  venue.isOvernight
                    ? isTerra
                      ? 'bg-[#4a7c59]/10 border border-[#4a7c59]/20 text-[#4a7c59] font-bold'
                      : 'bg-sky-400/15 text-sky-300 border border-sky-400/30'
                    : isTerra
                    ? 'bg-[#f0e8db] text-[#5e5548]'
                    : 'bg-amber-400/15 text-amber-200 border border-amber-400/30'
                }`}
              >
                {venue.isOvernight ? '🌙 ' : '⏰ '}
                {venue.curfew}
              </span>
              <span
                className={`text-xs ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                {venue.parkingType}
              </span>
            </div>

            {/* Price & Quick Select */}
            <div
              className={`pt-2 flex items-center justify-between border-t ${
                isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
              }`}
            >
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-lg font-bold ${
                    isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                  }`}
                >
                  ₹{venue.prices.single}
                </span>
                <span
                  className={`text-xs ${
                    isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                  }`}
                >
                  / person
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isTerra
                    ? 'bg-[#f4efe6] border-[#c4c8bc] text-[#2e3230] hover:border-[#4a7c59] hover:text-[#4a7c59]'
                    : 'bg-slate-800 border-white/15 text-slate-200 hover:text-sky-300'
                }`}
              >
                Quick Select
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard Grid Card (Image 5 Explore Venues design)
  return (
    <div
      className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border ${
        isTerra
          ? 'bg-white border-[#e8e2d8] hover:border-[#4a7c59]/50 shadow-md'
          : 'glass-card hover:bg-slate-850/80 border-sky-400/20 hover:border-sky-400/40 shadow-xl'
      }`}
    >
      {/* Card Header Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className={`absolute inset-0 ${
            isTerra
              ? 'bg-gradient-to-t from-white/90 via-transparent to-black/30'
              : 'bg-gradient-to-t from-[#0e1626] via-transparent to-black/40'
          }`}
        />

        {/* Curfew Badge Top Right */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md ${
              isTerra
                ? 'bg-[#4a7c59] text-white'
                : 'bg-sky-500/80 text-slate-950 font-extrabold'
            }`}
          >
            <span className="material-symbols-outlined text-xs">nest_clock_farsight_analog</span>
            {venue.curfewTime}
          </span>
        </div>

        {/* Distance Pill Top Left */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 backdrop-blur-md ${
              isTerra
                ? 'bg-white/90 text-[#2e3230]'
                : 'bg-slate-900/80 text-slate-100'
            }`}
          >
            <span
              className={`material-symbols-outlined text-xs ${
                isTerra ? 'text-[#4a7c59]' : 'text-sky-400'
              }`}
            >
              near_me
            </span>
            {venue.distanceKm} km away
          </span>
        </div>

        {/* Rush Pill Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 backdrop-blur-md ${
              venue.rushLevel === 'Near Capacity'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : venue.rushLevel === 'Brisk'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : isTerra
                ? 'bg-white/90 text-[#4a7c59]'
                : 'bg-slate-900/90 text-sky-300'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                venue.rushLevel === 'Near Capacity'
                  ? 'bg-rose-500 animate-ping'
                  : venue.rushLevel === 'Brisk'
                  ? 'bg-amber-500'
                  : isTerra
                  ? 'bg-[#4a7c59]'
                  : 'bg-sky-400'
              }`}
            />
            Rush: {venue.rushLevel}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className={`font-headline font-bold text-lg leading-snug group-hover:text-primary transition-colors ${
                  isTerra ? 'text-[#2e3230]' : 'text-slate-100'
                }`}
              >
                {venue.name}
              </h3>
              <p
                className={`text-xs flex items-center gap-1 mt-0.5 ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xs ${
                    isTerra ? 'text-[#4a7c59]' : 'text-sky-400'
                  }`}
                >
                  place
                </span>
                {venue.location}
              </p>
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                isTerra
                  ? 'bg-[#f0ece4] text-[#2e3230]'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              <span className="text-amber-500 font-bold">★</span>
              <span>{venue.rating}</span>
              <span className="text-[10px] opacity-70 font-normal">
                ({venue.reviewsCount})
              </span>
            </div>
          </div>

          {/* Tonight's Headliner Artist Box */}
          <div
            className={`p-2.5 rounded-xl flex items-center justify-between ${
              isTerra ? 'bg-[#f5f1ea]' : 'bg-slate-900/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isTerra
                    ? 'bg-[#4a7c59]/20 text-[#4a7c59]'
                    : 'bg-sky-400/20 text-sky-300'
                }`}
              >
                <span className="material-symbols-outlined text-base">mic</span>
              </div>
              <div>
                <div
                  className={`text-[10px] ${
                    isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                  }`}
                >
                  Tonight's Artist
                </div>
                <div
                  className={`text-xs font-bold truncate max-w-[180px] ${
                    isTerra ? 'text-[#2e3230]' : 'text-slate-100'
                  }`}
                >
                  {venue.artist.name}
                </div>
              </div>
            </div>

            {/* Audio Wave Pill */}
            <div className="flex items-end gap-0.5 h-4">
              <span
                className={`w-0.5 h-2 rounded-full animate-pulse ${
                  isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                }`}
              />
              <span
                className={`w-0.5 h-4 rounded-full ${
                  isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                }`}
              />
              <span
                className={`w-0.5 h-3 rounded-full animate-pulse ${
                  isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                }`}
              />
              <span
                className={`w-0.5 h-1.5 rounded-full ${
                  isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                }`}
              />
            </div>
          </div>

          {/* Amenity Icons Strip */}
          <div
            className={`flex items-center gap-3 text-xs pt-1 flex-wrap ${
              isTerra ? 'text-[#6b6358]' : 'text-slate-400'
            }`}
          >
            {venue.amenities.map((amenity, i) => (
              <span key={i} className="flex items-center gap-1">
                <span
                  className={`material-symbols-outlined text-sm ${
                    isTerra ? 'text-[#4a7c59]' : 'text-sky-400'
                  }`}
                >
                  verified
                </span>
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Price and Action Bar */}
        <div
          className={`pt-3 border-t flex items-center justify-between ${
            isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
          }`}
        >
          <div>
            <div
              className={`text-[10px] uppercase font-semibold ${
                isTerra ? 'text-[#6b6358]' : 'text-slate-400'
              }`}
            >
              From
            </div>
            <div
              className={`text-lg font-bold font-headline ${
                isTerra ? 'text-[#2e3230]' : 'text-slate-100'
              }`}
            >
              ₹{venue.prices.single}{' '}
              <span
                className={`text-xs font-normal ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                / pass
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSelect}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isTerra
                  ? 'bg-[#f4efe6] border-[#c4c8bc] text-[#2e3230] hover:border-[#4a7c59]'
                  : 'bg-slate-800 border-white/10 text-slate-200 hover:text-sky-300'
              }`}
            >
              View on Map
            </button>
            <button
              onClick={onBook}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                isTerra
                  ? 'bg-[#4a7c59] text-white hover:bg-[#3d6749]'
                  : 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 hover:brightness-110'
              }`}
            >
              <span>Select Passes</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
