import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GlobalNetworkSection = () => {
  const partnerships = [
    {
      id: 1,
      name: "NOAA Ocean Service",
      country: "United States",
      type: "Research Collaboration",
      logo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=120&h=120&fit=crop&crop=center",
      description: "Joint research on climate change impacts on coral reef ecosystems",
      projects: 8,
      publications: 15,
      status: "Active",
      established: "2019",
      focus: ["Climate Research", "Marine Biology", "Data Sharing"]
    },
    {
      id: 2,
      name: "NASA JPL",
      country: "United States", 
      type: "Technology Partnership",
      logo: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=120&h=120&fit=crop&crop=center",
      description: "Satellite oceanography and remote sensing technology development",
      projects: 5,
      publications: 12,
      status: "Active",
      established: "2020",
      focus: ["Satellite Technology", "Remote Sensing", "Ocean Monitoring"]
    },
    {
      id: 3,
      name: "Wellcome Trust",
      country: "United Kingdom",
      type: "Funding Partnership",
      logo: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120&h=120&fit=crop&crop=center",
      description: "Marine health research and capacity building initiatives",
      projects: 3,
      publications: 8,
      status: "Active",
      established: "2021",
      focus: ["Marine Health", "Capacity Building", "Research Funding"]
    },
    {
      id: 4,
      name: "CSIRO Marine",
      country: "Australia",
      type: "Research Exchange",
      logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=center",
      description: "Southern Ocean research and scientist exchange programs",
      projects: 6,
      publications: 10,
      status: "Active",
      established: "2018",
      focus: ["Southern Ocean", "Scientist Exchange", "Marine Research"]
    },
    {
      id: 5,
      name: "IOC-UNESCO",
      country: "France",
      type: "Policy Collaboration",
      logo: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=120&h=120&fit=crop&crop=center",
      description: "Ocean governance and sustainable development initiatives",
      projects: 4,
      publications: 7,
      status: "Active",
      established: "2017",
      focus: ["Ocean Governance", "Sustainable Development", "Policy Research"]
    },
    {
      id: 6,
      name: "JAMSTEC",
      country: "Japan",
      type: "Technology Sharing",
      logo: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=120&h=120&fit=crop&crop=center",
      description: "Deep sea exploration technology and research methodologies",
      projects: 7,
      publications: 13,
      status: "Active",
      established: "2019",
      focus: ["Deep Sea Research", "Technology Development", "Marine Exploration"]
    }
  ];

  const partnershipStats = [
    { label: "Active Partnerships", value: "24", icon: "Handshake" },
    { label: "Countries", value: "18", icon: "Globe" },
    { label: "Joint Publications", value: "156", icon: "FileText" },
    { label: "Shared Datasets", value: "89", icon: "Database" }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Icon name="Globe" size={32} className="text-primary" />
          </div>
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Global Research Network
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
            NARA collaborates with leading international institutions to advance ocean science and share knowledge for global marine conservation and sustainable development.
          </p>
        </div>

        {/* Partnership Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {partnershipStats?.map((stat, index) => (
            <div key={index} className="bg-card rounded-lg p-6 text-center ocean-depth-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Icon name={stat?.icon} size={24} className="text-primary" />
              </div>
              <div className="font-headline text-2xl font-bold text-text-primary mb-2">
                {stat?.value}
              </div>
              <div className="font-body text-sm text-text-secondary">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partnerships?.map((partner) => (
            <div key={partner?.id} className="bg-card rounded-lg p-6 ocean-depth-shadow hover:shadow-lg transition-all duration-300">
              {/* Partner Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={partner?.logo} 
                    alt={`${partner?.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-1">
                    {partner?.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="MapPin" size={14} className="text-text-secondary" />
                    <span className="font-body text-sm text-text-secondary">{partner?.country}</span>
                  </div>
                  <div className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs font-cta-medium rounded-full">
                    {partner?.type}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="font-body text-sm text-text-secondary mb-4 line-clamp-2">
                {partner?.description}
              </p>

              {/* Focus Areas */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {partner?.focus?.slice(0, 2)?.map((area, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-muted text-text-secondary text-xs font-cta rounded">
                      {area}
                    </span>
                  ))}
                  {partner?.focus?.length > 2 && (
                    <span className="inline-block px-2 py-1 bg-muted text-text-secondary text-xs font-cta rounded">
                      +{partner?.focus?.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Partnership Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-border">
                <div className="text-center">
                  <div className="font-cta text-lg font-semibold text-text-primary">{partner?.projects}</div>
                  <div className="font-body text-xs text-text-secondary">Projects</div>
                </div>
                <div className="text-center">
                  <div className="font-cta text-lg font-semibold text-text-primary">{partner?.publications}</div>
                  <div className="font-body text-xs text-text-secondary">Publications</div>
                </div>
                <div className="text-center">
                  <div className="font-cta text-lg font-semibold text-text-primary">{partner?.established}</div>
                  <div className="font-body text-xs text-text-secondary">Since</div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="font-body text-sm text-success">Active Partnership</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Icon name="ExternalLink" size={16} className="mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Partnership Map */}
        <div className="mt-16">
          <div className="bg-card rounded-lg p-8 ocean-depth-shadow">
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-text-primary mb-4">
                Global Partnership Network
              </h3>
              <p className="font-body text-text-secondary">
                Our collaborations span across continents, creating a truly global network of ocean science excellence.
              </p>
            </div>
            
            {/* Map Placeholder */}
            <div className="relative bg-muted rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Map" size={64} className="text-text-secondary mb-4 mx-auto" />
                <p className="font-body text-text-secondary">Interactive Partnership Map</p>
                <p className="font-body text-sm text-text-secondary mt-2">
                  Click on markers to explore partnerships by region
                </p>
              </div>
              
              {/* Sample Map Markers */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary rounded-full animate-pulse cursor-pointer"></div>
              <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-accent rounded-full animate-pulse cursor-pointer"></div>
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-secondary rounded-full animate-pulse cursor-pointer"></div>
              <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-success rounded-full animate-pulse cursor-pointer"></div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button variant="default" size="lg" className="mr-4">
            <Icon name="Plus" size={20} className="mr-2" />
            Explore Partnership Opportunities
          </Button>
          <Button variant="outline" size="lg">
            <Icon name="Download" size={20} className="mr-2" />
            Download Partnership Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GlobalNetworkSection;