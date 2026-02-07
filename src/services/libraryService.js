import { auth } from '../lib/firebase';

// API Base URL - should be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_LIBRARY_API_URL || 'http://localhost:5000/api';

// Static catalogue JSON URL (fallback when API is not available)
const CATALOGUE_JSON_URL = import.meta.env.VITE_LIBRARY_CATALOGUE_URL || '/library_catalogue.json';

// Translations catalogue JSON URL
const TRANSLATIONS_CATALOGUE_URL = import.meta.env.VITE_TRANSLATIONS_CATALOGUE_URL || '/translations_catalogue.json';

// Cache for static catalogue data
let catalogueCache = null;
let catalogueCacheTime = null;
let translationsCatalogueCache = null;
let translationsCatalogueCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get Firebase ID token for authenticated requests
 */
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Fetch static catalogue from Firebase Storage
 */
const fetchStaticCatalogue = async () => {
  // Check cache first
  if (catalogueCache && catalogueCacheTime && (Date.now() - catalogueCacheTime < CACHE_DURATION)) {
    console.log('Using cached catalogue data');
    return catalogueCache;
  }

  if (!CATALOGUE_JSON_URL) {
    console.warn('No catalogue JSON URL configured');
    return null;
  }

  try {
    console.log('Fetching static catalogue from:', CATALOGUE_JSON_URL);
    const response = await fetch(CATALOGUE_JSON_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch catalogue: ${response.statusText}`);
    }
    const data = await response.json();

    // Cache the data
    catalogueCache = data;
    catalogueCacheTime = Date.now();

    console.log(`Loaded ${data?.length || 0} items from static catalogue`);
    return data;
  } catch (error) {
    console.error('Failed to fetch static catalogue:', error);
    return null;
  }
};

/**
 * Fetch translations catalogue from static JSON
 */
const fetchTranslationsCatalogue = async () => {
  // Check cache first
  if (translationsCatalogueCache && translationsCatalogueCacheTime && (Date.now() - translationsCatalogueCacheTime < CACHE_DURATION)) {
    console.log('Using cached translations catalogue data');
    return translationsCatalogueCache;
  }

  if (!TRANSLATIONS_CATALOGUE_URL) {
    console.warn('No translations catalogue URL configured');
    return null;
  }

  try {
    console.log('Fetching translations catalogue from:', TRANSLATIONS_CATALOGUE_URL);
    const response = await fetch(TRANSLATIONS_CATALOGUE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch translations catalogue: ${response.statusText}`);
    }
    const data = await response.json();

    // Cache the data
    translationsCatalogueCache = data;
    translationsCatalogueCacheTime = Date.now();

    console.log(`Loaded ${data?.length || 0} items from translations catalogue`);
    return data;
  } catch (error) {
    console.error('Failed to fetch translations catalogue:', error);
    return null;
  }
};

/**
 * Make public API request (no authentication required)
 */
