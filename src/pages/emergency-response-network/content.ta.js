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
    primary: { label: '117 கடலோர காவல்', icon: 'PhoneCall', href: 'tel:117' },
    secondary: { label: 'SOS ஒலிபரப்பவும்', icon: 'Radio', href: '#emergency-reporting' }
  },
  {
    id: 'environmental',
    title: 'சுற்றுச்சூழல் சேதம்',
    summary: 'எண்ணெய்/ரசாயன வீச்சு, பவள வெண்மைப்படுதல், மீன் மரணம், சட்டவிரோத அகழ்வு.',
    primary: { label: 'சுற்றுச்சூழல் சம்பவத்தைப் பதிவுசெய்க', icon: 'Droplets', href: '#environmental-reporting' },
    secondary: { label: 'துறைக் கண்காணிப்பு பட்டியல்', icon: 'ClipboardList', href: '#preparedness' }
  },
  {
    id: 'admin-console',
    title: 'கட்டளை & பகுப்பாய்வு',
    summary: 'அங்கீகரிக்கப்பட்ட அதிகாரிகள் எச்சரிக்கைகள், தரவுப் போக்குகள் மற்றும் இருமொழி தகவல்களை நிர்வகிக்கலாம்.',
    primary: { label: 'நிர்வாக குழுவைத் திறக்கவும்', icon: 'ShieldCheck', href: '/admin' },
    secondary: { label: 'செயல்பாட்டு அறிக்கைகள்', icon: 'FileSpreadsheet', href: '#situation-room' }
  }
];


ta.reporting.emergency = {
  title: 'அவசர நிகழ்வு பதிவு',
  description:
    'இருமொழி டிஸ்பாசர்கள் மூலம் கடற்கரை காவல், காவல்துறை, கடற்படை, துறைமுகங்கள் மற்றும் நிலப்பரப்பு அணிகளுக்கு ஒரே நேரத்தில் அனுப்பப்படுகிறது.',
  targetResponse: 'சராசரி அனுப்பும் நேரம்: 5 நிமிடங்களுக்குள்',
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
      'அறிக்கை பெறப்பட்டுள்ளது. இருமொழி டிஸ்பாசர் 3 நிமிடங்களுக்குள் தொடர்புகொள்வார். நேரடி கன்சோல் அல்லது 1990 ஹாட்லைன் வழியாக கண்காணிக்கவும்.'
  }
};

ta.reporting.nonEmergency = {
  title: 'அவசரமற்ற ஆதரவு',
  description:
    'பாதுகாப்பு அபாயங்கள், துறைமுக பராமரிப்பு, சமூக கவலைகள், வழிசெலுத்தும் தடைகள் போன்றவற்றை முன்கூட்டியே திட்டமிடுவதற்கு அறிவிக்கவும்.',
  supportText: 'ஒதுக்கப்பட்ட ஒருங்கிணைப்பு மேசை 24 பணிநேரத்திற்குள் பதில் வழங்கும்.',
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
    acknowledgement: 'கேஸ் பதிவு செய்யப்பட்டது. 24 பணிநேரத்துக்குள் செயல் திட்டம் பகிரப்படும்.'
  }
};

ta.reporting.environmental = {
  title: 'சுற்றுச்சூழல் பாதிப்பு அறிக்கை',
  description:
    'மாசுபாடு, பவள பாதிப்பு, மீன் மரணம் அல்லது சட்டவிரோத அகழ்வு போன்றவற்றை உடனடியாக பதிவுசெய்து அமலாக்க, மீட்பு அணிகளுடன் ஒருங்கிணைக்கவும்.',
  hotline: 'சுற்றுச்சூழல் கடமை அதிகாரி: +94 11 452 7777',
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
    supportText: 'CEA, கடற்கரை பாதுகாப்பு துறை, கடல் காவல்துறை ஆகியவற்றுக்கு தன்னியக்க அறிவிப்பு அனுப்பப்படும்.',
    submitLabel: 'சுற்றுச்சூழல் பாதிப்பை அனுப்புக',
    acknowledgement:
      'சுற்றுச்சூழல் விரைவு பதில் குழு மற்றும் கூட்டாளர் அமைப்புகள் (CEA, Coast Conservation, Marine Police) எச்சரிக்கப்பட்டன.'
  }
};


