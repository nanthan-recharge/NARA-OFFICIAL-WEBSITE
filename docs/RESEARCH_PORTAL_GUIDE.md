# 📚 Research Excellence Portal - Complete Guide

## 🌟 Overview

The Research Excellence Portal is a trilingual (English/Sinhala/Tamil) platform for publishing and accessing marine research papers with authentication-based access control.

**Live URL**: https://nara-web-73384.web.app/research-excellence-portal

---

## 👥 User Roles & Permissions

### 📊 Permission Matrix

| Feature | Public | Student | Researcher | Professor | Admin |
|---------|--------|---------|------------|-----------|-------|
| Browse Papers | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Abstract | ✅ | ✅ | ✅ | ✅ | ✅ |
| Read Full Content | ❌ | ✅ | ✅ | ✅ | ✅ |
| Download PDF | ❌ | ✅ | ✅ | ✅ | ✅ |
| Search & Filter | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload Papers | ❌ | ❌ | ✅ | ✅ | ✅ |
| Edit Own Papers | ❌ | ❌ | ✅ | ✅ | ✅ |
| Edit Any Paper | ❌ | ❌ | ❌ | ❌ | ✅ |
| Delete Papers | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🚀 Getting Started

### Step 1: Registration

```
┌─────────────────────────────────────┐
│  1. Visit Registration Page         │
│  https://nara-web-73384.web.app/    │
│         register                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  2. Fill Registration Form          │
│  • First Name & Last Name           │
│  • Email & Password                 │
│  • Phone (optional)                 │
│  • Select Role:                     │
│    - Student                        │
│    - Researcher                     │
│    - Professor                      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  3. Complete Registration           │
│  • Verify email (if required)       │
│  • Login with credentials           │
└─────────────────────────────────────┘
```

### Step 2: Accessing the Portal

**URL**: https://nara-web-73384.web.app/research-excellence-portal

**What You'll See:**
- 🔍 Search bar with filters
- 📑 Research papers grid
- 🔼 Upload button (Researchers/Professors only)
- 🌐 Language switcher (EN/සිං/த)

---

## 📝 Uploading Research Papers

### For Researchers & Professors

#### Upload Process Flow

```
┌──────────────────────────────────────────────┐
│  1. Click "Upload New Paper" Button          │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  2. Fill Trilingual Form                     │
│                                              │
│  REQUIRED FIELDS:                            │
│  ├── Title (EN/SI/TA)                        │
│  ├── Description (EN/SI/TA)                  │
│  ├── Abstract (EN/SI/TA)                     │
│  ├── Full Content (EN/SI/TA)                 │
│  ├── Authors (comma-separated)               │
│  ├── Category                                │
│  ├── Keywords/Tags                           │
│  └── Publication Date                        │
│                                              │
│  OPTIONAL FIELDS:                            │
│  ├── PDF File Upload                         │
│  ├── DOI                                     │
│  ├── Journal Name                            │
│  ├── Volume & Issue                          │
│  └── Page Numbers                            │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  3. Upload PDF (Optional)                    │
│  • Max size: 10MB                            │
│  • Format: PDF only                          │
│  • Stored in Firebase Storage                │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  4. Submit                                   │
│  • Paper published instantly                 │
│  • Appears in portal grid                    │
│  • Searchable immediately                    │
└──────────────────────────────────────────────┘
```

---

## 📂 Research Categories

### Available Categories

1. **🐠 Marine Ecology**
   - Biodiversity studies
   - Ecosystem research
   - Species conservation
   - Habitat analysis

2. **🌊 Oceanography**
   - Physical oceanography
   - Ocean currents
   - Marine geology
   - Hydrography

3. **🎣 Fisheries**
   - Sustainable fishing
   - Aquaculture
   - Fish stock assessment
   - Fishing technology

4. **🌡️ Climate Change**
   - Ocean warming
   - Coral bleaching
   - Sea level rise
   - Climate impacts

5. **🏭 Marine Pollution**
   - Plastic pollution
   - Oil spills
   - Water quality
   - Contamination studies

6. **🏖️ Coastal Management**
   - Coastal erosion
   - Beach management
   - Coastal development
   - Shoreline protection

7. **🤖 Marine Technology**
   - Research equipment
   - Monitoring systems
   - Marine robotics
   - Instrumentation

8. **⚖️ Policy & Law**
   - Maritime law
   - Conservation policy
   - Regulations
   - Governance

---

## 🔍 Search & Discovery

### Search Features

