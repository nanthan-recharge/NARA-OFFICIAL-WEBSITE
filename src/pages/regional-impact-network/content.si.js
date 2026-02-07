import en from './content.en.js';

const si = JSON.parse(JSON.stringify(en));

si.meta = {
  title: 'ප්‍රාදේශීය බලපෑම් ජාලය - NARA ඩිජිටල් ඔෂන්',
  description:
    'ශ්‍රී ලංකාව පුරා පැතිරී ඇති NARA ප්‍රාදේශීය පර්යේෂණ මධ්‍යස්ථාන මුහුදු විද්‍යාව, ප්‍රජා හවුල්කාරිත්වය හා තත්‍ය කාලීන දත්ත එකට ගැලපුවෙන් කුලීන් සමුද්‍ර ආරක්ෂාව ශක්තිමත් කරන ආකාරය සොයා බලන්න.',
  keywords:
    'NARA ප්‍රාදේශීය මධ්‍යස්ථාන, ශ්‍රී ලංකා මුහුදු පර්යේෂණය, වෙරළ ප්‍රතිරෝධී හැකියාව, ප්‍රජා බලපෑම්, මුහුදු දත්ත බුද්ධිය'
};

si.hero = {
  badge: 'ප්‍රාදේශීය ජාලය',
  subheading: 'දූපත් පුරා බලපෑම',
  title: 'මුහුදු විද්‍යාව හරහා සම්බන්ධ වන',
  highlight: 'ප්‍රජා ජාලය',
  description:
    'ශ්‍රී ලංකාවේ ප්‍රාදේශීය මට්ටමින් පිහිටි මධ්‍යස්ථාන හයම නාවික සමාජ, වෙළඳ කර්මාන්ත හා ආධාරදායක රජයකාරක යන්ත්‍රණ සමඟ මුහුදු දත්ත එකට ගැලපෙයි. පෙරතැනුම්, ආරක්ෂණාත්මක යාත්‍රික සේවා සහ ආරක්ෂිත ඉදිකිරීම් විසඳුම් ඔස්සේ දුරදක්ෂ විද්‍යාව දෛනික ජීවිතයේ බලගතු වටිනාකමක් බවට පත් කරයි.',
  primaryCta: { label: 'කේන්ද්‍ර බලන්න', icon: 'Map' },
  secondaryCta: { label: 'බලපෑම් කතා', icon: 'Heart' },
  leftStat: { value: '61', label: 'සේවය ලැබූ ප්‍රජා' },
  rightStat: { value: '100%', label: 'ආරක්ෂිත වාර්තාව' },
  image: en.hero.image
};

si.navigation = [
  { id: 'overview', label: 'ජාලය සම්පූර්ණයෙන්', icon: 'Globe' },
  { id: 'map', label: 'ප්‍රාදේශීය මධ්‍යස්ථාන', icon: 'Map' },
  { id: 'stories', label: 'බලපෑම් කතා', icon: 'Heart' },
  { id: 'dashboard', label: 'දත්ත ඩැෂ්බෝඩ්', icon: 'BarChart3' },
  { id: 'community', label: 'ප්‍රජා මධ්‍යස්ථානය', icon: 'Users' }
];

si.overview.achievementsTitle = 'ජාලයේ මීලිගල්';
si.overview.highlightLabels = {
  specialization: 'විශේෂඥතා ප්‍රමාණය',
  keyProject: 'ප්‍රමාණවත් ව්‍යාපෘතිය',
  communityImpact: 'ප්‍රජා බලපෑම',
  staff: 'කාර්ය මණ්ඩලය',
  projects: 'ව්‍යාපෘති',
  communities: 'ප්‍රජාවන්'
};

si.overview.stats = si.overview.stats.map((stat, index) => {
  const translations = [
    {
      label: 'පර්යේෂණ මධ්‍යස්ථාන',
      description: 'ශ්‍රී ලංකාව පුරා रणවලින් පිහිටා ඇත'
    },
    {
      label: 'පර්යේෂණ කාර්ය මණ්ඩලය',
      description: 'මුහුදු විද්‍යාඥයෝ, තාක්ෂණවේදීන් හා ක්ෂේත්‍ර නිලධාරින්'
    },
    {
      label: 'හවුල් ප්‍රජාවන්',
      description: 'වෙරළ ගම්මාන සහ මසුන් වේට්ටු සංගම්'
    },
    {
      label: 'ක්‍රියාත්මක ව්‍යාපෘති',
      description: 'කාලගුණිත හැඟීම්, සම්පත් කළමනාකරණය හා ආරක්ෂාව'
    }
  ];
  return { ...stat, ...translations[index] };
});

