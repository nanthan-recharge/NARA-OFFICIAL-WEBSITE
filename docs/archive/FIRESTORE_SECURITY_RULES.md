# Firestore Security Rules - Library System

## Overview

Comprehensive security rules for the NARA Digital Ocean platform including the new Library User System with role-based access control.

## 📁 File Location

**New Rules File**: `firestore.rules.new`  
**Existing Rules**: `firestore.rules` (backup)

## 🚀 Deployment

### Option 1: Firebase Console (Recommended for First Time)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nara-web-73384`
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents from `firestore.rules.new`
5. Paste into the rules editor
6. Click **Publish**

### Option 2: Firebase CLI

```bash
# Make sure you're in the project directory
cd /Users/nanthan/Desktop/nara\ digital/nara_digital_ocean

# Replace old rules with new ones
mv firestore.rules firestore.rules.backup
mv firestore.rules.new firestore.rules

# Deploy to Firebase
firebase deploy --only firestore:rules

# Or deploy everything
firebase deploy
```

## 🛡️ Helper Functions

### isAuthenticated()
Checks if a user is logged in.
```javascript
function isAuthenticated() {
  return request.auth != null;
}
```

### isAdmin()
Checks if user has admin privileges (requires custom token claim).
```javascript
function isAdmin() {
  return request.auth != null && 
         request.auth.token.admin == true;
}
```

### isOwner(uid)
Checks if the authenticated user owns the resource.
```javascript
function isOwner(uid) {
  return request.auth != null && 
         request.auth.uid == uid;
}
```

### isLibrarian()
Checks if user is a librarian by looking up their admin profile.
```javascript
function isLibrarian() {
  return request.auth != null && 
         exists(/databases/$(database)/documents/adminProfiles/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/adminProfiles/$(request.auth.uid)).data.role in ['admin', 'librarian'];
}
```

### isResearcher()
Checks if user is a researcher by looking up their library profile.
```javascript
function isResearcher() {
  return request.auth != null && 
         exists(/databases/$(database)/documents/libraryUsers/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/libraryUsers/$(request.auth.uid)).data.role == 'researcher';
}
```

## 📚 Library System Collections

### libraryUsers
**Purpose**: Store user profiles for library system

**Access Rules**:
- **Read**: Users can read their own profile, admins and librarians can read all
- **Create**: Users can create their own profile during registration (validated)
- **Update**: Users can update their own profile (but not role/permissions), admins can update anything
- **Delete**: Only admins

**Key Validations**:
```javascript
// On create:
- request.resource.data.uid == request.auth.uid
- request.resource.data.email == request.auth.token.email

// On user update (prevents privilege escalation):
- request.resource.data.role == resource.data.role
- request.resource.data.permissions == resource.data.permissions
- request.resource.data.libraryCard == resource.data.libraryCard
```

**Example Document**:
```javascript
{
  uid: "abc123",
  email: "user@example.com",
  role: "researcher",
  profile: {...},
  libraryCard: {...},
  permissions: {...},
  statistics: {...}
}
```

---

### researchSubmissions
**Purpose**: Store research papers submitted by researchers

**Access Rules**:
- **Read**: 
  - Public can read approved/published submissions
  - Authors can read their own submissions (any status)
  - Admins and librarians can read all
- **Create**: Only researchers, status must be 'pending'
- **Update**: 
  - Authors can update if status is 'pending' or 'revision_requested' (cannot change status)
  - Admins and librarians can always update
- **Delete**: Only admins

**Status Flow**:
```
pending → approved → published
pending → revision_requested → pending → approved
pending → rejected
```

**Example Document**:
```javascript
{
  authorId: "abc123",
  submission: {
    title: "Marine Research Study",
    status: "pending", // pending, approved, published, revision_requested, rejected
    submittedAt: timestamp
  },
  visibility: "public" // public, institutional, private
}
```

---

### patronBorrowings
**Purpose**: Track borrowed items

**Access Rules**:
- **Read**: Users can read their own records, admins and librarians can read all
- **Write**: Only admins and librarians

**Example Document**:
```javascript
{
  userId: "abc123",
  itemId: "book_001",
  borrowedAt: timestamp,
  dueDate: timestamp,
  returnedAt: timestamp | null,
  status: "active" // active, returned, overdue
}
```

---

### userFavorites (Subcollection)
**Purpose**: User's saved/favorite items

**Path**: `userFavorites/{userId}/items/{itemId}`

**Access Rules**:
- **Read/Write**: Only the owner can access their favorites

**Example Document**:
```javascript
{
  itemId: "book_001",
  itemType: "book",
  addedAt: timestamp
}
```

---

### libraryFines
**Purpose**: Track outstanding fines

**Access Rules**:
- **Read**: Users can read their own fines, admins and librarians can read all
- **Write**: Only admins and librarians

**Example Document**:
```javascript
{
  userId: "abc123",
  amount: 50.00,
  reason: "Late return",
  issueDate: timestamp,
  paidDate: timestamp | null,
  status: "unpaid" // unpaid, paid, waived
}
```

---

### libraryHolds
**Purpose**: Book reservations/holds

**Access Rules**:
- **Read**: Users can read their own holds, admins and librarians can read all
- **Create**: Users can create holds for themselves
- **Update**: Users can update their own holds, admins and librarians can update all
- **Delete**: Users can delete their own holds, admins and librarians can delete all

**Example Document**:
```javascript
{
  userId: "abc123",
  itemId: "book_001",
  requestedAt: timestamp,
  expiresAt: timestamp,
  status: "active" // active, fulfilled, expired, cancelled
}
```

---

### userNotifications (Subcollection)
**Purpose**: User notifications

**Path**: `userNotifications/{userId}/notifications/{notificationId}`

**Access Rules**:
- **Read/Write**: Only the owner

**Example Document**:
```javascript
{
  type: "due_date_reminder",
  message: "Your book is due tomorrow",
  read: false,
  createdAt: timestamp
}
```

---

### researchComments
**Purpose**: Comments on research submissions

**Access Rules**:
- **Read**: Anyone (public)
- **Create**: Authenticated users
- **Update/Delete**: Comment author or admins

**Example Document**:
```javascript
{
  userId: "abc123",
  submissionId: "sub_001",
  comment: "Great research!",
  createdAt: timestamp
}
```

---

### userActivityLog (Subcollection)
**Purpose**: Audit trail of user activities

**Path**: `userActivityLog/{userId}/activities/{activityId}`

**Access Rules**:
- **Read**: Owner or admins
- **Write**: Only admins (typically via Cloud Functions)

**Example Document**:
```javascript
{
  action: "borrowed_book",
  itemId: "book_001",
  timestamp: timestamp,
  metadata: {...}
}
```

---

## 🔐 Security Principles

### 1. Least Privilege
Users can only access data they own unless they have admin/librarian privileges.

### 2. Data Validation
Create operations validate that:
- User is authenticated
- UID matches authenticated user
- Email matches authenticated user's email
- Initial status is appropriate

### 3. Privilege Escalation Prevention
Users cannot:
- Change their own role
- Modify their permissions
- Change library card details
- Alter statistics directly

### 4. Role Hierarchy
```
Admin (full access)
  ↓
Librarian (manage library operations)
  ↓
Researcher (submit research + borrow)
  ↓
Student (borrow)
  ↓
Public (borrow)
  ↓
Unauthenticated (read public data only)
```

---

## 🧪 Testing Security Rules

### Using Firebase Emulator (Recommended)

```bash
# Start emulators
firebase emulators:start

# In another terminal, run your tests
npm test
```

### Using Firebase Console Rules Playground

1. Go to Firebase Console → Firestore → Rules
2. Click "Rules playground" tab
3. Test different scenarios:

#### Test 1: User Reading Own Profile
```
Location: /libraryUsers/USER_ID
Type: get
Auth: Authenticated as USER_ID
Expected: Allow
```

#### Test 2: User Changing Own Role
```
Location: /libraryUsers/USER_ID
Type: update
Auth: Authenticated as USER_ID
Data: { role: "admin" }
Expected: Deny
```

