<template>
  <v-expansion-panel class="minimal-panel" elevation="0">
    <v-expansion-panel-title class="minimal-panel-title">
      <template #default>
        <div class="d-flex align-center flex-grow-1">
          <span class="panel-title-text">{{ moduleName }}</span>
          <v-chip size="x-small" variant="text" class="ml-2 permission-count-chip">
            {{ permissions.length }} permissions
          </v-chip>
        </div>
      </template>
      <template #actions="{ expanded }">
        <v-btn
          size="x-small"
          variant="text"
          class="select-all-btn mr-2"
          @click.stop="$emit('toggle-module')"
        >
          Select All
        </v-btn>
        <v-icon size="20" :class="{ rotated: expanded }">
          mdi-chevron-down
        </v-icon>
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text class="minimal-panel-content">
      <div class="permissions-grid">
        <div v-for="permission in permissions" :key="permission.id" class="permission-row">
          <v-checkbox
            :model-value="selectedPermissions"
            @update:model-value="$emit('update:selectedPermissions', $event)"
            :value="permission.id"
            hide-details
            density="compact"
            class="permission-checkbox"
          >
            <template #label>
              <div class="permission-content">
                <span class="perm-name">{{ permission.name }}</span>
                <span class="perm-description">{{ permission.description }}</span>
              </div>
            </template>
          </v-checkbox>
        </div>
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

defineEmits<{
  'update:selectedPermissions': [value: string[]]
  'toggle-module': []
}>()
</script>

<style scoped>
.minimal-panel {
  border: none;
  border-radius: 0 !important;
  overflow: visible;
  margin-bottom: 0;
}

.minimal-panel:before {
  box-shadow: none !important;
}

.minimal-panel-title {
  padding: 12px 16px;
  min-height: auto !important;
  background: transparent;
  transition: background 0.2s ease;
}

.minimal-panel-title:hover {
  background: rgba(var(--v-theme-surface-variant), 0.2);
}

.panel-title-text {
  font-size: 0.8125rem;
  font-weight: 600;
}

.select-all-btn {
  font-size: 0.75rem;
  text-transform: none;
  letter-spacing: 0;
  padding: 0 8px;
  height: 24px;
  min-width: auto;
}

.minimal-panel-content {
  background: transparent;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0;
  padding: 8px 16px;
}

.permission-row {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
  padding: 8px 0;
}

.permission-row:last-child {
  border-bottom: none;
}

.permission-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.perm-name {
  font-weight: 500;
  font-size: 0.8125rem;
  line-height: 1.3;
}

.perm-description {
  font-size: 0.6875rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
  line-height: 1.3;
}

.rotated {
  transform: rotate(180deg);
}

.v-icon {
  transition: transform 0.3s ease;
}
</style>
