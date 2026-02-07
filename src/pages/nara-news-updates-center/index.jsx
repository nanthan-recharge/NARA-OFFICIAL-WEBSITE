import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Calendar,
  MapPin,
  Tag,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Clock,
  User,
  Eye,
  Share2,
  Star,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useNewsArticles from '../../hooks/useNewsArticles';
import usePageContent from '../../hooks/usePageContent';
import NewsHeader from './components/NewsHeader';
import ShareMenu from './components/ShareMenu';
import { autoTranslateArticle, translateCategory, translateTerm, translateDate, formatReadTime } from '../../utils/newsTranslation';

const DATE_LOCALES = {
  en: 'en-US',
  ta: 'ta-LK',
  si: 'si-LK'
};

const CATEGORY_COLOR_MAP = {
  'Education & Outreach': 'bg-blue-100 text-blue-800 border-blue-200',
  'Research & Development': 'bg-purple-100 text-purple-800 border-purple-200',
  'Policy & Management': 'bg-green-100 text-green-800 border-green-200',
  'Technology & Innovation': 'bg-orange-100 text-orange-800 border-orange-200',
  'Environmental Initiatives': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Conservation & Awareness': 'bg-teal-100 text-teal-800 border-teal-200',
  'Community Development': 'bg-pink-100 text-pink-800 border-pink-200',
  'Capacity Building': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Technology Integration': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'International Cooperation': 'bg-red-100 text-red-800 border-red-200',
  'Industry Support': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Industry Development': 'bg-amber-100 text-amber-800 border-amber-200',
  'Cultural Events': 'bg-violet-100 text-violet-800 border-violet-200',
  'Institutional Milestones': 'bg-slate-100 text-slate-800 border-slate-200',
  'Conservation Partnerships': 'bg-lime-100 text-lime-800 border-lime-200'
};

const slugifyKey = (value = '') =>
  value
    ?.toString()
    ?.trim()
    ?.toLowerCase()
    ?.replace(/[^a-z0-9]+/g, '-')
    ?.replace(/(^-|-$)/g, '');

const localizeArticle = (article, language) => {
  if (!article) return null;
  
  // Use the auto-translation utility which handles both pre-translated and fallback content
  return autoTranslateArticle(article, language);
};

