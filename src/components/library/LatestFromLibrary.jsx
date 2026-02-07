import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Author Parser ───────────────────────────────────────────────────────────
const parseAuthor = (author) => {
  if (!author) return '';
  if (typeof author === 'object') return author.name || '';
  if (typeof author === 'string' && author.startsWith('{')) {
    try { return JSON.parse(author).name || author; } catch { return author; }
  }
  return author;
};

// ─── Language Normalizer ─────────────────────────────────────────────────────
const normalizeLanguage = (lang) => {
  if (!lang || typeof lang !== 'string') return '';
  const map = {
    eng: 'English', english: 'English',
    sin: 'Sinhala', sinhala: 'Sinhala',
    tam: 'Tamil', tamil: 'Tamil',
    ger: 'German', fre: 'French', rus: 'Russian', spa: 'Spanish'
  };
  return map[lang.toLowerCase()] || lang;
};

// ─── Material Type Badge Config ──────────────────────────────────────────────
const BADGE_CONFIG = {
  BOBP:   { label: 'Report',       color: 'bg-sky-50 text-sky-700 border-sky-200',       gradient: 'from-sky-500 to-blue-600' },
  EBOOK:  { label: 'E-Book',       color: 'bg-indigo-50 text-indigo-700 border-indigo-200', gradient: 'from-indigo-500 to-violet-600' },
  JR:     { label: 'Journal',      color: 'bg-violet-50 text-violet-700 border-violet-200', gradient: 'from-violet-500 to-purple-600' },
  RPAPER: { label: 'Paper',        color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', gradient: 'from-fuchsia-500 to-pink-600' },
  RNARA:  { label: 'NARA Report',  color: 'bg-teal-50 text-teal-700 border-teal-200',     gradient: 'from-teal-500 to-cyan-600' },
  THESIS: { label: 'Thesis',       color: 'bg-purple-50 text-purple-700 border-purple-200', gradient: 'from-purple-500 to-indigo-600' },
  LBOOK:  { label: 'Book',         color: 'bg-amber-50 text-amber-700 border-amber-200',   gradient: 'from-amber-500 to-orange-600' },
  PREF:   { label: 'Reference',    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', gradient: 'from-emerald-500 to-green-600' },
  RBOOK:  { label: 'Reference',    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', gradient: 'from-emerald-500 to-green-600' },
  SREF:   { label: 'Special Ref',  color: 'bg-rose-50 text-rose-700 border-rose-200',     gradient: 'from-rose-500 to-red-600' },
  CD:     { label: 'Multimedia',   color: 'bg-orange-50 text-orange-700 border-orange-200', gradient: 'from-orange-500 to-red-600' },
  EJRNL:  { label: 'E-Journal',    color: 'bg-blue-50 text-blue-700 border-blue-200',     gradient: 'from-blue-500 to-indigo-600' },
  EREPT:  { label: 'E-Report',     color: 'bg-cyan-50 text-cyan-700 border-cyan-200',     gradient: 'from-cyan-500 to-teal-600' },
};

const getBadge = (code) => BADGE_CONFIG[code] || { label: 'Document', color: 'bg-gray-50 text-gray-600 border-gray-200', gradient: 'from-gray-400 to-gray-600' };

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="rounded-lg border border-slate-200 bg-white overflow-hidden animate-pulse">
    <div className="h-1.5 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-slate-200 rounded" />
        <div className="h-5 w-14 bg-slate-100 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 rounded w-full" />
        <div className="h-5 bg-slate-200 rounded w-3/4" />
      </div>
      <div className="pt-4 border-t border-dashed border-slate-200 space-y-2">
        <div className="h-4 bg-slate-100 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const LatestFromLibrary = () => {
  const { t } = useTranslation(['home', 'common']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadLatest = async () => {
      try {
        setLoading(true);

        // Check sessionStorage cache first (10-min TTL)
        const cached = sessionStorage.getItem('nara-library-latest-8');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.timestamp && Date.now() - parsed.timestamp < 10 * 60 * 1000) {
            setItems(parsed.items);
            setLoading(false);
            return;
          }
        }

        const response = await fetch('/library_catalogue.json');
        if (!response.ok) throw new Error('Failed to fetch catalogue');
        const catalogue = await response.json();

        const sorted = catalogue
          .filter(item => item.acquisition_date && item.title)
          .sort((a, b) => {
            const dateA = new Date(a.acquisition_date);
            const dateB = new Date(b.acquisition_date);
            if (dateB - dateA !== 0) return dateB - dateA;
            return (b.publication_year || 0) - (a.publication_year || 0);
          })
          .slice(0, 8);

        setItems(sorted);

        // Cache the 8 items to avoid re-fetching 1.8MB JSON
        try {
          sessionStorage.setItem('nara-library-latest-8', JSON.stringify({
            items: sorted, timestamp: Date.now()
          }));
        } catch (e) { /* sessionStorage full — ignore */ }
      } catch (err) {
        console.error('[LatestFromLibrary] Failed to load:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadLatest();
  }, []);

  // ── Loading State ──
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  // ── Error / Empty State ──
  if (error || items.length === 0) return null;

  // ── Card Renderer ──
  const renderCard = (item, index) => {
    const badge = getBadge(item.material_type_code);
    const author = parseAuthor(item.author);
    const lang = normalizeLanguage(item.language);

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      >
        <Link
          to={`/library/item/${item.id}`}
          className="group block h-full"
        >
          <article className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 relative flex flex-col h-full">
            {/* Gradient accent bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${badge.gradient}`} />

            <div className="p-5 flex flex-col flex-grow">
              {/* Badges row */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${badge.color}`}>
                  {badge.label}
                </span>
                {lang && (
                  <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[14px]">language</span>
                    {lang}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-display font-semibold text-lg leading-tight mb-3 text-slate-900 group-hover:text-blue-700 transition-colors">
                <span className="decoration-slate-300 underline underline-offset-4 decoration-1">
                  {item.title}
                </span>
              </h3>

              {/* Metadata section */}
              <div className="mt-auto space-y-2 pt-4 border-t border-dashed border-slate-200">
                {author && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                    <span className="truncate">{author}</span>
                  </div>
                )}
                {item.publication_year && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_today</span>
                    <span>{item.publication_year}</span>
                  </div>
                )}
              </div>
            </div>
          </article>
        </Link>
      </motion.div>
    );
  };

  const firstRow = items.slice(0, 4);
  const secondRow = items.slice(4);

  // ── Main Render ──
  return (
    <div>
      {/* First row — always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {firstRow.map((item, index) => renderCard(item, index))}
      </div>

      {/* Second row — toggle visibility */}
      <AnimatePresence>
        {showAll && secondRow.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {secondRow.map((item, index) => renderCard(item, index + 4))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View More / Show Less + Browse Full Catalogue */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        {secondRow.length > 0 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all text-sm font-medium shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform" style={{ transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
            {showAll
              ? t('library.showLess', { ns: 'home', defaultValue: 'Show Less' })
              : t('library.viewMore', { ns: 'home', defaultValue: 'View More' })
            }
          </button>
        )}

        <Link
          to="/library"
          className="inline-flex items-center gap-2 bg-slate-900 text-white pl-6 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all group ring-2 ring-white ring-offset-2"
        >
          <span className="font-medium tracking-wide text-sm">
            {t('library.browseCta', { ns: 'home', defaultValue: 'Browse Full Catalogue' })}
          </span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default LatestFromLibrary;
