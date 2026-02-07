const { query } = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  const [
    totalItems,
    activeLoans,
    overdueItems,
    totalPatrons,
    pendingHolds,
    unpaidFines,
    todayCheckouts,
    todayCheckins
  ] = await Promise.all([
    query('SELECT COUNT(*) as count FROM bibliographic_records WHERE status = \'available\''),
    query('SELECT COUNT(*) as count FROM circulation_transactions WHERE return_date IS NULL'),
    query('SELECT COUNT(*) as count FROM overdue_items'),
    query('SELECT COUNT(*) as count FROM patrons WHERE status = \'active\''),
    query('SELECT COUNT(*) as count FROM holds_reservations WHERE status = \'pending\''),
    query('SELECT COALESCE(SUM(amount - amount_paid), 0) as total FROM fines WHERE status = \'unpaid\''),
    query('SELECT COUNT(*) as count FROM circulation_transactions WHERE DATE(checkout_date) = CURRENT_DATE AND transaction_type = \'checkout\''),
    query('SELECT COUNT(*) as count FROM circulation_transactions WHERE DATE(return_date) = CURRENT_DATE')
  ]);

  res.json({
    success: true,
    data: {
      totalItems: parseInt(totalItems.rows[0].count),
      activeLoans: parseInt(activeLoans.rows[0].count),
      overdueItems: parseInt(overdueItems.rows[0].count),
      totalPatrons: parseInt(totalPatrons.rows[0].count),
      pendingHolds: parseInt(pendingHolds.rows[0].count),
      unpaidFines: parseFloat(unpaidFines.rows[0].total),
      todayCheckouts: parseInt(todayCheckouts.rows[0].count),
      todayCheckins: parseInt(todayCheckins.rows[0].count)
    }
  });
};

exports.getDailyCirculation = async (req, res) => {
  const { date = new Date().toISOString().split('T')[0] } = req.query;

  const result = await query(
    `SELECT 
      transaction_type,
      COUNT(*) as count,
      DATE(checkout_date) as date
     FROM circulation_transactions
     WHERE DATE(checkout_date) = $1 OR DATE(return_date) = $1
     GROUP BY transaction_type, DATE(checkout_date)
     ORDER BY transaction_type`,
    [date]
  );

  res.json({ success: true, data: result.rows });
};

exports.getMonthlyCirculation = async (req, res) => {
  const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;

  const result = await query(
    `SELECT 
      DATE(checkout_date) as date,
      COUNT(*) FILTER (WHERE transaction_type = 'checkout') as checkouts,
      COUNT(*) FILTER (WHERE return_date IS NOT NULL) as checkins
     FROM circulation_transactions
     WHERE EXTRACT(YEAR FROM checkout_date) = $1
     AND EXTRACT(MONTH FROM checkout_date) = $2
     GROUP BY DATE(checkout_date)
     ORDER BY date`,
    [year, month]
  );

  res.json({ success: true, data: result.rows });
};

exports.getYearlyCirculation = async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;

  const result = await query(
    `SELECT 
      EXTRACT(MONTH FROM checkout_date) as month,
      COUNT(*) FILTER (WHERE transaction_type = 'checkout') as checkouts,
      COUNT(*) FILTER (WHERE return_date IS NOT NULL) as checkins
     FROM circulation_transactions
     WHERE EXTRACT(YEAR FROM checkout_date) = $1
     GROUP BY EXTRACT(MONTH FROM checkout_date)
     ORDER BY month`,
    [year]
  );

  res.json({ success: true, data: result.rows });
};

exports.getCollectionStatistics = async (req, res) => {
  const result = await query('SELECT * FROM collection_statistics');
  res.json({ success: true, data: result.rows });
};

exports.getCollectionUsage = async (req, res) => {
  const { days = 30 } = req.query;

  const result = await query(
    `SELECT 
      br.id,
      br.title,
      br.author,
      mt.name as material_type,
      COUNT(ct.id) as circulation_count,
      MAX(ct.checkout_date) as last_checkout
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     LEFT JOIN circulation_transactions ct ON br.id = ct.item_id
     WHERE ct.checkout_date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
     GROUP BY br.id, br.title, br.author, mt.name
     ORDER BY circulation_count DESC
     LIMIT 50`,
    []
  );

  res.json({ success: true, data: result.rows });
};

