import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProof = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // International partnership logos
  const internationalPartners = [
    {
      name: "NOAA",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop",
      description: "National Oceanic and Atmospheric Administration"
    },
    {
      name: "NASA JPL",
      logo: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=100&fit=crop",
      description: "NASA Jet Propulsion Laboratory"
    },
    {
      name: "Wellcome Trust",
      logo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=100&fit=crop",
      description: "Global charitable foundation"
    },
    {
      name: "IOC UNESCO",
      logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=100&fit=crop",
      description: "Intergovernmental Oceanographic Commission"
    },
    {
      name: "ICES",
      logo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=100&fit=crop",
      description: "International Council for Exploration of the Sea"
    },
    {
      name: "POGO",
      logo: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=200&h=100&fit=crop",
      description: "Partnership for Observation of the Global Ocean"
    }
  ];

  // Community testimonials
  const testimonials = [
    {
      id: 1,
      name: "Kumara Perera",
      role: "Fishing Community Leader",
      location: "Negombo",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: `NARA's daily fishing advisories have transformed our operations. The accurate wave height predictions and fish movement data have increased our catch by 40% while keeping our boats safe. This is the kind of scientific support our fishing community has needed for decades.`,
      impact: "40% increase in catch efficiency",
      category: "fishing"
    },
    {
      id: 2,
      name: "Dr. Sarah Chen",
      role: "Marine Biologist",
      location: "University of California",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: `Collaborating with NARA on coral reef research has been exceptional. Their comprehensive datasets and local expertise have accelerated our joint research by months. The quality of their scientific work rivals any international institution I've worked with.`,
      impact: "3 joint publications in Nature",
      category: "research"
    },
    {
      id: 3,
      name: "Rajesh Fernando",
      role: "Aquaculture Manager",
      location: "Ceylon Fisheries Corporation",
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
      quote: `NARA's water quality monitoring and aquaculture consulting services have been invaluable for our shrimp farming operations. Their environmental assessments helped us achieve international certification and expand our export markets.`,
      impact: "ISO 14001 certification achieved",
      category: "industry"
    },
    {
      id: 4,
      name: "Captain Nimal Silva",
      role: "Port Authority",
      location: "Colombo Port",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      quote: `The tsunami early warning system and port condition updates from NARA are critical for our daily operations. Their real-time alerts have helped us prevent potential disasters and optimize shipping schedules, saving millions in potential losses.`,
      impact: "Zero weather-related incidents in 2 years",
      category: "maritime"
    }
  ];

  // Government endorsements
  const governmentEndorsements = [
    {
      ministry: "Ministry of Fisheries",
      endorsement: "NARA\'s research directly informs national fisheries policy",
      impact: "15 policy recommendations implemented"
    },
    {
      ministry: "Ministry of Environment",
      endorsement: "Leading authority on marine environmental protection",
      impact: "National Marine Protected Area strategy"
    },
    {
      ministry: "Ministry of Ports & Shipping",
      endorsement: "Essential partner for maritime safety and development",
      impact: "Port climate resilience planning"
    }
  ];

  // Impact metrics
  const impactMetrics = [
    {
      number: "150+",
      label: "Research Publications",
      description: "Peer-reviewed scientific papers",
      icon: "BookOpen"
    },
    {
      number: "25",
      label: "Partner Countries",
      description: "International collaborations",
      icon: "Globe"
    },
    {
      number: "12,000+",
      label: "Maritime Users",
      description: "Daily platform users",
      icon: "Users"
    },
    {
      number: "47",
      label: "Active Projects",
      description: "Ongoing research initiatives",
      icon: "Activity"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials?.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'fishing': return 'text-success';
      case 'research': return 'text-ocean-medium';
      case 'industry': return 'text-accent';
      case 'maritime': return 'text-ocean-deep';
      default: return 'text-text-secondary';
    }
  };

  const getCategoryBg = (category) => {
    switch (category) {
      case 'fishing': return 'bg-success/10';
      case 'research': return 'bg-ocean-medium/10';
      case 'industry': return 'bg-accent/10';
      case 'maritime': return 'bg-ocean-deep/10';
      default: return 'bg-muted';
    }
  };

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-success/10 px-4 py-2 rounded-full mb-6">
            <Icon name="Award" size={16} className="text-success" />
            <span className="text-sm font-cta text-success uppercase tracking-wide">
              Trusted Globally
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-headline font-bold text-text-primary mb-6">
            Recognized Excellence in
            <span className="block text-ocean-medium">Ocean Science</span>
          </h2>
          <p className="text-xl text-text-secondary font-body max-w-3xl mx-auto leading-relaxed">
            From local fishing communities to international research institutions, NARA's impact spans across all sectors of the ocean economy.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {impactMetrics?.map((metric, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 text-center ocean-depth-shadow hover:shadow-2xl transition-all duration-ocean interactive-lift"
            >
              <div className="w-16 h-16 bg-ocean-deep/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name={metric?.icon} size={28} className="text-ocean-deep" />
              </div>
              <div className="text-3xl font-headline font-bold text-ocean-deep mb-2">
                {metric?.number}
              </div>
              <div className="text-sm font-cta-medium text-text-primary mb-1">
                {metric?.label}
              </div>
              <div className="text-xs text-text-secondary">
                {metric?.description}
              </div>
            </div>
          ))}
        </div>

        {/* International Partners */}
        <div className="mb-16">
          <h3 className="text-2xl font-cta-medium text-text-primary text-center mb-8">
            International Research Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {internationalPartners?.map((partner, index) => (
              <div 
                key={index}
                className="bg-card rounded-lg p-4 text-center ocean-depth-shadow hover:shadow-lg transition-all duration-ocean interactive-scale"
              >
                <div className="h-16 mb-3 flex items-center justify-center">
                  <Image
                    src={partner?.logo}
                    alt={partner?.name}
                    className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-ocean"
                  />
                </div>
                <div className="text-sm font-cta-medium text-text-primary mb-1">
                  {partner?.name}
                </div>
                <div className="text-xs text-text-secondary">
                  {partner?.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Testimonials */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Active Testimonial */}
          <div className="bg-card rounded-2xl p-8 ocean-depth-shadow">
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="Quote" size={24} className="text-coral-warm" />
              <span className="text-sm font-cta text-coral-warm uppercase tracking-wide">
                Community Impact
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Image
                  src={testimonials?.[activeTestimonial]?.avatar}
                  alt={testimonials?.[activeTestimonial]?.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-cta-medium text-text-primary">
                      {testimonials?.[activeTestimonial]?.name}
                    </h4>
                    <div className={`px-2 py-1 rounded-full ${getCategoryBg(testimonials?.[activeTestimonial]?.category)}`}>
                      <span className={`text-xs font-cta uppercase tracking-wide ${getCategoryColor(testimonials?.[activeTestimonial]?.category)}`}>
                        {testimonials?.[activeTestimonial]?.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-text-secondary mb-1">
                    {testimonials?.[activeTestimonial]?.role}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {testimonials?.[activeTestimonial]?.location}
                  </div>
                </div>
              </div>

              <blockquote className="text-text-primary font-body leading-relaxed italic">
                "{testimonials?.[activeTestimonial]?.quote}"
              </blockquote>

              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm font-cta-medium text-text-primary mb-1">
                  Measurable Impact
                </div>
                <div className="text-sm text-text-secondary">
                  {testimonials?.[activeTestimonial]?.impact}
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex items-center justify-center space-x-2 mt-6">
              {testimonials?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-ocean ${
                    activeTestimonial === index ? 'bg-coral-warm w-6' : 'bg-text-secondary/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Government Endorsements */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="Shield" size={24} className="text-ocean-deep" />
              <span className="text-sm font-cta text-ocean-deep uppercase tracking-wide">
                Government Recognition
              </span>
            </div>

            {governmentEndorsements?.map((endorsement, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 ocean-depth-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-ocean-deep/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Building" size={20} className="text-ocean-deep" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-cta-medium text-text-primary mb-2">
                      {endorsement?.ministry}
                    </h4>
                    <p className="text-sm text-text-secondary font-body mb-3">
                      "{endorsement?.endorsement}"
                    </p>
                    <div className="bg-ocean-deep/5 rounded-lg p-3">
                      <div className="text-xs font-cta text-ocean-deep uppercase tracking-wide mb-1">
                        Policy Impact
                      </div>
                      <div className="text-sm text-text-secondary">
                        {endorsement?.impact}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Additional Recognition */}
            <div className="bg-gradient-to-r from-ocean-deep to-ocean-medium rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Trophy" size={24} className="text-coral-warm" />
                <h4 className="font-cta-medium">International Recognition</h4>
              </div>
              <div className="space-y-2 text-sm text-white/90">
                <div>• UNESCO Category 2 Centre designation (2023)</div>
                <div>• UNEP Global Ocean Science Award (2024)</div>
                <div>• Best Government Digital Platform (2025)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-card rounded-2xl p-8 ocean-depth-shadow">
            <h3 className="text-2xl font-headline font-bold text-text-primary mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-text-secondary font-body mb-6 max-w-2xl mx-auto">
              Become part of Sri Lanka's premier ocean science network and contribute to sustainable marine development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-ocean-deep hover:bg-ocean-deep/90 text-white px-6 py-3 rounded-lg font-cta-medium transition-colors duration-ocean flex items-center justify-center space-x-2">
                <Icon name="Users" size={18} />
                <span>Join Community</span>
              </button>
              <button className="border border-ocean-deep text-ocean-deep hover:bg-ocean-deep hover:text-white px-6 py-3 rounded-lg font-cta-medium transition-colors duration-ocean flex items-center justify-center space-x-2">
                <Icon name="FileText" size={18} />
                <span>View Case Studies</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;