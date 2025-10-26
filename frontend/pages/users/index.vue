<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="System Users"
      subtitle="Manage system users and permissions"
      action-text="Add User"
      action-icon="mdi-plus"
      @action-click="navigateTo('/users/add')"
    />

    <!-- Filters -->
    <CommonFilterSection v-model="showFilters" :filters="filters" @clear="clearFilters">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="filters.search"
            variant="outlined"
            density="comfortable"
            placeholder="Search by name, email, or phone..."
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="filters.role"
            :items="roleOptions"
            variant="outlined"
            density="comfortable"
            label="Role"
            prepend-inner-icon="mdi-account-tie"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="filters.status"
            :items="statusOptions"
            variant="outlined"
            density="comfortable"
            label="Status"
            prepend-inner-icon="mdi-check-circle"
            clearable
          />
        </v-col>
      </v-row>
    </CommonFilterSection>

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
          @activate="handleActivate"
          @deactivate="handleDeactivate"
          @suspend="handleSuspend"
        />
      </v-col>
    </v-row>

    <!-- Confirmation Dialogs -->
    <CommonDialogDeleteConfirmation
      v-model="activateDialog"
      title="Activate User?"
      :message="`Are you sure you want to activate ${selectedUser?.firstName} ${selectedUser?.lastName}? They will regain access to the system.`"
      :loading="actionLoading"
      confirm-text="Activate User"
      confirm-color="success"
      @confirm="confirmActivate"
    />

    <CommonDialogDeleteConfirmation
      v-model="deactivateDialog"
      title="Deactivate User?"
      :message="`Are you sure you want to deactivate ${selectedUser?.firstName} ${selectedUser?.lastName}? They will lose access to the system.`"
      :loading="actionLoading"
      confirm-text="Deactivate User"
      confirm-color="warning"
      @confirm="confirmDeactivate"
    />

    <CommonDialogDeleteConfirmation
      v-model="suspendDialog"
      title="Suspend User?"
      :message="`Are you sure you want to suspend ${selectedUser?.firstName} ${selectedUser?.lastName}? This is a temporary restriction of access.`"
      :loading="actionLoading"
      confirm-text="Suspend User"
      confirm-color="error"
      @confirm="confirmSuspend"
    />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUsers } from '~/composables/useUsers'
import type { User } from '~/types/user'

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
  updateUser,
} = useUsers()

// Filter state
const showFilters = ref(false)

// Dialog states
const activateDialog = ref(false)
const deactivateDialog = ref(false)
const suspendDialog = ref(false)
const actionLoading = ref(false)
const selectedUser = ref<User | null>(null)

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
  navigateTo(`/users/edit/${user.id}`)
}

const handleActivate = (user: User) => {
  selectedUser.value = user
  activateDialog.value = true
}

const handleDeactivate = (user: User) => {
  selectedUser.value = user
  deactivateDialog.value = true
}

const handleSuspend = (user: User) => {
  selectedUser.value = user
  suspendDialog.value = true
}

const confirmActivate = async () => {
  if (!selectedUser.value) return

  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    updateUser(selectedUser.value.id, { status: 'active' })
    activateDialog.value = false
  } catch (error) {
    console.error('Failed to activate user:', error)
  } finally {
    actionLoading.value = false
  }
}

const confirmDeactivate = async () => {
  if (!selectedUser.value) return

  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    updateUser(selectedUser.value.id, { status: 'inactive' })
    deactivateDialog.value = false
  } catch (error) {
    console.error('Failed to deactivate user:', error)
  } finally {
    actionLoading.value = false
  }
}

const confirmSuspend = async () => {
  if (!selectedUser.value) return

  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    updateUser(selectedUser.value.id, { status: 'suspended' })
    suspendDialog.value = false
  } catch (error) {
    console.error('Failed to suspend user:', error)
  } finally {
    actionLoading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    role: 'all',
    status: 'all',
  }
}
</script>

