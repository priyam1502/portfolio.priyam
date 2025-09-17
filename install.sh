#!/bin/bash

echo "🌱 Installing FarmMarket MVP..."
echo "================================"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create uploads directory
mkdir -p server/uploads

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Start MongoDB: mongod"
echo "2. Start the app: ./start.sh"
echo "3. Visit: http://localhost:3000"
echo ""
echo "Demo Accounts:"
echo "Farmer  - Phone: 9876543210, Password: demo123"
echo "Buyer   - Phone: 9876543211, Password: demo123"
echo ""
echo "Happy farming! 🚜"