const db = require('../config/database');

class Category {
  /**
   * Get all categories
   */
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM categories WHERE 1=1';
    const params = [];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  /**
   * Get category by ID
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Create new category
   */
  static async create(categoryData) {
    const { name, type, description, is_active } = categoryData;
    
    const [result] = await db.query(
      `INSERT INTO categories (name, type, description, is_active) 
       VALUES (?, ?, ?, ?)`,
      [name, type, description || null, is_active !== undefined ? is_active : 1]
    );
    
    return result.insertId;
  }

  /**
   * Update category
   */
  static async update(id, categoryData) {
    const { name, type, description, is_active } = categoryData;
    
    const [result] = await db.query(
      `UPDATE categories 
       SET name = ?, type = ?, description = ?, is_active = ?
       WHERE id = ?`,
      [name, type, description, is_active, id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Delete category
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Get category with transaction summary
   */
  static async getWithSummary(id) {
    const query = `
      SELECT 
        c.*,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(CASE WHEN t.trx_type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN t.trx_type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expense
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `;
    
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Category;
