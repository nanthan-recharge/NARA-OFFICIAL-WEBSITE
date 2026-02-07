# NARA Act PDF Upload Instructions

## 📁 Location
Upload NARA Act PDF files to:
```
public/documents/
```

## 📝 Required PDF Files

### **NARA Act 1981 (3 languages):**
- `nara-act-1981-en.pdf` - English version
- `nara-act-1981-si.pdf` - Sinhala version  
- `nara-act-1981-ta.pdf` - Tamil version

### **NARA Amendment Act 1996 (3 languages):**
- `nara-amendment-1996-en.pdf` - English version
- `nara-amendment-1996-si.pdf` - Sinhala version
- `nara-amendment-1996-ta.pdf` - Tamil version

### **NARA Enactment - Complete Framework (3 languages):**
- `nara-enactment-en.pdf` - English version
- `nara-enactment-si.pdf` - Sinhala version
- `nara-enactment-ta.pdf` - Tamil version

## ✅ Total Files Needed: 9 PDFs

## 🚀 How to Upload

### **Option 1: Copy from your files**
```bash
cd public/documents/
# Copy your NARA Act PDFs here and rename them to match the names above
cp ~/Downloads/NARA-Act-English.pdf nara-act-1981-en.pdf
cp ~/Downloads/NARA-Act-Sinhala.pdf nara-act-1981-si.pdf
# etc...
```

### **Option 2: If you don't have Sinhala/Tamil versions**
If you only have English versions, you can:
1. Just upload the English PDFs
2. Copy the English version as placeholder for other languages:

```bash
cd public/documents/
# Use English as placeholder for missing translations
cp nara-act-1981-en.pdf nara-act-1981-si.pdf
cp nara-act-1981-en.pdf nara-act-1981-ta.pdf

cp nara-amendment-1996-en.pdf nara-amendment-1996-si.pdf
cp nara-amendment-1996-en.pdf nara-amendment-1996-ta.pdf

cp nara-enactment-en.pdf nara-enactment-si.pdf
cp nara-enactment-en.pdf nara-enactment-ta.pdf
```

## 🔗 Access URLs

After uploading, PDFs will be accessible at:
- `http://localhost:4028/documents/nara-act-1981-en.pdf`
- `http://localhost:4028/documents/nara-act-1981-si.pdf`
- etc.

## ✅ Verification

To check which files exist:
```bash
ls -lh public/documents/*.pdf
```

You should see all 9 PDF files with reasonable file sizes (not just 65 bytes).

---

**Current Status:**
- ❌ nara-act-1981-en.pdf (placeholder only - 65 bytes)
- ❌ All other PDFs missing

**Upload the actual PDF files to enable downloads!**
