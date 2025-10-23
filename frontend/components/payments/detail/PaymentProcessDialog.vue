<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 bg-success-lighten-5">
        <v-icon icon="mdi-credit-card-check" size="28" color="success" class="mr-3" />
        <div>
          <div class="text-h5 font-weight-bold">Process Payment</div>
          <div class="text-caption text-medium-emphasis">Mark payment as completed</div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <!-- Payment Amount Display -->
        <div class="info-box mb-6">
          <div class="info-box-label">Payment Amount</div>
          <div class="info-box-value">{{ amount }}</div>
        </div>

        <!-- Transaction ID -->
        <div class="mb-4">
          <label class="field-label mb-2">Transaction ID *</label>
          <v-text-field
            :model-value="transactionId"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-identifier"
            placeholder="Enter transaction ID from payment processor"
            :rules="[v => !!v || 'Transaction ID is required']"
            hide-details="auto"
            @update:model-value="$emit('update:transactionId', $event)"
          />
        </div>

        <!-- Info Notice -->
        <v-alert type="info" variant="tonal" density="compact" class="mt-4">
          <div class="text-caption">
            <strong>Note:</strong> This will mark the payment as completed and update the rental
            status.
          </div>
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-btn variant="outlined" @click="$emit('update:modelValue', false)"> Cancel </v-btn>
        <v-btn
          color="success"
          variant="flat"
          :loading="loading"
          :disabled="!transactionId"
          @click="$emit('confirm')"
        >
          Process Payment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  transactionId: string
  amount: string
  loading: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:transactionId': [value: string]
  confirm: []
}>()
</script>

<style scoped>
.info-box {
  padding: 16px;
  background: rgba(var(--v-theme-success), 0.05);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-success), 0.2);
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
  color: rgb(var(--v-theme-success));
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
</style>
