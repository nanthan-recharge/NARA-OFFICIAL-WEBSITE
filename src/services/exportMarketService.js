import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============================================
// Market Prices Service
// ============================================

export const marketPricesService = {
  /**
   * Get all market prices with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'export_market_prices');
      const queryConstraints = [orderBy('recordDate', 'desc')];

      if (filters.species) {
        queryConstraints.unshift(where('species', '==', filters.species));
      }

      if (filters.market) {
        queryConstraints.unshift(where('market', '==', filters.market));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const prices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: prices, error: null };
    } catch (error) {
      console.error('Error getting market prices:', error);
      return { data: [], error };
    }
  },

  /**
   * Get latest prices by species
   */
  getLatestBySpecies: async (species) => {
    try {
      const q = query(
        collection(db, 'export_market_prices'),
        where('species', '==', species),
        orderBy('recordDate', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: null };
      }

      return {
        data: {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting latest price:', error);
      return { data: null, error };
    }
  },

  /**
   * Create market price record
   */
  create: async (priceData) => {
    try {
      const docRef = await addDoc(collection(db, 'export_market_prices'), {
        ...priceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...priceData }, error: null };
    } catch (error) {
      console.error('Error creating price record:', error);
      return { data: null, error };
    }
  },

  /**
   * Update market price record
   */
  update: async (id, priceData) => {
    try {
      const docRef = doc(db, 'export_market_prices', id);
      await updateDoc(docRef, {
        ...priceData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...priceData }, error: null };
    } catch (error) {
      console.error('Error updating price record:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete market price record
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'export_market_prices', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting price record:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Trade Statistics Service
// ============================================

export const tradeStatisticsService = {
  /**
   * Get all trade statistics
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'trade_statistics');
      const queryConstraints = [orderBy('year', 'desc'), orderBy('month', 'desc')];

      if (filters.year) {
        queryConstraints.unshift(where('year', '==', filters.year));
      }

      if (filters.country) {
        queryConstraints.unshift(where('country', '==', filters.country));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const stats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting trade statistics:', error);
      return { data: [], error };
    }
  },

  /**
   * Get statistics for specific period
   */
  getByPeriod: async (year, month = null) => {
    try {
      let q = query(
        collection(db, 'trade_statistics'),
        where('year', '==', year)
      );

      if (month !== null) {
        q = query(q, where('month', '==', month));
      }

      const snapshot = await getDocs(q);

      const stats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting period statistics:', error);
      return { data: [], error };
    }
  },

  /**
   * Create trade statistics record
   */
  create: async (statsData) => {
    try {
      const docRef = await addDoc(collection(db, 'trade_statistics'), {
        ...statsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...statsData }, error: null };
    } catch (error) {
      console.error('Error creating statistics:', error);
      return { data: null, error };
    }
  },

  /**
   * Update trade statistics
   */
  update: async (id, statsData) => {
    try {
      const docRef = doc(db, 'trade_statistics', id);
      await updateDoc(docRef, {
        ...statsData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...statsData }, error: null };
    } catch (error) {
      console.error('Error updating statistics:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete trade statistics
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'trade_statistics', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting statistics:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Export Opportunities Service
// ============================================

export const exportOpportunitiesService = {
  /**
   * Get all export opportunities
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'export_opportunities');
      const queryConstraints = [orderBy('postedDate', 'desc')];

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.targetMarket) {
        queryConstraints.unshift(where('targetMarket', '==', filters.targetMarket));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const opportunities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: opportunities, error: null };
    } catch (error) {
      console.error('Error getting opportunities:', error);
      return { data: [], error };
    }
  },

  /**
   * Get opportunity by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'export_opportunities', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Opportunity not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting opportunity:', error);
      return { data: null, error };
    }
  },

  /**
   * Create export opportunity
   */
  create: async (opportunityData) => {
    try {
      const docRef = await addDoc(collection(db, 'export_opportunities'), {
        ...opportunityData,
        viewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...opportunityData }, error: null };
    } catch (error) {
      console.error('Error creating opportunity:', error);
      return { data: null, error };
    }
  },

  /**
   * Update export opportunity
   */
  update: async (id, opportunityData) => {
    try {
      const docRef = doc(db, 'export_opportunities', id);
      await updateDoc(docRef, {
        ...opportunityData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...opportunityData }, error: null };
    } catch (error) {
      console.error('Error updating opportunity:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete export opportunity
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'export_opportunities', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Market Reports Service
// ============================================

export const marketReportsService = {
  /**
   * Get all market reports
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'market_reports');
      const queryConstraints = [orderBy('publishedDate', 'desc')];

      if (filters.reportType) {
        queryConstraints.unshift(where('reportType', '==', filters.reportType));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: reports, error: null };
    } catch (error) {
      console.error('Error getting reports:', error);
      return { data: [], error };
    }
  },

  /**
   * Get report by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'market_reports', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Report not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting report:', error);
      return { data: null, error };
    }
  },

  /**
   * Create market report
   */
  create: async (reportData) => {
    try {
      const docRef = await addDoc(collection(db, 'market_reports'), {
        ...reportData,
        downloadCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...reportData }, error: null };
    } catch (error) {
      console.error('Error creating report:', error);
      return { data: null, error };
    }
  },

  /**
   * Update market report
   */
  update: async (id, reportData) => {
    try {
      const docRef = doc(db, 'market_reports', id);
      await updateDoc(docRef, {
        ...reportData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...reportData }, error: null };
    } catch (error) {
      console.error('Error updating report:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete market report
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'market_reports', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting report:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Dashboard Service
// ============================================

export const exportMarketDashboardService = {
  /**
   * Get comprehensive dashboard data
   */
  getStatistics: async () => {
    try {
      const [pricesResult, statsResult, oppsResult, reportsResult] = await Promise.all([
        marketPricesService.getAll({ limit: 100 }),
        tradeStatisticsService.getAll({ limit: 12 }),
        exportOpportunitiesService.getAll({ limit: 50 }),
        marketReportsService.getAll({ limit: 10 })
      ]);

      const prices = pricesResult.data || [];
      const stats = statsResult.data || [];
      const opportunities = oppsResult.data || [];
      const reports = reportsResult.data || [];

      // Calculate aggregated statistics
      const totalExportValue = stats.reduce((sum, s) => sum + (s.exportValue || 0), 0);
      const totalExportVolume = stats.reduce((sum, s) => sum + (s.exportVolume || 0), 0);

      // Get unique species count
      const uniqueSpecies = [...new Set(prices.map(p => p.species))];

      // Get unique markets count
      const uniqueMarkets = [...new Set(prices.map(p => p.market))];

      const dashboardData = {
        overview: {
          totalExportValue,
          totalExportVolume,
          activeOpportunities: opportunities.filter(o => o.status === 'active').length,
          totalReports: reports.length,
          speciesCount: uniqueSpecies.length,
          marketsCount: uniqueMarkets.length
        },
        recentPrices: prices.slice(0, 10),
        recentStats: stats.slice(0, 6),
        activeOpportunities: opportunities.filter(o => o.status === 'active').slice(0, 5),
        latestReports: reports.slice(0, 5),
        pricesBySpecies: uniqueSpecies.slice(0, 10).map(species => {
          const speciesPrices = prices.filter(p => p.species === species);
          const avgPrice = speciesPrices.reduce((sum, p) => sum + (p.price || 0), 0) / speciesPrices.length;
          return {
            species,
            averagePrice: avgPrice,
            count: speciesPrices.length
          };
        }),
        tradeByCountry: stats.reduce((acc, stat) => {
          if (!acc[stat.country]) {
            acc[stat.country] = {
              country: stat.country,
              totalValue: 0,
              totalVolume: 0
            };
          }
          acc[stat.country].totalValue += stat.exportValue || 0;
          acc[stat.country].totalVolume += stat.exportVolume || 0;
          return acc;
        }, {})
      };

      return { data: dashboardData, error: null };
    } catch (error) {
      console.error('Error getting dashboard statistics:', error);
      return { data: null, error };
    }
  }
};
