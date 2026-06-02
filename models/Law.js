const mongoose = require('mongoose');

const LawSchema = new mongoose.Schema({
  chapter: { type: Number },
  chapter_title: { type: String },
  section: { type: Number },
  Section: { type: Number }, // Support capitalized 'Section' from IPC
  section_title: { type: String },
  title: { type: String }, // Support 'title' from CPC, IDA, MVA
  section_desc: { type: String },
  description: { type: String }, // Support 'description' from CPC, IDA, MVA
  
  // Custom field to capture raw comma-separated records found in HMA
  "chapter,section,section_title,section_desc": { type: String },

  // Metadata tracks
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  history: [
    {
      timestamp: { type: Date, default: Date.now },
      action: { type: String },
      changes: { type: mongoose.Schema.Types.Mixed }
    }
  ]
}, { 
  timestamps: true,
  strict: false // Allows reading and storing any fields that may not be declared above
});

const modelsCache = {};
const allowedActs = ['ipc', 'crpc', 'cpc', 'hma', 'iea', 'nia', 'ida', 'mva'];

const getLawModel = (actName) => {
  if (!actName) {
    throw new Error('Act name is required to resolve a database collection.');
  }
  const normalizedAct = actName.toLowerCase();
  
  if (!allowedActs.includes(normalizedAct)) {
    throw new Error(`Invalid law act: "${actName}". Allowed acts: ${allowedActs.join(', ').toUpperCase()}`);
  }
  
  if (!modelsCache[normalizedAct]) {
    // Compiles Mongoose model targeting the specific collection name (3rd argument)
    modelsCache[normalizedAct] = mongoose.model(normalizedAct, LawSchema, normalizedAct);
  }
  
  return modelsCache[normalizedAct];
};

module.exports = {
  LawSchema,
  getLawModel,
  allowedActs
};
