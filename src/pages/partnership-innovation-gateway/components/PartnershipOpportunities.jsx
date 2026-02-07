import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PartnershipOpportunities = () => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [formData, setFormData] = useState({
    organization: '',
    contactPerson: '',
    email: '',
    opportunityType: '',
    researchArea: '',
    message: ''
  });

  const opportunityTypes = [
    { value: 'research', label: 'Research Collaboration' },
    { value: 'funding', label: 'Funding Partnership' },
    { value: 'technology', label: 'Technology Transfer' },
    { value: 'exchange', label: 'Researcher Exchange' },
    { value: 'data', label: 'Data Sharing' },
    { value: 'capacity', label: 'Capacity Building' }
  ];

  const researchAreas = [
    { value: 'climate', label: 'Climate Change Research' },
    { value: 'biodiversity', label: 'Marine Biodiversity' },
    { value: 'pollution', label: 'Ocean Pollution' },
    { value: 'fisheries', label: 'Fisheries Science' },
    { value: 'technology', label: 'Marine Technology' },
    { value: 'conservation', label: 'Conservation Biology' },
    { value: 'oceanography', label: 'Physical Oceanography' },
    { value: 'policy', label: 'Marine Policy' }
  ];

  const opportunities = [
    {
      id: 1,
      title: "Indo-Pacific Marine Research Initiative",
      type: "Research Collaboration",
      deadline: "2024-12-15",
      funding: "$2.5M - $5M",
      duration: "3-5 years",
      icon: "Microscope",
      description: "Multi-institutional research program focusing on climate change impacts on Indo-Pacific marine ecosystems. Seeking partners with expertise in coral reef ecology, marine chemistry, and oceanographic modeling.",
      requirements: [
        "Established marine research institution",
        "Track record in climate research",
        "Access to research vessels or field stations",
        "Commitment to data sharing protocols"
      ],
      benefits: [
        "Access to shared research infrastructure",
        "Joint publication opportunities",
        "Researcher exchange programs",
        "Shared funding for equipment and travel"
      ],
      eligibility: "International research institutions, universities, and government agencies",
      applicationProcess: "Submit expression of interest by deadline, followed by full proposal if selected"
    },
    {
      id: 2,
      title: "Ocean Technology Innovation Fund",
      type: "Technology Partnership",
      deadline: "2024-11-30",
      funding: "$500K - $2M",
      duration: "2-3 years",
      icon: "Cog",
      description: "Funding program for innovative marine technologies including autonomous systems, sensor networks, and data analytics platforms. Focus on solutions that address real-world ocean monitoring and conservation challenges.",
      requirements: [
        "Proven technology development capability",
        "Prototype or proof-of-concept available",
        "Clear commercialization pathway",
        "Environmental impact assessment"
      ],
      benefits: [
        "Development funding and resources",
        "Access to NARA testing facilities",
        "Market validation support",
        "Intellectual property protection"
      ],
      eligibility: "Technology companies, startups, research institutions, and individual inventors",
      applicationProcess: "Online application with technical specifications and business plan"
    },
    {
      id: 3,
      title: "Capacity Building Fellowship Program",
      type: "Researcher Exchange",
      deadline: "2024-10-31",
      funding: "Full fellowship support",
      duration: "6-12 months",
      icon: "GraduationCap",
      description: "Fellowship program for early-career researchers from developing nations to conduct research at NARA facilities and partner institutions. Focus on building local capacity in marine science and technology.",
      requirements: [
        "PhD or equivalent in marine sciences",
        "Less than 5 years post-doctoral experience",
        "Endorsement from home institution",
        "Research proposal aligned with NARA priorities"
      ],
      benefits: [
        "Full salary and living allowance",
        "Research facility access",
        "Mentorship and training",
        "Conference and publication support"
      ],
      eligibility: "Researchers from developing nations with marine science background",
      applicationProcess: "Submit CV, research proposal, and institutional endorsement"
    },
    {
      id: 4,
      title: "Open Data Consortium",
      type: "Data Sharing",
      deadline: "Rolling basis",
      funding: "No funding required",
      duration: "Ongoing",
      icon: "Database",
      description: "Collaborative platform for sharing oceanographic data, research findings, and analytical tools. Members contribute data and gain access to consortium resources and collaborative opportunities.",
      requirements: [
        "Commitment to open data principles",
        "Quality-assured datasets",
        "Standardized data formats",
        "Regular data contributions"
      ],
      benefits: [
        "Access to comprehensive datasets",
        "Collaborative research opportunities",
        "Shared analytical tools and platforms",
        "Increased research impact and citations"
      ],
      eligibility: "Research institutions, government agencies, and NGOs with relevant data",
      applicationProcess: "Submit data sharing agreement and sample datasets"
    },
    {
      id: 5,
      title: "Marine Conservation Partnership",
      type: "Funding Partnership",
      deadline: "2024-12-31",
      funding: "$1M - $3M",
      duration: "3-4 years",
      icon: "Shield",
      description: "Partnership program focused on marine protected area management, species conservation, and ecosystem restoration. Combines scientific research with practical conservation implementation.",
      requirements: [
        "Conservation organization or research institution",
        "Experience in marine conservation",
        "Local community engagement capability",
        "Monitoring and evaluation framework"
      ],
      benefits: [
        "Conservation project funding",
        "Scientific and technical support",
        "Capacity building resources",
        "Policy advocacy support"
      ],
      eligibility: "Conservation organizations, research institutions, and government agencies",
      applicationProcess: "Submit conservation plan with budget and timeline"
    },
    {
      id: 6,
      title: "Industry-Academia Collaboration",
      type: "Technology Transfer",
      deadline: "2025-01-15",
      funding: "Varies by project",
      duration: "1-3 years",
      icon: "Building",
      description: "Program connecting NARA research with industry applications. Focus on commercializing marine technologies, developing industry-relevant solutions, and creating sustainable business models.",
      requirements: [
        "Industry partner with market presence",
        "Commitment to technology development",
        "Intellectual property agreement",
        "Sustainability and environmental standards"
      ],
      benefits: [
        "Access to cutting-edge research",
        "Technology licensing opportunities",
        "Joint development projects",
        "Market validation and support"
      ],
      eligibility: "Private companies, industry associations, and technology transfer organizations",
      applicationProcess: "Submit partnership proposal with technical and commercial details"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    console.log('Partnership inquiry submitted:', formData);
    // Handle form submission
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-6">
            <Icon name="Handshake" size={32} className="text-success" />
          </div>
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Partnership Opportunities
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
            Join NARA's global network of partners and contribute to advancing ocean science, conservation, and sustainable development through collaborative initiatives.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {opportunities?.map((opportunity) => (
            <div key={opportunity?.id} className="bg-card rounded-lg p-6 ocean-depth-shadow hover:shadow-lg transition-all duration-300">
              {/* Opportunity Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={opportunity?.icon} size={24} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
                    {opportunity?.title}
                  </h3>
                  <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-sm font-cta-medium rounded-full">
                    {opportunity?.type}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="font-body text-sm text-text-secondary mb-4 line-clamp-3">
                {opportunity?.description}
              </p>

              {/* Key Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-cta text-text-secondary">Deadline:</span>
                  <span className="font-body text-text-primary">{opportunity?.deadline}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-cta text-text-secondary">Funding:</span>
                  <span className="font-body text-text-primary">{opportunity?.funding}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-cta text-text-secondary">Duration:</span>
                  <span className="font-body text-text-primary">{opportunity?.duration}</span>
                </div>
              </div>

              {/* Requirements Preview */}
              <div className="mb-4">
                <h4 className="font-cta text-sm font-medium text-text-primary mb-2">Key Requirements:</h4>
                <ul className="space-y-1">
                  {opportunity?.requirements?.slice(0, 2)?.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="font-body text-text-secondary">{req}</span>
                    </li>
                  ))}
                  {opportunity?.requirements?.length > 2 && (
                    <li className="text-sm">
                      <span className="font-body text-text-secondary">
                        +{opportunity?.requirements?.length - 2} more requirements
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  fullWidth
                  onClick={() => setSelectedOpportunity(opportunity)}
                >
                  <Icon name="Info" size={16} className="mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Download" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Inquiry Form */}
        <div className="bg-card rounded-lg p-8 ocean-depth-shadow">
          <div className="text-center mb-8">
            <h3 className="font-headline text-2xl font-bold text-text-primary mb-4">
              Express Your Interest
            </h3>
            <p className="font-body text-text-secondary">
              Submit your partnership inquiry and our team will connect you with the most relevant opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Organization Name"
                type="text"
                name="organization"
                value={formData?.organization}
                onChange={handleInputChange}
                placeholder="Your organization"
                required
              />
              <Input
                label="Contact Person"
                type="text"
                name="contactPerson"
                value={formData?.contactPerson}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="mb-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData?.email}
                onChange={handleInputChange}
                placeholder="your.email@organization.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Select
                label="Partnership Type"
                options={opportunityTypes}
                value={formData?.opportunityType}
                onChange={(value) => handleSelectChange('opportunityType', value)}
                placeholder="Select partnership type"
                required
              />
              <Select
                label="Research Area"
                options={researchAreas}
                value={formData?.researchArea}
                onChange={(value) => handleSelectChange('researchArea', value)}
                placeholder="Select research area"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block font-cta text-sm font-medium text-text-primary mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData?.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Tell us about your organization and partnership interests..."
                required
              />
            </div>

            <div className="text-center">
              <Button type="submit" variant="default" size="lg">
                <Icon name="Send" size={20} className="mr-2" />
                Submit Inquiry
              </Button>
            </div>
          </form>
        </div>

        {/* Partnership Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={32} className="text-primary" />
            </div>
            <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
              Global Network
            </h3>
            <p className="font-body text-sm text-text-secondary">
              Connect with leading researchers and institutions worldwide through our extensive partnership network.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Zap" size={32} className="text-accent" />
            </div>
            <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
              Innovation Access
            </h3>
            <p className="font-body text-sm text-text-secondary">
              Gain access to cutting-edge technologies, research facilities, and collaborative platforms.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="TrendingUp" size={32} className="text-success" />
            </div>
            <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
              Impact Amplification
            </h3>
            <p className="font-body text-sm text-text-secondary">
              Amplify your research impact through collaborative projects and shared resources.
            </p>
          </div>
        </div>
      </div>
      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={selectedOpportunity?.icon} size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
                      {selectedOpportunity?.title}
                    </h2>
                    <div className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-sm font-cta-medium rounded-full">
                      {selectedOpportunity?.type}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedOpportunity(null)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">Description</h3>
                    <p className="font-body text-text-secondary">{selectedOpportunity?.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedOpportunity?.requirements?.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                          <span className="font-body text-text-secondary">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">Benefits</h3>
                    <ul className="space-y-2">
                      {selectedOpportunity?.benefits?.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Icon name="Star" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                          <span className="font-body text-text-secondary">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <h3 className="font-cta text-lg font-semibold text-text-primary mb-4">Key Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-cta text-sm text-text-secondary">Deadline:</span>
                        <p className="font-body text-text-primary">{selectedOpportunity?.deadline}</p>
                      </div>
                      <div>
                        <span className="font-cta text-sm text-text-secondary">Funding:</span>
                        <p className="font-body text-text-primary">{selectedOpportunity?.funding}</p>
                      </div>
                      <div>
                        <span className="font-cta text-sm text-text-secondary">Duration:</span>
                        <p className="font-body text-text-primary">{selectedOpportunity?.duration}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-cta text-sm font-medium text-text-primary mb-2">Eligibility</h4>
                    <p className="font-body text-sm text-text-secondary">{selectedOpportunity?.eligibility}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-cta text-sm font-medium text-text-primary mb-2">Application Process</h4>
                    <p className="font-body text-sm text-text-secondary">{selectedOpportunity?.applicationProcess}</p>
                  </div>

                  <div className="space-y-3">
                    <Button variant="default" fullWidth>
                      <Icon name="FileText" size={16} className="mr-2" />
                      Apply Now
                    </Button>
                    <Button variant="outline" fullWidth>
                      <Icon name="Download" size={16} className="mr-2" />
                      Download Guidelines
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PartnershipOpportunities;