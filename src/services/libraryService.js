import { auth, db } from '../lib/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit as firestoreLimit,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';

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

const isLocalLibraryApiUnavailable = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  const isLocalPage = host === 'localhost' || host === '127.0.0.1';
  return API_BASE_URL.includes('localhost') && !isLocalPage;
};

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
    if (isLocalLibraryApiUnavailable()) {
      throw new Error('Library API is not configured for this deployment');
    }

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
    if (error.message === 'Library API is not configured for this deployment') {
      console.warn('[Library] API not configured; using Firebase/static fallback where available');
    } else {
      console.error('API request error:', error);
    }
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
// SHARED HELPERS (used by static fallbacks)
// ============================================

/** Parse an author value that may be a plain string, JSON string, or object. */
const parseAuthorName = (author) => {
  if (!author) return '';
  if (typeof author === 'object') return author.name || '';
  if (typeof author === 'string' && author.startsWith('{')) {
    try { return JSON.parse(author).name || author; } catch { return author; }
  }
  return author;
};

/** Client-side sort for the static catalogue. Mirrors the catalogue page's SORT_OPTIONS. */
const sortCatalogueItems = (items, sort) => {
  if (!Array.isArray(items) || !sort || sort === 'relevance') return items;
  const arr = [...items];
  const year = (i) => parseInt(i.publication_year) || 0;
  switch (sort) {
    case 'title_asc':  return arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'title_desc': return arr.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'year_desc':  return arr.sort((a, b) => year(b) - year(a));
    case 'year_asc':   return arr.sort((a, b) => year(a) - year(b));
    case 'author_asc': return arr.sort((a, b) => parseAuthorName(a.author).localeCompare(parseAuthorName(b.author)));
    default:           return arr;
  }
};

const toDateValue = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === 'function') return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeLibraryDate = (value) => {
  const date = toDateValue(value);
  return date ? date.toISOString() : null;
};

const normalizeLoan = (docData) => {
  const dueDate = normalizeLibraryDate(docData.due_date || docData.dueDate || docData.expected_return_date);
  return {
    id: docData.id,
    patron_name: docData.patron_name || docData.member_name || docData.userName || docData.email || 'Unknown patron',
    patron_number: docData.patron_number || docData.member_id || docData.uid || '',
    item_title: docData.item_title || docData.bookTitle || docData.title || docData.barcode || 'Untitled item',
    title: docData.title || docData.item_title || docData.bookTitle || 'Untitled item',
    barcode: docData.barcode || docData.bookBarcode || '',
    checkout_date: normalizeLibraryDate(docData.checkout_date || docData.checkoutDate || docData.createdAt) || new Date().toISOString(),
    due_date: dueDate || new Date().toISOString(),
    status: docData.status || 'active',
    ...docData,
  };
};

