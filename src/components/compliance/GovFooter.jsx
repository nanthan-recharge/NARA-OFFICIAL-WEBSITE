import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUp,
  Facebook,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Phone,
  Search,
  Sun,
  Youtube
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About NARA', path: '/about-nara-our-story' },
  { name: 'Research Divisions', path: '/divisions' },
  { name: 'Research Excellence', path: '/research-excellence-portal' },
  { name: 'Digital Library', path: '/library' },
  { name: 'News & Updates', path: '/nara-news-updates-center' },
  { name: 'Annual Reports', path: '/annual-reports' },
  { name: 'Site Map', path: '/site-map' }
];

const publicServices = [
  { name: 'Vacancies', path: '/vacancies' },
  { name: 'Procurement & Recruitment', path: '/procurement-recruitment-portal' },
  { name: 'Scientist Sessions', path: '/scientist-session' },
  { name: 'Public Consultation', path: '/public-consultation-portal' },
  { name: 'Right to Information (RTI)', path: '/rti' },
  { name: 'NARA Act', path: '/nara-act' }
];

const tickerNews = [
  { title: 'Annual Scientist Sessions 2026 Registration Open', path: '/scientist-session' },
  { title: 'New Research on Sustainable Fisheries in the Indian Ocean', path: '/research-excellence-portal' },
  { title: 'Public Consultation: Marine Spatial Planning Draft Policy', path: '/public-consultation-portal' },
  { title: 'NARA Discovers New Coral Species off the Southern Coast', path: '/nara-news-updates-center' },
  { title: 'Oceanographic Data Analysis Workshop - Apply Now', path: '/learning-development-academy' }
];

const socialLinks = [
  {
    label: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/people/National-Aquatic-Resources-Research-and-Development-Agency-NARA/100085038477514/',
    color: '#1877F2',
  },
  {
    label: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com/company/nara/',
    color: '#0A66C2',
  },
  {
    label: 'YouTube',
    icon: Youtube,
    href: 'https://www.youtube.com/@naranewstv2022',
    color: '#FF0000',
  }
];

const languageOptions = [
  { label: 'English', code: 'en' },
  { label: 'සිංහල', code: 'si' },
  { label: 'தமிழ்', code: 'ta' }
];

