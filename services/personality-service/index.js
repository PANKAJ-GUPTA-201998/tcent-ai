require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Middleware
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
app.use(apiLimiter);

// Root health check — Render pings GET / by default
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'personality-service' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Personality Service', port: process.env.PORT || 3005 });
});

// Routes
app.use('/api/personality', require('./routes/personality'));

// Error handler — must be last
app.use(errorHandler);

// Start HTTP server first so Render health check passes immediately
const PORT = process.env.PORT || 3005;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Personality Service running on port ${PORT}`);
});

// Connect to MongoDB after server is up — failure won't crash the process
connectDB().catch((err) => {
  console.error('MongoDB connection failed:', err.message);
  console.error('Service is running but DB-dependent routes will fail until MongoDB is reachable.');
});
