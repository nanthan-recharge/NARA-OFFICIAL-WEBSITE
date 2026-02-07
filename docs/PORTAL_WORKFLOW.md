# 🔄 Research Portal - Visual Workflow Guide

## 📋 Quick Reference Flowcharts

### 1️⃣ User Registration Flow

```
START
  │
  ├─→ Visit: /register
  │
  ├─→ Fill Form:
  │   ├── Name
  │   ├── Email
  │   ├── Password
  │   └── Select Role:
  │       ├── Student (Read Only)
  │       ├── Researcher (Can Upload)
  │       └── Professor (Can Upload)
  │
  ├─→ Submit Registration
  │
  ├─→ Email Verification (if enabled)
  │
  └─→ Login & Access Portal
```

---

### 2️⃣ Paper Upload Flow (Researchers/Professors)

```
START (Logged in as Researcher/Professor)
  │
  ├─→ Visit: /research-excellence-portal
  │
  ├─→ Click "Upload New Paper" Button
  │
  ├─→ FORM SECTION 1: English Content
  │   ├── Title (Required)
  │   ├── Description (Required)
  │   ├── Abstract (Required)
  │   └── Full Content (Required)
  │
  ├─→ FORM SECTION 2: Sinhala Content
  │   ├── මාතෘකාව (Required)
  │   ├── විස්තරය (Required)
  │   ├── සාරාංශය (Required)
  │   └── සම්පූර්ණ අන්තර්ගතය (Required)
  │
  ├─→ FORM SECTION 3: Tamil Content
  │   ├── தலைப்பு (Required)
  │   ├── விளக்கம் (Required)
  │   ├── சுருக்கம் (Required)
  │   └── முழு உள்ளடக்கம் (Required)
  │
  ├─→ FORM SECTION 4: Metadata
  │   ├── Authors (Required)
  │   ├── Category (Required)
  │   ├── Keywords (Required)
  │   ├── Publication Date (Required)
  │   ├── DOI (Optional)
  │   ├── Journal Name (Optional)
  │   ├── Volume/Issue (Optional)
  │   └── Pages (Optional)
  │
  ├─→ FORM SECTION 5: File Upload
  │   └── PDF File (Optional, max 10MB)
  │
  ├─→ Click "Upload Research Paper"
  │
  ├─→ Validation Check
  │   ├── All required fields filled?
  │   ├── PDF size < 10MB?
  │   └── Valid data format?
  │
  ├─→ Upload to Firebase
  │   ├── Save to Firestore
  │   └── Upload PDF to Storage
  │
  ├─→ Success Message
  │
  └─→ Paper Appears in Portal Grid
```

---

### 3️⃣ Paper Discovery Flow (All Users)

```
START
  │
  ├─→ Visit: /research-excellence-portal
  │
  ├─→ View Portal Homepage
  │   ├── Search Bar
  │   ├── Category Filter
  │   ├── Language Filter
  │   ├── Sort Options
  │   └── Research Papers Grid
  │
  ├─→ OPTION A: Browse Papers
  │   ├── Scroll through grid
  │   ├── See title, authors, abstract preview
  │   └── Click paper card
  │
  ├─→ OPTION B: Use Search
  │   ├── Type keywords in search bar
  │   ├── Real-time results update
  │   └── Click matching paper
  │
  ├─→ OPTION C: Apply Filters
  │   ├── Select Category
  │   ├── Select Language
  │   ├── Choose Sort Order
  │   └── View filtered results
  │
  └─→ Click Paper to Read
      │
      ├─→ IF NOT LOGGED IN:
      │   ├── See: Title, Authors, Abstract
      │   ├── Message: "Login to Read Full Paper"
      │   └── Click Login Button → Go to Login
      │
      └─→ IF LOGGED IN:
          ├── See: Full Content
          ├── Tabs: Abstract | Full Text | References
          ├── Actions:
          │   ├── Download PDF
          │   ├── Copy Citation
          │   └── Bookmark
          └── View Metrics: Views, Downloads
```

---

### 4️⃣ Authentication Gate Flow

```
User Clicks "Read Full Paper"
  │
  ├─→ Check Authentication Status
  │
  ├─→ IF AUTHENTICATED:
  │   ├── Load Full Content
  │   ├── Show All Tabs
  │   ├── Enable Download
  │   ├── Track View Count
  │   └── Display Paper
  │
  └─→ IF NOT AUTHENTICATED:
      ├── Show Preview Only:
      │   ├── Title
      │   ├── Authors
      │   └── Abstract (partial)
      │
      ├── Display Login Prompt:
      │   ├── "Register to Access Full Content"
      │   ├── Benefits List
      │   └── Login/Register Buttons
      │
      └─→ User Clicks Login/Register
          └─→ Redirect to Auth Page
              └─→ After Login → Return to Paper
```

