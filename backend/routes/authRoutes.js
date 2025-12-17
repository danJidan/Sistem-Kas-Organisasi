const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');

// Validation schemas
const registerSchema = {
  name: { required: true, type: 'string', minLength: 3, maxLength: 100 },
  email: { required: true, type: 'string', email: true, maxLength: 120 },
  password: { required: true, type: 'string', minLength: 6 },
  role: { required: false, type: 'string', enum: ['admin', 'member'] }
};

const loginSchema = {
  email: { required: true, type: 'string', email: true },
  password: { required: true, type: 'string' }
};

// Routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', auth, AuthController.getProfile);

module.exports = router;
