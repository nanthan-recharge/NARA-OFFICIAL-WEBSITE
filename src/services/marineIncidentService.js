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
  serverTimestamp,
  GeoPoint
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ============================================
// Marine Incidents Service
// ============================================

export const marineIncidentsService = {
  /**
   * Get all marine incidents with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'marine_incidents');
      const queryConstraints = [orderBy('reportedDate', 'desc')];

      if (filters.incidentType) {
        queryConstraints.unshift(where('incidentType', '==', filters.incidentType));
      }

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.severity) {
        queryConstraints.unshift(where('severity', '==', filters.severity));
      }

      if (filters.assignedDivision) {
        queryConstraints.unshift(where('assignedDivision', '==', filters.assignedDivision));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const incidents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore GeoPoint to plain object
        location: doc.data().location ? {
          latitude: doc.data().location.latitude,
          longitude: doc.data().location.longitude
        } : null
      }));

      return { data: incidents, error: null };
    } catch (error) {
      console.error('Error getting incidents:', error);
      return { data: [], error };
    }
  },

  /**
   * Get incident by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'marine_incidents', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Incident not found') };
      }

      // Increment view count
      await updateDoc(docRef, {
        viewCount: (docSnap.data().viewCount || 0) + 1
      });

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data(),
          location: docSnap.data().location ? {
            latitude: docSnap.data().location.latitude,
            longitude: docSnap.data().location.longitude
          } : null
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting incident:', error);
      return { data: null, error };
    }
  },

  /**
   * Create marine incident report
   */
  create: async (incidentData) => {
    try {
      // Generate unique incident ID
      const incidentId = `INC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Convert location to GeoPoint if provided
      const dataToSave = {
        ...incidentData,
        incidentId,
        status: 'reported',
        severity: incidentData.severity || 'medium',
        viewCount: 0,
        reportedDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Handle location conversion
      if (incidentData.location && incidentData.location.latitude && incidentData.location.longitude) {
        dataToSave.location = new GeoPoint(
          incidentData.location.latitude,
          incidentData.location.longitude
        );
      }

      const docRef = await addDoc(collection(db, 'marine_incidents'), dataToSave);

      return {
        data: {
          id: docRef.id,
          incidentId,
          ...incidentData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating incident:', error);
      return { data: null, error };
    }
  },

  /**
   * Update incident
   */
  update: async (id, incidentData) => {
    try {
      const docRef = doc(db, 'marine_incidents', id);

      const updateData = {
        ...incidentData,
        updatedAt: serverTimestamp()
      };

      // Handle location conversion
      if (incidentData.location && incidentData.location.latitude && incidentData.location.longitude) {
        updateData.location = new GeoPoint(
          incidentData.location.latitude,
          incidentData.location.longitude
        );
      }

      await updateDoc(docRef, updateData);
      return { data: { id, ...incidentData }, error: null };
    } catch (error) {
      console.error('Error updating incident:', error);
      return { data: null, error };
    }
  },

  /**
   * Update incident status with triage notes
   */
  updateStatus: async (id, status, triageNotes = '', assignedDivision = null, assignedTo = null) => {
    try {
      const docRef = doc(db, 'marine_incidents', id);

      const updateData = {
        status,
        updatedAt: serverTimestamp()
      };

      if (triageNotes) {
        updateData.triageNotes = triageNotes;
      }

      if (assignedDivision) {
        updateData.assignedDivision = assignedDivision;
      }

      if (assignedTo) {
        updateData.assignedTo = assignedTo;
      }

      if (status === 'under_investigation') {
        updateData.investigationStartDate = serverTimestamp();
      }

      if (status === 'resolved') {
        updateData.resolvedDate = serverTimestamp();
      }

      await updateDoc(docRef, updateData);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating incident status:', error);
      return { data: null, error };
    }
  },

  /**
   * Add response update to incident
   */
  addResponseUpdate: async (id, updateText, updatedBy) => {
    try {
      const docRef = doc(db, 'marine_incidents', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Incident not found') };
      }

      const existingUpdates = docSnap.data().responseUpdates || [];
      const newUpdate = {
        updateId: `UPD-${Date.now()}`,
        text: updateText,
        updatedBy,
        timestamp: new Date().toISOString()
      };

      await updateDoc(docRef, {
        responseUpdates: [...existingUpdates, newUpdate],
        updatedAt: serverTimestamp()
      });

      return { data: { success: true, update: newUpdate }, error: null };
    } catch (error) {
      console.error('Error adding response update:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete incident
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'marine_incidents', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting incident:', error);
      return { data: null, error };
    }
  },

  /**
   * Get incidents by geographic bounds (for map filtering)
   */
  getByBounds: async (bounds) => {
    try {
      // Note: Firestore doesn't support geospatial queries directly
      // We fetch all incidents and filter client-side
      const { data: incidents, error } = await marineIncidentsService.getAll();

      if (error) return { data: [], error };

      const filtered = incidents.filter(incident => {
        if (!incident.location) return false;

        const { latitude, longitude } = incident.location;
        return (
          latitude >= bounds.south &&
          latitude <= bounds.north &&
          longitude >= bounds.west &&
          longitude <= bounds.east
        );
      });

      return { data: filtered, error: null };
    } catch (error) {
      console.error('Error getting incidents by bounds:', error);
      return { data: [], error };
    }
  }
};

// ============================================
// Citizen Science Observations Service
// ============================================

export const citizenScienceService = {
  /**
   * Get all citizen science observations
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'citizen_science_observations');
      const queryConstraints = [orderBy('observationDate', 'desc')];

      if (filters.observationType) {
        queryConstraints.unshift(where('observationType', '==', filters.observationType));
      }

      if (filters.verified !== undefined) {
        queryConstraints.unshift(where('verified', '==', filters.verified));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const observations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        location: doc.data().location ? {
          latitude: doc.data().location.latitude,
          longitude: doc.data().location.longitude
        } : null
      }));

      return { data: observations, error: null };
    } catch (error) {
      console.error('Error getting observations:', error);
      return { data: [], error };
    }
  },

  /**
   * Create citizen science observation
   */
  create: async (observationData) => {
    try {
      const observationId = `OBS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ...observationData,
        observationId,
        verified: false,
        likes: 0,
        observationDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (observationData.location && observationData.location.latitude && observationData.location.longitude) {
        dataToSave.location = new GeoPoint(
          observationData.location.latitude,
          observationData.location.longitude
        );
      }

      const docRef = await addDoc(collection(db, 'citizen_science_observations'), dataToSave);

      return {
        data: {
          id: docRef.id,
          observationId,
          ...observationData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating observation:', error);
      return { data: null, error };
    }
  },

  /**
   * Verify observation (admin)
   */
  verify: async (id, verifiedBy, verificationNotes = '') => {
    try {
      const docRef = doc(db, 'citizen_science_observations', id);

      await updateDoc(docRef, {
        verified: true,
        verifiedBy,
        verificationNotes,
        verifiedDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error verifying observation:', error);
      return { data: null, error };
    }
  },

  /**
   * Like observation
   */
  like: async (id) => {
    try {
      const docRef = doc(db, 'citizen_science_observations', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          likes: (docSnap.data().likes || 0) + 1
        });
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error liking observation:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Dashboard Service
// ============================================

export const marineIncidentDashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStatistics: async () => {
    try {
      const [incidentsResult, observationsResult] = await Promise.all([
        marineIncidentsService.getAll(),
        citizenScienceService.getAll()
      ]);

      const incidents = incidentsResult.data || [];
      const observations = observationsResult.data || [];

      // Calculate incident statistics
      const incidentsByType = incidents.reduce((acc, incident) => {
        acc[incident.incidentType] = (acc[incident.incidentType] || 0) + 1;
        return acc;
      }, {});

      const incidentsByStatus = incidents.reduce((acc, incident) => {
        acc[incident.status] = (acc[incident.status] || 0) + 1;
        return acc;
      }, {});

      const incidentsBySeverity = incidents.reduce((acc, incident) => {
        acc[incident.severity] = (acc[incident.severity] || 0) + 1;
        return acc;
      }, {});

      // Calculate observation statistics
      const observationsByType = observations.reduce((acc, obs) => {
        acc[obs.observationType] = (acc[obs.observationType] || 0) + 1;
        return acc;
      }, {});

      const stats = {
        overview: {
          totalIncidents: incidents.length,
          totalObservations: observations.length,
          activeIncidents: incidents.filter(i => i.status === 'under_investigation').length,
          resolvedIncidents: incidents.filter(i => i.status === 'resolved').length,
          verifiedObservations: observations.filter(o => o.verified).length
        },
        recentIncidents: incidents.slice(0, 10),
        recentObservations: observations.slice(0, 10),
        incidentsByType,
        incidentsByStatus,
        incidentsBySeverity,
        observationsByType,
        criticalIncidents: incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').slice(0, 5)
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting dashboard statistics:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// File Upload Service
// ============================================

export const marineIncidentFileService = {
  /**
   * Upload incident photo
   */
  uploadPhoto: async (file, incidentId) => {
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `marine_incidents/${incidentId}/${filename}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return { data: { url: downloadURL, path: storageRef.fullPath }, error: null };
    } catch (error) {
      console.error('Error uploading photo:', error);
      return { data: null, error };
    }
  },

  /**
   * Upload multiple photos
   */
  uploadMultiplePhotos: async (files, incidentId) => {
    try {
      const uploadPromises = files.map(file =>
        marineIncidentFileService.uploadPhoto(file, incidentId)
      );

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(r => !r.error).map(r => r.data);

      return { data: successfulUploads, error: null };
    } catch (error) {
      console.error('Error uploading multiple photos:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete photo from storage
   */
  deletePhoto: async (photoPath) => {
    try {
      const fileRef = ref(storage, photoPath);
      await deleteObject(fileRef);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting photo:', error);
      return { data: null, error };
    }
  }
};
