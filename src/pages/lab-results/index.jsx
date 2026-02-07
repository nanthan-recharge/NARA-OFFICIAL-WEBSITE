import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { labResultsService, sampleTrackingService, labResultsDashboardService } from '../../services/labResultsService';
import AdvancedFilters from '../../components/lab-results/AdvancedFilters';
import BulkActionsToolbar from '../../components/lab-results/BulkActionsToolbar';
import ResultQRCode from '../../components/lab-results/ResultQRCode';
import { exportResultsToExcel, exportSingleResultToExcel } from '../../utils/labResultsExport';
import { exportLabResultToPDF, exportMultipleResultsToPDF } from '../../utils/labResultsPDFExport';
import MonthlyTrendsChart from '../../components/lab-results/charts/MonthlyTrendsChart';
import TestTypeDistributionChart from '../../components/lab-results/charts/TestTypeDistributionChart';
import ProcessingTimeChart from '../../components/lab-results/charts/ProcessingTimeChart';
import StatusOverviewChart from '../../components/lab-results/charts/StatusOverviewChart';
import { 
  generateMonthlyTrendsData, 
  generateTestTypeDistribution, 
  generateProcessingTimeData,
  generateStatusOverviewData,
  generateSampleChartData
} from '../../utils/labResultsChartData';

