<template>
  <div class="vehicles-table-wrapper">
    <CommonUiDataTable
      v-model:selected-items="selectedVehiclesModel"
      :headers="visibleColumns"
      :items="vehicles"
      :items-per-page="10"
      :show-select="showSelect"
      item-value="id"
      table-class="vehicles-table"
      empty-icon="mdi-car-off"
      empty-title="No vehicles found"
      empty-message="Try adjusting your filters or add a new vehicle"
      @row-click="$emit('view', $event)"
    >
      <template #item.vehicle="{ item }">
        <div class="flex items-center py-3">
          <CommonUiImageAvatar
            :src="item.imageUrl"
            :alt="`${item.make} ${item.model}`"
            :fallback-icon="getTypeIcon(item.type)"
            :initials="getVehicleInitials(item)"
            :size="56"
            :rounded="12"
            avatar-class="mr-3 vehicle-avatar"
            clickable
            @click="$emit('view', item)"
          />
          <div>
            <div class="font-bold">{{ item.make }} {{ item.model }}</div>
            <div class="text-xs text-medium-emphasis">
              {{ item.year }} • {{ item.licensePlate }}
            </div>
          </div>
        </div>
      </template>

    <template #item.type="{ item }">
      <div class="flex items-center gap-2">
        <v-icon :icon="getTypeIcon(item.type)" size="16" class="text-medium-emphasis" />
        <span class="text-body-2">{{ getTypeLabel(item.type) }}</span>
      </div>
    </template>

    <template #item.status="{ item }">
      <CommonUiTableChip
        :color="getStatusColor(item.status)"
        :icon="getStatusIcon(item.status)"
        :label="item.status.replace('-', ' ')"
        chip-class="status-chip"
      />
    </template>

    <template #item.rates="{ item }">
      <div class="rates-display">
        <div class="rate-row">
          <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-city">
            {{ formatCurrency(item.rates.cityRate) }}/day
          </v-chip>
        </div>
        <div class="rate-row mt-1">
          <v-chip
            size="small"
            variant="tonal"
            color="secondary"
            prepend-icon="mdi-map-marker-distance"
          >
            {{ formatCurrency(item.rates.provinceRate) }}/day
          </v-chip>
        </div>
      </div>
    </template>

    <template #item.mileage="{ item }">
      <div class="flex items-center gap-1">
        <v-icon icon="mdi-speedometer" size="16" class="text-medium-emphasis" />
        <span>{{ item.mileage.toLocaleString() }} mi</span>
      </div>
    </template>

    <template #item.lastRentalDate="{ item }">
      <CommonUiActivityTimestamp
        :date="item.lastRentalDate"
        icon="mdi-car-clock"
        format="relative"
        compact
        empty-text="Never rented"
      />
    </template>

    <template #item.lastUpdated="{ item }">
      <CommonUiActivityTimestamp
        :date="item.lastUpdated"
        format="relative"
        compact
        empty-text="N/A"
      />
    </template>

    <template #item.nextMaintenanceDate="{ item }">
      <CommonUiActivityTimestamp
        :date="item.nextMaintenanceDate"
        icon="mdi-wrench-clock"
        format="short"
        compact
        color-code
        detect-overdue
        detect-upcoming
        :upcoming-days="14"
        empty-text="Not scheduled"
      />
    </template>

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        edit-tooltip="Edit Vehicle"
        @view="$emit('view', item)"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item)"
      >
        <template #append>
          <CommonUiStatusActionButtons
            :item="item"
            :config="vehicleStatusActionsConfig"
            @action="handleStatusAction"
          />
        </template>
      </CommonUiTableActionButtons>
    </template>
  </CommonUiDataTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVehicles } from '~/composables/useVehicles'
import { useCurrency } from '~/composables/useCurrency'
import { useVehicleStatusActions } from '~/composables/useStatusActions'
import { useColumnVisibility } from '~/composables/useColumnVisibility'
import type { TableColumn } from '~/composables/useColumnVisibility'

const props = defineProps<{
  vehicles: any[]
  getStatusColor: (status: string) => string
  getTypeLabel: (type: string) => string
  showSelect?: boolean
  selectedVehicles?: any[]
}>()

const emit = defineEmits<{
  view: [vehicle: any]
  edit: [vehicle: any]
  delete: [vehicle: any]
  'row-click': [vehicle: any]
  'update:selectedVehicles': [vehicles: any[]]
  'status-action': [payload: { action: string; item: any }]
}>()

const selectedVehiclesModel = computed({
  get: () => props.selectedVehicles || [],
  set: (value) => emit('update:selectedVehicles', value),
})

const { getTypeIcon, getStatusIcon } = useVehicles()
const { formatCurrency } = useCurrency()
const vehicleStatusActionsConfig = useVehicleStatusActions()

const handleStatusAction = (payload: { action: string; item: any }) => {
  emit('status-action', payload)
}

const getVehicleInitials = (vehicle: any): string => {
  const makeInitial = vehicle.make?.charAt(0) || ''
  const modelInitial = vehicle.model?.charAt(0) || ''
  return `${makeInitial}${modelInitial}`.toUpperCase()
}

// Define all columns with visibility settings
const allColumns: TableColumn[] = [
  {
    title: 'Vehicle',
    key: 'vehicle',
    sortable: true,
    required: true,
  },
  {
    title: 'Type',
    key: 'type',
    sortable: true,
    visible: true,
  },
  {
    title: 'Status',
    key: 'status',
    sortable: true,
    visible: true,
  },
  {
    title: 'Rates (City/Province)',
    key: 'rates',
    sortable: false,
    visible: true,
  },
  {
    title: 'Mileage',
    key: 'mileage',
    sortable: true,
    visible: true,
  },
  {
    title: 'Last Rental',
    key: 'lastRentalDate',
    sortable: true,
    visible: false,
  },
  {
    title: 'Last Updated',
    key: 'lastUpdated',
    sortable: true,
    visible: false,
  },
  {
    title: 'Next Maintenance',
    key: 'nextMaintenanceDate',
    sortable: true,
    visible: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    align: 'end' as const,
    required: true,
  },
]

// Initialize column visibility
const {
  visibleColumns,
  visibleCount,
  hiddenCount,
  toggleColumn,
  showAllColumns,
  resetToDefaults,
  isColumnVisible,
} = useColumnVisibility(allColumns, {
  storageKey: 'vehicles-table-columns',
  defaultVisible: ['vehicle', 'type', 'status', 'rates', 'mileage', 'nextMaintenanceDate', 'actions'],
})

// Expose methods and properties for parent component
defineExpose({
  allColumns,
  visibleCount,
  hiddenCount,
  isColumnVisible,
  toggleColumn,
  showAllColumns,
  resetToDefaults,
})
</script>

<style scoped lang="scss">
.vehicles-table :deep(tbody tr:hover) .vehicle-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.2);
}

.status-chip {
  @apply capitalize font-semibold;
}

.rates-display {
  @apply flex flex-col gap-1;
}

.rate-row {
  @apply flex items-center;
}
</style>
