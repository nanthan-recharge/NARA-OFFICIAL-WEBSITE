# Manual School List Upload Guide

## Easy Method: Upload Directly via Firebase Console

### Step 1: Prepare Your Excel File

Your Excel file should have columns like:
- School Name
- Location/District
- Contact Person
- Phone
- Email
- Partner Since (Year)
- Students Count

### Step 2: Upload to Firebase Storage

1. **Open Firebase Console**:
   - Go to: https://console.firebase.google.com/project/nara-web-73384/storage

2. **Navigate to Storage**:
   - Click on "Storage" in the left menu
   - Click "Files" tab

3. **Create Folder**:
   - Click the folder icon or "Create folder"
   - Name it: `data`
   - Inside `data`, create another folder: `school_list`

4. **Upload Your File**:
   - Click "Upload file"
   - Select your `school_list.xlsx` file
   - Wait for upload to complete

5. **Get Public URL**:
   - Click on the uploaded file
   - Click "Get download URL" or copy the URL from the details panel
   - The URL will look like:
     ```
     https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/data%2Fschool_list%2Fschool_list.xlsx?alt=media&token=xxx
     ```

6. **Make It Public** (if needed):
   - Click on the file
   - Go to "Permissions" tab
   - Add permission: `allUsers` with role `Storage Object Viewer`

### Step 3: Add URL to Code

Once you have the URL, you can either:

**Option A: Add to .env file** (not tracked by git)
```bash
# Create this file: nara_digital_ocean/.env
VITE_SCHOOL_LIST_URL=https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/data%2Fschool_list%2Fschool_list.xlsx?alt=media&token=xxx
```

**Option B: Add directly to component**
I'll create a component that uses a hardcoded URL you can update.

---

## Alternative: Convert to JSON First

If you want to convert your Excel to JSON before uploading:

### Online Tools:
1. https://products.aspose.app/cells/conversion/xlsx-to-json
2. https://www.convertcsv.com/xlsx-to-json.htm

### Upload JSON:
- Upload the JSON file instead of Excel
- JSON files are smaller and faster to parse
- Follow same steps as above but upload `.json` instead of `.xlsx`

---

## What I'll Create for You:

1. ✅ **School List Service** - Already created
2. ⏳ **School List Component** - Display schools in a nice table/grid
3. ⏳ **Integration in Academy** - Show partner schools in Academy section
4. ⏳ **Admin Panel** (optional) - Upload/manage schools from web interface

Would you like me to:
- Create the display component now?
- Set it up to use a Firebase Storage URL?
- Create an admin panel to upload the file directly from the website?
