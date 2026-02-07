import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ChevronLeft,
  Globe,
  Menu,
  X,
  Building2,
  Target,
  Briefcase,
  FolderKanban,
  Users,
  TrendingUp,
  MessageSquare,
  FlaskConical,
  Info,
  ArrowRight
} from 'lucide-react';

/**
 * Division-Specific Navbar
 * A specialized navigation bar for individual division pages
 * Different from the main GovernmentNavbar to provide division-focused navigation
 */
const DivisionNavbar = ({
  divisionName,
  divisionIcon: DivisionIcon,
  divisionGradient = 'from-blue-600 to-cyan-600',
  activeSection,
  onSectionChange,
  sections = []
}) => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const currentLang = i18n.language;

  // Track scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Language switcher
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' }
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  // Default sections for division pages
  const defaultSections = [
    { id: 'overview', label: { en: 'Overview', si: 'දළ විශ්ලේෂණය', ta: 'கண்ணோட்டம்' }, icon: Info },
    { id: 'focus', label: { en: 'Focus Areas', si: 'අවධාන ක්ෂේත්‍ර', ta: 'கவன பகுதிகள்' }, icon: Target },
    { id: 'services', label: { en: 'Services', si: 'සේවා', ta: 'சேவைகள்' }, icon: Briefcase },
    { id: 'projects', label: { en: 'Projects', si: 'ව්‍යාපෘති', ta: 'திட்டங்கள்' }, icon: FolderKanban },
    { id: 'research', label: { en: 'Research', si: 'පර්යේෂණ', ta: 'ஆராய்ச்சி' }, icon: FlaskConical },
    { id: 'team', label: { en: 'Our Team', si: 'අපගේ කණ්ඩායම', ta: 'எங்கள் குழு' }, icon: Users },
    { id: 'impact', label: { en: 'Impact', si: 'බලපෑම', ta: 'தாக்கம்' }, icon: TrendingUp },
    { id: 'contact', label: { en: 'Contact', si: 'අමතන්න', ta: 'தொடர்பு' }, icon: MessageSquare }
  ];

  const navSections = sections.length > 0 ? sections : defaultSections;

  return (
    <>
      {/* Main Division Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200'
            : 'bg-white/80 backdrop-blur-md'
        }`}
        role="navigation"
        aria-label="Division navigation"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back to Home & Division Name */}
            <div className="flex items-center gap-4">
              {/* Home Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 transition-all"
                aria-label="Go to home page"
              >
                <Home size={18} />
                <span className="hidden sm:inline text-sm font-medium">Home</span>
              </motion.button>

              {/* Back to Divisions */}
              <motion.button
                whileHover={{ x: -3 }}
                onClick={() => navigate('/divisions')}
                className="flex items-center gap-1 text-navy-700 hover:text-navy-900 transition-all"
                aria-label="Back to all divisions"
              >
                <ChevronLeft size={18} />
                <span className="text-sm font-medium hidden md:inline">All Divisions</span>
              </motion.button>

              {/* Division Name */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                {DivisionIcon && <DivisionIcon size={18} className="text-navy-600" />}
                <span className="text-sm font-semibold text-navy-800 truncate max-w-[200px]">
                  {divisionName}
                </span>
              </div>
            </div>

            {/* Center: Section Navigation (Desktop) */}
            <div className="hidden xl:flex items-center gap-1">
              {navSections.slice(0, 6).map((section) => {
                const IconComponent = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => onSectionChange?.(section.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${divisionGradient} text-white shadow-md`
                        : 'text-gray-600 hover:text-navy-700 hover:bg-gray-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent size={14} />
                    <span>{section.label[currentLang] || section.label.en}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Language & Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                  aria-label="Change language"
                >
                  <Globe size={18} />
                  <span className="text-sm font-medium hidden sm:inline">
                    {languages.find(l => l.code === currentLang)?.label || 'English'}
                  </span>
                </button>

                {/* Language Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        currentLang === lang.code ? 'bg-navy-50 text-navy-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-white border-t border-gray-200 shadow-lg"
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                {/* Division Name (Mobile) */}
                <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl mb-4">
                  {DivisionIcon && <DivisionIcon size={24} className="text-navy-600" />}
                  <div>
                    <span className="text-xs text-gray-500 block">Current Division</span>
                    <span className="font-semibold text-navy-800">{divisionName}</span>
                  </div>
                </div>

                {/* Section Navigation (Mobile) */}
                <div className="space-y-1">
                  {navSections.map((section) => {
                    const IconComponent = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          onSectionChange?.(section.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          isActive
                            ? `bg-gradient-to-r ${divisionGradient} text-white shadow-md`
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent size={20} />
                        <span className="font-medium">{section.label[currentLang] || section.label.en}</span>
                        {isActive && <ArrowRight size={16} className="ml-auto" />}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Links */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      navigate('/divisions');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-navy-700 hover:bg-navy-50 transition-all"
                  >
                    <Building2 size={20} />
                    <span className="font-medium">View All Divisions</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default DivisionNavbar;
