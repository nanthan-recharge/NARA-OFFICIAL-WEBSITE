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
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// ============================================
// EIA (Environmental Impact Assessment) Service
// ============================================
export const eiaService = {
  /**
   * Create new EIA application
   */
  create: async (eiaData) => {
    try {
      const docRef = await addDoc(collection(db, 'government_eia_applications'), {
        ...eiaData,
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...eiaData }, error: null };
    } catch (error) {
      console.error('Error creating EIA:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get user's EIA submissions
   */
  getUserSubmissions: async (userId) => {
    try {
      const q = query(
        collection(db, 'government_eia_applications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const submissions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: submissions, error: null };
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Get all EIA applications (admin)
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'government_eia_applications');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      const applications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: applications, error: null };
    } catch (error) {
      console.error('Error fetching all EIAs:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Update EIA application
   */
  update: async (eiaId, updates) => {
    try {
      const docRef = doc(db, 'government_eia_applications', eiaId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { data: { id: eiaId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating EIA:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Submit EIA for review
   */
  submit: async (eiaId) => {
    try {
      const docRef = doc(db, 'government_eia_applications', eiaId);
      await updateDoc(docRef, {
        status: 'submitted',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: eiaId, status: 'submitted' }, error: null };
    } catch (error) {
      console.error('Error submitting EIA:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Delete EIA application
   */
  delete: async (eiaId) => {
    try {
      await deleteDoc(doc(db, 'government_eia_applications', eiaId));
      return { data: { id: eiaId }, error: null };
    } catch (error) {
      console.error('Error deleting EIA:', error);
      return { data: null, error: error.message };
    }
  }
};

// ============================================
// Document Service
// ============================================
export const documentService = {
  /**
   * Upload document metadata (actual file upload handled separately)
   */
  upload: async (documentData) => {
    try {
      const docRef = await addDoc(collection(db, 'government_documents'), {
        ...documentData,
        uploadedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...documentData }, error: null };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get document metadata
   */
  getMetadata: async (documentId) => {
    try {
      const docRef = doc(db, 'government_documents', documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
      }
      return { data: null, error: 'Document not found' };
    } catch (error) {
      console.error('Error fetching document:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get documents by reference (e.g., for a specific EIA or license)
   */
  getByReference: async (referenceType, referenceId) => {
    try {
      const q = query(
        collection(db, 'government_documents'),
        where('referenceType', '==', referenceType),
        where('referenceId', '==', referenceId)
      );
      const snapshot = await getDocs(q);
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: documents, error: null };
    } catch (error) {
      console.error('Error fetching documents:', error);
      return { data: [], error: error.message };
    }
  }
};

// ============================================
// Licensing Service
// ============================================
export const licensingService = {
  /**
   * Create new license application
   */
  create: async (licenseData) => {
    try {
      const docRef = await addDoc(collection(db, 'government_licenses'), {
        ...licenseData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...licenseData }, error: null };
    } catch (error) {
      console.error('Error creating license:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get user's license applications
   */
  getUserApplications: async (userId) => {
    try {
      const q = query(
        collection(db, 'government_licenses'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const applications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: applications, error: null };
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Get all license applications (admin)
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'government_licenses');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.type) {
        q = query(q, where('type', '==', filters.type));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      const licenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: licenses, error: null };
    } catch (error) {
      console.error('Error fetching all licenses:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Update license application
   */
  update: async (licenseId, updates) => {
    try {
      const docRef = doc(db, 'government_licenses', licenseId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { data: { id: licenseId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating license:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Delete license application
   */
  delete: async (licenseId) => {
    try {
      await deleteDoc(doc(db, 'government_licenses', licenseId));
      return { data: { id: licenseId }, error: null };
    } catch (error) {
      console.error('Error deleting license:', error);
      return { data: null, error: error.message };
    }
  }
};

// ============================================
// Compliance Service
// ============================================
export const complianceService = {
  /**
   * Get compliance records
   */
  getRecords: async (filters = {}) => {
    try {
      let q = collection(db, 'government_compliance_records');

      if (filters.entityId) {
        q = query(q, where('entityId', '==', filters.entityId));
      }

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: records, error: null };
    } catch (error) {
      console.error('Error fetching compliance records:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Create compliance record
   */
  create: async (recordData) => {
    try {
      const docRef = await addDoc(collection(db, 'government_compliance_records'), {
        ...recordData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...recordData }, error: null };
    } catch (error) {
      console.error('Error creating compliance record:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update compliance record
   */
  update: async (recordId, updates) => {
    try {
      const docRef = doc(db, 'government_compliance_records', recordId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { data: { id: recordId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating compliance record:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get compliance statistics
   */
  getStatistics: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'government_compliance_records'));
      const records = snapshot.docs.map(doc => doc.data());

      const stats = {
        total: records.length,
        compliant: records.filter(r => r.status === 'compliant').length,
        nonCompliant: records.filter(r => r.status === 'non-compliant').length,
        pending: records.filter(r => r.status === 'pending-review').length
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { data: null, error: error.message };
    }
  }
};

// ============================================
// Emergency Service
// ============================================
export const emergencyService = {
  /**
   * Get emergency incidents
   */
  getIncidents: async (filters = {}) => {
    try {
      let q = collection(db, 'government_emergency_incidents');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      const incidents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: incidents, error: null };
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Create emergency incident
   */
  create: async (incidentData) => {
    try {
      const docRef = await addDoc(collection(db, 'government_emergency_incidents'), {
        ...incidentData,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...incidentData }, error: null };
    } catch (error) {
      console.error('Error creating incident:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update emergency incident
   */
  update: async (incidentId, updates) => {
    try {
      const docRef = doc(db, 'government_emergency_incidents', incidentId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { data: { id: incidentId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating incident:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get active incidents count
   */
  getActiveCount: async () => {
    try {
      const q = query(
        collection(db, 'government_emergency_incidents'),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);
      return { data: snapshot.size, error: null };
    } catch (error) {
      console.error('Error fetching active count:', error);
      return { data: 0, error: error.message };
    }
  }
};

// ============================================
// Collaboration Service
// ============================================
export const collaborationService = {
  /**
   * Get workspaces
   */
  getWorkspaces: async (userId) => {
    try {
      const q = query(
        collection(db, 'government_collaboration_workspaces'),
        where('members', 'array-contains', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const workspaces = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: workspaces, error: null };
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Get all workspaces (admin)
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'government_collaboration_workspaces');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      const workspaces = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: workspaces, error: null };
    } catch (error) {
      console.error('Error fetching all workspaces:', error);
      return { data: [], error: error.message };
    }
  },

  /**
   * Create workspace
   */
  create: async (workspaceData) => {
    try {
      const docRef = await addDoc(collection(db, 'government_collaboration_workspaces'), {
        ...workspaceData,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...workspaceData }, error: null };
    } catch (error) {
      console.error('Error creating workspace:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Join workspace
   */
  join: async (workspaceId, userId) => {
    try {
      const docRef = doc(db, 'government_collaboration_workspaces', workspaceId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const members = docSnap.data().members || [];
        if (!members.includes(userId)) {
          await updateDoc(docRef, {
            members: [...members, userId],
            updatedAt: serverTimestamp()
          });
        }
        return { data: { id: workspaceId, userId }, error: null };
      }
      return { data: null, error: 'Workspace not found' };
    } catch (error) {
      console.error('Error joining workspace:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update workspace
   */
  update: async (workspaceId, updates) => {
    try {
      const docRef = doc(db, 'government_collaboration_workspaces', workspaceId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { data: { id: workspaceId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating workspace:', error);
      return { data: null, error: error.message };
    }
  }
};

// ============================================
// RTI Request Service
// ============================================
const cleanString = (value, maxLength = 500) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

const generateRtiReference = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `RTI-${datePart}-${randomPart}`;
};

const extractRtiApplicant = (submission = {}) => {
  const fields = submission.fields || {};
  const header = submission.header || {};
  const contactInfo = submission.contactInfo || {};
  const requesterInfo = contactInfo.requestor || contactInfo.applicant || {};

  return {
    name: cleanString(
      fields.name_of_requestor ||
      fields.requestor_name ||
      fields.applicant_name ||
      fields.appellant_name ||
      header.name ||
      requesterInfo.name,
      180
    ),
    email: cleanString(
      fields.email_address ||
      fields.email ||
      fields.appellant_email ||
      requesterInfo.email,
      180
    ),
    phone: cleanString(
      fields.contact_no ||
      fields.phone ||
      fields.appellant_contact ||
      requesterInfo.phone,
      80
    )
  };
};

export const rtiRequestService = {
  submit: async (submissionData = {}) => {
    try {
      const referenceId = generateRtiReference();
      const { submittedAt: clientSubmittedAt, ...submission } = submissionData;

      const requestRecord = {
        ...submission,
        formId: cleanString(submission.formId || submission.form_id, 40),
        formName: cleanString(submission.formName || submission.form_name, 240),
        formTitle: cleanString(submission.formTitle || submission.form_title || submission.formName, 240),
        referenceId,
        applicant: extractRtiApplicant(submission),
        status: 'new',
        priority: 'normal',
        page: 'rti',
        source: 'rti-online-form',
        userAgent: cleanString(
          typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
          500
        ),
        clientSubmittedAt: cleanString(clientSubmittedAt, 80),
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'rti_requests'), requestRecord);
      return {
        data: {
          id: docRef.id,
          referenceId,
          formId: requestRecord.formId,
          status: requestRecord.status
        },
        error: null
      };
    } catch (error) {
      console.error('Error submitting RTI request:', error);
      return { data: null, error: error.message };
    }
  },

  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'rti_requests');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.formId) {
        q = query(q, where('formId', '==', filters.formId));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: requests, error: null };
    } catch (error) {
      console.error('Error fetching RTI requests:', error);
      return { data: [], error: error.message };
    }
  },

  update: async (requestId, updates) => {
    try {
      const docRef = doc(db, 'rti_requests', requestId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { data: { id: requestId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating RTI request:', error);
      return { data: null, error: error.message };
    }
  }
};

// ============================================
// Dashboard Service
// ============================================
export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStatistics: async () => {
    try {
      const [eiaStats, licenseStats, complianceStats, emergencyStats] = await Promise.all([
        eiaService.getAll({ limit: 1000 }),
        licensingService.getAll({ limit: 1000 }),
        complianceService.getStatistics(),
        emergencyService.getActiveCount()
      ]);

      const stats = {
        eia: {
          total: eiaStats.data?.length || 0,
          pending: eiaStats.data?.filter(e => e.status === 'submitted').length || 0,
          approved: eiaStats.data?.filter(e => e.status === 'approved').length || 0,
          rejected: eiaStats.data?.filter(e => e.status === 'rejected').length || 0
        },
        licenses: {
          total: licenseStats.data?.length || 0,
          active: licenseStats.data?.filter(l => l.status === 'active').length || 0,
          pending: licenseStats.data?.filter(l => l.status === 'pending').length || 0,
          expired: licenseStats.data?.filter(l => l.status === 'expired').length || 0
        },
        compliance: complianceStats.data || {},
        emergencies: {
          active: emergencyStats.data || 0
        }
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return { data: null, error: error.message };
    }
  }
};
