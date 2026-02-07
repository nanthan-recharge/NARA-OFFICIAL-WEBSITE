import en from './content.en.js';

const ta = JSON.parse(JSON.stringify(en));

ta.meta = {
  title: 'பிராந்திய தாக்கச் சங்கிலி - நாரா டிஜிட்டல் ஓசன்',
  description:
    'ஸ்ரீலங்கா முழுவதும் பரந்துள்ள நாரா ஆய்வு மையங்கள் கடல் அறிவியல், சமூக கூட்டணி, நேரடி தரவு ஆகியவற்றை ஒருங்கிணைத்து கடற்கரை சமூகங்களின் நிலைத்தன்மையை உயர்த்துகின்றன என்பதை அனுபவிக்கவும்.',
  keywords:
    'நாரா பிராந்திய மையங்கள், இலங்கை கடல் ஆய்வு, கடற்கரை மறு எழுச்சி, சமூக தாக்கம், கடல் நுண்ணறிவு'
};

ta.hero = {
  badge: 'பிராந்திய வலைப்பின்னல்',
  subheading: 'தீவு முழுவதும் தாக்கம்',
  title: 'கடல் அறிவியலால் இணைக்கும்',
  highlight: 'உள்ளூர் சமூகங்கள்',
  description:
    'ஸ்ரீலங்காவின் ஆறு பிராந்திய மையங்கள் நடப்பு கடல் தரவு, மாலுமி ஆதரவு, தொழில்துறை இணைப்பு ஆகியவற்றை ஒன்றிணைத்து எந்நாளும் பாதுகாப்பையும் வாழ்வாதாரத்தையும் வலுப்படுத்துகின்றன. முன் எச்சரிக்கை முதல் மறுசீரமைப்பு வரை, ஒவ்வொரு மையமும் அறிவியலை நாள் தவறாது செயலாக்குகிறது.',
  primaryCta: { label: 'மையங்களை ஆராயுங்கள்', icon: 'Map' },
  secondaryCta: { label: 'தாக்கக் கதைகள்', icon: 'Heart' },
  leftStat: { value: '61', label: 'சேவை செய்யும் சமூகங்கள்' },
  rightStat: { value: '100%', label: 'பாதுகாப்பு சாதனை' },
  image: en.hero.image
};

ta.navigation = [
  { id: 'overview', label: 'வலைப்பின்னல் கண்ணோட்டம்', icon: 'Globe' },
  { id: 'map', label: 'பிராந்திய மையங்கள்', icon: 'Map' },
  { id: 'stories', label: 'தாக்கக் கதைகள்', icon: 'Heart' },
  { id: 'dashboard', label: 'தரவு டாஷ்போர்டு', icon: 'BarChart3' },
  { id: 'community', label: 'சமூக மையம்', icon: 'Users' }
];

ta.overview.achievementsTitle = 'சங்கிலியின் முக்கிய வெற்றிகள்';
ta.overview.highlightLabels = {
  specialization: 'சிறப்பு துறை',
  keyProject: 'முக்கிய முயற்சி',
  communityImpact: 'சமூக தாக்கம்',
  staff: 'பணியாளர்கள்',
  projects: 'திட்டங்கள்',
  communities: 'சமுதாயங்கள்'
};

ta.overview.stats = ta.overview.stats.map((stat, index) => {
  const translations = [
    {
      label: 'ஆய்வு மையங்கள்',
      description: 'நாட்டின் முக்கிய கடற்கரைப் பகுதிகளில் நிலைநிறுத்தப்பட்டவை'
    },
    {
      label: 'ஆய்வு நிபுணர்கள்',
      description: 'கடல் விஞ்ஞானிகள், தொழில்நுட்ப வல்லுநர்கள், கள அலுவலர்கள்'
    },
    {
      label: 'கூட்டு சமூகங்கள்',
      description: 'கடற்கரை கிராமங்கள் மற்றும் மீனவர் கூட்டுறவுகள்'
    },
    {
      label: 'செயலில் உள்ள திட்டங்கள்',
      description: 'காலநிலை, வள மேலாண்மை, பாதுகாப்பு முயற்சிகள்'
    }
  ];
  return { ...stat, ...translations[index] };
});

