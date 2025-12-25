-- ========================================
-- TABLE: deletion_requests
-- Tabel untuk menyimpan permintaan penghapusan transaksi dari member
-- ========================================

DROP TABLE IF EXISTS deletion_requests;

CREATE TABLE deletion_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL COMMENT 'FK ke transactions',
    requested_by INT NOT NULL COMMENT 'FK ke users (member yang request)',
    reason TEXT NULL COMMENT 'Alasan permintaan penghapusan',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by INT NULL COMMENT 'FK ke users (admin yang review)',
    reviewed_at DATETIME NULL COMMENT 'Tanggal review',
    admin_note TEXT NULL COMMENT 'Catatan dari admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_deletion_requests_transaction 
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_deletion_requests_requester 
        FOREIGN KEY (requested_by) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_deletion_requests_reviewer 
        FOREIGN KEY (reviewed_by) REFERENCES users(id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_status (status),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_requested_by (requested_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
