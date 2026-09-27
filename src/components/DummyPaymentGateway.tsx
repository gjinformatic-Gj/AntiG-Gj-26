import React, { useState, useEffect } from 'react';
import { BookingState, ConfirmedTicket } from '../types';

interface DummyPaymentGatewayProps {
  isOpen: boolean;
  booking: BookingState | null;
  amount: number;
  onPaymentSuccess: (ticket: ConfirmedTicket) => void;
  onPaymentCancel: () => void;
}

export const DummyPaymentGateway: React.FC<DummyPaymentGatewayProps> = ({
  isOpen,
  booking,
  amount,
  onPaymentSuccess,
  onPaymentCancel,
}) => {
  if (!isOpen || !booking) return null;

  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('aarav.patel@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState(booking.attendeeName);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [timeLeft, setTimeLeft] = useState(299); // 5 mins
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [processingMsg, setProcessingMsg] = useState('');

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = (isSuccess: boolean) => {
    setProcessingState('processing');
    setProcessingMsg('Connecting to Bank Gateway...');

    setTimeout(() => {
      setProcessingMsg('Securing 256-bit Token Authorization...');
    }, 800);

    setTimeout(() => {
      if (isSuccess) {
        setProcessingMsg('Generating Digital RFID Wristband E-Pass...');
        setProcessingState('success');

        setTimeout(() => {
          const ticketId = `PASS-NAV26-${Math.floor(100000 + Math.random() * 900000)}`;
          const txId = `TXN_${Date.now().toString(36).toUpperCase()}`;

          const confirmed: ConfirmedTicket = {
            ticketId,
            venueId: booking.venue.id,
            venueName: booking.venue.name,
            venueLocation: booking.venue.location,
            attendeeName: booking.attendeeName,
            attendeePhone: booking.attendeePhone,
            passType: booking.passType,
            selectedDate: booking.selectedDate,
            counts: booking.counts,
            totalPaid: amount,
            transactionId: txId,
            paymentMethod: activeTab.toUpperCase(),
            purchaseDate: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            curfewInfo: booking.venue.curfewTime,
            qrCodeData: `https://garbaradar.in/verify/${ticketId}`,
            barcode: `NR26-${booking.venue.id.slice(0, 3).toUpperCase()}-${ticketId}`,
            rfidStatus: 'Issued',
          };

          onPaymentSuccess(confirmed);
        }, 1200);
      } else {
        setProcessingState('failed');
        setProcessingMsg('Bank transaction declined by issuer.');
      }
    }, 1900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-2xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Fake Browser URL Bar Header */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-md border border-slate-200 text-slate-700 text-[11px] shadow-inner">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">lock</span>
            <span>https://pg.garbaradar.in/checkout/v2/secure?session=sess_nav26_live</span>
          </div>
          <span className="text-[11px] font-bold text-slate-400">TEST GATEWAY</span>
        </div>

        {/* Merchant & Order Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">GarbaPay Secure Gateway</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                  Sandbox Active
                </span>
              </div>
              <span className="text-xs text-slate-300 block truncate max-w-xs sm:max-w-sm">
                Navratri Mahotsav Samiti • {booking.venue.name}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-300 uppercase block font-medium">Payable</span>
            <span className="text-2xl font-black text-emerald-400">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Active Processing Overlay */}
        {processingState !== 'idle' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            {processingState === 'processing' && (
              <>
                <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <h4 className="text-lg font-bold text-slate-800">Processing Your Payment</h4>
                <p className="text-sm text-slate-500">{processingMsg}</p>
                <span className="text-xs text-slate-400">Please do not refresh or hit back</span>
              </>
            )}

            {processingState === 'success' && (
              <>
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold animate-bounce">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-emerald-700">Payment Successful!</h4>
                <p className="text-sm text-slate-600">{processingMsg}</p>
                <span className="text-xs text-slate-400">Redirecting to your Digital Pass Wallet...</span>
              </>
            )}

            {processingState === 'failed' && (
              <>
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl font-bold">
                  ✕
                </div>
                <h4 className="text-lg font-bold text-rose-700">Payment Failed</h4>
                <p className="text-sm text-slate-600">{processingMsg}</p>
                <button
                  onClick={() => setProcessingState('idle')}
                  className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}

        {/* Normal Payment Tabs */}
        {processingState === 'idle' && (
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
            {/* Payment Method Selector Sidebar */}
            <div className="md:col-span-4 bg-slate-50 border-r border-slate-200 p-3 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`p-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === 'upi'
                    ? 'bg-white shadow-md text-emerald-700 border border-emerald-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-emerald-600">
                  qr_code_2
                </span>
                <div className="flex flex-col">
                  <span className="text-xs">UPI QR & Apps</span>
                  <span className="text-[10px] text-emerald-600 font-normal">GPay, PhonePe, Paytm</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`p-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-white shadow-md text-emerald-700 border border-emerald-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-indigo-600">
                  credit_card
                </span>
                <div className="flex flex-col">
                  <span className="text-xs">Cards (Debit/Credit)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Visa, Mastercard, RuPay</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`p-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === 'netbanking'
                    ? 'bg-white shadow-md text-emerald-700 border border-emerald-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-amber-600">
                  account_balance
                </span>
                <div className="flex flex-col">
                  <span className="text-xs">Net Banking</span>
                  <span className="text-[10px] text-slate-400 font-normal">All Indian Banks</span>
                </div>
              </button>

              <div className="mt-auto p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                <div className="flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-sm">timer</span>
                  <span>Session: {formatTimer(timeLeft)}</span>
                </div>
                <p className="text-[10px] text-emerald-700 leading-tight">
                  Pass inventory held exclusively for 5 minutes.
                </p>
              </div>
            </div>

            {/* Tab Details Content */}
            <div className="md:col-span-8 p-5 flex flex-col justify-between space-y-4">
              {activeTab === 'upi' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Scan & Pay via any UPI App</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">Instant Zero Fee</span>
                  </div>

                  {/* QR Box */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                      <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v2h-4v-2zm2-2h2v2h-2v-2zM6 6h0m0 12h0m12-12h0" />
                      </svg>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                          PhonePe
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                          GPay
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-700">
                          Paytm
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">
                        Open your camera or preferred UPI app to scan and authorize payment of{' '}
                        <strong>₹{amount.toLocaleString('en-IN')}</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Or Enter UPI ID */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Or Pay using UPI VPA ID
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@bank"
                        className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSimulatePayment(true)}
                        className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-sm"
                      >
                        Verify & Pay
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Enter Card Details</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber('4242 4242 4242 4242');
                        setExpiry('11/29');
                        setCvv('424');
                      }}
                      className="text-[11px] text-emerald-600 font-bold hover:underline"
                    >
                      Fill Demo Card
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                        Valid Thru
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'netbanking' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block pb-1 border-b border-slate-100">
                    Select Your Bank
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Bank of Baroda'].map(
                      (bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                            selectedBank === bank
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons & Simulation Shortcuts */}
              <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(true)}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Pay ₹{amount.toLocaleString('en-IN')} (Simulate Success)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(false)}
                    className="py-3 px-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100 transition-all cursor-pointer"
                    title="Simulate Declined Payment"
                  >
                    Simulate Fail
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={onPaymentCancel}
                    className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Cancel and Return to Festival Portal
                  </button>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-emerald-600">lock</span>
                    PCI-DSS 256-Bit Encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