si.overview.achievements = si.overview.achievements.map((achievement, index) => {
  const translations = [
    {
      title: 'සුළි කාලයේ ශූන්‍යත් බලාත්මක තුවාල',
      description:
        '2023 සුළි කාලයේදී පණවත් කල සවිකලාප පෙරතැනුම් හා වරායන් අතර සමනුහරුකය නිසා යාත්‍රා 2,000කට අධික සංඛ්‍යාවක් ආරක්ෂා විය.',
      impact: '100% ආරක්ෂිත වාර්තාව'
    },
    {
      title: 'පැලුම් පර්යේෂණ යළි-ජීවත් කිරීමේ වැඩසටහන',
      description:
        'ගාල්ල හා බැතික්කලෝයේ ප්‍රජා නර්සරි වැඩසටහන් හරහා පස්දහසයි හැකට්යයකට අධික පර්යේෂණ වගා 78% ජීවිත ශක්තියෙන් යළි පිළිගත්හ.',
      impact: 'පැලුම් 15 හැක්ටය යළි පිරුණි'
    },
    {
      title: 'ස්ථිර නාවික ආහාර ආරක්ෂණ වැඩසටහන',
      description:
        'බහු දින යාත්‍රා නායකයන් 500කට වැඩි සංඛ්‍යාවකට මෙවලම් තේරීම පිළිබඳ පුහුණුව ලබාදී හැටි වටිනාකම 25%යකින් ඉහළ දැමූ අතර බිජ කඩන තැන් ආරක්ෂා කළේය.',
      impact: 'ඵලදායිතාවය 25%කින් වැඩි විය'
    },
    {
      title: 'මුහුදු අධ්‍යාපන ප්‍රවේණි වැඩසටහන්',
      description:
        ' චලනය කළ හැකි මුහුදු රසායන විද්‍යා කුටියන්, STEM කඳවුරු සහ ගුරු පුහුණු වැඩසටහන් හරහා 5,000කට වැඩි සිසුන්ට 2023 දී ළඟා විය.',
      impact: 'විද්‍යා වේදිකාවට 5,000+ සිසුන් හඳුන්වා දී ඇත'
    }
  ];
  return { ...achievement, ...translations[index] };
});

si.overview.highlights = si.overview.highlights.map((highlight, index) => {
  const translations = [
    {
      region: 'බස්නාහිර පළාත',
      center: 'කොළඹ මුහුදු පර්යේෂණ මධ්‍යස්ථානය',
      specialization: 'නගර වෙරළ ගතිවිධාන සහ වරාය සෞඛ්‍යය',
      keyProject: 'Port City පරිසර නිරීක්ෂණ කේන්ද්‍රය',
      communityImpact: 'දූෂණ අනතුරු සහ ආරක්ෂිත යාත්‍රික මාර්ගෝපදේශ 12 මසුන් සංගම් වෙත සැපයෙයි.'
    },
    {
      region: 'දකුණු පළාත',
      center: 'ගාල්ල මුහුදු නිරීක්ෂණ මධ්‍යස්ථානය',
      specialization: 'පැලුම් සංරක්ෂණය හා ආයෙෂ්ට දක්‍ෂ සංචාරකත්වය',
      keyProject: 'හිකඩුව පැලුම් පිරිහීම ප්‍රතිරෝධ හවුල්කරුවන්',
      communityImpact: 'උපරිම තත්ත්ව පිළිවෙත් නිසා සංචාරක විශ්වාසය යළි ගොඩනැගීය; කම්කරු 1,200කට ආධාර වේ.'
    },
    {
      region: 'නැගෙනහිර පළාත',
      center: 'ත්‍රිකුණාමලයි ගැඹුරු මුහුදු මධ්‍යස්ථානය',
      specialization: 'ගැඹුරු ජල පර්යේෂණය හා නාවික හවුල්දාපත්',
      keyProject: 'තමන්කොටුව නිර්මාණය - තර්ජන සහ නාවික මාර්ග සංරක්ෂණය',
      communityImpact: 'බහාලුම්-ත්‍රිකුණාමල නාවික මාර්ගය තුළ දුම්කොළ-තැන්පතු අනතුරු 95% කින් අඩු කළ ප්‍රබන්ධන දැක්වීම්.'
    }
  ];
  return { ...highlight, ...translations[index] };
});

