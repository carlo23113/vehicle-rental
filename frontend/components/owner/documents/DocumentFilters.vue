<template>
  <CommonFilterSection :model-value="modelValue" :filters="filters" @update:model-value="$emit('update:modelValue', $event)" @clear="$emit('clear')">
    <v-row dense>
      <v-col cols="12" md="5">
        <v-text-field
          v-model="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by name, document number..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filters.status"
          :items="statusOptions"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-check-circle"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="filters.type"
          :items="typeOptions"
          variant="outlined"
          density="comfortable"
          label="Document Type"
          prepend-inner-icon="mdi-file-document"
          clearable
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { DOCUMENT_TYPE_CONFIG } from '~/types/document'

defineProps<{
  modelValue: boolean
  filters: any
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  clear: []
}>()

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Pending', value: 'pending' },
  { title: 'Verified', value: 'verified' },
  { title: 'Rejected', value: 'rejected' },
  { title: 'Expired', value: 'expired' },
]

const typeOptions = [
  { title: 'All Types', value: 'all' },
  ...Object.entries(DOCUMENT_TYPE_CONFIG).map(([key, config]) => ({
    title: config.label,
    value: key,
  })),
]
</script>
