# Component Naming Convention

## Nuxt Auto-Import Component Names

Nuxt automatically imports components and flattens the directory structure. This document explains how component names are resolved.

## How Nuxt Names Components

This project uses a **custom component naming strategy** configured in `nuxt.config.ts` to prevent naming conflicts.

### Directory Structure → Component Name

```
components/
├── common/              → "Common" prefix + path structure
│   ├── page/
│   │   ├── PageHeader.vue         → CommonPagePageHeader
│   │   └── Container.vue          → CommonPageContainer
│   ├── dialog/
│   │   ├── DialogHeader.vue       → CommonDialogDialogHeader
│   │   └── Actions.vue            → CommonDialogActions
│   └── ui/
│       ├── StatCard.vue           → CommonUiStatCard
│       └── DashboardCard.vue      → CommonUiDashboardCard
├── dashboard/          → No prefix (flat names)
│   ├── stats/
│   │   └── StatisticsCards.vue    → StatisticsCards
│   ├── alerts/
│   │   └── MaintenanceAlerts.vue  → MaintenanceAlerts
│   └── quick-actions/
│       └── QuickActions.vue       → QuickActions
└── layout/             → No prefix (flat names)
    ├── AppNavbar.vue              → AppNavbar
    └── navbar/
        ├── DarkModeToggle.vue     → DarkModeToggle
        └── UserMenu.vue           → UserMenu
```

### Why This Strategy?

1. **Prevents conflicts** - Avoids name clashes like having multiple `Header.vue` files
2. **Clear ownership** - `Common` prefix indicates shared, reusable components
3. **Organized naming** - Path structure (`Page`, `Dialog`, `Ui`) provides context
4. **Flat specialized names** - Dashboard and layout components use simple, unique names

## Lazy Loading Components

Add `Lazy` prefix to any component name to lazy load it:

```vue
<!-- Regular import -->
<StatisticsCards />

<!-- Lazy loaded -->
<LazyStatisticsCards />
```

## Current Component Mapping

### Common Components (with "Common" prefix + path)

| File Path | Component Name | Lazy Name |
|-----------|---------------|-----------|
| `common/page/PageHeader.vue` | `CommonPagePageHeader` | `LazyCommonPagePageHeader` |
| `common/page/Container.vue` | `CommonPageContainer` | `LazyCommonPageContainer` |
| `common/page/DetailPageHeader.vue` | `CommonPageDetailPageHeader` | `LazyCommonPageDetailPageHeader` |
| `common/dialog/DialogHeader.vue` | `CommonDialogDialogHeader` | `LazyCommonDialogDialogHeader` |
| `common/dialog/Actions.vue` | `CommonDialogActions` | `LazyCommonDialogActions` |
| `common/ui/StatCard.vue` | `CommonUiStatCard` | `LazyCommonUiStatCard` |
| `common/ui/DashboardCard.vue` | `CommonUiDashboardCard` | `LazyCommonUiDashboardCard` |
| `common/ui/SectionHeader.vue` | `CommonUiSectionHeader` | `LazyCommonUiSectionHeader` |
| `common/form/Card.vue` | `CommonFormCard` | `LazyCommonFormCard` |
| `common/form/Field.vue` | `CommonFormField` | `LazyCommonFormField` |

### Dashboard Components (flat names)

| File Path | Component Name | Lazy Name |
|-----------|---------------|-----------|
| `dashboard/stats/StatisticsCards.vue` | `StatisticsCards` | `LazyStatisticsCards` |
| `dashboard/revenue/RevenueSection.vue` | `RevenueSection` | `LazyRevenueSection` |
| `dashboard/vehicle-status/VehicleStatusSection.vue` | `VehicleStatusSection` | `LazyVehicleStatusSection` |
| `dashboard/rentals/RecentRentalsTable.vue` | `RecentRentalsTable` | `LazyRecentRentalsTable` |
| `dashboard/quick-actions/QuickActions.vue` | `QuickActions` | `LazyQuickActions` |
| `dashboard/alerts/MaintenanceAlerts.vue` | `MaintenanceAlerts` | `LazyMaintenanceAlerts` |

### Layout Components (flat names)

| File Path | Component Name | Lazy Name |
|-----------|---------------|-----------|
| `layout/AppNavbar.vue` | `AppNavbar` | `LazyAppNavbar` |
| `layout/AppSidebar.vue` | `AppSidebar` | `LazyAppSidebar` |
| `layout/navbar/DarkModeToggle.vue` | `DarkModeToggle` | `LazyDarkModeToggle` |
| `layout/navbar/QuickAddMenu.vue` | `QuickAddMenu` | `LazyQuickAddMenu` |
| `layout/navbar/NotificationPanel.vue` | `NotificationPanel` | `LazyNotificationPanel` |
| `layout/navbar/UserMenu.vue` | `UserMenu` | `LazyUserMenu` |
| `layout/navbar/SearchDialog.vue` | `SearchDialog` | `LazySearchDialog` |
| `layout/navbar/SearchTrigger.vue` | `SearchTrigger` | `LazySearchTrigger` |
| `layout/navbar/PageTitleDisplay.vue` | `PageTitleDisplay` | `LazyPageTitleDisplay` |

## Checking Component Names

To verify the exact component names Nuxt generates:

```bash
cat .nuxt/components.d.ts | grep "export const"
```

Or for lazy components specifically:

```bash
cat .nuxt/components.d.ts | grep "Lazy"
```

## Common Mistakes

### ❌ Wrong

```vue
<!-- These will cause errors -->
<LazyDashboardStatsStatisticsCards />
<LazyLayoutNavbarDarkModeToggle />
<LazyDashboardAlertsMaintenanceAlerts />
```

### ✅ Correct

```vue
<!-- Use the flattened names -->
<LazyStatisticsCards />
<LazyDarkModeToggle />
<LazyMaintenanceAlerts />
```

## Handling Name Conflicts

This project **prevents** naming conflicts using path prefixes for the `common/` directory:

**Before (conflicts):**
```
components/
├── common/
│   ├── page/Header.vue      → Header ❌
│   └── dialog/Header.vue    → Header ❌  (CONFLICT!)
```

**After (resolved with prefixes):**
```
components/
├── common/
│   ├── page/PageHeader.vue         → CommonPagePageHeader ✅
│   └── dialog/DialogHeader.vue     → CommonDialogDialogHeader ✅
```

### Configuration in nuxt.config.ts

```typescript
components: [
  {
    path: '~/components/common',
    prefix: 'Common',
    pathPrefix: true,  // Uses path structure in name
  },
  {
    path: '~/components/dashboard',
    pathPrefix: false, // Flat names
  }
]
```

## Best Practices

1. **Use unique filenames** - Avoid naming conflicts by using descriptive, unique filenames
2. **Check `.nuxt/components.d.ts`** - When in doubt, check the auto-generated types
3. **Use Lazy prefix for components** - Add `Lazy` prefix when using components (e.g., `<LazyStatisticsCards />`)
4. **⚠️ NEVER name components with "Lazy" prefix** - Do NOT create components like `LazySection.vue` or `LazyWrapper.vue` - the `Lazy` prefix is **reserved by Nuxt** for auto-generating lazy-loaded versions
5. **Consistent naming** - Use PascalCase for component filenames

### Reserved Prefixes

**Do NOT use these prefixes in component filenames:**

- ❌ `Lazy*` - Reserved by Nuxt for lazy loading (e.g., `LazyMyComponent.vue`)
- ✅ Use alternative names: `IntersectionSection.vue`, `DeferredLoader.vue`, `AsyncWrapper.vue`

**Example:**
```
❌ components/common/ui/LazySection.vue      # Will cause conflicts!
✅ components/common/ui/IntersectionSection.vue  # Safe to use
```

## IDE Support

Your IDE should have TypeScript intellisense for all auto-imported components. If not:

1. Restart your TypeScript server
2. Check `.nuxt/components.d.ts` is being generated
3. Run `npm run dev` to regenerate the types
