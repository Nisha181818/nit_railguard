import React from 'react';

/**
 * Reusable StatusBadge component
 * Maps various railway track & inspection statuses to standard visual indicators.
 */
export default function StatusBadge({ status, size = 'md' }) {
  const getStyle = (val) => {
    const s = String(val || '').toLowerCase();
    if (s.includes('healthy') || s.includes('safe') || s.includes('low') || s.includes('normal')) {
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/25',
        dot: 'bg-emerald-400',
        pulse: false,
      };
    }
    if (s.includes('observation') || s.includes('moderate') || s.includes('scheduled') || s.includes('queued') || s.includes('fair')) {
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/25',
        dot: 'bg-amber-400',
        pulse: false,
      };
    }
    if (s.includes('critical')) {
      return {
        bg: 'bg-rose-600/20',
        text: 'text-rose-300',
        border: 'border-rose-500/40',
        dot: 'bg-rose-500',
        pulse: true,
      };
    }
    if (s.includes('high') || s.includes('action') || s.includes('degraded') || s.includes('fatigue')) {
      return {
        bg: 'bg-orange-500/15',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        dot: 'bg-orange-400',
        pulse: false,
      };
    }
    return {
      bg: 'bg-slate-700/30',
      text: 'text-slate-300',
      border: 'border-slate-600/30',
      dot: 'bg-slate-400',
      pulse: false,
    };
  };

  const style = getStyle(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.dot} ${style.pulse ? 'animate-ping' : ''}`}
      />
      <span>{status}</span>
    </span>
  );
}
