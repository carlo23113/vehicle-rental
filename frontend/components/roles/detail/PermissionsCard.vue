<script setup lang="ts">
interface Permission {
  id: string
  name: string
  description: string
  module: string
}

defineProps<{
  permissionsByModule: Record<string, Permission[]>
  totalPermissions: number
}>()
</script>

<template>
  <v-card class="border border-gray-200/12 rounded-[10px]" elevation="0">
    <v-card-title class="bg-surface px-5 py-4">
      <div class="flex items-center justify-between w-full">
        <h2 class="text-base font-semibold text-on-surface/87 mb-0">Permissions</h2>
        <v-chip size="small" variant="tonal" color="primary">
          {{ totalPermissions }} total
        </v-chip>
      </div>
    </v-card-title>
    <v-divider />
    <v-card-text class="pa-5">
      <div v-for="(perms, module) in permissionsByModule" :key="module" class="mb-6 last:mb-0">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-gray-200/8">
          <h3 class="text-sm font-semibold text-on-surface/87 uppercase tracking-wider m-0">{{ module }}</h3>
          <v-chip size="x-small" variant="text" class="text-xs font-medium text-on-surface/60">
            {{ perms.length }}
          </v-chip>
        </div>
        <div class="flex flex-col gap-0">
          <RolesDetailPermissionListItem
            v-for="permission in perms"
            :key="permission.id"
            :permission="permission"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
