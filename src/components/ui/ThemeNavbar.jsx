import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppImage from '../AppImage';
import { AVAILABLE_LANGUAGES } from '../../i18n';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import WaterBubbles from './WaterBubbles';

const ThemeNavbar = () => {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const { t, i18n } = useTranslation(['common', 'audiences']);
  const languageMenuRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const navbarRef = useRef(null);
  const primaryFont = "'Outfit', 'Noto Sans Sinhala', 'Noto Sans Tamil', system-ui, sans-serif";
  const secondaryFont = "'Plus Jakarta Sans', 'Noto Sans Sinhala', 'Noto Sans Tamil', system-ui, sans-serif";
  const langBadgeMap = {
    si: { label: 'සිංහල', short: 'සි', flag: '🇱🇰' },
    ta: { label: 'தமிழ்', short: 'த', flag: '🇱🇰' },
    en: { label: 'English', short: 'EN', flag: '🇱🇰' }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const lang = (i18n.language || 'en').split('-')[0];
      document.documentElement.setAttribute('lang', lang);
    }
  }, [i18n.language]);

  useEffect(() => {
    if (!languageMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [languageMenuOpen]);

  // Check if current path matches any item
  const isActivePath = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Check if dropdown contains active path
  const hasActiveChild = (dropdown) => {
    if (!dropdown) return false;
    return dropdown.some(item => isActivePath(item.path));
  };

  const menuItems = [
    {
      titleKey: 'navbar.menu.about.title',
      icon: Icons.Info,
      dropdown: [
        { labelKey: 'navbar.menu.about.links.ourStory', path: '/about-nara-our-story', icon: Icons.Heart },
        { 
          labelKey: 'navbar.menu.divisions.links.allDivisions', 
          path: '/divisions', 
          icon: Icons.Grid3x3,
          submenu: [
            { labelKey: 'navbar.menu.divisions.submenu.research', path: '/divisions', icon: Icons.Microscope },
            { labelKey: 'navbar.menu.divisions.submenu.regional', path: '/divisions/regional-centers', icon: Icons.MapPin },
            { labelKey: 'navbar.menu.divisions.submenu.supporting', path: '/divisions/supporting', icon: Icons.Users }
          ]
        },
        { labelKey: 'navbar.menu.about.links.newsUpdates', path: '/nara-news-updates-center', icon: Icons.Newspaper },
        { labelKey: 'navbar.menu.about.links.podcasts', path: '/podcasts', icon: Icons.Mic, badge: 'LIVE' },
        { labelKey: 'navbar.menu.about.links.mediaGallery', path: '/media-gallery', icon: Icons.Image },
        { labelKey: 'navbar.menu.news.links.mediaPressKit', path: '/media-press-kit', icon: Icons.Camera },
        { labelKey: 'navbar.menu.about.links.procurement', path: '/procurement-recruitment-portal', icon: Icons.Briefcase },
        { labelKey: 'navbar.menu.about.links.naraAct', path: '/nara-act', icon: Icons.Scale },
        { labelKey: 'navbar.menu.about.links.rti', path: '/rti', icon: Icons.FileText },
        { labelKey: 'navbar.menu.about.links.annualReports', path: '/annual-reports', icon: Icons.BookOpen }
      ]
    },
    {
      titleKey: 'navbar.menu.research.title',
      icon: Icons.Microscope,
      dropdown: [
        { labelKey: 'navbar.menu.research.links.researchExcellencePortal', path: '/research-excellence-portal', icon: Icons.Award },
        { labelKey: 'navbar.menu.data.links.analyticsHub', path: '/analytics', icon: Icons.TrendingUp },
        { labelKey: 'navbar.menu.data.links.openData', path: '/open-data-portal', icon: Icons.Database },
        { labelKey: 'navbar.menu.research.links.projectPipeline', path: '/project-pipeline-tracker', icon: Icons.Activity },
        { labelKey: 'navbar.menu.research.links.vesselBooking', path: '/research-vessel-booking', icon: Icons.Ship },
        { labelKey: 'navbar.menu.research.links.labResults', path: '/lab-results', icon: Icons.FlaskConical },
        { labelKey: 'navbar.menu.research.links.scientificEvidence', path: '/scientific-evidence-repository', icon: Icons.BookText },
        { labelKey: 'navbar.menu.data.links.spatialPlanning', path: '/marine-spatial-planning-viewer', icon: Icons.Map }
      ]
    },
    {
      titleKey: 'navbar.menu.services.title',
      icon: Icons.Briefcase,
      dropdown: [
        { labelKey: 'navbar.menu.services.links.governmentServices', path: '/government-services-portal', icon: Icons.Building },
        { labelKey: 'navbar.menu.services.links.emergencyResponse', path: '/emergency-response-network', icon: Icons.AlertTriangle },
        { labelKey: 'navbar.menu.services.links.fishAdvisory', path: '/fish-advisory-system', icon: Icons.Fish },
        { labelKey: 'navbar.menu.services.links.vesselTracking', path: '/live-vessel-tracking', icon: Icons.Ship, badge: 'LIVE' },
        { labelKey: 'navbar.menu.services.links.marineIncident', path: '/marine-incident-portal', icon: Icons.AlertCircle },
        { labelKey: 'navbar.menu.services.links.exportIntelligence', path: '/export-market-intelligence', icon: Icons.TrendingUp }
        // Integration Systems moved to admin panel
      ]
    },
    {
      titleKey: 'navbar.menu.education.title',
      icon: Icons.GraduationCap,
      dropdown: [
        { labelKey: 'navbar.menu.resources.links.learningAcademy', path: '/learning-development-academy', icon: Icons.BookOpen },
        { labelKey: 'navbar.menu.resources.links.libraryCatalogue', path: '/library', icon: Icons.Library },
        { labelKey: 'navbar.menu.resources.links.digitalProductLibrary', path: '/digital-product-library', icon: Icons.Archive },
        { labelKey: 'navbar.menu.services.links.digitalMarketplace', path: '/nara-digital-marketplace', icon: Icons.ShoppingBag }
      ]
    },
    {
      titleKey: 'navbar.menu.community.title',
      icon: Icons.Users,
      dropdown: [
        { labelKey: 'audiences:nav.generalPublic', path: '/audiences/general-public', icon: Icons.Heart },
        { labelKey: 'audiences:nav.researchers', path: '/audiences/researchers-students', icon: Icons.Microscope },
        { labelKey: 'audiences:nav.industry', path: '/audiences/industry-exporters', icon: Icons.BriefcaseBusiness },
        { labelKey: 'navbar.menu.resources.links.regionalImpact', path: '/regional-impact-network', icon: Icons.Globe },
        { labelKey: 'navbar.menu.resources.links.publicConsultation', path: '/public-consultation-portal', icon: Icons.MessageSquare }
      ]
    },
    {
      titleKey: 'navbar.menu.contact.title',
      icon: Icons.Phone,
      path: '/contact-us'
    }
  ];

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
    setExpandedSubmenu(null);
  }, [clearDropdownTimeout]);

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

  const handleMouseEnter = (index) => {
    clearDropdownTimeout();
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    clearDropdownTimeout();
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      dropdownTimeoutRef.current = null;
    }, 180);
  };

  const handleDropdownMouseEnter = () => {
    clearDropdownTimeout();
  };

  const handleDropdownMouseLeave = () => {
    clearDropdownTimeout();
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      dropdownTimeoutRef.current = null;
    }, 160);
  };

  const handleTopLevelClick = (index, path, hasDropdown) => {
    if (hasDropdown) {
      if (activeDropdown === index) {
        closeAllDropdowns();
      } else {
        setActiveDropdown(index);
      }
      return;
    }

    if (path && path !== '#') {
      navigate(path);
    }
    closeAllDropdowns();
    setMobileMenuOpen(false);
  };

  const handleDropdownLinkClick = () => {
    closeAllDropdowns();
    setMobileMenuOpen(false);
  };

  return (
    <header>
    <nav
      ref={navbarRef}
      className={`navbar-theme ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
        background: scrolled
          ? 'linear-gradient(135deg, rgba(100, 180, 240, 0.95), rgba(70, 150, 220, 0.95), rgba(50, 130, 210, 0.95))'
          : 'linear-gradient(135deg, rgba(120, 195, 245, 0.92), rgba(85, 165, 230, 0.92), rgba(60, 140, 215, 0.92))',
        borderBottom: '3px solid rgba(0, 86, 179, 0.5)',
        boxShadow: scrolled
          ? '0 10px 28px rgba(0, 88, 164, 0.25), 0 4px 12px rgba(100, 180, 240, 0.15)'
          : '0 8px 18px rgba(0, 88, 164, 0.18), 0 2px 8px rgba(100, 180, 240, 0.12)',
        transition: 'background 0.35s ease, box-shadow 0.35s ease',
        fontFamily: primaryFont,
        overflow: 'visible'
      }}
      onMouseLeave={() => {
        clearDropdownTimeout();
        dropdownTimeoutRef.current = setTimeout(() => {
          setActiveDropdown(null);
          dropdownTimeoutRef.current = null;
        }, 220);
      }}
    >
      {/* Ocean Background Effects */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Wave effect overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
            animation: 'wave 8s ease-in-out infinite',
            opacity: 0.3
          }}
        />

        {/* Water bubbles animation */}
        <WaterBubbles count={12} />
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.3rem',
        width: '100%',
        padding: '0.1rem 0.6rem',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* Logo Section - Compact */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', flexShrink: 0, marginLeft: '4rem' }}>
          <AppImage
            src="/assets/nara-logo.png"
            alt="NARA logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          <div className="hidden sm:block" style={{ fontFamily: primaryFont }}>
            <h1 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.05 }}>{t('navbar.brand.title')}</h1>
            <p style={{ margin: 0, fontSize: '0.5rem', opacity: 0.7, color: 'var(--muted)', lineHeight: 1.05, fontFamily: secondaryFont }}>{t('navbar.brand.subtitle')}</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          className="nav-links hidden md:flex"
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            gap: '0.2rem',
            fontFamily: primaryFont
          }}
        >
          {menuItems.map((item, index) => {
            const hasDropdown = Array.isArray(item.dropdown) && item.dropdown.length > 0;
            const targetPath = hasDropdown ? item.dropdown[0]?.path : item.path;
            return (
              <div
                key={item.titleKey}
                className="relative"
                onMouseEnter={() => hasDropdown && handleMouseEnter(index)}
                onMouseLeave={hasDropdown ? handleMouseLeave : undefined}
              >
                <button
                  type="button"
                className="btn-ghost"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 650,
                  letterSpacing: '0.01em',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    color: isActivePath(item.path) || hasActiveChild(item.dropdown) ? '#0066CC' : '#003366',
                    background: (hasDropdown && activeDropdown === index) || isActivePath(item.path) || hasActiveChild(item.dropdown) ? 'rgba(100, 181, 246, 0.18)' : 'transparent',
                    border: (hasDropdown && activeDropdown === index) || isActivePath(item.path) || hasActiveChild(item.dropdown) ? '1px solid rgba(100, 181, 246, 0.4)' : '1px solid transparent',
                    boxShadow: isActivePath(item.path) || hasActiveChild(item.dropdown) ? '0 2px 8px rgba(100, 181, 246, 0.3)' : 'none'
                  }}
                  onClick={() => handleTopLevelClick(index, targetPath, hasDropdown)}
                >
                  <item.icon className="w-3 h-3" />
                  {t(item.titleKey)}
                  {hasDropdown && <Icons.ChevronDown className="w-3 h-3" aria-hidden="true" />}
                </button>

                {hasDropdown && (
                  <AnimatePresence>
                    {activeDropdown === index && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="glass"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 0.3rem)',
                          left: 0,
                          transform: 'translateX(-12px)',
                          minWidth: '230px',
                          borderRadius: '16px',
                          padding: '0.4rem',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.22)',
                          background: 'rgba(255, 255, 255, 0.97)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(0, 86, 179, 0.18)'
                        }}
                      >
                        {item.dropdown.map((subItem) => {
                          const isExternal = subItem.isExternal || subItem.path.startsWith('http');
                          const hasSubmenu = subItem.submenu && subItem.submenu.length > 0;
                          
                          const linkStyle = {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 0.85rem',
                            borderRadius: '12px',
                            background: isActivePath(subItem.path) ? 'rgba(100, 181, 246, 0.2)' : 'transparent',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            fontFamily: secondaryFont,
                            borderLeft: isActivePath(subItem.path) ? '3px solid #64B5F6' : '3px solid transparent'
                          };
                          
                          const handleMouseEnter = (e) => {
                            if (!isActivePath(subItem.path)) {
                              e.currentTarget.style.background = 'rgba(0, 86, 179, 0.08)';
                              e.currentTarget.style.transform = 'translateX(3px)';
                            }
                          };
                          
                          const handleMouseLeave = (e) => {
                            if (!isActivePath(subItem.path)) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }
                          };
                          
                          const content = (
                            <>
                              <subItem.icon
                                className="w-4 h-4"
                                style={{
                                  color: isActivePath(subItem.path) ? '#0066CC' : '#005A9C'
                                }}
                              />
                              <span style={{
                                fontSize: '0.88rem',
                                fontWeight: isActivePath(subItem.path) ? 650 : 550,
                                fontFamily: secondaryFont,
                                color: isActivePath(subItem.path) ? '#0066CC' : '#003366'
                              }}>{t(subItem.labelKey)}</span>
                              {hasSubmenu && (
                                <Icons.ChevronRight 
                                  className="w-4 h-4 ml-auto" 
                                  style={{ color: '#005A9C', opacity: 0.6 }}
                                />
                              )}
                              {isExternal && !hasSubmenu && (
                                <Icons.ExternalLink 
                                  className="w-3 h-3 ml-auto" 
                                  style={{ color: '#005A9C', opacity: 0.6 }}
                                />
                              )}
                            </>
                          );
                          
                          if (hasSubmenu) {
                            const isExpanded = expandedSubmenu === subItem.labelKey;
                            return (
                              <div key={subItem.path} style={{ position: 'relative', width: '100%' }}>
                                <div
                                  className="dropdown-item"
                                  style={{...linkStyle, cursor: 'pointer'}}
                                  onClick={() => setExpandedSubmenu(isExpanded ? null : subItem.labelKey)}
                                  onMouseEnter={handleMouseEnter}
                                  onMouseLeave={handleMouseLeave}
                                >
                                  {content}
                                </div>
                                {isExpanded && (
                                  <div style={{
                                    paddingLeft: '1.5rem',
                                    marginTop: '0.25rem',
                                    borderLeft: '2px solid rgba(0, 86, 179, 0.15)',
                                    marginLeft: '0.85rem'
                                  }}>
                                    {subItem.submenu.map((nestedItem) => {
                                    const nestedLinkStyle = {
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      padding: '0.5rem 0.75rem',
                                      borderRadius: '10px',
                                      background: isActivePath(nestedItem.path) ? 'rgba(100, 181, 246, 0.15)' : 'transparent',
                                      textDecoration: 'none',
                                      transition: 'all 0.2s ease',
                                      fontFamily: secondaryFont
                                    };

                                    return (
                                      <Link
                                        key={nestedItem.path}
                                        to={nestedItem.path}
                                        onClick={handleDropdownLinkClick}
                                        style={nestedLinkStyle}
                                        onMouseEnter={(e) => {
                                          if (!isActivePath(nestedItem.path)) {
                                            e.currentTarget.style.background = 'rgba(0, 86, 179, 0.06)';
                                            e.currentTarget.style.transform = 'translateX(2px)';
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isActivePath(nestedItem.path)) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                          }
                                        }}
                                      >
                                        <nestedItem.icon
                                          className="w-3.5 h-3.5"
                                          style={{ color: isActivePath(nestedItem.path) ? '#0066CC' : '#005A9C' }}
                                        />
                                        <span style={{
                                          fontSize: '0.82rem',
                                          fontWeight: isActivePath(nestedItem.path) ? 600 : 500,
                                          color: isActivePath(nestedItem.path) ? '#0066CC' : '#003366'
                                        }}>{t(nestedItem.labelKey)}</span>
                                      </Link>
                                    );
                                  })}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          return isExternal ? (
                            <a
                              key={subItem.path}
                              href={subItem.path}
                              className="dropdown-item"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = subItem.path;
                                handleDropdownLinkClick();
                              }}
                              style={linkStyle}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              {content}
                            </a>
                          ) : (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className="dropdown-item"
                              onClick={handleDropdownLinkClick}
                              style={linkStyle}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              {content}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* Right side actions - Profile/Registration & Language selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, marginRight: '3rem' }}>

          {/* Show Profile or Register button based on auth status */}
          {user ? (
            <Link
              to="/profile"
              className="hidden md:flex"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: 'rgba(0, 102, 204, 0.1)',
                color: '#0066CC',
                textDecoration: 'none',
                border: '1px solid rgba(0, 102, 204, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 102, 204, 0.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 102, 204, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Icons.User className="w-3.5 h-3.5" />
              <span>{t('navbar.profile', 'Profile')}</span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="hidden md:flex"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #0066CC, #0052A3)',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 102, 204, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.3)';
              }}
            >
              <Icons.UserPlus className="w-3.5 h-3.5" />
              <span>{t('navbar.register', 'Register')}</span>
            </Link>
          )}

          {/* Language Selector - Always Visible */}
          <div
            ref={languageMenuRef}
            style={{ position: 'relative' }}
          >
            <button
              onClick={() => setLanguageMenuOpen((prev) => !prev)}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #f58220, #f9c602 55%, #0b7a44)',
                color: '#00214d',
                boxShadow: '0 6px 16px rgba(11, 122, 68, 0.25)'
              }}
              aria-haspopup="listbox"
              aria-expanded={languageMenuOpen}
              title={t('navbar.languageLabel')}
            >
              <span role="img" aria-hidden="true" style={{ fontSize: '1rem' }}>
                {langBadgeMap[activeLanguage.code]?.flag || '🇱🇰'}
              </span>
              <span style={{ fontFamily: primaryFont, letterSpacing: '0.04em' }}>
                {langBadgeMap[activeLanguage.code]?.short || activeLanguage.code.toUpperCase()}
              </span>
              <Icons.ChevronDown className={`w-3 h-3 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {languageMenuOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  role="listbox"
                  className="glass"
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '0.5rem',
                    borderRadius: '16px',
                    padding: '0.5rem',
                    minWidth: '200px',
                    boxShadow: '0 24px 40px rgba(2, 12, 27, 0.35)'
                  }}
                >
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <li key={lang.code}>
                      <button
                        onClick={() => handleLanguageChange(lang.code)}
                        className="btn-ghost"
                        style={{
                          display: 'flex',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontFamily: primaryFont,
                          background: lang.code === activeLanguage.code ? 'rgba(0, 86, 179, 0.12)' : 'transparent',
                          color: '#003366'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span role="img" aria-label={t(lang.labelKey)} style={{ fontSize: '1rem' }}>
                            {langBadgeMap[lang.code]?.flag || '🌐'}
                          </span>
                          <span>{t(lang.labelKey)}</span>
                        </span>
                        {lang.code === activeLanguage.code && (
                          <Icons.Check className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                        )}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              clearDropdownTimeout();
              if (mobileMenuOpen) {
                closeAllDropdowns();
              }
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="btn-ghost md:hidden"
            style={{ padding: '0.5rem', borderRadius: '8px' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass md:hidden"
            style={{
              position: 'absolute',
              top: '100%',
              left: '12px',
              right: '12px',
              marginTop: '0.5rem',
              borderRadius: '16px',
              padding: '1rem',
              background: 'var(--glass-strong)',
              fontFamily: secondaryFont
            }}
          >
            {/* Profile/Registration Button - Mobile */}
            {user ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: 'rgba(0, 102, 204, 0.1)',
                  color: '#0066CC',
                  textDecoration: 'none',
                  border: '2px solid rgba(0, 102, 204, 0.3)',
                  marginBottom: '1rem'
                }}
              >
                <Icons.User className="w-5 h-5" />
                <span>{t('navbar.profile', 'Profile')}</span>
              </Link>
            ) : (
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #0066CC, #0052A3)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)',
                  marginBottom: '1rem'
                }}
              >
                <Icons.UserPlus className="w-5 h-5" />
                <span>{t('navbar.register', 'Register')}</span>
              </Link>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  opacity: 0.6
                }}
              >
                {t('navbar.languageLabel')}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      border: '1px solid rgba(0, 86, 179, 0.25)',
                      fontFamily: primaryFont,
                      background: lang.code === normalizedLanguage ? 'rgba(0, 86, 179, 0.12)' : 'transparent',
                      color: '#003366'
                    }}
                  >
                    {t(lang.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {menuItems.map((item) => {
              const hasDropdown = Array.isArray(item.dropdown) && item.dropdown.length > 0;
              return (
                <div key={item.titleKey}>
                  <h3 style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    opacity: 0.6,
                    marginBottom: '0.5rem',
                    marginTop: '1rem'
                  }}>
                    {t(item.titleKey)}
                  </h3>
                  {hasDropdown ? (
                    item.dropdown.map((subItem) => {
                      const isExternal = subItem.isExternal || subItem.path.startsWith('http');
                      const linkStyle = {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        textDecoration: 'none',
                        fontFamily: secondaryFont
                      };
                      
                      return isExternal ? (
                        <a
                          key={subItem.path}
                          href={subItem.path}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = subItem.path;
                            setMobileMenuOpen(false);
                            closeAllDropdowns();
                          }}
                          style={linkStyle}
                        >
                          <subItem.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                          <span>{t(subItem.labelKey)}</span>
                          <Icons.ExternalLink className="w-3 h-3 ml-auto" style={{ opacity: 0.6 }} />
                        </a>
                      ) : (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            closeAllDropdowns();
                          }}
                          style={linkStyle}
                        >
                          <subItem.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                          <span>{t(subItem.labelKey)}</span>
                        </Link>
                      );
                    })
                  ) : (
                    <Link
                      to={item.path || '#'}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        closeAllDropdowns();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        textDecoration: 'none',
                        fontFamily: secondaryFont
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </header>
  );
};

export default ThemeNavbar;
