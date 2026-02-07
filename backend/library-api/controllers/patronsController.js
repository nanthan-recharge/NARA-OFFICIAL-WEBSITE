const { query } = require('../config/database');

exports.getAllPatrons = async (req, res) => {
  const { page = 1, limit = 50, status, category_id } = req.query;
  const offset = (page - 1) * limit;

  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (status) {
    whereConditions.push(`p.status = $${paramIndex++}`);
    params.push(status);
  }

  if (category_id) {
    whereConditions.push(`p.category_id = $${paramIndex++}`);
    params.push(category_id);
  }

  const whereClause = whereConditions.length > 0 
    ? 'WHERE ' + whereConditions.join(' AND ')
    : '';

  params.push(limit, offset);

  const result = await query(
    `SELECT p.*, pc.name as category_name
     FROM patrons p
     LEFT JOIN patron_categories pc ON p.category_id = pc.id
     ${whereClause}
     ORDER BY p.full_name
     LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    params
  );

  res.json({
    success: true,
    data: result.rows
  });
};

exports.getPatronById = async (req, res) => {
  const { id } = req.params;

  const result = await query(
    `SELECT p.*, pc.name as category_name, pc.borrowing_limit, pc.loan_period_days
     FROM patrons p
     LEFT JOIN patron_categories pc ON p.category_id = pc.id
     WHERE p.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Patron not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

exports.getPatronByFirebaseUid = async (req, res) => {
  const { uid } = req.params;

  const result = await query(
    `SELECT p.*, pc.name as category_name, pc.borrowing_limit, pc.loan_period_days
     FROM patrons p
     LEFT JOIN patron_categories pc ON p.category_id = pc.id
     WHERE p.firebase_uid = $1`,
    [uid]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Patron not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

exports.getPatronByNumber = async (req, res) => {
  const { patronNumber } = req.params;

  const result = await query(
    `SELECT p.*, pc.name as category_name
     FROM patrons p
     LEFT JOIN patron_categories pc ON p.category_id = pc.id
     WHERE p.patron_number = $1`,
    [patronNumber]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Patron not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

exports.createPatron = async (req, res) => {
  try {
    const {
      firebase_uid,
      patron_number,
      email,
      full_name,
      phone,
      address,
      category_id,
      expiry_date,
      notes
    } = req.body;

    if (!firebase_uid || !email || !full_name || !category_id) {
      return res.status(400).json({
        success: false,
        error: 'Firebase UID, email, full name, and category are required'
      });
    }

    const result = await query(
      `INSERT INTO patrons (
        firebase_uid, patron_number, email, full_name, phone, address,
        category_id, expiry_date, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [firebase_uid, patron_number, email, full_name, phone, address,
       category_id, expiry_date, notes]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Patron created successfully'
    });
  } catch (error) {
    console.error('Create patron error:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Patron with this Firebase UID or patron number already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create patron'
    });
  }
};

exports.updatePatron = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  delete updates.id;
  delete updates.created_at;
  delete updates.firebase_uid;
  delete updates.patron_number;

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
    `UPDATE patrons 
     SET ${setClause}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id, ...values]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Patron not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0],
    message: 'Patron updated successfully'
  });
};

exports.deletePatron = async (req, res) => {
  const { id } = req.params;

  const loanCheck = await query(
    `SELECT COUNT(*) FROM circulation_transactions 
     WHERE patron_id = $1 AND return_date IS NULL`,
    [id]
  );

  if (parseInt(loanCheck.rows[0].count) > 0) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete patron with active loans'
    });
  }

  const result = await query(
    'DELETE FROM patrons WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Patron not found'
    });
  }

  res.json({
    success: true,
    message: 'Patron deleted successfully'
  });
};

exports.getPatronStatistics = async (req, res) => {
  const { id } = req.params;

  const result = await query(
    'SELECT * FROM patron_statistics WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Patron not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

exports.getPatronCategories = async (req, res) => {
  const result = await query(
    'SELECT * FROM patron_categories ORDER BY name'
  );

  res.json({
    success: true,
    data: result.rows
  });
};

exports.createPatronCategory = async (req, res) => {
  const {
    name,
    borrowing_limit,
    loan_period_days,
    fine_rate_per_day,
    can_renew,
    max_renewals,
    description
  } = req.body;

  const result = await query(
    `INSERT INTO patron_categories (
      name, borrowing_limit, loan_period_days, fine_rate_per_day,
      can_renew, max_renewals, description
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [name, borrowing_limit, loan_period_days, fine_rate_per_day,
     can_renew, max_renewals, description]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Patron category created successfully'
  });
};

exports.updatePatronCategory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  delete updates.id;
  delete updates.created_at;

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
    `UPDATE patron_categories 
     SET ${setClause}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id, ...values]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Patron category not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0],
    message: 'Patron category updated successfully'
  });
};

exports.generatePatronNumber = async (req, res) => {
  const result = await query('SELECT generate_patron_number() as patron_number');

  res.json({
    success: true,
    data: {
      patron_number: result.rows[0].patron_number
    }
  });
};

