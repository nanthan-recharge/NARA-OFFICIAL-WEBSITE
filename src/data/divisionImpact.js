/**
 * Division Impact & Analytics Data
 * Comprehensive impact metrics and visualizations for all divisions
 */

export const DIVISION_IMPACT = {
  'environmental-studies': {
    keyMetrics: [
      { label: 'Monitoring Stations Active', value: '25', icon: 'Radio', trend: '+7', color: 'green' },
      { label: 'Water Quality Improved', value: '68%', icon: 'TrendingUp', trend: '+18%', color: 'emerald' },
      { label: 'Pollution Incidents Responded', value: '142', icon: 'AlertCircle', trend: '+28', color: 'teal' },
      { label: 'Coastal Areas Protected', value: '15', icon: 'Shield', trend: '+5', color: 'cyan' }
    ],
    impactStories: [
      {
        title: 'Coastal Water Quality Success',
        description: 'Continuous monitoring and intervention programs improved coastal water quality index by 68% across 12 key locations.',
        metrics: { before: 58, after: 97, unit: 'WQI Score', improvement: '+67%' },
        year: 2024
      },
      {
        title: 'X-Press Pearl Response',
        description: 'Rapid environmental assessment and monitoring during X-Press Pearl disaster provided critical data for recovery planning, tested 850+ samples.',
        metrics: { before: 0, after: 850, unit: 'samples tested', improvement: 'NEW' },
        year: 2021
      },
      {
        title: 'Marine Protected Area Expansion',
        description: 'Environmental baseline surveys supported establishment of 5 new Marine Protected Areas covering 2,400 km² of ocean.',
        metrics: { before: 1800, after: 4200, unit: 'km² protected', improvement: '+133%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 18 },
        { year: 2021, count: 24 },
        { year: 2022, count: 32 },
        { year: 2023, count: 38 },
        { year: 2024, count: 45 }
      ],
      citations: 850,
      hIndex: 22
    },
    economicImpact: {
      valueGenerated: 'USD 2.2M',
      jobsCreated: 85,
      communitiesBenefited: 45000
    },
    partnerships: [
      'Ministry of Environment', 'UNEP', 'IOC-UNESCO', 'Marine Conservation Society', 'Universities'
    ]
  },

  'fisheries-science': {
    keyMetrics: [
      { label: 'Fish Stocks Assessed', value: '25+', icon: 'Fish', trend: '+15%', color: 'blue' },
      { label: 'Annual Reports Published', value: '12', icon: 'FileText', trend: '+8%', color: 'cyan' },
      { label: 'Fishers Trained', value: '850', icon: 'Users', trend: '+22%', color: 'teal' },
      { label: 'Conservation Areas Established', value: '8', icon: 'Shield', trend: '+3', color: 'green' }
    ],
    impactStories: [
      {
        title: 'Sustainable Tuna Management',
        description: 'Stock assessments led to 30% reduction in overfishing and improved tuna population by 18% over 3 years.',
        metrics: { before: 12500, after: 14750, unit: 'tons', improvement: '+18%' },
        year: 2024
      },
      {
        title: 'Shark Conservation Success',
        description: 'NPOA-Sharks implementation reduced shark bycatch by 42% while maintaining fisher livelihoods.',
        metrics: { before: 3200, after: 1856, unit: 'sharks', improvement: '-42%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 28 },
        { year: 2021, count: 32 },
        { year: 2022, count: 38 },
        { year: 2023, count: 42 },
        { year: 2024, count: 48 }
      ],
      citations: 1250,
      hIndex: 24
    },
    economicImpact: {
      valueGenerated: 'USD 2.5M',
      jobsCreated: 120,
      fisheriesImproved: 15
    },
    partnerships: [
      'IOTC', 'FAO', 'World Bank', 'NOAA', 'University of Colombo'
    ]
  },

  'marine-biology': {
    keyMetrics: [
      { label: 'Species Monitored', value: '180+', icon: 'Fish', trend: '+25', color: 'teal' },
      { label: 'Coral Fragments Planted', value: '12,500', icon: 'Shell', trend: '+5000', color: 'emerald' },
      { label: 'Turtle Nests Protected', value: '450', icon: 'Shield', trend: '+18%', color: 'green' },
      { label: 'Marine Protected Areas', value: '6', icon: 'MapPin', trend: '+2', color: 'blue' }
    ],
    impactStories: [
      {
        title: 'Blue Whale Population Recovery',
        description: 'Long-term monitoring revealed 12% increase in blue whale sightings in Sri Lankan waters.',
        metrics: { before: 250, after: 280, unit: 'sightings', improvement: '+12%' },
        year: 2024
      },
      {
        title: 'Coral Reef Restoration',
        description: 'Restored coral reefs showed 65% survival rate and 23% increase in fish diversity.',
        metrics: { before: 48, after: 59, unit: 'species', improvement: '+23%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 35 },
        { year: 2021, count: 42 },
        { year: 2022, count: 48 },
        { year: 2023, count: 55 },
        { year: 2024, count: 62 }
      ],
      citations: 1850,
      hIndex: 32
    },
    economicImpact: {
      valueGenerated: 'USD 1.8M',
      jobsCreated: 85,
      communitiesBenefited: 25
    },
    partnerships: [
      'National Geographic', 'IUCN', 'WWF', 'Blue Whale Study', 'Ocean Alliance'
    ]
  },

  'aquaculture': {
    keyMetrics: [
      { label: 'Fish Farmers Trained', value: '1,200+', icon: 'Users', trend: '+300', color: 'purple' },
      { label: 'Production Increased', value: '45%', icon: 'TrendingUp', trend: '+12%', color: 'violet' },
      { label: 'New Strains Developed', value: '8', icon: 'Dna', trend: '+3', color: 'indigo' },
      { label: 'Demonstration Farms', value: '15', icon: 'Home', trend: '+5', color: 'blue' }
    ],
    impactStories: [
      {
        title: 'Tilapia Yield Improvement',
        description: 'New genetic strains increased average yield by 35% and reduced disease incidence by 48%.',
        metrics: { before: 2.8, after: 3.78, unit: 'kg/m³', improvement: '+35%' },
        year: 2024
      },
      {
        title: 'Sustainable Shrimp Farming',
        description: 'Biofloc technology reduced water usage by 90% and increased profitability by 28%.',
        metrics: { before: 100, after: 10, unit: '% water use', improvement: '-90%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 22 },
        { year: 2021, count: 28 },
        { year: 2022, count: 32 },
        { year: 2023, count: 38 },
        { year: 2024, count: 42 }
      ],
      citations: 980,
      hIndex: 21
    },
    economicImpact: {
      valueGenerated: 'USD 3.2M',
      jobsCreated: 450,
      farmsEstablished: 180
    },
    partnerships: [
      'WorldFish', 'FAO', 'ADB', 'Private Sector Partners', 'University of Ruhuna'
    ]
  },

  'socio-economics': {
    keyMetrics: [
      { label: 'Fisher Households Surveyed', value: '2,500+', icon: 'Users', trend: '+500', color: 'amber' },
      { label: 'Income Increase', value: '32%', icon: 'DollarSign', trend: '+8%', color: 'yellow' },
      { label: 'Market Access Improved', value: '18', icon: 'TrendingUp', trend: '+6', color: 'orange' },
      { label: 'Policy Recommendations', value: '24', icon: 'FileText', trend: '+8', color: 'red' }
    ],
    impactStories: [
      {
        title: 'Fisher Livelihood Enhancement',
        description: 'Value chain interventions increased average fisher income by 32% over 2 years.',
        metrics: { before: 45000, after: 59400, unit: 'LKR/month', improvement: '+32%' },
        year: 2024
      },
      {
        title: 'Women Empowerment in Fisheries',
        description: 'Gender-focused programs increased women participation in value addition by 58%.',
        metrics: { before: 28, after: 44, unit: '% participation', improvement: '+58%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 18 },
        { year: 2021, count: 22 },
        { year: 2022, count: 26 },
        { year: 2023, count: 30 },
        { year: 2024, count: 35 }
      ],
      citations: 720,
      hIndex: 18
    },
    economicImpact: {
      valueGenerated: 'USD 1.5M',
      jobsCreated: 280,
      householdsBenefited: 2500
    },
    partnerships: [
      'USAID', 'World Bank', 'ILO', 'FAO', 'Local NGOs'
    ]
  },

  'fishing-technology': {
    keyMetrics: [
      { label: 'Gear Innovations', value: '18', icon: 'Wrench', trend: '+6', color: 'indigo' },
      { label: 'Fuel Efficiency Improved', value: '28%', icon: 'TrendingDown', trend: '+12%', color: 'violet' },
      { label: 'Bycatch Reduced', value: '45%', icon: 'Shield', trend: '-18%', color: 'purple' },
      { label: 'Vessels Upgraded', value: '350', icon: 'Ship', trend: '+85', color: 'blue' }
    ],
    impactStories: [
      {
        title: 'Fuel-Efficient Fishing Vessels',
        description: 'New vessel designs and propulsion systems reduced fuel consumption by 28% across 350 fishing boats.',
        metrics: { before: 45, after: 32.4, unit: 'liters/trip', improvement: '-28%' },
        year: 2024
      },
      {
        title: 'Selective Fishing Gear',
        description: 'Implementation of improved fishing gear technology reduced unwanted bycatch by 45%.',
        metrics: { before: 22, after: 12, unit: '% bycatch', improvement: '-45%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 16 },
        { year: 2021, count: 20 },
        { year: 2022, count: 24 },
        { year: 2023, count: 28 },
        { year: 2024, count: 32 }
      ],
      citations: 620,
      hIndex: 17
    },
    economicImpact: {
      valueGenerated: 'USD 3.8M',
      jobsCreated: 145,
      vesselsUpgraded: 350
    },
    partnerships: [
      'FAO', 'Private Sector Partners', 'Boat Builders Association', 'Fishing Cooperatives', 'Universities'
    ]
  },

  'hydrography': {
    keyMetrics: [
      { label: 'Nautical Charts Updated', value: '45', icon: 'Map', trend: '+12', color: 'blue' },
      { label: 'Vessels Served Annually', value: '8,500+', icon: 'Ship', trend: '+850', color: 'cyan' },
      { label: 'Monitoring Stations', value: '12', icon: 'Radio', trend: '+3', color: 'indigo' },
      { label: 'Safety Incidents Reduced', value: '38%', icon: 'Shield', trend: '-15%', color: 'green' }
    ],
    impactStories: [
      {
        title: 'Maritime Safety Enhancement',
        description: 'Updated charts and monitoring systems reduced maritime incidents by 38% in 3 years.',
        metrics: { before: 124, after: 77, unit: 'incidents', improvement: '-38%' },
        year: 2024
      },
      {
        title: 'Early Warning System',
        description: 'Real-time ocean monitoring provided 95% accurate weather warnings, saving 200+ lives.',
        metrics: { before: 72, after: 95, unit: '% accuracy', improvement: '+32%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 15 },
        { year: 2021, count: 18 },
        { year: 2022, count: 22 },
        { year: 2023, count: 26 },
        { year: 2024, count: 30 }
      ],
      citations: 580,
      hIndex: 16
    },
    economicImpact: {
      valueGenerated: 'USD 4.5M',
      jobsCreated: 95,
      vesselsSafeguarded: 8500
    },
    partnerships: [
      'IMO', 'NOAA', 'IHO', 'Sri Lanka Navy', 'Ports Authority'
    ]
  },

  'quality-assurance': {
    keyMetrics: [
      { label: 'Post-Harvest Losses Reduced', value: '55%', icon: 'TrendingDown', trend: '-20%', color: 'green' },
      { label: 'Cold Storage Facilities', value: '28', icon: 'Snowflake', trend: '+8', color: 'blue' },
      { label: 'Quality Standards Certified', value: '95%', icon: 'Award', trend: '+15%', color: 'emerald' },
      { label: 'Export Value Increased', value: '42%', icon: 'DollarSign', trend: '+12%', color: 'teal' }
    ],
    impactStories: [
      {
        title: 'Cold Chain Revolution',
        description: 'Improved cold chain infrastructure reduced post-harvest losses from 25% to 11%.',
        metrics: { before: 25, after: 11, unit: '% loss', improvement: '-56%' },
        year: 2024
      },
      {
        title: 'Export Quality Enhancement',
        description: 'HACCP certification program increased export-grade fish from 62% to 95%.',
        metrics: { before: 62, after: 95, unit: '% grade-A', improvement: '+53%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 12 },
        { year: 2021, count: 16 },
        { year: 2022, count: 20 },
        { year: 2023, count: 24 },
        { year: 2024, count: 28 }
      ],
      citations: 450,
      hIndex: 14
    },
    economicImpact: {
      valueGenerated: 'USD 5.8M',
      jobsCreated: 320,
      processingUnitsImproved: 45
    },
    partnerships: [
      'ADB', 'Export Development Board', 'EU', 'Private Sector', 'Industry Associations'
    ]
  },

  'information-outreach': {
    keyMetrics: [
      { label: 'Researchers Trained', value: '450+', icon: 'GraduationCap', trend: '+120', color: 'pink' },
      { label: 'Workshops Conducted', value: '85', icon: 'Users', trend: '+22', color: 'rose' },
      { label: 'Research Grants Awarded', value: '32', icon: 'DollarSign', trend: '+10', color: 'red' },
      { label: 'Institutions Collaborated', value: '28', icon: 'Building', trend: '+8', color: 'purple' }
    ],
    impactStories: [
      {
        title: 'PhD Program Success',
        description: 'Capacity building program produced 24 PhD graduates in marine sciences in 3 years.',
        metrics: { before: 8, after: 32, unit: 'PhDs', improvement: '+300%' },
        year: 2024
      },
      {
        title: 'Research Excellence',
        description: 'Grant program funded 32 projects, resulting in 85 high-impact publications.',
        metrics: { before: 28, after: 85, unit: 'publications', improvement: '+204%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 48 },
        { year: 2021, count: 62 },
        { year: 2022, count: 78 },
        { year: 2023, count: 95 },
        { year: 2024, count: 112 }
      ],
      citations: 2250,
      hIndex: 38
    },
    economicImpact: {
      valueGenerated: 'USD 2.8M',
      jobsCreated: 180,
      professionalsUpskilled: 450
    },
    partnerships: [
      'NSF', 'UNESCO', 'Universities', 'International Research Institutes', 'Private Foundations'
    ]
  },

  'fishing-technology': {
    keyMetrics: [
      { label: 'Gear Innovations Developed', value: '18', icon: 'Wrench', trend: '+6', color: 'indigo' },
      { label: 'Fuel Efficiency Improved', value: '35%', icon: 'TrendingDown', trend: '+12%', color: 'violet' },
      { label: 'Bycatch Reduced', value: '52%', icon: 'Shield', trend: '-25%', color: 'purple' },
      { label: 'Vessels Upgraded', value: '420', icon: 'Ship', trend: '+95', color: 'blue' }
    ],
    impactStories: [
      {
        title: 'Acoustic Pinger Success',
        description: 'Deployment of 250 acoustic pingers reduced dolphin bycatch in gillnet fisheries by 65%, protecting over 400 dolphins annually.',
        metrics: { before: 620, after: 217, unit: 'dolphin deaths', improvement: '-65%' },
        year: 2024
      },
      {
        title: 'Fuel-Efficient Vessel Revolution',
        description: 'New hull designs and propulsion systems reduced fuel consumption by 35%, saving fishers USD 2.1M annually.',
        metrics: { before: 52, after: 33.8, unit: 'liters/trip', improvement: '-35%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 16 },
        { year: 2021, count: 20 },
        { year: 2022, count: 24 },
        { year: 2023, count: 28 },
        { year: 2024, count: 32 }
      ],
      citations: 650,
      hIndex: 18
    },
    economicImpact: {
      valueGenerated: 'USD 4.2M',
      jobsCreated: 165,
      fuelSavingsAnnual: 'USD 2.1M'
    },
    partnerships: [
      'FAO', 'WWF', 'Private Boat Builders', 'Fisher Cooperatives', 'Universities'
    ]
  },

  'inland-aquaculture': {
    keyMetrics: [
      { label: 'Farmers Trained', value: '1,350', icon: 'Users', trend: '+380', color: 'cyan' },
      { label: 'Production Increased', value: '48%', icon: 'TrendingUp', trend: '+15%', color: 'blue' },
      { label: 'New Species Introduced', value: '12', icon: 'Fish', trend: '+4', color: 'teal' },
      { label: 'Hatcheries Established', value: '8', icon: 'Building2', trend: '+3', color: 'sky' }
    ],
    impactStories: [
      {
        title: 'Biofloc Shrimp Farming Success',
        description: 'Biofloc technology adoption increased shrimp yields by 55% while reducing water usage by 90%.',
        metrics: { before: 3.2, after: 4.96, unit: 'kg/m³', improvement: '+55%' },
        year: 2024
      },
      {
        title: 'Ornamental Fish Export Growth',
        description: 'Improved breeding techniques boosted ornamental fish exports from USD 6M to USD 10.5M annually.',
        metrics: { before: 6.0, after: 10.5, unit: 'USD Million', improvement: '+75%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 22 },
        { year: 2021, count: 28 },
        { year: 2022, count: 34 },
        { year: 2023, count: 40 },
        { year: 2024, count: 46 }
      ],
      citations: 1050,
      hIndex: 23
    },
    economicImpact: {
      valueGenerated: 'USD 5.5M',
      jobsCreated: 520,
      farmsEstablished: 225
    },
    partnerships: [
      'WorldFish', 'FAO', 'Export Development Board', 'Private Hatcheries', 'Farmer Organizations'
    ]
  },

  'post-harvest': {
    keyMetrics: [
      { label: 'Facilities ISO Certified', value: '65', icon: 'Award', trend: '+22', color: 'purple' },
      { label: 'Post-Harvest Loss Reduced', value: '58%', icon: 'TrendingDown', trend: '-23%', color: 'violet' },
      { label: 'Export Value Increased', value: '45%', icon: 'DollarSign', trend: '+15%', color: 'fuchsia' },
      { label: 'Cold Storage Capacity', value: '3,500 MT', icon: 'Snowflake', trend: '+800 MT', color: 'blue' }
    ],
    impactStories: [
      {
        title: 'Cold Chain Infrastructure Impact',
        description: 'New ice plants and cold storage facilities reduced post-harvest losses from 28% to 12%, saving 4,200 tons of fish annually.',
        metrics: { before: 28, after: 12, unit: '% loss', improvement: '-57%' },
        year: 2024
      },
      {
        title: 'ISO 17025 Accreditation Success',
        description: 'Laboratory testing capacity increased to 600 samples/month, supporting USD 85M seafood export industry.',
        metrics: { before: 250, after: 600, unit: 'samples/month', improvement: '+140%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 14 },
        { year: 2021, count: 18 },
        { year: 2022, count: 22 },
        { year: 2023, count: 26 },
        { year: 2024, count: 30 }
      ],
      citations: 520,
      hIndex: 16
    },
    economicImpact: {
      valueGenerated: 'USD 6.8M',
      jobsCreated: 385,
      exportValueSupported: 'USD 85M'
    },
    partnerships: [
      'ADB', 'EU', 'Export Development Board', 'Seafood Processors', 'Quality Certification Bodies'
    ]
  },

  'marine-biology': {
    keyMetrics: [
      { label: 'Species Monitored', value: '215', icon: 'Fish', trend: '+35', color: 'teal' },
      { label: 'Coral Fragments Planted', value: '15,800', icon: 'Leaf', trend: '+6200', color: 'emerald' },
      { label: 'Turtle Nests Protected', value: '580', icon: 'Shield', trend: '+120', color: 'green' },
      { label: 'Whale Strandings Responded', value: '165', icon: 'HeartPulse', trend: '+35', color: 'cyan' }
    ],
    impactStories: [
      {
        title: 'Blue Whale Population Monitoring',
        description: 'Satellite tagging of 28 blue whales revealed migration patterns and critical habitats, leading to ship speed reduction zone establishment.',
        metrics: { before: 15, after: 28, unit: 'whales tagged', improvement: '+87%' },
        year: 2024
      },
      {
        title: 'Coral Reef Restoration Success',
        description: 'Restored coral reefs at Hikkaduwa and Pigeon Island showed 72% survival rate with 28% increase in fish diversity.',
        metrics: { before: 52, after: 67, unit: 'fish species', improvement: '+29%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 38 },
        { year: 2021, count: 46 },
        { year: 2022, count: 54 },
        { year: 2023, count: 62 },
        { year: 2024, count: 70 }
      ],
      citations: 2150,
      hIndex: 34
    },
    economicImpact: {
      valueGenerated: 'USD 3.2M',
      jobsCreated: 120,
      ecotourismValue: 'USD 8.5M'
    },
    partnerships: [
      'National Geographic', 'IUCN', 'WWF', 'Blue Whale Study', 'Coral Reef Alliance'
    ]
  },

  'oceanography': {
    keyMetrics: [
      { label: 'Ocean Cruises Conducted', value: '45', icon: 'Ship', trend: '+12', color: 'blue' },
      { label: 'Data Points Collected', value: '2.5M', icon: 'Database', trend: '+800K', color: 'indigo' },
      { label: 'Climate Models Developed', value: '8', icon: 'CloudRain', trend: '+3', color: 'cyan' },
      { label: 'Deep Sea Discoveries', value: '28', icon: 'Compass', trend: '+12', color: 'sky' }
    ],
    impactStories: [
      {
        title: 'Indian Ocean Climate Prediction',
        description: 'Ocean monitoring data improved monsoon prediction accuracy from 68% to 88%, benefiting agriculture and fisheries planning.',
        metrics: { before: 68, after: 88, unit: '% accuracy', improvement: '+29%' },
        year: 2024
      },
      {
        title: 'Deep Sea Biodiversity Discovery',
        description: 'ROV expeditions discovered 28 potentially new species in deep sea trenches around Sri Lanka.',
        metrics: { before: 0, after: 28, unit: 'new species', improvement: 'NEW' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 32 },
        { year: 2021, count: 38 },
        { year: 2022, count: 44 },
        { year: 2023, count: 52 },
        { year: 2024, count: 58 }
      ],
      citations: 1680,
      hIndex: 30
    },
    economicImpact: {
      valueGenerated: 'USD 2.8M',
      jobsCreated: 95,
      dataValueToSector: 'USD 12M'
    },
    partnerships: [
      'NOAA', 'IOC-UNESCO', 'Schmidt Ocean Institute', 'GEBCO', 'Regional Universities'
    ]
  },

  'hydrography': {
    keyMetrics: [
      { label: 'Nautical Charts Produced', value: '52', icon: 'Map', trend: '+15', color: 'sky' },
      { label: 'Vessels Served Annually', value: '9,800', icon: 'Ship', trend: '+1200', color: 'blue' },
      { label: 'Safety Incidents Prevented', value: '45%', icon: 'Shield', trend: '-18%', color: 'green' },
      { label: 'Seafloor Mapped', value: '58,000 km²', icon: 'Layers', trend: '+12000', color: 'cyan' }
    ],
    impactStories: [
      {
        title: 'Maritime Safety Revolution',
        description: 'Updated electronic navigational charts and real-time monitoring reduced maritime accidents by 45% in Sri Lankan waters.',
        metrics: { before: 156, after: 86, unit: 'accidents/year', improvement: '-45%' },
        year: 2024
      },
      {
        title: 'Seabed 2030 Contribution',
        description: 'Multi-beam surveys mapped 58,000 km² of seafloor, contributing 12% to global ocean mapping initiative.',
        metrics: { before: 28000, after: 58000, unit: 'km² mapped', improvement: '+107%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 18 },
        { year: 2021, count: 22 },
        { year: 2022, count: 26 },
        { year: 2023, count: 30 },
        { year: 2024, count: 34 }
      ],
      citations: 680,
      hIndex: 19
    },
    economicImpact: {
      valueGenerated: 'USD 5.5M',
      jobsCreated: 110,
      maritimeTradeSupported: 'USD 2.8B'
    },
    partnerships: [
      'IMO', 'IHO', 'NOAA', 'Sri Lanka Navy', 'Ports Authority', 'GEBCO'
    ]
  },

  'socio-economics': {
    keyMetrics: [
      { label: 'Fisher Households Surveyed', value: '3,200', icon: 'Users', trend: '+800', color: 'orange' },
      { label: 'Income Increase Achieved', value: '38%', icon: 'TrendingUp', trend: '+12%', color: 'amber' },
      { label: 'Policy Recommendations', value: '32', icon: 'FileText', trend: '+10', color: 'yellow' },
      { label: 'Market Linkages Created', value: '24', icon: 'Link', trend: '+8', color: 'red' }
    ],
    impactStories: [
      {
        title: 'Fisher Livelihood Transformation',
        description: 'Value chain interventions and market linkages increased average fisher household income by 38% over 3 years.',
        metrics: { before: 42000, after: 57960, unit: 'LKR/month', improvement: '+38%' },
        year: 2024
      },
      {
        title: 'Gender Inclusion Success',
        description: 'Women empowerment programs increased female participation in seafood value addition from 28% to 62%.',
        metrics: { before: 28, after: 62, unit: '% women in value chain', improvement: '+121%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 20 },
        { year: 2021, count: 24 },
        { year: 2022, count: 28 },
        { year: 2023, count: 34 },
        { year: 2024, count: 40 }
      ],
      citations: 780,
      hIndex: 20
    },
    economicImpact: {
      valueGenerated: 'USD 2.5M',
      jobsCreated: 340,
      householdsBenefited: 3200
    },
    partnerships: [
      'USAID', 'World Bank', 'ILO', 'FAO', 'UN Women', 'Local NGOs'
    ]
  },

  'monitoring-evaluation': {
    keyMetrics: [
      { label: 'Projects Monitored', value: '85', icon: 'FolderKanban', trend: '+22', color: 'violet' },
      { label: 'Performance Reports', value: '48', icon: 'FileBarChart', trend: '+15', color: 'purple' },
      { label: 'Quality Audits Conducted', value: '32', icon: 'CheckCircle', trend: '+10', color: 'fuchsia' },
      { label: 'Data Systems Integrated', value: '12', icon: 'Database', trend: '+5', color: 'indigo' }
    ],
    impactStories: [
      {
        title: 'Research Performance Improvement',
        description: 'M&E framework implementation increased research output quality score from 72% to 91% across all divisions.',
        metrics: { before: 72, after: 91, unit: '% quality score', improvement: '+26%' },
        year: 2024
      },
      {
        title: 'ISO 17025 Laboratory Network',
        description: 'Quality management system implementation achieved ISO 17025 accreditation for 6 NARA laboratories.',
        metrics: { before: 2, after: 6, unit: 'accredited labs', improvement: '+200%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 12 },
        { year: 2021, count: 16 },
        { year: 2022, count: 20 },
        { year: 2023, count: 24 },
        { year: 2024, count: 28 }
      ],
      citations: 420,
      hIndex: 14
    },
    economicImpact: {
      valueGenerated: 'USD 1.8M',
      jobsCreated: 75,
      institutionalEfficiencyGain: '35%'
    },
    partnerships: [
      'NSF', 'Quality Certification Bodies', 'International Auditors', 'Government Ministries'
    ]
  },

  'aquaculture-center': {
    keyMetrics: [
      { label: 'Farmers Trained Annually', value: '850', icon: 'GraduationCap', trend: '+220', color: 'emerald' },
      { label: 'Demonstration Farms', value: '12', icon: 'Home', trend: '+4', color: 'green' },
      { label: 'Technology Packages', value: '15', icon: 'Package', trend: '+6', color: 'teal' },
      { label: 'Extension Reach', value: '25 Districts', icon: 'MapPin', trend: '+8', color: 'cyan' }
    ],
    impactStories: [
      {
        title: 'Farmer Capacity Building Success',
        description: 'Comprehensive training programs equipped 850 farmers annually with modern aquaculture techniques, increasing average farm productivity by 42%.',
        metrics: { before: 2.8, after: 3.98, unit: 'tons/ha/year', improvement: '+42%' },
        year: 2024
      },
      {
        title: 'Climate-Smart Aquaculture',
        description: 'Introduction of climate-resilient practices helped 320 farmers adapt to changing conditions, maintaining production during 2023 drought.',
        metrics: { before: 45, after: 88, unit: '% climate-resilient', improvement: '+96%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 16 },
        { year: 2021, count: 20 },
        { year: 2022, count: 24 },
        { year: 2023, count: 28 },
        { year: 2024, count: 32 }
      ],
      citations: 680,
      hIndex: 18
    },
    economicImpact: {
      valueGenerated: 'USD 4.2M',
      jobsCreated: 420,
      farmersEmpowered: 850
    },
    partnerships: [
      'FAO', 'WorldFish', 'CGIAR', 'Farmer Organizations', 'Extension Services'
    ]
  },

  'environmental-monitoring': {
    keyMetrics: [
      { label: 'Reservoirs Monitored', value: '22', icon: 'Droplets', trend: '+7', color: 'cyan' },
      { label: 'Water Quality Improved', value: '68%', icon: 'TrendingUp', trend: '+18%', color: 'blue' },
      { label: 'Endemic Species Protected', value: '15', icon: 'Fish', trend: '+5', color: 'teal' },
      { label: 'Communities Benefited', value: '45,000+', icon: 'Users', trend: '+12000', color: 'sky' }
    ],
    impactStories: [
      {
        title: 'Reservoir Water Quality',
        description: 'Monitoring and management interventions improved water quality index by 68% in key reservoirs.',
        metrics: { before: 58, after: 97, unit: 'WQI score', improvement: '+67%' },
        year: 2024
      },
      {
        title: 'Endemic Fish Conservation',
        description: 'Habitat restoration increased endangered species populations by 42% over 3 years.',
        metrics: { before: 1200, after: 1704, unit: 'individuals', improvement: '+42%' },
        year: 2023
      }
    ],
    researchOutput: {
      publications: [
        { year: 2020, count: 14 },
        { year: 2021, count: 18 },
        { year: 2022, count: 22 },
        { year: 2023, count: 28 },
        { year: 2024, count: 32 }
      ],
      citations: 520,
      hIndex: 15
    },
    economicImpact: {
      valueGenerated: 'USD 1.2M',
      jobsCreated: 65,
      waterBodiesImproved: 22
    },
    partnerships: [
      'Water Board', 'Environmental Ministry', 'IUCN', 'Universities', 'Local Communities'
    ]
  }
};

export const getDefaultImpact = (divisionId) => {
  return DIVISION_IMPACT[divisionId] || null;
};

export default DIVISION_IMPACT;
