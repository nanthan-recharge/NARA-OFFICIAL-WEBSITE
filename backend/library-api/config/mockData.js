// Mock data for demo mode (when database is not available)

const mockMaterialTypes = [
  { id: 1, code: 'ACT', name: 'Acts', circulating: true, loan_period_days: 14 },
  { id: 2, code: 'ATC', name: 'Atapattu Collection', circulating: true, loan_period_days: 14 },
  { id: 3, code: 'BOBP', name: 'BOBP Reports', circulating: true, loan_period_days: 14 },
  { id: 4, code: 'CD', name: 'CDs', circulating: true, loan_period_days: 7 },
  { id: 5, code: 'DMAP', name: 'Digital Map', circulating: true, loan_period_days: 14 },
  { id: 6, code: 'EBOOK', name: 'Electronic Books', circulating: true, loan_period_days: 21 },
  { id: 7, code: 'FAO', name: 'FAO Reports', circulating: true, loan_period_days: 14 },
  { id: 8, code: 'IOC', name: 'IOC Reports', circulating: true, loan_period_days: 14 },
  { id: 9, code: 'IWMI', name: 'IWMI Reports', circulating: true, loan_period_days: 14 },
  { id: 10, code: 'JR', name: 'Journal', circulating: true, loan_period_days: 7 },
  { id: 11, code: 'LBOOK', name: 'Lending Book', circulating: true, loan_period_days: 14 },
  { id: 12, code: 'MAP', name: 'Maps', circulating: true, loan_period_days: 14 },
  { id: 13, code: 'NEWS', name: 'Newspaper Articles', circulating: true, loan_period_days: 7 },
  { id: 14, code: 'PREF', name: 'Permanent Reference', circulating: false, loan_period_days: 0 },
  { id: 15, code: 'PROC', name: 'Proceedings', circulating: true, loan_period_days: 14 },
  { id: 16, code: 'UACOL', name: 'Prof. Upali Amarasinghe Collection', circulating: true, loan_period_days: 14 },
  { id: 17, code: 'RBOOK', name: 'Reference Book', circulating: false, loan_period_days: 0 },
  { id: 18, code: 'RPAPER', name: 'Research Papers', circulating: true, loan_period_days: 14 },
  { id: 19, code: 'RNARA', name: 'Research Reports - NARA', circulating: true, loan_period_days: 14 },
  { id: 20, code: 'SREF', name: 'Special Reference', circulating: false, loan_period_days: 0 },
  { id: 21, code: 'SLBOOK', name: 'Sri Lanka Collection - Books', circulating: true, loan_period_days: 14 },
  { id: 22, code: 'SLREP', name: 'Sri Lanka Collection - Reports', circulating: true, loan_period_days: 14 },
  { id: 23, code: 'THESIS', name: 'Thesis', circulating: true, loan_period_days: 21 },
  { id: 24, code: 'WFISH', name: 'World Fisheries Collection', circulating: true, loan_period_days: 14 },
  { id: 25, code: 'EJART', name: 'e-Journal Articles', circulating: true, loan_period_days: 21 },
  { id: 26, code: 'EREP', name: 'e-Reports', circulating: true, loan_period_days: 21 },
];

const mockCatalogueItems = [
  {
    id: 1,
    title: 'Marine Biology and Conservation',
    author: 'Dr. Silva',
    isbn: '978-1-234567-89-0',
    publisher: 'Ocean Press',
    publication_year: 2024,
    material_type_id: 11,
    material_type_name: 'Lending Book',
    total_copies: 3,
    available_copies: 2,
    location: 'Main Library',
    call_number: 'QH91.5 .S55 2024',
    abstract: 'A comprehensive guide to marine biology and conservation practices in tropical waters.',
    language: 'English'
  },
  {
    id: 2,
    title: 'Sustainable Fisheries Management',
    author: 'Prof. Fernando',
    isbn: '978-1-234567-90-6',
    publisher: 'Aquatic Research Publishers',
    publication_year: 2023,
    material_type_id: 19,
    material_type_name: 'Research Reports - NARA',
    total_copies: 5,
    available_copies: 5,
    location: 'Main Library',
    call_number: 'SH329 .F47 2023',
    abstract: 'Research report on sustainable fishing practices in Sri Lankan waters.',
    language: 'English'
  },
  {
    id: 3,
    title: 'Ocean Acidification and Coral Reefs',
    author: 'Dr. Perera',
    material_type_id: 23,
    material_type_name: 'Thesis',
    publication_year: 2024,
    total_copies: 1,
    available_copies: 1,
    location: 'Main Library',
    call_number: 'QE565 .P47 2024',
    abstract: 'PhD thesis examining the impact of ocean acidification on coral reef ecosystems.',
    language: 'English'
  }
];

const mockDashboardStats = {
  totalItems: 156,
  totalPatrons: 45,
  activeLoans: 23,
  overdueItems: 5,
  todayCheckouts: 12,
  todayCheckins: 8,
  pendingHolds: 7,
  unpaidFines: 2500.00
};

const mockFacets = {
  material_types: mockMaterialTypes.map(mt => ({
    id: mt.id,
    code: mt.code,
    name: mt.name,
    count: Math.floor(Math.random() * 50) + 1
  })),
  years: [
    { publication_year: 2024, count: 45 },
    { publication_year: 2023, count: 38 },
    { publication_year: 2022, count: 32 },
    { publication_year: 2021, count: 25 },
    { publication_year: 2020, count: 16 }
  ],
  languages: [
    { language: 'English', count: 120 },
    { language: 'Sinhala', count: 25 },
    { language: 'Tamil', count: 11 }
  ]
};

module.exports = {
  mockMaterialTypes,
  mockCatalogueItems,
  mockDashboardStats,
  mockFacets
};

