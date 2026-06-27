import en from './content.en.js';

const ta = JSON.parse(JSON.stringify(en));

ta.meta = {
  title: 'அவசர பதில் நெட்வொர்க் - NARA டிஜிட்டல் ஓசன்',
  description:
    'NARA அவசர பதில் நெட்வொர்க் நேரடி தரவு, இருமொழி எச்சரிக்கைகள் மற்றும் ஒருங்கிணைந்த அறிக்கை அமைப்பினால் இலங்கையின் கடற்கரை பாதுகாப்பை ஒருங்கிணைக்கிறது.',
  keywords:
    'NARA emergency response, tsunami alert Sri Lanka, coastal disaster, environmental incident, rapid reporting'
};

ta.hero = {
  badge: 'கடற்கரை அவசர நுண்ணறிவு',
  subheading: 'எப்போதும் தயார்நிலை',
  title: 'இலங்கையின் கடற்கரையை பாதுகாக்க',
  highlight: 'விரைவு நடவடிக்கையுடன்',
  description:
    'அவசர பதில் நெட்வொர்க் துறைமுகங்கள், மீனவர் சமூகங்கள், கடற்படை அணிகள் மற்றும் சுற்றுச்சூழல் பிரிவுகளை நேரடி தகவல், இருமொழி அறிவிப்புகள் மற்றும் ஒழுங்கமைக்கப்பட்ட அறிக்கைகளுடன் இணைக்கிறது.',
  primaryCta: { label: 'அவசர நிலையைப் பதிவு செய்யுங்கள்', icon: 'AlertOctagon' },
  secondaryCta: { label: 'கட்டளை பலகை திறக்க', icon: 'LayoutDashboard' },
  leftStat: { value: '24/7', label: 'ஒற்றுமைப்படுத்தப்பட்ட கண்காணிப்பு' },
  rightStat: { value: '18', label: 'பிராந்திய அணிகள்' },
  image: en.hero.image,
  images: [...en.hero.images]
};

ta.quickActions = [
  {
    id: 'emergency-call',
    title: 'உடனடி அபாயம்',
    summary: 'உயிர்க்கு ஆபத்து, கடல் விபத்து அல்லது சுனாமி சுட்டுக்கள்.',
    primary: { label: 'DMC 117 அழைக்கவும்', icon: 'PhoneCall', href: 'tel:117' },
    secondary: { label: 'அவசர அறிக்கை அனுப்புக', icon: 'Radio', href: '#emergency-reporting' }
  },
  {
    id: 'environmental',
    title: 'சுற்றுச்சூழல் சேதம்',
    summary: 'எண்ணெய்/ரசாயன வீச்சு, பவள வெண்மைப்படுதல், மீன் மரணம், சட்டவிரோத அகழ்வு.',
    primary: { label: 'சுற்றுச்சூழல் சம்பவத்தைப் பதிவுசெய்க', icon: 'Droplets', href: '#environmental-reporting' },
    secondary: { label: 'துறைக் கண்காணிப்பு பட்டியல்', icon: 'ClipboardList', href: '#preparedness' }
  },
  {
    id: 'complaint-support',
    title: 'புகார் / சேவை ஆதரவு',
    summary: 'அவசரமற்ற பொது புகார்கள், சேவை சிக்கல்கள் மற்றும் பின்தொடர்பு கோரிக்கைகள்.',
    primary: { label: 'புகார் அனுப்புக', icon: 'MessageSquareWarning', href: '#non-emergency-reporting' },
    secondary: { label: 'அவசர தொடர்புகள்', icon: 'PhoneCall', href: '#contacts' }
  }
];


