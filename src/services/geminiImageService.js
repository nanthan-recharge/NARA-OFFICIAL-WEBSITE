/**
 * Gemini 2.5 Flash Image Generation Service
 * AI-powered image creation for NARA divisions
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

/**
 * Division-specific image prompts - HIGHLY ACCURATE & PROJECT-FOCUSED
 */
export const DIVISION_IMAGE_PROMPTS = {
  'environmental-studies': [
    'Scientists in protective gear collecting water samples from coastal waters using sampling bottles and pH meters, Sri Lankan beach, research vessel in background, professional marine research documentation',
    'Laboratory scientist examining microplastic samples under microscope, petri dishes with ocean water samples, modern analytical equipment, clean white lab coats, scientific precision',
    'Environmental monitoring buoy with sensors floating in tropical ocean measuring water quality parameters, satellite communication antenna, clear blue water, technical marine equipment',
    'Team of researchers analyzing harmful algal bloom samples in oceanographic laboratory, computer screens showing data graphs, water quality testing equipment, professional marine science setting'
  ],
  
  'fishing-technology': [
    'Engineers examining selective fishing net with LED lights and escape panels in workshop, measuring mesh size with calipers, technical fishing gear development, detailed close-up of innovative gear modifications',
    'Fuel-efficient fishing vessel with streamlined hull design being tested at sea, fishermen operating modern navigation equipment, blue painted boat, Indian Ocean waters, fuel consumption monitoring devices visible',
    'Acoustic pinger device attached to gillnet to prevent dolphin bycatch, underwater photo showing sound-emitting equipment, marine mammal protection technology, technical marine conservation equipment',
    'Fishing gear testing facility with scale models and prototypes, engineers in safety vests conducting selectivity experiments, net measurement tools, sustainable fishing innovation laboratory'
  ],
  
  'inland-aquaculture': [
    'Biofloc shrimp farming tank with dense white bacterial flocs visible in clear water, aerators creating bubbles, scientist in rubber boots measuring water quality with handheld meter, intensive zero-water-exchange system',
    'Aquaculture hatchery with rows of glass tanks containing colorful ornamental fish breeding pairs, goldfish and guppies, controlled lighting, water filtration systems, breeding technology facility, vibrant tropical colors',
    'Freshwater prawn Macrobrachium hatchery with larval rearing tanks, microscope examination of post-larvae, water quality monitoring equipment, blue rectangular tanks, scientific prawn breeding facility',
    'Seaweed Kappaphycus cultivation on rope lines in shallow coastal lagoon, workers in small boats harvesting red seaweed, organized floating line system, sustainable mariculture in tropical waters'
  ],
  
  'post-harvest': [
    'Food microbiologist in white lab coat examining fish tissue samples in petri dishes for bacterial contamination testing, ISO 17025 accredited laboratory, sterile stainless steel benchtop, incubator in background, professional food safety testing',
    'Industrial cold storage warehouse with stacked frozen seafood boxes, temperature monitoring displays showing -18°C, workers in insulated jackets, modern refrigeration units, organized pallets of export-quality fish',
    'HPLC chromatography machine analyzing histamine levels in tuna samples, scientist reviewing peak results on computer screen, advanced analytical chemistry laboratory, quality assurance testing for export certification',
    'Seafood processing line with HACCP inspection, workers in hair nets and gloves packaging fish fillets, stainless steel conveyor system, quality control officer with clipboard, hygienic food processing facility'
  ],
  
  'marine-biology': [
    'Blue whale surfacing in Indian Ocean with distinctive mottled blue-grey skin pattern, research boat RV Samudrika nearby with satellite tagging equipment, scientists with binoculars, dramatic ocean wildlife photography, endangered species conservation',
    'Scuba divers underwater transplanting coral fragments onto reef restoration frame structure, colorful staghorn and brain corals, marine biologist attaching coral nubbins, tropical reef ecosystem, conservation action',
    'Sea turtle researcher in red headlamp carefully measuring leatherback turtle eggs in nest cavity on beach at night, tropical sand, scientific data collection notebook, nesting ecology monitoring, wildlife conservation documentation',
    'Marine veterinarian conducting necropsy on stranded dolphin on Sri Lankan beach, scientific examination equipment, tissue sampling, emergency response team, marine mammal stranding response, wildlife rescue operation'
  ],
  
  'oceanography': [
    'Oceanographic research vessel deploying CTD rosette sampler with Niskin bottles into deep blue ocean, cable winch system, scientists in hard hats operating deck equipment, ocean current and temperature profiling, tropical Indian Ocean expedition',
    'Physical oceanographer analyzing sea surface temperature satellite data on multiple computer screens showing ocean circulation models, NOAA weather maps, climate research laboratory, numerical ocean modeling workstation',
    'Remotely Operated Vehicle ROV with HD cameras and manipulator arms exploring deep sea trench at 2000 meters depth, bioluminescent jellyfish and unusual deep sea fish, underwater robotics, marine biodiversity discovery',
    'Weather buoy with anemometer and wave height sensors floating in tropical ocean measuring monsoon patterns, solar panels, satellite antenna, real-time ocean-atmosphere data collection, climate monitoring infrastructure'
  ],
  
  'hydrography': [
    'Hydrographic survey vessel with multibeam sonar transducer mounted on hull, operators viewing real-time seafloor mapping on computer screens, GPS positioning equipment, professional maritime surveying, calm tropical waters, nautical chart production',
    'Ship bridge with Electronic Chart Display and Information System ECDIS showing navigational charts of Sri Lankan waters, radar display, GPS plotters, maritime navigation technology, professional ship navigation equipment, safety critical systems',
    'Cartographer working on S-57 compliant Electronic Navigational Chart production using specialized GIS software, digital nautical chart on dual monitors, bathymetric data processing, IHO standards compliance, professional chart-making',
    'Automated tide gauge station with stilling well and float sensor on concrete platform at harbor, water level measurement equipment, data logger, sea level rise monitoring infrastructure, coastal ocean observation'
  ],
  
  'socio-economics': [
    'Social scientist conducting household survey interview with fisher family in traditional coastal village, wooden fishing boats in background, questionnaire forms, laptop computer, livelihood assessment research, Sri Lankan fishing community',
    'Bustling fish auction market at dawn with fresh tuna and swordfish displayed on ice, buyers bidding, price boards, economic activity, value chain analysis, traditional fish market commerce, vibrant market atmosphere',
    'Community workshop with 20 fishermen seated in training hall learning about sustainable fishing economics, flip charts with graphs, facilitator presenting market data, capacity building session, participatory rural development',
    'Economist analyzing fisheries export data on computer screens showing price trends and market statistics, Excel spreadsheets with catch data, economic modeling graphs, professional research office, seafood trade analysis'
  ],
  
  'monitoring-evaluation': [
    'Large LED wall displaying real-time research performance dashboard with KPI metrics, publication counts, project progress bars, data visualization charts, modern monitoring control room, business intelligence system, institutional performance tracking',
    'Quality assurance auditor in lab coat reviewing ISO 17025 laboratory accreditation documents with checklist, inspecting analytical equipment calibration records, quality management system audit, compliance verification, professional quality control',
    'Research impact assessment meeting with scientists presenting evaluation results on projection screen showing bibliometric analysis charts, citation networks, H-index statistics, conference room presentation, academic performance review',
    'Data management specialist working on research repository interface with digital asset management system, metadata cataloging, publication database, institutional knowledge management platform, clean modern UI design'
  ],
  
  'aquaculture-center': [
    'Aquaculture training classroom with 15 farmers watching instructor demonstrate fish feeding techniques using pellet feed, glass demonstration tank with tilapia, whiteboard with diagrams, hands-on capacity building session, rural training facility',
    'Outdoor demonstration fish farm with rectangular earthen ponds containing different species, farmers in groups observing feeding practices, extension officer explaining pond management, organized aquaculture facility, rural Sri Lankan landscape',
    'Aquaculture veterinarian examining sick fish under magnifying lamp for disease diagnosis, microscope slide preparation, fish health assessment tools, diagnostic laboratory with aquarium tanks, biosecurity protocols, animal health services',
    'Farmer field day at research station with rows of experimental aquaculture ponds, scientists demonstrating biofloc technology, aeration systems visible, technology transfer event, practical aquaculture extension, group learning'
  ],

  'administration': [
    'HR officer conducting staff recruitment interview in modern office conference room, professional business attire, organized desk with documents and laptop, employee files, administrative efficiency, Sri Lankan government office setting',
    'Personnel management team reviewing employee records and performance evaluations in administrative office, filing systems, digital HRIS software on computer screens, staff welfare programs documentation, organized workplace management',
    'Training coordinator facilitating professional development workshop with NARA staff seated in training hall, presentation slides on screen, capacity building materials, employee skill development session, institutional learning environment',
    'Administrative services team coordinating facility operations in main office building, reception desk with visitors, document workflow management, office supplies storage, efficient government administration, professional support services'
  ],

  'finance': [
    'Accountant analyzing financial statements and budget reports with Excel spreadsheets on dual monitors, calculator, audit documents, professional business office, government financial management, transparent fiscal operations',
    'Finance team conducting budget planning meeting with projected revenue charts and expenditure graphs on large display screen, financial forecasting models, annual budget preparation, fiscal responsibility, strategic resource allocation',
    'Procurement officer reviewing vendor quotations and purchase orders at desk with contract documents, competitive bidding files, supply chain management, transparent procurement procedures, government purchasing protocols, organized documentation',
    'Payroll specialist processing employee salary disbursements using computerized payroll system, payment schedules on screen, salary slips, financial accuracy verification, timely compensation management, professional finance operations'
  ],

  'service-operations': [
    'Facilities manager inspecting NARA research building infrastructure with maintenance checklist, structural systems assessment, HVAC equipment room with climate control units, professional facility management, operational efficiency',
    'Maintenance technicians repairing laboratory equipment and scientific instruments in workshop, specialized tools, preventive maintenance procedures, equipment calibration records, technical support services, reliable research infrastructure',
    'Transport coordinator managing NARA vehicle fleet with GPS tracking system on computer screen, research vessels and field vehicles parked in organized lot, logistics planning, fleet maintenance schedules, operational transport services',
    'Security personnel monitoring facility surveillance cameras in control room, access control systems, visitor management protocols, safety equipment, 24/7 security operations, protection of research assets and staff safety'
  ],

  'internal-audit': [
    'Internal auditor reviewing financial compliance documents and transaction records at desk with audit working papers, calculator, regulatory frameworks, systematic examination procedures, professional audit methodology, government accountability',
    'Audit team conducting operational efficiency assessment of research programs, performance metrics analysis on computer screens, process evaluation checklists, quality assurance protocols, institutional effectiveness review, evidence-based assessment',
    'Risk management specialist analyzing organizational risk matrix on large monitor, risk assessment frameworks, control environment evaluation, compliance monitoring dashboards, proactive risk mitigation strategies, governance best practices',
    'Compliance officer examining regulatory adherence documentation with legal requirements checklist, policy manuals, internal control systems verification, audit trail records, transparent governance standards, institutional integrity assurance'
  ]
};

