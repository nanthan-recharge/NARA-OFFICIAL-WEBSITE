import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResearchTimeline = ({ timelineData }) => {
  const [selectedYear, setSelectedYear] = useState(2024);
  
  const years = [2024, 2023, 2022, 2021, 2020];
  
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'publication': return 'FileText';
      case 'project': return 'Beaker';
      case 'collaboration': return 'Users';
      case 'award': return 'Award';
      case 'conference': return 'Presentation';
      default: return 'Circle';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'publication': return 'bg-primary text-primary-foreground';
      case 'project': return 'bg-success text-success-foreground';
      case 'collaboration': return 'bg-accent text-accent-foreground';
      case 'award': return 'bg-warning text-warning-foreground';
      case 'conference': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-text-secondary';
    }
  };

  const filteredEvents = timelineData?.filter(event => 
    new Date(event.date)?.getFullYear() === selectedYear
  );

  return (
    <div className="bg-card rounded-lg ocean-depth-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-xl font-bold text-text-primary">Research Timeline</h3>
        <div className="flex space-x-2">
          {years?.map(year => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(year)}
              className="min-w-[60px]"
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {filteredEvents?.map((event, index) => (
            <div key={index} className="relative flex items-start space-x-4">
              {/* Timeline dot */}
              <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${getEventTypeColor(event?.type)}`}>
                <Icon name={getEventTypeIcon(event?.type)} size={24} />
              </div>
              
              {/* Event content */}
              <div className="flex-1 bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors duration-ocean">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-cta text-base font-semibold text-text-primary mb-1">
                      {event?.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{new Date(event.date)?.toLocaleDateString()}</span>
                      </div>
                      {event?.division && (
                        <div className="flex items-center space-x-1">
                          <Icon name="Building" size={14} />
                          <span>{event?.division}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-cta capitalize ${getEventTypeColor(event?.type)}`}>
                    {event?.type}
                  </span>
                </div>
                
                <p className="font-body text-sm text-text-secondary mb-3 line-clamp-2">
                  {event?.description}
                </p>
                
                {event?.metrics && (
                  <div className="flex items-center space-x-4 text-xs text-text-secondary mb-3">
                    {event?.metrics?.citations && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Quote" size={12} />
                        <span>{event?.metrics?.citations} citations</span>
                      </div>
                    )}
                    {event?.metrics?.funding && (
                      <div className="flex items-center space-x-1">
                        <Icon name="DollarSign" size={12} />
                        <span>${event?.metrics?.funding?.toLocaleString()}</span>
                      </div>
                    )}
                    {event?.metrics?.participants && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={12} />
                        <span>{event?.metrics?.participants} participants</span>
                      </div>
                    )}
                  </div>
                )}
                
                {event?.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {event?.tags?.slice(0, 3)?.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-background text-text-secondary text-xs font-cta rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="ExternalLink"
                    iconPosition="left"
                  >
                    View Details
                  </Button>
                  {event?.downloadUrl && (
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredEvents?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Calendar" size={48} className="text-text-secondary mx-auto mb-4" />
            <p className="font-body text-text-secondary">No events found for {selectedYear}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchTimeline;