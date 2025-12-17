# API Endpoints - Kas Organisasi

Base URL: `http://localhost:5000`

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Headers:** None (public)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "member"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 3,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

### 2. Login
**POST** `/auth/login`

**Headers:** None (public)

**Request Body:**
```json
{
  "email": "admin@demo.com",
  "password": "Admin123!"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@demo.com",
      "role": "admin"
    }
  }
}
```

### 3. Get Profile
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@demo.com",
      "role": "admin"
    }
  }
}
```

---

## Budgets Endpoints

### 4. Get All Budgets
**GET** `/budgets`

**Headers:** `Authorization: Bearer <token>`

**Query Params:** `?is_active=1` (optional)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Budgets retrieved successfully",
  "data": {
    "budgets": [
      {
        "id": 1,
        "name": "Dana Kas Umum 2024",
        "description": "Anggaran operasional harian",
        "planned_amount": 50000000.00,
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "is_active": 1,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 5. Get Budget by ID
**GET** `/budgets/:id`

**Headers:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Budget retrieved successfully",
  "data": {
    "budget": {
      "id": 1,
      "name": "Dana Kas Umum 2024",
      "planned_amount": 50000000.00,
      "transaction_count": 5,
      "total_income": 10300000.00,
      "total_expense": 3500000.00,
      "balance": 6800000.00
    }
  }
}
```

### 6. Create Budget
**POST** `/budgets`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Event Budget 2025",
  "description": "Budget for annual event",
  "planned_amount": 30000000.00,
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "is_active": 1
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Budget created successfully",
  "data": {
    "budget": {
      "id": 4,
      "name": "Event Budget 2025",
      "planned_amount": 30000000.00,
      ...
    }
  }
}
```

### 7. Update Budget
**PUT** `/budgets/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (same as create)

### 8. Delete Budget
**DELETE** `/budgets/:id`

**Headers:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

---

## Categories Endpoints

### 9. Get All Categories
**GET** `/categories`

**Headers:** `Authorization: Bearer <token>`

**Query Params:** `?type=income&is_active=1` (optional)

### 10. Get Category by ID
**GET** `/categories/:id`

### 11. Create Category
**POST** `/categories`

**Request Body:**
```json
{
  "name": "Sponsorship",
  "type": "income",
  "description": "Income from sponsors",
  "is_active": 1
}
```

### 12. Update Category
**PUT** `/categories/:id`

### 13. Delete Category
**DELETE** `/categories/:id`

---

## Transactions Endpoints

### 14. Get All Transactions (with Pagination)
**GET** `/transactions`

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `page=1` (default: 1)
- `limit=10` (default: 10)
- `budget_id=1` (optional)
- `category_id=2` (optional)
- `trx_type=income` (optional)
- `payment_method=transfer` (optional)
- `date_from=2024-01-01` (optional)
- `date_to=2024-12-31` (optional)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": 1,
        "budget_id": 1,
        "budget_name": "Dana Kas Umum 2024",
        "category_id": 1,
        "category_name": "Sumbangan Anggota",
        "trx_type": "income",
        "amount": 5000000.00,
        "trx_date": "2024-01-15",
        "note": "Iuran anggota Januari",
        "payment_method": "transfer",
        "meta": "{\"receipt_url\":\"...\",\"pic_name\":\"Bendahara\"}",
        "created_by_name": "Admin User"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

### 15. Get Transaction by ID
**GET** `/transactions/:id`

**Headers:** `Authorization: Bearer <token>`

### 16. Create Transaction
**POST** `/transactions`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "budget_id": 1,
  "category_id": 1,
  "trx_type": "income",
  "amount": 5000000.00,
  "trx_date": "2024-01-15",
  "note": "Iuran anggota bulanan",
  "payment_method": "transfer",
  "meta": {
    "receipt_url": "https://example.com/receipt.jpg",
    "pic_name": "Bendahara Umum",
    "payment_count": 50
  }
}
```

**Validation Rules:**
- `amount` > 0
- `budget_id` must exist
- `category_id` must exist
- `trx_type` must match `category.type` (if category.type != 'both')
- `meta` must be valid JSON

**Response Success (201):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "transaction": { ... }
  }
}
```

### 17. Update Transaction
**PUT** `/transactions/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (same as create)

### 18. Delete Transaction
**DELETE** `/transactions/:id`

**Headers:** `Authorization: Bearer <token>`

---

## Summary Endpoints (Query Agregasi SQL)

### 19. Get Overall Summary
**GET** `/summary`

**Headers:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Summary retrieved successfully",
  "data": {
    "totalIncome": 10300000.00,
    "totalExpense": 17500000.00,
    "balance": -7200000.00,
    "transactionCount": 10,
    "lastTransactions": [
      {
        "id": 10,
        "trx_type": "expense",
        "amount": 1200000.00,
        "trx_date": "2024-04-01",
        "budget_name": "Dana Kas Umum",
        "category_name": "Lain-lain"
      }
    ]
  }
}
```

### 20. Get Summary by Budget
**GET** `/summary/by-budget`

**Headers:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Budget summary retrieved successfully",
  "data": {
    "budgets": [
      {
        "budget_id": 1,
        "budget_name": "Dana Kas Umum 2024",
        "planned_amount": 50000000.00,
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "income": 10300000.00,
        "expense": 3500000.00,
        "balance": 6800000.00,
        "transaction_count": 5,
        "utilization_percentage": "7.00"
      }
    ]
  }
}
```

### 21. Get Summary by Category
**GET** `/summary/by-category`

**Headers:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Category summary retrieved successfully",
  "data": {
    "categories": [
      {
        "category_id": 1,
        "category_name": "Sumbangan Anggota",
        "category_type": "income",
        "income": 9800000.00,
        "expense": 0,
        "balance": 9800000.00,
        "transaction_count": 2
      }
    ]
  }
}
```

### 22. Get Summary by Date Range
**GET** `/summary/by-date?date_from=2024-01-01&date_to=2024-12-31`

**Headers:** `Authorization: Bearer <token>`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Date summary retrieved successfully",
  "data": {
    "date_from": "2024-01-01",
    "date_to": "2024-12-31",
    "summary": [
      {
        "date": "2024-07-20",
        "income": 0,
        "expense": 8000000.00,
        "balance": -8000000.00,
        "transaction_count": 1
      }
    ]
  }
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "details": "Detailed error info (optional)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (token invalid/missing)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Testing with Postman/Thunder Client

1. **Import Collection**: Create collection "Kas Organisasi API"
2. **Set Base URL**: `http://localhost:5000`
3. **Test Login**: POST `/auth/login` → Save token
4. **Set Auth Header**: Use saved token in all protected endpoints
5. **Test All CRUD**: Budgets → Categories → Transactions
6. **Test Summary**: Check all 4 summary endpoints
