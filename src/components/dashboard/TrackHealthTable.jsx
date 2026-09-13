import React, { useState } from 'react';
import {
  TrainTrack,
  Filter,
  Search,
  ChevronRight,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { TRACK_SECTIONS } from '../../data/mockData';

export default function TrackHealthTable({ onSelectTrack, sections = TRACK_SECTIONS }) {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter track sections based on status filter & search query
  const filteredTracks = sections.filter((track) => {
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'HEALTHY' && (track.riskStatus === 'Healthy' || track.status === 'Healthy')) ||
      (filter === 'OBSERVATION' && (track.riskStatus === 'Under Observation' || track.status === 'Under Observation')) ||
      (filter === 'HIGH_RISK' && (track.riskStatus === 'High Risk' || track.status === 'High Risk'));

    const matchesSearch =
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.code.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
      {/* Header with Title and Demo Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Track Health Overview
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time health indices, ballast stability, and structural safety parameters
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#090e1a] p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {['ALL', 'HEALTHY', 'OBSERVATION', 'HIGH_RISK'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'ALL'
                ? 'All Tracks'
                : f === 'HEALTHY'
                ? 'Healthy'
                : f === 'OBSERVATION'
                ? 'Observation'
                : 'High Risk'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="my-3 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search section name or corridor..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0b1120] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg text-slate-200 placeholder-slate-500"
          />
        </div>
        <div className="text-xs text-slate-400 hidden sm:block">
          Showing <span className="font-semibold text-white">{filteredTracks.length}</span> of{' '}
          <span className="font-semibold text-white">{sections.length}</span> demo corridors
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-[#0c1220]">
              <th className="py-3 px-3">Track / Section Name</th>
              <th className="py-3 px-3">Location & Zone</th>
              <th className="py-3 px-3">Last Inspection</th>
              <th className="py-3 px-3 text-center">Current Status</th>
              <th className="py-3 px-3 text-center">Risk Level</th>
              <th className="py-3 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredTracks.map((track) => (
              <tr
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
              >
                {/* Track Name */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-800/70 text-slate-300 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                      <TrainTrack className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {track.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {track.code} • {track.lengthKm} KM
                      </div>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate max-w-[220px]">{track.location}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pl-5">
                    {track.zone}
                  </div>
                </td>

                {/* Last Inspection Date */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{track.lastInspection}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pl-5">
                    Ultrasonic Verified
                  </div>
                </td>

                {/* Current Status */}
                <td className="py-3.5 px-3 text-center">
                  <StatusBadge status={track.status} size="sm" />
                </td>

                {/* Risk Level */}
                <td className="py-3.5 px-3 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold ${
                        track.riskScore > 60
                          ? 'text-rose-400'
                          : track.riskScore > 30
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {track.riskLevel}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({track.riskScore}/100)
                    </span>
                  </div>
                </td>

                {/* Action button */}
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTrack(track);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors inline-flex items-center"
                    title="View Section Specs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTracks.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-xs">
          No track sections matching your filter criteria.
        </div>
      )}
    </div>
  );
}
