import { useCallback, useEffect, useMemo, useState } from 'react';
import { integrationMonitoringService } from '../services/integrationService';

const DEFAULT_SUMMARY = {
  totalIntegrations: 0,
  activeConnections: 0,
  avgHealthScore: 0,
  alertsCount: 0,
  uptimeEstimate: 0,
  statusBreakdown: {
    active: 0,
    inactive: 0,
    maintenance: 0,
    error: 0
  }
};

const normaliseStatus = (status) => (status || '').toLowerCase();

export const useIntegrationDashboard = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await integrationMonitoringService.getDashboardData();
      setEntries(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[useIntegrationDashboard] Failed to load integration data:', err);
      setEntries([]);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const summary = useMemo(() => {
    if (!entries.length) {
      return DEFAULT_SUMMARY;
    }

    const statusBreakdown = entries.reduce(
      (acc, item) => {
        const status = normaliseStatus(item?.status);
        if (status === 'active') acc.active += 1;
        else if (status === 'maintenance') acc.maintenance += 1;
        else if (status === 'error') acc.error += 1;
        else acc.inactive += 1;
        return acc;
      },
      { active: 0, inactive: 0, maintenance: 0, error: 0 }
    );

    const totalIntegrations = entries.length;
    const activeConnections = statusBreakdown.active;
    const avgHealthScore = Math.round(
      entries.reduce((sum, item) => sum + Number(item?.health_score || 0), 0) /
        totalIntegrations
    );
    const alertsCount = entries.filter((item) => item?.alert_threshold_breached).length;
    const uptimeEstimate = Math.max(
      0,
      Math.min(100, Math.round(100 - (alertsCount / Math.max(1, totalIntegrations)) * 12))
    );

    return {
      totalIntegrations,
      activeConnections,
      avgHealthScore,
      alertsCount,
      uptimeEstimate,
      statusBreakdown
    };
  }, [entries]);

  const alerts = useMemo(
    () =>
      entries
        .filter((item) => item?.alert_threshold_breached)
        .sort(
          (a, b) =>
            Number(b?.health_score || 0) - Number(a?.health_score || 0)
        )
        .slice(0, 5),
    [entries]
  );

  return {
    entries,
    summary,
    alerts,
    lastUpdated,
    isLoading,
    error,
    refresh
  };
};

export default useIntegrationDashboard;
