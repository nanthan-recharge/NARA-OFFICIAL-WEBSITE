import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
import Button from './Button';

const ProfessionalHeader = ({ className = '' }) => {
  const { t } = useTranslation('accessibility');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'normal');
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Professional navigation structure for government research institute
  const navigationData = {
    about: {
      title: 'About NARA',
      icon: 'Info',
      items: [
        {
          name: 'Our Story',
          path: '/about-nara-our-story',
          icon: 'BookText',
          description: 'Mission, vision & achievements'
        }
      ]
    },
    contact: {
      title: 'Contact Us',
      icon: 'Mail',
      items: [
        {
          name: 'Procurement & Recruitment',
          path: '/procurement-recruitment-portal',
          icon: 'Briefcase',
          description: 'Tenders & career opportunities'
        },
        {
          name: 'News & Updates',
          path: '/nara-news-updates-center',
          icon: 'Newspaper',
          description: 'Latest announcements & press releases'
        },
        {
          name: 'Get In Touch',
          path: '/contact-us',
          icon: 'Phone',
          description: 'Contact information & form'
        }
      ]
    },
    research: {
      title: 'Research & Intelligence',
      icon: 'FlaskConical',
      items: [
        {
          name: 'Ocean Intelligence Dashboard',
          path: '/',
          icon: 'Waves',
          description: 'Real-time ocean monitoring & analytics',
          badge: 'LIVE'
        },
        {
          name: 'Research Excellence Portal',
          path: '/research-excellence-portal',
          icon: 'Award',
          description: 'Scientific research & publications'
        },
        {
          name: 'Knowledge Discovery Center',
          path: '/knowledge-discovery-center',
          icon: 'BookOpen',
          description: 'Educational resources & archives'
        },
        {
          name: 'Research Collaboration Platform',
          path: '/research-collaboration-platform',
          icon: 'Users',
          description: 'Partner with research teams'
        }
      ]
    },
    services: {
      title: 'Services & Operations',
      icon: 'Briefcase',
      items: [
        {
          name: 'Maritime Services Hub',
          path: '/maritime-services-hub',
          icon: 'Ship',
          description: 'Vessel tracking & maritime operations'
        },
        {
          name: 'Government Services Portal',
          path: '/government-services-portal',
          icon: 'Building2',
          description: 'Official permits & licensing',
          badge: 'GOV'
        },
        {
          name: 'Emergency Response Network',
          path: '/emergency-response-network',
          icon: 'AlertTriangle',
          description: '24/7 emergency coordination',
          badge: 'URGENT'
        }
        // Integration Systems moved to admin panel
      ]
    },
    education: {
      title: 'Education & Training',
      icon: 'GraduationCap',
      items: [
        {
          name: 'Learning Development Academy',
          path: '/learning-development-academy',
          icon: 'BookOpenCheck',
          description: 'Professional certification programs'
        },
        {
          name: 'Partnership Innovation Gateway',
          path: '/partnership-innovation-gateway',
          icon: 'Lightbulb',
          description: 'Industry collaboration opportunities'
        }
      ]
    },
    commerce: {
      title: 'Digital Commerce',
      icon: 'ShoppingBag',
      items: [
        {
          name: 'NARA Digital Marketplace',
          path: '/nara-digital-marketplace',
          icon: 'ShoppingCart',
          description: 'Research publications & data products'
        },
        {
          name: 'Digital Product Library',
          path: '/digital-product-library',
          icon: 'BookMarked',
          description: 'Your purchased resources'
        },
        {
          name: 'Payment Gateway Hub',
          path: '/payment-gateway-hub',
          icon: 'CreditCard',
          description: 'Secure payment processing'
        }
      ]
    },
    regional: {
      title: 'Regional Impact',
      icon: 'MapPin',
      items: [
        {
          name: 'Regional Impact Network',
          path: '/regional-impact-network',
          icon: 'Globe',
          description: 'Community engagement initiatives'
        }
      ]
    }
  };

  // Theme configurations
  const themeConfig = {
    normal: {
      header: 'bg-white border-slate-200',
      headerScrolled: 'bg-white/95 backdrop-blur-md shadow-lg',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
      dropdown: 'bg-white',
      dropdownHover: 'hover:bg-slate-50',
      activeNav: 'bg-blue-50 text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      emergency: 'bg-red-600 text-white'
    },
    dark: {
      header: 'bg-slate-900 border-slate-700',
      headerScrolled: 'bg-slate-900/95 backdrop-blur-md shadow-xl shadow-slate-900/50',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      dropdown: 'bg-slate-800',
      dropdownHover: 'hover:bg-slate-700',
      activeNav: 'bg-blue-900 text-blue-300',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
      emergency: 'bg-red-700 text-white'
    },
    glow: {
      header: 'bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 border-purple-500',
      headerScrolled: 'bg-gradient-to-r from-blue-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-md shadow-2xl shadow-purple-500/30',
      text: 'text-white',
      textSecondary: 'text-purple-200',
      dropdown: 'bg-gradient-to-br from-purple-900 to-blue-900',
      dropdownHover: 'hover:bg-gradient-to-br hover:from-purple-800 hover:to-blue-800',
      activeNav: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/50',
      button: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/50',
      emergency: 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse'
    }
  };

  const currentTheme = themeConfig[theme];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const isActivePath = (path) => location?.pathname === path;

  const isCategoryActive = (categoryItems) => {
    return categoryItems?.some(item => isActivePath(item?.path));
  };

  const cycleTheme = () => {
    const themes = ['normal', 'dark', 'glow'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <>
      {/* Emergency Alert Banner */}
      {showEmergencyAlert && (
        <div className={`${currentTheme.emergency} px-4 py-2`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="animate-pulse" />
              <span className="text-sm font-medium">
                WEATHER ADVISORY: High waves expected in Western coastal areas. Fishermen advised to avoid deep sea activities.
              </span>
            </div>
            <button
              onClick={() => setShowEmergencyAlert(false)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Government Banner */}
      <div className="bg-gradient-to-r from-green-700 via-yellow-600 to-orange-700 h-1"></div>
      
      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? currentTheme.headerScrolled : currentTheme.header
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-20 px-4 lg:px-6">
            {/* Back + Logo Section - Government Branding */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/'); }}
                className={`px-3 py-2 rounded-lg border ${theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : theme === 'glow' ? 'border-purple-500/30 text-white hover:bg-white/10' : 'border-slate-200 text-slate-700 hover:bg-slate-100'} inline-flex items-center`}
                aria-label="Go back"
                title="Back"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <Link 
                to="/" 
                className="flex items-center space-x-4 group"
              >
                {/* NARA Logo */}
                <div className="relative">
                  <div className={`w-16 h-16 rounded-xl overflow-hidden ${theme === 'glow' ? 'bg-white/10 border border-purple-500/30' : theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'} flex items-center justify-center shadow-lg`}>
                    <img src="/assets/nara-logo.png" alt="NARA logo" className="w-14 h-14 object-contain" />
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${currentTheme.textSecondary} font-medium`}>
                    Government of Sri Lanka
                  </div>
                  <div className={`text-xl font-bold ${currentTheme.text} leading-tight`}>
                    NARA Digital Ocean
                  </div>
                  <div className={`text-xs ${currentTheme.textSecondary}`}>
                    National Aquatic Resources Research & Development Agency
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {Object.entries(navigationData)?.map(([categoryKey, category]) => (
                <div 
                  key={categoryKey} 
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(categoryKey)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isCategoryActive(category?.items) || activeDropdown === categoryKey
                        ? currentTheme.activeNav
                        : `${currentTheme.textSecondary} ${currentTheme.dropdownHover}`
                    }`}
                  >
                    <Icon name={category?.icon} size={16} />
                    <span>{category?.title}</span>
                    <Icon 
                      name="ChevronDown" 
                      size={12} 
                      className={`transition-transform duration-200 ml-1 ${
                        activeDropdown === categoryKey ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === categoryKey && (
                    <div 
                      className={`absolute top-full left-0 mt-1 w-80 ${currentTheme.dropdown} rounded-xl shadow-2xl border ${theme === 'dark' ? 'border-slate-700' : theme === 'glow' ? 'border-purple-500/30' : 'border-slate-200'} overflow-hidden z-50 animate-fadeIn`}
                    >
                      <div className="p-2">
                        <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-slate-700' : theme === 'glow' ? 'border-purple-500/30' : 'border-slate-100'}`}>
                          <h3 className={`font-semibold ${currentTheme.text} text-sm uppercase tracking-wider`}>
                            {category?.title}
                          </h3>
                        </div>
                        <div className="py-2 space-y-1">
                          {category?.items?.map((item) => (
                            <Link
                              key={item?.path}
                              to={item?.path}
                              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                                isActivePath(item?.path)
                                  ? currentTheme.activeNav
                                  : `${currentTheme.text} ${currentTheme.dropdownHover}`
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${
                                isActivePath(item?.path) 
                                  ? theme === 'glow' ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20' : 'bg-blue-100 dark:bg-blue-900'
                                  : theme === 'glow' ? 'bg-purple-800/30' : 'bg-slate-100 dark:bg-slate-700'
                              }`}>
                                <Icon 
                                  name={item?.icon} 
                                  size={18} 
                                  className={isActivePath(item?.path) ? 'text-blue-600 dark:text-blue-300' : ''}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">{item?.name}</span>
                                  {item?.badge && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      item.badge === 'LIVE' ? 'bg-green-500 text-white animate-pulse' :
                                      item.badge === 'GOV' ? 'bg-blue-500 text-white' :
                                      item.badge === 'URGENT' ? 'bg-red-500 text-white animate-pulse' :
                                      'bg-gray-500 text-white'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <div className={`text-xs ${currentTheme.textSecondary} mt-1 line-clamp-2`}>
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

            {/* Action Buttons & Tools */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Search */}
              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-48 px-4 py-2 rounded-lg border ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' :
                    theme === 'glow' ? 'bg-purple-900/30 border-purple-500/30 text-white placeholder-purple-300' :
                    'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Icon name="Search" size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              </div>

              {/* Language Selector */}
              <select 
                className={`hidden lg:block px-3 py-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' :
                  theme === 'glow' ? 'bg-purple-900/30 border-purple-500/30 text-white' :
                  'bg-white border-slate-200 text-slate-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="en">English</option>
                <option value="si" className="font-sinhala">සිංහල</option>
                <option value="ta" className="font-tamil">தமிழ்</option>
              </select>

              {/* Theme Switcher */}
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleTheme}
                className={currentTheme.text}
                title={`Current theme: ${theme}. Click to switch.`}
              >
                {theme === 'normal' && <Icon name="Sun" size={18} />}
                {theme === 'dark' && <Icon name="Moon" size={18} />}
                {theme === 'glow' && <Icon name="Sparkles" size={18} />}
              </Button>

              {/* Admin Portal */}
              <Link to="/firebase-admin-authentication-portal">
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30`}
                >
                  <Icon name="Shield" size={16} className="mr-2" />
                  Admin Portal
                </Button>
              </Link>

              {/* Register */}
              <Link to="/register">
                <Button
                  variant="outline"
                  size="sm"
                  className={`${currentTheme.text} border-current hover:bg-opacity-10`}
                >
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Register
                </Button>
              </Link>

              {/* Sign In */}
              <Link to="/library-login">
                <Button
                  variant="default"
                  size="sm"
                  className={currentTheme.button}
                >
                  <Icon name="User" size={16} className="mr-2" />
                  Sign In
                </Button>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={currentTheme.text}
                >
                  <Icon name="Bell" size={18} />
                </Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 lg:hidden">
              {/* Theme Switcher Mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleTheme}
                className={currentTheme.text}
              >
                {theme === 'normal' && <Icon name="Sun" size={18} />}
                {theme === 'dark' && <Icon name="Moon" size={18} />}
                {theme === 'glow' && <Icon name="Sparkles" size={18} />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={currentTheme.text}
              >
                <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className={`lg:hidden ${currentTheme.dropdown} border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="px-4 py-6 max-h-screen overflow-y-auto">
                {/* Mobile Search */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' :
                      theme === 'glow' ? 'bg-purple-900/30 border-purple-500/30 text-white placeholder-purple-300' :
                      'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Mobile Navigation Categories */}
                {Object.entries(navigationData)?.map(([categoryKey, category]) => (
                  <div key={categoryKey} className="mb-6">
                    <h3 className={`text-sm font-semibold ${currentTheme.text} uppercase tracking-wider px-3 py-2 border-b ${
                      theme === 'dark' ? 'border-slate-700' : theme === 'glow' ? 'border-purple-500/30' : 'border-slate-100'
                    }`}>
                      <Icon name={category?.icon} size={16} className="inline mr-2" />
                      {category?.title}
                    </h3>
                    <div className="space-y-2 mt-3">
                      {category?.items?.map((item) => (
                        <Link
                          key={item?.path}
                          to={item?.path}
                          className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
                            isActivePath(item?.path)
                              ? currentTheme.activeNav
                              : `${currentTheme.text} ${currentTheme.dropdownHover}`
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className={`p-2 rounded-lg ${
                            isActivePath(item?.path) 
                              ? theme === 'glow' ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20' : 'bg-blue-100 dark:bg-blue-900'
                              : theme === 'glow' ? 'bg-purple-800/30' : 'bg-slate-100 dark:bg-slate-700'
                          }`}>
                            <Icon name={item?.icon} size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{item?.name}</span>
                              {item?.badge && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.badge === 'LIVE' ? 'bg-green-500 text-white animate-pulse' :
                                  item.badge === 'GOV' ? 'bg-blue-500 text-white' :
                                  item.badge === 'URGENT' ? 'bg-red-500 text-white animate-pulse' :
                                  'bg-gray-500 text-white'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                              {item?.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Mobile Action Buttons */}
                <div className={`border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} pt-6 space-y-3`}>
                  <select 
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' :
                      theme === 'glow' ? 'bg-purple-900/30 border-purple-500/30 text-white' :
                      'bg-white border-slate-200 text-slate-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="en">English</option>
                    <option value="si" className="font-sinhala">සිංහල</option>
                    <option value="ta" className="font-tamil">தමிழ்</option>
                  </select>

                  <Link to="/firebase-admin-authentication-portal">
                    <Button
                      variant="outline"
                      fullWidth
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Icon name="Shield" size={18} className="mr-2" />
                      Admin Portal
                    </Button>
                  </Link>
                  
                  <Link to="/register">
                    <Button
                      variant="outline"
                      fullWidth
                      className={`${currentTheme.text} border-current`}
                    >
                      <Icon name="UserPlus" size={18} className="mr-2" />
                      Register Account
                    </Button>
                  </Link>
                  
                  <Link to="/library-login">
                    <Button
                      variant="default"
                      fullWidth
                      className={currentTheme.button}
                    >
                      <Icon name="User" size={18} className="mr-2" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Accessibility Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded">
        {t('skipToMain')}
      </a>
    </>
  );
};

export default ProfessionalHeader;