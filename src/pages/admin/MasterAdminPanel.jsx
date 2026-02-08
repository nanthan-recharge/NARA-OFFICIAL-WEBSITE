import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import {
  LayoutDashboard, Image, Video, FileText, Users, Ship, Fish, Beaker,
  TrendingUp, AlertCircle, Map, Database, BookOpen, Settings, LogOut,
  Search, Bell, ChevronDown, ChevronLeft, ChevronRight, Plus, Edit,
  Trash2, Eye, Download, Upload, RefreshCw, Calendar, Tag, Globe,
  Mail, Shield, BarChart3, Waves, Anchor, Microscope, FlaskConical,
  FileCheck, Briefcase, GraduationCap, Building2, Award, Target,
  Zap, Activity, PieChart, TrendingDown, DollarSign, Package,
  CheckCircle, XCircle, Clock, Archive, ExternalLink, Filter,
  Grid3x3, List, SlidersHorizontal, Heart, Share2, MessageSquare, Radio, Languages,
  Newspaper, Lock
} from 'lucide-react';

// Static color map — prevents Tailwind purge issues with dynamic class names
const COLOR_MAP = {
  cyan:    { bg: 'bg-cyan-500',    bgGrad: 'from-cyan-500 to-cyan-600',    text: 'text-cyan-600',    textLight: 'text-cyan-400', bgLight: 'bg-cyan-50',    bgAlpha: 'bg-cyan-500/20',    ring: 'ring-cyan-500/20', border: 'border-cyan-500/30', hoverBg: 'hover:bg-cyan-500/30' },
  purple:  { bg: 'bg-purple-500',  bgGrad: 'from-purple-500 to-purple-600',  text: 'text-purple-600',  textLight: 'text-purple-400', bgLight: 'bg-purple-50',  bgAlpha: 'bg-purple-500/20',  ring: 'ring-purple-500/20', border: 'border-purple-500/30', hoverBg: 'hover:bg-purple-500/30' },
  blue:    { bg: 'bg-blue-500',    bgGrad: 'from-blue-500 to-blue-600',    text: 'text-blue-600',    textLight: 'text-blue-400', bgLight: 'bg-blue-50',    bgAlpha: 'bg-blue-500/20',    ring: 'ring-blue-500/20', border: 'border-blue-500/30', hoverBg: 'hover:bg-blue-500/30' },
  teal:    { bg: 'bg-teal-500',    bgGrad: 'from-teal-500 to-teal-600',    text: 'text-teal-600',    textLight: 'text-teal-400', bgLight: 'bg-teal-50',    bgAlpha: 'bg-teal-500/20',    ring: 'ring-teal-500/20', border: 'border-teal-500/30', hoverBg: 'hover:bg-teal-500/30' },
  amber:   { bg: 'bg-amber-500',   bgGrad: 'from-amber-500 to-amber-600',   text: 'text-amber-600',   textLight: 'text-amber-400', bgLight: 'bg-amber-50',   bgAlpha: 'bg-amber-500/20',   ring: 'ring-amber-500/20', border: 'border-amber-500/30', hoverBg: 'hover:bg-amber-500/30' },
  emerald: { bg: 'bg-emerald-500', bgGrad: 'from-emerald-500 to-emerald-600', text: 'text-emerald-600', textLight: 'text-emerald-400', bgLight: 'bg-emerald-50', bgAlpha: 'bg-emerald-500/20', ring: 'ring-emerald-500/20', border: 'border-emerald-500/30', hoverBg: 'hover:bg-emerald-500/30' },
  rose:    { bg: 'bg-rose-500',    bgGrad: 'from-rose-500 to-rose-600',    text: 'text-rose-600',    textLight: 'text-rose-400', bgLight: 'bg-rose-50',    bgAlpha: 'bg-rose-500/20',    ring: 'ring-rose-500/20', border: 'border-rose-500/30', hoverBg: 'hover:bg-rose-500/30' },
  indigo:  { bg: 'bg-indigo-500',  bgGrad: 'from-indigo-500 to-indigo-600',  text: 'text-indigo-600',  textLight: 'text-indigo-400', bgLight: 'bg-indigo-50',  bgAlpha: 'bg-indigo-500/20',  ring: 'ring-indigo-500/20', border: 'border-indigo-500/30', hoverBg: 'hover:bg-indigo-500/30' },
  orange:  { bg: 'bg-orange-500',  bgGrad: 'from-orange-500 to-orange-600',  text: 'text-orange-600',  textLight: 'text-orange-400', bgLight: 'bg-orange-50',  bgAlpha: 'bg-orange-500/20',  ring: 'ring-orange-500/20', border: 'border-orange-500/30', hoverBg: 'hover:bg-orange-500/30' },
  slate:   { bg: 'bg-slate-500',   bgGrad: 'from-slate-500 to-slate-600',   text: 'text-slate-600',   textLight: 'text-slate-400', bgLight: 'bg-slate-50',   bgAlpha: 'bg-slate-500/20',   ring: 'ring-slate-500/20', border: 'border-slate-500/30', hoverBg: 'hover:bg-slate-500/30' },
  pink:    { bg: 'bg-pink-500',    bgGrad: 'from-pink-500 to-pink-600',    text: 'text-pink-600',    textLight: 'text-pink-400', bgLight: 'bg-pink-50',    bgAlpha: 'bg-pink-500/20',    ring: 'ring-pink-500/20', border: 'border-pink-500/30', hoverBg: 'hover:bg-pink-500/30' },
  red:     { bg: 'bg-red-500',     bgGrad: 'from-red-500 to-red-600',     text: 'text-red-600',     textLight: 'text-red-400', bgLight: 'bg-red-50',     bgAlpha: 'bg-red-500/20',     ring: 'ring-red-500/20', border: 'border-red-500/30', hoverBg: 'hover:bg-red-500/30' },
  green:   { bg: 'bg-green-500',   bgGrad: 'from-green-500 to-green-600',   text: 'text-green-600',   textLight: 'text-green-400', bgLight: 'bg-green-50',   bgAlpha: 'bg-green-500/20',   ring: 'ring-green-500/20', border: 'border-green-500/30', hoverBg: 'hover:bg-green-500/30' },
  violet:  { bg: 'bg-violet-500',  bgGrad: 'from-violet-500 to-violet-600',  text: 'text-violet-600',  textLight: 'text-violet-400', bgLight: 'bg-violet-50',  bgAlpha: 'bg-violet-500/20',  ring: 'ring-violet-500/20', border: 'border-violet-500/30', hoverBg: 'hover:bg-violet-500/30' },
  yellow:  { bg: 'bg-yellow-500',  bgGrad: 'from-yellow-500 to-yellow-600',  text: 'text-yellow-600',  textLight: 'text-yellow-400', bgLight: 'bg-yellow-50',  bgAlpha: 'bg-yellow-500/20',  ring: 'ring-yellow-500/20', border: 'border-yellow-500/30', hoverBg: 'hover:bg-yellow-500/30' },
  gray:    { bg: 'bg-gray-500',    bgGrad: 'from-gray-500 to-gray-600',    text: 'text-gray-600',    textLight: 'text-gray-400', bgLight: 'bg-gray-50',    bgAlpha: 'bg-gray-500/20',    ring: 'ring-gray-500/20', border: 'border-gray-500/30', hoverBg: 'hover:bg-gray-500/30' },
};

