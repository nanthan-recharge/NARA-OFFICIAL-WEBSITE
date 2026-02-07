# 🏛️ NARA HYBRID INFRASTRUCTURE MIGRATION PLAN
## Government-Compliant Data Sovereignty Strategy

**Project:** NARA Official Website - Hybrid Cloud Migration
**Date:** October 28, 2025
**Compliance:** Sri Lanka PDPA 2022, ICTA Cloud Policy 2025, LGC 2.5

---

## 📋 EXECUTIVE SUMMARY

### Migration Objective
Transform NARA website from **100% Public Cloud (Firebase)** to a **Hybrid Government-Compliant Infrastructure** that:
- ✅ Stores sensitive government data on **Lanka Government Cloud (LGC 2.5)**
- ✅ Uses local government databases/servers for NARA operational data
- ✅ Leverages cloud services (Firebase/Google Cloud) only for AI/ML services
- ✅ Complies with **Sri Lanka Personal Data Protection Act (PDPA) 2022**
- ✅ Follows **ICTA Cloud Policy & Data Sovereignty Strategy 2025**
- ✅ Meets government data classification requirements

### Current State vs. Target State

| Component | Current (Firebase) | Target (Hybrid) |
|-----------|-------------------|-----------------|
| **User Data** | Firebase Auth | LGC 2.5 PostgreSQL |
| **NARA Data** | Cloud Firestore | Government On-Premise Database |
| **File Storage** | Firebase Storage | Government NAS/SAN + CDN |
| **Static Assets** | Firebase Hosting | LGC 2.5 Web Servers |
| **AI Services** | Firebase Functions | Google Cloud AI (API-only) |
| **Authentication** | Firebase Auth | Government SSO + LDAP |
| **Analytics** | Firebase Analytics | Self-hosted Matomo/Plausible |

---

## 🇱🇰 SRI LANKA GOVERNMENT COMPLIANCE

### 1. Personal Data Protection Act (PDPA) 2022

**Status:** ✅ Enacted - Implementation ongoing
**Authority:** Data Protection Authority of Sri Lanka (DPA)
**Implementation Date:** Phased rollout (some provisions delayed to 2025)

#### Key Requirements for NARA:

**Special Categories of Personal Data:**
- ❌ **CANNOT** store on foreign clouds:
  - Personal data revealing racial/ethnic origin
  - Political opinions, religious beliefs
  - Genetic data, biometric data
  - Health data, sexual orientation
  - Criminal records, children's data

- ✅ **MUST** store on LGC/Government infrastructure:
  - Library member profiles (personal data)
  - Research submissions (author information)
  - Maritime permit applications (user data)
  - Government employee records
  - Public consultation responses

**Cross-Border Data Transfer (Section 26):**
- Prohibited UNLESS third country has adequate data protection
- Public authorities MUST classify data before cloud transfer
- **Recommendation:** Keep ALL personal data in Sri Lanka

#### PDPA Compliance Checklist:
- [ ] Appoint Data Protection Officer (DPO)
- [ ] Conduct Data Protection Impact Assessment (DPIA)
- [ ] Classify all data categories (public, sensitive, special)
- [ ] Obtain consent for personal data processing
- [ ] Implement data breach notification procedures
- [ ] Maintain data processing registers
- [ ] Enable user rights (access, deletion, portability)

---

### 2. ICTA Cloud Policy & Strategy 2025

**Status:** ✅ Public Consultation Phase (Deadline: July 18, 2025)
**Authority:** Information and Communication Technology Agency (ICTA)
**Future Authority:** GovTech Ltd. (replacing ICTA in 3-6 months)

#### Data Sovereignty Zones

The policy defines 5 levels of data sovereignty:

