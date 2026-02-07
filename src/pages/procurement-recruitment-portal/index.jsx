import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Users,
  Upload,
  Calendar,
  Briefcase,
  Building,
  Clock,
  CheckCircle,
  Eye,
  User,
  Phone,
  Award,
  Settings,
  Bell,
  Send,
  AlertTriangle,
  Loader,
  X,
  RefreshCw,
  Sparkles,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Shield,
  Globe2,
  MapPin,
  Search
} from 'lucide-react';
import { ProcurementAuthProvider, useProcurementAuth } from '../../contexts/ProcurementAuthContext';
import { useTranslation } from 'react-i18next';
import {
  procurementService,
  recruitmentService,
  fileUploadService,
  dashboardService,
  vacancyIntegrationService,
  handleApiError
} from '../../services/procurementRecruitmentService';

// Import Enhanced Components
import EnhancedRegistration from './components/EnhancedRegistration';
import UserProfile from './components/UserProfile';
import SEOHead from '../../components/shared/SEOHead';

const ProcurementRecruitmentPortal = () => (
  <ProcurementAuthProvider>
    <PortalExperience />
  </ProcurementAuthProvider>
);

const PortalExperience = () => {
  const { t } = useTranslation('procurement');
  const translate = useCallback(
    (key, defaultValue, options = {}) => t(key, { defaultValue, ...options }),
    [t]
  );

  const modalCopy = useMemo(
    () => ({
      login: {
        badge: translate('modals.login.badge', 'Secure login'),
        title: translate('modals.login.title', 'Access your NARA workspace'),
        description: translate(
          'modals.login.description',
          'Sign in to continue submitting tenders and tracking applications.'
        ),
        emailLabel: translate('modals.login.emailLabel', 'Email address'),
        emailPlaceholder: translate('modals.login.emailPlaceholder', 'name@company.lk'),
        passwordLabel: translate('modals.login.passwordLabel', 'Password'),
        passwordPlaceholder: translate('modals.login.passwordPlaceholder', '••••••••'),
        submit: translate('modals.login.submit', 'Login'),
        submitting: translate('modals.login.submitting', 'Authenticating…'),
        switchPrompt: translate('modals.login.switchPrompt', 'New to the portal?'),
        switchCta: translate('modals.login.switchCta', 'Create a vendor or talent account')
      },
      registration: {
        badge: translate('modals.registration.badge', 'Create account'),
        title: translate('modals.registration.title', 'Join the NARA Partner Network'),
        description: translate(
          'modals.registration.description',
          'Register once to access both procurement notices and recruitment opportunities.'
        ),
        firstNameLabel: translate('modals.registration.firstNameLabel', 'First name'),
        lastNameLabel: translate('modals.registration.lastNameLabel', 'Last name'),
        emailLabel: translate('modals.registration.emailLabel', 'Email address'),
        phoneLabel: translate('modals.registration.phoneLabel', 'Phone number'),
        organizationLabel: translate('modals.registration.organizationLabel', 'Organization'),
        nicLabel: translate('modals.registration.nicLabel', 'NIC / Registration'),
        accountTypeLabel: translate('modals.registration.accountTypeLabel', 'Account type'),
        accountOptions: {
          vendor: translate('modals.registration.accountOptions.vendor', 'Vendor / Supplier'),
          consultant: translate('modals.registration.accountOptions.consultant', 'Consultant'),
          individual: translate('modals.registration.accountOptions.individual', 'Individual applicant')
        },
        passwordLabel: translate('modals.registration.passwordLabel', 'Password'),
        passwordPlaceholder: translate(
          'modals.registration.passwordPlaceholder',
          'Create a secure password'
        ),
        submit: translate('modals.registration.submit', 'Create account'),
        submitting: translate('modals.registration.submitting', 'Creating account…')
      },
      application: {
        uploading: translate('modals.application.uploading', 'Uploading supporting documents…'),
        shared: {
          cancel: translate('modals.application.shared.cancel', 'Cancel'),
          submitProposal: translate('modals.application.shared.submitProposal', 'Submit proposal'),
          submitApplication: translate(
            'modals.application.shared.submitApplication',
            'Submit application'
          ),
          submitting: translate('modals.application.shared.submitting', 'Submitting…'),
          upload: translate('modals.application.shared.upload', 'Upload'),
          separator: translate('modals.application.shared.separator', '•'),
          filesSuffix: translate('modals.application.shared.filesSuffix', 'files'),
          summaryDeadlineLabel: translate('modals.application.shared.summary.deadline', 'Deadline'),
          summaryDeadlineFallback: translate(
            'modals.application.shared.summary.deadlineFallback',
            'Refer notice'
          )
        },
        procurement: {
          summaryValueLabel: translate(
            'modals.application.procurement.summary.valueLabel',
            'Estimated value'
          ),
          summaryValueFallback: translate(
            'modals.application.procurement.summary.valueFallback',
            'Upon request'
          ),
          fields: {
            companyName: translate('modals.application.procurement.fields.companyName', 'Company name'),
            deliveryTimeline: translate(
              'modals.application.procurement.fields.deliveryTimeline',
              'Delivery timeline (weeks)'
            ),
            technical: translate('modals.application.procurement.fields.technical', 'Technical proposal'),
            financial: translate(
              'modals.application.procurement.fields.financial',
              'Financial proposal (LKR)'
            ),
            warranty: translate(
              'modals.application.procurement.fields.warranty',
              'Warranty period (months)'
            ),
            paymentTerms: translate(
              'modals.application.procurement.fields.paymentTerms',
              'Payment terms'
            ),
            additionalInformation: translate(
              'modals.application.procurement.fields.additionalInformation',
              'Additional information'
            )
          },
          placeholders: {
            technical: translate(
              'modals.application.procurement.placeholders.technical',
              'Outline methodology, deployment schedule, equipment specifications, and compliance measures.'
            ),
            paymentTerms: translate(
              'modals.application.procurement.placeholders.paymentTerms',
              'e.g., 30% advance, balance on commissioning'
            ),
            additionalInformation: translate(
              'modals.application.procurement.placeholders.additionalInformation',
              'Certifications, local partners, or clarifications'
            )
          },
          uploadLabel: translate(
            'modals.application.procurement.uploadLabel',
            'Upload required documents'
          ),
          fallbackDocuments: [
            translate(
              'modals.application.procurement.fallbackDocuments.companyProfile',
              'Company profile'
            ),
            translate(
              'modals.application.procurement.fallbackDocuments.financialStatements',
              'Financial statements'
            )
          ]
        },
        recruitment: {
          summaryDepartmentLabel: translate(
            'modals.application.recruitment.summary.departmentLabel',
            'Department'
          ),
          summaryDepartmentFallback: translate(
            'modals.application.recruitment.summary.departmentFallback',
            'NARA'
          ),
          summaryDeadlineLabel: translate(
            'modals.application.recruitment.summary.deadlineLabel',
            'Deadline'
          ),
          summaryDeadlineFallback: translate(
            'modals.application.recruitment.summary.deadlineFallback',
            'Refer notice'
          ),
          fields: {
            fullName: translate('modals.application.recruitment.fields.fullName', 'Full name'),
            email: translate('modals.application.recruitment.fields.email', 'Email address'),
            phone: translate('modals.application.recruitment.fields.phone', 'Phone number'),
            coverLetter: translate('modals.application.recruitment.fields.coverLetter', 'Cover letter'),
            portfolio: translate(
              'modals.application.recruitment.fields.portfolio',
              'LinkedIn profile / Portfolio'
            )
          },
          placeholders: {
            coverLetter: translate(
              'modals.application.recruitment.placeholders.coverLetter',
              'Share your motivation, expertise, and alignment with NARA’s mission.'
            ),
            portfolio: translate('modals.application.recruitment.placeholders.portfolio', 'https://')
          },
          uploadLabel: translate(
            'modals.application.recruitment.uploadLabel',
            'Upload supporting documents'
          ),
          fallbackDocuments: [
            translate('modals.application.recruitment.fallbackDocuments.cv', 'Curriculum Vitae'),
            translate(
              'modals.application.recruitment.fallbackDocuments.transcripts',
              'Academic transcripts'
            ),
            translate(
              'modals.application.recruitment.fallbackDocuments.certifications',
              'Professional certifications'
            )
          ]
        }
      }
    }),
    [translate]
  );

  const supportingDocumentLabel = translate(
    'modals.application.documents.supporting',
    'Supporting Document'
  );

  const recruitmentCopy = useMemo(
    () => ({
      heading: translate('recruitment.heading', 'Talent Hub'),
      description: translate(
        'recruitment.description',
        'Join multidisciplinary teams advancing ocean science, climate resilience, and digital innovation across Sri Lanka’s maritime economy.'
      ),
      filters: {
        focusLabel: translate('recruitment.filters.focusLabel', 'Focus area'),
        allOption: translate('recruitment.filters.allOption', 'All roles'),
        searchLabel: translate('recruitment.filters.searchLabel', 'Search'),
        searchPlaceholder: translate(
          'recruitment.filters.searchPlaceholder',
          'Search by title, division, or keyword…'
        ),
        statusLabel: translate('recruitment.filters.statusLabel', 'Status'),
        divisionLabel: translate('recruitment.filters.divisionLabel', 'Division'),
        gradeLabel: translate('recruitment.filters.gradeLabel', 'Grade'),
        allDivisions: translate('recruitment.filters.allDivisions', 'All divisions'),
        allGrades: translate('recruitment.filters.allGrades', 'All grades'),
        sortLabel: translate('recruitment.filters.sortLabel', 'Sort'),
        options: {
          deadline: translate('recruitment.filters.options.deadline', 'Closing soon'),
          salary: translate('recruitment.filters.options.salary', 'Highest salary'),
          recent: translate('recruitment.filters.options.recent', 'Recently posted')
        },
        statusOptions: {
          all: translate('recruitment.filters.statusOptions.all', 'All statuses'),
          Open: translate('recruitment.filters.statusOptions.open', 'Open'),
          'Under Review': translate(
            'recruitment.filters.statusOptions.review',
            'Under review'
          ),
          Closed: translate('recruitment.filters.statusOptions.closed', 'Closed')
        }
      },
      sidebar: {
        title: translate('recruitment.sidebar.title', 'Career Insights'),
        closingSoon: translate('recruitment.sidebar.closingSoon', 'Roles closing soon'),
        hybrid: translate('recruitment.sidebar.hybrid', 'Hybrid / remote options'),
        scholarship: translate('recruitment.sidebar.scholarship', 'Scholarship-linked positions'),
        support: {
          title: translate('recruitment.sidebar.support.title', 'Talent Concierge'),
          description: translate(
            'recruitment.sidebar.support.description',
            'Our HR team guides shortlisted candidates through assessments, interviews, and relocation logistics.'
          ),
          phone: translate('recruitment.sidebar.support.phone', '+94 11 234 5680'),
          location: translate('recruitment.sidebar.support.location', 'People & Culture Division'),
          email: translate('recruitment.sidebar.support.email', 'careers@nara.gov.lk')
        }
      },
      empty: translate('recruitment.empty', 'No active roles match your filters right now.'),
      cards: {
        categoryFallback: translate('recruitment.cards.categoryFallback', 'Career role'),
        statusFallback: translate('recruitment.cards.statusFallback', 'Open'),
        applyBy: translate('recruitment.cards.applyBy', 'Apply by'),
        tbc: translate('recruitment.cards.tbc', 'TBC'),
        closed: translate('recruitment.cards.closed', 'Closed'),
        daysRemaining: translate('recruitment.cards.daysRemaining', '{{count}} days remaining'),
        department: translate('recruitment.cards.department', 'Department'),
        departmentFallback: translate('recruitment.cards.departmentFallback', 'NARA'),
        grade: translate('recruitment.cards.grade', 'Service grade'),
        gradeFallback: translate('recruitment.cards.gradeFallback', 'NARA Service Grade'),
        qualifications: translate('recruitment.cards.qualifications', 'Qualifications'),
        qualificationsFallback: translate('recruitment.cards.qualificationsFallback', 'See full brief'),
        salary: translate('recruitment.cards.salary', 'Salary band'),
        salaryFallback: translate('recruitment.cards.salaryFallback', 'Aligned with NARA scales'),
        statusLabels: {
          Open: translate('recruitment.cards.statusLabels.open', 'Open'),
          'Under Review': translate('recruitment.cards.statusLabels.review', 'Under review'),
          Closed: translate('recruitment.cards.statusLabels.closed', 'Closed')
        },
        statusNotes: {
          Open: translate('recruitment.cards.statusNotes.open', 'Auto-updating from CMS'),
          'Under Review': translate(
            'recruitment.cards.statusNotes.review',
            'Panel evaluating submissions'
          ),
          Closed: translate('recruitment.cards.statusNotes.closed', 'Archived for RTI compliance')
        },
        buttons: {
          overview: translate('recruitment.cards.buttons.overview', 'Role overview'),
          apply: translate('recruitment.cards.buttons.apply', 'Submit application'),
          downloadPack: translate('recruitment.cards.buttons.downloadPack', 'Download pack'),
          closed: translate('recruitment.cards.buttons.closed', 'Applications closed'),
          closedHint: translate(
            'recruitment.cards.buttons.closedHint',
            'Applications are no longer being accepted. Contact HR for clarifications.'
          )
        },
        responsibilities: translate('recruitment.cards.responsibilities.title', 'Responsibilities'),
        responsibilitiesEmpty: translate(
          'recruitment.cards.responsibilities.empty',
          'Refer to the job description for detailed responsibilities.'
        ),
        candidateProfile: translate('recruitment.cards.profile.title', 'Candidate profile'),
        experience: translate('recruitment.cards.profile.experience', 'Experience'),
        experienceFallback: translate(
          'recruitment.cards.profile.experienceFallback',
          'Graduate to senior levels considered'
        ),
        contractType: translate('recruitment.cards.profile.contractType', 'Contract type'),
        contractFallback: translate('recruitment.cards.profile.contractFallback', 'Full-time')
      },
      sync: {
        metrics: {
          open: translate('recruitment.sync.metrics.open', 'Live vacancies'),
          review: translate('recruitment.sync.metrics.review', 'Under review'),
          closed: translate('recruitment.sync.metrics.closed', 'Closed this quarter'),
          lastSync: translate('recruitment.sync.metrics.lastSync', 'Last sync')
        },
        hints: {
          open: translate('recruitment.sync.hints.open', 'Auto-published from Vacancy Manager'),
          review: translate('recruitment.sync.hints.review', 'Pending HR approvals & PSC checklists'),
          closed: translate('recruitment.sync.hints.closed', 'Archived with RTI-ready summaries'),
          auto: translate('recruitment.sync.hints.auto', 'HR feed + gazette watcher')
        },
        features: {
          cms: translate('recruitment.sync.features.cms', 'Vacancy Manager'),
          cmsDescription: translate(
            'recruitment.sync.features.cmsDescription',
            'HR updates roles in the CMS or Google Sheet feed for scheduled publishing.'
          ),
          gazette: translate('recruitment.sync.features.gazette', 'Gazette assist'),
          gazetteDescription: translate(
            'recruitment.sync.features.gazetteDescription',
            'Uploads gazette PDFs with summaries and flags NARA mentions for review.'
          ),
          backOffice: translate('recruitment.sync.features.backOffice', 'Back-office controls'),
          backOfficeDescription: translate(
            'recruitment.sync.features.backOfficeDescription',
            'Approvals, reminders, CSV exports, and acknowledgement logs for RTI requests.'
          )
        }
      },
      archive: {
        title: translate('recruitment.archive.title', 'Archive: closed roles'),
        description: translate(
          'recruitment.archive.description',
          'Recent vacancies remain visible for transparency and RTI readiness.'
        ),
        download: translate('recruitment.archive.download', 'Download notice'),
        moreHint: translate(
          'recruitment.archive.moreHint',
          'Browse the complete archive from your workspace.'
        )
      }
    }),
    [translate]
  );

  const dashboardCopy = useMemo(
    () => ({
      heading: translate('dashboard.heading', 'My Workspace'),
      description: translate(
        'dashboard.description',
        'Track every procurement proposal and career application with live status updates, notifications, and secure document management.'
      ),
      metrics: {
        submitted: translate('dashboard.metrics.submitted', 'Submitted applications'),
        underReview: translate('dashboard.metrics.underReview', 'Under review'),
        awaiting: translate('dashboard.metrics.awaiting', 'Awaiting documents'),
        unread: translate('dashboard.metrics.unread', 'Unread notifications')
      },
      recent: {
        title: translate('dashboard.recent.title', 'Recent submissions'),
        subtitle: translate('dashboard.recent.subtitle', 'Last 10 records'),
        types: {
          procurement: translate('dashboard.recent.types.procurement', 'Procurement'),
          recruitment: translate('dashboard.recent.types.recruitment', 'Career')
        },
        empty: translate(
          'dashboard.recent.empty',
          'No submissions yet. Start by applying to a tender or role.'
        ),
        separator: translate('dashboard.recent.separator', '•'),
        status: {
          generic: translate('dashboard.recent.status.generic', '{{status}}')
        }
      },
      notifications: {
        title: translate('dashboard.notifications.title', 'Notifications'),
        empty: translate('dashboard.notifications.empty', 'You are all caught up!')
      },
      support: {
        title: translate('dashboard.support.title', 'Need assistance?'),
        description: translate(
          'dashboard.support.description',
          'Our digital support desk can help with account access, submission troubleshooting, and document uploads.'
        ),
        cta: translate('dashboard.support.cta', 'Contact support')
      },
      loading: {
        fetching: translate('dashboard.loading.fetching', 'Loading your workspace...'),
        empty: translate(
          'dashboard.loading.empty',
          'Dashboard data will appear after submitting applications.'
        )
      }
    }),
    [translate]
  );

  const dashboardStatusLabels = useMemo(
    () => ({
      under_review: translate('dashboard.recent.status.under_review', 'Under review'),
      submitted: translate('dashboard.recent.status.submitted', 'Submitted'),
      approved: translate('dashboard.recent.status.approved', 'Approved'),
      shortlisted: translate('dashboard.recent.status.shortlisted', 'Shortlisted'),
      awarded: translate('dashboard.recent.status.awarded', 'Awarded'),
      rejected: translate('dashboard.recent.status.rejected', 'Rejected')
    }),
    [translate]
  );

  const loadingCopy = useMemo(
    () => ({
      fetching: translate('loading.fetching', 'Fetching the latest updates…')
    }),
    [translate]
  );

  const footerCopy = useMemo(
    () => ({
      heading: translate('footer.heading', 'Co-create Sri Lanka’s ocean future with NARA'),
      description: translate(
        'footer.description',
        'Collaborate with us on maritime surveillance, climate-resilient fisheries, digital infrastructure, and community impact programmes across the island.'
      ),
      procurementCta: translate('footer.cta.procurement', 'Explore all procurement notices'),
      recruitmentCta: translate('footer.cta.recruitment', 'Meet the teams hiring now')
    }),
    [translate]
  );

  const alertsCopy = useMemo(
    () => ({
      applicationSuccess: translate(
        'alerts.applicationSuccess',
        'Application submitted successfully!'
      )
    }),
    [translate]
  );

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    error: authError,
    login,
    register,
    logout
  } = useProcurementAuth();

  const [activeTab, setActiveTab] = useState('procurement');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const [procurementNotices, setProcurementNotices] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registrationForm, setRegistrationForm] = useState({
    email: '',
    password: '',
    user_type: 'vendor',
    first_name: '',
    last_name: '',
    phone_number: '',
    nic_number: '',
    organization: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  const [procurementCategory, setProcurementCategory] = useState('all');
  const [procurementSort, setProcurementSort] = useState('deadline');
  const [jobCategory, setJobCategory] = useState('all');
  const [jobSort, setJobSort] = useState('deadline');
  const [jobStatusFilter, setJobStatusFilter] = useState('all');
  const [jobDivisionFilter, setJobDivisionFilter] = useState('all');
  const [jobGradeFilter, setJobGradeFilter] = useState('all');
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [vacancySummary, setVacancySummary] = useState(null);
  const [vacancyArchive, setVacancyArchive] = useState([]);
  const [expandedNoticeId, setExpandedNoticeId] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    setExpandedNoticeId(null);
    setExpandedJobId(null);

    if (activeTab === 'procurement') {
      setProcurementCategory('all');
      setProcurementSort('deadline');
    }

    if (activeTab === 'recruitment') {
      setJobCategory('all');
      setJobSort('deadline');
      setJobStatusFilter('all');
      setJobDivisionFilter('all');
      setJobGradeFilter('all');
      setJobSearchTerm('');
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isAuthenticated && activeTab === 'dashboard') {
      setActiveTab('procurement');
    }
  }, [isAuthenticated, activeTab]);

  const toDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const daysUntil = (value) => {
    const date = toDate(value);
    if (!date) return null;
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const parseNumericValue = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : null;
  };

  const formatRelativeTime = (value) => {
    const date = toDate(value);
    if (!date) return translate('recruitment.sync.relative.never', 'Awaiting sync');
    const diffMinutes = Math.round((Date.now() - date.getTime()) / (1000 * 60));
    if (diffMinutes < 1) return translate('recruitment.sync.relative.now', 'Just now');
    if (diffMinutes < 60) {
      return translate('recruitment.sync.relative.minutes', '{{count}} minutes ago', {
        count: diffMinutes
      });
    }
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) {
      return translate('recruitment.sync.relative.hours', '{{count}} hours ago', {
        count: diffHours
      });
    }
    const diffDays = Math.round(diffHours / 24);
    return translate('recruitment.sync.relative.days', '{{count}} days ago', {
      count: diffDays
    });
  };

  const getJobStatus = useCallback(
    (job) => {
      const rawStatus = String(job?.status || '').toLowerCase();
      if (rawStatus.includes('closed')) return 'Closed';
      if (rawStatus.includes('review')) return 'Under Review';
      if (rawStatus.includes('open')) return 'Open';

      const deadlineDays = daysUntil(job?.application_deadline);
      if (deadlineDays !== null) {
        if (deadlineDays < -14) return 'Closed';
        if (deadlineDays < 0) return 'Under Review';
      }
      return 'Open';
    },
    [daysUntil]
  );

  const getJobGrade = useCallback((job) => {
    const gradeValue =
      job?.grade ||
      job?.job_grade ||
      job?.pay_grade ||
      job?.classification ||
      job?.position_grade;
    if (!gradeValue) return translate('recruitment.cards.gradeFallback', 'NARA Service Grade');
    return gradeValue;
  }, [translate]);

  const procurementCategoryOptions = useMemo(() => {
    const categories = new Set();
    procurementNotices?.forEach((notice) => {
      const label = notice?.category || notice?.notice_type;
      if (label) categories.add(label);
    });
    return ['all', ...Array.from(categories)];
  }, [procurementNotices]);

  const enrichedJobPostings = useMemo(() => {
    return (jobPostings || []).map((job) => {
      const status = getJobStatus(job);
      const division = job?.department || job?.division || job?.unit || translate('recruitment.cards.departmentFallback', 'NARA');
      const grade = getJobGrade(job);
      const publishedAt = job?.updated_at || job?.published_at || job?.created_at || job?.posted_at;

      return {
        ...job,
        computedStatus: status,
        computedDivision: division,
        computedGrade: grade,
        computedPublishedAt: publishedAt
      };
    });
  }, [jobPostings, getJobGrade, getJobStatus, translate]);

  const normalizedArchive = useMemo(() => {
    return (vacancyArchive || []).map((job) => {
      const status = getJobStatus(job);
      const division = job?.department || job?.division || job?.unit || translate('recruitment.cards.departmentFallback', 'NARA');
      const grade = getJobGrade(job);
      const publishedAt =
        job?.closed_at || job?.archived_at || job?.updated_at || job?.published_at || job?.created_at;

      return {
        ...job,
        computedStatus: status,
        computedDivision: division,
        computedGrade: grade,
        computedPublishedAt: publishedAt
      };
    });
  }, [vacancyArchive, getJobGrade, getJobStatus, translate]);

  const recruitmentCategoryOptions = useMemo(() => {
    const categories = new Set();
    enrichedJobPostings?.forEach((job) => {
      if (job?.category) categories.add(job?.category);
      else if (job?.department) categories.add(job?.department);
    });
    return ['all', ...Array.from(categories)];
  }, [enrichedJobPostings]);

  const recruitmentDivisionOptions = useMemo(() => {
    const divisions = new Set();
    enrichedJobPostings?.forEach((job) => {
      if (job?.computedDivision) divisions.add(job?.computedDivision);
    });
    return ['all', ...Array.from(divisions)];
  }, [enrichedJobPostings]);

  const recruitmentGradeOptions = useMemo(() => {
    const grades = new Set();
    enrichedJobPostings?.forEach((job) => {
      if (job?.computedGrade) grades.add(job?.computedGrade);
    });
    return ['all', ...Array.from(grades)];
  }, [enrichedJobPostings]);

  const recruitmentStatusOptions = useMemo(() => {
    const statuses = new Set(['Open', 'Under Review', 'Closed']);
    enrichedJobPostings?.forEach((job) => {
      if (job?.computedStatus) statuses.add(job?.computedStatus);
    });
    normalizedArchive?.forEach((job) => {
      if (job?.computedStatus) statuses.add(job?.computedStatus);
    });
    return ['all', ...Array.from(statuses)];
  }, [enrichedJobPostings, normalizedArchive]);

  const filteredProcurementNotices = useMemo(() => {
    const items = [...(procurementNotices || [])];
    let filtered = items.filter(Boolean);

    if (procurementCategory !== 'all') {
      filtered = filtered.filter((notice) => {
        const label = notice?.category || notice?.notice_type;
        return label === procurementCategory;
      });
    }

    if (procurementSort === 'deadline') {
      filtered.sort((a, b) => {
        const aDays = daysUntil(a?.submission_deadline);
        const bDays = daysUntil(b?.submission_deadline);
        return (aDays ?? Infinity) - (bDays ?? Infinity);
      });
    }

    if (procurementSort === 'value') {
      filtered.sort((a, b) => {
        const aValue = parseNumericValue(a?.estimated_value) ?? 0;
        const bValue = parseNumericValue(b?.estimated_value) ?? 0;
        return bValue - aValue;
      });
    }

    if (procurementSort === 'recent') {
      filtered.sort((a, b) => {
        const aDate = toDate(a?.published_date) || toDate(a?.created_at);
        const bDate = toDate(b?.published_date) || toDate(b?.created_at);
        return (bDate?.getTime?.() ?? 0) - (aDate?.getTime?.() ?? 0);
      });
    }

    return filtered;
  }, [procurementNotices, procurementCategory, procurementSort]);

  const filteredJobPostings = useMemo(() => {
    const searchNeedle = jobSearchTerm.trim().toLowerCase();
    let filtered = [...(enrichedJobPostings || [])].filter(Boolean);

    if (jobCategory !== 'all') {
      filtered = filtered.filter(
        (job) => job?.category === jobCategory || job?.computedDivision === jobCategory
      );
    }

    if (jobDivisionFilter !== 'all') {
      filtered = filtered.filter((job) => job?.computedDivision === jobDivisionFilter);
    }

    if (jobGradeFilter !== 'all') {
      filtered = filtered.filter((job) => job?.computedGrade === jobGradeFilter);
    }

    if (jobStatusFilter !== 'all') {
      filtered = filtered.filter((job) => job?.computedStatus === jobStatusFilter);
    }

    if (searchNeedle) {
      filtered = filtered.filter((job) => {
        const fields = [
          job?.title,
          job?.description,
          job?.computedDivision,
          job?.computedGrade,
          job?.category,
          job?.department,
          job?.location,
          job?.salary_range,
          Array.isArray(job?.responsibilities) ? job.responsibilities.join(' ') : ''
        ];
        return fields
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchNeedle));
      });
    }

    if (jobSort === 'deadline') {
      filtered.sort((a, b) => {
        const aDays = daysUntil(a?.application_deadline);
        const bDays = daysUntil(b?.application_deadline);
        return (aDays ?? Infinity) - (bDays ?? Infinity);
      });
    }

    if (jobSort === 'salary') {
      filtered.sort((a, b) => {
        const aValue =
          parseNumericValue(a?.salary_range_max) ||
          parseNumericValue(a?.salary_range_min) ||
          parseNumericValue(a?.salary_range) ||
          parseNumericValue(a?.compensation) ||
          0;
        const bValue =
          parseNumericValue(b?.salary_range_max) ||
          parseNumericValue(b?.salary_range_min) ||
          parseNumericValue(b?.salary_range) ||
          parseNumericValue(b?.compensation) ||
          0;
        return bValue - aValue;
      });
    }

    if (jobSort === 'recent') {
      filtered.sort((a, b) => {
        const aDate = toDate(a?.computedPublishedAt);
        const bDate = toDate(b?.computedPublishedAt);
        return (bDate?.getTime?.() ?? 0) - (aDate?.getTime?.() ?? 0);
      });
    }

    return filtered;
  }, [
    enrichedJobPostings,
    jobCategory,
    jobDivisionFilter,
    jobGradeFilter,
    jobStatusFilter,
    jobSearchTerm,
    jobSort,
    daysUntil
  ]);

  const procurementClosingSoonCount = useMemo(() => (
    (procurementNotices || []).filter((notice) => {
      const days = daysUntil(notice?.submission_deadline);
      return days !== null && days <= 7 && days >= 0;
    }).length
  ), [procurementNotices]);

  const recruitmentClosingSoonCount = useMemo(() => (
    (enrichedJobPostings || []).filter((job) => {
      const days = daysUntil(job?.application_deadline);
      return job?.computedStatus === 'Open' && days !== null && days <= 7 && days >= 0;
    }).length
  ), [enrichedJobPostings, daysUntil]);

  const recruitmentUnderReviewCount = useMemo(() => {
    const fallback = (enrichedJobPostings || []).filter((job) => job?.computedStatus === 'Under Review').length;
    if (vacancySummary) {
      const candidates = [
        vacancySummary?.under_review,
        vacancySummary?.in_review,
        vacancySummary?.reviewing
      ];
      const summaryValue = candidates.find((value) => typeof value === 'number');
      if (typeof summaryValue === 'number') {
        return summaryValue;
      }
    }
    return fallback;
  }, [enrichedJobPostings, vacancySummary]);

  const latestSyncDate = useMemo(() => {
    if (vacancySummary) {
      const candidate =
        vacancySummary?.last_synced_at ||
        vacancySummary?.synced_at ||
        vacancySummary?.last_sync ||
        vacancySummary?.generated_at;
      const parsed = toDate(candidate);
      if (parsed) return parsed;
    }

    return (enrichedJobPostings || [])
      .map((job) => toDate(job?.computedPublishedAt))
      .filter(Boolean)
      .sort((a, b) => b.getTime() - a.getTime())[0] || null;
  }, [vacancySummary, enrichedJobPostings]);

  const archivedJobPostings = useMemo(() => {
    const source = normalizedArchive.length ? normalizedArchive : (enrichedJobPostings || []).filter((job) => job?.computedStatus === 'Closed');

    return [...source].sort((a, b) => {
      const aDate = toDate(a?.computedPublishedAt);
      const bDate = toDate(b?.computedPublishedAt);
      return (bDate?.getTime?.() ?? 0) - (aDate?.getTime?.() ?? 0);
    });
  }, [normalizedArchive, enrichedJobPostings]);

  const vacancyAutomationSnapshot = useMemo(() => {
    const fallbackOpen = (enrichedJobPostings || []).filter((job) => job?.computedStatus === 'Open').length;
    const fallbackClosed = archivedJobPostings.length;
    const fallbackGazette = (enrichedJobPostings || []).filter((job) => job?.source === 'gazette').length;
    const fallbackPsc = (enrichedJobPostings || []).filter((job) => job?.psc_reference).length;

    if (vacancySummary) {
      const selectNumber = (keys, fallback) => {
        for (const key of keys) {
          const value = vacancySummary?.[key];
          if (typeof value === 'number') return value;
        }
        return fallback;
      };

      return {
        lastSynced: toDate(
          vacancySummary?.last_synced_at ||
            vacancySummary?.synced_at ||
            vacancySummary?.last_sync ||
            vacancySummary?.generated_at
        ) || latestSyncDate,
        openRoles: selectNumber(['open_roles', 'open', 'active_roles'], fallbackOpen),
        underReview: selectNumber(['under_review', 'in_review', 'reviewing'], recruitmentUnderReviewCount),
        closedRoles: selectNumber(['closed_roles', 'closed'], fallbackClosed),
        gazetteBacklog: selectNumber(['gazette_backlog', 'gazette_pending'], fallbackGazette),
        pscLinks: selectNumber(['psc_links', 'psc_backlog'], fallbackPsc)
      };
    }

    return {
      lastSynced: latestSyncDate,
      openRoles: fallbackOpen,
      underReview: recruitmentUnderReviewCount,
      closedRoles: fallbackClosed,
      gazetteBacklog: fallbackGazette,
      pscLinks: fallbackPsc
    };
  }, [
    vacancySummary,
    enrichedJobPostings,
    archivedJobPostings.length,
    latestSyncDate,
    recruitmentUnderReviewCount
  ]);

  const heroMetrics = useMemo(() => ([
    {
      icon: FileText,
      label: translate('hero.metrics.procurement.label', 'Open procurement RFPs'),
      value: procurementNotices?.length || 0,
      hint: procurementClosingSoonCount
        ? translate('hero.metrics.procurement.hint', '{{count}} closing within 7 days', {
            count: procurementClosingSoonCount
          })
        : translate('hero.metrics.procurement.hintFallback', 'Fresh tenders added daily')
    },
    {
      icon: Users,
      label: translate('hero.metrics.recruitment.label', 'Active career roles'),
      value: vacancyAutomationSnapshot.openRoles,
      hint: recruitmentClosingSoonCount
        ? translate('hero.metrics.recruitment.hint', '{{count}} closing soon', {
            count: recruitmentClosingSoonCount
          })
        : translate('hero.metrics.recruitment.hintFallback', 'Multidisciplinary teams')
    },
    {
      icon: BarChart3,
      label: translate('hero.metrics.review.label', 'Average review time'),
      value:
        dashboardData?.statistics?.average_review_time ||
        translate('hero.metrics.review.valueFallback', '12 days'),
      hint: translate('hero.metrics.review.hint', 'Streamlined evaluation workflow')
    },
    {
      icon: Shield,
      label: translate('hero.metrics.partners.label', 'Registered partners'),
      value:
        dashboardData?.statistics?.registered_vendors ||
        translate('hero.metrics.partners.valueFallback', '1.2K+'),
      hint: translate('hero.metrics.partners.hint', 'Pre-qualified national vendors')
    }
  ]), [
    procurementNotices,
    jobPostings,
    dashboardData,
    procurementClosingSoonCount,
    recruitmentClosingSoonCount,
    translate
  ]);

  const navigationTabs = useMemo(() => {
    const base = [
      {
        key: 'procurement',
        label: translate('navigation.procurement.label', 'Procurement Exchange'),
        description: translate(
          'navigation.procurement.description',
          'Submit proposals, download briefs, and track tender milestones.'
        ),
        icon: FileText
      },
      {
        key: 'recruitment',
        label: translate('navigation.recruitment.label', 'Talent Hub'),
        description: translate(
          'navigation.recruitment.description',
          'Explore technical and scientific career opportunities at NARA.'
        ),
        icon: Users
      }
    ];

    if (isAuthenticated) {
      base.push({
        key: 'dashboard',
        label: translate('navigation.dashboard.label', 'My Workspace'),
        description: translate(
          'navigation.dashboard.description',
          'View application progress, notifications, and secure documents.'
        ),
        icon: Settings
      });
    }

    return base;
  }, [isAuthenticated, translate]);

  const activeTabMeta = navigationTabs.find((tab) => tab.key === activeTab) || navigationTabs[0];

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'procurement') {
        const data = await procurementService?.getAllNotices({ status: 'active', page: 1, limit: 12 });
        setProcurementNotices(data?.notices || []);
        setVacancySummary(null);
        setVacancyArchive([]);
      } else if (activeTab === 'recruitment') {
        const [jobsResult, summaryResult, archiveResult] = await Promise.allSettled([
          recruitmentService?.getAllJobs({ status: 'active', page: 1, limit: 12 }),
          vacancyIntegrationService?.getSyncSummary(),
          vacancyIntegrationService?.getArchive({ status: 'closed', limit: 12 })
        ]);

        if (jobsResult.status === 'fulfilled') {
          const jobsPayload = jobsResult.value;
          setJobPostings(jobsPayload?.jobs || jobsPayload?.data || []);
        } else {
          setJobPostings([]);
          const apiError = handleApiError(jobsResult.reason);
          setError(apiError?.message);
        }

        if (summaryResult.status === 'fulfilled') {
          const summaryPayload = summaryResult.value;
          setVacancySummary(summaryPayload?.summary || summaryPayload || null);
        } else {
          setVacancySummary(null);
        }

        if (archiveResult.status === 'fulfilled') {
          const archivePayload = archiveResult.value;
          const archiveItems = Array.isArray(archivePayload?.jobs)
            ? archivePayload.jobs
            : Array.isArray(archivePayload?.archive)
              ? archivePayload.archive
              : Array.isArray(archivePayload)
                ? archivePayload
                : [];
          setVacancyArchive(archiveItems);
        } else {
          setVacancyArchive([]);
        }
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService?.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event?.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    const result = await login(loginForm);

    if (result?.success) {
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
      setError(null);
    } else {
      setFormErrors({ login: result?.error });
    }

    setSubmitting(false);
  };

  const handleRegistration = async (event) => {
    event?.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    const result = await register(registrationForm);

    if (result?.success) {
      setShowRegistrationModal(false);
      setRegistrationForm({
        email: '',
        password: '',
        user_type: 'vendor',
        first_name: '',
        last_name: '',
        phone_number: '',
        nic_number: '',
        organization: ''
      });
      setError(null);
    } else {
      setFormErrors({ registration: result?.error });
    }

    setSubmitting(false);
  };

  const handleApplicationSubmit = async (event, applicationData) => {
    event?.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      let result;

      if (activeTab === 'procurement') {
        result = await procurementService?.submitApplication(selectedNotice?.notice_id, applicationData);
      } else {
        result = await recruitmentService?.submitApplication(selectedNotice?.job_id, applicationData);
      }

      const fileInputs = event?.target?.querySelectorAll('input[type="file"]');
      const filesToUpload = [];
      const documentTypes = [];

      fileInputs?.forEach((input) => {
        if (input?.files?.length) {
          Array.from(input.files).forEach((file) => {
            filesToUpload.push(file);
            documentTypes.push(input?.dataset?.documentType || supportingDocumentLabel);
          });
        }
      });

      if (filesToUpload?.length) {
        setUploading(true);
        await fileUploadService?.uploadDocuments(filesToUpload, {
          application_id: result?.application_id,
          application_type: activeTab === 'procurement' ? 'procurement' : 'job',
          document_types: documentTypes
        });
      }

      setShowApplicationModal(false);
      setSelectedNotice(null);
      setError(null);
      alert(alertsCopy.applicationSuccess);
    } catch (err) {
      const apiError = handleApiError(err);
      setFormErrors({ application: apiError?.message });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleFileUpload = (event, documentType) => {
    const files = Array.from(event?.target?.files || []);
    setUploadedFiles((prev) => ({
      ...prev,
      [documentType]: files
    }));
  };

  const handleManualRefresh = () => {
    loadInitialData();
  };

  const handleOpenApplication = (item) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setSelectedNotice(item);
    setShowApplicationModal(true);
  };

  const handleDownloadPack = (job) => {
    const attachments = Array.isArray(job?.attachments) ? job.attachments : [];
    const attachmentWithUrl = attachments.find((item) => item?.url || item?.download_url);
    const downloadUrl =
      job?.download_pack_url ||
      job?.pack_url ||
      job?.document_url ||
      job?.gazette_url ||
      attachmentWithUrl?.url ||
      attachmentWithUrl?.download_url;

    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener');
    }
  };

  const renderProcurementSection = () => (
    <motion.section
      key="procurement"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            {translate('procurement.heading', 'Procurement Exchange')}
          </h2>
          <p className="text-slate-300">
            {translate(
              'procurement.description',
              'Access live tenders, download technical briefs, and submit proposals that advance Sri Lanka’s blue-economy infrastructure.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-200">
              {translate('procurement.filters.scopeLabel', 'Filter by scope')}
            </span>
            <select
              value={procurementCategory}
              onChange={(event) => setProcurementCategory(event.target.value)}
              className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              {procurementCategoryOptions.map((option) => (
                <option key={option} value={option} className="bg-slate-900">
                  {option === 'all'
                    ? translate('procurement.filters.allOption', 'All notices')
                    : option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-200">
              {translate('procurement.filters.sortLabel', 'Sort')}
            </span>
            <select
              value={procurementSort}
              onChange={(event) => setProcurementSort(event.target.value)}
              className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              <option value="deadline">
                {translate('procurement.filters.options.deadline', 'Closing soon')}
              </option>
              <option value="value">
                {translate('procurement.filters.options.value', 'Highest value')}
              </option>
              <option value="recent">
                {translate('procurement.filters.options.recent', 'Recently published')}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 text-cyan-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.2em]">
                {translate('procurement.sidebar.title', 'Opportunity Pulse')}
              </span>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>{translate('procurement.sidebar.closingSoon', 'Closing within 7 days')}</span>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-300">
                  {procurementClosingSoonCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{translate('procurement.sidebar.averageValue', 'Average tender value')}</span>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-300">
                  {(() => {
                    const values = (procurementNotices || [])
                      .map((item) => parseNumericValue(item?.estimated_value))
                      .filter((value) => value);
                    if (!values.length) return '—';
                    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
                    return `LKR ${(avg / 1_000_000).toFixed(1)}M`;
                  })()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{translate('procurement.sidebar.registeredVendors', 'Registered vendors')}</span>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-300">
                  {dashboardData?.statistics?.registered_vendors ||
                    translate('procurement.sidebar.vendorFallback', '1.2K+')}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">
              {translate('procurement.sidebar.support.title', 'Procurement Support')}
            </h3>
            <p className="mt-3 text-sm text-slate-200">
              {translate(
                'procurement.sidebar.support.description',
                'Dedicated procurement officers are available for clarifications on documentation, site visits, and compliance requirements.'
              )}
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-300" />
                <span>+94 11 234 5675</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-300" />
                <span>
                  {translate('procurement.sidebar.support.location', 'Procurement Unit, NARA HQ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-cyan-300" />
                <span>procurement@nara.gov.lk</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {filteredProcurementNotices?.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-300">
              <FileText className="mx-auto mb-4 h-10 w-10 text-slate-500" />
              {translate(
                'procurement.empty',
                'No active procurement notices match your filters right now.'
              )}
            </div>
          ) : (
            filteredProcurementNotices.map((notice) => {
              const daysLeft = daysUntil(notice?.submission_deadline);
              const isExpanded = expandedNoticeId === notice?.notice_id;

              return (
                <motion.div
                  key={notice?.notice_id || notice?.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
                >
      <SEOHead
        title="Procurement & Recruitment"
        description="Current procurement tenders and career opportunities at NARA Sri Lanka."
        path="/procurement-recruitment-portal"
        keywords="procurement, tenders, recruitment, careers, NARA jobs"
      />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />

                  <div className="relative space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-300">
                            {notice?.category ||
                              notice?.notice_type ||
                              translate('procurement.cards.categoryFallback', 'Procurement')}
                          </span>
                          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
                            {notice?.status || translate('procurement.cards.statusFallback', 'Active')}
                          </span>
                        </div>
                        <h3 className="mt-3 text-2xl font-semibold text-white">
                          {notice?.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                          {notice?.description}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-right">
                        <span className="block text-xs uppercase tracking-wider text-slate-200">
                          {translate('procurement.cards.deadlineLabel', 'Deadline')}
                        </span>
                        <span className="text-lg font-semibold text-white">
                          {notice?.submission_deadline || translate('procurement.cards.tbc', 'TBC')}
                        </span>
                        {daysLeft !== null && (
                          <span className={`mt-1 block text-xs font-medium ${
                            daysLeft <= 3
                              ? 'text-red-300'
                              : daysLeft <= 7
                                ? 'text-amber-300'
                                : 'text-cyan-300'
                          }`}>
                            {daysLeft < 0
                              ? translate('procurement.cards.closed', 'Closed')
                              : translate('procurement.cards.daysRemaining', '{{count}} days remaining', {
                                  count: daysLeft
                                })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 text-sm sm:grid-cols-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Briefcase className="h-4 w-4 text-cyan-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-200">
                            {translate('procurement.cards.department', 'Department')}
                          </p>
                          <p className="text-slate-200">
                            {notice?.department || translate('procurement.cards.departmentFallback', 'NARA Procurement')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Building className="h-4 w-4 text-cyan-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-200">
                            {translate('procurement.cards.estimatedValue', 'Estimated value')}
                          </p>
                          <p className="text-slate-200">
                            {notice?.estimated_value ||
                              translate('procurement.cards.contact', 'Contact procurement')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Clock className="h-4 w-4 text-cyan-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-200">
                            {translate('procurement.cards.bidOpening', 'Bid opening')}
                          </p>
                          <p className="text-slate-200">
                            {notice?.bid_opening_date ||
                              translate('procurement.cards.bidOpeningFallback', 'Refer notice')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setExpandedNoticeId(isExpanded ? null : notice?.notice_id)}
                        className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                      >
                        <Eye className="h-4 w-4" />
                        {translate('procurement.cards.viewRequirements', 'View requirements')}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <button
                        onClick={() => handleOpenApplication(notice)}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
                      >
                        <Send className="h-4 w-4" />
                        {translate('procurement.cards.submitProposal', 'Submit proposal')}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6"
                        >
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                                {translate('procurement.cards.checklist.title', 'Submission checklist')}
                              </h4>
                              {(() => {
                                const docs = Array.isArray(notice?.documents_required)
                                  ? notice.documents_required
                                  : [];

                                if (!docs.length) {
                                  return (
                                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                                      <li>
                                        {translate(
                                          'procurement.cards.checklist.empty',
                                          'Refer to RFP for the full documentation list.'
                                        )}
                                      </li>
                                    </ul>
                                  );
                                }

                                return (
                                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                    {docs.map((doc, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 text-cyan-300" />
                                        <span>{doc}</span>
                                      </li>
                                    ))}
                                  </ul>
                                );
                              })()}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                                {translate('procurement.cards.milestones.title', 'Key milestones')}
                              </h4>
                              <div className="mt-3 space-y-3 text-sm text-slate-300">
                                <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                                  <Calendar className="h-4 w-4 text-cyan-300" />
                                  <div>
                                    <p className="font-medium text-slate-200">
                                      {translate('procurement.cards.milestones.clarifications', 'Clarifications window')}
                                    </p>
                                    <p className="text-xs text-slate-200">
                                      {notice?.clarification_deadline ||
                                        translate('procurement.cards.milestones.clarificationsFallback', 'Refer published notice')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                                  <Building className="h-4 w-4 text-cyan-300" />
                                  <div>
                                    <p className="font-medium text-slate-200">
                                      {translate('procurement.cards.milestones.venue', 'Bid opening venue')}
                                    </p>
                                    <p className="text-xs text-slate-200">
                                      {notice?.submission_venue ||
                                        translate('procurement.cards.milestones.venueFallback', 'NARA Procurement Division')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

    </motion.section>
  );

  const renderRecruitmentSection = () => {
    const statusThemeMap = {
      Open: 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
      'Under Review': 'border border-amber-400/40 bg-amber-500/10 text-amber-200',
      Closed: 'border border-slate-600 bg-slate-800/80 text-slate-300',
      default: 'border border-slate-700 bg-slate-800/80 text-slate-200'
    };

    const statusIconMap = {
      Open: CheckCircle,
      'Under Review': Loader,
      Closed: X
    };

    const archivePreview = archivedJobPostings.slice(0, 4);
    const archiveTotalLabel = translate(
      'recruitment.archive.total',
      '{{count}} closed roles',
      { count: archivedJobPostings.length }
    );

    return (
      <motion.section
        key="recruitment"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3 }}
        className="space-y-10"
      >
      <div className="space-y-6 lg:space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
              {recruitmentCopy.heading}
            </h2>
            <p className="text-slate-300">
              {recruitmentCopy.description}
            </p>
          </div>
          <div className="grid w-full max-w-3xl gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="md:col-span-2 xl:col-span-3">
              <label className="text-xs uppercase tracking-wider text-slate-200" htmlFor="job-search">
                {recruitmentCopy.filters.searchLabel}
              </label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="job-search"
                  type="search"
                  value={jobSearchTerm}
                  onChange={(event) => setJobSearchTerm(event.target.value)}
                  placeholder={recruitmentCopy.filters.searchPlaceholder}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-200">
                {recruitmentCopy.filters.focusLabel}
              </span>
              <select
                value={jobCategory}
                onChange={(event) => setJobCategory(event.target.value)}
                className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
              >
                {recruitmentCategoryOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option === 'all' ? recruitmentCopy.filters.allOption : option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-200">
                {recruitmentCopy.filters.statusLabel}
              </span>
              <select
                value={jobStatusFilter}
                onChange={(event) => setJobStatusFilter(event.target.value)}
                className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
              >
                {recruitmentStatusOptions.map((option) => {
                  const optionKey =
                    option === 'Under Review'
                      ? 'review'
                      : option === 'Open'
                        ? 'open'
                        : option === 'Closed'
                          ? 'closed'
                          : option;
                  const label =
                    recruitmentCopy.filters.statusOptions?.[optionKey] ||
                    recruitmentCopy.filters.statusOptions?.[option] ||
                    option;

                  return (
                    <option key={option} value={option} className="bg-slate-900">
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-200">
                {recruitmentCopy.filters.divisionLabel}
              </span>
              <select
                value={jobDivisionFilter}
                onChange={(event) => setJobDivisionFilter(event.target.value)}
                className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
              >
                {recruitmentDivisionOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option === 'all' ? recruitmentCopy.filters.allDivisions : option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-200">
                {recruitmentCopy.filters.gradeLabel}
              </span>
              <select
                value={jobGradeFilter}
                onChange={(event) => setJobGradeFilter(event.target.value)}
                className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
              >
                {recruitmentGradeOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900">
                    {option === 'all' ? recruitmentCopy.filters.allGrades : option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-200">
                {recruitmentCopy.filters.sortLabel}
              </span>
              <select
                value={jobSort}
                onChange={(event) => setJobSort(event.target.value)}
                className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
              >
                <option value="deadline">{recruitmentCopy.filters.options.deadline}</option>
                <option value="salary">{recruitmentCopy.filters.options.salary}</option>
                <option value="recent">{recruitmentCopy.filters.options.recent}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-200">
              {recruitmentCopy.sync.metrics.open}
            </span>
            <p className="text-2xl font-semibold text-white">{vacancyAutomationSnapshot.openRoles}</p>
            <p className="text-xs text-slate-200">{recruitmentCopy.sync.hints.open}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-200">
              {recruitmentCopy.sync.metrics.review}
            </span>
            <p className="text-2xl font-semibold text-white">{vacancyAutomationSnapshot.underReview}</p>
            <p className="text-xs text-slate-200">{recruitmentCopy.sync.hints.review}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-200">
              {recruitmentCopy.sync.metrics.closed}
            </span>
            <p className="text-2xl font-semibold text-white">{vacancyAutomationSnapshot.closedRoles}</p>
            <p className="text-xs text-slate-200">{recruitmentCopy.sync.hints.closed}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-200">
              {recruitmentCopy.sync.metrics.lastSync}
            </span>
            <p className="text-base font-semibold text-emerald-300">
              {formatRelativeTime(vacancyAutomationSnapshot.lastSynced)}
            </p>
            <p className="text-xs text-slate-200 flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              {recruitmentCopy.sync.hints.auto}
            </p>
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <FileText className="mt-1 h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-sm font-semibold text-white">{recruitmentCopy.sync.features.cms}</p>
              <p className="text-xs text-slate-200">
                {recruitmentCopy.sync.features.cmsDescription}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bell className="mt-1 h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-sm font-semibold text-white">{recruitmentCopy.sync.features.gazette}</p>
              <p className="text-xs text-slate-200">
                {recruitmentCopy.sync.features.gazetteDescription}
              </p>
              {typeof vacancyAutomationSnapshot.gazetteBacklog === 'number' &&
                vacancyAutomationSnapshot.gazetteBacklog > 0 && (
                <p className="mt-2 inline-flex items-center gap-2 text-[11px] font-medium text-emerald-200">
                  <Bell className="h-3.5 w-3.5" />
                  {translate(
                    'recruitment.sync.features.gazettePending',
                    '{{count}} gazettes flagged',
                    { count: vacancyAutomationSnapshot.gazetteBacklog }
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="mt-1 h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-sm font-semibold text-white">{recruitmentCopy.sync.features.backOffice}</p>
              <p className="text-xs text-slate-200">
                {recruitmentCopy.sync.features.backOfficeDescription}
              </p>
              {typeof vacancyAutomationSnapshot.pscLinks === 'number' &&
                vacancyAutomationSnapshot.pscLinks > 0 && (
                <p className="mt-2 inline-flex items-center gap-2 text-[11px] font-medium text-emerald-200">
                  <Shield className="h-3.5 w-3.5" />
                  {translate(
                    'recruitment.sync.features.pscPending',
                    '{{count}} PSC links tracked',
                    { count: vacancyAutomationSnapshot.pscLinks }
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 text-emerald-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.2em]">
                {recruitmentCopy.sidebar.title}
              </span>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>{recruitmentCopy.sidebar.closingSoon}</span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
                  {recruitmentClosingSoonCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{recruitmentCopy.sidebar.hybrid}</span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
                  {(jobPostings || []).filter((job) => job?.work_mode?.toLowerCase?.() === 'hybrid').length || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{recruitmentCopy.sidebar.scholarship}</span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
                  {(jobPostings || []).filter((job) => job?.benefits?.toLowerCase?.().includes?.('scholarship')).length || '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">
              {recruitmentCopy.sidebar.support.title}
            </h3>
            <p className="mt-3 text-sm text-slate-200">
              {recruitmentCopy.sidebar.support.description}
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>{recruitmentCopy.sidebar.support.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>{recruitmentCopy.sidebar.support.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-emerald-400" />
                <span>{recruitmentCopy.sidebar.support.email}</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {filteredJobPostings?.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-300">
              <Users className="mx-auto mb-4 h-10 w-10 text-slate-500" />
              {recruitmentCopy.empty}
            </div>
          ) : (
            filteredJobPostings.map((job) => {
              const daysLeft = daysUntil(job?.application_deadline);
              const isExpanded = expandedJobId === job?.job_id;
              const status = job?.computedStatus || job?.status || recruitmentCopy.cards.statusFallback;
              const StatusIconComponent = statusIconMap[status] || statusIconMap.Open;
              const statusTheme = statusThemeMap[status] || statusThemeMap.default;
              const statusLabel = recruitmentCopy.cards.statusLabels?.[status] || status;
              const statusNote = recruitmentCopy.cards.statusNotes?.[status] || '';
              const divisionLabel = job?.computedDivision || job?.department || recruitmentCopy.cards.departmentFallback;
              const gradeLabel = job?.computedGrade || recruitmentCopy.cards.gradeFallback;
              const salaryDisplay =
                job?.salary_range_min && job?.salary_range_max
                  ? `LKR ${job.salary_range_min} - ${job.salary_range_max}`
                  : job?.salary_range || job?.compensation || recruitmentCopy.cards.salaryFallback;
              const attachments = Array.isArray(job?.attachments) ? job.attachments : [];
              const hasDownloadPack = Boolean(
                job?.download_pack_url ||
                  job?.pack_url ||
                  job?.document_url ||
                  job?.gazette_url ||
                  attachments.find((item) => item?.url || item?.download_url)
              );
              const canApply = status === 'Open';

              return (
                <motion.div
                  key={job?.job_id || job?.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-slate-900/60 p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />

                  <div className="relative space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-300">
                            {job?.category || recruitmentCopy.cards.categoryFallback}
                          </span>
                          {job?.work_mode && (
                            <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wider text-slate-300">
                              {job?.work_mode}
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-semibold text-white">
                          {job?.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-300">
                          {job?.description}
                        </p>
                        <div className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-wider ${statusTheme}`}>
                          <StatusIconComponent className="h-4 w-4" />
                          <span>{statusLabel}</span>
                          {statusNote && <span className="text-[10px] font-normal normal-case text-emerald-100/80">{statusNote}</span>}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-right">
                        <span className="block text-xs uppercase tracking-wider text-slate-200">
                          {recruitmentCopy.cards.applyBy}
                        </span>
                        <span className="text-lg font-semibold text-white">
                          {job?.application_deadline || recruitmentCopy.cards.tbc}
                        </span>
                        {status === 'Open' && daysLeft !== null ? (
                          <span className={`mt-1 block text-xs font-medium ${
                            daysLeft <= 3
                              ? 'text-red-300'
                              : daysLeft <= 7
                                ? 'text-amber-300'
                                : 'text-emerald-300'
                          }`}>
                            {translate('recruitment.cards.daysRemaining', recruitmentCopy.cards.daysRemaining, {
                              count: Math.max(0, daysLeft)
                            })}
                          </span>
                        ) : (
                          <span className="mt-1 block text-xs font-medium text-slate-300">
                            {statusLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Building className="h-4 w-4 text-emerald-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-200">
                            {recruitmentCopy.cards.department}
                          </p>
                          <p className="text-slate-200">{divisionLabel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Briefcase className="h-4 w-4 text-emerald-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-200">
                            {recruitmentCopy.cards.grade}
                          </p>
                          <p className="text-slate-200">{gradeLabel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Award className="h-4 w-4 text-emerald-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-200">
                            {recruitmentCopy.cards.qualifications}
                          </p>
                          <p className="text-slate-200">
                            {job?.qualifications_required || recruitmentCopy.cards.qualificationsFallback}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <BarChart3 className="h-4 w-4 text-emerald-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-200">
                            {recruitmentCopy.cards.salary}
                          </p>
                          <p className="text-slate-200">{salaryDisplay}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setExpandedJobId(isExpanded ? null : job?.job_id)}
                        className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
                      >
                        <Eye className="h-4 w-4" />
                        {recruitmentCopy.cards.buttons.overview}
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {hasDownloadPack && (
                        <button
                          onClick={() => handleDownloadPack(job)}
                          className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
                        >
                          <FileText className="h-4 w-4" />
                          {recruitmentCopy.cards.buttons.downloadPack}
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenApplication(job)}
                        disabled={!canApply}
                        title={!canApply ? recruitmentCopy.cards.buttons.closedHint : undefined}
                        className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-lg transition ${
                          canApply
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20 hover:scale-[1.01]'
                            : 'cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-200 shadow-none'
                        }`}
                      >
                        <Send className="h-4 w-4" />
                        {canApply
                          ? recruitmentCopy.cards.buttons.apply
                          : recruitmentCopy.cards.buttons.closed}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden rounded-2xl border border-emerald-500/10 bg-slate-950/60 p-6"
                        >
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                                {recruitmentCopy.cards.responsibilities}
                              </h4>
                              {(() => {
                                const responsibilities = Array.isArray(job?.responsibilities)
                                  ? job.responsibilities
                                  : [];

                                if (!responsibilities.length) {
                                  return (
                                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                                      <li>{recruitmentCopy.cards.responsibilitiesEmpty}</li>
                                    </ul>
                                  );
                                }

                                return (
                                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                    {responsibilities.map((item, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <ChevronRight className="mt-0.5 h-4 w-4 text-emerald-300" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                );
                              })()}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                                {recruitmentCopy.cards.candidateProfile}
                              </h4>
                              <div className="mt-3 space-y-3 text-sm text-slate-300">
                                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                                  <span className="block text-xs uppercase tracking-wider text-slate-200">
                                    {recruitmentCopy.cards.experience}
                                  </span>
                                  <span>
                                    {job?.experience_required || recruitmentCopy.cards.experienceFallback}
                                  </span>
                                </div>
                                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                                  <span className="block text-xs uppercase tracking-wider text-slate-200">
                                    {recruitmentCopy.cards.contractType}
                                  </span>
                                  <span>{job?.employment_type || recruitmentCopy.cards.contractFallback}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {archivedJobPostings.length > 0 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{recruitmentCopy.archive.title}</h3>
            <span className="text-xs uppercase tracking-wider text-slate-500">
              {archiveTotalLabel}
            </span>
          </div>
          <p className="text-sm text-slate-200">{recruitmentCopy.archive.description}</p>
          <div className="space-y-3">
            {archivePreview.map((job) => {
              const division = job?.computedDivision || job?.department || recruitmentCopy.cards.departmentFallback;
              const hasDownload = Boolean(
                job?.download_pack_url ||
                job?.pack_url ||
                job?.document_url ||
                job?.gazette_url ||
                (Array.isArray(job?.attachments) && job.attachments.some((item) => item?.url || item?.download_url))
              );

              return (
                <div
                  key={`archive-${job?.job_id || job?.title}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{job?.title}</p>
                    <p className="text-xs text-slate-500">
                      {division}
                      <span className="px-2 text-slate-600">•</span>
                      {formatRelativeTime(job?.computedPublishedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasDownload && (
                      <button
                        onClick={() => handleDownloadPack(job)}
                        className="flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1.5 text-[11px] font-medium text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {recruitmentCopy.archive.download}
                      </button>
                    )}
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wider text-slate-200">
                      {recruitmentCopy.cards.statusLabels.closed}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {archivedJobPostings.length > archivePreview.length && (
            <p className="text-xs text-slate-500">{recruitmentCopy.archive.moreHint}</p>
          )}
        </div>
      )}

    </motion.section>
    );
  };

  const renderDashboardSection = () => (
    <motion.section
      key="dashboard"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            {dashboardCopy.heading}
          </h2>
          <p className="text-slate-300">{dashboardCopy.description}</p>
        </div>
      </div>

      {dashboardData ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <DashboardMetric
              icon={FileText}
              label={dashboardCopy.metrics.submitted}
              primary={dashboardData?.statistics?.submitted_applications || 0}
              accent="from-cyan-500 to-blue-600"
            />
            <DashboardMetric
              icon={CheckCircle}
              label={dashboardCopy.metrics.underReview}
              primary={dashboardData?.statistics?.under_review_applications || 0}
              accent="from-emerald-500 to-teal-500"
            />
            <DashboardMetric
              icon={Clock}
              label={dashboardCopy.metrics.awaiting}
              primary={dashboardData?.statistics?.pending_documents || 0}
              accent="from-amber-500 to-orange-500"
            />
            <DashboardMetric
              icon={Bell}
              label={dashboardCopy.metrics.unread}
              primary={dashboardData?.notifications?.length || 0}
              accent="from-purple-500 to-pink-500"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{dashboardCopy.recent.title}</h3>
                  <span className="text-xs uppercase tracking-wider text-slate-200">
                    {dashboardCopy.recent.subtitle}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {dashboardData?.recent_applications?.length ? (
                    dashboardData?.recent_applications?.map((application, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-200">{application?.title}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-200">
                            <span>{application?.submitted_on || application?.submission_date}</span>
                            <span>{dashboardCopy.recent.separator}</span>
                            <span>
                              {application?.application_type === 'procurement'
                                ? dashboardCopy.recent.types.procurement
                                : dashboardCopy.recent.types.recruitment}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                            application?.status === 'under_review'
                              ? 'bg-amber-500/10 text-amber-300'
                              : application?.status === 'submitted'
                                ? 'bg-cyan-500/10 text-cyan-300'
                              : 'bg-emerald-500/10 text-emerald-300'
                          }`}
                        >
                          {(() => {
                            const normalizedStatus = (application?.status || '').toLowerCase();
                            return (
                              dashboardStatusLabels[normalizedStatus] ||
                              translate(
                                'dashboard.recent.status.generic',
                                dashboardCopy.recent.status.generic,
                                {
                                  status: (application?.status || 'submitted').replace('_', ' ')
                                }
                              )
                            );
                          })()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-6 text-center text-slate-200">
                      {dashboardCopy.recent.empty}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="text-xl font-semibold text-white">{dashboardCopy.notifications.title}</h3>
                <div className="mt-4 space-y-3">
                  {dashboardData?.notifications?.length ? (
                    dashboardData?.notifications?.map((notification, index) => (
                      <div key={index} className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                        <p className="text-sm font-medium text-slate-200">{notification?.title}</p>
                        <p className="mt-1 text-xs text-slate-200">{notification?.message}</p>
                        <span className="mt-2 block text-xs text-slate-500">{notification?.sent_date}</span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-6 text-center text-slate-200">
                      {dashboardCopy.notifications.empty}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <h3 className="text-xl font-semibold text-white">{dashboardCopy.support.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{dashboardCopy.support.description}</p>
                <button className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">
                  <Phone className="h-4 w-4" />
                  {dashboardCopy.support.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-300">
          <Settings className="mx-auto mb-4 h-10 w-10 text-slate-500" />
          {loading ? dashboardCopy.loading.fetching : dashboardCopy.loading.empty}
        </div>
      )}
    </motion.section>
  );

  const LoginModal = () => (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur"
          onClick={() => setShowLoginModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-slate-100 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-cyan-300">
              <User className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.3em]">{modalCopy.login.badge}</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-white">{modalCopy.login.title}</h3>
            <p className="mt-2 text-sm text-slate-200">{modalCopy.login.description}</p>

            {formErrors?.login && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <AlertTriangle className="h-4 w-4" />
                {formErrors?.login}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-200">{modalCopy.login.emailLabel}</label>
                <input
                  type="email"
                  required
                  value={loginForm?.email}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                  placeholder={modalCopy.login.emailPlaceholder}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-200">{modalCopy.login.passwordLabel}</label>
                <input
                  type="password"
                  required
                  value={loginForm?.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                  placeholder={modalCopy.login.passwordPlaceholder}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
                {submitting ? modalCopy.login.submitting : modalCopy.login.submit}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
              <span className="text-slate-200">{modalCopy.login.switchPrompt}</span>{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegistrationModal(true);
                }}
                className="font-medium text-cyan-300 hover:text-cyan-200"
                disabled={submitting}
              >
                {modalCopy.login.switchCta}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // OLD DARK REGISTRATION MODAL REMOVED - Using EnhancedRegistration component instead

  const ApplicationModal = ({ type, item }) => (
    <AnimatePresence>
      {showApplicationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur"
          onClick={() => {
            setShowApplicationModal(false);
            setSelectedNotice(null);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-300">
                  {type === 'procurement' ? 'Proposal submission' : 'Career application'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {item?.title || 'Application'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedNotice(null);
                }}
                className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
              {formErrors?.application && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  {formErrors?.application}
                </div>
              )}

              {uploading && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
                  <Loader className="h-4 w-4 animate-spin" />
                  {modalCopy.application.uploading}
                </div>
              )}

              {type === 'procurement' ? (
                <form
                  onSubmit={(event) => {
                    const formData = new FormData(event.target);
                    const payload = {
                      company_name: formData.get('company_name'),
                      technical_proposal: formData.get('technical_proposal'),
                      financial_proposal: formData.get('financial_proposal'),
                      delivery_timeline: formData.get('delivery_timeline'),
                      warranty_period: formData.get('warranty_period'),
                      payment_terms: formData.get('payment_terms'),
                      additional_information: formData.get('additional_information')
                    };
                    handleApplicationSubmit(event, payload);
                  }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100">
                    <div className="font-medium text-cyan-200">{item?.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-cyan-200/80">
                      <span>
                        {modalCopy.application.shared.summaryDeadlineLabel}:{' '}
                        {item?.submission_deadline || modalCopy.application.shared.summaryDeadlineFallback}
                      </span>
                      <span>{modalCopy.application.shared.separator}</span>
                      <span>
                        {modalCopy.application.procurement.summaryValueLabel}:{' '}
                        {item?.estimated_value || modalCopy.application.procurement.summaryValueFallback}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-200">
                        {modalCopy.application.procurement.fields.companyName}
                      </label>
                      <input
                        name="company_name"
                        type="text"
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-200">
                        {modalCopy.application.procurement.fields.deliveryTimeline}
                      </label>
                      <input
                        name="delivery_timeline"
                        type="number"
                        min="0"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-200">
                      {modalCopy.application.procurement.fields.technical}
                    </label>
                    <textarea
                      name="technical_proposal"
                      rows={6}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                      placeholder={modalCopy.application.procurement.placeholders.technical}
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-200">
                        {modalCopy.application.procurement.fields.financial}
                      </label>
                      <input
                        name="financial_proposal"
                        type="number"
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-200">
                        {modalCopy.application.procurement.fields.warranty}
                      </label>
                      <input
                        name="warranty_period"
                        type="number"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-200">
                      {modalCopy.application.procurement.fields.paymentTerms}
                    </label>
                    <input
                      name="payment_terms"
                      type="text"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                      placeholder={modalCopy.application.procurement.placeholders.paymentTerms}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-200">
                      {modalCopy.application.procurement.fields.additionalInformation}
                    </label>
                    <textarea
                      name="additional_information"
                      rows={3}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                      placeholder={modalCopy.application.procurement.placeholders.additionalInformation}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-wider text-slate-200">
                      {modalCopy.application.procurement.uploadLabel}
                    </label>
                    <div className="grid gap-3">
                      {(item?.documents_required || modalCopy.application.procurement.fallbackDocuments).map((doc, index) => (
                        <div
                          key={`${doc}-${index}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
                        >
                          <span>{doc}</span>
                          <div>
                            <input
                              id={`proc-doc-${index}`}
                              type="file"
                              multiple
                              data-document-type={doc}
                              onChange={(event) => handleFileUpload(event, doc)}
                              className="hidden"
                              disabled={submitting || uploading}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <label
                              htmlFor={`proc-doc-${index}`}
                              className="inline-flex items-center gap-2 rounded-full border border-cyan-400 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadedFiles?.[doc]?.length
                                ? `${uploadedFiles[doc].length} ${modalCopy.application.shared.filesSuffix}`
                                : modalCopy.application.shared.upload}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplicationModal(false);
                        setSelectedNotice(null);
                      }}
                      className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500"
                      disabled={submitting || uploading}
                    >
                      {modalCopy.application.shared.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || uploading}
                      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {submitting
                        ? modalCopy.application.shared.submitting
                        : modalCopy.application.shared.submitProposal}
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={(event) => {
                    const formData = new FormData(event.target);
                    const payload = {
                      full_name: formData.get('full_name'),
                      email: formData.get('email'),
                      phone: formData.get('phone'),
                      cover_letter: formData.get('cover_letter'),
                      linkedin_profile: formData.get('linkedin_profile')
                    };
                    handleApplicationSubmit(event, payload);
                  }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-100">
                    <div className="font-medium text-emerald-200">{item?.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-emerald-200/80">
                      <span>
                        {modalCopy.application.recruitment.summaryDepartmentLabel}:{' '}
                        {item?.department || modalCopy.application.recruitment.summaryDepartmentFallback}
                      </span>
                      <span>{modalCopy.application.shared.separator}</span>
                      <span>
                        {modalCopy.application.recruitment.summaryDeadlineLabel}:{' '}
                        {item?.application_deadline || modalCopy.application.recruitment.summaryDeadlineFallback}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-200">
                      {modalCopy.application.recruitment.fields.fullName}
                    </label>
                    <input
                      name="full_name"
                      type="text"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-200">
                        {modalCopy.application.recruitment.fields.email}
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-200">
                        {modalCopy.application.recruitment.fields.phone}
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-200">
                      {modalCopy.application.recruitment.fields.coverLetter}
                    </label>
                    <textarea
                      name="cover_letter"
                      rows={6}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                      placeholder={modalCopy.application.recruitment.placeholders.coverLetter}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-200">
                      {modalCopy.application.recruitment.fields.portfolio}
                    </label>
                    <input
                      name="linkedin_profile"
                      type="url"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                      placeholder={modalCopy.application.recruitment.placeholders.portfolio}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-wider text-slate-200">
                      {modalCopy.application.recruitment.uploadLabel}
                    </label>
                    <div className="grid gap-3">
                      {(item?.documents_required || modalCopy.application.recruitment.fallbackDocuments).map((doc, index) => (
                        <div
                          key={`${doc}-${index}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
                        >
                          <span>{doc}</span>
                          <div>
                            <input
                              id={`job-doc-${index}`}
                              type="file"
                              data-document-type={doc}
                              onChange={(event) => handleFileUpload(event, doc)}
                              className="hidden"
                              disabled={submitting || uploading}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <label
                              htmlFor={`job-doc-${index}`}
                              className="inline-flex items-center gap-2 rounded-full border border-emerald-400 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/10"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadedFiles?.[doc]?.length
                                ? `${uploadedFiles[doc].length} ${modalCopy.application.shared.filesSuffix}`
                                : modalCopy.application.shared.upload}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplicationModal(false);
                        setSelectedNotice(null);
                      }}
                      className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500"
                      disabled={submitting || uploading}
                    >
                      {modalCopy.application.shared.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || uploading}
                      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {submitting
                        ? modalCopy.application.shared.submitting
                        : modalCopy.application.shared.submitApplication}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(12,74,110,0.35),_transparent_65%)]" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-16 pt-20 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-cyan-200">
                <Sparkles className="h-4 w-4" />
                {translate('hero.badge', 'NARA Digital Procurement & Recruitment')}
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
                {translate(
                  'hero.title',
                  'Seamless tenders & talent journeys for Sri Lanka’s ocean innovation hub'
                )}
              </h1>
              <p className="text-lg text-slate-300 md:text-xl">
                {translate(
                  'hero.description',
                  'Manage procurement submissions, collaborate with evaluators, and apply to multidisciplinary roles—all in one secure digital workspace governed by NARA.'
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('procurement')}
                  className={`flex items-center gap-2 rounded-full border border-cyan-500/40 px-5 py-3 text-sm font-semibold transition ${
                    activeTab === 'procurement'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-cyan-200 hover:border-cyan-300 hover:text-white'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  {translate('hero.actions.procurement', 'Browse procurement')}
                </button>
                <button
                  onClick={() => setActiveTab('recruitment')}
                  className={`flex items-center gap-2 rounded-full border border-emerald-500/40 px-5 py-3 text-sm font-semibold transition ${
                    activeTab === 'recruitment'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'text-emerald-200 hover:border-emerald-300 hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  {translate('hero.actions.recruitment', 'View career roles')}
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={() => setShowRegistrationModal(true)}
                    className="flex items-center gap-2 rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {translate('hero.actions.createAccount', 'Create account')}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-cyan-300" />
                  <span>
                    {translate('hero.highlights.security', 'GovTech security & transparent audit trails')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe2 className="h-4 w-4 text-emerald-300" />
                  <span>
                    {translate('hero.highlights.policy', 'Integrated with national procurement policy')}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
              <div className="absolute -top-10 -right-6 h-28 w-28 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="absolute bottom-8 left-10 h-24 w-24 rounded-full bg-emerald-500/20 blur-3xl" />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-200">
                    {translate('hero.timeline.title', 'Live timeline')}
                  </span>
                  <button
                    onClick={handleManualRefresh}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {translate('hero.timeline.refresh', 'Refresh data')}
                  </button>
                </div>

                <div className="space-y-5 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                    <div>
                      <p className="font-medium text-slate-100">
                        {translate(
                          'hero.timeline.items.0.title',
                          'Digital tender submissions rated in under 12 days'
                        )}
                      </p>
                      <p className="text-xs text-slate-200">
                        {translate('hero.timeline.items.0.subtitle', 'Average evaluation cycle across Q1 2024')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    <div>
                      <p className="font-medium text-slate-100">
                        {translate(
                          'hero.timeline.items.1.title',
                          'Trusted vendor network powering coastal modernization'
                        )}
                      </p>
                      <p className="text-xs text-slate-200">
                        {translate('hero.timeline.items.1.subtitle', '1,200+ pre-qualified partners nationwide')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                    <div>
                      <p className="font-medium text-slate-100">
                        {translate(
                          'hero.timeline.items.2.title',
                          'Scholarship-backed research fellowships live now'
                        )}
                      </p>
                      <p className="text-xs text-slate-200">
                        {translate(
                          'hero.timeline.items.2.subtitle',
                          'Work alongside NARA scientists on ocean intelligence'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {authLoading ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <Loader className="h-4 w-4 animate-spin text-cyan-300" />
                      <span>{translate('hero.auth.loading', 'Checking your secure session…')}</span>
                    </div>
                  </div>
                ) : isAuthenticated ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-cyan-300" />
                      <span>
                        {translate('hero.auth.welcome', 'Welcome back, {{name}}.', {
                          name: user?.first_name || user?.email || translate('hero.auth.visitor', 'partner')
                        })}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="inline-flex items-center gap-2 rounded-full border border-cyan-400 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
                      >
                        {translate('hero.auth.goToWorkspace', 'Go to workspace')}
                      </button>
                      <button
                        onClick={() => setShowUserProfile(true)}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-400 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-500/10"
                      >
                        <User className="h-3 w-3" />
                        View Profile
                      </button>
                      <button
                        onClick={logout}
                        className="inline-flex items-center gap-2 rounded-full border border-red-400 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
                      >
                        {translate('hero.auth.logout', 'Logout')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-cyan-300" />
                      <span>
                        {translate(
                          'hero.auth.prompt',
                          'Already registered? Secure login for vendors & candidates.'
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-400 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
                    >
                      {translate('hero.auth.launchLogin', 'Launch login')}
                    </button>
                    {authError && (
                      <div className="mt-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                        {authError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {heroMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{metric.label}</span>
                    <div className="mt-3 text-3xl font-semibold text-white">{metric.value}</div>
                    <p className="mt-2 text-sm text-slate-200">{metric.hint}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-cyan-200">
                    <metric.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.key === activeTab;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                      : 'border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-slate-200">
            {activeTabMeta?.description}
          </div>
        </div>
      </nav>

      {error && (
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="rounded-full border border-red-400/40 p-1 text-red-200 transition hover:border-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <main className="relative mx-auto max-w-7xl px-4 py-12 md:px-6">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center text-slate-300">
            <Loader className="h-8 w-8 animate-spin text-cyan-300" />
            <p>{loadingCopy.fetching}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!loading && activeTab === 'procurement' && renderProcurementSection()}
          {!loading && activeTab === 'recruitment' && renderRecruitmentSection()}
          {!loading && activeTab === 'dashboard' && isAuthenticated && renderDashboardSection()}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/80 py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 text-center md:px-6">
          <h2 className="text-3xl font-semibold text-white">{footerCopy.heading}</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-300">{footerCopy.description}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveTab('procurement')}
              className="flex items-center gap-2 rounded-full border border-cyan-400 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
            >
              <FileText className="h-4 w-4" />
              {footerCopy.procurementCta}
            </button>
            <button
              onClick={() => setActiveTab('recruitment')}
              className="flex items-center gap-2 rounded-full border border-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/10"
            >
              <Users className="h-4 w-4" />
              {footerCopy.recruitmentCta}
            </button>
          </div>
        </div>
      </footer>

      <LoginModal />

      {/* Enhanced Registration Modal with CV Upload */}
      {showRegistrationModal && (
        <EnhancedRegistration
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={(user) => {
            console.log('User registered successfully:', user);
            setShowRegistrationModal(false);
            // Optionally auto-login or show success message
          }}
          translations={modalCopy.registration}
        />
      )}

      {/* User Profile Modal */}
      {showUserProfile && user && (
        <UserProfile
          userId={user.userId || user.uid}
          onClose={() => setShowUserProfile(false)}
        />
      )}

      <ApplicationModal type={activeTab} item={selectedNotice} />
    </div>
  );
};

const DashboardMetric = ({ icon: Icon, label, primary, accent }) => (
  <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
    <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-10`} />
    <div className="relative space-y-4">
      <div className="inline-flex rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-cyan-200">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</span>
        <div className="mt-3 text-3xl font-semibold text-white">{primary}</div>
      </div>
    </div>
  </div>
);

export default ProcurementRecruitmentPortal;
