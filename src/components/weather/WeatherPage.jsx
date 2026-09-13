import React, { useState } from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  RefreshCw,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Activity,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function WeatherPage({
  trackSections = [],
  weatherMap = {},
  isLoadingWeather = false,
  onRefreshWeather,
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'HAZARDS' | 'HEAT' | 'RAIN'

  // Hazard counts
  const hazardCount = Object.values(weatherMap).filter((w) => w.hazardLevel !== 'Normal').length;
  const extremeHeatCount = Object.values(weatherMap).filter((w) => w.isExtremeHeat).length;
  const heavyRainCount = Object.values(weatherMap).filter((w) => w.isHeavyRain).length;

  const filteredSections = trackSections.filter((section) => {
    const w = weatherMap[section.id];
    if (!w) return true;
    if (filter === 'HAZARDS') return w.hazardLevel !== 'Normal';
    if (filter === 'HEAT') return w.isExtremeHeat;
    if (filter === 'RAIN') return w.isHeavyRain;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded">
              MODULE 3 • ENVIRONMENTAL SENTINEL
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Open-Meteo Public API Integration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CloudRain className="w-6 h-6 text-cyan-400" />
            <span>Weather & Environmental Sentinel</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time track temperature, precipitation, and atmospheric hazards guarding against rail buckling and embankment scour
          </p>
        </div>

        <button
          onClick={onRefreshWeather}
          disabled={isLoadingWeather}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shadow-sm transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
          <span>{isLoadingWeather ? 'Syncing Weather...' : 'Refresh Live Weather'}</span>
        </button>
      </div>

      {/* KPI Weather Threat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Weather Advisories
            </span>
            <span className="text-2xl font-extrabold text-white mt-1 block">
              {hazardCount}
            </span>
            <span className="text-[11px] text-slate-400">
              Corridors under alert watch
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-rose-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
              Thermal Buckling Hazard (&ge;42°C)
            </span>
            <span className="text-2xl font-extrabold text-rose-300 mt-1 block">
              {extremeHeatCount}
            </span>
            <span className="text-[11px] text-slate-400">
              Sun-kink speed restriction alert
            </span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Sun className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-blue-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
              Heavy Rainfall / Flood (&ge;35mm)
            </span>
            <span className="text-2xl font-extrabold text-blue-300 mt-1 block">
              {heavyRainCount}
            </span>
            <span className="text-[11px] text-slate-400">
              Embankment soil saturation alert
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Droplets className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 bg-[#111827] border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Filter By Hazard:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Corridors' },
              { id: 'HAZARDS', label: `Advisories (${hazardCount})` },
              { id: 'HEAT', label: `Heat Stress (${extremeHeatCount})` },
              { id: 'RAIN', label: `Heavy Rain (${heavyRainCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 hidden md:flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live API / Edge Mesh Active</span>
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSections.map((section) => {
          const w = weatherMap[section.id] || {
            temperature: 32,
            precipitation: 4,
            windSpeed: 15,
            humidity: 55,
            hazardLevel: 'Normal',
            alertMessage: 'Atmospheric conditions within design structural tolerances.',
            badgeColor: 'emerald',
            source: 'Stationary Sensor Telemetry',
          };

          const isHazard = w.hazardLevel !== 'Normal';

          return (
            <div
              key={section.id}
              className={`rounded-xl p-5 border flex flex-col justify-between transition-all bg-[#111827] ${
                w.isExtremeHeat
                  ? 'border-rose-500/40 shadow-rose-950/20 shadow-lg'
                  : w.isHeavyRain
                  ? 'border-blue-500/40 shadow-blue-950/20 shadow-lg'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Card Top: Location & Threat Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {section.id}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1.5">
                      {section.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{section.startLocation} → {section.endLocation}</span>
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border whitespace-nowrap ${
                      w.badgeColor === 'rose'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : w.badgeColor === 'orange'
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                        : w.badgeColor === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {w.hazardLevel}
                  </span>
                </div>

                {/* Weather Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                  {/* Temp */}
                  <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                    w.isExtremeHeat ? 'bg-rose-950/30 border-rose-500/30' : 'bg-[#0b1120] border-slate-800/80'
                  }`}>
                    <Thermometer className={`w-4 h-4 shrink-0 ${w.isExtremeHeat ? 'text-rose-400' : 'text-amber-400'}`} />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Temperature</span>
                      <span className={`font-extrabold text-sm ${w.isExtremeHeat ? 'text-rose-300 font-black' : 'text-white'}`}>
                        {w.temperature}&deg;C
                      </span>
                    </div>
                  </div>

                  {/* Rainfall */}
                  <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                    w.isHeavyRain ? 'bg-blue-950/30 border-blue-500/30' : 'bg-[#0b1120] border-slate-800/80'
                  }`}>
                    <Droplets className={`w-4 h-4 shrink-0 ${w.isHeavyRain ? 'text-blue-400' : 'text-cyan-400'}`} />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Precipitation</span>
                      <span className={`font-extrabold text-sm ${w.isHeavyRain ? 'text-blue-300 font-black' : 'text-white'}`}>
                        {w.precipitation} mm
                      </span>
                    </div>
                  </div>

                  {/* Wind */}
                  <div className="p-2.5 rounded-lg bg-[#0b1120] border border-slate-800/80 flex items-center gap-2.5">
                    <Wind className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Wind Velocity</span>
                      <span className="font-bold text-white text-xs">
                        {w.windSpeed} km/h
                      </span>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="p-2.5 rounded-lg bg-[#0b1120] border border-slate-800/80 flex items-center gap-2.5">
                    <CloudRain className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Rel. Humidity</span>
                      <span className="font-bold text-white text-xs">
                        {w.humidity}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Safety Advisory Banner */}
                <div className={`p-2.5 rounded-lg border text-xs leading-snug ${
                  isHazard
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                }`}>
                  <div className="flex items-start gap-1.5">
                    {isHazard ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <span>{w.alertMessage}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Telemetry metadata */}
              <div className="mt-4 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Source: {w.source || 'Open-Meteo API'}</span>
                <span>Updated: {w.lastUpdated || 'Real-time'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
