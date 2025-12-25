# SISTEM INFORMASI KAS ORGANISASI
**Aplikasi Manajemen Keuangan Organisasi dengan Role-Based Access Control**

---

## 📋 BAB I – DESKRIPSI PROJECT

### 1.1 Latar Belakang

Pengelolaan keuangan organisasi memerlukan sistem yang transparan, terstruktur, dan mudah digunakan. Banyak organisasi masih menggunakan pencatatan manual atau spreadsheet yang rawan kesalahan dan sulit untuk dilacak histori perubahannya. 

Aplikasi **Sistem Informasi Kas Organisasi** dikembangkan untuk mengatasi masalah tersebut dengan menyediakan platform berbasis web yang memungkinkan:
- **Pencatatan transaksi** keuangan secara real-time
- **Pengelolaan budget** dengan periode waktu tertentu
- **Kategorisasi** pengeluaran dan pemasukan
- **Pemisahan akses** antara Admin dan Member untuk keamanan data
- **Dashboard analitik** untuk monitoring keuangan
- **Sistem approval** untuk penghapusan transaksi

### 1.2 Tujuan Project

1. **Meningkatkan Transparansi:** Semua anggota dapat melihat transaksi keuangan organisasi
2. **Mempermudah Monitoring:** Dashboard dengan visualisasi data keuangan real-time
3. **Keamanan Data:** Role-based access control (RBAC) membedakan hak akses Admin dan Member
4. **Audit Trail:** Histori lengkap setiap transaksi dengan approval workflow untuk penghapusan
5. **Efisiensi Kerja:** Otomasi perhitungan saldo, budget tracking, dan summary laporan

### 1.3 Teknologi yang Digunakan

#### Backend
- **Node.js** v18+ - Runtime JavaScript
- **Express.js** v4.18 - Web framework untuk REST API
- **MySQL2** v3.6 - Database driver dengan support Promise
- **JWT (jsonwebtoken)** v9.0 - Authentication & authorization
- **Bcrypt** v5.1 - Password hashing
- **Dotenv** v16.3 - Environment variable management
- **CORS** v2.8 - Cross-origin resource sharing
- **Nodemon** v3.0 - Development auto-reload

#### Frontend
- **Vue 3** v3.3 - Progressive JavaScript framework dengan Composition API
- **Vue Router** v4.2 - Client-side routing
- **Axios** v1.6 - HTTP client untuk konsumsi API
- **Vite** v5.0 - Build tool & development server
- **CSS3** - Styling dengan custom design

#### Database
- **MySQL** v8.0 - Relational database management system
- **XAMPP** - Local development environment (Apache + MySQL + PHP)

#### Development Tools
- **Git & GitHub** - Version control
- **Postman/Thunder Client** - API testing
- **phpMyAdmin** - Database management GUI
- **VS Code** - Code editor

---

## 📐 BAB II – PERANCANGAN SISTEM

### 2.1 Deskripsi Singkat Sistem

Sistem Informasi Kas Organisasi adalah aplikasi web fullstack yang terdiri dari:

1. **Backend REST API** - Server yang menangani:
   - Autentikasi & otorisasi pengguna
   - CRUD operations untuk semua entitas
   - Business logic dan validasi data
   - Middleware untuk security dan error handling

2. **Frontend SPA (Single Page Application)** - Interface pengguna yang menampilkan:
   - Dashboard dengan statistik keuangan
   - Manajemen transaksi, kategori, dan budget
   - User management (admin only)
   - Approval system untuk deletion requests

3. **Database MySQL** - Penyimpanan data dengan relasi:
   - Users (admin/member)
   - Budgets (periode anggaran)
   - Categories (jenis transaksi)
   - Transactions (pemasukan/pengeluaran)
   - Deletion Requests (approval workflow)

#### Alur Kerja Sistem:

**Admin:**
- Kelola semua data (CRUD penuh)
- Review & approve/reject deletion requests dari member
- Manajemen user (tambah, edit, hapus, ubah role)
- Akses semua menu: Dashboard, Transactions, Categories, Budgets, Deletion Requests, Users

**Member:**
- Lihat Dashboard & Transactions
- Tambah & edit transaksi milik sendiri
- Request delete transaksi (tidak bisa hapus langsung)
- Tidak bisa akses Categories, Budgets, User Management

### 2.2 Desain Database

#### Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ PK id           │
│    name         │
│    email        │◄────────┐
│    password_hash│         │
│    role         │         │
│    created_at   │         │
│    updated_at   │         │
└─────────────────┘         │
         │                  │
         │ 1                │
         │                  │
         │ N                │ FK requested_by
         ▼                  │
┌─────────────────┐         │
│   TRANSACTIONS  │         │
├─────────────────┤         │
│ PK id           │         │
│ FK budget_id    │         │
│ FK category_id  │         │
│ FK created_by   │─────────┘
│    description  │
│    amount       │
│    type         │
│    date         │
│    created_at   │
│    updated_at   │
└─────────────────┘
         │ N
         │
         │ 1                    1
         ▼                      │
┌─────────────────┐    ┌────────▼──────┐
│   CATEGORIES    │    │    BUDGETS    │
├─────────────────┤    ├───────────────┤
│ PK id           │    │ PK id         │
│    name         │    │    name       │
│    type         │    │    description│
│    description  │    │planned_amount │
│    color        │    │   start_date  │
│    icon         │    │    end_date   │
│    created_at   │    │   is_active   │
│    updated_at   │    │   created_at  │
└─────────────────┘    │   updated_at  │
                       └───────────────┘

┌─────────────────────────┐
│   DELETION_REQUESTS     │
├─────────────────────────┤
│ PK id                   │
│ FK transaction_id       │───┐
│ FK requested_by (users) │   │
│    reason               │   │
│    status               │   │ References
│ FK reviewed_by (users)  │   │ transactions.id
│    reviewed_at          │   │
│    admin_note           │   │
│    created_at           │◄──┘
│    updated_at           │
└─────────────────────────┘
```

#### Penjelasan Tabel

**1. users**
- Primary Key: `id`
- Menyimpan data pengguna (admin dan member)
- Password di-hash menggunakan bcrypt
- Role: ENUM('admin', 'member')
- Relasi: 1 user dapat membuat banyak transactions

**2. budgets**
- Primary Key: `id`
- Menyimpan periode anggaran organisasi
- Kolom: name, description, planned_amount, start_date, end_date, is_active
- Constraint: planned_amount >= 0, start_date <= end_date
- Relasi: 1 budget dapat memiliki banyak transactions

**3. categories**
- Primary Key: `id`
- Kategori transaksi (income/expense)
- Type: ENUM('income', 'expense')
- Kolom tambahan: color, icon untuk visualisasi
- Relasi: 1 category dapat memiliki banyak transactions

**4. transactions**
- Primary Key: `id`
- Foreign Keys: budget_id, category_id, created_by
- Menyimpan transaksi keuangan
- Type: ENUM('income', 'expense')
- Amount: DECIMAL(12,2) untuk precision
- Relasi: Many-to-one ke budgets, categories, users

**5. deletion_requests**
- Primary Key: `id`
- Foreign Keys: transaction_id, requested_by, reviewed_by
- Approval workflow untuk penghapusan transaksi
- Status: ENUM('pending', 'approved', 'rejected')
- Member submit request → Admin review → Approve/Reject

---

## 💻 BAB III – IMPLEMENTASI

### 3.1 Implementasi Backend

#### Struktur Folder
```
backend/
├── server.js              # Entry point aplikasi
├── package.json           # Dependencies
├── .env                   # Environment variables
│
├── config/
│   └── database.js        # Koneksi MySQL
│
├── models/
│   ├── User.js            # Model users
│   ├── Budget.js          # Model budgets
│   ├── Category.js        # Model categories
│   ├── Transaction.js     # Model transactions
│   └── DeletionRequest.js # Model deletion_requests
│
├── controllers/
│   ├── authController.js         # Login, register, user management
│   ├── budgetController.js       # CRUD budgets
│   ├── categoryController.js     # CRUD categories
│   ├── transactionController.js  # CRUD transactions
│   ├── summaryController.js      # Dashboard statistics
│   └── deletionRequestController.js # Approval workflow
│
├── middleware/
│   ├── auth.js            # JWT verification & authorization
│   ├── errorHandler.js    # Global error handling
│   └── validate.js        # Input validation
│
├── routes/
│   ├── authRoutes.js
│   ├── budgetRoutes.js
│   ├── categoryRoutes.js
│   ├── transactionRoutes.js
│   ├── summaryRoutes.js
│   └── deletionRequestRoutes.js
│
└── utils/
    └── responseHelper.js  # Standardized API response
