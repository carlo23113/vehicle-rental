<template>
  <div class="flex items-start gap-2.5 py-2.5 border-b border-gray-200/6 last:border-b-0 transition-all duration-200 hover:bg-surface-variant/5 hover:-mx-3 hover:px-3 hover:rounded-md">
    <v-icon color="success" size="18">mdi-check-circle</v-icon>
    <div class="flex-1 min-w-0">
      <div class="text-[0.8125rem] font-medium text-on-surface/87 mb-0.5">
        {{ permission.name }}
      </div>
      <div class="text-[0.6875rem] text-on-surface/60 leading-[1.4]">
        {{ permission.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Permission } from '~/types/role'

defineProps<{
  permission: Permission
}>()
</script>
