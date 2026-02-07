import en from './content.en.js';

const si = JSON.parse(JSON.stringify(en));

si.meta = {
  title: 'හදිසි තත්ත්ව ප්‍රතිචාර ජාලය - NARA ඩිජිටල් ඔෂන්',
  description:
    'ශ්‍රී ලංකා වෙරළ ප්‍රදේශ සඳහා NARA හදිසි ප්‍රතිචාර ජාලය සෘජු දත්ත, බහු ආයතන සන්නිවේදනය හා ඉක්මන් වාර්තාකරණය සමඟ සූදානම් තත්ත්වය සමන්විත කරයි.',
  keywords:
    'NARA හදිසි ප්‍රතිචාර, සුනමි අනතුරු ඇඟවීම, වෙරළ හදිසි තත්ත්ව, පාරිසරික හානි වාර්තා, ඉක්මන් ප්‍රතිචාර'
};

si.hero = {
  badge: 'වෙරළ හදිසි බුද්ධිය',
  subheading: 'නොනවතින සූදානම',
  title: 'ශ්‍රී ලංකා වෙරළ ආරක්ෂා කරන්නේ',
  highlight: 'ඉක්මන් ප්‍රතිචාරයෙන්',
  description:
    'හදිසි ප්‍රතිචාර ජාලය වෙරළ ප්‍රජාවන්, වරාය, නාවික ඒකක හා පාරිසරික කණ්ඩායම් එකට රැස් කරමින් තත්‍ය කාලීන බිහිවූ දත්ත, දෙභාෂා අනතුරු ඇඟවීම් හා සියලුම සිද්ධි කාණ්ඩ සඳහා සුලභ වාර්තාකරණය සපයයි.',
  primaryCta: { label: 'හදිසි තත්ත්ව වාර්තා කරන්න', icon: 'AlertOctagon' },
  secondaryCta: { label: 'පාරිභෝගික පාලන මධ්‍යස්ථානය', icon: 'LayoutDashboard' },
  leftStat: { value: '24/7', label: 'සමඹවිත නිරීක්ෂණ' },
  rightStat: { value: '18', label: 'ප්‍රාදේශීය ඒකක' },
  image: en.hero.image,
  images: [...en.hero.images]
};

si.quickActions = [
  {
    id: 'emergency-call',
    title: 'අතිතාක්ෂණික අනතුරු අඟවීම',
    summary: 'ජීවිත තර්ජන, නාවික අනතුරු හෝ සුනමි දර්ශක.',
    primary: { label: '117 වෙතින් අමතන්න', icon: 'PhoneCall', href: 'tel:117' },
    secondary: { label: 'SOS සටහන් කරන්න', icon: 'Radio', href: '#emergency-reporting' }
  },
  {
    id: 'environmental',
    title: 'පාරිසරික හානි',
    summary: 'තෙල්/ රසායනික කාබනික, ගල්වැව් හානි, තල රෝග, නීතිවිරෝධී කපනය.',
    primary: { label: 'පාරිසරික සිද්ධිය වාර්තා කරන්න', icon: 'Droplets', href: '#environmental-reporting' },
    secondary: { label: 'ක්ෂේත්‍ර පිරික්ෂණ ලැයිස්තුව', icon: 'ClipboardList', href: '#preparedness' }
  },
  {
    id: 'admin-console',
    title: 'පාලන හා විශ්ලේෂණ',
    summary: 'අවසර ඇති නිලධාරින්ට අනතුරු, දත්ත ප්‍රවාහයන් හා දෙභාෂා පණිවිඩ කළමනාකරණය.',
    primary: { label: 'පාලන පුවරුවට පිවිසෙන්න', icon: 'ShieldCheck', href: '/admin' },
    secondary: { label: 'මෙහෙයුම් වාර්තා බලන්න', icon: 'FileSpreadsheet', href: '#situation-room' }
  }
];