exports.getMostBorrowedItems = async (req, res) => {
  const { limit = 20, days = 365 } = req.query;

  const result = await query(
    `SELECT 
      br.id,
      br.barcode,
      br.title,
      br.author,
      br.cover_image_url,
      mt.name as material_type,
      COUNT(ct.id) as borrow_count
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     LEFT JOIN circulation_transactions ct ON br.id = ct.item_id
     WHERE ct.checkout_date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
     GROUP BY br.id, br.barcode, br.title, br.author, br.cover_image_url, mt.name
     ORDER BY borrow_count DESC
     LIMIT $1`,
    [limit]
  );

  res.json({ success: true, data: result.rows });
};

exports.getPatronStatistics = async (req, res) => {
  const result = await query('SELECT * FROM patron_statistics ORDER BY total_loans DESC LIMIT 100');
  res.json({ success: true, data: result.rows });
};

exports.getPatronActivity = async (req, res) => {
  const { days = 30 } = req.query;

  const result = await query(
    `SELECT 
      p.id,
      p.patron_number,
      p.full_name,
      pc.name as category,
      COUNT(ct.id) as activity_count
     FROM patrons p
     LEFT JOIN patron_categories pc ON p.category_id = pc.id
     LEFT JOIN circulation_transactions ct ON p.id = ct.patron_id
     WHERE ct.checkout_date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
     GROUP BY p.id, p.patron_number, p.full_name, pc.name
     ORDER BY activity_count DESC
     LIMIT 50`,
    []
  );

  res.json({ success: true, data: result.rows });
};

exports.getTopBorrowers = async (req, res) => {
  const { limit = 10, year = new Date().getFullYear() } = req.query;

  const result = await query(
    `SELECT 
      p.id,
      p.patron_number,
      p.full_name,
      p.email,
      pc.name as category,
      COUNT(ct.id) as total_borrowed
     FROM patrons p
     LEFT JOIN patron_categories pc ON p.category_id = pc.id
     LEFT JOIN circulation_transactions ct ON p.id = ct.patron_id
     WHERE EXTRACT(YEAR FROM ct.checkout_date) = $1
     GROUP BY p.id, p.patron_number, p.full_name, p.email, pc.name
     ORDER BY total_borrowed DESC
     LIMIT $2`,
    [year, limit]
  );

  res.json({ success: true, data: result.rows });
};

exports.getFinesReport = async (req, res) => {
  const { status, year, month } = req.query;
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (status) {
    whereConditions.push(`f.status = $${paramIndex++}`);
    params.push(status);
  }
  if (year) {
    whereConditions.push(`EXTRACT(YEAR FROM f.created_at) = $${paramIndex++}`);
    params.push(year);
  }
  if (month) {
    whereConditions.push(`EXTRACT(MONTH FROM f.created_at) = $${paramIndex++}`);
    params.push(month);
  }

  const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

  const result = await query(
    `SELECT 
      f.fine_type,
      f.status,
      COUNT(*) as count,
      SUM(f.amount) as total_amount,
      SUM(f.amount_paid) as total_paid,
      SUM(f.amount - f.amount_paid) as total_outstanding
     FROM fines f
     ${whereClause}
     GROUP BY f.fine_type, f.status
     ORDER BY total_amount DESC`,
    params
  );

  res.json({ success: true, data: result.rows });
};

exports.getAcquisitionsReport = async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;

  const result = await query(
    `SELECT 
      EXTRACT(MONTH FROM order_date) as month,
      COUNT(*) as order_count,
      SUM(total_amount) as total_spent,
      AVG(total_amount) as avg_order_value
     FROM acquisitions
     WHERE EXTRACT(YEAR FROM order_date) = $1
     GROUP BY EXTRACT(MONTH FROM order_date)
     ORDER BY month`,
    [year]
  );

  res.json({ success: true, data: result.rows });
};

exports.getOverdueSummary = async (req, res) => {
  const result = await query(
    `SELECT 
      COUNT(*) as total_overdue,
      SUM(days_overdue) as total_days_overdue,
      AVG(days_overdue) as avg_days_overdue,
      MAX(days_overdue) as max_days_overdue
     FROM overdue_items`
  );

  res.json({ success: true, data: result.rows[0] });
};

exports.getOverdueDetailed = async (req, res) => {
  const result = await query('SELECT * FROM overdue_items ORDER BY days_overdue DESC');
  res.json({ success: true, data: result.rows });
};

exports.exportToPDF = async (req, res) => {
  // This would integrate with a PDF generation library
  // For now, return a placeholder response
  res.json({
    success: true,
    message: 'PDF export functionality will be implemented with jsPDF'
  });
};

exports.exportToCSV = async (req, res) => {
  // This would generate CSV data
  // For now, return a placeholder response
  res.json({
    success: true,
    message: 'CSV export functionality will be implemented'
  });
};

