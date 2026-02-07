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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ============================================
// Press Releases Service
// ============================================

export const pressReleasesService = {
  /**
   * Get all press releases
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'press_releases');
      const queryConstraints = [orderBy('publishDate', 'desc')];

      if (filters.category) {
        queryConstraints.unshift(where('category', '==', filters.category));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const releases = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: releases, error: null };
    } catch (error) {
      console.error('Error getting press releases:', error);
      return { data: [], error };
    }
  },

  /**
   * Get press release by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'press_releases', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Press release not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting press release:', error);
      return { data: null, error };
    }
  },

  /**
   * Create press release
   */
  create: async (releaseData) => {
    try {
      const docRef = await addDoc(collection(db, 'press_releases'), {
        ...releaseData,
        viewCount: 0,
        downloadCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...releaseData }, error: null };
    } catch (error) {
      console.error('Error creating press release:', error);
      return { data: null, error };
    }
  },

  /**
   * Update press release
   */
  update: async (id, releaseData) => {
    try {
      const docRef = doc(db, 'press_releases', id);
      await updateDoc(docRef, {
        ...releaseData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...releaseData }, error: null };
    } catch (error) {
      console.error('Error updating press release:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete press release
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'press_releases', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting press release:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Media Assets Service
// ============================================

export const mediaAssetsService = {
  /**
   * Get all media assets
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'media_assets');
      const queryConstraints = [orderBy('uploadDate', 'desc')];

      if (filters.assetType) {
        queryConstraints.unshift(where('assetType', '==', filters.assetType));
      }

      if (filters.category) {
        queryConstraints.unshift(where('category', '==', filters.category));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const assets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: assets, error: null };
    } catch (error) {
      console.error('Error getting media assets:', error);
      return { data: [], error };
    }
  },

  /**
   * Get asset by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'media_assets', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Asset not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting asset:', error);
      return { data: null, error };
    }
  },

  /**
   * Create media asset
   */
  create: async (assetData) => {
    try {
      const docRef = await addDoc(collection(db, 'media_assets'), {
        ...assetData,
        downloadCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...assetData }, error: null };
    } catch (error) {
      console.error('Error creating asset:', error);
      return { data: null, error };
    }
  },

  /**
   * Update media asset
   */
  update: async (id, assetData) => {
    try {
      const docRef = doc(db, 'media_assets', id);
      await updateDoc(docRef, {
        ...assetData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...assetData }, error: null };
    } catch (error) {
      console.error('Error updating asset:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete media asset
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'media_assets', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting asset:', error);
      return { data: null, error };
    }
  },

  /**
   * Increment download count
   */
  incrementDownload: async (id) => {
    try {
      const docRef = doc(db, 'media_assets', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          downloadCount: (docSnap.data().downloadCount || 0) + 1
        });
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error incrementing download:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Stories Service
// ============================================

export const storiesService = {
  /**
   * Get all stories
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'media_stories');
      const queryConstraints = [orderBy('publishDate', 'desc')];

      if (filters.storyType) {
        queryConstraints.unshift(where('storyType', '==', filters.storyType));
      }

      if (filters.featured) {
        queryConstraints.unshift(where('featured', '==', true));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: stories, error: null };
    } catch (error) {
      console.error('Error getting stories:', error);
      return { data: [], error };
    }
  },

  /**
   * Get story by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'media_stories', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Story not found') };
      }

      // Increment view count
      await updateDoc(docRef, {
        viewCount: (docSnap.data().viewCount || 0) + 1
      });

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting story:', error);
      return { data: null, error };
    }
  },

  /**
   * Create story
   */
  create: async (storyData) => {
    try {
      const docRef = await addDoc(collection(db, 'media_stories'), {
        ...storyData,
        viewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...storyData }, error: null };
    } catch (error) {
      console.error('Error creating story:', error);
      return { data: null, error };
    }
  },

  /**
   * Update story
   */
  update: async (id, storyData) => {
    try {
      const docRef = doc(db, 'media_stories', id);
      await updateDoc(docRef, {
        ...storyData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...storyData }, error: null };
    } catch (error) {
      console.error('Error updating story:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete story
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'media_stories', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting story:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Media Contacts Service
// ============================================

export const mediaContactsService = {
  /**
   * Get all media contacts
   */
  getAll: async () => {
    try {
      const q = query(collection(db, 'media_contacts'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);

      const contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: contacts, error: null };
    } catch (error) {
      console.error('Error getting contacts:', error);
      return { data: [], error };
    }
  },

  /**
   * Create contact
   */
  create: async (contactData) => {
    try {
      const docRef = await addDoc(collection(db, 'media_contacts'), {
        ...contactData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...contactData }, error: null };
    } catch (error) {
      console.error('Error creating contact:', error);
      return { data: null, error };
    }
  },

  /**
   * Update contact
   */
  update: async (id, contactData) => {
    try {
      const docRef = doc(db, 'media_contacts', id);
      await updateDoc(docRef, {
        ...contactData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...contactData }, error: null };
    } catch (error) {
      console.error('Error updating contact:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete contact
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'media_contacts', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting contact:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Dashboard Service
// ============================================

export const mediaPressDashboardService = {
  /**
   * Get comprehensive dashboard data
   */
  getStatistics: async () => {
    try {
      const [releasesResult, assetsResult, storiesResult, contactsResult] = await Promise.all([
        pressReleasesService.getAll(),
        mediaAssetsService.getAll(),
        storiesService.getAll(),
        mediaContactsService.getAll()
      ]);

      const releases = releasesResult.data || [];
      const assets = assetsResult.data || [];
      const stories = storiesResult.data || [];
      const contacts = contactsResult.data || [];

      const stats = {
        overview: {
          totalReleases: releases.length,
          totalAssets: assets.length,
          totalStories: stories.length,
          totalContacts: contacts.length
        },
        recentReleases: releases.slice(0, 5),
        recentAssets: assets.slice(0, 10),
        featuredStories: stories.filter(s => s.featured).slice(0, 5),
        assetsByType: assets.reduce((acc, asset) => {
          acc[asset.assetType] = (acc[asset.assetType] || 0) + 1;
          return acc;
        }, {}),
        contacts
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// File Upload Service
// ============================================

export const mediaPressFileService = {
  /**
   * Upload file to Firebase Storage
   */
  uploadFile: async (file, category) => {
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `media_press/${category}/${filename}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return { data: { url: downloadURL, path: storageRef.fullPath }, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete file from Firebase Storage
   */
  deleteFile: async (filePath) => {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { data: null, error };
    }
  }
};
