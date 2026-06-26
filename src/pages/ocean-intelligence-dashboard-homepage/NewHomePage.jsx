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
  Activity,
  Award,
  Users,
  Globe2,
  Compass,
  BookOpen,
  FileText,
  MessageCircle,
  Radar,
  Satellite,
  UserCheck,
  Waves,
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
const PartnersCollaborators = lazy(
  () => import("../../components/compliance/PartnersCollaborators"),
);
const UnifiedServicesHub = lazy(
  () => import("../../components/UnifiedServicesHub"),
);
const OceanNewsSection = lazy(
  () => import("../../components/sections/OceanNewsSection"),
);
const MilestonesSection = lazy(() => import("./components/MilestonesSection"));

// Natural Earth admin-0 Sri Lanka outline, pre-projected to this SVG viewBox.
const SRI_LANKA_MAP_PATH =
  "M413,293L413,294L414,297L414,298L414,301L410,313L410,315L410,316L410,318L408,320L408,321L408,322L406,324L406,325L406,327L405,329L398,341L396,343L392,346L390,346L388,347L374,358L371,360L362,363L362,363L362,362L362,362L362,362L362,362L362,362L361,362L361,362L361,364L360,364L360,364L359,365L357,366L356,366L348,368L344,369L340,370L338,371L337,372L335,372L333,373L333,373L330,375L327,377L326,379L323,378L323,378L321,379L320,379L319,380L317,381L317,381L316,381L315,381L314,380L313,380L312,380L308,380L307,380L306,379L306,379L306,378L305,378L304,378L303,379L301,378L300,378L300,378L300,378L299,377L299,377L298,377L298,377L298,378L298,378L297,378L297,377L297,377L297,377L296,377L296,377L296,376L293,375L291,375L290,375L289,373L288,373L288,373L288,373L287,374L286,372L280,366L279,365L279,365L279,365L279,365L279,365L279,364L279,364L278,364L278,363L274,355L274,355L274,355L274,354L274,353L274,353L274,353L273,352L273,348L271,346L271,342L270,341L270,341L270,341L269,340L269,340L269,339L270,339L270,339L270,339L270,339L270,335L270,335L268,331L262,314L261,309L260,308L260,303L261,302L261,301L261,300L261,299L261,299L258,286L258,284L258,285L259,286L259,287L259,287L260,290L260,291L261,291L261,290L261,289L261,289L261,289L261,289L261,287L261,287L261,286L261,285L261,285L260,285L259,285L259,284L259,284L259,283L259,283L259,282L256,255L255,254L256,254L256,254L256,254L256,253L257,251L257,251L257,250L257,249L256,248L256,247L256,246L256,243L254,235L254,234L253,232L252,228L251,225L249,217L249,214L249,214L249,214L249,214L249,214L250,215L250,213L249,209L249,207L250,207L251,205L252,203L253,202L253,201L255,197L255,197L254,200L253,203L253,203L253,203L254,204L254,204L255,204L255,206L254,208L253,208L253,208L253,208L253,209L253,211L253,211L251,216L251,216L252,218L253,219L253,220L252,223L254,225L258,225L259,224L259,222L258,221L258,221L258,221L257,220L257,219L256,218L259,214L259,213L258,212L258,212L258,211L258,210L258,208L258,208L258,208L258,208L258,207L257,207L257,207L257,207L257,206L258,205L259,204L259,203L259,201L260,198L260,191L261,190L261,189L262,189L262,188L262,185L262,183L263,182L265,181L266,180L266,180L266,178L267,177L267,177L267,177L267,175L268,168L266,163L266,162L267,157L267,157L266,155L266,154L266,153L266,153L266,152L267,152L268,152L272,148L275,147L275,146L276,144L277,142L277,140L280,133L280,133L280,132L281,130L281,126L281,125L281,125L280,124L278,123L277,123L276,121L276,121L276,119L276,118L277,117L278,116L280,116L282,116L282,115L284,113L284,113L285,113L285,112L286,112L287,112L286,111L286,110L285,109L284,108L283,107L277,104L276,103L278,103L281,104L285,106L289,107L291,108L292,110L293,110L292,111L292,111L292,112L292,112L292,112L293,113L297,113L304,110L306,110L310,111L315,113L318,114L318,114L313,110L311,110L310,109L309,109L309,109L308,108L307,108L307,108L306,108L305,108L305,108L305,108L304,108L304,109L303,108L303,108L300,108L300,108L294,103L292,101L292,101L291,101L287,99L286,99L285,99L285,100L286,101L286,102L287,102L286,103L286,103L285,103L285,103L283,102L281,100L279,99L279,99L280,100L281,101L282,102L280,102L278,101L275,99L272,97L270,96L270,96L269,95L269,95L269,96L268,95L268,94L267,94L267,93L267,92L266,91L266,90L265,89L267,89L270,86L271,85L271,85L277,86L280,85L281,86L282,87L281,88L282,89L282,89L283,89L285,89L285,90L285,90L286,90L287,90L287,90L288,90L288,90L288,90L288,90L289,90L291,93L297,100L300,102L305,104L305,104L305,104L303,102L296,97L291,90L288,89L283,88L282,87L282,86L284,85L284,85L286,85L289,85L290,85L291,86L292,88L293,89L303,101L304,102L307,104L328,121L328,121L328,122L329,123L331,124L332,126L331,126L331,126L331,126L330,126L330,126L330,125L329,124L329,124L328,124L327,124L328,125L328,125L332,129L333,130L333,130L332,129L332,128L332,127L333,127L334,127L335,130L335,131L338,137L338,137L336,136L335,136L335,137L335,137L336,138L338,138L338,138L338,140L338,140L338,140L338,140L339,139L339,139L339,139L339,139L340,141L340,141L341,143L342,145L344,146L344,146L344,147L344,147L344,148L343,148L343,148L342,146L341,146L339,145L338,145L338,146L339,146L341,149L341,150L342,151L342,151L341,151L341,152L341,152L342,153L343,153L344,152L345,151L345,149L345,149L348,153L351,157L352,158L353,158L354,159L356,163L356,164L356,164L357,164L358,165L359,167L360,171L361,170L361,170L361,170L361,170L362,170L362,171L364,173L364,175L364,176L364,176L363,177L362,178L362,178L363,177L364,177L364,177L364,177L364,177L366,181L366,183L364,183L364,183L364,182L364,181L363,180L362,182L363,183L363,184L363,184L363,185L362,185L362,184L360,184L359,183L358,184L357,185L357,186L358,186L360,184L361,186L362,187L363,188L365,189L368,189L369,188L369,186L371,185L371,185L372,185L372,185L373,185L374,186L375,187L375,190L376,194L376,195L376,196L375,196L374,194L374,193L373,194L374,196L374,196L374,197L375,198L375,198L375,198L376,198L377,198L378,201L378,203L378,203L378,205L378,205L379,206L380,211L381,214L379,216L379,216L379,213L379,213L377,209L377,209L377,212L377,213L377,213L377,213L377,213L377,213L377,214L377,214L378,214L378,214L378,214L378,216L380,217L380,217L381,217L382,215L382,215L382,216L383,216L383,219L384,220L385,221L385,222L386,224L387,224L387,223L387,223L388,224L387,224L387,224L388,224L388,225L388,225L388,225L388,225L388,225L389,224L389,224L389,224L389,224L390,225L389,226L389,226L389,227L389,227L390,228L391,229L391,229L392,230L391,230L391,230L391,231L391,231L391,231L391,232L390,232L391,235L392,236L393,237L393,237L394,236L395,236L395,238L396,239L396,239L399,243L400,244L401,246L399,246L399,246L398,246L396,243L395,243L394,242L394,242L394,242L393,242L392,243L392,245L393,245L394,245L394,245L395,244L396,245L397,245L397,245L397,246L397,246L398,247L399,248L400,249L401,251L401,251L400,251L400,251L400,252L401,253L401,252L401,251L401,251L402,251L403,253L404,253L405,257L405,257L405,259L405,259L405,259L405,260L405,260L405,261L404,261L404,262L404,262L405,263L405,263L405,263L405,264L406,264L405,265L405,265L405,265L406,265L406,265L407,265L407,265L407,268L407,269L407,269L408,269L408,269L408,268L408,267L408,266L409,265L409,265L409,264L409,264L409,264L409,264L410,265L410,265L410,267L411,269L413,275ZM403,250L402,249L402,248L402,248L402,247L402,246L402,245L402,245L402,244L402,244L403,245L403,247L404,248L404,248L405,250L407,253L408,254L409,261L409,261L409,263L408,264L407,263L406,262L406,262L406,262L406,261L406,261L406,256L406,255L405,254L405,253ZM250,142L250,142L249,141L249,140L250,140L254,140L255,140L257,141L260,142L263,144L266,146L266,146L264,146L262,145L261,145L263,147L264,149L265,150L263,150L262,149L261,148L261,147L260,147L257,144L255,144L254,143L253,143L252,142ZM252,110L251,110L250,111L249,111L247,111L246,110L246,106L246,106L247,106L247,106L248,107L249,108L250,108L251,108ZM264,101L263,100L262,98L260,95L261,93L261,92L261,90L263,90L264,90L264,90L264,91L264,92L263,93L264,94L264,95L264,95L264,95L264,96L264,96L265,96L265,96L266,96L267,96L267,98L267,98L268,99L269,99L270,100L270,100L270,100L270,101L269,101L268,101L267,100L266,100L265,101L264,101Z";

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
  const quickAccessLinks = useMemo(
    () => [
      {
        label: t("quickAccess.services.label", { ns: "home" }),
        description: t("quickAccess.services.description", { ns: "home" }),
        to: "/government-services-portal",
        icon: Compass,
      },
      {
        label: t("quickAccess.rti.label", { ns: "home" }),
        description: t("quickAccess.rti.description", { ns: "home" }),
        to: "/rti",
        icon: FileText,
      },
      {
        label: t("quickAccess.library.label", { ns: "home" }),
        description: t("quickAccess.library.description", { ns: "home" }),
        to: "/library",
        icon: BookOpen,
      },
      {
        label: t("quickAccess.contact.label", { ns: "home" }),
        description: t("quickAccess.contact.description", { ns: "home" }),
        to: "/contact-us",
        icon: MessageCircle,
      },
    ],
    [t],
  );

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
      <style>{`
        .home-quick-access-desktop-grid,
        .home-quick-access-mobile-grid {
          display: grid;
          min-width: 0;
        }

        .home-quick-access-desktop-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .home-quick-access-mobile-grid {
          grid-template-columns: minmax(0, 1fr);
          gap: 0.625rem;
        }

        @media (min-width: 380px) {
          .home-quick-access-mobile-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .home-quick-access-card {
          min-width: 0;
          align-items: flex-start;
          justify-content: flex-start;
          text-decoration: none;
        }

        .home-quick-access-card:hover {
          text-decoration: none;
        }

        .sovereign-waters-section {
          isolation: isolate;
          background:
            linear-gradient(135deg, rgba(3, 21, 43, 0.98) 0%, rgba(5, 42, 79, 0.98) 48%, rgba(2, 15, 30, 0.98) 100%),
            #04172d;
        }

        .sovereign-waters-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(125, 211, 252, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.08) 1px, transparent 1px);
          background-size: 44px 44px;
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
          mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
          pointer-events: none;
          z-index: 0;
        }

        .sovereign-waters-section::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(34, 211, 238, 0) 0%, rgba(34, 211, 238, 0.11) 48%, rgba(251, 191, 36, 0.08) 100%),
            repeating-linear-gradient(164deg, rgba(14, 165, 233, 0.16) 0 1px, transparent 1px 22px);
          opacity: 0.55;
          pointer-events: none;
          z-index: 0;
        }

        .sovereign-waters-shell,
        .sovereign-stat-card,
        .sovereign-focus-card,
        .sovereign-map-card {
          border-radius: 8px;
        }

        .sovereign-waters-shell {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.22);
          background: linear-gradient(135deg, rgba(8, 47, 73, 0.76), rgba(15, 23, 42, 0.82));
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.28);
        }

        .sovereign-current-band {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 62% 48%, rgba(34, 211, 238, 0.16), transparent 34%),
            repeating-linear-gradient(168deg, transparent 0 16px, rgba(56, 189, 248, 0.12) 17px, transparent 19px);
          opacity: 0.7;
          transform: translate3d(0, 0, 0);
          animation: currentDrift 18s linear infinite;
          pointer-events: none;
        }

        .sovereign-map-card {
          position: relative;
          display: flex;
          width: 100%;
          flex-direction: column;
          overflow: hidden;
          min-height: 340px;
          border: 1px solid rgba(125, 211, 252, 0.28);
          background:
            radial-gradient(circle at 54% 46%, rgba(34, 211, 238, 0.23), transparent 27%),
            linear-gradient(145deg, rgba(2, 6, 23, 0.68), rgba(8, 47, 73, 0.58));
        }

        .sovereign-map-stage {
          position: relative;
          height: clamp(270px, 32vw, 390px);
          overflow: hidden;
        }

        .sovereign-map-stage::before {
          content: "";
          position: absolute;
          inset: -18%;
          background:
            repeating-radial-gradient(circle at 56% 51%, rgba(125, 211, 252, 0.16) 0 1px, transparent 1px 28px),
            linear-gradient(105deg, transparent 0%, rgba(56, 189, 248, 0.13) 44%, transparent 62%);
          animation: sonarSweep 12s ease-in-out infinite;
          pointer-events: none;
        }

        .sovereign-map-stage::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(173deg, transparent 0 13px, rgba(14, 165, 233, 0.16) 14px, transparent 17px);
          opacity: 0.44;
          animation: waveSlide 9s linear infinite;
          pointer-events: none;
        }

        .sovereign-map-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .sovereign-eez-boundary {
          stroke-dasharray: 10 13;
          animation: eezBoundaryFlow 16s linear infinite;
        }

        .sovereign-current-line {
          stroke-dasharray: 5 16;
          animation: currentLineFlow 8s linear infinite;
        }

        .sovereign-island {
          filter: drop-shadow(0 0 18px rgba(34, 211, 238, 0.45));
          transform-origin: 51% 50%;
          animation: islandBreathe 6s ease-in-out infinite;
        }

        .sovereign-beacon {
          transform-origin: center;
          animation: beaconPulse 2.9s ease-out infinite;
        }

        .sovereign-beacon:nth-of-type(2) {
          animation-delay: 0.5s;
        }

        .sovereign-beacon:nth-of-type(3) {
          animation-delay: 1s;
        }

        .sovereign-beacon:nth-of-type(4) {
          animation-delay: 1.45s;
        }

        .sovereign-monitor-strip {
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(125, 211, 252, 0.2);
          background: rgba(2, 6, 23, 0.35);
        }

        .sovereign-description {
          overflow-wrap: anywhere;
        }

        .sovereign-live-dot {
          box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.58);
          animation: liveDot 2s infinite;
        }

        @keyframes currentDrift {
          0% { transform: translate3d(-2%, 0, 0); }
          50% { transform: translate3d(2%, -1%, 0); }
          100% { transform: translate3d(-2%, 0, 0); }
        }

        @keyframes sonarSweep {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.58; }
          50% { transform: scale(1.04) rotate(2deg); opacity: 0.86; }
        }

        @keyframes waveSlide {
          from { background-position: 0 0; }
          to { background-position: 90px 0; }
        }

        @keyframes eezBoundaryFlow {
          to { stroke-dashoffset: -184; }
        }

        @keyframes currentLineFlow {
          to { stroke-dashoffset: -84; }
        }

        @keyframes islandBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.014); }
        }

        @keyframes beaconPulse {
          0% { opacity: 0.95; transform: scale(0.72); }
          70% { opacity: 0.08; transform: scale(1.95); }
          100% { opacity: 0; transform: scale(2.2); }
        }

        @keyframes liveDot {
          0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.58); }
          70% { box-shadow: 0 0 0 9px rgba(52, 211, 153, 0); }
          100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        }

        @media (max-width: 640px) {
          .sovereign-map-card {
            min-height: 0;
          }

          .sovereign-map-stage {
            height: 250px;
          }

          .sovereign-description {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 6;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sovereign-current-band,
          .sovereign-map-stage::before,
          .sovereign-map-stage::after,
          .sovereign-eez-boundary,
          .sovereign-current-line,
          .sovereign-island,
          .sovereign-beacon,
          .sovereign-live-dot {
            animation: none !important;
          }
        }
      `}</style>
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
          className="relative min-h-[60vh] md:min-h-[70vh] lg:h-screen w-full overflow-hidden flex items-center justify-center"
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
          <div className="absolute bottom-12 sm:bottom-10 md:bottom-16 lg:bottom-[26rem] left-0 z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-2 max-w-3xl text-left"
            >
              {/* Main Agency Title - Compact on mobile */}
              <h1 className="text-sm sm:text-lg md:text-2xl lg:text-4xl font-bold font-space leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] break-words">
                {t("hero.agencyName", { ns: "home" })}
              </h1>
            </motion.div>
          </div>

          <div className="absolute inset-x-0 bottom-[20rem] z-30 px-6 pointer-events-auto xl:bottom-[21rem] max-lg:hidden">
            <div className="home-quick-access-desktop-grid mx-auto max-w-6xl">
              {quickAccessLinks.map((item) => {
                const QuickIcon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="home-quick-access-card group flex min-h-[88px] items-start gap-3 rounded-lg border border-white/25 bg-white/90 p-3 text-left shadow-lg backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-nara-navy text-white transition-colors group-hover:bg-nara-blue">
                      <QuickIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-tight text-nara-navy">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-snug text-slate-600">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Scroll Indicator - Hidden on mobile for compact view */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="hidden sm:block lg:hidden absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
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

        <section className="bg-white px-3 py-3 shadow-sm sm:px-4 lg:hidden" aria-label={t("quickAccess.label", { ns: "home" })}>
          <div className="home-quick-access-mobile-grid mx-auto max-w-3xl">
            {quickAccessLinks.map((item) => {
              const QuickIcon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="home-quick-access-card flex min-h-[76px] items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-left transition-colors hover:border-nara-blue/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nara-blue/30"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-nara-navy text-white">
                    <QuickIcon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-bold leading-tight text-nara-navy">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-slate-600">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section
          className="sovereign-waters-section relative overflow-hidden px-4 py-7 sm:px-6 sm:py-9 md:py-10 lg:px-12"
          aria-labelledby="sovereign-waters-heading"
        >
          <div className="sovereign-current-band" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-[1400px]">
            <div className="sovereign-waters-shell grid grid-cols-1 items-center gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className="flex min-w-0 flex-col justify-center p-5 sm:p-6 lg:p-7"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-300/40 bg-white/10">
                    <AppImage
                      src="/assets/nara-logo.png"
                      alt="NARA crest"
                      className="h-9 w-9 object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase leading-snug tracking-[0.18em] text-amber-200">
                      {t("mission.badge", { ns: "home" })}
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase leading-snug tracking-[0.24em] text-cyan-100/75">
                      {t("hero.overview.sovereignWaters.value", { ns: "home" })}
                    </p>
                  </div>
                </div>

                <div className="mb-5 max-w-2xl">
                  <h2
                    id="sovereign-waters-heading"
                    className="font-space text-3xl font-bold leading-[1.04] text-white sm:text-4xl lg:text-5xl"
                  >
                    {t("hero.overview.sovereignWaters.label", { ns: "home" })}
                  </h2>
                  <p className="mt-3 text-base font-semibold leading-snug text-cyan-100 sm:text-lg">
                    {missionContent?.heading}
                  </p>
                  <p className="sovereign-description mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-[15px]">
                    {missionContent?.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sovereign-focus-card border border-cyan-200/20 bg-white/10 p-3">
                    <div className="mb-2 flex items-center gap-2 text-cyan-100">
                      <Compass className="h-4 w-4" aria-hidden="true" />
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                        {t("mission.focusResearchLabel", { ns: "home" })}
                      </span>
                    </div>
                    <p className="text-sm leading-5 text-slate-200/90">
                      {t("mission.focusResearch", { ns: "home" })}
                    </p>
                  </div>
                  <div className="sovereign-focus-card border border-emerald-200/20 bg-white/10 p-3">
                    <div className="mb-2 flex items-center gap-2 text-emerald-100">
                      <UserCheck className="h-4 w-4" aria-hidden="true" />
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                        {t("mission.focusCommunityLabel", { ns: "home" })}
                      </span>
                    </div>
                    <p className="text-sm leading-5 text-slate-200/90">
                      {t("mission.focusCommunity", { ns: "home" })}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to="/about-nara-our-story"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-950/20 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    {t("mission.ctaLearn", { ns: "home" })}
                  </Link>
                  <Link
                    to="/contact-us"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-200/50 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {t("mission.ctaConsult", { ns: "home" })}
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="flex items-center p-4 sm:p-5 lg:p-6"
              >
                <div className="sovereign-map-card">
                  <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-200/20 bg-slate-950/28 px-4 py-3 text-xs sm:px-5">
                    <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.15em] text-cyan-100">
                      <span className="sovereign-live-dot h-2.5 w-2.5 rounded-full bg-emerald-300" />
                      {t("mission.telemetryLabel", { ns: "home" })}
                    </div>
                    <div className="rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1 font-bold uppercase tracking-[0.14em] text-amber-100">
                      {t("hero.overview.sovereignWaters.value", { ns: "home" })}
                    </div>
                  </div>

                  <div className="sovereign-map-stage" aria-hidden="true">
                    <svg
                      className="sovereign-map-svg"
                      viewBox="0 0 640 460"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <path id="sriLankaExactShape" d={SRI_LANKA_MAP_PATH} />
                        <clipPath id="sriLankaExactClip">
                          <use href="#sriLankaExactShape" />
                        </clipPath>
                        <linearGradient id="islandLand" x1="255" y1="80" x2="410" y2="390" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#F4FCCA" />
                          <stop offset="0.18" stopColor="#BBF7D0" />
                          <stop offset="0.52" stopColor="#34D399" />
                          <stop offset="1" stopColor="#15803D" />
                        </linearGradient>
                        <linearGradient id="islandSide" x1="270" y1="122" x2="420" y2="380" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#166534" />
                          <stop offset="0.5" stopColor="#065F46" />
                          <stop offset="1" stopColor="#042F2E" />
                        </linearGradient>
                        <linearGradient id="islandCoast" x1="240" y1="82" x2="420" y2="390" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FEF08A" />
                          <stop offset="0.56" stopColor="#67E8F9" />
                          <stop offset="1" stopColor="#0EA5E9" />
                        </linearGradient>
                        <linearGradient id="terrainRidge" x1="270" y1="98" x2="390" y2="372" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FEF9C3" stopOpacity="0.88" />
                          <stop offset="0.45" stopColor="#DCFCE7" stopOpacity="0.42" />
                          <stop offset="1" stopColor="#BBF7D0" stopOpacity="0.1" />
                        </linearGradient>
                        <radialGradient id="oceanGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(338 242) rotate(90) scale(214 192)">
                          <stop stopColor="#67E8F9" stopOpacity="0.32" />
                          <stop offset="1" stopColor="#0284C7" stopOpacity="0" />
                        </radialGradient>
                        <filter id="islandDepth" x="220" y="50" width="220" height="390" colorInterpolationFilters="sRGB">
                          <feDropShadow dx="12" dy="19" stdDeviation="8" floodColor="#02111F" floodOpacity="0.68" />
                          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#67E8F9" floodOpacity="0.58" />
                        </filter>
                      </defs>

                      <rect width="640" height="460" fill="url(#oceanGlow)" />
                      <path
                        className="sovereign-eez-boundary"
                        d="M203 58C291 11 441 34 526 133C626 249 557 397 397 431C242 465 95 392 78 266C66 175 112 104 203 58Z"
                        stroke="#FBBF24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.82"
                      />
                      <path
                        d="M228 94C299 58 418 77 487 153C568 241 514 353 392 383C269 414 150 360 137 267C127 197 158 132 228 94Z"
                        stroke="#38BDF8"
                        strokeWidth="1.5"
                        strokeDasharray="5 9"
                        opacity="0.5"
                      />

                      <path className="sovereign-current-line" d="M24 256C139 212 204 263 293 222C378 184 463 178 611 119" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" opacity="0.54" />
                      <path className="sovereign-current-line" d="M6 304C120 271 208 315 302 285C411 250 490 279 632 235" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" opacity="0.48" />
                      <path className="sovereign-current-line" d="M38 190C132 159 213 179 291 151C385 118 477 136 612 94" stroke="#38BDF8" strokeWidth="1.25" strokeLinecap="round" opacity="0.38" />

                      <g className="sovereign-island">
                        <g transform="translate(-20 -20) scale(1.12)">
                        <use
                          href="#sriLankaExactShape"
                          transform="translate(16 20)"
                          fill="#021F2D"
                          opacity="0.34"
                        />
                        <use
                          href="#sriLankaExactShape"
                          transform="translate(9 12)"
                          fill="url(#islandSide)"
                          opacity="0.88"
                        />
                        <use
                          href="#sriLankaExactShape"
                          fill="url(#islandLand)"
                          stroke="url(#islandCoast)"
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                          filter="url(#islandDepth)"
                        />
                        <g clipPath="url(#sriLankaExactClip)">
                          <path
                            d="M317 92C336 116 346 143 347 174C348 205 365 225 374 256C386 299 369 336 334 374"
                            stroke="url(#terrainRidge)"
                            strokeWidth="2.1"
                            strokeLinecap="round"
                            opacity="0.76"
                          />
                          <path
                            d="M291 123C308 147 318 174 320 205C322 241 343 266 346 304C349 332 339 356 318 379"
                            stroke="#DCFCE7"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            opacity="0.42"
                          />
                          <path
                            d="M268 205C295 213 319 232 333 260C348 289 348 318 334 351"
                            stroke="#FDE68A"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            opacity="0.32"
                          />
                          <path
                            d="M301 171C322 184 335 202 342 226C346 243 354 256 365 268"
                            stroke="#F8FAFC"
                            strokeWidth="1"
                            strokeLinecap="round"
                            opacity="0.32"
                          />
                          <ellipse cx="337" cy="252" rx="34" ry="59" fill="#14532D" opacity="0.17" transform="rotate(-13 337 252)" />
                          <ellipse cx="318" cy="186" rx="24" ry="42" fill="#FEF3C7" opacity="0.14" transform="rotate(-17 318 186)" />
                        </g>
                        <use
                          href="#sriLankaExactShape"
                          fill="none"
                          stroke="#E0F2FE"
                          strokeWidth="1"
                          strokeLinejoin="round"
                          opacity="0.66"
                        />
                        </g>
                      </g>

                      {[
                        [186, 130],
                        [487, 158],
                        [494, 338],
                        [195, 339],
                      ].map(([cx, cy], beaconIndex) => (
                        <g key={`${cx}-${cy}`}>
                          <circle
                            className="sovereign-beacon"
                            cx={cx}
                            cy={cy}
                            r="18"
                            stroke="#67E8F9"
                            strokeWidth="2"
                            style={{ animationDelay: `${beaconIndex * 0.42}s` }}
                          />
                          <circle cx={cx} cy={cy} r="4" fill="#F8FAFC" />
                          <path d={`M${cx} ${cy - 18}V${cy - 5}`} stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round" />
                        </g>
                      ))}

                      <text x="494" y="106" fill="#FDE68A" fontSize="14" fontWeight="700" letterSpacing="1.6">
                        200 NM
                      </text>
                    </svg>
                  </div>

                  <div className="sovereign-monitor-strip grid grid-cols-1 gap-3 px-4 py-3 text-sm text-slate-200 sm:grid-cols-[0.85fr_1fr_1.75fr] sm:px-5">
                    <div className="flex items-center gap-2">
                      <Radar className="h-4 w-4 text-cyan-200" aria-hidden="true" />
                      <span className="leading-snug">{t("hero.stats.protectedWaters.label", { ns: "home" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Satellite className="h-4 w-4 text-amber-200" aria-hidden="true" />
                      <span className="leading-snug">{t("hero.stats.activeSensors.caption", { ns: "home" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Waves className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                      <span className="leading-snug">{t("mission.briefing", { ns: "home" })}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {(missionContent?.stats || []).map((stat, index) => {
                const StatIcon = missionStatsIcons[index] || Activity;
                return (
                  <motion.div
                    key={stat?.label || index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.08 * index }}
                    className="sovereign-stat-card flex min-w-0 items-center gap-3 border border-cyan-100/20 bg-white/10 p-4 text-white backdrop-blur"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
                      <StatIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-2xl font-bold leading-none text-white">
                        {stat?.value}
                      </span>
                      <span className="mt-1 block text-xs font-semibold uppercase leading-snug tracking-[0.13em] text-cyan-100/75">
                        {stat?.label}
                      </span>
                    </span>
                  </motion.div>
                );
              })}
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
          className="relative overflow-hidden bg-white min-h-[100px]"
        >
          {servicesVisible && (
            <Suspense
              fallback={
                <div className="py-10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-nara-blue/20 border-t-nara-navy" />
                </div>
              }
            >
              <UnifiedServicesHub />
            </Suspense>
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

      <Suspense fallback={null}>
        <PartnersCollaborators />
      </Suspense>
      <GovFooter />
    </div>
  );
};

export default NewHomePage;
