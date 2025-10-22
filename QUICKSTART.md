# 🚀 Quick Start - Push to GitHub & Deploy

## Step 1: Push to GitHub (5 minutes)

### Option A: Using PowerShell Script (Easiest)
```powershell
# Run from project root
cd "c:\Users\adith\Downloads\SIH 2025\SIH_Project-main"
.\setup-github.ps1
```

### Option B: Manual Commands
```bash
cd "c:\Users\adith\Downloads\SIH 2025\SIH_Project-main"

# Configure Git (first time only)
git config --global user.name "Adithya SM"
git config --global user.email "your-email@example.com"

# Initialize and push
git init
git add .
git commit -m "Initial commit - FloatChart AI"
git branch -M main
git remote add origin https://github.com/AdithyaSM31/FloatChart-AI.git
git push -u origin main
```

## Step 2: Deploy Frontend to Vercel (3 minutes)

1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project"
3. Select `AdithyaSM31/FloatChart-AI` repository
4. Configure:
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `http://localhost:8000` (temporary)
6. Click "Deploy"
7. Wait 2-3 minutes for deployment
8. Your frontend is live! 🎉

## Step 3: Deploy Backend to Railway (5 minutes)

1. Go to https://railway.app and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub"
3. Select `AdithyaSM31/FloatChart-AI`
4. Click "Add variables" and add:
   ```
   GROQ_API_KEY = your_groq_api_key_here
   DB_PASSWORD = your_database_password
   DB_USER = postgres
   DB_NAME = argo_db
   PORT = 8000
   ```
5. Add PostgreSQL database:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-configure DB_HOST, DB_PORT
6. Configure deployment:
   - **Root Directory**: `/backend`
   - **Start Command**: `uvicorn api_groq:app --host 0.0.0.0 --port $PORT`
7. Click "Deploy"
8. Copy your backend URL (e.g., `https://your-app.railway.app`)

## Step 4: Connect Frontend to Backend (2 minutes)

1. Go back to Vercel Dashboard
2. Select your FloatChart-AI project
3. Go to Settings → Environment Variables
4. Edit `VITE_API_URL`:
   - Change from `http://localhost:8000`
   - To your Railway URL: `https://your-app.railway.app`
5. Go to Deployments → Redeploy latest deployment
6. Wait 1-2 minutes

## Step 5: Test Your Deployed App! 🎉

1. Visit your Vercel URL (e.g., `https://floatchart-ai.vercel.app`)
2. Click on "Chat"
3. Ask: "What is the deepest ocean measurement?"
4. You should get AI-powered response with real data!

## 🔧 Troubleshooting

### Frontend can't connect to backend
- Check if Railway backend is running (green status)
- Verify VITE_API_URL matches your Railway URL
- Check browser console for CORS errors

### Backend deployment failed
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure PostgreSQL database is created

### Database not connecting
- Check if PostgreSQL service is running on Railway
- Verify DB connection environment variables
- Check Railway logs for connection errors

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway
- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] Frontend connected to backend
- [ ] Chat feature working with real AI responses

## 🎯 What You Get

✅ **Frontend**: Fast, beautiful UI hosted on Vercel's global CDN
✅ **Backend**: Groq-powered AI API on Railway
✅ **Database**: PostgreSQL with 1.3M+ ocean records
✅ **Custom Domain**: You can add your own domain in Vercel
✅ **Auto-Deploy**: Every GitHub push auto-deploys to Vercel

## 📞 Need Help?

- Check DEPLOYMENT.md for detailed instructions
- Review Railway/Vercel logs for errors
- Create an issue on GitHub
- Contact: Your email

---

**Estimated Total Time**: 15-20 minutes
**Cost**: $0 (Free tiers on Vercel & Railway)
