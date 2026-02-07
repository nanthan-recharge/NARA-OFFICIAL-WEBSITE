const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, auditLog } = require('../middleware/auth');
const patronsController = require('../controllers/patronsController');

// All patron routes require authentication
router.use(verifyToken);

// Get all patrons (librarian/admin only)
router.get('/', requireRole('librarian', 'admin'), patronsController.getAllPatrons);

// Get patron by ID
router.get('/:id', patronsController.getPatronById);

// Get patron by Firebase UID
router.get('/firebase/:uid', patronsController.getPatronByFirebaseUid);

// Get patron by patron number
router.get('/number/:patronNumber', patronsController.getPatronByNumber);

// Create patron
router.post('/', requireRole('librarian', 'admin'), auditLog('CREATE', 'patron'), patronsController.createPatron);

// Update patron
router.put('/:id', auditLog('UPDATE', 'patron'), patronsController.updatePatron);

// Delete patron (admin only)
router.delete('/:id', requireRole('admin'), auditLog('DELETE', 'patron'), patronsController.deletePatron);

// Patron statistics
router.get('/:id/statistics', patronsController.getPatronStatistics);

// Patron categories
router.get('/categories/all', patronsController.getPatronCategories);
router.post('/categories', requireRole('admin'), patronsController.createPatronCategory);
router.put('/categories/:id', requireRole('admin'), patronsController.updatePatronCategory);

// Generate patron number
router.get('/generate/patron-number', requireRole('librarian', 'admin'), patronsController.generatePatronNumber);

module.exports = router;

