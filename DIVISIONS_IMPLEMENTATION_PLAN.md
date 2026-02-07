# 🚀 NARA Divisions System - Implementation Plan

## 📋 Executive Summary

Creating a comprehensive Divisions/Services system for NARA's 9 core work areas with:
- ✅ 9 individual division pages
- ✅ 1 main divisions hub
- ✅ Admin panel with full CRUD
- ✅ Multilingual support (EN/SI/TA)
- ✅ Firebase integration
- ✅ Dynamic content management

**Total Pages to Build:** 11 pages
**Estimated Code:** ~15,000 lines
**Time to Complete:** 3-4 hours
**Complexity:** HIGH

---

## 🎯 Smart Approach: Modular System

Instead of creating 11 separate pages, we'll build:

### **1. One Template Component** (`DivisionPage.jsx`)
Reusable template that renders any division based on `divisionId`

### **2. Data-Driven Configuration** (`divisionsConfig.js`)
All 9 divisions defined in one config file with:
- Division metadata
- Icons, colors, images
- Content structure
- Default text (multilingual)

### **3. Dynamic Content from Firebase**
Admin can override default content with custom data

### **4. One Admin Panel** (`DivisionsAdmin.jsx`)
Manages all 9 divisions from single interface

---

## 📊 9 NARA Divisions

### **Division 1: Marine & Inland Fisheries Science** 🐟
**ID:** `fisheries-science`
**Focus:** Stock assessments, pelagic/demersal studies, shark plans, tuna/IOTC
**Key Services:**
- Fish stock assessment reports
- Sustainable fishing advice
- IOTC data management
- Shark conservation planning

### **Division 2: Marine Biology & Ecosystems** 🐋
**ID:** `marine-biology`
**Focus:** Mammals, corals, seagrasses, strandings, forensics
**Key Services:**
- Marine mammal rescue
- Coral reef monitoring
- Seagrass conservation
- Illegal fishing investigation
- Stranding response

### **Division 3: Inland Aquatic Resources & Aquaculture** 🦐
**ID:** `aquaculture`
**Focus:** Ornamental fish, shrimp, sea bass, sea cucumber, seaweed, tissue culture
**Key Services:**
- Aquaculture training
- Breeding technology
- Hatchery management
- Tissue culture services
- Farmer support

### **Division 4: Fishing Technology** 🎣
**ID:** `fishing-technology`
**Focus:** Gear development, bycatch mitigation, acoustic solutions
**Key Services:**
- Fishing gear testing
- Bycatch reduction methods
- Acoustic pinger deployment
- Technology transfer
- Gear design consultation

### **Division 5: Post-Harvest & Quality Assurance** 🔬
**ID:** `quality-assurance`
**Focus:** ISO 17025 labs, microbiology, histamine, training
**Key Services:**
- Laboratory testing (microbiological, chemical)
- Quality certification
- Histamine analysis
- Industry training
- Export quality compliance

### **Division 6: Socio-Economics & Marketing** 💼
**ID:** `socio-economics`
**Focus:** Industry outlook, value chain, fisher welfare, markets
**Key Services:**
- Market research
- Value chain analysis
- Fisher welfare programs
- Economic impact assessments
- Marketing strategy support

### **Division 7: Hydrography & Nautical Charts** 🗺️
**ID:** `hydrography`
**Focus:** ENCs, bathymetry, harbour surveys, GEBCO/Seabed 2030
**Key Services:**
- Nautical chart production
- Bathymetric surveys
- Harbour surveys
- ENC updates
- Chart distribution

### **Division 8: Environmental Monitoring & Advisory** 🌊
**ID:** `environmental-monitoring`
**Focus:** Water quality, algal blooms, incident response, RV Samudrika
**Key Services:**
- Water quality testing
- Algal bloom monitoring
- Environmental impact assessments
- Incident response (X-Press Pearl)
- Research vessel operations

### **Division 9: Information & Outreach** 📚
**ID:** `information-outreach`
**Focus:** NARA Journal, scientific sessions, training, regional centers
**Key Services:**
- NARA Journal publication
- Scientific conferences
- Training programs
- Library services
- Regional center coordination

---

## 🗄️ Firebase Data Structure

