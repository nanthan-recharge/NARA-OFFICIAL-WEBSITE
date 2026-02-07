/**
 * Data Center Integration Hub Service
 *
 * Central hub for integrating multiple data sources and external systems
 * for NARA Digital Ocean Platform
 *
 * Service Modules:
 * 1. Data Source Registry - Manage external data sources
 * 2. API Integration Service - Connect to external APIs
 * 3. Data Sync Service - Synchronize data from multiple sources
 * 4. Transform Service - Transform and normalize data
 * 5. Data Quality Service - Validate and assess data quality
 * 6. Integration Dashboard Service - Monitor integrations
 * 7. Webhook Service - Handle incoming webhooks from external systems
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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ========== 1. DATA SOURCE REGISTRY SERVICE ==========

/**
 * Manages registered external data sources
 */
export const dataSourceRegistryService = {
  /**
   * Register a new data source
   */
  register: async (sourceData) => {
    try {
      const sourceId = `SRC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        sourceId,
        ...sourceData,
        status: 'inactive',
        lastSync: null,
        totalRecordsSynced: 0,
        syncFrequency: sourceData.syncFrequency || 'daily',
        apiQuotaUsed: 0,
        apiQuotaLimit: sourceData.apiQuotaLimit || 1000,
        registeredAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'data_sources'), dataToSave);
      return { data: { id: docRef.id, sourceId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error registering data source:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get all data sources
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'data_sources');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.sourceType) {
        q = query(q, where('sourceType', '==', filters.sourceType));
      }

      q = query(q, orderBy('registeredAt', 'desc'));

      const snapshot = await getDocs(q);
      const sources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: sources, error: null };
    } catch (error) {
      console.error('Error fetching data sources:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get a single data source by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'data_sources', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'Data source not found' };
      }

      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } catch (error) {
      console.error('Error fetching data source:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update a data source
   */
  update: async (id, updates) => {
    try {
      const docRef = doc(db, 'data_sources', id);

      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating data source:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Delete a data source
   */
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'data_sources', id));
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting data source:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Activate/deactivate a data source
   */
  updateStatus: async (id, status) => {
    try {
      const docRef = doc(db, 'data_sources', id);

      const statusUpdate = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'active') {
        statusUpdate.activatedAt = serverTimestamp();
      }

      await updateDoc(docRef, statusUpdate);
      return { data: { id, status }, error: null };
    } catch (error) {
      console.error('Error updating data source status:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Test connection to data source
   */
  testConnection: async (id) => {
    try {
      const { data: source, error } = await dataSourceRegistryService.getById(id);
      if (error) return { data: null, error };

      // Simulate connection test
      // In production, this would make an actual API call
      const connectionTest = {
        success: true,
        responseTime: Math.floor(Math.random() * 500) + 100,
        testedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'data_sources', id), {
        lastConnectionTest: connectionTest,
        updatedAt: serverTimestamp()
      });

      return { data: connectionTest, error: null };
    } catch (error) {
      console.error('Error testing connection:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 2. API INTEGRATION SERVICE ==========

/**
 * Manages API integrations with external systems
 */
export const apiIntegrationService = {
  /**
   * Create an API integration configuration
   */
  create: async (integrationData) => {
    try {
      const integrationId = `API-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        integrationId,
        ...integrationData,
        status: 'configured',
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        lastRequest: null,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'api_integrations'), dataToSave);
      return { data: { id: docRef.id, integrationId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating API integration:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get all API integrations
   */
  getAll: async () => {
    try {
      const q = query(collection(db, 'api_integrations'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const integrations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: integrations, error: null };
    } catch (error) {
      console.error('Error fetching API integrations:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Make an API request
   */
  makeRequest: async (integrationId, requestData) => {
    try {
      const docRef = doc(db, 'api_integrations', integrationId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'API integration not found' };
      }

      const integration = docSnap.data();

      // Simulate API request
      // In production, this would make an actual fetch request
      const mockResponse = {
        requestId: `REQ-${Date.now()}`,
        status: 'success',
        statusCode: 200,
        data: { message: 'Mock response data' },
        responseTime: Math.floor(Math.random() * 500) + 100,
        timestamp: new Date().toISOString()
      };

      // Update integration stats
      await updateDoc(docRef, {
        totalRequests: integration.totalRequests + 1,
        successfulRequests: integration.successfulRequests + 1,
        lastRequest: mockResponse,
        lastRequestAt: serverTimestamp()
      });

      return { data: mockResponse, error: null };
    } catch (error) {
      console.error('Error making API request:', error);

      // Log failed request
      const docRef = doc(db, 'api_integrations', integrationId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const integration = docSnap.data();
        await updateDoc(docRef, {
          totalRequests: integration.totalRequests + 1,
          failedRequests: integration.failedRequests + 1
        });
      }

      return { data: null, error: error.message };
    }
  }
};

// ========== 3. DATA SYNC SERVICE ==========

/**
 * Manages data synchronization from external sources
 */
export const dataSyncService = {
  /**
   * Create a sync job
   */
  createSyncJob: async (sourceId, syncConfig) => {
    try {
      const jobId = `SYNC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        jobId,
        sourceId,
        ...syncConfig,
        status: 'pending',
        recordsProcessed: 0,
        recordsSucceeded: 0,
        recordsFailed: 0,
        startedAt: null,
        completedAt: null,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'sync_jobs'), dataToSave);
      return { data: { id: docRef.id, jobId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating sync job:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Execute a sync job
   */
  executeSyncJob: async (jobId) => {
    try {
      const q = query(collection(db, 'sync_jobs'), where('jobId', '==', jobId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Sync job not found' };
      }

      const jobDoc = snapshot.docs[0];
      const job = jobDoc.data();

      // Update status to running
      await updateDoc(doc(db, 'sync_jobs', jobDoc.id), {
        status: 'running',
        startedAt: serverTimestamp()
      });

      // Simulate sync process
      // In production, this would fetch and process data from the external source
      const mockResults = {
        recordsProcessed: Math.floor(Math.random() * 1000) + 100,
        recordsSucceeded: Math.floor(Math.random() * 950) + 90,
        recordsFailed: Math.floor(Math.random() * 50)
      };

      // Update job with results
      await updateDoc(doc(db, 'sync_jobs', jobDoc.id), {
        status: 'completed',
        ...mockResults,
        completedAt: serverTimestamp()
      });

      // Update source stats
      const { data: source } = await dataSourceRegistryService.getById(job.sourceId);
      if (source) {
        await dataSourceRegistryService.update(job.sourceId, {
          lastSync: new Date().toISOString(),
          totalRecordsSynced: (source.totalRecordsSynced || 0) + mockResults.recordsSucceeded
        });
      }

      return { data: mockResults, error: null };
    } catch (error) {
      console.error('Error executing sync job:', error);

      // Update job status to failed
      const q = query(collection(db, 'sync_jobs'), where('jobId', '==', jobId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await updateDoc(doc(db, 'sync_jobs', snapshot.docs[0].id), {
          status: 'failed',
          error: error.message,
          completedAt: serverTimestamp()
        });
      }

      return { data: null, error: error.message };
    }
  },

  /**
   * Get all sync jobs
   */
  getAllJobs: async (filters = {}) => {
    try {
      let q = collection(db, 'sync_jobs');

      if (filters.sourceId) {
        q = query(q, where('sourceId', '==', filters.sourceId));
      }

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('createdAt', 'desc'), limit(100));

      const snapshot = await getDocs(q);
      const jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: jobs, error: null };
    } catch (error) {
      console.error('Error fetching sync jobs:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Schedule automatic sync
   */
  scheduleSync: async (sourceId, frequency) => {
    try {
      const scheduleId = `SCHED-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        scheduleId,
        sourceId,
        frequency, // 'hourly', 'daily', 'weekly', 'monthly'
        enabled: true,
        lastRun: null,
        nextRun: calculateNextRun(frequency),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'sync_schedules'), dataToSave);
      return { data: { id: docRef.id, scheduleId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error scheduling sync:', error);
      return { data: null, error: error.message };
    }
  }
};

// Helper function to calculate next run time
function calculateNextRun(frequency) {
  const now = new Date();
  switch (frequency) {
    case 'hourly':
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'monthly':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  }
}

// ========== 4. TRANSFORM SERVICE ==========

/**
 * Transforms and normalizes data from various sources
 */
export const transformService = {
  /**
   * Create a transformation rule
   */
  createRule: async (ruleData) => {
    try {
      const ruleId = `RULE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ruleId,
        ...ruleData,
        enabled: true,
        timesApplied: 0,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'transformation_rules'), dataToSave);
      return { data: { id: docRef.id, ruleId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating transformation rule:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Apply transformation to data
   */
  applyTransformation: async (ruleId, inputData) => {
    try {
      const q = query(collection(db, 'transformation_rules'), where('ruleId', '==', ruleId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Transformation rule not found' };
      }

      const ruleDoc = snapshot.docs[0];
      const rule = ruleDoc.data();

      if (!rule.enabled) {
        return { data: null, error: 'Transformation rule is disabled' };
      }

      // Apply transformation based on rule type
      let transformedData;
      switch (rule.transformationType) {
        case 'field_mapping':
          transformedData = applyFieldMapping(inputData, rule.mapping);
          break;
        case 'data_normalization':
          transformedData = normalizeData(inputData, rule.normalizationRules);
          break;
        case 'data_enrichment':
          transformedData = enrichData(inputData, rule.enrichmentRules);
          break;
        default:
          transformedData = inputData;
      }

      // Update rule stats
      await updateDoc(doc(db, 'transformation_rules', ruleDoc.id), {
        timesApplied: rule.timesApplied + 1,
        lastAppliedAt: serverTimestamp()
      });

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error applying transformation:', error);
      return { data: null, error: error.message };
    }
  }
};

// Transformation helper functions
function applyFieldMapping(data, mapping) {
  const transformed = {};
  Object.entries(mapping).forEach(([targetField, sourceField]) => {
    transformed[targetField] = data[sourceField];
  });
  return transformed;
}

function normalizeData(data, rules) {
  const normalized = { ...data };
  rules.forEach(rule => {
    if (rule.type === 'trim') {
      normalized[rule.field] = data[rule.field]?.trim();
    } else if (rule.type === 'lowercase') {
      normalized[rule.field] = data[rule.field]?.toLowerCase();
    } else if (rule.type === 'uppercase') {
      normalized[rule.field] = data[rule.field]?.toUpperCase();
    }
  });
  return normalized;
}

function enrichData(data, rules) {
  const enriched = { ...data };
  rules.forEach(rule => {
    if (rule.type === 'timestamp') {
      enriched[rule.field] = new Date().toISOString();
    } else if (rule.type === 'constant') {
      enriched[rule.field] = rule.value;
    }
  });
  return enriched;
}

// ========== 5. DATA QUALITY SERVICE ==========

/**
 * Validates and assesses data quality
 */
export const dataQualityService = {
  /**
   * Create data quality rule
   */
  createQualityRule: async (ruleData) => {
    try {
      const ruleId = `QC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ruleId,
        ...ruleData,
        enabled: true,
        violationsDetected: 0,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'data_quality_rules'), dataToSave);
      return { data: { id: docRef.id, ruleId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating quality rule:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Validate data against quality rules
   */
  validateData: async (sourceId, data) => {
    try {
      const q = query(
        collection(db, 'data_quality_rules'),
        where('sourceId', '==', sourceId),
        where('enabled', '==', true)
      );
      const snapshot = await getDocs(q);

      const violations = [];

      snapshot.docs.forEach(ruleDoc => {
        const rule = ruleDoc.data();

        // Check validation rules
        if (rule.validationType === 'required' && !data[rule.field]) {
          violations.push({
            ruleId: rule.ruleId,
            field: rule.field,
            type: 'required',
            message: `Field ${rule.field} is required`
          });
        } else if (rule.validationType === 'format' && data[rule.field]) {
          const regex = new RegExp(rule.formatPattern);
          if (!regex.test(data[rule.field])) {
            violations.push({
              ruleId: rule.ruleId,
              field: rule.field,
              type: 'format',
              message: `Field ${rule.field} does not match expected format`
            });
          }
        } else if (rule.validationType === 'range' && data[rule.field]) {
          const value = parseFloat(data[rule.field]);
          if (value < rule.minValue || value > rule.maxValue) {
            violations.push({
              ruleId: rule.ruleId,
              field: rule.field,
              type: 'range',
              message: `Field ${rule.field} is out of range`
            });
          }
        }
      });

      // Log quality check
      const qualityCheckId = `QC-CHECK-${Date.now()}`;
      await addDoc(collection(db, 'data_quality_checks'), {
        qualityCheckId,
        sourceId,
        passed: violations.length === 0,
        violations,
        checkedAt: serverTimestamp()
      });

      return {
        data: {
          passed: violations.length === 0,
          violations,
          qualityScore: Math.round(((1 - violations.length / snapshot.size) * 100))
        },
        error: null
      };
    } catch (error) {
      console.error('Error validating data:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 6. INTEGRATION DASHBOARD SERVICE ==========

/**
 * Provides dashboard analytics for integrations
 */
export const integrationDashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStats: async () => {
    try {
      const sourcesSnapshot = await getDocs(collection(db, 'data_sources'));
      const jobsSnapshot = await getDocs(collection(db, 'sync_jobs'));
      const integrationsSnapshot = await getDocs(collection(db, 'api_integrations'));

      const sources = sourcesSnapshot.docs.map(doc => doc.data());
      const jobs = jobsSnapshot.docs.map(doc => doc.data());
      const integrations = integrationsSnapshot.docs.map(doc => doc.data());

      const stats = {
        totalSources: sources.length,
        activeSources: sources.filter(s => s.status === 'active').length,
        totalRecordsSynced: sources.reduce((sum, s) => sum + (s.totalRecordsSynced || 0), 0),

        totalSyncJobs: jobs.length,
        completedJobs: jobs.filter(j => j.status === 'completed').length,
        failedJobs: jobs.filter(j => j.status === 'failed').length,
        runningJobs: jobs.filter(j => j.status === 'running').length,

        totalIntegrations: integrations.length,
        totalApiRequests: integrations.reduce((sum, i) => sum + (i.totalRequests || 0), 0),
        successfulRequests: integrations.reduce((sum, i) => sum + (i.successfulRequests || 0), 0),
        failedRequests: integrations.reduce((sum, i) => sum + (i.failedRequests || 0), 0),

        averageSuccessRate: integrations.length > 0
          ? Math.round((integrations.reduce((sum, i) =>
              sum + (i.totalRequests > 0 ? (i.successfulRequests / i.totalRequests) * 100 : 0), 0) / integrations.length))
          : 0
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get recent activity
   */
  getRecentActivity: async (limitCount = 20) => {
    try {
      const q = query(
        collection(db, 'sync_jobs'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: activities, error: null };
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 7. WEBHOOK SERVICE ==========

/**
 * Manages incoming webhooks from external systems
 */
export const webhookService = {
  /**
   * Register a webhook endpoint
   */
  register: async (webhookData) => {
    try {
      const webhookId = `WEBHOOK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        webhookId,
        ...webhookData,
        secret: generateWebhookSecret(),
        enabled: true,
        totalCalls: 0,
        lastCalled: null,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'webhooks'), dataToSave);
      return { data: { id: docRef.id, webhookId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error registering webhook:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Process incoming webhook
   */
  processWebhook: async (webhookId, payload) => {
    try {
      const q = query(collection(db, 'webhooks'), where('webhookId', '==', webhookId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Webhook not found' };
      }

      const webhookDoc = snapshot.docs[0];
      const webhook = webhookDoc.data();

      if (!webhook.enabled) {
        return { data: null, error: 'Webhook is disabled' };
      }

      // Log webhook call
      const callId = `CALL-${Date.now()}`;
      await addDoc(collection(db, 'webhook_calls'), {
        callId,
        webhookId,
        payload,
        processedAt: serverTimestamp()
      });

      // Update webhook stats
      await updateDoc(doc(db, 'webhooks', webhookDoc.id), {
        totalCalls: webhook.totalCalls + 1,
        lastCalled: serverTimestamp()
      });

      return { data: { callId, status: 'processed' }, error: null };
    } catch (error) {
      console.error('Error processing webhook:', error);
      return { data: null, error: error.message };
    }
  }
};

// Helper function to generate webhook secret
function generateWebhookSecret() {
  return `whsec_${Math.random().toString(36).substr(2, 32)}`;
}

export default {
  dataSourceRegistryService,
  apiIntegrationService,
  dataSyncService,
  transformService,
  dataQualityService,
  integrationDashboardService,
  webhookService
};
