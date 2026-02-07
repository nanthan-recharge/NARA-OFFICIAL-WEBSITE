const { bucket } = require('../config/firebase');
const logger = require('../config/logger');
const RetryStrategy = require('../utils/retry');
const config = require('../config');

class StorageService {
  constructor() {
    this.retry = new RetryStrategy(config.worker.maxRetries, config.worker.retryDelay);
  }

  // Generate storage path
  generatePath(barcode, category, title) {
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    
    return `pdfs/${category}/${barcode}-${sanitized}.pdf`;
  }

  // Upload buffer to Firebase Storage
  async uploadPDF(buffer, destinationPath) {
    return this.retry.execute(async () => {
      logger.info(`Uploading to Firebase: ${destinationPath}`);

      const file = bucket.file(destinationPath);
      
      await file.save(buffer, {
        metadata: {
          contentType: 'application/pdf',
          metadata: {
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'nara-library-agent'
          }
        }
      });

      logger.info(`Successfully uploaded: ${destinationPath}`);
      return destinationPath;

    }, `Upload to ${destinationPath}`);
  }

  // Generate signed URL (valid for 7 days)
  async generateSignedUrl(filePath, expirationDays = 7) {
    try {
      const file = bucket.file(filePath);
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expirationDays * 24 * 60 * 60 * 1000
      });

      return url;

    } catch (error) {
      logger.error('Failed to generate signed URL:', error);
      return null;
    }
  }

  // Make file public (optional)
  async makePublic(filePath) {
    try {
      const file = bucket.file(filePath);
      await file.makePublic();
      return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    } catch (error) {
      logger.error('Failed to make file public:', error);
      return null;
    }
  }

  // Check if file exists
  async fileExists(filePath) {
    try {
      const file = bucket.file(filePath);
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      logger.error('Error checking file existence:', error);
      return false;
    }
  }
}

module.exports = new StorageService();