const NewsPage = () => {
  const { t, i18n } = useTranslation('news');
  const {
    articles: rawArticles,
    metadata,
    latestArticles: rawLatestArticles,
    isLoading: isNewsLoading,
    error: newsError,
    source: newsSource
  } = useNewsArticles();
  const { heroContent, isLoading: isHeroLoading } = usePageContent('nara-news-updates-center');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isFiltering, setIsFiltering] = useState(false);

  const articlesPerPage = 9;

  const localizedArticles = useMemo(
    () => rawArticles?.map(article => localizeArticle(article, i18n.language)) || [],
    [rawArticles, i18n.language]
  );

  const localizedLatestArticles = useMemo(
    () => rawLatestArticles?.map(article => localizeArticle(article, i18n.language)) || [],
    [rawLatestArticles, i18n.language]
  );

  const [filteredArticles, setFilteredArticles] = useState(localizedArticles);

  useEffect(() => {
    setFilteredArticles(localizedArticles);
  }, [localizedArticles]);

  const availableCategories = useMemo(() => {
    const categorySet = new Set();
    localizedArticles?.forEach(article => {
      if (article?.category) categorySet.add(article.category);
    });
    if (metadata?.categories) {
      Object.keys(metadata.categories).forEach(category => categorySet.add(category));
    }
    return ['all', ...Array.from(categorySet)];
  }, [localizedArticles, metadata?.categories]);

  useEffect(() => {
    setIsFiltering(true);
    setCurrentPage(1);

    const timer = setTimeout(() => {
      let working = [...(localizedArticles || [])];

      if (selectedCategory !== 'all') {
        working = working.filter(article => article?.category === selectedCategory);
      }

      if (searchTerm) {
        const needle = searchTerm.trim().toLowerCase();
        working = working.filter(article => {
          const baseMatch = [
            article?.displayTitle,
            article?.displaySummary,
            article?.displayContent,
            article?.displayAuthor,
            article?.displayLocation
          ]
            .filter(Boolean)
            .some(value => value?.toLowerCase()?.includes(needle));
          const tagMatch = (article?.displayTags || []).some(tag =>
            tag?.toLowerCase()?.includes(needle)
          );
          return baseMatch || tagMatch;
        });
      }

      if (dateRange?.start || dateRange?.end) {
        working = working.filter(article => {
          const articleDate = article?.date ? new Date(article.date) : null;
          if (!articleDate || Number.isNaN(articleDate)) return false;
          const startDate = dateRange?.start ? new Date(dateRange.start) : null;
          const endDate = dateRange?.end ? new Date(dateRange.end) : null;
          if (startDate && articleDate < startDate) return false;
          if (endDate && articleDate > endDate) return false;
          return true;
        });
      }

      working.sort((a, b) => {
        const compareNumeric = (valA, valB) =>
          sortOrder === 'asc' ? valA - valB : valB - valA;
        const compareString = (valA, valB) =>
          sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

        switch (sortBy) {
          case 'views':
            return compareNumeric(a?.views || 0, b?.views || 0);
          case 'shares':
            return compareNumeric(a?.social_shares || 0, b?.social_shares || 0);
          case 'title':
            return compareString(
              a?.displayTitle?.toLowerCase() || '',
              b?.displayTitle?.toLowerCase() || ''
            );
          case 'category':
            return compareString(
              a?.displayCategory?.toLowerCase() || '',
              b?.displayCategory?.toLowerCase() || ''
            );
          case 'date':
          default: {
            const dateA = a?.date ? new Date(a.date).getTime() : 0;
            const dateB = b?.date ? new Date(b.date).getTime() : 0;
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          }
        }
      });

      setFilteredArticles(working);
      setIsFiltering(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [localizedArticles, selectedCategory, searchTerm, sortBy, sortOrder, dateRange]);

  const totalPages = Math.max(1, Math.ceil((filteredArticles?.length || 0) / articlesPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const currentArticles =
    filteredArticles?.slice(indexOfLastArticle - articlesPerPage, indexOfLastArticle) || [];

  const formatDate = (dateString) => {
    if (!dateString) return t('articles.datePending');
    try {
      const locale = DATE_LOCALES[i18n.language] || 'en-US';
      return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getCategoryColor = (category) =>
    CATEGORY_COLOR_MAP[category] || 'bg-gray-100 text-gray-800 border-gray-200';

  const getCategoryLabel = (category) => {
    if (!category || category === 'all') {
      return t('filters.allCategories');
    }
    return t(`categories.${slugifyKey(category)}`, { defaultValue: category });
  };

  const formatStatNumber = (value) => {
    if (value == null) return '—';
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return value;
    }
    try {
      return numeric.toLocaleString();
    } catch (error) {
      return numeric;
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('date');
    setSortOrder('desc');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    const [nextSortBy, nextSortOrder] = value.split('-');
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeLoading = isNewsLoading || isHeroLoading || isFiltering;
  const selectedCategoryLabel = getCategoryLabel(selectedCategory);
  const filtersApplied =
    selectedCategory !== 'all' || searchTerm || dateRange?.start || dateRange?.end;
  const heroTickerArticles =
    localizedLatestArticles?.length > 0
      ? localizedLatestArticles
      : localizedArticles?.slice(0, 5);
  const resultsSummary = t('results.summary', {
    count: currentArticles?.length || 0,
    total: filteredArticles?.length || 0
  });

  const spotlightArticle = currentArticles?.[0] || null;
  const supportingArticles = currentArticles?.slice(1) || [];
  const featureGridArticles = supportingArticles.slice(0, 4);
  const timelineArticles = supportingArticles.slice(4);
  const adminStatusKey = newsError
    ? 'error'
    : newsSource === 'firestore'
      ? 'connected'
      : newsSource === 'local' || newsSource === 'empty'
        ? 'cached'
        : newsSource === 'error'
          ? 'error'
          : 'unknown';
  const adminStatusMessage = t(`layout.admin.${adminStatusKey}`, {
    defaultValue:
      adminStatusKey === 'connected'
        ? 'Live sync with newsroom admin'
        : adminStatusKey === 'cached'
          ? 'Showing cached newsroom dataset'
          : adminStatusKey === 'error'
            ? 'Using fallback newsroom data'
            : 'Newsroom status unknown'
  });
  const newsSourceLabel =
    newsSource === 'firestore'
      ? t('layout.admin.sourceLive', { defaultValue: 'Live feed' })
      : newsSource === 'local'
        ? t('layout.admin.sourceLocal', { defaultValue: 'Local dataset' })
        : newsSource === 'empty'
          ? t('layout.admin.sourceFallback', { defaultValue: 'Fallback content' })
          : newsSource || t('layout.admin.sourceUnknown', { defaultValue: 'Unknown' });
  const lastUpdatedSource = metadata?.latest_date || spotlightArticle?.date || null;
  const lastUpdatedLabel = lastUpdatedSource
    ? formatDate(lastUpdatedSource)
    : t('articles.datePending');
  const totalArticlesCount = metadata?.total_articles ?? filteredArticles?.length ?? 0;
  const totalArticlesLabel = t('layout.admin.articleCount', {
    count: totalArticlesCount,
    defaultValue: `${totalArticlesCount} stories published`
  });
  const formattedTotalViews = formatStatNumber(metadata?.total_views);
  const averageReadTimeValue = metadata?.average_read_time ?? null;
  const spotlightReadMinutes =
    spotlightArticle?.read_time ||
    spotlightArticle?.estimatedRead ||
    metadata?.average_read_time ||
    5;
  const spotlightTags = spotlightArticle?.displayTags || spotlightArticle?.tags || [];
  const spotlightViews = spotlightArticle?.views ?? 0;
  const spotlightShares = spotlightArticle?.social_shares ?? 0;
  const spotlightHighlights =
    spotlightArticle?.displayKeyPoints || spotlightArticle?.key_points || [];

  const handleTickerSelect = (article) => {
    const localized = localizeArticle(article, i18n.language);
    setExpandedArticle(localized);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50">
      <NewsHeader
        heroContent={heroContent}
        metadata={metadata}
        tickerArticles={heroTickerArticles}
        isLoading={activeLoading}
        onTickerSelect={handleTickerSelect}
      />
      {/* Enhanced Filter and Search Section */}
      <section id="latest" className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 px-8 py-6 text-white">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
                    {t('filters.sectionEyebrow', { defaultValue: 'Newsroom' })}
                  </span>
                  <h2 className="text-3xl font-bold leading-tight tracking-tight">
                    {t('filters.sectionTitle')}
                  </h2>
                  <p className="text-sm text-white/70">
                    {t('filters.sectionDescription', {
                      defaultValue:
                        'Stay on top of maritime intelligence, policy updates, and research breakthroughs.'
                    })}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-medium leading-tight text-white shadow-lg backdrop-blur">
                  {resultsSummary}
                </div>
              </div>
            </div>

            <div className="space-y-8 px-8 py-8">
              {newsError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                  {t('results.dataSource.error')}
                </div>
              )}

              {newsSource === 'local' && !newsError && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 shadow-sm">
                  {t('results.dataSource.localFallback')}
                </div>
              )}

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-200" />
                  <input
                    type="text"
                    placeholder={t('filters.searchPlaceholder')}
                    aria-label={t('filters.searchPlaceholder')}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 text-base text-slate-700 shadow-inner transition-all duration-300 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
                  >
                    <Filter className="h-4 w-4" />
                    {t('filters.advanced')}
                  </button>

                  {filtersApplied && (
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-slate-700"
                    >
                      <X className="h-4 w-4" />
                      {t('filters.clearAll')}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {availableCategories?.map((category) => {
                  const isAll = category === 'all';
                  const count = !isAll ? metadata?.categories?.[category] : null;
                  const isActive = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`group inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow'
                          : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-blue-400 hover:bg-white hover:text-blue-600'
                      }`}
                    >
                      <span>{isAll ? t('filters.allCategories') : getCategoryLabel(category)}</span>
                      {!isAll && typeof count === 'number' && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            isActive ? 'bg-white/80 text-blue-600' : 'bg-white text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-inner"
                  >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {t('filters.sortLabel')}
                        </label>
                        <select
                          value={`${sortBy}-${sortOrder}`}
                          onChange={(e) => handleSortChange(e?.target?.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        >
                          <option value="date-desc">{t('filters.sortOptions.dateDesc')}</option>
                          <option value="date-asc">{t('filters.sortOptions.dateAsc')}</option>
                          <option value="views-desc">{t('filters.sortOptions.viewsDesc')}</option>
                          <option value="shares-desc">{t('filters.sortOptions.sharesDesc')}</option>
                          <option value="title-asc">{t('filters.sortOptions.titleAsc')}</option>
                          <option value="title-desc">{t('filters.sortOptions.titleDesc')}</option>
                          <option value="category-asc">
                            {t('filters.sortOptions.categoryAsc')}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {t('filters.dateFrom')}
                        </label>
                        <input
                          type="date"
                          value={dateRange?.start}
                          onChange={(e) =>
                            setDateRange(prev => ({ ...prev, start: e?.target?.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {t('filters.dateTo')}
                        </label>
                        <input
                          type="date"
                          value={dateRange?.end}
                          onChange={(e) =>
                            setDateRange(prev => ({ ...prev, end: e?.target?.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-5"
          >
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-xl">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('layout.admin.statusTitle', { defaultValue: 'Newsroom status' })}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700">{adminStatusMessage}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>{t('layout.admin.sourceLabel', { defaultValue: 'Data source' })}</span>
                <span className="text-slate-900">{newsSourceLabel}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span>{t('layout.admin.lastUpdatedLabel', { defaultValue: 'Last updated' })}</span>
                <span className="font-semibold text-slate-900">{lastUpdatedLabel}</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {t('layout.admin.quickStats', { defaultValue: 'Quick metrics' })}
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 text-slate-700">
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    {t('layout.admin.articleCountLabel', { defaultValue: 'Articles available' })}
                  </div>
                  <span className="text-base font-semibold text-slate-900">
                    {formatStatNumber(totalArticlesCount)}
                  </span>
                </div>
                {formattedTotalViews && formattedTotalViews !== '—' && (
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Activity className="h-4 w-4 text-blue-500" />
                      {t('layout.admin.totalViews', { defaultValue: 'Lifetime reads' })}
                    </div>
                    <span className="text-base font-semibold text-slate-900">
                      {formattedTotalViews}
                    </span>
                  </div>
                )}
                {averageReadTimeValue && (
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {t('layout.admin.readTime', { defaultValue: 'Avg. read time' })}
                    </div>
                    <span className="text-base font-semibold text-slate-900">
                      {formatReadTime(averageReadTimeValue)}
                    </span>
                  </div>
                )}
                {spotlightViews ? (
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Eye className="h-4 w-4 text-blue-500" />
                      {t('layout.spotlight.views', { defaultValue: 'Spotlight views' })}
                    </div>
                    <span className="text-base font-semibold text-slate-900">
                      {formatStatNumber(spotlightViews)}
                    </span>
                  </div>
                ) : null}
                {spotlightShares ? (
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Share2 className="h-4 w-4 text-blue-500" />
                      {t('layout.spotlight.shares', { defaultValue: 'Spotlight shares' })}
                    </div>
                    <span className="text-base font-semibold text-slate-900">
                      {formatStatNumber(spotlightShares)}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
      {/* Results Summary */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
                  {t('results.title', { defaultValue: 'Result overview' })}
                </span>
                <h3 className="text-3xl font-bold text-slate-900">{resultsSummary}</h3>
                <p className="text-sm text-slate-500">
                  {filtersApplied
                    ? t('results.filteredDescription', {
                        defaultValue:
                          'Refine further by adjusting categories, key terms, or the date window.'
                      })
                    : t('results.unfilteredDescription', {
                        defaultValue:
                          'Showing the freshest newsroom coverage. Use the controls above to personalise the feed.'
                      })}
                </p>
                {filtersApplied && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedCategory !== 'all' && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        <Tag className="h-4 w-4" />
                        {selectedCategoryLabel}
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="ml-1 rounded-full p-0.5 text-blue-500 transition-colors hover:text-blue-700"
                          aria-label={t('results.clearCategory', {
                            defaultValue: 'Clear category filter'
                          })}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                        <Search className="h-4 w-4" />
                        <span className="max-w-[170px] truncate sm:max-w-[240px]">
                          {searchTerm}
                        </span>
                        <button
                          onClick={() => setSearchTerm('')}
                          className="ml-1 rounded-full p-0.5 text-green-500 transition-colors hover:text-green-700"
                          aria-label={t('results.clearSearch', {
                            defaultValue: 'Clear search filter'
                          })}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {(dateRange?.start || dateRange?.end) && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {t('results.dateRangeLabel', { defaultValue: 'Date range applied' })}
                        </span>
                        <button
                          onClick={() => setDateRange({ start: '', end: '' })}
                          className="ml-1 rounded-full p-0.5 text-purple-500 transition-colors hover:text-purple-700"
                          aria-label={t('results.clearDate', { defaultValue: 'Clear date range' })}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="grid w-full gap-4 sm:grid-cols-2 md:w-auto">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left md:text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('layout.admin.lastUpdatedLabel', { defaultValue: 'Last updated' })}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{lastUpdatedLabel}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left md:text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('layout.admin.articleCountLabel', { defaultValue: 'Articles available' })}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {formatStatNumber(totalArticlesCount)}
                  </p>
                </div>
                {formattedTotalViews && formattedTotalViews !== '—' && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t('layout.admin.totalViews', { defaultValue: 'Lifetime reads' })}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {formattedTotalViews}
                    </p>
                  </div>
                )}
                {averageReadTimeValue && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t('layout.admin.readTime', { defaultValue: 'Avg. read time' })}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {formatReadTime(averageReadTimeValue)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Enhanced Articles Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {activeLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)]?.map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                  <Search className="w-16 h-16 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('results.emptyTitle')}
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {t('results.emptyDescription')}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('results.emptyResetButton')}
                </button>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]"
              >
                <div className="space-y-8">
                  {spotlightArticle && (
                    <motion.article
                      key={spotlightArticle?.id || spotlightArticle?.slug || 'spotlight'}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-80"></div>
                      <div className="pointer-events-none absolute -right-36 -top-32 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-100 via-blue-100 to-slate-50 blur-3xl opacity-60"></div>
                      <div className="relative z-10 grid gap-10 p-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
                        <div className="space-y-6">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
                            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-2 text-blue-700 shadow-sm">
                              <Activity className="h-4 w-4" />
                              {t('layout.spotlightTitle')}
                            </span>
                            {spotlightArticle?.displayCategory && (
                              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-blue-800">
                                <Tag className="h-3.5 w-3.5" />
                                {spotlightArticle.displayCategory}
                              </span>
                            )}
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
                              {spotlightArticle?.displayTitle || spotlightArticle?.title}
                            </h3>
                            {spotlightArticle?.displaySummary && (
                              <p className="text-lg leading-relaxed text-slate-600">
                                {spotlightArticle.displaySummary}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <div className="inline-flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(spotlightArticle?.date)}
                            </div>
                            {spotlightArticle?.displayLocation && (
                              <div className="inline-flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {spotlightArticle.displayLocation}
                              </div>
                            )}
                            <div className="inline-flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {t('articles.readTimeShort', { minutes: spotlightReadMinutes })}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {spotlightTags.slice(0, 6).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600"
                              >
                                #{tag}
                              </span>
                            ))}
                            {spotlightTags.length === 0 && (
                              <span className="text-sm text-slate-500">
                                {t('modal.noTags')}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => setExpandedArticle(spotlightArticle)}
                              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
                            >
                              {t('articles.readFull')}
                              <ArrowRight className="h-4 w-4" />
                            </button>
                            <ShareMenu
                              article={spotlightArticle}
                              size="sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-md">
                            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                  {t('modal.stats.views')}
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">
                                  {formatStatNumber(spotlightViews)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                  {t('modal.stats.shares')}
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">
                                  {formatStatNumber(spotlightShares)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-md">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              {t('modal.highlightsTitle')}
                            </p>
                            {spotlightHighlights.length > 0 ? (
                              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                                {spotlightHighlights.slice(0, 4).map((highlight, index) => (
                                  <li
                                    key={`spotlight-highlight-${index}`}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-3 text-sm text-slate-500">
                                {t('layout.spotlight.noHighlights')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  )}

                  {featureGridArticles.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {t('layout.moreStoriesTitle')}
                        </h3>
                        <p className="text-sm text-slate-500 md:max-w-xl">
                          {t('layout.moreStoriesSubtitle', {
                            defaultValue:
                              'Curated newsroom briefings you may have missed. Explore narratives, policy updates, and field activity across the maritime sector.'
                          })}
                        </p>
                      </div>
                      <div className="grid gap-8 md:grid-cols-2">
                        {featureGridArticles.map((article, index) => {
                          const readMinutes =
                            article?.read_time ||
                            article?.estimatedRead ||
                            metadata?.average_read_time ||
                            5;
                          const articleTags = (article?.displayTags || article?.tags || []).slice(0, 3);
                          const coverImage =
                            article?.coverImage || article?.displayImage || article?.heroImage || article?.thumbnail;

                          return (
                            <motion.article
                              key={article?.id || `${article?.slug}-${index}`}
                              initial={{ opacity: 0, y: 24 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.45, delay: index * 0.05 }}
                              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
                            >
                              <div className="relative h-48 w-full overflow-hidden">
                                {coverImage ? (
                                  <img
                                    src={coverImage}
                                    alt={article?.displayTitle || article?.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
                                    <BookOpen className="h-12 w-12 text-blue-500/60" />
                                  </div>
                                )}
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent p-4">
                                  <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-white">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/25 px-3 py-1 backdrop-blur-sm">
                                      <Tag className="h-3.5 w-3.5" />
                                      {article?.displayCategory || article?.category}
                                    </span>
                                    {article?.is_featured && (
                                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1 text-amber-900 shadow-sm">
                                        <Star className="h-3 w-3" />
                                        {t('articles.featured')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-1 flex-col gap-5 bg-white/95 p-6">
                                <div className="space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedArticle(article)}
                                    className="text-left text-xl font-semibold leading-tight text-slate-900 transition-colors duration-300 hover:text-blue-700"
                                  >
                                    {article?.displayTitle || article?.title}
                                  </button>
                                  {article?.displaySummary && (
                                    <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                                      {article.displaySummary}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200">
                                    <span className="inline-flex items-center gap-1.5">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {formatDate(article?.date)}
                                    </span>
                                    <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                                    <span className="inline-flex items-center gap-1.5">
                                      <Clock className="h-3.5 w-3.5" />
                                      {t('articles.readTimeShort', { minutes: readMinutes })}
                                    </span>
                                    {article?.displayLocation && (
                                      <>
                                        <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                                        <span className="inline-flex items-center gap-1.5">
                                          <MapPin className="h-3.5 w-3.5" />
                                          {article.displayLocation}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {articleTags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {articleTags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="mt-auto flex items-center justify-between gap-4">
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                    <span className="inline-flex items-center gap-1.5">
                                      <User className="h-3.5 w-3.5 text-blue-500" />
                                      {article?.displayAuthor ||
                                        article?.author ||
                                        t('articles.teamByline')}
                                    </span>
                                    {article?.views ? (
                                      <span className="inline-flex items-center gap-1.5">
                                        <Eye className="h-3.5 w-3.5 text-blue-500" />
                                        {formatStatNumber(article?.views)}
                                      </span>
                                    ) : null}
                                    {article?.social_shares ? (
                                      <span className="inline-flex items-center gap-1.5">
                                        <Share2 className="h-3.5 w-3.5 text-blue-500" />
                                        {formatStatNumber(article?.social_shares)}
                                      </span>
                                    ) : null}
                                  </div>
                                  <ShareMenu article={article} size="sm" />
                                </div>
                              </div>
                            </motion.article>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-inner"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-md">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          {t('layout.admin.title')}
                        </p>
                        <p className="mt-1 text-base font-semibold text-slate-900">
                          {adminStatusMessage}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {t('layout.admin.lastUpdated', { date: lastUpdatedLabel })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {t('hero.stats.totalArticles')}
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">
                          {formatStatNumber(totalArticlesCount)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{totalArticlesLabel}</p>
                      </div>
                      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {t('hero.stats.totalViews')}
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">
                          {formattedTotalViews}
                        </p>
                      </div>
                      <div className="col-span-2 rounded-2xl bg-white/80 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {t('hero.stats.averageReadTime')}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                          {averageReadTimeValue
                            ? t('articles.readTimeShort', { minutes: averageReadTimeValue })
                            : t('hero.stats.noReadTime')}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/admin/login"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
                    >
                      {t('layout.admin.openPanel')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-lg backdrop-blur"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        {t('layout.timelineTitle')}
                      </h3>
                    </div>

                    {timelineArticles.length > 0 ? (
                      <div className="relative mt-6 pl-4">
                        <div className="absolute left-1 top-2 bottom-2 w-px bg-gradient-to-b from-blue-300 via-blue-200 to-cyan-200"></div>
                        <div className="space-y-6">
                          {timelineArticles.map((article, index) => {
                            const readMinutes =
                              article?.read_time ||
                              article?.estimatedRead ||
                              metadata?.average_read_time ||
                              5;

                            return (
                              <div key={article?.id || `${article?.slug}-${index}`} className="relative pl-4">
                                <span className="absolute -left-[0.95rem] top-2 flex h-3 w-3 items-center justify-center">
                                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                </span>
                                <p className="text-xs uppercase tracking-wide text-slate-200">
                                  {formatDate(article?.date)}
                                </p>
                                <button
                                  onClick={() => setExpandedArticle(article)}
                                  className="mt-1 w-full text-left text-sm font-semibold text-slate-900 transition-colors duration-300 hover:text-blue-600"
                                >
                                  {article?.displayTitle || article?.title}
                                </button>
                                {article?.displaySummary && (
                                  <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                                    {article.displaySummary}
                                  </p>
                                )}
                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {t('articles.readTimeShort', { minutes: readMinutes })}
                                  </span>
                                  {article?.displayLocation && (
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {article.displayLocation}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                  <ShareMenu article={article} size="sm" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-6 text-sm leading-relaxed text-slate-600">
                        {t('layout.timelineEmpty')}
                      </p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16"
            >
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(page => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg transform -translate-y-1'
                            : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mt-6 text-gray-600">
                {t('pagination.pageInfo', { current: currentPage, total: totalPages })}
              </div>
            </motion.div>
          )}
        </div>
      </section>
      <AnimatePresence>
        {expandedArticle &&
          (() => {
            const modalArticle = expandedArticle;
            const modalReadMinutes =
              modalArticle?.read_time ||
              modalArticle?.estimatedRead ||
              metadata?.average_read_time ||
              5;
            const modalTags = modalArticle?.displayTags || modalArticle?.tags || [];
            const modalKeyPoints =
              modalArticle?.displayKeyPoints || modalArticle?.key_points || [];
            const categoryLabel =
              modalArticle?.displayCategory || getCategoryLabel(modalArticle?.category);
            const modalAuthor = modalArticle?.displayAuthor || modalArticle?.author;
            const modalAuthorPosition =
              modalArticle?.displayAuthorPosition || modalArticle?.author_position;
            const modalLocation = modalArticle?.displayLocation || modalArticle?.location;
            const modalSummary = modalArticle?.displaySummary || modalArticle?.summary;
            const modalContent = modalArticle?.displayContent || modalArticle?.content;
            const viewsValue = modalArticle?.views ?? 0;
            const sharesValue = modalArticle?.social_shares ?? 0;
            const tagsCount = modalTags.length;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={() => setExpandedArticle(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white rounded-3xl max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e?.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b-2 border-gray-100 p-8 z-10 rounded-t-3xl">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryColor(
                              modalArticle?.category
                            )}`}
                          >
                            {categoryLabel}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(modalArticle?.date)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {t('articles.readTimeShort', { minutes: modalReadMinutes })}
                          </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
                          {modalArticle?.displayTitle || modalArticle?.title}
                        </h2>
                        {modalLocation && (
                          <div className="flex items-center gap-1 text-gray-600 mb-2">
                            <MapPin className="w-5 h-5" />
                            <span className="text-lg">{modalLocation}</span>
                          </div>
                        )}
                        {modalAuthor && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-5 h-5" />
                            <span className="font-medium text-lg">{modalAuthor}</span>
                            {modalAuthorPosition && (
                              <span className="text-gray-500">• {modalAuthorPosition}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <ShareMenu
                          article={modalArticle}
                          size="sm"
                          showLabel
                          showLink
                          orientation="column"
                        />
                        <button
                          onClick={() => setExpandedArticle(null)}
                          className="text-gray-400 hover:text-gray-600 text-3xl font-bold p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                          aria-label={t('modal.close', 'Close dialog')}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="prose max-w-none prose-lg">
                      {modalSummary && (
                        <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">
                          {modalSummary}
                        </p>
                      )}

                      {modalContent && (
                        <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-10">
                          {modalContent}
                        </div>
                      )}

                      {modalKeyPoints?.length > 0 && (
                        <div className="mt-10 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                          <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-3 text-xl">
                            <Eye className="w-6 h-6 text-blue-600" />
                            {t('modal.highlightsTitle')}
                          </h4>
                          <ul className="space-y-4">
                            {modalKeyPoints?.map((point, index) => (
                              <li key={`${point}-${index}`} className="flex items-start gap-3">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 text-lg leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-gray-800">{viewsValue}</div>
                            <div className="text-sm text-gray-600">
                              {t('modal.stats.views')}
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">{sharesValue}</div>
                            <div className="text-sm text-gray-600">
                              {t('modal.stats.shares')}
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">
                              {modalReadMinutes}
                            </div>
                            <div className="text-sm text-gray-600">
                              {t('modal.stats.readTime')}
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">{tagsCount}</div>
                            <div className="text-sm text-gray-600">
                              {t('modal.stats.tags')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-xl">
                          <Tag className="w-6 h-6 text-gray-600" />
                          {t('modal.relatedTopics')}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {modalTags.map((tag, index) => (
                            <span
                              key={`${tag}-${index}`}
                              className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300 cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                          {modalTags.length === 0 && (
                            <span className="text-sm text-gray-500">
                              {t('modal.noTags')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-10 pt-8 border-t-2 border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {t('modal.publishedBy', {
                              author: modalAuthor || t('modal.defaultAuthor')
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {t('modal.publishedOn', {
                              date: formatDate(modalArticle?.date)
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </div>
  );
};

export default NewsPage;
