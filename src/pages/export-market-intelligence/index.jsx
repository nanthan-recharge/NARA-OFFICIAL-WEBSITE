import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import MultilingualContent from '../../components/compliance/MultilingualContent';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  marketPricesService,
  tradeStatisticsService,
  exportOpportunitiesService,
  marketReportsService,
  exportMarketDashboardService
} from '../../services/exportMarketService';
import { seedAllExportMarketData } from '../../utils/seedExportMarketData';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

const ExportMarketIntelligence = () => {
  const { t, i18n } = useTranslation('exportMarket');
  const language = useMemo(() => (i18n.language || 'en').split('-')[0], [i18n.language]);

  const heroStrings = t('hero', { returnObjects: true });
  const tabStrings = t('tabs', { returnObjects: true });
  const dashboardStrings = t('dashboard', { returnObjects: true });
  const pricesStrings = t('prices', { returnObjects: true });
  const opportunitiesStrings = t('opportunities', { returnObjects: true });
  const reportsStrings = t('reports', { returnObjects: true });

  const [activeView, setActiveView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [prices, setPrices] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [seeding, setSeeding] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashResult, pricesResult, oppsResult, reportsResult] = await Promise.all([
        exportMarketDashboardService.getStatistics(),
        marketPricesService.getAll({ limit: 100 }),
        exportOpportunitiesService.getAll({ status: 'active', limit: 50 }),
        marketReportsService.getAll({ limit: 20 })
      ]);

      if (dashResult.data) setDashboardData(dashResult.data);
      if (pricesResult.data) setPrices(pricesResult.data);
      if (oppsResult.data) setOpportunities(oppsResult.data);
      if (reportsResult.data) setReports(reportsResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      console.log('🌊 Starting seed process...');
      const result = await seedAllExportMarketData();
      console.log('📊 Seed result:', result);
      
      if (result.success) {
        alert(`✅ Success! Added ${result.total} records:\n\n📊 Prices: ${result.prices}\n🌍 Opportunities: ${result.opportunities}\n\nReloading data...`);
        await loadData(); // Reload data after seeding
      } else {
        const errorMsg = result.error || 'Unknown error';
        console.error('❌ Seeding failed:', errorMsg);
        alert(`❌ Error seeding data:\n\n${errorMsg}\n\nCheck browser console (F12) for details.`);
      }
    } catch (error) {
      console.error('❌ Error seeding data:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      alert(`❌ Error: ${error.message}\n\nCode: ${error.code || 'N/A'}\n\nCheck browser console (F12) for full details.`);
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const navTabs = useMemo(
    () => [
      { id: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
      { id: 'prices', label: 'Prices', icon: Icons.DollarSign },
      { id: 'opportunities', label: 'Opportunities', icon: Icons.TrendingUp },
      { id: 'reports', label: 'Reports', icon: Icons.FileText }
    ],
    [tabStrings]
  );

  const filteredPrices = useMemo(
    () =>
      prices.filter((p) => {
        const matchesSpecies = selectedSpecies === 'all' || p.species === selectedSpecies;
        const matchesMarket = selectedMarket === 'all' || p.market === selectedMarket;
        const matchesSearch = !searchQuery || 
          p.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.market?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.grade?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSpecies && matchesMarket && matchesSearch;
      }),
    [prices, selectedSpecies, selectedMarket, searchQuery]
  );

  const speciesOptions = useMemo(
    () => ['all', ...new Set(prices.map((p) => p.species))],
    [prices]
  );

  const marketOptions = useMemo(
    () => ['all', ...new Set(prices.map((p) => p.market))],
    [prices]
  );

  if (loading && !dashboardData) {
    return (
      <MultilingualContent language={language}>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
          <div className="text-xl text-emerald-900">Loading...</div>
        </div>
      </MultilingualContent>
    );
  }

  return (
    <MultilingualContent language={language}>
      <Helmet>
        <title>Export Market Intelligence - NARA</title>
        <meta name="description" content="Export market intelligence and fish trade data" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
        <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-blue-900 py-20 text-white">
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ x: 0, y: Math.random() * 300 }}
                animate={{ x: [0, Math.random() * 400 - 200], y: [null, Math.random() * 300] }}
                transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, repeatType: 'reverse' }}
              >
                <Icons.TrendingUp className="h-8 w-8" />
              </motion.div>
            ))}
          </div>

          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="mx-auto mb-6 flex items-center justify-center gap-4">
                <Icons.Globe className="h-16 w-16" />
              </div>
              <h1 className="mb-6 text-5xl font-bold md:text-6xl">Export Market Intelligence</h1>
              <p className="mx-auto mb-4 max-w-3xl text-xl text-emerald-100">Real-time export market data and intelligence</p>
              <p className="mx-auto max-w-3xl text-lg text-emerald-50">Access comprehensive fish export data, market prices, and trade opportunities</p>

              {dashboardData && (
                <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
                    <div className="text-3xl font-bold">{formatCurrency(dashboardData.overview.totalExportValue)}</div>
                    <div className="text-sm text-emerald-200">Total Export Value</div>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
                    <div className="text-3xl font-bold">{formatNumber(dashboardData.overview.totalExportVolume)} MT</div>
                    <div className="text-sm text-emerald-200">Total Export Volume</div>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
                    <div className="text-3xl font-bold">{dashboardData.overview.activeOpportunities}</div>
                    <div className="text-sm text-emerald-200">Active Opportunities</div>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
                    <div className="text-3xl font-bold">{dashboardData.overview.marketsCount}</div>
                    <div className="text-sm text-emerald-200">Global Markets</div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 shadow-lg backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium transition-all ${
                  activeView === tab.id ? 'border-b-4 border-emerald-600 bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && dashboardData && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="mb-8 grid gap-8 md:grid-cols-2">
                  <div className="rounded-xl bg-white p-6 shadow-lg">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                      <Icons.Fish className="h-6 w-6 text-emerald-600" />
                      Top Species by Export Value
                    </h3>
                    <div className="space-y-3">
                      {dashboardData.pricesBySpecies.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                          <span className="font-medium text-gray-900">{item.species}</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(item.averagePrice)}/kg</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-lg">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                      <Icons.MapPin className="h-6 w-6 text-blue-600" />
                      Top Export Markets
                    </h3>
                    <div className="space-y-3">
                      {Object.values(dashboardData.tradeByCountry).slice(0, 5).map((country, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                          <span className="font-medium text-gray-900">{country.country}</span>
                          <div className="text-right">
                            <div className="font-bold text-blue-600">{formatCurrency(country.totalValue)}</div>
                            <div className="text-xs text-gray-500">{formatNumber(country.totalVolume)} MT</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Recent Export Opportunities</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {dashboardData.activeOpportunities.map((opp) => (
                      <div key={opp.id} className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="rounded-lg bg-emerald-100 p-2">
                            <Icons.TrendingUp className="h-5 w-5 text-emerald-600" />
                          </div>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                            {opp.targetMarket}
                          </span>
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-gray-900">{opp.title}</h4>
                        <p className="mb-4 line-clamp-3 text-sm text-gray-600">{opp.description}</p>
                        <button className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'prices' && (
              <motion.div key="prices" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold text-gray-900">Market Prices</h2>
                    {prices.length > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
                        <Icons.CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {prices.length} Live Prices from Firebase
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Search Bar for Fishermen */}
                  <div className="mb-4 relative">
                    <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="🔍 Search fish species, market, or grade... (e.g., Tuna, Japan, Grade A)"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <Icons.X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-3 flex-wrap">
                    <select
                      value={selectedSpecies}
                      onChange={(e) => setSelectedSpecies(e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {speciesOptions.map((species) => (
                        <option key={species} value={species}>
                          {species === 'all' ? 'All Species' : species}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedMarket}
                      onChange={(e) => setSelectedMarket(e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {marketOptions.map((market) => (
                        <option key={market} value={market}>
                          {market === 'all' ? 'All Markets' : market}
                        </option>
                      ))}
                    </select>
                    {(searchQuery || selectedSpecies !== 'all' || selectedMarket !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedSpecies('all');
                          setSelectedMarket('all');
                        }}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Icons.X className="w-4 h-4" />
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {filteredPrices.length === 0 ? (
                  <div className="rounded-xl bg-white shadow-xl p-12 text-center">
                    <Icons.AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Prices Found</h3>
                    <p className="text-gray-600 mb-6">
                      {prices.length === 0 
                        ? "No market price data is currently available in the database."
                        : searchQuery || selectedSpecies !== 'all' || selectedMarket !== 'all'
                          ? "No prices match your search criteria. Try different filters or clear them."
                          : "No price data available."}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      {prices.length === 0 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSeedData}
                          disabled={seeding}
                          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-semibold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {seeding ? (
                            <>
                              <Icons.Loader2 className="w-5 h-5 animate-spin" />
                              Adding Sample Data...
                            </>
                          ) : (
                            <>
                              <Icons.Database className="w-5 h-5" />
                              Add Sample Data (47 Prices)
                            </>
                          )}
                        </motion.button>
                      )}
                      {(searchQuery || selectedSpecies !== 'all' || selectedMarket !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedSpecies('all');
                            setSelectedMarket('all');
                          }}
                          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl bg-white shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-emerald-600 text-white">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Species</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Market</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Price (USD/kg)</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Grade</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredPrices.slice(0, 50).map((price) => (
                            <tr key={price.id} className="transition-colors hover:bg-emerald-50">
                              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">🐟 {price.species}</td>
                              <td className="px-6 py-4 text-gray-700 whitespace-nowrap">🌍 {price.market}</td>
                              <td className="px-6 py-4 font-bold text-emerald-600 text-lg whitespace-nowrap">{formatCurrency(price.price)}/kg</td>
                              <td className="px-6 py-4 text-gray-700">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  price.grade?.toLowerCase().includes('a') ? 'bg-green-100 text-green-800' :
                                  price.grade?.toLowerCase().includes('b') ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {price.grade || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {price.recordDate?.toDate?.()?.toLocaleDateString() || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 text-center">
                      Showing {Math.min(filteredPrices.length, 50)} of {filteredPrices.length} prices
                      {filteredPrices.length > 50 && ' (showing first 50)'}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeView === 'opportunities' && (
              <motion.div key="opportunities" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="mb-6 text-3xl font-bold text-gray-900">Export Opportunities</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-emerald-100 p-3">
                            <Icons.TrendingUp className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{opp.title}</h3>
                            <span className="text-sm text-gray-500">{opp.targetMarket}</span>
                          </div>
                        </div>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">Active</span>
                      </div>
                      <p className="mb-4 text-gray-600">{opp.description}</p>
                      {opp.requirements && (
                        <div className="mb-4">
                          <div className="mb-2 text-sm font-semibold text-gray-700">Requirements</div>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {opp.requirements.slice(0, 3).map((req, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Icons.CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                        <div className="text-sm text-gray-500">
                          Posted: {opp.postedDate?.toDate?.()?.toLocaleDateString()}
                        </div>
                        <button className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700">
                          Learn More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {opportunities.length === 0 && (
                  <div className="rounded-xl bg-white py-16 text-center text-gray-500">
                    <Icons.TrendingUp className="mx-auto mb-4 h-16 w-16 opacity-30" />
                    <p>No export opportunities available at this time</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeView === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="mb-6 text-3xl font-bold text-gray-900">Market Reports</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {reports.map((report) => (
                    <div key={report.id} className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-3">
                          <Icons.FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {report.reportType?.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="mb-3 text-lg font-bold text-gray-900">{report.title}</h3>
                      <p className="mb-4 line-clamp-3 text-sm text-gray-600">{report.summary}</p>
                      <div className="mb-4 text-xs text-gray-500">
                        Published: {report.publishedDate?.toDate?.()?.toLocaleDateString()}
                      </div>
                      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
                        <Icons.Download className="h-4 w-4" />
                        Download Report
                      </button>
                    </div>
                  ))}
                </div>
                {reports.length === 0 && (
                  <div className="rounded-xl bg-white py-16 text-center text-gray-500">
                    <Icons.FileText className="mx-auto mb-4 h-16 w-16 opacity-30" />
                    <p>No market reports available at this time</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MultilingualContent>
  );
};

export default ExportMarketIntelligence;
