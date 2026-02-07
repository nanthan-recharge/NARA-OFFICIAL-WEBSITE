const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, auditLog } = require('../middleware/auth');
const circulationController = require('../controllers/circulationController');

// All circulation routes require authentication
router.use(verifyToken);

// Check-out
router.post('/checkout', requireRole('librarian', 'admin'), auditLog('CHECKOUT', 'circulation'), circulationController.checkOut);

// Check-in
router.post('/checkin', requireRole('librarian', 'admin'), auditLog('CHECKIN', 'circulation'), circulationController.checkIn);

// Renewal
router.post('/renew/:transactionId', auditLog('RENEW', 'circulation'), circulationController.renewItem);

// Get active loans
router.get('/active-loans', circulationController.getActiveLoans);
router.get('/active-loans/patron/:patronId', circulationController.getPatronActiveLoans);

// Get overdue items
router.get('/overdue', requireRole('librarian', 'admin'), circulationController.getOverdueItems);

// Transaction history
router.get('/history', requireRole('librarian', 'admin'), circulationController.getTransactionHistory);
router.get('/history/patron/:patronId', circulationController.getPatronHistory);
router.get('/history/item/:itemId', circulationController.getItemHistory);

// Holds/Reservations
router.post('/holds', auditLog('CREATE_HOLD', 'hold'), circulationController.placeHold);
router.get('/holds', circulationController.getAllHolds);
router.get('/holds/patron/:patronId', circulationController.getPatronHolds);
router.get('/holds/item/:itemId', circulationController.getItemHolds);
router.put('/holds/:holdId', requireRole('librarian', 'admin'), auditLog('UPDATE_HOLD', 'hold'), circulationController.updateHold);
router.delete('/holds/:holdId', auditLog('CANCEL_HOLD', 'hold'), circulationController.cancelHold);

// Fines
router.get('/fines', requireRole('librarian', 'admin'), circulationController.getAllFines);
router.get('/fines/patron/:patronId', circulationController.getPatronFines);
router.post('/fines/:fineId/pay', auditLog('PAY_FINE', 'fine'), circulationController.payFine);
router.post('/fines/:fineId/waive', requireRole('librarian', 'admin'), auditLog('WAIVE_FINE', 'fine'), circulationController.waiveFine);

module.exports = router;

