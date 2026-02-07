/**
 * OpenAlex Data Source
 * Fetches academic ocean science papers and books
 * OpenAlex is a free, open catalog of the world's scholarly works
 */

import axios from 'axios';
import { config } from '../config.js';
import { logger, sleep, generateBarcode, extractYear, cleanAbstract, determineMaterialType } from '../utils.js';

const BASE_URL = config.apis.openalex.baseUrl;
const EMAIL = config.apis.openalex.email;

/**
 * Search OpenAlex for ocean science works
 */
export async function searchOpenAlex(query, filter = {}, limit = 50) {
  try {
    logger.info(`Searching OpenAlex for: "${query}"`);

    const params = {
      search: query,
      per_page: limit,
      mailto: EMAIL,
      select: 'id,doi,title,display_name,publication_year,publication_date,type,authorships,open_access,primary_location,cited_by_count,abstract_inverted_index,concepts'
    };

    // Add filters
    if (filter.isOA) {
      params.filter = 'is_oa:true';
    }

    const response = await axios.get(`${BASE_URL}/works`, {
      params,
      timeout: 30000
    });

    if (!response.data?.results) {
      return [];
    }

    const works = response.data.results
      .filter(work => work.open_access?.is_oa || work.primary_location?.pdf_url)
      .map(work => transformOpenAlexWork(work));

    logger.success(`Found ${works.length} open access works from OpenAlex for "${query}"`);
    return works;
  } catch (error) {
    logger.error(`OpenAlex search failed for "${query}":`, error.message);
    return [];
  }
}

/**
 * Get work details by DOI
 */
export async function getWorkByDOI(doi) {
  try {
    const response = await axios.get(`${BASE_URL}/works/doi:${doi}`, {
      params: { mailto: EMAIL },
      timeout: 15000
    });

    return response.data;
  } catch (error) {
    logger.debug(`Failed to get work for DOI ${doi}:`, error.message);
    return null;
  }
}

/**
 * Reconstruct abstract from inverted index
 */
function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return null;

  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }

  return cleanAbstract(words.join(' '));
}

/**
 * Transform OpenAlex work to NARA catalogue format
 */
function transformOpenAlexWork(work) {
  // Get PDF URL
  let pdfUrl = null;
  let readUrl = null;

  if (work.open_access?.oa_url) {
    readUrl = work.open_access.oa_url;
  }

  if (work.primary_location?.pdf_url) {
    pdfUrl = work.primary_location.pdf_url;
  } else if (work.primary_location?.landing_page_url) {
    readUrl = work.primary_location.landing_page_url;
  }

  // Get authors
  const authors = work.authorships?.map(a => a.author?.display_name).filter(Boolean) || [];
  const primaryAuthor = authors[0] || 'Unknown Author';
  const additionalAuthors = authors.slice(1).join(', ') || null;

  // Get concepts/subjects
  const concepts = work.concepts?.map(c => c.display_name).filter(Boolean) || [];

  // Reconstruct abstract
  const abstract = reconstructAbstract(work.abstract_inverted_index);

  // Get publisher
  const publisher = work.primary_location?.source?.display_name || 'OpenAlex';

  const materialType = determineMaterialType({ title: work.title, type: work.type }, 'openalex');

  return {
    id: null,
    title: work.display_name || work.title || 'Untitled',
    subtitle: null,
    author: JSON.stringify({ name: primaryAuthor }),
    additional_authors: additionalAuthors,
    isbn: null,
    issn: work.primary_location?.source?.issn?.[0] || null,
    doi: work.doi?.replace('https://doi.org/', '') || null,
    publication_year: work.publication_year || extractYear(work.publication_date),
    publisher: publisher,
    edition: null,
    pages: null,
    language: 'English',
    material_type_id: null,
    material_type_code: materialType.code,
    material_type_name: materialType.name,
    subject_headings: concepts.slice(0, 10),
    keywords: concepts.slice(0, 20),
    abstract: abstract,
    call_number: null,
    location: 'Digital Library',
    shelf_location: 'Academic Collection',
    barcode: generateBarcode(),
    acquisition_date: new Date().toISOString(),
    url: pdfUrl || readUrl,
    read_url: readUrl,
    cover_url: null,
    qr_code_url: null,
    download_source: 'OpenAlex',
    source_url: work.id,
    source_id: work.id,
    file_hash: null,
    page_count: null,
    citations_count: work.cited_by_count || 0,
    status: 'available',
    access_type: work.open_access?.is_oa ? 'open_access' : 'restricted',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Fetch ocean science works from OpenAlex
 */
export async function fetchOceanScienceWorks() {
  if (!config.apis.openalex.enabled) {
    logger.info('OpenAlex source is disabled');
    return [];
  }

  const allWorks = [];

  // Ocean science specific searches with filter for open access
  const searches = [
    { query: 'marine biology research', filter: { isOA: true } },
    { query: 'oceanography study', filter: { isOA: true } },
    { query: 'fisheries management', filter: { isOA: true } },
    { query: 'aquaculture technology', filter: { isOA: true } },
    { query: 'coral reef conservation', filter: { isOA: true } },
    { query: 'marine ecology', filter: { isOA: true } },
    { query: 'ocean pollution', filter: { isOA: true } },
    { query: 'bay of bengal marine', filter: { isOA: true } },
    { query: 'indian ocean fisheries', filter: { isOA: true } },
    { query: 'sri lanka aquatic', filter: { isOA: true } }
  ];

  const maxPerSearch = Math.ceil(config.search.maxItemsPerSource / searches.length);

  for (const { query, filter } of searches) {
    try {
      const works = await searchOpenAlex(query, filter, maxPerSearch);
      allWorks.push(...works);
      await sleep(200); // OpenAlex is generous with rate limits
    } catch (error) {
      logger.error(`Failed to fetch "${query}":`, error.message);
    }
  }

  // Deduplicate by DOI or source_id
  const uniqueWorks = Array.from(
    new Map(allWorks.map(work => [work.doi || work.source_id, work])).values()
  );

  logger.success(`Total unique works from OpenAlex: ${uniqueWorks.length}`);
  return uniqueWorks;
}

export default {
  searchOpenAlex,
  getWorkByDOI,
  fetchOceanScienceWorks
};
