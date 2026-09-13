import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  UserCheck,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  TrainTrack,
  Info,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import InspectionModal from './InspectionModal';

export default function InspectionsPage({
  inspections,
  trackSections,
  onAddInspection,
  onUpdateInspection,
  onDeleteInspection,
  onViewInspectionDetails,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DATE_DESC');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState(null);

  // Stats
  const stats = useMemo(() => {
    const total = inspections.length;
    const safe = inspections.filter((i) => i.riskLevel === 'Healthy').length;
    const moderate = inspections.filter((i) => i.riskLevel === 'Moderate').length;
    const highRisk = inspections.filter(
      (i) => i.riskLevel === 'High Risk' || i.riskLevel === 'Critical'
    ).length;
    return { total, safe, moderate, highRisk };
  }, [inspections]);

  // Filter and sort
  const filteredInspections = useMemo(() => {
    return inspections
      .filter((item) => {
        const matchesRisk =
          riskFilter === 'ALL' ||
          (riskFilter === 'HEALTHY' && item.riskLevel === 'Healthy') ||
          (riskFilter === 'MODERATE' && item.riskLevel === 'Moderate') ||
          (riskFilter === 'HIGH' && item.riskLevel === 'High Risk') ||
          (riskFilter === 'CRITICAL' && item.riskLevel === 'Critical');

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.trackSection?.toLowerCase().includes(q) ||
          item.inspector?.toLowerCase().includes(q) ||
          item.condition?.toLowerCase().includes(q) ||
          item.defects?.toLowerCase().includes(q) ||
          item.method?.toLowerCase().includes(q);

        return matchesRisk && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'DATE_DESC') return new Date(b.inspectionDate) - new Date(a.inspectionDate);
        if (sortBy === 'DATE_ASC') return new Date(a.inspectionDate) - new Date(b.inspectionDate);
        if (sortBy === 'SECTION_ASC') return a.trackSection.localeCompare(b.trackSection);
        return 0;
      });
  }, [inspections, riskFilter, searchQuery, sortBy]);

  const handleOpenAdd = () => {
    setEditingInspection(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inspection) => {
    setEditingInspection(inspection);
    setIsModalOpen(true);
  };

  const handleSave = (savedRecord) => {
    if (editingInspection) {
      onUpdateInspection(savedRecord);
    } else {
      onAddInspection(savedRecord);
    }
    setIsModalOpen(false);
    setEditingInspection(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded">
              MODULE 1 • INSPECTION MANAGEMENT
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">USFD & Physical Walk Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-emerald-400" />
            <span>Track Inspection Records</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Record, audit, and investigate ultrasonic flaw detection, geometric tolerances, and fastener integrity
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto hover:translate-y-[-1px]"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Inspection</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Audits
          </span>
          <span className="text-xl font-extrabold text-white mt-1 block">
            {stats.total}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-emerald-500/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Verified Safe
          </span>
          <span className="text-xl font-extrabold text-emerald-300 mt-1 block">
            {stats.safe}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-amber-500/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Under Observation
          </span>
          <span className="text-xl font-extrabold text-amber-300 mt-1 block">
            {stats.moderate}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-rose-500/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
            Action Required
          </span>
          <span className="text-xl font-extrabold text-rose-300 mt-1 block">
            {stats.highRisk}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inspector, corridor, defect or method..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0b1120] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg text-slate-200 placeholder-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Risk Filters */}
          <div className="flex items-center bg-[#0b1120] border border-slate-800 rounded-lg p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {[
              { id: 'ALL', label: 'All' },
              { id: 'HEALTHY', label: 'Safe' },
              { id: 'MODERATE', label: 'Moderate' },
              { id: 'HIGH', label: 'High Risk' },
              { id: 'CRITICAL', label: 'Critical' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRiskFilter(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  riskFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0b1120] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="DATE_DESC" className="bg-[#111827]">Date: Newest First</option>
              <option value="DATE_ASC" className="bg-[#111827]">Date: Oldest First</option>
              <option value="SECTION_ASC" className="bg-[#111827]">Track Section (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-[#0d1424]">
                <th className="py-3.5 px-4">Track Section</th>
                <th className="py-3.5 px-4">Inspection Date</th>
                <th className="py-3.5 px-4">Inspector</th>
                <th className="py-3.5 px-4">Condition & Defects</th>
                <th className="py-3.5 px-4 text-center">Risk Level</th>
                <th className="py-3.5 px-4 text-center">Action Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredInspections.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onViewInspectionDetails && onViewInspectionDetails(item)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* Track Section */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {item.trackSection}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.trackCode || item.id}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.inspectionDate}</span>
                    </div>
                  </td>

                  {/* Inspector */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{item.inspector}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                      {item.method}
                    </div>
                  </td>

                  {/* Condition & Defects */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-medium truncate max-w-[220px]" title={item.condition}>
                      {item.condition}
                    </div>
                    {item.defects && (
                      <div className="text-[10px] text-slate-400 truncate max-w-[220px]" title={item.defects}>
                        Defects: {item.defects}
                      </div>
                    )}
                  </td>

                  {/* Risk Level */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <StatusBadge status={item.riskLevel} size="sm" />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        item.status?.includes('Immediate') || item.status?.includes('Required')
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : item.status?.includes('Scheduled') || item.status?.includes('Queued')
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewInspectionDetails && onViewInspectionDetails(item);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="View Full Findings"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(item);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete inspection record ${item.id}?`)) {
                            onDeleteInspection(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInspections.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No inspection records match the current filter.
          </div>
        )}
      </div>

      {/* Add / Edit Inspection Modal */}
      <InspectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInspection(null);
        }}
        onSave={handleSave}
        trackSections={trackSections}
        initialData={editingInspection}
      />
    </div>
  );
}
