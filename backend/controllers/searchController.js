const lawService = require('../services/lawService');

class SearchController {
  // GET /api/v1/search/laws?q=...
  searchLaws = async (req, res) => {
    const { q, act = 'ipc', page, limit } = req.query;
    const result = await lawService.searchLaws({ q, act, page, limit });
    res.status(200).json({
      success: true,
      message: `Search for "${q || ''}" completed successfully.`,
      metadata: result.metadata,
      data: result.data
    });
  };
}

module.exports = new SearchController();
