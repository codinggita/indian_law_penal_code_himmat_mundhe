const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const asyncHandler = require('../middlewares/asyncHandler');

// Mounted at: /api/v1/analytics
router.get('/laws/most-viewed', asyncHandler(analyticsController.getMostViewed));
router.get('/laws/most-bookmarked', asyncHandler(analyticsController.getMostBookmarked));
router.get('/laws/by-category', asyncHandler(analyticsController.getAnalyticsByCategory));
router.get('/laws/by-state', asyncHandler(analyticsController.getAnalyticsByState));
router.get('/laws/by-court', asyncHandler(analyticsController.getAnalyticsByCourt));
router.get('/laws/recent-updates', asyncHandler(analyticsController.getRecentUpdates));
router.get('/laws/popularity', asyncHandler(analyticsController.getPopularityMetrics));
router.get('/laws/search-trends', asyncHandler(analyticsController.getSearchTrends));
router.get('/laws/user-activity', asyncHandler(analyticsController.getUserActivity));
router.get('/laws/complexity', asyncHandler(analyticsController.getComplexityDistribution));

module.exports = router;
