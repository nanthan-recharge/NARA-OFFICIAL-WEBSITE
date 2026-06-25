import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Icon from './AppIcon';

const iconAliases = {
  alert: 'TriangleAlert',
  cloud: 'CloudSun',
  database: 'Database',
  dollar: 'BadgeDollarSign',
  file: 'FileText',
  flask: 'FlaskConical',
  graduation: 'GraduationCap',
  info: 'LifeBuoy',
  microscope: 'Microscope',
  shopping: 'ShoppingBag',
  trending: 'TrendingUp',
  waves: 'Waves',
};

const tabIcons = {
  portals: 'Landmark',
  services: 'ListChecks',
  tools: 'Wrench',
};

const portalTones = [
  { '--accent': '#003366', '--accent-soft': 'rgba(0, 51, 102, 0.08)' },
  { '--accent': '#0066cc', '--accent-soft': 'rgba(0, 102, 204, 0.1)' },
  { '--accent': '#0f766e', '--accent-soft': 'rgba(15, 118, 110, 0.1)' },
];

const serviceTones = ['#0066cc', '#0f766e', '#b45309', '#7c3aed', '#dc2626', '#2563eb'];
const tabOrder = ['portals', 'services', 'tools'];
const portalLinks = ['/research-excellence-portal', '/government-services-portal', '/nara-digital-marketplace'];

const resolveIcon = (name) => iconAliases[name] || name || 'CircleDot';

const getServiceBadge = (service) =>
  service?.turnaround ||
  service?.availability ||
  service?.access ||
  service?.programs ||
  service?.response ||
  service?.updated;

