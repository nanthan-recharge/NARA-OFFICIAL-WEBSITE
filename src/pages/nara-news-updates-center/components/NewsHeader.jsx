import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Calendar,
  Flame,
  Globe,
  Newspaper,
  PlayCircle,
  Sparkles,
  Timer,
  TrendingUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STATS_CONFIG = [
  { key: 'totalArticles', icon: Newspaper, gradient: 'from-cyan-400/20 to-blue-500/20' },
  { key: 'totalViews', icon: TrendingUp, gradient: 'from-emerald-400/20 to-teal-500/20' },
  { key: 'totalCategories', icon: Globe, gradient: 'from-purple-400/20 to-indigo-500/20' },
  { key: 'averageReadTime', icon: Timer, gradient: 'from-amber-400/20 to-orange-500/20' }
];

const NewsHeader = ({
  heroContent,
  metadata,
  tickerArticles = [],
  isLoading = false,
  onTickerSelect
}) => {
  const { t, i18n } = useTranslation(['news', 'common']);
  const [activeTicker, setActiveTicker] = useState(0);

  const resolvedHero = useMemo(() => {
    if (!heroContent) return null;
    const localeCopy = heroContent?.translations?.[i18n.language] || {};
    return { ...heroContent, ...localeCopy };
  }, [heroContent, i18n.language]);

  const heroTitle = resolvedHero?.title || t('hero.title');
  const heroSubtitle = resolvedHero?.subtitle || t('hero.subtitle');
  const heroDescription = resolvedHero?.description || t('hero.description');
  const heroBadges =
    resolvedHero?.badges ||
    t('hero.badges', { returnObjects: true, defaultValue: [] }) ||
    [];
  const heroCTAs =
    resolvedHero?.ctas ||
    t('hero.ctas', { returnObjects: true, defaultValue: [] }) ||
    [];

  const stats = useMemo(() => {
    const categoryCount = Object.keys(metadata?.categories || {}).length;
    const formattedViews =
      metadata?.total_views != null ? metadata.total_views.toLocaleString() : '0';
    const readTime =
      metadata?.average_read_time != null
        ? `${metadata.average_read_time} ${t('hero.stats.minutesSuffix')}`
        : t('hero.stats.minsFallback');

    return {
      totalArticles: metadata?.total_articles ?? 0,
      totalViews: formattedViews,
      totalCategories: categoryCount,
      averageReadTime: metadata?.average_read_time ? readTime : t('hero.stats.noReadTime')
    };
  }, [metadata, t]);

  const tickerHeading = resolvedHero?.tickerHeading || t('hero.ticker.heading');
  const tickerSubheading =
    resolvedHero?.tickerSubheading || t('hero.ticker.subheading', { count: tickerArticles.length });

  const tickerItems = useMemo(() => {
    return tickerArticles.map((article, index) => {
      const translation = article?.translations?.[i18n.language] || {};
      return {
        ...article,
        displayTitle: translation?.title || article?.title,
        displaySummary: translation?.summary || article?.summary,
        displayCategory: translation?.category || article?.category,
        index
      };
    });
  }, [tickerArticles, i18n.language]);

  useEffect(() => {
    if (tickerItems.length <= 1) return undefined;
    const interval = setInterval(() => {
      setActiveTicker((prev) => (prev + 1) % tickerItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [tickerItems]);

  const safeActiveTicker = tickerItems[activeTicker] ? activeTicker : 0;
  const activeArticle = tickerItems[safeActiveTicker];
  const backgroundParticles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${(index * 37 + 11) % 100}%`,
        top: `${(index * 23 + 17) % 100}%`
      })),
    []
  );

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-45 mix-blend-screen"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundSize: '300% 300%',
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(8,145,178,0.35), transparent 55%), ' +
              'radial-gradient(circle at 80% 0%, rgba(14,116,144,0.25), transparent 45%), ' +
              'radial-gradient(circle at 50% 80%, rgba(59,130,246,0.35), transparent 50%)'
          }}
        />

        <div className="absolute inset-0 opacity-30">
          {backgroundParticles.map((particle, index) => (
            <motion.span
              key={particle.id}
              className="absolute w-2 h-2 rounded-full bg-cyan-300/40"
              initial={{ opacity: 0.2 }}
              animate={{
                y: [-20, 20],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.4, 1]
              }}
              transition={{
                duration: 6 + (index % 5),
                repeat: Infinity,
                delay: index * 0.3
              }}
              style={{
                left: particle.left,
                top: particle.top
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/75" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-3 text-sm font-semibold text-white">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-slate-950/70 px-4 py-2 shadow-lg backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-cyan-100" />
                  {t('hero.badge')}
                </span>
                {heroBadges?.map((badge) => (
                  <span
                    key={badge?.id || badge}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/70 px-4 py-2 text-white shadow-lg"
                  >
                    <Flame className="w-4 h-4 text-amber-300" />
                    {badge?.label || badge}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.55)]"
                >
                  {heroTitle}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="max-w-4xl text-xl font-semibold text-cyan-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-2xl"
                >
                  {heroSubtitle}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="max-w-3xl text-base font-medium leading-relaxed text-slate-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-lg"
                >
                  {heroDescription}
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {STATS_CONFIG.map(({ key, icon: Icon, gradient }) => (
                <div
                  key={key}
                  className="relative overflow-hidden rounded-2xl border border-white/20 bg-slate-950/70 p-5 shadow-xl backdrop-blur-xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none opacity-70`}
                  />
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-bold uppercase tracking-wide text-cyan-50">
                        {t(`hero.stats.${key}`)}
                      </p>
                      <p className="text-3xl font-bold text-white drop-shadow">
                        {stats[key] ?? '—'}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                      <Icon className="w-6 h-6 text-cyan-50" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {heroCTAs?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {heroCTAs.map((cta) => (
                  <a
                    key={cta?.id || cta?.label}
                    href={cta?.href || '#'}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      cta?.variant === 'secondary'
                        ? 'bg-transparent border border-white/30 hover:border-white text-white/80 hover:text-white'
                        : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:translate-y-[-2px]'
                    }`}
                  >
                    {cta?.icon === 'play' && <PlayCircle className="w-5 h-5" />}
                    <span>{cta?.label || t('hero.ctaDefault')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="lg:col-span-5 w-full"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-2xl p-6 shadow-2xl shadow-blue-900/30">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-cyan-200/80">
                    {t('hero.ticker.label')}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{tickerHeading}</h3>
                  <p className="text-sm text-slate-200/70">{tickerSubheading}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-300" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                    {t('hero.ticker.live')}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <AnimatePresence mode="wait">
                  {activeArticle ? (
                    <motion.div
                      key={activeArticle?.id || activeArticle?.index}
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-cyan-200/70">
                        <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-100">
                          <Activity className="w-3 h-3" />
                          {activeArticle?.displayCategory || t('hero.ticker.genericCategory')}
                        </span>
                        <span className="inline-flex items-center gap-2 text-slate-200/70">
                          <Calendar className="w-3 h-3" />
                          {activeArticle?.date || t('hero.ticker.noDate')}
                        </span>
                      </div>

                      <h4 className="text-2xl font-semibold text-white">
                        {activeArticle?.displayTitle}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-200/80 line-clamp-4 md:line-clamp-5">
                        {activeArticle?.displaySummary || t('hero.ticker.noSummary')}
                      </p>

                      <button
                        type="button"
                        onClick={() => onTickerSelect?.(activeArticle)}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                      >
                        {t('hero.ticker.openStory')}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-slate-200/70"
                    >
                      {isLoading ? t('hero.ticker.loading') : t('hero.ticker.empty')}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 space-y-3">
                {tickerItems.slice(0, 4).map((item, index) => {
                  const isActive = index === safeActiveTicker;
                  return (
                    <button
                      key={item?.id || index}
                      type="button"
                      onClick={() => setActiveTicker(index)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                        isActive
                          ? 'border-cyan-400/50 bg-cyan-400/10 shadow-lg shadow-cyan-500/10'
                          : 'border-white/5 bg-white/5 hover:border-cyan-300/30 hover:bg-cyan-500/10'
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100/80">
                        {item?.displayCategory || t('hero.ticker.genericCategory')}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white/90 line-clamp-2">
                        {item?.displayTitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white/95" preserveAspectRatio="none">
          <path d="M0,80 C320,120 480,20 720,60 C960,100 1120,20 1440,80 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </header>
  );
};

export default NewsHeader;