si.reporting.emergency = {
  title: 'හදිසි සිද්ධි ලියාපදිංචිය',
  description:
    'බිම් කණ්ඩායම් දෙභාෂා සම්බන්ධතා, භූස්ථාන හා කාණ්ඩ සමාලෝචන සමඟ උණුසුම් සිද්ධි කිලිඳර වාර්තා කරයි. පොලිසිය, නාවික හමුදාව, වරාය සහ ප්‍රතිචාර කණ්ඩායම් එකවර දැනුවත් කරයි.',
  targetResponse: 'මධ්‍යස්ථ කාලය: මිනිත්තු 5ට අඩු',
  form: {
    title: 'හදිසි වාර්තාව ඉදිරිපත් කරන්න',
    fields: [
      { id: 'name', type: 'text', label: 'වාර්තා කරන නිලධාරියා / කැඳවන්නා', placeholder: 'සම්පූර්ණ නම සටහන් කරන්න', required: true },
      { id: 'contact', type: 'tel', label: 'දුරකථන අංකය / රේඩියෝ නාලිකාව', placeholder: '+94 XX XXX XXXX හෝ VHF නාලිකාව', required: true },
      {
        id: 'incidentType',
        type: 'select',
        label: 'සිද්ධි වර්ගය',
        placeholder: 'වාර්තා වර්ගය තෝරන්න',
        required: true,
        options: [
          'රක්ෂණ හා සොයාගැනීම',
          'නාවික බලතල / අනතුරු',
          'සුනමි හෝ භූකම්පන දර්ශක',
          'ශක්තිමත් කාලගුණය',
          'ගිනි/ පිපිරීම',
          'වෙනත් හදිසි සිද්ධි'
        ]
      },
      { id: 'location', type: 'text', label: 'ස්ථානය / GPS සමීකරණ', placeholder: 'ග්‍රාමය හෝ සංයුජිත කරුණු', required: true },
      { id: 'description', type: 'textarea', label: 'පර්යේෂණ සාරාංශය', placeholder: 'සිද්ධිය, බලපෑම්, අවදානම් විස්තර කරන්න', required: true },
      { id: 'resources', type: 'textarea', label: 'අවශ්‍ය සම්පත්', placeholder: 'නාවික ඒකක, වෛද්‍ය කණ්ඩායම්, HazMat, දුම්කොල ගලවා ගැනීම' },
      { id: 'attachments', type: 'file', label: 'රූප / වීඩියෝ / ලියාපදිංචි ලිපි එකතු කරන්න' }
    ],
    submitLabel: 'හදිසි වාර්තාව යවන්න',
    acknowledgement:
      'සිද්ධිය ලැබුණි. දෙභාෂා ඩිස්පැචර් කණ්ඩායම මිනිත්තු 3යි ඇතුළත ඔබව අමතනු ඇත. live console හෝ 1990 හරහා ප්‍රතිචාරය තවත් පරික්ෂා කරන්න.'
  }
};

