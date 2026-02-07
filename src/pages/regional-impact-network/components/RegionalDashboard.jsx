import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const RegionalDashboard = ({ data = {} }) => {
  const regionOptions = data?.regionOptions ?? [];
  const timeRanges = data?.timeRanges ?? [];
  const alertsSummary = data?.alerts?.items ?? [];
  const weatherData = data?.weather?.data ?? [];
  const fishingData = data?.fishing?.data ?? [];
  const marineLifeData = data?.marineLife?.data ?? [];
  const waterQualityData = data?.waterQuality?.data ?? [];

  const [selectedRegion, setSelectedRegion] = useState(regionOptions?.[0]?.id ?? 'all');
  const [timeRange, setTimeRange] = useState(timeRanges?.[1]?.id ?? timeRanges?.[0]?.id ?? '7d');

  useEffect(() => {
    setSelectedRegion(regionOptions?.[0]?.id ?? 'all');
  }, [regionOptions]);

  useEffect(() => {
    setTimeRange(timeRanges?.[1]?.id ?? timeRanges?.[0]?.id ?? '7d');
  }, [timeRanges]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h3 className="font-headline text-xl font-bold text-text-primary">{data?.header?.title}</h3>
            <p className="font-body text-text-secondary mt-1">{data?.header?.subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <select
              value={selectedRegion}
              onChange={(event) => setSelectedRegion(event?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {regionOptions?.map((region) => (
                <option key={region?.id} value={region?.id}>
                  {region?.name}
                </option>
              ))}
            </select>

            <select
              value={timeRange}
              onChange={(event) => setTimeRange(event?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timeRanges?.map((range) => (
                <option key={range?.id} value={range?.id}>
                  {range?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {alertsSummary?.map((alert, index) => (
            <div key={index} className={`rounded-lg border p-4 ${getSeverityColor(alert?.severity)}`}>
              <div className="flex items-center justify-between mb-2">
                <Icon name={alert?.icon} size={20} />
                <span className="font-headline text-lg font-bold">{alert?.count}</span>
              </div>
              <div className="font-cta-medium text-sm">{alert?.title}</div>
              <div className="font-body text-xs mt-1">{alert?.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-headline text-lg font-bold text-text-primary">{data?.weather?.title}</h4>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="RefreshCw" size={16} />
            <span>{data?.weather?.updated}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {weatherData?.map((item, index) => (
            <div key={index} className="bg-muted rounded-lg p-4 text-center">
              <div className="font-cta-medium text-sm text-text-primary mb-2">{item?.region}</div>
              <div className="space-y-2">
                <div>
                  <div className="font-headline text-lg font-bold text-primary">{item?.temperature}°C</div>
                  <div className="font-body text-xs text-text-secondary">{data?.weather?.labels?.temperature ?? 'Temperature'}</div>
                </div>
                <div>
                  <div className="font-headline text-sm font-bold text-secondary">{item?.humidity}%</div>
                  <div className="font-body text-xs text-text-secondary">{data?.weather?.labels?.humidity ?? 'Humidity'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="region" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="windSpeed" fill="#003366" name={data?.weather?.labels?.wind ?? 'Wind speed (km/h)'} />
              <Bar dataKey="waveHeight" fill="#40E0D0" name={data?.weather?.labels?.waves ?? 'Wave height (m)'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
          <h4 className="font-headline text-lg font-bold text-text-primary mb-6">{data?.fishing?.title}</h4>

          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fishingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="excellent" stackId="a" fill="#059669" name={data?.fishing?.legend?.excellent} />
                <Bar dataKey="good" stackId="a" fill="#40E0D0" name={data?.fishing?.legend?.good} />
                <Bar dataKey="fair" stackId="a" fill="#D97706" name={data?.fishing?.legend?.fair} />
                <Bar dataKey="poor" stackId="a" fill="#DC2626" name={data?.fishing?.legend?.poor} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="font-body text-text-secondary">{data?.fishing?.legend?.excellent}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-ocean-light rounded"></div>
              <span className="font-body text-text-secondary">{data?.fishing?.legend?.good}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="font-body text-text-secondary">{data?.fishing?.legend?.fair}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="font-body text-text-secondary">{data?.fishing?.legend?.poor}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
          <h4 className="font-headline text-lg font-bold text-text-primary mb-6">{data?.marineLife?.title}</h4>

          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={marineLifeData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="count">
                  {marineLifeData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {marineLifeData?.map((species, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: species?.color }}></div>
                  <span className="font-body text-sm text-text-secondary">{species?.species}</span>
                </div>
                <span className="font-cta-medium text-sm text-text-primary">{species?.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 ocean-depth-shadow">
        <h4 className="font-headline text-lg font-bold text-text-primary mb-6">{data?.waterQuality?.title}</h4>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waterQualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line type="monotone" dataKey="ph" stroke="#003366" strokeWidth={2} name={data?.waterQuality?.legend?.ph}
                dot={{ fill: '#003366', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="dissolved_oxygen"
                stroke="#1E40AF"
                strokeWidth={2}
                name={data?.waterQuality?.legend?.oxygen}
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="turbidity"
                stroke="#40E0D0"
                strokeWidth={2}
                name={data?.waterQuality?.legend?.turbidity}
                dot={{ fill: '#40E0D0', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#FF6B35"
                strokeWidth={2}
                name={data?.waterQuality?.legend?.temperature}
                dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="font-body text-text-secondary">{data?.waterQuality?.legend?.ph}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded"></div>
            <span className="font-body text-text-secondary">{data?.waterQuality?.legend?.oxygen}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-ocean-light rounded"></div>
            <span className="font-body text-text-secondary">{data?.waterQuality?.legend?.turbidity}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded"></div>
            <span className="font-body text-text-secondary">{data?.waterQuality?.legend?.temperature}</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h4 className="font-headline text-lg font-bold text-text-primary mb-2">{data?.export?.title}</h4>
            <p className="font-body text-text-secondary">{data?.export?.description}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-cta-medium text-sm hover:bg-primary/90 transition-colors duration-ocean flex items-center space-x-2">
              <Icon name={data?.export?.actions?.export?.icon ?? 'Download'} size={16} />
              <span>{data?.export?.actions?.export?.label}</span>
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-cta-medium text-sm hover:bg-secondary/90 transition-colors duration-ocean flex items-center space-x-2">
              <Icon name={data?.export?.actions?.api?.icon ?? 'Code'} size={16} />
              <span>{data?.export?.actions?.api?.label}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalDashboard;
