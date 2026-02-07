const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, optionalAuth, auditLog } = require('../middleware/auth');
const catalogueController = require('../controllers/catalogueController');

// Public routes (with optional authentication)
router.get('/', optionalAuth, catalogueController.getAllItems);
router.get('/:id', optionalAuth, catalogueController.getItemById);
router.get('/barcode/:barcode', optionalAuth, catalogueController.getItemByBarcode);

// Protected routes (librarian/admin only)
router.post('/', verifyToken, requireRole('librarian', 'admin'), auditLog('CREATE', 'bibliographic_record'), catalogueController.createItem);
router.put('/:id', verifyToken, requireRole('librarian', 'admin'), auditLog('UPDATE', 'bibliographic_record'), catalogueController.updateItem);
router.delete('/:id', verifyToken, requireRole('admin'), auditLog('DELETE', 'bibliographic_record'), catalogueController.deleteItem);

// Bulk operations
router.post('/bulk/import', verifyToken, requireRole('librarian', 'admin'), catalogueController.bulkImport);
router.post('/bulk/update', verifyToken, requireRole('librarian', 'admin'), catalogueController.bulkUpdate);

// Material types
router.get('/material-types/all', catalogueController.getMaterialTypes);

// Generate barcode
router.get('/generate/barcode', verifyToken, requireRole('librarian', 'admin'), catalogueController.generateBarcode);

module.exports = router;