ta.reporting.emergency = {
  title: 'அவசர நிகழ்வு பதிவு',
  description:
    'இருமொழி டிஸ்பாசர்கள் மூலம் கடற்கரை காவல், காவல்துறை, கடற்படை, துறைமுகங்கள் மற்றும் நிலப்பரப்பு அணிகளுக்கு ஒரே நேரத்தில் அனுப்பப்படுகிறது.',
  targetResponse: 'குறிப்பு எண்ணுடன் பொது அறிக்கை பெறல்',
  form: {
    title: 'அவசர அறிக்கை சமர்ப்பிக்கவும்',
    fields: [
      { id: 'name', type: 'text', label: 'அறிக்கை தருநர் / அழைப்பாளர் பெயர்', placeholder: 'முழுப் பெயர்', required: true },
      { id: 'contact', type: 'tel', label: 'தொடர்பு எண் / வானொலி அழைப்பு அடையாளம்', placeholder: '+94 XX XXX XXXX அல்லது VHF சேனல்', required: true },
      {
        id: 'incidentType',
        type: 'select',
        label: 'சம்பவ வகை',
        placeholder: 'வகையைத் தேர்ந்தெடுக்கவும்',
        required: true,
        options: [
          'தேடல் & மீட்பு',
          'கடல் விபத்து / ஆபத்து',
          'சுனாமி/அதிர்ச்சி எச்சரிக்கை',
          'கடுமையான வானிலை',
          'தீ / வெடிப்பு',
          'மற்ற அவசர நிகழ்வு'
        ]
      },
      { id: 'location', type: 'text', label: 'சரியான இடம் / GPS', placeholder: 'இடம் அல்லது கோடு', required: true },
      { id: 'description', type: 'textarea', label: 'சுருக்கம்', placeholder: 'நிலையில் என்ன நடைபெறுகிறது? பாதிக்கப்பட்டவர்கள், ஆபத்துகள்', required: true },
      { id: 'resources', type: 'textarea', label: 'தேவையான வளங்கள்', placeholder: 'கப்பல்கள், மருத்துவம், HazMat, வெளியேற்றம்' },
      { id: 'attachments', type: 'file', label: 'பதிவுகள் (படம்/வீடியோ/ஆவணங்கள்)' }
    ],
    submitLabel: 'அவசர அறிக்கையை அனுப்புக',
    acknowledgement:
      'அவசர அறிக்கை பெறப்பட்டது. உடனடி அபாயம் இருந்தால் DMC 117, காவல் 119 அல்லது ஆம்புலன்ஸ் 1990 அழைப்பை தொடரவும்.'
  }
};

ta.reporting.nonEmergency = {
  title: 'அவசரமற்ற ஆதரவு',
  description:
    'பாதுகாப்பு அபாயங்கள், துறைமுக பராமரிப்பு, சமூக கவலைகள், வழிசெலுத்தும் தடைகள் போன்றவற்றை முன்கூட்டியே திட்டமிடுவதற்கு அறிவிக்கவும்.',
  supportText: 'பொது புகார்கள் மற்றும் ஆதரவு கோரிக்கைகள் ஆய்வு மற்றும் பின்தொடர்பிற்காக பதிவு செய்யப்படும்.',
  form: {
    title: 'அவசரமற்ற கோரிக்கை பதிவு',
    fields: [
      { id: 'name', type: 'text', label: 'அறிக்கை வழங்குநர் / நிறுவனம்', placeholder: 'பெயர் அல்லது பிரிவு', required: true },
      { id: 'email', type: 'email', label: 'மின்னஞ்சல் / தொடர்பு (விருப்பமானது)', placeholder: 'yourname@nara.gov.lk' },
      {
        id: 'category',
        type: 'select',
        label: 'பிரச்சினை வகை',
        placeholder: 'வகையைத் தேர்ந்தெடுக்கவும்',
        required: true,
        options: [
          'மின்விளக்கு / பூயா சேதம்',
          'வழிச் சேனல் தடைகள்',
          'சமூக கட்டமைப்பு அபாயம்',
          'துறைமுக உபகரண பராமரிப்பு',
          'மீனவர் பாதுகாப்பு பயிற்சி',
          'மற்ற ஆதரவு கோரிக்கை'
        ]
      },
      { id: 'location', type: 'text', label: 'இடம் / வசதி', placeholder: 'துறைமுகம், GN பகுதி, GPS', required: true },
      { id: 'details', type: 'textarea', label: 'விவரங்கள்', placeholder: 'சூழல், தாக்கம், பரிந்துரைக்கப்பட்ட நடவடிக்கை', required: true },
      { id: 'preferredDate', type: 'date', label: 'பின்தொடரும் தேதி' }
    ],
    submitLabel: 'ஆதரவு கோரிக்கையை அனுப்புக',
    acknowledgement: 'புகார்/ஆதரவு கோரிக்கை பெறப்பட்டது. பின்தொடர்விற்காக குறிப்பு எண்ணை வைத்திருங்கள்.'
  }
};

