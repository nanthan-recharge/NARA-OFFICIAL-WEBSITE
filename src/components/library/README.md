# Library Security Components

Authentication and authorization components for the NARA library system.

## Components

### ProtectedRoute
Route-level security for protecting entire pages.

```jsx
import { ProtectedRoute } from './components/library';

<ProtectedRoute requiredRole="researcher">
  <ResearchPage />
</ProtectedRoute>
```

### RoleGuard
Component-level security for conditional UI rendering.

```jsx
import { RoleGuard } from './components/library';

<RoleGuard allowedRoles={['researcher']}>
  <SubmitButton />
</RoleGuard>
```

## Documentation

See [LIBRARY_SECURITY_COMPONENTS.md](../../LIBRARY_SECURITY_COMPONENTS.md) for full documentation.

## Quick Import

```jsx
// Import both components
import { ProtectedRoute, RoleGuard } from './components/library';
```
