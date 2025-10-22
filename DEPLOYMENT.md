# Deployment Guide for FloatChart-AI

## 🚀 Quick Deploy to Vercel (Frontend)

### Step 1: Prepare Your Code

1. Make sure all changes are committed to Git
2. Push to your GitHub repository

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project root
cd FloatChart-AI

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set root directory to: ./
# - Build command: cd frontend && npm install && npm run build
# - Output directory: frontend/dist
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `AdithyaSM31/FloatChart-AI`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `http://localhost:8000` (temporary - update after backend deployment)
6. Click "Deploy"

### Step 3: Deploy Backend

The backend cannot be deployed on Vercel (it requires Python/FastAPI). Choose one:

#### Recommended: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Select "Deploy from GitHub"
4. Choose your repository
5. Configure:
   - **Root Directory**: `/backend`
   - **Start Command**: `uvicorn api_groq:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `DB_PASSWORD`: Your database password
   - `DB_HOST`: Your database host
   - `DB_PORT`: 5432
   - `DB_NAME`: argo_db
   - `DB_USER`: postgres
7. Add PostgreSQL database (Railway provides this)
8. Deploy!

#### Alternative: Render

1. Go to [render.com](https://render.com)
2. Create New Web Service
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r ../requirements.txt`
   - **Start Command**: `uvicorn api_groq:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway)
6. Add PostgreSQL database
7. Deploy!

### Step 4: Update Frontend with Backend URL

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update `VITE_API_URL` to your backend URL:
   - Railway: `https://your-app.railway.app`
   - Render: `https://your-app.onrender.com`
5. Redeploy frontend

### Step 5: Configure CORS

Update `backend/api_groq.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-vercel-app.vercel.app",  # Add your Vercel URL
        "https://floatchart-ai.vercel.app"     # Add custom domain if any
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 Git Commands for GitHub

```bash
# Navigate to project directory
cd "c:\Users\adith\Downloads\SIH 2025\SIH_Project-main"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - FloatChart AI with Groq integration"

# Add remote repository
git remote add origin https://github.com/AdithyaSM31/FloatChart-AI.git

# Push to GitHub
git push -u origin main

# If main branch doesn't exist, use:
git branch -M main
git push -u origin main
```

## 🔐 Important Security Notes

1. **Never commit .env file** - It's in .gitignore
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** if accidentally committed
4. **Use Vercel/Railway secrets** for production variables

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] .env.example created (without actual keys)
- [ ] .gitignore includes .env, node_modules, __pycache__
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Database deployed and connected
- [ ] Environment variables set in both platforms
- [ ] CORS configured with production URLs
- [ ] Frontend API URL updated
- [ ] Test the deployed application

## 🐛 Troubleshooting

### Frontend not connecting to backend
- Check VITE_API_URL in Vercel environment variables
- Verify CORS settings include your Vercel URL
- Check browser console for errors

### Backend deployment fails
- Verify requirements.txt includes all dependencies
- Check environment variables are set correctly
- Ensure PostgreSQL database is connected

### Database connection errors
- Verify DB_HOST, DB_PORT, DB_NAME, DB_PASSWORD
- Check database is running and accessible
- Whitelist backend IP in database settings

## 📞 Support

If you encounter issues:
1. Check deployment logs in Vercel/Railway dashboard
2. Review browser console for frontend errors
3. Check backend logs for API errors
4. Create an issue on GitHub with error details
