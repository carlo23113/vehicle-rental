<template>
  <CommonPageLayout
    title="Locations"
    subtitle="Manage your rental office locations and service centers"
    action-text="Add Location"
    action-icon="mdi-plus"
    @action-click="handleAddLocation"
  >
    <!-- Filters Slot -->
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyLocationsFilters
        v-if="isFilterVisible || sections.stats"
        v-model:show-filters="showFilters"
        v-model:filters="filters"
        @clear="clearFilters"
      />
    </template>

    <!-- Stats Slot -->
    <template #stats>
      <LazyLocationsStatsCards :stats="stats" />
    </template>

    <!-- Main Content Slot -->
    <template #content>
      <LazyLocationsTableSection
        :displayed-items="displayedItems"
        :is-loading-more="isLoadingMore"
        :get-status-color="getStatusColor"
        @view="handleViewLocation"
        @edit="handleEditLocation"
        @delete="confirmDelete"
      />
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <LazyLocationsDeleteDialog
        v-if="showDeleteDialog"
        v-model="showDeleteDialog"
        :location="locationToDelete"
        :loading="deleting"
        @confirm="handleDelete"
        @cancel="handleCancelDelete"
      />
    </template>

    <!-- Snackbar Slot -->
    <template #snackbar>
      <CommonUiSnackbar v-model="snackbar" />
    </template>
  </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocations } from '~/composables/useLocations'
import { useSnackbar } from '~/composables/useSnackbar'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'
import { useLocationStats } from '~/composables/useLocationStats'
import type { Location } from '~/composables/useLocations'

const router = useRouter()
const { snackbar, showSuccess, showError } = useSnackbar()

const {
  locations,
  filters,
  filteredLocations,
  deleteLocation,
  getStatusColor,
} = useLocations()

// Stats calculation
const { stats } = useLocationStats(locations)

// Progressive table loading
const {
  displayedItems,
  isLoadingMore,
  updateDisplayedItems,
} = useProgressiveTable(filteredLocations, { batchSize: 20 })

// Debounced filters
useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: updateDisplayedItems
})

// UI state
const showFilters = ref(false)
const showDeleteDialog = ref(false)
const locationToDelete = ref<Location | null>(null)
const deleting = ref(false)

// DRY navigation helper
const navigateToRoute = (path: string) => router.push(path)
const handleAddLocation = () => navigateToRoute('/owner/locations/add')
const handleViewLocation = (location: Location) => navigateToRoute(`/owner/locations/${location.id}`)
const handleEditLocation = (location: Location) => navigateToRoute(`/owner/locations/edit/${location.id}`)

// DRY list removal helper
const removeFromList = (list: any[], id: number | string) => {
  const index = list.findIndex(l => l.id === id)
  if (index > -1) list.splice(index, 1)
}

const confirmDelete = (location: Location) => {
  locationToDelete.value = location
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!locationToDelete.value) return

  deleting.value = true

  try {
    deleteLocation(locationToDelete.value.id)

    // Remove from both lists
    removeFromList(locations.value, locationToDelete.value.id)
    removeFromList(displayedItems.value, locationToDelete.value.id)

    showSuccess(
      `${locationToDelete.value.name} has been deleted successfully.`
    )
    showDeleteDialog.value = false
    locationToDelete.value = null
  } catch (error) {
    console.error('Error deleting location:', error)
    showError('Failed to delete location. Please try again.')
  } finally {
    deleting.value = false
  }
}

const handleCancelDelete = () => {
  locationToDelete.value = null
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: 'all',
    type: 'all',
  }
}
</script>
