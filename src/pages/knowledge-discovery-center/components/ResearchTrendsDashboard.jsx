import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ResearchTrendsDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('last-year');
  const [selectedMetric, setSelectedMetric] = useState('publications');

  const timeframeOptions = [
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'last-5-years', label: 'Last 5 Years' }
  ];

  const metricOptions = [
    { value: 'publications', label: 'Publications' },
    { value: 'citations', label: 'Citations' },
    { value: 'downloads', label: 'Downloads' },
    { value: 'collaborations', label: 'Collaborations' }
  ];

  const publicationTrends = [
    { month: 'Jan', publications: 45, citations: 234, downloads: 1200, collaborations: 12 },
    { month: 'Feb', publications: 52, citations: 289, downloads: 1450, collaborations: 15 },
    { month: 'Mar', publications: 38, citations: 198, downloads: 980, collaborations: 9 },
    { month: 'Apr', publications: 61, citations: 345, downloads: 1680, collaborations: 18 },
    { month: 'May', publications: 47, citations: 267, downloads: 1320, collaborations: 14 },
    { month: 'Jun', publications: 55, citations: 312, downloads: 1590, collaborations: 16 },
    { month: 'Jul', publications: 49, citations: 278, downloads: 1420, collaborations: 13 },
    { month: 'Aug', publications: 58, citations: 334, downloads: 1750, collaborations: 19 },
    { month: 'Sep', publications: 43, citations: 245, downloads: 1180, collaborations: 11 },
    { month: 'Oct', publications: 67, citations: 389, downloads: 1890, collaborations: 22 },
    { month: 'Nov', publications: 54, citations: 298, downloads: 1540, collaborations: 17 },
    { month: 'Dec', publications: 62, citations: 356, downloads: 1720, collaborations: 20 }
  ];

  const researchAreas = [
    { name: 'Marine Biology', value: 28, color: '#003366' },
    { name: 'Oceanography', value: 22, color: '#1E40AF' },
    { name: 'Climate Science', value: 18, color: '#40E0D0' },
    { name: 'Fisheries', value: 15, color: '#FF6B35' },
    { name: 'Coastal Engineering', value: 10, color: '#059669' },
    { name: 'Others', value: 7, color: '#64748B' }
  ];

  const emergingTopics = [
    {
      topic: 'Ocean Acidification Impact',
      growth: '+145%',
      publications: 23,
      trend: 'up',
      description: 'Research on pH changes in Sri Lankan coastal waters'
    },
    {
      topic: 'Microplastic Pollution',
      growth: '+89%',
      publications: 18,
      trend: 'up',
      description: 'Studies on plastic contamination in marine ecosystems'
    },
    {
      topic: 'Blue Carbon Sequestration',
      growth: '+67%',
      publications: 15,
      trend: 'up',
      description: 'Mangrove and seagrass carbon storage research'
    },
    {
      topic: 'Coral Reef Restoration',
      growth: '+34%',
      publications: 12,
      trend: 'up',
      description: 'Innovative approaches to reef rehabilitation'
    },
    {
      topic: 'Sustainable Aquaculture',
      growth: '+28%',
      publications: 19,
      trend: 'up',
      description: 'Environmentally friendly farming practices'
    }
  ];

  const topCitedPapers = [
    {
      title: 'Climate Change Impacts on Sri Lankan Coral Reefs: A 20-Year Analysis',
      authors: 'Dr. Kumari Silva, Prof. Ravi Fernando',
      citations: 456,
      year: 2023,
      journal: 'Marine Environmental Research'
    },
    {
      title: 'Monsoon Patterns and Fisheries Productivity in the Indian Ocean',
      authors: 'Dr. Nimal Perera, Dr. Sandya Jayawardena',
      citations: 389,
      year: 2023,
      journal: 'Oceanography International'
    },
    {
      title: 'Traditional Fishing Knowledge and Modern Conservation Strategies',
      authors: 'Prof. Chaminda Wijesinghe, Dr. Kumari Silva',
      citations: 334,
      year: 2022,
      journal: 'Conservation Biology'
    }
  ];

  const collaborationNetwork = [
    { institution: 'University of Colombo', projects: 45, type: 'domestic' },
    { institution: 'NOAA (USA)', projects: 23, type: 'international' },
    { institution: 'University of Peradeniya', projects: 38, type: 'domestic' },
    { institution: 'CSIRO (Australia)', projects: 19, type: 'international' },
    { institution: 'University of Ruhuna', projects: 32, type: 'domestic' },
    { institution: 'Woods Hole (USA)', projects: 15, type: 'international' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
            Research Trends Dashboard
          </h2>
          <p className="font-body text-text-secondary">
            Visualizing emerging topics and patterns in Sri Lankan marine science
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select
            options={timeframeOptions}
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
            className="min-w-40"
          />
          <Select
            options={metricOptions}
            value={selectedMetric}
            onChange={setSelectedMetric}
            className="min-w-36"
          />
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg scientific-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="FileText" size={24} className="text-primary" />
            <span className="text-xs text-success font-cta-medium">+12%</span>
          </div>
          <div className="font-headline text-2xl font-bold text-text-primary">642</div>
          <div className="text-sm text-text-secondary">Total Publications</div>
        </div>
        
        <div className="bg-card rounded-lg scientific-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Quote" size={24} className="text-secondary" />
            <span className="text-xs text-success font-cta-medium">+18%</span>
          </div>
          <div className="font-headline text-2xl font-bold text-text-primary">3,247</div>
          <div className="text-sm text-text-secondary">Total Citations</div>
        </div>
        
        <div className="bg-card rounded-lg scientific-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Download" size={24} className="text-accent" />
            <span className="text-xs text-success font-cta-medium">+25%</span>
          </div>
          <div className="font-headline text-2xl font-bold text-text-primary">18,456</div>
          <div className="text-sm text-text-secondary">Total Downloads</div>
        </div>
        
        <div className="bg-card rounded-lg scientific-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Users" size={24} className="text-success" />
            <span className="text-xs text-success font-cta-medium">+8%</span>
          </div>
          <div className="font-headline text-2xl font-bold text-text-primary">187</div>
          <div className="text-sm text-text-secondary">Active Collaborations</div>
        </div>
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Publication Trends */}
        <div className="bg-card rounded-lg scientific-border p-6">
          <h3 className="font-headline text-lg font-bold text-text-primary mb-4">
            Publication Trends
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={publicationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#003366"
                  strokeWidth={2}
                  dot={{ fill: '#003366', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Research Areas Distribution */}
        <div className="bg-card rounded-lg scientific-border p-6">
          <h3 className="font-headline text-lg font-bold text-text-primary mb-4">
            Research Areas Distribution
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={researchAreas}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {researchAreas?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Emerging Topics */}
      <div className="bg-card rounded-lg scientific-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-lg font-bold text-text-primary">
            Emerging Research Topics
          </h3>
          <Button variant="outline" size="sm" iconName="TrendingUp" iconPosition="left">
            View All Trends
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergingTopics?.map((topic, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-cta-medium text-text-primary">
                  {topic?.topic}
                </span>
                <div className="flex items-center gap-1">
                  <Icon name="TrendingUp" size={14} className="text-success" />
                  <span className="text-xs text-success font-cta-medium">
                    {topic?.growth}
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-secondary mb-2">
                {topic?.description}
              </p>
              <div className="text-xs text-text-secondary">
                {topic?.publications} publications
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Top Cited Papers & Collaboration Network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Cited Papers */}
        <div className="bg-card rounded-lg scientific-border p-6">
          <h3 className="font-headline text-lg font-bold text-text-primary mb-4">
            Most Cited Papers
          </h3>
          <div className="space-y-4">
            {topCitedPapers?.map((paper, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <h4 className="font-cta-medium text-sm text-text-primary mb-2 line-clamp-2">
                  {paper?.title}
                </h4>
                <p className="text-xs text-text-secondary mb-2">
                  {paper?.authors} • {paper?.journal} ({paper?.year})
                </p>
                <div className="flex items-center gap-2">
                  <Icon name="Quote" size={14} className="text-primary" />
                  <span className="text-xs font-cta-medium text-primary">
                    {paper?.citations} citations
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Network */}
        <div className="bg-card rounded-lg scientific-border p-6">
          <h3 className="font-headline text-lg font-bold text-text-primary mb-4">
            Collaboration Network
          </h3>
          <div className="space-y-3">
            {collaborationNetwork?.map((collab, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    collab?.type === 'international' ? 'bg-accent' : 'bg-primary'
                  }`}></div>
                  <div>
                    <div className="text-sm font-cta-medium text-text-primary">
                      {collab?.institution}
                    </div>
                    <div className="text-xs text-text-secondary capitalize">
                      {collab?.type}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-cta-medium text-text-primary">
                  {collab?.projects} projects
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchTrendsDashboard;