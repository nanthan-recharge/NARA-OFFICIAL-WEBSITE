import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Anchor,
  ArrowUp,
  Facebook,
  Fish,
  Globe,
  GraduationCap,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  Microscope,
  Moon,
  Phone,
  Search,
  Sun,
  Eye,
  Waves,
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

const sriLankanPartners = [
  { name: 'Ministry of Fisheries', href: 'https://www.fisheries.gov.lk', logo: '/logos/SRI LANKA LOGO .png', fallbackIcon: Anchor },
  { name: 'Ocean University', href: '/learning-development-academy', logo: '/logos/Ocean_University_Sri_Lanka_Crest.png', fallbackIcon: GraduationCap, internal: true },
  { name: 'Coast Guard', href: 'https://coastguard.gov.lk', logo: '/logos/COST GURD BG NO LOGO .png', fallbackIcon: Waves },
  { name: 'NAQDA', href: 'https://naqda.gov.lk/', logo: '/logos/NAAQDA LOGO .gif', fallbackIcon: Fish },
  { name: 'Dialog', href: 'https://www.dialog.lk/', logo: '/logos/logo.svg', fallbackIcon: Globe },
  { name: 'KDU', href: 'https://kdu.ac.lk/', logo: '/logos/KOTHAWAY UNIVERCITY .png', fallbackIcon: GraduationCap }
];

