# 🔧 Library API Backend - Quick Setup Guide

## ⚠️ Current Status

The backend API needs Firebase credentials to run. Follow these steps to set it up.

---

## 🚀 Quick Setup (2 Options)

### Option 1: Without Authentication (For Testing)

Make the backend work without Firebase auth for now:

1. **Modify `middleware/auth.js`** to skip Firebase init for testing
2. **Or use mock mode** (see below)

### Option 2: With Firebase Authentication (Production)

Set up proper Firebase credentials:

1. **Get Firebase Service Account**
2. **Configure `.env` file**
3. **Restart backend**

---

## 📝 Option 1: Testing Without Auth

### Quick Fix - Disable Auth Temporarily

Edit `/backend/library-api/middleware/auth.js`:

```javascript
// Comment out or wrap Firebase init in try-catch
let admin;
try {
  const adminModule = require('firebase-admin');
  if (!adminModule.apps.length) {
    adminModule.initializeApp({
      credential: adminModule.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'test-project',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'test@test.com',
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || 'test-key',
      }),
    });
  }
  admin = adminModule;
} catch (error) {
  console.warn('Firebase Admin not initialized:', error.message);
  console.warn('Running in mock mode - authentication disabled');
}

// Make verifyToken optional for testing
const verifyToken = async (req, res, next) => {
  if (!admin) {
    // Mock user for testing
    req.user = {
      uid: 'test-user',
      email: 'test@nara.ac.lk',
      name: 'Test User',
      emailVerified: true,
      customClaims: { admin: true }
    };
    return next();
  }
  
  // Original auth code here...
};
```

---

## 🔐 Option 2: Setup Firebase (Recommended)

### Step 1: Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/project/nara-web-73384/settings/serviceaccounts/adminsdk)

2. Click "Generate New Private Key"

3. Download the JSON file

4. Open the JSON file - it looks like:
```json
{
  "type": "service_account",
  "project_id": "nara-web-73384",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@nara-web-73384.iam.gserviceaccount.com",
  ...
}
```

### Step 2: Update `.env` File

Edit `/backend/library-api/.env`:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=nara_library
DB_PASSWORD=your_password
DB_PORT=5432

# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration (from service account JSON)
FIREBASE_PROJECT_ID=nara-web-73384
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nara-web-73384.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY_HERE\n-----END PRIVATE KEY-----\n"

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:4028,http://localhost:3000,http://localhost:5173,https://nara-web-73384.web.app

# Logging
LOG_LEVEL=info
```

**Important:** 
- Copy the ENTIRE `private_key` from the JSON
- Keep the quotes around it
- Keep the `\n` characters (they represent line breaks)

### Step 3: Setup Database

```bash
# Create PostgreSQL database
createdb nara_library

# Or if you need to drop and recreate:
dropdb nara_library
createdb nara_library

# Run migrations
cd backend/library-api
npm run migrate
```

### Step 4: Start Backend

```bash
cd backend/library-api
npm run dev
```

You should see:
```
✓ Server running on port 5000
✓ Database connected
✓ Firebase initialized
```

---

## 🗄️ Database Setup

### Install PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### Create Database

```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE nara_library;

# Create user (optional)
CREATE USER nara_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nara_library TO nara_admin;

# Exit
\q
```

### Run Migrations

```bash
cd backend/library-api
npm run migrate
```

This creates:
- 20+ tables for library operations
- Material types table with all 26 categories
- Indexes for performance
- Sample data (optional)

---

## ✅ Verify Backend is Working

### Test API Endpoints

```bash
# Test health check
curl http://localhost:5000/api/health

# Test catalogue endpoint (should return empty array or data)
curl http://localhost:5000/api/catalogue

# Test material types
curl http://localhost:5000/api/material-types

# Test search
curl http://localhost:5000/api/search?q=marine
```

### Expected Responses

**Health Check:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-15T..."
}
```

**Catalogue:**
```json
{
  "success": true,
  "data": [],
  "pagination": {...}
}
```

---

## 🔧 Troubleshooting

### Error: "Service account object must contain project_id"

**Solution:** Update `.env` with correct Firebase credentials (see Step 2 above)

### Error: "Database connection failed"

**Solutions:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify database exists: `psql -l | grep nara_library`
3. Check `.env` database credentials
4. Try: `createdb nara_library`

### Error: "Port 5000 already in use"

**Solutions:**
1. Kill process: `lsof -ti:5000 | xargs kill`
2. Or change port in `.env`: `PORT=5001`

### Error: "Cannot find module"

**Solution:** 
```bash
cd backend/library-api
npm install
```

---

## 📦 Required npm Packages

The backend needs these packages (already in `package.json`):

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "firebase-admin": "^11.11.0",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

If any are missing:
```bash
cd backend/library-api
npm install
```

---

## 🌐 Environment Variables Reference

```env
# Database
DB_USER=postgres           # PostgreSQL user
DB_HOST=localhost          # Database host
DB_NAME=nara_library       # Database name
DB_PASSWORD=password       # Database password
DB_PORT=5432              # PostgreSQL port

# Server
PORT=5000                 # API server port
NODE_ENV=development      # Environment (development/production)

# Firebase (get from service account JSON)
FIREBASE_PROJECT_ID=nara-web-73384
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@nara-web-73384.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# CORS (allowed origins)
ALLOWED_ORIGINS=http://localhost:4028,https://nara-web-73384.web.app

# Logging
LOG_LEVEL=info            # Log level (info/debug/error)
```

---

## 🚀 Quick Commands

```bash
# Install dependencies
cd backend/library-api && npm install

# Setup database
createdb nara_library

# Run migrations
npm run migrate

# Start development server
npm run dev

# Start production server
npm start

# Run specific migration
node migrations/run-migrations.js

# Check logs
tail -f logs/api.log  # if logging to file
```

---

## 📊 Database Schema

The migrations create these tables:

1. **material_types** - 26 NARA material types
2. **catalogue** - Bibliographic records
3. **patrons** - Library users
4. **circulation** - Loans and returns
5. **holds** - Reserved items
6. **fines** - Overdue fines
7. **acquisitions** - Orders and suppliers
8. **serials** - Journals and subscriptions
9. **audit_log** - Activity tracking
10. **settings** - System configuration

---

## 🎯 Next Steps

1. ✅ Setup PostgreSQL database
2. ✅ Configure `.env` file
3. ✅ Run migrations
4. ✅ Get Firebase service account
5. ✅ Start backend server
6. ✅ Test API endpoints
7. ✅ Add library data via admin panel

---

## 📞 Support

### Common Issues

**Can't connect to database:**
- Check PostgreSQL is running
- Verify database exists
- Check credentials in `.env`

**Firebase auth errors:**
- Use Option 1 (mock mode) for testing
- Or setup proper credentials (Option 2)

**Port conflicts:**
- Change PORT in `.env`
- Kill existing process on port

---

## 🎉 Success!

Once setup, you'll have:
- ✅ Working API on http://localhost:5000
- ✅ 50+ RESTful endpoints
- ✅ 26 material types configured
- ✅ PostgreSQL database ready
- ✅ Firebase authentication (if configured)
- ✅ Ready to accept requests from frontend

**API Documentation:** See `README.md` in backend/library-api folder

---

**Status**: Setup Required  
**Difficulty**: Medium  
**Time**: 10-15 minutes