ta.alerts.title = 'நேரடி எச்சரிக்கை';
ta.alerts.viewArchiveLabel = 'பழைய எச்சரிக்கைகள்';
ta.alerts.items = [
  {
    ...ta.alerts.items[0],
    title: 'சுனாமி எச்சரிக்கை – தெற்கு கடற்கரை',
    description:
      'தொண்டா புள்ளி பூயில் 10 செ.மீ. கடல் மட்ட மாற்றம். அனைத்து மீனவர் படகுகளும் துறைமுகத்தில் தங்க உத்தரவு; சைரன் சோதனை நடைபெறுகிறது.',
    location: 'மாத்தறை, அம்பாந்தோட்டை, காலி',
    timestamp: '2 நிமிடங்களுக்கு முன் புதுப்பிக்கப்பட்டது',
    affectedAreas: ['தொண்டா', 'அம்பாந்தோட்டை', 'தங்காலை']
  },
  {
    ...ta.alerts.items[1],
    title: 'எண்ணெய் மேல் அடுக்கு கண்காணிப்பு – திருகோணமலை',
    description:
      'உபகிரக/ட்ரோன் காட்சிகள் 1.5 கி.மீ. மேல் அடுக்கை உறுதிசெய்கின்றன. கடற்படை ஆதரவுடன் தடுப்பு அணிகள் அமைக்கப்படுகின்றன.',
    location: 'திருகோணமலை துறைமுகம்',
    timestamp: '14 நிமிடங்களுக்கு முன் புதுப்பிக்கப்பட்டது',
    affectedAreas: ['திருகோணமலை வளைகுடா', 'குச்சவெளி']
  },
  {
    ...ta.alerts.items[2],
    title: 'சமூக வெளியேற்ற பயிற்சி',
    description:
      'மோரட்டுவ கடற்கரை GN பிரிவுகளுக்கான சுனாமி வெளியேற்ற பயிற்சி 15:00 மணிக்கு. தமிழ் மற்றும் சிங்கள அறிவிப்புகள் ஒலிபரப்பு செயலில்.',
    location: 'மோரட்டுவ கடற்கரை',
    timestamp: '45 நிமிடங்களுக்கு முன் புதுப்பிக்கப்பட்டது',
    affectedAreas: ['அங்குலான', 'கொரளவெல்லா']
  }
];


ta.systemStatus.systems[0].name = 'தேசிய சுனாமி பூய்கள்';
ta.systemStatus.systems[0].description = 'ஆழ்கடல் உணரிகள் பேரிடர் மேலாண்மை மையத்திற்கு தரவு அனுப்புகின்றன.';
ta.systemStatus.systems[1] = {
  ...ta.systemStatus.systems[1],
  name: 'துறைமுக கட்டளை வானொலி வலை',
  description: 'VHF/LTE கலப்பு வலைப் பாதுகாப்பான துறைமுகத் தொடர்புக்கு.',
  statusMessage: 'காலி மீளளிப்பு கருவி ஆதரவு மின்சாரத்தில் இயங்குகிறது.'
};
ta.systemStatus.systems[2].name = 'அவசர டாஷ்போர்டு & பகுப்பாய்வு';
ta.systemStatus.systems[3] = {
  ...ta.systemStatus.systems[3],
  name: 'சமூக சைரன் வலைப்பின்னல்',
  description: 'சூரிய சக்தியால் இயங்கும் கடலோர சைரன் 215.',
  statusMessage: 'களுத்துறை தெற்கு சைரன் பேட்டரி மாற்றம் இன்று இரவில்.'
};


ta.contacts.title = 'கூட்டு செயல்பாட்டு தொடர்புகள்';
ta.contacts.description =
  'இருமொழி பதிலளிப்பவர்களுக்கு இணைக்கப்பட்ட நேரடி எண்கள். அனைத்து வழிகளும் செயற்கைக்கோள் பாதுகாப்புடன்.';
ta.contacts.items[0].name = 'தேசிய அவசர செயல்பாட்டு மையம்';
ta.contacts.items[0].description = 'முக்கிய 24/7 ஒருங்கிணைப்பு மேசை.';
ta.contacts.items[1].name = 'கடற்படை கடல் மீட்பு ஒருங்கிணைப்பு';
ta.contacts.items[1].description = 'அவசர செய்திகள், SAR பணிகள், துறைமுக வெளியேற்றம்.';
ta.contacts.items[2].name = 'சுற்றுச்சூழல் விரைவு பதில் பிரிவு';
ta.contacts.items[2].description = 'எண்ணெய் வீச்சு, ரசாயன கசிவு, பவள/மாங்க்ரோவ் சேதம்.';


ta.preparedness.title = 'தயார்நிலை & பயிற்சி நூலகம்';
ta.preparedness.description =
  'SOP, சரிபார்ப்பு பட்டியல், சமூக பயிற்சி டெம்ப்ளேட் உள்ளிட்ட வளங்கள் காலாண்டு ஆய்வு செய்யப்பட்டவை.';
ta.preparedness.items[0].title = 'கடற்கரை வெளியேற்ற களவழிகாட்டி';
ta.preparedness.items[0].description = 'GN அதிகாரிகள், துறைமுக நிர்வாகிகள் பயன்படுத்த வேண்டிய படிப்படியான கையேடு.';
ta.preparedness.items[1].title = 'சுற்றுச்சூழல் விரைவு மதிப்பீடு பட்டியல்';
ta.preparedness.items[2].title = 'சமூக சைரன் பயிற்சி வீடியோ';
ta.preparedness.items[2].description = '10 நிமிட இருமொழி பயிற்சி வழிகாட்டி.';


ta.situationRoom.title = 'நிலை அறை & பகுப்பாய்வு';
ta.situationRoom.description =
  'அங்கீகரிக்கப்பட்ட அதிகாரிகள் முழு கட்டளை டாஷ்போர்டை துவக்கி, இருமொழி அறிவிப்புகளை நிர்வகித்து, நிகழ்வுக்குப் பிந்தைய பகுப்பாய்வை பதிவிறக்கலாம்.';
ta.situationRoom.actions[0].label = 'கட்டளை டாஷ்போர்டைத் துவக்கவும்';
ta.situationRoom.actions[1].label = 'எச்சரிக்கை மொழிபெயர்ப்புகளை நிர்வகிக்கவும்';
ta.situationRoom.actions[2].label = 'நிகழ்வுக்குப் பிந்தைய அறிக்கைகள்';


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
