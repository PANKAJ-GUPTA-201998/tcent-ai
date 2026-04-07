require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Personality Service', port: process.env.PORT || 3005 });
});

// Routes
app.use('/api/personality', require('./routes/personality'));

// Error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Personality Service running on port ${PORT}`);
});
