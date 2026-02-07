# 🌐 PDF Translation System - Setup Guide

## Overview

Automated background agent that translates English PDFs to **Tamil** and **Sinhala** languages.

---

## ✅ Features

- **Automatic Text Extraction** from PDFs
- **Google Cloud Translation API** integration
- **Tamil (தமிழ்)** translation support
- **Sinhala (සිංහල)** translation support
- **Batch Processing** with progress tracking
- **Firebase Storage** for translated PDFs
- **Language Selector UI** for easy switching

---

## 📋 Prerequisites

### 1. Get Google Cloud Translation API Key (FREE)

**Step 1: Create Google Cloud Project**
1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name: "NARA Digital Library"
4. Click "Create"

**Step 2: Enable Translation API**
1. Go to: https://console.cloud.google.com/apis/library/translate.googleapis.com
2. Click "Enable"
3. Wait for activation (takes ~30 seconds)

**Step 3: Create API Key**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "API Key"
3. Copy your API key (looks like: `AIzaSyD...`)
4. Click "Restrict Key" (recommended):
   - API restrictions → "Restrict key"
   - Select "Cloud Translation API"
   - Click "Save"

**Free Quota:**
- **500,000 characters/month** FREE
- Enough for ~50-100 research papers/month
- After free quota: $20 per million characters

---

## 🚀 Installation

### Install Dependencies

```bash
cd backend
npm install pdf-parse pdf-lib
```

### Configure API Key

**Option 1: Environment Variable (Recommended)**
```bash
cd backend
echo "GOOGLE_TRANSLATE_API_KEY=your_api_key_here" >> .env
```

**Option 2: Direct in Code** (testing only)
Edit `backend/pdfTranslationAgent.js` line 28:
```javascript
this.translationAPIKey = 'YOUR_API_KEY_HERE';
```

---

## 📚 Usage

### Test Translation (5 books)

```bash
cd backend
node pdfTranslationAgent.js 5
```

**What happens:**
1. Loads catalogue
2. Finds 5 books with PDFs
3. Downloads each PDF from Firebase
4. Extracts text (first 10,000 characters for testing)
5. Translates to Tamil and Sinhala
6. Creates new PDFs with translated text
7. Uploads to Firebase Storage:
   - `pdfs_tamil/[category]/[filename].pdf`
   - `pdfs_sinhala/[category]/[filename].pdf`
8. Updates catalogue with translation URLs

### Translate More Books

```bash
# Translate 20 books
node pdfTranslationAgent.js 20

# Translate 100 books
node pdfTranslationAgent.js 100

# Translate all books (remove limit in code)
node pdfTranslationAgent.js 1000
```

### Run as Background Agent

```bash
# Start translation agent in background
nohup node pdfTranslationAgent.js 50 > translation.log 2>&1 &

# Monitor progress
tail -f translation.log

# Check progress
grep "TRANSLATION SUMMARY" translation.log
```

---

## 📊 Firebase Storage Structure

```
nara-web-73384.firebasestorage.app/
├── pdfs/                           # Original English PDFs
│   ├── Maps/
│   ├── Research Papers/
│   └── ...
├── pdfs_tamil/                     # Tamil Translations
│   ├── Maps/
│   │   └── NARA60-journal-of-aquatic-ecosystem.pdf
│   ├── Research Papers/
│   └── ...
└── pdfs_sinhala/                   # Sinhala Translations
    ├── Maps/
    ├── Research Papers/
    └── ...
```

---

## 📝 Catalogue Updates

Each book gets new fields:

```json
{
  "id": 60,
  "title": "Journal of Aquatic Ecosystem...",
  "url": "https://...pdfs/Maps/book.pdf",
  "translations": {
    "tamil": {
      "url": "https://...pdfs_tamil/Maps/book.pdf",
      "firebase_path": "pdfs_tamil/Maps/book.pdf",
      "translated_at": "2025-10-17T04:00:00.000Z"
    },
    "sinhala": {
      "url": "https://...pdfs_sinhala/Maps/book.pdf",
      "firebase_path": "pdfs_sinhala/Maps/book.pdf",
      "translated_at": "2025-10-17T04:00:00.000Z"
    }
  },
  "translations_available": ["tamil", "sinhala"]
}
```

---

## 🎨 Frontend UI Component

### Language Selector Component

Create: `src/components/library/LanguageSelector.jsx`

```jsx
import React, { useState } from 'react';
import { Globe } from 'lucide-react';

const LanguageSelector = ({ book, onLanguageChange }) => {
  const [selectedLang, setSelectedLang] = useState('english');

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧', url: book.url },
    { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳',
      url: book.translations?.tamil?.url },
    { code: 'sinhala', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰',
      url: book.translations?.sinhala?.url }
  ];

  const availableLanguages = languages.filter(lang => lang.url);

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang.code);
    onLanguageChange(lang.url, lang.code);
  };

  if (availableLanguages.length <= 1) {
    return null; // Don't show selector if only English available
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
      <Globe className="w-5 h-5 text-indigo-600" />
      <span className="text-sm font-medium text-gray-700">Read in:</span>

      <div className="flex gap-2">
        {availableLanguages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedLang === lang.code
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-indigo-100'
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.nativeName || lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
```

### Usage in ItemDetail.jsx