ta.overview.achievements = ta.overview.achievements.map((achievement, index) => {
  const translations = [
    {
      title: 'சூறாவளிக் காலத்தில் உயிரிழப்பு ஏதுமில்லை',
      description:
        '2023 சூறாவளிக் காலத்தில் ஒருங்கிணைந்த முன்னறிவிப்பும் துறைமுக ஒத்துழைப்பும் 2,000க்கு மேற்பட்ட படகுகளை பாதுகாப்பாகத் திரும்பச் செய்தது.',
      impact: '100% பாதுகாப்பு சாதனை'
    },
    {
      title: 'பவளப்பாறை மீட்பு திட்டம்',
      description:
        'காலி மற்றும் மட்டக்களப்பு சமூக நாற்றங்காலங்கள் 15 ஹெக்டேரில் பவள காடுகளை 78% உயிர்த் துறப்புடன் மீளப்பெற்றன.',
      impact: '15 ஹெக்டேர்கள் மீட்பு'
    },
    {
      title: 'திடமான மீன்பிடி முயற்சி',
      description:
        '500க்கும் மேற்பட்ட பலநாள் படகு கப்டன்கள் தேர்ந்தெடுக்கப்பட்ட கருவி பயிற்சியால் பிடிப்பின் மதிப்பு 25% உயர்ந்தது, இனப்பெருக்கப் பகுதிகள் காக்கப்படுகின்றன.',
      impact: '25% வளர்ச்சி'
    },
    {
      title: 'கடல் கல்வி பரப்பு',
      description:
        'மொபைல் ஆய்வுகூடங்கள், STEM முகாம்கள், ஆசிரியர் பட்டறைகள் மூலம் 2023 இல் 5,000க்கும் மேற்பட்ட மாணவர்களை சென்றடைந்தது.',
      impact: '5,000+ மாணவர்கள் ஊக்கமடைந்தனர்'
    }
  ];
  return { ...achievement, ...translations[index] };
});

ta.overview.highlights = ta.overview.highlights.map((highlight, index) => {
  const translations = [
    {
      region: 'மேற்கு மாகாணம்',
      center: 'கொழும்பு கடல் ஆய்வு மையம்',
      specialization: 'நகரக் கடற்கரை இயக்கவியல் மற்றும் துறைமுக சுகாதாரம்',
      keyProject: 'போர்ட் சிட்டி சுற்றுச்சூழல் கண்காணிப்பு',
      communityImpact: 'பதினிரண்டு மீனவர் கூட்டுறவுகளுக்கு மாசு எச்சரிப்பு மற்றும் பாதுகாப்பான வழிநடத்தல் ஆலோசனைகளை வழங்குகிறது.'
    },
    {
      region: 'தெற்கு மாகாணம்',
      center: 'காலி கடல் அவதான மையம்',
      specialization: 'பவளப் பாதுகாப்பும் பொறுப்பான இக்கோ சுற்றுலாவும்',
      keyProject: 'ஹிக்கடைவு பவளப் ப aproசாரம் கூட்டணி',
      communityImpact: 'பொது ஜலத்தர தரவரிசைகள் பயணத் துறைக்கு நம்பிக்கையை மீட்க உதவுகிறது; 1,200 குடும்பங்களின் வாழ்வாதாரத்தை காப்பது.'
    },
    {
      region: 'கிழக்கு மாகாணம்',
      center: 'திருகோணமலை ஆழ்கடல் நிலையம்',
      specialization: 'ஆழ்கடல் ஆராய்ச்சி மற்றும் கடற்படை ஒத்துழைப்பு',
      keyProject: 'திமிங்கில இடம்பெயர்ச்சி மற்றும் கப்பல் வழிப் பாதுகாப்பு',
      communityImpact: 'சரியான வழிநடத்தல் ஆலோசனைகள் மூலம் கப்பல்-திமிங்கில மோதல்கள் 95% குறைந்தன.'
    }
  ];
  return { ...highlight, ...translations[index] };
});

