<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Maintenance"
      subtitle="Track vehicle maintenance and service records"
      action-text="Schedule Maintenance"
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
                placeholder="Search by vehicle or description..."
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="2">
              <v-select
                v-model="filters.type"
                :items="typeOptions"
                variant="outlined"
                density="comfortable"
                label="Type"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="3">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                variant="outlined"
                density="comfortable"
                label="Status"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="3">
              <v-select
                v-model="filters.priority"
                :items="priorityOptions"
                variant="outlined"
                density="comfortable"
                label="Priority"
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-info mr-4">
              <v-icon icon="mdi-calendar-clock" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Scheduled</p>
              <h3 class="text-h4 font-weight-bold">
                {{ maintenanceRecords.filter(r => r.status === 'scheduled').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-warning mr-4">
              <v-icon icon="mdi-tools" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">In Progress</p>
              <h3 class="text-h4 font-weight-bold">
                {{ maintenanceRecords.filter(r => r.status === 'in-progress').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-success mr-4">
              <v-icon icon="mdi-check-circle" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Completed</p>
              <h3 class="text-h4 font-weight-bold">
                {{ maintenanceRecords.filter(r => r.status === 'completed').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-primary mr-4">
              <v-icon icon="mdi-currency-usd" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Total Cost</p>
              <h3 class="text-h4 font-weight-bold">
                {{
                  formatCurrency(maintenanceRecords
                    .filter(r => r.status === 'completed')
                    .reduce((sum, r) => sum + r.cost, 0))
                }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Maintenance Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="filteredRecords"
              :items-per-page="10"
              class="maintenance-table"
            >
              <template #item.vehicle="{ item }">
                <div class="d-flex align-center py-3">
                  <v-avatar color="surface-variant" size="40" class="mr-3" rounded>
                    <v-icon icon="mdi-car-wrench" size="20"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ item.vehicleName }}</div>
                    <v-chip size="x-small" variant="outlined" class="mt-1">
                      {{ item.licensePlate }}
                    </v-chip>
                  </div>
                </div>
              </template>

              <template #item.type="{ item }">
                <div>
                  <div class="font-weight-medium">{{ getTypeLabel(item.type) }}</div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    {{ item.mileage.toLocaleString() }} mi
                  </div>
                </div>
              </template>

              <template #item.description="{ item }">
                <div class="description-cell">
                  <div class="text-body-2">{{ item.description }}</div>
                  <div v-if="item.performedBy" class="text-caption text-medium-emphasis mt-1">
                    By: {{ item.performedBy }}
                  </div>
                </div>
              </template>

              <template #item.date="{ item }">
                <div>
                  <div class="text-body-2">{{ formatDate(item.scheduledDate) }}</div>
                  <div v-if="item.completedDate" class="text-caption text-success mt-1">
                    Done: {{ formatDate(item.completedDate) }}
                  </div>
                </div>
              </template>

              <template #item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.priority="{ item }">
                <v-chip :color="getPriorityColor(item.priority)" size="small" variant="flat">
                  {{ item.priority }}
                </v-chip>
              </template>

              <template #item.cost="{ item }">
                <div class="font-weight-bold text-h6">{{ formatCurrency(item.cost) }}</div>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex ga-1">
                  <v-btn
                    v-if="item.status === 'scheduled' || item.status === 'in-progress'"
                    icon="mdi-check"
                    size="small"
                    variant="text"
                    color="success"
                    @click="handleComplete(item)"
                  >
                    <v-icon>mdi-check</v-icon>
                    <v-tooltip activator="parent" location="top">Mark Complete</v-tooltip>
                  </v-btn>
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="viewRecord(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                    <v-tooltip activator="parent" location="top">View Details</v-tooltip>
                  </v-btn>
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="editRecord(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                  </v-btn>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="confirmDelete(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Maintenance Dialog -->
    <v-dialog v-model="showAddDialog" max-width="900">
      <v-card>
        <v-card-title class="pa-6">
          <h2 class="text-h5 font-weight-bold">Schedule Maintenance</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-form>
            <h3 class="text-h6 font-weight-bold mb-4">Vehicle & Service Type</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  label="Select Vehicle"
                  variant="outlined"
                  density="comfortable"
                  :items="[]"
                  placeholder="Choose a vehicle"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="typeOptions.filter(t => t.value !== 'all')"
                  label="Maintenance Type"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Description"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  placeholder="Describe the maintenance or repair needed..."
                ></v-textarea>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <h3 class="text-h6 font-weight-bold mb-4">Schedule & Details</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Scheduled Date"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                ></v-text-field>
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
                <v-select
                  :items="priorityOptions.filter(p => p.value !== 'all')"
                  label="Priority"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Current Mileage"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  suffix="miles"
                  placeholder="0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Estimated Cost"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  prefix="$"
                  placeholder="0.00"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Service Provider"
                  variant="outlined"
                  density="comfortable"
                  placeholder="e.g., AutoCare Service Center"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Notes"
                  variant="outlined"
                  density="comfortable"
                  rows="2"
                  placeholder="Additional notes or special instructions..."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showAddDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="showAddDialog = false">
            Schedule Maintenance
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMaintenance } from '~/composables/useMaintenance'
import { useCurrency } from '~/composables/useCurrency'

const { formatCurrency } = useCurrency()

const {
  maintenanceRecords,
  filters,
  filteredRecords,
  completeMaintenanceRecord,
  getStatusColor,
  getPriorityColor,
  getTypeLabel,
  formatDate,
} = useMaintenance()

const showAddDialog = ref(false)

const headers = [
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Type & Mileage', key: 'type', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Priority', key: 'priority', sortable: true },
  { title: 'Cost', key: 'cost', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const typeOptions = [
  { title: 'All Types', value: 'all' },
  { title: 'Oil Change', value: 'oil-change' },
  { title: 'Tire Rotation', value: 'tire-rotation' },
  { title: 'Brake Service', value: 'brake-service' },
  { title: 'Inspection', value: 'inspection' },
  { title: 'Repair', value: 'repair' },
  { title: 'Cleaning', value: 'cleaning' },
  { title: 'Other', value: 'other' },
]

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in-progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' },
]

const priorityOptions = [
  { title: 'All Priorities', value: 'all' },
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
  { title: 'Urgent', value: 'urgent' },
]

const handleComplete = (record: any) => {
  completeMaintenanceRecord(record.id)
  console.log('Completed maintenance:', record)
}

const viewRecord = (record: any) => {
  console.log('View record:', record)
  // TODO: Implement view details
}

const editRecord = (record: any) => {
  console.log('Edit record:', record)
  // TODO: Implement edit functionality
}

const confirmDelete = (record: any) => {
  console.log('Delete record:', record)
  // TODO: Implement delete confirmation
}
</script>

<style scoped>
.modern-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.stat-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.2);
}

.maintenance-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.maintenance-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}

.description-cell {
  max-width: 300px;
}
</style>