```
┌─────────────────────────────────────────────┐
│  SEARCH BAR                                 │
│  ┌───────────────────────────────────────┐  │
│  │ 🔍 Search by title, authors, keywords│  │
│  └───────────────────────────────────────┘  │
│                                             │
│  FILTERS:                                   │
│  ├── 📁 Category Filter                     │
│  │   └── All / Marine Ecology / etc.       │
│  ├── 🌐 Language Filter                     │
│  │   └── All / English / Sinhala / Tamil   │
│  └── 🔄 Sort By                             │
│      ├── Newest First                       │
│      ├── Oldest First                       │
│      ├── Most Viewed                        │
│      └── Most Downloaded                    │
└─────────────────────────────────────────────┘
```

### Search Algorithm

The search looks for matches in:
- ✅ Paper title (all languages)
- ✅ Authors names
- ✅ Keywords/tags
- ✅ Abstract text
- ✅ Description

**Real-time**: Results update as you type!

---

## 📖 Reading Experience

### For Unauthenticated Users

```
┌─────────────────────────────────────┐
│  Research Paper Card                │
│  ┌───────────────────────────────┐  │
│  │ 📄 Title                      │  │
│  │ 👤 Authors                    │  │
│  │ 📝 Abstract (preview)         │  │
│  │                               │  │
│  │ ┌───────────────────────────┐ │  │
│  │ │ 🔒 Login to Read Full     │ │  │
│  │ │    Paper                  │ │  │
│  │ └───────────────────────────┘ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### For Authenticated Users

```
┌─────────────────────────────────────────────┐
│  Full Paper View                            │
│  ┌───────────────────────────────────────┐  │
│  │ 📄 Complete Title                     │  │
│  │ 👤 Authors                            │  │
│  │ 📅 Publication Date                   │  │
│  │ 🏷️ Category & Keywords                │  │
│  │                                       │  │
│  │ TABS:                                 │  │
│  │ ┌─────┬──────────┬────────────┐      │  │
│  │ │ 📝  │ 📄       │ 📚         │      │  │
│  │ │ Abs │ Full Text│ References │      │  │
│  │ └─────┴──────────┴────────────┘      │  │
│  │                                       │  │
│  │ ACTIONS:                              │  │
│  │ ├── 📥 Download PDF                   │  │
│  │ ├── 📋 Copy Citation                  │  │
│  │ ├── 🔖 Bookmark                       │  │
│  │ └── 👁️ View Count: 245                │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🌐 Multilingual Support

### Language System

```
┌──────────────────────────────────────┐
│  Content Storage Structure           │
│                                      │
│  {                                   │
│    "title": {                        │
│      "en": "English Title",          │
│      "si": "සිංහල මාතෘකාව",         │
│      "ta": "தமிழ் தலைப்பு"           │
│    },                                │
│    "description": {                  │
│      "en": "English description",    │
│      "si": "සිංහල විස්තරය",         │
│      "ta": "தமிழ் விளக்கம்"          │
│    },                                │
│    "abstract": { ... },              │
│    "fullContent": { ... }            │
│  }                                   │
└──────────────────────────────────────┘
```

### Language Switching

- **Top Navigation**: Language selector (EN/සිං/த)
- **Automatic Fallback**: If content not available in selected language, shows English
- **User Preference**: Language choice saved in browser

---

## 📊 Analytics & Tracking

### Metrics Tracked

```
For Each Paper:
├── 👁️ Views: Incremented on each read
├── 📥 Downloads: Tracked when PDF downloaded
├── 🔖 Bookmarks: User bookmark count
└── 📅 Last Updated: Timestamp
```

### Author Dashboard (Coming Soon)

- View statistics for your papers
- Track engagement metrics
- See download trends
- Monitor citations

---

## 🔐 Security & Privacy

### Authentication

```
┌────────────────────────────────────┐
│  Firebase Authentication           │
│  ├── Email/Password                │
│  ├── Email Verification            │
│  └── Role-Based Access Control     │
└────────────────────────────────────┘
```

### Data Security

```
Firestore Security Rules:
├── Public: Can browse titles/abstracts
├── Authenticated: Can read full content
├── Researchers/Professors: Can upload
├── Authors: Can edit own papers
└── Admins: Full access
```

### Content Protection

- ✅ Full content requires authentication
- ✅ PDF downloads tracked
- ✅ No anonymous uploads
- ✅ Author verification
- ✅ Admin moderation available

---

## 💾 Data Structure

### Research Paper Document

