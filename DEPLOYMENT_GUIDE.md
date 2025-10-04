# 🚀 Deploying ExpenseHub to Vercel

This guide will walk you through deploying your full-stack Expense Management System to Vercel.

## 📋 Prerequisites

1. **GitHub Account** - Your code is already on GitHub ✅
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account** - For cloud database (free tier available)

## 🗂️ Project Structure

```
expense-flow/
├── backend/          # Express API (will deploy separately)
├── frontend/         # React + Vite (main Vercel deployment)
└── vercel.json      # Vercel configuration
```

---

## 📦 Part 1: Deploy Frontend to Vercel

### Step 1: Prepare Frontend for Deployment

The frontend is already configured with Vite. We just need to update the API URL for production.

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository: `vishal-kumar9032/expense-flow`
4. Select **"expense-flow"** repository

### Step 3: Configure Build Settings

In the Vercel project settings:

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

(We'll get the backend URL in Part 2)

### Step 5: Deploy

Click **"Deploy"** and wait for the build to complete!

Your frontend will be available at: `https://expense-flow.vercel.app`

---

## 🖥️ Part 2: Deploy Backend to Vercel

### Option A: Deploy Backend on Vercel (Serverless Functions)

Vercel supports Node.js serverless functions, but your current backend needs to be adapted.

#### Create `vercel.json` in backend folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### Deploy Backend:

1. Create a **new Vercel project** for backend
2. Import the same GitHub repository
3. Set **Root Directory**: `backend`
4. Deploy

### Option B: Deploy Backend on Render (Recommended)

Render is better suited for Express servers:

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables (see below)
6. Deploy

---

## 🗄️ Part 3: Set Up MongoDB Atlas

### Step 1: Create MongoDB Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a **Free Tier Cluster** (M0)
4. Choose a cloud provider and region (close to your users)

### Step 2: Configure Database Access

1. Go to **Database Access**
2. Add new database user:
   - Username: `expense-admin`
   - Password: Generate strong password
   - Database User Privileges: **Read and write to any database**

### Step 3: Configure Network Access

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For production, restrict to your backend's IP

### Step 4: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://expense-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

---

## 🔐 Part 4: Environment Variables

### Backend Environment Variables

Add these to your backend deployment (Vercel/Render):

```env
# MongoDB
MONGO_URI=mongodb+srv://expense-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/expenseDB?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=5000
NODE_ENV=production

# CORS (your frontend URL)
FRONTEND_URL=https://expense-flow.vercel.app
```

### Frontend Environment Variables

Add these to your Vercel frontend project:

```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

Or if using Render:
```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

---

## 🔧 Part 5: Update Code for Production

### Update `backend/server.js` - CORS Configuration

Make sure CORS allows your frontend domain:

```javascript
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Update `frontend/src/api.js` - Dynamic API URL

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## 📝 Part 6: Seed Production Database

After backend is deployed, seed the database:

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Run seed script
vercel env pull
cd backend
node scripts/seed.js
```

### Option 2: Temporary Local Connection

1. Copy production `MONGO_URI` to local `.env`
2. Run: `npm run seed`
3. Remove production URI from local `.env`

---

## ✅ Part 7: Verify Deployment

### Test Backend API

Visit: `https://your-backend-url.vercel.app/api/test`

You should see a success message.

### Test Frontend

1. Visit: `https://expense-flow.vercel.app`
2. Try logging in with demo accounts:
   - **Admin**: admin@techcorp.com / admin123
   - **Manager**: sarah@techcorp.com / manager123
   - **Employee**: john@techcorp.com / employee123

---

## 🔄 Part 8: Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit: `git commit -am "Update feature"`
3. Push: `git push origin main`
4. Vercel automatically rebuilds and deploys! 🎉

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Solution**: Check backend CORS configuration and ensure `FRONTEND_URL` environment variable is set correctly.

### Issue: Database Connection Failed

**Solution**: 
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check `MONGO_URI` environment variable is correct
- Ensure database user has correct permissions

### Issue: 404 on API Routes

**Solution**: 
- Check `VITE_API_URL` is set correctly in frontend
- Verify backend routes are working: visit `/api/test`

### Issue: Build Failed

**Solution**:
- Check build logs in Vercel dashboard
- Verify `package.json` has correct dependencies
- Clear cache and rebuild

---

## 📊 Performance Optimization

### Enable Caching

Add to `vercel.json` in frontend:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Enable Compression

Vercel automatically compresses assets, but ensure your backend also uses compression:

```javascript
const compression = require('compression');
app.use(compression());
```

---

## 🔒 Security Checklist

- ✅ Use strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- ✅ Enable HTTPS only (Vercel does this automatically)
- ✅ Set secure cookie flags in production
- ✅ Restrict MongoDB Atlas IP access
- ✅ Use environment variables for secrets
- ✅ Enable rate limiting on backend
- ✅ Validate all user inputs
- ✅ Keep dependencies updated

---

## 📱 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `expensehub.com`)
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned! 🎉

---

## 💰 Cost Estimation

### Free Tier (Hobby Plan)

- **Vercel Frontend**: Free (100GB bandwidth/month)
- **Vercel/Render Backend**: Free (750 hours/month on Render)
- **MongoDB Atlas**: Free (512MB storage)

**Total**: $0/month for small projects! 🎉

### Paid Plans (If Needed)

- **Vercel Pro**: $20/month (more bandwidth, analytics)
- **Render Standard**: $7/month (better performance)
- **MongoDB Atlas M10**: $57/month (dedicated cluster)

---

## 🎯 Quick Deploy Commands

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy frontend
cd frontend
vercel --prod

# Deploy backend
cd ../backend
vercel --prod
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Render Deployment Guide](https://render.com/docs)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

---

## 🎉 Congratulations!

Your Expense Management System is now live on the internet! 🚀

**Share your app**:
- Frontend: `https://expense-flow.vercel.app`
- Backend: `https://your-backend-url.vercel.app`

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Check MongoDB Atlas monitoring
4. Verify all environment variables are set

Happy Deploying! 🎊
