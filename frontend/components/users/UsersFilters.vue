<template>
  <CommonFilterSection v-model="modelValue" :filters="filters" @clear="handleClear">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by name, email, or phone..."
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filters.role"
          :items="USER_ROLE_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Role"
          prepend-inner-icon="mdi-account-tie"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filters.status"
          :items="USER_STATUS_OPTIONS"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-check-circle"
          clearable
        />
      </v-col>
    </v-row>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '~/constants/filterOptions'

const modelValue = defineModel<boolean>()

const filters = defineModel<{
  search: string
  role: string
  status: string
}>('filters', { required: true })

const emit = defineEmits<{
  clear: []
}>()

const handleClear = () => {
  emit('clear')
}
</script>
