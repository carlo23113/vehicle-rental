<template>
  <CommonUiDetailCard title="Permissions" icon="mdi-shield-check">
    <div class="permissions-grid">
      <v-chip
        v-for="permission in permissions"
        :key="permission"
        color="primary"
        variant="tonal"
        size="small"
        prepend-icon="mdi-check"
      >
        {{ formatPermission(permission) }}
      </v-chip>
    </div>

    <v-alert
      v-if="permissions.includes('all')"
      type="warning"
      variant="tonal"
      density="compact"
      icon="mdi-shield-alert"
      class="mt-4"
    >
      This user has full system access with all permissions.
    </v-alert>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
defineProps<{
  permissions: string[]
}>()

const formatPermission = (permission: string) => {
  if (permission === 'all') return 'All Permissions'
  return permission.charAt(0).toUpperCase() + permission.slice(1)
}
</script>

<style scoped>
.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
