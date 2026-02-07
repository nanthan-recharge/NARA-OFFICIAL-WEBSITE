#!/bin/bash

# 🌐 NARA Research Portal - Auto-Translation & Book Viewer Installer
# This script installs all required packages for the translation features

echo "🌐 Installing NARA Translation & Book Viewer Features..."
echo ""

# Install required packages
echo "📦 Installing packages..."
npm install @google/generative-ai react-pdf pdfjs-dist --legacy-peer-deps

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 NEXT STEPS:"
echo ""
echo "1. Get FREE Gemini API Key:"
echo "   → Visit: https://makersuite.google.com/app/apikey"
echo "   → Click 'Get API Key'"
echo "   → Copy the key"
echo ""
echo "2. Add API key to .env file:"
echo "   → Create/edit .env in project root"
echo "   → Add: VITE_GEMINI_API_KEY=your_key_here"
echo ""
echo "3. Read full guide:"
echo "   → Open: TRANSLATION-SETUP-GUIDE.md"
echo ""
echo "🎉 Ready to use auto-translation!"
echo ""
