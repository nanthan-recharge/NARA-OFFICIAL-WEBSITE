# 🚀 NARA Library System - Deployment Guide

## ✅ BUILD SUCCESSFUL!

The frontend has been successfully built and is ready for deployment!

**Build Location:** `/build/` directory  
**Status:** Production-ready ✅  
**Date:** October 14, 2025

---

## 📦 **DEPLOYMENT OPTIONS**

### Option 1: Firebase Hosting (Recommended for Frontend)

#### Step 1: Deploy Frontend

```bash
# Make sure you're in the project root
cd /Users/nanthan/Desktop/nara\ digital/nara_digital_ocean

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or deploy specific site if you have multiple
firebase deploy --only hosting:nara-digital-ocean
```

**Frontend will be live at:** `https://nara.gov.lk` (or your Firebase hosting URL)

---

### Option 2: DigitalOcean App Platform (Full Stack)

#### Step 1: Push Code to Git Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "NARA Library System - Production Ready"

# Add remote (GitHub, GitLab, or Bitbucket)
git remote add origin https://github.com/your-org/nara-library-system.git
git push -u origin main
```

#### Step 2: Deploy Backend to DigitalOcean

1. **Go to DigitalOcean Dashboard**
2. **Click "Create" → "Apps"**
3. **Connect your Git repository**
4. **Configure Backend Service:**
   - **Name:** `nara-library-api`
   - **Source Directory:** `/backend/library-api`
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
   - **HTTP Port:** `5000`
   - **Environment:** Node.js 18+

5. **Add Environment Variables:**
   ```
   DB_USER=your_db_user
   DB_HOST=your_managed_db_host
   DB_NAME=nara_library
   DB_PASSWORD=your_secure_password
   DB_PORT=5432
   PORT=5000
   NODE_ENV=production
   ```

6. **Create Managed PostgreSQL Database:**
   - Go to "Databases" → "Create Database"
   - Choose PostgreSQL 14+
   - Select appropriate plan
   - Note connection details

7. **Run Database Migrations:**
   ```bash
   # SSH into your app or use DigitalOcean console
   cd /backend/library-api
   npm run migrate
   ```

#### Step 3: Deploy Frontend

1. **Configure Frontend Environment:**
   - Create `.env.production` in project root:
   ```env
   VITE_LIBRARY_API_URL=https://nara-library-api.ondigitalocean.app/api
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

2. **Build and Deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 🗄️ **DATABASE SETUP**

### Step 1: Create PostgreSQL Database

**Option A: DigitalOcean Managed Database**
1. Go to DigitalOcean Dashboard
2. Click "Databases" → "Create Database"
3. Select PostgreSQL 14+
4. Choose datacenter region (closest to users)
5. Select plan (Basic $15/month recommended for start)
6. Create database named `nara_library`

**Option B: Local/VPS PostgreSQL**
```bash
# Install PostgreSQL
brew install postgresql@14  # macOS
# or
sudo apt install postgresql-14  # Ubuntu

# Create database
createdb nara_library

# Create user
createuser nara_library_user -P
```

### Step 2: Run Migrations

```bash
cd backend/library-api

# Configure .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate
```

### Step 3: Verify Database

```bash
# Connect to database
psql -U nara_library_user -d nara_library

# Check tables
\dt

# You should see 20+ tables including:
# - bibliographic_records
# - patrons
# - circulation_transactions
# - material_types (with 26 NARA types)
# - etc.
```

---

## 🔐 **FIREBASE SETUP**

### Step 1: Firebase Admin SDK

1. **Go to Firebase Console** → Your Project
2. **Project Settings** → **Service Accounts**
3. **Generate New Private Key**
4. **Download JSON file**
5. **Save as:** `backend/library-api/firebase-admin-sdk.json`

⚠️ **IMPORTANT:** Never commit this file to Git! It's already in `.gitignore`

### Step 2: Set Custom Claims for Librarians

```javascript
// Use Firebase Admin SDK or Cloud Functions
const admin = require('firebase-admin');

// Set librarian role
await admin.auth().setCustomUserClaims(uid, { 
  role: 'librarian' 
});

// Set admin role
await admin.auth().setCustomUserClaims(uid, { 
  role: 'admin' 
});
```

### Step 3: Update Firestore Rules (Optional)

If using Firestore for additional features:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Library patron profiles
    match /library_patron_profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId 
                   || request.auth.token.role in ['admin', 'librarian'];
    }
  }
}
```

---

## 🌐 **ENVIRONMENT VARIABLES**

### Backend (.env)

```env
# Database Configuration
DB_USER=nara_library_user
DB_HOST=your-db-host.db.ondigitalocean.com
DB_NAME=nara_library
DB_PASSWORD=your_secure_password_here
DB_PORT=25060

# Server Configuration
PORT=5000
NODE_ENV=production

# Firebase Admin SDK
# (Place firebase-admin-sdk.json in backend/library-api/)

# Optional: Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=library@nara.gov.lk
SMTP_PASSWORD=your_smtp_password
```

### Frontend (.env.production)

```env
# API Configuration
VITE_LIBRARY_API_URL=https://your-backend-url.com/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🔒 **SECURITY CHECKLIST**

