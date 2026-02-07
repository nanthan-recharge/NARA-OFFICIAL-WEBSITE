import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ResearchShowcase = () => {
  const [activeProject, setActiveProject] = useState(0);

  const researchDivisions = [
    {
      id: 1,
      name: "Marine Biology & Ecology",
      description: "Biodiversity conservation and ecosystem health monitoring across Sri Lankan waters",
      currentProject: "Coral Reef Restoration Initiative",
      projectDescription: "Advanced coral propagation techniques to restore damaged reef systems in the Gulf of Mannar",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop",
      icon: "Fish",
      status: "Active Research",
      teamSize: 15,
      publications: 23,
      route: "/research-excellence-portal"
    },
    {
      id: 2,
      name: "Oceanography & Climate",
      description: "Physical oceanography, climate change impacts, and sea level monitoring",
      currentProject: "Indian Ocean Climate Modeling",
      projectDescription: "Predictive models for monsoon patterns and their impact on coastal communities",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      icon: "CloudRain",
      status: "International Collaboration",
      teamSize: 12,
      publications: 31,
      route: "/research-excellence-portal"
    },
    {
      id: 3,
      name: "Tsunami Early Warning",
      description: "Advanced warning systems and coastal hazard risk assessment",
      currentProject: "Next-Gen Alert Network",
      projectDescription: "AI-powered tsunami detection with sub-minute warning capabilities for coastal areas",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      icon: "AlertTriangle",
      status: "Critical Infrastructure",
      teamSize: 8,
      publications: 18,
      route: "/emergency-response-network"
    },
    {
      id: 4,
      name: "Marine Pollution Control",
      description: "Water quality monitoring, pollution source tracking, and remediation strategies",
      currentProject: "Microplastic Assessment Study",
      projectDescription: "Comprehensive analysis of microplastic distribution in Sri Lankan coastal waters",
      image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&h=600&fit=crop",
      icon: "Droplets",
      status: "Environmental Priority",
      teamSize: 10,
      publications: 27,
      route: "/research-excellence-portal"
    },
    {
      id: 5,
      name: "Fisheries Science",
      description: "Sustainable fishing practices, stock assessment, and aquaculture development",
      currentProject: "Smart Fishing Technology",
      projectDescription: "IoT-enabled fishing gear to reduce bycatch and optimize sustainable harvesting",
      image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop",
      icon: "Fish",
      status: "Industry Partnership",
      teamSize: 18,
      publications: 35,
      route: "/maritime-services-hub"
    },
    {
      id: 6,
      name: "Coastal Engineering",
      description: "Shoreline protection, port development, and coastal infrastructure resilience",
      currentProject: "Climate-Resilient Ports",
      projectDescription: "Engineering solutions for port infrastructure adaptation to sea level rise",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      icon: "Anchor",
      status: "Infrastructure Development",
      teamSize: 14,
      publications: 22,
      route: "/partnership-innovation-gateway"
    },
    {
      id: 7,
      name: "Marine Biotechnology",
      description: "Bioprospecting, marine pharmaceuticals, and biotechnological applications",
      currentProject: "Marine Drug Discovery",
      projectDescription: "Screening marine organisms for novel pharmaceutical compounds and applications",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop",
      icon: "Microscope",
      status: "Innovation Research",
      teamSize: 11,
      publications: 19,
      route: "/research-excellence-portal"
    },
    {
      id: 8,
      name: "Ocean Energy Systems",
      description: "Renewable energy from waves, tides, and offshore wind resources",
      currentProject: "Wave Energy Pilot Project",
      projectDescription: "Testing wave energy converters for sustainable coastal power generation",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop",
      icon: "Zap",
      status: "Renewable Energy",
      teamSize: 9,
      publications: 16,
      route: "/partnership-innovation-gateway"
    },
    {
      id: 9,
      name: "Maritime Archaeology",
      description: "Underwater cultural heritage preservation and historical maritime research",
      currentProject: "Ancient Trade Route Mapping",
      projectDescription: "3D mapping of historical shipwrecks along ancient Indian Ocean trade routes",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      icon: "Compass",
      status: "Cultural Heritage",
      teamSize: 7,
      publications: 14,
      route: "/knowledge-discovery-center"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % researchDivisions?.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleProjectSelect = (index) => {
    setActiveProject(index);
  };

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <Icon name="Beaker" size={16} className="text-accent" />
            <span className="text-sm font-cta text-accent uppercase tracking-wide">
              Research Excellence
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-headline font-bold text-text-primary mb-6">
            Nine Divisions of
            <span className="block text-ocean-medium">Ocean Science</span>
          </h2>
          <p className="text-xl text-text-secondary font-body max-w-3xl mx-auto leading-relaxed">
            From coral reef restoration to tsunami early warning, our research divisions tackle the most pressing challenges facing Sri Lanka's marine environment and blue economy.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Division Selector */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 ocean-depth-shadow sticky top-24">
              <h3 className="text-lg font-cta-medium text-text-primary mb-6">Research Divisions</h3>
              <div className="space-y-2">
                {researchDivisions?.map((division, index) => (
                  <button
                    key={division?.id}
                    onClick={() => handleProjectSelect(index)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-ocean ${
                      activeProject === index
                        ? 'bg-ocean-deep text-white' :'hover:bg-muted text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={division?.icon} 
                        size={20} 
                        className={activeProject === index ? 'text-white' : 'text-ocean-medium'}
                      />
                      <div className="flex-1">
                        <div className={`text-sm font-cta-medium ${
                          activeProject === index ? 'text-white' : 'text-text-primary'
                        }`}>
                          {division?.name}
                        </div>
                        <div className={`text-xs mt-1 ${
                          activeProject === index ? 'text-white/80' : 'text-text-secondary'
                        }`}>
                          {division?.publications} Publications
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Project Display */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl overflow-hidden ocean-depth-shadow">
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={researchDivisions?.[activeProject]?.image}
                  alt={researchDivisions?.[activeProject]?.currentProject}
                  className="w-full h-full object-cover transition-transform duration-ocean hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-success/20 px-3 py-1 rounded-full">
                      <span className="text-xs font-cta text-success uppercase tracking-wide">
                        {researchDivisions?.[activeProject]?.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-white">
                    {researchDivisions?.[activeProject]?.currentProject}
                  </h3>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-cta-medium text-text-primary mb-2">
                      {researchDivisions?.[activeProject]?.name}
                    </h4>
                    <p className="text-text-secondary font-body">
                      {researchDivisions?.[activeProject]?.description}
                    </p>
                  </div>
                  <Icon 
                    name={researchDivisions?.[activeProject]?.icon} 
                    size={32} 
                    className="text-ocean-medium flex-shrink-0"
                  />
                </div>

                <div className="bg-muted rounded-lg p-6 mb-6">
                  <h5 className="text-sm font-cta text-text-primary uppercase tracking-wide mb-3">
                    Current Focus
                  </h5>
                  <p className="text-text-secondary font-body leading-relaxed">
                    {researchDivisions?.[activeProject]?.projectDescription}
                  </p>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-headline font-bold text-ocean-deep">
                      {researchDivisions?.[activeProject]?.teamSize}
                    </div>
                    <div className="text-xs text-text-secondary font-cta uppercase tracking-wide">
                      Team Members
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-headline font-bold text-accent">
                      {researchDivisions?.[activeProject]?.publications}
                    </div>
                    <div className="text-xs text-text-secondary font-cta uppercase tracking-wide">
                      Publications
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-headline font-bold text-success">
                      2025
                    </div>
                    <div className="text-xs text-text-secondary font-cta uppercase tracking-wide">
                      Active Since
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={researchDivisions?.[activeProject]?.route} className="flex-1">
                    <Button
                      variant="default"
                      fullWidth
                      className="bg-ocean-deep hover:bg-ocean-deep/90 text-white font-cta-medium"
                      iconName="ArrowRight"
                      iconPosition="right"
                    >
                      Explore Division
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-ocean-medium text-ocean-medium hover:bg-ocean-medium hover:text-white font-cta-medium"
                    iconName="Users"
                    iconPosition="left"
                  >
                    Join Research
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link to="/research-excellence-portal">
            <Button
              variant="outline"
              size="lg"
              className="border-ocean-deep text-ocean-deep hover:bg-ocean-deep hover:text-white font-cta-medium"
              iconName="Microscope"
              iconPosition="left"
            >
              View All Research Divisions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResearchShowcase;