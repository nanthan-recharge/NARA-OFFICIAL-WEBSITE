const { query } = require('../config/database');

/**
 * Get all bibliographic items with pagination and filters
 */
exports.getAllItems = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    material_type,
    status,
    location,
    sort = 'title',
    order = 'ASC'
  } = req.query;

  const offset = (page - 1) * limit;
  
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (material_type) {
    whereConditions.push(`material_type_id = $${paramIndex++}`);
    params.push(material_type);
  }

  if (status) {
    whereConditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }

  if (location) {
    whereConditions.push(`location ILIKE $${paramIndex++}`);
    params.push(`%${location}%`);
  }

  const whereClause = whereConditions.length > 0 
    ? 'WHERE ' + whereConditions.join(' AND ')
    : '';

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM bibliographic_records ${whereClause}`,
    params
  );
  const totalItems = parseInt(countResult.rows[0].count);

  // Get items
  const validSortColumns = ['title', 'author', 'publication_year', 'created_at', 'call_number'];
  const sortColumn = validSortColumns.includes(sort) ? sort : 'title';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  params.push(limit, offset);
  const result = await query(
    `SELECT br.*, mt.name as material_type_name, mt.code as material_type_code
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     ${whereClause}
     ORDER BY br.${sortColumn} ${sortOrder}
     LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    params
  );

  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  });
};

/**
 * Get item by ID
 */
exports.getItemById = async (req, res) => {
  const { id } = req.params;

  const result = await query(
    `SELECT br.*, mt.name as material_type_name, mt.code as material_type_code
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     WHERE br.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

/**
 * Get item by barcode
 */
exports.getItemByBarcode = async (req, res) => {
  const { barcode } = req.params;

  const result = await query(
    `SELECT br.*, mt.name as material_type_name, mt.code as material_type_code
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     WHERE br.barcode = $1`,
    [barcode]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

/**
 * Create new bibliographic item
 */
exports.createItem = async (req, res) => {
  try {
    const {
      barcode,
      title,
      subtitle,
      author,
      additional_authors,
      isbn,
      issn,
      publisher,
      publication_year,
      edition,
      pages,
      language,
      material_type_id,
      subject_headings,
      keywords,
      abstract,
      call_number,
      location,
      shelf_location,
      total_copies,
      cover_image_url,
      notes,
      acquisition_date,
      price
    } = req.body;

    // Validate required fields
    if (!title || !material_type_id) {
      return res.status(400).json({
        success: false,
        error: 'Title and material type are required'
      });
    }

    const result = await query(
      `INSERT INTO bibliographic_records (
        barcode, title, subtitle, author, additional_authors, isbn, issn,
        publisher, publication_year, edition, pages, language, material_type_id,
        subject_headings, keywords, abstract, call_number, location, shelf_location,
        total_copies, available_copies, cover_image_url, notes, acquisition_date, price
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $20, $21, $22, $23, $24
      ) RETURNING *`,
      [
        barcode, title, subtitle, author, additional_authors, isbn, issn,
        publisher, publication_year, edition, pages, language, material_type_id,
        subject_headings, keywords, abstract, call_number, location, shelf_location,
        total_copies || 1, cover_image_url, notes, acquisition_date, price
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error('Create item error:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        error: 'Barcode already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create item'
    });
  }
};

/**
 * Update bibliographic item
 */
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Remove fields that shouldn't be updated directly
  delete updates.id;
  delete updates.created_at;
  delete updates.search_vector;

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No fields to update'
    });
  }

  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const result = await query(
    `UPDATE bibliographic_records 
     SET ${setClause}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id, ...values]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0],
    message: 'Item updated successfully'
  });
};

/**
 * Delete bibliographic item
 */
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  // Check if item has active loans
  const loanCheck = await query(
    `SELECT COUNT(*) FROM circulation_transactions 
     WHERE item_id = $1 AND return_date IS NULL`,
    [id]
  );

  if (parseInt(loanCheck.rows[0].count) > 0) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete item with active loans'
    });
  }

  const result = await query(
    'DELETE FROM bibliographic_records WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }

  res.json({
    success: true,
    message: 'Item deleted successfully'
  });
};

/**
 * Bulk import items from CSV
 */
exports.bulkImport = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required'
      });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const item of items) {
      try {
        await query(
          `INSERT INTO bibliographic_records (
            barcode, title, author, isbn, publisher, publication_year,
            material_type_id, total_copies, available_copies
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)`,
          [
            item.barcode,
            item.title,
            item.author,
            item.isbn,
            item.publisher,
            item.publication_year,
            item.material_type_id,
            item.total_copies || 1
          ]
        );
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          item: item.barcode || item.title,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: results,
      message: `Imported ${results.success} items, ${results.failed} failed`
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to import items'
    });
  }
};

/**
 * Bulk update items
 */
exports.bulkUpdate = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Updates array is required'
      });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const update of updates) {
      try {
        const { id, ...fields } = update;
        const fieldNames = Object.keys(fields);
        const fieldValues = Object.values(fields);
        
        const setClause = fieldNames.map((field, index) => `${field} = $${index + 2}`).join(', ');
        
        await query(
          `UPDATE bibliographic_records 
           SET ${setClause}, updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [id, ...fieldValues]
        );
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          id: update.id,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: results,
      message: `Updated ${results.success} items, ${results.failed} failed`
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update items'
    });
  }
};

/**
 * Get all material types
 */
exports.getMaterialTypes = async (req, res) => {
  const result = await query(
    'SELECT * FROM material_types ORDER BY name'
  );

  res.json({
    success: true,
    data: result.rows
  });
};

/**
 * Generate unique barcode
 */
exports.generateBarcode = async (req, res) => {
  const result = await query('SELECT generate_barcode() as barcode');

  res.json({
    success: true,
    data: {
      barcode: result.rows[0].barcode
    }
  });
};

