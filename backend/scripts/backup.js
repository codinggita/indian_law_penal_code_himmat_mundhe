const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Law = require('../models/Law'); // Assuming Law is the main model

const backupData = async () => {
  try {
    console.log('Connecting to MongoDB for backup...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to Database. Fetching records...');

    const data = await Law.find({});
    
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `laws_backup_${timestamp}.json`);

    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
    
    console.log(`Backup completed successfully. Saved to: ${backupPath}`);
    process.exit(0);
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
};

backupData();
