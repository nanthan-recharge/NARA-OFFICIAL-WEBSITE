const hasWindow = typeof window !== 'undefined';

const STORAGE_KEYS = {
  government: 'nara_integration_government',
  research: 'nara_integration_research',
  satelliteSources: 'nara_integration_satellite_sources',
  satelliteJobs: 'nara_integration_satellite_jobs',
  apiEndpoints: 'nara_integration_api_endpoints'
};

const sampleGovernment = [
  {
    id: 'gov-1',
    name: 'Department of Fisheries Registry',
    description: 'National vessel registry and licensing database with weekly sync',
    connection_url: 'https://api.gov.lk/fisheries/vessels',
    data_format: 'json',
    security_level: 'internal',
    sync_frequency_hours: 24,
    connection_status: 'active',
    last_synced_at: '2024-06-12T06:00:00Z',
    created_at: '2024-03-01T00:00:00Z'
  },
  {
    id: 'gov-2',
    name: 'Coastal Risk Information System',
    description: 'Hazard layers, bathymetry, and shoreline change indicators',
    connection_url: 'https://coastal.gov.lk/api/risk-layer',
    data_format: 'geojson',
    security_level: 'confidential',
    sync_frequency_hours: 6,
    connection_status: 'maintenance',
    last_synced_at: '2024-06-11T18:00:00Z',
    created_at: '2024-02-14T00:00:00Z'
  }
];

const sampleResearch = [
  {
    id: 'res-1',
    name: 'Norwegian Institute of Marine Research',
    country: 'Norway',
    website_url: 'https://www.hi.no',
    contact_email: 'partnerships@hi.no',
    research_areas: ['Fisheries modelling', 'Acoustic surveys', 'Climate dynamics'],
    partnership_status: 'active',
    established_at: '2022-08-01',
    data_sharing_agreements: [
      {
        id: 'dsa-1',
        title: 'North Indian Ocean Pelagic Monitoring',
        status: 'active',
        signed_at: '2023-02-15'
      }
    ]
  },
  {
    id: 'res-2',
    name: 'CSIRO Oceans and Atmosphere',
    country: 'Australia',
    website_url: 'https://www.csiro.au',
    contact_email: 'oceans-partners@csiro.au',
    research_areas: ['Ocean observations', 'Satellites', 'Forecast systems'],
    partnership_status: 'pending',
    established_at: '2023-06-20',
    data_sharing_agreements: []
  }
];

const sampleSatelliteSources = [
  {
    id: 'sat-1',
    satellite_name: 'Sentinel-2',
    satellite_type: 'Optical',
    provider: 'ESA',
    data_product: 'CoastalImagery',
    coverage_region: 'Sri Lanka EEZ',
    refresh_rate_hours: 12,
    status: 'active'
  },
  {
    id: 'sat-2',
    satellite_name: 'NOAA-20',
    satellite_type: 'Thermal',
    provider: 'NOAA',
    data_product: 'SeaSurfaceTemperature',
    coverage_region: 'Indian Ocean',
    refresh_rate_hours: 6,
    status: 'active'
  }
];

const sampleSatelliteJobs = [
  {
    id: 'job-1',
    data_source_id: 'sat-1',
    job_name: 'Daily coastal bloom detection',
    processing_status: 'running',
    submitted_at: '2024-06-12T03:00:00Z',
    completed_at: null,
    error_message: null
  },
  {
    id: 'job-2',
    data_source_id: 'sat-2',
    job_name: 'Nightly SST anomaly tiles',
    processing_status: 'completed',
    submitted_at: '2024-06-11T19:00:00Z',
    completed_at: '2024-06-11T19:40:00Z',
    error_message: null
  }
];

const sampleApiEndpoints = [
  {
    id: 'api-1',
    name: 'Tide Gauge API',
    description: 'Live sea-level and tidal harmonics for coastal stations',
    endpoint_url: 'https://api.nara.lk/v1/tide-gauge',
    status: true,
    average_latency_ms: 240,
    requests_today: 12876,
    error_rate: 0.4,
    created_at: '2023-12-01T00:00:00Z',
    access_level: 'partner'
  },
  {
    id: 'api-2',
    name: 'Fisheries Forecast API',
    description: 'Predicted catch-per-unit-effort across fishing zones',
    endpoint_url: 'https://api.nara.lk/v1/fisheries-forecast',
    status: false,
    average_latency_ms: 420,
    requests_today: 7420,
    error_rate: 1.2,
    created_at: '2024-02-18T00:00:00Z',
    access_level: 'restricted'
  }
];

const readStore = (key, fallback) => {
  if (!hasWindow) {
    return structuredClone(fallback);
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.warn('[integrationService] Failed to read localStorage:', error);
  }
  return structuredClone(fallback);
};

const writeStore = (key, value) => {
  if (!hasWindow) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('[integrationService] Failed to persist state:', error);
  }
};

