<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 bg-primary-lighten-5">
        <v-icon icon="mdi-pencil" size="28" color="primary" class="mr-3" />
        <div>
          <div class="text-h5 font-weight-bold">Edit User</div>
          <div class="text-caption text-medium-emphasis">Update user information</div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6">
            <div class="mb-4">
              <label class="field-label mb-2">First Name *</label>
              <v-text-field
                :model-value="firstName"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-account"
                placeholder="Enter first name"
                :rules="[v => !!v || 'First name is required']"
                hide-details="auto"
                @update:model-value="$emit('update:firstName', $event)"
              />
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="mb-4">
              <label class="field-label mb-2">Last Name *</label>
              <v-text-field
                :model-value="lastName"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-account"
                placeholder="Enter last name"
                :rules="[v => !!v || 'Last name is required']"
                hide-details="auto"
                @update:model-value="$emit('update:lastName', $event)"
              />
            </div>
          </v-col>

          <v-col cols="12">
            <div class="mb-4">
              <label class="field-label mb-2">Email *</label>
              <v-text-field
                :model-value="email"
                type="email"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-email"
                placeholder="user@example.com"
                :rules="[
                  v => !!v || 'Email is required',
                  v => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
                hide-details="auto"
                @update:model-value="$emit('update:email', $event)"
              />
            </div>
          </v-col>

          <v-col cols="12">
            <div class="mb-4">
              <label class="field-label mb-2">Phone *</label>
              <v-text-field
                :model-value="phone"
                type="tel"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-phone"
                placeholder="(555) 123-4567"
                :rules="[v => !!v || 'Phone is required']"
                hide-details="auto"
                @update:model-value="$emit('update:phone', $event)"
              />
            </div>
          </v-col>

          <v-col cols="12">
            <div class="mb-4">
              <label class="field-label mb-2">Department</label>
              <v-text-field
                :model-value="department"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-office-building"
                placeholder="Enter department"
                hide-details
                @update:model-value="$emit('update:department', $event)"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-btn variant="outlined" @click="$emit('update:modelValue', false)"> Cancel </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          :disabled="!firstName || !lastName || !email || !phone"
          @click="$emit('confirm')"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  loading: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:firstName': [value: string]
  'update:lastName': [value: string]
  'update:email': [value: string]
  'update:phone': [value: string]
  'update:department': [value: string]
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
