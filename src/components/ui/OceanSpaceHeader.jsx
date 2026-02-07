import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

const OceanSpaceHeader = () => {
  const { t } = useTranslation('errors');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();

  // NASA-inspired navigation structure with oceanic themes
  const navigationMenu = [
    {
      title: 'About',
      icon: Icons.Info,
      submenu: [
        { name: 'Our Story', path: '/about-nara-our-story', icon: Icons.History }
      ]
    },
    {
      title: 'Contact Us',
      icon: Icons.Mail,
      submenu: [
        { name: 'Careers', path: '/procurement-recruitment-portal', icon: Icons.Briefcase },
        { name: 'News & Updates', path: '/nara-news-updates-center', icon: Icons.Newspaper },
        { name: 'Get In Touch', path: '/contact-us', icon: Icons.Phone }
      ]
    },
    {
      title: 'Research',
      icon: Icons.Waves,
      submenu: [
        { name: 'Ocean Intelligence', path: '/', icon: Icons.Activity, status: 'LIVE' },
        { name: 'Research Excellence', path: '/research-excellence-portal', icon: Icons.Microscope },
        { name: 'Knowledge Discovery', path: '/knowledge-discovery-center', icon: Icons.BookOpen },
        { name: 'Collaboration Platform', path: '/research-collaboration-platform', icon: Icons.Users }
      ]
    },
    {
      title: 'Services',
      icon: Icons.Anchor,
      submenu: [
        { name: 'Maritime Services', path: '/maritime-services-hub', icon: Icons.Ship },
        { name: 'Government Portal', path: '/government-services-portal', icon: Icons.Building2, status: 'GOV' },
        { name: 'Emergency Network', path: '/emergency-response-network', icon: Icons.AlertCircle, status: 'ALERT' }
        // Systems Integration moved to admin panel
      ]
    },
    {
      title: 'Education',
      icon: Icons.GraduationCap,
      submenu: [
        { name: 'Learning Academy', path: '/learning-development-academy', icon: Icons.School },
        { name: 'Innovation Gateway', path: '/partnership-innovation-gateway', icon: Icons.Lightbulb }
      ]
    },
    {
      title: 'Digital Commerce',
      icon: Icons.Globe2,
      submenu: [
        { name: 'Digital Marketplace', path: '/nara-digital-marketplace', icon: Icons.ShoppingBag },
        { name: 'Product Library', path: '/digital-product-library', icon: Icons.Database },
        { name: 'Payment Gateway', path: '/payment-gateway-hub', icon: Icons.CreditCard }
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* NASA-style top bar with mission status */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
              SYSTEMS OPERATIONAL
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">LAT: 6.9271° N, LON: 79.8612° E</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">{currentTime.toLocaleTimeString()} IST</span>
            <span className="flex items-center">
              <Icons.Wifi className="w-3 h-3 mr-1" />
              CONNECTED
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header with Glassmorphism */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-2xl border-b border-white/20' 
            : 'backdrop-blur-md bg-gradient-to-b from-white/90 to-white/60 dark:from-slate-900/90 dark:to-slate-900/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Back + Logo Section - NASA meets Ocean */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/'); }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 inline-flex items-center"
                aria-label={t('goBack')}
                title={t('back')}
              >
                <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t('back')}</span>
              </button>

              <Link to="/" className="flex items-center space-x-4 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                {/* Logo image */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-2 shadow-xl border border-white/30">
                  <img src="/assets/nara-logo.png" alt="NARA logo" className="w-10 h-10 object-contain" />
                </div>
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent tracking-tight"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  NARA
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 tracking-wider uppercase">
                  Ocean Research Institute
                </span>
              </div>
              </Link>
            </div>

            {/* Desktop Navigation - NASA-style horizontal menu */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationMenu.map((menu, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(index)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <motion.button
                    whileHover={{ y: -2 }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      activeMenu === index 
                        ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-cyan-400' 
                        : 'text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-cyan-400'
                    }`}
                  >
                    <menu.icon className="w-4 h-4" />
                    <span className="font-medium text-sm tracking-wide">{menu.title}</span>
                    <Icons.ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                      activeMenu === index ? 'rotate-180' : ''
                    }`} />
                  </motion.button>

                  {/* Dropdown Menu with Glassmorphism */}
                  <AnimatePresence>
                    {activeMenu === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-72 py-2"
                      >
                        <div className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                          {menu.submenu.map((item, subIndex) => (
                            <Link
                              key={subIndex}
                              to={item.path}
                              className={`flex items-center space-x-3 px-4 py-3 transition-all duration-300 ${
                                isActive(item.path)
                                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-cyan-400'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 hover:text-blue-700 dark:hover:text-cyan-400'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${
                                isActive(item.path) 
                                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">{item.name}</span>
                                  {item.status && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                      item.status === 'LIVE' ? 'bg-green-500 text-white animate-pulse' :
                                      item.status === 'GOV' ? 'bg-blue-600 text-white' :
                                      item.status === 'ALERT' ? 'bg-red-500 text-white animate-pulse' :
                                      'bg-gray-500 text-white'
                                    }`}>
                                      {item.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Icons.ArrowRight className="w-4 h-4 opacity-50" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-3">
              {/* Search with NASA-style input */}
              <div className="hidden lg:block relative">
                <input
                  type="text"
                  placeholder="Search ocean data..."
                  className="w-48 px-4 py-2 pl-10 rounded-xl backdrop-blur-md bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                />
                <Icons.Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>

              {/* Mission Control Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Icons.Terminal className="w-4 h-4" />
                <span className="text-sm font-medium">Mission Control</span>
              </motion.button>

              {/* Language Selector */}
              <div className="hidden lg:block">
                <select className="px-3 py-2 rounded-xl backdrop-blur-md bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-sm focus:outline-none">
                  <option value="en">EN</option>
                  <option value="si">සි</option>
                  <option value="ta">த</option>
                </select>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl backdrop-blur-md bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
              >
                {mobileMenuOpen ? (
                  <Icons.X className="w-5 h-5" />
                ) : (
                  <Icons.Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="py-4 space-y-2">
                  {navigationMenu.map((menu, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white">
                        <menu.icon className="w-4 h-4" />
                        <span>{menu.title}</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {menu.submenu.map((item, subIndex) => (
                          <Link
                            key={subIndex}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                              isActive(item.path)
                                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-cyan-400'
                                : 'text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-cyan-400'
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                            {item.status && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                item.status === 'LIVE' ? 'bg-green-500 text-white' :
                                item.status === 'GOV' ? 'bg-blue-600 text-white' :
                                item.status === 'ALERT' ? 'bg-red-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}>
                                {item.status}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Mobile Actions */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl">
                      <Icons.Terminal className="w-4 h-4" />
                      <span className="text-sm font-medium">Mission Control</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Emergency Alert Bar */}
      <AnimatePresence>
        {true && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icons.AlertTriangle className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">
                  WEATHER ADVISORY: High waves expected in Western coastal areas today
                </span>
              </div>
              <button className="p-1 hover:bg-white/20 rounded transition-colors">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OceanSpaceHeader;