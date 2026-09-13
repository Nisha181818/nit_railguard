import React from 'react';
import {
  Sparkles,
  Sun,
  CloudRain,
  AlertTriangle,
  RotateCcw,
  Activity,
  Zap,
} from 'lucide-react';

export default function DemoSimulationBar({
  activeSimulation,
  onTriggerSimulation,
  onResetSimulation,
}) {
  return (
    <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-blue-950/70 border border-purple-500/30 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
          <Zap className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-purple-300">
              HACKATHON JUDGE SIMULATION CONTROLS
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {activeSimulation ? `Active: ${activeSimulation}` : 'Baseline Telemetry'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Inject synthetic environmental stress and track defects to test real-time AI risk recalculation and alerts
          </p>
        </div>
      </div>

      {/* Trigger Buttons */}
      <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
        <button
          onClick={() => onTriggerSimulation('HEATWAVE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSimulation === 'HEATWAVE'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
              : 'bg-slate-800 text-rose-300 hover:bg-rose-950/50 border border-rose-500/30'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Simulate Heatwave (46°C)</span>
        </button>

        <button
          onClick={() => onTriggerSimulation('MONSOON')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSimulation === 'MONSOON'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-slate-800 text-blue-300 hover:bg-blue-950/50 border border-blue-500/30'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>Simulate Monsoon (85mm)</span>
        </button>

        <button
          onClick={() => onTriggerSimulation('MICRO_FRACTURE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSimulation === 'MICRO_FRACTURE'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400'
              : 'bg-slate-800 text-amber-300 hover:bg-amber-950/50 border border-amber-500/30'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Simulate Micro-Fracture</span>
        </button>

        {activeSimulation && (
          <button
            onClick={onResetSimulation}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Restore baseline parameters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Baseline</span>
          </button>
        )}
      </div>
    </div>
  );
}
