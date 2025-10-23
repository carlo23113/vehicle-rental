<template>
  <v-form ref="formRef" @submit.prevent="handleSubmit">
    <v-card>
      <v-card-text class="pa-6">
        <!-- Rental Selection -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-4">Rental Information</h3>
          <v-select
            :model-value="modelValue.rentalId"
            label="Select Rental *"
            variant="outlined"
            density="comfortable"
            :items="rentalItems"
            item-title="label"
            item-value="value"
            placeholder="Choose rental to record payment for"
            prepend-inner-icon="mdi-car-info"
            :rules="[v => !!v || 'Rental is required']"
            @update:model-value="updateField('rentalId', $event)"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-icon icon="mdi-car" />
                </template>
                <template #subtitle>
                  {{ item.raw.subtitle }}
                </template>
              </v-list-item>
            </template>
          </v-select>
        </div>

        <!-- Payment Details -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-4">Payment Details</h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                :model-value="modelValue.amount"
                label="Amount *"
                variant="outlined"
                density="comfortable"
                type="number"
                prefix="$"
                placeholder="0.00"
                step="0.01"
                min="0"
                prepend-inner-icon="mdi-currency-usd"
                :rules="[
                  v => !!v || 'Amount is required',
                  v => v > 0 || 'Amount must be greater than 0',
                ]"
                @update:model-value="updateField('amount', parseFloat($event) || 0)"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                :model-value="modelValue.paymentMethod"
                label="Payment Method *"
                variant="outlined"
                density="comfortable"
                :items="paymentMethodOptions"
                prepend-inner-icon="mdi-credit-card"
                :rules="[v => !!v || 'Payment method is required']"
                @update:model-value="updateField('paymentMethod', $event)"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                :model-value="modelValue.status"
                label="Status *"
                variant="outlined"
                density="comfortable"
                :items="statusOptions"
                prepend-inner-icon="mdi-information"
                :rules="[v => !!v || 'Status is required']"
                @update:model-value="updateField('status', $event)"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                :model-value="modelValue.paymentDate"
                label="Payment Date *"
                variant="outlined"
                density="comfortable"
                type="date"
                prepend-inner-icon="mdi-calendar"
                :rules="[v => !!v || 'Payment date is required']"
                @update:model-value="updateField('paymentDate', $event)"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                :model-value="modelValue.transactionId"
                label="Transaction ID"
                variant="outlined"
                density="comfortable"
                placeholder="TXN-2025-XXXXXX"
                prepend-inner-icon="mdi-identifier"
                hint="Optional - Leave empty for auto-generation"
                persistent-hint
                @update:model-value="updateField('transactionId', $event)"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                :model-value="modelValue.description"
                label="Description *"
                variant="outlined"
                density="comfortable"
                rows="3"
                placeholder="Describe the payment purpose..."
                prepend-inner-icon="mdi-text"
                :rules="[v => !!v || 'Description is required']"
                @update:model-value="updateField('description', $event)"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                :model-value="modelValue.notes"
                label="Additional Notes"
                variant="outlined"
                density="comfortable"
                rows="2"
                placeholder="Optional notes..."
                prepend-inner-icon="mdi-note-text"
                hint="Optional"
                persistent-hint
                @update:model-value="updateField('notes', $event)"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-btn
          variant="outlined"
          size="large"
          @click="$emit('cancel')"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          size="large"
          :loading="loading"
          prepend-icon="mdi-check"
        >
          Record Payment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Rental {
  id: number
  customerName: string
  vehicleName: string
  startDate: string
  endDate: string
  totalAmount: number
}

interface PaymentFormData {
  rentalId: number | null
  amount: number
  paymentMethod: string
  status: string
  paymentDate: string
  transactionId: string
  description: string
  notes: string
}

const props = defineProps<{
  modelValue: PaymentFormData
  loading: boolean
  rentals: Rental[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PaymentFormData]
  submit: []
  cancel: []
}>()

const formRef = ref()

const rentalItems = computed(() => {
  return props.rentals.map(rental => ({
    label: `#${rental.id} - ${rental.vehicleName}`,
    subtitle: `${rental.customerName} • ${rental.startDate} to ${rental.endDate}`,
    value: rental.id,
  }))
})

const paymentMethodOptions = [
  { title: 'Credit Card', value: 'credit-card' },
  { title: 'Debit Card', value: 'debit-card' },
  { title: 'Cash', value: 'cash' },
  { title: 'Bank Transfer', value: 'bank-transfer' },
  { title: 'Other', value: 'other' },
]

const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Completed', value: 'completed' },
  { title: 'Failed', value: 'failed' },
]

const updateField = (field: keyof PaymentFormData, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  })
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (valid) {
    emit('submit')
  }
}
</script>
