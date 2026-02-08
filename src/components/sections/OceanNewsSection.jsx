import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Clock,
  Eye,
} from 'lucide-react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';

/* ── category colour map ── */
const CATEGORY_COLORS = {
  general: 'bg-slate-500/80',
  research: 'bg-blue-500/80',
  events: 'bg-purple-500/80',
  announcements: 'bg-amber-500/80',
  press: 'bg-emerald-500/80',
  achievements: 'bg-rose-500/80',
};

/* ── slide transition variants ── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

/* ── estimate read time ── */
const readTime = (text) => {
  if (!text) return '2 min read';
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
};

const OceanNewsSection = () => {
  const { t, i18n } = useTranslation('home');
  const newsData = t('news', { returnObjects: true });
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [imgError, setImgError] = useState(false);
  const isHoveredRef = useRef(false);
  const isInViewRef = useRef(false);
  const observerRef = useRef(null);

  // Callback ref — attaches IntersectionObserver when the real section mounts
  const sectionRef = useCallback((node) => {
    // Disconnect previous observer
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => { isInViewRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    obs.observe(node);
    observerRef.current = obs;
  }, []);

  // Cleanup observer on unmount
  useEffect(() => () => { if (observerRef.current) observerRef.current.disconnect(); }, []);

  /* ── fetch latest published articles (over-fetch to include featured) ── */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(
          collection(db, 'news'),
          where('status', '==', 'published'),
          orderBy('publishDate', 'desc'),
          limit(18),
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
            category: data.category || 'general',
            featuredImage: data.featuredImage || '',
            images: data.images || [],
            views: data.views || 0,
            isFeatured: data.isFeatured || false,
          };
        });

        /* prioritize featured articles first, then trim to 6 for carousel */
        items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        items.splice(6);

        if (items.length > 0) {
          setArticles(items);
        } else {
          /* fallback to static news data */
          const staticItems = (newsData?.articles || []).slice(0, 12).map((a, i) => ({
            id: a.id || `static-${i}`,
            title: a.title || '',
            excerpt: a.description || '',
            content: '',
            date: a.date || '',
            category: 'general',
            featuredImage: a.image || '',
            images: [],
            views: 0,
            isFeatured: false,
          }));
          setArticles(staticItems);
        }
      } catch (err) {
        console.error('OceanNewsSection fetch error:', err);
        const staticItems = (newsData?.articles || []).slice(0, 12).map((a, i) => ({
          id: a.id || `static-${i}`,
          title: a.title || '',
          excerpt: a.description || '',
          content: '',
          date: a.date || '',
          category: 'general',
          featuredImage: a.image || '',
          images: [],
          views: 0,
          isFeatured: false,
        }));
        setArticles(staticItems);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── auto-rotate every 5s (refs avoid stale closures) ── */
  const articleCount = articles.length;

  useEffect(() => {
    if (articleCount <= 1) return;
    const id = setInterval(() => {
      if (!isHoveredRef.current && isInViewRef.current) {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % articleCount);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [articleCount]);

  /* reset image error on slide change */
  useEffect(() => { setImgError(false); }, [currentIndex]);

  /* ── navigation helpers ── */
  const goTo = (idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  /* ── loading / empty ── */
  if (loading) {
    return (
      <section className="relative py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-[320px]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-cyan-400 border-t-transparent" />
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  const current = articles[currentIndex];
  const heroImg = current.featuredImage || (current.images?.[0]?.url ?? '');

  return (
    <section ref={sectionRef} className="relative bg-slate-950 overflow-hidden">
      {/* ── Section header ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Latest Updates
                </span>
              </div>
            </div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-white mb-1">
              {newsData?.heading || 'News & Updates'}
            </h2>
            <p className="text-sm text-blue-200/60 max-w-xl">
              {newsData?.subheading || 'Stay informed about NARA\'s latest research and events'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <Link
              to="/news"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all"
            >
              <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {newsData?.viewAll || 'View All News'}
              </span>
              <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Full-width carousel ── */}
      <div
        className="relative w-full"
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
      >
        {/* Main slide area */}
        <div className="relative w-full h-[380px] sm:h-[420px] md:h-[470px] lg:h-[520px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => navigate(`/news/${current.id}`)}
            >
              {/* Background image */}
              {heroImg && !imgError ? (
                <img
                  src={heroImg}
                  alt={current.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-nara-navy via-slate-800 to-slate-900 flex items-center justify-center">
                  <Newspaper className="w-24 h-24 text-white/10" />
                </div>
              )}

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent" />

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 z-10">
                <div className="max-w-7xl mx-auto">
                  {/* Category badge */}
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white uppercase tracking-wider mb-2 ${CATEGORY_COLORS[current.category] || CATEGORY_COLORS.general}`}
                  >
                    {current.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight max-w-4xl line-clamp-2">
                    {current.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-blue-100/70 text-sm sm:text-base mb-3 max-w-3xl line-clamp-2 leading-relaxed">
                    {current.excerpt}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-blue-200/60">
                    {current.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        {current.date}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      {readTime(current.content || current.excerpt)}
                    </span>
                    {current.views > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        {current.views} views
                      </span>
                    )}
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows */}
          {articles.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {articles.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-3 bg-slate-950">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-cyan-400'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OceanNewsSection;
