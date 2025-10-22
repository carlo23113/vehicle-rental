<template>
  <div>
    <PermissionsSectionHeader
      :selected-count="selectedCount"
      @select-all="emit('select-all')"
      @clear-all="emit('clear-all')"
    />

    <v-expansion-panels
      :model-value="expandedModules"
      @update:model-value="handleExpandedUpdate"
      variant="accordion"
      multiple
      class="border-none rounded-none overflow-hidden gap-0"
    >
      <PermissionsModulePanel
        v-for="(perms, module) in permissionsByModule"
        :key="module"
        :module-name="String(module)"
        :permissions="perms"
        :selected-permissions="selectedPermissions"
        @update:selected-permissions="emit('update:selectedPermissions', $event)"
        @toggle-module="emit('toggle-module', String(module))"
      />
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import type { Permission } from '~/types/role'

defineProps<{
  permissionsByModule: Record<string, Permission[]>
  selectedPermissions: string[]
  selectedCount: number
  expandedModules: number[]
}>()

const emit = defineEmits<{
  'update:selectedPermissions': [value: string[]]
  'update:expandedModules': [value: number[]]
  'select-all': []
  'clear-all': []
  'toggle-module': [module: string]
}>()

const handleExpandedUpdate = (value: unknown) => {
  emit('update:expandedModules', value as number[])
}
</script>
