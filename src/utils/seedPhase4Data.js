/**
 * Phase 4 Sample Data Seeding Script
 *
 * Creates realistic test data for:
 * - Public Consultation Portal
 * - Research Collaboration Hub
 * - Industry Partnership Dashboard
 * - Educational Outreach Platform
 */

import { consultationService, feedbackService, commentService } from '../services/publicConsultationService';
import { researcherRegistryService, collaborationRequestService } from '../services/researchCollaborationService';
import { partnerRegistryService, proposalService } from '../services/industryPartnershipService';
import { contentLibraryService, competitionService, webinarService } from '../services/educationalOutreachService';

// ========== PUBLIC CONSULTATION SAMPLE DATA ==========

const sampleConsultations = [
  {
    title: 'Marine Protected Area Expansion in Southern Coast',
    description: 'We are seeking public input on expanding the marine protected areas along the southern coast of Sri Lanka to include Weligama Bay and surrounding waters. This expansion aims to protect critical coral reef ecosystems and enhance marine biodiversity.',
    category: 'marine_conservation',
    status: 'open',
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    documents: [
      {
        name: 'Proposed MPA Boundaries Map',
        url: 'https://example.com/mpa-map.pdf',
        type: 'pdf'
      }
    ],
    contactEmail: 'consultation@nara.gov.lk',
    department: 'Marine Conservation Division'
  },
  {
    title: 'Sustainable Fishing Practices Regulation Update',
    description: 'Proposed amendments to fishing regulations to promote sustainable practices, including seasonal restrictions, gear modifications, and bycatch reduction measures. Your feedback will shape the future of Sri Lanka\'s fishing industry.',
    category: 'fisheries_management',
    status: 'open',
    closingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    contactEmail: 'fisheries@nara.gov.lk',
    department: 'Fisheries Management Division'
  },
  {
    title: 'Coastal Development Guidelines - Draft Policy',
    description: 'Draft policy for coastal development to balance economic growth with environmental protection. Includes setback distances, environmental impact assessment requirements, and community consultation protocols.',
    category: 'marine_policy',
    status: 'open',
    closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      {
        name: 'Draft Guidelines Document',
        url: 'https://example.com/guidelines.pdf',
        type: 'pdf'
      }
    ],
    contactEmail: 'policy@nara.gov.lk',
    department: 'Policy and Planning Division'
  },
  {
    title: 'Marine Tourism Best Practices Framework',
    description: 'Development of best practices for marine tourism operators, including whale watching, diving, and snorkeling activities. Ensuring tourism sustainability while protecting marine ecosystems.',
    category: 'marine_policy',
    status: 'closed',
    closingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Closed 10 days ago
    documents: [],
    contactEmail: 'tourism@nara.gov.lk',
    department: 'Marine Conservation Division'
  }
];

const sampleFeedback = [
  {
    name: 'Priya Jayawardena',
    email: 'priya.j@email.com',
    organization: 'Southern Fishermen Association',
    feedback: 'I strongly support the MPA expansion. As a fisher, I have seen the decline in fish stocks over the years. Protected areas will help replenish marine life and benefit our community in the long term.',
    sentiment: 'positive',
    category: 'community',
    upvotes: 15
  },
  {
    name: 'Dr. Sunil Fernando',
    email: 'sunil.f@university.lk',
    organization: 'University of Colombo - Marine Biology Dept',
    feedback: 'The proposed boundaries are scientifically sound and cover critical habitats. However, I recommend extending the northern boundary by 2km to include the seagrass beds which are important nursery grounds.',
    sentiment: 'neutral',
    category: 'expert',
    upvotes: 8
  },
  {
    name: 'Chaminda Silva',
    email: 'chaminda@tourism.lk',
    organization: 'Weligama Tourism Board',
    feedback: 'While we understand the environmental benefits, we are concerned about the impact on water sports and diving businesses. We need clearer guidelines on what activities will be permitted within the MPA.',
    sentiment: 'negative',
    category: 'business',
    upvotes: 12
  }
];

const sampleComments = [
  {
    commenterName: 'Nadeesha Perera',
    commenterEmail: 'nadeesha@email.com',
    comment: 'Great initiative! We need more protected areas to preserve our marine heritage for future generations.',
    likes: 5
  },
  {
    commenterName: 'Rohan Kumar',
    commenterEmail: 'rohan.k@email.com',
    comment: 'Has there been any economic impact assessment on local fishing communities? This is crucial information needed before making a decision.',
    likes: 3
  }
];

// ========== RESEARCH COLLABORATION SAMPLE DATA ==========

