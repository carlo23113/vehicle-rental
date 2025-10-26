<template>
  <CommonPageContainer>
    <!-- Header -->
    <CommonPageHeader
      title="Roles & Permissions"
      subtitle="Manage user roles and access permissions"
      action-text="Create Role"
      action-icon="mdi-plus"
      @action-click="openCreateDialog"
    />

    <!-- Filters -->
    <CommonFilterSection v-model="showFilters" :filters="filters" @clear="clearFilters">
      <v-row dense>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="filters.search"
            variant="outlined"
            density="comfortable"
            placeholder="Search by role name or description..."
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filters.module"
            :items="moduleFilterOptions"
            variant="outlined"
            density="comfortable"
            label="Module"
            prepend-inner-icon="mdi-view-module"
            clearable
          />
        </v-col>
      </v-row>
    </CommonFilterSection>

    <!-- Statistics -->
    <RoleStats
      :total-roles="roles.length"
      :total-users="totalUsers"
      :total-permissions="permissions.length"
      :custom-roles="customRolesCount"
    />

    <!-- Roles Grid -->
    <RoleGrid
      :roles="filteredRoles"
      @view="viewRole"
      @edit="editRole"
      @duplicate="duplicateRole"
      @delete="confirmDelete"
    />

    <!-- Create/Edit Role Dialog -->
    <RoleFormDialog v-model="showEditDialog" :role="editingRole" @save="handleSaveRole" />
  </CommonPageContainer>
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
  totalUsers,
  customRolesCount
} = useRolesPermissions()

// Filter state
const showFilters = ref(false)

const showEditDialog = ref(false)
const editingRole = ref<Role | null>(null)

const moduleFilterOptions = computed(() => [
  { title: 'All Modules', value: 'all' },
  ...getModules().map(m => ({ title: m, value: m }))
])

const openCreateDialog = () => {
  editingRole.value = null
  showEditDialog.value = true
}

const viewRole = (role: Role) => router.push(`/roles/${role.id}`)

const editRole = (role: Role) => {
  editingRole.value = role
  showEditDialog.value = true
}

const confirmDelete = (role: Role) => {
  // TODO: Implement delete confirmation dialog
  console.log('Delete role:', role)
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