#### Test 3: Researcher Creating Submission
```
Location: /researchSubmissions/NEW_ID
Type: create
Auth: Authenticated researcher
Expected: Allow
```

#### Test 4: Public Reading Approved Research
```
Location: /researchSubmissions/SUB_ID
Type: get
Auth: Unauthenticated
Expected: Allow (if status is 'approved' or 'published')
```

---

## ⚠️ Important Notes

### Admin Custom Claims

To use admin functions, you need to set custom claims:

```javascript
// In Firebase Admin SDK (Cloud Functions or Admin script)
const admin = require('firebase-admin');

await admin.auth().setCustomUserClaims(userId, { 
  admin: true 
});
```

### Librarian Setup

Create admin profiles for librarians:

```javascript
// In Firestore: adminProfiles/{userId}
{
  uid: "librarian_uid",
  role: "librarian",
  name: "John Doe",
  email: "librarian@nara.lk",
  createdAt: timestamp
}
```

### Performance Considerations

The rules use `exists()` and `get()` functions which count as document reads:
- **exists()**: 1 read per check
- **get()**: 1 read per check

Be mindful of these in high-traffic scenarios. Consider:
- Caching role information in custom claims
- Batch operations to minimize rule evaluations

---

## 🐛 Troubleshooting

### "Permission Denied" Errors

**Symptom**: Users getting "Missing or insufficient permissions"

**Solutions**:
1. Check user is authenticated: `auth != null`
2. Verify user profile exists in `libraryUsers` collection
3. Ensure user has correct role
4. Check admin custom claims are set (for admin functions)
5. Verify `adminProfiles` exists (for librarian functions)

### Rules Not Updating

**Solutions**:
1. Wait 30-60 seconds after deployment
2. Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
3. Clear Firestore cache
4. Check Firebase Console for deployment errors

### Testing Issues

**Solutions**:
1. Use Firebase Emulator for local testing
2. Check Rules Playground in Firebase Console
3. Enable Firestore debug logging in your app
4. Check browser console for detailed error messages

---

## 📊 Monitoring

### Firebase Console

Monitor rule denials:
1. Go to Firebase Console
2. Navigate to Firestore → Usage tab
3. Check "Security rules denials" metric

### Enable Logging

In your app:
```javascript
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Enable persistence and logging
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open
    } else if (err.code == 'unimplemented') {
      // Browser doesn't support
    }
  });
```

---

## 🔄 Migration from Old Rules

If you have existing data, these rules are backward compatible with your current collections:

✅ **Safe to Deploy**:
- All existing collections keep their rules
- New library collections added without affecting existing data
- Helper functions enhance but don't break existing functionality

⚠️ **Action Required After Deployment**:
1. Set admin custom claims for admin users
2. Create `adminProfiles` for librarians
3. Test library user registration flow
4. Verify existing collections still work

---

## 📝 Best Practices

### 1. Always Validate on Create
```javascript
allow create: if request.resource.data.userId == request.auth.uid;
```

### 2. Prevent Privilege Escalation
```javascript
allow update: if request.resource.data.role == resource.data.role;
```

### 3. Use Subcollections for User Data
```javascript
match /userFavorites/{userId}/items/{itemId}
```

### 4. Separate Public and Private Data
```javascript
allow read: if resource.data.visibility == 'public';
```

### 5. Log Important Actions
Use Cloud Functions to log sensitive operations to `admin_logs` collection.

---

## 🚦 Deployment Checklist

- [ ] Backup existing rules (`firestore.rules` → `firestore.rules.backup`)
- [ ] Review new rules in `firestore.rules.new`
- [ ] Test rules in Firebase Console Rules Playground
- [ ] Deploy rules: `firebase deploy --only firestore:rules`
- [ ] Test registration flow
- [ ] Test login and dashboard access
- [ ] Set admin custom claims for admin users
- [ ] Create admin profiles for librarians
- [ ] Verify existing features still work
- [ ] Monitor for permission denied errors
- [ ] Document any custom claims setup needed

---

## 📚 Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Testing](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**Last Updated**: October 16, 2025  
**Compatible With**: Firebase SDK v12.4.0+  
**Library System Version**: 1.0.0
