/**
 * Shared fallback data and normalizers for the Research Excellence Portal.
 */

export const RESEARCH_ENHANCED_FALLBACK_PUBLICATIONS = [
  {
    id: 'climate-coral',
    title: 'Climate-Driven Changes in Sri Lankan Coral Reef Ecosystems: A 30-Year Study',
    authors: ['Dr. Priya Fernando', 'Dr. Raj Kumar', 'Dr. Sarah Miller'],
    area: 'Climate Change',
    year: 2024,
    journal: 'Nature Climate Change',
    type: 'Journal Article',
    citations: 342,
    downloads: 1847,
    impactFactor: 29.3,
    abstract:
      'This 30-year longitudinal study examines the effect of rising ocean temperatures on coral reef biodiversity in Sri Lankan waters, with clear adaptation guidance for management agencies.',
    doi: '10.1038/s41558-024-01234-5',
    downloadUrl: '',
    tags: ['Coral Reefs', 'Climate Change', 'Biodiversity', 'Sri Lanka'],
    highlights: [
      '30-year longitudinal dataset for policy planning',
      'Hotspot map for reef degradation risk',
      'Priority intervention recommendations for coastal authorities'
    ]
  },
  {
    id: 'ai-fisheries',
    title: 'Sustainable Fisheries Management Through AI-Powered Stock Assessment',
    authors: ['Dr. Nimal Perera', 'Dr. Chen Wei', 'Dr. Emma Thompson'],
    area: 'Fisheries Management',
    year: 2024,
    journal: 'Science Advances',
    type: 'Journal Article',
    citations: 218,
    downloads: 2134,
    impactFactor: 13.6,
    abstract:
      'This study presents a machine-learning framework for near-real-time fish stock assessment using satellite and acoustic signals, improving prediction reliability for national fisheries controls.',
    doi: '10.1126/sciadv.abcd1234',
    downloadUrl: '',
    tags: ['AI', 'Fisheries', 'Sustainability', 'Remote Sensing'],
    highlights: [
      '43% improvement over baseline stock prediction methods',
      'Tested across 12 coastal management zones',
      'Suitable for operational national advisory systems'
    ]
  },
  {
    id: 'microplastics-indian-ocean',
    title: 'Microplastic Distribution Patterns in the Indian Ocean: A Comprehensive Survey',
    authors: ['Dr. Ayesha Khan', 'Dr. Michael Brown', 'Dr. Lakshmi Dissanayake'],
    area: 'Marine Biology',
    year: 2023,
    journal: 'Environmental Science & Technology',
    type: 'Journal Article',
    citations: 487,
    downloads: 3201,
    impactFactor: 11.4,
    abstract:
      'Systematic sampling across 200+ Indian Ocean locations identifies microplastic concentration hotspots and key source pathways relevant to marine environmental regulation.',
    doi: '10.1021/acs.est.3c12345',
    downloadUrl: '',
    tags: ['Microplastics', 'Pollution', 'Indian Ocean', 'Marine Health'],
    highlights: [
      '200+ sampled locations across priority marine areas',
      'Hotspot prioritization model for cleanup investments',
      'Direct evidence support for pollution control policy'
    ]
  },
  {
    id: 'blue-carbon-valuation',
    title: 'Blue Carbon Sequestration in Mangrove Ecosystems: Economic Valuation',
    authors: ['Dr. Sunil Wickramasinghe', 'Dr. Jane Wilson', 'Dr. Carlos Rodriguez'],
    area: 'Conservation',
    year: 2023,
    journal: 'Nature Sustainability',
    type: 'Journal Article',
    citations: 294,
    downloads: 1652,
    impactFactor: 27.2,
    abstract:
      'The paper quantifies the carbon sequestration capacity of Sri Lankan mangroves and provides an economic valuation model for national climate financing discussions.',
    doi: '10.1038/s41893-023-12345-6',
    downloadUrl: '',
    tags: ['Blue Carbon', 'Mangroves', 'Climate Mitigation', 'Economics'],
    highlights: [
      'National-scale valuation framework',
      'Supports carbon-credit ready project design',
      'Policy-ready recommendations for treasury and environment units'
    ]
  }
];

export const RESEARCH_POLICY_BRIEF_CARDS = [
  {
    id: 'policy-briefs',
    title: 'Policy Briefs & Scientific Evidence',
    description:
      'Access curated policy briefs, technical guidance notes, and decision-ready scientific summaries for ministries and government agencies.',
    icon: 'FileText',
    route: '/scientific-evidence-repository',
    cta: 'Open Evidence Repository'
  },
  {
    id: 'open-datasets',
    title: 'Open Marine Datasets',
    description:
      'Explore validated marine datasets for planning, forecasting, compliance monitoring, and inter-agency analytics.',
    icon: 'Database',
    route: '/open-data-portal',
    cta: 'Open Data Portal'
  },
  {
    id: 'public-consultation',
    title: 'Public Consultation Intelligence',
    description:
      'Track stakeholder submissions and sentiment signals to strengthen policy design and implementation strategies.',
    icon: 'MessageSquare',
    route: '/public-consultation-portal',
    cta: 'View Consultation Insights'
  }
];

