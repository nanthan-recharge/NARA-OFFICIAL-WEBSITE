/**
 * NARA Library Catalogue Updater
 * Manages the library catalogue JSON file
 */

import fs from 'fs/promises';
import path from 'path';
import { config } from './config.js';
import { logger, generateMetadataHash, generateBarcode } from './utils.js';

/**
 * Load existing catalogue
 */
export async function loadCatalogue() {
  try {
    const data = await fs.readFile(config.output.cataloguePath, 'utf-8');
    const catalogue = JSON.parse(data);
    logger.info(`Loaded existing catalogue with ${catalogue.length} items`);
    return catalogue;
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.info('No existing catalogue found, starting fresh');
      return [];
    }
    logger.error('Failed to load catalogue:', error.message);
    throw error;
  }
}

/**
 * Save catalogue to file
 */
export async function saveCatalogue(catalogue) {
  try {
    // Ensure directory exists
    const dir = path.dirname(config.output.cataloguePath);
    await fs.mkdir(dir, { recursive: true });

    // Create backup
    try {
      const backupPath = config.output.cataloguePath.replace('.json', `.backup-${Date.now()}.json`);
      await fs.copyFile(config.output.cataloguePath, backupPath);
      logger.info(`Created backup: ${backupPath}`);
    } catch {
      // No backup needed if file doesn't exist
    }

    // Save new catalogue
    await fs.writeFile(
      config.output.cataloguePath,
      JSON.stringify(catalogue, null, 2),
      'utf-8'
    );

    logger.success(`Saved catalogue with ${catalogue.length} items`);
    return true;
  } catch (error) {
    logger.error('Failed to save catalogue:', error.message);
    throw error;
  }
}

/**
 * Build hash index for deduplication
 */
function buildHashIndex(catalogue) {
  const index = new Map();

  for (const item of catalogue) {
    // Hash by title + author
    const hash = generateMetadataHash(item);
    index.set(hash, item.id);

    // Also index by source_id if available
    if (item.source_id) {
      index.set(`source:${item.source_id}`, item.id);
    }

    // Index by ISBN
    if (item.isbn) {
      index.set(`isbn:${item.isbn}`, item.id);
    }

    // Index by DOI
    if (item.doi) {
      index.set(`doi:${item.doi}`, item.id);
    }

    // Index by barcode
    if (item.barcode) {
      index.set(`barcode:${item.barcode}`, item.id);
    }
  }

  return index;
}

/**
 * Check if item already exists in catalogue
 */
function isDuplicate(item, hashIndex) {
  // Check by metadata hash
  const hash = generateMetadataHash(item);
  if (hashIndex.has(hash)) return true;

  // Check by source_id
  if (item.source_id && hashIndex.has(`source:${item.source_id}`)) return true;

  // Check by ISBN
  if (item.isbn && hashIndex.has(`isbn:${item.isbn}`)) return true;

  // Check by DOI
  if (item.doi && hashIndex.has(`doi:${item.doi}`)) return true;

  return false;
}

/**
 * Get next available ID
 */
function getNextId(catalogue) {
  if (catalogue.length === 0) return 1;

  const maxId = Math.max(...catalogue.map(item =>
    typeof item.id === 'number' ? item.id : parseInt(item.id) || 0
  ));

  return maxId + 1;
}

/**
 * Merge new items into catalogue
 */
export async function mergeCatalogue(existingCatalogue, newItems) {
  const hashIndex = buildHashIndex(existingCatalogue);
  const addedItems = [];
  const skippedItems = [];
  let nextId = getNextId(existingCatalogue);

  for (const item of newItems) {
    if (isDuplicate(item, hashIndex)) {
      skippedItems.push(item.title);
      continue;
    }

    // Assign ID and ensure barcode
    const newItem = {
      ...item,
      id: nextId++,
      barcode: item.barcode || generateBarcode()
    };

    addedItems.push(newItem);

    // Update hash index
    const hash = generateMetadataHash(newItem);
    hashIndex.set(hash, newItem.id);

    if (newItem.source_id) {
      hashIndex.set(`source:${newItem.source_id}`, newItem.id);
    }
  }

  const updatedCatalogue = [...existingCatalogue, ...addedItems];

  logger.info(`Merge complete: ${addedItems.length} added, ${skippedItems.length} duplicates skipped`);

  return {
    catalogue: updatedCatalogue,
    added: addedItems,
    skipped: skippedItems
  };
}

/**
 * Get catalogue statistics
 */
export function getCatalogueStats(catalogue) {
  const stats = {
    total: catalogue.length,
    byMaterialType: {},
    byLanguage: {},
    byYear: {},
    bySource: {},
    openAccess: 0,
    withPdf: 0
  };

  for (const item of catalogue) {
    // By material type
    const mtCode = item.material_type_code || 'UNKNOWN';
    stats.byMaterialType[mtCode] = (stats.byMaterialType[mtCode] || 0) + 1;

    // By language
    const lang = item.language || 'Unknown';
    stats.byLanguage[lang] = (stats.byLanguage[lang] || 0) + 1;

    // By year
    if (item.publication_year) {
      stats.byYear[item.publication_year] = (stats.byYear[item.publication_year] || 0) + 1;
    }

    // By source
    const source = item.download_source || 'Unknown';
    stats.bySource[source] = (stats.bySource[source] || 0) + 1;

    // Open access
    if (item.access_type === 'open_access') {
      stats.openAccess++;
    }

    // With PDF
    if (item.url && (item.url.includes('.pdf') || item.url.includes('download'))) {
      stats.withPdf++;
    }
  }

  return stats;
}

/**
 * Filter catalogue by criteria
 */
export function filterCatalogue(catalogue, criteria) {
  return catalogue.filter(item => {
    if (criteria.materialType && item.material_type_code !== criteria.materialType) {
      return false;
    }
    if (criteria.language && item.language !== criteria.language) {
      return false;
    }
    if (criteria.year && item.publication_year !== criteria.year) {
      return false;
    }
    if (criteria.source && item.download_source !== criteria.source) {
      return false;
    }
    if (criteria.openAccessOnly && item.access_type !== 'open_access') {
      return false;
    }
    return true;
  });
}

/**
 * Search catalogue
 */
export function searchCatalogue(catalogue, query) {
  const searchQuery = query.toLowerCase();

  return catalogue.filter(item => {
    const title = (item.title || '').toLowerCase();
    const author = (item.author || '').toLowerCase();
    const abstract = (item.abstract || '').toLowerCase();
    const keywords = (item.keywords || []).join(' ').toLowerCase();

    return title.includes(searchQuery) ||
           author.includes(searchQuery) ||
           abstract.includes(searchQuery) ||
           keywords.includes(searchQuery);
  });
}

export default {
  loadCatalogue,
  saveCatalogue,
  mergeCatalogue,
  getCatalogueStats,
  filterCatalogue,
  searchCatalogue
};
