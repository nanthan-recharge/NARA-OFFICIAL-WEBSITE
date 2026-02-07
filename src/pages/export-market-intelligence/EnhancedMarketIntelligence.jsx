import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import enhancedFishMarketService from '../../services/enhancedFishMarketService';
import realFishMarketService from '../../services/realFishMarketService';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

export default function EnhancedMarketIntelligence() {
  const { t } = useTranslation('exportMarket');
  const [activeView, setActiveView] = useState('dashboard');
  const [allPrices, setAllPrices] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [speciesList, setSpeciesList] = useState([]);
  const [marketsList, setMarketsList] = useState([]);
  const [trendData, setTrendData] = useState(null);
  const [exportIntelligence, setExportIntelligence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAllData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSpecies && selectedMarket) {
      loadTrendData(selectedSpecies, selectedMarket);
    }
  }, [selectedSpecies, selectedMarket]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Fetch REAL data from Firestore
      const pricesResult = await realFishMarketService.getRealMarketPrices();
      const speciesResult = await realFishMarketService.getAllSpecies();
      const marketsResult = await realFishMarketService.getAllMarkets();

      console.log('🔥 REAL DATA LOADED:', {
        prices: pricesResult.data?.length,
        species: speciesResult.data?.length,
        markets: marketsResult.data?.length,
        source: pricesResult.dataSource
      });

      if (pricesResult.success && pricesResult.data.length > 0) {
        setAllPrices(pricesResult.data);
      } else {
        // Fallback to mock data if Firestore is empty
        console.warn('⚠️ No real data found, using simulated data');
        const mockPrices = enhancedFishMarketService.getAllCurrentPrices();
        if (mockPrices.success) setAllPrices(mockPrices.data);
      }

      if (speciesResult.success && speciesResult.data.length > 0) {
        setSpeciesList(speciesResult.data);
        setSelectedSpecies(speciesResult.data[0].speciesKey);
      }

      if (marketsResult.success && marketsResult.data.length > 0) {
        setMarketsList(marketsResult.data);
        setSelectedMarket(marketsResult.data[0].marketKey);
      }

      // For export intelligence, use mock data (can be enhanced with real data logic)
      const exportResult = enhancedFishMarketService.getExportIntelligence();
      if (exportResult.success) setExportIntelligence(exportResult.data);

    } catch (error) {
      console.error('❌ Error loading real data:', error);
      // Fallback to mock data on error
      try {
        const mockPrices = enhancedFishMarketService.getAllCurrentPrices();
        const mockSpecies = enhancedFishMarketService.getAllSpecies();
        const mockMarkets = enhancedFishMarketService.getAllMarkets();
        const mockExport = enhancedFishMarketService.getExportIntelligence();

        if (mockPrices.success) setAllPrices(mockPrices.data);
        if (mockSpecies.success) setSpeciesList(mockSpecies.data);
        if (mockMarkets.success) setMarketsList(mockMarkets.data);
        if (mockExport.success) setExportIntelligence(mockExport.data);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTrendData = (speciesKey, marketKey) => {
    const result = enhancedFishMarketService.getPriceTrends(speciesKey, marketKey, 90);
    if (result.success) {
      setTrendData(result.data);
    }
  };

  const filteredPrices = useMemo(() => {
    return allPrices.filter(price => {
      const matchesCategory = filterCategory === 'all' || price.category === filterCategory;
      const matchesSearch = !searchTerm ||
        price.speciesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPrices, filterCategory, searchTerm]);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(allPrices.map(p => p.category))];
    return cats;
  }, [allPrices]);

  const getTrendIcon = (trend) => {
    if (trend > 2) return <Icons.TrendingUp className="h-5 w-5 text-red-500" />;
    if (trend < -2) return <Icons.TrendingDown className="h-5 w-5 text-green-500" />;
    return <Icons.Minus className="h-5 w-5 text-gray-500" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 2) return 'text-red-600 bg-red-50';
    if (trend < -2) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  const navTabs = [
    { id: 'dashboard', label: t('tabs.dashboard'), icon: Icons.LayoutDashboard },
    { id: 'trends', label: t('tabs.trends'), icon: Icons.TrendingUp },
    { id: 'markets', label: t('tabs.comparison'), icon: Icons.MapPin },
    { id: 'export', label: t('tabs.export'), icon: Icons.Globe },
    { id: 'budget', label: t('tabs.budget'), icon: Icons.DollarSign },
    { id: 'seasonal', label: t('tabs.forecast'), icon: Icons.Calendar }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <Icons.Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="text-xl text-gray-600">{t('loading.message')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-cyan-900 to-teal-900 py-16 text-white">
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ x: 0, y: Math.random() * 300 }}
              animate={{ x: [0, Math.random() * 400 - 200], y: [null, Math.random() * 300] }}
              transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, repeatType: 'reverse' }}
            >
              <Icons.Fish className="h-8 w-8" />
            </motion.div>
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Icons.Fish className="h-16 w-16" />
              <Icons.TrendingUp className="h-16 w-16" />
            </div>
            <h1 className="mb-6 text-center text-5xl font-bold md:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mb-4 max-w-3xl text-center text-xl text-cyan-100">
              {t('hero.subtitle')}
            </p>
            <p className="mx-auto max-w-3xl text-center text-lg text-cyan-50">
              {t('hero.description', { markets: marketsList.length, species: speciesList.length })}
            </p>

            {/* Real Data Badge */}
            {allPrices.length > 0 && allPrices[0].source && (
              <div className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-full border-2 border-green-400 bg-green-500/20 px-6 py-3 backdrop-blur-sm">
                <Icons.CheckCircle className="h-5 w-5 text-green-300" />
                <span className="font-bold text-green-100">{t('hero.dataBadge.label')}</span>
                <span className="text-green-200">{t('hero.dataBadge.source')}</span>
              </div>
            )}

            {/* Live Stats */}
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
                <Icons.Fish className="h-8 w-8 mb-2" />
                <div className="text-3xl font-bold">{speciesList.length}</div>
                <div className="text-sm text-cyan-200">{t('hero.stats.speciesTracked')}</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
                <Icons.MapPin className="h-8 w-8 mb-2" />
                <div className="text-3xl font-bold">{marketsList.length}</div>
                <div className="text-sm text-cyan-200">{t('hero.stats.marketsCovered')}</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
                <Icons.Clock className="h-8 w-8 mb-2" />
                <div className="text-3xl font-bold">Live</div>
                <div className="text-sm text-cyan-200">{t('hero.stats.realtimeUpdates')}</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
                <Icons.Database className="h-8 w-8 mb-2" />
                <div className="text-3xl font-bold">90</div>
                <div className="text-sm text-cyan-200">{t('hero.stats.daysHistory')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium transition-all ${
                activeView === tab.id
                  ? 'border-b-4 border-blue-600 bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {/* LIVE MARKET DASHBOARD */}
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder={t('dashboard.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? t('dashboard.filterAll') : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrices.map((price) => (
                  <motion.div
                    key={price.id}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{price.speciesName}</h3>
                        <p className="text-xs italic text-gray-500">{price.scientificName}</p>
                        <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {price.category}
                        </span>
                      </div>
                      {getTrendIcon(price.trend7days)}
                    </div>

                    <div className="mb-3">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(price.currentPrice)}
                      </div>
                      <div className="text-sm text-gray-500">{t('dashboard.priceCard.perKg')}</div>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm text-gray-600">
                        <Icons.MapPin className="inline h-4 w-4" /> {price.marketName}
                      </div>
                      <div className="text-xs text-gray-500">{price.marketLocation}</div>
                    </div>

                    <div className={`rounded-lg p-2 text-center ${getTrendColor(price.trend7days)}`}>
                      <span className="font-semibold">
                        {price.trend7days > 0 ? '+' : ''}
                        {price.trend7days.toFixed(2)}%
                      </span>
                      <span className="text-xs ml-1">{t('dashboard.priceCard.trend7day')}</span>
                    </div>

                    {price.exportDemand === 'very_high' && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 p-2 text-xs text-green-800">
                        <Icons.Globe className="h-4 w-4" />
                        {t('dashboard.priceCard.demandHigh')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PRICE TRENDS & ANALYSIS */}
          {activeView === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">{t('trends.title')}</h2>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <select
                  value={selectedSpecies || ''}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('trends.selectSpecies')}</option>
                  {speciesList.map(species => (
                    <option key={species.speciesKey} value={species.speciesKey}>
                      {species.name} ({species.category})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedMarket || ''}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('trends.selectMarket')}</option>
                  {marketsList.map(market => (
                    <option key={market.marketKey} value={market.marketKey}>
                      {market.name} - {market.location}
                    </option>
                  ))}
                </select>
              </div>

              {trendData && (
                <>
                  {/* Statistics Cards */}
                  <div className="mb-8 grid gap-6 md:grid-cols-4">
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                      <div className="mb-2 text-sm text-gray-600">{t('trends.stats.currentPrice')}</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(trendData.statistics.currentPrice)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                      <div className="mb-2 text-sm text-gray-600">{t('trends.stats.avg90Day')}</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {formatCurrency(trendData.statistics.averagePrice)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                      <div className="mb-2 text-sm text-gray-600">{t('trends.stats.priceRange')}</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(trendData.statistics.priceRange)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                      <div className="mb-2 text-sm text-gray-600">{t('trends.stats.trend30Day')}</div>
                      <div className={`text-2xl font-bold ${trendData.trends.trend30days > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {trendData.trends.trend30days > 0 ? '+' : ''}
                        {trendData.trends.trend30days.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Price History Chart */}
                  <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">{t('trends.chartTitle')}</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={trendData.historicalPrices}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="formattedDate"
                          tick={{ fontSize: 12 }}
                          interval={Math.floor(trendData.historicalPrices.length / 10)}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                        />
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), 'Price']}
                          contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#3B82F6"
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* MARKET COMPARISON */}
          {activeView === 'markets' && (
            <motion.div
              key="markets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Market Comparison</h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {marketsList.map((market) => {
                  const marketOverview = enhancedFishMarketService.getMarketOverview(market.marketKey);
                  const marketData = marketOverview.data;

                  return (
                    <div key={market.marketKey} className="rounded-xl bg-white p-6 shadow-lg">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{marketData.name}</h3>
                          <p className="text-sm text-gray-600">{marketData.location}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <Icons.Clock className="inline h-3 w-3" /> {marketData.tradingHours}
                          </p>
                        </div>
                        <Icons.MapPin className="h-8 w-8 text-blue-600" />
                      </div>

                      <p className="mb-4 text-sm text-gray-600">{marketData.description}</p>

                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-700 uppercase">Top Species Today:</div>
                        {marketData.species.slice(0, 5).map((sp) => (
                          <div key={sp.speciesKey} className="flex items-center justify-between rounded-lg bg-blue-50 p-2">
                            <span className="text-sm font-medium text-gray-800">{sp.speciesName}</span>
                            <span className="text-sm font-bold text-blue-600">
                              {formatCurrency(sp.currentPrice)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* EXPORT INTELLIGENCE */}
          {activeView === 'export' && exportIntelligence && (
            <motion.div
              key="export"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Export Market Intelligence</h2>

              <div className="mb-8 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Icons.Globe className="h-12 w-12 text-green-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Top Export Species</h3>
                    <p className="text-gray-600">High-value species for international markets</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {exportIntelligence.totalExportSpecies} Premium Species Tracked
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {exportIntelligence.topExportSpecies.map((species) => (
                  <div key={species.speciesKey} className="rounded-xl bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{species.speciesName}</h3>
                        <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          {species.category}
                        </span>
                      </div>
                      <div className="rounded-lg bg-green-100 p-2">
                        <Icons.TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Average Market Price</div>
                      <div className="text-3xl font-bold text-green-600">
                        {formatCurrency(species.averagePrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Range: {formatCurrency(species.priceRange[0])} - {formatCurrency(species.priceRange[1])}
                      </div>
                    </div>

                    <div className="rounded-lg bg-yellow-50 p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-yellow-800 mb-1">
                        <Icons.Star className="h-4 w-4" />
                        Export Demand: {species.exportDemand.replace('_', ' ').toUpperCase()}
                      </div>
                      <p className="text-xs text-gray-700">{species.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* BUDGET & SUBSIDIES */}
          {activeView === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Fisheries Sector Budget & Financial Support</h2>

              {/* Budget Overview */}
              <div className="mb-8 grid gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white shadow-xl">
                  <Icons.DollarSign className="h-12 w-12 mb-4 opacity-80" />
                  <div className="text-sm uppercase tracking-wide opacity-90 mb-2">Total Sector Budget 2025</div>
                  <div className="text-4xl font-bold mb-2">LKR 15.2B</div>
                  <div className="text-sm opacity-80">Ministry of Fisheries Allocation</div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-700 p-8 text-white shadow-xl">
                  <Icons.Users className="h-12 w-12 mb-4 opacity-80" />
                  <div className="text-sm uppercase tracking-wide opacity-90 mb-2">Active Beneficiaries</div>
                  <div className="text-4xl font-bold mb-2">125,000+</div>
                  <div className="text-sm opacity-80">Registered Fishermen</div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white shadow-xl">
                  <Icons.TrendingUp className="h-12 w-12 mb-4 opacity-80" />
                  <div className="text-sm uppercase tracking-wide opacity-90 mb-2">Export Target 2025</div>
                  <div className="text-4xl font-bold mb-2">USD 450M</div>
                  <div className="text-sm opacity-80">Fish & Seafood Exports</div>
                </div>
              </div>

              {/* Subsidy Programs */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Icons.Gift className="h-8 w-8 text-blue-600" />
                  Government Subsidy Programs
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-blue-500">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Fuel Subsidy</h4>
                        <p className="text-sm text-gray-600">For multi-day fishing boats</p>
                      </div>
                      <Icons.Fuel className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mb-3 text-3xl font-bold text-blue-600">LKR 50/liter</div>
                    <div className="text-sm text-gray-700 mb-4">
                      Maximum 5,000 liters per month per registered vessel
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2">
                      <Icons.CheckCircle className="h-4 w-4" />
                      <span>Apply at District Fisheries Office</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-green-500">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Ice Subsidy</h4>
                        <p className="text-sm text-gray-600">Quality preservation support</p>
                      </div>
                      <Icons.Snowflake className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mb-3 text-3xl font-bold text-green-600">LKR 25/kg</div>
                    <div className="text-sm text-gray-700 mb-4">
                      For deep-sea fishing operations (up to 1 ton per trip)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2">
                      <Icons.CheckCircle className="h-4 w-4" />
                      <span>Claim with trip documentation</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-yellow-500">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Gear Subsidy</h4>
                        <p className="text-sm text-gray-600">Fishing equipment support</p>
                      </div>
                      <Icons.Anchor className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="mb-3 text-3xl font-bold text-yellow-600">50% Coverage</div>
                    <div className="text-sm text-gray-700 mb-4">
                      Up to LKR 250,000 for nets, lines & sustainable gear
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2">
                      <Icons.CheckCircle className="h-4 w-4" />
                      <span>Annual application period: Jan-Mar</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-purple-500">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Insurance Support</h4>
                        <p className="text-sm text-gray-600">Life & vessel insurance</p>
                      </div>
                      <Icons.Shield className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mb-3 text-3xl font-bold text-purple-600">75% Premium</div>
                    <div className="text-sm text-gray-700 mb-4">
                      Government covers 75% of insurance premiums
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2">
                      <Icons.CheckCircle className="h-4 w-4" />
                      <span>Via National Insurance Trust Fund</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Schemes */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Icons.Banknote className="h-8 w-8 text-green-600" />
                  Low-Interest Loan Schemes
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Boat Purchase Loan</h4>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="font-bold">Up to LKR 5M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-bold text-green-600">4% per annum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repayment:</span>
                        <span className="font-bold">7 years</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 bg-white rounded p-2">
                      Contact: Bank of Ceylon Fisheries Division
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Working Capital</h4>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="font-bold">Up to LKR 500K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-bold text-blue-600">6% per annum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repayment:</span>
                        <span className="font-bold">3 years</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 bg-white rounded p-2">
                      For fuel, ice, and operational expenses
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Aquaculture Investment</h4>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="font-bold">Up to LKR 3M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-bold text-purple-600">5% per annum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repayment:</span>
                        <span className="font-bold">5 years</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 bg-white rounded p-2">
                      For shrimp & fish farming operations
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Incentives */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Icons.Plane className="h-8 w-8 text-blue-600" />
                  Export Incentives & Support
                </h3>
                <div className="rounded-xl bg-white p-8 shadow-lg">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex gap-4">
                      <div className="rounded-lg bg-blue-100 p-3 h-fit">
                        <Icons.Award className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Export Development Fund</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          15% rebate on export value for certified sustainable seafood exports
                        </p>
                        <div className="text-xs text-blue-600 font-medium">Max LKR 5M per exporter annually</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="rounded-lg bg-green-100 p-3 h-fit">
                        <Icons.BadgeCheck className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Quality Certification Support</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          100% reimbursement for HACCP, EU, and ISO certification costs
                        </p>
                        <div className="text-xs text-green-600 font-medium">Processing plants & exporters</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="rounded-lg bg-purple-100 p-3 h-fit">
                        <Icons.Truck className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Cold Chain Infrastructure</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          60% subsidy for refrigerated transport & storage facilities
                        </p>
                        <div className="text-xs text-purple-600 font-medium">Up to LKR 10M investment</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="rounded-lg bg-yellow-100 p-3 h-fit">
                        <Icons.BookOpen className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Market Access Training</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Free training on export procedures, quality standards & market requirements
                        </p>
                        <div className="text-xs text-yellow-600 font-medium">NARA & Export Development Board</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl bg-gradient-to-r from-blue-900 to-cyan-900 text-white p-8">
                <h3 className="text-2xl font-bold mb-4">Need Help Accessing Funds?</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-bold mb-2">Ministry of Fisheries</h4>
                    <div className="space-y-1 text-sm text-cyan-100">
                      <p className="flex items-center gap-2">
                        <Icons.Phone className="h-4 w-4" />
                        +94 11 2446183
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.Mail className="h-4 w-4" />
                        info@fisheries.gov.lk
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.MapPin className="h-4 w-4" />
                        New Secretariat, Maligawatta, Colombo 10
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">NARA Assistance</h4>
                    <div className="space-y-1 text-sm text-cyan-100">
                      <p className="flex items-center gap-2">
                        <Icons.Phone className="h-4 w-4" />
                        +94 11 2521000
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.Mail className="h-4 w-4" />
                        info@nara.ac.lk
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.Globe className="h-4 w-4" />
                        Financial assistance program guidance available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SEASONAL FORECAST */}
          {activeView === 'seasonal' && (
            <motion.div
              key="seasonal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Seasonal Forecast & Planning</h2>

              <div className="grid gap-6">
                {speciesList.map((species) => {
                  const detail = enhancedFishMarketService.getSpeciesDetail(species.speciesKey);
                  if (!detail.success) return null;

                  const speciesData = detail.data;

                  return (
                    <div key={species.speciesKey} className="rounded-xl bg-white p-6 shadow-lg">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{speciesData.name}</h3>
                          <p className="text-sm italic text-gray-600">{speciesData.scientificName}</p>
                          <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                            {speciesData.category}
                          </span>
                        </div>
                        <Icons.Calendar className="h-8 w-8 text-blue-600" />
                      </div>

                      <p className="mb-4 text-sm text-gray-600">{speciesData.description}</p>

                      <div className="mb-4">
                        <h4 className="mb-2 font-semibold text-gray-800">3-Month Forecast:</h4>
                        <div className="grid gap-3 md:grid-cols-3">
                          {speciesData.seasonalForecast.map((forecast, idx) => (
                            <div
                              key={idx}
                              className={`rounded-lg p-4 ${
                                forecast.outlook === 'high_supply'
                                  ? 'bg-green-50 border border-green-200'
                                  : forecast.outlook === 'low_supply'
                                  ? 'bg-red-50 border border-red-200'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="mb-2 text-lg font-bold text-gray-900">{forecast.month}</div>
                              <div className="text-sm">
                                <div className="font-medium">
                                  Supply: <span className={forecast.outlook === 'high_supply' ? 'text-green-600' : forecast.outlook === 'low_supply' ? 'text-red-600' : 'text-gray-600'}>
                                    {forecast.outlook.replace('_', ' ')}
                                  </span>
                                </div>
                                <div>
                                  Price: <span className={forecast.priceExpectation === 'lower' ? 'text-green-600' : forecast.priceExpectation === 'higher' ? 'text-red-600' : 'text-gray-600'}>
                                    {forecast.priceExpectation}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 font-semibold text-gray-800">Current Market Prices:</h4>
                        <div className="grid gap-2 md:grid-cols-3">
                          {speciesData.marketPrices.slice(0, 3).map((mp) => (
                            <div key={mp.marketKey} className="rounded-lg bg-blue-50 p-3">
                              <div className="text-xs text-gray-600">{mp.marketName}</div>
                              <div className="text-lg font-bold text-blue-600">
                                {formatCurrency(mp.currentPrice)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 font-bold text-gray-900">For Fishermen</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Icons.Check className="h-4 w-4 text-green-600 mt-0.5" />
                  Real-time price updates from major markets
                </li>
                <li className="flex items-start gap-2">
                  <Icons.Check className="h-4 w-4 text-green-600 mt-0.5" />
                  Seasonal forecasts for catch planning
                </li>
                <li className="flex items-start gap-2">
                  <Icons.Check className="h-4 w-4 text-green-600 mt-0.5" />
                  Export demand indicators
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-bold text-gray-900">For Traders</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Icons.Check className="h-4 w-4 text-blue-600 mt-0.5" />
                  Market comparison tools
                </li>
                <li className="flex items-start gap-2">
                  <Icons.Check className="h-4 w-4 text-blue-600 mt-0.5" />
                  90-day historical trends
                </li>
                <li className="flex items-start gap-2">
                  <Icons.Check className="h-4 w-4 text-blue-600 mt-0.5" />
                  Price analytics and insights
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-bold text-gray-900">For Researchers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Icons.Check className="h-4 w-4 text-purple-600 mt-0.5" />
                  Comprehensive species database
                </li>
                <li className="flex items-start gap-2">
                  <Icons.Check className="h-4 w-4 text-purple-600 mt-0.5" />
                  Seasonal pattern analysis
                </li>
                <li className="flex items-start gap-2">
                  <Icons.Check className="h-4 w-4 text-purple-600 mt-0.5" />
                  Export market intelligence
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
