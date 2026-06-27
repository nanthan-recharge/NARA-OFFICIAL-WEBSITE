/**
 * Static prerender for SEO + AI crawlers.
 *
 * Runs after `vite build` (wired as the npm "postbuild" script). For every
 * public route it clones the built index.html shell and writes a per-route
 * <build>/<path>.html with a unique <title>, meta description, canonical,
 * Open Graph/Twitter tags, JSON-LD (WebPage + BreadcrumbList) and a
 * crawler-visible H1 + summary + links block inside #root.
 *
 * Because the app mounts with createRoot(), React simply replaces that block
 * on load — real users get the full SPA, while search engines and non-JS AI
 * crawlers get real per-page content. Firebase Hosting (cleanUrls) serves
 * <path>.html at /<path> before the SPA rewrite.
 *
 * Safe by design: any failure is logged and the process still exits 0, so it
 * can never break `npm run build` / deploy. Run manually: node scripts/prerender.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { SITE, SEO_ROUTES, KEY_LINKS } from './seo-routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = process.argv[2] ? resolve(process.argv[2]) : resolve(__dirname, '..', 'build');

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Replace the first match of `re` with `replacement`; no-op if not found.
const sub = (html, re, replacement) => (re.test(html) ? html.replace(re, replacement) : html);

function pageType(t) {
  return /Page$/.test(t || '') ? t : 'WebPage';
}

function jsonLd(route) {
  const url = SITE.base + route.path;
  const webpage = {
    '@context': 'https://schema.org',
    '@type': pageType(route.schemaType),
    name: route.title,
    headline: route.h1,
    description: route.description,
    url,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.base },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'National Aquatic Resources Research and Development Agency',
      alternateName: 'NARA',
      url: SITE.base,
    },
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.base + '/' },
      { '@type': 'ListItem', position: 2, name: route.title, item: url },
    ],
  };
  return (
    `<script type="application/ld+json">${JSON.stringify(webpage)}</script>\n` +
    `  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>`
  );
}

function seoBlock(route) {
  const links = KEY_LINKS.filter((l) => l.path !== route.path)
    .map((l) => `<li><a href="${l.path}">${esc(l.label)}</a></li>`)
    .join('');
  return `<div data-prerender-seo style="max-width:880px;margin:0 auto;padding:56px 20px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0f172a">
  <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#0066CC;font-weight:700;margin:0 0 8px">NARA Sri Lanka</p>
  <h1 style="font-size:30px;line-height:1.2;margin:0 0 14px">${esc(route.h1)}</h1>
  <p style="font-size:17px;line-height:1.6;color:#334155;margin:0 0 22px">${esc(route.summary)}</p>
  <p style="font-size:15px;color:#64748b;margin:0 0 8px">Explore more from NARA:</p>
  <ul style="line-height:1.9">${links}</ul>
  <p style="margin-top:24px;color:#94a3b8;font-size:13px">Loading the full interactive page…</p>
</div>`;
}

function buildPage(shell, route) {
  const url = SITE.base + route.path;
  const fullTitle = `${route.title} | NARA Sri Lanka`;
  const desc = route.description;
  let html = shell;

  html = sub(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`);
  html = sub(html, /<meta name="description"[\s\S]*?>/, `<meta name="description" content="${esc(desc)}" />`);
  html = sub(html, /<link rel="canonical"[\s\S]*?>/, `<link rel="canonical" href="${url}" />`);
  html = sub(html, /<meta property="og:title"[\s\S]*?>/, `<meta property="og:title" content="${esc(fullTitle)}" />`);
  html = sub(html, /<meta property="og:description"[\s\S]*?>/, `<meta property="og:description" content="${esc(desc)}" />`);
  html = sub(html, /<meta property="og:url"[\s\S]*?>/, `<meta property="og:url" content="${url}" />`);
  html = sub(html, /<meta name="twitter:title"[\s\S]*?>/, `<meta name="twitter:title" content="${esc(fullTitle)}" />`);
  html = sub(html, /<meta name="twitter:description"[\s\S]*?>/, `<meta name="twitter:description" content="${esc(desc)}" />`);

  // Inject per-page JSON-LD just before </head>
  html = sub(html, /<\/head>/, `  ${jsonLd(route)}\n</head>`);

  // Inject crawler-visible content into the (empty) #root mount node.
  // Matches the mount div regardless of attribute order, e.g.
  // <div class="dhiwise-code" id="root"></div>. The opening tag is preserved.
  html = sub(
    html,
    /(<div\b[^>]*\bid="root"[^>]*>)\s*<\/div>/,
    `$1${seoBlock(route)}</div>`,
  );

  return html;
}

function main() {
  const shellPath = join(BUILD_DIR, 'index.html');
  if (!existsSync(shellPath)) {
    console.warn(`[prerender] ${shellPath} not found — skipping (run after vite build).`);
    return;
  }
  const shell = readFileSync(shellPath, 'utf8');
  let ok = 0;
  let failed = 0;

  for (const route of SEO_ROUTES) {
    try {
      const segment = route.path.replace(/^\//, '');
      if (!segment) continue; // never overwrite the root index.html
      const outPath = join(BUILD_DIR, `${segment}.html`);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, buildPage(shell, route), 'utf8');
      ok += 1;
    } catch (err) {
      failed += 1;
      console.warn(`[prerender] skipped ${route.path}: ${err?.message || err}`);
    }
  }
  console.log(`[prerender] wrote ${ok} page(s) to ${BUILD_DIR}${failed ? `, ${failed} skipped` : ''}.`);
}

try {
  main();
} catch (err) {
  // Never break the build/deploy because of prerendering.
  console.warn('[prerender] non-fatal error:', err?.message || err);
}
process.exit(0);
