# 🚀 Library System Deployment Guide

Complete deployment checklist for the NARA Library Authentication System.

## 📋 Pre-Deployment Checklist

- [ ] All code files are in place
- [ ] Dependencies installed (`npm install`)
- [ ] Firebase project configured (`nara-web-73384`)
- [ ] Environment variables set (if any)
- [ ] Local testing completed

## 🔥 Firebase Setup

### Step 1: Enable Authentication Methods

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **nara-web-73384**
3. Navigate to **Authentication** → **Sign-in method**
4. Enable:
   - ✅ **Email/Password**
   - ✅ **Google** (configure OAuth consent screen)
5. Add authorized domains for production

### Step 2: Deploy Firestore Security Rules

**Option A: Firebase Console** (Recommended for first deployment)

1. Open `firestore.rules.new` in your editor
2. Copy entire contents
3. Go to Firebase Console → **Firestore Database** → **Rules** tab
4. Paste the rules
5. Click **Publish**
6. Wait for confirmation

**Option B: Firebase CLI**

```bash
cd "/Users/nanthan/Desktop/nara digital/nara_digital_ocean"

# Backup existing rules
mv firestore.rules firestore.rules.backup

# Use new rules
mv firestore.rules.new firestore.rules

# Deploy
firebase deploy --only firestore:rules
```

### Step 3: Set Up Admin Users (Optional)

If you need admin access, set custom claims via Firebase Admin SDK:

```javascript
// Run this in Firebase Functions or admin script
const admin = require('firebase-admin');
admin.initializeApp();

// Set admin claim
await admin.auth().setCustomUserClaims('USER_UID_HERE', { 
  admin: true 
});

console.log('Admin claim set successfully');
```

### Step 4: Create Librarian Profiles (Optional)

If you need librarian access:

1. Go to Firebase Console → Firestore
2. Create collection: `adminProfiles`
3. Add document with librarian's UID:

```javascript
{
  uid: "librarian_uid",
  role: "librarian",
  name: "Librarian Name",
  email: "librarian@nara.lk",
  createdAt: [current timestamp]
}
```

## 🌐 Application Deployment

### Development

```bash
# Start dev server
npm start

# App will run on http://localhost:3000
```

### Production (Netlify)

**Automatic Deployment** (if connected to GitHub):
```bash
git add .
git commit -m "Add library authentication system"
git push origin main
```

**Manual Deployment**:
```bash
# Build production bundle
npm run build

# Deploy to Netlify (if CLI installed)
netlify deploy --prod
```

Or drag-and-drop the `build` folder to Netlify dashboard.

## ✅ Post-Deployment Verification

### 1. Test Authentication Flow

**Registration**:
- [ ] Visit `/library-register`
- [ ] Select a role (researcher, student, public)
- [ ] Complete registration form
- [ ] Submit and verify redirect to dashboard
- [ ] Check Firestore for new user document in `libraryUsers` collection
- [ ] Verify email verification sent

**Login**:
- [ ] Visit `/library-login`
- [ ] Login with created account
- [ ] Verify redirect to dashboard
- [ ] Check dashboard loads user profile

**Google OAuth**:
- [ ] Try Google sign-in on registration
- [ ] Try Google sign-in on login
- [ ] Verify profile created in Firestore

### 2. Test Dashboard

- [ ] Overview tab displays correctly
- [ ] Statistics show (all zeros initially)
- [ ] Library card number displays
- [ ] Profile editing works
- [ ] Save profile updates to Firestore
- [ ] Role badge shows correct role
- [ ] Quick actions display (researcher sees "Submit Research")
- [ ] Sign out redirects to login

### 3. Test Security

**Protected Routes**:
- [ ] Try accessing `/library-dashboard` while logged out (should redirect to login)
- [ ] Try accessing dashboard while logged in (should work)

**Firestore Rules**:
- [ ] User can read their own profile
- [ ] User cannot read another user's profile
- [ ] User cannot change their own role
- [ ] Profile updates save correctly

**Test in Firebase Console → Firestore → Rules Playground**:

```
Simulation type: get
Location: libraryUsers/YOUR_USER_ID
Auth: Authenticated as YOUR_USER_ID
Expected: Allow ✓

Simulation type: get
Location: libraryUsers/ANOTHER_USER_ID
Auth: Authenticated as YOUR_USER_ID
Expected: Deny ✗
```

