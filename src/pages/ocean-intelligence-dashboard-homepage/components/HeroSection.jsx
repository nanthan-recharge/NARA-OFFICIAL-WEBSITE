import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import SriLankaEEZMap from '../../../components/SriLankaEEZMap';

const HeroSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMetric, setActiveMetric] = useState(0);

  // Live metrics data
  const liveMetrics = [
    {
      id: 1,
      title: "Wave Height",
      value: "2.3m",
      trend: "+0.2m",
      status: "moderate",
      icon: "Waves",
      color: "text-ocean-medium"
    },
    {
      id: 2,
      title: "Water Temperature",
      value: "28.5°C",
      trend: "+1.2°C",
      status: "normal",
      icon: "Thermometer",
      color: "text-success"
    },
    {
      id: 3,
      title: "Active Projects",
      value: "47",
      trend: "+3",
      status: "active",
      icon: "Activity",
      color: "text-accent"
    },
    {
      id: 4,
      title: "Research Vessels",
      value: "12",
      trend: "at sea",
      status: "operational",
      icon: "Ship",
      color: "text-ocean-deep"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const metricTimer = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % liveMetrics?.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(metricTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-ocean-deep via-ocean-medium to-ocean-light overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-coral-warm/10 rounded-full animate-ocean-pulse"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-ocean-light/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/15 rounded-full animate-bounce"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 animate-depth-reveal">
            {/* Live Status Indicator */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center space-x-2 bg-success/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-cta text-success">LIVE DATA</span>
              </div>
              <div className="text-sm text-white/80 font-mono">
                {currentTime?.toLocaleTimeString('en-US', { 
                  hour12: false,
                  timeZone: 'Asia/Colombo'
                })} LKT
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-headline font-bold text-white leading-tight">
                Ocean Intelligence
                <span className="block text-coral-warm">for Sri Lanka</span>
              </h1>
              <p className="text-xl text-white/90 font-body max-w-2xl leading-relaxed">
                Real-time oceanographic data, cutting-edge research, and maritime services that protect livelihoods and advance Sri Lanka's blue economy through scientific excellence.
              </p>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {liveMetrics?.map((metric, index) => (
                <div 
                  key={metric?.id}
                  className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all duration-ocean ${
                    activeMetric === index ? 'bg-white/20 scale-105' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name={metric?.icon} size={18} className={metric?.color} />
                    <span className="text-xs text-white/70 font-cta uppercase tracking-wide">
                      {metric?.title}
                    </span>
                  </div>
                  <div className="text-2xl font-headline font-bold text-white">
                    {metric?.value}
                  </div>
                  <div className="text-xs text-coral-warm font-mono">
                    {metric?.trend}
                  </div>
                </div>
              ))}
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                variant="default"
                size="lg"
                className="bg-coral-warm hover:bg-coral-warm/90 text-white font-cta-medium"
                iconName="BarChart3"
                iconPosition="left"
              >
                View Live Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-cta-medium"
                iconName="Users"
                iconPosition="left"
              >
                Start Collaboration
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-8 pt-4 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-headline font-bold text-white">150+</div>
                <div className="text-xs font-cta uppercase tracking-wide">Research Papers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-headline font-bold text-white">25</div>
                <div className="text-xs font-cta uppercase tracking-wide">Partner Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-headline font-bold text-white">24/7</div>
                <div className="text-xs font-cta uppercase tracking-wide">Ocean Monitoring</div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Map */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 ocean-depth-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-cta-medium text-white">Sri Lankan Waters - Live View</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/80">Real-time</span>
                </div>
              </div>
              
              {/* Map Container - Google Maps with EEZ Highlight */}
              <div className="relative h-[600px] rounded-lg overflow-hidden">
                <SriLankaEEZMap className="h-full" showMarkers={true} />
              </div>

              {/* Map Legend */}
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center space-x-4 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full opacity-60"></div>
                    <span className="text-white/80">200nm EEZ</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-white/80">Research Stations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-300 rounded-full"></div>
                    <span className="text-white/80">Sovereign Waters</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10"
                  iconName="Maximize2"
                  iconPosition="right"
                >
                  Full Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="text-xs font-cta uppercase tracking-wide">Explore More</span>
          <Icon name="ChevronDown" size={20} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;