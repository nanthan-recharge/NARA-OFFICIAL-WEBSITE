import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-l-blue-500', icon: 'text-blue-600' },
  green: { bg: 'bg-green-50', border: 'border-l-green-500', icon: 'text-green-600' },
  amber: { bg: 'bg-amber-50', border: 'border-l-amber-500', icon: 'text-amber-600' },
  red: { bg: 'bg-red-50', border: 'border-l-red-500', icon: 'text-red-600' },
  purple: { bg: 'bg-purple-50', border: 'border-l-purple-500', icon: 'text-purple-600' },
  cyan: { bg: 'bg-cyan-50', border: 'border-l-cyan-500', icon: 'text-cyan-600' },
  slate: { bg: 'bg-slate-50', border: 'border-l-slate-500', icon: 'text-slate-600' },
  navy: { bg: 'bg-blue-50', border: 'border-l-[#003366]', icon: 'text-[#003366]' },
};

const AdminStatsCard = ({ title, value, change, changeType = 'neutral', icon: Icon, color = 'navy' }) => {
  const colors = colorMap[color] || colorMap.navy;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${colors.border} shadow-sm p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' :
              'text-slate-500'
            }`}>
              {changeType === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <TrendingDown className="w-3.5 h-3.5" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatsCard;
