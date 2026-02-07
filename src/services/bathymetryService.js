// NARA Bathymetry Data Management Service
// Upload, process, and visualize ocean depth data

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  GeoPoint
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ==================== BATHYMETRY DATASET SERVICE ====================
// Manage bathymetric survey datasets

export const bathymetryDatasetService = {
  // Upload new bathymetry dataset
  upload: async (datasetInfo, dataFile) => {
    try {
      const datasetId = `BATH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Upload data file to Firebase Storage
      const fileName = `${datasetId}_${dataFile.name}`;
      const storageRef = ref(storage, `bathymetry_data/${datasetId}/${fileName}`);
      await uploadBytes(storageRef, dataFile);
      const downloadURL = await getDownloadURL(storageRef);

      // Create dataset metadata
      const datasetMetadata = {
        datasetId,
        ...datasetInfo,
        fileName: dataFile.name,
        fileSize: dataFile.size,
        fileType: dataFile.type,
        downloadURL,
        storagePath: `bathymetry_data/${datasetId}/${fileName}`,
        status: 'processing', // 'processing' | 'ready' | 'error'
        processingStatus: 'pending',
        visualizationReady: false,
        uploadedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Store metadata in Firestore
      const docRef = await addDoc(collection(db, 'bathymetry_datasets'), datasetMetadata);

      return {
        data: {
          id: docRef.id,
          datasetId,
          downloadURL,
          ...datasetMetadata
        },
        error: null
      };
    } catch (error) {
      console.error('Error uploading bathymetry dataset:', error);
      return { data: null, error };
    }
  },

  // Update dataset processing status
  updateProcessingStatus: async (id, status, metadata = {}) => {
    try {
      const docRef = doc(db, 'bathymetry_datasets', id);
      const updateData = {
        processingStatus: status,
        ...metadata,
        updatedAt: serverTimestamp()
      };

      if (status === 'completed') {
        updateData.status = 'ready';
        updateData.visualizationReady = true;
        updateData.processedAt = serverTimestamp();
      } else if (status === 'error') {
        updateData.status = 'error';
      }

      await updateDoc(docRef, updateData);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating processing status:', error);
      return { data: null, error };
    }
  },

  // Store processed depth data
  storeDepthData: async (datasetId, depthData) => {
    try {
      const docRef = doc(db, 'bathymetry_datasets', datasetId);
      await updateDoc(docRef, {
        depthData: depthData, // Array of {lat, lon, depth}
        dataPoints: depthData.length,
        minDepth: Math.min(...depthData.map(d => d.depth)),
        maxDepth: Math.max(...depthData.map(d => d.depth)),
        averageDepth: depthData.reduce((sum, d) => sum + d.depth, 0) / depthData.length,
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error storing depth data:', error);
      return { data: null, error };
    }
  },

  // Get all datasets
  getAll: async (filters = {}) => {
    try {
      let queryConstraints = [orderBy('uploadedAt', 'desc')];

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.surveyArea) {
        queryConstraints.unshift(where('surveyArea', '==', filters.surveyArea));
      }

      if (filters.limit) {
        queryConstraints.push(firestoreLimit(filters.limit));
      }

      const q = query(collection(db, 'bathymetry_datasets'), ...queryConstraints);
      const snapshot = await getDocs(q);

      const datasets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate().toISOString(),
        createdAt: doc.data().createdAt?.toDate().toISOString()
      }));

      return { data: datasets, error: null };
    } catch (error) {
      console.error('Error fetching datasets:', error);
      return { data: [], error };
    }
  },

  // Get dataset by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, 'bathymetry_datasets', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Dataset not found') };
      }

      const data = docSnap.data();
      return {
        data: {
          id: docSnap.id,
          ...data,
          uploadedAt: data.uploadedAt?.toDate().toISOString(),
          createdAt: data.createdAt?.toDate().toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching dataset:', error);
      return { data: null, error };
    }
  },

  // Delete dataset
  delete: async (id) => {
    try {
      const docRef = doc(db, 'bathymetry_datasets', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dataset = docSnap.data();

        // Delete file from storage
        if (dataset.storagePath) {
          const storageRef = ref(storage, dataset.storagePath);
          await deleteObject(storageRef);
        }

        // Delete metadata from Firestore
        await deleteDoc(docRef);
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting dataset:', error);
      return { data: null, error };
    }
  }
};

// ==================== SURVEY MISSION SERVICE ====================
// Manage bathymetric survey missions

export const surveyMissionService = {
  // Create survey mission
  create: async (missionData) => {
    try {
      const missionId = `MISSION-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        missionId,
        ...missionData,
        status: 'planned', // 'planned' | 'in_progress' | 'completed' | 'cancelled'
        datasets: [],
        dataPointsCollected: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Convert survey area to GeoPoint if provided
      if (missionData.surveyBounds) {
        dataToSave.surveyBounds = {
          northeast: new GeoPoint(
            missionData.surveyBounds.northeast.lat,
            missionData.surveyBounds.northeast.lng
          ),
          southwest: new GeoPoint(
            missionData.surveyBounds.southwest.lat,
            missionData.surveyBounds.southwest.lng
          )
        };
      }

      const docRef = await addDoc(collection(db, 'survey_missions'), dataToSave);
      return {
        data: {
          id: docRef.id,
          missionId,
          ...dataToSave
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating survey mission:', error);
      return { data: null, error };
    }
  },

  // Update mission status
  updateStatus: async (id, status, notes = '') => {
    try {
      const docRef = doc(db, 'survey_missions', id);
      const updateData = {
        status,
        statusNotes: notes,
        updatedAt: serverTimestamp()
      };

      if (status === 'in_progress') {
        updateData.startedAt = serverTimestamp();
      } else if (status === 'completed') {
        updateData.completedAt = serverTimestamp();
      }

      await updateDoc(docRef, updateData);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating mission status:', error);
      return { data: null, error };
    }
  },

  // Link dataset to mission
  linkDataset: async (missionId, datasetId) => {
    try {
      const docRef = doc(db, 'survey_missions', missionId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Mission not found') };
      }

      const mission = docSnap.data();
      const existingDatasets = mission.datasets || [];

      await updateDoc(docRef, {
        datasets: [...existingDatasets, datasetId],
        updatedAt: serverTimestamp()
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error linking dataset to mission:', error);
      return { data: null, error };
    }
  },

  // Get all missions
  getAll: async (filters = {}) => {
    try {
      let queryConstraints = [orderBy('createdAt', 'desc')];

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      const q = query(collection(db, 'survey_missions'), ...queryConstraints);
      const snapshot = await getDocs(q);

      const missions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString()
      }));

      return { data: missions, error: null };
    } catch (error) {
      console.error('Error fetching missions:', error);
      return { data: [], error };
    }
  },

  // Get mission by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, 'survey_missions', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Mission not found') };
      }

      const data = docSnap.data();
      return {
        data: {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching mission:', error);
      return { data: null, error };
    }
  }
};