```

#### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login & generate JWT token
- `GET /api/auth/users` - Get all users (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)
- `PUT /api/auth/users/:id/role` - Update user role (admin only)

**Budgets (Admin Only):**
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

**Categories (Admin Only):**
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Transactions:**
- `GET /api/transactions` - Get all (admin) atau milik sendiri (member)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update own transaction
- `DELETE /api/transactions/:id` - Delete transaction (admin only)

**Deletion Requests:**
- `GET /api/deletion-requests` - Get all (admin) atau milik sendiri (member)
- `POST /api/deletion-requests` - Submit deletion request (member)
- `GET /api/deletion-requests/pending/count` - Count pending (admin)
- `PUT /api/deletion-requests/:id/approve` - Approve request (admin)
- `PUT /api/deletion-requests/:id/reject` - Reject request (admin)

**Summary/Dashboard:**
- `GET /api/summary/stats` - Total income, expense, balance
- `GET /api/summary/transactions/recent` - Latest transactions
- `GET /api/summary/categories/breakdown` - Category distribution

#### Middleware Implementation

**1. Authentication & Authorization (auth.js)**
```javascript
const jwt = require('jsonwebtoken');

// Verifikasi JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  };
};

module.exports = { auth, authorize };
```

**2. Error Handler (errorHandler.js)**
```javascript
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

**3. Validation (validate.js)**
```javascript
const validateTransaction = (req, res, next) => {
  const { amount, description, type } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than 0' });
  }
  if (!description || description.trim().length === 0) {
    return res.status(400).json({ message: 'Description is required' });
  }
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Type must be income or expense' });
  }
  
  next();
};

module.exports = { validateTransaction };
```

#### Database Connection
```javascript
// config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kas_organisasi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### 3.2 Implementasi Frontend

#### Struktur Folder
```
frontend/
├── index.html
├── package.json
├── vite.config.js
│
└── src/
    ├── main.js           # Entry point
    ├── App.vue           # Root component
    │
    ├── api/
    │   └── axios.js      # Axios instance + interceptors
    │
    ├── router/
    │   └── index.js      # Vue Router config + guards
    │
    ├── components/
    │   └── Navbar.vue    # Navigation component
    │
    └── views/
        ├── Login.vue             # Login page
        ├── Dashboard.vue         # Dashboard & statistics
        ├── Transactions.vue      # Transaction list
        ├── TransactionForm.vue   # Add/Edit transaction
        ├── TransactionDetail.vue # Transaction detail
        ├── Categories.vue        # Category management (admin)
        ├── Budgets.vue           # Budget management (admin)
        ├── DeletionRequests.vue  # Approval page (admin)
        └── Users.vue             # User management (admin)
```

#### Routing dengan Guards

**router/index.js**
```javascript
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: () => import('../views/Login.vue') },
  {
    path: '/dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    component: () => import('../views/Categories.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // ... other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }
  
  if (to.meta.requiresAdmin && user.role !== 'admin') {
    alert('Access denied. Admin only.');
    return next('/dashboard');
  }
  
  next();
});

