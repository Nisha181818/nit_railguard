import React from 'react';
import {
  Shield,
  ArrowRight,
  Info,
  Activity,
  Cpu,
  Radio,
  TrainTrack,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { BRAND_INFO } from '../../data/mockData';

export default function LandingPage({ onOpenDashboard, onLearnMore }) {
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0d1424]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  {BRAND_INFO.name}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-300 bg-blue-500/15 border border-blue-500/30 rounded-full">
                  Hackathon Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Infrastructure Sentinel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLearnMore}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              System Specs
            </button>
            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-all hover:translate-y-[-1px]"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Top Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{BRAND_INFO.tagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Safeguarding Railway Corridors with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                Predictive Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              {BRAND_INFO.description}
            </p>

            {/* Call to Actions */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] focus:outline-none"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLearnMore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 rounded-xl transition-all"
              >
                <Info className="w-4 h-4 text-blue-400" />
                <span>Learn More</span>
              </button>
            </div>

            {/* Railway Motif Banner */}
            <div className="mt-14 max-w-3xl mx-auto p-4 rounded-xl bg-[#0f172a]/90 border border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <TrainTrack className="w-4 h-4 text-blue-400" />
                <span>P-Way Structural Telemetry</span>
              </div>
              <div className="h-4 w-px bg-slate-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>AI Risk Forecasting</span>
              </div>
              <div className="h-4 w-px bg-slate-700 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Zero-Accident Early Warnings</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-16 bg-[#0c1220]/60 border-t border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                System Pillars
              </h2>
              <h3 className="text-2xl font-bold text-white mt-1">
                Modular Early-Warning Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Designed for high-speed rail corridors, freight lines, and vulnerable bridge approaches
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <Radio className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  IoT Track Telemetry
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time acquisition of axle vibration, rail temperature variance, and embankment moisture to catch physical degradation at micro-scale.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-blue-400 font-medium flex items-center gap-1">
                  <span>Planned Sensor Mesh</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  AI Risk Engine
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deep machine learning models analyzing cyclic stress, track geometry deterioration curves, and anomalous resonance patterns.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-purple-400 font-medium flex items-center gap-1">
                  <span>Predictive Intelligence</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Inspector Command Center
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unified dashboard giving Section Engineers actionable alerts, digital inspection logs, and instant track section health assessments.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span>Operational Dashboard</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d1424] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-300">{BRAND_INFO.name}</span>
            <span>—</span>
            <span>{BRAND_INFO.version}</span>
          </div>

          <div className="text-center sm:text-right">
            <p>Hackathon Proof of Concept • Module 1 Foundation Shell</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Simulated demonstration interface for railway safety engineering.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
