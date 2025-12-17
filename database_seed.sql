-- ========================================
-- SEED DATA: Kas Organisasi
-- ========================================
USE kas_organisasi;

-- ========================================
-- 1. SEED: users (2 users)
-- Password untuk admin@demo.com: Admin123!
-- Password untuk member@demo.com: Member123!
-- Hash menggunakan bcrypt rounds=10
-- ========================================
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@demo.com', '$2b$10$YourBcryptHashHereForAdmin123', 'admin'),
('Member User', 'member@demo.com', '$2b$10$YourBcryptHashHereForMember123', 'member');

-- Note: Hash di atas placeholder. Backend akan generate hash yang benar saat register/seed.
-- Untuk testing, gunakan endpoint POST /auth/register atau update manual dengan bcrypt.

-- ========================================
-- 2. SEED: budgets (3 budgets)
-- ========================================
INSERT INTO budgets (name, description, planned_amount, start_date, end_date, is_active) VALUES
('Dana Kas Umum 2024', 'Anggaran operasional harian organisasi untuk tahun 2024', 50000000.00, '2024-01-01', '2024-12-31', 1),
('Proker Event Festival', 'Anggaran untuk event festival budaya tahunan', 25000000.00, '2024-06-01', '2024-08-31', 1),
('Divisi Humas & Publikasi', 'Anggaran divisi Humas untuk promosi dan publikasi', 15000000.00, '2024-03-01', '2024-11-30', 1);

-- ========================================
-- 3. SEED: categories (6 categories)
-- ========================================
INSERT INTO categories (name, type, description, is_active) VALUES
('Sumbangan Anggota', 'income', 'Iuran rutin dari anggota organisasi', 1),
('Donasi External', 'income', 'Donasi dari pihak luar/sponsor', 1),
('Konsumsi & ATK', 'expense', 'Pengeluaran untuk konsumsi rapat dan ATK', 1),
('Transport & Logistik', 'expense', 'Biaya transport dan logistik kegiatan', 1),
('Publikasi & Media', 'expense', 'Biaya cetak, desain, iklan', 1),
('Lain-lain', 'both', 'Kategori fleksibel untuk income/expense lainnya', 1);

-- ========================================
-- 4. SEED: transactions (10 transactions, campur income & expense)
-- ========================================
-- Transaksi 1: Income - Sumbangan anggota
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(1, 1, 'income', 5000000.00, '2024-01-15', 'Iuran anggota bulan Januari 2024', 'transfer', 
'{"receipt_url": "https://storage.example.com/receipt001.jpg", "pic_name": "Bendahara Umum", "payment_count": 50}', 1);

-- Transaksi 2: Income - Donasi external untuk event
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(2, 2, 'income', 10000000.00, '2024-06-10', 'Sponsor utama dari PT. Sejahtera Bersama', 'transfer', 
'{"receipt_url": "https://storage.example.com/receipt002.jpg", "sponsor_name": "PT. Sejahtera Bersama", "contact": "sponsor@sejahtera.com"}', 1);

-- Transaksi 3: Expense - Konsumsi rapat koordinasi
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(1, 3, 'expense', 1500000.00, '2024-01-20', 'Konsumsi rapat koordinasi bulanan', 'cash', 
'{"location": "Ruang Rapat Utama", "participant_count": 30, "vendor": "Catering Makmur"}', 2);

-- Transaksi 4: Expense - ATK untuk divisi
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(1, 3, 'expense', 800000.00, '2024-02-05', 'Pembelian ATK kantor (kertas, pulpen, folder)', 'cash', 
'{"store": "Toko Serba Ada", "items": ["kertas A4", "pulpen", "folder", "stapler"]}', 2);

-- Transaksi 5: Income - Iuran anggota Februari
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(1, 1, 'income', 4800000.00, '2024-02-15', 'Iuran anggota bulan Februari 2024', 'transfer', 
'{"receipt_url": "https://storage.example.com/receipt003.jpg", "pic_name": "Bendahara Umum", "payment_count": 48}', 1);

-- Transaksi 6: Expense - Transport event festival
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(2, 4, 'expense', 3500000.00, '2024-07-15', 'Sewa bus dan truk logistik untuk event festival', 'transfer', 
'{"vendor": "CV. Transport Jaya", "vehicle_type": "Bus + Truk", "route": "Jakarta - Bandung"}', 1);

-- Transaksi 7: Expense - Publikasi banner & poster
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(3, 5, 'expense', 2500000.00, '2024-03-20', 'Cetak banner dan poster untuk kampanye', 'transfer', 
'{"vendor": "Percetakan Digital", "quantity": "10 banner + 500 poster", "design_by": "Tim Kreatif Humas"}', 2);

-- Transaksi 8: Expense - Konsumsi event festival
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(2, 3, 'expense', 8000000.00, '2024-07-20', 'Konsumsi peserta dan panitia event festival (2 hari)', 'transfer', 
'{"vendor": "Catering Berkah", "participant_count": 500, "days": 2, "menu": "Nasi box + snack"}', 1);

-- Transaksi 9: Income - Donasi kecil
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(1, 6, 'income', 500000.00, '2024-03-10', 'Donasi dari alumni organisasi', 'ewallet', 
'{"donor_name": "Alumni Angkatan 2020", "platform": "GoPay"}', 2);

-- Transaksi 10: Expense - Lain-lain (maintenance)
INSERT INTO transactions (budget_id, category_id, trx_type, amount, trx_date, note, payment_method, meta, created_by) VALUES
(1, 6, 'expense', 1200000.00, '2024-04-01', 'Maintenance peralatan sound system', 'cash', 
'{"vendor": "Toko Elektronik", "items": "Service speaker + kabel", "warranty": "3 bulan"}', 2);

-- ========================================
-- VERIFY SEED DATA
-- ========================================
SELECT 'Users' AS tabel, COUNT(*) AS jumlah FROM users
UNION ALL
SELECT 'Budgets', COUNT(*) FROM budgets
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions;

-- Quick check transactions summary
SELECT 
    trx_type,
    COUNT(*) AS jumlah_transaksi,
    SUM(amount) AS total_amount
FROM transactions
GROUP BY trx_type;
