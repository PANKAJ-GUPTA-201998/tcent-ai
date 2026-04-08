require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/auth.routes');
const assessmentRoutes = require('./src/routes/assessment');
const careerRoutes = require('./src/routes/career');

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

// Root health check — Render pings GET / by default
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Auth Service', port: process.env.PORT || 3001 });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/careers', careerRoutes);

// Start HTTP server first so Render health check passes immediately
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Connect to MongoDB after server is up — failure won't crash the process
connectDB().catch((err) => {
  console.error('MongoDB connection failed:', err.message);
  console.error('Service is running but DB-dependent routes will fail until MongoDB is reachable.');
});
