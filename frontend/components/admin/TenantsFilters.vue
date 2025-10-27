<template>
  <CommonFilterSection v-model:show-filters="localShowFilters">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="localFilters.search"
          label="Search tenants"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          placeholder="Search by name, email, contact..."
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="localFilters.status"
          label="Status"
          :items="statusOptions"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="localFilters.plan"
          label="Plan"
          :items="planOptions"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>
    </v-row>

    <template #actions>
      <v-btn variant="outlined" color="primary" @click="$emit('clear')">
        <v-icon start>mdi-filter-off</v-icon>
        Clear Filters
      </v-btn>
    </template>
  </CommonFilterSection>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TenantFilters } from '~/types/tenant'

interface Props {
  showFilters: boolean
  filters: TenantFilters
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:showFilters': [value: boolean]
  'update:filters': [value: TenantFilters]
  clear: []
}>()

const localShowFilters = ref(props.showFilters)
const localFilters = ref<TenantFilters>({ ...props.filters })

watch(
  () => props.showFilters,
  (newValue) => {
    localShowFilters.value = newValue
  }
)

watch(
  () => props.filters,
  (newValue) => {
    localFilters.value = { ...newValue }
  },
  { deep: true }
)

watch(
  localShowFilters,
  (newValue) => {
    emit('update:showFilters', newValue)
  }
)

watch(
  localFilters,
  (newValue) => {
    emit('update:filters', newValue)
  },
  { deep: true }
)

const statusOptions = [
  { title: 'All Status', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Suspended', value: 'suspended' },
  { title: 'Trial', value: 'trial' },
]

const planOptions = [
  { title: 'All Plans', value: 'all' },
  { title: 'Starter', value: 'starter' },
  { title: 'Professional', value: 'professional' },
  { title: 'Enterprise', value: 'enterprise' },
  { title: 'Custom', value: 'custom' },
]
</script>
