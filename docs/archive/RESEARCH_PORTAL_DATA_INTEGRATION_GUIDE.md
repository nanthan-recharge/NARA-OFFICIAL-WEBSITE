# Research Portal - Real Data Integration Guide

## 🎯 Current Status

**ALL DATA IS CURRENTLY MOCKUP/SAMPLE DATA**

The portal is fully functional with sample data, but needs to be connected to NARA's actual research database.

---

## 📊 What Data Sources You Need

### 1. **Publications Database**
You need a database or API with:
- Publication titles
- Authors (names, affiliations)
- Journal names
- Publication year
- DOI links
- Abstract text
- Citation counts (from Google Scholar API or Crossref)
- Download statistics
- Keywords/tags
- Research area classification
- Open access status
- PDF links

**Recommended Sources:**
- Internal NARA publication database
- Google Scholar API
- Crossref API
- ORCID API
- Scopus API
- Web of Science API

### 2. **Research Projects Database**
You need:
- Project titles
- Principal Investigators
- Team members
- Start/end dates
- Budget information
- Funding sources
- Project status
- Objectives
- Outcomes/achievements
- Partner organizations
- Milestones

**Source:**
- NARA internal project management system
- Grant management system
- Research administration database

### 3. **Collaboration Data**
You need:
- Partner institution names
- Contact information
- MoU agreements
- Joint publication counts
- Active projects together
- Collaboration history
- Focus areas

**Source:**
- NARA partnership database
- International agreements records
- Co-authorship data from publications

### 4. **Impact Metrics**
You need:
- Citation counts (real-time)
- H-index per researcher/team
- Download statistics
- Geographic distribution of citations
- Publication trends over time

**Recommended Sources:**
- Google Scholar Citations
- Dimensions.ai
- Altmetric
- Your website analytics

---

## 🔌 Integration Options

### **Option 1: Firebase/Firestore (Recommended for Start)**

**Benefits:**
- Easy to set up
- Real-time updates
- Free tier available
- Already using Firebase

**Setup:**
```javascript
// Create Firestore collections:
- publications
- projects
- partners
- researchers
- metrics
```

**Example Publication Document:**
```json
{
  "id": "pub_001",
  "title": "Real publication title",
  "authors": ["Dr. Name", "Dr. Name2"],
  "year": 2024,
  "journal": "Journal Name",
  "doi": "10.1234/journal.2024.001",
  "abstract": "Full abstract text...",
  "citations": 45,
  "downloads": 234,
  "tags": ["marine biology", "coral reefs"],
  "researchArea": "Marine Biology",
  "openAccess": true,
  "pdfUrl": "https://...",
  "createdAt": "2024-01-15"
}
```

### **Option 2: REST API Backend**

Create a Node.js/Express API:
```javascript
GET /api/publications?search=coral&year=2024
GET /api/projects?status=active
GET /api/partners?region=asia-pacific
GET /api/metrics/citations
GET /api/analytics/downloads
```

### **Option 3: External APIs (For Citations)**

**Google Scholar API** (via SerpAPI or ScraperAPI):
- Get real citation counts
- Track h-index
- Monitor publication metrics

**Crossref API** (Free):
- DOI metadata
- Citation data
- Publication information

---

## 🛠️ Step-by-Step Implementation

### **Phase 1: Data Collection (1-2 weeks)**

1. **Gather NARA Publications**
   - Export from current system
   - Create spreadsheet with all fields
   - Add DOIs for all publications
   - Classify by research area

2. **Collect Project Information**
   - List all active projects
   - Get project details from PIs
   - Document budgets and timelines
   - Map team members

3. **Document Partnerships**
   - List all partner institutions
   - Get contact information
   - Count joint publications
   - Document MoUs

### **Phase 2: Database Setup (3-5 days)**

1. **Create Firestore Collections**
   ```bash
   publications/
     - doc_id/
       - all publication fields
   
   projects/
     - doc_id/
       - all project fields
   
   partners/
     - doc_id/
       - all partner fields
   
   researchers/
     - doc_id/
       - researcher profiles
   ```

2. **Import Data**
   - Use Firebase Admin SDK
   - Batch upload publications
   - Add projects
   - Add partners

3. **Set Up Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /publications/{pubId} {
         allow read: if true;
         allow write: if request.auth.token.admin == true;
       }
     }
   }
   ```

### **Phase 3: Connect Frontend (2-3 days)**

I'll create a custom hook for you:

```javascript
// hooks/useRealResearchData.js
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useRealResearchData = () => {
  const [publications, setPublications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [partners, setPartners] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch publications
        const pubsRef = collection(db, 'publications');
        const pubsSnapshot = await getDocs(pubsRef);
        const pubsData = pubsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPublications(pubsData);

        // Fetch projects
        const projectsRef = collection(db, 'projects');
        const projectsSnapshot = await getDocs(projectsRef);
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);

        // Fetch partners
        const partnersRef = collection(db, 'partners');
        const partnersSnapshot = await getDocs(partnersRef);
        const partnersData = partnersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPartners(partnersData);

        // Calculate metrics
        const totalCitations = pubsData.reduce((sum, pub) => sum + (pub.citations || 0), 0);
        const totalDownloads = pubsData.reduce((sum, pub) => sum + (pub.downloads || 0), 0);
        
        setMetrics({
          totalPublications: pubsData.length,
          totalCitations,
          totalDownloads,
          hIndex: calculateHIndex(pubsData),
          activeProjects: projectsData.filter(p => p.status === 'active').length,
          partners: partnersData.length
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { publications, projects, partners, metrics, loading };
};

function calculateHIndex(publications) {
  const citations = publications
    .map(p => p.citations || 0)
    .sort((a, b) => b - a);
  
  let hIndex = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }
  return hIndex;
}
```

### **Phase 4: Update Components (1-2 days)**

Replace mockup data imports with real data:

```javascript
// Before (mockup):
import { publications } from './mockupData';

// After (real data):
import { useRealResearchData } from '../../hooks/useRealResearchData';

function ResearchPortal() {
  const { publications, projects, partners, metrics, loading } = useRealResearchData();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Use real data...
}
```

---

## 📈 Getting Real Citation Data

### **Option 1: Google Scholar (Free but rate-limited)**

Use SerpAPI or ScraperAPI:
```javascript
async function getCitations(doi) {
  const response = await fetch(
    `https://serpapi.com/search.json?engine=google_scholar&q=${doi}&api_key=YOUR_KEY`
  );
  const data = await response.json();
  return data.organic_results[0].inline_links.cited_by.total;
}
```

### **Option 2: Crossref (Free, official)**

```javascript
async function getCrossrefData(doi) {
  const response = await fetch(
    `https://api.crossref.org/works/${doi}`
  );
  const data = await response.json();
  return {
    citations: data.message['is-referenced-by-count'],
    references: data.message['references-count']
  };
}
```

### **Option 3: Dimensions.ai (Paid but comprehensive)**

Most accurate citation data, includes altmetrics.

---

## 🔄 Automated Updates

### **Set Up Cloud Functions (Firebase)**

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Update citation counts daily
exports.updateCitations = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const pubs = await admin.firestore().collection('publications').get();
    
    for (const doc of pubs.docs) {
      const doi = doc.data().doi;
      const citations = await getCitations(doi);
      
      await doc.ref.update({
        citations,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });
```

---

## 📝 Data Entry Options

### **Option 1: Admin Panel (Recommended)**

Create an admin interface for NARA staff to:
- Add new publications manually
- Update project status
- Add partners
- Edit information

I can create this for you!

### **Option 2: Bulk Import**

Create a CSV import tool:
- Export from current system to CSV
- Upload CSV through admin panel
- Automatically parse and import

### **Option 3: API Integration**

If NARA has existing systems:
- Connect to existing databases
- Sync automatically
- Real-time updates

---

## 💰 Cost Estimates

### **Free Tier (Start Here)**
- Firebase Firestore: 50K reads/day free
- Firebase Hosting: 10GB storage free
- Crossref API: Completely free
- Estimated: **$0/month**

### **Growing Usage**
- Firebase: ~$25-50/month
- SerpAPI (citations): $50/month
- Total: **$75-100/month**

### **Enterprise**
- Dimensions.ai: $500-1000/month
- Firebase: $100-200/month
- Total: **$600-1200/month**

---

## ⚡ Quick Start Guide

### **Week 1: Data Preparation**
1. Collect all NARA publications (Excel/CSV)
2. List active projects with details
3. Document partner institutions
4. Gather researcher profiles

### **Week 2: Database Setup**
1. Set up Firestore collections
2. Create data import scripts
3. Upload initial data
4. Test queries

### **Week 3: Integration**
1. Connect real data to frontend
2. Test all features
3. Add loading states
4. Handle errors

### **Week 4: Enhancement**
1. Set up automated citation updates
2. Create admin panel
3. Add data validation
4. Performance optimization

---

## 🎯 Priority Actions

### **Immediate (Do First):**
1. ✅ Collect publication data
2. ✅ Set up Firestore
3. ✅ Import publications
4. ✅ Connect to frontend

### **Short-term (Next Month):**
5. ✅ Add citation tracking
6. ✅ Create admin panel
7. ✅ Add projects data
8. ✅ Add partners data

### **Long-term (3-6 months):**
9. ✅ Automated updates
10. ✅ Advanced analytics
11. ✅ API for external access
12. ✅ Machine learning insights

---

## 🆘 Need Help?

**I can help you:**
1. Create the database schema
2. Write import scripts
3. Build the admin panel
4. Connect real data
5. Set up automated updates
6. Create API endpoints

**Just provide:**
- Sample NARA publication data (even just 5-10 publications)
- Project information format
- Partner list
- Access to any existing databases

---

## ✅ Summary

**Current State:**
- ✅ Beautiful, functional UI
- ✅ All interactions working
- ❌ Using mockup data

**To Go Live With Real Data:**
1. Collect NARA research data
2. Set up Firebase database
3. Import data
4. Connect to frontend (2-3 days work)
5. Add citation tracking
6. Create admin panel

**Estimated Timeline:** 2-4 weeks
**Estimated Cost:** $0-75/month to start

---

**The portal is PRODUCTION-READY from a code perspective - it just needs NARA's actual research data plugged in!** 🚀
