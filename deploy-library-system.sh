#!/bin/bash

# NARA Library Research Submission System - Complete Deployment Script
# Version: 1.0.0
# Deploys: Firestore Rules + Storage Rules + Frontend

set -e  # Exit on error

echo "🚀 NARA Library Research Submission System - Deployment"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run from project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  This will deploy the complete library system to Firebase${NC}"
echo -e "${YELLOW}   - Firestore security rules${NC}"
echo -e "${YELLOW}   - Storage security rules${NC}"
echo -e "${YELLOW}   - Frontend build${NC}"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi
echo ""

# Step 1: Install Dependencies
echo -e "${BLUE}📦 Step 1/6: Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Backup and Deploy Firestore Rules
echo -e "${BLUE}🔐 Step 2/6: Deploying Firestore security rules...${NC}"

# Backup current rules
if [ -f "firestore.rules" ]; then
    BACKUP_NAME="firestore.rules.backup.$(date +%Y%m%d_%H%M%S)"
    cp firestore.rules "$BACKUP_NAME"
    echo -e "${GREEN}✅ Backed up current rules to: $BACKUP_NAME${NC}"
fi

# Copy new rules
if [ -f "firestore.rules.new" ]; then
    cp firestore.rules.new firestore.rules
    echo -e "${GREEN}✅ Using new library system rules${NC}"
fi

# Deploy Firestore rules
firebase deploy --only firestore:rules
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Firestore rules deployment failed${NC}"
    echo -e "${RED}   Make sure you're logged in: firebase login${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Firestore rules deployed${NC}"
echo ""

# Step 3: Deploy Storage Rules
echo -e "${BLUE}📁 Step 3/6: Deploying Storage security rules...${NC}"
firebase deploy --only storage
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Storage rules deployment failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Storage rules deployed${NC}"
echo ""

# Step 4: Build Frontend
echo -e "${BLUE}🔨 Step 4/6: Building frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Step 5: Check build size
echo -e "${BLUE}📊 Step 5/6: Checking build size...${NC}"
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist | cut -f1)
    echo -e "${GREEN}✅ Build size: $BUILD_SIZE${NC}"
else
    echo -e "${YELLOW}⚠️  dist folder not found${NC}"
fi
echo ""

# Step 6: Deploy to Netlify (or Firebase Hosting)
echo -e "${BLUE}🌐 Step 6/6: Deploying frontend...${NC}"
echo ""
echo "Choose deployment method:"
echo "1) Netlify CLI (recommended)"
echo "2) Firebase Hosting"
echo "3) Skip (manual deployment)"
read -p "Enter choice (1-3): " -n 1 -r
echo ""

case $REPLY in
    1)
        echo -e "${BLUE}Deploying to Netlify...${NC}"
        if command -v netlify &> /dev/null; then
            netlify deploy --prod
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Deployed to Netlify${NC}"
            else
                echo -e "${RED}❌ Netlify deployment failed${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ Netlify CLI not installed${NC}"
            echo -e "${YELLOW}Install it with: npm install -g netlify-cli${NC}"
            exit 1
        fi
        ;;
    2)
        echo -e "${BLUE}Deploying to Firebase Hosting...${NC}"
        firebase deploy --only hosting
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Deployed to Firebase Hosting${NC}"
        else
            echo -e "${RED}❌ Firebase Hosting deployment failed${NC}"
            exit 1
        fi
        ;;
    3)
        echo -e "${YELLOW}⏭️  Skipping frontend deployment${NC}"
        echo -e "${YELLOW}   Manual steps:${NC}"
        echo -e "${YELLOW}   1. Upload dist/ folder to Netlify dashboard${NC}"
        echo -e "${YELLOW}   2. Or run: netlify deploy --prod${NC}"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac
echo ""

# Summary
echo -e "${GREEN}═════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}═════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📋 What was deployed:${NC}"
echo "   ✅ Firestore security rules (with library system)"
echo "   ✅ Storage security rules (with research uploads)"
echo "   ✅ Frontend application build"
if [[ $REPLY == "1" ]] || [[ $REPLY == "2" ]]; then
    echo "   ✅ Application deployed to hosting"
fi
echo ""
echo -e "${BLUE}🔗 Important Links:${NC}"
echo "   📊 Firebase Console: https://console.firebase.google.com/project/nara-web-73384"
echo "   🔐 Firestore Rules: https://console.firebase.google.com/project/nara-web-73384/firestore/rules"
echo "   📁 Storage Rules: https://console.firebase.google.com/project/nara-web-73384/storage/rules"
echo "   👥 Authentication: https://console.firebase.google.com/project/nara-web-73384/authentication"
echo ""
echo -e "${YELLOW}⚠️  Next Steps (IMPORTANT):${NC}"
echo "   1. Enable Email/Password authentication in Firebase Console"
echo "   2. Enable Google OAuth in Firebase Console"
echo "   3. Add authorized domains for production"
echo "   4. Test the complete flow:"
echo "      - Register at /library-register"
echo "      - Login at /library-login"
echo "      - Submit research at /library-research-submit"
echo "      - Review at /admin/library/research-review"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   - DEPLOYMENT_CHECKLIST.md - Complete verification steps"
echo "   - LIBRARY_RESEARCH_SUBMISSION.md - Feature documentation"
echo "   - ADMIN_RESEARCH_REVIEW.md - Admin guide"
echo ""
echo -e "${GREEN}✨ Your NARA Library Research System is ready!${NC}"
echo ""
