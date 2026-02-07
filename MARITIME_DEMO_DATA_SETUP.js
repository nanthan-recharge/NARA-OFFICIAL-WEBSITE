// Maritime Services Demo Data Setup Script
// Run this in your browser console on the admin page or create a setup button

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Your Firebase config (copy from src/firebase.js)
const firebaseConfig = {
  // Add your config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Demo Vessels Data
const demoVessels = [
  {
    id: 'NARA-001',
    name: {
      en: 'RV Ocean Explorer',
      si: 'සාගර ගවේෂකයා',
      ta: 'கடல் ஆராய்ச்சி கப்பல்'
    },
    type: 'research_vessel',
    status: 'active',
    speed: 12.5,
    heading: 45,
    position: { lat: 6.9271, lon: 79.8612 },
    crew: 24,
    mission: {
      en: 'Deep Sea Survey',
      si: 'ගැඹුරු මුහුදු සමීක්ෂණය',
      ta: 'ஆழ் கடல் ஆய்வு'
    },
    lastUpdate: serverTimestamp()
  },
  {
    id: 'FISH-245',
    name: {
      en: 'MV Blue Horizon',
      si: 'නිල් ක්ෂිතිජය',
      ta: 'நீல அடிவானம்'
    },
    type: 'fishing_vessel',
    status: 'in_port',
    speed: 0,
    heading: 180,
    position: { lat: 7.2906, lon: 79.8428 },
    crew: 12,
    mission: {
      en: 'Maintenance',
      si: 'නඩත්තුව',
      ta: 'பராமரிப்பு'
    },
    lastUpdate: serverTimestamp()
  },
  {
    id: 'CARGO-789',
    name: {
      en: 'MV Sri Lanka Pride',
      si: 'ශ්‍රී ලංකා ආඩම්බරය',
      ta: 'இலங்கை பெருமை'
    },
    type: 'cargo',
    status: 'active',
    speed: 8.2,
    heading: 270,
    position: { lat: 6.9419, lon: 79.8433 },
    crew: 35,
    mission: {
      en: 'Export Transit',
      si: 'අපනයන ප්‍රවාහනය',
      ta: 'ஏற்றுமதி போக்குவரத்து'
    },
    lastUpdate: serverTimestamp()
  },
  {
    id: 'RESEARCH-456',
    name: {
      en: 'RV Marine Discovery',
      si: 'සාගර සොයා ගැනීම',
      ta: 'கடல் கண்டுபிடிப்பு'
    },
    type: 'research_vessel',
    status: 'active',
    speed: 10.0,
    heading: 90,
    position: { lat: 6.0329, lon: 80.2168 },
    crew: 18,
    mission: {
      en: 'Coral Reef Study',
      si: 'කොරල් පර අධ්‍යයනය',
      ta: 'பவளப்பாறை ஆய்வு'
    },
    lastUpdate: serverTimestamp()
  },
  {
    id: 'PATROL-123',
    name: {
      en: 'Coast Guard Vigilant',
      si: 'වෙරළ ආරක්ෂක අවදානම',
      ta: 'கடற்கரை காவல் விழிப்பு'
    },
    type: 'patrol',
    status: 'active',
    speed: 15.0,
    heading: 180,
    position: { lat: 7.8731, lon: 80.7718 },
    crew: 20,
    mission: {
      en: 'Maritime Security Patrol',
      si: 'සමුද්‍ර ආරක්ෂණ මුර සංචාරය',
      ta: 'கடல்சார் பாதுகாப்பு ரோந்து'
    },
    lastUpdate: serverTimestamp()
  }
];

// Demo Ports Data
const demoPorts = [
  {
    id: 'LKCMB',
    name: {
      en: 'Colombo Port',
      si: 'කොළඹ වරාය',
      ta: 'கொழும்பு துறைமுகம்'
    },
    code: 'LKCMB',
    vessels: 47,
    capacity: 85,
    weather: {
      condition: 'clear',
      temp: 28,
      wind: 12,
      humidity: 75
    },
    status: 'operational',
    location: { lat: 6.9271, lon: 79.8612 },
    facilities: ['Container Terminal', 'Bulk Terminal', 'Oil Terminal'],
    lastUpdate: serverTimestamp()
  },
  {
    id: 'LKHAM',
    name: {
      en: 'Hambantota Port',
      si: 'හම්බන්තොට වරාය',
      ta: 'ஹம்பாந்தோட்டை துறைமுகம்'
    },
    code: 'LKHAM',
    vessels: 12,
    capacity: 45,
    weather: {
      condition: 'cloudy',
      temp: 29,
      wind: 15,
      humidity: 70
    },
    status: 'operational',
    location: { lat: 6.1241, lon: 81.1185 },
    facilities: ['Container Terminal', 'Bunkering', 'Ship Repair'],
    lastUpdate: serverTimestamp()
  },
  {
    id: 'LKGAL',
    name: {
      en: 'Galle Port',
      si: 'ගාල්ල වරාය',
      ta: 'காலி துறைமுகம்'
    },
    code: 'LKGAL',
    vessels: 8,
    capacity: 62,
    weather: {
      condition: 'light_rain',
      temp: 27,
      wind: 18,
      humidity: 85
    },
    status: 'operational',
    location: { lat: 6.0329, lon: 80.2168 },
    facilities: ['Fishing Harbor', 'Passenger Terminal'],
    lastUpdate: serverTimestamp()
  },
  {
    id: 'LKTRI',
    name: {
      en: 'Trincomalee Port',
      si: 'ත්‍රිකුණාමලය වරාය',
      ta: 'திருகோணமலை துறைமுகம்'
    },
    code: 'LKTRI',
    vessels: 15,
    capacity: 55,
    weather: {
      condition: 'clear',
      temp: 30,
      wind: 10,
      humidity: 68
    },
    status: 'operational',
    location: { lat: 8.5874, lon: 81.2152 },
    facilities: ['Deep Water Harbor', 'Oil Terminal', 'Naval Base'],
    lastUpdate: serverTimestamp()
  }
];

// Demo Maritime Services
const demoServices = [
  {
    id: 'service-001',
    title: {
      en: 'Vessel Safety Inspection',
      si: 'යාත්‍රා ආරක්ෂණ පරීක්ෂණය',
      ta: 'கப்பல் பாதுகாப்பு ஆய்வு'
    },
    description: {
      en: 'Comprehensive safety inspection for all vessel types including hull integrity, navigation equipment, and emergency systems',
      si: 'බඳ අඛණ්ඩතාව, යාත්‍රා උපකරණ සහ හදිසි පද්ධති ඇතුළු සියලුම යාත්‍රා වර්ග සඳහා සම්පූර්ණ ආරක්ෂණ පරීක්ෂණය',
      ta: 'கப்பல் ஒருமைப்பாடு, வழிசெலுத்தல் உபகரணங்கள் மற்றும் அவசர அமைப்புகள் உட்பட அனைத்து கப்பல் வகைகளுக்கும் விரிவான பாதுகாப்பு ஆய்வு'
    },
    category: 'inspection',
    price: 15000,
    duration: '2-3 hours',
    requirements: ['Valid vessel registration', 'Insurance certificate', 'Previous inspection records'],
    icon: 'ClipboardCheck',
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    id: 'service-002',
    title: {
      en: 'Commercial Fishing License',
      si: 'වාණිජ මසුන් ඇල්ලීමේ බලපත්‍රය',
      ta: 'வணிக மீன்பிடி உரிமம்'
    },
    description: {
      en: 'Apply for or renew commercial fishing licenses for Sri Lankan waters with designated fishing zones',
      si: 'නිර්දේශිත මසුන් ඇල්ලීමේ කලාප සහිත ශ්‍රී ලංකා ජලය සඳහා වාණිජ මසුන් ඇල්ලීමේ බලපත්‍ර සඳහා අයදුම් කරන්න හෝ අලුත් කරන්න',
      ta: 'நியமிக்கப்பட்ட மீன்பிடி மண்டலங்களுடன் இலங்கை நீர்நிலைகளுக்கான வணிக மீன்பிடி உரிமங்களை விண்ணப்பிக்கவும் அல்லது புதுப்பிக்கவும்'
    },
    category: 'permit',
    price: 5000,
    duration: '5-7 business days',
    requirements: ['Vessel ownership proof', 'Crew list', 'Fishing equipment inventory'],
    icon: 'FileCheck',
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    id: 'service-003',
    title: {
      en: 'Vessel Registration & Documentation',
      si: 'යාත්‍රා ලියාපදිංචිය සහ ලේඛනගත කිරීම',
      ta: 'கப்பல் பதிவு & ஆவணப்படுத்தல்'
    },
    description: {
      en: 'Complete vessel registration services for new and imported vessels including documentation processing',
      si: 'ලේඛන සැකසීම ඇතුළු නව සහ ආනයනය කළ යාත්‍රා සඳහා සම්පූර්ණ යාත්‍රා ලියාපදිංචි සේවා',
      ta: 'ஆவணச் செயலாக்கம் உட்பட புதிய மற்றும் இறக்குமதி செய்யப்பட்ட கப்பல்களுக்கான முழுமையான கப்பல் பதிவு சேவைகள்'
    },
    category: 'license',
    price: 10000,
    duration: '3-5 business days',
    requirements: ['Bill of sale', 'Builder certificate', 'Previous registration (if applicable)'],
    icon: 'FileText',
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    id: 'service-004',
    title: {
      en: 'Maritime Safety Training Course',
      si: 'සමුද්‍ර ආරක්ෂණ පුහුණු පා course මාලාව',
      ta: 'கடல்சார் பாதுகாப்பு பயிற்சி பாடநெறி'
    },
    description: {
      en: 'Certified maritime safety training including fire safety, man overboard procedures, and emergency response',
      si: 'ගිනි ආරක්ෂාව, මිනිසා යාත්‍රාවෙන් බැස යාමේ ක්‍රියාපටිපාටිය සහ හදිසි ප්‍රතිචාරය ඇතුළු සහතිකපත් ලත් සමුද්‍ර ආරක්ෂණ පුහුණුව',
      ta: 'தீ பாதுகாப்பு, மனிதன் கப்பலில் இருந்து விழுதல் நடைமுறைகள் மற்றும் அவசர பதில் உள்ளிட்ட சான்றளிக்கப்பட்ட கடல்சார் பாதுகாப்பு பயிற்சி'
    },
    category: 'training',
    price: 8000,
    duration: '1 full day',
    requirements: ['Valid ID', 'Medical fitness certificate'],
    icon: 'GraduationCap',
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    id: 'service-005',
    title: {
      en: 'Marine Emergency Response',
      si: 'සමුද්‍ර හදිසි ප්‍රතිචාරය',
      ta: 'கடல் அவசர பதில்'
    },
    description: {
      en: '24/7 emergency response service for maritime incidents including search and rescue operations',
      si: 'සෙවීම් සහ ගලවා ගැනීමේ මෙහෙයුම් ඇතුළු සමුද්‍ර සිදුවීම් සඳහා 24/7 හදිසි ප්‍රතිචාර සේවාව',
      ta: 'தேடல் மற்றும் மீட்பு நடவடிக்கைகள் உட்பட கடல்சார் சம்பவங்களுக்கான 24/7 அவசர பதில் சேவை'
    },
    category: 'emergency',
    price: 0,
    duration: 'Immediate',
    requirements: ['Emergency call to 1915'],
    icon: 'AlertCircle',
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

// Demo Maritime Alerts
const demoAlerts = [
  {
    id: 'alert-001',
    severity: 'high',
    type: 'weather',
    title: {
      en: 'Strong Wind Warning - South Coast',
      si: 'තද සුළං අනතුරු ඇඟවීම - දකුණු වෙරළ',
      ta: 'கடும் காற்று எச்சரிக்கை - தென் கடற்கரை'
    },
    description: {
      en: 'Strong winds of 40-50 km/h expected in southern coastal areas. Small fishing vessels advised to return to port.',
      si: 'දකුණු වෙරළ ප්‍රදේශවල පැයට කිලෝමීටර 40-50 ක තද සුළං අපේක්ෂා කෙරේ. කුඩා මසුන් ඇල්ලීමේ යාත්‍රා වරායට ආපසු යාමට උපදෙස් දෙනු ලැබේ.',
      ta: 'தென் கடற்கரை பகுதிகளில் மணிக்கு 40-50 கி.மீ வேகத்தில் கடும் காற்று எதிர்பார்க்கப்படுகிறது. சிறிய மீன்பிடி கப்பல்கள் துறைமுகத்திற்கு திரும்ப அறிவுறுத்தப்படுகின்றன.'
    },
    affectedAreas: ['Galle', 'Matara', 'Hambantota'],
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'active',
    createdAt: serverTimestamp()
  },
  {
    id: 'alert-002',
    severity: 'medium',
    type: 'navigation',
    title: {
      en: 'Navigation Buoy Maintenance - Colombo Harbor',
      si: 'යාත්‍රා බෝයි නඩත්තුව - කොළඹ වරාය',
      ta: 'வழிசெலுத்தல் மிதவை பராமரிப்பு - கொழும்பு துறைமுகம்'
    },
    description: {
      en: 'Navigation buoys near Colombo harbor entrance will be under maintenance. Vessels should exercise caution.',
      si: 'කොළඹ වරාය ප්‍රවේශය අසල යාත්‍රා බෝයි නඩත්තුවක් යටතේ පවතී. යාත්‍රා ප්‍රවේශම් විය යුතුය.',
      ta: 'கொழும்பு துறைமுக நுழைவாயில் அருகே வழிசெலுத்தல் மிதவைகள் பராமரிப்பில் இருக்கும். கப்பல்கள் எச்சரிக்கையுடன் இருக்க வேண்டும்.'
    },
    affectedAreas: ['Colombo'],
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000),
    status: 'active',
    createdAt: serverTimestamp()
  }
];

// Function to seed all demo data
async function seedMaritimeData() {
  console.log('🚀 Starting Maritime Demo Data Setup...');

  try {
    // Add Vessels
    console.log('📍 Adding demo vessels...');
    for (const vessel of demoVessels) {
      await setDoc(doc(db, 'maritime_vessels', vessel.id), vessel);
      console.log(`✓ Added vessel: ${vessel.name.en}`);
    }

    // Add Ports
    console.log('⚓ Adding demo ports...');
    for (const port of demoPorts) {
      await setDoc(doc(db, 'maritime_ports', port.id), port);
      console.log(`✓ Added port: ${port.name.en}`);
    }

    // Add Services
    console.log('💼 Adding demo services...');
    for (const service of demoServices) {
      await setDoc(doc(db, 'maritime_services', service.id), service);
      console.log(`✓ Added service: ${service.title.en}`);
    }

    // Add Alerts
    console.log('⚠️  Adding demo alerts...');
    for (const alert of demoAlerts) {
      await setDoc(doc(db, 'maritime_alerts', alert.id), alert);
      console.log(`✓ Added alert: ${alert.title.en}`);
    }

    console.log('✅ Maritime demo data setup complete!');
    console.log('🌐 Visit: https://nara-web-73384.web.app/maritime-services-hub');
    console.log('🔧 Admin: https://nara-web-73384.web.app/admin/maritime');
    
    return {
      success: true,
      message: 'Demo data added successfully!',
      counts: {
        vessels: demoVessels.length,
        ports: demoPorts.length,
        services: demoServices.length,
        alerts: demoAlerts.length
      }
    };
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for use
export { seedMaritimeData, demoVessels, demoPorts, demoServices, demoAlerts };

// If running directly, execute
if (typeof window !== 'undefined') {
  window.seedMaritimeData = seedMaritimeData;
  console.log('💡 Run: seedMaritimeData() to populate demo data');
}
