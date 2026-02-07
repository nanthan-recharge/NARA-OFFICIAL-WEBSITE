import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const pathways = [
    {
      icon: "Fish",
      title: "Ocean Explorers",
      description: "Start your marine adventure",
      action: "Begin Journey",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: "BookOpen",
      title: "Student Scholars",
      description: "Advance your academic path",
      action: "Explore Courses",
      color: "from-emerald-400 to-teal-400"
    },
    {
      icon: "Briefcase",
      title: "Professional Development",
      description: "Enhance your career",
      action: "Get Certified",
      color: "from-orange-400 to-red-400"
    },
    {
      icon: "GraduationCap",
      title: "University Excellence",
      description: "Pursue advanced research",
      action: "Join Program",
      color: "from-purple-400 to-indigo-400"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-ocean-deep via-ocean-medium to-primary">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 bg-coral-warm rounded-full flex items-center justify-center mx-auto animate-ocean-pulse">
              <Icon name="Waves" size={32} color="white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>

          <h2 className="font-headline text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Your Ocean Science Journey
            <span className="block text-coral-warm">Starts Today</span>
          </h2>

          <p className="font-body text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners who have transformed their understanding of the ocean through NARA's comprehensive educational programs. From curious beginners to advanced researchers, we have the perfect path for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="default"
              size="lg"
              className="bg-coral-warm hover:bg-coral-warm/90 text-white font-cta-medium px-8"
              iconName="Play"
              iconPosition="left"
            >
              Start Learning Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-ocean-deep font-cta-medium px-8"
              iconName="Calendar"
              iconPosition="left"
            >
              Schedule Consultation
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span>15,000+ Active Learners</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} />
              <span>95% Completion Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Star" size={16} />
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Globe" size={16} />
              <span>25+ Countries</span>
            </div>
          </div>
        </div>

        {/* Learning Pathways */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pathways?.map((pathway, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-ocean interactive-lift">
              <div className={`w-16 h-16 bg-gradient-to-r ${pathway?.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <Icon name={pathway?.icon} size={28} color="white" />
              </div>
              <h3 className="font-headline text-lg font-bold text-white mb-2">
                {pathway?.title}
              </h3>
              <p className="font-body text-sm text-white/80 mb-4">
                {pathway?.description}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-coral-warm hover:bg-coral-warm/20 hover:text-coral-warm font-cta-medium"
                iconName="ArrowRight"
                iconPosition="right"
              >
                {pathway?.action}
              </Button>
            </div>
          ))}
        </div>

        {/* Special Offers */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-coral-warm rounded-lg flex items-center justify-center">
                  <Icon name="Gift" size={24} color="white" />
                </div>
                <span className="bg-coral-warm text-white text-sm font-cta-medium px-3 py-1 rounded-full">
                  Limited Time Offer
                </span>
              </div>

              <h3 className="font-headline text-2xl lg:text-3xl font-bold text-white mb-4">
                Free Access to Premium Courses
              </h3>

              <p className="font-body text-white/90 mb-6 leading-relaxed">
                New learners get 30 days of free access to our premium course library, including advanced oceanography, marine data analysis, and professional certification programs. Start your journey with full access to expert-led content.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-3 text-white/90">
                  <Icon name="Check" size={16} className="text-coral-warm" />
                  <span className="font-body text-sm">Access to 200+ premium courses</span>
                </li>
                <li className="flex items-center space-x-3 text-white/90">
                  <Icon name="Check" size={16} className="text-coral-warm" />
                  <span className="font-body text-sm">Expert mentorship sessions</span>
                </li>
                <li className="flex items-center space-x-3 text-white/90">
                  <Icon name="Check" size={16} className="text-coral-warm" />
                  <span className="font-body text-sm">Certification upon completion</span>
                </li>
                <li className="flex items-center space-x-3 text-white/90">
                  <Icon name="Check" size={16} className="text-coral-warm" />
                  <span className="font-body text-sm">Community forum access</span>
                </li>
              </ul>

              <Button
                variant="default"
                size="lg"
                className="bg-coral-warm hover:bg-coral-warm/90 text-white font-cta-medium"
                iconName="Gift"
                iconPosition="left"
              >
                Claim Free Access
              </Button>
            </div>

            <div className="relative">
              {/* Floating Elements */}
              <div className="relative">
                <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center animate-data-flow">
                  <Icon name="BookOpen" size={24} color="rgba(255,255,255,0.8)" />
                </div>
                <div className="absolute top-16 right-8 w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center animate-data-flow delay-1000">
                  <Icon name="Award" size={20} color="rgba(255,255,255,0.8)" />
                </div>
                <div className="absolute bottom-8 left-8 w-18 h-18 bg-white/10 rounded-lg flex items-center justify-center animate-data-flow delay-2000">
                  <Icon name="Users" size={22} color="rgba(255,255,255,0.8)" />
                </div>
                
                {/* Central Element */}
                <div className="w-32 h-32 bg-gradient-to-r from-coral-warm to-orange-400 rounded-2xl flex items-center justify-center mx-auto animate-ocean-pulse">
                  <Icon name="GraduationCap" size={48} color="white" />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="font-headline text-2xl font-bold text-coral-warm mb-1">30</div>
                  <div className="font-body text-xs text-white/80">Days Free Access</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-2xl font-bold text-coral-warm mb-1">200+</div>
                  <div className="font-body text-xs text-white/80">Premium Courses</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-2xl font-bold text-coral-warm mb-1">50+</div>
                  <div className="font-body text-xs text-white/80">Expert Mentors</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-2xl font-bold text-coral-warm mb-1">24/7</div>
                  <div className="font-body text-xs text-white/80">Support Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-12">
          <p className="font-body text-white/80 mb-4">
            Have questions about our programs? Our education advisors are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 font-cta-medium"
              iconName="Phone"
              iconPosition="left"
            >
              +94 11 234 5678
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 font-cta-medium"
              iconName="Mail"
              iconPosition="left"
            >
              education@nara.ac.lk
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 font-cta-medium"
              iconName="MessageCircle"
              iconPosition="left"
            >
              Live Chat Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;