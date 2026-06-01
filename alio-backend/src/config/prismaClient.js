const { PrismaClient } = require('../generated/client');

let prisma;

// Check if we're using PostgreSQL (production) or SQLite (local development)
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://')) {
  // PostgreSQL - no adapter needed
  prisma = new PrismaClient();
} else {
  // SQLite - use adapter
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  const path = require('path');
  const dbPath = process.env.ALIO_DATABASE_PATH || path.join(__dirname, '../../dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  prisma = new PrismaClient({ adapter });
}

module.exports = prisma;
