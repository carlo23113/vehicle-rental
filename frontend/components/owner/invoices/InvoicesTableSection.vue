<template>
  <v-row>
    <v-col cols="12">
      <InvoicesTable
        :invoices="displayedItems"
        @view="$emit('view', $event)"
        @download="$emit('download', $event)"
        @send="$emit('send', $event)"
        @mark-paid="$emit('mark-paid', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more invoices...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Invoice } from '~/types/invoice'

defineProps<{
  displayedItems: Invoice[]
  isLoadingMore: boolean
}>()

defineEmits<{
  view: [invoice: Invoice]
  download: [invoice: Invoice]
  send: [invoice: Invoice]
  'mark-paid': [invoice: Invoice]
}>()
</script>
