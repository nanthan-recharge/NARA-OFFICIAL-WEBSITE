import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Satellite,
  Settings,
  Shield,
  Users,
  Zap,
  UserPlus,
  Upload,
  Eye,
  Key,
  Bell,
  Download,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GovernmentDatabaseSection from './components/GovernmentDatabaseSection';
import InternationalResearchSection from './components/InternationalResearchSection';
import SatelliteDataSection from './components/SatelliteDataSection';
import APIManagementSection from './components/APIManagementSection';
import usePageContent from '../../hooks/usePageContent';
import useIntegrationDashboard from '../../hooks/useIntegrationDashboard';
import IntegrationHero from './components/IntegrationHero';

const IntegrationSystemsPlatform = () => {
  const { t } = useTranslation('integration');
  const [activeTab, setActiveTab] = useState('government');
  const {
    entries,
    summary,
    alerts,
    lastUpdated,
    isLoading,
    error,
    refresh
  } = useIntegrationDashboard();

  const heroFallback = useMemo(
    () => ({
      hero: t('hero.cmsFallback', { returnObjects: true })
    }),
    [t]
  );

  const { heroContent } = usePageContent('integration-systems-platform', {
    fallbackContent: heroFallback
  });

  const tabTranslations = t('tabs', { returnObjects: true });
  const tabIconMap = useMemo(
    () => ({
      government: Database,
      research: Globe,
      satellite: Satellite,
      api: Settings
    }),
    []
  );

  const tabs = useMemo(
    () =>
      ['government', 'research', 'satellite', 'api'].map((key) => ({
        id: key,
        icon: tabIconMap[key],
        label: tabTranslations?.[key]?.label || '',
        description: tabTranslations?.[key]?.description || ''
      })),
    [tabIconMap, tabTranslations]
  );

  const guidelines = t('guidelines', { returnObjects: true });
  const monitorTitle = t('monitor.heading');
  const monitorEmpty = t('monitor.empty');

  const renderStatusBadge = (statusRaw) => {
    const status = (statusRaw || '').toLowerCase();
    const label = t(`common.statuses.${status}`, { defaultValue: statusRaw || '—' });
    const appearance = {
      active: { Icon: CheckCircle, className: 'text-green-500' },
      maintenance: { Icon: Clock, className: 'text-yellow-500' },
      error: { Icon: AlertCircle, className: 'text-red-500' },
      default: { Icon: Activity, className: 'text-gray-500' }
    };
    const { Icon, className } = appearance[status] || appearance.default;

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-1 text-xs font-semibold text-slate-700">
        <Icon className={`h-4 w-4 ${className}`} />
        {label}
      </span>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'government':
        return <GovernmentDatabaseSection />;
      case 'research':
        return <InternationalResearchSection />;
      case 'satellite':
        return <SatelliteDataSection />;
      case 'api':
        return <APIManagementSection />;
      default:
        return <GovernmentDatabaseSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <IntegrationHero
        heroContent={heroContent?.hero}
        summary={summary}
        alerts={alerts}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t('monitor.error')}
          </div>
        )}

        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <nav className="flex flex-wrap gap-x-6" aria-label={t('tabs.ariaLabel')}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-1 min-w-[200px] items-center gap-3 border-b-2 px-6 py-4 text-left transition ${
                    isActive
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                  type="button"
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-semibold">{tab.label}</div>
                    <p className="text-xs text-slate-500">{tab.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Activity className="h-5 w-5 text-cyan-600" />
              {monitorTitle}
            </h3>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              {monitorEmpty}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {entries.slice(0, 6).map((item) => (
                <div
                  key={item?.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item?.name}</p>
                    <p className="text-xs text-slate-500">{item?.system}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(item?.status)}
                    <span className="text-sm font-semibold text-slate-700">
                      {t('monitor.healthLabel', { value: item?.health_score ?? 0 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white shadow-sm">{renderTabContent()}</div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-blue-50 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-900">
              <Shield className="h-5 w-5" />
              {guidelines?.security?.title}
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              {(guidelines?.security?.items || []).map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-emerald-900">
              <Users className="h-5 w-5" />
              {guidelines?.collaboration?.title}
            </h3>
            <ul className="space-y-2 text-sm text-emerald-800">
              {(guidelines?.collaboration?.items || []).map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSystemsPlatform;