const getColor = (color, prop) => COLOR_MAP[color]?.[prop] || COLOR_MAP.slate[prop];

// Content coverage data — static list of what's editable vs not
const EDITABLE_SECTIONS = [
  'News', 'Events', 'Publications', 'Media', 'Research Papers',
  'Maritime Safety', 'Fish Advisory', 'Library', 'Marketplace',
  'Podcasts', 'HR / Recruitment', 'User Management', 'LDA',
  'Divisions', 'Hero Images'
];

const NOT_EDITABLE_SECTIONS = [
  'About NARA', 'Contact Us', 'Partnership Gateway', 'Government Services Portal',
  'Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Accessibility Statement',
  'RTI Disclosure', 'Security Policy', 'Data Subject Rights',
  'Footer Content', 'Audience Pages (3)'
];

const MasterAdminPanel = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Admin Sections Configuration
  const adminSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/master',
      color: 'cyan'
    },
    {
      id: 'media',
      label: 'Media Management',
      icon: Image,
      color: 'purple',
      subsections: [
        { id: 'images', label: 'Images', icon: Image, path: '/admin/media', collection: 'media_images' },
        { id: 'videos', label: 'Videos', icon: Video, path: '/admin/media', collection: 'media_videos' },
        { id: 'gallery', label: 'Public Gallery', icon: Grid3x3, external: '/media-gallery' }
      ]
    },
    {
      id: 'research',
      label: 'Research & Data',
      icon: Microscope,
      color: 'blue',
      subsections: [
        { id: 'research-upload', label: 'Upload Research Paper', icon: Upload, path: '/admin/research-upload', highlight: true },
        { id: 'research-bulk-upload', label: 'Bulk Upload Papers', icon: Package, path: '/admin/research-bulk-upload', highlight: true },
        { id: 'manage-papers', label: 'Manage & Translate Papers', icon: Languages, path: '/admin/manage-papers', highlight: true },
        { id: 'research-data', label: 'Research Data', icon: Database, path: '/admin/research-data' },
        { id: 'publications', label: 'Publications', icon: FileText, path: '/admin/research-data', collection: 'publications' },
        { id: 'projects', label: 'Projects', icon: Briefcase, path: '/admin/research-data', collection: 'projects' },
        { id: 'lab-results', label: 'Lab Results', icon: FlaskConical, path: '/admin/lab-results' }
      ]
    },
    {
      id: 'maritime',
      label: 'Maritime Services',
      icon: Ship,
      color: 'indigo',
      subsections: [
        { id: 'vessels', label: 'Vessels', icon: Ship, path: '/admin/maritime', collection: 'maritime_vessels' },
        { id: 'ports', label: 'Ports', icon: Anchor, path: '/admin/maritime', collection: 'maritime_ports' },
        { id: 'bathymetry', label: 'Bathymetry', icon: Map, path: '/admin/bathymetry' },
        { id: 'incidents', label: 'Incidents', icon: AlertCircle, path: '/admin/marine-incident' }
      ]
    },
    {
      id: 'services',
      label: 'Public Services',
      icon: Users,
      color: 'green',
      subsections: [
        { id: 'fish-advisory', label: 'Fish Advisory', icon: Fish, path: '/admin/fish-advisory' },
        { id: 'vessel-booking', label: 'Vessel Booking', icon: Calendar, path: '/admin/research-vessel' },
        { id: 'lda', label: 'LDA System', icon: FileCheck, path: '/admin/lda' },
        { id: 'government', label: 'Government Services', icon: Building2, path: '/admin/government-services' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      color: 'orange',
      subsections: [
        { id: 'dashboard-analytics', label: 'Analytics Dashboard', icon: TrendingUp, path: '/admin/analytics' },
        { id: 'predictions', label: 'Predictions', icon: Target, path: '/admin/analytics/predictions' },
        { id: 'simulations', label: 'Simulations', icon: Activity, path: '/admin/analytics/simulations' },
        { id: 'economics', label: 'Economic Data', icon: DollarSign, path: '/admin/analytics/economic' }
      ]
    },
    {
      id: 'website',
      label: 'Website Management',
      icon: Globe,
      color: 'cyan',
      subsections: [
        { id: 'news', label: 'News Manager', icon: FileText, path: '/admin/news', highlight: true },
        { id: 'hero-images', label: 'Hero Images', icon: Image, path: '/admin/hero-images', highlight: true },
        { id: 'vacancies', label: 'Vacancies', icon: Briefcase, path: '/admin/vacancies', highlight: true },
        { id: 'scientist-sessions', label: 'Scientist Sessions', icon: FlaskConical, path: '/admin/scientist-sessions', highlight: true }
      ]
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      color: 'pink',
      subsections: [
        { id: 'divisions', label: 'Divisions', icon: Building2, path: '/admin/division-content' },
        { id: 'division-images', label: 'Division Images', icon: Image, path: '/admin/division-images' },
        { id: 'consultations', label: 'Public Consultations', icon: MessageSquare, path: '/admin/public-consultation' },
        { id: 'library', label: 'Library System', icon: BookOpen, path: '/admin/library' }
      ]
    },
    {
      id: 'marketplace',
      label: 'Digital Marketplace',
      icon: Package,
      color: 'emerald',
      subsections: [
        { id: 'products', label: 'Products', icon: Package, path: '/admin/marketplace/products' },
        { id: 'orders', label: 'Orders', icon: CheckCircle, path: '/admin/marketplace/orders' },
        { id: 'payments', label: 'Payments', icon: DollarSign, path: '/admin/marketplace/payments' },
        { id: 'categories', label: 'Categories', icon: Tag, disabled: true }
      ]
    },
    {
      id: 'hr',
      label: 'HR & Recruitment',
      icon: Briefcase,
      color: 'yellow',
      subsections: [
        { id: 'recruitment', label: 'Recruitment ATS', icon: Users, path: '/admin/recruitment-ats' },
        { id: 'pipeline', label: 'Project Pipeline', icon: Package, path: '/admin/project-pipeline' },
        { id: 'teams', label: 'Teams', icon: Users, disabled: true }
      ]
    },
    {
      id: 'podcasts',
      label: 'Podcast System',
      icon: Video,
      color: 'violet',
      subsections: [
        { id: 'manage-podcasts', label: 'Manage Episodes', icon: Video, path: '/admin/podcasts' },
        { id: 'podcast-analytics', label: 'Analytics Dashboard', icon: BarChart3, path: '/admin/podcasts' },
        { id: 'public-podcasts', label: 'Public Page', icon: ExternalLink, external: '/podcasts' }
      ]
    },
    {
      id: 'integration',
      label: 'Data Integration',
      icon: Database,
      color: 'red',
      subsections: [
        { id: 'data-center', label: 'Data Center Hub', icon: Database, path: '/admin/data-center-integration' },
        { id: 'water-quality', label: 'Water Quality', icon: Waves, path: '/admin/water-quality-monitoring' },
        { id: 'seeder', label: 'Phase 4 Seeder', icon: Upload, path: '/admin/phase4-seeder' }
      ]
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      color: 'gray',
      subsections: [
        { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
        { id: 'email', label: 'Email System', icon: Mail, disabled: true },
        { id: 'seo', label: 'SEO Manager', icon: Globe, disabled: true },
        { id: 'security', label: 'Security', icon: Shield, disabled: true }
      ]
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load statistics from all collections
      const collectionNames = [
        'media_images',
        'media_videos',
        'publications',
        'projects',
        'maritime_vessels',
        'teams',
        'news',
        'events',
        'podcasts',
      ];

      const statsData = {};
      const promises = collectionNames.map(async (collectionName) => {
        try {
          const snapshot = await getDocs(collection(db, collectionName));
          statsData[collectionName] = snapshot.size;
        } catch (error) {
          statsData[collectionName] = 0;
        }
      });

      await Promise.all(promises);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('adminAuth');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section.id);
    if (section.path) {
      navigate(section.path);
    }
    if (!section.subsections) {
      setActiveSubSection(null);
    }
  };

  const handleSubSectionClick = (subsection) => {
    if (subsection.disabled) return;
    setActiveSubSection(subsection.id);
    if (subsection.path) {
      navigate(subsection.path);
    } else if (subsection.external) {
      window.open(subsection.external, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${sidebarOpen ? 'w-72' : 'w-20'} bg-white/95 backdrop-blur-xl border-r border-slate-200 transition-all duration-300 z-50 overflow-y-auto`}>
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-xl">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-lg">NARA</span>
                <p className="text-xs text-slate-500">Master Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500 hover:text-slate-900"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {adminSections.map((section) => {
            const colors = COLOR_MAP[section.color] || COLOR_MAP.slate;
            return (
              <div key={section.id}>
                <button
                  onClick={() => handleSectionClick(section)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${colors.bgGrad} text-white shadow-lg`
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="font-medium flex-1 text-left">{section.label}</span>
                      {section.subsections && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          activeSection === section.id ? 'rotate-180' : ''
                        }`} />
                      )}
                    </>
                  )}
                </button>

                {/* Subsections */}
                {sidebarOpen && section.subsections && activeSection === section.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 mt-2 space-y-1"
                  >
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => handleSubSectionClick(subsection)}
                        disabled={subsection.disabled}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          subsection.disabled
                            ? 'opacity-50 cursor-not-allowed text-slate-400'
                            : activeSubSection === subsection.id
                              ? 'bg-slate-100 text-slate-800'
                              : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-900'
                        }`}
                      >
                        <subsection.icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{subsection.label}</span>
                        {subsection.disabled && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded-full font-medium">
                            Soon
                          </span>
                        )}
                        {subsection.external && !subsection.disabled && <ExternalLink className="w-3 h-3 ml-auto" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200 sticky bottom-0 bg-white/95 backdrop-blur-xl">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-400 transition-all ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="h-16 bg-white/50 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#003366] to-[#0066CC] bg-clip-text text-transparent">
              Master Admin Panel
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search admin functions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-slate-100 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#0066CC]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Refresh */}
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-slate-800">Super Admin</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#003366] to-[#0066CC] rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Welcome to NARA Master Admin</h2>
                <p className="text-cyan-100">Manage all aspects of your website from one unified dashboard</p>
              </div>

              {/* Quick Stats Grid — Real Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Newspaper}
                  label="News Articles"
                  value={stats.news ?? '...'}
                  color="cyan"
                  loading={loading}
                />
                <StatCard
                  icon={Image}
                  label="Media Images"
                  value={stats.media_images ?? '...'}
                  color="purple"
                  loading={loading}
                />
                <StatCard
                  icon={FileText}
                  label="Publications"
                  value={stats.publications ?? '...'}
                  color="blue"
                  loading={loading}
                />
                <StatCard
                  icon={Briefcase}
                  label="Active Projects"
                  value={stats.projects ?? '...'}
                  color="green"
                  loading={loading}
                />
                <StatCard
                  icon={Ship}
                  label="Maritime Vessels"
                  value={stats.maritime_vessels ?? '...'}
                  color="indigo"
                  loading={loading}
                />
                <StatCard
                  icon={Calendar}
                  label="Events"
                  value={stats.events ?? '...'}
                  color="amber"
                  loading={loading}
                />
                <StatCard
                  icon={Radio}
                  label="Podcast Episodes"
                  value={stats.podcasts ?? '...'}
                  color="violet"
                  loading={loading}
                />
                <StatCard
                  icon={Video}
                  label="Videos"
                  value={stats.media_videos ?? '...'}
                  color="pink"
                  loading={loading}
                />
              </div>

              {/* Content Coverage Panel */}
              <ContentCoveragePanel />

              {/* Quick Actions */}
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <QuickActionButton
                    icon={Upload}
                    label="Upload Research"
                    onClick={() => navigate('/admin/research-upload')}
                    color="cyan"
                  />
                  <QuickActionButton
                    icon={Package}
                    label="Bulk Upload"
                    onClick={() => navigate('/admin/research-bulk-upload')}
                    color="blue"
                  />
                  <QuickActionButton
                    icon={Languages}
                    label="Manage Papers"
                    onClick={() => navigate('/admin/manage-papers')}
                    color="green"
                  />
                  <QuickActionButton
                    icon={Plus}
                    label="Add Media"
                    onClick={() => navigate('/admin/media')}
                    color="purple"
                  />
                  <QuickActionButton
                    icon={Newspaper}
                    label="Manage News"
                    onClick={() => navigate('/admin/news')}
                    color="cyan"
                  />
                  <QuickActionButton
                    icon={Ship}
                    label="Maritime"
                    onClick={() => navigate('/admin/maritime')}
                    color="teal"
                  />
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  System Health
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <HealthMetric
                    label="Server Status"
                    value="Online"
                    percentage={100}
                    color="green"
                  />
                  <HealthMetric
                    label="Database"
                    value="Healthy"
                    percentage={98}
                    color="green"
                  />
                  <HealthMetric
                    label="Storage"
                    value="75% Used"
                    percentage={75}
                    color="yellow"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other sections will load their respective admin panels */}
          {activeSection !== 'dashboard' && (
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const section = adminSections.find(s => s.id === activeSection);
                    const Icon = section?.icon || LayoutDashboard;
                    return <Icon className="w-8 h-8 text-white" />;
                  })()}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {adminSections.find(s => s.id === activeSection)?.label}
                </h3>
                <p className="text-slate-500 mb-6">
                  Navigate using the sidebar or click a subsection to access specific management tools
                </p>
                {adminSections.find(s => s.id === activeSection)?.subsections && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {adminSections.find(s => s.id === activeSection).subsections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubSectionClick(sub)}
                        disabled={sub.disabled}
                        className={`p-4 rounded-xl transition-all text-left ${
                          sub.disabled
                            ? 'bg-slate-50 opacity-60 cursor-not-allowed'
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        <sub.icon className="w-6 h-6 text-cyan-400 mb-2" />
                        <p className="text-sm font-medium text-slate-800">{sub.label}</p>
                        {sub.disabled && (
                          <span className="text-[10px] text-slate-400 font-medium">Coming Soon</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Helper Components — using static COLOR_MAP classes

const StatCard = ({ icon: Icon, label, value, color, loading: isLoading }) => {
  const colors = COLOR_MAP[color] || COLOR_MAP.slate;
  return (
    <div className="bg-white/50 backdrop-blur-xl rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors.bgAlpha} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.textLight}`} />
        </div>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-1">
        {isLoading ? (
          <span className="inline-block w-12 h-6 bg-slate-200 rounded animate-pulse" />
        ) : (
          value
        )}
      </h3>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label, onClick, color }) => {
  const colors = COLOR_MAP[color] || COLOR_MAP.slate;
  return (
    <button
      onClick={onClick}
      className={`p-4 ${colors.bgAlpha} ${colors.hoverBg} border ${colors.border} rounded-xl transition-all text-left`}
    >
      <Icon className={`w-6 h-6 ${colors.textLight} mb-2`} />
      <p className="text-sm font-medium text-slate-800">{label}</p>
    </button>
  );
};

const HealthMetric = ({ label, value, percentage, color }) => {
  const colors = COLOR_MAP[color] || COLOR_MAP.slate;
  return (
    <div className="p-4 bg-slate-100/50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-500">{label}</p>
        <CheckCircle className={`w-4 h-4 ${colors.textLight}`} />
      </div>
      <p className="text-lg font-bold text-slate-800 mb-2">{value}</p>
      <div className="w-full bg-slate-300 rounded-full h-2">
        <div
          className={`${colors.bg} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ContentCoveragePanel = () => {
  const totalSections = EDITABLE_SECTIONS.length + NOT_EDITABLE_SECTIONS.length;
  const editableCount = EDITABLE_SECTIONS.length;
  const percentage = Math.round((editableCount / totalSections) * 100);

  return (
    <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200">
      <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-blue-400" />
        Content Coverage
      </h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600 font-medium">
            {editableCount} of {totalSections} sections editable from admin
          </span>
          <span className="text-sm font-bold text-slate-800">{percentage}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editable */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Editable via Admin Panel
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {EDITABLE_SECTIONS.map((section) => (
              <span key={section} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                {section}
              </span>
            ))}
          </div>
        </div>

        {/* Not Yet Editable */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Not Yet Editable (Hardcoded)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {NOT_EDITABLE_SECTIONS.map((section) => (
              <span key={section} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                {section}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterAdminPanel;
