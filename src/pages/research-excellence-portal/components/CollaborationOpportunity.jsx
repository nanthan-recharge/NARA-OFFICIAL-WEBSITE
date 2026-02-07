import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CollaborationOpportunity = ({ opportunity }) => {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'bg-error text-error-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-text-secondary';
    }
  };

  const getFundingColor = (amount) => {
    if (amount >= 100000) return 'text-success';
    if (amount >= 50000) return 'text-primary';
    return 'text-warning';
  };

  return (
    <div className="bg-card rounded-lg ocean-depth-shadow hover:shadow-lg transition-all duration-ocean p-6 border-l-4 border-coral-warm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-headline text-lg font-bold text-text-primary mb-2">
            {opportunity?.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>Deadline: {opportunity?.deadline}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{opportunity?.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-cta ${getUrgencyColor(opportunity?.urgency)}`}>
            {opportunity?.urgency} Priority
          </span>
          <div className={`font-mono text-sm font-bold ${getFundingColor(opportunity?.funding)}`}>
            ${opportunity?.funding?.toLocaleString()}
          </div>
        </div>
      </div>
      <p className="font-body text-text-secondary mb-4 line-clamp-3">
        {opportunity?.description}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="font-cta-medium text-sm text-text-primary mb-2">Research Area</div>
          <div className="text-sm text-text-secondary">{opportunity?.researchArea}</div>
        </div>
        <div>
          <div className="font-cta-medium text-sm text-text-primary mb-2">Partner Institution</div>
          <div className="text-sm text-text-secondary">{opportunity?.partnerInstitution}</div>
        </div>
        <div>
          <div className="font-cta-medium text-sm text-text-primary mb-2">Location</div>
          <div className="text-sm text-text-secondary">{opportunity?.location}</div>
        </div>
        <div>
          <div className="font-cta-medium text-sm text-text-primary mb-2">Team Size</div>
          <div className="text-sm text-text-secondary">{opportunity?.teamSize} researchers</div>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-cta-medium text-sm text-text-primary mb-2">Required Expertise</div>
        <div className="flex flex-wrap gap-2">
          {opportunity?.requiredExpertise?.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary text-xs font-cta rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <div className="font-cta-medium text-sm text-text-primary mb-2">Benefits</div>
        <ul className="space-y-1">
          {opportunity?.benefits?.map((benefit, index) => (
            <li key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Check" size={14} className="text-success flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          iconName="Send"
          iconPosition="left"
        >
          Apply Now
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Info"
          iconPosition="left"
        >
          Learn More
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Bookmark"
        >
        </Button>
      </div>
    </div>
  );
};

export default CollaborationOpportunity;