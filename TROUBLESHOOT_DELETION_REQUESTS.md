# Troubleshooting Deletion Requests

## Langkah 1: Verifikasi Database

1. Buka **phpMyAdmin** di browser (http://localhost/phpmyadmin)
2. Pilih database **finance_tracker**
3. Jalankan query ini di tab SQL:

```sql
-- Cek apakah tabel deletion_requests ada
SHOW TABLES LIKE 'deletion_requests';
```

**Jika tabel TIDAK ADA:**
- Buka file `database_deletion_requests.sql`
- Copy semua isinya
- Paste di tab SQL phpMyAdmin
- Klik "Go"

**Jika tabel SUDAH ADA:**
- Lanjut ke langkah 2

## Langkah 2: Restart Backend Server

1. Buka terminal yang menjalankan backend
2. Tekan `Ctrl + C` untuk stop server
3. Jalankan lagi:
```bash
cd backend
npm run dev
```

4. Pastikan tidak ada error saat server start

## Langkah 3: Test Submit Deletion Request

### Di Browser (sebagai MEMBER):

1. Buka Console (F12 → Console tab)
2. Login sebagai **member** (username: member, password: password)
3. Buka halaman **Transactions**
4. Klik tombol **"Request Delete"** pada salah satu transaksi
5. Isi reason minimal 10 karakter, contoh: "Transaksi salah input"
6. Klik OK

### Yang Harus Dilihat:

**Di Browser Console:**
- Tidak ada error merah
- Kalau ada error, screenshot dan beritahu saya

**Di Terminal Backend:**
- Harus muncul log seperti ini:
```
=== CREATE DELETION REQUEST ===
User: { id: 2, username: 'member', role: 'member' }
Body: { transaction_id: 1, reason: 'Transaksi salah input' }
Transaction found: { id: 1, ... }
Request already exists: false
Created request ID: 1
```

**Di Browser (Alert):**
- Harus muncul: "Deletion request submitted successfully! Admin will review your request."

## Langkah 4: Verifikasi Data Tersimpan

Di phpMyAdmin, jalankan query:

```sql
-- Cek data deletion requests
SELECT 
    dr.*,
    t.amount,
    c.name as category_name,
    u.username as requester
FROM deletion_requests dr
JOIN transactions t ON dr.transaction_id = t.id
JOIN categories c ON t.category_id = c.id
JOIN users u ON dr.requested_by = u.id
ORDER BY dr.created_at DESC;
```

**Harus ada data baru** dengan status = 'pending'

## Langkah 5: Test View Deletion Requests (Admin)

### Di Browser (sebagai ADMIN):

1. Logout dari member
2. Login sebagai **admin** (username: admin, password: password)
3. Klik menu **"Deletion Requests"**

### Yang Harus Dilihat:

**Di Terminal Backend:**
```
=== GET ALL DELETION REQUESTS ===
User: { id: 1, username: 'admin', role: 'admin' }
Filters: {}
Found requests: 1
```

**Di Browser:**
- Harus muncul list deletion requests
- Ada tombol Approve dan Reject

---

## Kemungkinan Error & Solusi

### Error 1: "Table 'finance_tracker.deletion_requests' doesn't exist"
**Solusi:** Execute file `database_deletion_requests.sql` di phpMyAdmin

### Error 2: "Cannot read properties of undefined"
**Solusi:** 
- Cek backend terminal, ada error?
- Cek browser console, ada error?
- Kirim screenshot error ke saya

### Error 3: "Request already exists"
**Solusi:** Transaksi tersebut sudah pernah direquest delete. Coba transaksi lain.

### Error 4: Backend tidak ada log === CREATE DELETION REQUEST ===
**Solusi:** Server belum direstart. Ulang Langkah 2.

### Error 5: Data ada di database tapi tidak muncul di admin
**Solusi:** 
```sql
-- Cek apakah JOIN bermasalah
SELECT * FROM deletion_requests;
```
Jika ada data, berarti ada masalah di JOIN. Beritahu saya hasilnya.

---

## Quick Test Query

Jalankan semua query ini di phpMyAdmin untuk diagnosa lengkap:

```sql
-- 1. Cek tabel ada
SHOW TABLES LIKE 'deletion_requests';

-- 2. Cek struktur tabel
DESCRIBE deletion_requests;

-- 3. Cek data deletion requests (simple)
SELECT * FROM deletion_requests;

-- 4. Cek count
SELECT COUNT(*) as total FROM deletion_requests;

-- 5. Cek JOIN lengkap
SELECT 
    dr.id,
    dr.transaction_id,
    dr.reason,
    dr.status,
    dr.created_at,
    t.amount,
    c.name as category_name,
    u.username as requester
FROM deletion_requests dr
LEFT JOIN transactions t ON dr.transaction_id = t.id
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN users u ON dr.requested_by = u.id;
```

Kalau ada error atau hasil yang aneh, screenshot dan kirim ke saya!