ta.reporting.environmental = {
  title: 'சுற்றுச்சூழல் பாதிப்பு அறிக்கை',
  description:
    'மாசுபாடு, பவள பாதிப்பு, மீன் மரணம் அல்லது சட்டவிரோத அகழ்வு போன்றவற்றை உடனடியாக பதிவுசெய்து அமலாக்க, மீட்பு அணிகளுடன் ஒருங்கிணைக்கவும்.',
  hotline: 'உடனடி பொது பாதுகாப்பு அபாயம் இருந்தால் முதலில் DMC 117 அல்லது காவல் 119 அழைக்கவும்.',
  form: {
    title: 'சுற்றுச்சூழல் சம்பவ பதிவு',
    fields: [
      {
        id: 'impactType',
        type: 'select',
        label: 'பாதிப்பு வகை',
        placeholder: 'வகையைத் தேர்ந்தெடுக்கவும்',
        required: true,
        options: [
          'எண்ணெய் / ரசாயன சிதறல்',
          'மாங்க்ரோவ் அழிப்பு',
          'பவள வெண்மைப்படுதல்',
          'மீன் மரணம் / ஆல்கே பெருக்கு',
          'சட்டவிரோத மணல் அகழ்வு',
          'கடல் விலங்கு சிக்கல்',
          'மற்ற சூழல் சேதம்'
        ]
      },
      { id: 'detectedOn', type: 'datetime-local', label: 'கண்டறிந்த நேரம்', required: true },
      { id: 'location', type: 'text', label: 'இடம் / பாறை / ஆற்றங்கரை', placeholder: 'இடம் மற்றும் கூட்டுறைகள்', required: true },
      { id: 'extent', type: 'text', label: 'பாதிப்பு அளவு', placeholder: 'பரப்பளவு, அளவு, நீளம்' },
      { id: 'currentStatus', type: 'textarea', label: 'தற்போதைய நிலை', placeholder: 'இப்போது என்ன நடைபெறுகிறது? அலைகள், காலநிலை, தொடரும் வெளியேற்றம்', required: true },
      { id: 'samples', type: 'textarea', label: 'மாதிரிகள் / ஆய்வக உதவி', placeholder: 'நீர் மாதிரி, நோயியல், புகைப்படங்கள், ட்ரோன் காட்சிமங்கள்' },
      { id: 'attachments', type: 'file', label: 'புகைப்படம், வீடியோ, ஆய்வக அறிக்கைகள்' }
    ],
    supportText: 'NARA ஆதாரத்தை ஆய்வு செய்து தேவையானபோது பொருத்தமான அதிகாரிகளுக்கு வழிமாற்றும்.',
    submitLabel: 'சுற்றுச்சூழல் பாதிப்பை அனுப்புக',
    acknowledgement:
      'சுற்றுச்சூழல் சம்பவம் பெறப்பட்டது. சரிபார்ப்பு அல்லது பின்தொடர்விற்காக குறிப்பு எண்ணை வைத்திருங்கள்.'
  }
};


