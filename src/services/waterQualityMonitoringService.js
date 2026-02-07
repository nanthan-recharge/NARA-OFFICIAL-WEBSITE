/**
 * Real-Time Water Quality Monitoring Service
 *
 * Manages real-time water quality sensor data and monitoring
 * for NARA Digital Ocean Platform
 *
 * Service Modules:
 * 1. Sensor Registry - Manage water quality sensors
 * 2. Real-Time Data Service - Handle real-time sensor readings
 * 3. Alert Service - Manage threshold-based alerts
 * 4. Historical Data Service - Store and retrieve historical data
 * 5. Analysis Service - Analyze trends and patterns
 * 6. Dashboard Service - Provide dashboard analytics
 * 7. Export Service - Export monitoring data
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

// ========== 1. SENSOR REGISTRY SERVICE ==========

/**
 * Manages water quality sensors
 */
export const sensorRegistryService = {
  /**
   * Register a new sensor
   */
  register: async (sensorData) => {
    try {
      const sensorId = `SENSOR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Convert location to GeoPoint
      const location = sensorData.location
        ? new GeoPoint(sensorData.location.lat, sensorData.location.lng)
        : null;

      const dataToSave = {
        sensorId,
        ...sensorData,
        location,
        status: 'active',
        lastReading: null,
        totalReadings: 0,
        lastMaintenance: null,
        registeredAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'wq_sensors'), dataToSave);
      return { data: { id: docRef.id, sensorId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error registering sensor:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get all sensors
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'wq_sensors');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.sensorType) {
        q = query(q, where('sensorType', '==', filters.sensorType));
      }

      q = query(q, orderBy('registeredAt', 'desc'));

      const snapshot = await getDocs(q);
      const sensors = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: sensors, error: null };
    } catch (error) {
      console.error('Error fetching sensors:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get a single sensor by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'wq_sensors', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'Sensor not found' };
      }

      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } catch (error) {
      console.error('Error fetching sensor:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update sensor
   */
  update: async (id, updates) => {
    try {
      const docRef = doc(db, 'wq_sensors', id);

      // Convert location if provided
      if (updates.location) {
        updates.location = new GeoPoint(updates.location.lat, updates.location.lng);
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating sensor:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Delete sensor
   */
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'wq_sensors', id));
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting sensor:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update sensor status
   */
  updateStatus: async (id, status) => {
    try {
      const docRef = doc(db, 'wq_sensors', id);

      const statusUpdate = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'maintenance') {
        statusUpdate.lastMaintenance = serverTimestamp();
      }

      await updateDoc(docRef, statusUpdate);
      return { data: { id, status }, error: null };
    } catch (error) {
      console.error('Error updating sensor status:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 2. REAL-TIME DATA SERVICE ==========

/**
 * Handles real-time sensor readings
 */
export const realTimeDataService = {
  /**
   * Submit a sensor reading
   */
  submitReading: async (sensorId, readingData) => {
    try {
      const readingId = `READING-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        readingId,
        sensorId,
        ...readingData,
        timestamp: serverTimestamp(),
        processed: false
      };

      const docRef = await addDoc(collection(db, 'wq_readings'), dataToSave);

      // Update sensor last reading and count
      const q = query(collection(db, 'wq_sensors'), where('sensorId', '==', sensorId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const sensorDoc = snapshot.docs[0];
        const sensor = sensorDoc.data();

        await updateDoc(doc(db, 'wq_sensors', sensorDoc.id), {
          lastReading: dataToSave,
          totalReadings: (sensor.totalReadings || 0) + 1,
          updatedAt: serverTimestamp()
        });

        // Check for alerts
        await alertService.checkThresholds(sensorDoc.id, readingData);
      }

      return { data: { id: docRef.id, readingId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error submitting reading:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get latest readings for all sensors
   */
  getLatestReadings: async () => {
    try {
      const sensorsSnapshot = await getDocs(collection(db, 'wq_sensors'));
      const latestReadings = [];

      for (const sensorDoc of sensorsSnapshot.docs) {
        const sensor = sensorDoc.data();
        if (sensor.lastReading) {
          latestReadings.push({
            sensorId: sensor.sensorId,
            sensorName: sensor.sensorName,
            location: sensor.location,
            ...sensor.lastReading
          });
        }
      }

      return { data: latestReadings, error: null };
    } catch (error) {
      console.error('Error fetching latest readings:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get readings for a specific sensor
   */
  getReadingsBySensor: async (sensorId, limitCount = 100) => {
    try {
      const q = query(
        collection(db, 'wq_readings'),
        where('sensorId', '==', sensorId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const readings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: readings, error: null };
    } catch (error) {
      console.error('Error fetching sensor readings:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 3. ALERT SERVICE ==========

/**
 * Manages threshold-based alerts
 */
export const alertService = {
  /**
   * Create alert threshold
   */
  createThreshold: async (thresholdData) => {
    try {
      const thresholdId = `THRESH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        thresholdId,
        ...thresholdData,
        enabled: true,
        alertsTriggered: 0,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'wq_thresholds'), dataToSave);
      return { data: { id: docRef.id, thresholdId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating threshold:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get all thresholds
   */
  getAllThresholds: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'wq_thresholds'));
      const thresholds = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: thresholds, error: null };
    } catch (error) {
      console.error('Error fetching thresholds:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Check if reading violates thresholds
   */
  checkThresholds: async (sensorDocId, readingData) => {
    try {
      const { data: sensor } = await sensorRegistryService.getById(sensorDocId);
      if (!sensor) return;

      const { data: thresholds } = await alertService.getAllThresholds();
      if (!thresholds) return;

      // Check each threshold
      for (const threshold of thresholds) {
        if (!threshold.enabled) continue;
        if (threshold.sensorId && threshold.sensorId !== sensor.sensorId) continue;

        const parameter = threshold.parameter; // e.g., 'temperature', 'ph', 'dissolvedOxygen'
        const value = readingData[parameter];

        if (value === undefined) continue;

        let violated = false;
        if (threshold.condition === 'above' && value > threshold.value) {
          violated = true;
        } else if (threshold.condition === 'below' && value < threshold.value) {
          violated = true;
        } else if (threshold.condition === 'outside_range' && (value < threshold.minValue || value > threshold.maxValue)) {
          violated = true;
        }

        if (violated) {
          // Create alert
          const alertId = `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

          await addDoc(collection(db, 'wq_alerts'), {
            alertId,
            sensorId: sensor.sensorId,
            sensorName: sensor.sensorName,
            thresholdId: threshold.thresholdId,
            parameter,
            value,
            thresholdValue: threshold.value,
            severity: threshold.severity || 'medium',
            status: 'active',
            acknowledgedBy: null,
            triggeredAt: serverTimestamp()
          });

          // Update threshold trigger count
          const thresholdQuery = query(
            collection(db, 'wq_thresholds'),
            where('thresholdId', '==', threshold.thresholdId)
          );
          const thresholdSnapshot = await getDocs(thresholdQuery);
          if (!thresholdSnapshot.empty) {
            const thresholdDoc = thresholdSnapshot.docs[0];
            const thresholdData = thresholdDoc.data();
            await updateDoc(doc(db, 'wq_thresholds', thresholdDoc.id), {
              alertsTriggered: (thresholdData.alertsTriggered || 0) + 1,
              lastTriggered: serverTimestamp()
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking thresholds:', error);
    }
  },

  /**
   * Get active alerts
   */
  getActiveAlerts: async () => {
    try {
      const q = query(
        collection(db, 'wq_alerts'),
        where('status', '==', 'active'),
        orderBy('triggeredAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: alerts, error: null };
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert: async (alertId, acknowledgedBy) => {
    try {
      const q = query(collection(db, 'wq_alerts'), where('alertId', '==', alertId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Alert not found' };
      }

      const alertDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'wq_alerts', alertDoc.id), {
        status: 'acknowledged',
        acknowledgedBy,
        acknowledgedAt: serverTimestamp()
      });

      return { data: { alertId, status: 'acknowledged' }, error: null };
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 4. HISTORICAL DATA SERVICE ==========

/**
 * Manages historical water quality data
 */
export const historicalDataService = {
  /**
   * Get historical data for a sensor
   */
  getHistoricalData: async (sensorId, startDate, endDate, limitCount = 1000) => {
    try {
      let q = query(
        collection(db, 'wq_readings'),
        where('sensorId', '==', sensorId),
        orderBy('timestamp', 'desc')
      );

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      const readings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by date range if provided
      let filteredReadings = readings;
      if (startDate || endDate) {
        filteredReadings = readings.filter(reading => {
          const timestamp = reading.timestamp?.toDate?.() || new Date(reading.timestamp);
          if (startDate && timestamp < new Date(startDate)) return false;
          if (endDate && timestamp > new Date(endDate)) return false;
          return true;
        });
      }

      return { data: filteredReadings, error: null };
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Aggregate data by time period
   */
  aggregateData: async (sensorId, parameter, period = 'daily') => {
    try {
      const { data: readings } = await historicalDataService.getHistoricalData(sensorId, null, null, 1000);

      if (!readings) return { data: null, error: 'No readings found' };

      // Group by period
      const grouped = {};

      readings.forEach(reading => {
        const timestamp = reading.timestamp?.toDate?.() || new Date(reading.timestamp);
        let periodKey;

        if (period === 'hourly') {
          periodKey = `${timestamp.getFullYear()}-${timestamp.getMonth() + 1}-${timestamp.getDate()}-${timestamp.getHours()}`;
        } else if (period === 'daily') {
          periodKey = `${timestamp.getFullYear()}-${timestamp.getMonth() + 1}-${timestamp.getDate()}`;
        } else if (period === 'weekly') {
          const weekNumber = getWeekNumber(timestamp);
          periodKey = `${timestamp.getFullYear()}-W${weekNumber}`;
        } else if (period === 'monthly') {
          periodKey = `${timestamp.getFullYear()}-${timestamp.getMonth() + 1}`;
        }

        if (!grouped[periodKey]) {
          grouped[periodKey] = [];
        }

        if (reading[parameter] !== undefined) {
          grouped[periodKey].push(reading[parameter]);
        }
      });

      // Calculate statistics for each period
      const aggregated = Object.entries(grouped).map(([periodKey, values]) => ({
        period: periodKey,
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((sum, v) => sum + v, 0) / values.length,
        median: calculateMedian(values)
      }));

      return { data: aggregated, error: null };
    } catch (error) {
      console.error('Error aggregating data:', error);
      return { data: null, error: error.message };
    }
  }
};

// Helper functions
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function calculateMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// ========== 5. ANALYSIS SERVICE ==========

/**
 * Analyzes water quality trends and patterns
 */
export const analysisService = {
  /**
   * Calculate parameter statistics
   */
  calculateStatistics: async (sensorId, parameter) => {
    try {
      const { data: readings } = await historicalDataService.getHistoricalData(sensorId, null, null, 1000);

      if (!readings || readings.length === 0) {
        return { data: null, error: 'No readings found' };
      }

      const values = readings
        .map(r => r[parameter])
        .filter(v => v !== undefined && v !== null);

      if (values.length === 0) {
        return { data: null, error: 'No valid values found' };
      }

      const stats = {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((sum, v) => sum + v, 0) / values.length,
        median: calculateMedian(values),
        stdDev: calculateStdDev(values)
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Detect anomalies in sensor data
   */
  detectAnomalies: async (sensorId, parameter, threshold = 2) => {
    try {
      const { data: readings } = await historicalDataService.getHistoricalData(sensorId, null, null, 1000);

      if (!readings || readings.length === 0) {
        return { data: [], error: null };
      }

      const values = readings
        .map(r => ({ value: r[parameter], reading: r }))
        .filter(v => v.value !== undefined && v.value !== null);

      const mean = values.reduce((sum, v) => sum + v.value, 0) / values.length;
      const stdDev = calculateStdDev(values.map(v => v.value));

      // Detect anomalies (values beyond threshold * stdDev from mean)
      const anomalies = values.filter(v => {
        const zScore = Math.abs((v.value - mean) / stdDev);
        return zScore > threshold;
      });

      return { data: anomalies.map(a => a.reading), error: null };
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Identify trends
   */
  identifyTrends: async (sensorId, parameter) => {
    try {
      const { data: aggregated } = await historicalDataService.aggregateData(sensorId, parameter, 'daily');

      if (!aggregated || aggregated.length < 3) {
        return { data: { trend: 'insufficient_data' }, error: null };
      }

      // Simple linear regression
      const values = aggregated.map(a => a.avg);
      const n = values.length;
      const indices = Array.from({ length: n }, (_, i) => i);

      const sumX = indices.reduce((sum, x) => sum + x, 0);
      const sumY = values.reduce((sum, y) => sum + y, 0);
      const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
      const sumXX = indices.reduce((sum, x) => sum + x * x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

      let trend;
      if (Math.abs(slope) < 0.01) {
        trend = 'stable';
      } else if (slope > 0) {
        trend = 'increasing';
      } else {
        trend = 'decreasing';
      }

      return {
        data: {
          trend,
          slope,
          significance: Math.abs(slope) > 0.05 ? 'significant' : 'minor'
        },
        error: null
      };
    } catch (error) {
      console.error('Error identifying trends:', error);
      return { data: null, error: error.message };
    }
  }
};

function calculateStdDev(values) {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.sqrt(variance);
}

// ========== 6. DASHBOARD SERVICE ==========

/**
 * Provides dashboard analytics
 */
export const dashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStats: async () => {
    try {
      const sensorsSnapshot = await getDocs(collection(db, 'wq_sensors'));
      const alertsSnapshot = await getDocs(query(
        collection(db, 'wq_alerts'),
        where('status', '==', 'active')
      ));

      const sensors = sensorsSnapshot.docs.map(doc => doc.data());
      const activeAlerts = alertsSnapshot.docs.map(doc => doc.data());

      const stats = {
        totalSensors: sensors.length,
        activeSensors: sensors.filter(s => s.status === 'active').length,
        maintenanceSensors: sensors.filter(s => s.status === 'maintenance').length,
        offlineSensors: sensors.filter(s => s.status === 'offline').length,

        totalReadings: sensors.reduce((sum, s) => sum + (s.totalReadings || 0), 0),

        activeAlerts: activeAlerts.length,
        criticalAlerts: activeAlerts.filter(a => a.severity === 'critical').length,
        highAlerts: activeAlerts.filter(a => a.severity === 'high').length,

        sensorsByType: {}
      };

      // Sensor type breakdown
      sensors.forEach(sensor => {
        const type = sensor.sensorType || 'unknown';
        stats.sensorsByType[type] = (stats.sensorsByType[type] || 0) + 1;
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
 * Exports water quality data
 */
export const exportService = {
  /**
   * Export sensor data as CSV
   */
  exportCSV: async (sensorId, startDate, endDate) => {
    try {
      const { data: readings } = await historicalDataService.getHistoricalData(sensorId, startDate, endDate);

      if (!readings || readings.length === 0) {
        return { data: null, error: 'No data to export' };
      }

      // Get all parameters from first reading
      const parameters = Object.keys(readings[0]).filter(key =>
        !['id', 'readingId', 'sensorId', 'timestamp', 'processed'].includes(key)
      );

      // CSV header
      let csv = 'Timestamp,Sensor ID,' + parameters.join(',') + '\n';

      // CSV rows
      readings.forEach(reading => {
        const timestamp = reading.timestamp?.toDate?.() || new Date(reading.timestamp);
        const row = [
          timestamp.toISOString(),
          reading.sensorId,
          ...parameters.map(p => reading[p] || '')
        ];
        csv += row.join(',') + '\n';
      });

      return {
        data: {
          csv,
          filename: `water_quality_${sensorId}_${Date.now()}.csv`
        },
        error: null
      };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Export all sensors data
   */
  exportAllSensorsCSV: async (startDate, endDate) => {
    try {
      const { data: sensors } = await sensorRegistryService.getAll();

      if (!sensors || sensors.length === 0) {
        return { data: null, error: 'No sensors found' };
      }

      let allData = [];

      for (const sensor of sensors) {
        const { data: readings } = await historicalDataService.getHistoricalData(
          sensor.sensorId,
          startDate,
          endDate
        );

        if (readings) {
          allData = allData.concat(
            readings.map(r => ({
              ...r,
              sensorName: sensor.sensorName,
              location: sensor.location
            }))
          );
        }
      }

      if (allData.length === 0) {
        return { data: null, error: 'No data to export' };
      }

      // Get all parameters
      const parameters = Object.keys(allData[0]).filter(key =>
        !['id', 'readingId', 'sensorId', 'sensorName', 'location', 'timestamp', 'processed'].includes(key)
      );

      // CSV header
      let csv = 'Timestamp,Sensor ID,Sensor Name,Latitude,Longitude,' + parameters.join(',') + '\n';

      // CSV rows
      allData.forEach(reading => {
        const timestamp = reading.timestamp?.toDate?.() || new Date(reading.timestamp);
        const lat = reading.location?.latitude || '';
        const lng = reading.location?.longitude || '';

        const row = [
          timestamp.toISOString(),
          reading.sensorId,
          reading.sensorName,
          lat,
          lng,
          ...parameters.map(p => reading[p] || '')
        ];
        csv += row.join(',') + '\n';
      });

      return {
        data: {
          csv,
          filename: `water_quality_all_sensors_${Date.now()}.csv`
        },
        error: null
      };
    } catch (error) {
      console.error('Error exporting all sensors CSV:', error);
      return { data: null, error: error.message };
    }
  }
};

export default {
  sensorRegistryService,
  realTimeDataService,
  alertService,
  historicalDataService,
  analysisService,
  dashboardService,
  exportService
};