---

### 5️⃣ Search & Filter Flow

```
User on Portal Homepage
  │
  ├─→ SEARCH BY KEYWORD:
  │   ├── Type in search bar
  │   ├── Search checks:
  │   │   ├── Title (all languages)
  │   │   ├── Authors
  │   │   ├── Keywords
  │   │   ├── Abstract
  │   │   └── Description
  │   └── Results update in real-time
  │
  ├─→ FILTER BY CATEGORY:
  │   ├── Click category dropdown
  │   ├── Select:
  │   │   ├── All Categories
  │   │   ├── Marine Ecology
  │   │   ├── Oceanography
  │   │   ├── Fisheries
  │   │   ├── Climate Change
  │   │   ├── Marine Pollution
  │   │   ├── Coastal Management
  │   │   ├── Marine Technology
  │   │   └── Policy & Law
  │   └── Grid updates with filtered papers
  │
  ├─→ FILTER BY LANGUAGE:
  │   ├── Click language dropdown
  │   ├── Select:
  │   │   ├── All Languages
  │   │   ├── English
  │   │   ├── Sinhala
  │   │   └── Tamil
  │   └── Shows papers with content in that language
  │
  └─→ SORT RESULTS:
      ├── Click sort dropdown
      ├── Select:
      │   ├── Newest First
      │   ├── Oldest First
      │   ├── Most Viewed
      │   └── Most Downloaded
      └── Papers reorder accordingly
```

---

### 6️⃣ Role-Based Access Control

```
User Attempts Action
  │
  ├─→ CHECK USER ROLE:
  │
  ├─→ PUBLIC (Not Logged In):
  │   ├── ✅ Browse papers
  │   ├── ✅ View abstracts
  │   ├── ✅ Use search
  │   ├── ❌ Read full content
  │   ├── ❌ Download PDFs
  │   └── ❌ Upload papers
  │
  ├─→ STUDENT:
  │   ├── ✅ Browse papers
  │   ├── ✅ View abstracts
  │   ├── ✅ Use search
  │   ├── ✅ Read full content
  │   ├── ✅ Download PDFs
  │   ├── ✅ Bookmark papers
  │   └── ❌ Upload papers
  │
  ├─→ RESEARCHER:
  │   ├── ✅ All Student permissions
  │   ├── ✅ Upload papers
  │   ├── ✅ Edit own papers
  │   └── ❌ Edit others' papers
  │
  ├─→ PROFESSOR:
  │   ├── ✅ All Researcher permissions
  │   ├── ✅ Upload papers
  │   ├── ✅ Edit own papers
  │   └── ❌ Edit others' papers
  │
  └─→ ADMIN:
      ├── ✅ All permissions
      ├── ✅ Edit any paper
      ├── ✅ Delete any paper
      └── ✅ Manage users
```

---

### 7️⃣ Data Flow Architecture

```
┌─────────────────────────────────────────────────┐
│                  USER BROWSER                   │
│  ┌───────────────────────────────────────────┐  │
│  │         React Application                 │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  ResearchPortalMain Component       │  │  │
│  │  │  ├── SearchBar                      │  │  │
│  │  │  ├── AdminUpload                    │  │  │
│  │  │  └── ContentReader                  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│           FIREBASE SERVICES                     │
│  ┌───────────────────────────────────────────┐  │
│  │  Authentication                           │  │
│  │  ├── User Login/Register                 │  │
│  │  ├── Role Management                     │  │
│  │  └── Session Tokens                      │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  Cloud Firestore                         │  │
│  │  ├── Collection: researchContent         │  │
│  │  │   ├── Document: paper1                │  │
│  │  │   ├── Document: paper2                │  │
│  │  │   └── Document: paper3                │  │
│  │  └── Collection: userBookmarks           │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  Cloud Storage                           │  │
│  │  └── Folder: research-content/           │  │
│  │      ├── paper1.pdf                      │  │
│  │      ├── paper2.pdf                      │  │
│  │      └── paper3.pdf                      │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

### 8️⃣ Multilingual Content Flow

```
User Selects Language (EN/SI/TA)
  │
  ├─→ Language Preference Saved
  │
  ├─→ Portal UI Updates:
  │   ├── Navigation
  │   ├── Buttons
  │   ├── Labels
  │   └── Messages
  │
  ├─→ Paper Content Displays:
  │   ├── Check if content exists in selected language
  │   │
  │   ├─→ IF EXISTS:
  │   │   └── Show content in selected language
  │   │
  │   └─→ IF NOT EXISTS:
  │       └── Fallback to English
  │
  └─→ User Can Switch Language Anytime
      └─→ Content Updates Instantly