export default router;
```

#### Konsumsi API dengan Axios

**api/axios.js**
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - inject JWT token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Halaman Utama

**1. Dashboard.vue**
- Menampilkan summary: Total Income, Total Expense, Balance
- Recent Transactions (5 terakhir)
- Category Breakdown
- API: `GET /api/summary/stats`, `GET /api/summary/transactions/recent`

**2. Transactions.vue**
- List semua transaksi dengan pagination
- Filter by type (income/expense), date range
- Admin: Delete button langsung
- Member: Request Delete button → submit ke /deletion-requests
- API: `GET /api/transactions`, `POST /api/deletion-requests`

**3. Categories.vue (Admin Only)**
- CRUD categories dengan form modal
- Color picker & icon selector
- API: `GET/POST/PUT/DELETE /api/categories`

**4. Budgets.vue (Admin Only)**
- CRUD budgets dengan date range picker
- Progress bar: actual spending vs planned amount
- API: `GET/POST/PUT/DELETE /api/budgets`

**5. DeletionRequests.vue (Admin Only)**
- List pending deletion requests
- Detail modal: transaction info, member reason
- Approve → delete transaction
- Reject → just update status
- API: `GET /api/deletion-requests`, `PUT /api/deletion-requests/:id/approve`

**6. Users.vue (Admin Only)**
- List all users
- Edit role (admin ↔ member)
- Delete user
- API: `GET /api/auth/users`, `PUT /api/auth/users/:id/role`, `DELETE /api/auth/users/:id`

---

## 🧪 BAB IV – PENGUJIAN

### 4.1 Pengujian API (Postman/Thunder Client)

#### Test Case 1: Authentication

**1.1 Register User**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

Expected Response (201):
{
  "success": true,
  "message": "User registered successfully"
}
```

**1.2 Login**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}

Expected Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Test Case 2: Transactions

**2.1 Create Transaction**
```http
POST http://localhost:3000/api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "budget_id": 1,
  "category_id": 1,
  "description": "Pembayaran sewa kantor",
  "amount": 5000000,
  "type": "expense",
  "date": "2025-12-22"
}

Expected Response (201):
{
  "success": true,
  "message": "Transaction created successfully",
  "data": { "id": 1, ... }
}
```

**2.2 Get All Transactions**
```http
GET http://localhost:3000/api/transactions?page=1&limit=10&type=expense
Authorization: Bearer <token>

Expected Response (200):
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### Test Case 3: Authorization

**3.1 Member Access Budget (Should Fail)**
```http
GET http://localhost:3000/api/budgets
Authorization: Bearer <member-token>

Expected Response (403):
{
  "success": false,
  "message": "Access denied. Admin only."
}
```

**3.2 Admin Access Budget (Should Success)**
```http
GET http://localhost:3000/api/budgets
Authorization: Bearer <admin-token>

Expected Response (200):
{
  "success": true,
  "data": [...]
}
```

#### Test Case 4: Deletion Request Workflow

**4.1 Member Submit Deletion Request**
```http
POST http://localhost:3000/api/deletion-requests
Authorization: Bearer <member-token>
Content-Type: application/json

{
  "transaction_id": 5,
  "reason": "Transaksi salah input, harusnya Rp 100,000 bukan Rp 1,000,000"
}

Expected Response (201):
{
  "success": true,
  "message": "Deletion request submitted successfully",
  "data": { "id": 1 }
}
```

**4.2 Admin Get Pending Requests**
```http
GET http://localhost:3000/api/deletion-requests?status=pending
Authorization: Bearer <admin-token>

Expected Response (200):
{
  "success": true,
  "data": [{
    "id": 1,
    "transaction_id": 5,
    "reason": "Transaksi salah input...",
    "status": "pending",
    "requester_name": "member",
    ...
  }]
}
```

**4.3 Admin Approve Request**
```http
PUT http://localhost:3000/api/deletion-requests/1/approve
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "admin_note": "Request approved, transaksi memang salah input"
}

