const { PrismaClient } = require('../generated/client');

// Check if we're using PostgreSQL (production) or SQLite (local development)
const isPostgreSQL = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://');

let prisma;

if (isPostgreSQL) {
  // PostgreSQL (production) - use native driver with pg
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
  });
} else {
  // SQLite (local development) - requires adapter
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  const path = require('path');
  const dbPath = process.env.ALIO_DATABASE_PATH || path.join(__dirname, '../../dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  prisma = new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
  });
}

module.exports = prisma;
