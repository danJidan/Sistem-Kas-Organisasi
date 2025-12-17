# Quick Start Guide - Kas Organisasi

## Langkah Cepat Setup & Running

### 1. Setup Database (3 menit)
```bash
# 1. Buat database
mysql -u root -p -e "CREATE DATABASE kas_organisasi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Import schema
mysql -u root -p kas_organisasi < database_ddl.sql

# 3. Import seed data
mysql -u root -p kas_organisasi < database_seed.sql

# 4. Update password hash (karena seed punya placeholder)
cd backend
npm install
node seed-helper.js
# Copy SQL Update dari output, jalankan ke MySQL
```

### 2. Setup Backend (2 menit)
```bash
cd backend

# Install
npm install

# Config .env (sudah ada, cek DB_PASSWORD)
# Edit .env jika perlu sesuaikan DB_USER dan DB_PASSWORD

# Run
npm run dev

# Server running di http://localhost:5000
```

### 3. Setup Frontend (2 menit)
```bash
cd frontend

# Install
npm install

# Run
npm run dev

# App running di http://localhost:5173
```

### 4. Testing (5 menit)

**Browser:**
1. Buka http://localhost:5173
2. Login: admin@demo.com / Admin123! (setelah update hash)
3. Test Dashboard, Budgets, Categories, Transactions

**Postman:**
1. POST http://localhost:5000/auth/register
   ```json
   {
     "name": "Test User",
     "email": "test@test.com",
     "password": "Test123!",
     "role": "member"
   }
   ```
2. POST http://localhost:5000/auth/login
   ```json
   {
     "email": "test@test.com",
     "password": "Test123!"
   }
   ```
   Save token!
3. GET http://localhost:5000/budgets
   Header: `Authorization: Bearer <token>`

---

## Checklist UAS

- [x] REST API CRUD Express + MySQL
- [x] MVC structure
- [x] JWT Auth
- [x] 3 Middleware (validate, auth, errorHandler)
- [x] 2 tabel relasi (budgets, categories → transactions)
- [x] Min 6 kolom per tabel
- [x] Kolom angka (planned_amount, amount)
- [x] Kolom tanggal (start_date, end_date, trx_date)
- [x] Frontend 5+ halaman (7 halaman)
- [x] Protected routes
- [x] Query agregasi SQL (SUM, COUNT, CASE)
- [x] Validasi FK
- [x] Response konsisten
- [x] Screenshots folder
- [x] README lengkap

**SEMUA KETENTUAN TERPENUHI! ✅**

---

## File Penting

| File | Deskripsi |
|------|-----------|
| `README.md` | Dokumentasi lengkap cara setup & run |
| `API_ENDPOINTS.md` | Daftar 22 endpoints dengan contoh request/response |
| `DATABASE.md` | ERD dan penjelasan database |
| `Laporan_UAS_Outline.md` | Outline laporan UAS (30-50 halaman) |
| `database_ddl.sql` | Schema database |
| `database_seed.sql` | Data awal |
| `backend/seed-helper.js` | Generate password hash |
| `screenshots/` | Folder untuk 19 screenshots testing |

---

## Tips Presentasi UAS

1. **Demo Live (5-10 menit):**
   - Login
   - Create Budget → Create Category → Create Transaction
   - Show Dashboard summary
   - Show query agregasi (inspect Network tab, lihat SQL result)

2. **Explain Code (5 menit):**
   - MVC structure
   - Middleware chain
   - Business rules (validasi trx_type vs category.type)
   - Meta JSON field

3. **Show Screenshots (3 menit):**
   - Postman testing all endpoints
   - Browser testing UI

4. **Q&A Preparation:**
   - "Kenapa pakai JWT?" → Stateless, scalable
   - "Kenapa pakai meta JSON?" → Fleksibilitas data NoSQL-like
   - "Bagaimana handle FK constraint?" → ON DELETE RESTRICT, error message jelas
   - "Bagaimana protect route?" → Frontend: router guard, Backend: auth middleware

---

**Good Luck! 🚀**