// ==================== DEPTH CONTOUR SERVICE ====================
// Generate and manage depth contours

export const depthContourService = {
  // Generate contours from depth data
  generateContours: async (datasetId, contourInterval = 10) => {
    try {
      const docRef = doc(db, 'bathymetry_datasets', datasetId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Dataset not found') };
      }

      const dataset = docSnap.data();
      const depthData = dataset.depthData || [];

      if (depthData.length === 0) {
        return { data: null, error: new Error('No depth data available') };
      }

      // Generate contour levels
      const minDepth = Math.floor(dataset.minDepth / contourInterval) * contourInterval;
      const maxDepth = Math.ceil(dataset.maxDepth / contourInterval) * contourInterval;
      const contourLevels = [];

      for (let depth = minDepth; depth <= maxDepth; depth += contourInterval) {
        contourLevels.push(depth);
      }

      // Store contour metadata
      await updateDoc(docRef, {
        contours: {
          levels: contourLevels,
          interval: contourInterval,
          generatedAt: new Date().toISOString()
        },
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          levels: contourLevels,
          interval: contourInterval
        },
        error: null
      };
    } catch (error) {
      console.error('Error generating contours:', error);
      return { data: null, error };
    }
  },

  // Get contours for dataset
  getContours: async (datasetId) => {
    try {
      const docRef = doc(db, 'bathymetry_datasets', datasetId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Dataset not found') };
      }

      const dataset = docSnap.data();
      return { data: dataset.contours || null, error: null };
    } catch (error) {
      console.error('Error fetching contours:', error);
      return { data: null, error };
    }
  }
};

// ==================== VISUALIZATION SERVICE ====================
// Manage visualization settings and tiles

