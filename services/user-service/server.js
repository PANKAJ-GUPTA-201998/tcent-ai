require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const profileRoutes = require('./src/routes/profileRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Allow frontend to connect from different port
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/profile', profileRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'User Service',
    port: process.env.PORT 
  });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 User Service running on http://localhost:${PORT}`);
});
