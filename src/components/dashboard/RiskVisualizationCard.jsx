import React from 'react';
import { ShieldCheck, AlertCircle, Info, Sparkles } from 'lucide-react';
import { RISK_DISTRIBUTION } from '../../data/mockData';

export default function RiskVisualizationCard({
  onTriggerAiModal,
  distribution = null,
  healthIndex = '91.4%',
}) {
  const tiers = distribution || RISK_DISTRIBUTION;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Network Risk Status Distribution
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded">
              AI Risk Engine Integrated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-factor early warning categorization across all monitored corridors
          </p>
        </div>

        <button
          onClick={onTriggerAiModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Engine Details</span>
        </button>
      </div>

      {/* Multi-Segment Proportion Bar */}
      <div className="my-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Overall Network Health Index</span>
          <span className="font-semibold text-emerald-400">{healthIndex} Operational Condition</span>
        </div>
        <div className="w-full h-3.5 rounded-full bg-slate-900 overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
          {tiers.map((item) => (
            <div
              key={item.level}
              style={{ width: `${Math.max(2, item.percentage)}%` }}
              className={`${item.bgClass} h-full rounded-sm transition-all duration-500 relative group`}
              title={`${item.level}: ${item.count} sections (${item.percentage}%)`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-0.5">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Grid of 4 risk tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tiers.map((tier) => (
          <div
            key={tier.level}
            className={`p-3.5 rounded-lg bg-[#0e1526] border ${tier.borderClass} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${tier.textClass}`}>
                  {tier.level}
                </span>
                <span className="text-xs font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700">
                  {tier.percentage}%
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-xl font-black text-white">{tier.count}</span>
                <span className="text-[11px] text-slate-400">track sections</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {tier.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Notice */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong className="text-slate-300">Live Inference:</strong> Dynamic scores react immediately to weather shifts, newly logged ultrasonic tests, and simulated environmental extremes.
        </span>
      </div>
    </div>
  );
}
