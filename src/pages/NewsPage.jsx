import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ArrowRight,
  Search,
  ChevronDown,
  Newspaper,
  Eye,
  Clock,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

/* ── constants ── */
const YEAR_TABS = [2026, 2025, 2024];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'general', label: 'General' },
  { value: 'research', label: 'Research' },
  { value: 'events', label: 'Events' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'press', label: 'Press' },
  { value: 'achievements', label: 'Achievements' },
];

const CATEGORY_COLORS = {
  general: 'bg-slate-500/80 text-white',
  research: 'bg-blue-500/80 text-white',
  events: 'bg-purple-500/80 text-white',
  announcements: 'bg-amber-500/80 text-white',
  press: 'bg-emerald-500/80 text-white',
  achievements: 'bg-rose-500/80 text-white',
};

/* ── read time estimate ── */
const readTime = (text) => {
  if (!text) return '2 min';
  const words = text.split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
};

/* ── card animation variants ── */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' },
  }),
};

/* ── NewsCard component ── */
const NewsCard = ({ article, index }) => {
  const heroImg = article.featuredImage || (article.images?.[0]?.url ?? '');

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Link
        to={`/news/${article.id}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-slate-800">
          {heroImg ? (
            <img
              src={heroImg}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-nara-navy/40 to-slate-800 flex items-center justify-center">
              <Newspaper className="w-12 h-12 text-white/10" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general}`}
            >
              {article.category}
            </span>
          </div>

          {/* Featured star */}
          {article.isFeatured && (
            <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-400/30">
              <span className="text-amber-300 text-[10px] font-bold uppercase tracking-wider">Featured</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
            {article.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400/70" />
                {article.date}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400/70" />
              {readTime(article.content || article.excerpt)} read
            </span>
          </div>

          {/* Title */}
          <h3 className="font-headline text-lg font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-cyan-300 transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
            {article.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
            {article.views > 0 ? (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Eye className="w-3.5 h-3.5" />
                {article.views}
              </span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-1.5 text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
              Read More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════ */
/*  Main NewsPage component                      */
/* ══════════════════════════════════════════════ */
const NewsPage = () => {
  const { t, i18n } = useTranslation('home');
  const newsData = t('news', { returnObjects: true });

  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState(YEAR_TABS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  /* ── fetch all published news ── */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(
          collection(db, 'news'),
          where('status', '==', 'published'),
          orderBy('publishDate', 'desc'),
        );
        const snap = await getDocs(q);
        const lang = i18n.language || 'en';

        const items = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title?.[lang] || data.title?.en || 'Untitled',
            excerpt: data.excerpt?.[lang] || data.excerpt?.en || '',
            content: data.content?.[lang] || data.content?.en || '',
            date: data.publishDate || '',
            year: data.year || (data.publishDate ? parseInt(data.publishDate.substring(0, 4), 10) : 2026),
            category: data.category || 'general',
            featuredImage: data.featuredImage || '',
            images: data.images || [],
            tags: data.tags || [],
            views: data.views || 0,
            isFeatured: data.isFeatured || false,
          };
        });

        if (items.length > 0) {
          setAllNews(items);
        } else {
          /* fallback to static */
          const staticItems = (newsData?.articles || []).map((a, i) => ({
            id: a.id || `static-${i}`,
            title: a.title || '',
            excerpt: a.description || '',
            content: '',
            date: a.date || '',
            year: a.date ? parseInt(a.date.substring(0, 4), 10) : 2026,
            category: 'general',
            featuredImage: a.image || '',
            images: [],
            tags: [],
            views: 0,
            isFeatured: false,
          }));
          setAllNews(staticItems);
        }
      } catch (err) {
        console.error('NewsPage fetch error:', err);
        const staticItems = (newsData?.articles || []).map((a, i) => ({
          id: a.id || `static-${i}`,
          title: a.title || '',
          excerpt: a.description || '',
          content: '',
          date: a.date || '',
          year: a.date ? parseInt(a.date.substring(0, 4), 10) : 2026,
          category: 'general',
          featuredImage: a.image || '',
          images: [],
          tags: [],
          views: 0,
          isFeatured: false,
        }));
        setAllNews(staticItems);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── filtered results ── */
  const filteredNews = useMemo(() => {
    let result = allNews.filter((a) => a.year === activeYear);

    if (categoryFilter) {
      result = result.filter((a) => a.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [allNews, activeYear, categoryFilter, searchQuery]);

  /* ── count per year ── */
  const yearCounts = useMemo(() => {
    const counts = {};
    YEAR_TABS.forEach((y) => {
      counts[y] = allNews.filter((a) => a.year === y).length;
    });
    return counts;
  }, [allNews]);

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const handler = () => setShowCategoryDropdown(false);
    if (showCategoryDropdown) {
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    }
  }, [showCategoryDropdown]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Hero header ── */}
      <div className="relative pt-28 pb-12 overflow-hidden">
        {/* bg glow */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                News Archive
              </span>
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              {newsData?.heading || 'NARA News & Updates'}
            </h1>
            <p className="text-lg sm:text-xl text-blue-200/60 max-w-3xl">
              {newsData?.subheading || 'Stay informed about our latest research, events, and announcements'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Controls bar ── */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Year tabs */}
            <div className="flex items-center gap-2">
              {YEAR_TABS.map((year) => (
                <button
                  key={year}
                  onClick={() => { setActiveYear(year); setSearchQuery(''); setCategoryFilter(''); }}
                  className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeYear === year
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {year}
                  {yearCounts[year] > 0 && (
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeYear === year ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-slate-500'
                    }`}>
                      {yearCounts[year]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search + category */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-48 sm:w-64 pl-10 pr-8 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowCategoryDropdown(!showCategoryDropdown); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:border-white/20 transition-all"
                >
                  {categoryFilter
                    ? CATEGORIES.find((c) => c.value === categoryFilter)?.label || 'Category'
                    : 'Category'}
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-slate-800 border border-white/10 shadow-xl py-1 z-40">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => { setCategoryFilter(cat.value); setShowCategoryDropdown(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          categoryFilter === cat.value
                            ? 'text-cyan-400 bg-cyan-500/10'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── News grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-cyan-400 border-t-transparent" />
          </div>
        ) : filteredNews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Newspaper className="w-16 h-16 text-slate-700 mb-4" />
            <h3 className="font-headline text-xl font-bold text-white mb-2">No articles found</h3>
            <p className="text-slate-400 text-sm max-w-md">
              {searchQuery || categoryFilter
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : `No news articles for ${activeYear} yet. Check back later!`}
            </p>
            {(searchQuery || categoryFilter) && (
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter(''); }}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeYear}-${categoryFilter}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredNews.map((article, idx) => (
                <NewsCard key={article.id} article={article} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
