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
        <div class="vehicle-avatar">
          <v-icon icon="mdi-car" size="24" color="primary" />
        </div>
        <div>
          <div class="font-bold text-base">{{ item.make }} {{ item.model }}</div>
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
      <v-chip :color="getStatusColor(item.status)" size="small" variant="flat" class="status-chip">
        <v-icon :icon="getStatusIcon(item.status)" start size="14" />
        {{ item.status.replace('-', ' ') }}
      </v-chip>
    </template>

    <template #item.rates="{ item }">
      <div class="rates-display">
        <div class="rate-row">
          <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-city">
            {{ formatCurrency(item.rates.cityRate) }}/day
          </v-chip>
        </div>
        <div class="rate-row mt-1">
          <v-chip size="small" variant="tonal" color="secondary" prepend-icon="mdi-map-marker-distance">
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
      <div class="flex gap-2" @click.stop>
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="tonal"
          color="info"
          class="action-btn"
          @click="$emit('view', item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="tonal"
          color="primary"
          class="action-btn"
          @click="$emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="tonal"
          color="error"
          class="action-btn"
          @click="$emit('delete', item)"
        />
      </div>
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

<style scoped>
.vehicles-table :deep(tbody tr:hover) .vehicle-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.vehicle-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1) 0%,
    rgba(var(--v-theme-secondary), 0.1) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  transition: all 0.3s ease;
}

.license-chip {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  background: rgba(var(--v-theme-primary), 0.05);
  color: rgb(var(--v-theme-primary));
}

.status-chip {
  text-transform: capitalize;
  font-weight: 600;
}

.rates-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.rate-row {
  display: flex;
  align-items: center;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}
</style>
