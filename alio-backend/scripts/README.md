# Production Database Seeding Script

This script populates your production database with all the media from your local database.

## 📊 What It Seeds

- **1 Demo User:**
  - Email: `demo@alio.com`
  - Password: `demo123456`
  
- **39 Media Items:**
  - 15 Movies
  - 14 Books
  - 10 TV Shows

All with titles, ratings, reviews, posters, and metadata from your local database.

---

## 🚀 How to Run

### Prerequisites

Make sure you're in the `alio-backend` directory:

```bash
cd alio-backend
```

### Step 1: Install dependencies (if needed)

```bash
npm install node-fetch@2
```

### Step 2: Run the seeding script

```bash
node scripts/seedProduction.js
```

### Expected Output

```
🚀 Starting production database seeding...

👤 Creating demo user...
✅ Demo user created successfully!

📚 Adding 39 media items...
✓ Added 39/39 media items

🎉 Seeding complete!
   ✅ Successfully added: 39 items

📧 Demo account: demo@alio.com
🔑 Password: demo123456
```

---

## ⚠️ Important Notes

- **Run this ONCE** after initial deployment
- If you run it again, it will:
  - Try to login with existing demo user
  - Add duplicate media items (they won't have unique constraints)
- To reset, you'd need to delete the demo user's media first

---

## 🔧 Troubleshooting

### "Failed to create user: Email is already registered"
The script will automatically try to login instead. This is normal.

### Network errors
Make sure your production backend is running at:
`https://alio-backend.onrender.com`

### Rate limiting
The script adds a 100ms delay between requests to avoid overwhelming the server.

---

## 🎯 After Seeding

You can now:
1. Login to your frontend with `demo@alio.com` / `demo123456`
2. See all 39 media items populated
3. Showcase your app with real data!

Real users can still create their own accounts and add their own media.
