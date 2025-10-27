<template>
  <CommonUiDataTable
    :headers="headers"
    :items="users"
    :items-per-page="10"
    table-class="users-table"
    empty-icon="mdi-account-remove"
    empty-title="No users found"
    empty-message="Try adjusting your filters or add a new user"
    @row-click="$emit('view', $event)"
  >
    <template #item.user="{ item }">
      <div class="flex items-center py-3">
        <v-avatar color="primary" size="48" class="user-avatar">
          <span class="text-subtitle-2 font-bold">
            {{ getInitials(item) }}
          </span>
        </v-avatar>
        <div class="ml-3">
          <div class="font-bold text-base">{{ getFullName(item) }}</div>
          <div class="text-xs text-medium-emphasis">{{ item.email }}</div>
        </div>
      </div>
    </template>

    <template #item.contact="{ item }">
      <div class="text-body-2 font-medium">{{ item.phone }}</div>
    </template>

    <template #item.role="{ item }">
      <CommonUiTableChip
        :color="getRoleColor(item.role)"
        :icon="getRoleIcon(item.role)"
        :label="item.role"
        chip-class="role-chip"
      />
    </template>

    <template #item.status="{ item }">
      <CommonUiTableChip
        :color="getStatusColor(item.status)"
        :icon="getStatusIcon(item.status)"
        :label="item.status"
        chip-class="status-chip"
      />
    </template>

    <template #item.permissions="{ item }">
      <div>
        <v-chip
          v-if="item.permissions.includes('all')"
          size="x-small"
          variant="outlined"
          color="error"
          class="permission-chip"
        >
          All Access
        </v-chip>
        <template v-else>
          <v-chip
            v-for="perm in item.permissions.slice(0, 2)"
            :key="perm"
            size="x-small"
            variant="outlined"
            class="permission-chip mr-1 mb-1"
          >
            {{ perm }}
          </v-chip>
          <v-chip
            v-if="item.permissions.length > 2"
            size="x-small"
            variant="outlined"
            class="permission-chip"
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
      <CommonUiTableActionButtons
        edit-tooltip="Edit User"
        :show-delete="false"
        @view="$emit('view', item)"
        @edit="$emit('edit', item)"
      >
        <template #append>
          <CommonUiTableActionButton
            v-if="item.status === 'active'"
            icon="mdi-account-off"
            tooltip="Deactivate"
            color="warning"
            :disabled="item.role === 'admin'"
            @click="$emit('deactivate', item)"
          />
          <CommonUiTableActionButton
            v-if="item.status === 'inactive'"
            icon="mdi-account-check"
            tooltip="Activate"
            color="success"
            @click="$emit('activate', item)"
          />
          <CommonUiTableActionButton
            v-if="item.status !== 'suspended'"
            icon="mdi-account-cancel"
            tooltip="Suspend"
            color="error"
            :disabled="item.role === 'admin'"
            @click="$emit('suspend', item)"
          />
          <CommonUiTableActionButton
            v-if="item.status === 'suspended'"
            icon="mdi-account-reactivate"
            tooltip="Reactivate"
            color="success"
            @click="$emit('activate', item)"
          />
        </template>
      </CommonUiTableActionButtons>
    </template>
  </CommonUiDataTable>
</template>

<script setup lang="ts">
defineProps<{
  users: any[]
  getFullName: (user: any) => string
  getInitials: (user: any) => string
  getRoleColor: (role: string) => string
  getRoleIcon: (role: string) => string
  getStatusColor: (status: string) => string
  formatDate: (date: string) => string
}>()

defineEmits<{
  view: [user: any]
  edit: [user: any]
  activate: [user: any]
  deactivate: [user: any]
  suspend: [user: any]
}>()

const headers = [
  { title: 'User', key: 'user', sortable: true },
  { title: 'Contact', key: 'contact', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Permissions', key: 'permissions', sortable: false },
  { title: 'Last Login', key: 'lastLogin', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    active: 'mdi-check-circle',
    inactive: 'mdi-minus-circle',
    suspended: 'mdi-alert-circle',
  }
  return icons[status] || 'mdi-help-circle'
}
</script>

<style scoped>
.users-table :deep(tbody tr:hover) .user-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.user-avatar {
  transition: all 0.3s ease;
}

.role-chip {
  text-transform: capitalize;
  font-weight: 600;
}

.status-chip {
  text-transform: capitalize;
  font-weight: 600;
}

.permission-chip {
  text-transform: capitalize;
  font-weight: 500;
}
</style>
