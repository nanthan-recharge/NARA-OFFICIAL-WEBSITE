import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CommunitySection = () => {
  const [activeTab, setActiveTab] = useState('forums');

  const forumCategories = [
    {
      id: 1,
      title: "Marine Biology Discussions",
      description: "Share discoveries, ask questions, and collaborate on marine life research",
      members: 3420,
      posts: 12500,
      icon: "Fish",
      color: "from-blue-400 to-cyan-400",
      recentTopics: [
        { title: "New coral species discovered in Trincomalee", replies: 45, time: "2 hours ago" },
        { title: "Microplastic impact on fish populations", replies: 28, time: "5 hours ago" },
        { title: "Best practices for underwater photography", replies: 67, time: "1 day ago" }
      ]
    },
    {
      id: 2,
      title: "Oceanography & Climate",
      description: "Discuss ocean currents, climate patterns, and environmental changes",
      members: 2850,
      posts: 8900,
      icon: "Waves",
      color: "from-emerald-400 to-teal-400",
      recentTopics: [
        { title: "Monsoon patterns affecting Sri Lankan waters", replies: 32, time: "1 hour ago" },
        { title: "Sea level rise monitoring techniques", replies: 19, time: "4 hours ago" },
        { title: "Ocean temperature data analysis methods", replies: 41, time: "6 hours ago" }
      ]
    },
    {
      id: 3,
      title: "Maritime Industry",
      description: "Professional discussions on shipping, fishing, and maritime operations",
      members: 1950,
      posts: 6200,
      icon: "Ship",
      color: "from-orange-400 to-red-400",
      recentTopics: [
        { title: "New safety regulations for fishing vessels", replies: 23, time: "3 hours ago" },
        { title: "Sustainable fishing practices workshop", replies: 15, time: "8 hours ago" },
        { title: "Port automation technologies", replies: 38, time: "12 hours ago" }
      ]
    },
    {
      id: 4,
      title: "Student Hub",
      description: "Study groups, project collaborations, and academic support",
      members: 4200,
      posts: 15600,
      icon: "GraduationCap",
      color: "from-purple-400 to-indigo-400",
      recentTopics: [
        { title: "Marine biology assignment help needed", replies: 12, time: "30 minutes ago" },
        { title: "Study group for oceanography exam", replies: 8, time: "2 hours ago" },
        { title: "Research project partner wanted", replies: 25, time: "4 hours ago" }
      ]
    }
  ];

  const mentors = [
    {
      id: 1,
      name: "Dr. Samantha Perera",
      title: "Senior Marine Biologist",
      specialization: "Coral Reef Ecology",
      experience: "15+ years",
      students: 45,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      availability: "Available",
      nextSession: "Tomorrow 2:00 PM"
    },
    {
      id: 2,
      name: "Prof. Rajesh Kumar",
      title: "Oceanography Professor",
      specialization: "Ocean Data Analysis",
      experience: "20+ years",
      students: 38,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      availability: "Busy",
      nextSession: "Friday 10:00 AM"
    },
    {
      id: 3,
      name: "Dr. Priya Jayawardena",
      title: "Conservation Scientist",
      specialization: "Marine Protected Areas",
      experience: "12+ years",
      students: 52,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      availability: "Available",
      nextSession: "Today 4:00 PM"
    },
    {
      id: 4,
      name: "Capt. Sunil Wickramasinghe",
      title: "Maritime Operations Expert",
      specialization: "Maritime Safety & Navigation",
      experience: "25+ years",
      students: 29,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      availability: "Available",
      nextSession: "Monday 9:00 AM"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Virtual Marine Biology Conference",
      date: "2024-01-25",
      time: "9:00 AM - 5:00 PM",
      type: "Conference",
      attendees: 450,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop",
      description: "Annual conference featuring latest research in marine biology and conservation"
    },
    {
      id: 2,
      title: "Ocean Data Visualization Workshop",
      date: "2024-01-28",
      time: "2:00 PM - 6:00 PM",
      type: "Workshop",
      attendees: 85,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      description: "Hands-on workshop on creating compelling visualizations from oceanographic data"
    },
    {
      id: 3,
      title: "Student Research Presentation Day",
      date: "2024-02-02",
      time: "10:00 AM - 4:00 PM",
      type: "Presentation",
      attendees: 120,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=300&h=200&fit=crop",
      description: "Students present their research projects to peers and faculty members"
    }
  ];

  const tabs = [
    { id: 'forums', label: 'Discussion Forums', icon: 'MessageSquare' },
    { id: 'mentorship', label: 'Mentorship', icon: 'Users' },
    { id: 'events', label: 'Events', icon: 'Calendar' }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Learning Community
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
            Connect with fellow learners, expert mentors, and industry professionals in our vibrant ocean science community.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-12">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-cta-medium text-sm transition-all duration-ocean ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-text-secondary hover:bg-primary/10 hover:text-primary border border-border'
              }`}
            >
              <Icon name={tab?.icon} size={18} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Forums Tab */}
        {activeTab === 'forums' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {forumCategories?.map((category) => (
              <div key={category?.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-ocean-depth transition-all duration-ocean">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category?.color} rounded-lg flex items-center justify-center`}>
                      <Icon name={category?.icon} size={24} color="white" />
                    </div>
                    <div>
                      <h3 className="font-headline text-lg font-bold text-text-primary">
                        {category?.title}
                      </h3>
                      <p className="font-body text-sm text-text-secondary">
                        {category?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mb-6 text-sm text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={16} />
                    <span>{category?.members?.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MessageSquare" size={16} />
                    <span>{category?.posts?.toLocaleString()} posts</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-cta-medium text-sm text-text-primary">Recent Topics</h4>
                  {category?.recentTopics?.map((topic, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-body text-sm text-text-primary mb-1 line-clamp-1">
                          {topic?.title}
                        </h5>
                        <div className="flex items-center space-x-3 text-xs text-text-secondary">
                          <span className="flex items-center space-x-1">
                            <Icon name="MessageCircle" size={12} />
                            <span>{topic?.replies} replies</span>
                          </span>
                          <span>{topic?.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Join Discussion
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Mentorship Tab */}
        {activeTab === 'mentorship' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-text-primary mb-4">
                Connect with Expert Mentors
              </h3>
              <p className="font-body text-text-secondary max-w-2xl mx-auto">
                Get personalized guidance from leading professionals in marine science, oceanography, and maritime industries.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors?.map((mentor) => (
                <div key={mentor?.id} className="bg-card rounded-xl border border-border p-6 text-center hover:shadow-ocean-depth transition-all duration-ocean">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-primary/20">
                      <Image
                        src={mentor?.image}
                        alt={mentor?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                      mentor?.availability === 'Available' ? 'bg-success' : 'bg-warning'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <h3 className="font-headline text-lg font-bold text-text-primary mb-1">
                    {mentor?.name}
                  </h3>
                  <p className="font-cta text-sm text-primary mb-2">
                    {mentor?.title}
                  </p>
                  <p className="font-body text-xs text-text-secondary mb-3">
                    {mentor?.specialization}
                  </p>

                  <div className="space-y-2 mb-4 text-xs text-text-secondary">
                    <div className="flex items-center justify-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{mentor?.experience}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Icon name="Users" size={12} />
                      <span>{mentor?.students} students</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Icon name="Star" size={12} className="text-yellow-500" />
                      <span>{mentor?.rating} rating</span>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="font-body text-xs text-text-secondary mb-1">Next Available:</p>
                    <p className="font-cta-medium text-xs text-text-primary">{mentor?.nextSession}</p>
                  </div>

                  <Button
                    variant={mentor?.availability === 'Available' ? 'default' : 'outline'}
                    size="sm"
                    fullWidth
                    iconName="Calendar"
                    iconPosition="left"
                    disabled={mentor?.availability !== 'Available'}
                  >
                    {mentor?.availability === 'Available' ? 'Book Session' : 'Join Waitlist'}
                  </Button>
                </div>
              ))}
            </div>

            {/* Mentorship Benefits */}
            <div className="bg-card rounded-xl border border-border p-8">
              <h3 className="font-headline text-xl font-bold text-text-primary text-center mb-8">
                Mentorship Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name="Target" size={28} color="white" />
                  </div>
                  <h4 className="font-cta-medium text-sm text-text-primary mb-2">Personalized Guidance</h4>
                  <p className="font-body text-xs text-text-secondary">One-on-one sessions tailored to your learning goals and career aspirations.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name="Network" size={28} color="white" />
                  </div>
                  <h4 className="font-cta-medium text-sm text-text-primary mb-2">Industry Connections</h4>
                  <p className="font-body text-xs text-text-secondary">Access to professional networks and career opportunities in marine science.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name="TrendingUp" size={28} color="white" />
                  </div>
                  <h4 className="font-cta-medium text-sm text-text-primary mb-2">Skill Development</h4>
                  <p className="font-body text-xs text-text-secondary">Accelerated learning through expert feedback and practical insights.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-text-primary mb-4">
                Upcoming Community Events
              </h3>
              <p className="font-body text-text-secondary max-w-2xl mx-auto">
                Join workshops, conferences, and networking events to expand your knowledge and connect with the community.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {events?.map((event) => (
                <div key={event?.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-ocean-depth transition-all duration-ocean">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event?.image}
                      alt={event?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground text-xs font-cta-medium px-3 py-1 rounded-full">
                        {event?.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-headline text-lg font-bold text-text-primary mb-3">
                      {event?.title}
                    </h3>

                    <p className="font-body text-sm text-text-secondary mb-4 leading-relaxed">
                      {event?.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm text-text-secondary">
                      <div className="flex items-center space-x-2">
                        <Icon name="Calendar" size={16} />
                        <span>{new Date(event.date)?.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={16} />
                        <span>{event?.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Users" size={16} />
                        <span>{event?.attendees} registered</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        iconName="Calendar"
                        iconPosition="left"
                      >
                        Register
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Share"
                      >
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Event Calendar CTA */}
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                iconName="Calendar"
                iconPosition="left"
              >
                View Full Event Calendar
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunitySection;