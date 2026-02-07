# Maritime Services - Quick Demo Data Setup

## 🚀 Option 1: Quick Firebase Console Setup (5 minutes)

### **Step 1: Go to Firebase Console**
```
https://console.firebase.google.com/project/nara-web-73384/firestore/data
```

### **Step 2: Add Demo Vessels**

**Create Collection:** `maritime_vessels`

**Add Document 1:** ID: `NARA-001`
```json
{
  "id": "NARA-001",
  "name": {
    "en": "RV Ocean Explorer",
    "si": "සාගර ගවේෂකයා",
    "ta": "கடல் ஆராய்ச்சி"
  },
  "type": "research_vessel",
  "status": "active",
  "speed": 12.5,
  "heading": 45,
  "position": {
    "lat": 6.9271,
    "lon": 79.8612
  },
  "crew": 24,
  "mission": {
    "en": "Deep Sea Survey",
    "si": "ගැඹුරු මුහුදු සමීක්ෂණය",
    "ta": "ஆழ் கடல் ஆய்வு"
  }
}
```

**Add Document 2:** ID: `FISH-245`
```json
{
  "id": "FISH-245",
  "name": {
    "en": "MV Blue Horizon",
    "si": "නිල් ක්ෂිතිජය",
    "ta": "நீல அடிவானம்"
  },
  "type": "fishing_vessel",
  "status": "in_port",
  "speed": 0,
  "heading": 180,
  "position": {
    "lat": 7.2906,
    "lon": 79.8428
  },
  "crew": 12,
  "mission": {
    "en": "Maintenance",
    "si": "නඩත්තුව",
    "ta": "பராமரிப்பு"
  }
}
```

**Add Document 3:** ID: `CARGO-789`
```json
{
  "id": "CARGO-789",
  "name": {
    "en": "MV Sri Lanka Pride",
    "si": "ශ්‍රී ලංකා ආඩම්බරය",
    "ta": "இலங்கை பெருமை"
  },
  "type": "cargo",
  "status": "active",
  "speed": 8.2,
  "heading": 270,
  "position": {
    "lat": 6.9419,
    "lon": 79.8433
  },
  "crew": 35,
  "mission": {
    "en": "Export Transit",
    "si": "අපනයන ප්‍රවාහනය",
    "ta": "ஏற்றுமதி போக்குவரத்து"
  }
}
```

---

### **Step 3: Add Demo Ports**

**Create Collection:** `maritime_ports`

**Add Document 1:** ID: `LKCMB`
```json
{
  "id": "LKCMB",
  "name": {
    "en": "Colombo Port",
    "si": "කොළඹ වරාය",
    "ta": "கொழும்பு துறைமுகம்"
  },
  "code": "LKCMB",
  "vessels": 47,
  "capacity": 85,
  "weather": {
    "condition": "clear",
    "temp": 28,
    "wind": 12
  },
  "status": "operational"
}
```

**Add Document 2:** ID: `LKHAM`
```json
{
  "id": "LKHAM",
  "name": {
    "en": "Hambantota Port",
    "si": "හම්බන්තොට වරාය",
    "ta": "ஹம்பாந்தோட்டை துறைமுகம்"
  },
  "code": "LKHAM",
  "vessels": 12,
  "capacity": 45,
  "weather": {
    "condition": "cloudy",
    "temp": 29,
    "wind": 15
  },
  "status": "operational"
}
```

**Add Document 3:** ID: `LKGAL`
```json
{
  "id": "LKGAL",
  "name": {
    "en": "Galle Port",
    "si": "ගාල්ල වරාය",
    "ta": "காலி துறைமுகம்"
  },
  "code": "LKGAL",
  "vessels": 8,
  "capacity": 62,
  "weather": {
    "condition": "light_rain",
    "temp": 27,
    "wind": 18
  },
  "status": "operational"
}
```

---

### **Step 4: Add Demo Service (via Admin Panel)**

**Go to:**
```
https://nara-web-73384.web.app/admin/maritime
```

1. Click **Services** tab
2. Click **"Add Service"** button
3. Fill form:
   - **Title (English):** Vessel Safety Inspection
   - **Description:** Comprehensive safety inspection
   - **Category:** inspection
   - **Price:** 15000
4. Click **"Create Service"**

---

### **Step 5: Add Demo Alert (via Admin Panel)**

**In Admin Panel:**
1. Click **Alerts** tab
2. Click **"Create Alert"** button
3. Fill form:
   - **Title:** Strong Wind Warning
   - **Description:** Strong winds expected in southern waters
   - **Severity:** high
   - **Type:** weather
4. Click **"Create Alert"**

---

## ✅ **Verify Setup**

### **Check Public Page:**
```
https://nara-web-73384.web.app/maritime-services-hub
```

**You should see:**
- ✅ **Vessel Tracking tab:** 3 vessels displayed
- ✅ **Port Information tab:** 3 ports displayed
- ✅ **Weather tab:** Weather zones showing
- ✅ **Alerts tab:** 1 alert displayed (if added)

---

## 🎯 **Quick Test Checklist:**

1. **Vessel Tracking:**
   - [ ] Shows 3 vessel cards
   - [ ] Each shows name, type, speed, heading
   - [ ] Status badges visible (active/in_port)

2. **Port Information:**
   - [ ] Shows 3 port cards
   - [ ] Displays vessel count
   - [ ] Shows capacity percentage
   - [ ] Weather info visible

3. **Weather & Navigation:**
   - [ ] Shows 3 coastal zones
   - [ ] Temperature displayed
   - [ ] Wind speed shown
   - [ ] Wave height visible

4. **Safety Alerts:**
   - [ ] Alert appears if added
   - [ ] Shows severity badge
   - [ ] Displays description

---

## 🔧 **Admin Panel Features:**

### **Access Admin:**
```
https://nara-web-73384.web.app/admin/maritime
```

### **What You Can Do:**
- ✅ **Overview Tab:** Stats dashboard
- ✅ **Vessels Tab:** View all vessels
- ✅ **Ports Tab:** View all ports
- ✅ **Services Tab:** Add/Edit/Delete services
- ✅ **Alerts Tab:** Create/Manage alerts

---

## 📊 **Data Structure Summary:**

### **Collections:**
```
maritime_vessels/       ← Vessel tracking data
maritime_ports/         ← Port information
maritime_services/      ← Available services
maritime_alerts/        ← Active alerts
maritime_permits/       ← User permit applications
maritime_bookings/      ← Service bookings
```

### **Public Access:**
- ✅ Vessels - Public read
- ✅ Ports - Public read
- ✅ Services - Public read
- ✅ Alerts - Public read

### **Admin Only:**
- ✅ Create/Edit/Delete all above
- ✅ Manage permits
- ✅ Review bookings

---

## 🚀 **Next Steps:**

### **1. Add More Vessels:**
Go to Firebase Console → `maritime_vessels` → Add document

### **2. Add More Services:**
Admin Panel → Services → Add Service

### **3. Update Weather:**
Admin Panel → Weather tab → Update conditions

### **4. Create Alerts:**
Admin Panel → Alerts → Create Alert

---

## 🎨 **Content Guidelines:**

### **Vessel Names:**
- Use nautical prefixes: RV (Research Vessel), MV (Motor Vessel)
- Include trilingual names (EN/SI/TA)
- Use realistic Sri Lankan names

### **Port Information:**
- Use actual port codes (LKCMB, LKHAM, etc.)
- Keep capacity realistic (40-90%)
- Update weather regularly

### **Service Pricing:**
- Use LKR currency
- Realistic prices:
  - Inspections: 10,000 - 20,000 LKR
  - Permits: 3,000 - 8,000 LKR
  - Training: 5,000 - 15,000 LKR
  - Emergency: Free

### **Alert Severity:**
- **low:** Advisory notices
- **medium:** Cautions
- **high:** Warnings
- **critical:** Emergencies

---

## 💡 **Pro Tips:**

1. **Use Admin Panel for Services & Alerts**
   - Easier form interface
   - Automatic trilingual structure
   - Built-in validation

2. **Use Firebase Console for Vessels & Ports**
   - Bulk data entry
   - Direct JSON paste
   - Faster setup

3. **Regular Updates:**
   - Update vessel positions weekly
   - Refresh weather daily
   - Clear old alerts monthly

---

## 🆘 **Troubleshooting:**

### **Page Shows "No data":**
- ✅ Check Firebase Rules are deployed
- ✅ Verify collections exist in Firestore
- ✅ Confirm documents have correct IDs
- ✅ Hard refresh browser (Cmd+Shift+R)

### **Admin Panel Empty:**
- ✅ Check you're logged in as admin
- ✅ Verify admin token set
- ✅ Check browser console for errors

### **Translations Not Showing:**
- ✅ Ensure trilingual structure in data
- ✅ Check i18n.js includes 'maritime'
- ✅ Verify translation files exist

---

## 📞 **Support:**

**Documentation:**
- Full setup: `/MARITIME_SERVICES_SETUP.md`
- Demo data script: `/MARITIME_DEMO_DATA_SETUP.js`

**Live URLs:**
- Public: `https://nara-web-73384.web.app/maritime-services-hub`
- Admin: `https://nara-web-73384.web.app/admin/maritime`
- Firebase: `https://console.firebase.google.com/project/nara-web-73384`

---

**Total Setup Time:** ~10 minutes
**Result:** Fully functional Maritime Services Hub with demo data! 🎊