export const visualizationService = {
  // Create visualization configuration
  createConfig: async (datasetId, configData) => {
    try {
      const configId = `VIZ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const vizConfig = {
        configId,
        datasetId,
        ...configData,
        colorScheme: configData.colorScheme || 'viridis',
        opacity: configData.opacity || 0.8,
        contourLines: configData.contourLines !== false,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'bathymetry_visualizations'), vizConfig);
      return {
        data: {
          id: docRef.id,
          configId,
          ...vizConfig
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating visualization config:', error);
      return { data: null, error };
    }
  },

  // Get visualization config for dataset
  getByDataset: async (datasetId) => {
    try {
      const q = query(
        collection(db, 'bathymetry_visualizations'),
        where('datasetId', '==', datasetId),
        firestoreLimit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: null };
      }

      const doc = snapshot.docs[0];
      return {
        data: {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching visualization config:', error);
      return { data: null, error };
    }
  },

  // Update visualization config
  update: async (id, configData) => {
    try {
      const docRef = doc(db, 'bathymetry_visualizations', id);
      await updateDoc(docRef, {
        ...configData,
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating visualization config:', error);
      return { data: null, error };
    }
  }
};

// ==================== DASHBOARD SERVICE ====================
// Statistics and analytics

export const bathymetryDashboardService = {
  getStatistics: async () => {
    try {
      const datasetsSnapshot = await getDocs(collection(db, 'bathymetry_datasets'));
      const missionsSnapshot = await getDocs(collection(db, 'survey_missions'));

      const datasets = datasetsSnapshot.docs.map(doc => doc.data());
      const missions = missionsSnapshot.docs.map(doc => doc.data());

      const stats = {
        datasets: {
          total: datasets.length,
          ready: datasets.filter(d => d.status === 'ready').length,
          processing: datasets.filter(d => d.status === 'processing').length,
          error: datasets.filter(d => d.status === 'error').length
        },
        missions: {
          total: missions.length,
          planned: missions.filter(m => m.status === 'planned').length,
          in_progress: missions.filter(m => m.status === 'in_progress').length,
          completed: missions.filter(m => m.status === 'completed').length
        },
        coverage: {
          totalDataPoints: datasets.reduce((sum, d) => sum + (d.dataPoints || 0), 0),
          totalAreaCovered: datasets.reduce((sum, d) => sum + (d.areaCovered || 0), 0),
          averageDepth: datasets.length > 0
            ? datasets.reduce((sum, d) => sum + (d.averageDepth || 0), 0) / datasets.length
            : 0
        }
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { data: null, error };
    }
  }
};

// ==================== DATA EXPORT SERVICE ====================
// Export bathymetry data in various formats

export const bathymetryExportService = {
  // Export as CSV
  exportCSV: async (datasetId) => {
    try {
      const docRef = doc(db, 'bathymetry_datasets', datasetId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Dataset not found') };
      }

      const dataset = docSnap.data();
      const depthData = dataset.depthData || [];

      // Generate CSV content
      const csvHeader = 'Latitude,Longitude,Depth(m)\n';
      const csvRows = depthData.map(d => `${d.lat},${d.lon},${d.depth}`).join('\n');
      const csvContent = csvHeader + csvRows;

      return { data: { csv: csvContent, filename: `${dataset.datasetId}.csv` }, error: null };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return { data: null, error };
    }
  },

  // Export as GeoJSON
  exportGeoJSON: async (datasetId) => {
    try {
      const docRef = doc(db, 'bathymetry_datasets', datasetId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Dataset not found') };
      }

      const dataset = docSnap.data();
      const depthData = dataset.depthData || [];

      // Generate GeoJSON
      const features = depthData.map(d => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.lon, d.lat]
        },
        properties: {
          depth: d.depth
        }
      }));

      const geoJSON = {
        type: 'FeatureCollection',
        features
      };

      return {
        data: {
          geojson: JSON.stringify(geoJSON, null, 2),
          filename: `${dataset.datasetId}.geojson`
        },
        error: null
      };
    } catch (error) {
      console.error('Error exporting GeoJSON:', error);
      return { data: null, error };
    }
  }
};

export default {
  bathymetryDatasetService,
  surveyMissionService,
  depthContourService,
  visualizationService,
  bathymetryDashboardService,
  bathymetryExportService
};
