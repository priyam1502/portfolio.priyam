#!/bin/bash

echo "🌱 Starting FarmMarket MVP..."
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (for local setup)
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   mongod"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
fi

# Create demo data
echo "🧪 Setting up demo data..."
sleep 2
curl -s http://localhost:5000/api/demo-data > /dev/null 2>&1 &

# Start the application
echo "🚀 Starting the application..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Demo Accounts:"
echo "Farmer  - Phone: 9876543210, Password: demo123"
echo "Buyer   - Phone: 9876543211, Password: demo123"
echo ""
echo "Press Ctrl+C to stop the application"
echo "================================"

npm run dev