require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/auth.routes');
const assessmentRoutes = require('./src/routes/assessment');
const careerRoutes = require('./src/routes/career');

const app = express();

// Connect to MongoDB
connectDB();

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/careers', careerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Auth Service', port: process.env.PORT });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
