import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FellowshipOpportunities = ({ fellowships }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 'PhD': return 'bg-primary text-primary-foreground';
      case 'Postdoc': return 'bg-success text-success-foreground';
      case 'Senior': return 'bg-accent text-accent-foreground';
      case 'Visiting': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-text-secondary';
    }
  };

  return (
    <div className="bg-card rounded-lg ocean-depth-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-xl font-bold text-text-primary">Fellowship Opportunities</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {fellowships?.map((fellowship, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors duration-ocean"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-cta text-base font-semibold text-text-primary mb-1">
                  {fellowship?.title}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>Deadline: {fellowship?.deadline}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{fellowship?.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="DollarSign" size={14} />
                    <span>${fellowship?.stipend?.toLocaleString()}/month</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-cta ${getLevelColor(fellowship?.level)}`}>
                  {fellowship?.level}
                </span>
                <div className="text-xs text-text-secondary">
                  {fellowship?.applicationsCount} applications
                </div>
              </div>
            </div>
            
            <p className="font-body text-sm text-text-secondary mb-3 line-clamp-2">
              {fellowship?.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <div className="font-cta-medium text-xs text-text-primary mb-1">Research Area</div>
                <div className="text-xs text-text-secondary">{fellowship?.researchArea}</div>
              </div>
              <div>
                <div className="font-cta-medium text-xs text-text-primary mb-1">Supervisor</div>
                <div className="text-xs text-text-secondary">{fellowship?.supervisor}</div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="font-cta-medium text-xs text-text-primary mb-2">Requirements</div>
              <div className="flex flex-wrap gap-1">
                {fellowship?.requirements?.slice(0, 4)?.map((req, reqIndex) => (
                  <span
                    key={reqIndex}
                    className="px-2 py-1 bg-muted text-text-secondary text-xs font-cta rounded"
                  >
                    {req}
                  </span>
                ))}
                {fellowship?.requirements?.length > 4 && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-cta rounded">
                    +{fellowship?.requirements?.length - 4} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} />
                  <span>{fellowship?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} />
                  <span>{fellowship?.positions} positions</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="xs"
                  iconName="Send"
                  iconPosition="left"
                >
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Info"
                >
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button
          variant="outline"
          iconName="GraduationCap"
          iconPosition="left"
        >
          Browse All Fellowship Programs
        </Button>
      </div>
    </div>
  );
};

export default FellowshipOpportunities;