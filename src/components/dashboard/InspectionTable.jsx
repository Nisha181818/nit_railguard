import React, { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  UserCheck,
  Calendar,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { RECENT_INSPECTIONS } from '../../data/mockData';

export default function InspectionTable({ onSelectInspection, inspections = RECENT_INSPECTIONS }) {
  const [search, setSearch] = useState('');

  const filteredInspections = inspections.filter(
    (item) =>
      item.trackSection?.toLowerCase().includes(search.toLowerCase()) ||
      item.inspector?.toLowerCase().includes(search.toLowerCase()) ||
      item.condition?.toLowerCase().includes(search.toLowerCase()) ||
      item.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Recent Track Inspections
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded">
              DEMO LOG
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified Ultrasonic Flaw Detection (USFD), oscillation checks, and physical walk reports
          </p>
        </div>

        {/* Filter input */}
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inspector or record..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0b1120] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg text-slate-200 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5 px-5 mt-2">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-[#0c1220]">
              <th className="py-3 px-3">Track Section</th>
              <th className="py-3 px-3">Inspection Date</th>
              <th className="py-3 px-3">Inspector</th>
              <th className="py-3 px-3">Track Condition</th>
              <th className="py-3 px-3 text-center">Risk Level</th>
              <th className="py-3 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredInspections.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelectInspection && onSelectInspection(item)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                {/* Track Section */}
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-white">
                    {item.trackSection}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {item.trackCode}
                  </div>
                </td>

                {/* Date */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{item.inspectionDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {item.id}
                  </div>
                </td>

                {/* Inspector */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{item.inspector}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    {item.method}
                  </div>
                </td>

                {/* Condition */}
                <td className="py-3.5 px-3">
                  <span className="text-slate-300">
                    {item.condition}
                  </span>
                </td>

                {/* Risk Level */}
                <td className="py-3.5 px-3 text-center">
                  <StatusBadge status={item.riskLevel} size="sm" />
                </td>

                {/* Status */}
                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                      item.status.includes('Required')
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : item.status.includes('Scheduled') || item.status.includes('Queued')
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInspections.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-xs">
          No inspection records found matching "{search}".
        </div>
      )}
    </div>
  );
}
