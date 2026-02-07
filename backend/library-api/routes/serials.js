const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, optionalAuth, auditLog } = require('../middleware/auth');
const serialsController = require('../controllers/serialsController');

// Public routes
router.get('/', optionalAuth, serialsController.getAllSerials);
router.get('/:id', optionalAuth, serialsController.getSerialById);

// Protected routes
router.use(verifyToken);
router.use(requireRole('librarian', 'admin'));

router.post('/', auditLog('CREATE', 'serial'), serialsController.createSerial);
router.put('/:id', auditLog('UPDATE', 'serial'), serialsController.updateSerial);
router.delete('/:id', requireRole('admin'), auditLog('DELETE', 'serial'), serialsController.deleteSerial);

// Serial issues
router.get('/:id/issues', serialsController.getSerialIssues);
router.post('/:id/issues', auditLog('CREATE_ISSUE', 'serial'), serialsController.createSerialIssue);
router.put('/:id/issues/:issueId', auditLog('UPDATE_ISSUE', 'serial'), serialsController.updateSerialIssue);
router.delete('/:id/issues/:issueId', auditLog('DELETE_ISSUE', 'serial'), serialsController.deleteSerialIssue);

// Missing issues
router.get('/:id/issues/missing', serialsController.getMissingIssues);
router.post('/:id/issues/:issueId/claim', auditLog('CLAIM_ISSUE', 'serial'), serialsController.claimMissingIssue);

// Renewal reminders
router.get('/renewals/upcoming', serialsController.getUpcomingRenewals);

module.exports = router;

