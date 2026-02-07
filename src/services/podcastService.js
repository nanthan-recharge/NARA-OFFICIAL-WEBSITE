import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

/**
 * Podcast Service Layer
 * Handles all podcast-related Firebase operations
 */

export const podcastService = {
  /**
   * Create a new podcast
   */
  create: async (podcastData) => {
    try {
      console.log('📝 Creating podcast in Firestore...');
      console.log('📦 Data to save:', JSON.stringify({
        ...podcastData,
        status: podcastData.status || 'published',
        views: 0,
        likes: 0,
        likedBy: [],
      }, null, 2));

      const docRef = await addDoc(collection(db, 'podcasts'), {
        ...podcastData,
        status: podcastData.status || 'published',
        views: 0,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Podcast created successfully with ID:', docRef.id);

      return {
        data: {
          id: docRef.id,
          ...podcastData
        },
        error: null
      };
    } catch (error) {
      console.error('❌ Error creating podcast:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      return { data: null, error: error.message };
    }
  },

  /**
   * Get all podcasts with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'podcasts');
      let constraints = [];

      // Apply filters
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters.category && filters.category !== 'all') {
        constraints.push(where('category', '==', filters.category));
      }

      if (filters.featured !== undefined) {
        constraints.push(where('featured', '==', filters.featured));
      }

      // Order by publishedAt or createdAt
      constraints.push(orderBy('publishedAt', 'desc'));

      // Apply limit
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      q = query(q, ...constraints);
      const querySnapshot = await getDocs(q);

      const podcasts = [];
      querySnapshot.forEach((doc) => {
        podcasts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || null,
          updatedAt: doc.data().updatedAt?.toDate?.() || null,
          publishedAt: doc.data().publishedAt?.toDate?.() || null
        });
      });

      return { data: podcasts, error: null };
    } catch (error) {
      console.error('❌ Error getting podcasts (likely missing Firestore index):', error);
      console.log('🔄 Trying fallback query without ordering...');

      // If ordering by publishedAt fails, try without ordering but WITH filters
      try {
        let fallbackConstraints = [];

        // Apply the same filters but without ordering
        if (filters.status) {
          fallbackConstraints.push(where('status', '==', filters.status));
        }

        if (filters.category && filters.category !== 'all') {
          fallbackConstraints.push(where('category', '==', filters.category));
        }

        if (filters.featured !== undefined) {
          fallbackConstraints.push(where('featured', '==', filters.featured));
        }

        // Apply limit
        if (filters.limit) {
          fallbackConstraints.push(limit(filters.limit));
        }

        const fallbackQuery = fallbackConstraints.length > 0
          ? query(collection(db, 'podcasts'), ...fallbackConstraints)
          : collection(db, 'podcasts');

        const querySnapshot = await getDocs(fallbackQuery);
        const podcasts = [];
        querySnapshot.forEach((doc) => {
          podcasts.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || null,
            updatedAt: doc.data().updatedAt?.toDate?.() || null,
            publishedAt: doc.data().publishedAt?.toDate?.() || null
          });
        });

        console.log(`✅ Fallback query succeeded! Fetched ${podcasts.length} podcasts`);

        // Sort manually by publishedAt
        podcasts.sort((a, b) => {
          const dateA = a.publishedAt || a.createdAt || new Date(0);
          const dateB = b.publishedAt || b.createdAt || new Date(0);
          return dateB - dateA;
        });
        return { data: podcasts, error: null };
      } catch (fallbackError) {
        console.error('❌ Fallback query also failed:', fallbackError);
        return { data: [], error: fallbackError.message };
      }
    }
  },

  /**
   * Get a single podcast by ID
   */
  getById: async (podcastId) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          data: {
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate?.() || null,
            updatedAt: docSnap.data().updatedAt?.toDate?.() || null,
            publishedAt: docSnap.data().publishedAt?.toDate?.() || null
          },
          error: null
        };
      } else {
        return { data: null, error: 'Podcast not found' };
      }
    } catch (error) {
      console.error('Error getting podcast:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update a podcast
   */
  update: async (podcastId, updates) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id: podcastId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating podcast:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Delete a podcast
   */
  delete: async (podcastId) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      await deleteDoc(docRef);

      return { data: { id: podcastId }, error: null };
    } catch (error) {
      console.error('Error deleting podcast:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Increment view count
   */
  incrementViews: async (podcastId) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      await updateDoc(docRef, {
        views: increment(1)
      });

      return { data: true, error: null };
    } catch (error) {
      console.error('Error incrementing views:', error);
      return { data: false, error: error.message };
    }
  },

  /**
   * Toggle like on a podcast
   */
  toggleLike: async (podcastId, userId) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'Podcast not found' };
      }

      const likedBy = docSnap.data().likedBy || [];
      const hasLiked = likedBy.includes(userId);

      if (hasLiked) {
        // Unlike
        await updateDoc(docRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId)
        });
      } else {
        // Like
        await updateDoc(docRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId)
        });
      }

      return { data: { liked: !hasLiked }, error: null };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get featured podcasts
   */
  getFeatured: async (limitCount = 5) => {
    try {
      const q = query(
        collection(db, 'podcasts'),
        where('featured', '==', true),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const podcasts = [];

      querySnapshot.forEach((doc) => {
        podcasts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || null,
          updatedAt: doc.data().updatedAt?.toDate?.() || null,
          publishedAt: doc.data().publishedAt?.toDate?.() || null
        });
      });

      return { data: podcasts, error: null };
    } catch (error) {
      console.error('Error getting featured podcasts:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Get podcasts by category
   */
  getByCategory: async (category, limitCount = 10) => {
    try {
      const q = query(
        collection(db, 'podcasts'),
        where('category', '==', category),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const podcasts = [];

      querySnapshot.forEach((doc) => {
        podcasts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || null,
          updatedAt: doc.data().updatedAt?.toDate?.() || null,
          publishedAt: doc.data().publishedAt?.toDate?.() || null
        });
      });

      return { data: podcasts, error: null };
    } catch (error) {
      console.error('Error getting podcasts by category:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Search podcasts
   */
  search: async (searchTerm) => {
    try {
      // Get all podcasts and filter client-side
      // (Firestore doesn't support full-text search natively)
      const { data: podcasts, error } = await podcastService.getAll({
        status: 'published'
      });

      if (error) {
        return { data: [], error };
      }

      const searchLower = searchTerm.toLowerCase();
      const filtered = podcasts.filter(podcast => {
        const titleMatch = podcast.title?.en?.toLowerCase().includes(searchLower) ||
                          podcast.title?.si?.toLowerCase().includes(searchLower) ||
                          podcast.title?.ta?.toLowerCase().includes(searchLower);

        const descMatch = podcast.description?.en?.toLowerCase().includes(searchLower) ||
                         podcast.description?.si?.toLowerCase().includes(searchLower) ||
                         podcast.description?.ta?.toLowerCase().includes(searchLower);

        const tagsMatch = podcast.tags?.some(tag =>
          tag.toLowerCase().includes(searchLower)
        );

        return titleMatch || descMatch || tagsMatch;
      });

      return { data: filtered, error: null };
    } catch (error) {
      console.error('Error searching podcasts:', error);
      return { data: [], error: error.message };
    }
  }
};

/**
 * Podcast Analytics Service
 */
export const podcastAnalyticsService = {
  /**
   * Get overall statistics
   */
  getStatistics: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'podcasts'));

      let total = 0;
      let published = 0;
      let draft = 0;
      let totalViews = 0;
      let totalLikes = 0;
      const categories = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total++;

        if (data.status === 'published') published++;
        if (data.status === 'draft') draft++;

        totalViews += data.views || 0;
        totalLikes += data.likes || 0;

        const category = data.category || 'uncategorized';
        categories[category] = (categories[category] || 0) + 1;
      });

      return {
        data: {
          total,
          published,
          draft,
          totalViews,
          totalLikes,
          categories
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get trending podcasts (most viewed in last 7 days)
   */
  getTrending: async (limitCount = 10) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const q = query(
        collection(db, 'podcasts'),
        where('status', '==', 'published'),
        where('publishedAt', '>=', Timestamp.fromDate(sevenDaysAgo)),
        orderBy('publishedAt', 'desc'),
        orderBy('views', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const podcasts = [];

      querySnapshot.forEach((doc) => {
        podcasts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || null,
          updatedAt: doc.data().updatedAt?.toDate?.() || null,
          publishedAt: doc.data().publishedAt?.toDate?.() || null
        });
      });

      return { data: podcasts, error: null };
    } catch (error) {
      console.error('Error getting trending podcasts:', error);
      // Fallback: just get most viewed
      try {
        const { data: allPodcasts } = await podcastService.getAll({
          status: 'published',
          limit: limitCount * 2
        });
        const sorted = allPodcasts.sort((a, b) => (b.views || 0) - (a.views || 0));
        return { data: sorted.slice(0, limitCount), error: null };
      } catch (fallbackError) {
        return { data: [], error: fallbackError.message };
      }
    }
  }
};

export default podcastService;
