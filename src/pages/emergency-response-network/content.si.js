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
    primary: { label: 'DMC 117 අමතන්න', icon: 'PhoneCall', href: 'tel:117' },
    secondary: { label: 'හදිසි වාර්තාව යවන්න', icon: 'Radio', href: '#emergency-reporting' }
  },
  {
    id: 'environmental',
    title: 'පාරිසරික හානි',
    summary: 'තෙල්/ රසායනික කාබනික, ගල්වැව් හානි, තල රෝග, නීතිවිරෝධී කපනය.',
    primary: { label: 'පාරිසරික සිද්ධිය වාර්තා කරන්න', icon: 'Droplets', href: '#environmental-reporting' },
    secondary: { label: 'ක්ෂේත්‍ර පිරික්ෂණ ලැයිස්තුව', icon: 'ClipboardList', href: '#preparedness' }
  },
  {
    id: 'complaint-support',
    title: 'පැමිණිලි / සේවා සහාය',
    summary: 'හදිසි නොවන මහජන පැමිණිලි, සේවා ගැටලු හා පසු විමසුම් ඉල්ලීම්.',
    primary: { label: 'පැමිණිල්ලක් යවන්න', icon: 'MessageSquareWarning', href: '#non-emergency-reporting' },
    secondary: { label: 'හදිසි සම්බන්ධතා', icon: 'PhoneCall', href: '#contacts' }
  }
];

si.reporting.emergency = {
  title: 'හදිසි සිද්ධි ලියාපදිංචිය',
  description:
    'බිම් කණ්ඩායම් දෙභාෂා සම්බන්ධතා, භූස්ථාන හා කාණ්ඩ සමාලෝචන සමඟ උණුසුම් සිද්ධි කිලිඳර වාර්තා කරයි. පොලිසිය, නාවික හමුදාව, වරාය සහ ප්‍රතිචාර කණ්ඩායම් එකවර දැනුවත් කරයි.',
  targetResponse: 'යොමු අංකයක් සමඟ මහජන වාර්තාකරණය',
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
      'හදිසි වාර්තාව ලැබුණි. වහාම අවදානමක් තිබේ නම් DMC 117, පොලිස් 119 හෝ ගිලන් රථ 1990 අමතමින් සිටින්න.'
  }
};

si.reporting.nonEmergency = {
  title: 'හදිසි නොවන සහාය',
  description:
    'නාවික මාර්ග අවදානම්, වරාය සවිස්, ප්‍රජා අවධානම් හෝ පූර්ව රැකවරණ අවශ්‍යතා වාර්තා කර හදිසි මට්ටමක් නොමැතිව කාලීන ක්‍රියාමාර්ග ගැනීම.',
  supportText: 'මහජන පැමිණිලි සහ සහාය ඉල්ලීම් සමාලෝචනය සහ පසු විමසීම සඳහා ලියාපදිංචි කෙරේ.',
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
    acknowledgement: 'පැමිණිලි/සහාය ඉල්ලීම ලැබුණි. පසු විමසීම් සඳහා යොමු අංකය තබා ගන්න.'
  }
};

si.reporting.environmental = {
  title: 'පාරිසරික හානි වාර්තාකරණය',
  description:
    'තෙල්/ රසායනික වාමනය, පැලුම් පරිහරණය, මසුන් මරු, නීතිවිරෝධී කැනීම් විස්තරාත්මකව ලබාදී බලධාරීන්ට ක්‍රියාත්මක වීමට ඉඩ සැලසෙයි.',
  hotline: 'වහාම මහජන ආරක්ෂාවට අවදානමක් තිබේ නම් පළමුව DMC 117 හෝ පොලිස් 119 අමතන්න.',
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
    supportText: 'NARA සාක්ෂි සමාලෝචනය කර අවශ්‍ය විට අදාළ බලධාරීන් වෙත යොමු කරයි.',
    submitLabel: 'පාරිසරික හානි වාර්තා කරන්න',
    acknowledgement:
      'පාරිසරික සිද්ධිය ලැබුණි. තහවුරු කිරීම හෝ පසු විමසීම් සඳහා යොමු අංකය තබා ගන්න.'
  }
};

si.alerts.title = 'ජීවමාන අනතුරු ඇඟවීම්';
si.alerts.viewArchiveLabel = 'සක්‍රිය අනතුරු බලන්න';
si.alerts.items = [
  {
    ...si.alerts.items[0],
    title: 'වහාම අවදානමක් නම් පළමුව අමතන්න',
    description:
      'ජීවිතයට හෝ මහජන ආරක්ෂාවට වහාම අවදානමක් තිබේ නම් online වාර්තාවට පෙර DMC 117, පොලිස් 119 හෝ ගිලන් රථ 1990 අමතන්න.',
    location: 'ශ්‍රී ලංකාව',
    timestamp: 'මහජන මාර්ගෝපදේශය',
    affectedAreas: ['ජාතික හදිසි අංක']
  },
  {
    ...si.alerts.items[1],
    title: 'ඉක්මන් සමාලෝචනයට සාක්ෂි එකතු කරන්න',
    description:
      'වෙරළ දූෂණය, මසුන් මරණය, නීතිවිරෝධී බැහැර කිරීම හෝ ගල්පර හානිය සඳහා ඡායාරූප, GPS/ස්ථානය, වේලාව සහ සම්බන්ධතා දත්ත එක් කරන්න.',
    location: 'මුහුදු හා වෙරළ ප්‍රදේශ',
    timestamp: 'සාක්ෂි ලැයිස්තුව',
    affectedAreas: ['ඡායාරූප', 'ස්ථානය', 'නිරීක්ෂණ වේලාව']
  },
  {
    ...si.alerts.items[2],
    title: 'පැමිණිලි සහ සේවා ඉල්ලීම්',
    description:
      'හදිසි නොවන ගැටලු සඳහා පැමිණිලි/සහාය tab එක භාවිතා කරන්න. යැවීමෙන් පසු පෙන්වන යොමු අංකය තබා ගන්න.',
    location: 'NARA මහජන සේවා',
    timestamp: 'සේවා මාර්ගෝපදේශය',
    affectedAreas: ['පැමිණිලි', 'සහාය', 'පසු විමසීම']
  }
];