const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 7)}-${Date.now().toString(36)}`;

const state = {
  government: readStore(STORAGE_KEYS.government, sampleGovernment),
  research: readStore(STORAGE_KEYS.research, sampleResearch),
  satelliteSources: readStore(STORAGE_KEYS.satelliteSources, sampleSatelliteSources),
  satelliteJobs: readStore(STORAGE_KEYS.satelliteJobs, sampleSatelliteJobs),
  apiEndpoints: readStore(STORAGE_KEYS.apiEndpoints, sampleApiEndpoints)
};

const clone = (value) => structuredClone(value);

const simulateDelay = async (result, delay = 120) => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return clone(result);
};

export const integrationMonitoringService = {
  async getDashboardData() {
    const integrations = [
      ...state.government.map((item) => ({
        id: item.id,
        name: item.name,
        system: 'Government database',
        status: item.connection_status,
        health_score: item.connection_status === 'active' ? 96 : 72,
        alert_threshold_breached: item.connection_status !== 'active',
        last_synced_at: item.last_synced_at
      })),
      ...state.apiEndpoints.map((endpoint) => ({
        id: endpoint.id,
        name: endpoint.name,
        system: 'API gateway',
        status: endpoint.status ? 'active' : 'inactive',
        health_score: endpoint.status ? 92 : 60,
        alert_threshold_breached: !endpoint.status || endpoint.error_rate > 1,
        last_synced_at: endpoint.created_at
      })),
      ...state.satelliteSources.map((source) => ({
        id: source.id,
        name: source.satellite_name,
        system: 'Satellite ingest',
        status: source.status,
        health_score: source.status === 'active' ? 88 : 70,
        alert_threshold_breached: source.status !== 'active',
        last_synced_at: new Date().toISOString()
      }))
    ];
    return simulateDelay(integrations);
  }
};

export const governmentConnectionsService = {
  async getAll() {
    return simulateDelay(state.government);
  },
  async create(payload) {
    const newConnection = {
      id: createId('gov'),
      connection_status: 'pending',
      created_at: new Date().toISOString(),
      last_synced_at: null,
      ...payload
    };
    state.government = [newConnection, ...state.government];
    writeStore(STORAGE_KEYS.government, state.government);
    return simulateDelay(newConnection);
  },
  async updateStatus(id, status) {
    state.government = state.government.map((item) =>
      item.id === id ? { ...item, connection_status: status, last_synced_at: new Date().toISOString() } : item
    );
    writeStore(STORAGE_KEYS.government, state.government);
    return simulateDelay(true);
  },
  async delete(id) {
    state.government = state.government.filter((item) => item.id !== id);
    writeStore(STORAGE_KEYS.government, state.government);
    return simulateDelay(true);
  }
};

export const researchInstitutionsService = {
  async getAll() {
    return simulateDelay(state.research);
  },
  async create(payload) {
    const newInstitution = {
      id: createId('res'),
      established_at: new Date().toISOString(),
      data_sharing_agreements: [],
      ...payload
    };
    state.research = [newInstitution, ...state.research];
    writeStore(STORAGE_KEYS.research, state.research);
    return simulateDelay(newInstitution);
  },
  async updatePartnershipStatus(id, status) {
    state.research = state.research.map((item) =>
      item.id === id ? { ...item, partnership_status: status } : item
    );
    writeStore(STORAGE_KEYS.research, state.research);
    return simulateDelay(true);
  }
};

export const satelliteDataService = {
  async getAllSources() {
    return simulateDelay(state.satelliteSources);
  },
  async getProcessingJobs() {
    return simulateDelay(state.satelliteJobs.map((job) => ({
      ...job,
      data_source: state.satelliteSources.find((source) => source.id === job.data_source_id) || null
    })));
  },
  async createProcessingJob(payload) {
    const job = {
      id: createId('job'),
      processing_status: 'queued',
      submitted_at: new Date().toISOString(),
      completed_at: null,
      error_message: null,
      ...payload
    };
    state.satelliteJobs = [job, ...state.satelliteJobs];
    writeStore(STORAGE_KEYS.satelliteJobs, state.satelliteJobs);
    return simulateDelay(job);
  },
  async updateProcessingStatus(id, status, errorMessage = null) {
    state.satelliteJobs = state.satelliteJobs.map((job) => {
      if (job.id !== id) return job;
      return {
        ...job,
        processing_status: status,
        error_message: errorMessage,
        completed_at: status === 'completed' ? new Date().toISOString() : job.completed_at
      };
    });
    writeStore(STORAGE_KEYS.satelliteJobs, state.satelliteJobs);
    return simulateDelay(true);
  }
};

export const apiManagementService = {
  async getAllEndpoints() {
    return simulateDelay(state.apiEndpoints);
  },
  async getUsageAnalytics(range = '7d') {
    const factor = range === '24h' ? 1 : range === '7d' ? 7 : 30;
    const totalRequests = state.apiEndpoints.reduce((sum, endpoint) => sum + endpoint.requests_today, 0) * factor;
    const avgLatency = state.apiEndpoints.reduce((sum, endpoint) => sum + endpoint.average_latency_ms, 0) /
      (state.apiEndpoints.length || 1);
    const errorRate = state.apiEndpoints.reduce((sum, endpoint) => sum + endpoint.error_rate, 0) /
      (state.apiEndpoints.length || 1);

    return simulateDelay({
      totalRequests,
      averageLatency: Math.round(avgLatency),
      errorRate: Number(errorRate.toFixed(2)),
      generatedAt: new Date().toISOString()
    });
  },
  async createEndpoint(payload) {
    const endpoint = {
      id: createId('api'),
      status: true,
      average_latency_ms: 250,
      requests_today: 0,
      error_rate: 0,
      created_at: new Date().toISOString(),
      ...payload
    };
    state.apiEndpoints = [endpoint, ...state.apiEndpoints];
    writeStore(STORAGE_KEYS.apiEndpoints, state.apiEndpoints);
    return simulateDelay(endpoint);
  },
  async toggleEndpointStatus(id, enabled) {
    state.apiEndpoints = state.apiEndpoints.map((endpoint) =>
      endpoint.id === id ? { ...endpoint, status: enabled } : endpoint
    );
    writeStore(STORAGE_KEYS.apiEndpoints, state.apiEndpoints);
    return simulateDelay(true);
  }
};

export default {
  integrationMonitoringService,
  governmentConnectionsService,
  researchInstitutionsService,
  satelliteDataService,
  apiManagementService
};
