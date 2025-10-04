# 🚀 HOW TO RUN - ExpenseHub

## Quick Start (Copy & Paste These Commands)

### 📋 Prerequisites Check
```powershell
# Check if Node.js is installed
node --version
# Should show v16.0.0 or higher

# Check if npm is installed
npm --version
# Should show 8.0.0 or higher
```

If not installed, download from: https://nodejs.org/

---

## 🎯 Method 1: Automated Setup (RECOMMENDED)

### Step 1: Run Setup Script
```powershell
cd c:\Users\User\Downloads\expense
.\setup.ps1
```
This will install all dependencies for both backend and frontend.

### Step 2: Seed Database (One-Time)
```powershell
cd backend
npm run seed
```
✅ Creates 6 demo users and 5 sample expenses

### Step 3: Start Backend
```powershell
# Still in backend folder
npm run dev
```
✅ Server runs on **http://localhost:5000**
⚠️ **Keep this terminal open!**

### Step 4: Start Frontend (New Terminal)
```powershell
# Open NEW PowerShell terminal
cd c:\Users\User\Downloads\expense\frontend
npm run dev
```
✅ App runs on **http://localhost:3000**
⚠️ **Keep this terminal open too!**

### Step 5: Open Browser
Navigate to: **http://localhost:3000**

---

## 🎯 Method 2: Manual Setup

### Backend Setup
```powershell
# Terminal 1: Backend
cd c:\Users\User\Downloads\expense\backend

# Install dependencies
npm install

# Create .env file (if not exists)
# Copy .env.example to .env or create manually:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/expense-management
# JWT_SECRET=your-secret-key-change-this-in-production

# Seed database with demo data
npm run seed

# Start backend server
npm run dev
```

### Frontend Setup
```powershell
# Terminal 2: Frontend (NEW terminal)
cd c:\Users\User\Downloads\expense\frontend

# Install dependencies
npm install

# Start frontend app
npm run dev
```

---

## 🔐 Demo Login Credentials

After opening **http://localhost:3000**, login with:

### 👑 Admin Account
- **Email:** admin@techcorp.com
- **Password:** admin123
- **Access:** Everything (Users, Settings, Approvals, Dashboard)

### 👔 Manager Account
- **Email:** sarah@techcorp.com
- **Password:** manager123
- **Access:** Approvals, Dashboard, Own Expenses

### 👤 Employee Account
- **Email:** john@techcorp.com
- **Password:** employee123
- **Access:** Submit Expenses, Dashboard

---

## 📱 What You'll See

1. **Login Page** - Use credentials above
2. **Dashboard** - Statistics and charts
3. **My Expenses** - Submit and view expenses (All roles)
4. **Approvals** - Approve/reject expenses (Manager/Admin only)
5. **Users** - Manage users (Admin only)
6. **Settings** - Configure approval rules (Admin only)

---

## 🔧 Troubleshooting

### Problem: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Problem: "Port 5000 already in use"
**Solution:** 
```powershell
# Find and kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Problem: "Port 3000 already in use"
**Solution:**
```powershell
# Find and kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Problem: "Cannot connect to MongoDB"
**Solution:** 
- Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
- OR use MongoDB Atlas (cloud): Create free account at https://www.mongodb.com/cloud/atlas
- Update MONGODB_URI in backend/.env

### Problem: "Module not found"
**Solution:**
```powershell
# Backend
cd c:\Users\User\Downloads\expense\backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd c:\Users\User\Downloads\expense\frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Problem: Backend starts but no data
**Solution:** Run seed script again
```powershell
cd c:\Users\User\Downloads\expense\backend
npm run seed
```

---

## ✅ Success Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB installed or Atlas configured
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Database seeded (`npm run seed`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login with demo credentials

---

## 🎮 Quick Test Workflow

1. **Login as Employee** (john@techcorp.com / employee123)
   - Go to "My Expenses"
   - Click "Submit Expense"
   - Click "Simulate OCR" button
   - Fill remaining fields
   - Submit expense

2. **Logout & Login as Manager** (sarah@techcorp.com / manager123)
   - Go to "Approvals"
   - See the pending expense
   - Click "Approve"
   - Add comment
   - Submit approval

3. **Logout & Login as Admin** (admin@techcorp.com / admin123)
   - Go to "Users" to manage users
   - Go to "Settings" to configure rules
   - Go to "Dashboard" to see statistics

---

## 🛑 How to Stop

### Stop Frontend
Press **Ctrl + C** in the frontend terminal

### Stop Backend
Press **Ctrl + C** in the backend terminal

---

## 🔄 Restart Instructions

### Quick Restart (After First Setup)
```powershell
# Terminal 1: Backend
cd c:\Users\User\Downloads\expense\backend
npm run dev

# Terminal 2: Frontend (NEW terminal)
cd c:\Users\User\Downloads\expense\frontend
npm run dev
```

### Fresh Start (Reset Database)
```powershell
# Backend terminal
cd c:\Users\User\Downloads\expense\backend
npm run seed  # Re-seed database
npm run dev
```

---

## 📊 Ports Used

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend App | 3000 | http://localhost:3000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## 💡 Pro Tips

1. **Keep Both Terminals Open** - You need backend AND frontend running
2. **Seed Once** - Only run `npm run seed` once or when you want fresh data
3. **Check Console** - Look for errors in browser console (F12) if issues
4. **Network Tab** - Check browser Network tab to see API calls
5. **Backend Logs** - Backend terminal shows all API requests

---

## 🎉 You're Ready!

Follow the steps above and you'll have the app running in under 5 minutes!

**Need help?** Check the other documentation files:
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick setup guide
- `PROJECT_COMPLETE.md` - Troubleshooting guide
