import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';

/**
 * Status Overview Chart - Visual breakdown of sample statuses
 */
const StatusOverviewChart = ({ data }) => {
  const { t } = useTranslation('labResults');

  const statusConfig = {
    submitted: { color: '#06b6d4', icon: Icons.Send, label: 'Submitted' },
    received: { color: '#8b5cf6', icon: Icons.Inbox, label: 'Received' },
    processing: { color: '#3b82f6', icon: Icons.Loader, label: 'Processing' },
    completed: { color: '#10b981', icon: Icons.CheckCircle, label: 'Completed' },
    pending: { color: '#f59e0b', icon: Icons.Clock, label: 'Pending' }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const status = payload[0].payload.status;
      const config = statusConfig[status];
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            {config && <config.icon size={16} style={{ color: config.color }} />}
            <p className="font-semibold text-gray-900">{config?.label || status}</p>
          </div>
          <p className="text-sm text-gray-600">
            Count: <strong>{payload[0].value}</strong>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {((payload[0].value / data.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sample Status Overview</h3>
        <p className="text-sm text-gray-600">Current distribution of sample statuses</p>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            type="category" 
            dataKey="status" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            radius={[0, 8, 8, 0]}
            fill="#3b82f6"
          >
            {data.map((entry, index) => (
              <rect
                key={`bar-${index}`}
                fill={statusConfig[entry.status]?.color || '#3b82f6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Status Grid */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.map((item, index) => {
            const config = statusConfig[item.status];
            const Icon = config?.icon || Icons.Circle;
            
            return (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-lg border-2"
                style={{ borderColor: config?.color || '#e5e7eb' }}
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${config?.color}20` }}
                >
                  <Icon size={20} style={{ color: config?.color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{config?.label || item.status}</p>
                  <p className="text-lg font-bold text-gray-900">{item.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusOverviewChart;
