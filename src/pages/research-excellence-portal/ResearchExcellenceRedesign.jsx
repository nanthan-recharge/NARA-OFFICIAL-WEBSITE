import React, { useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useResearchData } from '../../hooks/useResearchData';

const resolveIconComponent = (iconRef, fallback = Icons.Activity) => {
  if (!iconRef) {
    return fallback;
  }
  if (typeof iconRef === 'string' && Icons[iconRef]) {
    return Icons[iconRef];
  }
  if (typeof iconRef === 'function') {
    return iconRef;
  }
  return fallback;
};

const normalizeKey = (value = '') => value.toString().toLowerCase().replace(/[^a-z0-9]+/g, '');

const ResearchExcellenceRedesign = () => {
  const [activeTab, setActiveTab] = useState('publications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const { scrollY } = useScroll();

  // Real-time research data
  const {
    publications,
    teams,
    metrics,
    isLoading
  } = useResearchData();

  // Parallax effects
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const { t } = useTranslation(['research', 'common']);

  const heroContent = t('hero', { ns: 'research', returnObjects: true }) || {};
  const metricsContent = t('metrics', { ns: 'research', returnObjects: true }) || {};
  const tabsContent = t('tabs', { ns: 'research', returnObjects: true }) || [];
  const publicationsContent = t('publications', { ns: 'research', returnObjects: true }) || {};
  const teamsContent = t('teams', { ns: 'research', returnObjects: true }) || {};
  const projectsContent = t('projects', { ns: 'research', returnObjects: true }) || {};
  const impactContent = t('impact', { ns: 'research', returnObjects: true }) || {};
  const ctaContent = t('cta', { ns: 'research', returnObjects: true }) || {};
  const placeholdersContent = t('placeholders', { ns: 'research', returnObjects: true }) || {};

  const tabConfig = Array.isArray(tabsContent) && tabsContent.length
    ? tabsContent
    : [
        { key: 'publications', label: 'Publications' },
        { key: 'teams', label: 'Research Teams' },
        { key: 'projects', label: 'Projects' },
        { key: 'datasets', label: 'Datasets' },
        { key: 'collaboration', label: 'Collaboration' }
      ];

  const categories = useMemo(
    () => (Array.isArray(publicationsContent?.categories) ? publicationsContent.categories : []),
    [publicationsContent]
  );

  const sortOptions = useMemo(
    () => (Array.isArray(publicationsContent?.sortOptions) ? publicationsContent.sortOptions : []),
    [publicationsContent]
  );

  const publicationLabels = {
    citations: 'Citations',
    downloads: 'Downloads',
    impact: 'IF',
    pdf: 'PDF',
    ...(publicationsContent?.labels || {})
  };
  const publicationEmpty = {
    title: '',
    description: '',
    ...(publicationsContent?.empty || {})
  };
  const searchPlaceholder = publicationsContent?.searchPlaceholder || 'Search publications...';
  const loadMoreLabel = publicationsContent?.loadMore || 'Load More Publications';

  const fallbackPublications = useMemo(() => {
    if (!Array.isArray(publicationsContent?.fallback)) {
      return [];
    }
    return publicationsContent.fallback.map((pub, index) => ({
      id: pub.id || index + 1,
      ...pub,
      tags: Array.isArray(pub.tags) ? pub.tags : []
    }));
  }, [publicationsContent]);

  const metricsFallbackRaw = useMemo(() => {
    if (!Array.isArray(metricsContent?.fallback)) {
      return [];
    }
    return metricsContent.fallback;
  }, [metricsContent]);

  const metricsTranslationMap = useMemo(() => {
    return metricsFallbackRaw.reduce((acc, metric) => {
      const key = metric.key ? normalizeKey(metric.key) : normalizeKey(metric.label);
      if (key && metric.label) {
        acc[key] = metric.label;
      }
      return acc;
    }, {});
  }, [metricsFallbackRaw]);

  const researchMetrics = useMemo(() => {
    const fallbackByKey = metricsFallbackRaw.reduce((acc, metric) => {
      const key = metric.key ? normalizeKey(metric.key) : normalizeKey(metric.label);
      if (key) {
        acc[key] = metric;
      }
      return acc;
    }, {});
    const source = Array.isArray(metrics) && metrics.length ? metrics : metricsFallbackRaw;
    return source.map((metric) => {
      const key = metric.key ? normalizeKey(metric.key) : normalizeKey(metric.label);
      const fallbackMetric = fallbackByKey[key] || {};
      return {
        ...metric,
        label: metricsTranslationMap[key] || metric.label || fallbackMetric.label || '',
        value: metric.value ?? fallbackMetric.value ?? '',
        change: metric.change ?? fallbackMetric.change ?? '',
        icon: resolveIconComponent(metric.icon ?? fallbackMetric.icon, Icons.Activity)
      };
    });
  }, [metrics, metricsFallbackRaw, metricsTranslationMap]);

  const teamsLabels = {
    members: 'Members',
    projects: 'Projects',
    funding: 'Funding',
    ...(teamsContent?.labels || {})
  };

  const teamsFallback = useMemo(() => {
    if (!Array.isArray(teamsContent?.fallback)) {
      return [];
    }
    return teamsContent.fallback.map((team) => ({
      ...team,
      icon: resolveIconComponent(team.icon, Icons.Users)
    }));
  }, [teamsContent]);

  const researchTeams = useMemo(() => {
    const source = Array.isArray(teams) && teams.length ? teams : teamsFallback;
    return source.map((team, index) => {
      const fallbackTeam = teamsFallback[index] || {};
      return {
        ...team,
        name: team.name ?? fallbackTeam.name ?? '',
        lead: team.lead ?? fallbackTeam.lead ?? '',
        members: team.members ?? fallbackTeam.members ?? 0,
        projects: team.projects ?? fallbackTeam.projects ?? 0,
        funding: team.funding ?? fallbackTeam.funding ?? '',
        color: team.color ?? fallbackTeam.color ?? 'from-blue-500 to-cyan-500',
        icon: resolveIconComponent(team.icon ?? fallbackTeam.icon, Icons.Users)
      };
    });
  }, [teams, teamsFallback]);

  const teamStats = useMemo(() => {
    if (!Array.isArray(teamsContent?.stats)) {
      return [];
    }
    return teamsContent.stats.map((stat) => ({
      ...stat,
      icon: resolveIconComponent(stat.icon, Icons.Activity)
    }));
  }, [teamsContent]);

  const teamStatGradients = ['from-blue-900/20 to-purple-900/20', 'from-purple-900/20 to-pink-900/20', 'from-green-900/20 to-teal-900/20'];
  const teamStatIconColors = ['text-blue-400', 'text-purple-400', 'text-green-400'];

  const projectsLabels = {
    progress: 'Progress',
    team: 'Team',
    budget: 'Budget',
    deadline: 'Deadline',
    ...(projectsContent?.labels || {})
  };

  const projectItems = useMemo(() => {
    if (!Array.isArray(projectsContent?.fallback)) {
      return [];
    }
    return projectsContent.fallback;
  }, [projectsContent]);

  const impactPoints = Array.isArray(impactContent?.points) ? impactContent.points : [];

  const impactPositions = [
    { top: '-80px', left: '50%' },
    { top: '50%', right: '-120px' },
    { bottom: '-80px', left: '50%' },
    { top: '50%', left: '-120px' }
  ];

  const datasetPlaceholder = placeholdersContent?.datasets;
  const collaborationPlaceholder = placeholdersContent?.collaboration;

  // Filtered and sorted publications
  const filteredPublications = useMemo(() => {
    const source = Array.isArray(publications) && publications.length ? publications : fallbackPublications;
    let filtered = [...source];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((pub) => {
        const title = (pub?.title || '').toLowerCase();
        const authors = (pub?.authors || '').toLowerCase();
        const tags = Array.isArray(pub?.tags) ? pub.tags.map((tag) => (tag || '').toLowerCase()) : [];

        return title.includes(term) || authors.includes(term) || tags.some((tag) => tag.includes(term));
      });
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((pub) => (pub?.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    filtered.sort((a, b) => {
      const valueFor = (item) => {
        switch (sortBy) {
          case 'citations':
            return Number(item?.citations) || 0;
          case 'impact':
            return Number(item?.impact) || 0;
          case 'downloads':
            return Number(item?.downloadCount) || 0;
          case 'year':
          default:
            return Number(item?.year) || 0;
        }
      };

      const aValue = valueFor(a);
      const bValue = valueFor(b);

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [publications, fallbackPublications, searchTerm, selectedCategory, sortBy, sortOrder]);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-black"></div>
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-2xl">
                <div className="bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl">
                  <span className="text-purple-400 font-space text-sm tracking-widest uppercase">
                    {heroContent?.badge}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold font-space mb-4"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              {heroContent?.title}
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            {heroContent?.description}
          </motion.p>

          {/* Live Metrics Bar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {researchMetrics.map((metric, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-5 h-5 text-purple-400" />
                  <span className={`text-xs ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white font-space">{metric.value}</div>
                <div className="text-xs text-gray-400">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-[72px] z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabConfig.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 capitalize font-medium transition-all duration-300 border-b-2 ${
                  activeTab === tab.key
                    ? 'text-purple-400 border-purple-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <AnimatePresence mode="wait">
        {activeTab === 'publications' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-12">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-12 py-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                  <Icons.Search className="absolute left-4 top-4.5 w-5 h-5 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white focus:outline-none focus:border-purple-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value} className="bg-black">
                      {category.label}
                    </option>
                  ))}
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setSortBy(sort);
                    setSortOrder(order);
                  }}
                  className="px-6 py-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white focus:outline-none focus:border-purple-500"
                >
                  {sortOptions.map(option => (
                    <optgroup key={option.value} label={option.label} className="bg-black">
                      <option value={`${option.value}-desc`} className="bg-black">
                        {t('publications.sort.highToLow', { ns: 'research', label: option.label })}
                      </option>
                      <option value={`${option.value}-asc`} className="bg-black">
                        {t('publications.sort.lowToHigh', { ns: 'research', label: option.label })}
                      </option>
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Publications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  // Loading skeleton
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <div className="animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                        <div className="h-20 bg-white/10 rounded mb-4"></div>
                        <div className="h-4 bg-white/10 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                ) : filteredPublications.length > 0 ? (
                  filteredPublications.map((pub, index) => (
                    <motion.div
                      key={pub.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500 transition-all duration-300">
                        <div className="grid md:grid-cols-12 gap-6">
                          {/* Thumbnail */}
                          <div className="md:col-span-2">
                            <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden">
                              <img
                                src={pub.thumbnail}
                                alt={pub.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="md:col-span-8">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                {pub.title}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{pub.authors}</p>
                            <p className="text-gray-300 mb-4 line-clamp-2">{pub.abstract}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(Array.isArray(pub?.tags) ? pub.tags : []).map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-400">
                                <Icons.Calendar className="inline w-4 h-4 mr-1" />
                                {pub.year}
                              </span>
                              <span className="text-gray-400">
                                <Icons.BookOpen className="inline w-4 h-4 mr-1" />
                                {pub.journal}
                              </span>
                              <span className="text-purple-400 font-semibold">
                                {(publicationLabels?.impact || 'IF')}: {pub.impact}
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="md:col-span-2">
                            <div className="space-y-4">
                              <div className="text-center p-3 bg-white/5 rounded-xl">
                              <div className="text-2xl font-bold text-cyan-400">{pub.citations}</div>
                                <div className="text-xs text-gray-400">{publicationLabels?.citations}</div>
                              </div>
                              <div className="text-center p-3 bg-white/5 rounded-xl">
                              <div className="text-2xl font-bold text-green-400">{pub.downloadCount}</div>
                                <div className="text-xs text-gray-400">{publicationLabels?.downloads}</div>
                              </div>
                              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                                <Icons.Download className="inline w-4 h-4 mr-1" />
                                {publicationLabels?.pdf || 'PDF'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Icons.SearchX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{publicationEmpty?.title}</h3>
                    <p className="text-gray-400">{publicationEmpty?.description}</p>
                  </div>
                )}
              </div>

              {/* Load More */}
              {filteredPublications.length > 0 && (
                <div className="text-center mt-12">
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:scale-105 transition-all">
                    {loadMoreLabel}
                    <Icons.ChevronDown className="inline w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Research Teams Section */}
        {activeTab === 'teams' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {researchTeams.map((team, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r ${team.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl`}></div>
                      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition-all">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${team.color} mb-4`}>
                          <team.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                        {team.lead && (
                          <p className="text-gray-400 text-sm mb-4">
                            {t('teams.labels.lead', { ns: 'research', name: team.lead })}
                          </p>
                        )}
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">{teamsLabels?.members}</span>
                            <span className="text-white font-semibold">{team.members}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">{teamsLabels?.projects}</span>
                            <span className="text-white font-semibold">{team.projects}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">{teamsLabels?.funding}</span>
                            <span className="text-green-400 font-semibold">{team.funding}</span>
                          </div>
                        </div>

                        <button className="w-full py-2 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all">
                          {teamsContent?.viewProfile}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Team Stats */}
              <div className="mt-16 grid md:grid-cols-3 gap-6">
                {teamStats.map((stat, index) => {
                  const StatIcon = stat.icon || Icons.Activity;
                  return (
                    <div
                      key={index}
                      className={`bg-gradient-to-br ${teamStatGradients[index % teamStatGradients.length]} backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center`}
                    >
                      <StatIcon className={`w-12 h-12 mx-auto mb-4 ${teamStatIconColors[index % teamStatIconColors.length]}`} />
                      <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-gray-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-space mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                    {projectsContent?.heading}
                  </span>
                </h2>
                <p className="text-gray-400 text-xl">{projectsContent?.description}</p>
              </div>

              {/* Project Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {projectItems.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">{projectsLabels?.progress}</span>
                        <span className="text-cyan-400">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">{projectsLabels?.team}</div>
                        <div className="text-white font-medium">{project.team}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">{projectsLabels?.budget}</div>
                        <div className="text-green-400 font-medium">{project.budget}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">{projectsLabels?.deadline}</div>
                        <div className="text-yellow-400 font-medium">{project.deadline}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Placeholder Sections */}
      {activeTab === 'datasets' && datasetPlaceholder && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold font-space mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {datasetPlaceholder.title}
            </h2>
            <p className="text-xl text-gray-300 mb-8">{datasetPlaceholder.description}</p>
            {datasetPlaceholder.cta && (
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-white font-medium hover:scale-105 transition-all">
                {datasetPlaceholder.cta}
              </button>
            )}
          </div>
        </motion.section>
      )}

      {activeTab === 'collaboration' && collaborationPlaceholder && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold font-space mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {collaborationPlaceholder.title}
            </h2>
            <p className="text-xl text-gray-300 mb-8">{collaborationPlaceholder.description}</p>
            {collaborationPlaceholder.cta && (
              <button className="px-8 py-4 border-2 border-purple-500 rounded-full text-purple-400 font-medium hover:bg-purple-500 hover:text-white transition-all">
                {collaborationPlaceholder.cta}
              </button>
            )}
          </div>
        </motion.section>
      )}

      {/* Research Impact Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {impactContent?.heading}
              </span>
            </h2>
            <p className="text-xl text-gray-400">{impactContent?.description}</p>
          </motion.div>

          {/* Impact Visualization */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Animated rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-100px] border-2 border-purple-500/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-50px] border-2 border-cyan-500/20 rounded-full"
                />
                
                {/* Center globe */}
                <div className="relative w-48 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Icons.Globe className="w-24 h-24 text-white/80" />
                </div>

                {/* Data points around globe */}
                {impactPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="absolute bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-purple-500/30"
                    style={impactPositions[i] || {}}
                  >
                    <div className="text-2xl font-bold text-purple-400">{point.value}</div>
                    <div className="text-xs text-gray-400">{point.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                {ctaContent?.heading}
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {ctaContent?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:scale-105 transition-all">
                <Icons.UserPlus className="inline w-5 h-5 mr-2" />
                {ctaContent?.primary}
              </button>
              <button className="px-8 py-4 border-2 border-purple-500 rounded-full text-purple-400 font-medium hover:bg-purple-500 hover:text-white transition-all">
                <Icons.Mail className="inline w-5 h-5 mr-2" />
                {ctaContent?.secondary}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ResearchExcellenceRedesign;
