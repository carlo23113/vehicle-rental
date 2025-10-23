<template>
  <CommonUiDataTable
    :headers="headers"
    :items="users"
    :items-per-page="10"
    table-class="users-table"
    empty-icon="mdi-account-remove"
    empty-title="No users found"
    empty-message="Try adjusting your filters or add a new user"
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
      <div>
        <div class="text-body-2 font-medium">{{ item.phone }}</div>
        <div v-if="item.department" class="text-xs text-medium-emphasis mt-1">
          {{ item.department }}
        </div>
      </div>
    </template>

    <template #item.role="{ item }">
      <v-chip
        :color="getRoleColor(item.role)"
        size="small"
        variant="flat"
        class="role-chip"
      >
        <v-icon :icon="getRoleIcon(item.role)" start size="14" />
        {{ item.role }}
      </v-chip>
    </template>

    <template #item.status="{ item }">
      <v-chip
        :color="getStatusColor(item.status)"
        size="small"
        variant="flat"
        class="status-chip"
      >
        <v-icon :icon="getStatusIcon(item.status)" start size="14" />
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
      <div class="flex gap-2" @click.stop>
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="tonal"
          color="info"
          class="action-btn"
          @click="$emit('view', item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="tonal"
          color="primary"
          class="action-btn"
          @click="$emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="tonal"
          color="error"
          class="action-btn"
          :disabled="item.role === 'admin'"
          @click="$emit('delete', item)"
        />
      </div>
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
  delete: [user: any]
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

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}
</style>
