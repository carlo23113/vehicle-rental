<template>
  <v-row>
    <v-col cols="12">
      <!-- Table Controls: Bulk Selection & Column Visibility -->
      <CommonUiTableControlsBar
        v-if="enableBulkActions"
        v-model="bulkSelectMode"
        :selected-count="selectedVehicles.length"
        toggle-label="Bulk Selection"
        item-label="vehicle"
        @clear-selection="clearSelection"
      >
        <template #right-actions>
          <CommonUiColumnVisibilityMenu
            :columns="tableColumns"
            :visible-count="visibleColumnsCount"
            :hidden-count="hiddenColumnsCount"
            :total-count="tableColumns.length"
            :is-column-visible="isColumnVisible"
            @toggle="toggleColumn"
            @show-all="showAllColumns"
            @reset="resetColumns"
          />
        </template>
      </CommonUiTableControlsBar>

      <VehiclesTable
        ref="vehiclesTableRef"
        v-model:selected-vehicles="selectedVehicles"
        :vehicles="vehicles"
        :get-status-color="getStatusColor"
        :get-type-label="getTypeLabel"
        :show-select="bulkSelectMode"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @row-click="$emit('row-click', $event)"
        @status-action="$emit('status-action', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more vehicles...</p>
      </div>

      <!-- Bulk Actions Bar -->
      <CommonUiBulkActionsBar
        v-if="enableBulkActions"
        :selected-count="selectedVehicles.length"
        :selected-items="selectedVehicles"
        item-label="vehicle"
        @clear-selection="clearSelection"
      >
        <template #actions>
          <v-btn
            variant="elevated"
            prepend-icon="mdi-swap-horizontal"
            color="white"
            @click="openStatusDialog"
          >
            Change Status
          </v-btn>
        </template>
      </CommonUiBulkActionsBar>

      <!-- Bulk Status Dialog -->
      <VehicleBulkStatusDialog
        v-if="enableBulkActions"
        v-model="statusDialogOpen"
        :selected-vehicles="selectedVehicles"
        :loading="statusUpdateLoading"
        @confirm="handleBulkStatusUpdate"
        @cancel="statusDialogOpen = false"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  vehicles: any[]
  isLoadingMore: boolean
  getStatusColor: (status: string) => string
  getTypeLabel: (type: string) => string
  enableBulkActions?: boolean
}>()

const emit = defineEmits<{
  view: [vehicle: any]
  edit: [vehicle: any]
  delete: [vehicle: any]
  'row-click': [vehicle: any]
  'bulk-status-update': [payload: { vehicles: any[]; status: string; notes: string }]
  'status-action': [payload: { action: string; item: any }]
}>()

// Template ref for child table component
const vehiclesTableRef = ref<any>(null)

// Bulk selection state
const bulkSelectMode = ref(false)
const selectedVehicles = ref<any[]>([])
const statusDialogOpen = ref(false)
const statusUpdateLoading = ref(false)

// Column visibility - proxy to child table
const tableColumns = computed(() => vehiclesTableRef.value?.allColumns || [])
const visibleColumnsCount = computed(() => vehiclesTableRef.value?.visibleCount || 0)
const hiddenColumnsCount = computed(() => vehiclesTableRef.value?.hiddenCount || 0)

const isColumnVisible = (key: string) => {
  return vehiclesTableRef.value?.isColumnVisible(key) ?? true
}

const toggleColumn = (key: string) => {
  vehiclesTableRef.value?.toggleColumn(key)
}

const showAllColumns = () => {
  vehiclesTableRef.value?.showAllColumns()
}

const resetColumns = () => {
  vehiclesTableRef.value?.resetToDefaults()
}

const clearSelection = () => {
  selectedVehicles.value = []
}

const openStatusDialog = () => {
  if (selectedVehicles.value.length === 0) return
  statusDialogOpen.value = true
}

const handleBulkStatusUpdate = (payload: { status: string; notes: string }) => {
  statusUpdateLoading.value = true
  emit('bulk-status-update', {
    vehicles: selectedVehicles.value,
    status: payload.status,
    notes: payload.notes,
  })

  // Simulate async operation - parent component should handle this
  setTimeout(() => {
    statusUpdateLoading.value = false
    statusDialogOpen.value = false
    clearSelection()
  }, 1000)
}

// Clear selection when bulk mode is disabled
watch(bulkSelectMode, newValue => {
  if (!newValue) {
    clearSelection()
  }
})
</script>
