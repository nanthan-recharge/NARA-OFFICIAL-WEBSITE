import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============================================
// Fish Advisories Service
// ============================================

export const fishAdvisoryService = {
  /**
   * Create a new fish advisory
   */
  create: async (advisoryData) => {
    try {
      const docRef = await addDoc(collection(db, 'fish_advisories'), {
        ...advisoryData,
        status: advisoryData.status || 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          ...advisoryData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating fish advisory:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all fish advisories with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      console.log('🐟 Fetching fish advisories with filters:', filters);
      let q = collection(db, 'fish_advisories');
      const constraints = [];

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters.species) {
        constraints.push(where('species', '==', filters.species));
      }

      if (filters.zone) {
        constraints.push(where('zone', '==', filters.zone));
      }

      // Only add orderBy if we have other constraints, to avoid index issues
      if (constraints.length > 0 || filters.limit) {
        constraints.push(orderBy('createdAt', 'desc'));
      }

      if (filters.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      console.log('🐟 Fish advisories snapshot size:', snapshot.size);

      const advisories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        validFrom: doc.data().validFrom?.toDate(),
        validUntil: doc.data().validUntil?.toDate()
      }));

      console.log('🐟 Returning advisories:', advisories.length);
      return { data: advisories, error: null };
    } catch (error) {
      console.error('❌ Error getting fish advisories:', error);
      return { data: [], error };
    }
  },

  /**
   * Get active advisories (status = 'active' and within valid date range)
   */
  getActive: async () => {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, 'fish_advisories'),
        where('status', '==', 'active'),
        where('validUntil', '>=', now),
        orderBy('validUntil', 'asc')
      );

      const snapshot = await getDocs(q);
      const advisories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        validFrom: doc.data().validFrom?.toDate(),
        validUntil: doc.data().validUntil?.toDate()
      }));

      return { data: advisories, error: null };
    } catch (error) {
      console.error('Error getting active fish advisories:', error);
      return { data: [], error };
    }
  },

  /**
   * Get a single fish advisory by ID
   */
  getById: async (advisoryId) => {
    try {
      const docRef = doc(db, 'fish_advisories', advisoryId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Advisory not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
          validFrom: docSnap.data().validFrom?.toDate(),
          validUntil: docSnap.data().validUntil?.toDate()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting fish advisory:', error);
      return { data: null, error };
    }
  },

  /**
   * Update a fish advisory
   */
  update: async (advisoryId, updates) => {
    try {
      const docRef = doc(db, 'fish_advisories', advisoryId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id: advisoryId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating fish advisory:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a fish advisory
   */
  delete: async (advisoryId) => {
    try {
      const docRef = doc(db, 'fish_advisories', advisoryId);
      await deleteDoc(docRef);
      return { data: { id: advisoryId }, error: null };
    } catch (error) {
      console.error('Error deleting fish advisory:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Fishing Zones Service
// ============================================

export const fishingZonesService = {
  /**
   * Create a new fishing zone
   */
  create: async (zoneData) => {
    try {
      const docRef = await addDoc(collection(db, 'fishing_zones'), {
        ...zoneData,
        status: zoneData.status || 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          ...zoneData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating fishing zone:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all fishing zones
   */
  getAll: async (filters = {}) => {
    try {
      console.log('🗺️ Fetching fishing zones with filters:', filters);
      let q = collection(db, 'fishing_zones');
      const constraints = [];

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters.region) {
        constraints.push(where('region', '==', filters.region));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      console.log('🗺️ Fishing zones snapshot size:', snapshot.size);

      const zones = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      console.log('🗺️ Returning zones:', zones.length);
      return { data: zones, error: null };
    } catch (error) {
      console.error('❌ Error getting fishing zones:', error);
      return { data: [], error };
    }
  },

  /**
   * Get a single fishing zone by ID
   */
  getById: async (zoneId) => {
    try {
      const docRef = doc(db, 'fishing_zones', zoneId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Zone not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting fishing zone:', error);
      return { data: null, error };
    }
  },

  /**
   * Update a fishing zone
   */
  update: async (zoneId, updates) => {
    try {
      const docRef = doc(db, 'fishing_zones', zoneId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id: zoneId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating fishing zone:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a fishing zone
   */
  delete: async (zoneId) => {
    try {
      const docRef = doc(db, 'fishing_zones', zoneId);
      await deleteDoc(docRef);
      return { data: { id: zoneId }, error: null };
    } catch (error) {
      console.error('Error deleting fishing zone:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Fish Market Prices Service
// ============================================

export const fishMarketPricesService = {
  /**
   * Create a new price entry
   */
  create: async (priceData) => {
    try {
      const docRef = await addDoc(collection(db, 'fish_market_prices'), {
        ...priceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          ...priceData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating fish market price:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all fish market prices with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'fish_market_prices');
      const constraints = [];

      if (filters.species) {
        constraints.push(where('species', '==', filters.species));
      }

      if (filters.market) {
        constraints.push(where('market', '==', filters.market));
      }

      constraints.push(orderBy('date', 'desc'));

      if (filters.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      const prices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      return { data: prices, error: null };
    } catch (error) {
      console.error('Error getting fish market prices:', error);
      return { data: [], error };
    }
  },

  /**
   * Get latest prices for all species
   */
  getLatest: async (limit = 20) => {
    try {
      console.log('💰 Fetching latest fish market prices, limit:', limit);
      const q = query(
        collection(db, 'fish_market_prices'),
        orderBy('date', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(q);
      console.log('💰 Fish market prices snapshot size:', snapshot.size);

      const prices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      console.log('💰 Returning prices:', prices.length);
      return { data: prices, error: null };
    } catch (error) {
      console.error('❌ Error getting latest fish market prices:', error);
      return { data: [], error };
    }
  },

  /**
   * Get price by ID
   */
  getById: async (priceId) => {
    try {
      const docRef = doc(db, 'fish_market_prices', priceId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Price not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data(),
          date: docSnap.data().date?.toDate(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting fish market price:', error);
      return { data: null, error };
    }
  },

  /**
   * Update a fish market price
   */
  update: async (priceId, updates) => {
    try {
      const docRef = doc(db, 'fish_market_prices', priceId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id: priceId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating fish market price:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a fish market price
   */
  delete: async (priceId) => {
    try {
      const docRef = doc(db, 'fish_market_prices', priceId);
      await deleteDoc(docRef);
      return { data: { id: priceId }, error: null };
    } catch (error) {
      console.error('Error deleting fish market price:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Seasonal Restrictions Service
// ============================================

export const seasonalRestrictionsService = {
  /**
   * Create a new seasonal restriction
   */
  create: async (restrictionData) => {
    try {
      const docRef = await addDoc(collection(db, 'seasonal_restrictions'), {
        ...restrictionData,
        status: restrictionData.status || 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          ...restrictionData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating seasonal restriction:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all seasonal restrictions
   */
  getAll: async (filters = {}) => {
    try {
      console.log('🚫 Fetching seasonal restrictions with filters:', filters);
      let q = collection(db, 'seasonal_restrictions');
      const constraints = [];

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters.species) {
        constraints.push(where('species', '==', filters.species));
      }

      // Only add orderBy if we have filters to avoid index issues
      if (constraints.length > 0 || filters.limit) {
        constraints.push(orderBy('startDate', 'desc'));
      }

      if (filters.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      console.log('🚫 Seasonal restrictions snapshot size:', snapshot.size);

      const restrictions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      console.log('🚫 Returning restrictions:', restrictions.length);
      return { data: restrictions, error: null };
    } catch (error) {
      console.error('❌ Error getting seasonal restrictions:', error);
      return { data: [], error };
    }
  },

  /**
   * Get active restrictions
   */
  getActive: async () => {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, 'seasonal_restrictions'),
        where('status', '==', 'active'),
        where('endDate', '>=', now),
        orderBy('endDate', 'asc')
      );

      const snapshot = await getDocs(q);
      const restrictions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));

      return { data: restrictions, error: null };
    } catch (error) {
      console.error('Error getting active seasonal restrictions:', error);
      return { data: [], error };
    }
  },

  /**
   * Update a seasonal restriction
   */
  update: async (restrictionId, updates) => {
    try {
      const docRef = doc(db, 'seasonal_restrictions', restrictionId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id: restrictionId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating seasonal restriction:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a seasonal restriction
   */
  delete: async (restrictionId) => {
    try {
      const docRef = doc(db, 'seasonal_restrictions', restrictionId);
      await deleteDoc(docRef);
      return { data: { id: restrictionId }, error: null };
    } catch (error) {
      console.error('Error deleting seasonal restriction:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Dashboard Service
// ============================================

export const fishAdvisoryDashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStatistics: async () => {
    try {
      const [
        advisoriesResult,
        zonesResult,
        pricesResult,
        restrictionsResult
      ] = await Promise.all([
        fishAdvisoryService.getActive(),
        fishingZonesService.getAll(),
        fishMarketPricesService.getLatest(50),
        seasonalRestrictionsService.getActive()
      ]);

      // Calculate statistics
      const openZones = zonesResult.data?.filter(z => z.status === 'open').length || 0;
      const restrictedZones = zonesResult.data?.filter(z => z.status === 'restricted').length || 0;
      const closedZones = zonesResult.data?.filter(z => z.status === 'closed').length || 0;

      return {
        data: {
          advisories: {
            total: advisoriesResult.data?.length || 0,
            active: advisoriesResult.data?.filter(a => a.status === 'active').length || 0,
            critical: advisoriesResult.data?.filter(a => a.severity === 'critical').length || 0
          },
          zones: {
            total: zonesResult.data?.length || 0,
            open: openZones,
            restricted: restrictedZones,
            closed: closedZones
          },
          prices: {
            total: pricesResult.data?.length || 0,
            updated: pricesResult.data?.[0]?.date || new Date()
          },
          restrictions: {
            total: restrictionsResult.data?.length || 0,
            active: restrictionsResult.data?.length || 0
          }
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting fish advisory dashboard statistics:', error);
      return { data: null, error };
    }
  }
};
