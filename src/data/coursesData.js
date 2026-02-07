export const coursesData = {
  categories: [
    { id: 1, name: 'Ocean Science', icon: '🌊', color: 'cyan' },
    { id: 2, name: 'Marine Biology', icon: '🐠', color: 'blue' },
    { id: 3, name: 'Environmental Policy', icon: '📜', color: 'green' },
    { id: 4, name: 'Technology & Innovation', icon: '🔬', color: 'purple' },
    { id: 5, name: 'Research Methods', icon: '📊', color: 'orange' },
    { id: 6, name: 'Leadership & Management', icon: '👥', color: 'indigo' }
  ],
  
  courses: [
    {
      id: 1,
      title: 'Advanced Ocean Dynamics',
      category: 1,
      description: 'Master the complex physics of ocean currents, tides, and wave dynamics.',
      instructor: 'Dr. Sarah Chen',
      duration: '12 weeks',
      level: 'Advanced',
      enrolled: 2456,
      rating: 4.9,
      price: 299,
      thumbnail: '/api/placeholder/400/250',
      modules: 8,
      certification: true,
      tags: ['Physics', 'Oceanography', 'Climate'],
      features: ['Live Labs', 'Field Work', 'Research Project']
    },
    {
      id: 2,
      title: 'Marine Ecosystem Conservation',
      category: 2,
      description: 'Learn strategies for protecting and restoring marine biodiversity.',
      instructor: 'Prof. Michael Torres',
      duration: '8 weeks',
      level: 'Intermediate',
      enrolled: 3891,
      rating: 4.8,
      price: 199,
      thumbnail: '/api/placeholder/400/250',
      modules: 6,
      certification: true,
      tags: ['Conservation', 'Ecology', 'Biodiversity'],
      features: ['Case Studies', 'Virtual Dives', 'Expert Talks']
    },
    {
      id: 3,
      title: 'Coastal Zone Management',
      category: 3,
      description: 'Comprehensive approach to sustainable coastal development and policy.',
      instructor: 'Dr. Emily Watson',
      duration: '10 weeks',
      level: 'Intermediate',
      enrolled: 1823,
      rating: 4.7,
      price: 249,
      thumbnail: '/api/placeholder/400/250',
      modules: 7,
      certification: true,
      tags: ['Policy', 'Sustainability', 'Management'],
      features: ['Policy Analysis', 'GIS Tools', 'Simulations']
    },
    {
      id: 4,
      title: 'AI in Ocean Research',
      category: 4,
      description: 'Harness artificial intelligence for ocean data analysis and predictions.',
      instructor: 'Dr. Alex Kumar',
      duration: '6 weeks',
      level: 'Advanced',
      enrolled: 1567,
      rating: 4.9,
      price: 349,
      thumbnail: '/api/placeholder/400/250',
      modules: 5,
      certification: true,
      tags: ['AI', 'Machine Learning', 'Data Science'],
      features: ['Python Labs', 'Real Datasets', 'AI Models']
    },
    {
      id: 5,
      title: 'Introduction to Oceanography',
      category: 1,
      description: 'Foundation course covering all aspects of ocean science.',
      instructor: 'Dr. Lisa Park',
      duration: '6 weeks',
      level: 'Beginner',
      enrolled: 5234,
      rating: 4.6,
      price: 99,
      thumbnail: '/api/placeholder/400/250',
      modules: 6,
      certification: true,
      tags: ['Fundamentals', 'Science', 'Introduction'],
      features: ['Interactive Maps', 'Quizzes', 'Virtual Tours']
    },
    {
      id: 6,
      title: 'Research Paper Writing',
      category: 5,
      description: 'Master academic writing for ocean science publications.',
      instructor: 'Prof. James Mitchell',
      duration: '4 weeks',
      level: 'Intermediate',
      enrolled: 2109,
      rating: 4.8,
      price: 149,
      thumbnail: '/api/placeholder/400/250',
      modules: 4,
      certification: false,
      tags: ['Writing', 'Research', 'Publication'],
      features: ['Peer Review', 'Templates', 'Editor Feedback']
    }
  ],
  
  learningPaths: [
    {
      id: 1,
      title: 'Ocean Research Specialist',
      description: 'Complete pathway to becoming an ocean research expert',
      duration: '6 months',
      courses: 5,
      level: 'Beginner to Advanced',
      icon: '🎓',
      gradient: 'from-cyan-400 to-blue-600',
      modules: [
        'Foundation in Oceanography',
        'Research Methodologies',
        'Data Analysis & Visualization',
        'Field Research Techniques',
        'Publication & Presentation'
      ]
    },
    {
      id: 2,
      title: 'Marine Conservation Leader',
      description: 'Develop expertise in marine conservation and policy',
      duration: '4 months',
      courses: 4,
      level: 'Intermediate',
      icon: '🌍',
      gradient: 'from-green-400 to-teal-600',
      modules: [
        'Marine Ecosystems',
        'Conservation Strategies',
        'Policy Development',
        'Community Engagement'
      ]
    },
    {
      id: 3,
      title: 'Ocean Tech Innovator',
      description: 'Master technology applications in ocean science',
      duration: '5 months',
      courses: 4,
      level: 'Advanced',
      icon: '🚀',
      gradient: 'from-purple-400 to-pink-600',
      modules: [
        'Ocean Data Science',
        'AI & Machine Learning',
        'Remote Sensing',
        'Innovation Lab Projects'
      ]
    }
  ],
  
  instructors: [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      title: 'Lead Ocean Physicist',
      avatar: '/api/placeholder/100/100',
      rating: 4.9,
      students: 12450,
      courses: 8,
      bio: '15+ years in ocean dynamics research'
    },
    {
      id: 2,
      name: 'Prof. Michael Torres',
      title: 'Marine Biologist',
      avatar: '/api/placeholder/100/100',
      rating: 4.8,
      students: 9823,
      courses: 6,
      bio: 'Expert in tropical marine ecosystems'
    },
    {
      id: 3,
      name: 'Dr. Emily Watson',
      title: 'Policy Specialist',
      avatar: '/api/placeholder/100/100',
      rating: 4.7,
      students: 7654,
      courses: 5,
      bio: 'International coastal management consultant'
    }
  ],
  
  achievements: [
    { id: 1, name: 'Quick Learner', icon: '⚡', description: 'Complete 3 courses in a month' },
    { id: 2, name: 'Research Pioneer', icon: '🔬', description: 'Submit 5 research projects' },
    { id: 3, name: 'Community Leader', icon: '👑', description: 'Help 50 fellow students' },
    { id: 4, name: 'Ocean Guardian', icon: '🛡️', description: 'Complete conservation pathway' }
  ],
  
  upcomingEvents: [
    {
      id: 1,
      title: 'Ocean Summit 2025',
      date: '2025-02-15',
      type: 'Conference',
      speaker: 'Global Ocean Leaders',
      attendees: 500
    },
    {
      id: 2,
      title: 'AI in Ocean Research Workshop',
      date: '2025-01-28',
      type: 'Workshop',
      speaker: 'Dr. Alex Kumar',
      attendees: 100
    },
    {
      id: 3,
      title: 'Marine Conservation Webinar',
      date: '2025-01-25',
      type: 'Webinar',
      speaker: 'Prof. Michael Torres',
      attendees: 250
    }
  ]
};