/**
 * Generate image using Gemini 2.5 Flash
 * @param {string} prompt - Image generation prompt
 * @param {object} options - Generation options
 */
export const generateDivisionImage = async (prompt, options = {}) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });

    // Enhanced prompt with style and quality specifications
    const enhancedPrompt = `
      Create a high-quality, professional photograph for a marine research institute website:
      
      ${prompt}
      
      Style requirements:
      - Professional documentary photography
      - High resolution and sharp detail
      - Natural lighting with good exposure
      - Wide landscape format (16:9 ratio)
      - Vibrant but realistic colors
      - No text or watermarks
      - Suitable for website hero section
      - Sri Lankan/South Asian context where applicable
      
      Technical specifications:
      - 1920x1080 minimum resolution
      - Professional composition
      - Depth of field appropriate for subject
      - Clean, uncluttered background
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    
    // Note: Gemini 2.0 Flash Experimental currently doesn't directly generate images
    // but can generate detailed image descriptions for use with image generation APIs
    // For now, we'll return the enhanced prompt for use with other services
    
    return {
      success: true,
      prompt: enhancedPrompt,
      description: response.text(),
      metadata: {
        timestamp: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp',
        originalPrompt: prompt
      }
    };
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate optimized prompts for all division images
 * @param {string} divisionId - Division identifier
 */
export const generateDivisionImagePrompts = async (divisionId) => {
  const prompts = DIVISION_IMAGE_PROMPTS[divisionId] || [];
  
  if (prompts.length === 0) {
    console.warn(`No prompts found for division: ${divisionId}`);
    return [];
  }

  const enhancedPrompts = [];
  
  for (const prompt of prompts) {
    const result = await generateDivisionImage(prompt);
    if (result.success) {
      enhancedPrompts.push(result);
    }
  }
  
  return enhancedPrompts;
};

/**
 * Get random image from division's image collection
 * @param {string} divisionId - Division identifier
 * @param {array} availableImages - Array of image URLs
 */
export const getRandomDivisionImage = (divisionId, availableImages = []) => {
  if (availableImages.length === 0) {
    // Fallback to default Unsplash images if no custom images available
    const defaultImages = {
      'environmental-studies': 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1920',
      'fishing-technology': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920',
      'inland-aquaculture': 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1920',
      'post-harvest': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920',
      'marine-biology': 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1920',
      'oceanography': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920',
      'hydrography': 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1920',
      'socio-economics': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920',
      'monitoring-evaluation': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920',
      'aquaculture-center': 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=1920',
      'administration': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920',
      'finance': 'https://images.unsplash.com/photo-1554224311-beee2c94c61b?w=1920',
      'service-operations': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920',
      'internal-audit': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920'
    };
    
    return defaultImages[divisionId] || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920';
  }
  
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  return availableImages[randomIndex];
};

/**
 * Alternative: Use DALL-E 3 or Stable Diffusion for actual image generation
 * This is a placeholder for integrating with actual image generation APIs
 */
export const generateImageWithAPI = async (prompt, apiService = 'dalle3') => {
  try {
    // Placeholder for actual API integration
    // You would integrate with:
    // - OpenAI DALL-E 3 API
    // - Stability AI Stable Diffusion
    // - Midjourney API
    // - Leonardo.ai API
    
    console.log(`Generating image with ${apiService}:`, prompt);
    
    // Return placeholder response
    return {
      success: false,
      message: 'Image generation API not configured. Please add API key.',
      prompt
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  generateDivisionImage,
  generateDivisionImagePrompts,
  getRandomDivisionImage,
  generateImageWithAPI,
  DIVISION_IMAGE_PROMPTS
};

