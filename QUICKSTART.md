# 🚀 Quick Start Guide

## Get ExpenseHub Running in 5 Minutes

### Step 1: Install Dependencies

Open **TWO** terminal windows:

**Terminal 1 - Backend:**
```powershell
cd c:\Users\User\Downloads\expense\backend
npm install
```

**Terminal 2 - Frontend:**
```powershell
cd c:\Users\User\Downloads\expense\frontend
npm install
```

### Step 2: Setup Database

Make sure **MongoDB** is running on your system.

**Windows:**
- MongoDB should be running as a service
- Or run: `"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"`

**Terminal 1 (Backend):**
```powershell
npm run seed
```

You should see:
```
✅ MongoDB Connected
✅ Company created: TechCorp Solutions
✅ Admin created
✅ Managers created
✅ Employees created
✅ Sample expenses created
```

### Step 3: Start Servers

**Terminal 1 (Backend):**
```powershell
npm run dev
```

Should show:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

**Terminal 2 (Frontend):**
```powershell
npm run dev
```

Should show:
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:3000/
```

### Step 4: Open Browser

Visit: **http://localhost:3000**

### Step 5: Login

Use one of these demo accounts:

**Admin:**
```
Email: admin@techcorp.com
Password: admin123
```

**Manager:**
```
Email: sarah@techcorp.com
Password: manager123
```

**Employee:**
```
Email: john@techcorp.com
Password: employee123
```

---

## 🎯 What to Try First

### As Employee (john@techcorp.com)
1. Go to **"My Expenses"**
2. Click **"Submit Expense"**
3. Click **"Simulate OCR"** - watch fields auto-fill!
4. Fill remaining fields and submit
5. See your expense in the table

### As Manager (sarah@techcorp.com)
1. Go to **"Approvals"**
2. See pending expenses
3. Click approve/reject icon
4. Add a comment
5. Process the approval

### As Admin (admin@techcorp.com)
1. Go to **"Dashboard"** - see all stats
2. Go to **"Users"** - create a new employee
3. Go to **"Settings"** - configure approval rules
4. Try different rule types
5. Add/remove approvers

---

## 🐛 Troubleshooting

### MongoDB not running?
**Windows:**
```powershell
net start MongoDB
```

**Check if running:**
```powershell
Get-Process mongod
```

### Port 5000 already in use?
**Find and kill process:**
```powershell
netstat -ano | findstr :5000
# Note the PID number
taskkill /PID <PID> /F
```

### Port 3000 already in use?
**Find and kill process:**
```powershell
netstat -ano | findstr :3000
# Note the PID number
taskkill /PID <PID> /F
```

### Can't connect to backend from frontend?
- Check backend is running on port 5000
- Check `vite.config.js` proxy settings
- Try restarting both servers

### Database connection error?
- Verify MongoDB is running
- Check `.env` file in backend folder
- Default: `mongodb://localhost:27017/expense-management`

---

## 📋 Feature Checklist

Try these features:

- [ ] Login with different roles
- [ ] Submit an expense with OCR simulation
- [ ] Approve an expense as manager
- [ ] Reject an expense with comment
- [ ] Create a new user as admin
- [ ] Change approval rules
- [ ] Add approvers to approval chain
- [ ] View expense approval history
- [ ] Filter expenses by status
- [ ] See dashboard statistics update
- [ ] Test responsive design (resize browser)
- [ ] Test role-based navigation

---

## 🎨 UI Tour

### Color Scheme
- **Green (#00A86B)**: Primary actions, success states
- **Black (#000000)**: Sidebar, text, secondary actions
- **White (#FFFFFF)**: Backgrounds, cards

### Navigation
- **Sidebar**: Main navigation (role-based)
- **Top Bar**: Company name, user profile
- **Cards**: Elevated with hover effects
- **Tables**: Clean data display
- **Modals**: Smooth dialogs for forms

---

## 💡 Tips

1. **OCR Simulation**: Generates random merchant, amount, and date
2. **Currency Conversion**: Automatically converts to company currency
3. **Approval Workflow**: Multi-level with configurable rules
4. **Admin Powers**: Can override any approval
5. **CFO Flag**: Designated CFO can instantly approve
6. **History Tracking**: Every action is logged with comments

---

## 🎓 Learn More

- **Backend API**: See `backend/README.md`
- **Frontend Docs**: See `frontend/README.md`
- **Full Features**: See main `README.md`

---

## ✅ Success!

You now have a fully functional expense management system running!

**Next Steps:**
- Explore different user roles
- Test approval workflows
- Configure custom rules
- Add your own users

**Enjoy! 💰✨**
