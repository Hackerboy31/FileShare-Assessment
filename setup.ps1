# Quick Start Script for FileShare

Write-Host "🚀 FileShare Quick Start Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if MongoDB is needed
Write-Host ""
Write-Host "📦 Setup Steps:" -ForegroundColor Cyan
Write-Host "1. Backend Setup" -ForegroundColor Yellow

# Backend setup
if (Test-Path "backend") {
    Write-Host "   - Installing backend dependencies..." -ForegroundColor Gray
    Set-Location backend
    npm install
    
    # Create .env if it doesn't exist
    if (-not (Test-Path ".env")) {
        Write-Host "   - Creating .env file..." -ForegroundColor Gray
        Copy-Item ".env.example" ".env"
        Write-Host "   ⚠️  Please edit backend/.env with your MongoDB URI and JWT secret" -ForegroundColor Yellow
    }
    
    Set-Location ..
    Write-Host "   ✅ Backend setup complete" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend directory not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Frontend Setup" -ForegroundColor Yellow

# Frontend setup
if (Test-Path "frontend") {
    Write-Host "   - Installing frontend dependencies..." -ForegroundColor Gray
    Set-Location frontend
    npm install
    
    # Create .env.local if it doesn't exist
    if (-not (Test-Path ".env.local")) {
        Write-Host "   - Creating .env.local file..." -ForegroundColor Gray
        Copy-Item ".env.example" ".env.local"
    }
    
    Set-Location ..
    Write-Host "   ✅ Frontend setup complete" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend directory not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Configure backend/.env with your MongoDB URI" -ForegroundColor White
Write-Host "2. Open two terminals:" -ForegroundColor White
Write-Host "   Terminal 1: cd backend && npm run dev" -ForegroundColor Gray
Write-Host "   Terminal 2: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Access the application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 For more information, see:" -ForegroundColor Cyan
Write-Host "   - README.md" -ForegroundColor Gray
Write-Host "   - IMPLEMENTATION_GUIDE.md" -ForegroundColor Gray
Write-Host ""
