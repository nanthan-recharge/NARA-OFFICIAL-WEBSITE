#!/usr/bin/env node
/**
 * migrate-seo-head.mjs
 *
 * Replaces all <Helmet> usage with <SEOHead> across page files.
 * - Swaps the import from react-helmet to SEOHead component
 * - Replaces <Helmet>…</Helmet> JSX blocks with <SEOHead … /> self-closing tags
 */

import fs from 'fs';
import path from 'path';

const PAGES_DIR = path.resolve('src/pages');

// Page-specific SEO configuration
// key = relative file path from src/pages/
const PAGE_SEO_CONFIG = {
    'fish-advisory-system/index.jsx': {
        title: 'Fish Advisory System',
        description: 'Real-time fish advisories, fishing zone maps, and market prices for Sri Lankan fisheries.',
        pagePath: '/fish-advisory-system',
        keywords: 'fish advisory, fishing zones, market prices, Sri Lanka fishing, NARA',
    },
    'contact-us/index.jsx': {
        title: 'Contact Us',
        description: 'Get in touch with NARA - National Aquatic Resources Research and Development Agency, Sri Lanka.',
        pagePath: '/contact-us',
        keywords: 'contact NARA, Sri Lanka marine research, aquatic resources contact',
    },
    'analytics-hub/index.jsx': {
        title: 'Analytics Hub',
        description: 'AI-powered marine analytics dashboards featuring predictive models, impact assessments, and economic valuations.',
        pagePath: '/analytics',
        keywords: 'marine analytics, AI predictions, impact assessment, economic valuation, NARA',
    },
    'analytics-hub/EconomicValuationDashboard.jsx': {
        title: 'Economic Valuation Dashboard',
        description: 'Economic valuation tools for marine resources and blue economy analysis in Sri Lanka.',
        pagePath: '/analytics/economic-valuation',
        keywords: 'economic valuation, blue economy, marine resources, Sri Lanka',
    },
    'analytics-hub/ImpactAssessmentPortal.jsx': {
        title: 'Impact Assessment Portal',
        description: 'Environmental and policy impact assessment tools for Sri Lankan aquatic resources.',
        pagePath: '/analytics/impact-assessment',
        keywords: 'impact assessment, environmental policy, marine impact, NARA',
    },
    'analytics-hub/PredictiveAnalyticsDashboard.jsx': {
        title: 'Predictive Analytics Dashboard',
        description: 'AI-driven predictive analytics for fisheries, ocean conditions, and marine ecosystems.',
        pagePath: '/analytics/predictive',
        keywords: 'predictive analytics, AI fisheries, ocean forecasting, NARA',
    },
    'analytics-hub/PolicySimulatorInterface.jsx': {
        title: 'Policy Simulator',
        description: 'Simulate marine and fisheries policy outcomes with AI-powered scenario modeling.',
        pagePath: '/analytics/policy-simulator',
        keywords: 'policy simulator, fisheries policy, scenario modeling, NARA',
    },
    'marine-forecast/MarineForecastPortal.jsx': {
        title: 'Marine Forecast Portal',
        description: 'Real-time marine weather forecasts, ocean conditions, and sea state predictions for Sri Lanka.',
        pagePath: '/marine-forecast',
        keywords: 'marine forecast, ocean weather, sea conditions, Sri Lanka',
    },
    'marine-incident-portal/index.jsx': {
        title: 'Marine Incident Portal',
        description: 'Report and track marine incidents, emergencies, and maritime safety events around Sri Lanka.',
        pagePath: '/marine-incident-portal',
        keywords: 'marine incidents, maritime safety, emergency reporting, NARA',
    },
    'emergency-response-network/index.jsx': {
        title: 'Emergency Response Network',
        description: 'Coordinated emergency response for marine and coastal disasters in Sri Lanka.',
        pagePath: '/emergency-response-network',
        keywords: 'emergency response, coastal disasters, marine safety, NARA',
    },
    'research-vessel-booking/index.jsx': {
        title: 'Research Vessel Booking',
        description: 'Book research vessels for marine scientific expeditions and ocean research programs.',
        pagePath: '/research-vessel-booking',
        keywords: 'research vessel, marine expedition, ocean research, NARA',
    },
    'export-market-intelligence/index.jsx': {
        title: 'Export Market Intelligence',
        description: 'Market intelligence and trade analytics for Sri Lankan seafood and marine product exports.',
        pagePath: '/export-market-intelligence',
        keywords: 'export market, seafood trade, marine products, Sri Lanka exports',
    },
    'open-data-portal/index.jsx': {
        title: 'Open Data Portal',
        description: 'Access open datasets on marine science, fisheries, and ocean research from NARA Sri Lanka.',
        pagePath: '/open-data-portal',
        keywords: 'open data, marine datasets, fisheries data, ocean research, NARA',
    },
    'public-consultation-portal/index.jsx': {
        title: 'Public Consultation Portal',
        description: 'Participate in public consultations on marine policies, fisheries regulations, and environmental protection.',
        pagePath: '/public-consultation-portal',
        keywords: 'public consultation, marine policy, fisheries regulations, NARA',
    },
    'regional-impact-network/index.jsx': {
        title: 'Regional Impact Network',
        description: 'Explore NARA\'s regional research centers and their impact on coastal communities across Sri Lanka.',
        pagePath: '/regional-impact-network',
        keywords: 'regional impact, research centers, coastal communities, NARA',
    },
    // Admin pages — noindex
    'admin/AnalyticsAdmin.jsx': {
        title: 'Analytics Admin',
        description: 'Analytics administration panel.',
        pagePath: '/admin/analytics',
        noindex: true,
    },
    'admin/PredictionsAdmin.jsx': {
        title: 'Predictions Admin',
        description: 'Predictions management panel.',
        pagePath: '/admin/analytics/predictions',
        noindex: true,
    },
    'admin/SimulationsEconomicAdmin.jsx': {
        title: 'Simulations & Economic Admin',
        description: 'Simulations and economic data management panel.',
        pagePath: '/admin/analytics/simulations',
        noindex: true,
    },
};

