import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import StitchWrapper from '../../components/shared/StitchWrapper';
import useThemeStore from '../../store/theme';
import {
  getCourses,
  getCategories,
  enrollInCourse,
  getPapers,
  getTrainingMaterials,
  submitProject,
  uploadFile,
  searchContent,
  getTrainingEvents,
  registerForTrainingEvent
} from '../../services/ldaService';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { useNavigate } from 'react-router-dom';

// Static fallback data with trilingual structure
const staticCategories = [
  {
    id: '1',
    name: {
      en: 'Ocean Science',
      si: 'සාගර විද්‍යාව',
      ta: 'கடல் அறிவியல்'
    }
  },
  {
    id: '2',
    name: {
      en: 'Marine Biology',
      si: 'සමුද්‍ර ජීව විද්‍යාව',
      ta: 'கடல் உயிரியல்'
    }
  },
  {
    id: '3',
    name: {
      en: 'Fisheries Science',
      si: 'මත්ස්‍ය විද්‍යාව',
      ta: 'மீன்வள அறிவியல்'
    }
  },
  {
    id: '4',
    name: {
      en: 'Research Methods',
      si: 'පර්යේෂණ ක්‍රම',
      ta: 'ஆராய்ச்சி முறைகள்'
    }
  },
  {
    id: '5',
    name: {
      en: 'Aquaculture',
      si: 'ජලජීවී වගාව',
      ta: 'நீர்வாழ் வளர்ப்பு'
    }
  },
  {
    id: '6',
    name: {
      en: 'Ocean Conservation',
      si: 'සාගර සංරක්ෂණය',
      ta: 'கடல் பாதுகாப்பு'
    }
  },
  {
    id: '7',
    name: {
      en: 'Marine Technology',
      si: 'සමුද්‍ර තාක්ෂණය',
      ta: 'கடல் தொழில்நுட்பம்'
    }
  },
  {
    id: '8',
    name: {
      en: 'Climate & Environment',
      si: 'දේශගුණය සහ පරිසරය',
      ta: 'காலநிலை மற்றும் சுற்றுச்சூழல்'
    }
  }
];

