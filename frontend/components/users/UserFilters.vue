<template>
  <CommonPageFilters
    title="Filters"
    subtitle="Refine your user search"
    icon="mdi-filter-variant"
  >
    <v-row dense>
      <v-col cols="12" md="5">
        <v-text-field
          :model-value="filters.search"
          variant="outlined"
          density="comfortable"
          placeholder="Search by name, email, phone, or department..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          rounded="lg"
          class="search-field"
          @update:model-value="$emit('update:search', $event)"
        />
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-select
          :model-value="filters.role"
          :items="roleOptions"
          variant="outlined"
          density="comfortable"
          label="Role"
          prepend-inner-icon="mdi-account-tie"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:role', $event)"
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          :model-value="filters.status"
          :items="statusOptions"
          variant="outlined"
          density="comfortable"
          label="Status"
          prepend-inner-icon="mdi-check-circle"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:status', $event)"
        />
      </v-col>
      <v-col cols="12" sm="4" md="2">
        <v-select
          :model-value="filters.department"
          :items="departmentOptions"
          variant="outlined"
          density="comfortable"
          label="Department"
          prepend-inner-icon="mdi-office-building"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:department', $event)"
        />
      </v-col>
    </v-row>
  </CommonPageFilters>
</template>

<script setup lang="ts">
interface Filters {
  search: string
  role: string
  status: string
  department: string
}

defineProps<{
  filters: Filters
  roleOptions: Array<{ title: string; value: string }>
  statusOptions: Array<{ title: string; value: string }>
  departmentOptions: Array<{ title: string; value: string }>
}>()

defineEmits<{
  'update:search': [value: string]
  'update:role': [value: string]
  'update:status': [value: string]
  'update:department': [value: string]
}>()
</script>
