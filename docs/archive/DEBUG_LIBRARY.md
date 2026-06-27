# Library Debugging Guide

## Where Are The Books?

### 1. **PDF Files** (in Firebase Cloud Storage)
- **Location**: Firebase Storage bucket `nara-web-73384.firebasestorage.app`
- **Path**: `pdfs/{category}/{barcode}-{title}.pdf`
- **Example**: `pdfs/BOBP/NARA12345-preliminary-analysis.pdf`
- **Access**: These are uploaded by the background worker

### 2. **Book Metadata** (the catalogue JSON)
- **Location**: https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/public%2Flibrary_catalogue.json?alt=media
- **Contains**: All 583 book records with titles, authors, categories, PDF URLs
- **Updated**: Just now (you can click the link to see the JSON)

### 3. **Local Database** (PostgreSQL)
- **Database**: `nara_library`
- **Table**: `bibliographic_records`
- **Count**: 583 books
- **Location**: `localhost:5432`

## How The Website Loads Books

```
Website (https://nara-web-73384.web.app/library)
    ↓
Fetches JSON from Firebase Storage
    ↓
https://firebasestorage.googleapis.com/.../library_catalogue.json
    ↓
Displays 26 category tiles with book counts
    ↓
Click a category → Shows books in that category
```

## Debugging Steps

### Step 1: Check if JSON is accessible
Open this URL in your browser:
https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/public%2Flibrary_catalogue.json?alt=media

**You should see**: A JSON file with 583 books

### Step 2: Check Browser Console
1. Go to: https://nara-web-73384.web.app/library
2. Press F12 (or Right-click → Inspect)
3. Go to "Console" tab
4. Look for messages like:
   - "Loaded X items from static catalogue"
   - "Fetching static catalogue from..."
   - Any error messages in red

### Step 3: Check Network Tab
1. In Developer Tools, go to "Network" tab
2. Refresh the page (Ctrl+R or Cmd+R)
3. Look for request to `library_catalogue.json`
4. Click on it and see if it returns 200 OK with data

### Step 4: Hard Refresh
Your browser is caching the old version. Do a HARD REFRESH:
- **Windows**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R
- **Or**: Clear browser cache completely

### Step 5: Try Incognito
Open in a private/incognito window:
https://nara-web-73384.web.app/library

## What You Should See

When the page loads correctly, you'll see:

1. **Hero section** with:
   - "583 Total Items"
   - "26 Categories"
   - Search bar

2. **26 Colorful Category Tiles**:
   - MAP (44 books)
   - NEWS (35 books)
   - RPAPER (34 books)
   - etc.

3. **Click any tile** → See books in that category

## If Still Not Working

Send me:
1. Screenshot of browser console (F12 → Console tab)
2. Screenshot of what you see on the page
3. Any error messages

## Quick Test Commands

Run these to verify everything:

```bash
# 1. Check database has books
cd /Users/nanthan/Desktop/nara\ digital/nara_digital_ocean/backend/library-api
PGPASSWORD=password psql -h localhost -U nanthan -d nara_library -c "SELECT COUNT(*) FROM bibliographic_records;"

# 2. Check JSON file exists locally
ls -lh /tmp/library_catalogue.json

# 3. Download JSON from Firebase and count books
curl -s "https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/public%2Flibrary_catalogue.json?alt=media" | grep -o '"id"' | wc -l

# 4. Test if website can load the JSON
curl -I "https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/public%2Flibrary_catalogue.json?alt=media"
```

## Environment Variable

The website uses this environment variable:
```
VITE_LIBRARY_CATALOGUE_URL=https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/public%2Flibrary_catalogue.json?alt=media
```

Location: `/Users/nanthan/Desktop/nara digital/nara_digital_ocean/.env`
