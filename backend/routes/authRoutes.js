const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { auth, authorize } = require('../middleware/auth');

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

const updateRoleSchema = {
  role: { required: true, type: 'string', enum: ['admin', 'member'] }
};

const idSchema = {
  id: { required: true, type: 'number', min: 1 }
};

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

// Protected routes
router.get('/me', auth, AuthController.getProfile);

// Admin-only routes
router.get('/users', auth, authorize('admin'), AuthController.getAllUsers);
router.put('/users/:id/role', auth, authorize('admin'), validate({ ...idSchema, ...updateRoleSchema }), AuthController.updateUserRole);
router.delete('/users/:id', auth, authorize('admin'), validate(idSchema), AuthController.deleteUser);

module.exports = router;
