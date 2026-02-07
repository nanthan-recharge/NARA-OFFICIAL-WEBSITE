# NARA Library Translation Agent - User Guide

## Overview
The NARA Library Translation Agent automatically translates English PDFs to Tamil and Sinhala using Google Gemini AI. It runs as a background service twice daily and can also be run manually.

## Current Status
- **70 books translated** (35 Tamil + 35 Sinhala)
- **Translations uploaded** to Firebase Storage
- **Public catalogue** available at: https://nara-web-73384.web.app/library?type=digital

## How to Run Manually

### 1. Translate Books (Manual Run)
```bash
cd backend
node pdfTranslationAgent.js 5
```
This will translate 5 books (change the number as needed).

### 2. Upload Translations Catalogue
```bash
cd backend
node uploadTranslationsCatalogue.js
```
This uploads the `translations_catalogue.json` to Firebase Storage.

### 3. Deploy to Website
```bash
cd ..
npm run build
firebase deploy
```

## Automated Schedule

The translation agent runs automatically:
- **6:00 AM daily** - Translates 5 books
- **6:00 PM daily** - Translates 5 books

### Start Automated Scheduler
```bash
cd backend/scheduledJobs
node scheduler.js
```

## How It Works

### Translation Process
1. **Download** - Fetches original PDF from Firebase Storage
2. **Extract** - Extracts text from PDF using pdf-parse
3. **Translate** - Uses Google Gemini AI to translate to Tamil & Sinhala
4. **Upload** - Saves translated text files to Firebase Storage
5. **Update** - Updates translations_catalogue.json

### File Structure
```
Firebase Storage:
├── pdfs/                           # Original English PDFs
├── pdfs_tamil/                     # Tamil translations (.txt)
├── pdfs_sinhala/                   # Sinhala translations (.txt)
└── public/
    ├── library_catalogue.json      # Main catalogue (200+ books)
    └── translations_catalogue.json # Translations catalogue (70+ books)
```

### Translation Catalogue Format
```json
{
  "id": "144-tamil",
  "original_id": 144,
  "title": "Book Title",
  "language": "Tamil",
  "translations_available": ["tamil"],
  "translations": {
    "tamil": {
      "url": "https://firebasestorage.googleapis.com/.../file.txt",
      "translated_at": "2025-10-23T08:19:48.623Z"
    }
  }
}
```

## Display on Website

### Digital Library Page
When users visit `/library?type=digital`, they see:

1. **Popular Items** - Featured books
2. **New Arrivals** - Recently added books
3. **Sinhala Translations** - 6 most recent Sinhala books
4. **Tamil Translations** - 6 most recent Tamil books
5. **26 Material Type Categories** - Browse by category

### Features
- Color-coded sections (Blue for Sinhala, Orange for Tamil)
- "AI Translated" badge on translation cards
- "NEW" badge for recent additions
- Timestamp showing when translated
- Click to view full book details

## API & Services

### Library Service Functions
```javascript
// Get 6 most recent Tamil translations
searchService.getTamilTranslations(6)

// Get 6 most recent Sinhala translations
searchService.getSinhalaTranslations(6)

// Search for specific book
catalogueService.getItemById(id)
```

### Environment Variables (.env)
```bash
VITE_LIBRARY_CATALOGUE_URL=https://firebasestorage.../library_catalogue.json
VITE_TRANSLATIONS_CATALOGUE_URL=https://firebasestorage.../translations_catalogue.json
```

## Translation Quality

### Google Gemini AI Features
- **Free tier** - 15 requests per minute
- **High quality** - Natural, context-aware translations
- **Academic tone** - Preserves technical accuracy
- **UTF-8 support** - Perfect for Tamil & Sinhala scripts

### Current Settings
- **Chunk size**: 8,000 characters per request
- **Rate limit delay**: 4 seconds between chunks
- **Batch size**: 5 books per run
- **Character limit**: 10,000 chars per book (testing mode)

## Troubleshooting

### Translations Not Showing?
1. Check `.env` has `VITE_TRANSLATIONS_CATALOGUE_URL`
2. Verify `translations_catalogue.json` is uploaded to Firebase Storage
3. Rebuild app: `npm run build`
4. Deploy: `firebase deploy`
5. Clear browser cache

### Agent Failed?
1. Check Firebase credentials in `library-agent/serviceAccountKey.json`
2. Verify Gemini API key in `pdfTranslationAgent.js`
3. Check Firebase Storage permissions
4. Review error logs

### No New Books to Translate?
- Check if all books already have translations
- Verify `library_catalogue.json` has books with `firebase_path`
- Remove translation limit in `pdfTranslationAgent.js` line 277

## Next Steps

### To Generate More Translations
1. Run translation agent manually:
   ```bash
   cd backend
   node pdfTranslationAgent.js 10  # Translate 10 books
   ```

2. Upload updated catalogue:
   ```bash
   node uploadTranslationsCatalogue.js
   ```

3. Deploy:
   ```bash
   cd ..
   npm run build
   firebase deploy
   ```

### To Schedule Automatic Translations
1. Set up cron job or use PM2:
   ```bash
   # Using PM2
   pm2 start backend/scheduledJobs/autoTranslationScheduler.js
   pm2 startup
   pm2 save
   ```

2. Or use system cron:
   ```bash
   # Edit crontab
   crontab -e

   # Add these lines (6 AM & 6 PM daily)
   0 6 * * * cd /path/to/nara_digital_ocean/backend && node pdfTranslationAgent.js 5
   0 18 * * * cd /path/to/nara_digital_ocean/backend && node pdfTranslationAgent.js 5
   ```

## Cost Analysis

### Google Gemini AI (Free Tier)
- **Rate limit**: 15 requests/minute
- **Cost**: FREE! ✅
- **Quality**: High (comparable to paid services)
- **Limits**: Perfect for NARA's needs

### Firebase Storage
- **Downloads**: Free up to 1 GB/day
- **Storage**: Free up to 5 GB total
- **Current usage**: ~100 MB (plenty of room!)

## Support

For issues or questions:
1. Check Firebase Console for storage permissions
2. Review `translations_catalogue.json` format
3. Test individual functions in Node.js REPL
4. Contact system administrator

---

**Last Updated**: October 24, 2025
**System Status**: ✅ Fully Operational
**Translations**: 70 books available
