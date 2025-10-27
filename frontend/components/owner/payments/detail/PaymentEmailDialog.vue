<template>
  <v-dialog
    :model-value="modelValue"
    max-width="550"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 bg-info-lighten-5">
        <v-icon icon="mdi-email-fast" size="28" color="info" class="mr-3" />
        <div>
          <div class="text-h5 font-weight-bold">Email Receipt</div>
          <div class="text-caption text-medium-emphasis">Send payment receipt via email</div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <!-- Email Address -->
        <div class="mb-4">
          <label class="field-label mb-2">Recipient Email Address *</label>
          <v-text-field
            :model-value="emailAddress"
            type="email"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-email"
            placeholder="customer@example.com"
            readonly
            :rules="[
              v => !!v || 'Email is required',
              v => /.+@.+\..+/.test(v) || 'Email must be valid',
            ]"
            hide-details="auto"
            @update:model-value="$emit('update:emailAddress', $event)"
          />
        </div>

        <!-- Include Options -->
        <div class="options-section">
          <div class="options-label mb-3">Email Content Options</div>
          <v-checkbox
            :model-value="includeDetails"
            density="compact"
            hide-details
            @update:model-value="$emit('update:includeDetails', !!$event)"
          >
            <template #label>
              <div class="checkbox-label">
                <div class="font-weight-medium">Include rental details</div>
                <div class="text-caption text-medium-emphasis">
                  Include vehicle and rental information in the email
                </div>
              </div>
            </template>
          </v-checkbox>
        </div>

        <!-- Info Notice -->
        <v-alert type="info" variant="tonal" density="compact" class="mt-4">
          <div class="text-caption">
            <strong>Note:</strong> The receipt will be sent as a PDF attachment with all payment
            details.
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-btn variant="outlined" size="large" @click="$emit('update:modelValue', false)">
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          color="info"
          variant="flat"
          size="large"
          :loading="loading"
          :disabled="!emailAddress || !/.+@.+\..+/.test(emailAddress)"
          @click="$emit('confirm')"
        >
          <v-icon start>mdi-send</v-icon>
          Send Email
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  emailAddress: string
  includeDetails: boolean
  loading: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:emailAddress': [value: string]
  'update:includeDetails': [value: boolean]
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

.options-section {
  padding: 16px;
  background: rgba(var(--v-theme-info), 0.05);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-info), 0.15);
}

.options-label {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.checkbox-label {
  @apply ml-2;
  line-height: 1.4;
}
</style>
