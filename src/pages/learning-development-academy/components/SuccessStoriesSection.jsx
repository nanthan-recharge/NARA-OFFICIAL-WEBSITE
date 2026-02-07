import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const SuccessStoriesSection = () => {
  const [activeStory, setActiveStory] = useState(0);

  const successStories = [
    {
      id: 1,
      name: "Dr. Kavitha Rajapakse",
      role: "Marine Biologist",
      company: "University of Colombo",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      story: `Started as a curious student in our Ocean Explorers program at age 10. Through NARA's mentorship and scholarship programs, I completed my PhD in Marine Biology and now lead coral restoration projects across the Indian Ocean. The foundation I built here shaped my entire career path.`,
      achievement: "Published 25+ research papers on coral restoration",
      program: "Ocean Explorers → University Excellence",
      year: "2015-2023",
      impact: "Restored 50+ hectares of coral reefs",
      quote: "NARA didn\'t just teach me marine science; it taught me to think like an ocean steward."
    },
    {
      id: 2,
      name: "Captain Sunil Wickramasinghe",
      role: "Maritime Safety Officer",
      company: "Sri Lanka Ports Authority",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      story: `After 20 years at sea, I thought I knew everything about the ocean. NARA's Professional Development courses opened my eyes to modern forecasting techniques and safety protocols. Now I train the next generation of maritime professionals with cutting-edge knowledge.`,
      achievement: "Reduced maritime accidents by 40% in assigned ports",
      program: "Professional Development",
      year: "2020-2022",
      impact: "Trained 500+ maritime professionals",
      quote: "Learning never stops when you work with the ocean. NARA keeps us ahead of the waves."
    },
    {
      id: 3,
      name: "Priya Mendis",
      role: "Aquaculture Entrepreneur",
      company: "Blue Harvest Aquaculture",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      story: `From a small fishing family, I never imagined running a sustainable aquaculture business. NARA's certification programs gave me the technical knowledge and business skills to start Blue Harvest. We now supply premium fish to hotels across Colombo while maintaining zero environmental impact.`,
      achievement: "Built Sri Lanka\'s first carbon-neutral fish farm",
      program: "Professional Development",
      year: "2019-2021",
      impact: "Created 50+ local jobs",
      quote: "NARA showed me how traditional fishing wisdom and modern science can create something beautiful."
    },
    {
      id: 4,
      name: "Ashan Perera",
      role: "Data Scientist",
      company: "NARA Ocean Intelligence Division",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      story: `Started coding as a hobby while studying marine science. NARA's Ocean Data Analysis course bridged my interests perfectly. Now I develop AI models that predict ocean conditions, helping thousands of fishermen make safer, more profitable decisions every day.`,
      achievement: "Developed award-winning ocean prediction algorithms",
      program: "University Excellence",
      year: "2018-2022",
      impact: "Improved fishing success rates by 35%",
      quote: "At NARA, I learned that data and ocean science together can change lives."
    },
    {
      id: 5,
      name: "Chamari Fernando",
      role: "Marine Education Coordinator",
      company: "Ministry of Education",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      story: `As a teacher, I wanted to bring ocean science to rural schools. NARA's educator training programs equipped me with interactive teaching methods and digital resources. Now I coordinate marine education for 200+ schools across three provinces.`,
      achievement: "Reached 15,000+ students with ocean education",
      program: "Professional Development",
      year: "2017-2020",
      impact: "Established 50+ school marine clubs",
      quote: "Every child deserves to understand the ocean that surrounds our island home."
    }
  ];

  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % successStories?.length);
  };

  const prevStory = () => {
    setActiveStory((prev) => (prev - 1 + successStories?.length) % successStories?.length);
  };

  const currentStory = successStories?.[activeStory];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Success Stories
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
            Meet the inspiring individuals who transformed their careers and communities through NARA's educational programs.
          </p>
        </div>

        {/* Main Story Display */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl border border-border p-8 lg:p-12 ocean-depth-shadow">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Profile Section */}
              <div className="text-center lg:text-left">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 mx-auto lg:mx-0 rounded-full overflow-hidden border-4 border-primary/20">
                    <Image
                      src={currentStory?.image}
                      alt={currentStory?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle" size={20} color="white" />
                  </div>
                </div>

                <h3 className="font-headline text-xl font-bold text-text-primary mb-2">
                  {currentStory?.name}
                </h3>
                <p className="font-cta text-sm text-primary mb-1">
                  {currentStory?.role}
                </p>
                <p className="font-body text-sm text-text-secondary mb-4">
                  {currentStory?.company}
                </p>

                {/* Achievement Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center lg:justify-start space-x-2">
                    <Icon name="Calendar" size={16} className="text-text-secondary" />
                    <span className="font-body text-sm text-text-secondary">{currentStory?.year}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-2">
                    <Icon name="BookOpen" size={16} className="text-text-secondary" />
                    <span className="font-body text-sm text-text-secondary">{currentStory?.program}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-2">
                    <Icon name="TrendingUp" size={16} className="text-text-secondary" />
                    <span className="font-body text-sm text-text-secondary">{currentStory?.impact}</span>
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <Icon name="Quote" size={32} className="text-primary/30 mb-4" />
                  <blockquote className="font-body text-lg text-text-primary leading-relaxed mb-4">
                    "{currentStory?.quote}"
                  </blockquote>
                </div>

                <p className="font-body text-text-secondary leading-relaxed mb-6">
                  {currentStory?.story}
                </p>

                {/* Achievement Highlight */}
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Award" size={16} color="white" />
                    </div>
                    <div>
                      <h4 className="font-cta-medium text-sm text-text-primary mb-1">
                        Key Achievement
                      </h4>
                      <p className="font-body text-sm text-text-secondary">
                        {currentStory?.achievement}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {successStories?.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveStory(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-ocean ${
                          index === activeStory ? 'bg-primary w-6' : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStory}
                      iconName="ChevronLeft"
                    >
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextStory}
                      iconName="ChevronRight"
                    >
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={28} color="white" />
            </div>
            <div className="font-headline text-2xl font-bold text-text-primary mb-1">5,000+</div>
            <div className="font-body text-sm text-text-secondary">Alumni Network</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="Briefcase" size={28} color="white" />
            </div>
            <div className="font-headline text-2xl font-bold text-text-primary mb-1">85%</div>
            <div className="font-body text-sm text-text-secondary">Career Advancement</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="Award" size={28} color="white" />
            </div>
            <div className="font-headline text-2xl font-bold text-text-primary mb-1">1,200+</div>
            <div className="font-body text-sm text-text-secondary">Certifications Earned</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="Globe" size={28} color="white" />
            </div>
            <div className="font-headline text-2xl font-bold text-text-primary mb-1">25+</div>
            <div className="font-body text-sm text-text-secondary">Countries Reached</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button
            variant="default"
            size="lg"
            className="bg-coral-warm hover:bg-coral-warm/90"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Start Your Success Story
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;