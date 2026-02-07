import React, { useState, useEffect, useMemo } from 'react';
import SEOHead from '../../components/shared/SEOHead';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MultilingualContent from '../../components/compliance/MultilingualContent';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Users,
  BarChart3,
  ThumbsUp,
  Send,
  Search,
  Clock,
  TrendingUp,
  Heart,
  Map as MapIcon,
  Home as HomeIcon,
  AlertTriangle,
  MessageCircle,
  Fish,
  FlaskConical,
  Waves,
  ShieldCheck,
  ChevronRight,
  Phone
} from 'lucide-react';

import {
  consultationService,
  feedbackService,
  commentService,
  analyticsService
} from '../../services/publicConsultationService';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  open: 'bg-green-100 text-green-800',
  closed: 'bg-red-100 text-red-800',
  archived: 'bg-blue-100 text-blue-800'
};

const sentimentColors = {
  positive: 'bg-green-100 text-green-800',
  negative: 'bg-red-100 text-red-800',
  neutral: 'bg-gray-100 text-gray-800'
};

const categoryIcons = {
  marine_policy: Users,
  environmental: MessageSquare,
  fisheries: BarChart3,
  conservation: TrendingUp
};

const toObject = (value) => (value && typeof value === 'object' ? value : {});

const PUBLIC_SERVICE_ACTIONS = [
  {
    key: 'fishAdvisory',
    icon: Fish,
    route: '/fish-advisory-system'
  },
  {
    key: 'laboratoryTesting',
    icon: FlaskConical,
    route: '/lab-results'
  },
  {
    key: 'marineForecast',
    icon: Waves,
    route: '/marine-forecast'
  },
  {
    key: 'emergencyResponse',
    icon: AlertTriangle,
    route: '/emergency-response-network'
  }
];

const PUBLIC_ADVISORIES = [
  {
    id: 'pub-adv-1',
    key: 'monsoonConditions',
    tone: 'high'
  },
  {
    id: 'pub-adv-2',
    key: 'fishSafetyBulletin',
    tone: 'low'
  },
  {
    id: 'pub-adv-3',
    key: 'laboratoryIntakeNotice',
    tone: 'medium'
  }
];

const advisoryToneClasses = {
  high: 'border-red-300/40 bg-red-500/10 text-red-100',
  medium: 'border-amber-300/40 bg-amber-500/10 text-amber-100',
  low: 'border-cyan-300/40 bg-cyan-500/10 text-cyan-100'
};

