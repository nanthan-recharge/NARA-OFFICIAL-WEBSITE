import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const PreparednessResourceCard = ({ resource }) => {
  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case 'guide':
        return {
          icon: 'BookOpen',
          wrapper: 'hover:border-sky-500/30',
          iconBg: 'bg-sky-500/20 text-sky-400',
          badge: 'text-sky-300 bg-sky-500/10 border-sky-500/20'
        };
      case 'checklist':
        return {
          icon: 'CheckSquare',
          wrapper: 'hover:border-emerald-500/30',
          iconBg: 'bg-emerald-500/20 text-emerald-400',
          badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
        };
      case 'video':
        return {
          icon: 'Play',
          wrapper: 'hover:border-violet-500/30',
          iconBg: 'bg-violet-500/20 text-violet-400',
          badge: 'text-violet-300 bg-violet-500/10 border-violet-500/20'
        };
      default:
        return {
          icon: 'FileText',
          wrapper: 'hover:border-white/20',
          iconBg: 'bg-white/10 text-white',
          badge: 'text-gray-300 bg-white/5 border-white/10'
        };
    }
  };

  const config = getTypeConfig(resource?.type);

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10",
      config.wrapper
    )}>
      <div className="relative mb-5 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={cn('rounded-xl p-3 shadow-inner', config.iconBg)}>
            <Icon name={config.icon} size={24} />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-headline font-bold text-white group-hover:text-white transition-colors leading-tight">
              {resource?.title}
            </h3>
            <span className={cn('inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border', config.badge)}>
              {resource?.type}
            </span>
          </div>
        </div>
        {resource?.isNew && (
          <span className="rounded-full bg-emerald-500 w-2 h-2 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        )}
      </div>

      <p className="text-sm font-body text-gray-400 leading-relaxed mb-4 min-h-[3rem]">
        {resource?.description}
      </p>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="rounded-xl bg-black/20 p-2 text-center border border-white/5">
          <div className="font-mono text-sm font-bold text-white">{resource?.downloads || '0'}</div>
          <div className="text-[10px] text-gray-500 uppercase">Downloads</div>
        </div>
        <div className="rounded-xl bg-black/20 p-2 text-center border border-white/5">
          <div className="font-mono text-sm font-bold text-white">{resource?.rating || '4.8'}</div>
          <div className="text-[10px] text-gray-500 uppercase">Rating</div>
        </div>
        <div className="rounded-xl bg-black/20 p-2 text-center border border-white/5">
          <div className="font-mono text-sm font-bold text-white uppercase">{resource?.fileSize || 'N/A'}</div>
          <div className="text-[10px] text-gray-500 uppercase">Size</div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        {resource?.formats?.map((format, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleDownload(format?.url, `${resource?.title}.${format?.type}`)}
            className="flex-1 border-white/10 hover:bg-white/10 text-white"
          >
            <Icon name="Download" size={14} className="mr-2" />
            {format?.type?.toUpperCase()}
          </Button>
        ))}
        {resource?.previewUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(resource?.previewUrl, '_blank')}
            className="text-gray-400 hover:text-white px-2"
          >
            <Icon name="Eye" size={18} />
          </Button>
        )}
      </div>

      <div className="mt-3 text-[10px] font-mono text-gray-600 text-center uppercase tracking-widest group-hover:text-gray-500 transition-colors">
        Updated {resource?.lastUpdated}
      </div>
    </div>
  );
};

export default PreparednessResourceCard;
