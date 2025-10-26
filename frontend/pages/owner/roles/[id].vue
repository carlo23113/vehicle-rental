<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRolesPermissions } from '~/composables/useRolesPermissions'
import { useUsers } from '~/composables/useUsers'
import { useRoleDetail } from '~/composables/useRoleDetail'

const route = useRoute()
const { roles, permissions, deleteRole, updateRole } = useRolesPermissions()
const { users } = useUsers()

const roleId = computed(() => Number(route.params.id))
const role = computed(() => roles.value.find(r => r.id === roleId.value))
const roleUsers = computed(() => users.value.filter(u => u.roleId === roleId.value))

const { permissionsByModule, handleSaveRole, handleDelete, handleBack, handleViewUser } = useRoleDetail(
  roleId,
  role,
  permissions,
  deleteRole,
  updateRole
)

const showEditDialog = ref(false)
const handleEdit = () => (showEditDialog.value = true)

const getHeaderActions = (role: any): Array<{
  key: string
  label: string
  icon: string
  variant: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  color?: string
}> => {
  const actions: Array<{
    key: string
    label: string
    icon: string
    variant: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
    color?: string
  }> = [
    {
      key: 'edit',
      label: 'Edit',
      icon: 'mdi-pencil',
      variant: 'outlined'
    }
  ]

  if (!role.isSystem) {
    actions.push({
      key: 'delete',
      label: 'Delete',
      icon: 'mdi-delete',
      variant: 'text',
      color: 'error'
    })
  }

  return actions
}

const handleHeaderAction = (key: string) => {
  if (key === 'edit') {
    handleEdit()
  } else if (key === 'delete') {
    handleDelete()
  }
}
</script>

<template>
  <div v-if="role" class="p-5 max-w-[1400px] mx-auto">
    <CommonPageDetailPageHeader
      :title="role.name"
      :subtitle="role.description"
      :badge="role.isSystem ? 'System' : undefined"
      badge-color="primary"
      show-breadcrumbs
      parent-label="Roles & Permissions"
      parent-icon="mdi-shield-account"
      :actions="getHeaderActions(role)"
      @back="handleBack"
      @action="handleHeaderAction"
    />

    <RoleInfoCards :role="role" />

    <PermissionsCard
      :permissions-by-module="permissionsByModule"
      :total-permissions="role.permissions.length"
    />

    <AssignedUsersCard :users="roleUsers" @view-user="handleViewUser" />

    <RoleFormDialog v-model="showEditDialog" :role="role" @save="handleSaveRole" />
  </div>
  <div v-else class="py-12 px-6 max-w-[600px] mx-auto">
    <v-card class="text-center pa-8" elevation="0">
      <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="mb-2">Role Not Found</h2>
      <p class="text-medium-emphasis mb-4">The role you're looking for doesn't exist.</p>
      <v-btn color="primary" @click="handleBack"> Back to Roles </v-btn>
    </v-card>
  </div>
</template>