const getCollectionDocs = async (collectionName, constraints = []) => {
  const ref = collection(db, collectionName);
  const snapshot = await getDocs(constraints.length ? query(ref, ...constraints) : ref);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

const safeGetCollectionDocs = async (collectionName, constraints = []) => {
  try {
    return await getCollectionDocs(collectionName, constraints);
  } catch (error) {
    console.warn(`[Library] Firestore fallback unavailable for ${collectionName}:`, error.message);
    return [];
  }
};

const getFirestoreActiveLoans = async () => {
  const loans = await safeGetCollectionDocs('book_loans');
  return loans
    .map(normalizeLoan)
    .filter((loan) => !['returned', 'cancelled', 'closed'].includes(String(loan.status || '').toLowerCase()));
};

const getFirestoreOverdueLoans = async () => {
  const now = Date.now();
  const loans = await getFirestoreActiveLoans();
  return loans
    .filter((loan) => {
      const due = toDateValue(loan.due_date);
      return due && due.getTime() < now;
    })
    .map((loan) => {
      const due = toDateValue(loan.due_date);
      const daysOverdue = due ? Math.max(1, Math.ceil((now - due.getTime()) / (1000 * 60 * 60 * 24))) : 0;
      return {
        ...loan,
        days_overdue: daysOverdue,
      };
    });
};

const getFirestoreHolds = async (status) => {
  const holds = await safeGetCollectionDocs('libraryHolds');
  return holds
    .filter((hold) => !status || hold.status === status)
    .map((hold) => ({
      id: hold.id,
      patron_name: hold.patron_name || hold.userName || hold.userEmail || hold.userId || 'Unknown patron',
      patron_number: hold.patron_number || hold.userId || '',
      item_title: hold.item_title || hold.bookTitle || hold.itemId || 'Untitled item',
      hold_date: normalizeLibraryDate(hold.hold_date || hold.createdAt) || new Date().toISOString(),
      expiry_date: normalizeLibraryDate(hold.expiry_date || hold.expiresAt),
      status: hold.status || 'waiting',
      ...hold,
    }));
};

const getFirestoreFines = async (status) => {
  const fines = await safeGetCollectionDocs('libraryFines');
  return fines
    .filter((fine) => !status || fine.status === status)
    .map((fine) => ({
      id: fine.id,
      patron_name: fine.patron_name || fine.userName || fine.userEmail || fine.userId || 'Unknown patron',
      patron_number: fine.patron_number || fine.userId || '',
      item_title: fine.item_title || fine.bookTitle || fine.itemId || 'Untitled item',
      fine_amount: fine.fine_amount || fine.amount || 0,
      status: fine.status || 'unpaid',
      ...fine,
    }));
};

const getFallbackPatronCategories = () => ({
  success: true,
  data: [
    { id: 'public', name: 'Free Reader', max_loans: 3, loan_period_days: 7 },
    { id: 'student', name: 'Student', max_loans: 5, loan_period_days: 14 },
    { id: 'researcher', name: 'Researcher', max_loans: 10, loan_period_days: 30 },
  ],
});

const mapLibraryUserToPatron = (libraryUser) => {
  const firstName = libraryUser.profile?.firstName || libraryUser.first_name || '';
  const lastName = libraryUser.profile?.lastName || libraryUser.last_name || '';
  const role = libraryUser.role || 'public';
  return {
    id: libraryUser.id,
    firebase_uid: libraryUser.uid || libraryUser.id,
    patron_number: libraryUser.libraryCard?.cardNumber || libraryUser.patron_number || libraryUser.id,
    first_name: firstName,
    last_name: lastName,
    email: libraryUser.email || '',
    phone: libraryUser.profile?.phoneNumber || libraryUser.phone || '',
    patron_category_id: role,
    category_name: role === 'student' ? 'Student' : role === 'researcher' ? 'Researcher' : 'Free Reader',
    status: libraryUser.status || libraryUser.libraryCard?.status || 'active',
    created_at: normalizeLibraryDate(libraryUser.accountCreatedAt),
    ...libraryUser,
  };
};

const getFirestorePatrons = async (params = {}) => {
  const users = await safeGetCollectionDocs('libraryUsers');
  let patrons = users.map(mapLibraryUserToPatron);

  if (params.search) {
    const search = String(params.search).toLowerCase();
    patrons = patrons.filter((patron) => [
      patron.patron_number,
      patron.first_name,
      patron.last_name,
      patron.email,
      patron.phone,
    ].some((value) => String(value || '').toLowerCase().includes(search)));
  }

  if (params.category_id) {
    patrons = patrons.filter((patron) => patron.patron_category_id === params.category_id);
  }

  const page = parseInt(params.page, 10) || 1;
  const limit = parseInt(params.limit, 10) || 20;
  const total = patrons.length;
  const start = (page - 1) * limit;

  return {
    patrons: patrons.slice(start, start + limit),
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    page,
  };
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

        // Sorting
        filtered = sortCatalogueItems(filtered, params.sort);

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
    try {
      return await apiRequest(`/circulation/renew/${transactionId}`, {
        method: 'POST',
      });
    } catch (error) {
      const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      await updateDoc(doc(db, 'book_loans', transactionId), {
        due_date: dueDate,
        updatedAt: serverTimestamp(),
      });
      return { success: true, data: { id: transactionId, due_date: dueDate }, source: 'firestore' };
    }
  },

  /**
   * Get all active loans
   */
  getActiveLoans: async () => {
    try {
      return await apiRequest('/circulation/active-loans');
    } catch (error) {
      const data = await getFirestoreActiveLoans();
      return { success: true, data, source: 'firestore' };
    }
  },

  /**
   * Get patron's active loans
   */
  getPatronActiveLoans: async (patronId) => {
    try {
      return await apiRequest(`/circulation/active-loans/patron/${patronId}`);
    } catch (error) {
      const data = (await getFirestoreActiveLoans()).filter((loan) => loan.uid === patronId || loan.userId === patronId || loan.firebase_uid === patronId);
      return { success: true, data, source: 'firestore' };
    }
  },

  /**
   * Get overdue items
   */
  getOverdueItems: async () => {
    try {
      return await apiRequest('/circulation/overdue');
    } catch (error) {
      const data = await getFirestoreOverdueLoans();
      return { success: true, data, source: 'firestore' };
    }
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
    try {
      return await apiRequest(`/circulation/history/patron/${patronId}`);
    } catch (error) {
      const data = (await safeGetCollectionDocs('borrowing_history'))
        .filter((record) => record.uid === patronId || record.userId === patronId || record.firebase_uid === patronId)
        .map(normalizeLoan);
      return { success: true, data, source: 'firestore' };
    }
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
    try {
      return await apiRequest('/circulation/holds', {
        method: 'POST',
        body: JSON.stringify({ patron_id: patronId, item_id: itemId }),
      });
    } catch (error) {
      const docRef = await addDoc(collection(db, 'libraryHolds'), {
        userId: patronId,
        itemId,
        status: 'waiting',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, data: { id: docRef.id }, source: 'firestore' };
    }
  },

  /**
   * Get all holds
   */
  getAllHolds: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    try {
      return await apiRequest(`/circulation/holds${queryString}`);
    } catch (error) {
      const data = await getFirestoreHolds(status);
      return { success: true, data, source: 'firestore' };
    }
  },

  /**
   * Get patron holds
   */
  getPatronHolds: async (patronId) => {
    try {
      return await apiRequest(`/circulation/holds/patron/${patronId}`);
    } catch (error) {
      const data = (await getFirestoreHolds()).filter((hold) => hold.userId === patronId || hold.patron_id === patronId);
      return { success: true, data, source: 'firestore' };
    }
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
    try {
      return await apiRequest(`/circulation/holds/${holdId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      });
    } catch (error) {
      await updateDoc(doc(db, 'libraryHolds', holdId), {
        status,
        notes: notes || null,
        updatedAt: serverTimestamp(),
      });
      return { success: true, data: { id: holdId, status }, source: 'firestore' };
    }
  },

  /**
   * Cancel hold
   */
  cancelHold: async (holdId) => {
    try {
      return await apiRequest(`/circulation/holds/${holdId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      await deleteDoc(doc(db, 'libraryHolds', holdId));
      return { success: true, data: { id: holdId }, source: 'firestore' };
    }
  },

  /**
   * Get all fines
   */
  getAllFines: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    try {
      return await apiRequest(`/circulation/fines${queryString}`);
    } catch (error) {
      const data = await getFirestoreFines(status);
      return { success: true, data, source: 'firestore' };
    }
  },

  /**
   * Get patron fines
   */
  getPatronFines: async (patronId) => {
    try {
      return await apiRequest(`/circulation/fines/patron/${patronId}`);
    } catch (error) {
      const data = (await getFirestoreFines()).filter((fine) => fine.userId === patronId || fine.patron_id === patronId);
      return { success: true, data, source: 'firestore' };
    }
  },

  /**
   * Pay fine
   */
  payFine: async (fineId, amount, paymentMethod, paymentReference) => {
    try {
      return await apiRequest(`/circulation/fines/${fineId}/pay`, {
        method: 'POST',
        body: JSON.stringify({
          amount,
          payment_method: paymentMethod,
          payment_reference: paymentReference,
        }),
      });
    } catch (error) {
      const paymentAmount = typeof amount === 'object' ? amount.amount : amount;
      await updateDoc(doc(db, 'libraryFines', fineId), {
        status: 'paid',
        paid_amount: Number(paymentAmount || 0),
        payment_method: paymentMethod || 'manual',
        payment_reference: paymentReference || null,
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, data: { id: fineId, status: 'paid' }, source: 'firestore' };
    }
  },

  /**
   * Waive fine
   */
  waiveFine: async (fineId, reason) => {
    try {
      return await apiRequest(`/circulation/fines/${fineId}/waive`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    } catch (error) {
      await updateDoc(doc(db, 'libraryFines', fineId), {
        status: 'waived',
        waived_reason: typeof reason === 'string' ? reason : 'Waived by library staff',
        waivedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, data: { id: fineId, status: 'waived' }, source: 'firestore' };
    }
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
    try {
      return await apiRequest(`/patrons?${queryString}`);
    } catch (error) {
      const data = await getFirestorePatrons(params);
      return { success: true, data, source: 'firestore' };
    }
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
    try {
      return await apiRequest(`/patrons/firebase/${uid}`);
    } catch (error) {
      const patrons = await getFirestorePatrons({ limit: 1000 });
      const patron = patrons.patrons.find((item) => item.firebase_uid === uid || item.uid === uid);
      return { success: true, data: patron || null, source: 'firestore' };
    }
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
    try {
      return await apiRequest(`/patrons/${id}/statistics`);
    } catch (error) {
      const activeLoans = (await getFirestoreActiveLoans()).filter((loan) => loan.uid === id || loan.userId === id || loan.firebase_uid === id);
      const holds = (await getFirestoreHolds()).filter((hold) => hold.userId === id || hold.uid === id);
      const fines = (await getFirestoreFines()).filter((fine) => fine.userId === id || fine.uid === id);
      return {
        success: true,
        data: {
          active_loans: activeLoans.length,
          active_holds: holds.length,
          unpaid_fines: fines.reduce((sum, fine) => sum + Number(fine.fine_amount || fine.amount || 0), 0),
          total_borrowed: 0,
        },
        source: 'firestore',
      };
    }
  },

  /**
   * Get patron categories
   */
  getPatronCategories: async () => {
    try {
      return await apiRequest('/patrons/categories/all');
    } catch (error) {
      return getFallbackPatronCategories();
    }
  },

  /**
   * Generate patron number
   */
  generatePatronNumber: async () => {
    try {
      return await apiRequest('/patrons/generate/patron-number');
    } catch (error) {
      return {
        success: true,
        data: {
          patron_number: `NARA-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        },
        source: 'client',
      };
    }
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

        // Sorting
        finalFiltered = sortCatalogueItems(finalFiltered, params.sort);

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
   * Get related items.
   * Falls back to the static catalogue (related by material type + shared
   * subject headings) so the "Related" section works in production.
   */
  getRelatedItems: async (itemId, limit = 5) => {
    const result = await publicApiRequest(`/search/related/${itemId}?limit=${limit}`);
    if (result.success && Array.isArray(result.data) && result.data.length) {
      return result;
    }

    const catalogue = await fetchStaticCatalogue();
    if (!catalogue) return { success: true, data: [] };

    const base = catalogue.find(b => String(b.id) === String(itemId));
    if (!base) return { success: true, data: [] };

    const baseSubjects = new Set(
      (base.subject_headings || []).map(s => String(s).toLowerCase())
    );

    const scored = catalogue
      .filter(b => String(b.id) !== String(itemId))
      .map(b => {
        let score = 0;
        if (b.material_type_code && b.material_type_code === base.material_type_code) score += 1;
        const subs = (b.subject_headings || []).map(s => String(s).toLowerCase());
        score += subs.filter(s => baseSubjects.has(s)).length * 2;
        if (b.publication_year && base.publication_year && b.publication_year === base.publication_year) score += 0.5;
        return { b, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.b);

    return { success: true, data: scored };
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
    try {
      return await apiRequest(`/acquisitions?${queryString}`);
    } catch (error) {
      return { success: true, data: [], source: 'fallback' };
    }
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
    try {
      return await apiRequest(`/acquisitions/suppliers/all${queryString}`);
    } catch (error) {
      return { success: true, data: [], source: 'fallback' };
    }
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
    try {
      return await apiRequest(`/acquisitions/reports/budget?${queryString}`);
    } catch (error) {
      return {
        success: true,
        data: {
          total_budget: 0,
          total_spent: 0,
          remaining: 0,
          by_category: [],
        },
        source: 'fallback',
      };
    }
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
    try {
      return await apiRequest('/reports/dashboard');
    } catch (error) {
      const catalogue = await fetchStaticCatalogue();
      const patrons = await safeGetCollectionDocs('libraryUsers');
      const activeLoans = await getFirestoreActiveLoans();
      const overdueItems = await getFirestoreOverdueLoans();
      const holds = await getFirestoreHolds();
      const fines = await getFirestoreFines('unpaid');
      const downloads = await safeGetCollectionDocs('library_downloads');
      const today = new Date().toISOString().slice(0, 10);
      const todayDownloads = downloads.filter((item) => normalizeLibraryDate(item.downloadedAt)?.startsWith(today));

      return {
        success: true,
        data: {
          totalItems: Array.isArray(catalogue) ? catalogue.length : 0,
          totalPatrons: patrons.length,
          activeLoans: activeLoans.length,
          overdueItems: overdueItems.length,
          todayCheckouts: activeLoans.filter((loan) => loan.checkout_date?.startsWith(today)).length,
          todayCheckins: 0,
          pendingHolds: holds.filter((hold) => ['waiting', 'pending', 'ready'].includes(String(hold.status || '').toLowerCase())).length,
          unpaidFines: fines.reduce((sum, fine) => sum + Number(fine.fine_amount || fine.amount || 0), 0),
          todayDownloads: todayDownloads.length,
        },
        source: 'firestore',
      };
    }
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

const checkoutItem = async (data) => {
  try {
    return await apiRequest('/circulation/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    const dueDate = data.due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const docRef = await addDoc(collection(db, 'book_loans'), {
      patron_number: data.patron_number || '',
      patron_name: data.patron_name || data.patron_number || 'Library patron',
      barcode: data.barcode || '',
      item_title: data.item_title || data.barcode || 'Library item',
      checkout_date: new Date().toISOString(),
      due_date: dueDate,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, data: { id: docRef.id, due_date: dueDate }, source: 'firestore' };
  }
};

const checkinItem = async (data) => {
  try {
    return await apiRequest('/circulation/checkin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    const snapshot = await getDocs(query(
      collection(db, 'book_loans'),
      where('barcode', '==', data.barcode),
      firestoreLimit(10)
    ));
    const activeLoan = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .find((loan) => !['returned', 'cancelled', 'closed'].includes(String(loan.status || '').toLowerCase()));

    if (activeLoan) {
      await updateDoc(doc(db, 'book_loans', activeLoan.id), {
        status: 'returned',
        checkin_date: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });
    }

    return {
      success: true,
      data: {
        id: activeLoan?.id || null,
        fine_amount: 0,
      },
      source: 'firestore',
    };
  }
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
  getActiveLoans: circulationService.getActiveLoans,
  getOverdueItems: circulationService.getOverdueItems,
  getAllHolds: circulationService.getAllHolds,
  getAllFines: circulationService.getAllFines,
  checkoutItem,
  checkinItem,
  renewItem: circulationService.renewItem,
  payFine: circulationService.payFine,
  waiveFine: circulationService.waiveFine,
  cancelHold: circulationService.cancelHold,
  getPatronActiveLoans: circulationService.getPatronActiveLoans,
  getPatronBorrowingHistory: circulationService.getPatronHistory,
  getPatronHolds: circulationService.getPatronHolds,
  getPatronFines: circulationService.getPatronFines,
  getAllPatrons: patronService.getAllPatrons,
  getPatronByFirebaseUid: patronService.getPatronByFirebaseUid,
  getPatronStatistics: patronService.getPatronStatistics,
  getPatronCategories: patronService.getPatronCategories,
  generatePatronNumber: patronService.generatePatronNumber,
  createPatron: patronService.createPatron,
  updatePatron: patronService.updatePatron,
  deletePatron: patronService.deletePatron,
};
