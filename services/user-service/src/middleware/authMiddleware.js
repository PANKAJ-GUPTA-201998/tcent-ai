const jwt = require('jsonwebtoken');
const axios = require('axios');

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from header
    // Frontend will send: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided. Please login first.' 
      });
    }
    
    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];
    
    // 2. Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // decoded contains: { id: 'user_id', email: 'user@email.com', iat: ..., exp: ... }
    
    // 3. Attach user info to request object
    // Now any controller can access req.user.id and req.user.email
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    
    // 4. (Optional) You can also verify with auth-service
    // Uncomment below if you want to double-check with auth-service
    /*
    try {
      const response = await axios.get(
        `${process.env.AUTH_SERVICE_URL}/api/auth/verify`,
        { headers: { Authorization: authHeader } }
      );
      
      if (!response.data.valid) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Token verification failed' });
    }
    */
    
    // Token is valid, proceed to next middleware/controller
    next();
    
  } catch (error) {
    // Token is invalid or expired
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    
    return res.status(500).json({ 
      message: 'Authentication error', 
      error: error.message 
    });
  }
};

module.exports = authMiddleware;
