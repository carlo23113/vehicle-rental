<template>
  <CommonPageContainer>
    <CommonPageHeader
      title="Vehicles"
      subtitle="Manage your fleet inventory"
      action-text="Add Vehicle"
      action-icon="mdi-plus"
      @action-click="$router.push('/vehicles/add')"
    />

    <v-row class="mb-6">
      <v-col cols="12">
        <VehicleFilters
          :filters="filters"
          :status-options="statusOptions"
          :type-options="typeOptions"
          @update:search="(val: string) => (filters.search = val)"
          @update:status="(val: any) => (filters.status = val)"
          @update:type="(val: any) => (filters.type = val)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <VehiclesTable
          :vehicles="filteredVehicles"
          :get-status-color="getStatusColor"
          :get-type-label="getTypeLabel"
          @view="viewVehicle"
          @edit="editVehicle"
          @delete="confirmDelete"
          @row-click="viewVehicle"
        />
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <CommonDialogDeleteConfirmation
      v-model="showDeleteDialog"
      title="Delete Vehicle?"
      :item-name="vehicleToDelete ? `${vehicleToDelete.make} ${vehicleToDelete.model}` : ''"
      :item-details="vehicleToDelete ? `${vehicleToDelete.licensePlate} · ${vehicleToDelete.year}` : ''"
      icon="mdi-car-outline"
      message="This action is permanent and cannot be undone"
      :loading="deleting"
      @confirm="deleteVehicle"
      @cancel="handleCancelDelete"
    />

    <CommonUiSnackbar v-model="snackbar" />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicles } from '~/composables/useVehicles'
import { useSnackbar } from '~/composables/useSnackbar'

const router = useRouter()
const { filters, filteredVehicles, getStatusColor, getTypeLabel, vehicles } = useVehicles()
const { snackbar, showSuccess, showError } = useSnackbar()

const showDeleteDialog = ref(false)
const vehicleToDelete = ref<any>(null)
const deleting = ref(false)

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Available', value: 'available' },
  { title: 'Rented', value: 'rented' },
  { title: 'Maintenance', value: 'maintenance' },
  { title: 'Out of Service', value: 'out-of-service' },
]

const typeOptions = [
  { title: 'All Types', value: 'all' },
  { title: 'Sedan', value: 'sedan' },
  { title: 'SUV', value: 'suv' },
  { title: 'Truck', value: 'truck' },
  { title: 'Van', value: 'van' },
  { title: 'Electric', value: 'electric' },
  { title: 'Luxury', value: 'luxury' },
]

const viewVehicle = (vehicle: any) => {
  router.push(`/vehicles/${vehicle.id}`)
}

const editVehicle = (vehicle: any) => {
  router.push(`/vehicles/edit/${vehicle.id}`)
}

const confirmDelete = (vehicle: any) => {
  vehicleToDelete.value = vehicle
  showDeleteDialog.value = true
}

const deleteVehicle = async () => {
  if (!vehicleToDelete.value) return

  deleting.value = true

  try {
    // TODO: Implement API call to delete vehicle
    console.log('Deleting vehicle:', vehicleToDelete.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Remove vehicle from the list
    const index = vehicles.value.findIndex(v => v.id === vehicleToDelete.value.id)
    if (index > -1) {
      vehicles.value.splice(index, 1)
    }

    showSuccess(
      `${vehicleToDelete.value.make} ${vehicleToDelete.value.model} has been deleted successfully.`
    )
    showDeleteDialog.value = false
    vehicleToDelete.value = null
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    showError('Failed to delete vehicle. Please try again.')
  } finally {
    deleting.value = false
  }
}

const handleCancelDelete = () => {
  vehicleToDelete.value = null
}
</script>
