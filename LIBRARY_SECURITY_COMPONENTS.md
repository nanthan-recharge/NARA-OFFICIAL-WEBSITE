# Library Security Components Guide

## Overview

Two powerful components for implementing role-based access control (RBAC) and permission-based security in the NARA library system.

## Components

### 1. ProtectedRoute (Route-Level Security)
### 2. RoleGuard (Component-Level Security)

---

## 🛡️ ProtectedRoute Component

**Purpose**: Protect entire routes/pages based on authentication, roles, and permissions.

**Location**: `src/components/library/ProtectedRoute.jsx`

### Features

✅ **Authentication Check** - Redirects unauthenticated users to login  
✅ **Loading State** - Shows spinner while checking auth status  
✅ **Role Verification** - Restricts access by user role  
✅ **Permission Verification** - Restricts access by user permissions  
✅ **User-Friendly Error Pages** - Beautiful error screens with helpful actions  
✅ **Preserves Location** - Remembers where user wanted to go after login  
✅ **Email Verification** - Optional email verification enforcement (commented out)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | React.Node | - | Protected content/component |
| `requiredRole` | string \| string[] | null | Role(s) required to access |
| `requiredPermission` | string | null | Permission required to access |
| `fallbackPath` | string | '/library-login' | Where to redirect unauthorized users |

### Usage Examples

#### 1. Basic Authentication (Any Logged-In User)

```jsx
import { ProtectedRoute } from '../../components/library';

// In Routes.jsx
<Route 
  path="/library-dashboard" 
  element={
    <ProtectedRoute>
      <LibraryDashboard />
    </ProtectedRoute>
  } 
/>
```

#### 2. Role-Based Protection (Single Role)

```jsx
// Researcher-only page
<Route 
  path="/submit-research" 
  element={
    <ProtectedRoute requiredRole="researcher">
      <ResearchSubmission />
    </ProtectedRoute>
  } 
/>
```

#### 3. Role-Based Protection (Multiple Roles)

```jsx
// Accessible by researchers OR students
<Route 
  path="/advanced-search" 
  element={
    <ProtectedRoute requiredRole={['researcher', 'student']}>
      <AdvancedSearch />
    </ProtectedRoute>
  } 
/>
```

#### 4. Permission-Based Protection

```jsx
// Requires specific permission
<Route 
  path="/premium-resources" 
  element={
    <ProtectedRoute requiredPermission="canAccessPremium">
      <PremiumResources />
    </ProtectedRoute>
  } 
/>
```

#### 5. Custom Fallback Path

```jsx
// Redirect to different page instead of login
<Route 
  path="/admin-panel" 
  element={
    <ProtectedRoute 
      requiredRole="admin"
      fallbackPath="/library"
    >
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

### Error States

**1. Not Authenticated**
- Redirects to `/library-login`
- Preserves original destination for post-login redirect

**2. Profile Not Found**
- Shows error message with "Sign In Again" button
- Handles cases where Firestore profile fails to load

**3. Role Access Denied**
- Beautiful error page with shield icon
- Shows which role is required
- Provides links to dashboard and catalogue

**4. Permission Denied**
- Shows lock icon with helpful message
- Links to dashboard and contact support
- Suggests account upgrade

**5. Email Not Verified (Optional)**
- Currently commented out
- Uncomment in code to enforce email verification

---

## 🔒 RoleGuard Component

**Purpose**: Conditionally render UI elements based on roles/permissions.

**Location**: `src/components/library/RoleGuard.jsx`

### Features

✅ **Lightweight** - No page redirects, just shows/hides content  
✅ **Role-Based** - Show content for specific roles  
✅ **Permission-Based** - Show content for specific permissions  
✅ **Flexible Fallback** - Show alternative content when unauthorized  
✅ **Optional Messages** - Display helpful messages when access denied  
✅ **OR Logic** - User needs ANY allowed role OR permission (not both)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | React.Node | - | Content to show if authorized |
| `allowedRoles` | string[] | [] | Array of allowed roles (OR logic) |
| `allowedPermissions` | string[] | [] | Array of allowed permissions (OR logic) |
| `fallback` | React.Node | null | Content to show if not authorized |
| `showMessage` | boolean | false | Show "not available" message if denied |

### Usage Examples

#### 1. Hide Content for Unauthorized Users

```jsx
import { RoleGuard } from '../../components/library';

function LibraryDashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Only researchers see this button */}
      <RoleGuard allowedRoles={['researcher']}>
        <button>Submit Research Paper</button>
      </RoleGuard>
    </div>
  );
}
```

#### 2. Show Alternative Content

```jsx
<RoleGuard 
  allowedRoles={['researcher', 'student']}
  fallback={
    <p className="text-slate-600">
      Upgrade to student or researcher account to access this feature.
    </p>
  }
>
  <AdvancedSearchForm />
</RoleGuard>
```

#### 3. Permission-Based Rendering

```jsx
<RoleGuard allowedPermissions={['canSubmitResearch']}>
  <ResearchSubmissionButton />
</RoleGuard>
```

#### 4. Show Message When Denied

```jsx
<RoleGuard 
  allowedRoles={['researcher']}
  showMessage={true}
>
  <PremiumFeaturePanel />
</RoleGuard>

// When unauthorized, shows:
// "This feature is not available for your account type."
```

#### 5. Complex Authorization (Multiple Roles + Permissions)

```jsx
// Show if user is researcher OR has premium access permission
<RoleGuard 
  allowedRoles={['researcher']}
  allowedPermissions={['canAccessPremium']}
>
  <PremiumContentSection />
</RoleGuard>
```

#### 6. Navigation Menu Items

```jsx
function LibraryNav() {
  return (
    <nav>
      <a href="/library">Catalogue</a>
      <a href="/library-dashboard">Dashboard</a>
      
      {/* Only show for researchers */}
      <RoleGuard allowedRoles={['researcher']}>
        <a href="/submit-research">Submit Research</a>
      </RoleGuard>
      
      {/* Only show for students */}
      <RoleGuard allowedRoles={['student']}>
        <a href="/student-resources">Student Resources</a>
      </RoleGuard>
      
      {/* Show for anyone with borrow permission */}
      <RoleGuard allowedPermissions={['canBorrow']}>
        <a href="/my-loans">My Loans</a>
      </RoleGuard>
    </nav>
  );
}
```

#### 7. Feature Toggles in Forms

```jsx
function BookDetailPage() {
  return (
    <div>
      <h1>Book Title</h1>
      <p>Description...</p>
      
      {/* All authenticated users see basic actions */}
      <button>Add to Wishlist</button>
      
      {/* Only users with borrow permission */}
      <RoleGuard allowedPermissions={['canBorrow']}>
        <button>Borrow This Book</button>
      </RoleGuard>
      
      {/* Only researchers */}
      <RoleGuard allowedRoles={['researcher']}>
        <button>Request Extended Loan</button>
      </RoleGuard>
    </div>
  );
}
```

---

## 🎯 When to Use Each Component

### Use ProtectedRoute When:
- ✅ Protecting entire pages/routes
- ✅ Need to redirect unauthorized users
- ✅ Want full-screen error messages
- ✅ Implementing admin panels
- ✅ Protecting dashboard pages
- ✅ Need authentication check before rendering anything

### Use RoleGuard When:
- ✅ Conditionally showing UI elements
- ✅ Hiding/showing buttons, sections, or features
- ✅ Building navigation menus with role-based items
- ✅ Inline feature toggles
- ✅ Want to show alternative content
- ✅ Don't need page redirects

---

## 📋 Complete Integration Example

```jsx
// Routes.jsx
import { ProtectedRoute } from './components/library';

function Routes() {
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/library" element={<LibraryCatalogue />} />
      <Route path="/library-register" element={<LibraryRegister />} />
      <Route path="/library-login" element={<LibraryLogin />} />
      
      {/* Protected: Any authenticated user */}
      <Route 
        path="/library-dashboard" 
        element={
          <ProtectedRoute>
            <LibraryDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected: Researchers only */}
      <Route 
        path="/submit-research" 
        element={
          <ProtectedRoute requiredRole="researcher">
            <ResearchSubmission />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected: Students OR Researchers */}
      <Route 
        path="/advanced-resources" 
        element={
          <ProtectedRoute requiredRole={['student', 'researcher']}>
            <AdvancedResources />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected: Specific permission */}
      <Route 
        path="/premium-content" 
        element={
          <ProtectedRoute requiredPermission="canAccessPremium">
            <PremiumContent />
          </ProtectedRoute>
        } 
      />
    </RouterRoutes>
  );
}
```

```jsx
// LibraryDashboard.jsx
import { RoleGuard } from '../components/library';

