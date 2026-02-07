# 🔍 NARA Divisions - Gap Analysis

## ❌ Missing Pages (TO BE CREATED)

Based on NARA's 9 core work areas, these dedicated division pages are **MISSING**:

1. ❌ **Marine & Inland Fisheries Science Division**
   - Stock assessments
   - Pelagic/demersal studies
   - Shark conservation plans
   - Tuna/IOTC data management

2. ❌ **Marine Biology & Ecosystems Division**
   - Marine mammals research
   - Coral reef studies
   - Seagrass conservation
   - Strandings response
   - Environmental forensics for illegal fishing

3. ❌ **Inland Aquatic Resources & Aquaculture Division**
   - Ornamental fish breeding
   - Shrimp/sea bass/sea cucumber farming
   - Seaweed cultivation
   - Aquatic plant tissue culture

4. ❌ **Fishing Technology Division**
   - Gear development & testing
   - Bycatch mitigation
   - Depredation solutions (acoustic pingers)
   - Sustainable fishing methods

5. ❌ **Post-Harvest & Quality Assurance Division**
   - ISO/IEC 17025 accredited laboratories
   - Microbiology testing
   - Histamine analysis
   - Industry training programs

6. ❌ **Socio-Economics & Marketing Division**
   - Industry outlook reports
   - Value chain analysis
   - Fisher welfare programs
   - Market intelligence

7. ❌ **Hydrography & Nautical Charts Division**
   - Electronic Navigational Charts (ENCs)
   - Bathymetric surveys
   - Coastal/harbour surveys
   - Chart production
   - GEBCO/Seabed 2030 participation

8. ❌ **Environmental Monitoring & Advisory Division**
   - Water quality monitoring
   - Algal bloom tracking
   - Incident response
   - X-Press Pearl post-survey sampling
   - RV Samudrika operations

9. ❌ **Information & Outreach Division**
   - NARA Journal publication
   - Scientific sessions
   - Training programs
   - Regional research centers

---

## ✅ Existing Pages (Already Built)

- ✅ Research Excellence Portal (general research)
- ✅ Maritime Services Hub (some services)
- ✅ Learning Development Academy (training)
- ✅ Media Gallery (outreach)
- ✅ Knowledge Discovery Center (publications)

---

## 🎯 What Needs to Be Built

### **1. Main Divisions Hub Page**
- Overview of all 9 divisions
- Interactive cards with icons
- Quick navigation to each division
- Multilingual support (EN/SI/TA)
- Admin-managed content

### **2. Individual Division Pages (9 pages)**
Each with:
- Division overview
- Research areas
- Current projects
- Team members
- Publications
- Facilities
- Services offered
- Contact information
- Photo gallery
- Success stories

### **3. Admin Panel for Divisions**
- Manage division information
- Add/edit projects
- Update team members
- Upload publications
- Manage services
- Multilingual content management

### **4. Firebase Collections**
- `divisions` - Main division data
- `division_projects` - Projects per division
- `division_team` - Team members
- `division_services` - Services offered
- `division_publications` - Division publications
- `division_facilities` - Facilities & equipment

---

## 📊 Proposed Structure

```
/divisions (Main Hub)
  ├── /fisheries-science
  ├── /marine-biology-ecosystems
  ├── /aquaculture
  ├── /fishing-technology
  ├── /quality-assurance
  ├── /socio-economics
  ├── /hydrography
  ├── /environmental-monitoring
  └── /information-outreach
```

---

## 🌍 Multilingual Requirements

All content must support:
- **English** (EN)
- **Sinhala** (SI)
- **Tamil** (TA)

Every field in admin panel must have 3 language inputs.

---

## 🎨 Features to Include

### **Each Division Page:**
✅ Hero section with division name & tagline
✅ About section (what we do)
✅ Research focus areas
✅ Active projects (from Firebase)
✅ Team members (from Firebase)
✅ Publications library
✅ Services we offer
✅ Facilities & equipment
✅ Success stories/case studies
✅ Photo gallery
✅ Contact information
✅ Related resources
✅ CTA (Join us, Collaborate, Request service)

### **Admin Features:**
✅ CRUD operations for all content
✅ Multilingual text editor
✅ Image upload
✅ Document upload
✅ Team member management
✅ Project status tracking
✅ Publication management
✅ Service catalog management

---

## 🔧 Technical Implementation

1. **Main Components:**
   - `DivisionsHub.jsx` - Main landing page
   - `DivisionPage.jsx` - Reusable template
   - `DivisionsAdmin.jsx` - Admin panel
   - `DivisionForm.jsx` - Edit forms

2. **Services:**
   - `divisionsService.js` - Firebase operations
   - Multilingual text handling
   - Dynamic content loading

3. **Routes:**
   - `/divisions` - Main hub
   - `/divisions/:divisionId` - Individual pages
   - `/admin/divisions` - Admin panel

4. **Navbar Update:**
   - Add "Divisions" to main menu
   - Dropdown with 9 divisions

---

This analysis shows we need to build **9 new division pages** + **1 hub page** + **admin panel** = **11 new pages total**.
