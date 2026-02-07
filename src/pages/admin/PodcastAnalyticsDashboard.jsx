import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { podcastAnalyticsService } from '../../services/podcastAnalytics';
import * as Icons from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PodcastAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [viewTrends, setViewTrends] = useState([]);
  const [popularPodcasts, setPopularPodcasts] = useState([]);
  const [demographics, setDemographics] = useState(null);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [engagementBreakdown, setEngagementBreakdown] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  useEffect(() => {
    loadAllAnalytics();
  }, [timeRange]);

  const loadAllAnalytics = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const { data: stats } = await podcastAnalyticsService.getDashboardStats();
      setDashboardStats(stats);

      // Load view trends
      const { data: trends } = await podcastAnalyticsService.getViewTrends(30);
      setViewTrends(trends);

      // Load popular podcasts
      const { data: popular } = await podcastAnalyticsService.getMostPopular(10, timeRange);
      setPopularPodcasts(popular);

      // Load demographics
      const { data: demo } = await podcastAnalyticsService.getListenerDemographics();
      setDemographics(demo);

      // Load category performance
      const { data: categories } = await podcastAnalyticsService.getCategoryPerformance();
      setCategoryPerformance(categories);

      // Load engagement breakdown
      const { data: engagement } = await podcastAnalyticsService.getEngagementBreakdown(30);
      setEngagementBreakdown(engagement);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`bg-gradient-to-br ${color} backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/10 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {change >= 0 ? <Icons.TrendingUp className="w-3 h-3" /> : <Icons.TrendingDown className="w-3 h-3" />}
            <span className="text-xs font-bold">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-white/70">{title}</div>
      {subtitle && <div className="text-xs text-white/50 mt-1">{subtitle}</div>}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Icons.BarChart3 className="w-16 h-16 text-[#0066CC]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-[#0066CC] mb-2">
                📊 Analytics Dashboard
              </h1>
              <p className="text-slate-500">Real-time podcast performance metrics and insights</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2">
              {['week', 'month', 'all'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-[#003366] to-[#0066CC] text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Icons.Eye}
              title="Total Views"
              value={dashboardStats.totalViews.toLocaleString()}
              change={dashboardStats.viewChange}
              color="from-blue-50 to-blue-100"
              subtitle={`${dashboardStats.todayViews} today`}
            />
            <StatCard
              icon={Icons.Heart}
              title="Total Likes"
              value={dashboardStats.totalLikes.toLocaleString()}
              color="from-pink-500/20 to-rose-500/20"
            />
            <StatCard
              icon={Icons.Radio}
              title="Published Episodes"
              value={dashboardStats.publishedPodcasts}
              color="from-purple-500/20 to-violet-500/20"
              subtitle={`${dashboardStats.totalPodcasts} total`}
            />
            <StatCard
              icon={Icons.Users}
              title="Today's Engagement"
              value={dashboardStats.todayEngagements}
              color="from-green-500/20 to-emerald-500/20"
            />
          </div>
        )}

        {/* View Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white backdrop-blur-lg rounded-3xl p-8 border border-slate-200 shadow-sm mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Icons.TrendingUp className="w-6 h-6 text-[#0066CC]" />
            View Trends (Last 30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Popular Episodes & Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Popular Episodes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white backdrop-blur-lg rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Icons.Award className="w-6 h-6 text-yellow-400" />
              Most Popular Episodes
            </h2>
            <div className="space-y-4">
              {popularPodcasts.slice(0, 5).map((podcast, index) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 font-semibold truncate">
                      {podcast.title?.en || 'Untitled'}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Icons.Eye className="w-3 h-3" />
                        {podcast.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icons.Heart className="w-3 h-3" />
                        {podcast.likes || 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Category Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white backdrop-blur-lg rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Icons.FolderOpen className="w-6 h-6 text-purple-400" />
              Category Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="views" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Demographics & Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Listener Demographics */}
          {demographics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white backdrop-blur-lg rounded-3xl p-8 border border-slate-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Icons.Users className="w-6 h-6 text-green-400" />
                Listener Demographics
              </h2>

              {/* Total Listeners */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                <div className="text-3xl font-black text-slate-900">
                  {demographics.totalListeners.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Unique Listeners</div>
              </div>

              {/* Device Breakdown */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Top Devices</h3>
                {demographics.devices.slice(0, 5).map((device, index) => {
                  const total = demographics.devices.reduce((sum, d) => sum + d.count, 0);
                  const percentage = ((device.count / total) * 100).toFixed(1);
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 capitalize">{device.name}</span>
                        <span className="text-slate-900 font-semibold">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#003366] to-[#0066CC]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Engagement Breakdown */}
          {engagementBreakdown && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white backdrop-blur-lg rounded-3xl p-8 border border-slate-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Icons.Activity className="w-6 h-6 text-pink-400" />
                Engagement Breakdown
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Likes', value: engagementBreakdown.likes },
                      { name: 'Shares', value: engagementBreakdown.shares },
                      { name: 'Comments', value: engagementBreakdown.comments },
                      { name: 'Downloads', value: engagementBreakdown.downloads }
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Engagement Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-pink-50 rounded-xl border border-pink-500/30">
                  <div className="text-2xl font-bold text-slate-900">{engagementBreakdown.likes}</div>
                  <div className="text-xs text-slate-600">Likes</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-500/30">
                  <div className="text-2xl font-bold text-slate-900">{engagementBreakdown.shares}</div>
                  <div className="text-xs text-slate-600">Shares</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-500/30">
                  <div className="text-2xl font-bold text-slate-900">{engagementBreakdown.comments}</div>
                  <div className="text-xs text-slate-600">Comments</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-500/30">
                  <div className="text-2xl font-bold text-slate-900">{engagementBreakdown.downloads}</div>
                  <div className="text-xs text-slate-600">Downloads</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadAllAnalytics}
          className="w-full px-8 py-4 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white rounded-2xl font-bold shadow-lg hover:shadow-[#0066CC]/20 transition-all flex items-center justify-center gap-3"
        >
          <Icons.RefreshCw className="w-5 h-5" />
          Refresh Analytics
        </motion.button>
      </div>
    </div>
  );
};

export default PodcastAnalyticsDashboard;
