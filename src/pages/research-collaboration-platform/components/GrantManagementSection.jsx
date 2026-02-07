import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import researchService from '../../../services/researchService';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const formatString = (template, replacements = {}) => {
  if (typeof template !== 'string') {
    return '';
  }
  return Object.entries(replacements).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), String(value)),
    template
  );
};

const formatDateValue = (value, fallback) => {
  if (!value) {
    return fallback;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }
  return parsed.toLocaleDateString();
};

const calculateDaysRemaining = (deadline) => {
  if (!deadline) {
    return null;
  }
  const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (!Number.isFinite(diff)) {
    return null;
  }
  return Math.max(diff, 0);
};

const formatCurrencyValue = (amount, fallback) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return fallback;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
};

const GrantManagementSection = ({ grants: initialGrants = [], loading: initialLoading = false, user }) => {
  const [grants, setGrants] = useState(initialGrants);
  const [availableGrants, setAvailableGrants] = useState([]);
  const [loading, setLoading] = useState(initialLoading);
  const [activeTab, setActiveTab] = useState('opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState(null);

  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('collaboration');

  const grantCopy = t('grants', { returnObjects: true }) || {};
  const headingText = grantCopy.heading || 'Blue Funding Studio';
  const descriptionText = grantCopy.description ||
    'Track active applications, uncover new opportunities, and coordinate submissions with your research partners.';
  const filtersCopy = grantCopy.filters || {};
  const tabsCopy = grantCopy.tabs || {};
  const labels = grantCopy.labels || {};
  const opportunityCopy = grantCopy.opportunity || {};
  const myLabels = grantCopy.my || {};
  const detailCopy = grantCopy.detail || {};
  const alerts = grantCopy.alerts || {};
  const applicationCopy = grantCopy.application || {};

  const fallbackStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const fallbackCategoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'conservation', label: 'Conservation' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'climate', label: 'Climate Research' },
    { value: 'technology', label: 'Technology Development' },
    { value: 'education', label: 'Education & Outreach' }
  ];

  const statusOptions = useMemo(() => (
    Array.isArray(grantCopy.statusOptions) && grantCopy.statusOptions.length
      ? grantCopy.statusOptions
      : fallbackStatusOptions
  ), [grantCopy]);

  const categoryOptions = useMemo(() => (
    Array.isArray(grantCopy.categoryOptions) && grantCopy.categoryOptions.length
      ? grantCopy.categoryOptions
      : fallbackCategoryOptions
  ), [grantCopy]);

  const statusLabelMap = useMemo(() => {
    const map = {};
    statusOptions.forEach((option) => {
      if (option?.value) {
        map[option.value] = option.label;
      }
    });
    return map;
  }, [statusOptions]);

  const categoryLabelMap = useMemo(() => {
    const map = {};
    categoryOptions.forEach((option) => {
      if (option?.value) {
        map[option.value] = option.label;
      }
    });
    return map;
  }, [categoryOptions]);

  const defaultTbd = labels?.tbd || 'TBD';

  const formatStatus = (status) => statusLabelMap[status] || status?.replace('_', ' ')?.toUpperCase() || defaultTbd;
  const formatCategory = (category) => categoryLabelMap[category] || category;
  const formatGrantCount = (count) => formatString(labels?.count, { count }) || `${count} grants`;
  const formatApplications = (count) => formatString(labels?.applications, { count }) || `${count} applications received`;
  const formatSuccessRate = (rate) => formatString(labels?.successRate, { rate }) || rate || '0%';
  const formatCollaboratorCount = (count) => formatString(labels?.collaboratorCount, { count }) || `${count} collaborators`;
  const formatMoreInvestigators = (count) => formatString(labels?.moreInvestigators, { count }) || `+${count} more`;
  const formatDeadlineText = (deadline) => {
    const days = calculateDaysRemaining(deadline);
    const value = typeof days === 'number' ? days : defaultTbd;
    return formatString(labels?.deadline, { days: value }) || `Deadline: ${value} days left`;
  };
  const formatDaysRemaining = (deadline) => {
    const days = calculateDaysRemaining(deadline);
    const value = typeof days === 'number' ? days : defaultTbd;
    return formatString(labels?.daysRemaining, { days: value }) || `${value} days`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-success bg-success/10';
      case 'submitted':
        return 'text-primary bg-primary/10';
      case 'under_review':
        return 'text-accent bg-accent/10';
      case 'rejected':
        return 'text-destructive bg-destructive/10';
      case 'draft':
        return 'text-text-secondary bg-muted';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'conservation':
        return 'text-success bg-success/10';
      case 'environmental':
        return 'text-accent bg-accent/10';
      case 'climate':
        return 'text-warning bg-warning/10';
      case 'technology':
        return 'text-primary bg-primary/10';
      case 'education':
        return 'text-cyan-300/80 bg-cyan-500/10';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  useEffect(() => {
    loadAvailableGrants();
    if (isAuthenticated && user?.id) {
      loadUserGrants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadAvailableGrants = () => {
    const mockGrants = [
      {
        id: 1,
        title: 'Marine Biodiversity Conservation Initiative',
        funder: 'National Science Foundation',
        deadline: '2024-12-15',
        total_amount: 750000,
        duration_months: 36,
        category: 'conservation',
        description: 'Comprehensive study of marine biodiversity hotspots and development of conservation strategies for endangered marine species.',
        eligibility: ['PhD required', '2+ years experience', 'International collaboration'],
        requirements: ['Research proposal', 'Budget justification', 'Team CV', 'Letters of support'],
        contact_person: 'Dr. Maria Santos',
        contact_email: 'm.santos@nsf.gov',
        applications_count: 23,
        success_rate: '15%'
      },
      {
        id: 2,
        title: 'Ocean Plastic Pollution Research Grant',
        funder: 'Environmental Protection Agency',
        deadline: '2024-11-30',
        total_amount: 425000,
        duration_months: 24,
        category: 'environmental',
        description: 'Investigation of microplastic impact on marine ecosystems and development of innovative removal technologies.',
        eligibility: ['Environmental Science background', 'Lab facilities required', 'Multi-institutional'],
        requirements: ['Technical proposal', 'Environmental impact assessment', 'Collaboration agreements'],
        contact_person: 'Prof. David Chen',
        contact_email: 'd.chen@epa.gov',
        applications_count: 31,
        success_rate: '22%'
      },
      {
        id: 3,
        title: 'Coastal Climate Adaptation Fund',
        funder: 'Department of Climate Research',
        deadline: '2025-01-20',
        total_amount: 950000,
        duration_months: 48,
        category: 'climate',
        description: 'Development of coastal adaptation strategies and technologies to address sea-level rise and extreme weather events.',
        eligibility: ['Climate science expertise', 'Coastal engineering experience', 'Community engagement'],
        requirements: ['Comprehensive proposal', 'Community impact plan', 'Technology roadmap'],
        contact_person: 'Dr. Sarah Williams',
        contact_email: 's.williams@dcr.gov',
        applications_count: 18,
        success_rate: '12%'
      }
    ];
    setAvailableGrants(mockGrants);
  };

  const loadUserGrants = async () => {
    if (!user?.id) {
      return;
    }

    try {
      const { data, error } = await researchService?.grants?.getUserGrants(user?.id);
      if (!error && data) {
        setGrants(data);
      }
    } catch (error) {
      console.error('Error loading user grants:', error);
    } finally {
      setLoading(false);
    }
  };

  const GrantOpportunityCard = ({ grant }) => {
    const dueText = formatString(opportunityCopy.due || labels?.due, {
      date: formatDateValue(grant?.deadline, defaultTbd)
    }) || `Due ${formatDateValue(grant?.deadline, defaultTbd)}`;
    const durationText = formatString(opportunityCopy.duration || labels?.duration, {
      months: grant?.duration_months ?? 0
    }) || `${grant?.duration_months ?? 0} months`;
    const totalAwardLabel = labels?.totalAward || 'Total Award';
    const totalAwardValue = formatCurrencyValue(grant?.total_amount, defaultTbd);
    const viewLabel = opportunityCopy.view || labels?.viewDetails || 'View Details';
    const applyLabel = opportunityCopy.apply || labels?.applyShort || labels?.apply || 'Apply';
    const applicationsText = formatApplications(grant?.applications_count ?? 0);
    const successRateText = formatSuccessRate(grant?.success_rate);
    const daysRemainingText = formatDeadlineText(grant?.deadline);
    const durationLabel = labels?.durationLabel || 'Duration';
    const deadlineLabel = labels?.deadlineLabel || 'Application Deadline';

    const handleApply = () => {
      if (!isAuthenticated) {
        alert(alerts?.signinApply || 'Please sign in to apply for grants');
        return;
      }
      setSelectedGrant(grant);
      setShowApplicationModal(true);
    };

    return (
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-cta text-lg font-semibold text-text-primary">
                {grant?.title}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(grant?.category)}`}>
                {formatCategory(grant?.category)}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="Building" size={14} />
                <span>{grant?.funder}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{dueText}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{durationText}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-headline text-xl font-bold text-primary">
              {totalAwardValue}
            </div>
            <div className="text-xs text-text-secondary">{totalAwardLabel}</div>
          </div>
        </div>

        {grant?.description && (
          <p className="font-body text-sm text-text-secondary mb-4 line-clamp-3">
            {grant.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="font-cta text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
              {labels?.eligibility || 'Key Eligibility'}
            </div>
            <ul className="space-y-1">
              {grant?.eligibility?.slice(0, 2)?.map((req, index) => (
                <li key={index} className="text-sm text-text-secondary flex items-start space-x-2">
                  <Icon name="Check" size={12} className="text-success mt-1 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-cta text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
              {labels?.competition || 'Competition Stats'}
            </div>
            <div className="space-y-1">
              <div className="text-sm text-text-secondary">
                {formatApplications(grant?.applications_count ?? 0)}
              </div>
              <div className="text-sm text-text-secondary">
                {formatSuccessRate(grant?.success_rate)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="space-y-1 text-xs text-text-secondary">
            <div>
              <span className="font-medium text-text-primary">{deadlineLabel}: </span>
              {formatDateValue(grant?.deadline, defaultTbd)}
            </div>
            <div>
              <span className="font-medium text-text-primary">{durationLabel}: </span>
              {durationText}
            </div>
            <div>{daysRemainingText}</div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Eye"
              onClick={() => setSelectedGrant(grant)}
            >
              {viewLabel}
            </Button>
            <Button
              variant={isAuthenticated ? 'default' : 'ghost'}
              size="sm"
              iconName={isAuthenticated ? 'Send' : 'LogIn'}
              iconPosition="left"
              onClick={handleApply}
            >
              {isAuthenticated ? applyLabel : labels?.signin || 'Sign in to apply'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const MyGrantCard = ({ grant }) => {
    const appliedText = formatString(labels?.appliedOn, {
      date: formatDateValue(grant?.created_at, defaultTbd)
    }) || `Applied ${formatDateValue(grant?.created_at, defaultTbd)}`;
    const requestedAmount = formatString(labels?.requestedAmount, {
      amount: grant?.requested_amount ? (grant.requested_amount / 1000).toFixed(0) : '0'
    }) || `${formatCurrencyValue(grant?.requested_amount, defaultTbd)} requested`;
    const awardPeriodText = formatString(labels?.awardPeriod, {
      start: formatDateValue(grant?.award_period_start, defaultTbd),
      end: formatDateValue(grant?.award_period_end, defaultTbd)
    });
    const lastUpdatedText = formatString(labels?.lastUpdated, {
      date: formatDateValue(grant?.updated_at || grant?.created_at, defaultTbd)
    }) || `Last updated: ${formatDateValue(grant?.updated_at || grant?.created_at, defaultTbd)}`;
    const coInvestigators = grant?.grant_co_investigators || [];
    const extraInvestigators = coInvestigators.length > 4 ? coInvestigators.length - 4 : 0;

    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-cta text-lg font-semibold text-text-primary">
                {grant?.title || myLabels.title || 'Grant Application'}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(grant?.status)}`}>
                {formatStatus(grant?.status)}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{appliedText}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="DollarSign" size={14} />
                <span>{requestedAmount}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            {grant?.award_amount && (
              <>
                <div className="font-headline text-xl font-bold text-success">
                  {formatCurrencyValue(grant.award_amount, defaultTbd)}
                </div>
                <div className="text-xs text-text-secondary">{labels?.awardAmount || 'Awarded'}</div>
              </>
            )}
          </div>
        </div>

        {grant?.description && (
          <p className="font-body text-sm text-text-secondary mb-4 line-clamp-2">
            {grant.description}
          </p>
        )}

        {grant?.project && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="font-cta text-sm font-medium text-text-primary mb-1">
              {labels?.associatedProject || 'Associated Project'}
            </div>
            <div className="text-sm text-text-secondary">
              {grant.project.title}
            </div>
          </div>
        )}

        {coInvestigators.length > 0 && (
          <div className="mb-4">
            <div className="font-cta text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
              {labels?.coInvestigators || 'Co-Investigators'}
            </div>
            <div className="flex -space-x-2">
              {coInvestigators.slice(0, 4).map((investigator, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-muted border-2 border-card rounded-full flex items-center justify-center text-xs font-medium text-text-secondary"
                  title={investigator?.user?.full_name}
                >
                  {investigator?.user?.full_name?.charAt(0) || 'U'}
                </div>
              ))}
              {extraInvestigators > 0 && (
                <div
                  className="w-8 h-8 bg-muted border-2 border-card rounded-full flex items-center justify-center text-xs font-medium text-text-secondary"
                  title={formatMoreInvestigators(extraInvestigators)}
                >
                  +{extraInvestigators}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-text-secondary">
            {grant?.status === 'approved'
              ? formatString(labels?.awardPeriod || 'Award period: {{start}} - {{end}}', {
                  start: formatDateValue(grant?.award_period_start, defaultTbd),
                  end: formatDateValue(grant?.award_period_end, defaultTbd)
                })
              : lastUpdatedText}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Eye"
              onClick={() => setSelectedGrant(grant)}
            >
              {myLabels.view || labels?.viewDetails || 'View Details'}
            </Button>
            {grant?.status === 'draft' && (
              <Button variant="outline" size="sm" iconName="Edit">
                {myLabels.edit || 'Edit'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const GrantDetailModal = ({ grant, onClose }) => {
    if (!grant) {
      return null;
    }

    const totalAwardValue = formatCurrencyValue(grant?.total_amount, defaultTbd);
    const durationText = formatString(labels?.duration, { months: grant?.duration_months ?? 0 })
      || `${grant?.duration_months ?? 0} months`;
    const deadlineValue = formatDateValue(grant?.deadline, defaultTbd);
    const remainingText = formatDaysRemaining(grant?.deadline);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h2 className="font-headline text-2xl font-bold text-text-primary">
                    {grant?.title}
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(grant?.category)}`}>
                    {formatCategory(grant?.category)}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-text-secondary mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Building" size={16} />
                    <span>{grant?.funder}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span>{formatString(labels?.due || 'Due {{date}}', { date: deadlineValue })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} />
                    <span>{durationText}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
            </div>

            <div className="space-y-6">
              {grant?.description && (
                <div>
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">
                    {detailCopy?.overviewHeading || 'Grant Details'}
                  </h3>
                  <p className="font-body text-text-secondary leading-relaxed">{grant.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="font-cta text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
                      {detailCopy?.eligibilityHeading || labels?.eligibility || 'Key Eligibility'}
                    </h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      {grant?.eligibility?.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Icon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="font-cta text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
                      {detailCopy?.requirementsHeading || labels?.requirements || 'Submission Requirements'}
                    </h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      {grant?.requirements?.map((req, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Icon name="FileText" size={16} className="text-primary mt-1 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="font-cta text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
                      {detailCopy?.overviewHeading || 'Grant Details'}
                    </h4>
                    <div className="space-y-3 text-sm text-text-secondary">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-text-secondary">
                          {labels?.totalAward || 'Total Award'}
                        </div>
                        <div className="font-headline text-2xl font-bold text-primary">{totalAwardValue}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-text-secondary">
                          {labels?.durationLabel || 'Duration'}
                        </div>
                        <div className="font-medium text-text-primary">{durationText}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-text-secondary">
                          {labels?.deadlineLabel || 'Application Deadline'}
                        </div>
                        <div className="font-medium text-text-primary">{deadlineValue}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-text-secondary">
                          {detailCopy?.remaining || 'Days Remaining'}
                        </div>
                        <div className="font-medium text-warning">{remainingText}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="font-cta text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
                      {detailCopy?.contactHeading || labels?.contact || 'Contact Information'}
                    </h4>
                    <div className="space-y-3 text-sm text-text-secondary">
                      <div className="flex items-center space-x-3">
                        <Icon name="User" size={16} className="text-text-secondary" />
                        <span>{grant?.contact_person}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="Mail" size={16} className="text-text-secondary" />
                        <span className="text-primary">{grant?.contact_email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="font-cta text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
                      {detailCopy?.competitionHeading || labels?.competition || 'Competition Statistics'}
                    </h4>
                    <div className="space-y-2 text-sm text-text-secondary">
                      <div>{formatApplications(grant?.applications_count ?? 0)}</div>
                      <div>{formatSuccessRate(grant?.success_rate)}</div>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    className="w-full"
                    iconName={isAuthenticated ? 'Send' : 'LogIn'}
                    iconPosition="left"
                    onClick={() => {
                      if (!isAuthenticated) {
                        alert(alerts?.signinApply || 'Please sign in to apply for grants');
                        return;
                      }
                      setShowApplicationModal(true);
                    }}
                  >
                    {isAuthenticated
                      ? detailCopy?.apply || labels?.applyForGrant || 'Apply for Grant'
                      : detailCopy?.signin || labels?.signin || 'Sign in to apply'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GrantApplicationModal = ({ grant, onClose }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      requested_amount: grant?.total_amount || '',
      duration_months: grant?.duration_months || '',
      co_investigators: '',
      project_id: ''
    });

    const handleSubmit = async (event) => {
      event?.preventDefault();
      if (!isAuthenticated || !user?.id) {
        alert(alerts?.signinApply || 'Please sign in to apply for grants');
        return;
      }

      try {
        const applicationData = {
          ...formData,
          principal_investigator_id: user?.id,
          status: 'draft',
          funder_name: grant?.funder,
          requested_amount: formData?.requested_amount ? parseInt(formData.requested_amount, 10) : null,
          duration_months: formData?.duration_months ? parseInt(formData.duration_months, 10) : null
        };

        const { data, error } = await researchService?.grants?.create(applicationData);
        if (!error && data) {
          alert(alerts?.applySaved || 'Grant application saved as draft!');
          onClose();
          loadUserGrants();
        } else {
          alert(alerts?.applyError || 'Error saving application. Please try again.');
        }
      } catch (error) {
        console.error('Error creating grant application:', error);
        alert(alerts?.applyError || 'Error saving application. Please try again.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-headline text-xl font-bold text-text-primary">
                  {applicationCopy?.title || 'Apply for Grant'}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {formatString(applicationCopy?.subtitle || '{{title}} - {{funder}}', {
                    title: grant?.title || '',
                    funder: grant?.funder || ''
                  })}
                </p>
              </div>
              <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={applicationCopy?.fields?.projectTitle || 'Project Title'}
                value={formData?.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e?.target?.value }))}
                required
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {applicationCopy?.fields?.projectDescription || 'Project Description'}
                </label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e?.target?.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder={applicationCopy?.placeholders?.description || 'Describe your research project, objectives, and expected outcomes...'}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label={applicationCopy?.fields?.requestedAmount || 'Requested Amount (USD)'}
                  value={formData?.requested_amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, requested_amount: e?.target?.value }))}
                  max={grant?.total_amount}
                  required
                />
                <Input
                  type="number"
                  label={applicationCopy?.fields?.duration || 'Project Duration (months)'}
                  value={formData?.duration_months}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration_months: e?.target?.value }))}
                  max={grant?.duration_months}
                  required
                />
              </div>

              <Input
                label={applicationCopy?.fields?.coInvestigators || 'Co-Investigators (comma-separated names)'}
                value={formData?.co_investigators}
                onChange={(e) => setFormData((prev) => ({ ...prev, co_investigators: e?.target?.value }))}
                placeholder={applicationCopy?.placeholders?.coInvestigators || 'Dr. Jane Smith, Prof. John Doe'}
              />

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm text-text-secondary">
                    <div className="font-medium text-text-primary mb-1">
                      {applicationCopy?.infoHeading || 'Next Steps:'}
                    </div>
                    <ol className="list-decimal list-inside space-y-1">
                      {(applicationCopy?.steps || [
                        'Your application will be saved as a draft',
                        'Complete all required documents and attachments',
                        'Review and submit before the deadline',
                        'Track your application status in "My Applications"'
                      ]).map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="default" className="flex-1">
                  {applicationCopy?.submit || 'Save Application Draft'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  {applicationCopy?.cancel || 'Cancel'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const currentGrants = activeTab === 'my' ? grants : availableGrants;
  const filteredGrants = currentGrants?.filter((grant) => {
    const matchesSearch = !searchQuery
      || grant?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      || grant?.funder?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = activeTab === 'my'
      ? selectedStatus === 'all' || grant?.status === selectedStatus
      : true;
    const matchesCategory = activeTab === 'opportunities'
      ? selectedCategory === 'all' || grant?.category === selectedCategory
      : true;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const emptyTitle = activeTab === 'my'
    ? labels?.noApplications || 'No applications yet'
    : labels?.noGrants || 'No grants found';
  const emptyDescription = activeTab === 'my'
    ? labels?.applicationsEmptyDescription || 'Start by applying for available grant opportunities'
    : labels?.opportunitiesEmptyDescription || 'Try adjusting your search criteria or filters';
  const browseLabel = labels?.browseOpportunities || 'Browse Opportunities';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">{headingText}</h2>
          <p className="font-body text-text-secondary">{descriptionText}</p>
        </div>
      </div>

      <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'opportunities' ? 'bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {(tabsCopy?.opportunities || 'Open opportunities')} ({availableGrants?.length || 0})
        </button>
        {isAuthenticated && (
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'my' ? 'bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {(tabsCopy?.myGrants || 'My applications')} ({grants?.length || 0})
          </button>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder={filtersCopy?.searchPlaceholder || 'Search grants...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          {activeTab === 'opportunities' ? (
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder={filtersCopy?.categoryPlaceholder || 'Filter by category'}
            />
          ) : (
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder={filtersCopy?.statusPlaceholder || 'Filter by status'}
            />
          )}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" iconName="Filter">
              {filtersCopy?.more || 'Advanced Filters'}
            </Button>
            <span className="text-sm text-text-secondary">{formatGrantCount(filteredGrants?.length || 0)}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-4" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded mb-4" />
              <div className="h-20 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : filteredGrants?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGrants.map((grant) => (
            activeTab === 'opportunities'
              ? <GrantOpportunityCard key={grant?.id} grant={grant} />
              : <MyGrantCard key={grant?.id} grant={grant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="DollarSign" size={24} className="text-text-secondary" />
          </div>
          <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">{emptyTitle}</h3>
          <p className="font-body text-text-secondary mb-6">{emptyDescription}</p>
          {activeTab === 'my' && (
            <Button variant="default" onClick={() => setActiveTab('opportunities')}>
              {browseLabel}
            </Button>
          )}
        </div>
      )}

      <GrantDetailModal grant={selectedGrant} onClose={() => setSelectedGrant(null)} />
      {showApplicationModal && selectedGrant && (
        <GrantApplicationModal
          grant={selectedGrant}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedGrant(null);
          }}
        />
      )}
    </div>
  );
};

export default GrantManagementSection;
