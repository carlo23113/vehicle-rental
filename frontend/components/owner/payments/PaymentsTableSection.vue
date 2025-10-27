<template>
  <v-row>
    <v-col cols="12">
      <PaymentsTable
        :payments="displayedItems"
        :format-date="formatDate"
        :format-currency="formatCurrency"
        :get-status-color="getStatusColor"
        :get-method-icon="getMethodIcon"
        :get-method-label="getMethodLabel"
        @process="$emit('process', $event)"
        @refund="$emit('refund', $event)"
        @view="$emit('view', $event)"
        @print="$emit('print', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more payments...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Payment } from '~/types/payment'

defineProps<{
  displayedItems: Payment[]
  isLoadingMore: boolean
  formatDate: (date: string) => string
  formatCurrency: (amount: number) => string
  getStatusColor: (status: string) => string
  getMethodIcon: (method: string) => string
  getMethodLabel: (method: string) => string
}>()

defineEmits<{
  process: [payment: Payment]
  refund: [payment: Payment]
  view: [payment: Payment]
  print: [payment: Payment]
}>()
</script>