### Before Going Live:

- [ ] **Database:** Use strong passwords (20+ characters)
- [ ] **SSL/TLS:** Enable HTTPS on all endpoints
- [ ] **Firebase:** Restrict API keys to your domain
- [ ] **CORS:** Configure CORS to allow only your domain
- [ ] **Environment Variables:** Never commit `.env` files
- [ ] **Firebase Admin SDK:** Keep `firebase-admin-sdk.json` secure
- [ ] **Database Backups:** Enable automated backups
- [ ] **Rate Limiting:** Implement on public endpoints
- [ ] **Firestore Rules:** Restrict read/write access
- [ ] **User Roles:** Verify role-based access control

---

## 📊 **POST-DEPLOYMENT CHECKLIST**

### 1. Test Backend API

```bash
# Test health endpoint
curl https://your-backend-url.com/api

# Test cataloguing endpoint
curl https://your-backend-url.com/api/catalogue

# Test search endpoint
curl https://your-backend-url.com/api/search?q=marine
```

### 2. Test Frontend Pages

Visit and verify:
- [ ] Public Catalogue: `https://nara.gov.lk/library`
- [ ] Item Details: `https://nara.gov.lk/library/item/1`
- [ ] Patron Portal: `https://nara.gov.lk/library/patron-portal`
- [ ] Admin Dashboard: `https://nara.gov.lk/admin/library`
- [ ] Cataloguing: `https://nara.gov.lk/admin/library/cataloguing`
- [ ] Circulation: `https://nara.gov.lk/admin/library/circulation`
- [ ] Patrons: `https://nara.gov.lk/admin/library/patrons`
- [ ] Acquisitions: `https://nara.gov.lk/admin/library/acquisitions`

### 3. Test Authentication

- [ ] Login as regular user
- [ ] Login as librarian
- [ ] Login as admin
- [ ] Verify role-based access control

### 4. Test Core Features

**Public Users:**
- [ ] Search catalogue
- [ ] View item details
- [ ] Place holds
- [ ] Access patron portal

**Librarians:**
- [ ] Add new items
- [ ] Check-out items
- [ ] Check-in items
- [ ] Manage patrons
- [ ] Create orders

---

## 🚀 **QUICK DEPLOYMENT COMMANDS**

### Full Deployment (All Steps)

```bash
# 1. Build Frontend
cd /Users/nanthan/Desktop/nara\ digital/nara_digital_ocean
npm run build

# 2. Deploy Frontend to Firebase
firebase deploy --only hosting

# 3. Deploy Backend (if using DigitalOcean)
# Push to Git and connect to DigitalOcean App Platform

# 4. Run Database Migrations
cd backend/library-api
npm run migrate

# 5. Verify Deployment
curl https://your-backend-url.com/api
```

---

## 📝 **MAINTENANCE**

### Regular Tasks:

**Daily:**
- Monitor error logs
- Check system performance
- Review overdue items

**Weekly:**
- Database backup verification
- Security updates check
- User feedback review

**Monthly:**
- Performance optimization
- Database cleanup
- Feature updates

### Backup Strategy:

**Database:**
```bash
# Automated daily backups (DigitalOcean Managed DB)
# Or manual backup:
pg_dump -U nara_library_user nara_library > backup_$(date +%Y%m%d).sql
```

**Code:**
- Keep Git repository up to date
- Tag releases (v1.0.0, v1.1.0, etc.)
- Maintain changelog

---

## 🆘 **TROUBLESHOOTING**

### Common Issues:

**1. Frontend can't connect to backend:**
```bash
# Check VITE_LIBRARY_API_URL in .env.production
# Verify CORS settings in backend
# Check backend is running
```

**2. Database connection error:**
```bash
# Verify DB credentials in .env
# Check database is running
# Test connection: psql -U user -d database
```

**3. Authentication not working:**
```bash
# Verify Firebase config
# Check firebase-admin-sdk.json exists
# Verify custom claims are set
```

**4. Build fails:**
```bash
# Clear node_modules and rebuild
rm -rf node_modules
npm install
npm run build
```

---

## 📞 **SUPPORT**

### Documentation:
- [Complete Implementation Report](🎊_FINAL_IMPLEMENTATION_REPORT.md)
- [API Documentation](backend/library-api/README.md)
- [System Architecture](SYSTEM_ARCHITECTURE.md)
- [Quick Start Guide](QUICK_START.md)

### Logs:
- **Backend Logs:** Check DigitalOcean App Platform logs
- **Frontend Logs:** Browser console (F12)
- **Database Logs:** PostgreSQL logs

---

## 🎉 **DEPLOYMENT COMPLETE!**

Once deployed, your NARA Library System will be:

✅ **Accessible** to public users for catalogue search  
✅ **Functional** for librarians to manage operations  
✅ **Secure** with Firebase authentication  
✅ **Scalable** with managed database  
✅ **Production-ready** for NARA library operations

**Your library system is ready to serve NARA!** 🎊

---

**Deployment Version:** 1.0.0  
**Date:** October 14, 2025  
**Status:** Production Ready ✅  
**Build:** Successful ✅




