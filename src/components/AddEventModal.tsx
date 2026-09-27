import React, { useState } from 'react';
import { Venue, ThemeMode } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (newVenue: Venue) => void;
  theme: ThemeMode;
}

const PRESET_LOCATIONS = [
  { label: 'Sindhu Bhavan Road', area: 'Sindhu Bhavan Belt', lat: 23.0475, lng: 72.5020, location: 'Sindhu Bhavan Road, Near Taj Skyline, Ahmedabad' },
  { label: 'SG Highway Bodakdev', area: 'Bodakdev & SG Highway', lat: 23.0425, lng: 72.5085, location: 'Opp. Pakwan Cross Road, SG Highway, Bodakdev' },
  { label: 'SP Ring Road (Bopal)', area: 'S.P. Ring Road Arterials', lat: 23.0322, lng: 72.4820, location: 'SP Ring Road Junction, Bopal Arterial, Ahmedabad' },
  { label: 'Gandhinagar Infocity', area: 'Gandhinagar & Gift City', lat: 23.1925, lng: 72.6280, location: 'Near Infocity Club Ground, GH-0, Gandhinagar' },
  { label: 'Vastrapur Lake Belt', area: 'Vastrapur & University', lat: 23.0370, lng: 72.5280, location: 'Near Vastrapur Amphitheatre, Vastrapur, Ahmedabad' },
  { label: 'Riverfront West', area: 'Sabarmati Riverfront', lat: 23.0290, lng: 72.5740, location: 'Riverfront Event Ground, Behind NID, Paldi' },
];

