import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const STATUS_THEMES = {
  operational: {
    label: 'Operational',
    chip: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    icon: 'CheckCircle',
    accent: 'text-emerald-400',
    card: 'bg-emerald-950/10 border-emerald-500/20 hover:bg-emerald-900/20'
  },
  degraded: {
    label: 'Degraded',
    chip: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    icon: 'AlertCircle',
    accent: 'text-amber-400',
    card: 'bg-amber-950/10 border-amber-500/20 hover:bg-amber-900/20'
  },
  outage: {
    label: 'Outage',
    chip: 'bg-red-500/10 text-red-400 border border-red-500/20',
    icon: 'XCircle',
    accent: 'text-red-400',
    card: 'bg-red-950/10 border-red-500/20 hover:bg-red-900/20'
  },
  maintenance: {
    label: 'Maintenance',
    chip: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    icon: 'Settings',
    accent: 'text-sky-400',
    card: 'bg-sky-950/10 border-sky-500/20 hover:bg-sky-900/20'
  },
  default: {
    label: 'Unknown',
    chip: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    icon: 'HelpCircle',
    accent: 'text-slate-400',
    card: 'bg-white/5 border-white/10 hover:bg-white/10'
  }
};

const SystemStatusIndicator = ({ systems }) => {
  const getStatusTheme = (status) => STATUS_THEMES[status] ?? STATUS_THEMES.default;

  const overallStatus = systems?.every((system) => system?.status === 'operational')
    ? 'operational'
    : systems?.some((system) => system?.status === 'outage')
      ? 'outage'
      : systems?.some((system) => system?.status === 'degraded')
        ? 'degraded'
        : 'maintenance';

  const overallTheme = getStatusTheme(overallStatus);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
      <div className="relative border-b border-white/10 px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline font-bold text-white flex items-center gap-3">
            <Icon name="Activity" size={24} className="text-cyan-400" />
            System Status
          </h2>
          <div className={cn('flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider', overallTheme.chip)}>
            <Icon name={overallTheme.icon} size={14} />
            {overallTheme.label}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Real-time diagnostics of critical infrastructure.
        </p>
      </div>

      <div className="relative px-6 py-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {systems?.map((system, index) => {
            const theme = getStatusTheme(system?.status);

            return (
              <div key={index} className={cn('rounded-xl p-4 border transition-all duration-300', theme.card)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg bg-white/5', theme.accent)}>
                      <Icon name={system?.icon} size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{system?.name}</h3>
                      <p className="text-xs text-gray-400">{system?.description}</p>
                    </div>
                  </div>
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-mono uppercase', theme.chip)}>
                    {theme.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Uptime</div>
                    <div className="text-sm font-mono font-bold text-white">{system?.uptime}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Response</div>
                    <div className="text-sm font-mono font-bold text-white">{system?.responseTime}</div>
                  </div>
                </div>

                {system?.statusMessage && (
                  <div className="mt-3 text-[11px] text-gray-400 flex items-center gap-2 bg-white/5 px-2 py-1.5 rounded">
                    <Icon name="Info" size={12} />
                    {system?.statusMessage}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Last updated: just now</span>
            <span>Next scheduled maintenance: Dec 12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusIndicator;