si.reporting.nonEmergency = {
  title: 'හදිසි නොවන සහාය',
  description:
    'නාවික මාර්ග අවදානම්, වරාය සවිස්, ප්‍රජා අවධානම් හෝ පූර්ව රැකවරණ අවශ්‍යතා වාර්තා කර හදිසි මට්ටමක් නොමැතිව කාලීන ක්‍රියාමාර්ග ගැනීම.',
  supportText: 'ව්‍යාපාරික රැඳවුම් කාර්ය මණ්ඩලය රාජකාරි පැය 24කින් පිළිතුරු සපයයි.',
  form: {
    title: 'හදිසි නොවන ප්‍රශ්නයක් ලියාපදිංචි කරන්න',
    fields: [
      { id: 'name', type: 'text', label: 'වාර්තා කරන පුද්ගලයා / ආයතනය', placeholder: 'නම හෝ ඒකකය', required: true },
      { id: 'email', type: 'email', label: 'විද්‍යුත් තැපැල් / සබඳතා (විකල්පික)', placeholder: 'yourname@nara.gov.lk' },
      {
        id: 'category',
        type: 'select',
        label: 'ප්‍රශ්න වර්ගය',
        placeholder: 'ප්‍රශ්නය තෝරන්න',
        required: true,
        options: [
          'බීකන් / ලයිට් විනාශය',
          'නාවික මාවත් අවහිරවීම',
          'ප්‍රජා ව්‍යුහාවලියට අවදානම',
          'වරාය උපකරණ නඩත්තු',
          'මාළු අල්ලා ගැනීමේ ආරක්ෂක උපදෙස්',
          'වෙනත් සහාය'
        ]
      },
      { id: 'location', type: 'text', label: 'ස්ථානය / පහසුකම', placeholder: 'වරාය, GN කලාපය, GPS', required: true },
      { id: 'details', type: 'textarea', label: 'විස්තර', placeholder: 'සිදුවීම, බලපෑම්, යෝජිත ක්‍රියාමාර්ග විස්තර කරන්න', required: true },
      { id: 'preferredDate', type: 'date', label: 'පසු විමසුම් දිනය' }
    ],
    submitLabel: 'සහාය ඉල්ලීම යවන්න',
    acknowledgement: 'අයදුම්පත ලියාපදිංචි විය. රාජකාරි දින 24ඉන් දින හතරක් ඇතුළත පිළිතුර ලැබේ.'
  }
};

si.reporting.environmental = {
  title: 'පාරිසරික හානි වාර්තාකරණය',
  description:
    'තෙල්/ රසායනික වාමනය, පැලුම් පරිහරණය, මසුන් මරු, නීතිවිරෝධී කැනීම් විස්තරාත්මකව ලබාදී බලධාරීන්ට ක්‍රියාත්මක වීමට ඉඩ සැලසෙයි.',
  hotline: 'පාරිසරික වගකීම් නිලධාරි: +94 11 452 7777',
  form: {
    title: 'පාරිසරික සිද්ධිය ලියාපදිංචි කරන්න',
    fields: [
      {
        id: 'impactType',
        type: 'select',
        label: 'බලපෑම වර්ගය',
        placeholder: 'බලපෑම තෝරන්න',
        required: true,
        options: [
          'තෙල් / රසායනික ව්‍යසනය',
          'මඩ කඩන/ මැනුම්',
          'තල මැලීම',
          'මසුන් මරු / ඇල්ගී ව්‍යාප්තිය',
          'නීතිවිරෝධී වැලි අස්වැන්න',
          'දියඇල්ලුව / මහා සතුන් සටහන්',
          'වෙනත් පාරිසරික හානි'
        ]
      },
      { id: 'detectedOn', type: 'datetime-local', label: 'පිළිගත් වේලාව', required: true },
      { id: 'location', type: 'text', label: 'ස්ථානය / පර්යේෂණ ස්ථානය', placeholder: 'ස්ථානය සහ GPS', required: true },
      { id: 'extent', type: 'text', label: 'බලපෑම ප්‍රමාණය', placeholder: 'වර්ග මීටර, දිග, ප්‍රමාණය' },
      { id: 'currentStatus', type: 'textarea', label: 'වර්තමාන තත්ත්වය', placeholder: 'දැන් සිදුවෙන්නේ කුමක්ද? ධාරා, කාලගුණය, තවදුරටත් ව්‍යසනය', required: true },
      { id: 'samples', type: 'textarea', label: 'අරගෙන ඇති මාදිලි / පුහුණු සහය', placeholder: 'ජල නියැදි, පටක, ඡායාරූප, ඩ්‍රෝන් දත්ත' },
      { id: 'attachments', type: 'file', label: 'ඡායාරූප / වීඩියෝ / විද්‍යුත් ලිපි එක් කරන්න' }
    ],
    supportText: 'CEA, වෙරළ සංරක්ෂණ දෙපාර්තමේන්තුව සහ මුහුදු පොලිසියට ස්වයංක්‍රීය දැනුම් දීම සිදුවේ.',
    submitLabel: 'පාරිසරික හානි වාර්තා කරන්න',
    acknowledgement:
      'පාරිසරික ක්‍රියාකාරී ඒකකයට දැනුම් දුන් අතර ක්ෂේත්‍ර කණ්ඩායම් හා අනුබල ආයතන (CEA, Coast Conservation, Marine Police) සමඟ සම්බන්ධතාවය ක්‍රියාත්මක වේ.'
  }
};

