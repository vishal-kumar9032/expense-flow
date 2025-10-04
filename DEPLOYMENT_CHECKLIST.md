# 🚀 Quick Deployment Checklist

Use this checklist to ensure smooth deployment to Vercel.

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed to GitHub
- [ ] No sensitive data in code (API keys, passwords)
- [ ] `.env` files added to `.gitignore`
- [ ] Production build tested locally (`npm run build`)

### 2. MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Free tier cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0 for Vercel)
- [ ] Connection string copied
- [ ] Test connection locally

### 3. Vercel Account
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] GitHub connected to Vercel
- [ ] Repository access granted to Vercel

---

## 🎯 Deployment Steps

### Step 1: Deploy Backend

**Option A: Vercel (Serverless)**
- [ ] Create new Vercel project
- [ ] Import GitHub repository: `vishal-kumar9032/expense-flow`
- [ ] Set root directory: `backend`
- [ ] Add environment variables:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL`
- [ ] Deploy
- [ ] Copy backend URL: `https://_____.vercel.app`
- [ ] Test API: Visit `https://_____.vercel.app/api/test`

**Option B: Render (Recommended for Express)**
- [ ] Create account at [render.com](https://render.com)
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory: `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Add all environment variables
- [ ] Deploy
- [ ] Copy backend URL: `https://_____.onrender.com`

### Step 2: Deploy Frontend

- [ ] Create new Vercel project
- [ ] Import GitHub repository: `vishal-kumar9032/expense-flow`
- [ ] Set root directory: `frontend`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL=https://YOUR_BACKEND_URL/api`
- [ ] Deploy
- [ ] Copy frontend URL: `https://_____.vercel.app`

### Step 3: Update Backend CORS

- [ ] Go to backend deployment (Vercel/Render)
- [ ] Update `FRONTEND_URL` environment variable with your frontend URL
- [ ] Redeploy backend

### Step 4: Seed Database

**Option 1: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
cd backend
vercel env pull
node scripts/seed.js
```

**Option 2: Local Connection**
- [ ] Copy production `MONGO_URI` to local `.env`
- [ ] Run: `cd backend && npm run seed`
- [ ] Remove production URI from local `.env`

---

## 🧪 Testing Checklist

Visit your deployed frontend and test:

- [ ] Website loads without errors
- [ ] Login page displays correctly
- [ ] Can log in with demo accounts:
  - [ ] Admin: admin@techcorp.com / admin123
  - [ ] Manager: sarah@techcorp.com / manager123
  - [ ] Employee: john@techcorp.com / employee123
- [ ] Dashboard loads with statistics
- [ ] Can view expenses
- [ ] Can submit new expense (Employee)
- [ ] Can approve/reject expenses (Manager/Admin)
- [ ] Can manage users (Admin)
- [ ] Can configure settings (Admin)
- [ ] All API calls work (check browser console)
- [ ] No CORS errors
- [ ] Mobile responsive design works

---

## 🔧 Environment Variables Reference

### Backend (.env in Vercel/Render)

```bash
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/expenseDB
JWT_SECRET=your-32-character-minimum-secret-key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env in Vercel)

```bash
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
- **Check**: Backend `FRONTEND_URL` matches your frontend URL
- **Check**: CORS middleware is properly configured
- **Solution**: Redeploy backend after updating environment variables

### Issue: Cannot connect to database
- **Check**: MongoDB Atlas IP whitelist includes 0.0.0.0/0
- **Check**: Database user credentials are correct
- **Check**: `MONGO_URI` format is correct
- **Solution**: Test connection string locally first

### Issue: 404 on API routes
- **Check**: `VITE_API_URL` is set correctly
- **Check**: Backend is deployed and running
- **Solution**: Visit backend URL directly to verify it's up

### Issue: Build fails
- **Check**: All dependencies in `package.json`
- **Check**: Build command is correct
- **Check**: Vercel build logs for specific errors
- **Solution**: Test build locally first

---

## 📱 Optional: Custom Domain

### Add Custom Domain (After Deployment)

1. Go to Vercel Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `expensehub.com`)
4. Update DNS records:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`
5. Wait for DNS propagation (5-30 minutes)
6. SSL certificate auto-provisioned by Vercel! ✅

---

## 🎉 Post-Deployment

After successful deployment:

- [ ] Update README.md with live URLs
- [ ] Share app with team/users
- [ ] Monitor Vercel analytics
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure backup strategy for MongoDB
- [ ] Document any custom configurations
- [ ] Create user documentation

---

## 📊 Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor bandwidth usage
- Check function invocations
- View analytics

### MongoDB Atlas
- Monitor database performance
- Check query performance
- View storage usage
- Set up alerts

---

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to `main`:

1. Make changes locally
2. Test locally: `npm run dev`
3. Commit: `git add . && git commit -m "Your message"`
4. Push: `git push origin main`
5. Vercel automatically builds and deploys! 🚀

---

## 📞 Need Help?

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **MongoDB Support**: [mongodb.com/support](https://www.mongodb.com/support)
- **Documentation**: Check `DEPLOYMENT_GUIDE.md`

---

## ✅ Deployment Complete!

**Frontend**: `https://expense-flow.vercel.app`  
**Backend**: `https://your-backend.vercel.app`

**Demo Accounts**:
- Admin: admin@techcorp.com / admin123
- Manager: sarah@techcorp.com / manager123
- Employee: john@techcorp.com / employee123

🎊 Congratulations! Your app is live! 🎊
