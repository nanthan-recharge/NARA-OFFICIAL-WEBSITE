import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const InnovationShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Innovations', icon: 'Lightbulb' },
    { id: 'autonomous', name: 'Autonomous Systems', icon: 'Bot' },
    { id: 'sensors', name: 'Sensor Networks', icon: 'Radar' },
    { id: 'ai', name: 'AI & Analytics', icon: 'Brain' },
    { id: 'sustainability', name: 'Sustainability', icon: 'Leaf' }
  ];

  const innovations = [
    {
      id: 1,
      title: "Autonomous Underwater Vehicle (AUV) Fleet",
      category: "autonomous",
      status: "In Development",
      readiness: 85,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop&crop=center",
      description: "Advanced AUV fleet capable of deep-sea exploration, data collection, and real-time environmental monitoring up to 6000m depth.",
      features: ["6000m depth capability", "Real-time data transmission", "AI-powered navigation", "Multi-sensor integration"],
      impact: "Enables comprehensive deep-sea research and monitoring of previously inaccessible marine environments",
      partners: ["JAMSTEC", "CSIRO Marine"],
      timeline: "Q2 2024 - Field Testing",
      funding: "$2.8M",
      applications: ["Deep Sea Research", "Environmental Monitoring", "Resource Exploration"]
    },
    {
      id: 2,
      title: "Smart Ocean Sensor Network",
      category: "sensors",
      status: "Pilot Phase",
      readiness: 70,
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop&crop=center",
      description: "IoT-enabled sensor network providing real-time ocean data including temperature, salinity, pH, and marine life activity.",
      features: ["Real-time monitoring", "Solar powered", "Satellite connectivity", "Predictive analytics"],
      impact: "Provides early warning systems for environmental changes and supports sustainable fishing practices",
      partners: ["NASA JPL", "NOAA"],
      timeline: "Q4 2024 - Full Deployment",
      funding: "$1.5M",
      applications: ["Climate Monitoring", "Fisheries Management", "Disaster Prevention"]
    },
    {
      id: 3,
      title: "AI-Powered Marine Species Recognition",
      category: "ai",
      status: "Production Ready",
      readiness: 95,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop&crop=center",
      description: "Machine learning system for automated identification and tracking of marine species using underwater cameras and acoustic sensors.",
      features: ["99.2% accuracy", "Real-time processing", "Species behavior analysis", "Population tracking"],
      impact: "Revolutionizes marine biodiversity monitoring and conservation efforts across Sri Lankan waters",
      partners: ["Wellcome Trust", "IOC-UNESCO"],
      timeline: "Currently Deployed",
      funding: "$950K",
      applications: ["Biodiversity Monitoring", "Conservation", "Research Automation"]
    },
    {
      id: 4,
      title: "Ocean Plastic Detection System",
      category: "sustainability",
      status: "Testing Phase",
      readiness: 60,
      image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=250&fit=crop&crop=center",
      description: "Satellite and drone-based system for detecting and tracking marine plastic pollution using advanced imaging and AI analysis.",
      features: ["Satellite integration", "Drone deployment", "Pollution mapping", "Cleanup coordination"],
      impact: "Enables targeted cleanup efforts and provides data for policy development on marine pollution",
      partners: ["NASA JPL", "Local NGOs"],
      timeline: "Q1 2025 - Pilot Expansion",
      funding: "$1.2M",
      applications: ["Environmental Protection", "Policy Development", "Cleanup Operations"]
    },
    {
      id: 5,
      title: "Coral Reef Health Monitoring Drones",
      category: "autonomous",
      status: "Field Testing",
      readiness: 75,
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop&crop=center",
      description: "Specialized underwater drones equipped with multispectral cameras and sensors for comprehensive coral reef health assessment.",
      features: ["Multispectral imaging", "Automated surveys", "Health scoring", "Bleaching detection"],
      impact: "Provides critical data for coral conservation and climate change impact assessment",
      partners: ["CSIRO Marine", "Local Universities"],
      timeline: "Q3 2024 - Operational",
      funding: "$800K",
      applications: ["Coral Conservation", "Climate Research", "Tourism Planning"]
    },
    {
      id: 6,
      title: "Predictive Ocean Current Modeling",
      category: "ai",
      status: "Beta Testing",
      readiness: 80,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop&crop=center",
      description: "Advanced AI system combining satellite data, sensor networks, and historical patterns to predict ocean currents with unprecedented accuracy.",
      features: ["72-hour forecasts", "95% accuracy", "Real-time updates", "Mobile integration"],
      impact: "Enhances maritime safety and optimizes shipping routes, reducing fuel consumption and emissions",
      partners: ["NOAA", "Maritime Industry"],
      timeline: "Q4 2024 - Commercial Launch",
      funding: "$2.1M",
      applications: ["Maritime Navigation", "Shipping Optimization", "Safety Enhancement"]
    }
  ];

  const filteredInnovations = activeCategory === 'all' 
    ? innovations 
    : innovations?.filter(innovation => innovation?.category === activeCategory);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Production Ready': return 'text-success bg-success/10';
      case 'In Development': return 'text-primary bg-primary/10';
      case 'Pilot Phase': return 'text-warning bg-warning/10';
      case 'Testing Phase': return 'text-secondary bg-secondary/10';
      case 'Field Testing': return 'text-accent bg-accent/10';
      case 'Beta Testing': return 'text-ocean-medium bg-ocean-medium/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
            <Icon name="Rocket" size={32} className="text-accent" />
          </div>
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Innovation Showcase
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
            Discover cutting-edge technologies and research innovations being developed at NARA to advance ocean science and marine conservation.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={activeCategory === category?.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category?.id)}
              className="flex items-center space-x-2"
            >
              <Icon name={category?.icon} size={16} />
              <span>{category?.name}</span>
            </Button>
          ))}
        </div>

        {/* Innovation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredInnovations?.map((innovation) => (
            <div key={innovation?.id} className="bg-card rounded-lg overflow-hidden ocean-depth-shadow hover:shadow-lg transition-all duration-300">
              {/* Innovation Image */}
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={innovation?.image} 
                  alt={innovation?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-cta-medium ${getStatusColor(innovation?.status)}`}>
                    {innovation?.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-cta-medium text-text-primary">
                    {innovation?.readiness}% Ready
                  </span>
                </div>
              </div>

              {/* Innovation Content */}
              <div className="p-6">
                <h3 className="font-cta text-xl font-semibold text-text-primary mb-3">
                  {innovation?.title}
                </h3>
                
                <p className="font-body text-text-secondary mb-4 line-clamp-2">
                  {innovation?.description}
                </p>

                {/* Key Features */}
                <div className="mb-4">
                  <h4 className="font-cta text-sm font-medium text-text-primary mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {innovation?.features?.slice(0, 3)?.map((feature, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-cta rounded">
                        {feature}
                      </span>
                    ))}
                    {innovation?.features?.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-muted text-text-secondary text-xs font-cta rounded">
                        +{innovation?.features?.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Impact Statement */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-cta text-sm font-medium text-text-primary mb-1">Impact:</h4>
                  <p className="font-body text-sm text-text-secondary">
                    {innovation?.impact}
                  </p>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-cta text-text-secondary">Timeline:</span>
                    <p className="font-body text-text-primary">{innovation?.timeline}</p>
                  </div>
                  <div>
                    <span className="font-cta text-text-secondary">Funding:</span>
                    <p className="font-body text-text-primary">{innovation?.funding}</p>
                  </div>
                </div>

                {/* Partners */}
                <div className="mb-4">
                  <span className="font-cta text-sm text-text-secondary">Partners: </span>
                  <span className="font-body text-sm text-text-primary">
                    {innovation?.partners?.join(', ')}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-cta text-sm text-text-secondary">Development Progress</span>
                    <span className="font-cta text-sm text-text-primary">{innovation?.readiness}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${innovation?.readiness}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {innovation?.applications?.slice(0, 2)?.map((app, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-cta rounded">
                        {app}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Icon name="ArrowRight" size={16} className="mr-2" />
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Innovation Statistics */}
        <div className="mt-16 bg-card rounded-lg p-8 ocean-depth-shadow">
          <div className="text-center mb-8">
            <h3 className="font-headline text-2xl font-bold text-text-primary mb-4">
              Innovation Impact
            </h3>
            <p className="font-body text-text-secondary">
              Our innovations are driving real change in ocean science and marine conservation.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="font-headline text-3xl font-bold text-primary mb-2">24</div>
              <div className="font-body text-sm text-text-secondary">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="font-headline text-3xl font-bold text-accent mb-2">$12.5M</div>
              <div className="font-body text-sm text-text-secondary">Total Investment</div>
            </div>
            <div className="text-center">
              <div className="font-headline text-3xl font-bold text-success mb-2">8</div>
              <div className="font-body text-sm text-text-secondary">Patents Filed</div>
            </div>
            <div className="text-center">
              <div className="font-headline text-3xl font-bold text-secondary mb-2">15</div>
              <div className="font-body text-sm text-text-secondary">Industry Partners</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button variant="default" size="lg" className="mr-4">
            <Icon name="Lightbulb" size={20} className="mr-2" />
            Propose Innovation
          </Button>
          <Button variant="outline" size="lg">
            <Icon name="Calendar" size={20} className="mr-2" />
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InnovationShowcase;