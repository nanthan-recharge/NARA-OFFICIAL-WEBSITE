const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, auditLog } = require('../middleware/auth');
const acquisitionsController = require('../controllers/acquisitionsController');

// All acquisition routes require librarian/admin authentication
router.use(verifyToken);
router.use(requireRole('librarian', 'admin'));

// Acquisitions
router.get('/', acquisitionsController.getAllAcquisitions);
router.get('/:id', acquisitionsController.getAcquisitionById);
router.post('/', auditLog('CREATE', 'acquisition'), acquisitionsController.createAcquisition);
router.put('/:id', auditLog('UPDATE', 'acquisition'), acquisitionsController.updateAcquisition);
router.delete('/:id', requireRole('admin'), auditLog('DELETE', 'acquisition'), acquisitionsController.deleteAcquisition);

// Acquisition items
router.get('/:id/items', acquisitionsController.getAcquisitionItems);
router.post('/:id/items', auditLog('ADD_ITEM', 'acquisition'), acquisitionsController.addAcquisitionItem);
router.put('/:id/items/:itemId', auditLog('UPDATE_ITEM', 'acquisition'), acquisitionsController.updateAcquisitionItem);
router.delete('/:id/items/:itemId', auditLog('REMOVE_ITEM', 'acquisition'), acquisitionsController.deleteAcquisitionItem);

// Suppliers
router.get('/suppliers/all', acquisitionsController.getAllSuppliers);
router.get('/suppliers/:id', acquisitionsController.getSupplierById);
router.post('/suppliers', auditLog('CREATE', 'supplier'), acquisitionsController.createSupplier);
router.put('/suppliers/:id', auditLog('UPDATE', 'supplier'), acquisitionsController.updateSupplier);
router.delete('/suppliers/:id', requireRole('admin'), auditLog('DELETE', 'supplier'), acquisitionsController.deleteSupplier);

// Budget reports
router.get('/reports/budget', acquisitionsController.getBudgetReport);

module.exports = router;

