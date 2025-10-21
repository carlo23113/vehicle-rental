<template>
  <CommonPageContainer>
    <CommonPageHeader
      title="Reports & Analytics"
      subtitle="View business insights and performance metrics"
      action-text="Export Report"
      action-icon="mdi-download"
    />

    <!-- Date Range Filter -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="modern-card pa-4">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-select
                v-model="filters.period"
                :items="periodOptions"
                variant="outlined"
                density="comfortable"
                label="Period"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.startDate"
                variant="outlined"
                density="comfortable"
                label="Start Date"
                type="date"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.endDate"
                variant="outlined"
                density="comfortable"
                label="End Date"
                type="date"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-success mr-4">
              <v-icon icon="mdi-currency-usd" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Total Revenue</p>
              <h3 class="text-h4 font-weight-bold">{{ formatCurrency(totalRevenue) }}</h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-primary mr-4">
              <v-icon icon="mdi-car-key" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Total Rentals</p>
              <h3 class="text-h4 font-weight-bold">{{ totalRentals }}</h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-info mr-4">
              <v-icon icon="mdi-chart-line" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Avg Utilization</p>
              <h3 class="text-h4 font-weight-bold">{{ avgUtilization }}%</h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-warning mr-4">
              <v-icon icon="mdi-wrench" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Maintenance Cost</p>
              <h3 class="text-h4 font-weight-bold">{{ formatCurrency(totalMaintenanceCost) }}</h3>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Revenue Chart -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-title class="pa-6">
            <h3 class="text-h5 font-weight-bold">Revenue Trends</h3>
            <p class="text-caption text-medium-emphasis mt-1">Weekly revenue breakdown</p>
          </v-card-title>
          <v-card-text class="pa-6">
            <div class="chart-container">
              <LazyDashboardRevenueChart filter="month" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Vehicle Utilization & Top Customers -->
    <v-row class="mb-6">
      <!-- Vehicle Utilization -->
      <v-col cols="12" lg="7">
        <v-card elevation="0" class="modern-card">
          <v-card-title class="pa-6">
            <h3 class="text-h5 font-weight-bold">Vehicle Utilization</h3>
            <p class="text-caption text-medium-emphasis mt-1">Fleet performance metrics</p>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-table class="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Rented Days</th>
                  <th>Utilization</th>
                  <th class="text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vehicle in vehicleUtilization" :key="vehicle.vehicleId" class="table-row">
                  <td>
                    <div class="font-weight-medium">{{ vehicle.vehicleName }}</div>
                  </td>
                  <td>
                    <div class="text-body-2">{{ vehicle.rentedDays }}/{{ vehicle.totalDays }} days</div>
                  </td>
                  <td>
                    <div class="d-flex align-center ga-2">
                      <v-progress-linear
                        :model-value="vehicle.utilizationRate"
                        :color="getUtilizationColor(vehicle.utilizationRate)"
                        height="8"
                        rounded
                        style="max-width: 100px"
                      ></v-progress-linear>
                      <span class="text-body-2 font-weight-bold">{{ vehicle.utilizationRate }}%</span>
                    </div>
                  </td>
                  <td class="text-right">
                    <div class="font-weight-bold">{{ formatCurrency(vehicle.revenue) }}</div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Top Customers -->
      <v-col cols="12" lg="5">
        <v-card elevation="0" class="modern-card">
          <v-card-title class="pa-6">
            <h3 class="text-h5 font-weight-bold">Top Customers</h3>
            <p class="text-caption text-medium-emphasis mt-1">Highest value customers</p>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-list class="top-customers-list">
              <v-list-item
                v-for="(customer, index) in topCustomers"
                :key="customer.customerId"
                class="customer-item rounded-lg mb-2 px-3"
              >
                <template #prepend>
                  <v-avatar :color="getRankColor(index)" size="40" class="mr-3">
                    <span class="text-subtitle-1 font-weight-bold">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">
                  {{ customer.customerName }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex justify-space-between">
                    <span>{{ customer.totalRentals }} rentals</span>
                    <span class="font-weight-bold">{{ formatCurrency(customer.totalSpent) }}</span>
                  </div>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Maintenance Summary -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-title class="pa-6">
            <h3 class="text-h5 font-weight-bold">Maintenance Summary</h3>
            <p class="text-caption text-medium-emphasis mt-1">Service costs per vehicle</p>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-table class="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Total Services</th>
                  <th>Total Cost</th>
                  <th>Avg Cost/Service</th>
                  <th>Last Service</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="maintenance in maintenanceSummary"
                  :key="maintenance.vehicleId"
                  class="table-row"
                >
                  <td>
                    <div class="font-weight-medium">{{ maintenance.vehicleName }}</div>
                  </td>
                  <td>
                    <v-chip size="small" variant="tonal" color="primary">
                      {{ maintenance.totalMaintenance }} services
                    </v-chip>
                  </td>
                  <td>
                    <div class="font-weight-bold">{{ formatCurrency(maintenance.totalCost) }}</div>
                  </td>
                  <td>
                    <div class="text-body-2">{{ formatCurrency(maintenance.avgCostPerService) }}</div>
                  </td>
                  <td>
                    <div class="text-body-2">{{ formatDate(maintenance.lastServiceDate) }}</div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { useReports } from '~/composables/useReports'

const {
  filters,
  vehicleUtilization,
  topCustomers,
  maintenanceSummary,
  totalRevenue,
  totalRentals,
  avgUtilization,
  totalMaintenanceCost,
  formatCurrency,
  formatDate,
} = useReports()

const periodOptions = [
  { title: 'This Week', value: 'week' },
  { title: 'This Month', value: 'month' },
  { title: 'This Quarter', value: 'quarter' },
  { title: 'This Year', value: 'year' },
  { title: 'Custom Range', value: 'custom' },
]

const getUtilizationColor = (rate: number) => {
  if (rate >= 80) return 'success'
  if (rate >= 60) return 'primary'
  if (rate >= 40) return 'warning'
  return 'error'
}

const getRankColor = (index: number) => {
  const colors = ['warning', 'info', 'success', 'primary', 'secondary']
  return colors[index] || 'primary'
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

.chart-container {
  min-height: 320px;
}

.modern-table {
  background: transparent;
}

.modern-table thead tr th {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  border-bottom: 2px solid rgba(var(--v-border-color), 0.12);
  padding: 1rem;
}

.modern-table tbody tr.table-row {
  transition: background-color 0.2s ease;
}

.modern-table tbody tr.table-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.modern-table tbody tr td {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
  padding: 1rem;
}

.top-customers-list {
  background: transparent;
  padding: 0;
}

.customer-item {
  transition: all 0.2s ease;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border: 1px solid rgba(var(--v-border-color), 0.12);
}

.customer-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}
</style>
