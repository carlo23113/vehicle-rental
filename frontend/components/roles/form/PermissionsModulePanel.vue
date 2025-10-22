<template>
  <v-expansion-panel
    class="border-none rounded-none overflow-visible mb-0 before:shadow-none"
    elevation="0"
  >
    <v-expansion-panel-title
      class="px-4 py-3 min-h-0 bg-transparent transition-colors duration-200 hover:bg-surface-variant/20"
    >
      <template #default>
        <div class="flex items-center flex-grow">
          <span class="text-[0.8125rem] font-semibold">{{ moduleName }}</span>
          <v-chip size="x-small" variant="text" class="ml-2">
            {{ permissions.length }} permissions
          </v-chip>
        </div>
      </template>
      <template #actions="{ expanded }">
        <v-btn
          size="x-small"
          variant="text"
          class="text-xs normal-case tracking-normal px-2 h-6 min-w-0 mr-2"
          @click.stop="emit('toggle-module')"
        >
          Select All
        </v-btn>
        <v-icon
          size="20"
          :class="expanded ? 'rotate-180' : ''"
          class="transition-transform duration-300"
        >
          mdi-chevron-down
        </v-icon>
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text class="bg-transparent">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-0 px-4 py-2">
        <PermissionCheckbox
          v-for="permission in permissions"
          :key="permission.id"
          :permission="permission"
          :model-value="selectedPermissions"
          @update:model-value="emit('update:selectedPermissions', $event)"
        />
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import type { Permission } from '~/types/role'

defineProps<{
  moduleName: string
  permissions: Permission[]
  selectedPermissions: string[]
}>()

const emit = defineEmits<{
  'update:selectedPermissions': [value: string[]]
  'toggle-module': []
}>()
</script>
