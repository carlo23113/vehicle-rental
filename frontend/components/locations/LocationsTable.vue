<template>
  <CommonUiDataTable :headers="headers" :items="locations" :items-per-page="10">
    <!-- Name & Address Column -->
    <template #item.name="{ item }">
      <div>
        <div class="font-weight-semibold d-flex align-center ga-2">
          <v-icon
            :icon="item.type === 'main' ? 'mdi-office-building' : 'mdi-map-marker'"
            size="16"
            :color="item.type === 'main' ? 'primary' : 'default'"
          />
          {{ item.name }}
        </div>
        <div class="text-caption text-medium-emphasis mt-1">{{ item.address }}</div>
        <div class="text-caption text-medium-emphasis">
          {{ item.city }}, {{ item.state }} {{ item.zipCode }}
        </div>
      </div>
    </template>

    <!-- Contact Column -->
    <template #item.contact="{ item }">
      <div class="text-body-2">
        <div class="d-flex align-center ga-1">
          <v-icon icon="mdi-phone" size="14" />
          {{ item.phone }}
        </div>
        <div class="d-flex align-center ga-1 mt-1">
          <v-icon icon="mdi-email" size="14" />
          {{ item.email }}
        </div>
      </div>
    </template>

    <!-- Operating Hours Column -->
    <template #item.hours="{ item }">
      <div class="text-body-2">
        <div class="d-flex align-center ga-1">
          <v-icon icon="mdi-calendar-week" size="14" />
          <span class="text-caption">Weekday:</span>
          {{ item.operatingHours.weekday }}
        </div>
        <div class="d-flex align-center ga-1 mt-1">
          <v-icon icon="mdi-calendar-weekend" size="14" />
          <span class="text-caption">Weekend:</span>
          {{ item.operatingHours.weekend }}
        </div>
      </div>
    </template>

    <!-- Capacity & Facilities Column -->
    <template #item.capacity="{ item }">
      <div class="d-flex flex-column ga-1">
        <v-chip size="small" variant="tonal" color="primary">
          <v-icon icon="mdi-garage" start />
          {{ item.capacity }} vehicles
        </v-chip>
        <v-chip
          v-if="item.hasMaintenanceFacility"
          size="small"
          variant="tonal"
          color="warning"
        >
          <v-icon icon="mdi-tools" start />
          Maintenance
        </v-chip>
      </div>
    </template>

    <!-- Status Column -->
    <template #item.status="{ item }">
      <v-chip :color="item.status === 'active' ? 'success' : 'error'" size="small" variant="tonal">
        <v-icon
          :icon="item.status === 'active' ? 'mdi-check-circle' : 'mdi-close-circle'"
          start
        />
        {{ item.status }}
      </v-chip>
    </template>

    <!-- Actions Column -->
    <template #item.actions="{ item }">
      <div class="d-flex ga-1">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          color="primary"
          @click="$emit('view', item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          color="warning"
          @click="$emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="$emit('delete', item)"
        />
      </div>
    </template>

    <!-- Empty State -->
    <template #no-data>
      <div class="text-center py-8">
        <v-icon icon="mdi-map-marker-off" size="64" color="grey-lighten-1" />
        <div class="text-h6 mt-4">No locations found</div>
        <div class="text-body-2 text-medium-emphasis mt-2">
          Add your first location to get started
        </div>
      </div>
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

defineProps<{
  locations: Location[]
}>()

defineEmits<{
  view: [location: Location]
  edit: [location: Location]
  delete: [location: Location]
}>()

const headers = [
  { title: 'Location & Address', key: 'name', sortable: true },
  { title: 'Contact', key: 'contact', sortable: false },
  { title: 'Operating Hours', key: 'hours', sortable: false },
  { title: 'Capacity & Facilities', key: 'capacity', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]
</script>
