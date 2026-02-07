const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const searchController = require('../controllers/searchController');

// All search routes are public but can use optional auth for personalization
router.use(optionalAuth);

// Full-text search
router.get('/', searchController.searchCatalogue);

// Advanced search
router.post('/advanced', searchController.advancedSearch);

// Faceted search
router.get('/facets', searchController.getFacets);

// Autocomplete/suggestions
router.get('/suggestions', searchController.getSuggestions);

// Popular/trending items
router.get('/popular', searchController.getPopularItems);

// New arrivals
router.get('/new-arrivals', searchController.getNewArrivals);

// Related items
router.get('/related/:itemId', searchController.getRelatedItems);

module.exports = router;