ta.alerts.title = 'நேரடி எச்சரிக்கை';
ta.alerts.viewArchiveLabel = 'செயலில் உள்ள எச்சரிக்கைகள்';
ta.alerts.items = [
  {
    ...ta.alerts.items[0],
    title: 'உடனடி அபாயம்: முதலில் அழைக்கவும்',
    description:
      'உயிருக்கு அல்லது பொது பாதுகாப்புக்கு உடனடி அபாயம் இருந்தால் online அறிக்கைக்கு முன் DMC 117, காவல் 119 அல்லது ஆம்புலன்ஸ் 1990 அழைக்கவும்.',
    location: 'இலங்கை',
    timestamp: 'பொது வழிகாட்டல்',
    affectedAreas: ['தேசிய அவசர எண்கள்']
  },
  {
    ...ta.alerts.items[1],
    title: 'வேகமான ஆய்வுக்கு ஆதாரம் சேர்க்கவும்',
    description:
      'கடற்கரை மாசுபாடு, மீன் மரணம், சட்டவிரோத குப்பை வீச்சு அல்லது பாறை சேதம் இருந்தால் புகைப்படங்கள், GPS/இடம், நேரம் மற்றும் தொடர்பு விவரங்களை சேர்க்கவும்.',
    location: 'கடல் மற்றும் கடற்கரை பகுதிகள்',
    timestamp: 'ஆதார பட்டியல்',
    affectedAreas: ['புகைப்படங்கள்', 'இடம்', 'கண்ட நேரம்']
  },
  {
    ...ta.alerts.items[2],
    title: 'புகார்கள் மற்றும் சேவை கோரிக்கைகள்',
    description:
      'அவசரமற்ற சிக்கல்களுக்கு புகார்/ஆதரவு tab-ஐ பயன்படுத்தவும். சமர்ப்பித்த பிறகு காணப்படும் குறிப்பு எண்ணை வைத்திருங்கள்.',
    location: 'NARA பொது சேவைகள்',
    timestamp: 'சேவை வழிகாட்டல்',
    affectedAreas: ['புகார்கள்', 'ஆதரவு', 'பின்தொடர்பு']
  }
];


ta.systemStatus.systems[0].name = 'உடனடி அவசர தொடர்புகள்';
ta.systemStatus.systems[0].description = 'தேசிய அவசர எண்கள் hero, reporting hub மற்றும் directory-யில் காட்டப்படுகின்றன.';
ta.systemStatus.systems[0].statusMessage = 'உடனடி அபாயம் இருந்தால் முதலில் தொலைபேசி எண்களைப் பயன்படுத்தவும்.';
ta.systemStatus.systems[1] = {
  ...ta.systemStatus.systems[1],
  name: 'Online அறிக்கை பெறல்',
  description: 'அவசரம், சுற்றுச்சூழல், புகார்/ஆதரவு அறிக்கைகளுக்கு மூன்று கவனமான forms உள்ளன.',
  statusMessage: 'சமர்ப்பிப்புகள் பின்தொடர்விற்கான பொது குறிப்பு எண்ணை வழங்கும்.'
};
ta.systemStatus.systems[2].name = 'தயார்நிலை PDF பதிவிறக்கங்கள்';
ta.systemStatus.systems[2].description = 'வெளியேற்றம், சுற்றுச்சூழல், சமூக பயிற்சி மற்றும் map reference PDF-கள் பதிவிறக்கக்கூடியவை.';
ta.systemStatus.systems[3] = {
  ...ta.systemStatus.systems[3],
  name: 'Staff ஆய்வு அணுகல்',
  description: 'பொது சமர்ப்பிப்புகள் create-only; staff roles ஆய்வு மற்றும் பின்தொடர்வை நிர்வகிக்கும்.',
  statusMessage: 'Live submissions-க்கு hosting update உடன் Firestore rules deploy செய்யவும்.'
};


ta.contacts.title = 'கூட்டு செயல்பாட்டு தொடர்புகள்';
ta.contacts.description =
  'உடனடி அபாயத்திற்கு தேசிய அவசர எண்களை முதலில் பயன்படுத்தி, பின்னர் ஆதாரம் மற்றும் பின்தொடர்பு விவரங்களை NARA-க்கு அனுப்பவும்.';
