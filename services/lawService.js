const { getLawModel, allowedActs } = require('../models/Law');
const mongoose = require('mongoose');

/**
 * Standard CSV Line Parser
 * Splits comma-separated values, respecting double quotes.
 */
const parseCSVLine = (line) => {
  const result = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  result.push(cell);
  return result.map(c => c.trim().replace(/^"|"$/g, ''));
};

/**
 * Normalize heterogeneous document structures to a unified JSON layout
 */
const normalizeLaw = (doc, act) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  
  const normalized = {
    id: obj._id,
    act: act.toUpperCase(),
    chapter: obj.chapter,
    chapter_title: obj.chapter_title,
    section: obj.section !== undefined ? obj.section : obj.Section,
    title: obj.section_title || obj.title,
    description: obj.section_desc || obj.description,
    isArchived: obj.isArchived || false,
    isDeleted: obj.isDeleted || false,
    views: obj.views || 0,
    bookmarkCount: obj.bookmarkCount || 0,
    history: obj.history || [],
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  };

  // Special handling for the Hindu Marriage Act (hma) comma-separated field
  const csvField = obj["chapter,section,section_title,section_desc"];
  if (csvField) {
    try {
      const parts = parseCSVLine(csvField);
      normalized.chapter = parts[0] ? parseInt(parts[0], 10) : undefined;
      normalized.section = parts[1] ? parseInt(parts[1], 10) : undefined;
      normalized.title = parts[2] || undefined;
      normalized.description = parts[3] || undefined;
    } catch (err) {
      console.error("Failed parsing HMA CSV fields:", err.message);
    }
  }

  return normalized;
};

/**
 * Map normalized request bodies back to the specific collection schema layout
 */
const mapToCollectionSchema = (normalizedData, act) => {
  const normalizedAct = act.toLowerCase();
  const rawData = {};
  
  if (normalizedAct === 'ipc') {
    if (normalizedData.chapter !== undefined) rawData.chapter = normalizedData.chapter;
    if (normalizedData.chapter_title !== undefined) rawData.chapter_title = normalizedData.chapter_title;
    if (normalizedData.section !== undefined) rawData.Section = normalizedData.section;
    if (normalizedData.title !== undefined) rawData.section_title = normalizedData.title;
    if (normalizedData.description !== undefined) rawData.section_desc = normalizedData.description;
  } else if (['crpc', 'iea', 'nia'].includes(normalizedAct)) {
    if (normalizedData.chapter !== undefined) rawData.chapter = normalizedData.chapter;
    if (normalizedData.section !== undefined) rawData.section = normalizedData.section;
    if (normalizedData.title !== undefined) rawData.section_title = normalizedData.title;
    if (normalizedData.description !== undefined) rawData.section_desc = normalizedData.description;
  } else if (['cpc', 'ida', 'mva'].includes(normalizedAct)) {
    if (normalizedData.section !== undefined) rawData.section = normalizedData.section;
    if (normalizedData.title !== undefined) rawData.title = normalizedData.title;
    if (normalizedData.description !== undefined) rawData.description = normalizedData.description;
  } else if (normalizedAct === 'hma') {
    // If saving to HMA, we rebuild the CSV row string
    const chapterStr = normalizedData.chapter !== undefined ? normalizedData.chapter : '';
    const sectionStr = normalizedData.section !== undefined ? normalizedData.section : '';
    const titleStr = normalizedData.title || '';
    const descStr = normalizedData.description || '';
    
    rawData["chapter,section,section_title,section_desc"] = `${chapterStr},${sectionStr},"${titleStr}","${descStr}"`;
  } else {
    Object.assign(rawData, normalizedData);
  }

  // Common metadata
  if (normalizedData.isArchived !== undefined) rawData.isArchived = normalizedData.isArchived;
  if (normalizedData.isDeleted !== undefined) rawData.isDeleted = normalizedData.isDeleted;
  if (normalizedData.views !== undefined) rawData.views = normalizedData.views;
  if (normalizedData.bookmarkCount !== undefined) rawData.bookmarkCount = normalizedData.bookmarkCount;
  
  return rawData;
};

class LawService {
  /**
   * Fetch all laws from a collection (paginated, sorted, filtered)
   */
  async getAllLaws({ act = 'ipc', page = 1, limit = 10, sort = 'section', isArchived = false }) {
    const LawModel = getLawModel(act);
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Filter out soft-deleted records and handle archive toggle
    const filter = {
      isDeleted: { $ne: true }
    };
    if (isArchived === 'true' || isArchived === true) {
      filter.isArchived = true;
    } else {
      filter.isArchived = { $ne: true };
    }

    // Construct sort object. E.g., 'section' -> { section: 1 } or '-section' -> { section: -1 }
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortDirection = sort.startsWith('-') ? -1 : 1;
    
    // Support sorting by both 'section' and IPC capitalized 'Section'
    const sortObj = {};
    if (sortField === 'section' && act.toLowerCase() === 'ipc') {
      sortObj.Section = sortDirection;
    } else {
      sortObj[sortField] = sortDirection;
    }

    const [docs, total] = await Promise.all([
      LawModel.find(filter).sort(sortObj).skip(skipNum).limit(limitNum),
      LawModel.countDocuments(filter)
    ]);

    return {
      metadata: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      data: docs.map(doc => normalizeLaw(doc, act))
    };
  }