Expected Response (200):
{
  "success": true,
  "message": "Deletion request approved and transaction deleted"
}
```

### 4.2 Pengujian Aplikasi

#### Screenshot Fitur Utama

**1. Login Page**
- Form login dengan email & password
- Validasi input
- Error handling untuk kredensial salah
- Redirect ke dashboard setelah login sukses

**2. Dashboard (Admin)**
![Dashboard Admin]
- Card statistics: Total Income, Total Expense, Balance
- Recent Transactions table
- Category breakdown chart/list
- Role badge di navbar (Admin)
- Menu lengkap: Dashboard, Transactions, Categories, Budgets, Deletion Requests, Users

**3. Dashboard (Member)**
![Dashboard Member]
- Statistics sama seperti admin
- Recent transactions hanya milik sendiri
- Menu terbatas: Dashboard, Transactions
- Role badge di navbar (Member)

**4. Transactions Page (Admin)**
![Transactions Admin]
- List semua transaksi
- Filter by type, date range
- Pagination controls
- **Delete** button langsung
- Edit & Detail button

**5. Transactions Page (Member)**
![Transactions Member]
- List transaksi milik sendiri
- Filter by type, date range
- **Request Delete** button (bukan Delete)
- Edit button hanya untuk transaksi sendiri
- Cannot delete directly

**6. Transaction Form**
![Transaction Form]
- Form add/edit transaksi
- Dropdown: Budget, Category
- Input: Description, Amount, Type, Date
- Validasi amount > 0
- Auto-calculate balance after submit

**7. Categories Page (Admin Only)**
![Categories]
- Table list categories
- Add New Category button
- Edit & Delete actions
- Color & icon display
- Modal form untuk create/update

**8. Budgets Page (Admin Only)**
![Budgets]
- Table list budgets dengan periode
- Planned amount vs actual spending
- Progress bar indicator
- Active/inactive status toggle
- CRUD operations

**9. Deletion Requests Page (Admin Only)**
![Deletion Requests]
- List pending/approved/rejected requests
- Transaction details (amount, category, date)
- Member's reason displayed
- **Approve** & **Reject** buttons
- Admin note input field
- Status filter dropdown
- Pending count badge di navbar

**10. Users Management (Admin Only)**
![Users Management]
- List all users dengan role
- Edit Role button (admin ↔ member)
- Delete user button
- Cannot delete self
- Confirmation modal

**11. Deletion Request Workflow**
![Request Delete Flow]
- Member klik "Request Delete" di Transactions
- Modal prompt untuk input reason (min 10 char)
- Submit request
- Alert "Request submitted successfully"
- Admin dapat notification badge di navbar
- Admin buka Deletion Requests → review → approve/reject

**12. Error Handling**
![Error Pages]
- 401: Unauthorized - redirect to login
- 403: Forbidden - "Access denied. Admin only."
- 404: Not Found
- 500: Server Error dengan error message

**13. Responsive Design**
![Mobile View]
- Navbar collapse di mobile
- Table scroll horizontal
- Form layout stack vertical
- Touch-friendly button size

---

## 📎 LAMPIRAN

### Link Repository & Deployment

**Link GitHub Repository:**
```
https://github.com/danJidan/Sistem-Kas-Organisasi
```

**Link Deployment (jika ada):**
```
Frontend: -
Backend API: -
(Catatan: Deployment optional, bisa menggunakan Vercel, Netlify, Railway, dll)
```

### Cara Menjalankan Aplikasi

#### Prerequisites
- Node.js v18+
- MySQL v8.0
- XAMPP (atau MySQL server lainnya)
- Git

#### Instalasi & Setup

**1. Clone Repository**
```bash
git clone https://github.com/danJidan/Sistem-Kas-Organisasi.git
cd Sistem-Kas-Organisasi
```

**2. Setup Database**
```bash
# Buka phpMyAdmin (http://localhost/phpmyadmin)
# Buat database baru: kas_organisasi
# Import file SQL:
- database_ddl.sql (struktur tabel)
- database_seed.sql (data dummy)
- database_deletion_requests.sql (tabel deletion_requests)
```

**3. Setup Backend**
```bash
cd backend
npm install

