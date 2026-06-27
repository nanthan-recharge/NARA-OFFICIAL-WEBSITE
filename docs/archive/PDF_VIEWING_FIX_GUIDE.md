# 🔧 PDF Viewing Issue - Complete Fix Guide

## 🚨 Problem

English PDFs are not displaying in the browser, even when clicking "Open in New Tab".

## ✅ Complete Solution (3 Steps)

---

### Step 1: Apply CORS Configuration to Firebase Storage

Firebase Storage blocks PDFs from being displayed in browsers due to CORS restrictions. We need to manually apply CORS rules.

#### Option A: Using Firebase Console (Easiest)

1. **Go to Firebase Console:**
   https://console.firebase.google.com/project/nara-web-73384/storage

2. **Click on "Rules" tab** at the top

3. **Verify rules allow public read access** (should already be set):
   ```
   match /pdfs/{allPaths=**} {
     allow read: if true;
   }
   ```

4. **Apply CORS via Cloud Console:**
   - Go to: https://console.cloud.google.com/storage/browser/nara-web-73384.firebasestorage.app
   - Click the 3 dots menu → "Edit CORS configuration"
   - Paste this configuration:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "HEAD", "OPTIONS"],
       "maxAgeSeconds": 3600,
       "responseHeader": [
         "Content-Type",
         "Content-Length",
         "Content-Disposition",
         "Access-Control-Allow-Origin"
       ]
     }
   ]
   ```
   - Click "Save"

#### Option B: Using gsutil Command Line

If you have Google Cloud SDK installed:

```bash
cd /Users/nanthan/Desktop/nara\ digital/nara_digital_ocean
gsutil cors set cors.json gs://nara-web-73384.firebasestorage.app
```

---

### Step 2: Verify PDF URLs are Correct

Check that PDF URLs in the catalogue have the correct format:

**Correct format:**
```
https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/pdfs%2FJournal%2Ffilename.pdf?alt=media
```

**Key parts:**
- `firebasestorage.googleapis.com` (correct domain)
- `nara-web-73384.firebasestorage.app` (your bucket)
- `%2F` (URL-encoded slashes)
- `?alt=media` (download token)

#### Test a PDF URL:

1. Open `public/library_catalogue.json`
2. Find a book with a PDF (search for `"url": "https://`)
3. Copy the URL
4. Paste in browser - should download or display PDF

---

### Step 3: Alternative PDF Viewer (If CORS Still Fails)

If CORS configuration doesn't work, we can use a proxy service:

#### Update ItemDetail.jsx to use PDF.js viewer:

```javascript
// Instead of:
<object data={currentPdfUrl} type="application/pdf">

// Use Mozilla's PDF.js:
<iframe
  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(currentPdfUrl)}`}
  className="w-full h-[800px]"
/>
```

This uses Mozilla's hosted PDF.js viewer which handles CORS better.

---

## 🔍 Testing the Fix

### Test 1: Direct PDF Access
```bash
# Try accessing a PDF directly
curl -I "https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/pdfs%2FJournal%2FNARA13440021215-dtic-ada229847-radar-backscatter-from-the-sea-con.pdf?alt=media"
```

Should return:
```
HTTP/2 200
content-type: application/pdf
access-control-allow-origin: *
```

### Test 2: Browser Console
1. Open website: https://nara-web-73384.web.app/library
2. Open browser DevTools (F12)
3. Go to "Network" tab
4. Click on a book with PDF
5. Look for PDF request - check if it's blocked by CORS

### Test 3: Check Book Detail Page
1. Visit a book with PDF
2. PDF should display OR show fallback buttons
3. Click "Open in New Tab" - should open PDF
4. Click "Download" - should download PDF

---

## 🛠️ If PDFs Still Don't Work

### Quick Fix: Use PDF.js Viewer

Edit `src/pages/library-catalogue/ItemDetail.jsx`:

```javascript
{showPdfViewer && (
  <div className="relative rounded-lg overflow-hidden border-4 border-gray-200 shadow-lg bg-gray-100">
    <iframe
      src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(currentPdfUrl)}`}
      className="w-full h-[800px]"
      title={`PDF Viewer - ${item.title}`}
    />
  </div>
)}
```

Then rebuild and deploy:
```bash
npm run build
firebase deploy --only hosting
```

---

## 📊 Verification Checklist

- [ ] CORS configured in Firebase Storage
- [ ] Storage rules allow public read for /pdfs/**
- [ ] PDF URLs include `?alt=media` parameter
- [ ] Test URL opens in browser
- [ ] Browser console shows no CORS errors
- [ ] PDF displays in object tag OR shows fallback
- [ ] "Open in New Tab" works
- [ ] "Download" button works

---

## 🆘 Still Having Issues?

### Check Firebase Storage Public Access

1. Go to: https://console.firebase.google.com/project/nara-web-73384/storage
2. Click on a PDF file in `/pdfs/` folder
3. Click "Get link" or "Share"
4. Make sure it generates a public URL
5. Test that URL in incognito browser window

### Alternative: Make All PDFs Public

Run this Firebase CLI command:
```bash
firebase deploy --only storage
```

Then verify storage rules at:
https://console.firebase.google.com/project/nara-web-73384/storage/rules

---

## ✅ Expected Outcome

After applying these fixes:
1. ✅ PDFs display in browser using native viewer
2. ✅ "Open in New Tab" works
3. ✅ "Download" button works
4. ✅ No CORS errors in browser console
5. ✅ Works on all devices and browsers

---

**Created:** October 18, 2025
**Status:** Awaiting CORS configuration
**Next Step:** Apply CORS via Firebase Console (Step 1, Option A)
