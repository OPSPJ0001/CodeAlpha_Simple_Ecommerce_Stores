const fs = require('fs');
const path = require('path');
const db = require('../src/db');

function runSqlFile(filePath) {
  const abs = path.join(__dirname, '..', filePath);
  const sql = fs.readFileSync(abs, 'utf8');
  db.exec(sql);
  console.log(`Executed: ${filePath}`);
}

try {
  runSqlFile('src/schema.sql');
  runSqlFile('src/seed.sql');
  console.log('Database initialized successfully.');
} catch (err) {
  console.error('DB init failed:', err);
  process.exit(1);
}
