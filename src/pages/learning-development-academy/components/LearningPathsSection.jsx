import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LearningPathsSection = () => {
  const [activeTab, setActiveTab] = useState('explorers');

  const learningPaths = {
    explorers: {
      title: "Ocean Explorers",
      subtitle: "Ages 6-12",
      description: "Interactive adventures that spark curiosity about marine life and ocean science through games, virtual tours, and simple experiments.",
      color: "from-blue-400 to-cyan-400",
      icon: "Fish",
      features: [
        {
          icon: "Gamepad2",
          title: "Interactive Games",
          description: "Learn about marine ecosystems through engaging educational games and puzzles."
        },
        {
          icon: "Camera",
          title: "Virtual Reef Tours",
          description: "Explore Sri Lankan coral reefs with 360° underwater virtual reality experiences."
        },
        {
          icon: "FlaskConical",
          title: "Home Experiments",
          description: "Safe, simple ocean science experiments using household materials."
        },
        {
          icon: "Trophy",
          title: "Achievement Badges",
          description: "Earn digital badges for completing learning milestones and challenges."
        }
      ],
      courses: [
        { title: "Marine Life Discovery", duration: "2 weeks", level: "Beginner", students: 1250 },
        { title: "Ocean Conservation Heroes", duration: "3 weeks", level: "Beginner", students: 980 },
        { title: "Underwater Photography", duration: "1 week", level: "Beginner", students: 750 }
      ]
    },
    students: {
      title: "Student Scholars",
      subtitle: "Ages 13-18",
      description: "Curriculum-aligned resources, virtual field trips, and career exploration tools for secondary school students passionate about marine science.",
      color: "from-emerald-400 to-teal-400",
      icon: "BookOpen",
      features: [
        {
          icon: "MapPin",
          title: "Virtual Field Trips",
          description: "Visit NARA research stations and marine laboratories from your classroom."
        },
        {
          icon: "TrendingUp",
          title: "Career Pathways",
          description: "Explore marine science careers with interactive tools and mentor connections."
        },
        {
          icon: "FileText",
          title: "Curriculum Support",
          description: "Resources aligned with national science curriculum standards."
        },
        {
          icon: "Users",
          title: "Peer Collaboration",
          description: "Connect with students nationwide through collaborative research projects."
        }
      ],
      courses: [
        { title: "Marine Biology Fundamentals", duration: "8 weeks", level: "Intermediate", students: 2100 },
        { title: "Oceanography Principles", duration: "10 weeks", level: "Intermediate", students: 1800 },
        { title: "Climate Change & Oceans", duration: "6 weeks", level: "Intermediate", students: 1650 }
      ]
    },
    professionals: {
      title: "Professional Development",
      subtitle: "Maritime Industry",
      description: "Certification courses, training programs, and continuing education for maritime workers, aquaculture operators, and industry professionals.",
      color: "from-orange-400 to-red-400",
      icon: "Briefcase",
      features: [
        {
          icon: "Award",
          title: "Industry Certifications",
          description: "Earn recognized certifications for maritime safety and operations."
        },
        {
          icon: "Fish",
          title: "Aquaculture Training",
          description: "Comprehensive programs for sustainable fish farming and marine agriculture."
        },
        {
          icon: "Clock",
          title: "Flexible Scheduling",
          description: "Self-paced learning designed for working professionals."
        },
        {
          icon: "Network",
          title: "Industry Network",
          description: "Connect with maritime professionals and industry leaders."
        }
      ],
      courses: [
        { title: "Maritime Safety Certification", duration: "4 weeks", level: "Professional", students: 850 },
        { title: "Sustainable Aquaculture", duration: "6 weeks", level: "Professional", students: 620 },
        { title: "Ocean Data Analysis", duration: "8 weeks", level: "Advanced", students: 450 }
      ]
    },
    university: {
      title: "University Excellence",
      subtitle: "Higher Education",
      description: "Advanced research methodology, data analysis workshops, and thesis supervision for university students and early-career researchers.",
      color: "from-purple-400 to-indigo-400",
      icon: "GraduationCap",
      features: [
        {
          icon: "Microscope",
          title: "Research Methods",
          description: "Advanced oceanographic research methodologies and best practices."
        },
        {
          icon: "BarChart3",
          title: "Data Analysis",
          description: "Statistical analysis and modeling techniques for marine data."
        },
        {
          icon: "UserCheck",
          title: "Thesis Supervision",
          description: "Direct mentorship from NARA researchers for thesis projects."
        },
        {
          icon: "Globe",
          title: "International Exchange",
          description: "Opportunities for collaboration with global research institutions."
        }
      ],
      courses: [
        { title: "Advanced Oceanography", duration: "12 weeks", level: "Advanced", students: 320 },
        { title: "Marine Data Science", duration: "10 weeks", level: "Advanced", students: 280 },
        { title: "Research Methodology", duration: "8 weeks", level: "Advanced", students: 190 }
      ]
    }
  };

  const tabs = [
    { id: 'explorers', label: 'Ocean Explorers', icon: 'Fish' },
    { id: 'students', label: 'Student Scholars', icon: 'BookOpen' },
    { id: 'professionals', label: 'Professionals', icon: 'Briefcase' },
    { id: 'university', label: 'University', icon: 'GraduationCap' }
  ];

  const currentPath = learningPaths?.[activeTab];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Choose Your Learning Path
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
            Discover tailored educational experiences designed for every stage of your ocean science journey, from childhood curiosity to professional expertise.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-cta-medium text-sm transition-all duration-ocean ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-text-secondary hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Icon name={tab?.icon} size={18} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Active Path Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Path Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${currentPath?.color} rounded-lg flex items-center justify-center`}>
                  <Icon name={currentPath?.icon} size={28} color="white" />
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold text-text-primary">
                    {currentPath?.title}
                  </h3>
                  <p className="font-cta text-sm text-text-secondary">
                    {currentPath?.subtitle}
                  </p>
                </div>
              </div>
              <p className="font-body text-text-secondary leading-relaxed">
                {currentPath?.description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {currentPath?.features?.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-card rounded-lg border border-border">
                  <div className={`w-8 h-8 bg-gradient-to-r ${currentPath?.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon name={feature?.icon} size={16} color="white" />
                  </div>
                  <div>
                    <h4 className="font-cta-medium text-sm text-text-primary mb-1">
                      {feature?.title}
                    </h4>
                    <p className="font-body text-xs text-text-secondary">
                      {feature?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90"
                iconName="Play"
                iconPosition="left"
              >
                Start This Path
              </Button>
              <Button
                variant="outline"
                iconName="Calendar"
                iconPosition="left"
              >
                View Schedule
              </Button>
            </div>
          </div>

          {/* Right Column - Popular Courses */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-headline text-xl font-bold text-text-primary mb-6">
              Popular Courses
            </h4>
            <div className="space-y-4">
              {currentPath?.courses?.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-cta-medium text-sm text-text-primary mb-1">
                      {course?.title}
                    </h5>
                    <div className="flex items-center space-x-4 text-xs text-text-secondary">
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{course?.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="BarChart3" size={12} />
                        <span>{course?.level}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Users" size={12} />
                        <span>{course?.students?.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ArrowRight"
                    className="ml-4"
                  >
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <Button
                variant="outline"
                fullWidth
                iconName="BookOpen"
                iconPosition="left"
              >
                View All Courses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningPathsSection;