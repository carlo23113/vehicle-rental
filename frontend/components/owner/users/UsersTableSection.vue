<template>
  <v-row>
    <v-col cols="12">
      <UsersTable
        :users="displayedItems"
        :get-full-name="getFullName"
        :get-initials="getInitials"
        :get-role-color="getRoleColor"
        :get-role-icon="getRoleIcon"
        :get-status-color="getStatusColor"
        :format-date="formatDate"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @activate="$emit('activate', $event)"
        @deactivate="$emit('deactivate', $event)"
        @suspend="$emit('suspend', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more users...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'

defineProps<{
  displayedItems: User[]
  isLoadingMore: boolean
  getFullName: (user: User) => string
  getInitials: (user: User) => string
  getRoleColor: (role: string) => string
  getRoleIcon: (role: string) => string
  getStatusColor: (status: string) => string
  formatDate: (date: string) => string
}>()

defineEmits<{
  view: [user: User]
  edit: [user: User]
  activate: [user: User]
  deactivate: [user: User]
  suspend: [user: User]
}>()
</script>
