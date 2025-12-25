-- TEST: Cek apakah tabel deletion_requests sudah ada
SHOW TABLES LIKE 'deletion_requests';

-- Jika tabel ada, cek strukturnya
DESCRIBE deletion_requests;

-- Cek data yang ada
SELECT * FROM deletion_requests;

-- Count total data
SELECT COUNT(*) as total FROM deletion_requests;
