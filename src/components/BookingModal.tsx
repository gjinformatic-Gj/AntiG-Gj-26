import React, { useState } from 'react';
import { Venue, ThemeMode, BookingState } from '../types';

interface BookingModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: (bookingState: BookingState, calculatedTotal: number) => void;
  theme: ThemeMode;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  venue,
  isOpen,
  onClose,
  onProceedToPayment,
  theme,
}) => {
  if (!isOpen || !venue) return null;

  const isTerra = theme === 'terra';
  const [passType, setPassType] = useState<'single' | 'season'>('season');
  const [selectedDate, setSelectedDate] = useState('Oct 14 - Day 4 (Maha Raas)');
  const [attendeeName, setAttendeeName] = useState('Aarav Patel');
  const [attendeePhone, setAttendeePhone] = useState('+91 98250 12345');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const [counts, setCounts] = useState({
    female: 1,
    male: 0,
    couple: 0,
  });

  const isSeason = passType === 'season';

  // Base pricing
  const rates = {
    female: isSeason ? venue.prices.season : venue.prices.single,
    male: isSeason ? Math.round(venue.prices.season * 1.25) : Math.round(venue.prices.single * 1.3),
    couple: isSeason ? Math.round(venue.prices.season * 1.9) : venue.prices.couple,
  };

  const handleAdjustCount = (cat: 'female' | 'male' | 'couple', delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [cat]: Math.max(0, prev[cat] + delta),
    }));
  };

  const totalTickets = counts.female + counts.male + counts.couple;
  const baseSubtotal =
    counts.female * rates.female + counts.male * rates.male + counts.couple * rates.couple;
  const taxAmount = Math.round(baseSubtotal * 0.18);
  const rfidFee = totalTickets > 0 ? 50 : 0;
  const earlyBirdDiscount = isSeason && totalTickets > 0 ? 500 : 0;
  const grandTotal = Math.max(0, baseSubtotal + taxAmount + rfidFee - earlyBirdDiscount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalTickets === 0) {
      alert('Please select at least 1 pass to continue');
      return;
    }
    const booking: BookingState = {
      venue,
      passType,
      selectedDate,
      counts,
      paymentMethod,
      attendeeName: attendeeName || 'Navratri Dancer',
      attendeePhone: attendeePhone || '+91 98765 43210',
    };
    onProceedToPayment(booking, grandTotal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div
        className={`relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border transition-all ${
          isTerra
            ? 'bg-[#faf6f0] border-[#c4c8bc] text-[#2e3230]'
            : 'bg-[#0f172a]/95 border-sky-400/30 text-slate-100 glow-cyan backdrop-blur-2xl'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-5 sm:p-6 border-b flex items-start justify-between gap-4 ${
            isTerra ? 'bg-white border-[#e4e0d8]' : 'bg-slate-900/80 border-white/10'
          }`}
        >
          <div className="flex flex-col">
            <div
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-ping ${
                  isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                }`}
              />
              Instant Pass Confirmation Desk
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-headline mt-1">
              Book Passes • {venue.name}
            </h3>
            <span
              className={`text-xs mt-0.5 ${
                isTerra ? 'text-[#6b6358]' : 'text-slate-400'
              }`}
            >
              {venue.location} • {venue.curfewTime}
            </span>
          </div>

          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
              isTerra
                ? 'bg-[#f4efe6] border-[#c4c8bc] text-[#2e3230] hover:bg-[#e5ded3]'
                : 'bg-slate-800 border-white/10 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pass Options */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Step 1: Pass Validity Toggle */}
            <div className="flex flex-col gap-2">
              <label
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                Step 1: Choose Pass Validity
              </label>
              <div
                className={`grid grid-cols-2 gap-2 p-1.5 rounded-xl border ${
                  isTerra
                    ? 'bg-white border-[#c4c8bc]'
                    : 'bg-slate-900/90 border-white/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPassType('single')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
                    passType === 'single'
                      ? isTerra
                        ? 'bg-[#4a7c59] text-white shadow-sm'
                        : 'bg-sky-500/25 text-sky-200 border border-sky-400/50 shadow-sm'
                      : isTerra
                      ? 'text-[#6b6358] hover:text-[#2e3230]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Single-Day Pass
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                    Choose Day Oct 11 – 19
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPassType('season')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold text-center transition-all cursor-pointer relative ${
                    passType === 'season'
                      ? isTerra
                        ? 'bg-[#4a7c59] text-white shadow-sm'
                        : 'bg-sky-500/25 text-sky-200 border border-sky-400/50 shadow-sm'
                      : isTerra
                      ? 'text-[#6b6358] hover:text-[#2e3230]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  9-Day Season Pass
                  <span className="block text-[10px] font-semibold text-amber-500 mt-0.5">
                    Save 30% + Free Dandiya
                  </span>
                </button>
              </div>

              {passType === 'single' && (
                <div className="mt-1">
                  <label
                    className={`text-[10px] font-semibold block mb-1 ${
                      isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                    }`}
                  >
                    Select Festival Night
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                      isTerra
                        ? 'bg-white border-[#c4c8bc] text-[#2e3230]'
                        : 'bg-slate-900 border-white/15 text-slate-100'
                    }`}
                  >
                    <option>Oct 11 - Day 1 (Pratipada Opening)</option>
                    <option>Oct 12 - Day 2 (Dwitiya Swirls)</option>
                    <option>Oct 13 - Day 3 (Tritiya Beats)</option>
                    <option>Oct 14 - Day 4 (Maha Raas Tonight)</option>
                    <option>Oct 15 - Day 5 (Panchami Gala)</option>
                    <option>Oct 16 - Day 6 (Sashti Night)</option>
                    <option>Oct 17 - Day 7 (Saptami Fever)</option>
                    <option>Oct 18 - Day 8 (Maha Ashtami)</option>
                    <option>Oct 19 - Day 9 (Sharad Poonam Grand Finale)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Step 2: Select Quantity by Category */}
            <div className="flex flex-col gap-2.5">
              <label
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                Step 2: Select Quantity by Category
              </label>

              {/* Female Pass */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isTerra
                    ? 'bg-white border-[#e8e2d8]'
                    : 'bg-slate-900/60 border-white/10'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#4a7c59] text-[18px]">
                      female
                    </span>
                    <span className="text-sm font-bold">Female Pass</span>
                  </div>
                  <span
                    className={`text-[11px] ${
                      isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                    }`}
                  >
                    Special SHE Safety Lane Access
                  </span>
                  <span
                    className={`text-sm font-bold mt-1 ${
                      isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                    }`}
                  >
                    ₹{rates.female}{' '}
                    <span className="text-[10px] opacity-70 font-normal">
                      /{isSeason ? ' 9 Nights' : ' Night'}
                    </span>
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded-xl border ${
                    isTerra
                      ? 'bg-[#f4efe6] border-[#c4c8bc]'
                      : 'bg-slate-800 border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleAdjustCount('female', -1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:bg-black/10 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-5 text-center">
                    {counts.female}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdjustCount('female', 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:bg-black/10 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Male Pass */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isTerra
                    ? 'bg-white border-[#e8e2d8]'
                    : 'bg-slate-900/60 border-white/10'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sky-400 text-[18px]">
                      male
                    </span>
                    <span className="text-sm font-bold">Male Pass</span>
                  </div>
                  <span
                    className={`text-[11px] ${
                      isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                    }`}
                  >
                    Traditional Attire Check Required
                  </span>
                  <span
                    className={`text-sm font-bold mt-1 ${
                      isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                    }`}
                  >
                    ₹{rates.male}{' '}
                    <span className="text-[10px] opacity-70 font-normal">
                      /{isSeason ? ' 9 Nights' : ' Night'}
                    </span>
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded-xl border ${
                    isTerra
                      ? 'bg-[#f4efe6] border-[#c4c8bc]'
                      : 'bg-slate-800 border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleAdjustCount('male', -1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:bg-black/10 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-5 text-center">
                    {counts.male}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdjustCount('male', 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:bg-black/10 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Couple Pass */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isTerra
                    ? 'bg-white border-[#e8e2d8]'
                    : 'bg-slate-900/60 border-white/10'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-purple-400 text-[18px]">
                      favorite
                    </span>
                    <span className="text-sm font-bold">Couple Pass (M + F)</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                        isTerra
                          ? 'bg-[#f8e0a8] text-[#221a05] border-[#705c30]/20'
                          : 'bg-purple-400/20 text-purple-300 border-purple-400/40'
                      }`}
                    >
                      Popular
                    </span>
                  </div>
                  <span
                    className={`text-[11px] ${
                      isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                    }`}
                  >
                    Includes 2x Free Food & Beverage Vouchers
                  </span>
                  <span
                    className={`text-sm font-bold mt-1 ${
                      isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                    }`}
                  >
                    ₹{rates.couple}{' '}
                    <span className="text-[10px] opacity-70 font-normal">
                      /{isSeason ? ' 9 Nights' : ' Night'}
                    </span>
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded-xl border ${
                    isTerra
                      ? 'bg-[#f4efe6] border-[#c4c8bc]'
                      : 'bg-slate-800 border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleAdjustCount('couple', -1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:bg-black/10 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-5 text-center">
                    {counts.couple}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdjustCount('couple', 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:bg-black/10 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Attendee Info Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label
                  className={`text-[11px] font-bold block mb-1 ${
                    isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                  }`}
                >
                  Primary Attendee Name
                </label>
                <input
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. Aarav Patel"
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                    isTerra
                      ? 'bg-white border-[#c4c8bc] text-[#2e3230] focus:border-[#4a7c59]'
                      : 'bg-slate-900 border-white/15 text-slate-100 focus:border-sky-400'
                  }`}
                />
              </div>
              <div>
                <label
                  className={`text-[11px] font-bold block mb-1 ${
                    isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                  }`}
                >
                  Mobile Number (WhatsApp Pass)
                </label>
                <input
                  type="text"
                  required
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  placeholder="+91 98250 12345"
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                    isTerra
                      ? 'bg-white border-[#c4c8bc] text-[#2e3230] focus:border-[#4a7c59]'
                      : 'bg-slate-900 border-white/15 text-slate-100 focus:border-sky-400'
                  }`}
                />
              </div>
            </div>

            {/* Step 3: Instant Payment Channel */}
            <div className="flex flex-col gap-2">
              <label
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                Step 3: Instant Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? isTerra
                        ? 'bg-[#4a7c59]/10 border-[#4a7c59] text-[#4a7c59] shadow-sm'
                        : 'bg-sky-400/20 border-sky-400 text-sky-200 glow-cyan'
                      : isTerra
                      ? 'bg-white border-[#c4c8bc] text-[#2e3230]'
                      : 'bg-slate-900/60 border-white/10 text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
                  <span className="text-xs font-bold">UPI / GPay</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">0% Surcharge</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? isTerra
                        ? 'bg-[#4a7c59]/10 border-[#4a7c59] text-[#4a7c59] shadow-sm'
                        : 'bg-sky-400/20 border-sky-400 text-sky-200 glow-cyan'
                      : isTerra
                      ? 'bg-white border-[#c4c8bc] text-[#2e3230]'
                      : 'bg-slate-900/60 border-white/10 text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">credit_card</span>
                  <span className="text-xs font-bold">Card</span>
                  <span className="text-[10px] opacity-70">Visa / Master</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? isTerra
                        ? 'bg-[#4a7c59]/10 border-[#4a7c59] text-[#4a7c59] shadow-sm'
                        : 'bg-sky-400/20 border-sky-400 text-sky-200 glow-cyan'
                      : isTerra
                      ? 'bg-white border-[#c4c8bc] text-[#2e3230]'
                      : 'bg-slate-900/60 border-white/10 text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">account_balance</span>
                  <span className="text-xs font-bold">Net Banking</span>
                  <span className="text-[10px] opacity-70">All Banks</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Fare Breakdown & Holographic Pass Preview */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Live Fare Summary */}
            <div
              className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
                isTerra
                  ? 'bg-white border-[#e8e2d8]'
                  : 'bg-slate-900/70 border-white/10'
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                Live Fare Summary
              </span>
              <div className="flex items-center justify-between text-xs">
                <span>Base Pass Subtotal</span>
                <span className="font-semibold">₹{baseSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>GST & Cultural Tax (18%)</span>
                <span className="font-semibold">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Smart RFID Band Fee</span>
                <span className="font-semibold">₹{rfidFee}</span>
              </div>
              {earlyBirdDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold">
                  <span>Early Bird Season Promo</span>
                  <span>-₹{earlyBirdDiscount}</span>
                </div>
              )}
              <div
                className={`pt-3 border-t flex items-center justify-between ${
                  isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
                }`}
              >
                <div className="flex flex-col">
                  <span
                    className={`text-[10px] uppercase font-semibold ${
                      isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                    }`}
                  >
                    Total Payable
                  </span>
                  <span
                    className={`text-2xl font-extrabold ${
                      isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                    }`}
                  >
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded border opacity-75">
                  Inclusive of taxes
                </span>
              </div>
            </div>

            {/* Smart Holographic RFID Pass Mockup (Matches Image 7) */}
            <div
              className={`p-4 rounded-xl border relative overflow-hidden flex flex-col gap-2.5 shadow-md ${
                isTerra
                  ? 'bg-gradient-to-br from-white to-[#f4efe6] border-[#4a7c59]/40'
                  : 'bg-gradient-to-br from-slate-900 to-slate-950 border-sky-400/40 glow-cyan'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                    }`}
                  >
                    nfc
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                    }`}
                  >
                    SMART RFID PASS
                  </span>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                    isTerra
                      ? 'bg-[#4a7c59]/10 text-[#4a7c59] border-[#4a7c59]/30'
                      : 'bg-sky-400/20 text-sky-200 border-sky-400/40'
                  }`}
                >
                  Gate 3 VIP Priority
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex flex-col">
                  <span
                    className={`text-[10px] uppercase ${
                      isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                    }`}
                  >
                    Attendee
                  </span>
                  <span className="text-sm font-bold">
                    {attendeeName || 'Aarav Patel'}
                    {totalTickets > 1 ? ` + ${totalTickets - 1}` : ''}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                    }`}
                  >
                    Pass ID: #NAV26-{venue.id.slice(0, 4).toUpperCase()}-
                    {Math.floor(10000 + Math.random() * 90000)}
                  </span>
                </div>

                {/* QR Code visual */}
                <div
                  className={`w-14 h-14 rounded-lg p-1.5 flex items-center justify-center border ${
                    isTerra
                      ? 'bg-white border-[#c4c8bc] text-[#4a7c59]'
                      : 'bg-slate-800 border-sky-400/40 text-sky-300'
                  }`}
                >
                  <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v2h-4v-2zm2-2h2v2h-2v-2zM6 6h0m0 12h0m12-12h0" />
                  </svg>
                </div>
              </div>

              {/* Barcode Line Visual */}
              <div className="pt-1 flex flex-col gap-1">
                <div
                  className={`w-full h-6 flex items-center justify-around px-1 rounded overflow-hidden border ${
                    isTerra
                      ? 'bg-[#f4efe6] border-[#c4c8bc]'
                      : 'bg-slate-950 border-white/5'
                  }`}
                >
                  <span className="w-1 h-full bg-slate-600" />
                  <span className="w-0.5 h-full bg-slate-400" />
                  <span
                    className={`w-1.5 h-full ${
                      isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                    }`}
                  />
                  <span className="w-0.5 h-full bg-slate-400" />
                  <span className="w-2 h-full bg-slate-600" />
                  <span
                    className={`w-1 h-full ${
                      isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                    }`}
                  />
                  <span className="w-0.5 h-full bg-slate-400" />
                  <span className="w-1.5 h-full bg-slate-600" />
                  <span
                    className={`w-2 h-full ${
                      isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                    }`}
                  />
                  <span className="w-0.5 h-full bg-slate-400" />
                  <span className="w-1.5 h-full bg-slate-600" />
                  <span
                    className={`w-0.5 h-full ${
                      isTerra ? 'bg-[#4a7c59]' : 'bg-sky-400'
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center justify-between text-[9px] font-mono ${
                    isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                  }`}
                >
                  <span>OCT2026-RFID</span>
                  <span>ENCRYPTED: 256-BIT</span>
                </div>
              </div>

              <div
                className={`flex items-center gap-1.5 text-[10px] pt-1 ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                  }`}
                >
                  contactless
                </span>
                <span>Tap at NFC Turnstile Gate 3 & 4 • WhatsApp delivery</span>
              </div>
            </div>
          </div>

          {/* Sticky Modal Footer */}
          <div
            className={`lg:col-span-12 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isTerra ? 'border-[#e4e0d8]' : 'border-white/10'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs ${
                isTerra ? 'text-[#6b6358]' : 'text-slate-400'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[17px] ${
                  isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
                }`}
              >
                verified
              </span>
              <span>100% Refundable until 48 hours prior to Day 1</span>
            </div>

            <button
              type="submit"
              disabled={totalTickets === 0}
              className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                totalTickets === 0
                  ? 'opacity-50 cursor-not-allowed bg-slate-400 text-white'
                  : isTerra
                  ? 'bg-[#4a7c59] text-white hover:bg-[#3d6749] active:scale-95'
                  : 'bg-gradient-to-r from-sky-400 via-primary to-sky-300 text-slate-950 font-extrabold hover:brightness-110 active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Proceed to Dummy Payment Gateway (₹{grandTotal.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
