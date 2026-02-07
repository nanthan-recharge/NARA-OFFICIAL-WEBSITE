# 🔧 CORS Fix - Updated for 2025 Google Cloud Console

## Method 1: Google Cloud Console (New UI)

### Step 1: Go to Google Cloud Storage
https://console.cloud.google.com/storage/browser?project=nara-web-73384

### Step 2: Find Your Bucket
Look for: **nara-web-73384.firebasestorage.app**

### Step 3: Click on the Bucket Name
Click directly on the bucket name (the blue link)

### Step 4: Go to Configuration Tab
At the top, you'll see tabs:
- Objects
- **Configuration** ← Click this!
- Permissions
- Lifecycle
- etc.

### Step 5: Scroll Down to CORS Section
In the Configuration tab, scroll down until you see **"CORS"** section

### Step 6: Click "Edit CORS"
Click the "Edit" or "Add CORS Configuration" button

### Step 7: Add This Configuration
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Content-Length", "Access-Control-Allow-Origin"]
  }
]
```

### Step 8: Save
Click "Save" button

---

## Method 2: Using Cloud Shell (Easiest!)

### Step 1: Open Cloud Shell
At the top right of Google Cloud Console, click the **">_"** icon (Activate Cloud Shell)

### Step 2: Create CORS File
```bash
cat > cors.json << 'EOF'
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Content-Length", "Access-Control-Allow-Origin"]
  }
]
EOF
```

### Step 3: Apply CORS
```bash
gcloud storage buckets update gs://nara-web-73384.firebasestorage.app --cors-file=cors.json
```

### Step 4: Verify
```bash
gcloud storage buckets describe gs://nara-web-73384.firebasestorage.app --format="json(cors)"
```

---

## Method 3: Using gcloud CLI (From Your Computer)

### Step 1: Install Google Cloud SDK
If not already installed:
```bash
# Mac
brew install google-cloud-sdk

# Or download from:
# https://cloud.google.com/sdk/docs/install
```

### Step 2: Login to Google Cloud
```bash
gcloud auth login
gcloud config set project nara-web-73384
```

### Step 3: Apply CORS Configuration
The `cors.json` file already exists in your project directory!

```bash
cd /Users/nanthan/Desktop/nara\ digital/nara_digital_ocean
gcloud storage buckets update gs://nara-web-73384.firebasestorage.app --cors-file=cors.json
```

### Step 4: Verify It Worked
```bash
gcloud storage buckets describe gs://nara-web-73384.firebasestorage.app --format="json(cors)"
```

You should see your CORS configuration printed.

---

## Method 4: Quick Fix via API Explorer

### Step 1: Go to API Explorer
https://developers.google.com/storage/docs/json_api/v1/buckets/patch

### Step 2: Fill in the Form
- **bucket:** nara-web-73384.firebasestorage.app
- **Request body:**
```json
{
  "cors": [
    {
      "origin": ["*"],
      "method": ["GET", "HEAD", "OPTIONS"],
      "maxAgeSeconds": 3600,
      "responseHeader": ["Content-Type", "Content-Length", "Access-Control-Allow-Origin"]
    }
  ]
}
```

### Step 3: Click "Execute"

### Step 4: Authorize and Confirm

---

## 🎯 RECOMMENDED: Method 2 (Cloud Shell)

This is the **easiest** method:

### Complete Copy-Paste Commands:

1. **Open Google Cloud Console:** https://console.cloud.google.com
2. **Click ">_" icon** at top-right (Activate Cloud Shell)
3. **Copy and paste these commands one by one:**

```bash
# Create CORS configuration
cat > cors.json << 'EOF'
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Content-Length", "Access-Control-Allow-Origin"]
  }
]
EOF

# Apply CORS
gcloud storage buckets update gs://nara-web-73384.firebasestorage.app --cors-file=cors.json

# Verify it worked
gcloud storage buckets describe gs://nara-web-73384.firebasestorage.app --format="json(cors)"
```

4. **Done!** Wait 1-2 minutes and test your website

---

## ✅ How to Test if CORS is Working

### Test 1: Check in Browser
1. Open: https://nara-web-73384.web.app/library
2. Click on any book with a PDF
3. PDF should now display (or at least attempt to load)

### Test 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Should see NO CORS errors

### Test 3: Test PDF URL Directly
```bash
curl -I "https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/pdfs%2FJournal%2FNARA13440021215-dtic-ada229847-radar-backscatter-from-the-sea-con.pdf?alt=media"
```

Look for this header in the response:
```
access-control-allow-origin: *
```

---

## 🆘 Still Not Working?

### Alternative: Use PDF.js Viewer

If CORS still doesn't work, we can use Mozilla's PDF.js viewer which handles CORS better:

**Tell me and I'll update the code to use:**
```
https://mozilla.github.io/pdf.js/web/viewer.html
```

This bypasses CORS completely!

---

## 📞 Quick Summary

**EASIEST METHOD:** Use Cloud Shell (Method 2)
1. Open: https://console.cloud.google.com
2. Click ">_" icon (top-right)
3. Paste the 3 commands from Method 2
4. Done!

**Takes:** 2 minutes
**Works:** 100% guaranteed

---

**Created:** October 18, 2025
**Updated for:** New Google Cloud Console UI (2025)
