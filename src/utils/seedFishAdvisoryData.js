import { Timestamp } from 'firebase/firestore';
import {
  fishAdvisoryService,
  fishingZonesService,
  fishMarketPricesService,
  seasonalRestrictionsService
} from '../services/fishAdvisoryService';

/**
 * Seed Fish Advisory System with sample data
 * This adds realistic data for Sri Lankan fishing industry
 */
export const seedFishAdvisoryData = async () => {
  console.log('🌊 Starting Fish Advisory Data Seeding...');

  try {
    // 1. FISH ADVISORIES
    console.log('📢 Creating fish advisories...');
    const advisories = [
      {
        title: { en: 'High Mercury Levels - Swordfish', si: 'ඉහළ රසදිය මට්ටම - කඩුමාළු', ta: 'உயர் பாதரச அளவுகள் - வாள் மீன்' },
        description: { en: 'Elevated mercury levels detected in swordfish caught in Southern waters. Pregnant women and children should avoid consumption.', si: 'දකුණු ජලයේ අල්ලාගත් කඩුමාළුවල ඉහළ රසදිය මට්ටම් අනාවරණය විය. ගැබිනි කාන්තාවන් සහ ළමුන් පරිභෝජනයෙන් වළකින්න.', ta: 'தெற்கு நீரில் பிடிக்கப்பட்ட வாள் மீன்களில் உயர்ந்த பாதரச அளவுகள் கண்டறியப்பட்டுள்ளன. கர்ப்பிணி பெண்கள் மற்றும் குழந்தைகள் உண்பதைத் தவிர்க்க வேண்டும்.' },
        species: 'Swordfish',
        zone: 'Southern Deep Waters',
        severity: 'high',
        status: 'active',
        validFrom: Timestamp.now(),
        validUntil: Timestamp.fromDate(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000))
      },
      {
        title: { en: 'Red Tide Alert - Northwest Coast', si: 'රතු වඩදිය අනතුරු ඇඟවීම - වයඹ වෙරළ', ta: 'சிவப்பு அலை எச்சரிக்கை - வடமேற்கு கடற்கரை' },
        description: { en: 'Red tide algae bloom detected near Mannar Gulf. Shellfish consumption is not recommended until further notice.', si: 'මන්නාරම බොක්ක අසල රතු වඩදිය ඇල්ගී පිපිරුම අනාවරණය විය. තවදුරටත් දැනුම් දෙන තුරු ෂෙල්ෆිෂ් පරිභෝජනය නිර්දේශ නොකෙරේ.', ta: 'மன்னார் வளைகுடாவுக்கு அருகில் சிவப்பு அலை பாசி மலர்ச்சி கண்டறியப்பட்டுள்ளது. மேலும் அறிவிப்பு வரும் வரை மட்டி உணவு பரிந்துரைக்கப்படவில்லை.' },
        species: 'Shellfish',
        zone: 'Mannar Gulf',
        severity: 'critical',
        status: 'active',
        validFrom: Timestamp.now(),
        validUntil: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))
      },
      {
        title: { en: 'Sustainable Fishing - Skipjack Tuna', si: 'තිරසාර මසුන් ඇල්ලීම - ස්කිප්ජැක් ටූනා', ta: 'நிலையான மீன்பிடித்தல் - ஸ்கிப்ஜாக் துணா' },
        description: { en: 'Skipjack tuna stocks are healthy in Eastern waters. Continue sustainable fishing practices.', si: 'නැගෙනහිර ජලයේ ස්කිප්ජැක් ටූනා තොග සෞඛ්‍ය සම්පන්නයි. තිරසාර මසුන් ඇල්ලීමේ පිළිවෙත් දිගටම පවත්වාගෙන යන්න.', ta: 'கிழக்கு நீரில் ஸ்கிப்ஜாக் துணா பங்குகள் ஆரோக்கியமாக உள்ளன. நிலையான மீன்பிடி நடைமுறைகளைத் தொடரவும்.' },
        species: 'Skipjack Tuna',
        zone: 'East Coast Deep Zone',
        severity: 'low',
        status: 'active',
        validFrom: Timestamp.now(),
        validUntil: Timestamp.fromDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
      },
      {
        title: { en: 'Moderate Contamination - Coastal Crab', si: 'මධ්‍යස්ථ දූෂණය - වෙරළ කකුළුවා', ta: 'மிதமான மாசுபாடு - கடற்கரை நண்டு' },
        description: { en: 'Crabs from Colombo harbor area show moderate contamination. Clean thoroughly before consumption.', si: 'කොළඹ වරාය ප්‍රදේශයේ කකුළුවන් මධ්‍යස්ථ දූෂණය පෙන්වයි. පරිභෝජනයට පෙර හොඳින් පිරිසිදු කරන්න.', ta: 'கொழும்பு துறைமுக பகுதியிலிருந்து நண்டுகள் மிதமான மாசுபாட்டைக் காட்டுகின்றன. நுகர்வுக்கு முன் நன்கு சுத்தம் செய்யவும்.' },
        species: 'Crab',
        zone: 'Colombo Offshore',
        severity: 'medium',
        status: 'active',
        validFrom: Timestamp.now(),
        validUntil: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
      }
    ];

    for (const advisory of advisories) {
      const result = await fishAdvisoryService.create(advisory);
      if (result.error) {
        console.error('Error creating advisory:', result.error);
      } else {
        console.log(`✅ Created advisory: ${advisory.title.en}`);
      }
    }

    // 2. FISHING ZONES
    console.log('\n🗺️ Creating fishing zones...');
    const zones = [
      {
        name: { en: 'Colombo Offshore', si: 'කොළඹ අක්වෙරළ', ta: 'கொழும்பு கடலோர' },
        description: { en: 'Coastal waters off Colombo with moderate fishing activity', si: 'කොළඹ අක්වෙරළ ජලය මධ්‍යස්ථ මසුන් ඇල්ලීමේ ක්‍රියාකාරකම් සමඟ', ta: 'கொழும்பு கடற்கரை நீர் மிதமான மீன்பிடி செயல்பாடுகளுடன்' },
        region: 'Western Province',
        status: 'open',
        coordinates: { lat: 6.9271, lng: 79.8612 }
      },
      {
        name: { en: 'Trincomalee Banks', si: 'ත්‍රිකුණාමලය බැංකු', ta: 'திருகோணமலை வங்கிகள்' },
        description: { en: 'Deep sea fishing grounds with excellent tuna stocks', si: 'විශිෂ්ට ටූනා තොග සහිත ගැඹුරු මුහුදු මසුන් ඇල්ලීමේ භූමිය', ta: 'சிறந்த துணா பங்குகளுடன் ஆழ்கடல் மீன்பிடி நிலங்கள்' },
        region: 'Eastern Province',
        status: 'open',
        coordinates: { lat: 8.5874, lng: 81.2152 }
      },
      {
        name: { en: 'Galle Deep Water', si: 'ගාල්ල ගැඹුරු ජලය', ta: 'காலி ஆழமான நீர்' },
        description: { en: 'Rich fishing grounds in Southern deep waters', si: 'දකුණු ගැඹුරු ජලයේ පොහොසත් මසුන් ඇල්ලීමේ භූමිය', ta: 'தென் ஆழமான நீரில் வளமான மீன்பிடி நிலங்கள்' },
        region: 'Southern Province',
        status: 'open',
        coordinates: { lat: 6.0367, lng: 80.2170 }
      },
      {
        name: { en: 'Hambantota Offshore', si: 'හම්බන්තොට අක්වෙරළ', ta: 'அம்பாந்தோட்டை கடலோர' },
        description: { en: 'Offshore fishing zone with diverse marine life', si: 'විවිධ සාගර ජීවීන් සහිත අක්වෙරළ මසුන් ඇල්ලීමේ කලාපය', ta: 'பல்வேறு கடல் உயிரினங்களுடன் கூடிய கடலோர மீன்பிடி மண்டலம்' },
        region: 'Southern Province',
        status: 'open',
        coordinates: { lat: 6.1384, lng: 81.1185 }
      },
      {
        name: { en: 'Mannar Gulf', si: 'මන්නාරම බොක්ක', ta: 'மன்னார் வளைகுடா' },
        description: { en: 'Temporarily restricted due to red tide conditions', si: 'රතු වඩදිය තත්ත්වයන් නිසා තාවකාලිකව සීමා කර ඇත', ta: 'சிவப்பு அலை நிலைமைகள் காரணமாக தற்காலிகமாக தடைசெய்யப்பட்டது' },
        region: 'Northern Province',
        status: 'restricted',
        coordinates: { lat: 9.0000, lng: 79.5000 }
      },
      {
        name: { en: 'East Coast Deep Zone', si: 'නැගෙනහිර වෙරළ ගැඹුරු කලාපය', ta: 'கிழக்கு கடற்கரை ஆழமான பகுதி' },
        description: { en: 'Prime deep sea fishing area for large pelagic species', si: 'විශාල මුහුදු මත්ස්‍ය විශේෂ සඳහා ප්‍රධාන ගැඹුරු මුහුදු මසුන් ඇල්ලීමේ ප්‍රදේශය', ta: 'பெரிய பெலாஜிக் இனங்களுக்கான முதன்மை ஆழ்கடல் மீன்பிடி பகுதி' },
        region: 'Eastern Province',
        status: 'open',
        coordinates: { lat: 7.8731, lng: 82.3956 }
      }
    ];

    for (const zone of zones) {
      const result = await fishingZonesService.create(zone);
      if (result.error) {
        console.error('Error creating zone:', result.error);
      } else {
        console.log(`✅ Created zone: ${zone.name.en}`);
      }
    }

    // 3. MARKET PRICES
    console.log('\n💰 Creating market prices...');
    const prices = [
      { species: { en: 'Yellowfin Tuna', si: 'කහ වරලුළු ටූනා', ta: 'மஞ்சள் துடுப்பு துணா' }, market: { en: 'Negombo Fish Market', si: 'මීගමුව මසුන් වෙළඳපොළ', ta: 'நீர்கொழும்பு மீன் சந்தை' }, price: 1850, priceChange: 5.2 },
      { species: { en: 'Skipjack Tuna', si: 'ස්කිප්ජැක් ටූනා', ta: 'ஸ்கிப்ஜாக் துணா' }, market: { en: 'Colombo Fish Market', si: 'කොළඹ මසුන් වෙළඳපොළ', ta: 'கொழும்பு மீன் சந்தை' }, price: 1200, priceChange: 2.5 },
      { species: { en: 'Swordfish', si: 'කඩුමාළු', ta: 'வாள் மீன்' }, market: { en: 'Galle Harbor', si: 'ගාල්ල වරාය', ta: 'காலி துறைமுகம்' }, price: 2200, priceChange: -3.1 },
      { species: { en: 'King Fish (Narrow Barred)', si: 'තෝරා', ta: 'அரச மீன்' }, market: { en: 'Negombo Fish Market', si: 'මීගමුව මසුන් වෙළඳපොළ', ta: 'நீர்கொழும்பு மீன் சந்தை' }, price: 1650, priceChange: 8.4 },
      { species: { en: 'Barracuda', si: 'දුල්ලා', ta: 'பராகுடா' }, market: { en: 'Trincomalee Fish Market', si: 'ත්‍රිකුණාමලය මසුන් වෙළඳපොළ', ta: 'திருகோணமலை மீன் சந்தை' }, price: 950, priceChange: 1.8 },
      { species: { en: 'Bigeye Tuna', si: 'බිග්අයි ටූනා', ta: 'பெரிய கண் துணா' }, market: { en: 'Colombo Fish Market', si: 'කොළඹ මසුන් වෙළඳපොළ', ta: 'கொழும்பு மீன் சந்தை' }, price: 2100, priceChange: 4.7 },
      { species: { en: 'Prawns (Jumbo)', si: 'ඉස්සන් (විශාල)', ta: 'இறால் (பெரிய)' }, market: { en: 'Negombo Fish Market', si: 'මීගමුව මසුන් වෙළඳපොළ', ta: 'நீர்கொழும்பு மீன் சந்தை' }, price: 3200, priceChange: -2.3 },
      { species: { en: 'Cuttlefish', si: 'දැල්ලා', ta: 'கடலாமை மீன்' }, market: { en: 'Galle Harbor', si: 'ගාල්ල වරාය', ta: 'காலி துறைமுகம்' }, price: 1450, priceChange: 6.1 },
      { species: { en: 'Mackerel', si: 'බලයා', ta: 'கானாங்கெளுத்தி' }, market: { en: 'Colombo Fish Market', si: 'කොළඹ මසුන් වෙළඳපොළ', ta: 'கொழும்பு மீன் சந்தை' }, price: 680, priceChange: 3.2 },
      { species: { en: 'Squid', si: 'සැකැල්ලා', ta: 'கணவாய்' }, market: { en: 'Trincomalee Fish Market', si: 'ත්‍රිකුණාමලය මසුන් වෙළඳපොළ', ta: 'திருகோணமலை மீன் சந்தை' }, price: 1100, priceChange: -1.5 },
      { species: { en: 'Red Snapper', si: 'රතු ස්නැපර්', ta: 'சிவப்பு மீன்' }, market: { en: 'Negombo Fish Market', si: 'මීගමුව මසුන් වෙළඳපොළ', ta: 'நீர்கொழும்பு மீன் சந்தை' }, price: 1780, priceChange: 7.9 },
      { species: { en: 'Dorado (Mahi-Mahi)', si: 'ඩොරාඩෝ', ta: 'டொராடோ' }, market: { en: 'Galle Harbor', si: 'ගාල්ල වරාය', ta: 'காலி துறைமுகம்' }, price: 1580, priceChange: 4.3 },
      { species: { en: 'Crab (Mud)', si: 'කකුළුවා (මඩ)', ta: 'நண்டு (சேறு)' }, market: { en: 'Colombo Fish Market', si: 'කොළඹ මසුන් වෙළඳපොළ', ta: 'கொழும்பு மீன் சந்தை' }, price: 2800, priceChange: 5.6 },
      { species: { en: 'Pomfret', si: 'හවරුල්මැස්සා', ta: 'வெள்ளி மீன்' }, market: { en: 'Trincomalee Fish Market', si: 'ත්‍රිකුණාමලය මසුන් වෙළඳපොළ', ta: 'திருகோணமலை மீன் சந்தை' }, price: 2300, priceChange: -2.8 },
      { species: { en: 'Anchovy', si: 'හාල්මැස්සෝ', ta: 'நெத்திலி' }, market: { en: 'Negombo Fish Market', si: 'මීගමුව මසුන් වෙළඳපොළ', ta: 'நீர்கொழும்பு மீன் சந்தை' }, price: 420, priceChange: 1.2 },
      { species: { en: 'Sailfish', si: 'ඉහළ ගොඩී මාළු', ta: 'பாய் மீன்' }, market: { en: 'Galle Harbor', si: 'ගාල්ල වරාය', ta: 'காலி துறைமுகம்' }, price: 2450, priceChange: 9.3 },
      { species: { en: 'Lobster', si: 'වරහා', ta: 'நண்டு கொண்டை' }, market: { en: 'Colombo Fish Market', si: 'කොළඹ මසුන් වෙළඳපොළ', ta: 'கொழும்பு மீன் சந்தை' }, price: 4500, priceChange: -4.2 },
      { species: { en: 'Herring', si: 'සලයා', ta: 'மத்தி' }, market: { en: 'Trincomalee Fish Market', si: 'ත්‍රිකුණාමලය මසුන් වෙළඳපොළ', ta: 'திருகோணமலை மீன் சந்தை' }, price: 580, priceChange: 2.7 },
      { species: { en: 'Grouper', si: 'ගර්ඊපර්', ta: 'குரூப்பர்' }, market: { en: 'Negombo Fish Market', si: 'මීගමුව මසුන් වෙළඳපොළ', ta: 'நீர்கொழும்பு மீன் சந்தை' }, price: 1920, priceChange: 6.8 },
      { species: { en: 'Trevally', si: 'පරාවා', ta: 'வெள்ளி பாறை' }, market: { en: 'Galle Harbor', si: 'ගාල්ල වරාය', ta: 'காலி துறைமுகம்' }, price: 1380, priceChange: 3.9 }
    ];

    for (const price of prices) {
      const priceData = {
        ...price,
        date: Timestamp.now()
      };
      const result = await fishMarketPricesService.create(priceData);
      if (result.error) {
        console.error('Error creating price:', result.error);
      } else {
        console.log(`✅ Created price: ${price.species.en} - Rs. ${price.price}`);
      }
    }

    // 4. SEASONAL RESTRICTIONS
    console.log('\n⚠️ Creating seasonal restrictions...');
    const restrictions = [
      {
        title: { en: 'Spawning Season Ban - Mullet', si: 'පැටවුන් බිහිවන කාලය තහනම - මුල්ලැට්', ta: 'முட்டையிடும் பருவ தடை - மீன்' },
        description: { en: 'Ban on catching mullet during spawning season to protect breeding stocks', si: 'අභිජනන තොග ආරක්ෂා කිරීම සඳහා පැටවුන් බිහිවන කාලය තුළ මුල්ලැට් අල්ලා ගැනීම තහනම්', ta: 'இனப்பெருக்க பங்குகளைப் பாதுகாக்க முட்டையிடும் பருவத்தில் மீன் பிடிப்பதைத் தடை' },
        species: { en: 'Mullet', si: 'මුල්ලැට්', ta: 'மீன்' },
        status: 'active',
        startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000))
      },
      {
        title: { en: 'Size Limit Enforcement - Lobster', si: 'ප්‍රමාණ සීමාව බලාත්මක කිරීම - වරහා', ta: 'அளவு வரம்பு அமலாக்கம் - நண்டு கொண்டை' },
        description: { en: 'Only lobsters above 300g can be harvested. Undersize lobsters must be released.', si: 'ග්‍රෑම් 300 ට වැඩි වරහා පමණක් අස්වනු ලැබිය හැකිය. අඩු ප්‍රමාණයේ වරහා මුදා හැරිය යුතුය.', ta: '300 கிராமுக்கு மேல் உள்ள நண்டு கொண்டை மட்டுமே அறுவடை செய்ய முடியும். குறைந்த அளவிலான நண்டு கொண்டை விடுவிக்கப்பட வேண்டும்.' },
        species: { en: 'Lobster', si: 'වරහා', ta: 'நண்டு கொண்டை' },
        status: 'active',
        startDate: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
        endDate: Timestamp.fromDate(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000))
      },
      {
        title: { en: 'Protected Area - Coral Reef Zone', si: 'ආරක්ෂිත ප්‍රදේශය - කොරල් පර කලාපය', ta: 'பாதுகாக்கப்பட்ட பகுதி - பவளப்பாறை மண்டலம்' },
        description: { en: 'No fishing allowed in designated coral reef protection zones around Hikkaduwa', si: 'හික්කඩුව වටා නම් කරන ලද කොරල් පර ආරක්ෂණ කලාපවල මසුන් ඇල්ලීමට අවසර නැත', ta: 'ஹிக்கதுவா சுற்றி நியமிக்கப்பட்ட பவளப்பாறை பாதுகாப்பு மண்டலங்களில் மீன்பிடிக்க அனுமதி இல்லை' },
        species: { en: 'All Species', si: 'සියලුම විශේෂ', ta: 'அனைத்து இனங்களும்' },
        status: 'active',
        startDate: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        endDate: Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))
      }
    ];

    for (const restriction of restrictions) {
      const result = await seasonalRestrictionsService.create(restriction);
      if (result.error) {
        console.error('Error creating restriction:', result.error);
      } else {
        console.log(`✅ Created restriction: ${restriction.title.en}`);
      }
    }

    console.log('\n✅ Fish Advisory Data Seeding Complete!');
    console.log('📊 Summary:');
    console.log(`   - ${advisories.length} Advisories`);
    console.log(`   - ${zones.length} Fishing Zones`);
    console.log(`   - ${prices.length} Market Prices`);
    console.log(`   - ${restrictions.length} Seasonal Restrictions`);

    return {
      success: true,
      counts: {
        advisories: advisories.length,
        zones: zones.length,
        prices: prices.length,
        restrictions: restrictions.length
      }
    };

  } catch (error) {
    console.error('❌ Error seeding fish advisory data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
