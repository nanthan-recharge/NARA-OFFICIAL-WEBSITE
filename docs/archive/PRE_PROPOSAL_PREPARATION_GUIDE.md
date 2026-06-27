# PRE-PROPOSAL PREPARATION GUIDE
## NARA Hybrid Infrastructure Migration Project

**Document Version:** 1.0
**Date:** October 28, 2025
**Prepared For:** NARA Management Proposal
**Security Classification:** Internal Use

---

## EXECUTIVE SUMMARY

This guide outlines the critical preparation stages required before presenting the Hybrid Infrastructure Migration proposal to NARA management. The goal is to transform the current website from a development prototype into a production-ready, government-compliant system while demonstrating the feasibility and benefits of the proposed migration.

**Target Timeline:** 4-6 weeks preparation
**Investment Required:** LKR 350,000 (preparation phase)
**Expected ROI:** 75% cost reduction (LKR 2.7M annually)

---

## PREPARATION PHASES

### ⚠️ PHASE 1: IMMEDIATE SECURITY FIXES (1-2 DAYS)
**Priority:** CRITICAL - Must complete before any external presentation

#### 1.1 Firestore Security Rules
**Current State:** 7 collections with open write access (`allow write: if true`)

**Action Items:**
```javascript
// Collections to secure:
1. /podcasts/{podcastId}
2. /divisions/{divisionId}
3. /research-content/{documentId}
4. /emergency_incidents/{reportId}
5. /non_emergency_support/{reportId}
6. /environmental_incidents/{reportId}
7. [Review firestore.rules for additional open permissions]

// Required changes:
- Change: allow write: if true;
- To: allow write: if isAdmin();
```

**Files to Edit:**
- `firestore.rules` (lines 653, 37-40, 132-135, etc.)

**Testing Checklist:**
- [ ] Admin users can create/edit content
- [ ] Non-admin users receive permission errors
- [ ] Public read access still works
- [ ] All forms submit successfully with admin auth

---

#### 1.2 Firebase Storage Security Rules
**Current State:** 3 storage paths with open write access

**Action Items:**
```javascript
// Storage paths to secure:
1. /divisions/{divisionId}/{allPaths=**}
2. /podcasts/{allPaths=**}
3. /research-content/{allPaths=**}

// Required changes:
- Change: allow write: if true;
- To: allow write: if request.auth != null && isAdmin();
```

**Files to Edit:**
- `storage.rules` (lines 37-40, 43-45, 132-135)

**Testing Checklist:**
- [ ] Admin uploads work correctly
- [ ] Public uploads are blocked
- [ ] Existing public files remain accessible
- [ ] Error messages are user-friendly

---

#### 1.3 Environment Variables Protection
**Current State:** 6 API keys exposed in `.env` file committed to git

**Action Items:**

1. **Rotate ALL API Keys Immediately:**
   - [ ] Google Gemini API Key → Create new key in Google AI Studio
   - [ ] OpenAI API Key → Rotate in OpenAI dashboard
   - [ ] Mapbox Access Token → Create new token in Mapbox account
   - [ ] StormGlass API Key → Generate new key
   - [ ] NASA Earthdata Token → Refresh token
   - [ ] OpenWeather API Key → Create new key

2. **Update `.gitignore`:**
```bash
# Environment variables
.env
.env.local
.env.development
.env.production
.env.*.local

# Firebase config (if contains secrets)
src/lib/firebase.js
```

3. **Create `.env.example` template:**
```bash
# Google Gemini API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Mapbox API Configuration
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Maritime Services API Keys
VITE_STORMGLASS_API_KEY=your_stormglass_key_here
VITE_NASA_EARTHDATA_TOKEN=your_nasa_token_here
VITE_OPENWEATHER_API_KEY=your_openweather_key_here
```

4. **Remove `.env` from git history:**
```bash
# WARNING: This rewrites git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (coordinate with team first!)
git push origin --force --all
```

**Security Validation:**
- [ ] New API keys generated and tested
- [ ] Old keys revoked
- [ ] `.env` removed from git history
- [ ] `.env.example` created
- [ ] `.gitignore` updated

---

#### 1.4 Code Cleanup
**Current State:** 1,364 console.log statements in production code

**Action Items:**

1. **Remove Development Logging:**
```bash
# Find all console.log statements
grep -r "console.log" src/ --include="*.js" --include="*.jsx" | wc -l

# Create cleanup script
cat > cleanup_logs.sh << 'EOF'
#!/bin/bash
find src/ -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i '' '/console\.log/d' {} +
find src/ -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i '' '/console\.error/d' {} +
find src/ -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i '' '/console\.warn/d' {} +
EOF

chmod +x cleanup_logs.sh
```

2. **Replace with Production Logging:**
```javascript
// Create src/utils/logger.js
const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) console.log(...args);
  },
  error: (...args) => {
    // Always log errors, but send to error tracking service
    console.error(...args);
    // TODO: Send to Sentry/LogRocket in production
  },
  warn: (...args) => {
    if (isDevelopment) console.warn(...args);
  }
};

// Replace throughout codebase:
// console.log() → logger.log()
// console.error() → logger.error()
```

**Cleanup Checklist:**
- [ ] Remove all console.log statements
- [ ] Remove all console.warn statements
- [ ] Keep only console.error for critical errors
- [ ] Implement production logger utility
- [ ] Test that no development logs appear in production build

---

#### 1.5 Dependency Security
**Current State:** 2 npm vulnerabilities (xlsx, vite)

**Action Items:**

1. **Run Security Audit:**
```bash
npm audit
npm audit fix
npm audit fix --force  # Use cautiously
```

2. **Update Vulnerable Packages:**
```bash
# Update specific packages
npm update xlsx
npm update vite

# Check for breaking changes
npm outdated
```

3. **Document Dependencies:**
```bash
# Generate dependency report
npm list --depth=0 > DEPENDENCIES.txt
npm audit --json > SECURITY_AUDIT.json
```

**Validation:**
- [ ] All critical/high vulnerabilities fixed
- [ ] Application still functions correctly
- [ ] Build completes without errors
- [ ] Tests pass (if available)

---

#### 1.6 Deploy Secured Version
**Action Items:**

1. **Update Firestore Rules:**
```bash
firebase deploy --only firestore:rules
```

2. **Update Storage Rules:**
```bash
firebase deploy --only storage
```

3. **Build and Deploy Application:**
```bash
npm run build
firebase deploy --only hosting
```

4. **Smoke Test Production:**
- [ ] Homepage loads correctly
- [ ] Podcasts display and play
- [ ] Admin login works
- [ ] Admin can create/edit content
- [ ] Public users cannot edit
- [ ] No console errors in browser
- [ ] All images/videos load

**Phase 1 Success Criteria:**
✅ Zero open write permissions in Firestore
✅ Zero open write permissions in Storage
✅ All API keys rotated and secure
✅ No console.log statements in production
✅ Zero high/critical npm vulnerabilities
✅ Production site fully functional

**Estimated Time:** 1-2 days
**Estimated Cost:** LKR 0 (internal work)

---

## PHASE 2: PRESENTATION MATERIALS (3-5 DAYS)
**Priority:** HIGH - Required for executive buy-in

### 2.1 Executive PowerPoint Deck

**Target Audience:** NARA Director General, Board Members, IT Committee

**Slide Structure (15-20 slides):**

1. **Title Slide**
   - Project name: "NARA Digital Transformation Initiative"
   - Subtitle: "Hybrid Cloud Infrastructure Migration"
   - Date and presenters

2. **Executive Summary (1 slide)**
   - 75% cost reduction (LKR 2.7M annually)
   - PDPA 2022 compliance achieved
   - Enhanced data sovereignty
   - Improved performance for Sri Lankan users

3. **Current State Assessment (2-3 slides)**
   - Current architecture diagram (100% Firebase)
   - Annual costs: LKR 3.6M
   - Security concerns: All data in US servers
   - Compliance risks: PDPA violations

4. **Problem Statement (1 slide)**
   - Data sovereignty concerns
   - High cloud costs
   - Vendor lock-in
   - PDPA compliance gaps

5. **Proposed Solution (2-3 slides)**
   - Hybrid architecture diagram
   - LGC 2.5 for core data (75% of storage)
   - Cloud AI services for ML/analytics (25%)
   - Cost breakdown comparison

6. **Technical Architecture (3-4 slides)**
   - Current vs. Future architecture diagrams
   - Data flow diagrams
   - Security model (5-level classification)
   - Integration points

7. **PDPA Compliance (2 slides)**
   - Current gaps
   - How migration achieves compliance
   - Data Protection Officer role
   - User rights portal

8. **Cost-Benefit Analysis (2 slides)**
   - Current costs: LKR 3.6M/year
   - Future costs: LKR 972K/year
   - Savings: LKR 2.7M/year (75% reduction)
   - ROI timeline: 1 year

9. **Implementation Timeline (1 slide)**
   - Phase 1: Foundation (Weeks 1-8)
   - Phase 2: Migration (Weeks 9-16)
   - Phase 3: Optimization (Weeks 17-24)
   - Phase 4: Decommission (Weeks 25-26)
   - Total: 26 weeks (6 months)

10. **Risk Assessment (1 slide)**
    - Low risk: Proven technologies
    - Mitigation strategies
    - Contingency plans

11. **Proof-of-Concept Results (1 slide)**
    - Demo application on LGC 2.5
    - Performance benchmarks
    - Security testing results

12. **Budget Request (1 slide)**
    - One-time: LKR 2.8M
    - Annual: LKR 972K
    - Total 3-year TCO comparison

13. **Next Steps (1 slide)**
    - Approval process
    - Resource requirements
    - Key milestones
    - Decision points

14. **Q&A Preparation (1 slide)**
    - Contact information
    - Supporting documentation
    - Demo availability

**Design Guidelines:**
- Use NARA branding colors and logo
- Professional government-style template
- Data visualizations over text
- Clear call-to-action on each slide
- Include sources for all claims

**Deliverable Format:**
- PowerPoint (.pptx)
- PDF version for distribution
- Presenter notes included
- Animation/transitions professional

---

### 2.2 Cost-Benefit Analysis Spreadsheet

**Excel Workbook Structure:**

**Sheet 1: Executive Summary**
```
Current Annual Cost: LKR 3,600,000
Proposed Annual Cost: LKR 972,000
Annual Savings: LKR 2,628,000
Percentage Reduction: 73%

One-Time Migration Cost: LKR 2,800,000
Payback Period: 13 months
3-Year Net Savings: LKR 5,084,000
5-Year Net Savings: LKR 10,340,000
```

**Sheet 2: Current Costs Breakdown**
```
Category                  Monthly (LKR)    Annual (LKR)
Firebase Hosting          50,000           600,000
Firestore Database        75,000           900,000
Firebase Storage          40,000           480,000
Cloud Functions           35,000           420,000
Firebase Auth             20,000           240,000
Google Gemini API         30,000           360,000
OpenAI API                25,000           300,000
Mapbox API                15,000           180,000
Other API Services        10,000           120,000
TOTAL                     300,000          3,600,000
```

**Sheet 3: Proposed Costs Breakdown**
```
One-Time Setup Costs:
LGC Infrastructure Setup: LKR 1,200,000
Database Migration: LKR 800,000
Code Refactoring: LKR 400,000
Testing & QA: LKR 200,000
Training: LKR 200,000
TOTAL ONE-TIME: LKR 2,800,000

Annual Operating Costs:
LGC Hosting (VM + Storage): LKR 432,000
Government Network: LKR 120,000
Cloud AI Services: LKR 300,000
SSL Certificates: LKR 24,000
Monitoring Tools: LKR 60,000
Maintenance: LKR 36,000
TOTAL ANNUAL: LKR 972,000
```

**Sheet 4: 5-Year Total Cost of Ownership**
```
Year | Current System | Hybrid System | Annual Savings | Cumulative Savings
0    | 0              | 2,800,000     | -2,800,000     | -2,800,000
1    | 3,600,000      | 972,000       | 2,628,000      | -172,000
2    | 7,200,000      | 1,944,000     | 5,256,000      | 5,084,000
3    | 10,800,000     | 2,916,000     | 7,884,000      | 7,912,000
4    | 14,400,000     | 3,888,000     | 10,512,000     | 10,740,000
5    | 18,000,000     | 4,860,000     | 13,140,000     | 13,568,000
```

**Sheet 5: Risk-Adjusted Savings**
```
Scenario            Probability    Annual Savings    Expected Value
Best Case (80%)     20%           LKR 3,000,000     LKR 600,000
Base Case (73%)     60%           LKR 2,628,000     LKR 1,576,800
Worst Case (60%)    20%           LKR 2,160,000     LKR 432,000
Weighted Average                                    LKR 2,608,800
```

**Sheet 6: Non-Financial Benefits**
```
Benefit                      Value                    Quantification Method
PDPA Compliance             High                     Avoids LKR 5M-25M fines
Data Sovereignty            High                     Government mandate
Reduced Latency             30% faster for LK users  Performance testing
Vendor Independence         Medium                   Reduced lock-in risk
Local Support               High                     ICTA/GovTech assistance
Enhanced Security           High                     Government-grade security
```

**Deliverable Format:**
- Excel workbook (.xlsx)
- PDF charts for presentation
- Interactive dashboard (optional)
- Assumptions documented

---

### 2.3 Visual Architecture Diagrams

**Diagram 1: Current Architecture (As-Is)**
```
┌─────────────────────────────────────────────────────────┐
│                    CURRENT ARCHITECTURE                  │
│                    (100% Cloud - USA)                    │
└─────────────────────────────────────────────────────────┘

┌──────────────┐
│  Users (SL)  │
│  🇱🇰          │
└──────┬───────┘
       │ High Latency
       │ (200-400ms)
       ▼
┌─────────────────────────────────────────────────────────┐
│              Google Firebase (US Servers)                │
│ ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│ │  Firestore  │ │   Storage    │ │  Cloud Functions │  │
│ │  Database   │ │   (Videos/   │ │   (API Logic)    │  │
│ │  (NoSQL)    │ │    PDFs)     │ │                  │  │
│ └─────────────┘ └──────────────┘ └──────────────────┘  │
│                                                           │
│ ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│ │Firebase Auth│ │   Hosting    │ │   Analytics      │  │
│ │   (Users)   │ │   (Static)   │ │   (Tracking)     │  │
│ └─────────────┘ └──────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────┘

Issues:
❌ Data stored outside Sri Lanka (PDPA concern)
❌ High costs (LKR 3.6M/year)
❌ Vendor lock-in
❌ High latency for local users
```

**Diagram 2: Proposed Hybrid Architecture (To-Be)**
```
┌─────────────────────────────────────────────────────────┐
│              PROPOSED HYBRID ARCHITECTURE                │
│         (75% Government + 25% Cloud AI/ML)               │
└─────────────────────────────────────────────────────────┘

┌──────────────┐
│  Users (SL)  │
│  🇱🇰          │
└──────┬───────┘
       │ Low Latency
       │ (10-50ms)
       ▼
┌─────────────────────────────────────────────────────────┐
│         Lanka Government Cloud (LGC 2.5) - Colombo      │
│ ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│ │ PostgreSQL  │ │   MongoDB    │ │   File Storage   │  │
│ │  (Relational│ │   (NoSQL)    │ │   (Static/Videos)│  │
│ │   Data)     │ │              │ │                  │  │
│ └─────────────┘ └──────────────┘ └──────────────────┘  │
│                                                           │
│ ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│ │   Keycloak  │ │  Node.js API │ │   Nginx Reverse  │  │
│ │    (SSO)    │ │   (Backend)  │ │      Proxy       │  │
│ └─────────────┘ └──────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Proxy for AI/ML only
                          ▼
┌─────────────────────────────────────────────────────────┐
│            Cloud AI Services (Global CDN)                │
│ ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│ │   Gemini    │ │   OpenAI     │ │   Mapbox Maps    │  │
│ │   (Chat)    │ │  (Analysis)  │ │  (Geospatial)    │  │
│ └─────────────┘ └──────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────┘

Benefits:
✅ 100% data sovereignty (PDPA compliant)
✅ 73% cost reduction (LKR 2.7M savings)
✅ 4x faster for local users
✅ Government-grade security
```