const PRESET_ARTIST_PHOTOS = [
  { label: 'Falguni Pathak', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpD9ApQ48lt7BsNWWzFrY64pTQ5R-vEqdZugGP6uS_ZOmZy010UOegOnuaw6yrxA3QTfKl8oUbFfRhICFaU4_8HNbeS8KdisV1CeU5iQHysyL-XVSts9LmSNkJA7wrkcmQI8u-akrnv1G2hLe0-EntoB_iChzZ2A7znwd45GFOsfhgfdX523wulVHm0kNwYKMXEgNr5C5rN33XhvlWCiXuFc3AjnfuIpf-hZcY99JApC8BszOkU7w' },
  { label: 'Atul Purohit', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsv6vu1qpDFZvKjNm9Fxou-5sMVd4fsEglDCsF7ET5Nz70trHOVotp79IS3ds_20CslsL5AdAQkuS6Oiz62Sv5gIgAxQD4yseauzMgZOzK5hJ7ef7I1zJQC2gyyS_XcNkxAP-npXIkfesw7rcviDnVOCPT5cGfmWxEE8zqeSRw6ehU2aVp1MTh8hy73_9GWr228G1FDhGIrOa0xtiKcY2uXeHP2ezci58pOgQjyfIx87Ad7CXD-Ek' },
  { label: 'Kinjal Dave', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80' },
  { label: 'Aditya Gadhvi', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80' },
  { label: 'Geeta Rabari', url: 'https://images.unsplash.com/photo-1520523839898-50712698e294?w=500&auto=format&fit=crop&q=80' },
];

const PRESET_GROUND_IMAGES = [
  { label: 'Illuminated Dome Lawn', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwVlvPBVQDY1GECGX0I6fVYMqz9vgfh3CUKX99nrkqxVBMYgrIN_ubrzNPAfB70q2yAA5hNyZv0DemWhAOyt2ww-utFRs2BKrWl2HB-lazQ_qcKwLtXjVRLBgEOQzTowCo9epu4RuYgDl75ZQd2TrX1ZfZ84xZ41TKt54Den0NQf8_MAVddI1bWMVZpgtPm-ak88f8MdSA8QZWoRHJbEUGpN58yKhUCLMu90HOUCAOTdmdpq2iG6U' },
  { label: 'Heritage Royal Lawns', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7zeAP-xiCIDJBDYuzqx8Xja7nbM80wNyeMU3egvhZB3KetgbSqejoJ7VmwsGAQKuzMGAntJkGSDxbgSxy79ODftT8MJyUVf0PNa4oLgULtQZfyj-3VHcHLKvdqOPtFpog8BtEfGXfUktLaXevOVWX5y9NR_Cly9L2p-ct752bD9uOENmd8Cz8Dvs_8Dy1ZSvcZUftB3K8-5OQl3lmaH8WGFfjpsRy_9svucCG2GMrI7_8QveyCME' },
  { label: 'Festival Light Night', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80' },
  { label: 'Grand Stage & Crowd', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80' },
];

const AVAILABLE_AMENITIES = [
  'Free Valet (1,200 Spots)',
  'FastTag Valet Parking',
  'Meyer Sound 360°',
  'L-Acoustics K2 Surround',
  'Air-cooled Food Village',
  'SHE Safety Corridor',
  'VIP Lounge & High-Deck',
  'Pro Step Arena Floor',
  'Doctor & Ambulance On-Site',
  'Locker Desks & Cloakroom',
  'EV Charging Stations',
  'Live Drone & 4K Coverage',
];

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
  theme,
}) => {
  const isTerra = theme === 'terra';

  // Form State
  const [activeTab, setActiveTab] = useState<'basics' | 'artist' | 'pricing' | 'amenities'>('basics');
  const [name, setName] = useState('Navrang Maha Utsav Arena');
  const [subtitle, setSubtitle] = useState('Sindhu Bhavan Arterial, Ahmedabad');
  const [area, setArea] = useState('Sindhu Bhavan Belt');
  const [location, setLocation] = useState('Sindhu Bhavan Ext., Near Shilaj Circle, Ahmedabad');
  const [lat, setLat] = useState('23.0475');
  const [lng, setLng] = useState('72.5020');
  const [distanceKm, setDistanceKm] = useState('2.4');
  const [travelMinutes, setTravelMinutes] = useState('9');

  // Artist State
  const [artistName, setArtistName] = useState('Aditya Gadhvi & The Folk Trio');
  const [artistSubtitle, setArtistSubtitle] = useState('High Energy Gujarati Folk & Khalasi Raas');
  const [artistBadge, setArtistBadge] = useState('Celebrity Headliner');
  const [artistGenre, setArtistGenre] = useState('Contemporary Folk / Raas');
  const [artistImage, setArtistImage] = useState(PRESET_ARTIST_PHOTOS[3].url);

  // Curfew & Schedule
  const [isOvernight, setIsOvernight] = useState(true);
  const [curfewTime, setCurfewTime] = useState('3:00 AM Overnight Verified');
  const [gatesOpen, setGatesOpen] = useState('7:00 PM');
  const [aartiTime, setAartiTime] = useState('8:00 PM');

  // Pricing
  const [singlePrice, setSinglePrice] = useState('599');
  const [couplePrice, setCouplePrice] = useState('1299');
  const [seasonPrice, setSeasonPrice] = useState('3999');
  const [originalPrice, setOriginalPrice] = useState('850');

  // Amenities & Specs
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Free Valet (1,200 Spots)',
    'Air-cooled Food Village',
    'SHE Safety Corridor',
    'Meyer Sound 360°',
  ]);
  const [danceSurface, setDanceSurface] = useState('AstroTurf + Dual Foam Layer');
  const [parkingType, setParkingType] = useState('FastTag Valet 1200+ Slots');
  const [soundSystem, setSoundSystem] = useState('Meyer Sound 360° Line Array');

  // Ground Status & Photo
  const [image, setImage] = useState(PRESET_GROUND_IMAGES[0].url);
  const [rushLevel, setRushLevel] = useState<'Normal' | 'Brisk' | 'Near Capacity'>('Brisk');
  const [passesLeft, setPassesLeft] = useState('75');
  const [soldPercent, setSoldPercent] = useState('82');
  const [isOfficial, setIsOfficial] = useState(true);
  const [isCelebrity, setIsCelebrity] = useState(true);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleApplyPresetLocation = (preset: typeof PRESET_LOCATIONS[0]) => {
    setArea(preset.area);
    setLocation(preset.location);
    setLat(preset.lat.toString());
    setLng(preset.lng.toString());
  };

  const handleToggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      setErrorMessage('Please provide an event name and location.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const newVenue: Venue = {
      id: `venue-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      subtitle: subtitle.trim(),
      location: location.trim(),
      area: area.trim(),
      coordinates: {
        lat: parseFloat(lat) || 23.04,
        lng: parseFloat(lng) || 72.51,
      },
      distanceKm: parseFloat(distanceKm) || 2.0,
      travelMinutes: parseInt(travelMinutes, 10) || 8,
      rating: 4.9,
      reviewsCount: Math.floor(Math.random() * 300) + 120,
      artist: {
        name: artistName.trim(),
        subtitle: artistSubtitle.trim(),
        image: artistImage,
        badge: artistBadge,
        genre: artistGenre,
      },
      curfew: isOvernight ? 'Allowed until 3:00 AM' : 'Strict 12:00 AM Curfew',
      curfewTime: curfewTime,
      isOvernight: isOvernight,
      prices: {
        single: parseInt(singlePrice, 10) || 499,
        couple: parseInt(couplePrice, 10) || 999,
        season: parseInt(seasonPrice, 10) || 3499,
      },
      originalPrice: parseInt(originalPrice, 10) || undefined,
      amenities: selectedAmenities,
      image: image,
      rushLevel: rushLevel,
      passesLeft: parseInt(passesLeft, 10) || 50,
      isOfficial: isOfficial,
      isCelebrity: isCelebrity,
      soldPercent: parseInt(soldPercent, 10) || 75,
      danceSurface: danceSurface,
      parkingType: parkingType,
      soundSystem: soundSystem,
      gatesOpen: gatesOpen,
      aartiTime: aartiTime,
    };

    try {
      // Direct call to API
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVenue),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save event to local SQLite');
      }

      onEventCreated(data.venue || newVenue);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error syncing to SQLite');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-4xl rounded-3xl shadow-2xl border overflow-hidden my-8 z-10 transition-all ${
          isTerra
            ? 'bg-[#faf6f0] border-[#c4c8bc] text-[#2e3230]'
            : 'bg-[#0f172a] border-sky-400/30 text-slate-100 glow-cyan'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between ${
            isTerra ? 'bg-[#f4efe6] border-[#e4e0d8]' : 'bg-slate-900/80 border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm ${
                isTerra
                  ? 'bg-[#4a7c59]/15 text-[#4a7c59] border-[#4a7c59]/30'
                  : 'bg-sky-400/20 text-sky-300 border-sky-400/40'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">add_location_alt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-headline">Add New Garba Event</h2>
                <span
                  className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${
                    isTerra
                      ? 'bg-[#4a7c59]/10 text-[#4a7c59] border-[#4a7c59]/30'
                      : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                  }`}
                >
                  SQLite Sync
                </span>
              </div>
              <p
                className={`text-xs ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                Configure venue options, passes & artist details — dynamically synced to local SQLite.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              isTerra
                ? 'border-[#c4c8bc] hover:bg-[#e8e2d8] text-[#2e3230]'
                : 'border-white/10 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex items-center px-6 pt-3 border-b gap-2 overflow-x-auto no-scrollbar ${
            isTerra ? 'border-[#e4e0d8] bg-[#f7f3ec]' : 'border-white/10 bg-slate-900/40'
          }`}
        >
          {[
            { id: 'basics', label: '1. Ground & Location', icon: 'stadium' },
            { id: 'artist', label: '2. Headliner Artist', icon: 'mic' },
            { id: 'pricing', label: '3. Passes & Schedule', icon: 'confirmation_number' },
            { id: 'amenities', label: '4. Specs & Amenities', icon: 'verified' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? isTerra
                    ? 'border-[#4a7c59] text-[#4a7c59] bg-white/70 rounded-t-lg'
                    : 'border-sky-400 text-sky-300 bg-sky-400/10 rounded-t-lg'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[68vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 font-medium">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: GROUND & LOCATION */}
          {activeTab === 'basics' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Presets quick-picker */}
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                  isTerra ? 'bg-[#f2ede4] border-[#e2dbce]' : 'bg-slate-900/60 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 opacity-90">
                    <span className="material-symbols-outlined text-sm text-[#4a7c59]">near_me</span>
                    Quick Fill from Popular Garba Belts:
                  </span>
                  <span className="text-[10px] opacity-60">Auto-sets Lat/Lng & Location</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_LOCATIONS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPresetLocation(preset)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all border cursor-pointer ${
                        area === preset.area
                          ? isTerra
                            ? 'bg-[#4a7c59] text-white border-[#4a7c59]'
                            : 'bg-sky-400 text-slate-950 border-sky-400 font-bold'
                          : isTerra
                          ? 'bg-white border-[#c4c8bc] text-[#2e3230] hover:border-[#4a7c59]'
                          : 'bg-slate-800 border-white/10 text-slate-300 hover:border-sky-400/40'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Ground / Venue Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Navrang Heritage Club Arena"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none transition-all ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Sindhu Bhavan Arterial, Bodakdev"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none transition-all ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1 opacity-80">Full Location Address *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Opp. Taj Skyline, Sindhu Bhavan Road, Bodakdev, Ahmedabad"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none transition-all ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Area / Region Belt</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none transition-all cursor-pointer ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  >
                    <option value="Bodakdev & SG Highway">Bodakdev & SG Highway</option>
                    <option value="Sindhu Bhavan Belt">Sindhu Bhavan Belt</option>
                    <option value="S.P. Ring Road Arterials">S.P. Ring Road Arterials</option>
                    <option value="Gandhinagar & Gift City">Gandhinagar & Gift City</option>
                    <option value="Vastrapur & University">Vastrapur & University</option>
                    <option value="Sabarmati Riverfront">Sabarmati Riverfront</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">Latitude (GPS)</label>
                    <input
                      type="number"
                      step="any"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none ${
                        isTerra
                          ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                          : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">Longitude (GPS)</label>
                    <input
                      type="number"
                      step="any"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none ${
                        isTerra
                          ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                          : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Distance from City Center (Km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Travel Time (Mins)</label>
                  <input
                    type="number"
                    value={travelMinutes}
                    onChange={(e) => setTravelMinutes(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>
              </div>

              {/* Cover Photo Selection */}
              <div>
                <label className="block text-xs font-bold mb-1 opacity-80">Ground Cover Image</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {PRESET_GROUND_IMAGES.map((img) => (
                    <div
                      key={img.label}
                      onClick={() => setImage(img.url)}
                      className={`group relative rounded-xl overflow-hidden border cursor-pointer aspect-video transition-all ${
                        image === img.url
                          ? isTerra
                            ? 'ring-2 ring-[#4a7c59] border-[#4a7c59]'
                            : 'ring-2 ring-sky-400 border-sky-400'
                          : 'opacity-70 hover:opacity-100 border-transparent'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-white font-medium truncate text-center">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or enter custom Image URL"
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none ${
                    isTerra
                      ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                      : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                  }`}
                />
              </div>
            </div>
          )}

          {/* TAB 2: HEADLINER ARTIST */}
          {activeTab === 'artist' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Headliner Artist Name *</label>
                  <input
                    type="text"
                    required
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="e.g. Falguni Pathak / Kinjal Dave"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Artist Badge</label>
                  <select
                    value={artistBadge}
                    onChange={(e) => setArtistBadge(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none cursor-pointer ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  >
                    <option value="Celebrity Headliner">Celebrity Headliner</option>
                    <option value="Folk Legend">Folk Legend</option>
                    <option value="Original Orchestra">Original Orchestra</option>
                    <option value="Youth Icon">Youth Icon</option>
                    <option value="Viral Folk Maestro">Viral Folk Maestro</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1 opacity-80">Performance Subtitle / Description</label>
                  <input
                    type="text"
                    value={artistSubtitle}
                    onChange={(e) => setArtistSubtitle(e.target.value)}
                    placeholder="e.g. 24-Piece Grand Live Orchestra • High-Energy Raas"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Music Genre</label>
                  <input
                    type="text"
                    value={artistGenre}
                    onChange={(e) => setArtistGenre(e.target.value)}
                    placeholder="e.g. Symphonic Live Raas, Kathiyawadi Dhol"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={isCelebrity}
                      onChange={(e) => setIsCelebrity(e.target.checked)}
                      className="rounded text-[#4a7c59] focus:ring-[#4a7c59]"
                    />
                    <span>Celebrity Performing Tonight</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={isOfficial}
                      onChange={(e) => setIsOfficial(e.target.checked)}
                      className="rounded text-[#4a7c59] focus:ring-[#4a7c59]"
                    />
                    <span>Verified Official Ground</span>
                  </label>
                </div>
              </div>

              {/* Artist Photo Presets */}
              <div>
                <label className="block text-xs font-bold mb-2 opacity-80">Headliner Photo</label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {PRESET_ARTIST_PHOTOS.map((art) => (
                    <div
                      key={art.label}
                      onClick={() => setArtistImage(art.url)}
                      className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer p-1 rounded-xl transition-all ${
                        artistImage === art.url
                          ? isTerra
                            ? 'bg-[#4a7c59]/15 ring-2 ring-[#4a7c59]'
                            : 'bg-sky-400/20 ring-2 ring-sky-400'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={art.url}
                        alt={art.label}
                        className="w-14 h-14 rounded-full object-cover border"
                      />
                      <span className="text-[10px] font-semibold">{art.label}</span>
                    </div>
                  ))}
                </div>
                <input
                  type="url"
                  value={artistImage}
                  onChange={(e) => setArtistImage(e.target.value)}
                  placeholder="Or paste custom artist image URL"
                  className={`w-full mt-2 px-3.5 py-2 rounded-xl text-xs border focus:outline-none ${
                    isTerra
                      ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                      : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                  }`}
                />
              </div>
            </div>
          )}

          {/* TAB 3: PASSES & SCHEDULE */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Overnight & Curfew Configuration */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isTerra ? 'bg-[#f4efe6] border-[#e4e0d8]' : 'bg-slate-900/60 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold block font-headline">Overnight Garba Allowance</span>
                    <span
                      className={`text-xs ${
                        isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                      }`}
                    >
                      Enable if ground has official police permission for 3:00 AM play
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOvernight}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsOvernight(checked);
                        setCurfewTime(checked ? '3:00 AM Overnight Verified' : '12:00 AM Midnight Curfew');
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-400/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a7c59]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold mb-1 opacity-80">Curfew Label</label>
                    <input
                      type="text"
                      value={curfewTime}
                      onChange={(e) => setCurfewTime(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                        isTerra
                          ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                          : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1 opacity-80">Gates Open</label>
                    <input
                      type="text"
                      value={gatesOpen}
                      onChange={(e) => setGatesOpen(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                        isTerra
                          ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                          : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1 opacity-80">Aarti Time</label>
                    <input
                      type="text"
                      value={aartiTime}
                      onChange={(e) => setAartiTime(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                        isTerra
                          ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                          : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Pass Pricing */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Pass Tier Pricing (INR ₹)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Single Entry</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs opacity-60">₹</span>
                      <input
                        type="number"
                        required
                        value={singlePrice}
                        onChange={(e) => setSinglePrice(e.target.value)}
                        className={`w-full pl-7 pr-3 py-2 rounded-xl text-xs border focus:outline-none font-bold ${
                          isTerra
                            ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                            : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">VIP Couple Pass</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs opacity-60">₹</span>
                      <input
                        type="number"
                        required
                        value={couplePrice}
                        onChange={(e) => setCouplePrice(e.target.value)}
                        className={`w-full pl-7 pr-3 py-2 rounded-xl text-xs border focus:outline-none font-bold ${
                          isTerra
                            ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                            : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Full Season Pass</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs opacity-60">₹</span>
                      <input
                        type="number"
                        required
                        value={seasonPrice}
                        onChange={(e) => setSeasonPrice(e.target.value)}
                        className={`w-full pl-7 pr-3 py-2 rounded-xl text-xs border focus:outline-none font-bold ${
                          isTerra
                            ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                            : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Original MRP</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs opacity-60">₹</span>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        className={`w-full pl-7 pr-3 py-2 rounded-xl text-xs border focus:outline-none ${
                          isTerra
                            ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                            : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Demand & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Passes Left in Stock</label>
                  <input
                    type="number"
                    value={passesLeft}
                    onChange={(e) => setPassesLeft(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Rush Meter Level</label>
                  <select
                    value={rushLevel}
                    onChange={(e) => setRushLevel(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none cursor-pointer ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Brisk">Brisk</option>
                    <option value="Near Capacity">Near Capacity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Sold Out % ({soldPercent}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="99"
                    value={soldPercent}
                    onChange={(e) => setSoldPercent(e.target.value)}
                    className="w-full mt-2 accent-[#4a7c59] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPECS & AMENITIES */}
          {activeTab === 'amenities' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold mb-2 opacity-80">Select Amenities Available at Ground</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const checked = selectedAmenities.includes(amenity);
                    return (
                      <div
                        key={amenity}
                        onClick={() => handleToggleAmenity(amenity)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          checked
                            ? isTerra
                              ? 'bg-[#4a7c59]/15 border-[#4a7c59] text-[#2e3230] font-bold'
                              : 'bg-sky-400/20 border-sky-400 text-sky-200 font-bold'
                            : isTerra
                            ? 'bg-white border-[#c4c8bc] opacity-75 hover:opacity-100'
                            : 'bg-slate-900 border-white/10 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            checked ? (isTerra ? 'text-[#4a7c59]' : 'text-sky-300') : 'opacity-40'
                          }`}
                        >
                          {checked ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span className="truncate">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Dance Arena Surface</label>
                  <input
                    type="text"
                    value={danceSurface}
                    onChange={(e) => setDanceSurface(e.target.value)}
                    placeholder="e.g. AstroTurf + Dual Foam Layer"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Parking Infrastructure</label>
                  <input
                    type="text"
                    value={parkingType}
                    onChange={(e) => setParkingType(e.target.value)}
                    placeholder="e.g. FastTag Valet 800+ Slots"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">Acoustic Sound System</label>
                  <input
                    type="text"
                    value={soundSystem}
                    onChange={(e) => setSoundSystem(e.target.value)}
                    placeholder="e.g. Meyer Sound 360° Line Array"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] focus:border-[#4a7c59]'
                        : 'bg-slate-900 border-white/15 focus:border-sky-400 text-slate-100'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Bar */}
          <div
            className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 text-xs opacity-75">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Direct write to local SQLite DB (`garba_radar.db`)</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isTerra
                    ? 'border-[#c4c8bc] text-[#2e3230] hover:bg-[#e8e2d8]'
                    : 'border-white/20 text-slate-300 hover:bg-white/10'
                }`}
              >
                Cancel
              </button>

              {activeTab !== 'amenities' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'basics') setActiveTab('artist');
                    else if (activeTab === 'artist') setActiveTab('pricing');
                    else if (activeTab === 'pricing') setActiveTab('amenities');
                  }}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isTerra
                      ? 'bg-[#4a7c59] text-white hover:bg-[#3d694b]'
                      : 'bg-sky-400 text-slate-950 hover:bg-sky-300 font-extrabold'
                  }`}
                >
                  <span>Next Step</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isTerra
                      ? 'bg-[#4a7c59] text-white hover:bg-[#3d694b]'
                      : 'bg-gradient-to-r from-sky-400 to-emerald-400 text-slate-950 font-extrabold'
                  } ${isSubmitting ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isSubmitting ? 'hourglass_top' : 'save'}
                  </span>
                  <span>{isSubmitting ? 'Syncing to SQLite...' : 'Save & Link to Dashboard'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
