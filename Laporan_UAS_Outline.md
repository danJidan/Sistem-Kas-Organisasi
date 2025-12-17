# LAPORAN UJIAN AKHIR SEMESTER
## FULLSTACK WEB MODERN

---

### Informasi Mahasiswa
- **Nama:** [Nama Lengkap Mahasiswa]
- **NIM:** [NIM Mahasiswa]
- **Kelas:** [Kelas]
- **Mata Kuliah:** Fullstack Web Modern
- **Dosen Pengampu:** [Nama Dosen]
- **Semester:** [Semester/Tahun Akademik]

---

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang
Penjelasan tentang:
- Pentingnya manajemen keuangan organisasi
- Kebutuhan sistem informasi untuk pencatatan kas
- Alasan pemilihan tech stack (Node.js, Express.js, MySQL, Vue 3)
- Tujuan pengembangan aplikasi Kas Organisasi

### 1.2 Rumusan Masalah
1. Bagaimana merancang sistem manajemen kas organisasi yang efektif?
2. Bagaimana mengimplementasikan REST API dengan Node.js dan Express.js?
3. Bagaimana membuat frontend interaktif dengan Vue 3?
4. Bagaimana mengintegrasikan authentication JWT dengan protected routes?

### 1.3 Tujuan
1. Membangun aplikasi fullstack manajemen kas organisasi
2. Mengimplementasikan CRUD dengan validasi lengkap
3. Menerapkan authentication dan authorization
4. Membuat dashboard summary dengan query agregasi SQL

### 1.4 Manfaat
- **Bagi Organisasi:** Pencatatan keuangan terstruktur dan real-time
- **Bagi Mahasiswa:** Meningkatkan skill fullstack development
- **Bagi Akademik:** Referensi project UAS untuk batch selanjutnya

---

## BAB II: LANDASAN TEORI

### 2.1 Fullstack Web Development
- Definisi Frontend, Backend, Database
- Arsitektur Client-Server
- REST API dan HTTP Methods

### 2.2 Backend Technologies

#### 2.2.1 Node.js
- Runtime JavaScript di server
- Event-driven, non-blocking I/O
- Package manager: npm

#### 2.2.2 Express.js
- Framework web minimal untuk Node.js
- Routing, middleware, request/response handling
- MVC (Model-View-Controller) pattern

#### 2.2.3 MySQL
- Relational Database Management System
- SQL queries: SELECT, INSERT, UPDATE, DELETE
- Foreign Key constraints dan relational integrity

#### 2.2.4 JWT (JSON Web Token)
- Stateless authentication
- Token structure: Header.Payload.Signature
- Token verification dan expiration

#### 2.2.5 bcrypt
- Password hashing algorithm
- Salt rounds dan computational cost
- One-way encryption

### 2.3 Frontend Technologies

#### 2.3.1 Vue 3
- Progressive JavaScript framework
- Composition API
- Reactive data binding
- Component-based architecture

#### 2.3.2 Vue Router
- Client-side routing
- Navigation guards
- Protected routes

#### 2.3.3 Axios
- HTTP client untuk browser dan Node.js
- Interceptors untuk request/response
- Promise-based API

#### 2.3.4 Vite
- Modern build tool
- Fast Hot Module Replacement (HMR)
- Optimized production build

---

## BAB III: ANALISIS DAN PERANCANGAN SISTEM

### 3.1 Analisis Kebutuhan

#### 3.1.1 Kebutuhan Funktional
1. **Authentication:**
   - User dapat register dan login
   - System generate JWT token
   - Protected routes memerlukan authentication
   
2. **Manajemen Budgets:**
   - CRUD budgets (anggaran/proker)
   - Tracking periode anggaran (start_date - end_date)
   - Monitor planned_amount vs actual spending
   
3. **Manajemen Categories:**
   - CRUD categories
   - Kategorisasi income/expense/both
   - Filter transaksi by category
   
4. **Manajemen Transactions:**
   - CRUD transactions dengan validasi
   - Pagination untuk large dataset
   - Meta field JSON untuk data fleksibel
   - Filter: by budget, category, date range, type
   
5. **Summary & Reporting:**
   - Overall summary (total income, expense, balance)
   - Summary by budget (per anggaran)
   - Summary by category (per kategori)
   - Summary by date range

#### 3.1.2 Kebutuhan Non-Funktional
1. **Performance:** Response time < 1 second
2. **Security:** Password hashing, JWT token, input validation
3. **Usability:** UI intuitif dan user-friendly
4. **Maintainability:** Code structure terorganisir (MVC)
5. **Scalability:** Database design support growth