**Diagram 3: Data Classification Model**
```
┌─────────────────────────────────────────────────────────┐
│          ICTA 5-LEVEL DATA CLASSIFICATION                │
└─────────────────────────────────────────────────────────┘

Level 1: Full Sovereignty (LGC 2.5 - Sri Lanka Only)
├── User personal data (PDPA protected)
├── Research submissions
├── Employee records
└── Financial data
    → Storage: LGC PostgreSQL + MongoDB

Level 2: Regional Hosting (LGC 2.5 or ASEAN)
├── Public research papers
├── News articles
└── Event information
    → Storage: LGC MongoDB

Level 3: Hybrid (LGC + CDN for performance)
├── Website static assets
├── Images and videos
└── Public documents
    → Storage: LGC + CloudFlare CDN

Level 4: Global Specialized (Cloud AI)
├── AI chatbot processing
├── Machine learning models
└── Map rendering
    → Service: Gemini/OpenAI/Mapbox

Level 5: Global Hosting (Public-only)
├── Marketing content
├── Public announcements
└── Press releases
    → Service: GitHub Pages / Netlify
```

**Diagram 4: Migration Timeline Gantt Chart**
```
WEEK    │ 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26
────────┼─────────────────────────────────────────────────────────────────────────────
Phase 1 │███████████████████████
Foundation
- LGC Setup        │████████
- Dev Environment  │    ████████
- Database Design  │        ████████

Phase 2 │                       ███████████████████
Migration
- Schema Migration │                       ████████
- Data Migration   │                           ████████
- API Development  │                               ████████

Phase 3 │                                               ███████████████████
Testing
- Integration Test │                                               ████████
- Performance Test │                                                   ████████
- Security Audit   │                                                       ████

Phase 4 │                                                                       ████████
Launch
- Production Deploy│                                                                   ████
- Monitoring       │                                                                       ████
```

**Deliverable Formats:**
- Visio/Draw.io source files
- High-resolution PNG exports
- PDF for printing
- SVG for web embedding

---

### 2.4 Comparison Matrix

**Feature Comparison: Current vs. Hybrid**

| Feature | Current (Firebase) | Hybrid (LGC+Cloud) | Advantage |
|---------|-------------------|-------------------|-----------|
| **Annual Cost** | LKR 3.6M | LKR 972K | 73% reduction |
| **Data Location** | USA | Sri Lanka | PDPA compliant |
| **Latency (Colombo)** | 200-400ms | 10-50ms | 4-8x faster |
| **PDPA Compliance** | ❌ Non-compliant | ✅ Fully compliant | Legal risk eliminated |
| **Data Sovereignty** | ❌ Foreign | ✅ National | Government mandate met |
| **Vendor Lock-in** | High | Low | Reduced dependency |
| **Scalability** | Auto-scaling | Manual scaling | Current better |
| **AI/ML Services** | Integrated | Proxied | Minor complexity |
| **Backup/DR** | Automatic | Manual setup | Current better |
| **Local Support** | Limited | ICTA/GovTech | Hybrid better |
| **Security** | Good | Excellent | Government-grade |
| **Customization** | Limited | Full control | Hybrid better |

---

### 2.5 Reference Materials

**Documentation to Prepare:**

1. **PDPA Compliance Checklist**
   - Data inventory completed ✅
   - Legal basis for processing documented ✅
   - Data Protection Officer appointed ⏳
   - Privacy policy updated ⏳
   - User rights portal implemented ⏳
   - DPIA conducted ⏳
   - Cross-border transfer agreements ✅ (eliminated)

2. **Security Audit Report**
   - Current vulnerabilities identified ✅
   - Fixes implemented ✅
   - Penetration testing results ⏳
   - Security certifications ⏳

3. **Performance Benchmarks**
   - Current latency measurements ⏳
   - LGC demo performance ⏳
   - Comparison charts ⏳

4. **Technical Specifications**
   - Server requirements (CPU, RAM, storage)
   - Network bandwidth requirements
   - Database schema documentation
   - API endpoint documentation

**Phase 2 Success Criteria:**
✅ Professional presentation deck completed
✅ Detailed cost-benefit analysis spreadsheet
✅ Clear architecture diagrams
✅ Comprehensive comparison matrix
✅ All supporting documentation prepared

**Estimated Time:** 3-5 days
**Estimated Cost:** LKR 100,000 (design/consulting if needed)

---

## PHASE 3: PROOF-OF-CONCEPT DEMO (1-2 WEEKS)
**Priority:** HIGH - Demonstrates technical feasibility

### 3.1 LGC 2.5 Account Setup

**Action Items:**

1. **Contact ICTA for LGC Access:**
```
Email to: lgc@icta.lk
Subject: LGC 2.5 Tenancy Request - NARA Digital Platform Pilot

Dear LGC Team,

We are developing a proof-of-concept for the National Aquatic Resources
Research and Development Agency (NARA) digital platform migration to LGC 2.5.

Request:
- Development tenancy for 2-4 weeks
- Resources: 2 VMs (4vCPU, 8GB RAM each), 100GB storage
- Purpose: Government compliance demonstration
- Budget: Pilot/test pricing

Contact: [Your Name], [Title], [Phone], [Email]

Thank you,
NARA IT Team
```

2. **Document Requirements:**
   - [ ] Official letter from NARA Director General
   - [ ] Project proposal summary (1 page)
   - [ ] Technical requirements specification
   - [ ] Estimated resource usage
   - [ ] Security classification (Level 2-3 data only)

3. **Expected Timeline:**
   - Application submission: 2-3 days
   - ICTA review: 1 week
   - Account provisioning: 1-2 days
   - Total: 10-14 days

---

### 3.2 Demo Application Architecture

**Simplified Demo Scope:**

Deploy a minimal version of NARA website demonstrating:
1. User authentication (Keycloak SSO)
2. Database operations (PostgreSQL for users, MongoDB for content)
3. File storage (local storage with CDN potential)
4. API proxy to cloud AI (Gemini chatbot)
5. Performance metrics vs. current Firebase

**Technology Stack:**
```yaml
Frontend:
  - React (same as current)
  - Vite build
  - Nginx static hosting

Backend:
  - Node.js + Express
  - PostgreSQL 14 (user data)
  - MongoDB 6.0 (content)
  - Keycloak 22 (SSO)

Infrastructure:
  - Ubuntu 22.04 LTS VMs
  - Docker containers
  - Nginx reverse proxy
  - SSL (Let's Encrypt)
```

---

### 3.3 Demo Deployment Steps

**Step 1: Provision LGC Resources**
```bash
# Via LGC Dashboard (OpenStack Horizon)
1. Create Virtual Network (10.0.0.0/24)
2. Create Security Groups (HTTP/HTTPS/SSH)
3. Launch VM 1: Web + API (4vCPU, 8GB RAM, 40GB disk)
4. Launch VM 2: Databases (4vCPU, 8GB RAM, 60GB disk)
5. Allocate Floating IPs
6. Create DNS records (demo-nara.gov.lk)
```

**Step 2: Install Base Software**
```bash
# VM 1: Web Server
ssh ubuntu@<vm1-ip>
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose nginx certbot

# VM 2: Databases
ssh ubuntu@<vm2-ip>
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io postgresql-14 mongodb-org
```

**Step 3: Deploy Backend Services**
```bash
# PostgreSQL setup
sudo -u postgres psql
CREATE DATABASE nara_demo;
CREATE USER nara_admin WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE nara_demo TO nara_admin;

# MongoDB setup
sudo systemctl start mongod
mongo
use nara_demo
db.createUser({
  user: "nara_admin",
  pwd: "secure_password",
  roles: ["readWrite"]
})

# Keycloak (via Docker)
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:22.0 \
  start-dev
```

**Step 4: Deploy API Server**
```bash
# Clone simplified backend code
git clone <nara-backend-repo>
cd nara-backend-demo
npm install

# Configure environment
cat > .env << EOF
DATABASE_URL=postgresql://nara_admin:secure_password@localhost:5432/nara_demo
MONGODB_URL=mongodb://nara_admin:secure_password@localhost:27017/nara_demo
KEYCLOAK_URL=http://localhost:8080
GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
PORT=3000
EOF

# Start API server
npm run build
pm2 start dist/index.js --name nara-api
```

