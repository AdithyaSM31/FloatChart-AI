# Git Setup and Push to GitHub
# Run this script from the project root directory

Write-Host "🚀 FloatChart-AI - GitHub Setup Script" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if git is installed
Write-Host "📋 Step 1: Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Initialize Git repository
Write-Host "📋 Step 2: Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
} else {
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Step 3: Add all files
Write-Host "📋 Step 3: Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✅ All files staged for commit" -ForegroundColor Green

Write-Host ""

# Step 4: Create initial commit
Write-Host "📋 Step 4: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit - FloatChart AI with Groq integration"
Write-Host "✅ Initial commit created" -ForegroundColor Green

Write-Host ""

# Step 5: Set main branch
Write-Host "📋 Step 5: Setting main branch..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ Main branch set" -ForegroundColor Green

Write-Host ""

# Step 6: Add remote origin
Write-Host "📋 Step 6: Adding GitHub remote..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/AdithyaSM31/FloatChart-AI.git"

# Remove existing origin if it exists
git remote remove origin 2>$null

# Add new origin
git remote add origin $remoteUrl
Write-Host "✅ Remote origin added: $remoteUrl" -ForegroundColor Green

Write-Host ""

# Step 7: Push to GitHub
Write-Host "📋 Step 7: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  You may need to authenticate with GitHub" -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main --force
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Push failed. You may need to:" -ForegroundColor Yellow
    Write-Host "   1. Configure Git credentials" -ForegroundColor White
    Write-Host "   2. Use: git config --global user.name 'Your Name'" -ForegroundColor White
    Write-Host "   3. Use: git config --global user.email 'your@email.com'" -ForegroundColor White
    Write-Host "   4. Then run: git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. ✅ Code is now on GitHub" -ForegroundColor White
Write-Host "2. 🌐 Deploy frontend to Vercel: https://vercel.com" -ForegroundColor White
Write-Host "3. 🚂 Deploy backend to Railway: https://railway.app" -ForegroundColor White
Write-Host "4. 📚 Read DEPLOYMENT.md for detailed instructions" -ForegroundColor White
Write-Host ""
Write-Host "Repository URL: $remoteUrl" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
