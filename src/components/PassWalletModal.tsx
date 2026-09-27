import React from 'react';
import { ConfirmedTicket, ThemeMode } from '../types';

interface PassWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: ConfirmedTicket[];
  theme: ThemeMode;
}

export const PassWalletModal: React.FC<PassWalletModalProps> = ({
  isOpen,
  onClose,
  tickets,
  theme,
}) => {
  if (!isOpen) return null;

  const isTerra = theme === 'terra';

  const handleDownload = (ticketId: string) => {
    alert(`Pass #${ticketId} downloaded to device! SMS and WhatsApp credentials have been dispatched.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border transition-all ${
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
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                isTerra
                  ? 'bg-[#4a7c59]/10 text-[#4a7c59] border-[#4a7c59]/30'
                  : 'bg-sky-400/20 text-sky-300 border-sky-400/40'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">confirmation_number</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline">My Digital Pass Wallet</h3>
              <span
                className={`text-xs ${
                  isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                }`}
              >
                {tickets.length} Official RFID E-Pass{tickets.length === 1 ? '' : 'es'} Active
              </span>
            </div>
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

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {tickets.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <span className="material-symbols-outlined text-5xl opacity-40">
                confirmation_number
              </span>
              <p className="text-base font-bold">No Active Passes Found</p>
              <p className="text-xs opacity-70 max-w-sm mx-auto">
                Explore our 18 live venues across Ahmedabad and Gandhinagar to book single-night or full 9-night season passes.
              </p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className={`rounded-2xl border p-5 relative overflow-hidden transition-all shadow-md ${
                  isTerra
                    ? 'bg-white border-[#4a7c59]/30'
                    : 'bg-slate-900/90 border-sky-400/30 glow-cyan'
                }`}
              >
                {/* Accent Top Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isTerra
                      ? 'bg-gradient-to-r from-[#4a7c59] to-[#78a886]'
                      : 'bg-gradient-to-r from-sky-400 to-purple-400'
                  }`}
                />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Left: Pass Info */}
                  <div className="md:col-span-8 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isTerra
                            ? 'bg-[#4a7c59]/10 text-[#4a7c59] border-[#4a7c59]/30'
                            : 'bg-sky-400/20 text-sky-200 border-sky-400/40'
                        }`}
                      >
                        {ticket.passType === 'season' ? '9-Night Season Pass' : 'Single Night Entry'}
                      </span>
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                        ● RFID ACTIVE
                      </span>
                      <span className="text-xs font-mono opacity-60">#{ticket.ticketId}</span>
                    </div>

                    <h4 className="text-lg font-bold font-headline">{ticket.venueName}</h4>
                    <p
                      className={`text-xs ${
                        isTerra ? 'text-[#6b6358]' : 'text-slate-400'
                      }`}
                    >
                      {ticket.venueLocation}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                      <div>
                        <span className="text-[10px] opacity-70 block uppercase">Attendee</span>
                        <span className="font-semibold">{ticket.attendeeName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] opacity-70 block uppercase">Validity</span>
                        <span className="font-semibold">{ticket.selectedDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] opacity-70 block uppercase">Amount Paid</span>
                        <span className="font-bold text-emerald-600">₹{ticket.totalPaid}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-[11px] opacity-80">
                      <span className="material-symbols-outlined text-sm text-[#4a7c59]">
                        nest_clock_farsight_analog
                      </span>
                      <span>{ticket.curfewInfo}</span>
                      <span>•</span>
                      <span>Gate 3 & 4 Turnstile Priority</span>
                    </div>
                  </div>

                  {/* Right: QR Code Visual & Actions */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-center gap-2">
                    <div className="w-24 h-24 bg-white p-1 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-slate-900">
                      <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v2h-4v-2zm2-2h2v2h-2v-2zM6 6h0m0 12h0m12-12h0" />
                      </svg>
                    </div>

                    <span className="text-[10px] font-mono tracking-wider font-semibold">
                      {ticket.barcode}
                    </span>

                    <button
                      onClick={() => handleDownload(ticket.ticketId)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer ${
                        isTerra
                          ? 'bg-[#4a7c59] text-white hover:bg-[#3d6749]'
                          : 'bg-sky-400 text-slate-950 hover:bg-sky-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">download</span>
                      <span>Save E-Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
