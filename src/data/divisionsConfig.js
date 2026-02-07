/**
 * NARA Divisions Configuration
 * Complete data for all 21 divisions (12 Research, 5 Regional, 4 Supporting)
 * with multilingual support and PDF resources
 */

export const DIVISIONS_CONFIG = [
  {
    id: 'environmental-studies',
    slug: 'environmental-studies-division',
    icon: 'Leaf',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    category: 'research',

    name: {
      en: 'Environmental Studies Division (ESD)',
      si: 'පාරිසරික අධ්‍යයන අංශය (ESD)',
      ta: 'சுற்றுச்சூழல் ஆய்வு பிரிவு (ESD)'
    },

    headOfDivision: {
      name: { en: 'Dr. Chamari Dissanayake', si: 'ආචාර්ය චමරි දිසානායක', ta: 'டாக்டர். சமரி திசாநாயக்க' },
      title: { en: 'Senior Research Officer', si: 'ජ්‍යෙෂ්ඨ පර්යේෂණ නිලධාරී', ta: 'மூத்த ஆராய்ச்சி அதிகாரி' }
    },

    areaOfResponsibility: {
      en: 'Marine Environmental Monitoring, Water Quality Assessment & Ecosystem Protection',
      si: 'සමුද්‍ර පාරිසරික නිරීක්ෂණය, ජල ගුණාත්මක තක්සේරුව සහ පරිසර පද්ධති ආරක්ෂණය',
      ta: 'கடல் சுற்றுச்சூழல் கண்காணிப்பு, நீர் தர மதிப்பீடு & சுற்றுச்சூழல் அமைப்பு பாதுகாப்பு'
    },

    tagline: {
      en: 'Monitoring and protecting marine ecosystems for sustainable development',
      si: 'තිරසාර සංවර්ධනය සඳහා සමුද්‍ර පරිසර පද්ධති නිරීක්ෂණය සහ ආරක්ෂා කිරීම',
      ta: 'நிலையான வளர்ச்சிக்காக கடல் சுற்றுச்சூழல் அமைப்புகளை கண்காணித்தல் மற்றும் பாதுகாத்தல்'
    },

    description: {
      en: 'The Environmental Studies Division conducts comprehensive environmental monitoring, water quality assessments, and marine ecosystem protection programs to ensure sustainable use of ocean resources.',
      si: 'පාරිසරික අධ්‍යයන අංශය සමුද්‍ර සම්පත් තිරසාර භාවිතය සහතික කිරීම සඳහා විස්තීර්ණ පාරිසරික නිරීක්ෂණ, ජල ගුණාත්මක තක්සේරු සහ සමුද්‍ර පරිසර පද්ධති ආරක්ෂණ වැඩසටහන් සිදු කරයි.',
      ta: 'சுற்றுச்சூழல் ஆய்வு பிரிவு கடல் வளங்களின் நிலையான பயன்பாட்டை உறுதிசெய்ய விரிவான சுற்றுச்சூழல் கண்காணிப்பு, நீர் தர மதிப்பீடுகள் மற்றும் கடல் சுற்றுச்சூழல் அமைப்பு பாதுகாப்பு திட்டங்களை நடத்துகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Environmental-Studies-Division.pdf',
      path: '/pdfs/divisions/NARA-Environmental-Studies-Division.pdf',
      pages: 5,
      sizeKB: 101,
      description: {
        en: 'Comprehensive overview of environmental monitoring, water quality assessment, and ecosystem protection programs',
        si: 'පාරිසරික නිරීක්ෂණ, ජල ගුණාත්මක තක්සේරුව සහ පරිසර පද්ධති ආරක්ෂණ වැඩසටහන්වල සවිස්තරාත්මක දළ විශ්ලේෂණය',
        ta: 'சுற்றுச்சூழல் கண்காணிப்பு, நீர் தர மதிப்பீடு மற்றும் சுற்றுச்சூழல் அமைப்பு பாதுகாப்பு திட்டங்களின் விரிவான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200',

    focusAreas: [
      {
        title: { en: 'Water Quality Monitoring', si: 'ජල ගුණාත්මක නිරීක්ෂණය', ta: 'நீர் தர கண்காணிப்பு' },
        description: { 
          en: 'Continuous monitoring of coastal and ocean water quality parameters including pH, salinity, dissolved oxygen, nutrients, and pollution indicators across 25 monitoring stations',
          si: 'pH, ලවණතාව, විසුරුවා හරින ලද ඔක්සිජන්, පෝෂක සහ දූෂණ දර්ශක ඇතුළුව වෙරළ සහ සාගර ජල ගුණාත්මක පරාමිති 25 නිරීක්ෂණ මධ්‍යස්ථාන හරහා අඛණ්ඩව නිරීක්ෂණය කිරීම',
          ta: 'pH, உப்புத்தன்மை, கரைந்த ஆக்ஸிஜன், ஊட்டச்சத்துக்கள் மற்றும் மாசுபாடு குறிகாட்டிகள் உட்பட கடலோர மற்றும் கடல் நீர் தர அளவுருக்களை 25 கண்காணிப்பு நிலையங்களில் தொடர்ச்சியாக கண்காணித்தல்'
        },
        icon: 'Droplet'
      },
      {
        title: { en: 'Ecosystem Protection', si: 'පරිසර පද්ධති ආරක්ෂණය', ta: 'சுற்றுச்சூழல் அமைப்பு பாதுகாப்பு' },
        description: { 
          en: 'Conservation of marine biodiversity, coral reefs, seagrass beds, and critical coastal habitats through monitoring, restoration, and protection programs',
          si: 'නිරීක්ෂණ, ප්‍රතිසංස්කරණ සහ ආරක්ෂණ වැඩසටහන් හරහා සමුද්‍ර ජෛව විවිධත්වය, කොරල් පර, මුහුදු තණකොළ සහ තීරණාත්මක වෙරළ වාසස්ථාන සංරක්ෂණය කිරීම',
          ta: 'கண்காணிப்பு, மறுசீரமைப்பு மற்றும் பாதுகாப்பு திட்டங்கள் மூலம் கடல் பல்லுயிர், பவளப்பாறைகள், கடற்பாசி படுகைகள் மற்றும் முக்கியமான கடலோர வாழ்விடங்களைப் பாதுகாத்தல்'
        },
        icon: 'Shield'
      },
      {
        title: { en: 'Environmental Impact Assessment', si: 'පාරිසරික බලපෑම් තක්සේරුව', ta: 'சுற்றுச்சூழல் தாக்க மதிப்பீடு' },
        description: { 
          en: 'Scientific assessment of development project impacts on marine ecosystems, providing expert recommendations for sustainable coastal development and marine spatial planning',
          si: 'තිරසාර වෙරළ සංවර්ධනය සහ සමුද්‍ර අවකාශ සැලසුම්කරණය සඳහා ප්‍රවීණ නිර්දේශ සපයමින් සමුද්‍ර පරිසර පද්ධති මත සංවර්ධන ව්‍යාපෘති බලපෑම් විද්‍යාත්මකව තක්සේරු කිරීම',
          ta: 'நிலையான கடலோர மேம்பாடு மற்றும் கடல் இட திட்டமிடலுக்கான நிபுணர் பரிந்துரைகளை வழங்கி, கடல் சுற்றுச்சூழல் அமைப்புகளில் மேம்பாட்டு திட்ட தாக்கங்களின் அறிவியல் மதிப்பீடு'
        },
        icon: 'FileText'
      },
      {
        title: { en: 'Marine Pollution Control', si: 'සමුද්‍ර දූෂණ පාලනය', ta: 'கடல் மாசுபாடு கட்டுப்பாடு' },
        description: {
          en: 'Monitoring and mitigation of plastic pollution, oil spills, heavy metal contamination, and harmful algal blooms with rapid response capabilities',
          si: 'ප්ලාස්ටික් දූෂණය, තෙල් කාන්දු, බැර ලෝහ දූෂණය සහ හානිකර ඇල්ගී පිපීම් වේගවත් ප්‍රතිචාර හැකියාවන් සමඟ නිරීක්ෂණය සහ අවම කිරීම',
          ta: 'பிளாஸ்டிக் மாசுபாடு, எண்ணெய் கசிவுகள், கனரக உலோக மாசுபாடு மற்றும் தீங்கு விளைவிக்கும் பாசி மலர்ச்சியை விரைவான பதில் திறன்களுடன் கண்காணித்தல் மற்றும் தணித்தல்'
        },
        icon: 'AlertTriangle'
      },
      {
        title: { en: 'Climate Change Research', si: 'දේශගුණ විපර්යාස පර්යේෂණ', ta: 'காலநிலை மாற்ற ஆராய்ச்சி' },
        description: {
          en: 'Long-term monitoring of ocean temperature, sea level rise, ocean acidification, and climate impacts on marine ecosystems and coastal communities',
          si: 'සාගර උෂ්ණත්වය, මුහුදු මට්ටම ඉහළ යාම, සාගර ආම්ලීකරණය සහ සමුද්‍ර පරිසර පද්ධති සහ වෙරළ ප්‍රජාවන් කෙරෙහි දේශගුණ බලපෑම් දිගුකාලීනව නිරීක්ෂණය කිරීම',
          ta: 'கடல் வெப்பநிலை, கடல் மட்ட உயர்வு, கடல் அமிலமயமாக்கல் மற்றும் கடல் சுற்றுச்சூழல் அமைப்புகள் மற்றும் கடலோர சமூகங்கள் மீதான காலநிலை தாக்கங்களை நீண்ட கால கண்காணிப்பு'
        },
        icon: 'CloudRain'
      }
    ],

    services: [
      {
        title: { en: 'Water Quality Testing Services', si: 'ජල ගුණාත්මක පරීක්ෂණ සේවා', ta: 'நீர் தர சோதனை சேவைகள்' },
        description: { 
          en: 'Comprehensive laboratory analysis of marine and coastal water samples for physical, chemical, and biological parameters with certified testing protocols',
          si: 'සහතික පරීක්ෂණ ප්‍රොටෝකෝල සමඟ භෞතික, රසායනික සහ ජීව විද්‍යාත්මක පරාමිති සඳහා සමුද්‍ර සහ වෙරළ ජල සාම්පලවල විස්තීර්ණ රසායනාගාර විශ්ලේෂණය',
          ta: 'சான்றளிக்கப்பட்ட சோதனை நெறிமுறைகளுடன் இயற்பியல், வேதியியல் மற்றும் உயிரியல் அளவுருக்களுக்கான கடல் மற்றும் கடலோர நீர் மாதிரிகளின் விரிவான ஆய்வக பகுப்பாய்வு'
        },
        icon: 'TestTube'
      },
      {
        title: { en: 'Environmental Impact Assessment Consulting', si: 'පාරිසරික බලපෑම් තක්සේරු උපදේශන', ta: 'சுற்றுச்சூழல் தாக்க மதிப்பீட்டு ஆலோசனை' },
        description: { 
          en: 'Expert EIA services for coastal and marine development projects including ports, harbors, tourism facilities, and industrial installations with baseline surveys and mitigation recommendations',
          si: 'වරාය, තොටුපළ, සංචාරක පහසුකම් සහ කාර්මික ස්ථාපනයන් ඇතුළු වෙරළ සහ සමුද්‍ර සංවර්ධන ව්‍යාපෘති සඳහා පාදක සමීක්ෂණ සහ අවම කිරීමේ නිර්දේශ සමඟ ප්‍රවීණ EIA සේවා',
          ta: 'துறைமுகங்கள், துறைமுகங்கள், சுற்றுலா வசதிகள் மற்றும் தொழில்துறை நிறுவல்கள் உட்பட கடலோர மற்றும் கடல் மேம்பாட்டு திட்டங்களுக்கான அடிப்படை ஆய்வுகள் மற்றும் தணிப்பு பரிந்துரைகளுடன் நிபுணர் EIA சேவைகள்'
        },
        icon: 'FileSearch'
      },
      {
        title: { en: 'Pollution Monitoring & Emergency Response', si: 'දූෂණ නිරීක්ෂණ සහ හදිසි ප්‍රතිචාර', ta: 'மாசு கண்காணிப்பு & அவசர பதில்' },
        description: {
          en: '24/7 rapid response to marine pollution incidents, algal blooms, and environmental emergencies with on-site assessment, sampling, and technical support for mitigation measures',
          si: 'ආශ්‍රිත ස්ථාන තක්සේරුව, නියැදීම සහ අවම කිරීමේ පියවර සඳහා තාක්ෂණික සහාය සමඟ සමුද්‍ර දූෂණ සිදුවීම්, ඇල්ගී පිපීම් සහ පාරිසරික හදිසි අවස්ථා සඳහා 24/7 වේගවත් ප්‍රතිචාරය',
          ta: 'ஆன்-சைட் மதிப்பீடு, மாதிரி எடுத்தல் மற்றும் தணிப்பு நடவடிக்கைகளுக்கான தொழில்நுட்ப ஆதரவுடன் கடல் மாசு சம்பவங்கள், பாசி மலர்ச்சி மற்றும் சுற்றுச்சூழல் அவசரநிலைகளுக்கு 24/7 விரைவான பதில்'
        },
        icon: 'Siren'
      },
      {
        title: { en: 'Marine Ecosystem Health Reporting', si: 'සමුද්‍ර පරිසර පද්ධති සෞඛ්‍ය වාර්තාකරණය', ta: 'கடல் சுற்றுச்சூழல் அமைப்பு சுகாதார அறிக்கை' },
        description: {
          en: 'Annual and quarterly reports on marine ecosystem health status, biodiversity indices, and environmental trends for policy makers and stakeholders',
          si: 'ප්‍රතිපත්ති සම්පාදකයින් සහ පාර්ශවකරුවන් සඳහා සමුද්‍ර පරිසර පද්ධති සෞඛ්‍ය තත්ත්වය, ජෛව විවිධත්ව දර්ශක සහ පාරිසරික ප්‍රවණතා පිළිබඳ වාර්ෂික සහ කාර්තුමය වාර්තා',
          ta: 'கொள்கை வகுப்பாளர்கள் மற்றும் பங்குதாரர்களுக்கான கடல் சுற்றுச்சூழல் அமைப்பு சுகாதார நிலை, பல்லுயிர் குறியீடுகள் மற்றும் சுற்றுச்சூழல் போக்குகள் பற்றிய வருடாந்திர மற்றும் காலாண்டு அறிக்கைகள்'
        },
        icon: 'FileBarChart'
      }
    ],

    services: [
      {
        title: { en: 'Water Quality Testing Services', si: 'ජල ගුණාත්මක පරීක්ෂණ සේවා', ta: 'நீர் தர சோதனை சேவைகள்' },
        description: { 
          en: 'Comprehensive laboratory analysis of physical, chemical, and biological parameters with ISO-certified testing protocols and rapid turnaround times',
          si: 'ISO සහතික පරීක්ෂණ ප්‍රොටෝකෝල සහ වේගවත් සේවා කාලය සමඟ භෞතික, රසායනික සහ ජීව විද්‍යාත්මක පරාමිතිවල විස්තීර්ණ රසායනාගාර විශ්ලේෂණය',
          ta: 'ISO-சான்றளிக்கப்பட்ட சோதனை நெறிமுறைகள் மற்றும் விரைவான முடிவு நேரங்களுடன் இயற்பியல், வேதியியல் மற்றும் உயிரியல் அளவுருக்களின் விரிவான ஆய்வக பகுப்பாய்வு'
        },
        icon: 'TestTube'
      },
      {
        title: { en: 'Environmental Consulting & EIA Services', si: 'පාරිසරික උපදේශන සහ EIA සේවා', ta: 'சுற்றுச்சூழல் ஆலோசனை & EIA சேவைகள்' },
        description: { 
          en: 'Expert guidance for coastal development projects, marine spatial planning, baseline environmental surveys, and regulatory compliance support',
          si: 'වෙරළ සංවර්ධන ව්‍යාපෘති, සමුද්‍ර අවකාශ සැලසුම්කරණය, පාදක පාරිසරික සමීක්ෂණ සහ නියාමන අනුකූලතා සහාය සඳහා ප්‍රවීණ මග පෙන්වීම',
          ta: 'கடலோர மேம்பாட்டு திட்டங்கள், கடல் இட திட்டமிடல், அடிப்படை சுற்றுச்சூழல் ஆய்வுகள் மற்றும் ஒழுங்குமுறை இணக்க ஆதரவுக்கான நிபுணர் வழிகாட்டுதல்'
        },
        icon: 'FileSearch'
      },
      {
        title: { en: 'Emergency Pollution Response', si: 'හදිසි දූෂණ ප්‍රතිචාරය', ta: 'அவசர மாசுபாடு பதில்' },
        description: {
          en: '24/7 emergency response team for marine incidents including oil spills, chemical contamination, and harmful algal bloom events',
          si: 'තෙල් කාන්දු, රසායනික දූෂණය සහ හානිකර ඇල්ගී පිපීම් සිදුවීම් ඇතුළු සමුද්‍ර සිදුවීම් සඳහා 24/7 හදිසි ප්‍රතිචාර කණ්ඩායම',
          ta: 'எண்ணெய் கசிவுகள், இரசாயன மாசுபாடு மற்றும் தீங்கு விளைவிக்கும் பாசி மலர்ச்சி நிகழ்வுகள் உட்பட கடல் சம்பவங்களுக்கான 24/7 அவசர பதில் குழு'
        },
        icon: 'Siren'
      }
    ],

    contactEmail: 'esd@nara.ac.lk',
    contactPhone: '+94 11 2521000',
    location: 'NARA Headquarters, Crow Island, Colombo 15'
  },

  {
    id: 'fishing-technology',
    slug: 'fishing-technology-division',
    icon: 'Anchor',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
    category: 'research',

    name: {
      en: 'Fishing Technology Division',
      si: 'මසුන් ඇල්ලීමේ තාක්ෂණ අංශය',
      ta: 'மீன்பிடி தொழில்நுட்ப பிரிவு'
    },

    headOfDivision: {
      name: { en: 'Mr. Susantha Udayakumara', si: 'සුසන්ත උදයකුමාර මයා', ta: 'திரு. சுசந்த உதயகுமார' },
      title: { en: 'Research Officer', si: 'පර්යේෂණ නිලධාරී', ta: 'ஆராய்ச்சி அதிகாரி' }
    },

    areaOfResponsibility: {
      en: 'Fishing Gear Development, Bycatch Reduction & Sustainable Harvesting Technologies',
      si: 'මසුන් ඇල්ලීමේ උපකරණ සංවර්ධනය, අතුරු ඇල්ලීම අඩු කිරීම සහ තිරසාර අස්වැන්න තාක්ෂණයන්',
      ta: 'மீன்பிடி கருவி மேம்பாடு, துணை பிடிப்பு குறைப்பு & நிலையான அறுவடை தொழில்நுட்பங்கள்'
    },

    tagline: {
      en: 'Innovative fishing gear and methods for sustainable harvesting',
      si: 'තිරසාර අස්වැන්න සඳහා නව්‍ය මසුන් ඇල්ලීමේ උපකරණ සහ ක්‍රම',
      ta: 'நிலையான அறுவடைக்கான புதுமையான மீன்பிடி கருவிகள் மற்றும் முறைகள்'
    },

    description: {
      en: 'The Fishing Technology Division develops and tests innovative fishing gears and methods that reduce bycatch, minimize environmental impact, and improve fishing efficiency through acoustic pingers and sustainable practices.',
      si: 'මසුන් ඇල්ලීමේ තාක්ෂණ අංශය විසින් අතුරු ඇල්ලීම අඩු කරන, පාරිසරික බලපෑම අවම කරන සහ මසුන් ඇල්ලීමේ කාර්යක්ෂමතාව වැඩි දියුණු කරන නව්‍ය මසුන් ඇල්ලීමේ උපකරණ සහ ක්‍රම සංවර්ධනය කර පරීක්ෂා කරයි.',
      ta: 'மீன்பிடி தொழில்நுட்ப பிரிவு துணை பிடிப்பைக் குறைக்கும், சுற்றுச்சூழல் தாக்கத்தைக் குறைக்கும் மற்றும் மீன்பிடி திறனை மேம்படுத்தும் புதுமையான மீன்பிடி கருவிகள் மற்றும் முறைகளை உருவாக்கி சோதிக்கிறது.'
    },

    pdfResource: {
      filename: 'NARA-Fishing-Technology-Division.pdf',
      path: '/pdfs/divisions/NARA-Fishing-Technology-Division.pdf',
      pages: 6,
      sizeKB: 112,
      description: {
        en: 'Detailed information on fishing gear development, bycatch reduction technologies, and sustainable fishing methods',
        si: 'මසුන් ඇල්ලීමේ උපකරණ සංවර්ධනය, අතුරු ඇල්ලීම අඩු කිරීමේ තාක්ෂණයන් සහ තිරසාර මසුන් ඇල්ලීමේ ක්‍රම පිළිබඳ සවිස්තරාත්මක තොරතුරු',
        ta: 'மீன்பிடி கருவி மேம்பாடு, துணை பிடிப்பு குறைப்பு தொழில்நுட்பங்கள் மற்றும் நிலையான மீன்பிடி முறைகள் பற்றிய விரிவான தகவல்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',

    focusAreas: [
      {
        title: { en: 'Gear Development', si: 'උපකරණ සංවර්ධනය', ta: 'கருவி மேம்பாடு' },
        description: { en: 'Design and testing of innovative fishing gear', si: '', ta: '' },
        icon: 'Settings'
      },
      {
        title: { en: 'Bycatch Mitigation', si: 'අතුරු ඇල්ලීම අවම කිරීම', ta: 'துணை பிடிப்பு தணிப்பு' },
        description: { en: 'Technologies to reduce unwanted catch', si: '', ta: '' },
        icon: 'Shield'
      }
    ],

    services: [
      {
        title: { en: 'Gear Testing', si: 'උපකරණ පරීක්ෂණය', ta: 'கருவி சோதனை' },
        description: { en: 'Scientific testing of fishing gear performance', si: '', ta: '' }
      }
    ],

    contactEmail: 'fishtech@nara.ac.lk',
    contactPhone: '+94 11 2521003',
    location: 'Fishing Technology Center, Galle'
  },

  {
    id: 'inland-aquaculture',
    slug: 'inland-aquatic-aquaculture-division',
    icon: 'Droplet',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    category: 'research',

    name: {
      en: 'Inland Aquatic Resources and Aquaculture Division',
      si: 'අභ්‍යන්තර ජලජ සම්පත් සහ ජලජ වගා අංශය',
      ta: 'உள்நாட்டு நீர்வள வளங்கள் மற்றும் மீன் வளர்ப்பு பிரிவு'
    },

    headOfDivision: {
      name: { en: 'Dr. Nilantha Gammanpila', si: 'ආචාර්ය නිලන්ත ගම්මන්පිල', ta: 'டாக்டர். நிலந்த கம்மன்பில' },
      title: { en: 'Principal Scientist', si: 'ප්‍රධාන විද්‍යාඥ', ta: 'முதன்மை விஞ்ஞானி' }
    },

    areaOfResponsibility: {
      en: 'Freshwater Fish Breeding, Ornamental Fish Culture & Aquaculture Technology Development',
      si: 'මිරිදිය මත්ස්‍ය අභිජනනය, විසිතුරු මත්ස්‍ය වගාව සහ ජලජ වගා තාක්ෂණ සංවර්ධනය',
      ta: 'நன்னீர் மீன் இனப்பெருக்கம், அலங்கார மீன் வளர்ப்பு & மீன் வளர்ப்பு தொழில்நுட்ப மேம்பாடு'
    },

    tagline: {
      en: 'Advancing aquaculture technology for food security and livelihoods',
      si: 'ආහාර සුරක්ෂිතභාවය සහ ජීවනෝපාය සඳහා ජලජ වගා තාක්ෂණය ප්‍රවර්ධනය කිරීම',
      ta: 'உணவு பாதுகாப்பு மற்றும் வாழ்வாதாரத்திற்கான மீன் வளர்ப்பு தொழில்நுட்பத்தை முன்னேற்றுதல்'
    },

    description: {
      en: 'The Aquaculture Division develops sustainable aquaculture technologies for ornamental fish, shrimp, sea bass, sea cucumber, seaweed cultivation, and aquatic plant tissue culture with training and technical support.',
      si: 'ජලජ වගා අංශය විසින් විසිතුරු මත්ස්‍යයන්, ඉස්සන්, මුහුදු බාස්, මුහුදු පිපිඤ්ඤා, මුහුදු පැලෑටි වගාව සහ ජලජ ශාක පටක සංස්කෘතිය සඳහා තිරසාර ජලජ වගා තාක්ෂණයන් සංවර්ධනය කරයි.',
      ta: 'மீன் வளர்ப்பு பிரிவு அலங்கார மீன், இறால், கடல் பாஸ், கடல் வெள்ளரி, கடல்பாசி சாகுபடி மற்றும் நீர்வள தாவர திசு வளர்ப்பு ஆகியவற்றுக்கான நிலையான மீன் வளர்ப்பு தொழில்நுட்பங்களை உருவாக்குகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Inland-Aquaculture-Division.pdf',
      path: '/pdfs/divisions/NARA-Inland-Aquaculture-Division.pdf',
      pages: 8,
      sizeKB: 148,
      description: {
        en: 'Complete guide to inland aquaculture practices, breeding techniques, and sustainable farming methods',
        si: 'අභ්‍යන්තර ජලජ වගා පිළිවෙත්, අභිජනනය තාක්ෂණ සහ තිරසාර ගොවිතැන් ක්‍රම සඳහා සම්පූර්ණ මාර්ගෝපදේශය',
        ta: 'உள்நாட்டு மீன் வளர்ப்பு நடைமுறைகள், இனப்பெருக்க நுட்பங்கள் மற்றும் நிலையான விவசாய முறைகள் பற்றிய முழுமையான வழிகாட்டி'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1200',

    focusAreas: [
      {
        title: { en: 'Ornamental Fish Breeding', si: 'විසිතුරු මත්ස්‍ය අභිජනනය', ta: 'அலங்கார மீன் இனப்பெருக்கம்' },
        description: { en: 'Breeding technology for export-quality ornamental fish', si: '', ta: '' },
        icon: 'Fish'
      },
      {
        title: { en: 'Shrimp & Sea Bass', si: 'ඉස්සන් සහ මුහුදු බාස්', ta: 'இறால் மற்றும் கடல் பாஸ்' },
        description: { en: 'Commercial farming techniques', si: '', ta: '' },
        icon: 'Waves'
      }
    ],

    services: [
      {
        title: { en: 'Aquaculture Training', si: 'ජලජ වගා පුහුණුව', ta: 'மீன் வளர்ப்பு பயிற்சி' },
        description: { en: 'Comprehensive training programs for farmers', si: '', ta: '' }
      }
    ],

    contactEmail: 'aquaculture@nara.ac.lk',
    contactPhone: '+94 11 2521002',
    location: 'Aquaculture Research Station, Dambulla'
  },

  {
    id: 'post-harvest',
    slug: 'post-harvest-technology-division',
    icon: 'Award',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    category: 'research',

    name: {
      en: 'Institute of Post Harvest Technology',
      si: 'අස්වැන්න පසු තාක්ෂණ ආයතනය',
      ta: 'அறுவடைக்கு பிந்தைய தொழில்நுட்ப நிறுவனம்'
    },

    headOfDivision: {
      name: { en: 'Dr. Krishanthi Fernando', si: 'ආචාර්ය කෘෂාන්ති ප්‍රනාන්දු', ta: 'டாக்டர். கிருஷாந்தி பெர்னாண்டோ' },
      title: { en: 'Director/IPHT', si: 'අධ්‍යක්ෂ/IPHT', ta: 'இயக்குநர்/IPHT' }
    },

    areaOfResponsibility: {
      en: 'Seafood Quality Testing, ISO/IEC 17025 Laboratory Services & Export Certification',
      si: 'මුහුදු ආහාර ගුණාත්මක පරීක්ෂණ, ISO/IEC 17025 රසායනාගාර සේවා සහ අපනයන සහතික කිරීම',
      ta: 'கடல் உணவு தர சோதனை, ISO/IEC 17025 ஆய்வக சேவைகள் & ஏற்றுமதி சான்றிதழ்'
    },

    tagline: {
      en: 'ISO/IEC 17025 accredited testing for export quality seafood',
      si: 'අපනයන ගුණාත්මක මුහුදු ආහාර සඳහා ISO/IEC 17025 පිළිගත් පරීක්ෂණ',
      ta: 'ஏற்றுமதி தர கடல் உணவுக்கான ISO/IEC 17025 அங்கீகரிக்கப்பட்ட சோதனை'
    },

    description: {
      en: 'Our ISO/IEC 17025 accredited laboratories provide comprehensive testing services including microbiology, histamine analysis, chemical residues, and quality certification for export seafood.',
      si: 'අපගේ ISO/IEC 17025 පිළිගත් රසායනාගාර ක්ෂුද්‍ර ජීව විද්‍යාව, හිස්ටමින් විශ්ලේෂණය, රසායනික අවශේෂ සහ ගුණාත්මක සහතික කිරීම ඇතුළු විස්තීර්ණ පරීක්ෂණ සේවා සපයයි.',
      ta: 'எங்கள் ISO/IEC 17025 அங்கீகரிக்கப்பட்ட ஆய்வகங்கள் நுண்ணுயிரியல், ஹிஸ்டமைன் பகுப்பாய்வு, இரசாயன எச்சங்கள் மற்றும் தர சான்றிதழ் உட்பட விரிவான சோதனை சேவைகளை வழங்குகின்றன.'
    },

    pdfResource: {
      filename: 'NARA-Post-Harvest-Technology.pdf',
      path: '/pdfs/divisions/NARA-Post-Harvest-Technology.pdf',
      pages: 9,
      sizeKB: 161,
      description: {
        en: 'Comprehensive overview of quality testing, food safety protocols, and certification services',
        si: 'ගුණාත්මක පරීක්ෂණ, ආහාර සුරක්ෂිතතා ප්‍රොටෝකෝල සහ සහතික සේවා පිළිබඳ සවිස්තරාත්මක දළ විශ්ලේෂණය',
        ta: 'தர சோதனை, உணவு பாதுகாப்பு நெறிமுறைகள் மற்றும் சான்றிதழ் சேவைகள் பற்றிய விரிவான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200',

    focusAreas: [
      {
        title: { en: 'Microbiological Testing', si: 'ක්ෂුද්‍ර ජීව විද්‍යා පරීක්ෂණ', ta: 'நுண்ணுயிரியல் சோதனை' },
        description: { en: 'Detection of bacteria and pathogens', si: '', ta: '' },
        icon: 'Microscope'
      },
      {
        title: { en: 'Quality Certification', si: 'ගුණාත්මක සහතික කිරීම', ta: 'தர சான்றிதழ்' },
        description: { en: 'Export quality certificates', si: '', ta: '' },
        icon: 'Award'
      }
    ],

    services: [
      {
        title: { en: 'Laboratory Testing', si: 'රසායනාගාර පරීක්ෂණ', ta: 'ஆய்வக சோதனை' },
        description: { en: 'Comprehensive testing services', si: '', ta: '' }
      }
    ],

    contactEmail: 'quality@nara.ac.lk',
    contactPhone: '+94 11 2521004',
    location: 'NARA Quality Assurance Laboratory, Colombo'
  },

  {
    id: 'marine-biology',
    slug: 'marine-biological-division',
    icon: 'Waves',
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-500',
    category: 'research',

    name: {
      en: 'Marine Biological Resources Division (MBRD)',
      si: 'සමුද්‍ර ජීව විද්‍යා සම්පත් අංශය (MBRD)',
      ta: 'கடல் உயிரியல் வள பிரிவு (MBRD)'
    },

    headOfDivision: {
      name: { en: 'Dr. Arundathi Madusinghe', si: 'ආචාර්ය අරුන්දතී මදුසිංහ', ta: 'டாக்டர். அருந்ததி மதுசிங்கே' },
      title: { en: 'Senior Research Officer', si: 'ජ්‍යෙෂ්ඨ පර්යේෂණ නිලධාරී', ta: 'மூத்த ஆராய்ச்சி அதிகாரி' }
    },

    areaOfResponsibility: {
      en: 'Marine Biodiversity Conservation, Coral Reef Monitoring & Marine Mammal Research',
      si: 'සමුද්‍ර ජෛව විවිධත්ව සංරක්ෂණය, කොරල් පර නිරීක්ෂණය සහ සමුද්‍ර ක්ෂීරපායී පර්යේෂණ',
      ta: 'கடல் பல்லுயிர் பாதுகாப்பு, பவளப்பாறை கண்காணிப்பு & கடல் பாலூட்டி ஆராய்ச்சி'
    },

    tagline: {
      en: 'Protecting marine life and ecosystems for future generations',
      si: 'අනාගත පරම්පරා සඳහා සමුද්‍ර ජීවිතය සහ පරිසර පද්ධති ආරක්ෂා කිරීම',
      ta: 'எதிர்கால சந்ததியினருக்கு கடல் வாழ்க்கை மற்றும் சுற்றுச்சூழல் அமைப்புகளைப் பாதுகாத்தல்'
    },

    description: {
      en: 'The Marine Biological Resources Division focuses on conservation and study of marine mammals, coral reefs, seagrass beds, and critical marine ecosystems with stranding response and environmental forensics.',
      si: 'සමුද්‍ර ජීව විද්‍යා සම්පත් අංශය සමුද්‍ර ක්ෂීරපායින්, කොරල් පර, මුහුදු තණකොළ සහ තීරණාත්මක සමුද්‍ර පරිසර පද්ධති සංරක්ෂණය සහ අධ්‍යයනය කෙරෙහි අවධානය යොමු කරයි.',
      ta: 'கடல் உயிரியல் வள பிரிவு கடல் பாலூட்டிகள், பவளப்பாறைகள், கடற்பாசி படுகைகள் மற்றும் முக்கிய கடல் சுற்றுச்சூழல் அமைப்புகளின் பாதுகாப்பு மற்றும் ஆய்வு மீது கவனம் செலுத்துகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Marine-Biological-Division.pdf',
      path: '/pdfs/divisions/NARA-Marine-Biological-Division.pdf',
      pages: 9,
      sizeKB: 180,
      description: {
        en: 'Detailed information on marine biodiversity, conservation programs, and ecosystem research',
        si: 'සමුද්‍ර ජෛව විවිධත්වය, සංරක්ෂණ වැඩසටහන් සහ පරිසර පද්ධති පර්යේෂණ පිළිබඳ සවිස්තරාත්මක තොරතුරු',
        ta: 'கடல் பல்லுயிர், பாதுகாப்பு திட்டங்கள் மற்றும் சுற்றுச்சூழல் அமைப்பு ஆராய்ச்சி பற்றிய விரிவான தகவல்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200',

    focusAreas: [
      {
        title: { en: 'Marine Mammals', si: 'සමුද්‍ර ක්ෂීරපායින්', ta: 'கடல் பாலூட்டிகள்' },
        description: { en: 'Research and conservation of whales, dolphins, and dugongs', si: '', ta: '' },
        icon: 'Fish'
      },
      {
        title: { en: 'Coral Reefs', si: 'කොරල් පර', ta: 'பவளப்பாறைகள்' },
        description: { en: 'Monitoring and restoration', si: '', ta: '' },
        icon: 'Layers'
      }
    ],

    services: [
      {
        title: { en: 'Marine Mammal Rescue', si: 'සමුද්‍ර ක්ෂීරපායින් ගලවා ගැනීම', ta: 'கடல் பாலூட்டி மீட்பு' },
        description: { en: 'Emergency response services', si: '', ta: '' }
      }
    ],

    contactEmail: 'marinebio@nara.ac.lk',
    contactPhone: '+94 11 2521001',
    location: 'NARA Marine Laboratory, Colombo'
  },

  {
    id: 'oceanography',
    slug: 'oceanography-marine-sciences-division',
    icon: 'Compass',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    category: 'research',

    name: {
      en: 'National Institute of Oceanography & Marine Sciences',
      si: 'ජාතික සාගර විද්‍යා සහ සමුද්‍ර විද්‍යා ආයතනය',
      ta: 'தேசிய கடலியல் மற்றும் கடல் அறிவியல் நிறுவனம்'
    },

    headOfDivision: {
      name: { en: 'Prof. Upali Amarasinghe', si: 'මහාචාර්ය උපාලි අමරසිංහ', ta: 'பேராசிரியர். உபாலி அமரசிங்ஹே' },
      title: { en: 'Director/NIOMS', si: 'අධ්‍යක්ෂ/NIOMS', ta: 'இயக்குநர்/NIOMS' }
    },

    areaOfResponsibility: {
      en: 'Physical Oceanography, Climate Change Research & Marine Chemistry Studies',
      si: 'භෞතික සාගර විද්‍යාව, දේශගුණ විපර්යාස පර්යේෂණ සහ සමුද්‍ර රසායන විද්‍යා අධ්‍යයන',
      ta: 'இயற்பியல் கடலியல், காலநிலை மாற்ற ஆராய்ச்சி & கடல் வேதியியல் ஆய்வுகள்'
    },

    tagline: {
      en: 'Understanding ocean dynamics through cutting-edge research',
      si: 'අත්‍යාවශ්‍ය පර්යේෂණ හරහා සාගර ගතිකත්වය අවබෝධ කර ගැනීම',
      ta: 'அதிநவீன ஆராய்ச்சி மூலம் கடல் இயக்கவியல் புரிந்துகொள்ளுதல்'
    },

    description: {
      en: 'The National Institute of Oceanography conducts comprehensive research on ocean currents, climate change impacts, marine chemistry, and oceanographic processes affecting Sri Lankan waters.',
      si: 'ජාතික සාගර විද්‍යා ආයතනය සාගර ප්‍රවාහ, දේශගුණ විපර්යාස බලපෑම්, සමුද්‍ර රසායන විද්‍යාව සහ ශ්‍රී ලංකා ජලයට බලපාන සාගර ක්‍රියාවලීන් පිළිබඳ විස්තීර්ණ පර්යේෂණ සිදු කරයි.',
      ta: 'தேசிய கடலியல் நிறுவனம் கடல் நீரோட்டங்கள், காலநிலை மாற்ற தாக்கங்கள், கடல் வேதியியல் மற்றும் இலங்கை நீரை பாதிக்கும் கடலியல் செயல்முறைகள் பற்றிய விரிவான ஆராய்ச்சியை நடத்துகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Oceanography-Division.pdf',
      path: '/pdfs/divisions/NARA-Oceanography-Division.pdf',
      pages: 9,
      sizeKB: 157,
      description: {
        en: 'Comprehensive guide to oceanographic research, climate studies, and marine science programs',
        si: 'සාගර විද්‍යා පර්යේෂණ, දේශගුණ අධ්‍යයන සහ සමුද්‍ර විද්‍යා වැඩසටහන් සඳහා සවිස්තරාත්මක මාර්ගෝපදේශය',
        ta: 'கடலியல் ஆராய்ச்சி, காலநிலை ஆய்வுகள் மற்றும் கடல் அறிவியல் திட்டங்கள் பற்றிய விரிவான வழிகாட்டி'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',

    focusAreas: [
      {
        title: { en: 'Ocean Dynamics', si: 'සාගර ගතිකත්වය', ta: 'கடல் இயக்கவியல்' },
        description: { en: 'Study of currents and circulation patterns', si: '', ta: '' },
        icon: 'Wind'
      },
      {
        title: { en: 'Climate Research', si: 'දේශගුණ පර්යේෂණ', ta: 'காலநிலை ஆராய்ச்சி' },
        description: { en: 'Climate change impact studies', si: '', ta: '' },
        icon: 'CloudRain'
      }
    ],

    services: [
      {
        title: { en: 'Oceanographic Surveys', si: 'සාගර විද්‍යා සමීක්ෂණ', ta: 'கடலியல் ஆய்வுகள்' },
        description: { en: 'Research cruises and data collection', si: '', ta: '' }
      }
    ],

    contactEmail: 'oceanography@nara.ac.lk',
    contactPhone: '+94 11 2521006',
    location: 'NARA Oceanography Center, Colombo'
  },

  {
    id: 'hydrography',
    slug: 'hydrographic-division',
    icon: 'Map',
    color: 'sky',
    gradient: 'from-sky-500 to-blue-500',
    category: 'research',

    name: {
      en: 'Hydrographic Division - National Hydrographic Office',
      si: 'ජල මිතීම් අංශය - ජාතික ජල මිතීම් කාර්යාලය',
      ta: 'நீர்வியல் பிரிவு - தேசிய நீர்வியல் அலுவலகம்'
    },

    headOfDivision: {
      name: { en: 'Cdr. Sanjeewa Perera', si: 'සේනාධිනායක සංජීව පෙරේරා', ta: 'கமாண்டர். சஞ்சீவ பெரேரா' },
      title: { en: 'National Hydrographer', si: 'ජාතික ජල මිතීක', ta: 'தேசிய நீர்வியல் நிபுணர்' }
    },

    areaOfResponsibility: {
      en: 'Nautical Chart Production, Bathymetric Surveys & Maritime Safety Services',
      si: 'සමුද්‍ර සිතියම් නිෂ්පාදනය, ගැඹුරු මිතීමේ සමීක්ෂණ සහ සමුද්‍ර ආරක්ෂණ සේවා',
      ta: 'கடல்சார் வரைபட தயாரிப்பு, குளிர்நீர் ஆய்வுகள் & கடல்சார் பாதுகாப்பு சேவைகள்'
    },

    tagline: {
      en: 'Precise nautical charts for safe navigation in Sri Lankan waters',
      si: 'ශ්‍රී ලංකා ජලයේ ආරක්ෂිත යාත්‍රා කිරීම සඳහා නිරවද්‍ය සමුද්‍ර සිතියම්',
      ta: 'இலங்கை நீரில் பாதுகாப்பான வழிசெலுத்தலுக்கான துல்லியமான கடல்சார் வரைபடங்கள்'
    },

    description: {
      en: 'The Hydrographic Division produces Electronic Navigational Charts (ENCs), conducts bathymetric surveys, and maps coastal areas contributing to GEBCO and Seabed 2030 initiatives.',
      si: 'ජල මිතීම් අංශය විසින් ඉලෙක්ට්‍රොනික යාත්‍රා සිතියම් (ENCs) නිෂ්පාදනය කරයි, ගැඹුරු මිතීමේ සමීක්ෂණ පවත්වයි, සහ වෙරළ ප්‍රදේශ සිතියම්ගත කරයි.',
      ta: 'நீர்வியல் பிரிவு மின்னணு வழிசெலுத்தல் வரைபடங்களை தயாரிக்கிறது, குளிர்நீர் ஆய்வுகளை நடத்துகிறது மற்றும் கடலோர பகுதிகளை வரைபடமாக்குகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Hydrographic-Division.pdf',
      path: '/pdfs/divisions/NARA-Hydrographic-Division.pdf',
      pages: 10,
      sizeKB: 201,
      description: {
        en: 'Complete overview of nautical chart production, bathymetric surveys, and hydrographic services',
        si: 'සමුද්‍ර සිතියම් නිෂ්පාදනය, ගැඹුරු මිතීම් සමීක්ෂණ සහ ජල මිතීම් සේවා පිළිබඳ සම්පූර්ණ දළ විශ්ලේෂණය',
        ta: 'கடல்சார் வரைபட தயாரிப்பு, குளிர்நீர் ஆய்வுகள் மற்றும் நீர்வியல் சேவைகள் பற்றிய முழுமையான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1200',

    focusAreas: [
      {
        title: { en: 'Electronic Charts (ENCs)', si: 'ඉලෙක්ට්‍රොනික සිතියම්', ta: 'மின்னணு வரைபடங்கள்' },
        description: { en: 'Production of S-57/S-100 standard charts', si: '', ta: '' },
        icon: 'Map'
      },
      {
        title: { en: 'Bathymetric Surveys', si: 'ගැඹුරු මිතීමේ සමීක්ෂණ', ta: 'குளிர்நீர் ஆய்வுகள்' },
        description: { en: 'Seafloor mapping', si: '', ta: '' },
        icon: 'Layers'
      }
    ],

    services: [
      {
        title: { en: 'Chart Production', si: 'සිතියම් නිෂ්පාදනය', ta: 'வரைபட தயாரிப்பு' },
        description: { en: 'Custom nautical charts', si: '', ta: '' }
      }
    ],

    contactEmail: 'hydrography@nara.ac.lk',
    contactPhone: '+94 11 2521007',
    location: 'Hydrographic Office, Colombo'
  },

  {
    id: 'socio-economics',
    slug: 'socio-economic-marketing-division',
    icon: 'TrendingUp',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    category: 'research',

    name: {
      en: 'Socio-Economic & Marketing Research Division',
      si: 'සමාජ-ආර්ථික සහ අලෙවිකරණ පර්යේෂණ අංශය',
      ta: 'சமூக-பொருளாதாரம் & சந்தைப்படுத்தல் ஆராய்ச்சி பிரிவு'
    },

    headOfDivision: {
      name: { en: 'Dr. Priyantha Wijewardane', si: 'ආචාර්ය ප්‍රියන්ත විජේවර්ධන', ta: 'டாக்டர். பிரியந்த விஜேவர்தனே' },
      title: { en: 'Principal Scientist', si: 'ප්‍රධාන විද්‍යාඥ', ta: 'முதன்மை விஞ்ஞானி' }
    },

    areaOfResponsibility: {
      en: 'Fisheries Economics, Market Research & Fisher Community Development',
      si: 'මත්ස්‍ය ආර්ථික විද්‍යාව, වෙළඳපල පර්යේෂණ සහ ධීවර ප්‍රජා සංවර්ධනය',
      ta: 'மீன்வள பொருளாதாரம், சந்தை ஆராய்ச்சி & மீனவர் சமூக மேம்பாடு'
    },

    tagline: {
      en: 'Empowering fishing communities through economic research and market development',
      si: 'ආර්ථික පර්යේෂණ සහ වෙළඳපල සංවර්ධනය තුළින් ධීවර ප්‍රජාවන් සවිබල ගැන්වීම',
      ta: 'பொருளாதார ஆராய்ச்சி மற்றும் சந்தை மேம்பாடு மூலம் மீன்பிடி சமூகங்களுக்கு அதிகாரம் அளித்தல்'
    },

    description: {
      en: 'The Socio-Economics Division conducts research on fisheries economics, market trends, value chain analysis, and fisher welfare providing industry outlook and policy recommendations.',
      si: 'සමාජ-ආර්ථික අංශය මත්ස්‍ය ආර්ථික විද්‍යාව, වෙළඳපල ප්‍රවණතා, වටිනාකම් දාම විශ්ලේෂණය සහ ධීවර සුභසාධනය පිළිබඳ පර්යේෂණ සිදු කරයි.',
      ta: 'சமூக-பொருளாதார பிரிவு மீன்வள பொருளாதாரம், சந்தை போக்குகள், மதிப்பு சங்கிலி பகுப்பாய்வு மற்றும் மீனவர் நலன் பற்றிய ஆராய்ச்சியை நடத்துகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Socio-Economic-Division.pdf',
      path: '/pdfs/divisions/NARA-Socio-Economic-Division.pdf',
      pages: 11,
      sizeKB: 197,
      description: {
        en: 'Detailed analysis of fisheries economics, market research, and community development programs',
        si: 'මත්ස්‍ය ආර්ථික විද්‍යාව, වෙළඳපල පර්යේෂණ සහ ප්‍රජා සංවර්ධන වැඩසටහන් පිළිබඳ සවිස්තරාත්මක විශ්ලේෂණය',
        ta: 'மீன்வள பொருளாதாரம், சந்தை ஆராய்ச்சி மற்றும் சமூக மேம்பாடு திட்டங்கள் பற்றிய விரிவான பகுப்பாய்வு'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',

    focusAreas: [
      {
        title: { en: 'Industry Outlook', si: 'කර්මාන්ත දැක්ම', ta: 'தொழில் கண்ணோட்டம்' },
        description: { en: 'Economic forecasting', si: '', ta: '' },
        icon: 'TrendingUp'
      },
      {
        title: { en: 'Fisher Welfare', si: 'ධීවර සුභසාධනය', ta: 'மீனவர் நலன்' },
        description: { en: 'Community development', si: '', ta: '' },
        icon: 'Heart'
      }
    ],

    services: [
      {
        title: { en: 'Market Research', si: 'වෙළඳපල පර්යේෂණ', ta: 'சந்தை ஆராய்ச்சி' },
        description: { en: 'Market analysis and reports', si: '', ta: '' }
      }
    ],

    contactEmail: 'socioeco@nara.ac.lk',
    contactPhone: '+94 11 2521008',
    location: 'NARA Socio-Economics Unit, Colombo'
  },

  {
    id: 'monitoring-evaluation',
    slug: 'monitoring-evaluation-division',
    icon: 'BarChart3',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    category: 'research',

    name: {
      en: 'Monitoring and Evaluation Division',
      si: 'නිරීක්ෂණ සහ ඇගයීම් අංශය',
      ta: 'கண்காணிப்பு மற்றும் மதிப்பீட்டு பிரிவு'
    },

    headOfDivision: {
      name: { en: 'Mr. Nalaka Gunawardane', si: 'නාලක ගුණවර්ධන මයා', ta: 'திரு. நாலக குணவர்தனே' },
      title: { en: 'Research Officer', si: 'පර්යේෂණ නිලධාරී', ta: 'ஆராய்ச்சி அதிகாரி' }
    },

    areaOfResponsibility: {
      en: 'Research Performance Tracking, Impact Assessment & Quality Assurance',
      si: 'පර්යේෂණ කාර්ය සාධන නිරීක්ෂණය, බලපෑම් තක්සේරුව සහ ගුණාත්මක සහතික කිරීම',
      ta: 'ஆராய்ச்சி செயல்திறன் கண்காணிப்பு, தாக்க மதிப்பீடு & தர உத்தரவாதம்'
    },

    tagline: {
      en: 'Ensuring excellence through systematic monitoring and evaluation',
      si: 'ක්‍රමානුකූල නිරීක්ෂණ සහ ඇගයීම හරහා විශිෂ්ටත්වය සහතික කිරීම',
      ta: 'முறையான கண்காணிப்பு மற்றும் மதிப்பீடு மூலம் சிறப்பை உறுதிசெய்தல்'
    },

    description: {
      en: 'The Monitoring and Evaluation Division tracks research progress, assesses project impacts, and ensures quality standards across all NARA divisions through systematic evaluation frameworks.',
      si: 'නිරීක්ෂණ සහ ඇගයීම් අංශය පර්යේෂණ ප්‍රගතිය නිරීක්ෂණය කරයි, ව්‍යාපෘති බලපෑම් තක්සේරු කරයි, සහ ක්‍රමානුකූල ඇගයීම් රාමු හරහා සියලුම NARA අංශවල ගුණාත්මක ප්‍රමිතීන් සහතික කරයි.',
      ta: 'கண்காணிப்பு மற்றும் மதிப்பீட்டு பிரிவு ஆராய்ச்சி முன்னேற்றத்தை கண்காணிக்கிறது, திட்ட தாக்கங்களை மதிப்பிடுகிறது மற்றும் முறையான மதிப்பீட்டு கட்டமைப்புகள் மூலம் அனைத்து NARA பிரிவுகளிலும் தர தரங்களை உறுதிசெய்கிறது.'
    },

    pdfResource: {
      filename: 'NARA-Monitoring-Evaluation-Division.pdf',
      path: '/pdfs/divisions/NARA-Monitoring-Evaluation-Division.pdf',
      pages: 12,
      sizeKB: 196,
      description: {
        en: 'Comprehensive guide to M&E frameworks, performance indicators, and quality assurance systems',
        si: 'M&E රාමු, කාර්ය සාධන දර්ශක සහ ගුණාත්මක සහතික පද්ධති සඳහා සවිස්තරාත්මක මාර්ගෝපදේශය',
        ta: 'M&E கட்டமைப்புகள், செயல்திறன் குறிகாட்டிகள் மற்றும் தர உத்தரவாத அமைப்புகள் பற்றிய விரிவான வழிகாட்டி'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',

    focusAreas: [
      {
        title: { en: 'Performance Tracking', si: 'කාර්ය සාධන නිරීක්ෂණය', ta: 'செயல்திறன் கண்காணிப்பு' },
        description: { en: 'Systematic monitoring of research outputs', si: '', ta: '' },
        icon: 'Activity'
      },
      {
        title: { en: 'Impact Assessment', si: 'බලපෑම් තක්සේරුව', ta: 'தாக்க மதிப்பீடு' },
        description: { en: 'Evaluation of project outcomes', si: '', ta: '' },
        icon: 'Target'
      }
    ],

    services: [
      {
        title: { en: 'M&E Framework Development', si: 'M&E රාමු සංවර්ධනය', ta: 'M&E கட்டமைப்பு மேம்பாடு' },
        description: { en: 'Custom evaluation frameworks', si: '', ta: '' }
      }
    ],

    contactEmail: 'monitoring@nara.ac.lk',
    contactPhone: '+94 11 2521009',
    location: 'NARA M&E Division, Colombo'
  },

  {
    id: 'aquaculture-center',
    slug: 'aquaculture-research-center',
    icon: 'Building2',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-500',
    category: 'research',

    name: {
      en: 'Aquaculture Research Center',
      si: 'ජලජ වගා පර්යේෂණ මධ්‍යස්ථානය',
      ta: 'மீன் வளர்ப்பு ஆராய்ச்சி மையம்'
    },

    headOfDivision: {
      name: { en: 'Dr. Asiri Dayananda', si: 'ආචාර්ය අසිරි දයානන්ද', ta: 'டாக்டர். அசிரி தயானந்த' },
      title: { en: 'Center Director', si: 'මධ්‍යස්ථාන අධ්‍යක්ෂ', ta: 'மைய இயக்குநர்' }
    },

    areaOfResponsibility: {
      en: 'Aquaculture Research, Farmer Training & Technology Demonstration',
      si: 'ජලජ වගා පර්යේෂණ, ගොවි පුහුණුව සහ තාක්ෂණ ප්‍රදර්ශන',
      ta: 'மீன் வளர்ப்பு ஆராய்ச்சி, விவசாயி பயிற்சி & தொழில்நுட்ப விளக்கம்'
    },

    tagline: {
      en: 'Leading aquaculture innovation and sustainable farming practices',
      si: 'ජලජ වගා නවෝත්පාදන සහ තිරසාර ගොවිතැන් පිළිවෙත් ප්‍රමුඛත්වය දීම',
      ta: 'மீன் வளர்ப்பு புதுமை மற்றும் நிலையான விவசாய நடைமுறைகளை முன்னணியில் கொண்டு செல்லுதல்'
    },

    description: {
      en: 'The Aquaculture Research Center serves as a hub for practical research, farmer training, and technology demonstration in ornamental fish, shrimp, and marine aquaculture systems.',
      si: 'ජලජ වගා පර්යේෂණ මධ්‍යස්ථානය විසිතුරු මත්ස්‍යයන්, ඉස්සන් සහ සමුද්‍ර ජලජ වගා පද්ධතිවල ප්‍රායෝගික පර්යේෂණ, ගොවි පුහුණුව සහ තාක්ෂණ ප්‍රදර්ශන සඳහා මධ්‍යස්ථානයක් ලෙස සේවය කරයි.',
      ta: 'மீன் வளர்ப்பு ஆராய்ச்சி மையம் அலங்கார மீன், இறால் மற்றும் கடல் மீன் வளர்ப்பு அமைப்புகளில் நடைமுறை ஆராய்ச்சி, விவசாயி பயிற்சி மற்றும் தொழில்நுட்ப விளக்கத்திற்கான மையமாக செயல்படுகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Aquaculture-Research-Center.pdf',
      path: '/pdfs/divisions/NARA-Aquaculture-Research-Center.pdf',
      pages: 14,
      sizeKB: 222,
      description: {
        en: 'Complete overview of research facilities, training programs, and aquaculture technologies',
        si: 'පර්යේෂණ පහසුකම්, පුහුණු වැඩසටහන් සහ ජලජ වගා තාක්ෂණයන් පිළිබඳ සම්පූර්ණ දළ විශ්ලේෂණය',
        ta: 'ஆராய்ச்சி வசதிகள், பயிற்சி திட்டங்கள் மற்றும் மீன் வளர்ப்பு தொழில்நுட்பங்கள் பற்றிய முழுமையான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=1200',

    focusAreas: [
      {
        title: { en: 'Research Facilities', si: 'පර්යේෂණ පහසුකම්', ta: 'ஆராய்ச்சி வசதிகள்' },
        description: { en: 'State-of-the-art aquaculture labs', si: '', ta: '' },
        icon: 'Building2'
      },
      {
        title: { en: 'Farmer Training', si: 'ගොවි පුහුණුව', ta: 'விவசாயி பயிற்சி' },
        description: { en: 'Hands-on training programs', si: '', ta: '' },
        icon: 'GraduationCap'
      }
    ],

    services: [
      {
        title: { en: 'Technology Demonstration', si: 'තාක්ෂණ ප්‍රදර්ශන', ta: 'தொழில்நுட்ப விளக்கம்' },
        description: { en: 'Practical aquaculture demonstrations', si: '', ta: '' }
      }
    ],

    contactEmail: 'arcenter@nara.ac.lk',
    contactPhone: '+94 11 2521010',
    location: 'Aquaculture Research Center, Dambulla'
  },

  {
    id: 'administration',
    slug: 'administration-division',
    icon: 'Briefcase',
    color: 'slate',
    gradient: 'from-slate-500 to-gray-600',
    category: 'supporting',

    name: {
      en: 'Administration Division',
      si: 'පරිපාලන අංශය',
      ta: 'நிர்வாகப் பிரிவு'
    },

    headOfDivision: {
      name: { en: 'Mrs. Padmini Senanayake', si: 'පද්මිනී සේනානායක මිය', ta: 'திருமதி. பத்மினி சேனாநாயக்க' },
      title: { en: 'Deputy Director (Admin)', si: 'නියෝජ්‍ය අධ්‍යක්ෂ (පරිපාලන)', ta: 'துணை இயக்குநர் (நிர்வாகம்)' }
    },

    areaOfResponsibility: {
      en: 'Human Resources, Personnel Management & Administrative Services',
      si: 'මානව සම්පත්, පිරිස් කළමනාකරණය සහ පරිපාලන සේවා',
      ta: 'மனித வளங்கள், பணியாளர் மேலாண்மை & நிர்வாக சேவைகள்'
    },

    tagline: {
      en: 'Efficient administration and human resource management for organizational excellence',
      si: 'ආයතනික විශිෂ්ටත්වය සඳහා කාර්යක්ෂම පරිපාලනය සහ මානව සම්පත් කළමනාකරණය',
      ta: 'நிறுவன சிறப்புக்கான திறமையான நிர்வாகம் மற்றும் மனித வள மேலாண்மை'
    },

    description: {
      en: 'The Administration Division manages all administrative functions, human resources, personnel management, training and development, welfare services, and institutional support ensuring smooth operations across all NARA facilities.',
      si: 'පරිපාලන අංශය සියලුම පරිපාලන කාර්යයන්, මානව සම්පත්, පිරිස් කළමනාකරණය, පුහුණුව සහ සංවර්ධනය, සුභසාධන සේවා සහ ආයතනික සහාය කළමනාකරණය කරමින් සියලුම NARA පහසුකම් හරහා සුමට මෙහෙයුම් සහතික කරයි.',
      ta: 'நிர்வாகப் பிரிவு அனைத்து நிர்வாக செயல்பாடுகள், மனித வளங்கள், பணியாளர் மேலாண்மை, பயிற்சி மற்றும் மேம்பாடு, நலன்புரி சேவைகள் மற்றும் நிறுவன ஆதரவை நிர்வகிக்கிறது, அனைத்து NARA வசதிகளிலும் சுமூகமான செயல்பாடுகளை உறுதிசெய்கிறது.'
    },

    pdfResource: {
      filename: 'NARA-Administration-Division.pdf',
      path: '/pdfs/divisions/NARA-Administration-Division.pdf',
      pages: 7,
      sizeKB: 128,
      description: {
        en: 'Comprehensive overview of administrative services, HR policies, staff development programs, and organizational support systems',
        si: 'පරිපාලන සේවා, මානව සම්පත් ප්‍රතිපත්ති, කාර්ය මණ්ඩල සංවර්ධන වැඩසටහන් සහ ආයතනික සහාය පද්ධති පිළිබඳ සවිස්තරාත්මක දළ විශ්ලේෂණය',
        ta: 'நிர்வாக சேவைகள், மனிதவள கொள்கைகள், பணியாளர் மேம்பாட்டு திட்டங்கள் மற்றும் நிறுவன ஆதரவு அமைப்புகள் பற்றிய விரிவான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',

    focusAreas: [
      {
        title: { en: 'Human Resource Management', si: 'මානව සම්පත් කළමනාකරණය', ta: 'மனித வள மேலாண்மை' },
        description: {
          en: 'Comprehensive HR services including recruitment, performance management, career development, succession planning, and talent retention strategies for scientific and administrative staff',
          si: 'විද්‍යාත්මක හා පරිපාලන කාර්ය මණ්ඩලය සඳහා බඳවා ගැනීම්, කාර්ය සාධන කළමනාකරණය, වෘත්තීය සංවර්ධනය, අනුප්‍රාප්තික සැලසුම් සහ දක්ෂතා රඳවා තබා ගැනීමේ උපාය මාර්ග ඇතුළු විස්තීර්ණ මානව සම්පත් සේවා',
          ta: 'அறிவியல் மற்றும் நிர்வாக ஊழியர்களுக்கான ஆட்சேர்ப்பு, செயல்திறன் மேலாண்மை, தொழில் மேம்பாடு, வாரிசு திட்டமிடல் மற்றும் திறமை தக்கவைப்பு உத்திகள் உட்பட விரிவான மனிதவள சேவைகள்'
        },
        icon: 'Users'
      },
      {
        title: { en: 'Personnel & Records Management', si: 'පිරිස් සහ වාර්තා කළමනාකරණය', ta: 'பணியாளர் & பதிவு மேலாண்மை' },
        description: {
          en: 'Maintenance of comprehensive employee records, leave management, attendance tracking, service history documentation, and digital record-keeping systems with secure data management',
          si: 'ආරක්ෂිත දත්ත කළමනාකරණය සමඟ විස්තීර්ණ සේවක වාර්තා නඩත්තුව, නිවාඩු කළමනාකරණය, පැමිණීම් ලුහුබැඳීම, සේවා ඉතිහාස ලේඛනගත කිරීම සහ ඩිජිටල් වාර්තා තබා ගැනීමේ පද්ධති',
          ta: 'பாதுகாப்பான தரவு மேலாண்மையுடன் விரிவான பணியாளர் பதிவுகள் பராமரிப்பு, விடுப்பு மேலாண்மை, வருகை கண்காணிப்பு, சேவை வரலாறு ஆவணப்படுத்தல் மற்றும் டிஜிட்டல் பதிவு-பராமரிப்பு அமைப்புகள்'
        },
        icon: 'FileText'
      },
      {
        title: { en: 'Training & Capacity Building', si: 'පුහුණුව සහ ධාරිතා ගොඩනැංවීම', ta: 'பயிற்சி & திறன் மேம்பாடு' },
        description: {
          en: 'Organization of professional development workshops, technical training programs, leadership development courses, international exchange programs, and continuous learning opportunities for staff at all levels',
          si: 'වෘත්තීය සංවර්ධන වැඩමුළු, තාක්ෂණික පුහුණු වැඩසටහන්, නායකත්ව සංවර්ධන පාඨමාලා, ජාත්‍යන්තර හුවමාරු වැඩසටහන් සහ සියලුම මට්ටම්වල කාර්ය මණ්ඩලය සඳහා අඛණ්ඩ ඉගෙනීමේ අවස්ථා සංවිධානය කිරීම',
          ta: 'தொழில்முறை மேம்பாட்டு பட்டறைகள், தொழில்நுட்ப பயிற்சி திட்டங்கள், தலைமைத்துவ மேம்பாட்டு படிப்புகள், சர்வதேச பரிமாற்ற திட்டங்கள் மற்றும் அனைத்து மட்டங்களிலும் உள்ள ஊழியர்களுக்கான தொடர்ச்சியான கற்றல் வாய்ப்புகளின் ஏற்பாடு'
        },
        icon: 'GraduationCap'
      },
      {
        title: { en: 'Welfare & Employee Services', si: 'සුභසාධන සහ සේවක සේවා', ta: 'நலன்புரி & பணியாளர் சேவைகள்' },
        description: {
          en: 'Staff welfare programs including health insurance, medical facilities, recreational activities, counseling services, retirement planning, and employee assistance programs ensuring work-life balance',
          si: 'සෞඛ්‍ය රක්ෂණය, වෛද්‍ය පහසුකම්, විනෝදාත්මක ක්‍රියාකාරකම්, උපදේශන සේවා, විශ්‍රාම සැලසුම් සහ කාර්ය-ජීවිත සමතුලිතතාවය සහතික කරන සේවක සහාය වැඩසටහන් ඇතුළු කාර්ය මණ්ඩල සුභසාධන වැඩසටහන්',
          ta: 'சுகாதார காப்பீடு, மருத்துவ வசதிகள், பொழுதுபோக்கு நடவடிக்கைகள், ஆலோசனை சேவைகள், ஓய்வூதிய திட்டமிடல் மற்றும் பணியாளர் உதவி திட்டங்கள் உட்பட பணியாளர் நலன்புரி திட்டங்கள் வேலை-வாழ்க்கை சமநிலையை உறுதிசெய்கிறது'
        },
        icon: 'Heart'
      },
      {
        title: { en: 'Administrative Coordination', si: 'පරිපාලන සම්බන්ධීකරණය', ta: 'நிர்வாக ஒருங்கிணைப்பு' },
        description: {
          en: 'Coordination of inter-divisional activities, meeting management, official correspondence, document workflow, visitor management, and liaison with government agencies and external stakeholders',
          si: 'අන්තර් අංශ ක්‍රියාකාරකම් සම්බන්ධීකරණය, රැස්වීම් කළමනාකරණය, නිල ලිපි හුවමාරුව, ලේඛන කාර්ය ප්‍රවාහය, අමුත්තන් කළමනාකරණය සහ රජයේ ආයතන සහ බාහිර පාර්ශවකරුවන් සමඟ සම්බන්ධතා',
          ta: 'இடை-பிரிவு நடவடிக்கைகள், கூட்ட மேலாண்மை, அதிகாரப்பூர்வ கடிதப் பரிமாற்றம், ஆவண பணிப்பாய்வு, பார்வையாளர் மேலாண்மை மற்றும் அரசு நிறுவனங்கள் மற்றும் வெளிப்புற பங்குதாரர்களுடன் தொடர்பு ஒருங்கிணைப்பு'
        },
        icon: 'Network'
      }
    ],

    services: [
      {
        title: { en: 'Recruitment & Placement Services', si: 'බඳවා ගැනීම් සහ ස්ථානගත කිරීමේ සේවා', ta: 'ஆட்சேர்ப்பு & வேலைவாய்ப்பு சேவைகள்' },
        description: {
          en: 'End-to-end recruitment support including job posting, candidate screening, interview coordination, background verification, onboarding programs, and placement assistance for scientific, technical, and administrative positions',
          si: 'විද්‍යාත්මක, තාක්ෂණික සහ පරිපාලන තනතුරු සඳහා රැකියා පළ කිරීම, අපේක්ෂක පරීක්ෂණය, සම්මුඛ පරීක්ෂණ සම්බන්ධීකරණය, පසුබිම් සත්‍යාපනය, ආදී වැඩසටහන් සහ ස්ථානගත කිරීමේ සහාය ඇතුළු අවසන සිට අවසන දක්වා බඳවා ගැනීමේ සහාය',
          ta: 'அறிவியல், தொழில்நுட்ப மற்றும் நிர்வாக பதவிகளுக்கான வேலை இடுகை, வேட்பாளர் தேர்வு, நேர்காணல் ஒருங்கிணைப்பு, பின்னணி சரிபார்ப்பு, புதியவர் நுழைவு திட்டங்கள் மற்றும் வேலைவாய்ப்பு உதவி உட்பட முழுமையான ஆட்சேர்ப்பு ஆதரவு'
        },
        icon: 'UserPlus'
      },
      {
        title: { en: 'HR Consultancy & Policy Development', si: 'මානව සම්පත් උපදේශන සහ ප්‍රතිපත්ති සංවර්ධනය', ta: 'மனிதவள ஆலோசனை & கொள்கை மேம்பாடு' },
        description: {
          en: 'Expert guidance on HR best practices, development of personnel policies, employee handbooks, code of conduct, grievance mechanisms, performance appraisal systems, and compliance with labor laws and regulations',
          si: 'මානව සම්පත් හොඳම පිළිවෙත්, පිරිස් ප්‍රතිපත්ති සංවර්ධනය, සේවක අත්පොත්, චර්යා සංග්‍රහය, දුක්ගැනවිලි යාන්ත්‍රණ, කාර්ය සාධන ඇගයීම් පද්ධති සහ කම්කරු නීති සහ රෙගුලාසි අනුකූලතාවය පිළිබඳ ප්‍රවීණ මග පෙන්වීම',
          ta: 'மனிதவள சிறந்த நடைமுறைகள், பணியாளர் கொள்கைகள் மேம்பாடு, பணியாளர் கையேடுகள், நடத்தை நெறிமுறை, குறைதீர்ப்பு பொறிமுறைகள், செயல்திறன் மதிப்பீட்டு அமைப்புகள் மற்றும் தொழிலாளர் சட்டங்கள் மற்றும் விதிமுறைகளுக்கு இணங்குதல் குறித்த நிபுணர் வழிகாட்டுதல்'
        },
        icon: 'FileCheck'
      },
      {
        title: { en: 'Professional Development Programs', si: 'වෘත්තීය සංවර්ධන වැඩසටහන්', ta: 'தொழில்முறை மேம்பாட்டு திட்டங்கள்' },
        description: {
          en: 'Comprehensive training calendar including technical skills workshops, soft skills development, research methodology courses, language training, computer literacy programs, and certification courses for continuous professional growth',
          si: 'තාක්ෂණික කුශලතා වැඩමුළු, මෘදු කුශලතා සංවර්ධනය, පර්යේෂණ ක්‍රමවේද පාඨමාලා, භාෂා පුහුණුව, පරිගණක සාක්ෂරතා වැඩසටහන් සහ අඛණ්ඩ වෘත්තීය වර්ධනය සඳහා සහතික පාඨමාලා ඇතුළු විස්තීර්ණ පුහුණු දින දර්ශනය',
          ta: 'தொழில்நுட்ப திறன் பட்டறைகள், மென்மையான திறன் மேம்பாடு, ஆராய்ச்சி முறையியல் படிப்புகள், மொழி பயிற்சி, கணினி எழுத்தறிவு திட்டங்கள் மற்றும் தொடர்ச்சியான தொழில்முறை வளர்ச்சிக்கான சான்றிதழ் படிப்புகள் உட்பட விரிவான பயிற்சி நாட்காட்டி'
        },
        icon: 'BookOpen'
      },
      {
        title: { en: 'Administrative Support Services', si: 'පරිපාලන සහාය සේවා', ta: 'நிர்வாக ஆதரவு சேவைகள்' },
        description: {
          en: 'Comprehensive office management including mail handling, document management, meeting coordination, travel arrangements, protocol services, facility booking, and general administrative support for all divisions',
          si: 'තැපැල් හැසිරවීම, ලේඛන කළමනාකරණය, රැස්වීම් සම්බන්ධීකරණය, ගමන් කටයුතු, ප්‍රොටෝකෝල් සේවා, පහසුකම් වෙන් කිරීම සහ සියලුම අංශ සඳහා සාමාන්‍ය පරිපාලන සහාය ඇතුළු විස්තීර්ණ කාර්යාල කළමනාකරණය',
          ta: 'அஞ்சல் கையாளுதல், ஆவண மேலாண்மை, கூட்ட ஒருங்கிணைப்பு, பயண ஏற்பாடுகள், நெறிமுறை சேவைகள், வசதி முன்பதிவு மற்றும் அனைத்து பிரிவுகளுக்கும் பொது நிர்வாக ஆதரவு உட்பட விரிவான அலுவலக மேலாண்மை'
        },
        icon: 'Clipboard'
      }
    ],

    contactEmail: 'admin@nara.ac.lk',
    contactPhone: '+94 11 2521011',
    location: 'Administration Division, NARA Headquarters, Crow Island, Colombo 15'
  },

  {
    id: 'finance',
    slug: 'finance-division',
    icon: 'DollarSign',
    color: 'amber',
    gradient: 'from-amber-500 to-yellow-600',
    category: 'supporting',

    name: {
      en: 'Finance Division',
      si: 'මුදල් අංශය',
      ta: 'நிதிப் பிரிவு'
    },

    headOfDivision: {
      name: { en: 'Mr. Pradeep Kumarasinghe', si: 'ප්‍රදීප් කුමාරසිංහ මයා', ta: 'திரு. பிரதீப் குமாரசிங்ஹே' },
      title: { en: 'Deputy Director (Finance)', si: 'නියෝජ්‍ය අධ්‍යක්ෂ (මුදල්)', ta: 'துணை இயக்குநர் (நிதி)' }
    },

    areaOfResponsibility: {
      en: 'Financial Management, Budget Planning & Procurement Services',
      si: 'මූල්‍ය කළමනාකරණය, අයවැය සැලසුම්කරණය සහ ප්‍රසම්පාදන සේවා',
      ta: 'நிதி மேலாண்மை, பட்ஜெட் திட்டமிடல் & கொள்முதல் சேவைகள்'
    },

    tagline: {
      en: 'Strategic financial management and fiscal accountability for sustainable operations',
      si: 'තිරසාර මෙහෙයුම් සඳහා උපායමාර්ගික මූල්‍ය කළමනාකරණය සහ මූල්‍ය වගවීම',
      ta: 'நிலையான செயல்பாடுகளுக்கான மூலோபாய நிதி மேலாண்மை மற்றும் நிதி பொறுப்புணர்வு'
    },

    description: {
      en: 'The Finance Division manages all financial operations including budgeting, accounting, payroll, procurement, grants management, financial reporting, and compliance with government financial regulations ensuring transparency and accountability.',
      si: 'මුදල් අංශය විසින් අයවැය, ගණකාධිකරණය, වැටුප්, ප්‍රසම්පාදන, ප්‍රදාන කළමනාකරණය, මූල්‍ය වාර්තාකරණය සහ රජයේ මූල්‍ය රෙගුලාසිවලට අනුකූල වීම ඇතුළු සියලුම මූල්‍ය මෙහෙයුම් කළමනාකරණය කරමින් විනිවිදභාවය සහ වගවීම සහතික කරයි.',
      ta: 'நிதிப் பிரிவு பட்ஜெட், கணக்கியல், ஊதியம், கொள்முதல், மானியங்கள் மேலாண்மை, நிதி அறிக்கை மற்றும் அரசாங்க நிதி விதிமுறைகளுக்கு இணங்குதல் உட்பட அனைத்து நிதி செயல்பாடுகளையும் நிர்வகிக்கிறது, வெளிப்படைத்தன்மை மற்றும் பொறுப்புணர்வை உறுதிசெய்கிறது.'
    },

    pdfResource: {
      filename: 'NARA-Finance-Division.pdf',
      path: '/pdfs/divisions/NARA-Finance-Division.pdf',
      pages: 8,
      sizeKB: 145,
      description: {
        en: 'Comprehensive guide to financial management systems, budgeting procedures, procurement policies, and fiscal reporting standards',
        si: 'මූල්‍ය කළමනාකරණ පද්ධති, අයවැය ක්‍රියා පටිපාටි, ප්‍රසම්පාදන ප්‍රතිපත්ති සහ මූල්‍ය වාර්තාකරණ ප්‍රමිතීන් සඳහා සවිස්තරාත්මක මාර්ගෝපදේශය',
        ta: 'நிதி மேலாண்மை அமைப்புகள், பட்ஜெட் நடைமுறைகள், கொள்முதல் கொள்கைகள் மற்றும் நிதி அறிக்கை தரநிலைகள் பற்றிய விரிவான வழிகாட்டி'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1554224311-beee2c94c61b?w=1200',

    focusAreas: [
      {
        title: { en: 'Budget Management & Planning', si: 'අයවැය කළමනාකරණය සහ සැලසුම්කරණය', ta: 'பட்ஜெட் மேலாண்மை & திட்டமிடல்' },
        description: {
          en: 'Strategic budget preparation, allocation of resources across divisions, monitoring of expenditures, budget revisions, variance analysis, and long-term financial planning aligned with organizational goals',
          si: 'උපායමාර්ගික අයවැය සැකසීම, අංශ හරහා සම්පත් වෙන් කිරීම, වියදම් නිරීක්ෂණය, අයවැය සංශෝධන, විචලන විශ්ලේෂණය සහ ආයතනික ඉලක්ක සමඟ සමපාත දිගුකාලීන මූල්‍ය සැලසුම්කරණය',
          ta: 'மூலோபாய பட்ஜெட் தயாரிப்பு, பிரிவுகள் முழுவதும் வளங்கள் ஒதுக்கீடு, செலவுகள் கண்காணிப்பு, பட்ஜெட் திருத்தங்கள், மாறுபாடு பகுப்பாய்வு மற்றும் நிறுவன இலக்குகளுடன் இணைந்த நீண்ட கால நிதி திட்டமிடல்'
        },
        icon: 'Calculator'
      },
      {
        title: { en: 'Accounting & Financial Reporting', si: 'ගණකාධිකරණය සහ මූල්‍ය වාර්තාකරණය', ta: 'கணக்கியல் & நிதி அறிக்கை' },
        description: {
          en: 'Maintenance of accounting records, preparation of financial statements, monthly and annual reports, audit coordination, compliance with accounting standards (SLPSAS/IPSAS), and transparent financial disclosure',
          si: 'ගණකාධිකරණ වාර්තා නඩත්තුව, මූල්‍ය ප්‍රකාශන සැකසීම, මාසික සහ වාර්ෂික වාර්තා, විගණන සම්බන්ධීකරණය, ගණකාධිකරණ ප්‍රමිතීන්ට අනුකූල වීම (SLPSAS/IPSAS), සහ විනිවිද පෙනෙන මූල්‍ය අනාවරණය',
          ta: 'கணக்கியல் பதிவுகள் பராமரிப்பு, நிதி அறிக்கைகள் தயாரிப்பு, மாதாந்திர மற்றும் வருடாந்திர அறிக்கைகள், தணிக்கை ஒருங்கிணைப்பு, கணக்கியல் தரநிலைகளுக்கு இணங்குதல் (SLPSAS/IPSAS), மற்றும் வெளிப்படையான நிதி வெளிப்பாடு'
        },
        icon: 'FileSpreadsheet'
      },
      {
        title: { en: 'Procurement & Contract Management', si: 'ප්‍රසම්පාදන සහ ගිවිසුම් කළමනාකරණය', ta: 'கொள்முதல் & ஒப்பந்த மேலாண்மை' },
        description: {
          en: 'Management of procurement processes following government guidelines, tender evaluation, contract negotiations, vendor management, asset procurement for research equipment, laboratory supplies, and operational needs',
          si: 'රජයේ මාර්ගෝපදේශ අනුගමනය කරමින් ප්‍රසම්පාදන ක්‍රියාවලීන් කළමනාකරණය, ටෙන්ඩර් ඇගයීම, ගිවිසුම් සාකච්ඡා, සැපයුම්කරු කළමනාකරණය, පර්යේෂණ උපකරණ, රසායනාගාර සැපයුම් සහ මෙහෙයුම් අවශ්‍යතා සඳහා වත්කම් ප්‍රසම්පාදනය',
          ta: 'அரசாங்க வழிகாட்டுதல்களைப் பின்பற்றி கொள்முதல் செயல்முறைகள் மேலாண்மை, டெண்டர் மதிப்பீடு, ஒப்பந்த பேச்சுவார்த்தைகள், விற்பனையாளர் மேலாண்மை, ஆராய்ச்சி உபகரணங்கள், ஆய்வக பொருட்கள் மற்றும் செயல்பாட்டு தேவைகளுக்கான சொத்து கொள்முதல்'
        },
        icon: 'ShoppingCart'
      },
      {
        title: { en: 'Payroll & Benefits Administration', si: 'වැටුප් සහ ප්‍රතිලාභ පරිපාලනය', ta: 'ஊதியம் & நன்மைகள் நிர்வாகம்' },
        description: {
          en: 'Processing of monthly salaries, allowances, overtime payments, tax deductions, provident fund contributions, pension schemes, travel claims reimbursements, and employee benefit management with accurate and timely disbursements',
          si: 'නිවැරදි සහ කාලෝචිත ව්‍යාප්තිය සමඟ මාසික වැටුප්, දීමනා, අතිකාල ගෙවීම්, බදු අඩු කිරීම්, අර්ථසාධක අරමුදල් දායකත්වය, විශ්‍රාම වැටුප් යෝජනා ක්‍රම, ගමන් හිමිකම් ප්‍රතිපූරණ සහ සේවක ප්‍රතිලාභ කළමනාකරණය සැකසීම',
          ta: 'மாதாந்திர சம்பளங்கள், படிகள், கூடுதல் நேர கொடுப்பனவுகள், வரி விலக்குகள், வருங்கால வைப்பு நிதி பங்களிப்புகள், ஓய்வூதிய திட்டங்கள், பயண உரிமைகோரல் திருப்பிச் செலுத்துதல் மற்றும் பணியாளர் நலன் மேலாண்மை ஆகியவற்றை துல்லியமாகவும் சரியான நேரத்திலும் செயலாக்குதல்'
        },
        icon: 'Wallet'
      },
      {
        title: { en: 'Grants & Project Financial Management', si: 'ප්‍රදාන සහ ව්‍යාපෘති මූල්‍ය කළමනාකරණය', ta: 'மானியங்கள் & திட்ட நிதி மேலாண்மை' },
        description: {
          en: 'Management of research grants from international donors, project-based financial tracking, fund utilization monitoring, donor reporting, compliance with funding conditions, and financial sustainability planning for ongoing research programs',
          si: 'ජාත්‍යන්තර පරිත්‍යාගශීලීන්ගෙන් පර්යේෂණ ප්‍රදාන කළමනාකරණය, ව්‍යාපෘති පදනම් කරගත් මූල්‍ය නිරීක්ෂණය, අරමුදල් භාවිතය අධීක්ෂණය, පරිත්‍යාගශීලී වාර්තාකරණය, අරමුදල් කොන්දේසිවලට අනුකූල වීම, සහ පවතින පර්යේෂණ වැඩසටහන් සඳහා මූල්‍ය තිරසාරභාවය සැලසුම්කරණය',
          ta: 'சர்வதேச நன்கொடையாளர்களிடமிருந்து ஆராய்ச்சி மானியங்கள் மேலாண்மை, திட்ட அடிப்படையிலான நிதி கண்காணிப்பு, நிதி பயன்பாடு கண்காணிப்பு, நன்கொடையாளர் அறிக்கை, நிதி நிபந்தனைகளுக்கு இணங்குதல் மற்றும் நடந்துகொண்டிருக்கும் ஆராய்ச்சி திட்டங்களுக்கான நிதி நிலைத்தன்மை திட்டமிடல்'
        },
        icon: 'Award'
      }
    ],

    services: [
      {
        title: { en: 'Financial Advisory & Planning Services', si: 'මූල්‍ය උපදේශන සහ සැලසුම් සේවා', ta: 'நிதி ஆலோசனை & திட்டமிடல் சேவைகள்' },
        description: {
          en: 'Expert financial guidance for research projects, cost-benefit analysis, investment decisions, funding proposals, financial risk assessment, and strategic financial planning support for all NARA divisions',
          si: 'පර්යේෂණ ව්‍යාපෘති සඳහා ප්‍රවීණ මූල්‍ය මග පෙන්වීම, පිරිවැය-ප්‍රතිලාභ විශ්ලේෂණය, ආයෝජන තීරණ, අරමුදල් යෝජනා, මූල්‍ය අවදානම් තක්සේරුව සහ සියලුම NARA අංශ සඳහා උපායමාර්ගික මූල්‍ය සැලසුම් සහාය',
          ta: 'ஆராய்ச்சி திட்டங்களுக்கான நிபுணர் நிதி வழிகாட்டுதல், செலவு-பயன் பகுப்பாய்வு, முதலீட்டு முடிவுகள், நிதி முன்மொழிவுகள், நிதி ஆபத்து மதிப்பீடு மற்றும் அனைத்து NARA பிரிவுகளுக்கும் மூலோபாய நிதி திட்டமிடல் ஆதரவு'
        },
        icon: 'TrendingUp'
      },
      {
        title: { en: 'Audit Support & Compliance', si: 'විගණන සහාය සහ අනුකූලතාවය', ta: 'தணிக்கை ஆதரவு & இணக்கம்' },
        description: {
          en: 'Coordination with Auditor General Department, internal audit facilitation, preparation of audit responses, implementation of audit recommendations, compliance verification, and maintaining financial accountability standards',
          si: 'විගණකාධිපති දෙපාර්තමේන්තුව සමඟ සම්බන්ධීකරණය, අභ්‍යන්තර විගණන පහසුකම්, විගණන ප්‍රතිචාර සැකසීම, විගණන නිර්දේශ ක්‍රියාත්මක කිරීම, අනුකූලතා සත්‍යාපනය සහ මූල්‍ය වගවීමේ ප්‍රමිතීන් පවත්වා ගැනීම',
          ta: 'தலைமை தணிக்கையாளர் துறையுடன் ஒருங்கிணைப்பு, உள் தணிக்கை வசதி, தணிக்கை பதில்கள் தயாரிப்பு, தணிக்கை பரிந்துரைகள் செயல்படுத்தல், இணக்க சரிபார்ப்பு மற்றும் நிதி பொறுப்புக்கூறல் தரநிலைகளை பராமரித்தல்'
        },
        icon: 'Shield'
      },
      {
        title: { en: 'Vendor & Payment Management', si: 'සැපයුම්කරු සහ ගෙවීම් කළමනාකරණය', ta: 'விற்பனையாளர் & கொடுப்பனவு மேலாண்மை' },
        description: {
          en: 'Efficient payment processing systems, vendor registration and verification, invoice management, payment scheduling, bank reconciliation, and maintaining good vendor relationships with timely settlements',
          si: 'කාර්යක්ෂම ගෙවීම් සැකසුම් පද්ධති, සැපයුම්කරු ලියාපදිංචිය සහ සත්‍යාපනය, ඉන්වොයිසි කළමනාකරණය, ගෙවීම් සටහන්, බැංකු ගැලපීම සහ කාලෝචිත සමථ සමඟ හොඳ සැපයුම්කරු සබඳතා පවත්වා ගැනීම',
          ta: 'திறமையான கொடுப்பனவு செயலாக்க அமைப்புகள், விற்பனையாளர் பதிவு மற்றும் சரிபார்ப்பு, இன்வாய்ஸ் மேலாண்மை, கொடுப்பனவு திட்டமிடல், வங்கி சமரசம் மற்றும் சரியான நேரத்தில் தீர்வுகளுடன் நல்ல விற்பனையாளர் உறவுகளை பராமரித்தல்'
        },
        icon: 'CreditCard'
      },
      {
        title: { en: 'Financial Training & Capacity Building', si: 'මූල්‍ය පුහුණුව සහ ධාරිතා ගොඩනැංවීම', ta: 'நிதி பயிற்சி & திறன் மேம்பாடு' },
        description: {
          en: 'Training programs on financial management, budget preparation, procurement procedures, grant proposal writing, financial reporting standards, and use of financial management software for divisional staff',
          si: 'අංශ කාර්ය මණ්ඩලය සඳහා මූල්‍ය කළමනාකරණය, අයවැය සැකසීම, ප්‍රසම්පාදන ක්‍රියා පටිපාටි, ප්‍රදාන යෝජනා ලිවීම, මූල්‍ය වාර්තාකරණ ප්‍රමිතීන් සහ මූල්‍ය කළමනාකරණ මෘදුකාංග භාවිතය පිළිබඳ පුහුණු වැඩසටහන්',
          ta: 'பிரிவு ஊழியர்களுக்கான நிதி மேலாண்மை, பட்ஜெட் தயாரிப்பு, கொள்முதல் நடைமுறைகள், மானிய முன்மொழிவு எழுதுதல், நிதி அறிக்கை தரநிலைகள் மற்றும் நிதி மேலாண்மை மென்பொருள் பயன்பாடு பற்றிய பயிற்சி திட்டங்கள்'
        },
        icon: 'BookOpen'
      }
    ],

    contactEmail: 'finance@nara.ac.lk',
    contactPhone: '+94 11 2521012',
    location: 'Finance Division, NARA Headquarters, Crow Island, Colombo 15'
  },

  {
    id: 'service-operations',
    slug: 'service-operations-division',
    icon: 'Settings',
    color: 'zinc',
    gradient: 'from-zinc-500 to-slate-600',
    category: 'supporting',

    name: {
      en: 'Service & Operation Division',
      si: 'සේවා හා මෙහෙයුම් අංශය',
      ta: 'சேவை & செயல்பாட்டுப் பிரிவு'
    },

    headOfDivision: {
      name: { en: 'Mr. Sampath Wickramasinghe', si: 'සම්පත් වික්‍රමසිංහ මයා', ta: 'திரு. சம்பத் விக்ரமசிங்ஹே' },
      title: { en: 'Chief Operations Officer', si: 'ප්‍රධාන මෙහෙයුම් නිලධාරී', ta: 'தலைமை செயல்பாட்டு அதிகாரி' }
    },

    areaOfResponsibility: {
      en: 'Facilities Management, Transport Services & Security Operations',
      si: 'පහසුකම් කළමනාකරණය, ප්‍රවාහන සේවා සහ ආරක්ෂණ මෙහෙයුම්',
      ta: 'வசதி மேலாண்மை, போக்குவரத்து சேவைகள் & பாதுகாப்பு செயல்பாடுகள்'
    },

    tagline: {
      en: 'Ensuring operational excellence through infrastructure and facility management',
      si: 'යටිතල පහසුකම් සහ පහසුකම් කළමනාකරණය හරහා මෙහෙයුම් විශිෂ්ටත්වය සහතික කිරීම',
      ta: 'உள்கட்டமைப்பு மற்றும் வசதி மேலாண்மை மூலம் செயல்பாட்டு சிறப்பை உறுதிசெய்தல்'
    },

    description: {
      en: 'The Service & Operation Division manages all infrastructure, facilities, maintenance, transport, security, utilities, laboratory support services, and operational logistics ensuring smooth functioning of research and administrative activities across all NARA locations.',
      si: 'සේවා හා මෙහෙයුම් අංශය සියලුම යටිතල පහසුකම්, පහසුකම්, නඩත්තුව, ප්‍රවාහනය, ආරක්ෂාව, උපයෝගිතා, රසායනාගාර සහාය සේවා සහ මෙහෙයුම් ලොජිස්ටික් කළමනාකරණය කරමින් සියලුම NARA ස්ථානවල පර්යේෂණ සහ පරිපාලන ක්‍රියාකාරකම්වල සුමට ක්‍රියාකාරිත්වය සහතික කරයි.',
      ta: 'சேவை & செயல்பாட்டுப் பிரிவு அனைத்து உள்கட்டமைப்பு, வசதிகள், பராமரிப்பு, போக்குவரத்து, பாதுகாப்பு, பயன்பாடுகள், ஆய்வக ஆதரவு சேவைகள் மற்றும் செயல்பாட்டு தளவாடங்களை நிர்வகிக்கிறது, அனைத்து NARA இடங்களிலும் ஆராய்ச்சி மற்றும் நிர்வாக நடவடிக்கைகளின் சுமூகமான செயல்பாட்டை உறுதிசெய்கிறது.'
    },

    pdfResource: {
      filename: 'NARA-Service-Operations-Division.pdf',
      path: '/pdfs/divisions/NARA-Service-Operations-Division.pdf',
      pages: 9,
      sizeKB: 167,
      description: {
        en: 'Complete overview of facility management, maintenance protocols, transport services, security systems, and operational support services',
        si: 'පහසුකම් කළමනාකරණය, නඩත්තු ප්‍රොටෝකෝල, ප්‍රවාහන සේවා, ආරක්ෂණ පද්ධති සහ මෙහෙයුම් සහාය සේවා පිළිබඳ සම්පූර්ණ දළ විශ්ලේෂණය',
        ta: 'வசதி மேலாண்மை, பராமரிப்பு நெறிமுறைகள், போக்குவரத்து சேவைகள், பாதுகாப்பு அமைப்புகள் மற்றும் செயல்பாட்டு ஆதரவு சேவைகள் பற்றிய முழுமையான கண்ணோட்டம்'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200',

    focusAreas: [
      {
        title: { en: 'Infrastructure & Facilities Management', si: 'යටිතල පහසුකම් සහ පහසුකම් කළමනාකරණය', ta: 'உள்கட்டமைப்பு & வசதி மேலாண்மை' },
        description: {
          en: 'Comprehensive management of buildings, laboratories, research vessels, field stations, office spaces, water supply, power systems, HVAC, plumbing, electrical systems, and infrastructure development planning',
          si: 'ගොඩනැගිලි, රසායනාගාර, පර්යේෂණ නැව්, ක්ෂේත්‍ර මධ්‍යස්ථාන, කාර්යාල අවකාශ, ජල සැපයුම, බල පද්ධති, HVAC, ජලනල, විදුලි පද්ධති සහ යටිතල පහසුකම් සංවර්ධන සැලසුම්කරණ විස්තීර්ණ කළමනාකරණය',
          ta: 'கட்டிடங்கள், ஆய்வகங்கள், ஆராய்ச்சி கப்பல்கள், கள நிலையங்கள், அலுவலக இடங்கள், நீர் வழங்கல், மின்சார அமைப்புகள், HVAC, குழாய், மின்சார அமைப்புகள் மற்றும் உள்கட்டமைப்பு மேம்பாட்டு திட்டமிடல் ஆகியவற்றின் விரிவான மேலாண்மை'
        },
        icon: 'Building'
      },
      {
        title: { en: 'Maintenance & Engineering Services', si: 'නඩත්තු සහ ඉංජිනේරු සේවා', ta: 'பராமரிப்பு & பொறியியல் சேவைகள்' },
        description: {
          en: 'Preventive and corrective maintenance of research equipment, laboratory instruments, scientific apparatus, marine vessels, vehicles, generators, air conditioning systems, and calibration services',
          si: 'පර්යේෂණ උපකරණ, රසායනාගාර උපකරණ, විද්‍යාත්මක උපකරණ, සමුද්‍ර යාත්‍රා, වාහන, ජනක යන්ත්‍ර, වායු සමීකරණ පද්ධති සහ ක්‍රමාංකන සේවා වැළැක්වීමේ සහ නිවැරදි කිරීමේ නඩත්තුව',
          ta: 'ஆராய்ச்சி உபகரணங்கள், ஆய்வக கருவிகள், அறிவியல் கருவிகள், கடல் கப்பல்கள், வாகனங்கள், மின் உற்பத்தி இயந்திரங்கள், குளிரூட்டி அமைப்புகள் மற்றும் அளவுத்திருத்த சேவைகளின் தடுப்பு மற்றும் சரிசெய்தல் பராமரிப்பு'
        },
        icon: 'Wrench'
      },
      {
        title: { en: 'Transport & Logistics', si: 'ප්‍රවාහනය සහ ලොජිස්ටික්', ta: 'போக்குவரத்து & தளவாடங்கள்' },
        description: {
          en: 'Management of vehicle fleet, driver deployment, fuel management, vehicle maintenance scheduling, research vessel operations, field trip coordination, sample transportation, and equipment logistics',
          si: 'වාහන සමූහය කළමනාකරණය, රියදුරු යෙදවීම, ඉන්ධන කළමනාකරණය, වාහන නඩත්තු කාලසටහන්, පර්යේෂණ යාත්‍රා මෙහෙයුම්, ක්ෂේත්‍ර ගමන් සම්බන්ධීකරණය, නියැදි ප්‍රවාහනය සහ උපකරණ ලොජිස්ටික්',
          ta: 'வாகன அணி மேலாண்மை, ஓட்டுநர் பணியமர்த்தல், எரிபொருள் மேலாண்மை, வாகன பராமரிப்பு திட்டமிடல், ஆராய்ச்சி கப்பல் செயல்பாடுகள், கள பயண ஒருங்கிணைப்பு, மாதிரி போக்குவரத்து மற்றும் உபகரண தளவாடங்கள்'
        },
        icon: 'Truck'
      },
      {
        title: { en: 'Security & Safety Management', si: 'ආරක්ෂණ සහ ආරක්ෂිත කළමනාකරණය', ta: 'பாதுகாப்பு & பாதுகாப்பு மேலாண்மை' },
        description: {
          en: '24/7 security services, access control systems, CCTV surveillance, fire safety systems, emergency preparedness, laboratory safety protocols, occupational health and safety compliance, and disaster management planning',
          si: '24/7 ආරක්ෂණ සේවා, ප්‍රවේශ පාලන පද්ධති, CCTV අධීක්ෂණය, ගිනි ආරක්ෂණ පද්ධති, හදිසි සූදානම, රසායනාගාර ආරක්ෂණ ප්‍රොටෝකෝල, වෘත්තීය සෞඛ්‍ය හා ආරක්ෂණ අනුකූලතාවය සහ ආපදා කළමනාකරණ සැලසුම්කරණය',
          ta: '24/7 பாதுகாப்பு சேவைகள், அணுகல் கட்டுப்பாடு அமைப்புகள், CCTV கண்காணிப்பு, தீ பாதுகாப்பு அமைப்புகள், அவசர தயார்நிலை, ஆய்வக பாதுகாப்பு நெறிமுறைகள், தொழில்சார் சுகாதாரம் மற்றும் பாதுகாப்பு இணக்கம் மற்றும் பேரிடர் மேலாண்மை திட்டமிடல்'
        },
        icon: 'Shield'
      },
      {
        title: { en: 'Laboratory Support & Supplies', si: 'රසායනාගාර සහාය සහ සැපයුම්', ta: 'ஆய்வக ஆதரவு & பொருட்கள்' },
        description: {
          en: 'Procurement and management of laboratory consumables, chemicals, reagents, glassware, sample storage facilities, liquid nitrogen supply, gas cylinders, autoclave services, and waste disposal management',
          si: 'රසායනාගාර පරිභෝජ්‍ය ද්‍රව්‍ය, රසායනික ද්‍රව්‍ය, ප්‍රතික්‍රියාකාරක, වීදුරු භාණ්ඩ, නියැදි ගබඩා පහසුකම්, ද්‍රව නයිට්‍රජන් සැපයුම, ගෑස් සිලින්ඩර, ඔටෝක්ලේව් සේවා සහ අපද්‍රව්‍ය බැහැර කිරීමේ කළමනාකරණ ප්‍රසම්පාදනය සහ කළමනාකරණය',
          ta: 'ஆய்வக நுகர்பொருட்கள், இரசாயனங்கள், வினைப்பொருட்கள், கண்ணாடிப் பொருட்கள், மாதிரி சேமிப்பு வசதிகள், திரவ நைட்ரஜன் வழங்கல், எரிவாயு சிலிண்டர்கள், ஆட்டோக்ளேவ் சேவைகள் மற்றும் கழிவு அகற்றல் மேலாண்மை கொள்முதல் மற்றும் மேலாண்மை'
        },
        icon: 'Beaker'
      }
    ],

    services: [
      {
        title: { en: 'Facility Booking & Space Management', si: 'පහසුකම් වෙන්කිරීම් සහ අවකාශ කළමනාකරණය', ta: 'வசதி முன்பதிவு & இட மேலாண்மை' },
        description: {
          en: 'Conference room reservations, laboratory space allocation, field station bookings, meeting room scheduling, equipment booking systems, and optimized utilization of available facilities',
          si: 'සම්මන්ත්‍රණ කාමර වෙන්කිරීම්, රසායනාගාර අවකාශ වෙන්කිරීම්, ක්ෂේත්‍ර මධ්‍යස්ථාන වෙන්කිරීම්, රැස්වීම් කාමර කාලසටහන්, උපකරණ වෙන්කිරීමේ පද්ධති සහ පවතින පහසුකම්වල ප්‍රශස්ත භාවිතය',
          ta: 'மாநாட்டு அறை முன்பதிவுகள், ஆய்வக இட ஒதுக்கீடு, கள நிலைய முன்பதிவுகள், கூட்ட அறை திட்டமிடல், உபகரணங்கள் முன்பதிவு அமைப்புகள் மற்றும் கிடைக்கக்கூடிய வசதிகளின் உகந்த பயன்பாடு'
        },
        icon: 'Calendar'
      },
      {
        title: { en: 'Maintenance & Repair Services', si: 'නඩත්තු සහ අළුත්වැඩියා සේවා', ta: 'பராமரிப்பு & பழுதுபார்ப்பு சேவைகள்' },
        description: {
          en: 'Scheduled and emergency maintenance services, equipment repair and calibration, electrical work, plumbing services, carpentry, painting, air conditioning repairs, and general facility upkeep',
          si: 'කාලසටහන්ගත සහ හදිසි නඩත්තු සේවා, උපකරණ අළුත්වැඩියා සහ ක්‍රමාංකනය, විදුලි කාර්යය, ජලනල සේවා, වඩු කාර්මික, පින්තාරු කිරීම, වායු සමීකරණ අළුත්වැඩියා සහ සාමාන්‍ය පහසුකම් නඩත්තුව',
          ta: 'திட்டமிடப்பட்ட மற்றும் அவசர பராமரிப்பு சேவைகள், உபகரண பழுதுபார்ப்பு மற்றும் அளவுத்திருத்தம், மின்சார வேலை, குழாய் சேவைகள், தச்சு வேலை, ஓவியம், குளிரூட்டி பழுதுபார்ப்புகள் மற்றும் பொது வசதி பராமரிப்பு'
        },
        icon: 'Tool'
      },
      {
        title: { en: 'Transportation Services', si: 'ප්‍රවාහන සේවා', ta: 'போக்குவரத்து சேவைகள்' },
        description: {
          en: 'Official transport for staff, research field trips, sample collection missions, conference travel, equipment transportation, emergency vehicle services, and coordination with external transport providers',
          si: 'කාර්ය මණ්ඩලය සඳහා නිල ප්‍රවාහනය, පර්යේෂණ ක්ෂේත්‍ර ගමන්, නියැදි එකතු කිරීමේ මෙහෙයුම්, සම්මන්ත්‍රණ ගමන්, උපකරණ ප්‍රවාහනය, හදිසි වාහන සේවා සහ බාහිර ප්‍රවාහන සපයන්නන් සමඟ සම්බන්ධීකරණය',
          ta: 'ஊழியர்களுக்கான அதிகாரப்பூர்வ போக்குவரத்து, ஆராய்ச்சி கள பயணங்கள், மாதிரி சேகரிப்பு பணிகள், மாநாட்டு பயணம், உபகரண போக்குவரத்து, அவசர வாகன சேவைகள் மற்றும் வெளி போக்குவரத்து வழங்குநர்களுடன் ஒருங்கிணைப்பு'
        },
        icon: 'Car'
      },
      {
        title: { en: 'Waste Management & Environmental Compliance', si: 'අපද්‍රව්‍ය කළමනාකරණය සහ පාරිසරික අනුකූලතාවය', ta: 'கழிவு மேலாண்மை & சுற்றுச்சூழல் இணக்கம்' },
        description: {
          en: 'Laboratory waste disposal following environmental regulations, hazardous material handling, chemical waste treatment, bio-medical waste management, recycling programs, and environmental compliance monitoring',
          si: 'පාරිසරික රෙගුලාසි අනුගමනය කරමින් රසායනාගාර අපද්‍රව්‍ය බැහැර කිරීම, අනතුරුදායක ද්‍රව්‍ය හැසිරවීම, රසායනික අපද්‍රව්‍ය පිරිපහදුව, ජෛව-වෛද්‍ය අපද්‍රව්‍ය කළමනාකරණය, ප්‍රතිචක්‍රීකරණ වැඩසටහන් සහ පාරිසරික අනුකූලතා අධීක්ෂණය',
          ta: 'சுற்றுச்சூழல் விதிமுறைகளைப் பின்பற்றி ஆய்வக கழிவு அகற்றல், ஆபத்தான பொருள் கையாளுதல், இரசாயன கழிவு சுத்திகரிப்பு, உயிரியல்-மருத்துவ கழிவு மேலாண்மை, மறுசுழற்சி திட்டங்கள் மற்றும் சுற்றுச்சூழல் இணக்க கண்காணிப்பு'
        },
        icon: 'Recycle'
      }
    ],

    contactEmail: 'operations@nara.ac.lk',
    contactPhone: '+94 11 2521013',
    location: 'Service & Operations Division, NARA Headquarters, Crow Island, Colombo 15'
  },

  {
    id: 'internal-audit',
    slug: 'internal-audit-division',
    icon: 'Search',
    color: 'rose',
    gradient: 'from-rose-500 to-red-600',
    category: 'supporting',

    name: {
      en: 'Internal Audit Division',
      si: 'අභ්‍යන්තර විගණන අංශය',
      ta: 'உள் தணிக்கைப் பிரிவு'
    },

    headOfDivision: {
      name: { en: 'Mrs. Kumudini Jayawardena', si: 'කුමුදිනී ජයවර්ධන මිය', ta: 'திருமதி. குமுதினி ஜயவர்தனா' },
      title: { en: 'Chief Internal Auditor', si: 'ප්‍රධාන අභ්‍යන්තර විගණක', ta: 'தலைமை உள் தணிக்கையாளர்' }
    },

    areaOfResponsibility: {
      en: 'Financial Audit, Risk Assessment & Compliance Verification',
      si: 'මූල්‍ය විගණන, අවදානම් තක්සේරුව සහ අනුකූලතා සත්‍යාපනය',
      ta: 'நிதி தணிக்கை, ஆபத்து மதிப்பீடு & இணக்க சரிபார்ப்பு'
    },

    tagline: {
      en: 'Independent assurance and advisory services for governance and accountability',
      si: 'පාලනය සහ වගවීම සඳහා ස්වාධීන සහතික සහ උපදේශන සේවා',
      ta: 'நிர்வாகம் மற்றும் பொறுப்புணர்வுக்கான சுயாதீன உத்தரவாதம் மற்றும் ஆலோசனை சேவைகள்'
    },

    description: {
      en: 'The Internal Audit Division provides independent, objective assurance and consulting services designed to add value and improve NARA operations through systematic evaluation of risk management, control, and governance processes.',
      si: 'අභ්‍යන්තර විගණන අංශය අවදානම් කළමනාකරණය, පාලනය සහ පාලන ක්‍රියාවලීන් ක්‍රමානුකූල ඇගයීම හරහා NARA මෙහෙයුම්වලට වටිනාකමක් එකතු කිරීමට සහ වැඩිදියුණු කිරීමට නිර්මාණය කර ඇති ස්වාධීන, වස්තුනිෂ්ඨ සහතික සහ උපදේශන සේවා සපයයි.',
      ta: 'உள் தணிக்கைப் பிரிவு, ஆபத்து மேலாண்மை, கட்டுப்பாடு மற்றும் நிர்வாக செயல்முறைகளின் முறையான மதிப்பீடு மூலம் NARA செயல்பாடுகளுக்கு மதிப்பு சேர்க்கவும் மேம்படுத்தவும் வடிவமைக்கப்பட்ட சுயாதீன, நோக்கமான உத்தரவாதம் மற்றும் ஆலோசனை சேவைகளை வழங்குகிறது.'
    },

    pdfResource: {
      filename: 'NARA-Internal-Audit-Division.pdf',
      path: '/pdfs/divisions/NARA-Internal-Audit-Division.pdf',
      pages: 10,
      sizeKB: 189,
      description: {
        en: 'Comprehensive guide to audit methodologies, risk assessment frameworks, compliance verification procedures, and governance evaluation systems',
        si: 'විගණන ක්‍රමවේද, අවදානම් තක්සේරු රාමු, අනුකූලතා සත්‍යාපන ක්‍රියා පටිපාටි සහ පාලන ඇගයීම් පද්ධති සඳහා සවිස්තරාත්මක මාර්ගෝපදේශය',
        ta: 'தணிக்கை முறைகள், ஆபத்து மதிப்பீட்டு கட்டமைப்புகள், இணக்க சரிபார்ப்பு நடைமுறைகள் மற்றும் நிர்வாக மதிப்பீட்டு அமைப்புகள் பற்றிய விரிவான வழிகாட்டி'
      }
    },

    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',

    focusAreas: [
      {
        title: { en: 'Financial Audit & Compliance', si: 'මූල්‍ය විගණන සහ අනුකූලතාවය', ta: 'நிதி தணிக்கை & இணக்கம்' },
        description: {
          en: 'Independent examination of financial records, transactions, budgets, expenditure controls, revenue management, asset verification, compliance with financial regulations, treasury guidelines, and procurement procedures',
          si: 'මූල්‍ය වාර්තා, ගනුදෙනු, අයවැය, වියදම් පාලන, ආදායම් කළමනාකරණය, වත්කම් සත්‍යාපනය, මූල්‍ය රෙගුලාසිවලට අනුකූල වීම, භාණ්ඩාගාර මාර්ගෝපදේශ සහ ප්‍රසම්පාදන ක්‍රියා පටිපාටි ස්වාධීන පරීක්ෂණය',
          ta: 'நிதி பதிவுகள், பரிவர்த்தனைகள், பட்ஜெட்கள், செலவு கட்டுப்பாடுகள், வருவாய் மேலாண்மை, சொத்து சரிபார்ப்பு, நிதி விதிமுறைகளுக்கு இணக்கம், கருவூல வழிகாட்டுதல்கள் மற்றும் கொள்முதல் நடைமுறைகள் ஆகியவற்றின் சுயாதீன பரிசோதனை'
        },
        icon: 'DollarSign'
      },
      {
        title: { en: 'Operational Audit & Process Review', si: 'මෙහෙයුම් විගණන සහ ක්‍රියාවලි සමාලෝචනය', ta: 'செயல்பாட்டு தணிக்கை & செயல்முறை மதிப்பாய்வு' },
        description: {
          en: 'Systematic review of operational efficiency, effectiveness of internal controls, process optimization, workflow analysis, divisional performance evaluation, resource utilization assessment, and identification of improvement opportunities',
          si: 'මෙහෙයුම් කාර්යක්ෂමතාව, අභ්‍යන්තර පාලනවල සඵලතාවය, ක්‍රියාවලි ප්‍රශස්තකරණය, කාර්ය ප්‍රවාහ විශ්ලේෂණය, අංශ කාර්ය සාධන ඇගයීම, සම්පත් උපයෝජන තක්සේරුව සහ වැඩිදියුණු කිරීමේ අවස්ථා හඳුනා ගැනීම ක්‍රමානුකූල සමාලෝචනය',
          ta: 'செயல்பாட்டு திறன், உள் கட்டுப்பாடுகளின் செயல்திறன், செயல்முறை மேம்படுத்தல், பணிப்பாய்வு பகுப்பாய்வு, பிரிவு செயல்திறன் மதிப்பீடு, வள பயன்பாட்டு மதிப்பீடு மற்றும் மேம்பாட்டு வாய்ப்புகளை அடையாளம் காணும் முறையான மதிப்பாய்வு'
        },
        icon: 'Activity'
      },
      {
        title: { en: 'Risk Assessment & Management', si: 'අවදානම් තක්සේරුව සහ කළමනාකරණය', ta: 'ஆபத்து மதிப்பீடு & மேலாண்மை' },
        description: {
          en: 'Identification and evaluation of organizational risks, fraud risk assessment, cybersecurity vulnerabilities, research data integrity risks, operational risks, financial risks, and development of mitigation strategies',
          si: 'ආයතනික අවදානම් හඳුනා ගැනීම සහ ඇගයීම, වංචා අවදානම් තක්සේරුව, සයිබර් ආරක්ෂණ දුර්වලතා, පර්යේෂණ දත්ත අඛණ්ඩතා අවදානම්, මෙහෙයුම් අවදානම්, මූල්‍ය අවදානම් සහ අවම කිරීමේ උපාය මාර්ග සංවර්ධනය',
          ta: 'நிறுவன ஆபத்துகளை அடையாளம் காணுதல் மற்றும் மதிப்பீடு, மோசடி ஆபத்து மதிப்பீடு, இணைய பாதுகாப்பு பாதிப்புகள், ஆராய்ச்சி தரவு நேர்மை ஆபத்துகள், செயல்பாட்டு ஆபத்துகள், நிதி ஆபத்துகள் மற்றும் தணிப்பு உத்திகளை உருவாக்குதல்'
        },
        icon: 'AlertTriangle'
      },
      {
        title: { en: 'Compliance Verification & Regulatory Review', si: 'අනුකූලතා සත්‍යාපනය සහ නියාමන සමාලෝචනය', ta: 'இணக்க சரிபார்ப்பு & ஒழுங்குமுறை மதிப்பாய்வு' },
        description: {
          en: 'Verification of compliance with government regulations, institutional policies, ISO standards, environmental regulations, safety protocols, labor laws, research ethics guidelines, and grant conditions',
          si: 'රජයේ රෙගුලාසි, ආයතනික ප්‍රතිපත්ති, ISO ප්‍රමිතීන්, පාරිසරික රෙගුලාසි, ආරක්ෂණ ප්‍රොටෝකෝල, කම්කරු නීති, පර්යේෂණ ආචාරධර්ම මාර්ගෝපදේශ සහ ප්‍රදාන කොන්දේසි අනුකූලතාව සත්‍යාපනය',
          ta: 'அரசாங்க விதிமுறைகள், நிறுவன கொள்கைகள், ISO தரநிலைகள், சுற்றுச்சூழல் விதிமுறைகள், பாதுகாப்பு நெறிமுறைகள், தொழிலாளர் சட்டங்கள், ஆராய்ச்சி நெறிமுறை வழிகாட்டுதல்கள் மற்றும் மானிய நிபந்தனைகளுக்கு இணங்குவதை சரிபார்த்தல்'
        },
        icon: 'CheckCircle'
      },
      {
        title: { en: 'Governance & Accountability Review', si: 'පාලන සහ වගවීමේ සමාලෝචනය', ta: 'நிர்வாகம் & பொறுப்புணர்வு மதிப்பாய்வு' },
        description: {
          en: 'Evaluation of governance structures, board effectiveness, decision-making processes, transparency mechanisms, accountability systems, conflict of interest policies, ethical conduct, and institutional integrity',
          si: 'පාලන ව්‍යුහ, මණ්ඩල සඵලතාවය, තීරණ ගැනීමේ ක්‍රියාවලීන්, විනිවිදභාවය යාන්ත්‍රණ, වගවීමේ පද්ධති, අවාසි ගැටුම් ප්‍රතිපත්ති, සදාචාරාත්මක හැසිරීම සහ ආයතනික අඛණ්ඩතාව ඇගයීම',
          ta: 'நிர்வாக கட்டமைப்புகள், வாரிய செயல்திறன், முடிவெடுக்கும் செயல்முறைகள், வெளிப்படைத்தன்மை பொறிமுறைகள், பொறுப்புணர்வு அமைப்புகள், பலன்களின் மோதல் கொள்கைகள், நெறிமுறை நடத்தை மற்றும் நிறுவன நேர்மை மதிப்பீடு'
        },
        icon: 'Shield'
      }
    ],

    services: [
      {
        title: { en: 'Annual Audit Planning & Execution', si: 'වාර්ෂික විගණන සැලසුම් සහ ක්‍රියාත්මක කිරීම', ta: 'வருடாந்திர தணிக்கை திட்டமிடல் & செயல்படுத்தல்' },
        description: {
          en: 'Risk-based annual audit plans, scheduled audits of all divisions, surprise inspections, special investigations, follow-up audits, and comprehensive audit reporting with actionable recommendations',
          si: 'අවදානම් පදනම් කරගත් වාර්ෂික විගණන සැලසුම්, සියලුම අංශවල කාලසටහන්ගත විගණන, පුදුම පරීක්ෂණ, විශේෂ විමර්ශන, පසු විපරම් විගණන සහ ක්‍රියාත්මක නිර්දේශ සමඟ විස්තීර්ණ විගණන වාර්තාකරණය',
          ta: 'ஆபத்து அடிப்படையிலான வருடாந்திர தணிக்கை திட்டங்கள், அனைத்து பிரிவுகளின் திட்டமிடப்பட்ட தணிக்கைகள், திடீர் ஆய்வுகள், சிறப்பு விசாரணைகள், தொடர் தணிக்கைகள் மற்றும் செயல்படுத்தக்கூடிய பரிந்துரைகளுடன் விரிவான தணிக்கை அறிக்கை'
        },
        icon: 'FileText'
      },
      {
        title: { en: 'Internal Control Assessment Services', si: 'අභ්‍යන්තර පාලන තක්සේරු සේවා', ta: 'உள் கட்டுப்பாடு மதிப்பீட்டு சேவைகள்' },
        description: {
          en: 'Evaluation of adequacy and effectiveness of internal controls, segregation of duties review, authorization controls, physical safeguards, IT controls, data security measures, and control environment assessment',
          si: 'අභ්‍යන්තර පාලනවල ප්‍රමාණවත් බව සහ සඵලතාවය ඇගයීම, රාජකාරි වෙන් කිරීමේ සමාලෝචනය, අවසර පාලන, භෞතික ආරක්ෂණ, තොරතුරු තාක්ෂණ පාලන, දත්ත ආරක්ෂණ පියවර සහ පාලන පරිසර තක්සේරුව',
          ta: 'உள் கட்டுப்பாடுகளின் போதுமை மற்றும் செயல்திறன் மதிப்பீடு, கடமைகள் பிரித்தல் மதிப்பாய்வு, அங்கீகார கட்டுப்பாடுகள், உடல் பாதுகாப்புகள், IT கட்டுப்பாடுகள், தரவு பாதுகாப்பு நடவடிக்கைகள் மற்றும் கட்டுப்பாடு சூழல் மதிப்பீடு'
        },
        icon: 'Lock'
      },
      {
        title: { en: 'Fraud Detection & Investigation Support', si: 'වංචා අනාවරණය සහ විමර්ශන සහාය', ta: 'மோசடி கண்டறிதல் & விசாரணை ஆதரவு' },
        description: {
          en: 'Proactive fraud detection mechanisms, investigation of suspected irregularities, forensic accounting services, whistleblower complaint handling, anti-corruption initiatives, and ethical conduct monitoring',
          si: 'ක්‍රියාශීලී වංචා අනාවරණ යාන්ත්‍රණ, සැක සහිත අක්‍රමිකතා විමර්ශනය, අධිකරණ ගණකාධිකරණ සේවා, විස්ල්බ්ලෝවර් පැමිණිලි හැසිරවීම, දූෂණ විරෝධී මුලපිරීම් සහ සදාචාරාත්මක හැසිරීම් අධීක්ෂණය',
          ta: 'செயலூக்கமான மோசடி கண்டறிதல் பொறிமுறைகள், சந்தேகத்திற்குரிய முறைகேடுகளை விசாரணை, தடயவியல் கணக்கியல் சேவைகள், விசில்ப்ளோயர் புகார் கையாளுதல், ஊழல் எதிர்ப்பு முயற்சிகள் மற்றும் நெறிமுறை நடத்தை கண்காணிப்பு'
        },
        icon: 'Eye'
      },
      {
        title: { en: 'Advisory & Consulting Services', si: 'උපදේශන සහ උපදේශක සේවා', ta: 'ஆலோசனை & ஆலோசனை சேவைகள்' },
        description: {
          en: 'Guidance on internal control design, risk management frameworks, policy development, process improvement, compliance requirements, governance best practices, and implementation of audit recommendations',
          si: 'අභ්‍යන්තර පාලන සැලසුම, අවදානම් කළමනාකරණ රාමු, ප්‍රතිපත්ති සංවර්ධනය, ක්‍රියාවලි වැඩිදියුණු කිරීම, අනුකූලතා අවශ්‍යතා, පාලන හොඳම පිළිවෙත් සහ විගණන නිර්දේශ ක්‍රියාත්මක කිරීම පිළිබඳ මග පෙන්වීම',
          ta: 'உள் கட்டுப்பாடு வடிவமைப்பு, ஆபத்து மேலாண்மை கட்டமைப்புகள், கொள்கை மேம்பாடு, செயல்முறை மேம்பாடு, இணக்க தேவைகள், நிர்வாக சிறந்த நடைமுறைகள் மற்றும் தணிக்கை பரிந்துரைகளை செயல்படுத்துதல் குறித்த வழிகாட்டுதல்'
        },
        icon: 'Users'
      }
    ],

    contactEmail: 'internalaudit@nara.ac.lk',
    contactPhone: '+94 11 2521014',
    location: 'Internal Audit Division, NARA Headquarters, Crow Island, Colombo 15'
  },

  // ============================================================
  // TECHNOLOGY TRANSFER DIVISION (NEW - Research)
  // ============================================================
  {
    id: 'technology-transfer',
    slug: 'technology-transfer-division',
    icon: 'Share2',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    category: 'research',

    name: {
      en: 'Technology Transfer Division (TTD)',
      si: 'Technology Transfer Division (TTD)',
      ta: 'Technology Transfer Division (TTD)'
    },

    headOfDivision: {
      name: { en: 'To be announced', si: 'To be announced', ta: 'To be announced' },
      title: { en: 'Division Head', si: 'Division Head', ta: 'Division Head' }
    },

    areaOfResponsibility: {
      en: 'Dissemination of Scientific Information & Technologies to Stakeholders',
      si: 'Dissemination of Scientific Information & Technologies to Stakeholders',
      ta: 'Dissemination of Scientific Information & Technologies to Stakeholders'
    },

    tagline: {
      en: 'Taking research from the lab to the industry',
      si: 'Taking research from the lab to the industry',
      ta: 'Taking research from the lab to the industry'
    },

    description: {
      en: 'The Technology Transfer Division focuses on dissemination of scientific information and technologies to stakeholders including SMEs, students, and industries. It conducts training and extension programs, provides technical assistance for starting or upgrading small and medium enterprises, and prepares feasibility studies for entrepreneurs seeking funding.',
      si: 'The Technology Transfer Division focuses on dissemination of scientific information and technologies to stakeholders including SMEs, students, and industries.',
      ta: 'The Technology Transfer Division focuses on dissemination of scientific information and technologies to stakeholders including SMEs, students, and industries.'
    },

    heroImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200',

    focusAreas: [
      {
        title: { en: 'Training & Extension Programs', si: 'Training & Extension Programs', ta: 'Training & Extension Programs' },
        description: { en: 'Conducting programs to help stakeholders adopt new technologies developed by NARA research divisions', si: 'Conducting programs to help stakeholders adopt new technologies', ta: 'Conducting programs to help stakeholders adopt new technologies' },
        icon: 'GraduationCap'
      },
      {
        title: { en: 'SME Technical Support', si: 'SME Technical Support', ta: 'SME Technical Support' },
        description: { en: 'Providing technical assistance for starting or upgrading small and medium enterprises in the aquatic sector', si: 'Providing technical assistance for SMEs', ta: 'Providing technical assistance for SMEs' },
        icon: 'Briefcase'
      },
      {
        title: { en: 'Feasibility Studies', si: 'Feasibility Studies', ta: 'Feasibility Studies' },
        description: { en: 'Preparing feasibility reports for entrepreneurs seeking funding for aquatic resource-based businesses', si: 'Preparing feasibility reports for entrepreneurs', ta: 'Preparing feasibility reports for entrepreneurs' },
        icon: 'FileText'
      }
    ],

    services: [
      {
        title: { en: 'Technology Dissemination', si: 'Technology Dissemination', ta: 'Technology Dissemination' },
        description: { en: 'Dissemination of scientific information and technologies to stakeholders in the fisheries and aquaculture sectors', si: 'Dissemination of scientific information', ta: 'Dissemination of scientific information' },
        icon: 'Share2'
      },
      {
        title: { en: 'Entrepreneur Support Services', si: 'Entrepreneur Support Services', ta: 'Entrepreneur Support Services' },
        description: { en: 'Comprehensive support for entrepreneurs including technical guidance, feasibility analysis, and business development assistance', si: 'Comprehensive support for entrepreneurs', ta: 'Comprehensive support for entrepreneurs' },
        icon: 'TrendingUp'
      }
    ],

    contactEmail: 'ttd@nara.ac.lk',
    contactPhone: '+94 11 2521000',
    location: 'Technology Transfer Division, NARA Headquarters, Crow Island, Colombo 15'
  },

  // ============================================================
  // REGIONAL RESEARCH CENTERS (5 NEW - Regional)
  // ============================================================
  {
    id: 'regional-kadolkele',
    slug: 'regional-research-center-kadolkele',
    icon: 'MapPin',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    category: 'regional',

    name: {
      en: 'Regional Research Center – Kadolkele (Negombo)',
      si: 'Regional Research Center – Kadolkele (Negombo)',
      ta: 'Regional Research Center – Kadolkele (Negombo)'
    },

    headOfDivision: {
      name: { en: 'To be announced', si: 'To be announced', ta: 'To be announced' },
      title: { en: 'Center Director', si: 'Center Director', ta: 'Center Director' }
    },

    areaOfResponsibility: {
      en: 'Mangrove Conservation, Coastal Aquaculture Advisory & Eco-Tourism Development',
      si: 'Mangrove Conservation, Coastal Aquaculture Advisory & Eco-Tourism Development',
      ta: 'Mangrove Conservation, Coastal Aquaculture Advisory & Eco-Tourism Development'
    },

    tagline: {
      en: 'Dedicated facility for mangrove research and education in a 14-hectare mangrove patch',
      si: 'Dedicated facility for mangrove research and education',
      ta: 'Dedicated facility for mangrove research and education'
    },

    description: {
      en: 'Situated in a 14-hectare mangrove patch adjacent to the Negombo Lagoon, this center focuses on mangrove ecosystem management, researching culturable species in brackish water, studying breeding success of important species, providing training on wetland ecosystems and ornamental fish breeding, and monitoring water quality.',
      si: 'Situated in a 14-hectare mangrove patch adjacent to the Negombo Lagoon, this center focuses on mangrove ecosystem management.',
      ta: 'Situated in a 14-hectare mangrove patch adjacent to the Negombo Lagoon, this center focuses on mangrove ecosystem management.'
    },

    heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',

    focusAreas: [
      {
        title: { en: 'Mangrove Conservation', si: 'Mangrove Conservation', ta: 'Mangrove Conservation' },
        description: { en: 'Development of a national mangrove research and educational center to conserve the 14ha mangrove area critical for lagoon productivity', si: 'Mangrove conservation research', ta: 'Mangrove conservation research' },
        icon: 'Leaf'
      },
      {
        title: { en: 'Brackish Water Aquaculture', si: 'Brackish Water Aquaculture', ta: 'Brackish Water Aquaculture' },
        description: { en: 'Researching potential of culturable species in brackish water environments and studying breeding success of important species', si: 'Brackish water aquaculture research', ta: 'Brackish water aquaculture research' },
        icon: 'Fish'
      },
      {
        title: { en: 'Training & Education', si: 'Training & Education', ta: 'Training & Education' },
        description: { en: 'Providing on-site training to students and farmers on wetland ecosystems and ornamental fish breeding', si: 'Training and education programs', ta: 'Training and education programs' },
        icon: 'GraduationCap'
      }
    ],

    services: [
      {
        title: { en: 'Coastal Aquaculture Advisory', si: 'Coastal Aquaculture Advisory', ta: 'Coastal Aquaculture Advisory' },
        description: { en: 'Serving as a coastal aquaculture advisory center for local fishermen and aquaculture practitioners', si: 'Coastal aquaculture advisory services', ta: 'Coastal aquaculture advisory services' },
        icon: 'Users'
      }
    ],

    contactEmail: 'kadolkele@nara.ac.lk',
    contactPhone: '+94 11 2521000',
    location: 'Kadolkele, Negombo, Western Province'
  },

  {
    id: 'regional-kalpitiya',
    slug: 'regional-research-center-kalpitiya',
    icon: 'MapPin',
    color: 'sky',
    gradient: 'from-sky-500 to-cyan-500',
    category: 'regional',

    name: {
      en: 'Regional Research Center – Kalpitiya',
      si: 'Regional Research Center – Kalpitiya',
      ta: 'Regional Research Center – Kalpitiya'
    },

    headOfDivision: {
      name: { en: 'To be announced', si: 'To be announced', ta: 'To be announced' },
      title: { en: 'Center Director', si: 'Center Director', ta: 'Center Director' }
    },

    areaOfResponsibility: {
      en: 'Marine, Brackish Water & Freshwater Field Research, Coastal Aquaculture Development',
      si: 'Marine, Brackish Water & Freshwater Field Research',
      ta: 'Marine, Brackish Water & Freshwater Field Research'
    },

    tagline: {
      en: 'Strategically positioned near Puttalam Lagoon, Dutch Bay, and Portugal Bay since 1984',
      si: 'Strategically positioned near Puttalam Lagoon since 1984',
      ta: 'Strategically positioned near Puttalam Lagoon since 1984'
    },

    description: {
      en: 'Established in 1984, this center facilitates marine, brackish water, and freshwater research by providing instruments and aids directly in the field. Strategically positioned near the Puttalam Lagoon, Dutch Bay, and Portugal Bay, it allows NARA to monitor the complex hydrology where the Kala Oya and Appu Aru rivers meet the sea. Recently projected towards the development of coastal aquaculture.',
      si: 'Established in 1984, this center facilitates marine, brackish water, and freshwater research.',
      ta: 'Established in 1984, this center facilitates marine, brackish water, and freshwater research.'
    },

    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',

    focusAreas: [
      {
        title: { en: 'Multi-Environment Field Research', si: 'Multi-Environment Field Research', ta: 'Multi-Environment Field Research' },
        description: { en: 'Facilitating marine, brackish water, and freshwater research by providing instruments and aids directly in the field', si: 'Multi-environment field research', ta: 'Multi-environment field research' },
        icon: 'Waves'
      },
      {
        title: { en: 'Coastal Aquaculture Development', si: 'Coastal Aquaculture Development', ta: 'Coastal Aquaculture Development' },
        description: { en: 'Recently projected towards the development of coastal aquaculture in the North-West region', si: 'Coastal aquaculture development', ta: 'Coastal aquaculture development' },
        icon: 'Fish'
      }
    ],

    services: [
      {
        title: { en: 'Hydrological Monitoring', si: 'Hydrological Monitoring', ta: 'Hydrological Monitoring' },
        description: { en: 'Monitoring the complex hydrology where the Kala Oya and Appu Aru rivers meet the sea', si: 'Hydrological monitoring', ta: 'Hydrological monitoring' },
        icon: 'Activity'
      }
    ],

    contactEmail: 'kalpitiya@nara.ac.lk',
    contactPhone: '+94 11 2521000',
    location: 'Sangumalady, Anawasalamunai, Kalpitiya'
  },

  {
    id: 'regional-kapparathota',
    slug: 'regional-research-center-kapparathota',
    icon: 'MapPin',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    category: 'regional',

    name: {
      en: 'Regional Research Center – Kapparathota (Weligama)',
      si: 'Regional Research Center – Kapparathota (Weligama)',
      ta: 'Regional Research Center – Kapparathota (Weligama)'
    },

    headOfDivision: {
      name: { en: 'To be announced', si: 'To be announced', ta: 'To be announced' },
      title: { en: 'Center Director', si: 'Center Director', ta: 'Center Director' }
    },

    areaOfResponsibility: {
      en: 'Marine Fishery Surveys, Marine Mammal Studies & Fishing Ground Identification',
      si: 'Marine Fishery Surveys, Marine Mammal Studies',
      ta: 'Marine Fishery Surveys, Marine Mammal Studies'
    },

    tagline: {
      en: 'Serving the southern coast — a hub for small-scale and commercial fisheries',
      si: 'Serving the southern coast fisheries',
      ta: 'Serving the southern coast fisheries'
    },

    description: {
      en: 'Located in Weligama Bay, this center serves the southern coast with continuous monitoring of marine fish catches at important coastal landing centers. It studies whales and dolphins, works with local fishermen to find new fishing grounds, supports inland fisheries aquaculture development, and provides local advice on ornamental fish breeding.',
      si: 'Located in Weligama Bay, this center serves the southern coast with marine fish catch monitoring.',
      ta: 'Located in Weligama Bay, this center serves the southern coast with marine fish catch monitoring.'
    },

    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',

    focusAreas: [
      {
        title: { en: 'Marine Fishery Surveys', si: 'Marine Fishery Surveys', ta: 'Marine Fishery Surveys' },
        description: { en: 'Continuous monitoring of marine fish catches at important coastal landing centers along the southern coast', si: 'Marine fishery survey and monitoring', ta: 'Marine fishery survey and monitoring' },
        icon: 'Fish'
      },
      {
        title: { en: 'Marine Mammal Research', si: 'Marine Mammal Research', ta: 'Marine Mammal Research' },
        description: { en: 'Studying significant populations of whales and dolphins in the Weligama Bay area', si: 'Marine mammal research', ta: 'Marine mammal research' },
        icon: 'Waves'
      },
      {
        title: { en: 'New Fishing Ground Identification', si: 'New Fishing Ground Identification', ta: 'New Fishing Ground Identification' },
        description: { en: 'Working with local fishermen to find new fishing grounds and develop suitable fishing techniques', si: 'New fishing ground identification', ta: 'New fishing ground identification' },
        icon: 'Compass'
      }
    ],

    services: [
      {
        title: { en: 'Ornamental Fish Advisory', si: 'Ornamental Fish Advisory', ta: 'Ornamental Fish Advisory' },
        description: { en: 'Providing local advice and support for ornamental fish breeding in the southern region', si: 'Ornamental fish advisory', ta: 'Ornamental fish advisory' },
        icon: 'Fish'
      }
    ],

    contactEmail: 'kapparathota@nara.ac.lk',
    contactPhone: '+94 11 2521000',
    location: 'Weligama Bay, Matara District, Southern Province'
  },

  {
    id: 'regional-panapitiya',
    slug: 'regional-research-center-panapitiya',
    icon: 'MapPin',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    category: 'regional',

    name: {
      en: 'Regional Research Center – Panapitiya',
      si: 'Regional Research Center – Panapitiya',
      ta: 'Regional Research Center – Panapitiya'
    },

    headOfDivision: {
      name: { en: 'To be announced', si: 'To be announced', ta: 'To be announced' },
      title: { en: 'Center Director', si: 'Center Director', ta: 'Center Director' }
    },

    areaOfResponsibility: {
      en: 'Ornamental Fish Industry Support, Selective Breeding & Cost-Effective Feed Research',
      si: 'Ornamental Fish Industry Support',
      ta: 'Ornamental Fish Industry Support'
    },

    tagline: {
      en: 'Re-operationalized in 2012 as a service hub for the ornamental fish industry',
      si: 'Re-operationalized in 2012 for ornamental fish industry',
      ta: 'Re-operationalized in 2012 for ornamental fish industry'
    },

    description: {
      en: 'Re-operationalized in 2012, this center functions as a service hub for the ornamental fish industry. It conducts selective breeding programs for Koi Carp, researches cost-effective feeds, rears and breeds Koi Carp, Angel Fish, and Tin Foil Barb, issues brood stock and fingerlings to farmers, investigates value-added uses for invasive Knife Fish, and runs community programs like freshwater prawn polyculture.',
      si: 'Re-operationalized in 2012 as a service hub for the ornamental fish industry.',
      ta: 'Re-operationalized in 2012 as a service hub for the ornamental fish industry.'
    },

    heroImage: 'https://images.unsplash.com/photo-1520301255226-bf5f144451c1?w=1200',

    focusAreas: [
      {
        title: { en: 'Selective Breeding Programs', si: 'Selective Breeding Programs', ta: 'Selective Breeding Programs' },
        description: { en: 'Conducting selective breeding programs specifically for Koi Carp, Angel Fish, and Tin Foil Barb for income generation', si: 'Selective breeding programs', ta: 'Selective breeding programs' },
        icon: 'Fish'
      },
      {
        title: { en: 'Cost-Effective Feed Research', si: 'Cost-Effective Feed Research', ta: 'Cost-Effective Feed Research' },
        description: { en: 'Researching cost-effective and scientifically tested ornamental fish feeds to reduce production costs', si: 'Cost-effective feed research', ta: 'Cost-effective feed research' },
        icon: 'FlaskConical'
      },
      {
        title: { en: 'Invasive Species Management', si: 'Invasive Species Management', ta: 'Invasive Species Management' },
        description: { en: 'Investigating value-added uses for the invasive Knife Fish (Mannaya) to mitigate its threat to local biota', si: 'Invasive species management', ta: 'Invasive species management' },
        icon: 'AlertTriangle'
      }
    ],

    services: [
      {
        title: { en: 'Brood Stock & Fingerling Supply', si: 'Brood Stock & Fingerling Supply', ta: 'Brood Stock & Fingerling Supply' },
        description: { en: 'Issuing brood stock and fingerlings to ornamental fish farmers across the district and island-wide', si: 'Brood stock and fingerling supply', ta: 'Brood stock and fingerling supply' },
        icon: 'Fish'
      }
    ],

    contactEmail: 'panapitiya@nara.ac.lk',
    contactPhone: '+94 11 2521000',
    location: 'Horana - Kalutara Road, Kalutara District, Western Province'
  },

  {
    id: 'regional-rekawa',
    slug: 'regional-research-center-rekawa',
    icon: 'MapPin',
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
    category: 'regional',

    name: {
      en: 'Regional Research Center – Rekawa',
      si: 'Regional Research Center – Rekawa',
      ta: 'Regional Research Center – Rekawa'
    },

    headOfDivision: {
      name: { en: 'To be announced', si: 'To be announced', ta: 'To be announced' },
      title: { en: 'Center Director', si: 'Center Director', ta: 'Center Director' }
    },

    areaOfResponsibility: {
      en: 'Ornamental Aquaculture, Environmental Management & Coastal Ecosystem Conservation',
      si: 'Ornamental Aquaculture & Environmental Management',
      ta: 'Ornamental Aquaculture & Environmental Management'
    },

    tagline: {
      en: 'Balancing aquaculture development with environmental conservation near a biodiversity-rich lagoon',
      si: 'Balancing aquaculture development with environmental conservation',
      ta: 'Balancing aquaculture development with environmental conservation'
    },

    description: {
      en: 'Located near a biodiversity-rich lagoon in Tangalle, this center balances aquaculture development with environmental conservation. It breeds Koi carp, Angel fish, Fighters, Rosy barb, Swordtails, and Malawi fish. It monitors lagoon and pelagic fisheries, pollution status in fisheries harbors, and conducts awareness programs on coastal ecosystem restoration for schools and universities.',
      si: 'Located near a biodiversity-rich lagoon, this center balances aquaculture development with environmental conservation.',
      ta: 'Located near a biodiversity-rich lagoon, this center balances aquaculture development with environmental conservation.'
    },

    heroImage: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200',

    focusAreas: [
      {
        title: { en: 'Ornamental Fish Breeding', si: 'Ornamental Fish Breeding', ta: 'Ornamental Fish Breeding' },
        description: { en: 'Breeding Koi carp, Angel fish, Fighters, Rosy barb, Swordtails, and Malawi fish as income sources for locals', si: 'Ornamental fish breeding', ta: 'Ornamental fish breeding' },
        icon: 'Fish'
      },
      {
        title: { en: 'Environmental Monitoring', si: 'Environmental Monitoring', ta: 'Environmental Monitoring' },
        description: { en: 'Monitoring lagoon and pelagic fisheries, as well as pollution status in fisheries harbors', si: 'Environmental monitoring', ta: 'Environmental monitoring' },
        icon: 'Activity'
      },
      {
        title: { en: 'Ecosystem Conservation Education', si: 'Ecosystem Conservation Education', ta: 'Ecosystem Conservation Education' },
        description: { en: 'Conducting awareness programs on coastal ecosystem restoration for schools and universities', si: 'Ecosystem conservation education', ta: 'Ecosystem conservation education' },
        icon: 'GraduationCap'
      }
    ],

    services: [
      {
        title: { en: 'Livelihood Development', si: 'Livelihood Development', ta: 'Livelihood Development' },
        description: { en: 'Using ornamental aquaculture as an income source for local communities in the Tangalle area', si: 'Livelihood development services', ta: 'Livelihood development services' },
        icon: 'Heart'
      }
    ],

    contactEmail: 'rekawa@nara.ac.lk',
    contactPhone: '+94 11 2521000',
    location: 'Tangalle Divisional Secretariat, Hambantota District, Southern Province'
  }
];

/**
 * Get division by ID
 */
export const getDivisionById = (id) => {
  return DIVISIONS_CONFIG.find(div => div.id === id);
};

/**
 * Get division by slug
 */
export const getDivisionBySlug = (slug) => {
  return DIVISIONS_CONFIG.find(div => div.slug === slug);
};

/**
 * Get all division IDs
 */
export const getAllDivisionIds = () => {
  return DIVISIONS_CONFIG.map(div => div.id);
};

/**
 * Get all division slugs for routing
 */
export const getAllDivisionSlugs = () => {
  return DIVISIONS_CONFIG.map(div => div.slug);
};

/**
 * Get divisions with PDF resources
 */
export const getDivisionsWithPDFs = () => {
  return DIVISIONS_CONFIG.filter(div => div.pdfResource);
};

/**
 * Get divisions by category ('research', 'regional', 'supporting')
 */
export const getDivisionsByCategory = (category) => {
  return DIVISIONS_CONFIG.filter(div => div.category === category);
};

export default DIVISIONS_CONFIG;