```jsx
import LanguageSelector from '../components/library/LanguageSelector';

function ItemDetail({ item }) {
  const [currentPdfUrl, setCurrentPdfUrl] = useState(item.url);
  const [currentLanguage, setCurrentLanguage] = useState('english');

  const handleLanguageChange = (url, langCode) => {
    setCurrentPdfUrl(url);
    setCurrentLanguage(langCode);
  };

  return (
    <div>
      {/* Language Selector */}
      <LanguageSelector
        book={item}
        onLanguageChange={handleLanguageChange}
      />

      {/* PDF Viewer with current language */}
      <PDFViewer url={currentPdfUrl} />

      {/* Download button with current language */}
      <DownloadManager
        book={item}
        pdfUrl={currentPdfUrl}
        language={currentLanguage}
      />
    </div>
  );
}
```

---

## ⚡ Automated Daily Translation

### Schedule Daily Translations

Create: `backend/scheduledJobs/dailyTranslationScheduler.js`

```javascript
const cron = require('node-cron');
const PDFTranslationAgent = require('../pdfTranslationAgent');

// Run translation at 3 AM daily (after ebook upload completes)
cron.schedule('0 3 * * *', async () => {
  console.log('🌐 Starting daily PDF translation...');

  const agent = new PDFTranslationAgent();

  try {
    // Translate 10 new books per day
    const result = await agent.translateAll({ limit: 10 });
    console.log(`✅ Translated ${result.success} books`);
  } catch (error) {
    console.error('❌ Translation failed:', error);
  }
});

console.log('📅 Daily translation scheduler started (runs at 3:00 AM)');
```

### Start Scheduler with PM2

```bash
pm2 start backend/scheduledJobs/dailyTranslationScheduler.js --name "translation-scheduler"
pm2 save
```

---

## 💰 Cost Estimation

### Free Tier
- **500,000 characters/month FREE**
- Average research paper: ~10,000 characters
- Can translate: **50 papers/month free**
- 2 languages = 25 papers/month with both translations

### After Free Tier
- **$20 per 1 million characters**
- 1000 papers × 10,000 chars = 10 million chars
- Cost: $200 for all 583 books × 2 languages
- Cost: ~$0.34 per book for both languages

### Optimization Tips
1. **Limit text per book** (first 10,000 characters for abstracts/summaries)
2. **Translate on-demand** (only when user requests)
3. **Cache translations** (don't re-translate)
4. **Batch processing** (10-20 books per day)

---

## 🧪 Testing

### Test Single Book

```javascript
const agent = new PDFTranslationAgent();
await agent.init();

const testBook = {
  id: 60,
  title: "Test Book",
  firebase_path: "pdfs/Maps/test.pdf"
};

await agent.translateBook(testBook, 0, 1);
```

### Verify Translations

1. Check Firebase Storage Console:
   - https://console.firebase.google.com/project/nara-web-73384/storage

2. Look for folders:
   - `pdfs_tamil/`
   - `pdfs_sinhala/`

3. Download and verify PDFs render correctly

---

## 🐛 Troubleshooting

### "Translation API key not configured"
```bash
# Check .env file exists
cat backend/.env

# Add API key
echo "GOOGLE_TRANSLATE_API_KEY=AIzaSy..." >> backend/.env
```

### "Translation API key invalid or quota exceeded"
1. Check API key: https://console.cloud.google.com/apis/credentials
2. Check quota: https://console.cloud.google.com/apis/api/translate.googleapis.com/quotas
3. Enable billing if needed

### "PDF extraction failed"
- Some PDFs may be scanned images (no text)
- Need OCR for image-based PDFs
- Use Tesseract.js for OCR (future enhancement)

### Translations look wrong
- Technical terms may not translate well
- Consider creating custom glossary
- Google Translation API supports glossaries

---

## 🚀 Deployment

### 1. Update Frontend

```bash
cd /Users/nanthan/Desktop/nara digital/nara_digital_ocean
npm run build
```

### 2. Deploy to Firebase

```bash
firebase deploy --only hosting
```

### 3. Test Live

Visit: https://nara-web-73384.web.app/library

---

## 📈 Roadmap

### Phase 1: Basic Translation ✅
- [x] PDF text extraction
- [x] Google Translation API integration
- [x] Tamil & Sinhala support
- [x] Firebase Storage upload
- [x] Catalogue updates

### Phase 2: UI Enhancement (Next)
- [ ] Language selector component
- [ ] Smooth PDF switching
- [ ] Translation progress indicator
- [ ] Download in selected language

### Phase 3: Advanced Features
- [ ] OCR for scanned PDFs
- [ ] Custom translation glossary
- [ ] On-demand translation
- [ ] Translation quality scoring
- [ ] User feedback system

### Phase 4: Automation
- [ ] Daily automated translation
- [ ] Priority queue (popular books first)
- [ ] Cost optimization
- [ ] Translation caching

---

## 📊 Translation Quality

### Best For:
- ✅ Simple text content
- ✅ Abstracts and summaries
- ✅ General descriptions
- ✅ Titles and headings

### Challenging:
- ⚠️ Technical jargon
- ⚠️ Scientific formulas
- ⚠️ Proper nouns
- ⚠️ Tables and charts

### Recommendations:
1. Translate abstracts only (first 10,000 chars)
2. Keep original English available
3. Add disclaimer: "Machine-translated for reference"
4. Allow user feedback for corrections

---

**Status**: ✅ **READY TO USE**
**Created**: October 17, 2025
**File**: `/backend/pdfTranslationAgent.js`

🌐 **Bringing Sri Lankan research to everyone in their own language!**
