const jwt = require('jsonwebtoken');

/**
 * Verify JWT from the Authorization header and attach req.user.
 *
 * This service does not own the User collection — it trusts the token
 * issued by auth-service and reads identity from the payload only.
 * No database lookup is performed here.
 *
 * Attaches: req.user = { userId, email, role }
 */
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization required.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized.',
    });
  }
};

module.exports = auth;
