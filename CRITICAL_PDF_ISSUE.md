# ⚠️ CRITICAL: PDFs Not in Firebase Storage

## 🔴 The Real Problem

**The PDFs don't exist in Firebase Storage!**

The catalogue JSON has 583 book records with PDF URLs, but **the actual PDF files were never uploaded to Firebase Storage**.

## 📊 What Happened

1. ✅ Background agent created book metadata
2. ✅ URLs were generated
3. ❌ **PDFs were NOT uploaded** (CORE API failed with 500 errors)
4. ❌ Users see "Invalid HTTP method/URL pair" or 404 errors

## ✅ SOLUTIONS

### Option 1: Upload PDFs Manually (Quickest)

If you have the PDF files locally:

```bash
# Using Firebase CLI
firebase storage:upload /path/to/pdfs gs://nara-web-73384.appspot.com/pdfs

# Or use Firebase Console
# 1. Go to: https://console.firebase.google.com/project/nara-web-73384/storage
# 2. Create folder: pdfs/
# 3. Upload PDF files
```

### Option 2: Fix Background Agent (For automation)

The agent failed because CORE API returned 500 errors. To fix:

1. **Get valid CORE API key**:
   - Visit: https://core.ac.uk/services/api
   - Sign up and get API key
   - Add to `backend/.env`: `CORE_API_KEY=your_key`

2. **Run agent manually**:
```bash
cd backend
npm run agent:manual
```

### Option 3: Use Sample PDFs (For testing)

Create dummy PDFs just to test the system:

```bash
# Create sample PDF structure
mkdir -p "/tmp/nara-pdfs/BOBP Reports"
cd "/tmp/nara-pdfs/BOBP Reports"

# Create dummy PDFs (for testing only)
for i in {1..10}; do
  echo "Sample PDF $i" > "sample-$i.pdf"
done

# Upload to Firebase
# (Use Firebase Console or gsutil)
```

### Option 4: Use Public URLs (Temporary)

Instead of Firebase Storage, temporarily use public PDF URLs:

1. Find PDFs from original sources (CORE, etc.)
2. Update catalogue with direct URLs
3. Later migrate to Firebase Storage

## 🔧 Immediate Fix

**To make the library work RIGHT NOW:**

### Step 1: Check if you have PDFs locally

```bash
# Check if PDFs exist
ls -la "/path/where/pdfs/might/be"
```

### Step 2: If no PDFs exist:

**Option A**: Remove PDF preview temporarily
- Update ItemDetail.jsx to hide PDF viewer
- Show message: "PDF coming soon"
- Keep download tracking active

**Option B**: Use placeholder
- Create "PDF Not Available" placeholder image
- Show metadata only
- Add "Request this book" button

## 📝 Quick Temporary Fix

I can update the library to:
1. ✅ Show all book metadata
2. ✅ Allow registration and tracking
3. ⏸️ Disable PDF preview with message "PDFs being uploaded"
4. ✅ Keep authentication system working

This lets you launch the library while PDFs are being collected!

## ❓ What would you like to do?

1. **Do you have PDFs locally?** Tell me the path
2. **Want to upload via Console?** I'll give you exact steps
3. **Want temporary fix?** I'll disable PDF viewing for now
4. **Want to wait for agent?** Need valid CORE API key first

---

**Current Status**:
- ✅ Library UI working
- ✅ Authentication working
- ✅ Category system working
- ✅ Metadata (583 books) working
- ❌ PDF files missing from Firebase Storage

**Choose your next step and I'll implement it!**
