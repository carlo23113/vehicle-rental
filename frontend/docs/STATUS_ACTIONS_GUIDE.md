# Status-Aware Actions Implementation Guide

This guide explains how to implement contextual, status-aware action buttons in any table throughout the application using the reusable components.

## Overview

The status-aware actions system provides dynamic action buttons that appear/disappear based on the current status of an item (vehicle, user, rental, etc.). This creates an intuitive UX where users only see relevant actions.

### Key Components

1. **`useStatusActions` composable** - Defines action configurations for different entities
2. **`CommonUiStatusActionButtons`** - Renders status-aware action buttons
3. **`CommonUiStatusActionDialog`** - Generic confirmation dialog for actions

## Quick Start

### 1. Define Status Actions Configuration

Create a configuration function in [`composables/useStatusActions.ts`](../composables/useStatusActions.ts):

```typescript
export const useVehicleStatusActions = (): StatusActionsConfig => {
  return {
    actions: [
      {
        action: 'mark-available',
        label: 'Mark Available',
        icon: 'mdi-check-circle',
        color: 'success',
        tooltip: 'Mark vehicle as available for rent',
        showWhen: (vehicle) =>
          vehicle.status === 'maintenance' || vehicle.status === 'out-of-service',
        requiresConfirmation: true,
        confirmMessage: (vehicle) =>
          `Mark ${vehicle.make} ${vehicle.model} as available for rent?`,
      },
      // More actions...
    ],
  }
}
```

### 2. Add Status Action Buttons to Your Table

```vue
<template>
  <CommonUiTableActionButtons
    @view="$emit('view', item)"
    @edit="$emit('edit', item)"
  >
    <template #append>
      <CommonUiStatusActionButtons
        :item="item"
        :config="statusActionsConfig"
        @action="$emit('status-action', $event)"
      />
    </template>
  </CommonUiTableActionButtons>
</template>

<script setup lang="ts">
import { useVehicleStatusActions } from '~/composables/useStatusActions'

const statusActionsConfig = useVehicleStatusActions()
</script>
```

### 3. Handle Status Actions in Your Page

```vue
<template>
  <YourTable @status-action="handleStatusAction" />

  <CommonUiStatusActionDialog
    v-model="statusDialog.show"
    :action-title="statusDialog.title"
    :action-icon="statusDialog.icon"
    :action-color="statusDialog.color"
    :confirm-message="statusDialog.message"
    :loading="statusDialog.loading"
    show-notes-field
    @confirm="confirmStatusAction"
    @cancel="cancelStatusAction"
  />
</template>

<script setup lang="ts">
const statusDialog = ref({
  show: false,
  title: '',
  icon: '',
  color: '',
  message: '',
  loading: false,
  action: '',
  item: null,
})

const handleStatusAction = (payload: { action: string; item: any }) => {
  const actionConfig = findActionConfig(payload.action)

  if (actionConfig.requiresConfirmation) {
    statusDialog.value = {
      show: true,
      title: actionConfig.label,
      icon: actionConfig.icon,
      color: actionConfig.color,
      message: actionConfig.confirmMessage(payload.item),
      loading: false,
      action: payload.action,
      item: payload.item,
    }
  } else {
    executeAction(payload.action, payload.item)
  }
}

const confirmStatusAction = async (notes: string) => {
  statusDialog.value.loading = true
  await executeAction(statusDialog.value.action, statusDialog.value.item, notes)
  statusDialog.value.show = false
}
</script>
```

## Component API Reference

### StatusAction Interface

```typescript
interface StatusAction {
  action: string                         // Unique action identifier
  label: string                          // Display label
  icon: string                           // Material Design Icon
  color: string                          // Color theme
  tooltip: string                        // Tooltip text
  showWhen: (item: any) => boolean       // Condition to show action
  disableWhen?: (item: any) => boolean   // Optional disable condition
  requiresConfirmation?: boolean         // Show confirmation dialog
  confirmMessage?: (item: any) => string // Confirmation message
}
```

### useStatusActions Composable

#### Vehicle Status Actions

```typescript
const vehicleConfig = useVehicleStatusActions()
```

Available actions:
- **mark-available** - Show when status is `maintenance` or `out-of-service`
- **send-to-maintenance** - Show when status is `available` or `out-of-service`
- **mark-out-of-service** - Show when status is `available` or `maintenance`
- **return-from-rental** - Show when status is `rented`

#### User Status Actions (Example)

```typescript
const userConfig = useUserStatusActions()
```

Available actions:
- **activate** - Show when status is `inactive` or `suspended`
- **deactivate** - Show when status is `active`, disabled for admin role
- **suspend** - Show when status is not `suspended`, disabled for admin role

