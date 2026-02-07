#!/usr/bin/env python3
"""
Flask API for Fish Market Scraper
Provides endpoints to trigger scraping and check status
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import logging
from fish_market_scraper import FishMarketScraperManager
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Initialize Firebase (use existing if already initialized)
try:
    firebase_admin.get_app()
    logger.info("Using existing Firebase app")
except ValueError:
    cred_path = os.path.join(os.path.dirname(__file__), '../serviceAccountKey.json')
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase initialized")

db = firestore.client()

# Global scraper manager
scraper_manager = FishMarketScraperManager()

# Track scraping status
scraping_status = {
    'is_running': False,
    'last_run': None,
    'last_result': None
}


def run_scraper_background():
    """Run scraper in background thread"""
    global scraping_status

    try:
        scraping_status['is_running'] = True
        scraping_status['last_run'] = datetime.now().isoformat()

        logger.info("Starting background scraping job")
        results = scraper_manager.scrape_all()

        scraping_status['last_result'] = results
        scraping_status['is_running'] = False

        logger.info("Background scraping completed successfully")

    except Exception as e:
        logger.error(f"Error in background scraping: {str(e)}")
        scraping_status['is_running'] = False
        scraping_status['last_result'] = {
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }


@app.route('/api/fish-scraper/trigger', methods=['POST'])
def trigger_scrape():
    """Trigger a scraping job"""

    if scraping_status['is_running']:
        return jsonify({
            'success': False,
            'message': 'Scraping job already running',
            'status': scraping_status
        }), 409

    # Start scraping in background thread
    thread = threading.Thread(target=run_scraper_background)
    thread.daemon = True
    thread.start()

    return jsonify({
        'success': True,
        'message': 'Scraping job started',
        'status': 'running'
    })


@app.route('/api/fish-scraper/status', methods=['GET'])
def get_status():
    """Get current scraping status"""

    return jsonify({
        'success': True,
        'status': scraping_status
    })


@app.route('/api/fish-scraper/latest-data', methods=['GET'])
def get_latest_data():
    """Get latest scraped data from Firestore"""

    try:
        # Get all fish prices
        prices_ref = db.collection('fish_market_prices')
        prices = prices_ref.stream()

        data = []
        for doc in prices:
            price_data = doc.to_dict()
            price_data['id'] = doc.id
            data.append(price_data)

        # Get metadata
        meta_ref = db.collection('scraper_metadata').document('latest_run')
        meta_doc = meta_ref.get()

        metadata = meta_doc.to_dict() if meta_doc.exists else {}

        return jsonify({
            'success': True,
            'data': data,
            'metadata': metadata,
            'count': len(data)
        })

    except Exception as e:
        logger.error(f"Error fetching latest data: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/fish-scraper/test', methods=['GET'])
def test_scraper():
    """Test individual scrapers without saving to Firestore"""

    from fish_market_scraper import (
        FisheriesDeptScraper,
        CeylonFisheriesCorpScraper,
        MalupolaScraper
    )

    scraper_name = request.args.get('scraper', 'all')

    results = {}

    try:
        if scraper_name in ['all', 'fisheries']:
            logger.info("Testing Fisheries Department scraper")
            scraper = FisheriesDeptScraper()
            results['fisheries'] = scraper.scrape()

        if scraper_name in ['all', 'cfc']:
            logger.info("Testing CFC scraper")
            scraper = CeylonFisheriesCorpScraper()
            results['cfc'] = scraper.scrape()

        if scraper_name in ['all', 'malupola']:
            logger.info("Testing Malupola scraper")
            scraper = MalupolaScraper()
            results['malupola'] = scraper.scrape()

        return jsonify({
            'success': True,
            'results': results,
            'counts': {k: len(v) for k, v in results.items()}
        })

    except Exception as e:
        logger.error(f"Error in test: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Fish Market Scraper API',
        'timestamp': datetime.now().isoformat()
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    logger.info(f"Starting Fish Scraper API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