function getRelativeImportPath(filePath) {
    // Count how deep the file is from src/pages
    const relFromPages = path.relative(PAGES_DIR, filePath);
    const depth = relFromPages.split(path.sep).length;
    // Each level is one "../" from the page to src/components/shared
    const ups = '../'.repeat(depth);
    return `${ups}components/shared/SEOHead`;
}

function processFile(filePath) {
    const relPath = path.relative(PAGES_DIR, filePath);
    const config = PAGE_SEO_CONFIG[relPath];

    if (!config) {
        console.log(`  ⏭  No config for ${relPath}, skipping`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Check if it actually uses Helmet
    if (!content.includes("from 'react-helmet'")) {
        console.log(`  ⏭  ${relPath} doesn't import react-helmet, skipping`);
        return false;
    }

    const importPath = getRelativeImportPath(filePath);

    // 1. Replace import
    content = content.replace(
        /import\s*\{\s*Helmet\s*\}\s*from\s*'react-helmet'\s*;?\n?/,
        `import SEOHead from '${importPath}';\n`
    );

    // 2. Replace <Helmet>...</Helmet> block with <SEOHead ... />
    // Build the SEOHead props
    const props = [];
    if (config.title) props.push(`title="${config.title}"`);
    if (config.description) props.push(`description="${config.description}"`);
    if (config.pagePath) props.push(`path="${config.pagePath}"`);
    if (config.keywords) props.push(`keywords="${config.keywords}"`);
    if (config.noindex) props.push(`noindex`);

    const seoHeadTag = `<SEOHead\n          ${props.join('\n          ')}\n        />`;

    // Match the Helmet JSX block (handles multiline)
    const helmetRegex = /\s*<Helmet>\s*\n[\s\S]*?<\/Helmet>/;
    if (helmetRegex.test(content)) {
        content = content.replace(helmetRegex, `\n        ${seoHeadTag}`);
    } else {
        console.log(`  ⚠️  Could not find <Helmet> block in ${relPath}`);
        return false;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ ${relPath}`);
    return true;
}

// Run
console.log('🔄 Migrating Helmet → SEOHead...\n');

let count = 0;
for (const relPath of Object.keys(PAGE_SEO_CONFIG)) {
    const fullPath = path.join(PAGES_DIR, relPath);
    if (fs.existsSync(fullPath)) {
        if (processFile(fullPath)) count++;
    } else {
        console.log(`  ❌ File not found: ${relPath}`);
    }
}

console.log(`\n✅ Migrated ${count} files.`);
