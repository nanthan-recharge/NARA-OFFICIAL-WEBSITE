// Marine Forecast Data Hook - React Query Integration

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  OceanForecastPoint, 
  Location, 
  Observation,
  ForecastFilter 
} from '../types/forecast.types';
import { 
  getForecasts, 
  getForecastByLocation, 
  submitObservation,
  generateMockForecastData 
} from '../services/forecastService';

/**
 * Hook for fetching forecast data with React Query caching
 */
export function useForecastData(filters?: ForecastFilter) {
  return useQuery({
    queryKey: ['forecasts', filters],
    queryFn: () => getForecasts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)
    refetchOnWindowFocus: false,
    retry: 2
  });
}

/**
 * Hook for fetching forecast by location
 */
export function useForecastByLocation(location: Location | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['forecast', location?.name],
    queryFn: () => location ? getForecastByLocation(location) : null,
    enabled: enabled && location !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });
}

/**
 * Hook for mock data during development
 */
export function useMockForecastData(location: Location, days: number = 5) {
  return useQuery({
    queryKey: ['mock-forecast', location.name, days],
    queryFn: () => generateMockForecastData(location, days),
    staleTime: Infinity, // Mock data doesn't change
    gcTime: Infinity
  });
}

/**
 * Hook for submitting observations
 */
export function useSubmitObservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (observation: Observation) => submitObservation(observation),
    onSuccess: () => {
      // Invalidate and refetch forecast queries
      queryClient.invalidateQueries({ queryKey: ['forecasts'] });
    }
  });
}

/**
 * Hook for offline submission queue
 */
export function useOfflineSubmission() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const mutation = useSubmitObservation();

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const submit = async (observation: Observation) => {
    if (isOnline) {
      try {
        await mutation.mutateAsync(observation);
        return { success: true, queued: false };
      } catch (error) {
        // Queue for later if online submission fails
        await queueForSync(observation);
        return { success: true, queued: true };
      }
    } else {
      // Queue immediately if offline
      await queueForSync(observation);
      return { success: true, queued: true };
    }
  };

  return { submit, isOnline, isPending: mutation.isPending };
}

/**
 * Queue observation for background sync
 */
async function queueForSync(observation: Observation): Promise<void> {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    // Store in IndexedDB for sync
    await saveToIndexedDB(observation);
    // Register sync
    await registration.sync.register('sync-observations');
  } else {
    // Fallback: store in localStorage
    const queued = JSON.parse(localStorage.getItem('queued-observations') || '[]');
    queued.push(observation);
    localStorage.setItem('queued-observations', JSON.stringify(queued));
  }
}

async function saveToIndexedDB(observation: Observation): Promise<void> {
  // Simple IndexedDB storage
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MarineForecastDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['observations'], 'readwrite');
      const store = transaction.objectStore('observations');
      store.add(observation);
      transaction.oncomplete = () => resolve();
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('observations')) {
        db.createObjectStore('observations', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Need to import React for hooks
import React from 'react';
