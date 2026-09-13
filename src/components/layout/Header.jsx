import React from 'react';
import {
  Shield,
  Menu,
  X,
  Bell,
  User,
  Calendar,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { BRAND_INFO } from '../../data/mockData';

export default function Header({
  isMobileNavOpen,
  setIsMobileNavOpen,
  onOpenLanding,
  onOpenQuickModal,
}) {
  // Format current date nicely
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-[#0d1424]/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Title */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-wide">
                  {BRAND_INFO.name}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded">
                  <Activity className="w-2.5 h-2.5" />
                  DEMO MODE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {BRAND_INFO.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Date, Landing Page Switch, Alert Notification, User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Date widget */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDateFormatted}</span>
          </div>

          {/* Landing Page link */}
          <button
            onClick={onOpenLanding}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 rounded-lg transition-colors"
          >
            <span>Landing Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          {/* Quick Notification Bell */}
          <button
            onClick={() =>
              onOpenQuickModal(
                'Safety Dispatch Alerts',
                'Notification Center (Simulated)',
                '10 active track monitoring alerts are currently prioritized in the system. Full notification dispatching and automated SMS/email alerts will be configured in Module 6.'
              )
            }
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="System Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-[#0d1424]" />
          </button>

          {/* User Placeholder */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">
                Er. R. K. Inspector
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                P-Way Safety Officer
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
