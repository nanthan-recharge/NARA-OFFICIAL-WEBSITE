import React, {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Award,
  Users,
  Globe2,
  Compass,
  BookOpen,
  MessageCircle,
  UserCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AppImage from "../../components/AppImage";

// Detect mobile for reduced animations (particles disabled on mobile via CSS)

// Lazy load heavy / below-fold components
const HeroImageCarousel = lazy(
  () => import("../../components/hero/HeroImageCarousel"),
);
const LiveOceanDataShowcase = lazy(
  () => import("../../components/LiveOceanDataShowcase"),
);
const LatestFromLibrary = lazy(
  () => import("../../components/library/LatestFromLibrary"),
);
const GovFooter = lazy(() => import("../../components/compliance/GovFooter"));
const UnifiedServicesHub = lazy(
  () => import("../../components/UnifiedServicesHub"),
);
const OceanNewsSection = lazy(
  () => import("../../components/sections/OceanNewsSection"),
);
const MilestonesSection = lazy(() => import("./components/MilestonesSection"));

// Intersection Observer hook for lazy rendering below-fold sections
function useLazySection(rootMargin = "200px") {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);
  return [ref, isVisible];
}

const NewHomePage = () => {
  const [lastUpdate] = useState(new Date());
  const heroRef = useRef(null);
  const { t } = useTranslation(["home", "common"]);

  // refreshData removed — LiveOceanDataShowcase manages its own polling

  // Lazy render below-fold sections only when near viewport
  const [milestonesRef, milestonesVisible] = useLazySection("300px");
  const [newsRef, newsVisible] = useLazySection("300px");
  const [servicesRef, servicesVisible] = useLazySection("300px");
  const [libraryRef, libraryVisible] = useLazySection("300px");

  const missionContent = t("mission", { ns: "home", returnObjects: true });

  // Particles (CSS handles mobile performance via reduced animations)
  const heroParticles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        id: index,
        left: `${(index * 17 + 11) % 100}%`,
        top: `${(index * 23 + 7) % 100}%`,
        width: `${(index % 4) + 1}px`,
        height: `${((index + 2) % 4) + 1}px`,
        animationDuration: `${10 + index * 2}s`,
        animationDelay: `${index * 0.7}s`,
      })),
    [],
  );

  // Removed redundant 5-min refresh — LiveOceanDataShowcase handles its own polling

  useEffect(() => {
    if (window.location.hash !== "#library-hero-lite-heading") return;

    const scrollToLibrarySection = () => {
      const target = document.getElementById("library-hero-lite-heading");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const timer = window.setTimeout(scrollToLibrarySection, 250);
    return () => window.clearTimeout(timer);
  }, []);


  const missionStatsIcons = useMemo(() => [Award, Users, Globe2], []);

  return (
    <div className="bg-white text-nara-gray overflow-hidden">
      {/* Live Data Indicator - Enhanced */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed top-20 md:top-24 right-2 md:right-4 z-40"
      >
        <div className="metric-badge bg-white/95 backdrop-blur-md shadow-lg">
          <div className="dot"></div>
          <span
            className="text-nara-gray font-medium"
            style={{ fontSize: "0.75rem" }}
          >
            {t("hero.liveDataLabel", { ns: "home" })}:{" "}
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </motion.div>

      <main>
        {/* HERO SECTION - Cinematic 16:9 Carousel Theme */}
        <section
          ref={heroRef}
          className="relative min-h-[55vh] md:min-h-[70vh] lg:h-screen w-full overflow-hidden flex items-center justify-center"
        >
          {/* Background Carousel & Overlay */}
          <div className="absolute inset-0 z-0">
            <HeroImageCarousel
              showControls={false}
              showIndicators={false}
              autoPlayInterval={6000}
              className="h-full w-full object-cover"
            />
            {/* Cinematic Gradient Overlay (Bottom-Up) */}
            <div className="absolute inset-0 bg-gradient-to-t from-nara-navy/90 via-nara-navy/40 to-transparent z-10" />
          </div>

          {/* Animated Float Particles — reduced for mobile perf */}
          <div className="absolute inset-0 z-10 opacity-30 pointer-events-none hidden sm:block">
            {heroParticles.map((particle) => (
              <div
                key={particle.id}
                className="absolute bg-white rounded-full blur-sm animate-float"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.width,
                  height: particle.height,
                  animationDuration: particle.animationDuration,
                  animationDelay: particle.animationDelay,
                }}
              />
            ))}
          </div>

          {/* Top Center Welcome — Static */}
          <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-16 sm:pt-14 md:pt-16">
              <div className="mx-auto mt-1 sm:mt-2 w-fit max-w-full min-h-[2.5rem] sm:min-h-[4rem] md:min-h-[5.5rem] rounded-xl sm:rounded-2xl border border-sky-200/60 bg-gradient-to-b from-sky-300/70 to-sky-500/35 px-2 py-1 sm:px-5 sm:py-2 md:px-6 md:py-3 backdrop-blur-[2px] flex items-center justify-center">
                <p className="m-0 font-space font-bold text-white text-center text-sm sm:text-lg md:text-3xl lg:text-4xl xl:text-5xl leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                  {t("hero.welcomeText", { ns: "home" })}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Overlay - BOTTOM LEFT ALIGNED */}
          <div className="absolute bottom-6 sm:bottom-10 md:bottom-16 left-0 z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-2 max-w-3xl text-left"
            >
              {/* Main Agency Title - Compact on mobile */}
              <h1 className="text-sm sm:text-lg md:text-2xl lg:text-4xl font-bold font-space leading-tight text-white drop-shadow-lg break-words">
                {t("hero.agencyName", { ns: "home" })}
              </h1>
            </motion.div>
          </div>

          {/* Scroll Indicator - Hidden on mobile for compact view */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="hidden sm:block absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
          >
            <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/30 rounded-full flex justify-center pt-1.5 md:pt-2">
              <div className="w-1 h-1.5 md:h-2 bg-white rounded-full animate-scroll" />
            </div>
          </motion.div>

          {/* Minimalist Live Data Ticker */}
          <Suspense fallback={null}>
            <LiveOceanDataShowcase />
          </Suspense>
        </section>

        {/* Mission & Stats Section - Enhanced Ocean Theme */}
        {/* Mission & Stats Section - Enhanced Ocean Theme */}
        <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-nara-blue/5 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-nara-navy/5 to-transparent rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

          <div className="relative max-w-[1400px] mx-auto">
            <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
              {/* Left Tile - Mission Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card-enhanced rounded-2xl border border-gray-200/50 bg-white/80 p-6 sm:p-8 md:p-10 h-full flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-nara-blue/10 border border-nara-blue/20">
                    <AppImage
                      src="/assets/nara-logo.png"
                      alt="NARA crest"
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-nara-blue font-semibold">
                      {t("mission.badge", { ns: "home" })}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-nara-gray/70">
                      {t("hero.overview.sovereignWaters.label", { ns: "home" })}
                    </p>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-nara-navy font-space mb-4">
                  {missionContent?.heading}
                </h2>
                <p className="text-base text-nara-gray leading-relaxed mb-6">
                  {missionContent?.description}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <Compass className="h-5 w-5 text-nara-blue mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-nara-gray leading-relaxed">
                      {t("mission.focusResearch", { ns: "home" })}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <UserCheck className="h-5 w-5 text-nara-blue mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-nara-gray leading-relaxed">
                      {t("mission.focusCommunity", { ns: "home" })}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-3">
                  <Link
                    to="/about-nara-our-story"
                    className="gov-btn gov-btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition"
                  >
                    <BookOpen className="h-4 w-4" />
                    {t("mission.ctaLearn", { ns: "home" })}
                  </Link>
                  <Link
                    to="/contact-us"
                    className="gov-btn gov-btn-outline inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t("mission.ctaConsult", { ns: "home" })}
                  </Link>
                </div>
              </motion.div>

              {/* Right Tile - Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card-enhanced rounded-2xl border border-gray-200/50 bg-white/80 p-6 sm:p-8 md:p-10 h-full flex flex-col justify-center"
              >
                <div className="space-y-6">
                  {(missionContent?.stats || []).map((stat, index) => {
                    const StatIcon = missionStatsIcons[index] || Award;
                    return (
                      <motion.div
                        key={stat?.label || index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-center gap-6 rounded-xl border border-gray-200/50 bg-gradient-to-r from-gray-50 to-white p-3 sm:p-4 md:p-5 stat-card-glow cursor-pointer transition-all duration-300 hover:border-nara-blue/30 hover:shadow-lg"
                      >
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-nara-navy to-nara-blue shadow-lg">
                          <StatIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-nara-navy to-nara-blue bg-clip-text text-transparent mb-1">
                            {stat?.value}
                          </div>
                          <div className="text-sm uppercase tracking-wider text-nara-gray font-medium">
                            {stat?.label}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Milestones Section — lazy rendered */}
        <div ref={milestonesRef} className="min-h-[100px]">
          {milestonesVisible && (
            <Suspense
              fallback={<div className="h-96 bg-[#0a192f] animate-pulse" />}
            >
              <MilestonesSection />
            </Suspense>
          )}
        </div>

        {/* Ocean News Section — lazy rendered */}
        <div ref={newsRef} className="min-h-[100px]">
          {newsVisible && (
            <Suspense
              fallback={<div className="h-96 bg-nara-navy animate-pulse" />}
            >
              <OceanNewsSection />
            </Suspense>
          )}
        </div>

        {/* Services Hub — lazy rendered */}
        <section
          ref={servicesRef}
          className="relative py-10 sm:py-12 md:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden min-h-[100px]"
        >
          {servicesVisible && (
            <>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-nara-blue/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-1/3 right-0 w-96 h-96 bg-nara-navy/5 rounded-full blur-3xl translate-x-1/3" />
              </div>
              <Suspense
                fallback={
                  <div className="py-20 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-nara-blue/20 border-t-nara-navy" />
                  </div>
                }
              >
                <UnifiedServicesHub />
              </Suspense>
            </>
          )}
        </section>

        {/* Library Section — lazy rendered */}
        <section
          ref={libraryRef}
          aria-labelledby="library-hero-lite-heading"
          className="library-hero-lite-section relative overflow-hidden px-4 py-10 sm:py-12 md:py-16 min-h-[100px]"
        >
          {libraryVisible && (
            <>
              <div className="library-hero-lite-overlay" />
              <div className="library-hero-lite-grid" />
              <div className="library-floating-orb library-orb-1" />
              <div className="library-floating-orb library-orb-2" />
              <div className="library-hero-lite-topline" />

              <div className="max-w-7xl mx-auto relative z-10">
                <div className="library-hero-lite-shell">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nara-blue/10 border border-nara-blue/20 mb-4">
                      <BookOpen className="h-4 w-4 text-nara-blue" />
                      <span className="text-sm font-semibold text-nara-blue uppercase tracking-wider">
                        {t("library.badge", { ns: "home" })}
                      </span>
                    </div>
                    <h2
                      id="library-hero-lite-heading"
                      className="text-3xl md:text-4xl font-bold text-nara-navy font-space"
                    >
                      {t("library.heading", { ns: "home" })}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 max-w-2xl mx-auto">
                      {t("library.subtitle", { ns: "home" })}
                    </p>
                  </motion.div>

                  <Suspense
                    fallback={
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-gray-100 bg-white p-4 animate-pulse h-40"
                          />
                        ))}
                      </div>
                    }
                  >
                    <LatestFromLibrary />
                  </Suspense>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <GovFooter />
    </div>
  );
};

export default NewHomePage;
