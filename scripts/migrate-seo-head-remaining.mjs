#!/usr/bin/env node
/**
 * migrate-seo-head-remaining.mjs
 *
 * Adds <SEOHead> to all page files that don't already have it.
 * These pages had no Helmet usage at all, so we add the import + JSX.
 */

import fs from 'fs';
import path from 'path';

const PAGES_DIR = path.resolve('src/pages');

// Pages that already have SEOHead — SKIP these
const ALREADY_DONE = new Set([
    'fish-advisory-system/index.jsx',
    'contact-us/index.jsx',
    'analytics-hub/index.jsx',
    'analytics-hub/EconomicValuationDashboard.jsx',
    'analytics-hub/ImpactAssessmentPortal.jsx',
    'analytics-hub/PredictiveAnalyticsDashboard.jsx',
    'analytics-hub/PolicySimulatorInterface.jsx',
    'marine-forecast/MarineForecastPortal.jsx',
    'marine-incident-portal/index.jsx',
    'emergency-response-network/index.jsx',
    'research-vessel-booking/index.jsx',
    'export-market-intelligence/index.jsx',
    'open-data-portal/index.jsx',
    'public-consultation-portal/index.jsx',
    'regional-impact-network/index.jsx',
    'admin/AnalyticsAdmin.jsx',
    'admin/PredictionsAdmin.jsx',
    'admin/SimulationsEconomicAdmin.jsx',
]);

