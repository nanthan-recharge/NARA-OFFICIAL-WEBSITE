# NARA Digital Ocean — Project Reference

## Project Overview

- **Name:** `nara-digital-ocean` — NARA (National Aquatic Resources Research & Development Agency) Sri Lanka
- **Stack:** React 19.2 + Vite 7.1 + Tailwind CSS 3.4 + Firebase 12 + Framer Motion 12
- **Languages:** English, Sinhala (si), Tamil (ta) via react-i18next
- **Dev server:** `npm start` → **port 4028** (NOT `npm run dev`)
- **Build:** `npm run build` → outputs to `build/`

---

## Design System

### Color Tokens (tailwind.config.js)

| Token | Hex | Usage |
|-------|-----|-------|
| `nara-navy` | #003366 | Primary dark — buttons, hero bg, avatars, nav active |
| `nara-blue` | #0066CC | Links, accents, hover states |
| `nara-white` | #FFFFFF | Backgrounds |
| `nara-gray` | #333333 | Dark text |
| `ocean-deep` | #001F54 | Deep navy backgrounds |
| `logo-blue` | #00BFFF | Logo accent, light decorations |

### Division Detail Pages (Light Theme)

- Page bg: `bg-white`, alternating sections `bg-slate-50`
- Cards: `bg-white border border-slate-200 rounded-xl` + `hover:shadow-md`
- Headings: `text-slate-900` / Body: `text-slate-600` / Labels: `text-slate-400`
- Accent text: `text-nara-blue`
- Buttons: `bg-nara-navy hover:bg-nara-blue text-white`
- Status badges: `bg-emerald-50 text-emerald-700` (active), `bg-blue-50 text-blue-700` (completed), `bg-amber-50 text-amber-700` (pending)
- **NO icons on division pages** — all Lucide icons removed, `iconMap.js` deleted

### Division Hub Page (`/divisions`)

- Uses **dark theme** (`bg-slate-950`) — intentionally different from detail pages
- Color-coded categories: Research (blue), Regional (emerald), Supporting (amber)

### Typography

| Class | Font | Usage |
|-------|------|-------|
| `font-headline` | Space Grotesk | Section headings, page titles |
| `font-body` / default | Inter | Body text, UI elements |
| `font-mono` | JetBrains Mono | Code, data values |
| Multi-lang | Noto Sans Tamil / Noto Sans Sinhala | Regional language support |

### Heading Hierarchy

- Page title (hero): `font-headline text-4xl sm:text-5xl font-bold text-white tracking-tight`
- Section title: `font-headline text-2xl sm:text-3xl font-semibold text-slate-900`
- Card title: `text-lg font-semibold text-slate-900`
- Body: `text-base text-slate-600 leading-relaxed`
- Labels: `text-xs uppercase tracking-wider text-slate-400 font-medium`

### Available Custom Shadows

- `shadow-ocean-depth` — Layered blue shadow for premium cards
- `shadow-coral-glow` — Warm glow effect
- `shadow-scientific` — Subtle research feel
- `shadow-glass` — Glass morphism shadow

### Available Custom Animations

- `ocean-pulse`, `data-flow`, `depth-reveal`, `parallax-float`, `particle-drift`, `glass-shimmer`, `spin-slow`, `pulse-slow`

---

## Architecture & Conventions

### Routing

- React Router v6, all routes in `src/Routes.jsx` (~586 lines)
- All page components lazy-loaded with `React.lazy()`
- Admin routes protected via `AdminProtectedRoute`
- Layout wrapper provides GovernmentNavbar + GovFooter

### Internationalization (i18n)

- react-i18next with 3 languages: `en`, `si`, `ta`
- 25+ namespaces in `src/locales/{en,si,ta}/`
- Division labels: `getLabel(key, lang)` from `src/utils/divisionTranslations.js`
- Validation: `npm run validate:localization`

### State Management

- **React Context:** FirebaseAuthContext, CartContext, LibraryUserContext
- **Zustand:** Theme store (`src/store/theme.js`)
- **Redux Toolkit:** Form state management

### Division Pages Structure

```
src/pages/division-page/
├── index.jsx            # Orchestrator — lazy sections, sticky nav, scroll tracking
├── DivisionHero.jsx     # Image carousel + breadcrumb + title
├── DivisionOverview.jsx # Stats, mission, head of division, highlights
├── DivisionFocusAreas.jsx # Research focus area cards
├── DivisionServices.jsx   # Numbered service cards
├── DivisionProjects.jsx   # Project list with status badges
├── DivisionTeam.jsx       # Team member profile cards
├── DivisionImpact.jsx     # Metrics, charts, stories, partnerships
├── DivisionContact.jsx    # Contact cards + CTA
└── ImpactChart.jsx        # Recharts area chart (lazy-loaded)
```

- **Data source:** `src/data/divisionsConfig.js` (21 divisions, ~1900 lines)
- **Lazy rendering:** `useLazySection` hook (IntersectionObserver-based)
- **Chart:** Recharts loaded via `React.lazy(() => import('./ImpactChart'))`

### Code Splitting (Vite manual chunks)

- `react-vendor` — React, ReactDOM, React Router
- `firebase-vendor` — Firebase services
- `3d-vendor` — Three.js, R3F, Drei
- `charts-vendor` — Recharts, D3
- `maps-vendor` — Leaflet, React Leaflet
- `motion-vendor` — Framer Motion
- `icons-vendor` — Lucide React
- `i18n-vendor` — i18next, react-i18next

### GovernmentNavbar

- 3-category mega menu: Research (12 divisions), Regional (5), Supporting (4)
- Text-only dropdowns — no icons
- Desktop: 680px wide mega menu with color-coded category headers
- Mobile: 3 expandable sub-groups

---

## Key Rules

1. **No icons on division detail pages** — intentionally removed for clean typography-driven design
2. **Always use NARA brand colors** (`nara-navy`, `nara-blue`) — never arbitrary colors
3. **Always use `font-headline`** (Space Grotesk) for section headings
4. **Division hub vs detail pages** — hub is dark theme, detail pages are light
5. **Dev server runs on port 4028** — use `npm start`, not `npm run dev`
6. **Framer Motion** for animations — `whileInView` with `viewport={{ once: true }}`
7. **Trilingual support** — always consider en/si/ta when adding text content

---

## Common Commands

```bash
npm start                    # Dev server (port 4028)
npm run build                # Production build with sourcemaps
npm run lint                 # ESLint check
npm run serve                # Preview production build
npm run validate:localization # Check translation files
npm run translate            # Auto-translate daily content
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.0 | UI framework |
| vite | 7.1.10 | Build tool + dev server |
| tailwindcss | 3.4.6 | Utility-first CSS |
| framer-motion | 12.23.16 | Animations |
| firebase | 12.4.0 | Auth + Firestore |
| react-router-dom | 6.0.2 | Client-side routing |
| i18next | 25.6.0 | Internationalization |
| recharts | 2.15.4 | Data visualization |
| lucide-react | 0.484.0 | Icons (NOT used on division pages) |
| three | 0.160.1 | 3D graphics |
| leaflet | 1.9.4 | Maps |

---

## Byterover MCP

You are given two tools from Byterover MCP server, including:

### 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

### 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase
