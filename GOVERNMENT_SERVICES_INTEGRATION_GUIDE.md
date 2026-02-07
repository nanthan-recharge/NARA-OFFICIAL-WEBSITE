# 🚀 Government Services Portal - Integration Guide

## Overview
This guide explains how to integrate all the newly created components into the Government Services Portal.

## Components to Integrate

### 1. Forms
- `EIAApplicationForm.jsx` - EIA application submission
- `LicenseApplicationForm.jsx` - License application (3 types)
- `EmergencyReportForm.jsx` - Emergency incident reporting

### 2. Search & Filter
- `GlobalSearchFilter.jsx` - Search and advanced filtering

### 3. Export Utilities
- `governmentServicesPDFExport.js` - PDF generation
- `governmentServicesExcelExport.js` - Excel export

## Integration Steps

### Step 1: Import Components

Add to the top of `/src/pages/government-services-portal/index.jsx`:

```javascript
// Form Components
import EIAApplicationForm from '../../components/government-services/forms/EIAApplicationForm';
import LicenseApplicationForm from '../../components/government-services/forms/LicenseApplicationForm';
import EmergencyReportForm from '../../components/government-services/forms/EmergencyReportForm';

// Search & Filter
import GlobalSearchFilter from '../../components/government-services/GlobalSearchFilter';

// Export Utilities
import { exportEIAToPDF, exportLicenseToPDF, exportEmergencyToPDF } from '../../utils/governmentServicesPDFExport';
import { exportEIAToExcel, exportLicensesToExcel, exportEmergenciesToExcel, exportCombinedReport } from '../../utils/governmentServicesExcelExport';

// Toast notifications
import { Toaster } from 'react-hot-toast';
```

### Step 2: Add State for Modals

```javascript
const [showEIAForm, setShowEIAForm] = useState(false);
const [showLicenseForm, setShowLicenseForm] = useState(false);
const [showEmergencyForm, setShowEmergencyForm] = useState(false);
const [selectedLicenseType, setSelectedLicenseType] = useState(null);
const [filters, setFilters] = useState({});
```

### Step 3: Add Handler Functions

```javascript
// Form submission handlers
const handleEIASubmit = (data) => {
  console.log('EIA submitted:', data);
  // Refresh data
  loadDashboardData();
};

const handleLicenseSubmit = (data) => {
  console.log('License submitted:', data);
  loadDashboardData();
};

const handleEmergencySubmit = (data) => {
  console.log('Emergency submitted:', data);
  loadDashboardData();
};

// Export handlers
const handleExportEIAPDF = (application) => {
  const result = exportEIAToPDF(application);
  if (result.success) {
    toast.success(`PDF downloaded: ${result.filename}`);
  } else {
    toast.error('Failed to export PDF');
  }
};

const handleExportLicensePDF = (license) => {
  exportLicenseToPDF(license);
};

const handleExportEmergencyPDF = (incident) => {
  exportEmergencyToPDF(incident);
};

const handleExportToExcel = (type) => {
  let result;
  switch(type) {
    case 'eia':
      result = exportEIAToExcel(eiaApplications);
      break;
    case 'licenses':
      result = exportLicensesToExcel(licenses);
      break;
    case 'emergencies':
      result = exportEmergenciesToExcel(emergencyIncidents);
      break;
    case 'combined':
      result = exportCombinedReport({
        eia: eiaApplications,
        licenses: licenses,
        emergencies: emergencyIncidents
      });
      break;
  }
  
  if (result?.success) {
    toast.success(`Exported ${result.count || 0} records`);
  }
};

// Search & filter handlers
const handleSearch = (query) => {
  setSearchQuery(query);
  // Implement search logic
};

const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
  // Implement filter logic
};
```

### Step 4: Update Button Click Handlers

Replace existing button placeholders with:

```javascript
// EIA Section "New EIA" Button
<motion.button
  onClick={() => setShowEIAForm(true)}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/30"
>
  <Plus className="w-5 h-5" />
  {{ en: 'New EIA', si: 'නව EIA', ta: 'புதிய EIA' }[currentLang]}
</motion.button>

// License Section Buttons (for each license type)
<button
  onClick={() => {
    setSelectedLicenseType('fishing');
    setShowLicenseForm(true);
  }}
  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/10"
>
  {{ en: 'Apply Now', si: 'අයදුම් කරන්න', ta: 'இப்போது விண்ணப்பிக்கவும்' }[currentLang]}
</button>

// Emergency Section "Report Emergency" Button
<motion.button
  onClick={() => setShowEmergencyForm(true)}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-red-500/30"
>
  <Plus className="w-5 h-5" />
  {{ en: 'Report Emergency', si: 'හදිසි වාර්තාව', ta: 'அவசர அறிக்கை' }[currentLang]}
</motion.button>

// Download buttons for each item
<button 
  onClick={() => handleExportEIAPDF(application)}
  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
>
  <Download className="w-5 h-5 text-white" />
</button>

// Export to Excel buttons (add to each section)
<button
  onClick={() => handleExportToExcel('eia')}
  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-2"
>
  <Download className="w-4 h-4" />
  Export to Excel
</button>
```

