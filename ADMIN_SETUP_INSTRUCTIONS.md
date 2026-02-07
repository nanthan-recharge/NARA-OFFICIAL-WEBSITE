# 🔐 Admin Panel - Setup Credentials

## Quick Setup (5 Minutes)

### Step 1: Create Admin User

**Go to Firebase Console:**
```
https://console.firebase.google.com/project/nara-web-73384/authentication
```

**Add User:**
- Email: `admin@nara.gov.lk` (or your preferred email)
- Password: Choose a strong password (min 6 characters)
- Click **Add User**
- Copy the **User UID** (you'll need it next)

---

## Method A: Using Firebase Admin SDK (Recommended)

### 1. Install Firebase Admin Tools
```bash
npm install -g firebase-tools
firebase login
```

### 2. Create Admin Script

Save this as `setAdmin.js` in your project root:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Replace with your user's UID from Firebase Console
const uid = 'PASTE_USER_UID_HERE';

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('✅ Admin privileges granted!');
    console.log('User can now login at /admin/login');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
```

### 3. Get Service Account Key
1. Go to: https://console.firebase.google.com/project/nara-web-73384/settings/serviceaccounts
2. Click **Generate New Private Key**
3. Save as `serviceAccountKey.json` in project root
4. **IMPORTANT:** Add to `.gitignore` immediately!

### 4. Run Script
```bash
node setAdmin.js
```

---

## Method B: Using Firebase CLI (Quickest)

### 1. Install Firebase Functions
```bash
cd nara_digital_ocean
firebase init functions
# Select JavaScript
# Install dependencies
```

### 2. Create Cloud Function

Edit `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Temporary function to make first admin
exports.makeFirstAdmin = functions.https.onRequest(async (req, res) => {
  const email = req.query.email;
  
  if (!email) {
    return res.status(400).send('Email required');
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    res.send(`✅ ${email} is now an admin!`);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});
```

### 3. Deploy Function
```bash
firebase deploy --only functions
```

### 4. Call Function
Open in browser:
```
https://us-central1-nara-web-73384.cloudfunctions.net/makeFirstAdmin?email=admin@nara.gov.lk
```

---

## Method C: Manual Firestore Setup (Alternative)

### 1. Create Admin Users Collection

1. Go to Firestore: https://console.firebase.google.com/project/nara-web-73384/firestore
2. Create collection: `adminUsers`
3. Add document:
   - **Document ID:** [User's UID from Authentication]
   - **Fields:**
     ```
     email: "admin@nara.gov.lk"
     isAdmin: true
     role: "superadmin"
     createdAt: [Current timestamp]
     ```

### 2. Update AdminLogin.jsx

The admin check will need to query Firestore if you use this method.

---

## 🎯 After Setup

### Test Admin Login

1. **Go to:** https://nara-web-73384.web.app/admin/login
2. **Or locally:** http://localhost:4029/admin/login
3. **Enter:**
   - Email: `admin@nara.gov.lk`
   - Password: [Your password]
4. **Should redirect to:** `/admin/dashboard`

---

## 🔒 Recommended Admin Credentials

### Production:
```
Email: admin@nara.gov.lk
Password: [Generate strong password - at least 12 characters]
```

### Development:
```
Email: dev@nara.gov.lk
Password: [Development password]
```

---

## 🚨 Security Best Practices

### 1. Strong Password Requirements
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Use password manager

### 2. Enable 2FA (Two-Factor Authentication)
```javascript
// Firebase supports email 2FA
// Enable in Firebase Console → Authentication → Sign-in method
```

### 3. Limit Admin Access
- Only grant admin claims to trusted users
- Use role-based permissions:
  - `superadmin` - Full access
  - `admin` - Content management
  - `editor` - Content editing only
  - `moderator` - Review only

### 4. Monitor Admin Activity
- Check Firebase Console → Authentication → Users
- Review recent sign-ins
- Implement audit logs

---

## 🐛 Troubleshooting

### "Unauthorized: Admin access required"
**Problem:** User doesn't have admin custom claim

**Solution:**
1. Verify user exists in Firebase Auth
2. Run admin setup script again
3. Check Firebase Console for custom claims
4. Try logging out and back in

### "User not found"
**Problem:** Email doesn't exist in Authentication

**Solution:**
1. Go to Firebase Console → Authentication
2. Verify user was created
3. Check email spelling

### "Invalid password"
**Problem:** Wrong password

**Solution:**
1. Reset password in Firebase Console
2. Or use "Forgot Password" flow

---

## 📞 Quick Command Reference

```bash
# Create user via Firebase CLI
firebase auth:create admin@nara.gov.lk

# Test authentication
curl -X POST https://nara-web-73384.web.app/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nara.gov.lk","password":"your-password"}'
```

---

## ✅ Verification Checklist

- [ ] User created in Firebase Authentication
- [ ] Custom claim `admin: true` set
- [ ] Password is strong and secure
- [ ] Login page accessible
- [ ] Successfully logged in to dashboard
- [ ] Can access Content Manager
- [ ] Can save content changes

---

## 🎉 You're All Set!

Once setup is complete, access your admin panel at:

**Production:** https://nara-web-73384.web.app/admin/login

**Local:** http://localhost:4029/admin/login

---

*Need help? Check the console logs in your browser's DevTools for detailed error messages.*
