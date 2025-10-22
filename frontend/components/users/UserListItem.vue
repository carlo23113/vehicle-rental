<template>
  <div class="flex items-center justify-between px-5 py-3 border-b border-gray-200/6 last:border-b-0 transition-colors duration-200 hover:bg-surface-variant/5">
    <div class="flex items-center gap-3 flex-grow">
      <v-avatar
        :color="user.status === 'active' ? 'primary' : 'grey'"
        size="36"
        variant="tonal"
      >
        <span class="text-caption font-weight-medium">
          {{ user.firstName[0] }}{{ user.lastName[0] }}
        </span>
      </v-avatar>
      <div class="flex-1 min-w-0">
        <div class="text-[0.8125rem] font-medium text-on-surface/87 mb-0.5">
          {{ user.firstName }} {{ user.lastName }}
        </div>
        <div class="text-[0.6875rem] text-on-surface/60">
          <span>{{ user.email }}</span>
          <span v-if="user.department" class="mx-2">•</span>
          <span v-if="user.department">{{ user.department }}</span>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <v-chip
        :color="user.status === 'active' ? 'success' : user.status === 'inactive' ? 'warning' : 'error'"
        size="small"
        variant="tonal"
      >
        {{ user.status }}
      </v-chip>
      <v-btn
        icon="mdi-eye"
        variant="text"
        size="small"
        density="comfortable"
        @click="$emit('view-user', user.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'

defineProps<{
  user: User
}>()

defineEmits<{
  'view-user': [id: number]
}>()
</script>
