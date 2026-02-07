/**
 * Comprehensive Ocean Data Service
 * Integrates multiple ocean data sources for Sri Lanka region
 *
 * Data Sources:
 * - IOC Sea Level Monitoring (UNESCO) - Real-time
 * - PSMSL (Permanent Service for Mean Sea Level) - Historical
 * - NOAA Tides & Currents - Real-time & Predictions
 * - Copernicus Marine Service - Satellite & Model Data
 * - NASA Earth Data - Sea Surface Temperature
 * - CEDA - Historical Ocean Observations
 * - Argo Floats - Temperature/Salinity Profiles
 * - NARA Internal Database - Research Station Data
 */

class ComprehensiveOceanDataService {
  constructor() {
    this.baseURLs = {
      ioc: 'https://www.ioc-sealevelmonitoring.org/service.php',
      psmsl: 'https://www.psmsl.org/data/obtaining',
      noaa: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
      copernicus: 'https://data.marine.copernicus.eu',
      nasa: 'https://podaac.jpl.nasa.gov/ws',
      ceda: 'https://data.ceda.ac.uk',
      argo: 'ftp://ftp.ifremer.fr/ifremer/argo',
      nara: '/api/nara-data' // Internal NARA database API endpoint
    };

    // Sri Lankan monitoring stations
    this.stations = {
      colombo: {
        name: 'Colombo',
        iocCode: 'colo',
        psmslId: 1283,
        coordinates: { lat: 6.9271, lon: 79.8612 },
        established: 1986
      },
      trincomalee: {
        name: 'Trincomalee',
        iocCode: 'trin',
        coordinates: { lat: 8.5874, lon: 81.2152 }
      },
      galle: {
        name: 'Galle',
        coordinates: { lat: 6.0328, lon: 80.2170 }
      }
    };

    // Cache for API responses
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  /**
   * 1. IOC Sea Level Monitoring (Real-time)
   * FREE - Updates every 6 minutes
   */
  async fetchIOCSeaLevel(stationCode = 'colo', period = 'latest') {
    const cacheKey = `ioc_${stationCode}_${period}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const url = `${this.baseURLs.ioc}?query=data&code=${stationCode}&format=json&period=${period}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`IOC API error: ${response.status}`);
      }

      const data = await response.json();

      const transformed = {
        source: 'IOC Sea Level Monitoring',
        station: this.stations[stationCode]?.name || stationCode,
        dataType: 'real-time',
        measurements: data.map(item => ({
          timestamp: item.stime,
          seaLevel: parseFloat(item.slevel),
          quality: item.qflag,
          unit: 'meters'
        })),
        lastUpdate: new Date().toISOString()
      };