# Buat file .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=kas_organisasi
JWT_SECRET=your_super_secret_key_here_min_32_chars
PORT=3000

# Jalankan server
npm run dev
```

**4. Setup Frontend**
```bash
cd frontend
npm install

# Jalankan development server
npm run dev
```

**5. Akses Aplikasi**
```
Frontend: http://localhost:5173
Backend API: http://localhost:3000

Login Credentials:
- Admin: admin@example.com / password
- Member: member@example.com / password
```

### Screenshot Tambahan

#### Database Schema (phpMyAdmin)
- Screenshot tabel users dengan struktur kolom
- Screenshot relasi foreign key
- Screenshot indexes

#### API Testing (Postman)
- Collection lengkap semua endpoints
- Environment variables (DEV, PROD)
- Pre-request scripts untuk authentication
- Test scripts untuk validation

#### Code Quality
- ESLint configuration
- Folder structure organization
- Naming conventions
- Code comments & documentation

#### Performance Metrics
- API response time < 200ms
- Frontend bundle size < 500KB
- Database query optimization dengan indexes
- Caching strategy (jika ada)

### Fitur Tambahan (Optional Enhancement)

1. **Export Data**
   - Export transactions ke Excel/CSV
   - Export summary report PDF

2. **Email Notifications**
   - Email ke member saat request approved/rejected
   - Weekly summary report

3. **Dashboard Charts**
   - Line chart: Monthly income vs expense
   - Pie chart: Category distribution
   - Bar chart: Budget vs actual spending

4. **Advanced Filtering**
   - Search by description
   - Filter by multiple categories
   - Custom date range picker

5. **Activity Log**
   - Track semua perubahan data
   - Who did what and when

---

## 👨‍💻 Author

**Nama:** [Nama Anda]  
**NIM:** [NIM Anda]  
**Kelas:** [Kelas Anda]  
**Mata Kuliah:** Fullstack Web Modern - UAS  
**Tahun:** 2025

---

## 📄 License

MIT License - Project ini dibuat untuk keperluan UAS

---

**Catatan Penting:**
- Pastikan MySQL service running sebelum start backend
- Port 3000 (backend) dan 5173 (frontend) harus available
- Gunakan browser modern (Chrome, Firefox, Edge) untuk performa optimal
- Backup database secara berkala
- Jangan commit file .env ke repository (sudah ada di .gitignore)

---

**End of Documentation** 📚
- [x] GET /summary/by-category - Summary per category

**Total: 19 screenshots minimum**

Simpan semua screenshot di folder `/screenshots` dengan nama yang jelas (misal: `01-login-success.png`)

---

## 🧪 Testing dengan Postman/Thunder Client

### Setup Collection

1. **Create New Collection:** "Kas Organisasi API"
2. **Set Base URL:** `http://localhost:5000`
3. **Create Folder Structure:**
   - Auth
   - Budgets
   - Categories
   - Transactions
   - Summary

### Testing Flow

1. **Register (Optional):**
   ```
   POST /auth/register
   Body: { "name": "Test User", "email": "test@test.com", "password": "Test123!", "role": "member" }
   ```

2. **Login:**
   ```
   POST /auth/login
   Body: { "email": "admin@demo.com", "password": "Admin123!" }
   → Save token from response
   ```

3. **Set Authorization:**
   - Type: Bearer Token
   - Token: <paste token dari login>

4. **Test All Endpoints** sesuai urutan:
   - Budgets (GET, POST, PUT, DELETE)
   - Categories (GET, POST, PUT, DELETE)
   - Transactions (GET, POST, PUT, DELETE)
   - Summary (4 endpoints)