| Level | Description | Hosting Location | Suitable for NARA |
|-------|-------------|------------------|-------------------|
| **Level 1** | Full Sovereignty | Sri Lanka Only | User data, NARA operational data |
| **Level 2** | Strong Localization | Sri Lanka + Backup abroad | Research papers, publications |
| **Level 3** | Hybrid Hosting | Sri Lanka + Global CDN | Static assets, images |
| **Level 4** | Global with Local Oversight | Global Cloud + Local mirror | AI/ML model results |
| **Level 5** | Global Hosting | Anywhere | Public announcements, news |

#### Recommended NARA Data Classification:

**Level 1 (Full Sovereignty - LGC 2.5):**
- Library member profiles
- Researcher profiles
- Government employee data
- Permit applications
- Financial transactions
- Internal admin data

**Level 2 (Strong Localization - LGC + Backup):**
- Research submissions
- Publications
- Project reports
- Maritime vessel data
- Fish advisory data

**Level 3 (Hybrid - LGC + CDN):**
- Website static files
- Division images
- PDF documents
- Video content (podcasts)

**Level 4 (Global with Oversight - Cloud AI):**
- AI translation results
- ML model predictions
- OCR processing results

**Level 5 (Global - Any CDN):**
- Public news
- Announcements
- Press releases
- Public event information

---

### 3. Lanka Government Cloud (LGC) 2.5

**Status:** ✅ Operational - Ready for workload transfer
**Infrastructure:** OpenStack-based IaaS + Mesosphere DC/OS containers
**Capacity:** 175+ tenants, 150+ government organizations, 500+ websites

#### LGC 2.5 Services Available:

**Infrastructure as a Service (IaaS):**
- Virtual Machines (VMs) - OpenStack
- Container Support - DC/OS, Kubernetes
- Storage - Block, Object, File storage
- Networking - Virtual networks, Load balancers
- Disaster Recovery - Multi-site replication

**Platform Services:**
- Database hosting (PostgreSQL, MySQL, MongoDB)
- Web application hosting
- API gateway services
- Big Data cluster (Hadoop/Spark)
- Backup and archival services

**Security & Compliance:**
- ISO/IEC 27001 certified
- 24/7 monitoring and support
- DDoS protection
- Firewall and intrusion detection
- Regular security audits

#### LGC 2.5 Connectivity:
- Lanka Government Network (LGN 2.0) integration
- High-speed fiber connectivity
- Secure VPN access for remote users
- API endpoints for external integrations

---

## 🏗️ HYBRID ARCHITECTURE DESIGN

### Target Infrastructure Model

```
┌─────────────────────────────────────────────────────────────┐
│                    NARA HYBRID CLOUD ARCHITECTURE            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  TIER 1: GOVERNMENT INFRASTRUCTURE (LGC 2.5)                  │
│  ──────────────────────────────────────────────────────      │
│                                                               │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │  PostgreSQL Cluster │  │  MongoDB Cluster    │           │
│  │  - User Data        │  │  - NARA Content     │           │
│  │  - Library System   │  │  - Research Papers  │           │
│  │  - Maritime Data    │  │  - Publications     │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                                               │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │  Web Servers        │  │  File Storage       │           │
│  │  - Node.js/Express  │  │  - NAS/SAN          │           │
│  │  - React Frontend   │  │  - Research Files   │           │
│  │  - API Gateway      │  │  - User Uploads     │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                                               │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │  Authentication     │  │  Cache Layer        │           │
│  │  - Keycloak/LDAP    │  │  - Redis Cluster    │           │
│  │  - Gov SSO          │  │  - Session Store    │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                             │
                             │ Secure API Gateway
                             ├──────────────────────────────┐
                             │                              │
┌────────────────────────────▼────┐   ┌────────────────────▼──────┐
│  TIER 2: GOVERNMENT ON-PREMISE  │   │  TIER 3: CLOUD SERVICES   │
│  ────────────────────────────   │   │  ────────────────────────  │
│                                  │   │                            │
│  ┌─────────────────────┐        │   │  ┌──────────────────────┐ │
│  │  NARA HQ Database   │        │   │  │  Google Cloud AI     │ │
│  │  - Legacy Systems   │        │   │  │  - Gemini API        │ │
│  │  - Archive Data     │        │   │  │  - Translation API   │ │
│  │  - Internal Apps    │        │   │  │  - Vision API        │ │
│  └─────────────────────┘        │   │  └──────────────────────┘ │
│                                  │   │                            │
│  ┌─────────────────────┐        │   │  ┌──────────────────────┐ │
│  │  Network Storage    │        │   │  │  OpenAI (Optional)   │ │
│  │  - Backup Tapes     │        │   │  │  - GPT-4 API         │ │
│  │  - Historical Data  │        │   │  │  - Embeddings        │ │
│  └─────────────────────┘        │   │  └──────────────────────┘ │
│                                  │   │                            │
└──────────────────────────────────┘   │  ┌──────────────────────┐ │
                                       │  │  Global CDN          │ │
                                       │  │  - Cloudflare        │ │
                                       │  │  - Static Assets     │ │
                                       │  │  - DDoS Protection   │ │
                                       │  └──────────────────────┘ │
                                       │                            │
                                       └────────────────────────────┘
```

