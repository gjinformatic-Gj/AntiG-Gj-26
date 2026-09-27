import React from 'react';
import { Venue, ThemeMode } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  venues: Venue[];
  onBookVenue: (venue: Venue) => void;
  theme: ThemeMode;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  venues,
  onBookVenue,
  theme,
}) => {
  if (!isOpen) return null;

  const isTerra = theme === 'terra';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div
        className={`relative w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border transition-all ${
          isTerra
            ? 'bg-[#faf6f0] border-[#c4c8bc] text-[#2e3230]'
            : 'bg-[#0f172a] border-sky-400/30 text-slate-100 glow-cyan backdrop-blur-2xl'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 sm:p-6 border-b flex items-center justify-between ${
            isTerra ? 'bg-white border-[#e4e0d8]' : 'bg-slate-900 border-white/10'
          }`}
        >
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-widest ${
                isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
              }`}
            >
              Side-by-Side Arena Matrix
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-headline mt-1">
              Compare Venues & Pass Features
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                isTerra ? 'text-[#6b6358]' : 'text-slate-400'
              }`}
            >
              Analyze curfew hours, parking convenience, artists, and pricing across key grounds.
            </p>
          </div>

          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
              isTerra
                ? 'bg-[#f4efe6] border-[#c4c8bc] text-[#2e3230] hover:bg-[#e5ded3]'
                : 'bg-slate-800 border-white/10 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Matrix Table */}
        <div className="p-5 sm:p-6 overflow-x-auto flex-1">
          <table className="w-full min-w-[850px] border-collapse text-left text-xs">
            <thead>
              <tr
                className={`border-b uppercase font-semibold tracking-wider ${
                  isTerra
                    ? 'bg-white border-[#e4e0d8] text-[#6b6358]'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                <th className="py-3 px-4 rounded-l-xl">Venue & Location</th>
                <th className="py-3 px-4">Headline Performer</th>
                <th className="py-3 px-4">Curfew Directive</th>
                <th className="py-3 px-4">Parking & Sound</th>
                <th className="py-3 px-4">Pass Pricing</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 rounded-r-xl text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {venues.map((venue) => (
                <tr
                  key={venue.id}
                  className={`transition-colors ${
                    isTerra ? 'hover:bg-white/80' : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{venue.name}</span>
                      <span
                        className={`text-[11px] flex items-center gap-1 mt-0.5 ${
                          isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">pin_drop</span>
                        {venue.distanceKm} km • {venue.area}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border shrink-0">
                        <img
                          src={venue.artist.image}
                          alt={venue.artist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold">{venue.artist.name}</span>
                        <span className="text-[10px] opacity-70 truncate max-w-[140px]">
                          {venue.artist.genre}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        venue.isOvernight
                          ? isTerra
                            ? 'bg-[#4a7c59]/10 border-[#4a7c59]/25 text-[#4a7c59]'
                            : 'bg-sky-400/15 border-sky-400/30 text-sky-300'
                          : isTerra
                          ? 'bg-[#f0e8db] border-[#c4c8bc] text-[#5e5548]'
                          : 'bg-amber-400/15 border-amber-400/30 text-amber-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {venue.curfewTime}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span>{venue.parkingType}</span>
                      <span className="text-[10px] opacity-70">{venue.soundSystem}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-bold ${
                          isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                        }`}
                      >
                        ₹{venue.prices.single}{' '}
                        <span className="text-[10px] font-normal opacity-70">/ day</span>
                      </span>
                      <span className="text-[10px] opacity-70">
                        ₹{venue.prices.season} (Season)
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[15px] text-amber-500 fill-1">
                        star
                      </span>
                      <span>{venue.rating}</span>
                      <span className="text-[10px] opacity-60 font-normal">
                        ({venue.reviewsCount})
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => {
                        onClose();
                        onBookVenue(venue);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        isTerra
                          ? 'bg-[#4a7c59] text-white hover:bg-[#3d6749]'
                          : 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 hover:brightness-110'
                      }`}
                    >
                      Book Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
