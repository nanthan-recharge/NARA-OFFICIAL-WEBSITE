# 🚀 Quick Deployment Guide - NARA Library System

## Option 1: One-Command Deployment (Recommended)

```bash
./deploy-library-system.sh
```

This automated script will:
1. ✅ Install dependencies
2. ✅ Deploy Firestore security rules
3. ✅ Deploy Storage security rules
4. ✅ Build the frontend
5. ✅ Deploy to your hosting provider

---

## Option 2: Manual Step-by-Step

### Prerequisites
```bash
# Check you have these installed:
node --version  # Should be 14+
npm --version
firebase --version

# Login to Firebase if needed:
firebase login
```

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Deploy Firestore Rules
```bash
# Backup current rules
cp firestore.rules firestore.rules.backup

# Use new library system rules
cp firestore.rules.new firestore.rules

# Deploy
firebase deploy --only firestore:rules
```

### Step 3: Deploy Storage Rules
```bash
firebase deploy --only storage
```

### Step 4: Build Frontend
```bash
npm run build
```

### Step 5: Deploy
```bash
# For Netlify:
netlify deploy --prod

# OR for Firebase Hosting:
firebase deploy --only hosting

# OR Manual:
# Upload the 'dist' folder to Netlify dashboard
```

---

## ⚠️ Post-Deployment: Enable Authentication

**CRITICAL**: After deployment, you MUST enable authentication methods:

1. Go to [Firebase Console → Authentication](https://console.firebase.google.com/project/nara-web-73384/authentication/providers)

2. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle ON
   - Save

3. Enable **Google OAuth**:
   - Click "Google"
   - Toggle ON
   - Configure OAuth consent screen
   - Add authorized domains
   - Save

---

## ✅ Verify Deployment

### Test the Flow:

```
1. Visit your site: https://your-site.netlify.app

2. Register:
   https://your-site.netlify.app/library-register
   - Test researcher registration
   - Check email verification

3. Login:
   https://your-site.netlify.app/library-login
   - Test email/password login
   - Test Google OAuth

4. Submit Research (as researcher):
   https://your-site.netlify.app/library-research-submit
   - Complete 4-step wizard
   - Upload a test PDF
   - Submit

5. Review Submission (as admin):
   https://your-site.netlify.app/admin/library/research-review
   - View submissions
   - Change status
   - Add comments
```

### Check Firebase Console:

- **Firestore**: Should see `libraryUsers` and `researchSubmissions` collections
- **Storage**: Should see `research/` folder with uploaded files
- **Authentication**: Should see new users registered

---

## 🐛 Common Issues

### "Permission Denied" Error

**Solution**:
```bash
# Re-deploy rules
firebase deploy --only firestore:rules --force
firebase deploy --only storage --force
```

### Build Fails

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routes Not Working

**Solution**: Add to `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📊 Monitor Your Deployment

After deployment, monitor:

1. **Firebase Console**:
   - [Authentication](https://console.firebase.google.com/project/nara-web-73384/authentication/users) - Check user signups
   - [Firestore](https://console.firebase.google.com/project/nara-web-73384/firestore) - Monitor data
   - [Storage](https://console.firebase.google.com/project/nara-web-73384/storage) - Check uploads

2. **Your Site**:
   - Test all user flows
   - Check browser console for errors
   - Monitor user feedback

---

## 📚 Full Documentation

For detailed information, see:

- `DEPLOYMENT_CHECKLIST.md` - Complete verification steps
- `LIBRARY_RESEARCH_SUBMISSION.md` - Feature guide
- `ADMIN_RESEARCH_REVIEW.md` - Admin interface guide
- `FIRESTORE_SECURITY_RULES.md` - Security rules documentation

---

## 🆘 Need Help?

**Quick Checks**:
1. Are you logged in to Firebase? → `firebase login`
2. Are you in the project directory? → Check for `package.json`
3. Is Firebase CLI installed? → `npm install -g firebase-tools`
4. Are rules deployed? → Check Firebase Console
5. Is authentication enabled? → Check Firebase Console → Authentication

**Debug Commands**:
```bash
# Check Firebase project
firebase projects:list

# Check current rules
firebase firestore:rules:get

# View logs
firebase deploy --only firestore:rules --debug
```

---

## ✨ Success!

Once deployed and verified, your NARA Library Research Submission System is live! 🎉

Users can:
- ✅ Register and login
- ✅ Submit research papers
- ✅ Track submission status
- ✅ (Admins) Review and approve submissions

---

**Quick Deploy**: `./deploy-library-system.sh`  
**Project**: nara-web-73384  
**Version**: 1.0.0
