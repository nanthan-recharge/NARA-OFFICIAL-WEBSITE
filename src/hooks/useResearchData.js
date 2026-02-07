// Stub hook - Supabase removed
import { useState, useEffect } from 'react';

export const useResearchData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return {
    publications: [],
    projects: [],
    researchers: [],
    loading,
    error,
    refresh: () => {}
  };
};

export default useResearchData;