const mapTranslations = [
  {
    name: 'கொழும்பு கடல் ஆய்வு மையம்',
    location: 'கொழும்பு',
    specialization: 'நகரக் கடற்கரை இயக்கவியல்',
    description:
      'துறைமுக நீர் தரம், புயல் அலை மாதிரி மற்றும் தட்பநிலை தாளமைப்படுத்தலை முன்னின்று வழிநடத்துகிறது.',
    keyProjects: ['துறைமுக நீர் கண்காணிப்பு', 'நகர மழை ஓட்டம் வரைபடம்', 'கடற்கரை சேதமடைதல் வழிகாட்டி']
  },
  {
    name: 'காலி கடல் அவதான மையம்',
    location: 'காலி',
    specialization: 'பவளப் பருவ அமைப்புகள்',
    description:
      'பவளப்பாறைகளைப் பாதுகாப்பது, சுற்றுலா தாங்கும் திறனை கண்காணிப்பது மற்றும் டைவ் அமைப்புகளுடன் சேர்ந்து சூழல் தரநிலைகளை வடிவமைப்பது.',
    keyProjects: ['பவள நாற்றங்கால வலை', 'பவள சுகாதார நேரடி பலகை', 'இக்கோ சுற்றுலா தரநிலை கருவிப்பெட்டி']
  },
  {
    name: 'திருகோணமலை ஆழ்கடல் நிலையம்',
    location: 'திருகோணமலை',
    specialization: 'ஆழ்கடல் ஆய்வு',
    description:
      'அலை ஒலிப்பரிசோதனை, கடற்படை தகவல் மற்றும் கடல் விலங்கு கண்காணிப்பை ஒருங்கிணைத்து கடல் குருதிப் பாதைகளை பாதுகாக்கிறது.',
    keyProjects: ['திமிங்கில இடம்பெயர்ச்சி எச்சரிக்கை', 'ஆழ்கடல் ஓட்ட நுண்ணறிவு', 'கடற்படை தரவு கூட்டணி']
  },
  {
    name: 'யாழ்ப்பாண தீபகற்ப மையம்',
    location: 'யாழ்ப்பாணம்',
    specialization: 'குளநீர் மற்றும் உவர்நீர் அமைப்புகள்',
    description:
      'குள மீட்பு, உவர்நீர் மீன்வள மாதிரி மற்றும் காலநிலை-நிலைத்தொழில் வாழ்வாதாரம் ஆகியவற்றை முன்னின்று செய்கிறது.',
    keyProjects: ['குள உயிர்ப்புனர்வு ஆய்வகங்கள்', 'கடற்கரை நண்டு மேலாண்மை திட்டம்', 'சமூக அறிவு காப்பகம்']
  },
  {
    name: 'மட்டக்களப்பு கடற்கரை ஆய்வகம்',
    location: 'மட்டக்களப்பு',
    specialization: 'மாங்குரோவ் பாதுகாப்பு',
    description:
      'மாங்குரோவ் மீளுருவாக்கம், நீல கார்பன் அளவீடுகள் மற்றும் கடற்கரை பாதுகாப்பு நடவடிக்கைகளை சமூகங்களுடன் செயல்படுத்துகிறது.',
    keyProjects: ['மாங்குரோவ் காவலர் குழுக்கள்', 'நீல கார்பன் ஆய்வகம்', 'கடற்கரை பாதுகாப்பு செயல்திட்டங்கள்']
  },
  {
    name: 'அம்பாந்தோட்டை கடல் மையம்',
    location: 'அம்பாந்தோட்டை',
    specialization: 'கடற்படை உள்கட்டமைப்பு',
    description:
      'ஸ்மார்ட் துறைமுக செயல்பாடுகள், பாலஸ்ட் நீர் மதிப்பாய்வு மற்றும் தெற்கு கடல்சுற்று வணிகப் போக்குவரத்து பகுப்பாய்வை ஆதரிக்கிறது.',
    keyProjects: ['துறைமுக சூழல் கட்டுப்பாட்டு மையம்', 'ஸ்மார்ட் வழிநடத்தல் அறிவுறுத்தல்கள்', 'பாலஸ்ட் நீர் இணக்கம் மையம்']
  }
];

ta.map.header = {
  title: 'பிராந்திய ஆய்வு மையங்கள்',
  subtitle: 'நாராவின் தேசிய பரவலைக் காட்டும் தொடர்பாடும் வரைபடம்'
};
ta.map.legend = { active: 'செயலில் உள்ள மையங்கள்', selected: 'தேர்ந்தவை' };
ta.map.legendTotals = { staff: 'பணியாளர்கள்', projects: 'திட்டங்கள்', communities: 'சமுதாயங்கள்' };
ta.map.emptyState = {
  title: 'ஒரு ஆய்வு மையத்தைத் தேர்ந்தெடுக்கவும்',
  description: 'எங்கள் பிராந்திய மையங்கள் பற்றிய விரிவான தகவல்களைப் பார்க்க ஒரு குறியைத் தொட்டு பாருங்கள்.'
};
ta.map.quickStats = {
  title: 'வலைப்பின்னல் விவரம்',
  items: [
    { label: 'முழுமையான செல்லுபடியாக்கம்', value: 'தீவு முழுவதும்' },
    { label: 'ஆய்வு துறைகள்', value: '6 சிறப்பு துறைகள்' },
    { label: 'சமூக அணுகல்', value: '61 கிராமங்கள்' }
  ]
};
ta.map.details = {
  locationLabel: 'இடம்',
  staffLabel: 'பணியாளர்கள்',
  projectsLabel: 'திட்டங்கள்',
  communitiesLabel: 'சமுதாயங்கள்',
  keyProjectsTitle: 'முக்கிய திட்டங்கள்'
};

ta.map.regions = ta.map.regions.map((region, index) => ({
  ...region,
  ...mapTranslations[index]
}));

