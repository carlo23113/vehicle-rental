<template>
  <CommonUiDetailCard title="User Information" icon="mdi-account-details">
    <CommonUiDetailItem label="Email" icon="mdi-email">
      <a :href="`mailto:${email}`" class="text-primary text-decoration-none">
        {{ email }}
      </a>
    </CommonUiDetailItem>

    <CommonUiDetailItem label="Phone" icon="mdi-phone">
      <a :href="`tel:${phone}`" class="text-primary text-decoration-none">
        {{ phone }}
      </a>
    </CommonUiDetailItem>

    <CommonUiDetailItem label="Role" icon="mdi-account-key">
      <v-chip :color="getRoleColor(role)" size="small" label>
        {{ roleLabel }}
      </v-chip>
    </CommonUiDetailItem>

    <CommonUiDetailItem label="Status" icon="mdi-information">
      <v-chip :color="statusColor" size="small" label>
        {{ status }}
      </v-chip>
    </CommonUiDetailItem>

    <CommonUiDetailItem
      v-if="department"
      label="Department"
      icon="mdi-office-building"
      :value="department"
    />

    <CommonUiDetailItem
      label="Join Date"
      icon="mdi-calendar-plus"
      :value="joinDate"
    />

    <CommonUiDetailItem
      label="Last Login"
      icon="mdi-clock-outline"
      :value="lastLogin"
    />
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types/user'

defineProps<{
  email: string
  phone: string
  role: UserRole
  roleLabel: string
  status: string
  statusColor: string
  department?: string
  joinDate: string
  lastLogin: string
}>()

const getRoleColor = (role: UserRole) => {
  const colors: Record<UserRole, string> = {
    admin: 'error',
    manager: 'warning',
    agent: 'info',
    technician: 'success',
  }
  return colors[role] || 'grey'
}
</script>
