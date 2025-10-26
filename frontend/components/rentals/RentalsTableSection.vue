<template>
  <v-row>
    <v-col cols="12">
      <RentalsTable
        :rentals="rentals"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
        :get-payment-status-color="getPaymentStatusColor"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @generate-invoice="$emit('generate-invoice', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more rentals...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  rentals: any[]
  isLoadingMore: boolean
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  getPaymentStatusColor: (status: string) => string
}>()

defineEmits<{
  view: [rental: any]
  edit: [rental: any]
  delete: [rental: any]
  'generate-invoice': [rental: any]
}>()
</script>
