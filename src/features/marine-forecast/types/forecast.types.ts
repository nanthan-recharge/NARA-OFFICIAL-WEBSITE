// Marine Forecast TypeScript Types - Following 2024-2025 Best Practices

export interface Location {
  lat: number;
  lon: number;
  name: string;
  region: string;
  timezone: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface SpeciesAbundance {
  skipjack: number;
  yellowfin: number;
  bigeye: number;
  swordfish: number;
  sailfish: number;
}

export interface CatchProbability {
  skipjack: number;  // 0-1
  yellowfin: number;
  bigeye: number;
  swordfish: number;
  sailfish: number;
}

export interface OceanConditions {
  sst: number;          // Sea surface temperature (°C)
  chlorophyll: number;  // mg/m³
  salinity: number;     // PSU
  waveHeight: number;   // meters
  waveDirection: number; // degrees
  wavePeriod: number;   // seconds
  windSpeed: number;    // km/h
  windDirection: number; // degrees
  windGusts: number;    // km/h
  currentSpeed: number; // knots
  currentDirection: number; // degrees
  visibility: number;   // km
  pressure: number;     // hPa
}

export interface OceanForecastPoint {
  id: string;
  lat: number;
  lon: number;
  timestamp: Date;
  validUntil: Date;
  abundance: SpeciesAbundance;
  catchProbability: CatchProbability;
  conditions: OceanConditions;
  confidence: number;     // 0-1
  source: string;
  modelVersion: string;
}

export interface ForecastMetadata {
  issuedAt: Date;
  validFrom: Date;
  validUntil: Date;
  source: string;
  confidence: number;
  modelVersion: string;
  coverage: string;
}

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  image: string;
  status: 'abundant' | 'common' | 'rare' | 'depleted';
  season: string;
  habitat: 'pelagic' | 'demersal' | 'coastal' | 'offshore';
  minDepth: number;
  maxDepth: number;
  temperature: {
    min: number;
    max: number;
    optimal: number;
  };
  description: string;
}

// Discriminated union for forecast state management
export type ForecastState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; metadata: ForecastMetadata }
  | { status: 'error'; error: Error };

export interface UserPreferences {
  defaultLocation: Location | null;
  favoriteLocations: Location[];
  preferredSpecies: string[];
  units: 'metric' | 'imperial';
  language: string;
  notifications: {
    enabled: boolean;
    alertThreshold: number;
  };
}

export interface Observation {
  id?: string;
  userId: string;
  location: Location;
  timestamp: Date;
  species: string;
  count: number;
  weight?: number;
  depth: number;
  notes: string;
  weather: Partial<OceanConditions>;
  photo?: string;
  verified: boolean;
}

// Firebase Firestore document interface
export interface ForecastDocument {
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  timestamp: Date;
  validUntil: Date;
  waveData: {
    height: number;
    period: number;
    direction: number;
  };
  windData: {
    speed: number;
    direction: number;
    gusts: number;
  };
  speciesAbundance: SpeciesAbundance;
  metadata: ForecastMetadata;
}

// Chart data interfaces
export interface TimeSeriesData {
  date: Date;
  value: number;
  category: string;
}

export interface HeatmapData {
  x: number;
  y: number;
  value: number;
}

// API Response types
export interface APIResponse<T> {
  data: T;
  metadata: {
    total: number;
    page: number;
    perPage: number;
    hasMore: boolean;
  };
  timestamp: Date;
}

export interface ForecastFilter {
  location?: string;
  startDate?: Date;
  endDate?: Date;
  species?: string[];
  minConfidence?: number;
}
