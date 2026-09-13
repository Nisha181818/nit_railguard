import React from 'react';
import QuickActionCard from '../common/QuickActionCard';
import { QUICK_ACTIONS } from '../../data/mockData';

export default function QuickActionsGrid({ onExecuteAction }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Fast Operational Actions
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">
          Modular Extension Points
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={action.icon}
            badge={action.badge}
            onClick={() => onExecuteAction(action)}
          />
        ))}
      </div>
    </div>
  );
}
