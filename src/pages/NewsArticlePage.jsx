import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Copy,
  Check,
  Newspaper,
  ArrowRight,
  Tag,
} from 'lucide-react';
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';

/* ── category colours ── */
const CATEGORY_COLORS = {
  general: 'bg-slate-500/80',
  research: 'bg-blue-500/80',
  events: 'bg-purple-500/80',
  announcements: 'bg-amber-500/80',
  press: 'bg-emerald-500/80',
  achievements: 'bg-rose-500/80',
};

/* ── slide transition ── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

/* ── read time ── */
const readTime = (text) => {
  if (!text) return '2 min read';
  return `${Math.max(1, Math.round(text.split(/\s+/).length / 200))} min read`;
};

/* ═══════════════════════════════════════════════ */
/*  Hero Image Carousel                           */
/* ═══════════════════════════════════════════════ */
const HeroCarousel = ({ images, title }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const single = images.length <= 1;
  const current = images[idx] || {};
  const caption = current.caption?.[lang] || current.caption?.en || '';

  /* auto-rotate */
  const startTimer = useCallback(() => {
    clearInterval(timer.current);
    if (single) return;
    timer.current = setInterval(() => {
      if (!paused) {
        setDir(1);
        setIdx((p) => (p + 1) % images.length);
      }
    }, 5000);
  }, [images.length, single, paused]);

  useEffect(() => { startTimer(); return () => clearInterval(timer.current); }, [startTimer]);

  const goPrev = () => { setDir(-1); setIdx((p) => (p - 1 + images.length) % images.length); startTimer(); };
  const goNext = () => { setDir(1); setIdx((p) => (p + 1) % images.length); startTimer(); };
  const goTo = (i) => { setDir(i > idx ? 1 : -1); setIdx(i); startTimer(); };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide area */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[580px] overflow-hidden bg-slate-900">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={idx}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            {current.url ? (
              <img
                src={current.url}
                alt={caption || title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-nara-navy to-slate-900 flex items-center justify-center">
                <Newspaper className="w-24 h-24 text-white/10" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {!single && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition-all"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Counter */}
        {!single && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white/80 font-medium">
            {idx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Dots + caption */}
      {!single && (
        <div className="bg-slate-900 border-b border-white/5">
          {/* Dots */}
          <div className="flex items-center justify-center gap-2 pt-4 pb-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === idx ? 'w-7 h-2 bg-cyan-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Caption */}
          {caption && (
            <p className="text-center text-sm text-slate-400 pb-3 px-4 italic">
              {caption}
            </p>
          )}
        </div>
      )}

      {/* Caption for single image */}
      {single && caption && (
        <div className="bg-slate-900 border-b border-white/5 py-3 px-4">
          <p className="text-center text-sm text-slate-400 italic">{caption}</p>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
/*  Related News Card                             */
/* ═══════════════════════════════════════════════ */
const RelatedCard = ({ article }) => {
  const heroImg = article.featuredImage || '';
  return (
    <Link
      to={`/news/${article.id}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative h-36 overflow-hidden bg-slate-800">
        {heroImg ? (
          <img src={heroImg} alt={article.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-nara-navy/30 to-slate-800 flex items-center justify-center">
            <Newspaper className="w-8 h-8 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      </div>
      <div className="p-4 flex-1">
        <p className="text-xs text-slate-500 mb-1.5">{article.date}</p>
        <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors leading-snug">
          {article.title}
        </h4>
      </div>
    </Link>
  );
};

/* ═══════════════════════════════════════════════ */
/*  NewsArticlePage                               */
/* ═══════════════════════════════════════════════ */
const NewsArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('home');
  const newsData = t('news', { returnObjects: true });
  const lang = i18n.language || 'en';

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  /* ── fetch article ── */
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);

      /* try static first */
      const staticArticle = newsData?.articles?.find((a) => a.id === id);
      if (staticArticle) {
        setArticle({
          id: staticArticle.id,
          title: staticArticle.title || '',
          excerpt: staticArticle.description || '',
          content: staticArticle.fullContent || staticArticle.description || '',
          date: staticArticle.date || '',
          category: 'general',
          featuredImage: staticArticle.image || '',
          images: staticArticle.image ? [{ url: staticArticle.image, order: 0 }] : [],
          tags: [],
          views: 0,
        });
        setLoading(false);
        return;
      }

      /* fetch from Firestore */
      try {
        const docSnap = await getDoc(doc(db, 'news', id));
        if (!docSnap.exists()) {
          navigate('/news');
          return;
        }

        const data = docSnap.data();
        setArticle({
          id: docSnap.id,
          title: data.title?.[lang] || data.title?.en || 'Untitled',
          excerpt: data.excerpt?.[lang] || data.excerpt?.en || '',
          content: data.content?.[lang] || data.content?.en || '',
          date: data.publishDate || '',
          category: data.category || 'general',
          featuredImage: data.featuredImage || '',
          images: (data.images || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
          tags: data.tags || [],
          views: data.views || 0,
        });

        /* increment views */
        try {
          await updateDoc(doc(db, 'news', id), { views: increment(1) });
        } catch (_) { /* silent */ }

        /* fetch related (same category, excluding self) */
        try {
          const relQ = query(
            collection(db, 'news'),
            where('status', '==', 'published'),
            where('category', '==', data.category || 'general'),
            orderBy('publishDate', 'desc'),
            limit(4),
          );
          const relSnap = await getDocs(relQ);
          const relItems = relSnap.docs
            .filter((d) => d.id !== id)
            .slice(0, 3)
            .map((d) => {
              const rd = d.data();
              return {
                id: d.id,
                title: rd.title?.[lang] || rd.title?.en || 'Untitled',
                date: rd.publishDate || '',
                featuredImage: rd.featuredImage || '',
              };
            });
          setRelated(relItems);
        } catch (_) { /* silent */ }
      } catch (err) {
        console.error('NewsArticlePage error:', err);
        navigate('/news');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [id, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── share helpers ── */
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article?.title || '')}`, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${article?.title || ''} ${shareUrl}`)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) { /* silent */ }
  };

  /* ── loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  if (!article) return null;

  /* Build images array for carousel */
  const carouselImages =
    article.images.length > 0
      ? article.images
      : article.featuredImage
        ? [{ url: article.featuredImage, order: 0 }]
        : [];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Top bar ── */}
      <div className="relative z-10 bg-slate-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general}`}
          >
            {article.category}
          </span>
        </div>
      </div>

      {/* ── Image carousel ── */}
      {carouselImages.length > 0 && (
        <HeroCarousel images={carouselImages} title={article.title} />
      )}

      {/* ── Article content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
        >
          {article.title}
        </motion.h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8 pb-8 border-b border-white/5">
          {article.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              {article.date}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            {readTime(article.content)}
          </span>
          {article.views > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              {article.views} views
            </span>
          )}
        </div>

        {/* Excerpt / lead */}
        {article.excerpt && (
          <p className="text-lg sm:text-xl text-blue-100/80 leading-relaxed mb-8 border-l-4 border-cyan-500 pl-6">
            {article.excerpt}
          </p>
        )}

        {/* Body content */}
        <div className="prose prose-lg prose-invert max-w-none text-slate-300 leading-8 space-y-5">
          {article.content ? (
            article.content.split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))
          ) : (
            <p>{article.excerpt}</p>
          )}
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-500" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share buttons */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-400 mr-2">
              <Share2 className="w-4 h-4" />
              Share
            </span>
            <button
              onClick={shareOnFacebook}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] text-sm font-medium hover:bg-[#1877F2]/20 transition-all"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </button>
            <button
              onClick={shareOnTwitter}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium hover:bg-sky-500/20 transition-all"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/10 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Related articles ── */}
      {related.length > 0 && (
        <div className="border-t border-white/5 bg-slate-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="font-headline text-xl font-bold text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r) => (
                <RelatedCard key={r.id} article={r} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 hover:border-cyan-500/30 transition-all"
              >
                View All News
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsArticlePage;
