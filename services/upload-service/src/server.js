require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://tcent-ai.vercel.app',
    'https://tcent-ai-git-main-pankaj-gupta-201998.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Root health check — Render pings GET / by default
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'upload-service' });
});

app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start HTTP server first so Render health check passes immediately
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('Tcent.AI - Upload Service');
  console.log('='.repeat(50));
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});

// Connect to MongoDB after server is up — failure won't crash the process
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    console.error('Service is running but DB-dependent routes will fail until MongoDB is reachable.');
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
