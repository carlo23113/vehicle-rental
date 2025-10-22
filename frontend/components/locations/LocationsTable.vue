<template>
  <CommonUiDataTable
    :headers="headers"
    :items="locations"
    :items-per-page="10"
    table-class="locations-table"
    empty-icon="mdi-map-marker-off"
    empty-title="No locations found"
    empty-message="Try adjusting your filters or add a new location"
  >
    <!-- Location & Type Column -->
    <template #item.location="{ item }">
      <div class="flex items-center py-3">
        <v-avatar
          :color="item.type === 'main' ? 'primary' : 'info'"
          size="48"
          class="location-avatar"
        >
          <v-icon
            :icon="item.type === 'main' ? 'mdi-office-building' : 'mdi-map-marker'"
            size="24"
          />
        </v-avatar>
        <div class="ml-3">
          <div class="font-bold text-base">{{ item.name }}</div>
          <div class="text-xs text-medium-emphasis">
            {{ item.type === 'main' ? 'Main Office' : 'Branch Location' }}
          </div>
        </div>
      </div>
    </template>

    <!-- Address Column -->
    <template #item.address="{ item }">
      <div>
        <div class="text-body-2">{{ item.address }}</div>
        <div class="text-xs text-medium-emphasis">
          {{ item.city }}, {{ item.state }} {{ item.zipCode }}
        </div>
      </div>
    </template>

    <!-- Contact Column -->
    <template #item.contact="{ item }">
      <div>
        <div class="text-body-2">{{ item.phone }}</div>
        <div class="text-xs text-medium-emphasis">{{ item.email }}</div>
      </div>
    </template>

    <!-- Status Column -->
    <template #item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)" size="small" variant="flat" class="status-chip">
        {{ item.status }}
      </v-chip>
    </template>

    <!-- Capacity Column -->
    <template #item.capacity="{ item }">
      <div>
        <div class="font-bold text-base">{{ item.capacity }} vehicles</div>
      </div>
    </template>

    <!-- Actions Column -->
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
import type { Location } from '~/composables/useLocations'

defineProps<{
  locations: Location[]
  getStatusColor: (status: string) => string
}>()

defineEmits<{
  view: [location: Location]
  edit: [location: Location]
  delete: [location: Location]
}>()

const headers = [
  { title: 'Location', key: 'location', sortable: true },
  { title: 'Address', key: 'address', sortable: true },
  { title: 'Contact', key: 'contact', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Capacity', key: 'capacity', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>

<style lang="scss" scoped>
.location-avatar {
  @apply transition-all duration-300;
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.18),
    0 0 0 3px rgba(255, 255, 255, 0.1);
}

.locations-table :deep(tbody tr:hover) .location-avatar {
  @apply scale-105;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.25),
    0 0 0 3px rgba(var(--v-theme-primary), 0.2);
}

.status-chip {
  @apply rounded-lg font-bold;
}

.action-btn {
  @apply transition-all duration-200;

  &:hover {
    @apply scale-110;
  }
}
</style>
