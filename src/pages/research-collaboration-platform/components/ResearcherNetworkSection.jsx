import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import researchService from '../../../services/researchService';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ResearcherNetworkSection = ({ researchers: initialResearchers = [], loading: initialLoading = false, searchQuery = '', onSearchChange }) => {
  const { t } = useTranslation('collaboration');
  const [researchers, setResearchers] = useState(initialResearchers);
  const [loading, setLoading] = useState(initialLoading);
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showProfileModal, setShowProfileModal] = useState(null);
  
  const { user, isAuthenticated } = useAuth();

  const resultsText = t('network.results', {
    count: researchers?.length || 0,
    defaultValue: '{{count}} researchers found'
  });
  const signinConnectAlert = t('network.alerts.signinConnect', { defaultValue: 'Please sign in to send connection requests' });
  const connectSuccessText = t('network.alerts.connectSuccess', { defaultValue: 'Connection request sent successfully!' });

  const titleText = t('network.title', { defaultValue: 'Researcher Network' });
  const descriptionText = t('network.description', { defaultValue: 'Connect with marine scientists and researchers from around the world' });
  const inviteText = t('network.invite', { defaultValue: 'Invite Researcher' });
  const searchPlaceholderText = t('network.searchPlaceholder', { defaultValue: 'Search researchers...' });
  const expertisePlaceholderText = t('network.expertisePlaceholder', { defaultValue: 'Filter by expertise' });
  const institutionPlaceholderText = t('network.institutionPlaceholder', { defaultValue: 'Filter by institution' });
  const rolePlaceholderText = t('network.rolePlaceholder', { defaultValue: 'Filter by role' });
  const loadingText = t('network.loading', { defaultValue: 'Searching...' });
  const advancedFiltersText = t('network.advancedFilters', { defaultValue: 'Advanced Filters' });
  const refreshText = t('network.refresh', { defaultValue: 'Refresh' });
  const emptyTitleText = t('network.emptyTitle', { defaultValue: 'No researchers found' });
  const emptyDescriptionText = t('network.emptyDescription', { defaultValue: 'Try adjusting your search criteria or filters' });
  const resetText = t('network.reset', { defaultValue: 'Reset Search' });
  const connectText = t('network.connect', { defaultValue: 'Connect' });
  const viewProfileText = t('network.viewProfile', { defaultValue: 'View Profile' });
  const profileCopy = {
    about: t('network.profile.about', { defaultValue: 'About' }),
    expertise: t('network.profile.expertise', { defaultValue: 'Expertise Areas' }),
    impact: t('network.profile.impact', { defaultValue: 'Research Impact' }),
    publications: t('network.profile.publications', { defaultValue: 'Publications' }),
    citations: t('network.profile.citations', { defaultValue: 'Citations' }),
    collaborations: t('network.profile.collaborations', { defaultValue: 'Collaborations' }),
    hIndex: t('network.profile.hIndex', { defaultValue: 'H-Index' }),
    level: t('network.profile.level', { defaultValue: 'Level' }),
    lead: t('network.profile.lead', { defaultValue: 'Lead Researcher' }),
    sendConnection: t('network.profile.sendConnection', { defaultValue: 'Send Connection Request' }),
    sendMessage: t('network.profile.sendMessage', { defaultValue: 'Send Message' })
  };
  const metricsCopy = {
    publications: t('network.metrics.publications', { defaultValue: 'Publications' }),
    citations: t('network.metrics.citations', { defaultValue: 'Citations' }),
    collaborations: t('network.metrics.collaborations', { defaultValue: 'Collaborations' }),
    hIndex: t('network.metrics.hIndex', { defaultValue: 'H-Index' })
  };

  const anonymousResearcher = t('network.card.anonymous', { defaultValue: 'Anonymous Researcher' });
  const institutionFallback = t('network.card.institution', { defaultValue: 'Institution' });
  const bioFallback = t('network.card.bioFallback', { defaultValue: 'Marine science researcher focused on ocean conservation and sustainable development.' });
  const moreLabelTemplate = t('network.card.more', { defaultValue: '+{{count}} more' });

  useEffect(() => {
    if (searchQuery !== localSearchQuery) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (localSearchQuery !== searchQuery && onSearchChange) {
      onSearchChange(localSearchQuery);
    }
    searchResearchers();
  }, [localSearchQuery, selectedExpertise, selectedInstitution, selectedRole]);

  const searchResearchers = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedRole !== 'all') filters.role = selectedRole;
      if (selectedInstitution !== 'all') filters.institution = selectedInstitution;

      const { data, error } = await researchService?.profiles?.search(localSearchQuery, filters);
      if (!error && data) {
        let filteredResearchers = data;
        
        // Filter by expertise area if selected
        if (selectedExpertise !== 'all') {
          filteredResearchers = data?.filter(researcher => 
            researcher?.user_expertise?.some(exp => 
              exp?.expertise_area?.division?.name?.toLowerCase()?.includes(selectedExpertise?.toLowerCase())
            )
          );
        }
        
        setResearchers(filteredResearchers);
      }
    } catch (error) {
      console.error('Error searching researchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const expertiseOptions = useMemo(() => {
    const options = t('network.filters.expertise', { returnObjects: true });
    if (Array.isArray(options) && options.length) {
      return options;
    }
    return [
      { value: 'all', label: 'All Expertise Areas' },
      { value: 'marine-biology', label: 'Marine Biology' },
      { value: 'oceanography', label: 'Oceanography' },
      { value: 'coastal-engineering', label: 'Coastal Engineering' },
      { value: 'fisheries', label: 'Fisheries Science' },
      { value: 'marine-technology', label: 'Marine Technology' },
      { value: 'environmental-science', label: 'Environmental Science' }
    ];
  }, [t]);

  const institutionOptions = useMemo(() => {
    const options = t('network.filters.institutions', { returnObjects: true });
    if (Array.isArray(options) && options.length) {
      return options;
    }
    return [
      { value: 'all', label: 'All Institutions' },
      { value: 'university', label: 'Universities' },
      { value: 'government', label: 'Government Agencies' },
      { value: 'private', label: 'Private Research' },
      { value: 'ngo', label: 'NGOs & Foundations' }
    ];
  }, [t]);

  const roleOptions = useMemo(() => {
    const options = t('network.filters.roles', { returnObjects: true });
    if (Array.isArray(options) && options.length) {
      return options;
    }
    return [
      { value: 'all', label: 'All Roles' },
      { value: 'senior_researcher', label: 'Senior Researcher' },
      { value: 'researcher', label: 'Researcher' },
      { value: 'postdoc', label: 'Postdoc' },
      { value: 'phd_student', label: 'PhD Student' }
    ];
  }, [t]);

  const handleConnectRequest = async (researcherId) => {
    if (!isAuthenticated) {
      alert(signinConnectAlert);
      return;
    }
    
    // Mock connection request - would implement actual logic
    alert(connectSuccessText);
  };

  const ResearcherCard = ({ researcher }) => (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="User" size={24} className="text-text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-cta text-lg font-semibold text-text-primary mb-1 truncate">
                {researcher?.full_name || anonymousResearcher}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-text-secondary mb-2">
                <Icon name="Building" size={14} />
                <span className="truncate">{researcher?.institution || institutionFallback}</span>
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {researcher?.role?.replace('_', ' ')?.toUpperCase() || 'RESEARCHER'}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="UserPlus"
              iconPosition="left"
              onClick={() => handleConnectRequest(researcher?.id)}
            >
              {connectText}
          </Button>
          </div>
          
          <p className="font-body text-sm text-text-secondary mb-4 line-clamp-2">
            {researcher?.bio || bioFallback}
          </p>
          
          {researcher?.user_expertise?.length > 0 && (
            <div className="mb-4">
              <div className="font-cta text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
                {profileCopy.expertise.toUpperCase()}
              </div>
              <div className="flex flex-wrap gap-1">
                {researcher?.user_expertise?.slice(0, 3)?.map((exp, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-muted text-text-secondary text-xs rounded-md"
                  >
                    {exp?.expertise_area?.name}
                  </span>
                ))}
                {researcher?.user_expertise?.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 bg-muted text-text-secondary text-xs rounded-md">
                    {moreLabelTemplate.replace('{{count}}', researcher?.user_expertise?.length - 3)}
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Icon name="FileText" size={14} />
                <span>{Math.floor(Math.random() * 50) + 5} {metricsCopy.publications}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Quote" size={14} />
                <span>{Math.floor(Math.random() * 500) + 50} {metricsCopy.citations}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="Eye"
              onClick={() => setShowProfileModal(researcher)}
            >
              {viewProfileText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileModal = ({ researcher, onClose }) => {
    if (!researcher) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={32} className="text-text-secondary" />
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
                    {researcher?.full_name}
                  </h2>
                  <div className="flex items-center space-x-2 text-text-secondary mb-2">
                    <Icon name="Building" size={16} />
                    <span>{researcher?.institution}</span>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {researcher?.role?.replace('_', ' ')?.toUpperCase()}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">{profileCopy.about}</h3>
                <p className="font-body text-text-secondary leading-relaxed">
                  {researcher?.bio || t('network.profile.bioFallback', { defaultValue: 'Experienced marine researcher dedicated to advancing ocean science through collaborative research and innovative approaches to marine conservation.' })}
                </p>
              </div>
              
              {researcher?.user_expertise?.length > 0 && (
                <div>
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">{profileCopy.expertise}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {researcher?.user_expertise?.map((exp, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Icon name="Award" size={16} className="text-primary" />
                        <div>
                          <div className="font-cta text-sm font-medium text-text-primary">
                            {exp?.expertise_area?.name}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {(exp?.level?.charAt(0)?.toUpperCase() + exp?.level?.slice(1)) || ''} {profileCopy.level}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">{profileCopy.impact}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-headline text-2xl font-bold text-primary">
                      {Math.floor(Math.random() * 50) + 5}
                    </div>
                    <div className="text-xs text-text-secondary">{metricsCopy.publications}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-headline text-2xl font-bold text-success">
                      {Math.floor(Math.random() * 500) + 50}
                    </div>
                    <div className="text-xs text-text-secondary">{metricsCopy.citations}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-headline text-2xl font-bold text-accent">
                      {Math.floor(Math.random() * 20) + 3}
                    </div>
                    <div className="text-xs text-text-secondary">{metricsCopy.collaborations}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-headline text-2xl font-bold text-coral-warm">
                      {Math.floor(Math.random() * 10) + 2}
                    </div>
                    <div className="text-xs text-text-secondary">{metricsCopy.hIndex}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button
                  variant="default"
                  className="flex-1"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={() => handleConnectRequest(researcher?.id)}
                >
                  {profileCopy.sendConnection}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  iconName="MessageCircle"
                  iconPosition="left"
                >
                  {profileCopy.sendMessage}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
            {titleText}
          </h2>
          <p className="font-body text-text-secondary">
            {descriptionText}
          </p>
        </div>
        <Button variant="default" iconName="Plus" iconPosition="left">
          {inviteText}
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder={searchPlaceholderText}
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e?.target?.value)}
          />
          <Select
            options={expertiseOptions}
            value={selectedExpertise}
            onChange={setSelectedExpertise}
            placeholder={expertisePlaceholderText}
          />
          <Select
            options={institutionOptions}
            value={selectedInstitution}
            onChange={setSelectedInstitution}
            placeholder={institutionPlaceholderText}
          />
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder={rolePlaceholderText}
          />
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            {loading ? loadingText : resultsText}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Filter">
              {advancedFiltersText}
            </Button>
            <Button variant="ghost" size="sm" iconName="RefreshCw" onClick={searchResearchers}>
              {refreshText}
            </Button>
          </div>
        </div>
      </div>

      {/* Researchers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6]?.map((item) => (
            <div key={item} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-2 w-2/3"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : researchers?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {researchers?.map((researcher) => (
            <ResearcherCard key={researcher?.id} researcher={researcher} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Users" size={24} className="text-text-secondary" />
          </div>
          <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
            {emptyTitleText}
          </h3>
          <p className="font-body text-text-secondary mb-6">
            {emptyDescriptionText}
          </p>
          <Button variant="outline" iconName="RefreshCw" onClick={searchResearchers}>
            {resetText}
          </Button>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal researcher={showProfileModal} onClose={() => setShowProfileModal(null)} />
    </div>
  );
};

export default ResearcherNetworkSection;
