import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import {
  projectsService,
  milestonesService,
  outputsService,
  budgetTrackingService,
  projectPipelineDashboardService
} from '../../services/projectPipelineService';
import EnhancedProjectFilters from '../../components/project-pipeline/EnhancedProjectFilters';
import SEOHead from '../../components/shared/SEOHead';

const ProjectPipelineTracker = () => {
  const { t } = useTranslation('project-pipeline');
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'projects' | 'detail'
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Enhanced Filters
  const [filters, setFilters] = useState({
    timeline: 'all', // all | past | ongoing | future
    status: 'all',
    ragStatus: 'all',
    division: 'all',
    fundingSource: 'all',
    year: 'all',
    searchTerm: '',
    startDateFrom: '',
    endDateTo: ''
  });

  useEffect(() => {
    loadProjects();
    loadDashboardStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, filters]);

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await projectsService.getAll({ visibility: 'public' });
    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const loadDashboardStats = async () => {
    const { data, error } = await projectPipelineDashboardService.getStatistics('public');
    if (!error && data) {
      setDashboardStats(data);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Timeline filter (Past/Ongoing/Future)
    if (filters.timeline !== 'all') {
      const now = new Date();
      if (filters.timeline === 'past') {
        filtered = filtered.filter(p => p.status === 'completed');
      } else if (filters.timeline === 'ongoing') {
        filtered = filtered.filter(p => 
          (p.status === 'active' || p.status === 'planning') &&
          (!p.startDate || new Date(p.startDate) <= now)
        );
      } else if (filters.timeline === 'future') {
        filtered = filtered.filter(p => 
          p.status === 'planning' && 
          p.startDate && 
          new Date(p.startDate) > now
        );
      }
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // RAG Status filter
    if (filters.ragStatus !== 'all') {
      filtered = filtered.filter(p => p.ragStatus === filters.ragStatus);
    }

    // Division filter
    if (filters.division !== 'all') {
      filtered = filtered.filter(p => p.division === filters.division);
    }

    // Funding Source filter
    if (filters.fundingSource !== 'all') {
      filtered = filtered.filter(p => p.fundingSource === filters.fundingSource);
    }

    // Year filter
    if (filters.year !== 'all') {
      filtered = filtered.filter(p => {
        const startYear = p.startDate ? new Date(p.startDate).getFullYear().toString() : null;
        const endYear = p.endDate ? new Date(p.endDate).getFullYear().toString() : null;
        return startYear === filters.year || endYear === filters.year;
      });
    }

    // Date range filters
    if (filters.startDateFrom) {
      filtered = filtered.filter(p => 
        p.startDate && new Date(p.startDate) >= new Date(filters.startDateFrom)
      );
    }
    if (filters.endDateTo) {
      filtered = filtered.filter(p => 
        p.endDate && new Date(p.endDate) <= new Date(filters.endDateTo)
      );
    }

    // Enhanced search (ID, Title, Description, PI, Keywords)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.projectId && p.projectId.toLowerCase().includes(term)) ||
        (p.title && p.title.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.principalInvestigator && p.principalInvestigator.toLowerCase().includes(term)) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(term)))
      );
    }

    setFilteredProjects(filtered);
  };

  const getRAGColor = (ragStatus) => {
    const colors = {
      green: 'bg-green-500',
      amber: 'bg-yellow-500',
      red: 'bg-red-500'
    };
    return colors[ragStatus] || 'bg-gray-400';
  };

  const getRAGTextColor = (ragStatus) => {
    const colors = {
      green: 'text-green-700',
      amber: 'text-yellow-700',
      red: 'text-red-700'
    };
    return colors[ragStatus] || 'text-gray-700';
  };

  const getRAGBgColor = (ragStatus) => {
    const colors = {
      green: 'bg-green-50',
      amber: 'bg-yellow-50',
      red: 'bg-red-50'
    };
    return colors[ragStatus] || 'bg-gray-50';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      on_hold: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Dashboard View
  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* MOCK DATA BANNER - PROMINENT WARNING */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 border-4 border-yellow-600 shadow-2xl"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 p-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <Icons.AlertTriangle className="w-10 h-10 text-white animate-pulse" />
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">SAMPLE DATA ONLY</h2>
            <Icons.AlertTriangle className="w-10 h-10 text-white animate-pulse" />
          </div>
          <p className="text-white text-lg font-semibold mb-2">
            This dashboard currently displays MOCK/DEMONSTRATION data for visualization purposes
          </p>
          <p className="text-white/90 text-sm font-medium">
            🔄 Real project data will be integrated and made live in future updates
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-600 to-red-600 animate-pulse"></div>
      </motion.div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12">
        <div className="relative z-10">
          <Icons.Activity className="w-16 h-16 mb-4 opacity-90" />
          <h1 className="text-4xl font-bold mb-3">{t('hero.title')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {t('hero.subtitle')}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Icons.TrendingUp className="w-full h-full" />
        </div>
      </div>

      {/* Statistics Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Icons.FolderOpen}
            label={t('stats.totalProjects')}
            value={dashboardStats.overview.totalProjects}
            color="blue"
          />
          <StatCard
            icon={Icons.Activity}
            label={t('stats.activeProjects')}
            value={dashboardStats.overview.activeProjects}
            color="green"
          />
          <StatCard
            icon={Icons.CheckCircle}
            label={t('stats.completedProjects')}
            value={dashboardStats.overview.completedProjects}
            color="purple"
          />
          <StatCard
            icon={Icons.DollarSign}
            label={t('stats.totalBudget')}
            value={formatCurrency(dashboardStats.overview.totalBudget)}
            color="indigo"
            isLarge
          />
        </div>
      )}

      {/* RAG Status Overview */}
      {dashboardStats && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icons.AlertCircle className="w-7 h-7 text-blue-600" />
            {t('ragStatus.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-700 font-semibold">{t('ragStatus.green.label')}</span>
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
              </div>
              <div className="text-4xl font-bold text-green-800">{dashboardStats.ragStatus.green}</div>
              <p className="text-green-600 text-sm mt-2">{t('ragStatus.green.description')}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-700 font-semibold">{t('ragStatus.amber.label')}</span>
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              </div>
              <div className="text-4xl font-bold text-yellow-800">{dashboardStats.ragStatus.amber}</div>
              <p className="text-yellow-600 text-sm mt-2">{t('ragStatus.amber.description')}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-700 font-semibold">{t('ragStatus.red.label')}</span>
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
              </div>
              <div className="text-4xl font-bold text-red-800">{dashboardStats.ragStatus.red}</div>
              <p className="text-red-600 text-sm mt-2">{t('ragStatus.red.description')}</p>
            </div>
          </div>
        </div>
      )}

      {/* VISUAL DATA DISPLAYS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution - Visual Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icons.PieChart className="w-7 h-7 text-blue-600" />
            Project Status Distribution
          </h2>
          {dashboardStats && (
            <div className="space-y-4">
              {/* Planning */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Planning</span>
                  <span className="text-blue-600 font-bold">{dashboardStats.byStatus?.planning || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${((dashboardStats.byStatus?.planning || 0) / dashboardStats.overview.totalProjects) * 100}%` }}
                  ></div>
                </div>
              </div>
              {/* Active */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Active</span>
                  <span className="text-green-600 font-bold">{dashboardStats.byStatus?.active || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${((dashboardStats.byStatus?.active || 0) / dashboardStats.overview.totalProjects) * 100}%` }}
                  ></div>
                </div>
              </div>
              {/* On Hold */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">On Hold</span>
                  <span className="text-yellow-600 font-bold">{dashboardStats.byStatus?.on_hold || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-yellow-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${((dashboardStats.byStatus?.on_hold || 0) / dashboardStats.overview.totalProjects) * 100}%` }}
                  ></div>
                </div>
              </div>
              {/* Completed */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Completed</span>
                  <span className="text-purple-600 font-bold">{dashboardStats.overview.completedProjects}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-purple-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${(dashboardStats.overview.completedProjects / dashboardStats.overview.totalProjects) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Budget Allocation by Division */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icons.BarChart3 className="w-7 h-7 text-green-600" />
            Budget by Division
          </h2>
          {dashboardStats && dashboardStats.budgetByDivision && (
            <div className="space-y-4">
              {Object.entries(dashboardStats.budgetByDivision).map(([division, budget], index) => {
                const maxBudget = Math.max(...Object.values(dashboardStats.budgetByDivision));
                const percentage = (budget / maxBudget) * 100;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                return (
                  <div key={division}>
      <SEOHead
        title="Project Pipeline Tracker"
        description="Track ongoing and upcoming NARA research projects, milestones, and progress."
        path="/project-pipeline-tracker"
        keywords="project tracker, research pipeline, NARA projects"
      />
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium truncate">{division}</span>
                      <span className="text-gray-900 font-bold">{formatCurrency(budget)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`${colors[index % colors.length]} h-4 rounded-full transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Project Timeline Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Icons.Calendar className="w-7 h-7 text-indigo-600" />
          Project Timeline Overview (Gantt-Style)
        </h2>
        <div className="space-y-4">
          {filteredProjects.slice(0, 10).map((project, index) => {
            const now = new Date();
            const start = project.startDate ? new Date(project.startDate) : now;
            const end = project.endDate ? new Date(project.endDate) : now;
            const total = end - start;
            const elapsed = now - start;
            const progress = Math.max(0, Math.min(100, (elapsed / total) * 100));

            return (
              <div key={project.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-800 text-sm truncate max-w-xs">{project.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(project.status)}`}>
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(start)} - {formatDate(end)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${project.completionPercentage || 0}%` }}
                  ></div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white drop-shadow-lg">{project.completionPercentage || 0}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Progress Chart */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Icons.TrendingUp className="w-7 h-7 text-cyan-600" />
          Projects Completion Trend (Last 12 Months)
        </h2>
        <div className="flex items-end justify-between h-64 gap-2">
          {[30, 45, 35, 60, 55, 70, 65, 80, 75, 85, 90, 95].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t-lg transition-all duration-1000 hover:from-cyan-600 hover:to-cyan-400 relative group"
                   style={{ height: `${height}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {height}% Complete
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setActiveView('projects')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all duration-300 group"
        >
          <Icons.Search className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-2">{t('quickActions.browseProjects.title')}</h3>
          <p className="text-blue-100">{t('quickActions.browseProjects.description')}</p>
        </button>
        <button
          onClick={() => {
            setFilters({ ...filters, ragStatus: 'red' });
            setActiveView('projects');
          }}
          className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all duration-300 group"
        >
          <Icons.AlertTriangle className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-2">{t('quickActions.criticalProjects.title')}</h3>
          <p className="text-red-100">{t('quickActions.criticalProjects.description')}</p>
        </button>
      </div>

      {/* Division Breakdown */}
      {dashboardStats && Object.keys(dashboardStats.byDivision).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icons.Building className="w-7 h-7 text-blue-600" />
            {t('divisions.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(dashboardStats.byDivision).map(([division, count]) => (
              <div key={division} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <span className="font-medium text-gray-700">{division}</span>
                <span className="text-2xl font-bold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  // Projects List View
  const renderProjects = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* MOCK DATA INDICATOR */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 flex items-center justify-center gap-3 border-2 border-orange-600">
        <Icons.AlertTriangle className="w-6 h-6 animate-pulse" />
        <p className="font-bold text-sm">⚠️ SAMPLE/MOCK DATA DISPLAY - Real data will be integrated in future updates</p>
        <Icons.AlertTriangle className="w-6 h-6 animate-pulse" />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-8">
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 transition-colors"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
          {t('projects.backToDashboard')}
        </button>
        <h1 className="text-3xl font-bold">{t('projects.title')}</h1>
        <p className="text-blue-100 mt-2">{t('projects.subtitle')}</p>
      </div>

      {/* Enhanced Filters */}
      <EnhancedProjectFilters
        filters={filters}
        onFilterChange={setFilters}
        projects={projects}
        filteredProjects={filteredProjects}
      />

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Icons.FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">{t('filters.noProjects')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => {
                setSelectedProject(project);
                setActiveView('detail');
              }}
              t={t}
            />
          ))}
        </div>
      )}
    </motion.div>
  );

  // Project Detail View
  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* MOCK DATA INDICATOR */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 flex items-center justify-center gap-3 border-2 border-yellow-600 shadow-lg">
          <Icons.Info className="w-6 h-6" />
          <p className="font-bold text-sm">📊 SAMPLE PROJECT DATA - This is demonstration data for visualization purposes only</p>
        </div>

        {/* Header */}
        <div className={`${getRAGBgColor(selectedProject.ragStatus)} rounded-xl p-8 border-2 ${selectedProject.ragStatus === 'green' ? 'border-green-200' : selectedProject.ragStatus === 'amber' ? 'border-yellow-200' : 'border-red-200'}`}>
          <button
            onClick={() => setActiveView('projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            {t('projects.backToProjects')}
          </button>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(selectedProject.status)}`}>
                  {selectedProject.status.replace('_', ' ').toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getRAGColor(selectedProject.ragStatus)}`}></div>
                  <span className={`font-semibold ${getRAGTextColor(selectedProject.ragStatus)}`}>
                    {selectedProject.ragStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedProject.title}</h1>
              <p className="text-gray-700 text-lg">{selectedProject.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('projectDetail.projectId')}</p>
              <p className="font-mono font-semibold text-gray-800">{selectedProject.projectId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('projectDetail.division')}</p>
              <p className="font-semibold text-gray-800">{selectedProject.division}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('projectDetail.startDate')}</p>
              <p className="font-semibold text-gray-800">{formatDate(selectedProject.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('projectDetail.endDate')}</p>
              <p className="font-semibold text-gray-800">{formatDate(selectedProject.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Progress & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.TrendingUp className="w-6 h-6 text-blue-600" />
              {t('projectDetail.progress')}
            </h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">{t('projectDetail.completion')}</span>
                <span className="text-sm font-semibold text-gray-800">{selectedProject.completionPercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${selectedProject.completionPercentage || 0}%` }}
                ></div>
              </div>
            </div>
            {selectedProject.ragNotes && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">{t('projectDetail.latestUpdate')}</p>
                <p className="text-sm text-gray-600">{selectedProject.ragNotes}</p>
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.DollarSign className="w-6 h-6 text-green-600" />
              {t('projectDetail.budget')}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('projectDetail.totalBudget')}</span>
                <span className="font-semibold text-gray-800">{formatCurrency(selectedProject.totalBudget || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('projectDetail.spent')}</span>
                <span className="font-semibold text-green-600">{formatCurrency(selectedProject.budgetSpent || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('projectDetail.remaining')}</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency((selectedProject.totalBudget || 0) - (selectedProject.budgetSpent || 0))}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">{t('projectDetail.utilization')}</span>
                  <span className="text-sm font-semibold">{selectedProject.budgetUtilization || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min(selectedProject.budgetUtilization || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icons.Users className="w-6 h-6 text-purple-600" />
            {t('projectDetail.team')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('projectDetail.principalInvestigator')}</p>
              <p className="font-semibold text-gray-800">{selectedProject.principalInvestigator}</p>
            </div>
            {selectedProject.team && selectedProject.team.length > 0 && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-2">{t('projectDetail.teamMembers')}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.team.map((member, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      {member.name} ({member.role})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Milestones */}
        {selectedProject.milestones && selectedProject.milestones.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.Target className="w-6 h-6 text-orange-600" />
              {t('projectDetail.milestones')}
            </h2>
            <div className="space-y-4">
              {selectedProject.milestones.map((milestone) => (
                <div key={milestone.milestoneId} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Icons.Clock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{milestone.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{t('projectDetail.target')} {formatDate(milestone.targetDate)}</span>
                      {milestone.completedDate && (
                        <span className="text-green-600 font-medium">
                          {t('projectDetail.completed')} {formatDate(milestone.completedDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Outputs */}
        {selectedProject.outputs && selectedProject.outputs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.FileText className="w-6 h-6 text-indigo-600" />
              {t('projectDetail.outputs')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProject.outputs.map((output) => (
                <div key={output.outputId} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      output.type === 'publication' ? 'bg-blue-100 text-blue-700' :
                      output.type === 'report' ? 'bg-green-100 text-green-700' :
                      output.type === 'dataset' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {output.type.toUpperCase()}
                    </span>
                    {output.url && (
                      <a
                        href={output.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Icons.ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{output.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{output.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatDate(output.publishedDate)}</span>
                    {output.citations > 0 && (
                      <span>{output.citations} {t('projectDetail.citations')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50" style={{ fontFamily: "'Noto Sans Sinhala', 'Noto Sans Tamil', 'Inter', 'Segoe UI', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'projects' && renderProjects()}
          {activeView === 'detail' && renderProjectDetail()}
        </AnimatePresence>
      </div>

      {/* PERSISTENT MOCK DATA FOOTER */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 border-t-4 border-yellow-600 shadow-2xl z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icons.Database className="w-5 h-5 text-white animate-pulse" />
              <div>
                <p className="text-white font-bold text-sm">
                  📊 DEMONSTRATION MODE: Sample/Mock Data Only
                </p>
                <p className="text-white/90 text-xs">
                  This tracker displays sample data for visualization and functionality demonstration purposes
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Icons.Calendar className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-semibold">
                🔄 Real data integration coming soon
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, isLarge = false }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
      <Icon className="w-10 h-10 mb-3 opacity-90" />
      <div className={`${isLarge ? 'text-2xl' : 'text-3xl'} font-bold mb-1`}>{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onClick, t }) => {
  const getRAGColor = (ragStatus) => {
    const colors = {
      green: 'bg-green-500',
      amber: 'bg-yellow-500',
      red: 'bg-red-500'
    };
    return colors[ragStatus] || 'bg-gray-400';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      on_hold: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      notation: 'compact'
    }).format(amount);
  };

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
    >
      {/* MOCK DATA WATERMARK */}
      <div className="absolute top-2 right-2 bg-orange-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
        Sample Data
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(project.status)}`}>
            {project.status.replace('_', ' ').toUpperCase()}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getRAGColor(project.ragStatus)}`}></div>
            <span className="text-sm font-semibold text-gray-600">{project.ragStatus.toUpperCase()}</span>
          </div>
        </div>
        <Icons.ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{project.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">{t('projectCard.progress')}</span>
          <span className="font-semibold text-gray-800">{project.completionPercentage || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${project.completionPercentage || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 mb-1">{t('projectCard.principalInvestigator')}</p>
          <p className="text-sm font-semibold text-gray-800">{project.principalInvestigator}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">{t('projectCard.budget')}</p>
          <p className="text-sm font-semibold text-gray-800">{formatCurrency(project.totalBudget || 0)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Icons.Building className="w-3 h-3" />
          {project.division}
        </span>
        {project.milestones && project.milestones.length > 0 && (
          <span className="flex items-center gap-1">
            <Icons.Target className="w-3 h-3" />
            {project.milestones.filter(m => m.status === 'completed').length}/{project.milestones.length} {t('projectCard.milestones')}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectPipelineTracker;
