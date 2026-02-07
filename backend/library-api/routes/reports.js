const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const reportsController = require('../controllers/reportsController');

// All report routes require librarian/admin authentication
router.use(verifyToken);
router.use(requireRole('librarian', 'admin'));

// Dashboard statistics
router.get('/dashboard', reportsController.getDashboardStats);

// Circulation reports
router.get('/circulation/daily', reportsController.getDailyCirculation);
router.get('/circulation/monthly', reportsController.getMonthlyCirculation);
router.get('/circulation/yearly', reportsController.getYearlyCirculation);

// Collection reports
router.get('/collection/statistics', reportsController.getCollectionStatistics);
router.get('/collection/usage', reportsController.getCollectionUsage);
router.get('/collection/most-borrowed', reportsController.getMostBorrowedItems);

// Patron reports
router.get('/patrons/statistics', reportsController.getPatronStatistics);
router.get('/patrons/activity', reportsController.getPatronActivity);
router.get('/patrons/top-borrowers', reportsController.getTopBorrowers);

// Financial reports
router.get('/financial/fines', reportsController.getFinesReport);
router.get('/financial/acquisitions', reportsController.getAcquisitionsReport);

// Overdue reports
router.get('/overdue/summary', reportsController.getOverdueSummary);
router.get('/overdue/detailed', reportsController.getOverdueDetailed);

// Export reports
router.post('/export/pdf', reportsController.exportToPDF);
router.post('/export/csv', reportsController.exportToCSV);

module.exports = router;

