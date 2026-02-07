import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Header from '../../components/ui/Header';
import ResearchDivisionCard from './components/ResearchDivisionCard';
import FeaturedResearchProject from './components/FeaturedResearchProject';
import PublicationCard from './components/PublicationCard';
import CollaborationOpportunity from './components/CollaborationOpportunity';
import ResearchTimeline from './components/ResearchTimeline';
import ResearchImpactMetrics from './components/ResearchImpactMetrics';
import FellowshipOpportunities from './components/FellowshipOpportunities';
import ResearcherProfileCard from './components/ResearcherProfileCard';
import SignInModal from './components/SignInModal';
import SignUpModal from './components/SignUpModal';
import { useAuth } from '../../contexts/AuthContext';
import researchService from '../../services/researchService';

const ResearchExcellencePortal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedPublicationType, setSelectedPublicationType] = useState('all');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Data state
  const [researchDivisions, setResearchDivisions] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [recentPublications, setRecentPublications] = useState([]);
  const [collaborationOpportunities, setCollaborationOpportunities] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState({});
  const [researchers, setResearchers] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    divisions: true,
    projects: true,
    publications: true,
    collaborations: true,
    metrics: true,
    researchers: true
  });
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Load research divisions
    try {
      const { data: divisionsData, error: divisionsError } = await researchService?.divisions?.getAll();
      if (!divisionsError && divisionsData) {
        setResearchDivisions(divisionsData);
      }
    } catch (error) {
      console.error('Error loading divisions:', error);
    } finally {
      setLoading(prev => ({ ...prev, divisions: false }));
    }

    // Load featured projects
    try {
      const { data: projectsData, error: projectsError } = await researchService?.projects?.getPublic();
      if (!projectsError && projectsData) {
        setFeaturedProjects(projectsData);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }

    // Load recent publications
    try {
      const { data: publicationsData, error: publicationsError } = await researchService?.publications?.getPublished();
      if (!publicationsError && publicationsData) {
        setRecentPublications(publicationsData);
      }
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setLoading(prev => ({ ...prev, publications: false }));
    }

    // Load collaboration opportunities
    try {
      const { data: collaborationsData, error: collaborationsError } = await researchService?.collaboration?.getOpen();
      if (!collaborationsError && collaborationsData) {
        setCollaborationOpportunities(collaborationsData);
      }
    } catch (error) {
      console.error('Error loading collaborations:', error);
    } finally {
      setLoading(prev => ({ ...prev, collaborations: false }));
    }

    // Load impact metrics
    try {
      const { data: metricsData, error: metricsError } = await researchService?.metrics?.getOverallMetrics();
      if (!metricsError && metricsData) {
        setImpactMetrics(metricsData);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(prev => ({ ...prev, metrics: false }));
    }

    // Load researchers
    try {
      const { data: researchersData, error: researchersError } = await researchService?.profiles?.search('', {});
      if (!researchersError && researchersData) {
        setResearchers(researchersData?.slice(0, 6)); // Show first 6 researchers
      }
    } catch (error) {
      console.error('Error loading researchers:', error);
    } finally {
      setLoading(prev => ({ ...prev, researchers: false }));
    }
  };

  const divisionOptions = [
    { value: 'all', label: 'All Divisions' },
    ...researchDivisions?.map(div => ({ value: div?.id?.toString(), label: div?.name }))
  ];

  const publicationTypeOptions = [
    { value: 'all', label: 'All Publications' },
    { value: 'journal', label: 'Journal Articles' },
    { value: 'conference', label: 'Conference Papers' },
    { value: 'book', label: 'Books & Chapters' },
    { value: 'report', label: 'Technical Reports' }
  ];

  const filteredDivisions = researchDivisions?.filter(division =>
    selectedDivision === 'all' || division?.id?.toString() === selectedDivision
  );

  const filteredPublications = recentPublications?.filter(publication =>
    (searchQuery === '' || publication?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
     publication?.keywords?.some(keyword => keyword?.toLowerCase()?.includes(searchQuery?.toLowerCase())))
  );

  // Mock data for research timeline (can be replaced with real data later)
  const timelineData = [
    {
      date: "2024-09-01",
      title: "Marine Biodiversity Assessment Published",
      description: "Comprehensive assessment of marine biodiversity in Sri Lankan waters published in Nature Ecology & Evolution, revealing 23 new species discoveries.",
      type: "publication",
      division: "Marine Biology",
      metrics: { citations: 15, funding: null, participants: null },
      tags: ["Biodiversity", "New Species", "Conservation"]
    },
    {
      date: "2024-08-15",
      title: "International Ocean Science Conference",
      description: "NARA researchers presented 12 papers at the International Ocean Science Conference in Singapore, showcasing cutting-edge research in marine technology.",
      type: "conference",
      division: "Marine Technology",
      metrics: { citations: null, funding: null, participants: 45 },
      tags: ["Conference", "International", "Technology"]
    },
    {
      date: "2024-07-20",
      title: "Coral Restoration Project Milestone",
      description: "Successfully restored 2.5 hectares of coral reef in Hikkaduwa Marine National Park, achieving 85% coral survival rate using innovative techniques.",
      type: "project",
      division: "Marine Biology",
      metrics: { citations: null, funding: 500000, participants: 15 },
      tags: ["Coral Restoration", "Conservation", "Success"]
    }
  ];

  // Mock data for fellowship opportunities (can be replaced with real data later)
  const fellowshipOpportunities = [
    {
      id: 1,
      title: "NARA Marine Biology PhD Fellowship",
      level: "PhD",
      deadline: "2024-12-31",
      duration: "4 years",
      stipend: 2500,
      applicationsCount: 45,
      description: "Full PhD fellowship in marine biology with focus on coral reef ecology, fish biology, or marine conservation. Includes research funding, equipment access, and international collaboration opportunities.",
      researchArea: "Marine Biology",
      supervisor: "Dr. Samantha Perera",
      location: "Colombo, Sri Lanka",
      positions: 3,
      requirements: ["Master\'s in Marine Biology", "Research Experience", "English Proficiency", "GRE Scores"]
    },
    {
      id: 2,
      title: "International Postdoctoral Research Fellowship",
      level: "Postdoc",
      deadline: "2024-11-15",
      duration: "2 years",
      stipend: 3500,
      applicationsCount: 28,
      description: "Postdoctoral research position in oceanography or marine chemistry with opportunities for international collaboration and advanced research training.",
      researchArea: "Oceanography",
      supervisor: "Prof. Ravi Jayawardena",
      location: "Colombo, Sri Lanka",
      positions: 2,
      requirements: ["PhD in Oceanography", "Publication Record", "Research Proposal", "References"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop"
            alt="Ocean Research"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/90 via-ocean-deep/70 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-coral-warm rounded-lg flex items-center justify-center">
                <Icon name="Microscope" size={32} color="white" />
              </div>
              <div>
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-white mb-2">
                  Research Excellence Portal
                </h1>
                <p className="font-body text-xl text-white/90">
                  World-Class Marine Science & Innovation Hub
                </p>
              </div>
            </div>
            
            <p className="font-body text-lg text-white/80 mb-8 leading-relaxed">
              Discover NARA's cutting-edge research across nine specialized divisions, explore collaboration opportunities with international partners, and access decades of marine science knowledge that shapes Sri Lanka's ocean future.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-coral-warm hover:bg-coral-warm/90 text-white"
                    iconName="Search"
                    iconPosition="left"
                  >
                    Explore Research
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-ocean-deep"
                    iconName="Users"
                    iconPosition="left"
                  >
                    My Collaborations
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-coral-warm hover:bg-coral-warm/90 text-white"
                    iconName="LogIn"
                    iconPosition="left"
                    onClick={() => setShowSignInModal(true)}
                  >
                    Sign In to Collaborate
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-ocean-deep"
                    iconName="UserPlus"
                    iconPosition="left"
                    onClick={() => setShowSignUpModal(true)}
                  >
                    Join Research Network
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Researcher Profiles Section - New */}
      {!loading?.researchers && researchers?.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
                Meet Our Research Community
              </h2>
              <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
                Connect with leading marine scientists, researchers, and collaborators from around the world who are advancing ocean science and conservation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchers?.slice(0, 6)?.map((researcher) => (
                <ResearcherProfileCard key={researcher?.id} researcher={researcher} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                iconName="Users"
                iconPosition="left"
              >
                Browse All Researchers
              </Button>
            </div>
          </div>
        </section>
      )}
      {/* Research Impact Metrics */}
      {!loading?.metrics && Object.keys(impactMetrics)?.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
                Research Impact & Excellence
              </h2>
              <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
                Measuring our contribution to global marine science through publications, citations, collaborations, and real-world impact on ocean conservation and sustainable development.
              </p>
            </div>
            
            <ResearchImpactMetrics metrics={impactMetrics} />
          </div>
        </section>
      )}
      {/* Research Divisions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
              Nine Specialized Research Divisions
            </h2>
            <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
              Each division represents a center of excellence in marine science, bringing together world-class researchers, cutting-edge technology, and innovative approaches to ocean research.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="lg:w-1/3">
              <Input
                type="search"
                placeholder="Search research divisions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="mb-4"
              />
            </div>
            <div className="lg:w-1/3">
              <Select
                options={divisionOptions}
                value={selectedDivision}
                onChange={setSelectedDivision}
                placeholder="Filter by division"
              />
            </div>
          </div>
          
          {loading?.divisions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6]?.map((item) => (
                <div key={item} className="bg-card rounded-lg ocean-depth-shadow p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDivisions?.map((division) => (
                <ResearchDivisionCard key={division?.id} division={division} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Featured Research Projects */}
      {!loading?.projects && featuredProjects?.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
                Featured Research Projects
              </h2>
              <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
                Groundbreaking research initiatives that address critical challenges in marine conservation, sustainable development, and ocean science innovation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredProjects?.slice(0, 3)?.map((project) => (
                <FeaturedResearchProject key={project?.id} project={project} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                iconName="Grid3x3"
                iconPosition="left"
              >
                View All Research Projects
              </Button>
            </div>
          </div>
        </section>
      )}
      {/* Recent Publications */}
      {!loading?.publications && recentPublications?.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
                Recent Publications
              </h2>
              <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
                Latest peer-reviewed research publications from NARA scientists, contributing to global understanding of marine ecosystems and ocean processes.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="lg:w-1/2">
                <Input
                  type="search"
                  placeholder="Search publications by title or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                />
              </div>
              <div className="lg:w-1/2">
                <Select
                  options={publicationTypeOptions}
                  value={selectedPublicationType}
                  onChange={setSelectedPublicationType}
                  placeholder="Filter by publication type"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPublications?.slice(0, 4)?.map((publication) => (
                <PublicationCard key={publication?.id} publication={publication} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                iconName="BookOpen"
                iconPosition="left"
              >
                Browse Publication Database
              </Button>
            </div>
          </div>
        </section>
      )}
      {/* Research Timeline */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
              Research Timeline
            </h2>
            <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
              Track our research milestones, achievements, and breakthrough discoveries that advance marine science and ocean conservation.
            </p>
          </div>
          
          <ResearchTimeline timelineData={timelineData} />
        </div>
      </section>
      {/* Collaboration Opportunities */}
      {!loading?.collaborations && collaborationOpportunities?.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
                International Collaboration Opportunities
              </h2>
              <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
                Join forces with NARA researchers and international partners to tackle global ocean challenges through collaborative research initiatives.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {collaborationOpportunities?.slice(0, 2)?.map((opportunity) => (
                <CollaborationOpportunity key={opportunity?.id} opportunity={opportunity} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button
                variant="default"
                size="lg"
                className="bg-accent hover:bg-accent/90"
                iconName="Globe"
                iconPosition="left"
                onClick={() => !isAuthenticated && setShowSignInModal(true)}
              >
                {isAuthenticated ? 'Explore All Collaborations' : 'Sign In to Collaborate'}
              </Button>
            </div>
          </div>
        </section>
      )}
      {/* Fellowship Opportunities */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-text-primary mb-4">
              Fellowship & Career Opportunities
            </h2>
            <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
              Launch or advance your marine science career through our comprehensive fellowship programs and research opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FellowshipOpportunities fellowships={fellowshipOpportunities} />
            
            <div className="bg-card rounded-lg ocean-depth-shadow p-6">
              <h3 className="font-headline text-xl font-bold text-text-primary mb-6">Career Pathways</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="GraduationCap" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-cta text-base font-semibold text-text-primary mb-2">
                      Graduate Programs
                    </h4>
                    <p className="font-body text-sm text-text-secondary mb-3">
                      PhD and Master's programs in marine sciences with full funding, research support, and international exposure opportunities.
                    </p>
                    <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
                      Learn More
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Users" size={24} className="text-success" />
                  </div>
                  <div>
                    <h4 className="font-cta text-base font-semibold text-text-primary mb-2">
                      Research Positions
                    </h4>
                    <p className="font-body text-sm text-text-secondary mb-3">
                      Full-time research scientist positions across all divisions with competitive salaries and comprehensive benefits.
                    </p>
                    <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
                      View Openings
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Globe" size={24} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-cta text-base font-semibold text-text-primary mb-2">
                      International Exchange
                    </h4>
                    <p className="font-body text-sm text-text-secondary mb-3">
                      Researcher exchange programs with partner institutions worldwide for collaborative research and skill development.
                    </p>
                    <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-headline text-3xl font-bold text-white mb-4">
            Ready to Advance Marine Science?
          </h2>
          <p className="font-body text-lg text-white/90 mb-8 max-w-3xl mx-auto">
            Join NARA's research community and contribute to groundbreaking discoveries that protect our oceans and support sustainable development for future generations.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {isAuthenticated ? (
              <>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-coral-warm hover:bg-coral-warm/90 text-white"
                  iconName="Send"
                  iconPosition="left"
                >
                  Submit Research Proposal
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-ocean-deep"
                  iconName="Calendar"
                  iconPosition="left"
                >
                  Schedule Consultation
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-coral-warm hover:bg-coral-warm/90 text-white"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={() => setShowSignUpModal(true)}
                >
                  Join Research Network
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-ocean-deep"
                  iconName="LogIn"
                  iconPosition="left"
                  onClick={() => setShowSignInModal(true)}
                >
                  Sign In to Collaborate
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
              iconName="Download"
              iconPosition="left"
            >
              Download Research Guide
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-text-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-coral-warm rounded-lg flex items-center justify-center">
                  <Icon name="Waves" size={24} color="white" />
                </div>
                <div>
                  <div className="font-headline text-lg font-bold">NARA Digital Ocean</div>
                  <div className="font-body text-sm opacity-80">Research Excellence Portal</div>
                </div>
              </div>
              <p className="font-body text-sm opacity-80 mb-4">
                Advancing marine science through world-class research, international collaboration, and innovative solutions for ocean conservation.
              </p>
            </div>
            
            <div>
              <h3 className="font-cta text-base font-semibold mb-4">Research Areas</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="#" className="hover:text-coral-warm transition-colors">Marine Biology</Link></li>
                <li><Link to="#" className="hover:text-coral-warm transition-colors">Oceanography</Link></li>
                <li><Link to="#" className="hover:text-coral-warm transition-colors">Coastal Engineering</Link></li>
                <li><Link to="#" className="hover:text-coral-warm transition-colors">Fisheries Science</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-cta text-base font-semibold mb-4">Collaboration</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="#" className="hover:text-coral-warm transition-colors">Partnership Opportunities</Link></li>
                <li><Link to="#" className="hover:text-coral-warm transition-colors">Fellowship Programs</Link></li>
                <li><Link to="#" className="hover:text-coral-warm transition-colors">International Network</Link></li>
                <li><Link to="#" className="hover:text-coral-warm transition-colors">Research Proposals</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-cta text-base font-semibold mb-4">Connect</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm opacity-80">
                  <Icon name="Mail" size={16} />
                  <span>research@nara.gov.lk</span>
                </div>
                <div className="flex items-center space-x-2 text-sm opacity-80">
                  <Icon name="Phone" size={16} />
                  <span>+94 11 2 694 138</span>
                </div>
                <div className="flex items-center space-x-2 text-sm opacity-80">
                  <Icon name="MapPin" size={16} />
                  <span>Crow Island, Colombo 15</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="font-body text-sm opacity-80">
              © {new Date()?.getFullYear()} National Aquatic Resources Research and Development Agency. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* Authentication Modals */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSwitchToSignUp={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
      />
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToSignIn={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
      />
    </div>
  );
};

export default ResearchExcellencePortal;