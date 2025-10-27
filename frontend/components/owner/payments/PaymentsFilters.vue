<template>
  <CommonFilterSection v-model="modelValue" :filters="filters" @clear="handleClear">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by customer or transaction..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="filters.status"
          :items="PAYMENT_STATUS_OPTIONS_EXTENDED"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-check-circle"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="filters.method"
          :items="PAYMENT_METHOD_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Method"
          prepend-inner-icon="mdi-credit-card"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="filters.dateRange"
          :items="DATE_RANGE_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Date Range"
          prepend-inner-icon="mdi-calendar-range"
          clearable
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { PAYMENT_STATUS_OPTIONS_EXTENDED, PAYMENT_METHOD_OPTIONS, DATE_RANGE_OPTIONS } from '~/constants/filterOptions'

const modelValue = defineModel<boolean>()

const filters = defineModel<{
  search: string
  status: string
  method: string
  dateRange: string
}>('filters', { required: true })

const emit = defineEmits<{
  clear: []
}>()

const handleClear = () => {
  emit('clear')
}
</script>
