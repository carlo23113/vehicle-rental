# CommonPageLayout

A reusable page layout component that encapsulates the standard pattern used across most pages in the application.

## Features

- 🎯 **Consistent Layout**: Standardized page structure across all pages
- 🚀 **Progressive Loading**: Built-in intersection observer for lazy loading sections
- 🎨 **Flexible Slots**: Highly customizable through slot-based architecture
- 📦 **DRY Principle**: Single source of truth for common page patterns
- ⚡ **Performance**: Automatic code-splitting and lazy loading
- 🎭 **Skeleton States**: Default skeleton loaders with customization options

## Common Pattern

Most pages in the application follow this structure:
1. **Page Header** - Title, subtitle, and action button
2. **Filters** (optional) - Search and filter controls
3. **Statistics Cards** - Key metrics with skeleton loader
4. **Main Content** - Table/Grid with progressive loading
5. **Dialogs/Modals** - Delete confirmations, forms, etc.
6. **Snackbar** - Success/error notifications

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | *required* | Page title |
| `subtitle` | `string` | `''` | Page subtitle |
| `actionText` | `string` | `''` | Action button text |
| `actionIcon` | `string` | `''` | Action button icon |
| `icon` | `string` | `''` | Page header icon |
| `autoLoadStats` | `boolean` | `true` | Auto-load stats section immediately |
| `observerRootMargin` | `string` | `'100px'` | Intersection observer root margin |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `action-click` | `void` | Emitted when action button is clicked |
| `stats-loaded` | `void` | Emitted when stats section loads |
| `content-loaded` | `void` | Emitted when content section loads |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `header-actions` | - | Custom header actions (replaces action button) |
| `filters` | `{ showFilters, sectionsLoaded }` | Filter components |
| `stats` | - | Statistics cards component |
| `stats-skeleton` | - | Custom stats skeleton (defaults to CommonUiStatsSkeleton) |
| `content` | - | Main content (table/grid) |
| `content-skeleton` | - | Custom content skeleton (defaults to CommonUiTableSkeleton) |
| `additional` | - | Additional sections after main content |
| `dialogs` | - | Modal dialogs and confirmations |
| `snackbar` | - | Snackbar notifications |

## Basic Usage

```vue
<template>
  <CommonPageLayout
    title="Customers"
    subtitle="Manage customer profiles"
    action-text="Add Customer"
    action-icon="mdi-plus"
    @action-click="handleAdd"
  >
    <template #stats>
      <CustomersStatsCards :stats="stats" />
    </template>

    <template #content>
      <CustomersTable :items="items" />
    </template>
  </CommonPageLayout>
</template>
```

## Complete Example

```vue
<template>
  <CommonPageLayout
    title="Rentals"
    subtitle="Track and manage rental bookings"
    action-text="New Rental"
    action-icon="mdi-plus"
    @action-click="handleAddRental"
  >
    <!-- Filters Slot -->
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyRentalsFilters
        v-if="isFilterVisible || sections.stats"
        v-model:show-filters="showFilters"
        v-model:filters="filters"
        @clear="clearFilters"
      />
    </template>

    <!-- Stats Slot -->
    <template #stats>
      <LazyRentalsStatsCards :stats="stats" />
    </template>

    <!-- Main Content Slot -->
    <template #content>
      <LazyRentalsTableSection
        :rentals="displayedItems"
        :is-loading-more="isLoadingMore"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <LazyRentalsDeleteDialog
        v-if="showDeleteDialog"
        v-model="showDeleteDialog"
        :rental="rentalToDelete"
        @confirm="confirmDelete"
      />
    </template>

    <!-- Snackbar Slot -->
    <template #snackbar>
      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRentals } from '~/composables/useRentals'
import { useRentalStats } from '~/composables/useRentalStats'
import { useProgressiveTable } from '~/composables/useProgressiveTable'

const {
  rentals,
  filters,
  filteredRentals,
  deleteRental,
} = useRentals()

const { stats } = useRentalStats(rentals)

const {
  displayedItems,
  isLoadingMore,
} = useProgressiveTable(filteredRentals, { batchSize: 20 })

const showFilters = ref(false)
const showDeleteDialog = ref(false)
const rentalToDelete = ref(null)

const handleAddRental = () => {
  // Navigate to add page
}

const handleDelete = (rental) => {
  rentalToDelete.value = rental
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  deleteRental(rentalToDelete.value.id)
  showDeleteDialog.value = false
}

const clearFilters = () => {
  filters.value = { search: '', status: 'all' }
}
</script>
```

## Custom Header Actions

Instead of using the default action button, you can provide custom header actions:

```vue
<template>
  <CommonPageLayout
    title="Reports"
    subtitle="View analytics and insights"
  >
    <template #header-actions>
      <v-btn variant="outlined" prepend-icon="mdi-download">
        Export
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-refresh">
        Refresh
      </v-btn>
    </template>

    <!-- Other slots -->
  </CommonPageLayout>
</template>
```

## Custom Skeletons

Override default skeleton loaders:

```vue
<template>
  <CommonPageLayout title="Custom Skeletons">
    <template #stats>
      <MyStatsCards :stats="stats" />
    </template>

    <template #stats-skeleton>
      <MyCustomStatsSkeleton />
    </template>

    <template #content>
      <MyGrid :items="items" />
    </template>

    <template #content-skeleton>
      <LazyCommonUiGridSkeleton :items="6" :lg="4" />
    </template>
  </CommonPageLayout>
</template>
```

## Without Stats Section

Pages without statistics can skip the stats slot:

```vue
<template>
  <CommonPageLayout
    title="Simple Page"
    subtitle="No statistics needed"
  >
    <template #content>
      <MySimpleTable :items="items" />
    </template>
  </CommonPageLayout>
</template>
```

## Benefits

### Before (171 lines)
```vue
<template>
  <CommonPageContainer>
    <CommonPageHeader
      title="Customers"
      subtitle="Manage customer profiles"
      action-text="Add Customer"
      action-icon="mdi-plus"
      @action-click="handleAdd"
    />

    <LazyCustomersFilters
      v-if="showFilters || sectionsLoaded.stats"
      v-model:show-filters="showFilters"
      v-model:filters="filters"
      @clear="clearFilters"
    />

    <div ref="statsSection">
      <LazyCustomersStatsCards v-if="sectionsLoaded.stats" :stats="stats" />
      <LazyCommonUiStatsSkeleton v-else />
    </div>

    <div ref="tableSection">
      <LazyCustomersTableSection
        v-if="sectionsLoaded.table"
        :customers="displayedItems"
        @view="handleView"
      />
      <LazyCommonUiTableSkeleton v-else />
    </div>

    <LazyCustomersDeleteDialog v-if="showDeleteDialog" ... />
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Manual intersection observer setup
const statsSection = ref(null)
const tableSection = ref(null)
const sectionsLoaded = ref({ stats: false, table: false })
let observer = null

onMounted(() => {
  sectionsLoaded.value.stats = true
  observer = new IntersectionObserver(/* ... */)
  if (statsSection.value) observer.observe(statsSection.value)
  if (tableSection.value) observer.observe(tableSection.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

// Rest of logic...
</script>
```

### After (161 lines)
```vue
<template>
  <CommonPageLayout
    title="Customers"
    subtitle="Manage customer profiles"
    action-text="Add Customer"
    action-icon="mdi-plus"
    @action-click="handleAdd"
  >
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyCustomersFilters
        v-if="isFilterVisible || sections.stats"
        v-model:show-filters="showFilters"
        v-model:filters="filters"
        @clear="clearFilters"
      />
    </template>

    <template #stats>
      <LazyCustomersStatsCards :stats="stats" />
    </template>

    <template #content>
      <LazyCustomersTableSection
        :customers="displayedItems"
        @view="handleView"
      />
    </template>

    <template #dialogs>
      <LazyCustomersDeleteDialog v-if="showDeleteDialog" ... />
    </template>

    <template #snackbar>
      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageLayout>
</template>

<script setup lang="ts">
// No manual intersection observer setup needed!
// Just business logic

const showFilters = ref(false)
// Rest of logic...
</script>
```

### Improvements
- ✅ **-10 lines** per page (6% reduction)
- ✅ **No manual intersection observer** setup
- ✅ **Clearer structure** with named slots
- ✅ **Consistent behavior** across all pages
- ✅ **Less boilerplate** code to maintain

## Migration Guide

1. **Replace CommonPageContainer + CommonPageHeader** with `<CommonPageLayout>`
2. **Move filters** to `#filters` slot
3. **Remove manual intersection observer** code (refs, onMounted, onUnmounted)
4. **Wrap stats** in `#stats` slot
5. **Wrap main content** in `#content` slot
6. **Move dialogs** to `#dialogs` slot
7. **Move snackbar** to `#snackbar` slot
8. **Remove sectionsLoaded refs** (handled by layout)

## Performance

The CommonPageLayout component provides:
- ✅ Automatic intersection observer with configurable root margin
- ✅ Progressive loading for stats and content sections
- ✅ Built-in skeleton states
- ✅ Code-splitting friendly (all slots are lazy-loadable)
- ✅ Minimal overhead (~100 lines vs manual setup)

## Best Practices

1. **Always use Lazy prefix** for components in slots (enables code-splitting)
2. **Keep business logic in page** - layout only handles structure
3. **Use slot props** for reactive values (showFilters, sectionsLoaded)
4. **Provide semantic slot names** for clarity
5. **Test skeleton states** by throttling network

## See Also

- [CommonUiStatsSkeleton](../ui/CommonUiStatsSkeleton.vue)
- [CommonUiTableSkeleton](../ui/CommonUiTableSkeleton.vue)
- [CommonUiGridSkeleton](../ui/CommonUiGridSkeleton.vue)
- [useProgressiveTable composable](../../../composables/useProgressiveTable.ts)
