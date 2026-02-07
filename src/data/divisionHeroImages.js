/**
 * Division Hero Images Configuration
 * One approved local hero image per division
 */
export const DIVISION_HERO_IMAGES = {
  'environmental-studies': ['/division-hero-images/environmental-studies.webp'],
  'fishing-technology': ['/division-hero-images/fishing-technology.webp'],
  'inland-aquaculture': ['/division-hero-images/inland-aquaculture.webp'],
  'post-harvest': ['/division-hero-images/post-harvest.webp'],
  'marine-biology': ['/division-hero-images/marine-biology.webp'],
  'oceanography': ['/division-hero-images/oceanography.webp'],
  'hydrography': ['/division-hero-images/hydrography.webp'],
  'socio-economics': ['/division-hero-images/socio-economics.webp'],
  'monitoring-evaluation': ['/division-hero-images/monitoring-evaluation.webp'],
  'aquaculture-center': ['/division-hero-images/aquaculture-center.webp'],
  'administration': ['/division-hero-images/administration.webp'],
  'finance': ['/division-hero-images/finance.webp'],
  'service-operations': ['/division-hero-images/service-operations.webp'],
  'internal-audit': ['/division-hero-images/internal-audit.webp'],
  'technology-transfer': ['/division-hero-images/technology-transfer.webp'],
  'regional-kadolkele': ['/division-hero-images/regional-kadolkele.webp'],
  'regional-kalpitiya': ['/division-hero-images/regional-kalpitiya.webp'],
  'regional-kapparathota': ['/division-hero-images/regional-kapparathota.webp'],
  'regional-panapitiya': ['/division-hero-images/regional-panapitiya.webp'],
  'regional-rekawa': ['/division-hero-images/regional-rekawa.webp'],
};

/**
 * Get hero images for a division
 * @param {string} divisionId - Division identifier
 * @returns {array} Array of image URLs
 */
export const getDivisionHeroImages = (divisionId) => {
  return DIVISION_HERO_IMAGES[divisionId] || ['/division-hero-images/nara-generic.webp'];
};

/**
 * Get random hero image for a division
 * @param {string} divisionId - Division identifier
 * @returns {string} Random image URL
 */
export const getRandomHeroImage = (divisionId) => {
  const images = getDivisionHeroImages(divisionId);
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

export default DIVISION_HERO_IMAGES;
