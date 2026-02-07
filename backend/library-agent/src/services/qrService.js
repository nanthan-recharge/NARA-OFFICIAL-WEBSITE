const QRCode = require('qrcode');
const { bucket } = require('../config/firebase');
const logger = require('../config/logger');

class QRService {
  // Generate QR code as buffer
  async generateQRCode(barcode) {
    try {
      logger.debug(`Generating QR code for barcode: ${barcode}`);
      
      const qrBuffer = await QRCode.toBuffer(barcode, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return qrBuffer;

    } catch (error) {
      logger.error('QR code generation failed:', error);
      throw error;
    }
  }

  // Upload QR code to Firebase Storage
  async uploadQRCode(barcode, qrBuffer) {
    try {
      const filePath = `qr-codes/${barcode}.png`;
      logger.info(`Uploading QR code to Firebase: ${filePath}`);

      const file = bucket.file(filePath);
      
      await file.save(qrBuffer, {
        metadata: {
          contentType: 'image/png',
          metadata: {
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'nara-library-agent',
            barcode: barcode
          }
        }
      });

      logger.info(`QR code uploaded successfully: ${filePath}`);
      return filePath;

    } catch (error) {
      logger.error('QR code upload failed:', error);
      throw error;
    }
  }

  // Generate signed URL for QR code
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
      logger.error('Failed to generate QR signed URL:', error);
      return null;
    }
  }

  // Complete QR code generation and upload
  async generateAndUpload(barcode) {
    try {
      // Generate QR code
      const qrBuffer = await this.generateQRCode(barcode);
      
      // Upload to Firebase
      const filePath = await this.uploadQRCode(barcode, qrBuffer);
      
      // Generate signed URL
      const signedUrl = await this.generateSignedUrl(filePath);
      
      logger.info(`QR code complete for barcode: ${barcode}`);
      
      return {
        filePath,
        url: signedUrl
      };

    } catch (error) {
      logger.error('QR code generation and upload failed:', error);
      throw error;
    }
  }
}

module.exports = new QRService();