const PublicConsultationPortal = () => {
  const { t, i18n } = useTranslation('publicConsultation');
  const navigate = useNavigate();
  const language = useMemo(() => (i18n.language || 'en').split('-')[0], [i18n.language]);

  const heroStrings = toObject(t('hero', { returnObjects: true }));
  const navStrings = toObject(t('nav', { returnObjects: true }));
  const sections = toObject(t('sections', { returnObjects: true }));
  const feedbackStrings = toObject(t('feedback', { returnObjects: true }));
  const filterStrings = toObject(t('filters', { returnObjects: true }));
  const detailsStrings = toObject(t('details', { returnObjects: true }));
  const alerts = toObject(t('alerts', { returnObjects: true }));
  const statusStrings = toObject(t('status', { returnObjects: true }));
  const sentimentStrings = toObject(t('feedback.sentiments', { returnObjects: true }));
  const categoryStrings = toObject(t('category', { returnObjects: true }));

  const [activeView, setActiveView] = useState('browse');
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [consultationDetails, setConsultationDetails] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [comments, setComments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', category: 'all', searchTerm: '' });
  const [loading, setLoading] = useState(true);

  const [feedbackForm, setFeedbackForm] = useState({
    submittedBy: '',
    submitterEmail: '',
    message: '',
    sentiment: 'neutral'
  });

  const [commentForm, setCommentForm] = useState({
    commenterName: '',
    commenterEmail: '',
    comment: ''
  });

  useEffect(() => {
    const loadConsultations = async () => {
      setLoading(true);
      const { data } = await consultationService.getAll();
      if (data) setConsultations(data);
      setLoading(false);
    };

    loadConsultations();
  }, []);

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: filterStrings.statusOptions?.all },
      { value: 'open', label: filterStrings.statusOptions?.open },
      { value: 'closed', label: filterStrings.statusOptions?.closed }
    ],
    [filterStrings]
  );

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: filterStrings.categoryOptions?.all },
      { value: 'marine_policy', label: filterStrings.categoryOptions?.marine_policy },
      { value: 'environmental', label: filterStrings.categoryOptions?.environmental },
      { value: 'fisheries', label: filterStrings.categoryOptions?.fisheries },
      { value: 'conservation', label: filterStrings.categoryOptions?.conservation }
    ],
    [filterStrings]
  );

  const publicServiceActions = useMemo(
    () =>
      PUBLIC_SERVICE_ACTIONS.map((service) => ({
        ...service,
        title: t(`publicServices.actions.${service.key}.title`),
        description: t(`publicServices.actions.${service.key}.description`),
        badge: t(`publicServices.actions.${service.key}.badge`),
      })),
    [t]
  );

  const publicAdvisories = useMemo(
    () =>
      PUBLIC_ADVISORIES.map((item) => ({
        ...item,
        title: t(`publicServices.advisories.items.${item.key}.title`),
        message: t(`publicServices.advisories.items.${item.key}.message`),
      })),
    [t]
  );

  const filteredConsultations = useMemo(
    () =>
      consultations.filter((consultation) => {
        const matchesStatus = filters.status === 'all' || consultation.status === filters.status;
        const matchesCategory = filters.category === 'all' || consultation.category === filters.category;
        const matchesSearch =
          !filters.searchTerm ||
          consultation.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          consultation.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
        return matchesStatus && matchesCategory && matchesSearch;
      }),
    [consultations, filters]
  );

  const fetchConsultationDetails = async (id) => {
    const item = consultations.find((c) => c.id === id);
    if (!item) return;

    const [detailsRes, feedbackRes, commentsRes, analyticsRes] = await Promise.all([
      consultationService.getById(id),
      feedbackService.getByConsultationId(item.consultationId),
      commentService.getByConsultationId(item.consultationId),
      analyticsService.getConsultationAnalytics(item.consultationId)
    ]);

    if (detailsRes.data) setConsultationDetails(detailsRes.data);
    if (feedbackRes.data) setFeedback(feedbackRes.data);
    if (commentsRes.data) setComments(commentsRes.data);
    if (analyticsRes.data) setAnalytics(analyticsRes.data);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedConsultation) {
      alert(alerts.selectConsultation);
      return;
    }

    const { error } = await feedbackService.submit(selectedConsultation.consultationId, feedbackForm);
    if (error) {
      alert(t('alerts.feedbackError', { error }));
      return;
    }

    alert(alerts.feedbackSuccess);
    setFeedbackForm({ submittedBy: '', submitterEmail: '', message: '', sentiment: 'neutral' });
    fetchConsultationDetails(selectedConsultation.id);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!selectedConsultation) {
      alert(alerts.selectConsultation);
      return;
    }

    const { error } = await commentService.add(selectedConsultation.consultationId, commentForm);
    if (error) {
      alert(t('alerts.commentError', { error }));
      return;
    }

    alert(alerts.commentSuccess);
    setCommentForm({ commenterName: '', commenterEmail: '', comment: '' });
    fetchConsultationDetails(selectedConsultation.id);
  };

  const handleUpvoteFeedback = async (feedbackId) => {
    await feedbackService.upvote(feedbackId, 'anonymous');
    if (selectedConsultation) fetchConsultationDetails(selectedConsultation.id);
  };

  const handleLikeComment = async (commentId) => {
    await commentService.like(commentId);
    if (selectedConsultation) fetchConsultationDetails(selectedConsultation.id);
  };

  const navTabs = useMemo(
    () => [
      { id: 'browse', label: navStrings.browse, icon: HomeIcon },
      { id: 'map', label: navStrings.map, icon: MapIcon },
      { id: 'status', label: navStrings.status, icon: Search }
    ],
    [navStrings]
  );

  const mapLegendItems = useMemo(
    () => [
      t('sections.mapItems.fishKill'),
      t('sections.mapItems.stranding'),
      t('sections.mapItems.algalBloom'),
      t('sections.mapItems.pollution'),
      t('sections.mapItems.unusualBehavior')
    ],
    [t]
  );

  const renderHero = () => (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-7xl px-4 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
          <AlertTriangle className="h-5 w-5" />
          <span>{heroStrings.badge}</span>
        </div>
        <h1 className="mb-4 text-5xl font-bold md:text-6xl">{heroStrings.title}</h1>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-blue-100">{heroStrings.description}</p>
        {analytics && (
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-lg">
              <div className="text-3xl font-bold">{analytics.overview?.totalIncidents || 0}</div>
              <div className="text-sm text-blue-100">{heroStrings.stats?.totalIncidents}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-lg">
              <div className="text-3xl font-bold">{analytics.overview?.activeIncidents || 0}</div>
              <div className="text-sm text-blue-100">{heroStrings.stats?.activeCases}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-lg">
              <div className="text-3xl font-bold">{analytics.overview?.totalObservations || 0}</div>
              <div className="text-sm text-blue-100">{heroStrings.stats?.observations}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-lg">
              <div className="text-3xl font-bold">{analytics.overview?.resolvedIncidents || 0}</div>
              <div className="text-sm text-blue-100">{heroStrings.stats?.resolved}</div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );

  const renderPublicServiceIntegration = () => (
    <section className="-mt-6 border-b border-white/10 bg-slate-900/55 pb-6 text-white backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-2xl border border-cyan-300/30 bg-white/10 p-4 shadow-lg shadow-slate-900/20 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t('publicServices.badge')}
              </p>
              <h2 className="mt-2 text-lg font-bold md:text-xl">{t('publicServices.title')}</h2>
              <p className="text-sm text-blue-100">{t('publicServices.description')}</p>
            </div>
            <button
              onClick={() => navigate('/emergency-response-network')}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              <AlertTriangle className="h-4 w-4" />
              {t('publicServices.emergencyCta')}
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {publicServiceActions.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <button
                  key={service.key}
                  onClick={() => navigate(service.route)}
                  className="rounded-xl border border-white/20 bg-slate-900/35 p-3 text-left transition-all hover:border-cyan-300/50 hover:bg-slate-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-100">
                      <ServiceIcon className="h-4.5 w-4.5" />
                    </div>
                    <span className="rounded-full border border-cyan-200/40 bg-cyan-400/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-100">{service.badge}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold">{service.title}</h3>
                  <p className="mt-1 text-xs text-blue-100">{service.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-100">
                    {t('publicServices.openAction')} <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-2 lg:grid-cols-3">
            {publicAdvisories.map((item) => (
              <article key={item.id} className={`rounded-lg border p-3 ${advisoryToneClasses[item.tone] || advisoryToneClasses.low}`}>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed">{item.message}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm md:flex-row md:items-center md:justify-between">
            <p className="text-red-100">{t('publicServices.emergencySupportLine')}</p>
            <a
              href="tel:1919"
              className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Phone className="h-3.5 w-3.5" />
              {t('publicServices.callNow', { number: '1919' })}
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  const renderTabs = () => (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 font-medium transition-all ${
              activeView === tab.id ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderBrowse = () => (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-blue-200">{filterStrings.searchLabel}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters((state) => ({ ...state, searchTerm: e.target.value }))}
                placeholder={filterStrings.searchPlaceholder}
                className="w-full rounded-lg border border-white/20 bg-white/10 py-2 pl-10 pr-4 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-blue-200">{filterStrings.statusLabel}</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((state) => ({ ...state, status: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-slate-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-blue-200">{filterStrings.categoryLabel}</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters((state) => ({ ...state, category: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-slate-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-blue-200">{t('filters.results', { count: filteredConsultations.length })}</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredConsultations.map((consultation) => {
          const IconComponent = categoryIcons[consultation.category] || MessageSquare;
          return (
            <motion.div
              key={consultation.id}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg"
              onClick={() => {
                setSelectedConsultation(consultation);
                fetchConsultationDetails(consultation.id);
                setActiveView('status');
              }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                    <IconComponent className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[consultation.status] || statusColors.draft}`}>
                    {statusStrings[consultation.status] || consultation.status}
                  </span>
                </div>
              </div>

              <h3 className="mb-2 text-lg font-bold text-white">{consultation.title}</h3>
              <p className="mb-4 line-clamp-2 text-sm text-blue-200">{consultation.description}</p>

              <div className="grid grid-cols-3 gap-4 text-sm text-blue-300">
                <div className="text-center">
                  <p className="font-semibold">{consultation.participantCount || 0}</p>
                  <p className="text-xs text-blue-400">{feedbackStrings.participants}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{consultation.feedbackCount || 0}</p>
                  <p className="text-xs text-blue-400">{feedbackStrings.feedback}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{consultation.commentCount || 0}</p>
                  <p className="text-xs text-blue-400">{feedbackStrings.comments}</p>
                </div>
              </div>

              {consultation.closingDate && (
                <div className="mt-4 border-t border-white/20 pt-4 text-xs text-blue-200">
                  <Clock className="mr-1 inline-block h-4 w-4" />
                  {t('cards.closes', { date: new Date(consultation.closingDate).toLocaleDateString() })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderMapView = () => (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-lg">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <MapIcon className="h-6 w-6 text-blue-600" />
          {sections.mapLegend}
        </h2>
        <div className="space-y-3">
          {mapLegendItems.map((label) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span className="flex h-4 w-4 items-center justify-center rounded-full border bg-blue-100"></span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStatusView = () => {
    if (!selectedConsultation || !consultationDetails) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-12 text-center text-gray-600">
          {t('statusView.empty')}
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setActiveView('browse')}
            className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            {t('statusView.back')}
          </button>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[consultationDetails.status] || statusColors.draft}`}>
            {statusStrings[consultationDetails.status] || consultationDetails.status}
          </span>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">{consultationDetails.title}</h2>
          <p className="mb-6 text-gray-600">{consultationDetails.description}</p>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-xs text-gray-500">{t('statusView.reportedOn')}</div>
              <div className="text-sm font-semibold text-gray-900">
                {new Date(consultationDetails.publishedAt?.seconds * 1000).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">{t('statusView.incidentType')}</div>
              <div className="text-sm font-semibold text-gray-900">{categoryStrings[consultationDetails.category] || consultationDetails.category}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">{t('statusView.status')}</div>
              <div className="text-sm font-semibold text-gray-900">{statusStrings[consultationDetails.status] || consultationDetails.status}</div>
            </div>
          </div>
        </div>

        {selectedConsultation?.status === 'open' && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Send className="h-6 w-6 text-blue-600" />
              {detailsStrings.submitTitle}
            </h3>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">{detailsStrings.nameLabel}</label>
                  <input
                    type="text"
                    value={feedbackForm.submittedBy}
                    onChange={(e) => setFeedbackForm((state) => ({ ...state, submittedBy: e.target.value }))}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder={detailsStrings.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">{detailsStrings.emailLabel}</label>
                  <input
                    type="email"
                    value={feedbackForm.submitterEmail}
                    onChange={(e) => setFeedbackForm((state) => ({ ...state, submitterEmail: e.target.value }))}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder={detailsStrings.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">{detailsStrings.feedbackLabel}</label>
                <textarea
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm((state) => ({ ...state, message: e.target.value }))}
                  required
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder={detailsStrings.feedbackPlaceholder}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">{detailsStrings.sentimentLabel}</label>
                <select
                  value={feedbackForm.sentiment}
                  onChange={(e) => setFeedbackForm((state) => ({ ...state, sentiment: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  {['positive', 'neutral', 'negative'].map((sentiment) => (
                    <option key={sentiment} value={sentiment}>
                      {sentimentStrings[sentiment]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Send className="h-5 w-5" />
                {detailsStrings.submitButton}
              </button>
            </form>
          </div>
        )}

        {feedback.length > 0 && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">{detailsStrings.communityTitle}</h3>
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{item.submittedBy || feedbackStrings.anonymous}</p>
                      <p className="text-xs text-gray-500">{item.submittedAt?.toDate?.()?.toLocaleString() || feedbackStrings.notAvailable}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${sentimentColors[item.sentiment] || sentimentColors.neutral}`}>
                      {feedbackStrings.sentiments[item.sentiment] || item.sentiment}
                    </span>
                  </div>
                  <p className="mb-3 text-gray-700">{item.message}</p>
                  <button
                    onClick={() => handleUpvoteFeedback(item.feedbackId)}
                    className="flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-700"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {t('feedback.upvotes', { count: item.upvotes || 0 })}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
            <MessageCircle className="h-6 w-6 text-purple-600" />
            {detailsStrings.discussionTitle}
          </h3>

          {selectedConsultation?.status === 'open' && (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="mb-4 grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={commentForm.commenterName}
                  onChange={(e) => setCommentForm((state) => ({ ...state, commenterName: e.target.value }))}
                  required
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder={detailsStrings.commentNamePlaceholder}
                />
                <input
                  type="email"
                  value={commentForm.commenterEmail}
                  onChange={(e) => setCommentForm((state) => ({ ...state, commenterEmail: e.target.value }))}
                  required
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder={detailsStrings.commentEmailPlaceholder}
                />
              </div>
              <textarea
                value={commentForm.comment}
                onChange={(e) => setCommentForm((state) => ({ ...state, comment: e.target.value }))}
                required
                rows={3}
                className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
                placeholder={detailsStrings.commentPlaceholder}
              />
              <button type="submit" className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-purple-700">
                {detailsStrings.commentSubmit}
              </button>
            </form>
          )}

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{comment.commenterName}</p>
                    <p className="text-xs text-gray-500">{comment.postedAt?.toDate?.()?.toLocaleString() || feedbackStrings.notAvailable}</p>
                  </div>
                  <button onClick={() => handleLikeComment(comment.commentId)} className="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-red-600">
                    <Heart className="h-4 w-4" />
                    <span>{comment.likes || 0}</span>
                  </button>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading && !consultations.length) {
    return (
      <MultilingualContent language={language}>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="text-center text-white">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-white"></div>
            <p>{t('loading.list')}</p>
          </div>
        </div>
      </MultilingualContent>
    );
  }

  return (
    <MultilingualContent language={language}>
        <SEOHead
          title={t('seo.title')}
          description={t('seo.description')}
          path="/public-consultation-portal"
          keywords={t('seo.keywords')}
        />
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
        {renderHero()}
        {renderPublicServiceIntegration()}
        {renderTabs()}
        <AnimatePresence mode="wait">
          {activeView === 'browse' && renderBrowse()}
          {activeView === 'map' && renderMapView()}
          {activeView === 'status' && renderStatusView()}
        </AnimatePresence>
      </div>
    </MultilingualContent>
  );
};

export default PublicConsultationPortal;
