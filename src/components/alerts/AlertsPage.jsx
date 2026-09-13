import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  Check,
  Radio,
  Search,
  TrainTrack,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function AlertsPage({
  alerts = [],
  onAcknowledgeAlert,
  onResolveAlert,
  onAcknowledgeAll,
}) {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCount = alerts.filter((a) => a.status === 'Active').length;
  const criticalCount = alerts.filter((a) => a.severity === 'Critical' && a.status === 'Active').length;
  const warningCount = alerts.filter((a) => a.severity === 'Warning' && a.status === 'Active').length;

  const filteredAlerts = alerts.filter((item) => {
    const matchesSev =
      severityFilter === 'ALL' ||
      (severityFilter === 'CRITICAL' && item.severity === 'Critical') ||
      (severityFilter === 'WARNING' && item.severity === 'Warning');

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && item.status === 'Active') ||
      (statusFilter === 'ACKNOWLEDGED' && item.status === 'Acknowledged') ||
      (statusFilter === 'RESOLVED' && item.status === 'Resolved');

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.trackName.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q);

    return matchesSev && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300 bg-orange-500/10 border border-orange-500/30 rounded">
              MODULE 6 • REAL-TIME DISPATCH ALERTS
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Automated Risk & Environmental Triggers</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BellRing className="w-6 h-6 text-orange-400" />
            <span>Operational Safety Alert Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multichannel incident notifications generated automatically from risk thresholds, weather telemetry, and defect logs
          </p>
        </div>

        {activeCount > 0 && (
          <button
            onClick={onAcknowledgeAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors self-start sm:self-auto"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Acknowledge All Active Alerts</span>
          </button>
        )}
      </div>

      {/* Alert KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Unresolved Alerts
            </span>
            <span className="text-2xl font-extrabold text-white mt-1 block">
              {activeCount}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-rose-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
              Critical Urgency
            </span>
            <span className="text-2xl font-extrabold text-rose-300 mt-1 block">
              {criticalCount}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
              Warning Severity
            </span>
            <span className="text-2xl font-extrabold text-amber-300 mt-1 block">
              {warningCount}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by corridor, defect or keyword..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0b1120] border border-slate-800 focus:border-orange-500 focus:outline-none rounded-lg text-slate-200 placeholder-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#0b1120] border border-slate-800 rounded-lg p-1 text-xs">
            {['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'ALL'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ACTIVE'
                  ? `Active (${activeCount})`
                  : st === 'ACKNOWLEDGED'
                  ? 'Acknowledged'
                  : st === 'RESOLVED'
                  ? 'Resolved'
                  : 'All'}
              </button>
            ))}
          </div>

          {/* Severity Tabs */}
          <div className="flex items-center bg-[#0b1120] border border-slate-800 rounded-lg p-1 text-xs">
            {['ALL', 'CRITICAL', 'WARNING'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  severityFilter === sev
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev === 'ALL' ? 'All Severities' : sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              Zero Unresolved Hazards in this View
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All corridors operating normally or all alerts matching your filter are resolved.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'Critical';

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-xl border bg-[#111827] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  alert.status === 'Resolved'
                    ? 'opacity-60 border-slate-800'
                    : isCritical
                    ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-[#111827] to-[#111827]'
                    : 'border-amber-500/30 bg-gradient-to-r from-amber-950/15 via-[#111827] to-[#111827]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isCritical ? (
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="font-mono text-xs text-slate-400 font-semibold">
                        {alert.id}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                        <TrainTrack className="w-3.5 h-3.5" />
                        <span>{alert.trackName}</span>
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {alert.message}
                    </p>

                    {alert.recommendation && (
                      <div className="mt-2 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          Recommended Protocol
                        </span>
                        <span>{alert.recommendation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800 shrink-0">
                  <div className="mb-1">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        alert.status === 'Resolved'
                          ? 'bg-slate-800 text-slate-400'
                          : alert.status === 'Acknowledged'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      Status: {alert.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.status === 'Active' && (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}

                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
