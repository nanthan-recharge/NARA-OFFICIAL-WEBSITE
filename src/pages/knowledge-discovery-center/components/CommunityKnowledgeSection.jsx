import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Select from '../../../components/ui/Select';

const CommunityKnowledgeSection = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedKnowledgeType, setSelectedKnowledgeType] = useState('all');

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'northern', label: 'Northern Province' },
    { value: 'eastern', label: 'Eastern Province' },
    { value: 'southern', label: 'Southern Province' },
    { value: 'western', label: 'Western Province' },
    { value: 'northwestern', label: 'North Western Province' }
  ];

  const knowledgeTypeOptions = [
    { value: 'all', label: 'All Knowledge Types' },
    { value: 'fishing-practices', label: 'Traditional Fishing' },
    { value: 'weather-prediction', label: 'Weather Prediction' },
    { value: 'marine-conservation', label: 'Conservation Practices' },
    { value: 'seasonal-patterns', label: 'Seasonal Patterns' },
    { value: 'species-knowledge', label: 'Species Knowledge' }
  ];

  const communityKnowledge = [
    {
      id: 1,
      title: 'Traditional Moon-Phase Fishing Calendar',
      region: 'southern',
      knowledgeType: 'fishing-practices',
      community: 'Mirissa Fishing Community',
      contributor: 'Elder Sunil Perera',
      description: `Ancient fishing calendar based on lunar cycles that has guided Southern Province fishermen for over 300 years. This traditional knowledge system accurately predicts optimal fishing times and has been validated by modern marine biology research.`,
      scientificValidation: {
        validated: true,
        accuracy: '87%',
        study: 'Lunar Influence on Fish Behavior Study 2023',
        findings: 'Traditional lunar calendar shows strong correlation with fish feeding patterns and catch rates'
      },
      practicalApplications: [
        'Optimal fishing time prediction',
        'Fuel cost reduction through targeted fishing',
        'Sustainable fishing practice guidance'
      ],
      culturalSignificance: 'Passed down through 12 generations of fishing families',
      modernIntegration: 'Incorporated into NARA fishing advisory mobile app',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
      audioRecording: true,
      videoDocumentation: true
    },
    {
      id: 2,
      title: 'Seabird Migration Weather Forecasting',
      region: 'eastern',
      knowledgeType: 'weather-prediction',
      community: 'Batticaloa Coastal Villages',
      contributor: 'Fisherman Raman Selvam',
      description: `Traditional method of predicting weather patterns and monsoon timing by observing seabird migration patterns, flight heights, and feeding behaviors. This knowledge system has been used for centuries to prepare for storms and optimal fishing conditions.`,
      scientificValidation: {
        validated: true,
        accuracy: '82%',
        study: 'Avian Behavior and Weather Correlation Study 2022',
        findings: 'Seabird behavior patterns show significant correlation with atmospheric pressure changes'
      },
      practicalApplications: [
        'Storm warning system',
        'Monsoon timing prediction',
        'Safe fishing day identification'
      ],
      culturalSignificance: 'Central to Tamil fishing community traditions',
      modernIntegration: 'Data integrated into NARA weather prediction models',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop',
      audioRecording: true,
      videoDocumentation: false
    },
    {
      id: 3,
      title: 'Coral Reef Health Indicators',
      region: 'northwestern',
      knowledgeType: 'marine-conservation',
      community: 'Kalpitiya Peninsula Divers',
      contributor: 'Traditional Diver Jayantha Silva',
      description: `Indigenous knowledge system for assessing coral reef health through observation of fish species diversity, coral coloration patterns, and water clarity indicators. This traditional assessment method has guided sustainable fishing practices for generations.`,
      scientificValidation: {
        validated: true,
        accuracy: '91%',
        study: 'Traditional Ecological Knowledge Validation 2023',
        findings: 'Traditional indicators strongly correlate with scientific reef health metrics'
      },
      practicalApplications: [
        'Reef health monitoring',
        'Sustainable diving practices',
        'Marine protected area management'
      ],
      culturalSignificance: 'Sacred knowledge of traditional pearl divers',
      modernIntegration: 'Incorporated into citizen science monitoring programs',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=200&fit=crop',
      audioRecording: false,
      videoDocumentation: true
    },
    {
      id: 4,
      title: 'Mangrove Ecosystem Seasonal Calendar',
      region: 'northern',
      knowledgeType: 'seasonal-patterns',
      community: 'Jaffna Lagoon Communities',
      contributor: 'Elder Kamala Rajendran',
      description: `Comprehensive seasonal calendar documenting mangrove ecosystem changes, crab migration patterns, and optimal harvesting times for various mangrove resources. This knowledge system ensures sustainable use of mangrove ecosystems.`,
      scientificValidation: {
        validated: true,
        accuracy: '89%',
        study: 'Mangrove Ecosystem Dynamics Study 2022',
        findings: 'Traditional calendar accurately reflects mangrove phenology and species life cycles'
      },
      practicalApplications: [
        'Sustainable resource harvesting',
        'Ecosystem restoration timing',
        'Community livelihood planning'
      ],
      culturalSignificance: 'Women-led traditional knowledge system',
      modernIntegration: 'Used in mangrove restoration project planning',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop',
      audioRecording: true,
      videoDocumentation: true
    },
    {
      id: 5,
      title: 'Deep Sea Fish Species Identification',
      region: 'western',
      knowledgeType: 'species-knowledge',
      community: 'Negombo Multi-Day Boat Operators',
      contributor: 'Captain Priyantha Fernando',
      description: `Traditional knowledge system for identifying deep-sea fish species, their seasonal availability, and optimal fishing depths. This knowledge includes detailed understanding of fish behavior, habitat preferences, and sustainable catch methods.`,
      scientificValidation: {
        validated: true,
        accuracy: '94%',
        study: 'Traditional Fish Species Knowledge Assessment 2023',
        findings: 'Traditional species identification and behavior knowledge exceeds scientific databases'
      },
      practicalApplications: [
        'Species conservation planning',
        'Sustainable fishing quotas',
        'Biodiversity monitoring'
      ],
      culturalSignificance: 'Master fisherman apprenticeship tradition',
      modernIntegration: 'Contributing to marine species database updates',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop',
      audioRecording: true,
      videoDocumentation: false
    }
  ];

  const filteredKnowledge = communityKnowledge?.filter(item => {
    const regionMatch = selectedRegion === 'all' || item?.region === selectedRegion;
    const typeMatch = selectedKnowledgeType === 'all' || item?.knowledgeType === selectedKnowledgeType;
    return regionMatch && typeMatch;
  });

  const knowledgeStats = {
    totalContributions: communityKnowledge?.length,
    validatedKnowledge: communityKnowledge?.filter(k => k?.scientificValidation?.validated)?.length,
    averageAccuracy: Math.round(
      communityKnowledge?.reduce((sum, k) => sum + parseInt(k?.scientificValidation?.accuracy), 0) / 
      communityKnowledge?.length
    ),
    activeContributors: new Set(communityKnowledge.map(k => k.contributor))?.size
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
          Community Knowledge Integration
        </h2>
        <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
          Honoring Sri Lanka's maritime heritage by integrating traditional coastal wisdom with modern marine science
        </p>
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-lg scientific-border p-4 text-center">
          <div className="font-headline text-2xl font-bold text-primary mb-1">
            {knowledgeStats?.totalContributions}
          </div>
          <div className="text-xs text-text-secondary">Knowledge Systems</div>
        </div>
        <div className="bg-card rounded-lg scientific-border p-4 text-center">
          <div className="font-headline text-2xl font-bold text-success mb-1">
            {knowledgeStats?.validatedKnowledge}
          </div>
          <div className="text-xs text-text-secondary">Scientifically Validated</div>
        </div>
        <div className="bg-card rounded-lg scientific-border p-4 text-center">
          <div className="font-headline text-2xl font-bold text-accent mb-1">
            {knowledgeStats?.averageAccuracy}%
          </div>
          <div className="text-xs text-text-secondary">Average Accuracy</div>
        </div>
        <div className="bg-card rounded-lg scientific-border p-4 text-center">
          <div className="font-headline text-2xl font-bold text-secondary mb-1">
            {knowledgeStats?.activeContributors}
          </div>
          <div className="text-xs text-text-secondary">Community Contributors</div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select
          label="Filter by Region"
          options={regionOptions}
          value={selectedRegion}
          onChange={setSelectedRegion}
          className="flex-1"
        />
        <Select
          label="Filter by Knowledge Type"
          options={knowledgeTypeOptions}
          value={selectedKnowledgeType}
          onChange={setSelectedKnowledgeType}
          className="flex-1"
        />
      </div>
      {/* Knowledge Cards */}
      <div className="space-y-6">
        {filteredKnowledge?.map((knowledge) => (
          <div key={knowledge?.id} className="bg-card rounded-lg scientific-border overflow-hidden">
            <div className="md:flex">
              {/* Image */}
              <div className="md:w-1/3">
                <div className="h-48 md:h-full overflow-hidden relative">
                  <Image
                    src={knowledge?.image}
                    alt={knowledge?.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Media Indicators */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {knowledge?.audioRecording && (
                      <div className="bg-black/70 text-white p-1 rounded">
                        <Icon name="Mic" size={14} />
                      </div>
                    )}
                    {knowledge?.videoDocumentation && (
                      <div className="bg-black/70 text-white p-1 rounded">
                        <Icon name="Video" size={14} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="md:w-2/3 p-6">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {knowledge?.knowledgeType?.replace('-', ' ')?.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                      {knowledge?.region?.replace('-', ' ')?.toUpperCase()} PROVINCE
                    </span>
                    {knowledge?.scientificValidation?.validated && (
                      <div className="flex items-center gap-1">
                        <Icon name="CheckCircle" size={14} className="text-success" />
                        <span className="text-xs text-success font-cta-medium">
                          {knowledge?.scientificValidation?.accuracy} Validated
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-headline text-xl font-bold text-text-primary mb-2">
                    {knowledge?.title}
                  </h3>
                  
                  <div className="text-sm text-text-secondary mb-2">
                    <strong>Community:</strong> {knowledge?.community} • <strong>Contributor:</strong> {knowledge?.contributor}
                  </div>
                </div>

                {/* Description */}
                <p className="font-body text-text-secondary mb-4">
                  {knowledge?.description}
                </p>

                {/* Scientific Validation */}
                {knowledge?.scientificValidation?.validated && (
                  <div className="bg-success/10 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Award" size={16} className="text-success" />
                      <span className="font-cta-medium text-sm text-success">Scientific Validation</span>
                    </div>
                    <p className="text-sm text-success/80 mb-2">
                      <strong>Study:</strong> {knowledge?.scientificValidation?.study}
                    </p>
                    <p className="text-sm text-success/80">
                      <strong>Findings:</strong> {knowledge?.scientificValidation?.findings}
                    </p>
                  </div>
                )}

                {/* Practical Applications */}
                <div className="mb-4">
                  <h4 className="font-cta-medium text-sm text-text-primary mb-2">
                    Practical Applications:
                  </h4>
                  <ul className="space-y-1">
                    {knowledge?.practicalApplications?.map((application, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Icon name="ArrowRight" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        {application}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cultural & Modern Integration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-xs text-text-secondary mb-1">Cultural Significance</div>
                    <div className="text-sm font-cta-medium text-text-primary">
                      {knowledge?.culturalSignificance}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary mb-1">Modern Integration</div>
                    <div className="text-sm font-cta-medium text-text-primary">
                      {knowledge?.modernIntegration}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Community Contribution Call to Action */}
      <div className="bg-gradient-to-r from-coral-warm to-accent rounded-lg p-8 text-center">
        <h3 className="font-headline text-2xl font-bold text-white mb-4">
          Share Your Maritime Knowledge
        </h3>
        <p className="font-body text-white/90 mb-6 max-w-2xl mx-auto">
          Help preserve and validate traditional maritime wisdom by sharing your community's knowledge with NARA researchers.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="secondary"
            iconName="Plus"
            iconPosition="left"
          >
            Contribute Knowledge
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-coral-warm"
            iconName="Users"
            iconPosition="left"
          >
            Join Community Network
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityKnowledgeSection;