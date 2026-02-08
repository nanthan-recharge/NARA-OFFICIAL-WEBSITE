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
  Grid3x3, List, SlidersHorizontal, Heart, Share2, MessageSquare, Radio, Languages
} from 'lucide-react';

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
        { id: 'categories', label: 'Categories', icon: Tag, path: '/admin/marketplace/categories' }
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
        { id: 'teams', label: 'Teams', icon: Users, path: '/admin/dashboard', collection: 'teams' }
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
        { id: 'email', label: 'Email System', icon: Mail, path: '/admin/dashboard' },
        { id: 'seo', label: 'SEO Manager', icon: Globe, path: '/admin/dashboard' },
        { id: 'security', label: 'Security', icon: Shield, path: '/admin/dashboard' }
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
      const collections = [
        'media_images',
        'media_videos',
        'publications',
        'projects',
        'maritime_vessels',
        'teams'
      ];

      const statsData = {};
      for (const collectionName of collections) {
        try {
          const snapshot = await getDocs(collection(db, collectionName));
          statsData[collectionName] = snapshot.size;
        } catch (error) {
          console.error(`Error loading ${collectionName}:`, error);
          statsData[collectionName] = 0;
        }
      }

      // Load podcasts count
      try {
        const podcastsSnapshot = await getDocs(collection(db, 'podcasts'));
        statsData.podcasts = podcastsSnapshot.size;
      } catch (error) {
        console.error('Error loading podcasts:', error);
        statsData.podcasts = 0;
      }

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
    setActiveSubSection(subsection.id);
    if (subsection.path) {
      navigate(subsection.path);
    } else if (subsection.external) {
      window.open(subsection.external, '_blank');
    }
  };

  const getColorClasses = (color) => ({
    bg: `bg-${color}-500`,
    hover: `hover:bg-${color}-600`,
    text: `text-${color}-400`,
    border: `border-${color}-500`,
    shadow: `shadow-sm`
  });

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
          {adminSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => handleSectionClick(section)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? `bg-gradient-to-r from-${section.color}-500 to-${section.color}-600 text-white shadow-lg`
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
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSubSection === subsection.id
                          ? 'bg-slate-100 text-slate-800'
                          : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-900'
                      }`}
                    >
                      <subsection.icon className="w-4 h-4" />
                      <span>{subsection.label}</span>
                      {subsection.external && <ExternalLink className="w-3 h-3 ml-auto" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
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

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Image}
                  label="Total Images"
                  value={stats.media_images || 0}
                  color="purple"
                  trend="+12%"
                />
                <StatCard
                  icon={Video}
                  label="Total Videos"
                  value={stats.media_videos || 0}
                  color="pink"
                  trend="+8%"
                />
                <StatCard
                  icon={FileText}
                  label="Publications"
                  value={stats.publications || 0}
                  color="blue"
                  trend="+15%"
                />
                <StatCard
                  icon={Briefcase}
                  label="Active Projects"
                  value={stats.projects || 0}
                  color="green"
                  trend="+5%"
                />
                <StatCard
                  icon={Ship}
                  label="Maritime Vessels"
                  value={stats.maritime_vessels || 0}
                  color="indigo"
                  trend="+3%"
                />
                <StatCard
                  icon={Users}
                  label="Team Members"
                  value={stats.teams || 0}
                  color="orange"
                  trend="+10%"
                />
                <StatCard
                  icon={Radio}
                  label="Podcast Episodes"
                  value={stats.podcasts || 0}
                  color="violet"
                  trend="+20%"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Total Views"
                  value="125.4K"
                  color="cyan"
                  trend="+25%"
                />
                <StatCard
                  icon={CheckCircle}
                  label="System Status"
                  value="Healthy"
                  color="green"
                  trend="100%"
                />
              </div>

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
                    icon={FileText}
                    label="Publications"
                    onClick={() => navigate('/admin/research-data')}
                    color="indigo"
                  />
                  <QuickActionButton
                    icon={Ship}
                    label="Maritime"
                    onClick={() => navigate('/admin/maritime')}
                    color="teal"
                  />
                  <QuickActionButton
                    icon={Database}
                    label="Import Data"
                    onClick={() => navigate('/admin/data-center-integration')}
                    color="green"
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <ActivityItem
                      icon={Image}
                      text="New image added to Media Gallery"
                      time="2 minutes ago"
                      color="purple"
                    />
                    <ActivityItem
                      icon={FileText}
                      text="Publication 'Marine Research 2024' updated"
                      time="15 minutes ago"
                      color="blue"
                    />
                    <ActivityItem
                      icon={Ship}
                      text="Vessel booking request approved"
                      time="1 hour ago"
                      color="indigo"
                    />
                    <ActivityItem
                      icon={Users}
                      text="New team member added"
                      time="3 hours ago"
                      color="green"
                    />
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Pending Actions
                  </h3>
                  <div className="space-y-3">
                    <PendingItem
                      text="5 media items awaiting approval"
                      action="Review"
                      onClick={() => navigate('/admin/media')}
                    />
                    <PendingItem
                      text="3 public consultation submissions"
                      action="Review"
                      onClick={() => navigate('/admin/public-consultation')}
                    />
                    <PendingItem
                      text="2 vessel booking requests"
                      action="Approve"
                      onClick={() => navigate('/admin/research-vessel')}
                    />
                    <PendingItem
                      text="System backup required"
                      action="Backup"
                      onClick={() => {}}
                    />
                  </div>
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
                        className="p-4 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-left"
                      >
                        <sub.icon className="w-6 h-6 text-cyan-400 mb-2" />
                        <p className="text-sm font-medium text-slate-800">{sub.label}</p>
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

// Helper Components
const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className="bg-white/50 backdrop-blur-xl rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      <span className="text-green-400 text-sm font-semibold">{trend}</span>
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-1">{value}</h3>
    <p className="text-slate-500 text-sm">{label}</p>
  </div>
);

const QuickActionButton = ({ icon: Icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-4 bg-${color}-500/20 hover:bg-${color}-500/30 border border-${color}-500/30 rounded-xl transition-all text-left`}
  >
    <Icon className={`w-6 h-6 text-${color}-400 mb-2`} />
    <p className="text-sm font-medium text-slate-800">{label}</p>
  </button>
);

const ActivityItem = ({ icon: Icon, text, time, color }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-100/50 rounded-lg">
    <div className={`w-8 h-8 bg-${color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-4 h-4 text-${color}-400`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-800">{text}</p>
      <p className="text-xs text-slate-500">{time}</p>
    </div>
  </div>
);

const PendingItem = ({ text, action, onClick }) => (
  <div className="flex items-center justify-between p-3 bg-slate-100/50 rounded-lg hover:bg-slate-100 transition-all">
    <p className="text-sm text-slate-800">{text}</p>
    <button
      onClick={onClick}
      className="px-3 py-1 bg-[#0066CC] hover:bg-[#003366] rounded-lg text-xs font-semibold text-white transition-all"
    >
      {action}
    </button>
  </div>
);

const HealthMetric = ({ label, value, percentage, color }) => (
  <div className="p-4 bg-slate-100/50 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm text-slate-500">{label}</p>
      <CheckCircle className={`w-4 h-4 text-${color}-400`} />
    </div>
    <p className="text-lg font-bold text-slate-800 mb-2">{value}</p>
    <div className="w-full bg-slate-300 rounded-full h-2">
      <div
        className={`bg-${color}-500 h-2 rounded-full transition-all`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

export default MasterAdminPanel;