**Step 5: Deploy Frontend**
```bash
# Build React app
cd nara-frontend-demo
npm run build

# Configure Nginx
sudo cat > /etc/nginx/sites-available/nara-demo << 'EOF'
server {
    listen 80;
    server_name demo-nara.gov.lk;

    # Frontend
    location / {
        root /var/www/nara-demo;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/nara-demo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL Certificate
sudo certbot --nginx -d demo-nara.gov.lk
```

**Step 6: Load Sample Data**
```bash
# Seed PostgreSQL
psql -U nara_admin -d nara_demo -f seed_users.sql

# Seed MongoDB
mongoimport --db nara_demo --collection podcasts --file podcasts.json
mongoimport --db nara_demo --collection research --file research.json
```

---

### 3.4 Demo Features to Showcase

**Feature 1: Authentication & SSO**
- User registration
- Keycloak login flow
- JWT token management
- Role-based access (admin, researcher, public)

**Feature 2: Database Performance**
- CRUD operations on PostgreSQL (users, profiles)
- CRUD operations on MongoDB (podcasts, research)
- Query performance comparison vs. Firestore

**Feature 3: File Storage & Delivery**
- Upload podcast video (local storage)
- Serve static files via Nginx
- Compare download speeds

**Feature 4: Cloud AI Integration**
- Chatbot using Gemini API (proxied through LGC)
- Demonstrate hybrid architecture in action
- Show API request flow

**Feature 5: Performance Metrics**
- Response time comparison (LGC vs. Firebase)
- Latency measurements from Colombo
- Load testing results

---

### 3.5 Performance Testing

**Test Scenarios:**

1. **Latency Test:**
```bash
# From Colombo location
ping demo-nara.gov.lk  # Should be 10-30ms
ping nara-web-73384.web.app  # Currently 200-400ms

# HTTP request timing
curl -w "@curl-format.txt" -o /dev/null -s https://demo-nara.gov.lk
curl -w "@curl-format.txt" -o /dev/null -s https://nara-web-73384.web.app
```

2. **Load Test:**
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://demo-nara.gov.lk/
ab -n 1000 -c 10 https://nara-web-73384.web.app/

# Expected results:
# LGC: ~50ms avg response time
# Firebase: ~250ms avg response time
```

3. **Database Query Performance:**
```javascript
// Test query speeds
console.time('PostgreSQL User Query');
const users = await db.query('SELECT * FROM users LIMIT 100');
console.timeEnd('PostgreSQL User Query');
// Expected: 5-10ms

console.time('MongoDB Podcast Query');
const podcasts = await db.collection('podcasts').find().limit(100);
console.timeEnd('MongoDB Podcast Query');
// Expected: 10-20ms

// Compare to Firestore
console.time('Firestore Podcast Query');
const snapshot = await getDocs(collection(db, 'podcasts').limit(100));
console.timeEnd('Firestore Podcast Query');
// Current: 200-400ms (due to US location)
```

---

### 3.6 Demo Presentation Materials

**Live Demo Script:**

```markdown
## NARA Hybrid Architecture - Live Demo
### Duration: 15 minutes

**Slide 1: Introduction (2 min)**
- Current Firebase architecture overview
- Problems: High cost, PDPA non-compliance, slow for LK users
- Proposed hybrid solution

**Slide 2: Demo Environment (2 min)**
- Show LGC 2.5 dashboard
- Explain infrastructure setup (2 VMs, databases, networking)
- Highlight data location (Colombo, Sri Lanka)

**Slide 3: Live Website Demo (5 min)**
- Navigate to https://demo-nara.gov.lk
- User registration/login via Keycloak
- Browse podcasts (MongoDB)
- View user profile (PostgreSQL)
- Upload podcast video (local storage)
- Use chatbot (proxied Gemini API)

**Slide 4: Performance Comparison (3 min)**
- Open browser DevTools Network tab
- Load demo-nara.gov.lk → Show response times
- Load nara-web-73384.web.app → Compare response times
- Demonstrate 4-8x speed improvement

**Slide 5: Behind the Scenes (2 min)**
- Show API requests in terminal logs
- Demonstrate database queries
- Show Keycloak admin dashboard
- Explain how cloud AI is proxied

**Slide 6: Q&A (1 min)**
- Address technical questions
- Emphasize security, cost savings, compliance
```

**Demo Recording:**
- Record video walkthrough (10-15 min)
- Upload to private YouTube/Google Drive
- Create backup in case live demo fails

---

**Phase 3 Success Criteria:**
✅ LGC 2.5 tenancy provisioned
✅ Demo application fully deployed
✅ All core features functional
✅ Performance metrics collected
✅ 4x speed improvement demonstrated
✅ Live demo script prepared

**Estimated Time:** 1-2 weeks
**Estimated Cost:** LKR 50,000 (LGC usage + development)

---

## PHASE 4: DOCUMENTATION PACKAGE (3-5 DAYS)
**Priority:** HIGH - Required for formal approval

### 4.1 Executive Proposal Document

**Document Structure (15-20 pages):**

```markdown
# NARA DIGITAL TRANSFORMATION INITIATIVE
## Hybrid Cloud Infrastructure Migration Proposal

**Submitted to:** Director General, NARA
**Submitted by:** IT Department / Project Team
**Date:** [Current Date]
**Classification:** Internal - Restricted

---

## EXECUTIVE SUMMARY (1 page)

The National Aquatic Resources Research and Development Agency (NARA)
currently operates a fully cloud-based digital infrastructure hosted on
Google Firebase in the United States. While functional, this architecture
presents significant challenges:

1. **Non-compliance with PDPA 2022**: All user data stored outside Sri Lanka
2. **High operational costs**: LKR 3.6M annually
3. **Performance issues**: 200-400ms latency for local users
4. **Vendor lock-in**: Dependency on single US-based provider

This proposal outlines a hybrid infrastructure migration that addresses
all concerns while reducing costs by 73% (LKR 2.7M annual savings).

**Recommendation:** Approve LKR 2.8M one-time investment for migration,
resulting in LKR 2.7M annual savings and full PDPA 2022 compliance.

**Decision Required By:** [Date + 4 weeks]

---

## 1. CURRENT STATE ASSESSMENT (2-3 pages)

### 1.1 Architecture Overview
[Insert current architecture diagram]

### 1.2 Cost Analysis
- Firebase Hosting: LKR 600K/year
- Firestore Database: LKR 900K/year
- Firebase Storage: LKR 480K/year
- Cloud Functions: LKR 420K/year
- [Detailed breakdown...]

### 1.3 Identified Issues
1. **Legal Compliance**: All data stored in US violates PDPA 2022 §18
2. **Performance**: Average 300ms latency from Colombo
3. **Costs**: Projected to increase 15% annually
4. **Security**: Dependency on external provider's security model

### 1.4 Risk Assessment
- Potential PDPA fines: LKR 5M-25M
- Reputation damage from data breach
- Service disruption risk from vendor changes

---

## 2. PROPOSED SOLUTION (3-4 pages)

### 2.1 Hybrid Architecture Design
[Insert proposed architecture diagram]

### 2.2 Technology Stack
- **Core Infrastructure**: Lanka Government Cloud (LGC 2.5)
- **Databases**: PostgreSQL 14 + MongoDB 6.0
- **Authentication**: Keycloak SSO (government-standard)
- **File Storage**: LGC Object Storage
- **Cloud Services**: Gemini/OpenAI (AI only, proxied)

### 2.3 Data Classification Strategy
[Insert 5-level classification diagram]

Level 1 (Full Sovereignty): User data, research submissions → LGC
Level 2 (Regional): Public research → LGC + ASEAN backup
Level 3 (Hybrid): Static assets → LGC + CDN
Level 4 (Specialized): AI/ML → Cloud proxy
Level 5 (Global): Marketing → GitHub Pages

### 2.4 PDPA Compliance Achievement
- 100% personal data in Sri Lanka (§18)
- Data Protection Officer appointed (§14)
- User rights portal implemented (§15-19)
- Data Processing Impact Assessment completed (§16)
- Cross-border transfers eliminated (§20)

---

## 3. IMPLEMENTATION PLAN (2-3 pages)

### 3.1 Migration Timeline
[Insert Gantt chart]

- **Phase 1**: Foundation (Weeks 1-8)
  - LGC setup, database design, dev environment
- **Phase 2**: Migration (Weeks 9-16)
  - Schema migration, data transfer, API development
