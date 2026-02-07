import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TechnologyTransfer = () => {
  const [activeTab, setActiveTab] = useState('available');

  const tabs = [
    { id: 'available', name: 'Available Technologies', icon: 'Package' },
    { id: 'success', name: 'Success Stories', icon: 'Trophy' },
    { id: 'process', name: 'Transfer Process', icon: 'ArrowRight' }
  ];

  const availableTechnologies = [
    {
      id: 1,
      title: "Smart Aquaculture Monitoring System",
      category: "IoT & Sensors",
      maturity: "Commercial Ready",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&crop=center",
      description: "Integrated IoT system for real-time monitoring of water quality, fish health, and feeding optimization in aquaculture operations.",
      keyFeatures: [
        "Real-time water quality monitoring",
        "Automated feeding systems",
        "Fish health analytics",
        "Mobile app integration",
        "Predictive maintenance alerts"
      ],
      applications: ["Fish Farming", "Shrimp Cultivation", "Seaweed Production"],
      marketPotential: "$2.5B globally by 2027",
      licensingTerms: "Exclusive/Non-exclusive licensing available",
      patentStatus: "Patent granted (LK/US/EU)",
      contactPerson: "Dr. Samantha Perera",
      benefits: [
        "30% reduction in operational costs",
        "25% increase in yield",
        "Real-time monitoring capabilities",
        "Reduced environmental impact"
      ]
    },
    {
      id: 2,
      title: "Marine Plastic Detection Algorithm",
      category: "AI & Machine Learning",
      maturity: "Pilot Tested",
      image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=300&h=200&fit=crop&crop=center",
      description: "Advanced AI algorithm for detecting and classifying marine plastic pollution using satellite imagery and drone surveillance.",
      keyFeatures: [
        "Satellite image analysis",
        "Drone integration",
        "Real-time detection",
        "Pollution mapping",
        "Cleanup optimization"
      ],
      applications: ["Environmental Monitoring", "Cleanup Operations", "Policy Development"],
      marketPotential: "$1.8B marine cleanup market",
      licensingTerms: "Revenue sharing model available",
      patentStatus: "Patent pending (International)",
      contactPerson: "Dr. Rajesh Fernando",
      benefits: [
        "95% detection accuracy",
        "Automated monitoring",
        "Cost-effective surveillance",
        "Environmental impact assessment"
      ]
    },
    {
      id: 3,
      title: "Coral Restoration Biotechnology",
      category: "Biotechnology",
      maturity: "Field Tested",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop&crop=center",
      description: "Innovative biotechnology platform for accelerated coral growth and reef restoration using probiotic treatments and genetic markers.",
      keyFeatures: [
        "Probiotic coral treatments",
        "Genetic resilience markers",
        "Accelerated growth protocols",
        "Disease resistance enhancement",
        "Monitoring and assessment tools"
      ],
      applications: ["Reef Restoration", "Marine Conservation", "Tourism Recovery"],
      marketPotential: "$500M coral restoration market",
      licensingTerms: "Joint venture opportunities",
      patentStatus: "Patent granted (Multiple jurisdictions)",
      contactPerson: "Dr. Nimal Jayawardena",
      benefits: [
        "3x faster coral growth",
        "Enhanced disease resistance",
        "Improved survival rates",
        "Scalable restoration methods"
      ]
    },
    {
      id: 4,
      title: "Ocean Current Prediction Engine",
      category: "Data Analytics",
      maturity: "Commercial Ready",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop&crop=center",
      description: "Advanced predictive analytics platform for ocean current forecasting using machine learning and real-time sensor data.",
      keyFeatures: [
        "72-hour accurate forecasts",
        "Real-time data integration",
        "Machine learning algorithms",
        "API integration",
        "Mobile and web platforms"
      ],
      applications: ["Shipping Optimization", "Fishing Operations", "Renewable Energy"],
      marketPotential: "$3.2B maritime analytics market",
      licensingTerms: "SaaS licensing model",
      patentStatus: "Trade secret protection",
      contactPerson: "Dr. Kumari Silva",
      benefits: [
        "15% fuel savings for shipping",
        "Improved safety at sea",
        "Optimized fishing routes",
        "Renewable energy planning"
      ]
    }
  ];

  const successStories = [
    {
      id: 1,
      title: "AquaTech Solutions Partnership",
      partner: "AquaTech Solutions Pvt Ltd",
      technology: "Smart Aquaculture Monitoring System",
      year: "2023",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&crop=center",
      impact: [
        "Deployed across 50+ fish farms in Sri Lanka",
        "Generated $2.5M in revenue for partner",
        "Created 120 new jobs",
        "Reduced fish mortality by 35%"
      ],
      testimonial: "NARA's technology transformed our aquaculture operations. The real-time monitoring system has significantly improved our productivity and sustainability.",
      partnerType: "Local SME",
      licenseType: "Exclusive Regional License",
      royaltyGenerated: "$180K annually"
    },
    {
      id: 2,
      title: "Global Marine Analytics Collaboration",
      partner: "OceanTech International",
      technology: "Ocean Current Prediction Engine",
      year: "2022",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center",
      impact: [
        "Integrated into 200+ commercial vessels",
        "Saved 2.5M gallons of fuel annually",
        "Reduced shipping delays by 25%",
        "Expanded to 15 countries"
      ],
      testimonial: "The prediction accuracy of NARA\'s system is unmatched. It has become an essential tool for our global shipping operations.",
      partnerType: "Multinational Corporation",
      licenseType: "Non-exclusive Global License",
      royaltyGenerated: "$450K annually"
    },
    {
      id: 3,
      title: "Coral Conservation Initiative",
      partner: "Marine Conservation Foundation",
      technology: "Coral Restoration Biotechnology",
      year: "2021",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop&crop=center",
      impact: [
        "Restored 25 hectares of coral reefs",
        "Improved coral survival rates by 60%",
        "Trained 50+ marine biologists",
        "Attracted $5M in conservation funding"
      ],
      testimonial: "NARA\'s biotechnology has revolutionized our coral restoration efforts. The results exceed all our expectations.",
      partnerType: "NGO Partnership",
      licenseType: "Non-profit License",
      royaltyGenerated: "Impact-based returns"
    }
  ];

  const transferProcess = [
    {
      step: 1,
      title: "Technology Assessment",
      description: "Evaluate technology readiness, market potential, and intellectual property status",
      duration: "2-4 weeks",
      activities: [
        "Technical due diligence",
        "Market analysis",
        "IP landscape review",
        "Commercialization assessment"
      ]
    },
    {
      step: 2,
      title: "Partner Identification",
      description: "Identify and evaluate potential industry partners and licensing opportunities",
      duration: "4-8 weeks",
      activities: [
        "Market research",
        "Partner outreach",
        "Capability assessment",
        "Initial discussions"
      ]
    },
    {
      step: 3,
      title: "Negotiation & Agreement",
      description: "Negotiate licensing terms, royalty structures, and partnership agreements",
      duration: "6-12 weeks",
      activities: [
        "Term sheet development",
        "Legal documentation",
        "Financial modeling",
        "Contract finalization"
      ]
    },
    {
      step: 4,
      title: "Technology Transfer",
      description: "Transfer technology, provide training, and support implementation",
      duration: "3-6 months",
      activities: [
        "Knowledge transfer",
        "Technical training",
        "Implementation support",
        "Quality assurance"
      ]
    },
    {
      step: 5,
      title: "Ongoing Support",
      description: "Provide continued support, monitor performance, and manage relationship",
      duration: "Ongoing",
      activities: [
        "Technical support",
        "Performance monitoring",
        "Relationship management",
        "Continuous improvement"
      ]
    }
  ];

  const getMaturityColor = (maturity) => {
    switch (maturity) {
      case 'Commercial Ready': return 'text-success bg-success/10';
      case 'Field Tested': return 'text-primary bg-primary/10';
      case 'Pilot Tested': return 'text-warning bg-warning/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-6">
            <Icon name="ArrowRightLeft" size={32} className="text-secondary" />
          </div>
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Technology Transfer Hub
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
            Discover how NARA's innovative marine technologies are transforming industries and creating sustainable solutions for ocean challenges worldwide.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab?.id)}
              className="flex items-center space-x-2"
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.name}</span>
            </Button>
          ))}
        </div>

        {/* Available Technologies Tab */}
        {activeTab === 'available' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {availableTechnologies?.map((tech) => (
                <div key={tech?.id} className="bg-card rounded-lg overflow-hidden ocean-depth-shadow hover:shadow-lg transition-all duration-300">
                  {/* Technology Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={tech?.image} 
                      alt={tech?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-cta-medium ${getMaturityColor(tech?.maturity)}`}>
                        {tech?.maturity}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-cta-medium text-text-primary">
                        {tech?.category}
                      </span>
                    </div>
                  </div>

                  {/* Technology Content */}
                  <div className="p-6">
                    <h3 className="font-cta text-xl font-semibold text-text-primary mb-3">
                      {tech?.title}
                    </h3>
                    
                    <p className="font-body text-text-secondary mb-4 line-clamp-2">
                      {tech?.description}
                    </p>

                    {/* Key Features */}
                    <div className="mb-4">
                      <h4 className="font-cta text-sm font-medium text-text-primary mb-2">Key Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {tech?.keyFeatures?.slice(0, 3)?.map((feature, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-cta rounded">
                            {feature}
                          </span>
                        ))}
                        {tech?.keyFeatures?.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-muted text-text-secondary text-xs font-cta rounded">
                            +{tech?.keyFeatures?.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Market Information */}
                    <div className="grid grid-cols-1 gap-3 mb-4 text-sm">
                      <div>
                        <span className="font-cta text-text-secondary">Market Potential:</span>
                        <p className="font-body text-text-primary">{tech?.marketPotential}</p>
                      </div>
                      <div>
                        <span className="font-cta text-text-secondary">Patent Status:</span>
                        <p className="font-body text-text-primary">{tech?.patentStatus}</p>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-4">
                      <h4 className="font-cta text-sm font-medium text-text-primary mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {tech?.benefits?.slice(0, 2)?.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                            <span className="font-body text-text-secondary">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contact and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="font-cta text-sm text-text-secondary">Contact:</p>
                        <p className="font-body text-sm text-text-primary">{tech?.contactPerson}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Info" size={16} className="mr-2" />
                          Details
                        </Button>
                        <Button variant="default" size="sm">
                          <Icon name="Mail" size={16} className="mr-2" />
                          Inquire
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Stories Tab */}
        {activeTab === 'success' && (
          <div className="space-y-8">
            {successStories?.map((story) => (
              <div key={story?.id} className="bg-card rounded-lg p-8 ocean-depth-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image 
                          src={story?.image} 
                          alt={story?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-cta text-xl font-semibold text-text-primary mb-2">
                          {story?.title}
                        </h3>
                        <p className="font-body text-text-secondary mb-2">
                          Partner: {story?.partner}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-cta text-text-secondary">Technology: {story?.technology}</span>
                          <span className="font-cta text-text-secondary">Year: {story?.year}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-cta text-lg font-medium text-text-primary mb-3">Impact Achieved:</h4>
                      <ul className="space-y-2">
                        {story?.impact?.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Icon name="TrendingUp" size={16} className="text-success mt-0.5 flex-shrink-0" />
                            <span className="font-body text-text-secondary">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <Icon name="Quote" size={20} className="text-primary mb-2" />
                      <p className="font-body text-text-secondary italic">
                        "{story?.testimonial}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-primary/5 rounded-lg p-4">
                      <h4 className="font-cta text-sm font-medium text-text-primary mb-3">Partnership Details</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-cta text-text-secondary">Partner Type:</span>
                          <p className="font-body text-text-primary">{story?.partnerType}</p>
                        </div>
                        <div>
                          <span className="font-cta text-text-secondary">License Type:</span>
                          <p className="font-body text-text-primary">{story?.licenseType}</p>
                        </div>
                        <div>
                          <span className="font-cta text-text-secondary">Annual Royalty:</span>
                          <p className="font-body text-text-primary">{story?.royaltyGenerated}</p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" fullWidth>
                      <Icon name="ExternalLink" size={16} className="mr-2" />
                      View Case Study
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transfer Process Tab */}
        {activeTab === 'process' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h3 className="font-headline text-2xl font-bold text-text-primary mb-4">
                Technology Transfer Process
              </h3>
              <p className="font-body text-text-secondary max-w-2xl mx-auto">
                Our structured approach ensures successful technology transfer from research to commercial application.
              </p>
            </div>

            <div className="space-y-8">
              {transferProcess?.map((step, index) => (
                <div key={step?.step} className="relative">
                  {/* Connection Line */}
                  {index < transferProcess?.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-16 bg-border"></div>
                  )}
                  
                  <div className="flex items-start space-x-6">
                    {/* Step Number */}
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-headline text-xl font-bold text-primary-foreground">
                        {step?.step}
                      </span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 bg-card rounded-lg p-6 ocean-depth-shadow">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <h3 className="font-cta text-xl font-semibold text-text-primary mb-3">
                            {step?.title}
                          </h3>
                          <p className="font-body text-text-secondary mb-4">
                            {step?.description}
                          </p>
                          
                          <div>
                            <h4 className="font-cta text-sm font-medium text-text-primary mb-2">Key Activities:</h4>
                            <ul className="space-y-1">
                              {step?.activities?.map((activity, actIndex) => (
                                <li key={actIndex} className="flex items-start space-x-2 text-sm">
                                  <Icon name="ArrowRight" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                                  <span className="font-body text-text-secondary">{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                              <Icon name="Clock" size={32} className="text-accent" />
                            </div>
                            <p className="font-cta text-sm font-medium text-text-primary">Duration</p>
                            <p className="font-body text-sm text-text-secondary">{step?.duration}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Process Benefits */}
            <div className="bg-card rounded-lg p-8 ocean-depth-shadow mt-12">
              <h3 className="font-headline text-2xl font-bold text-text-primary text-center mb-8">
                Why Choose NARA for Technology Transfer?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Award" size={32} className="text-success" />
                  </div>
                  <h4 className="font-cta text-lg font-semibold text-text-primary mb-2">
                    Proven Track Record
                  </h4>
                  <p className="font-body text-sm text-text-secondary">
                    Over 50 successful technology transfers with measurable commercial impact and industry adoption.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Shield" size={32} className="text-primary" />
                  </div>
                  <h4 className="font-cta text-lg font-semibold text-text-primary mb-2">
                    IP Protection
                  </h4>
                  <p className="font-body text-sm text-text-secondary">
                    Comprehensive intellectual property protection with international patents and trade secret management.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Users" size={32} className="text-accent" />
                  </div>
                  <h4 className="font-cta text-lg font-semibold text-text-primary mb-2">
                    Ongoing Support
                  </h4>
                  <p className="font-body text-sm text-text-secondary">
                    Continuous technical support, training, and partnership development throughout the commercialization journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8">
            <h3 className="font-headline text-2xl font-bold text-text-primary mb-4">
              Ready to Explore Technology Transfer Opportunities?
            </h3>
            <p className="font-body text-text-secondary mb-6 max-w-2xl mx-auto">
              Connect with our technology transfer team to discuss licensing opportunities, partnership models, and commercialization strategies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" size="lg">
                <Icon name="Calendar" size={20} className="mr-2" />
                Schedule Consultation
              </Button>
              <Button variant="outline" size="lg">
                <Icon name="Download" size={20} className="mr-2" />
                Download Technology Portfolio
              </Button>
              <Button variant="ghost" size="lg">
                <Icon name="Mail" size={20} className="mr-2" />
                Contact Technology Transfer Office
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyTransfer;