const toTimestamp = (value) => {
  const date = new Date(value);
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0
  };
};

const NOW = Date.now();

const MOCK_DATA = {
  dashboardStats: {
    totalSources: 9,
    activeSources: 7,
    completedJobs: 248,
    runningJobs: 3,
    totalRecordsSynced: 4283560,
    averageSuccessRate: 97,
    totalApiRequests: 1826400,
    successfulRequests: 1779240,
    failedRequests: 47160
  },
  dataSources: [
    {
      id: 'mock-src-1',
      sourceId: 'SRC-OCN-001',
      sourceName: 'NOAA Ocean Observations',
      sourceType: 'api',
      endpoint: 'https://api.noaa.gov/ocean/v1',
      authMethod: 'api_key',
      syncFrequency: 'hourly',
      description: 'Live buoy network covering Sri Lanka EEZ for temp, salinity, wave height.',
      status: 'active',
      lastSync: new Date(NOW - 12 * 60 * 1000).toISOString(),
      totalRecordsSynced: 1185600,
      apiQuotaUsed: 654,
      apiQuotaLimit: 1000,
      registeredAt: toTimestamp('2024-01-08T05:00:00Z')
    },
    {
      id: 'mock-src-2',
      sourceId: 'SRC-FIS-014',
      sourceName: 'Fisheries Catch Reports',
      sourceType: 'database',
      endpoint: 'postgresql://fisheries-db.nara.lk:5432/catch',
      authMethod: 'oauth',
      syncFrequency: 'daily',
      description: 'Provincial fisheries submissions synced nightly with validation rules.',
      status: 'active',
      lastSync: new Date(NOW - 4 * 60 * 60 * 1000).toISOString(),
      totalRecordsSynced: 862140,
      apiQuotaUsed: 0,
      apiQuotaLimit: 0,
      registeredAt: toTimestamp('2023-11-18T02:30:00Z')
    },
    {
      id: 'mock-src-3',
      sourceId: 'SRC-SAT-009',
      sourceName: 'Sentinel-2 Coastal Imagery',
      sourceType: 'ftp',
      endpoint: 's3://nara-sat-imagery/sentinel2',
      authMethod: 'bearer',
      syncFrequency: 'daily',
      description: 'ESA imagery ingested for bloom detection and shoreline change models.',
      status: 'maintenance',
      lastSync: new Date(NOW - 27 * 60 * 60 * 1000).toISOString(),
      totalRecordsSynced: 392420,
      apiQuotaUsed: 72,
      apiQuotaLimit: 120,
      registeredAt: toTimestamp('2023-09-02T10:15:00Z')
    },
    {
      id: 'mock-src-4',
      sourceId: 'SRC-LAB-022',
      sourceName: 'Water Quality Lab Submissions',
      sourceType: 'file',
      endpoint: 'https://upload.nara.lk/labs',
      authMethod: 'none',
      syncFrequency: 'manual',
      description: 'CSV submissions from accredited partner labs for microbial testing.',
      status: 'inactive',
      lastSync: null,
      totalRecordsSynced: 24580,
      apiQuotaUsed: 0,
      apiQuotaLimit: 0,
      registeredAt: toTimestamp('2024-03-10T08:45:00Z')
    }
  ],
  syncJobs: [
    {
      id: 'mock-job-1',
      jobId: 'JOB-2025-04-18-001',
      sourceId: 'SRC-OCN-001',
      status: 'completed',
      recordsProcessed: 15600,
      recordsSucceeded: 15600,
      recordsFailed: 0,
      createdAt: toTimestamp(new Date(NOW - 3 * 60 * 60 * 1000).toISOString())
    },
    {
      id: 'mock-job-2',
      jobId: 'JOB-2025-04-18-002',
      sourceId: 'SRC-FIS-014',
      status: 'running',
      recordsProcessed: 9800,
      recordsSucceeded: 8640,
      recordsFailed: 12,
      createdAt: toTimestamp(new Date(NOW - 45 * 60 * 1000).toISOString())
    },
    {
      id: 'mock-job-3',
      jobId: 'JOB-2025-04-17-019',
      sourceId: 'SRC-SAT-009',
      status: 'failed',
      recordsProcessed: 0,
      recordsSucceeded: 0,
      recordsFailed: 0,
      createdAt: toTimestamp(new Date(NOW - 20 * 60 * 60 * 1000).toISOString())
    }
  ],
  apiIntegrations: [
    {
      id: 'mock-api-1',
      integrationId: 'API-TIDE-001',
      integrationName: 'Tide Gauge Partner Feed',
      apiEndpoint: 'https://partners.nara.lk/api/v1/tides',
      method: 'GET',
      authMethod: 'api_key',
      totalRequests: 624000,
      successfulRequests: 618400,
      lastRequestAt: new Date(NOW - 5 * 60 * 1000).toISOString()
    },
    {
      id: 'mock-api-2',
      integrationId: 'API-FORECAST-004',
      integrationName: 'Fisheries Forecast Delivery',
      apiEndpoint: 'https://partners.nara.lk/api/v1/forecast',
      method: 'POST',
      authMethod: 'bearer',
      totalRequests: 448200,
      successfulRequests: 430560,
      lastRequestAt: new Date(NOW - 35 * 60 * 1000).toISOString()
    },
    {
      id: 'mock-api-3',
      integrationId: 'API-OPEN-010',
      integrationName: 'Open Data Sandbox',
      apiEndpoint: 'https://sandbox.api.nara.lk/v1/catalogue',
      method: 'GET',
      authMethod: 'none',
      totalRequests: 754200,
      successfulRequests: 731280,
      lastRequestAt: new Date(NOW - 2 * 60 * 60 * 1000).toISOString()
    }
  ],
  recentActivity: [
    {
      id: 'activity-1',
      jobId: 'JOB-2025-04-18-002',
      status: 'running',
      recordsSucceeded: 8640,
      timestamp: new Date(NOW - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'activity-2',
      jobId: 'JOB-2025-04-18-001',
      status: 'completed',
      recordsSucceeded: 15600,
      timestamp: new Date(NOW - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'activity-3',
      jobId: 'JOB-2025-04-17-019',
      status: 'failed',
      recordsSucceeded: 0,
      timestamp: new Date(NOW - 18 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'activity-4',
      jobId: 'API-FORECAST-004',
      status: 'completed',
      recordsSucceeded: 1200,
      timestamp: new Date(NOW - 3 * 60 * 60 * 1000).toISOString()
    }
  ]
};

export const getIntegrationMockData = () => JSON.parse(JSON.stringify(MOCK_DATA));

export default getIntegrationMockData;
