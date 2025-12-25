const express = require('express');
const router = express.Router();
const DeletionRequestController = require('../controllers/deletionRequestController');
const validate = require('../middleware/validate');
const { auth, authorize } = require('../middleware/auth');

// Validation schemas
const createRequestSchema = {
  transaction_id: { required: true, type: 'number', min: 1 },
  reason: { required: true, type: 'string', minLength: 10, maxLength: 500 }
};

const reviewSchema = {
  admin_note: { required: false, type: 'string', maxLength: 500 }
};

const idSchema = {
  id: { required: true, type: 'number', min: 1 }
};

// All routes require authentication
router.use(auth);

// Admin-only routes (harus di atas /:id agar tidak tertangkap sebagai id)
router.get('/pending/count', authorize('admin'), DeletionRequestController.getPendingCount);
router.post('/:id/approve', authorize('admin'), validate({ ...idSchema, ...reviewSchema }), DeletionRequestController.approve);
router.post('/:id/reject', authorize('admin'), validate({ ...idSchema, ...reviewSchema }), DeletionRequestController.reject);

// Routes accessible by all authenticated users
router.post('/', validate(createRequestSchema), DeletionRequestController.create);
router.get('/', DeletionRequestController.getAll);
router.get('/:id', validate(idSchema), DeletionRequestController.getById);

module.exports = router;
