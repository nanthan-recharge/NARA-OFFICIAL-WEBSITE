import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NewsTicker = () => {
  const [currentNews, setCurrentNews] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Recent news and achievements
  const newsItems = [
    {
      id: 1,
      type: "research",
      title: "NARA Scientists Discover New Deep-Sea Species in Sri Lankan Waters",
      summary: "Marine biologists identify three new species of bioluminescent fish at depths exceeding 2,000 meters off the southern coast.",
      date: "2025-01-15",
      category: "Marine Biology",
      impact: "Published in Nature Marine Science",
      icon: "Fish",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: 2,
      type: "achievement",
      title: "NARA Receives UNESCO Category 2 Centre Designation",
      summary: "International recognition for excellence in ocean science education and capacity building in the Indian Ocean region.",
      date: "2025-01-12",
      category: "International Recognition",
      impact: "Regional training hub established",
      icon: "Award",
      color: "text-coral-warm",
      bgColor: "bg-coral-warm/10"
    },
    {
      id: 3,
      type: "technology",
      title: "AI-Powered Tsunami Warning System Achieves 99.8% Accuracy",
      summary: "Advanced machine learning algorithms reduce false alarms while maintaining rapid response times for coastal communities.",
      date: "2025-01-10",
      category: "Emergency Response",
      impact: "Protecting 2.1 million coastal residents",
      icon: "AlertTriangle",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      id: 4,
      type: "collaboration",
      title: "Joint Research Agreement Signed with NOAA and NASA JPL",
      summary: "Collaborative satellite monitoring program to track ocean temperature changes and marine ecosystem health.",
      date: "2025-01-08",
      category: "International Partnership",
      impact: "5-year $2.3M research program",
      icon: "Satellite",
      color: "text-ocean-medium",
      bgColor: "bg-ocean-medium/10"
    },
    {
      id: 5,
      type: "publication",
      title: "Comprehensive Study on Microplastic Pollution Released",
      summary: "First-ever nationwide assessment reveals distribution patterns and proposes innovative cleanup strategies.",
      date: "2025-01-05",
      category: "Environmental Research",
      impact: "Informing national policy changes",
      icon: "Droplets",
      color: "text-ocean-deep",
      bgColor: "bg-ocean-deep/10"
    },
    {
      id: 6,
      type: "community",
      title: "Fishing Community App Downloads Exceed 50,000",
      summary: "Mobile application providing real-time fishing advisories reaches milestone adoption among Sri Lankan fishermen.",
      date: "2025-01-03",
      category: "Community Impact",
      impact: "40% improvement in catch efficiency",
      icon: "Smartphone",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  // Recent publications
  const recentPublications = [
    {
      title: "Climate Change Impacts on Sri Lankan Coral Reefs: A 20-Year Analysis",
      journal: "Marine Ecology Progress Series",
      authors: "Perera, K.M., Silva, R.N., et al.",
      date: "2025-01-14",
      citations: 23
    },
    {
      title: "Sustainable Aquaculture Practices in Tropical Waters",
      journal: "Aquaculture International",
      authors: "Fernando, S.P., Jayawardena, L.K., et al.",
      date: "2025-01-11",
      citations: 15
    },
    {
      title: "Machine Learning Applications in Tsunami Early Warning Systems",
      journal: "Natural Hazards Review",
      authors: "Wickramasinghe, A.B., Gunaratne, M.D., et al.",
      date: "2025-01-09",
      citations: 31
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % newsItems?.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, newsItems?.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNewsSelect = (index) => {
    setCurrentNews(index);
    setIsPlaying(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-ocean-deep/10 px-4 py-2 rounded-full mb-6">
            <Icon name="Newspaper" size={16} className="text-ocean-deep" />
            <span className="text-sm font-cta text-ocean-deep uppercase tracking-wide">
              Latest Updates
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-headline font-bold text-text-primary mb-6">
            Recent Achievements &
            <span className="block text-ocean-medium">Research Breakthroughs</span>
          </h2>
          <p className="text-xl text-text-secondary font-body max-w-3xl mx-auto leading-relaxed">
            Stay updated with NARA's latest scientific discoveries, international collaborations, and community impact initiatives.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main News Display */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl overflow-hidden ocean-depth-shadow">
              {/* News Header */}
              <div className="bg-gradient-to-r from-ocean-deep to-ocean-medium p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon name="Radio" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-cta-medium">NARA News Center</h3>
                      <p className="text-sm text-white/80">Live updates from ocean science</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePlayPause}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-ocean"
                    >
                      <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="text-white" />
                    </button>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-coral-warm rounded-full animate-pulse"></div>
                      <span className="text-xs text-white/80">LIVE</span>
                    </div>
                  </div>
                </div>

                {/* News Navigation */}
                <div className="flex items-center space-x-2">
                  {newsItems?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleNewsSelect(index)}
                      className={`h-1 rounded-full transition-all duration-ocean ${
                        currentNews === index ? 'bg-coral-warm w-8' : 'bg-white/30 w-4'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Active News Content */}
              <div className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-12 h-12 ${newsItems?.[currentNews]?.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon name={newsItems?.[currentNews]?.icon} size={24} className={newsItems?.[currentNews]?.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-cta uppercase tracking-wide ${newsItems?.[currentNews]?.bgColor} ${newsItems?.[currentNews]?.color}`}>
                        {newsItems?.[currentNews]?.category}
                      </span>
                      <span className="text-sm text-text-secondary font-mono">
                        {formatDate(newsItems?.[currentNews]?.date)}
                      </span>
                    </div>
                    <h4 className="text-xl font-headline font-bold text-text-primary mb-3">
                      {newsItems?.[currentNews]?.title}
                    </h4>
                    <p className="text-text-secondary font-body leading-relaxed mb-4">
                      {newsItems?.[currentNews]?.summary}
                    </p>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-cta-medium text-text-primary mb-1">
                        Impact & Recognition
                      </div>
                      <div className="text-sm text-text-secondary">
                        {newsItems?.[currentNews]?.impact}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="default"
                    className="bg-ocean-deep hover:bg-ocean-deep/90 text-white font-cta-medium"
                    iconName="ExternalLink"
                    iconPosition="right"
                  >
                    Read Full Story
                  </Button>
                  <Button
                    variant="outline"
                    className="border-ocean-medium text-ocean-medium hover:bg-ocean-medium hover:text-white font-cta-medium"
                    iconName="Share2"
                    iconPosition="left"
                  >
                    Share News
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-8">
            {/* Recent Publications */}
            <div className="bg-card rounded-2xl p-6 ocean-depth-shadow">
              <div className="flex items-center space-x-2 mb-6">
                <Icon name="BookOpen" size={20} className="text-accent" />
                <h3 className="text-lg font-cta-medium text-text-primary">Recent Publications</h3>
              </div>

              <div className="space-y-4">
                {recentPublications?.map((publication, index) => (
                  <div key={index} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                    <h4 className="text-sm font-cta-medium text-text-primary mb-2 leading-tight">
                      {publication?.title}
                    </h4>
                    <div className="space-y-1 text-xs text-text-secondary">
                      <div className="font-cta-medium text-accent">{publication?.journal}</div>
                      <div>{publication?.authors}</div>
                      <div className="flex items-center justify-between">
                        <span>{formatDate(publication?.date)}</span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Quote" size={12} />
                          <span>{publication?.citations} citations</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/research-excellence-portal" className="block mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  className="border-accent text-accent hover:bg-accent hover:text-white font-cta-medium"
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  View All Publications
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-ocean-deep to-ocean-medium rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-2 mb-6">
                <Icon name="TrendingUp" size={20} className="text-coral-warm" />
                <h3 className="text-lg font-cta-medium">This Month's Impact</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">New Research Papers</span>
                  <span className="text-xl font-headline font-bold text-coral-warm">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">International Citations</span>
                  <span className="text-xl font-headline font-bold text-coral-warm">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Community Alerts Sent</span>
                  <span className="text-xl font-headline font-bold text-coral-warm">2,340</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">New Partnerships</span>
                  <span className="text-xl font-headline font-bold text-coral-warm">3</span>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-card rounded-2xl p-6 ocean-depth-shadow">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Mail" size={20} className="text-ocean-medium" />
                <h3 className="text-lg font-cta-medium text-text-primary">Stay Updated</h3>
              </div>
              <p className="text-sm text-text-secondary font-body mb-4">
                Get weekly updates on research breakthroughs, community impact, and ocean intelligence.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-medium focus:border-transparent"
                />
                <Button
                  variant="default"
                  fullWidth
                  className="bg-ocean-medium hover:bg-ocean-medium/90 text-white font-cta-medium"
                  iconName="Send"
                  iconPosition="right"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsTicker;