import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock3,
  Fish,
  FlaskConical,
  GraduationCap,
  Map,
  Phone,
  ShieldCheck,
  Ship,
  TrendingUp,
  Waves,
} from 'lucide-react';
import MultilingualContent from '../../components/compliance/MultilingualContent';

const ESSENTIAL_SERVICES = [
  {
    icon: Fish,
    route: '/fish-advisory-system',
    titleKey: 'generalPublic.compact.essentialServices.items.fishAdvisory.title',
    descriptionKey: 'generalPublic.compact.essentialServices.items.fishAdvisory.description',
    badgeKey: 'generalPublic.compact.essentialServices.items.fishAdvisory.badge'
  },
  {
    icon: FlaskConical,
    route: '/lab-results',
    titleKey: 'generalPublic.compact.essentialServices.items.laboratoryTesting.title',
    descriptionKey: 'generalPublic.compact.essentialServices.items.laboratoryTesting.description',
    badgeKey: 'generalPublic.compact.essentialServices.items.laboratoryTesting.badge'
  },
  {
    icon: Waves,
    route: '/marine-forecast',
    titleKey: 'generalPublic.compact.essentialServices.items.marineForecast.title',
    descriptionKey: 'generalPublic.compact.essentialServices.items.marineForecast.description',
    badgeKey: 'generalPublic.compact.essentialServices.items.marineForecast.badge'
  },
  {
    icon: AlertTriangle,
    route: '/emergency-response-network',
    titleKey: 'generalPublic.compact.essentialServices.items.emergencyReporting.title',
    descriptionKey: 'generalPublic.compact.essentialServices.items.emergencyReporting.description',
    badgeKey: 'generalPublic.compact.essentialServices.items.emergencyReporting.badge'
  },
];

const ACTIVE_ADVISORIES = [
  {
    id: 'adv-01',
    key: 'monsoonConditions',
    severity: 'high'
  },
  {
    id: 'adv-02',
    key: 'fishSafetyBulletin',
    severity: 'low'
  },
  {
    id: 'adv-03',
    key: 'laboratoryIntakeNotice',
    severity: 'medium'
  },
];

const COMMUNITY_PROGRAMS = [
  {
    icon: GraduationCap,
    route: '/learning-development-academy',
    titleKey: 'generalPublic.compact.communitySupport.items.fisherTraining.title',
    descriptionKey: 'generalPublic.compact.communitySupport.items.fisherTraining.description'
  },
  {
    icon: Briefcase,
    route: '/procurement-recruitment-portal',
    titleKey: 'generalPublic.compact.communitySupport.items.publicRecruitment.title',
    descriptionKey: 'generalPublic.compact.communitySupport.items.publicRecruitment.description'
  },
  {
    icon: BookOpen,
    route: '/knowledge-discovery-center',
    titleKey: 'generalPublic.compact.communitySupport.items.knowledgeGuidance.title',
    descriptionKey: 'generalPublic.compact.communitySupport.items.knowledgeGuidance.description'
  },
];

const DATA_TOOLS = [
  {
    icon: Map,
    route: '/marine-spatial-planning-viewer',
    titleKey: 'generalPublic.compact.dataTools.items.fishingZoneMap.title',
    valueKey: 'generalPublic.compact.dataTools.items.fishingZoneMap.value'
  },
  {
    icon: TrendingUp,
    route: '/export-market-intelligence',
    titleKey: 'generalPublic.compact.dataTools.items.marketPriceInsights.title',
    valueKey: 'generalPublic.compact.dataTools.items.marketPriceInsights.value'
  },
  {
    icon: Calendar,
    route: '/knowledge-discovery-center',
    titleKey: 'generalPublic.compact.dataTools.items.seasonalFishingCalendar.title',
    valueKey: 'generalPublic.compact.dataTools.items.seasonalFishingCalendar.value'
  },
];

const EMERGENCY_CONTACTS = [
  {
    icon: Phone,
    tel: '1919',
    labelKey: 'generalPublic.compact.emergency.contacts.hotline.label',
    valueKey: 'generalPublic.compact.emergency.contacts.hotline.value'
  },
  {
    icon: Ship,
    tel: '+94112440635',
    labelKey: 'generalPublic.compact.emergency.contacts.coastGuard.label',
    valueKey: 'generalPublic.compact.emergency.contacts.coastGuard.value'
  },
  {
    icon: AlertTriangle,
    tel: '+94112522000',
    labelKey: 'generalPublic.compact.emergency.contacts.marineDesk.label',
    valueKey: 'generalPublic.compact.emergency.contacts.marineDesk.value'
  },
];

