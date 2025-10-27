<template>
  <CommonUiDataTable
    :headers="headers"
    :items="records"
    :items-per-page="10"
    table-class="maintenance-table"
    empty-icon="mdi-tools"
    empty-title="No maintenance records found"
    empty-message="Try adjusting your filters or schedule new maintenance"
    @row-click="$emit('view', $event)"
  >
    <template #item.vehicle="{ item }">
      <div class="flex items-center py-3">
        <CommonUiIconAvatar icon="mdi-car-wrench" :size="40" :icon-size="20" avatar-class="mr-3" />
        <div>
          <div class="font-bold text-base">{{ item.vehicleName }}</div>
          <v-chip size="x-small" variant="outlined" class="mt-1 license-chip">
            {{ item.licensePlate }}
          </v-chip>
        </div>
      </div>
    </template>

    <template #item.type="{ item }">
      <div>
        <div class="font-semibold text-body-2">{{ getTypeLabel(item.type) }}</div>
        <div class="text-xs text-medium-emphasis mt-1">{{ item.mileage.toLocaleString() }} mi</div>
      </div>
    </template>

    <template #item.description="{ item }">
      <div class="description-cell">
        <div class="text-body-2">{{ item.description }}</div>
        <div v-if="item.performedBy" class="text-xs text-medium-emphasis mt-1">
          By: {{ item.performedBy }}
        </div>
      </div>
    </template>

    <template #item.date="{ item }">
      <div>
        <div class="text-body-2">{{ formatDate(item.scheduledDate) }}</div>
        <div v-if="item.completedDate" class="text-xs text-success mt-1">
          Done: {{ formatDate(item.completedDate) }}
        </div>
      </div>
    </template>

    <template #item.status="{ item }">
      <CommonUiTableChip
        :color="getStatusColor(item.status)"
        :icon="getStatusIcon(item.status)"
        :label="item.status"
        chip-class="status-chip"
      />
    </template>

    <template #item.priority="{ item }">
      <CommonUiTableChip
        :color="getPriorityColor(item.priority)"
        :icon="getPriorityIcon(item.priority)"
        :label="item.priority"
        chip-class="priority-chip"
      />
    </template>

    <template #item.cost="{ item }">
      <div class="amount-display">
        <div class="text-lg font-bold">{{ formatCurrency(item.cost) }}</div>
      </div>
    </template>

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        @view="$emit('view', item)"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item)"
      >
        <template #prepend>
          <CommonUiTableActionButton
            v-if="item.status === 'scheduled' || item.status === 'in-progress'"
            icon="mdi-check"
            tooltip="Mark Complete"
            color="success"
            @click="$emit('complete', item)"
          />
        </template>
      </CommonUiTableActionButtons>
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCurrency } from '~/composables/useCurrency'

const router = useRouter()

defineProps<{
  records: any[]
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  getPriorityColor: (priority: string) => string
  getTypeLabel: (type: string) => string
}>()

const emit = defineEmits<{
  view: [record: any]
  edit: [record: any]
  delete: [record: any]
  complete: [record: any]
}>()

const { formatCurrency } = useCurrency()

const handleRowClick = (_event: any, row: any) => {
  router.push(`/owner/maintenance/${row.item.id}`)
}

const headers = [
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Type & Mileage', key: 'type', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Priority', key: 'priority', sortable: true },
  { title: 'Cost', key: 'cost', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    scheduled: 'mdi-calendar-clock',
    'in-progress': 'mdi-wrench',
    completed: 'mdi-check-circle',
    cancelled: 'mdi-cancel',
  }
  return icons[status] || 'mdi-help-circle'
}

const getPriorityIcon = (priority: string) => {
  const icons: Record<string, string> = {
    low: 'mdi-flag-outline',
    medium: 'mdi-flag',
    high: 'mdi-flag',
    urgent: 'mdi-alert',
  }
  return icons[priority] || 'mdi-flag-outline'
}
</script>

<style scoped lang="scss">
.maintenance-table :deep(tbody tr) {
  @apply cursor-pointer;
}

.maintenance-table :deep(tbody tr:hover) .icon-avatar {
  @apply scale-105;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.license-chip {
  @apply font-mono font-bold;
  border: 1.5px solid rgba(var(--v-theme-on-surface), 0.2);
}

.status-chip {
  @apply capitalize font-semibold;
}

.priority-chip {
  @apply capitalize font-semibold;
}

.description-cell {
  @apply max-w-xs;
}

.amount-display {
  @apply flex flex-col gap-0.5;
}
</style>
