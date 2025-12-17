const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');

// Validation schemas
const createCategorySchema = {
  name: { required: true, type: 'string', minLength: 3, maxLength: 120 },
  type: { required: true, type: 'string', enum: ['income', 'expense', 'both'] },
  description: { required: false, type: 'string' },
  is_active: { required: false, type: 'number', enum: [0, 1] }
};

const updateCategorySchema = {
  name: { required: true, type: 'string', minLength: 3, maxLength: 120 },
  type: { required: true, type: 'string', enum: ['income', 'expense', 'both'] },
  description: { required: false, type: 'string' },
  is_active: { required: false, type: 'number', enum: [0, 1] }
};

const idSchema = {
  id: { required: true, type: 'number', min: 1 }
};

// All routes require authentication
router.use(auth);

// Routes
router.get('/', CategoryController.getAll);
router.get('/:id', validate(idSchema), CategoryController.getById);
router.post('/', validate(createCategorySchema), CategoryController.create);
router.put('/:id', validate({ ...idSchema, ...updateCategorySchema }), CategoryController.update);
router.delete('/:id', validate(idSchema), CategoryController.delete);

module.exports = router;
