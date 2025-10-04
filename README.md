# 💰 ExpenseHub - Full-Stack Expense Management System

A comprehensive, production-ready expense management system with role-based access control, multi-level approval workflows, OCR simulation, and currency conversion.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, Employee)
- Secure password hashing with bcrypt
- Company creation on first signup

### 💸 Expense Management
- **Submit Expenses** with detailed information
- **OCR Simulation** - Auto-fill expense details from receipt
- **Currency Conversion** - Automatic conversion to company currency
- **Category Management** - Travel, Food, Accommodation, etc.
- **Receipt Upload** simulation
- Real-time expense tracking

### ✅ Multi-Level Approval Workflow
- **Configurable approval chains** (Manager → Finance → Director)
- **Conditional approval rules**:
  - Percentage-based (e.g., 60% approval threshold)
  - CFO override (instant approval)
  - Hybrid rules (percentage OR CFO)
- **Approval history** tracking
- **Comments** on approvals/rejections
- **Email notifications** (console logs for demo)

### 👥 User Management (Admin Only)
- Create/Edit/Delete users
- Assign roles and managers
- View all company employees

### ⚙️ Settings & Configuration (Admin Only)
- Configure approval rules
- Set approval thresholds
- Manage approval chain
- Designate CFO

### 📊 Dashboard & Analytics
- Real-time statistics
- Total, Pending, Approved, Rejected expenses
- Amount summaries
- Role-based views

## 🧱 Tech Stack

### Frontend
- **React 18** with Vite
- **Material-UI (MUI)** - Modern UI components
- **React Router** - Navigation
- **Axios** - API requests
- **Context API** - State management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** enabled

