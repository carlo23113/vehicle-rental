<template>
  <v-dialog :model-value="modelValue" max-width="500" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="pa-4">
        <h3 class="text-h6 font-weight-bold">Mark Invoice as Paid</h3>
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="form.paymentMethod"
              :items="paymentMethods"
              label="Payment Method"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.paymentReference"
              label="Payment Reference"
              variant="outlined"
              density="comfortable"
              placeholder="e.g., TXN-123456"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model.number="form.amountPaid"
              label="Amount Paid"
              type="number"
              variant="outlined"
              density="comfortable"
              prefix="$"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="success" variant="flat" @click="handleConfirm">Mark as Paid</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  invoice: any | null
  paymentMethods?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [data: { paymentMethod: string; paymentReference: string; amountPaid: number }]
}>()

const form = ref({
  paymentMethod: '',
  paymentReference: '',
  amountPaid: 0,
})

// Reset form when invoice changes
watch(() => props.invoice, (newInvoice) => {
  if (newInvoice) {
    form.value.amountPaid = newInvoice.amountDue
    form.value.paymentMethod = ''
    form.value.paymentReference = ''
  }
})

const handleConfirm = () => {
  emit('confirm', { ...form.value })
  emit('update:modelValue', false)
}
</script>
