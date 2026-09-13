import React from 'react';
import {
  TrainTrack,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Activity,
  Layers,
} from 'lucide-react';

const iconMap = {
  TrainTrack: TrainTrack,
  ShieldCheck: ShieldCheck,
  Eye: Eye,
  AlertTriangle: AlertTriangle,
  Activity: Activity,
};

export default function StatCard({
  label,
  value,
  unit,
  change,
  status,
  icon,
  description,
  accentColor = 'blue',
}) {
  const IconComponent = iconMap[icon] || Layers;

  // Visual color accents
  const accents = {
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 text-blue-400',
      bar: 'bg-blue-500',
      badge: 'text-blue-400 bg-blue-500/10',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      bar: 'bg-emerald-500',
      badge: 'text-emerald-400 bg-emerald-500/10',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400',
      bar: 'bg-amber-500',
      badge: 'text-amber-400 bg-amber-500/10',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400',
      bar: 'bg-rose-500',
      badge: 'text-rose-400 bg-rose-500/10',
    },
  }[accentColor] || {
    border: 'border-slate-800 hover:border-slate-700',
    iconBg: 'bg-slate-800 text-slate-300',
    bar: 'bg-slate-500',
    badge: 'text-slate-400 bg-slate-800',
  };

  return (
    <div
      className={`relative bg-[#111827] border rounded-xl p-5 shadow-lg shadow-black/20 transition-all duration-200 ${accents.border}`}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${accents.bar}`} />

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-medium text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${accents.iconBg}`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 truncate max-w-[180px]">
          {description}
        </span>
        <span className={`px-2 py-0.5 rounded-full font-medium ${accents.badge} shrink-0`}>
          {change}
        </span>
      </div>
    </div>
  );
}
