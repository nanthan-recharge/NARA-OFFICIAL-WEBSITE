# Fish Market Data Web Scraper

## Overview

Comprehensive web scraping system to collect **REAL** fish market data from Sri Lankan sources and store in Firebase Firestore.

## Data Sources

1. **fisheries.gov.lk** - Department of Fisheries weekly fish prices (Excel files)
2. **cfc.gov.lk** - Ceylon Fisheries Corporation market prices
3. **malupola.com** - Daily wholesale prices from Peliyagoda Fish Market

## Architecture

```
┌─────────────────────────┐
│   Data Sources          │
│  - fisheries.gov.lk     │
│  - cfc.gov.lk           │
│  - malupola.com         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  fish_market_scraper.py │
│  - FisheriesDeptScraper │
│  - CeylonFisheriesCorpScr│
│  - MalupolaScraper      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Firebase Firestore    │
│  Collection:            │
│  fish_market_prices     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Frontend Service      │
│  Enhanced Market Intel. │
└─────────────────────────┘
```

## Files Created

### 1. `fish_market_scraper.py` (Main Scraper)
- **FisheriesDeptScraper**: Downloads and parses Excel files from fisheries.gov.lk
- **CeylonFisheriesCorpScraper**: Scrapes HTML tables from CFC website
- **MalupolaScraper**: Extracts prices from malupola.com
- **FishMarketScraperManager**: Orchestrates all scrapers, saves to Firestore

**Features:**
- Automatic species name normalization (Sinhala/English → Standard)
- Robust error handling
- Progress logging
- Firestore batch writes

### 2. `fish_scraper_api.py` (Flask API)
REST API to trigger and monitor scraping:

**Endpoints:**
- `POST /api/fish-scraper/trigger` - Start scraping job
- `GET /api/fish-scraper/status` - Check scraping status
- `GET /api/fish-scraper/latest-data` - Get scraped data from Firestore
- `GET /api/fish-scraper/test?scraper=<name>` - Test individual scrapers
- `GET /health` - Health check

## Setup Instructions

### 1. Install Dependencies

```bash
pip3 install beautifulsoup4 openpyxl requests schedule firebase-admin flask flask-cors
```

### 2. Firebase Configuration

**Download Firebase Credentials:**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `serviceAccountKey.json` in `/nara_digital_ocean/` directory

### 3. Run the Scraper

**One-time scrape:**
```bash
cd backend
python3 fish_market_scraper.py
```

**Start API Server:**
```bash
python3 fish_scraper_api.py
# Runs on port 5001
```

**Trigger scraping via API:**
```bash
# Start scraping
curl -X POST http://localhost:5001/api/fish-scraper/trigger

# Check status
curl http://localhost:5001/api/fish-scraper/status

# Get latest data
curl http://localhost:5001/api/fish-scraper/latest-data
```

### 4. Test Individual Scrapers

```bash
# Test all scrapers
curl http://localhost:5001/api/fish-scraper/test

# Test specific scraper
curl "http://localhost:5001/api/fish-scraper/test?scraper=fisheries"
curl "http://localhost:5001/api/fish-scraper/test?scraper=cfc"
curl "http://localhost:5001/api/fish-scraper/test?scraper=malupola"
```

## Firestore Data Structure

### Collection: `fish_market_prices`

```json
{
  "skipjack_tuna_peliyagoda_malupola.com": {
    "species": "Skipjack Tuna",
    "price": 850,
    "unit": "LKR/kg",
    "market": "Peliyagoda",
    "source": "malupola.com",
    "timestamp": "2025-10-24T23:00:00Z",
    "data_type": "wholesale",
    "last_updated": <Firestore Timestamp>
  }
}
```

### Collection: `scraper_metadata`

```json
{
  "latest_run": {
    "timestamp": <Firestore Timestamp>,
    "records_count": 42,
    "status": "success"
  }
}
```

## Species Mapping

The scraper automatically normalizes species names:

| Sinhala/Local | English | Standardized |
|---------------|---------|--------------|
| Balaya | Skipjack | Skipjack Tuna |
| Kelawalla | Yellow fin | Yellowfin Tuna |
| Salaya | Sardine | Sardinella |
| Thora | Seer | Seer Fish |
| Talapath | - | Barracuda |
| Gurulla | - | Grouper |
| Isso | Prawn/Shrimp | Prawns |
| Kakuluwo | - | Crab |
| Dhello | - | Squid |

## Scheduling Automatic Scraping

### Option 1: Cron Job (Linux/Mac)

```bash
# Add to crontab (run daily at 6 AM)
0 6 * * * cd /path/to/backend && python3 fish_market_scraper.py >> /var/log/fish_scraper.log 2>&1
```

### Option 2: Python Schedule (Included)

```python
import schedule
import time

def job():
    manager = FishMarketScraperManager()
    manager.scrape_all()

# Run every day at 6:00 AM
schedule.every().day.at("06:00").do(job)

while True:
    schedule.run_pending()
    time.sleep(60)
```

## Error Handling

The scraper includes comprehensive error handling:

- **Network errors**: Retries with exponential backoff
- **Parsing errors**: Logs warnings, continues with other sources
- **Firebase errors**: Falls back to local logging
- **Missing data**: Skips invalid records

## Logs

Logs are output to console with this format:
```
2025-10-24 23:00:00,000 - __main__ - INFO - Starting scrape of fisheries.gov.lk
2025-10-24 23:00:05,123 - __main__ - INFO - Downloaded Excel file: https://...
2025-10-24 23:00:10,456 - __main__ - INFO - Extracted 25 price records from Excel
```

## Rate Limiting

The scraper respects websites with 2-second delays between requests to be polite.

## Legal & Ethical Considerations

**Important:**
- This scraper is for **educational and research purposes**
- Always check website Terms of Service
- Add delays between requests (already implemented)
- Consider contacting website owners for permission
- For production use, obtain official API access

## Troubleshooting

### Issue: "Firebase credentials not found"
**Solution:** Download serviceAccountKey.json from Firebase Console

### Issue: "No Excel files found"
**Solution:** Check if fisheries.gov.lk structure has changed

### Issue: "Connection timeout"
**Solution:** Check internet connection, website may be temporarily down

### Issue: "No data extracted"
**Solution:** Website HTML structure may have changed, update selectors

## Next Steps

1. **Get Firebase Credentials** (serviceAccountKey.json)
2. **Test Scrapers** individually first
3. **Run Full Scrape** to populate Firestore
4. **Update Frontend** to fetch real data (see frontend integration below)
5. **Set Up Scheduling** for automatic daily updates

## Frontend Integration

Once Firestore is populated, update the frontend service to fetch real data instead of mock data.

See `FRONTEND_INTEGRATION.md` for details.