// SEO config for remaining pages
const REMAINING_SEO = {
    // ─── Public pages ───────────────────────────────────────────
    'ocean-intelligence-dashboard-homepage/index.jsx': {
        title: 'Ocean Intelligence Dashboard',
        description: "Sri Lanka's premier ocean research institute — real-time marine data, research, and blue economy development by NARA.",
        path: '/',
        keywords: 'NARA, ocean intelligence, marine research, Sri Lanka, blue economy',
    },
    'about-nara-our-story/index.jsx': {
        title: 'About NARA — Our Story',
        description: 'Learn about the National Aquatic Resources Research and Development Agency, its history, mission, and vision for Sri Lanka.',
        path: '/about-nara-our-story',
        keywords: 'about NARA, marine research history, Sri Lanka aquatic agency',
    },
    'nara-act/index.jsx': {
        title: 'NARA Act',
        description: 'The National Aquatic Resources Research and Development Agency Act — legislative framework governing NARA Sri Lanka.',
        path: '/nara-act',
        keywords: 'NARA act, legislation, Sri Lanka marine law',
    },
    'nara-divisions-hub/index.jsx': {
        title: 'NARA Divisions',
        description: 'Explore all research and operational divisions of NARA — fisheries, marine biology, oceanography, and more.',
        path: '/divisions',
        keywords: 'NARA divisions, fisheries research, marine biology, oceanography',
    },
    'division-page/index.jsx': {
        title: 'Division Details',
        description: 'Detailed information about NARA research divisions, their projects, staff, and achievements.',
        path: '/divisions',
        keywords: 'NARA division, research projects, marine science',
    },
    'supporting-divisions/index.jsx': {
        title: 'Supporting Divisions',
        description: 'Support divisions of NARA that enable marine research, administration, and public services.',
        path: '/divisions/supporting',
        keywords: 'supporting divisions, administration, NARA services',
    },
    'regional-centers/index.jsx': {
        title: 'Regional Centers',
        description: "NARA's regional research centers across Sri Lanka fostering coastal community development.",
        path: '/divisions/regional-centers',
        keywords: 'regional centers, coastal research, community development',
    },
    'annual-reports/index.jsx': {
        title: 'Annual Reports',
        description: 'NARA annual reports documenting marine research achievements, financial stewardship, and institutional progress.',
        path: '/annual-reports',
        keywords: 'annual reports, marine research publications, NARA achievements',
    },
    'media-gallery/index.jsx': {
        title: 'Media Gallery',
        description: 'Photos, videos, and media from NARA events, research expeditions, and marine conservation programs.',
        path: '/media-gallery',
        keywords: 'media gallery, marine photos, research videos, NARA events',
    },
    'media-press-kit/index.jsx': {
        title: 'Media & Press Kit',
        description: 'Official NARA press releases, media resources, and brand assets for journalists and partners.',
        path: '/media-press-kit',
        keywords: 'press kit, media resources, NARA press releases',
    },
    'nara-news-updates-center/index.jsx': {
        title: 'News & Updates',
        description: 'Latest news, research updates, and announcements from NARA Sri Lanka.',
        path: '/nara-news-updates-center',
        keywords: 'NARA news, marine research updates, Sri Lanka fisheries news',
    },
    'podcasts/index.jsx': {
        title: 'Podcasts',
        description: 'Listen to NARA podcasts covering marine science, ocean conservation, and fisheries management in Sri Lanka.',
        path: '/podcasts',
        keywords: 'marine podcasts, ocean science, fisheries management, NARA',
    },
    'scientific-evidence-repository/index.jsx': {
        title: 'Scientific Evidence Repository',
        description: 'Access peer-reviewed research papers, datasets, and scientific evidence from NARA marine studies.',
        path: '/scientific-evidence-repository',
        keywords: 'scientific papers, marine research, datasets, evidence repository',
    },
    'research-excellence-portal/index.jsx': {
        title: 'Research Excellence Portal',
        description: 'NARA research excellence — publications, citations, collaborations, and academic achievements.',
        path: '/research-excellence-portal',
        keywords: 'research excellence, publications, marine science, NARA',
    },
    'research-collaboration-platform/index.jsx': {
        title: 'Research Collaboration Platform',
        description: 'Collaborate with NARA researchers on marine science projects, data sharing, and joint studies.',
        path: '/research-collaboration-platform',
        keywords: 'research collaboration, marine science, joint studies, NARA',
    },
    'knowledge-discovery-center/index.jsx': {
        title: 'Knowledge Discovery Center',
        description: 'Discover marine knowledge resources, educational content, and research tools from NARA.',
        path: '/knowledge-discovery-center',
        keywords: 'knowledge center, marine education, research tools, NARA',
    },
    'partnership-innovation-gateway/index.jsx': {
        title: 'Partnership & Innovation Gateway',
        description: 'Explore partnership opportunities and innovation initiatives with NARA Sri Lanka.',
        path: '/partnership-innovation-gateway',
        keywords: 'partnerships, innovation, marine technology, NARA collaboration',
    },
    'government-services-portal/index.jsx': {
        title: 'Government Services Portal',
        description: 'Access government marine services, permits, and regulatory information through NARA.',
        path: '/government-services-portal',
        keywords: 'government services, marine permits, fisheries regulation, NARA',
    },
    'lab-results/index.jsx': {
        title: 'Laboratory Results',
        description: 'View marine laboratory test results, water quality analyses, and environmental monitoring data.',
        path: '/lab-results',
        keywords: 'lab results, water quality, environmental monitoring, NARA',
    },
    'marine-spatial-planning-viewer/index.jsx': {
        title: 'Marine Spatial Planning Viewer',
        description: 'Interactive marine spatial planning maps and ocean zoning data for Sri Lankan waters.',
        path: '/marine-spatial-planning-viewer',
        keywords: 'marine spatial planning, ocean zoning, GIS maps, Sri Lanka',
    },
    'stormglass-maritime/index.jsx': {
        title: 'Maritime Weather Data',
        description: 'Real-time maritime weather data, wave heights, and ocean conditions from Stormglass integration.',
        path: '/stormglass-maritime',
        keywords: 'maritime weather, wave data, ocean conditions, Stormglass',
    },
    'nasa-ocean-color/index.jsx': {
        title: 'NASA Ocean Color Data',
        description: 'Satellite ocean color imagery and chlorophyll data from NASA for Sri Lankan waters.',
        path: '/nasa-ocean-color',
        keywords: 'NASA ocean color, satellite imagery, chlorophyll, remote sensing',
    },
    'openweather-dashboard/index.jsx': {
        title: 'Weather Dashboard',
        description: 'Comprehensive weather dashboard with current conditions, forecasts, and marine weather alerts.',
        path: '/weather-dashboard',
        keywords: 'weather dashboard, marine weather, forecasts, weather alerts',
    },
    'procurement-recruitment-portal/index.jsx': {
        title: 'Procurement & Recruitment',
        description: 'Current procurement tenders and career opportunities at NARA Sri Lanka.',
        path: '/procurement-recruitment-portal',
        keywords: 'procurement, tenders, recruitment, careers, NARA jobs',
    },
    'vacancies/index.jsx': {
        title: 'Vacancies',
        description: 'Current job vacancies and career opportunities at NARA — National Aquatic Resources Research Agency.',
        path: '/vacancies',
        keywords: 'jobs, vacancies, careers, NARA employment',
    },
    'scientist-session/index.jsx': {
        title: 'Scientist Sessions',
        description: 'NARA scientist sessions — research presentations, seminars, and knowledge sharing events.',
        path: '/scientist-session',
        keywords: 'scientist sessions, research seminars, NARA presentations',
    },
    'rti/index.jsx': {
        title: 'Right to Information',
        description: 'Right to Information (RTI) portal — submit information requests to NARA under Sri Lanka RTI Act.',
        path: '/rti',
        keywords: 'RTI, right to information, transparency, NARA',
    },
    'site-map/index.jsx': {
        title: 'Site Map',
        description: 'Complete site map of NARA website — find all pages, services, and resources.',
        path: '/site-map',
        keywords: 'site map, navigation, NARA pages',
    },
    'audiences/index.jsx': {
        title: 'Audience Portal',
        description: 'Tailored resources for different audiences — general public, researchers, students, and industry professionals.',
        path: '/audiences',
        keywords: 'audiences, public resources, researchers, students, industry',
    },
    'aqua-school-directory/index.jsx': {
        title: 'Aqua School Directory',
        description: 'Directory of aquaculture and fisheries schools and training programs in Sri Lanka.',
        path: '/aqua-school-directory',
        keywords: 'aqua school, fisheries training, aquaculture education, Sri Lanka',
    },
    'enhanced-school-directory/index.jsx': {
        title: 'School Directory',
        description: 'Enhanced directory of marine and fisheries educational institutions across Sri Lanka.',
        path: '/enhanced-school-directory',
        keywords: 'school directory, marine education, fisheries institutions',
    },
    'digital-product-library/index.jsx': {
        title: 'Digital Product Library',
        description: 'Browse and download digital publications, maps, datasets, and research tools from NARA.',
        path: '/digital-product-library',
        keywords: 'digital products, publications, datasets, research tools, NARA',
    },
    'nara-digital-marketplace/index.jsx': {
        title: 'NARA Digital Marketplace',
        description: 'Purchase NARA publications, maps, laboratory services, and research products online.',
        path: '/nara-digital-marketplace',
        keywords: 'marketplace, publications, lab services, NARA products',
    },
    'project-pipeline-tracker/index.jsx': {
        title: 'Project Pipeline Tracker',
        description: 'Track ongoing and upcoming NARA research projects, milestones, and progress.',
        path: '/project-pipeline-tracker',
        keywords: 'project tracker, research pipeline, NARA projects',
    },
    'learning-development-academy/index.jsx': {
        title: 'Learning & Development Academy',
        description: 'NARA Learning and Development Academy — marine science courses, certifications, and professional development.',
        path: '/learning-development-academy',
        keywords: 'learning academy, marine courses, professional development, NARA',
    },
    'unified-registration/index.jsx': {
        title: 'Register',
        description: 'Create your NARA account to access research tools, publications, and marine services.',
        path: '/unified-registration',
        keywords: 'register, create account, NARA services',
    },
    'user-profile/index.jsx': {
        title: 'User Profile',
        description: 'Manage your NARA account, preferences, and access settings.',
        path: '/user-profile',
        noindex: true,
    },
    'integration-systems-platform/index.jsx': {
        title: 'Integration Systems Platform',
        description: 'NARA integration systems platform — connecting marine data sources and research tools.',
        path: '/integration-systems-platform',
        keywords: 'integration platform, marine data, API, NARA systems',
    },

    // ─── Auth / Login / Register pages — noindex ───────────────
    'lda-login/index.jsx': {
        title: 'LDA Login',
        description: 'Login to the Learning and Development Academy.',
        path: '/lda-login',
        noindex: true,
    },
    'lda-register/index.jsx': {
        title: 'LDA Register',
        description: 'Register for the Learning and Development Academy.',
        path: '/lda-register',
        noindex: true,
    },
    'library-login/index.jsx': {
        title: 'Library Login',
        description: 'Login to the NARA Library portal.',
        path: '/library-login',
        noindex: true,
    },
    'library-register/index.jsx': {
        title: 'Library Register',
        description: 'Register for the NARA Library.',
        path: '/library-register',
        noindex: true,
    },
    'library-membership-register/index.jsx': {
        title: 'Library Membership',
        description: 'Register for NARA library membership.',
        path: '/library-membership-register',
        noindex: true,
    },
    'checkout/index.jsx': {
        title: 'Checkout',
        description: 'Complete your purchase on NARA Digital Marketplace.',
        path: '/checkout',
        noindex: true,
    },
    'payment-gateway-hub/index.jsx': {
        title: 'Payment Gateway',
        description: 'Secure payment processing for NARA services and products.',
        path: '/payment-gateway-hub',
        noindex: true,
    },
    'payment-return/index.jsx': {
        title: 'Payment Confirmation',
        description: 'Payment confirmation and receipt.',
        path: '/payment/return',
        noindex: true,
    },

    // ─── Library internal pages — noindex ──────────────────────
    'library-catalogue/index.jsx': {
        title: 'Library Catalogue',
        description: 'Browse the NARA library catalogue of marine science publications and references.',
        path: '/library-catalogue',
        keywords: 'library catalogue, marine publications, NARA library',
    },
    'library-dashboard/index.jsx': {
        title: 'Library Dashboard',
        description: 'NARA Library management dashboard.',
        path: '/library-dashboard',
        noindex: true,
    },
    'library-librarian-desk/index.jsx': {
        title: 'Librarian Desk',
        description: 'NARA Library librarian desk for managing collections.',
        path: '/library-librarian-desk',
        noindex: true,
    },
    'library-member-dashboard/index.jsx': {
        title: 'Library Member Dashboard',
        description: 'Your NARA Library member dashboard — loans, reservations, and history.',
        path: '/library-member-dashboard',
        noindex: true,
    },
    'library-research-submit/index.jsx': {
        title: 'Submit Research',
        description: 'Submit your research paper to the NARA library.',
        path: '/library-research-submit',
        noindex: true,
    },

    // ─── Admin pages — noindex ─────────────────────────────────
    'firebase-admin-authentication-portal/index.jsx': {
        title: 'Admin Authentication',
        description: 'NARA admin authentication portal.',
        path: '/firebase-admin-authentication-portal',
        noindex: true,
    },
    'firebase-admin-dashboard-control-center/index.jsx': {
        title: 'Admin Dashboard',
        description: 'NARA admin dashboard control center.',
        path: '/firebase-admin-dashboard-control-center',
        noindex: true,
    },
};

