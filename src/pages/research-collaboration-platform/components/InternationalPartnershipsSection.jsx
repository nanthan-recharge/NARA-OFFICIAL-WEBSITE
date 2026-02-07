import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

import { useAuth } from '../../../contexts/AuthContext';

const InternationalPartnershipsSection = ({ networks = [], collaborations = [], loading = false, user }) => {
  const [activeTab, setActiveTab] = useState('networks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [partnershipAgreements, setPartnershipAgreements] = useState([]);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadPartnershipAgreements();
  }, []);

  const loadPartnershipAgreements = () => {
    // Mock partnership agreements - would load from database
    const mockAgreements = [
      {
        id: 1,
        title: "Indo-Pacific Marine Research Consortium",
        partner_institutions: [
          "University of Queensland (Australia)",
          "National University of Singapore",
          "University of Tokyo (Japan)",
          "NARA (Sri Lanka)"
        ],
        agreement_type: "research_consortium",
        status: "active",
        signed_date: "2023-06-15",
        expiry_date: "2026-06-14",
        description: "Multi-institutional collaboration for marine biodiversity research across the Indo-Pacific region.",
        key_activities: [
          "Joint research expeditions",
          "Student exchange programs", 
          "Shared laboratory facilities",
          "Collaborative publications"
        ],
        funding_amount: 2500000,
        lead_institution: "University of Queensland",
        contact_person: "Prof. Sarah Johnson",
        next_milestone: "Annual consortium meeting - December 2024"
      },
      {
        id: 2,
        title: "EU-Asia Ocean Science Partnership",
        partner_institutions: [
          "Plymouth Marine Laboratory (UK)",
          "GEOMAR (Germany)",
          "Institute of Oceanology CAS (China)",
          "NARA (Sri Lanka)"
        ],
        agreement_type: "bilateral_mou",
        status: "active",
        signed_date: "2024-02-20",
        expiry_date: "2027-02-19",
        description: "European Union and Asian institutions collaborating on ocean science and climate research.",
        key_activities: [
          "Climate impact studies",
          "Technology transfer",
          "Joint grant applications",
          "Policy recommendations"
        ],
        funding_amount: 1800000,
        lead_institution: "Plymouth Marine Laboratory",
        contact_person: "Dr. Maria Gonzalez",
        next_milestone: "Mid-term review - March 2025"
      },
      {
        id: 3,
        title: "Pacific Small Island Developing States Network",
        partner_institutions: [
          "University of the South Pacific (Fiji)",
          "Palau International Coral Reef Center",
          "Cook Islands Marine Research Centre",
          "NARA (Sri Lanka)"
        ],
        agreement_type: "regional_network",
        status: "pending",
        signed_date: null,
        expiry_date: "2028-12-31",
        description: "Regional network focusing on climate adaptation and marine conservation for small island developing states.",
        key_activities: [
          "Climate adaptation strategies",
          "Marine protected area management",
          "Capacity building programs",
          "Data sharing protocols"
        ],
        funding_amount: 950000,
        lead_institution: "University of the South Pacific",
        contact_person: "Dr. Tavita Malolo",
        next_milestone: "Agreement finalization - January 2025"
      }
    ];
    setPartnershipAgreements(mockAgreements);
  };

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'asia-pacific', label: 'Asia-Pacific' },
    { value: 'europe', label: 'Europe' },
    { value: 'north-america', label: 'North America' },
    { value: 'africa', label: 'Africa' },
    { value: 'south-america', label: 'South America' },
    { value: 'middle-east', label: 'Middle East' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'research_consortium', label: 'Research Consortium' },
    { value: 'bilateral_mou', label: 'Bilateral MOU' },
    { value: 'regional_network', label: 'Regional Network' },
    { value: 'exchange_program', label: 'Exchange Program' },
    { value: 'joint_project', label: 'Joint Project' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'expired': return 'text-destructive bg-destructive/10';
      case 'draft': return 'text-text-secondary bg-muted';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'research_consortium': return 'text-primary bg-primary/10';
      case 'bilateral_mou': return 'text-accent bg-accent/10';
      case 'regional_network': return 'text-success bg-success/10';
      case 'exchange_program': return 'text-coral-warm bg-coral-warm/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const NetworkCard = ({ network }) => (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-cta text-lg font-semibold text-text-primary">
              {network?.name || 'Research Network'}
            </h3>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              NETWORK
            </span>
          </div>
          <p className="font-body text-sm text-text-secondary mb-3 line-clamp-2">
            {network?.description || 'International research network fostering collaboration in marine science and ocean conservation.'}
          </p>
        </div>
        <div className="text-right">
          <div className="font-headline text-xl font-bold text-text-primary">
            {Math.floor(Math.random() * 50) + 10}
          </div>
          <div className="text-xs text-text-secondary">Institutions</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <div className="text-text-secondary mb-1">Founded</div>
          <div className="font-medium text-text-primary">
            {network?.created_at ? new Date(network?.created_at)?.getFullYear() : '2019'}
          </div>
        </div>
        <div>
          <div className="text-text-secondary mb-1">Region</div>
          <div className="font-medium text-text-primary">Global</div>
        </div>
        <div>
          <div className="text-text-secondary mb-1">Focus Areas</div>
          <div className="font-medium text-text-primary">Marine Biology</div>
        </div>
        <div>
          <div className="text-text-secondary mb-1">Activity Level</div>
          <div className="font-medium text-success">High</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>{Math.floor(Math.random() * 200) + 50} researchers</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Globe" size={14} />
            <span>{Math.floor(Math.random() * 20) + 5} countries</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            onClick={() => setSelectedNetwork(network)}
          >
            View Details
          </Button>
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              iconName="UserPlus"
              onClick={() => {
                setSelectedNetwork(network);
                setShowJoinModal(true);
              }}
            >
              Join Network
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const CollaborationCard = ({ collaboration }) => (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-cta text-lg font-semibold text-text-primary">
              {collaboration?.title || 'International Collaboration'}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(collaboration?.status)}`}>
              {collaboration?.status?.toUpperCase() || 'OPEN'}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="User" size={14} />
              <span>{collaboration?.contact_person?.full_name || 'Contact Person'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>
                Deadline: {collaboration?.deadline ? new Date(collaboration?.deadline)?.toLocaleDateString() : 'TBD'}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-headline text-lg font-bold text-primary">
            {Math.floor(Math.random() * 10) + 2}
          </div>
          <div className="text-xs text-text-secondary">Partners</div>
        </div>
      </div>
      
      <p className="font-body text-sm text-text-secondary mb-4 line-clamp-3">
        {collaboration?.description || 'International collaboration opportunity for marine research and conservation initiatives.'}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={14} />
            <span>{collaboration?.location || 'Multiple Locations'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{collaboration?.duration || '12 months'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="Eye">
            View Details
          </Button>
          {isAuthenticated && (
            <Button variant="outline" size="sm" iconName="Send">
              Apply
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const PartnershipAgreementCard = ({ agreement }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-cta text-lg font-semibold text-text-primary">
              {agreement?.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(agreement?.agreement_type)}`}>
              {agreement?.agreement_type?.replace('_', ' ')?.toUpperCase()}
            </span>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agreement?.status)}`}>
              {agreement?.status?.toUpperCase()}
            </span>
          </div>
          <p className="font-body text-sm text-text-secondary mb-3">
            {agreement?.description}
          </p>
        </div>
        <div className="text-right">
          <div className="font-headline text-lg font-bold text-success">
            ${(agreement?.funding_amount / 1000000)?.toFixed(1)}M
          </div>
          <div className="text-xs text-text-secondary">Total Funding</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="font-cta text-sm font-medium text-text-secondary mb-2">Partner Institutions</div>
        <div className="flex flex-wrap gap-2">
          {agreement?.partner_institutions?.slice(0, 3)?.map((institution, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 bg-muted text-text-secondary text-xs rounded-md">
              {institution}
            </span>
          ))}
          {agreement?.partner_institutions?.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-muted text-text-secondary text-xs rounded-md">
              +{agreement?.partner_institutions?.length - 3} more
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <div className="text-text-secondary mb-1">Lead Institution</div>
          <div className="font-medium text-text-primary">{agreement?.lead_institution}</div>
        </div>
        <div>
          <div className="text-text-secondary mb-1">Contact Person</div>
          <div className="font-medium text-text-primary">{agreement?.contact_person}</div>
        </div>
        <div>
          <div className="text-text-secondary mb-1">Agreement Period</div>
          <div className="font-medium text-text-primary">
            {agreement?.signed_date ? new Date(agreement?.signed_date)?.toLocaleDateString() : 'Pending'} - {' '}
            {new Date(agreement?.expiry_date)?.toLocaleDateString()}
          </div>
        </div>
        <div>
          <div className="text-text-secondary mb-1">Next Milestone</div>
          <div className="font-medium text-text-primary">{agreement?.next_milestone}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="font-cta text-sm font-medium text-text-secondary mb-2">Key Activities</div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {agreement?.key_activities?.slice(0, 4)?.map((activity, index) => (
            <li key={index} className="text-sm text-text-secondary flex items-start space-x-2">
              <Icon name="Check" size={12} className="text-success mt-1 flex-shrink-0" />
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-text-secondary">
          {agreement?.status === 'active' 
            ? `Active until ${new Date(agreement?.expiry_date)?.toLocaleDateString()}`
            : agreement?.status === 'pending' ?'Pending finalization' :'Agreement status unknown'
          }
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="FileText">
            View Agreement
          </Button>
          <Button variant="outline" size="sm" iconName="MessageCircle">
            Contact
          </Button>
        </div>
      </div>
    </div>
  );

  const NetworkDetailModal = ({ network, onClose }) => {
    if (!network) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
                  {network?.name}
                </h2>
                <p className="font-body text-text-secondary">
                  {network?.description}
                </p>
              </div>
              <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-4">Network Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-secondary">Member Institutions</span>
                    <span className="font-medium">{Math.floor(Math.random() * 50) + 10}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-secondary">Active Researchers</span>
                    <span className="font-medium">{Math.floor(Math.random() * 200) + 50}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-secondary">Countries</span>
                    <span className="font-medium">{Math.floor(Math.random() * 20) + 5}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-secondary">Established</span>
                    <span className="font-medium">
                      {network?.created_at ? new Date(network?.created_at)?.getFullYear() : '2019'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-text-primary text-sm mb-1">
                      Joint Research Publication
                    </div>
                    <div className="text-xs text-text-secondary">
                      Published in Marine Biology Journal - 3 days ago
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-text-primary text-sm mb-1">
                      Virtual Workshop Series
                    </div>
                    <div className="text-xs text-text-secondary">
                      Ocean Conservation Strategies - 1 week ago
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-text-primary text-sm mb-1">
                      New Members Joined
                    </div>
                    <div className="text-xs text-text-secondary">
                      3 institutions from Pacific region - 2 weeks ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pt-6 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Button variant="default" iconName="UserPlus" iconPosition="left" className="flex-1">
                    Request to Join Network
                  </Button>
                  <Button variant="outline" iconName="MessageCircle" iconPosition="left">
                    Contact Network
                  </Button>
                </>
              ) : (
                <div className="text-center w-full py-4">
                  <p className="text-text-secondary mb-4">Sign in to join research networks and access collaboration opportunities</p>
                  <Button variant="outline">Sign In to Join</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const JoinNetworkModal = ({ network, onClose }) => {
    const [formData, setFormData] = useState({
      motivation: '',
      expertise_areas: '',
      contribution_plans: '',
      institution_support: false
    });

    const handleSubmit = async (e) => {
      e?.preventDefault();
      if (!isAuthenticated || !user?.id) return;

      // Mock join request - would implement actual logic
      alert('Network membership request submitted successfully!');
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-headline text-xl font-bold text-text-primary">
                  Join Research Network
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {network?.name}
                </p>
              </div>
              <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Motivation for Joining
                </label>
                <textarea
                  value={formData?.motivation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivation: e?.target?.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Explain why you want to join this network and how it aligns with your research goals..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Your Expertise Areas
                </label>
                <textarea
                  value={formData?.expertise_areas}
                  onChange={(e) => setFormData(prev => ({ ...prev, expertise_areas: e?.target?.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Describe your research expertise and specializations relevant to this network..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Contribution Plans
                </label>
                <textarea
                  value={formData?.contribution_plans}
                  onChange={(e) => setFormData(prev => ({ ...prev, contribution_plans: e?.target?.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="How do you plan to contribute to the network's activities and goals..."
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="institution_support"
                  checked={formData?.institution_support}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution_support: e?.target?.checked }))}
                  className="rounded border-border"
                />
                <label htmlFor="institution_support" className="text-sm text-text-secondary">
                  I have institutional support for network participation
                </label>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm text-text-secondary">
                    <div className="font-medium text-text-primary mb-1">Application Process:</div>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Your application will be reviewed by network administrators</li>
                      <li>You may be invited for a brief interview or presentation</li>
                      <li>Successful applicants will receive welcome materials and access</li>
                      <li>Full membership activation typically takes 2-3 weeks</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="default" className="flex-1">
                  Submit Application
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'collaborations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary">
                  Collaboration Opportunities
                </h3>
                <p className="text-sm text-text-secondary">
                  Current international research collaboration opportunities
                </p>
              </div>
            </div>
            
            {collaborations?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {collaborations?.map((collaboration) => (
                  <CollaborationCard key={collaboration?.id} collaboration={collaboration} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Globe" size={24} className="text-text-secondary" />
                </div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
                  No active collaborations
                </h3>
                <p className="font-body text-text-secondary">
                  Check back soon for new international collaboration opportunities
                </p>
              </div>
            )}
          </div>
        );
      
      case 'agreements':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary">
                  Partnership Agreements
                </h3>
                <p className="text-sm text-text-secondary">
                  Formal partnership agreements and MOUs with international institutions
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {partnershipAgreements?.map((agreement) => (
                <PartnershipAgreementCard key={agreement?.id} agreement={agreement} />
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary">
                  Research Networks
                </h3>
                <p className="text-sm text-text-secondary">
                  Global research networks and consortiums for marine science collaboration
                </p>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="search"
                  placeholder="Search networks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                />
                <Select
                  options={regionOptions}
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  placeholder="Filter by region"
                />
                <Select
                  options={typeOptions}
                  value={selectedType}
                  onChange={setSelectedType}
                  placeholder="Filter by type"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4]?.map((item) => (
                  <div key={item} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : networks?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {networks?.filter(network => {
                  const matchesSearch = !searchQuery || 
                    network?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                    network?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
                  return matchesSearch;
                })?.map((network) => (
                  <NetworkCard key={network?.id} network={network} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Network" size={24} className="text-text-secondary" />
                </div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
                  No networks found
                </h3>
                <p className="font-body text-text-secondary">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
          International Partnerships
        </h2>
        <p className="font-body text-text-secondary">
          Global research networks, collaboration opportunities, and partnership agreements
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('networks')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'networks' ?'bg-card text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          Research Networks ({networks?.length || 6})
        </button>
        <button
          onClick={() => setActiveTab('collaborations')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'collaborations' ?'bg-card text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          Collaboration Opportunities ({collaborations?.length || 4})
        </button>
        <button
          onClick={() => setActiveTab('agreements')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'agreements' ?'bg-card text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          Partnership Agreements ({partnershipAgreements?.length || 3})
        </button>
      </div>

      {/* Content */}
      {renderTabContent()}

      {/* Modals */}
      <NetworkDetailModal network={selectedNetwork} onClose={() => setSelectedNetwork(null)} />
      {showJoinModal && selectedNetwork && (
        <JoinNetworkModal 
          network={selectedNetwork} 
          onClose={() => {
            setShowJoinModal(false);
            setSelectedNetwork(null);
          }} 
        />
      )}
    </div>
  );
};

export default InternationalPartnershipsSection;