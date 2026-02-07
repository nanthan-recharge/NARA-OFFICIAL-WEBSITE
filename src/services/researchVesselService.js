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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ============================================
// Research Vessels Service
// ============================================

export const researchVesselsService = {
  /**
   * Get all research vessels
   */
  getAll: async () => {
    try {
      const q = query(
        collection(db, 'research_vessels'),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);

      const vessels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: vessels, error: null };
    } catch (error) {
      console.error('Error getting vessels:', error);
      return { data: [], error };
    }
  },

  /**
   * Get available vessels (active and not under maintenance)
   */
  getAvailable: async () => {
    try {
      const q = query(
        collection(db, 'research_vessels'),
        where('status', '==', 'available'),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);

      const vessels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: vessels, error: null };
    } catch (error) {
      console.error('Error getting available vessels:', error);
      return { data: [], error };
    }
  },

  /**
   * Get single vessel by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'research_vessels', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Vessel not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting vessel:', error);
      return { data: null, error };
    }
  },

  /**
   * Create new vessel
   */
  create: async (vesselData) => {
    try {
      const docRef = await addDoc(collection(db, 'research_vessels'), {
        ...vesselData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...vesselData }, error: null };
    } catch (error) {
      console.error('Error creating vessel:', error);
      return { data: null, error };
    }
  },

  /**
   * Update vessel
   */
  update: async (id, vesselData) => {
    try {
      const docRef = doc(db, 'research_vessels', id);
      await updateDoc(docRef, {
        ...vesselData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...vesselData }, error: null };
    } catch (error) {
      console.error('Error updating vessel:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete vessel
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'research_vessels', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting vessel:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Vessel Bookings Service
// ============================================

export const vesselBookingsService = {
  /**
   * Create new booking
   */
  create: async (bookingData) => {
    try {
      // Generate unique booking ID
      const bookingId = `BKG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const docRef = await addDoc(collection(db, 'vessel_bookings'), {
        bookingId,
        ...bookingData,
        status: 'pending',
        submissionDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { data: { id: docRef.id, bookingId, ...bookingData }, error: null };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all bookings with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'vessel_bookings');
      const queryConstraints = [orderBy('submissionDate', 'desc')];

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.vesselId) {
        queryConstraints.unshift(where('vesselId', '==', filters.vesselId));
      }

      if (filters.limit) {
        // Note: limit would need to be imported and added to queryConstraints
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: bookings, error: null };
    } catch (error) {
      console.error('Error getting bookings:', error);
      return { data: [], error };
    }
  },

  /**
   * Get user's bookings
   */
  getUserBookings: async (userId, filters = {}) => {
    try {
      let q = collection(db, 'vessel_bookings');
      const queryConstraints = [
        where('userId', '==', userId),
        orderBy('submissionDate', 'desc')
      ];

      if (filters.status) {
        queryConstraints.push(where('status', '==', filters.status));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: bookings, error: null };
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return { data: [], error };
    }
  },

  /**
   * Get booking by booking ID
   */
  getByBookingId: async (bookingId) => {
    try {
      const q = query(
        collection(db, 'vessel_bookings'),
        where('bookingId', '==', bookingId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: new Error('Booking not found') };
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
      console.error('Error getting booking:', error);
      return { data: null, error };
    }
  },

  /**
   * Get booking by document ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'vessel_bookings', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Booking not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting booking:', error);
      return { data: null, error };
    }
  },

  /**
   * Update booking status and notes
   */
  updateStatus: async (id, status, adminNotes = '', approvedBy = '') => {
    try {
      const docRef = doc(db, 'vessel_bookings', id);
      const updateData = {
        status,
        updatedAt: serverTimestamp()
      };

      if (adminNotes) {
        updateData.adminNotes = adminNotes;
      }

      if (status === 'approved' && approvedBy) {
        updateData.approvedBy = approvedBy;
        updateData.approvalDate = serverTimestamp();
      }

      if (status === 'rejected' && adminNotes) {
        updateData.rejectionReason = adminNotes;
        updateData.rejectionDate = serverTimestamp();
      }

      await updateDoc(docRef, updateData);
      return { data: { id, status, adminNotes }, error: null };
    } catch (error) {
      console.error('Error updating booking status:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete booking
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'vessel_bookings', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting booking:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Vessel Availability Calendar Service
// ============================================

export const vesselAvailabilityService = {
  /**
   * Check if vessel is available for date range
   */
  checkAvailability: async (vesselId, startDate, endDate) => {
    try {
      const q = query(
        collection(db, 'vessel_bookings'),
        where('vesselId', '==', vesselId),
        where('status', 'in', ['approved', 'confirmed'])
      );
      const snapshot = await getDocs(q);

      const bookings = snapshot.docs.map(doc => doc.data());

      // Check for conflicts
      const hasConflict = bookings.some(booking => {
        const bookingStart = booking.startDate?.toDate?.() || new Date(booking.startDate);
        const bookingEnd = booking.endDate?.toDate?.() || new Date(booking.endDate);
        const requestStart = startDate instanceof Date ? startDate : new Date(startDate);
        const requestEnd = endDate instanceof Date ? endDate : new Date(endDate);

        return (
          (requestStart >= bookingStart && requestStart <= bookingEnd) ||
          (requestEnd >= bookingStart && requestEnd <= bookingEnd) ||
          (requestStart <= bookingStart && requestEnd >= bookingEnd)
        );
      });

      return {
        data: {
          available: !hasConflict,
          conflictingBookings: hasConflict ? bookings : []
        },
        error: null
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      return { data: { available: false, conflictingBookings: [] }, error };
    }
  },

  /**
   * Get vessel bookings for a specific month
   */
  getMonthBookings: async (vesselId, year, month) => {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);

      const q = query(
        collection(db, 'vessel_bookings'),
        where('vesselId', '==', vesselId),
        where('status', 'in', ['approved', 'confirmed']),
        orderBy('startDate', 'asc')
      );
      const snapshot = await getDocs(q);

      const bookings = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(booking => {
          const bookingStart = booking.startDate?.toDate?.() || new Date(booking.startDate);
          const bookingEnd = booking.endDate?.toDate?.() || new Date(booking.endDate);
          return (
            (bookingStart >= startOfMonth && bookingStart <= endOfMonth) ||
            (bookingEnd >= startOfMonth && bookingEnd <= endOfMonth) ||
            (bookingStart <= startOfMonth && bookingEnd >= endOfMonth)
          );
        });

      return { data: bookings, error: null };
    } catch (error) {
      console.error('Error getting month bookings:', error);
      return { data: [], error };
    }
  }
};

// ============================================
// Dashboard Statistics Service
// ============================================

export const vesselDashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStatistics: async (userId = null) => {
    try {
      // Get vessels
      const vesselsResult = await researchVesselsService.getAll();
      const vessels = vesselsResult.data || [];

      // Get bookings
      const bookingsQuery = userId
        ? vesselBookingsService.getUserBookings(userId)
        : vesselBookingsService.getAll();
      const bookingsResult = await bookingsQuery;
      const bookings = bookingsResult.data || [];

      // Calculate statistics
      const stats = {
        vessels: {
          total: vessels.length,
          available: vessels.filter(v => v.status === 'available').length,
          inUse: vessels.filter(v => v.status === 'in_use').length,
          maintenance: vessels.filter(v => v.status === 'maintenance').length
        },
        bookings: {
          total: bookings.length,
          pending: bookings.filter(b => b.status === 'pending').length,
          approved: bookings.filter(b => b.status === 'approved').length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          rejected: bookings.filter(b => b.status === 'rejected').length
        },
        recentBookings: bookings.slice(0, 5),
        recentVessels: vessels.slice(0, 5)
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Image Upload Service
// ============================================

export const vesselImageService = {
  /**
   * Upload vessel image to Firebase Storage
   */
  uploadImage: async (file, vesselId) => {
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `research_vessels/${vesselId}/${filename}`);

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
