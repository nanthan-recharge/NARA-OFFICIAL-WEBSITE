# RTI Form PDF Upload Instructions

## 📁 Where to Put PDF Files

Upload all RTI form PDF files to this folder:
```
public/documents/rti/
```

## 📝 File Naming Convention

Name your PDF files exactly as shown below (case-sensitive):

### **Primary Forms:**
- `RTI-01.pdf` - Information Application Form
- `RTI-10.pdf` - Appeal to Designated Officer

### **Administrative Forms:**
- `RTI-02.pdf` - Acknowledgement
- `RTI-03.pdf` - Register of Information Requests
- `RTI-04.pdf` - Decision to Provide Information
- `RTI-05.pdf` - Rejection of Information Request
- `RTI-06.pdf` - Extension of Time
- `RTI-07.pdf` - Communication to Third Party
- `RTI-08.pdf` - Acceptance of Appeal
- `RTI-09.pdf` - Register of Appeals
- `RTI-11.pdf` - Register of Rejection
- `RTI-12.pdf` - Information Officers Details

## ✅ File Checklist

After uploading, you should have these files:

- [ ] RTI-01.pdf
- [ ] RTI-02.pdf
- [ ] RTI-03.pdf
- [ ] RTI-04.pdf
- [ ] RTI-05.pdf
- [ ] RTI-06.pdf
- [ ] RTI-07.pdf
- [ ] RTI-08.pdf
- [ ] RTI-09.pdf
- [ ] RTI-10.pdf
- [ ] RTI-11.pdf
- [ ] RTI-12.pdf

## 🚀 How to Upload

### **Option 1: Copy from Downloads**
```bash
# If you have all PDFs in Downloads/RTI FORMS/
cp "/Users/nanthan/Downloads/RTI FORMS/"*.pdf public/documents/rti/
```

### **Option 2: Drag & Drop**
1. Open this folder in Finder
2. Drag and drop PDF files from your Downloads
3. Rename them according to the naming convention above

### **Option 3: Terminal**
```bash
cd public/documents/rti/
# Copy each file and rename it
cp ~/Downloads/your-form.pdf RTI-01.pdf
```

## 📊 Website Integration

Once uploaded, each form will have **TWO buttons**:

1. **🖊️ Fill Online** - Opens interactive web form
2. **📥 Download** - Downloads the PDF file

Example:
```
┌─────────────────────────────────────────┐
│ RTI-01 - Information Application Form  │
│                                         │
│ [ 🖊️ Fill Online ] [ 📥 ]              │
└─────────────────────────────────────────┘
```

## 🔗 Access URLs

After uploading, PDFs will be accessible at:
- `http://localhost:4028/documents/rti/RTI-01.pdf`
- `http://localhost:4028/documents/rti/RTI-02.pdf`
- etc.

## ⚠️ Important Notes

1. **Exact naming required** - Use `RTI-01.pdf` not `rti-01.pdf` or `RTI_01.pdf`
2. **PDF format only** - Do not upload DOC, DOCX, or other formats
3. **File size** - Keep PDFs under 5MB for fast loading
4. **Quality** - Use high-resolution scans (300 DPI minimum)

## ✅ Verification

To check if files are uploaded correctly:

```bash
ls -lh public/documents/rti/
```

You should see all 12 PDF files listed.

---

**Need Help?**
Contact the development team if you encounter any issues!