  /**
   * Fetch a single law by ID (and increment view count)
   */
  async getLawById(act, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Invalid Law ID format');
      err.statusCode = 400;
      throw err;
    }

    const LawModel = getLawModel(act);
    
    // Find and increment views in a single database roundtrip
    const doc = await LawModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!doc) {
      const err = new Error('Law record not found');
      err.statusCode = 404;
      throw err;
    }

    return normalizeLaw(doc, act);
  }

  /**
   * Create a new law record
   */
  async createLaw(act, lawData) {
    const LawModel = getLawModel(act);
    const rawData = mapToCollectionSchema(lawData, act);
    
    const doc = await LawModel.create(rawData);
    return normalizeLaw(doc, act);
  }

  /**
   * Replace a law record (PUT)
   */
  async replaceLaw(act, id, lawData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Invalid Law ID format');
      err.statusCode = 400;
      throw err;
    }

    const LawModel = getLawModel(act);
    const rawData = mapToCollectionSchema(lawData, act);

    // Keep history intact
    const historyEntry = {
      timestamp: new Date(),
      action: 'REPLACE',
      changes: rawData
    };

    const doc = await LawModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { 
        $set: rawData,
        $push: { history: historyEntry }
      },
      { new: true, runValidators: true }
    );

    if (!doc) {
      const err = new Error('Law record not found to replace');
      err.statusCode = 404;
      throw err;
    }

    return normalizeLaw(doc, act);
  }

  /**
   * Update partial fields of a law record (PATCH)
   */
  async updateLaw(act, id, lawData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Invalid Law ID format');
      err.statusCode = 400;
      throw err;
    }

    const LawModel = getLawModel(act);
    const rawData = mapToCollectionSchema(lawData, act);

    const historyEntry = {
      timestamp: new Date(),
      action: 'UPDATE',
      changes: rawData
    };

    const doc = await LawModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { 
        $set: rawData,
        $push: { history: historyEntry }
      },
      { new: true, runValidators: true }
    );

    if (!doc) {
      const err = new Error('Law record not found to update');
      err.statusCode = 404;
      throw err;
    }

    return normalizeLaw(doc, act);
  }

  /**
   * Soft Delete a law record (sets isDeleted to true)
   */
  async deleteLaw(act, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Invalid Law ID format');
      err.statusCode = 400;
      throw err;
    }

    const LawModel = getLawModel(act);

    const doc = await LawModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { 
        $set: { isDeleted: true },
        $push: { 
          history: { timestamp: new Date(), action: 'SOFT_DELETE' } 
        } 
      },
      { new: true }
    );

    if (!doc) {
      const err = new Error('Law record not found to delete');
      err.statusCode = 404;
      throw err;
    }

    return { success: true, message: `Law successfully soft-deleted.` };
  }

  /**
   * Check if a law exists
   */
  async checkExists(act, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { exists: false };
    }
    const LawModel = getLawModel(act);
    const count = await LawModel.countDocuments({ _id: id, isDeleted: { $ne: true } });
    return { exists: count > 0 };
  }

  /**
   * Fetch recently added laws
   */
  async getRecentLaws({ act = 'ipc', page = 1, limit = 10 }) {
    return this.getAllLaws({ act, page, limit, sort: '-createdAt' });
  }

  /**
   * Fetch archived laws
   */
  async getArchivedLaws({ act = 'ipc', page = 1, limit = 10 }) {
    return this.getAllLaws({ act, page, limit, sort: 'section', isArchived: true });
  }

  /**
   * Archive a law record
   */
  async archiveLaw(act, id) {
    return this.updateLaw(act, id, { isArchived: true });
  }

  /**
   * Restore an archived law record
   */
  async restoreLaw(act, id) {
    return this.updateLaw(act, id, { isArchived: false });
  }

  /**
   * Fetch update history of a law record
   */
  async getHistory(act, id) {
    const law = await this.getLawById(act, id);
    return law.history || [];
  }

  /**
   * Fetch summary of a law record (shortened description / mock summary)
   */
  async getSummary(act, id) {
    const law = await this.getLawById(act, id);
    if (!law.description) {
      return { summary: 'No description available to summarize.' };
    }
    
    // Return first 200 characters followed by ellipses as a summary
    const cleanDesc = law.description.replace(/\n\t/g, ' ').replace(/\s+/g, ' ').trim();
    const summary = cleanDesc.length > 200 ? `${cleanDesc.substring(0, 200)}...` : cleanDesc;
    
    return {
      id: law.id,
      title: law.title,
      section: law.section,
      summary
    };
  }

  /**
   * Fetch a random law record
   */
  async getRandomLaw(act) {
    const LawModel = getLawModel(act);
    
    const docs = await LawModel.aggregate([
      { $match: { isDeleted: { $ne: true }, isArchived: { $ne: true } } },
      { $sample: { size: 1 } }
    ]);

    if (!docs || docs.length === 0) {
      const err = new Error('No active law records found in this collection');
      err.statusCode = 404;
      throw err;
    }

    return normalizeLaw(docs[0], act);
  }

  /**
   * Fetch trending law records (sorted by views descending)
   */
  async getTrendingLaws({ act = 'ipc', page = 1, limit = 10 }) {
    return this.getAllLaws({ act, page, limit, sort: '-views' });
  }
}

module.exports = new LawService();
