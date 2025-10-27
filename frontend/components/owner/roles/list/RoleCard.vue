<script setup lang="ts">
import type { Role } from '~/types/role'
import { useRolesPermissions } from '~/composables/useRolesPermissions'

const props = defineProps<{
  role: Role
}>()

const emit = defineEmits<{
  view: [role: Role]
  edit: [role: Role]
  duplicate: [role: Role]
  delete: [role: Role]
}>()

const { getRolePermissionCount, formatDate } = useRolesPermissions()

const getPermissionName = (permId: string) => {
  const { permissions } = useRolesPermissions()
  const perm = permissions.value.find(p => p.id === permId)
  return perm?.name.replace(/^(View|Create|Edit|Delete|Manage|Process)\s+/, '') || permId
}
</script>

<template>
  <v-card elevation="0" class="role-card h-100">
    <v-card-text class="pa-6">
      <div class="d-flex justify-space-between align-start mb-4">
        <div class="flex-grow-1">
          <div class="d-flex align-center mb-2">
            <h3 class="text-h6 font-weight-bold">{{ role.name }}</h3>
            <v-chip v-if="role.isSystem" size="x-small" color="primary" variant="flat" class="ml-2">
              System
            </v-chip>
          </div>
          <p class="text-body-2 text-medium-emphasis">{{ role.description }}</p>
        </div>
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" />
          </template>
          <v-list density="compact">
            <v-list-item @click="emit('view', role)">
              <template #prepend>
                <v-icon icon="mdi-eye" size="small" />
              </template>
              <v-list-item-title>View Details</v-list-item-title>
            </v-list-item>
            <v-list-item @click="emit('edit', role)">
              <template #prepend>
                <v-icon icon="mdi-pencil" size="small" />
              </template>
              <v-list-item-title>Edit Role</v-list-item-title>
            </v-list-item>
            <v-list-item @click="emit('duplicate', role)">
              <template #prepend>
                <v-icon icon="mdi-content-copy" size="small" />
              </template>
              <v-list-item-title>Duplicate</v-list-item-title>
            </v-list-item>
            <v-divider v-if="!role.isSystem" class="my-1" />
            <v-list-item v-if="!role.isSystem" @click="emit('delete', role)" class="text-error">
              <template #prepend>
                <v-icon icon="mdi-delete" size="small" color="error" />
              </template>
              <v-list-item-title>Delete Role</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-divider class="mb-4" />

      <div class="role-stats mb-4">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-caption text-medium-emphasis">Users with this role</span>
          <v-chip size="small" variant="tonal" color="primary">
            {{ role.userCount }}
          </v-chip>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span class="text-caption text-medium-emphasis">Permissions granted</span>
          <v-chip size="small" variant="tonal" color="success">
            {{ getRolePermissionCount(role) }}
          </v-chip>
        </div>
      </div>

      <div class="permissions-preview">
        <p class="text-caption text-medium-emphasis mb-2">Key Permissions:</p>
        <div class="d-flex flex-wrap gap-1">
          <v-chip
            v-for="permId in role.permissions.slice(0, 4)"
            :key="permId"
            size="x-small"
            variant="outlined"
            color="primary"
          >
            {{ getPermissionName(permId) }}
          </v-chip>
          <v-chip v-if="role.permissions.length > 4" size="x-small" variant="outlined">
            +{{ role.permissions.length - 4 }} more
          </v-chip>
        </div>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="pa-4">
      <v-btn variant="text" color="primary" size="small" @click="emit('view', role)" prepend-icon="mdi-eye">
        View Details
      </v-btn>
      <v-spacer />
      <span class="text-caption text-medium-emphasis"> Updated {{ formatDate(role.updatedAt) }} </span>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.role-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.2s ease;
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.permissions-preview {
  margin-top: 1rem;
}
</style>
