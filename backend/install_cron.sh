#!/bin/bash
#
# Fish Market Scraper - Cron Job Installation Script
# This script installs a cron job to run the scraper daily at 6:00 AM
#

echo "=================================================="
echo "Fish Market Scraper - Cron Job Installer"
echo "=================================================="
echo ""

# Get the absolute path to the backend directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRAPER_PATH="${SCRIPT_DIR}/fish_market_scraper.py"
LOG_PATH="${SCRIPT_DIR}/fish_scraper_cron.log"

echo "📂 Backend directory: ${SCRIPT_DIR}"
echo "🐍 Scraper script: ${SCRAPER_PATH}"
echo "📝 Log file: ${LOG_PATH}"
echo ""

# Check if scraper exists
if [ ! -f "$SCRAPER_PATH" ]; then
    echo "❌ Error: Scraper not found at ${SCRAPER_PATH}"
    exit 1
fi

echo "✅ Scraper found"
echo ""

# Create the cron job command
CRON_CMD="0 6 * * * cd ${SCRIPT_DIR} && /usr/bin/python3 ${SCRAPER_PATH} >> ${LOG_PATH} 2>&1"

echo "📋 Cron job to be installed:"
echo "   ${CRON_CMD}"
echo ""
echo "⏰ Schedule: Daily at 6:00 AM"
echo ""

# Ask for confirmation
read -p "Do you want to install this cron job? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Check if cron job already exists
    if crontab -l 2>/dev/null | grep -q "fish_market_scraper.py"; then
        echo "⚠️  Cron job already exists. Removing old version..."
        crontab -l 2>/dev/null | grep -v "fish_market_scraper.py" | crontab -
    fi

    # Add the new cron job
    (crontab -l 2>/dev/null; echo "${CRON_CMD}") | crontab -

    echo ""
    echo "=================================================="
    echo "✅ Cron job installed successfully!"
    echo "=================================================="
    echo ""
    echo "📅 The scraper will run daily at 6:00 AM"
    echo "📝 Logs will be saved to: ${LOG_PATH}"
    echo ""
    echo "To view your cron jobs:"
    echo "   crontab -l"
    echo ""
    echo "To remove this cron job:"
    echo "   crontab -e"
    echo "   (then delete the line containing 'fish_market_scraper.py')"
    echo ""
else
    echo ""
    echo "❌ Installation cancelled"
fi
