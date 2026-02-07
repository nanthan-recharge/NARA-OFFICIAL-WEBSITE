#!/bin/bash

# WCAG 2.2 AA Accessibility Audit Script for NARA Digital Ocean
# This script checks for common accessibility issues

echo "🔍 NARA Accessibility Audit - WCAG 2.2 AA"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Initialize counters
ISSUES=0
WARNINGS=0
PASSED=0

echo "1️⃣  Checking for images without alt text..."
MISSING_ALT=$(grep -r '<img' src/ | grep -v 'alt=' | grep -v 'node_modules' | wc -l | tr -d ' ')
if [ "$MISSING_ALT" -gt 0 ]; then
    echo -e "${RED}❌ Found $MISSING_ALT images without alt text${NC}"
    ((ISSUES++))
    echo "   Run: grep -rn '<img' src/ | grep -v 'alt=' to see locations"
else
    echo -e "${GREEN}✅ All images have alt attributes${NC}"
    ((PASSED++))
fi
echo ""

echo "2️⃣  Checking for buttons without accessible labels..."
MISSING_ARIA=$(grep -r '<button' src/ | grep -v 'aria-label' | grep -v 'node_modules' | grep -v '>' | wc -l | tr -d ' ')
if [ "$MISSING_ARIA" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $MISSING_ARIA buttons that may need aria-label${NC}"
    ((WARNINGS++))
    echo "   (Some may have text content, manual review needed)"
else
    echo -e "${GREEN}✅ Button labels look good${NC}"
    ((PASSED++))
fi
echo ""

echo "3️⃣  Checking for proper HTML lang attribute..."
if grep -q 'lang=' index.html; then
    echo -e "${GREEN}✅ HTML lang attribute found${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Missing lang attribute in index.html${NC}"
    echo "   Add: <html lang=\"en\">"
    ((ISSUES++))
fi
echo ""

echo "4️⃣  Checking for semantic HTML landmarks..."
MAIN_COUNT=$(grep -r '<main' src/ | wc -l | tr -d ' ')
NAV_COUNT=$(grep -r '<nav' src/ | wc -l | tr -d ' ')
HEADER_COUNT=$(grep -r '<header' src/ | wc -l | tr -d ' ')
FOOTER_COUNT=$(grep -r '<footer' src/ | wc -l | tr -d ' ')

echo "   <main> tags: $MAIN_COUNT"
echo "   <nav> tags: $NAV_COUNT"
echo "   <header> tags: $HEADER_COUNT"
echo "   <footer> tags: $FOOTER_COUNT"

if [ "$MAIN_COUNT" -gt 0 ] && [ "$NAV_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Semantic landmarks found${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  May need more semantic HTML landmarks${NC}"
    ((WARNINGS++))
fi
echo ""

echo "5️⃣  Checking for skip links..."
if grep -rq 'skip.*content\|Skip.*Content' src/; then
    echo -e "${GREEN}✅ Skip link implementation found${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ No skip link found${NC}"
    ((ISSUES++))
fi
echo ""

echo "6️⃣  Checking for ARIA live regions..."
ARIA_LIVE=$(grep -r 'aria-live\|role="alert"\|role="status"' src/ | wc -l | tr -d ' ')
if [ "$ARIA_LIVE" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $ARIA_LIVE ARIA live regions${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  No ARIA live regions found (may need for dynamic content)${NC}"
    ((WARNINGS++))
fi
echo ""

echo "7️⃣  Checking for form labels..."
INPUT_COUNT=$(grep -r '<input' src/ | wc -l | tr -d ' ')
LABEL_COUNT=$(grep -r '<label' src/ | wc -l | tr -d ' ')
echo "   Inputs: $INPUT_COUNT"
echo "   Labels: $LABEL_COUNT"
if [ "$LABEL_COUNT" -ge "$((INPUT_COUNT / 2))" ]; then
    echo -e "${GREEN}✅ Good label-to-input ratio${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  May have unlabeled form inputs${NC}"
    ((WARNINGS++))
fi
echo ""

echo "8️⃣  Checking for video/audio captions..."
VIDEO_COUNT=$(grep -r '<video' src/ | wc -l | tr -d ' ')
TRACK_COUNT=$(grep -r '<track' src/ | wc -l | tr -d ' ')
if [ "$VIDEO_COUNT" -gt 0 ]; then
    if [ "$TRACK_COUNT" -ge "$VIDEO_COUNT" ]; then
        echo -e "${GREEN}✅ Videos have caption tracks${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ Videos found without caption tracks${NC}"
        ((ISSUES++))
    fi
else
    echo -e "${GREEN}✅ No videos found (captions not needed)${NC}"
    ((PASSED++))
fi
echo ""

echo "9️⃣  Checking for focus management..."
if grep -rq ':focus\|focus-visible' src/styles/; then
    echo -e "${GREEN}✅ Focus styles defined${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ No focus styles found${NC}"
    ((ISSUES++))
fi
echo ""

echo "🔟 Checking for color contrast issues (basic)..."
if grep -rq 'bg-gray-200.*text-gray-300\|bg-white.*text-gray-100' src/; then
    echo -e "${YELLOW}⚠️  Potential low contrast combinations found${NC}"
    echo "   Manual contrast check recommended"
    ((WARNINGS++))
else
    echo -e "${GREEN}✅ No obvious contrast issues detected${NC}"
    ((PASSED++))
fi
echo ""

# Summary
echo "=========================================="
echo "📊 AUDIT SUMMARY"
echo "=========================================="
echo -e "${RED}❌ Critical Issues: $ISSUES${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo -e "${GREEN}✅ Passed Checks: $PASSED${NC}"
echo ""

TOTAL=$((ISSUES + WARNINGS + PASSED))
SCORE=$(( (PASSED * 100) / TOTAL ))
echo "Overall Score: $SCORE% ($PASSED/$TOTAL checks passed)"
echo ""

if [ "$ISSUES" -eq 0 ]; then
    echo -e "${GREEN}🎉 No critical accessibility issues found!${NC}"
    echo "   Continue with manual testing and browser tools."
else
    echo -e "${RED}⚠️  $ISSUES critical issues need immediate attention${NC}"
    echo "   Review WCAG_22_AA_CHECKLIST.md for detailed fixes"
fi

echo ""
echo "Next steps:"
echo "1. Run Lighthouse accessibility audit in Chrome DevTools"
echo "2. Install and run axe DevTools browser extension"
echo "3. Test keyboard navigation manually"
echo "4. Test with screen reader (VoiceOver on macOS)"
echo ""
echo "Documentation: See WCAG_22_AA_CHECKLIST.md"
echo ""
