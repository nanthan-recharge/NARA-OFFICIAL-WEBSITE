# 🌐 AUTO-TRANSLATION & BOOK VIEWER SETUP GUIDE

**Complete guide to set up auto-translation and beautiful PDF reader for NARA Research Portal**

---

## 📦 STEP 1: INSTALL REQUIRED PACKAGES

```bash
cd /Users/nanthan/Desktop/NARA-NEW-BY:SNC/21-10-25\ FINAL\ NARA\ MAIN\ /NARA-OFFICIAL-WEBSITE/nara_digital_ocean

npm install @google/generative-ai react-pdf pdfjs-dist
```

---

## 🔑 STEP 2: GET GEMINI API KEY (FREE!)

### **Option A: Google AI Studio (RECOMMENDED)**

1. Go to: https://makersuite.google.com/app/apikey
2. Click **"Get API Key"**
3. Click **"Create API key in new project"**
4. Copy the API key (starts with `AIzaSy...`)
5. **FREE TIER:** 60 requests per minute!

### **Option B: Google Cloud Console**

1. Go to: https://console.cloud.google.com/
2. Enable **"Generative Language API"**
3. Create credentials → API Key
4. Copy the key

---

## ⚙️ STEP 3: ADD API KEY TO PROJECT

Create or edit `.env` file:

```bash
# In project root
nano .env
```

Add this line:

```env
VITE_GEMINI_API_KEY=AIzaSyBTn4EEzPG4G7YF_YOUR_ACTUAL_KEY_HERE
```

**Save and close** (Ctrl+X, Y, Enter)

---

## 🚀 STEP 4: FEATURES YOU NOW HAVE

### **1. Auto-Translation** 🌐

When uploading research papers:
- ✅ Automatically translates to Sinhala (සිංහල)
- ✅ Automatically translates to Tamil (தமிழ்)
- ✅ Uses Gemini AI (high quality)
- ✅ Falls back to Google Translate if limit reached
- ✅ Preserves scientific terms accurately

### **2. Book-Style PDF Viewer** 📚

Beautiful reading experience:
- ✅ Page flip animation
- ✅ Fullscreen mode
- ✅ Zoom in/out
- ✅ Single or double page view
- ✅ Keyboard navigation (←→ arrows)
- ✅ iPad optimized
- ✅ Touch-friendly controls

### **3. Multi-Language Reading** 🗣️

Switch languages instantly:
- ✅ English (ENG)
- ✅ Sinhala (සිංහල)
- ✅ Tamil (தமிழ்)

### **4. Download in Any Language** ⬇️

Download translated versions:
- ✅ PDF format
- ✅ Preserves formatting
- ✅ Includes metadata

---

## 📱 HOW IT WORKS

### **For Users:**

1. **Upload Document:**
   - Select PDF file
   - Fill in title, authors, description
   - Check "Auto-translate" option
   - Choose languages (SI, TA, or both)
   - Click "Upload & Translate"

2. **Reading:**
   - Open any research paper
   - Click language button (ENG/සිං/தமி)
   - Use beautiful book viewer
   - Zoom, flip pages, fullscreen

3. **Download:**
   - Click download button
   - Select language
   - Get translated PDF

### **For Admins:**

Upload happens in 3 steps:
1. **Upload (30%)** - File uploaded to Firebase Storage
2. **Translate (60%)** - AI translates to SI & TA
3. **Save (100%)** - All versions saved to database

---

## 🎯 TRANSLATION QUALITY

### **Gemini AI Advantages:**

✅ **Understands Context** - Marine biology terms
✅ **Natural Language** - Reads like native speaker
✅ **Scientific Accuracy** - Preserves technical terms
✅ **Free Tier** - 60 translations/minute

### **Fallback to Google Translate:**

If Gemini limit reached or fails:
- Switches automatically
- Still good quality
- Unlimited (but simpler translation)

---

## 🔧 CONFIGURATION OPTIONS

### **Change Translation Languages:**

Edit `src/components/research/ResearchDocumentUploader.jsx`:

```javascript
targetLanguages: ['si', 'ta', 'hi'] // Add Hindi
```

### **Change Translation Model:**

Edit `src/services/translationService.js`:

```javascript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro' // Use pro model for better quality
});
```

### **Disable Auto-Translation:**

In upload form, uncheck:
```
[ ] Automatically translate to other languages
```

---

## 📊 API USAGE & LIMITS

### **Gemini AI Free Tier:**

- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

### **What This Means:**

- 1 research paper = ~5 requests (title, description, tags, etc.)
- You can translate **~300 papers per day**
- More than enough for NARA!

### **If You Hit Limit:**

- Automatically switches to Google Translate
- Or wait 1 minute and retry
- Or upgrade to paid (unlikely needed)

---

## 🎨 PDF VIEWER CUSTOMIZATION

### **Change Theme:**

