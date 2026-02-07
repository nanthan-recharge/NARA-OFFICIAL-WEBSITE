/**
 * Category Grouping System for NARA Digital Library
 * Organizes 26 material types into logical hierarchies
 */

export const CATEGORY_GROUPS = {
  academic: {
    id: 'academic',
    name: 'Academic Resources',
    icon: 'GraduationCap',
    color: 'from-purple-500 to-purple-700',
    description: 'Theses, dissertations, reference books, and academic collections',
    categories: ['THESIS', 'RBOOK', 'SREF', 'PREF', 'LBOOK', 'SLBOOK', 'UACOL']
  },
  research: {
    id: 'research',
    name: 'Research Publications',
    icon: 'Microscope',
    color: 'from-blue-500 to-cyan-700',
    description: 'Research papers, reports, and scientific publications',
    categories: ['RNARA', 'RPAPER', 'BOBP', 'FAO', 'IWMI', 'IOC']
  },
  periodicals: {
    id: 'periodicals',
    name: 'Periodicals & Serials',
    icon: 'Newspaper',
    color: 'from-orange-500 to-red-600',
    description: 'Journals, newspapers, proceedings, and serial publications',
    categories: ['JR', 'NEWS', 'PROC']
  },
  maps: {
    id: 'maps',
    name: 'Maps & Spatial Data',
    icon: 'Map',
    color: 'from-green-500 to-emerald-700',
    description: 'Physical maps, digital maps, and geospatial resources',
    categories: ['MAP', 'DMAP']
  },
  digital: {
    id: 'digital',
    name: 'Digital Resources',
    icon: 'Monitor',
    color: 'from-indigo-500 to-purple-600',
    description: 'E-books, digital media, and online resources',
    categories: ['EBOOK', 'CD', 'EJART', 'EREP']
  },
  special: {
    id: 'special',
    name: 'Special Collections',
    icon: 'Archive',
    color: 'from-amber-500 to-orange-600',
    description: 'Acts, archives, and unique collections',
    categories: ['ACT', 'ATC', 'SLREP', 'WFISH']
  }
};

/**
 * Get the group for a specific material type
 */
export function getCategoryGroup(materialTypeCode) {
  for (const [groupKey, group] of Object.entries(CATEGORY_GROUPS)) {
    if (group.categories.includes(materialTypeCode)) {
      return group;
    }
  }
  return null;
}

/**
 * Get all material types in a group
 */
export function getMaterialTypesInGroup(groupId) {
  const group = CATEGORY_GROUPS[groupId];
  return group ? group.categories : [];
}

/**
 * Get statistics for each category group
 */
export function getCategoryGroupStats(facets) {
  const stats = {};

  for (const [groupKey, group] of Object.entries(CATEGORY_GROUPS)) {
    let totalCount = 0;

    group.categories.forEach(categoryCode => {
      const categoryData = facets.material_types.find(f => f.code === categoryCode);
      if (categoryData) {
        totalCount += categoryData.count || 0;
      }
    });

    stats[groupKey] = {
      ...group,
      totalCount,
      categoryCount: group.categories.length
    };
  }

  return stats;
}

/**
 * Search suggestions based on popular queries
 */
export const POPULAR_SEARCHES = [
  { query: 'marine biodiversity', icon: 'Fish', color: 'text-blue-600' },
  { query: 'fisheries management', icon: 'Anchor', color: 'text-cyan-600' },
  { query: 'ocean research', icon: 'Waves', color: 'text-teal-600' },
  { query: 'sustainable development', icon: 'Leaf', color: 'text-green-600' },
  { query: 'climate change', icon: 'CloudRain', color: 'text-slate-600' },
  { query: 'coastal management', icon: 'MapPin', color: 'text-amber-600' }
];

/**
 * Featured collections
 */
export const FEATURED_COLLECTIONS = [
  {
    id: 'nara_research',
    title: 'NARA Research Excellence',
    description: 'Cutting-edge research from NARA scientists',
    materialTypes: ['RNARA'],
    icon: 'TrendingUp',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'academic',
    title: 'Academic Resources',
    description: 'Theses, dissertations, and scholarly works',
    materialTypes: ['THESIS', 'RBOOK'],
    icon: 'GraduationCap',
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'special',
    title: 'Special Collections',
    description: 'Rare documents, archives, and historical materials',
    materialTypes: ['ATC', 'ACT'],
    icon: 'Archive',
    color: 'from-amber-500 to-orange-600'
  }
];

/**
 * Get breadcrumb path for navigation
 */
export function getBreadcrumbPath(groupId, materialTypeCode) {
  const breadcrumbs = [
    { label: 'Library', path: '/library' }
  ];

  if (groupId) {
    const group = CATEGORY_GROUPS[groupId];
    if (group) {
      breadcrumbs.push({
        label: group.name,
        path: `/library?group=${groupId}`
      });
    }
  }

  if (materialTypeCode) {
    breadcrumbs.push({
      label: materialTypeCode,
      path: `/library?material_type=${materialTypeCode}`
    });
  }

  return breadcrumbs;
}

export default {
  CATEGORY_GROUPS,
  getCategoryGroup,
  getMaterialTypesInGroup,
  getCategoryGroupStats,
  POPULAR_SEARCHES,
  FEATURED_COLLECTIONS,
  getBreadcrumbPath
};
