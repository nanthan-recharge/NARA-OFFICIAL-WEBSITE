/**
 * Utility functions for NARA Library MCP Agent
 */

import crypto from 'crypto';
import { config } from './config.js';

/**
 * Generate unique NARA barcode
 */
export function generateBarcode() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${config.barcode.prefix}${timestamp}${random}`.toUpperCase().slice(0, config.barcode.length);
}

/**
 * Generate file hash for deduplication
 */
export function generateFileHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Generate content hash from metadata for deduplication
 */
export function generateMetadataHash(item) {
  const content = `${item.title || ''}|${item.author || ''}|${item.isbn || ''}|${item.doi || ''}`.toLowerCase();
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Sanitize filename for storage
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9\-_.]/gi, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

/**
 * Parse author string to structured format
 */
export function parseAuthor(authorStr) {
  if (!authorStr) return { name: 'Unknown Author' };
  if (typeof authorStr === 'object') return authorStr;

  // Try to parse JSON
  try {
    return JSON.parse(authorStr);
  } catch {
    return { name: authorStr };
  }
}

/**
 * Extract year from various date formats
 */
export function extractYear(dateStr) {
  if (!dateStr) return null;
  const yearMatch = String(dateStr).match(/\d{4}/);
  return yearMatch ? parseInt(yearMatch[0]) : null;
}

/**
 * Determine material type from source and metadata
 */
export function determineMaterialType(item, source) {
  const title = (item.title || '').toLowerCase();
  const type = (item.type || '').toLowerCase();

  if (type.includes('thesis') || type.includes('dissertation') || title.includes('thesis')) {
    return config.materialTypes.thesis;
  }
  if (type.includes('journal') || type.includes('article') || item.journal) {
    return config.materialTypes.journal;
  }
  if (type.includes('report') || title.includes('report')) {
    if (source === 'fao' || title.includes('fao')) {
      return config.materialTypes.fao;
    }
    if (title.includes('bobp') || title.includes('bay of bengal')) {
      return config.materialTypes.bobp;
    }
    return config.materialTypes.report;
  }
  if (type.includes('paper') || type.includes('conference')) {
    return config.materialTypes.paper;
  }

  return config.materialTypes.book;
}

/**
 * Sleep helper for rate limiting
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Logger with levels
 */
export const logger = {
  info: (...args) => {
    if (['info', 'debug'].includes(config.output.logLevel)) {
      console.log(`[INFO] ${new Date().toISOString()}`, ...args);
    }
  },
  error: (...args) => {
    console.error(`[ERROR] ${new Date().toISOString()}`, ...args);
  },
  debug: (...args) => {
    if (config.output.logLevel === 'debug') {
      console.log(`[DEBUG] ${new Date().toISOString()}`, ...args);
    }
  },
  success: (...args) => {
    console.log(`[SUCCESS] ${new Date().toISOString()}`, ...args);
  },
  warn: (...args) => {
    console.warn(`[WARN] ${new Date().toISOString()}`, ...args);
  }
};

/**
 * Validate URL
 */
export function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clean abstract text
 */
export function cleanAbstract(text) {
  if (!text) return null;
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 2000); // Limit length
}

export default {
  generateBarcode,
  generateFileHash,
  generateMetadataHash,
  sanitizeFilename,
  parseAuthor,
  extractYear,
  determineMaterialType,
  sleep,
  logger,
  isValidUrl,
  cleanAbstract
};
