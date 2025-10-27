<template>
  <v-row>
    <v-col cols="12">
      <VehiclesTable
        :vehicles="vehicles"
        :get-status-color="getStatusColor"
        :get-type-label="getTypeLabel"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @row-click="$emit('row-click', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more vehicles...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  vehicles: any[]
  isLoadingMore: boolean
  getStatusColor: (status: string) => string
  getTypeLabel: (type: string) => string
}>()

defineEmits<{
  view: [vehicle: any]
  edit: [vehicle: any]
  delete: [vehicle: any]
  'row-click': [vehicle: any]
}>()
</script>