ta.stories.header = {
  title: 'உள்ளூர் தாக்கக் கதைகள்',
  subtitle: 'நாராவின் பணிகள் கடற்கரை சமூகங்களை எவ்வாறு காப்பாற்றுகின்றன'
};
ta.stories.categories = [
  { id: 'all', label: 'அனைத்து கதைகள்', icon: 'Globe' },
  { id: 'fishing', label: 'மீனவர் சமூகங்கள்', icon: 'Fish' },
  { id: 'tourism', label: 'சுற்றுலா', icon: 'Camera' },
  { id: 'conservation', label: 'பாதுகாப்பு', icon: 'Leaf' },
  { id: 'education', label: 'கல்வி', icon: 'BookOpen' }
];

const taStoryTranslations = [
  {
    title: 'முன்னறிவிப்பு நெகோம்போ மீனவர் படையை காப்பாற்றியது',
    impact: 'பெருவெள்ளக் காலத்தில் உயிரிழப்பு இல்லை',
    description:
      'SMS, VHF மற்றும் சமூகத் தூதுவர்கள் இணைந்து 48 மணி நேர பாதுகாப்புச் சாளரத்தை வழங்கி 200க்கும் மேற்பட்ட படகுகளைப் புயலுக்கு முன் துறைமுகத்துக்கு திரும்பச் செய்தன.',
    metrics: [
      { label: 'காத்து காக்கப்பட்ட படகுகள்', value: '200' },
      { label: 'பாதுகாப்பான உயிர்கள்', value: '800' },
      { label: 'பாதுகாப்பான சொத்து மதிப்பு', value: 'Rs. 50M' }
    ],
    testimonial: {
      quote:
        'வானம் இருளதற்கு முன்பே எச்சரிக்கை வந்தது. வலைகளை அடுக்கி முன்கூட்டியே திரும்பினோம்; ஒவ்வொரு கப்பலாளனும் வீட்டை அடைந்தான்.',
      author: 'சுனில் பெரேரா',
      role: 'நெகோம்போ மீனவர் கூட்டுறவு தலைவர்'
    }
  },
  {
    title: 'நீர்தர பலகை ஹிக்கடைவு சுற்றுலாவை மீட்டது',
    impact: 'சுற்றுலா முன்பதிவுகள் 30% உயர்ந்தது',
    description:
      'பவள ஆரோக்கியம், தண்ணீர் வெளிச்சம் மற்றும் பயணத் தாங்குதிறன் குறித்த தினசரி புதுப்பிப்புகள் பொறுப்பு அட்டவணையையும் பயணிகளின் நம்பிக்கையையும் உறுதி செய்கின்றன.',
    metrics: [
      { label: 'சுற்றுலா உயர்வு', value: '30%' },
      { label: 'நீர்தர் மதிப்பெண்', value: '95/100' },
      { label: 'பவள மூடிய விகிதம்', value: '78%' }
    ],
    testimonial: {
      quote:
        'மூழ்குவதற்கு முன் வாடிக்கையாளர்கள் பலகையைப் பார்கின்றனர். வெளிப்படைத்தன்மை எங்கள் வணிகத்தையும் பவளத்தையும் ஆரோக்கியமாக வைத்திருக்கிறது.',
      author: 'சமிந்தா சில்வா',
      role: 'டைவு மைய உரிமையாளர்'
    }
  },
  {
    title: 'மாங்குரோவ் காவலர்கள் மட்டக்களப்பை பாதுகாக்கின்றனர்',
    impact: 'கடற்கரை மாசு 85% குறைந்தது',
    description:
      'சமூக பாதுகாவலர்கள் 10,000 க்கும் மேற்பட்ட மாங்குரோவுகளை நடவு செய்து, பாரம்பரியம் மற்றும் நாரா கண்காணிப்பை இணைத்து ஆற்று வளங்களை உயிர்ப்பித்தனர்.',
    metrics: [
      { label: 'பாதுகாப்பான குடும்பங்கள்', value: '500' },
      { label: 'நடவப்பட்ட மரங்கள்', value: '10,000' },
      { label: 'அணைப்பு குறைவு', value: '85%' }
    ],
    testimonial: {
      quote:
        'இப்போது கரை உறுதியாக உள்ளது; நண்டு மீண்டும் வந்துவிட்டன. அறிவியலும் பாரம்பரியமும் எங்கள் குழந்தைகளுக்காக சேர்ந்து செய்கின்றன.',
      author: 'கமலா தேவி',
      role: 'கலுத்தவளை சமூக தலைவர்'
    }
  },
  {
    title: 'வடக்கு மாணவர்களை கடல் ஆய்வு ஊக்குவிக்கிறது',
    impact: 'கடல் அறிவியலில் சேர்க்கை 40% அதிகரிப்பு',
    description:
      'மாணவர்களின் ஆய்வுகள், VR பவள அனுபவங்கள், தொழில் வழிகாட்டுதல் ஆகியவை புதிய கனவுகளை இலக்காகியுள்ளன; சிறுமிகள் உயர்கல்வியைத் தேர்வு செய்கின்றனர்.',
    metrics: [
      { label: 'அணைந்த மாணவர்கள்', value: '1,000' },
      { label: 'பார்வையிட்ட பள்ளிகள்', value: '25' },
      { label: 'STEM சேர்க்கை', value: '+40%' }
    ],
    testimonial: {
      quote:
        'என் மகள் இப்போது அலை தினசரியை எழுதுகிறார் மற்றும் கடல் அறிவியலாளராக வேண்டும் என்று கனவுகாண்கிறார். இந்த லேப் சமுத்திரமே வகுப்பறை என்பதை காட்டியது.',
      author: 'ரஜேஸ்வரி செல்லவன்',
      role: 'பெற்றோர் மற்றும் பள்ளி விருப்பத்துணையாளர்'
    }
  }
];

