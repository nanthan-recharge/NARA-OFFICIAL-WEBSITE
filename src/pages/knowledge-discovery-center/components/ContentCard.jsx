import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ContentCard = ({ content, onView, onDownload, onCite }) => {
  const getTypeIcon = (type) => {
    const iconMap = {
      'peer-reviewed': 'FileText',
      'technical-reports': 'FileBarChart',
      'policy-briefs': 'FileCheck',
      'educational-materials': 'GraduationCap',
      'multimedia': 'Play',
      'datasets': 'Database',
      'community-knowledge': 'Users'
    };
    return iconMap?.[type] || 'File';
  };

  const getTypeColor = (type) => {
    const colorMap = {
      'peer-reviewed': 'text-primary',
      'technical-reports': 'text-secondary',
      'policy-briefs': 'text-accent',
      'educational-materials': 'text-success',
      'multimedia': 'text-warning',
      'datasets': 'text-ocean-medium',
      'community-knowledge': 'text-coral-warm'
    };
    return colorMap?.[type] || 'text-text-secondary';
  };

  const getDifficultyBadge = (level) => {
    const badgeMap = {
      'general': { label: 'General', color: 'bg-success/10 text-success' },
      'undergraduate': { label: 'Undergraduate', color: 'bg-ocean-medium/10 text-ocean-medium' },
      'graduate': { label: 'Graduate', color: 'bg-warning/10 text-warning' },
      'professional': { label: 'Professional', color: 'bg-accent/10 text-accent' },
      'expert': { label: 'Expert', color: 'bg-error/10 text-error' }
    };
    return badgeMap?.[level] || { label: level, color: 'bg-muted text-text-secondary' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const difficultyBadge = getDifficultyBadge(content?.difficultyLevel);

  return (
    <div className="bg-card rounded-lg scientific-border p-6 hover:shadow-ocean-depth transition-all duration-ocean interactive-lift">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-muted ${getTypeColor(content?.type)}`}>
            <Icon name={getTypeIcon(content?.type)} size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-cta text-text-secondary uppercase tracking-wider">
                {content?.type?.replace('-', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-cta-medium ${difficultyBadge?.color}`}>
                {difficultyBadge?.label}
              </span>
            </div>
            <div className="text-xs text-text-secondary">
              {formatDate(content?.publishedDate)} • {content?.readTime} read
            </div>
          </div>
        </div>
        
        {content?.isNew && (
          <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-cta-medium rounded-full">
            New
          </span>
        )}
      </div>
      {/* Content */}
      <div className="mb-4">
        <h3 className="font-headline text-lg font-bold text-text-primary mb-2 line-clamp-2">
          {content?.title}
        </h3>
        
        {content?.thumbnail && (
          <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
            <Image
              src={content?.thumbnail}
              alt={content?.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <p className="font-body text-text-secondary text-sm line-clamp-3 mb-3">
          {content?.abstract}
        </p>
        
        {/* Authors */}
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Users" size={14} className="text-text-secondary" />
          <span className="text-xs text-text-secondary">
            {content?.authors?.join(', ')}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {content?.tags?.slice(0, 3)?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {content?.tags?.length > 3 && (
            <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
              +{content?.tags?.length - 3} more
            </span>
          )}
        </div>
      </div>
      {/* Languages Available */}
      {content?.languages && content?.languages?.length > 1 && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-lg">
          <Icon name="Globe" size={14} className="text-text-secondary" />
          <span className="text-xs text-text-secondary">
            Available in: {content?.languages?.join(', ')}
          </span>
        </div>
      )}
      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Icon name="Eye" size={14} />
            <span>{content?.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Download" size={14} />
            <span>{content?.downloads}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Quote" size={14} />
            <span>{content?.citations}</span>
          </div>
        </div>
        
        {content?.impactScore && (
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} />
            <span>Impact: {content?.impactScore}</span>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onView(content)}
          iconName="Eye"
          iconPosition="left"
          className="flex-1 min-w-0"
        >
          View
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(content)}
          iconName="Download"
          iconPosition="left"
        >
          Download
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCite(content)}
          iconName="Quote"
          iconPosition="left"
        >
          Cite
        </Button>
      </div>
      {/* Policy Impact Indicator */}
      {content?.policyImpact && (
        <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm font-cta-medium text-success">Policy Impact</span>
          </div>
          <p className="text-xs text-success/80 mt-1">
            {content?.policyImpact}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentCard;