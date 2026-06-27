# 🚀 NARA Digital Ocean - Complete Deployment Checklist

## 📋 Pre-Deployment Verification

### 1. Code Verification ✅
- [x] All library system components created
- [x] Routes configured
- [x] Providers setup correctly
- [x] Security rules prepared

### 2. Firebase Configuration ⚠️
- [ ] Firestore security rules ready (`firestore.rules.new`)
- [ ] Storage security rules updated (`storage.rules`)
- [ ] Authentication methods enabled
- [ ] Firebase project: `nara-web-73384`

### 3. Environment Check
```bash
# Check Node version (should be 14+)
node --version

# Check npm version
npm --version

# Check Firebase CLI
firebase --version
```

---

## 🔥 Firebase Deployment Steps

### Step 1: Install Dependencies

```bash
cd "/Users/nanthan/Desktop/nara digital/nara_digital_ocean"

# Install any missing packages
npm install

# Verify installation
npm list --depth=0
```

### Step 2: Deploy Firestore Security Rules

```bash
# IMPORTANT: Backup current rules first
cp firestore.rules firestore.rules.backup.$(date +%Y%m%d)

# Use the new library system rules
cp firestore.rules.new firestore.rules

# Deploy to Firebase
firebase deploy --only firestore:rules

# Expected output:
# ✔ firestore: released rules firestore.rules to cloud.firestore
```