ta.stories.stories = ta.stories.stories.map((story, index) => {
  const translation = taStoryTranslations[index];
  return {
    ...story,
    title: translation.title,
    impact: translation.impact,
    description: translation.description,
    metrics: story.metrics.map((metric, idx) => ({
      ...metric,
      label: translation.metrics[idx].label,
      value: translation.metrics[idx].value
    })),
    testimonial: {
      ...story.testimonial,
      quote: translation.testimonial.quote,
      author: translation.testimonial.author,
      role: translation.testimonial.role
    }
  };
});

ta.stories.cta = {
  title: 'உங்கள் கதையைப் பகிருங்கள்',
  description: 'நாரா பணிகள் உங்கள் சமூகத்தை மாற்றியுள்ளதா? உங்கள் அனுபவத்தை நாங்கள் கேட்க விரும்புகிறோம்.',
  primary: { label: 'உங்கள் கதையை சமர்ப்பிக்கவும்', icon: 'MessageCircle' },
  secondary: { label: 'சமூக மன்றத்தில் சேருங்கள்', icon: 'Users' }
};

ta.dashboard.header = {
  title: 'பிராந்திய தரவு டாஷ்போர்ட்',
  subtitle: 'நாராவின் ஆராய்ச்சி வலையமைப்பின் நேரடி கண்காணிப்பு'
};

ta.dashboard.regionOptions = [
  { id: 'all', name: 'அனைத்து மண்டலங்கள்', color: '#003366' },
  { id: 'colombo', name: 'கொழும்பு', color: '#1E40AF' },
  { id: 'galle', name: 'காலி', color: '#40E0D0' },
  { id: 'trincomalee', name: 'திருகோணமலை', color: '#FF6B35' },
  { id: 'jaffna', name: 'யாழ்ப்பாணம்', color: '#059669' },
  { id: 'batticaloa', name: 'மட்டக்களப்பு', color: '#D97706' },
  { id: 'hambantota', name: 'அம்பாந்தோட்டை', color: '#DC2626' }
];

ta.dashboard.timeRanges = [
  { id: '24h', name: '24 மணி' },
  { id: '7d', name: '7 நாள்' },
  { id: '30d', name: '30 நாள்' },
  { id: '90d', name: '90 நாள்' }
];

ta.dashboard.alerts.items = ta.dashboard.alerts.items.map((alert, index) => {
  const translations = [
    { title: 'காலநிலை எச்சரிக்கைகள்', description: 'வலுவான காற்று எச்சரிக்கைகள் செயலிலுண்டு' },
    { title: 'கடல் உயிர் எச்சரிக்கை', description: 'திமிங்கில இடம்பெயர்வு நடைபெறுகிறது' },
    { title: 'நீர்தர கண்காணிப்பு', description: 'அல்கே இயங்குதல் கண்காணிக்கப்படுகிறது' },
    { title: 'பாதுகாப்பு அறிவிப்புகள்', description: 'அனைத்தும் இயல்பில்' }
  ];
  return { ...alert, ...translations[index] };
});

ta.dashboard.weather.title = 'தற்போதைய வானிலை நிபந்தனைகள்';
ta.dashboard.weather.updated = '5 நிமிடங்களுக்கு முன் புதுப்பிக்கப்பட்டது';
ta.dashboard.weather.labels = {
  temperature: 'வெப்பநிலை',
  humidity: 'ஈரப்பதம்',
  wind: 'காற்று வேகம் (கி.மீ./மணி)',
  waves: 'அலை உயரம் (மீ)'
};

