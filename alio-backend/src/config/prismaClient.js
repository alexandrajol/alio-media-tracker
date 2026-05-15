const { PrismaClient } = require('../generated/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

// 1. Create a raw SQLite database connection
const db = new Database('../prisma/dev.db');

// 2. Wrap it in the Prisma adapter
const adapter = new PrismaBetterSqlite3(db);

// 3. Pass the adapter into the PrismaClient constructor
const prisma = new PrismaClient({ adapter });

module.exports = prisma;