si.alerts.title = 'ජීවමාන අනතුරු ඇඟවීම්';
si.alerts.viewArchiveLabel = 'අතීත අනතුරු බලන්න';
si.alerts.items = [
  {
    ...si.alerts.items[0],
    title: 'සුනමි අවවාදය – දකුණු වෙරළ',
    description:
      'දොන්ඩ්‍ර බෝයි එකීවෙන් සෙන්ටිමීටර් 10ක් උල්ලාසය. මසුන් නාවිකයින්ව වරායට රඳවා තබා ඇත; සයිරන් පරීක්ෂණය සිදුවෙයි.',
    location: 'මාතර, හැම්බන්තොට, ගාල්ල',
    timestamp: 'මිනිත්තු 2කට පෙර යාවත්කාලීන',
    affectedAreas: ['දොන්ඩ්‍ර', 'හැම්බන්තොට', 'ටංගල්ල']
  },
  {
    ...si.alerts.items[1],
    title: 'තෙල් මතුපිට නිරීක්ෂණය – ත්‍රිකුණාමලය',
    description:
      'උපග්‍රහ හා ඩ්‍රෝන් රූපවලින් මීටර් 1.5ක් දුරට පරාසයක් තහවුරු. පාරිසරික කණ්ඩායම් නාවික හමුදාව සමඟ බූම් පවත්වායි.',
    location: 'ත්‍රිකුණාමලය වරාය',
    timestamp: 'මිනිත්තු 14කට පෙර යාවත්කාලීන',
    affectedAreas: ['ත්‍රිකුණාමලය වෙරළ', 'කුච්චවිලි']
  },
  {
    ...si.alerts.items[2],
    title: 'ප්‍රජා ඉවත්වීමේ පුහුණු කටයුතු',
    description:
      'මොරටුව වෙරළ GN කලාප සඳහා සූදානම් සුනමි පුහුණු වැඩසටහන 15:00 වේලාවේ. සිංහල හා දෙමළ ප්‍රකාශන පද්ධති ක්‍රියාත්මකයි.',
    location: 'මොරටුව වෙරළ',
    timestamp: 'මිනිත්තු 45කට පෙර යාවත්කාලීන',
    affectedAreas: ['අංගූලන', 'කොරල වැල්ල']
  }
];

si.systemStatus.systems[0].name = 'ජාතික සුනමි බූයි ජාලය';
si.systemStatus.systems[0].description = 'ගැඹුරු සාගර සංවේදක දත්ත විපත් කළමනාකරණ මධ්‍යස්ථානයට.';
si.systemStatus.systems[1] = {
  ...si.systemStatus.systems[1],
  name: 'වරාය විධාන රේඩියෝ ජාලය',
  description: 'සරල VHF / LTE මිශ්‍ර ජාලය වරාය මණ්ඩල සඳහා.',
  statusMessage: 'ගාල්ල රිපීටරය අමතර විදුලි බලයෙන් ක්‍රියාත්මකයි.'
};
si.systemStatus.systems[2].name = 'හදිසි සිද්ධි පුවරුව හා විශ්ලේෂණ';
si.systemStatus.systems[3] = {
  ...si.systemStatus.systems[3],
  name: 'ප්‍රජා සයිරන් ජාලය',
  description: 'සූර්ය බලයෙන් පවත්නා වෙරළ සයිරන් 215ක්.',
  statusMessage: 'කළුතර දකුණු සයිරන් බැටරි ප්‍රතිස්ථාපනය අද රාත්‍රියට.'
};

