# Deployment Guide - Render.com

## 🚀 Deploy to Render (Free)

### Prerequisites
- GitHub account
- Render.com account (free signup at https://render.com)

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for PostgreSQL deployment"
git push origin main
```

### Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - **Name:** `alio-database`
   - **Database:** `alio_db`
   - **User:** (auto-generated)
   - **Region:** Choose closest to you
   - **Plan:** Free (256 MB)
4. Click **"Create Database"**
5. Wait ~2 minutes for provisioning
6. **Copy the "Internal Database URL"** (starts with `postgresql://`)

### Step 3: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Settings:
   - **Name:** `alio-backend`
   - **Root Directory:** `alio-backend`
   - **Environment:** Node
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `node server.js`
   - **Plan:** Free
4. **Environment Variables** (click "Add Environment Variable"):
   - Key: `DATABASE_URL`
   - Value: (paste the Internal Database URL from Step 2)
   - Key: `NODE_ENV`
   - Value: `production`
5. Click **"Create Web Service"**
6. Wait for deployment (~3-5 minutes)
7. **Copy your backend URL** (e.g., `https://alio-backend.onrender.com`)

### Step 4: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Settings:
   - **Name:** `alio-frontend`
   - **Root Directory:** `alio`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. **Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: `https://alio-backend.onrender.com/api` (use your backend URL from Step 3)
5. Click **"Create Static Site"**
6. Wait for deployment (~2 minutes)

### Step 5: Update Backend CORS

After getting your frontend URL (e.g., `https://alio-frontend.onrender.com`):

1. Go to your backend service on Render
2. Add environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://alio-frontend.onrender.com`
3. The app will auto-redeploy

### Step 6: Seed Database (Optional)

If you need to add initial categories:

1. Go to your backend service on Render
2. Click **"Shell"** tab
3. Run:
```bash
node -e "
const prisma = require('./src/config/prismaClient');
(async () => {
  await prisma.category.createMany({
    data: [
      { name: 'Movie' },
      { name: 'Book' },
      { name: 'TV Show' }
    ],
    skipDuplicates: true
  });
  console.log('Categories seeded!');
})();
"
```

---

## 🎉 You're Live!

Your app is now publicly accessible at:
- **Frontend:** `https://alio-frontend.onrender.com`
- **Backend API:** `https://alio-backend.onrender.com/api`

### Important Notes:
- Free tier services sleep after 15 min of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Upgrade to paid tier ($7/month per service) for always-on

### Troubleshooting:
- Check logs in Render dashboard
- Verify DATABASE_URL is set correctly
- Ensure CORS allows your frontend URL
