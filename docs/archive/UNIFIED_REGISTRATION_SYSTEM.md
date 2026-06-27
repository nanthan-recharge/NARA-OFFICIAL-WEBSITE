# 🎯 NARA Unified Registration System

## Overview

The Unified Registration System provides **one account for all NARA digital services**, eliminating the need for multiple registrations across different departments.

---

## 🌟 Features

### Multi-Service Registration
Users can select which NARA services they want to access:
- **Library System** - Borrow books, submit research, access digital resources
- **E-commerce/Book Sales** - Purchase NARA publications and merchandise
- **Image & Media Sales** - Buy high-quality marine research images
- **Data Products** - Access datasets, GIS data, and research databases

### Single Sign-On
- One account works across all selected services
- Unified profile management
- Centralized authentication

### Service-Specific Roles
For Library System, users can choose:
- **Student** - Borrow up to 5 books, 14-day loan period
- **Researcher** - Borrow up to 10 books, submit research papers
- **Public Member** - Borrow up to 3 books, 7-day loan period

---

## 📍 URLs

### New Unified Registration
```
https://nara-web-73384.web.app/register
```
**Main registration page** - Users select services and create one account

### Legacy Library Registration (Still Available)
```
https://nara-web-73384.web.app/library-register
```
**Library-only registration** - Direct registration for library services only

---

## 🎨 User Flow

### Step 1: Service Selection
1. User visits `/register`
2. Sees all available NARA services
3. Selects one or more services (e.g., Library + E-commerce)
4. Clicks "Continue to Account Details"

### Step 2: Account Creation
1. Fills in personal information:
   - First Name, Last Name
   - Email, Password
   - Phone Number (optional)
   - Organization/Institution (optional)
2. Agrees to Terms & Privacy Policy
3. Clicks "Create NARA Account"

### Step 3: Access Services
- Account is created with access to selected services
- User is redirected to primary service dashboard
- Can access other services from unified profile

---

## 🔧 Integration with Existing Systems

### Library System
- Unified accounts automatically get library access if selected
- Role selection happens during service selection
- Existing `LibraryUserContext` handles authentication
- Data stored in `libraryUsers` collection with service flags

### E-commerce System
- Users with e-commerce access can purchase products
- Shopping cart and order history linked to unified account
- Payment gateway integration maintained

### Image Sales
- Access to image marketplace
- Purchase history and licenses tracked
- Download management

### Data Products
- API access credentials
- Dataset download permissions
- Usage tracking

---

## 💾 Data Structure

### Firestore: `users` Collection
```javascript
{
  uid: "user-firebase-uid",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+94771234567",
  organization: "University of Colombo",
  services: ["library", "ecommerce", "images"], // Selected services
  accountType: "unified",
  registeredAt: "2024-10-16T10:00:00Z",
  
  // Service-specific data
  libraryProfile: {
    role: "researcher",
    institution: "University of Colombo",
    researchArea: "Marine Biology"
  },
  
  ecommerceProfile: {
    shippingAddress: {...},
    billingAddress: {...}
  }
}
```

---

## 🚀 Adding to Navigation

### Option 1: Add to Main Header
In `ProfessionalHeader.jsx`:

```jsx
<Link to="/register" className="...">
  <Button variant="primary">
    <UserPlus className="w-4 h-4" />
    Register
  </Button>
</Link>
```

### Option 2: Add to Library Dropdown
```jsx
{
  name: 'Register for Library',
  path: '/register?service=library',
  icon: 'UserPlus',
  description: 'Create your NARA account'
}
```

### Option 3: Replace Existing Registration Links
Update all existing registration links to point to `/register` instead of `/library-register`

---

## 📊 Migration Strategy

### Phase 1: Soft Launch (Current)
- ✅ Unified registration available at `/register`
- ✅ Legacy library registration still works at `/library-register`
- Both systems run in parallel

### Phase 2: Navigation Update
- Add "Register" button to main navigation
- Update library links to use unified registration
- Add service pre-selection via URL params (e.g., `/register?service=library`)

### Phase 3: Full Migration
- Redirect `/library-register` to `/register?service=library`
- Merge existing library-only users into unified system
- Deprecate separate registration pages

---

## 🎯 URL Parameters

### Pre-select Services
```
/register?service=library
/register?service=ecommerce
/register?services=library,ecommerce
```

### Pre-fill Role (for library)
```
/register?service=library&role=researcher
```

---

## 🔐 Authentication Flow

### Registration
1. User completes unified registration
2. Firebase Authentication creates account
3. User profile created in Firestore with service flags
4. Service-specific profiles initialized
5. User redirected to primary service dashboard

### Login
1. User logs in via `/login` (unified) or `/library-login` (legacy)
2. System checks user's service access
3. Redirects to appropriate dashboard
4. All services accessible from profile menu

---

## 📱 Mobile Responsive
- Two-column grid on desktop
- Single column on mobile
- Touch-friendly service cards
- Optimized form inputs

---

## ✅ Testing Checklist

### Registration Flow
- [ ] Can select multiple services
- [ ] Can deselect services
- [ ] Form validation works
- [ ] Password confirmation works
- [ ] Google OAuth works
- [ ] Email verification sent
- [ ] User created in Firestore
- [ ] Redirects to correct dashboard

### Service Access
- [ ] Library access works if selected
- [ ] E-commerce access works if selected
- [ ] Image sales access works if selected
- [ ] Data products access works if selected

### Navigation
- [ ] Registration link in header
- [ ] Registration link in library dropdown
- [ ] Direct URLs work
- [ ] URL parameters work

---

## 🎨 Customization

### Add New Service
1. Add service object to `services` array in `UnifiedRegistration.jsx`:
```javascript
{
  id: 'new-service',
  icon: Icons.ServiceIcon,
  title: 'New Service',
  description: 'Service description',
  features: ['Feature 1', 'Feature 2'],
  color: 'from-color-500 to-color-600'
}
```

2. Update user profile structure to include service-specific data

3. Update authentication logic to handle new service

### Customize Styling
- Colors: Update gradient classes in service cards
- Icons: Change Lucide icons in service definitions
- Layout: Modify grid columns in service selection

---

## 📞 Support

### For Users
- Registration help: library@nara.gov.lk
- Technical support: support@nara.gov.lk

### For Developers
- See: `src/pages/unified-registration/index.jsx`
- Context: `src/contexts/FirebaseAuthContext.jsx`
- Routes: `src/Routes.jsx`

---

## 🎉 Benefits

### For Users
✅ **One account** for all NARA services  
✅ **Single login** across departments  
✅ **Unified profile** management  
✅ **Easy service addition** - add services anytime  

### For NARA
✅ **Reduced duplicate accounts**  
✅ **Better user tracking** across services  
✅ **Simplified authentication**  
✅ **Centralized user management**  

---

## 🚀 Next Steps

1. **Test the unified registration**: Visit https://nara-web-73384.web.app/register
2. **Update navigation**: Add registration link to header
3. **Update existing links**: Point to unified registration
4. **Deploy**: Build and deploy changes
5. **Monitor**: Track registration analytics

---

## 📝 Notes

- Legacy library registration (`/library-register`) remains functional
- Existing library users are not affected
- New users should use unified registration
- Migration of existing users can be done gradually
- All authentication methods (Email, Google) supported

---

**Created**: October 16, 2024  
**Status**: Ready for deployment  
**Version**: 1.0