### **Collection: `divisions`**
```javascript
{
  id: "fisheries-science",
  nameEN: "Marine & Inland Fisheries Science",
  nameSI: "සමුද්‍ර සහ අභ්‍යන්තර මත්ස්‍ය විද්‍යාව",
  nameTA: "கடல் மற்றும் உள்நாட்டு மீன்வள அறிவியல்",

  descriptionEN: "Comprehensive research...",
  descriptionSI: "විස්තීර්ණ පර්යේෂණ...",
  descriptionTA: "விரிவான ஆராய்ச்சி...",

  icon: "Fish",
  color: "blue",
  heroImage: "url_to_image",

  focusAreas: [
    {
      titleEN: "Stock Assessments",
      titleSI: "තොග තක්සේරු",
      titleTA: "பங்கு மதிப்பீடுகள்",
      descriptionEN: "...",
      descriptionSI: "...",
      descriptionTA: "..."
    }
  ],

  services: [...],
  facilities: [...],
  teamMembers: [...],
  publications: [...],
  projects: [...],

  contactEmail: "fisheries@nara.ac.lk",
  contactPhone: "+94 11 2521000",
  location: "NARA Headquarters, Colombo",

  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **Collection: `division_projects`**
```javascript
{
  divisionId: "fisheries-science",
  titleEN: "Indian Ocean Tuna Management",
  titleSI: "ඉන්දියන් සාගර ටූනා කළමනාකරණය",
  titleTA: "இந்தியப் பெருங்கடல் சூரை மேலாண்மை",

  descriptionEN: "...",
  descriptionSI: "...",
  descriptionTA: "...",

  status: "Active",  // Active, Completed, Planning
  startDate: "2023-01-01",
  endDate: "2025-12-31",
  budget: "$500,000",
  fundingSource: "IOTC",
  leadResearcher: "Dr. Priya Fernando",

  objectives: [...],
  outcomes: [...],
  images: [...],

  createdAt: timestamp
}
```

### **Collection: `division_team`**
```javascript
{
  divisionId: "fisheries-science",
  nameEN: "Dr. Priya Fernando",
  nameSI: "ආචාර්ය ප්‍රියා ප්‍රනාන්දු",
  nameTA: "டாக்டர் பிரியா பெர்னாண்டோ",

  position: "Senior Researcher",
  photoUrl: "url",
  email: "priya.fernando@nara.ac.lk",
  phone: "+94 11 2521234",

  bioEN: "...",
  bioSI: "...",
  bioTA: "...",

  specialization: "Fisheries Management",
  qualifications: ["PhD Marine Biology", "MSc Fisheries"],

  publications: 45,
  experience: "15 years"
}
```

---

## 🎨 Page Layout (Template)

### **1. Hero Section**
- Division name (all 3 languages)
- Tagline
- Hero image/video
- Quick stats
- CTA buttons

### **2. About Section**
- What we do
- Mission & vision
- Key achievements

### **3. Research Focus Areas**
- Grid of focus areas
- Icons & descriptions
- Interactive cards

### **4. Active Projects**
- Project cards with status
- Timeline
- Team & budget info
- View details modal

### **5. Our Team**
- Team member cards
- Photos & bios
- Contact info
- Expertise areas

### **6. Services We Offer**
- Service catalog
- How to request
- Pricing (if applicable)
- Contact forms

### **7. Publications & Resources**
- Recent publications
- Reports & data
- Downloads
- External links

### **8. Facilities & Equipment**
- Photos of labs/vessels
- Equipment list
- Capabilities
- Access information

### **9. Success Stories**
- Case studies
- Impact metrics
- Testimonials
- Media coverage

### **10. Contact & Collaborate**
- Contact information
- Location map
- Collaboration opportunities
- Request service form

---

## 🔧 Technical Components

### **Core Files:**
1. `src/pages/nara-divisions-hub/index.jsx` - Main hub (grid of 9 divisions)
2. `src/pages/division-page/index.jsx` - Template for individual divisions
3. `src/pages/admin/DivisionsAdmin.jsx` - Admin panel
4. `src/services/divisionsService.js` - Firebase operations
5. `src/data/divisionsConfig.js` - Default division data

### **Admin Features:**
- Select division from dropdown
- Edit all content in 3 languages
- Add/edit/delete projects
- Manage team members
- Upload images/documents
- Publish/unpublish divisions
- Preview before publishing

---

## 🌍 Multilingual Implementation

### **Method 1: Firebase (Recommended)**
Store all 3 languages in same document:
```javascript
{
  titleEN: "Marine Biology",
  titleSI: "සමුද්‍ර ජීව විද්‍යාව",
  titleTA: "கடல் உயிரியல்"
}
```

### **Method 2: i18n Files**
Default text in translation files:
```javascript
// en/divisions.json
{
  "fisheries": {
    "name": "Fisheries Science",
    "tagline": "Sustainable fish stocks..."
  }
}
```

### **Admin UI:**
Show 3 text inputs for each field:
```
Title (EN): [________________]
Title (SI): [________________]
Title (TA): [________________]
```

---

## 📱 Responsive Design

- **Mobile:** Stacked layout, single column
- **Tablet:** 2-column grid
- **Desktop:** 3-column grid, side navigation

---

## 🚀 Implementation Priority

### **Phase 1: Core Structure** (1 hour)
1. ✅ Create divisions hub page
2. ✅ Create division template page
3. ✅ Add routes
4. ✅ Update navbar

### **Phase 2: Content & Data** (1 hour)
1. ✅ Create divisionsConfig.js with all 9 divisions
2. ✅ Add default content (EN/SI/TA)
3. ✅ Add Firebase collections
4. ✅ Create Firestore rules

### **Phase 3: Admin Panel** (1 hour)
1. ✅ Build admin interface
2. ✅ CRUD operations
3. ✅ Multilingual forms
4. ✅ Image uploads

### **Phase 4: Polish & Deploy** (30 min)
1. ✅ Test all features
2. ✅ Add translations
3. ✅ Build & deploy
4. ✅ Documentation

---

## 💡 Smart Features

1. **Auto-Translation Suggestion** - Suggest translations using Google Translate API
2. **Content Templates** - Pre-filled templates for common sections
3. **Bulk Import** - Import team/projects from CSV
4. **Analytics** - Track views per division
5. **Search** - Global search across all divisions
6. **Comparison** - Compare divisions side-by-side

---

## 📊 Success Metrics

- All 9 divisions have live pages
- Admin can manage content easily
- All content available in 3 languages
- Mobile-responsive
- Fast loading (<3 seconds)
- SEO optimized

---

## 🎯 Quick Start Commands

```bash
# Create division pages
mkdir -p src/pages/{nara-divisions-hub,division-page}
mkdir -p src/pages/admin

# Create services
touch src/services/divisionsService.js
touch src/data/divisionsConfig.js

# Update routes
# Edit src/Routes.jsx

# Deploy
npm run build
firebase deploy
```

---

This system will provide NARA with a **world-class divisions showcase** that is:
- ✅ Easy to manage
- ✅ Fully multilingual
- ✅ Professional design
- ✅ Mobile-optimized
- ✅ SEO-friendly
- ✅ Scalable

**Ready to build!** 🚀
