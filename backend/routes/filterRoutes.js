const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');
const asyncHandler = require('../middlewares/asyncHandler');

// Mounted at: /api/v1/laws/filter
router.get('/act/:actName', asyncHandler(filterController.filterByAct));
router.get('/chapter/:chapterId', asyncHandler(filterController.filterByChapter));
router.get('/section/:sectionNumber', asyncHandler(filterController.filterBySection));
router.get('/state/:state', asyncHandler(filterController.filterByState));
router.get('/court/:courtName', asyncHandler(filterController.filterByCourt));
router.get('/status/:status', asyncHandler(filterController.filterByStatus));
router.get('/category/:category', asyncHandler(filterController.filterByCategory));
router.get('/punishment/:type', asyncHandler(filterController.filterByPunishment));
router.get('/bailable/:value', asyncHandler(filterController.filterByBailable));
router.get('/cognizable/:value', asyncHandler(filterController.filterByCognizable));
router.get('/repealed', asyncHandler(filterController.filterRepealed));
router.get('/constitutional', asyncHandler(filterController.filterConstitutional));

module.exports = router;
