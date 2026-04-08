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

// ─── Route modules (reused from service directories) ─────────────────────────

const authRoutes        = require('../services/auth-service/src/routes/auth.routes');
const uploadRoutes      = require('../services/upload-service/src/routes/uploadRoutes');
const aiRoutes          = require('../services/ai-service/src/routes/aiRoutes');
const careerRoutes      = require('../services/ai-service/src/routes/careerRoutes');
const personalityRoutes = require('../services/personality-service/routes/personality');

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
  } catch (err) {
    console.error('[db] connection failed:', err.message);
    // Don't block the request — routes that need DB will fail naturally
  }
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const uri = process.env.MONGODB_URI;

    console.log('MONGODB_URI exists:', !!uri);
    console.log('URI starts with:', uri ? uri.substring(0, 20) + '...' : 'undefined');
    console.log('Mongoose connection state:', mongoose.connection.readyState);

    if (mongoose.connection.readyState === 1) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      return res.json({
        status: 'connected',
        collections: collections.map(c => c.name),
      });
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    res.json({ status: 'connected successfully' });
  } catch (error) {
    console.error('DB Test Error:', error.message);
    res.status(500).json({
      status: 'failed',
      error: error.message,
      mongoUri: process.env.MONGODB_URI ? 'exists' : 'MISSING',
    });
  }
});

app.use('/api/auth',        authRoutes);
app.use('/api/upload',      uploadRoutes);
app.use('/api/ai',          aiRoutes);
app.use('/api/career',      careerRoutes);
app.use('/api/personality', personalityRoutes);

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
