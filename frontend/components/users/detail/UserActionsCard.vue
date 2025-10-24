<template>
  <CommonUiDetailCard title="Actions" icon="mdi-cog">
    <div class="d-flex flex-column gap-3">
      <CommonUiActionButton
        icon="mdi-pencil"
        title="Edit User"
        subtitle="Update user information"
        color="primary"
        @click="$emit('edit')"
      />

      <CommonUiActionButton
        icon="mdi-lock-reset"
        title="Change Password"
        subtitle="Update user password"
        color="warning"
        @click="$emit('change-password')"
      />

      <CommonUiActionButton
        icon="mdi-account-key"
        title="Change Role"
        subtitle="Modify user role and permissions"
        color="info"
        @click="$emit('change-role')"
      />

      <v-divider class="my-2" />

      <!-- Status Actions -->
      <CommonUiActionButton
        v-if="status === 'inactive' || status === 'suspended'"
        icon="mdi-account-check"
        title="Activate User"
        subtitle="Restore user access"
        color="success"
        @click="$emit('activate')"
      />

      <CommonUiActionButton
        v-if="status === 'active'"
        icon="mdi-account-off"
        title="Deactivate User"
        subtitle="Temporarily disable access"
        color="warning"
        @click="$emit('deactivate')"
      />

      <CommonUiActionButton
        v-if="status === 'active'"
        icon="mdi-account-cancel"
        title="Suspend User"
        subtitle="Restrict user access"
        color="error"
        @click="$emit('suspend')"
      />
    </div>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
import type { UserStatus } from '~/types/user'

defineProps<{
  status: UserStatus
  role: string
}>()

defineEmits<{
  edit: []
  'change-password': []
  'change-role': []
  activate: []
  deactivate: []
  suspend: []
}>()
</script>
