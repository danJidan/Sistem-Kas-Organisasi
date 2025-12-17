const Budget = require('../models/Budget');
const ResponseHelper = require('../utils/responseHelper');

class BudgetController {
  /**
   * Get all budgets
   * GET /budgets
   */
  static async getAll(req, res, next) {
    try {
      const { is_active } = req.query;
      const filters = {};
      
      if (is_active !== undefined) {
        filters.is_active = parseInt(is_active);
      }

      const budgets = await Budget.getAll(filters);
      
      return ResponseHelper.success(res, 'Budgets retrieved successfully', { budgets });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get budget by ID
   * GET /budgets/:id
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const budget = await Budget.getWithSummary(id);
      
      if (!budget) {
        return ResponseHelper.notFound(res, 'Budget not found');
      }

      return ResponseHelper.success(res, 'Budget retrieved successfully', { budget });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new budget
   * POST /budgets
   */
  static async create(req, res, next) {
    try {
      const { name, description, planned_amount, start_date, end_date, is_active } = req.body;

      // Business rule: planned_amount >= 0
      if (planned_amount < 0) {
        return ResponseHelper.error(res, 'Planned amount must be >= 0');
      }

      // Business rule: start_date <= end_date
      if (new Date(start_date) > new Date(end_date)) {
        return ResponseHelper.error(res, 'Start date must be before or equal to end date');
      }

      const budgetId = await Budget.create({
        name,
        description,
        planned_amount,
        start_date,
        end_date,
        is_active
      });

      const budget = await Budget.findById(budgetId);

      return ResponseHelper.success(
        res,
        'Budget created successfully',
        { budget },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update budget
   * PUT /budgets/:id
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, planned_amount, start_date, end_date, is_active } = req.body;

      // Check if budget exists
      const existingBudget = await Budget.findById(id);
      if (!existingBudget) {
        return ResponseHelper.notFound(res, 'Budget not found');
      }

      // Business rule: planned_amount >= 0
      if (planned_amount < 0) {
        return ResponseHelper.error(res, 'Planned amount must be >= 0');
      }

      // Business rule: start_date <= end_date
      if (new Date(start_date) > new Date(end_date)) {
        return ResponseHelper.error(res, 'Start date must be before or equal to end date');
      }

      const updated = await Budget.update(id, {
        name,
        description,
        planned_amount,
        start_date,
        end_date,
        is_active
      });

      const budget = await Budget.findById(id);

      return ResponseHelper.success(res, 'Budget updated successfully', { budget });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete budget
   * DELETE /budgets/:id
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      // Check if budget exists
      const existingBudget = await Budget.findById(id);
      if (!existingBudget) {
        return ResponseHelper.notFound(res, 'Budget not found');
      }

      // Try to delete (will fail if there are related transactions due to FK constraint)
      await Budget.delete(id);

      return ResponseHelper.success(res, 'Budget deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BudgetController;
