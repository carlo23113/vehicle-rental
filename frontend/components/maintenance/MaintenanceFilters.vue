<template>
  <CommonFilterSection v-model="modelValue" :filters="filters" @clear="handleClear">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by vehicle or description..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="filters.type"
          :items="MAINTENANCE_TYPE_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Type"
          prepend-inner-icon="mdi-wrench"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="filters.status"
          :items="MAINTENANCE_STATUS_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-check-circle"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="filters.priority"
          :items="MAINTENANCE_PRIORITY_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Priority"
          prepend-inner-icon="mdi-alert"
          clearable
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { MAINTENANCE_TYPE_OPTIONS, MAINTENANCE_STATUS_OPTIONS, MAINTENANCE_PRIORITY_OPTIONS } from '~/constants/filterOptions'

const modelValue = defineModel<boolean>()

const filters = defineModel<{
  search: string
  type: string
  status: string
  priority: string
}>('filters', { required: true })

const emit = defineEmits<{
  clear: []
}>()

const handleClear = () => {
  emit('clear')
}
</script>
