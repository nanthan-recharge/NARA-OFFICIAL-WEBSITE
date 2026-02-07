// Marine Forecast Service - API Integration Layer

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  getDocs,
  doc,
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { 
  fetchRealOceanData, 
  getCombinedOceanData,
  predictFishAbundance 
} from './oceanDataAPI';
import type { 
  OceanForecastPoint, 
  ForecastDocument, 
  ForecastFilter,
  Location,
  Observation,
  APIResponse
} from '../types/forecast.types';

const FORECAST_COLLECTION = 'marine_forecasts';
const OBSERVATIONS_COLLECTION = 'marine_observations';

// Feature flag for real API usage
const USE_REAL_APIS = true;

/**
 * Fetch ocean forecasts with optional filters
 */
export async function getForecasts(
  filters: ForecastFilter = {}
): Promise<OceanForecastPoint[]> {
  try {
    const forecastsRef = collection(db, FORECAST_COLLECTION);
    const constraints = [];

    // Apply filters
    if (filters.location) {
      constraints.push(where('locationName', '==', filters.location));
    }

    if (filters.startDate) {
      constraints.push(where('timestamp', '>=', Timestamp.fromDate(filters.startDate)));
    }

    if (filters.endDate) {
      constraints.push(where('validUntil', '<=', Timestamp.fromDate(filters.endDate)));
    }

    if (filters.minConfidence) {
      constraints.push(where('metadata.confidence', '>=', filters.minConfidence));
    }

    // Order by timestamp
    constraints.push(orderBy('timestamp', 'desc'));
    constraints.push(firestoreLimit(50));

    const q = query(forecastsRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data() as ForecastDocument;
      return transformFirestoreToForecast(doc.id, data);
    });
  } catch (error) {
    console.error('Error fetching forecasts:', error);
    return [];
  }
}

/**
 * Get forecast for specific location and time
 */
export async function getForecastByLocation(
  location: Location,
  targetDate: Date = new Date()
): Promise<OceanForecastPoint | null> {
  try {
    const forecastsRef = collection(db, FORECAST_COLLECTION);
    const q = query(
      forecastsRef,
      where('locationName', '==', location.name),
      where('validUntil', '>', Timestamp.fromDate(targetDate)),
      orderBy('validUntil'),
      firestoreLimit(1)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data() as ForecastDocument;
    return transformFirestoreToForecast(doc.id, data);
  } catch (error) {
    console.error('Error fetching forecast by location:', error);
    return null;
  }
}

/**
 * Submit field observation
 */
export async function submitObservation(
  observation: Observation
): Promise<{ success: boolean; id?: string }> {
  try {
    const observationRef = doc(collection(db, OBSERVATIONS_COLLECTION));
    await setDoc(observationRef, {
      ...observation,
      timestamp: Timestamp.fromDate(observation.timestamp),
      createdAt: Timestamp.now(),
      verified: false
    });

    return { success: true, id: observationRef.id };
  } catch (error) {
    console.error('Error submitting observation:', error);
    throw error;
  }
}

/**
 * Generate mock forecast data for development/testing
 */
export function generateMockForecastData(
  location: Location,
  days: number = 5
): OceanForecastPoint[] {
  const forecasts: OceanForecastPoint[] = [];
  const baseDate = new Date();

  for (let day = 0; day < days; day++) {
    const timestamp = new Date(baseDate);
    timestamp.setDate(timestamp.getDate() + day);

    const forecast: OceanForecastPoint = {
      id: `forecast-${location.name}-${day}`,
      lat: location.lat + (Math.random() - 0.5) * 0.1,
      lon: location.lon + (Math.random() - 0.5) * 0.1,
      timestamp,
      validUntil: new Date(timestamp.getTime() + 24 * 60 * 60 * 1000),
      abundance: {
        skipjack: Math.random() * 150 + 50,
        yellowfin: Math.random() * 100 + 30,
        bigeye: Math.random() * 80 + 20,
        swordfish: Math.random() * 50 + 10,
        sailfish: Math.random() * 40 + 10
      },
      catchProbability: {
        skipjack: Math.random() * 0.5 + 0.3,
        yellowfin: Math.random() * 0.4 + 0.2,
        bigeye: Math.random() * 0.3 + 0.1,
        swordfish: Math.random() * 0.3 + 0.1,
        sailfish: Math.random() * 0.25 + 0.1
      },
      conditions: {
        sst: 26 + Math.random() * 4,
        chlorophyll: Math.random() * 2 + 0.5,
        salinity: 34 + Math.random() * 2,
        waveHeight: Math.random() * 2 + 0.5,
        waveDirection: Math.random() * 360,
        wavePeriod: Math.random() * 5 + 5,
        windSpeed: Math.random() * 30 + 10,
        windDirection: Math.random() * 360,
        windGusts: Math.random() * 40 + 15,
        currentSpeed: Math.random() * 2 + 0.5,
        currentDirection: Math.random() * 360,
        visibility: Math.random() * 20 + 10,
        pressure: 1010 + Math.random() * 20
      },
      confidence: 0.75 + Math.random() * 0.2,
      source: 'NARA Ocean Model v2.0',
      modelVersion: '2.0.1'
    };

    forecasts.push(forecast);
  }

  return forecasts;
}

/**
 * Transform Firestore document to OceanForecastPoint
 */
function transformFirestoreToForecast(
  id: string,
  doc: ForecastDocument
): OceanForecastPoint {
  return {
    id,
    lat: doc.location.latitude,
    lon: doc.location.longitude,
    timestamp: doc.timestamp instanceof Timestamp ? doc.timestamp.toDate() : new Date(doc.timestamp),
    validUntil: doc.validUntil instanceof Timestamp ? doc.validUntil.toDate() : new Date(doc.validUntil),
    abundance: doc.speciesAbundance,
    catchProbability: {
      skipjack: 0.5,
      yellowfin: 0.4,
      bigeye: 0.3,
      swordfish: 0.2,
      sailfish: 0.2
    },
    conditions: {
      sst: 28,
      chlorophyll: 1.2,
      salinity: 35,
      waveHeight: doc.waveData.height,
      waveDirection: doc.waveData.direction,
      wavePeriod: doc.waveData.period,
      windSpeed: doc.windData.speed,
      windDirection: doc.windData.direction,
      windGusts: doc.windData.gusts,
      currentSpeed: 1,
      currentDirection: 90,
      visibility: 15,
      pressure: 1013
    },
    confidence: doc.metadata.confidence,
    source: doc.metadata.source,
    modelVersion: doc.metadata.modelVersion
  };
}

/**
 * Get popular fishing locations in Sri Lanka
 */
export function getSriLankaFishingLocations(): Location[] {
  return [
    {
      lat: 6.9271,
      lon: 79.8612,
      name: 'Colombo Offshore',
      region: 'Western Province',
      timezone: 'Asia/Colombo'
    },
    {
      lat: 8.5874,
      lon: 81.2152,
      name: 'Trincomalee Banks',
      region: 'Eastern Province',
      timezone: 'Asia/Colombo'
    },
    {
      lat: 6.0367,
      lon: 80.2170,
      name: 'Galle Deep Water',
      region: 'Southern Province',
      timezone: 'Asia/Colombo'
    },
    {
      lat: 6.1384,
      lon: 81.1185,
      name: 'Hambantota Offshore',
      region: 'Southern Province',
      timezone: 'Asia/Colombo'
    },
    {
      lat: 9.6615,
      lon: 80.0255,
      name: 'Mannar Gulf',
      region: 'Northern Province',
      timezone: 'Asia/Colombo'
    }
  ];
}
