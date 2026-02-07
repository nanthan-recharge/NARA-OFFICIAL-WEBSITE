# 🤖 Automated Translation Scheduler - Setup Guide

## ✅ What's Been Created

### 1. Auto-Translation Scheduler
- **File:** `backend/scheduledJobs/autoTranslationScheduler.js`
- **Translates:** 5 books per run (10 books per day)
- **Schedule:** Every 12 hours (6 AM & 6 PM Sri Lanka time)
- **Languages:** Tamil (தமிழ்) + Sinhala (සිංහල)
- **Cost:** FREE (using Google Gemini AI)

### 2. PM2 Configuration
- **File:** `backend/ecosystem.config.js`
- **Auto-restart:** Runs at scheduled times
- **Logs:** Saves to `backend/logs/`
- **Timezone:** Asia/Colombo

---

## 🚀 How to Start Automated Translations

### Step 1: Install PM2 (if not installed)
```bash
npm install -g pm2
```

### Step 2: Start the Scheduler
```bash
cd backend
pm2 start ecosystem.config.js
```

### Step 3: Save PM2 Configuration
```bash
pm2 save
pm2 startup
```

### Step 4: Verify It's Running
```bash
pm2 list
pm2 logs nara-translation-scheduler
```

---

## 📊 Expected Results

### Daily Translation Output
- **6:00 AM:** Translates 5 books
- **6:00 PM:** Translates 5 books
- **Total per day:** 10 books
- **Total per month:** ~300 books

### Timeline to Complete All Books
- **Current:** 18 books translated
- **Remaining:** ~100 books with PDFs
- **Days to complete:** ~10 days
- **Completion date:** ~October 28, 2025

---

## 🔍 Monitoring

### Check Scheduler Status
```bash
pm2 status nara-translation-scheduler
```

### View Translation Logs
```bash
pm2 logs nara-translation-scheduler
```

### View Error Logs
```bash
pm2 logs nara-translation-scheduler --err
```

### Restart Scheduler
```bash
pm2 restart nara-translation-scheduler
```

### Stop Scheduler
```bash
pm2 stop nara-translation-scheduler
```

---

## 🎯 Manual Translation (If Needed)

If you want to translate more books immediately:

```bash
cd backend
node pdfTranslationAgent.js 10  # Translate 10 books now
```

---

## 📁 Log Files

Translation logs are saved to:
- **Output:** `backend/logs/translation-out.log`
- **Errors:** `backend/logs/translation-error.log`

---

## ⚡ Quick Commands

```bash
# Start scheduler
pm2 start backend/ecosystem.config.js

# Check status
pm2 list

# View logs in real-time
pm2 logs nara-translation-scheduler --lines 50

# Stop scheduler
pm2 stop nara-translation-scheduler

# Restart scheduler
pm2 restart nara-translation-scheduler

# Delete scheduler
pm2 delete nara-translation-scheduler
```

---

## 🔧 Troubleshooting

### Scheduler Not Running?
```bash
pm2 describe nara-translation-scheduler
pm2 logs nara-translation-scheduler --err
```

### Translation Failing?
1. Check API key in `.env` file
2. Verify Firebase service account key
3. Check internet connection
4. View error logs: `pm2 logs --err`

### Want to Change Schedule?
Edit `backend/ecosystem.config.js`:
```javascript
cron_restart: '0 6,18 * * *'  // Current: 6 AM & 6 PM
// Examples:
// '0 */6 * * *'  // Every 6 hours
// '0 0,12 * * *' // Midnight and noon
// '0 8,20 * * *' // 8 AM and 8 PM
```

Then restart:
```bash
pm2 restart nara-translation-scheduler
```

---

## ✅ Success Indicators

After 24 hours, you should see:
- ✅ 10 new books translated
- ✅ Tamil and Sinhala files in Firebase Storage
- ✅ Updated `library_catalogue.json`
- ✅ Translation logs in log files

---

## 📞 Quick Stats

Run this to see translation progress:
```bash
cd backend
node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('../public/library_catalogue.json')); const translated=data.filter(b=>b.translations_available?.length>0); console.log('Translated:', translated.length, '/', data.filter(b=>b.url).length);"
```

---

**Status:** ✅ Ready to Deploy!
**Created:** October 18, 2025
**By:** Claude Code with Google Gemini AI
