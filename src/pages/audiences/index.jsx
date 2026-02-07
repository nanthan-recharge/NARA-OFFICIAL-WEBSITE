import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import MultilingualContent from 'components/compliance/MultilingualContent';
import SEOHead from '../../components/shared/SEOHead';

const AUDIENCE_KEYS = {
  'general-public': 'generalPublic',
  'researchers-students': 'researchers',
  'policy-regulators': 'policy',
  'industry-exporters': 'industry',
  'media-partners-donors': 'media'
};

const mergeLocalizedContent = (fallback, localized) => {
  if (Array.isArray(localized)) {
    return localized.length ? localized : Array.isArray(fallback) ? fallback : [];
  }

  if (Array.isArray(fallback)) {
    return fallback;
  }

  const fallbackIsObject = typeof fallback === 'object' && fallback !== null;
  const localizedIsObject = typeof localized === 'object' && localized !== null;

  if (fallbackIsObject || localizedIsObject) {
    const base = fallbackIsObject ? { ...fallback } : {};
    const source = localizedIsObject ? localized : {};

    Object.keys(source).forEach((key) => {
      base[key] = mergeLocalizedContent(fallback?.[key], source[key]);
    });

    return base;
  }

  if (localized === undefined || localized === null || localized === '') {
    return fallback;
  }

  return localized;
};

const AudiencePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['audiences']);

  const audienceKey = AUDIENCE_KEYS[slug] || 'generalPublic';

  useEffect(() => {
    if (!AUDIENCE_KEYS[slug]) {
      navigate('/audiences/general-public', { replace: true });
    }
  }, [slug, navigate]);

  const language = (i18n.language || 'en').split('-')[0];
  const localizedContent = t(`${audienceKey}`, { returnObjects: true });
  const fallbackContent = useMemo(
    () => i18n.getResource('en', 'audiences', audienceKey) || {},
    [i18n, audienceKey]
  );

  const content = useMemo(
    () => mergeLocalizedContent(fallbackContent, localizedContent),
    [fallbackContent, localizedContent]
  );

  const hero = content.hero || {};
  const sections = content.sections || {};
  const ctas = Array.isArray(hero.ctas) ? hero.ctas : [];

  return (
    <MultilingualContent
      language={language}
      className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white"
    >
      <SEOHead
        title="Audience Portal"
        description="Tailored resources for different audiences — general public, researchers, students, and industry professionals."
        path="/audiences"
        keywords="audiences, public resources, researchers, students, industry"
      />
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950/80">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-blue-500/5" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-24 md:px-6">
          {hero.badge && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">
              {hero.badge}
            </span>
          )}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-semibold md:text-4xl lg:text-5xl"
            >
              {hero.title}
            </motion.h1>
            {hero.description && (
              <p className="max-w-3xl text-lg text-slate-300">{hero.description}</p>
            )}
          </div>
          {ctas.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {ctas.map((cta) => (
                <Link
                  key={`${cta.href}-${cta.label}`}
                  to={cta.href || '#'}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/20"
                >
                  <span>{cta.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-4 py-16 md:px-6">
        {Object.entries(sections).map(([key, section]) => {
          const items = Array.isArray(section.items) ? section.items : [];
          return (
            <motion.div
              key={`${audienceKey}-${key}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl space-y-3">
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  {section.description && (
                    <p className="text-sm text-slate-300">{section.description}</p>
                  )}
                </div>
                {section.href && (
                  <Link
                    to={section.href}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
                  >
                    <span>{t('nav.label')}</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>

              {items.length > 0 && (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {items.map((item) => (
                    <Link
                      key={`${item.href}-${item.label}`}
                      to={item.href || '#'}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </section>
    </MultilingualContent>
  );
};

export default AudiencePage;
