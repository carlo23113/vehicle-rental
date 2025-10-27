<template>
  <CommonUiDataTable
    :headers="headers"
    :items="locations"
    :items-per-page="10"
    table-class="locations-table"
    empty-icon="mdi-map-marker-off"
    empty-title="No locations found"
    empty-message="Try adjusting your filters or add a new location"
    @row-click="$emit('view', $event)"
  >
    <template #item.location="{ item }">
      <div class="flex items-center py-3">
        <CommonUiIconAvatar
          :icon="item.type === 'main' ? 'mdi-office-building' : 'mdi-map-marker'"
          :size="40"
          :icon-size="20"
          avatar-class="location-avatar mr-3"
        />
        <div>
          <div class="font-bold">{{ item.name }}</div>
          <div class="text-xs text-medium-emphasis">
            {{ item.type === 'main' ? 'Main Office' : 'Branch Location' }}
          </div>
        </div>
      </div>
    </template>

    <template #item.address="{ item }">
      <div>
        <div class="text-body-2">{{ item.address }}</div>
        <div class="text-xs text-medium-emphasis">
          {{ item.city }}, {{ item.state }} {{ item.zipCode }}
        </div>
      </div>
    </template>

    <template #item.contact="{ item }">
      <div>
        <div class="text-body-2">{{ item.phone }}</div>
        <div class="text-xs text-medium-emphasis">{{ item.email }}</div>
      </div>
    </template>

    <template #item.status="{ item }">
      <CommonUiTableChip
        :color="getStatusColor(item.status)"
        :label="item.status"
        chip-class="status-chip"
      />
    </template>

    <template #item.capacity="{ item }">
      <div class="font-bold text-base">{{ item.capacity }} vehicles</div>
    </template>

    <template #item.actions="{ item }">
      <CommonUiTableActionButtons
        edit-tooltip="Edit Location"
        @view="$emit('view', item)"
        @edit="$emit('edit', item)"
        @delete="$emit('delete', item)"
      />
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
.status-chip {
  @apply rounded-lg font-bold;
}
</style>
