# 🏗️ System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                     http://localhost:3000                        │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Frontend (Vite)                   │  │
│  │                                                             │  │
│  │  ├─ Pages (Login, Dashboard, Expenses, etc.)              │  │
│  │  ├─ Components (Layout, ProtectedRoute)                   │  │
│  │  ├─ Context (AuthContext)                                 │  │
│  │  ├─ Theme (Material-UI Green/Black/White)                 │  │
│  │  └─ API Client (Axios)                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP Requests (REST API)
                          │ Authorization: Bearer <JWT>
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                            │
│                   http://localhost:5000                          │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                Express.js REST API                         │  │
│  │                                                             │  │
│  │  ├─ Routes                                                 │  │
│  │  │   ├─ /api/auth (register, login)                       │  │
│  │  │   ├─ /api/expense (create, approve, reject, etc.)      │  │
│  │  │   ├─ /api/user (CRUD operations)                       │  │
│  │  │   └─ /api/rules (approval configuration)               │  │
│  │  │                                                         │  │
│  │  ├─ Middleware                                            │  │
│  │  │   ├─ protect (JWT verification)                        │  │
│  │  │   └─ authorize (role-based access)                     │  │
│  │  │                                                         │  │
│  │  ├─ Models (Mongoose ODM)                                 │  │
│  │  │   ├─ User.js                                           │  │
│  │  │   ├─ Company.js                                        │  │
│  │  │   ├─ Expense.js                                        │  │
│  │  │   └─ ApprovalRule.js                                   │  │
│  │  │                                                         │  │
│  │  └─ Utils                                                  │  │
│  │      ├─ simulateOCR()                                     │  │
│  │      ├─ convertCurrency()                                 │  │
│  │      ├─ checkApprovalRules()                              │  │
│  │      └─ generateToken()                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ MongoDB Driver
                          │ mongoose.connect()
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                  │
│              MongoDB (localhost:27017)                           │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Database: expense-management                              │  │
│  │                                                             │  │
│  │  Collections:                                              │  │
│  │  ├─ users                                                  │  │
│  │  │   └─ { name, email, password, role, companyId, ... }   │  │
│  │  │                                                         │  │
│  │  ├─ companies                                              │  │
│  │  │   └─ { name, country, currency, ... }                  │  │
│  │  │                                                         │  │
│  │  ├─ expenses                                               │  │
│  │  │   └─ { employeeId, amount, status, history, ... }      │  │
│  │  │                                                         │  │
│  │  └─ approvalrules                                          │  │
│  │      └─ { companyId, ruleType, threshold, approvers }     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Authentication Flow

```
┌──────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│      │ Login   │          │  Verify │         │  Query  │          │
│ User ├────────►│ Frontend ├────────►│ Backend ├────────►│ MongoDB  │
│      │         │          │ Creds   │         │  User   │          │
└──────┘         └────┬─────┘         └────┬────┘         └──────────┘
                      │                     │
                      │   JWT Token         │ User Data
                      │◄────────────────────┘
                      │
                      │ Store in localStorage
                      │ Set AuthContext
                      │
                      └─► Redirect to Dashboard
```

### 2. Expense Submission Flow

```
Employee                Frontend                Backend                 Database
    │                      │                      │                        │
    │  Submit Expense      │                      │                        │
    ├─────────────────────►│                      │                        │
    │                      │  POST /api/expense   │                        │
    │                      │     /create          │                        │
    │                      ├─────────────────────►│                        │
    │                      │                      │  Convert Currency      │
    │                      │                      │  Find Manager          │
    │                      │                      │  Create Expense        │
    │                      │                      ├───────────────────────►│
    │                      │                      │                        │
    │                      │  Expense Created     │◄───────────────────────┤
    │                      │◄─────────────────────┤                        │
    │  Success Message     │                      │                        │
    │◄─────────────────────┤                      │                        │
    │                      │                      │  📧 Notify Manager     │
    │                      │                      │  (console.log)         │
    │                      │                      │                        │
```

### 3. Approval Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Expense Approval Flow                         │
└─────────────────────────────────────────────────────────────────────┘