---

## 📊 DATA CLASSIFICATION & MIGRATION MAPPING

### Current Firebase Collections → Target Infrastructure

| Firebase Collection | Data Type | Target Infrastructure | Priority |
|---------------------|-----------|----------------------|----------|
| **adminProfiles** | Special (Personal) | LGC PostgreSQL | CRITICAL |
| **libraryUsers** | Special (Personal) | LGC PostgreSQL | CRITICAL |
| **researcherProfiles** | Special (Personal) | LGC PostgreSQL | CRITICAL |
| **library_members** | Special (Personal) | LGC PostgreSQL | CRITICAL |
| **researchSubmissions** | Sensitive | LGC MongoDB | HIGH |
| **book_loans** | Sensitive | LGC PostgreSQL | HIGH |
| **book_reservations** | Sensitive | LGC PostgreSQL | HIGH |
| **library_fines** | Sensitive | LGC PostgreSQL | HIGH |
| **government_eia_applications** | Sensitive | LGC PostgreSQL | HIGH |
| **government_licenses** | Sensitive | LGC PostgreSQL | HIGH |
| **maritime_permits** | Sensitive | LGC PostgreSQL | HIGH |
| **divisions** | Public | LGC MongoDB | MEDIUM |
| **divisionContent** | Public | LGC MongoDB | MEDIUM |
| **projects** | Public | LGC MongoDB | MEDIUM |
| **publications** | Public | LGC MongoDB + CDN | MEDIUM |
| **researchContent** | Public | LGC MongoDB + CDN | MEDIUM |
| **podcasts** | Public | LGC MongoDB + CDN | MEDIUM |
| **fish_advisories** | Public | LGC MongoDB | MEDIUM |
| **maritime_vessels** | Public | NARA On-Premise DB | LOW |
| **maritime_ports** | Public | NARA On-Premise DB | LOW |
| **news/announcements** | Public | CDN Only | LOW |

### Firebase Storage → Target Storage

| Firebase Storage Path | Content Type | Target Storage | CDN |
|-----------------------|--------------|----------------|-----|
| `/users/{uid}/**` | Personal Documents | LGC NAS (Encrypted) | ❌ |
| `/research/{uid}/**` | Research Files | LGC Object Storage | ✅ |
| `/pdfs/**` | Public PDFs | LGC NAS + CDN | ✅ |
| `/podcasts/**` | Video Files | LGC Object Storage + CDN | ✅ |
| `/divisions/**` | Division Images | LGC Object Storage + CDN | ✅ |
| `/public/**` | Static Assets | CDN Only | ✅ |

---

## 🔧 TECHNICAL MIGRATION STRATEGY

### Phase 1: Infrastructure Setup (Weeks 1-4)

#### Week 1-2: LGC 2.5 Provisioning

