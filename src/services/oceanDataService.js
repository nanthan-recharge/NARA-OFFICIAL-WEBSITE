// Ocean Data Service for real-time marine data
class OceanDataService {
  constructor() {
    this.subscribers = [];
    this.mockData = this.generateMockData();
    this.updateInterval = null;
  }

  // Generate realistic mock ocean data
  generateMockData() {
    return {
      speciesCount: Math.floor(Math.random() * 5000) + 15000,
      temperature: (Math.random() * 5 + 22).toFixed(1) + "°C",
      conservationRate: Math.floor(Math.random() * 15) + 80,
      satelliteObservations: Math.floor(Math.random() * 200) + 400,
      speciesTrend: Math.random() > 0.7 ? "increasing" : "stable",
      tempTrend: Math.random() > 0.5 ? "warming" : "stable",
      conservationTrend: Math.random() > 0.6 ? "improving" : "stable",
      satelliteTrend: "active",
      lastUpdate: new Date(),
      oceanHealth: Math.floor(Math.random() * 30) + 70,
      biodiversityIndex: Math.floor(Math.random() * 20) + 80,
      pollutionLevel: Math.floor(Math.random() * 40) + 10,
      fishingActivity: Math.random() > 0.5 ? "moderate" : "low"
    };
  }

  // Get real-time data (simulated)
  async getRealTimeData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update mock data with slight variations
    this.mockData = this.generateMockData();

    return {
      ...this.mockData,
      timestamp: new Date().toISOString()
    };
  }

  // Subscribe to real-time updates
  subscribeToUpdates(callback) {
    this.subscribers.push(callback);

    // Start auto-updates if not already running
    if (!this.updateInterval) {
      this.startAutoUpdates();
    }

    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
      if (this.subscribers.length === 0) {
        this.stopAutoUpdates();
      }
    };
  }

  // Start automatic data updates
  startAutoUpdates() {
    this.updateInterval = setInterval(() => {
      const newData = this.generateMockData();
      this.mockData = newData;

      // Notify all subscribers
      this.subscribers.forEach(callback => {
        callback({
          ...newData,
          timestamp: new Date().toISOString()
        });
      });
    }, 30000); // Update every 30 seconds
  }

  // Stop automatic updates
  stopAutoUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Get current ocean health status
  getOceanHealthStatus() {
    const health = this.mockData.oceanHealth;
    if (health >= 90) return { status: 'excellent', color: 'green' };
    if (health >= 75) return { status: 'good', color: 'blue' };
    if (health >= 60) return { status: 'fair', color: 'yellow' };
    return { status: 'poor', color: 'red' };
  }

  // Get biodiversity trend
  getBiodiversityTrend() {
    return {
      current: this.mockData.biodiversityIndex,
      trend: this.mockData.speciesTrend,
      description: this.mockData.speciesTrend === 'increasing' ? 'Species diversity is improving' : 'Species diversity is stable'
    };
  }

  // Get pollution alerts
  getPollutionAlerts() {
    const level = this.mockData.pollutionLevel;
    if (level > 50) {
      return {
        level: 'high',
        message: 'High pollution levels detected',
        action: 'Investigate potential sources'
      };
    }
    if (level > 30) {
      return {
        level: 'moderate',
        message: 'Moderate pollution levels',
        action: 'Monitor closely'
      };
    }
    return {
      level: 'low',
      message: 'Pollution levels within acceptable range',
      action: 'Continue monitoring'
    };
  }
}

// Create singleton instance
export const oceanDataService = new OceanDataService();
