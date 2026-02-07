import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Bookmark,
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Database,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  Globe,
  Heart,
  LineChart,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Waves,
  Fish,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import HeroImageCarousel from '../../components/hero/HeroImageCarousel';
import { getResearchContent } from '../../services/researchContentService';
import {
  RESEARCH_DECISION_OUTCOMES,
  RESEARCH_POLICY_BRIEF_CARDS,
  RESEARCH_PRIORITY_PROGRAMS,
  getFallbackPublications,
  normalizePublicationFromFirebase,
} from '../../data/researchEnhancedFallback';

import ActiveProjectsTab from './components/ActiveProjectsTab';
import ImpactAnalyticsTab from './components/ImpactAnalyticsTab';
import GlobalCollaborationTab from './components/GlobalCollaborationTab';

const ICON_MAP = {
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Database,
  FileCheck,
  FileText,
  Globe,
  Heart,
  LineChart,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Waves,
  Fish,
};

const METRICS_FALLBACK = [
  {
    id: 'publications',
    label: 'Total Publications',
    value: '1,247',
    change: '+15.3%',
    icon: 'FileText',
    description: 'Peer-reviewed and policy-linked publications',
  },
  {
    id: 'citations',
    label: 'Global Citations',
    value: '28,439',
    change: '+22.7%',
    icon: 'TrendingUp',
    description: 'Global usage of NARA research outputs',
  },
  {
    id: 'collaborations',
    label: 'Partner Institutions',
    value: '89',
    change: '+12',
    icon: 'Globe',
    description: 'Active local and international collaborations',
  },
  {
    id: 'projects',
    label: 'Active Projects',
    value: '156',
    change: '+18',
    icon: 'Target',
    description: 'Ongoing national and strategic programs',
  },
  {
    id: 'funding',
    label: 'Research Funding',
    value: '$12.4M',
    change: '+28%',
    icon: 'BarChart3',
    description: 'Current grant and mission investments',
  },
  {
    id: 'briefs',
    label: 'Policy Briefs',
    value: '124',
    change: '+18%',
    icon: 'FileCheck',
    description: 'Decision-support briefs delivered',
  },
];

const AREAS_FALLBACK = [
  { id: 'all', name: 'All Areas', count: 0, icon: 'BookOpen', color: 'slate' },
  { id: 'marine-biology', name: 'Marine Biology', count: 342, icon: 'Fish', color: 'cyan' },
  { id: 'climate', name: 'Climate Change', count: 218, icon: 'Waves', color: 'blue' },
  { id: 'fisheries', name: 'Fisheries', count: 189, icon: 'Fish', color: 'emerald' },
  { id: 'oceanography', name: 'Oceanography', count: 167, icon: 'Waves', color: 'indigo' },
  { id: 'conservation', name: 'Conservation', count: 143, icon: 'Heart', color: 'teal' },
  { id: 'policy', name: 'Policy', count: 98, icon: 'FileText', color: 'amber' },
];

const TABS_FALLBACK = [
  { id: 'publications', label: 'Publications', icon: 'FileText', count: '1,247' },
  { id: 'teams', label: 'Research Teams', icon: 'Users', count: '12' },
  { id: 'projects', label: 'Active Projects', icon: 'Target', count: '156' },
  { id: 'impact', label: 'Impact & Analytics', icon: 'BarChart3' },
  { id: 'collaboration', label: 'Global Collaboration', icon: 'Globe', count: '89' },
];

const TEAMS_FALLBACK = [
  {
    id: 'marine-biodiversity-lab',
    name: 'Marine Biodiversity Lab',
    lead: 'Dr. Priya Fernando',
    members: 24,
    projects: 12,
    publications: 156,
    funding: '$2.3M',
    focus: 'Coral reef ecosystems, marine species conservation, and biodiversity intelligence.',
  },
  {
    id: 'climate-oceanography-division',
    name: 'Climate & Oceanography Division',
    lead: 'Dr. Nimal Perera',
    members: 18,
    projects: 9,
    publications: 127,
    funding: '$3.1M',
    focus: 'Sea level rise, climate impact modelling, and operational ocean observations.',
  },
  {
    id: 'sustainable-fisheries-group',
    name: 'Sustainable Fisheries Group',
    lead: 'Dr. Ayesha Khan',
    members: 15,
    projects: 8,
    publications: 98,
    funding: '$1.8M',
    focus: 'Stock assessment, gear innovation, and fisheries policy readiness.',
  },
];

