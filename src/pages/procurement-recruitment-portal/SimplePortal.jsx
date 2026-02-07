import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, FileText, Search, MapPin, Calendar,
  DollarSign, Building, X, LogIn, UserPlus,
  Clock, TrendingUp, Users, AlertTriangle,
  ArrowRight, Filter, Download, Eye, Loader, Globe, Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EnhancedRegistration from './components/EnhancedRegistration';
import { jobsService, tendersService, dashboardStatsService, seedPortalData } from '../../services/portalDataService';

// Static config to avoid dynamic Tailwind classes
const STAT_CONFIGS = [
  { key: 'activeJobs', icon: Briefcase, gradient: 'from-cyan-500 to-blue-500', textColor: 'text-cyan-400' },
  { key: 'openTenders', icon: FileText, gradient: 'from-emerald-500 to-green-500', textColor: 'text-emerald-400' },
  { key: 'totalApplications', icon: Users, gradient: 'from-purple-500 to-violet-500', textColor: 'text-purple-400' },
  { key: 'successRate', icon: TrendingUp, gradient: 'from-amber-500 to-orange-500', textColor: 'text-amber-400' },
];

const STATUS_STYLES = {
  open: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  published: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  closed: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
  draft: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  filled: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

const SimplePortal = () => {
  const { t, i18n } = useTranslation('procurement');
  const [activeTab, setActiveTab] = useState('jobs');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    openTenders: 0,
    totalApplications: 0,
    successRate: 0
  });

  useEffect(() => {
    loadPortalData();
  }, []);

  const loadPortalData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsResult, tendersResult, statsResult] = await Promise.all([
        jobsService.getAllPublished({ limit: 10 }),
        tendersService.getAllPublished({ limit: 10 }),
        dashboardStatsService.getStats()
      ]);

      const hasJobs = jobsResult.data && jobsResult.data.length > 0;
      const hasTenders = tendersResult.data && tendersResult.data.length > 0;

      if (!hasJobs && !hasTenders) {
        console.log('No data found, seeding database...');
        await seedPortalData();
        const [newJobsResult, newTendersResult, newStatsResult] = await Promise.all([
          jobsService.getAllPublished({ limit: 10 }),
          tendersService.getAllPublished({ limit: 10 }),
          dashboardStatsService.getStats()
        ]);
        setJobs(newJobsResult.data || []);
        setTenders(newTendersResult.data || []);
        setStats(newStatsResult.data || {
          activeJobs: newJobsResult.data?.length || 0,
          openTenders: newTendersResult.data?.length || 0,
          totalApplications: 0,
          successRate: 0
        });
      } else {
        setJobs(jobsResult.data || []);
        setTenders(tendersResult.data || []);
        setStats(statsResult.data || {
          activeJobs: jobsResult.data?.length || 0,
          openTenders: tendersResult.data?.length || 0,
          totalApplications: 0,
          successRate: 0
        });
      }
    } catch (err) {
      console.error('Error loading portal data:', err);
      setError(err.message);
      setJobs([]);
      setTenders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDaysRemaining = (deadline) => {
    if (!deadline) return 0;
    const today = new Date();
    const endDate = new Date(deadline);
    const days = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getStatValue = (key) => {
    if (key === 'successRate') return `${stats.successRate || 0}%`;
    if (key === 'totalApplications') return stats.totalApplications > 0 ? `${stats.totalApplications}+` : '0';
    return (stats[key] || 0).toString();
  };

  // Filter by search query
  const filteredJobs = jobs.filter(job => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (job.jobTitle || job.title || '').toLowerCase();
    const dept = (job.department || '').toLowerCase();
    const loc = (job.location || '').toLowerCase();
    return title.includes(q) || dept.includes(q) || loc.includes(q);
  });

  const filteredTenders = tenders.filter(tender => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (tender.title || '').toLowerCase();
    const cat = (tender.category || '').toLowerCase();
    return title.includes(q) || cat.includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031730] via-[#06254a] to-[#0b3d74] text-white pt-32 pb-20">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-block px-5 py-2 mb-6 text-sm font-semibold tracking-wide rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-300">
              {t('simplePortal.hero.badge')}
            </span>

            {/* Title */}
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              {t('simplePortal.hero.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {t('simplePortal.hero.titleHighlight')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              {t('simplePortal.hero.description')}
            </p>

            {/* Auth buttons */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold transition-all border border-white/20 hover:bg-white/20 hover:border-white/40"
              >
                <LogIn className="w-5 h-5" />
                {t('simplePortal.hero.signIn')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRegistration(true)}
                className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
              >
                <UserPlus className="w-5 h-5" />
                {t('simplePortal.hero.registerNow')}
              </motion.button>
            </div>

            {/* Tab Switcher */}
            <div className="inline-flex bg-white/10 backdrop-blur-md rounded-2xl p-1.5 gap-1 border border-white/10">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                  activeTab === 'jobs'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-sm sm:text-base">{t('simplePortal.tabs.jobs.title')}</div>
                  <div className="text-xs opacity-70">{t('simplePortal.tabs.jobs.count', { count: jobs.length })}</div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('tenders')}
                className={`px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                  activeTab === 'tenders'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-sm sm:text-base">{t('simplePortal.tabs.tenders.title')}</div>
                  <div className="text-xs opacity-70">{t('simplePortal.tabs.tenders.count', { count: tenders.length })}</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 mb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_CONFIGS.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 p-6 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>{getStatValue(stat.key)}</div>
              <div className="text-sm text-slate-400">{t(`simplePortal.stats.${stat.key}`)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Search Bar ── */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder={activeTab === 'jobs' ? t('simplePortal.search.jobsPlaceholder') : t('simplePortal.search.tendersPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
              />
            </div>
            <button className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 justify-center shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all">
              <Search className="w-5 h-5" />
              {t('simplePortal.search.button')}
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400 font-medium">{t('simplePortal.jobs.loading')}</p>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-24">
            <AlertTriangle className="w-16 h-16 text-red-400/80 mx-auto mb-4" />
            <h3 className="font-headline text-xl font-bold text-white mb-2">{t('simplePortal.error.title', 'Unable to load portal data')}</h3>
            <p className="text-slate-400 mb-6 text-sm">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadPortalData}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/20 transition-all"
            >
              {t('simplePortal.error.retry', 'Try Again')}
            </motion.button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ── Jobs Tab ── */}
            {activeTab === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-1">{t('simplePortal.jobs.heading')}</h2>
                    <p className="text-slate-400 text-sm">{t('simplePortal.jobs.subheading')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {filteredJobs.length === 0 ? (
                    <div className="text-center py-20">
                      <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                      <h3 className="font-headline text-xl font-bold text-white mb-2">{t('simplePortal.jobs.noJobs')}</h3>
                      <p className="text-slate-500">{t('simplePortal.jobs.noJobsMessage')}</p>
                    </div>
                  ) : (
                    filteredJobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="group rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-6">
                          {/* Badges */}
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[job.status] || STATUS_STYLES.open}`}>
                              ● {job.status || t('simplePortal.jobs.status')}
                            </span>
                            <span className="px-3 py-1 bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold">
                              {job.employmentType || 'Full-time'}
                            </span>
                            <span className="px-3 py-1 bg-purple-500/15 text-purple-400 border border-purple-500/20 rounded-full text-xs font-semibold">
                              {t('simplePortal.jobs.applicants', { count: job.applicationCount || 0 })}
                            </span>
                          </div>

                          {/* Title & description */}
                          <h3 className="font-headline text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {job.jobTitle || job.title}
                          </h3>
                          <p className="text-sm text-slate-300/80 leading-relaxed mb-5 line-clamp-2">{job.description}</p>

                          {/* Meta grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">{t('simplePortal.jobs.department')}</div>
                                <div className="text-sm font-semibold text-slate-200">{job.department}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">{t('simplePortal.jobs.location')}</div>
                                <div className="text-sm font-semibold text-slate-200">{job.location}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">{t('simplePortal.jobs.salaryRange')}</div>
                                <div className="text-sm font-bold text-amber-400">{job.salaryRange || job.salary}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">{t('simplePortal.jobs.deadline')}</div>
                                <div className="text-sm font-bold text-red-400">
                                  {t('simplePortal.jobs.daysRemaining', { count: getDaysRemaining(job.closingDate || job.deadline) })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex gap-2">
                              <button className="px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                                <Eye className="w-4 h-4" />
                                {t('simplePortal.jobs.viewDetails')}
                              </button>
                              <button className="px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                                <Download className="w-4 h-4" />
                                {t('simplePortal.jobs.downloadJD')}
                              </button>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowRegistration(true)}
                              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center gap-2 transition-all"
                            >
                              {t('simplePortal.jobs.applyNow')}
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Tenders Tab ── */}
            {activeTab === 'tenders' && (
              <motion.div
                key="tenders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-1">{t('simplePortal.tenders.heading')}</h2>
                    <p className="text-slate-400 text-sm">{t('simplePortal.tenders.subheading')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {filteredTenders.length === 0 ? (
                    <div className="text-center py-20">
                      <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                      <h3 className="font-headline text-xl font-bold text-white mb-2">{t('simplePortal.tenders.noTenders')}</h3>
                      <p className="text-slate-500">{t('simplePortal.tenders.noTendersMessage')}</p>
                    </div>
                  ) : (
                    filteredTenders.map((tender, index) => (
                      <motion.div
                        key={tender.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="group rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-6">
                          {/* Badges */}
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[tender.status] || STATUS_STYLES.open}`}>
                              ● {tender.status || t('simplePortal.tenders.status')}
                            </span>
                            <span className="px-3 py-1 bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold">
                              {tender.category}
                            </span>
                          </div>

                          {/* Title & description */}
                          <h3 className="font-headline text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                            {tender.title}
                          </h3>
                          <p className="text-sm text-slate-300/80 leading-relaxed mb-5 line-clamp-2">{tender.description}</p>

                          {/* Meta grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">{t('simplePortal.jobs.department')}</div>
                                <div className="text-sm font-semibold text-slate-200">{tender.department}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">{t('simplePortal.tenders.tenderValue')}</div>
                                <div className="text-sm font-bold text-emerald-400">{tender.tenderValue || tender.value}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">{t('simplePortal.tenders.bidOpening')}</div>
                                <div className="text-sm font-semibold text-slate-200">
                                  {tender.bidOpeningDate || tender.bidOpening
                                    ? new Date(tender.bidOpeningDate || tender.bidOpening).toLocaleDateString()
                                    : '—'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-slate-500">{t('simplePortal.tenders.deadline')}</div>
                                <div className="text-sm font-bold text-red-400">
                                  {t('simplePortal.tenders.daysRemaining', { count: getDaysRemaining(tender.closingDate || tender.deadline) })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Required documents */}
                          {(tender.requiredDocuments || tender.documents || []).length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              <span className="text-xs text-slate-500">{t('simplePortal.tenders.requiredDocuments')}</span>
                              {(tender.requiredDocuments || tender.documents || []).map((doc, i) => (
                                <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-slate-300 rounded text-xs font-medium">
                                  {doc}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex gap-2">
                              <button className="px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                                <Eye className="w-4 h-4" />
                                {t('simplePortal.tenders.viewDetails')}
                              </button>
                              <button className="px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                                <Download className="w-4 h-4" />
                                {t('simplePortal.tenders.downloadDocuments')}
                              </button>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowRegistration(true)}
                              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center gap-2 transition-all"
                            >
                              {t('simplePortal.tenders.submitBid')}
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>

      {/* ── CTA Section ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white mb-4">{t('simplePortal.cta.heading')}</h2>
          <p className="text-lg text-slate-300/90 mb-8">
            {t('simplePortal.cta.description')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRegistration(true)}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold text-lg flex items-center gap-3 mx-auto shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
          >
            <UserPlus className="w-6 h-6" />
            {t('simplePortal.cta.createAccount')}
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </section>

      {/* ── Modals ── */}
      {showRegistration && (
        <EnhancedRegistration
          onClose={() => setShowRegistration(false)}
          onSuccess={(user) => {
            console.log('User registered:', user);
            setShowRegistration(false);
          }}
          translations={{}}
        />
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md"
          >
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{t('simplePortal.hero.signIn')}</h2>
                <button onClick={() => setShowLogin(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <p className="text-white/70 text-sm mt-1">Login to access your account</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                />
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all">
                Login to Account
              </button>
              <p className="text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegistration(true);
                  }}
                  className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                >
                  Register Now
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SimplePortal;