ta.contacts.items[0].name = 'பேரிடர் மேலாண்மை மையம்';
ta.contacts.items[0].description = 'அவசர பேரிடர் ஒருங்கிணைப்பிற்கான தேசிய அழைப்பு மையம்.';
ta.contacts.items[1].name = 'இலங்கை காவல் அவசரம்';
ta.contacts.items[1].description = 'உடனடி பொது பாதுகாப்பு அச்சுறுத்தல்களுக்கு காவல் அவசர பதில்.';
ta.contacts.items[2].name = 'ஆம்புலன்ஸ் / மருத்துவ அவசரம்';
ta.contacts.items[2].description = 'உடனடி மருத்துவ அவசரம் மற்றும் ஆம்புலன்ஸ் ஆதரவு.';
ta.contacts.items[3].name = 'NARA கடல் அறிக்கை மேசை';
ta.contacts.items[3].description = 'கடல் மற்றும் கடற்கரை ஆதாரம், புகார்கள் மற்றும் சேவை பின்தொடர்பு.';


ta.preparedness.title = 'தயார்நிலை & பயிற்சி நூலகம்';
ta.preparedness.description =
  'SOP, சரிபார்ப்பு பட்டியல், சமூக பயிற்சி டெம்ப்ளேட் உள்ளிட்ட வளங்கள் காலாண்டு ஆய்வு செய்யப்பட்டவை.';
ta.preparedness.items[0].title = 'கடற்கரை வெளியேற்ற களவழிகாட்டி';
ta.preparedness.items[0].description = 'GN அதிகாரிகள், துறைமுக நிர்வாகிகள் பயன்படுத்த வேண்டிய படிப்படியான கையேடு.';
ta.preparedness.items[1].title = 'சுற்றுச்சூழல் விரைவு மதிப்பீடு பட்டியல்';
ta.preparedness.items[2].title = 'சமூக எச்சரிக்கை பயிற்சி விரைவு குறிப்பு';
ta.preparedness.items[2].description = 'உள்ளடக்கிய செய்தியுடன் கடற்கரை எச்சரிக்கை பயிற்சிகளை திட்டமிட ஒரு பக்க குறிப்பு.';


ta.situationRoom.title = 'சரியான அவசர சேனலை தேர்ந்தெடுக்கவும்';
ta.situationRoom.description =
  'உடனடி அபாயம் இருந்தால் முதலில் அழைக்கவும். ஆதாரம், சுற்றுச்சூழல் அறிக்கை அல்லது சேவை புகார்களுக்கு பொருத்தமான form-ஐ பயன்படுத்தி குறிப்பு எண்ணை வைத்திருங்கள்.';
ta.situationRoom.actions[0].label = 'DMC 117 அழைக்கவும்';
ta.situationRoom.actions[1].label = 'புகார் / ஆதரவு அனுப்புக';
ta.situationRoom.actions[2].label = 'வெளியேற்ற குறிப்பு பதிவிறக்கம்';


ta.environmentWatch.title = 'சுற்றுச்சூழல் நுண்ணறிவு அடுக்கு';
ta.environmentWatch.description =
  'பவள ஆரோக்கியம், மாங்க்ரோவ் அழுத்தம், நீர்தர மற்றும் மீன் இறப்பு போக்குகளை நேரடி தரவாகக் காட்டி முன்கூட்டியே செயல் திட்டமிடுகிறது.';
ta.environmentWatch.stats[0].label = 'பவள கண்காணிப்பு இடங்கள்';
ta.environmentWatch.stats[1].label = 'மாங்க்ரோவ் சென்சார்கள்';
ta.environmentWatch.stats[2].label = 'நீர்தர எச்சரிக்கைகள்';
ta.environmentWatch.stats[1].trend = '+4 புதிய நிறுவல்';
ta.environmentWatch.stats[2].trend = '3 செயலில்';
ta.environmentWatch.cta.label = 'சுற்றுச்சூழல் டாஷ்போர்டைக் காண்க';

export default ta;
