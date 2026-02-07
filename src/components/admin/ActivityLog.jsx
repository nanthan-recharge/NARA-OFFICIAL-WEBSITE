import React from 'react';
import { UserPlus, Edit, Trash2, Shield, Clock, LogIn, LogOut, Camera, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { ACTIVITY_ACTIONS } from '../../constants/roles';

const actionIcons = {
  [ACTIVITY_ACTIONS.USER_CREATED]: { icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50' },
  [ACTIVITY_ACTIONS.USER_UPDATED]: { icon: Edit, color: 'text-blue-600', bg: 'bg-blue-50' },
  [ACTIVITY_ACTIONS.USER_DELETED]: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
  [ACTIVITY_ACTIONS.ROLE_CHANGED]: { icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
  [ACTIVITY_ACTIONS.STATUS_CHANGED]: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  [ACTIVITY_ACTIONS.PERMISSION_CHANGED]: { icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  [ACTIVITY_ACTIONS.LOGIN]: { icon: LogIn, color: 'text-green-600', bg: 'bg-green-50' },
  [ACTIVITY_ACTIONS.LOGOUT]: { icon: LogOut, color: 'text-slate-600', bg: 'bg-slate-50' },
  [ACTIVITY_ACTIONS.PROFILE_PHOTO_UPDATED]: { icon: Camera, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  [ACTIVITY_ACTIONS.BULK_IMPORT]: { icon: Upload, color: 'text-blue-600', bg: 'bg-blue-50' },
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ActivityLog = ({ logs = [], loading = false, emptyMessage = 'No activity recorded' }) => {
  const [expanded, setExpanded] = React.useState({});

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-6 h-6 border-2 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-500">Loading activity...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-8 text-center">
        <Clock className="w-10 h-10 text-slate-200 mx-auto mb-2" />
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map((log, i) => {
        const config = actionIcons[log.action] || { icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' };
        const Icon = config.icon;
        const hasDetails = log.metadata && Object.keys(log.metadata).length > 0;
        const isExpanded = expanded[log.id];

        return (
          <div key={log.id || i} className="flex gap-3 py-3 border-b border-slate-50 last:border-0">
            {/* Icon */}
            <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">{log.details}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-400">{formatTimeAgo(log.timestamp)}</span>
                {log.performedBy && (
                  <span className="text-xs text-slate-400">by {log.performedBy}</span>
                )}
              </div>

              {/* Expandable details */}
              {hasDetails && (
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [log.id]: !prev[log.id] }))}
                  className="text-xs text-[#0066CC] hover:underline mt-1 flex items-center gap-1"
                >
                  {isExpanded ? 'Hide details' : 'Show details'}
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
              {hasDetails && isExpanded && (
                <pre className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600 overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityLog;
