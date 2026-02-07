import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TodayIntelligence = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlert, setActiveAlert] = useState(0);

  // Today's critical intelligence data
  const todayData = {
    date: new Date()?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    summary: "Moderate sea conditions with favorable fishing prospects in southern waters. Minor weather advisory for northwestern coastal areas.",
    overallStatus: "favorable"
  };

  const fishingAdvisories = [
    {
      id: 1,
      region: "Southern Waters",
      status: "excellent",
      conditions: "Calm seas, 1.2m waves",
      fishingProspects: "High tuna activity",
      recommendation: "Optimal fishing conditions",
      icon: "Fish",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: 2,
      region: "Western Coast",
      status: "good",
      conditions: "Moderate seas, 1.8m waves",
      fishingProspects: "Good sardine schools",
      recommendation: "Favorable for small boats",
      icon: "Waves",
      color: "text-ocean-medium",
      bgColor: "bg-ocean-medium/10"
    },
    {
      id: 3,
      region: "Eastern Waters",
      status: "moderate",
      conditions: "Choppy seas, 2.5m waves",
      fishingProspects: "Limited activity",
      recommendation: "Caution advised",
      icon: "AlertTriangle",
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  const shippingConditions = [
    {
      id: 1,
      route: "Colombo - Trincomalee",
      status: "optimal",
      travelTime: "8.5 hours",
      conditions: "Clear skies, calm seas",
      delays: "None expected",
      icon: "Ship",
      color: "text-success"
    },
    {
      id: 2,
      route: "Colombo - Galle",
      status: "good",
      travelTime: "3.2 hours",
      conditions: "Light winds, moderate seas",
      delays: "15 min delay possible",
      icon: "Anchor",
      color: "text-ocean-medium"
    },
    {
      id: 3,
      route: "Colombo - Jaffna",
      status: "caution",
      travelTime: "12+ hours",
      conditions: "Strong winds expected",
      delays: "1-2 hour delays",
      icon: "AlertCircle",
      color: "text-warning"
    }
  ];

  const weatherAlerts = [
    {
      id: 1,
      type: "Wind Advisory",
      severity: "moderate",
      region: "Northwestern Coast",
      description: "Strong winds 35-45 km/h expected between 2 PM - 8 PM",
      validUntil: "Today 8:00 PM",
      icon: "Wind",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      id: 2,
      type: "Small Craft Advisory",
      severity: "low",
      region: "Eastern Waters",
      description: "Choppy conditions for vessels under 15m length",
      validUntil: "Tomorrow 6:00 AM",
      icon: "Sailboat",
      color: "text-ocean-medium",
      bgColor: "bg-ocean-medium/10"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const alertTimer = setInterval(() => {
      setActiveAlert((prev) => (prev + 1) % weatherAlerts?.length);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(alertTimer);
    };
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'moderate': return 'text-warning';
      case 'low': return 'text-ocean-medium';
      default: return 'text-text-secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': case 'optimal': return 'text-success';
      case 'good': return 'text-ocean-medium';
      case 'moderate': case 'caution': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-coral-warm/10 px-4 py-2 rounded-full mb-6">
            <Icon name="Clock" size={16} className="text-coral-warm" />
            <span className="text-sm font-cta text-coral-warm uppercase tracking-wide">
              Live Intelligence
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-headline font-bold text-text-primary mb-6">
            Today's Ocean
            <span className="block text-ocean-medium">Intelligence</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-text-secondary font-body leading-relaxed mb-4">
              {todayData?.date}
            </p>
            <p className="text-lg text-text-primary font-body leading-relaxed">
              {todayData?.summary}
            </p>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="bg-card rounded-2xl p-6 ocean-depth-shadow mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-cta text-success uppercase tracking-wide">
                  Live Data
                </span>
              </div>
              <div className="text-sm text-text-secondary font-mono">
                Last updated: {currentTime?.toLocaleTimeString('en-US', { 
                  hour12: false,
                  timeZone: 'Asia/Colombo'
                })} LKT
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full ${
                todayData?.overallStatus === 'favorable' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                <span className="text-xs font-cta uppercase tracking-wide">
                  {todayData?.overallStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Fishing Advisories */}
          <div className="bg-card rounded-2xl p-8 ocean-depth-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Icon name="Fish" size={24} className="text-success" />
              </div>
              <div>
                <h3 className="text-xl font-cta-medium text-text-primary">Fishing Advisories</h3>
                <p className="text-sm text-text-secondary">Regional conditions & prospects</p>
              </div>
            </div>

            <div className="space-y-4">
              {fishingAdvisories?.map((advisory) => (
                <div key={advisory?.id} className={`${advisory?.bgColor} rounded-lg p-4`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name={advisory?.icon} size={16} className={advisory?.color} />
                      <span className="font-cta-medium text-text-primary text-sm">
                        {advisory?.region}
                      </span>
                    </div>
                    <span className={`text-xs font-cta uppercase tracking-wide ${advisory?.color}`}>
                      {advisory?.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-text-secondary">
                    <div>Conditions: {advisory?.conditions}</div>
                    <div>Prospects: {advisory?.fishingProspects}</div>
                    <div className="font-cta-medium">{advisory?.recommendation}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/maritime-services-hub" className="block mt-6">
              <Button
                variant="outline"
                fullWidth
                className="border-success text-success hover:bg-success hover:text-white font-cta-medium"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Detailed Fishing Report
              </Button>
            </Link>
          </div>

          {/* Shipping Lane Conditions */}
          <div className="bg-card rounded-2xl p-8 ocean-depth-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-ocean-medium/20 rounded-lg flex items-center justify-center">
                <Icon name="Ship" size={24} className="text-ocean-medium" />
              </div>
              <div>
                <h3 className="text-xl font-cta-medium text-text-primary">Shipping Conditions</h3>
                <p className="text-sm text-text-secondary">Major route status</p>
              </div>
            </div>

            <div className="space-y-4">
              {shippingConditions?.map((condition) => (
                <div key={condition?.id} className="bg-muted rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name={condition?.icon} size={16} className={condition?.color} />
                      <span className="font-cta-medium text-text-primary text-sm">
                        {condition?.route}
                      </span>
                    </div>
                    <span className={`text-xs font-cta uppercase tracking-wide ${getStatusColor(condition?.status)}`}>
                      {condition?.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-text-secondary">
                    <div>Travel Time: {condition?.travelTime}</div>
                    <div>Conditions: {condition?.conditions}</div>
                    <div className="font-cta-medium">{condition?.delays}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/maritime-services-hub" className="block mt-6">
              <Button
                variant="outline"
                fullWidth
                className="border-ocean-medium text-ocean-medium hover:bg-ocean-medium hover:text-white font-cta-medium"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Full Shipping Report
              </Button>
            </Link>
          </div>

          {/* Weather Alerts */}
          <div className="bg-card rounded-2xl p-8 ocean-depth-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={24} className="text-warning" />
              </div>
              <div>
                <h3 className="text-xl font-cta-medium text-text-primary">Weather Alerts</h3>
                <p className="text-sm text-text-secondary">Active advisories</p>
              </div>
            </div>

            <div className="space-y-4">
              {weatherAlerts?.map((alert, index) => (
                <div 
                  key={alert?.id} 
                  className={`${alert?.bgColor} rounded-lg p-4 transition-all duration-ocean ${
                    activeAlert === index ? 'ring-2 ring-coral-warm/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name={alert?.icon} size={16} className={alert?.color} />
                      <span className="font-cta-medium text-text-primary text-sm">
                        {alert?.type}
                      </span>
                    </div>
                    <span className={`text-xs font-cta uppercase tracking-wide ${getSeverityColor(alert?.severity)}`}>
                      {alert?.severity}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-text-secondary">
                    <div>Region: {alert?.region}</div>
                    <div>{alert?.description}</div>
                    <div className="font-cta-medium">Valid until: {alert?.validUntil}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/emergency-response-network" className="block mt-6">
              <Button
                variant="outline"
                fullWidth
                className="border-warning text-warning hover:bg-warning hover:text-white font-cta-medium"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Emergency Response
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-ocean-deep to-ocean-medium rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-headline font-bold mb-4">
              Get Personalized Ocean Intelligence
            </h3>
            <p className="text-white/90 font-body mb-6 max-w-2xl mx-auto">
              Subscribe to customized alerts and reports tailored to your specific maritime activities and locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                className="bg-coral-warm hover:bg-coral-warm/90 text-white font-cta-medium"
                iconName="Bell"
                iconPosition="left"
              >
                Setup Alerts
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-cta-medium"
                iconName="Download"
                iconPosition="left"
              >
                Download App
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodayIntelligence;