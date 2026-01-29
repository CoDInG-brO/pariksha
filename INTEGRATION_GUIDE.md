# Online Exam Module - Integration Guide

## Overview
This module is designed to be embedded within the **iyotaprep-ux** parent application as a standalone "Online Exam" section for students. It uses Keycloak authentication managed by the parent app.

---

## Architecture

### Parent Application (iyotaprep-ux)
- **Framework**: Next.js with TypeScript
- **Authentication**: Keycloak (handled at parent level)
- **Layout**: DashboardLayout with Sidebar + Header
- **Permissions**: Role-based access control (RBAC) with feature flags

### Online Exam Module (mockexam-ai-ui)
- **Type**: Embedded content module
- **Rendering**: Content views only (no internal nav/sidebar)
- **Styling**: Tailwind utility classes, light/dark mode support
- **Layout**: Top-aligned, compact, productivity-focused

---

## Permission Model

### Required Permissions
Students accessing Online Exam features must have **BOTH**:
- `role:student` - Student role
- `feat:online-exam` - Online exam feature flag

### Permission Check Implementation
**File**: `iyotaprep-ux/lib/permissions.ts`

```typescript
/**
 * Check if user has ALL of the required permissions.
 * For Online Exam access, user must have BOTH role:student AND feat:online-exam.
 */
export function hasPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    if (requiredPermissions.length === 0) {
        return true;
    }
    // Changed from .some() to .every() to require ALL permissions
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
}
```

---

## Navigation Structure

### Parent Sidebar Menu
```
├── Main
│   └── Dashboard (Common for all users)
│
├── Online Exam (Students only - requires role:student + feat:online-exam)
│   ├── Student Dashboard
│   ├── Practice Mode
│   ├── Mock Tests
│   ├── Analytics
│   └── Licenses
│
├── Question Bank (Admin/SME/Operator)
├── Papers (Admin/SME)
└── Administration (Admin only)
```

### Excluded from Student View
- ❌ Settings
- ❌ Profile Picture/Edit
- ❌ User Management
- ❌ Question Management

---

## Route Mapping

### Parent Routes (iyotaprep-ux)
The parent app defines these routes in the sidebar menu:

| Menu Item | Route | Permissions |
|-----------|-------|-------------|
| Student Dashboard | `/student/dashboard` | `role:student`, `feat:online-exam` |
| Practice Mode | `/student/practice` | `role:student`, `feat:online-exam` |
| Mock Tests | `/student/mock-tests` | `role:student`, `feat:online-exam` |
| Analytics | `/student/analytics` | `role:student`, `feat:online-exam` |
| Licenses | `/student/licenses` | `role:student`, `feat:online-exam` |

### Module File Structure
```
mockexam-ai-ui/app/
├── dashboard/page.tsx → Renders student dashboard
├── practice/page.tsx → Renders practice mode
├── mock-tests/page.tsx → Renders mock test selection
├── analytics/page.tsx → Renders analytics dashboard
├── licenses/page.tsx → Renders license management
├── jee/ → JEE-specific pages (full-mock, section-wise)
└── neet/ → NEET-specific pages (full-mock, subject-wise)
```

---

## Layout Integration

### Parent Layout (iyotaprep-ux)
**File**: `iyotaprep-ux/app/student/layout.tsx`

```tsx
'use client';
import DashboardLayout from '@/components/DashboardLayout';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
```

### Module Layout (mockexam-ai-ui)
**File**: `mockexam-ai-ui/app/layout.tsx`

```tsx
// REMOVED: <Navbar /> and <Sidebar /> components
// Parent handles all navigation

function RootLayoutContent({ children }: { children: React.NodeNode }) {
  const pathname = usePathname();
  const isExamPage = pathname.includes("/jee/full-mock") || pathname.includes("/neet/full-mock");
  
  return (
    <main className={isExamPage ? 'px-4 max-w-7xl mx-auto' : ''}>
      <div className={isExamPage ? 'pt-4' : ''}>
        {children}
      </div>
    </main>
  );
}
```

**Key Changes:**
- ✅ Removed internal `Navbar` and `Sidebar` components
- ✅ No `pl-[220px]` offset (parent handles spacing)
- ✅ Content-only rendering
- ✅ Special handling for full-screen exam pages

---

## Styling Guidelines

### Tailwind-Only Approach
- ✅ All styling via Tailwind utility classes
- ✅ No global CSS (only `@tailwind` directives in globals.css)
- ✅ Light/dark mode via `dark:` variants
- ❌ No custom CSS variables (except Tailwind config)
- ❌ No inline styles (except for dynamic values)

### Design Principles
1. **Top-aligned content** - No vertical centering or hero sections
2. **Compact headers** - Small font sizes (text-base, text-xs)
3. **Minimal padding** - pt-2/pt-3 instead of pt-6/pt-8
4. **Inline back buttons** - Within page headers, not separate
5. **SaaS aesthetic** - Clean, slender, productivity-focused

