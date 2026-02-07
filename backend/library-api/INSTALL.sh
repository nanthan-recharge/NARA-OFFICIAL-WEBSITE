#!/bin/bash

# NARA Library API - Installation Script
# This script will install PostgreSQL and set up the database

echo "🚀 NARA Library API - Installation Script"
echo "=========================================="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed."
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "✅ Homebrew is already installed"
fi

# Install PostgreSQL
echo ""
echo "📦 Installing PostgreSQL 14..."
brew install postgresql@14

# Start PostgreSQL service
echo ""
echo "🔄 Starting PostgreSQL service..."
brew services start postgresql@14

# Wait for PostgreSQL to start
echo "⏳ Waiting for PostgreSQL to start..."
sleep 5

# Create database
echo ""
echo "🗄️  Creating database 'nara_library'..."
createdb nara_library 2>/dev/null || echo "Database might already exist"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your Firebase credentials"
else
    echo "✅ .env file already exists"
fi

# Run migrations
echo ""
echo "🔄 Running database migrations..."
npm run migrate

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file and add your Firebase Admin SDK credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Test the API at http://localhost:5000/health"
echo ""
echo "📚 For more information, see SETUP_GUIDE.md"