si.contacts.title = 'මුහුදු මෙහෙයුම් සම්බන්ධතා';
si.contacts.description =
  'දෙභාෂා ප්‍රතිචාරකයන්ට හැකියාව ඇති කරන සෘජු අංක. සියලු දුරකථන පද්ධති උපග්‍රහ ආපසු යාමක් සහිතයි.';
si.contacts.items[0].name = 'ජාතික හදිසි මෙහෙයුම් මධ්‍යස්ථානය';
si.contacts.items[0].description = 'හදිසි ප්‍රතිචාර සඳහා ප්‍රධාන ආධාර මධ්‍යස්ථානය.';
si.contacts.items[1].name = 'නාවික සමුද්‍ර යළි ගෙනයාම සම්බන්ධතා';
si.contacts.items[1].description = 'නාවික අනතුරු, SAR වෙළඳ කටයුතු, වරාය ඉවත් කිරීම.';
si.contacts.items[2].name = 'පාරිසරික ඉක්මන් ප්‍රතිචාර ඒකකය';
si.contacts.items[2].description = 'තෙල්/ රසායනික ව්‍යසන, පැලුම් හානි, කඳවුරු ඉවත දැමීම්.';

si.preparedness.title = 'සූදානම් හා පුහුණු කාර්ය සංග්‍රහය';
si.preparedness.description =
  'සිහිනැල්ලෙන් සුදුසු පසුගිය SOP, ලැයිස්තු හා ප්‍රජා පුහුණු සැලසුම් පරිවර්තනයන් සමඟ වාර්ෂික වරක් යාවත්කාලීන කරයි.';
si.preparedness.items[0].title = 'වෙරළ ඉවත්වීමේ ක්ෂේත්‍ර මාර්ගෝපදේශය';
si.preparedness.items[0].description = 'GN නිලධාරින් හා වරාය ප්‍රධාන සඳහා පියවරෙන් පියවර ක්‍රියාමාර්ග අත්පොත.';
si.preparedness.items[1].title = 'පාරිසරික බලපෑම් ඉක්මන් ඇගයීම් ලැයිස්තුව';
si.preparedness.items[2].title = 'ප්‍රජා සයිරන් පුහුණු වීඩියෝ පාඩම';
si.preparedness.items[2].description = 'දෙභාෂා සයිරන් පුහුණු වැඩසටහන් සැලසුම් කිරීමට මිනිත්තු 10ක උපදෙස්.';

si.situationRoom.title = 'සිත්‍යුෂා මධ්‍යස්ථානය';
si.situationRoom.description =
  'අවසර ලත් නිලධාරින්ට සම්පූර්ණ පාලන පුවරුව, දෙභාෂා පණිවිඩ හා අනතුරු අනාවරණය කළමනාකරණය කළ හැක.';
si.situationRoom.actions[0].label = 'පාලන පුවරුව ක්‍රියාත්මක කරන්න';
si.situationRoom.actions[1].label = 'අනතුරු පණිවිඩ පරිවර්තනය කළමනාකරණය';
si.situationRoom.actions[2].label = 'පසු ඉන්ම ප්‍රකාශ බාගත කරන්න';

si.environmentWatch.title = 'පාරිසරික බුද්ධි තලය';
si.environmentWatch.description =
  'කොරල් සෞඛ්‍යය, කඳවුරු උෂ්ණත්වය, ජල ගුණාත්මක අවධානම් හා මසුන් මරු ඵලදායීව නිරීක්ෂණය කර අනාගත අවදානම් තරගයෙන් පෙර සුරක්ෂිත කරයි.';
si.environmentWatch.stats[0].label = 'කොරල් නිරීක්ෂණ ස්ථාන';
si.environmentWatch.stats[1].label = 'මැන්ග්‍රෝව් සංවේදක';
si.environmentWatch.stats[2].label = 'ජල ගුණාත්මක අනතුරු';
si.environmentWatch.stats[1].trend = '+4 නව ස්ථාපන';
si.environmentWatch.stats[2].trend = 'ක්‍රියාත්මක 3යි';
si.environmentWatch.cta.label = 'පාරිසරික පුවරුව බලන්න';

export default si;
