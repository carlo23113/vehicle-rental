<template>
  <CommonFilterSection :model-value="modelValue" :filters="filters" @update:model-value="$emit('update:modelValue', $event)" @clear="$emit('clear')">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by invoice number or customer..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select
          v-model="filters.status"
          :items="statusOptions"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-file-document"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select
          v-model="filters.paymentStatus"
          :items="paymentStatusOptions"
          variant="outlined"
          density="comfortable"
          label="Payment"
          :prepend-inner-icon="getCurrencyIcon()"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select
          :model-value="dateRange"
          :items="dateRangeOptions"
          variant="outlined"
          density="comfortable"
          label="Date Range"
          prepend-inner-icon="mdi-calendar-range"
          clearable
          @update:model-value="$emit('update:dateRange', $event)"
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
const { getCurrencyIcon } = useCurrency()

defineProps<{
  modelValue: boolean
  filters: any
  dateRange?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:dateRange': [value: string]
  clear: []
}>()

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Draft', value: 'draft' },
  { title: 'Sent', value: 'sent' },
  { title: 'Paid', value: 'paid' },
  { title: 'Overdue', value: 'overdue' },
  { title: 'Cancelled', value: 'cancelled' },
]

const paymentStatusOptions = [
  { title: 'All Payments', value: 'all' },
  { title: 'Pending', value: 'pending' },
  { title: 'Paid', value: 'paid' },
  { title: 'Partial', value: 'partial' },
  { title: 'Overdue', value: 'overdue' },
]

const dateRangeOptions = [
  { title: 'All Time', value: 'all' },
  { title: 'This Month', value: 'this-month' },
  { title: 'Last Month', value: 'last-month' },
  { title: 'Last 3 Months', value: 'last-3-months' },
  { title: 'This Year', value: 'this-year' },
]
</script>
