import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RegionalMap = ({ data = {} }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regions = useMemo(() => data?.regions ?? [], [data?.regions]);

  const totalStaff = useMemo(
    () => regions?.reduce((sum, region) => sum + (region?.staff || 0), 0),
    [regions]
  );
  const totalProjects = useMemo(
    () => regions?.reduce((sum, region) => sum + (region?.projects || 0), 0),
    [regions]
  );
  const totalCommunities = useMemo(
    () => regions?.reduce((sum, region) => sum + (region?.communities || 0), 0),
    [regions]
  );

  return (
    <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-xl font-bold text-text-primary">
            {data?.header?.title}
          </h3>
          <p className="font-body text-text-secondary mt-1">{data?.header?.subtitle}</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="font-body text-text-secondary">{data?.legend?.active}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="font-body text-text-secondary">{data?.legend?.selected}</span>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-br from-ocean-light/10 to-ocean-deep/10 rounded-lg p-8 h-96 overflow-hidden">
            {/* Sri Lanka Outline */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-80 bg-gradient-to-b from-ocean-medium/20 to-ocean-deep/30 rounded-full transform rotate-12 opacity-50"></div>
            </div>

            {/* Regional Centers */}
            {regions?.map((region) => (
              <div
                key={region?.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-ocean ${
                  selectedRegion?.id === region?.id ? 'scale-125 z-10' : 'hover:scale-110'
                }`}
                style={{ top: region?.position?.top, left: region?.position?.left }}
                onClick={() => setSelectedRegion(selectedRegion?.id === region?.id ? null : region)}
              >
                <div className={`relative ${
                  selectedRegion?.id === region?.id ? 'animate-ocean-pulse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-ocean ${
                    selectedRegion?.id === region?.id 
                      ? 'bg-accent text-accent-foreground coral-glow' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/80'
                  }`}>
                    <Icon name="MapPin" size={16} />
                  </div>
                  
                  {/* Tooltip */}
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card text-card-foreground text-xs rounded-lg shadow-ocean-depth whitespace-nowrap transition-all duration-ocean ${
                    selectedRegion?.id === region?.id ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}>
                    <div className="font-cta-medium">{region?.name}</div>
                    <div className="text-text-secondary">{region?.specialization}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-card rotate-45"></div>
                  </div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs font-cta text-text-secondary mb-2">{data?.header?.title}</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <Icon name="Users" size={12} className="text-primary" />
                  <span className="font-body text-text-secondary">
                    {data?.legendTotals?.staff}: {totalStaff}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Icon name="Beaker" size={12} className="text-secondary" />
                  <span className="font-body text-text-secondary">
                    {data?.legendTotals?.projects}: {totalProjects}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Icon name="Home" size={12} className="text-accent" />
                  <span className="font-body text-text-secondary">
                    {data?.legendTotals?.communities}: {totalCommunities}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Details */}
        <div className="space-y-4">
          {selectedRegion ? (
            <div className="bg-muted rounded-lg p-4 animate-depth-reveal">
              <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                <Image
                  src={selectedRegion?.image}
                  alt={selectedRegion?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <div className="font-cta-medium text-sm">{selectedRegion?.location}</div>
                </div>
              </div>

              <h4 className="font-headline text-lg font-bold text-text-primary mb-2">
                {selectedRegion?.name}
              </h4>
              
              <p className="font-body text-sm text-text-secondary mb-4">
                {selectedRegion?.description}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="font-headline text-lg font-bold text-primary">{selectedRegion?.staff}</div>
                  <div className="font-body text-xs text-text-secondary">{data?.details?.staffLabel}</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-lg font-bold text-secondary">{selectedRegion?.projects}</div>
                  <div className="font-body text-xs text-text-secondary">{data?.details?.projectsLabel}</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-lg font-bold text-accent">{selectedRegion?.communities}</div>
                  <div className="font-body text-xs text-text-secondary">{data?.details?.communitiesLabel}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-cta-medium text-sm text-text-primary">{data?.details?.keyProjectsTitle}</div>
                {selectedRegion?.keyProjects?.map((project, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Icon name="ChevronRight" size={12} className="text-primary" />
                    <span className="font-body text-text-secondary">{project}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-lg p-6 text-center">
              <Icon name="MousePointer" size={32} className="text-text-secondary mx-auto mb-3" />
              <div className="font-cta-medium text-text-primary mb-2">{data?.emptyState?.title}</div>
              <p className="font-body text-sm text-text-secondary">{data?.emptyState?.description}</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4">
            <div className="font-cta-medium text-sm text-text-primary mb-3">{data?.quickStats?.title}</div>
            <div className="space-y-2">
              {data?.quickStats?.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-body text-text-secondary">{item?.label}</span>
                  <span className="font-cta-medium text-primary">{item?.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalMap;
