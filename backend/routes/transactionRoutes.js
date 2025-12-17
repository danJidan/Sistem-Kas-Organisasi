const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');

// Validation schemas
const createTransactionSchema = {
  budget_id: { required: true, type: 'number', min: 1 },
  category_id: { required: true, type: 'number', min: 1 },
  trx_type: { required: true, type: 'string', enum: ['income', 'expense'] },
  amount: { required: true, type: 'number', min: 0.01 },
  trx_date: { required: true, type: 'string', date: true },
  note: { required: false, type: 'string' },
  payment_method: { required: false, type: 'string', enum: ['cash', 'transfer', 'ewallet'] },
  meta: { required: false, json: true }
};

const updateTransactionSchema = {
  budget_id: { required: true, type: 'number', min: 1 },
  category_id: { required: true, type: 'number', min: 1 },
  trx_type: { required: true, type: 'string', enum: ['income', 'expense'] },
  amount: { required: true, type: 'number', min: 0.01 },
  trx_date: { required: true, type: 'string', date: true },
  note: { required: false, type: 'string' },
  payment_method: { required: false, type: 'string', enum: ['cash', 'transfer', 'ewallet'] },
  meta: { required: false, json: true }
};

const idSchema = {
  id: { required: true, type: 'number', min: 1 }
};

// All routes require authentication
router.use(auth);

// Routes
router.get('/', TransactionController.getAll);
router.get('/:id', validate(idSchema), TransactionController.getById);
router.post('/', validate(createTransactionSchema), TransactionController.create);
router.put('/:id', validate({ ...idSchema, ...updateTransactionSchema }), TransactionController.update);
router.delete('/:id', validate(idSchema), TransactionController.delete);

module.exports = router;