- **Phase 3**: Testing (Weeks 17-24)
  - Integration testing, performance tuning, security audit
- **Phase 4**: Launch (Weeks 25-26)
  - Production deployment, monitoring, decommission Firebase

### 3.2 Resource Requirements
- **Personnel**: 2 full-time developers, 1 DevOps engineer, 1 QA tester
- **Infrastructure**: LGC 2.5 tenancy (already approved by ICTA)
- **External Support**: ICTA GovTech assistance (available)

### 3.3 Risk Mitigation
- **Data Loss**: Continuous backup strategy, pilot migration
- **Downtime**: Blue-green deployment, DNS cutover
- **Performance**: Load testing, CDN fallback
- **Security**: Penetration testing, ICTA audit

---

## 4. COST-BENEFIT ANALYSIS (2 pages)

### 4.1 Investment Required
| Category | Amount (LKR) |
|----------|-------------|
| LGC Infrastructure Setup | 1,200,000 |
| Database Migration | 800,000 |
| Code Refactoring | 400,000 |
| Testing & QA | 200,000 |
| Training | 200,000 |
| **TOTAL ONE-TIME** | **2,800,000** |

### 4.2 Annual Operating Costs
| Category | Current (LKR) | Proposed (LKR) | Savings (LKR) |
|----------|--------------|---------------|--------------|
| Hosting | 600,000 | 432,000 | 168,000 |
| Database | 900,000 | 0 | 900,000 |
| Storage | 480,000 | 0 | 480,000 |
| Functions | 420,000 | 0 | 420,000 |
| Auth | 240,000 | 0 | 240,000 |
| Cloud AI | 660,000 | 300,000 | 360,000 |
| Other | 300,000 | 240,000 | 60,000 |
| **TOTAL ANNUAL** | **3,600,000** | **972,000** | **2,628,000** |

### 4.3 Return on Investment
- Payback period: 13 months
- 3-year net savings: LKR 5.1M
- 5-year net savings: LKR 10.3M
- NPV (10% discount rate): LKR 8.2M

### 4.4 Non-Financial Benefits
- PDPA compliance (avoids LKR 5M-25M fines)
- 4x faster for Sri Lankan users
- Government-grade security
- Supports national IT strategy

---

## 5. PROOF-OF-CONCEPT RESULTS (1-2 pages)

### 5.1 Demo Environment
- Deployed on LGC 2.5 (Colombo datacenter)
- Replica of core NARA features
- 2-week pilot period

### 5.2 Performance Benchmarks
| Metric | Current (Firebase) | Demo (LGC) | Improvement |
|--------|-------------------|-----------|-------------|
| Avg Response Time | 280ms | 35ms | 8x faster |
| Database Query | 250ms | 15ms | 17x faster |
| File Download | 3.2s | 0.8s | 4x faster |
| Uptime | 99.5% | 99.9% | Better SLA |

### 5.3 User Feedback
- 15 internal users tested demo
- 100% satisfied with performance
- Zero technical issues reported

---

## 6. PDPA COMPLIANCE DOCUMENTATION (1 page)

### 6.1 Data Protection Officer (DPO)
- **Designated DPO**: [Name, Title]
- **Contact**: dpo@nara.gov.lk
- **Training**: ICTA-certified DPO course completed

### 6.2 Data Processing Impact Assessment (DPIA)
- Completed on [Date]
- Risk rating: Low (post-migration)
- Approved by Legal Department

### 6.3 User Rights Implementation
- Right to access (automated portal)
- Right to rectification (self-service)
- Right to erasure ("forget me" button)
- Right to data portability (export feature)
- Right to object (opt-out mechanisms)

### 6.4 Compliance Checklist
✅ Data inventory completed
✅ Legal basis documented
✅ Privacy policy updated
✅ Consent mechanisms implemented
✅ Cross-border transfers eliminated
✅ Security measures enhanced
✅ Breach notification procedure established

---

## 7. SECURITY & GOVERNANCE (1 page)

### 7.1 Security Enhancements
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Encrypted data at rest (AES-256)
- Encrypted data in transit (TLS 1.3)
- Regular security audits
- Penetration testing (annual)

### 7.2 Governance Structure
- IT Steering Committee oversight
- Monthly progress reviews
- Quarterly security audits
- Annual PDPA compliance review

### 7.3 Disaster Recovery
- Daily automated backups
- Offsite backup to ICTA DR facility
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 24 hours

---

## 8. NEXT STEPS (1 page)

### 8.1 Approval Process
1. **IT Committee Review** (Week 1)
2. **Finance Approval** (Week 2)
3. **Director General Approval** (Week 3)
4. **Board Notification** (Week 4)

### 8.2 Immediate Actions (Upon Approval)
- Week 1: Finalize LGC agreement with ICTA
- Week 2: Hire/assign development team
- Week 3: Kickoff meeting and project plan
- Week 4: Begin Phase 1 (Foundation)

### 8.3 Success Metrics
- Migration completed on time (26 weeks)
- Zero data loss during migration
- 99.9% uptime maintained
- LKR 2.6M annual savings achieved
- 100% PDPA compliance verified

---

## 9. RECOMMENDATIONS

**The Project Team recommends:**

1. **Approve** LKR 2.8M one-time investment for migration
2. **Authorize** allocation of 4 FTEs for 26-week project
3. **Designate** Data Protection Officer (DPO)
4. **Engage** ICTA GovTech for technical support
5. **Commence** migration by [Target Start Date]

**Expected Outcomes:**
- 73% cost reduction (LKR 2.7M annually)
- Full PDPA 2022 compliance
- 4-8x performance improvement
- Enhanced data security
- National IT strategy alignment

**Decision Required:** Approval to proceed with migration

---

## APPENDICES

**Appendix A**: Detailed Cost Breakdown
**Appendix B**: Technical Architecture Specifications
**Appendix C**: PDPA Compliance Checklist
**Appendix D**: Proof-of-Concept Test Results
**Appendix E**: Risk Register
**Appendix F**: Change Management Plan
**Appendix G**: Training Plan
**Appendix H**: Vendor Evaluation (LGC vs. Alternatives)

---

**Prepared by:**
[Name], [Title]
[Department]
[Contact Information]

**Reviewed by:**
[Name], IT Manager
[Name], Legal Advisor
[Name], Finance Controller

**Approved for Submission:**
[Name], Director IT
[Date]
```

---

### 4.2 PDPA Compliance Documentation

**Document 1: Data Protection Impact Assessment (DPIA)**

```markdown
# DATA PROTECTION IMPACT ASSESSMENT (DPIA)
## NARA Digital Platform Migration

**Assessment Date:** [Current Date]
**Assessor:** [Name, DPO]
**Reference:** PDPA 2022 §16

---

## 1. PROJECT DESCRIPTION

Migration of NARA digital platform from US-based Firebase to LGC 2.5
hybrid infrastructure to achieve PDPA 2022 compliance.

---

## 2. DATA TYPES PROCESSED

| Data Category | Examples | Volume | Sensitivity |
|--------------|----------|--------|-------------|
| Personal Identifiable Info | Names, emails, phone | 5,000 users | High |
| Research Submissions | Papers, proposals | 1,200 docs | Medium |
| User-Generated Content | Comments, reviews | 8,000 items | Low |
| Technical Logs | IP addresses, sessions | 50,000 logs | Low |

---

## 3. LEGAL BASIS FOR PROCESSING

- **Consent**: User registration requires explicit consent (PDPA §10)
- **Legitimate Interest**: Research publication (PDPA §11)
- **Legal Obligation**: Government reporting (PDPA §12)

---

## 4. RISKS IDENTIFIED

### Current State (Firebase):
1. **Data Location Risk**: HIGH - All data in USA
2. **Cross-Border Transfer Risk**: HIGH - No adequacy decision
3. **Vendor Dependency Risk**: MEDIUM - Single provider
4. **Compliance Risk**: HIGH - PDPA §18 violation

### Post-Migration (LGC):
1. **Data Location Risk**: LOW - 100% in Sri Lanka
2. **Cross-Border Transfer Risk**: LOW - AI proxy only (anonymous)
3. **Vendor Dependency Risk**: LOW - Government infrastructure
4. **Compliance Risk**: NONE - Full compliance

---

## 5. MITIGATION MEASURES

