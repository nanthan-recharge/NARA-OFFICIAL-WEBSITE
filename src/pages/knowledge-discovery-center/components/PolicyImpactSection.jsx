import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PolicyImpactSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Policies', icon: 'FileText' },
    { id: 'environmental', label: 'Environmental', icon: 'Leaf' },
    { id: 'fisheries', label: 'Fisheries', icon: 'Fish' },
    { id: 'coastal', label: 'Coastal Management', icon: 'Waves' },
    { id: 'climate', label: 'Climate Action', icon: 'Thermometer' }
  ];

  const policyImpacts = [
    {
      id: 1,
      title: 'Marine Protected Areas Expansion Act 2023',
      category: 'environmental',
      status: 'implemented',
      impactLevel: 'high',
      description: `NARA's comprehensive coral reef health assessment directly influenced the designation of three new marine protected areas covering 15,000 hectares of critical marine habitat.`,
      researchBasis: [
        'Coral Reef Biodiversity Assessment 2022','Fish Population Dynamics Study','Ecosystem Services Valuation Report'
      ],
      outcomes: [
        '40% increase in fish populations within protected zones','25% improvement in coral coverage','Enhanced tourism revenue by LKR 2.3 billion annually'
      ],
      implementationDate: '2023-06-15',leadAgency: 'Ministry of Environment',naraContribution: 'Primary research provider and technical advisor',image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Sustainable Fisheries Management Regulations 2023',category: 'fisheries',status: 'implemented',impactLevel: 'high',
      description: `Research on fish stock assessments and seasonal migration patterns led to new fishing quotas and seasonal restrictions that balance economic needs with conservation.`,
      researchBasis: [
        'Fish Stock Assessment 2022-2023','Seasonal Migration Patterns Study','Economic Impact Analysis of Fishing Practices'
      ],
      outcomes: [
        '30% reduction in overfishing incidents','Improved fish stock recovery rates','Better income stability for fishing communities'
      ],
      implementationDate: '2023-08-01',leadAgency: 'Ministry of Fisheries',naraContribution: 'Stock assessment data and policy recommendations',image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Coastal Erosion Management Strategy 2024',category: 'coastal',status: 'under-review',impactLevel: 'medium',
      description: `Long-term coastal monitoring data and erosion modeling studies are informing a national strategy to protect vulnerable coastal communities and infrastructure.`,
      researchBasis: [
        'Coastal Erosion Monitoring Program','Sea Level Rise Projections','Community Vulnerability Assessment'
      ],
      outcomes: [
        'Framework for coastal protection measures','Early warning system development','Community relocation guidelines'
      ],
      implementationDate: '2024-03-01',leadAgency: 'Coast Conservation Department',naraContribution: 'Scientific data and modeling expertise',image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Blue Carbon Initiative Policy Framework',category: 'climate',status: 'draft',impactLevel: 'high',
      description: `Research on mangrove and seagrass carbon sequestration is being used to develop policies for blue carbon trading and coastal ecosystem restoration.`,
      researchBasis: [
        'Blue Carbon Assessment Study','Mangrove Restoration Effectiveness','Carbon Trading Potential Analysis'
      ],
      outcomes: [
        'Carbon credit mechanism development','Restoration funding framework','International collaboration opportunities'
      ],
      implementationDate: '2024-07-01',leadAgency: 'Climate Change Secretariat',naraContribution: 'Carbon sequestration research and monitoring protocols',image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop'
    },
    {
      id: 5,
      title: 'Marine Pollution Control Act Amendment 2023',category: 'environmental',status: 'implemented',impactLevel: 'medium',
      description: `Microplastic pollution research and marine debris studies contributed to strengthened regulations on plastic waste management and marine pollution control.`,
      researchBasis: [
        'Microplastic Pollution Assessment','Marine Debris Impact Study','Pollution Source Identification'
      ],
      outcomes: [
        'Stricter plastic waste regulations','Enhanced monitoring protocols','Public awareness campaigns'
      ],
      implementationDate: '2023-11-15',leadAgency: 'Central Environmental Authority',naraContribution: 'Pollution assessment and monitoring data',image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=200&fit=crop'
    }
  ];

  const getStatusColor = (status) => {
    const colorMap = {
      'implemented': 'bg-success text-success-foreground',
      'under-review': 'bg-warning text-warning-foreground',
      'draft': 'bg-muted text-text-secondary'
    };
    return colorMap?.[status] || 'bg-muted text-text-secondary';
  };

  const getImpactColor = (level) => {
    const colorMap = {
      'high': 'text-error',
      'medium': 'text-warning',
      'low': 'text-success'
    };
    return colorMap?.[level] || 'text-text-secondary';
  };

  const filteredPolicies = selectedCategory === 'all' 
    ? policyImpacts 
    : policyImpacts?.filter(policy => policy?.category === selectedCategory);

  const policyStats = {
    total: policyImpacts?.length,
    implemented: policyImpacts?.filter(p => p?.status === 'implemented')?.length,
    underReview: policyImpacts?.filter(p => p?.status === 'under-review')?.length,
    draft: policyImpacts?.filter(p => p?.status === 'draft')?.length,
    highImpact: policyImpacts?.filter(p => p?.impactLevel === 'high')?.length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
          Policy Impact Dashboard
        </h2>
        <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
          Demonstrating how NARA research directly influences government decisions and environmental regulations for Sri Lanka's marine resources
        </p>
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-card rounded-lg scientific-border p-4 text-center">
          <div className="font-headline text-2xl font-bold text-primary mb-1">
            {policyStats?.total}
          </div>
          <div className="text-xs text-text-secondary">Total Policies</div>
        </div>
        <div className="bg-card rounded-lg scientific-border p-4 text-center">
          <div className="font-headline text-2xl font-bold text-success mb-1">
            {policyStats?.implemented}
          </div>
          <div className="text-xs text-text-secondary">Implemented</div>
        </div>
        <div className="bg-card rounded-lg scientific-border p-4 text-center">
          <div className="font-headline text-2xl font-bold text-warning mb-1">
            {policyStats?.underReview}
          </div>
          <div className="text-xs text-text-secondary">Under Review</div>
        </div>
        <div className="bg-card rounded-lg scientific-border p-4 text-center">
          <div className="font-headline text-2xl font-bold text-text-secondary mb-1">
            {policyStats?.draft}
          </div>
          <div className="text-xs text-text-secondary">Draft Stage</div>
        </div>
        <div className="bg-card rounded-lg scientific-border p-4 text-center">
          <div className="font-headline text-2xl font-bold text-error mb-1">
            {policyStats?.highImpact}
          </div>
          <div className="text-xs text-text-secondary">High Impact</div>
        </div>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <Button
            key={category?.id}
            variant={selectedCategory === category?.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category?.id)}
            iconName={category?.icon}
            iconPosition="left"
          >
            {category?.label}
          </Button>
        ))}
      </div>
      {/* Policy Impact Cards */}
      <div className="space-y-6">
        {filteredPolicies?.map((policy) => (
          <div key={policy?.id} className="bg-card rounded-lg scientific-border overflow-hidden">
            <div className="md:flex">
              {/* Image */}
              <div className="md:w-1/3">
                <div className="h-48 md:h-full overflow-hidden">
                  <Image
                    src={policy?.image}
                    alt={policy?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="md:w-2/3 p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="font-headline text-xl font-bold text-text-primary mb-2">
                      {policy?.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-cta-medium ${getStatusColor(policy?.status)}`}>
                        {policy?.status?.replace('-', ' ')?.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1">
                        <Icon name="TrendingUp" size={14} className={getImpactColor(policy?.impactLevel)} />
                        <span className={`text-xs font-cta-medium capitalize ${getImpactColor(policy?.impactLevel)}`}>
                          {policy?.impactLevel} Impact
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        {new Date(policy.implementationDate)?.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="font-body text-text-secondary mb-4">
                  {policy?.description}
                </p>

                {/* Research Basis */}
                <div className="mb-4">
                  <h4 className="font-cta-medium text-sm text-text-primary mb-2">
                    Research Foundation:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {policy?.researchBasis?.map((research, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {research}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Outcomes */}
                <div className="mb-4">
                  <h4 className="font-cta-medium text-sm text-text-primary mb-2">
                    Key Outcomes:
                  </h4>
                  <ul className="space-y-1">
                    {policy?.outcomes?.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Implementation Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-xs text-text-secondary mb-1">Lead Agency</div>
                    <div className="text-sm font-cta-medium text-text-primary">
                      {policy?.leadAgency}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary mb-1">NARA Contribution</div>
                    <div className="text-sm font-cta-medium text-text-primary">
                      {policy?.naraContribution}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-center">
        <h3 className="font-headline text-2xl font-bold text-white mb-4">
          Shaping Policy Through Science
        </h3>
        <p className="font-body text-white/90 mb-6 max-w-2xl mx-auto">
          NARA's research continues to inform critical policy decisions that protect Sri Lanka's marine environment and support sustainable development.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="secondary"
            iconName="FileText"
            iconPosition="left"
          >
            View Policy Reports
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary"
            iconName="Users"
            iconPosition="left"
          >
            Collaborate with Policymakers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PolicyImpactSection;