5. **Test Validation:**
   - Create transaction dengan amount = 0 (should fail)
   - Create transaction dengan budget_id tidak exist (should fail)
   - Create transaction dengan trx_type tidak match category.type (should fail)
   - Create transaction dengan meta JSON invalid (should fail)

---

## 🎯 Business Rules yang Diimplementasikan

### Budgets
- `planned_amount` >= 0
- `start_date` <= `end_date`
- Tidak bisa delete jika masih ada transaction (FK constraint)

### Categories
- `type` harus: income, expense, atau both
- Tidak bisa delete jika masih digunakan transaction

### Transactions
- `amount` > 0 (wajib positif)
- `budget_id` harus exist di tabel budgets
- `category_id` harus exist di tabel categories
- **Rule Khusus:** Jika `trx_type=income`, category.type harus `income` atau `both`
- **Rule Khusus:** Jika `trx_type=expense`, category.type harus `expense` atau `both`
- `meta` harus valid JSON jika diisi

---

## 🌟 Fitur Unggulan

1. **Meta JSON Field:**
   - Kolom `transactions.meta` berisi data fleksibel NoSQL
   - Contoh: `{"receipt_url": "...", "pic_name": "...", "location": "..."}`
   - Bisa store data berbeda untuk setiap transaksi

2. **Query Agregasi SQL:**
   - Summary menggunakan `SUM()` + `CASE WHEN`
   - Query by budget, category, dan date range
   - Pagination pada list transactions

3. **Validasi Berlapis:**
   - Middleware validate (tipe data, required, format)
   - Controller validate (business rules)
   - Database validate (FK constraint, CHECK constraint)

4. **Protected Routes:**
   - Frontend: Route guard redirect ke login
   - Backend: Middleware auth cek JWT
   - Auto logout jika token expired

5. **Error Handling:**
   - Global error handler
   - Response format konsisten
   - User-friendly error messages

---

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5"
}
```

### Frontend
```json
{
  "vue": "^3.3.11",
  "vue-router": "^4.2.5",
  "axios": "^1.6.2"
}
```

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
- Pastikan MySQL service running
- Check kredensial di `.env`
- Test connection: `mysql -u root -p`

### Frontend tidak bisa hit API (CORS error)
- Check `ALLOWED_ORIGINS` di backend `.env`
- Pastikan frontend URL ada di list

### Token expired terus
- Check `JWT_EXPIRES_IN` di `.env`
- Default: 7 hari
- Bisa diubah misal: `1h`, `30d`

### Error "Cannot DELETE ... referenced by other table"
- Ini FK constraint bekerja dengan benar
- Hapus child records (transactions) dulu sebelum hapus parent (budget/category)

---

## 👨‍💻 Developer Notes

### Cara Menambah Endpoint Baru

1. **Model:** Buat query di `models/NamaModel.js`
2. **Controller:** Buat handler di `controllers/namaController.js`
3. **Route:** Daftarkan di `routes/namaRoutes.js` dengan validation
4. **Import:** Tambahkan route di `server.js`

### Cara Menambah Halaman Frontend

1. **View:** Buat component di `src/views/NamaView.vue`
2. **Route:** Daftarkan di `src/router/index.js`
3. **Navbar:** Tambahkan link di `components/Navbar.vue`

---

## 📄 License

Project ini dibuat untuk keperluan UAS Fullstack Web Modern.

---

## 🙏 Credits

- **Stack:** Node.js, Express.js, MySQL, Vue 3, Vite
- **Author:** [Nama Mahasiswa]
- **NIM:** [NIM Mahasiswa]
- **Mata Kuliah:** Fullstack Web Modern
- **Dosen:** [Nama Dosen]

---

## 📞 Contact

Jika ada pertanyaan atau issue:
- Email: [email mahasiswa]
- GitHub: [username]

---

**Happy Coding! 🚀**
#   S i s t e m - K a s - O r g a n i s a s i 
 
 #   S i s t e m - K a s - O r g a n i s a s i 
 
 