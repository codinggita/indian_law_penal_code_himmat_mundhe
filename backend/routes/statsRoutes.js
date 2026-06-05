const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const asyncHandler = require('../middlewares/asyncHandler');

// Mounted at: /api/v1/stats
router.get('/laws/count', asyncHandler(statsController.getStatsCount));
router.get('/laws/active', asyncHandler(statsController.getStatsActive));
router.get('/laws/repealed', asyncHandler(statsController.getStatsRepealed));
router.get('/laws/by-act', asyncHandler(statsController.getStatsByAct));
router.get('/laws/by-category', asyncHandler(statsController.getStatsByCategory));
router.get('/laws/by-state', asyncHandler(statsController.getStatsByState));
router.get('/laws/by-court', asyncHandler(statsController.getStatsByCourt));
router.get('/laws/recent', asyncHandler(statsController.getStatsRecent));
router.get('/laws/trending', asyncHandler(statsController.getStatsTrending));
router.get('/laws/bookmarks', asyncHandler(statsController.getStatsBookmarks));

module.exports = router;
