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
  limit as firestoreLimit,
  serverTimestamp,
  writeBatch,
  getCountFromServer
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { ROLE_HIERARCHY, DEPARTMENTS, getRolePermissions, ACTIVITY_ACTIONS } from '../constants/roles';

const USERS_COLLECTION = 'adminUsers';
const DEPARTMENTS_COLLECTION = 'departments';
const ACTIVITY_LOGS_COLLECTION = 'userActivityLogs';

// ============================================
// Helper: Generate search terms for a user
// ============================================
const generateSearchTerms = (userData) => {
  const terms = new Set();
  const addTerms = (str) => {
    if (!str) return;
    const lower = str.toLowerCase().trim();
    terms.add(lower);
    lower.split(/\s+/).forEach(word => {
      if (word.length > 1) terms.add(word);
    });
  };

  addTerms(userData.displayName);
  addTerms(userData.email);
  addTerms(userData.employeeId);
  if (userData.firstName?.en) addTerms(userData.firstName.en);
  if (userData.lastName?.en) addTerms(userData.lastName.en);
  if (userData.department) addTerms(userData.department);
  if (userData.role) addTerms(userData.role.replace(/_/g, ' '));

  return Array.from(terms);
};

// ============================================
// Activity Logging
// ============================================
const logActivity = async (userId, action, details, performedBy, metadata = null) => {
  try {
    await addDoc(collection(db, ACTIVITY_LOGS_COLLECTION), {
      userId,
      action,
      details,
      performedBy,
      metadata,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// ============================================
// User CRUD Operations
// ============================================

export const userManagementService = {
  /**
   * Get users with optional filters
   * filters: { department, role, status, search, sortBy, sortOrder }
   */
  getUsers: async (filters = {}) => {
    try {
      let q = collection(db, USERS_COLLECTION);
      const constraints = [];

      if (filters.department) {
        constraints.push(where('department', '==', filters.department));
      }
      if (filters.role) {
        constraints.push(where('role', '==', filters.role));
      }
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      constraints.push(orderBy(filters.sortBy || 'displayName', filters.sortOrder || 'asc'));

      q = query(q, ...constraints);
      const snapshot = await getDocs(q);

      let users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Client-side search filter (Firestore doesn't support full-text search)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        users = users.filter(user =>
          user.searchTerms?.some(term => term.includes(searchLower)) ||
          user.displayName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.employeeId?.toLowerCase().includes(searchLower)
        );
      }

      return { data: { users, total: users.length }, error: null };
    } catch (error) {
      console.error('Error getting users:', error);
      return { data: { users: [], total: 0 }, error };
    }
  },

  /**
   * Get a single user by ID
   */
  getUserById: async (userId) => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return { data: null, error: { message: 'User not found' } };
      }
      return { data: { id: snap.id, ...snap.data() }, error: null };
    } catch (error) {
      console.error('Error getting user:', error);
      return { data: null, error };
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData, createdByUid) => {
    try {
      const now = new Date();
      const searchTerms = generateSearchTerms(userData);
      const rolePerms = getRolePermissions(userData.role);

      const newUser = {
        ...userData,
        permissions: rolePerms,
        customPermissions: userData.customPermissions || [],
        searchTerms,
        status: userData.status || 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: createdByUid,
        updatedBy: createdByUid,
      };

      const docRef = await addDoc(collection(db, USERS_COLLECTION), newUser);

      await logActivity(
        docRef.id,
        ACTIVITY_ACTIONS.USER_CREATED,
        `User ${userData.displayName} created`,
        createdByUid
      );

      return { data: { id: docRef.id, ...newUser }, error: null };
    } catch (error) {
      console.error('Error creating user:', error);
      return { data: null, error };
    }
  },

  /**
   * Update an existing user
   */
  updateUser: async (userId, updates, updatedByUid) => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);

      // Regenerate search terms if relevant fields changed
      if (updates.displayName || updates.email || updates.firstName || updates.lastName || updates.employeeId) {
        const snap = await getDoc(docRef);
        const existing = snap.data();
        const merged = { ...existing, ...updates };
        updates.searchTerms = generateSearchTerms(merged);
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        updatedBy: updatedByUid,
      });

      await logActivity(
        userId,
        ACTIVITY_ACTIONS.USER_UPDATED,
        `User profile updated`,
        updatedByUid,
        { fields: Object.keys(updates) }
      );

      return { data: { id: userId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      return { data: null, error };
    }
  },

  /**
   * Deactivate a user (soft suspend)
   */
  deactivateUser: async (userId, reason, performedByUid) => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, {
        status: 'suspended',
        statusReason: reason,
        statusChangedAt: serverTimestamp(),
        statusChangedBy: performedByUid,
        updatedAt: serverTimestamp(),
        updatedBy: performedByUid,
      });

      await logActivity(
        userId,
        ACTIVITY_ACTIONS.STATUS_CHANGED,
        `User suspended: ${reason}`,
        performedByUid,
        { newStatus: 'suspended', reason }
      );

      return { data: { id: userId, status: 'suspended' }, error: null };
    } catch (error) {
      console.error('Error deactivating user:', error);
      return { data: null, error };
    }
  },

  /**
   * Reactivate a suspended user
   */
  reactivateUser: async (userId, performedByUid) => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, {
        status: 'active',
        statusReason: null,
        statusChangedAt: serverTimestamp(),
        statusChangedBy: performedByUid,
        updatedAt: serverTimestamp(),
        updatedBy: performedByUid,
      });

      await logActivity(
        userId,
        ACTIVITY_ACTIONS.STATUS_CHANGED,
        `User reactivated`,
        performedByUid,
        { newStatus: 'active' }
      );

      return { data: { id: userId, status: 'active' }, error: null };
    } catch (error) {
      console.error('Error reactivating user:', error);
      return { data: null, error };
    }
  },

  /**
   * Soft delete a user (set status to terminated)
   */
  deleteUser: async (userId, performedByUid) => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, {
        status: 'terminated',
        statusChangedAt: serverTimestamp(),
        statusChangedBy: performedByUid,
        updatedAt: serverTimestamp(),
        updatedBy: performedByUid,
      });

      await logActivity(
        userId,
        ACTIVITY_ACTIONS.USER_DELETED,
        `User terminated`,
        performedByUid
      );

      return { data: { id: userId, status: 'terminated' }, error: null };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { data: null, error };
    }
  },

  /**
   * Change a user's role
   */
  updateUserRole: async (userId, newRole, performedByUid) => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const snap = await getDoc(docRef);
      const oldRole = snap.data()?.role;
      const newPerms = getRolePermissions(newRole);

      await updateDoc(docRef, {
        role: newRole,
        permissions: newPerms,
        updatedAt: serverTimestamp(),
        updatedBy: performedByUid,
      });

      await logActivity(
        userId,
        ACTIVITY_ACTIONS.ROLE_CHANGED,
        `Role changed from ${oldRole} to ${newRole}`,
        performedByUid,
        { oldRole, newRole }
      );

      return { data: { id: userId, role: newRole, permissions: newPerms }, error: null };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { data: null, error };
    }
  },

  /**
   * Update custom permissions for a user
   */
  updateUserPermissions: async (userId, customPermissions, performedByUid) => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, {
        customPermissions,
        updatedAt: serverTimestamp(),
        updatedBy: performedByUid,
      });

      await logActivity(
        userId,
        ACTIVITY_ACTIONS.PERMISSION_CHANGED,
        `Custom permissions updated`,
        performedByUid,
        { customPermissions }
      );

      return { data: { id: userId, customPermissions }, error: null };
    } catch (error) {
      console.error('Error updating permissions:', error);
      return { data: null, error };
    }
  },

  // ============================================
  // Departments
  // ============================================

  getDepartments: async () => {
    try {
      const q = query(collection(db, DEPARTMENTS_COLLECTION), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Return predefined departments if none in Firestore
        return { data: DEPARTMENTS.map((d, i) => ({ id: `dept-${i}`, ...d, isActive: true })), error: null };
      }

      return {
        data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        error: null
      };
    } catch (error) {
      console.error('Error getting departments:', error);
      return { data: DEPARTMENTS.map((d, i) => ({ id: `dept-${i}`, ...d, isActive: true })), error };
    }
  },

  createDepartment: async (deptData) => {
    try {
      const docRef = await addDoc(collection(db, DEPARTMENTS_COLLECTION), {
        ...deptData,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { data: { id: docRef.id, ...deptData }, error: null };
    } catch (error) {
      console.error('Error creating department:', error);
      return { data: null, error };
    }
  },

  updateDepartment: async (deptId, updates) => {
    try {
      const docRef = doc(db, DEPARTMENTS_COLLECTION, deptId);
      await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
      return { data: { id: deptId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating department:', error);
      return { data: null, error };
    }
  },

  // ============================================
  // Activity Logs
  // ============================================

  getUserActivityLogs: async (userId, maxResults = 50) => {
    try {
      const q = query(
        collection(db, ACTIVITY_LOGS_COLLECTION),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        firestoreLimit(maxResults)
      );
      const snapshot = await getDocs(q);
      return {
        data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        error: null
      };
    } catch (error) {
      console.error('Error getting activity logs:', error);
      return { data: [], error };
    }
  },

  getRecentActivityLogs: async (maxResults = 100) => {
    try {
      const q = query(
        collection(db, ACTIVITY_LOGS_COLLECTION),
        orderBy('timestamp', 'desc'),
        firestoreLimit(maxResults)
      );
      const snapshot = await getDocs(q);
      return {
        data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        error: null
      };
    } catch (error) {
      console.error('Error getting recent logs:', error);
      return { data: [], error };
    }
  },

  // ============================================
  // Bulk Operations
  // ============================================

  bulkImportUsers: async (usersArray, performedByUid) => {
    const results = { imported: 0, failed: 0, errors: [] };

    for (const userData of usersArray) {
      try {
        const searchTerms = generateSearchTerms(userData);
        const rolePerms = getRolePermissions(userData.role || 'support_staff');

        await addDoc(collection(db, USERS_COLLECTION), {
          ...userData,
          role: userData.role || 'support_staff',
          status: userData.status || 'active',
          permissions: rolePerms,
          customPermissions: [],
          searchTerms,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: performedByUid,
          updatedBy: performedByUid,
        });
        results.imported++;
      } catch (error) {
        results.failed++;
        results.errors.push({ user: userData.email || userData.displayName, error: error.message });
      }
    }

    await logActivity(
      'bulk',
      ACTIVITY_ACTIONS.BULK_IMPORT,
      `Bulk import: ${results.imported} imported, ${results.failed} failed`,
      performedByUid,
      results
    );

    return { data: results, error: null };
  },

  exportUsersCSV: async (filters = {}) => {
    const { data } = await userManagementService.getUsers(filters);
    if (!data?.users) return { data: null, error: { message: 'No data to export' } };

    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Date of Joining'];
    const rows = data.users.map(u => [
      u.employeeId || '',
      u.displayName || '',
      u.email || '',
      u.department || '',
      u.role || '',
      u.status || '',
      u.dateOfJoining?.toDate?.()?.toISOString?.()?.split('T')[0] || '',
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    return { data: csv, error: null };
  },

  // ============================================
  // Statistics
  // ============================================

  getUserStats: async () => {
    try {
      const snapshot = await getDocs(collection(db, USERS_COLLECTION));
      const users = snapshot.docs.map(d => d.data());

      const stats = {
        total: users.length,
        byStatus: {},
        byRole: {},
        byDepartment: {},
      };

      users.forEach(user => {
        const status = user.status || 'unknown';
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

        const role = user.role || 'unknown';
        stats.byRole[role] = (stats.byRole[role] || 0) + 1;

        const dept = user.department || 'unassigned';
        stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
      });

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { data: { total: 0, byStatus: {}, byRole: {}, byDepartment: {} }, error };
    }
  },

  // ============================================
  // Profile Photo
  // ============================================

  uploadProfilePhoto: async (userId, file) => {
    try {
      const timestamp = Date.now();
      const path = `admin-users/${userId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, USERS_COLLECTION, userId), {
        photoURL: downloadURL,
        photoPath: path,
        updatedAt: serverTimestamp(),
      });

      return { data: { photoURL: downloadURL, photoPath: path }, error: null };
    } catch (error) {
      console.error('Error uploading photo:', error);
      return { data: null, error };
    }
  },

  deleteProfilePhoto: async (userId, photoPath) => {
    try {
      if (photoPath) {
        const storageRef = ref(storage, photoPath);
        await deleteObject(storageRef).catch(() => {});
      }

      await updateDoc(doc(db, USERS_COLLECTION, userId), {
        photoURL: null,
        photoPath: null,
        updatedAt: serverTimestamp(),
      });

      return { data: { photoURL: null }, error: null };
    } catch (error) {
      console.error('Error deleting photo:', error);
      return { data: null, error };
    }
  },
};

export default userManagementService;
