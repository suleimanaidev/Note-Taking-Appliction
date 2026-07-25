/**
 * NoteVault - Decoupled & Unified MERN Backend API
 * Running on Port 5000
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect Database ──────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

// CORS configuration for decoupled frontend
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow requests during local dev
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' }
});

app.use('/api/', apiLimiter);

// ── Mount Modular API Routes ─────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// ── Production Frontend Serving & Health Check ───────────
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: '🚀 NoteVault MERN Backend API Server is running',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        notes: '/api/notes'
      }
    });
  });
}

// ── Central Error Handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 NoteVault Backend API listening on http://localhost:${PORT}`);
});

module.exports = app;

