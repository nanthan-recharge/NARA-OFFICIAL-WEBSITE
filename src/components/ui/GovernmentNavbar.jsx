/**
 * Government Navbar Component - Redesigned
 * NARA Digital Ocean Theme
 *
 * Features:
 * - Glassmorphism design system
 * - Intelligent scroll behavior
 * - Mega menu with glass styling
 * - Interactive hover states
 * - Mobile responsive with modern UI
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES } from '../../i18n';

const GovernmentNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const { t, i18n } = useTranslation(['common', 'divisions']);
  const languageMenuRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const navbarRef = useRef(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  // Language badge mapping
  const langBadgeMap = {
    si: { label: 'සිංහල', short: 'සි', flag: '🇱🇰' },
    ta: { label: 'தமிழ்', short: 'த', flag: '🇱🇰' },
    en: { label: 'English', short: 'EN', flag: '🇬🇧' }
  };

  // Division data for mega menu — 3 categories with correct slugs
  const divisionCategories = [
    {
      id: 'research',
      label: 'Research Divisions',
      icon: Icons.Microscope,
      color: 'cyan',
      divisions: [
        { name: 'Environmental Studies', path: '/divisions/environmental-studies-division', icon: Icons.Leaf },
        { name: 'Fishing Technology', path: '/divisions/fishing-technology-division', icon: Icons.Anchor },
        { name: 'Inland Aquatic & Aquaculture', path: '/divisions/inland-aquatic-aquaculture-division', icon: Icons.Droplets },
        { name: 'Post-Harvest Technology', path: '/divisions/post-harvest-technology-division', icon: Icons.Award },
        { name: 'Marine Biological Resources', path: '/divisions/marine-biological-division', icon: Icons.Waves },
        { name: 'Oceanography & Marine Sciences', path: '/divisions/oceanography-marine-sciences-division', icon: Icons.Compass },
        { name: 'Hydrographic Division', path: '/divisions/hydrographic-division', icon: Icons.Map },
        { name: 'Socio-Economic & Marketing', path: '/divisions/socio-economic-marketing-division', icon: Icons.TrendingUp },
        { name: 'Monitoring & Evaluation', path: '/divisions/monitoring-evaluation-division', icon: Icons.BarChart3 },
        { name: 'Aquaculture Research Center', path: '/divisions/aquaculture-research-center', icon: Icons.Building2 },
        { name: 'Technology Transfer', path: '/divisions/technology-transfer-division', icon: Icons.Share2 },
      ]
    },
    {
      id: 'regional',
      label: 'Regional Centers',
      icon: Icons.MapPin,
      color: 'emerald',
      divisions: [
        { name: 'Kadolkele (Negombo)', path: '/divisions/regional-research-center-kadolkele', icon: Icons.MapPin },
        { name: 'Kalpitiya', path: '/divisions/regional-research-center-kalpitiya', icon: Icons.MapPin },
        { name: 'Kapparathota (Weligama)', path: '/divisions/regional-research-center-kapparathota', icon: Icons.MapPin },
        { name: 'Panapitiya', path: '/divisions/regional-research-center-panapitiya', icon: Icons.MapPin },
        { name: 'Rekawa', path: '/divisions/regional-research-center-rekawa', icon: Icons.MapPin },
      ]
    },
    {
      id: 'supporting',
      label: 'Supporting Divisions',
      icon: Icons.Briefcase,
      color: 'purple',
      divisions: [
        { name: 'Administration', path: '/divisions/administration-division', icon: Icons.Briefcase },
        { name: 'Finance', path: '/divisions/finance-division', icon: Icons.DollarSign },
        { name: 'Service & Operations', path: '/divisions/service-operations-division', icon: Icons.Settings },
        { name: 'Internal Audit', path: '/divisions/internal-audit-division', icon: Icons.Search },
      ]
    }
  ];

  // Flat list for mobile menu compatibility
  const allDivisions = divisionCategories.flatMap(cat => cat.divisions);

  // Grouped Menu items for better organization
  const menuItems = [
    { id: 'home', label: t('navbar.gov.home', 'Home'), path: '/', icon: Icons.Home },
    {
      id: 'about',
      label: t('navbar.gov.about', 'About'),
      icon: Icons.Info,
      hasDropdown: true,
      dropdown: [
        { name: 'Our Story', path: '/about-nara-our-story', icon: Icons.Info },
        { name: t('navbar.menu.about.links.mediaGallery', 'Media Gallery'), path: '/media-gallery', icon: Icons.Image },
        { name: t('navbar.menu.news.links.mediaPressKit', 'Media Press Kit'), path: '/media-press-kit', icon: Icons.Camera },
        { name: 'Podcasts', path: '/podcasts', icon: Icons.Radio }
      ]
    },
    { id: 'division', label: t('navbar.gov.division', 'Divisions'), icon: Icons.Building2, megaMenu: true, dropdown: allDivisions, categories: divisionCategories },
    {
      id: 'research-knowledge',
      label: 'Research & Knowledge',
      icon: Icons.BookOpen,
      hasDropdown: true,
      dropdown: [
        { name: 'Research Portal', path: '/research-excellence-portal', icon: Icons.Microscope },
        { name: 'Digital Library', path: '/library', icon: Icons.Library },
        { name: 'Scientist Session', path: '/scientist-session', icon: Icons.GraduationCap },
        { name: 'Analytics Hub', path: '/analytics', icon: Icons.BarChart3 },
        { name: 'Digital Marketplace', path: '/nara-digital-marketplace', icon: Icons.ShoppingCart },
        { name: 'Learning Academy', path: '/learning-development-academy', icon: Icons.BookOpen }
      ]
    },
    {
      id: 'services-resources',
      label: 'Services',
      icon: Icons.Briefcase,
      hasDropdown: true,
      dropdown: [
        { name: 'Government Services', path: '/government-services-portal', icon: Icons.Briefcase },
        { name: 'General Public Services', path: '/public-consultation-portal', icon: Icons.Users },
        { name: 'Procurement', path: '/procurement-recruitment-portal', icon: Icons.FileText },
        { name: 'Vacancies', path: '/vacancies', icon: Icons.Users }
      ]
    },
    {
      id: 'contact',
      label: t('navbar.gov.contact', 'Contact'),
      icon: Icons.Phone,
      hasDropdown: true,
      dropdown: [
        { name: 'Contact Us', path: '/contact-us', icon: Icons.Phone },
        { name: 'Emergency Response Network', path: '/emergency-response-network', icon: Icons.LifeBuoy }
      ]
    },
    { id: 'nara-mail', label: 'NARA Mail', path: 'http://kalu.nara.ac.lk/', icon: Icons.Mail, external: true }
  ];

  // Handle responsive breakpoint for desktop menu
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Language attribute sync
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const lang = (i18n.language || 'en').split('-')[0];
      document.documentElement.setAttribute('lang', lang);
    }
  }, [i18n.language]);

  // Click outside handler for language menu
  useEffect(() => {
    if (!languageMenuOpen) return undefined;
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [languageMenuOpen]);

  // Check if current path matches
  const isActivePath = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const normalizedLanguage = (i18n.language || 'en').split('-')[0];
  const activeLanguage = AVAILABLE_LANGUAGES.find((lang) => lang.code === normalizedLanguage) || AVAILABLE_LANGUAGES[0];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nara-lang', code);
      window.dispatchEvent(new CustomEvent('languageChange', { detail: code }));
    }
    setLanguageMenuOpen(false);
  };

  const clearDropdownTimeout = useCallback(() => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => () => clearDropdownTimeout(), [clearDropdownTimeout]);

  const closeAllDropdowns = useCallback(() => {
    clearDropdownTimeout();
    setActiveDropdown(null);
  }, [clearDropdownTimeout]);

  // Handle pointer events outside navbar
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!navbarRef.current) return;
      if (!navbarRef.current.contains(event.target)) {
        closeAllDropdowns();
        setLanguageMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [closeAllDropdowns]);

  const handleMouseEnter = (id) => {
    clearDropdownTimeout();
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    clearDropdownTimeout();
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      dropdownTimeoutRef.current = null;
    }, 150);
  };

  const handleMenuClick = (item) => {
    if (item.external) {
      window.open(item.path, '_blank', 'noopener,noreferrer');
      return;
    }
    if (item.megaMenu || item.hasDropdown) {
      setActiveDropdown(activeDropdown === item.id ? null : item.id);
      return;
    }
    if (item.path) {
      navigate(item.path);
      closeAllDropdowns();
      setMobileMenuOpen(false);
    }
  };

  // Keyboard navigation handler
  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMenuClick(item);
    }
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] w-full font-sans">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:px-6 focus:py-3 focus:bg-white focus:text-ocean-deep focus:rounded-lg focus:shadow-lg focus:font-bold focus:outline-none focus:ring-4 focus:ring-ocean-light"
      >
        {t('accessibility.skipToContent', 'Skip to main content')}
      </a>

      <nav
        ref={navbarRef}
        className={`w-full transition-all duration-300 backdrop-blur-md border-b border-white/10 ${scrolled ? 'bg-ocean-deep/90 shadow-ocean-depth py-2' : 'bg-ocean-deep/80 py-4'
          }`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* LEFT: Government Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="group relative flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-2 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="/logos/SRI LANKA LOGO .png"
                  alt="Government of Sri Lanka"
                  className="h-16 w-auto object-contain relative z-10 drop-shadow-lg"
                />
              </div>
            </Link>
          </div>

          {/* CENTER: Navigation Menu - Desktop - Organized Dropdowns */}
          {isDesktop && (
            <div className="flex flex-1 items-center justify-center">
              <nav className="flex items-center gap-0.5 xl:gap-1 bg-white/10 backdrop-blur-md rounded-full px-2 py-1 border border-white/20 shadow-lg">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative group"
                    onMouseEnter={() => (item.megaMenu || item.hasDropdown) && handleMouseEnter(item.id)}
                    onMouseLeave={(item.megaMenu || item.hasDropdown) ? handleMouseLeave : undefined}
                  >
                    <button
                      onClick={() => handleMenuClick(item)}
                      onKeyDown={(e) => handleKeyDown(e, item)}
                      className={`nav-link relative inline-flex h-9 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2.5 xl:px-3 py-1.5 text-sm font-medium leading-none transition-all duration-300 ${isActivePath(item.path) || activeDropdown === item.id
                        ? 'text-white bg-cyan-500/20'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      {item.label}
                      {(item.megaMenu || item.hasDropdown) && (
                        <Icons.ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>

                    {/* Mega Menu Dropdown for Divisions — 3 Category Columns */}
                    <AnimatePresence>
                      {item.megaMenu && activeDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 15, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[680px] bg-ocean-deep/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 p-5"
                        >
                          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                          {/* Header */}
                          <div className="relative z-10 flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                            <h3 className="text-white font-bold text-base flex items-center gap-2">
                              <Icons.Building2 className="text-cyan-400" size={18} />
                              NARA Divisions
                            </h3>
                            <Link to="/divisions" onClick={closeAllDropdowns} className="text-cyan-400 text-xs hover:text-white transition-colors flex items-center gap-1 group">
                              View All <Icons.ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>

                          {/* 3-Column Category Grid — Text Only */}
                          <div className="relative z-10 grid grid-cols-3 gap-5">
                            {item.categories.map((cat) => {
                              const colorMap = { cyan: 'text-cyan-400', emerald: 'text-emerald-400', purple: 'text-purple-400' };
                              return (
                                <div key={cat.id}>
                                  <div className="mb-2 px-2 pb-1.5 border-b border-white/10">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${colorMap[cat.color]}`}>
                                      {cat.label}
                                    </span>
                                  </div>
                                  <div className="space-y-0.5">
                                    {cat.divisions.map((division) => (
                                      <Link
                                        key={division.path}
                                        to={division.path}
                                        onClick={closeAllDropdowns}
                                        className={`block px-2 py-1.5 rounded-md transition-all duration-200 ${isActivePath(division.path)
                                          ? 'bg-cyan-500/20 text-white'
                                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                          }`}
                                      >
                                        <span className="text-xs font-medium">{division.name}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Simple Dropdown for grouped items */}
                    <AnimatePresence>
                      {item.hasDropdown && activeDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-ocean-deep/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 py-2"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={closeAllDropdowns}
                              className={`block px-4 py-2.5 transition-all duration-200 ${isActivePath(subItem.path)
                                ? 'bg-cyan-500/20 text-white'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                              <span className="text-sm font-medium">{subItem.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>
          )}

          {/* RIGHT: NARA Logo & Utils */}
          <div className="flex items-center gap-4">

            {/* Language Selector */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="text-lg">{langBadgeMap[activeLanguage.code]?.flag}</span>
                <span className="text-sm font-medium text-white hidden sm:block">{activeLanguage.code.toUpperCase()}</span>
                <Icons.ChevronDown size={14} className={`text-gray-400 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {languageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-ocean-deep/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                  >
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${lang.code === activeLanguage.code
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{langBadgeMap[lang.code]?.flag}</span>
                          <span>{langBadgeMap[lang.code]?.label}</span>
                        </div>
                        {lang.code === activeLanguage.code && <Icons.Check size={14} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* NARA Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <h1 className="text-white font-headline font-bold text-lg leading-tight tracking-tight">NARA</h1>
                <p className="text-cyan-300 text-[10px] font-medium tracking-widest uppercase">Ocean Research</p>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 bg-cyan-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src="/logos/nara-logo-cropped.png" alt="NARA" className="h-16 w-16 object-contain relative z-10 drop-shadow-xl" />
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 top-[70px] bg-ocean-deep/95 backdrop-blur-xl z-[990] overflow-y-auto lg:hidden border-t border-white/10"
          >
            <div className="p-6 space-y-4 pb-20">
              {menuItems.map((item) => (
                <div key={item.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  {item.megaMenu ? (
                    /* Divisions — 3 category sub-groups */
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className="w-full flex items-center justify-between text-white font-semibold text-lg"
                      >
                        <span className="flex items-center gap-3">
                          <item.icon size={20} className="text-cyan-400" />
                          {item.label}
                        </span>
                        <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-2 space-y-4"
                          >
                            {item.categories.map((cat) => {
                              const colorMap = { cyan: 'text-cyan-400', emerald: 'text-emerald-400', purple: 'text-purple-400' };
                              const mobileActiveId = `mobile-${cat.id}`;
                              return (
                                <div key={cat.id}>
                                  <button
                                    onClick={() => setActiveDropdown(activeDropdown === mobileActiveId ? item.id : mobileActiveId)}
                                    className="w-full flex items-center justify-between py-1.5"
                                  >
                                    <span className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${colorMap[cat.color]}`}>
                                      <cat.icon size={14} />
                                      {cat.label}
                                      <span className="text-[10px] text-gray-500 font-normal normal-case">({cat.divisions.length})</span>
                                    </span>
                                    <Icons.ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${activeDropdown === mobileActiveId ? 'rotate-180' : ''}`} />
                                  </button>
                                  <AnimatePresence>
                                    {activeDropdown === mobileActiveId && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pl-2 space-y-0.5 mt-1"
                                      >
                                        {cat.divisions.map((division) => (
                                          <Link
                                            key={division.path}
                                            to={division.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 p-3 rounded-xl ${isActivePath(division.path) ? 'bg-cyan-500/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                          >
                                            <division.icon size={14} />
                                            <span className="text-sm font-medium">{division.name}</span>
                                          </Link>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                            <Link to="/divisions" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-cyan-400 text-sm font-medium p-3">
                              View All Divisions <Icons.ArrowRight size={14} />
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : item.hasDropdown ? (
                    /* Regular dropdown (Research & Knowledge, Services) */
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className="w-full flex items-center justify-between text-white font-semibold text-lg"
                      >
                        <span className="flex items-center gap-3">
                          <item.icon size={20} className="text-cyan-400" />
                          {item.label}
                        </span>
                        <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 space-y-1"
                          >
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 p-3 rounded-xl ${isActivePath(subItem.path) ? 'bg-cyan-500/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                              >
                                <subItem.icon size={16} />
                                <span className="text-sm font-medium">{subItem.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    item.external ? (
                      <a
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-lg font-semibold text-gray-400 hover:text-white transition-colors"
                      >
                        <item.icon size={20} className="text-gray-500" />
                        {item.label}
                        <Icons.ExternalLink size={14} className="ml-auto" />
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 text-lg font-semibold transition-colors ${isActivePath(item.path) ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        <item.icon size={20} className={isActivePath(item.path) ? 'text-cyan-400' : 'text-gray-500'} />
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default GovernmentNavbar;
