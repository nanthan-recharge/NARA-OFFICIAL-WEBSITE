# Keyboard Navigation Testing Guide - WCAG 2.2 AA

**Purpose:** Ensure all NARA website functionality is accessible via keyboard only  
**Standard:** WCAG 2.1.1 (Keyboard - Level A), WCAG 2.4.7 (Focus Visible - Level AA)  
**Estimated Time:** 2-3 hours for comprehensive test

---

## 🎯 **TESTING OBJECTIVES**

1. All interactive elements are keyboard accessible
2. Focus indicators are visible (3px cyan outline)
3. Logical tab order
4. No keyboard traps
5. Skip link functions correctly
6. Dropdown menus work with keyboard
7. Modals/dialogs can be closed with Escape
8. Forms are fully navigable

---

## ⌨️ **KEYBOARD CONTROLS REFERENCE**

| Key | Action |
|-----|--------|
| **Tab** | Move to next interactive element |
| **Shift + Tab** | Move to previous interactive element |
| **Enter** | Activate button, link, or submit form |
| **Space** | Activate button or toggle checkbox |
| **Escape** | Close modal, dropdown, or dialog |
| **Arrow Keys** | Navigate dropdown menus, sliders |
| **Home** | Jump to first item in list |
| **End** | Jump to last item in list |

---

## 🧪 **TEST PROTOCOL**

