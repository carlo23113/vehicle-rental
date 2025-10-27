<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 bg-info-lighten-5">
        <v-icon icon="mdi-account-key" size="28" color="info" class="mr-3" />
        <div>
          <div class="text-h5 font-weight-bold">Change User Role</div>
          <div class="text-caption text-medium-emphasis">Modify user role and permissions</div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <!-- Current Role Display -->
        <div class="info-box mb-6">
          <div class="info-box-label">Current Role</div>
          <div class="info-box-value">{{ formatRole(currentRole) }}</div>
        </div>

        <!-- New Role Selection -->
        <div class="mb-4">
          <label class="field-label mb-2">New Role *</label>
          <v-select
            :model-value="role"
            variant="outlined"
            density="comfortable"
            :items="roleOptions"
            item-title="label"
            item-value="value"
            prepend-inner-icon="mdi-account-key"
            :rules="[v => !!v || 'Role is required']"
            hide-details="auto"
            @update:model-value="$emit('update:role', $event)"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-icon :icon="item.raw.icon" :color="item.raw.color" />
                </template>
                <template #subtitle>
                  {{ item.raw.description }}
                </template>
              </v-list-item>
            </template>
          </v-select>
        </div>

        <!-- Warning Notice -->
        <v-alert type="warning" variant="tonal" density="compact" class="mt-4">
          <div class="text-caption">
            <strong>Important:</strong> Changing the user role will immediately update their
            permissions and access level. This action cannot be undone automatically.
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-btn variant="outlined" @click="$emit('update:modelValue', false)"> Cancel </v-btn>
        <v-btn
          color="info"
          variant="flat"
          :loading="loading"
          :disabled="!role || role === currentRole"
          @click="$emit('confirm')"
        >
          Change Role
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types/user'

defineProps<{
  modelValue: boolean
  role: UserRole
  currentRole: UserRole
  loading: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:role': [value: UserRole]
  confirm: []
}>()

const roleOptions = [
  {
    label: 'Administrator',
    value: 'admin',
    icon: 'mdi-shield-crown',
    color: 'error',
    description: 'Full system access and management capabilities',
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: 'mdi-account-tie',
    color: 'warning',
    description: 'Manage operations, users, and generate reports',
  },
  {
    label: 'Agent',
    value: 'agent',
    icon: 'mdi-account-supervisor',
    color: 'info',
    description: 'Handle rentals, customers, and reservations',
  },
  {
    label: 'Technician',
    value: 'technician',
    icon: 'mdi-tools',
    color: 'success',
    description: 'Manage vehicles and maintenance tasks',
  },
]

const formatRole = (role: UserRole) => {
  const option = roleOptions.find(r => r.value === role)
  return option?.label || role
}
</script>

<style scoped>
.info-box {
  padding: 16px;
  background: rgba(var(--v-theme-info), 0.05);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-info), 0.2);
}

.info-box-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 4px;
}

.info-box-value {
  font-size: 24px;
  font-weight: bold;
  color: rgb(var(--v-theme-info));
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
</style>
