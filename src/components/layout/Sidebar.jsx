import React from 'react';
import {
  LayoutDashboard,
  TrainTrack,
  ClipboardCheck,
  Cpu,
  CloudRain,
  BellRing,
  FileSpreadsheet,
  Sliders,
  Shield,
  X,
  ExternalLink,
} from 'lucide-react';
import { SIDEBAR_ITEMS } from '../../data/mockData';

const iconMap = {
  LayoutDashboard: LayoutDashboard,
  TrainTrack: TrainTrack,
  ClipboardCheck: ClipboardCheck,
  Cpu: Cpu,
  CloudRain: CloudRain,
  BellRing: BellRing,
  FileSpreadsheet: FileSpreadsheet,
  Sliders: Sliders,
};

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobileNavOpen,
  setIsMobileNavOpen,
  onOpenLanding,
  trackSectionsCount,
  inspectionsCount,
  activeAlertsCount,
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0d1424] border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header in sidebar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-base">
                RailGuard
              </span>
              <span className="block text-[10px] text-blue-400 font-medium">
                Infrastructure Sentinel
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Operations Menu
          </div>

          {SIDEBAR_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded font-semibold ${
                      isActive
                        ? 'bg-blue-800/80 text-blue-100'
                        : item.badge === 'AI Ready'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : item.id === 'alerts'
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.id === 'track_sections' && trackSectionsCount !== undefined
                      ? trackSectionsCount
                      : item.id === 'inspections' && inspectionsCount !== undefined
                      ? inspectionsCount
                      : item.id === 'alerts' && activeAlertsCount !== undefined
                      ? activeAlertsCount
                      : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom System Status Box */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090e1a]/60">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-200">
                Telemetry Grid
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
              Foundation shell active. AI models & IoT streams offline (Demo Mode).
            </p>
            <button
              onClick={onOpenLanding}
              className="w-full flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              <span>Back to Overview</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
