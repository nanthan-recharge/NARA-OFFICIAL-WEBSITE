# 🚀 NARA Library System - Quick Start Guide

## ✅ What's Ready

- ✅ **Complete Backend API** with PostgreSQL
- ✅ **26 NARA-Specific Material Types** (Acts, BOBP Reports, Collections, etc.)
- ✅ **Frontend Service Layer** for API communication
- ✅ **Public Catalogue** with search and filters
- ✅ **Admin Dashboard** for librarians
- ✅ **Complete Documentation**

## 📦 Installation (Choose One Method)

### Method 1: Automated Setup (Recommended - 5 minutes)

```bash
cd backend/library-api
./INSTALL.sh
```

This installs PostgreSQL, creates the database, and runs migrations automatically.

### Method 2: Manual Setup (15 minutes)

```bash
# 1. Install PostgreSQL
brew install postgresql@14
brew services start postgresql@14

# 2. Create database
createdb nara_library

# 3. Install dependencies
cd backend/library-api
npm install

# 4. Configure environment
cp .env.example .env
# Edit .env with your Firebase credentials

# 5. Run migrations (creates all tables + 26 material types)
npm run migrate

# 6. Start server
npm run dev
```

## 🔑 Firebase Setup (Required)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **nara-web-73384**
3. Settings → Service Accounts → Generate New Private Key
4. Copy credentials to `backend/library-api/.env`:

```env
FIREBASE_PROJECT_ID=nara-web-73384
FIREBASE_CLIENT_EMAIL=your-email@nara-web-73384.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 🧪 Test the System

```bash
# Health check
curl http://localhost:5000/health

# Get all 26 material types
curl http://localhost:5000/api/catalogue/material-types/all

# Search catalogue
curl "http://localhost:5000/api/search?q=marine"
```

## 📚 Material Types Included

The system includes **26 NARA-specific material types**:

**Collections:**
- Acts
- Atapattu Collection
- Prof. Upali Amarasinghe Collection
- Sri Lanka Collection (Books & Reports)
- World Fisheries Collection

**Reports:**
- BOBP Reports
- FAO Reports
- IOC Reports
- IWMI Reports
- Research Reports - NARA
- e-Reports

**Books & References:**
- Lending Book
- Reference Book (non-circulating)
- Electronic Books
- Permanent Reference (non-circulating)
- Special Reference (non-circulating)

**Research Materials:**
- Research Papers
- Thesis
- Proceedings
- Journal
- e-Journal Articles

**Media & Maps:**
- CDs
- Maps
- Digital Map
- Newspaper Articles

See `backend/library-api/MATERIAL_TYPES.md` for complete details.

## 🌐 Frontend Configuration

Add to project root `.env`:
```env
VITE_LIBRARY_API_URL=http://localhost:5000/api
```

## 📖 Using the System

### Public Catalogue
1. Go to `http://localhost:3000/library` (or your dev port)
2. Search by title, author, subject, ISBN
3. Filter by any of the 26 material types
4. View item details and availability

### Admin Dashboard
1. Go to `/admin/library`
2. View statistics and quick actions
3. Manage circulation, cataloguing, patrons

### API Usage

```javascript
import { catalogueService, searchService } from './services/libraryService';

// Get all material types
const types = await catalogueService.getMaterialTypes();

// Search with filter
const results = await searchService.search('fisheries', {
  material_type: 7, // FAO Reports
  year_from: 2020
});

// Add new item
const newItem = await catalogueService.createItem({
  title: "Marine Biology Research",
  author: "Dr. Smith",
  material_type_id: 18, // Research Papers
  barcode: "NARA00000001",
  total_copies: 3
});
```

## 📊 Database Overview

After migration, you'll have:
- ✅ 20+ tables
- ✅ 26 material types
- ✅ 4 patron categories
- ✅ 4 database views for reporting
- ✅ 5 automated functions
- ✅ Full-text search enabled

## 🎯 Next Steps

1. **Set User Roles** (see `BACKEND_SETUP_INSTRUCTIONS.md`)
2. **Add Catalogue Items** via API or admin interface
3. **Create Patron Accounts**
4. **Test Circulation Workflow**
5. **Explore Reports & Analytics**

## 📚 Documentation

- **Complete Setup:** `BACKEND_SETUP_INSTRUCTIONS.md`
- **API Documentation:** `backend/library-api/README.md`
- **Material Types:** `backend/library-api/MATERIAL_TYPES.md`
- **System Status:** `LIBRARY_SYSTEM_STATUS.md`
- **Database Schema:** `backend/library-api/migrations/001_initial_schema.sql`

## 🆘 Troubleshooting

### PostgreSQL not found
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Database connection error
```bash
# Check if PostgreSQL is running
brew services list

# Restart if needed
brew services restart postgresql@14
```

### Migration fails
```bash
# Drop and recreate database
dropdb nara_library
createdb nara_library
npm run migrate
```

### Firebase auth error
- Verify credentials in `.env`
- Ensure private key has `\n` characters
- Check project ID matches: `nara-web-73384`

## ✅ Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `nara_library` created
- [ ] Migrations completed (26 material types created)
- [ ] Backend server running on port 5000
- [ ] Health endpoint returns success
- [ ] Material types API returns 26 items
- [ ] Firebase credentials configured
- [ ] Frontend `.env` configured

## 🎉 You're Ready!

Once all checks pass, you have a fully functional library system with:
- Complete backend API
- 26 specialized material types
- Search and cataloguing
- Circulation management
- Reports and analytics
- Public catalogue interface

**Start adding items and managing your library! 📚**

---

**Quick Commands:**
```bash
# Start backend
cd backend/library-api && npm run dev

# Test health
curl http://localhost:5000/health

# View material types
curl http://localhost:5000/api/catalogue/material-types/all | jq
```

