import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const FeaturedCoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Courses', icon: 'Grid3X3' },
    { id: 'marine-biology', label: 'Marine Biology', icon: 'Fish' },
    { id: 'oceanography', label: 'Oceanography', icon: 'Waves' },
    { id: 'conservation', label: 'Conservation', icon: 'Shield' },
    { id: 'technology', label: 'Technology', icon: 'Cpu' }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "Marine Biodiversity of Sri Lanka",
      instructor: "Dr. Samantha Perera",
      category: "marine-biology",
      level: "Intermediate",
      duration: "8 weeks",
      students: 2450,
      rating: 4.9,
      price: "Free",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop",
      description: "Explore the rich marine biodiversity around Sri Lankan waters, from coral reefs to deep-sea ecosystems.",
      skills: ["Species Identification", "Ecosystem Analysis", "Conservation Planning"],
      isNew: true,
      isCertified: true
    },
    {
      id: 2,
      title: "Ocean Data Analysis with Python",
      instructor: "Prof. Rajesh Kumar",
      category: "technology",
      level: "Advanced",
      duration: "10 weeks",
      students: 1850,
      rating: 4.8,
      price: "LKR 15,000",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      description: "Master oceanographic data analysis using Python, machine learning, and statistical modeling techniques.",
      skills: ["Python Programming", "Data Visualization", "Statistical Analysis"],
      isNew: false,
      isCertified: true
    },
    {
      id: 3,
      title: "Sustainable Aquaculture Practices",
      instructor: "Dr. Nimal Fernando",
      category: "conservation",
      level: "Professional",
      duration: "6 weeks",
      students: 1200,
      rating: 4.7,
      price: "LKR 25,000",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop",
      description: "Learn sustainable fish farming techniques that balance productivity with environmental responsibility.",
      skills: ["Aquaculture Systems", "Environmental Impact", "Business Planning"],
      isNew: true,
      isCertified: true
    },
    {
      id: 4,
      title: "Coral Reef Restoration Techniques",
      instructor: "Dr. Priya Jayawardena",
      category: "conservation",
      level: "Intermediate",
      duration: "5 weeks",
      students: 980,
      rating: 4.9,
      price: "Free",
      image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=250&fit=crop",
      description: "Hands-on training in coral restoration methods used in Sri Lankan marine protected areas.",
      skills: ["Coral Biology", "Restoration Methods", "Monitoring Techniques"],
      isNew: false,
      isCertified: true
    },
    {
      id: 5,
      title: "Maritime Weather Forecasting",
      instructor: "Capt. Sunil Wickramasinghe",
      category: "oceanography",
      level: "Professional",
      duration: "4 weeks",
      students: 750,
      rating: 4.6,
      price: "LKR 20,000",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop",
      description: "Essential weather forecasting skills for maritime professionals and fishing industry workers.",
      skills: ["Weather Patterns", "Forecasting Tools", "Risk Assessment"],
      isNew: false,
      isCertified: true
    },
    {
      id: 6,
      title: "Ocean Exploration for Kids",
      instructor: "Ms. Chamari Silva",
      category: "marine-biology",
      level: "Beginner",
      duration: "3 weeks",
      students: 3200,
      rating: 4.8,
      price: "Free",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop",
      description: "Interactive ocean adventures designed to inspire young minds about marine science and conservation.",
      skills: ["Marine Life", "Ocean Basics", "Environmental Awareness"],
      isNew: true,
      isCertified: false
    }
  ];

  const filteredCourses = activeCategory === 'all' 
    ? featuredCourses 
    : featuredCourses?.filter(course => course?.category === activeCategory);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      case 'Professional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Featured Courses
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
            Discover our most popular and highly-rated courses, taught by leading experts in marine science and oceanography.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-cta-medium text-sm transition-all duration-ocean ${
                activeCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-text-secondary hover:bg-primary/10 hover:text-primary border border-border'
              }`}
            >
              <Icon name={category?.icon} size={16} />
              <span>{category?.label}</span>
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses?.map((course) => (
            <div key={course?.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-ocean-depth transition-all duration-ocean interactive-lift">
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={course?.image}
                  alt={course?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {course?.isNew && (
                    <span className="bg-coral-warm text-white text-xs font-cta-medium px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                  {course?.isCertified && (
                    <span className="bg-success text-success-foreground text-xs font-cta-medium px-2 py-1 rounded-full">
                      Certified
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-cta-medium px-2 py-1 rounded-full ${getLevelColor(course?.level)}`}>
                    {course?.level}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                      <span className="font-cta text-sm text-text-primary">{course?.rating}</span>
                    </div>
                    <span className="text-text-secondary">•</span>
                    <span className="font-body text-sm text-text-secondary">
                      {course?.students?.toLocaleString()} students
                    </span>
                  </div>
                  <div className="font-cta-medium text-sm text-primary">
                    {course?.price}
                  </div>
                </div>

                <h3 className="font-headline text-lg font-bold text-text-primary mb-2 line-clamp-2">
                  {course?.title}
                </h3>

                <p className="font-body text-sm text-text-secondary mb-4 line-clamp-2">
                  {course?.description}
                </p>

                <div className="flex items-center space-x-4 mb-4 text-xs text-text-secondary">
                  <span className="flex items-center space-x-1">
                    <Icon name="User" size={12} />
                    <span>{course?.instructor}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{course?.duration}</span>
                  </span>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {course?.skills?.slice(0, 3)?.map((skill, index) => (
                    <span key={index} className="bg-muted text-text-secondary text-xs font-cta px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    iconName="Play"
                    iconPosition="left"
                  >
                    Enroll Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="BookmarkPlus"
                  >
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;