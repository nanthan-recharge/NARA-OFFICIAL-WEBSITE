import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, FileText, Globe2, GraduationCap, Newspaper, Users } from 'lucide-react';
import SEOHead from '../../components/shared/SEOHead';
import { useTranslation } from 'react-i18next';

const sections = [
  {
    key: 'aboutNara',
    icon: Globe2,
    links: [
      { key: 'aboutNara', path: '/about-nara-our-story' },
      { key: 'mediaGallery', path: '/media-gallery' },
      { key: 'mediaPressKit', path: '/media-press-kit' },
      { key: 'contactUs', path: '/contact-us' }
    ]
  },
  {
    key: 'researchServices',
    icon: Compass,
    links: [
      { key: 'researchExcellencePortal', path: '/research-excellence-portal' },
      { key: 'governmentServicesPortal', path: '/government-services-portal' },
      { key: 'scientificEvidenceRepository', path: '/scientific-evidence-repository' },
      { key: 'openDataPortal', path: '/open-data-portal' }
    ]
  },
  {
    key: 'divisionsCenters',
    icon: Users,
    links: [
      { key: 'allDivisions', path: '/divisions' },
      { key: 'supportingDivisions', path: '/divisions/supporting' },
      { key: 'regionalCenters', path: '/divisions/regional-centers' },
      { key: 'regionalImpactNetwork', path: '/regional-impact-network' }
    ]
  },
  {
    key: 'learningPublications',
    icon: GraduationCap,
    links: [
      { key: 'learningDevelopmentAcademy', path: '/learning-development-academy' },
      { key: 'digitalLibrary', path: '/library' },
      { key: 'annualReports', path: '/annual-reports' },
      { key: 'newsUpdates', path: '/nara-news-updates-center' }
    ]
  },
  {
    key: 'publicInformation',
    icon: FileText,
    links: [
      { key: 'vacancies', path: '/vacancies' },
      { key: 'procurementRecruitment', path: '/procurement-recruitment-portal' },
      { key: 'publicConsultation', path: '/public-consultation-portal' },
      { key: 'rightToInformation', path: '/rti' }
    ]
  },
  {
    key: 'legalCompliance',
    icon: Newspaper,
    links: [
      { key: 'privacyPolicy', path: '/privacy-policy' },
      { key: 'termsOfUse', path: '/terms-of-use' },
      { key: 'accessibilityStatement', path: '/accessibility-statement' },
      { key: 'naraAct', path: '/nara-act' }
    ]
  }
];

const SiteMapPage = () => {
  const { t } = useTranslation('siteMap');

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <SEOHead
        title={t('meta.title')}
        description={t('meta.description')}
        path="/site-map"
        keywords={t('meta.keywords')}
      />
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-2xl border border-sky-100 bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">{t('hero.eyebrow')}</p>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{t('hero.title')}</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            {t('hero.description')}
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <article
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-sky-100 p-2 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{t(`sections.${section.key}.title`)}</h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="inline-flex items-center gap-2 text-sm text-slate-700 transition-colors hover:text-sky-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                        {t(`sections.${section.key}.links.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default SiteMapPage;
