/**
 * Centralised error handler — must be registered last in Express middleware chain.
 *
 * Handles:
 *  - express-validator ValidationError arrays (passed via next(errors))
 *  - Mongoose CastError (invalid ObjectId)
 *  - Mongoose duplicate key (code 11000)
 *  - Generic operational errors
 */
const errorHandler = (err, req, res, next) => {
  // Validation errors forwarded as an array from express-validator
  if (Array.isArray(err)) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: err.map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `A record with this ${field} already exists`;
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[ErrorHandler]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
