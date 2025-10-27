<template>
  <v-row>
    <v-col cols="12">
      <MaintenanceTable
        :records="displayedItems"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
        :get-priority-color="getPriorityColor"
        :get-type-label="getTypeLabel"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @complete="$emit('complete', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more records...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  displayedItems: any[]
  isLoadingMore: boolean
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  getPriorityColor: (priority: string) => string
  getTypeLabel: (type: string) => string
}>()

defineEmits<{
  view: [record: any]
  edit: [record: any]
  delete: [record: any]
  complete: [record: any]
}>()
</script>
