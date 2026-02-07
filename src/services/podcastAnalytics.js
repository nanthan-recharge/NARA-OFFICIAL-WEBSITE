import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';

/**
 * Advanced Podcast Analytics Service
 * Real-time metrics, engagement tracking, and listener insights
 */

export const podcastAnalyticsService = {
  /**
   * Track a podcast view with detailed metadata
   */
  trackView: async (podcastId, metadata = {}) => {
    try {
      const viewData = {
        podcastId,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
        ...metadata,
        // User agent detection
        browser: metadata.browser || 'unknown',
        device: metadata.device || 'unknown',
        os: metadata.os || 'unknown',
        country: metadata.country || 'unknown',
        city: metadata.city || 'unknown'
      };

      // Add to views collection
      await setDoc(doc(collection(db, 'podcastViews')), viewData);

      // Update podcast view count
      const podcastRef = doc(db, 'podcasts', podcastId);
      await updateDoc(podcastRef, {
        views: increment(1),
        lastViewedAt: Timestamp.now()
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Error tracking view:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Track engagement (likes, shares, comments)
   */
  trackEngagement: async (podcastId, engagementType, metadata = {}) => {
    try {
      const engagementData = {
        podcastId,
        type: engagementType, // 'like', 'share', 'comment', 'download'
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
        ...metadata
      };

      await setDoc(doc(collection(db, 'podcastEngagements')), engagementData);

      return { success: true, error: null };
    } catch (error) {
      console.error('Error tracking engagement:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get real-time dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Get all podcasts
      const podcastsSnapshot = await getDocs(collection(db, 'podcasts'));
      const podcasts = [];
      podcastsSnapshot.forEach(doc => {
        podcasts.push({ id: doc.id, ...doc.data() });
      });

      // Calculate totals
      const totalPodcasts = podcasts.length;
      const publishedPodcasts = podcasts.filter(p => p.status === 'published').length;
      const totalViews = podcasts.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalLikes = podcasts.reduce((sum, p) => sum + (p.likes || 0), 0);

      // Get today's views
      const viewsQuery = query(
        collection(db, 'podcastViews'),
        where('date', '==', today)
      );
      const todayViewsSnapshot = await getDocs(viewsQuery);
      const todayViews = todayViewsSnapshot.size;

      // Get yesterday's views for comparison
      const yesterdayViewsQuery = query(
        collection(db, 'podcastViews'),
        where('date', '==', yesterday)
      );
      const yesterdayViewsSnapshot = await getDocs(yesterdayViewsQuery);
      const yesterdayViews = yesterdayViewsSnapshot.size;

      // Calculate view change percentage
      const viewChange = yesterdayViews > 0
        ? ((todayViews - yesterdayViews) / yesterdayViews * 100).toFixed(1)
        : 100;

      // Get today's engagements
      const engagementsQuery = query(
        collection(db, 'podcastEngagements'),
        where('date', '==', today)
      );
      const todayEngagementsSnapshot = await getDocs(engagementsQuery);
      const todayEngagements = todayEngagementsSnapshot.size;

      // Get average watch time (mock for now - would need video player integration)
      const avgWatchTime = '12:34'; // TODO: Calculate from real data

      return {
        data: {
          totalPodcasts,
          publishedPodcasts,
          totalViews,
          totalLikes,
          todayViews,
          viewChange: parseFloat(viewChange),
          todayEngagements,
          avgWatchTime,
          podcasts
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get most popular podcasts
   */
  getMostPopular: async (limitCount = 10, timeRange = 'all') => {
    try {
      let podcasts = [];

      if (timeRange === 'all') {
        // Get all podcasts sorted by views
        const q = query(
          collection(db, 'podcasts'),
          where('status', '==', 'published'),
          orderBy('views', 'desc'),
          limit(limitCount)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
          podcasts.push({ id: doc.id, ...doc.data() });
        });
      } else {
        // Get podcasts from specific time range
        const daysAgo = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
        const cutoffDate = new Date(Date.now() - daysAgo * 86400000);

        const q = query(
          collection(db, 'podcasts'),
          where('status', '==', 'published'),
          where('publishedAt', '>=', Timestamp.fromDate(cutoffDate)),
          orderBy('publishedAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const allPodcasts = [];
        snapshot.forEach(doc => {
          allPodcasts.push({ id: doc.id, ...doc.data() });
        });

        // Sort by views and limit
        podcasts = allPodcasts
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, limitCount);
      }

      return { data: podcasts, error: null };
    } catch (error) {
      console.error('Error getting popular podcasts:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Get view trends over time
   */
  getViewTrends: async (days = 30) => {
    try {
      const trends = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        // Get views for this date
        const viewsQuery = query(
          collection(db, 'podcastViews'),
          where('date', '==', dateString)
        );
        const snapshot = await getDocs(viewsQuery);

        trends.push({
          date: dateString,
          views: snapshot.size,
          label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }

      return { data: trends, error: null };
    } catch (error) {
      console.error('Error getting view trends:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Get listener demographics
   */
  getListenerDemographics: async () => {
    try {
      // Get all views
      const viewsSnapshot = await getDocs(collection(db, 'podcastViews'));

      const demographics = {
        devices: {},
        browsers: {},
        os: {},
        countries: {},
        cities: {},
        totalListeners: 0
      };

      const uniqueUsers = new Set();

      viewsSnapshot.forEach(doc => {
        const data = doc.data();

        // Track unique users (simplified - would use userId in production)
        uniqueUsers.add(data.userId || doc.id);

        // Device breakdown
        const device = data.device || 'unknown';
        demographics.devices[device] = (demographics.devices[device] || 0) + 1;

        // Browser breakdown
        const browser = data.browser || 'unknown';
        demographics.browsers[browser] = (demographics.browsers[browser] || 0) + 1;

        // OS breakdown
        const os = data.os || 'unknown';
        demographics.os[os] = (demographics.os[os] || 0) + 1;

        // Country breakdown
        const country = data.country || 'unknown';
        demographics.countries[country] = (demographics.countries[country] || 0) + 1;

        // City breakdown
        const city = data.city || 'unknown';
        demographics.cities[city] = (demographics.cities[city] || 0) + 1;
      });

      demographics.totalListeners = uniqueUsers.size;

      // Convert to arrays and sort
      const formatData = (obj) => {
        return Object.entries(obj)
          .map(([name, count]) => ({ name, count, percentage: 0 }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Top 10
      };

      return {
        data: {
          totalListeners: demographics.totalListeners,
          devices: formatData(demographics.devices),
          browsers: formatData(demographics.browsers),
          os: formatData(demographics.os),
          countries: formatData(demographics.countries),
          cities: formatData(demographics.cities)
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting demographics:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get category performance
   */
  getCategoryPerformance: async () => {
    try {
      const podcastsSnapshot = await getDocs(collection(db, 'podcasts'));
      const categories = {};

      podcastsSnapshot.forEach(doc => {
        const data = doc.data();
        const category = data.category || 'uncategorized';

        if (!categories[category]) {
          categories[category] = {
            count: 0,
            views: 0,
            likes: 0,
            avgViews: 0,
            avgLikes: 0
          };
        }

        categories[category].count++;
        categories[category].views += data.views || 0;
        categories[category].likes += data.likes || 0;
      });

      // Calculate averages
      Object.keys(categories).forEach(cat => {
        categories[cat].avgViews = Math.round(categories[cat].views / categories[cat].count);
        categories[cat].avgLikes = Math.round(categories[cat].likes / categories[cat].count);
      });

      // Convert to array and sort by total views
      const categoryArray = Object.entries(categories)
        .map(([name, stats]) => ({ category: name, ...stats }))
        .sort((a, b) => b.views - a.views);

      return { data: categoryArray, error: null };
    } catch (error) {
      console.error('Error getting category performance:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Get engagement breakdown
   */
  getEngagementBreakdown: async (days = 30) => {
    try {
      const cutoffDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

      const engagementsQuery = query(
        collection(db, 'podcastEngagements'),
        where('date', '>=', cutoffDate)
      );

      const snapshot = await getDocs(engagementsQuery);
      const breakdown = {
        likes: 0,
        shares: 0,
        comments: 0,
        downloads: 0,
        total: 0
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        const type = data.type || 'unknown';
        if (breakdown.hasOwnProperty(type)) {
          breakdown[type]++;
        }
        breakdown.total++;
      });

      return { data: breakdown, error: null };
    } catch (error) {
      console.error('Error getting engagement breakdown:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get retention metrics
   */
  getRetentionMetrics: async () => {
    try {
      // This would require video player integration to track actual watch time
      // For now, return mock data structure

      const metrics = {
        avgCompletionRate: 0.65, // 65%
        avgWatchTime: 754, // seconds
        dropOffPoints: [
          { time: 30, percentage: 0.15 },
          { time: 120, percentage: 0.10 },
          { time: 300, percentage: 0.08 }
        ],
        returningListeners: 0.42 // 42%
      };

      return { data: metrics, error: null };
    } catch (error) {
      console.error('Error getting retention metrics:', error);
      return { data: null, error: error.message };
    }
  }
};

export default podcastAnalyticsService;
