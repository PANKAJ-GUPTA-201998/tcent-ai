// ============================================
// AI Service - Main Server
// ============================================
// Port: 3003
// Handles AI-powered resume analysis and recommendations

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const aiRoutes = require('./routes/aiRoutes');
const careerRoutes = require('./routes/careerRoutes');
const cacheService = require('./services/cacheService');

const app = express();
const PORT = process.env.PORT || 3003;

// ============================================
// Middleware
// ============================================

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://tcent-ai.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ============================================
// Routes
// ============================================

app.get('/', (req, res) => {
  res.json({
    service: 'Tcent.AI - AI Service',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'POST /api/ai/analyze',
      'POST /api/ai/recommend',
      'GET /api/ai/history'
    ]
  });
});

app.use('/api/ai', aiRoutes);
app.use('/api/career', careerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ============================================
// Cache Connection & Start Server
// ============================================

const startServer = async () => {
  try {
    // Connect to Redis cache
    await cacheService.connect();

    // Start Express server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🚀 Tcent.AI - AI Service');
      console.log('='.repeat(50));
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📝 API Docs: http://localhost:${PORT}`);
      console.log('='.repeat(50) + '\n');
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await cacheService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  await cacheService.disconnect();
  process.exit(0);
});

startServer();

module.exports = app;
