import React from 'react';
import { getStatusConfig } from '../../constants/roles';

const colorStyles = {
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  slate: 'bg-slate-50 text-slate-600 border-slate-200',
  gray: 'bg-gray-50 text-gray-600 border-gray-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
};

const dotColors = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  slate: 'bg-slate-400',
  gray: 'bg-gray-400',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
  cyan: 'bg-cyan-500',
  teal: 'bg-teal-500',
};

const AdminStatusBadge = ({ status, label, color, size = 'sm', showDot = true }) => {
  // Auto-resolve from status value if no color/label provided
  const statusConfig = !color && status ? getStatusConfig(status) : null;
  const resolvedColor = color || statusConfig?.color || 'slate';
  const resolvedLabel = label || statusConfig?.label?.en || status || 'Unknown';

  const sizeClasses = size === 'xs'
    ? 'text-xs px-1.5 py-0.5'
    : size === 'sm'
    ? 'text-xs px-2.5 py-1'
    : 'text-sm px-3 py-1.5';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colorStyles[resolvedColor] || colorStyles.slate} ${sizeClasses}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[resolvedColor] || dotColors.slate}`} />
      )}
      {resolvedLabel}
    </span>
  );
};

export default AdminStatusBadge;
