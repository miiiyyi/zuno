// backend/db.js
const path = require('path')
const Database = require('better-sqlite3')

// This creates a file-based DB: backend/zuno.sqlite
const DB_PATH = path.join(__dirname, 'zuno.sqlite')
const db = new Database(DB_PATH)

// Create tables if they don't exist
function initDb() {
  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      store TEXT NOT NULL,
      price REAL NOT NULL,

      unit_amount REAL,
      unit_type TEXT,

      created_at TEXT,
      updated_at TEXT,
      end_at TEXT NOT NULL,

      popularity_score REAL DEFAULT 0,
      badge TEXT,
      address TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_coupons_store ON coupons(store);
    CREATE INDEX IF NOT EXISTS idx_coupons_category ON coupons(category);
    CREATE INDEX IF NOT EXISTS idx_coupons_updated ON coupons(updated_at);
  `)
}

module.exports = { db, initDb }