const LabResultsPortal = () => {
  const { t, i18n } = useTranslation('labResults');
  const currentLang = i18n.language;

  // State Management
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'results' | 'samples' | 'track'
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [results, setResults] = useState([]);
  const [samples, setSamples] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [trackingId, setTrackingId] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState(null);
  const [selectedResults, setSelectedResults] = useState([]); // For bulk operations
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeResultId, setQRCodeResultId] = useState(null);

  // Load Dashboard Data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data, error } = await labResultsDashboardService.getStatistics();
      if (data) {
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load Results
  const loadResults = async (filters = {}) => {
    setLoading(true);
    try {
      const { data, error } = await labResultsService.getAll(filters);
      if (data) {
        setResults(data);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load Samples
  const loadSamples = async (filters = {}) => {
    setLoading(true);
    try {
      const { data, error } = await sampleTrackingService.getAll(filters);
      if (data) {
        setSamples(data);
      }
    } catch (error) {
      console.error('Error loading samples:', error);
    } finally {
      setLoading(false);
    }
  };

  // Track Sample by ID
  const trackSample = async () => {
    if (!trackingId.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await sampleTrackingService.getBySampleId(trackingId);
      if (data) {
        setSelectedSample(data);
      } else {
        alert(t('alerts.notFound'));
      }
    } catch (error) {
      console.error('Error tracking sample:', error);
      alert(t('alerts.error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Advanced Filters
  const handleAdvancedFilterChange = (filters) => {
    setAdvancedFilters(filters);
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters(null);
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Bulk Operations Handlers
  const toggleResultSelection = (resultId) => {
    setSelectedResults(prev =>
      prev.includes(resultId)
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    );
  };

  const selectAllResults = () => {
    setSelectedResults(filteredResults.map(r => r.id));
  };

  const clearSelection = () => {
    setSelectedResults([]);
  };

  const handleBulkExport = () => {
    const selectedData = results.filter(r => selectedResults.includes(r.id));
    const result = exportResultsToExcel(selectedData, 'NARA_Selected_Results');
    
    if (result.success) {
      alert(`✅ Exported ${result.recordCount} results to ${result.filename}`);
      clearSelection();
    } else {
      alert(`❌ Export failed: ${result.error}`);
    }
  };

  const handleBulkDownload = async () => {
    const selectedData = results.filter(r => selectedResults.includes(r.id));
    
    if (selectedData.length === 0) {
      alert('⚠️ No results selected');
      return;
    }

    if (selectedData.length === 1) {
      // Single result - detailed PDF
      const result = await exportLabResultToPDF(selectedData[0]);
      if (result.success) {
        alert(`✅ PDF downloaded: ${result.filename}`);
        clearSelection();
      } else {
        alert(`❌ PDF generation failed: ${result.error}`);
      }
    } else {
      // Multiple results - combined PDF
      const result = await exportMultipleResultsToPDF(selectedData);
      if (result.success) {
        alert(`✅ Combined PDF downloaded: ${result.filename}\n${result.resultCount} results included`);
        clearSelection();
      } else {
        alert(`❌ PDF generation failed: ${result.error}`);
      }
    }
  };

  const showQRCodeModal = (resultId) => {
    setQRCodeResultId(resultId);
    setShowQRCode(true);
  };

  // Generate chart data from results and samples
  const chartData = useMemo(() => {
    // Use sample data if no real data available
    if (results.length === 0 && samples.length === 0) {
      return generateSampleChartData();
    }

    return {
      monthlyTrends: generateMonthlyTrendsData(results),
      testTypeDistribution: generateTestTypeDistribution(results),
      processingTime: generateProcessingTimeData(results),
      statusOverview: generateStatusOverviewData(samples)
    };
  }, [results, samples]);

  // Filter Results with Advanced Filters
  const filteredResults = results.filter(result => {
    // Basic search
    const matchesSearch = searchQuery === '' ||
      result.testType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.sampleType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.projectName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;

    // Advanced filters
    if (advancedFilters) {
      // Date range filter
      if (advancedFilters.dateFrom && result.createdAt) {
        const resultDate = new Date(result.createdAt);
        if (resultDate < advancedFilters.dateFrom) return false;
      }
      if (advancedFilters.dateTo && result.createdAt) {
        const resultDate = new Date(result.createdAt);
        const endOfDay = new Date(advancedFilters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (resultDate > endOfDay) return false;
      }

      // Status multi-select filter
      if (advancedFilters.statuses && advancedFilters.statuses.length > 0) {
        const statusValues = advancedFilters.statuses.map(s => s.value);
        if (!statusValues.includes(result.status)) return false;
      }

      // Test type filter
      if (advancedFilters.testTypes && advancedFilters.testTypes.length > 0) {
        const testTypeValues = advancedFilters.testTypes.map(t => t.value);
        if (!testTypeValues.includes(result.testType)) return false;
      }

      // Sample type filter
      if (advancedFilters.sampleTypes && advancedFilters.sampleTypes.length > 0) {
        const sampleTypeValues = advancedFilters.sampleTypes.map(s => s.value);
        if (!sampleTypeValues.includes(result.sampleType)) return false;
      }
    }

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sorting logic
    if (!advancedFilters || !advancedFilters.sortBy) {
      return new Date(b.createdAt) - new Date(a.createdAt); // Default: newest first
    }

    switch (advancedFilters.sortBy) {
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'status-asc':
        return (a.status || '').localeCompare(b.status || '');
      case 'type-asc':
        return (a.testType || '').localeCompare(b.testType || '');
      default:
        return 0;
    }
  });

  // Filter Samples
  const filteredSamples = samples.filter(sample => {
    const matchesSearch = searchQuery === '' ||
      sample.sampleId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.sampleType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sample.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get Status Badge Color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      submitted: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      received: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Navigation Tabs
  const navTabs = [
    { id: 'dashboard', labelKey: 'nav.dashboard', icon: Icons.LayoutDashboard },
    { id: 'results', labelKey: 'nav.results', icon: Icons.FlaskConical },
    { id: 'samples', labelKey: 'nav.samples', icon: Icons.TestTube },
    { id: 'track', labelKey: 'nav.track', icon: Icons.Search }
  ];

  const statsCards = [
    {
      labelKey: 'dashboard.stats.totalResults',
      value: dashboardStats?.results?.total || 0,
      icon: Icons.FileText,
      color: 'blue',
      bgGradient: 'from-blue-500 to-cyan-500'
    },
    {
      labelKey: 'dashboard.stats.completed',
      value: dashboardStats?.results?.completed || 0,
      icon: Icons.CheckCircle,
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-500'
    },
    {
      labelKey: 'dashboard.stats.pending',
      value: dashboardStats?.results?.pending || 0,
      icon: Icons.Clock,
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-amber-500'
    },
    {
      labelKey: 'dashboard.stats.totalSamples',
      value: dashboardStats?.samples?.total || 0,
      icon: Icons.TestTube,
      color: 'purple',
      bgGradient: 'from-purple-500 to-pink-500'
    }
  ];

  const quickActions = [
    { icon: Icons.Search, labelKey: 'dashboard.quickActions.items.trackSample', action: () => setActiveView('track') },
    { icon: Icons.FlaskConical, labelKey: 'dashboard.quickActions.items.viewResults', action: () => setActiveView('results') },
    { icon: Icons.Download, labelKey: 'dashboard.quickActions.items.downloadReports', action: () => {} }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50">
      {/* Hero Section */}
      {/* Hero Section - Navy Blue Government Theme */}
      <section className="relative bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            >
              <Icons.FlaskConical className="w-8 h-8" />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-cyan-300 font-semibold">{t('hero.badge')}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl shadow-lg z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveView(tab.id);
                    if (tab.id === 'results' && results.length === 0) loadResults();
                    if (tab.id === 'samples' && samples.length === 0) loadSamples();
                  }}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold whitespace-nowrap transition-all border-b-4 ${
                    activeView === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{t(tab.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statsCards.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} text-white shadow-lg`}>
                          <stat.icon size={28} />
                        </div>
                        <Icons.TrendingUp className={`text-${stat.color}-500 opacity-50`} size={20} />
                      </div>
                      <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm font-medium text-gray-600">{t(stat.labelKey)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Analytics Charts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Icons.TrendingUp size={18} className="text-blue-600" />
                    <span>Last 6 months</span>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Monthly Trends */}
                  <MonthlyTrendsChart data={chartData.monthlyTrends} />

                  {/* Test Type Distribution */}
                  <TestTypeDistributionChart data={chartData.testTypeDistribution} />

                  {/* Processing Time Analytics */}
                  <ProcessingTimeChart data={chartData.processingTime} />

                  {/* Status Overview */}
                  <StatusOverviewChart data={chartData.statusOverview} />
                </div>
              </motion.div>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Results */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Icons.FileText className="text-blue-600" size={28} />
                      {t('dashboard.recentResults.title')}
                    </h3>
                    <button
                      onClick={() => {
                        setActiveView('results');
                        loadResults();
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      {t('dashboard.recentResults.viewAll')}
                    </button>
                  </div>

                  {dashboardStats?.recentResults?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardStats.recentResults.map((result, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{result.testType || t('dashboard.recentResults.fallbackName')}</p>
                              <p className="text-sm text-gray-600">{result.sampleType}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(result.status)}`}>
                              {t(`status.${result.status}`, { defaultValue: result.status })}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.createdAt && new Date(result.createdAt).toLocaleDateString(currentLang)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Icons.FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>{t('dashboard.recentResults.empty')}</p>
                    </div>
                  )}
                </motion.div>

                {/* Recent Samples */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Icons.TestTube className="text-purple-600" size={28} />
                      {t('dashboard.recentSamples.title')}
                    </h3>
                    <button
                      onClick={() => {
                        setActiveView('samples');
                        loadSamples();
                      }}
                      className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                    >
                      {t('dashboard.recentSamples.viewAll')}
                    </button>
                  </div>

                  {dashboardStats?.recentSamples?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardStats.recentSamples.map((sample, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{sample.sampleId}</p>
                              <p className="text-sm text-gray-600">{sample.sampleType}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(sample.status)}`}>
                              {t(`status.${sample.status}`, { defaultValue: sample.status })}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {sample.createdAt && new Date(sample.createdAt).toLocaleDateString(currentLang)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Icons.TestTube className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>{t('dashboard.recentSamples.empty')}</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-8 text-white"
              >
                <h3 className="text-2xl font-bold mb-4">{t('dashboard.quickActions.title')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.action}
                      className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 rounded-xl p-6 transition-all group"
                    >
                      <action.icon className="w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <p className="font-semibold">{t(action.labelKey)}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Results View */}
          {activeView === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('results.searchPlaceholder')}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    >
                      <option value="all">{t('results.filters.status.all')}</option>
                      <option value="completed">{t('results.filters.status.completed')}</option>
                      <option value="pending">{t('results.filters.status.pending')}</option>
                      <option value="in_progress">{t('results.filters.status.in_progress')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Advanced Filters Component */}
              <AdvancedFilters
                onFilterChange={handleAdvancedFilterChange}
                onClear={handleClearAdvancedFilters}
              />

              {/* Results List */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Icons.Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : filteredResults.length > 0 ? (
                <>
                  {/* Select All / Clear All */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedResults.length === filteredResults.length && filteredResults.length > 0}
                        onChange={(e) => e.target.checked ? selectAllResults() : clearSelection()}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-gray-700">
                        {selectedResults.length > 0 
                          ? `${selectedResults.length} of ${filteredResults.length} selected`
                          : 'Select all results'}
                      </span>
                    </label>
                    {selectedResults.length > 0 && (
                      <button
                        onClick={clearSelection}
                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Clear selection
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {filteredResults.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all group border-2 ${
                          selectedResults.includes(result.id) ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                        }`}
                      >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedResults.includes(result.id)}
                                onChange={() => toggleResultSelection(result.id)}
                                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                              />
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 cursor-pointer" onClick={() => setSelectedResult(result)}>
                              <div className="flex items-center gap-3 mb-2">
                                <Icons.FlaskConical className="text-blue-600 group-hover:scale-110 transition-transform" size={24} />
                                <h3 className="text-xl font-bold text-gray-900">{result.testType || t('results.fallbackTitle')}</h3>
                              </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Icons.TestTube size={16} />
                                <span><strong>{`${t('results.card.sample')}:`}</strong> {result.sampleType}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icons.Calendar size={16} />
                                <span><strong>{`${t('results.card.date')}:`}</strong> {result.createdAt ? new Date(result.createdAt).toLocaleDateString(currentLang) : t('common.na')}</span>
                              </div>
                              {result.projectName && (
                                <div className="flex items-center gap-2">
                                  <Icons.FolderOpen size={16} />
                                  <span><strong>{`${t('results.card.project')}:`}</strong> {result.projectName}</span>
                                </div>
                              )}
                            </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                              {/* Status Badge */}
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(result.status)} text-center`}>
                                {t(`status.${result.status}`, { defaultValue: result.status })}
                              </span>

                              {/* Quick Actions */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => showQRCodeModal(result.id)}
                                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all"
                                  title="Show QR Code"
                                >
                                  <Icons.QrCode size={18} />
                                </button>
                                <button
                                  onClick={() => exportLabResultToPDF(result)}
                                  className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                                  title="Export to PDF"
                                >
                                  <Icons.FileText size={18} />
                                </button>
                                <button
                                  onClick={() => exportSingleResultToExcel(result, 'Lab_Result')}
                                  className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all"
                                  title="Export to Excel"
                                >
                                  <Icons.FileSpreadsheet size={18} />
                                </button>
                              </div>

                              {/* View Details */}
                              <button 
                                onClick={() => setSelectedResult(result)}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 justify-end"
                              >
                                {t('results.card.viewDetails')}
                                <Icons.ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Icons.FileX className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">{t('results.empty')}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Samples View */}
          {activeView === 'samples' && (
            <motion.div
              key="samples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('samples.searchPlaceholder')}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                    >
                      <option value="all">{t('samples.filters.status.all')}</option>
                      <option value="submitted">{t('samples.filters.status.submitted')}</option>
                      <option value="received">{t('samples.filters.status.received')}</option>
                      <option value="processing">{t('samples.filters.status.processing')}</option>
                      <option value="completed">{t('samples.filters.status.completed')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Samples List */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Icons.Loader className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : filteredSamples.length > 0 ? (
                <div className="grid gap-4">
                  {filteredSamples.map((sample) => (
                    <motion.div
                      key={sample.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer group"
                      onClick={() => setSelectedSample(sample)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Icons.TestTube className="text-purple-600 group-hover:scale-110 transition-transform" size={24} />
                            <h3 className="text-xl font-bold text-gray-900">{sample.sampleId}</h3>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Icons.Droplet size={16} />
                              <span><strong>{`${t('samples.card.type')}:`}</strong> {sample.sampleType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icons.Calendar size={16} />
                              <span><strong>{`${t('samples.card.submitted')}:`}</strong> {sample.submittedAt ? new Date(sample.submittedAt).toLocaleDateString(currentLang) : t('common.na')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icons.MapPin size={16} />
                              <span><strong>{`${t('samples.card.location')}:`}</strong> {sample.location || t('common.na')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(sample.status)}`}>
                            {t(`status.${sample.status}`, { defaultValue: sample.status })}
                          </span>
                          <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1">
                            {t('samples.card.track')}
                            <Icons.ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Icons.TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">{t('samples.empty')}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Track Sample View */}
          {activeView === 'track' && (
            <motion.div
              key="track"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Icons.Search className="text-blue-600" size={32} />
                  {t('track.title')}
                </h2>

                <div className="flex gap-4 mb-8">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder={t('track.inputPlaceholder')}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                  <button
                    onClick={trackSample}
                    disabled={loading || !trackingId.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <Icons.Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Icons.Search size={20} />
                    )}
                    {t('track.button')}
                  </button>
                </div>

                {/* Sample Tracking Result */}
                {selectedSample && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedSample.sampleId}</h3>
                        <p className="text-gray-600">{selectedSample.sampleType}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedSample.status)}`}>
                        {t(`status.${selectedSample.status}`, { defaultValue: selectedSample.status })}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('track.submittedDate')}</p>
                        <p className="font-semibold text-gray-900">
                          {selectedSample.submittedAt ? new Date(selectedSample.submittedAt).toLocaleString(currentLang) : t('common.na')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('track.location')}</p>
                        <p className="font-semibold text-gray-900">{selectedSample.location || t('common.na')}</p>
                      </div>
                      {selectedSample.receivedAt && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('track.receivedDate')}</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(selectedSample.receivedAt).toLocaleString(currentLang)}
                          </p>
                        </div>
                      )}
                      {selectedSample.completedAt && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('track.completedDate')}</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(selectedSample.completedAt).toLocaleString(currentLang)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Timeline */}
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />
                      {[
                        { status: 'submitted', labelKey: 'status.submitted', completed: true },
                        { status: 'received', labelKey: 'status.received', completed: selectedSample.status !== 'submitted' },
                        { status: 'processing', labelKey: 'status.processing', completed: selectedSample.status === 'processing' || selectedSample.status === 'completed' },
                        { status: 'completed', labelKey: 'status.completed', completed: selectedSample.status === 'completed' }
                      ].map((stage, idx) => (
                        <div key={idx} className="relative flex items-center gap-4 mb-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            stage.completed ? 'bg-blue-600' : 'bg-gray-300'
                          }`}>
                            {stage.completed ? (
                              <Icons.Check className="text-white" size={16} />
                            ) : (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold ${stage.completed ? 'text-blue-900' : 'text-gray-500'}`}>
                              {t(stage.labelKey)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedSample.statusNotes && (
                      <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
                        <p className="text-sm font-semibold text-gray-700 mb-1">{`${t('track.notes')}:`}</p>
                        <p className="text-gray-600">{selectedSample.statusNotes}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions Toolbar */}
        <BulkActionsToolbar
          selectedCount={selectedResults.length}
          onExportExcel={handleBulkExport}
          onDownloadAll={handleBulkDownload}
          onClearSelection={clearSelection}
        />

        {/* QR Code Modal */}
        {showQRCode && qrCodeResultId && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQRCode(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <ResultQRCode resultId={qrCodeResultId} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabResultsPortal;
