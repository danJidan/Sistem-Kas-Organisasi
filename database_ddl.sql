-- ========================================
-- DDL: Kas Organisasi Database Schema
-- ========================================

-- Create database
CREATE DATABASE IF NOT EXISTS kas_organisasi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kas_organisasi;

-- ========================================
-- 1. TABLE: users
-- ========================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 2. TABLE: budgets (>= 6 kolom, ada angka + tanggal)
-- ========================================
DROP TABLE IF EXISTS budgets;
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT NULL,
    planned_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Total anggaran yang direncanakan',
    start_date DATE NOT NULL COMMENT 'Tanggal mulai periode',
    end_date DATE NOT NULL COMMENT 'Tanggal akhir periode',
    is_active TINYINT(1) DEFAULT 1 COMMENT '1=aktif, 0=tidak aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active),
    INDEX idx_date_range (start_date, end_date),
    CHECK (planned_amount >= 0),
    CHECK (start_date <= end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 3. TABLE: categories (>= 6 kolom, ada tanggal)
-- ========================================
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    type ENUM('income', 'expense', 'both') NOT NULL COMMENT 'Tipe transaksi yang bisa menggunakan category ini',
    description TEXT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 4. TABLE: transactions (>= 6 kolom, ada angka + tanggal + JSON)
-- ========================================
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget_id INT NOT NULL COMMENT 'FK ke budgets',
    category_id INT NOT NULL COMMENT 'FK ke categories',
    trx_type ENUM('income', 'expense') NOT NULL COMMENT 'Tipe transaksi',
    amount DECIMAL(12,2) NOT NULL COMMENT 'Jumlah transaksi',
    trx_date DATE NOT NULL COMMENT 'Tanggal transaksi',
    note TEXT NULL COMMENT 'Catatan transaksi',
    payment_method ENUM('cash', 'transfer', 'ewallet') DEFAULT 'cash',
    meta JSON NULL COMMENT 'Data fleksibel NoSQL: {receipt_url, pic_name, location}',
    created_by INT NULL COMMENT 'FK ke users',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_transactions_budget 
        FOREIGN KEY (budget_id) REFERENCES budgets(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_user 
        FOREIGN KEY (created_by) REFERENCES users(id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_budget_id (budget_id),
    INDEX idx_category_id (category_id),
    INDEX idx_trx_type (trx_type),
    INDEX idx_trx_date (trx_date),
    INDEX idx_created_by (created_by),
    INDEX idx_composite_budget_date (budget_id, trx_date),
    
    -- Constraints
    CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- VERIFY STRUCTURE
-- ========================================
-- SHOW CREATE TABLE users;
-- SHOW CREATE TABLE budgets;
-- SHOW CREATE TABLE categories;
-- SHOW CREATE TABLE transactions;
