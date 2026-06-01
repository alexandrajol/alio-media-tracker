# Database Seeding Options for Render Free Tier

Since Render's free tier doesn't have shell access, here are alternative ways to seed your database:

## ✅ Option 1: Automatic Seeding on Startup (Implemented)

**How it works:**
- The server automatically seeds the database when it starts in production
- Categories are only created if they don't exist
- Safe to restart - won't create duplicates

**Files:**
- `src/seedDatabase.js` - Seeding logic
- `server.js` - Calls seed function on production startup

**To add more seed data:**
1. Edit `src/seedDatabase.js`
2. Commit and push
3. Render auto-deploys

---

## Option 2: API Endpoint for Seeding

Create a protected endpoint to seed data manually:

**Add to `src/routes/adminRoutes.js`:**
```javascript
router.post('/seed', async (req, res) => {
  const { ADMIN_SECRET } = process.env;
  
  if (req.headers['x-admin-secret'] !== ADMIN_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await prisma.category.createMany({
    data: [
      { name: 'Movie' },
      { name: 'Book' },
      { name: 'TV Show' }
    ],
    skipDuplicates: true
  });

  res.json({ message: 'Database seeded!' });
});
```

**Usage:**
```bash
curl -X POST https://your-backend.onrender.com/api/admin/seed \
  -H "x-admin-secret: YOUR_SECRET_KEY"
```

---

## Option 3: Prisma Seed Script (Run Locally, Push to Production)

**Add to `package.json`:**
```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

**Create `prisma/seed.js`:**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Movie' },
      { name: 'Book' },
      { name: 'TV Show' }
    ],
    skipDuplicates: true
  });
  console.log('Seeded!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Run locally against production:**
```bash
DATABASE_URL="your-render-postgres-url" npx prisma db seed
```

---

## Option 4: One-Time Deployment Script

Add seeding to your build command (runs once per deploy):

**Render Build Command:**
```bash
npm install && cp prisma/schema.production.prisma prisma/schema.prisma && npx prisma generate && npx prisma db push --accept-data-loss && node -e "require('./src/seedDatabase')()"
```

---

## Option 5: Frontend Admin Page

Create a simple admin page in your frontend that calls the seed endpoint.

**Frontend button:**
```javascript
const seedDatabase = async () => {
  await fetch(`${API_BASE_URL}/admin/seed`, {
    method: 'POST',
    headers: { 'x-admin-secret': prompt('Enter admin secret:') }
  });
  alert('Database seeded!');
};
```

---

## Recommended Approach

**Option 1 (Automatic Seeding)** is already implemented and is the best for most cases:
- ✅ No manual steps
- ✅ Works on free tier
- ✅ Safe (checks if data exists)
- ✅ Runs on every deployment

Use Option 2 or 5 if you need to seed data on-demand without redeploying.
