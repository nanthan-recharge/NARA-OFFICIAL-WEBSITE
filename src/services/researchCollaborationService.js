/**
 * Research Collaboration Hub Service
 *
 * Connects researchers for joint marine science projects
 * for NARA Digital Ocean Platform
 *
 * Service Modules:
 * 1. Researcher Registry - Manage researcher profiles
 * 2. Collaboration Request Service - Handle collaboration proposals
 * 3. Resource Sharing Service - Share equipment and data
 * 4. Publication Service - Track joint publications
 * 5. Funding Alert Service - Notify about opportunities
 * 6. Matchmaking Service - Algorithm-based researcher matching
 * 7. Analytics Service - Track collaboration metrics
 */

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
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ========== 1. RESEARCHER REGISTRY SERVICE ==========

export const researcherRegistryService = {
  register: async (researcherData) => {
    try {
      const researcherId = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        researcherId,
        ...researcherData,
        status: 'active',
        collaborationCount: 0,
        publicationCount: 0,
        resourcesShared: 0,
        verificationStatus: 'pending',
        registeredAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'researchers'), dataToSave);
      return { data: { id: docRef.id, researcherId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error registering researcher:', error);
      return { data: null, error: error.message };
    }
  },

  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'researchers');

      if (filters.specialization) {
        q = query(q, where('specializations', 'array-contains', filters.specialization));
      }

      if (filters.institution) {
        q = query(q, where('institution', '==', filters.institution));
      }

      q = query(q, orderBy('registeredAt', 'desc'));

      const snapshot = await getDocs(q);
      const researchers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: researchers, error: null };
    } catch (error) {
      console.error('Error fetching researchers:', error);
      return { data: null, error: error.message };
    }
  },

  getById: async (id) => {
    try {
      const docRef = doc(db, 'researchers', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'Researcher not found' };
      }

      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } catch (error) {
      console.error('Error fetching researcher:', error);
      return { data: null, error: error.message };
    }
  },

  update: async (id, updates) => {
    try {
      await updateDoc(doc(db, 'researchers', id), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating researcher:', error);
      return { data: null, error: error.message };
    }
  },

  verify: async (id, verificationStatus) => {
    try {
      await updateDoc(doc(db, 'researchers', id), {
        verificationStatus,
        verifiedAt: serverTimestamp()
      });
      return { data: { id, verificationStatus }, error: null };
    } catch (error) {
      console.error('Error verifying researcher:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 2. COLLABORATION REQUEST SERVICE ==========

export const collaborationRequestService = {
  create: async (requestData) => {
    try {
      const requestId = `COLLAB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        requestId,
        ...requestData,
        status: 'pending',
        responses: [],
        acceptedBy: [],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'collaboration_requests'), dataToSave);
      return { data: { id: docRef.id, requestId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating collaboration request:', error);
      return { data: null, error: error.message };
    }
  },

  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'collaboration_requests');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.researchArea) {
        q = query(q, where('researchArea', '==', filters.researchArea));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: requests, error: null };
    } catch (error) {
      console.error('Error fetching collaboration requests:', error);
      return { data: null, error: error.message };
    }
  },

  respond: async (requestId, researcherId, response) => {
    try {
      const q = query(
        collection(db, 'collaboration_requests'),
        where('requestId', '==', requestId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Request not found' };
      }

      const requestDoc = snapshot.docs[0];
      const request = requestDoc.data();

      const newResponse = {
        researcherId,
        response,
        respondedAt: new Date().toISOString()
      };

      const updatedResponses = [...(request.responses || []), newResponse];

      await updateDoc(doc(db, 'collaboration_requests', requestDoc.id), {
        responses: updatedResponses
      });

      if (response === 'accept') {
        await updateDoc(doc(db, 'collaboration_requests', requestDoc.id), {
          acceptedBy: [...(request.acceptedBy || []), researcherId],
          status: 'accepted'
        });

        // Update researcher collaboration counts
        const { data: requester } = await researcherRegistryService.getById(request.requesterId);
        if (requester) {
          await updateDoc(doc(db, 'researchers', request.requesterId), {
            collaborationCount: increment(1)
          });
        }

        const { data: responder } = await researcherRegistryService.getById(researcherId);
        if (responder) {
          await updateDoc(doc(db, 'researchers', researcherId), {
            collaborationCount: increment(1)
          });
        }
      }

      return { data: { requestId, response }, error: null };
    } catch (error) {
      console.error('Error responding to collaboration request:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 3. RESOURCE SHARING SERVICE ==========

export const resourceSharingService = {
  share: async (resourceData) => {
    try {
      const resourceId = `RESOURCE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        resourceId,
        ...resourceData,
        status: 'available',
        bookings: [],
        usageCount: 0,
        sharedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'shared_resources'), dataToSave);

      // Update researcher resources shared count
      await updateDoc(doc(db, 'researchers', resourceData.ownerId), {
        resourcesShared: increment(1)
      });

      return { data: { id: docRef.id, resourceId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error sharing resource:', error);
      return { data: null, error: error.message };
    }
  },

  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'shared_resources');

      if (filters.resourceType) {
        q = query(q, where('resourceType', '==', filters.resourceType));
      }

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('sharedAt', 'desc'));

      const snapshot = await getDocs(q);
      const resources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: resources, error: null };
    } catch (error) {
      console.error('Error fetching shared resources:', error);
      return { data: null, error: error.message };
    }
  },

  book: async (resourceId, bookingData) => {
    try {
      const q = query(
        collection(db, 'shared_resources'),
        where('resourceId', '==', resourceId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Resource not found' };
      }

      const resourceDoc = snapshot.docs[0];
      const resource = resourceDoc.data();

      const newBooking = {
        bookingId: `BOOKING-${Date.now()}`,
        ...bookingData,
        bookedAt: new Date().toISOString()
      };

      const updatedBookings = [...(resource.bookings || []), newBooking];

      await updateDoc(doc(db, 'shared_resources', resourceDoc.id), {
        bookings: updatedBookings,
        usageCount: increment(1)
      });

      return { data: newBooking, error: null };
    } catch (error) {
      console.error('Error booking resource:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 4. PUBLICATION SERVICE ==========

export const publicationService = {
  add: async (publicationData) => {
    try {
      const publicationId = `PUB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        publicationId,
        ...publicationData,
        citations: 0,
        publishedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'joint_publications'), dataToSave);

      // Update publication count for all co-authors
      if (publicationData.coAuthors) {
        for (const authorId of publicationData.coAuthors) {
          const q = query(
            collection(db, 'researchers'),
            where('researcherId', '==', authorId)
          );
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            await updateDoc(doc(db, 'researchers', snapshot.docs[0].id), {
              publicationCount: increment(1)
            });
          }
        }
      }

      return { data: { id: docRef.id, publicationId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error adding publication:', error);
      return { data: null, error: error.message };
    }
  },

  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'joint_publications');

      if (filters.researchArea) {
        q = query(q, where('researchArea', '==', filters.researchArea));
      }

      q = query(q, orderBy('publishedAt', 'desc'));

      const snapshot = await getDocs(q);
      const publications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: publications, error: null };
    } catch (error) {
      console.error('Error fetching publications:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 5. FUNDING ALERT SERVICE ==========

export const fundingAlertService = {
  create: async (alertData) => {
    try {
      const alertId = `FUNDING-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        alertId,
        ...alertData,
        status: 'active',
        applicants: [],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'funding_opportunities'), dataToSave);
      return { data: { id: docRef.id, alertId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating funding alert:', error);
      return { data: null, error: error.message };
    }
  },

  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'funding_opportunities');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.fundingType) {
        q = query(q, where('fundingType', '==', filters.fundingType));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      const opportunities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: opportunities, error: null };
    } catch (error) {
      console.error('Error fetching funding opportunities:', error);
      return { data: null, error: error.message };
    }
  },

  apply: async (alertId, researcherId) => {
    try {
      const q = query(
        collection(db, 'funding_opportunities'),
        where('alertId', '==', alertId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Funding opportunity not found' };
      }

      const alertDoc = snapshot.docs[0];
      const alert = alertDoc.data();

      const updatedApplicants = [...(alert.applicants || []), researcherId];

      await updateDoc(doc(db, 'funding_opportunities', alertDoc.id), {
        applicants: updatedApplicants
      });

      return { data: { alertId, researcherId }, error: null };
    } catch (error) {
      console.error('Error applying for funding:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 6. MATCHMAKING SERVICE ==========

export const matchmakingService = {
  findMatches: async (researcherId) => {
    try {
      const { data: researcher } = await researcherRegistryService.getById(researcherId);
      if (!researcher) {
        return { data: null, error: 'Researcher not found' };
      }

      const { data: allResearchers } = await researcherRegistryService.getAll();

      const matches = [];

      allResearchers.forEach(other => {
        if (other.id === researcherId) return;

        let matchScore = 0;

        // Match on specializations
        const commonSpecializations = researcher.specializations?.filter(
          spec => other.specializations?.includes(spec)
        ) || [];
        matchScore += commonSpecializations.length * 30;

        // Match on research interests
        const commonInterests = researcher.researchInterests?.filter(
          interest => other.researchInterests?.includes(interest)
        ) || [];
        matchScore += commonInterests.length * 20;

        // Boost score for verified researchers
        if (other.verificationStatus === 'verified') {
          matchScore += 10;
        }

        // Boost score for active collaborators
        if (other.collaborationCount > 5) {
          matchScore += 15;
        }

        if (matchScore > 30) {
          matches.push({
            researcher: other,
            matchScore,
            commonSpecializations,
            commonInterests
          });
        }
      });

      // Sort by match score
      matches.sort((a, b) => b.matchScore - a.matchScore);

      return { data: matches.slice(0, 10), error: null };
    } catch (error) {
      console.error('Error finding matches:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 7. ANALYTICS SERVICE ==========

export const collaborationAnalyticsService = {
  getStats: async () => {
    try {
      const researchersSnapshot = await getDocs(collection(db, 'researchers'));
      const collaborationsSnapshot = await getDocs(collection(db, 'collaboration_requests'));
      const publicationsSnapshot = await getDocs(collection(db, 'joint_publications'));
      const resourcesSnapshot = await getDocs(collection(db, 'shared_resources'));

      const researchers = researchersSnapshot.docs.map(doc => doc.data());
      const collaborations = collaborationsSnapshot.docs.map(doc => doc.data());
      const publications = publicationsSnapshot.docs.map(doc => doc.data());

      const stats = {
        totalResearchers: researchers.length,
        verifiedResearchers: researchers.filter(r => r.verificationStatus === 'verified').length,
        activeResearchers: researchers.filter(r => r.status === 'active').length,

        totalCollaborations: collaborations.length,
        activeCollaborations: collaborations.filter(c => c.status === 'accepted').length,
        pendingRequests: collaborations.filter(c => c.status === 'pending').length,

        totalPublications: publications.length,
        totalCitations: publications.reduce((sum, p) => sum + (p.citations || 0), 0),

        totalResourcesShared: resourcesSnapshot.size,

        topSpecializations: {}
      };

      // Specialization breakdown
      researchers.forEach(researcher => {
        researcher.specializations?.forEach(spec => {
          stats.topSpecializations[spec] = (stats.topSpecializations[spec] || 0) + 1;
        });
      });

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching collaboration analytics:', error);
      return { data: null, error: error.message };
    }
  }
};

export default {
  researcherRegistryService,
  collaborationRequestService,
  resourceSharingService,
  publicationService,
  fundingAlertService,
  matchmakingService,
  collaborationAnalyticsService
};
