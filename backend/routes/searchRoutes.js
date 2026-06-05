const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const asyncHandler = require('../middlewares/asyncHandler');
const { searchLimiter } = require('../middlewares/rateLimiter');

router.use(searchLimiter);

// GET /api/v1/search/laws?q=...
router.get('/laws', asyncHandler(searchController.searchLaws));

module.exports = router;