const staticCourses = [
  {
    id: '1',
    title: {
      en: 'Introduction to Marine Science',
      si: 'සමුද්‍ර විද්‍යාවට හැඳින්වීම',
      ta: 'கடல் அறிவியலுக்கு அறிமுகம்'
    },
    description: {
      en: 'Comprehensive introduction to oceanography, marine ecosystems, and coastal processes. Learn about ocean currents, tides, and marine life.',
      si: 'සාගර විද්‍යාව, සමුද්‍ර පරිසර පද්ධති සහ වෙරළ ක්‍රියාවලීන් පිළිබඳ විස්තීර්ණ හැඳින්වීම. සාගර ධාරා, වඩදිය බාදිය සහ සමුද්‍ර ජීවීන් ගැන ඉගෙන ගන්න.',
      ta: 'கடல்சார் அறிவியல், கடல் சுற்றுச்சூழல் அமைப்புகள் மற்றும் கடலோர செயல்முறைகள் பற்றிய விரிவான அறிமுகம். கடல் நீரோட்டங்கள், அலைகள் மற்றும் கடல் உயிரினங்களைப் பற்றி அறியுங்கள்.'
    },
    category: '1',
    level: 'beginner',
    duration: 12,
    enrolledCount: 245,
    averageRating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop'
  },
  {
    id: '2',
    title: {
      en: 'Advanced Marine Biology',
      si: 'උසස් සමුද්‍ර ජීව විද්‍යාව',
      ta: 'மேம்பட்ட கடல் உயிரியல்'
    },
    description: {
      en: 'Deep dive into marine organisms, biodiversity, and conservation strategies. Study coral reefs, marine mammals, and ecosystem dynamics.',
      si: 'සමුද්‍ර ජීවීන්, ජෛව විවිධත්වය සහ සංරක්ෂණ උපාය මාර්ග පිළිබඳ ගැඹුරු අධ්‍යයනය. කොරල් පර, සමුද්‍ර ක්ෂීරපායින් සහ පරිසර පද්ධති ගතිකත්වය අධ්‍යයනය කරන්න.',
      ta: 'கடல் உயிரினங்கள், பல்லுயிர் மற்றும் பாதுகாப்பு உத்திகள் பற்றிய ஆழமான ஆய்வு. பவளப்பாறைகள், கடல் பாலூட்டிகள் மற்றும் சுற்றுச்சூழல் இயக்கவியல் படிக்கவும்.'
    },
    category: '2',
    level: 'advanced',
    duration: 16,
    enrolledCount: 189,
    averageRating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=500&fit=crop'
  },
  {
    id: '3',
    title: {
      en: 'Sustainable Fisheries Management',
      si: 'තිරසාර මත්ස්‍ය කළමනාකරණය',
      ta: 'நிலையான மீன்வள மேலாண்மை'
    },
    description: {
      en: 'Sustainable fisheries practices, stock assessment, and marine resource management. Learn modern fishing techniques and conservation methods.',
      si: 'තිරසාර මත්ස්‍ය ක්‍රියාවලීන්, තොග තක්සේරුව සහ සමුද්‍ර සම්පත් කළමනාකරණය. නවීන මසුන් ඇල්ලීමේ ක්‍රම සහ සංරක්ෂණ ක්‍රම ඉගෙන ගන්න.',
      ta: 'நிலையான மீன்வள நடைமுறைகள், இருப்பு மதிப்பீடு மற்றும் கடல் வள மேலாண்மை. நவீன மீன்பிடி நுட்பங்கள் மற்றும் பாதுகாப்பு முறைகளைக் கற்றுக்கொள்ளுங்கள்.'
    },
    category: '3',
    level: 'intermediate',
    duration: 14,
    enrolledCount: 312,
    averageRating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop'
  },
  {
    id: '4',
    title: {
      en: 'Marine Research Techniques',
      si: 'සමුද්‍ර පර්යේෂණ තාක්ෂණ',
      ta: 'கடல் ஆராய்ச்சி நுட்பங்கள்'
    },
    description: {
      en: 'Modern research methodologies, data collection, and analysis for marine science. Master field sampling, laboratory techniques, and data interpretation.',
      si: 'සමුද්‍ර විද්‍යාව සඳහා නවීන පර්යේෂණ ක්‍රමවේද, දත්ත එකතු කිරීම සහ විශ්ලේෂණය. ක්ෂේත්‍ර නියැදි, රසායනාගාර තාක්ෂණ සහ දත්ත විග්‍රහය ප්‍රගුණ කරන්න.',
      ta: 'கடல் அறிவியலுக்கான நவீன ஆராய்ச்சி முறைகள், தரவு சேகரிப்பு மற்றும் பகுப்பாய்வு. கள மாதிரி, ஆய்வக நுட்பங்கள் மற்றும் தரவு விளக்கத்தில் தேர்ச்சி பெறுங்கள்.'
    },
    category: '4',
    level: 'intermediate',
    duration: 10,
    enrolledCount: 156,
    averageRating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop'
  },
  {
    id: '5',
    title: {
      en: 'Coastal Aquaculture Systems',
      si: 'වෙරළබඩ ජලජීවී වගා පද්ධති',
      ta: 'கடலோர நீர்வள வளர்ப்பு அமைப்புகள்'
    },
    description: {
      en: 'Learn shrimp farming, fish culture, and sustainable aquaculture practices. Includes pond management, water quality control, and disease prevention.',
      si: 'ඉස්සන් වගාව, මත්ස්‍ය සංස්කෘතිය සහ තිරසාර ජලජීවී වගා ක්‍රම ඉගෙන ගන්න. පොකුණු කළමනාකරණය, ජල තත්ත්ව පාලනය සහ රෝග වැළැක්වීම ඇතුළත් වේ.',
      ta: 'இறால் வளர்ப்பு, மீன் வளர்ப்பு மற்றும் நிலையான நீர்வள நடைமுறைகளைக் கற்றுக்கொள்ளுங்கள். குளம் மேலாண்மை, நீர் தர கட்டுப்பாடு மற்றும் நோய் தடுப்பு அடங்கும்.'
    },
    category: '5',
    level: 'intermediate',
    duration: 18,
    enrolledCount: 278,
    averageRating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&h=500&fit=crop'
  },
  {
    id: '6',
    title: {
      en: 'Coral Reef Conservation',
      si: 'කොරල් පර සංරක්ෂණය',
      ta: 'பவளப்பாறை பாதுகாப்பு'
    },
    description: {
      en: 'Protect and restore coral reef ecosystems. Study reef ecology, bleaching events, restoration techniques, and community-based conservation.',
      si: 'කොරල් පර පරිසර පද්ධති ආරක්ෂා කර ප්‍රතිස්ථාපනය කරන්න. පර පරිසර විද්‍යාව, විරංජනය, ප්‍රතිස්ථාපන තාක්ෂණ සහ ප්‍රජා පදනම් වූ සංරක්ෂණය අධ්‍යයනය කරන්න.',
      ta: 'பவளப்பாறை சுற்றுச்சூழல் அமைப்புகளைப் பாதுகாத்து மீட்டெடுக்கவும். பாறை சூழலியல், வெளுப்பு நிகழ்வுகள், மீட்பு நுட்பங்கள் மற்றும் சமூக அடிப்படையிலான பாதுகாப்பு படிக்கவும்.'
    },
    category: '6',
    level: 'advanced',
    duration: 12,
    enrolledCount: 194,
    averageRating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=500&fit=crop'
  },
  {
    id: '7',
    title: {
      en: 'Marine Remote Sensing',
      si: 'සමුද්‍ර දුරස්ථ සංවේදනය',
      ta: 'கடல் தொலை உணர்தல்'
    },
    description: {
      en: 'Use satellite technology for ocean monitoring. Learn GIS, remote sensing data analysis, ocean color analysis, and temperature mapping.',
      si: 'සාගර අධීක්ෂණය සඳහා චන්ද්‍රිකා තාක්ෂණය භාවිතා කරන්න. GIS, දුරස්ථ සංවේදන දත්ත විශ්ලේෂණය, සාගර වර්ණ විශ්ලේෂණය සහ උෂ්ණත්ව සිතියම් ඇඳීම ඉගෙන ගන්න.',
      ta: 'கடல் கண்காணிப்புக்கான செயற்கைக்கோள் தொழில்நுட்பத்தைப் பயன்படுத்தவும். GIS, தொலை உணர்தல் தரவு பகுப்பாய்வு, கடல் நிற பகுப்பாய்வு மற்றும் வெப்பநிலை வரைபடமாக்கல் கற்றுக்கொள்ளுங்கள்.'
    },
    category: '7',
    level: 'advanced',
    duration: 14,
    enrolledCount: 167,
    averageRating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=500&fit=crop'
  },
  {
    id: '8',
    title: {
      en: 'Climate Change & Ocean Impacts',
      si: 'දේශගුණ වෙනස් වීම සහ සාගර බලපෑම්',
      ta: 'காலநிலை மாற்றம் & கடல் தாக்கங்கள்'
    },
    description: {
      en: 'Understand ocean warming, acidification, and sea level rise. Study climate models, adaptation strategies, and mitigation approaches.',
      si: 'සාගර උණුසුම, ආම්ලීකරණය සහ මුහුදු මට්ටම ඉහළ යෑම තේරුම් ගන්න. දේශගුණ ආකෘති, අනුවර්තන උපාය මාර්ග සහ සමනය කිරීමේ ප්‍රවේශයන් අධ්‍යයනය කරන්න.',
      ta: 'கடல் வெப்பமயமாதல், அமிலமயமாக்கல் மற்றும் கடல் மட்ட உயர்வு புரிந்துகொள்ளுங்கள். காலநிலை மாதிரிகள், தழுவல் உத்திகள் மற்றும் தணிப்பு அணுகுமுறைகளைப் படிக்கவும்.'
    },
    category: '8',
    level: 'intermediate',
    duration: 16,
    enrolledCount: 223,
    averageRating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=500&fit=crop'
  },
  {
    id: '9',
    title: {
      en: 'Deep Sea Exploration',
      si: 'ගැඹුරු සාගර ගවේෂණය',
      ta: 'ஆழ்கடல் ஆய்வு'
    },
    description: {
      en: 'Explore the deep ocean using ROVs and submarines. Study deep-sea organisms, hydrothermal vents, and abyssal ecosystems.',
      si: 'ROV සහ සබ්මැරීන භාවිතයෙන් ගැඹුරු සාගරය ගවේෂණය කරන්න. ගැඹුරු සාගර ජීවීන්, හයිඩ්‍රොතර්මල් වාතාශ්‍රය සහ අගාධ පරිසර පද්ධති අධ්‍යයනය කරන්න.',
      ta: 'ROV மற்றும் நீர்மூழ்கிக் கப்பல்களைப் பயன்படுத்தி ஆழ்கடலை ஆராயுங்கள். ஆழ்கடல் உயிரினங்கள், நீர் வெப்ப துவாரங்கள் மற்றும் பள்ளத்தாக்கு சுற்றுச்சூழல் அமைப்புகளைப் படிக்கவும்.'
    },
    category: '1',
    level: 'advanced',
    duration: 20,
    enrolledCount: 142,
    averageRating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop'
  },
  {
    id: '10',
    title: {
      en: 'Marine Biotechnology',
      si: 'සමුද්‍ර ජෛව තාක්ෂණය',
      ta: 'கடல் உயிரி தொழில்நுட்பம்'
    },
    description: {
      en: 'Discover marine bioactive compounds, pharmaceuticals from the sea, and genetic engineering of marine organisms.',
      si: 'සමුද්‍ර ජෛව ක්‍රියාකාරී සංයෝග, මුහුදෙන් ඖෂධ සහ සමුද්‍ර ජීවීන්ගේ ජාන ඉංජිනේරු විද්‍යාව සොයා ගන්න.',
      ta: 'கடல் உயிர் செயல்பாட்டு சேர்மங்கள், கடலில் இருந்து மருந்துகள் மற்றும் கடல் உயிரினங்களின் மரபணு பொறியியல் கண்டறியுங்கள்.'
    },
    category: '7',
    level: 'advanced',
    duration: 15,
    enrolledCount: 176,
    averageRating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=500&fit=crop'
  },
  {
    id: '11',
    title: {
      en: 'Mangrove Ecology & Restoration',
      si: 'කඩොලාන පරිසර විද්‍යාව සහ ප්‍රතිස්ථාපනය',
      ta: 'சதுப்புநில சூழலியல் & மீட்பு'
    },
    description: {
      en: 'Study mangrove ecosystems, their role in coastal protection, and restoration techniques for degraded mangrove forests.',
      si: 'කඩොලාන පරිසර පද්ධති, වෙරළ ආරක්ෂණයේ ඔවුන්ගේ කාර්යභාරය සහ පිරිහුණු කඩොලාන වනාන්තර සඳහා ප්‍රතිස්ථාපන තාක්ෂණ අධ්‍යයනය කරන්න.',
      ta: 'சதுப்புநில சுற்றுச்சூழல் அமைப்புகள், கடலோர பாதுகாப்பில் அவற்றின் பங்கு மற்றும் சீரழிந்த சதுப்புநில காடுகளுக்கான மீட்பு நுட்பங்களைப் படிக்கவும்.'
    },
    category: '6',
    level: 'intermediate',
    duration: 11,
    enrolledCount: 201,
    averageRating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&h=500&fit=crop'
  },
  {
    id: '12',
    title: {
      en: 'Marine Policy & Governance',
      si: 'සමුද්‍ර ප්‍රතිපත්ති සහ පාලනය',
      ta: 'கடல் கொள்கை & நிர்வாகம்'
    },
    description: {
      en: 'Learn international ocean law, marine protected areas, fisheries regulations, and sustainable blue economy principles.',
      si: 'ජාත්‍යන්තර සාගර නීතිය, සමුද්‍ර සංරක්ෂිත ප්‍රදේශ, මත්ස්‍ය නියාමන සහ තිරසාර නිල් ආර්ථික මූලධර්ම ඉගෙන ගන්න.',
      ta: 'சர்வதேச கடல் சட்டம், கடல் பாதுகாக்கப்பட்ட பகுதிகள், மீன்வள விதிமுறைகள் மற்றும் நிலையான நீல பொருளாதார கொள்கைகளைக் கற்றுக்கொள்ளுங்கள்.'
    },
    category: '4',
    level: 'intermediate',
    duration: 13,
    enrolledCount: 188,
    averageRating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop'
  }
];

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value?.toDate) return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getLocalizedValue = (value, language, fallback = '') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value[language] || value.en || Object.values(value)[0] || fallback;
};

