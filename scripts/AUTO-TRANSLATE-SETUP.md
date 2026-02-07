# 🤖 AUTO-TRANSLATE RESEARCH PAPERS

This script automatically translates up to 5 research papers per day from English to Sinhala & Tamil.

---

## ✅ **WHAT IT DOES:**

- Scans `researchContent` collection in Firestore
- Finds papers with missing Sinhala/Tamil translations
- Translates up to **5 papers per day** automatically
- Updates:
  - Title (SI & TA)
  - Description (SI & TA)
  - Abstract (SI & TA)

---

## 🚀 **MANUAL RUN (Instant):**

Run this command anytime to translate 5 papers:

```bash
npm run translate
```

Example output:
```
🤖 AUTO-TRANSLATE RESEARCH PAPERS
==================================================
📅 Date: 10/28/2025, 9:10:00 AM
🎯 Target: Translate up to 5 papers
==================================================

📊 Found 3 papers needing translation

🔄 Translating 3 papers...

📄 Translating: Review of National Fisheries Situation
  🇱🇰 Translating title to Sinhala...
  🇱🇰 Translating title to Tamil...
  🇱🇰 Translating description to Sinhala...
  🇱🇰 Translating description to Tamil...
  ✅ Updated 4 fields

==================================================
✅ Translation Complete!
📊 Papers translated: 3/3
📊 Papers remaining: 0
==================================================
```

---

## ⏰ **AUTOMATIC DAILY RUN (Mac/Linux):**

### **Option 1: Using Cron (Recommended)**

1. Open terminal and edit crontab:
```bash
crontab -e
```

2. Add this line to run every day at 2 AM:
```bash
0 2 * * * cd /Users/nanthan/Desktop/NARA-NEW-BY\:SNC/21-10-25\ FINAL\ NARA\ MAIN\ /NARA-OFFICIAL-WEBSITE/nara_digital_ocean && npm run translate >> /tmp/auto-translate.log 2>&1
```

3. Save and exit (`:wq` in vim)

4. Verify cron job:
```bash
crontab -l
```

### **Option 2: Using macOS Launchd**

1. Create file: `~/Library/LaunchAgents/com.nara.auto-translate.plist`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.nara.auto-translate</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/npm</string>
        <string>run</string>
        <string>translate</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/nanthan/Desktop/NARA-NEW-BY:SNC/21-10-25 FINAL NARA MAIN /NARA-OFFICIAL-WEBSITE/nara_digital_ocean</string>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>2</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/tmp/nara-auto-translate.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/nara-auto-translate-error.log</string>
</dict>
</plist>
```

2. Load the job:
```bash
launchctl load ~/Library/LaunchAgents/com.nara.auto-translate.plist
```

3. Check status:
```bash
launchctl list | grep nara
```

---

## 📊 **CHECK LOGS:**

View the last translation run:
```bash
# Cron logs
tail -f /tmp/auto-translate.log

# Launchd logs
tail -f /tmp/nara-auto-translate.log
```

---

## 🔧 **TROUBLESHOOTING:**

### **"No papers need translation"**
- All papers are already translated! ✅
- Upload new papers to translate them

### **"Translation error"**
- Check internet connection
- Google Translate API may be rate-limited
- Try running again later

### **Cron job not running**
```bash
# Check if cron is running
ps aux | grep cron

# Check cron logs on Mac
log show --predicate 'process == "cron"' --last 1h
```

---

## 📈 **TRANSLATION PROGRESS:**

The script will automatically:
- Day 1: Translate 5 papers
- Day 2: Translate next 5 papers
- Day 3: Translate next 5 papers
- ... until all papers are translated!

---

## 🎯 **IMMEDIATE ACTIONS:**

### **1. Test Run (Do this now!)**
```bash
npm run translate
```

### **2. Set up Daily Cron (Mac)**
```bash
crontab -e
# Add: 0 2 * * * cd /path/to/project && npm run translate >> /tmp/auto-translate.log 2>&1
```

### **3. Verify Setup**
```bash
crontab -l
```

---

## 💡 **CUSTOMIZATION:**

Want to translate more than 5 papers per day?

Edit `scripts/auto-translate-daily.js` line 148:
```javascript
const papersToTranslate = papers.slice(0, 5); // Change 5 to 10, 20, etc.
```

---

**HAPPY AUTO-TRANSLATING! 🌐✨**
