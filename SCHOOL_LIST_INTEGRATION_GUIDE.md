# School List Integration Guide

## Method 1: Firebase Storage + Frontend Parsing (Recommended)

### Step 1: Upload XLS to Firebase Storage

1. Go to Firebase Console: https://console.firebase.google.com/project/nara-web-73384/storage
2. Create a folder called `data/`
3. Upload your school list file: `school_list.xlsx`
4. Copy the download URL

### Step 2: Install Required Package

```bash
cd nara_digital_ocean
npm install xlsx --save
```

### Step 3: Create School List Service

The service will:
- Fetch the XLS file from Firebase Storage
- Parse it into JSON
- Cache it for performance

### Step 4: Use in Academy Component

The AcademyShowcase component will display the school list.

---

## Method 2: Convert to JSON & Store in Firestore

### Step 1: Convert XLS to JSON

You can use an online converter or Node.js script:

```javascript
const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('school_list.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet);

fs.writeFileSync('school_list.json', JSON.stringify(jsonData, null, 2));
```

### Step 2: Upload to Firestore

Use Firebase Admin SDK or the Firebase Console to upload the JSON data.

---

## Method 3: Direct JSON Import (Simple)

### Step 1: Convert XLS to JSON

Use the script above or an online tool.

### Step 2: Place JSON in Project

```
nara_digital_ocean/
  public/
    data/
      school_list.json
```

### Step 3: Import in Component

```javascript
import schoolList from '/data/school_list.json';
```

---

## Recommended: Method 1 (Firebase Storage)

**Advantages:**
- Easy to update (just replace file in Firebase)
- No code deployment needed for data updates
- Supports large files
- Can use real Excel files (.xlsx)

**File Structure Expected:**

| School Name | Location | Contact | Partner Since | Students |
|-------------|----------|---------|---------------|----------|
| Example School | Colombo | +94... | 2020 | 500 |

Would you like me to implement Method 1 for you? Just provide:
1. The XLS file (or I can create a sample)
2. Expected column names
3. Where you want to display the data (Academy section, new page, etc.)
