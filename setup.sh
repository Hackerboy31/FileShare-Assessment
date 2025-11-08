#!/bin/bash

echo "🚀 FileShare Quick Start Script"
echo "================================"
echo ""

# Check if Node.js is installed
echo "Checking prerequisites..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo ""
echo "📦 Setup Steps:"
echo "1. Backend Setup"

# Backend setup
if [ -d "backend" ]; then
    echo "   - Installing backend dependencies..."
    cd backend
    npm install
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "   - Creating .env file..."
        cp .env.example .env
        echo "   ⚠️  Please edit backend/.env with your MongoDB URI and JWT secret"
    fi
    
    cd ..
    echo "   ✅ Backend setup complete"
else
    echo "   ❌ Backend directory not found"
fi

echo ""
echo "2. Frontend Setup"

# Frontend setup
if [ -d "frontend" ]; then
    echo "   - Installing frontend dependencies..."
    cd frontend
    npm install
    
    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        echo "   - Creating .env.local file..."
        cp .env.example .env.local
    fi
    
    cd ..
    echo "   ✅ Frontend setup complete"
else
    echo "   ❌ Frontend directory not found"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Configure backend/.env with your MongoDB URI"
echo "2. Open two terminals:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 For more information, see:"
echo "   - README.md"
echo "   - IMPLEMENTATION_GUIDE.md"
echo ""