const internationalPartners = [
  { name: 'FAO', href: 'https://www.fao.org', logo: '/logos/FAO_logo.svg.png', fallbackIcon: Fish },
  { name: 'UNDP', href: 'https://www.undp.org', logo: '/logos/undo big logo.png', fallbackIcon: Globe },
  { name: 'KIOST', href: 'https://www.kiost.ac.kr/eng.do', logo: '/logos/KIOST LOGO .svg', fallbackIcon: Globe },
  { name: 'Norad', href: 'https://www.norad.no/en/', logo: '/logos/Norad_hovedlogo-liggende_green_RGB.png', fallbackIcon: Globe },
  { name: 'Chinese Academy of Sciences', href: 'https://english.cas.cn/', logo: '/logos/CHINES ACADMEY OF SCINES.jpeg', fallbackIcon: Globe },
  { name: 'SIO', href: 'https://www.sio.org.cn/en/', logo: '/logos/SIO LOGO .jpeg', fallbackIcon: Globe },
  { name: 'SCSIO', href: 'http://english.scsio.cas.cn/', logo: '/logos/SOUTH CHINA OCEAN .jpg', fallbackIcon: Globe }
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

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-[#d7eeff] to-[#bfe2ff] text-slate-900 dark:from-[#001f3f] dark:via-[#002b55] dark:to-[#003d7a] dark:text-white">
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-sky-600/10" />

        <section className="relative z-20 border-b border-slate-200 bg-slate-50 py-12 dark:border-white/5 dark:bg-[#020617]">
          <div className="mx-auto max-w-7xl px-6">
            <h3 className="mb-10 text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Our Partners &amp; Collaborators
            </h3>

            {/* Sri Lankan Partners */}
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-nara-blue dark:text-sky-400">Sri Lankan Partners</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-20">
              {sriLankanPartners.map((partner) => {
                const FallbackIcon = partner.fallbackIcon;
                const content = (
                  <>
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition-all group-hover:border-sky-300 group-hover:shadow-md dark:border-white/10 dark:bg-white md:h-20 md:w-20 md:p-3">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="h-full w-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div className={`items-center justify-center ${partner.logo ? 'hidden' : 'flex'}`}>
                        <FallbackIcon className="h-7 w-7 text-nara-blue md:h-9 md:w-9" />
                      </div>
                    </div>
                    <span className="text-center text-xs font-bold leading-tight text-slate-700 transition-colors group-hover:text-nara-blue dark:text-slate-300 dark:group-hover:text-sky-300">
                      {partner.name}
                    </span>
                  </>
                );

                if (partner.internal) {
                  return (
                    <Link key={partner.name} to={partner.href} className="group flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1">
                      {content}
                    </Link>
                  );
                }

                return (
                  <a key={partner.name} href={partner.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1">
                    {content}
                  </a>
                );
              })}
            </div>

            {/* Divider */}
            <div className="mx-auto my-8 h-px w-48 bg-slate-300 dark:bg-white/10" />

            {/* International Collaborators */}
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-nara-blue dark:text-sky-400">International Collaborators</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-20">
              {internationalPartners.map((partner) => {
                const FallbackIcon = partner.fallbackIcon;
                const content = (
                  <>
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition-all group-hover:border-sky-300 group-hover:shadow-md dark:border-white/10 dark:bg-white md:h-20 md:w-20 md:p-3">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="h-full w-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div className={`items-center justify-center ${partner.logo ? 'hidden' : 'flex'}`}>
                        <FallbackIcon className="h-7 w-7 text-nara-blue md:h-9 md:w-9" />
                      </div>
                    </div>
                    <span className="text-center text-xs font-bold leading-tight text-slate-700 transition-colors group-hover:text-nara-blue dark:text-slate-300 dark:group-hover:text-sky-300">
                      {partner.name}
                    </span>
                  </>
                );

                return (
                  <a key={partner.name} href={partner.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1">
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative z-20 border-b border-white/10 bg-[#003d7a] shadow-md">
          <div className="mx-auto flex h-12 max-w-7xl items-center px-0 sm:px-6">
            <div className="relative flex h-full items-center bg-cyan-400 px-6 text-sm font-bold uppercase tracking-wider text-[#001f3f] shadow-[4px_0_10px_rgba(0,0,0,0.1)]">
              <span>Latest News</span>
              <div className="absolute right-0 top-0 h-0 w-0 translate-x-full border-b-[24px] border-l-[12px] border-b-transparent border-l-cyan-400 border-t-[24px] border-t-transparent" />
            </div>
            <div className="w-6 shrink-0" />
            <div className="relative flex h-full flex-1 items-center overflow-hidden">
              <div className="gov-footer-marquee-track absolute flex min-w-max items-center gap-16 whitespace-nowrap">
                {marqueeItems.map((item, index) => (
                  <Link
                    key={`${item.title}-${index}`}
                    to={item.path}
                    className="group flex items-center text-sm font-medium text-white transition-colors hover:text-cyan-300"
                  >
                    <span className="mr-3 h-2 w-2 rounded-full bg-cyan-300 transition-colors group-hover:bg-cyan-100" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12">
          <section className="mb-16 rounded-2xl border border-slate-200 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 flex items-center text-xl font-bold text-slate-900 dark:text-white">
                  <Mail className="mr-2 h-5 w-5 text-sky-500" />
                  Stay Updated with NARA
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-slate-800 dark:text-slate-300">
                  Subscribe to receive the latest aquatic research updates, scientific publications, and official news directly to your inbox.
                </p>
              </div>
              <div>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(event) => setNewsletterEmail(event.target.value)}
                      placeholder="Enter your email address"
                      className="w-full rounded-lg border border-slate-300 bg-white/80 py-2.5 pl-10 pr-4 text-slate-800 outline-none transition-all placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="whitespace-nowrap rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-sky-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="mt-1.5 pl-1 text-xs text-slate-700 dark:text-slate-400">
                  {newsletterStatus === 'success' ? 'Thanks for subscribing. We will keep you informed.' : 'We respect your privacy. Unsubscribe at any time.'}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-8 lg:col-span-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/90 p-1.5 shadow-lg">
                  <img src="/logos/nara-logo-cropped.png" alt="NARA Logo" className="h-full w-full rounded-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-wide text-slate-900 dark:text-white">NARA</h2>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-sky-300">Government of Sri Lanka</p>
                </div>
              </div>

              <p className="pr-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                National Aquatic Resources Research and Development Agency. Delivering scientific leadership for sustainable aquatic resources management and conservation for future generations.
              </p>

              <div className="rounded-xl border border-slate-200 bg-white/40 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Official Address</h4>
                <p className="text-sm leading-snug text-slate-800 dark:text-slate-200">Crow Island, Mattakkuliya, <br />Colombo 15, Sri Lanka</p>

                <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
                  <img src="/logos/SRI LANKA LOGO .png" alt="Sri Lanka Government Emblem" className="h-10 w-10 shrink-0 object-contain" />
                  <p className="text-xs leading-snug">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Official Government Website</span><br />
                    <span className="font-semibold text-nara-blue dark:text-sky-300">Democratic Socialist Republic of Sri Lanka</span>
                  </p>
                </div>
              </div>
            </div>

            <nav aria-label="Footer quick links" className="lg:col-span-3">
              <h3 className="w-fit border-b-2 border-sky-400/30 pb-1 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-sky-200">Quick Links</h3>
              <ul className="mt-6 space-y-3 pl-4">
                {quickLinks.map((link) => (
                  <li key={link.path} className="relative">
                    <span className="absolute left-[-16px] top-[9px] h-1.5 w-1.5 rounded-full bg-slate-400 transition-colors group-hover:bg-sky-500 dark:bg-slate-500" />
                    <Link
                      to={link.path}
                      className="group block text-sm text-slate-700 transition-colors hover:text-sky-700 dark:text-slate-300 dark:hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Footer public services" className="lg:col-span-2">
              <h3 className="w-fit border-b-2 border-sky-400/30 pb-1 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-sky-200">Public Services</h3>
              <ul className="mt-6 space-y-3 pl-4">
                {publicServices.map((link) => (
                  <li key={link.path} className="relative">
                    <span className="absolute left-[-16px] top-[9px] h-1.5 w-1.5 rounded-full bg-slate-400 transition-colors group-hover:bg-sky-500 dark:bg-slate-500" />
                    <Link
                      to={link.path}
                      className="group block text-sm text-slate-700 transition-colors hover:text-sky-700 dark:text-slate-300 dark:hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <section className="flex flex-col items-start lg:col-span-3 lg:pl-4">
              <h3 className="w-fit border-b-2 border-sky-400/30 pb-1 text-sm font-bold uppercase tracking-widest text-slate-900 lg:w-full lg:text-right dark:text-sky-200">Contact &amp; Connect</h3>

              <div className="mb-6 mt-6 w-full rounded-2xl border border-slate-200 bg-white/40 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="mb-6 space-y-4">
                  <div className="group flex items-start">
                    <MapPin className="mr-3 mt-0.5 h-4 w-4 text-sky-600 transition-transform group-hover:scale-110 dark:text-sky-400" />
                    <span className="text-sm text-slate-800 dark:text-slate-200">Crow Island, Mattakkuliya, Colombo 15</span>
                  </div>
                  <div className="group flex items-center">
                    <Phone className="mr-3 h-4 w-4 text-sky-600 transition-transform group-hover:scale-110 dark:text-sky-400" />
                    <a href="tel:+94112521000" className="text-sm text-slate-800 transition-colors hover:text-sky-700 dark:text-slate-200 dark:hover:text-white">+94 11 252 1000</a>
                  </div>
                  <div className="group flex items-center">
                    <Mail className="mr-3 h-4 w-4 text-sky-600 transition-transform group-hover:scale-110 dark:text-sky-400" />
                    <a href="mailto:info@nara.ac.lk" className="text-sm text-slate-700 transition-colors hover:text-sky-700 dark:text-slate-200 dark:hover:text-white">info@nara.ac.lk</a>
                  </div>
                </div>

                <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-white/10">
                  <iframe
                    title="NARA Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.6!2d79.8625!3d6.9575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591b42857b2d%3A0x62a964e3e6e1a4f8!2sNational%20Aquatic%20Resources%20Research%20and%20Development%20Agency%20(NARA)!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                    className="h-36 w-full border-0 grayscale-[30%] dark:brightness-75 dark:contrast-125"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <a
                    href="https://maps.google.com/?q=NARA+Crow+Island+Mattakkuliya+Colombo+15+Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center border-t border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-sky-300"
                  >
                    <MapPin className="mr-1.5 h-3.5 w-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>

                <div className="flex space-x-3 lg:justify-end">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all duration-300 hover:scale-110 hover:text-white"
                        style={{
                          color: social.color,
                          borderColor: social.color,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = social.color;
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = social.color;
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>
          </section>

          <section className="border-t border-slate-300 pb-6 pt-8 text-[13px] text-slate-700 dark:border-white/10 dark:text-slate-300">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              {/* Copyright + Developer */}
              <p className="font-medium">© {new Date().getFullYear()} NARA. All rights reserved.</p>
              <span className="hidden md:inline text-slate-400 dark:text-slate-500">·</span>
              <p>
                Developed by <a href="https://safenetcreations.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-nara-blue transition-colors hover:text-nara-navy dark:text-sky-300 dark:hover:text-sky-200">SafeNet Creations</a>
              </p>

              {/* Divider */}
              <div className="hidden md:block w-px h-4 bg-slate-400/50 dark:bg-white/15" />

              {/* Language toggle — compact */}
              <div className="flex items-center space-x-2 rounded-full border border-slate-300 bg-white/50 px-3 py-1 text-xs dark:border-white/15 dark:bg-white/5">
                <Languages className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
                <div className="flex items-center space-x-2 font-medium">
                  {languageOptions.map((lang, index) => (
                    <React.Fragment key={lang.code}>
                      <button
                        type="button"
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`transition-colors hover:text-sky-700 dark:hover:text-white ${i18n.language === lang.code ? 'text-sky-700 dark:text-sky-200' : 'text-slate-600 dark:text-slate-300'}`}
                      >
                        {lang.label}
                      </button>
                      {index < languageOptions.length - 1 ? <span className="text-slate-300 dark:text-slate-500">|</span> : null}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-4 bg-slate-400/50 dark:bg-white/15" />

              {/* Privacy links */}
              <div className="flex items-center gap-3">
                <Link to="/privacy-policy" className="font-medium transition-colors hover:text-sky-700 dark:hover:text-white">Privacy Policy</Link>
                <Link to="/accessibility-statement" className="font-medium transition-colors hover:text-sky-700 dark:hover:text-white">Accessibility</Link>
                <Link to="/site-map" className="font-medium transition-colors hover:text-sky-700 dark:hover:text-white">Sitemap</Link>
              </div>
            </div>
          </section>
        </div>

        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-3">
          <Link
            to="/accessibility-statement"
            aria-label="Accessibility settings"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-lg transition-all hover:scale-105 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <Eye className="h-4 w-4" />
          </Link>

          <button
            type="button"
            aria-label="Back to top"
            onClick={handleBackToTop}
            className="gov-footer-pulse flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-2xl transition-all hover:-translate-y-1 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/60"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </>
  );
};

export default GovFooter;
