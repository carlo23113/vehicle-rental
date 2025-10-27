# Bulk Actions Implementation Guide

This guide explains how to implement bulk actions in any table throughout the application using the reusable components.

## Overview

The bulk actions feature consists of four reusable components:

1. **`CommonUiDataTable`** - Enhanced with row selection support
2. **`CommonUiBulkActionsBar`** - Floating action bar for bulk operations
3. **`CommonUiBulkActionDialog`** - Generic dialog base for bulk operations
4. **Domain-specific dialogs** - Built on top of BulkActionDialog (e.g., `VehicleBulkStatusDialog`, `UserBulkStatusDialog`)

## Quick Start

### 1. Enable Selection in DataTable

Update your table component to support selection:

```vue
<template>
  <CommonUiDataTable
    v-model:selected-items="selectedItems"
    :headers="headers"
    :items="items"
    :show-select="selectionEnabled"
    item-value="id"
  >
    <!-- Your table slots -->
  </CommonUiDataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: any[]
  showSelect?: boolean
  selectedItems?: any[]
}>()

const emit = defineEmits<{
  'update:selectedItems': [items: any[]]
}>()

const selectedItemsModel = computed({
  get: () => props.selectedItems || [],
  set: (value) => emit('update:selectedItems', value),
})
</script>
```

### 2. Add Bulk Actions Bar

Add the floating action bar to your table section:

```vue
<template>
  <div>
    <!-- Enable/Disable Bulk Selection Toggle -->
    <v-card class="mb-4">
      <v-card-text>
        <v-switch
          v-model="bulkSelectMode"
          label="Bulk Selection Mode"
          color="primary"
        />
      </v-card-text>
    </v-card>

    <!-- Your Table Component -->
    <YourTable
      v-model:selected-items="selectedItems"
      :show-select="bulkSelectMode"
    />

    <!-- Bulk Actions Bar (appears when items are selected) -->
    <CommonUiBulkActionsBar
      :selected-count="selectedItems.length"
      :selected-items="selectedItems"
      item-label="item"
      @clear-selection="selectedItems = []"
    >
      <template #actions="{ selectedCount }">
        <v-btn
          variant="elevated"
          color="white"
          prepend-icon="mdi-pencil"
          @click="handleBulkEdit"
        >
          Edit ({{ selectedCount }})
        </v-btn>
        <v-btn
          variant="text"
          color="white"
          prepend-icon="mdi-delete"
          @click="handleBulkDelete"
        >
          Delete
        </v-btn>
      </template>
    </CommonUiBulkActionsBar>
  </div>
</template>

<script setup lang="ts">
const bulkSelectMode = ref(false)
const selectedItems = ref<any[]>([])

const handleBulkEdit = () => {
  console.log('Editing:', selectedItems.value)
}

const handleBulkDelete = () => {
  console.log('Deleting:', selectedItems.value)
}
</script>
```

### 3. Create Domain-Specific Dialogs

Use the generic `CommonUiBulkActionDialog` as a base for your domain-specific dialogs:

```vue
<template>
  <CommonUiBulkActionDialog
    v-model="dialogModel"
    :selected-items="selectedItems"
    :loading="loading"
    title="Bulk Status Update"
    icon="mdi-swap-horizontal"
    item-label="vehicle"
    confirm-text="Update Status"
    :confirm-disabled="!selectedStatus"
    :item-label-key="(item) => `${item.make} ${item.model}`"
    @confirm="handleConfirm"
    @cancel="$emit('cancel')"
  >
    <template #form>
      <!-- Your custom form fields -->
      <v-select
        v-model="selectedStatus"
        :items="statusOptions"
        label="New Status"
        variant="outlined"
      />
      <v-textarea
        v-model="notes"
        label="Notes (Optional)"
        variant="outlined"
        class="mt-4"
      />
    </template>
  </CommonUiBulkActionDialog>
</template>

<script setup lang="ts">
const selectedStatus = ref('')
const notes = ref('')

const handleConfirm = () => {
  emit('confirm', {
    status: selectedStatus.value,
    notes: notes.value,
  })
}
</script>
```

## Component API Reference

### CommonUiDataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSelect` | `boolean` | `false` | Enable row selection checkboxes |
| `selectedItems` | `any[]` | `[]` | Currently selected items (v-model) |
| `itemValue` | `string` | `'id'` | Property name to use as unique identifier |

### CommonUiBulkActionsBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedCount` | `number` | **required** | Number of selected items |
| `selectedItems` | `any[]` | `[]` | Array of selected items |
| `itemLabel` | `string` | `'items'` | Label for selected items (e.g., 'vehicles', 'users') |
| `barColor` | `string` | `'primary'` | Color of the action bar |
| `selectionIcon` | `string` | `'mdi-checkbox-multiple-marked'` | Icon to display |
| `showClearAll` | `boolean` | `true` | Show clear selection link |
| `showClose` | `boolean` | `true` | Show close button |

