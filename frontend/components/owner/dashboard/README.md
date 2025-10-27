# Dashboard Components Organization

This directory contains all components related to the Dashboard page, organized by feature area.

## Directory Structure

```
dashboard/
├── stats/              # Statistics cards
├── revenue/            # Revenue chart and section
├── rentals/            # Recent rentals table
├── vehicle-status/     # Vehicle status chart and display
├── alerts/             # Maintenance alerts
├── quick-actions/      # Quick action buttons
└── README.md
```

## Components by Directory

### `/stats` - Statistics Cards
Components for displaying key metrics at the top of the dashboard

- **StatisticsCards.vue** - Container for statistics cards using CommonStatCard

**Usage:**
```vue
<DashboardStatsStatisticsCards :stats="statsArray" />
```

### `/revenue` - Revenue Overview
Components for revenue tracking and visualization

- **RevenueChart.vue** - Line chart showing revenue over time
- **RevenueSection.vue** - Card wrapper with filter controls (week/month/year)

**Usage:**
```vue
<DashboardRevenueRevenueSection v-model:filter="revenueFilter" />
```

### `/rentals` - Recent Rentals
Components for displaying recent rental activity

- **RecentRentalsTable.vue** - Table container with headers
- **RecentRentalRow.vue** - Individual rental row component

**Usage:**
```vue
<DashboardRentalsRecentRentalsTable :rentals="recentRentals" />
```

### `/vehicle-status` - Vehicle Fleet Status
Components for vehicle status visualization

- **VehicleStatusSection.vue** - Card wrapper with chart and status list
- **VehicleStatusChart.vue** - Doughnut chart showing vehicle distribution
- **VehicleStatusItem.vue** - Individual status item with progress bar

**Usage:**
```vue
<DashboardVehicleStatusVehicleStatusSection :statuses="vehicleStatus" />
```

### `/alerts` - Maintenance Alerts
Components for displaying maintenance notifications

- **MaintenanceAlerts.vue** - Card container for alerts
- **MaintenanceAlertItem.vue** - Individual alert item

**Usage:**
```vue
<DashboardAlertsMaintenanceAlerts :alerts="maintenanceAlerts" />
```

### `/quick-actions` - Quick Actions
Components for quick action buttons

- **QuickActions.vue** - Grid container for action buttons
- **QuickActionButton.vue** - Individual action button

**Usage:**
```vue
<DashboardQuickActionsQuickActions
  :actions="quickActions"
  @action-click="handleAction"
/>
```

## Naming Convention

All components follow Vue's auto-import naming convention with the directory structure:

```
Dashboard + Directory + ComponentName
```

**Examples:**
- `components/dashboard/stats/StatisticsCards.vue` → `<DashboardStatsStatisticsCards />`
- `components/dashboard/revenue/RevenueSection.vue` → `<DashboardRevenueRevenueSection />`
- `components/dashboard/rentals/RecentRentalsTable.vue` → `<DashboardRentalsRecentRentalsTable />`

## Related Files

- **Composable:** `/frontend/composables/useDashboardData.ts`
- **Page:** `/frontend/pages/dashboard.vue`
- **Stores:** `/frontend/stores/auth.ts`

## Component Dependencies

### Shared Components Used
- `CommonPageContainer`
- `CommonPageHeader`
- `CommonStatCard` (for statistics)

### Chart Libraries
- `vue-chartjs` (Line and Doughnut charts)
- `chart.js` (Chart.js core library)

### External Libraries
- Vuetify 3 (v-card, v-btn, v-chip, v-progress-linear, etc.)

## Data Structures

### Statistics
```typescript
interface Stat {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  color: string
}
```

### Vehicle Status
```typescript
interface VehicleStatus {
  label: string
  value: string
  percentage: number
  color: string
  themeColor: string
}
```

### Recent Rental
```typescript
interface Rental {
  id: number
  customer: string
  customerInitials: string
  vehicle: string
  licensePlate: string
  startDate: string
  endDate: string
  status: string
  statusColor: string
  amount: string
  color: string
}
```

### Maintenance Alert
```typescript
interface MaintenanceAlert {
  vehicle: string
  message: string
}
```

### Quick Action
```typescript
interface QuickAction {
  title: string
  icon: string
  action: string
  color: string
}
```

## Best Practices

1. **Single Responsibility:** Each component handles one specific piece of UI
2. **Reusability:** Small components like alert items and action buttons are reusable
3. **TypeScript:** All components use TypeScript with proper type definitions
4. **Lazy Loading:** Main sections use lazy loading (`Lazy` prefix) for performance
5. **Composition:** Complex sections are composed of smaller components

## Optimization History

This organization is the result of optimization work:
- Extracted components from monolithic dashboard page
- Converted CSS to Tailwind/Vuetify utilities where possible
- Created composables for business logic
- Organized by feature area for better maintainability
- Reduced code duplication significantly
