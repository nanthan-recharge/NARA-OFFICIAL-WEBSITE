import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertCard = ({ alert, onViewDetails, onDismiss }) => {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          wrapper: 'bg-red-950/20 border-red-500/40 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]',
          iconBg: 'bg-red-500/20 text-red-400',
          textColor: 'text-red-100',
          descColor: 'text-red-200/80',
          badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30',
          icon: 'AlertTriangle'
        };
      case 'high':
        return {
          wrapper: 'bg-orange-950/20 border-orange-500/40 shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]',
          iconBg: 'bg-orange-500/20 text-orange-400',
          textColor: 'text-orange-100',
          descColor: 'text-orange-200/80',
          badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
          icon: 'AlertCircle'
        };
      case 'medium':
        return {
          wrapper: 'bg-yellow-950/20 border-yellow-500/40 shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]',
          iconBg: 'bg-yellow-500/20 text-yellow-400',
          textColor: 'text-yellow-100',
          descColor: 'text-yellow-200/80',
          badgeColor: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
          icon: 'AlertTriangle'
        };
      default:
        return {
          wrapper: 'bg-blue-950/20 border-blue-500/40 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]',
          iconBg: 'bg-blue-500/20 text-blue-400',
          textColor: 'text-blue-100',
          descColor: 'text-blue-200/80',
          badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
          icon: 'Info'
        };
    }
  };

  const config = getSeverityConfig(alert?.severity);

  return (
    <div className={`${config?.wrapper} border backdrop-blur-md rounded-2xl p-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${config?.iconBg}`}>
            <Icon name={config?.icon} size={24} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h3 className={`text-lg font-headline font-bold ${config?.textColor}`}>
                {alert?.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config?.badgeColor}`}>
                {alert?.severity}
              </span>
            </div>
            <p className={`text-sm font-body ${config?.descColor} mb-3 leading-relaxed`}>
              {alert?.description}
            </p>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className={`${config?.textColor} opacity-70 flex items-center gap-1`}>
                <Icon name="MapPin" size={12} />
                {alert?.location}
              </span>
              <span className={`${config?.textColor} opacity-70 flex items-center gap-1`}>
                <Icon name="Clock" size={12} />
                {alert?.timestamp}
              </span>
            </div>
          </div>
        </div>
        {alert?.canDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(alert?.id)}
            className="text-white/40 hover:text-white hover:bg-white/5 h-8 w-8 p-0 rounded-full"
          >
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-white/5 gap-4">
        <div className="flex items-center gap-2">
          {alert?.affectedAreas && (
            <span className={`text-xs font-mono ${config?.textColor} opacity-60`}>
              Affected: {alert?.affectedAreas?.join(', ')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(alert)}
            className={`border-white/10 hover:bg-white/5 ${config?.textColor}`}
          >
            <Icon name="Eye" size={14} className="mr-2" />
            Details
          </Button>
          {alert?.hasMap && (
            <Button
              size="sm"
              className={`${config?.badgeColor} hover:brightness-110 border-none`}
            >
              <Icon name="Map" size={14} className="mr-2" />
              Map
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;