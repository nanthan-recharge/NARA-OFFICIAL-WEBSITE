import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Target,
  Activity,
  Brain,
  PieChart,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Zap,
  Shield,
  Waves,
  LineChart as LineChartIcon,
  Globe
} from 'lucide-react';
import { metricsAggregationService } from '../../services/impactAssessmentService';

/* ───────── Static configs (avoid dynamic Tailwind) ───────── */
const TOOL_CONFIGS = [
  {
    id: 'predictive',
    icon: Brain,
    gradient: 'from-purple-500 to-violet-600',
    glow: 'group-hover:shadow-purple-500/20',
    iconBg: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    dotColor: 'bg-purple-400',
    path: '/analytics/predictive'
  },
  {
    id: 'impact',
    icon: Target,
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'group-hover:shadow-blue-500/20',
    iconBg: 'bg-cyan-500/20',
    textColor: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    path: '/analytics/impact-assessment'
  },
  {
    id: 'economic',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-green-600',
    glow: 'group-hover:shadow-emerald-500/20',
    iconBg: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    path: '/analytics/economic-valuation'
  },
  {
    id: 'simulator',
    icon: Activity,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'group-hover:shadow-amber-500/20',
    iconBg: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    dotColor: 'bg-amber-400',
    path: '/analytics/policy-simulator'
  }
];

const STAT_CONFIGS = [
  { key: 'policies', icon: Target, gradient: 'from-cyan-500 to-blue-500', textColor: 'text-cyan-400' },
  { key: 'accuracy', icon: CheckCircle, gradient: 'from-emerald-500 to-green-500', textColor: 'text-emerald-400' },
  { key: 'roi', icon: DollarSign, gradient: 'from-purple-500 to-violet-500', textColor: 'text-purple-400' },
  { key: 'health', icon: Activity, gradient: 'from-amber-500 to-orange-500', textColor: 'text-amber-400' }
];

const INSIGHT_STYLES = {
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', iconBg: 'bg-amber-500/20', iconColor: 'text-amber-400' },
  info: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', iconBg: 'bg-cyan-500/20', iconColor: 'text-cyan-400' }
};

const VALUE_PROPS = [
  { icon: Brain, gradient: 'from-cyan-500 to-blue-500', key: 'ai' },
  { icon: PieChart, gradient: 'from-emerald-500 to-green-500', key: 'data' },
  { icon: Shield, gradient: 'from-purple-500 to-violet-500', key: 'risk' }
];

