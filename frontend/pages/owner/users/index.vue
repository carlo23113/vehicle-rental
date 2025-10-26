<template>
  <CommonPageLayout
    title="System Users"
    subtitle="Manage system users and permissions"
    action-text="Add User"
    action-icon="mdi-plus"
    @action-click="handleAddUser"
  >
    <!-- Filters Slot -->
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyUsersFilters
        v-if="isFilterVisible || sections.stats"
        v-model="showFilters"
        v-model:filters="filters"
        @clear="clearFilters"
      />
    </template>

    <!-- Stats Slot -->
    <template #stats>
      <LazyUsersStatsCards :stats="stats" />
    </template>

    <!-- Main Content Slot -->
    <template #content>
      <LazyUsersTableSection
        :displayed-items="displayedItems"
        :is-loading-more="isLoadingMore"
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
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <LazyUsersActionDialogs
        v-model:activate-dialog="activateDialog"
        v-model:deactivate-dialog="deactivateDialog"
        v-model:suspend-dialog="suspendDialog"
        :user="selectedUser"
        :loading="actionLoading"
        @activate="confirmActivate"
        @deactivate="confirmDeactivate"
        @suspend="confirmSuspend"
      />
    </template>
  </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsers } from '~/composables/useUsers'
import { useProgressiveTable } from '~/composables/useProgressiveTable'
import { useDebouncedFilters } from '~/composables/useDebouncedFilters'
import { useUserStats } from '~/composables/useUserStats'
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

// Progressive table loading
const {
  displayedItems,
  isLoadingMore,
  updateDisplayedItems
} = useProgressiveTable(filteredUsers, { batchSize: 20 })

// Debounced filters
useDebouncedFilters(filters, {
  searchDebounce: 300,
  onSearchChange: updateDisplayedItems
})

// Single-pass stats calculation
const { stats } = useUserStats(users)

// DRY navigation helper
const handleAddUser = () => navigateTo('/owner/users/add')

const viewUser = (user: any) => {
  navigateTo(`/owner/users/${user.id}`)
}

const editUser = (user: any) => {
  navigateTo(`/owner/users/edit/${user.id}`)
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