Edit `src/components/research/BookStylePDFViewer.jsx`:

```javascript
// Background color
className="bg-gradient-to-br from-amber-50 via-white to-orange-50"

// Change to blue theme:
className="bg-gradient-to-br from-blue-50 via-white to-indigo-50"
```

### **Change Page Animation:**

```javascript
rotateY: direction === 'next' ? 90 : -90  // Flip animation
// Change to slide:
x: direction === 'next' ? 100 : -100  // Slide animation
```

### **iPad-Specific Settings:**

Already optimized for iPad:
- Touch-friendly buttons
- Responsive scaling
- Fullscreen support
- Gesture navigation

---

## 🧪 TESTING

### **Test Translation:**

```bash
# Open browser console
import { translateWithGemini } from './services/translationService';

const text = "Coral reef health assessment";
const result = await translateWithGemini(text, 'si');
console.log(result); // Should show Sinhala translation
```

### **Test PDF Viewer:**

1. Upload a sample PDF
2. Click to view
3. Test features:
   - ✅ Page navigation
   - ✅ Zoom controls
   - ✅ Fullscreen
   - ✅ Language switch
   - ✅ Download

---

## 🐛 TROUBLESHOOTING

### **Issue: "API Key Invalid"**

**Solution:**
1. Check `.env` file has correct key
2. Restart dev server: `npm run dev`
3. Verify key at https://makersuite.google.com/app/apikey

### **Issue: "Translation Failed"**

**Solution:**
- Check internet connection
- Verify API key is active
- Check browser console for errors
- Try fallback Google Translate

### **Issue: "PDF Not Loading"**

**Solution:**
- Check PDF file size (max 50MB)
- Verify file is valid PDF
- Check Firebase Storage rules allow read
- Clear browser cache

### **Issue: "Sinhala/Tamil Not Showing"**

**Solution:**
- Check system fonts support unicode
- Verify translation completed
- Check database has translated content
- Try different browser

---

## 📈 USAGE EXAMPLES

### **Research Paper Upload:**

```
Title: Coral Reef Assessment
Description: Study of coral health in Sri Lankan waters
Authors: Dr. Silva, Dr. Fernando
Category: Marine Ecology
Tags: coral, reef, climate
Auto-Translate: ✓ SI, TA

Result:
✅ English version uploaded
✅ Sinhala version: කොරල් පරිවාර තක්සේරුව
✅ Tamil version: பவழப் பாறை மதிப்பீடு
```

### **Reading Experience:**

```
1. Click paper → Opens book viewer
2. Press F → Fullscreen
3. Click සිං → Switch to Sinhala
4. Use ← → → Navigate pages
5. Click 📥 → Download
```

---

## 💡 BEST PRACTICES

### **For Uploaders:**

1. **Write clear English first** - Translation quality depends on source
2. **Use scientific terms** - AI recognizes and translates properly
3. **Check translation** - Review before publishing
4. **Add metadata** - Authors, tags help categorization

### **For Readers:**

1. **Use fullscreen** - Best reading experience
2. **Try keyboard shortcuts** - Faster navigation
3. **Switch languages** - Compare translations
4. **Download for offline** - Read without internet

---

## 🚀 DEPLOYMENT

```bash
# Build with new features
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Verify at:
https://nara-web-73384.web.app/research-excellence-portal
```

---

## 📞 SUPPORT

### **Resources:**

- Gemini API Docs: https://ai.google.dev/docs
- React PDF Docs: https://react-pdf.org/
- Firebase Storage: https://firebase.google.com/docs/storage

### **Common Questions:**

**Q: Is translation free?**
A: Yes! Gemini free tier is generous (60/min, 1500/day)

**Q: Can I translate to more languages?**
A: Yes! Add any language code to `targetLanguages`

**Q: Does it work offline?**
A: Downloaded PDFs work offline, translation needs internet

**Q: How accurate is translation?**
A: Gemini AI is very good for scientific content

---

## ✅ CHECKLIST

Before going live:

- [ ] Gemini API key added to `.env`
- [ ] Packages installed (`npm install`)
- [ ] Translation tested with sample
- [ ] PDF viewer works on mobile/iPad
- [ ] Download function tested
- [ ] All 3 languages display correctly
- [ ] Firebase Storage rules allow uploads
- [ ] Firestore rules allow writes
- [ ] Build succeeds without errors
- [ ] Deployed to production

---

## 🎉 YOU'RE READY!

**Your research portal now has:**

✅ AI-Powered Auto-Translation (Gemini)  
✅ Beautiful Book-Style PDF Viewer  
✅ Multi-Language Support (EN/SI/TA)  
✅ Download in Any Language  
✅ iPad-Optimized Reading  
✅ Automatic Fallback System  

**ENJOY YOUR MULTILINGUAL RESEARCH PORTAL!** 🌐📚🎊