**Tasks:**
1. Contact ICTA/GovTech to request LGC tenancy
2. Submit tenancy application with NARA justification
3. Provision resources:
   - 4x Virtual Machines (4 vCPU, 16GB RAM each)
   - PostgreSQL cluster (Primary + 2 Replicas)
   - MongoDB cluster (3-node replica set)
   - 500GB NAS storage
   - 2TB Object storage
   - Redis cluster (3 nodes)

**LGC Contact:**
- Email: lgc@icta.lk
- Website: https://lgc.gov.lk/
- Phone: +94 11 2 369 099

**Estimated Cost:** LKR 500,000 - 1,000,000/year (government pricing)

#### Week 3-4: On-Premise Infrastructure

**Tasks:**
1. Assess current NARA HQ infrastructure:
   - Network bandwidth (minimum 100 Mbps recommended)
   - Existing database servers
   - Backup systems
   - Firewall/security

2. Setup VPN connection to LGC:
   - IPSec VPN tunnel
   - Configure routing
   - Test connectivity

3. Install monitoring tools:
   - Prometheus + Grafana
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Uptime monitoring

### Phase 2: Database Migration (Weeks 5-8)

#### Database Schema Design

**PostgreSQL Databases (LGC):**
```sql
-- Database: nara_users (Personal Data - PDPA Protected)
CREATE DATABASE nara_users;

TABLES:
- admin_profiles (id, uid, email, name, role, created_at, updated_at)
- library_members (id, uid, member_id, name, email, phone, address, status)
- researchers (id, uid, name, email, institution, research_areas)
- book_loans (id, member_id, book_id, issue_date, return_date, status)
- book_reservations (id, member_id, book_id, reserved_date, status)
- fines (id, member_id, amount, reason, paid, paid_date)
- government_applications (id, user_id, type, data, status, submitted_date)

-- Database: nara_operations (Government Operational Data)
CREATE DATABASE nara_operations;

TABLES:
- maritime_permits (id, applicant_id, vessel_id, permit_type, valid_from, valid_to)
- eia_applications (id, applicant_id, project_name, status, review_notes)
- licenses (id, user_id, license_type, issued_date, expiry_date)
```

**MongoDB Databases (LGC):**
```javascript
// Database: nara_content
db.createCollection("divisions")
db.createCollection("division_content")
db.createCollection("projects")
db.createCollection("team_members")
db.createCollection("publications")
db.createCollection("research_papers")
db.createCollection("podcasts")
db.createCollection("fish_advisories")
db.createCollection("maritime_data")

// Database: nara_analytics
db.createCollection("page_views")
db.createCollection("user_sessions")
db.createCollection("search_queries")
```

#### Migration Tools

**Firestore to PostgreSQL:**
```bash
# Install Firestore export tool
npm install -g firestore-export-import

# Export Firestore data
firestore-export --accountCredentials serviceAccountKey.json \
  --backupFile firestore-backup.json \
  --nodePath users

# Convert JSON to SQL
node scripts/firestore-to-postgres.js firestore-backup.json

# Import to PostgreSQL
psql -h lgc.database.lk -U nara_admin -d nara_users < import.sql
```

**Firestore to MongoDB:**
```bash
# Direct migration using Node.js script
node scripts/migrate-firestore-to-mongodb.js

# Verify data integrity
node scripts/verify-migration.js
```

### Phase 3: Application Refactoring (Weeks 9-16)

#### Backend API Development

**New Tech Stack:**
- **Framework:** Node.js + Express.js
- **ORM:** Prisma (PostgreSQL) + Mongoose (MongoDB)
- **Authentication:** Keycloak (Government SSO)
- **API:** RESTful + GraphQL
- **Caching:** Redis
- **Job Queue:** Bull (Redis-based)

