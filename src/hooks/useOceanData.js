import { useState, useEffect, useCallback } from 'react';
import { oceanDataService } from 'services/oceanDataService';

export const useOceanData = () => {
  const [oceanData, setOceanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await oceanDataService.getRealTimeData();
      setOceanData(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch ocean data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    // Set up real-time subscription
    const unsubscribe = oceanDataService.subscribeToUpdates((newData) => {
      setOceanData(newData);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchData]);

  return {
    oceanData,
    isLoading,
    error,
    refreshData
  };
};
