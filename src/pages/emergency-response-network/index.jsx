import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import AlertCard from './components/AlertCard';
import EmergencyContactCard from './components/EmergencyContactCard';
import PreparednessResourceCard from './components/PreparednessResourceCard';
import SystemStatusIndicator from './components/SystemStatusIndicator';
import EvacuationMap from './components/EvacuationMap';
import usePageContent from '../../hooks/usePageContent';
import { EMERGENCY_RESPONSE_CONTENT } from './content';
import {
  submitEmergencyIncident,
  submitNonEmergencyRequest,
  submitEnvironmentalIncident
} from '../../services/emergencyResponseService';
import { cn } from '../../utils/cn';
import StitchWrapper from '../../components/shared/StitchWrapper';

const DEFAULT_HERO_IMAGE = '/assets/emergency/hero-1.png';
const FALLBACK_IMAGES = [
  '/assets/emergency/hero-1.png',
  '/assets/emergency/hero-2.png',
  '/assets/emergency/hero-3.png'
];

const HeroCarousel = ({ images = [], title }) => {
  const filteredImages = (images || []).filter(Boolean);
  const validImages = filteredImages.length > 0 ? filteredImages : FALLBACK_IMAGES;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % validImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [validImages.length]);

  const goTo = (direction) => {
    if (validImages.length <= 1) return;
    setIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return validImages.length - 1;
      return next % validImages.length;
    });
  };

  return (
    <div className="relative h-[320px] lg:h-[420px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl group z-0">
      {validImages.map((src, idx) => (
        <img
          key={`${src}-${idx}`}
          src={src}
          alt={`${title ?? 'Emergency response'} ${idx + 1}`}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            idx === index ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 via-transparent to-transparent pointer-events-none" />

      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/70 opacity-0 group-hover:opacity-100 z-10"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/70 opacity-0 group-hover:opacity-100 z-10"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
            {validImages.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  dotIndex === index ? 'w-6 bg-cyan-400' : 'w-2 bg-white/30'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};



// Modern Glassmorphism Styles
const toneStyles = {
  default: {
    card: 'bg-white/5 border border-white/10 text-white shadow-xl backdrop-blur-md hover:bg-white/10 transition-colors duration-300',
    heading: 'text-white',
    subheading: 'text-gray-300',
    label: 'text-gray-300',
    support: 'text-gray-400',
    buttonVariant: 'primary',
    success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200',
    error: 'bg-red-500/10 border border-red-500/20 text-red-200',
  },
  critical: {
    card: 'bg-red-950/20 border border-red-500/30 text-white shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] backdrop-blur-md',
    heading: 'text-red-100',
    subheading: 'text-red-200/80',
    label: 'text-red-200',
    support: 'text-red-200/60',
    buttonVariant: 'danger',
    success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200',
    error: 'bg-red-500/20 border border-red-500/40 text-red-100',
  },
  environmental: {
    card: 'bg-teal-950/20 border border-teal-500/30 text-white shadow-[0_0_40px_-10px_rgba(20,184,166,0.2)] backdrop-blur-md',
    heading: 'text-teal-100',
    subheading: 'text-teal-200/80',
    label: 'text-teal-200',
    support: 'text-teal-200/60',
    buttonVariant: 'outline',
    success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200',
    error: 'bg-red-500/20 border border-red-500/40 text-red-100',
  }
};

const createInitialFormState = (fields) => {
  return fields?.reduce((acc, field) => {
    acc[field?.id] = field?.type === 'file' ? null : '';
    return acc;
  }, {}) ?? {};
};

const ReportForm = ({ formId, config, tone = 'default', language = 'en', onSubmit }) => {
  const [values, setValues] = useState(() => createInitialFormState(config?.fields));
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const styles = toneStyles[tone] ?? toneStyles.default;



  const handleChange = (field, event) => {
    const { type, files, value } = event?.target ?? {};
    setValues((prev) => ({
      ...prev,
      [field?.id]: type === 'file' ? files : value
    }));
  };

  const handleSubmit = (event) => {
    event?.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const payload = {};
    const attachments = [];

    config?.fields?.forEach((field) => {
      if (field?.type === 'file') {
        if (values?.[field?.id]) {
          attachments.push(...Array.from(values[field.id] ?? []));
        }
      } else {
        payload[field?.id] = values?.[field?.id] ?? '';
      }
    });

    const submissionData = {
      ...payload,
      formId,
      language,
      submittedAt: new Date().toISOString()
    };

    const submitPromise = typeof onSubmit === 'function'
      ? onSubmit(submissionData, attachments)
      : Promise.resolve();

    submitPromise
      .then(() => {
        setSubmitted(true);
        setValues(createInitialFormState(config?.fields));
      })
      .catch((submitError) => {
        console.error('Failed to submit report form:', submitError);
        setError(submitError?.message || 'Unable to submit the report. Please try again later.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <section
      id={formId}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 lg:p-8 transition-all duration-300',
        styles.card
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className={cn('text-xl font-headline font-bold flex items-center gap-2', styles.heading)}>
            {tone === 'critical' && <Icon name="AlertCircle" className="text-red-400" size={24} />}
            {tone === 'environmental' && <Icon name="Leaf" className="text-teal-400" size={24} />}
            {config?.title}
          </h3>
          {config?.description && (
            <p className={cn('text-sm font-body mt-2 leading-relaxed', styles.subheading)}>{config?.description}</p>
          )}
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {config?.fields?.map((field) => {
          const value = values?.[field?.id] ?? '';

          return (
            <div key={field?.id} className="space-y-1.5">
              <label
                htmlFor={`${formId}-${field?.id}`}
                className={cn('block text-sm font-medium ml-1', styles.label)}
              >
                {field?.label}
                {field?.required ? <span className="text-red-400 ml-0.5">*</span> : null}
              </label>

              {field?.type === 'textarea' ? (
                <textarea
                  id={`${formId}-${field?.id}`}
                  name={field?.id}
                  required={field?.required}
                  value={value}
                  placeholder={field?.placeholder}
                  className="w-full min-h-[120px] rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  onChange={(event) => handleChange(field, event)}
                />
              ) : field?.type === 'select' ? (
                <div className="relative">
                  <select
                    id={`${formId}-${field?.id}`}
                    name={field?.id}
                    required={field?.required}
                    value={value}
                    className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 appearance-none transition-all"
                    onChange={(event) => handleChange(field, event)}
                  >
                    <option value="" disabled className="bg-slate-900 text-gray-500">
                      {field?.placeholder}
                    </option>
                    {field?.options?.map((option) => (
                      <option key={option} value={option} className="bg-slate-900 text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                  <Icon name="ChevronDown" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16} />
                </div>
              ) : field?.type === 'file' ? (
                <div className="relative">
                  <input
                    id={`${formId}-${field?.id}`}
                    name={field?.id}
                    type="file"
                    accept={field?.accept ?? '*'}
                    multiple
                    className="w-full rounded-xl bg-black/20 border border-dashed border-white/20 px-4 py-8 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 transition-all"
                    onChange={(event) => handleChange(field, event)}
                  />
                  <div className="absolute top-3 right-4 pointer-events-none text-white/20">
                    <Icon name="UploadCloud" size={20} />
                  </div>
                </div>
              ) : (
                <Input
                  id={`${formId}-${field?.id}`}
                  name={field?.id}
                  type={field?.type ?? 'text'}
                  required={field?.required}
                  value={value}
                  placeholder={field?.placeholder}
                  onChange={(event) => handleChange(field, event)}
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:ring-cyan-500/50 focus:border-cyan-500/50 rounded-xl"
                />
              )}
            </div>
          );
        })}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-white/5">
          <div className={cn('text-xs', styles.support)}>
            {config?.supportText}
          </div>
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            iconName="Send"
            iconPosition="right"
            variant={styles.buttonVariant}
            className="w-full sm:w-auto shadow-lg shadow-cyan-900/20"
          >
            {config?.submitLabel}
          </Button>
        </div>
      </form>

      {error && (
        <div className={cn('mt-4 flex items-start gap-3 rounded-xl px-4 py-3 text-sm animate-in fade-in slide-in-from-top-2', styles.error)}>
          <Icon name="AlertTriangle" size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {submitted && (
        <div className={cn('mt-4 flex items-start gap-3 rounded-xl px-4 py-3 text-sm animate-in fade-in slide-in-from-top-2', styles.success)}>
          <Icon name="CheckCircle" size={18} className="mt-0.5 shrink-0" />
          {config?.acknowledgement}
        </div>
      )}
    </section>
  );
};

const IntelligentReportingHub = ({ localizedContent, language, handlers }) => {
  const [activeTab, setActiveTab] = useState('emergency');

  const tabs = [
    { id: 'emergency', label: 'Emergency', icon: 'AlertTriangle', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { id: 'environmental', label: 'Environmental', icon: 'Leaf', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { id: 'non-emergency', label: 'General Support', icon: 'HelpCircle', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }
  ];

  const activeConfig = useMemo(() => {
    switch (activeTab) {
      case 'emergency':
        return {
          formId: 'emergency-reporting',
          config: {
            ...localizedContent?.reporting?.emergency?.form,
            description: localizedContent?.reporting?.emergency?.description,
            acknowledgement: localizedContent?.reporting?.emergency?.form?.acknowledgement,
            submitLabel: localizedContent?.reporting?.emergency?.form?.submitLabel,
            title: localizedContent?.reporting?.emergency?.form?.title,
            supportText: localizedContent?.reporting?.emergency?.targetResponse
          },
          tone: 'critical',
          handler: handlers.emergency
        };
      case 'environmental':
        return {
          formId: 'environmental-reporting-form',
          config: {
            ...localizedContent?.reporting?.environmental?.form,
            acknowledgement: localizedContent?.reporting?.environmental?.form?.acknowledgement,
            title: localizedContent?.reporting?.environmental?.form?.title,
            description: localizedContent?.reporting?.environmental?.description,
            submitLabel: localizedContent?.reporting?.environmental?.form?.submitLabel
          },
          tone: 'environmental',
          handler: handlers.environmental
        };
      case 'non-emergency':
      default:
        return {
          formId: 'non-emergency-reporting',
          config: {
            ...localizedContent?.reporting?.nonEmergency?.form,
            description: localizedContent?.reporting?.nonEmergency?.description,
            acknowledgement: localizedContent?.reporting?.nonEmergency?.form?.acknowledgement,
            supportText: localizedContent?.reporting?.nonEmergency?.supportText,
            submitLabel: localizedContent?.reporting?.nonEmergency?.form?.submitLabel,
            title: localizedContent?.reporting?.nonEmergency?.form?.title
          },
          tone: 'default',
          handler: handlers.nonEmergency
        };
    }
  }, [activeTab, localizedContent, handlers]);

  return (
    <div className="w-full space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold border',
              activeTab === tab.id
                ? `${tab.bg} ${tab.color} border-current shadow-lg scale-105`
                : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon name={tab.icon} size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Form Container */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ReportForm
          key={activeTab} // Force re-mount on tab change for clean state
          formId={activeConfig.formId}
          config={activeConfig.config}
          tone={activeConfig.tone}
          language={language}
          onSubmit={activeConfig.handler}
        />
      </div>
    </div>
  );
};


const QuickActionCard = ({ action }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl hover:border-cyan-500/30">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative mb-5 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-300 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300">
        <Icon name={action?.primary?.icon ?? 'AlertCircle'} size={24} />
      </div>
      <div>
        <h3 className="text-lg font-headline font-bold text-white group-hover:text-cyan-300 transition-colors">{action?.title}</h3>
        <p className="text-sm font-body text-gray-400 group-hover:text-gray-300 transition-colors">{action?.summary}</p>
      </div>
    </div>

    <div className="relative flex flex-col gap-3">
      {action?.primary && (
        <Button
          asChild
          size="sm"
          variant="secondary"
          iconName={action?.primary?.icon}
          className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/5 text-white"
        >
          <a href={action?.primary?.href}>{action?.primary?.label}</a>
        </Button>
      )}
      {action?.secondary && (
        <Button
          asChild
          size="sm"
          variant="ghost"
          iconName={action?.secondary?.icon}
          className="w-full justify-between text-gray-400 hover:text-white"
        >
          <a href={action?.secondary?.href}>{action?.secondary?.label}</a>
        </Button>
      )}
    </div>
  </div>
);

const EmergencyResponseNetwork = () => {
  const { i18n } = useTranslation();
  const language = i18n?.language ?? 'en';
  const localizedContent = EMERGENCY_RESPONSE_CONTENT?.[language] ?? EMERGENCY_RESPONSE_CONTENT?.en;
  const { content: cmsContent } = usePageContent('emergency', { enabled: true });

  const hero = useMemo(() => {
    const heroOverride = cmsContent?.hero?.translations?.[language] ?? cmsContent?.hero?.translations?.en ?? cmsContent?.hero ?? {};
    const base = localizedContent?.hero ?? {};
    // User requested explicitly to ONLY use the 3 AI generated images
    const gallery = FALLBACK_IMAGES;

    return {
      badge: heroOverride?.badge ?? base?.badge,
      subheading: heroOverride?.subheading ?? base?.subheading,
      title: heroOverride?.title ?? base?.title,
      highlight: heroOverride?.highlight ?? base?.highlight,
      description: heroOverride?.description ?? base?.description,
      primaryCta: {
        label: heroOverride?.primaryCtaLabel ?? base?.primaryCta?.label,
        icon: base?.primaryCta?.icon ?? 'AlertOctagon',
        href: cmsContent?.hero?.ctaLink ?? '#emergency-reporting'
      },
      secondaryCta: {
        label: heroOverride?.secondaryCtaLabel ?? base?.secondaryCta?.label,
        icon: base?.secondaryCta?.icon ?? 'LayoutDashboard',
        href: cmsContent?.hero?.secondaryCtaLink ?? '#situation-room'
      },
      leftStat: {
        value: heroOverride?.leftStatValue ?? base?.leftStat?.value,
        label: heroOverride?.leftStatLabel ?? base?.leftStat?.label
      },
      rightStat: {
        value: heroOverride?.rightStatValue ?? base?.rightStat?.value,
        label: heroOverride?.rightStatLabel ?? base?.rightStat?.label
      },
      image: gallery?.[0] ?? DEFAULT_HERO_IMAGE,
      images: gallery
    };
  }, [cmsContent, localizedContent, language]);

  const [alerts, setAlerts] = useState(localizedContent?.alerts?.items ?? []);

  useEffect(() => {
    setAlerts(localizedContent?.alerts?.items ?? []);
  }, [localizedContent?.alerts?.items]);

  const handleEmergencySubmit = async (payload, files = []) => {
    await submitEmergencyIncident(payload, files);
  };

  const handleNonEmergencySubmit = async (payload, files = []) => {
    await submitNonEmergencyRequest(payload, files);
  };

  const handleEnvironmentalSubmit = async (payload, files = []) => {
    await submitEnvironmentalIncident(payload, files);
  };

  return (
    <StitchWrapper>
      <Helmet>
        <title>{localizedContent?.meta?.title}</title>
        <meta name="description" content={localizedContent?.meta?.description} />
        {localizedContent?.meta?.keywords && (
          <meta name="keywords" content={localizedContent?.meta?.keywords} />
        )}
      </Helmet>

      <main className="relative z-10 space-y-24 pb-24">
        {/* HERO SECTION */}
        <section className="relative pt-32 lg:pt-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-12 lg:gap-20 items-center">
              <div className="space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in hidden lg:block invisible w-0 h-0 overflow-hidden">
                {/* Text overlay hidden as per user request to show full images */}
              </div>

              <div className="relative animate-in slide-in-from-right-10 duration-1000 fade-in">
                <div className="absolute -inset-4 bg-cyan-500/20 rounded-[2rem] blur-2xl opacity-50" />
                <HeroCarousel images={hero?.images} title={hero?.title} />
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6" id="quick-actions">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-headline font-bold text-white mb-4">
              Rapid Response Command
            </h2>
            <p className="text-gray-400 max-w-2xl text-lg">
              Dispatch immediate assistance or log incidents directly to the National Operations Centre.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localizedContent?.quickActions?.map((action) => (
              <QuickActionCard key={action?.id} action={action} />
            ))}
          </div>
        </section>

        {/* INTELLIGENT REPORTING HUB */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6" id="reporting-hub">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0d1f3d]">
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent" />

            <div className="relative p-8 lg:p-12">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20 mb-4">
                  <Icon name="RadioReceiver" size={14} className="animate-pulse" />
                  Live Incident Channel
                </div>
                <h2 className="text-3xl lg:text-5xl font-headline font-bold text-white mb-6">
                  Intelligent Reporting Hub
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Select the type of incident below to access the appropriate secure channel. All reports are encrypted and routed to the nearest command center immediately.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <IntelligentReportingHub
                  localizedContent={localizedContent}
                  language={language}
                  handlers={{
                    emergency: handleEmergencySubmit,
                    nonEmergency: handleNonEmergencySubmit,
                    environmental: handleEnvironmentalSubmit
                  }}
                />
              </div>

              {/* Quick Contacts Footer */}
              <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Coast Guard</div>
                  <div className="text-2xl font-mono font-bold text-white">117</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Police Emergency</div>
                  <div className="text-2xl font-mono font-bold text-white">119</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Disaster Mgmt</div>
                  <div className="text-2xl font-mono font-bold text-white">117</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ALERTS & STATUS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6" id="live-updates">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-bold text-white flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Alert Feed
                </h2>
                <Button asChild variant="ghost" size="sm" iconName="History" className="text-gray-400 hover:text-white">
                  <a href="#alerts-archive">{localizedContent?.alerts?.viewArchiveLabel}</a>
                </Button>
              </div>
              <div className="space-y-4">
                {alerts?.map((alert) => (
                  <AlertCard
                    key={alert?.id}
                    alert={alert}
                    onViewDetails={(selected) => window?.alert(`${selected?.title}\n\n${selected?.description}`)}
                    onDismiss={(id) => setAlerts((prev) => prev?.filter((item) => item?.id !== id))}
                  />
                ))}
                {alerts?.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/20 rounded-2xl bg-white/5 text-gray-400">
                    <Icon name="CheckCircle" size={32} className="text-emerald-500 mb-2" />
                    <p>All clear. No active alerts at this time.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-headline font-bold text-white">System Status</h2>
              <SystemStatusIndicator systems={localizedContent?.systemStatus?.systems ?? []} />
            </div>
          </div>
        </section>

        {/* CONTACTS GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6" id="contacts">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-headline font-bold text-white mb-2">Emergency Directory</h2>
            <p className="text-gray-400">Direct lines to specialized response units.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localizedContent?.contacts?.items?.map((contact) => (
              <EmergencyContactCard key={contact?.name} contact={contact} />
            ))}
          </div>
        </section>

        {/* PREPAREDNESS RESOURCES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6" id="preparedness">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-headline font-bold text-white mb-2">{localizedContent?.preparedness?.title}</h2>
              <p className="text-gray-400 max-w-2xl">{localizedContent?.preparedness?.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localizedContent?.preparedness?.items?.map((item) => (
              <PreparednessResourceCard key={item?.title} resource={item} />
            ))}
          </div>
        </section>

        {/* EVACUATION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-white/10 bg-black/20 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Icon name="Map" size={20} className="text-cyan-400" />
                Evacuation Zones
              </h2>
              <span className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/30">
                LIVE DATA
              </span>
            </div>
            <EvacuationMap />
          </div>
        </section>

        {/* SITUATION ROOM CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden p-8 lg:p-16 text-center border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-cyan-900/40" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <Icon name="Cpu" size={48} className="mx-auto text-cyan-400" />
              <h2 className="text-3xl lg:text-5xl font-bold text-white font-headline">
                National Command Centre
              </h2>
              <p className="text-xl text-gray-300">
                Authorized personnel access for strategic monitoring and resource deployment.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {localizedContent?.situationRoom?.actions?.map((action) => (
                  <Button asChild key={action?.label} size="lg" variant="outline" iconName={action?.icon} className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    <a href={action?.href}>{action?.label}</a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </StitchWrapper>
  );
};

export default EmergencyResponseNetwork;
