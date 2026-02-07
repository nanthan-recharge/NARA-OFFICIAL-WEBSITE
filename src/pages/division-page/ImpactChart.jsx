/**
 * Lazy-loaded Recharts wrapper.
 * Import this component via React.lazy() to defer the Recharts bundle.
 */
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

const ImpactChart = ({ data, dataKey = 'count', color = '#3b82f6', height = 300 }) => {
  if (!data || data.length === 0) return null;

  const gradientId = `chart-gradient-${dataKey}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            color: '#334155',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ImpactChart;
