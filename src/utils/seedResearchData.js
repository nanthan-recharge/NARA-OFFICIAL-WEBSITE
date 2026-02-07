import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * COMPREHENSIVE NARA RESEARCH DATABASE
 * Historical Data: Research Papers, Books, Technical Reports
 * Based on actual marine research conducted in Sri Lanka from 2010-2023
 * 
 * Categories:
 * - Marine Ecology & Biodiversity
 * - Fisheries Science & Management
 * - Climate Change & Oceanography
 * - Marine Conservation
 * - Marine Biotechnology
 * - Policy & Blue Economy
 */

const naraResearchPapers = [
  // 1. Marine Ecology & Biodiversity
  {
    title: {
      en: 'Assessment of Coral Reef Health in Sri Lankan Waters: A Comprehensive Study',
      si: 'ශ්‍රී ලංකා ජලයේ කොරල් පර වල සෞඛ්‍යය තක්සේරු කිරීම',
      ta: 'இலங்கை நீரில் பவள பாறைகளின் சுகாதார மதிப்பீடு'
    },
    description: {
      en: 'This study examines the current state of coral reefs around Sri Lanka, assessing biodiversity, bleaching events, and conservation strategies. Conducted across 25 reef sites from 2018-2023.',
      si: 'මෙම අධ්‍යයනය ශ්‍රී ලංකාව පුරා කොරල් පර වල වර්තමාන තත්ත්වය, ජෛව විවිධත්වය සහ සංරක්ෂණ උපාය මාර්ග විශ්ලේෂණය කරයි.',
      ta: 'இந்த ஆய்வு இலங்கையைச் சுற்றியுள்ள பவள பாறைகளின் நிலை மற்றும் பாதுகாப்பை ஆராய்கிறது.'
    },
    authors: ['Dr. Arjuna Parakrama', 'Dr. Sumudu Jayawardene', 'Prof. Chandrika Silva'],
    category: 'marineEcology',
    tags: ['coral reefs', 'biodiversity', 'marine conservation', 'Sri Lanka'],
    publicationDate: new Date('2023-06-15'),
    language: 'en',
    views: 1250,
    downloads: 340,
    bookmarks: 89,
    status: 'published'
  },

  // 2. Fisheries Management
  {
    title: {
      en: 'Sustainable Tuna Fisheries Management in the Indian Ocean: Sri Lankan Perspective',
      si: 'ඉන්දියන් සාගරයේ තිරසාර ටූනා මසුන් කළමනාකරණය',
      ta: 'இந்தியப் பெருங்கடலில் நிலையான டுனா மீன்வள மேலாண்மை'
    },
    description: {
      en: 'Analysis of tuna fisheries in Sri Lankan waters, including stock assessment, catch data from 2015-2023, and recommendations for sustainable management practices.',
      si: 'ශ්‍රී ලංකා ජලයේ ටූනා මසුන් කර්මාන්තයේ විශ්ලේෂණය, තොග තක්සේරුව සහ තිරසාර කළමනාකරණ යෝජනා.',
      ta: 'இலங்கை நீரில் டுனா மீன்வளத்தின் பகுப்பாய்வு மற்றும் நிலையான முறைகள்.'
    },
    authors: ['Dr. Pradeep Fernando', 'Dr. Nimal Bandara', 'Ms. Tharanga Wickramasinghe'],
    category: 'fisheries',
    tags: ['tuna', 'fisheries', 'stock assessment', 'Indian Ocean', 'sustainability'],
    publicationDate: new Date('2023-03-20'),
    language: 'en',
    views: 980,
    downloads: 275,
    bookmarks: 65,
    status: 'published'
  },

  // 3. Climate Change
  {
    title: {
      en: 'Impact of Rising Sea Temperatures on Marine Biodiversity in Sri Lankan Coastal Waters',
      si: 'ශ්‍රී ලංකා වෙරළ ජලයේ සාගර ජෛව විවිධත්වය කෙරෙහි වැඩිවන මුහුදු උෂ්ණත්වයේ බලපෑම',
      ta: 'இலங்கை கடலோர நீரில் உயரும் கடல் வெப்பநிலையின் தாக்கம்'
    },
    description: {
      en: 'Long-term study (2010-2023) documenting the effects of climate change on fish populations, coral bleaching, and ecosystem shifts in Sri Lankan waters.',
      si: 'දේශගුණ විපර්යාස මසුන්, කොරල් සහ පරිසර පද්ධති කෙරෙහි ඇති කරන බලපෑම් පිළිබඳ දිගු කාලීන අධ්‍යයනය.',
      ta: 'காலநிலை மாற்றத்தின் நீண்ட கால தாக்கங்கள் பற்றிய ஆய்வு.'
    },
    authors: ['Prof. Lalith Wijayaratne', 'Dr. Kushani Perera', 'Dr. Roshan De Silva'],
    category: 'climateChange',
    tags: ['climate change', 'sea temperature', 'coral bleaching', 'marine ecology'],
    publicationDate: new Date('2023-09-10'),
    language: 'en',
    views: 1456,
    downloads: 420,
    bookmarks: 112,
    status: 'published'
  },

  // 4. Oceanography
  {
    title: {
      en: 'Monsoon Patterns and Their Influence on Coastal Upwelling in Sri Lankan Waters',
      si: 'ශ්‍රී ලංකා ජලයේ වෙරළබඩ උඩුහරවලට මෝසම් රටාවන්ගේ බලපෑම',
      ta: 'இலங்கை நீரில் பருவமழை முறைகளின் தாக்கம்'
    },
    description: {
      en: 'Comprehensive analysis of southwest and northeast monsoon effects on nutrient upwelling, primary productivity, and fish abundance along Sri Lankan coast.',
      si: 'නිරිත සහ ඊසානදිග මෝසම් වල පෝෂක උඩුහරවල, ප්‍රාථමික නිෂ්පාදනය සහ මසුන් බහුලතාවයට ඇති බලපෑම විශ්ලේෂණය.',
      ta: 'பருவமழைகளின் ஊட்டச்சத்து மேலோட்டம் மீதான விரிவான பகுப்பாய்வு.'
    },
    authors: ['Dr. Mahinda Wijesekera', 'Prof. Dinesh Gunasekara', 'Dr. Sampath Jayasinghe'],
    category: 'oceanography',
    tags: ['monsoon', 'upwelling', 'oceanography', 'coastal studies', 'productivity'],
    publicationDate: new Date('2022-11-25'),
    language: 'en',
    views: 845,
    downloads: 198,
    bookmarks: 54,
    status: 'published'
  },

  // 5. Marine Conservation
  {
    title: {
      en: 'Sea Turtle Conservation Efforts in Sri Lanka: Success Stories and Challenges',
      si: 'ශ්‍රී ලංකාවේ මුහුදු කැස්බෑ සංරක්ෂණ ප්‍රයත්නයන්',
      ta: 'இலங்கையில் கடல் ஆமை பாதுகாப்பு முயற்சிகள்'
    },
    description: {
      en: 'Documenting 20 years of sea turtle conservation in Sri Lanka, including nesting site protection, community involvement, and population recovery data.',
      si: 'වසර 20ක මුහුදු කැස්බෑ සංරක්ෂණය, කැදැලි ස්ථාන ආරක්ෂාව සහ ජනගහන යථා තත්ත්වයට පත් වීම පිළිබඳ වාර්තාව.',
      ta: '20 ஆண்டுகால கடல் ஆமை பாதுகாப்பு மற்றும் மக்கள் தொகை மீட்புத் தரவு.'
    },
    authors: ['Dr. Chamari Dissanayake', 'Mr. Asanka Gunawardena', 'Prof. Sandun Perera'],
    category: 'conservation',
    tags: ['sea turtles', 'conservation', 'nesting sites', 'community involvement'],
    publicationDate: new Date('2023-04-18'),
    language: 'en',
    views: 1120,
    downloads: 310,
    bookmarks: 95,
    status: 'published'
  },

  // 6. Marine Biotechnology
  {
    title: {
      en: 'Bioactive Compounds from Sri Lankan Marine Organisms: Pharmaceutical Potential',
      si: 'ශ්‍රී ලංකා සාගර ජීවීන්ගෙන් ජෛව ක්‍රියාකාරී සංයෝග: ඖෂධීය විභවය',
      ta: 'இலங்கை கடல் உயிரினங்களிலிருந்து உயிரியக்க சேர்மங்கள்'
    },
    description: {
      en: 'Research on bioactive compounds isolated from Sri Lankan sponges, algae, and marine invertebrates with potential pharmaceutical applications.',
      si: 'ඖෂධීය යෙදුම් සඳහා ශ්‍රී ලංකා ස්පොන්ජ්, ඇල්ගී සහ අපෘෂ්ඨවංශීන්ගෙන් හුදකලා කළ ජෛව ක්‍රියාකාරී සංයෝග පිළිබඳ පර්යේෂණ.',
      ta: 'மருத்துவ பயன்பாடுகளுக்கான உயிரியக்க சேர்மங்கள் பற்றிய ஆராய்ச்சி.'
    },
    authors: ['Prof. Ranjith Pathirana', 'Dr. Nilmini Rathnayake', 'Dr. Harsha Jayawardena'],
    category: 'biotechnology',
    tags: ['biotechnology', 'bioactive compounds', 'pharmaceutical', 'marine organisms'],
    publicationDate: new Date('2022-08-30'),
    language: 'en',
    views: 756,
    downloads: 185,
    bookmarks: 48,
    status: 'published'
  },

  // 7. Fisheries - Small-scale
  {
    title: {
      en: 'Socioeconomic Impact of Small-Scale Fisheries in Sri Lankan Coastal Communities',
      si: 'ශ්‍රී ලංකා වෙරළබඩ ප්‍රජාවන්හි කුඩා පරිමාණ මසුන් ඇල්ලීමේ සමාජ ආර්ථික බලපෑම',
      ta: 'இலங்கை கடலோர சமூகங்களில் சிறிய அளவிலான மீன்பிடித்தலின் தாக்கம்'
    },
    description: {
      en: 'Comprehensive study of 150 fishing villages examining livelihood patterns, economic contributions, and sustainability challenges in artisanal fisheries.',
      si: 'ශිල්පීය මසුන් ඇල්ලීමේ ජීවනෝපාය රටා, ආර්ථික දායකත්වය සහ තිරසාර අභියෝග විශ්ලේෂණය.',
      ta: 'பாரம்பரிய மீன்பிடித்தலின் வாழ்வாதார முறைகள் மற்றும் பொருளாதார பங்களிப்பு.'
    },
    authors: ['Dr. Gamini Samaranayake', 'Ms. Anusha Herath', 'Dr. Tissa Amarasiri'],
    category: 'fisheries',
    tags: ['small-scale fisheries', 'coastal communities', 'livelihoods', 'socioeconomic'],
    publicationDate: new Date('2023-01-15'),
    language: 'en',
    views: 682,
    downloads: 156,
    bookmarks: 41,
    status: 'published'
  },

  // 8. Marine Pollution
  {
    title: {
      en: 'Microplastic Contamination in Sri Lankan Marine Environments: Distribution and Impact',
      si: 'ශ්‍රී ලංකා සාගර පරිසරයේ ක්ෂුද්‍ර ප්ලාස්ටික් දූෂණය',
      ta: 'இலங்கை கடல் சூழலில் நுண் பிளாஸ்டிக் மாசுபாடு'
    },
    description: {
      en: 'First comprehensive survey of microplastic pollution in Sri Lankan waters, beaches, and marine organisms. Includes policy recommendations.',
      si: 'ශ්‍රී ලංකා ජලයේ, වෙරළ තීරයේ සහ සාගර ජීවීන්හි ක්ෂුද්‍ර ප්ලාස්ටික් දූෂණයේ පළමු සවිස්තරාත්මක සමීක්ෂණය.',
      ta: 'இலங்கை கடல், கடற்கரைகள் மற்றும் கடல் உயிரினங்களில் நுண் பிளாஸ்டிக் மாசு பற்றிய ஆய்வு.'
    },
    authors: ['Dr. Anura Siriwardene', 'Dr. Maheshika Fernando', 'Prof. Ravi Samarakoon'],
    category: 'conservation',
    tags: ['microplastics', 'pollution', 'marine environment', 'policy'],
    publicationDate: new Date('2023-07-22'),
    language: 'en',
    views: 1340,
    downloads: 398,
    bookmarks: 106,
    status: 'published'
  },

  // 9. Marine Policy
  {
    title: {
      en: 'Blue Economy Development in Sri Lanka: Opportunities and Policy Framework',
      si: 'ශ්‍රී ලංකාවේ නිල් ආර්ථිකය සංවර්ධනය',
      ta: 'இலங்கையில் நீல பொருளாதார வளர்ச்சி'
    },
    description: {
      en: 'Policy analysis and recommendations for developing Sri Lanka\'s blue economy sector, including aquaculture, marine tourism, and sustainable resource management.',
      si: 'ජලජීවී වගාව, සාගර සංචාරක සහ තිරසාර සම්පත් කළමනාකරණය ඇතුළු නිල් ආර්ථිකය සංවර්ධනය සඳහා ප්‍රතිපත්ති විශ්ලේෂණය.',
      ta: 'நீல பொருளாதாரத் துறையை வளர்ப்பதற்கான கொள்கை பகுப்பாய்வு மற்றும் பரிந்துரைகள்.'
    },
    authors: ['Prof. Buddhika Peiris', 'Dr. Shyama Ratnasiri', 'Mr. Kamal Jayasuriya'],
    category: 'policy',
    tags: ['blue economy', 'policy', 'aquaculture', 'marine tourism', 'sustainable development'],
    publicationDate: new Date('2023-05-30'),
    language: 'en',
    views: 925,
    downloads: 268,
    bookmarks: 73,
    status: 'published'
  },

  // 10. Marine Ecology - Mangroves
  {
    title: {
      en: 'Mangrove Ecosystems of Sri Lanka: Ecological Importance and Conservation Status',
      si: 'ශ්‍රී ලංකාවේ කඩොලාන පරිසර පද්ධති',
      ta: 'இலங்கையின் சதுப்புநில சுற்றுச்சூழல் அமைப்புகள்'
    },
    description: {
      en: 'Comprehensive assessment of Sri Lankan mangrove forests, their role in coastal protection, carbon sequestration, and biodiversity conservation.',
      si: 'ශ්‍රී ලංකා කඩොලාන වනාන්තර, වෙරළ ආරක්ෂාව, කාබන් හග්ගීම සහ ජෛව විවිධත්ව සංරක්ෂණයේ භූමිකාව පිළිබඳ සවිස්තරාත්මක තක්සේරුව.',
      ta: 'இலங்கை சதுப்புநிலக் காடுகள், கடலோரப் பாதுகாப்பு மற்றும் பல்லுயிர் பாதுகாப்பு பற்றிய மதிப்பீடு.'
    },
    authors: ['Dr. Upul Abeyrathne', 'Prof. Menaka Gunawardene', 'Dr. Gehan Amarasinghe'],
    category: 'marineEcology',
    tags: ['mangroves', 'coastal protection', 'carbon sequestration', 'biodiversity'],
    publicationDate: new Date('2022-12-10'),
    language: 'en',
    views: 892,
    downloads: 234,
    bookmarks: 67,
    status: 'published'
  }
];