function getRelativeImportPath(filePath) {
    const relFromPages = path.relative(PAGES_DIR, filePath);
    const depth = relFromPages.split(path.sep).length;
    const ups = '../'.repeat(depth);
    return `${ups}components/shared/SEOHead`;
}

function processFile(filePath) {
    const relPath = path.relative(PAGES_DIR, filePath);

    if (ALREADY_DONE.has(relPath)) {
        return false;
    }

    const config = REMAINING_SEO[relPath];
    if (!config) {
        console.log(`  ⏭  No config for ${relPath}, skipping`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has SEOHead
    if (content.includes('SEOHead')) {
        console.log(`  ⏭  ${relPath} already has SEOHead`);
        return false;
    }

    const importPath = getRelativeImportPath(filePath);

    // Build SEOHead tag
    const props = [];
    if (config.title) props.push(`title="${config.title}"`);
    if (config.description) props.push(`description="${config.description.replace(/"/g, '&quot;')}"`);
    if (config.path) props.push(`path="${config.path}"`);
    if (config.keywords) props.push(`keywords="${config.keywords}"`);
    if (config.noindex) props.push(`noindex`);

    const seoTag = `<SEOHead\n        ${props.join('\n        ')}\n      />`;

    // 1. Add import near top of file
    // Find the last import line
    const lines = content.split('\n');
    let lastImportLine = -1;
    for (let i = 0; i < lines.length; i++) {
        if (/^\s*import\s/.test(lines[i])) {
            // Handle multi-line imports
            let j = i;
            while (j < lines.length && !lines[j].includes(';')) j++;
            lastImportLine = j;
        }
    }

    if (lastImportLine === -1) {
        console.log(`  ⚠️  No imports found in ${relPath}`);
        return false;
    }

    // Insert SEOHead import after last import
    lines.splice(lastImportLine + 1, 0, `import SEOHead from '${importPath}';`);
    content = lines.join('\n');

    // 2. Add SEOHead tag after the first element in the return JSX
    // Strategy: find 'return (' or 'return(' then the first JSX opening tag, then insert SEOHead after it

    // Try to insert after the first opening div/section/fragment in return
    const returnMatch = content.match(/return\s*\(\s*\n?\s*(<[^>]+>|<>)/);
    if (returnMatch) {
        const insertPoint = content.indexOf(returnMatch[0]) + returnMatch[0].length;
        content = content.slice(0, insertPoint) + '\n      ' + seoTag + content.slice(insertPoint);
    } else {
        console.log(`  ⚠️  Could not find return JSX insertion point in ${relPath}`);
        return false;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ ${relPath}`);
    return true;
}

// Run
console.log('🔄 Adding SEOHead to remaining pages...\n');

let count = 0;
for (const relPath of Object.keys(REMAINING_SEO)) {
    const fullPath = path.join(PAGES_DIR, relPath);
    if (fs.existsSync(fullPath)) {
        if (processFile(fullPath)) count++;
    } else {
        console.log(`  ❌ File not found: ${relPath}`);
    }
}

console.log(`\n✅ Added SEOHead to ${count} files.`);
