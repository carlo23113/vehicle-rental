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
    <LazyRolesFilters
      v-model="showFilters"
      :filters="filters"
      :module-filter-options="moduleFilterOptions"
      @clear="clearFilters"
    />

    <!-- Statistics -->
    <div ref="statsSection">
      <LazyRolesStatsCards
        v-if="sectionsLoaded.stats"
        :total-roles="roles.length"
        :total-users="totalUsers"
        :total-permissions="permissions.length"
        :custom-roles="customRolesCount"
      />
      <LazyRolesStatsSkeleton v-else />
    </div>

    <!-- Roles Grid -->
    <div ref="gridSection">
      <LazyRolesGridSection
        v-if="sectionsLoaded.grid"
        :roles="filteredRoles"
        @view="viewRole"
        @edit="editRole"
        @duplicate="duplicateRole"
        @delete="confirmDelete"
      />
      <LazyRolesGridSkeleton v-else />
    </div>

    <!-- Create/Edit Role Dialog -->
    <LazyRoleFormDialog v-model="showEditDialog" :role="editingRole" @save="handleSaveRole" />

    <!-- Delete Confirmation Dialog -->
    <LazyRolesDeleteDialog
      v-model="showDeleteDialog"
      :role="roleToDelete"
      :loading="deleting"
      @confirm="handleDeleteRole"
    />
  </CommonPageContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

// Filter state
const showFilters = ref(false)

// Dialog states
const showEditDialog = ref(false)
const editingRole = ref<Role | null>(null)
const showDeleteDialog = ref(false)
const roleToDelete = ref<Role | null>(null)
const deleting = ref(false)

// Progressive section loading with intersection observer
const statsSection = ref<HTMLElement | null>(null)
const gridSection = ref<HTMLElement | null>(null)

const sectionsLoaded = ref({
  stats: false,
  grid: false,
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  // Immediate load stats
  sectionsLoaded.value.stats = true

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === gridSection.value) {
            sectionsLoaded.value.grid = true
          }
        }
      })
    },
    { rootMargin: '100px' }
  )

  if (gridSection.value) observer.observe(gridSection.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

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