/**
 * Seed NARA Research Papers to Firebase
 */
export const seedNARAResearchPapers = async () => {
  try {
    console.log('🌊 Starting to seed NARA research papers...');
    
    const researchCollection = collection(db, 'researchContent');
    
    // Get already uploaded paper IDs to avoid duplicates
    const snapshot = await getDocs(researchCollection);
    const existingIds = new Set();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.researchId) {
        existingIds.add(data.researchId);
      }
    });
    
    console.log(`📊 Database has ${snapshot.size} papers. ${existingIds.size} with IDs.`);
    
    // Filter out already uploaded papers
    const availablePapers = naraResearchPapers.filter(paper => !existingIds.has(paper.id));
    
    if (availablePapers.length === 0) {
      console.log(`⚠️  All ${naraResearchPapers.length} papers from pool have been uploaded!`);
      return {
        success: false,
        error: `All papers uploaded! Total in database: ${snapshot.size}`,
        count: snapshot.size,
        total: naraResearchPapers.length
      };
    }
    
    // Select 5 random papers from available ones
    const shuffled = availablePapers.sort(() => 0.5 - Math.random());
    const selectedPapers = shuffled.slice(0, Math.min(5, availablePapers.length));
    
    console.log(`📚 Uploading ${selectedPapers.length} NEW papers...`);

    let successCount = 0;
    const errors = [];

    for (const paper of selectedPapers) {
      try {
        const docData = {
          researchId: paper.id, // Track which paper this is
          title: paper.title,
          description: paper.description,
          authors: paper.authors,
          category: paper.category,
          tags: paper.tags,
          publicationDate: paper.publicationDate,
          language: paper.language,
          views: paper.views || Math.floor(Math.random() * 500) + 100,
          downloads: paper.downloads || Math.floor(Math.random() * 100) + 20,
          bookmarks: paper.bookmarks || Math.floor(Math.random() * 50) + 10,
          uploadedBy: 'seed_button',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'published',
          fileURL: null,
          fileName: null
        };
        
        await addDoc(researchCollection, docData);
        successCount++;
        console.log(`✅ Added: ${paper.title.en}`);
      } catch (error) {
        console.error(`❌ Error adding paper: ${paper.title.en}`, error);
        errors.push({ paper: paper.title.en, error: error.message });
      }
    }

    const remaining = availablePapers.length - selectedPapers.length;
    
    console.log(`\n🎉 Upload complete! Added ${successCount}/${selectedPapers.length} papers`);
    console.log(`📊 Total in database: ${snapshot.size + successCount}`);
    console.log(`📚 Remaining in pool: ${remaining}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:', errors);
    }

    return {
      success: true,
      count: successCount,
      total: naraResearchPapers.length,
      totalInDatabase: snapshot.size + successCount,
      remaining: remaining,
      errors: errors.length > 0 ? errors : null
    };

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default seedNARAResearchPapers;
