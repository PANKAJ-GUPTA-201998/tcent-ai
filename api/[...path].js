/**
 * Tcent.AI — Unified Vercel Serverless API Handler
 *
 * All /api/* requests are routed here by vercel.json rewrites.
 * This Express app delegates to the existing route files in each
 * service directory; their own relative imports resolve correctly
 * because Node.js traces them from each file's own location.
 *
 * Vercel config: bodyParser disabled so Express + multer own all parsing.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./_lib/db');

// ─── Mongoose singleton enforcement ──────────────────────────────────────────
// Service directories commit their own node_modules/mongoose to git.  When
// Vercel deploys, both root and service-level mongoose packages are present,
// creating separate instances — each with its own connection state.  Models
// registered on a service instance never see the connection established by
// connectDB (which uses the root instance), causing buffering timeouts.
//
// Fix: override the require cache for every service mongoose path so they all
// resolve to the root instance.  This must happen before any route module is
// required (route requires trigger model file requires).
(function enforceMongooseSingleton() {
  const rootMongoosePath = require.resolve('mongoose');
  const rootEntry = require.cache[rootMongoosePath];
  if (!rootEntry) return; // shouldn't happen, but guard anyway

  const servicePaths = [
    '../services/auth-service/node_modules/mongoose',
    '../services/upload-service/node_modules/mongoose',
    '../services/personality-service/node_modules/mongoose',
    '../services/ai-service/node_modules/mongoose',
    '../services/ats-service/node_modules/mongoose',
  ];

  servicePaths.forEach((rel) => {
    try {
      const resolved = require.resolve(rel);
      if (resolved !== rootMongoosePath) {
        require.cache[resolved] = rootEntry;
      }
    } catch (_) {
      // path doesn't exist — fine, skip
    }
  });
}());

// ─── Route modules (reused from service directories) ─────────────────────────

const authRoutes        = require('../services/auth-service/src/routes/auth.routes');
const uploadRoutes      = require('../services/upload-service/src/routes/uploadRoutes');
const aiRoutes          = require('../services/ai-service/src/routes/aiRoutes');
const careerRoutes      = require('../services/ai-service/src/routes/careerRoutes');
const personalityRoutes = require('../services/personality-service/routes/personality');
const atsRoutes         = require('../services/ats-service/routes/ats');

// ─── App setup ────────────────────────────────────────────────────────────────

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://tcent-ai.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));

// Let Express own all body parsing (Vercel's built-in parser is disabled below)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── DB middleware ────────────────────────────────────────────────────────────
// Ensures a live MongoDB connection before any route handler runs.
// Uses the cached connection on warm invocations (no-op cost).

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[db] connection failed:', err.message);
    res.status(503).json({ success: false, message: 'Database unavailable. Please try again shortly.' });
  }
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth',        authRoutes);
app.use('/api/upload',      uploadRoutes);
app.use('/api/ai',          aiRoutes);
app.use('/api/career',      careerRoutes);
app.use('/api/personality', personalityRoutes);
app.use('/api/ats',         atsRoutes);

// ─── Fallback ─────────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, req, res, next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── Export ───────────────────────────────────────────────────────────────────
// Disable Vercel's body parser so Express + multer handle all parsing.

const handler = app;
handler.config = { api: { bodyParser: false } };

module.exports = handler;