const GovFooter = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === 'undefined') {
      return false;
    }
    return document.documentElement.classList.contains('dark');
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [siteSearch, setSiteSearch] = useState('');

  const marqueeItems = useMemo(() => [...tickerNews, ...tickerNews], []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    const nextMode = !root.classList.contains('dark');
    root.classList.toggle('dark', nextMode);
    setIsDarkMode(nextMode);
    try {
      localStorage.setItem('theme', nextMode ? 'dark' : 'light');
    } catch {
      // Ignore write failures (private mode or blocked storage)
    }
  };

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) {
      return;
    }

    setNewsletterStatus('success');
    setNewsletterEmail('');

    setTimeout(() => {
      setNewsletterStatus('idle');
    }, 3000);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!siteSearch.trim()) {
      return;
    }
    navigate(`/nara-news-updates-center?q=${encodeURIComponent(siteSearch.trim())}`);
    setSiteSearch('');
  };

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    try {
      localStorage.setItem('nara-lang', code);
      window.dispatchEvent(new CustomEvent('languageChange', { detail: code }));
    } catch {
      // Language still changes through i18n if storage is unavailable.
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="gov-footer relative border-t border-slate-200 bg-slate-50 text-slate-900 dark:border-white/10 dark:bg-[#061a33] dark:text-white">
      <style>{`
        .gov-footer p,
        .gov-footer h2,
        .gov-footer h3 {
          margin: 0;
        }

        .gov-footer a {
          min-height: 0;
          min-width: 0;
          padding: 0;
          align-items: center;
          justify-content: flex-start;
          text-decoration: none;
        }

        .gov-footer a:hover {
          text-decoration: none;
        }

        .gov-footer button {
          min-width: 0;
        }

        .gov-footer .footer-control {
          min-height: 2.25rem;
          justify-content: center;
          padding: 0.5rem 0.75rem;
        }

        .gov-footer .footer-theme-button {
          justify-self: start;
        }

        .gov-footer .footer-icon-link {
          min-height: 2rem;
          min-width: 2rem;
          justify-content: center;
          padding: 0;
        }

        .gov-footer .footer-map-link {
          min-height: 2rem;
          justify-content: center;
          padding: 0.4rem 0.75rem;
        }

        .gov-footer .footer-back-to-top {
          display: none;
        }

        .gov-footer .footer-top-grid,
        .gov-footer .footer-actions-grid,
        .gov-footer .footer-main-grid,
        .gov-footer .footer-link-grid {
          display: grid;
        }

        .gov-footer .footer-top-grid {
          gap: 1rem;
        }

        .gov-footer .footer-actions-grid {
          gap: 0.75rem;
        }

        .gov-footer .footer-main-grid {
          gap: 1rem;
          grid-template-columns: minmax(0, 1fr);
        }

        .gov-footer .footer-link-grid {
          gap: 0.35rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (min-width: 640px) {
          .gov-footer .footer-back-to-top {
            display: flex;
          }
        }

        @media (min-width: 768px) {
          .gov-footer .footer-actions-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
          }

          .gov-footer .footer-main-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }

        }

        @media (min-width: 1024px) {
          .gov-footer .footer-top-grid {
            grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.8fr);
            align-items: center;
          }

          .gov-footer .footer-main-grid {
            gap: 1.25rem;
            grid-template-columns: minmax(220px, 1.1fr) minmax(160px, 0.8fr) minmax(190px, 0.9fr) minmax(220px, 1fr);
          }

          .gov-footer .footer-link-grid {
            grid-template-columns: minmax(0, 1fr);
          }

        }
      `}</style>
      <section className="border-b border-slate-200 bg-white/90 py-3 dark:border-white/10 dark:bg-[#041427]/95">
        <div className="footer-top-grid mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/logos/nara-logo-cropped.webp" alt="NARA Logo" className="h-10 w-10 shrink-0 rounded-full bg-white object-cover p-1 shadow-sm" />
            <div>
              <h2 className="text-lg font-bold tracking-wide text-nara-navy dark:text-white">NARA</h2>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-sky-300">Government of Sri Lanka</p>
            </div>
          </div>

          <div className="footer-actions-grid">
            <form onSubmit={handleNewsletterSubmit} className="flex min-w-0 gap-2" aria-label="Subscribe to NARA updates">
              <div className="relative min-w-0 flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="Email updates"
                  className="h-9 w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-300"
                />
              </div>
              <button type="submit" className="footer-control h-9 rounded-lg bg-sky-600 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
                Subscribe
              </button>
            </form>

            <form onSubmit={handleSearchSubmit} role="search" aria-label="Footer site search" className="flex min-w-0 gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                <input
                  type="search"
                  value={siteSearch}
                  onChange={(event) => setSiteSearch(event.target.value)}
                  placeholder="Search NARA"
                  className="h-9 w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-300"
                />
              </div>
              <button type="submit" className="footer-control h-9 rounded-lg bg-nara-navy text-sm font-semibold text-white transition-colors hover:bg-nara-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
                Search
              </button>
            </form>

            <button
              type="button"
              onClick={toggleDarkMode}
              aria-pressed={isDarkMode}
              className="footer-control footer-theme-button inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800 transition-colors hover:border-sky-400 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:text-sky-200"
            >
              {isDarkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
              <span>{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {newsletterStatus === 'success' ? (
            <p className="text-xs text-slate-600 dark:text-slate-400 lg:col-start-2">
              Thanks for subscribing. We will keep you informed.
            </p>
          ) : null}
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#003d7a]">
        <div className="mx-auto flex h-10 max-w-7xl items-center px-0 sm:px-6">
          <div className="flex h-full items-center bg-cyan-400 px-4 text-xs font-bold uppercase tracking-wider text-[#001f3f]">
            Latest News
          </div>
          <div className="relative flex h-full flex-1 items-center overflow-hidden">
            <div className="gov-footer-marquee-track absolute flex min-w-max items-center gap-12 whitespace-nowrap">
              {marqueeItems.map((item, index) => (
                <Link
                  key={`${item.title}-${index}`}
                  to={item.path}
                  className="group flex items-center text-xs font-medium text-white transition-colors hover:text-cyan-200"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <section className="footer-main-grid">
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-nara-navy dark:text-sky-200">Official Agency</h3>
            <p className="max-w-sm text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              National Aquatic Resources Research and Development Agency, Crow Island, Mattakkuliya, Colombo 15, Sri Lanka.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold leading-snug text-slate-800 dark:text-slate-200">
              <img src="/logos/SRI LANKA LOGO .webp" alt="Sri Lanka Government Emblem" className="h-8 w-8 shrink-0 object-contain" />
              <span>Official Government Website of the Democratic Socialist Republic of Sri Lanka</span>
            </div>
          </div>

          <nav aria-label="Footer quick links">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-nara-navy dark:text-sky-200">Quick Links</h3>
            <ul className="footer-link-grid text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-700 transition-colors hover:text-sky-700 dark:text-slate-300 dark:hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer public services">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-nara-navy dark:text-sky-200">Public Services</h3>
            <ul className="footer-link-grid text-sm">
              {publicServices.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-700 transition-colors hover:text-sky-700 dark:text-slate-300 dark:hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-contact-heading">
            <h3 id="footer-contact-heading" className="mb-3 text-sm font-bold uppercase tracking-wider text-nara-navy dark:text-sky-200">Contact</h3>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                <span>Crow Island, Mattakkuliya, Colombo 15</span>
              </p>
              <a href="tel:+94112521000" className="flex gap-2 transition-colors hover:text-sky-700 dark:hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                <span>+94 11 252 1000</span>
              </a>
              <a href="mailto:info@nara.ac.lk" className="flex gap-2 transition-colors hover:text-sky-700 dark:hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                <span>info@nara.ac.lk</span>
              </a>
              <a
                href="https://maps.google.com/?q=NARA+Crow+Island+Mattakkuliya+Colombo+15+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-map-link inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-700 dark:border-white/15 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Open in Google Maps
              </a>
            </div>

            <div className="mt-4 flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="footer-icon-link flex h-8 w-8 items-center rounded-full border bg-white text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-700 dark:border-white/15 dark:bg-white/10 dark:text-slate-200 dark:hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </section>
        </section>

        <section className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-700 dark:border-white/10 dark:text-slate-300">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <p className="font-medium">© {new Date().getFullYear()} NARA. All rights reserved.</p>
            <span className="hidden md:inline text-slate-400 dark:text-slate-500">·</span>
            <p>
              Developed by <a href="https://safenetcreations.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-nara-blue transition-colors hover:text-nara-navy dark:text-sky-300 dark:hover:text-sky-200">SafeNet Creations</a>
            </p>

            <div className="hidden md:block h-4 w-px bg-slate-300 dark:bg-white/15" />

            <div className="flex items-center space-x-2 rounded-full border border-slate-300 bg-white px-3 py-1 dark:border-white/15 dark:bg-white/5">
              <Languages className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
              <div className="flex items-center space-x-2 font-medium">
                {languageOptions.map((lang, index) => (
                  <React.Fragment key={lang.code}>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`transition-colors hover:text-sky-700 dark:hover:text-white ${i18n.language === lang.code ? 'text-sky-700 dark:text-sky-200' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      {lang.label}
                    </button>
                    {index < languageOptions.length - 1 ? <span className="text-slate-300 dark:text-slate-500">|</span> : null}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="hidden md:block h-4 w-px bg-slate-300 dark:bg-white/15" />

            <div className="flex items-center gap-3">
              <Link to="/privacy-policy" className="font-medium transition-colors hover:text-sky-700 dark:hover:text-white">Privacy Policy</Link>
              <Link to="/accessibility-statement" className="font-medium transition-colors hover:text-sky-700 dark:hover:text-white">Accessibility</Link>
              <Link to="/site-map" className="font-medium transition-colors hover:text-sky-700 dark:hover:text-white">Sitemap</Link>
            </div>
          </div>
        </section>
      </div>

      <button
        type="button"
        aria-label="Back to top"
        onClick={handleBackToTop}
        className="footer-back-to-top fixed bottom-24 right-6 z-[9997] h-10 w-10 items-center justify-center rounded-full bg-nara-navy text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-nara-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/60"
        title="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default GovFooter;