      this.setCache(cacheKey, transformed);
      return transformed;
    } catch (error) {
      console.error('Error fetching IOC sea level data:', error);
      return this.getEmergencyFallbackData('sea_level', stationCode);
    }
  }

  /**
   * 2. PSMSL Historical Sea Level Data
   * FREE - Data from 1986-present for Colombo
   */
  async fetchPSMSLHistoricalData(stationId = 1283, dataType = 'monthly') {
    const cacheKey = `psmsl_${stationId}_${dataType}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // PSMSL provides data via direct download links
      // For monthly mean sea level data
      const url = `${this.baseURLs.psmsl}/met.monthly.data/rlr_monthly/${stationId}.rlrdata`;

      const response = await fetch(url);
      const textData = await response.text();

      // Parse PSMSL format: year, height, interpolated flag, quality flag
      const lines = textData.trim().split('\n');
      const measurements = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        const year = parseFloat(parts[0]);
        const height = parseFloat(parts[1]);

        // PSMSL uses -99999 for missing data
        if (height === -99999) return null;

        return {
          year,
          month: Math.floor((year % 1) * 12) + 1,
          seaLevel: height / 1000, // Convert from mm to meters
          interpolated: parts[2] === '1',
          quality: parts[3]
        };
      }).filter(Boolean);

      const result = {
        source: 'PSMSL (Permanent Service for Mean Sea Level)',
        station: 'Colombo',
        stationId,
        dataType: 'historical-monthly',
        period: `${measurements[0]?.year}-present`,
        measurements,
        lastUpdate: new Date().toISOString()
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching PSMSL data:', error);
      return this.getHistoricalFallbackData();
    }
  }

  /**
   * 3. NOAA Tides & Currents
   * FREE - Real-time and predictions
   */
  async fetchNOAATides(station = '9414290', product = 'predictions') {
    // Note: NOAA doesn't have stations in Sri Lanka, but we can use their API structure
    // This is a template for when/if they add Indian Ocean stations
    const cacheKey = `noaa_${station}_${product}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const today = new Date();
      const endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const params = new URLSearchParams({
        station,
        product,
        begin_date: this.formatNOAADate(today),
        end_date: this.formatNOAADate(endDate),
        datum: 'MLLW',
        units: 'metric',
        time_zone: 'gmt',
        application: 'NARA_Maritime',
        format: 'json'
      });

      const url = `${this.baseURLs.noaa}?${params}`;
      const response = await fetch(url);
      const data = await response.json();

      const result = {
        source: 'NOAA Tides & Currents',
        product,
        predictions: data.predictions?.map(p => ({
          timestamp: p.t,
          value: parseFloat(p.v),
          type: p.type // H (high) or L (low)
        })),
        lastUpdate: new Date().toISOString()
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching NOAA data:', error);
      return null;
    }
  }

  /**
   * 4. Copernicus Marine Service
   * FREE (Registration required) - Satellite & model data
   */
  async fetchCopernicusData(params = {}) {
    const cacheKey = `copernicus_${JSON.stringify(params)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Copernicus requires authentication and uses their Python API
      // This would typically go through a backend proxy
      const response = await fetch('/api/ocean-data/copernicus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: 'GLOBAL_ANALYSISFORECAST_PHY_001_024',
          variables: ['sea_surface_height', 'temperature', 'salinity'],
          region: {
            lat: [5, 10], // Sri Lanka region
            lon: [79, 82]
          },
          depth: [0, 10, 50, 100],
          ...params
        })
      });

      const data = await response.json();

      const result = {
        source: 'Copernicus Marine Service',
        dataset: 'Global Ocean Physics Analysis and Forecast',
        region: 'Sri Lanka Waters',
        data,
        lastUpdate: new Date().toISOString()
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching Copernicus data:', error);
      return null;
    }
  }

  /**
   * 5. NASA Earth Data - Sea Surface Temperature
   * FREE (Registration required)
   */
  async fetchNASASeaTemperature(lat = 6.9271, lon = 79.8612) {
    const cacheKey = `nasa_sst_${lat}_${lon}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // NASA PODAAC API would typically require authentication
      // This goes through backend proxy
      const response = await fetch('/api/ocean-data/nasa-sst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon })
      });

      const data = await response.json();

      const result = {
        source: 'NASA Earth Data',
        dataset: 'MODIS Sea Surface Temperature',
        location: { lat, lon },
        temperature: data.temperature,
        unit: 'Celsius',
        resolution: '1km',
        lastUpdate: new Date().toISOString()
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching NASA SST data:', error);
      return null;
    }
  }

  /**
   * 6. CEDA Historical Ocean Observations
   * FREE (Registration required)
   */
  async fetchCEDAHistoricalData(params = {}) {
    const cacheKey = `ceda_${JSON.stringify(params)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // CEDA API access through backend
      const response = await fetch('/api/ocean-data/ceda-historical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: 'Indian Ocean',
          coordinates: { lat: [5, 10], lon: [79, 82] },
          variables: ['temperature', 'salinity', 'currents'],
          period: { start: '1990-01-01', end: 'present' },
          ...params
        })
      });

      const data = await response.json();

      const result = {
        source: 'CEDA (Centre for Environmental Data Analysis)',
        dataset: 'Historical Ocean Observations',
        format: 'NetCDF',
        data,
        lastUpdate: new Date().toISOString()
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching CEDA data:', error);
      return null;
    }
  }

  /**
   * 7. Argo Float Data - Temperature/Salinity Profiles
   * FREE - Real-time float data
   */
  async fetchArgoFloatData(region = 'indian_ocean_sri_lanka') {
    const cacheKey = `argo_${region}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Argo data access through backend FTP proxy
      const response = await fetch('/api/ocean-data/argo-floats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: {
            lat: [5, 10],
            lon: [79, 82]
          },
          maxAge: '30d' // Last 30 days
        })
      });

      const data = await response.json();

      const result = {
        source: 'Argo Float Network',
        region: 'Indian Ocean (Sri Lanka region)',
        floats: data.floats?.map(f => ({
          floatId: f.id,
          location: f.location,
          profiles: f.profiles.map(p => ({
            depth: p.depth,
            temperature: p.temperature,
            salinity: p.salinity,
            pressure: p.pressure,
            timestamp: p.timestamp
          }))
        })),
        lastUpdate: new Date().toISOString()
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching Argo float data:', error);
      return this.getArgoFallbackData();
    }
  }

  /**
   * 8. NARA Internal Database
   * Internal research station data, tide gauges, Samudra Maru cruises
   */
  async fetchNARAInternalData(params = {}) {
    const cacheKey = `nara_internal_${JSON.stringify(params)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(this.baseURLs.nara, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataTypes: ['tide_gauge', 'research_station', 'samudra_maru'],
          period: params.period || '1990-present',
          stations: params.stations || ['all']
        })
      });

      const data = await response.json();

      const result = {
        source: 'NARA Internal Database',
        datasets: {
          tideGauge: data.tide_gauge,
          researchStation: data.research_station,
          samudraMaru: data.samudra_maru
        },
        format: ['Excel', 'CSV', 'Database'],
        lastUpdate: new Date().toISOString()
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching NARA internal data:', error);
      return null;
    }
  }

  /**
   * Unified Data Fetch - Gets all available data for a location
   */
  async fetchAllOceanData(station = 'colombo') {
    const stationInfo = this.stations[station];

    try {
      // Fetch all data sources in parallel
      const [
        iocData,
        psmslData,
        copernicusData,
        nasaSST,
        argoData,
        naraData
      ] = await Promise.allSettled([
        this.fetchIOCSeaLevel(stationInfo.iocCode),
        this.fetchPSMSLHistoricalData(stationInfo.psmslId),
        this.fetchCopernicusData(),
        this.fetchNASASeaTemperature(stationInfo.coordinates.lat, stationInfo.coordinates.lon),
        this.fetchArgoFloatData(),
        this.fetchNARAInternalData({ stations: [station] })
      ]);

      return {
        station: stationInfo.name,
        coordinates: stationInfo.coordinates,
        dataSources: {
          realTime: {
            ioc: iocData.status === 'fulfilled' ? iocData.value : null,
            nasa: nasaSST.status === 'fulfilled' ? nasaSST.value : null
          },
          historical: {
            psmsl: psmslData.status === 'fulfilled' ? psmslData.value : null,
            nara: naraData.status === 'fulfilled' ? naraData.value : null
          },
          satellite: {
            copernicus: copernicusData.status === 'fulfilled' ? copernicusData.value : null
          },
          profiles: {
            argo: argoData.status === 'fulfilled' ? argoData.value : null
          }
        },
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching unified ocean data:', error);
      return null;
    }
  }

  /**
   * Helper: Format date for NOAA API
   */
  formatNOAADate(date) {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }

  /**
   * Cache Management
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  /**
   * Emergency Fallback Data - When APIs are unavailable
   */
  getEmergencyFallbackData(dataType, station) {
    const now = new Date();
    const measurements = [];

    for (let i = 24; i >= 0; i--) {
      const time = new Date(now - i * 60 * 60 * 1000);
      const hourOfDay = time.getHours();

      // Simulate tidal patterns
      const baseLevel = station === 'colo' ? 0.45 : 0.38;
      const tidalComponent = 0.3 * Math.sin((hourOfDay / 12) * Math.PI * 2);
      const noise = (Math.random() - 0.5) * 0.05;

      measurements.push({
        timestamp: time.toISOString(),
        seaLevel: parseFloat((baseLevel + tidalComponent + noise).toFixed(3)),
        quality: 'simulated',
        unit: 'meters'
      });
    }

    return {
      source: 'Fallback Simulation',
      station: this.stations[station]?.name || station,
      dataType: 'simulated',
      measurements,
      warning: 'This is simulated data. Real-time data unavailable.',
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Historical Fallback Data
   */
  getHistoricalFallbackData() {
    const measurements = [];
    const startYear = 1986;
    const currentYear = new Date().getFullYear();

    for (let year = startYear; year <= currentYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const baseLevel = 7.0; // Base level in meters (PSMSL RLR datum)
        const trend = (year - startYear) * 0.003; // Sea level rise trend
        const seasonal = 0.1 * Math.sin((month / 12) * Math.PI * 2);
        const noise = (Math.random() - 0.5) * 0.02;

        measurements.push({
          year: year + (month - 1) / 12,
          month,
          seaLevel: parseFloat((baseLevel + trend + seasonal + noise).toFixed(3)),
          interpolated: false,
          quality: 'simulated'
        });
      }
    }

    return {
      source: 'Simulated Historical Data',
      station: 'Colombo',
      dataType: 'historical-monthly',
      period: `${startYear}-${currentYear}`,
      measurements,
      warning: 'This is simulated historical data. Real PSMSL data unavailable.',
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Argo Fallback Data
   */
  getArgoFallbackData() {
    const floats = [];
    const numFloats = 3;

    for (let i = 0; i < numFloats; i++) {
      const profiles = [];
      const depths = [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000];

      depths.forEach(depth => {
        // Temperature decreases with depth
        const surfaceTemp = 28.5;
        const tempGradient = -0.01; // -0.01°C per meter
        const temperature = surfaceTemp + (depth * tempGradient);

        // Salinity generally increases with depth
        const surfaceSalinity = 34.5;
        const salinityGradient = 0.0005;
        const salinity = surfaceSalinity + (depth * salinityGradient);

        profiles.push({
          depth,
          temperature: parseFloat(temperature.toFixed(2)),
          salinity: parseFloat(salinity.toFixed(2)),
          pressure: parseFloat((depth * 0.1).toFixed(1)), // Approximate pressure
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        });
      });

      floats.push({
        floatId: `SIMULATED_${5900000 + i}`,
        location: {
          lat: 6.5 + Math.random() * 3,
          lon: 79.5 + Math.random() * 2
        },
        profiles
      });
    }

    return {
      source: 'Simulated Argo Float Data',
      region: 'Indian Ocean (Sri Lanka region)',
      floats,
      warning: 'This is simulated Argo float data. Real-time float data unavailable.',
      lastUpdate: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const comprehensiveOceanDataService = new ComprehensiveOceanDataService();
export default comprehensiveOceanDataService;
