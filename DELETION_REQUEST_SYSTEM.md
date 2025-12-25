# 🗑️ Deletion Request System

## Overview
Sistem permintaan penghapusan transaksi memungkinkan **member** untuk meminta **admin** menghapus transaksi mereka, tanpa bisa langsung menghapus sendiri.

---

## 🎯 Alur Kerja

### Member Side:
1. Member melihat transaksi di halaman Transactions
2. Untuk transaksi milik sendiri, ada tombol **"Request Delete"** (kuning/warning)
3. Klik tombol, muncul prompt untuk input alasan (min 10 karakter)
4. Submit request → tersimpan dengan status **pending**
5. Member mendapat konfirmasi bahwa request sudah dikirim ke admin

### Admin Side:
1. Admin melihat badge notifikasi di menu **"Deletion Requests"** (jika ada pending)
2. Admin membuka halaman **Deletion Requests**
3. Melihat list semua request dengan detail:
   - Informasi requester (nama, email)
   - Detail transaksi (kategori, budget, amount, tanggal)
   - Alasan permintaan
   - Status (pending/approved/rejected)
4. Admin dapat:
   - **Approve**: Hapus transaksi + set status approved
   - **Reject**: Tolak permintaan + set status rejected
   - Tambahkan catatan admin (optional)

---

## 📊 Database Schema

### Table: `deletion_requests`

```sql
CREATE TABLE deletion_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    requested_by INT NOT NULL,
    reason TEXT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by INT NULL,
    reviewed_at DATETIME NULL,
    admin_note TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## 🔌 API Endpoints

### Member & Admin:
- `POST /deletion-requests` - Create deletion request
  - Body: `{ transaction_id, reason }`
  - Member hanya bisa request untuk transaksi sendiri
  
- `GET /deletion-requests` - Get all requests
  - Query: `?status=pending|approved|rejected`
  - Member hanya lihat request sendiri
  - Admin lihat semua request

- `GET /deletion-requests/:id` - Get request detail

### Admin Only:
- `GET /deletion-requests/pending/count` - Get pending count for badge
- `POST /deletion-requests/:id/approve` - Approve & delete transaction
  - Body: `{ admin_note? }`
- `POST /deletion-requests/:id/reject` - Reject request
  - Body: `{ admin_note? }`

---

## 🎨 Frontend Components

### Files Modified/Created:

1. **Transactions.vue**
   - Ganti tombol "Delete" → "Request Delete" untuk member
   - Admin tetap bisa delete langsung

2. **DeletionRequests.vue** (NEW)
   - Halaman untuk admin review requests
   - Filter by status
   - Approve/Reject dengan modal

3. **Navbar.vue**
   - Badge notifikasi pending count
   - Menu "Deletion Requests" untuk admin
   - Auto-refresh count tiap 30 detik

4. **router/index.js**
   - Route `/deletion-requests` (admin only)

---

## 🔒 Permissions

### Member:
- ✅ Request deletion untuk transaksi sendiri
- ✅ Lihat history request sendiri
- ❌ Tidak bisa delete transaksi langsung
- ❌ Tidak bisa approve/reject request

### Admin:
- ✅ Delete transaksi langsung (tanpa request)
- ✅ Lihat semua deletion requests
- ✅ Approve/Reject requests
- ✅ Lihat pending count notification

---

## 🧪 Testing

### Test sebagai Member:
1. Login sebagai member@demo.com
2. Buat transaksi baru
3. Di list transaksi, klik "Request Delete" pada transaksi milik sendiri
4. Input alasan (min 10 karakter)
5. Verify request submitted
6. Coba request delete lagi untuk transaksi yang sama → error "request already exists"

### Test sebagai Admin:
1. Login sebagai admin@demo.com
2. Lihat badge notifikasi di menu "Deletion Requests"
3. Buka halaman Deletion Requests
4. Filter by status "pending"
5. Klik "Approve" pada request → transaksi terhapus
6. Klik "Reject" pada request → transaksi tetap ada
7. Verify status berubah dan admin note tersimpan

---

## ✨ Features

- ✅ Member tidak bisa delete langsung (harus request)
- ✅ Validation: alasan min 10 karakter
- ✅ Prevent duplicate request untuk transaksi yang sama
- ✅ Real-time notification badge untuk admin
- ✅ Auto-refresh pending count tiap 30 detik
- ✅ Admin bisa tambah catatan saat review
- ✅ Filter by status (pending/approved/rejected)
- ✅ Transaction detail dalam request
- ✅ Cascade delete jika transaksi dihapus

---

## 📝 Business Rules

1. Member **tidak bisa** delete transaksi sendiri langsung
2. Member **harus** submit deletion request dengan alasan
3. Alasan minimal **10 karakter**
4. Satu transaksi hanya bisa punya **1 pending request** per user
5. Admin bisa approve = transaksi **dihapus permanent**
6. Admin bisa reject = transaksi **tetap ada**
7. Request yang sudah direview **tidak bisa** direview lagi
8. Admin note **optional** tapi recommended

---

## 🚀 How to Setup

1. **Database:**
   ```bash
   mysql -u root -p kas_organisasi < database_deletion_requests.sql
   ```

2. **Backend:**
   - Model: `DeletionRequest.js`
   - Controller: `deletionRequestController.js`
   - Routes: `deletionRequestRoutes.js`
   - Server.js: register route

3. **Frontend:**
   - View: `DeletionRequests.vue`
   - Update: `Transactions.vue`, `Navbar.vue`, `router/index.js`

4. **Test:**
   - Restart backend: `npm run dev`
   - Refresh frontend
   - Test dengan member & admin account

---

## 💡 Future Enhancements

- [ ] Email notification ke member saat request diapprove/reject
- [ ] Bulk approve/reject
- [ ] Request expiry (auto-reject after X days)
- [ ] Member bisa cancel pending request
- [ ] Export deletion history
- [ ] Analytics: most deleted categories

---

**Created**: December 22, 2025  
**Status**: ✅ Production Ready
