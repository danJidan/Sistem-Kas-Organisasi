const ResponseHelper = require('../utils/responseHelper');

/**
 * Validation Middleware Factory
 * Membuat middleware validasi berdasarkan schema yang diberikan
 * 
 * @param {Object} schema - Schema validasi
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];
    const dataToValidate = { ...req.body, ...req.query, ...req.params };

    // Validasi setiap field dalam schema
    for (const [field, rules] of Object.entries(schema)) {
      const value = dataToValidate[field];

      // Check required
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`Field '${field}' is required`);
        continue;
      }

      // Skip validasi lain jika field tidak required dan kosong
      if (!rules.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Check type
      if (rules.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        
        if (rules.type === 'number') {
          const num = Number(value);
          if (isNaN(num)) {
            errors.push(`Field '${field}' must be a number`);
            continue;
          }
          // Convert string number to actual number
          dataToValidate[field] = num;
        } else if (rules.type === 'string' && actualType !== 'string') {
          errors.push(`Field '${field}' must be a string`);
          continue;
        } else if (rules.type === 'boolean' && actualType !== 'boolean') {
          errors.push(`Field '${field}' must be a boolean`);
          continue;
        } else if (rules.type === 'array' && !Array.isArray(value)) {
          errors.push(`Field '${field}' must be an array`);
          continue;
        } else if (rules.type === 'object' && actualType !== 'object') {
          errors.push(`Field '${field}' must be an object`);
          continue;
        }
      }

      // Check min/max untuk number
      if (rules.type === 'number') {
        const num = Number(value);
        if (rules.min !== undefined && num < rules.min) {
          errors.push(`Field '${field}' must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && num > rules.max) {
          errors.push(`Field '${field}' must be at most ${rules.max}`);
        }
      }

      // Check minLength/maxLength untuk string
      if (rules.type === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`Field '${field}' must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`Field '${field}' must be at most ${rules.maxLength} characters`);
        }
      }

      // Check enum
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`Field '${field}' must be one of: ${rules.enum.join(', ')}`);
      }

      // Check email format
      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`Field '${field}' must be a valid email address`);
        }
      }

      // Check date format (YYYY-MM-DD)
      if (rules.date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
          errors.push(`Field '${field}' must be a valid date (YYYY-MM-DD)`);
        } else {
          // Validate actual date
          const dateObj = new Date(value);
          if (isNaN(dateObj.getTime())) {
            errors.push(`Field '${field}' must be a valid date`);
          }
        }
      }

      // Check JSON format
      if (rules.json && value) {
        try {
          if (typeof value === 'string') {
            JSON.parse(value);
          } else if (typeof value !== 'object') {
            errors.push(`Field '${field}' must be valid JSON`);
          }
        } catch (e) {
          errors.push(`Field '${field}' must be valid JSON`);
        }
      }

      // Custom validator
      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(value, dataToValidate);
        if (customError) {
          errors.push(customError);
        }
      }
    }

    // Jika ada error, return error response
    if (errors.length > 0) {
      return ResponseHelper.error(res, 'Validation failed', errors, 400);
    }

    // Update req.body dengan data yang sudah divalidasi (termasuk konversi tipe)
    Object.assign(req.body, dataToValidate);
    next();
  };
};

module.exports = validate;
