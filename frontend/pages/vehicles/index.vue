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
        <VehiclesVehicleFilters
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
    <v-dialog v-model="showDeleteDialog" max-width="540" persistent>
      <v-card class="delete-dialog">
        <!-- Header with Icon -->
        <div class="delete-dialog-header">
          <div class="delete-icon-wrapper">
            <div class="delete-icon-bg">
              <v-icon icon="mdi-alert-circle-outline" size="48" color="white" />
            </div>
          </div>
        </div>

        <v-card-text class="px-6 pb-0 pt-6">
          <div class="text-center mb-4">
            <h2 class="text-h5 font-weight-bold mb-2">Delete Vehicle?</h2>
            <p class="text-body-2 text-medium-emphasis">
              This action cannot be undone. All data associated with this vehicle will be permanently removed.
            </p>
          </div>

          <!-- Vehicle Details Card -->
          <v-card v-if="vehicleToDelete" variant="tonal" class="delete-vehicle-card mb-4">
            <v-card-text class="pa-4">
              <div class="d-flex align-start gap-3">
                <div class="vehicle-icon-wrapper">
                  <v-icon icon="mdi-car" size="32" color="primary" />
                </div>
                <div class="flex-grow-1">
                  <div class="text-h6 font-weight-bold mb-2">
                    {{ vehicleToDelete.make }} {{ vehicleToDelete.model }}
                  </div>
                  <div class="vehicle-details">
                    <div class="detail-item">
                      <v-icon icon="mdi-card-account-details" size="16" class="mr-1" />
                      <span>{{ vehicleToDelete.licensePlate }}</span>
                    </div>
                    <div class="detail-item">
                      <v-icon icon="mdi-calendar" size="16" class="mr-1" />
                      <span>{{ vehicleToDelete.year }}</span>
                    </div>
                    <div class="detail-item">
                      <v-icon icon="mdi-car-info" size="16" class="mr-1" />
                      <span>{{ getTypeLabel(vehicleToDelete.type) }}</span>
                    </div>
                    <div class="detail-item">
                      <v-chip
                        :color="getStatusColor(vehicleToDelete.status)"
                        size="small"
                        variant="flat"
                      >
                        {{ vehicleToDelete.status.replace('-', ' ') }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Warning Alert -->
          <v-alert
            type="error"
            variant="tonal"
            density="compact"
            class="mb-0"
          >
            <template #prepend>
              <v-icon icon="mdi-alert" />
            </template>
            <div class="text-body-2">
              <strong>Warning:</strong> This will permanently delete all vehicle records, rental history, and associated data.
            </div>
          </v-alert>
        </v-card-text>

        <v-card-actions class="px-6 pb-6 pt-4">
          <v-btn
            variant="outlined"
            size="large"
            @click="showDeleteDialog = false"
            :disabled="deleting"
            class="flex-grow-1"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            size="large"
            @click="deleteVehicle"
            :loading="deleting"
            prepend-icon="mdi-delete"
            class="flex-grow-1"
          >
            Delete Vehicle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

    showSuccess(`${vehicleToDelete.value.make} ${vehicleToDelete.value.model} has been deleted successfully.`)
    showDeleteDialog.value = false
    vehicleToDelete.value = null
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    showError('Failed to delete vehicle. Please try again.')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.delete-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.delete-dialog-header {
  background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.delete-icon-wrapper {
  position: relative;
}

.delete-icon-bg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
}

.delete-vehicle-card {
  border: 2px solid rgba(var(--v-theme-error), 0.2);
  background: rgba(var(--v-theme-error), 0.04);
}

.vehicle-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-primary), 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vehicle-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.detail-item .v-icon {
  opacity: 0.6;
}
</style>

