<template>
  <CommonPageContainer>
    <CommonPagePageHeader
      title="Locations"
      subtitle="Manage your rental office locations and service centers"
      show-breadcrumbs
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="$router.push('/locations/add')">
          Add Location
        </v-btn>
      </template>
    </CommonPagePageHeader>

    <!-- Statistics Cards -->
    <v-row>
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-medium-emphasis mb-1">{{ stat.label }}</div>
                <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
              </div>
              <v-avatar :color="stat.color" size="48" variant="tonal">
                <v-icon :icon="stat.icon" size="24" />
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Locations Table -->
    <v-card class="mt-6">
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <div>
          <div class="text-h6">All Locations</div>
          <div class="text-caption text-medium-emphasis mt-1">
            {{ locations.length }} total locations
          </div>
        </div>
        <v-text-field
          v-model="search"
          placeholder="Search locations..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          style="max-width: 300px"
        />
      </v-card-title>
      <v-divider />
      <LocationsTable
        :locations="filteredLocations"
        @view="handleViewLocation"
        @edit="handleEditLocation"
        @delete="handleDeleteLocation"
      />
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <CommonDialogDeleteConfirmation
      v-model="deleteDialog"
      :title="`Delete ${locationToDelete?.name}?`"
      message="This action cannot be undone. All associated data will be permanently removed."
      :loading="deleteLoading"
      @confirm="confirmDelete"
    />

    <!-- Snackbar -->
    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocations } from '~/composables/useLocations'
import type { Location } from '~/composables/useLocations'

const { locations, deleteLocation } = useLocations()

const search = ref('')
const deleteDialog = ref(false)
const deleteLoading = ref(false)
const locationToDelete = ref<Location | null>(null)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success' as 'success' | 'error' | 'warning' | 'info',
})

// Filtered locations based on search
const filteredLocations = computed(() => {
  if (!search.value) return locations.value

  const searchLower = search.value.toLowerCase()
  return locations.value.filter(
    location =>
      location.name.toLowerCase().includes(searchLower) ||
      location.city.toLowerCase().includes(searchLower) ||
      location.address.toLowerCase().includes(searchLower) ||
      location.email.toLowerCase().includes(searchLower)
  )
})

// Statistics
const stats = computed(() => {
  const active = locations.value.filter(l => l.status === 'active').length
  const inactive = locations.value.filter(l => l.status === 'inactive').length
  const withMaintenance = locations.value.filter(l => l.hasMaintenanceFacility).length
  const totalCapacity = locations.value.reduce((sum, l) => sum + l.capacity, 0)

  return [
    { icon: 'mdi-map-marker-check', label: 'Active Locations', value: active, color: 'success' },
    { icon: 'mdi-map-marker-off', label: 'Inactive', value: inactive, color: 'error' },
    {
      icon: 'mdi-tools',
      label: 'With Maintenance',
      value: withMaintenance,
      color: 'warning',
    },
    { icon: 'mdi-garage', label: 'Total Capacity', value: totalCapacity, color: 'primary' },
  ]
})

const handleViewLocation = (location: Location) => {
  navigateTo(`/locations/${location.id}`)
}

const handleEditLocation = (location: Location) => {
  navigateTo(`/locations/edit/${location.id}`)
}

const handleDeleteLocation = (location: Location) => {
  locationToDelete.value = location
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!locationToDelete.value) return

  deleteLoading.value = true
  try {
    const success = deleteLocation(locationToDelete.value.id)
    if (success) {
      snackbar.value = {
        show: true,
        message: `Location "${locationToDelete.value.name}" has been deleted successfully`,
        color: 'success',
      }
      deleteDialog.value = false
      locationToDelete.value = null
    } else {
      throw new Error('Failed to delete location')
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to delete location. Please try again.',
      color: 'error',
    }
  } finally {
    deleteLoading.value = false
  }
}
</script>
