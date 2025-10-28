<template>
  <v-row>
    <v-col cols="12">
      <!-- Table Controls: Bulk Selection & Column Visibility -->
      <CommonUiTableControlsBar
        v-if="enableBulkActions"
        v-model="bulkSelectMode"
        :selected-count="selectedRentals.length"
        toggle-label="Bulk Selection"
        item-label="rental"
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

      <RentalsTable
        ref="rentalsTableRef"
        v-model:selected-rentals="selectedRentals"
        :rentals="rentals"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
        :get-payment-status-color="getPaymentStatusColor"
        :show-select="bulkSelectMode"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @generate-invoice="$emit('generate-invoice', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more rentals...</p>
      </div>

      <!-- Bulk Actions Bar -->
      <CommonUiBulkActionsBar
        v-if="enableBulkActions"
        :selected-count="selectedRentals.length"
        :selected-items="selectedRentals"
        item-label="rental"
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

          <v-btn
            variant="elevated"
            prepend-icon="mdi-file-export"
            color="white"
            @click="handleBulkExport"
          >
            Export Selected
          </v-btn>

          <v-btn
            v-if="hasActiveRentals"
            variant="elevated"
            prepend-icon="mdi-file-document-multiple"
            color="white"
            @click="handleBulkInvoice"
          >
            Generate Invoices
          </v-btn>
        </template>
      </CommonUiBulkActionsBar>

      <!-- Bulk Status Dialog -->
      <RentalBulkStatusDialog
        v-if="enableBulkActions"
        v-model="statusDialogOpen"
        :selected-rentals="selectedRentals"
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
  rentals: any[]
  isLoadingMore: boolean
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  getPaymentStatusColor: (status: string) => string
  enableBulkActions?: boolean
}>()

const emit = defineEmits<{
  view: [rental: any]
  edit: [rental: any]
  delete: [rental: any]
  'generate-invoice': [rental: any]
  'update:selected-rentals': [rentals: any[]]
  'bulk-status-update': [payload: { rentals: any[]; status: string; notes: string }]
  'bulk-export': [rentals: any[]]
  'bulk-invoice': [rentals: any[]]
}>()

// Bulk selection state
const bulkSelectMode = ref(false)
const selectedRentals = ref<any[]>([])
const statusDialogOpen = ref(false)
const statusUpdateLoading = ref(false)

// Column visibility - access child component methods
const rentalsTableRef = ref<any>(null)

const tableColumns = computed(() => rentalsTableRef.value?.allColumns || [])
const visibleColumnsCount = computed(() => rentalsTableRef.value?.visibleCount || 0)
const hiddenColumnsCount = computed(() => rentalsTableRef.value?.hiddenCount || 0)

const isColumnVisible = (key: string) => {
  return rentalsTableRef.value?.isColumnVisible(key) ?? true
}

const toggleColumn = (key: string) => {
  rentalsTableRef.value?.toggleColumn(key)
}

const showAllColumns = () => {
  rentalsTableRef.value?.showAllColumns()
}

const resetColumns = () => {
  rentalsTableRef.value?.resetToDefaults()
}

const clearSelection = () => {
  selectedRentals.value = []
}

const openStatusDialog = () => {
  if (selectedRentals.value.length === 0) return
  statusDialogOpen.value = true
}

const handleBulkStatusUpdate = (payload: { status: string; notes: string }) => {
  statusUpdateLoading.value = true
  emit('bulk-status-update', {
    rentals: selectedRentals.value,
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

const handleBulkExport = () => {
  emit('bulk-export', selectedRentals.value)
}

const handleBulkInvoice = () => {
  emit('bulk-invoice', selectedRentals.value)
}

// Check if any selected rentals are active (for invoice generation)
const hasActiveRentals = computed(() => {
  return selectedRentals.value.some(rental => rental.status === 'active' || rental.status === 'reserved')
})

// Emit selected rentals changes
watch(selectedRentals, (newValue) => {
  emit('update:selected-rentals', newValue)
}, { deep: true })

// Clear selection when bulk mode is disabled
watch(bulkSelectMode, newValue => {
  if (!newValue) {
    clearSelection()
  }
})
</script>
