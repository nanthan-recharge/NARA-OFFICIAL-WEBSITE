/**
 * Open Library Data Source
 * Fetches free ocean science books from OpenLibrary.org
 */

import axios from 'axios';
import { config } from '../config.js';
import { logger, sleep, generateBarcode, extractYear, cleanAbstract, determineMaterialType } from '../utils.js';

const BASE_URL = config.apis.openLibrary.baseUrl;

/**
 * Search Open Library for ocean science books
 */
export async function searchOpenLibrary(query, limit = 20) {
  try {
    logger.info(`Searching Open Library for: "${query}"`);

    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        q: query,
        limit: limit,
        fields: 'key,title,author_name,first_publish_year,isbn,subject,language,publisher,number_of_pages_median,ia,cover_i'
      },
      timeout: 30000
    });

    if (!response.data?.docs) {
      return [];
    }

    const books = response.data.docs
      .filter(doc => doc.ia || doc.cover_i) // Only books with Internet Archive links or covers
      .map(doc => transformOpenLibraryBook(doc));

    logger.success(`Found ${books.length} books from Open Library for "${query}"`);
    return books;
  } catch (error) {
    logger.error(`Open Library search failed for "${query}":`, error.message);
    return [];
  }
}

/**
 * Get book details from Open Library
 */
export async function getBookDetails(workKey) {
  try {
    const response = await axios.get(`${BASE_URL}${workKey}.json`, {
      timeout: 15000
    });

    return response.data;
  } catch (error) {
    logger.debug(`Failed to get details for ${workKey}:`, error.message);
    return null;
  }
}

/**
 * Transform Open Library book to NARA catalogue format
 */
function transformOpenLibraryBook(doc) {
  const hasInternetArchive = doc.ia && doc.ia.length > 0;
  const iaId = hasInternetArchive ? doc.ia[0] : null;

  // Build PDF/Read URL
  let pdfUrl = null;
  let readUrl = null;

  if (iaId) {
    pdfUrl = `https://archive.org/download/${iaId}/${iaId}.pdf`;
    readUrl = `https://archive.org/details/${iaId}`;
  }

  // Build cover URL
  let coverUrl = null;
  if (doc.cover_i) {
    coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
  }

  const materialType = determineMaterialType({ title: doc.title, type: 'book' }, 'openlibrary');

  return {
    id: null, // Will be assigned during catalogue update
    title: doc.title || 'Untitled',
    subtitle: null,
    author: JSON.stringify({ name: doc.author_name?.join(', ') || 'Unknown Author' }),
    additional_authors: doc.author_name?.length > 1 ? doc.author_name.slice(1).join(', ') : null,
    isbn: doc.isbn?.[0] || null,
    issn: null,
    publication_year: doc.first_publish_year || null,
    publisher: doc.publisher?.[0] || 'Open Library',
    edition: null,
    pages: doc.number_of_pages_median || null,
    language: doc.language?.[0] || 'English',
    material_type_id: null,
    material_type_code: materialType.code,
    material_type_name: materialType.name,
    subject_headings: doc.subject?.slice(0, 10) || null,
    keywords: doc.subject?.slice(0, 20) || null,
    abstract: doc.subject ? `Topics: ${doc.subject.slice(0, 5).join(', ')}` : null,
    call_number: null,
    location: 'Digital Library',
    shelf_location: 'Open Access Collection',
    barcode: generateBarcode(),
    acquisition_date: new Date().toISOString(),
    url: pdfUrl || readUrl,
    read_url: readUrl,
    cover_url: coverUrl,
    qr_code_url: null,
    download_source: 'OpenLibrary',
    source_url: `${BASE_URL}${doc.key}`,
    source_id: doc.key,
    file_hash: null,
    page_count: doc.number_of_pages_median || null,
    status: 'available',
    access_type: 'open_access',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Fetch all ocean science books from Open Library
 */
export async function fetchOceanScienceBooks() {
  if (!config.apis.openLibrary.enabled) {
    logger.info('Open Library source is disabled');
    return [];
  }

  const allBooks = [];
  const keywords = config.search.keywords;
  const maxPerKeyword = Math.ceil(config.search.maxItemsPerSource / keywords.length);

  for (const keyword of keywords) {
    try {
      const books = await searchOpenLibrary(`${keyword} subject:science`, maxPerKeyword);
      allBooks.push(...books);
      await sleep(1000); // Rate limiting
    } catch (error) {
      logger.error(`Failed to fetch for keyword "${keyword}":`, error.message);
    }
  }

  // Deduplicate by title
  const uniqueBooks = Array.from(
    new Map(allBooks.map(book => [book.title.toLowerCase(), book])).values()
  );

  logger.success(`Total unique books from Open Library: ${uniqueBooks.length}`);
  return uniqueBooks;
}

export default {
  searchOpenLibrary,
  getBookDetails,
  fetchOceanScienceBooks
};