**File Structure:**
```
nara-backend/
├── src/
│   ├── config/
│   │   ├── database.js       # PostgreSQL + MongoDB connections
│   │   ├── redis.js          # Redis cache config
│   │   ├── keycloak.js       # SSO configuration
│   │   └── lgc.js            # LGC-specific settings
│   ├── models/
│   │   ├── postgres/         # Prisma schemas
│   │   └── mongodb/          # Mongoose schemas
│   ├── routes/
│   │   ├── users.js
│   │   ├── library.js
│   │   ├── research.js
│   │   ├── maritime.js
│   │   └── ai.js             # Cloud AI proxy endpoints
│   ├── middleware/
│   │   ├── auth.js           # JWT + Keycloak verification
│   │   ├── pdpa.js           # PDPA compliance checks
│   │   ├── rateLimit.js      # API rate limiting
│   │   └── audit.js          # Activity logging
│   ├── services/
│   │   ├── cloudAI.js        # Google Cloud AI integration
│   │   ├── fileStorage.js    # LGC NAS integration
│   │   └── email.js          # Government email service
│   └── utils/
│       ├── encryption.js     # Data encryption at rest
│       └── validation.js     # Input validation
├── prisma/
│   └── schema.prisma         # PostgreSQL schema
├── tests/
└── docker-compose.yml        # For local development
```

#### Frontend Modifications

**Environment Variables:**
```javascript
// .env.production (LGC Deployment)
VITE_API_BASE_URL=https://api.nara.gov.lk
VITE_AUTH_URL=https://sso.gov.lk/auth
VITE_STORAGE_URL=https://cdn.nara.gov.lk

// Cloud AI endpoints (proxy through backend)
VITE_AI_ENDPOINT=/api/ai/translate
VITE_VISION_ENDPOINT=/api/ai/vision
```

**API Client Changes:**
```javascript
// OLD: Direct Firebase access
import { db } from './config/firebase';
const snapshot = await getDocs(collection(db, 'users'));

// NEW: API calls to LGC backend
import axios from 'axios';
const response = await axios.get('/api/users', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Phase 4: AI Services Integration (Weeks 17-18)

**Cloud AI Proxy Architecture:**

```javascript
// Backend: src/routes/ai.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load API key from environment (NOT from frontend)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    // Validate request
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    // Call Google Cloud AI
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(
      `Translate to ${targetLanguage}: ${text}`
    );

    // Store result in LGC database for caching
    await db.ai_translations.create({
      source_text: text,
      target_lang: targetLanguage,
      result: result.response.text(),
      created_at: new Date()
    });

    res.json({ translation: result.response.text() });
  } catch (error) {
    console.error('AI translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

module.exports = router;
```

**Frontend Usage:**
```javascript
// Frontend: src/services/aiService.js
export const translateText = async (text, targetLanguage) => {
  const response = await fetch('/api/ai/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ text, targetLanguage })
  });

  return response.json();
};
```

**Benefits:**
- ✅ API keys never exposed to frontend
- ✅ Rate limiting controlled server-side
- ✅ Results cached in LGC database
- ✅ Usage monitoring and cost control
- ✅ Compliance with PDPA (data processed in Sri Lanka first)

### Phase 5: File Storage Migration (Weeks 19-20)

**LGC Object Storage Setup:**

```javascript
// Backend: File upload to LGC NAS
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Different folders based on data classification
    const folder = req.user.isAdmin
      ? '/mnt/lgc-storage/admin'
      : '/mnt/lgc-storage/public';

    await fs.mkdir(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Secure filename with UUID
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    // Validate file types based on PDPA requirements
    const allowedTypes = /pdf|doc|docx|xls|xlsx|jpg|jpeg|png|mp4/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    cb(null, isValid);
  }
});

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileRecord = await db.files.create({
      user_id: req.user.id,
      filename: req.file.filename,
      original_name: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploaded_at: new Date()
    });

    res.json({ file: fileRecord });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

**CDN Integration (Cloudflare):**

For public static assets only (Level 3-5 data):
```nginx
# LGC Web Server (nginx) configuration
server {
    listen 80;
    server_name cdn.nara.gov.lk;

    # Serve static files
    location /public/ {
        alias /mnt/lgc-storage/public/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Protect sensitive files
    location /private/ {
        alias /mnt/lgc-storage/private/;
        internal; # Only accessible via X-Accel-Redirect
    }
}
```

