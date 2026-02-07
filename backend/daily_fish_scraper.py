#!/usr/bin/env python3
"""
Daily Fish Market Data Scraper
Runs automatically every day at 6:00 AM to fetch fresh market data
"""

import schedule
import time
from datetime import datetime
import logging
from fish_market_scraper import FishMarketScraperManager

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('fish_scraper_daily.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


def run_daily_scrape():
    """Execute daily scraping job"""
    logger.info("="*80)
    logger.info("DAILY FISH MARKET SCRAPING - STARTED")
    logger.info(f"Timestamp: {datetime.now().isoformat()}")
    logger.info("="*80)

    try:
        manager = FishMarketScraperManager()
        results = manager.scrape_all()

        logger.info("="*80)
        logger.info("DAILY SCRAPING - COMPLETED SUCCESSFULLY")
        logger.info(f"Total records: {results['total_records']}")
        logger.info(f"Success rate: {results['scrapers_success']}/{results['scrapers_run']}")
        logger.info(f"By source: {results['by_source']}")
        logger.info("="*80)

    except Exception as e:
        logger.error("="*80)
        logger.error(f"DAILY SCRAPING - FAILED")
        logger.error(f"Error: {str(e)}")
        logger.error("="*80)


def main():
    """Main scheduler loop"""
    logger.info("🚀 Fish Market Daily Scraper - STARTED")
    logger.info("📅 Schedule: Every day at 6:00 AM")
    logger.info("💾 Logs saved to: fish_scraper_daily.log")
    logger.info("="*80)

    # Schedule the job for 6:00 AM daily
    schedule.every().day.at("06:00").do(run_daily_scrape)

    # Also run immediately on startup (optional - comment out if not needed)
    logger.info("Running initial scrape now...")
    run_daily_scrape()

    # Keep the script running
    logger.info("\n⏰ Scheduler is running. Press Ctrl+C to stop.\n")

    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        logger.info("\n\n🛑 Scheduler stopped by user")
    except Exception as e:
        logger.error(f"\n\n❌ Scheduler crashed: {str(e)}")