### CommonUiStatusActionButtons Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `item` | `any` | Yes | The item to show actions for |
| `config` | `StatusActionsConfig` | Yes | Status actions configuration |

### CommonUiStatusActionButtons Events

| Event | Payload | Description |
|-------|---------|-------------|
| `action` | `{ action: string, item: any }` | Emitted when action button clicked |

### CommonUiStatusActionDialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | **required** | Dialog visibility |
| `actionTitle` | `string` | **required** | Dialog title |
| `actionIcon` | `string` | **required** | Title icon |
| `actionColor` | `string` | **required** | Theme color |
| `confirmMessage` | `string` | **required** | Confirmation message |
| `confirmText` | `string` | `'Confirm'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `loading` | `boolean` | `false` | Show loading state |
| `showNotesField` | `boolean` | `false` | Show optional notes textarea |
| `showInfo` | `boolean` | `false` | Show info alert slot |

### CommonUiStatusActionDialog Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Dialog visibility change |
| `confirm` | `string` | Emitted with notes when confirmed |
| `cancel` | `void` | Emitted when cancelled |

### CommonUiStatusActionDialog Slots

| Slot | Props | Description |
|------|-------|-------------|
| `info` | - | Custom info alert content |
| `content` | `{ notes: string }` | Additional custom content |

## Real-World Example: Vehicles

### Vehicle Statuses & Actions Matrix

| Current Status | Available Actions |
|---------------|-------------------|
| **Available** | Send to Maintenance, Mark Out of Service |
| **Rented** | Return Vehicle |
| **Maintenance** | Mark Available, Mark Out of Service |
| **Out of Service** | Mark Available, Send to Maintenance |

### Implementation Files

- [`composables/useStatusActions.ts`](../composables/useStatusActions.ts) - Action configurations
- [`components/common/ui/StatusActionButtons.vue`](../components/common/ui/StatusActionButtons.vue) - Button component
- [`components/common/ui/StatusActionDialog.vue`](../components/common/ui/StatusActionDialog.vue) - Dialog component
- [`components/owner/vehicles/VehiclesTable.vue`](../components/owner/vehicles/VehiclesTable.vue) - Table integration
- [`pages/owner/vehicles/index.vue`](../pages/owner/vehicles/index.vue) - Page handlers

### Visual Flow

```
User sees vehicle with status "maintenance"
  ↓
Action buttons appear: "Mark Available" and "Mark Out of Service"
  ↓
User clicks "Mark Available"
  ↓
Confirmation dialog shows with optional notes field
  ↓
User confirms
  ↓
API call executes (simulated)
  ↓
Vehicle status updates to "available"
  ↓
Success message shows
  ↓
Action buttons change to: "Send to Maintenance" and "Mark Out of Service"
```

## Benefits

### 1. **Contextual UX**
- Users only see actions that are valid for the current state
- Reduces confusion and errors
- Cleaner, more intuitive interface

### 2. **Type Safety**
- TypeScript interfaces ensure correct action definitions
- Compile-time checks for action configurations
- IntelliSense support in IDE

### 3. **Reusability**
- Same pattern works for any entity (vehicles, users, rentals, etc.)
- Easy to add new entities with different statuses
- Consistent behavior across the application

### 4. **Maintainability**
- Action logic centralized in configuration
- Easy to add, remove, or modify actions
- No need to touch component code for new actions

### 5. **Flexibility**
- Optional confirmation dialogs
- Conditional disabling of actions
- Custom messages per action
- Notes field support

## Best Practices

### 1. Define Clear Action Names
```typescript
// Good
action: 'mark-available'
action: 'send-to-maintenance'

// Bad
action: 'action1'
action: 'update'
```

### 2. Write User-Friendly Messages
```typescript
confirmMessage: (vehicle) =>
  `Mark ${vehicle.make} ${vehicle.model} as available for rent?`