### Phase 6: Authentication Migration (Weeks 21-22)

**Government SSO Integration:**

**Option 1: Keycloak (Recommended)**
```yaml
# docker-compose.yml (on LGC VM)
services:
  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: ${KEYCLOAK_DB_PASSWORD}
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
    ports:
      - "8080:8080"
    command: start-dev

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: ${KEYCLOAK_DB_PASSWORD}
    volumes:
      - keycloak-postgres:/var/lib/postgresql/data
```

**Option 2: Government LDAP Integration**
```javascript
// Backend: LDAP authentication
const ldap = require('ldapjs');

const authenticateWithGovLDAP = async (username, password) => {
  const client = ldap.createClient({
    url: 'ldap://gov-ldap.gov.lk:389'
  });

  return new Promise((resolve, reject) => {
    const dn = `uid=${username},ou=users,dc=gov,dc=lk`;

    client.bind(dn, password, (err) => {
      if (err) {
        reject(new Error('Authentication failed'));
      } else {
        // Generate JWT token
        const token = jwt.sign(
          { username, dn },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        resolve(token);
      }
      client.unbind();
    });
  });
};
```

### Phase 7: Testing & Validation (Weeks 23-24)

**Test Checklist:**
- [ ] Load testing (Apache JMeter)
- [ ] Security penetration testing
- [ ] PDPA compliance audit
- [ ] Data integrity verification
- [ ] Backup & restore procedures
- [ ] Disaster recovery drill
- [ ] Performance benchmarks
- [ ] API endpoint testing
- [ ] User acceptance testing (UAT)

### Phase 8: Deployment & Go-Live (Weeks 25-26)

**Deployment Strategy:**
1. **Blue-Green Deployment**
   - Deploy new LGC infrastructure (Green)
   - Keep Firebase running (Blue)
   - Test Green environment thoroughly
   - Switch DNS to Green
   - Keep Blue for 2 weeks as fallback

2. **DNS Migration:**
```
nara.gov.lk → LGC Load Balancer IP
api.nara.gov.lk → LGC API Server IP
cdn.nara.gov.lk → Cloudflare/LGC CDN
```

3. **Monitoring Setup:**
   - Uptime monitoring (UptimeRobot, Pingdom)
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)
   - Security monitoring (OSSEC, Fail2ban)

---

## 💰 COST COMPARISON

### Current (100% Firebase)

| Service | Monthly Cost (USD) | Annual Cost (USD) |
|---------|-------------------|-------------------|
| Firebase Hosting | $25 | $300 |
| Cloud Firestore | $150 | $1,800 |
| Firebase Storage | $100 | $1,200 |
| Firebase Functions | $200 | $2,400 |
| Firebase Auth | $50 | $600 |
| **TOTAL** | **$525** | **$6,300** |

**Plus:** API costs (Gemini, OpenAI, Mapbox, etc.): ~$500/month = **$6,000/year**

**GRAND TOTAL:** ~**$12,300 USD/year** (~**LKR 3.69 million/year**)

### Target (Hybrid Infrastructure)

| Service | Monthly Cost (LKR) | Annual Cost (LKR) |
|---------|-------------------|-------------------|
| LGC 2.5 Tenancy (VMs, Storage, DB) | 50,000 | 600,000 |
| Government Network Connectivity | 10,000 | 120,000 |
| SSL Certificates (Gov) | 0 (Free) | 0 |
| CDN (Cloudflare Pro) | 6,000 | 72,000 |
| Cloud AI APIs (reduced usage) | 15,000 | 180,000 |
| Monitoring Tools (Self-hosted) | 0 | 0 |
| **TOTAL** | **81,000** | **972,000** |

**Annual Savings:** ~**LKR 2.7 million** (~75% reduction)

**One-time Migration Costs:**
- Development & Migration: LKR 2,000,000
- Testing & UAT: LKR 500,000
- Training: LKR 300,000
- **TOTAL:** LKR 2,800,000

