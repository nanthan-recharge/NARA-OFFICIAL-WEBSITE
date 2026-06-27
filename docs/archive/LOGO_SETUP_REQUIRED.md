# 🖼️ IMPORTANT: NARA Logo Setup Required

## ⚠️ **ACTION REQUIRED BEFORE PDFs WORK CORRECTLY**

The NARA logo must be placed in the correct location for PDF exports to show the official branding.

---

## 📍 **WHERE TO PLACE THE LOGO**

### **Location:**
```
/public/images/nara-logo.png
```

### **Full Path:**
```
/Users/nanthan/Desktop/NARA-NEW-BY:SNC/21-10-25 FINAL NARA MAIN /NARA-OFFICIAL-WEBSITE/nara_digital_ocean/public/images/nara-logo.png
```

---

## 📋 **STEP-BY-STEP INSTRUCTIONS**

### **Step 1: Save the Logo**
1. You have the NARA logo (circular with dolphin)
2. Save it as a PNG file
3. Name it exactly: `nara-logo.png`

### **Step 2: Place in Correct Folder**
1. Navigate to your project folder
2. Go to: `public/images/`
3. Copy `nara-logo.png` into this folder

### **Step 3: Verify**
1. Check the file is named exactly: `nara-logo.png` (lowercase, no spaces)
2. File should be PNG format
3. Recommended size: 200x200 pixels or larger
4. File size: Keep under 100KB

---

## 🖼️ **LOGO SPECIFICATIONS**

**File Details:**
- **Format:** PNG (with transparent background preferred)
- **Name:** `nara-logo.png` (exactly this name)
- **Size:** 200x200px minimum (square)
- **Aspect Ratio:** 1:1 (square)
- **File Size:** < 100KB recommended

**Logo Description:**
- Circular design
- Teal/cyan border
- Dolphin jumping over waves
- "NARA" text in blue
- Green wave pattern at bottom
- Sri Lankan text around border

---

## ✅ **VERIFICATION**

### **After Placing Logo:**

1. **Open Terminal** in project folder
2. **Run:**
   ```bash
   ls -la public/images/nara-logo.png
   ```
3. **You should see:**
   ```
   -rw-r--r--  1 user  staff  45678 Oct 28 17:43 public/images/nara-logo.png
   ```

### **Test in Browser:**
1. Go to: http://localhost:3000/images/nara-logo.png
   (if running dev server)
2. Logo should display

---

## 🎯 **WHERE THE LOGO APPEARS**

Once placed, the logo will automatically appear in:
- ✅ PDF exports (top-left corner of letterhead)
- ✅ Single result PDF reports
- ✅ Bulk PDF reports
- ✅ All official NARA documents

**Example PDF Header:**
```
┌────────────────────────────────────┐
│ [🐬 LOGO]  NARA                   │
│             National Aquatic       │
│             Resources Research     │
└────────────────────────────────────┘
```

---

## 🚨 **WHAT HAPPENS IF LOGO IS MISSING?**

- PDFs will still generate
- Header will show text but no logo
- Professional appearance reduced
- Console will show: "Logo not found, continuing without logo"

**Solution:** Place the logo file as instructed above.

---

## 🔄 **AFTER PLACING LOGO**

### **Rebuild and Deploy:**
```bash
npm run build
firebase deploy --only hosting
```

### **Test PDF Export:**
1. Go to Lab Results page
2. Click red PDF button on any result
3. PDF should download with NARA logo in header
4. Verify logo appears clearly

---

## 📁 **PROJECT STRUCTURE**

```
nara_digital_ocean/
├── public/
│   ├── images/
│   │   ├── nara-logo.png  ← PUT LOGO HERE
│   │   └── LOGO_INSTRUCTIONS.md
│   ├── index.html
│   └── ...
├── src/
├── package.json
└── ...
```

---

## 💡 **TIPS**

1. **Use Original Logo:** Use the official NARA logo (the one you provided)
2. **PNG Format:** Convert to PNG if it's in another format
3. **Transparent Background:** Preferred but not required
4. **Test First:** Test PDF export after placing logo
5. **Backup:** Keep a copy of the logo file

---

## ❓ **TROUBLESHOOTING**

### **Logo Not Showing in PDF?**

**Check 1: File Name**
- Must be exactly: `nara-logo.png`
- Case-sensitive (lowercase)
- No spaces, no typos

**Check 2: Location**
- Must be in: `/public/images/`
- Not in `/src/images/` or anywhere else

**Check 3: File Format**
- Must be PNG
- Not JPG, GIF, or other formats

**Check 4: Rebuild**
- Run: `npm run build`
- Then deploy again

**Check 5: Browser Cache**
- Clear browser cache
- Try in incognito/private mode
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 📞 **NEED HELP?**

If you're having trouble:

1. Check the file path is exactly correct
2. Verify file name is exactly `nara-logo.png`
3. Ensure it's PNG format
4. Try rebuilding and redeploying
5. Check browser console for errors

---

## ✅ **CHECKLIST**

Before deploying, confirm:

- [ ] Logo file saved as PNG
- [ ] Named exactly: `nara-logo.png`
- [ ] Placed in: `/public/images/`
- [ ] File size under 100KB
- [ ] Can view at: http://localhost:3000/images/nara-logo.png
- [ ] Ready to build and deploy

---

**Once the logo is in place, you're ready to deploy! 🚀**

See: `HOW_TO_USE_LAB_RESULTS_SYSTEM.md` for the user manual.
