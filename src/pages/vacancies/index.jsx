import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Briefcase, Calendar, Clock, MapPin, Users, Building2,
  GraduationCap, FileText, ExternalLink, Search,
  AlertCircle, CheckCircle, DollarSign, Sparkles, ChevronRight,
  RefreshCw, Globe, Heart, Bell, ArrowDown,
  Microscope, Award, Crown, FlaskConical
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

/* ═══════════════════════════════════════════════════════════════
   STATIC CONFIGS — All Tailwind classes must be fully static
   ═══════════════════════════════════════════════════════════════ */

const EMPLOYMENT_TYPE_STYLES = {
  'full-time': { labelKey: 'fullTime', classes: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  'part-time': { labelKey: 'partTime', classes: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  'contract': { labelKey: 'contract', classes: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  'temporary': { labelKey: 'temporary', classes: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  'internship': { labelKey: 'internship', classes: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' }
};

const STATUS_STYLES = {
  active: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  open: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  closed: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
  draft: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  filled: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
};

const DEPARTMENT_GRADIENTS = {
  'Marine Biological Resources': { gradient: 'from-cyan-500 to-blue-600', bg: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
  'Fisheries & Aquaculture': { gradient: 'from-teal-500 to-emerald-600', bg: 'bg-gradient-to-r from-teal-500 to-emerald-600' },
  'Environmental Studies': { gradient: 'from-green-500 to-emerald-600', bg: 'bg-gradient-to-r from-green-500 to-emerald-600' },
  'Socio Economics & Marketing': { gradient: 'from-purple-500 to-violet-600', bg: 'bg-gradient-to-r from-purple-500 to-violet-600' },
  'Inland Aquatic Resources': { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
  'National Hydrographic Office': { gradient: 'from-sky-500 to-blue-600', bg: 'bg-gradient-to-r from-sky-500 to-blue-600' },
  'Information Technology': { gradient: 'from-violet-500 to-purple-600', bg: 'bg-gradient-to-r from-violet-500 to-purple-600' },
  'Administration': { gradient: 'from-slate-400 to-gray-500', bg: 'bg-gradient-to-r from-slate-400 to-gray-500' },
  'Finance': { gradient: 'from-amber-500 to-orange-600', bg: 'bg-gradient-to-r from-amber-500 to-orange-600' },
  'Library Services': { gradient: 'from-rose-500 to-pink-600', bg: 'bg-gradient-to-r from-rose-500 to-pink-600' }
};
const DEFAULT_DEPT_GRADIENT = { gradient: 'from-cyan-500 to-blue-500', bg: 'bg-gradient-to-r from-cyan-500 to-blue-500' };

const JOURNEY_STEPS = [
  { key: 'browse', icon: Search },
  { key: 'apply', icon: FileText },
  { key: 'interview', icon: Users },
  { key: 'join', icon: Sparkles }
];

const WHY_JOIN_CARDS = [
  { key: 'research', icon: GraduationCap, gradient: 'from-cyan-500 to-blue-500' },
  { key: 'facilities', icon: Building2, gradient: 'from-emerald-500 to-green-500' },
  { key: 'growth', icon: Users, gradient: 'from-purple-500 to-violet-500' },
  { key: 'international', icon: Globe, gradient: 'from-sky-500 to-indigo-500' },
  { key: 'balance', icon: Heart, gradient: 'from-rose-500 to-pink-500' },
  { key: 'impact', icon: Sparkles, gradient: 'from-amber-500 to-orange-500' }
];

const CAREER_LEVELS = [
  { key: 'intern', icon: GraduationCap, color: 'text-emerald-400', border: 'border-emerald-500/30', bgColor: 'bg-emerald-500/10' },
  { key: 'assistant', icon: FlaskConical, color: 'text-cyan-400', border: 'border-cyan-500/30', bgColor: 'bg-cyan-500/10' },
  { key: 'scientist', icon: Microscope, color: 'text-blue-400', border: 'border-blue-500/30', bgColor: 'bg-blue-500/10' },
  { key: 'senior', icon: Award, color: 'text-purple-400', border: 'border-purple-500/30', bgColor: 'bg-purple-500/10' },
  { key: 'head', icon: Crown, color: 'text-amber-400', border: 'border-amber-500/30', bgColor: 'bg-amber-500/10' }
];

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } })
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ═══════════════════════════════════════════════════════════════
   COUNT-UP HOOK
   ═══════════════════════════════════════════════════════════════ */

const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [ref, count];
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

const VacanciesPage = () => {
  const { t, i18n } = useTranslation('vacancies');
  const currentLang = i18n.language;
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => { loadVacancies(); }, []);

  const loadVacancies = async () => {
    setLoading(true);
    setError(false);
    try {
      const vacanciesRef = collection(db, 'vacancies');
      const q = query(vacanciesRef, orderBy('postedDate', 'desc'));
      const snapshot = await getDocs(q);
      setVacancies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error loading vacancies:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const activeVacancies = vacancies.filter(v => v.status === 'active' || v.status === 'open');
  const closedVacancies = vacancies.filter(v => v.status === 'closed' || v.status === 'filled');
  const departments = [...new Set(vacancies.map(v => v.department).filter(Boolean))];

  const filteredVacancies = (activeTab === 'active' ? activeVacancies : closedVacancies)
    .filter(vacancy => {
      const matchesSearch =
        vacancy.title?.[currentLang]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.title?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.department?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || vacancy.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDaysRemaining = useCallback((deadline) => {
    if (!deadline) return null;
    return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  }, []);

  /* ─── Count-up refs ─── */
  const [openRef, openCount] = useCountUp(activeVacancies.length, 1500);
  const [deptRef, deptCount] = useCountUp(departments.length, 1500);

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO — Hiring Beacon Visual Centerpiece
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031730] via-[#06254a] to-[#0b3d74] text-white pt-32 pb-24">
        {/* Background FX */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">

            {/* WE'RE HIRING pulsing badge */}
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-6">
              <motion.div
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-red-500/90 backdrop-blur-sm shadow-lg shadow-red-500/30"
              >
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-white"
                />
                <span className="text-sm font-bold text-white tracking-wider">{t('hiringBadge')}</span>
              </motion.div>
            </motion.div>

            {/* Sonar Beacon */}
            <motion.div variants={fadeUp} custom={1} className="flex justify-center mb-8">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                {/* Sonar pulse rings */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                    animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
                  />
                ))}
                {/* Steady glow ring */}
                <div className="absolute inset-4 rounded-full border border-cyan-400/10" />
                <div className="absolute inset-8 rounded-full border border-cyan-400/5" />
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ boxShadow: ['0 0 30px rgba(6,182,212,0.3)', '0 0 60px rgba(6,182,212,0.5)', '0 0 30px rgba(6,182,212,0.3)'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
                  >
                    <Briefcase className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeUp} custom={2}
              className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4
                text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white"
            >
              {t('title')}
            </motion.h1>

            <motion.p variants={fadeUp} custom={3}
              className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10"
            >
              {t('subtitle')}
            </motion.p>

            {/* Animated Stats */}
            <motion.div variants={fadeUp} custom={4} className="flex justify-center gap-6 sm:gap-10 flex-wrap mb-8">
              <div ref={openRef} className="rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 px-7 py-5 text-center min-w-[130px] hover:bg-white/[0.1] transition-all">
                <div className="text-4xl font-bold text-cyan-400 font-mono">{openCount}</div>
                <div className="text-sm text-slate-400 mt-1">{t('openPositions')}</div>
              </div>
              <div ref={deptRef} className="rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 px-7 py-5 text-center min-w-[130px] hover:bg-white/[0.1] transition-all">
                <div className="text-4xl font-bold text-emerald-400 font-mono">{deptCount}</div>
                <div className="text-sm text-slate-400 mt-1">{t('departments')}</div>
              </div>
              <div className="rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 px-7 py-5 text-center min-w-[130px] hover:bg-white/[0.1] transition-all">
                <div className="text-4xl font-bold text-purple-400 font-mono">15+</div>
                <div className="text-sm text-slate-400 mt-1">{t('researchDivisions')}</div>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-1 text-slate-500"
            >
              <span className="text-xs">{t('scrollToExplore')}</span>
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: APPLICATION JOURNEY — 4-Step Timeline
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white mb-3">{t('journey.title')}</h2>
              <p className="text-slate-400 max-w-xl mx-auto">{t('journey.subtitle')}</p>
            </motion.div>

            <div className="relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="w-full h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 origin-left"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
                {JOURNEY_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.key}
                      variants={fadeUp}
                      custom={idx}
                      className="flex flex-col items-center text-center relative z-10"
                    >
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20
                          border border-cyan-500/30 flex items-center justify-center mb-4 backdrop-blur-sm
                          hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-default"
                      >
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                      </motion.div>
                      {/* Step number */}
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/30">
                        {idx + 1}
                      </div>
                      <h3 className="font-headline text-base sm:text-lg font-bold text-white mb-1">{t(`journey.${step.key}.title`)}</h3>
                      <p className="text-sm text-slate-400 max-w-[180px]">{t(`journey.${step.key}.desc`)}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: FILTERS & SEARCH
          ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Tab Switcher */}
          <div className="inline-flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {t('open')} ({activeVacancies.length})
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'closed'
                  ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              {t('closed')} ({closedVacancies.length})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Department filter */}
            <div className="relative w-full sm:w-52">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                  focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all appearance-none"
              >
                <option value="all" className="bg-slate-900">{t('allDepartments')}</option>
                {departments.map(dept => (
                  <option key={dept} value={dept} className="bg-slate-900">{dept}</option>
                ))}
              </select>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                  text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2
                  focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: VACANCY CARDS — 2-Column Grid
          ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-400 text-sm">{t('loading')}</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="font-headline text-xl font-bold text-white mb-2">{t('error.title')}</h3>
            <button onClick={loadVacancies}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500
                text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {t('error.retry')}
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredVacancies.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-5">
              <Briefcase className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-headline text-xl font-bold text-white mb-2">
              {activeTab === 'active' ? t('noOpen') : t('noClosed')}
            </h3>
            <p className="text-sm text-slate-400">
              {activeTab === 'active' ? t('noOpenHint') : t('noClosedHint')}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && filteredVacancies.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVacancies.map((vacancy, index) => {
                const empStyle = EMPLOYMENT_TYPE_STYLES[vacancy.employmentType] || EMPLOYMENT_TYPE_STYLES['full-time'];
                const statusStyle = STATUS_STYLES[vacancy.status] || STATUS_STYLES.active;
                const deptStyle = DEPARTMENT_GRADIENTS[vacancy.department] || DEFAULT_DEPT_GRADIENT;
                const daysLeft = getDaysRemaining(vacancy.deadline);

                return (
                  <motion.div
                    key={vacancy.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 30 }}
                    whileHover={{ y: -6 }}
                    className="group relative rounded-2xl overflow-hidden bg-white/[0.04] backdrop-blur-sm border border-white/10
                      hover:border-cyan-500/40 hover:bg-white/[0.07] transition-all duration-300
                      hover:shadow-xl hover:shadow-cyan-500/10"
                  >
                    {/* Gradient header strip */}
                    <div className={`h-1.5 ${deptStyle.bg}`} />

                    <div className="p-6">
                      {/* Top: badges + deadline */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle}`}>
                            {vacancy.status === 'active' || vacancy.status === 'open' ? t('open').toUpperCase() : t('closed').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${empStyle.classes}`}>
                            {t(empStyle.labelKey)}
                          </span>
                        </div>
                        {/* Countdown */}
                        {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
                          <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            {t('daysLeft', { count: daysLeft })}
                          </motion.span>
                        )}
                        {daysLeft !== null && daysLeft <= 0 && vacancy.status !== 'closed' && (
                          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">
                            {t('expired')}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-headline text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {vacancy.title?.[currentLang] || vacancy.title?.en}
                      </h3>

                      {/* Department & Location */}
                      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {vacancy.department}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {vacancy.location || 'Colombo, Sri Lanka'}
                        </span>
                      </div>

                      {/* Description */}
                      {(vacancy.description?.[currentLang] || vacancy.description?.en) && (
                        <p className="text-sm text-slate-300/80 mb-4 line-clamp-2 leading-relaxed">
                          {vacancy.description?.[currentLang] || vacancy.description?.en}
                        </p>
                      )}

                      {/* Qualifications */}
                      {vacancy.qualifications && vacancy.qualifications.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {vacancy.qualifications.slice(0, 3).map((qual, i) => (
                            <span key={i} className="flex items-center gap-1 text-xs bg-white/5 text-slate-300 border border-white/10 px-2.5 py-1 rounded-lg">
                              <GraduationCap className="w-3 h-3 text-slate-500" />
                              {qual}
                            </span>
                          ))}
                          {vacancy.qualifications.length > 3 && (
                            <span className="text-xs text-slate-500 px-2 py-1">
                              {t('moreQualifications', { count: vacancy.qualifications.length - 3 })}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-5">
                        {vacancy.postedDate && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {t('posted')}: {formatDate(vacancy.postedDate)}
                          </span>
                        )}
                        {vacancy.salary && (
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5" />
                            {vacancy.salary}
                          </span>
                        )}
                        {vacancy.positions && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                            <Users className="w-3 h-3" />
                            {vacancy.positions} {vacancy.positions > 1 ? t('positionsPlural') : t('positions')}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        {(vacancy.status === 'active' || vacancy.status === 'open') && vacancy.applyUrl && (
                          <motion.a
                            href={vacancy.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-500
                              text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                          >
                            {t('applyNow')}
                            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                              <ExternalLink className="w-4 h-4" />
                            </motion.span>
                          </motion.a>
                        )}
                        {vacancy.documentUrl && (
                          <a
                            href={vacancy.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 bg-white/[0.06] border border-white/10
                              text-white rounded-xl font-semibold text-sm hover:bg-white/[0.1] hover:border-white/20 transition-all"
                          >
                            <FileText className="w-4 h-4" />
                            {t('viewDetails')}
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: WHY JOIN NARA — 6 Cards
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white mb-3">{t('whyJoin.title')}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{t('whyJoin.subtitle')}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_JOIN_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div key={card.key} variants={fadeUp} custom={idx}
                    whileHover={{ y: -6 }}
                    className="group rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10
                      hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 p-6"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="font-headline text-lg font-bold text-white mb-2">{t(`whyJoin.${card.key}.title`)}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{t(`whyJoin.${card.key}.desc`)}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: CAREER GROWTH PATH
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white mb-3">{t('career.title')}</h2>
              <p className="text-slate-400 max-w-xl mx-auto">{t('career.subtitle')}</p>
            </motion.div>

            {/* Desktop: horizontal path */}
            <div className="hidden md:flex items-center justify-center gap-0">
              {CAREER_LEVELS.map((level, idx) => {
                const Icon = level.icon;
                return (
                  <React.Fragment key={level.key}>
                    <motion.div
                      variants={fadeUp}
                      custom={idx}
                      whileHover={{ y: -8 }}
                      className={`flex flex-col items-center text-center p-5 rounded-2xl border ${level.border} ${level.bgColor}
                        min-w-[130px] hover:bg-white/[0.06] transition-all duration-300 cursor-default`}
                    >
                      <Icon className={`w-8 h-8 ${level.color} mb-3`} />
                      <div className="font-headline text-sm font-bold text-white mb-1">{t(`career.${level.key}.title`)}</div>
                      <div className="text-xs text-slate-500">{t(`career.${level.key}.years`)}</div>
                    </motion.div>
                    {/* Arrow connector */}
                    {idx < CAREER_LEVELS.length - 1 && (
                      <motion.div
                        variants={fadeUp}
                        custom={idx + 0.5}
                        className="flex items-center mx-2"
                      >
                        <div className="w-8 h-0.5 bg-gradient-to-r from-slate-600 to-slate-500" />
                        <ChevronRight className="w-4 h-4 text-slate-500 -ml-1" />
                      </motion.div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Mobile: vertical path */}
            <div className="md:hidden flex flex-col items-center gap-4">
              {CAREER_LEVELS.map((level, idx) => {
                const Icon = level.icon;
                return (
                  <React.Fragment key={level.key}>
                    <motion.div
                      variants={fadeUp}
                      custom={idx}
                      className={`flex items-center gap-4 w-full max-w-sm p-4 rounded-2xl border ${level.border} ${level.bgColor}`}
                    >
                      <Icon className={`w-8 h-8 ${level.color} flex-shrink-0`} />
                      <div>
                        <div className="font-headline text-sm font-bold text-white">{t(`career.${level.key}.title`)}</div>
                        <div className="text-xs text-slate-500">{t(`career.${level.key}.years`)}</div>
                      </div>
                    </motion.div>
                    {idx < CAREER_LEVELS.length - 1 && (
                      <div className="w-0.5 h-4 bg-slate-700" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: CTA — Split Layout with Job Alerts
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Glow background */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
            <div className="pointer-events-none absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/30"
                animate={{ y: [0, -25, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
                style={{ left: `${10 + i * 15}%`, top: `${25 + (i % 3) * 25}%` }}
              />
            ))}

            <div className="relative border border-white/10 rounded-3xl p-8 sm:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left: CTA */}
                <div className="text-center md:text-left">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
                  <p className="text-slate-300 mb-6 leading-relaxed">{t('cta.subtitle')}</p>
                  <Link
                    to="/contact-us"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-cyan-500 to-blue-500
                      text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                  >
                    {t('cta.button')}
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Right: Job Alerts */}
                <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-headline text-lg font-bold text-white">{t('cta.alertTitle')}</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{t('cta.alertDesc')}</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder={t('cta.emailPlaceholder')}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm
                        focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl text-sm
                        hover:shadow-lg hover:shadow-emerald-500/20 transition-all whitespace-nowrap"
                    >
                      {t('cta.notify')}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VacanciesPage;
