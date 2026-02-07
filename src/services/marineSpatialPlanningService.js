/**
 * Marine Spatial Planning Service
 *
 * Manages marine spatial planning data, zones, and conflict detection
 * for NARA Digital Ocean Platform
 *
 * Service Modules:
 * 1. Spatial Zone Service - Manage planning zones (fishing, protected, shipping, etc.)
 * 2. Conflict Detection Service - Identify overlapping zones and conflicts
 * 3. Planning Proposal Service - Manage spatial planning proposals
 * 4. Stakeholder Consultation Service - Track stakeholder feedback
 * 5. Environmental Impact Service - Assess environmental impacts
 * 6. MSP Dashboard Service - Analytics and reporting
 * 7. Export Service - Export spatial data in various formats
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
  GeoPoint
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ========== 1. SPATIAL ZONE SERVICE ==========

/**
 * Manages marine spatial planning zones
 */
export const spatialZoneService = {
  /**
   * Create a new spatial zone
   */
  create: async (zoneData) => {
    try {
      const zoneId = `ZONE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Convert coordinates to GeoPoints
      const boundaries = zoneData.boundaries.map(coord =>
        new GeoPoint(coord.lat, coord.lng)
      );

      const dataToSave = {
        zoneId,
        ...zoneData,
        boundaries,
        status: zoneData.status || 'proposed',
        areaKm2: zoneData.areaKm2 || 0,
        conflicts: [],
        stakeholderConsultations: 0,
        environmentalImpactAssessed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'marine_spatial_zones'), dataToSave);
      return { data: { id: docRef.id, zoneId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating spatial zone:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get all spatial zones
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'marine_spatial_zones');

      if (filters.zoneType) {
        q = query(q, where('zoneType', '==', filters.zoneType));
      }

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      const zones = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: zones, error: null };
    } catch (error) {
      console.error('Error fetching spatial zones:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get a single zone by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'marine_spatial_zones', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'Zone not found' };
      }

      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } catch (error) {
      console.error('Error fetching zone:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update a spatial zone
   */
  update: async (id, updates) => {
    try {
      const docRef = doc(db, 'marine_spatial_zones', id);

      // Convert boundaries if provided
      if (updates.boundaries) {
        updates.boundaries = updates.boundaries.map(coord =>
          new GeoPoint(coord.lat, coord.lng)
        );
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating zone:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Delete a spatial zone
   */
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'marine_spatial_zones', id));
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting zone:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update zone status (proposed -> approved -> active -> inactive)
   */
  updateStatus: async (id, status, approvalNotes = '') => {
    try {
      const docRef = doc(db, 'marine_spatial_zones', id);

      const statusUpdate = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'approved') {
        statusUpdate.approvedAt = serverTimestamp();
        statusUpdate.approvalNotes = approvalNotes;
      } else if (status === 'active') {
        statusUpdate.activatedAt = serverTimestamp();
      }

      await updateDoc(docRef, statusUpdate);
      return { data: { id, status }, error: null };
    } catch (error) {
      console.error('Error updating zone status:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 2. CONFLICT DETECTION SERVICE ==========

/**
 * Detects and manages conflicts between spatial zones
 */
export const conflictDetectionService = {
  /**
   * Detect conflicts for a specific zone
   */
  detectConflicts: async (zoneId) => {
    try {
      const { data: zone, error } = await spatialZoneService.getById(zoneId);
      if (error) return { data: null, error };

      const { data: allZones } = await spatialZoneService.getAll();

      const conflicts = [];

      // Check for overlapping zones
      for (const otherZone of allZones) {
        if (otherZone.id === zoneId) continue;

        // Simple bounding box overlap check
        const overlap = checkBoundingBoxOverlap(zone.boundaries, otherZone.boundaries);

        if (overlap) {
          conflicts.push({
            conflictId: `CONFLICT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            zoneId1: zoneId,
            zoneId2: otherZone.id,
            zoneName1: zone.zoneName,
            zoneName2: otherZone.zoneName,
            zoneType1: zone.zoneType,
            zoneType2: otherZone.zoneType,
            severity: determineSeverity(zone.zoneType, otherZone.zoneType),
            overlapPercentage: overlap.percentage,
            detectedAt: new Date().toISOString(),
            status: 'unresolved'
          });
        }
      }

      // Store conflicts
      if (conflicts.length > 0) {
        await updateDoc(doc(db, 'marine_spatial_zones', zoneId), {
          conflicts,
          hasConflicts: true,
          conflictCount: conflicts.length,
          updatedAt: serverTimestamp()
        });
      }

      return { data: conflicts, error: null };
    } catch (error) {
      console.error('Error detecting conflicts:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get all conflicts
   */
  getAllConflicts: async () => {
    try {
      const q = query(
        collection(db, 'marine_spatial_zones'),
        where('hasConflicts', '==', true)
      );

      const snapshot = await getDocs(q);
      const allConflicts = [];

      snapshot.docs.forEach(doc => {
        const zone = doc.data();
        if (zone.conflicts) {
          allConflicts.push(...zone.conflicts.map(c => ({
            ...c,
            zoneDocId: doc.id
          })));
        }
      });

      return { data: allConflicts, error: null };
    } catch (error) {
      console.error('Error fetching conflicts:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Resolve a conflict
   */
  resolveConflict: async (zoneId, conflictId, resolution) => {
    try {
      const docRef = doc(db, 'marine_spatial_zones', zoneId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'Zone not found' };
      }

      const zone = docSnap.data();
      const updatedConflicts = zone.conflicts.map(c => {
        if (c.conflictId === conflictId) {
          return {
            ...c,
            status: 'resolved',
            resolution,
            resolvedAt: new Date().toISOString()
          };
        }
        return c;
      });

      const unresolvedCount = updatedConflicts.filter(c => c.status === 'unresolved').length;

      await updateDoc(docRef, {
        conflicts: updatedConflicts,
        hasConflicts: unresolvedCount > 0,
        conflictCount: unresolvedCount,
        updatedAt: serverTimestamp()
      });

      return { data: { conflictId, resolution }, error: null };
    } catch (error) {
      console.error('Error resolving conflict:', error);
      return { data: null, error: error.message };
    }
  }
};

// Helper functions for conflict detection
function checkBoundingBoxOverlap(boundaries1, boundaries2) {
  // Convert GeoPoints to coordinates
  const coords1 = boundaries1.map(gp => ({ lat: gp.latitude, lng: gp.longitude }));
  const coords2 = boundaries2.map(gp => ({ lat: gp.latitude, lng: gp.longitude }));

  // Get bounding boxes
  const box1 = getBoundingBox(coords1);
  const box2 = getBoundingBox(coords2);

  // Check overlap
  const latOverlap = box1.maxLat >= box2.minLat && box1.minLat <= box2.maxLat;
  const lngOverlap = box1.maxLng >= box2.minLng && box1.minLng <= box2.maxLng;

  if (latOverlap && lngOverlap) {
    // Calculate approximate overlap percentage
    const overlapArea = calculateOverlapArea(box1, box2);
    const area1 = (box1.maxLat - box1.minLat) * (box1.maxLng - box1.minLng);
    const percentage = Math.round((overlapArea / area1) * 100);
    return { overlap: true, percentage };
  }

  return null;
}

function getBoundingBox(coords) {
  return {
    minLat: Math.min(...coords.map(c => c.lat)),
    maxLat: Math.max(...coords.map(c => c.lat)),
    minLng: Math.min(...coords.map(c => c.lng)),
    maxLng: Math.max(...coords.map(c => c.lng))
  };
}

function calculateOverlapArea(box1, box2) {
  const latOverlap = Math.min(box1.maxLat, box2.maxLat) - Math.max(box1.minLat, box2.minLat);
  const lngOverlap = Math.min(box1.maxLng, box2.maxLng) - Math.max(box1.minLng, box2.minLng);
  return Math.max(0, latOverlap) * Math.max(0, lngOverlap);
}

function determineSeverity(type1, type2) {
  const highConflictPairs = [
    ['protected_area', 'fishing_zone'],
    ['protected_area', 'shipping_lane'],
    ['military_zone', 'fishing_zone'],
    ['oil_exploration', 'protected_area']
  ];

  const isHighConflict = highConflictPairs.some(pair =>
    (pair[0] === type1 && pair[1] === type2) || (pair[0] === type2 && pair[1] === type1)
  );

  return isHighConflict ? 'high' : 'medium';
}

// ========== 3. PLANNING PROPOSAL SERVICE ==========

/**
 * Manages spatial planning proposals
 */
export const planningProposalService = {
  /**
   * Submit a new planning proposal
   */
  submit: async (proposalData) => {
    try {
      const proposalId = `PROPOSAL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        proposalId,
        ...proposalData,
        status: 'submitted',
        approvals: [],
        publicComments: [],
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'msp_proposals'), dataToSave);
      return { data: { id: docRef.id, proposalId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error submitting proposal:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get all proposals
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'msp_proposals');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('submittedAt', 'desc'));

      const snapshot = await getDocs(q);
      const proposals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: proposals, error: null };
    } catch (error) {
      console.error('Error fetching proposals:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Add public comment to proposal
   */
  addComment: async (proposalId, comment) => {
    try {
      const docRef = doc(db, 'msp_proposals', proposalId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'Proposal not found' };
      }

      const proposal = docSnap.data();
      const newComment = {
        commentId: `COMMENT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        ...comment,
        submittedAt: new Date().toISOString()
      };

      const updatedComments = [...(proposal.publicComments || []), newComment];

      await updateDoc(docRef, {
        publicComments: updatedComments,
        updatedAt: serverTimestamp()
      });

      return { data: newComment, error: null };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Approve or reject proposal
   */
  updateStatus: async (proposalId, status, approverNotes = '') => {
    try {
      const docRef = doc(db, 'msp_proposals', proposalId);

      const statusUpdate = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'approved') {
        statusUpdate.approvedAt = serverTimestamp();
        statusUpdate.approverNotes = approverNotes;
      } else if (status === 'rejected') {
        statusUpdate.rejectedAt = serverTimestamp();
        statusUpdate.rejectionReason = approverNotes;
      }

      await updateDoc(docRef, statusUpdate);
      return { data: { proposalId, status }, error: null };
    } catch (error) {
      console.error('Error updating proposal status:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 4. STAKEHOLDER CONSULTATION SERVICE ==========

/**
 * Manages stakeholder consultations
 */
export const stakeholderConsultationService = {
  /**
   * Create a consultation event
   */
  create: async (consultationData) => {
    try {
      const consultationId = `CONSULT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        consultationId,
        ...consultationData,
        status: 'scheduled',
        attendees: [],
        feedback: [],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'stakeholder_consultations'), dataToSave);
      return { data: { id: docRef.id, consultationId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating consultation:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Add feedback to consultation
   */
  addFeedback: async (consultationId, feedbackData) => {
    try {
      const docRef = doc(db, 'stakeholder_consultations', consultationId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'Consultation not found' };
      }

      const consultation = docSnap.data();
      const newFeedback = {
        feedbackId: `FEEDBACK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        ...feedbackData,
        submittedAt: new Date().toISOString()
      };

      const updatedFeedback = [...(consultation.feedback || []), newFeedback];

      await updateDoc(docRef, {
        feedback: updatedFeedback,
        updatedAt: serverTimestamp()
      });

      return { data: newFeedback, error: null };
    } catch (error) {
      console.error('Error adding feedback:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 5. ENVIRONMENTAL IMPACT SERVICE ==========

/**
 * Manages environmental impact assessments
 */
export const environmentalImpactService = {
  /**
   * Create environmental impact assessment
   */
  assess: async (zoneId, assessmentData) => {
    try {
      const assessmentId = `EIA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        assessmentId,
        zoneId,
        ...assessmentData,
        status: 'in_progress',
        mitigationMeasures: assessmentData.mitigationMeasures || [],
        assessedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'environmental_impact_assessments'), dataToSave);

      // Update zone with EIA status
      await updateDoc(doc(db, 'marine_spatial_zones', zoneId), {
        environmentalImpactAssessed: true,
        eiaId: assessmentId,
        updatedAt: serverTimestamp()
      });

      return { data: { id: docRef.id, assessmentId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating assessment:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get assessment for a zone
   */
  getByZoneId: async (zoneId) => {
    try {
      const q = query(
        collection(db, 'environmental_impact_assessments'),
        where('zoneId', '==', zoneId)
      );

      const snapshot = await getDocs(q);
      const assessments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: assessments, error: null };
    } catch (error) {
      console.error('Error fetching assessment:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 6. MSP DASHBOARD SERVICE ==========

/**
 * Provides dashboard analytics
 */
export const mspDashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStats: async () => {
    try {
      const zonesSnapshot = await getDocs(collection(db, 'marine_spatial_zones'));
      const proposalsSnapshot = await getDocs(collection(db, 'msp_proposals'));
      const consultationsSnapshot = await getDocs(collection(db, 'stakeholder_consultations'));

      const zones = zonesSnapshot.docs.map(doc => doc.data());
      const proposals = proposalsSnapshot.docs.map(doc => doc.data());

      const stats = {
        totalZones: zones.length,
        activeZones: zones.filter(z => z.status === 'active').length,
        proposedZones: zones.filter(z => z.status === 'proposed').length,
        totalAreaKm2: zones.reduce((sum, z) => sum + (z.areaKm2 || 0), 0),

        zonesByType: {},
        conflictsCount: zones.filter(z => z.hasConflicts).length,

        totalProposals: proposals.length,
        approvedProposals: proposals.filter(p => p.status === 'approved').length,
        pendingProposals: proposals.filter(p => p.status === 'submitted').length,

        totalConsultations: consultationsSnapshot.size
      };

      // Zone type breakdown
      zones.forEach(zone => {
        stats.zonesByType[zone.zoneType] = (stats.zonesByType[zone.zoneType] || 0) + 1;
      });

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 7. EXPORT SERVICE ==========

/**
 * Export spatial planning data
 */
export const mspExportService = {
  /**
   * Export zones as GeoJSON
   */
  exportGeoJSON: async (filters = {}) => {
    try {
      const { data: zones, error } = await spatialZoneService.getAll(filters);
      if (error) return { data: null, error };

      const features = zones.map(zone => ({
        type: 'Feature',
        properties: {
          zoneId: zone.zoneId,
          zoneName: zone.zoneName,
          zoneType: zone.zoneType,
          status: zone.status,
          areaKm2: zone.areaKm2
        },
        geometry: {
          type: 'Polygon',
          coordinates: [zone.boundaries.map(gp => [gp.longitude, gp.latitude])]
        }
      }));

      const geoJSON = {
        type: 'FeatureCollection',
        features
      };

      return {
        data: {
          geojson: JSON.stringify(geoJSON, null, 2),
          filename: `marine_spatial_zones_${Date.now()}.geojson`
        },
        error: null
      };
    } catch (error) {
      console.error('Error exporting GeoJSON:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Export zones as KML
   */
  exportKML: async (filters = {}) => {
    try {
      const { data: zones, error } = await spatialZoneService.getAll(filters);
      if (error) return { data: null, error };

      let kml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      kml += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
      kml += '  <Document>\n';
      kml += '    <name>Marine Spatial Zones</name>\n';

      zones.forEach(zone => {
        kml += '    <Placemark>\n';
        kml += `      <name>${zone.zoneName}</name>\n`;
        kml += `      <description>${zone.description || ''}</description>\n`;
        kml += '      <Polygon>\n';
        kml += '        <outerBoundaryIs>\n';
        kml += '          <LinearRing>\n';
        kml += '            <coordinates>\n';

        zone.boundaries.forEach(gp => {
          kml += `              ${gp.longitude},${gp.latitude},0\n`;
        });

        kml += '            </coordinates>\n';
        kml += '          </LinearRing>\n';
        kml += '        </outerBoundaryIs>\n';
        kml += '      </Polygon>\n';
        kml += '    </Placemark>\n';
      });

      kml += '  </Document>\n';
      kml += '</kml>';

      return {
        data: {
          kml,
          filename: `marine_spatial_zones_${Date.now()}.kml`
        },
        error: null
      };
    } catch (error) {
      console.error('Error exporting KML:', error);
      return { data: null, error: error.message };
    }
  }
};

export default {
  spatialZoneService,
  conflictDetectionService,
  planningProposalService,
  stakeholderConsultationService,
  environmentalImpactService,
  mspDashboardService,
  mspExportService
};
