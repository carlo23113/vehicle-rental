<template>
  <CommonUiDataTable
    :headers="headers"
    :items="vehicles"
    :items-per-page="10"
    table-class="vehicles-table"
    empty-icon="mdi-car-off"
    empty-title="No vehicles found"
    empty-message="Try adjusting your filters or add a new vehicle"
  >
    <template #item.vehicle="{ item }">
      <div class="flex items-center py-3">
        <CommonUiIconAvatar icon="mdi-car" :size="40" :icon-size="20" avatar-class="mr-3" />
        <div>
          <div class="font-bold">{{ item.make }} {{ item.model }}</div>
          <div class="text-xs text-medium-emphasis">{{ item.year }}</div>
        </div>
      </div>
    </template>

    <template #item.licensePlate="{ item }">
      <v-chip size="small" class="license-chip">
        {{ item.licensePlate }}
      </v-chip>
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

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        edit-tooltip="Edit Vehicle"
        @view="$emit('view', item)"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item)"
      />
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
import { useVehicles } from '~/composables/useVehicles'
import { useCurrency } from '~/composables/useCurrency'

defineProps<{
  vehicles: any[]
  getStatusColor: (status: string) => string
  getTypeLabel: (type: string) => string
}>()

defineEmits<{
  view: [vehicle: any]
  edit: [vehicle: any]
  delete: [vehicle: any]
  'row-click': [vehicle: any]
}>()

const { getTypeIcon, getStatusIcon } = useVehicles()
const { formatCurrency } = useCurrency()

const headers = [
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'License Plate', key: 'licensePlate', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Rates (City/Province)', key: 'rates', sortable: false },
  { title: 'Mileage', key: 'mileage', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>

<style scoped lang="scss">
.vehicles-table :deep(tbody tr:hover) .icon-avatar {
  @apply scale-105;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.license-chip {
  @apply font-mono font-bold;
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  background: rgba(var(--v-theme-primary), 0.05);
  color: rgb(var(--v-theme-primary));
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
