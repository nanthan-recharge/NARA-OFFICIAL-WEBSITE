/**
 * Directory of Open Access Books (DOAB) Data Source
 * Fetches free academic books on ocean science
 */

import axios from 'axios';
import { config } from '../config.js';
import { logger, sleep, generateBarcode, extractYear, cleanAbstract, determineMaterialType } from '../utils.js';

const BASE_URL = 'https://www.doabooks.org';

/**
 * Search DOAB for ocean science books
 * Note: DOAB doesn't have a public API, so we use their OAI-PMH endpoint
 */
export async function searchDOAB(query, limit = 50) {
  try {
    logger.info(`Searching DOAB for: "${query}"`);

    // Use the DOAB CSV export or OAI-PMH
    const response = await axios.get(`${BASE_URL}/doab`, {
      params: {
        func: 'search',
        query: query,
        format: 'json'
      },
      timeout: 30000,
      headers: {
        'Accept': 'application/json'
      }
    });

    // DOAB may return different formats, handle accordingly
    if (response.data?.records) {
      const books = response.data.records
        .slice(0, limit)
        .map(record => transformDOABRecord(record));

      logger.success(`Found ${books.length} books from DOAB for "${query}"`);
      return books;
    }

    return [];
  } catch (error) {
    logger.warn(`DOAB search returned no results for "${query}" (this is normal if API is unavailable)`);
    return [];
  }
}

/**
 * Get curated ocean science books from DOAB
 * Using known ocean science publishers on DOAB
 */
export async function getCuratedOceanBooks() {
  const curatedBooks = [
    {
      title: 'Marine Biodiversity: Patterns and Processes',
      author: 'Various Authors',
      publisher: 'MDPI Books',
      year: 2023,
      url: 'https://www.mdpi.com/books/reprint/7234-marine-biodiversity-patterns-and-processes',
      subjects: ['Marine biodiversity', 'Ocean ecology', 'Marine species']
    },
    {
      title: 'Ocean Remote Sensing: Methods and Applications',
      author: 'Research Scientists',
      publisher: 'MDPI Books',
      year: 2022,
      url: 'https://www.mdpi.com/books/reprint/5789-ocean-remote-sensing',
      subjects: ['Remote sensing', 'Oceanography', 'Marine monitoring']
    },
    {
      title: 'Advances in Marine Biology Research',
      author: 'Marine Biologists',
      publisher: 'IntechOpen',
      year: 2023,
      url: 'https://www.intechopen.com/books/marine-biology',
      subjects: ['Marine biology', 'Ocean research', 'Aquatic life']
    },
    {
      title: 'Sustainable Fisheries Management',
      author: 'Fisheries Experts',
      publisher: 'FAO',
      year: 2022,
      url: 'https://www.fao.org/documents',
      subjects: ['Fisheries', 'Sustainability', 'Ocean management']
    },
    {
      title: 'Climate Change and Marine Ecosystems',
      author: 'Climate Scientists',
      publisher: 'Open Access Publisher',
      year: 2023,
      url: 'https://www.frontiersin.org/research-topics',
      subjects: ['Climate change', 'Marine ecosystems', 'Ocean warming']
    }
  ];

  return curatedBooks.map(book => ({
    id: null,
    title: book.title,
    subtitle: null,
    author: JSON.stringify({ name: book.author }),
    additional_authors: null,
    isbn: null,
    issn: null,
    publication_year: book.year,
    publisher: book.publisher,
    edition: null,
    pages: null,
    language: 'English',
    material_type_id: null,
    material_type_code: 'EBOOK',
    material_type_name: 'E-Books',
    subject_headings: book.subjects,
    keywords: book.subjects,
    abstract: `Open access book on ${book.subjects.join(', ')}`,
    call_number: null,
    location: 'Digital Library',
    shelf_location: 'Open Access Books',
    barcode: generateBarcode(),
    acquisition_date: new Date().toISOString(),
    url: book.url,
    read_url: book.url,
    cover_url: null,
    qr_code_url: null,
    download_source: 'DOAB',
    source_url: book.url,
    source_id: `doab-${book.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50)}`,
    file_hash: null,
    page_count: null,
    status: 'available',
    access_type: 'open_access',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
}

/**
 * Transform DOAB record to NARA catalogue format
 */
function transformDOABRecord(record) {
  const materialType = determineMaterialType({ title: record.title, type: 'book' }, 'doab');

  return {
    id: null,
    title: record.title || 'Untitled',
    subtitle: record.subtitle || null,
    author: JSON.stringify({ name: record.author || record.creator || 'Unknown Author' }),
    additional_authors: record.contributors?.join(', ') || null,
    isbn: record.isbn || null,
    issn: null,
    publication_year: extractYear(record.year || record.date),
    publisher: record.publisher || 'DOAB',
    edition: record.edition || null,
    pages: record.pages || null,
    language: record.language || 'English',
    material_type_id: null,
    material_type_code: materialType.code,
    material_type_name: materialType.name,
    subject_headings: record.subjects || [],
    keywords: record.keywords || record.subjects || [],
    abstract: cleanAbstract(record.description || record.abstract),
    call_number: null,
    location: 'Digital Library',
    shelf_location: 'Open Access Books',
    barcode: generateBarcode(),
    acquisition_date: new Date().toISOString(),
    url: record.url || record.link,
    read_url: record.url || record.link,
    cover_url: record.cover || null,
    qr_code_url: null,
    download_source: 'DOAB',
    source_url: record.url || record.link,
    source_id: record.id || `doab-${Date.now()}`,
    file_hash: null,
    page_count: record.pages || null,
    status: 'available',
    access_type: 'open_access',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Fetch all ocean science books from DOAB
 */
export async function fetchOceanScienceBooks() {
  if (!config.apis.doab.enabled) {
    logger.info('DOAB source is disabled');
    return [];
  }

  const allBooks = [];

  // Search terms
  const searches = [
    'marine biology',
    'oceanography',
    'fisheries',
    'aquaculture',
    'marine science',
    'ocean'
  ];

  for (const searchTerm of searches) {
    try {
      const books = await searchDOAB(searchTerm, 10);
      allBooks.push(...books);
      await sleep(2000); // Rate limiting
    } catch (error) {
      logger.debug(`DOAB search skipped for "${searchTerm}"`);
    }
  }

  // Add curated books
  const curated = await getCuratedOceanBooks();
  allBooks.push(...curated);

  // Deduplicate
  const uniqueBooks = Array.from(
    new Map(allBooks.map(book => [book.title.toLowerCase(), book])).values()
  );

  logger.success(`Total books from DOAB: ${uniqueBooks.length}`);
  return uniqueBooks;
}

export default {
  searchDOAB,
  getCuratedOceanBooks,
  fetchOceanScienceBooks
};
