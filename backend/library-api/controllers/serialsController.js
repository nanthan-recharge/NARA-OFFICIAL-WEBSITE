const { query } = require('../config/database');

exports.getAllSerials = async (req, res) => {
  const { status } = req.query;
  let queryText = `SELECT s.*, sup.name as supplier_name FROM serials s LEFT JOIN suppliers sup ON s.supplier_id = sup.id`;
  const params = [];

  if (status) {
    queryText += ' WHERE s.status = $1';
    params.push(status);
  }

  queryText += ' ORDER BY s.title';
  const result = await query(queryText, params);
  res.json({ success: true, data: result.rows });
};

exports.getSerialById = async (req, res) => {
  const { id } = req.params;
  const result = await query(
    `SELECT s.*, sup.name as supplier_name FROM serials s LEFT JOIN suppliers sup ON s.supplier_id = sup.id WHERE s.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Serial not found' });
  }

  res.json({ success: true, data: result.rows[0] });
};

exports.createSerial = async (req, res) => {
  const {
    title, issn, publisher, frequency, subscription_start_date,
    subscription_end_date, supplier_id, subscription_cost, notes
  } = req.body;

  const result = await query(
    `INSERT INTO serials (title, issn, publisher, frequency, subscription_start_date, subscription_end_date, supplier_id, subscription_cost, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [title, issn, publisher, frequency, subscription_start_date, subscription_end_date, supplier_id, subscription_cost, notes]
  );

  res.status(201).json({ success: true, data: result.rows[0], message: 'Serial created successfully' });
};

exports.updateSerial = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  delete updates.id;
  delete updates.created_at;

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const result = await query(
    `UPDATE serials SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [id, ...values]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Serial not found' });
  }

  res.json({ success: true, data: result.rows[0], message: 'Serial updated successfully' });
};

exports.deleteSerial = async (req, res) => {
  const { id } = req.params;
  const result = await query('DELETE FROM serials WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Serial not found' });
  }

  res.json({ success: true, message: 'Serial deleted successfully' });
};

exports.getSerialIssues = async (req, res) => {
  const { id } = req.params;
  const result = await query(
    'SELECT * FROM serial_issues WHERE serial_id = $1 ORDER BY publication_date DESC',
    [id]
  );

  res.json({ success: true, data: result.rows });
};

exports.createSerialIssue = async (req, res) => {
  const { id } = req.params;
  const { volume_number, issue_number, publication_date, expected_date, notes } = req.body;

  const result = await query(
    `INSERT INTO serial_issues (serial_id, volume_number, issue_number, publication_date, expected_date, notes)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [id, volume_number, issue_number, publication_date, expected_date, notes]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
};

exports.updateSerialIssue = async (req, res) => {
  const { issueId } = req.params;
  const updates = req.body;
  delete updates.id;

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const result = await query(
    `UPDATE serial_issues SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [issueId, ...values]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Issue not found' });
  }

  res.json({ success: true, data: result.rows[0] });
};

exports.deleteSerialIssue = async (req, res) => {
  const { issueId } = req.params;
  const result = await query('DELETE FROM serial_issues WHERE id = $1 RETURNING *', [issueId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Issue not found' });
  }

  res.json({ success: true, message: 'Issue deleted successfully' });
};

exports.getMissingIssues = async (req, res) => {
  const { id } = req.params;
  const result = await query(
    `SELECT si.*, s.title as serial_title FROM serial_issues si
     JOIN serials s ON si.serial_id = s.id
     WHERE si.serial_id = $1 AND si.status = 'missing'
     ORDER BY si.expected_date DESC`,
    [id]
  );

  res.json({ success: true, data: result.rows });
};

exports.claimMissingIssue = async (req, res) => {
  const { issueId } = req.params;

  const result = await query(
    `UPDATE serial_issues 
     SET status = 'claimed', claim_date = CURRENT_DATE, claim_count = claim_count + 1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING *`,
    [issueId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Issue not found' });
  }

  res.json({ success: true, data: result.rows[0], message: 'Issue claimed successfully' });
};

exports.getUpcomingRenewals = async (req, res) => {
  const { days = 30 } = req.query;

  const result = await query(
    `SELECT s.*, sup.name as supplier_name
     FROM serials s
     LEFT JOIN suppliers sup ON s.supplier_id = sup.id
     WHERE s.status = 'active' 
     AND s.subscription_end_date <= CURRENT_DATE + INTERVAL '${parseInt(days)} days'
     ORDER BY s.subscription_end_date`,
    []
  );

  res.json({ success: true, data: result.rows });
};

