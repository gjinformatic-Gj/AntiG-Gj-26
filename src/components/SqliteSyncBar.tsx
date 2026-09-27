import React, { useState } from 'react';
import { ThemeMode, Venue } from '../types';
import { SqliteStats } from '../services/dataSync';

interface SqliteSyncBarProps {
  stats: SqliteStats;
  theme: ThemeMode;
  venues: Venue[];
  onOpenAddEvent: () => void;
  onRefreshSync: () => void;
  onDeleteVenue: (id: string) => Promise<void>;
  onResetDb: () => Promise<void>;
  onSelectVenue: (venue: Venue) => void;
}

export const SqliteSyncBar: React.FC<SqliteSyncBarProps> = ({
  stats,
  theme,
  venues,
  onOpenAddEvent,
  onRefreshSync,
  onDeleteVenue,
  onResetDb,
  onSelectVenue,
}) => {
  const isTerra = theme === 'terra';
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleReset = async () => {
    if (window.confirm('Reset SQLite database back to the original default 9 Garba venues?')) {
      setIsResetting(true);
      try {
        await onResetDb();
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete "${name}" from local SQLite database?`)) {
      setDeletingId(id);
      try {
        await onDeleteVenue(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <>
      {/* Live Sync Status Banner */}
      <div
        className={`w-full rounded-2xl p-3 sm:p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${
          isTerra
            ? 'bg-gradient-to-r from-[#f7f2e9] via-[#f1ebe0] to-[#f7f2e9] border-[#c4c8bc]'
            : 'bg-gradient-to-r from-slate-900/90 via-[#0b1426]/90 to-slate-900/90 border-sky-400/25 glow-cyan'
        }`}
      >
        {/* Left side: Sync info & Live badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold font-headline flex items-center gap-1.5">
              <span>Local SQLite Dynamic Sync</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase border ${
                  isTerra
                    ? 'bg-[#4a7c59]/15 text-[#4a7c59] border-[#4a7c59]/30'
                    : 'bg-sky-400/20 text-sky-300 border-sky-400/40'
                }`}
              >
                Zero-Dependency
              </span>
            </span>
          </div>

          <div
            className={`hidden md:flex items-center gap-2 text-xs border-l pl-3 ${
              isTerra ? 'border-[#d8d1c5] text-[#6b6358]' : 'border-white/10 text-slate-400'
            }`}
          >
            <span className="font-mono text-[11px] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
              garba_radar.db
            </span>
            <span>•</span>
            <strong className={isTerra ? 'text-[#4a7c59]' : 'text-sky-300'}>
              {venues.length} Grounds Active
            </strong>
            <span>•</span>
            <span className="text-[11px] opacity-80">node:sqlite</span>
          </div>
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* Refresh / Sync Now Button */}
          <button
            onClick={onRefreshSync}
            title="Poll / Re-sync from SQLite"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
              isTerra
                ? 'bg-white border-[#c4c8bc] text-[#2e3230] hover:bg-[#e8e2d8]'
                : 'bg-slate-800/80 border-white/15 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">sync</span>
            <span className="hidden sm:inline">Sync Now</span>
          </button>

          {/* SQLite DB Inspector Button */}
          <button
            onClick={() => setIsInspectorOpen(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
              isTerra
                ? 'bg-white border-[#c4c8bc] text-[#2e3230] hover:border-[#4a7c59]'
                : 'bg-slate-800/80 border-white/15 text-slate-200 hover:border-sky-400'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#4a7c59]">database</span>
            <span>Manage DB</span>
          </button>

          {/* + Add New Event Button */}
          <button
            onClick={onOpenAddEvent}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
              isTerra
                ? 'bg-[#4a7c59] text-white hover:bg-[#3d694b]'
                : 'bg-sky-400 text-slate-950 hover:bg-sky-300 font-extrabold'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* SQLite Management & Inspection Modal */}
      {isInspectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsInspectorOpen(false)}
          />

          <div
            className={`relative w-full max-w-3xl rounded-3xl p-6 shadow-2xl border z-10 transition-all space-y-5 max-h-[85vh] overflow-y-auto ${
              isTerra
                ? 'bg-[#faf6f0] border-[#c4c8bc] text-[#2e3230]'
                : 'bg-[#0f172a] border-sky-400/30 text-slate-100 glow-cyan'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isTerra
                      ? 'bg-[#4a7c59]/15 text-[#4a7c59] border-[#4a7c59]/30'
                      : 'bg-sky-400/20 text-sky-300 border-sky-400/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">database</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-headline">SQLite Database Inspector</h3>
                  <p className="text-xs opacity-75">
                    Zero-dependency relational SQLite engine powered by Node.js built-in `node:sqlite`.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInspectorOpen(false)}
                className="p-2 rounded-full border border-inherit opacity-70 hover:opacity-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Architecture Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                className={`p-3 rounded-2xl border text-center ${
                  isTerra ? 'bg-white border-[#e4ded3]' : 'bg-slate-900 border-white/10'
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-60 block">Engine</span>
                <span className="text-xs font-bold text-emerald-500">node:sqlite</span>
              </div>
              <div
                className={`p-3 rounded-2xl border text-center ${
                  isTerra ? 'bg-white border-[#e4ded3]' : 'bg-slate-900 border-white/10'
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-60 block">Total Records</span>
                <span className="text-base font-bold">{venues.length} Venues</span>
              </div>
              <div
                className={`p-3 rounded-2xl border text-center ${
                  isTerra ? 'bg-white border-[#e4ded3]' : 'bg-slate-900 border-white/10'
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-60 block">Database File</span>
                <span className="text-xs font-mono font-bold truncate block">garba_radar.db</span>
              </div>
              <div
                className={`p-3 rounded-2xl border text-center ${
                  isTerra ? 'bg-white border-[#e4ded3]' : 'bg-slate-900 border-white/10'
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-60 block">Realtime Sync</span>
                <span className="text-xs font-bold text-[#4a7c59] flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  SSE Stream
                </span>
              </div>
            </div>

            {/* Events List in SQLite */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Stored SQLite Ground Records ({venues.length})
                </span>
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                  <span>{isResetting ? 'Resetting...' : 'Reset to Defaults'}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {venues.map((v) => (
                  <div
                    key={v.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isTerra
                        ? 'bg-white border-[#e4ded3] hover:border-[#4a7c59]'
                        : 'bg-slate-900/80 border-white/10 hover:border-sky-400'
                    }`}
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        onSelectVenue(v);
                        setIsInspectorOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-headline">{v.name}</strong>
                        {v.isOvernight && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                            3 AM Overnight
                          </span>
                        )}
                      </div>
                      <p className="opacity-70 text-[11px] truncate">
                        {v.location} • ₹{v.prices.single} single / ₹{v.prices.season} season • {v.artist.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectVenue(v);
                          setIsInspectorOpen(false);
                        }}
                        title="View on Dashboard"
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                          isTerra
                            ? 'border-[#c4c8bc] hover:bg-[#e8e2d8]'
                            : 'border-white/15 hover:bg-white/10'
                        }`}
                      >
                        View
                      </button>

                      {/* Allow deleting any custom venue or any venue */}
                      <button
                        onClick={() => handleDelete(v.id, v.name)}
                        disabled={deletingId === v.id}
                        title="Delete from SQLite"
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {deletingId === v.id ? 'hourglass_top' : 'delete'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log / Telemetry snippet */}
            {stats.recentLogs && stats.recentLogs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-inherit">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  Recent SQLite Audit Log
                </span>
                <div
                  className={`p-2.5 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto ${
                    isTerra ? 'bg-[#ede7dd]' : 'bg-black/50 text-slate-300'
                  }`}
                >
                  {stats.recentLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="flex items-center justify-between gap-3 text-[10px]">
                      <span className="text-emerald-500 font-bold">[{log.action}]</span>
                      <span className="truncate flex-1">{log.details}</span>
                      <span className="opacity-50">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-inherit">
              <span className="text-xs opacity-60">Connected to local SQLite engine</span>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  isTerra
                    ? 'bg-[#4a7c59] text-white'
                    : 'bg-sky-400 text-slate-950 font-bold'
                }`}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
