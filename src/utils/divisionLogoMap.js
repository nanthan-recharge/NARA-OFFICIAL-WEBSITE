/**
 * Division Logo Mapping
 * Maps division IDs to their emblem logo paths in /public/division-logos/
 */

const LOGO_MAP = {
  // Research Divisions (11)
  'environmental-studies': '/division-logos/environmental-studies.webp',
  'fishing-technology': '/division-logos/fishing-technology.webp',
  'inland-aquaculture': '/division-logos/inland-aquaculture.webp',
  'post-harvest': '/division-logos/post-harvest.webp',
  'marine-biology': '/division-logos/marine-biology.webp',
  'oceanography': '/division-logos/oceanography.webp',
  'hydrography': '/division-logos/hydrography.webp',
  'socio-economics': '/division-logos/socio-economics.webp',
  'monitoring-evaluation': '/division-logos/monitoring-evaluation.webp',
  'aquaculture-center': '/division-logos/aquaculture-center.webp',
  'technology-transfer': '/division-logos/technology-transfer.webp',

  // Supporting Divisions (4)
  'administration': '/division-logos/administration.webp',
  'finance': '/division-logos/finance.webp',
  'service-operations': '/division-logos/service-operations.webp',
  'internal-audit': '/division-logos/internal-audit.webp',

  // Regional Centers (5)
  'regional-kadolkele': '/division-logos/regional-kadolkele.webp',
  'regional-kalpitiya': '/division-logos/regional-kalpitiya.webp',
  'regional-kapparathota': '/division-logos/regional-kapparathota.webp',
  'regional-panapitiya': '/division-logos/regional-panapitiya.webp',
  'regional-rekawa': '/division-logos/regional-rekawa.webp',
};

export const getDivisionLogo = (divisionId) => LOGO_MAP[divisionId] || null;
export const hasDivisionLogo = (divisionId) => !!LOGO_MAP[divisionId];

/**
 * Category tabs config with trilingual labels
 */
export const DIVISION_TABS = [
  {
    key: 'research',
    label: { en: 'Research Divisions', si: 'පර්යේෂණ අංශ', ta: 'ஆராய்ச்சி பிரிவுகள்' },
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'regional',
    label: { en: 'Regional Centers', si: 'කලාපීය මධ්‍යස්ථාන', ta: 'பிராந்திய மையங்கள்' },
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    key: 'supporting',
    label: { en: 'Supporting Divisions', si: 'සහාය අංශ', ta: 'ஆதரவு பிரிவுகள்' },
    gradient: 'from-amber-500 to-orange-500',
  },
];
