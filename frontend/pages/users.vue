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
        <v-card elevation="0" class="modern-card pa-4">
          <v-row dense>
            <v-col cols="12" md="5">
              <v-text-field
                v-model="filters.search"
                variant="outlined"
                density="comfortable"
                placeholder="Search by name, email, phone, or department..."
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="filters.role"
                :items="roleOptions"
                variant="outlined"
                density="comfortable"
                label="Role"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                variant="outlined"
                density="comfortable"
                label="Status"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.department"
                :items="departmentOptions"
                variant="outlined"
                density="comfortable"
                label="Department"
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
            <div class="stat-icon-wrapper bg-error mr-4">
              <v-icon icon="mdi-shield-crown" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Admins</p>
              <h3 class="text-h4 font-weight-bold">
                {{ users.filter(u => u.role === 'admin').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-primary mr-4">
              <v-icon icon="mdi-account-tie" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Managers</p>
              <h3 class="text-h4 font-weight-bold">
                {{ users.filter(u => u.role === 'manager').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-info mr-4">
              <v-icon icon="mdi-account-circle" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Agents</p>
              <h3 class="text-h4 font-weight-bold">
                {{ users.filter(u => u.role === 'agent').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card elevation="0" class="stat-card pa-4">
          <div class="d-flex align-center">
            <div class="stat-icon-wrapper bg-success mr-4">
              <v-icon icon="mdi-account-check" size="24" color="white"></v-icon>
            </div>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Active Users</p>
              <h3 class="text-h4 font-weight-bold">
                {{ users.filter(u => u.status === 'active').length }}
              </h3>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Users Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="modern-card">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="filteredUsers"
              :items-per-page="10"
              class="users-table"
            >
              <template #item.user="{ item }">
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
                  <div class="text-caption text-medium-emphasis" v-if="item.department">
                    {{ item.department }}
                  </div>
                </div>
              </template>

              <template #item.role="{ item }">
                <v-chip
                  :color="getRoleColor(item.role)"
                  size="small"
                  variant="flat"
                  :prepend-icon="getRoleIcon(item.role)"
                >
                  {{ item.role }}
                </v-chip>
              </template>

              <template #item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.permissions="{ item }">
                <div>
                  <v-chip
                    v-if="item.permissions.includes('all')"
                    size="x-small"
                    variant="outlined"
                    color="error"
                    class="mr-1"
                  >
                    All Access
                  </v-chip>
                  <template v-else>
                    <v-chip
                      v-for="perm in item.permissions.slice(0, 2)"
                      :key="perm"
                      size="x-small"
                      variant="outlined"
                      class="mr-1 mb-1"
                    >
                      {{ perm }}
                    </v-chip>
                    <v-chip
                      v-if="item.permissions.length > 2"
                      size="x-small"
                      variant="outlined"
                      class="mr-1"
                    >
                      +{{ item.permissions.length - 2 }}
                    </v-chip>
                  </template>
                </div>
              </template>

              <template #item.lastLogin="{ item }">
                <div class="text-body-2">{{ formatDate(item.lastLogin) }}</div>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="viewUser(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="editUser(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="confirmDelete(item)"
                    :disabled="item.role === 'admin'"
                  ></v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
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
import { ref } from 'vue'
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

const headers = [
  { title: 'User', key: 'user', sortable: true },
  { title: 'Contact', key: 'contact', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Permissions', key: 'permissions', sortable: false },
  { title: 'Last Login', key: 'lastLogin', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

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

const viewUser = (user: any) => {
  console.log('View user:', user)
  // TODO: Implement view details
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

.users-table :deep(th) {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.users-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}
</style>