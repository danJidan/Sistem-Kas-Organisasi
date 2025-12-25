const db = require('../config/database');

class DeletionRequest {
  /**
   * Create deletion request
   */
  static async create(requestData) {
    const { transaction_id, requested_by, reason } = requestData;
    const [result] = await db.query(
      'INSERT INTO deletion_requests (transaction_id, requested_by, reason) VALUES (?, ?, ?)',
      [transaction_id, requested_by, reason]
    );
    return result.insertId;
  }

  /**
   * Get all deletion requests with filters
   */
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        dr.*,
        t.trx_type, t.amount, t.trx_date, t.note as transaction_note,
        b.name as budget_name,
        c.name as category_name,
        u_req.name as requester_name, u_req.email as requester_email,
        u_rev.name as reviewer_name
      FROM deletion_requests dr
      JOIN transactions t ON dr.transaction_id = t.id
      LEFT JOIN budgets b ON t.budget_id = b.id
      LEFT JOIN categories c ON t.category_id = c.id
      JOIN users u_req ON dr.requested_by = u_req.id
      LEFT JOIN users u_rev ON dr.reviewed_by = u_rev.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.status) {
      query += ' AND dr.status = ?';
      params.push(filters.status);
    }
    
    if (filters.requested_by) {
      query += ' AND dr.requested_by = ?';
      params.push(filters.requested_by);
    }
    
    query += ' ORDER BY dr.created_at DESC';
    
    const [rows] = await db.query(query, params);
    return rows;
  }

  /**
   * Get deletion request by ID
   */
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT 
        dr.*,
        t.trx_type, t.amount, t.trx_date, t.note as transaction_note,
        b.name as budget_name,
        c.name as category_name,
        u_req.name as requester_name, u_req.email as requester_email,
        u_rev.name as reviewer_name
      FROM deletion_requests dr
      JOIN transactions t ON dr.transaction_id = t.id
      LEFT JOIN budgets b ON t.budget_id = b.id
      LEFT JOIN categories c ON t.category_id = c.id
      JOIN users u_req ON dr.requested_by = u_req.id
      LEFT JOIN users u_rev ON dr.reviewed_by = u_rev.id
      WHERE dr.id = ?`,
      [id]
    );
    return rows[0];
  }

  /**
   * Check if request already exists for transaction
   */
  static async existsForTransaction(transactionId, userId) {
    const [rows] = await db.query(
      'SELECT id FROM deletion_requests WHERE transaction_id = ? AND requested_by = ? AND status = ?',
      [transactionId, userId, 'pending']
    );
    return rows.length > 0;
  }

  /**
   * Approve deletion request
   */
  static async approve(id, reviewedBy, adminNote = null) {
    const [result] = await db.query(
      'UPDATE deletion_requests SET status = ?, reviewed_by = ?, reviewed_at = NOW(), admin_note = ? WHERE id = ?',
      ['approved', reviewedBy, adminNote, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Reject deletion request
   */
  static async reject(id, reviewedBy, adminNote = null) {
    const [result] = await db.query(
      'UPDATE deletion_requests SET status = ?, reviewed_by = ?, reviewed_at = NOW(), admin_note = ? WHERE id = ?',
      ['rejected', reviewedBy, adminNote, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Get pending count for admin notification
   */
  static async getPendingCount() {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM deletion_requests WHERE status = ?',
      ['pending']
    );
    return rows[0].count;
  }
}

module.exports = DeletionRequest;
