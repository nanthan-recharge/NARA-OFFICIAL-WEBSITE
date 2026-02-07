import React from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ResearcherProfileCard = ({ researcher }) => {
  if (!researcher) return null;

  return (
    <div className="bg-card rounded-lg ocean-depth-shadow p-6 hover:shadow-xl transition-all duration-300">
      {/* Profile Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={researcher?.profile_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
            alt={researcher?.full_name || 'Researcher'}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-cta text-lg font-semibold text-text-primary mb-1 truncate">
            {researcher?.full_name}
          </h3>
          
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              researcher?.role === 'admin' ? 'bg-primary/10 text-primary' :
              researcher?.role === 'senior_researcher' ? 'bg-coral-warm/10 text-coral-warm' :
              researcher?.role === 'researcher'? 'bg-ocean-medium/10 text-ocean-medium' : 'bg-muted text-text-secondary'
            }`}>
              {researcher?.role?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
            </span>
            
            {researcher?.is_public && (
              <Icon name="Globe" size={14} className="text-success" />
            )}
          </div>
          
          <p className="font-body text-sm text-text-secondary">
            {researcher?.position_title}
          </p>
          
          {researcher?.institution && (
            <div className="flex items-center space-x-1 mt-1">
              <Icon name="Building2" size={14} className="text-text-secondary" />
              <p className="font-body text-sm text-text-secondary truncate">
                {researcher?.institution}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {researcher?.bio && (
        <p className="font-body text-sm text-text-secondary mb-4 line-clamp-2">
          {researcher?.bio}
        </p>
      )}

      {/* Research Interests */}
      {researcher?.research_interests?.length > 0 && (
        <div className="mb-4">
          <h4 className="font-cta text-sm font-medium text-text-primary mb-2">
            Research Interests
          </h4>
          <div className="flex flex-wrap gap-1">
            {researcher?.research_interests?.slice(0, 3)?.map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-text-secondary text-xs rounded"
              >
                {interest}
              </span>
            ))}
            {researcher?.research_interests?.length > 3 && (
              <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded">
                +{researcher?.research_interests?.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expertise Areas */}
      {researcher?.user_expertise?.length > 0 && (
        <div className="mb-4">
          <h4 className="font-cta text-sm font-medium text-text-primary mb-2">
            Expertise
          </h4>
          <div className="space-y-2">
            {researcher?.user_expertise?.slice(0, 2)?.map((expertise) => (
              <div key={expertise?.id} className="flex items-center justify-between">
                <span className="font-body text-sm text-text-primary">
                  {expertise?.expertise_area?.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    expertise?.level === 'expert' ? 'bg-success/10 text-success' :
                    expertise?.level === 'advanced' ? 'bg-accent/10 text-accent' :
                    expertise?.level === 'intermediate'? 'bg-primary/10 text-primary' : 'bg-muted text-text-secondary'
                  }`}>
                    {expertise?.level}
                  </span>
                  {expertise?.verified && (
                    <Icon name="CheckCircle" size={14} className="text-success" />
                  )}
                </div>
              </div>
            ))}
            {researcher?.user_expertise?.length > 2 && (
              <p className="font-body text-xs text-text-secondary">
                +{researcher?.user_expertise?.length - 2} more expertise areas
              </p>
            )}
          </div>
        </div>
      )}

      {/* Contact Links */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-3">
          {researcher?.contact_info?.email && (
            <button
              onClick={() => window.open(`mailto:${researcher?.contact_info?.email}`)}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              <Icon name="Mail" size={16} />
            </button>
          )}
          
          {researcher?.social_links?.linkedin && (
            <button
              onClick={() => window.open(researcher?.social_links?.linkedin, '_blank')}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              <Icon name="Linkedin" size={16} />
            </button>
          )}
          
          {researcher?.social_links?.twitter && (
            <button
              onClick={() => window.open(researcher?.social_links?.twitter, '_blank')}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              <Icon name="Twitter" size={16} />
            </button>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="User"
          iconPosition="left"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default ResearcherProfileCard;