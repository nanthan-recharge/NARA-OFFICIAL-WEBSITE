import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import RegionalMap from './components/RegionalMap';
import ImpactStories from './components/ImpactStories';
import CommunityEngagement from './components/CommunityEngagement';
import RegionalDashboard from './components/RegionalDashboard';
import usePageContent from '../../hooks/usePageContent';
import { REGIONAL_IMPACT_CONTENT } from './content';
import StitchWrapper from '../../components/shared/StitchWrapper';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop';

const RegionalImpactNetwork = () => {
  const { i18n } = useTranslation();
  const language = i18n?.language ?? 'en';
  const localizedContent = REGIONAL_IMPACT_CONTENT?.[language] ?? REGIONAL_IMPACT_CONTENT?.en;
  const { content: cmsContent } = usePageContent('regional-impact-network', {
    enabled: true
  });

  const heroOverride = cmsContent?.hero?.translations?.[language] ?? cmsContent?.hero?.translations?.en ?? cmsContent?.hero ?? {};

  const hero = useMemo(() => {
    const base = localizedContent?.hero ?? {};
    return {
      badge: heroOverride?.badge ?? base?.badge,
      subheading: heroOverride?.subheading ?? base?.subheading,
      title: heroOverride?.title ?? base?.title,
      highlight: heroOverride?.highlight ?? base?.highlight,
      description: heroOverride?.description ?? base?.description,
      primaryCta: {
        label: heroOverride?.primaryCtaLabel ?? base?.primaryCta?.label,
        icon: heroOverride?.primaryCtaIcon ?? base?.primaryCta?.icon ?? 'Map'
      },
      secondaryCta: {
        label: heroOverride?.secondaryCtaLabel ?? base?.secondaryCta?.label,
        icon: heroOverride?.secondaryCtaIcon ?? base?.secondaryCta?.icon ?? 'Heart'
      },
      leftStat: {
        value: heroOverride?.leftStatValue ?? base?.leftStat?.value,
        label: heroOverride?.leftStatLabel ?? base?.leftStat?.label
      },
      rightStat: {
        value: heroOverride?.rightStatValue ?? base?.rightStat?.value,
        label: heroOverride?.rightStatLabel ?? base?.rightStat?.label
      },
      image: heroOverride?.image ?? base?.image ?? DEFAULT_HERO_IMAGE
    };
  }, [heroOverride, localizedContent?.hero]);

  const navigationSections = localizedContent?.navigation ?? [];
  const overview = localizedContent?.overview ?? {};
  const mapData = localizedContent?.map;
  const storiesData = localizedContent?.stories;
  const dashboardData = localizedContent?.dashboard;
  const communityData = localizedContent?.community;
  const callToAction = localizedContent?.cta;
  const footer = localizedContent?.footer;

  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    setActiveSection('overview');
  }, [language]);

  return (
    <StitchWrapper>
      <div className="relative z-10">
        <Helmet>
          <title>{localizedContent?.meta?.title}</title>
          <meta name="description" content={localizedContent?.meta?.description} />
          {localizedContent?.meta?.keywords ? (
            <meta name="keywords" content={localizedContent?.meta?.keywords} />
          ) : null}
        </Helmet>
        <main>
          <section className="relative pt-20 lg:pt-32 pb-12 overflow-hidden text-white">
            <div className="relative max-w-7xl mx-auto px-4">
              {/* Content continues... */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="animate-depth-reveal">
                  {/* ... */}

                  {/* Reusing existing logic but stripping old background wrapper */}

                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-coral-warm rounded-lg flex items-center justify-center">
                      <Icon name="Globe" size={24} color="white" />
                    </div>
                    <div>
                      <div className="font-cta text-coral-warm text-sm uppercase tracking-wider">{hero?.badge}</div>
                      <div className="font-headline text-2xl font-bold text-white">{hero?.subheading}</div>
                    </div>
                  </div>

                  <h1 className="font-headline text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                    {hero?.title}
                    <span className="text-coral-warm"> {hero?.highlight}</span>
                  </h1>

                  <p className="font-body text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
                    {hero?.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="default"
                      size="lg"
                      className="bg-coral-warm hover:bg-coral-warm/90 text-white"
                      iconName={hero?.primaryCta?.icon}
                      iconPosition="left"
                      onClick={() => setActiveSection('map')}
                    >
                      {hero?.primaryCta?.label}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-ocean-deep"
                      iconName={hero?.secondaryCta?.icon}
                      iconPosition="left"
                      onClick={() => setActiveSection('stories')}
                    >
                      {hero?.secondaryCta?.label}
                    </Button>
                  </div>
                </div>

                <div className="relative animate-depth-reveal" style={{ animationDelay: '200ms' }}>
                  <div className="relative">
                    <Image
                      src={hero?.image}
                      alt="Sri Lankan coastal research network"
                      className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>

                    <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <Icon name="Users" size={20} color="white" />
                        </div>
                        <div>
                          <div className="font-headline text-lg font-bold text-text-primary">{hero?.leftStat?.value}</div>
                          <div className="font-body text-xs text-text-secondary">{hero?.leftStat?.label}</div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -top-6 -right-6 bg-coral-warm/95 backdrop-blur-sm rounded-xl p-4 shadow-xl text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Icon name="Shield" size={20} color="white" />
                        </div>
                        <div>
                          <div className="font-headline text-lg font-bold">{hero?.rightStat?.value}</div>
                          <div className="font-body text-xs opacity-90">{hero?.rightStat?.label}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div >
            </div >
          </section >

          <section className="bg-card border-b border-border sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex overflow-x-auto scrollbar-hide">
                {navigationSections?.map((section) => (
                  <button
                    key={section?.id}
                    onClick={() => setActiveSection(section?.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-cta-medium text-sm whitespace-nowrap border-b-2 transition-all duration-ocean ${activeSection === section?.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                      }`}
                  >
                    <Icon name={section?.icon} size={18} />
                    <span>{section?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 py-12">
            {activeSection === 'overview' && (
              <div className="space-y-12 animate-depth-reveal">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {overview?.stats?.map((stat, index) => (
                    <div key={index} className="bg-card rounded-lg p-6 text-center ocean-depth-shadow interactive-lift">
                      <div
                        className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${stat?.color === 'text-primary'
                          ? 'bg-primary/10'
                          : stat?.color === 'text-secondary'
                            ? 'bg-secondary/10'
                            : stat?.color === 'text-accent'
                              ? 'bg-accent/10'
                              : 'bg-success/10'
                          }`}
                      >
                        <Icon name={stat?.icon} size={24} className={stat?.color} />
                      </div>
                      <div className={`font-headline text-3xl font-bold mb-2 ${stat?.color}`}>{stat?.value}</div>
                      <div className="font-cta-medium text-text-primary mb-1">{stat?.label}</div>
                      <div className="font-body text-xs text-text-secondary">{stat?.description}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-card rounded-lg p-8 ocean-depth-shadow">
                  <h3 className="font-headline text-2xl font-bold text-text-primary mb-6 text-center">
                    {overview?.achievementsTitle}
                  </h3>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {overview?.achievements?.map((achievement, index) => (
                      <div key={index} className={`rounded-lg border p-6 ${achievement?.color}`}>
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <Icon name={achievement?.icon} size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-headline text-lg font-bold mb-2">{achievement?.title}</h4>
                            <p className="font-body text-sm mb-3 opacity-80">{achievement?.description}</p>
                            <div className="font-cta-medium text-sm font-bold">{achievement?.impact}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="font-headline text-2xl font-bold text-text-primary text-center">
                    {overview?.highlightsTitle}
                  </h3>
                  <div className="space-y-8">
                    {overview?.highlights?.map((highlight, index) => (
                      <div
                        key={index}
                        className={`bg-card rounded-lg overflow-hidden ocean-depth-shadow ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} lg:flex`}
                      >
                        <div className="lg:w-1/2">
                          <Image
                            src={highlight?.image}
                            alt={highlight?.center}
                            className="w-full h-64 lg:h-full object-cover"
                          />
                        </div>
                        <div className="lg:w-1/2 p-8">
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-cta-medium rounded-full">
                              {highlight?.region}
                            </span>
                          </div>
                          <h4 className="font-headline text-xl font-bold text-text-primary mb-3">{highlight?.center}</h4>
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center space-x-2">
                              <Icon name="Microscope" size={16} className="text-secondary" />
                              <span className="font-body text-sm text-text-secondary">
                                <strong>{overview?.highlightLabels?.specialization}:</strong> {highlight?.specialization}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Icon name="Beaker" size={16} className="text-accent" />
                              <span className="font-body text-sm text-text-secondary">
                                <strong>{overview?.highlightLabels?.keyProject}:</strong> {highlight?.keyProject}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Icon name="Heart" size={16} className="text-success" />
                              <span className="font-body text-sm text-text-secondary">
                                <strong>{overview?.highlightLabels?.communityImpact}:</strong> {highlight?.communityImpact}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="font-headline text-lg font-bold text-primary">{highlight?.stats?.staff}</div>
                              <div className="font-body text-xs text-text-secondary">{overview?.highlightLabels?.staff}</div>
                            </div>
                            <div className="text-center">
                              <div className="font-headline text-lg font-bold text-secondary">{highlight?.stats?.projects}</div>
                              <div className="font-body text-xs text-text-secondary">{overview?.highlightLabels?.projects}</div>
                            </div>
                            <div className="text-center">
                              <div className="font-headline text-lg font-bold text-accent">{highlight?.stats?.communities}</div>
                              <div className="font-body text-xs text-text-secondary">{overview?.highlightLabels?.communities}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'map' && <RegionalMap data={mapData} />}
            {activeSection === 'stories' && <ImpactStories data={storiesData} />}
            {activeSection === 'dashboard' && <RegionalDashboard data={dashboardData} />}
            {activeSection === 'community' && <CommunityEngagement data={communityData} />}
          </section>

          <section className="bg-gradient-to-r from-ocean-deep to-ocean-medium text-white py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <Icon name="Users" size={48} className="mx-auto mb-6 text-coral-warm" />
              <h2 className="font-headline text-3xl lg:text-4xl font-bold mb-6">{callToAction?.title}</h2>
              <p className="font-body text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">{callToAction?.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-coral-warm hover:bg-coral-warm/90 text-white"
                  iconName={callToAction?.primary?.icon}
                  iconPosition="left"
                >
                  {callToAction?.primary?.label}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-ocean-deep"
                  iconName={callToAction?.secondary?.icon}
                  iconPosition="left"
                >
                  {callToAction?.secondary?.label}
                </Button>
              </div>
            </div>
          </section>
        </main >

        <footer className="bg-card border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Icon name="Waves" size={24} className="text-primary" />
              <span className="font-headline text-lg font-bold text-text-primary">{footer?.name}</span>
            </div>
            <p className="font-body text-sm text-text-secondary">{footer?.description}</p>
          </div>
        </footer>
      </div>
    </StitchWrapper>
  );
};

export default RegionalImpactNetwork;
