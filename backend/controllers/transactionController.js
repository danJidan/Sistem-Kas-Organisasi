const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');
const ResponseHelper = require('../utils/responseHelper');

class TransactionController {
  /**
   * Get all transactions with pagination
   * GET /transactions
   */
  static async getAll(req, res, next) {
    try {
      const {
        budget_id,
        category_id,
        trx_type,
        payment_method,
        date_from,
        date_to,
        page = 1,
        limit = 10
      } = req.query;

      const filters = {};
      if (budget_id) filters.budget_id = parseInt(budget_id);
      if (category_id) filters.category_id = parseInt(category_id);
      if (trx_type) filters.trx_type = trx_type;
      if (payment_method) filters.payment_method = payment_method;
      if (date_from) filters.date_from = date_from;
      if (date_to) filters.date_to = date_to;

      const result = await Transaction.getAll(filters, parseInt(page), parseInt(limit));
      
      return ResponseHelper.success(res, 'Transactions retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transaction by ID
   * GET /transactions/:id
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findById(id);
      
      if (!transaction) {
        return ResponseHelper.notFound(res, 'Transaction not found');
      }

      return ResponseHelper.success(res, 'Transaction retrieved successfully', { transaction });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new transaction
   * POST /transactions
   */
  static async create(req, res, next) {
    try {
      const {
        budget_id,
        category_id,
        trx_type,
        amount,
        trx_date,
        note,
        payment_method,
        meta
      } = req.body;

      // Business rule 1: amount > 0
      if (amount <= 0) {
        return ResponseHelper.error(res, 'Amount must be greater than 0');
      }

      // Business rule 2: Validate budget exists
      const budget = await Budget.findById(budget_id);
      if (!budget) {
        return ResponseHelper.error(res, 'Budget not found', null, 404);
      }

      // Business rule 3: Validate category exists
      const category = await Category.findById(category_id);
      if (!category) {
        return ResponseHelper.error(res, 'Category not found', null, 404);
      }

      // Business rule 4: Validate trx_type matches category.type
      if (category.type !== 'both') {
        if (trx_type === 'income' && category.type !== 'income') {
          return ResponseHelper.error(
            res,
            `Category "${category.name}" can only be used for ${category.type} transactions`
          );
        }
        if (trx_type === 'expense' && category.type !== 'expense') {
          return ResponseHelper.error(
            res,
            `Category "${category.name}" can only be used for ${category.type} transactions`
          );
        }
      }

      // Business rule 5: Validate JSON meta if provided
      if (meta) {
        try {
          if (typeof meta === 'string') {
            JSON.parse(meta);
          }
        } catch (e) {
          return ResponseHelper.error(res, 'Invalid JSON format for meta field');
        }
      }

      const transactionId = await Transaction.create({
        budget_id,
        category_id,
        trx_type,
        amount,
        trx_date,
        note,
        payment_method,
        meta,
        created_by: req.user.id
      });

      const transaction = await Transaction.findById(transactionId);

      return ResponseHelper.success(
        res,
        'Transaction created successfully',
        { transaction },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update transaction
   * PUT /transactions/:id
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        budget_id,
        category_id,
        trx_type,
        amount,
        trx_date,
        note,
        payment_method,
        meta
      } = req.body;

      // Check if transaction exists
      const existingTransaction = await Transaction.findById(id);
      if (!existingTransaction) {
        return ResponseHelper.notFound(res, 'Transaction not found');
      }

      // Business rule: Member hanya bisa edit transaksi yang dibuat sendiri
      if (req.user.role === 'member' && existingTransaction.created_by !== req.user.id) {
        return ResponseHelper.forbidden(res, 'You can only edit your own transactions');
      }

      // Business rule 1: amount > 0
      if (amount <= 0) {
        return ResponseHelper.error(res, 'Amount must be greater than 0');
      }

      // Business rule 2: Validate budget exists
      const budget = await Budget.findById(budget_id);
      if (!budget) {
        return ResponseHelper.error(res, 'Budget not found', null, 404);
      }

      // Business rule 3: Validate category exists
      const category = await Category.findById(category_id);
      if (!category) {
        return ResponseHelper.error(res, 'Category not found', null, 404);
      }

      // Business rule 4: Validate trx_type matches category.type
      if (category.type !== 'both') {
        if (trx_type === 'income' && category.type !== 'income') {
          return ResponseHelper.error(
            res,
            `Category "${category.name}" can only be used for ${category.type} transactions`
          );
        }
        if (trx_type === 'expense' && category.type !== 'expense') {
          return ResponseHelper.error(
            res,
            `Category "${category.name}" can only be used for ${category.type} transactions`
          );
        }
      }

      // Business rule 5: Validate JSON meta if provided
      if (meta) {
        try {
          if (typeof meta === 'string') {
            JSON.parse(meta);
          }
        } catch (e) {
          return ResponseHelper.error(res, 'Invalid JSON format for meta field');
        }
      }

      await Transaction.update(id, {
        budget_id,
        category_id,
        trx_type,
        amount,
        trx_date,
        note,
        payment_method,
        meta
      });

      const transaction = await Transaction.findById(id);

      return ResponseHelper.success(res, 'Transaction updated successfully', { transaction });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete transaction
   * DELETE /transactions/:id
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      // Check if transaction exists
      const existingTransaction = await Transaction.findById(id);
      if (!existingTransaction) {
        return ResponseHelper.notFound(res, 'Transaction not found');
      }

      // Business rule: Only admin can delete transactions
      // Member should use deletion request feature instead
      if (req.user.role === 'member') {
        return ResponseHelper.forbidden(res, 'Members cannot delete transactions directly. Please submit a deletion request instead.');
      }

      await Transaction.delete(id);

      return ResponseHelper.success(res, 'Transaction deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