```json
{
  "id": "auto-generated-id",
  "title": {
    "en": "Paper Title in English",
    "si": "සිංහල මාතෘකාව",
    "ta": "தமிழ் தலைப்பு"
  },
  "description": {
    "en": "Brief description",
    "si": "සංක්ෂිප්ත විස්තරය",
    "ta": "சுருக்கமான விளக்கம்"
  },
  "abstract": {
    "en": "Research abstract...",
    "si": "පර්යේෂණ සාරාංශය...",
    "ta": "ஆராய்ச்சி சுருக்கம்..."
  },
  "fullContent": {
    "en": "Complete paper content...",
    "si": "සම්පූර්ණ පර්යේෂණ අන්තර්ගතය...",
    "ta": "முழு ஆராய்ச்சி உள்ளடக்கம்..."
  },
  "authors": ["Dr. Name 1", "Prof. Name 2"],
  "category": "marineEcology",
  "tags": ["biodiversity", "conservation"],
  "publicationDate": "2024-03-15",
  "doi": "10.1234/journal.2024.001",
  "journal": "Journal Name",
  "volume": "45",
  "issue": "2",
  "pages": "123-145",
  "fileURL": "https://storage.googleapis.com/...",
  "fileName": "research-paper.pdf",
  "language": "en",
  "status": "published",
  "uploadedBy": "user-id",
  "createdAt": "2024-03-15T10:30:00Z",
  "updatedAt": "2024-03-15T10:30:00Z",
  "views": 245,
  "downloads": 67,
  "bookmarks": 23
}
```

---

## 🎨 UI Components

### Research Card

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Category Color Bar
│                                     │
│  📄 Paper Title Here                │
│                                     │
│  👤 Dr. Author 1, Prof. Author 2    │
│                                     │
│  📝 Brief abstract preview text     │
│     that gives readers an idea...   │
│                                     │
│  🏷️ tag1 • tag2 • tag3              │
│                                     │
│  📅 Mar 15, 2024  👁️ 245  📥 67     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Read Full Paper  →        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Upload Form

```
┌──────────────────────────────────────────┐
│  📤 Upload New Research Paper            │
├──────────────────────────────────────────┤
│                                          │
│  ENGLISH CONTENT                         │
│  ┌────────────────────────────────────┐  │
│  │ Title                              │  │
│  ├────────────────────────────────────┤  │
│  │ Description                        │  │
│  ├────────────────────────────────────┤  │
│  │ Abstract                           │  │
│  ├────────────────────────────────────┤  │
│  │ Full Content                       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  SINHALA CONTENT (සිංහල)                │
│  ┌────────────────────────────────────┐  │
│  │ මාතෘකාව                           │  │
│  ├────────────────────────────────────┤  │
│  │ විස්තරය                            │  │
│  └────────────────────────────────────┘  │
│                                          │
│  TAMIL CONTENT (தமிழ்)                   │
│  ┌────────────────────────────────────┐  │
│  │ தலைப்பு                             │  │
│  ├────────────────────────────────────┤  │
│  │ விளக்கம்                            │  │
│  └────────────────────────────────────┘  │
│                                          │
│  METADATA                                │
│  ┌────────────────────────────────────┐  │
│  │ Authors (comma-separated)          │  │
│  ├────────────────────────────────────┤  │
│  │ Category: [Select]                 │  │
│  ├────────────────────────────────────┤  │
│  │ Keywords                           │  │
│  ├────────────────────────────────────┤  │
│  │ DOI, Journal, Volume, etc.         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  PDF UPLOAD                              │
│  ┌────────────────────────────────────┐  │
│  │  📎 Drag & drop or click to upload │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │   Upload Research Paper            │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 🛠️ Technical Architecture

### Technology Stack

```
Frontend:
├── React 18
├── React Router DOM
├── Framer Motion (animations)
├── Lucide React (icons)
├── TailwindCSS (styling)
└── react-i18next (translations)

Backend:
├── Firebase Authentication
├── Cloud Firestore (database)
├── Firebase Storage (file storage)
└── Firebase Hosting

Build Tools:
├── Vite
└── npm
```

### File Structure

```
src/
├── pages/
│   └── research-excellence-portal/
│       ├── ResearchPortalMain.jsx
│       ├── components/
│       │   ├── AdminUpload.jsx
│       │   ├── ContentReader.jsx
│       │   └── SearchBar.jsx
│       └── index.jsx
├── services/
│   └── researchContentService.js
├── locales/
│   ├── en/researchPortal.json
│   ├── si/researchPortal.json
│   └── ta/researchPortal.json
└── contexts/
    └── FirebaseAuthContext.jsx
