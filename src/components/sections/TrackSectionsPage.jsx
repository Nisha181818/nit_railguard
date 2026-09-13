import React, { useState, useMemo } from 'react';
import {
  TrainTrack,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import TrackSectionModal from './TrackSectionModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function TrackSectionsPage({
  sections,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onOpenTrackHistory,
}) {
  // State for search, filter, sort, and layout mode
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NAME_ASC');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSection, setDeletingSection] = useState(null);

  // Stats calculation
  const stats = useMemo(() => {
    const total = sections.length;
    const healthy = sections.filter(
      (s) => s.riskStatus === 'Healthy' || s.status === 'Healthy'
    ).length;
    const observation = sections.filter(
      (s) =>
        s.riskStatus === 'Under Observation' || s.status === 'Under Observation'
    ).length;
    const highRisk = sections.filter(
      (s) => s.riskStatus === 'High Risk' || s.status === 'High Risk'
    ).length;
    const critical = sections.filter(
      (s) => s.riskStatus === 'Critical' || s.status === 'Critical'
    ).length;

    return { total, healthy, observation, highRisk, critical };
  }, [sections]);

  // Filtered & Sorted sections
  const processedSections = useMemo(() => {
    return sections
      .filter((section) => {
        // Status filtering
        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'HEALTHY' &&
            (section.riskStatus === 'Healthy' || section.status === 'Healthy')) ||
          (statusFilter === 'OBSERVATION' &&
            (section.riskStatus === 'Under Observation' ||
              section.status === 'Under Observation')) ||
          (statusFilter === 'HIGH_RISK' &&
            (section.riskStatus === 'High Risk' || section.status === 'High Risk')) ||
          (statusFilter === 'CRITICAL' &&
            (section.riskStatus === 'Critical' || section.status === 'Critical'));

        // Text search
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          section.name?.toLowerCase().includes(query) ||
          section.id?.toLowerCase().includes(query) ||
          section.startLocation?.toLowerCase().includes(query) ||
          section.endLocation?.toLowerCase().includes(query) ||
          section.currentCondition?.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
        if (sortBy === 'NAME_DESC') return b.name.localeCompare(a.name);
        if (sortBy === 'LENGTH_DESC') return (b.lengthKm || 0) - (a.lengthKm || 0);
        if (sortBy === 'LENGTH_ASC') return (a.lengthKm || 0) - (b.lengthKm || 0);
        if (sortBy === 'DATE_DESC')
          return new Date(b.lastInspection || 0) - new Date(a.lastInspection || 0);
        if (sortBy === 'DATE_ASC')
          return new Date(a.lastInspection || 0) - new Date(b.lastInspection || 0);
        if (sortBy === 'RISK_DESC') return (b.riskScore || 0) - (a.riskScore || 0);
        return 0;
      });
  }, [sections, statusFilter, searchQuery, sortBy]);

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingSection(null);
    setIsFormModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (section) => {
    setEditingSection(section);
    setIsFormModalOpen(true);
  };

  // Open Delete confirmation
  const handleOpenDelete = (section) => {
    setDeletingSection(section);
    setIsDeleteModalOpen(true);
  };

  // Save handler for Add / Edit
  const handleSaveSection = (savedSection) => {
    if (editingSection) {
      onUpdateSection(savedSection);
    } else {
      onAddSection(savedSection);
    }
    setIsFormModalOpen(false);
    setEditingSection(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded">
              FEATURE 2 • INFRASTRUCTURE REGISTRY
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Local State Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <TrainTrack className="w-6 h-6 text-blue-400" />
            <span>Track Section Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor, register, and update geometric parameters and safety ratings across railway corridors
          </p>
        </div>

        {/* Primary Add Button & View Toggle */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-[#111827] border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-all hover:translate-y-[-1px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Track Section</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Sections
          </span>
          <span className="text-xl font-extrabold text-white mt-1 block">
            {stats.total}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-emerald-500/20">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Healthy</span>
          </div>
          <span className="text-xl font-extrabold text-emerald-300 mt-1 block">
            {stats.healthy}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-amber-500/20">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Observation</span>
          </div>
          <span className="text-xl font-extrabold text-amber-300 mt-1 block">
            {stats.observation}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-orange-500/20">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span>High Risk</span>
          </div>
          <span className="text-xl font-extrabold text-orange-300 mt-1 block">
            {stats.highRisk}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111827] border border-rose-500/20 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            <span>Critical</span>
          </div>
          <span className="text-xl font-extrabold text-rose-300 mt-1 block">
            {stats.critical}
          </span>
        </div>
      </div>

      {/* Controls Bar: Search, Status Filter, Sort By */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, route name, start or end station..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0b1120] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Filters and Sorting Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter Pills */}
          <div className="flex items-center bg-[#0b1120] border border-slate-800 rounded-lg p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {[
              { id: 'ALL', label: 'All' },
              { id: 'HEALTHY', label: 'Healthy' },
              { id: 'OBSERVATION', label: 'Observation' },
              { id: 'HIGH_RISK', label: 'High Risk' },
              { id: 'CRITICAL', label: 'Critical' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === tab.id
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
              <option value="NAME_ASC" className="bg-[#111827]">Sort: Name (A-Z)</option>
              <option value="NAME_DESC" className="bg-[#111827]">Sort: Name (Z-A)</option>
              <option value="LENGTH_DESC" className="bg-[#111827]">Sort: Length (Longest)</option>
              <option value="LENGTH_ASC" className="bg-[#111827]">Sort: Length (Shortest)</option>
              <option value="DATE_DESC" className="bg-[#111827]">Sort: Inspected (Newest)</option>
              <option value="DATE_ASC" className="bg-[#111827]">Sort: Inspected (Oldest)</option>
              <option value="RISK_DESC" className="bg-[#111827]">Sort: Risk (Highest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area: Table vs Cards */}
      {processedSections.length === 0 ? (
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <TrainTrack className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            No Track Sections Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            No track sections matched your search query or filter selection.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-[#0d1424]">
                  <th className="py-3.5 px-4">Section ID</th>
                  <th className="py-3.5 px-4">Track / Route Name</th>
                  <th className="py-3.5 px-4">Corridor (Start → End)</th>
                  <th className="py-3.5 px-4">Length</th>
                  <th className="py-3.5 px-4">Last Inspected</th>
                  <th className="py-3.5 px-4">Current Condition</th>
                  <th className="py-3.5 px-4 text-center">Risk Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {processedSections.map((section) => (
                  <tr
                    key={section.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Section ID */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-400 whitespace-nowrap">
                      {section.id}
                    </td>

                    {/* Route Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {section.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {section.zone || 'Indian Railway Sector'}
                      </div>
                    </td>

                    {/* Start -> End Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <span className="truncate max-w-[140px]" title={section.startLocation}>
                          {section.startLocation}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[140px]" title={section.endLocation}>
                          {section.endLocation}
                        </span>
                      </div>
                    </td>

                    {/* Track Length */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-300">
                      {section.trackLength || `${section.lengthKm} km`}
                    </td>

                    {/* Last Inspection Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{section.lastInspection}</span>
                      </div>
                    </td>

                    {/* Current Condition */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="truncate block max-w-[200px]" title={section.currentCondition}>
                        {section.currentCondition}
                      </span>
                    </td>

                    {/* Risk Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <StatusBadge status={section.riskStatus || section.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onOpenTrackHistory && onOpenTrackHistory(section)}
                          className="p-1.5 rounded-lg bg-slate-800 text-purple-300 hover:text-white hover:bg-purple-600 transition-colors"
                          title="View Health & Inspection History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(section)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
                          title="Edit Section Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(section)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
                          title="Delete Section"
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
          <div className="p-3 bg-[#0d1424] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              Showing <strong>{processedSections.length}</strong> of <strong>{sections.length}</strong> registered track sections
            </span>
            <span>Local State Registry • Real-time update</span>
          </div>
        </div>
      ) : (
        /* CARDS / GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedSections.map((section) => (
            <div
              key={section.id}
              className="bg-[#111827] border border-slate-800 hover:border-blue-500/40 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Card Top: ID and Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded">
                    {section.id}
                  </span>
                  <StatusBadge status={section.riskStatus || section.status} size="sm" />
                </div>

                {/* Name */}
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                  {section.name}
                </h3>

                {/* Corridor Route Visualizer */}
                <div className="p-3 rounded-lg bg-[#0b1120] border border-slate-800/80 mb-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <span className="truncate">{section.startLocation}</span>
                  </div>
                  <div className="h-3 border-l-2 border-dashed border-slate-700 ml-1" />
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="truncate">{section.endLocation}</span>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                      Track Length
                    </span>
                    <span className="font-semibold text-slate-200 mt-0.5 block">
                      {section.trackLength || `${section.lengthKm} km`}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                      Last Inspected
                    </span>
                    <span className="font-semibold text-slate-200 mt-0.5 block">
                      {section.lastInspection}
                    </span>
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-4">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                    Current Condition
                  </span>
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/60 line-clamp-2">
                    {section.currentCondition}
                  </p>
                </div>
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  Score: {section.riskScore || 20}/100
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenTrackHistory && onOpenTrackHistory(section)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-600 border border-purple-800/40 rounded transition-colors"
                    title="View Inspection History"
                  >
                    <History className="w-3 h-3" />
                    <span>History</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(section)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleOpenDelete(section)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-600 border border-rose-800/40 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <TrackSectionModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingSection(null);
        }}
        onSave={handleSaveSection}
        initialData={editingSection}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingSection(null);
        }}
        onConfirm={onDeleteSection}
        section={deletingSection}
      />
    </div>
  );
}
