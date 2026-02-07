import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// Data
import { getDivisionBySlug } from '../../data/divisionsConfig';
import { getDivisionContent, getProjects, getTeamMembers } from '../../services/divisionsService';
import { getDefaultTeamMembers } from '../../data/divisionTeams';
import { getDefaultProjects } from '../../data/divisionProjects';
import { getDefaultImpact } from '../../data/divisionImpact';
import { getDivisionImages } from '../../services/divisionImagesService';
import { getDivisionHeroImages } from '../../data/divisionHeroImages';
import { getLocalDivisionImages, saveLocalDivisionImages } from '../../utils/localImageStorage';
import { getLabel } from '../../utils/divisionTranslations';
import { getDivisionColors } from '../../utils/divisionColorMap';

// Sub-components
import DivisionHero from './DivisionHero';
import DivisionOverview from './DivisionOverview';
import DivisionFocusAreas from './DivisionFocusAreas';
import DivisionServices from './DivisionServices';
import DivisionProjects from './DivisionProjects';
import DivisionTeam from './DivisionTeam';
import DivisionImpact from './DivisionImpact';
import DivisionContact from './DivisionContact';
import SEOHead from '../../components/shared/SEOHead';

/* ─── Lazy-section hook ─── */
function useLazySection(rootMargin = '300px') {
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

/* ─── Nav sections config (text only, no icons) ─── */
const SECTIONS = [
  { id: 'overview', label: { en: 'Overview', si: 'දළ විශ්ලේෂණය', ta: 'கண்ணோட்டம்' } },
  { id: 'focus', label: { en: 'Focus Areas', si: 'අවධාන ක්ෂේත්‍ර', ta: 'கவன பகுதிகள்' } },
  { id: 'services', label: { en: 'Services', si: 'සේවා', ta: 'சேவைகள்' } },
  { id: 'projects', label: { en: 'Projects', si: 'ව්‍යාපෘති', ta: 'திட்டங்கள்' } },
  { id: 'team', label: { en: 'Team', si: 'කණ්ඩායම', ta: 'குழு' } },
  { id: 'impact', label: { en: 'Impact', si: 'බලපෑම', ta: 'தாக்கம்' } },
  { id: 'contact', label: { en: 'Contact', si: 'අමතන්න', ta: 'தொடர்பு' } },
];

const DivisionPage = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language;

  /* ─── State ─── */
  const [divisionData, setDivisionData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageSource, setImageSource] = useState('default');
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* ─── Lazy refs ─── */
  const [projectsRef, projectsVisible] = useLazySection();
  const [teamRef, teamVisible] = useLazySection();
  const [impactRef, impactVisible] = useLazySection();
  const sectionRefs = useRef({});

  /* ─── Data loading (keep Firebase → localStorage → default priority) ─── */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const configData = getDivisionBySlug(slug);
        if (!configData) { setLoading(false); return; }
        setDivisionData(configData);

        // Firebase overlay
        try {
          const customContent = await getDivisionContent(configData.id);
          if (customContent) setDivisionData(prev => ({ ...prev, ...customContent }));

          const [projectsData, membersData] = await Promise.all([
            getProjects(configData.id),
            getTeamMembers(configData.id),
          ]);
          setProjects(projectsData?.length > 0 ? projectsData : getDefaultProjects(configData.id));
          setTeamMembers(membersData?.length > 0 ? membersData : getDefaultTeamMembers(configData.id));
        } catch {
          setProjects(getDefaultProjects(configData.id));
          setTeamMembers(getDefaultTeamMembers(configData.id));
        }

        // Impact
        const impact = getDefaultImpact(configData.id);
        setImpactData(impact);

        // Hero images: always prefer curated per-division local hero image
        // to ensure the correct official banner is shown consistently.
        const defaults = getDivisionHeroImages(configData.id);
        if (defaults?.length > 0) {
          setHeroImages(defaults);
          setImageSource('default');
        } else {
          // Legacy fallback path (should rarely run)
          const localImages = getLocalDivisionImages(configData.id);
          if (localImages?.length > 0) {
            setHeroImages(localImages);
            setImageSource('firebase');
          } else {
            try {
              const result = await getDivisionImages(configData.id);
              if (result?.images?.length > 0) {
                setHeroImages(result.images);
                setImageSource('firebase');
                saveLocalDivisionImages(configData.id, result.images);
              } else {
                throw new Error('no firebase images');
              }
            } catch {
              setHeroImages(configData.heroImage ? [configData.heroImage] : []);
              setImageSource('default');
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  /* ─── Hero auto-rotate ─── */
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const t = setInterval(() => setCurrentImageIndex(i => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  /* ─── Scroll-spy + scroll-top ─── */
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);

      const offsets = SECTIONS.map(s => {
        const el = sectionRefs.current[`section-${s.id}`];
        if (!el) return { id: s.id, top: Infinity };
        return { id: s.id, top: Math.abs(el.getBoundingClientRect().top - 150) };
      });
      const closest = offsets.reduce((a, b) => (a.top < b.top ? a : b));
      if (closest.top < 800) setActiveSection(closest.id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id) => {
    const el = sectionRefs.current[`section-${id}`];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /* ─── Ref assignment helpers ─── */
  const assignRef = (key, lazyRef) => (el) => {
    if (lazyRef) lazyRef.current = el;
    sectionRefs.current[key] = el;
  };

  /* ─── Division colors ─── */
  const dc = getDivisionColors(divisionData?.color);

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
      <SEOHead
        title="Division Details"
        description="Detailed information about NARA research divisions, their projects, staff, and achievements."
        path="/divisions"
        keywords="NARA division, research projects, marine science"
      />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-nara-navy rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading division data...</p>
        </motion.div>
      </div>
    );
  }

  /* ─── Not found ─── */
  if (!divisionData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Division Not Found</h2>
          <p className="text-slate-500 mb-6">The division you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/divisions')}
            className="px-6 py-3 bg-nara-navy hover:bg-nara-blue rounded-lg text-white font-semibold transition-colors"
          >
            Back to Divisions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <DivisionHero
        division={divisionData}
        heroImages={heroImages}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        imageSource={imageSource}
        projects={projects}
        teamMembers={teamMembers}
        currentLang={currentLang}
      />

      {/* Sticky Section Nav — text-only underline tabs */}
      <nav className="sticky top-[72px] z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 min-w-max">
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                    isActive
                      ? `${dc.text600} ${dc.border500}`
                      : 'text-slate-400 border-transparent hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {s.label[currentLang] || s.label.en}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Sections — all visible, stacked */}
      <div ref={assignRef('section-overview', null)}>
        <DivisionOverview
          division={divisionData}
          projects={projects}
          teamMembers={teamMembers}
          impactData={impactData}
          currentLang={currentLang}
        />
      </div>

      <div ref={assignRef('section-focus', null)}>
        <DivisionFocusAreas division={divisionData} currentLang={currentLang} />
      </div>

      <div ref={assignRef('section-services', null)}>
        <DivisionServices division={divisionData} currentLang={currentLang} />
      </div>

      {/* Lazy: Projects */}
      <div ref={assignRef('section-projects', projectsRef)}>
        {projectsVisible ? (
          <DivisionProjects division={divisionData} projects={projects} currentLang={currentLang} />
        ) : (
          <div className="h-64" />
        )}
      </div>

      {/* Lazy: Team */}
      <div ref={assignRef('section-team', teamRef)}>
        {teamVisible ? (
          <DivisionTeam division={divisionData} teamMembers={teamMembers} currentLang={currentLang} />
        ) : (
          <div className="h-64" />
        )}
      </div>

      {/* Lazy: Impact */}
      <div ref={assignRef('section-impact', impactRef)}>
        {impactVisible ? (
          <DivisionImpact division={divisionData} impactData={impactData} currentLang={currentLang} />
        ) : (
          <div className="h-64" />
        )}
      </div>

      <div ref={assignRef('section-contact', null)}>
        <DivisionContact division={divisionData} currentLang={currentLang} />
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 right-8 z-50 w-10 h-10 bg-gradient-to-br ${divisionData.gradient || 'from-blue-500 to-blue-600'} text-white rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-110 flex items-center justify-center text-lg font-bold`}
            aria-label="Scroll to top"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DivisionPage;
