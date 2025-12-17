const db = require('../config/database');

class User {
  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  /**
   * Create new user
   */
  static async create(userData) {
    const { name, email, password_hash, role } = userData;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role || 'member']
    );
    return result.insertId;
  }

  /**
   * Get all users (without password)
   */
  static async getAll() {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  /**
   * Update user
   */
  static async update(id, userData) {
    const { name, email, role } = userData;
    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ?, role = ?, updated_at = NOW() WHERE id = ?',
      [name, email, role, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete user
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
