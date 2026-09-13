import React, { useState } from 'react';
import {
  Cpu,
  BrainCircuit,
  AlertTriangle,
  ShieldCheck,
  Clock,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
  BarChart3,
  Layers,
  Search,
  Filter,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { calculateTrackRisk } from '../../services/riskEngine';

export default function RiskAnalysisPage({
  trackSections = [],
  inspections = [],
  weatherMap = {},
}) {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Compute live risk profiles for all track sections
  const assessedSections = trackSections.map((track) => {
    const weather = weatherMap[track.id];
    const riskProfile = calculateTrackRisk(track, inspections, weather);
    return {
      ...track,
      riskProfile,
    };
  });

  const filteredSections = assessedSections.filter((item) => {
    const matchesRisk =
      riskFilter === 'ALL' ||
      (riskFilter === 'HEALTHY' && item.riskProfile.riskLevel === 'Healthy') ||
      (riskFilter === 'MODERATE' && item.riskProfile.riskLevel === 'Moderate') ||
      (riskFilter === 'HIGH' && item.riskProfile.riskLevel === 'High Risk') ||
      (riskFilter === 'CRITICAL' && item.riskProfile.riskLevel === 'Critical');

    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.riskProfile.recommendation.action.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRisk && matchesSearch;
  });

  // Calculate network average score
  const avgScore =
    assessedSections.length > 0
      ? Math.round(assessedSections.reduce((acc, curr) => acc + curr.riskProfile.score, 0) / assessedSections.length)
      : 25;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded">
              MODULES 4 & 5 • PREDICTIVE RISK & AI
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Deterministic Mathematical Reasoning</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            <span>AI Risk Analysis & Safety Recommendations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explainable early-warning scores synthesizing structural condition, ultrasonic recency, weather telemetry, and axle loads
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#111827] border border-slate-800 rounded-xl px-4 py-2.5">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Network Avg Risk
            </span>
            <span className={`text-xl font-extrabold ${avgScore > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {avgScore}/100
            </span>
          </div>
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* AI Prescriptive Action Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#111827] border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Routine Inspection</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Low risk (Score &lt; 35). Structural parameters nominal. Standard quarterly inspection cycle.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
            <Clock className="w-4 h-4" />
            <span>Inspect Soon</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Moderate risk (Score 35–59). Fastener tensioning or ambient monitoring advised within 7–14 days.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-orange-500/20 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Immediate Inspection</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            High risk (Score 60–79). Dispatch Section Engineer for physical transverse ultrasonic check within 24 hrs.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-rose-500/20 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>Maintenance / TSR</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Critical risk (Score &ge; 80). Enforce temporary speed restriction (30 km/h) and deploy emergency gang.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search corridor or recommended action..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0b1120] border border-slate-800 focus:border-purple-500 focus:outline-none rounded-lg text-slate-200 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[
            { id: 'ALL', label: 'All Risks' },
            { id: 'HEALTHY', label: 'Low' },
            { id: 'MODERATE', label: 'Moderate' },
            { id: 'HIGH', label: 'High' },
            { id: 'CRITICAL', label: 'Critical' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRiskFilter(tab.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                riskFilter === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Corridor Risk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSections.map((item) => {
          const { riskProfile } = item;
          const { score, riskLevel, recommendation, reasons, badgeColor } = riskProfile;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-xl border bg-[#111827] flex flex-col justify-between transition-all ${
                riskLevel === 'Critical'
                  ? 'border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : riskLevel === 'High Risk'
                  ? 'border-orange-500/40 shadow-lg shadow-orange-950/20'
                  : riskLevel === 'Moderate'
                  ? 'border-amber-500/30'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header with Title and Score Pill */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {item.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {item.startLocation} → {item.endLocation} ({item.trackLength || `${item.lengthKm} km`})
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-[#0b1120] text-xs font-black">
                      <span
                        className={`text-sm ${
                          badgeColor === 'rose'
                            ? 'text-rose-400'
                            : badgeColor === 'orange'
                            ? 'text-orange-400'
                            : badgeColor === 'amber'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {score}
                      </span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-1">
                      {riskLevel}
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden mb-3 border border-slate-800">
                  <div
                    style={{ width: `${score}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      badgeColor === 'rose'
                        ? 'bg-rose-500'
                        : badgeColor === 'orange'
                        ? 'bg-orange-500'
                        : badgeColor === 'amber'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>

                {/* AI Recommendation Banner */}
                <div className={`p-3 rounded-lg border mb-3 ${
                  badgeColor === 'rose'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : badgeColor === 'orange'
                    ? 'bg-orange-950/30 border-orange-500/40 text-orange-200'
                    : badgeColor === 'amber'
                    ? 'bg-amber-950/25 border-amber-500/30 text-amber-200'
                    : 'bg-emerald-950/25 border-emerald-500/30 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Advisory: {recommendation.action}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                      {recommendation.urgency}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {recommendation.advisory}
                  </p>
                </div>

                {/* Key Risk Drivers Summary */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Mathematical Factor Breakdown
                  </span>
                  {reasons.slice(0, 3).map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-300 py-0.5">
                      <span className="truncate max-w-[280px] text-[11px] text-slate-300">
                        • {r.factor}: {r.description}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-400 shrink-0">
                        {r.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Detail Modal Trigger */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Model: Deterministic 4-Factor Weighted Regression
                </span>
                <button
                  onClick={() => setSelectedTrack(item)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span>Inspect Reasons</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Reasons Modal */}
      {selectedTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="absolute inset-0" onClick={() => setSelectedTrack(null)} />

          <div className="relative w-full max-w-xl bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d1424]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Risk Assessment Deep Dive
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedTrack.id} • {selectedTrack.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrack(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0b1120] border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Calculated Score</span>
                  <span className="text-2xl font-black text-white mt-0.5 block">
                    {selectedTrack.riskProfile.score} / 100
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Assigned Tier</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedTrack.riskProfile.riskLevel} size="md" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2">
                  Factor Contributions & Explanations
                </h4>
                <div className="space-y-2.5">
                  {selectedTrack.riskProfile.reasons.map((r, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#0e1424] border border-slate-800">
                      <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                        <span>{r.factor}</span>
                        <span className="font-mono text-purple-300">{r.impact}</span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
                <span className="font-bold text-purple-300 block mb-1">
                  Prescriptive Action: {selectedTrack.riskProfile.recommendation.action}
                </span>
                <p className="text-slate-300 text-xs">
                  {selectedTrack.riskProfile.recommendation.advisory}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-[#0d1424] flex justify-end">
              <button
                onClick={() => setSelectedTrack(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close Audit Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
