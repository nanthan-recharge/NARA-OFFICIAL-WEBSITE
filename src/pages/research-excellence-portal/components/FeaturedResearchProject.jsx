import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedResearchProject = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-success text-success-foreground';
      case 'Completed': return 'bg-primary text-primary-foreground';
      case 'Planning': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-text-secondary';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-primary';
    if (progress >= 25) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card rounded-lg ocean-depth-shadow hover:shadow-lg transition-all duration-ocean">
      <div className="relative h-64 overflow-hidden rounded-t-lg">
        <Image
          src={project?.image}
          alt={project?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-cta ${getStatusColor(project?.status)}`}>
            {project?.status}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-headline text-xl font-bold mb-2">{project?.title}</h3>
          <div className="flex items-center space-x-4 text-sm opacity-90">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>{project?.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="DollarSign" size={16} />
              <span>{project?.funding}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="font-body text-text-secondary mb-4 line-clamp-3">
          {project?.description}
        </p>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-cta-medium text-text-primary">Progress</span>
            <span className="font-mono text-primary">{project?.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-ocean ${getProgressColor(project?.progress)}`}
              style={{ width: `${project?.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <Icon name="Users" size={16} className="text-text-secondary" />
            <div>
              <div className="font-cta-medium text-sm text-text-primary">Lead Researcher</div>
              <div className="text-sm text-text-secondary">{project?.leadResearcher}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Building" size={16} className="text-text-secondary" />
            <div>
              <div className="font-cta-medium text-sm text-text-primary">Division</div>
              <div className="text-sm text-text-secondary">{project?.division}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Globe" size={16} className="text-text-secondary" />
            <div>
              <div className="font-cta-medium text-sm text-text-primary">Partners</div>
              <div className="text-sm text-text-secondary">{project?.partners?.join(', ')}</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project?.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary text-xs font-cta rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            iconName="FileText"
            iconPosition="left"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedResearchProject;