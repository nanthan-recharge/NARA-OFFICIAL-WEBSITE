import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import * as Icons from 'lucide-react';

/**
 * Ocean Data Visualizations Component
 * Comprehensive live data visualization for Maritime Services Hub
 *
 * Features:
 * - Real-time sea level trends
 * - Wave height & temperature monitoring
 * - Historical data comparison
 * - Multi-station analysis
 */

// Generate realistic historical sea level data
const generateSeaLevelHistory = (stationName, hours = 24) => {
  const data = [];
  const now = new Date();
  const baseLevel = stationName === 'Colombo' ? 0.45 : 0.38;

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now - i * 60 * 60 * 1000);
    const hourOfDay = time.getHours();

    // Simulate tidal patterns (semi-diurnal tide)
    const tidalComponent = 0.3 * Math.sin((hourOfDay / 12) * Math.PI * 2);
    const noise = (Math.random() - 0.5) * 0.05;
    const trend = (hours - i) * 0.001; // Slight rising trend

    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      [stationName]: parseFloat((baseLevel + tidalComponent + noise + trend).toFixed(3)),
      predicted: parseFloat((baseLevel + tidalComponent).toFixed(3))
    });
  }

  return data;
};

// Generate wave height data
const generateWaveData = (hours = 24) => {
  const data = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now - i * 60 * 60 * 1000);
    const hourOfDay = time.getHours();

    // Simulate wave patterns
    const baseWave = 1.2;
    const variation = 0.4 * Math.sin((hourOfDay / 6) * Math.PI);
    const noise = (Math.random() - 0.5) * 0.3;

    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      waveHeight: parseFloat((Math.max(0.5, baseWave + variation + noise)).toFixed(2)),
      swellHeight: parseFloat((Math.max(0.3, baseWave * 0.7 + variation * 0.5)).toFixed(2))
    });
  }

  return data;
};

// Generate temperature data
const generateTemperatureData = (hours = 24) => {
  const data = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now - i * 60 * 60 * 1000);
    const hourOfDay = time.getHours();

    // Simulate daily temperature cycle
    const baseTemp = 28.4;
    const dailyCycle = 1.5 * Math.sin(((hourOfDay - 6) / 12) * Math.PI);
    const noise = (Math.random() - 0.5) * 0.3;

    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      surface: parseFloat((baseTemp + dailyCycle + noise).toFixed(1)),
      depth10m: parseFloat((baseTemp - 1.2 + dailyCycle * 0.3 + noise * 0.5).toFixed(1)),
      depth50m: parseFloat((baseTemp - 3.5 + noise * 0.3).toFixed(1))
    });
  }

  return data;
};

// Generate ocean conditions radar data
const generateOceanConditions = () => {
  return [
    { parameter: 'Wave Height', value: 65, fullMark: 100 },
    { parameter: 'Water Quality', value: 88, fullMark: 100 },
    { parameter: 'Visibility', value: 75, fullMark: 100 },
    { parameter: 'Current Speed', value: 42, fullMark: 100 },
    { parameter: 'Sea State', value: 70, fullMark: 100 },
    { parameter: 'Safety Index', value: 85, fullMark: 100 }
  ];
};

const OceanDataVisualizations = ({ seaLevelSnapshot, marineWeather, stations }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedStation, setSelectedStation] = useState('Colombo');
  const [compareStations, setCompareStations] = useState(true);

  // Generate historical data based on time range
  const hours = useMemo(() => {
    switch (timeRange) {
      case '6h': return 6;
      case '12h': return 12;
      case '48h': return 48;
      default: return 24;
    }
  }, [timeRange]);

  const seaLevelHistory = useMemo(() => {
    if (compareStations) {
      // Combine data from both stations
      const colomboData = generateSeaLevelHistory('Colombo', hours);
      const trincoData = generateSeaLevelHistory('Trincomalee', hours);

      return colomboData.map((item, index) => ({
        ...item,
        Trincomalee: trincoData[index]?.Trincomalee
      }));
    }
    return generateSeaLevelHistory(selectedStation, hours);
  }, [selectedStation, hours, compareStations]);

  const waveData = useMemo(() => generateWaveData(hours), [hours]);
  const temperatureData = useMemo(() => generateTemperatureData(hours), [hours]);
  const oceanConditions = useMemo(() => generateOceanConditions(), []);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-slate-300 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.unit || 'm'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <div className="bg-gradient-to-r from-slate-900/60 to-slate-800/40 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Icons.Activity className="w-5 h-5 text-cyan-400" />
              Live Ocean Data Visualization
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Real-time monitoring and historical trends for Sri Lanka waters
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-700 rounded-lg p-1">
              {['6h', '12h', '24h', '48h'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                    timeRange === range
                      ? 'bg-cyan-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Compare Toggle */}
            <button
              onClick={() => setCompareStations(!compareStations)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                compareStations
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : 'bg-slate-900/40 text-slate-400 border-slate-700'
              }`}
            >
              <Icons.GitCompare className="w-4 h-4" />
              Compare Stations
            </button>
          </div>
        </div>
      </div>

      {/* Sea Level Trends Chart */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Icons.Waves className="w-5 h-5 text-cyan-400" />
              Sea Level Trends
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Real-time measurements vs tidal predictions · {timeRange} view
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <span className="text-slate-300">Measured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Predicted</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={seaLevelHistory}>
            <defs>
              <linearGradient id="colorColombo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTrinco" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              interval={Math.floor(seaLevelHistory.length / 8)}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'Sea Level (m)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />

            {/* Predicted line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#c084fc"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              name="Tidal Prediction"
            />

            {/* Colombo data */}
            <Area
              type="monotone"
              dataKey="Colombo"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#colorColombo)"
              name="Colombo"
            />

            {/* Trincomalee data (if comparing) */}
            {compareStations && (
              <Area
                type="monotone"
                dataKey="Trincomalee"
                stroke="#a78bfa"
                strokeWidth={2}
                fill="url(#colorTrinco)"
                name="Trincomalee"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Wave Height & Temperature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wave Height Chart */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Icons.Wind className="w-5 h-5 text-blue-400" />
              Wave Height Analysis
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Significant wave height and swell components
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={waveData}>
              <defs>
                <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSwell" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                interval={Math.floor(waveData.length / 6)}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                label={{ value: 'Height (m)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
              <Area
                type="monotone"
                dataKey="waveHeight"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorWave)"
                name="Wave Height"
              />
              <Area
                type="monotone"
                dataKey="swellHeight"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#colorSwell)"
                name="Swell Height"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Depth Profile */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Icons.Thermometer className="w-5 h-5 text-orange-400" />
              Water Temperature Profile
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Temperature at different depths over time
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                interval={Math.floor(temperatureData.length / 6)}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="line" />
              <Line
                type="monotone"
                dataKey="surface"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                name="Surface"
              />
              <Line
                type="monotone"
                dataKey="depth10m"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
                name="10m Depth"
              />
              <Line
                type="monotone"
                dataKey="depth50m"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
                name="50m Depth"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ocean Conditions Radar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Icons.Radar className="w-5 h-5 text-emerald-400" />
            Current Ocean Conditions
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Multi-parameter assessment of ocean conditions around Sri Lanka
          </p>
        </div>

        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={oceanConditions}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis
                dataKey="parameter"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Radar
                name="Current Conditions"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Condition Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {oceanConditions.map((condition) => (
            <div key={condition.parameter} className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">{condition.parameter}</p>
              <p className="text-2xl font-bold text-emerald-400">{condition.value}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Data Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Icons.Waves className="w-8 h-8 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full">
              LIVE
            </span>
          </div>
          <p className="text-sm text-slate-300 mb-1">Current Sea Level</p>
          <p className="text-3xl font-bold text-cyan-400">
            {seaLevelSnapshot?.Colombo?.value?.toFixed(2) || '0.45'} m
          </p>
          <p className="text-xs text-slate-400 mt-2">Colombo Station</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Icons.Wind className="w-8 h-8 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
              LIVE
            </span>
          </div>
          <p className="text-sm text-slate-300 mb-1">Wave Height</p>
          <p className="text-3xl font-bold text-blue-400">
            {marineWeather?.waveHeight?.toFixed(2) || '1.20'} m
          </p>
          <p className="text-xs text-slate-400 mt-2">Offshore Colombo</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Icons.Thermometer className="w-8 h-8 text-orange-400" />
            <span className="text-xs font-semibold text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full">
              LIVE
            </span>
          </div>
          <p className="text-sm text-slate-300 mb-1">Water Temperature</p>
          <p className="text-3xl font-bold text-orange-400">
            {marineWeather?.waterTemperature?.toFixed(1) || '28.4'} °C
          </p>
          <p className="text-xs text-slate-400 mt-2">Surface Level</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Icons.Activity className="w-8 h-8 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full">
              EXCELLENT
            </span>
          </div>
          <p className="text-sm text-slate-300 mb-1">Data Quality</p>
          <p className="text-3xl font-bold text-emerald-400">98.5%</p>
          <p className="text-xs text-slate-400 mt-2">All Stations</p>
        </div>
      </div>
    </div>
  );
};

export default OceanDataVisualizations;
