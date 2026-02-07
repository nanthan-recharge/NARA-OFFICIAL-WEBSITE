import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import {
  fishAdvisoryService,
  fishingZonesService,
  fishMarketPricesService,
  seasonalRestrictionsService,
  fishAdvisoryDashboardService
} from '../../services/fishAdvisoryService';
import { seedFishAdvisoryData } from '../../utils/seedFishAdvisoryData';

const FishAdvisorySystem = () => {
  const { t, i18n } = useTranslation('fishAdvisory');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [advisories, setAdvisories] = useState([]);
  const [zones, setZones] = useState([]);
  const [prices, setPrices] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    console.log('🔄 Loading fish advisory data...');
    setLoading(true);
    try {
      const [advisoriesResult, zonesResult, pricesResult, restrictionsResult] = await Promise.all([
        fishAdvisoryService.getAll({ limit: 50 }),
        fishingZonesService.getAll(),
        fishMarketPricesService.getLatest(20),
        seasonalRestrictionsService.getAll({ limit: 50 })
      ]);

      console.log('📊 Raw data received:', {
        advisories: advisoriesResult.data?.length || 0,
        zones: zonesResult.data?.length || 0,
        prices: pricesResult.data?.length || 0,
        restrictions: restrictionsResult.data?.length || 0
      });

      // Filter active advisories client-side
      const activeAdvisories = advisoriesResult.data?.filter(a => a.status === 'active') || [];
      console.log('✅ Active advisories:', activeAdvisories.length);
      setAdvisories(activeAdvisories);

      // Set zones
      const allZones = zonesResult.data || [];
      console.log('🗺️ Zones:', allZones.length);
      setZones(allZones);

      // Set prices
      const allPrices = pricesResult.data || [];
      console.log('💰 Prices:', allPrices.length);
      setPrices(allPrices);

      // Filter active restrictions client-side
      const activeRestrictions = restrictionsResult.data?.filter(r => r.status === 'active') || [];
      console.log('🚫 Active restrictions:', activeRestrictions.length);
      setRestrictions(activeRestrictions);

      // Calculate statistics manually from the retrieved data
      const openZones = allZones.filter(z => z.status === 'open').length;
      const restrictedZones = allZones.filter(z => z.status === 'restricted').length;
      const closedZones = allZones.filter(z => z.status === 'closed').length;

      const stats = {
        advisories: {
          total: advisoriesResult.data?.length || 0,
          active: activeAdvisories.length,
          critical: activeAdvisories.filter(a => a.severity === 'critical').length
        },
        zones: {
          total: allZones.length,
          open: openZones,
          restricted: restrictedZones,
          closed: closedZones
        },
        prices: {
          total: allPrices.length,
          updated: allPrices[0]?.date || new Date()
        },
        restrictions: {
          total: restrictionsResult.data?.length || 0,
          active: activeRestrictions.length
        }
      };

      console.log('📈 Calculated statistics:', stats);
      setStatistics(stats);

    } catch (error) {
      console.error('❌ Error loading fish advisory data:', error);
    } finally {
      setLoading(false);
      console.log('✅ Loading complete');
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm('This will add sample data to the database. Continue?')) {
      return;
    }

    setSeeding(true);
    try {
      const result = await seedFishAdvisoryData();
      if (result.success) {
        alert(`✅ Successfully seeded data!\n\nAdded:\n- ${result.counts.advisories} Advisories\n- ${result.counts.zones} Zones\n- ${result.counts.prices} Prices\n- ${result.counts.restrictions} Restrictions\n\nReloading data...`);

        // Wait a moment for Firebase to process, then reload
        setTimeout(async () => {
          await loadDashboardData();
          setSeeding(false);
          alert('✅ Data loaded! Check the Dashboard, Advisories, Zones, and Prices tabs.');
        }, 1000);
      } else {
        alert('❌ Error seeding data: ' + result.error);
        setSeeding(false);
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('❌ Failed to seed data: ' + error.message);
      setSeeding(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: t('tabs.dashboard', { defaultValue: 'Dashboard' }), icon: Icons.LayoutDashboard },
    { id: 'advisories', label: t('tabs.advisories', { defaultValue: 'Advisories' }), icon: Icons.Fish },
    { id: 'zones', label: t('tabs.zones', { defaultValue: 'Fishing Zones' }), icon: Icons.MapPin },
    { id: 'prices', label: t('tabs.prices', { defaultValue: 'Market Prices' }), icon: Icons.TrendingUp }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'from-red-500 to-rose-600',
      high: 'from-orange-500 to-amber-600',
      medium: 'from-yellow-500 to-orange-600',
      low: 'from-green-500 to-emerald-600'
    };
    return colors[severity] || colors.low;
  };

  const getZoneStatusColor = (status) => {
    const colors = {
      open: 'from-green-500 to-emerald-600',
      restricted: 'from-yellow-500 to-orange-600',
      closed: 'from-red-500 to-rose-600'
    };
    return colors[status] || colors.open;
  };

  const renderDashboard = () => (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm mb-1">{t('dashboard.stats.activeAdvisories', { defaultValue: 'Active Advisories' })}</p>
              <p className="text-3xl font-bold text-white">{statistics?.advisories?.active || 0}</p>
            </div>
            <Icons.Fish className="w-12 h-12 text-cyan-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm mb-1">{t('dashboard.stats.openZones', { defaultValue: 'Open Zones' })}</p>
              <p className="text-3xl font-bold text-white">{statistics?.zones?.open || 0}</p>
            </div>
            <Icons.MapPin className="w-12 h-12 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm mb-1">{t('dashboard.stats.priceUpdates', { defaultValue: 'Price Updates' })}</p>
              <p className="text-3xl font-bold text-white">{statistics?.prices?.total || 0}</p>
            </div>
            <Icons.TrendingUp className="w-12 h-12 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm mb-1">{t('dashboard.stats.activeRestrictions', { defaultValue: 'Active Restrictions' })}</p>
              <p className="text-3xl font-bold text-white">{statistics?.restrictions?.active || 0}</p>
            </div>
            <Icons.Calendar className="w-12 h-12 text-orange-400" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('advisories')}
          className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 text-left group"
        >
          <Icons.AlertCircle className="w-10 h-10 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{t('dashboard.quickActions.viewAdvisories.title', { defaultValue: 'View Advisories' })}</h3>
          <p className="text-slate-200 text-sm">{t('dashboard.quickActions.viewAdvisories.description', { defaultValue: 'Check active fish advisories and warnings' })}</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('zones')}
          className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 text-left group"
        >
          <Icons.Map className="w-10 h-10 text-green-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{t('dashboard.quickActions.fishingZones.title', { defaultValue: 'Fishing Zones' })}</h3>
          <p className="text-slate-200 text-sm">{t('dashboard.quickActions.fishingZones.description', { defaultValue: 'View fishing zone status and regulations' })}</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('prices')}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 text-left group"
        >
          <Icons.DollarSign className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{t('dashboard.quickActions.marketPrices.title', { defaultValue: 'Market Prices' })}</h3>
          <p className="text-slate-200 text-sm">{t('dashboard.quickActions.marketPrices.description', { defaultValue: 'Check latest fish market prices' })}</p>
        </motion.button>
      </div>

      {/* Recent Advisories */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Icons.Bell className="w-6 h-6 text-cyan-400" />
          {t('dashboard.recentAdvisories', { defaultValue: 'Recent Advisories' })}
        </h2>
        <div className="space-y-4">
          {advisories.slice(0, 3).map((advisory) => (
            <motion.div
              key={advisory.id}
              whileHover={{ x: 5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSeverityColor(advisory.severity)} text-white`}>
                      {advisory.severity?.toUpperCase()}
                    </span>
                    <span className="text-slate-200 text-sm">{advisory.species}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{advisory.title?.en || advisory.title}</h3>
                  <p className="text-slate-200 text-sm">{advisory.description?.en || advisory.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {advisories.length === 0 && (
            <div className="p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 text-center">
              <Icons.CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-200">{t('dashboard.noAdvisories', { defaultValue: 'No active advisories at this time' })}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderAdvisories = () => (
    <motion.div
      key="advisories"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t('advisories.title', { defaultValue: 'Fish Advisories' })}</h2>
        <div className="flex items-center gap-2">
          <Icons.AlertCircle className="w-5 h-5 text-cyan-400" />
          <span className="text-slate-200 text-sm">{advisories.length} {t('advisories.count', { defaultValue: 'active' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {advisories.map((advisory) => (
          <motion.div
            key={advisory.id}
            whileHover={{ scale: 1.01, y: -3 }}
            className={`relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-l-4 overflow-hidden group`}
            style={{ borderLeftColor: advisory.severity === 'critical' ? '#ef4444' : advisory.severity === 'high' ? '#f97316' : '#10b981' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSeverityColor(advisory.severity)} text-white`}>
                      {advisory.severity?.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      {advisory.species}
                    </span>
                    {advisory.zone && (
                      <span className="text-slate-200 text-sm flex items-center gap-1">
                        <Icons.MapPin className="w-4 h-4" />
                        {advisory.zone}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{advisory.title?.en || advisory.title}</h3>
                  <p className="text-slate-200 mb-4">{advisory.description?.en || advisory.description}</p>
                </div>
                <Icons.Fish className="w-12 h-12 text-cyan-400/30" />
              </div>

              {advisory.validUntil && (
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <Icons.Clock className="w-4 h-4" />
                  <span>{t('advisories.validUntil', { defaultValue: 'Valid until' })}: {new Date(advisory.validUntil).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {advisories.length === 0 && (
          <div className="p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 text-center">
            <Icons.CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('advisories.noActive.title', { defaultValue: 'No Active Advisories' })}</h3>
            <p className="text-slate-200">{t('advisories.noActive.description', { defaultValue: 'All fishing areas are safe at this time' })}</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderZones = () => (
    <motion.div
      key="zones"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t('zones.title', { defaultValue: 'Fishing Zones' })}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-200 text-sm">{t('zones.legend.open', { defaultValue: 'Open' })}: {statistics?.zones?.open || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-slate-200 text-sm">{t('zones.legend.restricted', { defaultValue: 'Restricted' })}: {statistics?.zones?.restricted || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-200 text-sm">{t('zones.legend.closed', { defaultValue: 'Closed' })}: {statistics?.zones?.closed || 0}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <motion.div
            key={zone.id}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${zone.status === 'open' ? 'from-green-400/20 to-emerald-600/20' : zone.status === 'restricted' ? 'from-yellow-400/20 to-orange-600/20' : 'from-red-400/20 to-rose-600/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{zone.name?.en || zone.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getZoneStatusColor(zone.status)} text-white`}>
                    {zone.status?.toUpperCase()}
                  </span>
                </div>
                <Icons.MapPin className="w-8 h-8 text-cyan-400/50" />
              </div>

              <p className="text-slate-200 text-sm mb-4">{zone.description?.en || zone.description}</p>

              {zone.coordinates && (
                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Icons.Navigation className="w-3 h-3" />
                    <span>{t('zones.coordinates', { defaultValue: 'Coordinates' })}: {zone.coordinates.lat}, {zone.coordinates.lng}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {zones.length === 0 && (
          <div className="col-span-3 p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 text-center">
            <Icons.MapPin className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('zones.noZones.title', { defaultValue: 'No Zones Available' })}</h3>
            <p className="text-slate-200">{t('zones.noZones.description', { defaultValue: 'Fishing zone data will be displayed here' })}</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderPrices = () => (
    <motion.div
      key="prices"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t('prices.title', { defaultValue: 'Fish Market Prices' })}</h2>
        <div className="flex items-center gap-2">
          <Icons.TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="text-slate-200 text-sm">{t('prices.latestUpdates', { defaultValue: 'Latest updates' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prices.map((price) => (
          <motion.div
            key={price.id}
            whileHover={{ scale: 1.02, y: -3 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{price.species?.en || price.species}</h3>
                  <p className="text-slate-200 text-sm">{price.market?.en || price.market}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Rs. {price.price}
                  </p>
                  <p className="text-slate-200 text-xs">{t('prices.perKg', { defaultValue: 'per kg' })}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{t('prices.lastUpdated', { defaultValue: 'Last updated' })}</span>
                <span className="text-slate-200">{price.date ? new Date(price.date).toLocaleDateString() : 'N/A'}</span>
              </div>

              {price.priceChange && (
                <div className={`mt-3 flex items-center gap-2 text-sm ${price.priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {price.priceChange > 0 ? <Icons.TrendingUp className="w-4 h-4" /> : <Icons.TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(price.priceChange)}% {price.priceChange > 0 ? t('prices.increase', { defaultValue: 'increase' }) : t('prices.decrease', { defaultValue: 'decrease' })}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {prices.length === 0 && (
          <div className="col-span-2 p-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 text-center">
            <Icons.DollarSign className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('prices.noPrices.title', { defaultValue: 'No Price Data Available' })}</h3>
            <p className="text-slate-200">{t('prices.noPrices.description', { defaultValue: 'Market price data will be displayed here' })}</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
      <Helmet>
        <title>{t('meta.title', { defaultValue: 'Fish Advisory System - NARA' })}</title>
        <meta name="description" content={t('meta.description', { defaultValue: 'Real-time fish advisories, fishing zones, and market prices' })} />
      </Helmet>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative overflow-hidden pt-32 pb-24 px-4"
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Icons.Fish className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">{t('hero.badge', { defaultValue: 'Live Data System' })}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                {t('hero.title', { defaultValue: 'Fish Advisory' })}
              </span>
              <br />
              <span className="text-white">{t('hero.highlight', { defaultValue: 'System' })}</span>
            </h1>

            <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8">
              {t('hero.subtitle', { defaultValue: 'Real-time fish advisories, fishing zone status, and market prices for Sri Lankan waters' })}
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('advisories')}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-600 hover:to-navy-700 font-semibold text-white shadow-lg shadow-navy-500/25 transition-all"
                >
                  {t('hero.primaryCta', { defaultValue: 'View Advisories' })}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('zones')}
                  className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 font-semibold text-white transition-all"
                >
                  {t('hero.secondaryCta', { defaultValue: 'Fishing Zones' })}
                </motion.button>
              </div>

              {/* Seed Data Button - Show only when database is empty */}
              {!loading && statistics && statistics.advisories?.total === 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSeedData}
                  disabled={seeding}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-semibold text-white shadow-lg shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {seeding ? (
                    <>
                      <Icons.Loader2 className="w-5 h-5 animate-spin" />
                      Seeding Data...
                    </>
                  ) : (
                    <>
                      <Icons.Database className="w-5 h-5" />
                      Add Sample Data
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-200 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'advisories' && renderAdvisories()}
            {activeTab === 'zones' && renderZones()}
            {activeTab === 'prices' && renderPrices()}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default FishAdvisorySystem;
