import React from 'react';
import { X, History, Calendar, UserCheck, Activity, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function TrackHistoryModal({
  isOpen,
  onClose,
  trackSection,
  inspections = [],
}) {
  if (!isOpen || !trackSection) return null;

  // Find all inspections corresponding to this section
  const sectionHistory = inspections.filter(
    (i) =>
      i.trackSectionId === trackSection.id ||
      i.trackSection?.toLowerCase().includes(trackSection.name.toLowerCase()) ||
      trackSection.name?.toLowerCase().includes(i.trackSection?.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d1424]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{trackSection.name}</span>
                <StatusBadge status={trackSection.riskStatus || trackSection.status} size="sm" />
              </h3>
              <p className="text-xs text-slate-400">
                Track Health Audit Trail & Inspection Progression ({trackSection.id})
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

        {/* Section Specs Bar */}
        <div className="px-6 py-3 bg-[#0a0f1d] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Route: <strong className="text-white">{trackSection.startLocation} → {trackSection.endLocation}</strong>
          </span>
          <span className="text-slate-400">
            Length: <strong className="text-white">{trackSection.trackLength || `${trackSection.lengthKm} km`}</strong>
          </span>
          <span className="text-slate-400">
            Current Risk Score: <strong className="text-amber-400">{trackSection.riskScore || 20}/100</strong>
          </span>
        </div>

        {/* Timeline Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Inspection History Timeline ({sectionHistory.length} logged events)
          </div>

          {sectionHistory.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
              No historical inspection logs registered for this specific track ID yet. Use "Log New Inspection" to record an audit.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {sectionHistory.map((item, idx) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      item.riskLevel === 'Healthy'
                        ? 'bg-[#0d1424] border-emerald-500 text-emerald-400'
                        : item.riskLevel === 'Moderate'
                        ? 'bg-[#0d1424] border-amber-500 text-amber-400'
                        : 'bg-[#0d1424] border-rose-500 text-rose-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  </div>

                  {/* Event Card */}
                  <div className="bg-[#0e1526] border border-slate-800 rounded-xl p-4 shadow-sm space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-bold text-white">
                          {item.inspectionDate}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ({item.id})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.riskLevel} size="sm" />
                      </div>
                    </div>

                    <div className="text-xs text-slate-300">
                      <div className="text-slate-400 text-[11px]">Condition Diagnosis:</div>
                      <div className="font-semibold text-white mt-0.5">{item.condition}</div>
                    </div>

                    {item.defects && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-xs">
                        <span className="text-slate-400">Defects Noted: </span>
                        <span className="text-amber-300 font-medium">{item.defects}</span>
                      </div>
                    )}

                    <div className="text-xs text-slate-400 leading-relaxed italic">
                      "{item.notes}"
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.inspector}</span>
                      </div>
                      <span className="font-medium text-slate-300">{item.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0d1424] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
}