**ROI:** Payback period = 1.2 years

---

## 🔐 SECURITY & COMPLIANCE

### Data Encryption

**At Rest:**
```javascript
// PostgreSQL Transparent Data Encryption (TDE)
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = '/etc/ssl/certs/server.crt';
ALTER SYSTEM SET ssl_key_file = '/etc/ssl/private/server.key';

// Application-level encryption for sensitive fields
const crypto = require('crypto');
const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}
```

**In Transit:**
- TLS 1.3 for all connections
- mTLS for LGC-to-NARA VPN
- HTTPS only (HSTS enabled)

### Access Control

**Role-Based Access Control (RBAC):**
```sql
-- PostgreSQL roles
CREATE ROLE nara_admin;
CREATE ROLE nara_librarian;
CREATE ROLE nara_researcher;
CREATE ROLE nara_public;

-- Grant permissions
GRANT ALL ON DATABASE nara_users TO nara_admin;
GRANT SELECT, INSERT, UPDATE ON TABLE library_members TO nara_librarian;
GRANT SELECT ON TABLE research_papers TO nara_public;
```

### Audit Logging

**All operations logged:**
```javascript
// Audit middleware
const auditLog = async (req, res, next) => {
  const log = {
    user_id: req.user?.id,
    action: `${req.method} ${req.path}`,
    ip_address: req.ip,
    user_agent: req.get('user-agent'),
    timestamp: new Date(),
    data_accessed: req.params,
    pdpa_category: determinePDPACategory(req.path)
  };

  await db.audit_logs.create(log);
  next();
};
```

### PDPA Compliance Features

**User Rights Implementation:**
```javascript
// Right to Access
router.get('/api/pdpa/my-data', authMiddleware, async (req, res) => {
  const userData = await aggregateUserData(req.user.id);
  res.json(userData);
});

// Right to Delete
router.delete('/api/pdpa/delete-account', authMiddleware, async (req, res) => {
  await anonymizeUserData(req.user.id);
  res.json({ message: 'Data deleted successfully' });
});

// Right to Portability
router.get('/api/pdpa/export-data', authMiddleware, async (req, res) => {
  const userData = await exportUserData(req.user.id);
  res.download(userData.filename);
});
```

---

## 📋 IMPLEMENTATION TIMELINE

### Gantt Chart

```
Weeks 1-2:   [████████] LGC Provisioning
Weeks 3-4:   [████████] On-Premise Setup
Weeks 5-8:   [████████████████] Database Migration
Weeks 9-16:  [████████████████████████████████] Backend Development
Weeks 17-18: [████████] AI Integration
Weeks 19-20: [████████] File Storage Migration
Weeks 21-22: [████████] Authentication Migration
Weeks 23-24: [████████] Testing & Validation
Weeks 25-26: [████████] Deployment & Go-Live
```

**Total Duration:** 26 weeks (6.5 months)

---

## 🎯 SUCCESS CRITERIA

### Technical Metrics

- [ ] 99.9% uptime (LGC SLA)
- [ ] < 200ms API response time (p95)
- [ ] < 2s page load time
- [ ] Zero data breaches
- [ ] 100% PDPA compliance
- [ ] < $100/month cloud costs

### Compliance Metrics

- [ ] Data Protection Officer appointed
- [ ] DPIA completed
- [ ] All data classified
- [ ] Consent mechanisms implemented
- [ ] User rights portal live
- [ ] Audit logs retention (7 years)

### Business Metrics

- [ ] 75% cost reduction
- [ ] Government approval obtained
- [ ] User satisfaction > 90%
- [ ] Zero migration-related incidents

---

## 🚀 QUICK START GUIDE

### For NARA IT Team

