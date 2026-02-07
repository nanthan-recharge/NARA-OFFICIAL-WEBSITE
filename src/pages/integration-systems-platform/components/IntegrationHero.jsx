import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  RefreshCcw,
  Server,
  Shield,
  Signal,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const metricIconMap = {
  totalIntegrations: Server,
  activeConnections: Zap,
  avgHealthScore: Signal,
  alertsCount: AlertTriangle,
  uptimeEstimate: CheckCircle
};

const IntegrationHero = ({
  heroContent,
  summary,
  alerts,
  isLoading,
  lastUpdated,
  onRefresh
}) => {
  const { t, i18n } = useTranslation('integration');

  const resolvedHero = useMemo(() => {
    if (!heroContent) {
      return null;
    }
    const localized = heroContent?.translations?.[i18n.language] || {};
    return { ...heroContent, ...localized };
  }, [heroContent, i18n.language]);

  const headline = resolvedHero?.title || t('hero.title');
  const subheadline = resolvedHero?.subtitle || t('hero.subtitle');
  const description = resolvedHero?.description || t('hero.description');
  const heroBadges =
    resolvedHero?.badges ||
    t('hero.badges', { returnObjects: true, defaultValue: [] }) ||
    [];
  const heroCtas =
    resolvedHero?.ctas ||
    t('hero.ctas', { returnObjects: true, defaultValue: [] }) ||
    [];

  const metricConfig = useMemo(() => {
    const baseMetrics = t('hero.metrics', { returnObjects: true });
    const items = [
      {
        id: 'totalIntegrations',
        value: summary?.totalIntegrations ?? 0,
        label: baseMetrics?.totalIntegrations
      },
      {
        id: 'activeConnections',
        value: summary?.activeConnections ?? 0,
        label: baseMetrics?.activeConnections
      },
      {
        id: 'avgHealthScore',
        value: `${summary?.avgHealthScore ?? 0}%`,
        label: baseMetrics?.avgHealthScore
      },
      {
        id: 'uptimeEstimate',
        value: `${summary?.uptimeEstimate ?? 0}%`,
        label: baseMetrics?.uptimeEstimate
      },
      {
        id: 'alertsCount',
        value: summary?.alertsCount ?? 0,
        label: baseMetrics?.alertsCount
      }
    ];
    return items;
  }, [summary, t]);

  const alertsTitle = t('hero.alerts.title');
  const alertsEmpty = t('hero.alerts.empty');
  const refreshLabel = t('hero.metrics.refresh');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(12,74,110,0.45),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.35),transparent_50%),radial-gradient(circle_at_50%_85%,rgba(79,70,229,0.4),transparent_50%)]" />
        </div>
        <div className="absolute inset-0 opacity-30">
          {[...Array(16)].map((_, index) => (
            <motion.span
              key={index}
              className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/50"
              initial={{ opacity: 0.2 }}
              animate={{
                y: [-25, 25],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.4, 1]
              }}
              transition={{
                duration: 6 + (index % 4),
                repeat: Infinity,
                delay: index * 0.25
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-cyan-100/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <Shield className="h-4 w-4 text-cyan-200" />
                {t('hero.badge')}
              </span>
              {heroBadges?.map((badge) => (
                <span
                  key={badge?.id || badge?.label || badge}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur"
                >
                  <Zap className="h-4 w-4 text-amber-300" />
                  {badge?.label || badge}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl xl:text-6xl">
                {headline}
              </h1>
              <p className="max-w-3xl text-xl text-cyan-100/80">{subheadline}</p>
              <p className="max-w-3xl text-base text-slate-200/80">{description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metricConfig.map((metric) => {
                const IconComponent = metricIconMap[metric.id] || Server;
                return (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-cyan-100/70">{metric.label}</p>
                        <p className="mt-1 text-2xl font-semibold text-white">
                          {metric.value}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                        <IconComponent className="h-5 w-5 text-cyan-200" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {heroCtas?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {heroCtas.map((cta) => (
                  <a
                    key={cta?.id || cta?.label}
                    href={cta?.href || '#'}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
                      cta?.variant === 'secondary'
                        ? 'border border-white/30 text-white/80 hover:border-white hover:text-white'
                        : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
                    }`}
                  >
                    <span>{cta?.label || t('hero.ctaDefault')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-cyan-200/70">
                    {t('hero.alerts.badge')}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {alertsTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-cyan-100 transition hover:border-white/30 hover:text-white"
                  disabled={isLoading}
                >
                  <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {refreshLabel}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {alerts?.length ? (
                  alerts.map((alert) => (
                    <div
                      key={alert?.id}
                      className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{alert?.name}</p>
                          <p className="text-xs text-amber-100/80">
                            {t('hero.alerts.statusLabel', { status: alert?.status })}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-amber-200">
                          {alert?.health_score ?? 0}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-200/70">
                    {alertsEmpty}
                  </p>
                )}
              </div>

              <div className="mt-4 text-xs text-slate-200/60">
                {lastUpdated
                  ? t('hero.metrics.lastUpdated', {
                      time: lastUpdated.toLocaleTimeString(i18n.language === 'en' ? 'en-US' : undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    })
                  : null}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-cyan-100/80">
                {t('hero.statusBreakdown.title')}
              </h4>
              <div className="mt-4 space-y-3 text-sm text-slate-100/80">
                {Object.entries(summary?.statusBreakdown || {}).map(([key, count]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span>{t(`hero.statusBreakdown.${key}`)}</span>
                    <span className="font-semibold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationHero;