const severityStyles = {
  high: 'border-red-300 bg-red-50 text-red-800',
  medium: 'border-amber-300 bg-amber-50 text-amber-800',
  low: 'border-blue-300 bg-blue-50 text-blue-800',
};

const GeneralPublicPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('audiences');
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const language = useMemo(() => (i18n.language || 'en').split('-')[0], [i18n.language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  return (
    <MultilingualContent language={language}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100">
        <section className="bg-gradient-to-r from-nara-navy via-[#00508f] to-nara-blue pt-24 pb-10 md:pt-28 md:pb-12 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t('generalPublic.compact.hero.badge')}
              </p>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
                {t('generalPublic.compact.hero.title')}
              </h1>
              <p className="mt-3 text-blue-100 text-base md:text-lg">
                {t('generalPublic.compact.hero.description')}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                <p className="text-xs text-blue-100">{t('generalPublic.compact.hero.chips.fishSafetyLabel')}</p>
                <p className="font-semibold mt-0.5">{t('generalPublic.compact.hero.chips.fishSafetyValue')}</p>
              </div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                <p className="text-xs text-blue-100">{t('generalPublic.compact.hero.chips.seaConditionLabel')}</p>
                <p className="font-semibold mt-0.5">{t('generalPublic.compact.hero.chips.seaConditionValue')}</p>
              </div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                <p className="text-xs text-blue-100">{t('generalPublic.compact.hero.chips.lastUpdatedLabel')}</p>
                <p className="font-semibold mt-0.5 inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
          <section>
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">{t('generalPublic.compact.essentialServices.title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {ESSENTIAL_SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.titleKey}
                    onClick={() => navigate(service.route)}
                    className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{t(service.badgeKey)}</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-slate-900">{t(service.titleKey)}</h3>
                    <p className="mt-1 text-sm text-slate-700">{t(service.descriptionKey)}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                      {t('generalPublic.compact.essentialServices.openService')} <ChevronRight className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900 inline-flex items-center gap-2">
                <Bell className="h-6 w-6 text-amber-500" />
                {t('generalPublic.compact.advisories.title')}
              </h2>
              <button
                onClick={() => navigate('/fish-advisory-system')}
                className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                {t('generalPublic.compact.advisories.viewAll')}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ACTIVE_ADVISORIES.map((item) => (
                <article key={item.id} className={`rounded-xl border p-4 ${severityStyles[item.severity] || severityStyles.low}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug">{t(`generalPublic.compact.advisories.items.${item.key}.title`)}</h3>
                    <span className="text-xs font-medium whitespace-nowrap">{t(`generalPublic.compact.advisories.items.${item.key}.updated`)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">{t(`generalPublic.compact.advisories.items.${item.key}.message`)}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">{t('generalPublic.compact.communitySupport.title')}</h2>
              <div className="mt-4 space-y-3">
                {COMMUNITY_PROGRAMS.map((program) => {
                  const Icon = program.icon;
                  return (
                    <button
                      key={program.titleKey}
                      onClick={() => navigate(program.route)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-blue-50 hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg bg-blue-600 p-2 text-white">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{t(program.titleKey)}</h3>
                          <p className="mt-1 text-sm text-slate-700">{t(program.descriptionKey)}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">{t('generalPublic.compact.dataTools.title')}</h2>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {DATA_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.titleKey}
                      onClick={() => navigate(tool.route)}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-blue-50 hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-cyan-600 p-2 text-white">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{t(tool.titleKey)}</p>
                          <p className="text-xs text-slate-600">{t(tool.valueKey)}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t('generalPublic.compact.emergency.title')}</h2>
                <p className="mt-2 text-sm text-slate-700">
                  {t('generalPublic.compact.emergency.description')}
                </p>
                <button
                  onClick={() => navigate('/emergency-response-network')}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <AlertTriangle className="h-4 w-4" />
                  {t('generalPublic.compact.emergency.button')}
                </button>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EMERGENCY_CONTACTS.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={contact.labelKey}
                      href={`tel:${contact.tel}`}
                      className="rounded-xl border border-red-200 bg-white p-3 transition-colors hover:border-red-300 hover:bg-red-50"
                    >
                      <div className="flex items-center gap-2 text-red-700">
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">{t(contact.labelKey)}</span>
                      </div>
                      <p className="mt-2 text-lg font-bold text-slate-900">{t(contact.valueKey)}</p>
                    </a>
                  );
                })}
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              {t('generalPublic.compact.emergency.hotlineNote')}
            </p>
          </section>
        </main>
      </div>
    </MultilingualContent>
  );
};

export default GeneralPublicPage;
