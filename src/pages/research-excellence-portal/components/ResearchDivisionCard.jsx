import React from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ResearchDivisionCard = ({ division }) => {
  return (
    <div className="bg-card rounded-lg ocean-depth-shadow hover:shadow-lg transition-all duration-ocean interactive-lift">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Image
          src={division?.image}
          alt={division?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={division?.icon} size={24} className="text-coral-warm" />
            <span className="font-headline text-lg font-bold">{division?.name}</span>
          </div>
          <div className="text-sm opacity-90">{division?.researcherCount} Active Researchers</div>
        </div>
      </div>
      <div className="p-6">
        <p className="font-body text-text-secondary mb-4 line-clamp-3">
          {division?.description}
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-cta-medium text-text-primary">Active Projects</span>
            <span className="font-mono text-primary">{division?.activeProjects}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-cta-medium text-text-primary">Publications (2024)</span>
            <span className="font-mono text-primary">{division?.publications2024}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-cta-medium text-text-primary">International Partners</span>
            <span className="font-mono text-primary">{division?.internationalPartners}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {division?.specializations?.slice(0, 3)?.map((spec, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-text-secondary text-xs font-cta rounded-full"
            >
              {spec}
            </span>
          ))}
          {division?.specializations?.length > 3 && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-cta rounded-full">
              +{division?.specializations?.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            iconName="Eye"
            iconPosition="left"
          >
            View Research
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Users"
            iconPosition="left"
          >
            Collaborate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResearchDivisionCard;