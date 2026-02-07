import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserPathways = () => {
  const pathways = [
    {
      id: 1,
      title: "Fish Advisory System",
      subtitle: "For Fishers & General Public",
      description: "Real-time fish advisories, safe fishing zones, market prices, and seasonal restrictions to support sustainable fishing practices and fisher safety.",
      icon: "Fish",
      iconBg: "bg-cyan-600",
      route: "/fish-advisory-system",
      features: [
        "Fish catch advisories",
        "Safe fishing zones",
        "Market price updates",
        "Seasonal restrictions"
      ],
      cta: "View Advisories",
      users: "8,000+ Fishers"
    },
    {
      id: 2,
      title: "Real-Time Ocean Data",
      subtitle: "For Maritime Professionals",
      description: "Access live sea conditions, weather forecasts, fishing advisories, and shipping lane updates. Essential intelligence for safe and profitable maritime operations.",
      icon: "Waves",
      iconBg: "bg-ocean-medium",
      route: "/ocean-intelligence-dashboard-homepage",
      features: [
        "Live wave height & direction",
        "Weather & storm tracking",
        "Fishing ground advisories",
        "Port condition updates"
      ],
      cta: "View Live Data",
      users: "12,000+ Maritime Users"
    },
    {
      id: 3,
      title: "Research Collaboration",
      subtitle: "For Scientists & Researchers",
      description: "Join Sri Lanka's premier ocean science network. Access datasets, collaborate on projects, and contribute to cutting-edge marine research initiatives.",
      icon: "Microscope",
      iconBg: "bg-accent",
      route: "/research-excellence-portal",
      features: [
        "Collaborative research projects",
        "Comprehensive datasets",
        "Peer review network",
        "International partnerships"
      ],
      cta: "Start Collaborating",
      users: "500+ Research Partners"
    },
    {
      id: 4,
      title: "Marine Services",
      subtitle: "For Industry & Business",
      description: "Professional maritime consulting, water quality testing, environmental assessments, and specialized services for aquaculture and marine industries.",
      icon: "Ship",
      iconBg: "bg-success",
      route: "/maritime-services-hub",
      features: [
        "Water quality testing",
        "Environmental assessments",
        "Aquaculture consulting",
        "Industry certifications"
      ],
      cta: "Book Services",
      users: "800+ Business Clients"
    },
    {
      id: 5,
      title: "Digital Marketplace",
      subtitle: "For Researchers & Students",
      description: "Purchase research publications, digital datasets, e-books, marine charts, and educational materials. Secure Sri Lankan payment methods supported.",
      icon: "ShoppingCart",
      iconBg: "bg-coral-warm",
      route: "/nara-digital-marketplace",
      features: [
        "Research publications & reports",
        "Digital datasets & GIS maps",
        "Educational e-books",
        "Sri Lankan payment integration"
      ],
      cta: "Browse Catalog",
      users: "2,500+ Customers"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-ocean-light/10 px-4 py-2 rounded-full mb-6">
            <Icon name="Navigation" size={16} className="text-ocean-medium" />
            <span className="text-sm font-cta text-ocean-medium uppercase tracking-wide">
              Choose Your Path
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-headline font-bold text-text-primary mb-6">
            Ocean Intelligence
            <span className="block text-ocean-medium">Tailored for You</span>
          </h2>
          <p className="text-xl text-text-secondary font-body max-w-3xl mx-auto leading-relaxed">
            Whether you're navigating the seas, advancing marine science, or building ocean-based businesses, 
            NARA provides the intelligence and services you need to succeed.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {pathways?.map((pathway, index) => (
            <div 
              key={pathway?.id}
              className="group bg-card rounded-2xl p-8 ocean-depth-shadow hover:shadow-2xl transition-all duration-ocean interactive-lift"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon & Badge */}
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 ${pathway?.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-ocean`}>
                  <Icon name={pathway?.icon} size={28} className="text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-text-secondary font-cta uppercase tracking-wide">
                    Trusted by
                  </div>
                  <div className="text-sm font-cta-medium text-text-primary">
                    {pathway?.users}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-2xl font-headline font-bold text-text-primary mb-2">
                    {pathway?.title}
                  </h3>
                  <p className="text-sm text-ocean-medium font-cta-medium uppercase tracking-wide">
                    {pathway?.subtitle}
                  </p>
                </div>
                <p className="text-text-secondary font-body leading-relaxed">
                  {pathway?.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {pathway?.features?.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Check" size={12} className="text-success" />
                    </div>
                    <span className="text-sm text-text-secondary font-body">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link to={pathway?.route}>
                <Button
                  variant="default"
                  fullWidth
                  className="bg-ocean-deep hover:bg-ocean-deep/90 text-white font-cta-medium group-hover:bg-coral-warm group-hover:text-white transition-colors duration-ocean"
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  {pathway?.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-ocean-deep to-ocean-medium rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-headline font-bold mb-4">
              Not sure which path is right for you?
            </h3>
            <p className="text-white/90 font-body mb-6 max-w-2xl mx-auto">
              Our ocean intelligence experts can help you discover the best services and resources for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-cta-medium"
                iconName="MessageCircle"
                iconPosition="left"
              >
                Talk to an Expert
              </Button>
              <Button
                variant="default"
                size="lg"
                className="bg-coral-warm hover:bg-coral-warm/90 text-white font-cta-medium"
                iconName="Compass"
                iconPosition="left"
              >
                Take Our Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPathways;