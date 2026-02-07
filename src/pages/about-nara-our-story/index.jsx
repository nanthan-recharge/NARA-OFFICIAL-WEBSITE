import React, { useState, useEffect, useMemo, useRef, useCallback, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import AppImage from "../../components/AppImage";
import {
  FlaskConical, Globe2, Handshake, Sparkles, Waves, Fish, Globe,
  Calendar, Users, Trophy, Leaf, Anchor, Shell, BarChart, TrendingUp,
  Briefcase, Package, X, User, UserCheck, History, Clock, Maximize2,
  Award, Newspaper, ArrowRight, Layers, Info, Crown, Mail, Phone,
  Smartphone, GraduationCap, Lightbulb, AlertCircle, Shield, MapPin,
  Building, Home, Network, ArrowDown, Star, FileText, Database,
  FileCheck, Check, Lock, BookOpen, ChevronLeft, ChevronRight
} from "lucide-react";
import { DIVISIONS_CONFIG } from "../../data/divisionsConfig";
import { getDivisionLogo, hasDivisionLogo, DIVISION_TABS } from "../../utils/divisionLogoMap";
import { Link } from "react-router-dom";

// Intersection Observer hook for lazy rendering below-fold sections
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

const TIMELINE_MEDIA = {
  1981: "/nara%20acrhivements/%20Act%20No.%2054%20Establishes%20NARA.webp",
  "1986--2000": "/nara%20acrhivements/National%20Focal%20Point%20for%20IUCN.webp",
  1996: "/nara%20acrhivements/Act%20No.%2032%20Empowers%20Expansion.webp",
  1997: "/nara%20acrhivements/Socio-Economics%20Division%20Launch.webp",
  2012: "/nara%20acrhivements/Hydrographic%20Leadership.webp",
  2013: "/nara%20acrhivements/Policy%20Advisory%20Recognition.webp",
  2020: "/nara%20acrhivements/President's%20Awards%20for%20Research.webp",
  2021: "/nara%20acrhivements/First%20Pelagic%20Stock%20Survey.webp",
  2024: "/nara%20acrhivements/43rd%20Anniversary%20Celebrated.webp",
  2025: "/nara%20acrhivements/Sri%20Lanka%20Navy%20Partnership.webp",
};

const ACHIEVEMENT_ICONS = [
  FlaskConical,
  Globe2,
  Handshake,
  Sparkles,
];
const LOGO_FEATURE_ICONS = {
  waves: Waves,
  fish: Fish,
  globe: Globe,
  sparkles: Sparkles,
};

const LOGO_FEATURE_STYLES = {
  waves: "text-cyan-400",
  fish: "text-blue-400",
  globe: "text-emerald-400",
  sparkles: "text-amber-400",
};

const LOGO_FEATURE_TITLE_STYLES = {
  waves: "text-cyan-300",
  fish: "text-blue-300",
  globe: "text-emerald-300",
  sparkles: "text-amber-300",
};

const LOGO_STAT_ICONS = {
  calendar: Calendar,
  users: Users,
  flask: FlaskConical,
  trophy: Trophy,
};

const DIRECTOR_ICON_MAP = {
  leaf: Leaf,
  anchor: Anchor,
  waves: Waves,
  shell: Shell,
  fish: Fish,
  barChart: BarChart,
  globe: Globe,
  trendingUp: TrendingUp,
  briefcase: Briefcase,
  package: Package,
};
const ACCOMPLISHMENT_ICON_MAP = {
  Globe,
  BookOpen,
  Users,
  Anchor,
  Fish,
  Shield,
};

const DEFAULT_TIMELINE_MEDIA =
  "/nara%20acrhivements/%20Act%20No.%2054%20Establishes%20NARA.webp";
const DIRECTOR_GENERAL_ACTING_FALLBACK_IMAGE =
  "/images/leadership/director-general-acting.jpg";
const DEPUTY_DIRECTOR_GENERAL_FALLBACK_IMAGE =
  "/images/leadership/deputy-director-general.jpg";

const isDirectorGeneral = (executive) => {
  const titleText = `${executive?.title || ""} ${executive?.subtitle || ""}`;
  const normalizedTitle = titleText.toLowerCase();

  return (
    (normalizedTitle.includes("director general") &&
      !normalizedTitle.includes("deputy")) ||
    (titleText.includes("අධ්‍යක්ෂ ජනරාල්") &&
      !titleText.includes("නියෝජ්‍ය")) ||
    (titleText.includes("இயக்குநர் ஜெனரல்") &&
      !titleText.includes("கூடுதல்"))
  );
};

const isDeputyDirectorGeneral = (executive) => {
  const titleText = `${executive?.title || ""} ${executive?.subtitle || ""}`;
  const normalizedTitle = titleText.toLowerCase();

  return (
    normalizedTitle.includes("deputy director general") ||
    titleText.includes("නියෝජ්‍ය අධ්‍යක්ෂ ජනරාල්") ||
    titleText.includes("கூடுதல் இயக்குநர் ஜெனரல்")
  );
};

const getExecutiveImageSrc = (executive) => {
  if (executive?.imageUrl && String(executive.imageUrl).trim()) {
    return String(executive.imageUrl).trim();
  }
  if (isDeputyDirectorGeneral(executive)) {
    return DEPUTY_DIRECTOR_GENERAL_FALLBACK_IMAGE;
  }
  if (isDirectorGeneral(executive)) {
    return DIRECTOR_GENERAL_ACTING_FALLBACK_IMAGE;
  }
  return "";
};

const TimelineDetailModal = ({ item, onClose, detailsHeading }) => {
  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="relative h-64">
          <AppImage
            src={TIMELINE_MEDIA[item.year] || DEFAULT_TIMELINE_MEDIA}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-6">
            <span className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-cyan-900 uppercase bg-cyan-400 rounded-full">
              {item.year}
            </span>
            <h3 className="text-2xl font-bold text-white">{item.title}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            {item.description}
          </p>
          {item.details && (
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                {detailsHeading}
              </h4>
              <p className="text-sm text-slate-300">{item.details}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const AboutNARAStoryPage = () => {
  const { t, i18n } = useTranslation("about");
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return "en";
    }
    return window.localStorage.getItem("nara-lang") || "en";
  });

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLang = event.detail || "en";
      setLanguage(nextLang);
      i18n.changeLanguage(nextLang);
    };

    if (language) {
      i18n.changeLanguage(language);
    }

    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, [i18n, language]);

  // Lazy render below-fold sections only when near viewport
  const [historyRef, historyVisible] = useLazySection('300px');
  const [highlightsRef, highlightsVisible] = useLazySection('300px');
  const [divisionsRef, divisionsVisible] = useLazySection('300px');
  const [logoRef, logoVisible] = useLazySection('300px');
  const [leadershipRef, leadershipVisible] = useLazySection('300px');
  const [orgRef, orgVisible] = useLazySection('300px');
  const [achievementsRef, achievementsVisible] = useLazySection('300px');
  const [newsRef, newsVisible] = useLazySection('300px');
  const [patentsRef, patentsVisible] = useLazySection('300px');
  const [accomplishmentsRef, accomplishmentsVisible] = useLazySection('300px');
  const [dataPolicyRef, dataPolicyVisible] = useLazySection('300px');

  // Timeline carousel state
  const [tlIndex, setTlIndex] = useState(0);
  const [tlDirection, setTlDirection] = useState(1);
  const [tlPaused, setTlPaused] = useState(false);
  const tlTimerRef = useRef(null);
  const [tlInView, setTlInView] = useState(true);
  const tlSectionRef = useRef(null);

  // Pause timeline auto-rotate when hero is scrolled off-screen
  useEffect(() => {
    const el = tlSectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setTlInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Division gallery tab state
  const [activeCategory, setActiveCategory] = useState('research');
  const filteredDivisions = useMemo(() =>
    DIVISIONS_CONFIG.filter(d => !d.isHidden && d.category === activeCategory && hasDivisionLogo(d.id)),
    [activeCategory]
  );

  const hero = t("about.hero", { returnObjects: true });
  const history = t("about.history", { returnObjects: true });
  const achievements = t("about.achievements", { returnObjects: true });
  const cta = t("about.cta", { returnObjects: true });
  const logo = t("about.logo", { returnObjects: true });
  const leadership = t("about.leadership", { returnObjects: true });
  const labels = t("about.labels", { returnObjects: true });
  const institutionalHighlights = t("about.institutionalHighlights", {
    returnObjects: true,
  });
  const divisionGallery = t("about.divisionGallery", { returnObjects: true });
  const newsSection = t("about.newsSection", { returnObjects: true });
  const patentsSection = t("about.patentsSection", { returnObjects: true });
  const accomplishmentsSection = t("about.accomplishmentsSection", {
    returnObjects: true,
  });
  const dataPolicy = t("about.dataPolicy", { returnObjects: true });
  const chairmanImageSrc =
    leadership?.chairman?.imageUrl || "/images/chairman/chairman-profile.jpg";
  const chairmanImageAlt = leadership?.chairman?.name || "NARA Chairman";

  const heroStats = Array.isArray(hero?.stats) ? hero.stats : [];
  const historyBody = Array.isArray(history?.body) ? history.body : [];
  const timeline = useMemo(
    () => (Array.isArray(history?.timeline) ? history.timeline : []),
    [history],
  );
  const timelineLoop = useMemo(() => {
    if (!timeline.length) {
      return [];
    }
    const duplicated = timeline.map((item, index) => ({
      ...item,
      _loopId: `dup-${index}`,
    }));
    return [...timeline, ...duplicated];
  }, [timeline]);
  // Timeline carousel helpers
  const tlSlideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const startTlTimer = useCallback(() => {
    clearInterval(tlTimerRef.current);
    if (timeline.length <= 1) return;
    tlTimerRef.current = setInterval(() => {
      if (!tlPaused && tlInView) {
        setTlDirection(1);
        setTlIndex((prev) => (prev + 1) % timeline.length);
      }
    }, 5000);
  }, [timeline.length, tlPaused, tlInView]);

  useEffect(() => {
    startTlTimer();
    return () => clearInterval(tlTimerRef.current);
  }, [startTlTimer]);

  const tlGoTo = (idx) => {
    setTlDirection(idx > tlIndex ? 1 : -1);
    setTlIndex(idx);
    startTlTimer();
  };
  const tlPrev = () => {
    setTlDirection(-1);
    setTlIndex((prev) => (prev - 1 + timeline.length) % timeline.length);
    startTlTimer();
  };
  const tlNext = () => {
    setTlDirection(1);
    setTlIndex((prev) => (prev + 1) % timeline.length);
    startTlTimer();
  };

  const achievementItems = Array.isArray(achievements?.items)
    ? achievements.items
    : [];
  const timelineIntro = history?.timelineIntro || "";
  const milestoneCountLabel = t("about.history.milestoneCount", {
    count: timeline.length,
  });
  const activeLanguage = ["en", "si", "ta"].includes(language)
    ? language
    : "en";
  const logoDescription = Array.isArray(logo?.description)
    ? logo.description
    : [];
  const logoFeatures = Array.isArray(logo?.features) ? logo.features : [];
  const logoStats = Array.isArray(logo?.stats) ? logo.stats : [];
  const logoHistory = logo?.history || {};
  const logoHistoryBody = Array.isArray(logoHistory?.body)
    ? logoHistory.body
    : [];
  const leadershipExecutives = Array.isArray(leadership?.executives)
    ? leadership.executives
    : [];
  const leadershipDirectors = Array.isArray(leadership?.directors)
    ? leadership.directors
    : [];
  const boardMinisterAppointed = Array.isArray(
    leadership?.board?.ministerAppointed?.members,
  )
    ? leadership.board.ministerAppointed.members
    : [];
  const boardExOfficio = Array.isArray(
    leadership?.board?.exOfficioMembers?.members,
  )
    ? leadership.board.exOfficioMembers.members
    : [];
  const boardTitle = leadership?.board?.title || "";
  const boardDescription = leadership?.board?.description || "";
  const ministerAppointedTitle =
    leadership?.board?.ministerAppointed?.title ||
    labels?.ministerAppointedFallback ||
    "Members Appointed by the Minister";
  const exOfficioTitle =
    leadership?.board?.exOfficioMembers?.title ||
    labels?.exOfficioFallback ||
    "Ex-Officio Members";
  const vacancyNotice =
    leadership?.vacancyNotice ||
    labels?.vacancyFallback ||
    "Position currently vacant";
  const orgStructure = leadership?.organizationalStructure || null;
  const boardHeading =
    boardTitle ||
    labels?.boardTitleFallback ||
    "Governing Board Members of NARA 2023";
  const timelineDetailsHeading =
    labels?.timelineDetailsHeading || "Key Milestone Details";
  const milestoneAltSuffix = labels?.milestoneAltSuffix || "milestone";
  const logoAltText = labels?.logoAlt || "NARA Logo";
  const logoTitleFallback = labels?.logoTitleFallback || "The NARA Emblem";
  const institutionalCards = institutionalHighlights?.cards || {};
  const latestNewsTitle =
    typeof institutionalCards?.latestNews?.title === "string" &&
    institutionalCards.latestNews.title.trim()
      ? institutionalCards.latestNews.title
      : "Latest News";
  const latestNewsDescription =
    typeof institutionalCards?.latestNews?.description === "string" &&
    institutionalCards.latestNews.description.trim()
      ? institutionalCards.latestNews.description
      : "Stay updated with our latest scientific discoveries and announcements.";
  const latestNewsCta =
    typeof institutionalCards?.latestNews?.cta === "string" &&
    institutionalCards.latestNews.cta.trim()
      ? institutionalCards.latestNews.cta
      : "Read Articles";
  const latestNewsPath =
    typeof institutionalCards?.latestNews?.path === "string" &&
    institutionalCards.latestNews.path.trim()
      ? institutionalCards.latestNews.path
      : "/news";
  const newsItems = Array.isArray(newsSection?.items) ? newsSection.items : [];
  const patentItems = Array.isArray(patentsSection?.items)
    ? patentsSection.items
    : [];
  const accomplishmentItems = Array.isArray(accomplishmentsSection?.items)
    ? accomplishmentsSection.items
    : [];
  const dataAccessItems = Array.isArray(dataPolicy?.accessItems)
    ? dataPolicy.accessItems
    : [];
  const dataProtectionItems = Array.isArray(dataPolicy?.protectionItems)
    ? dataPolicy.protectionItems
    : [];
  const executiveStyles = [
    {
      gradient: "from-cyan-500/30 to-blue-500/30",
      border: "border-cyan-500/40",
      iconBg: "from-cyan-400/25 to-blue-500/25 border-cyan-500/50",
      icon: User,
      textClass: "text-cyan-200",
      accentBar: "from-cyan-400/40",
      iconColor: "text-cyan-400",
    },
    {
      gradient: "from-blue-500/25 to-indigo-500/25",
      border: "border-blue-500/35",
      iconBg: "from-blue-400/20 to-indigo-500/20 border-blue-500/45",
      icon: UserCheck,
      textClass: "text-blue-200",
      accentBar: "from-blue-400/40",
      iconColor: "text-blue-400",
    },
  ];

  const getTimelineMedia = (year) =>
    TIMELINE_MEDIA[year] || DEFAULT_TIMELINE_MEDIA;

  const heroParticles = React.useMemo(() => {
    return [...Array(6)].map((_, index) => ({
      duration: 12 + (index % 5) * 2,
      delay: (index % 7) * 0.5,
      left: (index * 17) % 100,
      top: (index * 23) % 100,
    }));
  }, []);

  return (
    <>
      <AnimatePresence>
        {selectedTimelineItem && (
          <TimelineDetailModal
            item={selectedTimelineItem}
            onClose={() => setSelectedTimelineItem(null)}
            detailsHeading={timelineDetailsHeading}
          />
        )}
      </AnimatePresence>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Hero Section - Slate/Dark Blue Government Theme */}
        <section ref={tlSectionRef} className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 opacity-30">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 60%)," +
                  "radial-gradient(circle at 85% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 55%)",
              }}
            />
            <div className="hidden sm:block">
            {heroParticles.map((particle, index) => (
              <motion.div
                key={index}
                className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                animate={{
                  y: [0, -140, 0],
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
              />
            ))}
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 md:gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-8 min-h-0 md:min-h-[760px]"
              >
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/40 bg-slate-900/60 px-5 py-2 text-xs uppercase tracking-[0.45em] text-cyan-200/80 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                  <History className="w-4 h-4" />
                  {hero?.badge}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-bold text-cyan-100 leading-tight">
                  {hero?.title}
                </h1>
                <p className="text-base sm:text-xl md:text-2xl text-cyan-200/90 font-light tracking-wide">
                  {hero?.headline}
                </p>
                <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed whitespace-pre-line">
                  {hero?.description}
                </p>

                <div className="grid sm:grid-cols-3 gap-6 pt-6 mt-auto">
                  {heroStats.map((stat, index) => (
                    <motion.div
                      key={`${stat?.label}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 backdrop-blur p-5 shadow-[0_15px_40px_-25px_rgba(6,182,212,0.45)]"
                    >
                      <div className="text-2xl font-bold text-cyan-300">
                        {stat?.value}
                      </div>
                      <p className="mt-2 text-xs text-slate-100 leading-snug">
                        {stat?.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative flex flex-col min-h-0 md:min-h-[700px] justify-between"
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-[32px] blur-3xl" />
                <div className="relative flex flex-col bg-slate-900/80 border border-slate-700/50 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-[0_25px_80px_-35px_rgba(6,182,212,0.55)]">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <span className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">
                      {history?.timelineTitle}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-cyan-200/80">
                      <Clock className="w-3.5 h-3.5" />
                      {milestoneCountLabel}
                    </div>
                  </div>

                  {/* Carousel */}
                  <div
                    className="relative"
                    onMouseEnter={() => setTlPaused(true)}
                    onMouseLeave={() => setTlPaused(false)}
                  >
                    {/* Slide area */}
                    <div className="relative h-[360px] sm:h-[400px] md:h-[440px] overflow-hidden">
                      <AnimatePresence initial={false} custom={tlDirection} mode="popLayout">
                        {timeline[tlIndex] && (
                          <motion.div
                            key={tlIndex}
                            custom={tlDirection}
                            variants={tlSlideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                            className="absolute inset-0 cursor-pointer"
                            onClick={() => setSelectedTimelineItem(timeline[tlIndex])}
                          >
                            {/* Image */}
                            <AppImage
                              src={getTimelineMedia(timeline[tlIndex]?.year)}
                              alt={`${timeline[tlIndex]?.year} ${milestoneAltSuffix}`}
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                            />
                            {/* Gradient overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent" />

                            {/* Year badge */}
                            <div className="absolute top-4 left-4 z-10">
                              <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-cyan-900 uppercase bg-cyan-400 rounded-full shadow-lg">
                                {timeline[tlIndex]?.year}
                              </span>
                            </div>

                            {/* Expand icon */}
                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                              <div className="bg-black/40 p-2 rounded-full backdrop-blur-sm">
                                <Maximize2 className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            {/* Content overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                              <h3 className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                                {timeline[tlIndex]?.title}
                              </h3>
                              <p className="text-sm text-blue-100/80 leading-relaxed line-clamp-3">
                                {timeline[tlIndex]?.description}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Prev / Next arrows */}
                      {timeline.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); tlPrev(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition-all"
                            aria-label="Previous milestone"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); tlNext(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition-all"
                            aria-label="Next milestone"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Dot indicators */}
                    {timeline.length > 1 && (
                      <div className="flex items-center justify-center gap-3 py-3 bg-slate-900/90">
                        {timeline.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => tlGoTo(idx)}
                            className={`transition-all duration-300 rounded-full ${
                              idx === tlIndex
                                ? 'w-6 h-2 bg-cyan-400'
                                : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                            }`}
                            aria-label={`Go to milestone ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* History Narrative */}
        <div ref={historyRef} className="min-h-[100px]">
        {historyVisible && (
        <section className="py-12 sm:py-16 md:py-20 px-4 relative bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/30 to-transparent" />
          <div className="relative max-w-7xl mx-auto space-y-14">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-cyan-200">
                {history?.title}
              </h2>
              <p className="text-xl text-white leading-relaxed max-w-4xl mx-auto">
                {history?.intro}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-10">
              {historyBody.map((paragraph, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl opacity-0 hover:opacity-100 blur-xl transition" />
                  <div className="relative bg-slate-900/70 border border-slate-700/50 rounded-3xl p-8 shadow-[0_20px_60px_-40px_rgba(6,182,212,0.6)]">
                    <p className="text-lg text-white leading-relaxed">
                      {paragraph}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        )}
        </div>

        {/* Institutional Highlights Section */}
        <div ref={highlightsRef} className="min-h-[100px]">
        {highlightsVisible && (
        <section className="py-12 px-4 bg-slate-900/30 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {institutionalHighlights?.title}
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                {institutionalHighlights?.description}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Patents & IP Badge */}
              <div className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all duration-500">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-slate-900/80 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-transparent to-blue-500/5 opacity-50" />
                  <img
                    src="/nara%20acrhivements%20/aquaculture-marine-patents-emblem.webp"
                    alt="Patents & Intellectual Property - 12+ patents granted for aquaculture technologies and marine instruments"
                    className="relative w-full h-full object-cover aspect-[16/10] group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Global Impact Badge */}
              <div className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all duration-500">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-slate-900/80 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-transparent to-blue-500/5 opacity-50" />
                  <img
                    src="/nara%20acrhivements%20/global-impact-research-achievement-shield.webp"
                    alt="Global Impact - 50+ international research collaborations and major scientific expeditions completed"
                    className="relative w-full h-full object-cover aspect-[16/10] group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Real-time Catch Alerts Badge */}
              <div className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all duration-500">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-slate-900/80 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-transparent to-blue-500/5 opacity-50" />
                  <img
                    src="/nara%20acrhivements%20/real-time-catch-alerts-sms.webp"
                    alt="Real-time Catch Alerts - SMS Hotspots for Sri Lankan fishermen"
                    className="relative w-full h-full object-cover aspect-[16/10] group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        )}
        </div>

        {/* Division Gallery Section */}
        <div ref={divisionsRef} className="min-h-[100px]">
        {divisionsVisible && (
        <section className="py-20 px-4 relative bg-slate-950">
          <div className="absolute inset-0 bg-slate-950/50"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-4">
                {divisionGallery?.title}
              </h2>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                {divisionGallery?.description}
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {DIVISION_TABS.map((tab) => {
                const count = DIVISIONS_CONFIG.filter(
                  d => !d.isHidden && d.category === tab.key && hasDivisionLogo(d.id)
                ).length;
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCategory(tab.key)}
                    className={`px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-black/20`
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    {tab.label[activeLanguage] || tab.label.en}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-700/50 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Division Emblem Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
              >
                {filteredDivisions.map((division, idx) => {
                  const divisionTitle = division?.name?.[activeLanguage] || division?.name?.en;
                  const logoPath = getDivisionLogo(division.id);
                  return (
                    <motion.div
                      key={division.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link
                        to={`/divisions/${division.slug}`}
                        className="group flex flex-col items-center text-center"
                      >
                        <div className="aspect-square w-full bg-slate-800/30 border border-slate-700/40 rounded-2xl p-4 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-slate-500/60 group-hover:bg-slate-800/50 group-hover:shadow-lg group-hover:shadow-black/20">
                          <img
                            src={logoPath}
                            alt={divisionTitle}
                            loading="lazy"
                            className="w-full h-full object-contain drop-shadow-md"
                          />
                        </div>
                        <p className="mt-3 text-white text-sm font-semibold leading-tight group-hover:text-cyan-300 transition-colors line-clamp-2 px-1">
                          {divisionTitle}
                        </p>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
        )}
        </div>

        {/* NARA Logo Hero Section */}
        <div ref={logoRef} className="min-h-[100px]">
        {logoVisible && (
        <section className="py-24 px-4 relative overflow-hidden bg-slate-950">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950" />
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)",
              }}
            />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Logo Container */}
              <div className="flex justify-center mb-12">
                <div className="relative" style={{ perspective: '800px' }}>
                  {/* Glow effect behind logo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full opacity-40 blur-3xl scale-110" />

                  {/* Logo - 3D coin spin */}
                  <div
                    className="relative bg-white/10 backdrop-blur-xl rounded-full p-8 border-4 border-cyan-400/30 shadow-[0_0_80px_rgba(34,211,238,0.4)] animate-coin-spin"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <img
                      src="/assets/nara-logo.png"
                      alt={logoAltText}
                      className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold mb-8 text-cyan-200"
              >
                {logo?.title || logoTitleFallback}
              </motion.h2>

              {/* Logo Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-cyan-400/20 shadow-2xl">
                  <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-6">
                    {logo?.subtitle}
                  </h3>

                  <div className="text-lg text-white leading-relaxed space-y-4 text-left">
                    {logoDescription.map((paragraph, idx) => (
                      <p key={`logo-desc-${idx}`}>{paragraph}</p>
                    ))}

                    {logoFeatures.map((feature, idx) => {
                      const FeatureIcon =
                        LOGO_FEATURE_ICONS[feature.icon] || Sparkles;
                      const iconClass =
                        LOGO_FEATURE_STYLES[feature.icon] || "text-cyan-400";
                      const titleClass =
                        LOGO_FEATURE_TITLE_STYLES[feature.icon] ||
                        "text-cyan-300";

                      return (
                        <div
                          key={`logo-feature-${idx}`}
                          className="flex items-start gap-3"
                        >
                          <FeatureIcon
                            className={`w-6 h-6 flex-shrink-0 mt-1 ${iconClass}`}
                          />
                          <span>
                            <strong className={`${titleClass}`}>
                              {feature.title}
                            </strong>{" "}
                            {feature.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Logo History */}
                  <div className="mt-8 pt-8 border-t border-cyan-400/20">
                    <h4 className="text-xl font-bold text-cyan-300 mb-4">
                      {logoHistory?.title}
                    </h4>
                    <div className="space-y-3 text-white leading-relaxed">
                      {logoHistoryBody.map((paragraph, idx) => (
                        <p key={`logo-history-${idx}`}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Logo Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                    {logoStats.map((stat, idx) => {
                      const StatIcon = LOGO_STAT_ICONS[stat.icon] || Info;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="text-center"
                        >
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/30 mb-3">
                            <StatIcon className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                            {stat.value}
                          </div>
                          <div className="text-sm text-slate-200">
                            {stat.label}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        )}
        </div>

        {/* Administrative Structure Section */}
        <div ref={leadershipRef} className="min-h-[100px]">
        {leadershipVisible && (
        <section className="py-14 sm:py-20 md:py-28 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-amber-200">
                {leadership?.title || labels?.leadershipTitleFallback}
              </h3>
              <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
                {leadership?.intro}
              </p>
            </motion.div>

            {leadership?.chairman && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto mb-12"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 to-orange-500/40 rounded-3xl opacity-75 group-hover:opacity-100 blur-2xl transition duration-500" />
                  <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-amber-500/40 rounded-3xl p-8 md:p-10 shadow-[0_30px_90px_-50px_rgba(251,191,36,0.6)] backdrop-blur">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
                        <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-[0_20px_60px_-30px_rgba(251,191,36,0.8)] bg-slate-900">
                          <AppImage
                            src={chairmanImageSrc}
                            alt={chairmanImageAlt}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                          <h3 className="text-3xl md:text-4xl font-bold text-amber-200">
                            {leadership.chairman.title}
                          </h3>
                          <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-amber-400/60 to-transparent" />
                        </div>
                        <p className="text-lg md:text-xl text-white/95 font-semibold mb-2">
                          {leadership.chairman.name}
                        </p>
                        <div className="flex flex-col gap-1.5 text-sm text-slate-100 mb-3">
                          {leadership.chairman.email && (
                            <div className="flex items-center justify-center md:justify-start gap-2">
                              <Mail className="w-4 h-4 text-amber-400/70" />
                              <a
                                href={`mailto:${leadership.chairman.email}`}
                                className="hover:text-amber-300 transition"
                              >
                                {leadership.chairman.email}
                              </a>
                            </div>
                          )}
                          {leadership.chairman.phone && (
                            <div className="flex items-center justify-center md:justify-start gap-2">
                              <Phone className="w-4 h-4 text-amber-400/70" />
                              <a
                                href={`tel:${leadership.chairman.phone.replace(/[^+\d]/g, "")}`}
                                className="hover:text-amber-300 transition"
                              >
                                {leadership.chairman.phone}
                              </a>
                            </div>
                          )}
                        </div>
                        <p className="text-base text-slate-100 leading-relaxed">
                          {leadership.chairman.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {leadershipExecutives.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
                {leadershipExecutives.map((executive, idx) => {
                  const style =
                    executiveStyles[idx] ||
                    executiveStyles[executiveStyles.length - 1];
                  const IconComponent = style.icon;
                  const executiveImageSrc = getExecutiveImageSrc(executive);
                  const contacts = [
                    executive.email
                      ? {
                        id: "email",
                        icon: Mail,
                        value: executive.email,
                        href: `mailto:${executive.email}`,
                      }
                      : null,
                    executive.phone
                      ? {
                        id: "phone",
                        icon: Phone,
                        value: executive.phone,
                        href: `tel:${executive.phone.replace(/[^+\d]/g, "")}`,
                      }
                      : null,
                    executive.mobile
                      ? {
                        id: "mobile",
                        icon: Smartphone,
                        value: executive.mobile,
                        href: `tel:${executive.mobile.replace(/[^+\d]/g, "")}`,
                      }
                      : null,
                  ].filter(Boolean);

                  return (
                    <motion.div
                      key={`executive-${idx}`}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="group relative"
                    >
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r ${style.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-500`}
                      />
                      <div
                        className={`relative bg-slate-900/80 border ${style.border} rounded-2xl p-6 backdrop-blur shadow-[0_20px_60px_-40px_rgba(6,182,212,0.5)]`}
                      >
                        <div className="flex gap-5 items-start">
                          <div
                            className={`w-20 h-20 flex-shrink-0 rounded-xl bg-gradient-to-br ${style.iconBg} flex items-center justify-center`}
                          >
                            {executiveImageSrc ? (
                              <AppImage
                                src={executiveImageSrc}
                                alt={executive.name || executive.title || "Executive portrait"}
                                className="w-full h-full object-cover object-top rounded-xl"
                                loading="lazy"
                              />
                            ) : (
                              <IconComponent
                                className={`w-10 h-10 ${style.iconColor}`}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4
                                className={`text-xl font-bold ${style.textClass}`}
                              >
                                {executive.title}
                              </h4>
                              <div
                                className={`h-px flex-1 bg-gradient-to-r ${style.accentBar}`}
                              />
                            </div>
                            <p className="text-sm text-white/85 font-medium mb-2">
                              {executive.name}
                            </p>
                            {executive.subtitle && (
                              <p className="text-xs text-slate-200 mb-2">
                                {executive.subtitle}
                              </p>
                            )}
                            <div className="space-y-1 text-xs text-slate-200 mb-3">
                              {contacts.map((contact) => (
                                <div
                                  key={`${executive.name}-${contact.id}`}
                                  className="flex items-center gap-2"
                                >
                                  <contact.icon className="w-3 h-3 text-slate-200" />
                                  <a
                                    href={contact.href}
                                    className="hover:text-white/80 transition"
                                  >
                                    {contact.value}
                                  </a>
                                </div>
                              ))}
                            </div>
                            <p className="text-sm text-slate-100 leading-relaxed">
                              {executive.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {leadershipDirectors.length > 0 && (
              <div className="mb-12 max-w-6xl mx-auto">
                <h4 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-slate-200" />
                  {leadership?.directorsTitle || labels?.directorsTitleFallback}
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {leadershipDirectors.map((director, idx) => {
                    const DirectorIcon =
                      DIRECTOR_ICON_MAP[director.icon] || User;
                    const isVacant = director.vacant;
                    return (
                      <motion.div
                        key={`${director.name}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 * idx }}
                        className="group relative"
                      >
                        <div className="absolute -inset-1 bg-slate-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition" />
                        <div
                          className={`relative bg-slate-900/70 border ${isVacant ? "border-slate-700/20" : "border-slate-700/50"} rounded-2xl p-6 hover:border-slate-600/70 transition-all duration-300`}
                        >
                          <div className="flex gap-4">
                            <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-slate-800/80 border border-slate-600/60 flex items-center justify-center">
                              <DirectorIcon className="w-6 h-6 text-slate-200" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5
                                className={`text-base font-bold ${isVacant ? "text-slate-500" : "text-slate-100"} mb-1`}
                              >
                                {director.name}
                              </h5>
                              <p className="text-xs text-slate-200 font-medium mb-2">
                                {director.position}
                              </p>
                              <p className="text-xs text-cyan-300/80 mb-3 leading-relaxed">
                                {director.division}
                              </p>

                              {director.education && (
                                <div className="mb-3 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/30">
                                  <div className="flex items-start gap-1.5 mb-1.5">
                                    <GraduationCap className="w-3.5 h-3.5 text-blue-400/70 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-100 leading-relaxed">
                                      {director.education}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {director.expertise && (
                                <div className="mb-3 p-2.5 bg-slate-800/30 rounded-lg">
                                  <div className="flex items-start gap-1.5">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-400/70 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-100 leading-relaxed">
                                      {director.expertise}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {director.email ? (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5 text-cyan-400/70 flex-shrink-0" />
                                  <a
                                    href={`mailto:${director.email}`}
                                    className="text-xs text-cyan-400/80 hover:text-cyan-300 transition truncate"
                                  >
                                    {director.email}
                                  </a>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  {vacancyNotice}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {(boardMinisterAppointed.length > 0 ||
              boardExOfficio.length > 0) && (
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Shield className="w-8 h-8 text-emerald-400" />
                      <h4 className="text-3xl font-bold text-slate-200">
                        {boardHeading}
                      </h4>
                    </div>
                    {boardDescription && (
                      <p className="text-slate-200 text-sm max-w-3xl mx-auto">
                        {boardDescription}
                      </p>
                    )}
                  </div>

                  {/* Minister-Appointed Members */}
                  {boardMinisterAppointed.length > 0 && (
                    <div className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <Crown className="w-6 h-6 text-amber-400" />
                        <h5 className="text-xl font-bold text-amber-300">
                          {ministerAppointedTitle}
                        </h5>
                        <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent" />
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {boardMinisterAppointed.map((member, idx) => (
                          <motion.div
                            key={`minister-${member.name}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.05 * idx }}
                            className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 transition-all hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
                          >
                            <div className="flex gap-4">
                              <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                                <UserCheck className="w-6 h-6 text-amber-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="text-base font-bold text-white mb-1">
                                  {member.name}
                                </h6>
                                <p className="text-xs text-amber-300/80 font-medium mb-2">
                                  {member.role}
                                </p>
                                {member.designation && (
                                  <p className="text-xs text-slate-200 mb-2">
                                    {member.designation}
                                  </p>
                                )}
                                {member.address && (
                                  <div className="flex items-start gap-1.5 mb-2">
                                    <MapPin className="w-3 h-3 text-slate-200 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-200 leading-relaxed">
                                      {member.address}
                                    </p>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-xs">
                                  <Calendar className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">
                                    {member.appointmentDate}
                                  </span>
                                </div>
                                {member.note && (
                                  <p className="text-xs text-slate-500 italic mt-2 pt-2 border-t border-slate-700">
                                    {member.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ex-Officio Members */}
                  {boardExOfficio.length > 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="w-6 h-6 text-cyan-400" />
                        <h5 className="text-xl font-bold text-cyan-300">
                          {exOfficioTitle}
                        </h5>
                        <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/30 to-transparent" />
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {boardExOfficio.map((member, idx) => (
                          <motion.div
                            key={`exofficio-${member.name}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.05 * idx }}
                            className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/40 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                          >
                            <div className="flex gap-4">
                              <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                                <Award className="w-6 h-6 text-cyan-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="text-base font-bold text-white mb-1">
                                  {member.name}
                                </h6>
                                <p className="text-xs text-cyan-300/80 font-medium mb-2">
                                  {member.role}
                                </p>
                                {member.designation && (
                                  <p className="text-xs text-slate-200 mb-2">
                                    {member.designation}
                                  </p>
                                )}
                                {member.address && (
                                  <div className="flex items-start gap-1.5 mb-2">
                                    <MapPin className="w-3 h-3 text-slate-200 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-200 leading-relaxed">
                                      {member.address}
                                    </p>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-xs">
                                  <Calendar className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">
                                    {member.appointmentDate}
                                  </span>
                                </div>
                                {member.note && (
                                  <p className="text-xs text-slate-500 italic mt-2 pt-2 border-t border-slate-700">
                                    {member.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </section>
        )}
        </div>

        {/* Organizational Structure Section */}
        <div ref={orgRef} className="min-h-[100px]">
        {orgVisible && orgStructure && (
          <section className="py-20 px-4 relative bg-slate-950">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
            <div className="relative max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-indigo-200">
                  {orgStructure.title}
                </h3>
                <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
                  {orgStructure.description}
                </p>
              </motion.div>

              {/* Divisions Grid */}
              <div className="mb-12">
                <h4 className="text-2xl font-bold text-indigo-300 mb-6 flex items-center gap-3">
                  <Building className="w-6 h-6" />
                  {labels?.orgDivisionsHeading}
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orgStructure.divisions?.map((division, idx) => (
                    <motion.div
                      key={`division-${idx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="bg-slate-900/50 border border-indigo-500/20 rounded-xl p-4 hover:border-indigo-500/40 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                          <Layers className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-white mb-1">
                            {division.name}
                          </h5>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {division.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Regional Research Centers */}
              <div className="mb-12">
                <h4 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center gap-3">
                  <MapPin className="w-6 h-6" />
                  {labels?.regionalCentersHeading}
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orgStructure.regionalCenters?.map((center, idx) => (
                    <motion.div
                      key={`center-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/40 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                          <Home className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-bold text-white mb-1">
                            {center.name}
                          </h5>
                          <div className="flex items-center gap-1.5 mb-2">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs text-cyan-300 font-medium">
                              {center.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {center.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Hierarchy Diagram */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border-2 border-indigo-500/30 rounded-2xl p-8"
              >
                <h4 className="text-2xl font-bold text-indigo-300 mb-6 text-center flex items-center justify-center gap-3">
                  <Network className="w-6 h-6" />
                  {labels?.hierarchyHeading}
                </h4>
                <div className="space-y-4">
                  {orgStructure.hierarchy?.map((level, idx) => (
                    <motion.div
                      key={`hierarchy-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="flex items-center gap-4"
                      style={{ paddingLeft: `${(level.level - 1) * 40}px` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-indigo-300">
                            {level.level}
                          </span>
                        </div>
                        <div className="px-6 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-lg">
                          <p className="text-white font-semibold">
                            {level.position}
                          </p>
                        </div>
                      </div>
                      {idx < orgStructure.hierarchy.length - 1 && (
                        <ArrowDown
                          className="w-4 h-4 text-indigo-400/50 absolute left-4"
                          style={{ top: "100%" }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}
        </div>

        {/* Achievements Section */}
        <div ref={achievementsRef} className="min-h-[100px]">
        {achievementsVisible && (
        <section className="py-20 px-4 relative bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/25 via-slate-950/20 to-transparent" />
          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl md:text-5xl font-semibold mb-4 text-cyan-200">
                {achievements?.title}
              </h3>
              <p className="text-lg text-white max-w-3xl mx-auto">
                {achievements?.intro}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {achievementItems.map((item, idx) => {
                const IconComponent = ACHIEVEMENT_ICONS[idx] || Star;
                return (
                  <motion.div
                    key={`${item?.title}-${idx}`}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500/60 to-blue-600/60 opacity-0 group-hover:opacity-100 blur-xl transition" />
                    <div className="relative rounded-3xl border border-slate-700/50 bg-slate-900/80 p-8 h-full flex flex-col gap-4">
                      <div className="inline-flex items-center gap-3 text-cyan-200">
                        <div className="p-3 rounded-2xl bg-cyan-500/15">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-semibold text-cyan-100">
                          {item?.title}
                        </h4>
                      </div>
                      <p className="text-white leading-relaxed text-sm md:text-base">
                        {item?.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        )}
        </div>

        {/* News Section */}
        <div ref={newsRef} className="min-h-[100px]">
        {newsVisible && (
        <section className="py-20 px-4 relative bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <Newspaper className="w-8 h-8 text-emerald-400" />
                <h3 className="text-4xl md:text-5xl font-bold text-emerald-200">
                  {newsSection?.title}
                </h3>
              </div>
              <p className="text-lg text-white max-w-3xl mx-auto">
                {newsSection?.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {newsItems.map((news, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition" />
                  <div className="relative bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 h-full hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center gap-2 mb-3 text-xs text-emerald-400">
                      <Calendar className="w-4 h-4" />
                      {news.date}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">
                      {news.title}
                    </h4>
                    <p className="text-sm text-slate-100 leading-relaxed">
                      {news.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        )}
        </div>

        {/* Patent Achievements Section */}
        <div ref={patentsRef} className="min-h-[100px]">
        {patentsVisible && (
        <section className="py-28 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-purple-400" />
                <h3 className="text-4xl md:text-5xl font-bold text-purple-200">
                  {patentsSection?.title}
                </h3>
              </div>
              <p className="text-lg text-white max-w-3xl mx-auto">
                {patentsSection?.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {patentItems.map((patent, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition" />
                  <div className="relative bg-slate-900/80 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">
                            {patent.title}
                          </h4>
                          <p className="text-xs text-purple-400">
                            {labels?.patentNumberLabel ||
                              patentsSection?.patentLabel}
                            : {patent.patent}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                        {patent.year}
                      </span>
                    </div>
                    <p className="text-sm text-slate-100 leading-relaxed">
                      {patent.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        )}
        </div>

        {/* Major Accomplishments Section */}
        <div ref={accomplishmentsRef} className="min-h-[100px]">
        {accomplishmentsVisible && (
        <section className="py-28 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/15 to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-amber-400" />
                <h3 className="text-4xl md:text-5xl font-bold text-amber-200">
                  {accomplishmentsSection?.title}
                </h3>
              </div>
              <p className="text-lg text-white max-w-3xl mx-auto">
                {accomplishmentsSection?.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {accomplishmentItems.map((accomplishment, idx) => {
                const IconComponent = ACCOMPLISHMENT_ICON_MAP[accomplishment.icon] || Star;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition" />
                    <div className="relative bg-slate-900/80 border border-amber-500/20 rounded-2xl p-6 text-center hover:border-amber-500/40 transition-all h-full">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4">
                        <IconComponent className="w-8 h-8 text-amber-400" />
                      </div>
                      <div className="text-3xl font-bold text-amber-300 mb-2">
                        {accomplishment.stat}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">
                        {accomplishment.title}
                      </h4>
                      <p className="text-sm text-slate-100">
                        {accomplishment.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        )}
        </div>

        {/* Data Policy Section */}
        <div ref={dataPolicyRef} className="min-h-[100px]">
        {dataPolicyVisible && (
        <section className="py-28 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/25 to-transparent" />
          <div className="relative max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <Database className="w-8 h-8 text-blue-400" />
                <h3 className="text-4xl md:text-5xl font-bold text-blue-200">
                  {dataPolicy?.title}
                </h3>
              </div>
              <p className="text-lg text-white max-w-3xl mx-auto">
                {dataPolicy?.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-blue-500/30 rounded-3xl p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    {dataPolicy?.accessTitle}
                  </h4>
                  <ul className="space-y-3 text-white">
                    {dataAccessItems.map((item, idx) => (
                      <li
                        key={`data-access-${idx}`}
                        className="flex items-start gap-2"
                      >
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    {dataPolicy?.protectionTitle}
                  </h4>
                  <ul className="space-y-3 text-white">
                    {dataProtectionItems.map((item, idx) => (
                      <li
                        key={`data-protection-${idx}`}
                        className="flex items-start gap-2"
                      >
                        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-blue-500/20 text-center">
                <p className="text-sm text-slate-200 mb-4">
                  {dataPolicy?.contactNote}
                </p>
                <a
                  href={`mailto:${dataPolicy?.contactEmail || "data@nara.ac.lk"}`}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                >
                  <Mail className="w-4 h-4" />
                  {dataPolicy?.contactEmail || "data@nara.ac.lk"}
                </a>
              </div>
            </motion.div>
          </div>
        </section>
        )}
        </div>

        {/* CTA Section */}
        <section className="py-24 px-4 relative bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-cyan-950/40" />
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-slate-900/80 border border-cyan-500/30 rounded-[40px] px-10 py-14 shadow-[0_25px_80px_-40px_rgba(6,182,212,0.65)]"
            >
              <h3 className="text-4xl md:text-5xl font-semibold mb-6 text-cyan-200">
                {cta?.title}
              </h3>
              <p className="text-xl text-white mb-10">{cta?.description}</p>
              <motion.a
                href="https://www.nara.ac.lk"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-5 rounded-full text-lg font-semibold shadow-[0_0_45px_rgba(6,182,212,0.45)] hover:shadow-[0_0_60px_rgba(6,182,212,0.65)] transition"
              >
                {cta?.button}
                <ArrowRight className="w-6 h-6" />
              </motion.a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutNARAStoryPage;
