import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Share2,
  ShieldCheck,
  Settings,
  Code2,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Users,
  ClipboardCheck,
  Bell
} from 'lucide-react';

const TAB_META = [
  { key: 'partners', icon: Share2, accent: 'from-cyan-500 to-blue-500' },
  { key: 'admin', icon: Settings, accent: 'from-emerald-500 to-teal-500' },
  { key: 'playground', icon: Code2, accent: 'from-purple-500 to-pink-500' }
];

const SUMMARY_ICONS = [Users, ClipboardCheck, Bell];

const buildTabData = (content) =>
  TAB_META.map((meta) => {
    const tabContent = content?.tabs?.[meta.key] || {};
    return {
      key: meta.key,
      icon: meta.icon,
      accent: meta.accent,
      label: tabContent.label || meta.key,
      heading: tabContent.heading || '',
      body: tabContent.body || '',
      benefits: Array.isArray(tabContent.benefits) ? tabContent.benefits : [],
      actions: Array.isArray(tabContent.actions) ? tabContent.actions : []
    };
  });

const APIIntegrationShowcase = ({ content = {} }) => {
  const [activeTab, setActiveTab] = useState('partners');
  const tabs = useMemo(() => buildTabData(content), [content]);
  const active = tabs.find((tab) => tab.key === activeTab) || tabs[0];

  const summaryCards = Array.isArray(content?.summaryCards) ? content.summaryCards : [];
  const howItWorks = content?.howItWorks || {};
  const howItWorksSteps = Array.isArray(howItWorks?.steps) ? howItWorks.steps : [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#061529] to-[#010b16] py-20">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            <span>{content?.badge || 'Unified API Access'}</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-300 bg-clip-text text-transparent">
              {content?.title || 'Integration Command Center'}
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-300 md:text-lg">
            {content?.subtitle ||
              'Connect partners or manage mission data manually from one control surface.'}
          </p>
          {content?.description && (
            <p className="mt-3 text-sm text-slate-400 md:text-base">{content.description}</p>
          )}

          {Array.isArray(content?.highlights) && content.highlights.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {content.highlights.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/60 px-4 py-2 text-xs text-slate-300"
                >
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {summaryCards.length > 0 && (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {summaryCards.slice(0, 3).map((card, index) => {
              const Icon = SUMMARY_ICONS[index % SUMMARY_ICONS.length];
              return (
                <div
                  key={`${card.title}-${index}`}
                  className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{card.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {howItWorksSteps.length > 0 && (
          <div className="mt-10 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8">
            <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div className="text-2xl font-semibold text-white">
                {howItWorks.heading || 'How it works'}
              </div>
              {howItWorks.caption && (
                <p className="text-sm text-slate-300 max-w-xl mx-auto md:mx-0">
                  {howItWorks.caption}
                </p>
              )}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={`${step.title}-${index}`}
                  className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5 text-left"
                >
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-200">
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </div>
                  <h4 className="text-base font-semibold text-white">{step.title}</h4>
                  <p className="mt-2 text-sm text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* tabs */}
        <div className="mt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = active?.key === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`group flex items-center gap-3 rounded-2xl border px-5 py-3 text-left transition ${
                    isActive
                      ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-100 shadow-cyan-500/20'
                      : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-cyan-400/40 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${tab.accent} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-wide">
                      {tab.label}
                    </div>
                    {tab.heading && (
                      <div className="text-xs text-slate-400">{tab.heading}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* tab content */}
          <div className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active?.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="grid gap-8 lg:grid-cols-3"
              >
                <div className="lg:col-span-2">
                  {(() => {
                    const ActiveIcon = active?.icon || Sparkles;
                    return (
                      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-lg shadow-black/30 backdrop-blur">
                        <div className="flex items-center gap-3 text-slate-200">
                          <ActiveIcon className="h-5 w-5 text-cyan-300" />
                          <h3 className="text-xl font-semibold">{active?.heading}</h3>
                        </div>
                        {active?.body && (
                          <p className="mt-4 text-sm leading-relaxed text-slate-300">
                            {active.body}
                          </p>
                        )}

                        {active?.benefits?.length > 0 && (
                          <ul className="mt-6 grid gap-4 md:grid-cols-2">
                            {active.benefits.map((benefit, index) => (
                              <li
                                key={`${benefit}-${index}`}
                                className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4"
                              >
                                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-cyan-300" />
                                <span className="text-sm text-slate-200">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {active?.actions?.length > 0 && (
                          <div className="mt-8 flex flex-wrap gap-3">
                            {active.actions.map((action, index) => (
                              <Link
                                key={`${action.label}-${index}`}
                                to={action.to || '#'}
                                className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                  index === 0
                                    ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20'
                                    : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/40 hover:text-white'
                                }`}
                              >
                                <span>{action.label}</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="space-y-6">
                  {content?.security && (
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur">
                      <div className="flex items-center gap-3 text-slate-200">
                        <Lock className="h-5 w-5 text-cyan-300" />
                        <div className="text-sm font-semibold uppercase tracking-wide">
                          {content.security.title || 'Security & governance included'}
                        </div>
                      </div>
                      {content.security.body && (
                        <p className="mt-3 text-sm text-slate-300">{content.security.body}</p>
                      )}

                      {Array.isArray(content.security.checklist) && (
                        <ul className="mt-4 space-y-3">
                          {content.security.checklist.map((item, index) => (
                            <li
                              key={`${item}-${index}`}
                              className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/60 p-3 text-xs text-slate-300"
                            >
                              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-cyan-300" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* global ctas */}
        {(content?.cta?.primary || content?.cta?.secondary) && (
          <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
            {content?.cta?.primary && (
              <Link
                to={content.cta.primary.to || '#'}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                <ArrowRight className="h-4 w-4" />
                <span>{content.cta.primary.label}</span>
              </Link>
            )}
            {content?.cta?.secondary && (
              <Link
                to={content.cta.secondary.to || '#'}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
                <span>{content.cta.secondary.label}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default APIIntegrationShowcase;
