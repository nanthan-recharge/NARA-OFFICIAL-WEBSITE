// Sample Research Content Seeder
// Run this script to populate the Research Excellence Portal with sample data

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAm7WGzLY7qM1i3pLgLhkceS1LTplYh6Lo",
  authDomain: "nara-web-73384.firebaseapp.com",
  projectId: "nara-web-73384",
  storageBucket: "nara-web-73384.firebasestorage.app",
  messagingSenderId: "455192505259",
  appId: "1:455192505259:web:760c764d5e7d7da3b140ee",
  measurementId: "G-8MLEKN8HP2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleResearchPapers = [
  {
    title: {
      en: "Marine Biodiversity Assessment in Sri Lankan Coastal Waters",
      si: "ශ්‍රී ලංකා වෙරළ ජලයේ සමුද්‍ර ජෛව විවිධත්ව තක්සේරුව",
      ta: "இலங்கை கடலோர நீரில் கடல் பல்லுயிர் மதிப்பீடு"
    },
    description: {
      en: "A comprehensive study on marine biodiversity patterns along the Sri Lankan coastline",
      si: "ශ්‍රී ලංකා වෙරළ තීරය දිගේ සමුද්‍ර ජෛව විවිධත්ව රටා පිළිබඳ විස්තීර්ණ අධ්‍යයනයක්",
      ta: "இலங்கை கடற்கரையோரத்தில் கடல் பல்லுயிர் வடிவங்கள் பற்றிய விரிவான ஆய்வு"
    },
    abstract: {
      en: "This study presents findings from a three-year survey of marine biodiversity in Sri Lankan waters. We documented 342 species across 15 coastal sites, revealing significant variations in species composition between the east and west coasts. Climate change impacts and conservation recommendations are discussed.",
      si: "මෙම අධ්‍යයනය ශ්‍රී ලංකා ජලයේ සමුද්‍ර ජෛව විවිධත්වය පිළිබඳ තුන් අවුරුදු සමීක්ෂණයකින් ලබාගත් සොයාගැනීම් ඉදිරිපත් කරයි. අපි වෙරළබඩ ස්ථාන 15ක් හරහා විශේෂ 342ක් ලේඛනගත කළෙමු, නැගෙනහිර සහ බටහිර වෙරළ අතර විශේෂ සංයුතියේ සැලකිය යුතු වෙනස්කම් හෙළි කරමින්. දේශගුණික විපර්යාස බලපෑම් සහ සංරක්ෂණ නිර්දේශ සාකච්ඡා කෙරේ.",
      ta: "இந்த ஆய்வு இலங்கை நீரில் கடல் பல்லுயிர் பற்றிய மூன்று ஆண்டு கணக்கெடுப்பின் கண்டுபிடிப்புகளை வழங்குகிறது. 15 கடலோர தளங்களில் 342 இனங்களை நாங்கள் ஆவணப்படுத்தினோம், கிழக்கு மற்றும் மேற்கு கடற்கரைகளுக்கு இடையே இன அமைப்பில் குறிப்பிடத்தக்க மாறுபாடுகளை வெளிப்படுத்தினோம்."
    },
    fullContent: {
      en: "Introduction\n\nSri Lanka's coastal waters harbor exceptional marine biodiversity...\n\nMethodology\n\nWe conducted systematic surveys at 15 sites...\n\nResults\n\nOur findings reveal 342 documented species...",
      si: "හැඳින්වීම\n\nශ්‍රී ලංකාවේ වෙරළබඩ ජලය සුවිශේෂී සමුද්‍ර ජෛව විවිධත්වයක් ඇත...\n\nක්‍රමවේදය\n\nඅපි ස්ථාන 15ක ක්‍රමානුකූල සමීක්ෂණ පැවැත්වූයෙමු...",
      ta: "அறிமுகம்\n\nஇலங்கையின் கடலோர நீர் விதிவிலக்கான கடல் பல்லுயிர்களை கொண்டுள்ளது...\n\nமுறைமை\n\n15 தளங்களில் முறையான கணக்கெடுப்புகளை நடத்தினோம்..."
    },
    authors: ["Dr. Nimal Perera", "Prof. Chandrika Silva", "Dr. Rajesh Kumar"],
    category: "marineEcology",
    tags: ["biodiversity", "conservation", "coastal ecology", "Sri Lanka"],
    publicationDate: "2024-03-15",
    doi: "10.1234/marine.2024.001",
    journal: "Journal of Marine Science",
    volume: "45",
    issue: "2",
    pages: "123-145",
    language: "en",
    status: "published",
    uploadedBy: "sample-user-id",
    views: 245,
    downloads: 67,
    bookmarks: 23
  },
  {
    title: {
      en: "Climate Change Impacts on Coral Reef Ecosystems",
      si: "කොරල් පර පරිසර පද්ධති මත දේශගුණික විපර්යාස බලපෑම්",
      ta: "பவள பாறை சுற்றுச்சூழல் அமைப்புகளில் காலநிலை மாற்றத்தின் தாக்கங்கள்"
    },
    description: {
      en: "Analysis of coral bleaching events and reef resilience in tropical waters",
      si: "නිවර්තන ජලයේ කොරල් විරංජනය සහ පර ඔරොත්තු දීමේ හැකියාව විශ්ලේෂණය",
      ta: "வெப்பமண்டல நீரில் பவள வெளுப்பு நிகழ்வுகள் மற்றும் பாறை நெகிழ்ச்சி பகுப்பாய்வு"
    },
    abstract: {
      en: "Rising ocean temperatures have led to unprecedented coral bleaching events. This research examines bleaching patterns, recovery rates, and identifies resilient coral species that may survive future warming scenarios.",
      si: "වැඩිවන සාගර උෂ්ණත්වය පෙර නොවූ විරූ කොරල් විරංජන සිදුවීම් වලට හේතු වී ඇත. මෙම පර්යේෂණය විරංජන රටා, ප්‍රකෘතිමත් වීමේ අනුපාත පරීක්ෂා කරන අතර අනාගත උණුසුම් අවස්ථා වලදී පැවතිය හැකි ඔරොත්තු දෙන කොරල් විශේෂ හඳුනා ගනී.",
      ta: "அதிகரித்து வரும் கடல் வெப்பநிலை முன்னோடியில்லாத பவள வெளுப்பு நிகழ்வுகளுக்கு வழிவகுத்தது. இந்த ஆராய்ச்சி வெளுப்பு வடிவங்கள், மீட்பு விகிதங்களை ஆராய்கிறது."
    },
    fullContent: {
      en: "Executive Summary\n\nCoral reefs face existential threats from climate change...\n\nBackground\n\nCoral bleaching occurs when...",
      si: "විධායක සාරාංශය\n\nකොරල් පර දේශගුණික විපර්යාස වලින් පැවැත්මේ තර්ජන වලට මුහුණ දෙයි...",
      ta: "நிர்வாக சுருக்கம்\n\nபவள பாறைகள் காலநிலை மாற்றத்திலிருந்து இருத்தலியல் அச்சுறுத்தல்களை எதிர்கொள்கின்றன..."
    },
    authors: ["Dr. Amara Fernando", "Prof. Sunil Wickramasinghe"],
    category: "climateChange",
    tags: ["coral reefs", "climate change", "ocean warming", "bleaching"],
    publicationDate: "2024-01-20",
    doi: "10.1234/climate.2024.002",
    journal: "Climate and Marine Biology",
    volume: "12",
    issue: "1",
    pages: "45-78",
    language: "en",
    status: "published",
    uploadedBy: "sample-user-id",
    views: 189,
    downloads: 52,
    bookmarks: 18
  },
  {
    title: {
      en: "Sustainable Fisheries Management in the Indian Ocean",
      si: "ඉන්දියන් සාගරයේ තිරසාර ධීවර කළමනාකරණය",
      ta: "இந்தியப் பெருங்கடலில் நிலையான மீன்வள மேலாண்மை"
    },
    description: {
      en: "Policy recommendations for sustainable fishing practices",
      si: "තිරසාර මසුන් ඇල්ලීමේ පිළිවෙත් සඳහා ප්‍රතිපත්ති නිර්දේශ",
      ta: "நிலையான மீன்பிடி நடைமுறைகளுக்கான கொள்கை பரிந்துரைகள்"
    },
    abstract: {
      en: "This policy paper presents evidence-based recommendations for sustainable fisheries management in the Indian Ocean region, addressing overfishing, bycatch reduction, and community-based management approaches.",
      si: "මෙම ප්‍රතිපත්ති ලිපිය ඉන්දියන් සාගර කලාපයේ තිරසාර ධීවර කළමනාකරණය සඳහා සාක්ෂි පදනම් කරගත් නිර්දේශ ඉදිරිපත් කරයි.",
      ta: "இந்த கொள்கை ஆவணம் இந்தியப் பெருங்கடல் பிராந்தியத்தில் நிலையான மீன்வள மேலாண்மைக்கான சான்று அடிப்படையிலான பரிந்துரைகளை வழங்குகிறது."
    },
    fullContent: {
      en: "Policy Framework\n\nSustainable fisheries require integrated management...\n\nCurrent Challenges\n\nOverfishing threatens...",
      si: "ප්‍රතිපත්ති රාමුව\n\nතිරසාර ධීවර කර්මාන්තයට ඒකාබද්ධ කළමනාකරණය අවශ්‍ය වේ...",
      ta: "கொள்கை கட்டமைப்பு\n\nநிலையான மீன்வளத்திற்கு ஒருங்கிணைந்த மேலாண்மை தேவை..."
    },
    authors: ["Dr. Lakshmi Jayawardena", "Prof. Ravi Shankar", "Dr. Priya Mendis"],
    category: "fisheries",
    tags: ["sustainable fishing", "policy", "ocean management", "conservation"],
    publicationDate: "2023-11-10",
    doi: "10.1234/fisheries.2023.003",
    journal: "Marine Policy Journal",
    volume: "78",
    issue: "4",
    pages: "201-225",
    language: "en",
    status: "published",
    uploadedBy: "sample-user-id",
    views: 312,
    downloads: 89,
    bookmarks: 34
  }
];

async function seedData() {
  console.log('🌊 Starting Research Content Seeding...\n');

  try {
    for (const paper of sampleResearchPapers) {
      const docData = {
        ...paper,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'researchContent'), docData);
      console.log(`✅ Added: ${paper.title.en}`);
      console.log(`   ID: ${docRef.id}\n`);
    }

    console.log('🎉 Successfully seeded all research papers!');
    console.log(`📊 Total papers added: ${sampleResearchPapers.length}`);
    console.log('\n🔗 Visit: https://nara-web-73384.web.app/research-excellence-portal');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedData();
