import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PublicationCard = ({ publication }) => {
  const getJournalRankColor = (rank) => {
    switch (rank) {
      case 'Q1': return 'bg-success text-success-foreground';
      case 'Q2': return 'bg-primary text-primary-foreground';
      case 'Q3': return 'bg-warning text-warning-foreground';
      case 'Q4': return 'bg-muted text-text-secondary';
      default: return 'bg-muted text-text-secondary';
    }
  };

  return (
    <div className="bg-card rounded-lg ocean-depth-shadow hover:shadow-lg transition-all duration-ocean p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-headline text-lg font-bold text-text-primary mb-2 line-clamp-2">
            {publication?.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{publication?.publishedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={14} />
              <span>{publication?.citations} citations</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="TrendingUp" size={14} />
              <span>Impact: {publication?.impactFactor}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded text-xs font-cta ${getJournalRankColor(publication?.journalRank)}`}>
            {publication?.journalRank}
          </span>
          {publication?.openAccess && (
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-cta rounded">
              Open Access
            </span>
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="font-cta-medium text-sm text-text-primary mb-1">Journal</div>
        <div className="text-sm text-text-secondary">{publication?.journal}</div>
      </div>
      <div className="mb-4">
        <div className="font-cta-medium text-sm text-text-primary mb-2">Authors</div>
        <div className="flex flex-wrap gap-2">
          {publication?.authors?.slice(0, 3)?.map((author, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-text-secondary text-xs font-cta rounded-full"
            >
              {author}
            </span>
          ))}
          {publication?.authors?.length > 3 && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-cta rounded-full">
              +{publication?.authors?.length - 3} more
            </span>
          )}
        </div>
      </div>
      <div className="mb-6">
        <div className="font-cta-medium text-sm text-text-primary mb-2">Abstract</div>
        <p className="font-body text-sm text-text-secondary line-clamp-3">
          {publication?.abstract}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {publication?.keywords?.slice(0, 4)?.map((keyword, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-ocean-light/10 text-ocean-medium text-xs font-cta rounded"
          >
            {keyword}
          </span>
        ))}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          iconName="ExternalLink"
          iconPosition="left"
        >
          View Publication
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          PDF
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Share2"
        >
        </Button>
      </div>
    </div>
  );
};

export default PublicationCard;