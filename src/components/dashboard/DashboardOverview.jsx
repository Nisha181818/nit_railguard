import React from 'react';
import { AlertCircle, Activity, Sparkles, BellRing, ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import StatCardsGrid from './StatCardsGrid';
import QuickActionsGrid from './QuickActionsGrid';
import RiskVisualizationCard from './RiskVisualizationCard';
import TrackHealthTable from './TrackHealthTable';
import InspectionTable from './InspectionTable';
import DemoSimulationBar from '../common/DemoSimulationBar';
import { BRAND_INFO } from '../../data/mockData';

export default function DashboardOverview({
  onExecuteAction,
  onSelectTrack,
  onSelectInspection,
  onTriggerAiModal,
  sections,
  inspections,
  alerts = [],
  dynamicStats = null,
  dynamicDistribution = null,
  healthIndex = '91.4%',
  activeSimulation = null,
  onTriggerSimulation,
  onResetSimulation,
  onViewAllAlerts,
}) {
  const activeAlerts = alerts.filter((a) => a.status === 'Active');
  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'Critical');

  return (
    <div className="space-y-6 pb-12">
      {/* 0. Hackathon Judge Simulation Bar */}
      <section>
        <DemoSimulationBar
          activeSimulation={activeSimulation}
          onTriggerSimulation={onTriggerSimulation}
          onResetSimulation={onResetSimulation}
        />
      </section>

      {/* 0.1 Active Critical Alerts Notification Banner (if any) */}
      {activeAlerts.length > 0 && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md ${
          criticalAlerts.length > 0
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 animate-in fade-in'
            : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${criticalAlerts.length > 0 ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-amber-500/20 text-amber-400'}`}>
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {criticalAlerts.length > 0 ? 'CRITICAL DISPATCH ALERTS ACTIVE' : 'SAFETY WARNINGS ACTIVE'}
                </span>
                <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded font-mono font-bold">
                  {activeAlerts.length} Active
                </span>
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                {activeAlerts[0]?.title}: {activeAlerts[0]?.message}
              </p>
            </div>
          </div>

          <button
            onClick={onViewAllAlerts}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors shrink-0"
          >
            <span>View All Alerts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Summary Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Network Health Key Metrics
          </h2>
          <span className="text-[11px] text-slate-500">
            Reactive Telemetry • Live State
          </span>
        </div>
        <StatCardsGrid stats={dynamicStats} />
      </section>

      {/* 2. Quick Actions */}
      <section>
        <QuickActionsGrid onExecuteAction={onExecuteAction} />
      </section>

      {/* 3. Risk Status Visualization */}
      <section>
        <RiskVisualizationCard
          onTriggerAiModal={onTriggerAiModal}
          distribution={dynamicDistribution}
          healthIndex={healthIndex}
        />
      </section>

      {/* 4. Track Health Overview */}
      <section>
        <TrackHealthTable onSelectTrack={onSelectTrack} sections={sections} />
      </section>

      {/* 5. Recent Inspections Table */}
      <section>
        <InspectionTable
          onSelectInspection={onSelectInspection}
          inspections={inspections}
        />
      </section>
    </div>
  );
}
