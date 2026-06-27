/**
 * Per-route SEO content for static prerendering (scripts/prerender.mjs).
 *
 * Each entry produces a crawler-visible build/<path>.html with its own title,
 * description, canonical, Open Graph/Twitter tags, JSON-LD and an H1 + summary
 * + key links block. Edit titles (≤ ~60 chars) and descriptions (≤ ~160 chars)
 * here when page content changes. The home page "/" keeps the main index.html.
 */
export const SITE = {
  base: 'https://nara-web-73384.web.app',
  name: 'NARA — National Aquatic Resources Research & Development Agency',
  shortName: 'NARA Sri Lanka',
  image: '/og-nara-logo.png',
};

export const SEO_ROUTES = [
  // ── About & organisation ──
  { path: '/about-nara-our-story', schemaType: 'AboutPage', title: 'About NARA', description: "NARA's history, mandate, and leadership — Sri Lanka's national institute for aquatic and marine research, established under the NARA Act No. 54 of 1981.", h1: 'About NARA', summary: 'The National Aquatic Resources Research and Development Agency (NARA) is Sri Lanka’s apex body for aquatic and marine research, established under the NARA Act No. 54 of 1981 and based at Crow Island, Colombo 15.' },
  { path: '/divisions', schemaType: 'CollectionPage', title: 'Research & Operational Divisions', description: 'Explore NARA’s divisions: Marine Biology, Oceanography, Fishing Technology, Inland Aquaculture, Hydrography, Environmental Studies, Socio-Economics and regional centres.', h1: 'NARA Divisions', summary: 'NARA delivers its mandate through specialised research and operational divisions and regional research centres across Sri Lanka.' },
  { path: '/audiences', schemaType: 'WebPage', title: 'Who We Serve', description: 'How NARA serves ministries, provincial authorities, the fishing and maritime industry, researchers, and the public across Sri Lanka.', h1: 'Who NARA Serves', summary: 'NARA’s services are organised for ministries, provincial authorities, industry operators, the research community and the general public.' },
  { path: '/contact-us', schemaType: 'ContactPage', title: 'Contact NARA', description: 'Contact the National Aquatic Resources Research and Development Agency (NARA), Crow Island, Colombo 15, Sri Lanka — phone, email and office locations.', h1: 'Contact NARA', summary: 'Reach NARA’s operations and policy desks for marine services, research collaboration, and public enquiries.' },
  { path: '/nara-act', schemaType: 'WebPage', title: 'NARA Act No. 54 of 1981', description: 'The legal mandate establishing the National Aquatic Resources Research and Development Agency of Sri Lanka.', h1: 'NARA Act No. 54 of 1981', summary: 'NARA was established under the NARA Act No. 54 of 1981 as Sri Lanka’s national focal point for aquatic and marine research and development.' },

  // ── Government & regulatory services ──
  { path: '/government-services-portal', schemaType: 'GovernmentService', title: 'Government Services Portal', description: 'Apply for marine permits and licences, submit Environmental Impact Assessments, and report marine emergencies through NARA’s government services hub.', h1: 'NARA Government Services Portal', summary: 'A single hub for NARA regulatory, operational and scientific services — EIA applications, digital marine licensing, emergency reporting and data exports.' },
  { path: '/marine-incident-portal', schemaType: 'GovernmentService', title: 'Marine Incident & Emergency Reporting', description: 'Report oil spills, illegal fishing, coastal hazards and marine incidents to NARA for rapid operational response.', h1: 'Marine Incident & Emergency Reporting', summary: 'Report marine emergencies — oil spills, illegal fishing and coastal hazards — for immediate intake and dispatch.' },
  { path: '/public-consultation-portal', schemaType: 'GovernmentService', title: 'Public Consultation & Compliance', description: 'Participate in public consultations and view compliance, inspection and enforcement records for Sri Lanka’s marine sector.', h1: 'Public Consultation & Compliance', summary: 'Track environmental and operational compliance and take part in public consultation on marine matters.' },
  { path: '/emergency-response-network', schemaType: 'GovernmentService', title: 'Emergency Response Network', description: 'NARA’s coordinated marine emergency response network for spills, hazards and incidents around Sri Lanka.', h1: 'Marine Emergency Response Network', summary: 'A coordinated network for rapid response to marine emergencies and coastal hazards.' },
  { path: '/procurement-recruitment-portal', schemaType: 'WebPage', title: 'Procurement & Recruitment', description: 'NARA tenders, procurement notices and recruitment opportunities for the marine research sector.', h1: 'Procurement & Recruitment', summary: 'Current tenders, procurement notices and career opportunities at NARA.' },
  { path: '/vacancies', schemaType: 'WebPage', title: 'Careers & Vacancies', description: 'Current job openings and career opportunities at NARA, Sri Lanka’s national aquatic resources research agency.', h1: 'Careers at NARA', summary: 'Explore current vacancies and join Sri Lanka’s national marine research agency.' },

  // ── Ocean data & forecasts ──
  { path: '/live-ocean-data', schemaType: 'WebPage', title: 'Live Ocean Data', description: 'Real-time sea-state, temperature, waves and ocean conditions around Sri Lanka from NARA’s ocean observation network.', h1: 'Live Ocean Data', summary: 'Real-time ocean conditions — sea-state, temperature and waves — for Sri Lankan waters.' },
  { path: '/marine-forecast', schemaType: 'WebPage', title: 'Marine Forecast & Risk Outlook', description: 'Sea and weather forecasts and operational marine risk outlook for safe planning in Sri Lankan waters.', h1: 'Marine Forecast & Risk Outlook', summary: 'Sea-state, weather and operational risk forecasts for fishing and maritime operations.' },
  { path: '/fish-advisory-system', schemaType: 'WebPage', title: 'Fish Advisory & Safety Guidance', description: 'Fishing-zone advisories, safety guidance and data-backed alerts for safer marine operations in Sri Lanka.', h1: 'Fish Advisory & Safety Guidance', summary: 'Fishing-zone advisories and safety guidance for safer, data-backed marine operations.' },
  { path: '/live-vessel-tracking', schemaType: 'WebPage', title: 'Live Vessel Tracking', description: 'Track maritime vessel positions and movements in Sri Lankan waters with NARA’s live vessel tracking.', h1: 'Live Vessel Tracking', summary: 'Real-time maritime vessel positions and movements around Sri Lanka.' },
  { path: '/weather-dashboard', schemaType: 'WebPage', title: 'Marine Weather Dashboard', description: 'Live marine weather conditions, wind, waves and forecasts for Sri Lanka’s coastal and offshore zones.', h1: 'Marine Weather Dashboard', summary: 'Live coastal and offshore marine weather, wind and wave conditions.' },
  { path: '/stormglass-maritime', schemaType: 'WebPage', title: 'Maritime Conditions (Stormglass)', description: 'Detailed maritime weather and sea-state data for Sri Lankan waters.', h1: 'Maritime Conditions', summary: 'Detailed maritime weather and sea-state data for planning marine operations.' },
  { path: '/nasa-ocean-color', schemaType: 'WebPage', title: 'NASA Ocean Color Data', description: 'Satellite ocean-colour and chlorophyll data for Sri Lankan waters, integrated by NARA.', h1: 'Ocean Colour & Chlorophyll', summary: 'Satellite ocean-colour and chlorophyll observations for Sri Lankan waters.' },
  { path: '/marine-spatial-planning-viewer', schemaType: 'WebPage', title: 'Marine Spatial Planning Viewer', description: 'Interactive marine spatial planning maps and zoning for Sri Lanka’s ocean and coastal resources.', h1: 'Marine Spatial Planning Viewer', summary: 'Interactive maps for marine spatial planning, zoning and coastal resource management.' },
  { path: '/open-data-portal', schemaType: 'Dataset', title: 'Open Data Portal', description: 'Download open marine and fisheries datasets published by NARA for research, policy and industry use.', h1: 'NARA Open Data Portal', summary: 'Open, downloadable marine and fisheries datasets for research, policy and industry.' },

  // ── Research, library & knowledge ──
  { path: '/library', schemaType: 'CollectionPage', title: 'Research Library', description: 'Search NARA’s research library — peer-reviewed studies, reports, e-books, theses and technical papers on marine science and fisheries.', h1: 'NARA Research Library', summary: 'A searchable catalogue of peer-reviewed studies, reports, e-books, theses and technical papers across every marine discipline.' },
  { path: '/scientific-evidence-repository', schemaType: 'CollectionPage', title: 'Scientific Evidence Repository', description: 'Policy-relevant scientific evidence and publications from NARA for Sri Lanka’s marine and fisheries sector.', h1: 'Scientific Evidence Repository', summary: 'Policy-relevant scientific evidence and publications supporting marine decision-making.' },
  { path: '/knowledge-discovery-center', schemaType: 'WebPage', title: 'Knowledge Discovery Center', description: 'Search and discover across NARA’s research, data and knowledge resources in one place.', h1: 'Knowledge Discovery Center', summary: 'Unified search and discovery across NARA’s research, datasets and knowledge resources.' },
  { path: '/digital-product-library', schemaType: 'CollectionPage', title: 'Digital Product Library', description: 'NARA digital products, tools and resources for the marine and fisheries community.', h1: 'Digital Product Library', summary: 'Digital products, tools and resources produced by NARA.' },
  { path: '/lab-results', schemaType: 'WebPage', title: 'Laboratory Testing & Results', description: 'NARA laboratory testing and analytical services for water quality, seafood safety and marine samples.', h1: 'Laboratory Testing & Results', summary: 'Accredited laboratory testing and analytical services for marine and aquatic samples.' },
  { path: '/research-vessel-booking', schemaType: 'GovernmentService', title: 'Research Vessel Booking', description: 'Request the use of NARA research vessels for marine surveys, sampling and scientific expeditions.', h1: 'Research Vessel Booking', summary: 'Request NARA research vessels for surveys, sampling and scientific expeditions.' },
  { path: '/research-collaboration-platform', schemaType: 'WebPage', title: 'Research Collaboration Platform', description: 'Develop multi-stakeholder research and implementation programmes with NARA divisions and partners.', h1: 'Research Collaboration Platform', summary: 'Build joint research and implementation programmes with NARA divisions and partners.' },
  { path: '/learning-development-academy', schemaType: 'WebPage', title: 'Learning & Development Academy', description: 'NARA training programmes, workshops and capacity development for the marine and fisheries sector.', h1: 'Learning & Development Academy', summary: 'Training, workshops and capacity development for the marine and fisheries sector.' },
  { path: '/aqua-school-directory', schemaType: 'WebPage', title: 'Aqua School Directory', description: 'Directory of aquatic education and school outreach programmes supported by NARA.', h1: 'Aqua School Directory', summary: 'A directory of aquatic education and school outreach programmes.' },
  { path: '/annual-reports', schemaType: 'CollectionPage', title: 'Annual Reports & Publications', description: 'Download NARA annual reports, performance reports and official publications.', h1: 'Annual Reports & Publications', summary: 'NARA annual reports, performance reports and official publications.' },

  // ── Economy, partnerships & programmes ──
  { path: '/export-market-intelligence', schemaType: 'WebPage', title: 'Export Market Intelligence', description: 'Seafood and fisheries export market intelligence and trade insights for Sri Lanka’s blue economy.', h1: 'Export Market Intelligence', summary: 'Seafood export market intelligence and trade insights for the blue economy.' },
  { path: '/regional-impact-network', schemaType: 'WebPage', title: 'Regional Impact Network', description: 'NARA’s regional research centres and their impact across Sri Lanka’s coastal communities.', h1: 'Regional Impact Network', summary: 'How NARA’s regional centres deliver impact across coastal Sri Lanka.' },
  { path: '/partnership-innovation-gateway', schemaType: 'WebPage', title: 'Partnership & Innovation Gateway', description: 'Partner with NARA on marine innovation, technology transfer and joint ventures.', h1: 'Partnership & Innovation Gateway', summary: 'Partnerships, technology transfer and innovation opportunities with NARA.' },
  { path: '/project-pipeline-tracker', schemaType: 'WebPage', title: 'Project Pipeline Tracker', description: 'Track NARA research and development projects, milestones and timelines.', h1: 'Project Pipeline Tracker', summary: 'Live status of NARA research and development projects and milestones.' },
  { path: '/integration-systems-platform', schemaType: 'WebPage', title: 'Integration Systems Platform', description: 'NARA’s systems-integration platform connecting marine data services and partners.', h1: 'Integration Systems Platform', summary: 'Connecting NARA’s marine data services, systems and partners.' },
  { path: '/nara-digital-marketplace', schemaType: 'WebPage', title: 'NARA Digital Marketplace', description: 'Marine products, services and resources available through the NARA digital marketplace.', h1: 'NARA Digital Marketplace', summary: 'Marine products, services and resources from NARA and partners.' },
  { path: '/analytics', schemaType: 'WebPage', title: 'Analytics & Insights', description: 'Marine and fisheries analytics and performance insights from NARA.', h1: 'Analytics & Insights', summary: 'Marine and fisheries analytics and performance insights.' },

  // ── News & media ──
  { path: '/nara-news-updates-center', schemaType: 'CollectionPage', title: 'News & Updates', description: 'Latest news, announcements and updates from NARA Sri Lanka.', h1: 'NARA News & Updates', summary: 'The latest news, announcements and updates from NARA.' },
  { path: '/news', schemaType: 'CollectionPage', title: 'News', description: 'Latest news and announcements from NARA, Sri Lanka’s national aquatic resources research agency.', h1: 'NARA News', summary: 'Latest news and announcements from NARA.' },
  { path: '/media-gallery', schemaType: 'CollectionPage', title: 'Media Gallery', description: 'Photos and videos of NARA research, events and marine activities.', h1: 'Media Gallery', summary: 'Photos and videos of NARA research, events and marine activities.' },
  { path: '/media-press-kit', schemaType: 'WebPage', title: 'Media & Press Kit', description: 'Logos, brand assets and press resources for media covering NARA.', h1: 'Media & Press Kit', summary: 'Brand assets and press resources for media covering NARA.' },
  { path: '/podcasts', schemaType: 'CollectionPage', title: 'Podcasts', description: 'NARA podcasts on marine science, ocean conservation and the blue economy.', h1: 'NARA Podcasts', summary: 'Audio programmes on marine science, ocean conservation and the blue economy.' },

  // ── Legal, policy & site ──
  { path: '/site-map', schemaType: 'WebPage', title: 'Site Map', description: 'Browse all pages and services on the NARA website.', h1: 'Site Map', summary: 'A complete index of pages and services on the NARA website.' },
  { path: '/accessibility-statement', schemaType: 'WebPage', title: 'Accessibility Statement', description: 'NARA’s commitment to an accessible website for all users, including people with disabilities.', h1: 'Accessibility Statement', summary: 'NARA’s commitment to digital accessibility for all users.' },
  { path: '/privacy-policy', schemaType: 'WebPage', title: 'Privacy Policy', description: 'How NARA collects, uses and protects personal data on its website and services.', h1: 'Privacy Policy', summary: 'How NARA collects, uses and protects your personal data.' },
  { path: '/cookie-policy', schemaType: 'WebPage', title: 'Cookie Policy', description: 'How the NARA website uses cookies and how you can manage them.', h1: 'Cookie Policy', summary: 'How the NARA website uses cookies and how to manage your preferences.' },
  { path: '/terms-of-use', schemaType: 'WebPage', title: 'Terms of Use', description: 'Terms and conditions for using the NARA website and online services.', h1: 'Terms of Use', summary: 'The terms and conditions governing use of the NARA website and services.' },
  { path: '/security-policy', schemaType: 'WebPage', title: 'Security Policy', description: 'NARA’s website and information security policy and responsible disclosure.', h1: 'Security Policy', summary: 'NARA’s information security policy and responsible disclosure guidance.' },
  { path: '/data-subject-rights', schemaType: 'WebPage', title: 'Data Subject Rights', description: 'Your data protection rights and how to exercise them with NARA.', h1: 'Data Subject Rights', summary: 'Your data protection rights and how to exercise them.' },
  { path: '/rti', schemaType: 'WebPage', title: 'Right to Information (RTI)', description: 'Request information from NARA under Sri Lanka’s Right to Information Act.', h1: 'Right to Information (RTI)', summary: 'Request information from NARA under the Right to Information Act.' },
  { path: '/rti-disclosure', schemaType: 'WebPage', title: 'RTI Proactive Disclosure', description: 'NARA’s proactively disclosed information under the Right to Information Act.', h1: 'RTI Proactive Disclosure', summary: 'Information proactively published by NARA under the RTI Act.' },
];

// A few high-value links shown in every prerendered page's crawlable nav.
export const KEY_LINKS = [
  { path: '/about-nara-our-story', label: 'About NARA' },
  { path: '/government-services-portal', label: 'Government Services' },
  { path: '/library', label: 'Research Library' },
  { path: '/open-data-portal', label: 'Open Data Portal' },
  { path: '/live-ocean-data', label: 'Live Ocean Data' },
  { path: '/divisions', label: 'Divisions' },
  { path: '/news', label: 'News' },
  { path: '/contact-us', label: 'Contact' },
];
