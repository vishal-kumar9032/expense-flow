# 🔧 Backend API Documentation

## Overview
RESTful API for ExpenseHub - Expense Management System

**Base URL**: `http://localhost:5000/api`

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Routes

### 🔐 Authentication Routes

#### Register (Create Company & Admin)
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "companyName": "TechCorp",
  "country": "United States"
}

Response: {
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Admin",
  "companyId": "...",
  "token": "jwt-token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@techcorp.com",
  "password": "admin123"
}

Response: {
  "_id": "...",
  "name": "Admin User",
  "email": "admin@techcorp.com",
  "role": "Admin",
  "companyId": { ... },
  "token": "jwt-token"
}
```

### 💰 Expense Routes

#### Create Expense
```http
POST /api/expense/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 150.50,
  "currency": "USD",
  "category": "Food",
  "description": "Team lunch",
  "merchant": "Restaurant Name",
  "date": "2025-10-04"
}

Response: { expense object }
```

#### Get My Expenses
```http
GET /api/expense/my
Authorization: Bearer <token>

Response: [ array of expenses ]
```

#### Get Pending Approvals (Manager/Admin)
```http
GET /api/expense/pending
Authorization: Bearer <token>

Response: [ array of pending expenses ]
```

#### Get All Expenses (Admin Only)
```http
GET /api/expense/all
Authorization: Bearer <token>

Response: [ array of all expenses ]
```

#### Approve Expense
```http
PUT /api/expense/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "Approved for business purposes"
}

Response: { updated expense }
```

#### Reject Expense
```http
PUT /api/expense/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "Missing receipt"
}

Response: { updated expense }
```

#### Simulate OCR
```http
POST /api/expense/ocr
Authorization: Bearer <token>

Response: {
  "merchant": "Starbucks",
  "amount": 23.45,
  "date": "2025-10-03"
}
```

#### Convert Currency
```http
POST /api/expense/convert
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "INR"
}

Response: {
  "convertedAmount": 8300,
  "fromCurrency": "USD",
  "toCurrency": "INR",
  "originalAmount": 100
}
```

#### Get Statistics
```http
GET /api/expense/stats/summary
Authorization: Bearer <token>

Response: {
  "totalExpenses": 10,
  "pendingExpenses": 3,
  "approvedExpenses": 5,
  "rejectedExpenses": 2,
  "totalAmount": 5000.00,
  "pendingAmount": 1200.00
}
```

### 👥 User Routes (Admin Only)

#### Get All Users
```http
GET /api/user/all
Authorization: Bearer <token>

Response: [ array of users ]
```

#### Create User
```http
POST /api/user/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@techcorp.com",
  "password": "password123",
  "role": "Employee",
  "managerId": "manager-id" // optional
}

Response: { created user }
```

#### Update User
```http
PUT /api/user/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "role": "Manager",
  "managerId": "new-manager-id"
}

Response: { updated user }
```

#### Delete User
```http
DELETE /api/user/:id
Authorization: Bearer <token>

Response: { message: "User removed successfully" }
```

### ⚙️ Rules Routes (Admin Only)

#### Get Approval Rules
```http
GET /api/rules
Authorization: Bearer <token>

Response: {
  "_id": "...",
  "companyId": "...",
  "ruleType": "hybrid",
  "threshold": 60,
  "approvers": [...]
}
```

#### Update Rules
```http
PUT /api/rules
Authorization: Bearer <token>
Content-Type: application/json

{
  "ruleType": "percentage",
  "threshold": 70
}

Response: { updated rules }
```

#### Add Approver
```http
POST /api/rules/approver
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-id",
  "level": 2,
  "role": "Finance Manager",
  "isCFO": true
}

Response: { updated rules }
```

#### Remove Approver
```http
DELETE /api/rules/approver/:userId
Authorization: Bearer <token>

Response: { updated rules }
```

## Data Models

### User
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: 'Admin' | 'Manager' | 'Employee',
  companyId: ObjectId,
  managerId: ObjectId (optional),
  createdAt: Date
}
```

### Company
```javascript
{
  name: String,
  country: String,
  currency: 'USD' | 'INR' | 'EUR' | 'GBP' | 'AUD' | 'CAD',
  createdAt: Date
}
```

### Expense
```javascript
{
  employeeId: ObjectId,
  companyId: ObjectId,
  amount: Number,
  currency: String,
  convertedAmount: Number,
  companyCurrency: String,
  category: String,
  description: String,
  merchant: String,
  date: Date,
  receiptUrl: String,
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Review',
  approverLevel: Number,
  currentApproverId: ObjectId,
  history: [{
    approverId: ObjectId,
    approverName: String,
    action: 'Approved' | 'Rejected' | 'Submitted',
    comment: String,
    date: Date
  }],
  createdAt: Date
}
```

### ApprovalRule
```javascript
{
  companyId: ObjectId,
  ruleType: 'percentage' | 'cfo' | 'hybrid',
  threshold: Number,
  approvers: [{
    userId: ObjectId,
    level: Number,
    role: String,
    isCFO: Boolean
  }],
  createdAt: Date
}
```

## Error Responses

```javascript
{
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Seeding Database

Run the seed script to populate with dummy data:
```bash
npm run seed
```

This creates:
- 1 Company (TechCorp Solutions)
- 1 Admin user
- 2 Manager users
- 3 Employee users
- 5 Sample expenses
- 1 Approval rule configuration

## Testing with Postman/Thunder Client

1. Login to get token
2. Copy token
3. Add to Authorization header: `Bearer <token>`
4. Make requests to protected endpoints

## Environment Variables

Required in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-management
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
NODE_ENV=development
```
