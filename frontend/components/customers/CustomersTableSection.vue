<template>
  <v-row>
    <v-col cols="12">
      <CustomersTable
        :customers="customers"
        :get-status-color="getStatusColor"
        :get-full-name="getFullName"
        :get-initials="getInitials"
        :format-date="formatDate"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />

      <!-- Loading indicator for progressive loading -->
      <div v-if="isLoadingMore" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p class="text-caption text-medium-emphasis mt-2">Loading more customers...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  customers: any[]
  isLoadingMore: boolean
  getStatusColor: (status: string) => string
  getFullName: (customer: any) => string
  getInitials: (customer: any) => string
  formatDate: (date: string) => string
}>()

defineEmits<{
  view: [customer: any]
  edit: [customer: any]
  delete: [customer: any]
}>()
</script>
