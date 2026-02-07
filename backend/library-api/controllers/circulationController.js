const { query, getClient } = require('../config/database');

/**
 * Check out an item to a patron
 */
exports.checkOut = async (req, res) => {
  const client = await getClient();
  
  try {
    const { patron_id, item_id, barcode } = req.body;

    if (!patron_id || (!item_id && !barcode)) {
      return res.status(400).json({
        success: false,
        error: 'Patron ID and either item ID or barcode are required'
      });
    }

    await client.query('BEGIN');

    // Get item by ID or barcode
    let itemQuery = item_id 
      ? 'SELECT * FROM bibliographic_records WHERE id = $1'
      : 'SELECT * FROM bibliographic_records WHERE barcode = $1';
    
    const itemResult = await client.query(itemQuery, [item_id || barcode]);

    if (itemResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    const item = itemResult.rows[0];

    // Check if item is available
    if (item.available_copies < 1) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: 'Item is not available for checkout'
      });
    }

    // Get patron details and category
    const patronResult = await client.query(
      `SELECT p.*, pc.loan_period_days, pc.borrowing_limit, pc.can_renew, pc.max_renewals
       FROM patrons p
       JOIN patron_categories pc ON p.category_id = pc.id
       WHERE p.id = $1 AND p.status = 'active'`,
      [patron_id]
    );

    if (patronResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Active patron not found'
      });
    }

    const patron = patronResult.rows[0];

    // Check borrowing limit
    const activeLoanCount = await client.query(
      `SELECT COUNT(*) FROM circulation_transactions 
       WHERE patron_id = $1 AND return_date IS NULL`,
      [patron_id]
    );

    if (parseInt(activeLoanCount.rows[0].count) >= patron.borrowing_limit) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: `Patron has reached borrowing limit of ${patron.borrowing_limit} items`
      });
    }

    // Check for unpaid fines
    const finesResult = await client.query(
      `SELECT SUM(amount - amount_paid) as total_fines
       FROM fines WHERE patron_id = $1 AND status = 'unpaid'`,
      [patron_id]
    );

    const totalFines = parseFloat(finesResult.rows[0].total_fines || 0);
    if (totalFines > 100) { // Configurable threshold
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: `Patron has outstanding fines of ${totalFines} LKR`
      });
    }

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + patron.loan_period_days);

    // Create checkout transaction
    const transactionResult = await client.query(
      `INSERT INTO circulation_transactions (
        patron_id, item_id, transaction_type, due_date, librarian_uid, librarian_name
      ) VALUES ($1, $2, 'checkout', $3, $4, $5)
      RETURNING *`,
      [patron_id, item.id, dueDate, req.user.uid, req.user.name]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      data: transactionResult.rows[0],
      message: `Item checked out successfully. Due date: ${dueDate.toLocaleDateString()}`
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check out item'
    });
  } finally {
    client.release();
  }
};

/**
 * Check in an item
 */
exports.checkIn = async (req, res) => {
  const client = await getClient();
  
  try {
    const { item_id, barcode } = req.body;

    if (!item_id && !barcode) {
      return res.status(400).json({
        success: false,
        error: 'Either item ID or barcode is required'
      });
    }

    await client.query('BEGIN');

    // Find active loan
    let loanQuery = item_id
      ? `SELECT ct.*, br.title, br.barcode, p.full_name as patron_name
         FROM circulation_transactions ct
         JOIN bibliographic_records br ON ct.item_id = br.id
         JOIN patrons p ON ct.patron_id = p.id
         WHERE ct.item_id = $1 AND ct.return_date IS NULL
         ORDER BY ct.checkout_date DESC LIMIT 1`
      : `SELECT ct.*, br.title, br.barcode, p.full_name as patron_name
         FROM circulation_transactions ct
         JOIN bibliographic_records br ON ct.item_id = br.id
         JOIN patrons p ON ct.patron_id = p.id
         WHERE br.barcode = $1 AND ct.return_date IS NULL
         ORDER BY ct.checkout_date DESC LIMIT 1`;

    const loanResult = await client.query(loanQuery, [item_id || barcode]);

    if (loanResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'No active loan found for this item'
      });
    }

    const loan = loanResult.rows[0];
    const returnDate = new Date();

    // Update transaction
    await client.query(
      `UPDATE circulation_transactions 
       SET return_date = $1
       WHERE id = $2`,
      [returnDate, loan.id]
    );

    // Calculate fine if overdue
    const dueDate = new Date(loan.due_date);
    let fine = null;

    if (returnDate > dueDate) {
      const fineResult = await client.query(
        'SELECT calculate_fine($1, $2, $3) as fine_amount',
        [loan.patron_id, loan.due_date, returnDate]
      );

      const fineAmount = parseFloat(fineResult.rows[0].fine_amount);

      if (fineAmount > 0) {
        const daysOverdue = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        
        const fineInsertResult = await client.query(
          `INSERT INTO fines (patron_id, transaction_id, fine_type, amount, days_overdue)
           VALUES ($1, $2, 'overdue', $3, $4)
           RETURNING *`,
          [loan.patron_id, loan.id, fineAmount, daysOverdue]
        );

        fine = fineInsertResult.rows[0];
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      data: {
        transaction: loan,
        return_date: returnDate,
        fine: fine
      },
      message: fine 
        ? `Item checked in. Fine of ${fine.amount} LKR applied for ${fine.days_overdue} days overdue.`
        : 'Item checked in successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Checkin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check in item'
    });
  } finally {
    client.release();
  }
};

/**
 * Renew an item
 */
exports.renewItem = async (req, res) => {
  const client = await getClient();
  
  try {
    const { transactionId } = req.params;

    await client.query('BEGIN');

    // Get transaction details
    const transactionResult = await client.query(
      `SELECT ct.*, p.category_id, pc.max_renewals, pc.loan_period_days
       FROM circulation_transactions ct
       JOIN patrons p ON ct.patron_id = p.id
       JOIN patron_categories pc ON p.category_id = pc.id
       WHERE ct.id = $1 AND ct.return_date IS NULL`,
      [transactionId]
    );

    if (transactionResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Active transaction not found'
      });
    }

    const transaction = transactionResult.rows[0];

    // Check renewal limit
    if (transaction.renewed_count >= transaction.max_renewals) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: `Maximum renewals (${transaction.max_renewals}) reached`
      });
    }

    // Check for holds on this item
    const holdsResult = await client.query(
      `SELECT COUNT(*) FROM holds_reservations 
       WHERE item_id = $1 AND status = 'pending'`,
      [transaction.item_id]
    );

    if (parseInt(holdsResult.rows[0].count) > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: 'Item has pending holds and cannot be renewed'
      });
    }

    // Calculate new due date
    const newDueDate = new Date(transaction.due_date);
    newDueDate.setDate(newDueDate.getDate() + transaction.loan_period_days);

    // Update transaction
    const updateResult = await client.query(
      `UPDATE circulation_transactions 
       SET due_date = $1, renewed_count = renewed_count + 1
       WHERE id = $2
       RETURNING *`,
      [newDueDate, transactionId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      data: updateResult.rows[0],
      message: `Item renewed successfully. New due date: ${newDueDate.toLocaleDateString()}`
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Renew error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to renew item'
    });
  } finally {
    client.release();
  }
};

/**
 * Get all active loans
 */
exports.getActiveLoans = async (req, res) => {
  try {
    const result = await query('SELECT * FROM active_loans ORDER BY due_date');

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get active loans error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active loans'
    });
  }
};

/**
 * Get patron's active loans
 */
exports.getPatronActiveLoans = async (req, res) => {
  try {
    const { patronId } = req.params;

    const result = await query(
      'SELECT * FROM active_loans WHERE patron_id = $1 ORDER BY due_date',
      [patronId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get patron active loans error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patron loans'
    });
  }
};

/**
 * Get overdue items
 */
exports.getOverdueItems = async (req, res) => {
  try {
    const result = await query('SELECT * FROM overdue_items ORDER BY days_overdue DESC');

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get overdue items error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overdue items'
    });
  }
};

/**
 * Get transaction history
 */
exports.getTransactionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT ct.*, p.patron_number, p.full_name as patron_name, 
              br.barcode, br.title, br.author
       FROM circulation_transactions ct
       JOIN patrons p ON ct.patron_id = p.id
       JOIN bibliographic_records br ON ct.item_id = br.id
       ORDER BY ct.checkout_date DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction history'
    });
  }
};

/**
 * Get patron transaction history
 */
exports.getPatronHistory = async (req, res) => {
  try {
    const { patronId } = req.params;

    const result = await query(
      `SELECT ct.*, br.barcode, br.title, br.author, br.cover_image_url
       FROM circulation_transactions ct
       JOIN bibliographic_records br ON ct.item_id = br.id
       WHERE ct.patron_id = $1
       ORDER BY ct.checkout_date DESC`,
      [patronId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get patron history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patron history'
    });
  }
};

/**
 * Get item circulation history
 */
exports.getItemHistory = async (req, res) => {
  try {
    const { itemId } = req.params;

    const result = await query(
      `SELECT ct.*, p.patron_number, p.full_name as patron_name
       FROM circulation_transactions ct
       JOIN patrons p ON ct.patron_id = p.id
       WHERE ct.item_id = $1
       ORDER BY ct.checkout_date DESC`,
      [itemId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get item history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch item history'
    });
  }
};

/**
 * Place a hold on an item
 */
