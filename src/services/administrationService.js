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
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ============================================
// Chairman Service
// ============================================

export const chairmanService = {
  /**
   * Get chairman data
   */
  get: async () => {
    try {
      const q = query(collection(db, 'administration_chairman'));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: null };
      }

      const doc = snapshot.docs[0];
      return {
        data: {
          id: doc.id,
          ...doc.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting chairman:', error);
      return { data: null, error };
    }
  },

  /**
   * Update chairman data
   */
  update: async (chairmanId, data) => {
    try {
      const docRef = doc(db, 'administration_chairman', chairmanId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { data: { id: chairmanId, ...data }, error: null };
    } catch (error) {
      console.error('Error updating chairman:', error);
      return { data: null, error };
    }
  },

  /**
   * Create chairman data
   */
  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'administration_chairman'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...data }, error: null };
    } catch (error) {
      console.error('Error creating chairman:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Executive Leadership Service
// ============================================

export const executiveLeadershipService = {
  /**
   * Get all executive leaders
   */
  getAll: async () => {
    try {
      const q = query(
        collection(db, 'administration_executive'),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);

      const leaders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: leaders, error: null };
    } catch (error) {
      console.error('Error getting executive leaders:', error);
      return { data: [], error };
    }
  },

  /**
   * Get single executive leader
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'administration_executive', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Executive leader not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting executive leader:', error);
      return { data: null, error };
    }
  },

  /**
   * Create executive leader
   */
  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'administration_executive'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...data }, error: null };
    } catch (error) {
      console.error('Error creating executive leader:', error);
      return { data: null, error };
    }
  },

  /**
   * Update executive leader
   */
  update: async (id, data) => {
    try {
      const docRef = doc(db, 'administration_executive', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...data }, error: null };
    } catch (error) {
      console.error('Error updating executive leader:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete executive leader
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'administration_executive', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting executive leader:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Division Heads Service
// ============================================

export const divisionHeadsService = {
  /**
   * Get all division heads
   */
  getAll: async () => {
    try {
      const q = query(
        collection(db, 'administration_division_heads'),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);

      const heads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: heads, error: null };
    } catch (error) {
      console.error('Error getting division heads:', error);
      return { data: [], error };
    }
  },

  /**
   * Get single division head
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'administration_division_heads', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Division head not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting division head:', error);
      return { data: null, error };
    }
  },

  /**
   * Create division head
   */
  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'administration_division_heads'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...data }, error: null };
    } catch (error) {
      console.error('Error creating division head:', error);
      return { data: null, error };
    }
  },

  /**
   * Update division head
   */
  update: async (id, data) => {
    try {
      const docRef = doc(db, 'administration_division_heads', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...data }, error: null };
    } catch (error) {
      console.error('Error updating division head:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete division head
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'administration_division_heads', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting division head:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Governing Board Service
// ============================================

export const governingBoardService = {
  /**
   * Get all board members
   */
  getAll: async () => {
    try {
      const q = query(
        collection(db, 'administration_governing_board'),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);

      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: members, error: null };
    } catch (error) {
      console.error('Error getting board members:', error);
      return { data: [], error };
    }
  },

  /**
   * Get single board member
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'administration_governing_board', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Board member not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting board member:', error);
      return { data: null, error };
    }
  },

  /**
   * Create board member
   */
  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'administration_governing_board'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...data }, error: null };
    } catch (error) {
      console.error('Error creating board member:', error);
      return { data: null, error };
    }
  },

  /**
   * Update board member
   */
  update: async (id, data) => {
    try {
      const docRef = doc(db, 'administration_governing_board', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...data }, error: null };
    } catch (error) {
      console.error('Error updating board member:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete board member
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'administration_governing_board', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting board member:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Image Upload Service
// ============================================

export const administrationImageService = {
  /**
   * Upload image to Firebase Storage
   */
  uploadImage: async (file, category, personId) => {
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `administration/${category}/${personId}/${filename}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return { data: { url: downloadURL, path: storageRef.fullPath }, error: null };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete image from Firebase Storage
   */
  deleteImage: async (imagePath) => {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting image:', error);
      return { data: null, error };
    }
  }
};