### 4. Monitor for Errors

**Firebase Console**:
- [ ] Check Authentication → Users (users should appear)
- [ ] Check Firestore → Data (libraryUsers should exist)
- [ ] Check Firestore → Usage (no excessive reads)

**Browser Console**:
- [ ] No authentication errors
- [ ] No Firestore permission errors
- [ ] No missing import errors

**Application**:
- [ ] No broken images/icons
- [ ] All pages load correctly
- [ ] Navigation works

## 🔧 Troubleshooting

### Issue: "Permission Denied" on Firestore

**Check**:
1. Firestore rules deployed correctly
2. User authenticated (check with `user` in console)
3. User profile exists in Firestore
4. Document path is correct

**Solution**:
```bash
# Re-deploy rules
firebase deploy --only firestore:rules
```

### Issue: Registration Not Creating Profile

**Check**:
1. Browser console for errors
2. Network tab for failed requests
3. Firestore rules allow create

**Solution**:
- Verify `LibraryUserContext` is wrapping app
- Check Firebase config is correct
- Ensure email matches authenticated user

### Issue: Google Sign-In Not Working

**Check**:
1. Google OAuth enabled in Firebase Console
2. Authorized domains configured
3. OAuth consent screen configured

**Solution**:
- Add your domain to authorized domains
- Configure OAuth consent screen
- Check browser allows popups

### Issue: Dashboard Not Loading

**Check**:
1. User authenticated
2. UserProfile loaded
3. ProtectedRoute wrapping component

**Solution**:
- Check browser console
- Verify LibraryUserProvider in Routes.jsx
- Check network tab for Firestore errors

## 📊 Monitoring

### Daily Checks

- [ ] Check Firebase Console → Authentication for new signups
- [ ] Monitor Firestore → Usage for quota limits
- [ ] Check errors in Firebase Console → Crashlytics (if enabled)

### Weekly Checks

- [ ] Review user growth
- [ ] Check for security rule denials
- [ ] Verify email verification rates
- [ ] Monitor active users

## 🔐 Security Best Practices

### Production Recommendations

1. **Enable App Check** (prevents abuse):
   ```bash
   # In Firebase Console
   Authentication → App Check → Register your app
   ```

2. **Set up Budget Alerts**:
   - Firebase Console → Usage and Billing
   - Set budget alerts for Firestore reads/writes

3. **Monitor Failed Logins**:
   - Enable suspicious activity detection
   - Review failed authentication attempts

4. **Regular Backups**:
   ```bash
   # Backup Firestore
   gcloud firestore export gs://YOUR_BUCKET/backups
   ```

5. **Keep Dependencies Updated**:
   ```bash
   npm audit
   npm update
   ```

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| `LIBRARY_AUTH_SYSTEM_SUMMARY.md` | Complete system overview |
| `LIBRARY_REGISTRATION_SETUP.md` | Setup and API reference |
| `LIBRARY_SECURITY_COMPONENTS.md` | ProtectedRoute & RoleGuard guide |
| `FIRESTORE_SECURITY_RULES.md` | Detailed security rules documentation |
| `DEPLOYMENT_GUIDE_LIBRARY.md` | This deployment guide |

## 🎯 Success Criteria

Your library system is successfully deployed when:

✅ Users can register with email/password  
✅ Users can register with Google OAuth  
✅ Users can login successfully  
✅ Dashboard displays user information  
✅ Profile editing works  
✅ Firestore security rules prevent unauthorized access  
✅ No console errors in production  
✅ All routes load correctly  
✅ Role-based features show/hide appropriately  

## 🆘 Getting Help

### Common Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

### Check These First

1. Browser console for errors
2. Network tab for failed requests
3. Firebase Console for rule denials
4. Firestore data structure

### Debug Mode

Enable detailed logging:
```javascript
// In src/lib/firebase.js
import { setLogLevel } from 'firebase/firestore';
setLogLevel('debug');
```

---

## 🎉 Deployment Complete!

Once all checks pass, your NARA Library Authentication System is live and ready for users!

**Next Steps**:
1. Announce to users
2. Monitor signups
3. Gather feedback
4. Plan enhancements (forgot password, admin panel, etc.)

---

**Deployed by**: [Your Name]  
**Deployment Date**: [Date]  
**Version**: 1.0.0  
**Firebase Project**: nara-web-73384