ta.dashboard.fishing.title = 'மீன்பிடி நிபந்தனைகள் (24 மணி)';
ta.dashboard.fishing.legend = {
  excellent: 'மிகச் சிறந்தது',
  good: 'சிறந்தது',
  fair: 'மிதமானது',
  poor: 'பலவீனமானது'
};

ta.dashboard.marineLife.title = 'கடல் உயிரின பார்வைகள் (7 நாள்)';
ta.dashboard.marineLife.data = ta.dashboard.marineLife.data.map((entry) => {
  const mapping = {
    Dolphins: 'டால்பின்',
    'Sea turtles': 'ஆமை',
    Whales: 'திமிங்கலம்',
    Sharks: 'சுறா',
    Rays: 'தட்டைகள்'
  };
  return { ...entry, species: mapping[entry.species] };
});

ta.dashboard.waterQuality.title = 'நீர்தர போக்குகள்';
ta.dashboard.waterQuality.legend = {
  ph: 'pH நிலை',
  oxygen: 'கரைந்த ஆக்சிஜன்',
  turbidity: 'தெளிவு குறைவு',
  temperature: 'வெப்பநிலை'
};

ta.dashboard.export = {
  title: 'பிராந்திய தரவை அணுகுங்கள்',
  description: 'தரவு தொகுப்புகளைப் பதிவிறக்கவும் அல்லது நேரடி API வழியாக ஒருங்கிணைக்கவும்.',
  actions: {
    export: { label: 'தரவை ஏற்றுமதி செய்யவும்', icon: 'Download' },
    api: { label: 'API அணுகல்', icon: 'Code' }
  }
};

ta.community.header = {
  title: 'சமூக ஈடுபாடு',
  description: 'நாராவின் ஆய்வு சமூகத்துடன் இணைந்து ஒத்துழையுங்கள்',
  activeMembers: '1,247 செயலில் உள்ள உறுப்பினர்கள்'
};

ta.community.tabs = [
  { id: 'forums', label: 'சமூக உரையாடல்கள்', icon: 'MessageSquare' },
  { id: 'citizen-science', label: 'குடிமக்கள் அறிவியல்', icon: 'Search' },
  { id: 'alerts', label: 'உள்ளூர் எச்சரிக்கைகள்', icon: 'Bell' },
  { id: 'events', label: 'நிகழ்ச்சிகள் & பட்டறைகள்', icon: 'Calendar' }
];

ta.community.forums.actions = {
  newTopic: 'புதிய தலைப்பு',
  search: 'வலைவாரத்தைத் தேடுங்கள்',
  sortLabel: 'வரிசைப்படுத்து:',
  latest: 'சமீபத்திய செயற்பாடு'
};

ta.community.forums.topics = ta.community.forums.topics.map((topic, index) => {
  const translations = [
    {
      title: 'நெகோம்போ கடலில் டால்பின்களின் வினோத நடத்தை',
      category: 'கடல் உயிர்',
      statusLabel: 'செயலில்',
      excerpt: 'இந்த வாரம் டால்பின்கள் கரைக்கு அருகில் வந்ததை கவனித்தீர்களா? அவை வேறு மீன் கூட்டத்தைத் தொடர்ந்து வருகிறது போல.'
    },
    {
      title: 'மழைக்குப் பின் நீர்தர மாற்றங்கள்',
      category: 'நீர்தரம்',
      statusLabel: 'நிபுணர் பதில்',
      excerpt: 'எங்கள் சென்சார்கள் மேல் அளவிலான சேற்றை பதிவுசெய்தன. லகூன் சமூகங்களுக்கும் செயலாக்க மையங்களுக்கும் முன்னெச்சரிக்கை வழிமுறைகள்.'
    },
    {
      title: 'ஹிக்கடைவு பவள வெண்மைப்படுதல் அறிக்கைகள்',
      category: 'பாதுகாப்பு',
      statusLabel: 'அவசரம்',
      excerpt: 'ஆராய்ச்சி பகுதி 3–5 இல் வெண்மைப்படுதல் அதிகரித்து உள்ளது. உடனடி சரிபார்ப்பு மூழ்கல்கள் மற்றும் நடவடிக்கை ஆலோசனைகள் தேவை.'
    },
    {
      title: 'பாரம்பரிய மீன்பிடி காலண்டர் vs நவீன கணிப்புகள்',
      category: 'பாரம்பரிய அறிவு',
      statusLabel: 'பிரபலமானது',
      excerpt: 'எங்கள் முன்னோர் அனுபவங்களையும் நாரா அலை-சந்திர தரவையும் ஒப்பிடுகையில் 흥미로운 ஒற்றுமைகள் காண்கிறோம்.'
    }
  ];
  return { ...topic, ...translations[index] };
});