```

### 3. Use Appropriate Colors
- `success` - Positive actions (activate, mark available)
- `warning` - Cautionary actions (deactivate, maintenance)
- `error` - Destructive actions (delete, out of service)
- `primary` - Neutral actions (return, complete)

### 4. Consider Disable Conditions
```typescript
{
  action: 'deactivate',
  disableWhen: (user) => user.role === 'admin',
  // Prevents accidental admin deactivation
}
```

### 5. Always Confirm Destructive Actions
```typescript
{
  action: 'mark-out-of-service',
  requiresConfirmation: true,
  // Forces user to confirm risky action
}
```

## Adding New Entities

To add status-aware actions for a new entity type:

### Step 1: Define Actions Configuration

```typescript
// In composables/useStatusActions.ts
export const useRentalStatusActions = (): StatusActionsConfig => {
  return {
    actions: [
      {
        action: 'complete-rental',
        label: 'Complete',
        icon: 'mdi-check-circle',
        color: 'success',
        tooltip: 'Complete rental',
        showWhen: (rental) => rental.status === 'active',
        requiresConfirmation: true,
        confirmMessage: (rental) =>
          `Complete rental #${rental.id}? This will mark it as completed.`,
      },
      {
        action: 'cancel-rental',
        label: 'Cancel',
        icon: 'mdi-close-circle',
        color: 'error',
        tooltip: 'Cancel rental',
        showWhen: (rental) =>
          rental.status === 'reserved' || rental.status === 'active',
        requiresConfirmation: true,
        confirmMessage: (rental) =>
          `Cancel rental #${rental.id}? This action cannot be undone.`,
      },
    ],
  }
}
```

### Step 2: Add to Your Table

```vue
<!-- components/owner/rentals/RentalsTable.vue -->
<script setup lang="ts">
import { useRentalStatusActions } from '~/composables/useStatusActions'

const rentalStatusActionsConfig = useRentalStatusActions()
</script>

<template>
  <template #item.actions="{ item }">
    <CommonUiTableActionButtons>
      <template #append>
        <CommonUiStatusActionButtons
          :item="item"
          :config="rentalStatusActionsConfig"
          @action="$emit('status-action', $event)"
        />
      </template>
    </CommonUiTableActionButtons>
  </template>
</template>
```

### Step 3: Handle in Page

```vue
<!-- pages/owner/rentals/index.vue -->
<template>
  <RentalsTable @status-action="handleStatusAction" />

  <CommonUiStatusActionDialog
    v-model="statusDialog.show"
    :action-title="statusDialog.title"
    :action-icon="statusDialog.icon"
    :action-color="statusDialog.color"
    :confirm-message="statusDialog.message"
    :loading="statusDialog.loading"
    show-notes-field
    @confirm="confirmStatusAction"
  />
</template>

<script setup lang="ts">
const { updateRental } = useRentals()

const handleStatusAction = (payload: { action: string; item: any }) => {
  // Show dialog or execute immediately
}

const confirmStatusAction = async (notes: string) => {
  // Execute the status change
  const statusMap = {
    'complete-rental': 'completed',
    'cancel-rental': 'cancelled',
  }

  const newStatus = statusMap[statusDialog.value.action]
  await updateRental(statusDialog.value.item.id, { status: newStatus })

  showSuccess('Rental status updated successfully')
}
</script>
```

## Advanced Usage

### Custom Confirmation Messages

Use dynamic messages based on item properties:

```typescript
confirmMessage: (vehicle) => {
  if (vehicle.status === 'rented') {
    return `${vehicle.make} ${vehicle.model} is currently rented. Mark as returned?`
  }
  return `Change ${vehicle.make} ${vehicle.model} status?`
}
```

### Conditional Disabling

Disable actions based on complex conditions:

```typescript
disableWhen: (vehicle) => {
  // Disable if vehicle has active rental
  return vehicle.hasActiveRental || vehicle.maintenanceRequired
}
```

### Multiple Action Groups

Group related actions together:

```typescript
const config = {
  actions: [
    // Status change actions
    { action: 'mark-available', /* ... */ },
    { action: 'send-to-maintenance', /* ... */ },

    // Administrative actions
    { action: 'archive', /* ... */ },
    { action: 'export-history', /* ... */ },
  ],
}
```

## Troubleshooting

### Actions Not Showing

1. Check `showWhen` condition returns true
2. Verify item has correct status property
3. Check if `disableWhen` is blocking the action

### Wrong Actions Appearing

1. Review `showWhen` logic
2. Ensure status values match exactly (case-sensitive)
3. Check for conflicting conditions

### Dialog Not Opening

1. Verify `requiresConfirmation` is true
2. Check dialog v-model binding
3. Ensure event handler is connected

## Future Enhancements

- **Action History**: Track status change history with audit log
- **Batch Status Actions**: Apply to multiple items at once
- **Scheduled Actions**: Schedule status changes for future
- **Action Permissions**: Role-based action visibility
- **Undo/Redo**: Revert recent status changes
- **Workflows**: Multi-step status change workflows
- **Notifications**: Send notifications on status changes

## Conclusion

The status-aware actions system provides a powerful, reusable way to implement contextual actions throughout your application. By following this guide, you can quickly add intelligent action buttons to any table or list view.

Key takeaways:
- ✅ Define actions once, use everywhere
- ✅ Type-safe configuration
- ✅ Consistent UX across entities
- ✅ Easy to maintain and extend
- ✅ Built-in confirmation support
