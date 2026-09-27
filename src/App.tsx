import { useState, useEffect } from 'react';
import { VENUES } from './data/venues';
import { Venue, ThemeMode, BookingState, ConfirmedTicket } from './types';
import { Navbar } from './components/Navbar';
import { GoogleMapView } from './components/GoogleMapView';
import { VenueCard } from './components/VenueCard';
import { BookingModal } from './components/BookingModal';
import { DummyPaymentGateway } from './components/DummyPaymentGateway';
import { PassWalletModal } from './components/PassWalletModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { CompareModal } from './components/CompareModal';

const DEFAULT_MAPS_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyBC9pStR6UNt8zbge_Pr9ZDiKKdCGsw4kM';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('terra');
  const [currentView, setCurrentView] = useState<'map' | 'explore' | 'artists' | 'compare' | 'wallet'>('map');
  const [venues] = useState<Venue[]>(VENUES);
  const [selectedVenue, setSelectedVenue] = useState<Venue>(VENUES[0]);
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map layer states
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showParking, setShowParking] = useState(true);

  // Bottom dock pass tier selection
  const [dockPassTier, setDockPassTier] = useState<'single' | 'couple' | 'season'>('single');
  const [dockPassCount, setDockPassCount] = useState<number>(1);

  // Modals & Gateway states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingVenue, setBookingVenue] = useState<Venue | null>(null);
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookingState | null>(null);
  const [gatewayAmount, setGatewayAmount] = useState<number>(0);

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Google Maps Key stored state
  const [mapsApiKey, setMapsApiKey] = useState<string>(() => {
    return localStorage.getItem('garba_radar_maps_key') || DEFAULT_MAPS_KEY;
  });

  // Confirmed tickets in wallet
  const [tickets, setTickets] = useState<ConfirmedTicket[]>(() => {
    const saved = localStorage.getItem('garba_radar_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        ticketId: 'PASS-NAV26-783912',
        venueId: 'royal-united-club',
        venueName: 'Royal United Club Ground',
        venueLocation: 'Bodakdev, Opp. Pakwan, SG Highway, Ahmedabad',
        attendeeName: 'Aarav Patel',
        attendeePhone: '+91 98250 12345',
        passType: 'season',
        selectedDate: 'All 9 Nights (Oct 11 - 19)',
        counts: { female: 1, male: 0, couple: 1 },
        totalPaid: 4128,
        transactionId: 'TXN_GPAY_M9A28B',
        paymentMethod: 'UPI',
        purchaseDate: '26 Sep 2026, 09:42 PM',
        curfewInfo: '3:00 AM Overnight Verified',
        qrCodeData: 'https://garbaradar.in/verify/PASS-NAV26-783912',
        barcode: 'NR26-ROY-783912',
        rfidStatus: 'Issued',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('garba_radar_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleSaveApiKey = (newKey: string) => {
    setMapsApiKey(newKey);
    localStorage.setItem('garba_radar_maps_key', newKey);
  };

  const handleOpenBooking = (venue: Venue) => {
    setBookingVenue(venue);
    setIsBookingModalOpen(true);
  };

  const handleProceedToPayment = (booking: BookingState, total: number) => {
    setIsBookingModalOpen(false);
    setActiveBooking(booking);
    setGatewayAmount(total);
    setIsPaymentGatewayOpen(true);
  };

  const handlePaymentSuccess = (newTicket: ConfirmedTicket) => {
    setIsPaymentGatewayOpen(false);
    setTickets((prev) => [newTicket, ...prev]);
    setIsWalletOpen(true);
  };

  const handleDockBookNow = () => {
    const basePrice =
      dockPassTier === 'single'
        ? selectedVenue.prices.single
        : dockPassTier === 'couple'
        ? selectedVenue.prices.couple
        : selectedVenue.prices.season;

    const subtotal = dockPassCount * basePrice;
    const total = Math.round(subtotal * 1.18);

    const booking: BookingState = {
      venue: selectedVenue,
      passType: dockPassTier === 'season' ? 'season' : 'single',
      selectedDate: dockPassTier === 'season' ? '9-Night Season' : 'Oct 14 (Day 4 Maha Raas)',
      counts: {
        female: dockPassTier === 'single' ? dockPassCount : 0,
        male: 0,
        couple: dockPassTier === 'couple' ? dockPassCount : dockPassTier === 'season' ? dockPassCount : 0,
      },
      paymentMethod: 'upi',
      attendeeName: 'Aarav Patel',
      attendeePhone: '+91 98250 12345',
    };

    setActiveBooking(booking);
    setGatewayAmount(total);
    setIsPaymentGatewayOpen(true);
  };

  // Filter venues based on active filter pills & search
  const filteredVenues = venues.filter((venue) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = venue.name.toLowerCase().includes(q);
      const matchArtist = venue.artist.name.toLowerCase().includes(q);
      const matchArea = venue.area.toLowerCase().includes(q);
      if (!matchName && !matchArtist && !matchArea) return false;
    }

    if (activeFilter === 'overnight') return venue.isOvernight;
    if (activeFilter === 'curfew12') return !venue.isOvernight;
    if (activeFilter === 'celebrity') return venue.isCelebrity;
    if (activeFilter === 'fast_selling') return (venue.soldPercent || 0) > 80;
    if (activeFilter === 'valet') return venue.amenities.some((a) => a.toLowerCase().includes('valet'));
    return true;
  });

  const isTerra = theme === 'terra';

  // Bottom dock price computation
  const dockBasePrice =
    dockPassTier === 'single'
      ? selectedVenue.prices.single
      : dockPassTier === 'couple'
      ? selectedVenue.prices.couple
      : selectedVenue.prices.season;
  const dockSubtotal = dockPassCount * dockBasePrice;
  const dockTotalWithGst = Math.round(dockSubtotal * 1.18);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative selection:bg-[#4a7c59] selection:text-white ${
        isTerra
          ? 'bg-[#faf6f0] text-[#2e3230] terra-theme'
          : 'bg-[#0a0e1a] text-slate-100 dark'
      }`}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isTerra ? (
          <>
            <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#4a7c59]/10 rounded-full blur-[140px]" />
            <div className="absolute top-[40%] right-[-100px] w-[500px] h-[500px] bg-[#f8e0a8]/30 rounded-full blur-[130px]" />
            <div className="absolute bottom-10 left-1/3 w-[650px] h-[650px] bg-[#f0e8db]/40 rounded-full blur-[150px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-48 left-1/4 w-[750px] h-[650px] bg-sky-400/10 rounded-full blur-[160px]" />
            <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[170px]" />
            <div className="absolute -bottom-40 left-10 w-[650px] h-[600px] bg-purple-500/10 rounded-full blur-[180px]" />
          </>
        )}
      </div>

      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => {
          if (v === 'compare') {
            setIsCompareOpen(true);
          } else if (v === 'wallet') {
            setIsWalletOpen(true);
          } else {
            setCurrentView(v);
          }
        }}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'terra' ? 'glacier' : 'terra'))}
        ticketCount={tickets.length}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="w-full pt-24 relative z-10 pb-16">
        {currentView === 'map' ? (
          /* ==============================================================
             SCREEN 1: LIVE GARBA GROUND RADAR DASHBOARD (Matching Image 3)
             ============================================================== */
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Top Sub-header & Filter Toolbar */}
            <div
              className={`rounded-2xl p-4 md:p-5 shadow-sm flex flex-col gap-4 border ${
                isTerra
                  ? 'terra-card border-[#e8e2d8]'
                  : 'glass-panel border-sky-400/20 glow-cyan'
              }`}
            >
              {/* Title & Live Venue Pulse Bar */}
              <div
                className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b ${
                  isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-3 h-3 rounded-full animate-ping ${
                        isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                      }`}
                    />
                    <div
                      className={`w-2.5 h-2.5 rounded-full absolute ${
                        isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                      }`}
                    />
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight font-headline">
                    Live Garba Ground Radar
                  </h1>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold border ${
                      isTerra
                        ? 'bg-[#f0ece4] text-[#4a7c59] border-[#4a7c59]/20'
                        : 'bg-sky-400/15 text-sky-300 border-sky-400/30'
                    }`}
                  >
                    Ahmedabad – Gandhinagar Belt
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs flex-wrap opacity-90">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                      }`}
                    />
                    <span className="font-bold">{venues.length} Venues Near You</span>
                  </div>
                  <span className="opacity-40">/</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-bold text-amber-500">4 Headliners Live Now</span>
                  </div>
                  <span className="opacity-40">/</span>
                  <span className="text-[11px] uppercase tracking-wider font-bold opacity-75">
                    Night 04 • Maha Raas Tonight
                  </span>
                </div>
              </div>

              {/* Controls & Filter Chips Row */}
              <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
                {/* Distance Radius Pills */}
                <div
                  className={`flex items-center gap-1 p-1 rounded-full border overflow-x-auto shrink-0 ${
                    isTerra
                      ? 'bg-[#f5f1ea] border-[#c4c8bc]/60'
                      : 'bg-slate-900 border-white/10'
                  }`}
                >
                  <span className="text-[11px] px-3 uppercase tracking-wider font-bold hidden sm:inline opacity-70">
                    Radius
                  </span>
                  {[3, 5, 10, 25].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRadiusKm(r)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        radiusKm === r
                          ? isTerra
                            ? 'bg-[#4a7c59] text-white shadow-sm font-bold'
                            : 'bg-sky-400 text-slate-950 font-extrabold shadow-sm'
                          : isTerra
                          ? 'text-[#6b6358] hover:text-[#2e3230] hover:bg-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r === 25 ? '25 km (All)' : r === 5 ? '5 km Active' : `Within ${r} km`}
                    </button>
                  ))}
                </div>

                {/* Filter Chips Carousel */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 no-scrollbar">
                  <button
                    onClick={() => setActiveFilter(activeFilter === 'overnight' ? 'all' : 'overnight')}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                      activeFilter === 'overnight'
                        ? isTerra
                          ? 'bg-[#4a7c59] text-white border-[#4a7c59]'
                          : 'bg-sky-400 text-slate-950 border-sky-400'
                        : isTerra
                        ? 'bg-[#4a7c59]/10 border-[#4a7c59]/30 text-[#4a7c59]'
                        : 'bg-sky-400/10 border-sky-400/30 text-sky-300'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>Overnight Allowed (3 AM)</span>
                  </button>

                  <button
                    onClick={() => setActiveFilter(activeFilter === 'curfew12' ? 'all' : 'curfew12')}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                      activeFilter === 'curfew12'
                        ? isTerra
                          ? 'bg-[#705c30] text-white border-[#705c30]'
                          : 'bg-amber-400 text-slate-950 border-amber-400'
                        : isTerra
                        ? 'bg-[#f4efe6] border-[#e5ded3] text-[#6b6358]'
                        : 'bg-slate-900 border-white/10 text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>Strict 12 AM Curfew</span>
                  </button>

                  <button
                    onClick={() => setActiveFilter(activeFilter === 'valet' ? 'all' : 'valet')}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                      activeFilter === 'valet'
                        ? isTerra
                          ? 'bg-[#4a7c59] text-white border-[#4a7c59]'
                          : 'bg-sky-400 text-slate-950 border-sky-400'
                        : isTerra
                        ? 'bg-[#f4efe6] border-[#e5ded3] text-[#6b6358]'
                        : 'bg-slate-900 border-white/10 text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">local_parking</span>
                    <span>Valet Available</span>
                  </button>

                  <button
                    onClick={() => setActiveFilter(activeFilter === 'celebrity' ? 'all' : 'celebrity')}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                      activeFilter === 'celebrity'
                        ? isTerra
                          ? 'bg-[#f8e0a8] text-[#221a05] border-amber-400 font-bold'
                          : 'bg-purple-300 text-purple-950 border-purple-300 font-bold'
                        : isTerra
                        ? 'bg-[#f8e0a8]/80 text-[#554020] border-[#705c30]/20'
                        : 'bg-purple-400/20 text-purple-300 border-purple-400/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">stars</span>
                    <span>Celebrity Tonight</span>
                  </button>

                  <button
                    onClick={() => setActiveFilter(activeFilter === 'fast_selling' ? 'all' : 'fast_selling')}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                      activeFilter === 'fast_selling'
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/25'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                    <span>&gt;80% Sold Out</span>
                  </button>
                </div>

                {/* View Switcher */}
                <div
                  className={`flex items-center gap-1 p-1 rounded-full border shrink-0 self-end xl:self-auto ${
                    isTerra
                      ? 'bg-[#f5f1ea] border-[#c4c8bc]/60'
                      : 'bg-slate-900 border-white/10'
                  }`}
                >
                  <button
                    onClick={() => setViewMode('split')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'split'
                        ? isTerra
                          ? 'bg-[#4a7c59] text-white shadow-sm'
                          : 'bg-sky-400 text-slate-950 shadow-sm'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">splitscreen</span>
                    <span>Split View</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === 'map'
                        ? isTerra
                          ? 'bg-[#4a7c59] text-white shadow-sm'
                          : 'bg-sky-400 text-slate-950 shadow-sm'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    <span>Map Only</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? isTerra
                          ? 'bg-[#4a7c59] text-white shadow-sm'
                          : 'bg-sky-400 text-slate-950 shadow-sm'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">view_list</span>
                    <span>List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Split Screen Workspace: Google Map + Discoveries Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Map Column */}
              {(viewMode === 'split' || viewMode === 'map') && (
                <div className={viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-7'}>
                  <GoogleMapView
                    venues={filteredVenues}
                    selectedVenue={selectedVenue}
                    onSelectVenue={setSelectedVenue}
                    onBookPass={handleOpenBooking}
                    apiKey={mapsApiKey}
                    theme={theme}
                    radiusKm={radiusKm}
                    onRadiusChange={setRadiusKm}
                    showHeatmap={showHeatmap}
                    onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
                    showTraffic={showTraffic}
                    onToggleTraffic={() => setShowTraffic(!showTraffic)}
                    showParking={showParking}
                    onToggleParking={() => setShowParking(!showParking)}
                  />
                </div>
              )}

              {/* Discovery Column */}
              {(viewMode === 'split' || viewMode === 'list') && (
                <div
                  className={`${
                    viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-5'
                  } flex flex-col gap-4 h-[680px] lg:h-[740px] overflow-y-auto pr-1`}
                >
                  {/* Selected Active Venue on Top */}
                  <VenueCard
                    venue={selectedVenue}
                    isSelected={true}
                    onSelect={() => {}}
                    onBook={() => handleOpenBooking(selectedVenue)}
                    theme={theme}
                  />

                  {/* Other Venues in Side List */}
                  {filteredVenues
                    .filter((v) => v.id !== selectedVenue.id)
                    .map((venue) => (
                      <VenueCard
                        key={venue.id}
                        venue={venue}
                        isSelected={false}
                        onSelect={() => setSelectedVenue(venue)}
                        onBook={() => handleOpenBooking(venue)}
                        theme={theme}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Instant Pass Booking Bottom Dock (Matching Image 3 Bottom Drawer) */}
            <div
              className={`rounded-2xl p-5 md:p-6 shadow-md space-y-5 border transition-all ${
                isTerra
                  ? 'terra-card border-[#4a7c59]/40'
                  : 'glass-panel border-sky-400/30 glow-cyan'
              }`}
              id="bookingDrawer"
            >
              <div
                className={`flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b ${
                  isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                      isTerra
                        ? 'bg-[#4a7c59]/10 text-[#4a7c59] border-[#4a7c59]/30'
                        : 'bg-sky-400/20 text-sky-300 border-sky-400/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      confirmation_number
                    </span>
                  </div>
                  <div>
                    <span className="text-lg md:text-xl font-bold block leading-tight font-headline">
                      Instant Pass Checkout
                    </span>
                    <span
                      className={`text-xs ${
                        isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                      }`}
                    >
                      Selected Venue:{' '}
                      <strong className={isTerra ? 'text-[#4a7c59]' : 'text-sky-300'}>
                        {selectedVenue.name}
                      </strong>{' '}
                      • Ahmedabad
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] uppercase px-3 py-1 rounded-full font-bold tracking-wider border self-start md:self-auto ${
                    isTerra
                      ? 'bg-[#4a7c59]/10 border-[#4a7c59]/30 text-[#4a7c59]'
                      : 'bg-sky-400/15 border-sky-400/30 text-sky-300'
                  }`}
                >
                  Curfew: {selectedVenue.curfewTime}
                </span>
              </div>

              {/* Pass Tier Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Single Night */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="dockTier"
                    checked={dockPassTier === 'single'}
                    onChange={() => setDockPassTier('single')}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between h-full space-y-3 shadow-sm ${
                      dockPassTier === 'single'
                        ? isTerra
                          ? 'terra-card-elevated border-[#4a7c59] ring-2 ring-[#4a7c59]/20'
                          : 'glass-card border-sky-400 ring-2 ring-sky-400/30'
                        : isTerra
                        ? 'terra-card border-[#c4c8bc]'
                        : 'bg-slate-900/50 border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold font-headline">Single Night Entry</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isTerra
                              ? 'bg-[#4a7c59]/15 text-[#4a7c59] border-[#4a7c59]/20'
                              : 'bg-sky-400/20 text-sky-200 border-sky-400/40'
                          }`}
                        >
                          Tonight Only
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                        }`}
                      >
                        General arena access, open dancing circles, food zone access.
                      </p>
                    </div>
                    <div
                      className={`flex items-baseline justify-between pt-2 border-t ${
                        isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
                      }`}
                    >
                      <span
                        className={`text-xl font-bold ${
                          isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                        }`}
                      >
                        ₹{selectedVenue.prices.single}
                      </span>
                      <span className="text-[11px] opacity-70 font-semibold">+ 18% GST</span>
                    </div>
                  </div>
                </label>

                {/* VIP Couple Pass */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="dockTier"
                    checked={dockPassTier === 'couple'}
                    onChange={() => setDockPassTier('couple')}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between h-full space-y-3 shadow-sm ${
                      dockPassTier === 'couple'
                        ? isTerra
                          ? 'terra-card-elevated border-[#4a7c59] ring-2 ring-[#4a7c59]/20'
                          : 'glass-card border-sky-400 ring-2 ring-sky-400/30'
                        : isTerra
                        ? 'terra-card border-[#c4c8bc]'
                        : 'bg-slate-900/50 border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold font-headline">VIP Couple Pass</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isTerra
                              ? 'bg-[#f8e0a8] text-[#554020] border-[#705c30]/20'
                              : 'bg-purple-300/20 text-purple-200 border-purple-400/40'
                          }`}
                        >
                          Priority Gate
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                        }`}
                      >
                        Entry for 2, Valet access, Inner Stage circle access, 2 Dandiya sticks.
                      </p>
                    </div>
                    <div
                      className={`flex items-baseline justify-between pt-2 border-t ${
                        isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
                      }`}
                    >
                      <span className="text-xl font-bold text-amber-500">
                        ₹{selectedVenue.prices.couple}
                      </span>
                      <span className="text-[11px] opacity-70 font-semibold">+ 18% GST</span>
                    </div>
                  </div>
                </label>

                {/* Full 9-Night Season */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="dockTier"
                    checked={dockPassTier === 'season'}
                    onChange={() => setDockPassTier('season')}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between h-full space-y-3 shadow-sm ${
                      dockPassTier === 'season'
                        ? isTerra
                          ? 'terra-card-elevated border-[#4a7c59] ring-2 ring-[#4a7c59]/20'
                          : 'glass-card border-sky-400 ring-2 ring-sky-400/30'
                        : isTerra
                        ? 'terra-card border-[#c4c8bc]'
                        : 'bg-slate-900/50 border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold font-headline">Full 9-Night Season</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold">
                          Best Value
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                        }`}
                      >
                        All nights access, RFID smart wristband, guest lounge entry anytime.
                      </p>
                    </div>
                    <div
                      className={`flex items-baseline justify-between pt-2 border-t ${
                        isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
                      }`}
                    >
                      <span
                        className={`text-xl font-bold ${
                          isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                        }`}
                      >
                        ₹{selectedVenue.prices.season}
                      </span>
                      <span className="text-[11px] opacity-70 font-semibold">+ 18% GST</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Stepper, Hologram Mockup & Payment CTA */}
              <div
                className={`p-4 rounded-xl border flex flex-col lg:flex-row items-center justify-between gap-5 ${
                  isTerra
                    ? 'bg-[#f5f1ea] border-[#c4c8bc]'
                    : 'bg-slate-900/80 border-white/10'
                }`}
              >
                {/* Left: Hologram RFID E-Pass Mockup */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div
                    className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-sm ${
                      isTerra
                        ? 'bg-white border-[#4a7c59]/30 text-[#4a7c59]'
                        : 'bg-slate-800 border-sky-400/40 text-sky-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
                    <div
                      className={`absolute bottom-0 w-full h-1 ${
                        isTerra
                          ? 'bg-gradient-to-r from-[#4a7c59] to-[#78a886]'
                          : 'bg-gradient-to-r from-sky-400 to-primary'
                      }`}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-headline">Instant RFID E-Pass</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isTerra
                            ? 'bg-[#4a7c59]/10 border-[#4a7c59]/20 text-[#4a7c59]'
                            : 'bg-sky-400/15 border-sky-400/30 text-sky-300'
                        }`}
                      >
                        Authorized QR
                      </span>
                    </div>
                    <p
                      className={`text-xs ${
                        isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                      }`}
                    >
                      SMS & WhatsApp delivery within 10 seconds. Show at Gate 3 & 4 for instant tap entry.
                    </p>
                  </div>
                </div>

                {/* Center: Ticket Quantity Stepper */}
                <div
                  className={`flex items-center gap-3 p-2 rounded-xl border shadow-sm ${
                    isTerra ? 'bg-white border-[#c4c8bc]' : 'bg-slate-900 border-white/15'
                  }`}
                >
                  <span className="text-xs pl-2 font-bold opacity-75">Passes:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDockPassCount((c) => Math.max(1, c - 1))}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all border cursor-pointer ${
                        isTerra
                          ? 'bg-[#f0ece4] border-[#c4c8bc] text-[#2e3230] hover:text-[#4a7c59]'
                          : 'bg-slate-800 border-white/10 text-slate-200 hover:text-sky-300'
                      }`}
                    >
                      -
                    </button>
                    <span
                      className={`text-base font-bold px-2 ${
                        isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                      }`}
                    >
                      {dockPassCount}
                    </span>
                    <button
                      onClick={() => setDockPassCount((c) => Math.min(10, c + 1))}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all border cursor-pointer ${
                        isTerra
                          ? 'bg-[#f0ece4] border-[#c4c8bc] text-[#2e3230] hover:text-[#4a7c59]'
                          : 'bg-slate-800 border-white/10 text-slate-200 hover:text-sky-300'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Right: Price & Payment CTA */}
                <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="text-right">
                    <span
                      className={`text-[11px] block font-semibold ${
                        isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                      }`}
                    >
                      Total with 18% GST
                    </span>
                    <span
                      className={`text-xl md:text-2xl font-bold font-headline ${
                        isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                      }`}
                    >
                      ₹{dockTotalWithGst.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={handleDockBookNow}
                    className={`px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                      isTerra
                        ? 'bg-[#4a7c59] text-white hover:bg-[#3d6749]'
                        : 'bg-gradient-to-r from-sky-400 via-primary to-sky-300 text-slate-950 font-extrabold hover:brightness-110'
                    }`}
                  >
                    <span>Pay via UPI / Cards</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ==============================================================
             SCREEN 2: EXPLORE ALL VENUES DIRECTORY (Matching Image 5)
             ============================================================== */
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Top Metric Strip & Hero Headline */}
            <section className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex flex-col gap-2 max-w-3xl">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs font-semibold tracking-wide uppercase ${
                      isTerra
                        ? 'bg-[#4a7c59]/10 text-[#4a7c59]'
                        : 'bg-sky-400/10 text-sky-300'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full animate-ping ${
                        isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                      }`}
                    />
                    Live Navratri Satellite Feed • Day 4 of 9
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headline tracking-tight leading-tight">
                    Explore All Garba Grounds <br className="hidden sm:block" />
                    <span
                      className={`bg-clip-text text-transparent ${
                        isTerra
                          ? 'bg-gradient-to-r from-[#4a7c59] via-[#78a886] to-[#705c30]'
                          : 'bg-gradient-to-r from-sky-300 via-primary to-purple-400'
                      }`}
                    >
                      & Dandiya Arenas
                    </span>
                  </h1>
                  <p
                    className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
                      isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                    }`}
                  >
                    Discover 18 sanctioned grounds across Ahmedabad & Gandhinagar with real-time pass availability, live artist lineups, sound-tier approvals, and municipal curfew tracking.
                  </p>
                </div>

                {/* Curfew Directive Badge */}
                <div
                  className={`flex items-center gap-3 p-3.5 rounded-xl border shadow-sm ${
                    isTerra
                      ? 'bg-white border-[#e8e2d8]'
                      : 'bg-slate-900/80 border-white/10'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isTerra
                        ? 'bg-[#4a7c59]/15 text-[#4a7c59]'
                        : 'bg-sky-400/15 text-sky-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">policy</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">Curfew Directive 2026</span>
                    <span
                      className={`text-[11px] ${
                        isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                      }`}
                    >
                      Overnight zones licensed via Gandhinagar Police Dept
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Stat Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                    isTerra ? 'bg-white border-[#e8e2d8]' : 'glass-panel border-white/10'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                      isTerra
                        ? 'bg-[#4a7c59]/10 text-[#4a7c59]'
                        : 'bg-sky-400/15 text-sky-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">stadium</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-2xl font-bold font-headline tracking-tight">18</span>
                    <span className="text-xs opacity-70 truncate font-medium">Grounds Live Tonight</span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                    isTerra ? 'bg-white border-[#e8e2d8]' : 'glass-panel border-white/10'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                      isTerra
                        ? 'bg-[#4a7c59]/10 text-[#4a7c59]'
                        : 'bg-sky-400/15 text-sky-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">schedule</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-2xl font-bold font-headline tracking-tight ${
                          isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                        }`}
                      >
                        6
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                          isTerra
                            ? 'bg-[#4a7c59]/15 text-[#4a7c59]'
                            : 'bg-sky-400/15 text-sky-300'
                        }`}
                      >
                        Overnight
                      </span>
                    </div>
                    <span className="text-xs opacity-70 truncate font-medium">Permitted Till 3:30 AM</span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                    isTerra ? 'bg-white border-[#e8e2d8]' : 'glass-panel border-white/10'
                  }`}
                >
                  <div className="w-11 h-11 rounded-lg bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">stars</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-2xl font-bold font-headline tracking-tight">4</span>
                    <span className="text-xs opacity-70 truncate font-medium">Celebrity Headliners Live</span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                    isTerra ? 'bg-white border-[#e8e2d8]' : 'glass-panel border-white/10'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                      isTerra
                        ? 'bg-[#4a7c59]/10 text-[#4a7c59]'
                        : 'bg-sky-400/15 text-sky-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">groups</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold font-headline tracking-tight">Moderate</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-xs opacity-70 truncate font-medium">Average Gate Influx</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Spotlight Venue Banner */}
            <section
              className={`rounded-2xl p-6 lg:p-8 relative overflow-hidden border shadow-xl ${
                isTerra
                  ? 'bg-gradient-to-r from-white via-[#f5f1ea] to-white border-[#c4c8bc]'
                  : 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-sky-400/20 glow-cyan'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Spotlight Image */}
                <div className="lg:col-span-5 relative rounded-xl overflow-hidden aspect-[16/10] sm:aspect-[21/9] lg:aspect-auto lg:h-64 shadow-md">
                  <img
                    src={selectedVenue.image}
                    alt={selectedVenue.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase shadow-md ${
                        isTerra
                          ? 'bg-[#4a7c59] text-white'
                          : 'bg-sky-400 text-slate-950 font-extrabold'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">local_fire_department</span>
                      #1 Trending Ground
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {selectedVenue.subtitle}
                    </span>
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md font-bold text-amber-400">
                      ★ {selectedVenue.rating} ({selectedVenue.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Spotlight Content */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        isTerra
                          ? 'bg-[#f8e0a8] text-[#554020]'
                          : 'bg-purple-300/20 text-purple-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">star</span>
                      Celebrity Headliner Tonight
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isTerra
                          ? 'bg-[#4a7c59]/10 text-[#4a7c59]'
                          : 'bg-sky-400/15 text-sky-300'
                      }`}
                    >
                      {selectedVenue.curfew}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight">
                      {selectedVenue.name}
                    </h2>
                    <div
                      className={`flex items-center gap-2 mt-1 text-sm font-medium ${
                        isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">mic</span>
                      <span>{selectedVenue.artist.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                        Original Band
                      </span>
                    </div>
                  </div>

                  {/* Sound & Capacity Mini Meter */}
                  <div
                    className={`grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y text-xs ${
                      isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
                    }`}
                  >
                    <div>
                      <div className="opacity-70 font-medium">Available Passes</div>
                      <div className="text-sm font-bold text-rose-500 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-sm">confirmation_number</span>
                        {selectedVenue.passesLeft} Passes Left
                      </div>
                    </div>
                    <div>
                      <div className="opacity-70 font-medium">Parking Access</div>
                      <div className="text-sm font-semibold flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-sm text-[#4a7c59]">
                          local_parking
                        </span>
                        {selectedVenue.parkingType}
                      </div>
                    </div>
                    <div>
                      <div className="opacity-70 font-medium">Dance Surface</div>
                      <div className="text-sm font-semibold flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-sm text-amber-500">
                          grass
                        </span>
                        {selectedVenue.danceSurface}
                      </div>
                    </div>
                    <div>
                      <div className="opacity-70 font-medium">Starting Entry</div>
                      <div
                        className={`text-base font-bold mt-0.5 ${
                          isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                        }`}
                      >
                        ₹{selectedVenue.prices.single}{' '}
                        <span className="text-[11px] font-normal opacity-70">/ person</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => handleOpenBooking(selectedVenue)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                        isTerra
                          ? 'bg-[#4a7c59] text-white hover:bg-[#3d6749]'
                          : 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 font-extrabold hover:brightness-110'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">shopping_cart</span>
                      <span>Quick Book Passes ₹{selectedVenue.prices.single}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('map');
                      }}
                      className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                        isTerra
                          ? 'bg-white border-[#c4c8bc] text-[#2e3230] hover:border-[#4a7c59]'
                          : 'bg-slate-800 border-white/15 text-slate-200 hover:border-sky-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">map</span>
                      <span>View Live Ground Radar</span>
                    </button>
                    <span className="text-xs opacity-70 ml-auto hidden md:inline">
                      Gates Open 7:30 PM • Aarti at 8:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Grid of all venues */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-headline">
                    Live Garba Grounds Tonight
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isTerra
                        ? 'bg-[#4a7c59]/10 text-[#4a7c59]'
                        : 'bg-sky-400/15 text-sky-300'
                    }`}
                  >
                    {filteredVenues.length} of {venues.length} Grounds Shown
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs opacity-70">
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                    }`}
                  />
                  <span>Syncing ticket stocks every 45 seconds</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    isSelected={selectedVenue.id === venue.id}
                    onSelect={() => {
                      setSelectedVenue(venue);
                      setCurrentView('map');
                    }}
                    onBook={() => handleOpenBooking(venue)}
                    theme={theme}
                    variant="standard"
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Global Modals & Gateway Overlays */}
      <BookingModal
        venue={bookingVenue}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onProceedToPayment={handleProceedToPayment}
        theme={theme}
      />

      <DummyPaymentGateway
        isOpen={isPaymentGatewayOpen}
        booking={activeBooking}
        amount={gatewayAmount}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentCancel={() => setIsPaymentGatewayOpen(false)}
      />

      <PassWalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        tickets={tickets}
        theme={theme}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={mapsApiKey}
        onSaveKey={handleSaveApiKey}
        theme={theme}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        venues={venues}
        onBookVenue={handleOpenBooking}
        theme={theme}
      />

      {/* Footer */}
      <footer
        className={`w-full border-t relative z-10 transition-colors ${
          isTerra
            ? 'bg-[#f0ece4] border-[#c4c8bc] text-[#2e3230]'
            : 'bg-[#070b13] border-white/10 text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight font-headline">
                  Garba Radar
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                    isTerra
                      ? 'bg-[#4a7c59]/10 text-[#4a7c59] border-[#4a7c59]/25'
                      : 'bg-sky-400/10 text-sky-300 border-sky-400/25'
                  }`}
                >
                  2026
                </span>
              </div>
              <p className="text-xs opacity-75 leading-relaxed">
                The official nocturnal ticketing portal for authentic Dandiya, Sheri Garba, and open-air arena grounds across Gujarat.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#4a7c59]">
                  verified
                </span>
                <span>Gujarat Tourism Authorized Booking Network</span>
              </div>
            </div>

            <div>
              <span className="text-sm font-bold block mb-3 font-headline">Experience Venues</span>
              <ul className="space-y-2 text-xs opacity-80">
                {venues.slice(0, 4).map((v) => (
                  <li key={v.id}>
                    <button
                      onClick={() => {
                        setSelectedVenue(v);
                        setCurrentView('map');
                      }}
                      className="hover:text-[#4a7c59] dark:hover:text-sky-300 transition-colors text-left"
                    >
                      {v.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-sm font-bold block mb-3 font-headline">Festival Rules & Entry</span>
              <ul className="space-y-2 text-xs opacity-80">
                <li>Extended 3:00 AM Curfew Directives</li>
                <li>Mandatory RFID Wristbands Tap Entry</li>
                <li>Traditional Chaniya Choli & Kedia Dress Code</li>
                <li>Valet & Parking FastTag Integration</li>
              </ul>
            </div>

            <div>
              <span className="text-sm font-bold block mb-3 font-headline">Helpline & Support</span>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-sm">1800-GARBA-2026</p>
                <p className="opacity-75">support@navratrigarba2026.in</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-2 h-2 rounded-full bg-[#4a7c59] animate-ping" />
                  <span className="text-[11px] font-semibold opacity-75">
                    24x7 Night Shift Ground Concierge
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-75">
            <span>© 2026 Navratri Garba Radar Festival Bureau. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span className="cursor-pointer hover:underline">Privacy Policy</span>
              <span className="cursor-pointer hover:underline">Terms of Entry</span>
              <span className="cursor-pointer hover:underline">Curfew Directives</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