ta.community.citizenScience.intro = {
  title: 'குடிமக்கள் அறிவியலாளராகுங்கள்',
  description: 'உங்கள் கடற்கரையிலிருந்து கண்காணிப்புகள், புகைப்படங்கள், நீர் மாதிரிகள் வழங்குங்கள். ஒவ்வொரு தரவு புள்ளியும் தேசிய கடல் நுண்ணறிவை பலப்படுத்துகிறது.',
  button: 'பணிக்குழுவில் சேருங்கள்'
};

ta.community.citizenScience.labels = {
  participants: 'பங்கேற்பாளர்கள்',
  dataPoints: 'தரவு பதிவுகள்',
  time: 'நேர ஒதுக்கீடு',
  region: 'பகுதி',
  tools: 'தேவைப்படும் கருவிகள்',
  impact: 'தாக்கம்',
  learnMore: 'மேலும் அறிந்து இணையுங்கள்'
};

ta.community.citizenScience.projects = ta.community.citizenScience.projects.map((project, index) => {
  const translations = [
    {
      title: 'கடற்கரை பிளாஸ்டிக் கண்காணிப்பு',
      description: 'ஒவ்வோர் வாரமும் கடற்கரையில் கிடைக்கும் பிளாஸ்டிக் வகைகள் மற்றும் அளவுகளை பதிவு செய்யுங்கள்.',
      difficultyLabel: 'எளிது',
      region: 'அனைத்து மையங்கள்',
      impact: 'தேசிய பிளாஸ்டிக் குறைப்பு கொள்கையை வடிவமைக்க உதவுகிறது'
    },
    {
      title: 'மீன் மக்கள் தொகை ஆய்வு',
      description: 'மீன் இனங்கள், அளவு மற்றும் பெருமளவு பிடிப்புகள் குறித்து பதிவு செய்யுங்கள்.',
      difficultyLabel: 'மிதமானது',
      region: 'கடற்கரை பகுதிகள்',
      impact: 'நிலைத்த மத்தியிலான மீன்பிடியை ஆதரிக்கிறது'
    },
    {
      title: 'கடல் வெப்பநிலை பதிவு',
      description: 'துறைமுகம் அல்லது படகிலிருந்து தினமும் கடல் மேற்பரப்பு வெப்பநிலையை சமர்ப்பிக்குங்கள்.',
      difficultyLabel: 'எளிது',
      region: 'அனைத்து கடற்கரை பகுதிகள்',
      impact: 'காலநிலை இயக்கப்படும் சூடான போக்குகளை கண்காணிக்கிறது'
    }
  ];
  return { ...project, ...translations[index] };
});

ta.community.citizenScience.observationForm = {
  title: 'விரைவு கண்காணிப்பு அறிக்கை',
  fields: {
    location: {
      label: 'இடம்',
      placeholder: 'எ.கா., நெகோம்போ கடற்கரை, GPS அமைவு'
    },
    category: {
      label: 'வகை',
      placeholder: 'எ.கா., கடல் உயிர், நீர்தரம், வானிலை'
    },
    observation: {
      label: 'கண்காணிப்பு',
      placeholder: 'நீங்கள் கவனித்ததை விவரிக்கவும்...'
    }
  },
  submit: 'அறிக்கையை சமர்ப்பிக்கவும்'
};

ta.community.alerts = {
  title: 'உள்ளூர் எச்சரிக்கைகள் & ஆலோசனைகள்',
  subtitle: 'நாரா பிராந்திய மையங்களிலிருந்து நேரடி புதுப்பிப்புகள்',
  preferences: 'எச்சரிக்கை விருப்பங்கள்',
  labels: { validUntil: 'செல்லுபடியாகும் வரை' },
  alerts: ta.community.alerts.alerts.map((alert, index) => {
    const translations = [
      {
        title: 'பெரும் காற்று எச்சரிக்கை - தெற்குக் கடற்கரை',
        message: 'காற்று வேகம் 45–50 கி.மீ./மணி வரை அதிகரிக்கலாம். சிறிய கப்பல்களுக்கு எச்சரிக்கை.',
        severityLabel: 'அதிகம்'
      },
      {
        title: 'திமிங்கில இடம்பெயர்வு எச்சரிக்கை - கிழக்கு கடல்',
        message: 'திருகோணமலையிலிருந்து 15 கி.மீ. தொலைவில் நீல திமிங்கில கூட்டம் காணப்பட்டது. 500 மீ. பாதுகாப்பு தூரம் வைத்துக்கொள்ளவும்.',
        severityLabel: 'மிதமான'
      },
      {
        title: 'அரைக்குடா அலகீ கண்காணிப்பு - நெகோம்போ லகூன்',
        message: 'அல்கே செயல்பாடு அதிகரித்துள்ளது. பிடிபடும் மீன்களை ஏரேஷன் செய்ய பரிந்துரை.',
        severityLabel: 'குறைந்தது'
      }
    ];
    return { ...alert, ...translations[index] };
  }),
  share: 'எச்சரிக்கையை பகிரவும்',
  stayInformed: {
    title: 'தெரிந்துகொண்டு இருங்கள்',
    description: 'SMS, மின்னஞ்சல் அல்லது push அறிவிப்புகள் மூலம் எச்சரிக்கைகளைப் பெற பதிவு செய்யுங்கள்.',
    primary: { label: 'SMS எச்சரிக்கைகள்' },
    secondary: { label: 'மின்னஞ்சல் எச்சரிக்கைகள்' }
  }
};