si.systemStatus.systems[0].name = 'වහාම හදිසි සම්බන්ධතා';
si.systemStatus.systems[0].description = 'ජාතික හදිසි අංක hero, reporting hub සහ directory තුළ පෙනේ.';
si.systemStatus.systems[0].statusMessage = 'වහාම අවදානමක් ඇති විට පළමුව දුරකථන අංක භාවිතා කරන්න.';
si.systemStatus.systems[1] = {
  ...si.systemStatus.systems[1],
  name: 'Online වාර්තා ලබාගැනීම',
  description: 'හදිසි, පාරිසරික සහ පැමිණිලි/සහාය වාර්තා සඳහා form තුනක් ඇත.',
  statusMessage: 'ඉදිරිපත් කිරීම් පසු විමසීම සඳහා මහජන යොමු අංකයක් ලබා දෙයි.'
};
si.systemStatus.systems[2].name = 'සූදානම් PDF බාගැනීම්';
si.systemStatus.systems[2].description = 'ඉවත්වීම, පාරිසරික, ප්‍රජා පුහුණු සහ map reference PDF බාගත කළ හැක.';
si.systemStatus.systems[3] = {
  ...si.systemStatus.systems[3],
  name: 'කාර්ය මණ්ඩල සමාලෝචන ප්‍රවේශය',
  description: 'මහජන වාර්තා create-only වන අතර, staff roles සමාලෝචනය සහ පසු විමසීම කළමනාකරණය කරයි.',
  statusMessage: 'Live submissions සඳහා hosting update සමඟ Firestore rules deploy කරන්න.'
};

si.contacts.title = 'මුහුදු මෙහෙයුම් සම්බන්ධතා';
si.contacts.description =
  'වහාම අවදානමක් තිබේ නම් ජාතික හදිසි අංක භාවිතා කර, පසුව සාක්ෂි සහ පසු විමසීම් NARA වෙත යවන්න.';
si.contacts.items[0].name = 'විපත් කළමනාකරණ මධ්‍යස්ථානය';
si.contacts.items[0].description = 'හදිසි විපත් සම්බන්ධීකරණය සඳහා ජාතික දුරකථන මධ්‍යස්ථානය.';
si.contacts.items[1].name = 'ශ්‍රී ලංකා පොලිස් හදිසි සේවාව';
si.contacts.items[1].description = 'වහාම මහජන ආරක්ෂාවට අවදානම් සඳහා පොලිස් හදිසි ප්‍රතිචාර.';
si.contacts.items[2].name = 'ගිලන් රථ / වෛද්‍ය හදිසි සේවාව';
si.contacts.items[2].description = 'වහාම වෛද්‍ය හදිසි සහ ගිලන් රථ සහාය.';
si.contacts.items[3].name = 'NARA මුහුදු වාර්තා කිරීමේ කවුළුව';
si.contacts.items[3].description = 'මුහුදු හා වෙරළ සාක්ෂි, පැමිණිලි සහ සේවා පසු විමසීම්.';

si.preparedness.title = 'සූදානම් හා පුහුණු කාර්ය සංග්‍රහය';
si.preparedness.description =
  'සිහිනැල්ලෙන් සුදුසු පසුගිය SOP, ලැයිස්තු හා ප්‍රජා පුහුණු සැලසුම් පරිවර්තනයන් සමඟ වාර්ෂික වරක් යාවත්කාලීන කරයි.';
si.preparedness.items[0].title = 'වෙරළ ඉවත්වීමේ ක්ෂේත්‍ර මාර්ගෝපදේශය';
si.preparedness.items[0].description = 'GN නිලධාරින් හා වරාය ප්‍රධාන සඳහා පියවරෙන් පියවර ක්‍රියාමාර්ග අත්පොත.';
si.preparedness.items[1].title = 'පාරිසරික බලපෑම් ඉක්මන් ඇගයීම් ලැයිස්තුව';
si.preparedness.items[2].title = 'ප්‍රජා අනතුරු ඇඟවීම් පුහුණු ඉක්මන් සටහන';
si.preparedness.items[2].description = 'සමබර පණිවිඩ සමඟ වෙරළ අනතුරු ඇඟවීම් පුහුණු සැලසුම් කිරීමට එක් පිටු සටහන.';

si.situationRoom.title = 'නිවැරදි හදිසි මාර්ගය තෝරන්න';
si.situationRoom.description =
  'වහාම අවදානමක් තිබේ නම් පළමුව අමතන්න. සාක්ෂි, පාරිසරික වාර්තා හෝ සේවා පැමිණිලි සඳහා අදාල form භාවිතා කර යොමු අංකය තබා ගන්න.';
si.situationRoom.actions[0].label = 'DMC 117 අමතන්න';
si.situationRoom.actions[1].label = 'පැමිණිලි / සහාය යවන්න';
si.situationRoom.actions[2].label = 'ඉවත්වීමේ යොමු සටහන බාගන්න';

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
