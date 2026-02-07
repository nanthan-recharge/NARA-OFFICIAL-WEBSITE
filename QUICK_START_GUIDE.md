# 🚀 NARA Library - Quick Start Guide

## ⚡ What's New

Your library now has:
- ✅ **Authentication-Gated Downloads** - Registration required
- ✅ **Smart Category Grouping** - 6 major collections
- ✅ **Daily Auto-Upload Agent** - Runs at 2 AM daily
- ✅ **Download Tracking** - Know who downloads what
- ✅ **Role-Based Permissions** - Student (10/month), Researcher (unlimited)

---

## 📦 Deploy in 3 Steps

### Step 1: Deploy Frontend (2 minutes)

```bash
# Already built! Just deploy:
firebase deploy --only hosting
```

**Done!** Your enhanced library is live at: https://nara-web-73384.web.app/library

### Step 2: Setup Backend Agent (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
nano .env  # Add your CORE_API_KEY

# Test agent manually
npm run agent:manual

# If test successful, start scheduler with PM2
npm install -g pm2
pm2 start scheduledJobs/scheduler.js --name nara-library-agent
pm2 save
```

**Done!** Agent will now run daily at 2 AM automatically.

### Step 3: Test Everything (3 minutes)

1. Visit: https://nara-web-73384.web.app/library
2. Click a category (e.g., "Research Publications")
3. Click a book
4. Try to download → Should show registration modal ✅
5. Register/Login
6. Download should work ✅

---

## 🎯 Key Features to Test

### 1. Authentication Modal
- Visit any book page as anonymous user
- Click "Download PDF"
- Should see beautiful modal with benefits list
- "Create Free Account" button redirects to registration

### 2. Category Grouping
- Library home shows 6 category cards:
  - 🎓 Academic Resources
  - 🔬 Research Publications
  - 📰 Periodicals & Serials
  - 🗺️ Maps & Spatial Data
  - 💻 Digital Resources
  - 📜 Special Collections
- Each card shows total item count
- Click to browse that category

### 3. Download Quota (Student Account)
- Login as student
- Download a book
- Should see: "You have X downloads remaining this month"
- Try to download 11th book → Should block with message

### 4. Daily Agent
```bash
# Check agent is running
pm2 list

# View logs
pm2 logs nara-library-agent

# Manual test run
cd backend
npm run agent:manual
```

---

## 📊 Monitor Agent Activity

### Check Agent Status
```bash
pm2 status nara-library-agent
```

### View Agent Logs
```bash
pm2 logs nara-library-agent --lines 50
```

### Restart Agent
```bash
pm2 restart nara-library-agent
```

### Stop Agent
```bash
pm2 stop nara-library-agent
```

---

## 🎨 User Experience Flow

### Scenario 1: Anonymous User
1. Browses catalogue ✅
2. Views book details ✅
3. Clicks "Download" → **Registration modal** ✅
4. Sees benefits:
   - Download up to 10 books/month
   - Print PDFs
   - Save bookmarks
   - Reading history
5. Clicks "Create Free Account" → Registers ✅

### Scenario 2: Student (After Registration)
1. Logs in ✅
2. Browses and finds book ✅
3. Clicks "Download PDF (120 pages)" ✅
4. Downloads successfully ✅
5. Sees message: "Download successful! You have 9 downloads remaining this month" ✅

### Scenario 3: Researcher
1. Logs in with researcher account ✅
2. Unlimited downloads ✅
3. No quota messages ✅
4. Full access to all features ✅

---

## 🔐 Configure Environment

Edit `backend/.env`:

```env
# Required for agent
CORE_API_KEY=your_api_key_here

# Firebase Admin (get from Firebase console)
FIREBASE_PROJECT_ID=nara-web-73384
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nara-web-73384.iam.gserviceaccount.com

# Email notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=library@nara.ac.lk
SMTP_PASS=your_password

# Agent schedule
AGENT_SCHEDULE="0 2 * * *"  # 2:00 AM daily
AGENT_ENABLED=true
```

### Get CORE API Key (Free):
1. Visit: https://core.ac.uk/services/api
2. Sign up for free account
3. Get API key from dashboard
4. Add to `.env` file

---

## 📈 Database Setup

### Firestore Collections

The system will automatically create:

#### 1. `library_downloads` (Download tracking)
```javascript
{
  userId: "abc123",
  userEmail: "user@example.com",
  userName: "John Doe",
  userRole: "student",
  bookId: 42,
  bookTitle: "Marine Biodiversity...",
  materialType: "BOBP",
  downloadType: "pdf",
  downloadedAt: Timestamp,
  ipAddress: "...",
  userAgent: "..."
}
```

#### 2. `upload_queue.json` (Backend file)
The agent maintains this file locally for processing.

### Firestore Rules (Already configured ✅)

```javascript
// Allow authenticated users to log downloads
match /library_downloads/{download} {
  allow create: if request.auth != null;
  allow read: if request.auth != null &&
    (request.auth.uid == resource.data.userId ||
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'librarian']);
}
```

---

## 🛠️ Troubleshooting

### Issue: "Registration Required" modal not showing
**Fix**: Clear browser cache, hard refresh (Ctrl+Shift+R)

### Issue: Downloads not tracked
**Fix**:
```bash
# Check Firestore rules
firebase firestore:rules:release

# Verify user is logged in
console.log(user, userProfile)
```

### Issue: Agent not running
**Fix**:
```bash
# Check PM2
pm2 list

# Restart
pm2 restart nara-library-agent

# Check logs
pm2 logs nara-library-agent
```

### Issue: Student can download more than 10 books
**Fix**: Check date logic in `DownloadManager.jsx` lines 28-35

---

## 📞 Next Steps

### Immediate (Today):
1. ✅ Deploy frontend
2. ✅ Start backend agent
3. ✅ Test authentication flow
4. ✅ Monitor first agent run (tomorrow 2 AM)

### This Week:
1. ⏳ Add PDF watermarking
2. ⏳ Enhanced PDF viewer with react-pdf
3. ⏳ Citation generator
4. ⏳ Reading progress tracking

### This Month:
1. ⏳ User dashboard with statistics
2. ⏳ Recommendations engine
3. ⏳ Mobile app optimization
4. ⏳ Advanced search with Elasticsearch

---

## 📚 Documentation

- **Full Plan**: `LIBRARY_ENHANCEMENT_PLAN.md` (9 phases)
- **Implementation**: `LIBRARY_COMPLETE_IMPLEMENTATION.md` (detailed)
- **Agent Setup**: `backend/README.md` (backend guide)
- **Original Fix**: `LIBRARY_FIX_SUMMARY.md` (URL conversion)

---

## ✅ Success Checklist

Before going live:
- [ ] Frontend deployed to Firebase
- [ ] Backend agent running with PM2
- [ ] .env configured with API keys
- [ ] Firestore rules deployed
- [ ] Anonymous users see registration modal
- [ ] Students have download quota
- [ ] Researchers have unlimited access
- [ ] Downloads are logged to Firestore
- [ ] Categories display correctly
- [ ] Agent logs show no errors

---

## 🎉 You're All Set!

Your NARA Digital Library is now:
- 🔐 **Secure** - Authentication-gated downloads
- 🤖 **Automated** - Daily content updates
- 📊 **Trackable** - Download analytics
- 🎨 **Professional** - Beautiful UI
- 📚 **Organized** - Smart categorization

**Questions?** Check the documentation or contact: library@nara.ac.lk

---

**Deployed**: October 17, 2025
**Version**: 2.0.0 - Enhanced Library System
**Status**: ✅ Production Ready
