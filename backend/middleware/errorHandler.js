const ResponseHelper = require('../utils/responseHelper');

/**
 * Global Error Handler Middleware
 * Menangkap semua error yang terjadi di aplikasi
 */
const errorHandler = (err, req, res, next) => {
  // Log error untuk debugging
  console.error('❌ Error:', err);

  // MySQL/Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return ResponseHelper.error(res, 'Duplicate entry. Record already exists', err.sqlMessage, 409);
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return ResponseHelper.error(res, 'Foreign key constraint failed. Referenced record does not exist', err.sqlMessage, 400);
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return ResponseHelper.error(res, 'Cannot delete. Record is being used by other records', err.sqlMessage, 400);
  }

  if (err.code && err.code.startsWith('ER_')) {
    return ResponseHelper.error(res, 'Database error', err.sqlMessage, 500);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseHelper.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseHelper.unauthorized(res, 'Token expired');
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return ResponseHelper.error(res, 'Validation failed', err.details, 400);
  }

  // Custom application errors
  if (err.statusCode) {
    return ResponseHelper.error(res, err.message, err.details, err.statusCode);
  }

  // Default server error
  const details = process.env.NODE_ENV === 'development' ? {
    message: err.message,
    stack: err.stack
  } : null;

  return ResponseHelper.serverError(res, 'Internal server error', details);
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res) => {
  return ResponseHelper.notFound(res, `Route ${req.method} ${req.originalUrl} not found`);
};

module.exports = { errorHandler, notFoundHandler };
