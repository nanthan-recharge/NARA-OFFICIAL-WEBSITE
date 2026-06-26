# E2E / UX Test Suite (Playwright + axe)

Automated guards for the public site: routing health, accessibility, visual
regression, and responsive layout. Runs against the dev server (port 4028),
which Playwright starts automatically.

## Setup (once)

```bash
npm install            # installs @playwright/test + @axe-core/playwright
npx playwright install chromium
```

## Commands

| Command | What it does |
|---|---|
| `npm run test:e2e` | Run the whole suite (desktop + mobile) |
| `npm run test:e2e:ui` | Interactive Playwright UI mode |
| `npm run test:smoke` | Visit every public route; fail on raw i18n keys / 404 / console errors |
| `npm run test:a11y` | axe-core WCAG 2.1 A/AA scan of key pages (fails on serious/critical) |
| `npm run test:visual` | Compare key pages against committed screenshot baselines |
| `npm run test:visual:update` | Regenerate baselines after an intentional UI change |

## Files

- `routes.js` — `KEY_PAGES` (visual + a11y coverage) and `ALL_PUBLIC_UNIQUE` (smoke).
- `smoke.spec.js` — routing health; this is what catches bugs like the 404 page
  rendering `notFound.title` instead of translated text.
- `a11y.spec.js` — axe scan; blocks on serious/critical, reports the rest.
- `visual.spec.js` — full-page screenshot diffing at desktop + mobile.
- `responsive.spec.js` — no horizontal overflow + touch-target size.

## Baselines

Visual baselines live in `visual.spec.js-snapshots/` and **must be committed**.
Generate them once with `npm run test:visual:update`, eyeball the images, then
commit. CI fails if a change shifts pixels beyond the 2% tolerance.

## CI

Set `CI=1`. The config enables retries, GitHub reporter, and disables
`reuseExistingServer`. Run `npx playwright install --with-deps chromium` in CI first.
