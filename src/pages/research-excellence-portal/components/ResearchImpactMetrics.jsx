import React from 'react';
import Icon from '../../../components/AppIcon';

const ResearchImpactMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: "Total Publications",
      value: metrics?.totalPublications,
      change: metrics?.publicationsChange,
      icon: "FileText",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Citations",
      value: metrics?.totalCitations,
      change: metrics?.citationsChange,
      icon: "Quote",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Active Projects",
      value: metrics?.activeProjects,
      change: metrics?.projectsChange,
      icon: "Beaker",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Research Funding",
      value: `$${(metrics?.totalFunding / 1000000)?.toFixed(1)}M`,
      change: metrics?.fundingChange,
      icon: "DollarSign",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "International Partners",
      value: metrics?.internationalPartners,
      change: metrics?.partnersChange,
      icon: "Globe",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "H-Index",
      value: metrics?.hIndex,
      change: metrics?.hIndexChange,
      icon: "TrendingUp",
      color: "text-ocean-medium",
      bgColor: "bg-ocean-medium/10"
    }
  ];

  const formatChange = (change) => {
    const isPositive = change > 0;
    return (
      <div className={`flex items-center space-x-1 text-xs ${isPositive ? 'text-success' : 'text-error'}`}>
        <Icon name={isPositive ? "TrendingUp" : "TrendingDown"} size={12} />
        <span>{isPositive ? '+' : ''}{change}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricCards?.map((metric, index) => (
        <div
          key={index}
          className="bg-card rounded-lg ocean-depth-shadow hover:shadow-lg transition-all duration-ocean p-6 interactive-lift"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${metric?.bgColor} flex items-center justify-center`}>
              <Icon name={metric?.icon} size={24} className={metric?.color} />
            </div>
            {formatChange(metric?.change)}
          </div>
          
          <div className="mb-2">
            <div className="font-mono text-2xl font-bold text-text-primary mb-1">
              {typeof metric?.value === 'number' ? metric?.value?.toLocaleString() : metric?.value}
            </div>
            <div className="font-cta text-sm text-text-secondary">
              {metric?.title}
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all duration-ocean ${metric?.color?.replace('text-', 'bg-')}`}
              style={{ width: `${Math.min(Math.abs(metric?.change) * 10, 100)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResearchImpactMetrics;