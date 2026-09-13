import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  section,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !section) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#111827] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header with Alert styling */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Delete Track Section?
              </h3>
              <p className="text-[11px] text-rose-300">
                Safety Infrastructure Confirmation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-3 text-xs text-slate-300">
          <p>
            Are you sure you want to remove this railway track section from active monitoring?
          </p>

          <div className="p-3.5 rounded-xl bg-[#0b1120] border border-slate-800 space-y-1">
            <div className="font-bold text-white text-sm">
              {section.name}
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              ID: {section.id}
            </div>
            <div className="text-slate-400 text-[11px]">
              Corridor: {section.startLocation} → {section.endLocation} ({section.trackLength || `${section.lengthKm} km`})
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            This action will remove the section from local state. You can re-add it anytime via "+ Add Track Section".
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0d1424] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(section.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md shadow-rose-600/30 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
