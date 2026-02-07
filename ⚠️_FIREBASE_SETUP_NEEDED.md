# ⚠️ Firebase Service Account Key Needed

## 🎯 Current Status

✅ **PostgreSQL**: Running and configured  
✅ **Redis**: Running  
✅ **Database**: Schema complete with 26 material types  
✅ **Agent Code**: Complete and ready  
✅ **Queue**: 26 jobs added successfully  
⚠️ **Firebase**: Service account key needed

---

## 📋 What's Needed

The agent needs a Firebase service account key to upload PDFs and QR codes to Firebase Storage.

### **Option 1: Get from Firebase Console (Recommended)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **nara-web-73384**
3. Click the gear icon ⚙️ → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file
7. Save it as `serviceAccountKey.json` in **both** locations:
   - `backend/library-api/serviceAccountKey.json`
   - `backend/library-agent/serviceAccountKey.json`

### **Option 2: Copy from Existing Location**

If you already have the key somewhere:

```bash
# Copy to library-api
cp /path/to/your/serviceAccountKey.json backend/library-api/

# Copy to library-agent
cp /path/to/your/serviceAccountKey.json backend/library-agent/
```

### **Option 3: Create Symlink**

If you add it to library-api, create a symlink in library-agent:

```bash
cd backend/library-agent
ln -s ../library-api/serviceAccountKey.json serviceAccountKey.json
```

---

## 🚀 After Adding the Key

Once you've added the Firebase service account key, run:

```bash
cd backend/library-agent
npm run worker
```

The worker will:
1. ✅ Connect to PostgreSQL (already working)
2. ✅ Connect to Redis (already working)
3. ✅ Connect to Firebase Storage (will work after key is added)
4. ✅ Process 26 download jobs
5. ✅ Download PDFs
6. ✅ Upload to Firebase Storage
7. ✅ Generate QR codes
8. ✅ Save to database

---

## 📊 What's Already Working

### **Queue Population** ✅
```
✅ 26 jobs added to Redis queue
✅ Books found from multiple APIs:
   - Internet Archive
   - Open Library
   - DOAJ
   - (CORE API had some rate limiting)

Categories with jobs:
✅ Acts (1 book)
✅ Atapattu Collection (1 book)
✅ BOBP Reports (1 book)
✅ CDs (1 book)
✅ Digital Map (1 book)
✅ Electronic Books (1 book)
✅ FAO Reports (1 book)
✅ IOC Reports (1 book)
✅ IWMI Reports (1 book)
✅ Journal (1 book)
✅ Lending Book (1 book)
✅ Maps (1 book)
✅ Newspaper Articles (1 book)
✅ Permanent Reference (1 book)
✅ Proceedings (1 book)
✅ Prof. Upali Amarasinghe Collection (1 book)
✅ Reference Book (1 book)
✅ Research Papers (1 book)
✅ Research Reports - NARA (1 book)
✅ Special Reference (1 book)
✅ Sri Lanka Collection - Books (1 book)
✅ Sri Lanka Collection - Reports (1 book)
✅ Thesis (1 book)
✅ World Fisheries Collection (1 book)
✅ e-Journal Articles (1 book)
✅ e-Reports (1 book)

Total: 26 jobs ready to process!
```

### **Database** ✅
```bash
# Test connection
psql -d nara_library -c "SELECT COUNT(*) FROM material_types;"
# Returns: 26

# Check schema
psql -d nara_library -c "\d bibliographic_records" | grep -E "(url|download_source|qr_code)"
# Shows all agent fields are ready
```

### **Redis** ✅
```bash
# Test connection
redis-cli ping
# Returns: PONG

# Check queue
redis-cli LLEN bull:bookDownloads:wait
# Returns: 26 (jobs waiting)
```

---

## 🔧 Troubleshooting

### **If Firebase Console Doesn't Work**

You can test the agent without Firebase by modifying the code to skip storage uploads (for testing only):

```bash
# This is NOT recommended for production
# But can help test the download and database parts
```

### **Security Note**

⚠️ **IMPORTANT**: Never commit `serviceAccountKey.json` to version control!

It's already in `.gitignore`:
```
# .gitignore
serviceAccountKey.json
```

---

## 📖 Firebase Storage Structure

Once running, files will be uploaded to:

```
nara-web-73384.appspot.com/
├── pdfs/
│   ├── Acts/
│   │   └── NARA{barcode}-{title}.pdf
│   ├── FAO Reports/
│   │   └── NARA{barcode}-{title}.pdf
│   └── ... (26 categories)
└── qr-codes/
    ├── NARA{barcode}.png
    └── ...
```

---

## 🎯 Next Steps

1. **Add Firebase service account key** (see Option 1 above)
2. **Run the worker**: `npm run worker`
3. **Watch the logs**: `tail -f logs/application-*.log`
4. **Check database**: `psql -d nara_library -c "SELECT COUNT(*) FROM bibliographic_records WHERE download_source IS NOT NULL;"`
5. **Verify Firebase Storage**: Check Firebase Console → Storage

---

## ⏱️ Expected Timeline

Once Firebase key is added:
- Worker startup: ~5 seconds
- Processing 26 jobs: ~10-15 minutes
- Each job includes:
  - Download PDF (~10-30 seconds)
  - Validate (~1-2 seconds)
  - Upload to Firebase (~5-10 seconds)
  - Generate QR code (~1-2 seconds)
  - Save to database (~1 second)

---

## 📞 Need Help?

If you can't access Firebase Console:
1. Check if you're logged into the correct Google account
2. Verify you have admin access to the nara-web-73384 project
3. Contact your Firebase project admin

---

**Status**: ⚠️ **Waiting for Firebase Service Account Key**  
**Progress**: 95% complete (only Firebase credentials needed)  
**Next**: Add serviceAccountKey.json and run worker

