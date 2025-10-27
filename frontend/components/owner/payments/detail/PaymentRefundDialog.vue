<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 bg-warning-lighten-5">
        <v-icon icon="mdi-keyboard-return" size="28" color="warning" class="mr-3" />
        <div>
          <div class="text-h5 font-weight-bold">Issue Refund</div>
          <div class="text-caption text-medium-emphasis">Process refund for this payment</div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <!-- Original Amount Display -->
        <div class="info-box mb-6">
          <div class="info-box-label">Original Payment Amount</div>
          <div class="info-box-value">{{ originalAmount }}</div>
        </div>

        <!-- Refund Amount -->
        <div class="mb-4">
          <label class="field-label mb-2">Refund Amount *</label>
          <v-text-field
            :model-value="refundAmount"
            type="number"
            variant="outlined"
            density="comfortable"
            :prepend-inner-icon="getCurrencyIcon()"
            placeholder="0.00"
            :rules="[
              v => !!v || 'Refund amount is required',
              v => v > 0 || 'Amount must be greater than 0',
              v => v <= maxAmount || 'Cannot refund more than payment amount',
            ]"
            hide-details="auto"
            @update:model-value="$emit('update:refundAmount', parseFloat($event) || 0)"
          />
        </div>

        <!-- Quick Amount Buttons -->
        <div class="quick-amounts mb-4">
          <v-btn
            size="small"
            variant="outlined"
            @click="$emit('update:refundAmount', maxAmount * 0.25)"
          >
            25%
          </v-btn>
          <v-btn
            size="small"
            variant="outlined"
            @click="$emit('update:refundAmount', maxAmount * 0.5)"
          >
            50%
          </v-btn>
          <v-btn
            size="small"
            variant="outlined"
            @click="$emit('update:refundAmount', maxAmount * 0.75)"
          >
            75%
          </v-btn>
          <v-btn
            size="small"
            variant="outlined"
            color="warning"
            @click="$emit('update:refundAmount', maxAmount)"
          >
            Full Amount
          </v-btn>
        </div>

        <!-- Reason -->
        <div class="mb-4">
          <label class="field-label mb-2">Reason for Refund *</label>
          <v-textarea
            :model-value="reason"
            variant="outlined"
            density="comfortable"
            rows="3"
            placeholder="Please provide a reason for this refund..."
            hide-details
            @update:model-value="$emit('update:reason', $event)"
          />
        </div>

        <!-- Warning Notice -->
        <v-alert type="warning" variant="tonal" density="compact" class="mt-4">
          <div class="text-caption">
            <strong>Important:</strong> This action cannot be undone. The refund will be processed
            immediately.
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
          :disabled="!refundAmount || refundAmount <= 0 || refundAmount > maxAmount || !reason"
          @click="$emit('confirm')"
        >
          Issue Refund
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const { getCurrencyIcon } = useCurrency()

defineProps<{
  modelValue: boolean
  refundAmount: number
  reason: string
  originalAmount: string
  maxAmount: number
  loading: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:refundAmount': [value: number]
  'update:reason': [value: string]
  confirm: []
}>()
</script>

<style scoped>
.info-box {
  padding: 16px;
  background: rgba(var(--v-theme-warning), 0.05);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-warning), 0.2);
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
  color: rgb(var(--v-theme-warning));
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.quick-amounts {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
