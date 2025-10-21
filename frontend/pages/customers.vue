<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap ga-4">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Customers</h1>
            <p class="text-h6 text-medium-emphasis font-weight-regular">
              Manage customer profiles and information
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
            Add Customer
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="modern-card pa-4">
          <v-row dense>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="filters.search"
                variant="outlined"
                density="comfortable"
                placeholder="Search by name, email, phone, or license..."
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                variant="outlined"
                density="comfortable"
                label="Status"
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
              <v-icon icon="mdi-account-check" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Active Customers</p>
              <h3 class="text-h4 font-weight-bold">
                {{ customers.filter(c => c.status === 'active').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-warning mr-4">
              <v-icon icon="mdi-account-clock" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Inactive</p>
              <h3 class="text-h4 font-weight-bold">
                {{ customers.filter(c => c.status === 'inactive').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-primary mr-4">
              <v-icon icon="mdi-account-group" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Total Customers</p>
              <h3 class="text-h4 font-weight-bold">{{ customers.length }}</h3>
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
              <p class="text-caption text-medium-emphasis mb-1">Total Revenue</p>
              <h3 class="text-h4 font-weight-bold">
                ${{ customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString() }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Customers Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="filteredCustomers"
              :items-per-page="10"
              class="customers-table"
            >
              <template #item.customer="{ item }">
                <div class="d-flex align-center py-3">
                  <v-avatar color="primary" size="48" class="mr-3">
                    <span class="text-subtitle-2 font-weight-bold">
                      {{ getInitials(item) }}
                    </span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ getFullName(item) }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
                  </div>
                </div>
              </template>

              <template #item.contact="{ item }">
                <div>
                  <div class="text-body-2">{{ item.phone }}</div>
                  <div class="text-caption text-medium-emphasis">
                    {{ item.city }}, {{ item.state }}
                  </div>
                </div>
              </template>

              <template #item.license="{ item }">
                <div>
                  <v-chip size="small" variant="outlined" class="font-weight-bold mb-1">
                    {{ item.driversLicense }}
                  </v-chip>
                  <div class="text-caption text-medium-emphasis">
                    Exp: {{ formatDate(item.licenseExpiry) }}
                  </div>
                </div>
              </template>

              <template #item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.rentals="{ item }">
                <div>
                  <div class="font-weight-bold">{{ item.totalRentals }} rentals</div>
                  <div class="text-caption text-medium-emphasis">
                    ${{ item.totalSpent.toLocaleString() }} spent
                  </div>
                </div>
              </template>

              <template #item.joinDate="{ item }">
                <div class="text-body-2">{{ formatDate(item.joinDate) }}</div>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="viewCustomer(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="editCustomer(item)"
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

    <!-- Add Customer Dialog -->
    <v-dialog v-model="showAddDialog" max-width="900">
      <v-card>
        <v-card-title class="pa-6">
          <h2 class="text-h5 font-weight-bold">Add New Customer</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-form>
            <h3 class="text-h6 font-weight-bold mb-4">Personal Information</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="First Name"
                  variant="outlined"
                  density="comfortable"
                  placeholder="John"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Last Name"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Doe"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email"
                  variant="outlined"
                  density="comfortable"
                  type="email"
                  placeholder="john.doe@email.com"
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
              <v-col cols="12" md="6">
                <v-text-field
                  label="Date of Birth"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <h3 class="text-h6 font-weight-bold mb-4">Address</h3>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Street Address"
                  variant="outlined"
                  density="comfortable"
                  placeholder="123 Main Street"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="City"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Los Angeles"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="State"
                  variant="outlined"
                  density="comfortable"
                  placeholder="CA"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="ZIP Code"
                  variant="outlined"
                  density="comfortable"
                  placeholder="90001"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <h3 class="text-h6 font-weight-bold mb-4">Driver's License</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="License Number"
                  variant="outlined"
                  density="comfortable"
                  placeholder="D1234567"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Expiry Date"
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
            </v-row>

            <v-divider class="my-6"></v-divider>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  label="Notes"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  placeholder="Additional notes about the customer..."
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
            Add Customer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCustomers } from '~/composables/useCustomers'

const {
  customers,
  filters,
  filteredCustomers,
  getStatusColor,
  getFullName,
  getInitials,
  formatDate,
} = useCustomers()

const showAddDialog = ref(false)

const headers = [
  { title: 'Customer', key: 'customer', sortable: true },
  { title: 'Contact', key: 'contact', sortable: true },
  { title: "Driver's License", key: 'license', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Rentals & Spending', key: 'rentals', sortable: true },
  { title: 'Join Date', key: 'joinDate', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Blocked', value: 'blocked' },
]

const viewCustomer = (customer: any) => {
  console.log('View customer:', customer)
  // TODO: Implement view details
}

const editCustomer = (customer: any) => {
  console.log('Edit customer:', customer)
  // TODO: Implement edit functionality
}

const confirmDelete = (customer: any) => {
  console.log('Delete customer:', customer)
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

.customers-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.customers-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}
</style>
