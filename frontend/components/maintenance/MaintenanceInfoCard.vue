<template>
  <CommonUiDetailCard title="Maintenance Information" icon="mdi-information">
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Type</div>
        <div class="info-value">
          <v-icon :icon="getTypeIcon(maintenance.type)" size="18" class="mr-2" />
          {{ typeLabel }}
        </div>
      </div>

      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">
          <v-chip
            :color="getStatusColor(maintenance.status)"
            size="small"
            variant="flat"
            class="status-chip"
          >
            <v-icon :icon="getStatusIcon(maintenance.status)" start size="14" />
            {{ maintenance.status }}
          </v-chip>
        </div>
      </div>

      <div class="info-item">
        <div class="info-label">Priority</div>
        <div class="info-value">
          <v-chip
            :color="getPriorityColor(maintenance.priority)"
            size="small"
            variant="flat"
            class="priority-chip"
          >
            <v-icon :icon="getPriorityIcon(maintenance.priority)" start size="14" />
            {{ maintenance.priority }}
          </v-chip>
        </div>
      </div>

      <div class="info-item">
        <div class="info-label">Scheduled Date</div>
        <div class="info-value">
          <v-icon icon="mdi-calendar" size="18" class="mr-2" />
          {{ formatDate(maintenance.scheduledDate) }}
        </div>
      </div>

      <div v-if="maintenance.completedDate" class="info-item">
        <div class="info-label">Completed Date</div>
        <div class="info-value text-success">
          <v-icon icon="mdi-calendar-check" size="18" class="mr-2" />
          {{ formatDate(maintenance.completedDate) }}
        </div>
      </div>

      <div class="info-item">
        <div class="info-label">Current Mileage</div>
        <div class="info-value">
          <v-icon icon="mdi-speedometer" size="18" class="mr-2" />
          {{ maintenance.mileage?.toLocaleString() || 'N/A' }} miles
        </div>
      </div>
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
defineProps<{
  maintenance: any
  typeLabel: string
  getStatusColor: (status: string) => string
  getPriorityColor: (priority: string) => string
  formatDate: (date: string) => string
}>()

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'oil-change': 'mdi-oil',
    'tire-rotation': 'mdi-tire',
    'brake-service': 'mdi-car-brake-abs',
    'inspection': 'mdi-magnify',
    'repair': 'mdi-wrench',
    'cleaning': 'mdi-car-wash',
    'other': 'mdi-tools',
  }
  return icons[type] || 'mdi-tools'
}

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

<style scoped>
.info-grid {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.info-item {
  @apply flex flex-col gap-1;
}

.info-label {
  @apply text-xs font-medium uppercase tracking-wide;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.info-value {
  @apply text-base font-semibold flex items-center;
}

.status-chip,
.priority-chip {
  @apply capitalize font-semibold;
}
</style>
