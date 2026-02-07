import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, FileText, Globe2, GraduationCap, Newspaper, Users } from 'lucide-react';

const sections = [
  {
    title: 'About NARA',
    icon: Globe2,
    links: [
      { label: 'About NARA', path: '/about-nara-our-story' },
      { label: 'Media Gallery', path: '/media-gallery' },
      { label: 'Media Press Kit', path: '/media-press-kit' },
      { label: 'Contact Us', path: '/contact-us' }
    ]
  },
  {
    title: 'Research & Services',
    icon: Compass,
    links: [
      { label: 'Research Excellence Portal', path: '/research-excellence-portal' },
      { label: 'Government Services Portal', path: '/government-services-portal' },
      { label: 'Scientific Evidence Repository', path: '/scientific-evidence-repository' },
      { label: 'Open Data Portal', path: '/open-data-portal' }
    ]
  },
  {
    title: 'Divisions & Centers',
    icon: Users,
    links: [
      { label: 'All Divisions', path: '/divisions' },
      { label: 'Supporting Divisions', path: '/divisions/supporting' },
      { label: 'Regional Centers', path: '/divisions/regional-centers' },
      { label: 'Regional Impact Network', path: '/regional-impact-network' }
    ]
  },
  {
    title: 'Learning & Publications',
    icon: GraduationCap,
    links: [
      { label: 'Learning Development Academy', path: '/learning-development-academy' },
      { label: 'Digital Library', path: '/library' },
      { label: 'Annual Reports', path: '/annual-reports' },
      { label: 'News & Updates', path: '/nara-news-updates-center' }
    ]
  },
  {
    title: 'Public Information',
    icon: FileText,
    links: [
      { label: 'Vacancies', path: '/vacancies' },
      { label: 'Procurement & Recruitment', path: '/procurement-recruitment-portal' },
      { label: 'Public Consultation', path: '/public-consultation-portal' },
      { label: 'Right to Information (RTI)', path: '/rti' }
    ]
  },
  {
    title: 'Legal & Compliance',
    icon: Newspaper,
    links: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms of Use', path: '/terms-of-use' },
      { label: 'Accessibility Statement', path: '/accessibility-statement' },
      { label: 'NARA Act', path: '/nara-act' }
    ]
  }
];

const SiteMapPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-2xl border border-sky-100 bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">NARA Navigation</p>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Site Map</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Quick access to all major NARA portals, services, divisions, and legal information.
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
                  <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="inline-flex items-center gap-2 text-sm text-slate-700 transition-colors hover:text-sky-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                        {link.label}
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
