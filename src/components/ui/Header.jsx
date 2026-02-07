import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
import Button from './Button';
import useThemeStore from '../../store/theme';

const Header = ({ className = '' }) => {
  const { t } = useTranslation('errors');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }
    return localStorage.getItem('nara-lang') || 'en';
  });
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const theme = useThemeStore((s) => s?.theme);
  const toggleTheme = useThemeStore((s) => s?.toggleTheme);
  const location = useLocation();
  const navigate = useNavigate();

  // Language options
  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' }
  ];

  // Navigation structure - organized by category for professional appearance
  const navigationData = {
    about: {
      title: 'About NARA',
      items: [
        {
          name: 'Our Story',
          path: '/about-nara-our-story',
          icon: 'Heart',
          description: 'Mission & vision'
        }
      ]
    },
    contact: {
      title: 'Contact Us',
      items: [
        {
          name: 'Careers & Recruitment',
          path: '/procurement-recruitment-portal',
          icon: 'Briefcase',
          description: 'Join our team'
        },
        {
          name: 'News & Updates',
          path: '/nara-news-updates-center',
          icon: 'Newspaper',
          description: 'Latest announcements'
        },
        {
          name: 'Get In Touch',
          path: '/contact-us',
          icon: 'Mail',
          description: 'Contact information'
        }
      ]
    },
    research: {
      title: 'Research & Data',
      items: [
        {
          name: 'Ocean Intelligence',
          path: '/ocean-intelligence-dashboard-homepage',
          icon: 'Waves',
          description: 'Real-time ocean data analytics'
        },
        {
          name: 'Research Portal',
          path: '/research-excellence-portal',
          icon: 'Microscope',
          description: 'Scientific collaboration hub'
        },
        {
          name: 'Knowledge Center',
          path: '/knowledge-discovery-center',
          icon: 'BookOpen',
          description: 'Educational resources'
        }
      ]
    },
    services: {
      title: 'Services & Operations',
      items: [
        {
          name: 'Maritime Services',
          path: '/maritime-services-hub',
          icon: 'Ship',
          description: 'Professional maritime support'
        },
        {
          name: 'Emergency Response',
          path: '/emergency-response-network',
          icon: 'AlertTriangle',
          description: 'Critical alert systems'
        },
        {
          name: 'Regional Network',
          path: '/regional-impact-network',
          icon: 'Globe',
          description: 'Community partnerships'
        }
      ]
    },
    digital: {
      title: 'Digital Marketplace',
      items: [
        {
          name: 'Digital Marketplace',
          path: '/nara-digital-marketplace',
          icon: 'ShoppingCart',
          description: 'Research publications & products'
        },
        {
          name: 'Digital Library',
          path: '/digital-product-library',
          icon: 'Library',
          description: 'Your purchased products'
        },
        {
          name: 'Payment Gateway',
          path: '/payment-gateway-hub',
          icon: 'CreditCard',
          description: 'Secure payments'
        }
      ]
    },
    development: {
      title: 'Development & Innovation',
      items: [
        {
          name: 'Learning Academy',
          path: '/learning-development-academy',
          icon: 'GraduationCap',
          description: 'Professional development'
        },
        {
          name: 'Innovation Gateway',
          path: '/partnership-innovation-gateway',
          icon: 'Lightbulb',
          description: 'Partnership opportunities'
        }
      ]
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
      setIsLanguageOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleDropdownToggle = (e, category) => {
    e?.stopPropagation();
    setActiveDropdown(activeDropdown === category ? null : category);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownKeyDown = (e, categoryKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveDropdown(activeDropdown === categoryKey ? null : categoryKey);
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
    }
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setIsLanguageOpen(false);
    try {
      localStorage.setItem('nara-lang', value);
      window.dispatchEvent(new CustomEvent('languageChange', { detail: value }));
    } catch {}
  };

  // Check if any path in category is active
  const isCategoryActive = (categoryItems) => {
    return categoryItems?.some(item => isActivePath(item?.path));
  };

  return (
    <>
      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-slate-200' 
            : 'bg-white border-slate-100'
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Utility Top Bar */}
          <div className="hidden md:flex items-center justify-between text-xs text-slate-600 px-4 lg:px-6 h-9 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <a href="mailto:info@nara.gov.lk" className="inline-flex items-center hover:text-slate-900">
                <Icon name="Mail" size={14} className="mr-1" /> info@nara.gov.lk
              </a>
              <a href="tel:+94112345678" className="inline-flex items-center hover:text-slate-900">
                <Icon name="Phone" size={14} className="mr-1" /> +94 11 234 5678
              </a>
              <Link to="/emergency-response-network" className="inline-flex items-center text-red-600 hover:text-red-700">
                <Icon name="AlertTriangle" size={14} className="mr-1" /> Emergency
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="px-2 py-1 rounded-md hover:bg-slate-100 inline-flex items-center"
                aria-label="Toggle theme"
                title={`Theme: ${theme}`}
              >
                <Icon name={theme === 'dark' ? 'Moon' : theme === 'glow' ? 'Sparkles' : 'Sun'} size={14} className="mr-1" />
                <span className="capitalize hidden sm:inline">{theme}</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between h-16 px-3 lg:px-4">
            {/* Back + Logo Section */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/'); }}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center"
                aria-label={t('goBack')}
                title={t('back')}
              >
                <Icon name="ArrowLeft" size={16} className="mr-1" />
                <span className="hidden sm:inline text-sm">{t('back')}</span>
              </button>

              <Link
                to="/"
                className="flex items-center space-x-2 group"
                onClick={handleLinkClick}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shadow-md">
                    <img src="/assets/nara-logo.png" alt="NARA logo" className="w-10 h-10 object-contain" />
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-lg font-bold text-slate-900 leading-tight">
                    NARA Digital
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Ocean Intelligence
                  </div>
                </div>
              </Link>

              {/* Language Selector - Moved here, always visible */}
              <div className="relative ml-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLanguageOpen(!isLanguageOpen);
                  }}
                  className="px-2 py-1.5 rounded-md hover:bg-slate-100 inline-flex items-center transition-colors border border-slate-200"
                  aria-label="Select language"
                  aria-expanded={isLanguageOpen}
                >
                  <Icon name="Globe" size={14} className="mr-1" />
                  <span className="uppercase font-medium text-xs">{language}</span>
                  <Icon name="ChevronDown" size={10} className={`ml-1 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Language Dropdown */}
                {isLanguageOpen && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                          language === lang.code ? 'bg-cyan-50 text-cyan-700' : 'text-slate-700'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className={`font-medium text-sm ${
                          lang.code === 'ta' ? 'font-tamil' :
                          lang.code === 'si' ? 'font-sinhala' :
                          ''
                        }`}>{lang.name}</span>
                        {language === lang.code && (
                          <Icon name="Check" size={14} className="ml-auto text-cyan-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation - Always visible */}
            <nav className="flex items-center space-x-0.5">
              {Object.entries(navigationData)?.map(([categoryKey, category]) => (
                <div key={categoryKey} className="relative">
                  <button
                    onClick={(e) => handleDropdownToggle(e, categoryKey)}
                    onKeyDown={(e) => handleDropdownKeyDown(e, categoryKey)}
                    className={`flex items-center space-x-1 px-2 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                      isCategoryActive(category?.items) || activeDropdown === categoryKey
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={activeDropdown === categoryKey}
                    aria-controls={`menu-${categoryKey}`}
                  >
                    <span className="whitespace-nowrap">{category?.title}</span>
                    <Icon
                      name="ChevronDown"
                      size={12} 
                      className={`transition-transform duration-200 ${
                        activeDropdown === categoryKey ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === categoryKey && (
                    <div id={`menu-${categoryKey}`} role="menu" className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30">
                      <div className="p-2">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <h3 className="font-semibold text-slate-900 text-sm">{category?.title}</h3>
                        </div>
                        <div className="py-2 space-y-1">
                          {category?.items?.map((item) => (
                            <Link
                              key={item?.path}
                              to={item?.path}
                              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                                isActivePath(item?.path)
                                  ? 'bg-blue-50 text-blue-700' :'text-slate-700 hover:bg-slate-50'
                              }`}
                              onClick={handleLinkClick}
                              role="menuitem"
                            >
                              <div className={`p-2 rounded-lg ${
                                isActivePath(item?.path) ? 'bg-blue-100' : 'bg-slate-100'
                              }`}>
                                <Icon 
                                  name={item?.icon} 
                                  size={18} 
                                  className={isActivePath(item?.path) ? 'text-blue-600' : 'text-slate-600'}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{item?.name}</div>
                                <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {item?.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Icon name="Search" size={18} className="mr-2" />
                Search
              </Button>

              <Link to="/digital-product-library">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Icon name="User" size={16} className="mr-2" />
                  My Account
                </Button>
              </Link>
              
              <Button
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Icon name="Users" size={16} className="mr-2" />
                Collaborate
              </Button>

              {/* Emergency Alert Indicator */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  <Icon name="AlertTriangle" size={18} />
                </Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={handleMenuToggle}
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-slate-200">
              <div className="px-4 py-6 max-h-screen overflow-y-auto">
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Navigation Categories */}
                {Object.entries(navigationData)?.map(([categoryKey, category]) => (
                  <div key={categoryKey} className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider px-3 py-2 border-b border-slate-100">
                      {category?.title}
                    </h3>
                    <div className="space-y-2 mt-3">
                      {category?.items?.map((item) => (
                        <Link
                          key={item?.path}
                          to={item?.path}
                          className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
                            isActivePath(item?.path)
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' :'text-slate-700 hover:bg-slate-50'
                          }`}
                          onClick={handleLinkClick}
                        >
                          <div className={`p-2 rounded-lg ${
                            isActivePath(item?.path) ? 'bg-blue-100' : 'bg-slate-100'
                          }`}>
                            <Icon 
                              name={item?.icon} 
                              size={20} 
                              className={isActivePath(item?.path) ? 'text-blue-600' : 'text-slate-600'}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item?.name}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {item?.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Mobile Action Buttons */}
                <div className="border-t border-slate-200 pt-6 space-y-3">
                  <Link to="/digital-product-library">
                    <Button
                      variant="outline"
                      fullWidth
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Icon name="User" size={18} className="mr-2" />
                      My Account & Library
                    </Button>
                  </Link>
                  
                  <Button
                    variant="default"
                    fullWidth
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Icon name="Users" size={18} className="mr-2" />
                    Start Collaboration
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    <Icon name="AlertTriangle" size={18} className="mr-2" />
                    Emergency Alerts
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Full-screen Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div
            className="max-w-2xl mx-auto mt-24 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-slate-200">
                <Icon name="Search" size={18} className="text-slate-400 mr-2" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                  placeholder="Search NARA Digital..."
                  className="flex-1 outline-none py-2 text-slate-900 placeholder:text-slate-400"
                  aria-label="Search input"
                />
                <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(false)} aria-label="Close search">
                  <Icon name="X" size={18} />
                </Button>
              </div>
              <div className="px-4 py-3 bg-slate-50 text-xs text-slate-600">
                Tip: Press Esc to close
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
