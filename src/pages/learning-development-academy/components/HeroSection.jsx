import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-ocean-deep via-ocean-medium to-ocean-light min-h-[600px] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 border-2 border-white rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-1/4 animate-data-flow">
          <Icon name="BookOpen" size={32} color="rgba(255,255,255,0.3)" />
        </div>
        <div className="absolute top-48 right-1/3 animate-data-flow delay-1000">
          <Icon name="GraduationCap" size={28} color="rgba(255,255,255,0.3)" />
        </div>
        <div className="absolute bottom-32 left-1/3 animate-data-flow delay-2000">
          <Icon name="Users" size={30} color="rgba(255,255,255,0.3)" />
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-coral-warm rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={28} color="white" />
            </div>
            <div className="text-white/80 font-cta text-sm uppercase tracking-wider">
              Learning & Development Academy
            </div>
          </div>

          <h1 className="font-headline text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ocean Education for
            <span className="block text-coral-warm">Every Journey</span>
          </h1>

          <p className="font-body text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
            From curious young minds to seasoned maritime professionals, discover comprehensive ocean science education tailored to your learning path. Build expertise, earn certifications, and connect with NARA's world-class research community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              variant="default"
              size="lg"
              className="bg-coral-warm hover:bg-coral-warm/90 text-white font-cta-medium"
              iconName="Play"
              iconPosition="left"
            >
              Start Learning Journey
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-ocean-deep font-cta-medium"
              iconName="Users"
              iconPosition="left"
            >
              Join Community
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="font-headline text-2xl font-bold text-coral-warm mb-1">15,000+</div>
              <div className="font-body text-sm text-white/80">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="font-headline text-2xl font-bold text-coral-warm mb-1">200+</div>
              <div className="font-body text-sm text-white/80">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="font-headline text-2xl font-bold text-coral-warm mb-1">50+</div>
              <div className="font-body text-sm text-white/80">Expert Instructors</div>
            </div>
            <div className="text-center">
              <div className="font-headline text-2xl font-bold text-coral-warm mb-1">95%</div>
              <div className="font-body text-sm text-white/80">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;