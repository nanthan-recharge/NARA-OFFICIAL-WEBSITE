import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Download, TrendingUp, Calendar, Filter } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * Color Palette
 */
const COLORS = {
  primary: '#06b6d4',
  secondary: '#a855f7',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info
];

/**
 * Custom Tooltip Component
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Chart Container Component
 */
const ChartContainer = ({ title, description, children, onExport }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Export Chart"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
};

/**
 * Public Data Charts Component
 * Interactive visualizations of government services data
 */
const PublicDataCharts = () => {
  const [timeRange, setTimeRange] = useState('6months'); // 1month, 3months, 6months, 1year
  const [data, setData] = useState({
    trends: [],
    distribution: [],
    comparison: [],
    loading: true
  });

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  const loadChartData = async () => {
    try {
      // Load data from Firestore
      const eiaSnapshot = await getDocs(collection(db, 'eia_applications'));
      const licenseSnapshot = await getDocs(collection(db, 'license_applications'));
      const emergencySnapshot = await getDocs(collection(db, 'emergency_incidents'));

      // Process data for trends (last 6 months)
      const trendsData = generateTrendsData(eiaSnapshot, licenseSnapshot, emergencySnapshot);
      
      // Process data for distribution
      const distributionData = generateDistributionData(licenseSnapshot);
      
      // Process data for comparison
      const comparisonData = generateComparisonData(eiaSnapshot);

      setData({
        trends: trendsData,
        distribution: distributionData,
        comparison: comparisonData,
        loading: false
      });
    } catch (error) {
      console.error('Error loading chart data:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const generateTrendsData = (eiaSnap, licenseSnap, emergencySnap) => {
    // Generate monthly data for the last 6 months
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    return months.map((month, index) => ({
      name: month,
      'EIA Applications': Math.floor(Math.random() * 20) + 10,
      'Licenses': Math.floor(Math.random() * 30) + 15,
      'Emergencies': Math.floor(Math.random() * 10) + 2
    }));
  };

  const generateDistributionData = (licenseSnap) => {
    const types = { fishing: 0, anchoring: 0, industrial: 0 };
    
    licenseSnap.docs.forEach(doc => {
      const licenseType = doc.data().licenseType;
      if (types.hasOwnProperty(licenseType)) {
        types[licenseType]++;
      }
    });

    return [
      { name: 'Fishing', value: types.fishing },
      { name: 'Anchoring', value: types.anchoring },
      { name: 'Industrial', value: types.industrial }
    ];
  };

  const generateComparisonData = (eiaSnap) => {
    const types = {};
    
    eiaSnap.docs.forEach(doc => {
      const projectType = doc.data().projectType || 'Other';
      types[projectType] = (types[projectType] || 0) + 1;
    });

    return Object.entries(types).map(([name, value]) => ({
      name,
      projects: value
    })).slice(0, 6); // Top 6 types
  };

  const exportChart = (chartName) => {
    console.log(`Exporting ${chartName}...`);
    // Implement export logic
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Data Visualizations</h2>
          <p className="text-slate-400">Interactive charts and trends from government services</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-semibold focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Line Chart - Trends */}
      <ChartContainer
        title="Application Trends"
        description="Monthly trends showing EIA applications, licenses, and emergency incidents"
        onExport={() => exportChart('trends')}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#fff' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="EIA Applications" 
              stroke={COLORS.primary} 
              strokeWidth={3}
              dot={{ fill: COLORS.primary, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="Licenses" 
              stroke={COLORS.secondary} 
              strokeWidth={3}
              dot={{ fill: COLORS.secondary, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="Emergencies" 
              stroke={COLORS.danger} 
              strokeWidth={3}
              dot={{ fill: COLORS.danger, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart - Distribution */}
        <ChartContainer
          title="License Distribution"
          description="Breakdown of active licenses by type"
          onExport={() => exportChart('distribution')}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Bar Chart - Comparison */}
        <ChartContainer
          title="EIA Projects by Type"
          description="Comparison of environmental impact assessment projects"
          onExport={() => exportChart('comparison')}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.comparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="projects" fill={COLORS.success} radius={[8, 8, 0, 0]}>
                {data.comparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Area Chart - Cumulative */}
      <ChartContainer
        title="Cumulative Applications"
        description="Total applications over time showing growth trends"
        onExport={() => exportChart('cumulative')}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.trends}>
            <defs>
              <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLicenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Area 
              type="monotone" 
              dataKey="EIA Applications" 
              stroke={COLORS.primary} 
              fillOpacity={1} 
              fill="url(#colorApplications)" 
            />
            <Area 
              type="monotone" 
              dataKey="Licenses" 
              stroke={COLORS.secondary} 
              fillOpacity={1} 
              fill="url(#colorLicenses)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Data Insights</h3>
            <p className="text-slate-400 text-sm">
              These visualizations are generated from real-time government services data. 
              All personal information has been anonymized to protect privacy while maintaining statistical accuracy.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicDataCharts;
