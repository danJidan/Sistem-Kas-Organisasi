/**
 * Response Helper Utility
 * Format konsisten untuk semua response API
 */

class ResponseHelper {
  /**
   * Success Response
   * @param {Object} res - Express response object
   * @param {String} message - Success message
   * @param {*} data - Response data
   * @param {Number} statusCode - HTTP status code (default: 200)
   */
  static success(res, message, data = null, statusCode = 200) {
    const response = {
      success: true,
      message
    };
    
    if (data !== null) {
      response.data = data;
    }
    
    return res.status(statusCode).json(response);
  }

  /**
   * Error Response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {*} details - Error details (optional)
   * @param {Number} statusCode - HTTP status code (default: 400)
   */
  static error(res, message, details = null, statusCode = 400) {
    const response = {
      success: false,
      message
    };
    
    if (details !== null) {
      response.details = details;
    }
    
    return res.status(statusCode).json(response);
  }

  /**
   * Not Found Response
   * @param {Object} res - Express response object
   * @param {String} message - Not found message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, null, 404);
  }

  /**
   * Unauthorized Response
   * @param {Object} res - Express response object
   * @param {String} message - Unauthorized message
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, null, 401);
  }

  /**
   * Forbidden Response
   * @param {Object} res - Express response object
   * @param {String} message - Forbidden message
   */
  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, message, null, 403);
  }

  /**
   * Server Error Response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {*} error - Error object
   */
  static serverError(res, message = 'Internal server error', error = null) {
    const details = process.env.NODE_ENV === 'development' && error ? error.message : null;
    return this.error(res, message, details, 500);
  }
}

module.exports = ResponseHelper;
