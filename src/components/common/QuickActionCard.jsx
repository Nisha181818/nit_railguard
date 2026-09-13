import React from 'react';
import {
  ClipboardPlus,
  TrainTrack,
  BrainCircuit,
  FileDown,
  ArrowRight,
} from 'lucide-react';

const iconMap = {
  ClipboardPlus: ClipboardPlus,
  TrainTrack: TrainTrack,
  BrainCircuit: BrainCircuit,
  FileDown: FileDown,
};

export default function QuickActionCard({
  title,
  description,
  icon,
  badge,
  onClick,
}) {
  const IconComponent = iconMap[icon] || TrainTrack;

  return (
    <button
      onClick={onClick}
      className="group text-left w-full p-4 bg-[#111827] hover:bg-[#162032] border border-slate-800 hover:border-blue-500/50 rounded-xl transition-all duration-200 shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <IconComponent className="w-5 h-5" />
          </div>
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/80 rounded border border-slate-700/60">
              {badge}
            </span>
          )}
        </div>
        <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center text-xs font-medium text-slate-400 group-hover:text-blue-400 transition-colors">
        <span>Execute action</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}