Employee Submits
       │
       ▼
┌─────────────┐
│  Status:    │
│  Pending    │ ──► Manager Queue
│  Level: 1   │
└──────┬──────┘
       │
       │ Manager Reviews
       │
       ├──► Reject ──► Status: Rejected ──► 📧 Notify Employee
       │
       └──► Approve
              │
              ▼
       ┌─────────────┐
       │  Status:    │
       │  In Review  │ ──► Finance Manager Queue
       │  Level: 2   │
       └──────┬──────┘
              │
              │ Finance Manager Reviews
              │
              ├──► Reject ──► Status: Rejected ──► 📧 Notify Employee
              │
              └──► Approve
                     │
                     ▼
              Check Rules:
              ├─ Percentage ≥ 60%? ──► Auto-Approve
              ├─ CFO Approved? ──────► Auto-Approve
              └─ Hybrid Rule? ───────► Check Both
                     │
                     ▼
              ┌─────────────┐
              │  Status:    │
              │  Approved   │ ──► 📧 Notify Employee
              └─────────────┘
```

### 4. OCR Simulation Flow

```
┌────────────────────────────────────────────────────────────┐
│               OCR Simulation Process                        │
└────────────────────────────────────────────────────────────┘

User Clicks "Simulate OCR"
       │
       ▼
Frontend sends POST /api/expense/ocr
       │
       ▼
Backend generates random data:
       │
       ├─► Merchant: ["Starbucks", "Uber", "Amazon", ...]
       ├─► Amount: Random(100-600)
       └─► Date: Recent date (last 30 days)
       │
       ▼
Return JSON: { merchant, amount, date }
       │
       ▼
Frontend auto-fills form fields
       │
       ▼
User reviews and submits
```

### 5. Currency Conversion Flow

```
┌────────────────────────────────────────────────────────────┐
│           Currency Conversion Process                       │
└────────────────────────────────────────────────────────────┘

Expense Submitted: $100 USD
       │
       ▼
Get Company Currency: INR
       │
       ▼
Call convertCurrency(100, 'USD', 'INR')
       │
       ├─► Exchange Rates:
       │   USD: 1, INR: 83, EUR: 0.92
       │
       ├─► Formula:
       │   amount * (rates[to] / rates[from])
       │
       └─► Result: 100 * (83 / 1) = 8300 INR
       │
       ▼
Store in Expense:
  ├─ amount: 100
  ├─ currency: "USD"
  ├─ convertedAmount: 8300
  └─ companyCurrency: "INR"
```

## Component Hierarchy

```
App
 ├─ ThemeProvider
 │   └─ CssBaseline
 │
 ├─ AuthProvider (Context)
 │
 └─ Router
     ├─ /login → Login
     ├─ /register → Register
     │
     └─ / → Layout (Protected)
         ├─ Sidebar (role-based menu)
         ├─ AppBar (user profile)
         │
         └─ Outlet
             ├─ /dashboard → Dashboard
             │   ├─ StatCard (Total Expenses)
             │   ├─ StatCard (Pending)
             │   ├─ StatCard (Approved)
             │   └─ StatCard (Rejected)
             │
             ├─ /expenses → Expenses
             │   ├─ ExpenseTable
             │   ├─ SubmitDialog
             │   └─ DetailDialog
             │
             ├─ /approvals → Approvals (Manager/Admin)
             │   ├─ PendingTable
             │   └─ ApprovalDialog
             │
             ├─ /users → Users (Admin)
             │   ├─ UserTable
             │   └─ UserDialog
             │
             └─ /settings → Settings (Admin)
                 ├─ RulesForm
                 └─ ApprovalChain
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    State Architecture                        │
└─────────────────────────────────────────────────────────────┘

Global State (Context API):
  AuthContext
   ├─ user (current user object)
   ├─ token (JWT token)
   ├─ loading (auth loading state)
   ├─ isAuthenticated (boolean)
   └─ Methods:
       ├─ login(email, password)
       ├─ register(data)
       └─ logout()