si.map.header = {
  title: 'ප්‍රාදේශීය පර්යේෂණ මධ්‍යස්ථාන',
  subtitle: 'NARA ජාලය මුළු දූපත පුරා කෙසේ වැඩ කරයිදැයි අන්තර්ක්‍රියාත්මක සිතියමක්'
};
si.map.legend = { active: 'ක්‍රියාකාරී මධ්‍යස්ථාන', selected: 'තෝරාගත්' };
si.map.legendTotals = { staff: 'කාර්ය මණ්ඩලය', projects: 'ව්‍යාපෘති', communities: 'ප්‍රජාවන්' };
si.map.emptyState = {
  title: 'පර්යේෂණ මධ්‍යස්ථානයක් තෝරන්න',
  description: 'අපගේ ප්‍රාදේශීය මධ්‍යස්ථාන පිළිබඳ විස්තර සොයා බැලීමට ස්ථානයක් ක්ලික් කරන්න.'
};
si.map.quickStats = {
  title: 'ජාල තත්ත්වය',
  items: [
    { label: 'ආවරණය', value: 'දූපත් පුරාම' },
    { label: 'පර්යේෂණ ක්ෂේත්‍ර', value: 'විශේෂතා 6' },
    { label: 'ප්‍රජා ළඟා වීම', value: 'ගම්මාන 61' }
  ]
};
si.map.details = {
  locationLabel: 'ස්ථානය',
  staffLabel: 'කාර්ය මණ්ඩලය',
  projectsLabel: 'ව්‍යාපෘති',
  communitiesLabel: 'ප්‍රජාවන්',
  keyProjectsTitle: 'ප්‍රාමුඛ ව්‍යාපෘති'
};

const regionTranslations = [
  {
    name: 'කොළඹ මුහුදු පර්යේෂණ මධ්‍යස්ථානය',
    location: 'කොළඹ',
    specialization: 'නගර වෙරළ ගතිවිධාන',
    description:
      'වරාය ජල ගුණාත්මකභාවය, අතීත වගුරැලි හා කාබනික ඉදිකිරීම් සැලසුම් පිළිබඳ ප්‍රමුඛ පර්යේෂණය.',
    keyProjects: ['වරාය ජල නිරීක්ෂණ මධ්‍යස්ථානය', 'නගර ගලායාමේ බලපෑම්地图', 'වෙරළ කාබනික ලක්ෂණ සිතියම']
  },
  {
    name: 'ගාල්ල මුහුදු නිරීක්ෂණ මධ්‍යස්ථානය',
    location: 'ගාල්ල',
    specialization: 'පැලුම් පාරිසරික පද්ධති',
    description:
      'පැලුම් ආරක්ෂාව, සංචාරක දරන හැකියාව හා ඩයිව් සංවිධායකයින් සමඟ පරිසර සාරධිය ප්‍රමිතීන් නිර්මාණය කිරීම.',
    keyProjects: ['පැලුම් නර්සරි ජාලය', 'ප්‍රාණ සෞඛ්‍ය සජීවී ඩෑෂ්බෝඩ්', 'එකෝ සංචාරක ප්‍රමිතීන් මාර්ගෝපදේශය']
  },
  {
    name: 'ත්‍රිකුණාමලය ගැඹුරු මුහුදු මධ්‍යස්ථානය',
    location: 'ත්‍රිකුණාමලය',
    specialization: 'ගැඹුරු මුහුදු පර්යේෂණය',
    description:
      'ශබ්ද නිරීක්ෂණය, නාවික oceanography සහ මුහුදු සතුන් නිරීක්ෂණය එකට ගොඩවී නිල් මාර්ග ආරක්ෂා කරයි.',
    keyProjects: ['තර්ජන මාරුතුඟරි අනතුරු ඇඟවීම්', 'ගැඹුරු ධාරා නිරීක්ෂණය', 'නාවික දත්ත හවුල්දායානය']
  },
  {
    name: 'යාපනය ද්වීපක මධ්‍යස්ථානය',
    location: 'යාපනය',
    specialization: 'කදවුරු හා කඩලා වගා පද්ධති',
    description:
      'කදවුරු ප්‍රතිසංස්කරණය, ලුණු මිශ්‍ර ජල කෘෂිකර්මාන්ත අදහස් සහ උතුරු ප්‍රජාවන් සඳහා ජීවිකා විකල්ප හඳුන්වා දෙයි.',
    keyProjects: ['කදවුරු ප්‍රතිසංස්කරණ ශාස්ත්‍රීය ශිල්පශාලා', 'ස්ථිර කූඹඩු මසුන් කළමනාකරණය', 'ප්‍රජා දැනුම් දත්ත ගබඩාව']
  },
  {
    name: 'බැතික්කලෝ මුහුදු පර්යේෂණ රසවාහිනිය',
    location: 'බැතික්කලෝය',
    specialization: 'කඹුරු සංරක්ෂණය',
    description:
      'කඹුරු යළි වගා වැඩසටහන්, නිල් කාබන් මැනීම සහ වෙරළ ආරක්ෂක ක්‍රියාමාර්ග ප්‍රජා සමඟ ඇඳේ.',
    keyProjects: ['කඹුරු රැකවරණ අදහස්', 'නිල් කාබන් මැනීමේ රසවාහිනිය', 'වෙරළ ආරක්ෂණ ක්‍රියා සැලසුම්']
  },
  {
    name: 'හම්බන්තොට මුහුදු හබය',
    location: 'හම්බන්තොට',
    specialization: 'නාවික යටිතල පහසුකම්',
    description:
      'ස්මාර්ට් වරාය මෙහෙයුම්, බේලස්ට් ජල පරීක්ෂණ සහ දකුණු මුහුදු මාර්ගයේ යාත්‍රික දත්ත විශ්ලේෂණය.',
    keyProjects: ['වරාය පරිසර විධාන මධ්‍යස්ථානය', 'ස්මාර්ට් යාත්‍රික මාර්ග දැනුම්දීම්', 'බේලස්ට් ජල අනුකූලතාව මධ්‍යස්ථානය']
  }
];

