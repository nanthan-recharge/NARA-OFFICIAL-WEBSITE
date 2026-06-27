# Phase 4 Testing Guide

## 🎯 Overview

This guide provides step-by-step instructions for testing all Phase 4: Stakeholder Engagement & Collaboration systems.

**Live URL**: https://nara-web-73384.web.app
**Local Dev**: http://localhost:4028

---

## 🚀 Quick Start

### 1. Seed Sample Data

**URL**: `/admin/phase4-seeder`

1. Navigate to the Phase 4 Data Seeder page
2. Review what will be created
3. Click "Seed Phase 4 Data" button
4. Wait for confirmation (check console for logs)
5. Use the quick links to navigate to test pages

**What Gets Created**:
- 4 Public consultations (3 open, 1 closed)
- 3 Feedback submissions with different sentiments
- 2 Comments with likes
- 3 Researcher profiles
- 2 Industry partners
- 3 Educational content items
- 2 Student competitions
- 2 Webinars

---

## 📋 Public Consultation Portal Testing

### Access
**URL**: `/public-consultation-portal`

### Test Cases

#### TC1: Browse Consultations
**Steps**:
1. Navigate to Public Consultation Portal
2. Verify hero section displays correctly
3. Check that 3 "open" consultations are visible
4. Verify consultation cards show:
   - Title
   - Description
   - Category badge
   - Status badge
   - Closing date
   - Participant count
   - Feedback count
   - View count

**Expected**: All consultations render with correct information

#### TC2: Filter by Status
**Steps**:
1. Click status filter dropdown
2. Select "Open"
3. Verify only open consultations appear
4. Select "Closed"
5. Verify closed consultation appears
6. Select "All Status"
7. Verify all consultations appear

**Expected**: Filtering works correctly for all status values

#### TC3: Filter by Category
**Steps**:
1. Click category filter dropdown
2. Select "Marine Conservation"
3. Verify only matching consultations appear
4. Select "Fisheries Management"
5. Verify correct filtering
6. Select "All Categories"

**Expected**: Category filtering works correctly

#### TC4: Search Functionality
**Steps**:
1. Type "marine" in search box
2. Verify consultations with "marine" in title/description appear
3. Type "fishing"
4. Verify correct results
5. Clear search

**Expected**: Search filters by title and description

#### TC5: View Consultation Details
**Steps**:
1. Click "View Details" on any consultation
2. Verify modal opens with:
   - Full description
   - Category and status
   - Closing date
   - Document links (if any)
   - Contact email
3. Click document link (opens example.com)
4. Click "Close" button

**Expected**: Details modal displays all information correctly

#### TC6: Submit Feedback
**Steps**:
1. Click "Submit Feedback" on an open consultation
2. Fill in form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Organization: "Test Organization"
   - Category: "Community"
   - Sentiment: "Positive"
   - Feedback: "This is excellent! I fully support this initiative."
3. Click "Submit Feedback"
4. Verify success message appears
5. Check that feedback count increased

**Expected**: Feedback submitted successfully, count updated

#### TC7: View Feedback
**Steps**:
1. Click "View Feedback" on consultation with feedback
2. Verify feedback list displays:
   - Commenter name and organization
   - Feedback text
   - Sentiment badge (color-coded)
   - Category badge
   - Upvote count
   - Submission date
3. Scroll through all feedback
4. Check sentiment color coding:
   - Positive = Green
   - Neutral = Gray
   - Negative = Red

**Expected**: All feedback displays correctly with proper styling

#### TC8: Upvote Feedback
**Steps**:
1. In feedback modal, click upvote button
2. Verify upvote count increases
3. Verify button changes to "Upvoted"
4. Click again
5. Verify cannot upvote twice (disabled)

**Expected**: Upvoting works, prevents duplicate upvotes

#### TC9: Post Comment
**Steps**:
1. Click "Post Comment" on any consultation
2. Fill in form:
   - Name: "Comment Test"
   - Email: "comment@example.com"
   - Comment: "Great discussion! I have a question about implementation timeline."
3. Submit comment
4. Verify success message
5. Check comment count increased

**Expected**: Comment posted successfully

