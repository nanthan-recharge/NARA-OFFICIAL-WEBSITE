const crypto = require('crypto');
const pdfParse = require('pdf-parse');
const logger = require('../config/logger');

class PDFValidator {
  // Validate PDF magic bytes
  static isPDF(buffer) {
    const pdfSignature = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF-
    return buffer.slice(0, 4).equals(pdfSignature);
  }

  // Validate file size
  static isWithinSizeLimit(sizeBytes, maxSizeMB = 50) {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return sizeBytes <= maxBytes;
  }

  // Extract PDF metadata
  static async extractMetadata(buffer) {
    try {
      const data = await pdfParse(buffer);
      return {
        pages: data.numpages,
        info: data.info || {},
        text: data.text ? data.text.substring(0, 500) : '', // First 500 chars
        isValid: true
      };
    } catch (error) {
      logger.error('PDF metadata extraction failed:', error.message);
      return { isValid: false, error: error.message };
    }
  }

  // Calculate file hash
  static calculateHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Complete validation
  static async validate(buffer, maxSizeMB = 50) {
    const results = {
      isValid: false,
      errors: [],
      metadata: null,
      hash: null
    };

    // Check if buffer exists
    if (!buffer || buffer.length === 0) {
      results.errors.push('Empty or null buffer');
      return results;
    }

    // Validate PDF signature
    if (!this.isPDF(buffer)) {
      results.errors.push('Invalid PDF signature');
      return results;
    }

    // Validate size
    if (!this.isWithinSizeLimit(buffer.length, maxSizeMB)) {
      results.errors.push(`File size exceeds ${maxSizeMB}MB limit`);
      return results;
    }

    // Extract metadata
    const metadata = await this.extractMetadata(buffer);
    if (!metadata.isValid) {
      results.errors.push('PDF parsing failed');
      return results;
    }

    // Calculate hash
    results.hash = this.calculateHash(buffer);
    results.metadata = metadata;
    results.isValid = true;

    return results;
  }
}

module.exports = PDFValidator;

