<template>
  <CommonFilterSection :model-value="modelValue" :filters="filters" @update:model-value="$emit('update:modelValue', $event)" @clear="$emit('clear')">
    <v-row dense>
      <v-col cols="12" md="4">
        <v-select
          :model-value="filters.type"
          :items="typeOptions"
          label="Type"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-tag"
          clearable
          @update:model-value="$emit('update:type', $event)"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          :model-value="filters.status"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-check-circle"
          clearable
          @update:model-value="$emit('update:status', $event)"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          :model-value="filters.priority"
          :items="priorityOptions"
          label="Priority"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-alert"
          clearable
          @update:model-value="$emit('update:priority', $event)"
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  filters: {
    type: string | null
    status: string | null
    priority: string | null
  }
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'update:type': [value: string | null]
  'update:status': [value: string | null]
  'update:priority': [value: string | null]
  clear: []
}>()

const typeOptions = [
  { title: 'Rental', value: 'rental' },
  { title: 'Maintenance', value: 'maintenance' },
  { title: 'Customer', value: 'customer' },
  { title: 'Payment', value: 'payment' },
  { title: 'System', value: 'system' },
]

const statusOptions = [
  { title: 'Unread', value: 'unread' },
  { title: 'Read', value: 'read' },
]

const priorityOptions = [
  { title: 'High', value: 'high' },
  { title: 'Medium', value: 'medium' },
  { title: 'Low', value: 'low' },
]
</script>
