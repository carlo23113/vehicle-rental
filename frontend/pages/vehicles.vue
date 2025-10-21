<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Vehicles"
      subtitle="Manage your fleet inventory"
      action-text="Add Vehicle"
      action-icon="mdi-plus"
      @action-click="showAddDialog = true"
    />

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="modern-card pa-4">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.search"
                variant="outlined"
                density="comfortable"
                placeholder="Search vehicles..."
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                variant="outlined"
                density="comfortable"
                label="Status"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="filters.type"
                :items="typeOptions"
                variant="outlined"
                density="comfortable"
                label="Type"
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Vehicles Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="filteredVehicles"
              :items-per-page="10"
              class="vehicles-table"
            >
              <template #item.vehicle="{ item }">
                <div class="d-flex align-center py-3">
                  <v-avatar color="surface-variant" size="48" class="mr-3" rounded>
                    <v-icon icon="mdi-car" size="24"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ item.make }} {{ item.model }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.year }}</div>
                  </div>
                </div>
              </template>

              <template #item.licensePlate="{ item }">
                <v-chip size="small" variant="outlined" class="font-weight-bold">
                  {{ item.licensePlate }}
                </v-chip>
              </template>

              <template #item.type="{ item }">
                <span class="text-body-2">{{ getTypeLabel(item.type) }}</span>
              </template>

              <template #item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                  {{ item.status.replace('-', ' ') }}
                </v-chip>
              </template>

              <template #item.dailyRate="{ item }">
                <span class="font-weight-bold">${{ item.dailyRate }}</span>
              </template>

              <template #item.mileage="{ item }">
                {{ item.mileage.toLocaleString() }} mi
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="editVehicle(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="confirmDelete(item)"
                  ></v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="showAddDialog" max-width="800">
      <v-card>
        <v-card-title class="pa-6">
          <h2 class="text-h5 font-weight-bold">Add New Vehicle</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-form>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Make"
                  variant="outlined"
                  density="comfortable"
                  placeholder="e.g., Toyota"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Model"
                  variant="outlined"
                  density="comfortable"
                  placeholder="e.g., Camry"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Year"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  placeholder="e.g., 2024"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="License Plate"
                  variant="outlined"
                  density="comfortable"
                  placeholder="e.g., ABC-1234"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="VIN"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Vehicle Identification Number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="typeOptions.filter(t => t.value !== 'all')"
                  label="Type"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="statusOptions.filter(s => s.value !== 'all')"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Color"
                  variant="outlined"
                  density="comfortable"
                  placeholder="e.g., Silver"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Daily Rate"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  prefix="$"
                  placeholder="0.00"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="showAddDialog = false">
            Add Vehicle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVehicles } from '~/composables/useVehicles'

const { filters, filteredVehicles, getStatusColor, getTypeLabel } = useVehicles()

const showAddDialog = ref(false)

const headers = [
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'License Plate', key: 'licensePlate', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Daily Rate', key: 'dailyRate', sortable: true },
  { title: 'Mileage', key: 'mileage', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

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

const editVehicle = (vehicle: any) => {
  console.log('Edit vehicle:', vehicle)
  // TODO: Implement edit functionality
}

const confirmDelete = (vehicle: any) => {
  console.log('Delete vehicle:', vehicle)
  // TODO: Implement delete confirmation
}
</script>

<style scoped>
.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.vehicles-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.vehicles-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}
</style>