si.map.regions = si.map.regions.map((region, index) => ({
  ...region,
  ...regionTranslations[index]
}));

si.stories.header = {
  title: 'ප්‍රාදේශීය බලපෑම් කතා',
  subtitle: 'NARA පර්යේෂණ කටයුතු වෙරළ ප්‍රජාවන්ට ලබාදෙන වටිනාකම'
};
si.stories.categories = [
  { id: 'all', label: 'සියලු කතා', icon: 'Globe' },
  { id: 'fishing', label: 'මාළු අල්ලාගන්නන්', icon: 'Fish' },
  { id: 'tourism', label: 'සංචාරකත්වය', icon: 'Camera' },
  { id: 'conservation', label: 'සංරක්ෂණය', icon: 'Leaf' },
  { id: 'education', label: 'අධ්‍යාපනය', icon: 'BookOpen' }
];

const storyTranslations = [
  {
    title: 'මහ රළ පෙරතැනුමෙන් නෙගමිනේ යාත්‍රා ආරක්ෂා විය',
    impact: 'සුළි පීඩනයේදී යම් හානියක් නැත',
    description:
      'SMS, VHF හා ප්‍රජා සම්බන්ධීකරණ චැනල් එකට ගැළපුවෙන් පැය 48ක් කලින් දැනුම්දී යාත්‍රා 200කට වැඩි සංඛ්‍යාවක් සුළි බලපෑමට පෙර වරායට ආපසු ගෙන ආවේය.',
    metrics: [
      { label: 'ආරක්ෂා කළ යාත්‍රා', value: '200' },
      { label: 'ආරක්ෂිත කළ ජීවිත', value: '800' },
      { label: 'උපකරණ අගය', value: 'රු. 50m' }
    ],
    testimonial: {
      quote:
        'අහස තවමත් නිසලව තිබියදී තොරතුරු ලැබුණු නිසා අපි ඉක්මනින් ආපසු පැමිණි අයියෝ. සියලු කණ්ඩායම් නිවසට ආරක්ෂිතව ළඟා විය.',
      author: 'සුනිල් පෙරේරා',
      role: 'නෙගමිනේ මසුන් සංගම සභාපති'
    }
  },
  {
    title: 'ජල ගුණාස්ථාන ඩැෂ්බෝඩ් හිකඩුව සංචාරක විශ්වාසය යළි ගොඩනැගීය',
    impact: 'සංචාරක වෙන්කරවා ගැනීම් 30%කින් ඉහළ',
    description:
      'පැලුම් සෞඛ්‍යය, ද්‍රවීභවිතාව හා පැමිණෙන සංචාරක ප්‍රමාණය පිළිබඳ දිනපතා දත්ත හෙළිදරව් කිරීම නිසා වගකීම් සංචාලන කාලසටහන් ගොඩනැගීමත්, විශ්වාසයත් වැඩි විය.',
    metrics: [
      { label: 'සංචාරක වර්ධනය', value: '30%' },
      { label: 'ජල ගුණාත්මක අගය', value: '95/100' },
      { label: 'පැලුම් ආවරණය', value: '78%' }
    ],
    testimonial: {
      quote:
        'අපගේ අමුත්තන්ට පෙර දිනේම දත්ත බැලිය හැකිය. විද්‍යාත්මක විවෘත බව නිසා අපගේ ව්‍යාපාරයත් පැලුම් පද්ධතිත් ශක්තිමත් වෙනවා.',
      author: 'චමින්ද සිල්වා',
      role: 'ඩයිව් මධ්‍යස්ථාන හිමිකරු'
    }
  },
  {
    title: 'කඹුරු රැකවරණය බැතික්කලෝ ප්‍රජාවන් රැකගනී',
    impact: 'වෙරළ කාබනිකය 85%කින් අඩු විය',
    description:
      'ප්‍රජා රැකවරණයන් විසින් කඹුරු 10,000කින් වැඩි වගාවක් සිදු කර නැගෙනහිර ලගුණු ආරක්ෂණ පවත්වන අතර රෝගී අභිවෘද්ධියක් නැවත ඇති කිරීම සඳහා NARA මැනීම් සමඟ සංයුක්තයි.',
    metrics: [
      { label: 'ආරක්ෂිත වූ පවුල්', value: '500' },
      { label: 'සලස්වූ කඹුරු', value: '10,000' },
      { label: 'කහ තිරස් අවම වීම', value: '85%' }
    ],
    testimonial: {
      quote:
        'දැන් කඹුරු වෙරළය අල්ලාගෙන තියෙනවා. කක්කුස්සා නැවත ලගුණු වෙත ආවේ. විද්‍යාව හා පරම්පරාව එකට වැඩ කරනවා.',
      author: 'කමලා දේවි',
      role: 'කළුතවාල පිරිසෙන් නායකයා'
    }
  },
  {
    title: 'චලනීය මුහුදු පර්යේෂණ කුටිය උතුරු සිසුවියන්ට ආසාවක් සලසයි',
    impact: 'මුහුදු විද්‍යා ඇබ්බැහිවීම 40%කින් ඉහළ',
    description:
      'සිසුන්ගේ පර්යේෂණ, VR පැලුම් පාරිසරික සංචාර සහ වෘත්තීය මගපෙන්වීම් මගින් නව සිහිනයන් ඇති කරමින්, විශේෂයෙන් ගැහැණු ළමුන් අධිවේග විද්‍යා පාඨමාලා තෝරා ගනී.',
    metrics: [
      { label: 'ළඟා වූ සිසුන්', value: '1,000' },
      { label: 'වීදි ප්‍රවේශය', value: '25' },
      { label: 'STEM ඇබ්බැහි වීම', value: '+40%' }
    ],
    testimonial: {
      quote:
        'දැන් දියණිය රළ වෙලාවන් ලියමින් මුහුදු විද්‍යාඥයෙකියක් වීමට සීදුවෙලා. මෙය ඇයට මුහුද පන්ති කාමරයක් බව පෙන්නුාවා.',
      author: 'රජේශ්වරි සෙල්වන්',
      role: 'මාතා සහ පාසල් මිත්‍රිකාව'
    }
  }
];

