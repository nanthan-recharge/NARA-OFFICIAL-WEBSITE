# 🤖 NARA RESEARCH PAPER SCRAPER AGENT

**Automated browser agent** that downloads real NARA research papers from multiple sources!

---

## 🚀 QUICK START

### **Step 1: Install Dependencies**

```bash
cd /Users/nanthan/Desktop/NARA-NEW-BY:SNC/21-10-25\ FINAL\ NARA\ MAIN\ /NARA-OFFICIAL-WEBSITE/nara_digital_ocean

npm install puppeteer axios cheerio pdf-parse
```

### **Step 2: Run the Agent**

```bash
node research-scraper-agent.js
```

### **Step 3: Watch It Work!**

The browser will open and automatically:
- ✅ Search NARA website
- ✅ Search Google Scholar
- ✅ Search ResearchGate
- ✅ Search AquaDocs
- ✅ Download 5 papers daily
- ✅ Save everything organized

---

## 📁 WHERE FILES ARE SAVED

### **Folder Structure:**

```
downloaded-research-papers/
├── metadata.json                           (All paper info)
├── coral_reef_health_assessment.pdf       (Paper 1)
├── tuna_fisheries_management.pdf          (Paper 2)
├── ocean_acidification_study.html         (Paper 3 - HTML if no PDF)
└── ...
```

### **Metadata Format:**

```json
{
  "downloadDate": "2025-10-27T15:30:00.000Z",
  "totalPapers": 20,
  "papers": [
    {
      "title": "Coral Reef Health Assessment in Sri Lankan Waters",
      "source": "Google Scholar",
      "url": "https://...",
      "type": "pdf",
      "authors": "Dr. Arjuna Parakrama, et al",
      "snippet": "This study examines..."
    }
  ]
}
```

---

## ⚙️ CONFIGURATION

Edit `research-scraper-agent.js`:

```javascript
const CONFIG = {
  downloadFolder: './downloaded-research-papers',  // Change save location
  dailyLimit: 5,                                   // Papers to download per run
  formats: ['pdf', 'doc', 'docx']                 // Accepted formats
};
```

---

## 🎯 SOURCES SEARCHED

1. **NARA Official Website**
   - https://www.nara.ac.lk
   - Direct publications

2. **Google Scholar**
   - NARA + Sri Lanka + marine research
   - Academic papers

3. **ResearchGate**
   - NARA affiliated research
   - Peer-reviewed papers

4. **AquaDocs**
   - Marine research repository
   - Open access papers

---

## 🔄 DAILY AUTOMATION

### **Option 1: Manual Daily Run**

Run once daily:
```bash
node research-scraper-agent.js
```

### **Option 2: Cron Job (Mac/Linux)**

Run automatically every day at 9 AM:

```bash
# Edit crontab
crontab -e

# Add this line:
0 9 * * * cd /Users/nanthan/Desktop/NARA-NEW-BY:SNC/21-10-25\ FINAL\ NARA\ MAIN\ /NARA-OFFICIAL-WEBSITE/nara_digital_ocean && node research-scraper-agent.js
```

### **Option 3: Task Scheduler (Windows)**

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily at 9:00 AM
4. Action: Run program
5. Program: `node`
6. Arguments: `research-scraper-agent.js`
7. Start in: `[your project folder]`

---

## 📊 OUTPUT FORMATS

### **PDF Files:**
- Direct downloads
- Searchable text
- Original formatting

### **HTML Files:**
- When PDF not available
- Full content preserved
- Can convert to PDF later

### **Metadata JSON:**
- All paper information
- Sources tracked
- Can import to database

---

## 🔧 TROUBLESHOOTING

### **Error: "Cannot find module 'puppeteer'"**

```bash
npm install puppeteer axios cheerio pdf-parse
```

### **Browser doesn't open**

Change in script:
```javascript
headless: false  // Shows browser (change to true for background)
```

### **Downloads fail**

- Check internet connection
- Some sites may block automated access
- Try increasing timeout values

### **Rate limiting**

Add delays between requests:
```javascript
await page.waitForTimeout(5000); // Wait 5 seconds
```

---

## 💡 ADVANCED USAGE

### **Change Daily Limit:**

```javascript
dailyLimit: 10  // Download 10 papers instead of 5
```

### **Add Custom Sources:**

```javascript
sources: [
  'https://your-custom-source.com',
  'https://another-source.org'
]
```

### **Filter by Keywords:**

Add to scraping function:
```javascript
if (paper.title.includes('coral') || paper.title.includes('fisheries')) {
  papers.push(paper);
}
```

---

## 📈 INTEGRATION WITH FIREBASE

After downloading, upload to your Research Portal:

```javascript
const admin = require('firebase-admin');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

// Upload metadata
async function uploadToFirebase(papers) {
  for (const paper of papers) {
    await db.collection('researchContent').add({
      title: { en: paper.title },
      description: { en: paper.snippet },
      authors: paper.authors.split(','),
      source: paper.source,
      fileURL: paper.localPath,
      uploadedBy: 'scraper_agent',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}
```

---

## 🎯 WHAT THE AGENT DOES

1. **Opens Browser** (you can see it work)
2. **Searches** multiple academic sources
3. **Finds** relevant NARA research papers
4. **Downloads** up to 5 papers per day
5. **Organizes** files in folder
6. **Saves** metadata in JSON
7. **Closes** browser automatically

---

## ✅ DAILY WORKFLOW

### **Morning:**
```bash
node research-scraper-agent.js
```

### **Result:**
```
🤖 Starting NARA Research Paper Scraper Agent...

📚 Searching NARA Official Website...
   ✅ Found 3 items from NARA website

📖 Searching Google Scholar...
   ✅ Found 5 papers from Google Scholar

🔬 Searching ResearchGate...
   ✅ Found 4 papers from ResearchGate

🌊 Searching AquaDocs...
   ✅ Found 2 papers from AquaDocs

⬇️  Downloading papers...
   ⬇️  Downloading: Coral Reef Health Assessment...
      ✅ Saved: coral_reef_health_assessment.pdf
   ⬇️  Downloading: Tuna Fisheries Management...
      ✅ Saved: tuna_fisheries_management.pdf

✅ COMPLETE! Downloaded 5 papers
📁 Saved to: ./downloaded-research-papers
📊 Total found: 14 papers
📋 Metadata saved to: metadata.json
```

---

## 🌟 BENEFITS

✅ **Automated** - Runs by itself  
✅ **Organized** - Files named properly  
✅ **Tracked** - Metadata for all papers  
✅ **Multi-Source** - Searches 4 databases  
✅ **Smart** - Avoids duplicates  
✅ **Daily** - Fresh papers every day  

---

## 📞 SUPPORT

If you need help:
1. Check the console output
2. Look at `metadata.json` for errors
3. Adjust timeout values
4. Try running with `headless: false` to see what's happening

---

**ENJOY YOUR AUTOMATED RESEARCH PAPER DOWNLOADS!** 🎉📚🤖
