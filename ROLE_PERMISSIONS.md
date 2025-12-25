# 👥 Pembedaan Fungsi ADMIN dan MEMBER

## Overview
Sistem Kas Organisasi mengimplementasikan role-based access control (RBAC) untuk membedakan hak akses antara **ADMIN** dan **MEMBER**. Dokumen ini menjelaskan perbedaan fungsi dan hak akses antara kedua role tersebut.

---

## 🔐 Role Types

### 1. ADMIN (Administrator)
Role dengan hak akses penuh untuk mengelola seluruh sistem.

### 2. MEMBER (Anggota)
Role dengan hak akses terbatas, hanya dapat mengelola transaksi yang dibuat sendiri.

---

## 📋 Perbedaan Hak Akses

### **BUDGETS (Anggaran)**

| Fungsi | ADMIN | MEMBER |
|--------|-------|--------|
| Akses halaman Budgets | ✅ Ya | ❌ Tidak |
| Lihat daftar budget | ✅ Ya | ❌ Tidak |
| Lihat detail budget | ✅ Ya | ❌ Tidak |
| Buat budget baru | ✅ Ya | ❌ Tidak |
| Edit budget | ✅ Ya | ❌ Tidak |
| Hapus budget | ✅ Ya | ❌ Tidak |

### **CATEGORIES (Kategori)**

| Fungsi | ADMIN | MEMBER |
|--------|-------|--------|
| Akses halaman Categories | ✅ Ya | ❌ Tidak |
| Lihat daftar kategori | ✅ Ya | ❌ Tidak |
| Lihat detail kategori | ✅ Ya | ❌ Tidak |
| Buat kategori baru | ✅ Ya | ❌ Tidak |
| Edit kategori | ✅ Ya | ❌ Tidak |
| Hapus kategori | ✅ Ya | ❌ Tidak |

### **TRANSACTIONS (Transaksi)**

| Fungsi | ADMIN | MEMBER |
|--------|-------|--------|
| Lihat semua transaksi | ✅ Ya | ✅ Ya |
| Lihat detail transaksi | ✅ Ya | ✅ Ya |
| Buat transaksi baru | ✅ Ya | ✅ Ya |
| Edit transaksi sendiri | ✅ Ya | ✅ Ya |
| Edit transaksi user lain | ✅ Ya | ❌ Tidak |
| Hapus transaksi langsung | ✅ Ya | ❌ Tidak |
| Request hapus transaksi | ✅ Ya (opsional) | ✅ Ya (wajib) |

### **DELETION REQUESTS (Permintaan Hapus)**

| Fungsi | ADMIN | MEMBER |
|--------|-------|--------|
| Request deletion transaksi sendiri | ✅ Ya | ✅ Ya |
| Lihat request sendiri | ✅ Ya | ✅ Ya |
| Lihat semua deletion requests | ✅ Ya | ❌ Tidak |
| Approve deletion request | ✅ Ya | ❌ Tidak |
| Reject deletion request | ✅ Ya | ❌ Tidak |
| Lihat pending count notification | ✅ Ya | ❌ Tidak |

### **USER MANAGEMENT (Kelola User)**

| Fungsi | ADMIN | MEMBER |
|--------|-------|--------|
| Akses halaman Users | ✅ Ya | ❌ Tidak |
| Lihat daftar semua user | ✅ Ya | ❌ Tidak |
| Lihat profil sendiri | ✅ Ya | ✅ Ya |
| Ubah role user lain | ✅ Ya | ❌ Tidak |
| Hapus user lain | ✅ Ya | ❌ Tidak |

### **NAVIGATION MENU**

| Menu | ADMIN | MEMBER |
|------|-------|--------|
| Dashboard | ✅ Ya | ✅ Ya |
| Budgets | ✅ Ya | ❌ Tidak |
| Categories | ✅ Ya | ❌ Tidak |
| Transactions | ✅ Ya | ✅ Ya |
| Deletion Requests | ✅ Ya | ❌ Tidak |
| Users | ✅ Ya | ❌ Tidak |

---

