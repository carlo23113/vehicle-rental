<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Locations"
      subtitle="Manage your rental office locations and service centers"
      action-text="Add Location"
      action-icon="mdi-plus"
      @action-click="$router.push('/locations/add')"
    />

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <LocationFilters
          :filters="filters"
          :status-options="statusOptions"
          :type-options="typeOptions"
          @update:search="(val: string) => filters.search = val"
          @update:status="(val: any) => filters.status = val"
          @update:type="(val: any) => filters.type = val"
        />
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" lg="3">
        <CommonUiStatCard v-bind="stat" />
      </v-col>
    </v-row>

    <!-- Locations Table -->
    <v-row>
      <v-col cols="12">
        <LocationsTable
          :locations="filteredLocations"
          :get-status-color="getStatusColor"
          @view="viewLocation"
          @edit="editLocation"
          @delete="confirmDelete"
        />
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <CommonDialogDeleteConfirmation
      v-model="showDeleteDialog"
      title="Delete Location?"
      :item-name="locationToDelete ? locationToDelete.name : ''"
      :item-details="locationToDelete ? `${locationToDelete.city}, ${locationToDelete.state}` : ''"
      icon="mdi-map-marker-outline"
      message="This action is permanent and cannot be undone. All location data will be removed."
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="handleCancelDelete"
    />

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocations } from '~/composables/useLocations'
import { useSnackbar } from '~/composables/useSnackbar'
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

const showDeleteDialog = ref(false)
const locationToDelete = ref<Location | null>(null)
const deleting = ref(false)

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
]

const typeOptions = [
  { title: 'All Types', value: 'all' },
  { title: 'Main Office', value: 'main' },
  { title: 'Branch Location', value: 'branch' },
]

// Optimized stats - compute once instead of filtering multiple times
const stats = computed(() => {
  const active = locations.value.filter(l => l.status === 'active').length
  const inactive = locations.value.filter(l => l.status === 'inactive').length
  const totalCapacity = locations.value.reduce((sum, l) => sum + l.capacity, 0)

  return [
    {
      icon: 'mdi-map-marker-check',
      label: 'Active Locations',
      value: active,
      color: 'success'
    },
    {
      icon: 'mdi-map-marker-off',
      label: 'Inactive',
      value: inactive,
      color: 'warning'
    },
    {
      icon: 'mdi-map-marker',
      label: 'Total Locations',
      value: locations.value.length,
      color: 'info'
    },
    {
      icon: 'mdi-garage',
      label: 'Total Capacity',
      value: totalCapacity,
      color: 'primary'
    }
  ]
})

const viewLocation = (location: Location) => {
  router.push(`/locations/${location.id}`)
}

const editLocation = (location: Location) => {
  router.push(`/locations/edit/${location.id}`)
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
</script>
