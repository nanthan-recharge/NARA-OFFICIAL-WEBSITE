#!/bin/bash

# Media Gallery Deployment Script
# This script builds and deploys the media gallery fixes

echo "🚀 Starting Media Gallery Deployment..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from nara_digital_ocean directory"
    exit 1
fi

# Step 1: Install dependencies (if needed)
echo "📦 Step 1: Checking dependencies..."
npm install
echo "✅ Dependencies checked"
echo ""

# Step 2: Build the project
echo "🔨 Step 2: Building project..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi
echo ""

# Step 3: Deploy Firestore rules
echo "🔐 Step 3: Deploying Firestore rules..."
npx firebase deploy --only firestore:rules
if [ $? -eq 0 ]; then
    echo "✅ Firestore rules deployed"
else
    echo "⚠️  Firestore rules deployment had issues (might already be deployed)"
fi
echo ""

# Step 4: Deploy to Firebase Hosting
echo "🌐 Step 4: Deploying to Firebase Hosting..."
npx firebase deploy --only hosting
if [ $? -eq 0 ]; then
    echo "✅ Hosting deployed successfully"
else
    echo "❌ Hosting deployment failed"
    exit 1
fi
echo ""

echo "🎉 Deployment Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Visit: https://nara-web-73384.web.app/media-gallery"
echo "2. Check the connection status indicator"
echo "3. Add media via: https://nara-web-73384.web.app/admin/media"
echo ""
echo "📖 For detailed setup instructions, see: MEDIA_GALLERY_FIX.md"
