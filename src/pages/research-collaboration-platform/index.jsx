import React, { useState, useEffect, useMemo } from 'react';

import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import researchService from '../../services/researchService';
import { useTranslation } from 'react-i18next';

import ResearcherNetworkSection from './components/ResearcherNetworkSection';
import ProjectManagementSection from './components/ProjectManagementSection';
import PeerReviewSection from './components/PeerReviewSection';
import GrantManagementSection from './components/GrantManagementSection';
import InternationalPartnershipsSection from './components/InternationalPartnershipsSection';
import SignInModal from '../research-excellence-portal/components/SignInModal';
import SignUpModal from '../research-excellence-portal/components/SignUpModal';

const TRUSTED_INSTITUTES = [
  {
    name: 'Woods Hole Oceanographic Institution',
    region: 'north-america',
    country: 'USA',
    partnership: 'Global Ocean Observing Alliance',
    ranking: '#1 Marine Sciences (QS)',
    focus: ['Deep-sea exploration', 'Autonomous ocean systems'],
    coverImage: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Norwegian Institute of Marine Research',
    region: 'europe',
    country: 'Norway',
    partnership: 'Arctic Blue Economy Consortium',
    ranking: 'EU Horizon Centre of Excellence',
    focus: ['Polar ecosystems', 'Sustainable fisheries'],
    coverImage: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'National Institute of Oceanography Goa',
    region: 'asia',
    country: 'India',
    partnership: 'Indian Ocean Climate Resilience Pact',
    ranking: 'Top 5 Indian Ocean Research Hub',
    focus: ['Monsoon forecasting', 'Marine biodiversity'],
    coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Scripps Institution of Oceanography',
    region: 'north-america',
    country: 'USA',
    partnership: 'Pacific Climate Innovation Network',
    ranking: '#2 Marine & Oceanography (ARWU)',
    focus: ['Climate modelling', 'Blue technology incubation'],
    coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Commonwealth Scientific and Industrial Research Organisation',
    region: 'asia-pacific',
    country: 'Australia',
    partnership: 'Great Barrier Reef Guardianship Program',
    ranking: 'UNESCO Ocean Science Partner',
    focus: ['Coral resilience', 'Digital twin oceans'],
    coverImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Ifremer – French Research Institute for Exploitation of the Sea',
    region: 'europe',
    country: 'France',
    partnership: 'Atlantic Smart Ports Initiative',
    ranking: 'EU Mission Restore Our Ocean Lead',
    focus: ['Marine robotics', 'Coastal intelligence'],
    coverImage: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?auto=format&fit=crop&w=900&q=80'
  }
];

const COLLABORATION_STREAMS = [
  {
    id: 'networking',
    title: 'Global Researcher Graph',
    description: 'Discover over 150 credentialed marine scientists, policy experts, and technologists aligned to your mission.',
    icon: 'Users',
    highlight: 'Live availability & secure messaging'
  },
  {
    id: 'projects',
    title: 'Joint Mission Control',
    description: 'Plan multi-institution expeditions with milestone intelligence, compliance workflows, and asset tracking.',
    icon: 'Briefcase',
    highlight: 'Project playbooks & budget telemetry'
  },
  {
    id: 'peer-review',
    title: 'Ocean Peer Review Lab',
    description: 'Run double-blind peer reviews with elite reviewer pools, AI-assisted insights, and DOI assignment.',
    icon: 'FileCheck',
    highlight: 'Expedited editorial pipelines'
  },
  {
    id: 'grants',
    title: 'Blue Funding Studio',
    description: 'Co-author high-impact grant proposals with live benchmarking, impact modelling, and submission tracking.',
    icon: 'DollarSign',
    highlight: 'USD 2.3M awarded in 2024'
  },
  {
    id: 'partnerships',
    title: 'Strategic Alliances Desk',
    description: 'Forge agreements with trusted institutes, MOUs, data-sharing governance, and diplomatic coordination.',
    icon: 'Handshake',
    highlight: 'Multi-lateral partnership builder'
  }
];

const ResearchCollaborationPlatform = () => {
  const [activeModule, setActiveModule] = useState('networking');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    researchers: [],
    projects: [],
    collaborations: [],
    grants: [],
    networks: []
  });

  const [loading, setLoading] = useState({
    metrics: true,
    researchers: true,
    projects: true,
    collaborations: true,
    grants: true,
    networks: true
  });

  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation('collaboration');

  const heroContent = t('hero', { returnObjects: true }) || {};
  const heroStatsContent = heroContent?.stats || {};
  const institutesContent = t('institutes', { returnObjects: true }) || {};
  const modulesContent = t('modules', { returnObjects: true }) || {};
  const collaborationsContent = t('collaborations', { returnObjects: true }) || {};
  const ctaContent = t('cta', { returnObjects: true }) || {};

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      const metricsResponse = await researchService?.metrics?.getOverallMetrics?.();
      if (metricsResponse?.data) {
        setDashboardData((prev) => ({ ...prev, metrics: metricsResponse.data }));
      }
      setLoading((prev) => ({ ...prev, metrics: false }));

      const researcherResponse = await researchService?.profiles?.search?.('', {});
      if (researcherResponse?.data) {
        setDashboardData((prev) => ({ ...prev, researchers: researcherResponse.data.slice(0, 12) }));
      }
      setLoading((prev) => ({ ...prev, researchers: false }));

      const projectResponse = await researchService?.projects?.getPublic?.();
      if (projectResponse?.data) {
        setDashboardData((prev) => ({ ...prev, projects: projectResponse.data.slice(0, 8) }));
      }
      setLoading((prev) => ({ ...prev, projects: false }));

      const collabResponse = await researchService?.collaboration?.getOpen?.();
      if (collabResponse?.data) {
        setDashboardData((prev) => ({ ...prev, collaborations: collabResponse.data.slice(0, 6) }));
      }
      setLoading((prev) => ({ ...prev, collaborations: false }));

      if (user?.id) {
        const grantsResponse = await researchService?.grants?.getUserGrants?.(user.id);
        if (grantsResponse?.data) {
          setDashboardData((prev) => ({ ...prev, grants: grantsResponse.data.slice(0, 6) }));
        }
        setLoading((prev) => ({ ...prev, grants: false }));

        const networksResponse = await researchService?.networks?.getUserMemberships?.(user.id);
        if (networksResponse?.data) {
          setDashboardData((prev) => ({ ...prev, networks: networksResponse.data }));
        }
        setLoading((prev) => ({ ...prev, networks: false }));
      } else {
        const networksResponse = await researchService?.networks?.getActive?.();
        if (networksResponse?.data) {
          setDashboardData((prev) => ({ ...prev, networks: networksResponse.data.slice(0, 6) }));
        }
        setLoading((prev) => ({ ...prev, networks: false }));
      }
    } catch (error) {
      console.error('Error loading collaboration platform data:', error);
      setLoading({ metrics: false, researchers: false, projects: false, collaborations: false, grants: false, networks: false });
    }
  };

  const instituteFilters = useMemo(() => {
    const filters = institutesContent?.filters;
    if (Array.isArray(filters) && filters.length) {
      return filters;
    }
    return [
      { value: 'all', label: 'All regions' },
      { value: 'north-america', label: 'North America' },
      { value: 'europe', label: 'Europe' },
      { value: 'asia', label: 'South & East Asia' },
      { value: 'asia-pacific', label: 'Asia Pacific' }
    ];
  }, [institutesContent]);

  const translatedInstitutes = useMemo(() => {
    const list = institutesContent?.list;
    if (Array.isArray(list) && list.length) {
      return list;
    }
    return TRUSTED_INSTITUTES;
  }, [institutesContent]);

  const filteredInstitutes = useMemo(() => {
    if (selectedFilter === 'all') {
      return translatedInstitutes;
    }
    return translatedInstitutes.filter((institute) => institute.region === selectedFilter);
  }, [selectedFilter, translatedInstitutes]);

  const modules = useMemo(() => {
    const moduleList = modulesContent?.list;
    if (Array.isArray(moduleList) && moduleList.length) {
      return moduleList;
    }
    return COLLABORATION_STREAMS;
  }, [modulesContent]);

  const signatureCollaborations = useMemo(() => {
    const translatedList = collaborationsContent?.list;
    if (Array.isArray(translatedList) && translatedList.length) {
      return translatedList;
    }
    if (dashboardData?.collaborations?.length) {
      return dashboardData.collaborations.map((collaboration, index) => ({
        id: collaboration?.id || `collab-${index}`,
        title: collaboration?.title || 'Global Research Cohort',
        host: collaboration?.host_institution || collaboration?.lead_org || 'NARA Alliance',
        region: collaboration?.region || 'Indo-Pacific',
        summary: collaboration?.summary || collaboration?.description || 'Strategic partnership focused on resilient maritime ecosystems and shared research infrastructure.',
        deadline: collaboration?.deadline || collaboration?.application_deadline,
        focus: collaboration?.focus_area || 'Ocean intelligence'
      }));
    }

    return collaborationsContent?.list?.length ? collaborationsContent.list : [
      {
        id: 'indo-pacific',
        title: 'Indo-Pacific Ocean Health Observatory',
        host: 'NARA × Scripps Institution of Oceanography',
        region: 'Pacific Rim',
        summary: 'Joint deployment of autonomous observing systems and AI-led forecasting models to monitor coral resilience and climate extremes.',
        deadline: 'Rolling intake 2025',
        focus: 'Autonomous ocean systems'
      },
      {
        id: 'arctic-bridge',
        title: 'Arctic Blue Economy Bridge',
        host: 'NARA × Norwegian Institute of Marine Research',
        region: 'Arctic Circle',
        summary: 'Collaborative platform advancing sustainable fisheries, ice navigation analytics, and indigenous knowledge integration.',
        deadline: 'Applications close 30 June 2025',
        focus: 'Sustainable fisheries'
      },
      {
        id: 'coral-vanguard',
        title: 'Global Coral Vanguard Network',
        host: 'NARA × CSIRO × Ifremer',
        region: 'Global South',
        summary: 'Living lab of 18 reef sites piloting bioacoustic monitoring, genetic restoration, and community-led conservation.',
        deadline: 'Invitations issued quarterly',
        focus: 'Coral resilience'
      }
    ];
  }, [collaborationsContent, dashboardData?.collaborations]);

  const researcherCount = useMemo(() => {
    const metricValue = dashboardData?.metrics?.active_researchers || dashboardData?.metrics?.researchers_total;
    const fallback = dashboardData?.researchers?.length > 12 ? dashboardData.researchers.length : 156;
    if (typeof metricValue === 'number') {
      return metricValue.toLocaleString();
    }
    return fallback.toLocaleString();
  }, [dashboardData]);

  const projectCount = useMemo(() => {
    const metricValue = dashboardData?.metrics?.active_projects || dashboardData?.metrics?.projects_total;
    const fallback = dashboardData?.projects?.length > 8 ? dashboardData.projects.length : 48;
    if (typeof metricValue === 'number') {
      return metricValue.toLocaleString();
    }
    return fallback.toLocaleString();
  }, [dashboardData]);

  const grantVolume = useMemo(() => {
    const metricValue = dashboardData?.metrics?.funding_volume_usd;
    if (typeof metricValue === 'number') {
      return `USD ${(metricValue / 1_000_000).toFixed(1)}M`;
    }
    return 'USD 2.3M';
  }, [dashboardData]);

  const heroStatCards = useMemo(() => [
    {
      key: 'institutes',
      value: `${translatedInstitutes.length}+`,
      label: heroStatsContent?.institutes?.label || 'Trusted institutes',
      description: heroStatsContent?.institutes?.description || 'High-trust partners across 6 continents',
      icon: 'Building',
      accent: 'bg-cyan-500/20 text-cyan-300'
    },
    {
      key: 'researchers',
      value: researcherCount,
      label: heroStatsContent?.researchers?.label || 'Researchers collaborating',
      description: heroStatsContent?.researchers?.description || 'Credentialed experts verified by partner institutes',
      icon: 'Users',
      accent: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      key: 'projects',
      value: projectCount,
      label: heroStatsContent?.projects?.label || 'Active joint missions',
      description: heroStatsContent?.projects?.description || 'Live initiatives spanning 18 thematic programmes',
      icon: 'Navigation',
      accent: 'bg-blue-500/20 text-blue-300'
    },
    {
      key: 'funding',
      value: grantVolume,
      label: heroStatsContent?.funding?.label || 'Funding unlocked',
      description: heroStatsContent?.funding?.description || 'Competitive grants, philanthropic capital, & innovation funds',
      icon: 'DollarSign',
      accent: 'bg-purple-500/20 text-purple-300'
    }
  ], [translatedInstitutes.length, heroStatsContent, researcherCount, projectCount, grantVolume]);

  const ctaFeatures = useMemo(() => {
    if (Array.isArray(ctaContent?.features) && ctaContent.features.length) {
      return ctaContent.features;
    }
    return [
      'ISO 27001 & GDPR compliant collaboration',
      'Real-time mission telemetry dashboards',
      'Endorsed by 12 national research councils'
    ];
  }, [ctaContent]);

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'networking':
        return (
          <ResearcherNetworkSection
            researchers={dashboardData?.researchers}
            loading={loading?.researchers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      case 'projects':
        return (
          <ProjectManagementSection
            projects={dashboardData?.projects}
            loading={loading?.projects}
            user={user}
          />
        );
      case 'peer-review':
        return <PeerReviewSection user={user} />;
      case 'grants':
        return (
          <GrantManagementSection
            grants={dashboardData?.grants}
            loading={loading?.grants}
            user={user}
          />
        );
      case 'partnerships':
        return (
          <InternationalPartnershipsSection
            networks={dashboardData?.networks}
            collaborations={dashboardData?.collaborations}
            loading={loading?.networks}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  const handleJoinPlatform = () => {
    if (isAuthenticated) {
      setActiveModule('projects');
    } else {
      setShowSignUpModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <main className="pt-24">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-900/20" />
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                <Icon name="Globe" size={16} />
                {heroContent?.badge || 'NARA Global Collaboration Grid'}
              </span>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {heroContent?.title || 'World-leading ocean institutes building the future of marine science together'}
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                {heroContent?.description || 'Join trusted research leaders across 54 nations to co-design expeditions, accelerate publications, and unlock high-impact funding for transformative ocean initiatives.'}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event?.target?.value)}
                    placeholder={heroContent?.searchPlaceholder || 'Search researchers, institutes, or programmes'}
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  iconName="Search"
                  iconPosition="left"
                  onClick={() => setActiveModule('networking')}
                >
                  {heroContent?.primaryCta || 'Explore collaborators'}
                </Button>
                <Button
                  variant="ghost"
                  className="border-white/30 text-white"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={handleJoinPlatform}
                >
                  {heroContent?.secondaryCta || 'Join alliance'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {heroStatCards.map((card) => (
                <div key={card.key} className="rounded-2xl bg-white/5 px-6 py-5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-300">{card.label}</p>
                      <p className="mt-2 text-3xl font-semibold">{card.value}</p>
                    </div>
                    <div className={`rounded-xl p-3 ${card.accent}`}>
                      <Icon name={card.icon} size={20} />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-[#030a1a] py-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl space-y-3">
                <h2 className="text-3xl font-semibold text-white">
                  {institutesContent?.heading || 'Trusted research institutes shaping the alliance'}
                </h2>
                <p className="text-slate-300">
                  {institutesContent?.description || 'NARA curates partnerships with the world’s most respected marine science organisations, combining rigorous academic credentials, mission readiness, and shared governance frameworks.'}
                </p>
              </div>
              <div className="w-full sm:w-64">
                <Select
                  options={instituteFilters}
                  value={selectedFilter}
                  onChange={setSelectedFilter}
                  placeholder={institutesContent?.filterPlaceholder || 'Filter by region'}
                  className="bg-white/5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredInstitutes.map((institute) => (
                <div key={institute.name} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-cyan-400/60">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={institute.coverImage}
                      alt={institute.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{institute.name}</h3>
                        <p className="text-xs text-slate-300">{institute.country}</p>
                      </div>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-widest text-white">
                        {institute.ranking}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-center gap-2 text-xs text-cyan-200">
                      <Icon name="Handshake" size={16} />
                      <span>{institute.partnership}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {institute.focus.map((area) => (
                        <span key={area} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                          {area}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full border-white/20 text-white hover:border-cyan-400/60"
                      iconName="ArrowRight"
                      iconPosition="right"
                      onClick={() => setActiveModule('partnerships')}
                    >
                      {institutesContent?.cta || 'View collaboration playbook'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#010a16] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-semibold">
                  {collaborationsContent?.heading || 'Signature global collaboration programmes'}
                </h2>
                <p className="text-slate-300">
                  {collaborationsContent?.description || 'Secure mission-critical alliances, pooled infrastructure, and rapid deployment support across the world’s most trusted research corridors.'}
                </p>
              </div>
              <Button
                variant="default"
                className="self-start bg-gradient-to-r from-cyan-500 to-sky-500"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => setActiveModule('projects')}
              >
                {collaborationsContent?.cta || 'Schedule a partnership briefing'}
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {signatureCollaborations.map((programme) => (
                <div key={programme.id} className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cyan-200">
                        {programme.region}
                      </span>
                      <span className="text-xs text-slate-300">{programme.focus}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{programme.title}</h3>
                    <p className="text-sm text-slate-300">{programme.summary}</p>
                  </div>
                  <div className="mt-6 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Icon name="Building" size={14} />
                      <span>{programme.host}</span>
                    </div>
                    {programme.deadline && (
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={14} />
                        <span>{programme.deadline}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-6 w-full border-white/20 text-white hover:border-cyan-400/60"
                    iconName="ExternalLink"
                    iconPosition="right"
                    onClick={() => setActiveModule('partnerships')}
                  >
                    {collaborationsContent?.cardCta || 'Explore playbook'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#020c1f] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-semibold text-white">
                  {modulesContent?.heading || 'Advanced collaboration suite'}
                </h2>
                <p className="mt-3 text-slate-300">
                  {modulesContent?.description || 'Switch between specialised workspaces built with our partner institutes to accelerate discovery and impact.'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="border-white/30 text-white"
                  iconName="LogIn"
                  iconPosition="left"
                  onClick={() => setShowSignInModal(true)}
                >
                  {modulesContent?.signIn || 'Sign in'}
                </Button>
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={handleJoinPlatform}
                >
                  {modulesContent?.requestAccess || 'Request access'}
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
              {modules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setActiveModule(module.id)}
                  className={`rounded-2xl border px-4 py-5 text-left transition ${
                    activeModule === module.id
                      ? 'border-cyan-400/80 bg-cyan-500/10'
                      : 'border-white/10 bg-white/5 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm font-semibold text-white">
                    <Icon name={module.icon} size={18} />
                    {module.title}
                  </div>
                  <p className="mt-3 text-xs text-slate-300">{module.description}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-cyan-200">
                    {module.highlight}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              {renderModuleContent() || (
                <div className="flex h-56 items-center justify-center text-slate-300">
                  {modulesContent?.empty || 'Select a collaboration module to begin.'}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-b from-[#010a16] via-[#010612] to-black py-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
              <h2 className="text-3xl font-semibold text-white">
                {ctaContent?.heading || 'Co-create the next era of ocean intelligence'}
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                {ctaContent?.description || 'Our partnership concierge will help align your institute with the right programme, governance model, and funding pathway within 48 hours.'}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600"
                  iconName="Mail"
                  iconPosition="left"
                  onClick={() => setShowSignUpModal(true)}
                >
                  {ctaContent?.primary || 'Request onboarding dossier'}
                </Button>
                <Button
                  variant="ghost"
                  className="border-white/30 text-white"
                  iconName="Video"
                  iconPosition="left"
                  onClick={() => setActiveModule('partnerships')}
                >
                  {ctaContent?.secondary || 'Book strategic consultation'}
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                {ctaFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icon name={index === 0 ? 'Shield' : index === 1 ? 'Activity' : 'Award'} size={14} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
      <SignUpModal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)} />
    </div>
  );
};

export default ResearchCollaborationPlatform;