const AREA_CLASS_MAP = {
  slate: {
    active: 'bg-slate-200/20 border-slate-200/70 text-slate-100',
    inactive: 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10',
  },
  cyan: {
    active: 'bg-cyan-500/20 border-cyan-300/70 text-cyan-100',
    inactive: 'bg-white/5 border-white/15 text-slate-200 hover:bg-cyan-500/10',
  },
  blue: {
    active: 'bg-blue-500/20 border-blue-300/70 text-blue-100',
    inactive: 'bg-white/5 border-white/15 text-slate-200 hover:bg-blue-500/10',
  },
  emerald: {
    active: 'bg-emerald-500/20 border-emerald-300/70 text-emerald-100',
    inactive: 'bg-white/5 border-white/15 text-slate-200 hover:bg-emerald-500/10',
  },
  indigo: {
    active: 'bg-indigo-500/20 border-indigo-300/70 text-indigo-100',
    inactive: 'bg-white/5 border-white/15 text-slate-200 hover:bg-indigo-500/10',
  },
  teal: {
    active: 'bg-teal-500/20 border-teal-300/70 text-teal-100',
    inactive: 'bg-white/5 border-white/15 text-slate-200 hover:bg-teal-500/10',
  },
  amber: {
    active: 'bg-amber-500/20 border-amber-300/70 text-amber-100',
    inactive: 'bg-white/5 border-white/15 text-slate-200 hover:bg-amber-500/10',
  },
};

const resolveIcon = (iconName, fallback = BookOpen) => ICON_MAP[iconName] || fallback;

const safeText = (value, fallback = '') => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return value.en || value.si || value.ta || fallback;
  return fallback;
};

const toPublicationCard = (item) => ({
  id: item.id,
  title: safeText(item.title, 'Untitled publication'),
  authors: Array.isArray(item.authors)
    ? item.authors
    : typeof item.authors === 'string'
      ? item.authors.split(',').map((name) => name.trim()).filter(Boolean)
      : [],
  area: item.area || item.category || 'Marine Research',
  year: Number(item.year) || new Date(item.publicationDate || Date.now()).getFullYear(),
  journal: item.journal || 'NARA Research Archive',
  type: item.type || 'Research Publication',
  citations: Number(item.citations || item.views || 0),
  downloads: Number(item.downloads || item.downloadCount || 0),
  impactFactor: Number(item.impactFactor || item.impact || 0),
  abstract: safeText(item.abstract, safeText(item.description, 'No abstract available.')),
  doi: item.doi || '',
  downloadUrl: item.downloadUrl || item.fileURL || '',
  tags: Array.isArray(item.tags) ? item.tags : [],
  highlights: Array.isArray(item.highlights) ? item.highlights : [],
  source: item.source || 'fallback',
});