### 3.2 Perancangan Database

#### 3.2.1 ERD (Entity Relationship Diagram)
[Insert ERD dari DATABASE.md atau gambar]

**Penjelasan Relasi:**
- `users` → `transactions` (1:N, optional)
- `budgets` → `transactions` (1:N, mandatory)
- `categories` → `transactions` (1:N, mandatory)

#### 3.2.2 Database Schema

**Tabel users:**
- Primary Key: id (INT, AUTO_INCREMENT)
- Unique Key: email
- Fields: name, email, password_hash, role, timestamps

**Tabel budgets:**
- Primary Key: id
- Fields: name, description, planned_amount (DECIMAL), start_date (DATE), end_date (DATE), is_active, timestamps
- Constraints: CHECK (planned_amount >= 0), CHECK (start_date <= end_date)

**Tabel categories:**
- Primary Key: id
- Fields: name, type (ENUM: income/expense/both), description, is_active, timestamps

**Tabel transactions:**
- Primary Key: id
- Foreign Keys: budget_id, category_id, created_by
- Fields: trx_type, amount (DECIMAL), trx_date (DATE), note, payment_method, meta (JSON), timestamps
- Constraints: CHECK (amount > 0), FK RESTRICT on delete

#### 3.2.3 Normalisasi
Database berada di **3NF (Third Normal Form):**
- 1NF: Semua kolom atomic (tidak ada multi-value)
- 2NF: Tidak ada partial dependency
- 3NF: Tidak ada transitive dependency

### 3.3 Perancangan API

#### 3.3.1 REST API Design Principles
- Resource-based URLs
- HTTP methods semantic: GET (read), POST (create), PUT (update), DELETE (delete)
- Stateless communication
- JSON format untuk request/response

#### 3.3.2 Endpoint Structure
```
/auth       → Authentication endpoints
/budgets    → Budgets CRUD
/categories → Categories CRUD
/transactions → Transactions CRUD
/summary    → Aggregation queries
```

#### 3.3.3 Response Format
**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "...",
  "details": "..."
}
```

### 3.4 Perancangan Frontend

#### 3.4.1 Sitemap
```
/login → Login Page
/
├── /dashboard → Dashboard Summary
├── /budgets → Budgets List & CRUD
├── /categories → Categories List & CRUD
└── /transactions
    ├── / → Transactions List
    ├── /new → Create Transaction Form
    ├── /:id → Transaction Detail
    └── /:id/edit → Edit Transaction Form
```

#### 3.4.2 UI/UX Design
- **Color Scheme:** Professional (blue, green, red for income/expense)
- **Layout:** Navbar + Main Content
- **Components:** Reusable (Card, Table, Form, Button, Badge)
- **Responsive:** Desktop-first (can be extended to mobile)

#### 3.4.3 State Management
- LocalStorage untuk: token, user data
- Component state untuk: form data, loading, errors
- Props dan Emits untuk: component communication

---

## BAB IV: IMPLEMENTASI SISTEM

### 4.1 Implementasi Backend

#### 4.1.1 Struktur Folder MVC
```
backend/
├── config/     → Database connection
├── controllers/ → Business logic handlers
├── middleware/ → Auth, validation, error handler
├── models/     → Database queries
├── routes/     → API endpoints definition
├── utils/      → Helper functions
└── server.js   → Entry point
```

#### 4.1.2 Database Connection (mysql2/promise)
[Penjelasan kode config/database.js]
- Connection pooling untuk efisiensi
- Promise-based queries
- Error handling

#### 4.1.3 Middleware Implementation

**validate.js:**
- Schema-based validation
- Type checking (string, number, date, JSON)
- Required fields validation
- Range validation (min, max, minLength, maxLength)
- Custom validators

**auth.js:**
- JWT token extraction dari Authorization header
- Token verification dengan jwt.verify()
- User data injection ke req.user
- Error handling untuk invalid/expired token

**errorHandler.js:**
- Global error handler middleware
- Database error handling (FK constraint, duplicate entry)
- JWT error handling
- Custom application error
- Environment-based detail error (dev vs production)

#### 4.1.4 Models Implementation
[Contoh kode Transaction.js]
- Async/await pattern
- Prepared statements (SQL injection prevention)
- JOIN queries untuk relational data
- Aggregation queries (SUM, COUNT, CASE WHEN)

#### 4.1.5 Controllers Implementation
[Contoh kode transactionController.js]
- Request validation
- Business rules enforcement
- Model interaction
- Response formatting dengan ResponseHelper

#### 4.1.6 Routes Implementation
[Contoh kode transactionRoutes.js]
- Router definition
- Middleware chaining (auth → validate → controller)
- HTTP method mapping

### 4.2 Implementasi Frontend

#### 4.2.1 Axios Instance Configuration
[Penjelasan src/api/axios.js]
- Base URL configuration
- Request interceptor: attach token
- Response interceptor: handle 401 (auto logout)

#### 4.2.2 Vue Router Setup
[Penjelasan src/router/index.js]
- Route definition
- Meta: requiresAuth
- Navigation guard: beforeEach
- Redirect logic

#### 4.2.3 Components Implementation

**Navbar.vue:**
- User display
- Navigation links
- Logout functionality

**Dashboard.vue:**
- Summary cards (income, expense, balance, count)
- Latest transactions table
- API call: /summary

**Budgets.vue / Categories.vue:**
- List table
- Modal form (create/edit)
- Delete confirmation
- CRUD operations

**Transactions.vue:**
- Filter form (type, date range)
- Pagination
- Table with actions (view, edit, delete)

**TransactionForm.vue:**
- Dynamic form (create/edit mode)
- Dropdown: budgets, categories
- JSON meta field
- Validation feedback

**TransactionDetail.vue:**
- Detail view with all fields
- JSON formatting
- Edit button

### 4.3 Integrasi Backend-Frontend

#### 4.3.1 Authentication Flow
1. User input email & password di Login.vue
2. POST /auth/login → backend verify credentials
3. Backend return JWT token
4. Frontend save token ke localStorage
5. Axios interceptor attach token ke semua request
6. Backend middleware verify token
7. If token invalid/expired → 401 → auto logout

#### 4.3.2 CRUD Flow (Contoh: Transactions)
1. User klik "Add Transaction"
2. TransactionForm.vue mount → fetch budgets & categories
3. User fill form → submit
4. POST /transactions dengan token
5. Backend validate (middleware + controller)
6. Backend insert to database
7. Return success response
8. Frontend redirect ke /transactions
9. Fetch updated list

### 4.4 Testing

#### 4.4.1 Backend Testing (Postman/Thunder Client)
- Test all endpoints (22 endpoints)
- Test validation errors
- Test authentication (with/without token)
- Test business rules (amount > 0, FK constraint, etc.)

#### 4.4.2 Frontend Testing (Manual)
- Test login flow
- Test protected routes
- Test CRUD operations
- Test form validation
- Test responsive UI

---

## BAB V: HASIL DAN PEMBAHASAN

### 5.1 Hasil Implementasi

#### 5.1.1 Backend API
- ✅ 22 endpoints berhasil diimplementasi
- ✅ MVC structure terorganisir
- ✅ Authentication JWT berfungsi
- ✅ Validation lengkap (middleware + controller)
- ✅ Error handling konsisten
- ✅ Query agregasi SQL (summary endpoints)

#### 5.1.2 Frontend Application
- ✅ 7 halaman (Login + 6 protected pages)
- ✅ Protected routes berfungsi
- ✅ Axios interceptor handle token
- ✅ CRUD operations smooth
- ✅ UI responsive dan user-friendly

#### 5.1.3 Database
- ✅ 4 tabel dengan relasi FK
- ✅ Normalisasi 3NF
- ✅ Constraints (CHECK, FK, UNIQUE)
- ✅ Indexes untuk performance
- ✅ JSON field untuk meta

### 5.2 Pembahasan

#### 5.2.1 Kelebihan Sistem
1. **Security:** Password hashing, JWT, input validation
2. **Scalability:** Database design support growth, pagination
3. **Maintainability:** MVC pattern, code organization
4. **Flexibility:** Meta JSON field untuk data tambahan
5. **User Experience:** Auto logout, error messages, loading states

#### 5.2.2 Kendala yang Dihadapi

**Kendala 1: Foreign Key Constraint**
- **Masalah:** Error saat delete budget yang masih punya transactions
- **Solusi:** Implement ON DELETE RESTRICT, tampilkan error message jelas ke user

**Kendala 2: CORS Error**
- **Masalah:** Frontend tidak bisa hit backend API
- **Solusi:** Configure CORS middleware di backend dengan ALLOWED_ORIGINS

**Kendala 3: Token Expired Handling**
- **Masalah:** User tetap di halaman meski token expired
- **Solusi:** Axios response interceptor detect 401, auto logout & redirect

**Kendala 4: Validation Meta JSON**
- **Masalah:** User input meta bukan JSON valid
- **Solusi:** Try-catch parse JSON, tampilkan error jika invalid

#### 5.2.3 Pemenuhan Ketentuan UAS
[Table checklist dari README.md]
- ✅ Semua 15 ketentuan terpenuhi

### 5.3 Screenshots Testing

#### 5.3.1 Authentication
- Screenshot 1: Login sukses
- Screenshot 2: Login gagal
- Screenshot 3: Protected route without token

#### 5.3.2 Budgets CRUD
- Screenshot 4-7: GET, POST, PUT, DELETE

#### 5.3.3 Categories CRUD
- Screenshot 8-11: GET, POST, PUT, DELETE

#### 5.3.4 Transactions CRUD
- Screenshot 12-16: GET, GET/:id, POST, PUT, DELETE

#### 5.3.5 Summary Endpoints
- Screenshot 17-19: Overall, By Budget, By Category

**Total: 19 screenshots**

---

## BAB VI: PENUTUP

### 6.1 Kesimpulan

1. **Aplikasi Kas Organisasi berhasil diimplementasikan** dengan tech stack Node.js, Express.js, MySQL, dan Vue 3

2. **REST API lengkap** dengan 22 endpoints, authentication JWT, validation berlapis, dan error handling konsisten

3. **Database terstruktur** dengan 4 tabel relasional, normalisasi 3NF, dan query agregasi SQL yang efisien

4. **Frontend interaktif** dengan Vue 3, protected routes, axios interceptor, dan CRUD operations yang smooth

5. **Semua ketentuan UAS terpenuhi** (15/15 checklist)

6. **Business rules diterapkan** dengan validasi ketat (amount > 0, FK constraint, trx_type match category.type)

7. **Meta JSON field** memberikan fleksibilitas penyimpanan data tambahan ala NoSQL

### 6.2 Saran

#### 6.2.1 Saran untuk Pengembangan Sistem
1. **Role-Based Access Control:** Admin dapat CRUD budgets/categories, Member hanya CRUD transactions
2. **File Upload:** Upload receipt images untuk transaksi
3. **Export Data:** Export summary ke PDF/Excel
4. **Dashboard Charts:** Visualisasi data dengan Chart.js
5. **Email Notification:** Notifikasi saat budget hampir habis
6. **Mobile Responsive:** Optimize UI untuk mobile devices
7. **Dark Mode:** Theme switching untuk user preference

#### 6.2.2 Saran untuk Mata Kuliah
1. Tambah materi testing (unit test, integration test)
2. Introduce state management (Pinia/Vuex)
3. Deploy ke hosting (Heroku, Vercel, Railway)
4. CI/CD pipeline dengan GitHub Actions

---

## DAFTAR PUSTAKA

1. Node.js Official Documentation. (2024). Retrieved from https://nodejs.org/docs
2. Express.js Guide. (2024). Retrieved from https://expressjs.com/guide
3. Vue 3 Documentation. (2024). Retrieved from https://vuejs.org/guide
4. MySQL Reference Manual. (2024). Retrieved from https://dev.mysql.com/doc
5. JWT Introduction. (2024). Retrieved from https://jwt.io/introduction
6. Axios Documentation. (2024). Retrieved from https://axios-http.com/docs
7. RESTful API Design Best Practices. (2023). Retrieved from various sources

---

## LAMPIRAN

### Lampiran A: Kode Lengkap Backend
[Dapat menyertakan highlight code penting atau struktur folder tree]

### Lampiran B: Kode Lengkap Frontend
[Dapat menyertakan highlight code penting]

### Lampiran C: Database Schema (DDL)
[Sertakan database_ddl.sql]

### Lampiran D: Seed Data (DML)
[Sertakan database_seed.sql]

### Lampiran E: API Documentation
[Sertakan API_ENDPOINTS.md]

### Lampiran F: Screenshots Testing
[19 screenshots sesuai checklist]

---

**CATATAN PENGGUNAAN:**

File ini adalah **OUTLINE** laporan UAS. Untuk membuat PDF final:

1. Buka Microsoft Word / Google Docs / LaTeX
2. Copy struktur bab dari file ini
3. Isi setiap section dengan penjelasan detail
4. Tambahkan:
   - Cover (Logo kampus, judul, nama, NIM)
   - Kata Pengantar
   - Daftar Isi (auto-generate)
   - Daftar Gambar (ERD, screenshots)
   - Daftar Tabel (checklist ketentuan)
5. Format sesuai template kampus
6. Export to PDF

**Minimal halaman:** 30-50 halaman (tergantung detail pembahasan dan screenshots)
