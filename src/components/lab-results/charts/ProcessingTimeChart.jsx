import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

/**
 * Processing Time Analytics Chart - Bar chart showing average processing times
 */
const ProcessingTimeChart = ({ data }) => {
  const { t } = useTranslation('labResults');

  // Color based on processing time (green = fast, amber = medium, red = slow)
  const getBarColor = (value) => {
    if (value <= 3) return '#10b981'; // Green - Fast (≤3 days)
    if (value <= 7) return '#f59e0b'; // Amber - Medium (4-7 days)
    return '#ef4444'; // Red - Slow (>7 days)
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const status = value <= 3 ? 'Fast' : value <= 7 ? 'Medium' : 'Slow';
      const statusColor = getBarColor(value);

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-gray-600">
            Average Time: <strong>{value} days</strong>
          </p>
          <p className="text-sm" style={{ color: statusColor }}>
            Status: <strong>{status}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Time Analytics</h3>
        <p className="text-sm text-gray-600">Average days to complete each test type</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="testType" 
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            payload={[
              { value: 'Fast (≤3 days)', type: 'square', color: '#10b981' },
              { value: 'Medium (4-7 days)', type: 'square', color: '#f59e0b' },
              { value: 'Slow (>7 days)', type: 'square', color: '#ef4444' }
            ]}
          />
          <Bar dataKey="avgDays" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.avgDays)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Performance Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700 font-semibold mb-1">FAST</p>
            <p className="text-2xl font-bold text-green-600">
              {data.filter(d => d.avgDays <= 3).length}
            </p>
            <p className="text-xs text-green-600">test types</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-700 font-semibold mb-1">MEDIUM</p>
            <p className="text-2xl font-bold text-amber-600">
              {data.filter(d => d.avgDays > 3 && d.avgDays <= 7).length}
            </p>
            <p className="text-xs text-amber-600">test types</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-red-700 font-semibold mb-1">SLOW</p>
            <p className="text-2xl font-bold text-red-600">
              {data.filter(d => d.avgDays > 7).length}
            </p>
            <p className="text-xs text-red-600">test types</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingTimeChart;
