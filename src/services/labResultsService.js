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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ============================================
// Lab Results Service
// ============================================

export const labResultsService = {
  /**
   * Create a new lab result entry
   */
  create: async (resultData) => {
    try {
      const docRef = await addDoc(collection(db, 'lab_results'), {
        ...resultData,
        status: resultData.status || 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          ...resultData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating lab result:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all lab results with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'lab_results');
      const constraints = [];

      if (filters.userId) {
        constraints.push(where('userId', '==', filters.userId));
      }

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters.testType) {
        constraints.push(where('testType', '==', filters.testType));
      }

      if (filters.sampleType) {
        constraints.push(where('sampleType', '==', filters.sampleType));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (filters.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        submittedAt: doc.data().submittedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      }));

      return { data: results, error: null };
    } catch (error) {
      console.error('Error getting lab results:', error);
      return { data: [], error };
    }
  },

  /**
   * Get user's lab results
   */
  getUserResults: async (userId, filters = {}) => {
    try {
      let q = collection(db, 'lab_results');
      const constraints = [where('userId', '==', userId)];

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (filters.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      q = query(q, ...constraints);

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        submittedAt: doc.data().submittedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      }));

      return { data: results, error: null };
    } catch (error) {
      console.error('Error getting user lab results:', error);
      return { data: [], error };
    }
  },

  /**
   * Get a single lab result by ID
   */
  getById: async (resultId) => {
    try {
      const docRef = doc(db, 'lab_results', resultId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Lab result not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
          submittedAt: docSnap.data().submittedAt?.toDate(),
          completedAt: docSnap.data().completedAt?.toDate()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting lab result:', error);
      return { data: null, error };
    }
  },

  /**
   * Update a lab result
   */
  update: async (resultId, updates) => {
    try {
      const docRef = doc(db, 'lab_results', resultId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id: resultId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating lab result:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a lab result
   */
  delete: async (resultId) => {
    try {
      const docRef = doc(db, 'lab_results', resultId);
      await deleteDoc(docRef);
      return { data: { id: resultId }, error: null };
    } catch (error) {
      console.error('Error deleting lab result:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Sample Tracking Service
// ============================================

export const sampleTrackingService = {
  /**
   * Create a new sample submission
   */
  create: async (sampleData) => {
    try {
      const sampleId = `SMP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const docRef = await addDoc(collection(db, 'sample_tracking'), {
        ...sampleData,
        sampleId,
        status: sampleData.status || 'submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          sampleId,
          ...sampleData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating sample:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all samples with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'sample_tracking');
      const constraints = [];

      if (filters.userId) {
        constraints.push(where('userId', '==', filters.userId));
      }

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters.sampleType) {
        constraints.push(where('sampleType', '==', filters.sampleType));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (filters.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      const samples = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        submittedAt: doc.data().submittedAt?.toDate(),
        receivedAt: doc.data().receivedAt?.toDate()
      }));

      return { data: samples, error: null };
    } catch (error) {
      console.error('Error getting samples:', error);
      return { data: [], error };
    }
  },

  /**
   * Get user's samples
   */
  getUserSamples: async (userId, filters = {}) => {
    try {
      let q = collection(db, 'sample_tracking');
      const constraints = [where('userId', '==', userId)];

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (filters.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      q = query(q, ...constraints);

      const snapshot = await getDocs(q);
      const samples = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        submittedAt: doc.data().submittedAt?.toDate(),
        receivedAt: doc.data().receivedAt?.toDate()
      }));

      return { data: samples, error: null };
    } catch (error) {
      console.error('Error getting user samples:', error);
      return { data: [], error };
    }
  },

  /**
   * Get sample by tracking ID
   */
  getBySampleId: async (sampleId) => {
    try {
      const q = query(collection(db, 'sample_tracking'), where('sampleId', '==', sampleId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: new Error('Sample not found') };
      }

      const doc = snapshot.docs[0];
      return {
        data: {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          submittedAt: doc.data().submittedAt?.toDate(),
          receivedAt: doc.data().receivedAt?.toDate()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting sample by ID:', error);
      return { data: null, error };
    }
  },

  /**
   * Update sample status
   */
  updateStatus: async (sampleDocId, status, notes = '') => {
    try {
      const docRef = doc(db, 'sample_tracking', sampleDocId);
      const updates = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'received') {
        updates.receivedAt = serverTimestamp();
      } else if (status === 'completed') {
        updates.completedAt = serverTimestamp();
      }

      if (notes) {
        updates.statusNotes = notes;
      }

      await updateDoc(docRef, updates);

      return { data: { id: sampleDocId, status }, error: null };
    } catch (error) {
      console.error('Error updating sample status:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a sample
   */
  delete: async (sampleDocId) => {
    try {
      const docRef = doc(db, 'sample_tracking', sampleDocId);
      await deleteDoc(docRef);
      return { data: { id: sampleDocId }, error: null };
    } catch (error) {
      console.error('Error deleting sample:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Test Methodologies Service
// ============================================

export const testMethodologiesService = {
  /**
   * Get all test methodologies
   */
  getAll: async () => {
    try {
      const q = query(collection(db, 'test_methodologies'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);

      const methodologies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: methodologies, error: null };
    } catch (error) {
      console.error('Error getting test methodologies:', error);
      return { data: [], error };
    }
  },

  /**
   * Get methodology by test type
   */
  getByTestType: async (testType) => {
    try {
      const q = query(collection(db, 'test_methodologies'), where('testType', '==', testType));
      const snapshot = await getDocs(q);

      const methodologies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: methodologies, error: null };
    } catch (error) {
      console.error('Error getting methodologies by test type:', error);
      return { data: [], error };
    }
  },

  /**
   * Create a new methodology
   */
  create: async (methodologyData) => {
    try {
      const docRef = await addDoc(collection(db, 'test_methodologies'), {
        ...methodologyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { data: { id: docRef.id, ...methodologyData }, error: null };
    } catch (error) {
      console.error('Error creating methodology:', error);
      return { data: null, error };
    }
  },

  /**
   * Update a methodology
   */
  update: async (methodologyId, updates) => {
    try {
      const docRef = doc(db, 'test_methodologies', methodologyId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id: methodologyId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating methodology:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a methodology
   */
  delete: async (methodologyId) => {
    try {
      const docRef = doc(db, 'test_methodologies', methodologyId);
      await deleteDoc(docRef);
      return { data: { id: methodologyId }, error: null };
    } catch (error) {
      console.error('Error deleting methodology:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Dashboard Service
// ============================================

export const labResultsDashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStatistics: async (userId = null) => {
    try {
      const filters = userId ? { userId } : {};

      const [resultsData, samplesData] = await Promise.all([
        labResultsService.getAll({ ...filters, limit: 1000 }),
        sampleTrackingService.getAll({ ...filters, limit: 1000 })
      ]);

      const results = resultsData.data || [];
      const samples = samplesData.data || [];

      // Calculate statistics
      const stats = {
        results: {
          total: results.length,
          completed: results.filter(r => r.status === 'completed').length,
          pending: results.filter(r => r.status === 'pending').length,
          inProgress: results.filter(r => r.status === 'in_progress').length
        },
        samples: {
          total: samples.length,
          submitted: samples.filter(s => s.status === 'submitted').length,
          received: samples.filter(s => s.status === 'received').length,
          processing: samples.filter(s => s.status === 'processing').length,
          completed: samples.filter(s => s.status === 'completed').length
        },
        recentResults: results.slice(0, 5),
        recentSamples: samples.slice(0, 5)
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting lab results dashboard statistics:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Customer Account Service (e-Lab Enhancement)
// ============================================

export const customerAccountService = {
  /**
   * Create customer account
   */
  create: async (accountData) => {
    try {
      const customerId = `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const docRef = await addDoc(collection(db, 'lab_customers'), {
        ...accountData,
        customerId,
        accountStatus: 'active',
        totalOrders: 0,
        totalSpent: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          customerId,
          ...accountData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating customer account:', error);
      return { data: null, error };
    }
  },

  /**
   * Get customer by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'lab_customers', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Customer not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting customer:', error);
      return { data: null, error };
    }
  },

  /**
   * Get customer by email
   */
  getByEmail: async (email) => {
    try {
      const q = query(collection(db, 'lab_customers'), where('email', '==', email), firestoreLimit(1));
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
      console.error('Error getting customer by email:', error);
      return { data: null, error };
    }
  },

  /**
   * Update customer account
   */
  update: async (id, accountData) => {
    try {
      const docRef = doc(db, 'lab_customers', id);
      await updateDoc(docRef, {
        ...accountData,
        updatedAt: serverTimestamp()
      });

      return { data: { id, ...accountData }, error: null };
    } catch (error) {
      console.error('Error updating customer account:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Lab Service Request & Payment Service
// ============================================

export const labServiceRequestService = {
  /**
   * Create service request with payment
   */
  create: async (requestData) => {
    try {
      const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const barcodeId = `BAR-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

      const docRef = await addDoc(collection(db, 'lab_service_requests'), {
        ...requestData,
        requestId,
        barcodeId,
        status: 'payment_pending',
        paymentStatus: 'pending',
        notificationsSent: [],
        chainOfCustody: [{
          timestamp: new Date().toISOString(),
          action: 'request_created',
          performedBy: requestData.customerName,
          location: 'Online Portal',
          notes: 'Service request submitted online'
        }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          requestId,
          barcodeId,
          ...requestData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating service request:', error);
      return { data: null, error };
    }
  },

  /**
   * Update payment status
   */
  updatePaymentStatus: async (id, paymentData) => {
    try {
      const docRef = doc(db, 'lab_service_requests', id);

      const updateData = {
        paymentStatus: paymentData.status,
        paymentMethod: paymentData.method,
        transactionId: paymentData.transactionId,
        paidAmount: paymentData.amount,
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (paymentData.status === 'completed') {
        updateData.status = 'sample_pending';
      }

      await updateDoc(docRef, updateData);

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating payment status:', error);
      return { data: null, error };
    }
  },

  /**
   * Get requests by customer
   */
  getByCustomer: async (customerId) => {
    try {
      const q = query(
        collection(db, 'lab_service_requests'),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: requests, error: null };
    } catch (error) {
      console.error('Error getting customer requests:', error);
      return { data: [], error };
    }
  },

  /**
   * Get request by barcode
   */
  getByBarcode: async (barcodeId) => {
    try {
      const q = query(
        collection(db, 'lab_service_requests'),
        where('barcodeId', '==', barcodeId),
        firestoreLimit(1)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: new Error('Request not found') };
      }

      return {
        data: {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting request by barcode:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Chain of Custody Service
// ============================================

export const chainOfCustodyService = {
  /**
   * Add custody event
   */
  addEvent: async (requestId, eventData) => {
    try {
      const docRef = doc(db, 'lab_service_requests', requestId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Request not found') };
      }

      const existingChain = docSnap.data().chainOfCustody || [];
      const newEvent = {
        timestamp: new Date().toISOString(),
        action: eventData.action,
        performedBy: eventData.performedBy,
        location: eventData.location || 'NARA Laboratory',
        notes: eventData.notes || '',
        eventId: `EVT-${Date.now()}`
      };

      await updateDoc(docRef, {
        chainOfCustody: [...existingChain, newEvent],
        updatedAt: serverTimestamp()
      });

      return { data: { success: true, event: newEvent }, error: null };
    } catch (error) {
      console.error('Error adding custody event:', error);
      return { data: null, error };
    }
  },

  /**
   * Get custody history
   */
  getHistory: async (requestId) => {
    try {
      const docRef = doc(db, 'lab_service_requests', requestId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: [], error: new Error('Request not found') };
      }

      return {
        data: docSnap.data().chainOfCustody || [],
        error: null
      };
    } catch (error) {
      console.error('Error getting custody history:', error);
      return { data: [], error };
    }
  }
};

// ============================================
// Notification Service
// ============================================

export const labNotificationService = {
  /**
   * Send notification (email/SMS)
   */
  send: async (requestId, notificationData) => {
    try {
      const docRef = doc(db, 'lab_service_requests', requestId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Request not found') };
      }

      // In production, integrate with email/SMS service (SendGrid, Twilio, etc.)
      const notification = {
        type: notificationData.type, // 'email' | 'sms'
        subject: notificationData.subject,
        message: notificationData.message,
        recipient: notificationData.recipient,
        sentAt: new Date().toISOString(),
        status: 'sent',
        notificationId: `NOT-${Date.now()}`
      };

      const existingNotifications = docSnap.data().notificationsSent || [];
      await updateDoc(docRef, {
        notificationsSent: [...existingNotifications, notification],
        updatedAt: serverTimestamp()
      });

      // TODO: Integrate with actual email/SMS service
      console.log('Notification queued:', notification);

      return { data: { success: true, notification }, error: null };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { data: null, error };
    }
  },

  /**
   * Send status update notification
   */
  sendStatusUpdate: async (requestId, status, message) => {
    try {
      const docRef = doc(db, 'lab_service_requests', requestId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Request not found') };
      }

      const request = docSnap.data();

      // Send email notification
      await labNotificationService.send(requestId, {
        type: 'email',
        subject: `Lab Service Update - ${request.requestId}`,
        message: message || `Your lab service request status has been updated to: ${status}`,
        recipient: request.customerEmail
      });

      // Send SMS if phone number provided
      if (request.customerPhone) {
        await labNotificationService.send(requestId, {
          type: 'sms',
          subject: 'Lab Service Update',
          message: `NARA Lab: Request ${request.requestId} status: ${status}. Check portal for details.`,
          recipient: request.customerPhone
        });
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error sending status update:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Certificate Verification Service
// ============================================

export const certificateVerificationService = {
  /**
   * Generate certificate with QR code
   */
  generate: async (requestId, certificateData) => {
    try {
      const verificationCode = `VER-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

      const certificate = {
        verificationCode,
        requestId: certificateData.requestId,
        certificateNumber: certificateData.certificateNumber,
        issuedTo: certificateData.issuedTo,
        testType: certificateData.testType,
        results: certificateData.results,
        issuedBy: certificateData.issuedBy,
        issuedAt: serverTimestamp(),
        expiresAt: certificateData.expiresAt || null,
        qrCodeData: {
          verificationUrl: `https://nara.gov.lk/verify/${verificationCode}`,
          certificateNumber: certificateData.certificateNumber,
          issuedDate: new Date().toISOString()
        }
      };

      const docRef = await addDoc(collection(db, 'lab_certificates'), certificate);

      // Update service request with certificate ID
      const requestRef = doc(db, 'lab_service_requests', requestId);
      await updateDoc(requestRef, {
        certificateId: docRef.id,
        verificationCode,
        status: 'completed',
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          verificationCode,
          ...certificate
        },
        error: null
      };
    } catch (error) {
      console.error('Error generating certificate:', error);
      return { data: null, error };
    }
  },

  /**
   * Verify certificate by code
   */
  verify: async (verificationCode) => {
    try {
      const q = query(
        collection(db, 'lab_certificates'),
        where('verificationCode', '==', verificationCode),
        firestoreLimit(1)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return {
          data: {
            valid: false,
            message: 'Certificate not found'
          },
          error: null
        };
      }

      const certificate = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };

      // Check expiration if applicable
      if (certificate.expiresAt && certificate.expiresAt.toDate() < new Date()) {
        return {
          data: {
            valid: false,
            message: 'Certificate has expired',
            certificate
          },
          error: null
        };
      }

      return {
        data: {
          valid: true,
          message: 'Certificate is valid',
          certificate
        },
        error: null
      };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Barcode/Label Service
// ============================================

export const barcodeLabelService = {
  /**
   * Generate barcode label data
   */
  generateLabel: async (requestId) => {
    try {
      const docRef = doc(db, 'lab_service_requests', requestId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Request not found') };
      }

      const request = docSnap.data();

      const labelData = {
        barcodeId: request.barcodeId,
        requestId: request.requestId,
        customerName: request.customerName,
        sampleType: request.sampleType,
        testType: request.testType,
        receivedDate: request.createdAt,
        priority: request.priority || 'normal',
        labelFormat: 'CODE128', // Barcode format
        printData: {
          text: request.barcodeId,
          metadata: {
            request: request.requestId,
            customer: request.customerName,
            type: request.testType
          }
        }
      };

      return { data: labelData, error: null };
    } catch (error) {
      console.error('Error generating label:', error);
      return { data: null, error };
    }
  },

  /**
   * Upload label image to storage
   */
  uploadLabelImage: async (requestId, imageBlob) => {
    try {
      const storageRef = ref(storage, `lab_labels/${requestId}_${Date.now()}.png`);
      await uploadBytes(storageRef, imageBlob);
      const downloadURL = await getDownloadURL(storageRef);

      // Update request with label URL
      const docRef = doc(db, 'lab_service_requests', requestId);
      await updateDoc(docRef, {
        labelImageUrl: downloadURL,
        updatedAt: serverTimestamp()
      });

      return { data: { url: downloadURL }, error: null };
    } catch (error) {
      console.error('Error uploading label image:', error);
      return { data: null, error };
    }
  }
};