const UnifiedServicesHub = () => {
  const { t } = useTranslation('home');
  const [activeTab, setActiveTab] = useState('portals');
  const content = t('unifiedHub', { returnObjects: true });
  const openLabel = content?.ui?.open || 'Open';

  const renderServiceRows = (limit) => {
    const services = limit ? content?.services?.slice(0, limit) : content?.services;

    return (
      <div className="nara-compact-service-grid">
        {services?.map((service, idx) => {
          const badgeValue = getServiceBadge(service);
          const accent = serviceTones[idx % serviceTones.length];

          return (
            <Link
              key={`${service.title}-${idx}`}
              to={service.link}
              className="nara-service-link"
              aria-label={`${service.title}: ${service.description}`}
            >
              <div className="nara-compact-service-row" style={{ '--accent': accent, '--accent-soft': `${accent}14` }}>
                <span className="nara-row-icon">
                  <Icon name={resolveIcon(service.icon)} size={17} />
                </span>
                <span className="nara-row-copy">
                  <strong>{service.title}</strong>
                  <span>{service.description}</span>
                </span>
                {badgeValue && <span className="nara-row-badge">{badgeValue}</span>}
                <Icon name="ChevronRight" size={16} className="nara-row-arrow" />
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <section className="nara-services-gateway" aria-labelledby="nara-services-heading">
      <style>
        {`
          .nara-services-gateway {
            --nara-navy: #003366;
            --nara-blue: #0066cc;
            --nara-ink: #0f172a;
            --nara-muted: #475569;
            --nara-border: rgba(15, 23, 42, 0.12);
            position: relative;
            overflow: hidden;
            scroll-margin-top: 104px;
            color: var(--nara-ink);
            background:
              linear-gradient(180deg, rgba(247, 251, 255, 0.98), #ffffff 40%, rgba(241, 247, 252, 0.96));
          }

          .nara-services-gateway::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(0, 51, 102, 0.045) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 51, 102, 0.045) 1px, transparent 1px);
            background-size: 36px 36px;
            mask-image: linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent);
          }

          .nara-services-shell {
            position: relative;
            z-index: 1;
            width: min(1180px, calc(100% - 32px));
            margin: 0 auto;
            padding: 18px 0 22px;
          }

          .nara-services-gateway h2,
          .nara-services-gateway h3,
          .nara-services-gateway h4,
          .nara-services-gateway p {
            margin: 0;
            letter-spacing: 0;
          }

          .nara-services-header {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(280px, 410px);
            align-items: end;
            gap: 22px;
            margin-bottom: 16px;
          }

          .nara-services-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            width: fit-content;
            min-height: 28px;
            padding: 5px 9px;
            border: 1px solid rgba(0, 102, 204, 0.2);
            border-radius: 999px;
            background: #ffffff;
            color: var(--nara-blue);
            font-size: 11px;
            font-weight: 850;
            line-height: 1.1;
            text-transform: uppercase;
          }

          .nara-services-title {
            max-width: 720px;
            margin-top: 9px !important;
            color: var(--nara-navy);
            font-size: clamp(28px, 3.2vw, 40px);
            font-weight: 900;
            line-height: 1.06;
          }

          .nara-services-subtitle {
            max-width: 760px;
            margin-top: 8px !important;
            color: var(--nara-muted);
            font-size: 15px;
            line-height: 1.55;
          }

          .nara-service-stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            min-height: 76px;
            border: 1px solid rgba(0, 51, 102, 0.14);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07);
            overflow: hidden;
          }

          .nara-service-stat {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            align-items: center;
            gap: 10px;
            min-width: 0;
            padding: 12px 13px;
            border-right: 1px solid rgba(0, 51, 102, 0.1);
          }

          .nara-service-stat:last-child {
            border-right: 0;
          }

          .nara-service-stat svg {
            color: var(--nara-blue);
          }

          .nara-service-stat strong {
            display: block;
            color: var(--nara-navy);
            font-size: 23px;
            line-height: 1;
          }

          .nara-stat-copy {
            min-width: 0;
          }

          .nara-stat-copy span {
            display: block;
            margin-top: 4px;
            color: #64748b;
            font-size: 10px;
            font-weight: 850;
            line-height: 1.18;
            text-transform: uppercase;
          }

          .nara-services-tabs-wrap {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 14px;
            border-bottom: 2px solid var(--nara-navy);
          }

          .nara-services-tabs {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            width: min(650px, 100%);
            border: 1px solid rgba(0, 51, 102, 0.16);
            border-bottom: 0;
            border-radius: 8px 8px 0 0;
            background: #ffffff;
            overflow: hidden;
          }

          .nara-services-tab {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            min-width: 0;
            min-height: 46px;
            padding: 9px 12px;
            border: 0;
            border-right: 1px solid rgba(0, 51, 102, 0.12);
            background: #ffffff;
            color: #1f2937;
            font-size: 13px;
            font-weight: 850;
            line-height: 1.1;
            cursor: pointer;
            transition: background 160ms ease, color 160ms ease;
          }

          .nara-services-tab:last-child {
            border-right: 0;
          }

          .nara-services-tab.is-active {
            background: var(--nara-navy);
            color: #ffffff;
          }

          .nara-services-tab:focus-visible,
          .nara-service-link:focus-visible {
            outline: 3px solid rgba(0, 102, 204, 0.28);
            outline-offset: 3px;
          }

          .nara-services-gateway a.nara-service-link {
            display: block;
            min-width: 0;
            min-height: 0;
            padding: 0;
            color: inherit;
            text-decoration: none;
          }

          .nara-services-panel {
            min-height: 0;
          }

          .nara-portal-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .nara-portal-card {
            --accent: var(--nara-blue);
            --accent-soft: rgba(0, 102, 204, 0.1);
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 238px;
            padding: 20px;
            border: 1px solid var(--nara-border);
            border-top: 4px solid var(--accent);
            border-radius: 8px;
            background: #ffffff;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07);
            transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
          }

          .nara-portal-card:hover {
            transform: translateY(-2px);
            border-color: color-mix(in srgb, var(--accent) 40%, var(--nara-border));
            box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
          }

          .nara-portal-head {
            display: grid;
            grid-template-columns: 48px minmax(0, 1fr);
            gap: 14px;
            align-items: start;
          }

          .nara-portal-icon,
          .nara-row-icon,
          .nara-tool-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            border-radius: 8px;
            color: var(--accent);
            background: var(--accent-soft);
          }

          .nara-portal-icon {
            width: 48px;
            height: 48px;
          }

          .nara-portal-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            min-width: 0;
          }

          .nara-portal-kicker {
            color: var(--accent);
            font-size: 10px;
            font-weight: 850;
            line-height: 1;
            text-transform: uppercase;
          }

          .nara-portal-title {
            margin-top: 8px !important;
            color: var(--nara-navy);
            font-size: 20px;
            font-weight: 900;
            line-height: 1.14;
          }

          .nara-portal-description {
            margin-top: 9px !important;
            color: var(--nara-muted);
            font-size: 13px;
            line-height: 1.55;
          }

          .nara-portal-metrics {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            margin-top: 14px;
          }

          .nara-portal-metric {
            min-height: 52px;
            padding: 9px 10px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 8px;
            background: #f8fafc;
          }

          .nara-portal-metric strong {
            display: block;
            color: var(--nara-navy);
            font-size: 18px;
            line-height: 1;
          }

          .nara-portal-metric span {
            display: block;
            margin-top: 5px;
            color: #64748b;
            font-size: 10px;
            font-weight: 800;
            line-height: 1.2;
            text-transform: uppercase;
          }

          .nara-portal-features {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin: 12px 0 0;
            padding: 0;
            list-style: none;
          }

          .nara-portal-features li {
            min-height: 25px;
            padding: 5px 8px;
            border-radius: 999px;
            background: rgba(0, 51, 102, 0.06);
            color: #334155;
            font-size: 11px;
            font-weight: 750;
            line-height: 1.2;
          }

          .nara-card-cta {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            min-height: 32px;
            margin-top: auto;
            padding-top: 14px;
            color: var(--accent);
            font-size: 12px;
            font-weight: 850;
          }

          .nara-services-preview {
            margin-top: 16px;
          }

          .nara-preview-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
          }

          .nara-preview-head h3 {
            color: var(--nara-navy);
            font-size: 17px;
            font-weight: 900;
            line-height: 1.2;
          }

          .nara-preview-count {
            display: inline-flex;
            align-items: center;
            min-height: 24px;
            padding: 4px 8px;
            border-radius: 999px;
            background: #eaf3ff;
            color: var(--nara-navy);
            font-size: 11px;
            font-weight: 850;
          }

          .nara-compact-service-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px 14px;
          }

          .nara-compact-service-row {
            --accent: var(--nara-blue);
            --accent-soft: rgba(0, 102, 204, 0.08);
            display: grid;
            grid-template-columns: 38px minmax(0, 1fr) auto 16px;
            align-items: center;
            gap: 10px;
            min-height: 58px;
            padding: 9px 10px;
            border: 1px solid rgba(15, 23, 42, 0.1);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.94);
            box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
            transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
          }

          .nara-compact-service-row:hover {
            transform: translateY(-1px);
            border-color: color-mix(in srgb, var(--accent) 35%, rgba(15, 23, 42, 0.1));
            box-shadow: 0 10px 22px rgba(15, 23, 42, 0.07);
          }

          .nara-row-icon {
            width: 36px;
            height: 36px;
          }

          .nara-row-copy {
            min-width: 0;
          }

          .nara-row-copy strong {
            display: block;
            overflow: hidden;
            color: var(--nara-navy);
            font-size: 13px;
            font-weight: 850;
            line-height: 1.2;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .nara-row-copy span {
            display: block;
            overflow: hidden;
            margin-top: 3px;
            color: #64748b;
            font-size: 11px;
            line-height: 1.25;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .nara-row-badge {
            color: var(--accent);
            font-size: 11px;
            font-weight: 850;
            line-height: 1.2;
            white-space: nowrap;
          }

          .nara-row-arrow {
            color: #64748b;
          }

          .nara-tool-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .nara-tool-card {
            --accent: var(--nara-blue);
            --accent-soft: rgba(0, 102, 204, 0.1);
            display: grid;
            grid-template-columns: 44px minmax(0, 1fr) auto;
            align-items: center;
            gap: 12px;
            min-height: 86px;
            padding: 14px;
            border: 1px solid var(--nara-border);
            border-radius: 8px;
            background: #ffffff;
            box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
            transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
          }

          .nara-tool-card:hover {
            transform: translateY(-1px);
            border-color: color-mix(in srgb, var(--accent) 35%, var(--nara-border));
            box-shadow: 0 14px 30px rgba(15, 23, 42, 0.09);
          }

          .nara-tool-icon {
            width: 42px;
            height: 42px;
          }

          .nara-tool-title {
            color: var(--nara-navy);
            font-size: 15px;
            font-weight: 900;
            line-height: 1.2;
          }

          .nara-tool-cta {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--accent);
            font-size: 11px;
            font-weight: 850;
          }

          @media (max-width: 1080px) {
            .nara-services-header {
              grid-template-columns: 1fr;
              align-items: start;
              gap: 14px;
            }

            .nara-service-stats {
              max-width: 560px;
            }

            .nara-portal-grid,
            .nara-compact-service-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .nara-tool-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 720px) {
            .nara-services-shell {
              width: min(100% - 24px, 1180px);
              padding: 16px 0 18px;
            }

            .nara-services-header {
              margin-bottom: 12px;
            }

            .nara-services-title {
              font-size: 26px;
              line-height: 1.08;
            }

            .nara-services-subtitle {
              font-size: 13px;
              line-height: 1.48;
            }

            .nara-service-stats {
              max-width: none;
              min-height: 66px;
            }

            .nara-service-stat {
              grid-template-columns: 1fr;
              gap: 5px;
              padding: 10px 9px;
            }

            .nara-service-stat svg {
              display: none;
            }

            .nara-service-stat strong {
              font-size: 21px;
            }

            .nara-service-stat span {
              font-size: 9px;
              overflow-wrap: anywhere;
            }

            .nara-services-tabs-wrap {
              display: block;
              margin-bottom: 12px;
              padding-right: 70px;
            }

            .nara-services-tabs {
              width: 100%;
            }

            .nara-services-tab {
              flex-direction: column;
              gap: 4px;
              min-height: 54px;
              padding: 7px 5px;
              font-size: 10px;
              line-height: 1.12;
              white-space: normal;
            }

            .nara-portal-grid,
            .nara-compact-service-grid,
            .nara-tool-grid {
              grid-template-columns: 1fr;
            }

            .nara-portal-card {
              min-height: 0;
              padding: 13px;
            }

            .nara-portal-head {
              grid-template-columns: 40px minmax(0, 1fr);
              gap: 11px;
            }

            .nara-portal-icon {
              width: 36px;
              height: 36px;
            }

            .nara-portal-title {
              margin-top: 5px !important;
              font-size: 17px;
            }

            .nara-portal-description {
              display: -webkit-box;
              margin-top: 7px !important;
              overflow: hidden;
              font-size: 12px;
              line-height: 1.45;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }

            .nara-portal-metrics,
            .nara-portal-features {
              display: none;
            }

            .nara-card-cta {
              min-height: 27px;
              padding-top: 7px;
            }

            .nara-services-preview {
              margin-top: 13px;
            }

            .nara-compact-service-row {
              grid-template-columns: 36px minmax(0, 1fr) auto 14px;
              min-height: 56px;
            }

            .nara-row-badge {
              max-width: 86px;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .nara-tool-card {
              min-height: 76px;
            }
          }

          @media (max-width: 380px) {
            .nara-services-tabs-wrap {
              padding-right: 58px;
            }

            .nara-row-badge {
              display: none;
            }

            .nara-compact-service-row {
              grid-template-columns: 36px minmax(0, 1fr) 14px;
            }
          }
        `}
      </style>

      <div className="nara-services-shell">
        <div className="nara-services-header">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <span className="nara-services-badge">
              <Icon name="ShieldCheck" size={14} />
              {content?.badge}
            </span>
            <h2 id="nara-services-heading" className="nara-services-title">
              {content?.heading}
            </h2>
            <p className="nara-services-subtitle">{content?.subheading}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.04 }}
            className="nara-service-stats"
            aria-label={content?.badge}
          >
            <div className="nara-service-stat">
              <Icon name={tabIcons.portals} size={20} />
              <div className="nara-stat-copy">
                <strong>{content?.portals?.length || 0}</strong>
                <span>{content?.tabs?.portals}</span>
              </div>
            </div>
            <div className="nara-service-stat">
              <Icon name={tabIcons.services} size={20} />
              <div className="nara-stat-copy">
                <strong>{content?.services?.length || 0}</strong>
                <span>{content?.tabs?.services}</span>
              </div>
            </div>
            <div className="nara-service-stat">
              <Icon name={tabIcons.tools} size={20} />
              <div className="nara-stat-copy">
                <strong>{content?.quickTools?.length || 0}</strong>
                <span>{content?.tabs?.tools}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="nara-services-tabs-wrap">
          <div className="nara-services-tabs" role="tablist" aria-label={content?.heading}>
            {tabOrder.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`nara-services-panel-${tab}`}
                  id={`nara-services-tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`nara-services-tab${isActive ? ' is-active' : ''}`}
                >
                  <Icon name={tabIcons[tab]} size={16} />
                  {content?.tabs?.[tab]}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          key={activeTab}
          id={`nara-services-panel-${activeTab}`}
          className="nara-services-panel"
          role="tabpanel"
          aria-labelledby={`nara-services-tab-${activeTab}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {activeTab === 'portals' && (
            <>
              <div className="nara-portal-grid">
                {content?.portals?.map((portal, idx) => (
                  <Link
                    key={`${portal.title}-${idx}`}
                    to={portalLinks[idx]}
                    className="nara-service-link"
                    aria-label={`${portal.cta}: ${portal.title}`}
                  >
                    <article className="nara-portal-card" style={portalTones[idx % portalTones.length]}>
                      <div className="nara-portal-head">
                        <span className="nara-portal-icon">
                          <Icon name={resolveIcon(portal.icon)} size={23} />
                        </span>
                        <div>
                          <div className="nara-portal-title-row">
                            <span className="nara-portal-kicker">{portal.subtitle}</span>
                            <Icon name="ArrowUpRight" size={15} />
                          </div>
                          <h3 className="nara-portal-title">{portal.title}</h3>
                        </div>
                      </div>

                      <p className="nara-portal-description">{portal.description}</p>

                      <div className="nara-portal-metrics">
                        {portal.metrics?.slice(0, 2)?.map((metric) => (
                          <div key={metric.label} className="nara-portal-metric">
                            <strong>{metric.value}</strong>
                            <span>{metric.label}</span>
                          </div>
                        ))}
                      </div>

                      <ul className="nara-portal-features" aria-label={portal.title}>
                        {portal.features?.slice(0, 3)?.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>

                      <span className="nara-card-cta">
                        {portal.cta}
                        <Icon name="ArrowRight" size={15} />
                      </span>
                    </article>
                  </Link>
                ))}
              </div>

              <div className="nara-services-preview">
                <div className="nara-preview-head">
                  <h3>{content?.tabs?.services}</h3>
                  <span className="nara-preview-count">{content?.services?.length || 0} {content?.tabs?.services}</span>
                </div>
                {renderServiceRows(6)}
              </div>
            </>
          )}

          {activeTab === 'services' && renderServiceRows()}

          {activeTab === 'tools' && (
            <div className="nara-tool-grid">
              {content?.quickTools?.map((tool, idx) => {
                const accent = serviceTones[idx % serviceTones.length];

                return (
                  <Link key={`${tool.title}-${idx}`} to={tool.link} className="nara-service-link" aria-label={tool.title}>
                    <article className="nara-tool-card" style={{ '--accent': accent, '--accent-soft': `${accent}14` }}>
                      <span className="nara-tool-icon">
                        <Icon name={resolveIcon(tool.icon)} size={20} />
                      </span>
                      <h3 className="nara-tool-title">{tool.title}</h3>
                      <span className="nara-tool-cta">
                        {openLabel}
                        <Icon name="ArrowRight" size={14} />
                      </span>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default UnifiedServicesHub;
