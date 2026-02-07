const { query } = require('../config/database');
const logger = require('../config/logger');

class BookService {
  // Get material type ID by name
  async getMaterialTypeId(categoryName) {
    try {
      const result = await query(
        'SELECT id FROM material_types WHERE name = $1',
        [categoryName]
      );
      
      if (result.rows.length === 0) {
        throw new Error(`Material type not found: ${categoryName}`);
      }
      
      return result.rows[0].id;
    } catch (error) {
      logger.error('Failed to get material type ID:', error);
      throw error;
    }
  }

  // Create new book record
  async createBook(bookData) {
    try {
      const insertQuery = `
        INSERT INTO bibliographic_records (
          barcode, title, subtitle, author, additional_authors,
          isbn, issn, publisher, publication_year, edition,
          pages, language, material_type_id, subject_headings,
          keywords, abstract, call_number, location, shelf_location,
          total_copies, available_copies, cover_image_url, notes,
          acquisition_date, price, status, url, download_source,
          source_url, file_hash, page_count, qr_code_url
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25, $26, $27, $28,
          $29, $30, $31, $32
        ) RETURNING id, barcode
      `;

      const values = [
        bookData.barcode,
        bookData.title,
        bookData.subtitle || null,
        bookData.author,
        bookData.additional_authors || null,
        bookData.isbn || null,
        bookData.issn || null,
        bookData.publisher || null,
        bookData.publication_year || null,
        bookData.edition || null,
        bookData.pages || null,
        bookData.language || 'English',
        bookData.material_type_id,
        bookData.subject_headings || null,
        bookData.keywords || null,
        bookData.abstract || null,
        bookData.call_number || null,
        bookData.location || 'Main Library',
        bookData.shelf_location || null,
        bookData.total_copies || 1,
        bookData.available_copies || 1,
        bookData.cover_image_url || null,
        bookData.notes || null,
        bookData.acquisition_date || new Date(),
        bookData.price || null,
        bookData.status || 'available',
        bookData.url || null,
        bookData.download_source || null,
        bookData.source_url || null,
        bookData.file_hash || null,
        bookData.page_count || null,
        bookData.qr_code_url || null
      ];

      const result = await query(insertQuery, values);
      logger.info(`Book saved to database: ${result.rows[0].barcode}`);
      return result.rows[0];

    } catch (error) {
      if (error.code === '23505') { // Unique violation
        logger.warn('Duplicate book detected:', bookData.barcode);
        throw new Error('Book already exists');
      }
      logger.error('Failed to save book:', error);
      throw error;
    }
  }

  // Update book
  async updateBook(barcode, updates) {
    try {
      const setClauses = [];
      const values = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      });

      values.push(barcode);

      const updateQuery = `
        UPDATE bibliographic_records
        SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE barcode = $${paramIndex}
        RETURNING id, barcode
      `;

      const result = await query(updateQuery, values);
      
      if (result.rows.length === 0) {
        throw new Error('Book not found');
      }

      logger.info(`Book updated: ${barcode}`);
      return result.rows[0];

    } catch (error) {
      logger.error(`Failed to update book ${barcode}:`, error);
      throw error;
    }
  }

  // Check if book exists
  async exists(title, author) {
    try {
      const result = await query(
        'SELECT barcode FROM bibliographic_records WHERE LOWER(title) = LOWER($1) AND LOWER(author) = LOWER($2)',
        [title, author]
      );
      return result.rows.length > 0;
    } catch (error) {
      logger.error('Error checking book existence:', error);
      return false;
    }
  }

  // Get statistics
  async getStats() {
    try {
      const result = await query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM bibliographic_records
        GROUP BY status
      `);

      const stats = {};
      result.rows.forEach(row => {
        stats[row.status] = parseInt(row.count, 10);
      });

      return stats;
    } catch (error) {
      logger.error('Failed to get stats:', error);
      return {};
    }
  }

  // Get category statistics
  async getCategoryStats() {
    try {
      const result = await query(`
        SELECT 
          mt.name as category,
          COUNT(br.id) as total,
          SUM(CASE WHEN br.status = 'available' THEN 1 ELSE 0 END) as available
        FROM material_types mt
        LEFT JOIN bibliographic_records br ON mt.id = br.material_type_id
        GROUP BY mt.name
        ORDER BY mt.name
      `);

      return result.rows;
    } catch (error) {
      logger.error('Failed to get category stats:', error);
      return [];
    }
  }

  // Get books by category
  async getBooksByCategory(category, limit = 20) {
    try {
      const result = await query(`
        SELECT br.* 
        FROM bibliographic_records br
        JOIN material_types mt ON br.material_type_id = mt.id
        WHERE mt.name = $1
        ORDER BY br.created_at DESC
        LIMIT $2
      `, [category, limit]);

      return result.rows;
    } catch (error) {
      logger.error('Failed to get books by category:', error);
      return [];
    }
  }
}

module.exports = new BookService();

