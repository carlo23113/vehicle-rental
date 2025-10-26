<template>
  <CommonPageLayout
    title="Roles & Permissions"
    subtitle="Manage user roles and access permissions"
    action-text="Create Role"
    action-icon="mdi-plus"
    @action-click="openCreateDialog"
  >
    <!-- Filters Slot -->
    <template #filters="{ showFilters: isFilterVisible, sectionsLoaded: sections }">
      <LazyRolesFilters
        v-if="isFilterVisible || sections.stats"
        v-model:show-filters="showFilters"
        v-model:filters="filters"
        :module-filter-options="moduleFilterOptions"
        @clear="clearFilters"
      />
    </template>

    <!-- Stats Slot -->
    <template #stats>
      <LazyRolesStatsCards
        :total-roles="roles.length"
        :total-users="totalUsers"
        :total-permissions="permissions.length"
        :custom-roles="customRolesCount"
      />
    </template>

    <!-- Main Content Slot (Grid View) -->
    <template #content>
      <LazyRolesGridSection
        :roles="filteredRoles"
        @view="viewRole"
        @edit="editRole"
        @duplicate="duplicateRole"
        @delete="confirmDelete"
      />
    </template>

    <!-- Content Skeleton Slot (Grid Skeleton) -->
    <template #content-skeleton>
      <LazyCommonUiGridSkeleton :cols="12" :md="6" :lg="4" />
    </template>

    <!-- Dialogs Slot -->
    <template #dialogs>
      <LazyRoleFormDialog
        v-if="showEditDialog"
        v-model="showEditDialog"
        :role="editingRole"
        @save="handleSaveRole"
      />

      <LazyRolesDeleteDialog
        v-if="showDeleteDialog"
        v-model="showDeleteDialog"
        :role="roleToDelete"
        :loading="deleting"
        @confirm="handleDeleteRole"
      />
    </template>
  </CommonPageLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRolesPermissions } from '~/composables/useRolesPermissions'
import type { Role } from '~/types/role'

const router = useRouter()
const {
  roles,
  permissions,
  filters,
  filteredRoles,
  getModules,
  duplicateRole,
  addRole,
  updateRole,
  deleteRole,
  totalUsers,
  customRolesCount
} = useRolesPermissions()

// UI state
const showFilters = ref(false)
const showEditDialog = ref(false)
const editingRole = ref<Role | null>(null)
const showDeleteDialog = ref(false)
const roleToDelete = ref<Role | null>(null)
const deleting = ref(false)

const moduleFilterOptions = computed(() => [
  { title: 'All Modules', value: 'all' },
  ...getModules().map(m => ({ title: m, value: m }))
])

const openCreateDialog = () => {
  editingRole.value = null
  showEditDialog.value = true
}

const viewRole = (role: Role) => router.push(`/owner/roles/${role.id}`)

const editRole = (role: Role) => {
  editingRole.value = role
  showEditDialog.value = true
}

const confirmDelete = (role: Role) => {
  roleToDelete.value = role
  showDeleteDialog.value = true
}

const handleDeleteRole = (role: Role) => {
  deleting.value = true
  try {
    deleteRole(role.id)
    showDeleteDialog.value = false
    roleToDelete.value = null
  } catch (error) {
    console.error('Failed to delete role:', error)
  } finally {
    deleting.value = false
  }
}

const handleSaveRole = (data: { name: string; description: string; permissions: string[] }) => {
  editingRole.value
    ? updateRole(editingRole.value.id, data)
    : addRole({ ...data, isSystem: false })
  showEditDialog.value = false
}

const clearFilters = () => {
  filters.value = {
    search: '',
    module: 'all',
  }
}
</script>

