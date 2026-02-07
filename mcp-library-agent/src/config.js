/**
 * NARA Library MCP Agent Configuration
 * Manages all settings for the ocean science book fetcher
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

export const config = {
  // API Keys
  apis: {
    core: {
      apiKey: process.env.CORE_API_KEY || '',
      baseUrl: 'https://api.core.ac.uk/v3',
      enabled: true
    },
    crossref: {
      email: process.env.CROSSREF_EMAIL || 'library@nara.ac.lk',
      baseUrl: 'https://api.crossref.org',
      enabled: true
    },
    openalex: {
      email: process.env.OPENALEX_EMAIL || 'library@nara.ac.lk',
      baseUrl: 'https://api.openalex.org',
      enabled: true
    },
    openLibrary: {
      baseUrl: 'https://openlibrary.org',
      enabled: process.env.OPENLIBRARY_ENABLED !== 'false'
    },
    internetArchive: {
      baseUrl: 'https://archive.org',
      enabled: process.env.INTERNET_ARCHIVE_ENABLED !== 'false'
    },
    // Directory of Open Access Books
    doab: {
      baseUrl: 'https://www.doabooks.org/api',
      enabled: true
    }
  },

  // Search Configuration
  search: {
    keywords: (process.env.SEARCH_KEYWORDS ||
      'marine biology,oceanography,fisheries,aquaculture,coral reef,ocean conservation,marine ecology,aquatic resources,bay of bengal,indian ocean,sri lanka marine,fish species,coastal management,marine biodiversity'
    ).split(',').map(k => k.trim()),

    // Ocean science specific subjects
    subjects: [
      'Marine biology',
      'Oceanography',
      'Fisheries',
      'Aquaculture',
      'Marine ecology',
      'Ocean science',
      'Coastal management',
      'Marine conservation',
      'Fish biology',
      'Coral reefs',
      'Marine mammals',
      'Sea turtles',
      'Sharks',
      'Ocean pollution',
      'Climate change',
      'Bay of Bengal',
      'Indian Ocean',
      'Sri Lanka fisheries'
    ],

    maxItemsPerSource: parseInt(process.env.MAX_ITEMS_PER_SOURCE) || 50
  },

  // Material Types Mapping
  materialTypes: {
    book: { code: 'EBOOK', name: 'E-Books' },
    journal: { code: 'JR', name: 'Journal Articles' },
    thesis: { code: 'THESIS', name: 'Theses & Dissertations' },
    report: { code: 'RNARA', name: 'NARA Reports' },
    paper: { code: 'RPAPER', name: 'Research Papers' },
    bobp: { code: 'BOBP', name: 'BOBP Reports' },
    fao: { code: 'FAO', name: 'FAO Documents' }
  },

  // Output Configuration
  output: {
    cataloguePath: resolve(__dirname, process.env.CATALOGUE_OUTPUT_PATH || '../../public/library_catalogue.json'),
    logLevel: process.env.LOG_LEVEL || 'info'
  },

  // Schedule
  schedule: {
    cron: process.env.UPDATE_SCHEDULE || '0 2 * * *' // Default: 2 AM daily
  },

  // Barcode Generation
  barcode: {
    prefix: 'NARA',
    length: 14
  }
};

export default config;
