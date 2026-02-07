import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ScholarshipSection = () => {
  const [activeTab, setActiveTab] = useState('opportunities');

  const scholarshipPrograms = [
    {
      id: 1,
      title: "Young Ocean Scientists Scholarship",
      category: "Student",
      amount: "LKR 500,000",
      duration: "1 Year",
      eligibility: "Ages 16-22, Academic Excellence",
      description: "Full scholarship covering tuition, research materials, and mentorship for outstanding young students pursuing marine science education.",
      benefits: [
        "Complete course fee coverage",
        "Research equipment allowance",
        "One-on-one mentorship with NARA scientists",
        "Internship placement guarantee"
      ],
      deadline: "March 31, 2024",
      applicants: 450,
      awarded: 25,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Maritime Professional Development Grant",
      category: "Professional",
      amount: "LKR 200,000",
      duration: "6 Months",
      eligibility: "5+ years maritime experience",
      description: "Supporting working professionals to upgrade their skills with advanced maritime technology and safety training programs.",
      benefits: [
        "Flexible learning schedule",
        "Industry certification included",
        "Networking opportunities",
        "Career advancement support"
      ],
      deadline: "April 15, 2024",
      applicants: 320,
      awarded: 40,
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Women in Ocean Science Fellowship",
      category: "Research",
      amount: "LKR 750,000",
      duration: "2 Years",
      eligibility: "Female researchers, Masters/PhD level",
      description: "Empowering women researchers with comprehensive support for advanced ocean science research and leadership development.",
      benefits: [
        "Research funding and equipment",
        "International conference participation",
        "Publication support",
        "Leadership training program"
      ],
      deadline: "May 20, 2024",
      applicants: 180,
      awarded: 15,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Rural Community Ocean Education Grant",
      category: "Community",
      amount: "LKR 300,000",
      duration: "1 Year",
      eligibility: "Rural coastal communities",
      description: "Bringing ocean education to underserved coastal communities through mobile learning units and community workshops.",
      benefits: [
        "Mobile learning equipment",
        "Community workshop materials",
        "Local educator training",
        "Ongoing program support"
      ],
      deadline: "June 10, 2024",
      applicants: 85,
      awarded: 20,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop"
    }
  ];

  const successStories = [
    {
      name: "Niluka Jayasinghe",
      program: "Young Ocean Scientists Scholarship 2022",
      achievement: "Published research on microplastic pollution in Sri Lankan waters",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      quote: "The scholarship didn't just fund my education; it opened doors to a global research community."
    },
    {
      name: "Roshan Perera",
      program: "Maritime Professional Development Grant 2021",
      achievement: "Promoted to Port Operations Manager after certification",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      quote: "NARA\'s support transformed my career trajectory completely."
    },
    {
      name: "Dr. Sanduni Fernando",
      program: "Women in Ocean Science Fellowship 2020",
      achievement: "Leading coral restoration project in Hikkaduwa Marine Sanctuary",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      quote: "This fellowship gave me the confidence and resources to pursue groundbreaking research."
    }
  ];

  const applicationTips = [
    {
      icon: "FileText",
      title: "Strong Personal Statement",
      description: "Clearly articulate your passion for ocean science and career goals."
    },
    {
      icon: "Users",
      title: "Community Impact Focus",
      description: "Demonstrate how your education will benefit Sri Lankan coastal communities."
    },
    {
      icon: "Award",
      title: "Academic Excellence",
      description: "Maintain strong academic records and showcase relevant achievements."
    },
    {
      icon: "Heart",
      title: "Genuine Commitment",
      description: "Show long-term dedication to marine science and conservation."
    }
  ];

  const tabs = [
    { id: 'opportunities', label: 'Opportunities', icon: 'Gift' },
    { id: 'success', label: 'Success Stories', icon: 'Star' },
    { id: 'apply', label: 'How to Apply', icon: 'FileCheck' }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-ocean-light/10">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-coral-warm rounded-lg flex items-center justify-center">
              <Icon name="Gift" size={28} color="white" />
            </div>
            <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary">
              Scholarships & Opportunities
            </h2>
          </div>
          <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
            Breaking barriers to ocean education through comprehensive scholarship programs designed to support underrepresented communities and emerging talent.
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

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {scholarshipPrograms?.map((program) => (
                <div key={program?.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-ocean-depth transition-all duration-ocean">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={program?.image}
                      alt={program?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-coral-warm text-white text-xs font-cta-medium px-3 py-1 rounded-full">
                        {program?.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="font-cta-medium text-sm text-primary">
                        {program?.amount}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-headline text-xl font-bold text-text-primary mb-3">
                      {program?.title}
                    </h3>

                    <p className="font-body text-sm text-text-secondary mb-4 leading-relaxed">
                      {program?.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={14} className="text-text-secondary" />
                        <span className="text-text-secondary">{program?.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Calendar" size={14} className="text-text-secondary" />
                        <span className="text-text-secondary">{program?.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Users" size={14} className="text-text-secondary" />
                        <span className="text-text-secondary">{program?.applicants} applicants</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Award" size={14} className="text-text-secondary" />
                        <span className="text-text-secondary">{program?.awarded} awarded</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-cta-medium text-sm text-text-primary mb-2">Benefits Include:</h4>
                      <ul className="space-y-1">
                        {program?.benefits?.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                            <span className="font-body text-xs text-text-secondary">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        iconName="FileText"
                        iconPosition="left"
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Info"
                      >
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="bg-card rounded-xl border border-border p-8">
              <h3 className="font-headline text-xl font-bold text-text-primary text-center mb-8">
                Scholarship Impact
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="font-headline text-3xl font-bold text-primary mb-2">LKR 50M+</div>
                  <div className="font-body text-sm text-text-secondary">Total Scholarships Awarded</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-3xl font-bold text-primary mb-2">2,500+</div>
                  <div className="font-body text-sm text-text-secondary">Students Supported</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-3xl font-bold text-primary mb-2">85%</div>
                  <div className="font-body text-sm text-text-secondary">From Rural Communities</div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-3xl font-bold text-primary mb-2">60%</div>
                  <div className="font-body text-sm text-text-secondary">Women Recipients</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Stories Tab */}
        {activeTab === 'success' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {successStories?.map((story, index) => (
                <div key={index} className="bg-card rounded-xl border border-border p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                    <Image
                      src={story?.image}
                      alt={story?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-headline text-lg font-bold text-text-primary mb-2">
                    {story?.name}
                  </h3>
                  <p className="font-cta text-sm text-primary mb-3">
                    {story?.program}
                  </p>
                  <p className="font-body text-sm text-text-secondary mb-4">
                    {story?.achievement}
                  </p>
                  <blockquote className="font-body text-sm text-text-primary italic">
                    "{story?.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Apply Tab */}
        {activeTab === 'apply' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Application Tips */}
              <div>
                <h3 className="font-headline text-2xl font-bold text-text-primary mb-6">
                  Application Tips
                </h3>
                <div className="space-y-6">
                  {applicationTips?.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={tip?.icon} size={20} color="white" />
                      </div>
                      <div>
                        <h4 className="font-cta-medium text-sm text-text-primary mb-2">
                          {tip?.title}
                        </h4>
                        <p className="font-body text-sm text-text-secondary">
                          {tip?.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Process */}
              <div>
                <h3 className="font-headline text-2xl font-bold text-text-primary mb-6">
                  Application Process
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-cta-medium text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-cta-medium text-sm text-text-primary">Review Eligibility</h4>
                      <p className="font-body text-xs text-text-secondary">Check requirements for your chosen program</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-cta-medium text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-cta-medium text-sm text-text-primary">Prepare Documents</h4>
                      <p className="font-body text-xs text-text-secondary">Gather transcripts, recommendations, and essays</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-cta-medium text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-cta-medium text-sm text-text-primary">Submit Application</h4>
                      <p className="font-body text-xs text-text-secondary">Complete online application before deadline</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-cta-medium text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-cta-medium text-sm text-text-primary">Interview Process</h4>
                      <p className="font-body text-xs text-text-secondary">Selected candidates invited for interviews</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-success/10 rounded-lg border border-success/20">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-white">
                      <Icon name="Check" size={16} />
                    </div>
                    <div>
                      <h4 className="font-cta-medium text-sm text-success">Award Notification</h4>
                      <p className="font-body text-xs text-text-secondary">Results announced within 6 weeks</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    className="bg-coral-warm hover:bg-coral-warm/90"
                    iconName="ExternalLink"
                    iconPosition="right"
                  >
                    Start Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScholarshipSection;