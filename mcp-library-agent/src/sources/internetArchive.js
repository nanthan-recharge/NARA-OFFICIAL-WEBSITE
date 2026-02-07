/**
 * Internet Archive Data Source
 * Fetches free ocean science books and documents from archive.org
 */

import axios from 'axios';
import { config } from '../config.js';
import { logger, sleep, generateBarcode, extractYear, cleanAbstract, determineMaterialType } from '../utils.js';

const BASE_URL = config.apis.internetArchive.baseUrl;

/**
 * Search Internet Archive for ocean science materials
 */
export async function searchInternetArchive(query, mediatype = 'texts', limit = 50) {
  try {
    logger.info(`Searching Internet Archive for: "${query}"`);

    const response = await axios.get(`${BASE_URL}/advancedsearch.php`, {
      params: {
        q: `${query} AND mediatype:${mediatype}`,
        fl: ['identifier', 'title', 'creator', 'date', 'description', 'subject', 'language', 'publisher', 'format', 'downloads', 'item_size'].join(','),
        sort: ['downloads desc'],
        rows: limit,
        page: 1,
        output: 'json'
      },
      timeout: 30000
    });

    if (!response.data?.response?.docs) {
      return [];
    }

    const items = response.data.response.docs
      .filter(doc => doc.identifier)
      .map(doc => transformArchiveItem(doc));

    logger.success(`Found ${items.length} items from Internet Archive for "${query}"`);
    return items;
  } catch (error) {
    logger.error(`Internet Archive search failed for "${query}":`, error.message);
    return [];
  }
}

/**
 * Get item metadata from Internet Archive
 */
export async function getItemMetadata(identifier) {
  try {
    const response = await axios.get(`${BASE_URL}/metadata/${identifier}`, {
      timeout: 15000
    });

    return response.data;
  } catch (error) {
    logger.debug(`Failed to get metadata for ${identifier}:`, error.message);
    return null;
  }
}

/**
 * Get available formats for an item
 */
export async function getItemFormats(identifier) {
  try {
    const metadata = await getItemMetadata(identifier);
    if (!metadata?.files) return [];

    return metadata.files
      .filter(f => f.format === 'PDF' || f.format === 'Text PDF')
      .map(f => ({
        name: f.name,
        format: f.format,
        size: f.size,
        url: `${BASE_URL}/download/${identifier}/${f.name}`
      }));
  } catch (error) {
    logger.debug(`Failed to get formats for ${identifier}:`, error.message);
    return [];
  }
}

/**
 * Transform Internet Archive item to NARA catalogue format
 */
function transformArchiveItem(doc) {
  const identifier = doc.identifier;

  // Build URLs
  const detailUrl = `${BASE_URL}/details/${identifier}`;
  const pdfUrl = `${BASE_URL}/download/${identifier}/${identifier}.pdf`;
  const streamUrl = `${BASE_URL}/stream/${identifier}`;
  const coverUrl = `${BASE_URL}/services/img/${identifier}`;

  // Parse date
  const year = extractYear(doc.date);

  // Parse creator
  let author = 'Unknown Author';
  if (doc.creator) {
    author = Array.isArray(doc.creator) ? doc.creator.join(', ') : doc.creator;
  }

  // Parse subjects
  let subjects = [];
  if (doc.subject) {
    subjects = Array.isArray(doc.subject) ? doc.subject : [doc.subject];
  }

  const materialType = determineMaterialType({ title: doc.title, type: 'book' }, 'internetarchive');

  return {
    id: null,
    title: doc.title || 'Untitled',
    subtitle: null,
    author: JSON.stringify({ name: author }),
    additional_authors: null,
    isbn: null,
    issn: null,
    publication_year: year,
    publisher: doc.publisher || 'Internet Archive',
    edition: null,
    pages: null,
    language: doc.language || 'English',
    material_type_id: null,
    material_type_code: materialType.code,
    material_type_name: materialType.name,
    subject_headings: subjects.slice(0, 10),
    keywords: subjects.slice(0, 20),
    abstract: cleanAbstract(doc.description),
    call_number: null,
    location: 'Digital Library',
    shelf_location: 'Internet Archive Collection',
    barcode: generateBarcode(),
    acquisition_date: new Date().toISOString(),
    url: pdfUrl,
    read_url: detailUrl,
    stream_url: streamUrl,
    cover_url: coverUrl,
    qr_code_url: null,
    download_source: 'InternetArchive',
    source_url: detailUrl,
    source_id: identifier,
    file_hash: null,
    file_size: doc.item_size || null,
    downloads_count: doc.downloads || 0,
    page_count: null,
    status: 'available',
    access_type: 'open_access',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Fetch all ocean science materials from Internet Archive
 */
export async function fetchOceanScienceMaterials() {
  if (!config.apis.internetArchive.enabled) {
    logger.info('Internet Archive source is disabled');
    return [];
  }

  const allItems = [];

  // Ocean science specific searches
  const searches = [
    'marine biology',
    'oceanography',
    'fisheries science',
    'aquaculture',
    'coral reef',
    'ocean science',
    'marine ecology',
    'bay of bengal',
    'indian ocean fish',
    'coastal fisheries',
    'marine conservation',
    'fish identification'
  ];

  const maxPerSearch = Math.ceil(config.search.maxItemsPerSource / searches.length);

  for (const searchTerm of searches) {
    try {
      const items = await searchInternetArchive(searchTerm, 'texts', maxPerSearch);
      allItems.push(...items);
      await sleep(1500); // Rate limiting
    } catch (error) {
      logger.error(`Failed to fetch "${searchTerm}":`, error.message);
    }
  }

  // Deduplicate by identifier
  const uniqueItems = Array.from(
    new Map(allItems.map(item => [item.source_id, item])).values()
  );

  logger.success(`Total unique items from Internet Archive: ${uniqueItems.length}`);
  return uniqueItems;
}

export default {
  searchInternetArchive,
  getItemMetadata,
  getItemFormats,
  fetchOceanScienceMaterials
};
