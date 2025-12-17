const db = require('../config/database');
const Transaction = require('../models/Transaction');
const ResponseHelper = require('../utils/responseHelper');

class SummaryController {
  /**
   * Get overall summary
   * GET /summary
   */
  static async getOverallSummary(req, res, next) {
    try {
      // Query untuk total income, expense, dan balance
      const summaryQuery = `
        SELECT 
          COALESCE(SUM(CASE WHEN trx_type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
          COALESCE(SUM(CASE WHEN trx_type = 'expense' THEN amount ELSE 0 END), 0) as totalExpense,
          (COALESCE(SUM(CASE WHEN trx_type = 'income' THEN amount ELSE 0 END), 0) - 
           COALESCE(SUM(CASE WHEN trx_type = 'expense' THEN amount ELSE 0 END), 0)) as balance,
          COUNT(*) as transactionCount
        FROM transactions
      `;

      const [summaryResult] = await db.query(summaryQuery);
      const summary = summaryResult[0];

      // Get latest transactions
      const latestTransactions = await Transaction.getLatest(10);

      const data = {
        totalIncome: parseFloat(summary.totalIncome),
        totalExpense: parseFloat(summary.totalExpense),
        balance: parseFloat(summary.balance),
        transactionCount: summary.transactionCount,
        lastTransactions: latestTransactions
      };

      return ResponseHelper.success(res, 'Summary retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get summary by budget
   * GET /summary/by-budget
   */
  static async getSummaryByBudget(req, res, next) {
    try {
      const query = `
        SELECT 
          b.id as budget_id,
          b.name as budget_name,
          b.planned_amount,
          b.start_date,
          b.end_date,
          COALESCE(SUM(CASE WHEN t.trx_type = 'income' THEN t.amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN t.trx_type = 'expense' THEN t.amount ELSE 0 END), 0) as expense,
          (COALESCE(SUM(CASE WHEN t.trx_type = 'income' THEN t.amount ELSE 0 END), 0) - 
           COALESCE(SUM(CASE WHEN t.trx_type = 'expense' THEN t.amount ELSE 0 END), 0)) as balance,
          COUNT(t.id) as transaction_count
        FROM budgets b
        LEFT JOIN transactions t ON b.id = t.budget_id
        GROUP BY b.id, b.name, b.planned_amount, b.start_date, b.end_date
        ORDER BY b.created_at DESC
      `;

      const [rows] = await db.query(query);

      // Convert to proper number format
      const budgetSummary = rows.map(row => ({
        budget_id: row.budget_id,
        budget_name: row.budget_name,
        planned_amount: parseFloat(row.planned_amount),
        start_date: row.start_date,
        end_date: row.end_date,
        income: parseFloat(row.income),
        expense: parseFloat(row.expense),
        balance: parseFloat(row.balance),
        transaction_count: row.transaction_count,
        utilization_percentage: row.planned_amount > 0 
          ? ((parseFloat(row.expense) / parseFloat(row.planned_amount)) * 100).toFixed(2)
          : 0
      }));

      return ResponseHelper.success(res, 'Budget summary retrieved successfully', {
        budgets: budgetSummary
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get summary by category
   * GET /summary/by-category
   */
  static async getSummaryByCategory(req, res, next) {
    try {
      const query = `
        SELECT 
          c.id as category_id,
          c.name as category_name,
          c.type as category_type,
          COALESCE(SUM(CASE WHEN t.trx_type = 'income' THEN t.amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN t.trx_type = 'expense' THEN t.amount ELSE 0 END), 0) as expense,
          (COALESCE(SUM(CASE WHEN t.trx_type = 'income' THEN t.amount ELSE 0 END), 0) - 
           COALESCE(SUM(CASE WHEN t.trx_type = 'expense' THEN t.amount ELSE 0 END), 0)) as balance,
          COUNT(t.id) as transaction_count
        FROM categories c
        LEFT JOIN transactions t ON c.id = t.category_id
        GROUP BY c.id, c.name, c.type
        ORDER BY c.created_at DESC
      `;

      const [rows] = await db.query(query);

      // Convert to proper number format
      const categorySummary = rows.map(row => ({
        category_id: row.category_id,
        category_name: row.category_name,
        category_type: row.category_type,
        income: parseFloat(row.income),
        expense: parseFloat(row.expense),
        balance: parseFloat(row.balance),
        transaction_count: row.transaction_count
      }));

      return ResponseHelper.success(res, 'Category summary retrieved successfully', {
        categories: categorySummary
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get summary by date range
   * GET /summary/by-date
   */
  static async getSummaryByDate(req, res, next) {
    try {
      const { date_from, date_to } = req.query;

      if (!date_from || !date_to) {
        return ResponseHelper.error(res, 'date_from and date_to are required');
      }

      const query = `
        SELECT 
          DATE(trx_date) as date,
          COALESCE(SUM(CASE WHEN trx_type = 'income' THEN amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN trx_type = 'expense' THEN amount ELSE 0 END), 0) as expense,
          COUNT(*) as transaction_count
        FROM transactions
        WHERE trx_date BETWEEN ? AND ?
        GROUP BY DATE(trx_date)
        ORDER BY trx_date DESC
      `;

      const [rows] = await db.query(query, [date_from, date_to]);

      const dateSummary = rows.map(row => ({
        date: row.date,
        income: parseFloat(row.income),
        expense: parseFloat(row.expense),
        balance: parseFloat(row.income) - parseFloat(row.expense),
        transaction_count: row.transaction_count
      }));

      return ResponseHelper.success(res, 'Date summary retrieved successfully', {
        date_from,
        date_to,
        summary: dateSummary
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SummaryController;