ta.community.events = {
  title: 'வரவிருக்கும் நிகழ்ச்சிகள் மற்றும் பட்டறைகள்',
  subtitle: 'நாராவின் சமூக கல்வி முயற்சிகளில் பங்கேற்கவும்',
  calendar: 'முழு நாட்காட்டியைப் பாருங்கள்',
  events: ta.community.events.events.map((event, index) => {
    const translations = [
      {
        typeLabel: 'பட்டறை',
        title: 'கடல் பாதுகாப்பு பட்டறை',
        location: 'காலி கடல் அவதான மையம்',
        audience: 'மீனவர் சமூகங்கள்',
        description: 'கருவி தேர்வு, பவள பேணல், பாதுகாப்பு நடைமுறைகள் குறித்து களபயிற்சி.',
        facilitator: 'டாக்டர் நிமல் சில்வா'
      },
      {
        typeLabel: 'கல்வி நிகழ்வு',
        title: 'பள்ளி கடல் அறிவியல் கண்காட்சி',
        location: 'யாழ்ப்பாண தீபகற்ப மையம்',
        audience: 'மாணவர்கள் மற்றும் ஆசிரியர்கள்',
        description: 'மாணவர் திட்டங்கள், கடல் தொழில் வழிகாட்டுதல் மற்றும் ஆய்வு காட்சி.',
        facilitator: 'நாரா கல்வி குழு'
      },
      {
        typeLabel: 'பயிற்சி',
        title: 'மாங்குரோவ் மறுசீரமைப்பு பயிற்சி',
        location: 'மட்டக்களப்பு கடற்கரை ஆய்வகம்',
        audience: 'சமூக தன்னார்வலர்கள்',
        description: 'மாங்குரோவ் நடவு, கண்காணிப்பு, பராமரிப்பு ஆகியவற்றுக்கான களப்பயிற்சி.',
        facilitator: 'கடற்கரை மறுசீரமைப்பு குழு'
      }
    ];
    const translation = translations[index];
    return {
      ...event,
      typeLabel: translation.typeLabel,
      title: translation.title,
      location: translation.location,
      audience: translation.audience,
      description: translation.description,
      facilitator: translation.facilitator
    };
  }),
  statsLabels: {
    facilitator: 'வழிநடத்துபவர்',
    registration: 'பதிவு நிலை'
  },
  buttons: {
    register: 'இப்போது பதிவு செய்யுங்கள்',
    waitlist: 'நிலைப் பட்டியல்'
  },
  footer: {
    title: 'ஒரு நிகழ்வை நடத்த விருப்பமா?',
    description: 'உங்கள் சமூகத்தில் கடல் அறிவியல் நிகழ்வை நடத்த ஆர்வமா? எங்களுடன் இணைந்து செயல்படலாம்.',
    button: 'நிகழ்வினை முன்மொழியுங்கள்'
  }
};

ta.cta = {
  title: 'எங்கள் பிராந்திய வலையமைப்பில் சேருங்கள்',
  description:
    'நீங்கள் ஆய்வாளர், சமூகத் தலைவர் அல்லது கடலை நேசிப்பவர் எதுவாக இருந்தாலும், நாரா வலையில் உங்களுக்கு இடமுண்டு. அருகிலுள்ள மையத்துடன் இணைந்து நாட்டின் கடற்கரை நம்பிக்கைக் கதையின் ஒரு பகுதியாகுங்கள்.',
  primary: { label: 'உங்கள் அருகிலுள்ள மையத்தைத் தேடுங்கள்', icon: 'MapPin' },
  secondary: { label: 'பிராந்திய அணியுடன் தொடர்புகொள்ளுங்கள்', icon: 'MessageCircle' }
};

ta.footer = {
  name: 'நாரா டிஜிட்டல் ஓசன்',
  description: 'தேசிய நீர்வள ஆய்வு மற்றும் மேம்பாட்டு நிறுவனம் — கடல் நுண்ணறிவால் சமூகங்களை இணைக்கிறது.'
};

export default ta;
