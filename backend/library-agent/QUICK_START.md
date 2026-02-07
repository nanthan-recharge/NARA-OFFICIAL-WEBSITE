# Quick Start Guide - NARA Library Agent

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ PostgreSQL running with `nara_library` database
- ✅ Redis installed and running
- ✅ Firebase service account key in `../library-api/serviceAccountKey.json`

## 5-Minute Setup

### 1. Install Dependencies (Already Done)

```bash
cd backend/library-agent
npm install
```

### 2. Configure Environment

The `.env` file is already created. Verify these settings:

```bash
cat .env
```

Update if needed:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `REDIS_HOST`, `REDIS_PORT`
- `FIREBASE_STORAGE_BUCKET=nara-web-73384.appspot.com`

### 3. Run Database Migration

```bash
cd ../library-api
psql -U postgres -d nara_library -f migrations/003_add_agent_fields.sql
```

This adds 6 new columns to `bibliographic_records` table.

### 4. Start Redis

**Check if Redis is running:**
```bash
redis-cli ping
# Should return: PONG
```

**If not running, start it:**
```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:latest
```

### 5. Test with Small Batch

First, test with 1 book per category (26 total):

```bash
cd ../library-agent
BOOKS_PER_CATEGORY=1 npm run populate
```

This will:
- Search APIs for marine science books
- Add 26 jobs to queue (1 per category)
- Show progress bar

### 6. Start Worker

```bash
npm run worker
```

Watch the logs to see books being downloaded:
- PDF download
- Validation
- Firebase upload
- QR code generation
- Database insertion

### 7. Verify Results

**Check database:**
```bash
psql -U postgres -d nara_library -c "SELECT barcode, title, download_source FROM bibliographic_records WHERE download_source IS NOT NULL LIMIT 5;"
```

**Check Firebase Storage:**
Go to Firebase Console → Storage → `pdfs/` and `qr-codes/` folders

**Check frontend:**
Open http://localhost:3000/library and search for downloaded books

## Full Production Run

Once testing is successful, run with full settings:

```bash
# Populate queue with 10 books per category (260 total)
npm run populate

# Start worker
npm run worker
```

## Monitoring

### View Logs

```bash
# Real-time logs
tail -f logs/application-*.log

# Error logs only
tail -f logs/error-*.log
```

### Queue Status

The worker logs queue metrics every 60 seconds:
```
Queue Status: { waiting: 200, active: 5, completed: 55, failed: 0 }
```

### Database Stats

```sql
-- Count downloaded books
SELECT COUNT(*) FROM bibliographic_records WHERE download_source IS NOT NULL;

-- Books by source
SELECT download_source, COUNT(*) 
FROM bibliographic_records 
WHERE download_source IS NOT NULL 
GROUP BY download_source;

-- Books by category
SELECT mt.name, COUNT(br.id) 
FROM material_types mt
LEFT JOIN bibliographic_records br ON mt.id = br.material_type_id
WHERE br.download_source IS NOT NULL
GROUP BY mt.name
ORDER BY COUNT(br.id) DESC;
```

## Troubleshooting

### Redis Not Running

```bash
redis-cli ping
# If error, start Redis:
brew services start redis  # macOS
sudo systemctl start redis # Linux
```

### Database Connection Error

```bash
# Test connection
psql -U postgres -d nara_library -c "SELECT NOW();"

# Check .env matches library-api settings
diff .env ../library-api/.env
```

### Firebase Error

```bash
# Check service account key exists
ls -la ../library-api/serviceAccountKey.json

# Verify bucket name
grep FIREBASE_STORAGE_BUCKET .env
```

### No Books Found

Some categories may have limited free resources. Check logs for specific API errors.

## Production Deployment

### Using PM2

```bash
# Start worker with PM2
npm run pm2:start

# View logs
npm run pm2:logs

# Stop worker
npm run pm2:stop

# Restart worker
pm2 restart nara-worker
```

### Manual Deployment

1. Copy to server: `scp -r library-agent/ user@server:/path/`
2. Install deps: `npm install --production`
3. Configure `.env`
4. Run migration
5. Start: `npm run worker`

## Configuration Options

Edit `.env` to customize:

```bash
# Download more/fewer books per category
BOOKS_PER_CATEGORY=10

# Increase/decrease parallel workers
WORKER_CONCURRENCY=5

# Adjust max PDF file size
MAX_FILE_SIZE_MB=50

# Change API delay (respect rate limits)
API_DELAY_MS=2000
```

## Next Steps

1. ✅ Test with 1 book per category
2. ✅ Verify books appear in frontend
3. ✅ Check QR codes are generated
4. ✅ Run full batch (260 books)
5. ✅ Monitor for 24 hours
6. ✅ Deploy to production with PM2

## Support

- **Logs**: `backend/library-agent/logs/`
- **Documentation**: `README.md`, `INTEGRATION.md`
- **Contact**: marine-library@nara.gov.lk

## Success Criteria

After successful run, you should have:
- ✅ 260 books in database (10 per category × 26)
- ✅ All PDFs in Firebase Storage (`pdfs/` folder)
- ✅ All QR codes in Firebase Storage (`qr-codes/` folder)
- ✅ Books visible in frontend catalogue
- ✅ Books searchable
- ✅ QR codes printable from admin panel
- ✅ Zero duplicate entries

## Estimated Time

- **Setup**: 5 minutes
- **Test run (26 books)**: 10-15 minutes
- **Full run (260 books)**: 2-4 hours (depending on API speed and network)

Good luck! 🚀

