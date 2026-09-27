import React from 'react';
import { ThemeMode } from '../types';

interface NavbarProps {
  currentView: 'map' | 'explore' | 'artists' | 'compare' | 'wallet';
  onSelectView: (view: 'map' | 'explore' | 'artists' | 'compare' | 'wallet') => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  ticketCount: number;
  onOpenWallet: () => void;
  onOpenApiKeyModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  theme,
  onToggleTheme,
  ticketCount,
  onOpenWallet,
  onOpenApiKeyModal,
  searchQuery,
  onSearchChange,
}) => {
  const isTerra = theme === 'terra';

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-colors duration-300 ${
        isTerra
          ? 'bg-[#faf6f0]/95 backdrop-blur-md border-b border-[#e4e0d8] shadow-[0_2px_15px_rgba(46,50,48,0.05)]'
          : 'bg-[#0b0f19]/85 backdrop-blur-2xl border-b border-sky-400/15 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
      }`}
    >
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <div
            onClick={() => onSelectView('map')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              <div
                className={`absolute -inset-1 rounded-xl blur-sm transition-all ${
                  isTerra ? 'bg-[#4a7c59]/20' : 'bg-sky-400/25'
                }`}
              />
              <div
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                  isTerra
                    ? 'bg-gradient-to-br from-[#4a7c59] to-[#78a886] text-white'
                    : 'bg-gradient-to-tr from-sky-500/30 to-sky-400/10 border border-sky-400/40 text-sky-300'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">radar</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span
                className={`text-base sm:text-lg font-bold tracking-tight flex items-center gap-1.5 ${
                  isTerra ? 'text-[#2e3230]' : 'text-slate-100'
                }`}
              >
                Garba Radar
                <span
                  className={`w-2 h-2 rounded-full animate-ping ${
                    isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                  }`}
                />
              </span>
              <span
                className={`text-[10px] uppercase tracking-widest font-bold ${
                  isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                }`}
              >
                Navratri 2026
              </span>
            </div>
          </div>

          {/* Region Chip */}
          <div
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              isTerra
                ? 'bg-[#f4efe6] text-[#2e3230] border-[#e5ded3] hover:border-[#4a7c59]'
                : 'bg-slate-900/80 text-slate-200 border-white/10 hover:border-sky-400/40'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-[#4a7c59]">location_on</span>
            <span>Ahmedabad / Gandhinagar</span>
            <span className="material-symbols-outlined text-[15px] opacity-60">keyboard_arrow_down</span>
          </div>

          {/* Live indicator */}
          <div
            className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
              isTerra
                ? 'bg-[#4a7c59]/10 border-[#4a7c59]/25 text-[#4a7c59]'
                : 'bg-sky-400/10 border-sky-400/25 text-sky-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
              }`}
            />
            <span>18 Grounds Live Tonight</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm relative items-center">
          <span
            className={`material-symbols-outlined absolute left-3.5 text-[18px] ${
              isTerra ? 'text-[#6b6358]' : 'text-slate-400'
            }`}
          >
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search venue, artist, or belt..."
            className={`w-full pl-10 pr-4 py-2 rounded-full text-xs focus:outline-none transition-all shadow-sm ${
              isTerra
                ? 'bg-white border border-[#c4c8bc] text-[#2e3230] placeholder-[#6b6358]/70 focus:border-[#4a7c59] focus:ring-1 focus:ring-[#4a7c59]/30'
                : 'bg-slate-900/90 border border-white/15 text-slate-100 placeholder-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40'
            }`}
          />
        </div>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onSelectView('map')}
            className={`px-3 py-1.5 rounded-full text-xs transition-all font-semibold ${
              currentView === 'map'
                ? isTerra
                  ? 'bg-[#4a7c59] text-white shadow-sm font-bold'
                  : 'bg-sky-400/20 text-sky-300 border border-sky-400/40 font-bold'
                : isTerra
                ? 'text-[#4a4e4a] hover:text-[#2e3230] hover:bg-[#f0ece4]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            Live Venue Map
          </button>
          <button
            onClick={() => onSelectView('explore')}
            className={`px-3 py-1.5 rounded-full text-xs transition-all font-semibold ${
              currentView === 'explore'
                ? isTerra
                  ? 'bg-[#4a7c59] text-white shadow-sm font-bold'
                  : 'bg-sky-400/20 text-sky-300 border border-sky-400/40 font-bold'
                : isTerra
                ? 'text-[#4a4e4a] hover:text-[#2e3230] hover:bg-[#f0ece4]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            Explore Venues
          </button>
          <button
            onClick={() => onSelectView('compare')}
            className={`px-3 py-1.5 rounded-full text-xs transition-all font-semibold ${
              currentView === 'compare'
                ? isTerra
                  ? 'bg-[#4a7c59] text-white shadow-sm font-bold'
                  : 'bg-sky-400/20 text-sky-300 border border-sky-400/40 font-bold'
                : isTerra
                ? 'text-[#4a4e4a] hover:text-[#2e3230] hover:bg-[#f0ece4]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            Compare Venues
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            title={isTerra ? 'Switch to Glacier Dark Glass Theme' : 'Switch to Terra Warm Organic Theme'}
            className={`p-2 rounded-full border text-xs flex items-center gap-1 transition-all ${
              isTerra
                ? 'bg-white border-[#c4c8bc] text-[#2e3230] hover:border-[#4a7c59]'
                : 'bg-slate-900 border-white/15 text-sky-300 hover:border-sky-400'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isTerra ? 'dark_mode' : 'light_mode'}
            </span>
            <span className="hidden sm:inline font-semibold">
              {isTerra ? 'Glacier' : 'Terra'}
            </span>
          </button>

          {/* Maps API Key Settings Button */}
          <button
            onClick={onOpenApiKeyModal}
            title="Configure or inspect Google Maps API Key"
            className={`p-2 rounded-full border text-xs flex items-center gap-1 transition-all ${
              isTerra
                ? 'bg-white border-[#c4c8bc] text-[#4a7c59] hover:bg-[#f0ece4]'
                : 'bg-slate-900 border-white/15 text-sky-300 hover:border-sky-400'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            <span className="hidden xl:inline font-semibold">Maps Key</span>
          </button>

          {/* My Passes Wallet Button */}
          <button
            onClick={onOpenWallet}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-sm ${
              isTerra
                ? 'bg-white border-[#c4c8bc] text-[#2e3230] hover:border-[#4a7c59] hover:text-[#4a7c59]'
                : 'bg-sky-500/20 text-sky-200 border-sky-400/40 hover:bg-sky-500/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#4a7c59]">
              confirmation_number
            </span>
            <span className="hidden sm:inline">My Passes</span>
            {ticketCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${
                  isTerra ? 'bg-[#4a7c59]' : 'bg-sky-500'
                }`}
              >
                {ticketCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