**Verify**: Go to [Firebase Console](https://console.firebase.google.com/project/nara-web-73384/firestore/rules)

### Step 3: Deploy Storage Security Rules

```bash
# Deploy storage rules (already updated)
firebase deploy --only storage

# Expected output:
# ✔ storage: released rules storage.rules
```

**Verify**: Go to [Firebase Console](https://console.firebase.google.com/project/nara-web-73384/storage/rules)

### Step 4: Enable Authentication Methods

**Manual step in Firebase Console**:

1. Go to: https://console.firebase.google.com/project/nara-web-73384/authentication/providers
2. Enable **Email/Password**:
   - Click on Email/Password
   - Toggle ON
   - Save
3. Enable **Google**:
   - Click on Google
   - Toggle ON
   - Configure OAuth consent screen
   - Add authorized domains:
     - `localhost` (for dev)
     - Your production domain
   - Save

---

## 🏗️ Build & Deploy Application

### Step 5: Test Build Locally

```bash
# Create production build
npm run build

# Expected output:
# ✓ built in XXXXms
# dist/ folder created

# Test the build locally (optional)
npm run preview
# Open http://localhost:4173
```

### Step 6: Deploy to Netlify

**Option A: Automatic (via Git)**
```bash
# Commit all changes
git add .
git commit -m "Add library research submission system"
git push origin main

# Netlify will auto-deploy
```

**Option B: Manual Deployment**
```bash
# Deploy via Netlify CLI
netlify deploy --prod

# Or drag-drop the dist/ folder to Netlify dashboard
```

**Option C: Using npm script**
```bash
# If you have a deploy script configured
npm run deploy
```

---

## ✅ Post-Deployment Verification

### 1. Test Authentication

**Register**:
- [ ] Visit `/library-register` on production
- [ ] Test researcher registration
- [ ] Test student registration
- [ ] Test public registration
- [ ] Verify email verification sent
- [ ] Check Firestore: `libraryUsers` collection has new user

**Login**:
- [ ] Visit `/library-login`
- [ ] Test email/password login
- [ ] Test Google OAuth login
- [ ] Verify redirect to dashboard

### 2. Test Research Submission

**As Researcher**:
- [ ] Login as researcher
- [ ] Navigate to `/library-research-submit`
- [ ] Complete Step 1: Basic Info
- [ ] Complete Step 2: Upload document (test PDF)
- [ ] Complete Step 3: Authors
- [ ] Complete Step 4: Review & Submit
- [ ] Verify success redirect
- [ ] Check Firestore: `researchSubmissions` collection
- [ ] Check Storage: `research/{userId}/` has files

### 3. Test Admin Review

**As Admin**:
- [ ] Login as admin/librarian
- [ ] Navigate to `/admin/library/research-review`
- [ ] See submission list
- [ ] Filter by status
- [ ] Click "Review" on a submission
- [ ] Change status
- [ ] Add comments
- [ ] Submit review
- [ ] Verify update in Firestore

### 4. Test Protected Routes

- [ ] Try accessing `/library-dashboard` without login → redirects to login
- [ ] Try accessing `/library-research-submit` as non-researcher → access denied
- [ ] Try accessing `/admin/library/research-review` as non-admin → access denied

### 5. Test Firestore Rules

**In Firebase Console → Firestore → Rules Playground**:

```javascript
// Test 1: User reading own profile
Simulation type: get
Location: libraryUsers/YOUR_USER_ID
Auth: Authenticated as YOUR_USER_ID
Expected: Allow ✓

// Test 2: User reading another's profile
Simulation type: get
Location: libraryUsers/ANOTHER_USER_ID
Auth: Authenticated as YOUR_USER_ID
Expected: Deny ✗

// Test 3: Researcher creating submission
Simulation type: create
Location: researchSubmissions/new_submission_id
Auth: Authenticated as researcher_user_id
Data: { authorId: "researcher_user_id", submission: { status: "pending" } }
Expected: Allow ✓

// Test 4: Admin reading submission
Simulation type: get
Location: researchSubmissions/submission_id
Auth: Authenticated as admin_user_id
Expected: Allow ✓
```

### 6. Test Storage Rules

**In Firebase Console → Storage → Rules Playground**:

```javascript
// Test 1: User uploading their research
Operation: write
Path: /research/USER_ID/document.pdf
Auth: Authenticated as USER_ID
Expected: Allow ✓

// Test 2: User reading authenticated research
Operation: read
Path: /research/OTHER_USER_ID/document.pdf
Auth: Authenticated
Expected: Allow ✓

// Test 3: Unauthenticated read
Operation: read
Path: /research/USER_ID/document.pdf
Auth: None
Expected: Deny ✗
```

---

## 🐛 Troubleshooting

### Issue: "Permission Denied" on Firestore

**Check**:
```bash
# Verify rules are deployed
firebase firestore:rules:get

# Should show your latest rules
```

**Solution**:
```bash
# Re-deploy rules
firebase deploy --only firestore:rules --force
```

### Issue: File Upload Fails

**Check**:
1. Storage rules deployed?
   ```bash
   firebase deploy --only storage
   ```
2. File size < 50MB?
3. File type allowed (PDF, Word)?
4. User authenticated?

**Solution**:
- Check browser console for specific error
- Verify storage rules in Firebase Console
- Test with smaller file first

### Issue: Build Fails

**Common causes**:
- Missing dependencies
- TypeScript/ESLint errors
- Import path issues

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run build 2>&1 | tee build-errors.log

# Fix any import errors shown
```

### Issue: Routes Not Working After Deploy

**Check**:
- Netlify redirects configured?
- Check `netlify.toml` or `_redirects` file

**Solution**:
Create/update `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Issue: Environment Variables

**If using environment variables**:
```bash
# Set in Netlify Dashboard
# Site Settings → Build & Deploy → Environment Variables

VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... other variables
```

---

## 📊 Monitoring After Deployment

### Daily Checks

1. **Firebase Console**:
   - Authentication → Check new user signups
   - Firestore → Monitor submissions count
   - Storage → Check usage
   - Check for denied requests (indicates rule issues)

2. **Netlify Dashboard**:
   - Check deploy logs
   - Monitor site performance
   - Check for build errors

3. **Application**:
   - Test key user flows
   - Check browser console for errors
   - Monitor user feedback

### Weekly Checks

- Review Firestore usage (read/write counts)
- Check Storage usage and costs
- Review user growth metrics
- Check for security rule denials
- Update documentation if needed

---

## 🔐 Security Best Practices Post-Deployment

### 1. Enable App Check (Recommended)

```bash
# In Firebase Console
# Project Settings → App Check
# Register your web app
# Add reCAPTCHA or other provider
```

### 2. Set Budget Alerts

```bash
# Firebase Console → Usage and Billing
# Set alerts at:
# - 50% of quota
# - 80% of quota
# - 100% of quota
```

### 3. Monitor Failed Authentications

```bash
# Firebase Console → Authentication → Users
# Review suspicious activity
# Enable email enumeration protection
```

### 4. Regular Backups

```bash
# Backup Firestore (set up scheduled exports)
gcloud firestore export gs://nara-web-73384-backups/$(date +%Y%m%d)

# Or use Firebase Console:
# Firestore → Import/Export
```

### 5. Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update safely
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

---

## 📝 Deployment Command Summary

### Complete Deployment Flow

```bash
# 1. Install dependencies
npm install

# 2. Backup current rules
cp firestore.rules firestore.rules.backup.$(date +%Y%m%d)

# 3. Use new rules
cp firestore.rules.new firestore.rules

# 4. Deploy Firestore rules
firebase deploy --only firestore:rules

# 5. Deploy Storage rules
firebase deploy --only storage

# 6. Build application
npm run build

# 7. Deploy to Netlify (choose one):
# Option A: Via Git (automatic)
git add . && git commit -m "Deploy library system" && git push

# Option B: Via Netlify CLI
netlify deploy --prod

# Option C: Manual
# Drag-drop dist/ folder to Netlify dashboard
```

### Quick Re-deploy (Code Changes Only)

```bash
# If only code changed (no rule changes needed)
npm run build
netlify deploy --prod
```

### Quick Rule Update (No Code Changes)

```bash
# If only rules changed
firebase deploy --only firestore:rules
firebase deploy --only storage
```

---

## ✅ Success Criteria

Your deployment is successful when:

### Code Deployment
- [x] Build completes without errors
- [x] Site loads on production URL
- [x] No console errors in production
- [x] All routes accessible

### Firebase Deployment
- [x] Firestore rules deployed
- [x] Storage rules deployed
- [x] Auth methods enabled
- [x] No rule denial errors

### Functionality
- [x] User registration works
- [x] User login works (email & Google)
- [x] Dashboard loads correctly
- [x] Research submission works end-to-end
- [x] Admin review works
- [x] File uploads succeed
- [x] Protected routes work

### Security
- [x] Unauthenticated users redirected
- [x] Role-based access working
- [x] Firestore rules enforce permissions
- [x] Storage rules enforce permissions
- [x] No data leaks

---

## 🎉 Deployment Complete Checklist

- [ ] Dependencies installed
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Authentication methods enabled
- [ ] Application built successfully
- [ ] Application deployed to Netlify
- [ ] Production URL accessible
- [ ] Registration tested
- [ ] Login tested (email + Google)
- [ ] Dashboard tested
- [ ] Research submission tested
- [ ] Admin review tested
- [ ] Protected routes tested
- [ ] Firestore rules tested
- [ ] Storage rules tested
- [ ] No console errors
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Budget alerts set
- [ ] Documentation updated
- [ ] Team notified

---

## 📞 Support & Resources

### Documentation
- [LIBRARY_AUTH_SYSTEM_SUMMARY.md](./LIBRARY_AUTH_SYSTEM_SUMMARY.md)
- [LIBRARY_RESEARCH_SUBMISSION.md](./LIBRARY_RESEARCH_SUBMISSION.md)
- [ADMIN_RESEARCH_REVIEW.md](./ADMIN_RESEARCH_REVIEW.md)
- [FIRESTORE_SECURITY_RULES.md](./FIRESTORE_SECURITY_RULES.md)

### External Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)

### Firebase Console Links
- [Project Overview](https://console.firebase.google.com/project/nara-web-73384/overview)
- [Authentication](https://console.firebase.google.com/project/nara-web-73384/authentication/users)
- [Firestore](https://console.firebase.google.com/project/nara-web-73384/firestore)
- [Storage](https://console.firebase.google.com/project/nara-web-73384/storage)
- [Rules](https://console.firebase.google.com/project/nara-web-73384/firestore/rules)

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Version**: 1.0.0  
**Status**: 🚀 READY FOR DEPLOYMENT
