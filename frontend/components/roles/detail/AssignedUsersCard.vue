<script setup lang="ts">
import type { User } from '~/types/user'

defineProps<{
  users: User[]
}>()

defineEmits<{
  'view-user': [userId: number]
}>()
</script>

<template>
  <v-card class="border border-gray-200/12 rounded-[10px] mt-5" elevation="0">
    <v-card-title class="bg-surface px-5 py-4">
      <div class="flex items-center justify-between w-full">
        <h2 class="text-base font-semibold text-on-surface/87 mb-0">Assigned Users</h2>
        <v-chip size="small" variant="tonal" color="primary">
          {{ users.length }} user{{ users.length !== 1 ? 's' : '' }}
        </v-chip>
      </div>
    </v-card-title>
    <v-divider />
    <v-card-text class="pa-0">
      <div v-if="users.length > 0" class="flex flex-col">
        <UserListItem
          v-for="user in users"
          :key="user.id"
          :user="user"
          @view-user="$emit('view-user', $event)"
        />
      </div>
      <div v-else class="pa-8 text-center">
        <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-account-off</v-icon>
        <p class="text-body-2 text-medium-emphasis mb-0">No users assigned to this role</p>
      </div>
    </v-card-text>
  </v-card>
</template>
