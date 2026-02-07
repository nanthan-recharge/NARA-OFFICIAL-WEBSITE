// Zustand Store for Marine Forecast State Management

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Location, TimeRange, UserPreferences } from '../types/forecast.types';

interface ForecastStore {
  // Selected location state
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  
  // Time range for forecasts
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  
  // User preferences
  preferences: UserPreferences;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  
  // Favorite locations
  favoriteLocations: Location[];
  addFavoriteLocation: (location: Location) => void;
  removeFavoriteLocation: (locationName: string) => void;
  
  // UI state
  mapViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  setMapViewState: (viewState: Partial<ForecastStore['mapViewState']>) => void;
  
  // Selected species filter
  selectedSpecies: string[];
  setSelectedSpecies: (species: string[]) => void;
  
  // Reset all state
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  defaultLocation: null,
  favoriteLocations: [],
  preferredSpecies: ['skipjack', 'yellowfin', 'bigeye'],
  units: 'metric',
  language: 'en',
  notifications: {
    enabled: true,
    alertThreshold: 0.7
  }
};

const defaultTimeRange: TimeRange = {
  start: new Date(),
  end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days ahead
};

const defaultMapViewState = {
  longitude: 80.7718,
  latitude: 7.8731,
  zoom: 7
};

export const useForecastStore = create<ForecastStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        selectedLocation: null,
        timeRange: defaultTimeRange,
        preferences: defaultPreferences,
        favoriteLocations: [],
        mapViewState: defaultMapViewState,
        selectedSpecies: ['skipjack', 'yellowfin', 'bigeye'],

        // Actions
        setSelectedLocation: (location) => 
          set({ selectedLocation: location }, false, 'setSelectedLocation'),

        setTimeRange: (range) => 
          set({ timeRange: range }, false, 'setTimeRange'),

        setPreferences: (prefs) =>
          set(
            (state) => ({
              preferences: { ...state.preferences, ...prefs }
            }),
            false,
            'setPreferences'
          ),

        addFavoriteLocation: (location) =>
          set(
            (state) => ({
              favoriteLocations: [...state.favoriteLocations, location]
            }),
            false,
            'addFavoriteLocation'
          ),

        removeFavoriteLocation: (locationName) =>
          set(
            (state) => ({
              favoriteLocations: state.favoriteLocations.filter(
                (loc) => loc.name !== locationName
              )
            }),
            false,
            'removeFavoriteLocation'
          ),

        setMapViewState: (viewState) =>
          set(
            (state) => ({
              mapViewState: { ...state.mapViewState, ...viewState }
            }),
            false,
            'setMapViewState'
          ),

        setSelectedSpecies: (species) =>
          set({ selectedSpecies: species }, false, 'setSelectedSpecies'),

        reset: () =>
          set(
            {
              selectedLocation: null,
              timeRange: defaultTimeRange,
              preferences: defaultPreferences,
              favoriteLocations: [],
              mapViewState: defaultMapViewState,
              selectedSpecies: ['skipjack', 'yellowfin', 'bigeye']
            },
            false,
            'reset'
          )
      }),
      {
        name: 'marine-forecast-storage',
        partialize: (state) => ({
          preferences: state.preferences,
          favoriteLocations: state.favoriteLocations,
          selectedSpecies: state.selectedSpecies
        })
      }
    ),
    { name: 'MarineForecastStore' }
  )
);

// Selectors for optimized re-renders
export const useSelectedLocation = () => useForecastStore((state) => state.selectedLocation);
export const useTimeRange = () => useForecastStore((state) => state.timeRange);
export const usePreferences = () => useForecastStore((state) => state.preferences);
export const useFavoriteLocations = () => useForecastStore((state) => state.favoriteLocations);
export const useMapViewState = () => useForecastStore((state) => state.mapViewState);
export const useSelectedSpecies = () => useForecastStore((state) => state.selectedSpecies);