### Theme
- **Primary Color**: Green (#00A86B)
- **Secondary Color**: Black (#000000)
- **Background**: White (#FFFFFF)

## 📁 Project Structure

```
expense/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Expense.js
│   │   └── ApprovalRule.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── expense.js
│   │   ├── user.js
│   │   └── rules.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── generateToken.js
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Expenses.jsx
    │   │   ├── Approvals.jsx
    │   │   ├── Users.jsx
    │   │   └── Settings.jsx
    │   ├── theme.js
    │   ├── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (Local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
cd c:\Users\User\Downloads\expense
```

2. **Setup Backend**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already created with defaults)
# Update MONGODB_URI if needed

# Seed the database with dummy data
npm run seed

# Start the backend server
npm run dev
```

Backend will run on **http://localhost:5000**

3. **Setup Frontend**

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on **http://localhost:3000**

## 👤 Demo Accounts

After running the seed script, you can login with these accounts:

### Admin Account
- **Email**: admin@techcorp.com
- **Password**: admin123
- **Permissions**: Full access to all features

### Manager Account
- **Email**: sarah@techcorp.com
- **Password**: manager123
- **Permissions**: Approve expenses, view team data

### Manager (CFO) Account
- **Email**: michael@techcorp.com
- **Password**: manager123
- **Permissions**: CFO override approval rights

### Employee Accounts
- **Email**: john@techcorp.com
- **Password**: employee123

- **Email**: emily@techcorp.com
- **Password**: employee123

- **Email**: david@techcorp.com
- **Password**: employee123

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user & company
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Expenses
- `POST /api/expense/create` - Create expense
- `GET /api/expense/my` - Get user's expenses
- `GET /api/expense/pending` - Get pending approvals (Manager/Admin)
- `GET /api/expense/all` - Get all expenses (Admin)
- `GET /api/expense/:id` - Get expense by ID
- `PUT /api/expense/:id/approve` - Approve expense
- `PUT /api/expense/:id/reject` - Reject expense
- `POST /api/expense/ocr` - Simulate OCR
- `POST /api/expense/convert` - Convert currency
- `GET /api/expense/stats/summary` - Get statistics

### Users
- `GET /api/user/all` - Get all users (Admin/Manager)
- `GET /api/user/employees` - Get employees (Admin)
- `GET /api/user/managers` - Get managers (Admin)
- `POST /api/user/create` - Create user (Admin)
- `PUT /api/user/:id` - Update user (Admin)
- `DELETE /api/user/:id` - Delete user (Admin)
- `GET /api/user/:id` - Get user by ID

### Rules
- `GET /api/rules` - Get approval rules
- `PUT /api/rules` - Update approval rules (Admin)
- `POST /api/rules/approver` - Add approver (Admin)
- `DELETE /api/rules/approver/:userId` - Remove approver (Admin)

## 🎯 Key Features Explained

### 1. OCR Simulation
Click "Simulate OCR" when submitting an expense to auto-fill:
- Random merchant name
- Random amount
- Recent date

### 2. Currency Conversion
The system automatically converts all expenses to the company's base currency using dummy exchange rates:
- USD: 1
- INR: 83
- EUR: 0.92
- GBP: 0.79
- AUD: 1.52
- CAD: 1.35

### 3. Approval Workflow

**Example Flow:**
1. Employee submits expense
2. Manager (Level 1) reviews
3. If approved, moves to Finance Manager (Level 2)
4. If approved, moves to Director (Level 3)
5. Final approval based on rules

**Auto-Approval Triggers:**
- **Percentage Rule**: If 60% (configurable) of approvers approve
- **CFO Rule**: If designated CFO approves
- **Hybrid**: Either condition met
- **Admin Override**: Admin can approve instantly

### 4. Conditional Rules

Admins can configure three types of approval rules:

1. **Percentage-Based**: Auto-approve when X% of approvers approve
2. **CFO Override**: Instant approval if CFO approves
3. **Hybrid**: Either percentage threshold OR CFO approval triggers auto-approval

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Material-UI Theme** - Professional green/black/white color scheme
- **Smooth Animations** - Card hover effects, transitions
- **Toast Notifications** - Success/error feedback
- **Modal Dialogs** - Clean forms and detail views
- **Data Tables** - Sortable, filterable expense lists
- **Dashboard Cards** - Real-time statistics
- **Role-Based Navigation** - Sidebar adapts to user role

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected routes (frontend & backend)
- Role-based authorization
- Token expiration handling
- Secure HTTP headers

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-management
JWT_SECRET=your-secret-key-change-in-production-123456789
JWT_EXPIRE=30d
NODE_ENV=development
```

## 🧪 Testing the Application

### Test Workflow 1: Employee Submits Expense
1. Login as `john@techcorp.com`
2. Go to "My Expenses"
3. Click "Submit Expense"
4. Click "Simulate OCR" to auto-fill
5. Submit the expense
6. View in "My Expenses" with "Pending" status

### Test Workflow 2: Manager Approves
1. Logout and login as `sarah@techcorp.com`
2. Go to "Approvals"
3. See pending expense from John
4. Click approve icon
5. Add comment and approve
6. Expense moves to next level

### Test Workflow 3: Admin Configuration
1. Login as `admin@techcorp.com`
2. Go to "Users" to create new users
3. Go to "Settings" to configure approval rules
4. Change threshold, add/remove approvers
5. View all expenses in system

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify MONGODB_URI in backend/.env
- For MongoDB Atlas, ensure network access is configured

### Port Already in Use
```bash
# Backend (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Issues
- Ensure backend CORS is enabled
- Check API_URL in frontend/src/api.js matches backend URL

## 🚀 Production Deployment

### Backend
1. Update environment variables
2. Change JWT_SECRET to a secure random string
3. Set NODE_ENV=production
4. Use proper MongoDB connection (MongoDB Atlas)
5. Deploy to Heroku, Railway, or AWS

### Frontend
1. Update API_URL in src/api.js to production backend URL
2. Build: `npm run build`
3. Deploy to Vercel, Netlify, or serve dist folder

## 📚 Future Enhancements

- [ ] Real file upload to cloud storage (AWS S3, Cloudinary)
- [ ] Real email notifications (SendGrid, Nodemailer)
- [ ] Export expenses to CSV/PDF
- [ ] Advanced analytics and charts
- [ ] Expense categories customization
- [ ] Bulk expense upload
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (Socket.io)
- [ ] Audit logs
- [ ] Multi-company support

## 🤝 Contributing

This is a prototype/demo project. Feel free to fork and enhance!

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Developer

Built with ❤️ using the MERN stack

---

## 🎉 Quick Start Summary

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run seed
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Open browser: http://localhost:3000
# Login: admin@techcorp.com / admin123
```

**Enjoy managing expenses! 💰✨**
