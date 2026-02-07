# Trilingual Support Implementation Plan

## Pages Missing i18n Support (12 Pages)

### Current Status
- **Total Pages**: 41
- **With i18n**: 29 pages ✅
- **Missing i18n**: 12 pages ⚠️
- **Coverage**: 71%

### Pages Requiring Trilingual Implementation

1. **Analytics Hub** (`/analytics-hub`)
   - Status: Translation files created ✅
   - Needs: Code integration

2. **Scientific Evidence Repository** (`/scientific-evidence-repository`)
   - Status: Translation files created ✅  
   - Needs: Code integration

3. **Project Pipeline Tracker** (`/project-pipeline-tracker`)
   - Status: Translation files created ✅
   - Needs: Code integration

4. **Firebase Admin Authentication Portal** (`/firebase-admin-authentication-portal`)
   - Status: Pending
   - Type: Admin portal - English only acceptable

5. **Firebase Admin Dashboard** (`/firebase-admin-dashboard-control-center`)
   - Status: Pending
   - Type: Admin portal - English only acceptable

6. **Marine Spatial Planning Viewer** (`/marine-spatial-planning-viewer`)
   - Status: Pending
   - Needs: Full translations

7. **Maritime Services Hub** (`/maritime-services-hub`)
   - Status: Pending
   - Needs: Full translations

8. **NARA Digital Marketplace** (`/nara-digital-marketplace`)
   - Status: Pending
   - Needs: Full translations

9. **Ocean Intelligence Dashboard** (`/ocean-intelligence-dashboard-homepage`)
   - Status: Pending
   - Needs: Full translations

10. **Partnership Innovation Gateway** (`/partnership-innovation-gateway`)
    - Status: Pending
    - Needs: Full translations

11. **Payment Gateway Hub** (`/payment-gateway-hub`)
    - Status: Pending
    - Needs: Full translations

12. **Research Excellence Portal** (`/research-excellence-portal`)
    - Status: Pending
    - Needs: Full translations

## Translation Files Created

### Completed ✅
1. `analytics.json` (en, si, ta)
2. `scientificEvidence.json` (en, si, ta)
3. `projectPipeline.json` (en, si, ta)

### Pending ⏳
4. `marineSpatialPlanning.json`
5. `researchExcellence.json`
6. `partnership.json`
7. `marketplace.json`
8. `paymentGateway.json`
9. `oceanIntelligence.json`

## Implementation Strategy

### Phase 1: High-Priority Public Pages (Immediate)
Pages with highest user traffic:
1. Ocean Intelligence Dashboard (Homepage)
2. Research Excellence Portal
3. Partnership Innovation Gateway
4. Maritime Services Hub

**Action**: Create translations + implement i18n hooks

### Phase 2: Medium-Priority Pages (This Week)
Supporting pages:
1. NARA Digital Marketplace
2. Marine Spatial Planning Viewer
3. Payment Gateway Hub

**Action**: Create translations + implement i18n hooks

### Phase 3: Completed Pages Verification
Already implemented pages:
- Verify all 29 pages have complete translations
- Check for hardcoded text
- Test language switching

### Phase 4: Admin Portals (Optional)
Admin-only pages:
- Can remain English-only
- Or add basic Sinhala/Tamil for local staff

## Implementation Steps for Each Page

### Step 1: Create Translation Files
```bash
# For each page, create 3 files:
src/locales/en/[pageName].json
src/locales/si/[pageName].json
src/locales/ta/[pageName].json
```

### Step 2: Add i18n Hook to Component
```javascript
import { useTranslation } from 'react-i18next';

const PageComponent = () => {
  const { t } = useTranslation('[namespace]');
  
  return (
    <>
      <h1>{t('[namespace]:title')}</h1>
      <p>{t('[namespace]:description')}</p>
    </>
  );
};
```

### Step 3: Replace Hardcoded Text
```javascript
// Before
<button>Submit</button>

// After
<button>{t('actions.submit')}</button>
```

### Step 4: Test Language Switching
- Switch to English
- Switch to Sinhala
- Switch to Tamil
- Verify all text updates

## Translation Quality Standards

### English (Source)
- Professional, clear language
- Technical terms where appropriate
- Complete and accurate

### Sinhala (සිංහල)
- Natural, fluent translation
- Proper Unicode formatting
- Technical terms with explanations
- Cultural adaptation where needed

### Tamil (தமிழ்)
- Natural, fluent translation
- Proper Unicode formatting
- Technical terms with explanations
- Cultural adaptation where needed

## Testing Checklist

### For Each Page:
- [ ] English text displays correctly
- [ ] Sinhala text displays correctly
- [ ] Tamil text displays correctly
- [ ] Language switcher works
- [ ] No hardcoded text remains
- [ ] Layout doesn't break with longer text
- [ ] Mobile view tested in all languages
- [ ] RTL text handled properly (if applicable)

## Automation Script

```bash
#!/bin/bash
# trilingual-check.sh
# Checks for pages missing i18n

echo "Scanning for pages without i18n..."
for file in src/pages/*/index.jsx; do
  if ! grep -q "useTranslation\|i18next" "$file" 2>/dev/null; then
    echo "❌ Missing i18n: $file"
  else
    echo "✅ Has i18n: $file"
  fi
done
```

## Progress Tracking

### Week 1 (Current)
- [x] Audit all pages
- [x] Create Analytics Hub translations
- [x] Create Scientific Evidence translations  
- [x] Create Project Pipeline translations
- [ ] Implement Analytics Hub i18n
- [ ] Implement Scientific Evidence i18n
- [ ] Implement Project Pipeline i18n

### Week 2 (Next)
- [ ] Create remaining translation files
- [ ] Implement remaining pages
- [ ] Test all pages
- [ ] Fix any issues

### Week 3 (Final)
- [ ] Complete verification
- [ ] Documentation update
- [ ] Deploy changes

## Next Steps (Immediate Action Required)

1. **Create remaining translation files** (6 pages)
   - Priority: Ocean Intelligence, Research Excellence, Partnership

2. **Implement i18n in completed translation pages** (3 pages)
   - Analytics Hub
   - Scientific Evidence
   - Project Pipeline

3. **Test implementation**
   - Language switching
   - Text completeness
   - Layout integrity

## Expected Outcomes

### After Full Implementation:
- **100% trilingual coverage** for all public pages
- **Consistent user experience** across all languages
- **Improved accessibility** for Sinhala and Tamil speakers
- **Professional quality** translations
- **Mobile-optimized** multilingual experience

## Resources Required

### Time Estimate:
- Translation file creation: 2 hours per page
- Code implementation: 1 hour per page
- Testing: 30 minutes per page
- **Total**: ~40 hours for all 12 pages

### Tools:
- i18next library (already installed)
- Translation management (manual for now)
- Quality assurance checklist

---

**Last Updated**: October 15, 2025
**Status**: 3 of 12 pages have translation files ready
**Next Action**: Implement i18n hooks in completed pages