exports.placeHold = async (req, res) => {
  try {
    const { patron_id, item_id } = req.body;

    if (!patron_id || !item_id) {
      return res.status(400).json({
        success: false,
        error: 'Patron ID and item ID are required'
      });
    }

    // Check if patron already has a hold on this item
    const existingHold = await query(
      `SELECT * FROM holds_reservations 
       WHERE patron_id = $1 AND item_id = $2 AND status IN ('pending', 'available')`,
      [patron_id, item_id]
    );

    if (existingHold.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Patron already has a hold on this item'
      });
    }

    // Set expiry date (7 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const result = await query(
      `INSERT INTO holds_reservations (patron_id, item_id, expiry_date)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [patron_id, item_id, expiryDate]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Hold placed successfully'
    });
  } catch (error) {
    console.error('Place hold error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to place hold'
    });
  }
};

/**
 * Get all holds
 */
exports.getAllHolds = async (req, res) => {
  try {
    const { status } = req.query;

    let queryText = `
      SELECT hr.*, p.patron_number, p.full_name as patron_name, p.email,
             br.barcode, br.title, br.author
      FROM holds_reservations hr
      JOIN patrons p ON hr.patron_id = p.id
      JOIN bibliographic_records br ON hr.item_id = br.id
    `;

    const params = [];
    if (status) {
      queryText += ' WHERE hr.status = $1';
      params.push(status);
    }

    queryText += ' ORDER BY hr.hold_date';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all holds error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch holds'
    });
  }
};

/**
 * Get patron holds
 */
exports.getPatronHolds = async (req, res) => {
  try {
    const { patronId } = req.params;

    const result = await query(
      `SELECT hr.*, br.barcode, br.title, br.author, br.cover_image_url
       FROM holds_reservations hr
       JOIN bibliographic_records br ON hr.item_id = br.id
       WHERE hr.patron_id = $1
       ORDER BY hr.hold_date DESC`,
      [patronId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get patron holds error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patron holds'
    });
  }
};

/**
 * Get item holds
 */
exports.getItemHolds = async (req, res) => {
  try {
    const { itemId } = req.params;

    const result = await query(
      `SELECT hr.*, p.patron_number, p.full_name as patron_name
       FROM holds_reservations hr
       JOIN patrons p ON hr.patron_id = p.id
       WHERE hr.item_id = $1 AND hr.status IN ('pending', 'available')
       ORDER BY hr.hold_date`,
      [itemId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get item holds error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch item holds'
    });
  }
};

/**
 * Update hold status
 */
exports.updateHold = async (req, res) => {
  try {
    const { holdId } = req.params;
    const { status, notes } = req.body;

    const result = await query(
      `UPDATE holds_reservations 
       SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, notes, holdId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Hold not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Hold updated successfully'
    });
  } catch (error) {
    console.error('Update hold error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update hold'
    });
  }
};

/**
 * Cancel hold
 */
exports.cancelHold = async (req, res) => {
  try {
    const { holdId } = req.params;

    const result = await query(
      `UPDATE holds_reservations 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [holdId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Hold not found'
      });
    }

    res.json({
      success: true,
      message: 'Hold cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel hold error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel hold'
    });
  }
};

/**
 * Get all fines
 */
exports.getAllFines = async (req, res) => {
  try {
    const { status } = req.query;

    let queryText = `
      SELECT f.*, p.patron_number, p.full_name as patron_name, p.email
      FROM fines f
      JOIN patrons p ON f.patron_id = p.id
    `;

    const params = [];
    if (status) {
      queryText += ' WHERE f.status = $1';
      params.push(status);
    }

    queryText += ' ORDER BY f.created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all fines error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fines'
    });
  }
};

/**
 * Get patron fines
 */
exports.getPatronFines = async (req, res) => {
  try {
    const { patronId } = req.params;

    const result = await query(
      `SELECT f.*, ct.item_id, br.title, br.barcode
       FROM fines f
       LEFT JOIN circulation_transactions ct ON f.transaction_id = ct.id
       LEFT JOIN bibliographic_records br ON ct.item_id = br.id
       WHERE f.patron_id = $1
       ORDER BY f.created_at DESC`,
      [patronId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get patron fines error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patron fines'
    });
  }
};

/**
 * Pay fine
 */
exports.payFine = async (req, res) => {
  try {
    const { fineId } = req.params;
    const { amount, payment_method, payment_reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid payment amount is required'
      });
    }

    const result = await query(
      `UPDATE fines 
       SET amount_paid = amount_paid + $1,
           status = CASE 
             WHEN amount_paid + $1 >= amount THEN 'paid'
             ELSE 'partial'
           END,
           payment_date = CURRENT_TIMESTAMP,
           payment_method = $2,
           payment_reference = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [amount, payment_method, payment_reference, fineId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Fine not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Payment recorded successfully'
    });
  } catch (error) {
    console.error('Pay fine error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record payment'
    });
  }
};

/**
 * Waive fine
 */
exports.waiveFine = async (req, res) => {
  try {
    const { fineId } = req.params;
    const { reason } = req.body;

    const result = await query(
      `UPDATE fines 
       SET status = 'waived',
           waived_by = $1,
           waive_reason = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [req.user.name, reason, fineId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Fine not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Fine waived successfully'
    });
  } catch (error) {
    console.error('Waive fine error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to waive fine'
    });
  }
};

