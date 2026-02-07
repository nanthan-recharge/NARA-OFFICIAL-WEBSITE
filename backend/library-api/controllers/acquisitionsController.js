const { query } = require('../config/database');

exports.getAllAcquisitions = async (req, res) => {
  const { status, supplier_id } = req.query;
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (status) {
    whereConditions.push(`a.status = $${paramIndex++}`);
    params.push(status);
  }
  if (supplier_id) {
    whereConditions.push(`a.supplier_id = $${paramIndex++}`);
    params.push(supplier_id);
  }

  const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

  const result = await query(
    `SELECT a.*, s.name as supplier_name
     FROM acquisitions a
     LEFT JOIN suppliers s ON a.supplier_id = s.id
     ${whereClause}
     ORDER BY a.order_date DESC`,
    params
  );

  res.json({ success: true, data: result.rows });
};

exports.getAcquisitionById = async (req, res) => {
  const { id } = req.params;
  const result = await query(
    `SELECT a.*, s.name as supplier_name, s.email as supplier_email, s.phone as supplier_phone
     FROM acquisitions a
     LEFT JOIN suppliers s ON a.supplier_id = s.id
     WHERE a.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Acquisition not found' });
  }

  res.json({ success: true, data: result.rows[0] });
};

exports.createAcquisition = async (req, res) => {
  const {
    order_number, supplier_id, order_date, expected_delivery_date,
    total_amount, invoice_number, budget_category, notes
  } = req.body;

  const result = await query(
    `INSERT INTO acquisitions (
      order_number, supplier_id, order_date, expected_delivery_date,
      total_amount, invoice_number, budget_category, ordered_by, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [order_number, supplier_id, order_date, expected_delivery_date,
     total_amount, invoice_number, budget_category, req.user.name, notes]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Acquisition created successfully'
  });
};

exports.updateAcquisition = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  delete updates.id;
  delete updates.created_at;

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const result = await query(
    `UPDATE acquisitions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [id, ...values]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Acquisition not found' });
  }

  res.json({ success: true, data: result.rows[0], message: 'Acquisition updated successfully' });
};

exports.deleteAcquisition = async (req, res) => {
  const { id } = req.params;
  const result = await query('DELETE FROM acquisitions WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Acquisition not found' });
  }

  res.json({ success: true, message: 'Acquisition deleted successfully' });
};

exports.getAcquisitionItems = async (req, res) => {
  const { id } = req.params;
  const result = await query(
    'SELECT * FROM acquisition_items WHERE acquisition_id = $1 ORDER BY created_at',
    [id]
  );

  res.json({ success: true, data: result.rows });
};

exports.addAcquisitionItem = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, quantity, unit_price, notes } = req.body;

  const result = await query(
    `INSERT INTO acquisition_items (
      acquisition_id, title, author, isbn, quantity, unit_price, total_price, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [id, title, author, isbn, quantity, unit_price, quantity * unit_price, notes]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
};

exports.updateAcquisitionItem = async (req, res) => {
  const { itemId } = req.params;
  const updates = req.body;
  delete updates.id;

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const result = await query(
    `UPDATE acquisition_items SET ${setClause} WHERE id = $1 RETURNING *`,
    [itemId, ...values]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }

  res.json({ success: true, data: result.rows[0] });
};

exports.deleteAcquisitionItem = async (req, res) => {
  const { itemId } = req.params;
  const result = await query('DELETE FROM acquisition_items WHERE id = $1 RETURNING *', [itemId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }

  res.json({ success: true, message: 'Item deleted successfully' });
};

exports.getAllSuppliers = async (req, res) => {
  const { status } = req.query;
  let queryText = 'SELECT * FROM suppliers';
  const params = [];

  if (status) {
    queryText += ' WHERE status = $1';
    params.push(status);
  }

  queryText += ' ORDER BY name';
  const result = await query(queryText, params);

  res.json({ success: true, data: result.rows });
};

exports.getSupplierById = async (req, res) => {
  const { id } = req.params;
  const result = await query('SELECT * FROM suppliers WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Supplier not found' });
  }

  res.json({ success: true, data: result.rows[0] });
};

exports.createSupplier = async (req, res) => {
  const { name, contact_person, email, phone, address, website, payment_terms, notes } = req.body;

  const result = await query(
    `INSERT INTO suppliers (name, contact_person, email, phone, address, website, payment_terms, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, contact_person, email, phone, address, website, payment_terms, notes]
  );

  res.status(201).json({ success: true, data: result.rows[0], message: 'Supplier created successfully' });
};

exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  delete updates.id;
  delete updates.created_at;

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const result = await query(
    `UPDATE suppliers SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [id, ...values]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Supplier not found' });
  }

  res.json({ success: true, data: result.rows[0], message: 'Supplier updated successfully' });
};

exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;
  const result = await query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Supplier not found' });
  }

  res.json({ success: true, message: 'Supplier deleted successfully' });
};

exports.getBudgetReport = async (req, res) => {
  const { year, budget_category } = req.query;
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (year) {
    whereConditions.push(`EXTRACT(YEAR FROM order_date) = $${paramIndex++}`);
    params.push(year);
  }
  if (budget_category) {
    whereConditions.push(`budget_category = $${paramIndex++}`);
    params.push(budget_category);
  }

  const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

  const result = await query(
    `SELECT 
      budget_category,
      COUNT(*) as order_count,
      SUM(total_amount) as total_spent,
      AVG(total_amount) as avg_order_value,
      MIN(order_date) as first_order,
      MAX(order_date) as last_order
     FROM acquisitions
     ${whereClause}
     GROUP BY budget_category
     ORDER BY total_spent DESC`,
    params
  );

  res.json({ success: true, data: result.rows });
};