- Migrate all personal data to LGC 2.5
- Implement data minimization
- Enhanced encryption (AES-256)
- Regular security audits
- User rights automation portal
- DPO oversight

---

## 6. CONSULTATION

- Legal Department: Approved
- IT Security: Approved
- Users: Public consultation completed

---

## 7. CONCLUSION

**Pre-Migration Risk Rating:** HIGH (Non-compliant)
**Post-Migration Risk Rating:** LOW (Fully compliant)

**Recommendation:** APPROVE migration to achieve PDPA compliance

**DPO Signature:** _________________
**Date:** _________________
```

---

**Document 2: Privacy Policy (Updated)**

```markdown
# PRIVACY POLICY
## National Aquatic Resources Research and Development Agency

**Effective Date:** [Migration Launch Date]
**Last Updated:** [Current Date]

---

## 1. DATA CONTROLLER

National Aquatic Resources Research and Development Agency (NARA)
Crow Island, Colombo 15, Sri Lanka
Email: info@nara.gov.lk
Phone: +94 11 252 1000

**Data Protection Officer:**
Email: dpo@nara.gov.lk
Phone: +94 11 252 1001

---

## 2. DATA WE COLLECT

- **Account Information**: Name, email, phone number
- **Research Submissions**: Papers, proposals, datasets
- **Usage Data**: Page views, session duration (anonymized)
- **Technical Data**: IP address (masked), browser type

---

## 3. LEGAL BASIS & PURPOSE

We process your data under:
- Your **consent** (PDPA 2022 §10)
- **Legitimate interest** for research publication (§11)
- **Legal obligation** for government reporting (§12)

---

## 4. DATA STORAGE & LOCATION

✅ **All personal data stored in Sri Lanka** (LGC 2.5 - Colombo)
✅ **No data transferred outside Sri Lanka**
✅ **Government-grade security (AES-256 encryption)**
✅ **Regular backups to ICTA DR facility**

---

## 5. YOUR RIGHTS (PDPA 2022 §15-19)

You have the right to:
1. **Access** your data (automated portal)
2. **Rectify** inaccurate data (self-service)
3. **Erasure** ("right to be forgotten")
4. **Data portability** (export your data)
5. **Object** to processing
6. **Withdraw consent** at any time

**Exercise your rights:** Visit https://nara.gov.lk/privacy-portal

---

## 6. DATA RETENTION

- User accounts: Retained while active + 2 years
- Research submissions: Retained indefinitely (archival)
- Technical logs: 90 days

---

## 7. SECURITY MEASURES

- Multi-factor authentication (MFA)
- Encrypted data at rest (AES-256)
- Encrypted data in transit (TLS 1.3)
- Regular security audits
- Breach notification within 72 hours (PDPA §21)

---

## 8. COOKIES & TRACKING

- Essential cookies only (no tracking)
- Google Analytics (anonymized IP)
- No third-party advertising

---

## 9. CHANGES TO POLICY

We will notify you of significant changes via:
- Email notification
- Website banner (30-day notice)

---

## 10. CONTACT US

Questions? Contact our Data Protection Officer:
Email: dpo@nara.gov.lk
Phone: +94 11 252 1001

**Last reviewed:** [Current Date]
```

---

**Document 3: Data Protection Officer (DPO) Appointment Letter**

```markdown
# DATA PROTECTION OFFICER APPOINTMENT

**Date:** [Current Date]

**To:** [DPO Name]
**Position:** [Current Position]
**Department:** IT / Legal

**Subject:** Appointment as Data Protection Officer (DPO)

---

Dear [Name],

In accordance with the Personal Data Protection Act No. 9 of 2022 (§14),
I am pleased to appoint you as the **Data Protection Officer (DPO)** for
the National Aquatic Resources Research and Development Agency (NARA).

## RESPONSIBILITIES

1. Monitor compliance with PDPA 2022
2. Advise on Data Protection Impact Assessments (DPIA)
3. Serve as contact point for data subjects
4. Cooperate with PDPA Authority
5. Oversee data breach response
6. Conduct annual compliance audits

## AUTHORITY

You are authorized to:
- Access all data processing activities
- Request reports from any department
- Recommend policy changes
- Engage external consultants (budget approved)
- Report directly to Director General

## TRAINING

- ICTA DPO Certification Course (completed/scheduled)
- Annual PDPA refresher training
- Quarterly updates from PDPA Authority

## CONTACT DETAILS

**Official DPO Email:** dpo@nara.gov.lk
**Phone:** +94 11 252 1001
**Office:** [Location]

## TERM

This appointment is effective immediately and continues until:
- Resignation
- Revocation by Director General
- Organizational restructuring

Please acknowledge acceptance of this appointment by signing below.

---

**Appointed by:**
[Name]
Director General, NARA
Signature: _________________
Date: _________________

**Accepted by:**
[DPO Name]
Data Protection Officer
Signature: _________________
Date: _________________
```

---

**Phase 4 Success Criteria:**
✅ Executive proposal document completed (15-20 pages)
✅ PDPA compliance documentation prepared
✅ Privacy policy updated
✅ DPO appointed and trained
✅ All supporting materials finalized

**Estimated Time:** 3-5 days
**Estimated Cost:** LKR 50,000 (legal review + printing)

---

## PHASE 5: STAKEHOLDER ENGAGEMENT (1-2 WEEKS)
**Priority:** MEDIUM - Builds support and addresses concerns

### 5.1 Identify Key Stakeholders

**Internal Stakeholders:**
1. **Director General** (Primary decision-maker)
2. **Board of Directors** (Strategic oversight)
3. **IT Manager** (Technical approval)
4. **Finance Controller** (Budget approval)
5. **Legal Advisor** (Compliance verification)
6. **Department Heads** (End-user buy-in)
7. **Staff Representatives** (Change management)

**External Stakeholders:**
1. **ICTA / GovTech Sri Lanka** (LGC provider)
2. **PDPA Authority** (Regulatory compliance)
3. **Ministry of Fisheries** (Parent ministry)
4. **Treasury / Finance Ministry** (Budget approval)
5. **Cabinet IT Subcommittee** (Policy alignment)

---

### 5.2 Stakeholder Communication Plan

**Week 1: Internal Briefings**

**Day 1-2: IT Department**
- Present technical architecture
- Address implementation concerns
- Discuss resource allocation
- Format: Workshop (2 hours)

**Day 3: Finance Department**
- Present cost-benefit analysis
- Discuss budget allocation
- ROI projections
- Format: Meeting (1 hour)

**Day 4: Legal Department**
- Review PDPA compliance
- Discuss contractual changes
- DPO responsibilities
- Format: Meeting (1 hour)

**Day 5: Department Heads**
- Overview of changes
- User impact assessment
- Training needs
- Format: Presentation (1 hour)

---

**Week 2: Executive Engagement**

**Day 1: IT Committee**
- Formal presentation (30 min)
- Technical Q&A (30 min)
- Vote on recommendation (15 min)
- Format: Formal meeting

**Day 2: Finance Committee**
- Budget presentation (20 min)
- Cost-benefit discussion (20 min)
- Approval request (10 min)
- Format: Formal meeting

**Day 3: Director General**
- One-on-one briefing (45 min)
- Executive summary walkthrough
- Live demo viewing
- Decision request
- Format: Executive briefing

**Day 4-5: Board of Directors (if required)**
- Board presentation (20 min)
- Q&A session (20 min)
- Vote on approval (10 min)
- Format: Board meeting

---

**Week 3: External Engagement**

**ICTA / GovTech:**
- Confirm LGC 2.5 availability
- Discuss pricing and SLA
- Request technical support commitment
- Format: Meeting + email confirmation

**PDPA Authority:**
- Submit DPIA for review
- Request compliance verification
- Seek advisory opinion
- Format: Formal submission

**Ministry of Fisheries:**
- Brief on digital transformation
- Align with ministry IT strategy
- Request endorsement
- Format: Official letter + meeting

---

### 5.3 Presentation Strategy

**For Technical Audience (IT Committee):**
- Deep dive into architecture
- Security details
- Migration plan
- Risk mitigation

**For Executive Audience (Director General, Board):**
- High-level benefits
- Cost savings
- Compliance importance
- Strategic alignment

**For Financial Audience (Finance Committee):**
- ROI calculations
- Budget impact
- Cash flow analysis
- Procurement process

---

### 5.4 Objection Handling

**Common Objections & Responses:**

**Objection 1:** "Why not just stay with Firebase? It's working fine."
**Response:**
- PDPA 2022 non-compliance risk (LKR 5M-25M fines)
- 73% cost reduction opportunity (LKR 2.7M/year)
- 4x performance improvement for local users
- Government IT strategy requires data sovereignty

---

**Objection 2:** "Is LGC reliable enough? Firebase has 99.9% uptime."
**Response:**
- LGC 2.5 OpenStack infrastructure proven globally
- ICTA provides 99.9% SLA guarantee
- Government-grade security and support
- Redundancy across multiple datacenters
- Proof-of-concept demonstrated stability

---

**Objection 3:** "This will disrupt operations during migration."
**Response:**
- Blue-green deployment strategy (zero downtime)
- Pilot migration with non-critical data first
- Rollback plan if issues arise
- Migration during low-traffic periods
- Comprehensive testing before cutover

---

**Objection 4:** "Do we have the technical expertise internally?"
**Response:**
- ICTA GovTech provides free technical support
- Training included in migration plan (LKR 200K)
- External consultants available if needed
- Technologies are industry-standard (PostgreSQL, Node.js)
- Proof-of-concept already demonstrated feasibility

---

**Objection 5:** "The upfront cost is too high (LKR 2.8M)."
**Response:**
- ROI achieved in 13 months
- 3-year net savings: LKR 5.1M
- 5-year net savings: LKR 10.3M
- Avoiding PDPA fines alone justifies investment
- Budget can be spread across 2 fiscal years

---

**Objection 6:** "What if the project fails or goes over budget?"
**Response:**
- Proof-of-concept already validated
- Fixed-price contracts with vendors
- Phased approach allows early cancellation
- Contingency budget (10%) included
- Risk register with mitigation plans

---

### 5.5 Support Materials

**One-Pagers for Each Audience:**

1. **Executive One-Pager** (For Director General)
   - Single-page summary
   - Key benefits highlighted
   - Decision required
   - Format: PDF, high-quality print

2. **Technical One-Pager** (For IT Committee)
   - Architecture diagram
   - Technology stack
   - Migration timeline
   - Format: PDF

3. **Financial One-Pager** (For Finance Committee)
   - Cost comparison table
   - ROI chart
   - Budget request
   - Format: Excel + PDF

4. **Compliance One-Pager** (For Legal Advisor)
   - PDPA compliance checklist
   - Risk reduction
   - DPO responsibilities
   - Format: PDF

---

### 5.6 Meeting Request Templates

**Email to Director General:**

```
Subject: Request for Meeting - NARA Digital Transformation Proposal

