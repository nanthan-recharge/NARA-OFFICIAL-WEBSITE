import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Calendar,
  Eye,
  Share2,
  Clock,
  Award,
  Globe,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const StatsDashboard = ({ stats }) => {
  const [animatedStats, setAnimatedStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalShares: 0,
    averageReadTime: 0,
    totalCategories: 0
  });

  // Animate numbers on mount
  useEffect(() => {
    if (!stats) return;

    const animationDuration = 2000; // 2 seconds
    const steps = 60; // 60 FPS
    const stepDuration = animationDuration / steps;

    const targets = {
      totalArticles: stats?.totalArticles || 0,
      totalViews: stats?.totalViews || 0,
      totalShares: stats?.totalShares || 0,
      averageReadTime: stats?.averageReadTime || 0,
      totalCategories: stats?.totalCategories || 0
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedStats({
        totalArticles: Math.floor(targets?.totalArticles * easeOutQuart),
        totalViews: Math.floor(targets?.totalViews * easeOutQuart),
        totalShares: Math.floor(targets?.totalShares * easeOutQuart),
        averageReadTime: Math.floor(targets?.averageReadTime * easeOutQuart),
        totalCategories: Math.floor(targets?.totalCategories * easeOutQuart)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [stats]);

  if (!stats) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Statistics Loading</h3>
            <p className="text-gray-500">News statistics will appear here when available.</p>
          </div>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      id: 'articles',
      label: 'Total Articles',
      value: animatedStats?.totalArticles,
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Published articles covering all NARA activities',
      trend: '+12%',
      trendUp: true
    },
    {
      id: 'views',
      label: 'Total Views',
      value: animatedStats?.totalViews?.toLocaleString(),
      icon: <Eye className="w-8 h-8" />,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Article views from readers worldwide',
      trend: '+24%',
      trendUp: true
    },
    {
      id: 'shares',
      label: 'Social Shares',
      value: animatedStats?.totalShares?.toLocaleString(),
      icon: <Share2 className="w-8 h-8" />,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Times articles were shared on social media',
      trend: '+8%',
      trendUp: true
    },
    {
      id: 'readtime',
      label: 'Avg Read Time',
      value: `${animatedStats?.averageReadTime} min`,
      icon: <Clock className="w-8 h-8" />,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'Average time spent reading articles',
      trend: '+2%',
      trendUp: true
    },
    {
      id: 'categories',
      label: 'Categories',
      value: animatedStats?.totalCategories,
      icon: <Globe className="w-8 h-8" />,
      color: 'bg-teal-500',
      lightColor: 'bg-teal-100',
      textColor: 'text-teal-600',
      description: 'Different article categories available',
      trend: 'Stable',
      trendUp: null
    },
    {
      id: 'engagement',
      label: 'Engagement Rate',
      value: '94%',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      description: 'Reader engagement and interaction rate',
      trend: '+16%',
      trendUp: true
    }
  ];

  // Category breakdown data
  const categoryData = stats?.mostPopularCategory ? [
    { name: stats?.mostPopularCategory, value: 25, color: 'bg-blue-500' },
    { name: 'Research & Development', value: 20, color: 'bg-green-500' },
    { name: 'Technology & Innovation', value: 18, color: 'bg-purple-500' },
    { name: 'International Cooperation', value: 15, color: 'bg-orange-500' },
    { name: 'Others', value: 22, color: 'bg-gray-400' }
  ] : [];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-4">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium text-sm">News Analytics</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            NARA News Impact Dashboard
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Real-time insights into our news coverage, reader engagement, and content performance 
            across all NARA research and development activities.
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {dashboardStats?.map((stat, index) => (
            <motion.div
              key={stat?.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon and Trend */}
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat?.lightColor} p-3 rounded-xl`}>
                  <div className={`${stat?.textColor}`}>
                    {stat?.icon}
                  </div>
                </div>
                
                {stat?.trendUp !== null && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat?.trendUp 
                      ? 'bg-green-100 text-green-700' :'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${stat?.trendUp ? '' : 'rotate-180'}`} />
                    {stat?.trend}
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {stat?.value}
                </div>
                <div className="text-lg font-semibold text-gray-600">
                  {stat?.label}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {stat?.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min((index + 1) * 20, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`h-2 rounded-full ${stat?.color}`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Insights */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Category Distribution</h3>
                <p className="text-gray-600 text-sm">Article breakdown by category</p>
              </div>
            </div>

            <div className="space-y-4">
              {categoryData?.map((category, index) => (
                <div key={category?.name} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{category?.name}</span>
                      <span className="text-sm text-gray-500">{category?.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${category?.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-2 rounded-full ${category?.color}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Performance Highlights</h3>
                <p className="text-gray-600 text-sm">Key achievements and milestones</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <Award className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-800">Most Popular Article</div>
                  <div className="text-sm text-gray-600">Mangrove Discovery Program</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-800">High Engagement</div>
                  <div className="text-sm text-gray-600">94% reader engagement rate</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="font-semibold text-gray-800">Coverage Period</div>
                  <div className="text-sm text-gray-600">
                    {stats?.dateRange ? `${stats?.dateRange?.from} to ${stats?.dateRange?.to}` : 'Full Year Coverage'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Making Marine Science Accessible</h3>
          <p className="text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive news coverage ensures that NARA's groundbreaking research, 
            conservation efforts, and scientific achievements reach audiences worldwide, 
            fostering greater understanding and appreciation for marine science.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-blue-100">Real-time Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-blue-100">Global Reach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-blue-100">Expert Content</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-blue-100">Community Impact</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsDashboard;