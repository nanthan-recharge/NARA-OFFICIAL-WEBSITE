import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const defaultObservation = { location: '', observation: '', category: '' };

const CommunityEngagement = ({ data = {} }) => {
  const [activeTab, setActiveTab] = useState(data?.tabs?.[0]?.id ?? 'forums');
  const [newObservation, setNewObservation] = useState(defaultObservation);

  useEffect(() => {
    setActiveTab(data?.tabs?.[0]?.id ?? 'forums');
  }, [data?.tabs]);

  const forums = data?.forums ?? {};
  const citizenScience = data?.citizenScience ?? {};
  const alerts = data?.alerts ?? {};
  const events = data?.events ?? {};

  const resetObservation = () => {
    setNewObservation(defaultObservation);
  };

  const handleObservationSubmit = (event) => {
    event?.preventDefault();
    resetObservation();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent':
        return 'bg-error text-error-foreground';
      case 'expert-response':
        return 'bg-primary text-primary-foreground';
      case 'popular':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-success text-success-foreground';
    }
  };

  const activeMembersLabel = useMemo(
    () => data?.header?.activeMembers,
    [data?.header?.activeMembers]
  );

  return (
    <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h3 className="font-headline text-xl font-bold text-text-primary">{data?.header?.title}</h3>
          <p className="font-body text-text-secondary mt-1">{data?.header?.description}</p>
        </div>

        {activeMembersLabel ? (
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="font-body text-text-secondary">{activeMembersLabel}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {data?.tabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab?.id)}
            iconName={tab?.icon}
            iconPosition="left"
            iconSize={16}
            className={`mb-2 ${activeTab === tab?.id ? '' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab?.label}
          </Button>
        ))}
      </div>

      <div className="min-h-96">
        {activeTab === 'forums' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="default" iconName="Plus" iconPosition="left" size="sm">
                  {forums?.actions?.newTopic}
                </Button>
                <Button variant="outline" iconName="Search" iconPosition="left" size="sm">
                  {forums?.actions?.search}
                </Button>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <span className="font-body text-text-secondary">{forums?.actions?.sortLabel}</span>
                <Button variant="ghost" size="sm" className="text-xs">
                  {forums?.actions?.latest}
                </Button>
              </div>
            </div>

            {forums?.topics?.map((topic) => (
              <div key={topic?.id} className="bg-muted rounded-lg p-4 interactive-lift">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-cta-medium ${getStatusColor(topic?.status)}`}>
                        {topic?.statusLabel ?? topic?.status?.replace('-', ' ')?.toUpperCase()}
                      </span>
                      <span className="text-xs text-text-secondary">{topic?.category}</span>
                    </div>

                    <h4 className="font-headline text-lg font-bold text-text-primary mb-2 hover:text-primary cursor-pointer">
                      {topic?.title}
                    </h4>

                    <p className="font-body text-sm text-text-secondary mb-3">{topic?.excerpt}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={14} className="text-text-secondary" />
                      <span className="font-cta-medium text-text-primary">{topic?.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={14} className="text-text-secondary" />
                      <span className="text-text-secondary">{topic?.region}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={14} className="text-text-secondary" />
                      <span className="text-text-secondary">{topic?.replies}</span>
                    </div>
                    <span className="text-text-secondary">{topic?.lastActivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'citizen-science' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mb-6">
              <h4 className="font-headline text-lg font-bold text-text-primary mb-2">{citizenScience?.intro?.title}</h4>
              <p className="font-body text-text-secondary mb-4">{citizenScience?.intro?.description}</p>
              <Button variant="default" iconName="UserPlus" iconPosition="left">
                {citizenScience?.intro?.button}
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {citizenScience?.projects?.map((project) => (
                <div key={project?.id} className="bg-muted rounded-lg p-5 interactive-lift">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-headline text-lg font-bold text-text-primary">{project?.title}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-cta-medium ${
                        project?.difficulty === 'Easy'
                          ? 'bg-success/20 text-success'
                          : project?.difficulty === 'Medium'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-error/20 text-error'
                      }`}
                    >
                      {project?.difficultyLabel ?? project?.difficulty}
                    </span>
                  </div>

                  <p className="font-body text-sm text-text-secondary mb-4">{project?.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-background rounded">
                      <div className="font-headline text-lg font-bold text-primary">{project?.participants}</div>
                      <div className="font-body text-xs text-text-secondary">{citizenScience?.labels?.participants ?? 'Participants'}</div>
                    </div>
                    <div className="text-center p-2 bg-background rounded">
                      <div className="font-headline text-lg font-bold text-secondary">{project?.dataPoints}</div>
                      <div className="font-body text-xs text-text-secondary">{citizenScience?.labels?.dataPoints ?? 'Data points'}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-body text-text-secondary">{citizenScience?.labels?.time ?? 'Time commitment'}:</span>
                      <span className="font-cta-medium text-text-primary">{project?.timeCommitment}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-body text-text-secondary">{citizenScience?.labels?.region ?? 'Region'}:</span>
                      <span className="font-cta-medium text-text-primary">{project?.region}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="font-body text-sm text-text-secondary mb-2">{citizenScience?.labels?.tools ?? 'Tools needed'}:</div>
                    <div className="flex flex-wrap gap-1">
                      {project?.tools?.map((tool, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded p-3 mb-4">
                    <div className="font-cta-medium text-sm text-text-primary mb-1">{citizenScience?.labels?.impact ?? 'Impact'}:</div>
                    <div className="font-body text-xs text-text-secondary">{project?.impact}</div>
                  </div>

                  <Button variant="outline" fullWidth iconName="ArrowRight" iconPosition="right">
                    {citizenScience?.labels?.learnMore ?? 'Learn more & join'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-ocean-light/10 to-ocean-deep/10 rounded-lg p-5">
              <h4 className="font-headline text-lg font-bold text-text-primary mb-4">{citizenScience?.observationForm?.title}</h4>
              <form onSubmit={handleObservationSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label={citizenScience?.observationForm?.fields?.location?.label}
                    placeholder={citizenScience?.observationForm?.fields?.location?.placeholder}
                    value={newObservation?.location}
                    onChange={(event) => setNewObservation({ ...newObservation, location: event?.target?.value })}
                    required
                  />
                  <Input
                    label={citizenScience?.observationForm?.fields?.category?.label}
                    placeholder={citizenScience?.observationForm?.fields?.category?.placeholder}
                    value={newObservation?.category}
                    onChange={(event) => setNewObservation({ ...newObservation, category: event?.target?.value })}
                    required
                  />
                </div>
                <Input
                  label={citizenScience?.observationForm?.fields?.observation?.label}
                  placeholder={citizenScience?.observationForm?.fields?.observation?.placeholder}
                  value={newObservation?.observation}
                  onChange={(event) => setNewObservation({ ...newObservation, observation: event?.target?.value })}
                  required
                />
                <Button type="submit" variant="default" iconName="Send" iconPosition="left">
                  {citizenScience?.observationForm?.submit}
                </Button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-headline text-lg font-bold text-text-primary">{alerts?.title}</h4>
                <p className="font-body text-sm text-text-secondary">{alerts?.subtitle}</p>
              </div>
              <Button variant="outline" iconName="Settings" iconPosition="left" size="sm">
                {alerts?.preferences}
              </Button>
            </div>

            {alerts?.alerts?.map((alert) => (
              <div key={alert?.id} className={`rounded-lg border p-4 ${getSeverityColor(alert?.severity)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon
                      name={
                        alert?.type === 'weather'
                          ? 'Cloud'
                          : alert?.type === 'marine-life'
                          ? 'Fish'
                          : 'Droplets'
                      }
                      size={20}
                      className="flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-headline text-lg font-bold">{alert?.title}</h4>
                      <div className="flex items-center space-x-2 text-sm mt-1">
                        <Icon name="MapPin" size={12} />
                        <span>{alert?.region}</span>
                        <span>•</span>
                        <span>{alert?.source}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-cta-medium ${
                      alert?.severity === 'high'
                        ? 'bg-error text-error-foreground'
                        : alert?.severity === 'medium'
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-success text-success-foreground'
                    }`}
                  >
                    {alert?.severityLabel ?? alert?.severity?.toUpperCase()}
                  </span>
                </div>

                <p className="font-body text-sm mb-3">{alert?.message}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} />
                    <span>
                      {alerts?.labels?.validUntil ?? 'Valid until'}: {new Date(alert.validUntil)?.toLocaleString()}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" iconName="Share" iconPosition="left">
                    {alerts?.share}
                  </Button>
                </div>
              </div>
            ))}

            <div className="bg-muted rounded-lg p-4 text-center">
              <Icon name="Bell" size={32} className="text-text-secondary mx-auto mb-3" />
              <h4 className="font-headline text-lg font-bold text-text-primary mb-2">{alerts?.stayInformed?.title}</h4>
              <p className="font-body text-sm text-text-secondary mb-4">{alerts?.stayInformed?.description}</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="default" iconName="Smartphone" iconPosition="left">
                  {alerts?.stayInformed?.primary?.label}
                </Button>
                <Button variant="outline" iconName="Mail" iconPosition="left">
                  {alerts?.stayInformed?.secondary?.label}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-headline text-lg font-bold text-text-primary">{events?.title}</h4>
                <p className="font-body text-sm text-text-secondary">{events?.subtitle}</p>
              </div>
              <Button variant="default" iconName="Calendar" iconPosition="left">
                {events?.calendar}
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {events?.events?.map((event) => {
                const isFull = event?.registered >= event?.capacity;
                const progress = Math.min((event?.registered / event?.capacity) * 100, 100);

                return (
                  <div key={event?.id} className="bg-muted rounded-lg p-5 interactive-lift">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-cta-medium ${
                            event?.type === 'Workshop'
                              ? 'bg-primary/20 text-primary'
                              : event?.type === 'Training'
                              ? 'bg-secondary/20 text-secondary'
                              : 'bg-accent/20 text-accent'
                          }`}
                        >
                          {event?.typeLabel ?? event?.type}
                        </span>
                        <h4 className="font-headline text-lg font-bold text-text-primary mt-2">{event?.title}</h4>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="Calendar" size={14} className="text-text-secondary" />
                        <span className="font-body text-text-secondary">{new Date(event.date)?.toLocaleDateString()}</span>
                        <span className="text-text-secondary">•</span>
                        <span className="font-body text-text-secondary">{event?.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="MapPin" size={14} className="text-text-secondary" />
                        <span className="font-body text-text-secondary">{event?.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="Users" size={14} className="text-text-secondary" />
                        <span className="font-body text-text-secondary">{event?.audience}</span>
                      </div>
                    </div>

                    <p className="font-body text-sm text-text-secondary mb-4">{event?.description}</p>

                    <div className="bg-background rounded p-3 mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-body text-text-secondary">{events?.statsLabels?.facilitator}:</span>
                        <span className="font-cta-medium text-text-primary">{event?.facilitator}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-body text-text-secondary">{events?.statsLabels?.registration}:</span>
                        <span className="font-cta-medium text-text-primary">
                          {event?.registered}/{event?.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-ocean"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button
                      variant={isFull ? 'outline' : 'default'}
                      fullWidth
                      iconName={isFull ? 'Clock' : 'UserPlus'}
                      iconPosition="left"
                      disabled={isFull}
                    >
                      {isFull ? events?.buttons?.waitlist : events?.buttons?.register}
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-ocean-deep/10 to-ocean-medium/10 rounded-lg p-6 text-center">
              <Icon name="Calendar" size={32} className="text-primary mx-auto mb-3" />
              <h4 className="font-headline text-lg font-bold text-text-primary mb-2">{events?.footer?.title}</h4>
              <p className="font-body text-text-secondary mb-4">{events?.footer?.description}</p>
              <Button variant="default" iconName="Plus" iconPosition="left">
                {events?.footer?.button}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityEngagement;