si.stories.stories = si.stories.stories.map((story, index) => {
  const translation = storyTranslations[index];
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

si.stories.cta = {
  title: 'ඔබේ කතාව බෙදාගන්න',
  description: 'NARA කාර්යය ඔබගේ ප්‍රජාවට බලපෑද? අපට ඔබගෙන් අහීමට කැමතියි.',
  primary: { label: 'ඔබගේ කතාව ගොනු කරන්න', icon: 'MessageCircle' },
  secondary: { label: 'ප්‍රජා සංවාදයට එක් වන්න', icon: 'Users' }
};

si.dashboard.header = {
  title: 'ප්‍රාදේශීය දත්ත ඩැෂ්බෝඩ්',
  subtitle: 'NARA ජාලය පුරා සාක්ෂිමත් නිරීක්ෂණ'
};

si.dashboard.regionOptions = [
  { id: 'all', name: 'සියළු කලාප', color: '#003366' },
  { id: 'colombo', name: 'කොළඹ', color: '#1E40AF' },
  { id: 'galle', name: 'ගාල්ල', color: '#40E0D0' },
  { id: 'trincomalee', name: 'ත්‍රිකුණාමලය', color: '#FF6B35' },
  { id: 'jaffna', name: 'යාපනය', color: '#059669' },
  { id: 'batticaloa', name: 'බැතික්කලෝය', color: '#D97706' },
  { id: 'hambantota', name: 'හම්බන්තොට', color: '#DC2626' }
];
si.dashboard.timeRanges = [
  { id: '24h', name: 'පැය 24' },
  { id: '7d', name: 'දින 7' },
  { id: '30d', name: 'දින 30' },
  { id: '90d', name: 'දින 90' }
];
si.dashboard.alerts.items = si.dashboard.alerts.items.map((alert, index) => {
  const translations = [
    { title: 'කාලගුණ අනතුරු ඇඟවීම්', description: 'බලවත් සුළඟට අනතුරු ඇඟවීම් ක්‍රියාත්මකයි' },
    { title: 'මුහුදු ජීවී අනතුරු', description: 'තෝර්ත්තේ වාලා සංක්‍රමණය සිදුවේ' },
    { title: 'ජල ගුණාත්මක තත්ත්වය', description: 'කුලය වර්ධනය සැලකිල්ලට ගෙන නිරීක්ෂණය' },
    { title: 'ආරක්ෂක අනතුරු', description: 'සියල්ල සාමාන්‍යයි' }
  ];
  return { ...alert, ...translations[index] };
});
si.dashboard.weather.title = 'දැනට සීතල හා සුළං තත්ත්වය';
si.dashboard.weather.updated = 'මිනිත්තු 5කින් යාවත්කාලීන විය';
si.dashboard.weather.labels = {
  temperature: 'උෂ්ණත්වය',
  humidity: 'සාත්ත්වය',
  wind: 'සුළං වේගය (කි.මී./h)',
  waves: 'රළ උස (m)'
};
si.dashboard.fishing.title = 'දිනයේ ධීවර තත්ත්වය';
si.dashboard.fishing.legend = {
  excellent: 'ඉතා හොඳ',
  good: 'හොඳ',
  fair: 'මධ්‍යස්ථ',
  poor: 'දුර්වල'
};
si.dashboard.marineLife.title = 'මුහුදු ජීවින් දැක්ම (දින 7)';
si.dashboard.marineLife.data = si.dashboard.marineLife.data.map((entry) => {
  const mapping = {
    Dolphins: 'ඩොල්ෆින්',
    'Sea turtles': 'කකුළුවෝ',
    Whales: 'තිමී',
    Sharks: 'මෝර',
    Rays: 'රේ මසුන්'
  };
  return { ...entry, species: mapping[entry.species] };
});
si.dashboard.waterQuality.title = 'ජල ගුණාත්මක ප්‍රවණතාව';
si.dashboard.waterQuality.legend = {
  ph: 'pH මට්ටම',
  oxygen: 'දියවී ඇති ඔක්සිජන්',
  turbidity: 'දුසුසුම්තා',
  temperature: 'උෂ්ණත්වය'
};
si.dashboard.export = {
  title: 'ප්‍රාදේශීය දත්ත ප්‍රවේශය',
  description: 'දත්ත සමුදා බාගත කරන්න හෝ API එකට සම්බන්ධ වෙමින් නිරන්තර මතක දත්ත ලබාගන්න.',
  actions: {
    export: { label: 'දත්ත බාගත කරන්න', icon: 'Download' },
    api: { label: 'API ප්‍රවේශය', icon: 'Code' }
  }
};

si.community.header = {
  title: 'ප්‍රජා සම්බන්ධතා',
  description: 'NARA පර්යේෂණ කණ්ඩායම සමඟ සම්බන්ධවන්න, දායක වන්න, සහ හවුල් වී වැඩ කරන්න',
  activeMembers: 'ක්‍රියාත්මක සාමාජිකයින් 1,247'
};
si.community.tabs = [
  { id: 'forums', label: 'සංවාද වේදිකා', icon: 'MessageSquare' },
  { id: 'citizen-science', label: 'ප්‍රජා විද්‍යාව', icon: 'Search' },
  { id: 'alerts', label: 'ප්‍රාදේශීය අනතුරු', icon: 'Bell' },
  { id: 'events', label: 'විවෘත වැඩමුළු', icon: 'Calendar' }
];
si.community.forums.actions = {
  newTopic: 'නව මාතෘකාව',
  search: 'සංවාදය සොයන්න',
  sortLabel: 'සළකා බලන්න:',
  latest: 'නවතම ක්‍රියාකාරකම්'
};
si.community.forums.topics = si.community.forums.topics.map((topic, index) => {
  const translations = [
    {
      title: 'නෙගමිනේ ජලයෙන් ඩොල්ෆින් අසාමාන්‍ය හැසිරීම',
      category: 'මුහුදු සත්ව',
      statusLabel: 'ක්‍රියාත්මක',
      excerpt: 'මෙම සතියේදී ඩොල්ෆින් වෙරළට ආසන්නව බලා සිටියේද? පසුපස නාවක මාළු පසුපස යන අයුරින් පෙනේ.'
    },
    {
      title: 'වර්ෂා අනතුරුෙන් පසු ජල ගුණ මට්ටම්',
      category: 'ජල ගුණාත්මකභාවය',
      statusLabel: 'විශේෂඥ පිළිතුර',
      excerpt: 'අපගේ සංවේදකවලට දීප්තිය වැඩි විය. ලගුණු ප්‍රජාවන් සහ ආහාර සැකසීමේ ඒකක සඳහා ක්‍රියාමාර්ග බෙදා ගනිමි.'
    },
    {
      title: 'හිකඩුව පැලුම් සුදුසුකුම් කිරීමේ වාර්තා',
      category: 'සංරක්ෂණය',
      statusLabel: 'හදිසි',
      excerpt: 'සර්වේ කලාප 3–5 අතර පැලුම් සුදුසුකුම් දැක්කා. වින්‍යාස ගැඹුරු පරීක්ෂණ සහ වහා ක්‍රියාමාර්ග මාර්ගෝපදේශ අවශ්‍යයි.'
    },
    {
      title: 'පරම්පරාගත ධීවර කාලසටහන් Vs නව දත්ත',
      category: 'පරම්පරා දැනුම',
      statusLabel: 'ජනප්‍රිය',
      excerpt: 'අපේ පරම්පරාගත විශ්වාස හා NARA රළ-සඳ දත්ත සසඳමින් රසකතාත්මක සමානතා හඳුනාගන්නා ලදි.'
    }
  ];
  return { ...topic, ...translations[index] };
});

si.community.citizenScience.intro = {
  title: 'ප්‍රජා විද්‍යාඥයෙකු වන්න',
  description: 'ඔබගේ වෙරළේ පවා අවධි කරගත් නිරීක්ෂණ, ඡායාරූප සහ ජල සාම්පල ලබාදෙමින් රටේ මුහුදු බුද්ධිය ශක්තිමත් කරන්න.',
  button: 'වැඩසටහනට එක් වන්න'
};
si.community.citizenScience.labels = {
  participants: 'සහභාගීන්',
  dataPoints: 'දත්ත ලේඛන',
  time: 'කාල ව්‍යවස්ථාව',
  region: 'ස්ථානය',
  tools: 'අවශ්‍ය මෙවලම්',
  impact: 'ප්‍රතිඵලය',
  learnMore: 'වැඩිම තොරතුරු'
};
si.community.citizenScience.projects = si.community.citizenScience.projects.map((project, index) => {
  const translations = [
    {
      title: 'වෙරළ ප්ලාස්ටික් මැනීම',
      description: 'සතියකට වරක් වෙරළ ගමන් අතරින් සොයාගත් ප්ලාස්ටික් වර්ග සටහන් කරන්න.',
      difficultyLabel: 'පොදු',
      region: 'සියළුම මධ්‍යස්ථාන',
      impact: 'ජාතික ප්ලාස්ටික් අත්හැරීමේ ප්‍රතිපත්ති සකස් කිරීමට දායකයි'
    },
    {
      title: 'මාළු ජනගහන සමීක්ෂණ',
      description: 'මසුන් විවිධත්වය, ප්‍රමාණය සහ ප්‍රමාණ ඒකකයකට අඩු සැලසුම් සටහන් කරන්න.',
      difficultyLabel: 'මධ්‍ය',
      region: 'වෙරළ ප්‍රදේශ',
      impact: 'ස්ථිර මසුන් කළමනාකරණයට දායක වේ'
    },
    {
      title: 'මුහුදු උෂ්ණත්ව සටහන්',
      description: 'දෛනික මුහුදු මතුපිට උෂ්ණත්වය මානයන් වරාය හෝ යාත්‍රා වලින් ලබාදෙන්න.',
      difficultyLabel: 'පොදු',
      region: 'සියළු වෙරළ ප්‍රදේශ',
      impact: 'කාලගුණික උණුසුම් ප්‍රවණතා නිරීක්ෂණ'
    }
  ];
  return { ...project, ...translations[index] };
});
si.community.citizenScience.observationForm = {
  title: 'ක්ෂණික නිරීක්ෂණ වාර්තාව',
  fields: {
    location: {
      label: 'ස්ථානය',
      placeholder: 'උදාහරණයක් ලෙස: නෙගමිනේ වෙරළ, GPS ස්ථානය'
    },
    category: {
      label: 'ප්‍රවර්ගය',
      placeholder: 'උදා: මුහුදු සත්ව, ජල ගුණය, කාලගුණය'
    },
    observation: {
      label: 'නිරීක්ෂණය',
      placeholder: 'ඔබ දැක ගත් දෑ විස්තර කරන්න...'
    }
  },
  submit: 'වාර්තාව යොමන්න'
};

si.community.alerts = {
  title: 'ප්‍රාදේශීය අනතුරු හා උපදෙස්',
  subtitle: 'NARA මධ්‍යස්ථානගෙන් තත්‍ය තොරතුරු',
  preferences: 'අනතුරු සැකසුම්',
  labels: { validUntil: 'වලංගු වන දින' },
  alerts: si.community.alerts.alerts.map((alert, index) => {
    const translations = [
      {
        title: 'බලවත් සුළං අනතුරු - දකුණු වෙරළ',
        message: 'සුළං වේගය කි.මී. 45-50 දක්වා ප්‍රබල වේ. දුර්ලභ යාත්‍රා සඳහා අනතුරු ඇඟවීම් ක්‍රියාත්මකයි.',
        severityLabel: 'ඉහළ'
      },
      {
        title: 'තිමී සංක්‍රමණ අනතුරු - නැගෙනහිර මුහුද',
        message: 'ත්‍රිකුණාමලයෙන් කිලෝමීටර 15ක් දුරින් නිල් තිමී සමූහය මතුවී ඇත. මීටර් 500ක අඩු නොවන දුරක් තබා ගන්න.',
        severityLabel: 'මධ්‍ය'
      },
      {
        title: 'නෙගමිනේ ලගුනේ ඇල්ගී නිරීක්ෂණය',
        message: 'ඇල්ගී ක්‍රියාකාරිත්වය ඉහළය. උද්‍යාන ධීවරයන්ට වායු සමෘද්ධ කිරීමට උපදෙස් දෙනු ලැබේ.',
        severityLabel: 'අඩු'
      }
    ];
    return { ...alert, ...translations[index] };
  }),
  share: 'අනතුර බෙදා ගන්න',
  stayInformed: {
    title: 'පෙර දැනුවත් වන්න',
    description: 'SMS, ඊමේල් හෝ push අවසරයන් හරහා අනතුරු ලබා ගැනීමට ලියාපදිංචි වන්න.',
    primary: { label: 'SMS අනතුරු' },
    secondary: { label: 'ඊමේල් අනතුරු' }
  }
};

si.community.events = {
  title: 'ඉදිරියේ ඇති වැඩමුළු හා වැඩසටහන්',
  subtitle: 'NARA ප්‍රජා අධ්‍යාපන වැඩසටහන් සඳහා එක්වන්න',
  calendar: 'සියලු කාලසටහන් බැලීම',
  events: si.community.events.events.map((event, index) => {
    const translations = [
      {
        typeLabel: 'වැඩමුළුව',
        title: 'මුහුදු සංරක්ෂණ වැඩමුළුව',
        location: 'ගාල්ල මුහුදු නිරීක්ෂණ මධ්‍යස්ථානය',
        audience: 'මාළු අල්ලාගන්නන්',
        description: 'පාගානුකූල උපාංග තේරීම්, පැලුම් රැකවරණය සහ ආරක්ෂක ක්‍රියාමාර්ග පිළිබඳ practically පුහුණු කිරීම.',
        facilitator: 'ඩො. නිමල් සිල්වා'
      },
      {
        typeLabel: 'අධ්‍යාපනික වැඩසටහන',
        title: 'පාසල් මුහුදු විද්‍යා ප්‍රදර්ශනය',
        location: 'යාපනය ද්වීපක මධ්‍යස්ථානය',
        audience: 'සිසුන් සහ ගුරුවරුන්',
        description: 'සිසුන්ගේ ප්‍රදර්ශන, මුහුදු වෘත්තීය මගපෙන්වීම් සහ ප්‍රායෝගික දර්ශන.',
        facilitator: 'NARA අධ්‍යාපන කණ්ඩායම'
      },
      {
        typeLabel: 'පුහුණු වැඩසටහන',
        title: 'කඹුරු යළි වගා පුහුණුව',
        location: 'බැතික්කලෝය මුහුදු පර්යේෂණ රසවාහිනිය',
        audience: 'සමාජ ස්වයංක්‍රීයව',
        description: 'කඹුරු වගා කිරීම, නිරීක්ෂණය සහ නඩත්තු කිරීම සඳහා ක්ෂේත්‍ර practically පඬි.',
        facilitator: 'වෙරළ ප්‍රතිසාධන කණ්ඩායම'
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
    facilitator: 'සම්පූර්ණකරු',
    registration: 'ලියාපදිංචි'
  },
  buttons: {
    register: 'දැන් ලියාපදිංචි වන්න',
    waitlist: 'මුර පටුන'
  },
  footer: {
    title: 'ඔබේ ප්‍රජාවට වැඩසටහනක් පවත්වාමු',
    description: 'ඔබේ ප්‍රජාවට මුහුදු විද්‍යා වැඩසටහානක් සංවිධාන කිරීමට කැමතිද? අප හා එක්වන්න.',
    button: 'වැඩසටහන් යෝජනා කරන්න'
  }
};

si.cta = {
  title: 'අපගේ ප්‍රාදේශීය ජාලයට එක්වන්න',
  description:
    'ඔබ පර්යේෂකයෙකු, ප්‍රජා නායකයෙකු හෝ මුහුදු හැඟීම් ඇත්තෙකු වුවත් NARA ජාලයේ ඔබට ස්ථානයක් ඇත. ඔබේ ආසන්න මධ්‍යස්ථානය සමඟ සම්බන්ධවී ශ්‍රී ලංකාවේ වෙරළ ප්‍රතිරෝධතා කථාවට එක්වන්න.',
  primary: { label: 'ඔබේ ආසන්න මධ්‍යස්ථානය සොයන්න', icon: 'MapPin' },
  secondary: { label: 'ප්‍රාදේශීය කණ්ඩායම සම්බන්ධ කරගන්න', icon: 'MessageCircle' }
};

si.footer = {
  name: 'NARA ඩිජිටල් ඔෂන්',
  description: 'ජාතික ජලජ සම්පත් පර්යේෂණ හා සංවර්ධන ආයතනය — මුහුදු දත්ත හරහා ප්‍රජාවන් සම්බන්ධ කරයි.'
};

export default si;