const EnhancedResearchPortal = () => {
  const { t } = useTranslation('researchEnhanced');
  const [activeTab, setActiveTab] = useState('publications');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('citations');
  const [selectedFilters, setSelectedFilters] = useState({ year: 'all', type: 'all', area: 'all' });
  const [expandedPublication, setExpandedPublication] = useState(null);
  const [bookmarked, setBookmarked] = useState([]);
  const [livePublications, setLivePublications] = useState([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.8]);

  useEffect(() => {
    let cancelled = false;

    const loadLivePublications = async () => {
      setIsLiveLoading(true);
      try {
        const rows = await getResearchContent({ status: 'published', limit: 24 });
        const normalized = (Array.isArray(rows) ? rows : []).map(normalizePublicationFromFirebase).map(toPublicationCard);
        if (!cancelled) {
          setLivePublications(normalized);
        }
      } catch {
        if (!cancelled) {
          setLivePublications([]);
        }
      } finally {
        if (!cancelled) {
          setIsLiveLoading(false);
        }
      }
    };

    loadLivePublications();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroCopy = useMemo(
    () => ({
      badge: t('hero.badge', 'Research Excellence Portal'),
      kicker: t('hero.kicker', 'Government Decision Support'),
      titleLine1: t('hero.titleLine1', 'Evidence for National'),
      titleLine2: t('hero.titleLine2', 'Marine Governance'),
      description: t(
        'hero.description',
        'A strategic research portal connecting policy briefs, scientific evidence, and operational marine data for Sri Lankan public institutions.'
      ),
      liveStatus: t('hero.liveStatus', 'Live research and policy intelligence feed active'),
      ctaPolicyBriefs: t('hero.actions.policyBriefs', 'Policy Briefs'),
      ctaDatasets: t('hero.actions.datasets', 'Datasets'),
      ctaCollaborate: t('hero.actions.collaborate', 'Research Collaboration'),
    }),
    [t]
  );

  const metrics = useMemo(() => {
    const translated = t('metrics.cards', { returnObjects: true, defaultValue: METRICS_FALLBACK });
    const rows = Array.isArray(translated) && translated.length ? translated : METRICS_FALLBACK;
    return rows.map((metric) => ({
      ...metric,
      icon: resolveIcon(metric.icon, TrendingUp),
    }));
  }, [t]);

  const tabs = useMemo(() => {
    const translated = t('tabs', { returnObjects: true, defaultValue: TABS_FALLBACK });
    const rows = Array.isArray(translated) && translated.length ? translated : TABS_FALLBACK;
    return rows.map((tab) => ({
      ...tab,
      icon: resolveIcon(tab.icon, FileText),
    }));
  }, [t]);

  const researchAreas = useMemo(() => {
    const translated = t('areas', { returnObjects: true, defaultValue: AREAS_FALLBACK });
    const rows = Array.isArray(translated) && translated.length ? translated : AREAS_FALLBACK;
    const withAll = rows.some((area) => area.id === 'all') ? rows : AREAS_FALLBACK;
    return withAll.map((area) => ({
      ...area,
      icon: resolveIcon(area.icon, BookOpen),
      color: AREA_CLASS_MAP[area.color] ? area.color : 'slate',
    }));
  }, [t]);

  const teamLabels = useMemo(
    () => ({
      members: t('teams.labels.members', 'Members'),
      projects: t('teams.labels.projects', 'Projects'),
      publications: t('teams.labels.publications', 'Publications'),
      funding: t('teams.labels.funding', 'Funding'),
      leadBy: t('teams.labels.leadBy', 'Lead: {{name}}'),
      viewProfile: t('teams.actions.viewProfile', 'View Team Profile'),
    }),
    [t]
  );

  const teams = useMemo(() => {
    const translated = t('teams.items', { returnObjects: true, defaultValue: TEAMS_FALLBACK });
    const rows = Array.isArray(translated) && translated.length ? translated : TEAMS_FALLBACK;
    return rows;
  }, [t]);

  const policySection = useMemo(() => {
    const translated = t('governmentSections.policy.cards', { returnObjects: true, defaultValue: RESEARCH_POLICY_BRIEF_CARDS });
    const cards = Array.isArray(translated) && translated.length ? translated : RESEARCH_POLICY_BRIEF_CARDS;
    return {
      heading: t('governmentSections.policy.heading', 'Policy Briefs & Evidence Access'),
      subheading: t(
        'governmentSections.policy.subheading',
        'Direct pathways to validated evidence products for ministries, departments, and public authorities.'
      ),
      cards: cards.map((card) => ({ ...card, icon: resolveIcon(card.icon, FileText) })),
    };
  }, [t]);

  const priorityPrograms = useMemo(() => {
    const translated = t('governmentSections.programs.items', { returnObjects: true, defaultValue: RESEARCH_PRIORITY_PROGRAMS });
    const items = Array.isArray(translated) && translated.length ? translated : RESEARCH_PRIORITY_PROGRAMS;
    return {
      heading: t('governmentSections.programs.heading', 'National Priority Research Programs'),
      subheading: t(
        'governmentSections.programs.subheading',
        'Government-aligned initiatives advancing fisheries resilience, coastal safety, biodiversity, and ocean intelligence.'
      ),
      items,
    };
  }, [t]);

  const decisionOutcomes = useMemo(() => {
    const translated = t('governmentSections.outcomes.items', { returnObjects: true, defaultValue: RESEARCH_DECISION_OUTCOMES });
    const items = Array.isArray(translated) && translated.length ? translated : RESEARCH_DECISION_OUTCOMES;
    return {
      heading: t('governmentSections.outcomes.heading', 'Decision Support Outcomes'),
      subheading: t(
        'governmentSections.outcomes.subheading',
        'Performance indicators for evidence use, inter-agency operations, and policy execution.'
      ),
      items: items.map((item) => ({ ...item, icon: resolveIcon(item.icon, BarChart3) })),
    };
  }, [t]);

  const sourceLabel = useMemo(
    () => ({
      live: t('ui.sourceLive', 'Live Data'),
      fallback: t('ui.sourceFallback', 'Curated Dataset'),
    }),
    [t]
  );

  const publicationLabels = useMemo(
    () => ({
      searchPlaceholder: t('filters.searchPlaceholder', 'Search publications, authors, or keywords...'),
      allYears: t('filters.year.options.all', 'All Years'),
      allTypes: t('filters.type.options.all', 'All Types'),
      allAreas: t('filters.area.options.all', 'All Areas'),
      sortCitations: t('filters.sort.options.citations', 'Most Cited'),
      sortRecent: t('filters.sort.options.recent', 'Most Recent'),
      sortDownloads: t('filters.sort.options.downloads', 'Most Downloaded'),
      sortImpact: t('filters.sort.options.impact', 'Highest Impact'),
      openReader: t('publications.labels.openReader', 'Open Reader'),
      openDOI: t('publications.labels.openDOI', 'Open DOI'),
      downloadPDF: t('publications.labels.downloadPDF', 'PDF'),
      showMore: t('publications.labels.showMore', 'Show More'),
      showLess: t('publications.labels.showLess', 'Show Less'),
      noResults: t('publications.empty.description', 'No publications found for the selected filters.'),
      loading: t('publications.loading', 'Loading publications...'),
      source: t('publications.labels.source', 'Source'),
      citations: t('publications.labels.citations', 'Citations'),
      downloads: t('publications.labels.downloads', 'Downloads'),
      impactFactor: t('publications.labels.impactFactor', 'Impact Factor'),
    }),
    [t]
  );

  const localizedFallbackPublications = useMemo(() => {
    const baseFallbackPublications = getFallbackPublications();
    const translated = t('publications.items', {
      returnObjects: true,
      defaultValue: baseFallbackPublications,
    });
    const rows = Array.isArray(translated) && translated.length ? translated : baseFallbackPublications;
    return rows.map((item) => toPublicationCard({ ...item, source: 'fallback' }));
  }, [t]);

  const publicationSource = livePublications.length > 0 ? 'live' : 'fallback';
  const publicationList = livePublications.length > 0 ? livePublications : localizedFallbackPublications;

  const filteredPublications = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = publicationList.filter((pub) => {
      const matchSearch =
        !q ||
        pub.title.toLowerCase().includes(q) ||
        pub.abstract.toLowerCase().includes(q) ||
        pub.authors.some((name) => name.toLowerCase().includes(q)) ||
        pub.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchYear = selectedFilters.year === 'all' || String(pub.year) === selectedFilters.year;
      const matchType =
        selectedFilters.type === 'all' || pub.type.toLowerCase().includes(selectedFilters.type.toLowerCase());
      const matchArea =
        selectedFilters.area === 'all' || pub.area.toLowerCase().includes(selectedFilters.area.toLowerCase());

      return matchSearch && matchYear && matchType && matchArea;
    });

    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sortBy === 'recent') return b.year - a.year;
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'impact') return b.impactFactor - a.impactFactor;
      return b.citations - a.citations;
    });

    return sorted;
  }, [publicationList, searchTerm, selectedFilters, sortBy]);

  const uniqueYears = useMemo(() => {
    const years = [...new Set(publicationList.map((pub) => String(pub.year)))].sort((a, b) => Number(b) - Number(a));
    return years;
  }, [publicationList]);

  const toggleBookmark = (id) => {
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-[#001B35] via-[#003366] to-[#0A2744] text-white">
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-[85vh] overflow-hidden flex items-center"
      >
        <div className="absolute inset-0 z-0">
          <HeroImageCarousel
            showControls={false}
            showIndicators={false}
            autoPlayInterval={6500}
            className="h-full w-full object-cover"
          />
          {/* Reduced overlay for better image visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/80 via-[#003366]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001B35]/90 via-transparent to-[#003366]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left column - Text content (takes 3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span className="text-xs sm:text-sm uppercase tracking-[0.16em] text-cyan-200 font-semibold">{heroCopy.badge}</span>
              </div>

              <p className="text-sm text-cyan-100/90 uppercase tracking-[0.22em] font-semibold">
                {heroCopy.kicker}
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight font-space">
                <span className="block text-white drop-shadow-lg">{heroCopy.titleLine1}</span>
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                  {heroCopy.titleLine2}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-100/85 max-w-xl leading-relaxed">
                {heroCopy.description}
              </p>

              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-300/35 px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-xs text-emerald-100 font-medium">{heroCopy.liveStatus}</span>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/scientific-evidence-repository"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nara-blue hover:bg-blue-500 transition-colors font-semibold text-sm"
                >
                  <FileText className="w-4 h-4" />
                  {heroCopy.ctaPolicyBriefs}
                </Link>

                <Link
                  to="/open-data-portal"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 transition-colors font-semibold text-sm"
                >
                  <Database className="w-4 h-4" />
                  {heroCopy.ctaDatasets}
                </Link>

                <Link
                  to="/research-collaboration-platform"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/20 transition-colors font-semibold text-sm"
                >
                  <Users className="w-4 h-4" />
                  {heroCopy.ctaCollaborate}
                </Link>
              </div>
            </div>

            {/* Right column - Metrics (takes 2 cols) */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-3">
                {metrics.slice(0, 4).map((metric) => {
                  const MetricIcon = metric.icon;
                  return (
                    <div key={metric.id} className="rounded-xl border border-white/25 bg-white/10 backdrop-blur-md p-4">
                      <div className="flex items-center justify-between">
                        <MetricIcon className="w-5 h-5 text-cyan-200" />
                        <span className="text-xs text-emerald-200 font-semibold">{metric.change}</span>
                      </div>
                      <div className="mt-2 text-2xl font-bold">{metric.value}</div>
                      <div className="text-xs text-slate-200">{metric.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
        <div>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-space">{policySection.heading}</h2>
            <p className="text-slate-200 mt-2 max-w-3xl">{policySection.subheading}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {policySection.cards.map((card) => {
              const CardIcon = card.icon;
              return (
                <Link
                  key={card.id}
                  to={card.route}
                  className="group rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 transition-colors p-5"
                >
                  <CardIcon className="w-6 h-6 text-cyan-300 mb-3" />
                  <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-200 leading-relaxed mb-4">{card.description}</p>
                  <span className="inline-flex items-center gap-2 text-cyan-200 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    {card.cta}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-space">{priorityPrograms.heading}</h2>
            <p className="text-slate-200 mt-2 max-w-3xl">{priorityPrograms.subheading}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {priorityPrograms.items.map((program) => (
              <Link
                key={program.id}
                to={program.route}
                className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 transition-colors p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-bold text-lg">{program.title}</h3>
                  <span className="text-xs rounded-full px-2.5 py-1 bg-emerald-500/20 border border-emerald-300/40 text-emerald-100">
                    {program.status}
                  </span>
                </div>
                <p className="text-sm text-slate-200 mb-3">{program.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {program.leadAgency}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {program.timeline}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-space">{decisionOutcomes.heading}</h2>
            <p className="text-slate-200 mt-2 max-w-3xl">{decisionOutcomes.subheading}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {decisionOutcomes.items.map((item) => {
              const OutcomeIcon = item.icon;
              return (
                <div key={item.id} className="rounded-2xl border border-white/20 bg-white/10 p-5">
                  <OutcomeIcon className="w-6 h-6 text-cyan-300 mb-3" />
                  <div className="text-3xl font-bold">{item.value}</div>
                  <p className="text-sm text-slate-100 mt-1">{item.label}</p>
                  <p className="text-xs text-emerald-200 mt-1 font-semibold">{item.trend}</p>
                  <p className="text-xs text-slate-300 mt-2">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="sticky top-[72px] z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#0A2744]/95 backdrop-blur-md border-y border-white/15 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border transition-colors whitespace-nowrap ${isActive
                      ? 'bg-nara-blue text-white border-blue-200/40'
                      : 'bg-white/5 text-slate-200 border-white/15 hover:bg-white/10'
                    }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.count ? <span className="text-xs opacity-90">{tab.count}</span> : null}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'publications' && (
            <motion.div
              key="publications"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg font-bold inline-flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-300" />
                    {tabs.find((tab) => tab.id === 'publications')?.label || 'Publications'}
                  </h3>
                  <span className="text-xs rounded-full px-3 py-1 bg-white/10 border border-white/20">
                    {publicationLabels.source}: {sourceLabel[publicationSource]}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <label className="relative lg:col-span-2">
                    <Search className="w-4.5 h-4.5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder={publicationLabels.searchPlaceholder}
                      className="w-full rounded-xl bg-white/5 border border-white/20 px-10 py-2.5 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </label>

                  <select
                    value={selectedFilters.year}
                    onChange={(event) => setSelectedFilters((prev) => ({ ...prev, year: event.target.value }))}
                    className="rounded-xl bg-white/5 border border-white/20 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="all" className="bg-[#0A2744]">{publicationLabels.allYears}</option>
                    {uniqueYears.map((year) => (
                      <option key={year} value={year} className="bg-[#0A2744]">
                        {year}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedFilters.type}
                    onChange={(event) => setSelectedFilters((prev) => ({ ...prev, type: event.target.value }))}
                    className="rounded-xl bg-white/5 border border-white/20 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="all" className="bg-[#0A2744]">{publicationLabels.allTypes}</option>
                    <option value="journal" className="bg-[#0A2744]">Journal Article</option>
                    <option value="report" className="bg-[#0A2744]">Technical Report</option>
                    <option value="dataset" className="bg-[#0A2744]">Dataset Publication</option>
                  </select>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 text-xs text-slate-200">
                    <Filter className="w-4 h-4" />
                    {publicationLabels.allAreas}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {researchAreas.map((area) => {
                      const isActive = selectedFilters.area === area.id;
                      const style = AREA_CLASS_MAP[area.color] || AREA_CLASS_MAP.slate;
                      const AreaIcon = area.icon;
                      return (
                        <button
                          key={area.id}
                          onClick={() => setSelectedFilters((prev) => ({ ...prev, area: area.id }))}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${isActive ? style.active : style.inactive
                            }`}
                        >
                          <AreaIcon className="w-3.5 h-3.5" />
                          <span>{area.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="ml-auto rounded-xl bg-white/5 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="citations" className="bg-[#0A2744]">{publicationLabels.sortCitations}</option>
                    <option value="recent" className="bg-[#0A2744]">{publicationLabels.sortRecent}</option>
                    <option value="downloads" className="bg-[#0A2744]">{publicationLabels.sortDownloads}</option>
                    <option value="impact" className="bg-[#0A2744]">{publicationLabels.sortImpact}</option>
                  </select>
                </div>
              </div>

              {isLiveLoading && publicationSource !== 'live' ? (
                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-sm text-slate-200">
                  {publicationLabels.loading}
                </div>
              ) : filteredPublications.length === 0 ? (
                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-sm text-slate-200">
                  {publicationLabels.noResults}
                </div>
              ) : (
                filteredPublications.map((publication, index) => (
                  <motion.article
                    key={publication.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-3 max-w-4xl">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full px-2.5 py-1 bg-cyan-500/20 border border-cyan-300/40 text-cyan-100">
                            {publication.area}
                          </span>
                          <span className="rounded-full px-2.5 py-1 bg-white/10 border border-white/20 text-slate-100">
                            {publication.type}
                          </span>
                          <span className="rounded-full px-2.5 py-1 bg-emerald-500/15 border border-emerald-300/30 text-emerald-100">
                            {sourceLabel[publication.source]}
                          </span>
                          <span className="text-slate-200">{publication.year}</span>
                        </div>

                        <h4 className="text-xl font-bold leading-snug">{publication.title}</h4>
                        <p className="text-sm text-slate-200">{publication.authors.join(', ')}</p>

                        <p className="text-sm text-slate-100/90 leading-relaxed">
                          {expandedPublication === publication.id
                            ? publication.abstract
                            : `${publication.abstract.substring(0, 220)}...`}
                        </p>

                        {expandedPublication === publication.id && publication.highlights.length > 0 ? (
                          <ul className="space-y-1 text-sm text-slate-100">
                            {publication.highlights.map((highlight, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-cyan-300 mt-0.5" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        <div className="flex flex-wrap gap-2">
                          {publication.tags.map((tag) => (
                            <span key={`${publication.id}-${tag}`} className="text-xs rounded-full px-2.5 py-1 bg-white/5 border border-white/15 text-slate-200">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                          <span className="inline-flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
                            {publicationLabels.citations}: {publication.citations}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5 text-emerald-300" />
                            {publicationLabels.downloads}: {publication.downloads}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <LineChart className="w-3.5 h-3.5 text-amber-300" />
                            {publicationLabels.impactFactor}: {publication.impactFactor}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[180px]">
                        <button
                          onClick={() => toggleBookmark(publication.id)}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${bookmarked.includes(publication.id)
                              ? 'bg-cyan-500/20 border-cyan-300/40 text-cyan-100'
                              : 'bg-white/5 border-white/20 text-slate-100 hover:bg-white/10'
                            }`}
                        >
                          <Bookmark className="w-4 h-4" />
                          Bookmark
                        </button>

                        <Link
                          to={`/research-excellence-portal/read/${encodeURIComponent(publication.id)}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-nara-blue hover:bg-blue-500 px-3 py-2 text-sm font-semibold transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          {publicationLabels.openReader}
                        </Link>

                        {publication.doi ? (
                          <a
                            href={`https://doi.org/${publication.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 px-3 py-2 text-sm transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {publicationLabels.openDOI}
                          </a>
                        ) : null}

                        {publication.downloadUrl ? (
                          <a
                            href={publication.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 px-3 py-2 text-sm transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            {publicationLabels.downloadPDF}
                          </a>
                        ) : null}

                        <button
                          onClick={() =>
                            setExpandedPublication((prev) => (prev === publication.id ? null : publication.id))
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 px-3 py-2 text-sm transition-colors"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedPublication === publication.id ? 'rotate-180' : ''}`} />
                          {expandedPublication === publication.id
                            ? publicationLabels.showLess
                            : publicationLabels.showMore}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {teams.map((team, index) => (
                <motion.div
                  key={team.id || `${team.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-white/20 bg-white/10 p-5"
                >
                  <h4 className="text-xl font-bold">{team.name}</h4>
                  <p className="text-sm text-cyan-200 mt-1">{teamLabels.leadBy.replace('{{name}}', team.lead)}</p>
                  <p className="text-sm text-slate-200 mt-3">{team.focus}</p>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="rounded-lg bg-white/5 border border-white/15 p-3">
                      <div className="text-slate-300">{teamLabels.members}</div>
                      <div className="text-xl font-bold">{team.members}</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/15 p-3">
                      <div className="text-slate-300">{teamLabels.projects}</div>
                      <div className="text-xl font-bold">{team.projects}</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/15 p-3">
                      <div className="text-slate-300">{teamLabels.publications}</div>
                      <div className="text-xl font-bold">{team.publications}</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/15 p-3">
                      <div className="text-slate-300">{teamLabels.funding}</div>
                      <div className="text-xl font-bold">{team.funding}</div>
                    </div>
                  </div>

                  <button className="w-full mt-4 rounded-lg bg-nara-blue hover:bg-blue-500 py-2.5 font-semibold transition-colors">
                    {teamLabels.viewProfile}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <ActiveProjectsTab />
            </motion.div>
          )}

          {activeTab === 'impact' && (
            <motion.div key="impact" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <ImpactAnalyticsTab />
            </motion.div>
          )}

          {activeTab === 'collaboration' && (
            <motion.div
              key="collaboration"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
            >
              <GlobalCollaborationTab />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default EnhancedResearchPortal;
