import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, MapPin, Award, Search, X, SearchX,
  FlaskConical, Globe, Briefcase, Mail, BookOpen, Download,
  ChevronUp
} from 'lucide-react';
import { DIVISIONS_CONFIG, getDivisionsByCategory } from '../../data/divisionsConfig';
import HeroImageCarousel from '../../components/hero/HeroImageCarousel';
import DivisionCategorySection from './DivisionCategorySection';
import PDFDownloadCard from '../../components/PDFDownloadCard';

// ─── Lazy section hook (IntersectionObserver) ────────────────────────────────
function useLazySection(rootMargin = '200px') {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);
  return [ref, isVisible];
}

// ─── Hero images derived from division hero images ───────────────────────────
const HERO_IMAGES = DIVISIONS_CONFIG
  .filter(d => d.heroImage)
  .slice(0, 8)
  .map(d => ({ id: d.id, src: d.heroImage, alt: d.name?.en || d.id }));

// ─── Stat icon map (named imports only) ──────────────────────────────────────
const STAT_ICON_MAP = { Building2, Users, MapPin, Award };

// ─── Category tab config ─────────────────────────────────────────────────────
const CATEGORY_TABS = [
  { id: 'research', icon: FlaskConical, sectionId: 'section-research', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'regional', icon: Globe, sectionId: 'section-regional', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'supporting', icon: Briefcase, sectionId: 'section-supporting', gradient: 'from-amber-500 to-orange-500' },
];