```

---

### 9️⃣ PDF Upload & Download Flow

```
UPLOAD FLOW:
  │
  ├─→ User Selects PDF File
  │
  ├─→ Validate:
  │   ├── File type = PDF?
  │   ├── File size < 10MB?
  │   └── File readable?
  │
  ├─→ Upload to Firebase Storage:
  │   ├── Path: research-content/{timestamp}_{filename}
  │   └── Get Download URL
  │
  ├─→ Save URL to Firestore:
  │   ├── fileURL: "https://storage..."
  │   └── fileName: "original-name.pdf"
  │
  └─→ Success

DOWNLOAD FLOW:
  │
  ├─→ User Clicks "Download PDF"
  │
  ├─→ Check Authentication
  │   ├── IF NOT LOGGED IN: Show login prompt
  │   └── IF LOGGED IN: Continue
  │
  ├─→ Increment Download Counter
  │
  ├─→ Fetch PDF from Storage
  │
  └─→ Browser Downloads File
```

---

### 🔟 Error Handling Flow

```
User Action
  │
  ├─→ Try Operation
  │
  ├─→ IF SUCCESS:
  │   └── Show Success Message
  │       └── Update UI
  │
  └─→ IF ERROR:
      │
      ├─→ Permission Denied:
      │   ├── Show: "Please login to access"
      │   └── Redirect to login
      │
      ├─→ Network Error:
      │   ├── Show: "Connection issue"
      │   └── Retry button
      │
      ├─→ Validation Error:
      │   ├── Highlight invalid fields
      │   └── Show error messages
      │
      ├─→ File Too Large:
      │   ├── Show: "File must be < 10MB"
      │   └── Clear file input
      │
      └─→ Unknown Error:
          ├── Log to console
          ├── Show: "Something went wrong"
          └── Contact support link
```

---

## 📊 System States Diagram

```
┌─────────────────────────────────────────────────┐
│              PORTAL STATES                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  LOADING STATE:                                 │
│  ├── Show spinner                               │
│  └── Fetch data from Firestore                 │
│                                                 │
│  EMPTY STATE:                                   │
│  ├── No papers found                            │
│  ├── Show helpful message                       │
│  └── Upload instructions (if researcher)        │
│                                                 │
│  CONTENT STATE:                                 │
│  ├── Display papers grid                        │
│  ├── Show search/filters                        │
│  └── Enable interactions                        │
│                                                 │
│  ERROR STATE:                                   │
│  ├── Show error message                         │
│  ├── Retry button                               │
│  └── Fallback to cached data                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 User Journey Map

### Journey 1: Student Reading Research

```
1. Discovery
   └─→ Google Search → Find Portal

2. Browse
   └─→ See papers → Use search

3. Barrier
   └─→ Can't read full content

4. Registration
   └─→ Register as Student

5. Access
   └─→ Read full papers

6. Engagement
   └─→ Download PDFs → Bookmark
```

### Journey 2: Researcher Publishing

```
1. Preparation
   └─→ Complete research → Write paper

2. Registration
   └─→ Register as Researcher

3. Upload
   └─→ Fill trilingual form → Upload PDF

4. Publication
   └─→ Paper goes live instantly

5. Tracking
   └─→ Monitor views/downloads

6. Updates
   └─→ Edit paper → Add translations
```

---

## 📈 Metrics & Analytics Flow

```
User Interaction
  │
  ├─→ VIEW PAPER:
  │   └─→ Increment views counter
  │
  ├─→ DOWNLOAD PDF:
  │   └─→ Increment downloads counter
  │
  ├─→ BOOKMARK:
  │   └─→ Increment bookmarks counter
  │
  └─→ SEARCH:
      └─→ Log search query (future feature)
```

---

**Quick Access URLs:**

- **Portal**: https://nara-web-73384.web.app/research-excellence-portal
- **Register**: https://nara-web-73384.web.app/register
- **Login**: https://nara-web-73384.web.app/login

**Need Help?** Check the full guide: `/docs/RESEARCH_PORTAL_GUIDE.md`