## 🛠️ Implementasi Teknis

### Backend (API)

#### 1. Middleware Authorization
File: `backend/middleware/auth.js`

```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, 'User not authenticated');
    }

    const userRole = req.user.role;
    
    if (!roles.includes(userRole)) {
      return ResponseHelper.forbidden(res, `Access denied. Required role: ${roles.join(' or ')}`);
    }

    next();
  };
};
```

#### 2. Protected Routes

**Budget Routes** (`backend/routes/budgetRoutes.js`):
- GET `/budgets` - Admin only 👑
- GET `/budgets/:id` - Admin only 👑
- POST `/budgets` - Admin only 👑
- PUT `/budgets/:id` - Admin only 👑
- DELETE `/budgets/:id` - Admin only 👑

**Category Routes** (`backend/routes/categoryRoutes.js`):
- GET `/categories` - Admin only 👑
- GET `/categories/:id` - Admin only 👑
- POST `/categories` - Admin only 👑
- PUT `/categories/:id` - Admin only 👑
- DELETE `/categories/:id` - Admin only 👑

**Transaction Routes** (`backend/routes/transactionRoutes.js`):
- GET `/transactions` - Semua user ✅
- GET `/transactions/:id` - Semua user ✅
- POST `/transactions` - Semua user ✅
- PUT `/transactions/:id` - Cek kepemilikan di controller 🔒
- DELETE `/transactions/:id` - Cek kepemilikan di controller 🔒

**Auth Routes** (`backend/routes/authRoutes.js`):
- POST `/auth/register` - Public
- POST `/auth/login` - Public
- GET `/auth/me` - Authenticated users ✅
- GET `/auth/users` - Admin only 👑
- PUT `/auth/users/:id/role` - Admin only 👑
- DELETE `/auth/users/:id` - Admin only 👑

#### 3. Transaction Ownership Check

File: `backend/controllers/transactionController.js`

```javascript
// Update transaction
if (req.user.role === 'member' && existingTransaction.created_by !== req.user.id) {
  return ResponseHelper.forbidden(res, 'You can only edit your own transactions');
}

// Delete transaction
if (req.user.role === 'member' && existingTransaction.created_by !== req.user.id) {
  return ResponseHelper.forbidden(res, 'You can only delete your own transactions');
}
```

### Frontend (UI)

#### 1. Navbar Role Badge
File: `frontend/src/components/Navbar.vue`

- Menampilkan badge role (👑 Admin / 👤 Member)
- Menu "Budgets" hanya muncul untuk Admin
- Menu "Categories" hanya muncul untuk Admin
- Menu "Users" hanya muncul untuk Admin
- Menu "Dashboard" dan "Transactions" muncul untuk semua user
- Guard route `/budgets`, `/categories`, `/users` untuk Admin only

#### 2. Conditional Rendering

**Budgets Page** (`frontend/src/views/Budgets.vue`):
- ⚠️ **Admin only page** - Member tidak bisa akses
- Button add/edit/delete hanya untuk Admin

**Categories Page** (`frontend/src/views/Categories.vue`):
- ⚠️ **Admin only page** - Member tidak bisa akses
- Button add/edit/delete hanya untuk Admin

**Transactions Page** (`frontend/src/views/Transactions.vue`):
```vue
<template v-if="canEditDelete(trx)">
  <router-link :to="`/transactions/${trx.id}/edit`">Edit</router-link>
  <button @click="deleteTransaction(trx.id)">Delete</button>
</template>
```

#### 3. Route Guard
File: `frontend/src/router/index.js`

```javascript
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAdmin && user.role !== 'admin') {
    next('/dashboard');
  } else {
    next();
  }
});
```

---

## 🔑 Demo Credentials

### Admin Account
- **Email**: admin@demo.com
- **Password**: Admin123!
- **Capabilities**: Full access to all features

### Member Account
- **Email**: member@demo.com
- **Password**: Member123!
- **Capabilities**: Limited access, can only manage own transactions

---

## 📊 Business Rules

