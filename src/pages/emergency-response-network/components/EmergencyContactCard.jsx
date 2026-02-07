import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const EmergencyContactCard = ({ contact }) => {
  const handleCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleSMS = (number) => {
    window.open(`sms:${number}`, '_self');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
      <div className="relative flex items-start justify-between mb-5">
        <div className="flex items-start gap-4">
          <div className={cn('rounded-2xl bg-white/10 p-3 shadow-inner', contact?.iconColor ?? 'text-cyan-400')}>
            <Icon name={contact?.icon} size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-headline font-bold text-white leading-tight">
              {contact?.name}
            </h3>
            <p className="text-sm font-body text-gray-400 leading-snug">
              {contact?.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500 pt-2">
              <span className="flex items-center gap-1">
                <Icon name="Clock" size={12} />
                {contact?.availability}
              </span>
              {contact?.languages && (
                <span className="flex items-center gap-1">
                  <Icon name="Globe" size={12} />
                  {contact?.languages?.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        {contact?.priority && (
          <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-200 animate-pulse">
            Priority
          </span>
        )}
      </div>

      <div className="space-y-3">
        {contact?.phones?.map((phone, index) => (
          <div
            key={index}
            className="group flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/20 p-4 transition-colors hover:bg-black/30 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-400">
                {phone?.label}
              </div>
              <div className="font-mono text-lg text-white font-bold tracking-tight">
                {phone?.number}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCall(phone?.number)}
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 h-9"
              >
                <Icon name="Phone" size={16} className="mr-1" />
                Call
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSMS(phone?.number)}
                className="text-gray-400 hover:text-white h-9 w-9 p-0"
              >
                <Icon name="MessageSquare" size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {contact?.email && (
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => window.open(`mailto:${contact?.email}`, '_self')}>
            <Icon name="Mail" size={16} />
            {contact?.email}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactCard;
