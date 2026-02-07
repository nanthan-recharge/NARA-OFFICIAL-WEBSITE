/**
 * Division Projects Data - Active and Past Projects for ALL 10 Divisions
 * Comprehensive project details with timelines, budgets, and progress
 */

export const DIVISION_PROJECTS = {
  'environmental-studies': [
    {
      title: { en: 'Coastal Water Quality Monitoring Program', si: 'වෙරළ ජල ගුණාත්මක නිරීක්ෂණ වැඩසටහන', ta: 'கடலோர நீர் தர கண்காணிப்பு திட்டம்' },
      description: { en: 'Continuous monitoring of coastal water quality parameters including pH, salinity, dissolved oxygen, and nutrient levels across 25 monitoring stations' },
      status: 'Active',
      startDate: '2022-01-01',
      endDate: '2026-12-31',
      budget: 'USD 550,000',
      fundingSource: 'Ministry of Environment',
      teamSize: 8,
      progress: 62,
      category: 'Monitoring',
      outputs: ['Monthly water quality reports', '12 research publications', 'Online data portal']
    },
    {
      title: { en: 'Marine Pollution Impact Assessment', si: 'සමුද්‍ර දූෂණ බලපෑම් තක්සේරුව', ta: 'கடல் மாசு தாக்க மதிப்பீடு' },
      description: { en: 'Assessment of plastic pollution, heavy metal contamination, and oil spill impacts on marine ecosystems' },
      status: 'Active',
      startDate: '2023-06-01',
      endDate: '2025-05-31',
      budget: 'USD 380,000',
      fundingSource: 'UNEP',
      teamSize: 6,
      progress: 48,
      category: 'Research',
      outputs: ['Pollution baseline database', 'Policy recommendations', 'Public awareness campaigns']
    },
    {
      title: { en: 'Climate Change Vulnerability Assessment', si: 'දේශගුණ විපර්යාස අවදානම් තක්සේරුව', ta: 'காலநிலை மாற்ற பாதிப்பு மதிப்பீடு' },
      description: { en: 'Analysis of climate change impacts on coastal ecosystems including coral reefs, mangroves, and seagrass beds' },
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      budget: 'USD 620,000',
      fundingSource: 'GCF',
      teamSize: 10,
      progress: 28,
      category: 'Climate Research',
      outputs: ['Vulnerability maps', 'Adaptation strategies', 'Climate models']
    },
    {
      title: { en: 'Harmful Algal Bloom Early Warning System', si: 'හානිකර ඇල්ගී පිපීම් පූර්ව අනතුරු ඇඟවීමේ පද්ධතිය', ta: 'தீங்கு விளைவிக்கும் பாசி பூக்கும் முன்னெச்சரிக்கை அமைப்பு' },
      description: { en: 'Development of real-time monitoring and prediction system for harmful algal blooms in coastal waters' },
      status: 'Active',
      startDate: '2023-09-01',
      endDate: '2025-08-31',
      budget: 'USD 420,000',
      fundingSource: 'IOC-UNESCO',
      teamSize: 7,
      progress: 55,
      category: 'Technology',
      outputs: ['Mobile app', 'Alert system', 'Satellite imagery analysis']
    }
  ],

  'fishing-technology': [
    {
      title: { en: 'Eco-Friendly Fishing Gear Development', si: 'පරිසර හිතකාමී මසුන් ඇල්ලීමේ උපකරණ සංවර්ධනය', ta: 'சுற்றுச்சூழல் நட்பு மீன்பிடி கருவி மேம்பாடு' },
      description: { en: 'Design and testing of selective fishing gear including LED lights, escape panels, and biodegradable materials to reduce bycatch by 40%' },
      status: 'Active',
      startDate: '2023-05-01',
      endDate: '2025-12-31',
      budget: 'USD 485,000',
      fundingSource: 'FAO & WWF',
      teamSize: 9,
      progress: 68,
      category: 'Innovation',
      outputs: ['5 gear prototypes', 'Sea trials completed', 'Training manuals']
    },
    {
      title: { en: 'Fuel-Efficient Vessel Design Program', si: 'ඉන්ධන කාර්යක්ෂම යාත්‍රා නිර්මාණ වැඩසටහන', ta: 'எரிபொருள் திறனுள்ள கப்பல் வடிவமைப்பு திட்டம்' },
      description: { en: 'Innovation in boat hull design, propulsion systems, and fishing operations to achieve 35% fuel savings' },
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2026-06-30',
      budget: 'USD 750,000',
      fundingSource: 'ADB & Private Sector',
      teamSize: 8,
      progress: 42,
      category: 'Vessel Technology',
      outputs: ['3 prototype vessels', 'Fuel efficiency database', 'Design blueprints']
    },
    {
      title: { en: 'Acoustic Pinger Development for Dolphin Protection', si: 'ඩොල්ෆින් ආරක්ෂණය සඳහා ශබ්ද යන්ත්‍ර සංවර්ධනය', ta: 'டால்பின் பாதுகாப்புக்கான ஒலி சாதன மேம்பாடு' },
      description: { en: 'Development and testing of acoustic deterrent devices to reduce dolphin bycatch in gillnet fisheries' },
      status: 'Active',
      startDate: '2022-08-01',
      endDate: '2025-07-31',
      budget: 'USD 320,000',
      fundingSource: 'NOAA',
      teamSize: 5,
      progress: 78,
      category: 'Bycatch Reduction',
      outputs: ['200 pingers deployed', '65% bycatch reduction', 'Best practices guide']
    },
    {
      title: { en: 'Smart Fishing Technology Integration', si: 'ස්මාර්ට් මසුන් ඇල්ලීමේ තාක්ෂණ ඒකාබද්ධ කිරීම', ta: 'ஸ்மார்ட் மீன்பிடி தொழில்நுட்ப ஒருங்கிணைப்பு' },
      description: { en: 'Integration of GPS, sonar, and IoT sensors for real-time fish finding and sustainable catch monitoring' },
      status: 'Active',
      startDate: '2024-03-01',
      endDate: '2026-02-28',
      budget: 'USD 580,000',
      fundingSource: 'Government & Tech Partners',
      teamSize: 10,
      progress: 35,
      category: 'Digital Technology',
      outputs: ['Mobile platform', 'IoT device network', 'Data analytics dashboard']
    }
  ],

  'inland-aquaculture': [
    {
      title: { en: 'Sustainable Shrimp Farming with Biofloc Technology', si: 'බයෝෆ්ලොක් තාක්ෂණය සමඟ තිරසාර ඉස්සන් ගොවිතැන', ta: 'பயோஃப்ளாக் தொழில்நுட்பத்துடன் நிலையான இறால் வளர்ப்பு' },
      description: { en: 'Implementation of zero water exchange biofloc systems for intensive shrimp farming with 50% higher yields' },
      status: 'Active',
      startDate: '2023-03-01',
      endDate: '2026-02-28',
      budget: 'USD 680,000',
      fundingSource: 'FAO & WorldFish',
      teamSize: 12,
      progress: 58,
      category: 'Aquaculture Technology',
      outputs: ['5 demonstration farms', 'Training of 200 farmers', 'Technical manual']
    },
    {
      title: { en: 'Tilapia Genetic Improvement Program', si: 'තිලාපියා ජානමය වැඩිදියුණු කිරීමේ වැඩසටහන', ta: 'திலாபியா மரபணு மேம்பாடு திட்டம்' },
      description: { en: 'Selective breeding for fast-growing, disease-resistant tilapia strains with improved feed conversion ratio' },
      status: 'Active',
      startDate: '2022-01-01',
      endDate: '2027-12-31',
      budget: 'USD 850,000',
      fundingSource: 'WorldFish & CGIAR',
      teamSize: 15,
      progress: 48,
      category: 'Breeding',
      outputs: ['3 improved strains', 'Broodstock distribution', 'Genetic database']
    },
    {
      title: { en: 'Ornamental Fish Export Quality Enhancement', si: 'විසිතුරු මත්ස්‍ය අපනයන ගුණාත්මකභාවය වැඩිදියුණු කිරීම', ta: 'அலங்கார மீன் ஏற்றுமதி தர மேம்பாடு' },
      description: { en: 'Development of breeding techniques and quality standards for high-value ornamental fish species' },
      status: 'Active',
      startDate: '2023-07-01',
      endDate: '2025-06-30',
      budget: 'USD 380,000',
      fundingSource: 'Export Development Board',
      teamSize: 8,
      progress: 65,
      category: 'Export Development',
      outputs: ['Quality certification system', '15 species protocols', 'Export guidelines']
    },
    {
      title: { en: 'Seaweed Cultivation Technology Transfer', si: 'මුහුදු පැලෑටි වගා තාක්ෂණ මාරු කිරීම', ta: 'கடல்பாசி சாகுபடி தொழில்நுட்ப பரிமாற்றம்' },
      description: { en: 'Introduction of commercial seaweed farming for food, cosmetics, and pharmaceutical applications' },
      status: 'Active',
      startDate: '2024-02-01',
      endDate: '2026-01-31',
      budget: 'USD 420,000',
      fundingSource: 'USAID',
      teamSize: 6,
      progress: 32,
      category: 'Mariculture',
      outputs: ['Pilot farms established', 'Processing facility', 'Market linkages']
    },
    {
      title: { en: 'Freshwater Prawn Hatchery Development', si: 'මිරිදිය ඉස්සන් පැටවුන් මධ්‍යස්ථාන සංවර්ධනය', ta: 'நன்னீர் இறால் குஞ்சு பொரிப்பகம் மேம்பாடு' },
      description: { en: 'Establishment of advanced hatchery technology for Macrobrachium rosenbergii seed production' },
      status: 'Active',
      startDate: '2023-11-01',
      endDate: '2025-10-31',
      budget: 'USD 520,000',
      fundingSource: 'Government',
      teamSize: 9,
      progress: 52,
      category: 'Hatchery',
      outputs: ['Hatchery facility', '5 million seeds/year', 'Training center']
    }
  ],

  'post-harvest': [
    {
      title: { en: 'Cold Chain Infrastructure Development', si: 'සීතල දාම යටිතල පහසුකම් සංවර්ධනය', ta: 'குளிர் சங்கிலி உள்கட்டமைப்பு மேம்பாடு' },
      description: { en: 'Establishment of ice plants, cold storage facilities, and refrigerated transport at 15 major landing sites' },
      status: 'Active',
      startDate: '2023-04-01',
      endDate: '2026-03-31',
      budget: 'USD 2,850,000',
      fundingSource: 'ADB & Government',
      teamSize: 12,
      progress: 58,
      category: 'Infrastructure',
      outputs: ['15 ice plants', '8 cold storages', '25 refrigerated vehicles']
    },
    {
      title: { en: 'Fish Quality Assurance & Certification System', si: 'මාළු ගුණාත්මක සහතික කිරීමේ පද්ධතිය', ta: 'மீன் தர உத்தரவாத சான்றிதழ் அமைப்பு' },
      description: { en: 'Implementation of HACCP, ISO 22000, and export quality certification programs for seafood processors' },
      status: 'Active',
      startDate: '2022-06-01',
      endDate: '2025-05-31',
      budget: 'USD 450,000',
      fundingSource: 'EU & Government',
      teamSize: 10,
      progress: 72,
      category: 'Quality Standards',
      outputs: ['50 certified facilities', 'Quality manual', 'Audit system']
    },
    {
      title: { en: 'Value Addition & Product Development', si: 'වටිනාකම් එකතු කිරීම සහ නිෂ්පාදන සංවර්ධනය', ta: 'மதிப்பு கூட்டல் & தயாரிப்பு மேம்பாடு' },
      description: { en: 'Development of ready-to-eat, ready-to-cook, and functional food products from underutilized fish species' },
      status: 'Active',
      startDate: '2023-09-01',
      endDate: '2025-08-31',
      budget: 'USD 380,000',
      fundingSource: 'Private Sector Partnership',
      teamSize: 8,
      progress: 48,
      category: 'Product Innovation',
      outputs: ['12 new products', 'Shelf-life studies', 'Market testing']
    },
    {
      title: { en: 'Microbiological & Chemical Testing Laboratory Upgrade', si: 'ක්ෂුද්‍ර ජීව විද්‍යා සහ රසායනික පරීක්ෂණ රසායනාගාර වර්ධනය', ta: 'நுண்ணுயிரியல் & வேதியியல் சோதனை ஆய்வக மேம்படுத்தல்' },
      description: { en: 'Enhancement of testing capacity for microbiological contamination, histamine, and heavy metals' },
      status: 'Completed',
      startDate: '2021-01-01',
      endDate: '2024-12-31',
      budget: 'USD 680,000',
      fundingSource: 'Government',
      teamSize: 6,
      progress: 100,
      category: 'Laboratory',
      outputs: ['ISO 17025 accreditation', 'Advanced equipment', '500 samples/month capacity']
    }
  ],

  'marine-biology': [
    {
      title: { en: 'Blue Whale Migration & Behavior Study', si: 'නිල් තල්මසුන් සංක්‍රමණ සහ හැසිරීම් අධ්‍යයනය', ta: 'நீல திமிங்கலம் இடம்பெயர்வு & நடத்தை ஆய்வு' },
      description: { en: 'Satellite tagging, acoustic monitoring, and behavioral analysis of blue whale populations in Sri Lankan waters' },
      status: 'Active',
      startDate: '2021-01-15',
      endDate: '2026-01-14',
      budget: 'USD 920,000',
      fundingSource: 'National Geographic & NOAA',
      teamSize: 14,
      progress: 68,
      category: 'Marine Mammals',
      outputs: ['25 whales tagged', 'Migration maps', '15 research papers']
    },
    {
      title: { en: 'Coral Reef Restoration & Resilience', si: 'කොරල් පර ප්‍රතිසංස්කරණය සහ ප්‍රත්‍යස්ථතාව', ta: 'பவள பாறை மீட்பு & நெகிழ்வுத்தன்மை' },
      description: { en: 'Active coral gardening, transplantation, and resilience building at Hikkaduwa, Pigeon Island, and Bar Reef' },
      status: 'Active',
      startDate: '2023-07-01',
      endDate: '2027-06-30',
      budget: 'USD 580,000',
      fundingSource: 'GEF & Coral Reef Alliance',
      teamSize: 12,
      progress: 52,
      category: 'Restoration',
      outputs: ['10,000 coral fragments', '5 nursery sites', 'Monitoring protocol']
    },
    {
      title: { en: 'Sea Turtle Conservation & Nesting Monitoring', si: 'මුහුදු කැස්බෑ සංරක්ෂණ සහ කූඩු නිරීක්ෂණය', ta: 'கடல் ஆமை பாதுகாப்பு & கூடு கண்காணிப்பு' },
      description: { en: 'Island-wide monitoring of 5 sea turtle species across 35 key nesting beaches with community engagement' },
      status: 'Active',
      startDate: '2022-01-01',
      endDate: '2025-12-31',
      budget: 'USD 420,000',
      fundingSource: 'IUCN & WWF',
      teamSize: 15,
      progress: 78,
      category: 'Conservation',
      outputs: ['35 beach monitoring sites', 'Hatchery program', 'Community training']
    },
    {
      title: { en: 'Seagrass Ecosystem Assessment & Protection', si: 'මුහුදු තණකොළ පරිසර පද්ධති තක්සේරුව හා ආරක්ෂණය', ta: 'கடற்பாசி சுற்றுச்சூழல் மதிப்பீடு & பாதுகாப்பு' },
      description: { en: 'Mapping, health assessment, and conservation planning for critical seagrass habitats in lagoons' },
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      budget: 'USD 350,000',
      fundingSource: 'Blue Action Fund',
      teamSize: 8,
      progress: 35,
      category: 'Ecosystem',
      outputs: ['Habitat maps', 'Health indices', 'Management plans']
    },
    {
      title: { en: 'Marine Mammal Stranding Response Network', si: 'සමුද්‍ර ක්ෂීරපායින් ගොඩබෑම් ප්‍රතිචාර ජාලය', ta: 'கடல் பாலூட்டி சிக்கல் பதில் வலையமைப்பு' },
      description: { en: '24/7 emergency response system for whale and dolphin strandings with necropsy and data collection' },
      status: 'Active',
      startDate: '2020-01-01',
      endDate: '2025-12-31',
      budget: 'USD 280,000',
      fundingSource: 'Government',
      teamSize: 10,
      progress: 85,
      category: 'Emergency Response',
      outputs: ['Hotline operational', '150+ rescues', 'Necropsy database']
    }
  ],

  'oceanography': [
    {
      title: { en: 'Indian Ocean Climate Monitoring', si: 'ඉන්දියන් සාගර දේශගුණ නිරීක්ෂණය', ta: 'இந்தியப் பெருங்கடல் காலநிலை கண்காணிப்பு' },
      description: { en: 'Long-term monitoring of ocean temperature, salinity, currents, and climate variability patterns' },
      status: 'Active',
      startDate: '2022-01-01',
      endDate: '2027-12-31',
      budget: 'USD 1,250,000',
      fundingSource: 'IOC-UNESCO & NOAA',
      teamSize: 18,
      progress: 55,
      category: 'Climate Research',
      outputs: ['30 monitoring stations', 'Climate database', 'Prediction models']
    },
    {
      title: { en: 'Ocean Acidification Impact Study', si: 'සාගර ආම්ලීකරණ බලපෑම් අධ්‍යයනය', ta: 'கடல் அமிலமயமாக்கல் தாக்க ஆய்வு' },
      description: { en: 'Assessment of ocean acidification effects on coral reefs, shellfish, and marine food webs' },
      status: 'Active',
      startDate: '2023-06-01',
      endDate: '2026-05-31',
      budget: 'USD 480,000',
      fundingSource: 'NSF & IAEA',
      teamSize: 10,
      progress: 48,
      category: 'Ocean Chemistry',
      outputs: ['pH monitoring network', 'Biological impact studies', 'Policy brief']
    },
    {
      title: { en: 'Coastal Upwelling & Productivity Research', si: 'වෙරළ උඩුකිරීම සහ ඵලදායිතා පර්යේෂණය', ta: 'கடலோர மேலெழுச்சி & உற்பத்தித்திறன் ஆராய்ச்சி' },
      description: { en: 'Study of seasonal upwelling patterns and their influence on fish productivity and marine ecosystems' },
      status: 'Active',
      startDate: '2024-03-01',
      endDate: '2027-02-28',
      budget: 'USD 650,000',
      fundingSource: 'POGO & Sloan Foundation',
      teamSize: 12,
      progress: 28,
      category: 'Biological Oceanography',
      outputs: ['Upwelling forecasts', 'Productivity maps', 'Fisheries advisories']
    },
    {
      title: { en: 'Deep Sea Exploration & Biodiversity', si: 'ගැඹුරු මුහුදු ගවේෂණ සහ ජෛව විවිධත්වය', ta: 'ஆழ்கடல் ஆராய்ச்சி & பல்லுயிர்' },
      description: { en: 'ROV surveys and sampling of deep sea ecosystems and biodiversity hotspots around Sri Lanka' },
      status: 'Active',
      startDate: '2023-09-01',
      endDate: '2026-08-31',
      budget: 'USD 920,000',
      fundingSource: 'Schmidt Ocean Institute',
      teamSize: 15,
      progress: 42,
      category: 'Deep Sea Research',
      outputs: ['ROV expeditions', 'Species database', 'Habitat maps']
    }
  ],

  'hydrography': [
    {
      title: { en: 'Electronic Navigational Charts (ENC) Production', si: 'ඉලෙක්ට්‍රොනික යාත්‍රා සිතියම් (ENC) නිෂ්පාදනය', ta: 'மின்னணு வழிசெலுத்தல் வரைபடங்கள் (ENC) தயாரிப்பு' },
      description: { en: 'Comprehensive hydrographic surveys and production of S-57/S-100 standard nautical charts for Sri Lankan waters' },
      status: 'Active',
      startDate: '2022-07-01',
      endDate: '2027-06-30',
      budget: 'USD 3,200,000',
      fundingSource: 'IMO & IHO',
      teamSize: 22,
      progress: 52,
      category: 'Chart Production',
      outputs: ['45 ENC charts', 'Chart updates', 'S-100 compliance']
    },
    {
      title: { en: 'Multi-beam Bathymetric Survey', si: 'බහු කදම්බ ගැඹුරු මිතීමේ සමීක්ෂණය', ta: 'பல-கற்றை குளிர்நீர் ஆய்வு' },
      description: { en: 'High-resolution seafloor mapping using multi-beam sonar for navigation safety and resource management' },
      status: 'Active',
      startDate: '2023-01-01',
      endDate: '2026-12-31',
      budget: 'USD 2,850,000',
      fundingSource: 'GEBCO & Seabed 2030',
      teamSize: 18,
      progress: 48,
      category: 'Surveying',
      outputs: ['50,000 km² mapped', 'Depth database', 'Seabed features']
    },
    {
      title: { en: 'Tide Gauge & Sea Level Monitoring Network', si: 'උදම් මිනුම් සහ මුහුදු මට්ටම් නිරීක්ෂණ ජාලය', ta: 'அலை அளவி & கடல் மட்ட கண்காணிப்பு வலையமைப்பு' },
      description: { en: 'Installation and operation of automated tide gauges for sea level rise monitoring and tsunami warning' },
      status: 'Active',
      startDate: '2023-04-01',
      endDate: '2026-03-31',
      budget: 'USD 680,000',
      fundingSource: 'NOAA & Government',
      teamSize: 12,
      progress: 65,
      category: 'Monitoring',
      outputs: ['15 tide gauges', 'Real-time data portal', 'Sea level trends']
    },
    {
      title: { en: 'Harbor & Port Surveys', si: 'වරාය සහ තොටුපළ සමීක්ෂණ', ta: 'துறைமுகம் & துறைமுக ஆய்வுகள்' },
      description: { en: 'Detailed hydrographic surveys of commercial harbors for safe navigation and port development' },
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      budget: 'USD 1,100,000',
      fundingSource: 'Ports Authority',
      teamSize: 16,
      progress: 38,
      category: 'Commercial Surveys',
      outputs: ['12 harbors surveyed', 'Navigation charts', 'Dredging plans']
    }
  ],

  'socio-economics': [
    {
      title: { en: 'Fisher Livelihood & Climate Vulnerability Assessment', si: 'ධීවර ජීවනෝපාය සහ දේශගුණ අවදානම් තක්සේරුව', ta: 'மீனவர் வாழ்வாதார & காலநிலை பாதிப்பு மதிப்பீடு' },
      description: { en: 'Comprehensive socio-economic survey of 5,000 fisher households to assess climate change impacts and adaptive capacity' },
      status: 'Active',
      startDate: '2023-06-01',
      endDate: '2025-11-30',
      budget: 'USD 380,000',
      fundingSource: 'USAID & World Bank',
      teamSize: 12,
      progress: 62,
      category: 'Social Research',
      outputs: ['Household survey database', 'Vulnerability maps', 'Adaptation strategies']
    },
    {
      title: { en: 'Seafood Value Chain Analysis & Market Development', si: 'මුහුදු ආහාර වටිනා දාම විශ්ලේෂණය සහ වෙළඳපල සංවර්ධනය', ta: 'கடல் உணவு மதிப்பு சங்கிலி பகுப்பாய்வு & சந்தை மேம்பாடு' },
      description: { en: 'Analysis of seafood value chains to identify inefficiencies, value addition opportunities, and market linkages' },
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2026-06-30',
      budget: 'USD 420,000',
      fundingSource: 'FAO',
      teamSize: 8,
      progress: 35,
      category: 'Economics',
      outputs: ['Value chain maps', 'Market studies', 'Business development plans']
    },
    {
      title: { en: 'Gender & Social Inclusion in Fisheries', si: 'මත්ස්‍ය විද්‍යාවේ ස්ත්‍රී පුරුෂ සමානත්වය සහ සමාජ ඇතුළත් කිරීම', ta: 'மீன்வளத்தில் பாலின & சமூக உள்ளடக்கம்' },
      description: { en: 'Study of women\'s roles in fisheries and development of inclusive policies for equitable access to resources' },
      status: 'Active',
      startDate: '2023-09-01',
      endDate: '2025-08-31',
      budget: 'USD 280,000',
      fundingSource: 'UN Women & FAO',
      teamSize: 6,
      progress: 55,
      category: 'Social Development',
      outputs: ['Gender analysis report', 'Policy recommendations', 'Women empowerment program']
    },
    {
      title: { en: 'Fisheries Economic Performance Indicators', si: 'මත්ස්‍ය ආර්ථික කාර්ය සාධන දර්ශක', ta: 'மீன்வள பொருளாதார செயல்திறன் குறிகாட்டிகள்' },
      description: { en: 'Development of comprehensive economic indicators for fisheries sector monitoring and policy planning' },
      status: 'Active',
      startDate: '2022-01-01',
      endDate: '2025-12-31',
      budget: 'USD 320,000',
      fundingSource: 'Government',
      teamSize: 7,
      progress: 72,
      category: 'Economics',
      outputs: ['Indicator framework', 'Annual reports', 'Dashboard system']
    }
  ],

  'monitoring-evaluation': [
    {
      title: { en: 'NARA Research Performance Monitoring System', si: 'NARA පර්යේෂණ කාර්ය සාධන නිරීක්ෂණ පද්ධතිය', ta: 'NARA ஆராய்ச்சி செயல்திறன் கண்காணிப்பு அமைப்பு' },
      description: { en: 'Development of comprehensive M&E framework to track research outputs, publications, and impact across all divisions' },
      status: 'Active',
      startDate: '2023-01-01',
      endDate: '2025-12-31',
      budget: 'USD 420,000',
      fundingSource: 'Government',
      teamSize: 10,
      progress: 65,
      category: 'Performance Monitoring',
      outputs: ['M&E framework', 'Online dashboard', 'Annual performance reports']
    },
    {
      title: { en: 'Project Impact Assessment & Evaluation', si: 'ව්‍යාපෘති බලපෑම් තක්සේරුව සහ ඇගයීම', ta: 'திட்ட தாக்க மதிப்பீடு & மதிப்பீடு' },
      description: { en: 'Independent evaluation of major research projects to assess scientific, economic, and social impacts' },
      status: 'Active',
      startDate: '2023-07-01',
      endDate: '2026-06-30',
      budget: 'USD 350,000',
      fundingSource: 'NSF',
      teamSize: 8,
      progress: 48,
      category: 'Impact Assessment',
      outputs: ['Impact evaluation reports', 'Success stories', 'Lessons learned']
    },
    {
      title: { en: 'Quality Assurance & Laboratory Accreditation', si: 'ගුණාත්මක සහතික කිරීම සහ රසායනාගාර අනුමැතිය', ta: 'தர உத்தரவாதம் & ஆய்வக அங்கீகாரம்' },
      description: { en: 'Implementation of ISO 17025 quality management systems across NARA laboratories' },
      status: 'Active',
      startDate: '2022-06-01',
      endDate: '2025-05-31',
      budget: 'USD 280,000',
      fundingSource: 'Government',
      teamSize: 6,
      progress: 78,
      category: 'Quality Management',
      outputs: ['ISO 17025 certification', 'Quality manual', 'Audit system']
    },
    {
      title: { en: 'Data Management & Digital Transformation', si: 'දත්ත කළමනාකරණ සහ ඩිජිටල් පරිවර්තනය', ta: 'தரவு மேலாண்மை & டிஜிட்டல் மாற்றம்' },
      description: { en: 'Development of integrated data management platform for research data, publications, and institutional knowledge' },
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      budget: 'USD 520,000',
      fundingSource: 'Government & Tech Partners',
      teamSize: 12,
      progress: 35,
      category: 'Digital Systems',
      outputs: ['Data repository', 'Publication database', 'Knowledge portal']
    }
  ],

  'aquaculture-center': [
    {
      title: { en: 'Aquaculture Training & Capacity Building', si: 'ජලජ වගා පුහුණුව සහ ධාරිතා ගොඩනැගීම', ta: 'மீன் வளர்ப்பு பயிற்சி & திறன் வளர்ப்பு' },
      description: { en: 'Comprehensive training programs for farmers, entrepreneurs, and extension officers in modern aquaculture techniques' },
      status: 'Active',
      startDate: '2022-01-01',
      endDate: '2026-12-31',
      budget: 'USD 680,000',
      fundingSource: 'Government & FAO',
      teamSize: 15,
      progress: 68,
      category: 'Capacity Building',
      outputs: ['1,200 farmers trained', '50 extension officers', 'Training manuals']
    },
    {
      title: { en: 'Demonstration Farm Network', si: 'ප්‍රදර්ශන ගොවිපල ජාලය', ta: 'ஆர்ப்பாட்ட பண்ணை வலையமைப்பு' },
      description: { en: 'Establishment of 12 demonstration farms showcasing best practices in shrimp, tilapia, and ornamental fish culture' },
      status: 'Active',
      startDate: '2023-04-01',
      endDate: '2026-03-31',
      budget: 'USD 920,000',
      fundingSource: 'WorldFish & Private Sector',
      teamSize: 18,
      progress: 55,
      category: 'Extension',
      outputs: ['12 demo farms', 'Field days conducted', 'Technology showcases']
    },
    {
      title: { en: 'Aquaculture Feed Development & Testing', si: 'ජලජ වගා ආහාර සංවර්ධනය සහ පරීක්ෂණය', ta: 'மீன் வளர்ப்பு தீவன மேம்பாடு & சோதனை' },
      description: { en: 'Development of cost-effective, locally-sourced aquaculture feeds with improved nutritional value' },
      status: 'Active',
      startDate: '2023-09-01',
      endDate: '2025-08-31',
      budget: 'USD 380,000',
      fundingSource: 'CGIAR',
      teamSize: 8,
      progress: 52,
      category: 'Feed Technology',
      outputs: ['5 feed formulations', 'Cost reduction analysis', 'Feeding trials']
    },
    {
      title: { en: 'Aquatic Animal Health & Disease Management', si: 'ජලජ සත්ව සෞඛ්‍ය සහ රෝග කළමනාකරණය', ta: 'நீர்வள விலங்கு சுகாதாரம் & நோய் மேலாண்மை' },
      description: { en: 'Diagnostic services, disease surveillance, and biosecurity protocols for aquaculture farms' },
      status: 'Active',
      startDate: '2024-02-01',
      endDate: '2027-01-31',
      budget: 'USD 450,000',
      fundingSource: 'Government',
      teamSize: 10,
      progress: 32,
      category: 'Animal Health',
      outputs: ['Diagnostic lab', 'Disease monitoring', 'Biosecurity manual']
    },
    {
      title: { en: 'Climate-Smart Aquaculture Practices', si: 'දේශගුණ-ස්මාර්ට් ජලජ වගා පිළිවෙත්', ta: 'காலநிலை-திறமையான மீன் வளர்ப்பு நடைமுறைகள்' },
      description: { en: 'Development and promotion of climate-resilient aquaculture systems to adapt to changing environmental conditions' },
      status: 'Active',
      startDate: '2024-06-01',
      endDate: '2027-05-31',
      budget: 'USD 520,000',
      fundingSource: 'GCF',
      teamSize: 12,
      progress: 22,
      category: 'Climate Adaptation',
      outputs: ['Climate-smart protocols', 'Resilience assessment', 'Adaptation toolkit']
    }
  ]
};

export const getDefaultProjects = (divisionId) => {
  return DIVISION_PROJECTS[divisionId] || [];
};

export default DIVISION_PROJECTS;
