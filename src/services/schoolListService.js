import * as XLSX from 'xlsx';

/**
 * School List Service
 * Handles fetching and parsing school data from Firebase Storage or static files
 */

const CACHE_KEY = 'nara_school_list_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch school list from Firebase Storage URL
 * @param {string} storageUrl - Firebase Storage URL for the Excel file
 * @returns {Promise<Array>} Array of school objects
 */
export const fetchSchoolListFromStorage = async (storageUrl) => {
  try {
    // Check cache first
    const cached = getCachedData();
    if (cached) {
      console.log('📚 Using cached school list data');
      return cached;
    }

    console.log('📥 Fetching school list from Firebase Storage...');
    
    // Fetch the file
    const response = await fetch(storageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch school list: ${response.statusText}`);
    }

    // Get the file as array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Parse Excel file
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      raw: false, // Keep formatted values
      defval: '' // Default value for empty cells
    });

    console.log(`✅ Parsed ${jsonData.length} schools from Excel file`);
    
    // Cache the data
    cacheData(jsonData);
    
    return jsonData;
  } catch (error) {
    console.error('❌ Error fetching school list:', error);
    throw error;
  }
};

/**
 * Fetch school list from local JSON file
 * @param {string} jsonPath - Path to JSON file (e.g., '/data/school_list.json')
 * @returns {Promise<Array>} Array of school objects
 */
export const fetchSchoolListFromJSON = async (jsonPath) => {
  try {
    const cached = getCachedData();
    if (cached) {
      console.log('📚 Using cached school list data');
      return cached;
    }

    console.log('📥 Fetching school list from JSON...');
    
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch school list: ${response.statusText}`);
    }

    const jsonData = await response.json();
    console.log(`✅ Loaded ${jsonData.length} schools from JSON`);
    
    cacheData(jsonData);
    return jsonData;
  } catch (error) {
    console.error('❌ Error fetching school list:', error);
    throw error;
  }
};

/**
 * Get cached school list data
 * @returns {Array|null} Cached data or null if expired/not found
 */
const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      console.log('⏰ Cache expired, will fetch fresh data');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Cache school list data
 * @param {Array} data - School data to cache
 */
const cacheData = (data) => {
  try {
    const cacheObject = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    console.log('💾 School list cached for 24 hours');
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

/**
 * Clear cached school list
 */
export const clearSchoolListCache = () => {
  localStorage.removeItem(CACHE_KEY);
  console.log('🗑️ School list cache cleared');
};

/**
 * Filter and search schools
 * @param {Array} schools - Array of school objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered schools
 */
export const filterSchools = (schools, filters = {}) => {
  let filtered = [...schools];

  // Search by name or location (handle multiple field name variations)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(school => {
      const name = (school['School Name'] || school.name || school.Name || '').toLowerCase();
      const location = (school.District || school.district || school.Location || school.location || '').toLowerCase();
      return name.includes(searchLower) || location.includes(searchLower);
    });
  }

  // Filter by location/district
  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    filtered = filtered.filter(school => {
      const location = (school.District || school.district || school.Location || school.location || '').toLowerCase();
      return location.includes(locationLower);
    });
  }

  // Filter by year joined
  if (filters.yearFrom) {
    filtered = filtered.filter(school => {
      const year = parseInt(school['Partner Since'] || school.partnerSince || school.Year || school.year);
      return !isNaN(year) && year >= filters.yearFrom;
    });
  }

  // Sort
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      if (filters.sortBy === 'name') {
        const nameA = (a['School Name'] || a.name || a.Name || '');
        const nameB = (b['School Name'] || b.name || b.Name || '');
        return nameA.localeCompare(nameB);
      }
      if (filters.sortBy === 'students') {
        const studentsA = parseInt(a.Students || a.students || a['Number of Students']) || 0;
        const studentsB = parseInt(b.Students || b.students || b['Number of Students']) || 0;
        return studentsB - studentsA;
      }
      if (filters.sortBy === 'year') {
        const yearA = parseInt(a['Partner Since'] || a.partnerSince || a.Year || a.year) || 0;
        const yearB = parseInt(b['Partner Since'] || b.partnerSince || b.Year || b.year) || 0;
        return yearB - yearA;
      }
      return 0;
    });
  }

  return filtered;
};

/**
 * Get statistics from school list
 * @param {Array} schools - Array of school objects
 * @returns {Object} Statistics object
 */
export const getSchoolStatistics = (schools) => {
  return {
    totalSchools: schools.length,
    totalStudents: schools.reduce((sum, school) => sum + (parseInt(school.students) || 0), 0),
    locations: [...new Set(schools.map(s => s.location).filter(Boolean))].length,
    averageStudents: Math.round(
      schools.reduce((sum, school) => sum + (parseInt(school.students) || 0), 0) / schools.length
    )
  };
};