### Example Pattern
```tsx
// ✅ Good - Top-aligned, compact
<div className="pt-2 pb-6 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center gap-2 mb-3">
      <button onClick={() => router.back()} className="text-lg">←</button>
      <h1 className="text-base font-semibold">Page Title</h1>
    </div>
    {/* Content */}
  </div>
</div>

// ❌ Bad - Centered, hero-style
<div className="min-h-screen flex items-center justify-center">
  <div className="text-center">
    <h1 className="text-4xl mb-8">Page Title</h1>
    {/* Content */}
  </div>
</div>
```

---

## Authentication Flow

### Parent Responsibility
1. Keycloak login/logout
2. Token management
3. User profile data
4. Permission extraction

### Module Responsibility
- ❌ NO authentication logic
- ❌ NO login/signup pages (deferred to parent)
- ✅ Assumes authenticated user context
- ✅ Focuses on exam content delivery

### Auth Context (if needed)
If the module needs user data, it should access it from the parent's AuthContext:

```tsx
import { useAuth } from '@/context/AuthContext'; // Parent context

function MyComponent() {
  const { user, permissions } = useAuth();
  // user.name, user.email, etc.
}
```

---

## Component Patterns

### Page Header Pattern
```tsx
<div className="flex items-center gap-2 mb-3">
  <button
    onClick={() => router.back()}
    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-lg"
  >
    ←
  </button>
  <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">
    Page Title
  </h1>
</div>
```

### Card Pattern
```tsx
<div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
  {/* Card content */}
</div>
```

### Button Pattern
```tsx
<button className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all">
  Action
</button>
```

---

## Deployment Checklist

### Pre-Integration
- [x] Remove internal Navbar/Sidebar from module
- [x] Update permissions.ts to require ALL permissions
- [x] Ensure all routes match parent structure
- [x] Convert all pages to top-aligned layout
- [x] Remove global CSS (keep only Tailwind)

### Integration Steps
1. **Mount module routes** in parent under `/student/*`
2. **Apply DashboardLayout** wrapper to student routes
3. **Configure Keycloak** with `feat:online-exam` permission
4. **Assign permissions** to student users
5. **Test navigation** flow: Dashboard → Student Dashboard → Features

### Post-Integration Testing
- [ ] Verify permission checks (must have BOTH role + feature)
- [ ] Test all menu items appear only for authorized students
- [ ] Confirm no duplicate nav elements (sidebar/navbar)
- [ ] Validate light/dark mode across all pages
- [ ] Check responsive layouts on mobile/tablet/desktop
- [ ] Verify back buttons navigate correctly
- [ ] Test exam flow (practice → mock → analytics)

---

## Common Issues & Solutions

### Issue: Sidebar appears twice
**Solution**: Ensure mockexam-ai-ui layout.tsx does NOT render Navbar/Sidebar

### Issue: Permission check fails even with correct role
**Solution**: Verify user has BOTH `role:student` AND `feat:online-exam` permissions. Check that `hasPermission()` uses `.every()` not `.some()`.

### Issue: Routes return 404
**Solution**: Ensure parent app mounts module routes under `/student/*` path

### Issue: Styling conflicts
**Solution**: Use only Tailwind utilities, remove any conflicting global CSS or custom variables

### Issue: Vertical centering on pages
**Solution**: Remove `min-h-screen`, `items-center`, `justify-center` classes. Use `pt-2` instead.

---

## File Changes Summary

### Modified Files

#### iyotaprep-ux (Parent)
- `lib/permissions.ts` - Changed `hasPermission()` from `.some()` to `.every()`

#### mockexam-ai-ui (Module)
- `app/layout.tsx` - Removed `<Navbar />` and `<Sidebar />`
- `app/mock-tests/page.tsx` - Made header compact and left-aligned
- `app/analytics/page.tsx` - Made header compact and left-aligned
- `app/licenses/page.tsx` - Made header compact with inline back button
- `app/dashboard/page.tsx` - Already compact, no changes needed
- `app/practice/page.tsx` - Already compact, no changes needed

### Unchanged (Working As Expected)
- Full-mock pages (JEE/NEET) - Already compact with proper styling
- Section-wise pages - Already compact with proper styling
- Authentication providers - Deferred to parent
- Question banks and test storage - Internal module logic

---

## Support & Maintenance

### Key Contacts
- **Parent App**: iyotaprep-ux team
- **Module**: Online Exam module team

### Documentation
- Parent API: Check iyotaprep-ux README
- Keycloak Setup: Refer to parent auth documentation
- Module Internals: See mockexam-ai-ui README

---

**Last Updated**: January 29, 2026
**Version**: 1.0.0
**Status**: ✅ Integration Complete