const sampleResearchers = [
  {
    name: 'Dr. Anushka Wijesinghe',
    email: 'anushka.w@nara.gov.lk',
    institution: 'National Aquatic Resources Research and Development Agency',
    position: 'Senior Research Scientist',
    specializations: ['Marine Biology', 'Coral Reef Ecology', 'Climate Change'],
    researchInterests: ['Coral bleaching', 'Marine biodiversity', 'Ocean acidification'],
    bio: 'Specialized in coral reef ecosystems with 15 years of research experience. Leading studies on climate change impacts on Sri Lankan coral reefs.',
    publications: 25,
    verificationStatus: 'verified'
  },
  {
    name: 'Prof. Rajith Dissanayake',
    email: 'rajith.d@university.lk',
    institution: 'University of Ruhuna',
    position: 'Professor of Marine Science',
    specializations: ['Oceanography', 'Marine Biology', 'Fisheries Science'],
    researchInterests: ['Ocean currents', 'Fish stock assessment', 'Marine ecology'],
    bio: 'Leading oceanographer focusing on Indian Ocean dynamics and their impact on Sri Lankan waters.',
    publications: 40,
    verificationStatus: 'verified'
  },
  {
    name: 'Dr. Thisara Gunasekara',
    email: 'thisara.g@research.lk',
    institution: 'Sri Lanka Marine Research Institute',
    position: 'Research Officer',
    specializations: ['Marine Chemistry', 'Water Quality', 'Pollution Control'],
    researchInterests: ['Marine pollution', 'Heavy metals', 'Microplastics'],
    bio: 'Researching marine pollution sources and mitigation strategies in Sri Lankan coastal waters.',
    publications: 12,
    verificationStatus: 'pending'
  }
];

// ========== INDUSTRY PARTNERSHIP SAMPLE DATA ==========

const samplePartners = [
  {
    companyName: 'Blue Ocean Aquaculture Ltd',
    industry: 'Aquaculture',
    contactPerson: 'Dinesh Perera',
    contactEmail: 'dinesh@blueocean.lk',
    phone: '+94-11-1234567',
    address: 'Negombo, Sri Lanka',
    website: 'https://blueocean.lk',
    description: 'Leading sustainable aquaculture company specializing in shrimp and fish farming using eco-friendly practices.',
    employeeCount: 150,
    annualRevenue: 500000000 // LKR
  },
  {
    companyName: 'Marine Tech Solutions',
    industry: 'Technology',
    contactPerson: 'Sanduni Fernando',
    contactEmail: 'sanduni@marinetech.lk',
    phone: '+94-11-7654321',
    address: 'Colombo, Sri Lanka',
    website: 'https://marinetech.lk',
    description: 'Technology company developing IoT solutions for marine monitoring and data collection.',
    employeeCount: 30,
    annualRevenue: 50000000 // LKR
  }
];

// ========== EDUCATIONAL OUTREACH SAMPLE DATA ==========

const sampleEducationalContent = [
  {
    title: 'Introduction to Marine Ecosystems',
    description: 'Learn about the diverse marine ecosystems found in Sri Lankan waters, from coral reefs to mangrove forests.',
    category: 'marine_science',
    contentType: 'video',
    url: 'https://example.com/marine-ecosystems.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/ecosystems.jpg',
    duration: 15, // minutes
    targetAudience: 'high_school',
    language: 'en'
  },
  {
    title: 'Coral Reef Conservation Guide',
    description: 'A comprehensive guide to coral reef conservation methods and best practices for protecting these vital ecosystems.',
    category: 'conservation',
    contentType: 'document',
    url: 'https://example.com/coral-guide.pdf',
    thumbnailUrl: 'https://example.com/thumbnails/coral.jpg',
    targetAudience: 'undergraduate',
    language: 'en'
  },
  {
    title: 'Marine Biology Career Pathways',
    description: 'Explore career opportunities in marine science and learn about the educational pathways to become a marine biologist.',
    category: 'career_guidance',
    contentType: 'article',
    url: 'https://example.com/careers',
    thumbnailUrl: 'https://example.com/thumbnails/careers.jpg',
    targetAudience: 'high_school',
    language: 'en'
  }
];

const sampleCompetitions = [
  {
    title: 'National Marine Science Essay Competition 2024',
    description: 'Write an essay on the importance of marine conservation in Sri Lanka. Open to all high school students.',
    category: 'essay',
    eligibility: 'High school students (Grades 9-13)',
    prizes: ['First Prize: LKR 50,000', 'Second Prize: LKR 30,000', 'Third Prize: LKR 20,000'],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    rules: 'Essay must be 1000-1500 words, original work, submitted in English, Sinhala or Tamil.',
    submissionEmail: 'competition@nara.gov.lk'
  },
  {
    title: 'Underwater Photography Contest',
    description: 'Capture the beauty of Sri Lankan marine life. Amateur and professional categories available.',
    category: 'photography',
    eligibility: 'All ages',
    prizes: ['Professional: LKR 100,000', 'Amateur: LKR 50,000', 'Youth: LKR 25,000'],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    rules: 'Photos must be taken in Sri Lankan waters, no digital manipulation beyond basic adjustments.',
    submissionEmail: 'photo@nara.gov.lk'
  }
];