const publicApiRequest = async (endpoint, options = {}) => {
  try {
    // Check if we're in production and API is localhost (not available)
    if (API_BASE_URL.includes('localhost') && window.location.hostname !== 'localhost') {
      throw new Error('API not available in production');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.warn('API request error, using fallback data:', error.message);
    // Return fallback data structure
    return { success: false, data: null, error: error.message };
  }
};

// ============================================
// CATALOGUE SERVICES
// ============================================

export const catalogueService = {
  /**
   * Get all catalogue items
   */
  getAllItems: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const apiResult = await publicApiRequest(`/catalogue?${queryString}`);

    // If API fails, use static catalogue
    if (!apiResult.success) {
      const catalogue = await fetchStaticCatalogue();
      if (catalogue) {
        // Filter by material_type if specified
        let filtered = catalogue;
        if (params.material_type) {
          filtered = catalogue.filter(item =>
            item.material_type_code === params.material_type
          );
        }

        // Pagination
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = filtered.slice(startIndex, endIndex);

        return {
          success: true,
          data: paginatedItems,
          pagination: {
            page,
            limit,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / limit)
          }
        };
      }
    }

    return apiResult;
  },

  /**
   * Get item by ID
   */
  getItemById: async (id) => {
    console.log('[Library] Fetching book ID:', id);
    const apiResult = await publicApiRequest(`/catalogue/${id}`);

    // If API fails, use static catalogue
    if (!apiResult.success) {
      // Check if this is a translated book ID (e.g., "6-sinhala", "6-tamil")
      const isTranslationId = typeof id === 'string' && (id.includes('-sinhala') || id.includes('-tamil'));

      if (isTranslationId) {
        // Search in translations catalogue
        const translationsCatalogue = await fetchTranslationsCatalogue();
        if (translationsCatalogue) {
          const item = translationsCatalogue.find(book => book.id === id);
          if (item) {
            return {
              success: true,
              data: item
            };
          }
        }
      } else {
        // Search in main catalogue
        const catalogue = await fetchStaticCatalogue();
        if (catalogue) {
          // Handle both string and integer IDs
          const item = catalogue.find(book =>
            book.id === id ||
            book.id === parseInt(id) ||
            book.id === String(id)
          );
          if (item) {
            return {
              success: true,
              data: item
            };
          }
        }
      }
      return { success: false, error: 'Item not found' };
    }

    return apiResult;
  },

  /**
   * Get item by barcode
   */
  getItemByBarcode: async (barcode) => {
    return await publicApiRequest(`/catalogue/barcode/${barcode}`);
  },

  /**
   * Create new item (librarian/admin only)
   */
  createItem: async (itemData) => {
    return await apiRequest('/catalogue', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  /**
   * Update item (librarian/admin only)
   */
  updateItem: async (id, updates) => {
    return await apiRequest(`/catalogue/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete item (admin only)
   */
  deleteItem: async (id) => {
    return await apiRequest(`/catalogue/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Bulk import items
   */
  bulkImport: async (items) => {
    return await apiRequest('/catalogue/bulk/import', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  /**
   * Get all material types
   */
  getMaterialTypes: async () => {
    return await publicApiRequest('/catalogue/material-types/all');
  },

  /**
   * Generate unique barcode
   */
  generateBarcode: async () => {
    return await apiRequest('/catalogue/generate/barcode');
  },
};

// ============================================
// CIRCULATION SERVICES
// ============================================

export const circulationService = {
  /**
   * Check out item
   */
  checkOut: async (patronId, itemId, barcode) => {
    return await apiRequest('/circulation/checkout', {
      method: 'POST',
      body: JSON.stringify({ patron_id: patronId, item_id: itemId, barcode }),
    });
  },

  /**
   * Check in item
   */
  checkIn: async (itemId, barcode) => {
    return await apiRequest('/circulation/checkin', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, barcode }),
    });
  },

  /**
   * Renew item
   */
  renewItem: async (transactionId) => {
    return await apiRequest(`/circulation/renew/${transactionId}`, {
      method: 'POST',
    });
  },

  /**
   * Get all active loans
   */
  getActiveLoans: async () => {
    return await apiRequest('/circulation/active-loans');
  },

  /**
   * Get patron's active loans
   */
  getPatronActiveLoans: async (patronId) => {
    return await apiRequest(`/circulation/active-loans/patron/${patronId}`);
  },

  /**
   * Get overdue items
   */
  getOverdueItems: async () => {
    return await apiRequest('/circulation/overdue');
  },

  /**
   * Get transaction history
   */
  getTransactionHistory: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/circulation/history?${queryString}`);
  },

  /**
   * Get patron history
   */
  getPatronHistory: async (patronId) => {
    return await apiRequest(`/circulation/history/patron/${patronId}`);
  },

  /**
   * Get item history
   */
  getItemHistory: async (itemId) => {
    return await apiRequest(`/circulation/history/item/${itemId}`);
  },

  /**
   * Place hold on item
   */
  placeHold: async (patronId, itemId) => {
    return await apiRequest('/circulation/holds', {
      method: 'POST',
      body: JSON.stringify({ patron_id: patronId, item_id: itemId }),
    });
  },

  /**
   * Get all holds
   */
  getAllHolds: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    return await apiRequest(`/circulation/holds${queryString}`);
  },

  /**
   * Get patron holds
   */
  getPatronHolds: async (patronId) => {
    return await apiRequest(`/circulation/holds/patron/${patronId}`);
  },

  /**
   * Get item holds
   */
  getItemHolds: async (itemId) => {
    return await apiRequest(`/circulation/holds/item/${itemId}`);
  },

  /**
   * Update hold status
   */
  updateHold: async (holdId, status, notes) => {
    return await apiRequest(`/circulation/holds/${holdId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  /**
   * Cancel hold
   */
  cancelHold: async (holdId) => {
    return await apiRequest(`/circulation/holds/${holdId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all fines
   */
  getAllFines: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    return await apiRequest(`/circulation/fines${queryString}`);
  },

  /**
   * Get patron fines
   */
  getPatronFines: async (patronId) => {
    return await apiRequest(`/circulation/fines/patron/${patronId}`);
  },

  /**
   * Pay fine
   */
  payFine: async (fineId, amount, paymentMethod, paymentReference) => {
    return await apiRequest(`/circulation/fines/${fineId}/pay`, {
      method: 'POST',
      body: JSON.stringify({
        amount,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
      }),
    });
  },

  /**
   * Waive fine
   */
  waiveFine: async (fineId, reason) => {
    return await apiRequest(`/circulation/fines/${fineId}/waive`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

// ============================================
// PATRON SERVICES
// ============================================

export const patronService = {
  /**
   * Get all patrons
   */
  getAllPatrons: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/patrons?${queryString}`);
  },

  /**
   * Get patron by ID
   */
  getPatronById: async (id) => {
    return await apiRequest(`/patrons/${id}`);
  },

  /**
   * Get patron by Firebase UID
   */
  getPatronByFirebaseUid: async (uid) => {
    return await apiRequest(`/patrons/firebase/${uid}`);
  },

  /**
   * Get patron by patron number
   */
  getPatronByNumber: async (patronNumber) => {
    return await apiRequest(`/patrons/number/${patronNumber}`);
  },

  /**
   * Create patron
   */
  createPatron: async (patronData) => {
    return await apiRequest('/patrons', {
      method: 'POST',
      body: JSON.stringify(patronData),
    });
  },

  /**
   * Update patron
   */
  updatePatron: async (id, updates) => {
    return await apiRequest(`/patrons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete patron
   */
  deletePatron: async (id) => {
    return await apiRequest(`/patrons/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get patron statistics
   */
  getPatronStatistics: async (id) => {
    return await apiRequest(`/patrons/${id}/statistics`);
  },

  /**
   * Get patron categories
   */
  getPatronCategories: async () => {
    return await apiRequest('/patrons/categories/all');
  },

  /**
   * Generate patron number
   */
  generatePatronNumber: async () => {
    return await apiRequest('/patrons/generate/patron-number');
  },
};

// ============================================
// SEARCH SERVICES
// ============================================

// Compute facets from catalogue data
const computeFacetsFromCatalogue = (catalogue) => {
  if (!catalogue || !Array.isArray(catalogue)) {
    return { material_types: [], years: [], languages: [] };
  }

  // Count by material type
  const materialTypeCounts = {};
  const yearCounts = {};
  const languageCounts = {};

  catalogue.forEach(item => {
    // Material types
    if (item.material_type_code) {
      materialTypeCounts[item.material_type_code] = (materialTypeCounts[item.material_type_code] || 0) + 1;
    }

    // Years
    if (item.publication_year) {
      yearCounts[item.publication_year] = (yearCounts[item.publication_year] || 0) + 1;
    }

    // Languages
    if (item.language) {
      languageCounts[item.language] = (languageCounts[item.language] || 0) + 1;
    }
  });

  return {
    material_types: Object.entries(materialTypeCounts).map(([code, count]) => ({ code, count })),
    years: Object.entries(yearCounts)
      .map(([publication_year, count]) => ({ publication_year: parseInt(publication_year), count }))
      .sort((a, b) => b.publication_year - a.publication_year),
    languages: Object.entries(languageCounts).map(([language, count]) => ({ language, count }))
  };
};

// Return empty data when API is not available (no fake data)
const getFallbackFacets = () => ({
  success: true,
  data: {
    material_types: [],
    years: [],
    languages: []
  }
});

const getFallbackPopularItems = () => ({
  success: true,
  data: []
});

export const searchService = {
  /**
   * Full-text search
   */
  search: async (query, params = {}) => {
    const queryString = new URLSearchParams({ q: query, ...params }).toString();
    const result = await publicApiRequest(`/search?${queryString}`);
    if (!result.success) {
      // Fallback to client-side search in static catalogue
      const catalogue = await fetchStaticCatalogue();
      if (catalogue && query) {
        const searchQuery = query.toLowerCase();

        // Search in title, author, subject, keywords, AND translations
        const filtered = catalogue.filter(item => {
          const titleMatch = item.title?.toLowerCase().includes(searchQuery);
          const authorMatch = item.author?.toLowerCase().includes(searchQuery);
          const subjectMatch = item.subject_headings?.some(s => s.toLowerCase().includes(searchQuery));
          const keywordMatch = item.keywords?.some(k => k.toLowerCase().includes(searchQuery));
          const abstractMatch = item.abstract?.toLowerCase().includes(searchQuery);

          // Check if searching for Tamil or Sinhala
          const isTamilSearch = searchQuery.includes('tamil') || searchQuery.includes('தமிழ்');
          const isSinhalaSearch = searchQuery.includes('sinhala') || searchQuery.includes('සිංහල');

          // If searching for translations, only show books with translations
          if (isTamilSearch || isSinhalaSearch) {
            const hasTranslations = item.translations_available && item.translations_available.length > 0;
            if (isTamilSearch) {
              return hasTranslations && item.translations_available.includes('tamil');
            }
            if (isSinhalaSearch) {
              return hasTranslations && item.translations_available.includes('sinhala');
            }
          }

          return titleMatch || authorMatch || subjectMatch || keywordMatch || abstractMatch;
        });

        // Apply additional filters if provided
        let finalFiltered = filtered;
        if (params.material_type) {
          finalFiltered = filtered.filter(item => item.material_type_code === params.material_type);
        }
        if (params.year) {
          finalFiltered = finalFiltered.filter(item => item.publication_year === parseInt(params.year));
        }
        if (params.language) {
          finalFiltered = finalFiltered.filter(item => item.language === params.language);
        }

        // Pagination
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = finalFiltered.slice(startIndex, endIndex);

        return {
          success: true,
          data: paginatedItems,
          pagination: {
            page,
            limit,
            total: finalFiltered.length,
            totalPages: Math.ceil(finalFiltered.length / limit)
          }
        };
      }
      return { success: true, data: [], pagination: { total: 0, page: 1, limit: 20 } };
    }
    return result;
  },

  /**
   * Advanced search
   */
  advancedSearch: async (searchCriteria) => {
    return await publicApiRequest('/search/advanced', {
      method: 'POST',
      body: JSON.stringify(searchCriteria),
    });
  },

  /**
   * Get search facets
   */
  getFacets: async () => {
    const result = await publicApiRequest('/search/facets');
    if (!result.success) {
      // Try to compute facets from static catalogue
      const catalogue = await fetchStaticCatalogue();
      if (catalogue) {
        const facets = computeFacetsFromCatalogue(catalogue);
        return { success: true, data: facets };
      }
      return getFallbackFacets();
    }
    return result;
  },

  /**
   * Get autocomplete suggestions
   */
  getSuggestions: async (query) => {
    return await publicApiRequest(`/search/suggestions?q=${encodeURIComponent(query)}`);
  },

  /**
   * Get popular items
   */
  getPopularItems: async (limit = 10) => {
    const result = await publicApiRequest(`/search/popular?limit=${limit}`);
    if (!result.success) {
      return getFallbackPopularItems();
    }
    return result;
  },

  /**
   * Get new arrivals
   */
  getNewArrivals: async (limit = 10) => {
    const result = await publicApiRequest(`/search/new-arrivals?limit=${limit}`);
    if (!result.success) {
      return getFallbackPopularItems();
    }
    return result;
  },

  /**
   * Get related items
   */
  getRelatedItems: async (itemId, limit = 5) => {
    return await publicApiRequest(`/search/related/${itemId}?limit=${limit}`);
  },

  /**
   * Get Tamil translations (recent books)
   */
  getTamilTranslations: async (limit = 6) => {
    try {
      const translationsCatalogue = await fetchTranslationsCatalogue();
      if (translationsCatalogue) {
        const tamilBooks = translationsCatalogue
          .filter(item => item.translations_available && item.translations_available.includes('tamil'))
          .sort((a, b) => {
            // Sort by translated_at timestamp (most recent first)
            const dateA = a.translations?.tamil?.translated_at || '2000-01-01';
            const dateB = b.translations?.tamil?.translated_at || '2000-01-01';
            return new Date(dateB) - new Date(dateA);
          })
          .slice(0, limit);

        return {
          success: true,
          data: tamilBooks
        };
      }

      // No catalogue available - return empty (no fake data)
      return { success: true, data: [] };
    } catch (error) {
      console.error('Failed to get Tamil translations:', error);
      return { success: false, data: [] };
    }
  },

  /**
   * Get Sinhala translations (recent books)
   */
  getSinhalaTranslations: async (limit = 6) => {
    try {
      const translationsCatalogue = await fetchTranslationsCatalogue();
      if (translationsCatalogue) {
        const sinhalaBooks = translationsCatalogue
          .filter(item => item.translations_available && item.translations_available.includes('sinhala'))
          .sort((a, b) => {
            // Sort by translated_at timestamp (most recent first)
            const dateA = a.translations?.sinhala?.translated_at || '2000-01-01';
            const dateB = b.translations?.sinhala?.translated_at || '2000-01-01';
            return new Date(dateB) - new Date(dateA);
          })
          .slice(0, limit);

        return {
          success: true,
          data: sinhalaBooks
        };
      }

      // No catalogue available - return empty (no fake data)
      return { success: true, data: [] };
    } catch (error) {
      console.error('Failed to get Sinhala translations:', error);
      return { success: false, data: [] };
    }
  },
};

// ============================================
// ACQUISITIONS SERVICES
// ============================================

export const acquisitionsService = {
  /**
   * Get all acquisitions
   */
  getAllAcquisitions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/acquisitions?${queryString}`);
  },

  /**
   * Get acquisition by ID
   */
  getAcquisitionById: async (id) => {
    return await apiRequest(`/acquisitions/${id}`);
  },

  /**
   * Create acquisition
   */
  createAcquisition: async (acquisitionData) => {
    return await apiRequest('/acquisitions', {
      method: 'POST',
      body: JSON.stringify(acquisitionData),
    });
  },

  /**
   * Update acquisition
   */
  updateAcquisition: async (id, updates) => {
    return await apiRequest(`/acquisitions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete acquisition
   */
  deleteAcquisition: async (id) => {
    return await apiRequest(`/acquisitions/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get acquisition items
   */
  getAcquisitionItems: async (id) => {
    return await apiRequest(`/acquisitions/${id}/items`);
  },

  /**
   * Add item to acquisition
   */
  addAcquisitionItem: async (id, itemData) => {
    return await apiRequest(`/acquisitions/${id}/items`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  /**
   * Get all suppliers
   */
  getAllSuppliers: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    return await apiRequest(`/acquisitions/suppliers/all${queryString}`);
  },

  /**
   * Create supplier
   */
  createSupplier: async (supplierData) => {
    return await apiRequest('/acquisitions/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  },

  /**
   * Update supplier
   */
  updateSupplier: async (id, updates) => {
    return await apiRequest(`/acquisitions/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete supplier
   */
  deleteSupplier: async (id) => {
    return await apiRequest(`/acquisitions/suppliers/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get budget report
   */
  getBudgetReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/acquisitions/reports/budget?${queryString}`);
  },
};

// ============================================
// SERIALS SERVICES
// ============================================

export const serialsService = {
  /**
   * Get all serials
   */
  getAllSerials: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    return await publicApiRequest(`/serials${queryString}`);
  },

  /**
   * Get serial by ID
   */
  getSerialById: async (id) => {
    return await publicApiRequest(`/serials/${id}`);
  },

  /**
   * Create serial
   */
  createSerial: async (serialData) => {
    return await apiRequest('/serials', {
      method: 'POST',
      body: JSON.stringify(serialData),
    });
  },

  /**
   * Update serial
   */
  updateSerial: async (id, updates) => {
    return await apiRequest(`/serials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Get serial issues
   */
  getSerialIssues: async (id) => {
    return await apiRequest(`/serials/${id}/issues`);
  },

  /**
   * Create serial issue
   */
  createSerialIssue: async (id, issueData) => {
    return await apiRequest(`/serials/${id}/issues`, {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  },

  /**
   * Get missing issues
   */
  getMissingIssues: async (id) => {
    return await apiRequest(`/serials/${id}/issues/missing`);
  },

  /**
   * Claim missing issue
   */
  claimMissingIssue: async (id, issueId) => {
    return await apiRequest(`/serials/${id}/issues/${issueId}/claim`, {
      method: 'POST',
    });
  },

  /**
   * Get upcoming renewals
   */
  getUpcomingRenewals: async (days = 30) => {
    return await apiRequest(`/serials/renewals/upcoming?days=${days}`);
  },
};

// ============================================
// REPORTS SERVICES
// ============================================

export const reportsService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    return await apiRequest('/reports/dashboard');
  },

  /**
   * Get daily circulation
   */
  getDailyCirculation: async (date) => {
    const queryString = date ? `?date=${date}` : '';
    return await apiRequest(`/reports/circulation/daily${queryString}`);
  },

  /**
   * Get monthly circulation
   */
  getMonthlyCirculation: async (year, month) => {
    const queryString = new URLSearchParams({ year, month }).toString();
    return await apiRequest(`/reports/circulation/monthly?${queryString}`);
  },

  /**
   * Get yearly circulation
   */
  getYearlyCirculation: async (year) => {
    return await apiRequest(`/reports/circulation/yearly?year=${year}`);
  },

  /**
   * Get collection statistics
   */
  getCollectionStatistics: async () => {
    return await apiRequest('/reports/collection/statistics');
  },

  /**
   * Get most borrowed items
   */
  getMostBorrowedItems: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/reports/collection/most-borrowed?${queryString}`);
  },

  /**
   * Get patron statistics
   */
  getPatronStatistics: async () => {
    return await apiRequest('/reports/patrons/statistics');
  },

  /**
   * Get top borrowers
   */
  getTopBorrowers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/reports/patrons/top-borrowers?${queryString}`);
  },

  /**
   * Get fines report
   */
  getFinesReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/reports/financial/fines?${queryString}`);
  },

  /**
   * Get overdue summary
   */
  getOverdueSummary: async () => {
    return await apiRequest('/reports/overdue/summary');
  },

  /**
   * Get overdue detailed
   */
  getOverdueDetailed: async () => {
    return await apiRequest('/reports/overdue/detailed');
  },
};

// ============================================
// SETTINGS SERVICES
// ============================================

export const settingsService = {
  /**
   * Get all settings
   */
  getAllSettings: async () => {
    return await apiRequest('/settings');
  },

  /**
   * Get setting by key
   */
  getSettingByKey: async (key) => {
    return await apiRequest(`/settings/${key}`);
  },

  /**
   * Update setting
   */
  updateSetting: async (key, value, description) => {
    return await apiRequest(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ setting_value: value, description }),
    });
  },

  /**
   * Bulk update settings
   */
  bulkUpdateSettings: async (settings) => {
    return await apiRequest('/settings/bulk', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
  },
};

// Export all services
export default {
  catalogue: catalogueService,
  circulation: circulationService,
  patron: patronService,
  search: searchService,
  acquisitions: acquisitionsService,
  serials: serialsService,
  reports: reportsService,
  settings: settingsService,
};

