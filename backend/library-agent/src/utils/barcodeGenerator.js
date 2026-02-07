const { query } = require('../config/database');
const logger = require('../config/logger');

class BarcodeGenerator {
  // Generate unique barcode: NARA + timestamp + random
  static generate() {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `NARA${timestamp}${random}`;
  }

  // Check if barcode exists in database
  static async exists(barcode) {
    try {
      const result = await query(
        'SELECT barcode FROM bibliographic_records WHERE barcode = $1',
        [barcode]
      );
      return result.rows.length > 0;
    } catch (error) {
      logger.error('Error checking barcode existence:', error);
      return false;
    }
  }

  // Generate unique barcode (with retry if duplicate)
  static async generateUnique(maxAttempts = 5) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const barcode = this.generate();
      const isDuplicate = await this.exists(barcode);
      
      if (!isDuplicate) {
        logger.debug(`Generated unique barcode: ${barcode}`);
        return barcode;
      }
      
      logger.warn(`Barcode ${barcode} already exists, retrying...`);
    }
    
    throw new Error('Failed to generate unique barcode after maximum attempts');
  }
}

module.exports = BarcodeGenerator;