```

---

## 📱 Responsive Design

### Breakpoints

```
Mobile:     < 768px   (1 column grid)
Tablet:     768-1024px (2 column grid)
Desktop:    > 1024px   (3 column grid)
```

### Mobile Features

- ✅ Touch-optimized interface
- ✅ Collapsible filters
- ✅ Swipeable tabs
- ✅ Responsive typography
- ✅ Mobile-friendly forms

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Can't See Full Content

**Problem**: "Login to read full paper" message appears
**Solution**: 
- Register/Login at: https://nara-web-73384.web.app/register
- Verify email if required
- Refresh the page

#### 2. Upload Button Not Visible

**Problem**: Can't find upload button
**Solution**:
- Check your role: Must be Researcher or Professor
- Login with correct account
- Contact admin to update role

#### 3. PDF Upload Fails

**Problem**: PDF won't upload
**Solution**:
- Check file size (max 10MB)
- Ensure file is PDF format
- Check internet connection
- Try smaller file

#### 4. Search Not Working

**Problem**: No results appear
**Solution**:
- Clear filters
- Try different keywords
- Check language filter
- Refresh page

#### 5. Content Not in My Language

**Problem**: Paper shows in English only
**Solution**:
- Content may not be translated yet
- System auto-falls back to English
- Authors can add translations later

---

## 📞 Support & Contact

### For Technical Issues

- **Firebase Console**: https://console.firebase.google.com/project/nara-web-73384
- **Check Firestore Rules**: Ensure permissions are correct
- **View Logs**: Check browser console for errors

### For Content Issues

- **Contact Admin**: Request role change
- **Report Issues**: Use feedback form
- **Request Features**: Submit suggestions

---

## 🎯 Best Practices

### For Authors

1. **Write Clear Titles**: Descriptive and searchable
2. **Complete All Languages**: Better accessibility
3. **Add Keywords**: Improves discoverability
4. **Include DOI**: Professional citation
5. **Upload PDF**: Provides complete reference
6. **Proofread**: Check all language versions

### For Readers

1. **Use Filters**: Narrow down results
2. **Bookmark Papers**: Save for later
3. **Download PDFs**: Offline access
4. **Cite Properly**: Use citation tool
5. **Share**: Help others discover research

---

## 📈 Future Enhancements

### Planned Features

- [ ] Advanced citation formats (APA, MLA, Chicago)
- [ ] Author profiles and dashboards
- [ ] Paper versioning
- [ ] Peer review system
- [ ] Social sharing
- [ ] Email notifications
- [ ] Related papers suggestions
- [ ] Export to reference managers
- [ ] Collaborative annotations
- [ ] Impact metrics

---

## 📄 License & Usage

### Content Rights

- Authors retain copyright
- Platform provides hosting
- Open access encouraged
- Proper attribution required

### Platform Usage

- Free for all users
- Academic use encouraged
- Commercial use: Contact admin
- Data export available

---

## 🎓 Quick Start Checklist

### For New Users

- [ ] Register account
- [ ] Verify email
- [ ] Complete profile
- [ ] Browse papers
- [ ] Try search
- [ ] Bookmark favorites
- [ ] Download PDFs

### For Researchers

- [ ] Register as Researcher/Professor
- [ ] Prepare paper content
- [ ] Translate to 3 languages
- [ ] Gather metadata (DOI, etc.)
- [ ] Prepare PDF
- [ ] Upload first paper
- [ ] Share with colleagues

---

## 📚 Additional Resources

### Documentation

- Firebase Documentation: https://firebase.google.com/docs
- React Documentation: https://react.dev
- TailwindCSS: https://tailwindcss.com

### Sample Data

- Location: `/scripts/sampleResearchData.json`
- Instructions: `/scripts/README.md`

---

## 🏆 Success Metrics

### Portal Statistics

```
📊 Track These Metrics:
├── Total Papers Published
├── Total Registered Users
├── Papers by Category
├── Most Viewed Papers
├── Most Downloaded Papers
├── User Engagement Rate
└── Search Query Analytics
```

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
**Portal URL**: https://nara-web-73384.web.app/research-excellence-portal

---

## 🎉 Conclusion

The Research Excellence Portal provides a comprehensive platform for sharing marine research in multiple languages. With robust authentication, intuitive search, and professional presentation, it serves the needs of researchers, professors, and students alike.

**Ready to start?** Visit the portal and upload your first research paper today! 🚀