const sampleWebinars = [
  {
    title: 'Climate Change and Sri Lankan Marine Ecosystems',
    description: 'Join leading marine scientists to discuss the impacts of climate change on our coastal and marine environments.',
    speaker: 'Dr. Anushka Wijesinghe',
    speakerBio: 'Senior Research Scientist at NARA with 15 years of experience in coral reef ecology.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 90, // minutes
    platform: 'Zoom',
    registrationLink: 'https://zoom.us/webinar/register',
    maxParticipants: 500,
    topics: ['Climate impacts', 'Coral bleaching', 'Adaptation strategies']
  },
  {
    title: 'Sustainable Fishing Practices Workshop',
    description: 'Practical workshop on sustainable fishing methods and gear modifications to reduce bycatch.',
    speaker: 'Prof. Rajith Dissanayake',
    speakerBio: 'Professor of Marine Science specializing in fisheries management.',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    platform: 'Zoom',
    registrationLink: 'https://zoom.us/webinar/register',
    maxParticipants: 200,
    topics: ['Gear modifications', 'Bycatch reduction', 'Best practices']
  }
];

// ========== SEEDING FUNCTIONS ==========

export const seedConsultations = async () => {
  console.log('🌱 Seeding consultations...');
  const results = [];

  for (const consultation of sampleConsultations) {
    const result = await consultationService.create(consultation);
    if (result.error) {
      console.error(`❌ Failed to create consultation: ${consultation.title}`, result.error);
    } else {
      console.log(`✅ Created consultation: ${consultation.title}`);
      results.push(result.data);
    }
  }

  return results;
};

export const seedFeedback = async (consultationId) => {
  console.log('🌱 Seeding feedback...');

  for (const feedback of sampleFeedback) {
    const result = await feedbackService.submit(consultationId, feedback);
    if (result.error) {
      console.error(`❌ Failed to create feedback from: ${feedback.name}`, result.error);
    } else {
      console.log(`✅ Created feedback from: ${feedback.name}`);
    }
  }
};

export const seedComments = async (consultationId) => {
  console.log('🌱 Seeding comments...');

  for (const comment of sampleComments) {
    const result = await commentService.post(consultationId, comment);
    if (result.error) {
      console.error(`❌ Failed to create comment from: ${comment.commenterName}`, result.error);
    } else {
      console.log(`✅ Created comment from: ${comment.commenterName}`);
    }
  }
};

export const seedResearchers = async () => {
  console.log('🌱 Seeding researchers...');

  for (const researcher of sampleResearchers) {
    const result = await researcherRegistryService.register(researcher);
    if (result.error) {
      console.error(`❌ Failed to register researcher: ${researcher.name}`, result.error);
    } else {
      console.log(`✅ Registered researcher: ${researcher.name}`);
    }
  }
};

export const seedPartners = async () => {
  console.log('🌱 Seeding industry partners...');

  for (const partner of samplePartners) {
    const result = await partnerRegistryService.register(partner);
    if (result.error) {
      console.error(`❌ Failed to register partner: ${partner.companyName}`, result.error);
    } else {
      console.log(`✅ Registered partner: ${partner.companyName}`);
    }
  }
};

export const seedEducationalContent = async () => {
  console.log('🌱 Seeding educational content...');

  for (const content of sampleEducationalContent) {
    const result = await contentLibraryService.add(content);
    if (result.error) {
      console.error(`❌ Failed to add content: ${content.title}`, result.error);
    } else {
      console.log(`✅ Added content: ${content.title}`);
    }
  }
};

export const seedCompetitions = async () => {
  console.log('🌱 Seeding competitions...');

  for (const competition of sampleCompetitions) {
    const result = await competitionService.create(competition);
    if (result.error) {
      console.error(`❌ Failed to create competition: ${competition.title}`, result.error);
    } else {
      console.log(`✅ Created competition: ${competition.title}`);
    }
  }
};

export const seedWebinars = async () => {
  console.log('🌱 Seeding webinars...');

  for (const webinar of sampleWebinars) {
    const result = await webinarService.schedule(webinar);
    if (result.error) {
      console.error(`❌ Failed to schedule webinar: ${webinar.title}`, result.error);
    } else {
      console.log(`✅ Scheduled webinar: ${webinar.title}`);
    }
  }
};

// ========== MASTER SEED FUNCTION ==========

export const seedAllPhase4Data = async () => {
  console.log('🚀 Starting Phase 4 data seeding...\n');

  try {
    // 1. Seed consultations
    const consultations = await seedConsultations();
    console.log('\n');

    // 2. Seed feedback and comments for first consultation
    if (consultations.length > 0) {
      const firstConsultation = consultations[0];
      await seedFeedback(firstConsultation.consultationId);
      await seedComments(firstConsultation.consultationId);
      console.log('\n');
    }

    // 3. Seed researchers
    await seedResearchers();
    console.log('\n');

    // 4. Seed industry partners
    await seedPartners();
    console.log('\n');

    // 5. Seed educational content
    await seedEducationalContent();
    console.log('\n');

    // 6. Seed competitions
    await seedCompetitions();
    console.log('\n');

    // 7. Seed webinars
    await seedWebinars();
    console.log('\n');

    console.log('✅ Phase 4 data seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error seeding Phase 4 data:', error);
    return { success: false, error: error.message };
  }
};

export default {
  seedConsultations,
  seedFeedback,
  seedComments,
  seedResearchers,
  seedPartners,
  seedEducationalContent,
  seedCompetitions,
  seedWebinars,
  seedAllPhase4Data
};
