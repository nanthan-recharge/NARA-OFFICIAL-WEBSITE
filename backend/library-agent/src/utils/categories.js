// 26 NARA library categories (matching material_types table)
const NARA_CATEGORIES = [
  'Acts',
  'Atapattu Collection',
  'BOBP Reports',
  'CDs',
  'Digital Map',
  'Electronic Books',
  'FAO Reports',
  'IOC Reports',
  'IWMI Reports',
  'Journal',
  'Lending Book',
  'Maps',
  'Newspaper Articles',
  'Permanent Reference',
  'Proceedings',
  'Prof. Upali Amarasinghe Collection',
  'Reference Book',
  'Research Papers',
  'Research Reports - NARA',
  'Special Reference',
  'Sri Lanka Collection - Books',
  'Sri Lanka Collection - Reports',
  'Thesis',
  'World Fisheries Collection',
  'e-Journal Articles',
  'e-Reports'
];

// Map categories to best API sources
const CATEGORY_API_MAPPING = {
  'Acts': ['internetarchive', 'openlibrary'],
  'BOBP Reports': ['internetarchive', 'core'],
  'FAO Reports': ['internetarchive', 'core'],
  'IOC Reports': ['internetarchive', 'core'],
  'IWMI Reports': ['core', 'internetarchive'],
  'Journal': ['doaj', 'core'],
  'Research Papers': ['core', 'doaj'],
  'Thesis': ['core', 'internetarchive'],
  'e-Journal Articles': ['doaj', 'core'],
  'e-Reports': ['core', 'internetarchive'],
  'Electronic Books': ['openlibrary', 'internetarchive'],
  'Reference Book': ['openlibrary', 'internetarchive'],
  'Proceedings': ['core', 'internetarchive'],
  'Lending Book': ['openlibrary', 'internetarchive']
};

// Marine science keywords for each category (expanded for broader coverage)
const MARINE_KEYWORDS = {
  'Acts': ['fisheries act', 'marine conservation', 'coastal regulation', 'aquaculture law', 'ocean policy', 'fishing regulation', 'maritime law'],
  'Atapattu Collection': ['Sri Lanka fisheries', 'South Asian marine', 'tropical fish', 'coastal ecology', 'Indian ocean', 'aquaculture Asia'],
  'BOBP Reports': ['bay of bengal', 'fisheries management', 'marine resources', 'fishing communities', 'coastal development', 'small scale fisheries'],
  'CDs': ['marine data', 'oceanographic records', 'fisheries statistics', 'coastal mapping', 'aquatic database', 'ocean research'],
  'Digital Map': ['marine mapping', 'ocean cartography', 'coastal zone', 'bathymetric', 'fishing grounds', 'maritime boundaries', 'sea floor'],
  'Electronic Books': ['marine biology', 'oceanography', 'aquatic science', 'fisheries', 'coastal management', 'ocean conservation', 'sea life'],
  'FAO Reports': ['fisheries', 'aquaculture', 'marine resources', 'fishing industry', 'fish stocks', 'sustainable fisheries', 'food security'],
  'IOC Reports': ['oceanography', 'marine science', 'ocean research', 'coastal studies', 'sea level', 'ocean circulation', 'marine monitoring'],
  'IWMI Reports': ['water management', 'aquatic resources', 'irrigation', 'water conservation', 'freshwater', 'inland fisheries', 'wetlands'],
  'Journal': ['marine journal', 'ocean research', 'aquatic studies', 'fisheries science', 'coastal research', 'oceanographic journal'],
  'Lending Book': ['marine textbook', 'ocean handbook', 'fisheries guide', 'aquaculture manual', 'coastal ecology', 'sea biology'],
  'Maps': ['nautical chart', 'marine atlas', 'ocean map', 'coastal survey', 'fishing area', 'maritime map', 'bathymetry'],
  'Newspaper Articles': ['fisheries news', 'marine conservation', 'ocean pollution', 'coastal development', 'fishing industry', 'aquaculture', 'climate change ocean', 'marine species discovery', 'ocean technology', 'sustainable fishing', 'marine protected areas', 'ocean acidification news', 'coral bleaching'],
  'Permanent Reference': ['marine encyclopedia', 'ocean reference', 'fisheries handbook', 'aquatic compendium', 'coastal guide'],
  'Proceedings': ['marine conference', 'oceanography symposium', 'fisheries workshop', 'aquaculture meeting', 'coastal forum'],
  'Prof. Upali Amarasinghe Collection': ['inland fisheries', 'reservoir fish', 'Sri Lanka aquatic', 'tropical fish', 'freshwater ecology'],
  'Reference Book': ['marine handbook', 'ocean guide', 'fisheries manual', 'aquaculture reference', 'coastal management', 'sea life guide'],
  'Research Papers': ['marine biology', 'oceanography research', 'fisheries science', 'aquatic ecology', 'coastal study', 'ocean biodiversity', 'marine microbiology', 'coral reef research', 'deep sea research', 'marine biotechnology', 'ocean acidification', 'marine genomics', 'fish physiology', 'marine ecology'],
  'Research Reports - NARA': ['aquatic research', 'marine study', 'fisheries investigation', 'ocean survey', 'coastal analysis'],
  'Special Reference': ['marine monograph', 'ocean special', 'fisheries review', 'aquatic compilation', 'coastal assessment'],
  'Sri Lanka Collection - Books': ['Sri Lanka marine', 'Ceylon fisheries', 'Indian ocean', 'tropical coastal', 'South Asian aquatic'],
  'Sri Lanka Collection - Reports': ['Sri Lanka fisheries', 'coastal zone Sri Lanka', 'marine resources Ceylon', 'aquaculture Sri Lanka'],
  'Thesis': ['marine thesis', 'oceanography dissertation', 'fisheries research', 'aquaculture study', 'coastal ecology', 'ocean science', 'marine PhD', 'marine masters', 'fish biology thesis', 'ocean physics', 'marine chemistry dissertation'],
  'World Fisheries Collection': ['global fisheries', 'world aquaculture', 'international marine', 'fishing worldwide', 'ocean resources'],
  'e-Journal Articles': ['marine article', 'ocean paper', 'aquatic research', 'fisheries publication', 'coastal study', 'sea research', 'marine chemistry', 'ocean circulation', 'fishery management', 'marine ecosystem', 'ocean modeling', 'marine pollution', 'seawater quality', 'marine biodiversity'],
  'e-Reports': ['marine report', 'ocean assessment', 'fisheries survey', 'aquatic monitoring', 'coastal evaluation', 'sea study', 'marine environmental report', 'ocean health assessment', 'fishery stock assessment', 'marine ecosystem report', 'ocean research report', 'marine science bulletin']
};

module.exports = { 
  NARA_CATEGORIES, 
  CATEGORY_API_MAPPING, 
  MARINE_KEYWORDS 
};