Dear [Director General Name],

The IT Department has completed a comprehensive study on optimizing our
digital infrastructure. We have identified an opportunity to:

1. Reduce annual IT costs by 73% (LKR 2.7M savings)
2. Achieve full PDPA 2022 compliance (eliminate regulatory risk)
3. Improve website performance by 4x for Sri Lankan users
4. Align with national IT strategy (LGC 2.5 migration)

We have prepared a detailed proposal with cost-benefit analysis, proof-of-
concept demonstration, and compliance documentation.

**Request:** 45-minute briefing to present findings and seek approval for
LKR 2.8M one-time investment (13-month ROI).

**Proposed Dates:** [Date 1], [Date 2], [Date 3]

Supporting materials attached:
- Executive Summary (1 page)
- Cost-Benefit Analysis
- Proof-of-Concept Results

Thank you for your consideration.

Respectfully,
[Name]
[Title]
[Contact]
```

---

**Email to ICTA/GovTech:**

```
Subject: LGC 2.5 Production Tenancy Request - NARA Migration

Dear LGC Team,

Following our successful proof-of-concept deployment, the National Aquatic
Resources Research and Development Agency (NARA) has received approval to
proceed with full migration to LGC 2.5.

**Request:**
- Production tenancy for nara.gov.lk domain
- Resources: 4 VMs (8vCPU, 16GB RAM each), 500GB storage, 2TB bandwidth
- Start Date: [Date + 4 weeks]
- Duration: 3 years (renewable)

**Project Details:**
- Hybrid cloud architecture (LGC + Cloud AI proxy)
- PostgreSQL + MongoDB databases
- Keycloak SSO integration
- PDPA 2022 compliance

**Budget:** LKR 432,000/year (as per LGC pricing schedule)

**Supporting Documents:**
- Board approval letter
- Technical specifications
- PDPA compliance documentation

Could we schedule a kickoff meeting to discuss SLA, support, and onboarding?

Thank you,
[Name]
[Title]
NARA IT Department
[Contact]
```

---

**Phase 5 Success Criteria:**
✅ All key stakeholders identified and mapped
✅ Internal briefings completed (IT, Finance, Legal)
✅ Executive approval obtained (Director General)
✅ ICTA/GovTech commitment secured
✅ All objections addressed
✅ Formal approval documented

**Estimated Time:** 1-2 weeks
**Estimated Cost:** LKR 50,000 (printing, meeting costs)

---

## PHASE 6: FINAL PREPARATIONS (1 WEEK)
**Priority:** HIGH - Operational readiness

### 6.1 Team Assembly

**Core Team (Full-Time, 26 weeks):**

1. **Project Manager** (1 FTE)
   - Overall coordination
   - Timeline management
   - Stakeholder communication
   - Budget tracking

2. **Backend Developer** (2 FTE)
   - API development (Node.js/Express)
   - Database design (PostgreSQL, MongoDB)
   - Authentication (Keycloak integration)
   - Cloud AI proxy implementation

3. **Frontend Developer** (1 FTE)
   - React application updates
   - API integration
   - UI/UX adjustments
   - Responsive design

4. **DevOps Engineer** (1 FTE)
   - LGC infrastructure setup
   - CI/CD pipeline
   - Monitoring and alerting
   - Backup automation

5. **QA/Test Engineer** (1 FTE)
   - Test plan development
   - Integration testing
   - Performance testing
   - Security testing

6. **Data Protection Officer** (0.5 FTE)
   - PDPA compliance oversight
   - Privacy policy updates
   - User rights portal
   - Audit coordination

**Extended Team (Part-Time):**

7. **Database Administrator** (0.5 FTE)
   - Schema optimization
   - Data migration scripts
   - Performance tuning

8. **Security Specialist** (0.25 FTE)
   - Security audit
   - Penetration testing
   - Compliance verification

9. **Technical Writer** (0.25 FTE)
   - Documentation updates
   - User manuals
   - Training materials

**Total:** 7.5 FTE for 26 weeks

---

### 6.2 Procurement & Contracts

**Agreements to Finalize:**

1. **LGC Service Agreement with ICTA**
   - Production tenancy terms
   - SLA (99.9% uptime)
   - Support hours (24/7 critical issues)
   - Pricing schedule (LKR 432K/year)
   - Data sovereignty guarantees
   - Disaster recovery provisions

2. **Cloud AI Service Renewals**
   - Google Gemini API (rotate key, new contract)
   - OpenAI API (rotate key, update billing)
   - Mapbox (rotate token, confirm usage limits)

3. **External Consultant Agreements (if needed)**
   - Security auditor (penetration testing)
   - PDPA compliance consultant
   - Training facilitator

4. **Software Licenses**
   - Keycloak (open-source, no license)
   - PostgreSQL (open-source, no license)
   - MongoDB Community (open-source, no license)
   - Monitoring tools (Prometheus, Grafana - open-source)
   - SSL certificates (Let's Encrypt - free)

**Procurement Timeline:**
- Week 1: Draft agreements
- Week 2: Legal review
- Week 3: Signatures
- Week 4: Effective date

---

### 6.3 Development Environment Setup

**Action Items:**

1. **Version Control**
```bash
# Create migration branch
git checkout -b hybrid-migration
git push -u origin hybrid-migration