export const RESEARCH_PRIORITY_PROGRAMS = [
  {
    id: 'fisheries-resilience',
    title: 'Climate-Resilient Fisheries Management',
    leadAgency: 'NARA + Department of Fisheries',
    status: 'Active',
    timeline: '2025-2028',
    description:
      'Integrated assessments and predictive advisories to improve fish stock resilience and livelihoods under climate stress.',
    route: '/divisions/fishing-technology-division'
  },
  {
    id: 'coastal-water-quality',
    title: 'National Coastal Water Quality Assurance Program',
    leadAgency: 'NARA + Coast Conservation',
    status: 'Operational',
    timeline: 'Ongoing',
    description:
      'Continuous monitoring of priority coastal zones to support environmental compliance, public health, and marine tourism governance.',
    route: '/divisions/environmental-studies-division'
  },
  {
    id: 'marine-biodiversity',
    title: 'Marine Biodiversity Safeguard Initiative',
    leadAgency: 'NARA + Wildlife & Environment',
    status: 'Scaling',
    timeline: '2024-2027',
    description:
      'Conservation intelligence and habitat restoration design for reefs, mangroves, and sensitive marine ecosystems.',
    route: '/divisions/marine-biological-division'
  },
  {
    id: 'ocean-observations',
    title: 'Ocean Observations for National Planning',
    leadAgency: 'NARA + Hydrographic & Disaster Management',
    status: 'Active',
    timeline: '2025-2029',
    description:
      'Operational oceanographic data and forecasting pipelines for navigation safety, preparedness, and blue-economy investments.',
    route: '/divisions/oceanography-marine-sciences-division'
  }
];

export const RESEARCH_DECISION_OUTCOMES = [
  {
    id: 'policy-supports',
    label: 'Policy Support Notes Issued',
    value: '124',
    trend: '+18% YoY',
    description: 'Briefs and technical advisories delivered to government institutions.',
    icon: 'FileCheck'
  },
  {
    id: 'regulatory-actions',
    label: 'Evidence-Informed Regulatory Actions',
    value: '39',
    trend: '+11% YoY',
    description: 'Regulatory or operational decisions supported by NARA outputs.',
    icon: 'ShieldCheck'
  },
  {
    id: 'agency-collaborations',
    label: 'Inter-Agency Research Collaborations',
    value: '52',
    trend: '+9% YoY',
    description: 'Joint programs with ministries, provincial units, and research partners.',
    icon: 'Building2'
  },
  {
    id: 'open-data-usage',
    label: 'Open Data Reuse Cases',
    value: '318',
    trend: '+27% YoY',
    description: 'Confirmed use-cases of NARA datasets in planning and analytics.',
    icon: 'BarChart3'
  }
];

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
};

const asText = (value, fallback = '') => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value.en || value.si || value.ta || fallback;
  }
  return fallback;
};

const toYear = (publicationDate, fallbackYear) => {
  if (fallbackYear) return Number(fallbackYear) || new Date().getFullYear();
  if (!publicationDate) return new Date().getFullYear();
  try {
    return new Date(publicationDate).getFullYear();
  } catch {
    return new Date().getFullYear();
  }
};

export const normalizePublicationFromFirebase = (doc) => {
  const authors = asArray(doc.authors);
  const tags = asArray(doc.tags);
  const downloadUrl = (doc.fileURLs && (doc.fileURLs.en || Object.values(doc.fileURLs)[0])) || doc.fileURL || '';

  return {
    id: doc.id,
    title: asText(doc.title, 'Untitled publication'),
    authors,
    area: doc.category || 'Marine Research',
    year: toYear(doc.publicationDate, doc.year),
    journal: doc.journal || 'NARA Research Archive',
    type: doc.type || 'Research Publication',
    citations: Number(doc.citations || 0),
    downloads: Number(doc.downloads || 0),
    impactFactor: Number(doc.impactFactor || 0),
    abstract: asText(doc.abstract, asText(doc.description, 'No abstract available.')),
    doi: doc.doi || '',
    downloadUrl,
    tags,
    highlights: Array.isArray(doc.highlights) && doc.highlights.length
      ? doc.highlights
      : [
          'Official NARA publication record',
          'Available for policy and technical reference',
          'Source data managed through NARA portal services'
        ],
    source: 'live'
  };
};

export const normalizeFallbackPublication = (publication) => ({
  ...publication,
  authors: asArray(publication.authors),
  tags: asArray(publication.tags),
  highlights: Array.isArray(publication.highlights) ? publication.highlights : [],
  source: 'fallback'
});

export const getFallbackPublications = () =>
  RESEARCH_ENHANCED_FALLBACK_PUBLICATIONS.map(normalizeFallbackPublication);

export const findFallbackPublicationById = (id) => {
  const targetId = decodeURIComponent(String(id || ''));
  const ID_ALIASES = {
    microplastics: 'microplastics-indian-ocean',
    'blue-carbon': 'blue-carbon-valuation'
  };
  const resolvedId = ID_ALIASES[targetId] || targetId;
  return getFallbackPublications().find((item) => String(item.id) === resolvedId) || null;
};

export const createReaderContentFromPublication = (publication) => {
  const normalized = normalizeFallbackPublication(publication);
  return {
    id: normalized.id,
    title: { en: normalized.title, si: normalized.title, ta: normalized.title },
    abstract: { en: normalized.abstract, si: normalized.abstract, ta: normalized.abstract },
    fullContent: {
      en: normalized.abstract,
      si: normalized.abstract,
      ta: normalized.abstract
    },
    authors: normalized.authors,
    publicationDate: `${normalized.year}-01-01`,
    year: normalized.year,
    journal: normalized.journal,
    volume: '',
    issue: '',
    pages: '',
    doi: normalized.doi,
    fileURL: normalized.downloadUrl || '',
    fileName: normalized.title,
    fileURLs: normalized.downloadUrl ? { en: normalized.downloadUrl } : {},
    tags: normalized.tags,
    views: normalized.citations,
    downloads: normalized.downloads,
    bookmarks: 0,
    status: 'published',
    source: 'fallback'
  };
};
