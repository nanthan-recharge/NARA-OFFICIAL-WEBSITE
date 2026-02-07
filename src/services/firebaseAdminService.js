/**
 * Firebase Admin Service
 *
 * Delegates user operations to userManagementService.
 * Provides content, applications, and analytics operations via Firestore.
 */
import { db } from '../firebase';
import {
  collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp
} from 'firebase/firestore';
import { userManagementService } from './userManagementService';

const firebaseAdminService = {
  // ──────────────────────────────────────────
  // Users - delegates to userManagementService
  // ──────────────────────────────────────────
  users: {
    getAll: async (filters = {}) => {
      return userManagementService.getUsers(filters);
    },
    getById: async (id) => {
      return userManagementService.getUserById(id);
    },
    create: async (userData, performedByUid) => {
      return userManagementService.createUser(userData, performedByUid);
    },
    update: async (id, updates, performedByUid) => {
      return userManagementService.updateUser(id, updates, performedByUid);
    },
    delete: async (id, performedByUid) => {
      return userManagementService.deleteUser(id, performedByUid);
    },
    updateRole: async (id, newRole, performedByUid) => {
      return userManagementService.updateUserRole(id, newRole, performedByUid);
    },
    getStats: async () => {
      return userManagementService.getUserStats();
    },
  },

  // ──────────────────────────────────────────
  // Content Management
  // ──────────────────────────────────────────
  content: {
    getAll: async (contentType) => {
      try {
        const collectionName = contentType || 'content';
        const q = query(collection(db, collectionName), orderBy('updatedAt', 'desc'));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return { data: items, error: null };
      } catch (error) {
        return { data: [], error: error.message };
      }
    },
    create: async (contentType, data) => {
      try {
        const collectionName = contentType || 'content';
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { data: { id: docRef.id }, error: null };
      } catch (error) {
        return { data: null, error: error.message };
      }
    },
    update: async (contentType, id, updates) => {
      try {
        const collectionName = contentType || 'content';
        await updateDoc(doc(db, collectionName, id), {
          ...updates,
          updatedAt: serverTimestamp(),
        });
        return { data: { id }, error: null };
      } catch (error) {
        return { data: null, error: error.message };
      }
    },
    delete: async (contentType, id) => {
      try {
        const collectionName = contentType || 'content';
        await deleteDoc(doc(db, collectionName, id));
        return { data: { id }, error: null };
      } catch (error) {
        return { data: null, error: error.message };
      }
    },
  },

  // ──────────────────────────────────────────
  // Applications / Requests
  // ──────────────────────────────────────────
  applications: {
    getAll: async (status) => {
      try {
        let q;
        if (status) {
          q = query(collection(db, 'applications'), where('status', '==', status), orderBy('createdAt', 'desc'));
        } else {
          q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
        }
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return { data: items, error: null };
      } catch (error) {
        return { data: [], error: error.message };
      }
    },
    update: async (id, updates) => {
      try {
        await updateDoc(doc(db, 'applications', id), {
          ...updates,
          updatedAt: serverTimestamp(),
        });
        return { data: { id }, error: null };
      } catch (error) {
        return { data: null, error: error.message };
      }
    },
    approve: async (id, approvedBy) => {
      try {
        await updateDoc(doc(db, 'applications', id), {
          status: 'approved',
          approvedBy,
          approvedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { data: { id, status: 'approved' }, error: null };
      } catch (error) {
        return { data: null, error: error.message };
      }
    },
    reject: async (id, rejectedBy, reason) => {
      try {
        await updateDoc(doc(db, 'applications', id), {
          status: 'rejected',
          rejectedBy,
          rejectionReason: reason,
          rejectedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { data: { id, status: 'rejected' }, error: null };
      } catch (error) {
        return { data: null, error: error.message };
      }
    },
  },

  // ──────────────────────────────────────────
  // Analytics / Dashboard
  // ──────────────────────────────────────────
  analytics: {
    getDashboard: async () => {
      try {
        const [usersResult, contentSnap, appsSnap] = await Promise.all([
          userManagementService.getUserStats(),
          getDocs(query(collection(db, 'content'), limit(1))),
          getDocs(query(collection(db, 'applications'), limit(1))),
        ]);

        return {
          data: {
            users: usersResult.data || {},
            contentCount: contentSnap.size,
            applicationsCount: appsSnap.size,
          },
          error: null,
        };
      } catch (error) {
        return { data: null, error: error.message };
      }
    },
  },
};

export default firebaseAdminService;