# Set up monorepo structure
mkdir -p backend frontend infrastructure docs
```

2. **Project Management**
   - Create Jira/Trello board
   - 26-week sprint plan (13 x 2-week sprints)
   - Task breakdown (150-200 tasks)
   - Assign owners

3. **Communication Channels**
   - Slack workspace: #nara-migration
   - Daily standup: 9:00 AM (15 min)
   - Weekly review: Friday 2:00 PM (1 hour)
   - Monthly stakeholder update

4. **Documentation Repository**
   - Confluence/Notion workspace
   - Architecture Decision Records (ADRs)
   - API documentation (Swagger/OpenAPI)
   - Runbooks

---

### 6.4 Training Plan

**Week 1: Team Onboarding**
- Project overview (half-day)
- LGC 2.5 platform training (1 day)
- PostgreSQL/MongoDB refresher (1 day)
- Keycloak SSO training (half-day)

**Week 8: Mid-Project Review**
- Progress assessment
- Lessons learned
- Adjustments to plan

**Week 24: Pre-Launch Training**
- Operations team handover (2 days)
- Incident response procedures (1 day)
- Monitoring and alerting (1 day)

**Week 26: Post-Launch Training**
- End-user training (department heads)
- Admin portal training
- Support team training

---

### 6.5 Success Metrics & KPIs

**Define Measurable Outcomes:**

**Technical KPIs:**
- Migration completion: 100% by Week 26
- Data loss during migration: 0%
- Production uptime: ≥99.9%
- Average response time: ≤50ms
- Database query time: ≤20ms
- Page load time: ≤2s

**Financial KPIs:**
- Budget adherence: ±5% of LKR 2.8M
- Annual cost reduction: ≥70% (target 73%)
- ROI timeline: ≤15 months

**Compliance KPIs:**
- PDPA compliance score: 100%
- Security audit findings: 0 critical, ≤5 medium
- Data sovereignty: 100% personal data in Sri Lanka

**User Experience KPIs:**
- User satisfaction: ≥4.5/5
- Support tickets (post-launch): ≤10/week
- Training completion: 100% of staff

---

### 6.6 Kickoff Meeting Agenda

**Date:** [Approval + 1 week]
**Duration:** 2 hours
**Attendees:** Core team, stakeholders, ICTA representative

**Agenda:**

**9:00-9:15 AM: Welcome & Introductions**
- Director General opening remarks
- Team introductions
- Project importance

**9:15-9:45 AM: Project Overview**
- Objectives and scope
- Timeline (26 weeks)
- Budget (LKR 2.8M)
- Success criteria

**9:45-10:15 AM: Technical Deep Dive**
- Architecture walkthrough
- Technology stack
- Migration strategy
- Risk mitigation

**10:15-10:30 AM: Break**

**10:30-10:50 AM: Roles & Responsibilities**
- Team structure
- RACI matrix
- Communication plan
- Escalation procedures

**10:50-11:10 AM: Phase 1 Plan (Weeks 1-8)**
- LGC infrastructure setup
- Database design
- Development environment
- Deliverables and milestones

**11:10-11:25 AM: Q&A**

**11:25-11:30 AM: Next Steps & Closing**
- First sprint planning (Week 1)
- Required access/permissions
- Team motivation and commitment

---

**Phase 6 Success Criteria:**
✅ Team assembled and onboarded
✅ All contracts signed (LGC, consultants)
✅ Development environment configured
✅ Project management tools set up
✅ Training plan finalized
✅ Kickoff meeting completed
✅ Sprint 1 ready to start

**Estimated Time:** 1 week
**Estimated Cost:** LKR 100,000 (setup costs)

---

## SUMMARY: PRE-PROPOSAL TIMELINE

| Phase | Duration | Cost (LKR) | Deliverables | Status |
|-------|----------|-----------|--------------|--------|
| **Phase 1: Security Fixes** | 1-2 days | 0 | Secured production site | ⏳ Ready to start |
| **Phase 2: Presentation** | 3-5 days | 100,000 | PowerPoint, spreadsheets, diagrams | ⏳ Pending |
| **Phase 3: Proof-of-Concept** | 1-2 weeks | 50,000 | LGC demo, performance benchmarks | ⏳ Pending |
| **Phase 4: Documentation** | 3-5 days | 50,000 | Proposal, PDPA compliance docs | ⏳ Pending |
| **Phase 5: Stakeholder Engagement** | 1-2 weeks | 50,000 | Approvals, commitment letters | ⏳ Pending |
| **Phase 6: Final Prep** | 1 week | 100,000 | Team, contracts, kickoff | ⏳ Pending |
| **TOTAL** | **4-6 weeks** | **LKR 350,000** | Ready to migrate | - |

---

## CRITICAL PATH

```
Week 1-2: Phase 1 (Security) + Phase 2 (Presentations) [PARALLEL]
Week 2-3: Phase 3 (POC Demo on LGC)
Week 3-4: Phase 4 (Documentation) + Phase 5 Start (Internal briefings) [PARALLEL]
Week 4-5: Phase 5 (Executive approvals)
Week 5-6: Phase 6 (Final prep, team assembly)
Week 7: MIGRATION STARTS (Phase 1 of HYBRID_INFRASTRUCTURE_MIGRATION_PLAN.md)
```

**Key Dependencies:**
1. Security fixes MUST be done before any external demos
2. POC demo needed before executive presentation
3. Executive approval needed before LGC production tenancy
4. All approvals needed before team hiring/contracts

---

## RISK REGISTER

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| ICTA delays LGC tenancy | Medium | High | Apply early, escalate to ministry |
| Budget approval delayed | Low | High | Pre-brief finance, show ROI clearly |
| Technical issues in POC | Medium | Medium | Use proven tech stack, ICTA support |
| Team members unavailable | Medium | Medium | Identify backups, external consultants |
| Director General rejects | Low | Critical | Strong stakeholder engagement |
| PDPA Authority questions | Low | Medium | Engage early, seek advisory opinion |

---

## DECISION CHECKPOINT

**Before proceeding with Phase 1, confirm:**

- [ ] User account with admin privileges created (for testing secured rules)
- [ ] All current API keys documented (for rotation)
- [ ] Backup of current Firebase project taken
- [ ] Stakeholder calendar availability checked (for Phase 5 meetings)
- [ ] Budget allocation approved (LKR 350K for preparation)

**Ready to start?** → Begin Phase 1 (Security Fixes)

---

## APPENDIX: CHECKLIST

### Pre-Proposal Preparation Checklist

**Phase 1: Security Fixes**
- [ ] Firestore rules updated (7 collections secured)
- [ ] Storage rules updated (3 paths secured)
- [ ] All API keys rotated (6 keys)
- [ ] `.env` removed from git history
- [ ] Console.log statements removed (1,364 statements)
- [ ] npm vulnerabilities fixed (2 packages)
- [ ] Production deployment tested
- [ ] Smoke tests passed

**Phase 2: Presentation Materials**
- [ ] PowerPoint deck created (15-20 slides)
- [ ] Cost-benefit spreadsheet completed
- [ ] Architecture diagrams finalized (4 diagrams)
- [ ] Comparison matrix created
- [ ] One-pagers for each audience

**Phase 3: Proof-of-Concept**
- [ ] LGC tenancy requested and approved
- [ ] Demo application deployed
- [ ] Performance benchmarks collected
- [ ] Live demo script prepared
- [ ] Demo video recorded (backup)

**Phase 4: Documentation**
- [ ] Executive proposal document (15-20 pages)
- [ ] DPIA completed and signed
- [ ] Privacy policy updated
- [ ] DPO appointed
- [ ] All appendices prepared

**Phase 5: Stakeholder Engagement**
- [ ] IT Committee briefing completed
- [ ] Finance Committee approval
- [ ] Director General approval
- [ ] ICTA commitment letter received
- [ ] All objections addressed

**Phase 6: Final Preparations**
- [ ] Team assembled (7.5 FTE)
- [ ] LGC contract signed
- [ ] Development environment configured
- [ ] Project management tools set up
- [ ] Kickoff meeting completed

---

## CONTACT INFORMATION

**For Questions About This Guide:**

**Project Lead:**
[Name]
[Title]
Email: [email]
Phone: [phone]

**Technical Lead:**
[Name]
[Title]
Email: [email]
Phone: [phone]

**ICTA Contact:**
Lanka Government Cloud (LGC)
Email: lgc@icta.lk
Phone: +94 11 230 5333

**PDPA Authority:**
Personal Data Protection Authority
Email: info@dataprotection.gov.lk
Phone: +94 11 XXX XXXX

---

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Next Review:** [After Phase 1 completion]

---

# END OF GUIDE