function LibraryDashboard() {
  const { userProfile } = useLibraryUser();
  
  return (
    <div className="dashboard">
      <h1>Welcome, {userProfile.profile.firstName}!</h1>
      
      {/* Everyone sees this */}
      <section>
        <h2>My Active Loans</h2>
        <LoansList />
      </section>
      
      {/* Only users who can borrow */}
      <RoleGuard allowedPermissions={['canBorrow']}>
        <section>
          <h2>Browse & Borrow</h2>
          <BrowseBooks />
        </section>
      </RoleGuard>
      
      {/* Only researchers */}
      <RoleGuard allowedRoles={['researcher']}>
        <section>
          <h2>My Research Papers</h2>
          <ResearchPapersList />
          <button>Submit New Paper</button>
        </section>
      </RoleGuard>
      
      {/* Only students */}
      <RoleGuard allowedRoles={['student']}>
        <section>
          <h2>Student Resources</h2>
          <StudentResourcesList />
        </section>
      </RoleGuard>
      
      {/* Multiple roles with fallback */}
      <RoleGuard 
        allowedRoles={['researcher', 'student']}
        fallback={
          <div className="upgrade-prompt">
            <p>Upgrade to access advanced features</p>
            <button>Learn More</button>
          </div>
        }
      >
        <section>
          <h2>Advanced Search</h2>
          <AdvancedSearchTool />
        </section>
      </RoleGuard>
    </div>
  );
}
```

---

## 🔐 Available Roles

| Role | Description | Max Loans | Period |
|------|-------------|-----------|--------|
| `researcher` | Academic researchers | 10 | 30 days |
| `student` | Students | 5 | 14 days |
| `public` | General public | 3 | 7 days |

## 🎫 Available Permissions

Based on role, users get these permissions:

| Permission | Description | Roles |
|------------|-------------|-------|
| `canBorrow` | Can borrow books | All |
| `canSubmitResearch` | Can submit research papers | researcher |
| `canAccessPremium` | Access premium resources | researcher |
| `maxLoans` | Maximum concurrent loans | Role-based |
| `loanPeriodDays` | Loan duration | Role-based |

## 🧪 Testing Checklist

### ProtectedRoute Tests
- [ ] Unauthenticated user redirects to login
- [ ] Authenticated user with correct role sees content
- [ ] Authenticated user with wrong role sees error page
- [ ] Loading state appears during auth check
- [ ] Profile not found shows appropriate error
- [ ] Multiple roles work with OR logic
- [ ] Permission check works correctly
- [ ] Custom fallback path works

### RoleGuard Tests
- [ ] Content hidden for unauthorized users
- [ ] Content shown for authorized users
- [ ] Fallback content displays when unauthorized
- [ ] showMessage prop displays warning
- [ ] Multiple roles work with OR logic
- [ ] Multiple permissions work with OR logic
- [ ] No profile returns null/fallback

## 🚀 Best Practices

### 1. Use Both Components Together
```jsx
// Protect the route
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// Then inside Dashboard, conditionally show features
function Dashboard() {
  return (
    <div>
      <RoleGuard allowedRoles={['researcher']}>
        <ResearcherFeatures />
      </RoleGuard>
    </div>
  );
}
```

### 2. Graceful Degradation
Show alternatives instead of hiding completely:
```jsx
<RoleGuard 
  allowedRoles={['researcher']}
  fallback={<BasicSearchForm />}
>
  <AdvancedSearchForm />
</RoleGuard>
```

### 3. Clear User Communication
```jsx
<RoleGuard 
  allowedRoles={['researcher']}
  showMessage={true}
>
  <PremiumFeature />
</RoleGuard>
```

### 4. Combine with Context
```jsx
const { userProfile, hasRole, hasPermission } = useLibraryUser();

// Use directly for logic
if (hasPermission('canBorrow')) {
  // Do something
}

// Use RoleGuard for rendering
<RoleGuard allowedPermissions={['canBorrow']}>
  <BorrowButton />
</RoleGuard>
```

## 🛠️ Troubleshooting

### Issue: Component always shows loading
**Solution**: Check LibraryUserProvider is wrapping your app in Routes.jsx

### Issue: hasRole/hasPermission not working
**Solution**: Verify userProfile exists and has correct structure in Firestore

### Issue: Redirect loops
**Solution**: Don't use ProtectedRoute on login/register pages

### Issue: RoleGuard shows nothing
**Solution**: Check userProfile is loaded. Add fallback for better UX.

---

## 📚 Related Documentation

- [LibraryUserContext API](./LIBRARY_REGISTRATION_SETUP.md)
- [Authentication Flow](./LIBRARY_REGISTRATION_SETUP.md#user-flow)
- [Firestore Schema](./LIBRARY_REGISTRATION_SETUP.md#firestore-schema)

---

**Security Components Ready!** 🎉

Use these components to build a secure, role-based library management system with excellent user experience.
