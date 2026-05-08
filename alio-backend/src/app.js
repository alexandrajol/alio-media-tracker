// src/app.js
const express = require('express');
const cors = require('cors'); // <-- ADD THIS
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

app.use(cors()); // <-- ADD THIS: Allows React to talk to Express
app.use(express.json()); // Allows Express to understand JSON bodies
app.use('/api/media', mediaRoutes);

module.exports = app;