const db = require('../config/database');

class Transaction {
  /**
   * Get all transactions with pagination and filters
   */
  static async getAll(filters = {}, page = 1, limit = 10) {
    let query = `
      SELECT 
        t.*,
        b.name as budget_name,
        c.name as category_name,
        u.name as created_by_name
      FROM transactions t
      LEFT JOIN budgets b ON t.budget_id = b.id
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.budget_id) {
      query += ' AND t.budget_id = ?';
      params.push(filters.budget_id);
    }

    if (filters.category_id) {
      query += ' AND t.category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.trx_type) {
      query += ' AND t.trx_type = ?';
      params.push(filters.trx_type);
    }

    if (filters.payment_method) {
      query += ' AND t.payment_method = ?';
      params.push(filters.payment_method);
    }

    if (filters.date_from) {
      query += ' AND t.trx_date >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ' AND t.trx_date <= ?';
      params.push(filters.date_to);
    }

    query += ' ORDER BY t.trx_date DESC, t.created_at DESC';

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM transactions t WHERE 1=1';
    const countParams = [];
    
    if (filters.budget_id) {
      countQuery += ' AND t.budget_id = ?';
      countParams.push(filters.budget_id);
    }
    if (filters.category_id) {
      countQuery += ' AND t.category_id = ?';
      countParams.push(filters.category_id);
    }
    if (filters.trx_type) {
      countQuery += ' AND t.trx_type = ?';
      countParams.push(filters.trx_type);
    }
    if (filters.date_from) {
      countQuery += ' AND t.trx_date >= ?';
      countParams.push(filters.date_from);
    }
    if (filters.date_to) {
      countQuery += ' AND t.trx_date <= ?';
      countParams.push(filters.date_to);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      transactions: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get transaction by ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        t.*,
        b.name as budget_name,
        c.name as category_name,
        c.type as category_type,
        u.name as created_by_name
      FROM transactions t
      LEFT JOIN budgets b ON t.budget_id = b.id
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  /**
   * Create new transaction
   */
  static async create(transactionData) {
    const {
      budget_id,
      category_id,
      trx_type,
      amount,
      trx_date,
      note,
      payment_method,
      meta,
      created_by
    } = transactionData;

    // Convert meta to JSON string if it's an object
    const metaStr = meta ? (typeof meta === 'string' ? meta : JSON.stringify(meta)) : null;
    
    const [result] = await db.query(
      `INSERT INTO transactions 
       (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [budget_id, category_id, trx_type, amount, trx_date, note || null, payment_method, metaStr, created_by]
    );
    
    return result.insertId;
  }

  /**
   * Update transaction
   */
  static async update(id, transactionData) {
    const {
      budget_id,
      category_id,
      trx_type,
      amount,
      trx_date,
      note,
      payment_method,
      meta
    } = transactionData;

    // Convert meta to JSON string if it's an object
    const metaStr = meta ? (typeof meta === 'string' ? meta : JSON.stringify(meta)) : null;
    
    const [result] = await db.query(
      `UPDATE transactions 
       SET budget_id = ?, category_id = ?, trx_type = ?, amount = ?, trx_date = ?, 
           note = ?, payment_method = ?, meta = ?
       WHERE id = ?`,
      [budget_id, category_id, trx_type, amount, trx_date, note, payment_method, metaStr, id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Delete transaction
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM transactions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Get latest transactions
   */
  static async getLatest(limit = 10) {
    const query = `
      SELECT 
        t.*,
        b.name as budget_name,
        c.name as category_name
      FROM transactions t
      LEFT JOIN budgets b ON t.budget_id = b.id
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.trx_date DESC, t.created_at DESC
      LIMIT ?
    `;
    const [rows] = await db.query(query, [limit]);
    return rows;
  }
}

module.exports = Transaction;