const formatEventDateRange = (event, language = 'en') => {
  const start = toDate(event?.startDate);
  const end = toDate(event?.endDate);
  const locale = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-GB';

  if (!start && !end) {
    return language === 'si'
      ? 'ආසන්නයේ දැනුම්දෙනු ඇත'
      : language === 'ta'
        ? 'விரைவில் அறிவிக்கப்படும்'
        : 'Schedule to be announced';
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (start && end) {
    const sameDay = start.toDateString() === end.toDateString();
    if (sameDay) {
      return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
    }

    const sameMonth =
      start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
    if (sameMonth) {
      const dayFormatter = new Intl.DateTimeFormat(locale, { day: 'numeric' });
      return `${dateFormatter.format(start)} – ${dayFormatter.format(end)}, ${end.getFullYear()}`;
    }

    const shortFormatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return `${shortFormatter.format(start)} – ${shortFormatter.format(end)}`;
  }

  return dateFormatter.format(start || end);
};

const staticTrainingEvents = [
  {
    id: 'evt-001',
    title: {
      en: 'Coastal Resilience Extension Lab',
      si: 'වෙරළ කාලීන ප්‍රතිශක්ති පරිවර්ධන වැඩමුළුව',
      ta: 'கடற்கரை மீட்பு விரிவாக்க ஆய்வகம்'
    },
    summary: {
      en: 'Hands-on training on early warning briefs, evacuation playbooks, and community drills for coastal authorities.',
      si: 'වෙරළ අධිකාරීන් සඳහා ආධාර early warning නිවේදන, ඉවත් කිරීමේ සැලසුම් සහ ප්‍රංති ආරම්භ මුහුණුවරට අව්‍යාජ පුහුණුව.',
      ta: 'கடற்கரை அதிகாரிகளுக்கான முன் எச்சரிக்கை அறிவிப்புகள், வெளியேற்ற திட்டங்கள் மற்றும் சமுதாய பயிற்சிகளில் கைமுறைப் பயிற்சி.'
    },
    startDate: new Date('2025-02-12T09:00:00+05:30'),
    endDate: new Date('2025-02-13T16:00:00+05:30'),
    registrationDeadline: new Date('2025-02-05T23:59:00+05:30'),
    format: 'in_person',
    location: {
      en: 'NARA Auditorium, Colombo',
      si: 'NARA රඟහල, කොළඹ',
      ta: 'NARA அரங்கம், கொழும்பு'
    },
    capacity: 60,
    seatsRemaining: 22,
    status: 'scheduled',
    tags: ['disaster-response', 'coastal-planning'],
    audience: ['government', 'local-authorities']
  },
  {
    id: 'evt-002',
    title: {
      en: 'Remote Sensing for Fisheries Intelligence',
      si: 'අභ්‍යවකාශ සංවේදනය මඟින් මත්ස්‍ය බුද්ධිමයකරණය',
      ta: 'தொலை உணர்தலின் மூலம் மீன்வள நுண்ணறிவு'
    },
    summary: {
      en: 'Live virtual clinic covering satellite indices, HAB detection, and catch forecasting pipelines using open data.',
      si: 'තිතාකාලික සජීවී මණ්ඩපයක්: ව්‍යාප්ත දත්ත මඟින් උපායමාර්ග සූචක, HAB හඳුනා ගැනීම සහ අල්ලපු ප්‍රතිදර්ශක ආදාන.',
      ta: 'திறந்த தரவு வழியாக செயற்கைக்கோள் குறியீடுகள், HAB கண்டறிதல் மற்றும் பிடிப்பு முன்னறிவிப்பு வழிமுறைகளை உள்ளடக்கிய நேரடி வெளி அமர்வு.'
    },
    startDate: new Date('2025-03-05T14:00:00+05:30'),
    endDate: new Date('2025-03-05T17:00:00+05:30'),
    registrationDeadline: new Date('2025-03-01T23:59:00+05:30'),
    format: 'virtual',
    location: {
      en: 'Zoom (link shared after confirmation)',
      si: 'Zoom (අනුමතවූ පසු සබැඳිය බෙදා හැරේ)',
      ta: 'Zoom (உறுதிப்படுத்தப்பட்ட பின் இணைப்பு பகிரப்படும்)'
    },
    capacity: 120,
    seatsRemaining: 58,
    status: 'scheduled',
    tags: ['analytics', 'fisheries'],
    audience: ['students', 'researchers']
  },
  {
    id: 'evt-003',
    title: {
      en: 'Community Extension Studio: Lagoon Co-management',
      si: 'ප්‍රජා පුහුණුව: කලපුව ප්‍රමාණවත් කළමනාකරණය',
      ta: 'சமூக விரிவாக்க ஸ்டுடியோ: குள செயல்முறை இணை மேலாண்மை'
    },
    summary: {
      en: 'Field-based immersion with community partners to co-design monitoring plans, livelihood pilots, and data feedback loops.',
      si: 'ප්‍රජා හමුදාවන් සමඟ ක්ෂේත්‍ර පදනම් වැඩසටහන්: නිරීක්ෂණ සැලසුම්, ජීවිකා පරීක්ෂණ සහ දත්ත ප්‍රතිචාර ආවර්තන.',
      ta: 'சமூக கூட்டாளர்களுடன் கள அனுபவம்: கண்காணிப்பு திட்டங்கள், வாழ்வாதார முன்னோடிகள் மற்றும் தரவு பின்னூட்டச் சுழற்சிகளை இணைந்து வடிவமைக்க.'
    },
    startDate: new Date('2025-04-24T09:30:00+05:30'),
    endDate: new Date('2025-04-26T15:30:00+05:30'),
    registrationDeadline: new Date('2025-04-10T23:59:00+05:30'),
    format: 'hybrid',
    location: {
      en: 'Puttalam Lagoon Field Station',
      si: 'පුත්තලම කලපුව ක්ෂේත්‍ර මධ්‍යස්ථානය',
      ta: 'புத்தளம் ஏரி புல நிலையம்'
    },
    capacity: 30,
    seatsRemaining: 6,
    status: 'scheduled',
    tags: ['extension', 'community-engagement'],
    audience: ['community', 'government', 'researchers']
  },
  {
    id: 'evt-004',
    title: {
      en: 'Blue Carbon Policy Studio',
      si: 'නිල් කාබන් ප්‍රතිපත්ති වැඩමුළුව',
      ta: 'நீல கார்பன் கொள்கை ஸ்டுடியோ'
    },
    summary: {
      en: 'Policy sprint aligning coastal carbon inventories with national MRV frameworks, finance pathways, and RTI transparency.',
      si: 'ජාතික MRV රාමුව, මූල්‍ය මාර්ග සහ RTI විවෘතභාවය සමඟ වෙරළ කාබන් ගණන් සම්මුතිය.',
      ta: 'கடற்கரை கார்பன் கணக்குகளை தேசிய MRV கட்டமைப்புகள், நிதி வழிகள் மற்றும் RTI வெளிப்படைத்தன்மையுடன் இணைக்கும் கொள்கை இடியச் சுருக்கு.'
    },
    startDate: new Date('2025-05-16T10:00:00+05:30'),
    endDate: new Date('2025-05-17T16:30:00+05:30'),
    registrationDeadline: new Date('2025-05-05T23:59:00+05:30'),
    format: 'in_person',
    location: {
      en: 'NARA Policy Lab, Crow Island',
      si: 'NARA ප්‍රතිපත්ති ශාලාව, කක්කුක්ස්දූව',
      ta: 'NARA கொள்கை ஆய்வகம், காக்ஸ் தீவு'
    },
    capacity: 40,
    seatsRemaining: 12,
    status: 'scheduled',
    tags: ['policy', 'climate-finance'],
    audience: ['policy-makers', 'academia']
  }
];

const LearningDevelopmentAcademy = () => {
  const { t, i18n } = useTranslation(['common', 'knowledge']);
  const currentLang = i18n.language || 'en';
  const theme = useThemeStore((state) => state?.theme || 'normal');
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState(staticCourses);
  const [categories, setCategories] = useState(staticCategories);
  const [papers, setPapers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [events, setEvents] = useState(staticTrainingEvents);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollmentModal, setEnrollmentModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: { en: '', si: '', ta: '' },
    description: { en: '', si: '', ta: '' },
    category: '',
    files: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventRegistrationForm, setEventRegistrationForm] = useState({
    fullName: '',
    email: '',
    organization: '',
    phone: '',
    notes: ''
  });
  const [registeringEvent, setRegisteringEvent] = useState(false);

  const isTamil = currentLang === 'ta';
  const isSinhala = currentLang === 'si';
  const headingFontClass = isTamil ? 'font-tamil' : isSinhala ? 'font-sinhala' : 'font-headline';
  const headingLeadingClass = isTamil || isSinhala ? 'leading-[1.35]' : 'leading-tight';
  const headingPaddingClass = isTamil || isSinhala ? 'pt-2' : '';

  // Load data from Firebase with fallback to static data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setEventsLoading(true);
      const [
        coursesData,
        categoriesData,
        papersData,
        materialsData,
        eventsData
      ] = await Promise.all([
        getCourses().catch(() => []),
        getCategories().catch(() => []),
        getPapers({ status: 'published' }).catch(() => []),
        getTrainingMaterials({ status: 'published' }).catch(() => []),
        getTrainingEvents({ status: 'scheduled' }).catch(() => [])
      ]);

      // Use Firebase data if available, otherwise keep static data
      if (coursesData && coursesData.length > 0) setCourses(coursesData);
      if (categoriesData && categoriesData.length > 0) setCategories(categoriesData);
      if (papersData && papersData.length > 0) setPapers(papersData);
      if (materialsData && materialsData.length > 0) setMaterials(materialsData);
      if (eventsData && eventsData.length > 0) {
        setEvents(
          eventsData.map((event) => ({
            ...event,
            startDate: toDate(event.startDate),
            endDate: toDate(event.endDate),
            registrationDeadline: toDate(event.registrationDeadline)
          }))
        );
      } else {
        setEvents(staticTrainingEvents);
      }
    } catch (error) {
      console.error('Error loading LDA data:', error);
      // Keep static data on error
    } finally {
      setLoading(false);
      setEventsLoading(false);
    }
  };

  // Filter and search courses
  const filteredCourses = courses
    .filter(course => {
      if (selectedCategory && course.category !== selectedCategory) return false;
      if (selectedLevel !== 'all' && course.level !== selectedLevel) return false;
      if (searchQuery) {
        const title = course.title[currentLang]?.toLowerCase() || '';
        const description = course.description[currentLang]?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        return title.includes(query) || description.includes(query);
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.enrolledCount || 0) - (a.enrolledCount || 0);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'newest':
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        default:
          return 0;
      }
    });

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return [...events]
      .map((event) => ({
        ...event,
        startDate: toDate(event.startDate),
        endDate: toDate(event.endDate) || toDate(event.startDate),
        registrationDeadline: toDate(event.registrationDeadline)
      }))
      .sort((a, b) => {
        const aTime = a.startDate ? a.startDate.getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.startDate ? b.startDate.getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      })
      .filter((event) => {
        if (calendarFilter === 'past') {
          const end = event.endDate || event.startDate;
          return end ? end < now : false;
        }
        if (calendarFilter === 'upcoming') {
          const end = event.endDate || event.startDate;
          if (!end) return true;
          return end >= now;
        }
        return true;
      });
  }, [events, calendarFilter]);

  const groupedEvents = useMemo(() => {
    const locale = currentLang === 'si' ? 'si-LK' : currentLang === 'ta' ? 'ta-LK' : 'en-GB';
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
    const fallbackLabel =
      currentLang === 'si'
        ? 'ආසන්න ඊළඟ වැඩසටහන්'
        : currentLang === 'ta'
          ? 'விரைவில் வரவிருக்கும் அமர்வுகள்'
          : 'Upcoming sessions';

    return filteredEvents.reduce((acc, event) => {
      const anchorDate = toDate(event.startDate) || toDate(event.registrationDeadline);
      const key = anchorDate ? monthFormatter.format(anchorDate) : fallbackLabel;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(event);
      return acc;
    }, {});
  }, [filteredEvents, currentLang]);

  const trainingKPIs = useMemo(() => {
    const now = new Date();
    const upcoming = events.filter((event) => {
      const end = toDate(event.endDate) || toDate(event.startDate);
      if (!end) return true;
      return end >= now;
    }).length;
    const virtualSessions = events.filter((event) => event.format === 'virtual').length;
    const seatsTotal = events.reduce(
      (sum, event) => sum + (typeof event.capacity === 'number' ? event.capacity : 0),
      0
    );
    const seatsRemaining = events.reduce(
      (sum, event) => sum + (typeof event.seatsRemaining === 'number' ? event.seatsRemaining : 0),
      0
    );

    return {
      upcoming,
      total: events.length,
      virtualSessions,
      seatsTotal,
      seatsRemaining
    };
  }, [events]);

  // Enroll in course
  const handleEnroll = async (course) => {
    if (!user) {
      alert(t('common:pleaseLogin'));
      return;
    }
    try {
      await enrollInCourse(user.uid, course.id);
      alert(t('common:enrollmentSuccess'));
      setEnrollmentModal(false);
      loadData(); // Reload to get updated enrollment counts
    } catch (error) {
      console.error('Error enrolling:', error);
      alert(t('common:enrollmentError'));
    }
  };

  // Submit project
  const handleProjectSubmit = async () => {
    if (!user) {
      alert(t('common:pleaseLogin'));
      return;
    }

    // Validation
    if (!projectForm.title.en || !projectForm.description.en || !projectForm.category) {
      alert('Please fill in all required fields (at least English version)');
      return;
    }

    try {
      setSubmitting(true);
      await submitProject({
        ...projectForm,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        submittedAt: new Date()
      }, projectForm.files);

      alert(t('common:projectSubmitted'));
      setProjectModal(false);
      setProjectForm({
        title: { en: '', si: '', ta: '' },
        description: { en: '', si: '', ta: '' },
        category: '',
        files: []
      });
    } catch (error) {
      console.error('Error submitting project:', error);
      alert(t('common:projectError'));
    } finally {
      setSubmitting(false);
    }
  };

  // Theme classes
  const getThemeClasses = () => {
    const baseClasses = 'min-h-screen transition-all duration-500';
    switch (theme) {
      case 'dark':
        return `${baseClasses} bg-gray-900 text-white`;
      case 'glow':
        return `${baseClasses} bg-black text-white`;
      default:
        return `${baseClasses} bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50 text-gray-900`;
    }
  };

  const getCardClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700 hover:bg-gray-750';
      case 'glow':
        return 'bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]';
      default:
        return 'bg-white border-gray-200 hover:shadow-xl';
    }
  };

  const getButtonClasses = (variant = 'primary') => {
    if (variant === 'primary') {
      switch (theme) {
        case 'dark':
          return 'bg-blue-600 hover:bg-blue-700 text-white';
        case 'glow':
          return 'bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-600 hover:to-navy-700 text-white shadow-[0_0_20px_rgba(0,51,102,0.4)]';
        default:
          return 'bg-blue-600 hover:bg-blue-700 text-white';
      }
    }
    return theme === 'dark'
      ? 'bg-gray-700 hover:bg-gray-600 text-white'
      : theme === 'glow'
        ? 'bg-gray-800 hover:bg-gray-700 text-cyan-100 border border-cyan-500/30'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-900';
  };

  const getInputClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
      case 'glow':
        return 'bg-gray-900 border-cyan-500/40 text-cyan-100 placeholder:text-cyan-200/50 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400';
      default:
        return 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    }
  };

  const getTabLabel = (tab) => {
    const defaults = {
      courses:
        currentLang === 'si'
          ? 'පාඨමාලා'
          : currentLang === 'ta'
            ? 'பாடநெறிகள்'
            : 'Courses',
      calendar:
        currentLang === 'si'
          ? 'පුහුණු දින දසුන'
          : currentLang === 'ta'
            ? 'பயிற்சி நாட்காட்டி'
            : 'Training Calendar',
      papers:
        currentLang === 'si'
          ? 'පර්යේෂණ පත්‍ර'
          : currentLang === 'ta'
            ? 'ஆராய்ச்சி ஆவணங்கள்'
            : 'Research Papers',
      materials:
        currentLang === 'si'
          ? 'ඉගෙනුම් ද්‍රව්‍ය'
          : currentLang === 'ta'
            ? 'கற்றல் பொருட்கள்'
            : 'Materials Library'
    };

    return t(`knowledge:${tab}`, { defaultValue: defaults[tab] });
  };

  const isAlreadyRegistered = (event) => {
    if (!user) return false;
    const registrations = event?.registrations || [];
    return registrations.some(
      (entry) => entry?.userId === user.uid || (entry?.email && entry.email === user.email)
    );
  };

  const updateRegistrationField = (field, value) => {
    setEventRegistrationForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const openEventModal = (event) => {
    if (!user) {
      alert(t('common:pleaseLogin'));
      return;
    }

    if (isAlreadyRegistered(event)) {
      alert(
        t('knowledge:alreadyRegistered', {
          defaultValue: 'You are already registered for this training.'
        })
      );
      return;
    }

    setSelectedEvent(event);
    setEventRegistrationForm({
      fullName: user.displayName || '',
      email: user.email || '',
      organization: '',
      phone: '',
      notes: ''
    });
    setEventModalOpen(true);
  };

  const closeEventModal = () => {
    setEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventRegistration = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!eventRegistrationForm.fullName.trim() || !eventRegistrationForm.email.trim()) {
      alert(
        t('knowledge:registrationMissingFields', {
          defaultValue: 'Please provide your name and email address to reserve a seat.'
        })
      );
      return;
    }

    try {
      setRegisteringEvent(true);
      const payload = {
        ...eventRegistrationForm,
        userId: user?.uid,
        eventId: selectedEvent.id
      };

      const result = await registerForTrainingEvent(selectedEvent.id, payload);

      if (result?.success) {
        alert(
          t('knowledge:registrationSuccess', {
            defaultValue: 'Thanks! Your seat is confirmed. We will email joining instructions shortly.'
          })
        );
        setEvents((prev) =>
          prev.map((event) => {
            if (event.id !== selectedEvent.id) return event;
            const seatsRemaining =
              typeof event.seatsRemaining === 'number'
                ? Math.max(event.seatsRemaining - 1, 0)
                : event.seatsRemaining;
            const registrations = [
              ...(event.registrations || []),
              { ...payload, registeredAt: new Date() }
            ];
            return {
              ...event,
              seatsRemaining,
              registrations
            };
          })
        );
        closeEventModal();
      } else {
        alert(result?.error?.message || 'Unable to register right now. Please try again.');
      }
    } catch (error) {
      console.error('Error registering for training event:', error);
      alert('Unable to register right now. Please try again later.');
    } finally {
      setRegisteringEvent(false);
    }
  };

  if (loading) {
    return (
      <div className={getThemeClasses()}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">{t('common:loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StitchWrapper>
      <div className={`${getThemeClasses()} relative z-10 bg-transparent`}>
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Hero Section - Navy Blue Government Theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/10 via-navy-800/10 to-navy-700/10"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1
                className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-navy-800 to-navy-600 bg-clip-text text-transparent ${headingFontClass} ${headingLeadingClass} ${headingPaddingClass}`}
              >
                {t('knowledge:learningAcademy')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-80">
                {t('knowledge:academyDescription')}
              </p>

              {/* Auth Buttons - Show if not logged in */}
              {!user && (
                <div className="flex gap-4 justify-center mb-8">
                  <button
                    onClick={() => navigate('/lda-register')}
                    className={`px-8 py-4 rounded-xl ${getButtonClasses('primary')} text-lg font-semibold flex items-center gap-2`}
                  >
                    <Icons.UserPlus className="w-6 h-6" />
                    {currentLang === 'si' ? 'ලියාපදිංචි වන්න' : currentLang === 'ta' ? 'பதிவு செய்யவும்' : 'Register'}
                  </button>
                  <button
                    onClick={() => navigate('/lda-login')}
                    className={`px-8 py-4 rounded-xl ${getButtonClasses('secondary')} text-lg font-semibold flex items-center gap-2`}
                  >
                    <Icons.LogIn className="w-6 h-6" />
                    {currentLang === 'si' ? 'ප්‍රවේශ වන්න' : currentLang === 'ta' ? 'உள்நுழைக' : 'Login'}
                  </button>
                </div>
              )}

              {/* User Welcome - Show if logged in */}
              {user && (
                <div className="mb-8">
                  <p className="text-2xl font-semibold mb-4">
                    {currentLang === 'si' ? 'සාදරයෙන් පිළිගනිමු' : currentLang === 'ta' ? 'வரவேற்கிறோம்' : 'Welcome'}, {user.displayName || user.email}!
                  </p>
                </div>
              )}

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className={`flex gap-2 p-2 rounded-xl border ${getCardClasses()}`}>
                  <Icons.Search className="w-6 h-6 ml-2 opacity-50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('common:searchPlaceholder')}
                    className="flex-1 bg-transparent border-none outline-none px-2"
                  />
                  <button className={`px-6 py-2 rounded-lg ${getButtonClasses('primary')}`}>
                    {t('common:search')}
                  </button>
                </div>
              </div>

              {/* Submit Project Button */}
              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setProjectModal(true)}
                  className={`mt-8 px-8 py-4 rounded-xl ${getButtonClasses('primary')} text-lg font-semibold flex items-center gap-2 mx-auto`}
                >
                  <Icons.Upload className="w-6 h-6" />
                  {t('knowledge:submitProject')}
                </motion.button>
              )}
            </motion.div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {['courses', 'calendar', 'papers', 'materials'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full capitalize font-medium transition-all ${activeTab === tab ? getButtonClasses('primary') : getButtonClasses('secondary')
                  }`}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'courses' && (
            <motion.section
              key="courses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto px-4 pb-20"
            >
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-8">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm ${!selectedCategory ? getButtonClasses('primary') : getButtonClasses('secondary')
                      }`}
                  >
                    {t('common:allCategories')}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm ${selectedCategory === category.id ? getButtonClasses('primary') : getButtonClasses('secondary')
                        }`}
                    >
                      {category.name[currentLang] || category.name.en}
                    </button>
                  ))}
                </div>

                {/* Level Filter */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    } border`}
                >
                  <option value="all">{t('common:allLevels')}</option>
                  <option value="beginner">{t('common:beginner')}</option>
                  <option value="intermediate">{t('common:intermediate')}</option>
                  <option value="advanced">{t('common:advanced')}</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    } border`}
                >
                  <option value="popular">{t('common:mostPopular')}</option>
                  <option value="rating">{t('common:highestRated')}</option>
                  <option value="newest">{t('common:newest')}</option>
                </select>
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-xl overflow-hidden border transition-all hover:transform hover:scale-105 ${getCardClasses()}`}
                  >
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.title[currentLang]}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-600">
                          {course.level}
                        </span>
                        <div className="flex items-center gap-1">
                          <Icons.Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{course.averageRating || 0}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {course.title[currentLang] || course.title.en}
                      </h3>
                      <p className="text-sm opacity-70 mb-4 line-clamp-2">
                        {course.description[currentLang] || course.description.en}
                      </p>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <Icons.Clock className="w-4 h-4" />
                          {course.duration} {t('common:weeks')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icons.Users className="w-4 h-4" />
                          {course.enrolledCount || 0}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setEnrollmentModal(true);
                        }}
                        className={`w-full py-2 rounded-lg ${getButtonClasses('primary')}`}
                      >
                        {t('knowledge:enrollNow')}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-20">
                  <Icons.BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-xl opacity-70">{t('common:noCoursesFound')}</p>
                </div>
              )}
            </motion.section>
          )}

          {activeTab === 'calendar' && (
            <motion.section
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto px-4 pb-20"
            >
              <div
                className={`mb-10 rounded-3xl border ${getCardClasses()} overflow-hidden bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-blue-600/5`}
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        {t('knowledge:calendarHeadline', {
                          defaultValue: 'Training & Extension Calendar'
                        })}
                      </h2>
                      <p className="text-base opacity-75 max-w-2xl">
                        {t('knowledge:calendarDescription', {
                          defaultValue:
                            'Book verified seats for instructor-led academies, virtual clinics, and community extension labs run by NARA trainers.'
                        })}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                      <div className="rounded-2xl bg-white/60 dark:bg-white/10 p-4 text-center shadow-sm">
                        <div className="text-3xl font-bold">
                          {trainingKPIs.upcoming}
                        </div>
                        <p className="text-xs uppercase tracking-wide opacity-70">
                          {t('knowledge:calendarUpcoming', { defaultValue: 'Upcoming' })}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/60 dark:bg-white/10 p-4 text-center shadow-sm">
                        <div className="text-3xl font-bold">
                          {trainingKPIs.virtualSessions}
                        </div>
                        <p className="text-xs uppercase tracking-wide opacity-70">
                          {t('knowledge:calendarVirtual', { defaultValue: 'Virtual' })}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/60 dark:bg-white/10 p-4 text-center shadow-sm">
                        <div className="text-3xl font-bold">
                          {trainingKPIs.seatsRemaining}
                        </div>
                        <p className="text-xs uppercase tracking-wide opacity-70">
                          {t('knowledge:calendarSeatsLeft', { defaultValue: 'Seats left' })}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/60 dark:bg-white/10 p-4 text-center shadow-sm">
                        <div className="text-3xl font-bold">
                          {trainingKPIs.total}
                        </div>
                        <p className="text-xs uppercase tracking-wide opacity-70">
                          {t('knowledge:calendarTotalSessions', { defaultValue: 'Total sessions' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  {
                    id: 'upcoming',
                    label: t('knowledge:calendarUpcoming', { defaultValue: 'Upcoming' })
                  },
                  {
                    id: 'all',
                    label: t('common:all', { defaultValue: 'All' })
                  },
                  {
                    id: 'past',
                    label: t('knowledge:calendarPast', { defaultValue: 'Past sessions' })
                  }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setCalendarFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm ${calendarFilter === filter.id
                      ? getButtonClasses('primary')
                      : getButtonClasses('secondary')
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {eventsLoading ? (
                <div className="flex justify-center py-16">
                  <Icons.Loader className="w-10 h-10 animate-spin text-blue-600" />
                </div>
              ) : Object.keys(groupedEvents).length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-3xl opacity-70">
                  <Icons.Calendar className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl">
                    {t('knowledge:noCalendarEntries', {
                      defaultValue: 'No sessions match this filter. Check again soon.'
                    })}
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  {Object.entries(groupedEvents).map(([month, monthEvents]) => (
                    <div key={month} className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full bg-blue-500"></div>
                        <h3 className="text-2xl font-semibold">{month}</h3>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {monthEvents.map((event) => {
                          const seatsRemaining =
                            typeof event.seatsRemaining === 'number'
                              ? Math.max(event.seatsRemaining, 0)
                              : null;
                          const capacity =
                            typeof event.capacity === 'number' ? event.capacity : null;
                          const isFull = seatsRemaining === 0 && capacity !== null;
                          const deadline = toDate(event.registrationDeadline);
                          const registrationClosed = deadline ? deadline < new Date() : false;
                          const alreadyRegistered = isAlreadyRegistered(event);
                          const buttonDisabled = isFull || registrationClosed || alreadyRegistered;
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`relative rounded-2xl border ${getCardClasses()} p-6 overflow-hidden`}
                            >
                              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-blue-500/10 via-cyan-400/40 to-blue-500/10 pointer-events-none" />
                              <div className="flex flex-col gap-4">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                  <div>
                                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2">
                                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600">
                                        {event.format === 'virtual'
                                          ? t('knowledge:formatVirtual', { defaultValue: 'Virtual' })
                                          : event.format === 'hybrid'
                                            ? t('knowledge:formatHybrid', { defaultValue: 'Hybrid' })
                                            : t('knowledge:formatInPerson', { defaultValue: 'In person' })}
                                      </span>
                                      {registrationClosed && (
                                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600">
                                          {t('knowledge:registrationClosed', {
                                            defaultValue: 'Registration closed'
                                          })}
                                        </span>
                                      )}
                                      {isFull && (
                                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600">
                                          {t('knowledge:eventFull', { defaultValue: 'Waitlist only' })}
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="text-2xl font-semibold">
                                      {getLocalizedValue(event.title, currentLang, event.title?.en)}
                                    </h4>
                                    <p className="mt-2 text-sm opacity-80">
                                      {getLocalizedValue(event.summary, currentLang, '')}
                                    </p>
                                  </div>
                                  <div className="text-sm text-right space-y-1 whitespace-pre-line">
                                    <div className="font-semibold text-blue-600">
                                      {formatEventDateRange(event, currentLang)}
                                    </div>
                                    <div className="opacity-70">
                                      {getLocalizedValue(event.location, currentLang, '')}
                                    </div>
                                    {deadline && (
                                      <div className="text-xs uppercase tracking-wide opacity-70">
                                        {t('knowledge:registerBy', { defaultValue: 'Register by' })}{' '}
                                        {deadline.toLocaleDateString(
                                          currentLang === 'si'
                                            ? 'si-LK'
                                            : currentLang === 'ta'
                                              ? 'ta-LK'
                                              : 'en-GB',
                                          { day: 'numeric', month: 'short' }
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {event.tags?.map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-xs uppercase tracking-wide px-3 py-1 rounded-full bg-gray-200/60 dark:bg-gray-700/60"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                  {capacity !== null && (
                                    <span className="flex items-center gap-2">
                                      <Icons.Users className="w-4 h-4 opacity-70" />
                                      {t('knowledge:capacity', { defaultValue: 'Capacity' })}:{' '}
                                      <strong>
                                        {capacity}
                                        {seatsRemaining !== null
                                          ? ` · ${seatsRemaining} ${t('knowledge:seatsLeft', {
                                            defaultValue: 'left'
                                          })}`
                                          : ''}
                                      </strong>
                                    </span>
                                  )}
                                  {event.audience && (
                                    <span className="flex items-center gap-2">
                                      <Icons.Target className="w-4 h-4 opacity-70" />
                                      {Array.isArray(event.audience)
                                        ? event.audience.join(', ')
                                        : event.audience}
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                  <button
                                    onClick={() => openEventModal(event)}
                                    disabled={buttonDisabled}
                                    className={`px-5 py-2 rounded-lg ${getButtonClasses('primary')} disabled:opacity-60 disabled:cursor-not-allowed`}
                                  >
                                    {alreadyRegistered
                                      ? t('knowledge:alreadyRegistered', {
                                        defaultValue: 'Already registered'
                                      })
                                      : isFull
                                        ? t('knowledge:joinWaitlist', { defaultValue: 'Join waitlist' })
                                        : registrationClosed
                                          ? t('knowledge:registrationClosed', {
                                            defaultValue: 'Registration closed'
                                          })
                                          : t('knowledge:reserveSeat', { defaultValue: 'Reserve seat' })}
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (typeof navigator === 'undefined' || !navigator.clipboard) {
                                        alert(
                                          t('knowledge:calendarCopyFallback', {
                                            defaultValue:
                                              'Copy failed. Please capture the details manually.'
                                          })
                                        );
                                        return;
                                      }

                                      navigator.clipboard
                                        .writeText(
                                          `${getLocalizedValue(event.title, currentLang, event.title?.en)} — ${formatEventDateRange(event, currentLang)}`
                                        )
                                        .then(() => {
                                          alert(
                                            t('knowledge:calendarCopied', {
                                              defaultValue:
                                                'Event details copied. Paste into your calendar invite.'
                                            })
                                          );
                                        })
                                        .catch(() => {
                                          alert(
                                            t('knowledge:calendarCopyFallback', {
                                              defaultValue:
                                                'Copy failed. Please capture the details manually.'
                                            })
                                          );
                                        });
                                    }}
                                    className={`px-5 py-2 rounded-lg ${getButtonClasses('secondary')}`}
                                  >
                                    {t('knowledge:copyDetails', { defaultValue: 'Copy details' })}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {activeTab === 'papers' && (
            <motion.section
              key="papers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto px-4 pb-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {papers.map((paper) => (
                  <motion.div
                    key={paper.id}
                    className={`rounded-xl p-6 border ${getCardClasses()}`}
                  >
                    <h3 className="text-xl font-bold mb-2">
                      {paper.title[currentLang] || paper.title.en}
                    </h3>
                    <p className="text-sm opacity-70 mb-4">
                      {paper.abstract?.[currentLang] || paper.abstract?.en || ''}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Icons.Eye className="w-4 h-4" />
                        {paper.viewCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icons.Download className="w-4 h-4" />
                        {paper.downloadCount || 0}
                      </span>
                      <a
                        href={paper.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 rounded-lg ${getButtonClasses('primary')}`}
                      >
                        {t('common:viewPaper')}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'materials' && (
            <motion.section
              key="materials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto px-4 pb-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <motion.div
                    key={material.id}
                    className={`rounded-xl p-6 border ${getCardClasses()}`}
                  >
                    <h3 className="text-lg font-bold mb-2">
                      {material.title[currentLang] || material.title.en}
                    </h3>
                    <p className="text-sm opacity-70 mb-4">
                      {material.description?.[currentLang] || material.description?.en || ''}
                    </p>
                    <button
                      onClick={() => window.open(material.fileUrl, '_blank')}
                      className={`w-full py-2 rounded-lg ${getButtonClasses('primary')} flex items-center justify-center gap-2`}
                    >
                      <Icons.Download className="w-4 h-4" />
                      {t('common:download')}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Training Event Registration Modal */}
        <AnimatePresence>
          {eventModalOpen && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeEventModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-3xl w-full rounded-2xl p-8 space-y-6 ${getCardClasses()}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-60">
                      {t('knowledge:eventRegistration', { defaultValue: 'Event registration' })}
                    </p>
                    <h2 className="text-2xl font-bold">
                      {getLocalizedValue(selectedEvent.title, currentLang, selectedEvent.title?.en)}
                    </h2>
                    <p className="text-sm opacity-70 mt-2">
                      {formatEventDateRange(selectedEvent, currentLang)} ·{' '}
                      {getLocalizedValue(selectedEvent.location, currentLang, '')}
                    </p>
                  </div>
                  <button
                    onClick={closeEventModal}
                    className="p-2 rounded-full border border-gray-300/50 hover:bg-gray-100 text-gray-500"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEventRegistration} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">
                        {t('common:fullName', { defaultValue: 'Full name' })}
                      </label>
                      <input
                        type="text"
                        value={eventRegistrationForm.fullName}
                        onChange={(e) => updateRegistrationField('fullName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${getInputClasses()}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">
                        {t('common:email', { defaultValue: 'Email' })}
                      </label>
                      <input
                        type="email"
                        value={eventRegistrationForm.email}
                        onChange={(e) => updateRegistrationField('email', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${getInputClasses()}`}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">
                        {t('knowledge:organization', { defaultValue: 'Organization / Affiliation' })}
                      </label>
                      <input
                        type="text"
                        value={eventRegistrationForm.organization}
                        onChange={(e) => updateRegistrationField('organization', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${getInputClasses()}`}
                        placeholder={t('knowledge:organizationPlaceholder', {
                          defaultValue: 'e.g., Department of Fisheries'
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">
                        {t('common:phone', { defaultValue: 'Phone' })}
                      </label>
                      <input
                        type="tel"
                        value={eventRegistrationForm.phone}
                        onChange={(e) => updateRegistrationField('phone', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${getInputClasses()}`}
                        placeholder="+94 77 XXX XXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1 block">
                      {t('common:notes', { defaultValue: 'Notes' })}
                    </label>
                    <textarea
                      rows={4}
                      value={eventRegistrationForm.notes}
                      onChange={(e) => updateRegistrationField('notes', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border resize-none ${getInputClasses()}`}
                      placeholder={t('knowledge:eventNotesPlaceholder', {
                        defaultValue: 'Let us know about accessibility needs or learning goals.'
                      })}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4 border-t border-gray-200/60">
                    <p className="text-sm opacity-70">
                      {t('knowledge:eventPrivacy', {
                        defaultValue:
                          'We will email joining instructions and add you to the reminder list for this session.'
                      })}
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={closeEventModal}
                        className={`px-5 py-2 rounded-lg ${getButtonClasses('secondary')}`}
                      >
                        {t('common:cancel')}
                      </button>
                      <button
                        type="submit"
                        disabled={registeringEvent}
                        className={`px-5 py-2 rounded-lg ${getButtonClasses('primary')} disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {registeringEvent
                          ? t('knowledge:bookingInProgress', { defaultValue: 'Booking...' })
                          : t('knowledge:confirmSeat', { defaultValue: 'Confirm seat' })}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enrollment Modal */}
        <AnimatePresence>
          {enrollmentModal && selectedCourse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setEnrollmentModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-2xl w-full rounded-2xl p-8 ${getCardClasses()}`}
              >
                <h2 className="text-2xl font-bold mb-4">
                  {selectedCourse.title[currentLang] || selectedCourse.title.en}
                </h2>
                <p className="mb-6 opacity-70">
                  {selectedCourse.description[currentLang] || selectedCourse.description.en}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEnroll(selectedCourse)}
                    className={`flex-1 py-3 rounded-lg ${getButtonClasses('primary')}`}
                  >
                    {t('knowledge:confirmEnrollment')}
                  </button>
                  <button
                    onClick={() => setEnrollmentModal(false)}
                    className={`flex-1 py-3 rounded-lg ${getButtonClasses('secondary')}`}
                  >
                    {t('common:cancel')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Submission Modal */}
        <AnimatePresence>
          {projectModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
              onClick={() => setProjectModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-4xl w-full rounded-2xl p-8 my-8 ${getCardClasses()}`}
              >
                <h2 className="text-2xl font-bold mb-6">{t('knowledge:submitProject')}</h2>

                {/* Language Tabs */}
                <div className="flex gap-2 mb-6">
                  {['en', 'si', 'ta'].map((lang) => (
                    <button
                      key={lang}
                      className={`px-4 py-2 rounded-lg ${currentLang === lang ? getButtonClasses('primary') : getButtonClasses('secondary')
                        }`}
                      onClick={() => i18n.changeLanguage(lang)}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block mb-2 font-medium">
                      {t('common:title')} ({currentLang.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      value={projectForm.title[currentLang]}
                      onChange={(e) => setProjectForm({
                        ...projectForm,
                        title: { ...projectForm.title, [currentLang]: e.target.value }
                      })}
                      className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block mb-2 font-medium">
                      {t('common:description')} ({currentLang.toUpperCase()}) *
                    </label>
                    <textarea
                      value={projectForm.description[currentLang]}
                      onChange={(e) => setProjectForm({
                        ...projectForm,
                        description: { ...projectForm.description, [currentLang]: e.target.value }
                      })}
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block mb-2 font-medium">{t('common:category')} *</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                    >
                      <option value="">{t('common:selectCategory')}</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name[currentLang] || cat.name.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block mb-2 font-medium">{t('common:attachFiles')}</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setProjectForm({ ...projectForm, files: Array.from(e.target.files) })}
                      className="w-full"
                    />
                    {projectForm.files.length > 0 && (
                      <p className="text-sm mt-2 opacity-70">
                        {projectForm.files.length} {t('common:filesSelected')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleProjectSubmit}
                    disabled={submitting}
                    className={`flex-1 py-3 rounded-lg ${getButtonClasses('primary')} disabled:opacity-50`}
                  >
                    {submitting ? t('common:submitting') : t('common:submit')}
                  </button>
                  <button
                    onClick={() => setProjectModal(false)}
                    className={`flex-1 py-3 rounded-lg ${getButtonClasses('secondary')}`}
                  >
                    {t('common:cancel')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StitchWrapper>
  );
};

export default LearningDevelopmentAcademy;
