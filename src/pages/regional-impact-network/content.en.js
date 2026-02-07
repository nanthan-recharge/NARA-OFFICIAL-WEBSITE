const en = {
  meta: {
    title: 'Regional Impact Network - NARA Digital Ocean',
    description:
      "Explore how NARA's island-wide research centers combine science, community partnerships, and real-time ocean intelligence to strengthen Sri Lanka's coastal regions.",
    keywords:
      'NARA regional centers, Sri Lanka marine research, coastal resilience, community impact, ocean intelligence'
  },
  hero: {
    badge: 'Regional Network',
    subheading: 'Island-wide Impact',
    title: 'Connecting Communities Through',
    highlight: 'Ocean Science',
    description:
      'Six regional research centers across Sri Lanka pair real-time ocean intelligence with hands-on support for fishing communities, coastal industries, and local authorities. From early warnings to restoration programs, each hub turns marine science into everyday resilience.',
    primaryCta: { label: 'Explore Centers', icon: 'Map' },
    secondaryCta: { label: 'Impact Stories', icon: 'Heart' },
    leftStat: { value: '61', label: 'Communities served' },
    rightStat: { value: '100%', label: 'Safety record' },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop'
  },
  navigation: [
    { id: 'overview', label: 'Network Overview', icon: 'Globe' },
    { id: 'map', label: 'Regional Centers', icon: 'Map' },
    { id: 'stories', label: 'Impact Stories', icon: 'Heart' },
    { id: 'dashboard', label: 'Data Dashboard', icon: 'BarChart3' },
    { id: 'community', label: 'Community Hub', icon: 'Users' }
  ],
  overview: {
    stats: [
      {
        icon: 'Building',
        value: '6',
        label: 'Research centers',
        description: 'Strategically located across Sri Lanka',
        color: 'text-primary'
      },
      {
        icon: 'Users',
        value: '124',
        label: 'Research staff',
        description: 'Marine scientists, technicians, and field officers',
        color: 'text-secondary'
      },
      {
        icon: 'Home',
        value: '61',
        label: 'Partner communities',
        description: 'Coastal villages and fisheries cooperatives',
        color: 'text-accent'
      },
      {
        icon: 'Beaker',
        value: '65',
        label: 'Active projects',
        description: 'Climate adaptation, resource management, and safety',
        color: 'text-success'
      }
    ],
    achievementsTitle: 'Network Achievements',
    achievements: [
      {
        title: 'Zero casualties during cyclone season',
        description:
          'Advanced forecast messaging and harbor coordination protected more than 2,000 fishing vessels during the 2023 cyclone season.',
        impact: '100% safety record',
        icon: 'Shield',
        color: 'bg-success/10 text-success border-success/20'
      },
      {
        title: 'Coral reef recovery program',
        description:
          'Community nurseries in Galle and Batticaloa restored 15 hectares of reef habitat with a 78% survival rate after transplantation.',
        impact: '15 hectares restored',
        icon: 'Flower',
        color: 'bg-ocean-light/10 text-ocean-medium border-ocean-light/20'
      },
      {
        title: 'Sustainable fishing initiative',
        description:
          'Training 500+ multi-day boat captains in gear selectivity increased catch value by 25% while protecting spawning grounds.',
        impact: '25% catch increase',
        icon: 'Fish',
        color: 'bg-primary/10 text-primary border-primary/20'
      },
      {
        title: 'Marine education outreach',
        description:
          'Mobile marine labs, STEM camps, and teacher clinics reached 5,000+ students from coastal schools in 2023.',
        impact: '5,000+ students inspired',
        icon: 'GraduationCap',
        color: 'bg-accent/10 text-accent border-accent/20'
      }
    ],
    highlightsTitle: 'Regional Highlights',
    highlightLabels: {
      specialization: 'Specialization',
      keyProject: 'Flagship initiative',
      communityImpact: 'Community impact',
      staff: 'Staff',
      projects: 'Projects',
      communities: 'Communities'
    },
    highlights: [
      {
        region: 'Western Province',
        center: 'Colombo Marine Research Center',
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop',
        specialization: 'Urban coastal dynamics and harbor health',
        keyProject: 'Port City environmental observatory',
        communityImpact: 'Provides pollution alerts and safe navigation guidance to 12 fishing cooperatives.',
        stats: { staff: 24, projects: 8, communities: 12 }
      },
      {
        region: 'Southern Province',
        center: 'Galle Marine Observatory',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
        specialization: 'Coral reef conservation and eco-tourism',
        keyProject: 'Hikkaduwa reef resilience partnership',
        communityImpact: 'Water quality dashboards rebuild tourist confidence and support 1,200 livelihoods.',
        stats: { staff: 18, projects: 12, communities: 8 }
      },
      {
        region: 'Eastern Province',
        center: 'Trincomalee Deep Sea Station',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        specialization: 'Deep-water research and naval collaboration',
        keyProject: 'Whale migration and shipping corridor safety',
        communityImpact: 'Reduced vessel-whale collisions by 95% with smart routing advisories.',
        stats: { staff: 32, projects: 15, communities: 6 }
      }
    ]
  },
  map: {
    header: {
      title: 'Regional Research Centers',
      subtitle: "Interactive map of NARA's nationwide presence"
    },
    legend: {
      active: 'Active centers',
      selected: 'Selected'
    },
    legendTotals: {
      staff: 'Staff',
      projects: 'Projects',
      communities: 'Communities'
    },
    emptyState: {
      title: 'Select a research center',
      description: 'Click on any marker to explore detailed information about our regional hubs.'
    },
    quickStats: {
      title: 'Network overview',
      items: [
        { label: 'Total coverage', value: 'Island-wide' },
        { label: 'Research areas', value: '6 specializations' },
        { label: 'Community reach', value: '61 villages' }
      ]
    },
    details: {
      locationLabel: 'Location',
      staffLabel: 'Staff',
      projectsLabel: 'Projects',
      communitiesLabel: 'Communities',
      keyProjectsTitle: 'Key projects'
    },
    regions: [
      {
        id: 1,
        name: 'Colombo Marine Research Center',
        location: 'Colombo',
        position: { top: '45%', left: '15%' },
        specialization: 'Urban coastal dynamics',
        staff: 24,
        projects: 8,
        communities: 12,
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop',
        description:
          'Leading research on harbor water quality, storm surge modelling, and climate-ready infrastructure planning.',
        keyProjects: ['Port water quality observatory', 'Urban runoff impact atlas', 'Coastal erosion risk map']
      },
      {
        id: 2,
        name: 'Galle Marine Observatory',
        location: 'Galle',
        position: { top: '65%', left: '18%' },
        specialization: 'Coral reef ecosystems',
        staff: 18,
        projects: 12,
        communities: 8,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description:
          'Protects coral reefs, monitors tourist carrying capacity, and co-designs eco-certification schemes with dive operators.',
        keyProjects: ['Coral nursery network', 'Reef health live dashboard', 'Eco-tourism standards toolkit']
      },
      {
        id: 3,
        name: 'Trincomalee Deep Sea Station',
        location: 'Trincomalee',
        position: { top: '25%', left: '75%' },
        specialization: 'Deep-water research',
        staff: 32,
        projects: 15,
        communities: 6,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        description:
          'Combines acoustic monitoring, naval oceanography, and marine mammal tracking to secure blue corridors.',
        keyProjects: ['Whale migration alerts', 'Deep current observatory', 'Naval data collaboration wing']
      },
      {
        id: 4,
        name: 'Jaffna Peninsula Center',
        location: 'Jaffna',
        position: { top: '8%', left: '45%' },
        specialization: 'Lagoon ecosystems',
        staff: 16,
        projects: 10,
        communities: 15,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        description:
          'Anchors lagoon restoration, brackish aquaculture pilots, and climate-ready livelihoods for peninsula communities.',
        keyProjects: ['Lagoon rehabilitation labs', 'Sustainable crab fisheries plan', 'Community knowledge archive']
      },
      {
        id: 5,
        name: 'Batticaloa Coastal Lab',
        location: 'Batticaloa',
        position: { top: '40%', left: '85%' },
        specialization: 'Mangrove conservation',
        staff: 14,
        projects: 9,
        communities: 11,
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
        description:
          'Leads mangrove restoration, blue-carbon baselines, and community-led shoreline protection.',
        keyProjects: ['Mangrove guardian collectives', 'Blue-carbon measurement lab', 'Coastal protection action plans']
      },
      {
        id: 6,
        name: 'Hambantota Marine Hub',
        location: 'Hambantota',
        position: { top: '70%', left: '65%' },
        specialization: 'Maritime infrastructure',
        staff: 20,
        projects: 11,
        communities: 9,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        description:
          'Supports smart-port operations, ballast water audits, and marine traffic analytics for the southern corridor.',
        keyProjects: ['Harbor environmental command center', 'Smart navigation advisories', 'Ballast water compliance hub']
      }
    ]
  },
  stories: {
    header: {
      title: 'Local Impact Stories',
      subtitle: "Real stories of how NARA's research strengthens coastal communities"
    },
    categories: [
      { id: 'all', label: 'All stories', icon: 'Globe' },
      { id: 'fishing', label: 'Fishing communities', icon: 'Fish' },
      { id: 'tourism', label: 'Tourism', icon: 'Camera' },
      { id: 'conservation', label: 'Conservation', icon: 'Leaf' },
      { id: 'education', label: 'Education', icon: 'BookOpen' }
    ],
    stories: [
      {
        id: 1,
        category: 'fishing',
        title: 'Early warning protocol safeguards Negombo fleet',
        location: 'Negombo Fishing Harbor',
        region: 'Colombo Marine Research Center',
        impact: 'Zero casualties during Cyclone Burevi',
        date: 'December 2023',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description:
          'An integrated SMS, VHF, and community alert chain issued a 48-hour safety window, guiding more than 200 boats back to harbor before the storm made landfall.',
        metrics: [
          { label: 'Boats protected', value: '200', icon: 'Ship' },
          { label: 'Lives safeguarded', value: '800', icon: 'Users' },
          { label: 'Assets secured', value: 'Rs. 50M', icon: 'DollarSign' }
        ],
        testimonial: {
          quote:
            "NARA's forecast arrived before the skies turned. We closed the nets, returned early, and every crew member got home safe.",
          author: 'Sunil Perera',
          role: "President, Negombo Fishermen's Cooperative"
        }
      },
      {
        id: 2,
        category: 'tourism',
        title: 'Water quality dashboard rebuilds Hikkaduwa confidence',
        location: 'Hikkaduwa Marine Sanctuary',
        region: 'Galle Marine Observatory',
        impact: '30% increase in tourist bookings',
        date: 'January 2024',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        description:
          'Daily reef health, turbidity, and visitor carrying capacity updates help tour operators schedule responsibly while assuring travelers of safe waters.',
        metrics: [
          { label: 'Tourist growth', value: '30%', icon: 'TrendingUp' },
          { label: 'Water quality score', value: '95/100', icon: 'Droplets' },
          { label: 'Coral cover', value: '78%', icon: 'Flower' }
        ],
        testimonial: {
          quote:
            'Guests can open the dashboard before they dive. Transparent science makes our business stronger and our reefs healthier.',
          author: 'Chaminda Silva',
          role: 'Dive center owner'
        }
      },
      {
        id: 3,
        category: 'conservation',
        title: 'Mangrove guardians shield Batticaloa villages',
        location: 'Batticaloa Lagoon',
        region: 'Batticaloa Coastal Lab',
        impact: '85% reduction in coastal erosion',
        date: 'March 2024',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
        description:
          'Community stewards planted 10,000 mangroves, pairing local knowledge with NARA monitoring to restore buffer zones and revive lagoon fisheries.',
        metrics: [
          { label: 'Families protected', value: '500', icon: 'Home' },
          { label: 'Mangroves planted', value: '10,000', icon: 'TreePine' },
          { label: 'Erosion reduced', value: '85%', icon: 'Shield' }
        ],
        testimonial: {
          quote:
            'The mangroves now hold the shoreline, and the crabs have returned. Science and tradition are working together for our children.',
          author: 'Kamala Devi',
          role: 'Kaluthavalai community leader'
        }
      },
      {
        id: 4,
        category: 'education',
        title: 'Mobile marine lab inspires northern students',
        location: 'Jaffna Peninsula Schools',
        region: 'Jaffna Peninsula Center',
        impact: '40% rise in marine science enrolment',
        date: 'February 2024',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        description:
          'Student-led experiments, VR reef tours, and career mentoring sparked new ambitions, with more girls choosing advanced marine studies.',
        metrics: [
          { label: 'Students reached', value: '1,000', icon: 'Users' },
          { label: 'Schools visited', value: '25', icon: 'School' },
          { label: 'STEM enrolment', value: '+40%', icon: 'TrendingUp' }
        ],
        testimonial: {
          quote:
            'My daughter now keeps a tide diary and wants to become an oceanographer. The lab showed her that the sea is a classroom.',
          author: 'Rajeswari Selvan',
          role: 'Parent and school volunteer'
        }
      }
    ],
    cta: {
      title: 'Share your story',
      description: "Has NARA's work impacted your community? We'd love to hear from you.",
      primary: { label: 'Submit your story', icon: 'MessageCircle' },
      secondary: { label: 'Join community forum', icon: 'Users' }
    }
  },
  dashboard: {
    header: {
      title: 'Regional Data Dashboard',
      subtitle: "Real-time monitoring across NARA's research network"
    },
    regionOptions: [
      { id: 'all', name: 'All regions', color: '#003366' },
      { id: 'colombo', name: 'Colombo', color: '#1E40AF' },
      { id: 'galle', name: 'Galle', color: '#40E0D0' },
      { id: 'trincomalee', name: 'Trincomalee', color: '#FF6B35' },
      { id: 'jaffna', name: 'Jaffna', color: '#059669' },
      { id: 'batticaloa', name: 'Batticaloa', color: '#D97706' },
      { id: 'hambantota', name: 'Hambantota', color: '#DC2626' }
    ],
    timeRanges: [
      { id: '24h', name: '24 hours' },
      { id: '7d', name: '7 days' },
      { id: '30d', name: '30 days' },
      { id: '90d', name: '90 days' }
    ],
    alerts: {
      items: [
        {
          type: 'weather',
          count: 3,
          severity: 'medium',
          icon: 'Cloud',
          title: 'Weather advisories',
          description: 'Strong wind warnings active'
        },
        {
          type: 'marine',
          count: 1,
          severity: 'low',
          icon: 'Fish',
          title: 'Marine life alerts',
          description: 'Whale migration in progress'
        },
        {
          type: 'water',
          count: 2,
          severity: 'low',
          icon: 'Droplets',
          title: 'Water quality',
          description: 'Monitoring algae activity'
        },
        {
          type: 'safety',
          count: 0,
          severity: 'none',
          icon: 'Shield',
          title: 'Safety alerts',
          description: 'All clear'
        }
      ]
    },
    weather: {
      title: 'Current weather conditions',
      updated: 'Updated 5 min ago',
      labels: {
        temperature: 'Temperature',
        humidity: 'Humidity',
        wind: 'Wind speed (km/h)',
        waves: 'Wave height (m)'
      },
      data: [
        { region: 'Colombo', temperature: 28.5, humidity: 78, windSpeed: 12, waveHeight: 1.2 },
        { region: 'Galle', temperature: 27.8, humidity: 82, windSpeed: 15, waveHeight: 1.8 },
        { region: 'Trincomalee', temperature: 29.2, humidity: 75, windSpeed: 18, waveHeight: 2.1 },
        { region: 'Jaffna', temperature: 30.1, humidity: 71, windSpeed: 14, waveHeight: 1.5 },
        { region: 'Batticaloa', temperature: 28.9, humidity: 79, windSpeed: 16, waveHeight: 1.7 },
        { region: 'Hambantota', temperature: 29.5, humidity: 73, windSpeed: 20, waveHeight: 2.3 }
      ]
    },
    fishing: {
      title: 'Fishing conditions (24h)',
      legend: {
        excellent: 'Excellent',
        good: 'Good',
        fair: 'Fair',
        poor: 'Poor'
      },
      data: [
        { time: '00:00', excellent: 2, good: 3, fair: 1, poor: 0 },
        { time: '04:00', excellent: 4, good: 2, fair: 0, poor: 0 },
        { time: '08:00', excellent: 5, good: 1, fair: 0, poor: 0 },
        { time: '12:00', excellent: 3, good: 2, fair: 1, poor: 0 },
        { time: '16:00', excellent: 2, good: 3, fair: 1, poor: 0 },
        { time: '20:00', excellent: 3, good: 2, fair: 1, poor: 0 }
      ]
    },
    marineLife: {
      title: 'Marine life sightings (7 days)',
      data: [
        { species: 'Dolphins', count: 45, color: '#003366' },
        { species: 'Sea turtles', count: 23, color: '#1E40AF' },
        { species: 'Whales', count: 8, color: '#40E0D0' },
        { species: 'Sharks', count: 12, color: '#FF6B35' },
        { species: 'Rays', count: 18, color: '#059669' }
      ]
    },
    waterQuality: {
      title: 'Water quality trends',
      legend: {
        ph: 'pH level',
        oxygen: 'Dissolved oxygen',
        turbidity: 'Turbidity',
        temperature: 'Temperature'
      },
      data: [
        { date: 'Jan 15', ph: 8.1, dissolved_oxygen: 7.2, turbidity: 2.1, temperature: 27.5 },
        { date: 'Jan 16', ph: 8.0, dissolved_oxygen: 7.4, turbidity: 1.9, temperature: 27.8 },
        { date: 'Jan 17', ph: 8.2, dissolved_oxygen: 7.1, turbidity: 2.3, temperature: 28.1 },
        { date: 'Jan 18', ph: 8.1, dissolved_oxygen: 7.3, turbidity: 2.0, temperature: 27.9 },
        { date: 'Jan 19', ph: 8.0, dissolved_oxygen: 7.5, turbidity: 1.8, temperature: 28.2 },
        { date: 'Jan 20', ph: 8.1, dissolved_oxygen: 7.2, turbidity: 2.1, temperature: 28.0 },
        { date: 'Jan 21', ph: 8.2, dissolved_oxygen: 7.4, turbidity: 1.9, temperature: 28.3 }
      ]
    },
    export: {
      title: 'Access regional data',
      description: 'Download datasets or integrate with our API for real-time regional monitoring data.',
      actions: {
        export: { label: 'Export data', icon: 'Download' },
        api: { label: 'API access', icon: 'Code' }
      }
    }
  },
  community: {
    header: {
      title: 'Community engagement',
      description: "Connect, contribute, and collaborate with NARA's research community",
      activeMembers: '1,247 active members'
    },
    tabs: [
      { id: 'forums', label: 'Community forums', icon: 'MessageSquare' },
      { id: 'citizen-science', label: 'Citizen science', icon: 'Search' },
      { id: 'alerts', label: 'Local alerts', icon: 'Bell' },
      { id: 'events', label: 'Events & workshops', icon: 'Calendar' }
    ],
    forums: {
      actions: {
        newTopic: 'New topic',
        search: 'Search forums',
        sortLabel: 'Sort by:',
        latest: 'Latest activity'
      },
      topics: [
        {
          id: 1,
          title: 'Unusual dolphin behaviour in Negombo waters',
          author: 'Fisherman Sunil',
          region: 'Colombo Marine Research Center',
          replies: 23,
          lastActivity: '2 hours ago',
          category: 'Marine life',
          status: 'active',
          statusLabel: 'Active',
          excerpt:
            'Have you noticed dolphins approaching closer to shore this week? They seem to be tracking different schooling fish.'
        },
        {
          id: 2,
          title: 'Water quality changes after monsoon rains',
          author: 'Dr. Kamala Perera',
          region: 'Galle Marine Observatory',
          replies: 15,
          lastActivity: '5 hours ago',
          category: 'Water quality',
          status: 'expert-response',
          statusLabel: 'Expert response',
          excerpt:
            'Our sensors recorded higher turbidity levels. Sharing mitigation steps for lagoon communities and seafood processors.'
        },
        {
          id: 3,
          title: 'Coral bleaching observations — Hikkaduwa',
          author: 'Dive Master Chaminda',
          region: 'Galle Marine Observatory',
          replies: 31,
          lastActivity: '1 day ago',
          category: 'Conservation',
          status: 'urgent',
          statusLabel: 'Urgent',
          excerpt:
            'Noticing bleaching in survey sectors 3–5. Requesting verification dives and advice on immediate response actions.'
        },
        {
          id: 4,
          title: 'Traditional fishing calendar vs. modern forecasts',
          author: 'Elder Fisherman Banda',
          region: 'Jaffna Peninsula Center',
          replies: 42,
          lastActivity: '2 days ago',
          category: 'Traditional knowledge',
          status: 'popular',
          statusLabel: 'Popular',
          excerpt:
            'Comparing our ancestral fishing wisdom with NARA tide and moon phase predictions—interesting convergences emerging.'
        }
      ]
    },
    citizenScience: {
      intro: {
        title: 'Become a citizen scientist',
        description:
          'Contribute observations, photographs, and water samples from your coastline. Every data point strengthens national marine intelligence.',
        button: 'Join program'
      },
      labels: {
        participants: 'Participants',
        dataPoints: 'Data points',
        time: 'Time commitment',
        region: 'Region',
        tools: 'Tools needed',
        impact: 'Impact',
        learnMore: 'Learn more & join'
      },
      projects: [
        {
          id: 1,
          title: 'Beach plastic monitoring',
          description: 'Log plastic types and volumes found on weekly shoreline walks.',
          participants: 156,
          dataPoints: 2340,
          region: 'All centers',
          difficulty: 'Easy',
          difficultyLabel: 'Easy',
          timeCommitment: '15 min/week',
          tools: ['Mobile app', 'Camera', 'GPS'],
          impact: 'Informing national plastic reduction policies'
        },
        {
          id: 2,
          title: 'Fish population surveys',
          description: 'Record species, size, and catch per unit effort during fishing trips.',
          participants: 89,
          dataPoints: 1567,
          region: 'Coastal areas',
          difficulty: 'Medium',
          difficultyLabel: 'Medium',
          timeCommitment: '30 min/trip',
          tools: ['Species guide', 'Mobile app', 'Camera'],
          impact: 'Supporting sustainable fisheries management'
        },
        {
          id: 3,
          title: 'Water temperature logging',
          description: 'Submit daily sea surface temperature readings from pier or boat locations.',
          participants: 67,
          dataPoints: 4521,
          region: 'All coastal areas',
          difficulty: 'Easy',
          difficultyLabel: 'Easy',
          timeCommitment: '5 min/day',
          tools: ['Thermometer', 'Mobile app'],
          impact: 'Tracking climate-driven warming patterns'
        }
      ],
      observationForm: {
        title: 'Quick observation report',
        fields: {
          location: {
            label: 'Location',
            placeholder: 'e.g., Negombo Beach, GPS coordinates'
          },
          category: {
            label: 'Category',
            placeholder: 'e.g., Marine life, Water quality, Weather'
          },
          observation: {
            label: 'Observation',
            placeholder: 'Describe what you observed...'
          }
        },
        submit: 'Submit observation'
      }
    },
    alerts: {
      title: 'Local alerts & advisories',
      subtitle: 'Real-time updates from NARA regional centers',
      preferences: 'Alert preferences',
      labels: {
        validUntil: 'Valid until'
      },
      alerts: [
        {
          id: 1,
          type: 'weather',
          severity: 'high',
          severityLabel: 'High',
          title: 'Strong wind warning — Southern coast',
          message: 'Wind speeds expected to reach 45–50 km/h. Small craft advisory in effect.',
          region: 'Galle, Matara, Hambantota',
          validUntil: '2024-01-20T18:00:00+05:30',
          source: 'Galle Marine Observatory'
        },
        {
          id: 2,
          type: 'marine-life',
          severity: 'medium',
          severityLabel: 'Medium',
          title: 'Whale migration alert — Eastern waters',
          message: 'Blue whale pod spotted 15 km off Trincomalee. Maintain a 500 m buffer.',
          region: 'Trincomalee, Batticaloa',
          validUntil: '2024-01-22T12:00:00+05:30',
          source: 'Trincomalee Deep Sea Station'
        },
        {
          id: 3,
          type: 'water-quality',
          severity: 'low',
          severityLabel: 'Low',
          title: 'Algae bloom monitoring — Negombo Lagoon',
          message: 'Elevated algae activity detected. Harvesters advised to aerate holding tanks.',
          region: 'Negombo, Chilaw',
          validUntil: '2024-01-25T09:00:00+05:30',
          source: 'Colombo Marine Research Center'
        }
      ],
      share: 'Share alert',
      stayInformed: {
        title: 'Stay informed',
        description: 'Subscribe to receive alerts via SMS, email, or push notifications.',
        primary: { label: 'SMS alerts' },
        secondary: { label: 'Email alerts' }
      }
    },
    events: {
      title: 'Upcoming events & workshops',
      subtitle: "Join NARA's community education and engagement programs",
      calendar: 'View full calendar',
      events: [
        {
          id: 1,
          type: 'Workshop',
          typeLabel: 'Workshop',
          title: 'Marine conservation workshop',
          date: '2024-01-25',
          time: '09:00 - 16:00',
          location: 'Galle Marine Observatory',
          audience: 'Fishing communities',
          capacity: 50,
          registered: 32,
          description: 'Hands-on training on gear selectivity, responsible reef management, and safety protocols.',
          facilitator: 'Dr. Nimal Silva',
          facilitatorRole: 'Marine biologist'
        },
        {
          id: 2,
          type: 'Educational Event',
          typeLabel: 'Educational event',
          title: 'School marine science fair',
          date: '2024-01-28',
          time: '10:00 - 15:00',
          location: 'Jaffna Peninsula Center',
          audience: 'Students & teachers',
          capacity: 200,
          registered: 145,
          description: 'Student showcases, ocean career mentoring, and lab demonstrations.',
          facilitator: 'NARA Education Team',
          facilitatorRole: 'STEM outreach unit'
        },
        {
          id: 3,
          type: 'Training',
          typeLabel: 'Training',
          title: 'Mangrove restoration training',
          date: '2024-02-02',
          time: '08:00 - 12:00',
          location: 'Batticaloa Coastal Lab',
          audience: 'Community volunteers',
          capacity: 30,
          registered: 28,
          description: 'Field practicum on planting, monitoring, and maintaining mangrove buffers.',
          facilitator: 'Coastal Restoration Team',
          facilitatorRole: 'Ecosystem services unit'
        }
      ],
      statsLabels: {
        facilitator: 'Facilitator',
        registration: 'Registration'
      },
      buttons: {
        register: 'Register now',
        waitlist: 'Waitlist'
      },
      footer: {
        title: 'Host an event',
        description: 'Interested in organizing a marine science event in your community? Let’s collaborate.',
        button: 'Propose event'
      }
    }
  },
  cta: {
    title: 'Join our regional network',
    description:
      "Whether you're a researcher, community leader, or ocean enthusiast, there's a place for you in NARA's regional network. Connect with your local center and become part of Sri Lanka's marine resilience story.",
    primary: { label: 'Find your local center', icon: 'MapPin' },
    secondary: { label: 'Contact regional team', icon: 'MessageCircle' }
  },
  footer: {
    name: 'NARA Digital Ocean',
    description: 'National Aquatic Resources Research and Development Agency — connecting communities through ocean intelligence.'
  }
};

export default en;
