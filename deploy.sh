#!/bin/bash

# NARA Library System - Quick Deployment Script
# Version: 1.0.0
# Date: October 14, 2025

echo "🚀 NARA Library System - Deployment Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run from project root.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}🔨 Step 2: Building frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

echo -e "${BLUE}🔥 Step 3: Deploying to Firebase Hosting...${NC}"
firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Firebase deployment failed${NC}"
    echo -e "${RED}   Make sure you're logged in: firebase login${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend deployed to Firebase${NC}"
echo ""

echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "📊 Next Steps:"
echo "1. Deploy backend to DigitalOcean App Platform"
echo "2. Run database migrations: cd backend/library-api && npm run migrate"
echo "3. Configure environment variables"
echo "4. Test all endpoints"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo -e "${GREEN}✅ Your NARA Library System is ready!${NC}"