// ─── Main Component ──────────────────────────────────────────────────────────
const DivisionsHub = () => {
  const { t, i18n } = useTranslation('divisions');
  const navigate = useNavigate();
  const currentLang = i18n.language;
  const isTamil = currentLang === 'ta';
  const isSinhala = currentLang === 'si';

  // Font classes for multilingual
  const headingFontClass = isTamil ? 'font-tamil' : isSinhala ? 'font-sinhala' : 'font-headline';
  const headingLeadingClass = isTamil || isSinhala ? 'leading-[1.5]' : 'leading-tight';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('research');
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Refs for scroll tracking
  const tabBarRef = useRef(null);
  const sectionRefs = useRef({});

  // Lazy section hooks
  const [researchRef, researchVisible] = useLazySection('300px');
  const [regionalRef, regionalVisible] = useLazySection('300px');
  const [supportingRef, supportingVisible] = useLazySection('300px');

  // ─── Categorize divisions ──────────────────────────────────────────────────
  const researchDivisions = useMemo(() => getDivisionsByCategory('research'), []);
  const regionalDivisions = useMemo(() => getDivisionsByCategory('regional'), []);
  const supportingDivisions = useMemo(() => getDivisionsByCategory('supporting'), []);

  // ─── Search filtering ──────────────────────────────────────────────────────
  const filterBySearch = useCallback((divisions) => {
    if (!searchQuery.trim()) return divisions;
    const q = searchQuery.toLowerCase();
    return divisions.filter(d => {
      const name = (d.name?.[currentLang] || d.name?.en || '').toLowerCase();
      const tagline = (d.tagline?.[currentLang] || d.tagline?.en || '').toLowerCase();
      const desc = (d.description?.[currentLang] || d.description?.en || '').toLowerCase();
      return name.includes(q) || tagline.includes(q) || desc.includes(q);
    });
  }, [searchQuery, currentLang]);

  const filteredResearch = useMemo(() => filterBySearch(researchDivisions), [filterBySearch, researchDivisions]);
  const filteredRegional = useMemo(() => filterBySearch(regionalDivisions), [filterBySearch, regionalDivisions]);
  const filteredSupporting = useMemo(() => filterBySearch(supportingDivisions), [filterBySearch, supportingDivisions]);
  const totalFiltered = filteredResearch.length + filteredRegional.length + filteredSupporting.length;
  const totalAll = DIVISIONS_CONFIG.length;

  // ─── Translation data ──────────────────────────────────────────────────────
  const heroStats = t('hero.stats', { returnObjects: true }) || [];
  const sections = t('sections', { returnObjects: true }) || {};
  const categories = t('categories', { returnObjects: true }) || {};

  // ─── Scroll-spy: track active section ──────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);

      // Determine which section is in view
      const offsets = CATEGORY_TABS.map(tab => {
        const el = sectionRefs.current[tab.sectionId];
        if (!el) return { id: tab.id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: tab.id, top: Math.abs(rect.top - 150) };
      });
      const closest = offsets.reduce((a, b) => (a.top < b.top ? a : b));
      if (closest.top < 800) setActiveTab(closest.id);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Scroll to section ─────────────────────────────────────────────────────
  const scrollToSection = useCallback((sectionId) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      const yOffset = -130; // account for sticky navbar + tab bar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  // ─── Assign section refs ───────────────────────────────────────────────────
  const setSectionRef = useCallback((sectionId) => (el) => {
    sectionRefs.current[sectionId] = el;
  }, []);

  // ─── PDF click handler ─────────────────────────────────────────────────────
  const handlePdfClick = useCallback((division) => {
    setSelectedDivision(division);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative h-[75vh] min-h-[500px] max-h-[700px] overflow-hidden">
        {/* Background carousel */}
        <HeroImageCarousel
          images={HERO_IMAGES}
          autoPlayInterval={6000}
          showControls={false}
          showIndicators={false}
          className="absolute inset-0 rounded-none"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-6"
          >
            <Building2 size={18} className="text-cyan-400" />
            <span className="text-sm font-semibold text-white/90 tracking-wide uppercase">
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-5xl ${headingFontClass} ${headingLeadingClass}`}
          >
            {t('hero.title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mb-8 leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-2xl mb-10"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden focus-within:border-cyan-400/50 transition-colors">
                <Search className="ml-4 text-slate-400 shrink-0" size={20} />
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  aria-label={t('hero.searchAria')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-4 bg-transparent text-white placeholder-slate-400 text-base focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mr-4 text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl w-full"
          >
            {heroStats.map((stat, idx) => {
              const StatIcon = STAT_ICON_MAP[stat.icon] || Award;
              return (
                <div
                  key={`${stat.label}-${idx}`}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center"
                >
                  <StatIcon size={22} className="mx-auto mb-1 text-cyan-400" />
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ STICKY TAB BAR ═══════════════════ */}
      <div
        ref={tabBarRef}
        className="sticky top-[72px] z-40 bg-slate-950/95 backdrop-blur-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            {CATEGORY_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const count = tab.id === 'research' ? filteredResearch.length
                : tab.id === 'regional' ? filteredRegional.length
                : filteredSupporting.length;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    scrollToSection(tab.sectionId);
                  }}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TabIcon size={16} />
                  <span>{categories[tab.id] || tab.id}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Search results indicator */}
            {searchQuery && (
              <div className="ml-auto text-xs text-slate-500 whitespace-nowrap pl-4">
                {t('results.summary', { count: totalFiltered, total: totalAll })}
                {' '}{t('results.matching', { query: searchQuery })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════ RESEARCH DIVISIONS ═══════════════════ */}
      <div ref={(el) => { researchRef.current = el; sectionRefs.current['section-research'] = el; }}>
        {researchVisible ? (
          <DivisionCategorySection
            id="section-research"
            title={sections.research?.title || 'Research Divisions'}
            subtitle={sections.research?.subtitle || ''}
            icon={FlaskConical}
            divisions={filteredResearch}
            gradient="from-blue-500 to-cyan-500"
            onPdfClick={handlePdfClick}
          />
        ) : (
          <div className="h-96" />
        )}
      </div>

      {/* ═══════════════════ REGIONAL DIVISIONS ═══════════════════ */}
      <div ref={(el) => { regionalRef.current = el; sectionRefs.current['section-regional'] = el; }}>
        {regionalVisible ? (
          <DivisionCategorySection
            id="section-regional"
            title={sections.regional?.title || 'Regional Research Centers'}
            subtitle={sections.regional?.subtitle || ''}
            icon={Globe}
            divisions={filteredRegional}
            gradient="from-emerald-500 to-teal-500"
            onPdfClick={handlePdfClick}
          />
        ) : (
          <div className="h-96" />
        )}
      </div>

      {/* ═══════════════════ SUPPORTING DIVISIONS ═══════════════════ */}
      <div ref={(el) => { supportingRef.current = el; sectionRefs.current['section-supporting'] = el; }}>
        {supportingVisible ? (
          <DivisionCategorySection
            id="section-supporting"
            title={sections.supporting?.title || 'Supporting Divisions'}
            subtitle={sections.supporting?.subtitle || ''}
            icon={Briefcase}
            divisions={filteredSupporting}
            gradient="from-amber-500 to-orange-500"
            onPdfClick={handlePdfClick}
          />
        ) : (
          <div className="h-96" />
        )}
      </div>

      {/* ═══════════════════ EMPTY STATE ═══════════════════ */}
      {searchQuery && totalFiltered === 0 && (
        <div className="py-20 text-center px-4">
          <SearchX size={64} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t('empty.title')}</h3>
          <p className="text-slate-400 mb-6">{t('empty.description')}</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-400 transition-colors"
          >
            {t('empty.clear')}
          </button>
        </div>
      )}

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-slate-950 to-cyan-900/50" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {t('cta.heading')}
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('cta.description')}
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/contact')}
              className="flex items-center gap-2 bg-white text-slate-900 px-7 py-3.5 rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              <Mail size={20} />
              {t('cta.primary')}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/research-excellence-portal')}
              className="flex items-center gap-2 border-2 border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              <BookOpen size={20} />
              {t('cta.secondary')}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              <Download size={20} />
              {t('cta.downloadAll')}
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PDF DOWNLOAD MODAL ═══════════════════ */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDivision(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedDivision(null)}
                  className="absolute -top-3 -right-3 bg-slate-800 border border-white/10 rounded-full p-2 shadow-xl hover:bg-slate-700 transition-colors z-10"
                >
                  <X size={20} className="text-white" />
                </button>
                <PDFDownloadCard division={selectedDivision} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ SCROLL TO TOP ═══════════════════ */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-cyan-500 text-white shadow-lg hover:bg-cyan-400 transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DivisionsHub;