/* ───────── Animation variants ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

/* ───────── Component ───────── */
const AnalyticsHub = () => {
  const { t } = useTranslation('analytics');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metricsWarning, setMetricsWarning] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data, error: fetchError } = await metricsAggregationService.aggregateAll();
      if (data) {
        setMetrics(data);
        setMetricsWarning(data.source !== 'live');
      } else {
        setMetricsWarning(true);
        setMetrics(getFallbackMetrics());
      }
      if (fetchError) {
        console.warn('Analytics metrics fallback in use:', fetchError);
      }
    } catch (err) {
      console.warn('Analytics metrics unavailable, using fallback:', err);
      setMetricsWarning(true);
      setMetrics(getFallbackMetrics());
    } finally {
      setLoading(false);
    }
  };

  /* ── Tool data from i18n ── */
  const tools = TOOL_CONFIGS.map(cfg => ({
    ...cfg,
    name: t(`tools.${cfg.id}.name`),
    description: t(`tools.${cfg.id}.description`),
    features: Object.values(t(`tools.${cfg.id}.features`, { returnObjects: true }) || {})
  }));

  const recentInsights = [
    { type: 'success', title: t('insights.success.title'), description: t('insights.success.description'), timestamp: t('insights.timestamp.hours', { count: 2 }) },
    { type: 'warning', title: t('insights.warning.title'), description: t('insights.warning.description'), timestamp: t('insights.timestamp.hours', { count: 5 }) },
    { type: 'info', title: t('insights.info.title'), description: t('insights.info.description'), timestamp: t('insights.timestamp.day') }
  ];

  /* ── Stat values ── */
  const getStatValues = () => {
    if (!metrics) return [];
    return [
      { label: t('stats.policies'), value: metrics.policyImpact?.avgScore || '0', sub: `${metrics.policyImpact?.totalPolicies || 0} ${t('labels.policiesTracked')}` },
      { label: t('stats.accuracy'), value: `${metrics.projectOutcomes?.avgSuccessScore || '0'}%`, sub: `${metrics.projectOutcomes?.totalProjects || 0} ${t('labels.projectsMeasured')}` },
      { label: t('labels.avgROI'), value: `${metrics.roi?.avgROI || '0'}%`, sub: `${t('labels.netValue')}: LKR ${((metrics.roi?.netValue || 0) / 1000000).toFixed(1)}M` },
      { label: t('stats.models'), value: metrics.overall?.healthScore || '0', sub: t('stats.insights') }
    ];
  };

  return (
    <>
      <Helmet>
        <title>{t('hero.title')} - NARA Digital Ocean</title>
        <meta name="description" content={t('hero.description')} />
      </Helmet>

      <div className="min-h-screen bg-slate-950">

        {/* ═══════════ HERO SECTION ═══════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#031730] via-[#06254a] to-[#0b3d74] text-white pt-32 pb-20">
          {/* Decorative gradients */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
            <div className="absolute top-40 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          {/* Grid pattern overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
              {/* Badge */}
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">AI-Powered Marine Intelligence</span>
              </motion.div>

              {/* Title */}
              <motion.h1 variants={fadeUp} custom={1} className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
                {t('hero.title')}
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6">
                {t('hero.description')}
              </motion.p>

              {/* Fallback warning */}
              {metricsWarning && (
                <motion.div variants={fadeUp} custom={3}
                  className="max-w-2xl mx-auto mb-8 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-sm text-amber-300">{t('messages.fallback')}</span>
                </motion.div>
              )}
            </motion.div>

            {/* ── Quick Stats Row ── */}
            {!loading && metrics && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
              >
                {getStatValues().map((stat, idx) => {
                  const cfg = STAT_CONFIGS[idx];
                  const Icon = cfg.icon;
                  return (
                    <motion.div key={idx} variants={fadeUp} custom={idx}
                      className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 p-5 hover:border-white/20 transition-all duration-300"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className={`text-2xl sm:text-3xl font-bold ${cfg.textColor} mb-0.5`}>{stat.value}</div>
                      <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-white/10 mb-3" />
                    <div className="w-20 h-8 bg-white/10 rounded mb-2" />
                    <div className="w-24 h-4 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════ ANALYTICS TOOLS GRID ═══════════ */}
        <section className="relative py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white mb-3">{t('hero.subtitle')}</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">{t('hero.description')}</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tools.map((tool, idx) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div key={tool.id} variants={fadeUp} custom={idx}>
                      <Link
                        to={tool.path}
                        className={`group block rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10
                          hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 overflow-hidden
                          hover:shadow-xl ${tool.glow}`}
                      >
                        {/* Tool Header */}
                        <div className={`relative p-6 bg-gradient-to-r ${tool.gradient} overflow-hidden`}>
                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                          />
                          <div className="relative flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Icon className="w-7 h-7 text-white" />
                              </div>
                              <div>
                                <h3 className="font-headline text-xl font-bold text-white">{tool.name}</h3>
                                <p className="text-white/80 text-sm mt-1 max-w-xs">{tool.description}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all mt-1" />
                          </div>
                        </div>

                        {/* Tool Features */}
                        <div className="p-6">
                          <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-3">{t('actions.exploreTool')}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {tool.features.map((feature, fi) => (
                              <div key={fi} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 ${tool.dotColor} rounded-full`} />
                                <span className="text-sm text-slate-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ RECENT INSIGHTS ═══════════ */}
        <section className="relative py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-cyan-500/20">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white">{t('insights.title')}</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {recentInsights.map((insight, idx) => {
                  const style = INSIGHT_STYLES[insight.type];
                  const InsightIcon = insight.type === 'success' ? CheckCircle : insight.type === 'warning' ? AlertCircle : BarChart3;
                  return (
                    <motion.div key={idx} variants={fadeUp} custom={idx}
                      className={`rounded-2xl ${style.bg} border ${style.border} p-6 hover:scale-[1.02] transition-transform duration-300`}
                    >
                      <div className={`inline-flex p-2 ${style.iconBg} rounded-xl mb-4`}>
                        <InsightIcon className={`w-5 h-5 ${style.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{insight.title}</h3>
                      <p className="text-sm text-slate-300/80 leading-relaxed mb-3">{insight.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {insight.timestamp}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ VALUE PROPOSITION ═══════════ */}
        <section className="relative py-16 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {VALUE_PROPS.map((vp, idx) => {
                const Icon = vp.icon;
                return (
                  <motion.div key={vp.key} variants={fadeUp} custom={idx} className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${vp.gradient} mb-5 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-headline text-xl font-bold text-white mb-2">{t(`valueProps.${vp.key}Title`)}</h3>
                    <p className="text-slate-400 leading-relaxed">{t(`valueProps.${vp.key}Desc`)}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══════════ CTA SECTION ═══════════ */}
        <section className="relative py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="relative rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10
                border border-white/10 p-10 sm:p-14 text-center overflow-hidden"
            >
              {/* Decorative */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300">{t('actions.getStarted')}</span>
                </div>
                <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-4">
                  Explore Advanced Marine Analytics
                </h2>
                <p className="text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
                  Dive into predictive models, impact assessments, and economic valuations powered by real-time data from Sri Lanka's aquatic ecosystems.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/analytics/predictive"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500
                      text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                  >
                    <Brain className="w-5 h-5" />
                    {t('tools.predictive.name')}
                  </Link>
                  <Link to="/analytics/impact-assessment"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] border border-white/10
                      text-white font-semibold rounded-xl hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300"
                  >
                    <Target className="w-5 h-5" />
                    {t('tools.impact.name')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
};

/* ───────── Fallback metrics when Firebase is unreachable ───────── */
const getFallbackMetrics = () => ({
  policyImpact: {
    avgScore: '72.50',
    totalPolicies: 18,
    effective: 14
  },
  projectOutcomes: {
    avgSuccessScore: '81.20',
    totalProjects: 24,
    successful: 19
  },
  roi: {
    avgROI: '28.40',
    totalInvestment: 125000000,
    totalReturns: 160000000,
    netValue: 35000000
  },
  overall: {
    healthScore: '73.70'
  },
  source: 'local-fallback'
});

export default AnalyticsHub;
