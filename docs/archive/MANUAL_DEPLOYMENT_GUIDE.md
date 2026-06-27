# 🚀 Manual Deployment Guide - Translation System

## ✅ What's Already Done

1. ✅ **Translation Agent:** Successfully translated 2 books
2. ✅ **Files Uploaded:** 4 translation files in Firebase Storage
3. ✅ **Catalogue Updated:** `public/library_catalogue.json` has translation URLs
4. ✅ **Frontend Built:** `build/` folder ready to deploy

---

## 🔥 Deploy to Firebase (Manual Steps)

### Option 1: Firebase Console Upload (Easiest)

1. **Go to Firebase Console:**
   https://console.firebase.google.com/project/nara-web-73384/hosting

2. **Click on "Hosting" in left menu**

3. **Click "Add a custom release"** or **"Upload files"**

4. **Upload the entire `build/` folder**
   - Drag and drop the `build` folder
   - Wait for upload to complete (~5-10 minutes)

5. **Done!** Your updated catalogue with translations is live

---

### Option 2: Command Line (Terminal)

If Firebase login is working in your terminal:

```bash
# In your project directory
cd /Users/nanthan/Desktop/nara\ digital/nara_digital_ocean

# Try logging in via browser
firebase login

# If that works, deploy
firebase deploy --only hosting
```

---

### Option 3: Use Service Account (Advanced)

```bash
# Set the service account key
export GOOGLE_APPLICATION_CREDENTIALS="backend/library-agent/serviceAccountKey.json"

# Deploy using service account
firebase deploy --only hosting --token "$(gcloud auth application-default print-access-token)"
```

---

## 📍 Verify Translations are Accessible (RIGHT NOW)

**Good News:** The translated files are ALREADY uploaded and working!

### Test These URLs in Your Browser:

**Tamil Translation:**
```
https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/pdfs_tamil%2FJournal%2FNARA13440021215-dtic-ada229847-radar-backscatter-from-the-sea-con.txt?alt=media
```

**Sinhala Translation:**
```
https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/pdfs_sinhala%2FJournal%2FNARA13440021215-dtic-ada229847-radar-backscatter-from-the-sea-con.txt?alt=media
```

Just copy and paste these URLs in your browser - they will download the translated text files!

---

## 🎯 What Happens After Deployment

Once you deploy the updated `build/` folder:

1. **Catalogue is Updated:** 
   - Website will have the new `library_catalogue.json`
   - Books ID 177 and 178 will have `translations` data

2. **Translation URLs Available:**
   - Each book will have `translations.tamil.url`
   - Each book will have `translations.sinhala.url`

3. **Frontend Can Use Translations:**
   - You can build UI to show language selector
   - Users can switch between English/Tamil/Sinhala

---

## 📊 Translation Summary

**Books Translated:** 2
- Book 177: NASA Ocean Technical Report (164 pages)
- Book 178: DTIC Radar Backscatter (4 pages)

**Languages:** Tamil (தமிழ்) + Sinhala (සිංහල)

**Files in Firebase Storage:**
```
pdfs_tamil/Journal/
  - NARA13418602766-nasa-technical-reports-server-ntrs-19860021726.txt
  - NARA13440021215-dtic-ada229847-radar-backscatter-from-the-sea-con.txt

pdfs_sinhala/Journal/
  - NARA13418602766-nasa-technical-reports-server-ntrs-19860021726.txt
  - NARA13440021215-dtic-ada229847-radar-backscatter-from-the-sea-con.txt
```

**Total Translations:** 16 books (14 previous + 2 new)

---

## 🔍 Check Current Website Status

Visit: **https://nara-web-73384.web.app/library**

Current status:
- Old catalogue (without new 2 translations)
- After deployment: New catalogue with 16 translated books

---

## ⚡ Quick Deployment Checklist

- [ ] Build completed ✅
- [ ] Files in `build/` folder ✅
- [ ] Firebase authenticated
- [ ] Run `firebase deploy --only hosting`
- [ ] Wait for deployment (~2-5 minutes)
- [ ] Test website: https://nara-web-73384.web.app/library
- [ ] Verify translations accessible

---

## 🆘 Troubleshooting

### "firebase login" not working

**Solution 1:** Clear Firebase cache
```bash
rm -rf ~/.config/firebase
firebase login
```

**Solution 2:** Use browser login URL
```bash
firebase login --no-localhost
# Copy the URL shown and open in browser
# Paste the token back when prompted
```

**Solution 3:** Deploy via Firebase Console (see Option 1 above)

---

## 📱 Alternative: Deploy Individual Files

If full deployment doesn't work, you can manually upload just the catalogue:

1. Go to Firebase Console → Hosting
2. Navigate to `public/` folder
3. Upload `library_catalogue.json` only
4. This updates the catalogue without rebuilding everything

---

## ✅ Success Indicators

After deployment, you should see:

1. **Firebase Console:**
   - New release in Hosting history
   - Timestamp shows recent deployment

2. **Website:**
   - Open browser dev tools → Network tab
   - Visit https://nara-web-73384.web.app/library
   - Check `library_catalogue.json` has new timestamp
   - Look for books with `translations` field

3. **Verification:**
   - Search for book ID 177 or 178
   - Check if they have `translations_available: ["tamil", "sinhala"]`

---

**Status:** ✅ Ready to Deploy!
**Build:** ✅ Complete (in `build/` folder)
**Translations:** ✅ Uploaded to Firebase Storage
**Next Step:** Deploy using one of the options above

