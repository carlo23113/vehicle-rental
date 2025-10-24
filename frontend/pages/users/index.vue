<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="System Users"
      subtitle="Manage system users and permissions"
      action-text="Add User"
      action-icon="mdi-plus"
      @action-click="showAddDialog = true"
    />

    <!-- Filters -->
    <v-row class="mb-6">
      <v-col cols="12">
        <UserFilters
          :filters="filters"
          :role-options="roleOptions"
          :status-options="statusOptions"
          :department-options="departmentOptions"
          @update:search="(val: string) => filters.search = val"
          @update:role="(val: any) => filters.role = val"
          @update:status="(val: any) => filters.status = val"
          @update:department="(val: any) => filters.department = val"
        />
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" lg="3">
        <CommonUiStatCard v-bind="stat" />
      </v-col>
    </v-row>

    <!-- Users Table -->
    <v-row>
      <v-col cols="12">
        <UsersTable
          :users="filteredUsers"
          :get-full-name="getFullName"
          :get-initials="getInitials"
          :get-role-color="getRoleColor"
          :get-role-icon="getRoleIcon"
          :get-status-color="getStatusColor"
          :format-date="formatDate"
          @view="viewUser"
          @edit="editUser"
          @delete="confirmDelete"
        />
      </v-col>
    </v-row>

    <!-- Add User Dialog -->
    <v-dialog v-model="showAddDialog" max-width="900">
      <v-card>
        <v-card-title class="pa-6">
          <h2 class="text-h5 font-weight-bold">Add New User</h2>
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
                  placeholder="john.doe@vrms.com"
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

            <h3 class="text-h6 font-weight-bold mb-4">Role & Access</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  :items="roleOptions.filter(r => r.value !== 'all')"
                  label="Role"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="departmentOptions.filter(d => d.value !== 'all')"
                  label="Department"
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
              <v-col cols="12">
                <v-select
                  :items="permissionOptions"
                  label="Permissions"
                  variant="outlined"
                  density="comfortable"
                  multiple
                  chips
                  closable-chips
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
                  placeholder="Additional notes about the user..."
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
            Add User
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUsers } from '~/composables/useUsers'

const {
  users,
  filters,
  filteredUsers,
  getRoleColor,
  getStatusColor,
  getFullName,
  getInitials,
  formatDate,
  getRoleIcon,
} = useUsers()

const showAddDialog = ref(false)

const roleOptions = [
  { title: 'All Roles', value: 'all' },
  { title: 'Admin', value: 'admin' },
  { title: 'Manager', value: 'manager' },
  { title: 'Agent', value: 'agent' },
  { title: 'Technician', value: 'technician' },
]

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Suspended', value: 'suspended' },
]

const departmentOptions = [
  { title: 'All Departments', value: 'all' },
  { title: 'Management', value: 'Management' },
  { title: 'Operations', value: 'Operations' },
  { title: 'Customer Service', value: 'Customer Service' },
  { title: 'Maintenance', value: 'Maintenance' },
  { title: 'Finance', value: 'Finance' },
]

const permissionOptions = [
  { title: 'Rentals', value: 'rentals' },
  { title: 'Customers', value: 'customers' },
  { title: 'Vehicles', value: 'vehicles' },
  { title: 'Reservations', value: 'reservations' },
  { title: 'Maintenance', value: 'maintenance' },
  { title: 'Payments', value: 'payments' },
  { title: 'Reports', value: 'reports' },
]

// Statistics
const stats = computed(() => {
  const adminCount = users.value.filter(u => u.role === 'admin').length
  const managerCount = users.value.filter(u => u.role === 'manager').length
  const agentCount = users.value.filter(u => u.role === 'agent').length
  const activeCount = users.value.filter(u => u.status === 'active').length

  return [
    {
      icon: 'mdi-shield-crown',
      label: 'Admins',
      value: adminCount,
      color: 'error'
    },
    {
      icon: 'mdi-account-tie',
      label: 'Managers',
      value: managerCount,
      color: 'primary'
    },
    {
      icon: 'mdi-account-circle',
      label: 'Agents',
      value: agentCount,
      color: 'info'
    },
    {
      icon: 'mdi-account-check',
      label: 'Active Users',
      value: activeCount,
      color: 'success'
    }
  ]
})

const viewUser = (user: any) => {
  navigateTo(`/users/${user.id}`)
}

const editUser = (user: any) => {
  console.log('Edit user:', user)
  // TODO: Implement edit functionality
}

const confirmDelete = (user: any) => {
  console.log('Delete user:', user)
  // TODO: Implement delete confirmation
}
</script>

