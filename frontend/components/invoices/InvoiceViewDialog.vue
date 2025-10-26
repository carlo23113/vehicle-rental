<template>
  <v-dialog :model-value="modelValue" max-width="900" scrollable @update:model-value="$emit('update:modelValue', $event)">
    <v-card v-if="invoice">
      <v-card-title class="pa-4 d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">Invoice {{ invoice.invoiceNumber }}</span>
        <v-btn variant="text" icon="mdi-close" @click="$emit('update:modelValue', false)" />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-0">
        <div id="invoice-preview" class="pa-6">
          <InvoiceTemplate :invoice="invoice" :company-info="companyInfo" print-mode />
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-btn variant="text" prepend-icon="mdi-download" @click="$emit('download', invoice)">
          Download PDF
        </v-btn>
        <v-btn variant="text" prepend-icon="mdi-printer" @click="$emit('print', invoice)">
          Print
        </v-btn>
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">Close</v-btn>
        <v-btn
          v-if="invoice.status !== 'sent'"
          color="info"
          variant="flat"
          prepend-icon="mdi-send"
          @click="$emit('send', invoice)"
        >
          Send Email
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Invoice } from '~/types/invoice'

defineProps<{
  modelValue: boolean
  invoice: Invoice | null
  companyInfo: any
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  download: [invoice: Invoice]
  print: [invoice: Invoice]
  send: [invoice: Invoice]
}>()
</script>
