import React from 'react';
import StatCard from '../common/StatCard';
import { SUMMARY_STATS } from '../../data/mockData';

export default function StatCardsGrid({ stats = null }) {
  const cardsToRender = stats || SUMMARY_STATS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardsToRender.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          change={stat.change}
          status={stat.status}
          icon={stat.icon}
          description={stat.description}
          accentColor={stat.accentColor}
        />
      ))}
    </div>
  );
}
