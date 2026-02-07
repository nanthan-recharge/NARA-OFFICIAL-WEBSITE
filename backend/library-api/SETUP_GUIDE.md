# NARA Library API - Quick Setup Guide

## Prerequisites Installation

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Alternative - Use Docker:**
```bash
docker run --name nara-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14
```

**Alternative - Use DigitalOcean Managed Database:**
- Create a PostgreSQL database on DigitalOcean
- Get connection details and update .env file

### 2. Verify PostgreSQL is Running

```bash
psql --version
# Should show: psql (PostgreSQL) 14.x
```

## Database Setup

### Step 1: Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE nara_library;

# Exit psql
\q
```

**Or using command line:**
```bash
createdb nara_library
```

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and update:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nara_library
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Firebase Admin SDK
# Get these from Firebase Console > Project Settings > Service Accounts
FIREBASE_PROJECT_ID=nara-web-73384
FIREBASE_CLIENT_EMAIL=your-service-account@nara-web-73384.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key\n-----END PRIVATE KEY-----\n"
```

### Step 3: Run Database Migrations

```bash
npm run migrate
```

This will create all tables, views, functions, and seed initial data.

### Step 4: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:5000`

### Step 5: Test the API

Open your browser or use curl:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "success": true,
  "message": "NARA Library API is running",
  "timestamp": "2025-10-14T...",
  "environment": "development"
}
```

## Quick Start with Docker (Easiest Option)

If you want to skip PostgreSQL installation:

### 1. Start PostgreSQL with Docker

```bash
docker run --name nara-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nara_library \
  -p 5432:5432 \
  -d postgres:14
```

### 2. Wait for PostgreSQL to start (10 seconds)

```bash
sleep 10
```

### 3. Run migrations

```bash
npm run migrate
```

### 4. Start the server

```bash
npm run dev
```

## Firebase Admin SDK Setup

### Get Firebase Credentials:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `nara-web-73384`
3. Go to **Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file

### Extract credentials from JSON:

```javascript
{
  "project_id": "nara-web-73384",
  "client_email": "firebase-adminsdk-xxxxx@nara-web-73384.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

Copy these values to your `.env` file.

## Setting User Roles

To give users library access, set custom claims:

```javascript
// Using Firebase Admin SDK or Firebase Console
const admin = require('firebase-admin');

// Make user a librarian
await admin.auth().setCustomUserClaims(userId, {
  librarian: true,
  permissions: ['manage_circulation', 'manage_cataloguing']
});

// Make user a library admin
await admin.auth().setCustomUserClaims(userId, {
  library_admin: true,
  permissions: ['manage_library']
});

// Make user a full admin
await admin.auth().setCustomUserClaims(userId, {
  admin: true
});
```

## Troubleshooting

### PostgreSQL Connection Error

**Error:** `ECONNREFUSED` or `Connection refused`

**Solution:**
```bash
# Check if PostgreSQL is running
brew services list  # macOS
# or
docker ps  # Docker

# Start PostgreSQL
brew services start postgresql@14  # macOS
# or
docker start nara-postgres  # Docker
```

### Migration Fails

**Error:** `relation "xxx" already exists`

**Solution:**
```bash
# Drop and recreate database
dropdb nara_library
createdb nara_library
npm run migrate
```

### Firebase Authentication Error

**Error:** `Invalid token` or `Authentication failed`

**Solution:**
1. Verify Firebase credentials in `.env`
2. Ensure private key has `\n` for newlines
3. Check project ID matches your Firebase project

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Change PORT in .env file
PORT=5001

# Or kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

## Testing the API

### Using curl:

```bash
# Health check
curl http://localhost:5000/health

# Get all material types (public endpoint)
curl http://localhost:5000/api/catalogue/material-types/all

# Search catalogue (public endpoint)
curl "http://localhost:5000/api/search?q=marine"
```

### Using a REST client:

1. Install [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
2. Or use [Postman](https://www.postman.com/)
3. Import the API endpoints from the documentation

### Test with Authentication:

```bash
# Get Firebase ID token from your app
# Then use it in Authorization header

curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  http://localhost:5000/api/patrons
```

## Next Steps

1. ✅ Backend is running
2. Configure frontend to connect to API
3. Set up Firebase custom claims for users
4. Start adding catalogue items
5. Test circulation workflow

## Production Deployment

### Deploy to DigitalOcean:

1. **Create PostgreSQL Database:**
   - Go to DigitalOcean > Databases
   - Create PostgreSQL 14 cluster
   - Note connection details

2. **Deploy Backend:**
   - Use DigitalOcean App Platform
   - Connect your Git repository
   - Set environment variables
   - Deploy

3. **Run Migrations:**
   ```bash
   # SSH into your app or use DigitalOcean console
   npm run migrate
   ```

4. **Update Frontend:**
   - Set `VITE_LIBRARY_API_URL` to your production API URL
   - Rebuild and deploy frontend

## Support

- Backend API Documentation: See `README.md`
- Database Schema: See `migrations/001_initial_schema.sql`
- API Endpoints: See `README.md` for complete list

---

**Quick Command Reference:**

```bash
# Install dependencies
npm install

# Run migrations
npm run migrate

# Start development server
npm run dev

# Start production server
npm start

# Check health
curl http://localhost:5000/health
```

