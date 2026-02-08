import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import GlobalNetworkSection from './components/GlobalNetworkSection';
import InnovationShowcase from './components/InnovationShowcase';
import PartnershipOpportunities from './components/PartnershipOpportunities';
import TechnologyTransfer from './components/TechnologyTransfer';
import EventsCalendar from './components/EventsCalendar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StitchWrapper from '../../components/shared/StitchWrapper';
import SEOHead from '../../components/shared/SEOHead';

const PartnershipInnovationGateway = () => {
  const { t } = useTranslation('partnershipGateway');

  const heroStats = useMemo(
    () => [
      { label: t('hero.stats.globalPartners'), value: '24', icon: 'Globe' },
      { label: t('hero.stats.activeProjects'), value: '156', icon: 'Zap' },
      { label: t('hero.stats.technologiesLicensed'), value: '18', icon: 'Award' },
      { label: t('hero.stats.countriesReached'), value: '35', icon: 'Map' }
    ],
    [t]
  );

  const impactMetrics = useMemo(
    () => [
      {
        title: t('impactMetrics.researchImpact.title'),
        metrics: [
          { label: t('impactMetrics.researchImpact.jointPublications'), value: '342' },
          { label: t('impactMetrics.researchImpact.citationIndex'), value: '2,847' },
          { label: t('impactMetrics.researchImpact.hIndexGrowth'), value: '+45%' }
        ]
      },
      {
        title: t('impactMetrics.economicImpact.title'),
        metrics: [
          { label: t('impactMetrics.economicImpact.technologyRevenue'), value: '$12.5M' },
          { label: t('impactMetrics.economicImpact.jobsCreated'), value: '1,250' },
          { label: t('impactMetrics.economicImpact.industryPartnerships'), value: '89' }
        ]
      },
      {
        title: t('impactMetrics.innovationPipeline.title'),
        metrics: [
          { label: t('impactMetrics.innovationPipeline.patentsFiled'), value: '28' },
          { label: t('impactMetrics.innovationPipeline.technologiesInDevelopment'), value: '15' },
          { label: t('impactMetrics.innovationPipeline.pilotProjects'), value: '42' }
        ]
      }
    ],
    [t]
  );

  return (
    <StitchWrapper>
      <SEOHead
        title={t('meta.title')}
        description={t('meta.description')}
        path="/partnership-innovation-gateway"
        keywords={t('meta.keywords')}
      />
      <div className="relative z-10 w-full min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left space-y-8">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span className="text-cyan-300 text-xs font-bold tracking-widest uppercase">{t('hero.badge')}</span>
                </div>

                <h1 className="font-headline text-5xl lg:text-7xl font-bold text-white leading-[1.1]">
                  {t('hero.titlePrefix')}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">{t('hero.titleHighlight')}</span> {t('hero.titleSuffix')}
                </h1>

                <p className="font-body text-xl text-slate-300 max-w-xl leading-relaxed">
                  {t('hero.description')}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button variant="default" size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white border-0 shadow-lg shadow-cyan-900/20">
                    <Icon name="Handshake" size={20} className="mr-2" />
                    {t('hero.cta.explore')}
                  </Button>
                  <Button variant="outline" size="lg" className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10">
                    <Icon name="Rocket" size={20} className="mr-2" />
                    {t('hero.cta.innovations')}
                  </Button>
                </div>
              </div>

              {/* Right Content - Unique Hero Image Placeholder */}
              <div className="relative group w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 hover:border-cyan-400/50 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                  <Icon name="Image" size={32} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-white/60 group-hover:text-cyan-100 transition-colors mb-2">
                  {t('hero.upload.title')}
                </h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto group-hover:text-cyan-200/70 transition-colors">
                  {t('hero.upload.description')}
                </p>

                <div className="mt-6 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-slate-500 group-hover:border-cyan-500/30 group-hover:text-cyan-400/80 transition-all">
                  {t('hero.upload.recommended')}
                </div>
              </div>
            </div>

            {/* Hero Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
              {heroStats?.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon name={stat?.icon} size={24} className="text-cyan-400" />
                  </div>
                  <div className="font-headline text-3xl font-bold text-white mb-2">
                    {stat?.value}
                  </div>
                  <div className="font-body text-sm text-slate-400">
                    {stat?.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Global Network Section */}
        <GlobalNetworkSection />
        {/* Innovation Showcase */}
        <InnovationShowcase />
        {/* Partnership Opportunities */}
        <PartnershipOpportunities />
        {/* Technology Transfer */}
        <TechnologyTransfer />
        {/* Events Calendar */}
        <EventsCalendar />
        {/* Impact Metrics Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                {t('impactSection.title')}
              </h2>
              <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
                {t('impactSection.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {impactMetrics?.map((category, index) => (
                <div key={index} className="bg-card rounded-lg p-8 ocean-depth-shadow">
                  <h3 className="font-cta text-xl font-semibold text-text-primary mb-6 text-center">
                    {category?.title}
                  </h3>
                  <div className="space-y-4">
                    {category?.metrics?.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center justify-between">
                        <span className="font-body text-text-secondary">{metric?.label}</span>
                        <span className="font-cta text-lg font-semibold text-primary">{metric?.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Call to Action Section */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-success/10 rounded-2xl p-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                <Icon name="Users" size={32} className="text-primary" />
              </div>
              <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
                {t('ctaSection.title')}
              </h2>
              <p className="font-body text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('ctaSection.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="default" size="lg">
                  <Icon name="MessageSquare" size={20} className="mr-2" />
                  {t('ctaSection.actions.startConversation')}
                </Button>
                <Button variant="outline" size="lg">
                  <Icon name="FileText" size={20} className="mr-2" />
                  {t('ctaSection.actions.proposal')}
                </Button>
                <Button variant="ghost" size="lg">
                  <Icon name="Phone" size={20} className="mr-2" />
                  {t('ctaSection.actions.schedule')}
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="bg-card border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-ocean-deep to-ocean-medium rounded-lg flex items-center justify-center">
                    <Icon name="Waves" size={24} color="white" />
                  </div>
                  <div>
                    <div className="font-headline text-lg font-bold text-text-primary">
                      {t('footer.brand.title')}
                    </div>
                    <div className="font-body text-sm text-text-secondary">
                      {t('footer.brand.subtitle')}
                    </div>
                  </div>
                </div>
                <p className="font-body text-sm text-text-secondary mb-4 max-w-md">
                  {t('footer.description')}
                </p>
                <div className="flex space-x-4">
                  <Button variant="ghost" size="sm">
                    <Icon name="Mail" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Phone" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Globe" size={16} />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-cta text-sm font-semibold text-text-primary mb-4">{t('footer.quickLinks.title')}</h3>
                <ul className="space-y-2">
                  <li><a href="#partnerships" className="font-body text-sm text-text-secondary hover:text-primary">{t('footer.quickLinks.globalNetwork')}</a></li>
                  <li><a href="#innovations" className="font-body text-sm text-text-secondary hover:text-primary">{t('footer.quickLinks.innovationShowcase')}</a></li>
                  <li><a href="#opportunities" className="font-body text-sm text-text-secondary hover:text-primary">{t('footer.quickLinks.partnershipOpportunities')}</a></li>
                  <li><a href="#technology" className="font-body text-sm text-text-secondary hover:text-primary">{t('footer.quickLinks.technologyTransfer')}</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-cta text-sm font-semibold text-text-primary mb-4">{t('footer.contact.title')}</h3>
                <div className="space-y-2 text-sm">
                  <p className="font-body text-text-secondary">{t('footer.contact.office')}</p>
                  <p className="font-body text-text-secondary">{t('footer.contact.email')}</p>
                  <p className="font-body text-text-secondary">{t('footer.contact.phone')}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="font-body text-sm text-text-secondary">
                {t('footer.copyright', { year: new Date()?.getFullYear() })}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </StitchWrapper>
  );
};

export default PartnershipInnovationGateway;