### CommonUiBulkActionsBar Slots

| Slot | Props | Description |
|------|-------|-------------|
| `actions` | `{ selectedCount, selectedItems }` | Custom action buttons |

### CommonUiBulkActionsBar Events

| Event | Payload | Description |
|-------|---------|-------------|
| `clear-selection` | `void` | Emitted when clear button is clicked |

### CommonUiBulkActionDialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | **required** | Dialog visibility (v-model) |
| `selectedItems` | `any[]` | **required** | Array of selected items |
| `loading` | `boolean` | `false` | Show loading state on confirm button |
| `title` | `string` | `'Bulk Action'` | Dialog title |
| `description` | `string` | `''` | Optional description text |
| `icon` | `string` | `'mdi-checkbox-multiple-marked'` | Title icon |
| `itemLabel` | `string` | `'item'` | Singular label for items |
| `confirmText` | `string` | `'Confirm'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `confirmDisabled` | `boolean` | `false` | Disable confirm button |
| `maxWidth` | `string \| number` | `500` | Dialog max width |
| `showPreview` | `boolean` | `true` | Show preview chips of selected items |
| `previewLimit` | `number` | `3` | Number of items to preview |
| `itemLabelKey` | `string \| function` | `'name'` | Property or function to get item label |
| `itemValueKey` | `string` | `'id'` | Property to use as item key |

### CommonUiBulkActionDialog Slots

| Slot | Props | Description |
|------|-------|-------------|
| `form` | `{ selectedItems, selectedCount }` | Custom form content |
| `actions-prepend` | - | Additional actions before cancel/confirm |

### CommonUiBulkActionDialog Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Dialog visibility change |
| `confirm` | `void` | Emitted when confirm button is clicked |
| `cancel` | `void` | Emitted when cancel button is clicked |

## Real-World Examples

### Vehicles Table Implementation

See the complete implementation in:
- [`/components/common/ui/DataTable.vue`](../components/common/ui/DataTable.vue) - Base table with selection
- [`/components/common/ui/BulkActionsBar.vue`](../components/common/ui/BulkActionsBar.vue) - Floating action bar
- [`/components/common/ui/BulkActionDialog.vue`](../components/common/ui/BulkActionDialog.vue) - Generic dialog base
- [`/components/owner/vehicles/VehiclesTable.vue`](../components/owner/vehicles/VehiclesTable.vue) - Vehicles table
- [`/components/owner/vehicles/VehiclesTableSection.vue`](../components/owner/vehicles/VehiclesTableSection.vue) - Vehicles section with bulk logic
- [`/components/owner/vehicles/VehicleBulkStatusDialog.vue`](../components/owner/vehicles/VehicleBulkStatusDialog.vue) - Vehicle-specific dialog
- [`/pages/owner/vehicles/index.vue`](../pages/owner/vehicles/index.vue) - Vehicles page integration

### Users Table Example

Example implementation for users:
- [`/components/owner/users/UserBulkStatusDialog.vue`](../components/owner/users/UserBulkStatusDialog.vue) - User-specific dialog using the generic base

## Best Practices

1. **Progressive Enhancement**: Add bulk actions as an opt-in feature with a toggle switch
2. **Clear Selection**: Always provide a way to clear selection (button or escape key)
3. **Visual Feedback**: Use the BulkActionsBar to show selection count and available actions
4. **Confirmation Dialogs**: Always confirm destructive bulk operations
5. **Loading States**: Show loading indicators during bulk operations
6. **Error Handling**: Provide clear feedback if bulk operations fail
7. **Accessibility**: Ensure keyboard navigation works for selection

## Adapting for Other Tables

To add bulk actions to any table:

1. **Enable selection** in your table component by adding `show-select` prop
2. **Add bulk mode toggle** in your table section component
3. **Implement BulkActionsBar** with domain-specific actions
4. **Create dialog components** for your specific bulk operations
5. **Wire up handlers** in your page component to process bulk actions

## Tips for Reusability

- Keep the BulkActionsBar generic - use slots for custom actions
- Create separate dialog components for each bulk operation type
- Use TypeScript interfaces to define bulk operation payloads
- Emit events from table sections and handle them in page components
- Use consistent naming: `bulk-{operation}` for events

## Future Enhancements

Potential improvements to consider:

- **Undo/Redo**: Add undo capability for bulk operations
- **Batch Processing**: Process large selections in batches with progress indicator
- **Select All Pages**: Option to select all items across all pages
- **Smart Selection**: Select by filter criteria instead of manual selection
- **Keyboard Shortcuts**: Add shortcuts like Ctrl+A for select all
