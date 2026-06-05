const lawService = require('../services/lawService');

class StatsController {
  // GET /api/v1/stats/laws/count
  getStatsCount = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getStatsCount({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved total counts successfully.",
      data
    });
  };

  // GET /api/v1/stats/laws/active
  getStatsActive = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getStatsActive({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved active counts successfully.",
      data
    });
  };

  // GET /api/v1/stats/laws/repealed
  getStatsRepealed = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getStatsRepealed({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved repealed counts successfully.",
      data
    });
  };

  // GET /api/v1/stats/laws/by-act
  getStatsByAct = async (req, res) => {
    const data = await lawService.getStatsByAct();
    res.status(200).json({
      success: true,
      message: "Retrieved count by act successfully.",
      data
    });
  };

  // GET /api/v1/stats/laws/by-category
  getStatsByCategory = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getStatsByCategory({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved count by category successfully.",
      data
    });
  };

  // GET /api/v1/stats/laws/by-state
  getStatsByState = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getStatsByState({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved count by state successfully.",
      data
    });
  };

  // GET /api/v1/stats/laws/by-court
  getStatsByCourt = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getStatsByCourt({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved count by court successfully.",
      data
    });
  };

  // GET /api/v1/stats/laws/recent
  getStatsRecent = async (req, res) => {
    const { act = 'ipc', days } = req.query;
    const data = await lawService.getStatsRecent({ act, days });
    res.status(200).json({
      success: true,
      message: "Retrieved recent statistics successfully.",
      data
    });
  };

  // GET /api/v1/stats/laws/trending
  getStatsTrending = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getStatsTrending({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved trending statistics successfully.",
      data
    });
  };

  // GET /api/v1/stats/laws/bookmarks
  getStatsBookmarks = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getStatsBookmarks({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved bookmark statistics successfully.",
      data
    });
  };
}

module.exports = new StatsController();
