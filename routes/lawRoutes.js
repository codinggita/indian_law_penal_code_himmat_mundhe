const express = require('express');
const router = express.Router();
const lawController = require('../controllers/lawController');
const asyncHandler = require('../middlewares/asyncHandler');

// 1. Static and Specific GET Routes (placed above dynamic ID paths)
router.get('/', asyncHandler(lawController.getAllLaws));
router.get('/recent', asyncHandler(lawController.getRecentLaws));
router.get('/archived', asyncHandler(lawController.getArchivedLaws));
router.get('/random', asyncHandler(lawController.getRandomLaw));
router.get('/trending', asyncHandler(lawController.getTrendingLaws));

// 2. Specific Parameter Routes (placed above general ID path)
router.get('/exists/:id', asyncHandler(lawController.checkExists));

// 3. General ID Parameter GET Routes
router.get('/:id', asyncHandler(lawController.getLawById));

// 4. Mutation Routes (POST, PUT, PATCH, DELETE)
router.post('/', asyncHandler(lawController.createLaw));
router.put('/:id', asyncHandler(lawController.replaceLaw));
router.patch('/:id', asyncHandler(lawController.updateLaw));
router.delete('/:id', asyncHandler(lawController.deleteLaw));

// 5. Nested Resource / Action PATCH/GET Routes
router.patch('/:id/archive', asyncHandler(lawController.archiveLaw));
router.patch('/:id/restore', asyncHandler(lawController.restoreLaw));
router.get('/:id/history', asyncHandler(lawController.getHistory));
router.get('/:id/summary', asyncHandler(lawController.getSummary));

module.exports = router;