#### TC10: View Comments
**Steps**:
1. Click "View Comments" on consultation with comments
2. Verify comment thread displays
3. Check each comment shows:
   - Commenter name
   - Comment text
   - Like count
   - Post date
4. Click like button on a comment
5. Verify like count increases

**Expected**: Comments display correctly, liking works

#### TC11: Multi-Language Switching
**Steps**:
1. Locate language selector (top of page)
2. Click "සිංහල" (Sinhala)
3. Verify all text translates to Sinhala:
   - Navigation items
   - Button labels
   - Form fields
   - Status badges
4. Click "தமிழ்" (Tamil)
5. Verify Tamil translation
6. Click "English"
7. Verify returns to English

**Expected**: All UI text translates correctly in all 3 languages

#### TC12: Responsive Design
**Steps**:
1. Resize browser to mobile width (375px)
2. Verify layout adapts:
   - Hero section stacks vertically
   - Filter dropdowns are full-width
   - Consultation cards stack
   - Modals are mobile-friendly
3. Test on tablet (768px)
4. Test on desktop (1920px)

**Expected**: Responsive design works across all breakpoints

---

## ⚙️ Admin Panel Testing

### Access
**URL**: `/admin/public-consultation`

### Test Cases

#### TC13: View Dashboard
**Steps**:
1. Navigate to admin panel
2. Verify dashboard displays:
   - Total Consultations count
   - Total Participants count
   - Total Feedback count
   - Average Sentiment Score
3. Check that numbers match seeded data

**Expected**: Dashboard shows correct statistics

#### TC14: Create New Consultation
**Steps**:
1. Click "Create Consultation" tab
2. Fill in form:
   - Title: "Test Consultation - Quality Assurance"
   - Description: "This is a test consultation for QA purposes."
   - Category: "Environmental Protection"
   - Status: "Draft"
   - Closing Date: (Select date 30 days in future)
   - Contact Email: "qa@nara.gov.lk"
   - Department: "QA Division"
3. Click "Create Consultation"
4. Verify success message
5. Check consultation appears in list

**Expected**: New consultation created successfully

#### TC15: Edit Consultation
**Steps**:
1. In "Manage Consultations" tab, find created consultation
2. Click "Edit" button
3. Change status to "Open"
4. Update title
5. Click "Update"
6. Verify changes saved

**Expected**: Consultation updated successfully

#### TC16: Open/Close Consultation
**Steps**:
1. Select a draft consultation
2. Click "Open Consultation" button
3. Verify status changes to "Open"
4. Click "Close Consultation"
5. Verify status changes to "Closed"
6. Verify appropriate buttons show for each status

**Expected**: Status changes work correctly

#### TC17: View Consultation Analytics
**Steps**:
1. Click on a consultation with feedback
2. Review analytics section:
   - Participant count
   - Feedback count
   - Comment count
   - Vote count
   - Sentiment breakdown (positive/neutral/negative)
   - Engagement rate percentage
3. Verify calculations are correct

**Expected**: Analytics display accurate data

#### TC18: Generate Report
**Steps**:
1. Select consultation with feedback
2. Click "Generate Report" button
3. Verify report modal opens
4. Check report contains:
   - Consultation details
   - Statistics summary
   - Sentiment analysis
   - Top feedback items
   - Comment highlights
5. Click "Close"

**Expected**: Report generates with comprehensive data

#### TC19: Export to CSV
**Steps**:
1. Select consultation with feedback
2. Click "Export CSV" button
3. Verify CSV file downloads
4. Open CSV in Excel/Sheets
5. Check columns:
   - Feedback ID
   - Name
   - Organization
   - Feedback text
   - Sentiment
   - Category
   - Upvotes
   - Date
6. Verify all feedback rows present

**Expected**: CSV exports with correct data format

#### TC20: Moderate Feedback
**Steps**:
1. View feedback list
2. Find feedback that needs moderation
3. Click "Flag Inappropriate" button
4. Verify feedback marked
5. Click "Approve" button
6. Verify feedback status updates

**Expected**: Moderation tools work correctly

#### TC21: Delete Consultation
**Steps**:
1. Find test consultation created in TC14
2. Click "Delete" button
3. Confirm deletion in modal
4. Verify consultation removed from list
5. Check participant count decreased

