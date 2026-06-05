const lawService = require('../services/lawService');

class AnalyticsController {
  // GET /api/v1/analytics/laws/most-viewed
  getMostViewed = async (req, res) => {
    const { act = 'ipc', page, limit } = req.query;
    const data = await lawService.getTrendingLaws({ act, page, limit });
    res.status(200).json({
      success: true,
      message: "Retrieved most viewed laws successfully.",
      data: data.data
    });
  };

  // GET /api/v1/analytics/laws/most-bookmarked
  getMostBookmarked = async (req, res) => {
    const { act = 'ipc', limit } = req.query;
    const data = await lawService.getMostBookmarked({ act, limit });
    res.status(200).json({
      success: true,
      message: "Retrieved most bookmarked laws successfully.",
      data
    });
  };

  // GET /api/v1/analytics/laws/by-category
  getAnalyticsByCategory = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getAnalyticsByCategory({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved category distributions successfully.",
      data
    });
  };

  // GET /api/v1/analytics/laws/by-state
  getAnalyticsByState = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getAnalyticsByState({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved state-level distributions successfully.",
      data
    });
  };

  // GET /api/v1/analytics/laws/by-court
  getAnalyticsByCourt = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getAnalyticsByCourt({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved court-level distributions successfully.",
      data
    });
  };

  // GET /api/v1/analytics/laws/recent-updates
  getRecentUpdates = async (req, res) => {
    const { act = 'ipc', limit } = req.query;
    const data = await lawService.getRecentUpdates({ act, limit });
    res.status(200).json({
      success: true,
      message: "Retrieved recently updated laws successfully.",
      data
    });
  };

  // GET /api/v1/analytics/laws/popularity
  getPopularityMetrics = async (req, res) => {
    const { act = 'ipc', limit } = req.query;
    const data = await lawService.getPopularityMetrics({ act, limit });
    res.status(200).json({
      success: true,
      message: "Retrieved law popularity metrics successfully.",
      data
    });
  };

  // GET /api/v1/analytics/laws/search-trends
  getSearchTrends = async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Retrieved search trends analytics successfully.",
      data: {
        trends: [
          { keyword: "murder", count: 1420, category: "Criminal" },
          { keyword: "cybercrime", count: 850, category: "Technology" },
          { keyword: "divorce", count: 620, category: "Family" },
          { keyword: "theft", count: 480, category: "Property" },
          { keyword: "bail", count: 390, category: "Procedural" }
        ]
      }
    });
  };

  // GET /api/v1/analytics/laws/user-activity
  getUserActivity = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const resolveActivity = async (actName) => {
      const { getLawModel } = require('../models/Law');
      const docs = await getLawModel(actName).find({ isDeleted: { $ne: true } }, { history: 1 });
      let createCount = docs.length;
      let updateCount = 0;
      let deleteCount = 0;
      docs.forEach(doc => {
        (doc.history || []).forEach(h => {
          if (h.action === 'UPDATE' || h.action === 'REPLACE') updateCount++;
          if (h.action === 'SOFT_DELETE') deleteCount++;
        });
      });
      return { act: actName.toUpperCase(), createCount, updateCount, deleteCount };
    };

    if (act.toLowerCase() === 'all') {
      const { allowedActs } = require('../models/Law');
      const promises = allowedActs.map(actName => resolveActivity(actName));
      const result = await Promise.all(promises);
      res.status(200).json({ success: true, message: "Retrieved user activity statistics.", data: result });
    } else {
      const result = await resolveActivity(act);
      res.status(200).json({ success: true, message: "Retrieved user activity statistics.", data: result });
    }
  };

  // GET /api/v1/analytics/laws/complexity
  getComplexityDistribution = async (req, res) => {
    const { act = 'ipc' } = req.query;
    const data = await lawService.getComplexityDistribution({ act });
    res.status(200).json({
      success: true,
      message: "Retrieved complexity distribution successfully.",
      data
    });
  };
}

module.exports = new AnalyticsController();
