const express = require('express');
const cors = require('cors');
const mediaRoutes = require('./routes/mediaRoutes');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middleware/requireAuth');

const app = express();

// CORS configuration - allows frontend from any origin in development, specific in production
const corsOptions = {
  origin: process.env.FRONTEND_URL || true, // Use FRONTEND_URL in production, allow all in development
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); // Allows Express to understand JSON bodies
app.use('/api/auth', authRoutes);
app.use('/api/media', requireAuth, mediaRoutes);

module.exports = app;
