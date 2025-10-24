<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 bg-warning-lighten-5">
        <v-icon icon="mdi-lock-reset" size="28" color="warning" class="mr-3" />
        <div>
          <div class="text-h5 font-weight-bold">Change Password</div>
          <div class="text-caption text-medium-emphasis">Update user password</div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <div class="mb-4">
          <label class="field-label mb-2">New Password *</label>
          <v-text-field
            :model-value="newPassword"
            type="password"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-lock"
            placeholder="Enter new password"
            :rules="[
              v => !!v || 'Password is required',
              v => v.length >= 8 || 'Password must be at least 8 characters',
            ]"
            hide-details="auto"
            @update:model-value="$emit('update:newPassword', $event)"
          />
        </div>

        <div class="mb-4">
          <label class="field-label mb-2">Confirm Password *</label>
          <v-text-field
            :model-value="confirmPassword"
            type="password"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-lock-check"
            placeholder="Confirm new password"
            :rules="[
              v => !!v || 'Please confirm password',
              v => v === newPassword || 'Passwords do not match',
            ]"
            hide-details="auto"
            @update:model-value="$emit('update:confirmPassword', $event)"
          />
        </div>

        <v-alert type="info" variant="tonal" density="compact" class="mt-4">
          <div class="text-caption">
            <strong>Password Requirements:</strong>
            <ul class="mt-2 ml-4">
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
            </ul>
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-btn variant="outlined" @click="$emit('update:modelValue', false)"> Cancel </v-btn>
        <v-btn
          color="warning"
          variant="flat"
          :loading="loading"
          :disabled="!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8"
          @click="$emit('confirm')"
        >
          Change Password
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  newPassword: string
  confirmPassword: string
  loading: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:newPassword': [value: string]
  'update:confirmPassword': [value: string]
  confirm: []
}>()
</script>

<style scoped>
.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
</style>
