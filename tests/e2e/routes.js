/**
 * Public, non-auth routes worth covering in smoke / a11y / visual tests.
 * Admin and auth-gated routes are intentionally excluded (lower priority,
 * and they redirect to login).
 *
 * KEY_PAGES are the highest-traffic pages that also get visual + a11y coverage.
 * ALL_PUBLIC is the broader set used only for the lightweight routing smoke test.
 */
export const KEY_PAGES = [
  { path: '/', name: 'home' },
  { path: '/about-nara-our-story', name: 'about' },
  { path: '/divisions', name: 'divisions-hub' },
  { path: '/nara-news-updates-center', name: 'news' },
  { path: '/media-gallery', name: 'media-gallery' },
  { path: '/library', name: 'library' },
  { path: '/fish-advisory-system', name: 'fish-advisory' },
  { path: '/government-services-portal', name: 'gov-services' },
  { path: '/learning-development-academy', name: 'academy' },
  { path: '/contact-us', name: 'contact' },
  { path: '/podcasts', name: 'podcasts' },
];

export const ALL_PUBLIC = [
  ...KEY_PAGES.map((p) => p.path),
  '/accessibility-statement',
  '/annual-reports',
  '/aqua-school-directory',
  '/audiences/general-public',
  '/audiences/industry-exporters',
  '/audiences/researchers-students',
  '/contact-us',
  '/cookie-policy',
  '/digital-product-library',
  '/divisions/regional-centers',
  '/divisions/supporting',
  '/emergency-response-network',
  '/export-market-intelligence',
  '/knowledge-discovery-center',
  '/live-ocean-data',
  '/marine-forecast',
  '/marine-spatial-planning-viewer',
  '/media-press-kit',
  '/nara-act',
  '/open-data-portal',
  '/privacy-policy',
  '/research-vessel-booking',
  '/rti',
  '/site-map',
  '/terms-of-use',
  '/vacancies',
];

// De-duplicate while preserving order.
export const ALL_PUBLIC_UNIQUE = [...new Set(ALL_PUBLIC)];

/**
 * Pages stable enough for pixel-diff visual regression. Excludes pages driven by
 * live data, video, maps or carousels (media-gallery, news, podcasts,
 * fish-advisory, academy, etc.) which would diff on every run.
 */
export const VISUAL_PAGES = [
  { path: '/', name: 'home' },
  { path: '/about-nara-our-story', name: 'about' },
  { path: '/divisions', name: 'divisions-hub' },
  { path: '/library', name: 'library' },
  { path: '/government-services-portal', name: 'gov-services' },
  { path: '/contact-us', name: 'contact' },
];
