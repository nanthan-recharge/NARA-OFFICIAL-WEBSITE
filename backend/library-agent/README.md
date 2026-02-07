# NARA Library Background Agent

Automated book download and cataloging system for NARA (National Aquatic Resources Research and Development Agency) library system in Sri Lanka.

## Features

- ✅ Automatic book discovery from multiple free APIs (CORE, Internet Archive, DOAJ, Open Library)
- ✅ Downloads 10 books per category × 26 categories = 260 total books
- ✅ PDF validation and integrity checking
- ✅ Firebase Cloud Storage integration for PDFs
- ✅ PostgreSQL database integration with existing library system
- ✅ Automatic QR code generation for each book
- ✅ BullMQ job queue with Redis
- ✅ Retry logic with exponential backoff
- ✅ Progress tracking and monitoring
- ✅ Comprehensive error handling and logging
- ✅ Production-ready deployment with PM2

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (existing NARA library database)
- Redis 6.0+
- Firebase project with Storage enabled
- Firebase service account key (shared with library-api)

## Installation

### 1. Install Dependencies

```bash
cd backend/library-agent
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

Required environment variables:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - PostgreSQL connection
- `REDIS_HOST`, `REDIS_PORT` - Redis connection
- `FIREBASE_STORAGE_BUCKET` - Firebase storage bucket name

### 3. Run Database Migration

```bash
cd ../library-api
psql -U postgres -d nara_library -f migrations/003_add_agent_fields.sql
```

This adds required columns to the `bibliographic_records` table:
- `url` - Firebase Storage PDF URL
- `download_source` - Source API name
- `source_url` - Original source URL
- `file_hash` - SHA-256 hash for integrity
- `page_count` - Number of pages
- `qr_code_url` - QR code image URL

### 4. Install and Start Redis

**macOS (Homebrew):**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Docker:**
```bash
docker run -d -p 6379:6379 redis:latest
```

## Usage

### Populate Job Queue

Search for books and add download jobs to the queue:

```bash
npm run populate
```

This will:
1. Search multiple APIs for marine science books
2. Find 10 books per category (26 categories)
3. Add ~260 jobs to the Redis queue
4. Display progress bar

### Start Worker

Process the download jobs:

```bash
npm run worker
```

For development with auto-reload:
```bash
npm run worker:dev
```

The worker will:
1. Download PDFs from source URLs
2. Validate PDF files
3. Upload to Firebase Storage
4. Generate QR codes
5. Save records to PostgreSQL database
6. Log progress and errors

### Monitor Progress

Check logs:
```bash
tail -f logs/application-*.log
```

Queue metrics are logged every 60 seconds showing:
- Waiting jobs
- Active jobs
- Completed jobs
- Failed jobs

## 26 NARA Categories

1. Acts
2. Atapattu Collection
3. BOBP Reports
4. CDs
5. Digital Map
6. Electronic Books
7. FAO Reports
8. IOC Reports
9. IWMI Reports
10. Journal
11. Lending Book
12. Maps
13. Newspaper Articles
14. Permanent Reference
15. Proceedings
16. Prof. Upali Amarasinghe Collection
17. Reference Book
18. Research Papers
19. Research Reports - NARA
20. Special Reference
21. Sri Lanka Collection - Books
22. Sri Lanka Collection - Reports
23. Thesis
24. World Fisheries Collection
25. e-Journal Articles
26. e-Reports

## Data Sources

- **CORE API**: 200M+ academic papers
- **Internet Archive**: Broadest coverage of books and reports
- **DOAJ**: Open access journals
- **Open Library**: Book metadata with Internet Archive links

## Configuration

Edit `.env` to customize:

```bash
# Worker settings
WORKER_CONCURRENCY=5          # Parallel downloads (default: 5)
BOOKS_PER_CATEGORY=10         # Books per category (default: 10)
MAX_FILE_SIZE_MB=50           # Max PDF size (default: 50MB)

# API settings
API_DELAY_MS=2000             # Delay between API calls (default: 2s)
REQUEST_TIMEOUT=30000         # Request timeout (default: 30s)

# Retry settings
MAX_RETRIES=3                 # Max retry attempts (default: 3)
RETRY_DELAY=5000              # Base retry delay (default: 5s)
```

## Production Deployment

### Using PM2

Start worker with PM2:
```bash
npm run pm2:start
```

View logs:
```bash
npm run pm2:logs
```

Stop worker:
```bash
npm run pm2:stop
```

### Manual Deployment

1. Install Redis on server
2. Copy library-agent directory to server
3. Install dependencies: `npm install --production`
4. Configure `.env` with production credentials
5. Run migration: `psql -f ../library-api/migrations/003_add_agent_fields.sql`
6. Start with PM2: `pm2 start ecosystem.config.js`

## Integration with Existing System

### Database Integration

The agent writes directly to the existing `bibliographic_records` table. Downloaded books:
- Appear immediately in the library catalogue
- Are searchable via the frontend
- Have QR codes that work with the admin panel
- Include all standard bibliographic fields

### Firebase Storage

PDFs are stored at: `pdfs/{category}/{barcode}-{title}.pdf`
QR codes are stored at: `qr-codes/{barcode}.png`

Both use signed URLs (7-day expiration) stored in the database.

### Frontend Integration

Downloaded books are automatically visible at:
- `/library` - Main catalogue
- `/library/item/:id` - Item details
- `/admin/library/cataloguing` - Admin panel

## Troubleshooting

### Redis Connection Error

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis if not running
brew services start redis  # macOS
sudo systemctl start redis # Linux
```

### Database Connection Error

```bash
# Test PostgreSQL connection
psql -U postgres -d nara_library -c "SELECT NOW();"

# Check .env credentials match library-api
```

### Firebase Error

Ensure `serviceAccountKey.json` exists in `../library-api/` directory.

### No Books Found

Some categories may have limited free resources. Check logs for API errors.

## Monitoring

### Queue Status

```bash
# Connect to Redis CLI
redis-cli

# Check queue length
LLEN bull:bookDownloads:wait

# Check active jobs
LLEN bull:bookDownloads:active
```

### Database Status

```sql
-- Count books by source
SELECT download_source, COUNT(*) 
FROM bibliographic_records 
WHERE download_source IS NOT NULL 
GROUP BY download_source;

-- Count books by category
SELECT mt.name, COUNT(br.id) 
FROM material_types mt
LEFT JOIN bibliographic_records br ON mt.id = br.material_type_id
GROUP BY mt.name
ORDER BY mt.name;
```

### Firebase Storage

Check Firebase Console → Storage to view uploaded PDFs and QR codes.

## Architecture

```
┌─────────────┐     ┌──────────┐     ┌─────────────┐
│  API Search │────▶│  BullMQ  │────▶│   Workers   │
│   Service   │     │  Queue   │     │ (5 parallel)│
└─────────────┘     └──────────┘     └─────────────┘
                                            │
                         ┌──────────────────┴──────────────────┐
                         ▼                                     ▼
                  ┌─────────────┐                      ┌─────────────┐
                  │   Firebase  │                      │ PostgreSQL  │
                  │   Storage   │                      │  Database   │
                  └─────────────┘                      └─────────────┘
```

## License

MIT

## Support

For issues or questions: marine-library@nara.gov.lk

