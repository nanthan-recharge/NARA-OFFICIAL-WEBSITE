# 🚀 NARA Library System - Backend Setup Instructions

## ✅ What's Already Done

- ✅ Backend code is complete (100%)
- ✅ Database schema is ready
- ✅ All API endpoints are implemented
- ✅ Authentication middleware is configured
- ✅ Dependencies are installed

## 📋 What You Need to Do

### Option 1: Automated Installation (Recommended - 5 minutes)

Run the installation script:

```bash
cd backend/library-api
./INSTALL.sh
```

This will:
1. Install PostgreSQL via Homebrew
2. Start PostgreSQL service
3. Create the database
4. Run migrations
5. Set up your environment

### Option 2: Manual Installation (15 minutes)

#### Step 1: Install PostgreSQL

```bash
# Install PostgreSQL 14
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Verify installation
psql --version
```

#### Step 2: Create Database

```bash
# Create the database
createdb nara_library

# Verify database was created
psql -l | grep nara_library
```

#### Step 3: Configure Environment

```bash
cd backend/library-api

# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**Required configurations in .env:**

```env
# Database (update password if needed)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nara_library
DB_USER=postgres
DB_PASSWORD=postgres

# Firebase Admin SDK (IMPORTANT!)
FIREBASE_PROJECT_ID=nara-web-73384
FIREBASE_CLIENT_EMAIL=your-service-account@nara-web-73384.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
```

#### Step 4: Get Firebase Admin Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **nara-web-73384**
3. Click **Settings** (gear icon) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Copy values to `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters!)

#### Step 5: Run Database Migrations

```bash
npm run migrate
```

You should see:
```
✅ Migration completed successfully!
📊 Created tables:
   - patron_categories
   - patrons
   - material_types
   - bibliographic_records
   ... (and more)
```

#### Step 6: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║   NARA Library API Server                  ║
╚════════════════════════════════════════════╝

🚀 Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000
💚 Health check: http://localhost:5000/health
```

#### Step 7: Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/health

# Get material types
curl http://localhost:5000/api/catalogue/material-types/all

# Search (should return empty array initially)
curl "http://localhost:5000/api/search?q=test"
```

## 🎯 Quick Verification Checklist

- [ ] PostgreSQL is installed and running
- [ ] Database `nara_library` exists
- [ ] `.env` file is configured with Firebase credentials
- [ ] Migrations ran successfully (20+ tables created)
- [ ] Server starts without errors
- [ ] Health check endpoint returns success
- [ ] API endpoints are accessible

## 🔧 Troubleshooting

### Problem: PostgreSQL won't install

**Solution:**
```bash
# Update Homebrew first
brew update
brew upgrade

# Try installing again
brew install postgresql@14
```

### Problem: Can't create database

**Error:** `createdb: error: connection to server on socket failed`

**Solution:**
```bash
# Start PostgreSQL
brew services start postgresql@14

# Wait 10 seconds
sleep 10

# Try again
createdb nara_library
```

### Problem: Migration fails

**Error:** `ECONNREFUSED` or `Connection refused`

**Solution:**
```bash
# Check PostgreSQL status
brew services list

# If not running, start it
brew services start postgresql@14

# Check if database exists
psql -l

# If database doesn't exist, create it
createdb nara_library
```

### Problem: Firebase authentication errors

**Error:** `Invalid Firebase credentials`

**Solution:**
1. Double-check `.env` file has correct Firebase values
2. Ensure `FIREBASE_PRIVATE_KEY` includes `\n` characters
3. Make sure there are no extra spaces in the values
4. Verify project ID matches: `nara-web-73384`

### Problem: Port 5000 already in use

**Solution:**
```bash
# Option 1: Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Option 2: Change port in .env
echo "PORT=5001" >> .env
```

## 🌐 Frontend Connection

Once backend is running, configure frontend:

### 1. Create/Update Frontend .env

```bash
cd ../../  # Go back to project root

# Create .env file
echo "VITE_LIBRARY_API_URL=http://localhost:5000/api" > .env
```

### 2. Start Frontend

```bash
npm start
# or
npm run dev
```

### 3. Test Integration

1. Go to `http://localhost:3000/library` (or your dev port)
2. Try searching the catalogue
3. Check browser console for any API errors

## 📊 Initial Data Setup

### Create Patron Categories

The migrations already create 4 default categories:
- Researcher (10 items, 30 days)
- Student (5 items, 14 days)
- Staff (7 items, 21 days)
- Public (3 items, 14 days)

### Add Material Types

Already created:
- Book
- Journal
- Research Paper
- Map
- Digital Media
- Reference
- Thesis
- Report

### Set User Roles

To give users library access, you need to set Firebase custom claims.

**Option 1: Using Firebase Console**
1. Go to Firebase Console → Authentication
2. Find the user
3. Set custom claims (requires Firebase Admin SDK or extension)

**Option 2: Using Node.js Script**

Create `backend/library-api/scripts/setUserRole.js`:
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setLibrarianRole(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, {
    librarian: true,
    permissions: ['manage_circulation', 'manage_cataloguing']
  });
  console.log(`✅ Set librarian role for ${email}`);
}

// Usage
setLibrarianRole('librarian@nara.gov.lk');
```

## 🚀 Production Deployment

### Using DigitalOcean

1. **Create PostgreSQL Database**
   - DigitalOcean → Databases → Create
   - Choose PostgreSQL 14
   - Note connection details

2. **Deploy Backend**
   - DigitalOcean → App Platform → Create App
   - Connect GitHub repository
   - Select `backend/library-api` directory
   - Add environment variables from `.env`
   - Deploy

3. **Run Migrations**
   ```bash
   # In DigitalOcean console or SSH
   npm run migrate
   ```

4. **Update Frontend**
   ```bash
   # Update .env with production API URL
   VITE_LIBRARY_API_URL=https://your-api.ondigitalocean.app/api
   
   # Rebuild and deploy
   npm run build
   firebase deploy --only hosting
   ```

## 📞 Need Help?

- **Backend Documentation:** `backend/library-api/README.md`
- **Setup Guide:** `backend/library-api/SETUP_GUIDE.md`
- **Database Schema:** `backend/library-api/migrations/001_initial_schema.sql`
- **API Endpoints:** See README for complete list

## ✅ Success!

If you've completed all steps:
- ✅ Backend is running on `http://localhost:5000`
- ✅ Database has 20+ tables
- ✅ API endpoints are accessible
- ✅ Frontend can connect to backend

**You're ready to start using the NARA Library System! 🎉**

Next steps:
1. Add some catalogue items via API or admin interface
2. Create patron accounts
3. Test the circulation workflow
4. Explore the reports and analytics

---

**Quick Command Reference:**

```bash
# Start backend
cd backend/library-api && npm run dev

# Check health
curl http://localhost:5000/health

# View logs
# (logs appear in terminal where server is running)

# Stop server
# Press Ctrl+C in terminal
```

