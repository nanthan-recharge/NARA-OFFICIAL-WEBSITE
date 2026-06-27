# 🚀 Admin Panel Deployment Guide

## ✅ **What Has Been Built**

Your self-service research data admin panel is ready! Here's what you have:

### **Components Created:**
1. ✅ **ResearchAdminLogin.jsx** - Secure login page with Firebase Auth
2. ✅ **ResearchDataAdmin.jsx** - Main dashboard with tabs
3. ✅ **PublicationForm.jsx** - Add/edit publications
4. ✅ **ProjectForm.jsx** - Add/edit projects  
5. ✅ **PartnerForm.jsx** - Add/edit partners
6. ✅ **TeamForm.jsx** - Add/edit research teams
7. ✅ **useResearchAdminData.js** - Hook to fetch real-time data
8. ✅ **research-firestore.rules** - Security rules

### **Routes Added:**
- `/admin/research-login` - Admin login
- `/admin/research-data` - Admin dashboard

---

## 🔐 **Step 1: Deploy Firestore Security Rules**

### **Deploy Rules to Firebase:**

```bash
# Deploy the research data security rules
npx firebase deploy --only firestore:rules

# OR if you want to specify the file:
npx firebase deploy --only firestore --config research-firestore.rules
```

### **Manual Setup (Firebase Console):**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `nara-web-73384`
3. Click **Firestore Database** in left sidebar
4. Click **Rules** tab at top
5. Copy contents from `research-firestore.rules` file
6. Paste into the rules editor
7. Click **Publish**

---

## 👤 **Step 2: Create Admin Users**

### **Method A: Using Firebase CLI (Recommended)**

```bash
# Install Firebase Admin SDK tools
npm install -g firebase-tools

# Login to Firebase
firebase login

# Open Firebase Functions Shell
firebase functions:shell

# Set admin claim for a user (replace with real email)
admin.auth().getUserByEmail('admin@nara.gov.lk')
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log('Admin privileges granted!');
  });
```

### **Method B: Using Node.js Script**

Create a file `setup-admin.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Replace with your admin email
const adminEmail = 'admin@nara.gov.lk';

admin.auth().getUserByEmail(adminEmail)
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`✅ Admin privileges granted to ${adminEmail}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
```

Run it:
```bash
node setup-admin.js
```

### **Method C: Firebase Console (Manual)**

1. Go to Firebase Console → Authentication
2. Click on user you want to make admin
3. Note their **UID**
4. Use Firebase CLI or script above with UID instead of email

---

## 📝 **Step 3: Create First Admin Account**

### **Create User in Firebase Auth:**

```bash
# Using Firebase CLI
firebase auth:export users.json

# OR via Firebase Console:
# 1. Go to Authentication → Users
# 2. Click "Add User"
# 3. Email: admin@nara.gov.lk
# 4. Password: [Create strong password]
# 5. Click "Add User"
```

Then set admin claim using Method A or B above.

---

## 🏗️ **Step 4: Initialize Firestore Collections**

### **Create Collections (First Time Only):**

The collections will be created automatically when you add the first item, but you can also create them manually:

1. Go to Firestore Database in Firebase Console
2. Click **Start collection**
3. Create these collections:
   - `publications`
   - `projects`
   - `partners`
   - `teams`

---

## 🧪 **Step 5: Test the Admin Panel**

### **Test Login:**

1. Go to: `https://nara-web-73384.web.app/admin/research-login`
2. Login with admin credentials
3. Should redirect to `/admin/research-data`

### **Test Add Publication:**

1. Click "Publications" tab (should be active)
2. Click "Add New Publication" button
3. Fill in form:
   - **Title**: "Test Publication"
   - **Authors**: "Dr. Test Author"
   - **Journal**: "Test Journal"
   - **Year**: 2024
   - **Abstract**: "This is a test publication"
4. Click "Save Publication"
5. Should see success message
6. Item appears in list

### **Test Edit/Delete:**

1. Find the test publication in list
2. Click **Edit** icon (pencil)
3. Update title to "Updated Test Publication"
4. Click "Save"
5. Click **Delete** icon (trash)
6. Confirm deletion
7. Item should be removed

---

## 🌐 **Step 6: Build and Deploy**

```bash
# Build the updated app
npm run build

# Deploy to Firebase Hosting
npx firebase deploy --only hosting

# OR deploy everything (hosting + rules)
npx firebase deploy
```

---

## 📊 **Step 7: Verify Data Appears on Website**

### **Option A: Connect Portal to Real Data**

The portal is currently using mockup data. To connect it to real Firebase data:

1. Open `/src/pages/research-excellence-portal/EnhancedResearchPortal.jsx`
2. Import the hook:
```javascript
import { useResearchAdminData } from '../../hooks/useResearchAdminData';
```

3. Replace mockup data with real data:
```javascript
// Inside component, replace the const declarations:
const {
  publications,
  projects,
  partners,
  teams,
  metrics,
  loading,
  error
} = useResearchAdminData();

// Add loading state:
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="text-white text-center">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
        <p>Loading research data...</p>
      </div>
    </div>
  );
}

// Use the data normally - it will now be from Firebase!
```

### **Option B: Keep Mockup Data (For Now)**

Leave the portal as-is showing mockup data until you've added all real data through the admin panel.

---

## 🔒 **Security Best Practices**

### **✅ DO:**
- Use strong passwords for admin accounts
- Enable 2FA on Firebase Console
- Regularly review admin user list
- Monitor Firestore usage in Firebase Console
- Set up billing alerts

### **❌ DON'T:**
- Share admin credentials
- Use admin accounts for regular browsing
- Hardcode any credentials in code
- Give admin access to unnecessary users

---

## 📱 **Admin Panel Access**

### **Login URL:**
```
https://nara-web-73384.web.app/admin/research-login
```

### **Credentials:**
- Email: (Your admin email - set in Step 3)
- Password: (Your admin password - set in Step 3)

---

## 🎯 **Usage Instructions for NARA Staff**

### **Adding a Publication:**

1. Login to admin panel
2. Click "Publications" tab
3. Click "Add New Publication"
4. Fill required fields (marked with *)
5. Optional: Add citations, downloads, impact factor
6. Click "Save Publication"

### **Adding a Project:**

1. Click "Projects" tab
2. Click "Add New Project"
3. Fill project details
4. Set status (Active/Planning/Completing/Completed)
5. Add objectives (one per line)
6. Click "Save Project"

### **Adding a Partner:**

1. Click "Partners" tab
2. Click "Add New Partner"
3. Fill institution details
4. Add contact information
5. List collaboration types
6. Click "Save Partner"

### **Adding a Team:**

1. Click "Teams" tab
2. Click "Add New Research Team"
3. Enter team name and leader
4. Add member count and metrics
5. Describe research focus
6. Click "Save Team"

---

## 🐛 **Troubleshooting**

### **Issue: "Access Denied" when logging in**

**Solution:**
- Verify user has admin custom claim set
- Check Firestore rules are deployed
- Try logging out and back in (token refresh)

### **Issue: "Permission Denied" when adding data**

**Solution:**
- Check admin claim: `admin == true`
- Verify Firestore rules are correct
- Check Firebase Console → Firestore → Rules tab

### **Issue: Data not appearing on website**

**Solution:**
- Verify data was saved (check Firestore Database in Console)
- Check browser console for errors
- Ensure portal is connected to real data (Step 7)

### **Issue: Can't login - "User not found"**

**Solution:**
- Create user in Firebase Authentication first
- Then set admin claim
- Wait 1 minute for token to refresh

---

## 📈 **Next Steps**

### **1. Add Initial Data (1-2 weeks)**
- Add all NARA publications
- Add current research projects
- Add partner institutions
- Add research team information

### **2. Connect Portal to Real Data (1 hour)**
- Follow Step 7 Option A above
- Test that data appears correctly
- Deploy updated portal

### **3. Train Staff (1 day)**
- Walk through admin panel
- Practice adding/editing data
- Answer questions
- Document any issues

### **4. Go Live! 🎉**
- Switch from mockup to real data
- Announce to NARA community
- Monitor usage and feedback

---

## 💰 **Cost Estimate**

### **Current Usage (Free Tier):**
- Firestore: 50,000 reads/day free
- Authentication: Unlimited users
- Hosting: 10GB storage free
- **Cost: $0/month**

### **Expected Usage (Low):**
- ~1,500 publications
- ~150 projects
- ~90 partners
- ~12 teams
- ~100 admin actions/day
- **Cost: $0/month** (within free tier)

### **If You Exceed Free Tier:**
- Firestore: ~$0.06 per 100,000 reads
- Storage: ~$0.18/GB/month
- **Estimated: $10-25/month**

---

## ✅ **Completion Checklist**

- [ ] Firestore rules deployed
- [ ] Admin user created
- [ ] Admin claim set
- [ ] Test login successful
- [ ] Test add publication
- [ ] Test edit publication
- [ ] Test delete publication
- [ ] Test all 4 tabs (Publications, Projects, Partners, Teams)
- [ ] App built and deployed
- [ ] Staff trained
- [ ] Real data added
- [ ] Portal connected to real data
- [ ] Documentation shared

---

## 🆘 **Support**

**Issues or Questions?**
- Check troubleshooting section above
- Review Firebase Console logs
- Check browser console for errors
- Contact IT administrator

**Emergency Contact:**
- Firebase Support: [Firebase Console](https://console.firebase.google.com)
- Technical Lead: [Your contact info]

---

## 🎉 **Congratulations!**

Your admin panel is ready to use! NARA staff can now manage all research data themselves through an easy-to-use web interface.

**What You Can Do Now:**
1. Login to admin panel
2. Add publications, projects, partners, teams
3. Edit existing data
4. Delete outdated information
5. See changes reflected immediately on website

**No coding required!** ✨
