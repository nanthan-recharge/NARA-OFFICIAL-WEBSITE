import React from 'react';
import { Helmet } from 'react-helmet';

const SITE_NAME = 'NARA - National Aquatic Resources Research & Development Agency';
const SITE_URL = 'https://nara-web-73384.web.app';
const DEFAULT_OG_IMAGE = '/og-default.png';
const DEFAULT_DESCRIPTION = "Sri Lanka's premier ocean research institute advancing marine science, sustainable fishing, and blue economy development.";
const TWITTER_HANDLE = '@NABOREASLK';

/**
 * SEOHead — Drop-in component for full SEO coverage.
 *
 * @param {string}  title        – Page title (auto-suffixed with " | NARA Sri Lanka")
 * @param {string}  description  – Unique meta description (≤ 160 chars ideal)
 * @param {string}  path         – Page path e.g. "/fish-advisory-system"
 * @param {string}  [image]      – OG image path (relative or absolute)
 * @param {string}  [type]       – og:type, defaults to "website"
 * @param {string}  [locale]     – og:locale, defaults to "en_US"
 * @param {boolean} [noindex]    – Set true for admin/auth pages to block indexing
 * @param {Array}   [breadcrumbs] – Array of {name, path} for BreadcrumbList schema
 * @param {object}  [jsonLd]     – Additional JSON-LD schema to inject
 * @param {string}  [keywords]   – Meta keywords
 */
const SEOHead = ({
    title,
    description,
    path = '/',
    image,
    type = 'website',
    locale = 'en_US',
    noindex = false,
    breadcrumbs,
    jsonLd,
    keywords,
}) => {
    const fullTitle = title ? `${title} | NARA Sri Lanka` : SITE_NAME;
    const metaDescription = description || DEFAULT_DESCRIPTION;
    const canonicalUrl = `${SITE_URL}${path}`;
    const ogImage = image
        ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
        : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

    // Organization schema (shown on every page)
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'GovernmentOrganization',
        name: 'National Aquatic Resources Research and Development Agency',
        alternateName: 'NARA',
        url: SITE_URL,
        logo: `${SITE_URL}/assets/nara-logo.png`,
        description: DEFAULT_DESCRIPTION,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Crow Island, Colombo 15',
            addressLocality: 'Colombo',
            addressCountry: 'LK',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+94-11-2521000',
            contactType: 'customer service',
            availableLanguage: ['English', 'Sinhala', 'Tamil'],
        },
        sameAs: [
            'https://www.facebook.com/NARAdigitalocean',
            'https://twitter.com/NABOREASLK',
        ],
    };

    // WebSite schema with search (homepage only)
    const websiteSchema = path === '/' ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    } : null;

    // Breadcrumb schema
    const breadcrumbSchema = breadcrumbs?.length ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            ...breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: crumb.name,
                item: `${SITE_URL}${crumb.path}`,
            })),
        ],
    } : null;

    return (
        <Helmet>
            {/* Core Meta */}
            <html lang="en" />
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            )}

            {/* Keywords */}
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="NARA Sri Lanka" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content={locale} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={TWITTER_HANDLE} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={ogImage} />

            {/* Google specific */}
            <meta name="google" content="notranslate" />
            <meta name="googlebot" content="index, follow" />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            {websiteSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(websiteSchema)}
                </script>
            )}
            {breadcrumbSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;
