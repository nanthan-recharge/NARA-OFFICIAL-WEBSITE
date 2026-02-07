import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, BarChart3, PieChart, LineChart, Award,
  Globe, FileText, Users, Download, Eye, Star, MapPin,
  Calendar, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TYPE_BAR_COLOR_MAP = {
  cyan: 'from-cyan-500 to-cyan-600',
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  amber: 'from-amber-500 to-amber-600',
  default: 'from-slate-500 to-slate-600'
};

const AREA_TEXT_COLOR_MAP = {
  cyan: 'text-cyan-300',
  blue: 'text-blue-300',
  purple: 'text-purple-300',
  green: 'text-green-300',
  pink: 'text-pink-300',
  amber: 'text-amber-300',
  default: 'text-slate-200'
};

const ImpactAnalyticsTab = () => {
  const { t } = useTranslation('researchEnhanced');
  const [timeRange, setTimeRange] = useState('year');
  const [activeChart, setActiveChart] = useState('citations');

  const rangeLabels = {
    month: t('impactAnalytics.range.month', 'Month'),
    quarter: t('impactAnalytics.range.quarter', 'Quarter'),
    year: t('impactAnalytics.range.year', 'Year'),
    all: t('impactAnalytics.range.all', 'All')
  };

  const labels = {
    heading: t('impactAnalytics.heading', 'Impact Analytics'),
    citationGrowth: t('impactAnalytics.citationGrowth.heading', 'Citation Growth'),
    citationSubheading: t('impactAnalytics.citationGrowth.subheading', '5-year trend analysis'),
    collaborationStatSuffix: t('impactAnalytics.stats.suffix', 'this year'),
    downloadHeading: t('impactAnalytics.downloads.heading', 'Monthly Downloads'),
    downloadSubheading: t('impactAnalytics.downloads.subheading', 'User access trend'),
    downloadSectionHeading: t('impactAnalytics.downloads.sectionHeading', 'Publication Downloads'),
    downloadSectionSubheading: t('impactAnalytics.downloads.sectionSubheading', 'Monthly trend for 2024'),
    impactByAreaHeading: t('impactAnalytics.impactByArea.heading', 'Impact by Research Area'),
    publicationTypesHeading: t('impactAnalytics.publicationTypes.heading', 'Publications by Type'),
    publicationTypesTotal: t('impactAnalytics.publicationTypes.total', 'Total: 1,247 publications'),
    topPublicationsHeading: t('impactAnalytics.topPublications.heading', 'Top Cited Publications'),
    topPublicationsSubheading: t('impactAnalytics.topPublications.subheading', 'Top 5 by citation count'),
    geographicHeading: t('impactAnalytics.geographic.heading', 'Global Reach'),
    activeChartCitations: t('impactAnalytics.tabs.citations', 'Citations'),
    activeChartDownloads: t('impactAnalytics.tabs.downloads', 'Downloads')
  };

  // Citation Growth Data (Last 5 years)
  const citationData = [
    { year: 2020, citations: 18234, growth: 12.3 },
    { year: 2021, citations: 21456, growth: 17.7 },
    { year: 2022, citations: 24891, growth: 16.0 },
    { year: 2023, citations: 26734, growth: 7.4 },
    { year: 2024, citations: 28439, growth: 6.4 }
  ];

  // Publications by Type
  const publicationTypes = [
    { type: t('impactAnalytics.publicationTypes.journalArticles', 'Journal Articles'), count: 847, percentage: 67.9, color: 'cyan' },
    { type: t('impactAnalytics.publicationTypes.conferencePapers', 'Conference Papers'), count: 234, percentage: 18.8, color: 'blue' },
    { type: t('impactAnalytics.publicationTypes.technicalReports', 'Technical Reports'), count: 89, percentage: 7.1, color: 'purple' },
    { type: t('impactAnalytics.publicationTypes.bookChapters', 'Book Chapters'), count: 45, percentage: 3.6, color: 'green' },
    { type: t('impactAnalytics.publicationTypes.datasets', 'Datasets'), count: 32, percentage: 2.6, color: 'amber' }
  ];

  // Research Impact by Area
  const impactByArea = [
    { area: t('impactAnalytics.impactByArea.labels.marineBiology', 'Marine Biology'), publications: 342, citations: 8921, hIndex: 34, color: 'cyan' },
    { area: t('impactAnalytics.impactByArea.labels.climateChange', 'Climate Change'), publications: 218, citations: 7234, hIndex: 29, color: 'blue' },
    { area: t('impactAnalytics.impactByArea.labels.fisheries', 'Fisheries'), publications: 189, citations: 4567, hIndex: 24, color: 'green' },
    { area: t('impactAnalytics.impactByArea.labels.oceanography', 'Oceanography'), publications: 167, citations: 3892, hIndex: 22, color: 'purple' },
    { area: t('impactAnalytics.impactByArea.labels.conservation', 'Conservation'), publications: 143, citations: 3125, hIndex: 19, color: 'pink' },
    { area: t('impactAnalytics.impactByArea.labels.policy', 'Policy'), publications: 98, citations: 1700, hIndex: 15, color: 'amber' }
  ];

  // Top Cited Publications
  const topPublications = [
    {
      title: 'Climate-Driven Changes in Sri Lankan Coral Reef Ecosystems',
      citations: 487,
      year: 2023,
      trend: 'up',
      growth: 23
    },
    {
      title: 'Microplastic Distribution Patterns in the Indian Ocean',
      citations: 412,
      year: 2022,
      trend: 'up',
      growth: 18
    },
    {
      title: 'Sustainable Fisheries Management Through AI',
      citations: 342,
      year: 2024,
      trend: 'up',
      growth: 45
    },
    {
      title: 'Blue Carbon Sequestration in Mangrove Ecosystems',
      citations: 294,
      year: 2023,
      trend: 'stable',
      growth: 5
    },
    {
      title: 'Ocean Acidification Impacts on Marine Biodiversity',
      citations: 267,
      year: 2024,
      trend: 'up',
      growth: 38
    }
  ];

  // Geographic Distribution
  const geographicData = [
    { region: t('impactAnalytics.geographic.regions.asiaPacific', 'Asia-Pacific'), citations: 10234, percentage: 36, institutions: 234 },
    { region: t('impactAnalytics.geographic.regions.europe', 'Europe'), citations: 8921, percentage: 31, institutions: 189 },
    { region: t('impactAnalytics.geographic.regions.northAmerica', 'North America'), citations: 5678, percentage: 20, institutions: 156 },
    { region: t('impactAnalytics.geographic.regions.restOfWorld', 'Rest of World'), citations: 3606, percentage: 13, institutions: 98 }
  ];

  // Collaboration Network Stats
  const collaborationStats = [
    { metric: t('impactAnalytics.stats.partnerInstitutions', 'Partner Institutions'), value: 89, change: 12, trend: 'up' },
    { metric: t('impactAnalytics.stats.countries', 'Countries'), value: 42, change: 5, trend: 'up' },
    { metric: t('impactAnalytics.stats.jointPublications', 'Joint Publications'), value: 456, change: 67, trend: 'up' },
    { metric: t('impactAnalytics.stats.internationalCoauthors', 'International Co-authors'), value: 723, change: 89, trend: 'up' }
  ];

  // Downloads Statistics
  const downloadStats = [
    { month: t('impactAnalytics.downloads.months.jan', 'Jan'), downloads: 12340 },
    { month: t('impactAnalytics.downloads.months.feb', 'Feb'), downloads: 13890 },
    { month: t('impactAnalytics.downloads.months.mar', 'Mar'), downloads: 15234 },
    { month: t('impactAnalytics.downloads.months.apr', 'Apr'), downloads: 14567 },
    { month: t('impactAnalytics.downloads.months.may', 'May'), downloads: 16789 },
    { month: t('impactAnalytics.downloads.months.jun', 'Jun'), downloads: 18234 },
    { month: t('impactAnalytics.downloads.months.jul', 'Jul'), downloads: 19456 },
    { month: t('impactAnalytics.downloads.months.aug', 'Aug'), downloads: 21234 },
    { month: t('impactAnalytics.downloads.months.sep', 'Sep'), downloads: 20123 },
    { month: t('impactAnalytics.downloads.months.oct', 'Oct'), downloads: 22456 },
    { month: t('impactAnalytics.downloads.months.nov', 'Nov'), downloads: 23789 },
    { month: t('impactAnalytics.downloads.months.dec', 'Dec'), downloads: 25123 }
  ];

  const maxCitations = Math.max(...citationData.map(d => d.citations));
  const maxDownloads = Math.max(...downloadStats.map(d => d.downloads));

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-200" />;
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">{labels.heading}</h3>
        <div className="flex gap-2">
          {['month', 'quarter', 'year', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 border'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {rangeLabels[range]}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {collaborationStats.map((stat, index) => (
          <motion.div
            key={stat.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-200">{stat.metric}</span>
              {getTrendIcon(stat.trend)}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className={`text-sm font-semibold ${
              stat.trend === 'up' ? 'text-green-400' : 
              stat.trend === 'down' ? 'text-red-400' : 
              'text-slate-200'
            }`}>
              +{stat.change} {labels.collaborationStatSuffix}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Citation Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">{labels.citationGrowth}</h4>
              <p className="text-sm text-slate-200">{labels.citationSubheading}</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/20">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
          </div>

          <div className="space-y-3">
            {citationData.map((data) => (
              <div key={data.year} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{data.year}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{data.citations.toLocaleString()}</span>
                    <span className="text-green-400 text-xs font-semibold">+{data.growth}%</span>
                  </div>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.citations / maxCitations) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Publications by Type */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">{labels.publicationTypesHeading}</h4>
              <p className="text-sm text-slate-200">{labels.publicationTypesTotal}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/20">
              <PieChart className="w-6 h-6 text-purple-400" />
            </div>
          </div>

          <div className="space-y-3">
            {publicationTypes.map((type) => {
              const typeBarClass = TYPE_BAR_COLOR_MAP[type.color] || TYPE_BAR_COLOR_MAP.default;
              return (
                <div key={type.type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{type.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{type.count}</span>
                      <span className="text-slate-200 text-xs">({type.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${type.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full bg-gradient-to-r ${typeBarClass} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Impact by Research Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">{labels.impactByAreaHeading}</h4>
            <p className="text-sm text-slate-200">{t('impactAnalytics.impactByArea.subheading', 'Publications, citations, and h-index')}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/20">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {impactByArea.map((area, index) => (
            <motion.div
              key={area.area}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <h5 className={`font-semibold mb-3 ${AREA_TEXT_COLOR_MAP[area.color] || AREA_TEXT_COLOR_MAP.default}`}>
                {area.area}
              </h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-200">{t('impactAnalytics.impactByArea.metrics.publications', 'Publications')}</span>
                  <span className="text-white font-bold">{area.publications}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-200">{t('impactAnalytics.impactByArea.metrics.citations', 'Citations')}</span>
                  <span className="text-white font-bold">{area.citations.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-200">{t('impactAnalytics.impactByArea.metrics.hIndex', 'H-Index')}</span>
                  <span className="text-white font-bold">{area.hIndex}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Cited Publications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">{labels.topPublicationsHeading}</h4>
              <p className="text-sm text-slate-200">{labels.topPublicationsSubheading}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="space-y-4">
            {topPublications.map((pub, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h5 className="text-sm text-white font-medium flex-1 line-clamp-2">
                    {pub.title}
                  </h5>
                  {getTrendIcon(pub.trend)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-200">
                    <span>{pub.year}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-semibold">{t('impactAnalytics.topPublications.citations', '{{count}} citations', { count: pub.citations })}</span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    pub.trend === 'up' ? 'text-green-400' : 'text-slate-200'
                  }`}>
                    {t('impactAnalytics.topPublications.growth', '+{{value}}% growth', { value: pub.growth })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">{labels.geographicHeading}</h4>
              <p className="text-sm text-slate-200">{t('impactAnalytics.geographic.subheading', 'Citations by region')}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
          </div>

          <div className="space-y-4">
            {geographicData.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300 text-sm">{region.region}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold text-sm">
                      {region.citations.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-200">
                      {t('impactAnalytics.geographic.institutions', '{{count}} institutions', { count: region.institutions })}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${region.percentage}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Downloads Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">{labels.downloadSectionHeading}</h4>
            <p className="text-sm text-slate-200">{labels.downloadSectionSubheading}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/20">
            <Download className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 h-48">
          {downloadStats.map((stat, index) => (
            <div key={stat.month} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(stat.downloads / maxDownloads) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg hover:from-purple-400 hover:to-pink-400 transition-all cursor-pointer relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {stat.downloads.toLocaleString()}
                </div>
              </motion.div>
              <span className="text-xs text-slate-200">{stat.month}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ImpactAnalyticsTab;
