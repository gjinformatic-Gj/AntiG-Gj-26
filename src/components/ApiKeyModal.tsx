import React, { useState } from 'react';
import { ThemeMode } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSaveKey: (key: string) => void;
  theme: ThemeMode;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
  theme,
}) => {
  if (!isOpen) return null;

  const isTerra = theme === 'terra';
  const [inputKey, setInputKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      alert('Please enter a valid Google Maps API Key');
      return;
    }
    onSaveKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleResetToDemo = () => {
    const demo = 'AIzaSyBC9pStR6UNt8zbge_Pr9ZDiKKdCGsw4kM';
    setInputKey(demo);
    onSaveKey(demo);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border p-6 transition-all ${
          isTerra
            ? 'bg-[#faf6f0] border-[#c4c8bc] text-[#2e3230]'
            : 'bg-[#0f172a] border-sky-400/30 text-slate-100 glow-cyan'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-2xl ${
                isTerra ? 'text-[#4a7c59]' : 'text-sky-300'
              }`}
            >
              key
            </span>
            <h3 className="text-lg font-bold font-headline">Google Maps API Key</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4">
          <p
            className={`text-xs leading-relaxed ${
              isTerra ? 'text-[#6b6358]' : 'text-slate-400'
            }`}
          >
            You can provide your own Google Maps API Key below, or use the pre-configured authorized demo key. Your key will be saved securely in your browser session.
          </p>

          <div>
            <label
              className={`text-[11px] font-bold block mb-1 uppercase tracking-wider ${
                isTerra ? 'text-[#6b6358]' : 'text-slate-400'
              }`}
            >
              API Key (VITE_GOOGLE_MAPS_API_KEY)
            </label>
            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                required
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className={`w-full p-2.5 pr-10 rounded-xl border text-xs font-mono focus:outline-none ${
                  isTerra
                    ? 'bg-white border-[#c4c8bc] text-[#2e3230] focus:border-[#4a7c59]'
                    : 'bg-slate-900 border-white/15 text-slate-100 focus:border-sky-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 opacity-60 hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-600 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Key saved successfully! Reloading live map...</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetToDemo}
              className={`text-xs underline cursor-pointer ${
                isTerra ? 'text-[#4a7c59]' : 'text-sky-400'
              }`}
            >
              Use Authorized Demo Key
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                  isTerra
                    ? 'bg-white border-[#c4c8bc] text-[#2e3230]'
                    : 'bg-slate-800 border-white/10 text-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  isTerra
                    ? 'bg-[#4a7c59] text-white hover:bg-[#3d6749]'
                    : 'bg-sky-400 text-slate-950 hover:bg-sky-300'
                }`}
              >
                Apply Key
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