### Step 5: Add Search & Filter Component

Add below the section navigation:

```javascript
<div className="mb-8">
  <GlobalSearchFilter
    onSearch={handleSearch}
    onFilterChange={handleFilterChange}
    activeFilters={filters}
    sections={['eia', 'licensing', 'compliance', 'emergency']}
  />
</div>
```

### Step 6: Add Form Modals

Add before the closing component return:

```javascript
{/* Form Modals */}
<AnimatePresence>
  {showEIAForm && (
    <EIAApplicationForm
      onClose={() => setShowEIAForm(false)}
      onSuccess={handleEIASubmit}
    />
  )}
  
  {showLicenseForm && (
    <LicenseApplicationForm
      onClose={() => {
        setShowLicenseForm(false);
        setSelectedLicenseType(null);
      }}
      onSuccess={handleLicenseSubmit}
      preSelectedType={selectedLicenseType}
    />
  )}
  
  {showEmergencyForm && (
    <EmergencyReportForm
      onClose={() => setShowEmergencyForm(false)}
      onSuccess={handleEmergencySubmit}
    />
  )}
</AnimatePresence>

{/* Toast Container */}
<Toaster position="top-right" />
```

## Testing Checklist

### Form Testing
- [ ] EIA form opens and closes
- [ ] EIA form submits successfully
- [ ] EIA form validation works
- [ ] License form opens with correct type
- [ ] License form submits successfully
- [ ] Emergency form opens and closes
- [ ] Emergency form submits successfully
- [ ] Document uploads work in all forms

### Search & Filter Testing
- [ ] Search bar filters results
- [ ] Status filter works
- [ ] Date range filter works
- [ ] Section filter works
- [ ] Clear filters button works
- [ ] Active filter badges display
- [ ] Filter chips are removable

### Export Testing
- [ ] PDF export for EIA works
- [ ] PDF export for License works
- [ ] PDF export for Emergency works
- [ ] Excel export for EIA works
- [ ] Excel export for Licenses works
- [ ] Excel export for Emergencies works
- [ ] Combined report exports correctly
- [ ] PDFs have correct NARA branding
- [ ] Excel files have summary sheets

### Data Flow Testing
- [ ] Form submissions save to Firestore
- [ ] Documents upload to Firebase Storage
- [ ] Dashboard refreshes after submission
- [ ] User data loads correctly
- [ ] Statistics update in real-time
- [ ] Notifications display properly

### UI/UX Testing
- [ ] All buttons are clickable
- [ ] Loading states display
- [ ] Error messages show when needed
- [ ] Success messages appear
- [ ] Animations are smooth
- [ ] Mobile responsive design works
- [ ] Forms are accessible (keyboard navigation)

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Deployment Steps

### 1. Build for Production
```bash
npm run build
```

### 2. Test Build Locally
```bash
npm run preview
```

### 3. Deploy to Firebase
```bash
firebase deploy --only hosting
```

### 4. Verify Deployment
- Visit production URL
- Test all forms
- Test all exports
- Check console for errors

## Troubleshooting

### Forms Not Opening
- Check import paths
- Verify state variables are defined
- Check AnimatePresence wrapper

### PDF Export Not Working
- Verify jspdf is installed
- Check data structure matches export function
- Look for console errors

### Excel Export Not Working
- Verify xlsx is installed
- Check data format
- Ensure array data is provided

### Search/Filter Not Working
- Verify callback functions are defined
- Check filter state updates
- Ensure data array exists

## Performance Optimization

### Code Splitting
```javascript
// Lazy load forms
const EIAApplicationForm = lazy(() => import('./forms/EIAApplicationForm'));
const LicenseApplicationForm = lazy(() => import('./forms/LicenseApplicationForm'));
const EmergencyReportForm = lazy(() => import('./forms/EmergencyReportForm'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  {showEIAForm && <EIAApplicationForm ... />}
</Suspense>
```

### Memoization
```javascript
// Memo expensive computations
const filteredApplications = useMemo(() => {
  return eiaApplications.filter(app => {
    // Filter logic
  });
}, [eiaApplications, searchQuery, filters]);
```

## Security Considerations

### 1. Authentication
- All forms require user authentication
- Check `user` object before submission
- Redirect to login if not authenticated

### 2. Data Validation
- Client-side validation (Yup schemas)
- Server-side validation (Firebase rules)
- Sanitize user inputs

### 3. File Upload Security
- Validate file types
- Limit file sizes
- Scan for malware (server-side)
- Use Firebase Security Rules

### 4. Firebase Security Rules
```javascript
// Example Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /eia_applications/{document} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Support & Documentation

For issues or questions:
- Email: dev@nara.gov.lk
- GitHub: /issues
- Documentation: /docs

## Version History

- **v1.0** - Initial implementation (Phase 1)
  - Forms: EIA, License, Emergency
  - Search & Filter
  - PDF/Excel Export
  - Integration complete

---

**Status:** Ready for Integration  
**Last Updated:** October 28, 2025  
**Developer:** Cascade AI Assistant
