# 📅 Automatic Daily Fish Market Scraper

## ✅ Two Options Available

### **Option 1: Python Scheduler (Recommended for Testing)**
Runs continuously in a terminal window

### **Option 2: Cron Job (Recommended for Production)**
Runs in background automatically, even after restarts

---

## 🚀 Option 1: Python Scheduler

### Quick Start:
```bash
cd backend
python3 daily_fish_scraper.py
```

### What it does:
- ✅ Runs immediately when started
- ✅ Then runs every day at 6:00 AM
- ✅ Saves logs to `fish_scraper_daily.log`
- ✅ Shows real-time progress in terminal

### Features:
```
🚀 Starts scraping immediately
⏰ Scheduled for 6:00 AM daily
💾 All logs saved to file
📊 Shows detailed progress
🛑 Stop anytime with Ctrl+C
```

### Keep it Running:
**Terminal Window:**
```bash
# Just leave the terminal open
python3 daily_fish_scraper.py
```

**Background (Mac/Linux):**
```bash
# Run in background
nohup python3 daily_fish_scraper.py &

# Check if running
ps aux | grep daily_fish_scraper

# Stop it
pkill -f daily_fish_scraper.py
```

### View Logs:
```bash
# Real-time log monitoring
tail -f fish_scraper_daily.log

# View all logs
cat fish_scraper_daily.log
```

---

## ⚙️ Option 2: Cron Job (Production)

### Installation:
```bash
cd backend
./install_cron.sh
```

You'll see:
```
==================================================
Fish Market Scraper - Cron Job Installer
==================================================

📂 Backend directory: /path/to/backend
🐍 Scraper script: /path/to/fish_market_scraper.py
📝 Log file: /path/to/fish_scraper_cron.log

✅ Scraper found

📋 Cron job to be installed:
   0 6 * * * cd /path/to/backend && /usr/bin/python3 ...

⏰ Schedule: Daily at 6:00 AM

Do you want to install this cron job? (y/n)
```

Type **`y`** and press Enter.

### Verify Installation:
```bash
# List all your cron jobs
crontab -l

# You should see:
# 0 6 * * * cd /path/to/backend && /usr/bin/python3 fish_market_scraper.py >> fish_scraper_cron.log 2>&1
```

### View Logs:
```bash
# Check the logs
cat backend/fish_scraper_cron.log

# Monitor in real-time
tail -f backend/fish_scraper_cron.log
```

### Uninstall Cron Job:
```bash
# Edit cron jobs
crontab -e

# Delete the line with 'fish_market_scraper.py'
# Save and exit
```

---

## 📊 Schedule Customization

### Change Scraping Time:

**Python Scheduler** (`daily_fish_scraper.py`):
```python
# Line 38 - Change "06:00" to your preferred time
schedule.every().day.at("06:00").do(run_daily_scrape)

# Examples:
schedule.every().day.at("08:30").do(run_daily_scrape)  # 8:30 AM
schedule.every().day.at("14:00").do(run_daily_scrape)  # 2:00 PM
schedule.every().day.at("21:00").do(run_daily_scrape)  # 9:00 PM
```

**Cron Job**:
```bash
# Edit crontab
crontab -e

# Cron format: MINUTE HOUR DAY MONTH WEEKDAY

# Examples:
0 6 * * *    # 6:00 AM daily
30 8 * * *   # 8:30 AM daily
0 14 * * *   # 2:00 PM daily
0 */6 * * *  # Every 6 hours
0 0 * * 1    # Midnight every Monday
```

### Multiple Times Per Day:

**Python Scheduler**:
```python
schedule.every().day.at("06:00").do(run_daily_scrape)
schedule.every().day.at("14:00").do(run_daily_scrape)
schedule.every().day.at("22:00").do(run_daily_scrape)
```

**Cron Job**:
```bash
0 6 * * * cd /path/to/backend && python3 fish_market_scraper.py >> log.txt 2>&1
0 14 * * * cd /path/to/backend && python3 fish_market_scraper.py >> log.txt 2>&1
0 22 * * * cd /path/to/backend && python3 fish_market_scraper.py >> log.txt 2>&1
```

---

## 🔍 Monitoring

### Check if Scraper is Running:

**Python Scheduler**:
```bash
ps aux | grep daily_fish_scraper
```

**Cron Job**:
```bash
# Check cron service (Mac)
sudo launchctl list | grep cron

# Check recent runs
tail -20 fish_scraper_cron.log
```

### Test Run (Manual):
```bash
# Run scraper once manually
python3 fish_market_scraper.py
```

---

## 📧 Email Notifications (Optional)

Add email alerts when scraping fails:

```python
# At top of daily_fish_scraper.py
import smtplib
from email.mime.text import MIMEText

def send_alert(message):
    msg = MIMEText(message)
    msg['Subject'] = '🚨 Fish Scraper Alert'
    msg['From'] = 'your-email@gmail.com'
    msg['To'] = 'admin@example.com'

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login('your-email@gmail.com', 'your-password')
        server.send_message(msg)

# In run_daily_scrape() function
except Exception as e:
    logger.error(f"FAILED: {str(e)}")
    send_alert(f"Scraping failed: {str(e)}")  # Add this line
```

---

## 🎯 Recommended Setup

### **For Development/Testing:**
Use **Python Scheduler** in a terminal window while developing

### **For Production:**
Use **Cron Job** - runs automatically in background

---

## 📝 Quick Setup Commands

```bash
# Navigate to backend
cd "/Users/nanthan/Desktop/NARA-NEW-BY:SNC/21-10-25 FINAL NARA MAIN /NARA-OFFICIAL-WEBSITE/nara_digital_ocean/backend"

# Option 1: Start Python scheduler now
python3 daily_fish_scraper.py

# Option 2: Install cron job
./install_cron.sh
```

---

## ✅ What Gets Scraped Daily

Every day at 6:00 AM, the scraper will:

1. **Download latest Excel** from fisheries.gov.lk
2. **Scrape HTML prices** from cfc.gov.lk
3. **Extract wholesale prices** from malupola.com
4. **Save to Firestore** (50+ price records)
5. **Log results** for monitoring

---

## 🔧 Troubleshooting

### Scraper not running?
```bash
# Check Python path
which python3

# Check if schedule is installed
pip3 list | grep schedule

# Run manually to see errors
python3 fish_market_scraper.py
```

### Cron not working?
```bash
# Check cron service (Mac)
sudo launchctl list | grep cron

# Check system logs
tail -f /var/log/system.log | grep cron

# Test cron format
# Use: https://crontab.guru
```

### No data in Firestore?
```bash
# Check Firebase credentials
ls -la ../serviceAccountKey.json

# Run manual test
python3 fish_market_scraper.py
```

---

## 📊 Success Metrics

After setting up, you should see in Firestore:
- ✅ 30-50 new price records daily
- ✅ Updated timestamp in `scraper_metadata`
- ✅ Fresh data for frontend consumption

---

## 🎉 You're All Set!

Your fish market data will now update automatically every day at 6:00 AM!

Check the Export Market Intelligence page to see real data:
https://nara-web-73384.web.app/export-market-intelligence
