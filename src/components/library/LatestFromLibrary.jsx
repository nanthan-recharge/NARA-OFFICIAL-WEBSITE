import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, FileText, Newspaper, GraduationCap, Map as MapIcon,
  Disc, BookMarked, Library, Globe, User, Calendar, ArrowRight, ChevronDown
} from 'lucide-react';

const LATEST_CACHE_KEY = 'nara-library-latest-v2';
const LATEST_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const LATEST_ITEMS_URL = '/library_latest.json';
const FULL_CATALOGUE_URL = '/library_catalogue.json';

// Demo/seed placeholder records that must never appear on the homepage.
const PLACEHOLDER_IDS = new Set([901, 902, 903, 904, 905]);
const PLACEHOLDER_AUTHORS = new Set([
  'marine biologists', 'fisheries experts', 'climate scientists',
  'various authors', 'research scientists'
]);

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

// ─── Material Type Config (refined editorial — icon + restrained accent) ──────
const TYPE_CONFIG = {
  BOBP:   { label: 'Report',        Icon: FileText,      accent: 'text-sky-600',     chip: 'bg-sky-50 text-sky-700',       bar: 'bg-sky-500' },
  EBOOK:  { label: 'E-Book',        Icon: BookOpen,      accent: 'text-indigo-600',  chip: 'bg-indigo-50 text-indigo-700', bar: 'bg-indigo-500' },
  JR:     { label: 'Journal',       Icon: BookOpen,      accent: 'text-violet-600',  chip: 'bg-violet-50 text-violet-700', bar: 'bg-violet-500' },
  EJART:  { label: 'E-Journal',     Icon: BookOpen,      accent: 'text-blue-600',    chip: 'bg-blue-50 text-blue-700',     bar: 'bg-blue-500' },
  RPAPER: { label: 'Research Paper',Icon: FileText,      accent: 'text-fuchsia-600', chip: 'bg-fuchsia-50 text-fuchsia-700',bar: 'bg-fuchsia-500' },
  RNARA:  { label: 'NARA Report',   Icon: FileText,      accent: 'text-teal-600',    chip: 'bg-teal-50 text-teal-700',     bar: 'bg-teal-500' },
  THESIS: { label: 'Thesis',        Icon: GraduationCap, accent: 'text-purple-600',  chip: 'bg-purple-50 text-purple-700', bar: 'bg-purple-500' },
  LBOOK:  { label: 'Book',          Icon: BookOpen,      accent: 'text-amber-600',   chip: 'bg-amber-50 text-amber-700',   bar: 'bg-amber-500' },
  SLBOOK: { label: 'Book',          Icon: BookOpen,      accent: 'text-amber-600',   chip: 'bg-amber-50 text-amber-700',   bar: 'bg-amber-500' },
  SLREP:  { label: 'Report',        Icon: FileText,      accent: 'text-emerald-600', chip: 'bg-emerald-50 text-emerald-700',bar: 'bg-emerald-500' },
  PREF:   { label: 'Reference',     Icon: BookMarked,    accent: 'text-emerald-600', chip: 'bg-emerald-50 text-emerald-700',bar: 'bg-emerald-500' },
  RBOOK:  { label: 'Reference',     Icon: BookMarked,    accent: 'text-emerald-600', chip: 'bg-emerald-50 text-emerald-700',bar: 'bg-emerald-500' },
  SREF:   { label: 'Special Ref',   Icon: BookMarked,    accent: 'text-rose-600',    chip: 'bg-rose-50 text-rose-700',     bar: 'bg-rose-500' },
  CD:     { label: 'Multimedia',    Icon: Disc,          accent: 'text-orange-600',  chip: 'bg-orange-50 text-orange-700', bar: 'bg-orange-500' },
  MAP:    { label: 'Map',           Icon: MapIcon,       accent: 'text-lime-600',    chip: 'bg-lime-50 text-lime-700',     bar: 'bg-lime-500' },
  DMAP:   { label: 'Digital Map',   Icon: MapIcon,       accent: 'text-green-600',   chip: 'bg-green-50 text-green-700',   bar: 'bg-green-500' },
  NEWS:   { label: 'Article',       Icon: Newspaper,     accent: 'text-slate-600',   chip: 'bg-slate-100 text-slate-700',  bar: 'bg-slate-500' },
  ACT:    { label: 'Legislation',   Icon: BookMarked,    accent: 'text-purple-600',  chip: 'bg-purple-50 text-purple-700', bar: 'bg-purple-500' },
};

const getType = (code) =>
  TYPE_CONFIG[code] || { label: 'Document', Icon: Library, accent: 'text-slate-600', chip: 'bg-slate-100 text-slate-700', bar: 'bg-slate-400' };

const isPlaceholder = (item) => {
  if (PLACEHOLDER_IDS.has(Number(item?.id))) return true;
  const author = parseAuthor(item?.author).trim().toLowerCase();
  return PLACEHOLDER_AUTHORS.has(author);
};

const getPublicationDateValue = (item) => {
  const acquisitionValue = Date.parse(item?.acquisition_date || '');
  if (!Number.isNaN(acquisitionValue)) return acquisitionValue;
  return Number(item?.publication_year) || 0;
};

const toLatestCards = (collection) =>
  (Array.isArray(collection) ? collection : [])
    .filter((item) => item && item.id && item.title && !isPlaceholder(item))
    .sort((a, b) => getPublicationDateValue(b) - getPublicationDateValue(a))
    .slice(0, 8)
    .map((item) => ({
      id: item.id,
      title: item.title,
      author: item.author || '',
      language: item.language || '',
      publication_year: item.publication_year || null,
      material_type_code: item.material_type_code || '',
      acquisition_date: item.acquisition_date || null
    }));

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse">
    <div className="h-1 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="flex gap-2">
        <div className="h-6 w-24 bg-slate-200 rounded-md" />
        <div className="h-6 w-16 bg-slate-100 rounded-md" />
      </div>
      <div className="space-y-2 pt-1">
        <div className="h-5 bg-slate-200 rounded w-full" />
        <div className="h-5 bg-slate-200 rounded w-3/4" />
      </div>
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="h-4 bg-slate-100 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// ─── Card Renderer ───────────────────────────────────────────────────────────
const LibraryCard = ({ item, index }) => {
  const type = getType(item.material_type_code);
  const author = parseAuthor(item.author);
  const lang = normalizeLanguage(item.language);
  const TypeIcon = type.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06, ease: 'easeOut' }}
      className="h-full"
    >
      <Link to={`/library/item/${item.id}`} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-nara-blue focus-visible:ring-offset-2 rounded-xl">
        <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-hover">
          {/* Top accent keyed to material type */}
          <span className={`block h-1 w-full ${type.bar}`} aria-hidden="true" />

          <div className="flex flex-1 flex-col p-5">
            {/* Type + language */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${type.chip}`}>
                <TypeIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
                {type.label}
              </span>
              {lang && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  {lang}
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className="font-display text-[1.05rem] font-semibold leading-snug text-nara-navy transition-colors group-hover:text-nara-blue"
              style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              title={item.title}
            >
              {item.title}
            </h3>

            {/* Metadata */}
            <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
              {author && (
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">{author}</span>
                </p>
              )}
              <div className="flex items-center justify-between">
                {item.publication_year ? (
                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {item.publication_year}
                  </span>
                ) : <span />}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-nara-blue opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  View
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

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

        const cached = sessionStorage.getItem(LATEST_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.timestamp && Date.now() - parsed.timestamp < LATEST_CACHE_TTL) {
            setItems(parsed.items);
            setLoading(false);
            return;
          }
        }

        const endpoints = [LATEST_ITEMS_URL, FULL_CATALOGUE_URL];
        let latestItems = [];

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, { cache: 'force-cache' });
            if (!response.ok) continue;
            const payload = await response.json();
            latestItems = toLatestCards(payload);
            if (latestItems.length) break;
          } catch {
            // try the next endpoint
          }
        }

        if (!latestItems.length) {
          throw new Error('No latest library data available');
        }

        setItems(latestItems);

        try {
          sessionStorage.setItem(LATEST_CACHE_KEY, JSON.stringify({
            items: latestItems,
            timestamp: Date.now()
          }));
        } catch {
          // sessionStorage full — ignore
        }
      } catch (err) {
        console.error('[LatestFromLibrary] Failed to load:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadLatest();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (error || items.length === 0) return null;

  const firstRow = items.slice(0, 4);
  const secondRow = items.slice(4);

  return (
    <div>
      {/* First row — always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {firstRow.map((item, index) => <LibraryCard key={item.id} item={item} index={index} />)}
      </div>

      {/* Second row — toggle */}
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
              {secondRow.map((item, index) => <LibraryCard key={item.id} item={item} index={index + 4} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        {secondRow.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all text-sm font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-nara-blue focus-visible:ring-offset-2"
            aria-expanded={showAll}
          >
            <ChevronDown
              className="h-4 w-4 transition-transform duration-300"
              style={{ transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
            {showAll
              ? t('library.showLess', { ns: 'home', defaultValue: 'Show Less' })
              : t('library.viewMore', { ns: 'home', defaultValue: 'View More' })}
          </button>
        )}

        <Link
          to="/library"
          className="inline-flex items-center gap-2 bg-nara-navy text-white pl-6 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-nara-blue transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-nara-blue focus-visible:ring-offset-2"
        >
          <span className="font-medium tracking-wide text-sm">
            {t('library.browseCta', { ns: 'home', defaultValue: 'Browse Full Catalogue' })}
          </span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default LatestFromLibrary;
