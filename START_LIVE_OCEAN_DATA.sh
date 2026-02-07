#!/bin/bash

# Live Ocean Data - Quick Start Script
# This script starts both the backend and provides instructions for the frontend

echo "=================================================="
echo "🌊 NARA Live Ocean Data - Quick Start"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the nara_digital_ocean directory"
    exit 1
fi

echo "📦 Step 1: Installing Backend Dependencies..."
echo ""

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python packages..."
pip install -q -r requirements.txt

echo ""
echo "✅ Backend dependencies installed!"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found in backend directory"
    echo "Please run this script again or create .env manually"
    exit 1
fi

echo "=================================================="
echo "🚀 Starting Backend Server..."
echo "=================================================="
echo ""
echo "Backend will run at: http://localhost:5000"
echo ""
echo "To test the API, open a new terminal and run:"
echo "  curl http://localhost:5000/api/health"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""
echo "=================================================="
echo ""

# Start the Flask server
python3 copernicus_flask_api.py
