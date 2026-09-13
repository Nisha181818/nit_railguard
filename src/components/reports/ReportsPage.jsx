import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileCheck,
  Shield,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileDown,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { calculateTrackRisk } from '../../services/riskEngine';

export default function ReportsPage({
  trackSections = [],
  inspections = [],
  weatherMap = {},
  alerts = [],
}) {
  const [selectedSectionId, setSelectedSectionId] = useState('ALL');
  const [reportType, setReportType] = useState('AUDIT');

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate assessed data
  const assessedData = trackSections
    .filter((t) => selectedSectionId === 'ALL' || t.id === selectedSectionId)
    .map((t) => {
      const weather = weatherMap[t.id];
      const risk = calculateTrackRisk(t, inspections, weather);
      return {
        ...t,
        weather,
        risk,
      };
    });

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'Section ID',
      'Track Route Name',
      'Start Location',
      'End Location',
      'Length (km)',
      'Last Inspected',
      'Current Condition',
      'Risk Score (/100)',
      'Risk Level',
      'AI Recommended Action',
      'Urgency',
    ];

    const rows = assessedData.map((item) => [
      `"${item.id}"`,
      `"${item.name}"`,
      `"${item.startLocation}"`,
      `"${item.endLocation}"`,
      item.lengthKm,
      `"${item.lastInspection}"`,
      `"${item.currentCondition}"`,
      item.risk.score,
      `"${item.risk.riskLevel}"`,
      `"${item.risk.recommendation.action}"`,
      `"${item.risk.recommendation.urgency}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RailGuard_Safety_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded">
              MODULE 8 • STATUTORY COMPLIANCE & AUDITS
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Export & Print Verified Reports</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
            <span>Safety Audit & Inspection Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate executive compliance documents, download CSV analytics, and export standardized PDF reports
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Scope Filter */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400">Filter Scope:</span>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#0b1120] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Entire Railway Network (All {trackSections.length} Sections)</option>
            {trackSections.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.id})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Generated on: <strong className="text-white">{reportDate}</strong>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-10 space-y-8 text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
                RailGuard Infrastructure Safety Directorate
              </span>
              <h2 className="text-xl font-black text-white mt-0.5 print:text-black">
                Comprehensive Track Safety & Risk Audit
              </h2>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Statutory Track Quality Index & Ultrasonic Flaw Assessment Protocol
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 print:text-gray-600">
            <div>Report Ref: <span className="font-mono text-white font-bold print:text-black">RGD-AUDIT-2026-Q3</span></div>
            <div>Inspector: <strong className="text-slate-200 print:text-black">Er. R. K. Inspector (SSE / P-Way)</strong></div>
            <div>Date: <strong className="text-slate-200 print:text-black">{reportDate}</strong></div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 print:text-gray-700">
            1. Executive Infrastructure Health Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0b1120] border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monitored Corridors</span>
              <span className="text-xl font-bold text-white print:text-black mt-1 block">{assessedData.length}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0b1120] border border-emerald-500/20 print:bg-gray-100 print:border-gray-300">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Healthy Trackage</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">
                {assessedData.filter((d) => d.risk.riskLevel === 'Healthy').length}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0b1120] border border-amber-500/20 print:bg-gray-100 print:border-gray-300">
              <span className="text-[10px] text-amber-400 uppercase font-semibold block">Under Observation</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                {assessedData.filter((d) => d.risk.riskLevel === 'Moderate').length}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0b1120] border border-rose-500/20 print:bg-gray-100 print:border-gray-300">
              <span className="text-[10px] text-rose-400 uppercase font-semibold block">High / Critical Risk</span>
              <span className="text-xl font-bold text-rose-400 mt-1 block">
                {assessedData.filter((d) => d.risk.riskLevel === 'High Risk' || d.risk.riskLevel === 'Critical').length}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Corridor Audit Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 print:text-gray-700">
            2. Corridor Risk Evaluation & AI Recommendations
          </h3>
          <div className="overflow-x-auto border border-slate-800 rounded-xl print:border-gray-300">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0b1120] border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 print:bg-gray-200 print:text-black">
                  <th className="py-2.5 px-3">Corridor ID & Name</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3">Length</th>
                  <th className="py-2.5 px-3">Last Inspected</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Prescriptive Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                {assessedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20 print:text-black">
                    <td className="py-2.5 px-3 font-semibold text-white print:text-black">
                      {item.name}
                      <span className="block font-mono text-[10px] text-slate-400 print:text-gray-500">{item.id}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 print:text-black">
                      {item.startLocation} → {item.endLocation}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{item.trackLength || `${item.lengthKm} km`}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{item.lastInspection}</td>
                    <td className="py-2.5 px-3 font-bold font-mono">
                      <span className={item.risk.score > 60 ? 'text-rose-400 font-black' : item.risk.score > 35 ? 'text-amber-400' : 'text-emerald-400'}>
                        {item.risk.score}/100
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={item.risk.riskLevel} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-white print:text-black">{item.risk.recommendation.action}</span>
                      <span className="block text-[10px] text-slate-400 print:text-gray-500">
                        {item.risk.recommendation.urgency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appendices: Critical Action Required Items */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 print:text-gray-700">
            3. Critical Attention Appendices
          </h3>
          <div className="p-4 rounded-xl bg-[#0b1120] border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-2 text-xs">
            <p className="leading-relaxed text-slate-300 print:text-black">
              • <strong>Guwahati–Lumding Hill Section (TRK-GHY-LMG-08):</strong> Ground displacement near bridge 42. Caution order 30 km/h is enforced. Emergency tamping gang deployed.
            </p>
            <p className="leading-relaxed text-slate-300 print:text-black">
              • <strong>Lucknow–Kanpur Section (TRK-LKO-CNB-04):</strong> Sub-grade erosion with 4mm gauge divergence. Speed restriction of 45 km/h recommended until re-packing.
            </p>
          </div>
        </div>

        {/* Sign-off Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-400 print:text-gray-600">
          <div>
            <p>Verification Signature: _______________________</p>
            <p className="mt-1">Chief Safety Commissioner (Permanent Way Directorate)</p>
          </div>
          <div className="text-right">
            <p>Digital Checksum: <span className="font-mono text-slate-300 print:text-black">SHA256:7e8a9f...b01c</span></p>
            <p>RailGuard Enterprise Infrastructure Safety System</p>
          </div>
        </div>
      </div>
    </div>
  );
}
