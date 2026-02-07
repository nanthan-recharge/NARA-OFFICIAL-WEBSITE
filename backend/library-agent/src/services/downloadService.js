const axios = require('axios');
const config = require('../config');
const logger = require('../config/logger');
const PDFValidator = require('../utils/validator');
const RetryStrategy = require('../utils/retry');

class DownloadService {
  constructor() {
    this.retry = new RetryStrategy(config.worker.maxRetries, config.worker.retryDelay);
    this.maxFileSizeMB = config.download.maxFileSizeMB;
  }

  // Download PDF to buffer
  async downloadPDF(url) {
    return this.retry.execute(async () => {
      logger.info(`Downloading PDF from: ${url}`);

      // Check file size first
      try {
        const headResponse = await axios.head(url, { timeout: 10000 });
        const contentLength = parseInt(headResponse.headers['content-length'], 10);
        
        if (contentLength) {
          const sizeMB = contentLength / (1024 * 1024);
          if (sizeMB > this.maxFileSizeMB) {
            throw new Error(`File too large: ${sizeMB.toFixed(2)}MB (max: ${this.maxFileSizeMB}MB)`);
          }
        }
      } catch (headError) {
        logger.warn('HEAD request failed, proceeding with download:', headError.message);
      }

      // Download file
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        timeout: 60000, // 60 seconds
        maxContentLength: this.maxFileSizeMB * 1024 * 1024,
        headers: {
          'User-Agent': 'NARA-Library-Agent/1.0 (marine-library@nara.gov.lk)'
        }
      });

      const buffer = Buffer.from(response.data);
      logger.info(`Downloaded ${(buffer.length / 1024).toFixed(2)} KB from ${url}`);

      return buffer;

    }, `Download from ${url}`);
  }

  // Download and validate PDF
  async downloadAndValidate(url) {
    const buffer = await this.downloadPDF(url);
    
    // Validate
    const validation = await PDFValidator.validate(buffer, this.maxFileSizeMB);
    
    if (!validation.isValid) {
      throw new Error(`PDF validation failed: ${validation.errors.join(', ')}`);
    }

    logger.info('PDF validation passed', {
      size: buffer.length,
      pages: validation.metadata.pages,
      hash: validation.hash
    });

    return {
      buffer,
      validation
    };
  }
}

module.exports = new DownloadService();

