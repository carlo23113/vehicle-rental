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
</script>

<template>
  <div v-if="role" class="p-5 max-w-[1400px] mx-auto">
    <CommonPageBreadcrumbs
      parent-label="Roles & Permissions"
      parent-icon="mdi-shield-account"
      :current-label="role.name"
      @back="handleBack"
    />

    <RolesDetailRoleDetailHeader :role="role" @edit="handleEdit" @delete="handleDelete" />

    <RolesDetailRoleInfoCards :role="role" />

    <RolesDetailPermissionsCard
      :permissions-by-module="permissionsByModule"
      :total-permissions="role.permissions.length"
    />

    <RolesDetailAssignedUsersCard :users="roleUsers" @view-user="handleViewUser" />

    <RolesFormRoleFormDialog v-model="showEditDialog" :role="role" @save="handleSaveRole" />
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
