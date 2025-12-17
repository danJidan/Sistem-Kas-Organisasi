const db = require('../config/database');

class Budget {
  /**
   * Get all budgets
   */
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM budgets WHERE 1=1';
    const params = [];

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  /**
   * Get budget by ID
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM budgets WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Create new budget
   */
  static async create(budgetData) {
    const { name, description, planned_amount, start_date, end_date, is_active } = budgetData;
    
    const [result] = await db.query(
      `INSERT INTO budgets (name, description, planned_amount, start_date, end_date, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || null, planned_amount, start_date, end_date, is_active !== undefined ? is_active : 1]
    );
    
    return result.insertId;
  }

  /**
   * Update budget
   */
  static async update(id, budgetData) {
    const { name, description, planned_amount, start_date, end_date, is_active } = budgetData;
    
    const [result] = await db.query(
      `UPDATE budgets 
       SET name = ?, description = ?, planned_amount = ?, start_date = ?, end_date = ?, is_active = ?
       WHERE id = ?`,
      [name, description, planned_amount, start_date, end_date, is_active, id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Delete budget
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM budgets WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Get budget with transaction summary
   */
  static async getWithSummary(id) {
    const query = `
      SELECT 
        b.*,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(CASE WHEN t.trx_type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN t.trx_type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expense,
        (COALESCE(SUM(CASE WHEN t.trx_type = 'income' THEN t.amount ELSE 0 END), 0) - 
         COALESCE(SUM(CASE WHEN t.trx_type = 'expense' THEN t.amount ELSE 0 END), 0)) as balance
      FROM budgets b
      LEFT JOIN transactions t ON b.id = t.budget_id
      WHERE b.id = ?
      GROUP BY b.id
    `;
    
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Budget;