Local State (useState):
  Each Page:
   ├─ data (list of items)
   ├─ loading (loading state)
   ├─ error (error message)
   ├─ openDialog (modal state)
   ├─ formData (form state)
   └─ snackbar (notification state)
```

## API Routes Map

```
/api
 ├─ /auth
 │   ├─ POST   /register    (Create company & admin)
 │   ├─ POST   /login       (Authenticate user)
 │   └─ GET    /me          (Get current user)
 │
 ├─ /expense
 │   ├─ POST   /create      (Submit expense)
 │   ├─ GET    /my          (Get user's expenses)
 │   ├─ GET    /pending     (Get pending approvals)
 │   ├─ GET    /all         (Get all expenses - Admin)
 │   ├─ GET    /:id         (Get expense by ID)
 │   ├─ PUT    /:id/approve (Approve expense)
 │   ├─ PUT    /:id/reject  (Reject expense)
 │   ├─ POST   /ocr         (Simulate OCR)
 │   ├─ POST   /convert     (Convert currency)
 │   └─ GET    /stats/summary (Get statistics)
 │
 ├─ /user
 │   ├─ GET    /all         (Get all users)
 │   ├─ GET    /employees   (Get employees)
 │   ├─ GET    /managers    (Get managers)
 │   ├─ POST   /create      (Create user - Admin)
 │   ├─ PUT    /:id         (Update user - Admin)
 │   ├─ DELETE /:id         (Delete user - Admin)
 │   └─ GET    /:id         (Get user by ID)
 │
 └─ /rules
     ├─ GET    /            (Get approval rules)
     ├─ PUT    /            (Update rules - Admin)
     ├─ POST   /approver    (Add approver - Admin)
     └─ DELETE /approver/:userId (Remove approver - Admin)
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Architecture                     │
└─────────────────────────────────────────────────────────────┘

Layer 1: Frontend Protection
  ├─ ProtectedRoute component (checks auth)
  ├─ Role-based rendering (hide features)
  └─ Token in localStorage

Layer 2: Network Security
  ├─ HTTPS (production)
  ├─ CORS configuration
  └─ JWT in Authorization header

Layer 3: Backend Middleware
  ├─ protect() - Verify JWT token
  └─ authorize(roles) - Check user role

Layer 4: Database Security
  ├─ Password hashing (bcrypt)
  ├─ Mongoose schema validation
  └─ MongoDB indexes (unique email)

Layer 5: API Security
  ├─ Input validation
  ├─ Error handling
  ├─ Rate limiting (ready)
  └─ SQL injection prevention
```

## Deployment Architecture (Production)

```
┌────────────────────────────────────────────────────────────────┐
│                     Production Setup                            │
└────────────────────────────────────────────────────────────────┘

Frontend (Vercel/Netlify)
  ├─ npm run build
  ├─ Deploy dist/
  └─ Environment: VITE_API_URL=https://api.example.com

Backend (Heroku/Railway/AWS)
  ├─ Deploy via Git
  ├─ Environment Variables:
  │   ├─ PORT=5000
  │   ├─ MONGODB_URI=mongodb+srv://...
  │   ├─ JWT_SECRET=random-secure-key
  │   └─ NODE_ENV=production
  └─ Start: node server.js

Database (MongoDB Atlas)
  ├─ Cloud-hosted MongoDB
  ├─ Automated backups
  ├─ Network access rules
  └─ Connection string in env
```

## Scalability Considerations

```
Current: Monolithic MERN Stack
  ├─ Good for: MVP, Small-Medium apps
  └─ Supports: 1000s of concurrent users

Future: Microservices
  ├─ Auth Service
  ├─ Expense Service
  ├─ Approval Service
  ├─ Notification Service
  └─ API Gateway

Horizontal Scaling:
  ├─ Load Balancer
  ├─ Multiple Backend Instances
  ├─ MongoDB Replica Set
  └─ Redis for Caching

Performance:
  ├─ Database Indexing ✅
  ├─ API Pagination (ready)
  ├─ Lazy Loading (React)
  └─ CDN for Static Assets
```

This architecture provides a solid foundation for a production-ready expense management system! 🏗️
