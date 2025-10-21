<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap ga-4">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Rentals</h1>
            <p class="text-h6 text-medium-emphasis font-weight-regular">
              Track and manage rental bookings
            </p>
          </div>
          <v-btn
            color="primary"
            size="x-large"
            elevation="2"
            class="rounded-lg"
            @click="showAddDialog = true"
          >
            <v-icon icon="mdi-plus" start></v-icon>
            New Rental
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="modern-card pa-4">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="filters.search"
                variant="outlined"
                density="comfortable"
                placeholder="Search by customer, vehicle, or license plate..."
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                variant="outlined"
                density="comfortable"
                label="Status"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.dateRange"
                :items="dateRangeOptions"
                variant="outlined"
                density="comfortable"
                label="Date Range"
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
            <div class="stat-icon-wrapper bg-success mr-4">
              <v-icon icon="mdi-check-circle" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Active Rentals</p>
              <h3 class="text-h4 font-weight-bold">
                {{ rentals.filter(r => r.status === 'active').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-warning mr-4">
              <v-icon icon="mdi-calendar-clock" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Reserved</p>
              <h3 class="text-h4 font-weight-bold">
                {{ rentals.filter(r => r.status === 'reserved').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-info mr-4">
              <v-icon icon="mdi-check-all" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Completed</p>
              <h3 class="text-h4 font-weight-bold">
                {{ rentals.filter(r => r.status === 'completed').length }}
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
              <p class="text-caption text-medium-emphasis mb-1">Total Revenue</p>
              <h3 class="text-h4 font-weight-bold">
                ${{
                  rentals
                    .filter(r => r.status !== 'cancelled')
                    .reduce((sum, r) => sum + r.totalAmount, 0)
                    .toLocaleString()
                }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Rentals Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="filteredRentals"
              :items-per-page="10"
              class="rentals-table"
            >
              <template #item.customer="{ item }">
                <div class="d-flex align-center py-3">
                  <v-avatar color="primary" size="40" class="mr-3">
                    <span class="text-subtitle-2 font-weight-bold">
                      {{ getInitials(item.customerName) }}
                    </span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ item.customerName }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.customerEmail }}</div>
                  </div>
                </div>
              </template>

              <template #item.vehicle="{ item }">
                <div>
                  <div class="font-weight-medium">{{ item.vehicleName }}</div>
                  <v-chip size="x-small" variant="outlined" class="mt-1">
                    {{ item.licensePlate }}
                  </v-chip>
                </div>
              </template>

              <template #item.period="{ item }">
                <div>
                  <div class="text-body-2">{{ formatDate(item.startDate) }}</div>
                  <div class="text-caption text-medium-emphasis">
                    to {{ formatDate(item.endDate) }}
                  </div>
                  <v-chip size="x-small" variant="tonal" color="primary" class="mt-1">
                    {{ item.numberOfDays }} days
                  </v-chip>
                </div>
              </template>

              <template #item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.totalAmount="{ item }">
                <div>
                  <div class="font-weight-bold text-h6">${{ item.totalAmount }}</div>
                  <div class="text-caption text-medium-emphasis">${{ item.dailyRate }}/day</div>
                </div>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="viewRental(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="editRental(item)"
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

    <!-- Add Rental Dialog -->
    <v-dialog v-model="showAddDialog" max-width="900">
      <v-card>
        <v-card-title class="pa-6">
          <h2 class="text-h5 font-weight-bold">Create New Rental</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-form>
            <h3 class="text-h6 font-weight-bold mb-4">Customer Information</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Customer Name"
                  variant="outlined"
                  density="comfortable"
                  placeholder="John Doe"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email"
                  variant="outlined"
                  density="comfortable"
                  type="email"
                  placeholder="john@email.com"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Phone"
                  variant="outlined"
                  density="comfortable"
                  placeholder="(555) 123-4567"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <h3 class="text-h6 font-weight-bold mb-4">Rental Details</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  label="Vehicle"
                  variant="outlined"
                  density="comfortable"
                  :items="[]"
                  placeholder="Select a vehicle"
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
                  label="Start Date"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="End Date"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Pickup Location"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Main Office"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Return Location"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Main Office"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Notes"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  placeholder="Additional notes or special requests..."
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
            Create Rental
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRentals } from '~/composables/useRentals'

const { rentals, filters, filteredRentals, getStatusColor, formatDate } = useRentals()

const showAddDialog = ref(false)

const headers = [
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Rental Period', key: 'period', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Total Amount', key: 'totalAmount', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Reserved', value: 'reserved' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' },
]

const dateRangeOptions = [
  { title: 'All Time', value: 'all' },
  { title: 'Today', value: 'today' },
  { title: 'This Week', value: 'week' },
  { title: 'This Month', value: 'month' },
  { title: 'This Year', value: 'year' },
]

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const viewRental = (rental: any) => {
  console.log('View rental:', rental)
  // TODO: Implement view details
}

const editRental = (rental: any) => {
  console.log('Edit rental:', rental)
  // TODO: Implement edit functionality
}

const confirmDelete = (rental: any) => {
  console.log('Delete rental:', rental)
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

.rentals-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.rentals-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}
</style>
