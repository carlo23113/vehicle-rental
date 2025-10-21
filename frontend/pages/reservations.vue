<template>
  <CommonPageContainer>
    <CommonPageHeader
      title="Reservations"
      subtitle="Manage upcoming vehicle reservations"
      action-text="New Reservation"
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
                placeholder="Search by customer, vehicle, or license plate..."
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              ></v-text-field>
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
                v-model="filters.paymentStatus"
                :items="paymentStatusOptions"
                variant="outlined"
                density="comfortable"
                label="Payment Status"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="2">
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
            <div class="stat-icon-wrapper bg-warning mr-4">
              <v-icon icon="mdi-clock-outline" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Pending</p>
              <h3 class="text-h4 font-weight-bold">
                {{ reservations.filter(r => r.status === 'pending').length }}
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
              <p class="text-caption text-medium-emphasis mb-1">Confirmed</p>
              <h3 class="text-h4 font-weight-bold">
                {{ reservations.filter(r => r.status === 'confirmed').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-primary mr-4">
              <v-icon icon="mdi-calendar-multiple" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Total Reservations</p>
              <h3 class="text-h4 font-weight-bold">
                {{ reservations.filter(r => r.status !== 'cancelled').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-info mr-4">
              <v-icon icon="mdi-currency-usd" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Expected Revenue</p>
              <h3 class="text-h4 font-weight-bold">
                ${{
                  reservations
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

    <!-- Reservations Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="filteredReservations"
              :items-per-page="10"
              class="reservations-table"
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
                  <div class="d-flex align-center ga-1 mt-1">
                    <v-chip size="x-small" variant="outlined">
                      {{ item.licensePlate }}
                    </v-chip>
                    <v-chip size="x-small" variant="tonal" color="primary">
                      {{ item.vehicleType }}
                    </v-chip>
                  </div>
                </div>
              </template>

              <template #item.period="{ item }">
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ formatDate(item.startDate) }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatTime(item.startTime) }}
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    to {{ formatDate(item.endDate) }} {{ formatTime(item.endTime) }}
                  </div>
                  <v-chip size="x-small" variant="tonal" color="info" class="mt-1">
                    {{ item.numberOfDays }} days
                  </v-chip>
                </div>
              </template>

              <template #item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.payment="{ item }">
                <div>
                  <div class="font-weight-bold text-h6">${{ item.totalAmount }}</div>
                  <v-chip
                    :color="getPaymentStatusColor(item.paymentStatus)"
                    size="x-small"
                    variant="flat"
                    class="mt-1"
                  >
                    {{ item.paymentStatus }}
                  </v-chip>
                  <div class="text-caption text-medium-emphasis mt-1">
                    Deposit: ${{ item.depositAmount }}
                  </div>
                </div>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex ga-1">
                  <v-btn
                    v-if="item.status === 'pending'"
                    icon="mdi-check"
                    size="small"
                    variant="text"
                    color="success"
                    @click="handleConfirm(item)"
                  >
                    <v-icon>mdi-check</v-icon>
                    <v-tooltip activator="parent" location="top">Confirm</v-tooltip>
                  </v-btn>
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="viewReservation(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                    <v-tooltip activator="parent" location="top">View</v-tooltip>
                  </v-btn>
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="editReservation(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                  </v-btn>
                  <v-btn
                    v-if="item.status !== 'cancelled'"
                    icon="mdi-cancel"
                    size="small"
                    variant="text"
                    color="error"
                    @click="handleCancel(item)"
                  >
                    <v-icon>mdi-cancel</v-icon>
                    <v-tooltip activator="parent" location="top">Cancel</v-tooltip>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Reservation Dialog -->
    <v-dialog v-model="showAddDialog" max-width="900">
      <v-card>
        <v-card-title class="pa-6">
          <h2 class="text-h5 font-weight-bold">Create New Reservation</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-form>
            <h3 class="text-h6 font-weight-bold mb-4">Customer Information</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  label="Select Customer"
                  variant="outlined"
                  density="comfortable"
                  :items="[]"
                  placeholder="Choose existing customer or add new"
                ></v-select>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <h3 class="text-h6 font-weight-bold mb-4">Vehicle & Dates</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  label="Select Vehicle"
                  variant="outlined"
                  density="comfortable"
                  :items="[]"
                  placeholder="Choose available vehicle"
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
                  label="Start Time"
                  variant="outlined"
                  density="comfortable"
                  type="time"
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
                  label="End Time"
                  variant="outlined"
                  density="comfortable"
                  type="time"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <h3 class="text-h6 font-weight-bold mb-4">Location & Payment</h3>
            <v-row>
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
              <v-col cols="12" md="6">
                <v-select
                  :items="paymentStatusOptions.filter(p => p.value !== 'all')"
                  label="Payment Status"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Deposit Amount"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  prefix="$"
                  placeholder="0.00"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Notes"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  placeholder="Special requests or additional information..."
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
            Create Reservation
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useReservations } from '~/composables/useReservations'

const {
  reservations,
  filters,
  filteredReservations,
  confirmReservation,
  cancelReservation,
  getStatusColor,
  getPaymentStatusColor,
  formatDate,
  formatTime,
} = useReservations()

const showAddDialog = ref(false)

const headers = [
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Reservation Period', key: 'period', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Payment', key: 'payment', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Pending', value: 'pending' },
  { title: 'Confirmed', value: 'confirmed' },
  { title: 'Cancelled', value: 'cancelled' },
  { title: 'Completed', value: 'completed' },
]

const paymentStatusOptions = [
  { title: 'All Payment Status', value: 'all' },
  { title: 'Pending', value: 'pending' },
  { title: 'Partial', value: 'partial' },
  { title: 'Paid', value: 'paid' },
]

const dateRangeOptions = [
  { title: 'All Time', value: 'all' },
  { title: 'Today', value: 'today' },
  { title: 'This Week', value: 'week' },
  { title: 'This Month', value: 'month' },
]

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const handleConfirm = (reservation: any) => {
  confirmReservation(reservation.id)
  console.log('Confirmed reservation:', reservation)
}

const handleCancel = (reservation: any) => {
  if (confirm(`Are you sure you want to cancel this reservation for ${reservation.customerName}?`)) {
    cancelReservation(reservation.id)
    console.log('Cancelled reservation:', reservation)
  }
}

const viewReservation = (reservation: any) => {
  console.log('View reservation:', reservation)
  // TODO: Implement view details
}

const editReservation = (reservation: any) => {
  console.log('Edit reservation:', reservation)
  // TODO: Implement edit functionality
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

.reservations-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.reservations-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}
</style>
