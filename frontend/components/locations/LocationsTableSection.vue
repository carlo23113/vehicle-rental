<template>
  <v-row>
    <v-col cols="12">
      <LocationsTable
        :locations="displayedItems"
        :get-status-color="getStatusColor"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more locations...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

defineProps<{
  displayedItems: Location[]
  isLoadingMore: boolean
  getStatusColor: (status: string) => string
}>()

defineEmits<{
  view: [location: Location]
  edit: [location: Location]
  delete: [location: Location]
}>()
</script>
