/**
 * Generate chart data from lab results
 */

/**
 * Generate monthly trends data from results
 */
export const generateMonthlyTrendsData = (results) => {
  // Get last 6 months
  const months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      completed: 0,
      pending: 0,
      inProgress: 0
    });
  }

  // Count results by month and status
  results.forEach(result => {
    if (result.createdAt) {
      const date = new Date(result.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthData = months.find(m => m.monthKey === monthKey);
      
      if (monthData) {
        if (result.status === 'completed') {
          monthData.completed++;
        } else if (result.status === 'pending') {
          monthData.pending++;
        } else if (result.status === 'in_progress' || result.status === 'processing') {
          monthData.inProgress++;
        }
      }
    }
  });

  return months.map(({ month, completed, pending, inProgress }) => ({
    month,
    completed,
    pending,
    inProgress
  }));
};

/**
 * Generate test type distribution data
 */
export const generateTestTypeDistribution = (results) => {
  const distribution = {};
  
  results.forEach(result => {
    const testType = result.testType || 'Unknown';
    distribution[testType] = (distribution[testType] || 0) + 1;
  });

  return Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Generate processing time analytics data
 */
export const generateProcessingTimeData = (results) => {
  const processingTimes = {};
  
  results.forEach(result => {
    if (result.testType && result.createdAt && result.completedAt) {
      const testType = result.testType;
      const start = new Date(result.createdAt);
      const end = new Date(result.completedAt);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (!processingTimes[testType]) {
        processingTimes[testType] = { total: 0, count: 0 };
      }
      
      processingTimes[testType].total += days;
      processingTimes[testType].count++;
    }
  });

  return Object.entries(processingTimes)
    .map(([testType, data]) => ({
      testType: testType.length > 20 ? testType.substring(0, 17) + '...' : testType,
      avgDays: Math.round(data.total / data.count * 10) / 10
    }))
    .sort((a, b) => b.avgDays - a.avgDays)
    .slice(0, 8); // Top 8 test types
};

/**
 * Generate status overview data
 */
export const generateStatusOverviewData = (samples) => {
  const statusCount = {
    submitted: 0,
    received: 0,
    processing: 0,
    completed: 0,
    pending: 0
  };
  
  samples.forEach(sample => {
    const status = sample.status || 'pending';
    if (statusCount.hasOwnProperty(status)) {
      statusCount[status]++;
    } else {
      statusCount.pending++;
    }
  });

  return Object.entries(statusCount)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Generate sample data for demo purposes (when no real data)
 */
export const generateSampleChartData = () => {
  return {
    monthlyTrends: [
      { month: 'Sep 24', completed: 45, pending: 12, inProgress: 8 },
      { month: 'Oct 24', completed: 52, pending: 15, inProgress: 10 },
      { month: 'Nov 24', completed: 48, pending: 18, inProgress: 12 },
      { month: 'Dec 24', completed: 61, pending: 14, inProgress: 9 },
      { month: 'Jan 25', completed: 58, pending: 20, inProgress: 15 },
      { month: 'Feb 25', completed: 65, pending: 16, inProgress: 11 }
    ],
    testTypeDistribution: [
      { name: 'Water Quality', value: 145 },
      { name: 'Microbiological', value: 98 },
      { name: 'Chemical Analysis', value: 76 },
      { name: 'Toxicology', value: 54 },
      { name: 'Biological', value: 42 },
      { name: 'Genetic Analysis', value: 28 }
    ],
    processingTime: [
      { testType: 'Water Quality', avgDays: 2.5 },
      { testType: 'Microbiological', avgDays: 4.2 },
      { testType: 'Chemical Analysis', avgDays: 5.8 },
      { testType: 'Toxicology', avgDays: 7.3 },
      { testType: 'Biological', avgDays: 6.1 },
      { testType: 'Genetic Analysis', avgDays: 9.5 }
    ],
    statusOverview: [
      { status: 'completed', count: 142 },
      { status: 'processing', count: 35 },
      { status: 'received', count: 28 },
      { status: 'submitted', count: 18 },
      { status: 'pending', count: 12 }
    ]
  };
};
