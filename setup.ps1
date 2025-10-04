# ExpenseHub Setup Script
# Run this script to install dependencies for both backend and frontend

Write-Host "🚀 ExpenseHub - Full-Stack Expense Management System" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Install Backend Dependencies
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Cyan
Set-Location backend
try {
    npm install
    Write-Host "✅ Backend dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install Frontend Dependencies
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Cyan
Set-Location ..\frontend
try {
    npm install
    Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Set-Location ..

Write-Host "=================================================" -ForegroundColor Green
Write-Host "✅ Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Seed the database:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   npm run seed" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Start the backend (Terminal 1):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Start the frontend (Terminal 2):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demo Accounts:" -ForegroundColor Yellow
Write-Host "Admin:    admin@techcorp.com / admin123" -ForegroundColor White
Write-Host "Manager:  sarah@techcorp.com / manager123" -ForegroundColor White
Write-Host "Employee: john@techcorp.com / employee123" -ForegroundColor White
Write-Host ""
Write-Host "📚 Read QUICKSTART.md for detailed instructions" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
