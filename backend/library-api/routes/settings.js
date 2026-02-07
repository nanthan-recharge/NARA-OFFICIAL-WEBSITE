const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

// All settings routes require admin authentication
router.use(verifyToken);
router.use(requireRole('admin'));

// Get all settings
router.get('/', settingsController.getAllSettings);

// Get setting by key
router.get('/:key', settingsController.getSettingByKey);

// Update setting
router.put('/:key', settingsController.updateSetting);

// Bulk update settings
router.post('/bulk', settingsController.bulkUpdateSettings);

module.exports = router;

