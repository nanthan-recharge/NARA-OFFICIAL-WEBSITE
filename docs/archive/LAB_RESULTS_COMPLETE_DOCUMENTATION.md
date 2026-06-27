# 📚 NARA Lab Results Portal - Complete Documentation

**Version:** 2.0  
**Last Updated:** October 28, 2025  
**Status:** ✅ Production Ready

---

## 📖 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Features](#features)
3. [User Guide](#user-guide)
4. [Admin Guide](#admin-guide)
5. [Technical Documentation](#technical-documentation)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## 🎯 **OVERVIEW**

The NARA Lab Results Portal is a comprehensive web application for managing laboratory test results, samples, and analytics for the National Aquatic Resources Research & Development Agency.

### **Key Capabilities:**
- ✅ View and manage lab results
- ✅ Track sample status in real-time
- ✅ Advanced filtering and search
- ✅ Professional PDF & Excel exports
- ✅ QR code verification
- ✅ Interactive data visualization
- ✅ Multi-language support (English, Sinhala, Tamil)

### **Live URL:**
🌐 https://nara-web-73384.web.app/lab-results

---

## ⭐ **FEATURES**

### **1. Advanced Filtering System** 🔍

**What it does:**  
Powerful search and filter capabilities to find specific lab results quickly.

**Features:**
- **Date Range Picker:** Filter results between specific dates
- **Multi-Select Status:** Select multiple statuses (Pending, Completed, etc.)
- **Multi-Select Test Types:** Filter by multiple test categories
- **Multi-Select Sample Types:** Filter by sample categories
- **Advanced Sorting:** 4 sort options (Newest, Oldest, Status, Type)
- **Collapsible Panel:** Saves screen space when not in use
- **Active Filter Badges:** Shows count of active filters

**How to Use:**
1. Go to Lab Results tab
2. Scroll to "Advanced Filters" section
3. Click to expand the filter panel
4. Select your filters:
   - Choose date range (From/To)
   - Select one or more statuses
   - Pick test types
   - Choose sample types
   - Select sort order
5. Click "Apply Filters"
6. Results update automatically

**Clearing Filters:**
- Click "Clear All" button
- Or click "Clear Filters" in the filter panel

---

### **2. Bulk Operations** ☑️

**What it does:**  
Select multiple results and perform batch operations.

**Features:**
- **Individual Selection:** Click checkbox on each result
- **Select All:** One-click to select all filtered results
- **Floating Toolbar:** Appears when items are selected
- **Visual Feedback:** Selected items highlighted in blue
- **Batch Export:** Export multiple results at once
- **Batch PDF Download:** Download all selected as PDF

**How to Use:**
1. Navigate to Lab Results tab
2. Check the checkbox next to results you want
3. OR click "Select all results" at the top
4. Floating toolbar appears at bottom of screen
5. Choose action:
   - **Export Excel:** Creates Excel file with all selected
   - **Download PDF:** Creates combined PDF report
   - **Clear:** Deselect all items

**Tips:**
- Selected count shows in toolbar (e.g., "5 selected")
- Blue border indicates selected items
- Click checkbox again to deselect

---

### **3. Excel Export** 📊

**What it does:**  
Export lab results to Microsoft Excel format.

**Types of Export:**

#### **A. Single Result Export**
- Click Excel icon (green) on any result card
- Downloads detailed Excel file
- Includes all parameters and metadata
- Automatic filename with date

**Excel Structure:**
- **Sheet 1:** Main result information
- **Sheet 2:** Test parameters (if available)
- **Sheet 3:** Export metadata

#### **B. Bulk Export**
- Select multiple results
- Click "Export Excel" in floating toolbar
- Downloads single Excel file with all results
- Each result on separate row

**Excel Features:**
- Auto-sized columns
- Color-coded headers
- Professional formatting
- Export timestamp
- NARA branding

**Filename Format:**
```
NARA_Lab_Results_YYYY-MM-DD.xlsx
```

---

### **4. PDF Export with NARA Branding** 📄

**What it does:**  
Generate professional PDF reports with official NARA letterhead and logo.

**Features:**
- **NARA Letterhead:** Official header with logo
- **QR Code:** For result verification
- **Professional Layout:** Clean, readable format
- **Digital Signature:** Placeholder for authorized signatory
- **Page Numbers:** Automatic pagination
- **Footer Information:** Contact details and website

**Types of PDF:**

#### **A. Single Result PDF (Detailed)**
- Click PDF icon (red) on any result card
- Comprehensive report includes:
  - Test Information section
  - Timeline section
  - Test Parameters table
  - Notes & Observations
  - QR Code for verification
  - Signature placeholder

#### **B. Multiple Results PDF (Combined)**
- Select multiple results
- Click "Download PDF" in toolbar
- Combined report includes:
  - Cover page with summary
  - Summary table of all results
  - Individual pages for each result
  - Page numbers throughout

**PDF Sections:**

1. **Header (All Pages):**
   - NARA logo (top-left)
   - Organization name
   - "Ministry of Fisheries"

2. **Footer (All Pages):**
   - Address: Crow Island, Colombo 15
   - Contact: Tel, Email, Website
   - Page number

3. **Body Sections:**
   - Test Information (blue header)
   - Timeline (dates)
   - Parameters Table (gridded)
   - Notes (if available)
   - QR Code (bottom)
   - Signature line

**Filename Format:**
```
Single: NARA_Lab_Result_[ID]_YYYY-MM-DD.pdf
Multiple: NARA_Lab_Results_Report_YYYY-MM-DD.pdf
```

---

### **5. QR Code Generation** 📱

**What it does:**  
Generate scannable QR codes for result verification.

**Features:**
- **Verification URL:** Links to online verification page
- **Downloadable:** Save as PNG image
- **Copy URL:** One-click copy to clipboard
- **Embedded in PDF:** Automatically included in reports
- **NARA Branding:** Professional design

**How to Use:**
1. Click QR code icon (blue) on any result card
2. Modal opens with QR code
3. Options:
   - **Download QR:** Saves as PNG with branding
   - **Copy URL:** Copies verification link
   - **Close:** Click outside modal

**QR Code Contains:**
```
https://nara-web-73384.web.app/lab-results/verify/[RESULT_ID]
```

**Downloaded QR Format:**
- PNG image (200x200px minimum)
- NARA header text
- QR code (centered)
- Result ID below
- Instructions text

**Filename:**
```
NARA_QR_[RESULT_ID].png
```

---

### **6. Data Visualization** 📊

**What it does:**  
Interactive charts and graphs for analytics and insights.

**Available Charts:**

#### **A. Monthly Trends (Line Chart)**
- **Shows:** Last 6 months of activity
- **Lines:** 
  - Green: Completed results
  - Amber: Pending results
  - Blue: In Progress results
- **Features:** Interactive tooltips, smooth animations
- **Use Case:** Track performance over time

#### **B. Test Type Distribution (Pie Chart)**
- **Shows:** Breakdown of test categories
- **Features:** 
  - Percentage labels on slices
  - Color-coded segments
  - Hover tooltips
  - Summary stats below
- **Use Case:** Resource allocation, capacity planning

#### **C. Processing Time Analytics (Bar Chart)**
- **Shows:** Average days to complete each test type
- **Color Coding:**
  - 🟢 Green: Fast (≤3 days)
  - 🟡 Amber: Medium (4-7 days)
  - 🔴 Red: Slow (>7 days)
- **Features:** Performance indicators below
- **Use Case:** Identify bottlenecks, set expectations

#### **D. Sample Status Overview (Horizontal Bars)**
- **Shows:** Current distribution by status
- **Features:**
  - Color-coded bars
  - Status icons
  - Count and percentage
  - Grid view below
- **Use Case:** Workload monitoring, capacity planning

**Accessing Charts:**
1. Go to Dashboard tab
2. Scroll to "Analytics & Insights" section
3. View all 4 charts in 2x2 grid
4. Hover over elements for details
5. Charts update automatically with new data

**Chart Interactions:**
- **Hover:** See detailed tooltips
- **Legend:** Click to show/hide data series
- **Responsive:** Works on mobile and desktop

---

### **7. Sample Tracking** 📍

**What it does:**  
Track sample status from submission to completion.

**Features:**
- **Track by Sample ID:** Enter ID to see status
- **Status Timeline:** Visual progress indicator
- **Location Info:** Where sample is currently
- **Date Tracking:** Submitted, received, completed dates
- **Notes:** Additional information

**How to Use:**
1. Click "Track Sample" tab
2. Enter Sample ID (format: SMP-XXXXXXXXXX-XXXXXX)
3. Click "Track" button
4. View complete timeline and status

**Sample Statuses:**
- 📤 **Submitted:** Sample logged in system
- 📥 **Received:** Sample received at lab
- 🔄 **Processing:** Currently being tested
- ✅ **Completed:** Results available

---

## 👤 **USER GUIDE**

### **Getting Started**

1. **Access Portal:**
   - Navigate to: https://nara-web-73384.web.app/lab-results
   - Portal loads with Dashboard view

2. **Navigate Tabs:**
   - **Dashboard:** Overview with stats and charts
   - **Lab Results:** View and manage results
   - **My Samples:** Track your samples
   - **Track Sample:** Look up by ID

### **Common Tasks**

#### **Task 1: Find a Specific Result**
1. Go to "Lab Results" tab
2. Use search box to type keywords
3. OR use Advanced Filters for precise search
4. Click on result to view details

#### **Task 2: Download Multiple Results as PDF**
1. Go to "Lab Results" tab
2. Select checkboxes for desired results
3. Click "Download PDF" in bottom toolbar
4. PDF downloads automatically

#### **Task 3: Export Data for Analysis**
1. Apply filters to get desired results
2. Select all filtered results
3. Click "Export Excel"
4. Open in Excel/LibreOffice for analysis

#### **Task 4: Verify a Result**
1. Click QR code icon on result
2. Scan QR with phone camera
3. Verification page opens
4. Confirms authenticity

#### **Task 5: Track Sample Status**
1. Click "Track Sample" tab
2. Enter your Sample ID
3. View current status and timeline
4. Check estimated completion

---

## 👨‍💼 **ADMIN GUIDE**

### **Dashboard Management**

**Viewing Statistics:**
- Total Results count
- Completed count
- Pending count
- Total Samples count

**Analytics:**
- Monitor monthly trends
- Review test distribution
- Check processing times
- Track workload

### **Result Management**

**Adding New Results:**
1. Use admin panel (separate login)
2. Enter result details
3. Upload parameters
4. Set status
5. Assign to project

**Updating Status:**
1. Find result in admin panel
2. Change status dropdown
3. Add notes if needed
4. Save changes
5. User notifications sent (if configured)

**Bulk Operations:**
1. Import results via CSV
2. Batch status updates
3. Bulk assignment to projects
4. Mass data export

### **Report Generation**

**Monthly Reports:**
1. Go to Dashboard
2. Review charts for insights
3. Select date range
4. Export charts as images (optional)
5. Generate PDF summary report

**Custom Reports:**
1. Use Advanced Filters
2. Select specific criteria
3. Export to Excel
4. Analyze in spreadsheet software

---

## 🔧 **TECHNICAL DOCUMENTATION**

### **Technology Stack**

**Frontend:**
- React 19.x
- React Router
- i18next (multilingual)
- Framer Motion (animations)
- TailwindCSS (styling)
- Lucide Icons

**Data Visualization:**
- Recharts 2.x
- Custom chart components

**Export Libraries:**
- jsPDF (PDF generation)
- jspdf-autotable (PDF tables)
- xlsx (Excel export)
- qrcode.react (QR generation)

**Backend:**
- Firebase Firestore
- Firebase Hosting
- Firebase Storage

### **Project Structure**

```
/src
├── pages/
│   └── lab-results/
│       └── index.jsx (Main page)
├── components/
│   └── lab-results/
│       ├── AdvancedFilters.jsx
│       ├── BulkActionsToolbar.jsx
│       ├── ResultQRCode.jsx
│       └── charts/
│           ├── MonthlyTrendsChart.jsx
│           ├── TestTypeDistributionChart.jsx
│           ├── ProcessingTimeChart.jsx
│           └── StatusOverviewChart.jsx
├── utils/
│   ├── labResultsExport.js (Excel)
│   ├── labResultsPDFExport.js (PDF)
│   └── labResultsChartData.js (Charts)
└── services/
    └── labResultsService.js (Firebase)
```

### **Database Schema**

**Collection: `lab_results`**
```javascript
{
  id: string,
  testType: string,
  sampleType: string,
  sampleId: string,
  status: string,  // pending | in_progress | completed
  projectName: string,
  location: string,
  researcherName: string,
  parameters: Array<{
    name: string,
    value: number,
    unit: string,
    method: string,
    status: string
  }>,
  notes: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  completedAt: Timestamp
}
```

**Collection: `samples`**
```javascript
{
  id: string,
  sampleId: string,
  sampleType: string,
  status: string,  // submitted | received | processing | completed
  location: string,
  submittedAt: Timestamp,
  receivedAt: Timestamp,
  completedAt: Timestamp,
  notes: string
}
```

### **Environment Setup**

**Required Environment Variables:**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Installation:**
```bash
npm install
npm run build
npm run dev  # Development
npm run build  # Production
firebase deploy --only hosting
```

### **API Endpoints**

**Lab Results Service:**
```javascript
// Get all results
labResultsService.getAll(filters?)
// Returns: { data: Array, error: null }

// Get single result
labResultsService.getById(id)
// Returns: { data: Object, error: null }

// Create result
labResultsService.create(resultData)
// Returns: { data: Object, error: null }

// Update result
labResultsService.update(id, updates)
// Returns: { data: Object, error: null }

// Delete result
labResultsService.delete(id)
// Returns: { data: boolean, error: null }
```

**Sample Tracking Service:**
```javascript
// Track by sample ID
sampleTrackingService.getBySampleId(sampleId)
// Returns: { data: Object, error: null }

// Get all samples
sampleTrackingService.getAll()
// Returns: { data: Array, error: null }
```

**Dashboard Service:**
```javascript
// Get statistics
labResultsDashboardService.getStatistics()
// Returns: { 
//   data: { 
//     results: { total, completed, pending },
//     samples: { total, submitted, received, processing }
//   }, 
//   error: null 
// }
```

---

## 🐛 **TROUBLESHOOTING**

### **Common Issues**

#### **Issue: Charts not showing**
**Cause:** No data available  
**Solution:** 
- Add some lab results via admin
- Or view sample/demo data
- Check browser console for errors

#### **Issue: PDF download fails**
**Cause:** Logo file missing  
**Solution:**
- Place `nara-logo.png` in `/public/images/`
- Check file name is exactly correct
- Ensure PNG format

#### **Issue: Excel export empty**
**Cause:** No results selected  
**Solution:**
- Select at least one result with checkbox
- Check filtered results are visible
- Try selecting all

#### **Issue: QR code doesn't scan**
**Cause:** URL format issue  
**Solution:**
- Download QR as image and try again
- Check internet connection
- Use different QR scanner app

#### **Issue: Filters not working**
**Cause:** Data format mismatch  
**Solution:**
- Clear all filters and try again
- Refresh page
- Check data has required fields

### **Error Messages**

| Error | Meaning | Solution |
|-------|---------|----------|
| "No results found" | Filters too restrictive | Clear some filters |
| "Sample not found" | Invalid Sample ID | Check ID format |
| "Export failed" | Export error | Check console, retry |
| "PDF generation failed" | PDF library error | Refresh and retry |
| "Loading..." stuck | Network issue | Check connection |

### **Browser Compatibility**

**Supported Browsers:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Not Supported:**
- ❌ Internet Explorer
- ❌ Chrome < 80

### **Performance Tips**

1. **Slow Loading:**
   - Limit results with filters
   - Use date range to narrow down
   - Clear browser cache

2. **Large Exports:**
   - Export in smaller batches
   - Use filters before exporting
   - Close other browser tabs

3. **Chart Performance:**
   - Charts auto-optimize for data size
   - Limit to recent months
   - Use dashboard for overview

---

## ❓ **FAQ**

### **General Questions**

**Q: Is the portal mobile-friendly?**  
A: Yes! All features work on mobile devices. Charts and tables are responsive.

**Q: Can I use this offline?**  
A: No, internet connection required for Firebase data sync.

**Q: Is my data secure?**  
A: Yes, Firebase security rules protect all data. Only authorized users can access.

**Q: How often are charts updated?**  
A: Charts update automatically whenever data changes.

### **Feature Questions**

**Q: How many results can I export at once?**  
A: No limit, but recommend <100 for performance.

**Q: Can I customize PDF format?**  
A: Template is fixed but can be modified in code.

**Q: What languages are supported?**  
A: English, Sinhala, Tamil (switch in app header).

**Q: Can I schedule reports?**  
A: Not currently, but planned for future.

**Q: How long are results stored?**  
A: Indefinitely unless manually deleted.

### **Technical Questions**

**Q: What's the file size limit for PDFs?**  
A: No strict limit, typically <10MB per PDF.

**Q: Can I integrate with other systems?**  
A: Yes, via Firebase API. Contact admin for access.

**Q: Is there an API for external apps?**  
A: Yes, Firebase provides REST API.

**Q: Can I run this locally?**  
A: Yes, clone repo and run `npm run dev`.

---

## 📞 **SUPPORT**

### **Contact Information**

**NARA Headquarters:**
- Address: Crow Island, Colombo 15, Sri Lanka
- Phone: +94 11 2521000
- Email: info@nara.gov.lk
- Website: www.nara.gov.lk

**Technical Support:**
- Email: support@nara.gov.lk
- Response Time: 24-48 hours

**Documentation:**
- GitHub: https://github.com/safenetcreations/NARA-OFFICIAL-WEBSITE
- Issues: Report bugs on GitHub

### **Training Resources**

**Video Tutorials:** (Coming soon)
- Getting Started Guide
- Advanced Filtering Tutorial
- Export & Reports Guide
- Admin Panel Walkthrough

**User Manual:** This document

**Quick Reference Cards:** See `/docs` folder

---

## 🔄 **CHANGELOG**

### **Version 2.0** (October 28, 2025)
- ✅ Added PDF Export with NARA branding
- ✅ Added Data Visualization (4 charts)
- ✅ Added Advanced Filtering
- ✅ Added Bulk Operations
- ✅ Added QR Code Generation
- ✅ Enhanced Excel Export
- ✅ Improved UI/UX
- ✅ Performance optimizations

### **Version 1.0** (Initial Release)
- Basic lab results listing
- Simple search
- Sample tracking
- Basic export

---

## 📜 **LICENSE**

© 2025 National Aquatic Resources Research & Development Agency (NARA)  
Ministry of Fisheries, Sri Lanka

All rights reserved. This software is proprietary to NARA.

---

## 📝 **NOTES**

**Important:**
1. Always place NARA logo in correct location for PDFs
2. Regular backups recommended
3. Test exports before distributing
4. Keep Firebase credentials secure
5. Review security rules periodically

**Best Practices:**
- Use filters to find data quickly
- Export regularly for archival
- QR codes for official reports
- Charts for executive summaries
- Mobile access for field work

---

**END OF DOCUMENTATION**

For updates and additional resources, visit:
🌐 https://nara-web-73384.web.app

Last Updated: October 28, 2025
