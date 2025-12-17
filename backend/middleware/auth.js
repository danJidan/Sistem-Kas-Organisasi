const jwt = require('jsonwebtoken');
const ResponseHelper = require('../utils/responseHelper');

/**
 * Auth Middleware
 * Memeriksa JWT token dan inject user data ke req.user
 */
const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return ResponseHelper.unauthorized(res, 'No token provided');
    }

    // Format: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return ResponseHelper.unauthorized(res, 'Invalid token format. Use: Bearer <token>');
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Inject user data to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ResponseHelper.unauthorized(res, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return ResponseHelper.unauthorized(res, 'Token expired');
    }
    return ResponseHelper.unauthorized(res, 'Authentication failed');
  }
};

/**
 * Role-based authorization middleware
 * @param {Array|String} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, 'User not authenticated');
    }

    const userRole = req.user.role;
    
    if (!roles.includes(userRole)) {
      return ResponseHelper.forbidden(res, `Access denied. Required role: ${roles.join(' or ')}`);
    }

    next();
  };
};

module.exports = { auth, authorize };