### **Setup**
1. Disconnect mouse (or don't use it)
2. Open browser in incognito mode
3. Navigate to: `http://localhost:4028` (dev) or production URL
4. Have this checklist ready

---

## 📋 **TEST CASES**

### **1. Skip Link (CRITICAL)** ✅

**Steps:**
1. Load homepage
2. Press **Tab** once
3. **Expected:** Skip link appears with text "Skip to main content"
4. Press **Enter**
5. **Expected:** Focus moves to main content area

**Pass Criteria:**
- ✅ Skip link visible on focus
- ✅ Has 3px cyan outline
- ✅ Pressing Enter jumps to #main-content
- ✅ Focus indicator visible on main content

---

### **2. Navigation Bar**

**Steps:**
1. Press **Tab** from skip link
2. **Expected:** Focus moves to first navigation item
3. Continue tabbing through all nav items

**Pass Criteria:**
- ✅ All nav links have visible focus (cyan outline)
- ✅ Tab order is left-to-right
- ✅ Dropdown menus expand on Enter/Space
- ✅ Arrow keys navigate dropdown items
- ✅ Escape closes dropdown

**Pages to Test:**
- Research dropdown
- Services dropdown
- Resources dropdown
- About dropdown
- News dropdown

---

### **3. Language Switcher**

**Steps:**
1. Tab to language switcher (EN | සිං | தமிழ்)
2. Press **Enter** on each language option
3. **Expected:** Page content changes language

**Pass Criteria:**
- ✅ Focus indicator visible
- ✅ Enter/Space activates language change
- ✅ Current language visually indicated
- ✅ All three languages (EN, SI, TA) work

---

### **4. Accessibility Toolbar**

**Steps:**
1. Tab to accessibility icon (eye icon, bottom-right)
2. Press **Enter** to open toolbar
3. **Expected:** Toolbar panel opens

**Test Controls:**
- Tab through all controls
- Test font size slider (Arrow keys)
- Test contrast buttons (High/Low)
- Test cursor size buttons
- Test reset button
- Press **Escape** to close

**Pass Criteria:**
- ✅ All controls keyboard accessible
- ✅ Sliders work with arrow keys
- ✅ Buttons activate with Enter/Space
- ✅ Escape closes toolbar
- ✅ Focus returns to trigger button

---

### **5. Search Functionality**

**Steps:**
1. Tab to search input
2. Type search query
3. Tab to search button
4. Press **Enter**

**Pass Criteria:**
- ✅ Search input has visible focus
- ✅ Can type with keyboard
- ✅ Search button activates with Enter
- ✅ Results are keyboard navigable

---

### **6. Forms** ⚠️ (HIGH PRIORITY)

**Test Pages:**
- Contact Us form (`/contact-us`)
- Research Vessel Booking (`/research-vessel-booking`)
- Lab Results Portal (`/lab-results`)
- Fish Advisory System (`/fish-advisory-system`)

**Steps for Each Form:**
1. Tab through all form fields in order
2. Test each input type:
   - Text inputs
   - Textareas
   - Select dropdowns
   - Checkboxes
   - Radio buttons
   - Date pickers
   - File uploads

**Pass Criteria:**
- ✅ All fields have visible focus
- ✅ Labels are associated (click label focuses input)
- ✅ Required fields are indicated
- ✅ Dropdowns open with Arrow keys
- ✅ Checkboxes toggle with Space
- ✅ Radio buttons select with Arrow keys
- ✅ Error messages are keyboard accessible
- ✅ Submit button activates with Enter

---

### **7. Modals & Dialogs**

**Test Scenarios:**
- Cookie consent popup
- Login modals
- Confirmation dialogs
- Image lightboxes

**Steps:**
1. Trigger modal (via keyboard)
2. **Expected:** Focus moves into modal
3. Tab through all modal controls
4. Press **Escape**

**Pass Criteria:**
- ✅ Focus trapped within modal (can't tab outside)
- ✅ All buttons in modal are keyboard accessible
- ✅ Escape closes modal
- ✅ Focus returns to trigger element
- ✅ No keyboard trap

---

### **8. Data Tables**

**Test Pages:**
- Admin dashboards
- Lab results
- Research data tables

**Steps:**
1. Tab to table
2. Navigate through table cells
3. Test sorting (if applicable)
4. Test pagination

**Pass Criteria:**
- ✅ Table is keyboard navigable
- ✅ Headers have visible focus
- ✅ Sort buttons work with Enter/Space
- ✅ Pagination controls accessible

---

### **9. Carousels & Sliders**

**Test Pages:**
- Homepage hero carousel
- Media gallery
- Image sliders

**Steps:**
1. Tab to carousel controls
2. Press **Arrow Left/Right** to navigate
3. Test pause button

**Pass Criteria:**
- ✅ Previous/Next buttons keyboard accessible
- ✅ Arrow keys work
- ✅ Pause button accessible
- ✅ Indicator dots are keyboard accessible
- ✅ Auto-play can be paused

---

### **10. Open Data Portal** (NEW)

**URL:** `/open-data-portal`

**Steps:**
1. Navigate to Open Data Portal
2. Tab to search input
3. Tab to category filter dropdown
4. Tab through dataset cards
5. Test download buttons

**Pass Criteria:**
- ✅ Search input accessible
- ✅ Category dropdown works with keyboard
- ✅ All dataset cards are keyboard accessible
- ✅ Download buttons (CSV/JSON) work with Enter
- ✅ External links have focus indicator

---

### **11. Administrative Panels**

**Test Pages:**
- `/admin/login`
- `/admin/dashboard`
- `/admin/content`

**Steps:**
1. Tab through login form
2. Login via keyboard
3. Tab through admin navigation
4. Test all admin controls

**Pass Criteria:**
- ✅ Login form fully keyboard accessible
- ✅ Admin navigation keyboard navigable
- ✅ Data grids/tables accessible
- ✅ Create/Edit/Delete buttons work
- ✅ File uploads keyboard accessible

---

### **12. Cookie Consent**

**Steps:**
1. Load site for first time (clear cookies)
2. **Expected:** Cookie consent appears
3. Tab through all buttons
4. Test "Customize" button
5. Test "Accept All" and "Essential Only"

**Pass Criteria:**
- ✅ Focus moves to cookie banner
- ✅ All buttons keyboard accessible
- ✅ Customize expands details
- ✅ Accept buttons work with Enter
- ✅ Privacy policy link accessible

---

## 🚨 **COMMON KEYBOARD TRAPS TO CHECK**

### **Keyboard Trap:** User cannot navigate away from element

**Check These:**
1. **Modals** - Can you escape with Tab or Escape key?
2. **Dropdowns** - Can you close with Escape?
3. **Infinite Loops** - Does Tab eventually reach all elements?
4. **Embedded iframes** - Can you tab out?
5. **Custom widgets** - Can you navigate in/out?

**If Trap Found:**
- Document the page URL
- Note which element causes trap
- Record steps to reproduce
- Mark as **CRITICAL** bug

---

## 📊 **SCORING & REPORTING**

### **Scoring System**

| Result | Score | Action |
|--------|-------|--------|
| **Pass** | ✅ 100% | No action needed |
| **Minor Issue** | ⚠️ 70-99% | Fix before next release |
| **Major Issue** | ❌ 50-69% | Fix before production |
| **Critical** | 🔴 < 50% | BLOCK deployment |

### **Issue Severity**

| Severity | Description | Example |
|----------|-------------|---------|
| **Critical** | Blocks core functionality | Keyboard trap, no focus indicator |
| **High** | Impairs major feature | Form submit not accessible |
| **Medium** | Minor inconvenience | Illogical tab order |
| **Low** | Cosmetic issue | Focus outline slightly off |

---

## 📝 **TEST REPORT TEMPLATE**

```markdown
# Keyboard Navigation Test Report

**Date:** YYYY-MM-DD
**Tester:** [Your Name]
**Browser:** Chrome/Firefox/Safari [Version]
**OS:** macOS/Windows/Linux

## Summary
- Total Tests: __
- Passed: __
- Failed: __
- Overall Score: __%

## Critical Issues
1. [Page URL] - [Description] - [Steps to reproduce]
2. ...

## High Priority Issues
1. [Page URL] - [Description]
2. ...

## Medium/Low Priority Issues
1. [Page URL] - [Description]
2. ...

## Recommendations
- [Improvement suggestion]
- [Improvement suggestion]

## Sign-off
☐ Approved for Production
☐ Requires Fixes (see above)

**Tester Signature:** ___________________
**Date:** ___________________
```

---

## 🎓 **TESTING TIPS**

### **Before Testing**
1. ✅ Disconnect mouse completely (or hide it offscreen)
2. ✅ Clear browser cache and cookies
3. ✅ Test in multiple browsers (Chrome, Firefox, Safari)
4. ✅ Test on different screen sizes

### **During Testing**
1. ✅ Use **Tab** exclusively (don't click!)
2. ✅ Watch for focus indicator (cyan 3px outline)
3. ✅ Note tab order (should be logical top-to-bottom, left-to-right)
4. ✅ Test all interactive elements
5. ✅ Take screenshots of issues

### **After Testing**
1. ✅ Document all issues with screenshots
2. ✅ Prioritize by severity
3. ✅ Create bug tickets
4. ✅ Re-test after fixes

---

## 🔧 **DEVELOPER DEBUG MODE**

### **Quick Visual Test**

Add this to browser console to highlight all focusable elements:

```javascript
// Highlight all focusable elements
document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').forEach(el => {
  el.style.outline = '3px solid red';
});

// Show tab order
let tabIndex = 1;
document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
  el.setAttribute('data-tab-order', tabIndex++);
  el.style.position = 'relative';
  const badge = document.createElement('span');
  badge.textContent = tabIndex - 1;
  badge.style.cssText = 'position:absolute;top:-10px;right:-10px;background:red;color:white;padding:2px 6px;border-radius:50%;font-size:12px;z-index:9999;';
  el.appendChild(badge);
});
```

---

## ✅ **QUICK CHECKLIST**

Print this and check off during testing:

- [ ] Skip link works
- [ ] All nav links keyboard accessible
- [ ] Language switcher works
- [ ] Accessibility toolbar fully accessible
- [ ] Search function works via keyboard
- [ ] All forms fully navigable
- [ ] Modals trap focus (good trap!)
- [ ] Modals close with Escape
- [ ] No keyboard traps (bad traps!)
- [ ] Tables are keyboard navigable
- [ ] Carousels/sliders keyboard accessible
- [ ] Open Data Portal fully accessible
- [ ] Admin panels keyboard navigable
- [ ] Cookie consent keyboard accessible
- [ ] All buttons activate with Enter/Space
- [ ] All dropdowns work with arrow keys
- [ ] Focus indicators always visible (3px cyan)
- [ ] Tab order is logical
- [ ] No elements unreachable via keyboard

---

## 📅 **TESTING SCHEDULE**

**Initial Test:** [Date TBD]  
**Re-test After Fixes:** [Date TBD]  
**Final Sign-off:** [Date TBD]  

**Next Review:** Quarterly (every 3 months)

---

## 📞 **SUPPORT**

**Questions:** accessibility@nara.ac.lk  
**Bug Reports:** Use issue tracking system  
**Documentation:** See WCAG_22_AA_CHECKLIST.md

---

**Remember:** The keyboard is the primary navigation method for many users with disabilities. If it doesn't work with keyboard, it's not accessible! 🎯
