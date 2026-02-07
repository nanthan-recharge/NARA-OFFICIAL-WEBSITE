#!/bin/bash

# NARA PWA Setup Script
# This script helps you set up the PWA features for the NARA platform

echo "🚀 NARA PWA Setup Script"
echo "=========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found package.json"

# Create necessary directories
echo ""
echo "📁 Creating directories..."

mkdir -p public/icons
mkdir -p public/splash
mkdir -p public/screenshots
mkdir -p src/components/pwa
mkdir -p src/utils

echo -e "${GREEN}✓${NC} Directories created"

# Check if PWA files exist
echo ""
echo "📄 Checking PWA files..."

files_to_check=(
    "public/service-worker.js"
    "public/offline.html"
    "public/manifest.json"
    "src/utils/pwa.js"
    "src/components/pwa/PWAComponents.jsx"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo ""
    echo -e "${YELLOW}⚠ Some PWA files are missing. Please refer to PWA_MOBILE_OPTIMIZATION_COMPLETE.md${NC}"
fi

# Check for icons
echo ""
echo "🎨 Checking for app icons..."

icon_sizes=(72 96 128 144 152 192 384 512)
icons_exist=0

for size in "${icon_sizes[@]}"; do
    if [ -f "public/icons/icon-${size}x${size}.png" ]; then
        icons_exist=$((icons_exist + 1))
        echo -e "${GREEN}✓${NC} icon-${size}x${size}.png exists"
    else
        echo -e "${YELLOW}⚠${NC} icon-${size}x${size}.png missing"
    fi
done

if [ $icons_exist -eq 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠ No app icons found!${NC}"
    echo "You need to generate app icons. Options:"
    echo "  1. Use https://www.pwabuilder.com/imageGenerator"
    echo "  2. Run: npm install -g pwa-asset-generator"
    echo "     Then: pwa-asset-generator public/logo.png public/icons --icon-only"
    echo ""
    read -p "Do you want to install pwa-asset-generator now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing pwa-asset-generator..."
        npm install --save-dev pwa-asset-generator
        echo -e "${GREEN}✓${NC} Installed pwa-asset-generator"
        echo ""
        echo "To generate icons, run:"
        echo "  npx pwa-asset-generator public/your-logo.png public/icons --icon-only"
        echo "  npx pwa-asset-generator public/your-logo.png public/splash --splash-only --background '#0066CC'"
    fi
fi

# Check if index.html is PWA-ready
echo ""
echo "📝 Checking index.html..."

if grep -q "service-worker.js" index.html; then
    echo -e "${GREEN}✓${NC} index.html appears to be PWA-ready"
else
    echo -e "${YELLOW}⚠${NC} index.html may need PWA meta tags"
    echo "   Check PWA_MOBILE_OPTIMIZATION_COMPLETE.md for the enhanced HTML"
fi

# Check if HTTPS is configured
echo ""
echo "🔒 Checking HTTPS configuration..."

if [ -f "netlify.toml" ] || [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} Deployment config found (HTTPS should be enabled)"
else
    echo -e "${YELLOW}⚠${NC} No deployment config found"
    echo "   Remember: PWAs require HTTPS in production"
fi

# Summary
echo ""
echo "📊 Setup Summary"
echo "================"
echo ""

if [ "$all_files_exist" = true ] && [ $icons_exist -gt 0 ]; then
    echo -e "${GREEN}✓${NC} PWA files are in place"
    echo -e "${GREEN}✓${NC} App icons exist"
    echo ""
    echo -e "${GREEN}🎉 Your PWA setup is complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Integrate PWA components into your app (see PWA_MOBILE_OPTIMIZATION_COMPLETE.md)"
    echo "  2. Build: npm run build"
    echo "  3. Test: npm run serve"
    echo "  4. Deploy to production with HTTPS"
else
    echo -e "${YELLOW}⚠ PWA setup is incomplete${NC}"
    echo ""
    echo "Next steps:"
    if [ "$all_files_exist" = false ]; then
        echo "  1. Ensure all PWA files are in place"
    fi
    if [ $icons_exist -eq 0 ]; then
        echo "  2. Generate app icons"
    fi
    echo "  3. See PWA_MOBILE_OPTIMIZATION_COMPLETE.md for detailed instructions"
fi

echo ""
echo "📚 Documentation:"
echo "   - PWA_MOBILE_OPTIMIZATION_COMPLETE.md - Complete guide"
echo "   - public/service-worker.js - Service worker implementation"
echo "   - src/utils/pwa.js - PWA utilities"
echo "   - src/components/pwa/PWAComponents.jsx - UI components"
echo ""
echo "✨ Happy coding!"