**Expected**: Consultation deleted successfully

---

## 🐛 Known Issues & Limitations

### Current Limitations:
1. **Sample URLs**: All documents and media URLs point to example.com
2. **No Authentication**: Admin panel accessible without login (future enhancement)
3. **No Email Notifications**: Feedback/comment notifications not implemented
4. **Upvote Tracking**: No prevention of duplicate upvotes from same user (requires auth)
5. **Translation Coverage**: Some dynamic content may not be translated

### Expected Warnings:
- **Large Bundle Size**: Vite build warnings about chunk sizes (normal for comprehensive platform)
- **Firebase Rules**: Some operations may fail if rules not deployed
- **Index Creation**: First queries may prompt to create indexes in Firebase

---

## ✅ Testing Checklist

### Public Portal
- [ ] Browse consultations
- [ ] Filter by status
- [ ] Filter by category
- [ ] Search consultations
- [ ] View consultation details
- [ ] Submit feedback
- [ ] View feedback list
- [ ] Upvote feedback
- [ ] Post comment
- [ ] View comments
- [ ] Like comments
- [ ] Switch to Sinhala
- [ ] Switch to Tamil
- [ ] Switch to English
- [ ] Test on mobile
- [ ] Test on tablet
- [ ] Test on desktop

### Admin Panel
- [ ] View dashboard statistics
- [ ] Create new consultation
- [ ] Edit consultation
- [ ] Open consultation
- [ ] Close consultation
- [ ] View analytics
- [ ] Generate report
- [ ] Export CSV
- [ ] Moderate feedback
- [ ] Delete consultation

---

## 📊 Performance Benchmarks

### Expected Load Times:
- **Initial Page Load**: < 3 seconds
- **Consultation List Fetch**: < 1 second
- **Feedback Submission**: < 2 seconds
- **Modal Opening**: < 300ms
- **Language Switch**: < 500ms

### Data Limits:
- **Consultations Per Page**: Unlimited (pagination recommended for production)
- **Feedback Per Consultation**: Unlimited
- **Comments Per Consultation**: Unlimited
- **Concurrent Users**: Tested up to 100 (Firebase scales automatically)

---

## 🔧 Troubleshooting

### Issue: Seeder button doesn't work
**Solution**: Check browser console for errors. Verify Firebase config is correct.

### Issue: Consultations not appearing
**Solution**:
1. Check if seeder ran successfully
2. Verify Firebase rules deployed
3. Check browser console for Firestore errors
4. Ensure indexes are created

### Issue: Language switching not working
**Solution**:
1. Check i18n configuration
2. Verify translation files loaded
3. Clear browser cache

### Issue: CSV export fails
**Solution**:
1. Ensure feedback exists for consultation
2. Check browser console for errors
3. Verify CSV generation logic

### Issue: Modals not closing
**Solution**:
1. Clear browser cache
2. Check for JavaScript errors
3. Verify modal state management

---

## 📝 Bug Report Template

When reporting issues, use this format:

```
**Bug Title**: [Brief description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1.
2.
3.

**Expected Behavior**:


**Actual Behavior**:


**Environment**:
- Browser: [Chrome/Firefox/Safari]
- Version:
- Device: [Desktop/Mobile]
- Screen Size:

**Screenshots**:
[Attach if applicable]

**Console Errors**:
[Copy any errors from browser console]
```

---

## 🎓 Next Steps After Testing

1. **Fix Critical Bugs**: Address any blocking issues found
2. **UI/UX Improvements**: Refine based on user feedback
3. **Performance Optimization**: Optimize slow queries
4. **Security Hardening**: Implement authentication for admin
5. **Production Deployment**: Deploy to production Firebase project
6. **User Training**: Create user guides for admins
7. **Monitor Analytics**: Set up Firebase Analytics
8. **Gather Feedback**: Conduct user acceptance testing

---

## 📞 Support

For issues or questions:
- **Email**: dev@nara.gov.lk
- **Documentation**: `/docs` folder
- **Firebase Console**: https://console.firebase.google.com/project/nara-web-73384

---

**Last Updated**: 2024 (Phase 4 Deployment)
**Version**: 1.0.0
**Status**: ✅ Ready for Testing