**Step 1: Request LGC Access**
```bash
# Email template
To: lgc@icta.lk
Subject: LGC Tenancy Request - NARA

Dear LGC Team,

National Aquatic Resources Research and Development Agency (NARA)
requests tenancy on Lanka Government Cloud 2.5 for hosting our
official website and data systems.

Required Resources:
- 4x VMs (4 vCPU, 16GB RAM each)
- PostgreSQL cluster (100GB)
- MongoDB cluster (200GB)
- Object Storage (2TB)
- Redis cluster

Justification: PDPA compliance for citizen data, government data sovereignty

Contact: [Your Name], [Title], [Email], [Phone]

Best regards,
[Director General, NARA]
```

**Step 2: Clone Repository**
```bash
git clone https://github.com/nara/nara-backend.git
cd nara-backend
npm install
```

**Step 3: Configure Environment**
```bash
cp .env.example .env.lgc
# Edit .env.lgc with LGC database credentials
```

**Step 4: Run Migrations**
```bash
npx prisma migrate deploy
node scripts/seed-initial-data.js
```

**Step 5: Start Services**
```bash
docker-compose -f docker-compose.lgc.yml up -d
```

---

## 📞 CONTACTS & RESOURCES

### Government Agencies

**ICTA / GovTech Ltd.**
- Website: https://www.icta.lk
- Email: info@icta.lk
- Phone: +94 11 2 369 099

**Data Protection Authority**
- Website: https://www.dpa.gov.lk
- Email: dpa@dpa.gov.lk
- Phone: +94 11 2 136 136

**Lanka Government Cloud**
- Website: https://lgc.gov.lk
- Email: lgc@icta.lk
- Support: +94 11 2 369 099

### Technical Resources

**Documentation:**
- PDPA 2022: https://parliament.lk/uploads/acts/gbills/english/6242.pdf
- LGC Documentation: https://lgc.gov.lk/documentation
- ICTA Cloud Policy: https://www.icta.lk/cloud-policy

**Training:**
- GovTech Training Programs
- ICTA Capacity Building
- SLASSCOM Tech Training

---

## 🔄 MAINTENANCE & UPDATES

### Regular Tasks

**Daily:**
- Monitor system health
- Check error logs
- Review security alerts

**Weekly:**
- Database backups verification
- Performance metrics review
- Security patches

**Monthly:**
- PDPA compliance audit
- Cost analysis
- Capacity planning

**Quarterly:**
- Disaster recovery drill
- Security penetration testing
- Policy updates

---

## ⚠️ RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| LGC downtime | HIGH | LOW | Multi-region backup, failover to Firebase |
| Data breach | CRITICAL | LOW | Encryption, access control, audit logs |
| Migration data loss | HIGH | MEDIUM | Incremental migration, validation scripts |
| Budget overrun | MEDIUM | MEDIUM | Phased approach, cost monitoring |
| PDPA non-compliance | CRITICAL | LOW | Legal review, DPO oversight |
| Vendor lock-in (LGC) | MEDIUM | MEDIUM | Containerization, portable architecture |

---

## ✅ CONCLUSION & RECOMMENDATIONS

### Recommended Approach: **PHASED HYBRID MIGRATION**

1. **Phase 1 (Months 1-3):** Move sensitive data to LGC
2. **Phase 2 (Months 4-6):** Migrate core application
3. **Phase 3 (Months 7-9):** AI services integration
4. **Phase 4 (Months 10-12):** Full optimization

### Key Benefits:

- ✅ **75% cost reduction** (LKR 2.7M savings/year)
- ✅ **PDPA compliance** (avoid penalties)
- ✅ **Data sovereignty** (government control)
- ✅ **Better performance** (local hosting)
- ✅ **Future-proof** (align with gov policy)
- ✅ **Security** (government-grade infrastructure)

### Next Steps:

1. Present this plan to NARA management
2. Get approval and budget allocation
3. Contact ICTA/GovTech for LGC tenancy
4. Hire/train technical team
5. Begin Phase 1 migration

---

**Document Prepared By:** Claude Code Infrastructure Architect
**Last Updated:** October 28, 2025
**Version:** 1.0
**Status:** DRAFT - Awaiting Approval

**For Questions:** Contact NARA IT Department