### Admin
1. ✅ Dapat mengelola seluruh master data (Budget, Category)
2. ✅ Dapat melihat dan mengelola semua transaksi dari semua user
3. ✅ Dapat mengelola user (lihat, ubah role, hapus)
4. ✅ Memiliki akses penuh ke semua fitur sistem
5. ✅ Menu lengkap: Dashboard, Budgets, Categories, Transactions, Users

### Member
1. ✅ Hanya dapat akses Dashboard dan Transactions
2. ❌ Tidak dapat melihat atau akses Budgets dan Categories
3. ✅ Dapat membuat transaksi baru
4. ✅ Dapat mengedit transaksi yang dibuat sendiri
5. ❌ **TIDAK dapat menghapus transaksi langsung**
6. ✅ **Dapat request penghapusan transaksi ke admin**
7. ❌ Tidak dapat mengakses halaman User Management
8. ❌ Tidak dapat mengelola master data
9. ✅ Menu terbatas: Dashboard, Transactions saja

---

## 🔒 Security Measures

1. **JWT Token**: Semua request API memerlukan token yang valid
2. **Role Validation**: Server memvalidasi role user pada setiap request
3. **Ownership Check**: Sistem memverifikasi kepemilikan data sebelum update/delete
4. **Frontend Guard**: Router guard mencegah akses unauthorized di frontend
5. **API Authorization**: Middleware `authorize()` memproteksi endpoint sensitif

---

## 📝 Error Messages

### 401 Unauthorized
- "No token provided"
- "Invalid token"
- "Token expired"

### 403 Forbidden
- "Access denied. Required role: admin"
- "You can only edit your own transactions"
- "You can only delete your own transactions"
- "You cannot delete your own account"
- "You cannot change your own role"

---

## 🚀 Testing

### Test Admin Access
1. Login sebagai admin@demo.com
2. Verifikasi dapat mengakses semua menu
3. Test create/edit/delete Budget
4. Test create/edit/delete Category
5. Test edit/delete transaksi user lain
6. Test akses User Management

### Test Member Access
1. Login sebagai member@demo.com
2. Verifikasi hanya muncul menu: Dashboard, Transactions
3. Verifikasi menu "Budgets", "Categories", "Users" tidak muncul
4. Test create transaksi baru
5. Test edit/delete transaksi sendiri
6. Verifikasi tidak bisa edit/delete transaksi user lain
7. Coba akses `/budgets` manual - harus redirect ke dashboard
8. Coba akses `/categories` manual - harus redirect ke dashboard
9. Coba akses `/users` manual - harus redirect ke dashboard

---

## 📖 API Endpoints Summary

### Public Endpoints
- `POST /auth/register` - Register user baru
- `POST /auth/login` - Login

### Authenticated Endpoints (All Users)
- `GET /auth/me` - Get profile
- `GET /transactions` - List transactions
- `GET /transactions/:id` - Get transaction detail
- `POST /transactions` - Create transaction
- `PUT /transactions/:id` - Update transaction (with ownership check)
- `DELETE /transactions/:id` - Delete transaction (with ownership check)

### Admin-Only Endpoints
- `GET /budgets` - List budgets
- `GET /budgets/:id` - Get budget detail
- `POST /budgets` - Create budget
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget
- `GET /categories` - List categories
- `GET /categories/:id` - Get category detail
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /auth/users` - List all users
- `PUT /auth/users/:id/role` - Update user role
- `DELETE /auth/users/:id` - Delete user

---

## 🎯 Best Practices

1. **Always check user role** di backend sebelum operasi sensitif
2. **Never trust frontend** - selalu validasi di server
3. **Log activities** untuk audit trail (future enhancement)
4. **Clear error messages** tapi tidak expose sensitive data
5. **Consistent UX** - hide features yang tidak bisa diakses
6. **Test both roles** setiap kali ada perubahan fitur

---

## 📞 Support

Jika menemukan issue terkait role-based access control:
1. Check browser console untuk error message
2. Verify token masih valid
3. Check role user di localStorage
4. Review API response untuk error details

---

**Last Updated**: December 22, 2025  
**Version**: 1.0.0
